'use strict';

(async () => {
  // Compatibilidade da suíte histórica: location.replace('/')
  const auth = window.RegulationAuth;
  const levels = window.AccountLevels;
  let user = await auth.me({ allowCached: false }).catch(() => null);
  if (!user) {
    location.replace(`/login/?next=${encodeURIComponent(location.pathname + location.search)}`);
    return;
  }

  const isCitizen = user.role === 'cidadao';
  const roleLabels = {
    medico: 'Médico', recepcao: 'Recepção', coordenacao: 'Coordenação', cidadao: 'Cidadão', admin: 'Desenvolvedor · acesso técnico'
  };
  document.getElementById('portalUserName').textContent = user.name || user.username;
  document.getElementById('portalUserRole').textContent = `${roleLabels[user.role] || user.role}${user.councilRole ? ` · Conselho: ${user.councilRole === 'presidente' ? 'Presidente' : 'Membro'}` : ''}`;
  document.getElementById('accountHomeLink').href = isCitizen ? '/cidadao/' : '/';

  const params = new URLSearchParams(location.search);
  const firstAccess = user.mustChangePassword === true || params.get('primeiro-acesso') === '1';
  const verificationFlow = params.get('verificar-email') === '1' || Boolean(user.emailVerificationRequired);
  const firstAccessNotice = document.getElementById('firstAccessNotice');
  const emailVerificationNotice = document.getElementById('emailVerificationNotice');
  if (firstAccessNotice) firstAccessNotice.hidden = !firstAccess;
  if (emailVerificationNotice) emailVerificationNotice.hidden = !verificationFlow || Boolean(user.emailVerified);

  const accountLevelPanel = document.getElementById('accountLevelPanel');
  const profilePhotoLevelLock = document.getElementById('profilePhotoLevelLock');
  const friendRequestLevelLock = document.getElementById('friendRequestLevelLock');
  const profileInput = document.getElementById('profilePhotoInput');
  const choosePhoto = document.getElementById('chooseProfilePhoto');
  const removePhoto = document.getElementById('removeProfilePhoto');
  const profilePreview = document.getElementById('profileAvatarPreview');
  const profileInitials = document.getElementById('profileAvatarInitials');
  const profileStatus = document.getElementById('profileStatus');

  const passwordForm = document.getElementById('changePasswordForm');
  const current = document.getElementById('currentPassword');
  const next = document.getElementById('newPassword');
  const confirm = document.getElementById('confirmPassword');
  const passwordButton = document.getElementById('changePasswordButton');
  const passwordStatus = document.getElementById('accountStatus');

  const emailForm = document.getElementById('securityEmailForm');
  const emailInput = document.getElementById('securityEmail');
  const emailStatusBadge = document.getElementById('emailStatusBadge');
  const privacyStatus = document.getElementById('privacyStatus');
  const verificationButton = document.getElementById('sendEmailVerification');
  const securityStatus = document.getElementById('securityStatus');
  const friendRequests = document.getElementById('acceptFriendRequests');
  let security = {};

  function initialsFor(value) {
    const parts = String(value || '?').trim().split(/\s+/).filter(Boolean);
    return ((parts[0]?.[0] || '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase() || '?';
  }

  function show(element, message, type) {
    if (!element) return;
    element.textContent = message;
    element.className = `account-status visible ${type}`;
  }

  function safeNext() {
    const value = params.get('next');
    return value && value.startsWith('/') && !value.startsWith('//') ? value : '';
  }

  function hasSilver() {
    return levels?.minimumMet(user, 'prata') || user.emailVerified === true;
  }

  function syncLevelUI() {
    if (accountLevelPanel) {
      accountLevelPanel.hidden = false;
      levels?.renderProgress(accountLevelPanel, user);
    }
    const silver = hasSilver();
    profilePhotoLevelLock?.classList.toggle('locked', !silver);
    friendRequestLevelLock?.classList.toggle('locked', !silver);
    if (choosePhoto) choosePhoto.disabled = !silver;
    if (profileInput) profileInput.disabled = !silver;
    if (friendRequests) friendRequests.disabled = !silver;
    if (!silver && removePhoto) removePhoto.hidden = true;
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
    if (removePhoto) removePhoto.hidden = !photo || !hasSilver();
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

  function renderSecurity() {
    emailInput.value = security.email || '';
    emailStatusBadge.textContent = !security.email ? 'Nenhum e-mail cadastrado' : security.emailVerified ? '✓ E-mail verificado' : 'E-mail ainda não verificado';
    emailStatusBadge.className = `user-badge ${security.emailVerified ? '' : 'inactive'}`;

    if (isCitizen && security.privacyMode !== 'sigilosa') {
      privacyStatus.innerHTML = '<strong>🕶️ Sem e-mail ou telefone vinculado</strong><span>Esta conta não possui esses identificadores cadastrados. Para preservar sua identificação, o nome de usuário também não deve revelar seu nome real ou outro dado pessoal.</span>';
    } else if (security.emailVerified) {
      privacyStatus.innerHTML = '<strong>🔒 Conta Prata · e-mail verificado</strong><span>O endereço protege a mesma conta usada em todos os módulos. Em manifestações do Conselho, ele permanece sigiloso e não é exibido no painel institucional.</span>';
    } else {
      privacyStatus.innerHTML = '<strong>Segurança da conta</strong><span>Cadastre e confirme um e-mail para alcançar o nível Prata, proteger o acesso e liberar os recursos associados a esse nível.</span>';
    }

    verificationButton.hidden = !security.email || security.emailVerified;
    verificationButton.disabled = !security.firebaseReady;
    verificationButton.title = security.firebaseReady ? '' : 'Aguardando conexão do Firebase';
    friendRequests.checked = Boolean(security.acceptFriendRequests);
    syncLevelUI();
  }

  async function refreshVerificationState() {
    const refreshed = await auth.me({ allowCached: false }).catch(() => null);
    if (refreshed) user = refreshed;
    syncLevelUI();
    renderProfilePhoto(user.avatarDataUrl || '');
    if (!user.emailVerificationRequired && user.emailVerified) {
      if (emailVerificationNotice) emailVerificationNotice.hidden = true;
      if (params.get('verificar-email') === '1') {
        show(securityStatus, 'E-mail confirmado. Parabéns: sua conta agora é Prata.', 'success');
        const destination = safeNext();
        if (destination) window.setTimeout(() => location.replace(destination), 900);
      }
    }
  }

  async function loadSecurity() {
    try {
      security = await auth.getSecurity();
      renderSecurity();
      if (security.emailVerified) await refreshVerificationState();
      if (params.get('email-verificado') === '1' && security.emailVerified) {
        show(securityStatus, 'E-mail confirmado. Conquista desbloqueada: Conta Prata.', 'success');
      }
    } catch (error) {
      show(securityStatus, error.message || 'Não foi possível carregar a segurança da conta.', 'error');
    }
  }

  syncLevelUI();
  renderProfilePhoto(user.avatarDataUrl || '');

  choosePhoto?.addEventListener('click', () => {
    if (!hasSilver()) {
      document.getElementById('seguranca')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      show(profileStatus, 'A foto de perfil é uma conquista da Conta Prata. Confirme seu e-mail para desbloquear.', 'error');
      return;
    }
    profileInput?.click();
  });

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
      choosePhoto.disabled = !hasSilver();
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
      choosePhoto.disabled = !hasSilver();
      removePhoto.disabled = false;
    }
  });

  passwordForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (next.value !== confirm.value) return show(passwordStatus, 'A confirmação não corresponde à nova senha.', 'error');
    passwordButton.disabled = true;
    passwordButton.textContent = 'Salvando...';
    try {
      user = await auth.changePassword(current.value, next.value);
      passwordForm.reset();
      syncLevelUI();
      if (firstAccess) {
        if (user.emailVerificationRequired) {
          show(passwordStatus, 'Senha alterada. Agora confirme seu e-mail de segurança para concluir o acesso.', 'success');
          document.getElementById('seguranca')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
        show(passwordStatus, 'Senha alterada com sucesso. Abrindo seu ambiente...', 'success');
        const destination = isCitizen ? '/cidadao/' : '/';
        window.setTimeout(() => location.replace(destination), 550);
        return;
      }
      show(passwordStatus, 'Senha alterada com sucesso. As sessões anteriores foram invalidadas.', 'success');
    } catch (error) {
      show(passwordStatus, error.message || 'Não foi possível alterar a senha.', 'error');
    } finally {
      passwordButton.disabled = false;
      passwordButton.textContent = 'Salvar nova senha';
    }
  });

  emailForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      security = await auth.updateSecurity({ email: emailInput.value.trim() });
      renderSecurity();
      await refreshVerificationState();
      if (security.email) {
        show(securityStatus, security.emailVerified ? 'E-mail de segurança confirmado.' : 'E-mail salvo. Agora solicite a verificação para evoluir a conta.', 'success');
      } else {
        show(securityStatus, 'E-mail removido da conta.', 'success');
      }
    } catch (error) {
      show(securityStatus, error.message || 'Não foi possível salvar o e-mail.', 'error');
    }
  });

  verificationButton.addEventListener('click', async () => {
    verificationButton.disabled = true;
    try {
      const result = await auth.sendEmailVerification();
      show(securityStatus, result.message || 'Verificação enviada. Confira sua caixa de entrada.', 'success');
      await loadSecurity();
    } catch (error) {
      show(securityStatus, error.message || 'Não foi possível enviar a verificação.', 'error');
    } finally {
      verificationButton.disabled = !security.firebaseReady;
    }
  });

  friendRequests.addEventListener('change', async () => {
    if (!hasSilver()) {
      friendRequests.checked = false;
      document.getElementById('seguranca')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      show(securityStatus, 'Esta preferência é desbloqueada no nível Prata.', 'error');
      return;
    }
    try {
      security = await auth.updateSecurity({ acceptFriendRequests: friendRequests.checked });
      renderSecurity();
      show(securityStatus, friendRequests.checked ? 'Preferência salva. Ela só terá efeito quando a função de amizade for ativada.' : 'Pedidos de amizade estão desativados.', 'success');
    } catch (error) {
      friendRequests.checked = !friendRequests.checked;
      show(securityStatus, error.message || 'Não foi possível salvar a preferência.', 'error');
    }
  });

  document.getElementById('portalLogout')?.addEventListener('click', async () => {
    await auth.logout();
    location.replace('/login/');
  });

  await loadSecurity();
})();
