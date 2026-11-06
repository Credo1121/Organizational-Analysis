import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from '@playwright/test';

for (const source of ['root', 'docs']) {
  test(
    `Pages ${source}: frontend navigation, edits, priorities and fixed report`,
    { timeout: 30000 },
    async () => {
      const directory = source === 'root' ? resolve('.') : resolve('docs');
      for (const file of ['index.html', '.nojekyll', 'report.html'])
        assert(existsSync(resolve(directory, file)), `${source}: ${file} missing`);
      const prefix = '/Organizational-Analysis/';
      const allowed = new Set(['index.html', 'report.html']);
      const server = createServer((request, response) => {
        const path = new URL(request.url, 'http://localhost').pathname;
        const file = path.startsWith(prefix) ? path.slice(prefix.length) || 'index.html' : '';
        if (!allowed.has(file) && !/^assets\/frontend\.[a-f0-9]{12}\.(js|css)$/.test(file)) {
          response.writeHead(404).end();
          return;
        }
        response.writeHead(200, {
          'Content-Type': file.endsWith('.js')
            ? 'text/javascript'
            : file.endsWith('.css')
              ? 'text/css'
              : 'text/html; charset=utf-8',
        });
        response.end(readFileSync(resolve(directory, file)));
      });
      await new Promise((done) => server.listen(0, '127.0.0.1', done));
      const browser = await chromium.launch({
        executablePath: process.env.ORGLENS_CHROMIUM ?? '/usr/bin/chromium',
        headless: true,
      });
      try {
        const page = await browser.newPage({
          viewport: { width: 1440, height: 1050 },
          acceptDownloads: true,
        });
        const errors = [];
        const apiCalls = [];
        page.on('pageerror', (error) => errors.push(error.message));
        page.on('request', (request) => {
          if (request.url().includes('/api/')) apiCalls.push(request.url());
        });
        const base = `http://127.0.0.1:${server.address().port}${prefix}`;
        await page.goto(base);
        await page
          .getByRole('heading', { name: 'Aus Perspektiven wird Klarheit.', exact: true })
          .waitFor();
        assert.equal(
          await page.getByRole('heading', { name: 'Lokal starten', exact: true }).count(),
          0,
        );
        await page.getByRole('group', { name: /STAR-Profil/ }).waitFor();
        await page.getByRole('button', { name: 'Dimension Prozesse öffnen', exact: true }).focus();
        await page.keyboard.press('Enter');
        assert.equal(await page.locator('.d-dimension h2').innerText(), 'Prozesse');
        await page.getByRole('button', { name: 'Dimension Strategie öffnen', exact: true }).focus();
        await page.keyboard.press('Enter');
        const capture = async (name, fullPage = true) => {
          if (process.env.ORGLENS_CAPTURE_PAGES !== '1' || source !== 'root') return;
          mkdirSync('docs/evidence/CHG-005', { recursive: true });
          await page.screenshot({ path: `docs/evidence/CHG-005/${name}.png`, fullPage });
        };
        const mobileCapture = async (name) => {
          await page.setViewportSize({ width: 390, height: 844 });
          assert(
            await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
            `${name}: horizontal page overflow`,
          );
          await capture(name);
          await page.setViewportSize({ width: 1440, height: 1050 });
        };
        await capture('overview-desktop');
        await page.setViewportSize({ width: 390, height: 844 });
        assert(
          await page
            .locator('.d-sidebar')
            .evaluate((el) => el.getBoundingClientRect().right <= 0.5),
          'Closed mobile navigation must not cover the page',
        );
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        await capture('overview-mobile');
        await page.getByRole('button', { name: 'Navigation öffnen', exact: true }).click();
        await page.getByRole('link', { name: /Findings & Cluster/ }).click();
        await page
          .getByRole('heading', { name: 'Die Themen hinter den Aussagen.', exact: true })
          .waitFor();
        await capture('findings-mobile');
        await page.setViewportSize({ width: 1440, height: 1050 });
        await capture('findings-desktop');
        await page.getByLabel('Findings suchen').fill('does-not-exist');
        await page
          .getByRole('heading', { name: 'Keine passenden Findings', exact: true })
          .waitFor();
        await page.getByLabel('Findings suchen').fill('');
        await page
          .getByRole('button', {
            name: 'Operative Last verdrängt Portfolioarbeit bearbeiten',
            exact: true,
          })
          .click();
        await page.getByLabel('Titel', { exact: true }).fill('Operative Last gemeinsam reduzieren');
        await capture('editor-desktop', false);
        await page.setViewportSize({ width: 390, height: 844 });
        await capture('editor-mobile', false);
        await page.getByRole('button', { name: 'Änderungen speichern', exact: true }).click();
        await page.reload();
        await page
          .getByRole('button', { name: 'Operative Last gemeinsam reduzieren', exact: true })
          .waitFor();
        await page.setViewportSize({ width: 1440, height: 1050 });
        await page
          .getByRole('button', { name: 'Operative Last gemeinsam reduzieren', exact: true })
          .click();
        assert.equal(await page.locator('.d-inspector-source').count(), 2);
        await capture('finding-detail', false);
        await page.keyboard.press('Escape');
        await page.getByRole('link', { name: 'Innen / Außen', exact: true }).click();
        await page
          .getByRole('heading', { name: 'Gleiche Organisation. Andere Perspektiven.', exact: true })
          .waitFor();
        await capture('perspectives-desktop');
        await mobileCapture('perspectives-mobile');
        await page.getByRole('link', { name: 'Prozesse & RACI', exact: true }).click();
        await page.getByRole('button', { name: /Abkündigung/ }).click();
        await capture('processes-desktop');
        await mobileCapture('processes-mobile');
        await page.getByRole('link', { name: 'Empfehlungen', exact: true }).click();
        await page
          .getByRole('button', { name: 'Anforderungsmanagement etablieren', exact: true })
          .click();
        await page
          .getByLabel('Erwartetes Ergebnis')
          .fill('Gemeinsam vereinbarte Übergabekriterien im Pilotfall prüfen.');
        await page.getByRole('button', { name: 'Änderungen speichern', exact: true }).click();
        assert(
          await page
            .getByText('Gemeinsam vereinbarte Übergabekriterien im Pilotfall prüfen.', {
              exact: true,
            })
            .isVisible(),
        );
        await page
          .getByRole('button', { name: 'Anforderungsmanagement etablieren nach oben', exact: true })
          .focus();
        await page.keyboard.press('Enter');
        assert.equal(await page.locator('.d-backlog-item').first().getAttribute('data-id'), 'E-02');
        await capture('recommendations-desktop');
        await mobileCapture('recommendations-mobile');
        await page.getByRole('link', { name: 'Zielbild', exact: true }).click();
        await page.getByLabel('Zielanteil Operativ').focus();
        await page.keyboard.press('ArrowRight');
        const total = await page
          .locator('.d-sliders input')
          .evaluateAll((inputs) => inputs.reduce((sum, input) => sum + Number(input.value), 0));
        assert.equal(total, 100);
        await capture('target-desktop');
        await mobileCapture('target-mobile');
        await page.getByRole('link', { name: 'Daten & Quellen', exact: true }).click();
        await page.getByLabel('Quellen suchen').fill('Werkskundendienst');
        assert.equal(await page.locator('.d-source-table tbody tr').count(), 1);
        await page.getByLabel('Quellen suchen').fill('');
        await capture('sources-desktop');
        await mobileCapture('sources-mobile');
        await page.getByRole('link', { name: /Berichtsvorschau/ }).click();
        await page
          .getByRole('heading', { name: 'Eine Geschichte, die Zusammenhänge zeigt.', exact: true })
          .waitFor();
        await capture('report-preview');
        await mobileCapture('report-preview-mobile');
        const [report] = await Promise.all([
          page.waitForEvent('popup'),
          page
            .getByRole('link', { name: 'Bisherigen HTML-Beispielbericht öffnen', exact: true })
            .click(),
        ]);
        await report
          .getByRole('heading', { name: 'OrgLens · Fiktiver Beispielbericht', exact: true })
          .waitFor();
        await report.locator('#F-01 a[href="#source-PS-01"]').click();
        await report.locator('#source-PS-01').waitFor({ state: 'visible' });
        await report
          .getByRole('button', { name: 'Anforderungsmanagement etablieren nach oben' })
          .click();
        const pending = report.waitForEvent('download');
        await report.getByRole('button', { name: 'Priorisierung als Datei speichern' }).click();
        assert.equal((await pending).suggestedFilename(), 'orglens-priorisierung.json');
        await page.getByRole('link', { name: 'Überblick', exact: true }).click();
        await page
          .getByRole('button', { name: 'STAR-Bewertungen bearbeiten', exact: true })
          .click();
        await capture('ratings-editor', false);
        await page.getByLabel('Ist Strategie', { exact: true }).selectOption('');
        await page.getByLabel('Ziel Strategie', { exact: true }).selectOption('');
        await page.getByRole('button', { name: 'Bewertungen speichern', exact: true }).click();
        await page.reload();
        await page
          .getByRole('heading', { name: 'Aus Perspektiven wird Klarheit.', exact: true })
          .waitFor();
        assert((await page.locator('.d-rating').innerText()).includes('–'));
        await page.getByRole('button', { name: 'Demo zurücksetzen', exact: true }).click();
        await page
          .locator('dialog')
          .getByRole('button', { name: 'Demo zurücksetzen', exact: true })
          .click();
        assert.equal((await page.locator('.d-rating').innerText()).replace(/\s/g, ''), '2/4');
        assert.deepEqual(apiCalls, [], 'Static demo must not call backend APIs');
        assert.deepEqual(errors, [], 'No browser runtime errors');
      } finally {
        await browser.close();
        await new Promise((done) => server.close(done));
      }
    },
  );
}
