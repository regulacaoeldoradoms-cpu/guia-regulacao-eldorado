'use strict';

// Presentation only: retain the authorized cards, native navigation controls and
// chat launcher so their listeners, badges and desktop positions stay intact.
let mountedComposition = null;

export function mountHomeMobileComposition(user) {
  if (mountedComposition) {
    mountedComposition.sync();
    return mountedComposition;
  }

  const mobileScreen = window.matchMedia('screen and (max-width: 900px)');
  const printScreen = window.matchMedia('print');
  const shortcuts = document.querySelector('#socialHome .social-shortcuts');
  const feed = document.querySelector('#socialHome .social-feed-column');
  const composer = feed?.querySelector('.social-composer');
  const grid = document.getElementById('socialShortcutGrid');
  const heading = shortcuts?.querySelector('.social-section-heading');
  const hint = document.getElementById('homeToolsHint');
  const allToolsLink = shortcuts?.querySelector('a[href="/ferramentas/"]');
  const allTools = allToolsLink?.closest('.social-card-pad');
  const originalAllToolsContent = allToolsLink ? [...allToolsLink.childNodes] : [];
  const originalGridAttributes = new Map(['tabindex', 'role', 'aria-label', 'aria-describedby']
    .map(name => [name, grid?.getAttribute(name) ?? null]));
  const originallyScreenReaderOnly = new Map([heading, hint].filter(Boolean)
    .map(node => [node, node.classList.contains('sr-only')]));
  const allToolsHadClass = allToolsLink?.classList.contains('home-all-tools-link');
  const positions = new WeakMap();
  let rendererAllToolsHidden = Boolean(allTools?.hidden);
  let mobile = false;
  let printing = false;
  let queued = false;
  let limitControl = null;
  let launcher = null;
  let launcherState = null;
  let navigation = null;
  let sourceAvatar = null;
  let lastFocused = document.activeElement;

  function setAttribute(node, name, value) {
    if (!node) return;
    if (value === null) {
      if (node.hasAttribute(name)) node.removeAttribute(name);
    } else if (node.getAttribute(name) !== value) node.setAttribute(name, value);
  }

  function mark(node, label) {
    if (!node || positions.has(node) || !node.parentNode) return;
    const marker = document.createComment(label);
    node.before(marker);
    positions.set(node, marker);
  }

  function move(node, parent, before = null) {
    if (!node || !parent || node === before
      || (node.parentNode === parent && node.nextSibling === before)) return;
    const focused = node.contains(document.activeElement) ? document.activeElement : null;
    parent.insertBefore(node, before);
    if (focused && document.activeElement !== focused) focused.focus({ preventScroll: true });
  }

  function restore(node) {
    const marker = node && positions.get(node);
    if (marker?.parentNode) move(node, marker.parentNode, marker.nextSibling);
  }

  const strip = document.createElement('div');
  strip.className = 'home-tools-strip';
  strip.setAttribute('role', 'region');
  strip.setAttribute('aria-label', 'Ferramentas autorizadas');
  strip.tabIndex = 0;
  if (hint) strip.setAttribute('aria-describedby', hint.id);
  const options = document.createElement('details');
  options.className = 'home-tools-options';
  options.hidden = true;
  const summary = document.createElement('summary');
  summary.textContent = 'Mostrar atalhos';
  options.append(summary);
  const toolsIcon = document.createElement('span');
  toolsIcon.className = 'home-all-tools-icon';
  toolsIcon.setAttribute('aria-hidden', 'true');
  toolsIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>';
  const toolsLabel = document.createElement('span');
  toolsLabel.className = 'home-all-tools-label';
  toolsLabel.textContent = 'Todas as ferramentas';
  mark(shortcuts, 'Home shortcuts desktop position');
  mark(grid, 'Home authorized grid position');
  mark(allTools, 'Home complete catalogue position');

  const toolStateObserver = new MutationObserver(schedule);
  function discoverControl() {
    const next = document.getElementById('socialShortcutLimitControl');
    if (next === limitControl) return;
    limitControl = next;
    mark(limitControl, 'Home shortcut preference position');
    toolStateObserver.disconnect();
    if (allTools) toolStateObserver.observe(allTools, { attributes: true, attributeFilter: ['hidden'] });
    if (limitControl) toolStateObserver.observe(limitControl, { attributes: true, attributeFilter: ['hidden'] });
  }
  if (allTools) toolStateObserver.observe(allTools, { attributes: true, attributeFilter: ['hidden'] });

  function rememberRendererVisibility() {
    const select = document.getElementById('socialShortcutLimit');
    if (select) {
      // social-home renders one option per authorized tool. Reading its current
      // selection preserves the renderer's hidden state even when it sets false
      // while our mobile override has already removed the hidden attribute.
      const total = select.options.length;
      const displayed = Number.parseInt(select.value, 10) || 0;
      rendererAllToolsHidden = total <= 0 || displayed >= total;
    } else if (allTools && (!mobile || allTools.hidden)) {
      rendererAllToolsHidden = allTools.hidden;
    }
  }

  function syncTools() {
    discoverControl();
    const panel = document.getElementById('homeAccountPanel');
    const focused = document.activeElement;
    if (mobile && shortcuts && feed && composer) {
      move(shortcuts, feed, composer.nextSibling);
      if (strip.parentNode !== shortcuts) shortcuts.append(strip);
      move(allTools, strip);
      move(grid, strip, allTools || null);
      for (const name of originalGridAttributes.keys()) setAttribute(grid, name, null);
      for (const node of originallyScreenReaderOnly.keys()) node.classList.add('sr-only');
      if (allToolsLink && allToolsLink.firstChild !== toolsIcon) allToolsLink.replaceChildren(toolsIcon, toolsLabel);
      allToolsLink?.classList.add('home-all-tools-link');
      if (allTools?.hidden) allTools.hidden = false;
      // Reveal the destination before moving a focused native selector into it.
      options.hidden = !panel || !limitControl || limitControl.hidden;
      if (panel) {
        // The account presentation owns the order of its other children. Only
        // attach once; repeatedly appending here would fight its logout move.
        if (options.parentNode !== panel) panel.append(options);
        if (limitControl?.contains(focused)) {
          options.open = true;
          const accountMenu = document.getElementById('homeAccountMenu');
          if (accountMenu) accountMenu.open = true;
        }
        if (limitControl?.parentNode !== options) move(limitControl, options);
      }
    } else {
      restore(shortcuts);
      restore(grid);
      restore(allTools);
      restore(limitControl);
      if (strip.parentNode) strip.remove();
      if (options.parentNode) options.remove();
      options.hidden = true;
      options.open = false;
      for (const [name, value] of originalGridAttributes) setAttribute(grid, name, value);
      for (const [node, original] of originallyScreenReaderOnly) node.classList.toggle('sr-only', original);
      if (allToolsLink?.firstChild === toolsIcon) allToolsLink.replaceChildren(...originalAllToolsContent);
      allToolsLink?.classList.toggle('home-all-tools-link', Boolean(allToolsHadClass));
      if (allTools && allTools.hidden !== rendererAllToolsHidden) allTools.hidden = rendererAllToolsHidden;
      if (!printing && !printScreen.matches) {
        if (focused === summary) document.getElementById('socialShortcutLimit')?.focus({ preventScroll: true });
        if (focused === strip) grid?.focus({ preventScroll: true });
      }
    }
    const selected = document.getElementById('socialShortcutLimit')?.selectedOptions[0]?.textContent || '';
    const label = `Mostrar atalhos${selected ? ': ' + selected : ''}`;
    if (summary.textContent !== label) summary.textContent = label;
  }

  function discoverLauncher() {
    // A navigation remount removes the old nav and its launcher from document.
    // Keep the native reference until its original chat root is removed too.
    const found = document.getElementById('portalChatLauncher');
    if (found && found !== launcher) {
      if (launcher) restoreLauncher();
      launcher = found;
      mark(launcher, 'Home chat launcher position');
      launcherState = {
        label: launcher.getAttribute('aria-label'),
        navClass: launcher.classList.contains('social-mobile-nav-link')
      };
    }
  }

  function restoreLauncher() {
    if (!launcher || !launcherState) return;
    restore(launcher);
    launcher.classList.toggle('social-mobile-nav-link', launcherState.navClass);
    setAttribute(launcher, 'aria-label', launcherState.label);
  }

  function rememberNavigation(nav) {
    mark(nav, 'Home mobile navigation position');
    const links = [...nav.querySelectorAll(':scope > .social-mobile-nav-link')];
    for (const link of links) mark(link, 'Home navigation item position');
    const profile = links.find(link => link.getAttribute('href') === '/perfil/');
    const profileIcon = profile?.querySelector('.social-nav-icon');
    return {
      nav, links, parked: document.createDocumentFragment(),
      labels: new Map(links.map(link => [link, link.getAttribute('aria-label')])),
      iconNavigation: nav.getAttribute('data-home-icon-navigation'),
      count: nav.style.getPropertyValue('--home-nav-count'),
      countPriority: nav.style.getPropertyPriority('--home-nav-count'),
      profileIcon, profileContent: profileIcon ? [...profileIcon.childNodes] : [],
      avatarSignature: null, avatarClone: null
    };
  }

  function refreshNavigation(record) {
    // Pets may add or replace its original link after the social nav mounts.
    // Forget externally removed links, retaining only our parked Tools link.
    record.links = record.links.filter(link => {
      if (link.parentNode === record.nav || link.parentNode === record.parked) return true;
      const marker = positions.get(link);
      if (marker?.parentNode === record.nav) marker.remove();
      record.labels.delete(link);
      return false;
    });
    for (const link of record.nav.querySelectorAll(':scope > .social-mobile-nav-link')) {
      if (link === launcher || record.links.includes(link)) continue;
      mark(link, 'Home navigation item position');
      record.links.push(link);
      record.labels.set(link, link.getAttribute('aria-label'));
    }
    const profile = record.links.find(link => link.getAttribute('href') === '/perfil/');
    const icon = profile?.querySelector('.social-nav-icon');
    if (icon !== record.profileIcon) {
      if (record.profileIcon && record.avatarClone?.parentNode === record.profileIcon) {
        record.profileIcon.replaceChildren(...record.profileContent);
      }
      record.profileIcon = icon;
      record.profileContent = icon ? [...icon.childNodes] : [];
      record.avatarClone = null;
      record.avatarSignature = null;
    }
  }

  function restoreNavigation(record, restorePosition = true) {
    if (!record) return;
    restoreLauncher();
    for (const link of record.links) {
      restore(link);
      setAttribute(link, 'aria-label', record.labels.get(link));
    }
    setAttribute(record.nav, 'data-home-icon-navigation', record.iconNavigation);
    if (record.count) record.nav.style.setProperty('--home-nav-count', record.count, record.countPriority);
    else record.nav.style.removeProperty('--home-nav-count');
    if (record.profileIcon && record.avatarClone?.parentNode === record.profileIcon) record.profileIcon.replaceChildren(...record.profileContent);
    record.avatarClone = null;
    record.avatarSignature = null;
    // social-navigation deliberately removes retired navs during remount. Its
    // body marker can outlive that nav, so never resurrect a detached one.
    if (restorePosition && record.nav.isConnected) restore(record.nav);
  }

  const avatarObserver = new MutationObserver(schedule);
  function syncAvatar(record) {
    const next = document.querySelector('.portal-topbar .portal-user .portal-profile-avatar:not(.home-nav-profile-avatar)');
    if (next !== sourceAvatar) {
      avatarObserver.disconnect();
      sourceAvatar = next;
      if (sourceAvatar) avatarObserver.observe(sourceAvatar, {
        attributes: true, attributeFilter: ['style'], childList: true, characterData: true, subtree: true
      });
    }
    if (!record?.profileIcon || !sourceAvatar) return;
    const signature = `${sourceAvatar.textContent}\u0000${sourceAvatar.getAttribute('style') || ''}`;
    if (record.avatarSignature === signature && record.avatarClone?.parentNode === record.profileIcon) return;
    const clone = sourceAvatar.cloneNode(true);
    clone.removeAttribute('id');
    clone.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
    clone.classList.add('home-nav-profile-avatar');
    clone.setAttribute('aria-hidden', 'true');
    record.profileIcon.replaceChildren(clone);
    record.avatarClone = clone;
    record.avatarSignature = signature;
  }

  function navLabel(link) {
    if (link === launcher) return 'Chat';
    const label = link.querySelector(':scope > span:not(.social-nav-icon):not(.social-nav-badge)')?.textContent.trim();
    return label || link.getAttribute('aria-label') || link.getAttribute('title') || link.textContent.trim();
  }

  function syncNavigation() {
    discoverLauncher();
    const nav = document.querySelector('.social-mobile-nav');
    const previous = navigation;
    const recoverFocus = previous && previous.nav !== nav && !previous.nav.isConnected
      && previous.nav.contains(lastFocused) && document.activeElement === document.body ? lastFocused : null;
    if (navigation?.nav !== nav) {
      restoreNavigation(navigation, false);
      navigation = nav ? rememberNavigation(nav) : null;
    }
    if (navigation) refreshNavigation(navigation);
    if (!mobile || !navigation) {
      restoreNavigation(navigation);
      restoreLauncher();
      return;
    }
    if (nav.parentNode !== document.body) move(nav, document.body);
    const byPath = path => navigation.links.find(link => link.getAttribute('href') === path);
    const tools = byPath('/ferramentas/');
    if (tools?.parentNode === nav) navigation.parked.append(tools);
    const notification = navigation.links.find(link => link.id === 'socialNotificationTriggerMobile');
    const ordered = [byPath('/'), byPath('/amigos/'), launcher, notification, byPath('/mascotes/'), byPath('/perfil/')].filter(Boolean);
    if (launcher) launcher.classList.add('social-mobile-nav-link');
    let before = null;
    for (const link of [...ordered].reverse()) {
      move(link, nav, before);
      setAttribute(link, 'aria-label', navLabel(link));
      before = link;
    }
    setAttribute(nav, 'data-home-icon-navigation', 'true');
    const count = String(nav.querySelectorAll(':scope > .social-mobile-nav-link').length);
    if (nav.style.getPropertyValue('--home-nav-count') !== count) nav.style.setProperty('--home-nav-count', count);
    syncAvatar(navigation);
    if (recoverFocus) {
      const replacement = recoverFocus === launcher ? launcher
        : ordered.find(link => (recoverFocus.id && link.id === recoverFocus.id)
          || (recoverFocus.getAttribute('href') && link.getAttribute('href') === recoverFocus.getAttribute('href')));
      replacement?.focus({ preventScroll: true });
    }
  }

  function sync() {
    queued = false;
    rememberRendererVisibility();
    mobile = mobileScreen.matches && !printing && !printScreen.matches;
    syncTools();
    syncNavigation();
  }

  function schedule() {
    if (queued) return;
    queued = true;
    queueMicrotask(sync);
  }

  strip.addEventListener('keydown', event => {
    if (!mobile || event.target !== strip || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    const card = strip.querySelector('.hub-card, .home-all-tools-link');
    if (!card) return;
    event.preventDefault();
    const step = card.getBoundingClientRect().width + (parseFloat(getComputedStyle(strip).columnGap) || 0);
    strip.scrollBy({ left: event.key === 'ArrowRight' ? step : -step, behavior: 'auto' });
  });
  strip.addEventListener('focusin', event => {
    const card = event.target.closest('.hub-card, .home-all-tools-link');
    if (!mobile || !card) return;
    requestAnimationFrame(() => {
      if (!mobile || !card.isConnected) return;
      const bounds = strip.getBoundingClientRect();
      const focused = card.getBoundingClientRect();
      const offset = focused.left < bounds.left ? focused.left - bounds.left
        : focused.right > bounds.right ? focused.right - bounds.right : 0;
      if (offset) strip.scrollBy({ left: offset, behavior: 'auto' });
    });
  });
  document.addEventListener('focusin', event => { lastFocused = event.target; });
  document.addEventListener('change', event => {
    if (event.target.id === 'socialShortcutLimit') schedule();
  });
  mobileScreen.addEventListener('change', sync);
  printScreen.addEventListener('change', sync);
  window.addEventListener('beforeprint', () => { printing = true; sync(); });
  window.addEventListener('afterprint', () => { printing = false; sync(); });
  new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
  mountedComposition = Object.freeze({ sync });
  sync();
  return mountedComposition;
}
