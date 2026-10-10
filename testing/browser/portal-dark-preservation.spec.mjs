import { test, expect } from '@playwright/test';
import { installAuditFixture } from './dark-audit-fixture.mjs';
import { compareAgainstBase } from './dark-audit-base-comparison.mjs';
import { selectedAuditRoutes, aliasDestinations } from './dark-audit-routes.mjs';
import { writeFile } from 'node:fs/promises';

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
// The same native Chat is presented as Direct on every shared mobile route.
// Its launcher must be excluded by ID on both sources: the base launcher is
// outside the navigation while the current launcher is moved into it.
const approvedSharedSurfaces = '.social-mobile-nav,.social-notification-panel,#portalChatRoot,#portalChatLauncher';
const nativeIdentityKey = 'portal.darkAuditNativeIdentity';
async function sharedNativeControlContract(page, route) {
  return page.evaluate(({ route, nativeIdentityKey }) => {
    const requiredIds = ['portalLogout','portalChatRoot','portalChatLauncher','portalChatUnread','portalChatInput','portalChatClose','portalChatBack','socialNotificationTriggerMobile','socialNotificationPanelMobile'];
    const ids = new Set(requiredIds);
    document.querySelectorAll('#portalChatRoot [id]').forEach(node => ids.add(node.id));
    if (route === '/') for (const id of ['socialComposerForm','socialComposerText','socialComposerAudience','socialShortcutGrid','socialShortcutLimit']) ids.add(id);
    if (route === '/perfil/') {
      for (const id of ['profileEditorForm','profilePhotoCamera','profileAvatar','profilePhotoInput']) ids.add(id);
      document.querySelectorAll('#socialProfile [id],#profileEditor [id],#profilePhotoDialog [id]').forEach(node => {
        if (node.matches('form,button,input,textarea,select')) ids.add(node.id);
      });
    }
    const original = window[Symbol.for(nativeIdentityKey)];
    const controls = [...ids].sort().map(id => {
      const node = document.getElementById(id);
      const originalNode = id.startsWith('socialNotification')
        ? original?.navigation.get(document.querySelector('.social-mobile-nav'))?.get(id)
        : original?.byId.get(id);
      return {
        id,count:document.querySelectorAll(`[id="${id}"]`).length,
        identityPreserved:Boolean(node && originalNode === node),
        tag:node?.localName,type:node?.getAttribute('type'),name:node?.getAttribute('name'),
        maxlength:node?.getAttribute('maxlength'),minlength:node?.getAttribute('minlength'),
        required:Boolean(node?.required),disabled:Boolean(node?.disabled),hidden:Boolean(node?.hidden),
        accept:node?.getAttribute('accept'),multiple:Boolean(node?.multiple),
        describedBy:node?.getAttribute('aria-describedby'),controls:node?.getAttribute('aria-controls'),
        options:node?.options?[...node.options].map(option=>({value:option.value,text:option.text,disabled:option.disabled})):null,
        selectedValues:node?.options?[...node.selectedOptions].map(option=>option.value):null,
        form:node?.form?.id || null,formAttribute:node?.getAttribute('form')
      };
    });
    const account = [...document.querySelectorAll('.portal-topbar .portal-account-area')].map(node=>({tag:node.localName,href:node.getAttribute('href')}));
    return {requiredIds,controls,account};
  }, { route, nativeIdentityKey });
}
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
    const loginRedesign=route==='/login/'&&isMobile;
    const loginContracts=[];
    // The approved presentation covers shared mobile navigation/Direct and
    // Profile's compact account header. Native controls remain compared to
    // base; desktop and print keep the exact computed and raster gates below.
    const homeRedesign=route==='/'&&mobileRedesign;
    const approvedSurfaces=homeRedesign?approvedHomeSurfaces:approvedSharedSurfaces+(route==='/perfil/'?',.portal-topbar':'');
    const palettes=[];
    const homeContracts=[];
    const nativeContracts=[];
    if(mobileRedesign)await context.addInitScript(nativeIdentityKey=>{
      const original=new Map();
      const navigation=new WeakMap();
      window[Symbol.for(nativeIdentityKey)]={byId:original,navigation};
      const rememberNavigation=nav=>{
        if(navigation.has(nav))return;
        const controls=new Map([...nav.querySelectorAll('[id]')].map(node=>[node.id,node]));
        const panel=document.getElementById('socialNotificationPanelMobile');
        if(panel)controls.set(panel.id,panel);
        navigation.set(nav,controls);
      };
      const remember=node=>{
        if(!(node instanceof Element))return;
        if(node.id&&!original.has(node.id))original.set(node.id,node);
        node.querySelectorAll('[id]').forEach(child=>{if(!original.has(child.id))original.set(child.id,child);});
        // The native renderer may remount the entire navigation. Track its
        // original notification controls per nav, never bless replacements
        // inside an existing nav merely because they reuse the same IDs.
        if(node.matches('.social-mobile-nav'))rememberNavigation(node);
        node.querySelectorAll('.social-mobile-nav').forEach(rememberNavigation);
      };
      new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(remember)))
        .observe(document,{childList:true,subtree:true});
    },nativeIdentityKey);
    let layout;
    const prepare=async target=>{
      if(loginRedesign) loginContracts.push(await target.evaluate(()=>({
        form:{action:document.getElementById('loginForm').getAttribute('action'),autocomplete:document.getElementById('loginForm').getAttribute('autocomplete')},
        controls:['loginUsername','loginPassword','loginRemember','loginPasswordToggle','loginSubmit','loginStatus'].map(id=>{
          const node=document.getElementById(id),style=getComputedStyle(node);
          return {id,count:document.querySelectorAll('#'+id).length,tag:node.localName,type:node.getAttribute('type'),name:node.getAttribute('name'),autocomplete:node.getAttribute('autocomplete'),required:node.required||false,maxlength:node.getAttribute('maxlength'),role:node.getAttribute('role'),live:node.getAttribute('aria-live'),label:node.id==='loginPasswordToggle'?node.getAttribute('aria-label'):null,color:style.color,background:style.backgroundColor,border:style.borderColor};
        }),
        labels:['loginUsername','loginPassword'].map(id=>document.querySelector('label[for="'+id+'"]').textContent),
        links:[...document.querySelectorAll('.login-card a')].map(node=>({href:node.getAttribute('href'),text:node.textContent.trim()}))
      })));
      if(route==='/') {
        expect(await target.evaluate(async()=>Boolean(await window.PortalHomeReady)), 'Both Home sources must finish their real bootstrap before capture').toBe(true);
        await expect(target.locator('#portalChatLauncher')).toBeAttached();
        await target.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
      }
      if(route==='/conselho/painel/')await sampleCouncilReflection(target,info);
      if(mobileRedesign){
        if(nativeContracts.length===0)await target.waitForFunction(()=>typeof window.PortalCitizenMobileReady?.then==='function');
        const sharedReady=await target.evaluate(async()=>window.PortalCitizenMobileReady===undefined?null:Boolean(await window.PortalCitizenMobileReady));
        if(nativeContracts.length===0||sharedReady!==null)expect(sharedReady,'The current shared presentation must finish its real bootstrap').toBe(true);
        // The native Chat and groups render asynchronously after auth. Capture
        // their contracts only after both sources expose the same native nodes.
        await expect(target.locator('#portalChatLauncher')).toBeAttached();
        await expect(target.locator('#portalChatInput')).toBeAttached();
        await expect(target.locator('#portalGroupInput')).toBeAttached();
        await target.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
        nativeContracts.push(await sharedNativeControlContract(target,route));
        if(homeRedesign) homeContracts.push(await homeControlContract(target));
        // Compare the same control identities and complete colors after responsive DOM moves.
        palettes.push(await target.evaluate(excluded=>[...document.querySelectorAll('button[id],input[id],textarea[id],.status-chip,.privacy-chip')].filter(e=>!e.closest(excluded)).map(e=>{const s=getComputedStyle(e);return {id:e.id,class:e.className,color:s.color,background:s.backgroundColor,border:s.borderColor};}).sort((a,b)=>a.id.localeCompare(b.id)||a.class.localeCompare(b.class)),approvedSurfaces));
        if(!layout)layout=await target.evaluate(()=>{
          const isVisible=node=>{
            if(!node?.getClientRects().length)return false;
            for(let parent=node;parent;parent=parent.parentElement){
              const style=getComputedStyle(parent);
              if(parent.hidden||style.display==='none'||style.visibility!=='visible'||Number(style.opacity)<=0)return false;
            }
            return true;
          };
          const nav=[...document.querySelectorAll('.social-mobile-nav > .social-mobile-nav-link')];
          const visible=nav.filter(isVisible);
          const sourceAvatar=document.querySelector('.portal-topbar .portal-profile-avatar:not(.home-nav-profile-avatar)');
          const avatar=visible.at(-1)?.querySelector('.home-nav-profile-avatar');
          return {active:document.body.classList.contains('citizen-readable-layout'),shared:document.body.classList.contains('shared-mobile-navigation'),iconNavigation:document.querySelector('.social-mobile-nav')?.dataset.homeIconNavigation==='true',fits:document.documentElement.scrollWidth<=document.documentElement.clientWidth+1,navFits:visible.every(e=>{const r=e.getBoundingClientRect();return r.width>=43.99&&r.height>=44&&r.right<=document.documentElement.clientWidth+1&&r.left>=-1&&Boolean(e.getAttribute('aria-label'));}),rows:visible.length?new Set(visible.map(e=>Math.round(e.getBoundingClientRect().top))).size:0,
            navOrder:visible.map(e=>e.getAttribute('href')||e.id),navNames:visible.map(e=>e.getAttribute('aria-label')),
            profileAvatar:Boolean(isVisible(avatar)&&sourceAvatar&&avatar!==sourceAvatar&&avatar.getAttribute('aria-hidden')==='true'&&avatar.textContent===sourceAvatar.textContent&&getComputedStyle(avatar).backgroundImage===getComputedStyle(sourceAvatar).backgroundImage),
            toolsAfterComposer:document.querySelector('.social-composer')?.nextElementSibling?.classList.contains('social-shortcuts'),
            nativeLauncher:document.querySelector('.social-mobile-nav #portalChatLauncher')!==null,
            chatRootUnderBody:document.getElementById('portalChatRoot')?.parentNode===document.body};
        });
      }
    };
    const comparison=await compareAgainstBase({page,context,info,route,theme,media,prepare,normalizeSelector:selector=>normalizePreservationSelector(selector,route,shared)});
    if(route==='/' && (!isMobile || media==='print')) expect(await page.locator('body').evaluate(body=>body.classList.contains('home-social-mobile')), 'Desktop and print must restore the original Home presentation').toBe(false);
    expect(network.unexpected,'Unknown fixture endpoints invalidate the comparison').toEqual([]);
    if(mobileRedesign){
      const contractEvidence={approvedSurfaces,current:nativeContracts[0],base:nativeContracts[1],layout,palettes};
      const contractPath=info.outputPath('shared-mobile-native-contract.json');
      await writeFile(contractPath,JSON.stringify(contractEvidence,null,2));
      await info.attach('shared-mobile-native-contract.json',{path:contractPath,contentType:'application/json'});
      expect(nativeContracts).toHaveLength(2);
      expect(nativeContracts[0].controls.find(control=>control.id==='portalChatLauncher')?.controls).toBe('portalChatRoot');
      // Direct adds this exact accessible relationship to the original launcher.
      // Preserve the raw evidence and compare every other native attribute;
      // only an absent base aria-controls may become the named native root.
      const baseNativeContract={...nativeContracts[1],controls:nativeContracts[1].controls.map(control=>
        control.id==='portalChatLauncher'&&control.controls===null?{...control,controls:'portalChatRoot'}:control)};
      expect(nativeContracts[0]).toEqual(baseNativeContract);
      expect(nativeContracts[0].controls.every(control=>control.count===1&&control.identityPreserved),'Native IDs must remain unique and retain their original nodes').toBe(true);
      for(const id of ['portalLogout','portalChatLauncher','socialNotificationTriggerMobile']){
        const control=nativeContracts[0].controls.find(control=>control.id===id);
        expect({tag:control?.tag,type:control?.type}).toEqual({tag:'button',type:'button'});
      }
      expect(nativeContracts[0].controls.find(control=>control.id==='socialNotificationTriggerMobile')?.controls).toBe('socialNotificationPanelMobile');
      expect(nativeContracts[0].account).toEqual([{tag:'a',href:'/perfil/'}]);
      expect(palettes).toHaveLength(2);
      expect(palettes[0]).toEqual(palettes[1]);
      // This existing audit fixture returns synthetic PETS_DISABLED (503); the
      // enabled six-item variant is covered by the approved focused scene gate.
      expect(layout.navOrder).toEqual(['/','/amigos/','portalChatLauncher','socialNotificationTriggerMobile','/perfil/']);
      expect(layout.navNames).toEqual(['Início','Amigos','Chat','Avisos','Perfil']);
      expect(layout.shared&&layout.iconNavigation&&layout.profileAvatar&&layout.nativeLauncher&&layout.chatRootUnderBody).toBe(true);
      if(homeRedesign){
        expect(homeContracts).toHaveLength(2);
        expect(homeContracts[0]).toEqual(homeContracts[1]);
        expect(homeContracts[0].controls.every(control=>control.count===1)).toBe(true);
        expect(layout.profileAvatar&&layout.toolsAfterComposer&&layout.nativeLauncher&&layout.chatRootUnderBody).toBe(true);
        await info.attach('approved-home-mobile-contract.json',{body:Buffer.from(JSON.stringify({approvedSurfaces:approvedHomeSurfaces,current:homeContracts[0],base:homeContracts[1],layout},null,2)),contentType:'application/json'});
      }
      expect(layout.active).toBe(true);expect(layout.fits).toBe(true);expect(layout.navFits).toBe(true);expect(layout.rows).toBeLessThanOrEqual(1);
      expect(comparison.captureStability.current.snapshotStable).toBe(true);
    }else if(loginRedesign){
      // The requested phone redesign changes copy/layout deliberately. Keep
      // exact native form semantics/colors against base; dedicated phone tests
      // exercise zoom, keyboard, error/retry and registration reachability.
      expect(loginContracts).toHaveLength(2);
      expect(loginContracts[0]).toEqual(loginContracts[1]);
      expect(loginContracts[0].controls.every(control=>control.count===1)).toBe(true);
      expect(comparison.captureStability.current.snapshotStable).toBe(true);
      await info.attach('approved-mobile-login-contract.json',{body:Buffer.from(JSON.stringify({current:loginContracts[0],base:loginContracts[1],approved:'Login phone copy/layout; native form semantics and palette preserved'})),contentType:'application/json'});
    }else expect(comparison.differences,'Computed styles must equal the base commit').toEqual([]);
    expect(comparison.newErrors,'No new JavaScript errors beyond the measured base commit').toEqual([]);
    if(!mobileRedesign&&!loginRedesign)expect(comparison.pixelComparison.gateAccepted,'Stable raster sources must remain within 2 pixels / 1 channel; nondeterministic Linux raster is diagnostic only when computed/layout snapshots are exact').toBe(true);
  });
}
