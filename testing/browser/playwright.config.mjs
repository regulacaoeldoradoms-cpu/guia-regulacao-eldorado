import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const remoteBaseURL = String(process.env.CENTRAL_DOCS_BASE_URL || '').replace(/\/$/, '');
const browserExecutable = String(process.env.CENTRAL_DOCS_BROWSER_PATH || '');
const recordVideo = process.env.CENTRAL_DOCS_DISABLE_VIDEO !== '1';

export default defineConfig({
  testDir: '.',
  testMatch: /central-docs-.*\.spec\.mjs/,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  retries: 1,
  workers: 1,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: remoteBaseURL || 'http://127.0.0.1:4173',
    launchOptions: browserExecutable ? { executablePath: browserExecutable } : {},
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: recordVideo ? 'retain-on-failure' : 'off'
  },
  projects: [
    { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'chromium-mobile', use: { ...devices['Pixel 7'] } }
  ],
  webServer: remoteBaseURL ? undefined : {
    command: 'node ../../scripts/build-central-docs-staging.mjs && node serve-staging.mjs',
    cwd: here,
    url: 'http://127.0.0.1:4173/',
    reuseExistingServer: false,
    timeout: 30_000
  }
});
