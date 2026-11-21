// Harbor Lights — the entry program (Node 22, standard library only).
// It hands the game in: game/ and screenshots/ are copied from beside this
// file into the output directory, and /output/dossier.json is written with
// the vendored make.fun library, exactly as the gate rebuilds it.
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function mirror(sourceName) {
  const from = join(repoRoot, sourceName);
  const to = join(outDir, sourceName);
  mkdirSync(to, { recursive: true });
  if (existsSync(from)) cpSync(from, to, { recursive: true });
}

mkdirSync(outDir, { recursive: true });
mirror('game');
mirror('screenshots');

// The caps the sealed scorer enforces: 4 screenshots at most 256 KiB each,
// game/ at most 993 files and 48 MiB, paths at most 1000 bytes, and the
// dossier text capped at 160 KiB.
const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);
