import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: '.', testMatch: /opening-home-ready\.spec\.mjs/, timeout: 35000,
  expect: { timeout: 12000 }, retries: 0, workers: 1, reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:4174', serviceWorkers: 'block', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [
    { name: 'home-desktop', use: { ...devices['Desktop Chrome'], channel: 'chrome' } },
    { name: 'home-mobile', use: { ...devices['Pixel 7'], channel: 'chrome' } }
  ],
  webServer: { command: 'node serve-opening-home.mjs', url: 'http://127.0.0.1:4174/login/', reuseExistingServer: false }
});
