(() => {
'use strict';

const initializeCitizenArea = async (context) => {
  const window = context?.window || globalThis;
  const document = context?.document || globalThis.document;
  const auth = window.RegulationAuth;
  const params = new URLSearchParams(location.search);
  let user = await window.PortalAccountSection?.mount({ allowFirstAccess: true });
  if (!user) return;

  let security = {};
  let firstAccess = user.mustChangePassword === true || params.get('primeiro-acesso') === '1';
  const verificationFlow = params.get('verificar-email') === '1' || Boolean(user.emailVerificationRequired);

  const firstAccessNotice = document.getElementById('firstAccessNotice');
  const emailVerificationNotice = document.getElementById('emailVerificationNotice');
  const passwordForm = document.getElementById('changePasswordForm');
  const currentPassword = document.getElementById('currentPassword');
  const newPassword = document.getElementById('newPassword');
  const confirmPassword = document.getElementById('confirmPassword');
  const passwordButton = document.getElementById('changePasswordButton');
  const passwordStatus = document.getElementById('accountStatus');
  const emailForm = document.getElementById('securityEmailForm');
  const emailInput = document.getElementById('securityEmail');
  const emailStatusBadge = document.getElementById('emailStatusBadge');
  const verificationButton = document.getElementById('sendEmailVerification');
  const securityStatus = document.getElementById('securityStatus');
  const privacyStatus = document.getElementById('privacyStatus');
  const levelLabel = document.getElementById('securityLevelLabel');
  const levelHint = document.getElementById('securityLevelHint');
  const privateCard = document.getElementById('privateRegistrationCard');
  const privateForm = document.getElementById('privateRegistrationForm');
  const privateBirth = document.getElementById('privateBirthDate');
  const privateGender = document.getElementById('privateGender');
  const privateButton = document.getElementById('privateRegistrationSubmit');
  const privateStatus = document.getElementById('privateRegistrationStatus');
  const privateRetry = document.getElementById('privateRegistrationRetry');
  let privateDetails = null;
  let privateBusy = false;
  const dateHelperReady = import('/js/private-birth-date-input.js?v=20261015-account-private-1').catch(() => null);
  const privateAvailable = () => !firstAccess && !(user.emailVerificationRequired && !(user.emailVerified || security.emailVerified));
  const privateComplete = data => data?.birthDateRecorded === true;

  function renderPrivateDetails() {
    if (!privateCard) return;
    privateCard.hidden = !privateAvailable();
    if (!privateDetails) return;
    const needsRecovery = privateDetails.birthDateRecorded !== true && privateDetails.canCompleteBirthDate !== true;
    const birthMissing = privateDetails.birthDateRecorded !== true && !needsRecovery;
    document.getElementById('privateBirthDateField').hidden = !birthMissing;
    document.getElementById('privateGenderField').hidden = false;
    privateBirth.disabled = !birthMissing || privateBusy; privateBirth.required = birthMissing;
    privateGender.disabled = privateBusy; privateGender.required = false;
    if (!birthMissing) privateBirth.value = '';
    privateForm.hidden = false;
    privateButton.disabled = privateBusy;
    document.getElementById('privateRegistrationSummary').textContent = needsRecovery
      ? 'Seu nascimento precisa de recuperação autorizada. O gênero pode ser atualizado abaixo.'
      : privateComplete(privateDetails)
      ? 'Nascimento já registrado. Atualize o gênero abaixo, se quiser.'
      : 'Complete seu nascimento. O gênero é opcional.';
  }

  async function loadPrivateDetails() {
    if (!privateCard || !privateAvailable()) { if (privateCard) privateCard.hidden = true; return null; }
    const token = auth.getToken(); privateBusy = true; privateButton.disabled = true; privateRetry.hidden = true;
    privateCard.hidden = false;
    try {
      await dateHelperReady;
      window.PortalBirthDateInput?.bind(privateBirth);
      const data = await auth.api('/api/auth/registration-details');
      if (token !== auth.getToken()) return null;
      privateDetails = data; privateGender.value = data.gender || ''; renderPrivateDetails();
      if (location.hash === '#privateRegistrationCard') privateCard.scrollIntoView({block:'start'});
      return data;
    } catch (error) {
      if (token !== auth.getToken()) return null;
      privateForm.hidden = true; privateRetry.hidden = false;
      show(privateStatus, error.message || 'Não foi possível carregar os dados privados.', 'error');
      return null;
    } finally { privateBusy = false; if (token === auth.getToken() && privateDetails) renderPrivateDetails(); }
  }

  window.addEventListener('portal:session-cleared', () => { privateDetails = null; privateForm?.reset(); if (privateCard) privateCard.hidden = true; });
  privateRetry?.addEventListener('click', loadPrivateDetails);
  privateForm?.addEventListener('submit', async event => {
    event.preventDefault();
    if (privateBusy || !privateAvailable() || !privateDetails) return;
    const input = {};
    if (!privateDetails.birthDateRecorded && privateDetails.canCompleteBirthDate) {
      if (!window.PortalBirthDateInput?.validate(privateBirth)) { privateBirth.reportValidity(); return; }
      input.birthDate = privateBirth.value;
    }
    input.gender = privateGender.value || null;
    if (!privateForm.reportValidity()) return;
    const token = auth.getToken(); privateBusy = true; privateButton.disabled = true;
    privateStatus.textContent = ''; privateStatus.className = 'account-status';
    try {
      const data = await auth.api('/api/auth/registration-details', {method:'PATCH',body:JSON.stringify(input)});
      if (token !== auth.getToken()) return;
      privateDetails = data; privateForm.reset(); privateGender.value = data.gender || ''; renderPrivateDetails();
      show(privateStatus, 'Dados privados salvos.', 'success');
    } catch (error) {
      if (token !== auth.getToken()) return;
      show(privateStatus, error.message || 'Não foi possível salvar os dados privados.', 'error');
      if (error.status === 409) await loadPrivateDetails();
    } finally { privateBusy = false; window.PortalInteractions?.endTask?.(privateButton); if (token === auth.getToken()) renderPrivateDetails(); }
  });

  function show(element, message, type = 'success') {
    if (!element) return;
    element.textContent = message;
    element.className = `account-status visible ${type}`;
  }

  function safeNext() {
    const value = params.get('next');
    return value && value.startsWith('/') && !value.startsWith('//') ? value : '';
  }

  function accountLevel() {
    if (String(user.accountLevel || '').toLowerCase() === 'ouro' || user.strongAuthEnabled || user.mfaEnabled) return 'Ouro';
    if (user.emailVerified || security.emailVerified) return 'Prata';
    return 'Bronze';
  }

  function renderLevel() {
    const level = accountLevel();
    if (levelLabel) levelLabel.textContent = `Conta ${level}`;
    if (levelHint) levelHint.textContent = level === 'Bronze'
      ? 'Confirme o e-mail para alcançar Prata'
      : level === 'Prata'
        ? 'E-mail de segurança confirmado'
        : 'Proteção reforçada ativa';
  }

  function applyGateState() {
    document.body.classList.toggle('security-first-access', firstAccess);
    const emailGate = !firstAccess && Boolean(user.emailVerificationRequired) && !Boolean(user.emailVerified || security.emailVerified);
    document.body.classList.toggle('security-verification-gate', emailGate);
    if (privateCard) privateCard.hidden = !privateAvailable();
    if (firstAccessNotice) firstAccessNotice.hidden = !firstAccess;
    if (emailVerificationNotice) emailVerificationNotice.hidden = !emailGate && !(verificationFlow && !user.emailVerified);
  }

  function renderSecurity() {
    if (emailInput) emailInput.value = security.email || '';
    if (emailStatusBadge) {
      emailStatusBadge.textContent = !security.email ? 'Nenhum e-mail cadastrado' : security.emailVerified ? 'E-mail verificado' : 'E-mail ainda não verificado';
      emailStatusBadge.className = `user-badge ${security.emailVerified ? '' : 'inactive'}`;
    }
    if (verificationButton) {
      verificationButton.hidden = !security.email || security.emailVerified;
      verificationButton.disabled = !security.firebaseReady;
      verificationButton.title = security.firebaseReady ? '' : 'Aguardando conexão do serviço de verificação';
    }
    if (privacyStatus) {
      privacyStatus.innerHTML = security.emailVerified
        ? '<strong>Conta Prata · e-mail confirmado</strong><span>O endereço protege a mesma conta usada em todos os módulos. Nas manifestações do Conselho, o e-mail continua protegido e nunca é mostrado no painel institucional.</span>'
        : '<strong>Conta Bronze · privacidade preservada</strong><span>Mesmo sem e-mail confirmado, cada nova manifestação mantém as opções de privacidade previstas pelo Portal. Confirmar o endereço reforça a segurança e libera a foto de perfil.</span>';
    }
    renderLevel();
    applyGateState();
  }

  async function refreshUser() {
    const fresh = await auth.me({ allowCached: false }).catch(() => null);
    if (fresh) user = fresh;
    renderLevel();
    applyGateState();
    return user;
  }

  async function loadSecurity() {
    try {
      security = await auth.getSecurity();
      if (security.emailVerified) await refreshUser();
      renderSecurity();
      const details = await loadPrivateDetails();
      if (params.get('email-verificado') === '1' && security.emailVerified) {
        show(securityStatus, 'E-mail confirmado. Sua conta agora está no nível Prata.', 'success');
        const destination = safeNext();
        if (destination && privateComplete(details)) window.setTimeout(() => location.replace(destination), 900);
      }
    } catch (error) {
      show(securityStatus, error.message || 'Não foi possível carregar a segurança da conta.', 'error');
    }
  }

  applyGateState();
  renderLevel();

  passwordForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (newPassword.value !== confirmPassword.value) {
      show(passwordStatus, 'A confirmação não corresponde à nova senha.', 'error');
      return;
    }
    passwordButton.disabled = true;
    passwordButton.textContent = 'Salvando...';
    try {
      user = await auth.changePassword(currentPassword.value, newPassword.value);
      passwordForm.reset();
      if (firstAccess) {
        firstAccess = false;
        if (user.emailVerificationRequired && !user.emailVerified) {
          applyGateState();
          await loadSecurity();
          show(passwordStatus, 'Senha alterada. Agora confirme seu e-mail de segurança para concluir o acesso.', 'success');
          document.getElementById('emailSecurityCard')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
          return;
        }
        applyGateState();
        const details = await loadPrivateDetails();
        if (!privateComplete(details)) {
          show(passwordStatus, 'Senha alterada. Complete seus dados privados abaixo.', 'success');
          privateCard?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
          return;
        }
        show(passwordStatus, 'Senha alterada com sucesso. Abrindo seu ambiente...', 'success');
        window.setTimeout(() => location.replace(safeNext() || '/'), 550);
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

  emailForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      security = await auth.updateSecurity({ email: emailInput.value.trim() });
      await refreshUser();
      renderSecurity();
      await loadPrivateDetails();
      show(securityStatus, security.emailVerified ? 'E-mail de segurança confirmado.' : 'E-mail salvo. Agora envie a verificação para confirmar o endereço.', 'success');
    } catch (error) {
      show(securityStatus, error.message || 'Não foi possível salvar o e-mail.', 'error');
    }
  });

  verificationButton?.addEventListener('click', async () => {
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

  await loadSecurity();
  if (!privateDetails && privateAvailable()) await loadPrivateDetails();
};
if (window.PortalCitizenShell) window.PortalCitizenShell.register('security', initializeCitizenArea);
else initializeCitizenArea();

})();
