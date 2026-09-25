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

  const studySection = document.getElementById('studyAchievementsSection');
  const studyGrid = document.getElementById('studyAchievementsGrid');
  if (studySection && studyGrid && String(user.username || '').toLowerCase() === 'wellyton') {
    try {
      const payload = await window.RegulationAuth.api('/api/studies/achievements', { method: 'GET' });
      const achievements = Array.isArray(payload?.achievements) ? payload.achievements : [];
      studySection.hidden = false;
      studyGrid.innerHTML = achievements.length
        ? achievements.map((item) => `<article class="achievement-card"><span class="achievement-state">Conquistada</span><div class="achievement-icon" aria-hidden="true">🏆</div><h3>${item.title}</h3><p>${item.description}</p><small>${item.unlockedAt ? new Date(item.unlockedAt + (item.unlockedAt.endsWith('Z') ? '' : 'Z')).toLocaleDateString('pt-BR') : ''}</small></article>`).join('')
        : '<article class="achievement-card planned"><span class="achievement-state">Em campanha</span><div class="achievement-icon" aria-hidden="true">🏦</div><h3>Primeira missão</h3><p>Conclua sua primeira missão real para desbloquear a primeira medalha.</p></article>';
    } catch (_) {
      studySection.hidden = false;
      studyGrid.innerHTML = '<article class="achievement-card planned"><span class="achievement-state">Indisponível</span><div class="achievement-icon" aria-hidden="true">🏦</div><h3>Missão Bancária</h3><p>As conquistas de estudo estão temporariamente indisponíveis. Sua progressão de segurança continua normal.</p></article>';
    }
  }
})();
