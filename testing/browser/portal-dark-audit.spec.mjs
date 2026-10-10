import { test, expect } from '@playwright/test';
import { installAuditFixture } from './dark-audit-fixture.mjs';
import { inspectSurfaces } from './dark-audit-surfaces.mjs';
import { writeFile } from 'node:fs/promises';
import { selectedAuditRoutes, aliasDestinations } from './dark-audit-routes.mjs';
import { finishAuditNetwork } from './dark-audit-network.mjs';

test('Home initials mask classification retains bright-surface regressions',async({page})=>{
  await page.route('**/*',route=>route.fulfill({contentType:'text/html',body:'<html data-portal-theme="dark"><body data-portal-home-bootstrap class="citizen-readable-layout home-social-mobile"></body></html>'}));
  await page.goto('/');
  await page.evaluate(()=>{
    const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><text x="18" y="18" text-anchor="middle" dominant-baseline="central" font-family="Arial, sans-serif" font-size="13" font-weight="700" fill="#000">AB</text></svg>';
    const mask=value=>`url("data:image/svg+xml,${encodeURIComponent(value)}")`;
    const style=document.createElement('style');
    style.textContent=`html,body{background:#101820;color:white}.avatar{position:relative;display:block;width:36px;height:36px;background:#172432}.avatar::after,.before::before{content:'';position:absolute;inset:0;background:white;mask:var(--mask) center / 100% 100% no-repeat}#white-base,#panel{background:white}#unmasked::after{mask:none}#oversized::after{width:80px;height:80px}#wide::after{width:80px;height:10px}#scaled::after{mask-size:1000% 1000%}#before::after{display:none}#comment{box-sizing:border-box;width:50px;height:50px;border:1px solid}#chat{width:56px;height:56px}#chat::after{mask-size:36px 36px}`;
    document.head.append(style);
    for(const id of ['initials','white-base','unmasked','rectangle','modified','unmarked','outside','oversized','wide','scaled','before','multiple','chat','comment']){
      const el=document.createElement('div');el.id=id;el.textContent='AB';
      el.className=`avatar ${id==='outside'?'unrelated-avatar':id==='chat'?'portal-chat-avatar':id==='comment'?'social-avatar':'home-composer-avatar'} ${id==='before'?'before':''}`;
      if(id!=='unmarked')el.dataset.homeAvatarInitials='true';
      const image=id==='rectangle'?svg.replace(/<text[\s\S]*<\/text>/,'<rect width="36" height="36"/>'):id==='modified'?svg.replace('</svg>','<rect width="36" height="36"/></svg>'):svg;
      el.style.setProperty('--mask',id==='multiple'?`${mask(image)},${mask(image)}`:mask(image));
      if(id==='chat'){const root=document.createElement('section');root.id='portalChatRoot';root.append(el);document.body.append(root);}
      else if(id==='comment'){const feed=document.createElement('section');feed.id='socialFeedList';const comment=document.createElement('article');comment.className='social-comment';comment.append(el);feed.append(comment);document.body.append(feed);}
      else document.body.append(el);
    }
    const panel=document.createElement('div');panel.id='panel';panel.textContent='Synthetic bright panel';document.body.append(panel);
  });
  const report=await inspectSurfaces(page);
  expect(report.allowed.map(({selector,pseudo})=>selector+pseudo).sort()).toEqual(['#chat::after','#comment::after','#initials::after','#white-base::after']);
  expect(report.bright.map(({selector,pseudo})=>selector+pseudo).sort()).toEqual(['#before::before','#modified::after','#multiple::after','#outside::after','#oversized::after','#panel','#rectangle::after','#scaled::after','#unmarked::after','#unmasked::after','#white-base','#wide::after']);
  await page.evaluate(()=>history.replaceState(null,'','/amigos/'));
  const outsideHome=await inspectSurfaces(page);
  expect(outsideHome.allowed).toEqual([]);
  expect(outsideHome.bright.map(({selector,pseudo})=>selector+pseudo)).toEqual(expect.arrayContaining(['#chat::after','#initials::after','#white-base::after']));
});

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
