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
if(process.env.DARK_AUDIT_COMPARE_BASE==='1')for(const route of selectedAuditRoutes.filter(route=>!aliasDestinations[route])) {
  for(const [theme,media] of [['light','screen'],['dark','print']])test(`preserve ${theme} ${media} ${route}`,async({page,context},info)=>{
    // The complete mobile catalogue exceeds 90 million physical pixels. Keep
    // it intact and allow the bounded, repeated full-page captures to finish.
    if(route==='/medico/')test.setTimeout(180_000);
    const network=await installAuditFixture(context,{theme,authenticated:!['/login/','/cadastro/'].includes(route)});
    const prepare=route==='/conselho/painel/'?page=>sampleCouncilReflection(page,info):undefined;
    const comparison=await compareAgainstBase({page,context,info,route,theme,media,prepare});
    expect(network.unexpected,'Unknown fixture endpoints invalidate the comparison').toEqual([]);
    expect(comparison.differences,'Computed styles must equal the base commit').toEqual([]);
    expect(comparison.newErrors,'No new JavaScript errors beyond the measured base commit').toEqual([]);
    expect(comparison.pixelComparison.accepted,'At most 2 raster pixels may differ by 1 channel unit; layout/computed styles remain exact').toBe(true);
  });
}
