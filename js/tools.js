(() => {
'use strict';

const initializeCitizenArea = async (context) => {
  const window = context?.window || globalThis;
  const document = context?.document || globalThis.document;
  const auth = window.RegulationAuth;
  const social = window.PortalSocial;
  const user = await auth.requireRole([]);
  if (!user) return;
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
