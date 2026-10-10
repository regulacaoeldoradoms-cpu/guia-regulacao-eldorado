import { test, expect } from '@playwright/test';
import { installAuditFixture } from './dark-audit-fixture.mjs';
import { compareAgainstBase } from './dark-audit-base-comparison.mjs';
import { selectedAuditRoutes, aliasDestinations } from './dark-audit-routes.mjs';

async function sampleCouncilReflection(page,info){
  // council.css preserves this 4.8s infinite reflection unchanged. Sampling
  // wall-clock time can see opacity 0 on one navigation and an active pseudo
  // on the other. Compare both at 70%, where the original reflection is visible.
  await page.locator('#councilRoleBadge.is-president-image').waitFor({state:'visible'});
  const phase=await page.evaluate(async()=>{
    const badge=document.querySelector('#councilRoleBadge');
    const animations=badge.getAnimations({subtree:true}).filter(animation=>animation.animationName==='council-role-reflection');
    const timing=animations.map(animation=>animation.effect.getTiming());
    await Promise.all(animations.map(async animation=>{
      animation.pause();
      animation.currentTime=3360;
      await animation.ready;
    }));
    return {matches:animations.length,durations:timing.map(item=>item.duration),iterations:timing.map(item=>String(item.iterations)),sampleTime:3360,opacity:Number(getComputedStyle(badge,'::after').opacity)};
  });
  expect(phase.matches,'Expected the unchanged, named Council reflection animation').toBe(1);
  expect(phase.durations).toEqual([4800]);
  expect(phase.iterations).toEqual(['Infinity']);
  expect(phase.opacity,'The reflection pseudo must remain active in the comparison').toBeGreaterThan(0);
  await info.attach('council-reflection-sampling.json',{body:Buffer.from(JSON.stringify(phase,null,2)),contentType:'application/json'});
}
// Explicit opt-in: these are actual base-commit comparisons, never a rebaseline.
// Mascotes is new in this PR and has no HTML at the base commit; its current
// dark/light/print surfaces are still checked by portal-dark-audit.spec.mjs.
const routesWithoutBase = new Set(['/estudos/','/mascotes/']);
const sharedCitizenRoutes = new Set(['/', '/cidadao/', '/amigos/', '/ferramentas/', '/perfil/', '/seguranca/', '/conquistas/', '/configuracoes/', '/notificacoes/', '/mascotes/']);
if(process.env.DARK_AUDIT_COMPARE_BASE==='1')for(const route of selectedAuditRoutes.filter(route=>!aliasDestinations[route]&&!routesWithoutBase.has(route))) {
  for(const [theme,media] of [['light','screen'],['dark','print']])test(`preserve ${theme} ${media} ${route}`,async({page,context,isMobile},info)=>{
    // The complete mobile catalogue exceeds 90 million physical pixels. Keep
    // it intact and allow the bounded, repeated full-page captures to finish.
    if(route==='/medico/')test.setTimeout(180_000);
    const network=await installAuditFixture(context,{theme,authenticated:!['/login/','/cadastro/'].includes(route)});
    const shared=sharedCitizenRoutes.has(route);
    const mobileRedesign=shared&&isMobile&&theme==='light'&&media==='screen';
    const palettes=[];
    let layout;
    const prepare=async target=>{
      if(route==='/conselho/painel/')await sampleCouncilReflection(target,info);
      if(mobileRedesign){
        // Compare the same control identities and complete colors after responsive DOM moves.
        palettes.push(await target.evaluate(()=>[...document.querySelectorAll('button[id],input[id],textarea[id],.status-chip,.privacy-chip')].filter(e=>!e.closest('.social-mobile-nav,.social-notification-panel')).map(e=>{const s=getComputedStyle(e);return {id:e.id,class:e.className,color:s.color,background:s.backgroundColor,border:s.borderColor};}).sort((a,b)=>a.id.localeCompare(b.id)||a.class.localeCompare(b.class))));
        if(!layout)layout=await target.evaluate(()=>{
          const nav=[...document.querySelectorAll('.social-mobile-nav-link')];
          const visible=nav.filter(e=>e.getBoundingClientRect().height>0);
          return {active:document.body.classList.contains('citizen-readable-layout'),fits:document.documentElement.scrollWidth<=document.documentElement.clientWidth+1,navFits:visible.every(e=>{const r=e.getBoundingClientRect();return r.width>=43.99&&r.height>=44&&r.right<=document.documentElement.clientWidth+1&&r.left>=-1&&parseFloat(getComputedStyle(e).fontSize)>=14;}),rows:visible.length?new Set(visible.map(e=>Math.round(e.getBoundingClientRect().top))).size:0};
        });
      }
    };
    const comparison=await compareAgainstBase({page,context,info,route,theme,media,prepare,normalizeSelector:selector=>shared?selector.replace(/\.citizen-readable-layout(?=[. >:]|$)/g,''):selector});
    expect(network.unexpected,'Unknown fixture endpoints invalidate the comparison').toEqual([]);
    if(mobileRedesign){
      expect(palettes).toHaveLength(2);
      expect(palettes[0]).toEqual(palettes[1]);
      expect(layout.active).toBe(true);expect(layout.fits).toBe(true);expect(layout.navFits).toBe(true);expect(layout.rows).toBeLessThanOrEqual(1);
      expect(comparison.captureStability.current.snapshotStable).toBe(true);
    }else expect(comparison.differences,'Computed styles must equal the base commit').toEqual([]);
    expect(comparison.newErrors,'No new JavaScript errors beyond the measured base commit').toEqual([]);
    if(!mobileRedesign)expect(comparison.pixelComparison.gateAccepted,'Stable raster sources must remain within 2 pixels / 1 channel; nondeterministic Linux raster is diagnostic only when computed/layout snapshots are exact').toBe(true);
  });
}
