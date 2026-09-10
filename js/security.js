'use strict';

(async () => {
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
      if (params.get('email-verificado') === '1' && security.emailVerified) {
        show(securityStatus, 'E-mail confirmado. Sua conta agora está no nível Prata.', 'success');
        const destination = safeNext();
        if (destination) window.setTimeout(() => location.replace(destination), 900);
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
})();
