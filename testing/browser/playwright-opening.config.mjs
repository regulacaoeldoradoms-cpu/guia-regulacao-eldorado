import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const chromeUse = {
  channel: 'chrome',
  launchOptions: { args: ['--autoplay-policy=no-user-gesture-required'] }
};

export default defineConfig({
  testDir: '.',
  testMatch: /post-login-opening\.spec\.mjs/,
  timeout: 35_000,
  expect: { timeout: 10_000 },
  retries: 1,
  workers: 1,
  reporter: [['list'], ['html', { outputFolder: 'playwright-opening-report', open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    { name: 'chrome-desktop-opening', use: { ...devices['Desktop Chrome'], ...chromeUse } },
    { name: 'chrome-mobile-opening', use: { ...devices['Pixel 7'], ...chromeUse } }
  ],
  webServer: {
    command: 'node ../../scripts/build-central-docs-staging.mjs && node serve-staging.mjs',
    cwd: here,
    url: 'http://127.0.0.1:4173/',
    reuseExistingServer: false,
    timeout: 30_000
  }
});
