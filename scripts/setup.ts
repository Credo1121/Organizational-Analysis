import { createInterface } from 'node:readline/promises';
import { Writable } from 'node:stream';
import { existsSync } from 'node:fs';
import { configurePassword } from '../src/server/auth';
import { dataDirectory, meta } from '../src/server/store';

async function main() {
  if (existsSync('.env.local')) process.loadEnvFile('.env.local');
  if (meta('password') && !process.argv.includes('--reset')) {
    console.log(
      'Lokaler Zugang ist bereits eingerichtet. Zum bewussten Zurücksetzen: npm run setup:local -- --reset',
    );
    return;
  }
  let password = process.env.ORGLENS_SETUP_PASSWORD;
  if (!password) {
    process.stdout.write('Lokales Passwort (mindestens 12 Zeichen, Eingabe verborgen): ');
    const silent = new Writable({
      write(_chunk, _encoding, callback) {
        callback();
      },
    });
    const rl = createInterface({ input: process.stdin, output: silent, terminal: true });
    password = await rl.question('');
    rl.close();
    process.stdout.write('\n');
  }
  configurePassword(password);
  console.log(`Lokaler Zugang eingerichtet. Datenverzeichnis: ${dataDirectory()}`);
}
main().catch(() => {
  console.error(
    'Einrichtung fehlgeschlagen. Mindestens 12 Zeichen und ein beschreibbares Datenverzeichnis außerhalb des Repositorys erforderlich.',
  );
  process.exitCode = 1;
});
