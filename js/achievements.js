'use strict';

(async () => {
  const user = await window.PortalAccountSection?.mount();
  if (!user) return;
  const panel = document.getElementById('accountLevelPanel');
  const levels = window.AccountLevels;
  if (panel && levels) {
    panel.hidden = false;
    levels.renderProgress(panel, user);
    const nextAction = panel.querySelector('[data-level-next-action]');
    if (nextAction && !nextAction.hidden) nextAction.href = '/seguranca/';
  }

  const summary = document.getElementById('achievementSummary');
  if (summary) {
    const level = levels?.metaFor?.(user)?.label || (user.emailVerified ? 'Prata' : 'Bronze');
    summary.textContent = `Conta ${level}`;
  }
})();
