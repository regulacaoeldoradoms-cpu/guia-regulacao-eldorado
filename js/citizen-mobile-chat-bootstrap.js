// Mascotes had no desktop chat. Its native runtime starts only after the shared
// mobile presentation is ready, and remains closed outside that presentation.
const INSTANCE = Symbol.for('portal.citizenMobileChatBootstrap');

export function mountCitizenMobileChatBootstrap(directController) {
  if (window[INSTANCE]) { window[INSTANCE].sync(); return window[INSTANCE]; }
  if (location.pathname !== '/mascotes/'
    || !document.body.hasAttribute('data-citizen-mobile-chat-only')) return null;
  const mobile = matchMedia('screen and (max-width: 900px)');
  const print = matchMedia('print');
  let started = false, printing = false, wasActive = false, root = null;
  window.PortalCitizenMobileChatReady = Promise.resolve(false);
  const active = () => mobile.matches && !print.matches && !printing
    && document.body.classList.contains('shared-mobile-navigation');
  const rootObserver = new MutationObserver(sync);

  function sync() {
    const nextRoot = document.getElementById('portalChatRoot');
    if (nextRoot !== root) {
      rootObserver.disconnect();
      root = nextRoot;
      if (root) rootObserver.observe(root, { attributes: true, attributeFilter: ['class'] });
    }
    const isActive = active();
    const leavingMobile = wasActive && !isActive;
    wasActive = isActive;
    if (!isActive) {
      // Use the same native close as Início: an invisible open conversation
      // would still count as visible for native read/typing state. Direct saves
      // its conversation position and restores it only on the next user open.
      if (leavingMobile || root?.classList.contains('open')) directController.closeToPage();
      return;
    }
    if (started) return;
    started = true;
    window.PortalCitizenMobileChatReady = (async () => {
      await import('/js/portal-global-chat.js?v=20261008-chat-groups-1');
      const ready = Boolean(await window.PortalGlobalChat?.start());
      // Also reconcile a resize while the native assets were loading.
      sync();
      return ready;
    })().catch(error => {
      started = false;
      console.warn('Mobile native chat unavailable', error);
      return false;
    });
  }
  mobile.addEventListener('change', sync);
  print.addEventListener('change', sync);
  window.addEventListener('beforeprint', () => { printing = true; sync(); });
  window.addEventListener('afterprint', () => { printing = false; sync(); });
  new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  new MutationObserver(() => {
    if (document.getElementById('portalChatRoot') !== root) sync();
  }).observe(document.body, { childList: true, subtree: true });
  const controller = Object.freeze({ sync });
  window[INSTANCE] = controller;
  sync();
  return controller;
}
