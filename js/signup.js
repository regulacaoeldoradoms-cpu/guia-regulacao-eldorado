'use strict';

(() => {
  const form = document.getElementById('signupForm');
  const username = document.getElementById('signupUsername');
  const displayName = document.getElementById('signupDisplayName');
  const password = document.getElementById('signupPassword');
  const confirm = document.getElementById('signupConfirm');
  const submit = document.getElementById('signupSubmit');
  const status = document.getElementById('signupStatus');

  function show(message, type = 'error') {
    status.textContent = message;
    status.className = `login-status visible ${type}`;
  }

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (password.value !== confirm.value) {
      show('A confirmação da senha não corresponde à senha escolhida.');
      return;
    }
    if (password.value.length < 8) {
      show('A senha deve ter pelo menos 8 caracteres.');
      return;
    }
    submit.disabled = true;
    submit.textContent = 'Criando conta...';
    status.className = 'login-status';
    try {
      await window.RegulationAuth.registerCitizen(username.value, password.value, displayName.value);
      show('Conta criada. Abrindo o Canal do Cidadão...', 'success');
      window.setTimeout(() => location.replace('/cidadao/'), 450);
    } catch (error) {
      show(error.message || 'Não foi possível criar a conta.');
    } finally {
      submit.disabled = false;
      submit.textContent = 'Criar minha conta';
    }
  });
})();
