import { test, expect } from '@playwright/test';
import { installAuditFixture } from './dark-audit-fixture.mjs';
import { inspectSurfaces } from './dark-audit-surfaces.mjs';
import { writeFile } from 'node:fs/promises';
import { selectedAuditRoutes, aliasDestinations } from './dark-audit-routes.mjs';
import { finishAuditNetwork } from './dark-audit-network.mjs';
for (const route of selectedAuditRoutes) {
  test(`computed surfaces ${route}`, async ({ page, context }, info) => {
    const network=await installAuditFixture(context,{authenticated:!['/login/','/cadastro/'].includes(route),userOverrides:route==='/estudos/'?{username:'wellyton',name:'Pessoa Fictícia Auditoria'}:{}});
    const response=await page.goto(route,{waitUntil:'load'});
    expect(response.status()).toBe(200);
    await page.waitForTimeout(700);
    const expectedRoute=aliasDestinations[route]||route;
    expect(new URL(page.url()).pathname,'An unexpected auth redirect does not count as route coverage').toBe(expectedRoute);
    const reports=[];
    for (const [theme,media] of [['dark','screen'],['light','screen'],['dark','print']]) {
      await page.evaluate(theme=>window.PortalTheme?.apply(theme),theme);
      await page.emulateMedia({media});
      await page.waitForTimeout(100);
      const report=await inspectSurfaces(page); reports.push(report);
      await writeFile(info.outputPath(`${theme}-${media}.json`),JSON.stringify(report,null,2));
      await info.attach(`${theme}-${media}.json`,{body:Buffer.from(JSON.stringify(report,null,2)),contentType:'application/json'});
      await page.screenshot({path:info.outputPath(`${theme}-${media}.png`),fullPage:true,animations:'disabled',caret:'hide'});
    }
    await finishAuditNetwork(info,network,{route:expectedRoute});
    // The report-only mode is explicit for baseline collection. Acceptance is strict.
    if(process.env.DARK_AUDIT_REPORT_ONLY!=='1') {
      expect(reports[0].bright, 'Bright application surfaces: inspect dark-screen.json for selectors and matching CSS sources').toEqual([]);
    }
  });
}
