import { defineConfig, devices } from '@playwright/test';
const outputDir=process.env.DARK_AUDIT_OUTPUT_DIR||'test-results-dark-audit';
// Use the full browser's new headless implementation on both platforms.
// An unspecified Linux channel selects the separate chromium-headless-shell.
const browserChannel={channel:process.platform==='win32'?'chrome':'chromium'};
export default defineConfig({
  metadata:{syntheticOnly:true,localOrigin:'http://127.0.0.1:4176',browserChannel:browserChannel.channel,headlessImplementation:'full-browser',reportOnly:process.env.DARK_AUDIT_REPORT_ONLY==='1',compareBase:process.env.DARK_AUDIT_COMPARE_BASE==='1'},
  testDir: '.', testMatch: /(?:^|[\\/])portal-dark-[^\\/]*\.spec\.mjs$/, timeout: 45_000,
  expect: { timeout: 10_000 }, retries: 0, workers: 1,
  outputDir,
  reporter: [['list'], ['json', { outputFile:`${outputDir}/results.json` }]],
  use: {
    baseURL: 'http://127.0.0.1:4176', serviceWorkers:'block',
    trace:process.env.DARK_AUDIT_TRACE==='1'?'retain-on-failure':'off', screenshot:'only-on-failure',
    // Repeated identical source/DOM produced different blur pixels with GPU and
    // optimized Skia paths. Software rasterization retains real CSS/filters and
    // exact comparisons; independent capture stability is still required.
    launchOptions: { args: ['--disable-gpu', '--disable-skia-runtime-opts', '--disable-background-networking', '--disable-component-update', '--disable-sync', '--no-pings', '--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1, EXCLUDE localhost'] }
  },
  projects: [
    { name:'dark-desktop', use:{ ...devices['Desktop Chrome'], ...browserChannel, viewport:{ width:1440, height:1000 } } },
    { name:'dark-mobile', use:{ ...devices['Pixel 7'], ...browserChannel } }
  ],
  webServer: { command:'node serve-dark-audit.mjs', url:'http://127.0.0.1:4176/login/', reuseExistingServer:process.env.DARK_AUDIT_REUSE_LOCAL==='1', timeout:20_000 }
});
