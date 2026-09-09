'use strict';

(() => {
  if (window.PortalFirstAccessUX) return;

  const STYLE_ID = 'portalFirstAccessStyles';
  const MODE_CLASS = 'first-access-mode';
  const state = {
    active: false,
    homeClickHandler: null,
    passwordPlaceholder: null,
    hero: null,
    notice: null,
    card: null,
    checklist: null,
    originals: {}
  };

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      body.${MODE_CLASS} .portal-main{
        max-width:1180px;
      }
      body.${MODE_CLASS} .portal-hero{
        padding:34px 40px;
        border:1px solid #c6dbe8;
        background:linear-gradient(135deg,#f8fcff 0%,#edf8f8 100%);
        box-shadow:0 16px 36px rgba(15,55,86,.08);
      }
      body.${MODE_CLASS} .portal-hero-copy{
        max-width:920px;
      }
      body.${MODE_CLASS} .portal-hero-copy .portal-eyebrow{
        color:#087b82;
        letter-spacing:.12em;
      }
      body.${MODE_CLASS} .portal-hero-copy h2{
        max-width:860px;
        margin-top:10px;
        font-size:clamp(2rem,3.7vw,3.15rem);
        line-height:1.06;
      }
      body.${MODE_CLASS} .portal-hero-copy p{
        max-width:860px;
        margin-top:14px;
        font-size:1.08rem;
        line-height:1.62;
      }
      body.${MODE_CLASS} #accountLevelPanel,
      body.${MODE_CLASS} .account-layout,
      body.${MODE_CLASS} #emailVerificationNotice{
        display:none!important;
      }
      body.${MODE_CLASS} #accountHomeLink[aria-disabled="true"]{
        opacity:.64;
        cursor:not-allowed;
        pointer-events:none;
        border-style:dashed;
      }
      body.${MODE_CLASS} #firstAccessNotice{
        display:grid!important;
        grid-template-columns:48px minmax(0,1fr);
        gap:14px;
        align-items:start;
        max-width:780px;
        margin:24px auto 0;
        padding:18px 20px;
        color:#123d5b;
        background:#eef8fb;
        border:1px solid #a9d2df;
        border-left:5px solid #0a8b91;
        border-radius:16px;
        box-shadow:0 10px 24px rgba(18,73,99,.08);
      }
      body.${MODE_CLASS} #firstAccessNotice .first-access-notice-icon{
        width:44px;
        height:44px;
        display:grid;
        place-items:center;
        border-radius:12px;
        color:#0b7078;
        background:#d9f0f2;
      }
      body.${MODE_CLASS} #firstAccessNotice .first-access-notice-icon svg{
        width:25px;
        height:25px;
        fill:none;
        stroke:currentColor;
        stroke-width:1.9;
        stroke-linecap:round;
        stroke-linejoin:round;
      }
      body.${MODE_CLASS} #firstAccessNotice .first-access-notice-copy{
        display:grid;
        gap:5px;
      }
      body.${MODE_CLASS} #firstAccessNotice .first-access-notice-copy strong{
        font-size:1.02rem;
        color:#0e3e60;
      }
      body.${MODE_CLASS} #firstAccessNotice .first-access-notice-copy span{
        line-height:1.5;
        color:#4e6c80;
      }
      body.${MODE_CLASS} .first-access-password-card{
        display:block!important;
        width:min(780px,calc(100% - 28px));
        margin:18px auto 52px;
        padding:28px 30px;
        border:1px solid #b7d3e2;
        border-top:5px solid #176fa8;
        border-radius:18px;
        box-shadow:0 18px 42px rgba(14,55,86,.12);
        background:#fff;
      }
      body.${MODE_CLASS} .first-access-password-card > h2{
        margin:0 0 8px;
        color:#0e3559;
        font-size:1.55rem;
      }
      body.${MODE_CLASS} .first-access-password-card > p{
        margin:0 0 20px;
        color:#5c7386;
        line-height:1.55;
      }
      body.${MODE_CLASS} .first-access-password-card .account-form{
        display:grid;
        gap:16px;
      }
      body.${MODE_CLASS} .first-access-password-card .portal-field label{
        font-weight:800;
        color:#173f60;
      }
      body.${MODE_CLASS} .first-access-input-shell{
        position:relative;
      }
      body.${MODE_CLASS} .first-access-input-shell input{
        width:100%;
        padding-right:52px;
      }
      body.${MODE_CLASS} .first-access-password-toggle{
        position:absolute;
        top:50%;
        right:8px;
        width:38px;
        height:38px;
        margin:0;
        padding:0;
        display:grid;
        place-items:center;
        transform:translateY(-50%);
        color:#3f6680;
        background:transparent;
        border:0;
        border-radius:9px;
        cursor:pointer;
      }
      body.${MODE_CLASS} .first-access-password-toggle:focus-visible{
        outline:3px solid rgba(32,120,177,.28);
        outline-offset:1px;
      }
      body.${MODE_CLASS} .first-access-password-toggle svg{
        width:21px;
        height:21px;
        fill:none;
        stroke:currentColor;
        stroke-width:1.8;
        stroke-linecap:round;
        stroke-linejoin:round;
      }
      body.${MODE_CLASS} .first-access-password-checks{
        display:grid;
        gap:8px;
        margin:0;
        padding:14px 16px;
        list-style:none;
        border:1px solid #d7e4ec;
        border-radius:13px;
        background:#f7fafc;
      }
      body.${MODE_CLASS} .first-access-password-check{
        display:flex;
        gap:9px;
        align-items:center;
        color:#6b7e8d;
        font-size:.92rem;
      }
      body.${MODE_CLASS} .first-access-password-check svg{
        width:18px;
        height:18px;
        flex:0 0 18px;
        fill:none;
        stroke:#91a4b2;
        stroke-width:2;
        stroke-linecap:round;
        stroke-linejoin:round;
      }
      body.${MODE_CLASS} .first-access-password-check.is-ok{
        color:#166b58;
        font-weight:700;
      }
      body.${MODE_CLASS} .first-access-password-check.is-ok svg{
        stroke:#16836c;
      }
      body.${MODE_CLASS} .first-access-password-card .account-actions{
        margin-top:2px;
      }
      body.${MODE_CLASS} #changePasswordButton{
        min-height:52px;
        padding-inline:24px;
        font-size:1rem;
      }
      @media(max-width:760px){
        body.${MODE_CLASS} .portal-main{
          padding-inline:12px;
        }
        body.${MODE_CLASS} .portal-hero{
          padding:24px 20px;
          border-radius:16px;
        }
        body.${MODE_CLASS} .portal-hero-copy h2{
          font-size:clamp(1.8rem,9vw,2.35rem);
        }
        body.${MODE_CLASS} .portal-hero-copy p{
          font-size:1rem;
        }
        body.${MODE_CLASS} #firstAccessNotice{
          width:100%;
          grid-template-columns:40px minmax(0,1fr);
          padding:16px;
          margin-top:14px;
          border-radius:14px;
        }
        body.${MODE_CLASS} #firstAccessNotice .first-access-notice-icon{
          width:38px;
          height:38px;
        }
        body.${MODE_CLASS} .first-access-password-card{
          width:100%;
          margin:14px auto 30px;
          padding:22px 18px;
          border-radius:16px;
        }
        body.${MODE_CLASS} #changePasswordButton{
          width:100%;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function lockIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10V7a5 5 0 0 1 10 0v3"/><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M12 14v2"/></svg>';
  }

  function eyeIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.5"/></svg>';
  }

  function checkIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8.3 12.2 2.4 2.5 5-5.2"/></svg>';
  }

  function enhancePasswordInput(input) {
    if (!input || input.parentElement?.classList.contains('first-access-input-shell')) return;
    const shell = document.createElement('div');
    shell.className = 'first-access-input-shell';
    input.parentNode.insertBefore(shell, input);
    shell.appendChild(input);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'first-access-password-toggle';
    button.innerHTML = eyeIcon();
    button.setAttribute('aria-label', 'Mostrar senha');
    button.title = 'Mostrar senha';
    button.addEventListener('click', () => {
      const showing = input.type === 'text';
      input.type = showing ? 'password' : 'text';
      const label = showing ? 'Mostrar senha' : 'Ocultar senha';
      button.setAttribute('aria-label', label);
      button.title = label;
    });
    shell.appendChild(button);
  }

  function buildChecklist(form) {
    if (!form || document.getElementById('firstAccessPasswordChecks')) return null;
    const current = document.getElementById('currentPassword');
    const next = document.getElementById('newPassword');
    const confirm = document.getElementById('confirmPassword');
    const actions = form.querySelector('.account-actions');
    if (!current || !next || !confirm || !actions) return null;

    const list = document.createElement('ul');
    list.id = 'firstAccessPasswordChecks';
    list.className = 'first-access-password-checks';
    list.setAttribute('aria-label', 'Requisitos da nova senha');
    list.innerHTML = `
      <li class="first-access-password-check" data-first-access-check="length">${checkIcon()}<span>Pelo menos 8 caracteres</span></li>
      <li class="first-access-password-check" data-first-access-check="different">${checkIcon()}<span>Diferente da senha temporária</span></li>
      <li class="first-access-password-check" data-first-access-check="match">${checkIcon()}<span>Confirmação igual à nova senha</span></li>
    `;
    actions.parentNode.insertBefore(list, actions);

    const update = () => {
      const values = {
        length: next.value.length >= 8,
        different: Boolean(next.value) && next.value !== current.value,
        match: Boolean(confirm.value) && confirm.value === next.value
      };
      Object.entries(values).forEach(([key, ok]) => {
        const item = list.querySelector(`[data-first-access-check="${key}"]`);
        item?.classList.toggle('is-ok', ok);
      });
    };
    current.addEventListener('input', update);
    next.addEventListener('input', update);
    confirm.addEventListener('input', update);
    update();
    return list;
  }

  function lockHomeLink() {
    const link = document.getElementById('accountHomeLink');
    if (!link || link.dataset.firstAccessLocked === '1') return;
    state.originals.homeHref = link.getAttribute('href') || '/';
    state.originals.homeText = link.textContent || 'Início';
    state.originals.homeTitle = link.getAttribute('title') || '';
    link.dataset.firstAccessLocked = '1';
    link.removeAttribute('href');
    link.setAttribute('aria-disabled', 'true');
    link.setAttribute('title', 'Disponível depois de trocar a senha temporária.');
    link.textContent = 'Início após trocar a senha';
    state.homeClickHandler = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    link.addEventListener('click', state.homeClickHandler, true);
  }

  function unlockHomeLink() {
    const link = document.getElementById('accountHomeLink');
    if (!link || link.dataset.firstAccessLocked !== '1') return;
    if (state.homeClickHandler) link.removeEventListener('click', state.homeClickHandler, true);
    link.setAttribute('href', state.originals.homeHref || '/');
    link.textContent = state.originals.homeText || '← Início';
    if (state.originals.homeTitle) link.setAttribute('title', state.originals.homeTitle);
    else link.removeAttribute('title');
    link.removeAttribute('aria-disabled');
    delete link.dataset.firstAccessLocked;
    state.homeClickHandler = null;
  }

  function promotePasswordCard() {
    const form = document.getElementById('changePasswordForm');
    const notice = document.getElementById('firstAccessNotice');
    const card = form?.closest('.account-card');
    if (!form || !notice || !card) return null;

    state.card = card;
    state.originals.cardTitle = card.querySelector('h2')?.textContent || '';
    state.originals.cardCopy = card.querySelector('p')?.textContent || '';
    state.originals.currentLabel = card.querySelector('label[for="currentPassword"]')?.textContent || '';
    state.originals.buttonText = document.getElementById('changePasswordButton')?.textContent || '';

    state.passwordPlaceholder = document.createComment('posição original do formulário de senha');
    card.parentNode.insertBefore(state.passwordPlaceholder, card);
    notice.insertAdjacentElement('afterend', card);
    card.classList.add('first-access-password-card');

    const title = card.querySelector('h2');
    const copy = card.querySelector('p');
    const currentLabel = card.querySelector('label[for="currentPassword"]');
    const button = document.getElementById('changePasswordButton');
    if (title) title.textContent = 'Crie sua nova senha';
    if (copy) copy.textContent = 'A senha atual é temporária. Crie uma nova senha com pelo menos 8 caracteres para concluir a ativação da sua conta.';
    if (currentLabel) currentLabel.textContent = 'Senha temporária atual';
    if (button) button.textContent = 'Salvar nova senha e continuar';

    enhancePasswordInput(document.getElementById('currentPassword'));
    enhancePasswordInput(document.getElementById('newPassword'));
    enhancePasswordInput(document.getElementById('confirmPassword'));
    state.checklist = buildChecklist(form);

    if (button) {
      const observer = new MutationObserver(() => {
        if (!state.active || button.disabled) return;
        if (button.textContent !== 'Salvar nova senha e continuar') button.textContent = 'Salvar nova senha e continuar';
      });
      observer.observe(button, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ['disabled'] });
      state.buttonObserver = observer;
    }
    return form;
  }

  function restorePasswordCard() {
    const card = state.card;
    if (!card) return;
    state.buttonObserver?.disconnect();
    state.buttonObserver = null;

    const title = card.querySelector('h2');
    const copy = card.querySelector('p');
    const currentLabel = card.querySelector('label[for="currentPassword"]');
    const button = document.getElementById('changePasswordButton');
    if (title && state.originals.cardTitle) title.textContent = state.originals.cardTitle;
    if (copy && state.originals.cardCopy) copy.textContent = state.originals.cardCopy;
    if (currentLabel && state.originals.currentLabel) currentLabel.textContent = state.originals.currentLabel;
    if (button && state.originals.buttonText) button.textContent = state.originals.buttonText;

    state.checklist?.remove();
    state.checklist = null;
    card.querySelectorAll('.first-access-input-shell').forEach((shell) => {
      const input = shell.querySelector('input');
      if (input) shell.parentNode.insertBefore(input, shell);
      shell.remove();
    });
    if (state.passwordPlaceholder?.parentNode) state.passwordPlaceholder.replaceWith(card);
    card.classList.remove('first-access-password-card');
    state.passwordPlaceholder = null;
    state.card = null;
  }

  function rewriteHero() {
    const hero = document.querySelector('.portal-hero-copy');
    if (!hero) return;
    state.hero = hero;
    const eyebrow = hero.querySelector('.portal-eyebrow');
    const title = hero.querySelector('h2');
    const copy = hero.querySelector('p');
    state.originals.heroEyebrow = eyebrow?.textContent || '';
    state.originals.heroTitle = title?.textContent || '';
    state.originals.heroCopy = copy?.textContent || '';
    if (eyebrow) eyebrow.textContent = 'Etapa obrigatória';
    if (title) title.textContent = 'Defina sua nova senha para continuar.';
    if (copy) copy.textContent = 'Você entrou com uma senha temporária. Por segurança, crie uma nova senha antes de acessar o Início e as demais áreas do Portal.';
  }

  function restoreHero() {
    const hero = state.hero;
    if (!hero) return;
    const eyebrow = hero.querySelector('.portal-eyebrow');
    const title = hero.querySelector('h2');
    const copy = hero.querySelector('p');
    if (eyebrow) eyebrow.textContent = state.originals.heroEyebrow || 'Sua conta';
    if (title) title.textContent = state.originals.heroTitle || 'Perfil, senha e segurança em um só lugar.';
    if (copy) copy.textContent = state.originals.heroCopy || '';
    state.hero = null;
  }

  function rewriteNotice() {
    const notice = document.getElementById('firstAccessNotice');
    if (!notice) return;
    state.notice = notice;
    state.originals.noticeHtml = notice.innerHTML;
    notice.hidden = false;
    notice.innerHTML = `
      <span class="first-access-notice-icon">${lockIcon()}</span>
      <span class="first-access-notice-copy">
        <strong>Seu acesso ainda não foi concluído.</strong>
        <span>Troque a senha temporária abaixo. Depois de salvar, você será levado automaticamente ao seu ambiente.</span>
      </span>
    `;
  }

  function restoreNotice() {
    if (!state.notice) return;
    state.notice.innerHTML = state.originals.noticeHtml || '';
    state.notice.hidden = true;
    state.notice = null;
  }

  function activate() {
    if (state.active) return;
    ensureStyles();
    state.active = true;
    document.body.classList.add(MODE_CLASS);
    rewriteHero();
    rewriteNotice();
    lockHomeLink();
    const form = promotePasswordCard();
    if (!form) return;

    let checks = 0;
    const monitor = window.setInterval(async () => {
      checks += 1;
      const auth = window.RegulationAuth;
      const refreshed = await auth?.me?.({ allowCached: false }).catch(() => null);
      if (refreshed && refreshed.mustChangePassword === false) {
        window.clearInterval(monitor);
        deactivate();
        const url = new URL(location.href);
        url.searchParams.delete('primeiro-acesso');
        if (refreshed.emailVerificationRequired) {
          url.searchParams.set('verificar-email', '1');
          history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
          document.getElementById('emailVerificationNotice')?.removeAttribute('hidden');
          document.getElementById('seguranca')?.scrollIntoView({ behavior: 'auto', block: 'start' });
        } else if (location.pathname.startsWith('/conta/')) {
          location.replace('/');
        }
      } else if (checks >= 18) {
        window.clearInterval(monitor);
      }
    }, 450);
    state.passwordMonitor = monitor;
  }

  function deactivate() {
    if (!state.active) return;
    state.active = false;
    if (state.passwordMonitor) window.clearInterval(state.passwordMonitor);
    state.passwordMonitor = null;
    document.body.classList.remove(MODE_CLASS);
    unlockHomeLink();
    restoreNotice();
    restoreHero();
    restorePasswordCard();
  }

  async function refresh() {
    if (!location.pathname.startsWith('/conta/')) return;
    const auth = window.RegulationAuth;
    if (!auth) return;
    const user = await auth.me({ allowCached: false }).catch(() => auth.getCachedUser?.() || null);
    if (user?.mustChangePassword === true) activate();
    else deactivate();
  }

  window.PortalFirstAccessUX = Object.freeze({ refresh, activate, deactivate });
  refresh();
  window.addEventListener('pageshow', refresh);
})();