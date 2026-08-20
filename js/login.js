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
    Ajuste exclusivamente mobile para aproveitar melhor a altura útil da tela.
    A página já recebe a classe mobile-login-mode antes deste script ser carregado.
    O desktop não é afetado.
  */
  if (document.body.classList.contains('mobile-login-mode')) {
    const style = document.createElement('style');
    style.id = 'mobile-login-height-fill';
    style.textContent = `
      body.mobile-login-mode .login-panel{
        flex:1 0 auto !important;
        display:flex !important;
        align-items:flex-start !important;
        min-height:clamp(580px,66dvh,840px) !important;
        padding:18px 12px max(34px,env(safe-area-inset-bottom)) !important;
      }

      body.mobile-login-mode .login-card{
        width:min(680px,100%) !important;
        min-height:clamp(550px,62dvh,790px) !important;
        padding:30px 24px !important;
        display:flex !important;
        flex-direction:column !important;
        justify-content:space-between !important;
        gap:12px !important;
      }

      body.mobile-login-mode .login-card h2{
        margin:0 !important;
        font-size:1.68rem !important;
        line-height:1.15 !important;
      }

      body.mobile-login-mode .login-card > p{
        margin:0 0 4px !important;
        font-size:1.02rem !important;
        line-height:1.5 !important;
      }

      body.mobile-login-mode .portal-field{
        margin:0 !important;
      }

      body.mobile-login-mode .portal-field label{
        margin-bottom:8px !important;
        font-size:.94rem !important;
      }

      body.mobile-login-mode .portal-field input{
        min-height:56px !important;
        padding:15px 16px !important;
        font-size:1.06rem !important;
        border-radius:13px !important;
      }

      body.mobile-login-mode .login-card > label{
        margin:2px 0 !important;
        font-size:.94rem !important;
        line-height:1.4 !important;
      }

      body.mobile-login-mode #loginRemember{
        width:20px !important;
        height:20px !important;
        flex:0 0 20px !important;
      }

      body.mobile-login-mode .login-submit{
        min-height:56px !important;
        margin:2px 0 0 !important;
        font-size:1.06rem !important;
        border-radius:13px !important;
      }

      body.mobile-login-mode .login-status:not(.visible){
        min-height:0 !important;
        margin:0 !important;
        padding:0 !important;
      }

      body.mobile-login-mode .login-card > div:last-child{
        margin:4px 0 0 !important;
        padding-top:24px !important;
      }

      body.mobile-login-mode .login-card > div:last-child strong{
        margin-bottom:10px !important;
        font-size:1.08rem !important;
      }

      body.mobile-login-mode .login-card > div:last-child span{
        max-width:540px !important;
        margin:0 auto 16px !important;
        font-size:.98rem !important;
        line-height:1.5 !important;
      }

      body.mobile-login-mode .login-card > div:last-child .portal-button{
        min-height:48px !important;
        padding:12px 18px !important;
        font-size:.98rem !important;
      }

      body.mobile-login-mode .login-card > div:last-child small{
        max-width:520px !important;
        margin:14px auto 0 !important;
        font-size:.82rem !important;
        line-height:1.45 !important;
      }

      body.mobile-login-mode .login-portal-logo{
        width:min(350px,90vw) !important;
      }

      body.mobile-login-mode .login-message h1{
        font-size:clamp(1.95rem,7.5vw,2.4rem) !important;
      }

      body.mobile-login-mode .login-message p{
        font-size:1.03rem !important;
      }

      body.mobile-login-mode.login-intro-collapsed .login-portal-logo{
        width:min(190px,55vw) !important;
      }

      @media(max-height:820px){
        body.mobile-login-mode .login-panel{
          min-height:0 !important;
        }
        body.mobile-login-mode .login-card{
          min-height:0 !important;
          padding:25px 21px !important;
          justify-content:flex-start !important;
          gap:14px !important;
        }
        body.mobile-login-mode .login-card > div:last-child{
          margin-top:8px !important;
        }
      }

      @media(max-width:380px){
        body.mobile-login-mode .login-card{
          padding-left:19px !important;
          padding-right:19px !important;
        }
        body.mobile-login-mode .portal-field input,
        body.mobile-login-mode .login-submit{
          min-height:52px !important;
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
