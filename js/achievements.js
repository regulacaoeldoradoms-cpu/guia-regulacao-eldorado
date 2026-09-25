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

  const trophyIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3h8v5a4 4 0 0 1-8 0V3Z"/><path d="M8 5H4v2a4 4 0 0 0 4 4M16 5h4v2a4 4 0 0 1-4 4M12 12v5M8 21h8M9 17h6"/></svg>';
  const bookIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v17H7.5A3.5 3.5 0 0 0 4 22V5.5Z"/><path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H13v17h3.5A3.5 3.5 0 0 1 20 22V5.5Z"/></svg>';
  const studySection = document.getElementById('studyAchievementsSection');
  const studyGrid = document.getElementById('studyAchievementsGrid');
  if (studySection && studyGrid && String(user.username || '').toLowerCase() === 'wellyton') {
    try {
      const payload = await window.RegulationAuth.api('/api/studies/achievements', { method: 'GET' });
      const achievements = Array.isArray(payload?.achievements) ? payload.achievements : [];
      studySection.hidden = false;
      studyGrid.innerHTML = achievements.length
        ? achievements.map((item) => `<article class="achievement-card"><span class="achievement-state">Conquistada</span><div class="achievement-icon" aria-hidden="true">${trophyIcon}</div><h3>${item.title}</h3><p>${item.description}</p><small>${item.unlockedAt ? new Date(String(item.unlockedAt).replace(' ', 'T') + (String(item.unlockedAt).endsWith('Z') ? '' : 'Z')).toLocaleDateString('pt-BR') : ''}</small></article>`).join('')
        : '<article class="achievement-card planned"><span class="achievement-state">Em campanha</span><div class="achievement-icon" aria-hidden="true">${bookIcon}</div><h3>Primeira missão</h3><p>Conclua sua primeira missão real para desbloquear a primeira medalha.</p></article>';
    } catch (_) {
      studySection.hidden = false;
      studyGrid.innerHTML = '<article class="achievement-card planned"><span class="achievement-state">Indisponível</span><div class="achievement-icon" aria-hidden="true">${bookIcon}</div><h3>Missão Bancária</h3><p>As conquistas de estudo estão temporariamente indisponíveis. Sua progressão de segurança continua normal.</p></article>';
    }
  }
})();
