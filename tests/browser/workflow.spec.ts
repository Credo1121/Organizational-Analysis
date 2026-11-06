import { test, expect } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const evidence = resolve('docs/evidence/CHG-002');
const origin = 'http://127.0.0.1:3100';
test('complete local consulting workflow, privacy, report and priority exchange', async ({
  page,
  request,
  browser,
}) => {
  mkdirSync(evidence, { recursive: true });
  expect((await request.get('/api/project')).status()).toBe(401);
  expect((await request.post('/api/demo', { data: {} })).status()).toBe(403);
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Willkommen zurück.' })).toBeVisible();
  await page.getByLabel('Lokales Passwort').fill('SyntheticTestOnly-2026');
  await page.getByRole('button', { name: /Arbeitsbereich öffnen/ }).click();
  await expect(page.getByRole('heading', { name: 'Organisation verstehen.' })).toBeVisible();
  await page.getByRole('button', { name: /Fiktive Demo laden/ }).click();
  await expect(page.getByRole('heading', { name: 'Was bewegt das Team?' })).toBeVisible();
  await page.getByRole('button', { name: /Bewertungen bearbeiten/ }).click();
  for (const fieldset of await page.locator('dialog fieldset').all()) {
    await fieldset.getByLabel('Ist', { exact: true }).selectOption('2');
    await fieldset.getByLabel('Ziel', { exact: true }).selectOption('3');
    await fieldset
      .getByLabel('Bewertungsmaßstab, Begründung und Quelle')
      .fill('Fiktive Demo-Skala 1–4; manuell gesetzte Beispielwerte, keine echte Kundenbewertung.');
  }
  await page.getByRole('button', { name: 'Bewertungen speichern' }).click();
  await expect(page.locator('dialog')).toHaveCount(0);
  await page.screenshot({ path: resolve(evidence, 'app-overview-desktop.png'), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: resolve(evidence, 'app-overview-mobile.png'), fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole('button', { name: /Findings & Cluster/ }).click();
  await page.getByRole('button', { name: 'Bearbeiten →' }).first().click();
  await page.getByLabel('Titel', { exact: true }).fill('Operative Last gemeinsam reduzieren');
  await page.screenshot({
    path: resolve(evidence, 'app-finding-editor-desktop.png'),
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: resolve(evidence, 'app-finding-editor-mobile.png'),
    fullPage: true,
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole('button', { name: 'Änderungen speichern' }).click();
  await expect(page.locator('dialog')).toHaveCount(0);
  await page.reload();
  await expect(page.getByText('Operative Last gemeinsam reduzieren').first()).toBeVisible();
  await page.getByRole('button', { name: /Daten & Quellen/ }).click();
  await page.getByRole('button', { name: '+ CSV importieren' }).click();
  const csv =
    'id;text;interview;department;perspective;topic\nPS-PII;Anna Beispiel meldet anna@example.test zur Artikelpflege.;Anna Beispiel;Produktmanagement;Innen;Kapazität';
  await page
    .getByLabel('CSV-Datei · maximal 2 MiB')
    .setInputFiles({ name: 'synthetisch.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) });
  await page.getByRole('button', { name: /Zeilen bereinigen und prüfen/ }).click();
  await expect(
    page.getByRole('heading', { name: '3. Bereinigte Vorschau manuell prüfen' }),
  ).toBeVisible();
  expect(await page.getByLabel('Problemtext PS-PII').inputValue()).not.toContain('Anna');
  expect(await page.getByLabel('Problemtext PS-PII').inputValue()).not.toContain('@');
  await expect(page.getByRole('button', { name: 'Bereinigte Daten übernehmen' })).toBeDisabled();
  await page.screenshot({ path: resolve(evidence, 'app-import-review.png'), fullPage: true });
  await page.getByLabel('Ich habe alle bereinigten Inhalte geprüft').check();
  await page.getByRole('button', { name: 'Bereinigte Daten übernehmen' }).click();
  await expect(page.getByText('Bereinigte Daten erfolgreich importiert.')).toBeVisible();
  await page.getByRole('button', { name: /Prozesse & RACI/ }).click();
  await page.screenshot({ path: resolve(evidence, 'app-raci.png'), fullPage: true });
  await page.getByRole('button', { name: /Daten & Quellen/ }).click();
  await page.getByRole('button', { name: '+ CSV importieren' }).click();
  await page.getByLabel('Datentyp').selectOption('processes');
  await page
    .getByLabel('CSV-Datei · maximal 2 MiB')
    .setInputFiles(resolve('public/samples/raci.csv'));
  await page.getByRole('button', { name: /Zeilen bereinigen und prüfen/ }).click();
  await page.getByLabel('Ich habe alle bereinigten Inhalte geprüft').check();
  await page.getByRole('button', { name: 'Bereinigte Daten übernehmen' }).click();
  await expect(page.getByText('Bereinigte Daten erfolgreich importiert.')).toBeVisible();
  await page.getByRole('button', { name: /Empfehlungen/ }).click();
  await page.getByRole('button', { name: 'Anforderungsmanagement etablieren bearbeiten' }).click();
  await page.getByLabel('Erwartetes Ergebnis').fill('Abgestimmte Übergaben im Piloten überprüfen.');
  await page.getByRole('button', { name: 'Änderungen speichern' }).click();
  await expect(page.locator('dialog')).toHaveCount(0);
  await page
    .getByRole('button', { name: /Ergebnisbericht/ })
    .first()
    .click();
  await expect(page.getByRole('button', { name: /HTML-Bericht herunterladen/ })).toBeDisabled();
  await page.getByLabel('Ich habe die Inhalte geprüft und gebe').check();
  const reportEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: /HTML-Bericht herunterladen/ }).click();
  const report = await reportEvent;
  const reportPath = resolve(evidence, 'demo-report.html');
  await report.saveAs(reportPath);
  const html = readFileSync(reportPath, 'utf8');
  expect(html).not.toContain('Anna Beispiel');
  expect(html).not.toContain('anna@example.test');
  const fileContext = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    acceptDownloads: true,
  });
  const reportPage = await fileContext.newPage();
  let requests = 0;
  reportPage.on('request', (r) => {
    if (/^https?:/.test(r.url())) requests++;
  });
  await fileContext.setOffline(true);
  await reportPage.setContent(html);
  await expect(reportPage.getByRole('heading', { name: 'Zentrale Handlungsfelder' })).toBeVisible();
  await reportPage.screenshot({ path: resolve(evidence, 'report-desktop.png'), fullPage: true });
  await reportPage.setViewportSize({ width: 390, height: 844 });
  await reportPage.screenshot({ path: resolve(evidence, 'report-mobile.png'), fullPage: true });
  expect(await reportPage.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
    true,
  );
  expect(requests).toBe(0);
  await reportPage.locator('#F-01 a[href="#source-PS-01"]').click();
  await expect(reportPage.locator('#source-PS-01')).toBeVisible();
  await reportPage
    .getByRole('button', { name: 'Anforderungsmanagement etablieren nach oben' })
    .click();
  await expect(reportPage.locator('#dirty')).toContainText('geändert');
  const priorityEvent = reportPage.waitForEvent('download');
  await reportPage.getByRole('button', { name: 'Priorisierung als Datei speichern' }).click();
  const priority = await priorityEvent;
  const priorityPath = resolve(evidence, 'demo-priorities.json');
  await priority.saveAs(priorityPath);
  await page.getByRole('button', { name: /Empfehlungen/ }).click();
  await page.getByLabel('Priorisierungsdatei').setInputFiles(priorityPath);
  await page.getByRole('button', { name: 'Reihenfolge bewusst übernehmen' }).click();
  await expect(page.getByText('Priorisierung übernommen.')).toBeVisible();
  await expect(page.locator('.recommendation-main .title-button').first()).toHaveText(
    'Anforderungsmanagement etablieren',
  );
  await page.screenshot({ path: resolve(evidence, 'app-priorities-desktop.png'), fullPage: true });
  const contextRequest = page.request;
  const headers = { origin };
  const data = JSON.parse(readFileSync(priorityPath, 'utf8'));
  expect((await contextRequest.post('/api/priorities', { data, headers })).status()).toBe(200);
  expect(
    (
      await contextRequest.post('/api/priorities', {
        data: { ...data, projectId: 'foreign' },
        headers,
      })
    ).status(),
  ).toBe(409);
  let current = await (await contextRequest.get('/api/project')).json();
  const stale = structuredClone(current);
  current = await (
    await contextRequest.put('/api/project', { data: { ...current, name: current.name }, headers })
  ).json();
  expect((await contextRequest.post('/api/priorities', { data, headers })).status()).toBe(409);
  expect((await contextRequest.put('/api/project', { data: stale, headers })).status()).toBe(409);
  expect(
    (
      await contextRequest.post('/api/import', {
        data: {
          version: current.version,
          confirmed: true,
          statements: [current.statements[0]],
          processes: [],
        },
        headers,
      })
    ).status(),
  ).toBe(409);
  const backup = await (await contextRequest.get('/api/backup')).json();
  expect(backup.statements).toHaveLength(6);
  expect(JSON.stringify(backup)).not.toContain('Anna Beispiel');
  expect(
    (
      await contextRequest.post('/api/restore', {
        data: { version: current.version, confirmed: true, project: backup },
        headers,
      })
    ).status(),
  ).toBe(200);
  await page.reload();
  await expect(page.getByText('Operative Last gemeinsam reduzieren').first()).toBeVisible();
  const status = await (await contextRequest.get('/api/gateway')).json();
  expect(status.available).toBe(false);
  await page.getByRole('button', { name: /Abmelden/ }).click();
  await expect(page.getByRole('heading', { name: 'Willkommen zurück.' })).toBeVisible();
  expect((await contextRequest.get('/api/project')).status()).toBe(401);
  await fileContext.close();
});
