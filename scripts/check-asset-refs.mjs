/**
 * Confere que todo caminho de /images ou /videos citado no código existe em
 * `public/`. Roda depois de mexer em assets — renomear um arquivo e esquecer
 * uma referência gera um 404 silencioso que só aparece em produção.
 *
 *   node scripts/check-asset-refs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const SOURCE_DIRS = ["app", "components", "lib"];
const REFERENCE = /["'`](\/(?:images|videos)\/[^"'`]+)["'`]/g;

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (/\.(tsx?|jsx?|mjs|css)$/.test(entry.name)) out.push(p);
  }
  return out;
}

/**
 * Existe com ESTE nome exato, maiúsculas incluídas?
 *
 * `fs.existsSync` não serve: no Windows o filesystem é case-insensitive e
 * `show-6.JPG` responde por `show-6.jpg`. A Vercel roda em Linux, onde não —
 * é assim que um asset passa no local e dá 404 só em produção. Por isso a
 * checagem compara contra a listagem real do diretório.
 */
const listingCache = new Map();
function existsExact(fullPath) {
  const dir = path.dirname(fullPath);
  if (!listingCache.has(dir)) {
    listingCache.set(dir, fs.existsSync(dir) ? new Set(fs.readdirSync(dir)) : new Set());
  }
  return listingCache.get(dir).has(path.basename(fullPath));
}

const missing = [];
let checked = 0;

for (const file of SOURCE_DIRS.flatMap((d) => walk(d))) {
  const text = fs.readFileSync(file, "utf8");
  for (const match of text.matchAll(REFERENCE)) {
    const ref = match[1];
    // Ignora o que é montado em tempo de execução (template literal).
    if (ref.includes("${")) continue;
    checked += 1;
    if (!existsExact(path.join("public", ref))) {
      missing.push({ file: file.split(path.sep).join("/"), ref });
    }
  }
}

/**
 * O disco estar certo não basta: o que a Vercel publica é o que está no git.
 * Um asset renomeado que ficou sem `git add` funciona no local e some em
 * produção — foi assim que `casamento-1.jpg` e companhia caíram lá.
 */
let untracked = [];
try {
  const tracked = new Set(
    execSync("git ls-files public/images public/videos", { encoding: "utf8" })
      .trim()
      .split("\n")
      .filter(Boolean)
  );
  const referenced = new Set();
  for (const file of SOURCE_DIRS.flatMap((d) => walk(d))) {
    const text = fs.readFileSync(file, "utf8");
    for (const match of text.matchAll(REFERENCE)) {
      if (!match[1].includes("${")) referenced.add("public" + match[1]);
    }
  }
  untracked = [...referenced].filter((r) => !tracked.has(r)).sort();
} catch {
  console.warn("aviso: não foi possível consultar o git — checagem parcial.");
}

if (missing.length || untracked.length) {
  if (missing.length) {
    console.error(`\n${missing.length} referência(s) sem arquivo no disco:\n`);
    for (const m of missing) console.error(`  ${m.file}  ->  ${m.ref}`);
  }
  if (untracked.length) {
    console.error(
      `\n${untracked.length} arquivo(s) referenciados mas FORA do git ` +
        `(vão dar 404 em produção):\n`
    );
    for (const u of untracked) console.error(`  ${u}`);
    console.error(`\n  Corrija com:  git add -A public/`);
  }
  process.exit(1);
}

console.log(
  `OK — ${checked} referências verificadas: existem no disco e estão no git.`
);
