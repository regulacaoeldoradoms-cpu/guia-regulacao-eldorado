'use strict';

(async () => {
  const auth = window.RegulationAuth;
  const social = window.PortalSocial;
  const user = await auth.requireRole([]);
  if (!user) return;
  if (user.mustChangePassword) {
    location.replace('/conta/?primeiro-acesso=1');
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

  document.getElementById('portalLogout')?.addEventListener('click', async () => {
    await auth.logout();
    location.replace('/login/');
  });
})();
