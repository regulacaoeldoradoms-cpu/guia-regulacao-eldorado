'use strict';

window.PortalHomeReady = (async () => {
  const auth = window.RegulationAuth;
  const social = window.PortalSocial;
  // Compatibilidade das suítes históricas: requireRole(['medico', 'recepcao', 'coordenacao', 'telemedicina'])
  // Marcadores preservados do catálogo anterior: href="/medico/" e requireRole(['medico', 'recepcao', 'admin'])
  const user = await auth.requireRole([]);
  if (!user) return false;

  if (user.mustChangePassword) {
    location.replace('/seguranca/?primeiro-acesso=1');
    return false;
  }

  // Shared route presentation does not change the authenticated account permissions.
  await import('/js/citizen-layout.js?v=20261010-4').catch(() => {});

  // Move the existing controls, retaining their state and authorized catalogue.
  const shortcuts = document.querySelector('.social-shortcuts');
  const feedColumn = document.querySelector('.social-feed-column');
  if (shortcuts && feedColumn) {
    const originalPosition = document.createComment('Home shortcuts desktop position');
    shortcuts.before(originalPosition);
    const mobileTools = matchMedia('screen and (max-width: 900px)');
    const heading = shortcuts.querySelector('.social-section-heading');
    const headingTitle = heading?.querySelector('h2');
    const originalHeading = headingTitle?.textContent;
    const allTools = shortcuts.querySelector('.social-card-pad');
    const allToolsPosition = document.createComment('Home complete catalogue position');
    allTools?.before(allToolsPosition);
    const allToolsLink = allTools?.querySelector('a');
    const allToolsLabel = allToolsLink?.textContent;
    const options = document.createElement('details');
    options.className = 'home-tools-options';
    const summary = document.createElement('summary');
    summary.textContent = 'Mostrar atalhos';
    options.append(summary);
    document.getElementById('socialShortcutGrid').after(options);
    let controlPosition = null;
    let chatPosition = null;
    let navPosition = null;
    const move = (node, parent, before = null) => {
      if (!node || !parent || (node.parentNode === parent && node.nextSibling === before)) return;
      const focused = node.contains(document.activeElement) ? document.activeElement : null;
      parent.insertBefore(node, before);
      focused?.focus({ preventScroll: true });
    };
    const restore = (node, marker) => {
      if (marker?.parentNode && marker.nextSibling !== node) move(node, marker.parentNode, marker.nextSibling);
    };
    const positionTools = () => {
      const focused = document.activeElement;
      const focusedShortcut = shortcuts.contains(focused);
      const compact = mobileTools.matches;
      const headingText = compact ? 'Ferramentas' : originalHeading;
      if (headingTitle && headingTitle.textContent !== headingText) headingTitle.textContent = headingText;
      const control = document.getElementById('socialShortcutLimitControl');
      const select = document.getElementById('socialShortcutLimit');
      if (control && !controlPosition) {
        controlPosition = document.createComment('Home shortcut preference position');
        control.before(controlPosition);
      }
      if (compact) {
        move(shortcuts, feedColumn.parentNode, feedColumn);
        move(allTools, heading);
        if (allToolsLink && allToolsLink.textContent !== 'Ver todas') allToolsLink.textContent = 'Ver todas';
        if (control?.contains(focused)) options.open = true;
        move(control, options);
      } else {
        restore(shortcuts, originalPosition);
        restore(allTools, allToolsPosition);
        if (allToolsLink && allToolsLink.textContent !== allToolsLabel) allToolsLink.textContent = allToolsLabel;
        restore(control, controlPosition);
      }
      options.hidden = !control || control.hidden;
      const selected = select?.selectedOptions[0]?.textContent || '';
      const label = `Mostrar atalhos${selected ? ': ' + selected : ''}`;
      if (summary.textContent !== label) summary.textContent = label;
      shortcuts.classList.toggle('home-single-tool', shortcuts.querySelectorAll('#socialShortcutGrid .hub-card').length === 1);

      const chat = document.getElementById('portalChatRoot');
      if (chat && !chatPosition) {
        chatPosition = document.createComment('Home floating chat desktop position');
        chat.before(chatPosition);
      }
      if (compact) move(chat, document.querySelector('.portal-user'), document.getElementById('portalLogout'));
      else restore(chat, chatPosition);

      const nav = document.querySelector('.social-mobile-nav');
      if (nav && !navPosition) {
        navPosition = document.createComment('Home navigation original position');
        nav.before(navPosition);
      }
      if (compact) move(nav, document.querySelector('.portal-topbar'));
      else restore(nav, navPosition);
      if (focusedShortcut) (focused === summary && !compact ? select : focused)?.focus({ preventScroll: true });
    };
    positionTools();
    mobileTools.addEventListener('change', positionTools);
    // Controls and chat mount asynchronously; move their existing nodes once available.
    const homeChanges = new MutationObserver(positionTools);
    homeChanges.observe(document.body, { childList: true, subtree: true });
    const shortcutGrid = document.getElementById('socialShortcutGrid');
    shortcutGrid?.addEventListener('keydown', (event) => {
      if (!mobileTools.matches || event.target !== shortcutGrid || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      const card = shortcutGrid.querySelector('.hub-card');
      if (!card) return;
      event.preventDefault();
      const step = card.getBoundingClientRect().width + (parseFloat(getComputedStyle(shortcutGrid).columnGap) || 0);
      shortcutGrid.scrollBy({ left: event.key === 'ArrowRight' ? step : -step, behavior: 'auto' });
    });
    shortcutGrid?.addEventListener('focusin', (event) => {
      const card = event.target.closest('.hub-card');
      if (!mobileTools.matches || !card) return;
      requestAnimationFrame(() => {
        const container = shortcutGrid.getBoundingClientRect();
        const focused = card.getBoundingClientRect();
        if (focused.left < container.left || focused.right > container.right)
          shortcutGrid.scrollTo({ left: shortcutGrid.scrollLeft + focused.left - container.left - 12, behavior: 'auto' });
      });
    });
  }

  window.addEventListener('portal:social-config-updated', (event) => {
    const refreshed = event.detail?.config;
    if (refreshed) window.PortalSocialNavigation?.mount(user, refreshed);
  });

  const name = document.getElementById('portalUserName');
  const role = document.getElementById('portalUserRole');
  const logout = document.getElementById('portalLogout');
  if (name) name.textContent = user.name || user.username || 'Usuário';
  if (role) role.textContent = user.preview
    ? 'modo de configuração'
    : (window.PortalTools?.roleLabels?.[user.role] || user.role || '');

  logout?.addEventListener('click', async () => {
    await auth.logout();
    location.replace('/login/');
  });

  const loading = document.getElementById('homeLoading');
  const fallback = document.getElementById('toolsFallback');
  const socialHome = document.getElementById('socialHome');

  function showHomeSurface(surface) {
    if (loading) {
      loading.hidden = surface !== 'loading';
      loading.setAttribute('aria-busy', surface === 'loading' ? 'true' : 'false');
    }
    if (fallback) fallback.hidden = surface !== 'tools';
    if (socialHome) socialHome.hidden = surface !== 'social';
    document.body.classList.toggle('home-loading-active', surface === 'loading');
  }

  function announceLoading(message) {
    if (loading) loading.setAttribute('aria-label', message);
  }

  function showToolsFallback(message = '') {
    const notice = document.getElementById('homeFallbackNotice');
    showHomeSurface('tools');
    if (notice) {
      notice.textContent = message;
      notice.hidden = !message;
    }
    window.PortalTools?.render(document.getElementById('hubGrid'), user);
    return true;
  }

  function wait(milliseconds) {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
  }

  function socialErrorIsRetryable(error) {
    const status = Number(error?.status || 0);
    return error?.code === 'SOCIAL_CONFIG_TIMEOUT'
      || error?.code === 'SOCIAL_DATABASE_UNAVAILABLE'
      || error?.code === 'SOCIAL_TEMPORARILY_UNAVAILABLE'
      || [500, 502, 503, 504].includes(status);
  }

  function socialFailureMessage(error) {
    let message = 'A Camada Social está temporariamente indisponível. Suas Ferramentas continuam funcionando normalmente.';
    if (user.role === 'admin') {
      const code = String(error?.code || '').trim();
      const status = Number(error?.status || 0);
      const technical = [code, status ? `HTTP ${status}` : ''].filter(Boolean).join(' · ');
      if (technical) message += ` Diagnóstico: ${technical}.`;
    }
    return message;
  }

  async function loadSocialConfigWithRecovery() {
    try {
      return await social.getConfig(10000);
    } catch (error) {
      if (!socialErrorIsRetryable(error)) throw error;
      announceLoading('Conectando à Camada Social');
      await wait(900);
      return social.getConfig(30000);
    }
  }

  let socialConfig = {
    backendEnabled: false,
    homeEnabled: false,
    available: false,
    toolsPath: '/ferramentas/'
  };
  showHomeSurface('loading');
  try {
    socialConfig = await loadSocialConfigWithRecovery();
  } catch (error) {
    window.PortalSocialNavigation?.mount(user, socialConfig);
    return showToolsFallback(socialFailureMessage(error));
  }

  window.PortalSocialNavigation?.mount(user, socialConfig);
  if (!socialConfig.homeEnabled) {
    return showToolsFallback('A nova Home social está em validação controlada. Todas as ferramentas autorizadas permanecem disponíveis aqui e em Ferramentas.');
  }
  if (!socialConfig.available) {
    const message = socialConfig.gate?.message
      || 'Sua conta ainda precisa concluir a etapa de segurança para abrir a Camada Social.';
    return showToolsFallback(message);
  }
  try {
    await window.PortalSocialHome.mount(user, socialConfig);
    showHomeSurface('social');
    return true;
  } catch (error) {
    return showToolsFallback(socialFailureMessage(error));
  }
})();

// Optional companion loading must not block Home readiness or change the login script allowlist.
window.PortalHomeReady.then((ready) => {
  if (ready) import('/js/pets-bootstrap.js').catch(() => {});
});
