'use strict';

// A página /conta/ é compartilhada por todos os perfis. A identidade da conta é única:
// o perfil profissional apenas acrescenta função e permissões, sem criar uma segunda persona cidadã.
import('/js/account-brand.js?v=20260817-1').catch(() => {});

(async () => {
  const auth = window.RegulationAuth;
  const levels = window.AccountLevels;
  if (!auth) return;

  async function syncUnifiedAccountExperience(sourceUser = null) {
    const user = sourceUser || await auth.me({ allowCached: false }).catch(() => auth.getCachedUser());
    if (!user) return;

    const panel = document.getElementById('accountLevelPanel');
    const profileLock = document.getElementById('profilePhotoLevelLock');
    const friendLock = document.getElementById('friendRequestLevelLock');
    const choosePhoto = document.getElementById('chooseProfilePhoto');
    const profileInput = document.getElementById('profilePhotoInput');
    const friendRequests = document.getElementById('acceptFriendRequests');
    const silver = levels?.minimumMet(user, 'prata') || user.emailVerified === true;

    if (panel) {
      panel.hidden = false;
      levels?.renderProgress(panel, user);
    }
    profileLock?.classList.toggle('locked', !silver);
    friendLock?.classList.toggle('locked', !silver);
    if (choosePhoto) choosePhoto.disabled = !silver;
    if (profileInput) profileInput.disabled = !silver;
    if (friendRequests) friendRequests.disabled = !silver;

    const heroText = document.querySelector('.portal-hero-copy p');
    if (heroText) heroText.textContent = 'Todas as contas do portal evoluem de Bronze para Prata e, futuramente, Ouro. O nível representa a segurança da mesma conta usada em todos os módulos, sem alterar o cargo ou a prioridade de manifestações.';

    const profileCopy = document.querySelector('#profilePhotoCard .profile-editor-copy p');
    if (profileCopy) profileCopy.textContent = 'Esta é a foto única do seu perfil no portal. Ela é usada nos ambientes em que sua identidade pode aparecer e nunca é copiada para dentro de uma manifestação sigilosa do Conselho.';

    const securityCopy = document.querySelector('#seguranca > p');
    if (securityCopy) securityCopy.innerHTML = 'Confirmar o e-mail de segurança transforma a conta Bronze em Prata e protege o acesso. Nas manifestações do Conselho, contas com e-mail são tratadas como <strong>sigilosas</strong>; o endereço não aparece no painel institucional.';
  }

  await syncUnifiedAccountExperience();
  window.addEventListener('pageshow', () => syncUnifiedAccountExperience());

  const emailBadge = document.getElementById('emailStatusBadge');
  if (emailBadge) {
    new MutationObserver(() => {
      window.setTimeout(() => syncUnifiedAccountExperience(), 0);
    }).observe(emailBadge, { childList: true, subtree: true, characterData: true });
  }

  const card = document.getElementById('citizenIdentityCard');
  const form = document.getElementById('citizenIdentityForm');
  const displayNameInput = document.getElementById('citizenDisplayName');
  const handleInput = document.getElementById('citizenHandle');
  const handleHelp = document.getElementById('citizenHandleHelp');
  const status = document.getElementById('citizenIdentityStatus');
  const saveButton = document.getElementById('saveCitizenIdentity');
  if (!card || !form || !displayNameInput || !handleInput) return;

  let user = await auth.me({ allowCached: false }).catch(() => null);
  if (!user || user.role !== 'cidadao') return;
  card.hidden = false;

  function show(message, type = 'success') {
    if (!status) return;
    status.textContent = message;
    status.className = `account-status visible ${type}`;
  }

  function formatDate(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
  }

  function normalizeHandle(value) {
    return String(value || '').replace(/^@+/, '').trim().toLowerCase();
  }

  function render(identity) {
    displayNameInput.value = identity.displayName || '';
    handleInput.value = identity.handle || '';
    const canChange = identity.canChangeHandle !== false;
    handleInput.disabled = !canChange;
    if (handleHelp) {
      handleHelp.innerHTML = canChange
        ? 'Seu <strong>@nome.de.usuario</strong> é único. Depois de trocar, você poderá alterá-lo novamente após 30 dias.'
        : `Seu @ só poderá ser alterado novamente em <strong>${formatDate(identity.nextHandleChangeAt)}</strong>. O nome de exibição continua livre para alterações.`;
    }
  }

  async function load() {
    try {
      const payload = await auth.api('/api/citizen/identity', { method: 'GET' });
      render(payload.identity || {});
    } catch (error) {
      show(error.message || 'Não foi possível carregar a identidade do perfil.', 'error');
    }
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (saveButton) {
      saveButton.disabled = true;
      saveButton.textContent = 'Salvando...';
    }
    try {
      const payload = await auth.api('/api/citizen/identity', {
        method: 'PATCH',
        body: JSON.stringify({
          displayName: displayNameInput.value.trim(),
          ...(handleInput.disabled ? {} : { handle: normalizeHandle(handleInput.value) })
        })
      });
      const identity = payload.identity || {};
      render(identity);
      user = await auth.me({ allowCached: false }).catch(() => user);
      const nameNode = document.getElementById('portalUserName');
      if (nameNode && user) nameNode.textContent = user.name || user.username;
      show('Perfil atualizado com sucesso.', 'success');
    } catch (error) {
      if (error.code === 'HANDLE_COOLDOWN' && error.nextHandleChangeAt) {
        show(`O @ poderá ser alterado novamente em ${formatDate(error.nextHandleChangeAt)}.`, 'error');
      } else {
        show(error.message || 'Não foi possível atualizar o perfil.', 'error');
      }
    } finally {
      if (saveButton) {
        saveButton.disabled = false;
        saveButton.textContent = 'Salvar perfil';
      }
    }
  });

  await load();
})();
