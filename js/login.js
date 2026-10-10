'use strict';

(() => {
  const isLocal = ['localhost', '127.0.0.1'].includes(location.hostname);
  if (!isLocal && location.protocol !== 'https:') {
    const secureUrl = new URL(location.href);
    secureUrl.protocol = 'https:';
    location.replace(secureUrl.toString());
    return;
  }

  const form = document.getElementById('loginForm');
  const username = document.getElementById('loginUsername');
  const password = document.getElementById('loginPassword');
  const remember = document.getElementById('loginRemember');
  const submit = document.getElementById('loginSubmit');
  const status = document.getElementById('loginStatus');
  const config = window.REGULATION_AUTH_CONFIG || {};

  function showStatus(message, type = 'error') {
    status.textContent = message;
    status.className = `login-status visible ${type}`;
  }

  function defaultDestination(user) {
    if (user?.role === 'cidadao') {
      if (user?.councilRole === 'presidente' || user?.councilRole === 'membro') return '/conselho/painel/';
      return '/';
    }
    return config.homePath || '/';
  }

  function safeRequestedDestination() {
    const params = new URLSearchParams(location.search);
    const requested = params.get('next');
    return requested && requested.startsWith('/') && !requested.startsWith('//') ? requested : null;
  }

  function destinationFor(user) {
    if (user?.mustChangePassword) return '/seguranca/?primeiro-acesso=1';
    const requested = safeRequestedDestination();
    if (user?.emailVerificationRequired) {
      const next = encodeURIComponent(requested || defaultDestination(user));
      return `/seguranca/?verificar-email=1&next=${next}`;
    }
    return requested || defaultDestination(user);
  }

  let loginInFlight = false;
  let loginStarted = false;

  async function redirectIfAuthenticated() {
    if (loginStarted) return;
    if (!window.RegulationAuth?.enforcementEnabled) return;
    const cached = window.RegulationAuth.getToken?.() && window.RegulationAuth.getCachedUser?.();
    if (cached && window.RegulationAuth.sessionValidationAge?.() < 45000) {
      window.PortalPerformance?.warmForUser?.(cached, { immediate: true });
      location.replace(destinationFor(cached));
      return;
    }
    const user = await window.RegulationAuth.me().catch(() => null);
    if (user && !loginStarted) {
      window.PortalPerformance?.warmForUser?.(user, { immediate: true });
      location.replace(destinationFor(user));
    }
  }

  if (!window.RegulationAuth?.enforcementEnabled) {
    showStatus('A autenticação está em fase final de configuração. O acesso por perfil ainda não foi tornado obrigatório.', 'info');
  }

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (loginInFlight) return;
    loginStarted = true;
    loginInFlight = true;
    try { window.PortalLoginOpening?.primeFromGesture?.(); } catch (_) {}
    submit.disabled = true;
    submit.setAttribute('aria-busy', 'true');
    submit.textContent = 'Entrando...';
    status.className = 'login-status';
    try {
      const user = await window.RegulationAuth.login(username.value, password.value, remember.checked);
      try { window.PortalPerformance?.warmForUser?.(user, { immediate: true }); } catch (_) {}
      // Autenticação já concluída. Apenas a transição aguarda a mídia, com prazo e fallback.
      let transition;
      try { transition = await window.PortalLoginOpening?.beforeNavigate?.({ destination: destinationFor(user) }); } catch (_) {}
      if (!transition?.handled) location.replace(destinationFor(user));
    } catch (error) {
      let message;
      if (error.status === 404) {
        message = 'O serviço de login ainda não está publicado no Worker da Cloudflare.';
      } else if (error instanceof TypeError || /failed to fetch/i.test(String(error?.message || ''))) {
        message = 'Não foi possível conectar ao servidor de autenticação. Confirme que o portal abriu em HTTPS e tente novamente.';
      } else {
        message = error.message || 'Não foi possível entrar.';
      }
      showStatus(message, 'error');
    } finally {
      loginInFlight = false;
      submit.removeAttribute('aria-busy');
      submit.disabled = false;
      submit.textContent = 'Entrar';
    }
  });

  redirectIfAuthenticated();
})();
