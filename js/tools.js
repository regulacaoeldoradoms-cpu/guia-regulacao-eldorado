(() => {
'use strict';

const initializeCitizenArea = async (context) => {
  const window = context?.window || globalThis;
  const document = context?.document || globalThis.document;
  const auth = window.RegulationAuth;
  const social = window.PortalSocial;
  const user = await auth.requireRole([]);
  if (!user) return;
  const hero = document.querySelector('[data-tools-mobile-layout] .portal-hero-copy');
  if (hero) {
    const heading = hero.querySelector('h2'), paragraph = hero.querySelector('p');
    const original = window[Symbol.for('portal.toolsEarlyCopies')]?.get(hero)
      || { heading:[...heading.childNodes], paragraph:[...paragraph.childNodes] };
    const media = matchMedia('screen and (max-width:900px)');
    let mobile = false, printing = false;
    function syncCopy() {
      const enabled = user.role === 'cidadao' && media.matches && !printing;
      if (enabled) { heading.textContent = 'Seus atalhos'; paragraph.textContent = 'Acesse os serviços disponíveis para sua conta.'; }
      else if (mobile || window[Symbol.for('portal.toolsEarlyCopies')]?.has(hero)) {
        heading.replaceChildren(...original.heading); paragraph.replaceChildren(...original.paragraph);
      }
      mobile = enabled;
    }
    media.addEventListener('change',syncCopy);
    context?.controllers?.push({dispose:()=>media.removeEventListener('change',syncCopy)});
    window.addEventListener('beforeprint',()=>{printing=true;syncCopy();});
    window.addEventListener('afterprint',()=>{printing=false;syncCopy();});
    syncCopy();
  }
  if (user.role !== 'cidadao') document.querySelector('[data-tools-mobile-layout]')?.removeAttribute('data-tools-mobile-layout');
  if (user.mustChangePassword) {
    location.replace('/seguranca/?primeiro-acesso=1');
    return;
  }
  document.getElementById('portalUserName').textContent = user.name || user.username || 'Usuário';
  const role = document.getElementById('portalUserRole');
  if (role) role.textContent = window.PortalTools?.roleLabels?.[user.role] || user.role || '';
  window.PortalTools?.render(document.getElementById('toolsGrid'), user);

  let socialConfig = { backendEnabled: false, available: false };
  window.PortalSocialNavigation?.mount(user, socialConfig);
  try { socialConfig = await social.getConfig(); }
  catch (_) {}
  window.PortalSocialNavigation?.mount(user, socialConfig);

  if (!context) document.getElementById('portalLogout')?.addEventListener('click', async () => {
    await auth.logout();
    location.replace('/login/');
  });
};
if (window.PortalCitizenShell) window.PortalCitizenShell.register('tools', initializeCitizenArea);
else initializeCitizenArea();

})();
