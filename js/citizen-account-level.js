'use strict';

(() => {
  const auth = window.RegulationAuth;
  const levels = window.AccountLevels;
  if (!auth || !levels) return;

  const roleLabels = {
    medico: 'Médico',
    recepcao: 'Recepção',
    coordenacao: 'Coordenação',
    admin: 'Desenvolvedor',
    cidadao: 'Cidadão'
  };

  async function resolvedUser() {
    let user = auth.getCachedUser();
    try {
      // Esta leitura atualiza no portal o estado de confirmação já existente no Firebase.
      await auth.getSecurity();
      user = await auth.me({ allowCached: false }) || user;
    } catch (_) {}
    return user;
  }

  function syncIdentity(user) {
    const roleNode = document.getElementById('portalUserRole');
    if (roleNode) {
      const role = roleLabels[user.role] || user.role || 'Usuário';
      const job = user.role !== 'cidadao' && user.jobTitle ? ` · ${user.jobTitle}` : '';
      const council = user.councilRole ? ` · Conselho: ${user.councilRole === 'presidente' ? 'Presidente' : 'Membro'}` : '';
      roleNode.textContent = `${role}${job}${council}`;
    }

    const contextNotice = document.getElementById('citizenContextNotice');
    if (contextNotice && user.role !== 'cidadao') {
      contextNotice.innerHTML = '<strong>Uma conta, o mesmo perfil.</strong> Você continua identificado no portal pelo seu cargo profissional. O Canal do Cidadão é apenas mais um módulo da mesma conta. Nas manifestações, seu e-mail permanece protegido e não é exibido ao Conselho; o conteúdo e os anexos podem revelar sua identidade se você próprio incluir esses dados.';
      contextNotice.hidden = false;
    }

    const privacyChip = document.getElementById('privacyChip');
    if (privacyChip && user.role !== 'cidadao') {
      privacyChip.textContent = user.emailVerified
        ? '🔒 Sigilosa · e-mail de segurança protegido'
        : '⚠️ Confirme o e-mail de segurança';
    }
  }

  async function render() {
    const user = await resolvedUser();
    if (!user) return;

    const badge = document.getElementById('accountLevelBadge');
    const notice = document.getElementById('accountEvolutionNotice');
    const actionText = document.getElementById('accountActionText');
    const actionTitle = document.getElementById('accountActionTitle');
    const meta = levels.metaFor(user);
    const isPrimaryCitizen = user.role === 'cidadao';

    syncIdentity(user);

    if (badge) {
      badge.hidden = false;
      levels.renderMiniBadge(badge, user);
    }
    if (actionTitle) actionTitle.textContent = 'Evolução da conta';
    if (actionText) {
      actionText.textContent = meta.level === 'bronze'
        ? 'Você está no Bronze. Confirme o e-mail para chegar ao Prata.'
        : meta.level === 'prata'
          ? 'Conta Prata: e-mail de segurança confirmado.'
          : 'Conta Ouro: nível máximo de proteção.';
    }

    if (!notice) return;
    if (meta.level === 'bronze') {
      notice.hidden = false;
      notice.innerHTML = '<strong>🥉 Sua conta é Bronze.</strong> Confirme um e-mail de segurança para evoluir para Prata.';
    } else if (meta.level === 'prata') {
      notice.hidden = false;
      notice.innerHTML = isPrimaryCitizen
        ? '<strong>🥈 Conta Prata.</strong> Seu e-mail de segurança está confirmado. O nível Ouro chegará futuramente com proteção reforçada em novos dispositivos.'
        : '<strong>🥈 Conta Prata.</strong> Seu e-mail de segurança está confirmado. O mesmo perfil, foto e nível de segurança acompanham sua conta em todos os módulos do portal.';
    } else {
      notice.hidden = false;
      notice.innerHTML = '<strong>🥇 Conta Ouro.</strong> Sua conta atingiu o nível máximo de proteção previsto no portal.';
    }
  }

  render();
  window.setTimeout(render, 0);
  window.setTimeout(render, 500);
  window.addEventListener('pageshow', render);
})();
