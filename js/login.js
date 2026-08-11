'use strict';

(() => {
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

  async function redirectIfAuthenticated() {
    if (!window.RegulationAuth?.enforcementEnabled) return;
    const user = await window.RegulationAuth.me().catch(() => null);
    if (user) location.replace(config.homePath || '/home/');
  }

  if (!window.RegulationAuth?.enforcementEnabled) {
    showStatus('A interface do portal está pronta, mas a autenticação ainda não foi ativada no servidor. O guia atual continua acessível durante esta etapa de configuração.', 'info');
  }

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    submit.disabled = true;
    submit.textContent = 'Entrando...';
    status.className = 'login-status';
    try {
      const user = await window.RegulationAuth.login(username.value, password.value, remember.checked);
      const params = new URLSearchParams(location.search);
      const requested = params.get('next');
      const safeNext = requested && requested.startsWith('/') && !requested.startsWith('//') ? requested : null;
      location.replace(safeNext || config.homePath || '/home/');
    } catch (error) {
      const message = error.status === 404
        ? 'O serviço de login ainda não está publicado no Worker da Cloudflare.'
        : error.message || 'Não foi possível entrar.';
      showStatus(message, 'error');
    } finally {
      submit.disabled = false;
      submit.textContent = 'Entrar';
    }
  });

  redirectIfAuthenticated();
})();
