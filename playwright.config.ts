import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: false,
  workers: 1,
  timeout: 60000,
  use: {
    baseURL: 'http://127.0.0.1:3100',
    headless: true,
    viewport: { width: 1440, height: 1000 },
    launchOptions: { executablePath: process.env.ORGLENS_CHROMIUM ?? '/usr/bin/chromium' },
    trace: 'retain-on-failure',
  },
  reporter: [['list']],
  webServer: {
    command: 'node --import tsx tests/start-server.ts',
    url: 'http://127.0.0.1:3100/api/health',
    reuseExistingServer: false,
    timeout: 30000,
  },
});
