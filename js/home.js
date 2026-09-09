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

  window.addEventListener('portal:social-config-updated', (event) => {
    const refreshed = event.detail?.config;
    if (refreshed) window.PortalSocialNavigation?.mount(user, refreshed);
  });

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

  const loading = document.getElementById('homeLoading');
  const fallback = document.getElementById('toolsFallback');
  const socialHome = document.getElementById('socialHome');

  function showHomeSurface(surface) {
    if (loading) {
      loading.hidden = surface !== 'loading';
      loading.setAttribute('aria-busy', surface === 'loading' ? 'true' : 'false');
    }
    if (fallback) fallback.hidden = surface !== 'tools';
    if (socialHome) socialHome.hidden = surface !== 'social';
    document.body.classList.toggle('home-loading-active', surface === 'loading');
  }

  function announceLoading(message) {
    if (loading) loading.setAttribute('aria-label', message);
  }

  function showToolsFallback(message = '') {
    const notice = document.getElementById('homeFallbackNotice');
    showHomeSurface('tools');
    if (notice) {
      notice.textContent = message;
      notice.hidden = !message;
    }
    window.PortalTools?.render(document.getElementById('hubGrid'), user);
  }

  function wait(milliseconds) {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
  }

  function socialErrorIsRetryable(error) {
    const status = Number(error?.status || 0);
    return error?.code === 'SOCIAL_CONFIG_TIMEOUT'
      || error?.code === 'SOCIAL_DATABASE_UNAVAILABLE'
      || error?.code === 'SOCIAL_TEMPORARILY_UNAVAILABLE'
      || [500, 502, 503, 504].includes(status);
  }

  function socialFailureMessage(error) {
    let message = 'A Camada Social está temporariamente indisponível. Suas Ferramentas continuam funcionando normalmente.';
    if (user.role === 'admin') {
      const code = String(error?.code || '').trim();
      const status = Number(error?.status || 0);
      const technical = [code, status ? `HTTP ${status}` : ''].filter(Boolean).join(' · ');
      if (technical) message += ` Diagnóstico: ${technical}.`;
    }
    return message;
  }

  async function loadSocialConfigWithRecovery() {
    try {
      return await social.getConfig(10000);
    } catch (error) {
      if (!socialErrorIsRetryable(error)) throw error;
      announceLoading('Conectando à Camada Social');
      await wait(900);
      return social.getConfig(30000);
    }
  }

  let socialConfig = {
    backendEnabled: false,
    homeEnabled: false,
    available: false,
    toolsPath: '/ferramentas/'
  };
  showHomeSurface('loading');
  try {
    socialConfig = await loadSocialConfigWithRecovery();
  } catch (error) {
    window.PortalSocialNavigation?.mount(user, socialConfig);
    showToolsFallback(socialFailureMessage(error));
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
  try {
    await window.PortalSocialHome.mount(user, socialConfig);
    showHomeSurface('social');
  } catch (error) {
    showToolsFallback(socialFailureMessage(error));
  }
})();
