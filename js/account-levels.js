'use strict';

(() => {
  const LEVELS = Object.freeze({
    bronze: { rank: 1, label: 'Bronze' },
    prata: { rank: 2, label: 'Prata' },
    ouro: { rank: 3, label: 'Ouro' }
  });

  function normalizeLevel(value) {
    const level = String(value || '').toLowerCase();
    return LEVELS[level] ? level : 'bronze';
  }

  function levelFor(user) {
    const stored = normalizeLevel(user?.accountLevel || user?.accountProgress?.level || 'bronze');
    if (stored === 'ouro' || user?.strongAuthEnabled === true || user?.mfaEnabled === true) return 'ouro';
    if (user?.emailVerified === true) return 'prata';
    return stored === 'prata' ? 'prata' : 'bronze';
  }

  function rankFor(userOrLevel) {
    const level = typeof userOrLevel === 'string' ? normalizeLevel(userOrLevel) : levelFor(userOrLevel);
    return LEVELS[level].rank;
  }

  function metaFor(userOrLevel) {
    const level = typeof userOrLevel === 'string' ? normalizeLevel(userOrLevel) : levelFor(userOrLevel);
    return { level, ...LEVELS[level] };
  }

  function minimumMet(user, minimum) {
    return rankFor(user) >= rankFor(minimum);
  }

  function renderMiniBadge(element, user) {
    if (!element) return;
    const meta = metaFor(user);
    element.className = `level-mini-badge ${meta.level}`;
    element.textContent = `Conta ${meta.label}`;
  }

  function renderProgress(root, user) {
    if (!root) return;
    const current = metaFor(user);
    const currentBadge = root.querySelector('[data-level-current]');
    if (currentBadge) {
      currentBadge.className = `account-level-current ${current.level}`;
      currentBadge.textContent = `Conta ${current.label}`;
    }

    root.querySelectorAll('[data-level-step]').forEach((step) => {
      const level = normalizeLevel(step.dataset.levelStep);
      const rank = rankFor(level);
      step.classList.toggle('completed', rank < current.rank);
      step.classList.toggle('current', rank === current.rank);
      step.classList.toggle('locked', rank > current.rank);
    });

    const nextTitle = root.querySelector('[data-level-next-title]');
    const nextText = root.querySelector('[data-level-next-text]');
    const nextAction = root.querySelector('[data-level-next-action]');
    if (current.level === 'bronze') {
      if (nextTitle) nextTitle.textContent = 'Próxima conquista: Conta Prata';
      if (nextText) nextText.textContent = 'Confirme um e-mail de segurança. A conta passa ao nível Prata assim que a confirmação for reconhecida pelo portal.';
      if (nextAction) {
        nextAction.hidden = false;
        nextAction.style.removeProperty('display');
        nextAction.textContent = 'Evoluir para Prata';
        nextAction.href = '#seguranca';
      }
    } else if (current.level === 'prata') {
      if (nextTitle) nextTitle.textContent = 'Próxima conquista: Conta Ouro';
      if (nextText) nextText.textContent = 'O nível Ouro ficará disponível quando a proteção reforçada em novos dispositivos e a segunda etapa de autenticação forem ativadas no portal.';
      if (nextAction) { nextAction.hidden = true; nextAction.style.display = 'none'; }
    } else {
      if (nextTitle) nextTitle.textContent = 'Conta no nível máximo';
      if (nextText) nextText.textContent = 'Sua conta possui o nível máximo de proteção previsto no portal.';
      if (nextAction) { nextAction.hidden = true; nextAction.style.display = 'none'; }
    }

    const achievement = root.querySelector('[data-level-achievement]');
    if (achievement) {
      achievement.innerHTML = current.level === 'bronze'
        ? '<div><strong>Falta uma confirmação</strong><span>Adicionar e confirmar o e-mail leva sua conta ao nível Prata.</span></div>'
        : current.level === 'prata'
          ? '<div><strong>E-mail confirmado</strong><span>Sua conta está no nível Prata e preparada para os recursos que dependem de identificação de segurança verificada.</span></div>'
          : '<div><strong>Conta Ouro</strong><span>Proteção reforçada e acesso aos recursos avançados previstos para a camada social.</span></div>';
    }
  }

  window.AccountLevels = Object.freeze({ levelFor, rankFor, metaFor, minimumMet, renderMiniBadge, renderProgress });
})();