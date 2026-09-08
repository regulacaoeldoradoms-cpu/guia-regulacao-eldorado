'use strict';

(async () => {
  const auth = window.RegulationAuth;
  const social = window.PortalSocial;
  const user = await auth.requireRole([]);
  if (!user) return;
  if (user.mustChangePassword) {
    location.replace('/conta/?primeiro-acesso=1');
    return;
  }
  document.getElementById('portalUserName').textContent = user.name || user.username || 'Usuário';
  document.getElementById('portalUserRole').textContent = window.PortalTools?.roleLabels?.[user.role] || user.role || '';
  document.getElementById('portalLogout')?.addEventListener('click', async () => { await auth.logout(); location.replace('/login/'); });

  let config;
  try { config = await social.getConfig(); }
  catch (error) { social.status(error.message || 'Camada Social indisponível.', 'error'); return; }
  window.PortalSocialNavigation?.mount(user, config);
  if (!config.available) {
    social.status(config.gate?.message || 'Confirme seu e-mail para abrir perfis sociais.', 'error');
    return;
  }

  const requested = String(new URLSearchParams(location.search).get('u') || '').replace(/^@/, '');
  let profile;

  async function relationship(action, options = {}) {
    if (options.confirm && !(await social.confirmAction(options.confirm))) return;
    try {
      await social.api('/api/social/relationships', {
        method: 'POST', body: JSON.stringify({ action, targetHandle: profile.handle })
      });
      await load();
      social.status(options.success || 'Relação social atualizada.', 'success');
    } catch (error) {
      social.status(error.message || 'Não foi possível atualizar a relação.', 'error');
    }
  }

  function action(label, handler, className = 'social-button secondary') {
    const button = social.button(label, className);
    button.addEventListener('click', handler);
    return button;
  }

  function renderActions() {
    const area = document.getElementById('profileActions');
    area.innerHTML = '';
    if (profile.isSelf) {
      const edit = action('Personalizar perfil', () => document.getElementById('profileEditor').scrollIntoView({
        behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start'
      }));
      area.appendChild(edit);
      return;
    }
    if (profile.relationship === 'received') {
      area.append(
        action('Aceitar pedido', () => relationship('accept', { success: 'Pedido aceito.' }), 'social-button primary'),
        action('Recusar', () => relationship('decline', { success: 'Pedido recusado.' }))
      );
    } else if (profile.relationship === 'sent') {
      area.appendChild(action('Cancelar pedido', () => relationship('cancel', { success: 'Pedido cancelado.' })));
    } else if (profile.relationship === 'friends') {
      const state = social.button('Amigos', 'social-button secondary');
      state.disabled = true;
      area.append(
        state,
        action('Desfazer amizade', () => relationship('remove', {
          success: 'Amizade desfeita. O chat profissional, quando autorizado pelo cargo, permanece disponível.',
          confirm: {
            title: 'Desfazer amizade?',
            message: 'Isso encerra somente o vínculo social. Não altera o chat profissional nem permissões de trabalho.',
            confirmLabel: 'Desfazer amizade', danger: true
          }
        }), 'social-button danger')
      );
    } else if (profile.relationship === 'blocked') {
      area.appendChild(action('Desbloquear', () => relationship('unblock', { success: 'Perfil desbloqueado.' }), 'social-button danger'));
    } else if (profile.relationship === 'removed') {
      const removed = social.button('Amizade removida', 'social-button secondary');
      removed.disabled = true;
      area.appendChild(removed);
      if (profile.acceptFriendRequests) {
        area.appendChild(action('Enviar novo pedido', () => relationship('request', { success: 'Novo pedido de amizade enviado.' }), 'social-button primary'));
      }
    } else if (profile.acceptFriendRequests) {
      area.appendChild(action('Adicionar amigo', () => relationship('request', { success: 'Pedido de amizade enviado.' }), 'social-button primary'));
    } else {
      const unavailable = social.button('Pedidos desativados', 'social-button secondary');
      unavailable.disabled = true;
      area.appendChild(unavailable);
    }
    if (profile.relationship !== 'blocked') {
      area.append(
        action('Bloquear', () => relationship('block', {
          success: 'Perfil bloqueado. O bloqueio vale apenas para interações sociais.',
          confirm: {
            title: 'Bloquear este perfil?',
            message: 'O perfil deixa de interagir e descobrir você na Camada Social. O chat profissional exigido pelo cargo não será removido.',
            confirmLabel: 'Bloquear perfil', danger: true
          }
        }), 'social-button danger'),
        action('Denunciar', async () => {
          try { if (await social.report('profile', profile.handle)) social.status('Denúncia enviada para análise.', 'success'); }
          catch (error) { social.status(error.message || 'Não foi possível enviar a denúncia.', 'error'); }
        })
      );
    }
  }

  function renderModules() {
    const container = document.getElementById('profileModules');
    const requestedOrder = Array.isArray(profile.moduleOrder) && profile.moduleOrder.length ? profile.moduleOrder : ['about', 'friends', 'posts'];
    container.querySelectorAll('[data-profile-module]').forEach((module) => { module.hidden = true; });
    requestedOrder.forEach((name) => {
      const module = container.querySelector(`[data-profile-module="${name}"]`);
      if (module) { module.hidden = false; container.appendChild(module); }
    });
    document.getElementById('profileStatusText').textContent = profile.status || 'Sem frase de status.';
    document.getElementById('profileBio').textContent = profile.bio || 'Este perfil ainda não adicionou uma bio.';
    document.getElementById('profileFriendCount').textContent = `${Number(profile.counts?.friends || 0)} amizade(s) social(is). A lista completa fica visível apenas para o titular.`;
    const interests = document.getElementById('profileInterests');
    interests.innerHTML = '';
    (profile.interests || []).forEach((interest) => {
      const chip = document.createElement('span');
      chip.className = 'social-chip';
      chip.textContent = interest;
      interests.appendChild(chip);
    });
  }

  function fillEditor() {
    const editor = document.getElementById('profileEditor');
    editor.hidden = !profile.isSelf;
    if (!profile.isSelf) return;
    document.getElementById('profileEditStatus').value = profile.status || '';
    document.getElementById('profileEditBio').value = profile.bio || '';
    document.getElementById('profileEditInterests').value = (profile.interests || []).join(', ');
    document.getElementById('profileEditTheme').value = profile.coverTheme;
    document.getElementById('profileEditPattern').value = profile.coverPattern;
    const orderEditor = document.getElementById('profileModuleOrderEditor');
    const labels = { about: 'Sobre', friends: 'Amigos', posts: 'Publicações' };
    const ordered = [...profile.moduleOrder, ...['about', 'friends', 'posts'].filter((name) => !profile.moduleOrder.includes(name))];
    orderEditor.innerHTML = '';
    ordered.forEach((name) => {
      const row = document.createElement('div');
      row.className = 'social-module-order-row';
      row.dataset.moduleName = name;
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = name;
      checkbox.checked = profile.moduleOrder.includes(name);
      label.append(checkbox, document.createTextNode(` ${labels[name]}`));
      const up = social.button('Subir', 'social-button secondary');
      const down = social.button('Descer', 'social-button secondary');
      up.addEventListener('click', () => { const previous = row.previousElementSibling; if (previous) orderEditor.insertBefore(row, previous); });
      down.addEventListener('click', () => { const next = row.nextElementSibling; if (next) orderEditor.insertBefore(next, row); });
      row.append(label, up, down);
      orderEditor.appendChild(row);
    });
  }

  function render() {
    const cover = document.getElementById('profileCover');
    cover.className = `social-profile-cover theme-${profile.coverTheme} pattern-${profile.coverPattern}`;
    document.getElementById('profileName').textContent = profile.name || `@${profile.handle}`;
    document.getElementById('profileHandle').textContent = `@${profile.handle}`;
    const professional = document.getElementById('profileProfessional');
    if (profile.professional) {
      professional.textContent = `${profile.professional.label}${profile.professional.jobTitle ? ` · ${profile.professional.jobTitle}` : ''}`;
      professional.hidden = false;
    } else professional.hidden = true;
    social.mountAvatar(document.getElementById('profileAvatar'), profile);
    renderActions();
    renderModules();
    fillEditor();
    document.getElementById('socialProfile').hidden = false;
    social.status('', 'info');
  }

  async function load() {
    const payload = await social.api(requested ? `/api/social/profiles/${encodeURIComponent(requested)}` : '/api/social/me');
    profile = payload.profile;
    if (requested && profile.canonicalHandle && profile.canonicalHandle !== requested) {
      history.replaceState(null, '', social.profileUrl(profile.canonicalHandle));
    }
    render();
    const posts = document.getElementById('profilePosts');
    const more = document.getElementById('profilePostsMore');
    await window.PortalSocialFeed.load(posts, more, { handle: profile.handle });
    more.onclick = () => window.PortalSocialFeed.load(posts, more, { handle: profile.handle, append: true })
      .catch((error) => social.status(error.message || 'Não foi possível carregar mais publicações.', 'error'));
  }

  document.getElementById('profileEditorForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submit = event.currentTarget.querySelector('[type="submit"]');
    submit.disabled = true;
    try {
      const modules = Array.from(event.currentTarget.querySelectorAll('.social-module-order-row'))
        .filter((row) => row.querySelector('input')?.checked)
        .map((row) => row.dataset.moduleName);
      const payload = await social.api('/api/social/me', {
        method: 'PATCH', body: JSON.stringify({
          status: document.getElementById('profileEditStatus').value,
          bio: document.getElementById('profileEditBio').value,
          interests: document.getElementById('profileEditInterests').value.split(',').map((item) => item.trim()).filter(Boolean),
          coverTheme: document.getElementById('profileEditTheme').value,
          coverPattern: document.getElementById('profileEditPattern').value,
          moduleOrder: modules
        })
      });
      profile = payload.profile;
      render();
      social.status('Personalização salva.', 'success');
    } catch (error) {
      social.status(error.message || 'Não foi possível salvar a personalização.', 'error');
    } finally {
      submit.disabled = false;
    }
  });

  try { await load(); }
  catch (error) { social.status(error.message || 'Perfil social não encontrado.', 'error'); }
})();
