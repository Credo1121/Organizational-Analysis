import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { parseCsv, replaceTerms, detectedTerms, fingerprint } from '../src/domain/csv';
import { validateProject, emptyProject } from '../src/domain/schema';
import { demoProject } from '../src/domain/demo';
import { renderReport } from '../src/domain/report';
import {
  readProject,
  saveProject,
  replaceProject,
  pseudonyms,
  database,
  meta,
} from '../src/server/store';

process.env.ORGLENS_DATA_DIR = mkdtempSync(join(tmpdir(), 'orglens-domain-'));
test('CSV: BOM, semicolon, quoted separators, multiline and escaped quotes', () => {
  const result = parseCsv('\uFEFFid;text\r\nPS-1;"Text; mit Trennung\nund ""Zitat"""\r\n');
  assert.deepEqual(result.rows, [{ id: 'PS-1', text: 'Text; mit Trennung\nund "Zitat"' }]);
  assert.throws(() => parseCsv('id;id\na;b'), /eindeutig/);
  assert.throws(() => parseCsv('id;text\na'), /Zeile 2/);
  assert.throws(() => parseCsv('id;text\na;"offen'), /geschlossen/);
});
test('Pseudonymization: explicit people, email, phone, case-insensitive literal replacement', async () => {
  const rows = [
    {
      person: 'Anna Beispiel',
      text: 'ANNA BEISPIEL meldet anna@example.test unter +49 1234 567890.',
    },
  ];
  const terms = detectedTerms(rows, 'person', 'Vertraulicher Name');
  assert(terms.includes('Anna Beispiel'));
  assert(terms.includes('anna@example.test'));
  assert(terms.some((x) => x.includes('1234')));
  assert.equal(
    replaceTerms('Anna Beispiel und a.b', { 'Anna Beispiel': 'INT-01', 'a.b': 'INT-02' }),
    'INT-01 und INT-02',
  );
  assert.equal(replaceTerms('ANNA BEISPIEL', { 'Anna Beispiel': 'INT-01' }), 'INT-01');
  assert.equal(replaceTerms('a+b [c] $x', { 'a+b': 'A', '[c]': 'B', $x: 'C' }), 'A B C');
  assert.equal(
    await fingerprint('Anna Beispiel', 'test-key'),
    await fingerprint('ANNA BEISPIEL', 'test-key'),
  );
  assert.notEqual(
    await fingerprint('Anna Beispiel', 'test-key'),
    await fingerprint('Anna Beispiel', 'other-key'),
  );
});
test('Validation rejects missing references, ungrounded releases, cycles and fabricated ratings', () => {
  const p = demoProject();
  assert.equal(validateProject(p).findings.length, 3);
  let bad = structuredClone(p);
  bad.findings[0].statementIds = ['UNKNOWN'];
  assert.throws(() => validateProject(bad), /Quellenverknüpfung/);
  bad = structuredClone(p);
  bad.findings[0].statementIds = [];
  assert.throws(() => validateProject(bad), /ohne Belege/);
  bad = structuredClone(p);
  bad.recommendations[0].dependencies = ['E-02'];
  assert.throws(() => validateProject(bad), /Zyklische/);
  bad = structuredClone(p);
  bad.starRatings[0].current = 2;
  assert.throws(() => validateProject(bad), /Bewertungsgrundlage/);
  bad = structuredClone(p);
  bad.processes[0].current = 5;
  assert.throws(() => validateProject(bad));
});
test('Report escapes active input and excludes unreleased content and internal assessment notes', () => {
  const p = demoProject();
  p.statements[0].text = '<img src=x onerror=alert(1)><script>window.pwn=1</script>';
  p.findings.push({
    ...p.findings[0],
    id: 'F-HIDDEN',
    title: 'HIDDEN_PRIVATE_TITLE',
    observation: 'HIDDEN_OBSERVATION',
    released: false,
  });
  p.findings[0].assessmentNote =
    'Internal note to be excluded unless customer assessment role exists';
  const html = renderReport(p);
  assert(html.includes('&lt;script&gt;'));
  assert(!html.includes('<img src=x'));
  assert(!html.includes('HIDDEN_PRIVATE_TITLE'));
  assert(!html.includes('HIDDEN_OBSERVATION'));
  assert(!html.includes(p.findings[0].assessmentNote));
  assert(html.includes("connect-src 'none'"));
  assert(!/<(?:script|link)[^>]+(?:src|href)="https?:/.test(html));
});
test('SQLite preserves versions, rejects stale writes atomically and keeps stable pseudonyms without names', () => {
  const before = readProject();
  const imported = saveProject({ ...before, name: 'Testprojekt' }, before.version);
  assert.equal(readProject().name, 'Testprojekt');
  assert.throws(
    () => saveProject({ ...imported, name: 'Verlorener Stand' }, before.version),
    /geändert/,
  );
  assert.equal(readProject().name, 'Testprojekt');
  const fp = 'a'.repeat(64);
  const first = pseudonyms([fp]);
  assert.equal(first[fp], pseudonyms([fp])[fp]);
  assert(
    !readFileSync(join(process.env.ORGLENS_DATA_DIR!, 'orglens.sqlite')).includes(
      Buffer.from('Anna Beispiel'),
    ),
  );
  const key = meta('import-key');
  const restored = replaceProject(
    { ...emptyProject(), name: 'Wiederhergestellt' },
    imported.version,
  );
  assert.equal(readProject().name, 'Wiederhergestellt');
  assert.notEqual(restored.id, imported.id);
  assert.notEqual(meta('import-key'), key);
  assert.equal(
    (database().prepare('SELECT COUNT(*) AS n FROM identities').get() as { n: number }).n,
    0,
  );
});
test('A separate fresh process restores the saved project from SQLite', () => {
  const expected = readProject();
  const result = spawnSync(
    process.execPath,
    [
      '--import',
      'tsx',
      '-e',
      "const {readProject}=require('./src/server/store.ts');process.stdout.write(JSON.stringify(readProject()));",
    ],
    { cwd: process.cwd(), env: process.env, encoding: 'utf8' },
  );
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), expected);
});
