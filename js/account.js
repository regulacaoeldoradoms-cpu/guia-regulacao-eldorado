'use strict';

(async () => {
  const auth = window.RegulationAuth;
  let user = await auth.requireRole(['medico', 'recepcao', 'admin']);
  if (!user) return;

  const roleLabels = { medico: 'Médico', recepcao: 'Recepção', admin: 'Desenvolvedor · acesso total' };
  document.getElementById('portalUserName').textContent = user.name || user.username;
  document.getElementById('portalUserRole').textContent = roleLabels[user.role] || user.role;

  const params = new URLSearchParams(location.search);
  const firstAccess = user.mustChangePassword === true || params.get('primeiro-acesso') === '1';
  const firstAccessNotice = document.getElementById('firstAccessNotice');
  if (firstAccessNotice) firstAccessNotice.hidden = !firstAccess;

  const profileInput = document.getElementById('profilePhotoInput');
  const choosePhoto = document.getElementById('chooseProfilePhoto');
  const removePhoto = document.getElementById('removeProfilePhoto');
  const profilePreview = document.getElementById('profileAvatarPreview');
  const profileInitials = document.getElementById('profileAvatarInitials');
  const profileStatus = document.getElementById('profileStatus');

  const form = document.getElementById('changePasswordForm');
  const current = document.getElementById('currentPassword');
  const next = document.getElementById('newPassword');
  const confirm = document.getElementById('confirmPassword');
  const button = document.getElementById('changePasswordButton');
  const status = document.getElementById('accountStatus');

  function initialsFor(value) {
    const parts = String(value || '?').trim().split(/\s+/).filter(Boolean);
    return ((parts[0]?.[0] || '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase() || '?';
  }

  function show(element, message, type) {
    if (!element) return;
    element.textContent = message;
    element.className = `account-status visible ${type}`;
  }

  function renderProfilePhoto(dataUrl) {
    const photo = String(dataUrl || '');
    if (profilePreview) {
      profilePreview.style.backgroundImage = photo ? `url("${photo}")` : 'none';
      profilePreview.classList.toggle('has-photo', Boolean(photo));
    }
    if (profileInitials) {
      profileInitials.textContent = initialsFor(user.name || user.username);
      profileInitials.hidden = Boolean(photo);
    }
    if (removePhoto) removePhoto.hidden = !photo;
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
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      throw new Error('Use uma foto JPG, PNG ou WebP.');
    }
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

  renderProfilePhoto(user.avatarDataUrl || '');

  choosePhoto?.addEventListener('click', () => profileInput?.click());

  profileInput?.addEventListener('change', async () => {
    const file = profileInput.files?.[0];
    if (!file) return;
    choosePhoto.disabled = true;
    if (removePhoto) removePhoto.disabled = true;
    show(profileStatus, 'Preparando a foto...', 'success');
    try {
      const avatarDataUrl = await prepareAvatar(file);
      user = await auth.updateProfilePhoto(avatarDataUrl);
      renderProfilePhoto(user.avatarDataUrl);
      show(profileStatus, 'Foto de perfil atualizada.', 'success');
    } catch (error) {
      show(profileStatus, error.message || 'Não foi possível atualizar a foto.', 'error');
    } finally {
      profileInput.value = '';
      choosePhoto.disabled = false;
      if (removePhoto) removePhoto.disabled = false;
    }
  });

  removePhoto?.addEventListener('click', async () => {
    choosePhoto.disabled = true;
    removePhoto.disabled = true;
    try {
      user = await auth.updateProfilePhoto('');
      renderProfilePhoto('');
      show(profileStatus, 'Foto de perfil removida.', 'success');
    } catch (error) {
      show(profileStatus, error.message || 'Não foi possível remover a foto.', 'error');
    } finally {
      choosePhoto.disabled = false;
      removePhoto.disabled = false;
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (next.value !== confirm.value) {
      show(status, 'A confirmação não corresponde à nova senha.', 'error');
      return;
    }
    if (!next.value.length) {
      show(status, 'Informe a nova senha.', 'error');
      return;
    }
    button.disabled = true;
    button.textContent = 'Salvando...';
    try {
      user = await auth.changePassword(current.value, next.value);
      form.reset();
      if (firstAccess) {
        show(status, 'Senha alterada com sucesso. Abrindo o HUB...', 'success');
        window.setTimeout(() => location.replace('/home/'), 550);
        return;
      }
      show(status, 'Senha alterada com sucesso. As sessões anteriores desta conta foram invalidadas.', 'success');
    } catch (error) {
      show(status, error.message || 'Não foi possível alterar a senha.', 'error');
    } finally {
      button.disabled = false;
      button.textContent = 'Salvar nova senha';
    }
  });

  document.getElementById('portalLogout')?.addEventListener('click', async () => {
    await auth.logout();
    location.replace('/login/');
  });
})();