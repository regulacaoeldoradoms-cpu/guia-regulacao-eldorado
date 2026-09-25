'use strict';

(async () => {
  const auth = window.RegulationAuth;
  const user = await auth.requireRole([]);
  if (!user) return;
  if (String(user.username || '').toLowerCase() !== 'wellyton') {
    location.replace('/ferramentas/?estudos=acesso-negado');
    return;
  }

  const state = {
    data: null,
    activeMission: null,
    answered: new Map(),
    sessionId: '',
    sessionStartedAt: 0,
    timer: null,
    doubt: false
  };

  const $ = (id) => document.getElementById(id);
  const status = (text, focus = false) => {
    const el = $(focus ? 'focusStatus' : 'studyStatus');
    if (el) el.textContent = text || '';
  };

  $('portalUserName').textContent = user.name || user.username || 'Wellyton';
  $('portalUserRole').textContent = 'Missão Bancária';
  $('portalLogout')?.addEventListener('click', async () => {
    await auth.logout();
    location.replace('/login/');
  });

  function formatHours(seconds) {
    const total = Math.max(0, Number(seconds || 0));
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    return `${hours}h${String(minutes).padStart(2, '0')}`;
  }

  function setBar(id, value) {
    const el = $(id);
    if (el) el.style.width = `${Math.max(0, Math.min(100, Number(value || 0)))}%`;
  }

  function completed(mission) {
    return Number(state.data?.progress?.[mission.topicId]?.coverageState || 0) >= 3;
  }

  function isUnlocked(index) {
    if (index === 0) return true;
    return completed(state.data.missions[index - 1]);
  }

  function nextMission() {
    return state.data?.missions?.find((mission, index) => !completed(mission) && isUnlocked(index)) || null;
  }

  function renderDashboard() {
    const data = state.data;
    if (!data) return;
    const m = data.metrics;
    $('studyGreeting').textContent = `${data.user.name || 'Wellyton'}, sua campanha começou.`;
    $('metricLevel').textContent = `Nível ${m.level}`;
    $('metricLevelTitle').textContent = m.levelTitle;
    $('metricXp').textContent = String(m.xp);
    $('metricNextXp').textContent = m.nextLevelXp ? `${m.nextLevelXp - m.xp} XP para o próximo nível` : 'Nível máximo atual';
    $('metricQuestions').textContent = String(m.questions);
    $('metricAccuracy').textContent = `${m.accuracy}% de acertos`;
    $('metricHours').textContent = formatHours(m.hoursSeconds);
    $('metricReviews').textContent = `${m.reviewsDue} revisões pendentes`;
    $('availabilityLabel').textContent = `${m.publishedMissions}/${m.plannedMissions} missões · ${m.campaignAvailability}%`;
    $('personalProgressLabel').textContent = `${m.completedPublished}/${m.publishedMissions} concluídas · ${m.availableProgress}%`;
    setBar('availabilityBar', m.campaignAvailability);
    setBar('personalProgressBar', m.availableProgress);

    const grid = $('missionGrid');
    grid.innerHTML = data.missions.map((mission, index) => {
      const done = completed(mission);
      const unlocked = isUnlocked(index);
      const progress = data.progress[mission.topicId];
      const label = done ? '✅ Concluída' : unlocked ? '🔓 Disponível' : '🔒 Bloqueada';
      return `<button class="study-mission ${done ? 'done' : ''}" type="button" data-mission-id="${mission.id}" ${unlocked ? '' : 'disabled'}>
        <span class="state">${label}</span>
        <h3>${mission.order}. ${mission.title}</h3>
        <p>${mission.estimatedMinutes} min · +${mission.xp} XP</p>
        <p>${progress ? `Domínio atual: ${Math.round(progress.masteryScore || 0)}%` : 'Ainda não iniciada'}</p>
      </button>`;
    }).join('');

    grid.querySelectorAll('[data-mission-id]').forEach((button) => {
      button.addEventListener('click', () => openMission(button.dataset.missionId));
    });

    const next = nextMission();
    $('continueStudy').disabled = !next;
    $('continueStudy').textContent = next ? `Continuar: ${next.shortTitle}` : 'Conteúdo atual concluído';
    $('continueStudy').onclick = next ? () => openMission(next.id) : null;
  }

  async function load() {
    status('Carregando seu progresso...');
    try {
      state.data = await auth.api('/api/studies/bootstrap', { method: 'GET' });
      renderDashboard();
      status('');
    } catch (error) {
      status(error.message || 'Não foi possível carregar a Missão Bancária.');
    }
  }

  function updateFocusProgress() {
    const total = state.activeMission?.questions?.length || 1;
    const answered = state.answered.size;
    setBar('focusProgress', Math.min(100, 35 + (answered / total) * 65));
    $('completeMission').disabled = answered < total;
  }

  function renderMission(mission) {
    $('focusTitle').textContent = mission.title;
    $('focusObjective').textContent = mission.objective;
    $('lessonSections').innerHTML = mission.sections.map((section) =>
      `<section class="study-section"><h2>${section.heading}</h2><p>${section.body}</p></section>`
    ).join('');
    $('recallList').innerHTML = mission.recall.map((item) =>
      `<div class="study-recall-item">${item}</div>`
    ).join('');
    $('questionList').innerHTML = mission.questions.map((question, index) =>
      `<article class="study-question" data-question-id="${question.id}">
        <strong>${index + 1}. ${question.prompt}</strong>
        <fieldset>${question.options.map((option, optionIndex) =>
          `<label class="study-option"><input type="radio" name="${question.id}" value="${optionIndex}"><span>${option}</span></label>`
        ).join('')}</fieldset>
        <button type="button" data-answer-question="${question.id}">Responder</button>
        <div class="study-feedback" data-feedback hidden></div>
      </article>`
    ).join('');
    $('sourceList').innerHTML = mission.sources.map((source) =>
      `<a class="study-source" href="${source.url}" target="_blank" rel="noopener noreferrer">↗ ${source.label}</a>`
    ).join('');

    $('questionList').querySelectorAll('[data-answer-question]').forEach((button) => {
      button.addEventListener('click', () => answerQuestion(button.dataset.answerQuestion));
    });
    updateFocusProgress();
  }

  function startTimer() {
    clearInterval(state.timer);
    state.sessionStartedAt = Date.now();
    const paint = () => {
      const sec = Math.floor((Date.now() - state.sessionStartedAt) / 1000);
      $('studyTimer').textContent = `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
    };
    paint();
    state.timer = setInterval(paint, 1000);
  }

  async function openMission(id) {
    const mission = state.data?.missions?.find((item) => item.id === id);
    if (!mission) return;
    state.activeMission = mission;
    state.answered.clear();
    state.doubt = false;
    $('markDoubt').textContent = 'Marcar dúvida';
    $('studyDashboard').hidden = true;
    $('studyFocus').hidden = false;
    document.body.style.overflow = 'hidden';
    renderMission(mission);
    status('', true);
    try {
      const response = await auth.api('/api/studies/sessions', {
        method: 'POST', body: JSON.stringify({ missionId: mission.id })
      });
      state.sessionId = response.sessionId || '';
      startTimer();
    } catch (error) {
      state.sessionId = '';
      startTimer();
      status('O cronômetro local está ativo, mas a sessão não foi registrada: ' + error.message, true);
    }
  }

  async function answerQuestion(questionId) {
    if (state.answered.has(questionId)) return;
    const card = document.querySelector(`[data-question-id="${CSS.escape(questionId)}"]`);
    const selected = card?.querySelector('input:checked');
    if (!selected) {
      const feedback = card?.querySelector('[data-feedback]');
      feedback.hidden = false;
      feedback.className = 'study-feedback wrong';
      feedback.textContent = 'Escolha uma alternativa antes de responder.';
      return;
    }
    const button = card.querySelector('[data-answer-question]');
    button.disabled = true;
    try {
      const result = await auth.api('/api/studies/attempts', {
        method: 'POST',
        body: JSON.stringify({ questionId, selectedOption: Number(selected.value) })
      });
      state.answered.set(questionId, result.correct);
      card.querySelectorAll('input').forEach((input) => { input.disabled = true; });
      const feedback = card.querySelector('[data-feedback]');
      feedback.hidden = false;
      feedback.className = `study-feedback ${result.correct ? 'correct' : 'wrong'}`;
      feedback.textContent = `${result.correct ? '✅ Correto. ' : '❌ Ainda não. '}${result.explanation}`;
      updateFocusProgress();
    } catch (error) {
      button.disabled = false;
      status(error.message || 'Não foi possível registrar a resposta.', true);
    }
  }

  async function finishSession() {
    if (!state.sessionId) return;
    const durationSeconds = Math.max(0, Math.floor((Date.now() - state.sessionStartedAt) / 1000));
    try {
      await auth.api(`/api/studies/sessions/${encodeURIComponent(state.sessionId)}`, {
        method: 'PATCH', body: JSON.stringify({ durationSeconds })
      });
    } catch (_) {}
    state.sessionId = '';
  }

  async function leaveFocus() {
    clearInterval(state.timer);
    await finishSession();
    document.body.style.overflow = '';
    $('studyFocus').hidden = true;
    $('studyDashboard').hidden = false;
    state.activeMission = null;
    await load();
  }

  async function completeMission() {
    if (!state.activeMission) return;
    $('completeMission').disabled = true;
    try {
      const result = await auth.api(`/api/studies/missions/${encodeURIComponent(state.activeMission.id)}/complete`, {
        method: 'POST', body: '{}'
      });
      if (result.newAchievements?.length) showAchievement(result.newAchievements[0]);
      status(`Missão concluída. +${result.xpGranted || 0} XP.`, true);
      setTimeout(() => leaveFocus(), 900);
    } catch (error) {
      $('completeMission').disabled = false;
      status(error.message || 'Não foi possível concluir a missão.', true);
    }
  }

  function showAchievement(item) {
    const toast = $('achievementToast');
    toast.innerHTML = `<strong>🏆 CONQUISTA DESBLOQUEADA</strong><br><b>${item.title}</b><br><span>${item.description}</span>`;
    toast.hidden = false;
    setTimeout(() => { toast.hidden = true; }, 5000);
  }

  $('leaveFocus').addEventListener('click', leaveFocus);
  $('completeMission').addEventListener('click', completeMission);
  $('markDoubt').addEventListener('click', () => {
    state.doubt = !state.doubt;
    $('markDoubt').textContent = state.doubt ? 'Dúvida marcada ✓' : 'Marcar dúvida';
  });

  await load();
})();
