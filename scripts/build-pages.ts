import { mkdirSync, writeFileSync, readdirSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { demoProject } from '../src/domain/demo';
import { renderReport } from '../src/domain/report';
import { build } from 'esbuild';

// Deliberately no store/auth imports: a public demo must never read local project data.
const project = demoProject();
project.id = 'orglens-public-demo';
project.name = 'OrgLens · Fiktiver Beispielbericht';
project.starRatings = project.starRatings.map((rating) => ({
  ...rating,
  current: 2,
  target: 3,
  rationale:
    'Fiktive Demo-Skala 1–4 mit manuell gesetzten Beispielwerten. Keine echte Kundenbewertung und kein validierter STAR-Maßstab.',
}));
const html = renderReport(project).replace(
  '<main>',
  '<main><p class="notice"><strong>Öffentliche Berichtsdemo mit ausschließlich fiktiven Daten.</strong> Dies ist der interaktive Ergebnisbericht, nicht die Berater-App. Login, Dateiimport, KI und lokale Datenbank sind hier nicht verfügbar.</p>',
);
async function main() {
  const result = await build({
    entryPoints: ['src/demo/entry.tsx'],
    bundle: true,
    write: false,
    outfile: 'frontend.js',
    minify: true,
    platform: 'browser',
    target: ['es2022'],
    define: { 'process.env.NODE_ENV': '"production"' },
    metafile: true,
    legalComments: 'eof',
  });
  if (Object.keys(result.metafile!.inputs).some((path) => path.includes('src/server/'))) {
    throw new Error('Servermodule dürfen nicht Bestandteil der öffentlichen Demo sein.');
  }
  const outputs = result.outputFiles.map((output) => ({
    name: `frontend.${createHash('sha256').update(output.contents).digest('hex').slice(0, 12)}.${output.path.endsWith('.css') ? 'css' : 'js'}`,
    contents: output.contents,
  }));
  const script = outputs.find((output) => output.name.endsWith('.js'))!.name;
  const stylesheet = outputs.find((output) => output.name.endsWith('.css'))!.name;
  const markup = `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#1c4b91"><meta name="description" content="OrgLens Studio – interaktive Frontend-Demo für Organisationsanalyse mit ausschließlich fiktiven Daten."><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'none'; base-uri 'none'; form-action 'none'"><title>OrgLens Studio · Interaktive Frontend-Demo</title><link rel="stylesheet" href="./assets/${stylesheet}"></head><body><div id="root"></div><noscript>Diese interaktive Frontend-Demo benötigt JavaScript. <a href="./report.html">Statischen Beispielbericht öffnen</a>.</noscript><script src="./assets/${script}" defer></script></body></html>`;
  for (const directory of ['.', 'docs']) {
    mkdirSync(resolve(directory, 'assets'), { recursive: true });
    for (const file of readdirSync(resolve(directory, 'assets'))) {
      if (/^frontend(?:\.[a-f0-9]{12})?\.(js|css)$/.test(file))
        rmSync(resolve(directory, 'assets', file));
    }
    writeFileSync(resolve(directory, 'index.html'), markup);
    writeFileSync(resolve(directory, 'report.html'), html);
    writeFileSync(resolve(directory, '.nojekyll'), '');
    for (const output of outputs) {
      writeFileSync(resolve(directory, 'assets', output.name), output.contents);
    }
  }
  console.log(
    'Statische React-Frontend-Demo für / und /docs erstellt; Beispielbericht unter report.html. Keine Servermodule im Bundle.',
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
