'use strict';

(() => {
  const isLocal = ['localhost', '127.0.0.1'].includes(location.hostname);
  if (!isLocal && location.protocol !== 'https:') {
    const secureUrl = new URL(location.href);
    secureUrl.protocol = 'https:';
    location.replace(secureUrl.toString());
    return;
  }

  /*
    Refinamento exclusivamente mobile.
    Mantém tipografia e controles grandes, mas elimina o vazio artificial criado
    pelo card esticado. O desktop permanece intocado.
  */
  if (document.body.classList.contains('mobile-login-mode')) {
    const style = document.createElement('style');
    style.id = 'mobile-login-height-fill';
    style.textContent = `
      body.mobile-login-mode .login-layout{
        width:100vw !important;
        min-height:100dvh !important;
      }

      body.mobile-login-mode .login-visual{
        padding:clamp(18px,2.5vw,28px) clamp(18px,4vw,42px) clamp(24px,3.2vw,34px) !important;
        gap:clamp(12px,1.6vw,18px) !important;
      }

      body.mobile-login-mode .login-portal-logo{
        width:min(470px,62vw) !important;
      }

      body.mobile-login-mode .login-message{
        width:92vw !important;
        max-width:none !important;
      }

      body.mobile-login-mode .portal-eyebrow{
        font-size:clamp(14px,1.7vw,19px) !important;
      }

      body.mobile-login-mode .login-message h1{
        margin:0 0 clamp(10px,1.4vw,15px) !important;
        font-size:clamp(31px,4.1vw,43px) !important;
        line-height:1.08 !important;
      }

      body.mobile-login-mode .login-message p{
        font-size:clamp(17px,2.2vw,23px) !important;
        line-height:1.48 !important;
      }

      body.mobile-login-mode .login-message > div{
        margin-top:clamp(14px,1.8vw,20px) !important;
        gap:clamp(7px,1vw,11px) !important;
        font-size:clamp(13px,1.55vw,17px) !important;
      }

      body.mobile-login-mode .login-message > div span{
        padding:clamp(7px,.9vw,9px) clamp(9px,1.3vw,13px) !important;
      }

      body.mobile-login-mode .login-visual > small{
        width:92vw !important;
        max-width:none !important;
        font-size:clamp(12px,1.45vw,16px) !important;
        line-height:1.35 !important;
      }

      body.mobile-login-mode .login-panel{
        flex:1 0 auto !important;
        display:block !important;
        width:100vw !important;
        min-height:0 !important;
        padding:0 2vw max(34px,env(safe-area-inset-bottom)) !important;
        background:#f3f7fb !important;
      }

      body.mobile-login-mode .login-card{
        position:relative !important;
        z-index:2 !important;
        width:96vw !important;
        max-width:none !important;
        min-height:0 !important;
        height:auto !important;
        margin:-14px auto 0 !important;
        padding:clamp(30px,4vw,42px) clamp(26px,4vw,42px) clamp(28px,3.8vw,40px) !important;
        display:block !important;
        border-radius:clamp(22px,2.8vw,30px) !important;
        box-shadow:0 18px 44px rgba(22,56,91,.14) !important;
      }

      body.mobile-login-mode .login-card h2{
        margin:0 !important;
        font-size:clamp(34px,4.15vw,44px) !important;
        line-height:1.12 !important;
      }

      body.mobile-login-mode .login-card > p{
        margin:clamp(10px,1.4vw,15px) 0 clamp(26px,3vw,34px) !important;
        font-size:clamp(19px,2.3vw,24px) !important;
        line-height:1.45 !important;
      }

      body.mobile-login-mode .portal-field{
        margin-bottom:clamp(20px,2.7vw,28px) !important;
      }

      body.mobile-login-mode .portal-field label{
        margin-bottom:clamp(8px,1.1vw,11px) !important;
        font-size:clamp(17px,2vw,22px) !important;
      }

      body.mobile-login-mode .portal-field input{
        min-height:clamp(62px,7.6vw,78px) !important;
        padding:clamp(15px,1.9vw,19px) clamp(16px,2.2vw,22px) !important;
        font-size:clamp(19px,2.3vw,24px) !important;
        border-radius:clamp(13px,1.7vw,17px) !important;
      }

      body.mobile-login-mode .login-card > label{
        margin:0 0 clamp(22px,2.8vw,30px) !important;
        gap:clamp(10px,1.3vw,14px) !important;
        font-size:clamp(17px,2vw,22px) !important;
        line-height:1.4 !important;
      }

      body.mobile-login-mode #loginRemember{
        width:clamp(22px,2.7vw,28px) !important;
        height:clamp(22px,2.7vw,28px) !important;
        flex:0 0 clamp(22px,2.7vw,28px) !important;
      }

      body.mobile-login-mode .login-submit{
        width:100% !important;
        min-height:clamp(62px,7.8vw,80px) !important;
        margin:0 !important;
        font-size:clamp(19px,2.35vw,25px) !important;
        border-radius:clamp(13px,1.8vw,18px) !important;
      }

      body.mobile-login-mode .login-status:not(.visible){
        min-height:0 !important;
        margin:0 !important;
        padding:0 !important;
      }

      body.mobile-login-mode .login-card > div:last-child{
        margin-top:clamp(28px,3.6vw,38px) !important;
        padding-top:clamp(24px,3.2vw,34px) !important;
        border-top:1px solid #dbe5ee !important;
      }

      body.mobile-login-mode .login-card > div:last-child strong{
        margin-bottom:clamp(10px,1.3vw,14px) !important;
        font-size:clamp(20px,2.35vw,25px) !important;
      }

      body.mobile-login-mode .login-card > div:last-child span{
        max-width:88vw !important;
        margin:0 auto clamp(18px,2.3vw,24px) !important;
        font-size:clamp(17px,2vw,22px) !important;
        line-height:1.5 !important;
      }

      body.mobile-login-mode .login-card > div:last-child .portal-button{
        display:flex !important;
        width:100% !important;
        min-height:clamp(56px,6.8vw,70px) !important;
        padding:clamp(12px,1.6vw,17px) clamp(20px,2.6vw,28px) !important;
        font-size:clamp(17px,2.05vw,22px) !important;
        border-radius:clamp(12px,1.6vw,16px) !important;
        text-decoration:none !important;
      }

      body.mobile-login-mode .login-card > div:last-child small{
        max-width:88vw !important;
        margin:clamp(16px,2vw,20px) auto 0 !important;
        font-size:clamp(14px,1.65vw,18px) !important;
        line-height:1.45 !important;
      }

      body.mobile-login-mode.login-intro-collapsed .login-portal-logo{
        width:min(250px,40vw) !important;
      }

      body.mobile-login-mode.login-intro-collapsed .login-visual{
        padding-top:7px !important;
        padding-bottom:8px !important;
      }

      @media(max-height:760px){
        body.mobile-login-mode .login-card{
          margin-top:-10px !important;
          padding-top:26px !important;
          padding-bottom:26px !important;
        }
        body.mobile-login-mode .portal-field input,
        body.mobile-login-mode .login-submit{
          min-height:58px !important;
        }
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
