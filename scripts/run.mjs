import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
if (existsSync('.env.local')) process.loadEnvFile('.env.local');
const require = createRequire(import.meta.url);
const command = process.argv[2] ?? 'dev';
if (!['dev', 'start', 'build'].includes(command)) throw new Error('Unbekannter Startmodus.');
const args = [
  require.resolve('next/dist/bin/next'),
  command,
  ...(command === 'build' ? [] : ['--hostname', '127.0.0.1']),
  ...process.argv.slice(3),
];
const child = spawn(process.execPath, args, {
  stdio: 'inherit',
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
});
child.on('exit', (code) => {
  process.exitCode = code ?? 1;
});
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
