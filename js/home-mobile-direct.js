/* Shared mobile presentation. The existing chat owns contacts, drafts and delivery. */
const INSTANCE = Symbol.for('portal.homeMobileDirect');
const HISTORY_KEY = '__portalHomeDirect';

export function mountHomeMobileDirect() {
  if (window[INSTANCE]) {
    window[INSTANCE].refresh();
    return window[INSTANCE];
  }
  const savedEntry = history.state?.[HISTORY_KEY];
  const resumableEntry = typeof savedEntry?.owner === 'string'
    && savedEntry.owner.startsWith('home-direct-') && [1, 2].includes(savedEntry.depth);
  // Reuse our current chain after reload; do not add a second pair of Back steps.
  const owner = resumableEntry ? savedEntry.owner
    : `home-direct-${globalThis.crypto?.randomUUID?.() || Date.now()}`;
  const body = document.body;
  const mobileScreen = window.matchMedia('screen and (max-width: 900px)');
  let root = null, navigation = null, frame = 0, previousView = 0;
  let selectedRoute = null, currentRoute = null, pendingGroupRoute = null, lastProfileHandle = '';
  let replaying = false, traversing = false;
  let replayGeneration = 0;
  let trackedEntry = resumableEntry ? savedEntry : null;
  let sessionEnded = false;
  let hasPresented = false;
  let sequence = resumableEntry ? Number(savedEntry.id) || 0 : 0;
  const routes = new Map();
  const knownHandles = new Map();
  const originalLabels = new Map();
  let notificationCard = null, notificationPosition = null, notificationDetails = null;
  let pageContext = null, returnToPage = false, savedConversation = null, pendingConversation = null;
  let resumingConversation = null;
  let mobileConversationPosition = null;
  let reopenAfterClose = false;
  let resumeGeneration = 0;
  const enabled = () => !sessionEnded && body.classList.contains('shared-mobile-navigation');
  const marker = () => {
    const value = history.state?.[HISTORY_KEY];
    return value?.owner === owner ? value : null;
  };
  const view = () => !root?.classList.contains('open') ? 0
    : root.querySelector('#portalChatConversationView.active, #portalChatGroupView.active') ? 2 : 1;
  const click = id => document.getElementById(id)?.click();
  const nativeClose = () => {
    if (root?.classList.contains('open')) click('portalChatClose');
  };

  function rememberPage() {
    if (view() || pageContext) return;
    pageContext = { x: window.scrollX, y: window.scrollY, focus: document.activeElement };
  }

  function restorePage() {
    if (!returnToPage || view() || replaying || traversing) return;
    returnToPage = false;
    const context = pageContext;
    pageContext = null;
    const focus = context?.focus?.isConnected && context.focus !== body
      ? context.focus : navigation?.querySelector('a[href="/"]');
    focus?.focus({ preventScroll: true });
    if (context) window.scrollTo({ left: context.x, top: context.y, behavior: 'instant' });
    const reopen = reopenAfterClose;
    reopenAfterClose = false;
    if (reopen && enabled()) {
      queueMicrotask(() => { if (enabled() && !view()) click('portalChatLauncher'); });
    }
  }

  function saveConversation() {
    if (view() !== 2) return null;
    rememberRoute();
    const group = root.classList.contains('group-open');
    const input = document.getElementById(group ? 'portalGroupInput' : 'portalChatInput');
    const messages = document.getElementById(group ? 'portalGroupMessages' : 'portalChatMessages');
    const saved = {
      route: currentRoute, handle: group ? '' : lastProfileHandle, group,
      scrollTop: messages?.scrollTop || 0,
      selectionStart: input?.selectionStart, selectionEnd: input?.selectionEnd,
      selectionDirection: input?.selectionDirection,
      inputScrollTop: input?.scrollTop || 0, inputScrollLeft: input?.scrollLeft || 0
    };
    const key = saved.route ? `${group ? 'group' : 'direct'}:${saved.route.kind}:${saved.route.value}`
      : !group && saved.handle ? `handle:${saved.handle}` : null;
    if (enabled() && mobileScreen.matches) {
      mobileConversationPosition = key && messages?.clientHeight > 0 ? { key, scrollTop: saved.scrollTop } : null;
    } else if (key && mobileConversationPosition?.key === key) {
      // Media reflow can clamp the scroller before the route's close callback.
      saved.scrollTop = mobileConversationPosition.scrollTop;
    }
    return saved;
  }

  const resumeObserver = new MutationObserver(schedule);
  function restoreConversationPosition() {
    const saved = pendingConversation;
    if (!saved || view() !== 2 || root.classList.contains('group-open') !== saved.group) return;
    const input = document.getElementById(saved.group ? 'portalGroupInput' : 'portalChatInput');
    const messages = document.getElementById(saved.group ? 'portalGroupMessages' : 'portalChatMessages');
    // Groups repopulate through their native request; preserve the position once
    // those original message nodes arrive, without copying or replaying content.
    if (saved.group && messages && !messages.childElementCount) return;
    pendingConversation = null;
    resumeObserver.disconnect();
    if (input && Number.isInteger(saved.selectionStart)) {
      input.setSelectionRange(saved.selectionStart, saved.selectionEnd, saved.selectionDirection || 'none');
      input.scrollTop = saved.inputScrollTop;
      input.scrollLeft = saved.inputScrollLeft;
    }
    if (messages) messages.scrollTop = saved.scrollTop;
  }

  function cancelResume(preserveConversation = false) {
    resumeGeneration++;
    resumingConversation = preserveConversation ? resumingConversation || pendingConversation : null;
    pendingConversation = null;
    resumeObserver.disconnect();
  }

  function closeToPage() {
    discover();
    reopenAfterClose = false;
    if (sessionEnded || !view()) return;
    savedConversation = resumingConversation || pendingConversation || saveConversation();
    cancelResume();
    returnToPage = true;
    nativeClose();
    // This also finishes the close when a route has already left mobile mode.
    reconcile();
  }

  async function resumeSavedConversation(saved, generation) {
    const stillWaiting = () => generation === resumeGeneration && enabled() && view() === 1 && !replaying && !traversing;
    if (!stillWaiting()) return;
    let route = saved.route;
    if (saved.group && route?.kind !== 'group') return;
    let row = route?.kind === 'group'
      ? [...root.querySelectorAll('[data-group-open]')].find(node => node.dataset.groupOpen === route.value)
      : route?.kind === 'user' ? [...root.querySelectorAll('[data-chat-user]')].find(node => node.dataset.chatUser === route.value) : null;
    if (!row && !saved.group) {
      // Resolve a restored profile handle through the native directory. Await
      // only the read; check cancellation before any native opening action.
      const contacts = await window.PortalChat?.refreshContacts?.();
      if (!stillWaiting() || !Array.isArray(contacts)) return;
      const normalize = value => String(value || '').replace(/^@/, '').trim().toLowerCase();
      const username = route?.kind === 'user' ? decodeURIComponent(route.value) : '';
      const contact = contacts.find(item => username ? item.username === username
        : saved.handle && [item.socialHandle, item.username].some(value => normalize(value) === normalize(saved.handle)));
      if (!contact) return;
      route = { kind: 'user', value: encodeURIComponent(contact.username) };
      row = [...root.querySelectorAll('[data-chat-user]')].find(node => node.dataset.chatUser === route.value);
      // refreshContacts just supplied the native directory, so openByUsername
      // reaches its existing synchronous open path even when search hides a row.
      if (!row && !window.PortalChat?.openByUsername) return;
    }
    if (!route || (!row && saved.group) || !stillWaiting()) return;
    selectedRoute = currentRoute = route;
    if (row) row.click();
    else void window.PortalChat.openByUsername(decodeURIComponent(route.value));
    if (view() !== 2) return;
    resumingConversation = null;
    pendingConversation = saved;
    const messages = document.getElementById(saved.group ? 'portalGroupMessages' : 'portalChatMessages');
    if (messages) resumeObserver.observe(messages, { childList: true, subtree: true });
    schedule();
  }

  function writeHistory(depth, replace = false) {
    // The base entry is never rewritten; only entries created here are replaced.
    if (replace && !marker()) return;
    const state = history.state;
    const entry = { owner, depth, id: ++sequence };
    if (depth === 2 && currentRoute) routes.set(entry.id, currentRoute);
    const next = state && typeof state === 'object' && !Array.isArray(state) ? { ...state } : {};
    next[HISTORY_KEY] = entry;
    try {
      history[replace ? 'replaceState' : 'pushState'](next, '', location.href);
      trackedEntry = entry;
    }
    catch (_) { /* A restrictive host may disallow history; native controls still work. */ }
  }

  function rememberRoute() {
    const selection = selectedRoute;
    selectedRoute = null;
    if (selection) currentRoute = selection;
    if (root?.classList.contains('group-open')) {
      // Accepting an invitation opens asynchronously after its list selection.
      currentRoute = pendingGroupRoute || (currentRoute?.kind === 'group' ? currentRoute : null);
      pendingGroupRoute = null;
      lastProfileHandle = '';
      return;
    }
    const profile = document.getElementById('portalChatProfileLink');
    if (!profile || profile.hidden) return;
    try {
      const handle = new URL(profile.href, location.href).searchParams.get('u');
      if (handle && selection?.kind === 'user') knownHandles.set(handle, selection);
      if (handle && !selection && handle !== lastProfileHandle) currentRoute = knownHandles.get(handle) || null;
      lastProfileHandle = handle || '';
    } catch (_) {}
  }

  function followHistory(nextView, allowNewChain = true) {
    const current = marker();
    trackedEntry = current;
    if (nextView > 0) {
      if (!current && !allowNewChain) return;
      hasPresented = true;
      if (!current) {
        writeHistory(1);
        if (nextView === 2) writeHistory(2);
      } else if (nextView > current.depth) writeHistory(2);
      else if (nextView < current.depth) {
        traversing = true;
        history.back();
      } else if (nextView === 2 && (routes.get(current.id) || null) !== currentRoute) {
        writeHistory(2, true);
      }
    } else if (current && hasPresented) {
      traversing = true;
      history.go(-current.depth);
    }
  }

  function label(node, attribute, value) {
    if (!node) return;
    let labels = originalLabels.get(node);
    if (!labels) { labels = new Map(); originalLabels.set(node, labels); }
    if (!labels.has(attribute)) labels.set(attribute, node.getAttribute(attribute));
    if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
  }

  function positionNotification(active) {
    const card = document.getElementById('portalChatNotificationCard');
    if (!card) return;
    if (card !== notificationCard) {
      notificationCard = card;
      notificationPosition = document.createComment('Native chat notification card position');
      card.before(notificationPosition);
      notificationDetails = document.createElement('details');
      notificationDetails.className = 'home-direct-notifications';
      const summary = document.createElement('summary');
      summary.textContent = 'Notificações de mensagens';
      notificationDetails.append(summary);
      stateObserver.observe(card, { attributes: true, attributeFilter: ['hidden', 'class'] });
    }
    if (active) {
      if (!notificationDetails.isConnected) notificationPosition.after(notificationDetails);
      if (card.parentNode !== notificationDetails) notificationDetails.append(card);
      notificationDetails.hidden = card.hidden;
    } else if (notificationDetails.isConnected) {
      notificationPosition.after(card);
      notificationDetails.remove();
    }
  }

  function measure() {
    if (!enabled()) return;
    const viewport = window.visualViewport;
    const visibleHeight = viewport?.height || window.innerHeight;
    const top = Math.max(0, viewport?.offsetTop || 0);
    const navHeight = navigation?.getBoundingClientRect().height || 0;
    const inset = Math.max(0, window.innerHeight - visibleHeight - top);
    body.classList.toggle('home-direct-compact', visibleHeight - navHeight < 420);
    body.style.setProperty('--home-direct-top', `${top}px`);
    body.style.setProperty('--home-direct-height', `${Math.max(0, visibleHeight - navHeight)}px`);
    body.style.setProperty('--home-direct-nav-height', `${navHeight}px`);
    body.style.setProperty('--home-direct-keyboard-inset', `${inset}px`);
  }

  function reconcile() {
    frame = 0;
    discover();
    const active = enabled();
    const nextView = view();
    positionNotification(active);
    body.classList.toggle('home-direct-open', active && nextView > 0);
    if (!active) {
      // Keep an interrupted resume available to a route's native-close handoff.
      cancelResume(true);
      if (body.classList.contains('home-direct-compact')) body.classList.remove('home-direct-compact');
      if (root) delete root.dataset.homeDirectView;
      for (const [node, labels] of originalLabels) {
        for (const [attribute, value] of labels) {
          if (value === null) node.removeAttribute(attribute);
          else node.setAttribute(attribute, value);
        }
      }
      originalLabels.clear();
      if (document.getElementById('portalChatHeaderName')?.textContent === 'Mensagens') {
        document.getElementById('portalChatHeaderName').textContent = 'Chat interno';
      }
      if (!sessionEnded && trackedEntry && !replaying && !traversing) followHistory(nextView, false);
      restorePage();
      previousView = nextView;
      return;
    }
    measure();
    if (!root) return;
    root.dataset.homeDirectView = nextView === 2 ? 'conversation' : 'list';
    label(root.querySelector('.portal-chat-panel'), 'aria-label', 'Mensagens');
    label(document.getElementById('portalChatSearch'), 'placeholder', 'Pesquisar conversas');
    label(document.getElementById('portalChatSearch'), 'aria-label', 'Pesquisar conversas');
    label(document.getElementById('portalChatInput'), 'aria-label', 'Mensagem');
    label(document.getElementById('portalChatClose'), 'tabindex', '-1');
    label(document.getElementById('portalChatClose'), 'aria-hidden', 'true');
    if (nextView !== 2) {
      selectedRoute = null;
      const name = document.getElementById('portalChatHeaderName');
      if (name && name.textContent !== 'Mensagens') name.textContent = 'Mensagens';
    } else rememberRoute();
    const launcher = document.getElementById('portalChatLauncher');
    label(launcher, 'aria-expanded', String(nextView > 0));
    label(launcher, 'aria-controls', 'portalChatRoot');
    if (!replaying && !traversing) followHistory(nextView);
    if (previousView === 2 && nextView === 1) {
      root.querySelector('.portal-chat-contact')?.focus({ preventScroll: true });
    }
    if (previousView > 0 && nextView === 0 && active && !returnToPage) {
      launcher?.focus({ preventScroll: true });
      pageContext = null;
    }
    restoreConversationPosition();
    if (nextView === 2 && mobileScreen.matches) saveConversation();
    restorePage();
    previousView = nextView;
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(reconcile);
  }

  const stateObserver = new MutationObserver(schedule);
  const navObserver = typeof ResizeObserver === 'function' ? new ResizeObserver(schedule) : null;
  function discover() {
    const nextRoot = document.getElementById('portalChatRoot');
    if (nextRoot !== root) {
      stateObserver.disconnect();
      root = nextRoot;
      if (root) {
        // Observe state, never message contents or the backend's caches.
        stateObserver.observe(root, { attributes: true, attributeFilter: ['class'] });
        root.querySelectorAll('.portal-chat-view').forEach(node => {
          stateObserver.observe(node, { attributes: true, attributeFilter: ['class'] });
        });
      }
    }
    const nextNavigation = document.querySelector('.social-mobile-nav');
    if (nextNavigation !== navigation) {
      navObserver?.disconnect();
      navigation = nextNavigation;
      if (navigation) navObserver?.observe(navigation);
    }
  }

  function restoreConversation(route) {
    if (!route || !root) return;
    if (route.kind === 'group') {
      const row = [...root.querySelectorAll('[data-group-open]')].find(node => node.dataset.groupOpen === route.value);
      row?.click();
      return;
    }
    if (route.kind === 'user') {
      const row = [...root.querySelectorAll('[data-chat-user]')].find(node => node.dataset.chatUser === route.value);
      if (row) row.click();
      return;
    }
    // Unknown programmatic handles fall back to the existing list entry.
    // Never guess a username or start an async open that could undo a later Back.
  }

  async function onPopState(event) {
    if (sessionEnded || !root) { traversing = false; return; }
    const destination = event.state?.[HISTORY_KEY];
    const owned = destination?.owner === owner ? destination : null;
    const previousEntry = trackedEntry;
    cancelResume();
    trackedEntry = owned;
    if (!enabled() && !owned && !previousEntry) return;
    if (!owned && !previousEntry && !previousView && !traversing) return;
    const generation = ++replayGeneration;
    replaying = true;
    traversing = false;
    try {
      // Início remains a close intent even when an earlier internal Back is
      // still traversing an intermediate conversation/list history entry.
      if (returnToPage || !owned) nativeClose();
      else {
        if (!root.classList.contains('open')) click('portalChatLauncher');
        if (owned.depth === 1 && view() === 2) click('portalChatBack');
        else if (owned.depth === 2) {
          currentRoute = routes.get(owned.id) || null;
          restoreConversation(currentRoute);
        }
      }
      // Keep observer deliveries under suppression, including native async opens.
      await new Promise(resolve => requestAnimationFrame(resolve));
      if (generation === replayGeneration) previousView = view();
    } finally {
      if (generation === replayGeneration) {
        replaying = false;
        schedule();
      }
    }
  }

  document.addEventListener('pointerdown', event => {
    if (enabled() && event.target.closest?.('#portalChatLauncher')) rememberPage();
  }, true);
  document.addEventListener('scroll', event => {
    if (!enabled() || !mobileScreen.matches || view() !== 2) return;
    const id = root.classList.contains('group-open') ? 'portalGroupMessages' : 'portalChatMessages';
    if (event.target === document.getElementById(id)) saveConversation();
  }, true);
  document.addEventListener('click', event => {
    if (!enabled()) return;
    if (event.target.closest?.('.social-mobile-nav a[href="/"]') && view()) {
      event.preventDefault();
      event.stopPropagation();
      closeToPage();
      return;
    }
    if (event.target.closest?.('#portalChatLauncher') && !view()) {
      if (returnToPage && (traversing || replaying || marker())) {
        event.preventDefault();
        event.stopImmediatePropagation();
        reopenAfterClose = true;
        return;
      }
      if (!replaying) {
        rememberPage();
        const saved = savedConversation;
        savedConversation = null;
        resumingConversation = saved;
        const generation = ++resumeGeneration;
        // A trusted click can run a microtask checkpoint between capture and
        // the native target listener. Resume after that listener opens the list.
        if (saved) requestAnimationFrame(() => { void resumeSavedConversation(saved, generation).catch(() => {}); });
      }
    }
    if (event.target.closest?.('#portalChatBack, #portalChatClose')) {
      if (event.target.closest('#portalChatBack')) savedConversation = null;
      cancelResume();
    }
    const row = event.target.closest?.('#portalChatRoot [data-chat-user], #portalChatRoot [data-group-open]');
    if (row) {
      cancelResume();
      mobileConversationPosition = null;
      selectedRoute = row.hasAttribute('data-group-open')
        ? { kind: 'group', value: row.dataset.groupOpen }
        : { kind: 'user', value: row.dataset.chatUser };
      pendingGroupRoute = selectedRoute.kind === 'group' ? selectedRoute : null;
    }
  }, true);
  document.addEventListener('keydown', event => {
    if (!enabled() || !view() || event.key !== 'Escape' || event.defaultPrevented) return;
    if (root.querySelector('.portal-group-sheet.visible, .portal-chat-emoji-picker:not([hidden])')) return;
    event.preventDefault();
    click(view() === 2 ? 'portalChatBack' : 'portalChatClose');
  }, true);
  const discoveryObserver = new MutationObserver(() => {
    if (document.getElementById('portalChatRoot') !== root
      || document.querySelector('.social-mobile-nav') !== navigation) schedule();
  });
  discoveryObserver.observe(body, { childList: true, subtree: true });
  new MutationObserver(schedule).observe(body, { attributes: true, attributeFilter: ['class'] });
  window.addEventListener('popstate', onPopState);
  window.addEventListener('resize', schedule, { passive: true });
  window.visualViewport?.addEventListener('resize', schedule, { passive: true });
  window.visualViewport?.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('pageshow', schedule);
  window.addEventListener('portal:session-cleared', () => {
    sessionEnded = true;
    cancelResume();
    savedConversation = pageContext = null;
    mobileConversationPosition = null;
    returnToPage = false;
    reopenAfterClose = false;
    selectedRoute = currentRoute = pendingGroupRoute = null;
    lastProfileHandle = '';
    routes.clear();
    knownHandles.clear();
    // Core session cleanup already owns draft/cache disposal. Do not trigger reads.
    root?.classList.remove('open');
    schedule();
  });
  const controller = Object.freeze({ refresh: schedule, closeToPage });
  window[INSTANCE] = controller;
  reconcile();
  return controller;
}
