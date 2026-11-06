import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { demoProject } from '../src/domain/demo';
import { renderReport } from '../src/domain/report';

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
for (const directory of ['.', 'docs']) {
  mkdirSync(resolve(directory), { recursive: true });
  writeFileSync(resolve(directory, 'index.html'), html);
  writeFileSync(resolve(directory, '.nojekyll'), '');
}
console.log('GitHub-Pages-Demo erstellt: index.html und docs/index.html (nur fiktive Daten).');
