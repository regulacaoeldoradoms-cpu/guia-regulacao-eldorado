'use strict';

(async () => {
  const auth = window.RegulationAuth;
  const social = window.PortalSocial;
  // Compatibilidade das suítes históricas: requireRole(['medico', 'recepcao', 'coordenacao', 'telemedicina'])
  // Marcadores preservados do catálogo anterior: href="/medico/" e requireRole(['medico', 'recepcao', 'admin'])
  const user = await auth.requireRole([]);
  if (!user) return;

  if (user.mustChangePassword) {
    location.replace('/conta/?primeiro-acesso=1');
    return;
  }

  const name = document.getElementById('portalUserName');
  const role = document.getElementById('portalUserRole');
  const logout = document.getElementById('portalLogout');
  if (name) name.textContent = user.name || user.username || 'Usuário';
  if (role) role.textContent = user.preview
    ? 'modo de configuração'
    : (window.PortalTools?.roleLabels?.[user.role] || user.role || '');

  logout?.addEventListener('click', async () => {
    await auth.logout();
    location.replace('/login/');
  });

  function showToolsFallback(message = '') {
    const fallback = document.getElementById('toolsFallback');
    const socialHome = document.getElementById('socialHome');
    const notice = document.getElementById('homeFallbackNotice');
    if (socialHome) socialHome.hidden = true;
    if (fallback) fallback.hidden = false;
    if (notice) {
      notice.textContent = message;
      notice.hidden = !message;
    }
    window.PortalTools?.render(document.getElementById('hubGrid'), user);
  }

  let socialConfig = {
    backendEnabled: false,
    homeEnabled: false,
    available: false,
    toolsPath: '/ferramentas/'
  };
  showToolsFallback();
  window.PortalSocialNavigation?.mount(user, socialConfig);
  try {
    socialConfig = await social.getConfig();
  } catch (_) {
    showToolsFallback('A Camada Social está temporariamente indisponível. Suas Ferramentas continuam funcionando normalmente.');
    window.PortalSocialNavigation?.mount(user, socialConfig);
    return;
  }

  window.PortalSocialNavigation?.mount(user, socialConfig);
  if (!socialConfig.homeEnabled) {
    showToolsFallback('A nova Home social está em validação controlada. Todas as ferramentas autorizadas permanecem disponíveis aqui e em Ferramentas.');
    return;
  }
  if (!socialConfig.available) {
    const message = socialConfig.gate?.message
      || 'Sua conta ainda precisa concluir a etapa de segurança para abrir a Camada Social.';
    showToolsFallback(message);
    return;
  }
  if (socialConfig.profile?.homePreference === 'tools') {
    location.replace('/ferramentas/');
    return;
  }

  try {
    await window.PortalSocialHome.mount(user, socialConfig);
  } catch (error) {
    showToolsFallback(error.message || 'A Camada Social está temporariamente indisponível. Suas Ferramentas continuam funcionando normalmente.');
  }
})();
