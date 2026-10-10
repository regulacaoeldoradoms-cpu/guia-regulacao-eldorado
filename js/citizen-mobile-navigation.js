"use strict";

// Shared presentation only: use the original authorized links, chat launcher and
// signed-in account avatar. Native renderers retain all permissions and state.
const INSTANCE = Symbol.for('portal.citizenMobileNavigation');

export function mountCitizenMobileNavigation() {
  if (window[INSTANCE]) { window[INSTANCE].sync(); return window[INSTANCE]; }
  const mobileScreen = matchMedia('screen and (max-width: 900px)');
  const printScreen = matchMedia('print');
  const positions = new WeakMap();
  let mobile = false, printing = false, queued = false;
  let launcher = null, launcherState = null, navigation = null, sourceAvatar = null;
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

  function discoverLauncher() {
    // A navigation remount removes the old nav and its launcher from document.
    // Keep the native reference until its original chat root is removed too.
    if (launcher && !positions.get(launcher)?.isConnected) {
      restoreLauncher();
      // The moved launcher can remain connected after its native root is
      // destroyed. Retire it with that root before discovering its replacement.
      if (launcher.isConnected) launcher.remove();
      launcher = null;
      launcherState = null;
    }
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
      // Social availability can arrive while Tools is parked off-document.
      // Its original marker still defines the native Friends-before-Tools
      // order required when desktop or print restores these same links.
      if (link.getAttribute('href') === '/amigos/') {
        const tools = record.links.find(item => item.getAttribute('href') === '/ferramentas/');
        const toolsMarker = positions.get(tools);
        const linkMarker = positions.get(link);
        if (toolsMarker?.parentNode === record.nav && linkMarker) record.nav.insertBefore(linkMarker, toolsMarker);
      }
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
    // Fallback initials are decorative artwork, so enlarged reading text cannot
    // enlarge the six-icon row. Never edit the auth renderer's original avatar.
    if ((!sourceAvatar.style.backgroundImage || sourceAvatar.style.backgroundImage === 'none') && !clone.hasAttribute('data-home-avatar-initials')) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 28 28');
      svg.setAttribute('aria-hidden', 'true');
      const text = document.createElementNS(svg.namespaceURI, 'text');
      for (const [name, value] of Object.entries({ x:'14', y:'14', 'text-anchor':'middle', 'dominant-baseline':'central', 'font-size':'11', 'font-family':'Arial, sans-serif', 'font-weight':'700', fill:'currentColor' })) text.setAttribute(name, value);
      text.textContent = [...sourceAvatar.textContent.trim()].slice(0, 2).join('');
      text.setAttribute('fill', '#000');
      svg.append(text);
      clone.setAttribute('data-home-avatar-initials', 'true');
      clone.style.setProperty('--home-avatar-initials', `url("data:image/svg+xml,${encodeURIComponent(new XMLSerializer().serializeToString(svg))}")`);
    }
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
    // The Home strip/account menu is the mobile entry point for Tools. Retain
    // this original link off-document so desktop and print restore it exactly.
    if (tools && tools.parentNode !== navigation.parked) navigation.parked.append(tools);
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
    const nativeHome = document.querySelector('.social-mobile-nav > a[href="/"]');
    mobile = mobileScreen.matches && !printing && !printScreen.matches
      && document.body.classList.contains('citizen-readable-layout')
      && Boolean(nativeHome?.isConnected);
    // Restore original controls before removing the styles which keep them visible.
    if (mobile) document.body.classList.add('shared-mobile-navigation');
    syncNavigation();
    if (!mobile) document.body.classList.remove('shared-mobile-navigation');
  }
  function schedule() {
    if (queued) return;
    queued = true;
    queueMicrotask(sync);
  }
  document.addEventListener('focusin', event => { lastFocused = event.target; });
  mobileScreen.addEventListener('change', sync);
  printScreen.addEventListener('change', sync);
  window.addEventListener('beforeprint', () => { printing = true; sync(); });
  window.addEventListener('afterprint', () => { printing = false; sync(); });
  window.addEventListener('portal:session-ready', schedule);
  window.addEventListener('portal:session-cleared', schedule);
  new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
  window[INSTANCE] = Object.freeze({ sync });
  sync();
  return window[INSTANCE];
}
