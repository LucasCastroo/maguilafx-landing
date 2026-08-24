/**
 * Gera as imagens de `public/images` a partir dos masters em `media-src/images`.
 *
 * Os originais vinham direto da câmera/exportador: PNGs de 15 MB com 4600 px de
 * largura. O next/image entrega versões otimizadas ao usuário, mas gerar cada
 * tamanho a partir de um arquivo desses é caro (primeira requisição lenta, muita
 * memória) e o peso ainda conta no repositório e no deploy.
 *
 *   node scripts/optimize-images.mjs --dry     lista o que faria
 *   node scripts/optimize-images.mjs           aplica
 *
 * Ler de uma pasta e escrever em outra é o que torna o script repetível: rodar
 * duas vezes produz exatamente o mesmo resultado, sem recomprimir a própria
 * saída (JPEG sobre JPEG perde qualidade a cada passada).
 *
 * Fotos viram JPEG — a extensão muda, e `scripts/check-asset-refs.mjs` acusa
 * qualquer referência esquecida. Só continua PNG o que tem transparência real.
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const SRC = "media-src/images";
const OUT = "public/images";
const MAX_EDGE = 2560;
const JPEG_QUALITY = 82;
const dryRun = process.argv.includes("--dry");

if (!fs.existsSync(SRC)) {
  console.error(
    `Masters não encontrados em ${SRC}/.\n` +
      `São os originais em alta, mantidos fora do deploy (veja .gitignore).`
  );
  process.exit(1);
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const posix = (p) => p.split(path.sep).join("/");

/** Um canal alpha totalmente opaco não justifica manter PNG. */
async function hasRealAlpha(source, meta) {
  if (!meta.hasAlpha) return false;
  const stats = await sharp(source).extractChannel(3).stats();
  return stats.channels[0].min < 250;
}

const results = [];
let sizeBefore = 0;
let sizeAfter = 0;

for (const file of walk(SRC).sort()) {
  const source = fs.readFileSync(file);
  sizeBefore += source.length;

  let meta;
  try {
    meta = await sharp(source).metadata();
  } catch {
    console.log(`  ignorado (não é imagem): ${posix(file)}`);
    continue;
  }

  const keepPng = await hasRealAlpha(source, meta);
  const relative = path.relative(SRC, file);
  const ext = path.extname(relative);
  const target = path.join(
    OUT,
    relative.slice(0, -ext.length) + (keepPng ? ".png" : ".jpg")
  );

  const oversized = Math.max(meta.width, meta.height) > MAX_EDGE;
  const pipeline = sharp(source).rotate();
  if (oversized) {
    pipeline.resize({
      width: meta.width >= meta.height ? MAX_EDGE : null,
      height: meta.height > meta.width ? MAX_EDGE : null,
      withoutEnlargement: true,
    });
  }

  let buffer = keepPng
    ? await pipeline.png({ compressionLevel: 9 }).toBuffer()
    : await pipeline
        // Fundo do site, para o caso de um alpha residual virar preto puro.
        .flatten({ background: "#070708" })
        .jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true })
        .toBuffer();

  // Master já pequeno e no formato de destino: reencodar só perderia qualidade.
  const sameFormat = keepPng === (meta.format === "png");
  if (buffer.length >= source.length && sameFormat && !oversized) {
    buffer = source;
  }

  sizeAfter += buffer.length;
  results.push({
    from: posix(relative),
    to: posix(path.relative(OUT, target)),
    before: source.length,
    after: buffer.length,
    dims: `${meta.width}x${meta.height}`,
  });

  if (!dryRun) {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, buffer);
  }
}

const mb = (n) => (n / 1048576).toFixed(2);
for (const r of results) {
  const renamed = r.from !== r.to ? `  =>  ${path.basename(r.to)}` : "";
  console.log(
    `${mb(r.before).padStart(7)} -> ${mb(r.after).padStart(6)} MB  ` +
      `${r.dims.padEnd(11)}  ${r.from}${renamed}`
  );
}

console.log(
  `\n${dryRun ? "[SIMULACAO] " : ""}TOTAL: ${mb(sizeBefore)} MB -> ` +
    `${mb(sizeAfter)} MB  (-${(100 - (sizeAfter / sizeBefore) * 100).toFixed(1)}%)`
);

// Arquivos em public/images que este script não produz mais — tipicamente
// sobra de uma execução anterior com outra regra de formato.
if (!dryRun && fs.existsSync(OUT)) {
  const expected = new Set(results.map((r) => posix(path.join(OUT, r.to))));
  const stale = walk(OUT)
    .map(posix)
    // Os posters de vídeo vêm do ffmpeg, não daqui.
    .filter((f) => !f.includes("/posters/") && !expected.has(f));

  if (stale.length) {
    console.log(`\nSobras de execuções anteriores (${stale.length}):`);
    for (const f of stale) console.log(`  ${f}`);
    console.log("Remova manualmente se confirmar que não são usadas.");
  }
}
