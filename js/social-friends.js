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
  if (!config.available) { social.status(config.gate?.message || 'Confirme seu e-mail para usar amizades.', 'error'); return; }

  let currentType = 'friends';
  let listCursor = '';
  let searchCursor = '';
  let currentQuery = '';

  async function mutate(action, profile, confirmation = null) {
    if (confirmation && !(await social.confirmAction(confirmation))) return;
    try {
      await social.api('/api/social/relationships', {
        method: 'POST', body: JSON.stringify({ action, targetHandle: profile.handle })
      });
      await loadList(false);
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
      button.addEventListener('click', () => mutate(action, profile, confirmation));
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

  async function loadList(append = false) {
    const button = document.getElementById('relationshipMore');
    if (!append) listCursor = '';
    button.disabled = true;
    try {
      const path = `/api/social/relationships?type=${currentType}${append && listCursor ? `&cursor=${encodeURIComponent(listCursor)}` : ''}`;
      const payload = await social.api(path);
      render(document.getElementById('relationshipList'), payload.profiles || [], append, 'list');
      listCursor = payload.nextCursor || '';
      button.hidden = !listCursor;
    } catch (error) {
      social.status(error.message || 'Não foi possível carregar amizades.', 'error');
    } finally { button.disabled = false; }
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
    loadList(false);
  }));
  document.getElementById('relationshipMore').addEventListener('click', () => loadList(true));
  document.getElementById('socialSearchMore').addEventListener('click', () => search(true));
  document.getElementById('socialSearchForm').addEventListener('submit', (event) => { event.preventDefault(); search(false); });
  await loadList(false);
})();
