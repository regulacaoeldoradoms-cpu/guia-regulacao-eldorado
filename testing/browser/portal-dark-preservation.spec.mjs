import { test, expect } from '@playwright/test';
import { installAuditFixture } from './dark-audit-fixture.mjs';
import { compareAgainstBase } from './dark-audit-base-comparison.mjs';
import { selectedAuditRoutes, aliasDestinations } from './dark-audit-routes.mjs';
import { writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

async function sampleCouncilReflection(page,info){
  // Both sources must finish native Council navigation before switching to print.
  // The role badge can paint before the async presentation controller finishes.
  await page.waitForFunction(()=>!matchMedia('screen and (max-width:900px)').matches||document.body.classList.contains('council-navigation-ready'));
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
  // The retained area wrapper is display:contents and has no painted box. Only
  // remove that ancestry segment; all child styles, geometry and pixels remain.
  const normalized = shared ? selector.replace(/\.citizen-readable-layout(?=[. >:]|$)/g, '')
    .split(' > ').filter(segment=>!/^div\.citizen-route-area(?::nth-of-type\(\d+\))?$/.test(segment)).join(' > ') : selector;
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
test('native identity records late Avisos and rejects same-ID replacements',async({page,context})=>{
  await context.addInitScript(trackNativeControls,nativeIdentityKey);
  await page.route('**/*',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><nav class="social-mobile-nav"></nav>'}));
  await page.goto('/');
  await page.evaluate(()=>{
    const button=document.createElement('button');button.id='socialNotificationTriggerMobile';button.type='button';
    document.querySelector('.social-mobile-nav').append(button);
    const panel=document.createElement('section');panel.id='socialNotificationPanelMobile';document.body.append(panel);
  });
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  const first=await sharedNativeControlContract(page,'/');
  for(const id of ['socialNotificationTriggerMobile','socialNotificationPanelMobile'])expect(first.controls.find(c=>c.id===id)?.identityPreserved).toBe(true);
  await page.evaluate(()=>{for(const id of ['socialNotificationTriggerMobile','socialNotificationPanelMobile']){const node=document.getElementById(id);node.replaceWith(node.cloneNode(true));}});
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  const replaced=await sharedNativeControlContract(page,'/');
  for(const id of ['socialNotificationTriggerMobile','socialNotificationPanelMobile']){
    const control=replaced.controls.find(c=>c.id===id);expect(control.count).toBe(1);expect(control.identityPreserved).toBe(false);
  }
});
function trackNativeControls(nativeIdentityKey) {
      const original=new Map();
      const navigation=new WeakMap();
      window[Symbol.for(nativeIdentityKey)]={byId:original,navigation};
      const rememberNavigation=nav=>{
        let controls=navigation.get(nav);
        if(!controls){controls=new Map();navigation.set(nav,controls);}
        // Config may add the original Avisos controls after the retained nav was
        // mounted. Record each first insertion, never overwrite its identity.
        for(const node of nav.querySelectorAll('[id]'))if(!controls.has(node.id))controls.set(node.id,node);
        const panel=document.getElementById('socialNotificationPanelMobile');
        if(panel&&!controls.has(panel.id))controls.set(panel.id,panel);
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
        const owner=node.closest('.social-mobile-nav');if(owner)rememberNavigation(owner);
        if(node.id==='socialNotificationPanelMobile'){
          const nav=document.querySelector('.social-mobile-nav');if(nav)rememberNavigation(nav);
        }
      };
      new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(remember)))
        .observe(document,{childList:true,subtree:true});

}
async function councilNativeControlContract(page) {
  return page.evaluate(key => {
    const original = window[Symbol.for(key)]?.byId;
    return [...document.querySelectorAll('.portal-main :is(form,button,input,textarea,select)[id],#councilDetailModal :is(form,button,input,textarea,select)[id],#portalLogout')].map(node => ({
      id:node.id, count:document.querySelectorAll('#'+CSS.escape(node.id)).length,
      identityPreserved:original?.get(node.id)===node,
      tag:node.localName, type:node.getAttribute('type'), name:node.getAttribute('name'),
      required:node.required||false, maxlength:node.getAttribute('maxlength'),
      form:node.form?.id||null, value:node.value||'',
      options:node.localName==='select'?[...node.options].map(option=>({value:option.value,text:option.textContent})):null
    })).sort((a,b)=>a.id.localeCompare(b.id));
  },nativeIdentityKey);
}

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
    if (route === '/cidadao/') {
      ids.add('openNewManifestation');
      document.querySelectorAll('#newManifestationForm [id],#newManifestationForm,#manifestationDetailModal [id],#manifestationsCard [id],#notificationsCard [id]').forEach(node=>{if(node.matches('form,button,input,textarea,select'))ids.add(node.id);});
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
    const citizenForm = route === '/cidadao/' ? {radios:[...document.querySelectorAll('#newManifestationForm input[type=radio]')].map(node=>({name:node.name,value:node.value,checked:node.checked,required:node.required,disabled:node.disabled})),alerts:[...document.querySelectorAll('#newManifestationForm .form-alert,#newManifestationForm .compose-essential,#newManifestationForm .compose-info')].map(node=>node.textContent.trim()),confirmation:document.querySelector('label.form-confirm')?.textContent.trim()} : null;
    return {requiredIds,controls,account,citizenForm};
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
    const councilRedesign=route==='/conselho/painel/'&&isMobile&&media==='screen'&&theme==='light';
    const councilContracts=[];
    if(councilRedesign)await context.addInitScript(trackNativeControls,nativeIdentityKey);
    const loginContracts=[];
    // The approved presentation covers shared mobile navigation/Direct and
    // the requested common Home header on the nine requested views. Native controls remain compared to
    // base; desktop and print keep the exact computed and raster gates below.
    const homeRedesign=route==='/'&&mobileRedesign;
    const headerRedesign=mobileRedesign&&['/','/amigos/','/perfil/','/mascotes/','/configuracoes/','/seguranca/','/conquistas/','/ferramentas/','/cidadao/'].includes(route);
    const approvedSurfaces=homeRedesign?approvedHomeSurfaces:approvedSharedSurfaces+(headerRedesign?',.portal-topbar':'')+(route==='/cidadao/'&&mobileRedesign?',.portal-main,.citizen-modal-panel':'');
    const headerContracts=[];
    const palettes=[];
    const homeContracts=[];
    const nativeContracts=[];
    let friendsSource=0;
    let signupSource=0;
    const signupContracts=[];
    const baseFriendsNotice=route==='/amigos/' ? execFileSync('git',['show',`${process.env.DARK_AUDIT_BASE || 'origin/main'}:amigos/index.html`],{encoding:'utf8'}).includes('Descoberta protegida') : false;
    const baseSignupPrivateBirth=route==='/cadastro/' ? execFileSync('git',['show',`${process.env.DARK_AUDIT_BASE || 'origin/main'}:cadastro/index.html`],{encoding:'utf8'}).includes('id="signupBirthDate"') : false;
    if(mobileRedesign)await context.addInitScript(trackNativeControls,nativeIdentityKey);
    let layout;
    const prepare=async target=>{
      if(route==='/cadastro/'){
        const current=signupSource++===0,field=target.locator('#signupBirthDate');
        signupContracts.push(await target.evaluate(()=>{const form=document.getElementById('signupForm');return{action:form.getAttribute('action'),method:form.getAttribute('method'),autocomplete:form.getAttribute('autocomplete'),noValidate:form.noValidate,controls:[...form.elements].filter(n=>n.id!=='signupBirthDate').map(n=>({id:n.id,count:document.querySelectorAll('#'+CSS.escape(n.id)).length,tag:n.localName,type:n.getAttribute('type'),name:n.getAttribute('name'),required:Boolean(n.required),minlength:n.getAttribute('minlength'),maxlength:n.getAttribute('maxlength'),autocomplete:n.getAttribute('autocomplete'),role:n.getAttribute('role'),live:n.getAttribute('aria-live'),label:n.labels?.[0]?.textContent.trim()}))};}));
        expect(await field.count()).toBe(current?1:Number(baseSignupPrivateBirth));
        if(current||baseSignupPrivateBirth){
          const birth=await field.evaluate(node=>({id:node.id,type:node.type,required:node.required,autocomplete:node.autocomplete,form:node.form?.id,label:node.labels?.[0]?.textContent,fields:node.closest('.portal-field')?.querySelectorAll('input,select,textarea').length}));
          expect(birth).toEqual({id:'signupBirthDate',type:'date',required:true,autocomplete:'bday',form:'signupForm',label:'Data de nascimento',fields:1});
          await info.attach('approved-private-birth-field.json',{body:Buffer.from(JSON.stringify(birth)),contentType:'application/json'});
        }
        if(current&&!baseSignupPrivateBirth){
          // Project only the explicitly approved new private field and its
          // exact explanatory caption. Every prior node/style/pixel remains
          // subject to the unchanged baseline comparison below.
          await field.evaluate(node=>node.closest('.portal-field').remove());
          const caption=target.locator('#signupForm > p');
          await expect(caption).toHaveText('Escolha um nome de usuário e uma senha. Sua data de nascimento é privada.');
          await caption.evaluate(node=>node.textContent='Você precisa informar somente um nome de usuário e uma senha.');
        }
      }
      if(route==='/amigos/'){
        // The user approved removing this exact explanatory card on mobile and desktop.
        // Normalize only the historical card; all remaining pixels/controls still compare exactly.
        const card=target.locator('aside > section').filter({has:target.getByRole('heading',{name:'Descoberta protegida',exact:true})});
        await expect(card).toHaveCount(friendsSource++===0?0:Number(baseFriendsNotice));
        if(await card.count()){
          await expect(card.locator('p')).toHaveText('Cidadãos não recebem um diretório de profissionais. Perfis profissionais ficam disponíveis somente no contexto profissional autorizado, inclusive pelo chat.');
          await card.evaluate(e=>e.remove());
        }
        await expect(target.locator('aside > section')).toHaveCount(1);
        await expect(target.locator('#socialSearchForm')).toBeAttached();
      }
      if(shared)expect(await target.locator('.citizen-route-area').evaluateAll(nodes=>nodes.every(node=>getComputedStyle(node).display==='contents')),'Retained area wrappers must have no painted layout box').toBe(true);
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
      if(councilRedesign)councilContracts.push(await councilNativeControlContract(target));
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
        if(headerRedesign) headerContracts.push(await target.evaluate(()=>{
          const header=document.querySelector('.portal-topbar');
          return {title:header.querySelector('.portal-brand-copy h1')?.textContent,
            logo:header.querySelectorAll('.portal-symbol').length,
            headers:document.querySelectorAll('.portal-topbar').length,
            menu:header.querySelectorAll('#homeAccountMenu:not([hidden])').length,
            competingMenu:header.querySelectorAll('#profileAccountMenu').length,
            logout:header.querySelectorAll('#portalLogout').length,
            controller:Boolean(window[Symbol.for('portal.citizenMobileHeader')])};
        }));
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
    if(route==='/cadastro/'){expect(signupContracts).toHaveLength(2);expect(signupContracts[0]).toEqual(signupContracts[1]);await info.attach('native-signup-controls-preserved.json',{body:Buffer.from(JSON.stringify(signupContracts)),contentType:'application/json'});}
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
      if(route==='/cidadao/'){
        const current=nativeContracts[0];
        expect(current.controls.some(control=>control.id==='manifestationPriorContact')).toBe(false);
        expect(current.controls.find(control=>control.id==='manifestationSubject')).toMatchObject({required:true,minlength:'3',maxlength:'180',disabled:true});
        expect(current.controls.find(control=>control.id==='manifestationDescription')).toMatchObject({required:true,minlength:'10',maxlength:'6500',disabled:true,describedBy:'composeGuidance composeIdentityWarning descriptionCounter'});
        expect(current.controls.find(control=>control.id==='manifestationConfirm')).toMatchObject({required:true,disabled:false,tag:'input',type:'checkbox',form:'newManifestationForm',identityPreserved:true});
        expect(current.citizenForm.confirmation).toBe('Revisei o relato e os anexos e confirmo que enviei apenas as informações necessárias.');
        expect(current.citizenForm.alerts.join(' ')).toContain('Texto, imagens e PDFs podem revelar sua identidade.');
        expect(current.citizenForm.alerts.join(' ')).toContain('urgência ou emergência');
        // Only the explicitly approved removal, initial progressive disabled
        // state, accessible report description and explanatory copy differ.
        // Every remaining native attribute, radio, ID and identity is exact.
        const project=contract=>({...contract,
          controls:contract.controls.filter(control=>control.id!=='manifestationPriorContact').map(control=>
            ['manifestationSubject','manifestationDescription'].includes(control.id)
              ? {...control,disabled:false,...(control.id==='manifestationDescription'?{describedBy:null}:{})}:control),
          citizenForm:{...contract.citizenForm,alerts:[],confirmation:''}});
        expect(project(current)).toEqual(project(baseNativeContract));
      }else expect(nativeContracts[0]).toEqual(baseNativeContract);
      expect(nativeContracts[0].controls.every(control=>control.count===1&&control.identityPreserved),'Native IDs must remain unique and retain their original nodes').toBe(true);
      for(const id of ['portalLogout','portalChatLauncher','socialNotificationTriggerMobile']){
        const control=nativeContracts[0].controls.find(control=>control.id===id);
        expect({tag:control?.tag,type:control?.type}).toEqual({tag:'button',type:'button'});
      }
      expect(nativeContracts[0].controls.find(control=>control.id==='socialNotificationTriggerMobile')?.controls).toBe('socialNotificationPanelMobile');
      expect(nativeContracts[0].account).toEqual([{tag:'a',href:'/perfil/'}]);
      if(headerRedesign){
        // Only the nine requested mobile headers may change. Every native
        // control identity and all remaining palettes still compare to base.
        expect(headerContracts[0]).toEqual({title:'Portal da regulação',logo:1,headers:1,menu:1,competingMenu:0,logout:1,controller:true});
        await info.attach('approved-shared-mobile-header.json',{body:Buffer.from(JSON.stringify({route,current:headerContracts[0],base:headerContracts[1]},null,2)),contentType:'application/json'});
      }
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
    }else if(councilRedesign){
      // Explicitly requested Council phone presentation. Every original form
      // control, option, value, permission owner and node identity remains gated;
      // desktop/print and every other route keep exact computed/pixel comparisons.
      expect(councilContracts).toHaveLength(2);
      const paginationIds=['councilLoadMore','councilNextPage','councilPreviousPage'];
      const native=controls=>controls.filter(control=>!paginationIds.includes(control.id));
      expect(native(councilContracts[0])).toEqual(native(councilContracts[1]));
      expect(native(councilContracts[0]).every(control=>control.count===1&&control.identityPreserved)).toBe(true);
      expect(councilContracts[0].filter(control=>paginationIds.includes(control.id)).map(control=>({id:control.id,tag:control.tag,type:control.type,count:control.count}))).toEqual(paginationIds.map(id=>({id,tag:'button',type:'button',count:1})));
      // PR642 is now in main: its pagination must retain the complete native
      // contract, rather than be treated as a new control absent from baseline.
      expect(councilContracts[0].filter(control=>paginationIds.includes(control.id)))
        .toEqual(councilContracts[1].filter(control=>paginationIds.includes(control.id)));
      expect(comparison.captureStability.current.snapshotStable).toBe(true);
      await info.attach('approved-council-mobile-native-contract.json',{body:Buffer.from(JSON.stringify({current:councilContracts[0],base:councilContracts[1]})),contentType:'application/json'});
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
    if(!mobileRedesign&&!loginRedesign&&!councilRedesign)expect(comparison.pixelComparison.gateAccepted,'Stable raster sources must remain within 2 pixels / 1 channel; nondeterministic Linux raster is diagnostic only when computed/layout snapshots are exact').toBe(true);
  });
}
