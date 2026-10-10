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
function normalizePreservationSelector(selector, route, shared) {
  const normalized = shared ? selector.replace(/\.citizen-readable-layout(?=[. >:]|$)/g, '') : selector;
  // The Home controller marker has no desktop/print styling. Normalize only
  // its BODY identity; retain all computed properties, geometry and pixel gates.
  return route === '/' ? normalized.split(' > ').map(segment => segment.startsWith('body.')
    ? segment.replace(/\.home-social-presentation(?=[.:]|$)/, '') : segment).join(' > ') : normalized;
}
const approvedHomeSurfaces = '#socialHome,.portal-topbar,#portalChatRoot,.social-mobile-nav,.social-notification-panel';
async function homeControlContract(page) {
  return page.evaluate(approvedSurfaces => {
    const ids = ['socialComposerForm','socialComposerText','socialComposerAudience','socialShortcutGrid','socialShortcutLimit','portalLogout','portalChatRoot','portalChatLauncher','portalChatUnread','portalChatInput'];
    const controls = ids.map(id => {
      const node = document.getElementById(id);
      return {id,count:document.querySelectorAll(`#${id}`).length,tag:node?.localName,type:node?.getAttribute('type'),name:node?.getAttribute('name'),maxlength:node?.getAttribute('maxlength'),required:Boolean(node?.required),options:node?.options?[...node.options].map(option=>option.value):null,form:node?.form?.id || null};
    });
    const outsideAppearance = [...document.querySelectorAll('body *')].filter(node => {
      if(node.closest(approvedSurfaces) || !node.getClientRects().length) return false;
      if(!node.matches('button,input,textarea,select,a') && ![...node.childNodes].some(child=>child.nodeType===Node.TEXT_NODE && child.textContent.trim())) return false;
      for(let parent=node;parent;parent=parent.parentElement) {
        const style=getComputedStyle(parent);
        if(parent.hidden || style.display==='none' || style.visibility==='hidden' || Number(style.opacity)===0) return false;
      }
      return true;
    }).map(node => {
      const style=getComputedStyle(node),backdrops=[];
      // Equal foreground plus every background/opacity input preserves contrast
      // outside the named redesign surfaces, including translucent ancestors.
      for(let parent=node;parent;parent=parent.parentElement) {
        const background=getComputedStyle(parent);
        backdrops.push({background:background.backgroundColor,image:background.backgroundImage,opacity:background.opacity});
      }
      return {id:node.id,tag:node.localName,text:node.textContent.trim(),color:style.color,border:style.borderColor,backdrops};
    });
    return {controls,tools:[...document.querySelectorAll('#socialShortcutGrid a')].map(node=>node.getAttribute('href')),outsideAppearance};
  }, approvedHomeSurfaces);
}
if(process.env.DARK_AUDIT_COMPARE_BASE==='1')for(const route of selectedAuditRoutes.filter(route=>!aliasDestinations[route]&&!routesWithoutBase.has(route))) {
  for(const [theme,media] of [['light','screen'],['dark','print']])test(`preserve ${theme} ${media} ${route}`,async({page,context,isMobile},info)=>{
    // The complete mobile catalogue exceeds 90 million physical pixels. Keep
    // it intact and allow the bounded, repeated full-page captures to finish.
    if(route==='/medico/')test.setTimeout(180_000);
    const network=await installAuditFixture(context,{theme,authenticated:!['/login/','/cadastro/'].includes(route)});
    const shared=sharedCitizenRoutes.has(route);
    const mobileRedesign=shared&&isMobile&&theme==='light'&&media==='screen';
    // PR624 explicitly replaces only Home's mobile screen presentation. Its
    // native contracts remain compared to base; desktop and print stay exact.
    const homeRedesign=route==='/'&&mobileRedesign;
    const palettes=[];
    const homeContracts=[];
    let layout;
    const prepare=async target=>{
      if(route==='/') {
        expect(await target.evaluate(async()=>Boolean(await window.PortalHomeReady)), 'Both Home sources must finish their real bootstrap before capture').toBe(true);
        await expect(target.locator('#portalChatLauncher')).toBeAttached();
        await target.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
      }
      if(route==='/conselho/painel/')await sampleCouncilReflection(target,info);
      if(mobileRedesign){
        if(homeRedesign) homeContracts.push(await homeControlContract(target));
        // Compare the same control identities and complete colors after responsive DOM moves.
        palettes.push(await target.evaluate(excluded=>[...document.querySelectorAll('button[id],input[id],textarea[id],.status-chip,.privacy-chip')].filter(e=>!e.closest(excluded)).map(e=>{const s=getComputedStyle(e);return {id:e.id,class:e.className,color:s.color,background:s.backgroundColor,border:s.borderColor};}).sort((a,b)=>a.id.localeCompare(b.id)||a.class.localeCompare(b.class)),homeRedesign?approvedHomeSurfaces:'.social-mobile-nav,.social-notification-panel'));
        if(!layout)layout=await target.evaluate(homeRedesign=>{
          const nav=[...document.querySelectorAll('.social-mobile-nav-link')];
          const visible=nav.filter(e=>e.getBoundingClientRect().height>0);
          return {active:document.body.classList.contains('citizen-readable-layout'),fits:document.documentElement.scrollWidth<=document.documentElement.clientWidth+1,navFits:visible.every(e=>{const r=e.getBoundingClientRect();return r.width>=43.99&&r.height>=44&&r.right<=document.documentElement.clientWidth+1&&r.left>=-1&&(homeRedesign?Boolean(e.getAttribute('aria-label')):parseFloat(getComputedStyle(e).fontSize)>=14);}),rows:visible.length?new Set(visible.map(e=>Math.round(e.getBoundingClientRect().top))).size:0,
            navOrder:visible.map(e=>e.getAttribute('href')||e.id),profileAvatar:Boolean(visible.at(-1)?.querySelector('.home-nav-profile-avatar')),
            toolsAfterComposer:document.querySelector('.social-composer')?.nextElementSibling?.classList.contains('social-shortcuts'),
            nativeLauncher:document.querySelector('.social-mobile-nav #portalChatLauncher')!==null,
            chatRootUnderBody:document.getElementById('portalChatRoot')?.parentNode===document.body};
        },homeRedesign);
      }
    };
    const comparison=await compareAgainstBase({page,context,info,route,theme,media,prepare,normalizeSelector:selector=>normalizePreservationSelector(selector,route,shared)});
    if(route==='/' && (!isMobile || media==='print')) expect(await page.locator('body').evaluate(body=>body.classList.contains('home-social-mobile')), 'Desktop and print must restore the original Home presentation').toBe(false);
    expect(network.unexpected,'Unknown fixture endpoints invalidate the comparison').toEqual([]);
    if(mobileRedesign){
      expect(palettes).toHaveLength(2);
      expect(palettes[0]).toEqual(palettes[1]);
      if(homeRedesign){
        expect(homeContracts).toHaveLength(2);
        expect(homeContracts[0]).toEqual(homeContracts[1]);
        expect(homeContracts[0].controls.every(control=>control.count===1)).toBe(true);
        // This existing audit fixture returns synthetic PETS_DISABLED (503); the
        // enabled six-item variant is covered by the approved Home scene gate.
        expect(layout.navOrder).toEqual(['/','/amigos/','portalChatLauncher','socialNotificationTriggerMobile','/perfil/']);
        expect(layout.profileAvatar&&layout.toolsAfterComposer&&layout.nativeLauncher&&layout.chatRootUnderBody).toBe(true);
        await info.attach('approved-home-mobile-contract.json',{body:Buffer.from(JSON.stringify({approvedSurfaces:approvedHomeSurfaces,current:homeContracts[0],base:homeContracts[1],layout},null,2)),contentType:'application/json'});
      }
      expect(layout.active).toBe(true);expect(layout.fits).toBe(true);expect(layout.navFits).toBe(true);expect(layout.rows).toBeLessThanOrEqual(1);
      expect(comparison.captureStability.current.snapshotStable).toBe(true);
    }else expect(comparison.differences,'Computed styles must equal the base commit').toEqual([]);
    expect(comparison.newErrors,'No new JavaScript errors beyond the measured base commit').toEqual([]);
    if(!mobileRedesign)expect(comparison.pixelComparison.gateAccepted,'Stable raster sources must remain within 2 pixels / 1 channel; nondeterministic Linux raster is diagnostic only when computed/layout snapshots are exact').toBe(true);
  });
}
