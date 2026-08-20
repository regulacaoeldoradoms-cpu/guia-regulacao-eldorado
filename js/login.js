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
    Ajuste exclusivamente mobile.
    Usa vw combinado com clamp para manter leitura confortável mesmo quando
    o navegador Android trabalha com viewport visual largo/"site para computador".
    O desktop não recebe estas regras.
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
        padding:clamp(22px,3vw,34px) clamp(18px,4vw,42px) clamp(22px,3vw,34px) !important;
        gap:clamp(16px,2vw,24px) !important;
      }

      body.mobile-login-mode .login-portal-logo{
        width:min(520px,68vw) !important;
      }

      body.mobile-login-mode .login-message{
        width:92vw !important;
        max-width:none !important;
      }

      body.mobile-login-mode .portal-eyebrow{
        font-size:clamp(14px,1.8vw,20px) !important;
      }

      body.mobile-login-mode .login-message h1{
        margin:0 0 clamp(12px,1.7vw,18px) !important;
        font-size:clamp(32px,4.4vw,46px) !important;
        line-height:1.08 !important;
      }

      body.mobile-login-mode .login-message p{
        font-size:clamp(18px,2.35vw,25px) !important;
        line-height:1.55 !important;
      }

      body.mobile-login-mode .login-message > div{
        margin-top:clamp(16px,2vw,22px) !important;
        gap:clamp(7px,1.1vw,12px) !important;
        font-size:clamp(13px,1.65vw,18px) !important;
      }

      body.mobile-login-mode .login-message > div span{
        padding:clamp(7px,1vw,10px) clamp(9px,1.4vw,14px) !important;
      }

      body.mobile-login-mode .login-visual > small{
        width:92vw !important;
        max-width:none !important;
        font-size:clamp(13px,1.55vw,17px) !important;
        line-height:1.4 !important;
      }

      body.mobile-login-mode .login-panel{
        flex:1 0 auto !important;
        display:flex !important;
        align-items:stretch !important;
        justify-content:center !important;
        width:100vw !important;
        min-height:calc(100dvh - 300px) !important;
        padding:clamp(16px,2.5vw,26px) 2vw max(30px,env(safe-area-inset-bottom)) !important;
      }

      body.mobile-login-mode .login-card{
        width:96vw !important;
        max-width:none !important;
        min-height:calc(100dvh - 330px) !important;
        margin:0 auto !important;
        padding:clamp(30px,4.5vw,48px) clamp(26px,4.2vw,44px) clamp(28px,4vw,42px) !important;
        display:flex !important;
        flex-direction:column !important;
        justify-content:flex-start !important;
        gap:0 !important;
        border-radius:clamp(20px,2.6vw,28px) !important;
      }

      body.mobile-login-mode .login-card h2{
        margin:0 !important;
        font-size:clamp(34px,4.3vw,45px) !important;
        line-height:1.12 !important;
      }

      body.mobile-login-mode .login-card > p{
        margin:clamp(10px,1.5vw,16px) 0 clamp(28px,3.5vw,38px) !important;
        font-size:clamp(19px,2.45vw,26px) !important;
        line-height:1.48 !important;
      }

      body.mobile-login-mode .portal-field{
        margin-bottom:clamp(22px,3vw,30px) !important;
      }

      body.mobile-login-mode .portal-field label{
        margin-bottom:clamp(8px,1.2vw,12px) !important;
        font-size:clamp(17px,2.2vw,23px) !important;
      }

      body.mobile-login-mode .portal-field input{
        min-height:clamp(62px,8vw,82px) !important;
        padding:clamp(15px,2vw,20px) clamp(16px,2.3vw,24px) !important;
        font-size:clamp(19px,2.45vw,26px) !important;
        border-radius:clamp(13px,1.8vw,18px) !important;
      }

      body.mobile-login-mode .login-card > label{
        margin:0 0 clamp(24px,3vw,32px) !important;
        gap:clamp(10px,1.4vw,15px) !important;
        font-size:clamp(17px,2.15vw,23px) !important;
        line-height:1.45 !important;
      }

      body.mobile-login-mode #loginRemember{
        width:clamp(22px,2.8vw,30px) !important;
        height:clamp(22px,2.8vw,30px) !important;
        flex:0 0 clamp(22px,2.8vw,30px) !important;
      }

      body.mobile-login-mode .login-submit{
        min-height:clamp(62px,8vw,82px) !important;
        margin:0 !important;
        font-size:clamp(19px,2.5vw,27px) !important;
        border-radius:clamp(13px,1.8vw,18px) !important;
      }

      body.mobile-login-mode .login-status:not(.visible){
        min-height:0 !important;
        margin:0 !important;
        padding:0 !important;
      }

      body.mobile-login-mode .login-card > div:last-child{
        margin-top:auto !important;
        padding-top:clamp(30px,4vw,42px) !important;
      }

      body.mobile-login-mode .login-card > div:last-child strong{
        margin-bottom:clamp(10px,1.4vw,14px) !important;
        font-size:clamp(19px,2.45vw,26px) !important;
      }

      body.mobile-login-mode .login-card > div:last-child span{
        max-width:88vw !important;
        margin:0 auto clamp(18px,2.5vw,26px) !important;
        font-size:clamp(17px,2.15vw,23px) !important;
        line-height:1.5 !important;
      }

      body.mobile-login-mode .login-card > div:last-child .portal-button{
        min-height:clamp(52px,6.5vw,68px) !important;
        padding:clamp(12px,1.7vw,18px) clamp(20px,2.8vw,30px) !important;
        font-size:clamp(17px,2.15vw,23px) !important;
      }

      body.mobile-login-mode .login-card > div:last-child small{
        max-width:88vw !important;
        margin:clamp(14px,2vw,20px) auto 0 !important;
        font-size:clamp(14px,1.8vw,19px) !important;
        line-height:1.45 !important;
      }

      body.mobile-login-mode.login-intro-collapsed .login-portal-logo{
        width:min(260px,42vw) !important;
      }

      @media(max-height:760px){
        body.mobile-login-mode .login-panel{
          min-height:0 !important;
        }
        body.mobile-login-mode .login-card{
          min-height:0 !important;
          padding-top:26px !important;
          padding-bottom:26px !important;
        }
        body.mobile-login-mode .login-card > div:last-child{
          margin-top:26px !important;
          padding-top:24px !important;
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
