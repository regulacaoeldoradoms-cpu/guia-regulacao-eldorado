'use strict';

// A página /conta/ é compartilhada por todos os perfis. Carrega a identidade
// visual correspondente ao usuário antes de aplicar as funções exclusivas do cidadão.
import('/js/account-brand.js?v=20260817-1').catch(() => {});

(async () => {
  const auth = window.RegulationAuth;
  const card = document.getElementById('citizenIdentityCard');
  const form = document.getElementById('citizenIdentityForm');
  const displayNameInput = document.getElementById('citizenDisplayName');
  const handleInput = document.getElementById('citizenHandle');
  const handleHelp = document.getElementById('citizenHandleHelp');
  const status = document.getElementById('citizenIdentityStatus');
  const saveButton = document.getElementById('saveCitizenIdentity');
  if (!auth || !card || !form || !displayNameInput || !handleInput) return;

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
