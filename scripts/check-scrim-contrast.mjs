/**
 * Mede o contraste do texto do "Sobre" sobre o vídeo em loop.
 *
 * O véu é um gradiente sobre imagem em movimento, então "parece legível" não
 * basta: um quadro com chama estourada pode derrubar o contraste num ponto
 * específico. Este script amostra quadros reais do vídeo, compõe o véu por
 * cima na altura correspondente e calcula a razão de contraste WCAG.
 *
 *   node scripts/check-scrim-contrast.mjs
 *
 * Requer os quadros já extraídos em media-src/frames-about/ (veja o comando
 * ffmpeg no README do script, ou rode com --extract se o ffmpeg estiver no PATH).
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const FRAMES_DIR = "media-src/frames-about";
const TEXT = { r: 0xf4, g: 0xf1, b: 0xea }; // --bone
const BG = { r: 0x07, g: 0x07, b: 0x08 }; // --ink, cor do véu

/** Paradas do LOOP_SCRIM: [posicao de baixo para cima, alpha]. */
const SCRIM_STOPS = [
  [0.0, 0.93],
  [0.2, 0.86],
  [0.48, 0.74],
  [0.74, 0.82],
  [1.0, 0.9],
];

/** Opacidades de texto realmente usadas no AboutContent. */
const TEXT_LAYERS = [
  { nome: "titulo (bone 100%)", alpha: 1.0, grande: true },
  { nome: "corpo (bone 80%)", alpha: 0.8, grande: false },
  { nome: "diferenciais (bone 85%)", alpha: 0.85, grande: false },
  { nome: "kicker (bone 70%)", alpha: 0.7, grande: false },
];

const srgbToLinear = (c) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
};

const luminance = ({ r, g, b }) =>
  0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);

const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/** Mistura `fg` sobre `bg` com opacidade `alpha`. */
const over = (fg, bg, alpha) => ({
  r: fg.r * alpha + bg.r * (1 - alpha),
  g: fg.g * alpha + bg.g * (1 - alpha),
  b: fg.b * alpha + bg.b * (1 - alpha),
});

/** Alpha do véu numa altura (0 = base da seção, 1 = topo). */
function scrimAlphaAt(pos) {
  for (let i = 0; i < SCRIM_STOPS.length - 1; i++) {
    const [p0, a0] = SCRIM_STOPS[i];
    const [p1, a1] = SCRIM_STOPS[i + 1];
    if (pos >= p0 && pos <= p1) {
      const t = (pos - p0) / (p1 - p0);
      return a0 + (a1 - a0) * t;
    }
  }
  return SCRIM_STOPS[SCRIM_STOPS.length - 1][1];
}

if (!fs.existsSync(FRAMES_DIR)) {
  console.error(`Quadros não encontrados em ${FRAMES_DIR}/.`);
  console.error(`Extraia com:`);
  console.error(
    `  ffmpeg -i public/videos/about-720.mp4 -vf fps=4,scale=320:-2 ${FRAMES_DIR}/f%03d.png`
  );
  process.exit(1);
}

const frames = fs.readdirSync(FRAMES_DIR).filter((f) => /\.(png|jpe?g)$/i.test(f));
if (!frames.length) {
  console.error(`Nenhum quadro em ${FRAMES_DIR}/.`);
  process.exit(1);
}

const BANDS = 10; // faixas horizontais, da base ao topo
const piorPorCamada = new Map(TEXT_LAYERS.map((l) => [l.nome, { ratio: Infinity }]));

for (const file of frames) {
  const img = sharp(path.join(FRAMES_DIR, file));
  const { width, height } = await img.metadata();
  const bandH = Math.max(1, Math.floor(height / BANDS));

  for (let b = 0; b < BANDS; b++) {
    const top = b * bandH;
    const stats = await sharp(path.join(FRAMES_DIR, file))
      .extract({ left: 0, top, width, height: Math.min(bandH, height - top) })
      .stats();

    // Percentil alto em vez da media: o que derruba o contraste e o ponto
    // claro (a chama), nao a media do quadro.
    const brilho = {
      r: stats.channels[0].mean + 2 * stats.channels[0].stdev,
      g: stats.channels[1].mean + 2 * stats.channels[1].stdev,
      b: stats.channels[2].mean + 2 * stats.channels[2].stdev,
    };
    const clamp = (v) => Math.min(255, Math.max(0, v));
    const pico = { r: clamp(brilho.r), g: clamp(brilho.g), b: clamp(brilho.b) };

    // Posicao vertical: banda 0 = topo da imagem = pos 1 no gradiente
    const pos = 1 - (b + 0.5) / BANDS;
    const fundo = over(BG, pico, scrimAlphaAt(pos));

    for (const camada of TEXT_LAYERS) {
      const cor = over(TEXT, fundo, camada.alpha);
      const ratio = contrast(cor, fundo);
      const atual = piorPorCamada.get(camada.nome);
      if (ratio < atual.ratio) {
        piorPorCamada.set(camada.nome, { ratio, file, banda: b, pos, camada });
      }
    }
  }
}

console.log(`Quadros analisados: ${frames.length} | faixas por quadro: ${BANDS}\n`);
console.log("Pior caso de cada camada de texto sobre o vídeo + véu:\n");

let falhou = false;
for (const [nome, r] of piorPorCamada) {
  const minimo = r.camada.grande ? 3.0 : 4.5;
  const ok = r.ratio >= minimo;
  if (!ok) falhou = true;
  console.log(
    `  ${nome.padEnd(26)} ${r.ratio.toFixed(2).padStart(6)}:1   ` +
      `(minimo WCAG AA ${minimo}) ${ok ? "OK" : "ABAIXO"}   ` +
      `[${r.file}, altura ${(r.pos * 100).toFixed(0)}%]`
  );
}

console.log(
  `\n${falhou ? "Alguma camada ficou abaixo do AA — aumente o alpha do véu." : "Todas as camadas passam no WCAG AA."}`
);
process.exit(falhou ? 1 : 0);
