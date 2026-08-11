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

  function destinationFor(user) {
    if (user?.mustChangePassword) return '/conta/?primeiro-acesso=1';
    const params = new URLSearchParams(location.search);
    const requested = params.get('next');
    const safeNext = requested && requested.startsWith('/') && !requested.startsWith('//') ? requested : null;
    return safeNext || config.homePath || '/home/';
  }

  async function redirectIfAuthenticated() {
    if (!window.RegulationAuth?.enforcementEnabled) return;
    const user = await window.RegulationAuth.me().catch(() => null);
    if (user) location.replace(destinationFor(user));
  }

  if (!window.RegulationAuth?.enforcementEnabled) {
    showStatus('A autenticação está em fase final de configuração. O acesso por perfil ainda não foi tornado obrigatório.', 'info');
  }

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    submit.disabled = true;
    submit.textContent = 'Entrando...';
    status.className = 'login-status';
    try {
      const user = await window.RegulationAuth.login(username.value, password.value, remember.checked);
      location.replace(destinationFor(user));
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
      submit.disabled = false;
      submit.textContent = 'Entrar';
    }
  });

  redirectIfAuthenticated();
})();
