import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from '@playwright/test';

// Reproduce both supported GitHub Pages source settings at a repository base path.
for (const source of ['root', 'docs']) {
  test(`Pages entry: ${source} source opens the interactive report, not README`, async () => {
    const directory = source === 'root' ? resolve('.') : resolve('docs');
    assert(existsSync(resolve(directory, 'index.html')), `${source}: missing Pages index.html`);
    assert(existsSync(resolve(directory, '.nojekyll')), `${source}: missing static-site marker`);
    const html = readFileSync(resolve(directory, 'index.html'), 'utf8');
    const server = createServer((request, response) => {
      if (new URL(request.url, 'http://localhost').pathname !== '/Organizational-Analysis/') {
        response.writeHead(404).end();
        return;
      }
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      response.end(html);
    });
    await new Promise((done) => server.listen(0, '127.0.0.1', done));
    const browser = await chromium.launch({
      executablePath: process.env.ORGLENS_CHROMIUM ?? '/usr/bin/chromium',
      headless: true,
    });
    try {
      const page = await browser.newPage({
        viewport: { width: 1440, height: 1000 },
        acceptDownloads: true,
      });
      const result = await page.goto(
        `http://127.0.0.1:${server.address().port}/Organizational-Analysis/`,
      );
      assert.equal(result.status(), 200);
      await page
        .getByRole('heading', { name: 'OrgLens · Fiktiver Beispielbericht', exact: true })
        .waitFor();
      assert.equal(
        await page.getByRole('heading', { name: 'Lokal starten', exact: true }).count(),
        0,
      );
      await page.getByRole('img', { name: /STAR-Bewertung/ }).waitFor();
      if (process.env.ORGLENS_CAPTURE_PAGES === '1') {
        mkdirSync('docs/evidence/BUG-001', { recursive: true });
        await page.screenshot({
          path: `docs/evidence/BUG-001/${source}-desktop.png`,
          fullPage: true,
        });
      }
      await page.setViewportSize({ width: 390, height: 844 });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      if (process.env.ORGLENS_CAPTURE_PAGES === '1') {
        await page.screenshot({
          path: `docs/evidence/BUG-001/${source}-mobile.png`,
          fullPage: true,
        });
      }
      await page.locator('#F-01 a[href="#source-PS-01"]').click();
      await page.locator('#source-PS-01').waitFor({ state: 'visible' });
      await page
        .getByRole('button', { name: 'Anforderungsmanagement etablieren nach oben' })
        .click();
      assert.equal(
        await page.locator('#backlog > article').first().getAttribute('data-id'),
        'E-02',
      );
      const pending = page.waitForEvent('download');
      await page.getByRole('button', { name: 'Priorisierung als Datei speichern' }).click();
      assert.equal((await pending).suggestedFilename(), 'orglens-priorisierung.json');
    } finally {
      await browser.close();
      await new Promise((done) => server.close(done));
    }
  });
}
