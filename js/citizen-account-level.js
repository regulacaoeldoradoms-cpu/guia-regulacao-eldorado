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

    if (user.role !== 'cidadao') {
      if (badge) badge.hidden = true;
      if (notice) notice.hidden = true;
      if (actionTitle) actionTitle.textContent = 'Minha conta e segurança';
      if (actionText) actionText.textContent = 'Gerencie senha, e-mail de segurança e foto do seu perfil.';
      return;
    }

    const meta = levels.metaFor(user);
    if (badge) {
      badge.hidden = false;
      levels.renderMiniBadge(badge, user);
    }
    if (actionTitle) actionTitle.textContent = 'Evolução da conta';
    if (actionText) {
      actionText.textContent = meta.level === 'bronze'
        ? 'Você está no Bronze. Confirme o e-mail para chegar ao Prata.'
        : meta.level === 'prata'
          ? 'Conta Prata: foto de perfil desbloqueada.'
          : 'Conta Ouro: nível máximo de proteção.';
    }

    if (!notice) return;
    if (meta.level === 'bronze') {
      notice.hidden = false;
      notice.innerHTML = '<strong>🥉 Sua conta é Bronze.</strong> Você já pode usar normalmente o Canal do Cidadão. Se quiser desbloquear foto de perfil e preparar os recursos sociais futuros, <a href="/conta/#seguranca">confirme um e-mail e evolua para Prata</a>.';
    } else if (meta.level === 'prata') {
      notice.hidden = false;
      notice.innerHTML = '<strong>🥈 Conta Prata desbloqueada.</strong> Sua foto de perfil já está disponível. O nível Ouro chegará futuramente com proteção reforçada em novos dispositivos.';
    } else {
      notice.hidden = false;
      notice.innerHTML = '<strong>🥇 Conta Ouro.</strong> Sua conta atingiu o nível máximo de proteção previsto no portal.';
    }
  }

  render();
  window.addEventListener('pageshow', render);
})();
