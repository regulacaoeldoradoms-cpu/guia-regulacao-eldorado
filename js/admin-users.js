'use strict';

(async () => {
  const auth = window.RegulationAuth;
  const currentUser = await auth.requireRole(['coordenacao']);
  if (!currentUser || !['admin', 'coordenacao'].includes(currentUser.role)) return;

  const isDeveloper = currentUser.role === 'admin';
  const roleLabels = {
    medico: 'Médico', recepcao: 'Recepção', coordenacao: 'Coordenação', cidadao: 'Cidadão', admin: 'Desenvolvedor'
  };
  const councilLabels = { presidente: 'Presidente do Conselho', membro: 'Membro do Conselho', '': 'Sem função no Conselho' };
  const state = { users: [], editing: null, resetting: null };

  document.getElementById('portalUserName').textContent = currentUser.name || currentUser.username;
  document.getElementById('portalUserRole').textContent = isDeveloper ? 'Desenvolvedor · nível técnico máximo' : 'Coordenação · gestão operacional';

  const listEl = document.getElementById('usersList');
  const countEl = document.getElementById('usersCount');
  const searchEl = document.getElementById('usersSearch');
  const createForm = document.getElementById('createUserForm');
  const createStatus = document.getElementById('createUserStatus');
  const createButton = document.getElementById('createUserButton');
  const newRole = document.getElementById('newRole');
  const editRole = document.getElementById('editRole');
  const editCouncilWrap = document.getElementById('editCouncilWrap');
  const editCouncil = document.getElementById('editCouncilRole');

  if (isDeveloper) {
    newRole.innerHTML = '<option value="coordenacao">Coordenação — Guia + Recepção + Monitoramento + usuários subordinados</option><option value="medico">Médico — Guia Médico + Gemini</option><option value="recepcao">Recepção — conferência documental</option><option value="cidadao">Cidadão — conta sem função profissional</option>';
  } else {
    newRole.innerHTML = '<option value="medico">Médico — Guia Médico + Gemini</option><option value="recepcao">Recepção — conferência documental</option>';
  }
  editCouncilWrap.hidden = !isDeveloper;

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  }

  function showStatus(el, message, type) {
    el.textContent = message;
    el.className = `account-status visible ${type}`;
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  function openModal(id) {
    const modal = document.getElementById(id);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function filteredUsers() {
    const q = searchEl.value.trim().toLowerCase();
    if (!q) return state.users;
    return state.users.filter((user) => [user.name, user.username, user.jobTitle, roleLabels[user.role], councilLabels[user.councilRole], 'Canal do Cidadão'].some((value) => String(value || '').toLowerCase().includes(q)));
  }

  function render() {
    const users = filteredUsers();
    countEl.textContent = `${state.users.length} conta(s) visível(is) · ${state.users.filter((user) => user.active).length} ativa(s)`;
    if (!users.length) {
      listEl.innerHTML = '<div class="portal-note info">Nenhuma conta encontrada para esta busca.</div>';
      return;
    }
    listEl.innerHTML = users.map((user) => {
      const isSelf = user.username === currentUser.username;
      const canEdit = isDeveloper ? (user.role !== 'admin' || isSelf) : ['medico', 'recepcao'].includes(user.role);
      return `<article class="user-row" data-username="${escapeHtml(user.username)}">
        <div class="user-main">
          <strong>${escapeHtml(user.name || user.username)}</strong>
          <small>@${escapeHtml(user.username)}${user.jobTitle ? ` · ${escapeHtml(user.jobTitle)}` : ''}</small>
          <div class="user-badges">
            <span class="user-badge">${escapeHtml(roleLabels[user.role] || user.role)}</span>
            ${user.role !== 'cidadao' ? '<span class="user-badge">Canal do Cidadão</span>' : ''}
            ${user.councilRole ? `<span class="user-badge">${escapeHtml(councilLabels[user.councilRole] || user.councilRole)}</span>` : ''}
            <span class="user-badge ${user.active ? '' : 'inactive'}">${user.active ? 'Ativo' : 'Desativado'}</span>
            ${user.mustChangePassword ? '<span class="user-badge">Troca de senha pendente</span>' : ''}
            ${user.emailConfigured ? `<span class="user-badge">E-mail ${user.emailVerified ? 'verificado' : 'não verificado'}</span>` : '<span class="user-badge">Sem e-mail</span>'}
          </div>
        </div>
        <div class="user-meta">${isSelf ? 'Sua conta' : user.selfRegistered ? 'Cadastro do cidadão' : 'Conta gerenciada pelo portal'}</div>
        <div class="user-actions">
          ${canEdit ? '<button class="portal-button secondary" type="button" data-action="edit">Editar</button><button class="portal-button secondary" type="button" data-action="reset">Redefinir senha</button>' : ''}
        </div>
      </article>`;
    }).join('');
  }

  async function loadUsers() {
    listEl.innerHTML = '<div class="portal-note info">Carregando usuários...</div>';
    try {
      state.users = await auth.listUsers();
      render();
    } catch (error) {
      listEl.innerHTML = `<div class="portal-note warning">${escapeHtml(error.message || 'Não foi possível carregar os usuários.')}</div>`;
    }
  }

  createForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    createButton.disabled = true;
    createButton.textContent = 'Criando...';
    createStatus.className = 'account-status';
    try {
      await auth.createUser({
        name: document.getElementById('newName').value.trim(),
        username: document.getElementById('newUsername').value.trim().toLowerCase(),
        jobTitle: document.getElementById('newJobTitle').value.trim(),
        role: newRole.value,
        password: document.getElementById('newPassword').value,
        mustChangePassword: document.getElementById('newMustChange').checked,
        active: true
      });
      createForm.reset();
      document.getElementById('newMustChange').checked = true;
      showStatus(createStatus, 'Acesso criado com sucesso.', 'success');
      await loadUsers();
    } catch (error) {
      showStatus(createStatus, error.message || 'Não foi possível criar o acesso.', 'error');
    } finally {
      createButton.disabled = false;
      createButton.textContent = 'Criar acesso';
    }
  });

  listEl.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    const row = event.target.closest('[data-username]');
    if (!button || !row) return;
    const user = state.users.find((item) => item.username === row.dataset.username);
    if (!user) return;

    if (button.dataset.action === 'edit') {
      state.editing = user.username;
      document.getElementById('editUsernameLabel').textContent = `@${user.username}`;
      document.getElementById('editName').value = user.name || '';
      document.getElementById('editJobTitle').value = user.jobTitle || '';
      const available = isDeveloper ? ['admin', 'coordenacao', 'medico', 'recepcao', 'cidadao'] : ['medico', 'recepcao'];
      editRole.innerHTML = available.map((role) => `<option value="${role}">${roleLabels[role]}</option>`).join('');
      editRole.value = user.role;
      if (isDeveloper) editCouncil.value = user.councilRole || '';
      document.getElementById('editActive').checked = Boolean(user.active);
      document.getElementById('editStatus').className = 'account-status full';
      openModal('editUserModal');
    }

    if (button.dataset.action === 'reset') {
      state.resetting = user.username;
      document.getElementById('resetUsernameLabel').textContent = `${user.name || user.username} · @${user.username}`;
      document.getElementById('resetPasswordForm').reset();
      document.getElementById('resetMustChange').checked = true;
      document.getElementById('resetStatus').className = 'account-status';
      openModal('resetPasswordModal');
    }
  });

  document.getElementById('editUserForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const status = document.getElementById('editStatus');
    try {
      const input = {
        name: document.getElementById('editName').value.trim(),
        jobTitle: document.getElementById('editJobTitle').value.trim(),
        role: editRole.value,
        active: document.getElementById('editActive').checked
      };
      if (isDeveloper) input.councilRole = editCouncil.value;
      await auth.updateUser(state.editing, input);
      showStatus(status, 'Alterações salvas.', 'success');
      await loadUsers();
      setTimeout(() => closeModal('editUserModal'), 500);
    } catch (error) {
      showStatus(status, error.message || 'Não foi possível salvar.', 'error');
    }
  });

  document.getElementById('resetPasswordForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const status = document.getElementById('resetStatus');
    try {
      await auth.resetUserPassword(state.resetting, document.getElementById('resetPassword').value, document.getElementById('resetMustChange').checked);
      showStatus(status, 'Senha redefinida. Sessões anteriores dessa conta foram invalidadas.', 'success');
      await loadUsers();
      setTimeout(() => closeModal('resetPasswordModal'), 650);
    } catch (error) {
      showStatus(status, error.message || 'Não foi possível redefinir a senha.', 'error');
    }
  });

  searchEl.addEventListener('input', render);
  document.querySelectorAll('[data-close-modal]').forEach((button) => button.addEventListener('click', () => closeModal(button.dataset.closeModal)));
  document.querySelectorAll('.modal-backdrop').forEach((modal) => modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(modal.id); }));
  document.getElementById('portalLogout')?.addEventListener('click', async () => { await auth.logout(); location.replace('/login/'); });

  await loadUsers();
})();