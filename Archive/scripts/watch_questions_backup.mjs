import { watch, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..', '..');
const bankPaths = [
  path.join(projectRoot, 'data', 'questions.json'),
  path.join(projectRoot, 'data', 'questions_170.json'),
  path.join(projectRoot, 'data', 'questions_cca.json'),
].filter((p) => existsSync(p));

let timer = null;

async function runBackup() {
  const mod = await import('./backup_questions.mjs');
  if (typeof mod?.default === 'function') {
    await mod.default();
    return;
  }
  // backup_questions.mjs runs immediately when imported, so no-op here.
}

console.log(`Watching for changes: ${bankPaths.join(', ')}`);
console.log('Tip: leave this running while you edit questions; it creates timestamped backups automatically.');

for (const p of bankPaths) {
  watch(p, { persistent: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      import('./backup_questions.mjs').catch((err) => console.error(err));
    }, 500);
  });
}
