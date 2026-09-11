'use strict';

(async () => {
  const auth = window.RegulationAuth;
  const social = window.PortalSocial;
  const user = await auth.requireRole([]);
  if (!user) return;
  if (user.mustChangePassword) { location.replace('/seguranca/?primeiro-acesso=1'); return; }
  document.getElementById('portalUserName').textContent = user.name || user.username || 'Usuário';
  document.getElementById('portalUserRole').textContent = window.PortalTools?.roleLabels?.[user.role] || user.role || '';
  document.getElementById('portalLogout')?.addEventListener('click', async () => { await auth.logout(); location.replace('/login/'); });

  let config;
  try { config = await social.getConfig(); }
  catch (error) { social.status(error.message || 'Camada Social indisponível.', 'error'); return; }
  window.PortalSocialNavigation?.mount(user, config);
  if (!config.available) { social.status(config.gate?.message || 'A Camada Social não está disponível para esta conta.', 'error'); return; }

  const relationshipList = document.getElementById('relationshipList');
  const relationshipPagination = document.getElementById('relationshipPagination');
  const relationshipPageSize = document.getElementById('relationshipPageSize');
  const relationshipPageSummary = document.getElementById('relationshipPageSummary');
  const relationshipPageButtons = document.getElementById('relationshipPageButtons');
  const PAGE_SIZE_OPTIONS = new Set(['10', '20', '30', 'all']);
  const pageSizePreferenceKey = `regulacao.portal.social.relationship-page-size.v1.${encodeURIComponent(String(user.username || 'usuario').toLowerCase())}`;
  const relationshipLists = new Map();
  const relationshipLoads = new Map();

  let currentType = 'friends';
  let currentPage = 1;
  let searchCursor = '';
  let currentQuery = '';

  function readPageSizePreference() {
    try {
      const value = localStorage.getItem(pageSizePreferenceKey) || '10';
      return PAGE_SIZE_OPTIONS.has(value) ? value : '10';
    } catch (_) {
      return '10';
    }
  }

  function savePageSizePreference(value) {
    try { localStorage.setItem(pageSizePreferenceKey, value); } catch (_) {}
  }

  relationshipPageSize.value = readPageSizePreference();

  function dedupeProfiles(profiles) {
    const output = [];
    const seen = new Set();
    for (const profile of Array.isArray(profiles) ? profiles : []) {
      const handle = String(profile?.handle || '').trim().toLowerCase();
      if (!handle || seen.has(handle)) continue;
      seen.add(handle);
      output.push(profile);
    }
    return output;
  }

  function buttonLabel(button, label) {
    const text = button?.querySelector?.('span:last-child');
    if (text) text.textContent = label;
    else if (button) button.textContent = label;
  }

  function optimisticFriendRequest(profile, button, originalLabel) {
    const previous = {
      relationship: profile.relationship,
      label: originalLabel || button.textContent,
      className: button.className,
      disabled: button.disabled
    };

    profile.relationship = 'sent';
    button.className = 'social-button secondary';
    button.disabled = true;
    buttonLabel(button, 'Pedido enviado');
    button.setAttribute('aria-label', `Pedido de amizade enviado para ${profile.name || `@${profile.handle}`}`);
    social.invalidateRelationshipList?.();
    window.PortalInteractions?.notify?.('success', 'Pedido de amizade enviado.', button);

    const optimisticOutgoing = dedupeProfiles([
      ...(relationshipLists.get('outgoing') || []),
      { ...profile, relationship: 'sent' }
    ]);
    relationshipLists.set('outgoing', optimisticOutgoing);
    if (currentType === 'outgoing') renderListPage();

    void social.api('/api/social/relationships', {
      method: 'POST',
      body: JSON.stringify({ action: 'request', targetHandle: profile.handle })
    }).then(() => {
      social.invalidateRelationshipList?.();
      relationshipLists.delete('outgoing');
      void fetchRelationshipType('outgoing', true).catch(() => {});
    }).catch((error) => {
      profile.relationship = previous.relationship;
      button.className = previous.className;
      button.disabled = previous.disabled;
      buttonLabel(button, previous.label);
      button.removeAttribute('aria-label');
      relationshipLists.delete('outgoing');
      const text = error?.message || 'Não foi possível enviar o pedido de amizade.';
      social.status(text, 'error');
      window.PortalInteractions?.notify?.('error', text, button);
    });
  }

  async function mutate(action, profile, confirmation = null) {
    if (confirmation && !(await social.confirmAction(confirmation))) return;
    try {
      await social.api('/api/social/relationships', {
        method: 'POST', body: JSON.stringify({ action, targetHandle: profile.handle })
      });
      social.invalidateRelationshipList?.();
      relationshipLists.clear();
      await loadList(true);
      preloadOtherRelationshipLists();
      if (currentQuery) await search(false);
      social.status('Relação social atualizada.', 'success');
    } catch (error) {
      social.status(error.message || 'Não foi possível atualizar a relação.', 'error');
    }
  }

  function rowActions(profile, source) {
    const actions = document.createElement('div');
    actions.className = 'social-row-actions';
    const add = (label, action, className = 'social-button secondary', confirmation = null) => {
      const button = social.button(label, className);
      if (action === 'request' && !confirmation) {
        button.addEventListener('click', () => optimisticFriendRequest(profile, button, label));
      } else {
        button.addEventListener('click', () => mutate(action, profile, confirmation));
      }
      actions.appendChild(button);
    };
    if (profile.relationship === 'received') {
      add('Aceitar', 'accept', 'social-button primary');
      add('Recusar', 'decline');
    } else if (profile.relationship === 'sent') {
      add('Cancelar pedido', 'cancel');
    } else if (profile.relationship === 'friends') {
      add('Desfazer amizade', 'remove', 'social-button danger', {
        title: 'Desfazer amizade?',
        message: 'Somente o vínculo social será encerrado. O chat profissional autorizado pelo cargo permanece disponível.',
        confirmLabel: 'Desfazer amizade', danger: true
      });
    } else if (profile.relationship === 'blocked') {
      add('Desbloquear', 'unblock', 'social-button danger');
    } else if (profile.relationship === 'removed') {
      const removed = social.button('Amizade removida', 'social-button secondary');
      removed.disabled = true;
      actions.appendChild(removed);
      if (profile.acceptFriendRequests) add('Enviar novo pedido', 'request', 'social-button primary');
    } else if (source === 'search' && profile.acceptFriendRequests) {
      add('Adicionar amigo', 'request', 'social-button primary');
    }
    if (profile.relationship !== 'blocked') {
      add('Bloquear', 'block', 'social-button danger', {
        title: 'Bloquear este perfil?',
        message: 'O bloqueio interrompe descoberta e interações sociais, mas não remove comunicação profissional exigida pelo cargo.',
        confirmLabel: 'Bloquear perfil', danger: true
      });
    }
    return actions;
  }

  function personRow(profile, source) {
    const row = document.createElement('article');
    row.className = 'social-person-row';
    const avatar = document.createElement('div');
    avatar.className = 'social-avatar';
    social.mountAvatar(avatar, profile);
    const copy = document.createElement('div');
    copy.className = 'social-person-copy';
    const link = document.createElement('a');
    link.href = social.profileUrl(profile.handle);
    link.textContent = profile.name || `@${profile.handle}`;
    const meta = document.createElement('p');
    const profession = profile.professional?.label ? `${profile.professional.label} · ` : '';
    meta.textContent = `${profession}@${profile.handle}${profile.status ? ` · ${profile.status}` : ''}`;
    copy.append(link, meta);
    row.append(avatar, copy, rowActions(profile, source));
    return row;
  }

  function render(container, profiles, append, source) {
    if (!append) container.innerHTML = '';
    if (!profiles.length && !append) {
      const empty = document.createElement('div');
      empty.className = 'social-empty';
      empty.innerHTML = social.icons.friends;
      const title = document.createElement('h2');
      title.textContent = source === 'search' ? 'Nenhum perfil elegível encontrado' : 'Nenhum item neste estado';
      const text = document.createElement('p');
      text.textContent = source === 'search' ? 'Tente um nome ou @ diferente.' : 'Pedidos, amizades e bloqueios aparecerão aqui quando existirem.';
      empty.append(title, text);
      container.appendChild(empty);
      return;
    }
    profiles.forEach((profile) => container.appendChild(personRow(profile, source)));
  }

  function currentProfiles() {
    return relationshipLists.get(currentType) || [];
  }

  function selectedPageSize() {
    const value = PAGE_SIZE_OPTIONS.has(relationshipPageSize.value) ? relationshipPageSize.value : '10';
    if (value === 'all') return Math.max(1, currentProfiles().length);
    return Number(value);
  }

  function totalPages() {
    const profiles = currentProfiles();
    if (!profiles.length || relationshipPageSize.value === 'all') return 1;
    return Math.max(1, Math.ceil(profiles.length / selectedPageSize()));
  }

  function pageTokens(total, current) {
    if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
    const tokens = [1];
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    if (start > 2) tokens.push('start-ellipsis');
    for (let page = start; page <= end; page += 1) tokens.push(page);
    if (end < total - 1) tokens.push('end-ellipsis');
    tokens.push(total);
    return tokens;
  }

  function goToPage(page, scroll = true) {
    const pages = totalPages();
    currentPage = Math.min(Math.max(1, Number(page || 1)), pages);
    renderListPage();
    if (!scroll) return;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    document.querySelector('.social-tabs')?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start'
    });
  }

  function paginationButton(label, page, options = {}) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'social-page-button';
    button.textContent = label;
    button.disabled = Boolean(options.disabled);
    if (options.current) button.setAttribute('aria-current', 'page');
    if (options.label) button.setAttribute('aria-label', options.label);
    button.addEventListener('click', () => goToPage(page));
    return button;
  }

  function renderPagination() {
    const profiles = currentProfiles();
    if (!profiles.length) {
      relationshipPagination.hidden = true;
      relationshipPageSummary.textContent = '';
      relationshipPageButtons.textContent = '';
      return;
    }

    relationshipPagination.hidden = false;
    const size = selectedPageSize();
    const pages = totalPages();
    currentPage = Math.min(currentPage, pages);
    const start = relationshipPageSize.value === 'all' ? 0 : (currentPage - 1) * size;
    const end = relationshipPageSize.value === 'all' ? profiles.length : Math.min(profiles.length, start + size);
    relationshipPageSummary.textContent = `${start + 1}–${end} de ${profiles.length}`;

    relationshipPageButtons.textContent = '';
    if (pages <= 1 || relationshipPageSize.value === 'all') return;

    relationshipPageButtons.appendChild(paginationButton('‹', currentPage - 1, {
      disabled: currentPage === 1,
      label: 'Página anterior'
    }));

    pageTokens(pages, currentPage).forEach((token) => {
      if (typeof token !== 'number') {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'social-pagination-ellipsis';
        ellipsis.textContent = '…';
        ellipsis.setAttribute('aria-hidden', 'true');
        relationshipPageButtons.appendChild(ellipsis);
        return;
      }
      relationshipPageButtons.appendChild(paginationButton(String(token), token, {
        current: token === currentPage,
        label: `Abrir página ${token}`
      }));
    });

    relationshipPageButtons.appendChild(paginationButton('›', currentPage + 1, {
      disabled: currentPage === pages,
      label: 'Próxima página'
    }));
  }

  function renderListPage() {
    const profiles = currentProfiles();
    const size = selectedPageSize();
    const pages = totalPages();
    currentPage = Math.min(currentPage, pages);
    const visible = relationshipPageSize.value === 'all'
      ? profiles
      : profiles.slice((currentPage - 1) * size, currentPage * size);
    render(relationshipList, visible, false, 'list');
    renderPagination();
  }

  function setRelationshipProfiles(type, profiles) {
    relationshipLists.set(type, dedupeProfiles(profiles));
    if (currentType === type) renderListPage();
  }

  async function fetchRelationshipType(type, force = false) {
    if (!force && relationshipLists.has(type)) return relationshipLists.get(type);
    if (relationshipLoads.has(type)) return relationshipLoads.get(type);

    const cached = !force && type === 'friends' ? social.getCachedRelationshipList?.(type) : null;
    if (cached) setRelationshipProfiles(type, cached.profiles);
    else if (currentType === type) {
      relationshipList.innerHTML = '<div class="social-skeleton"></div>';
      relationshipPagination.hidden = true;
    }

    const request = social.refreshRelationshipList(type, { store: type === 'friends' })
      .then((profiles) => {
        setRelationshipProfiles(type, profiles);
        return relationshipLists.get(type) || [];
      })
      .catch((error) => {
        if (!cached && currentType === type) {
          render(relationshipList, [], false, 'list');
          renderPagination();
          social.status(error.message || 'Não foi possível carregar amizades.', 'error');
        }
        return cached?.profiles || [];
      })
      .finally(() => relationshipLoads.delete(type));

    relationshipLoads.set(type, request);
    return cached ? cached.profiles : request;
  }

  async function loadList(force = false) {
    const type = currentType;
    if (force) {
      relationshipLists.delete(type);
      currentPage = 1;
    }
    await fetchRelationshipType(type, force);
  }

  function preloadOtherRelationshipLists() {
    ['incoming', 'outgoing', 'blocked'].forEach((type) => {
      if (relationshipLists.has(type) || relationshipLoads.has(type)) return;
      fetchRelationshipType(type, false).catch(() => {});
    });
  }

  async function search(append = false) {
    const input = document.getElementById('socialSearchInput');
    const button = document.getElementById('socialSearchMore');
    if (!append) { searchCursor = ''; currentQuery = input.value.trim(); }
    if (currentQuery.length < 3) { social.status('Digite ao menos 3 caracteres para pesquisar.', 'error'); return; }
    button.disabled = true;
    try {
      const path = `/api/social/search?q=${encodeURIComponent(currentQuery)}${append && searchCursor ? `&cursor=${encodeURIComponent(searchCursor)}` : ''}`;
      const payload = await social.api(path);
      render(document.getElementById('socialSearchResults'), payload.profiles || [], append, 'search');
      searchCursor = payload.nextCursor || '';
      button.hidden = !searchCursor;
    } catch (error) {
      social.status(error.message || 'Não foi possível pesquisar.', 'error');
    } finally { button.disabled = false; }
  }

  document.querySelectorAll('[data-relationship-tab]').forEach((tab) => tab.addEventListener('click', () => {
    document.querySelectorAll('[data-relationship-tab]').forEach((item) => {
      item.classList.toggle('active', item === tab);
      item.setAttribute('aria-selected', item === tab ? 'true' : 'false');
    });
    currentType = tab.dataset.relationshipTab;
    currentPage = 1;
    loadList(false);
  }));

  relationshipPageSize.addEventListener('change', () => {
    const value = PAGE_SIZE_OPTIONS.has(relationshipPageSize.value) ? relationshipPageSize.value : '10';
    relationshipPageSize.value = value;
    savePageSizePreference(value);
    currentPage = 1;
    renderListPage();
  });

  document.getElementById('socialSearchMore').addEventListener('click', () => search(true));
  document.getElementById('socialSearchForm').addEventListener('submit', (event) => { event.preventDefault(); search(false); });

  await loadList(false);
  preloadOtherRelationshipLists();
})();
