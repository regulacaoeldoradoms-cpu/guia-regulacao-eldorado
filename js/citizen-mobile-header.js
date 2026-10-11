'use strict';

const INSTANCE = Symbol.for('portal.citizenMobileHeader');
const routes = new Set(['/', '/amigos/', '/perfil/', '/mascotes/']);

// One persistent header owns the original account controls across shared views.
// Route presenters continue to own their content, forms and native permissions.
export function mountCitizenMobileHeader() {
  if (window[INSTANCE]) { window[INSTANCE].sync(); return window[INSTANCE]; }
  const host = document.querySelector('.portal-topbar .portal-user');
  const title = document.querySelector('.portal-brand-copy h1');
  const subtitle = document.querySelector('.portal-brand-copy p');
  if (!host || !title) return null;
  const originalTitle = [...title.childNodes], originalSubtitle = subtitle ? [...subtitle.childNodes] : [];
  const media = matchMedia('screen and (max-width: 900px)'), print = matchMedia('print');
  const positions = new WeakMap();
  let mobile = false, printing = false, queued = false;
  let account = null, logout = null, sideLinks = null;
  const menu = document.createElement('details');
  menu.id = 'homeAccountMenu'; menu.className = 'home-account-menu'; menu.hidden = true;
  const summary = document.createElement('summary'); summary.textContent = 'Conta'; summary.setAttribute('aria-controls','homeAccountPanel');
  const panel = document.createElement('div'); panel.id = 'homeAccountPanel'; panel.className = 'home-account-panel';
  const tools = document.createElement('a'); tools.className = 'home-account-tools'; tools.href = '/ferramentas/'; tools.textContent = 'Ferramentas';
  const label = document.createElement('span'); label.className = 'home-account-label'; label.textContent = 'Perfil';
  panel.append(tools); menu.append(summary,panel); host.append(menu);
  const currentPath = () => window.PortalCitizenShell?.active()?.url.pathname || location.pathname;
  const enabled = () => routes.has(currentPath()) && media.matches && !printing && !print.matches
    && document.body.classList.contains('citizen-readable-layout');
  function mark(node) {
    if (!node?.parentNode || positions.has(node)) return;
    const marker = document.createComment('Shared account original position'); node.before(marker); positions.set(node,marker);
  }
  function move(node,parent,before=null) {
    if (!node || !parent || node===before || (node.parentNode===parent && node.nextSibling===before)) return;
    const focused=node.contains(document.activeElement)?document.activeElement:null;
    parent.insertBefore(node,before); if (focused && focused!==document.activeElement) focused.focus({preventScroll:true});
  }
  function restore(node) { const marker=node && positions.get(node); if (marker?.parentNode) move(node,marker.parentNode,marker.nextSibling); }
  function close(focus=false) { menu.open=false; if (focus) summary.focus({preventScroll:true}); }
  function sync() {
    queued=false;
    const active=enabled(), changing=active!==mobile;
    account ||= host.querySelector('.portal-account-area'); logout ||= document.getElementById('portalLogout');
    sideLinks ||= document.querySelector('#socialHome .social-side-links');
    mark(account); mark(logout); mark(sideLinks);
    document.body.classList.toggle('shared-mobile-header',active);
    menu.hidden=!active;
    if (active) {
      if ([account,logout,sideLinks].some(node=>node?.contains(document.activeElement))) menu.open=true;
      if (account && !account.contains(label)) account.append(label);
      move(logout,panel); move(sideLinks,panel,logout); move(tools,panel,sideLinks || logout); move(account,panel,tools);
      if (title.textContent!=='Portal da regulação') title.textContent='Portal da regulação';
      if (subtitle && subtitle.textContent!=='Eldorado/MS') subtitle.textContent='Eldorado/MS';
    } else if (changing) {
      const focused=document.activeElement; restore(account); restore(logout); restore(sideLinks); label.remove(); close();
      title.replaceChildren(...originalTitle); subtitle?.replaceChildren(...originalSubtitle);
      if (focused===summary && !printing && !print.matches) account?.focus({preventScroll:true});
    }
    mobile=active;
  }
  function schedule() { if (!queued) { queued=true; queueMicrotask(sync); } }
  document.addEventListener('pointerdown',event=>{if(mobile && menu.open && !menu.contains(event.target)) close();});
  document.addEventListener('keydown',event=>{
    if (!mobile || !menu.open || event.key!=='Escape' || event.defaultPrevented || document.querySelector('dialog[open]')) return;
    event.preventDefault(); close(true);
  });
  menu.addEventListener('toggle',()=>{
    if (menu.open) document.querySelectorAll('.home-post-menu[open]').forEach(other=>{other.open=false;});
  });
  document.addEventListener('toggle',event=>{if(event.target.matches?.('.home-post-menu[open]')) close();},true);
  window.addEventListener('portal:citizen-route',()=>{close();sync();});
  media.addEventListener('change',sync); print.addEventListener('change',sync);
  window.addEventListener('beforeprint',()=>{printing=true;sync();});
  window.addEventListener('afterprint',()=>{printing=false;sync();});
  new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
  const controller=Object.freeze({sync}); window[INSTANCE]=controller; sync(); return controller;
}
