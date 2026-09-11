'use strict';

(async () => {
  const auth = window.RegulationAuth;
  const social = window.PortalSocial;
  const user = await auth.requireRole([]);
  if (!user) return;
  if (user.mustChangePassword) {
    location.replace('/seguranca/?primeiro-acesso=1');
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
    social.status(config.gate?.message || 'O perfil social está temporariamente indisponível.', 'error');
    return;
  }

  const requested = String(new URLSearchParams(location.search).get('u') || '').replace(/^@/, '');
  let profile;
  let identityLoaded = false;

  const photoCamera = document.getElementById('profilePhotoCamera');
  const photoDialog = document.getElementById('profilePhotoDialog');
  const photoPreview = document.getElementById('profilePhotoPreview');
  const photoHelp = document.getElementById('profilePhotoHelp');
  const photoInput = document.getElementById('profilePhotoInput');
  const choosePhoto = document.getElementById('chooseProfilePhoto');
  const removePhoto = document.getElementById('removeProfilePhoto');
  const photoStatus = document.getElementById('profilePhotoStatus');

  const identityEditor = document.getElementById('profileIdentityEditor');
  const identityForm = document.getElementById('profileIdentityForm');
  const identityName = document.getElementById('profileIdentityName');
  const identityHandle = document.getElementById('profileIdentityHandle');
  const identityHandleHelp = document.getElementById('profileIdentityHandleHelp');
  const identityStatus = document.getElementById('profileIdentityStatus');
  const saveIdentity = document.getElementById('saveProfileIdentity');

  function accountPhotoUnlocked() {
    const current = auth.getCachedUser?.() || user;
    const level = String(current?.accountLevel || '').toLowerCase();
    return current?.emailVerified === true || level === 'prata' || level === 'ouro';
  }

  function accountStatus(element, message, type = 'success') {
    if (!element) return;
    element.textContent = message || '';
    element.className = `account-status${message ? ' visible' : ''} ${type}`;
  }

  function initialsFor(value) {
    const parts = String(value || '?').trim().split(/\s+/).filter(Boolean);
    return ((parts[0]?.[0] || '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase() || '?';
  }

  function readImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Não foi possível ler a imagem selecionada.'));
      reader.readAsDataURL(file);
    });
  }

  function loadImage(source) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Não foi possível abrir a imagem selecionada.'));
      image.src = source;
    });
  }

  async function prepareAvatar(file) {
    if (!file) throw new Error('Escolha uma imagem.');
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Use uma foto JPG, PNG ou WebP.');
    if (file.size > 10 * 1024 * 1024) throw new Error('A imagem original pode ter no máximo 10 MB.');
    const source = await readImage(file);
    const image = await loadImage(source);
    const size = Math.min(image.naturalWidth, image.naturalHeight);
    const sx = Math.max(0, Math.floor((image.naturalWidth - size) / 2));
    const sy = Math.max(0, Math.floor((image.naturalHeight - size) / 2));
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 320;
    const context = canvas.getContext('2d');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, 320, 320);
    context.drawImage(image, sx, sy, size, size, 0, 0, 320, 320);
    const avatar = canvas.toDataURL('image/jpeg', 0.82);
    if (avatar.length > 220000) throw new Error('A foto ficou muito grande. Escolha outra imagem.');
    return avatar;
  }

  function renderPhotoEditor() {
    const self = Boolean(profile?.isSelf);
    if (photoCamera) {
      photoCamera.hidden = !self;
      photoCamera.disabled = !self;
    }
    if (!self) {
      if (photoDialog?.open) photoDialog.close();
      return;
    }
    if (!photoDialog) return;
    const unlocked = accountPhotoUnlocked();
    if (photoPreview) {
      photoPreview.textContent = initialsFor(profile.name || profile.handle);
      photoPreview.style.backgroundImage = 'none';
      social.mountAvatar(photoPreview, profile);
    }
    if (photoHelp) {
      photoHelp.textContent = unlocked
        ? 'Escolha uma foto JPG, PNG ou WebP. A imagem será recortada em formato quadrado para uso no Portal.'
        : 'A foto de perfil é liberada no nível Prata. Confirme seu e-mail na área Segurança para desbloquear.';
    }
    if (choosePhoto) choosePhoto.textContent = unlocked ? 'Escolher foto' : 'Abrir Segurança';
    if (removePhoto) removePhoto.hidden = !unlocked || !profile.avatarAvailable;
  }

  photoCamera?.addEventListener('click', () => {
    if (!profile?.isSelf) return;
    renderPhotoEditor();
    accountStatus(photoStatus, '', 'success');
    photoDialog?.showModal();
  });

  choosePhoto?.addEventListener('click', () => {
    if (!profile?.isSelf) return;
    if (!accountPhotoUnlocked()) {
      location.href = '/seguranca/';
      return;
    }
    photoInput?.click();
  });

  photoInput?.addEventListener('change', async () => {
    if (!profile?.isSelf) {
      photoInput.value = '';
      return;
    }
    const file = photoInput.files?.[0];
    if (!file) return;
    choosePhoto.disabled = true;
    if (removePhoto) removePhoto.disabled = true;
    accountStatus(photoStatus, 'Preparando a foto...', 'success');
    try {
      const avatarDataUrl = await prepareAvatar(file);
      await auth.updateProfilePhoto(avatarDataUrl);
      await social.invalidateAvatarCache?.(profile.handle);
      social.invalidateConfigCache?.();
      photoDialog?.close();
      await load();
      social.status('Foto de perfil atualizada.', 'success');
    } catch (error) {
      accountStatus(photoStatus, error.message || 'Não foi possível atualizar a foto.', 'error');
    } finally {
      photoInput.value = '';
      choosePhoto.disabled = false;
      if (removePhoto) removePhoto.disabled = false;
    }
  });

  removePhoto?.addEventListener('click', async () => {
    if (!profile?.isSelf || !accountPhotoUnlocked()) return;
    choosePhoto.disabled = true;
    removePhoto.disabled = true;
    try {
      await auth.updateProfilePhoto('');
      await social.invalidateAvatarCache?.(profile.handle);
      social.invalidateConfigCache?.();
      photoDialog?.close();
      await load();
      social.status('Foto de perfil removida.', 'success');
    } catch (error) {
      accountStatus(photoStatus, error.message || 'Não foi possível remover a foto.', 'error');
    } finally {
      choosePhoto.disabled = false;
      removePhoto.disabled = false;
    }
  });

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
    const currentOrder = Array.isArray(profile.moduleOrder) ? profile.moduleOrder : [];
    const ordered = [...currentOrder, ...['about', 'friends', 'posts'].filter((name) => !currentOrder.includes(name))];
    orderEditor.innerHTML = '';
    ordered.forEach((name) => {
      const row = document.createElement('div');
      row.className = 'social-module-order-row';
      row.dataset.moduleName = name;
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = name;
      checkbox.checked = currentOrder.includes(name);
      label.append(checkbox, document.createTextNode(` ${labels[name]}`));
      const up = social.button('Subir', 'social-button secondary');
      const down = social.button('Descer', 'social-button secondary');
      up.addEventListener('click', () => { const previous = row.previousElementSibling; if (previous) orderEditor.insertBefore(row, previous); });
      down.addEventListener('click', () => { const next = row.nextElementSibling; if (next) orderEditor.insertBefore(next, row); });
      row.append(label, up, down);
      orderEditor.appendChild(row);
    });
  }

  function formatIdentityDate(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
  }

  function renderIdentity(identity) {
    if (!identityEditor) return;
    identityEditor.hidden = !(profile.isSelf && user.role === 'cidadao');
    if (identityEditor.hidden) return;
    identityName.value = identity.displayName || '';
    identityHandle.value = identity.handle || '';
    const canChange = identity.canChangeHandle !== false;
    identityHandle.disabled = !canChange;
    identityHandleHelp.innerHTML = canChange
      ? 'Seu <strong>@nome.de.usuario</strong> é único. Depois de trocar, você poderá alterá-lo novamente após 30 dias.'
      : `Seu @ poderá ser alterado novamente em <strong>${formatIdentityDate(identity.nextHandleChangeAt)}</strong>.`;
  }

  async function loadIdentity(force = false) {
    if (!profile?.isSelf || user.role !== 'cidadao' || (identityLoaded && !force)) return;
    try {
      const payload = await auth.api('/api/citizen/identity', { method: 'GET' });
      renderIdentity(payload.identity || {});
      identityLoaded = true;
    } catch (error) {
      accountStatus(identityStatus, error.message || 'Não foi possível carregar o nome e @ do perfil.', 'error');
    }
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
    renderPhotoEditor();
    renderActions();
    renderModules();
    fillEditor();
    if (identityEditor) identityEditor.hidden = !(profile.isSelf && user.role === 'cidadao');
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
    await loadIdentity();
    const posts = document.getElementById('profilePosts');
    const more = document.getElementById('profilePostsMore');
    await window.PortalSocialFeed.load(posts, more, { handle: profile.handle });
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

  identityForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    saveIdentity.disabled = true;
    try {
      const body = { displayName: identityName.value.trim() };
      if (!identityHandle.disabled) body.handle = String(identityHandle.value || '').replace(/^@+/, '').trim().toLowerCase();
      const payload = await auth.api('/api/citizen/identity', { method: 'PATCH', body: JSON.stringify(body) });
      renderIdentity(payload.identity || {});
      identityLoaded = true;
      accountStatus(identityStatus, 'Nome e @ atualizados.', 'success');
      await load();
    } catch (error) {
      accountStatus(identityStatus, error.message || 'Não foi possível atualizar o nome e @.', 'error');
    } finally {
      saveIdentity.disabled = false;
    }
  });

  try { await load(); }
  catch (error) { social.status(error.message || 'Perfil social não encontrado.', 'error'); }
})();
