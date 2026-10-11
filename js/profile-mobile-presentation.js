'use strict';

// Profile presentation only. The original social renderer owns profile data,
// permissions, photo actions, module order and the customization forms.
const currentPath = () => window.PortalCitizenShell?.active()?.url.pathname || location.pathname;
const INSTANCE = Symbol.for('portal.profileMobilePresentation');

export function mountProfileMobilePresentation() {
  if (window[INSTANCE]) { window[INSTANCE].sync(); return window[INSTANCE]; }
  const host = document.querySelector('.portal-topbar .portal-user');
  if (currentPath() !== '/perfil/' || !host) return null;
  const media = matchMedia('screen and (max-width: 900px)');
  const printMedia = matchMedia('print');
  const title = document.querySelector('.portal-brand-copy h1');
  const titleNodes = title ? [...title.childNodes] : [];
  const positions = new WeakMap();
  let printing = false, mobile = false, queued = false;
  let account = null, logout = null;
  const enabled = () => currentPath() === '/perfil/' && media.matches && !printing && !printMedia.matches
    && document.body.classList.contains('citizen-readable-layout')
    && document.body.classList.contains('shared-mobile-navigation');
  const menu = document.createElement('details');
  menu.id = 'profileAccountMenu';
  menu.className = 'profile-account-menu';
  menu.hidden = true;
  const summary = document.createElement('summary');
  summary.textContent = 'Conta';
  summary.setAttribute('aria-controls', 'profileAccountPanel');
  const panel = document.createElement('div');
  panel.id = 'profileAccountPanel';
  menu.append(summary, panel);
  host.append(menu);

  function mark(node) {
    if (!node?.parentNode || positions.has(node)) return;
    const marker = document.createComment('Profile account original position');
    node.before(marker);
    positions.set(node, marker);
  }
  function move(node, parent, before = null) {
    if (!node || !parent || node === before || (node.parentNode === parent && node.nextSibling === before)) return;
    const focused = node.contains(document.activeElement) ? document.activeElement : null;
    parent.insertBefore(node, before);
    if (focused && focused !== document.activeElement) focused.focus({ preventScroll: true });
  }
  function restore(node) {
    const marker = node && positions.get(node);
    if (marker?.parentNode) move(node, marker.parentNode, marker.nextSibling);
  }
  function sync() {
    queued = false;
    const active = enabled();
    // After restoring once, an inactive presenter must not compete with Home
    // for the same native account controls.
    if (!active && !mobile) return;
    const focused = document.activeElement;
    // Wait for auth-client to wrap its own meta node; moving bare meta earlier
    // would break that renderer's insertBefore(container, meta) contract.
    account = host.querySelector('.portal-account-area');
    logout = host.querySelector('#portalLogout');
    mark(account);
    mark(logout);
    if (active) {
      document.body.classList.add('profile-mobile-layout');
      menu.hidden = false;
      if ([account, logout].some(node => node?.contains(focused))) menu.open = true;
      move(logout, panel);
      move(account, panel, panel.firstChild);
      if (title && title.textContent !== 'Regulação') title.textContent = 'Regulação';
    } else {
      // Restore first so a focused native control is never hidden mid-move.
      restore(account);
      restore(logout);
      menu.hidden = true;
      menu.open = false;
      document.body.classList.remove('profile-mobile-layout');
      if (mobile && title && currentPath() === '/perfil/') title.replaceChildren(...titleNodes);
      if (focused === summary && !printing && !printMedia.matches) account?.focus({ preventScroll: true });
    }
    mobile = active;
  }
  function schedule() {
    if (queued) return;
    queued = true;
    queueMicrotask(sync);
  }
  document.addEventListener('click', event => {
    if (mobile && menu.open && !menu.contains(event.target)) menu.open = false;
  });
  document.addEventListener('keydown', event => {
    if (mobile && menu.open && event.key === 'Escape') {
      event.preventDefault();
      menu.open = false;
      summary.focus({ preventScroll: true });
    }
  });
  media.addEventListener('change', sync);
  printMedia.addEventListener('change', sync);
  window.addEventListener('beforeprint', () => { printing = true; sync(); });
  window.addEventListener('afterprint', () => { printing = false; sync(); });
  window.addEventListener('portal:session-ready', schedule);
  window.addEventListener('portal:session-cleared', schedule);
  new MutationObserver(schedule).observe(host, { childList: true, subtree: true });
  new MutationObserver(() => { if (enabled() !== mobile) schedule(); })
    .observe(document.body, { attributes: true, attributeFilter: ['class'] });
  window[INSTANCE] = Object.freeze({ sync });
  sync();
  return window[INSTANCE];
}
