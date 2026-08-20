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
    Ajuste exclusivamente mobile para aproveitar largura e altura reais da tela.
    Alguns navegadores Android podem manter um viewport visual mais largo; por isso
    usamos vw/dvh em vez de limitar o card a 680px.
  */
  if (document.body.classList.contains('mobile-login-mode')) {
    const style = document.createElement('style');
    style.id = 'mobile-login-height-fill';
    style.textContent = `
      body.mobile-login-mode .login-layout{
        width:100vw !important;
        min-height:100dvh !important;
      }

      body.mobile-login-mode .login-panel{
        flex:1 0 auto !important;
        display:flex !important;
        align-items:stretch !important;
        justify-content:center !important;
        width:100vw !important;
        min-height:calc(100dvh - 300px) !important;
        padding:18px 14px max(34px,env(safe-area-inset-bottom)) !important;
      }

      body.mobile-login-mode .login-card{
        width:calc(100vw - 28px) !important;
        max-width:none !important;
        min-height:calc(100dvh - 340px) !important;
        margin:0 auto !important;
        padding:34px 30px 30px !important;
        display:flex !important;
        flex-direction:column !important;
        justify-content:flex-start !important;
        gap:0 !important;
        border-radius:22px !important;
      }

      body.mobile-login-mode .login-card h2{
        margin:0 !important;
        font-size:2rem !important;
        line-height:1.12 !important;
      }

      body.mobile-login-mode .login-card > p{
        margin:9px 0 30px !important;
        font-size:1.18rem !important;
        line-height:1.45 !important;
      }

      body.mobile-login-mode .portal-field{
        margin-bottom:22px !important;
      }

      body.mobile-login-mode .portal-field label{
        margin-bottom:9px !important;
        font-size:1.05rem !important;
      }

      body.mobile-login-mode .portal-field input{
        min-height:68px !important;
        padding:16px 18px !important;
        font-size:1.2rem !important;
        border-radius:14px !important;
      }

      body.mobile-login-mode .login-card > label{
        margin:0 0 24px !important;
        font-size:1.05rem !important;
        line-height:1.45 !important;
      }

      body.mobile-login-mode #loginRemember{
        width:22px !important;
        height:22px !important;
        flex:0 0 22px !important;
      }

      body.mobile-login-mode .login-submit{
        min-height:64px !important;
        margin:0 !important;
        font-size:1.16rem !important;
        border-radius:14px !important;
      }

      body.mobile-login-mode .login-status:not(.visible){
        min-height:0 !important;
        margin:0 !important;
        padding:0 !important;
      }

      body.mobile-login-mode .login-card > div:last-child{
        margin-top:auto !important;
        padding-top:30px !important;
      }

      body.mobile-login-mode .login-card > div:last-child strong{
        margin-bottom:11px !important;
        font-size:1.18rem !important;
      }

      body.mobile-login-mode .login-card > div:last-child span{
        max-width:760px !important;
        margin:0 auto 18px !important;
        font-size:1.05rem !important;
        line-height:1.5 !important;
      }

      body.mobile-login-mode .login-card > div:last-child .portal-button{
        min-height:52px !important;
        padding:13px 22px !important;
        font-size:1.05rem !important;
      }

      body.mobile-login-mode .login-card > div:last-child small{
        max-width:760px !important;
        margin:14px auto 0 !important;
        font-size:.9rem !important;
        line-height:1.45 !important;
      }

      body.mobile-login-mode .login-portal-logo{
        width:min(390px,82vw) !important;
      }

      body.mobile-login-mode .login-message{
        max-width:calc(100vw - 52px) !important;
      }

      body.mobile-login-mode .login-message h1{
        font-size:clamp(2.05rem,5.8vw,2.75rem) !important;
      }

      body.mobile-login-mode .login-message p{
        font-size:1.08rem !important;
      }

      body.mobile-login-mode.login-intro-collapsed .login-portal-logo{
        width:min(210px,52vw) !important;
      }

      @media(max-height:760px){
        body.mobile-login-mode .login-panel{
          min-height:0 !important;
        }
        body.mobile-login-mode .login-card{
          min-height:0 !important;
          padding:26px 24px !important;
        }
        body.mobile-login-mode .portal-field input{
          min-height:56px !important;
        }
        body.mobile-login-mode .login-submit{
          min-height:54px !important;
        }
        body.mobile-login-mode .login-card > div:last-child{
          margin-top:24px !important;
          padding-top:22px !important;
        }
      }

      @media(max-width:380px){
        body.mobile-login-mode .login-card{
          width:calc(100vw - 18px) !important;
          padding-left:20px !important;
          padding-right:20px !important;
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
