'use strict';

(async () => {
  const auth = window.RegulationAuth;
  const user = await auth.requireRole(['medico', 'recepcao', 'admin']);
  if (!user) return;

  const roleLabels = { medico: 'Médico', recepcao: 'Recepção', admin: 'Desenvolvedor · acesso total' };
  document.getElementById('portalUserName').textContent = user.name || user.username;
  document.getElementById('portalUserRole').textContent = roleLabels[user.role] || user.role;

  const form = document.getElementById('changePasswordForm');
  const current = document.getElementById('currentPassword');
  const next = document.getElementById('newPassword');
  const confirm = document.getElementById('confirmPassword');
  const button = document.getElementById('changePasswordButton');
  const status = document.getElementById('accountStatus');

  function show(message, type) {
    status.textContent = message;
    status.className = `account-status visible ${type}`;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (next.value !== confirm.value) {
      show('A confirmação não corresponde à nova senha.', 'error');
      return;
    }
    if (!next.value.length) {
      show('Informe a nova senha.', 'error');
      return;
    }
    button.disabled = true;
    button.textContent = 'Salvando...';
    try {
      await auth.changePassword(current.value, next.value);
      form.reset();
      show('Senha alterada com sucesso. As sessões anteriores desta conta foram invalidadas.', 'success');
    } catch (error) {
      show(error.message || 'Não foi possível alterar a senha.', 'error');
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