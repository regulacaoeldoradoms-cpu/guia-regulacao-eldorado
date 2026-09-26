import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: ['studies-reader.spec.mjs', 'studies-application.spec.mjs', 'studies-operators-insurance.spec.mjs', 'studies-payments-review.spec.mjs'],
  fullyParallel: true,
  workers: 2,
  retries: 0,
  timeout: 30000,
  reporter: [['list']],
  outputDir: 'test-results/studies-reader',
  use: { browserName: 'chromium', serviceWorkers: 'block', reducedMotion: 'reduce', trace: 'retain-on-failure' }
});
