'use strict';

(() => {
  const auth = window.RegulationAuth;
  const levels = window.AccountLevels;
  if (!auth || !levels) return;

  const roleLabels = {
    medico: 'Médico', recepcao: 'Recepção', coordenacao: 'Coordenação', admin: 'Desenvolvedor', cidadao: 'Cidadão'
  };

  async function resolvedUser() {
    let user = auth.getCachedUser();
    try {
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

    const createButton = document.getElementById('openNewManifestation');
    if (createButton && user.councilRole === 'presidente') {
      createButton.hidden = true;
      createButton.disabled = true;
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

    syncIdentity(user);

    if (badge) {
      badge.hidden = false;
      levels.renderMiniBadge(badge, user);
    }
    if (actionTitle) actionTitle.textContent = 'Segurança da conta';
    if (actionText) {
      actionText.textContent = meta.level === 'bronze'
        ? 'Conta Bronze: confirme o e-mail para avançar ao Prata.'
        : meta.level === 'prata'
          ? 'Conta Prata: e-mail de segurança confirmado.'
          : 'Conta Ouro: nível máximo de proteção.';
    }

    if (!notice) return;
    notice.hidden = false;
    notice.innerHTML = meta.level === 'bronze'
      ? '<strong>Sua conta está no nível Bronze.</strong> Você pode usar o Canal do Cidadão. Sem e-mail verificado, novas manifestações são registradas como anônimas; após a confirmação, você poderá escolher entre envio sigiloso ou identificado.'
      : meta.level === 'prata'
        ? '<strong>Conta Prata.</strong> Seu e-mail de segurança está confirmado. Em cada nova manifestação, você pode manter sua identidade sigilosa ou optar por se identificar ao Conselho. O endereço de e-mail continua protegido.'
        : '<strong>Conta Ouro.</strong> Sua conta atingiu o nível máximo de proteção previsto no portal.';
  }

  render();
  window.setTimeout(render, 0);
  window.setTimeout(render, 500);
  window.addEventListener('pageshow', render);
})();