'use strict';

(() => {
  const form = document.getElementById('signupForm');
  const username = document.getElementById('signupUsername');
  const password = document.getElementById('signupPassword');
  const confirm = document.getElementById('signupConfirm');
  const birthDate = document.getElementById('signupBirthDate');
  const gender = document.getElementById('signupGender');
  window.PortalBirthDateInput?.bind(birthDate);
  const submit = document.getElementById('signupSubmit');
  const status = document.getElementById('signupStatus');

  function show(message, type = 'error') {
    status.textContent = message;
    status.className = `login-status visible ${type}`;
  }

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!gender || !window.PortalBirthDateInput) { show('Atualize a página para concluir o cadastro.'); return; }
    if (!window.PortalBirthDateInput.validate(birthDate) || !form.reportValidity()) { birthDate.reportValidity(); return; }
    if (password.value !== confirm.value) {
      show('A confirmação da senha não corresponde à senha escolhida.');
      return;
    }
    if (password.value.length < 8) {
      show('A senha deve ter pelo menos 8 caracteres.');
      return;
    }
    submit.disabled = true;
    submit.textContent = 'Criando Conta Bronze...';
    status.className = 'login-status';
    try {
      await window.RegulationAuth.registerCitizen(username.value, password.value, birthDate.value, gender.value);
      show('Conta Bronze criada. Abrindo o Portal...', 'success');
      window.setTimeout(() => location.replace('/'), 550);
    } catch (error) {
      show(error.message || 'Não foi possível criar a conta.');
    } finally {
      submit.disabled = false;
      submit.textContent = 'Criar minha Conta Bronze';
    }
  });
})();
