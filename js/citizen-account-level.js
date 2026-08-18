'use strict';

(() => {
  const auth = window.RegulationAuth;
  const levels = window.AccountLevels;
  if (!auth || !levels) return;

  function render() {
    const user = auth.getCachedUser();
    if (!user) return;

    const badge = document.getElementById('accountLevelBadge');
    const notice = document.getElementById('accountEvolutionNotice');
    const actionText = document.getElementById('accountActionText');
    const actionTitle = document.getElementById('accountActionTitle');
    const meta = levels.metaFor(user);
    const isPrimaryCitizen = user.role === 'cidadao';

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
        : '<strong>🥈 Conta Prata.</strong> Seu e-mail de segurança está confirmado. Seu perfil profissional continua separado do uso pessoal do Canal do Cidadão.';
    } else {
      notice.hidden = false;
      notice.innerHTML = '<strong>🥇 Conta Ouro.</strong> Sua conta atingiu o nível máximo de proteção previsto no portal.';
    }
  }

  render();
  window.addEventListener('pageshow', render);
})();
