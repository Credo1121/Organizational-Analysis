import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { configurePassword } from '../src/server/auth';
process.env.ORGLENS_DATA_DIR = mkdtempSync(join(tmpdir(), 'orglens-browser-'));
configurePassword('SyntheticTestOnly-2026');
const child = spawn(process.execPath, ['scripts/run.mjs', 'start', '--port', '3100'], {
  stdio: 'inherit',
  env: process.env,
});
child.on('exit', (code) => {
  process.exitCode = code ?? 1;
});
for (const signal of ['SIGINT', 'SIGTERM'] as const) process.on(signal, () => child.kill(signal));
