'use strict';

// Home-only presentation. Existing authentication, forms and post actions retain
// their nodes and listeners; the wider-screen layout is restored at each marker.
let mountedPresentation = null;

export function mountHomeSocialPresentation(user) {
  if (mountedPresentation) {
    mountedPresentation.sync();
    return mountedPresentation;
  }

  const mobileScreen = window.matchMedia('screen and (max-width: 900px)');
  const printScreen = window.matchMedia('print');
  const accountHost = document.querySelector('.portal-topbar .portal-user');
  const composer = document.querySelector('#socialHome .social-composer');
  const form = document.getElementById('socialComposerForm');
  const textarea = document.getElementById('socialComposerText');
  const heading = composer?.querySelector(':scope > h2');
  const title = document.querySelector('.portal-brand-copy h1');
  const subtitle = document.querySelector('.portal-brand-copy p');
  const titleNodes = title ? [...title.childNodes] : [];
  const subtitleNodes = subtitle ? [...subtitle.childNodes] : [];
  const positions = new WeakMap();
  const postMenus = new Map();
  const menuDialogs = new WeakMap();
  const avatarRecords = new Map();
  const avatarMasks = new Map();
  let printing = false;
  let mobile = false;
  let composerExpanded = false;
  let ready = false;
  let syncQueued = false;
  let accountArea = null;
  let logout = null;
  let sideLinks = null;

  function mark(node, label) {
    if (!node || positions.has(node)) return;
    const marker = document.createComment(label);
    node.before(marker);
    positions.set(node, marker);
  }

  function move(node, parent, before = null) {
    if (!node || !parent || before === node || (node.parentNode === parent && node.nextSibling === before)) return;
    const focused = node.contains(document.activeElement) ? document.activeElement : null;
    parent.insertBefore(node, before);
    if (focused && document.activeElement !== focused) focused.focus({ preventScroll: true });
  }

  function restore(node) {
    const marker = node && positions.get(node);
    if (marker?.parentNode && marker.nextSibling !== node) move(node, marker.parentNode, marker.nextSibling);
  }

  function setText(node, text) {
    if (node && node.textContent !== text) node.textContent = text;
  }

  function initialsMask(initials) {
    if (avatarMasks.has(initials)) return avatarMasks.get(initials);
    const namespace = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(namespace, 'svg');
    svg.setAttribute('viewBox', '0 0 36 36');
    const text = document.createElementNS(namespace, 'text');
    for (const [name, value] of Object.entries({
      x: '18', y: '18', 'text-anchor': 'middle', 'dominant-baseline': 'central',
      'font-family': 'Arial, sans-serif', 'font-size': '13', 'font-weight': '700', fill: '#000'
    })) text.setAttribute(name, value);
    text.textContent = initials;
    svg.append(text);
    const mask = `url("data:image/svg+xml,${encodeURIComponent(new XMLSerializer().serializeToString(svg))}")`;
    avatarMasks.set(initials, mask);
    return mask;
  }

  function restoreAvatar(node, record) {
    if (record.flag === null) node.removeAttribute('data-home-avatar-initials');
    else if (node.getAttribute('data-home-avatar-initials') !== record.flag) node.setAttribute('data-home-avatar-initials', record.flag);
    if (record.mask) {
      if (node.style.getPropertyValue('--home-avatar-initials') !== record.mask)
        node.style.setProperty('--home-avatar-initials', record.mask, record.priority);
    } else if (node.style.getPropertyValue('--home-avatar-initials')) node.style.removeProperty('--home-avatar-initials');
  }

  // Source text and photo backgrounds remain owned by auth-client/social-api.
  // Only the decorative mask changes; its fixed SVG viewport ignores text zoom.
  const avatarObserver = new MutationObserver(scheduleSync);
  function syncAvatars() {
    // Read the latest source state, then reconnect after our own style updates.
    avatarObserver.disconnect();
    for (const [node, record] of avatarRecords) {
      if (!node.isConnected) {
        restoreAvatar(node, record);
        avatarRecords.delete(node);
      }
    }
    if (!mobile) {
      for (const [node, record] of avatarRecords) restoreAvatar(node, record);
      avatarRecords.clear();
      return;
    }
    document.querySelectorAll('.home-composer-avatar, #socialFeedList .social-avatar, .portal-topbar .portal-profile-avatar:not(.home-nav-profile-avatar), #portalChatRoot .portal-chat-avatar').forEach(node => {
      if (!avatarRecords.has(node)) {
        avatarRecords.set(node, {
          flag: node.getAttribute('data-home-avatar-initials'),
          mask: node.style.getPropertyValue('--home-avatar-initials'),
          priority: node.style.getPropertyPriority('--home-avatar-initials')
        });
      }
      const background = node.style.backgroundImage;
      const initials = [...node.textContent.trim()].slice(0, 2).join('');
      if (!initials || (background && background !== 'none')) {
        restoreAvatar(node, avatarRecords.get(node));
      } else {
        const mask = initialsMask(initials);
        if (node.getAttribute('data-home-avatar-initials') !== 'true') node.setAttribute('data-home-avatar-initials', 'true');
        if (node.style.getPropertyValue('--home-avatar-initials') !== mask) node.style.setProperty('--home-avatar-initials', mask);
      }
      avatarObserver.observe(node, { attributes: true, attributeFilter: ['style'], childList: true, characterData: true, subtree: true });
    });
  }

  const accountMenu = document.createElement('details');
  accountMenu.id = 'homeAccountMenu';
  accountMenu.className = 'home-account-menu';
  accountMenu.hidden = true;
  const accountSummary = document.createElement('summary');
  accountSummary.textContent = 'Conta';
  accountSummary.setAttribute('aria-controls', 'homeAccountPanel');
  const accountPanel = document.createElement('div');
  accountPanel.id = 'homeAccountPanel';
  accountPanel.className = 'home-account-panel';
  const toolsLink = document.createElement('a');
  toolsLink.className = 'home-account-tools';
  toolsLink.href = '/ferramentas/';
  toolsLink.textContent = 'Ferramentas';
  accountPanel.append(toolsLink);
  const profileLabel = document.createElement('span');
  profileLabel.className = 'home-account-label';
  profileLabel.textContent = 'Perfil';
  accountMenu.append(accountSummary, accountPanel);
  accountHost?.append(accountMenu);

  const prompt = document.createElement('div');
  prompt.className = 'home-composer-prompt';
  prompt.hidden = true;
  const avatar = document.createElement('div');
  avatar.className = 'social-avatar home-composer-avatar';
  avatar.setAttribute('aria-hidden', 'true');
  const nameParts = String(user?.name || user?.username || '?').trim().split(/\s+/);
  avatar.textContent = `${nameParts[0]?.[0] || ''}${nameParts.length > 1 ? nameParts.at(-1)[0] : ''}`.toUpperCase();
  const trigger = document.createElement('button');
  trigger.id = 'homeComposerTrigger';
  trigger.className = 'home-composer-trigger';
  trigger.type = 'button';
  trigger.disabled = true;
  trigger.textContent = 'Compartilhar atualização';
  trigger.setAttribute('aria-controls', 'homeComposerPanel');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-describedby', 'homeComposerWarning');
  prompt.append(avatar, trigger);
  const warning = document.createElement('p');
  warning.id = 'homeComposerWarning';
  warning.className = 'home-composer-warning';
  warning.textContent = 'Não inclua dados de pacientes ou documentos assistenciais.';
  warning.hidden = true;
  const composerPanel = document.createElement('div');
  composerPanel.id = 'homeComposerPanel';
  composerPanel.className = 'home-composer-panel';
  composerPanel.hidden = true;
  const collapse = document.createElement('button');
  collapse.id = 'homeComposerCollapse';
  collapse.className = 'social-button secondary home-composer-collapse';
  collapse.type = 'button';
  collapse.textContent = 'Recolher';
  collapse.setAttribute('aria-controls', 'homeComposerPanel');
  composerPanel.append(collapse);
  mark(heading, 'Home composer heading position');
  mark(form, 'Home composer form position');
  composer?.prepend(prompt, warning, composerPanel);

  function composerBusy() {
    return Boolean(form?.querySelector('[type="submit"]:disabled'));
  }

  function syncComposer() {
    const busy = composerBusy();
    // Never hide the textarea while the original submit callback owns focus.
    if (mobile && busy) composerExpanded = true;
    trigger.disabled = !ready || busy;
    collapse.disabled = busy;
    setText(trigger, textarea?.value.trim() ? 'Continuar rascunho' : 'Compartilhar atualização');
    trigger.setAttribute('aria-expanded', mobile && composerExpanded ? 'true' : 'false');
    prompt.hidden = !mobile;
    warning.hidden = !mobile || !composerExpanded;
    if (mobile) {
      composerPanel.hidden = !composerExpanded;
      move(form, composerPanel, collapse);
      move(heading, composerPanel, form || collapse);
      const describedBy = new Set((textarea?.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean));
      describedBy.add(warning.id);
      if (textarea?.getAttribute('aria-describedby') !== [...describedBy].join(' ')) textarea?.setAttribute('aria-describedby', [...describedBy].join(' '));
    } else {
      restore(heading);
      restore(form);
      composerPanel.hidden = true;
      const describedBy = (textarea?.getAttribute('aria-describedby') || '').split(/\s+/).filter(value => value && value !== warning.id).join(' ');
      if (describedBy) textarea?.setAttribute('aria-describedby', describedBy);
      else textarea?.removeAttribute('aria-describedby');
    }
    const sourceAvatar = document.getElementById('socialIdentityAvatar');
    if (sourceAvatar) {
      setText(avatar, sourceAvatar.textContent);
      if (avatar.style.backgroundImage !== sourceAvatar.style.backgroundImage) avatar.style.backgroundImage = sourceAvatar.style.backgroundImage;
    }
  }

  trigger.addEventListener('click', () => {
    if (!mobile || !ready || composerBusy()) return;
    composerExpanded = true;
    syncComposer();
    textarea?.focus({ preventScroll: true });
  });
  collapse.addEventListener('click', () => {
    if (!mobile || composerBusy()) return;
    composerExpanded = false;
    syncComposer();
    trigger.focus({ preventScroll: true });
  });
  textarea?.addEventListener('input', syncComposer);
  // The social feed handler changes the submit button in its own finally block.
  // Observing that state preserves both successful and failed publication focus.
  if (form) new MutationObserver(syncComposer).observe(form, { attributes: true, subtree: true, attributeFilter: ['disabled'] });
  const sourceAvatar = document.getElementById('socialIdentityAvatar');
  if (sourceAvatar) new MutationObserver(syncComposer).observe(sourceAvatar, { attributes: true, childList: true, subtree: true, attributeFilter: ['style'] });

  function closeMenu(menu, returnFocus = false) {
    if (!menu || menuDialogs.get(menu)?.open) return;
    if (menu.open) menu.open = false;
    if (returnFocus && mobile && !menu.hidden && menu.isConnected) menu.querySelector(':scope > summary')?.focus({ preventScroll: true });
  }

  function menus() {
    return [accountMenu, ...[...postMenus.values()].map(record => record.menu)];
  }

  function bindMenu(menu) {
    menu.addEventListener('toggle', () => {
      if (!menu.open) return;
      for (const other of menus()) if (other !== menu) closeMenu(other);
    });
  }
  bindMenu(accountMenu);

  function buildPostMenu(actions) {
    const menu = document.createElement('details');
    menu.className = 'home-post-menu';
    const summary = document.createElement('summary');
    summary.textContent = '⋯';
    summary.setAttribute('aria-label', 'Opções da publicação');
    const panel = document.createElement('div');
    panel.className = 'home-post-menu-panel';
    menu.append(summary, panel);
    mark(actions, 'Home post actions position');
    const record = { menu, panel, actions };
    postMenus.set(actions, record);
    bindMenu(menu);
    // Existing action listeners run first. Editing has already focused its
    // textarea; confirmation and report dialogs keep their return target visible.
    actions.addEventListener('click', (event) => {
      if (!mobile || !event.target.closest('button')) return;
      const dialog = document.querySelector('#socialConfirmDialog[open], #socialReportDialog[open]');
      if (dialog) {
        menuDialogs.set(menu, dialog);
        dialog.addEventListener('close', () => {
          menuDialogs.delete(menu);
          queueMicrotask(() => {
            const focus = document.activeElement;
            closeMenu(menu, actions.contains(focus) || focus === document.body || !focus?.isConnected);
          });
        }, { once: true });
      } else {
        closeMenu(menu, actions.contains(document.activeElement));
      }
    });
    return record;
  }

  function syncPostMenus() {
    for (const [actions, record] of postMenus) {
      if (!record.menu.isConnected && !actions.isConnected) postMenus.delete(actions);
    }
    if (mobile) {
      document.querySelectorAll('#socialFeedList .social-post-header > .social-row-actions').forEach(actions => {
        const record = postMenus.get(actions) || buildPostMenu(actions);
        const marker = positions.get(actions);
        record.menu.hidden = false;
        if (actions.contains(document.activeElement) || menuDialogs.get(record.menu)?.open) record.menu.open = true;
        move(record.menu, marker.parentNode, marker.nextSibling);
        move(actions, record.panel);
      });
      for (const { menu } of postMenus.values()) menu.hidden = false;
    } else {
      for (const { menu, actions } of postMenus.values()) {
        const summaryFocused = menu.querySelector(':scope > summary') === document.activeElement;
        restore(actions);
        menu.open = false;
        menu.hidden = true;
        if (summaryFocused && !printing && !printScreen.matches) actions.querySelector('button')?.focus({ preventScroll: true });
      }
    }
  }

  function syncAccount() {
    accountArea ||= accountHost?.querySelector('.portal-account-area');
    logout ||= document.getElementById('portalLogout');
    sideLinks ||= document.querySelector('#socialHome .social-side-links') || accountPanel.querySelector('.social-side-links');
    mark(accountArea, 'Home account identity position');
    mark(logout, 'Home logout position');
    mark(sideLinks, 'Home account preferences position');
    accountMenu.hidden = !mobile;
    profileLabel.hidden = !mobile;
    if (mobile) {
      if ([accountArea, sideLinks, logout].some(node => node?.contains(document.activeElement))) accountMenu.open = true;
      if (accountArea && !accountArea.contains(profileLabel)) accountArea.append(profileLabel);
      // Keep the account anchor under .portal-user for auth-client refreshes.
      move(logout, accountPanel);
      move(sideLinks, accountPanel, logout);
      move(toolsLink, accountPanel, sideLinks || logout);
      move(accountArea, accountPanel, toolsLink);
    } else {
      accountMenu.open = false;
      restore(accountArea);
      restore(logout);
      restore(sideLinks);
      profileLabel.remove();
    }
  }

  function sync() {
    syncQueued = false;
    const compact = mobileScreen.matches && !printing && !printScreen.matches;
    const changing = compact !== mobile;
    const focused = document.activeElement;
    if (changing && compact && form?.contains(focused)) composerExpanded = true;
    mobile = compact;
    document.body.classList.add('home-social-presentation');
    document.body.classList.toggle('home-social-mobile', mobile);
    if (mobile) {
      setText(title, 'Regulação');
      setText(subtitle, 'Eldorado/MS');
    } else if (changing) {
      title?.replaceChildren(...titleNodes);
      subtitle?.replaceChildren(...subtitleNodes);
    }
    syncAccount();
    syncComposer();
    syncPostMenus();
    syncAvatars();
    if (changing && !mobile && !printing && !printScreen.matches) {
      if (focused === trigger || focused === collapse) textarea?.focus({ preventScroll: true });
      if (focused === accountSummary) accountArea?.focus({ preventScroll: true });
    }
  }

  function scheduleSync() {
    if (syncQueued) return;
    syncQueued = true;
    queueMicrotask(sync);
  }

  document.addEventListener('pointerdown', (event) => {
    if (!mobile) return;
    for (const menu of menus()) if (!menu.contains(event.target)) closeMenu(menu);
  });
  document.addEventListener('keydown', (event) => {
    if (!mobile || event.key !== 'Escape' || event.defaultPrevented) return;
    if (document.querySelector('dialog[open]')) return;
    const openMenu = menus().find(menu => menu.open && menu.contains(document.activeElement)) || menus().find(menu => menu.open);
    if (openMenu) {
      event.preventDefault();
      closeMenu(openMenu, true);
    }
  });
  mobileScreen.addEventListener('change', sync);
  printScreen.addEventListener('change', sync);
  window.addEventListener('beforeprint', () => { printing = true; sync(); });
  window.addEventListener('afterprint', () => { printing = false; sync(); });
  new MutationObserver(scheduleSync).observe(document.body, { childList: true, subtree: true });

  function setReady(value = true) {
    ready = Boolean(value);
    syncComposer();
  }

  mountedPresentation = Object.freeze({ sync, setReady });
  sync();
  // mount() is synchronous: waiting here would deadlock the Home bootstrap that
  // creates PortalHomeReady. Its promise is available after this call returns.
  queueMicrotask(() => {
    if (window.PortalHomeReady?.then) window.PortalHomeReady.then(setReady, () => setReady(false));
  });
  return mountedPresentation;
}
