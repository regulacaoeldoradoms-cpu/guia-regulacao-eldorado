'use strict';

(() => {
  const isLocal = ['localhost', '127.0.0.1'].includes(location.hostname);
  if (!isLocal && location.protocol !== 'https:') {
    const secureUrl = new URL(location.href);
    secureUrl.protocol = 'https:';
    location.replace(secureUrl.toString());
    return;
  }

  /* Ajustes exclusivamente mobile. O desktop não recebe estas regras. */
  if (document.body.classList.contains('mobile-login-mode')) {
    const style = document.createElement('style');
    style.id = 'mobile-login-height-fill';
    style.textContent = `
      body.mobile-login-mode .login-layout{
        width:100vw !important;
        min-height:100dvh !important;
      }

      /* Topo azul: mantém a tipografia aprovada e reduz apenas espaços verticais. */
      body.mobile-login-mode .login-visual{
        padding:14px clamp(20px,4.5vw,46px) 14px !important;
        gap:8px !important;
      }

      body.mobile-login-mode .login-portal-logo{
        width:min(540px,70vw) !important;
      }

      body.mobile-login-mode .login-message{
        width:94vw !important;
        max-width:none !important;
      }

      body.mobile-login-mode .portal-eyebrow{
        font-size:clamp(16px,1.95vw,21px) !important;
      }

      body.mobile-login-mode .login-message h1{
        margin:0 0 7px !important;
        font-size:clamp(36px,4.8vw,50px) !important;
        line-height:1.04 !important;
      }

      body.mobile-login-mode .login-message p{
        margin:0 !important;
        font-size:clamp(20px,2.55vw,27px) !important;
        line-height:1.38 !important;
      }

      body.mobile-login-mode .login-message > div{
        margin-top:9px !important;
        gap:7px !important;
        font-size:clamp(14px,1.8vw,19px) !important;
      }

      body.mobile-login-mode .login-message > div span{
        padding:6px 10px !important;
      }

      body.mobile-login-mode .login-visual > small{
        width:94vw !important;
        max-width:none !important;
        margin-top:0 !important;
        font-size:clamp(14px,1.7vw,18px) !important;
        line-height:1.2 !important;
      }

      /* Área branca: preserva as letras grandes e economiza somente altura. */
      body.mobile-login-mode .login-panel{
        display:block !important;
        width:100vw !important;
        min-height:0 !important;
        padding:0 1.2vw max(12px,env(safe-area-inset-bottom)) !important;
        background:#f3f7fb !important;
      }

      body.mobile-login-mode .login-card{
        position:relative !important;
        z-index:2 !important;
        width:97.6vw !important;
        max-width:none !important;
        min-height:0 !important;
        height:auto !important;
        margin:-18px auto 0 !important;
        padding:22px clamp(30px,4.6vw,50px) 18px !important;
        display:block !important;
        border-radius:clamp(24px,3vw,32px) !important;
        box-shadow:0 18px 44px rgba(22,56,91,.14) !important;
      }

      body.mobile-login-mode .login-card h2{
        margin:0 !important;
        font-size:clamp(48px,6.1vw,64px) !important;
        font-weight:800 !important;
        line-height:1.02 !important;
        letter-spacing:-.025em !important;
      }

      body.mobile-login-mode .login-card > p{
        margin:7px 0 16px !important;
        font-size:clamp(26px,3.3vw,36px) !important;
        line-height:1.28 !important;
      }

      body.mobile-login-mode .portal-field{
        margin-bottom:14px !important;
      }

      body.mobile-login-mode .portal-field label{
        display:block !important;
        margin-bottom:6px !important;
        font-size:clamp(24px,3vw,32px) !important;
        font-weight:800 !important;
        line-height:1.15 !important;
      }

      body.mobile-login-mode .portal-field input{
        min-height:66px !important;
        padding:12px 20px !important;
        font-size:clamp(25px,3.2vw,35px) !important;
        line-height:1.15 !important;
        border-radius:clamp(16px,2.2vw,22px) !important;
      }

      body.mobile-login-mode .login-card > label{
        margin:0 0 14px !important;
        gap:10px !important;
        font-size:clamp(22px,2.8vw,30px) !important;
        line-height:1.25 !important;
      }

      body.mobile-login-mode #loginRemember{
        width:clamp(28px,3.5vw,38px) !important;
        height:clamp(28px,3.5vw,38px) !important;
        flex:0 0 clamp(28px,3.5vw,38px) !important;
      }

      body.mobile-login-mode .login-submit{
        width:100% !important;
        min-height:64px !important;
        margin:0 !important;
        font-size:clamp(25px,3.25vw,36px) !important;
        font-weight:800 !important;
        border-radius:clamp(16px,2.2vw,22px) !important;
      }

      body.mobile-login-mode .login-status:not(.visible){
        min-height:0 !important;
        margin:0 !important;
        padding:0 !important;
      }

      body.mobile-login-mode .login-card > div:last-child{
        margin-top:16px !important;
        padding-top:14px !important;
        border-top:1px solid #dbe5ee !important;
      }

      body.mobile-login-mode .login-card > div:last-child strong{
        display:block !important;
        margin-bottom:7px !important;
        font-size:clamp(28px,3.55vw,38px) !important;
        font-weight:800 !important;
        line-height:1.12 !important;
      }

      body.mobile-login-mode .login-card > div:last-child span{
        display:block !important;
        max-width:92vw !important;
        margin:0 auto 11px !important;
        font-size:clamp(23px,2.95vw,32px) !important;
        line-height:1.32 !important;
      }

      body.mobile-login-mode .login-card > div:last-child .portal-button{
        display:flex !important;
        width:100% !important;
        min-height:56px !important;
        padding:10px 24px !important;
        font-size:clamp(23px,2.95vw,32px) !important;
        font-weight:800 !important;
        border-radius:clamp(15px,2vw,20px) !important;
        text-decoration:none !important;
      }

      body.mobile-login-mode .login-card > div:last-child small{
        display:block !important;
        max-width:92vw !important;
        margin:9px auto 0 !important;
        font-size:clamp(18px,2.25vw,25px) !important;
        line-height:1.25 !important;
      }

      body.mobile-login-mode.login-intro-collapsed .login-portal-logo{
        width:min(290px,46vw) !important;
      }

      body.mobile-login-mode.login-intro-collapsed .login-visual{
        padding-top:6px !important;
        padding-bottom:6px !important;
      }
    `;
    document.head.appendChild(style);
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
      if (user?.councilRole === 'presidente') return '/conselho/painel/';
      return '/cidadao/';
    }
    return config.homePath || '/';
  }

  function safeRequestedDestination() {
    const params = new URLSearchParams(location.search);
    const requested = params.get('next');
    return requested && requested.startsWith('/') && !requested.startsWith('//') ? requested : null;
  }

  function destinationFor(user) {
    if (user?.mustChangePassword) return '/conta/?primeiro-acesso=1';
    const requested = safeRequestedDestination();
    if (user?.emailVerificationRequired) {
      const next = encodeURIComponent(requested || defaultDestination(user));
      return `/conta/?verificar-email=1&next=${next}`;
    }
    return requested || defaultDestination(user);
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
