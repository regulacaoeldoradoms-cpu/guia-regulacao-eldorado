// Run with NODE_PATH pointing to a directory containing playwright and pdf-lib.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const server = require('./server.cjs');
(async () => {
  const browser = await chromium.launch();
  try {
    for (const viewport of [{width:1280,height:900},{width:390,height:844}]) {
      const page = await browser.newPage({viewport});
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto('http://127.0.0.1:8765/worker/tests/browser/viewer.html');
      await page.getByRole('button', {name:'Run regression suite'}).click();
      await page.waitForFunction(() => document.getElementById('results').textContent.includes('DONE'));
      const result = await page.locator('#results').innerText();
      console.log(viewport.width, result);
      assert.ok(!result.includes('FAIL'), result);
      assert.deepEqual(errors, []);
      assert.equal(await page.locator('iframe,embed,object').count(),0);
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>server.close());
