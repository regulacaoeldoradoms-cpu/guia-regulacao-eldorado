'use strict';

(() => {
  const isLocal = ['localhost', '127.0.0.1'].includes(location.hostname);
  if (!isLocal && location.protocol !== 'https:') {
    const secureUrl = new URL(location.href);
    secureUrl.protocol = 'https:';
    location.replace(secureUrl.toString());
    return;
  }

  /* Ajustes exclusivamente mobile. O desktop permanece intocado. */
  if (document.body.classList.contains('mobile-login-mode')) {
    const style = document.createElement('style');
    style.id = 'mobile-login-height-fill';
    style.textContent = `
      body.mobile-login-mode .login-layout{
        width:100vw !important;
        min-height:100dvh !important;
      }

      body.mobile-login-mode .login-visual{
        padding:clamp(22px,3vw,34px) clamp(20px,4.5vw,46px) clamp(26px,3.5vw,38px) !important;
        gap:clamp(14px,1.8vw,20px) !important;
      }

      body.mobile-login-mode .login-portal-logo{
        width:min(560px,72vw) !important;
      }

      body.mobile-login-mode .login-message{
        width:94vw !important;
        max-width:none !important;
      }

      body.mobile-login-mode .portal-eyebrow{
        font-size:clamp(18px,2.15vw,24px) !important;
      }

      body.mobile-login-mode .login-message h1{
        margin:0 0 clamp(12px,1.6vw,18px) !important;
        font-size:clamp(40px,5.2vw,56px) !important;
        line-height:1.07 !important;
      }

      body.mobile-login-mode .login-message p{
        font-size:clamp(22px,2.85vw,30px) !important;
        line-height:1.58 !important;
      }

      body.mobile-login-mode .login-message > div{
        margin-top:clamp(16px,2vw,22px) !important;
        gap:clamp(8px,1.2vw,13px) !important;
        font-size:clamp(16px,2vw,21px) !important;
      }

      body.mobile-login-mode .login-message > div span{
        padding:clamp(8px,1vw,11px) clamp(11px,1.5vw,16px) !important;
      }

      body.mobile-login-mode .login-visual > small{
        width:94vw !important;
        max-width:none !important;
        font-size:clamp(15px,1.9vw,20px) !important;
        line-height:1.45 !important;
      }

      body.mobile-login-mode .login-panel{
        flex:1 0 auto !important;
        display:block !important;
        width:100vw !important;
        min-height:0 !important;
        padding:0 1.5vw max(30px,env(safe-area-inset-bottom)) !important;
        background:#f3f7fb !important;
      }

      body.mobile-login-mode .login-card{
        position:relative !important;
        z-index:2 !important;
        width:97vw !important;
        max-width:none !important;
        min-height:0 !important;
        height:auto !important;
        margin:-16px auto 0 !important;
        padding:clamp(34px,4.6vw,50px) clamp(28px,4.4vw,48px) clamp(30px,4.2vw,44px) !important;
        display:block !important;
        border-radius:clamp(24px,3vw,32px) !important;
        box-shadow:0 18px 44px rgba(22,56,91,.14) !important;
      }

      body.mobile-login-mode .login-card h2{
        margin:0 !important;
        font-size:clamp(44px,5.5vw,58px) !important;
        line-height:1.1 !important;
      }

      body.mobile-login-mode .login-card > p{
        margin:clamp(12px,1.7vw,18px) 0 clamp(30px,3.7vw,40px) !important;
        font-size:clamp(24px,3vw,32px) !important;
        line-height:1.55 !important;
      }

      body.mobile-login-mode .portal-field{
        margin-bottom:clamp(24px,3.1vw,34px) !important;
      }

      body.mobile-login-mode .portal-field label{
        display:block !important;
        margin-bottom:clamp(9px,1.3vw,13px) !important;
        font-size:clamp(21px,2.7vw,28px) !important;
      }

      body.mobile-login-mode .portal-field input{
        min-height:clamp(72px,9vw,92px) !important;
        padding:clamp(17px,2.2vw,22px) clamp(18px,2.6vw,27px) !important;
        font-size:clamp(24px,3vw,32px) !important;
        border-radius:clamp(15px,2vw,20px) !important;
      }

      body.mobile-login-mode .login-card > label{
        margin:0 0 clamp(26px,3.3vw,36px) !important;
        gap:clamp(11px,1.5vw,16px) !important;
        font-size:clamp(21px,2.65vw,28px) !important;
        line-height:1.5 !important;
      }

      body.mobile-login-mode #loginRemember{
        width:clamp(25px,3.1vw,33px) !important;
        height:clamp(25px,3.1vw,33px) !important;
        flex:0 0 clamp(25px,3.1vw,33px) !important;
      }

      body.mobile-login-mode .login-submit{
        width:100% !important;
        min-height:clamp(72px,9vw,92px) !important;
        margin:0 !important;
        font-size:clamp(24px,3.05vw,32px) !important;
        border-radius:clamp(15px,2vw,20px) !important;
      }

      body.mobile-login-mode .login-status:not(.visible){
        min-height:0 !important;
        margin:0 !important;
        padding:0 !important;
      }

      body.mobile-login-mode .login-card > div:last-child{
        margin-top:clamp(30px,4vw,42px) !important;
        padding-top:clamp(28px,3.7vw,40px) !important;
        border-top:1px solid #dbe5ee !important;
      }

      body.mobile-login-mode .login-card > div:last-child strong{
        margin-bottom:clamp(11px,1.5vw,15px) !important;
        font-size:clamp(25px,3.05vw,32px) !important;
      }

      body.mobile-login-mode .login-card > div:last-child span{
        max-width:90vw !important;
        margin:0 auto clamp(20px,2.7vw,28px) !important;
        font-size:clamp(22px,2.75vw,28px) !important;
        line-height:1.6 !important;
      }

      body.mobile-login-mode .login-card > div:last-child .portal-button{
        display:flex !important;
        width:100% !important;
        min-height:clamp(62px,7.6vw,78px) !important;
        padding:clamp(14px,1.9vw,19px) clamp(22px,3vw,32px) !important;
        font-size:clamp(22px,2.75vw,28px) !important;
        border-radius:clamp(14px,1.9vw,18px) !important;
        text-decoration:none !important;
      }

      body.mobile-login-mode .login-card > div:last-child small{
        max-width:90vw !important;
        margin:clamp(16px,2.2vw,22px) auto 0 !important;
        font-size:clamp(17px,2.1vw,22px) !important;
        line-height:1.5 !important;
      }

      body.mobile-login-mode.login-intro-collapsed .login-portal-logo{
        width:min(290px,46vw) !important;
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
          min-height:64px !important;
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