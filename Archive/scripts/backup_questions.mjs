import { copyFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function formatTimestamp(d = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return (
    String(d.getFullYear()) +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    '-' +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

async function main() {
  const projectRoot = path.resolve(__dirname, '..', '..');
  const backupsDir = path.join(projectRoot, 'backups');

  const sources = [
    path.join(projectRoot, 'data', 'questions.json'),
    path.join(projectRoot, 'data', 'questions_170.json'),
    path.join(projectRoot, 'data', 'questions_cca.json'),
  ];

  await mkdir(backupsDir, { recursive: true });

  const ts = formatTimestamp();

  let didBackup = false;
  for (const src of sources) {
    try {
      await stat(src);
    } catch {
      continue;
    }

    const base = path.basename(src, '.json');
    const dest = path.join(backupsDir, `${base}.${ts}.json`);
    const latest = path.join(backupsDir, `${base}.latest.json`);

    await copyFile(src, dest);
    await copyFile(src, latest);
    didBackup = true;
    console.log(`Backed up ${path.relative(projectRoot, src)} -> ${path.relative(projectRoot, dest)}`);
  }

  if (!didBackup) {
    console.error('Backup skipped: no question bank files found.');
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
