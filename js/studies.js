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
    activeReview: null,
    answered: new Map(),
    sessionId: '',
    sessionStartedAt: 0,
    timer: null,
    doubt: false
  };

  const $ = (id) => document.getElementById(id);
  const reader = window.StudyReader?.create($('studyFocus')) || null;
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

  function formatReviewDue(value) {
    if (!value) return '';
    const normalized = String(value).includes('T') ? String(value) : String(value).replace(' ', 'T') + 'Z';
    const date = new Date(normalized);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
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
    const streak = m.streak || { current:0, best:0, lastStudyDay:'' };
    $('metricStreak').textContent = `${streak.current} ${streak.current === 1 ? 'dia' : 'dias'}`;
    $('metricBestStreak').textContent = `Melhor: ${streak.best} ${streak.best === 1 ? 'dia' : 'dias'}`;
    $('availabilityLabel').textContent = `${m.publishedMissions}/${m.plannedMissions} missões · ${m.campaignAvailability}%`;
    $('personalProgressLabel').textContent = `${m.completedPublished}/${m.plannedMissions} da campanha · ${m.campaignProgress}% · ${m.availableCompletion}% do conteúdo liberado`;
    setBar('availabilityBar', m.campaignAvailability);
    setBar('personalProgressBar', m.campaignProgress);

    const review = Array.isArray(data.reviews) && data.reviews.length ? data.reviews[0] : null;
    const reviewPanel = $('reviewPanel');
    if (reviewPanel) {
      reviewPanel.hidden = !review;
      if (review) {
        $('reviewTitle').textContent = `Revisão ${review.cycle}: ${review.title}`;
        const due = formatReviewDue(review.dueAt);
        $('reviewMeta').textContent = due
          ? `Vencida desde ${due}. Refaça a minibatalha para consolidar o conteúdo.`
          : 'Refaça a minibatalha para consolidar o conteúdo.';
        $('startReview').onclick = () => openMission(review.missionId, review);
      } else {
        $('startReview').onclick = null;
      }
    }

    const grid = $('missionGrid');
    grid.innerHTML = data.missions.map((mission, index) => {
      const done = completed(mission);
      const unlocked = isUnlocked(index);
      const progress = data.progress[mission.topicId];
      const boss = mission.kind === 'boss';
      const label = done ? 'Concluída' : unlocked ? (boss ? 'Chefe disponível' : 'Disponível') : 'Bloqueada';
      const requirement = boss && mission.passScore ? ` · mínimo ${mission.passScore}%` : '';
      return `<button class="study-mission ${done ? 'done' : ''} ${boss ? 'boss' : ''}" type="button" data-mission-id="${mission.id}" ${unlocked ? '' : 'disabled'}>
        <span class="state">${label}</span>
        <h3>${mission.order}. ${mission.title}</h3>
        <p>${mission.estimatedMinutes} min · +${mission.xp} XP${requirement}</p>
        <p>${progress ? `Acerto nas tentativas: ${Math.round(progress.masteryScore || 0)}%` : 'Ainda não iniciada'}</p>
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

  function historicalAnsweredFor(mission) {
    if (!mission || state.activeReview || mission.kind === 'boss') return [];
    const items = state.data?.attemptedQuestions?.[mission.topicId];
    if (!Array.isArray(items)) return [];
    const valid = new Set(mission.questions.map((question) => question.id));
    return items.filter((id) => valid.has(id));
  }

  function updateFocusProgress() {
    const total = state.activeMission?.questions?.length || 0;
    const answered = Math.min(total, state.answered.size);
    const percent = window.StudyReader?.practiceProgress(answered, total).percent
      ?? (total ? Math.round(answered / total * 100) : 0);
    setBar('focusProgress', percent);
    const progress = $('studyPracticeProgress');
    if (progress) {
      progress.setAttribute('aria-valuenow', String(answered));
      progress.setAttribute('aria-valuemax', String(total));
      progress.setAttribute('aria-valuetext', `${answered} de ${total} questões respondidas`);
    }
    if ($('studyAnsweredLabel')) $('studyAnsweredLabel').textContent = `${answered} de ${total} questões respondidas`;
    $('completeMission').disabled = total === 0 || answered < total;
  }

  function renderMission(mission) {
    const boss = mission.kind === 'boss';
    $('focusTitle').textContent = state.activeReview
      ? `Revisão · ${mission.title}`
      : boss
        ? `Chefe · ${mission.title}`
        : mission.title;
    $('focusObjective').textContent = mission.objective;
    // Fallback linear permanece utilizável se o módulo de navegação não carregar.
    const reading = document.createDocumentFragment();
    for (const section of mission.sections) {
      const node = document.createElement('section');
      node.className = 'study-section';
      const heading = document.createElement('h2');
      heading.textContent = section.heading;
      const paragraph = document.createElement('p');
      paragraph.textContent = section.body;
      node.append(heading, paragraph);
      reading.append(node);
    }
    $('lessonSections').replaceChildren(reading);
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
      `<a class="study-source" href="${source.url}" target="_blank" rel="noopener noreferrer">Abrir fonte: ${source.label}</a>`
    ).join('');
    $('completeMission').textContent = state.activeReview
      ? 'Concluir revisão'
      : mission.kind === 'boss'
        ? 'Tentar vencer o Chefe'
        : 'Concluir missão';

    for (const questionId of historicalAnsweredFor(mission)) {
      state.answered.set(questionId, 'history');
      const card = document.querySelector(`[data-question-id="${CSS.escape(questionId)}"]`);
      if (!card) continue;
      const button = card.querySelector('[data-answer-question]');
      const feedback = card.querySelector('[data-feedback]');
      if (button) button.textContent = 'Responder novamente';
      if (feedback) {
        feedback.hidden = false;
        feedback.className = 'study-feedback prior';
        feedback.textContent = 'Respondida em sessão anterior. Você pode continuar ou responder novamente para revisar.';
      }
    }

    $('questionList').querySelectorAll('[data-answer-question]').forEach((button) => {
      button.addEventListener('click', () => answerQuestion(button.dataset.answerQuestion));
    });
    reader?.mount(mission);
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

  async function openMission(id, review = null) {
    const mission = state.data?.missions?.find((item) => item.id === id);
    if (!mission) return;
    state.activeMission = mission;
    state.activeReview = review;
    state.answered.clear();
    state.doubt = false;
    $('markDoubt').textContent = 'Marcar dúvida';
    const topbar = document.querySelector('.study-topbar');
    if (topbar) topbar.inert = true;
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
    if (state.answered.has(questionId) && state.answered.get(questionId) !== 'history') return;
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
      button.textContent = 'Respondida';
      const feedback = card.querySelector('[data-feedback]');
      feedback.hidden = false;
      feedback.className = `study-feedback ${result.correct ? 'correct' : 'wrong'}`;
      feedback.textContent = `${result.correct ? 'Correto. ' : 'Ainda não. '}${result.explanation}`;
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
    const topbar = document.querySelector('.study-topbar');
    if (topbar) topbar.inert = false;
    state.activeMission = null;
    state.activeReview = null;
    await load();
    const returnTarget = $('continueStudy').disabled ? $('studyGreeting') : $('continueStudy');
    returnTarget.tabIndex = returnTarget.tabIndex < 0 ? -1 : returnTarget.tabIndex;
    returnTarget.focus({ preventScroll: true });
  }

  async function completeMission() {
    if (!state.activeMission) return;
    $('completeMission').disabled = true;
    try {
      const review = state.activeReview;
      const endpoint = review
        ? `/api/studies/reviews/${encodeURIComponent(review.id)}/complete`
        : `/api/studies/missions/${encodeURIComponent(state.activeMission.id)}/complete`;
      const result = await auth.api(endpoint, { method: 'POST', body: '{}' });
      if (result.newAchievements?.length) showAchievement(result.newAchievements[0]);
      status(
        review
          ? `Revisão concluída. +${result.xpGranted || 0} XP.`
          : state.activeMission.kind === 'boss'
            ? `Chefe vencido com ${result.score}% de acertos. +${result.xpGranted || 0} XP.`
            : `Missão concluída. +${result.xpGranted || 0} XP.`,
        true
      );
      setTimeout(() => leaveFocus(), 900);
    } catch (error) {
      $('completeMission').disabled = false;
      status(
        error.message || (state.activeReview ? 'Não foi possível concluir a revisão.' : 'Não foi possível concluir a missão.'),
        true
      );
    }
  }

  function showAchievement(item) {
    const toast = $('achievementToast');
    toast.innerHTML = `<strong>CONQUISTA DESBLOQUEADA</strong><br><b>${item.title}</b><br><span>${item.description}</span>`;
    toast.hidden = false;
    setTimeout(() => { toast.hidden = true; }, 5000);
  }

  $('leaveFocus').addEventListener('click', leaveFocus);
  $('completeMission').addEventListener('click', completeMission);
  $('markDoubt').addEventListener('click', () => {
    state.doubt = !state.doubt;
    $('markDoubt').textContent = state.doubt ? 'Dúvida marcada' : 'Marcar dúvida';
  });

  await load();
})();
