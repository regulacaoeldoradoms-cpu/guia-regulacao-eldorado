import { test, expect } from '@playwright/test';
import { installAuditFixture } from './dark-audit-fixture.mjs';
import { compareAgainstBase } from './dark-audit-base-comparison.mjs';
import { selectedAuditRoutes, aliasDestinations } from './dark-audit-routes.mjs';
// Explicit opt-in: these are actual base-commit comparisons, never a rebaseline.
if(process.env.DARK_AUDIT_COMPARE_BASE==='1')for(const route of selectedAuditRoutes.filter(route=>!aliasDestinations[route])) {
  for(const [theme,media] of [['light','screen'],['dark','print']])test(`preserve ${theme} ${media} ${route}`,async({page,context},info)=>{
    const network=await installAuditFixture(context,{theme,authenticated:!['/login/','/cadastro/'].includes(route)});
    const comparison=await compareAgainstBase({page,context,info,route,theme,media});
    expect(network.unexpected,'Unknown fixture endpoints invalidate the comparison').toEqual([]);
    expect(comparison.differences,'Computed styles must equal the base commit').toEqual([]);
    expect(comparison.newErrors,'No new JavaScript errors beyond the measured base commit').toEqual([]);
    expect(comparison.pixelComparison.accepted,'At most 2 raster pixels may differ by 1 channel unit; layout/computed styles remain exact').toBe(true);
  });
}
