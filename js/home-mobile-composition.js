'use strict';

// Presentation only: retain the authorized cards, native navigation controls and
// chat launcher so their listeners, badges and desktop positions stay intact.
let mountedComposition = null;

export function mountHomeMobileComposition(user, context) {
  const document = context?.document || globalThis.document;
  const MutationObserver = context?.MutationObserver || globalThis.MutationObserver;
  const window = context?.window || globalThis;
  let routeActive = true;
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

  function sync(force = false) {
    if (!routeActive && !force) return;
    queued = false;
    rememberRendererVisibility();
    mobile = routeActive && mobileScreen.matches && !printing && !printScreen.matches;
    syncTools();
  }

  function schedule() {
    if (!routeActive) return;
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
  document.addEventListener('change', event => {
    if (event.target.id === 'socialShortcutLimit') schedule();
  });
  mobileScreen.addEventListener('change', sync);
  printScreen.addEventListener('change', sync);
  window.addEventListener('beforeprint', () => { printing = true; sync(); });
  window.addEventListener('afterprint', () => { printing = false; sync(); });
  new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
  mountedComposition = Object.freeze({ sync, deactivate() { routeActive = false; sync(true); }, activate() { routeActive = true; sync(); }, dispose() { routeActive = false; sync(true); mountedComposition = null; } });
  sync();
  return mountedComposition;
}
