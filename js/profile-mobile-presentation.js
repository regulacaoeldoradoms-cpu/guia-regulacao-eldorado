'use strict';

// Profile presentation only. The original social renderer owns profile data,
// permissions, photo actions, module order and the customization forms.
const currentPath = () => window.PortalCitizenShell?.active()?.url.pathname || location.pathname;
const INSTANCE = Symbol.for('portal.profileMobilePresentation');

export function mountProfileMobilePresentation() {
  if (window[INSTANCE]) { window[INSTANCE].sync(); return window[INSTANCE]; }
  if (currentPath() !== '/perfil/') return null;
  const media = matchMedia('screen and (max-width: 900px)');
  const printMedia = matchMedia('print');
  let printing = false;
  function sync() {
    const active = currentPath() === '/perfil/' && media.matches && !printing && !printMedia.matches
      && document.body.classList.contains('citizen-readable-layout')
      && document.body.classList.contains('shared-mobile-navigation');
    document.body.classList.toggle('profile-mobile-layout',active);
  }
  media.addEventListener('change',sync);
  printMedia.addEventListener('change',sync);
  window.addEventListener('beforeprint',()=>{printing=true;sync();});
  window.addEventListener('afterprint',()=>{printing=false;sync();});
  window.addEventListener('portal:citizen-route',sync);
  const controller=Object.freeze({sync}); window[INSTANCE]=controller; sync(); return controller;
}
