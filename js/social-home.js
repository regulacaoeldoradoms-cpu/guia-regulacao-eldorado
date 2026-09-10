'use strict';

(() => {
  if (window.PortalSocialHome) return;
  const social = window.PortalSocial;
  const DEFAULT_SHORTCUT_LIMIT = 5;

  function mountIdentity(profile) {
    const name = document.getElementById('socialIdentityName');
    const handle = document.getElementById('socialIdentityHandle');
    const badge = document.getElementById('socialIdentityRole');
    if (name) name.textContent = profile.name || `@${profile.handle}`;
    if (handle) handle.textContent = `@${profile.handle}`;
    if (badge) {
      badge.textContent = profile.professional?.label || 'Perfil social';
      badge.hidden = false;
    }
    social.mountAvatar(document.getElementById('socialIdentityAvatar'), profile);
    const link = document.getElementById('socialIdentityLink');
    if (link) link.href = social.profileUrl(profile.handle);
  }

  function shortcutPreferenceKey(user) {
    const identity = user?.id || user?.username || user?.role || 'default';
    return `portal:social-shortcut-limit:${encodeURIComponent(String(identity))}`;
  }

  function readShortcutLimit(user, total) {
    if (total <= 0) return 0;
    const fallback = Math.min(DEFAULT_SHORTCUT_LIMIT, total);
    try {
      const saved = Number.parseInt(localStorage.getItem(shortcutPreferenceKey(user)), 10);
      if (Number.isInteger(saved) && saved >= 1) return Math.min(saved, total);
    } catch (_) {
      // Preferência local é opcional; o Portal continua funcional se o storage estiver indisponível.
    }
    return fallback;
  }

  function persistShortcutLimit(user, limit) {
    try {
      localStorage.setItem(shortcutPreferenceKey(user), String(limit));
    } catch (_) {
      // Sem persistência local, a seleção ainda vale durante a sessão atual.
    }
  }

  function ensureShortcutLimitControl(total, selected, onChange) {
    const shortcutsSection = document.querySelector('.social-shortcuts');
    const heading = shortcutsSection?.querySelector('.social-section-heading');
    if (!shortcutsSection || !heading) return null;

    let control = document.getElementById('socialShortcutLimitControl');
    let select = document.getElementById('socialShortcutLimit');
    if (!control || !select) {
      control = document.createElement('div');
      control.id = 'socialShortcutLimitControl';
      control.style.cssText = 'padding:10px 18px 0;display:flex;align-items:center;justify-content:space-between;gap:10px';

      const label = document.createElement('label');
      label.htmlFor = 'socialShortcutLimit';
      label.textContent = 'Mostrar atalhos';
      label.style.cssText = 'color:#667d90;font-size:.72rem;font-weight:800';

      select = document.createElement('select');
      select.id = 'socialShortcutLimit';
      select.className = 'social-select';
      select.setAttribute('aria-label', 'Quantidade de atalhos de trabalho exibidos');
      select.style.cssText = 'width:auto;min-width:96px;min-height:36px;padding:6px 9px';

      control.append(label, select);
      heading.insertAdjacentElement('afterend', control);
    }

    control.hidden = total <= 1;
    select.innerHTML = '';
    for (let amount = 1; amount <= total; amount += 1) {
      const option = document.createElement('option');
      option.value = String(amount);
      option.textContent = amount === total ? `Todos (${total})` : String(amount);
      select.appendChild(option);
    }
    select.value = String(selected);
    select.onchange = () => onChange(Number.parseInt(select.value, 10));
    return select;
  }

  function setAllToolsLinkVisibility(total, displayed) {
    const allToolsLink = document.querySelector('.social-shortcuts a[href="/ferramentas/"]');
    const wrapper = allToolsLink?.parentElement;
    if (wrapper) wrapper.hidden = total <= 0 || displayed >= total;
  }

  function mountShortcuts(user) {
    const shortcuts = document.getElementById('socialShortcutGrid');
    const tools = window.PortalTools;
    if (!shortcuts || !tools?.render || !tools?.cardsFor) return;

    const total = tools.cardsFor(user).length;
    let displayed = readShortcutLimit(user, total);

    const render = () => {
      tools.render(shortcuts, user, { compact: true, limit: displayed });
      setAllToolsLinkVisibility(total, displayed);
    };

    const select = ensureShortcutLimitControl(total, displayed, (nextLimit) => {
      if (!Number.isInteger(nextLimit) || nextLimit < 1 || nextLimit > total) return;
      displayed = nextLimit;
      persistShortcutLimit(user, displayed);
      render();
    });

    if (select) select.value = String(displayed);
    render();
  }

  async function mount(user, config) {
    const home = document.getElementById('socialHome');
    if (!home) return;

    const roleLabel = window.PortalTools?.roleLabels?.[user?.role] || user?.jobTitle || '';
    mountIdentity({
      name: user?.name || user?.username || 'Usuário',
      handle: user?.username || '',
      professional: roleLabel ? { label: roleLabel } : null
    });

    mountShortcuts(user);
    const feed = document.getElementById('socialFeedList');
    const more = document.getElementById('socialFeedMore');
    window.PortalSocialFeed.bindComposer(document.getElementById('socialComposerForm'), feed, more);

    const [payload] = await Promise.all([
      social.api('/api/social/me'),
      window.PortalSocialFeed.load(feed, more)
    ]);
    mountIdentity(payload.profile);
    const audience = document.getElementById('socialComposerAudience');
    if (audience) audience.value = payload.profile.defaultPostAudience || 'friends';
  }

  window.PortalSocialHome = Object.freeze({ mount });
})();
