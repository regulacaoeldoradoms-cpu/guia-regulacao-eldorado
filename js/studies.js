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
    resumedAnswers: new Map(),
    sessionId: '',
    markerProtocol: 0,
    doubt: false,
    generation: 0,
    leaving: false,
    completing: false,
    pendingAnswers: new Set()
  };

  const $ = (id) => document.getElementById(id);
  let markerTimer = 0;
  let markerPending = null;
  let markerBusy = null;
  const reader = window.StudyReader?.create($('studyFocus'), { onMarker: queueMarker }) || null;
  const clock = window.StudyClock?.create({
    root: $('studyFocus'),
    send: (sessionId, durationSeconds) => auth.api(`/api/studies/sessions/${encodeURIComponent(sessionId)}/checkpoint`, {
      method: 'POST', body: JSON.stringify({ durationSeconds })
    })
  }) || null;
  const status = (text, focus = false) => {
    const el = $(focus ? 'focusStatus' : 'studyStatus');
    if (el) el.textContent = text || '';
  };

  function queueMarker(marker) {
    if (!marker || !state.sessionId || state.markerProtocol !== 1 || state.leaving) return;
    markerPending = {
      sessionId: state.sessionId,
      marker: {
        view: marker.view === 'practice' ? 'practice' : 'lesson',
        sectionId: String(marker.sectionId || ''),
        allSections: marker.allSections === true
      }
    };
    window.clearTimeout(markerTimer);
    markerTimer = window.setTimeout(() => { void flushMarker(); }, 250);
  }

  function flushMarker() {
    window.clearTimeout(markerTimer);
    markerTimer = 0;
    if (markerBusy) return markerBusy;
    if (!markerPending) return Promise.resolve(true);
    markerBusy = (async () => {
      let ok = true;
      while (markerPending) {
        const pending = markerPending;
        markerPending = null;
        if (!pending.sessionId || pending.sessionId !== state.sessionId) continue;
        try {
          const receipt = await auth.api(
            `/api/studies/sessions/${encodeURIComponent(pending.sessionId)}/marker`,
            { method: 'POST', body: JSON.stringify(pending.marker) }
          );
          if (!receipt || receipt.markerSaved !== true || receipt.markerProtocol !== 1
            || receipt.sessionId !== pending.sessionId) {
            throw new Error('Confirmação de marcador inválida');
          }
        } catch (_) {
          ok = false;
          status('A posição da leitura ainda não foi confirmada. O conteúdo e as respostas continuam salvos.', true);
          break;
        }
      }
      return ok;
    })().finally(() => {
      markerBusy = null;
      if (markerPending && state.sessionId) window.setTimeout(() => { void flushMarker(); }, 0);
    });
    return markerBusy;
  }

  function resetMarkerQueue() {
    window.clearTimeout(markerTimer);
    markerTimer = 0;
    markerPending = null;
  }

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

  function formatClock(seconds) {
    const total = Math.max(0, Math.floor(Number(seconds || 0)));
    const minutes = Math.floor(total / 60);
    const remainder = total % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
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

  function renderCurriculum(curriculum) {
    const panel = document.querySelector('.study-course-map');
    if (!panel) return;
    if (!curriculum || !Array.isArray(curriculum.areas)) {
      panel.hidden = true;
      return;
    }
    panel.hidden = false;
    $('courseBasis').textContent = curriculum.basis || 'Mapa curricular em atualização.';
    $('courseAvailabilityLabel').textContent = `${curriculum.publishedBlocks}/${curriculum.totalBlocks} blocos · ${curriculum.startedAreas}/${curriculum.totalAreas} áreas iniciadas`;
    $('courseProgressLabel').textContent = `${curriculum.completedBlocks}/${curriculum.totalBlocks} blocos concluídos · ${curriculum.completedAreas}/${curriculum.totalAreas} áreas integralmente cobertas`;
    setBar('courseAvailabilityBar', curriculum.availabilityPercent);
    setBar('courseProgressBar', curriculum.progressPercent);
    $('readinessLabel').textContent = curriculum.readiness?.label || 'Ainda não medida';
    $('readinessExplanation').textContent = curriculum.readiness?.explanation
      || 'Prontidão exige cobertura curricular, retenção e simulados representativos.';

    const list = $('courseAreaList');
    const fragment = document.createDocumentFragment();
    for (const item of curriculum.areas) {
      const card = document.createElement('article');
      card.className = 'study-course-area';
      const stateName = item.completed ? 'completed' : item.started ? 'started' : 'planned';
      card.dataset.state = stateName;
      const title = document.createElement('strong');
      title.textContent = item.title;
      const detail = document.createElement('span');
      detail.textContent = item.completed
        ? `${item.completedBlocks}/${item.totalBlocks} blocos · área coberta no mapa-base`
        : item.started
          ? `${item.publishedBlocks}/${item.totalBlocks} blocos com material · em construção`
          : `${item.totalBlocks} blocos planejados · ainda sem material publicado`;
      card.append(title, detail);
      fragment.append(card);
    }
    list.replaceChildren(fragment);
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

  function retentionLabel(evidence) {
    if (!evidence || evidence.status === 'not_observed') return 'Retenção: sem revisão posterior';
    if (evidence.status === 'historical_unscored') {
      return `Retenção: ${evidence.completedCycles}/${evidence.totalCycles} revisões registradas · histórico sem nota isolável`;
    }
    const score = Number.isFinite(Number(evidence.latestScore)) ? ` · última: ${evidence.latestScore}%` : '';
    return `Retenção: ${evidence.scoredCycles}/${evidence.totalCycles} revisões com resultado${score} · ${evidence.label.toLowerCase()}`;
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
    $('availabilityLabel').textContent = `${m.publishedMissions}/${m.plannedMissions} missões deste bloco publicadas`;
    $('personalProgressLabel').textContent = `${m.completedPublished}/${m.publishedMissions} missões concluídas · ${m.availableCompletion}% do bloco publicado`;
    setBar('availabilityBar', m.campaignAvailability);
    setBar('personalProgressBar', m.availableCompletion);
    renderCurriculum(data.curriculum);

    const active = data.activeSession || null;
    const resumeMission = active ? data.missions.find((mission) => mission.id === active.missionId) : null;
    const resumePanel = $('resumePanel');
    if (resumePanel) {
      resumePanel.hidden = !active;
      if (active) {
        $('resumeTitle').textContent = active.resumable
          ? `Retomar: ${active.title || resumeMission?.shortTitle || resumeMission?.title || 'sessão anterior'}`
          : 'Sessão anterior precisa ser encerrada';
        $('resumeMeta').textContent = active.resumable
          ? `Último checkpoint confirmado: ${formatClock(active.durationSeconds)}. Você continua na mesma rodada, sem criar outra sessão.`
          : (active.reason || 'Esta sessão não pode mais ser retomada com segurança.');
        $('resumeSession').hidden = !active.resumable;
        $('resumeSession').disabled = !active.resumable;
        $('resumeSession').onclick = active.resumable ? resumeActiveSession : null;
        $('discardSession').disabled = false;
        $('discardSession').onclick = discardActiveSession;
      } else {
        $('resumeSession').onclick = null;
        $('discardSession').onclick = null;
      }
    }

    const review = Array.isArray(data.reviews) && data.reviews.length ? data.reviews[0] : null;
    const reviewPanel = $('reviewPanel');
    if (reviewPanel) {
      reviewPanel.hidden = !review || Boolean(active);
      if (review && !active) {
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
      const unlocked = !active && isUnlocked(index);
      const progress = data.progress[mission.topicId];
      const evidence = data.learningEvidence?.[mission.topicId];
      const boss = mission.kind === 'boss';
      const label = done ? 'Concluída' : unlocked ? (boss ? 'Chefe disponível' : 'Disponível') : 'Bloqueada';
      const requirement = boss && mission.passScore ? ` · mínimo ${mission.passScore}%` : '';
      return `<button class="study-mission ${done ? 'done' : ''} ${boss ? 'boss' : ''}" type="button" data-mission-id="${mission.id}" ${unlocked ? '' : 'disabled'}>
        <span class="state">${label}</span>
        <h3>${mission.order}. ${mission.title}</h3>
        <p>${mission.estimatedMinutes} min · +${mission.xp} XP${requirement}</p>
        <p>${progress ? `Acerto nas tentativas: ${Math.round(progress.masteryScore || 0)}%` : 'Ainda não iniciada'}</p>
        <p>${retentionLabel(evidence)}</p>
      </button>`;
    }).join('');

    grid.querySelectorAll('[data-mission-id]').forEach((button) => {
      button.addEventListener('click', () => openMission(button.dataset.missionId));
    });

    const next = nextMission();
    if (active) {
      $('continueStudy').disabled = !active.resumable;
      $('continueStudy').textContent = active.resumable
        ? `Retomar: ${active.title || resumeMission?.shortTitle || resumeMission?.title || 'sessão'}`
        : 'Encerre a sessão anterior';
      $('continueStudy').onclick = active.resumable ? resumeActiveSession : null;
    } else {
      $('continueStudy').disabled = !next;
      $('continueStudy').textContent = next ? `Continuar: ${next.shortTitle}` : 'Conteúdo atual concluído';
      $('continueStudy').onclick = next ? () => openMission(next.id) : null;
    }
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
    $('completeMission').disabled = total === 0 || answered < total || !state.sessionId
      || state.leaving || state.completing || state.pendingAnswers.size > 0;
  }

  function renderMission(mission, marker = null) {
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

    for (const answer of state.resumedAnswers.values()) {
      const questionId = answer.questionId;
      const card = document.querySelector(`[data-question-id="${CSS.escape(questionId)}"]`);
      if (!card) continue;
      const input = card.querySelector(`input[value="${String(answer.selectedOption)}"]`);
      if (input) input.checked = true;
      card.querySelectorAll('input').forEach((item) => { item.disabled = true; });
      const button = card.querySelector('[data-answer-question]');
      if (button) {
        button.disabled = true;
        button.textContent = 'Respondida';
      }
      const feedback = card.querySelector('[data-feedback]');
      if (feedback) {
        feedback.hidden = false;
        feedback.className = `study-feedback ${answer.correct ? 'correct' : 'wrong'}`;
        feedback.textContent = `${answer.correct ? 'Correto. ' : 'Ainda não. '}${answer.explanation || ''}`;
      }
      state.answered.set(questionId, Boolean(answer.correct));
    }

    $('questionList').querySelectorAll('[data-answer-question]').forEach((button) => {
      button.addEventListener('click', () => answerQuestion(button.dataset.answerQuestion));
    });
    reader?.mount(mission, marker);
    updateFocusProgress();
  }

  function startTimer(supportsCheckpoints, initialSeconds = 0) {
    if (clock) clock.start(state.sessionId, supportsCheckpoints, initialSeconds);
    else {
      $('studyTimer').textContent = '—';
      if ($('studyTimerStatus')) $('studyTimerStatus').textContent = 'Cronômetro indisponível; atualize a página.';
    }
  }

  function resumeActiveSession() {
    if (state.activeMission || state.leaving) return;
    const active = state.data?.activeSession;
    if (!active?.resumable) {
      status(active?.reason || 'Esta sessão não pode ser retomada.');
      return;
    }
    const mission = state.data?.missions?.find((item) => item.id === active.missionId);
    if (!mission) {
      status('O conteúdo desta sessão não está disponível nesta versão.');
      return;
    }

    ++state.generation;
    state.activeMission = mission;
    state.activeReview = active.review || null;
    state.sessionId = active.sessionId;
    state.markerProtocol = state.data?.markerProtocol === 1 ? 1 : 0;
    resetMarkerQueue();
    state.completing = false;
    state.pendingAnswers.clear();
    state.answered.clear();
    state.resumedAnswers = new Map((active.answers || []).map((answer) => [answer.questionId, answer]));
    state.doubt = false;
    clock?.reset();
    $('studyTimer').textContent = formatClock(active.durationSeconds);
    $('markDoubt').textContent = 'Marcar dúvida';
    const topbar = document.querySelector('.study-topbar');
    if (topbar) topbar.inert = true;
    $('studyDashboard').hidden = true;
    $('studyFocus').hidden = false;
    document.body.style.overflow = 'hidden';
    renderMission(mission, active.marker || null);
    startTimer(state.data?.timeProtocol === 1, active.durationSeconds);
    status('Sessão retomada do último checkpoint confirmado.', true);
    $('focusTitle')?.focus({ preventScroll: true });
  }

  async function discardActiveSession() {
    const active = state.data?.activeSession;
    if (!active || state.leaving) return;
    $('resumeSession').disabled = true;
    $('discardSession').disabled = true;
    status('Encerrando a sessão anterior...');
    const saved = await finishSession(active.sessionId, active.durationSeconds || 0);
    if (!saved) {
      $('resumeSession').disabled = !active.resumable;
      $('discardSession').disabled = false;
      status('Não foi possível encerrar a sessão anterior. Tente novamente.');
      return;
    }
    await load();
    status('Sessão anterior encerrada. O tempo já confirmado foi preservado.');
  }

  async function openMission(id, review = null) {
    if (state.activeMission || state.leaving) return;
    if (state.data?.activeSession) {
      status('Há uma sessão anterior aberta. Retome ou encerre essa sessão antes de iniciar outra.');
      return;
    }
    const mission = state.data?.missions?.find((item) => item.id === id);
    if (!mission) return;
    const generation = ++state.generation;
    state.activeMission = mission;
    state.activeReview = review;
    state.sessionId = '';
    state.markerProtocol = 0;
    resetMarkerQueue();
    clock?.reset();
    state.completing = false;
    state.pendingAnswers.clear();
    state.answered.clear();
    state.resumedAnswers.clear();
    state.doubt = false;
    $('studyTimer').textContent = '00:00';
    $('markDoubt').textContent = 'Marcar dúvida';
    const topbar = document.querySelector('.study-topbar');
    if (topbar) topbar.inert = true;
    $('studyDashboard').hidden = true;
    $('studyFocus').hidden = false;
    document.body.style.overflow = 'hidden';
    renderMission(mission);
    status('Registrando a rodada. A leitura já está disponível.', true);
    try {
      const response = await auth.api('/api/studies/sessions', {
        method: 'POST', body: JSON.stringify({ missionId: mission.id, reviewId: review?.id || null })
      });
      if (generation !== state.generation) {
        // A abertura terminou depois de sair: encerrar somente a sessão antiga.
        if (response.sessionId) await finishSession(response.sessionId, 0);
        return;
      }
      if (!response.sessionId) throw new Error('Identificador da rodada não recebido.');
      state.sessionId = response.sessionId;
      state.markerProtocol = response.markerProtocol === 1 ? 1 : 0;
      startTimer(response.timeProtocol === 1);
      if (state.markerProtocol === 1 && reader?.snapshot) queueMarker(reader.snapshot());
      updateFocusProgress();
      status('', true);
    } catch (error) {
      if (generation !== state.generation) return;
      state.sessionId = '';
      updateFocusProgress();
      status('A rodada não foi registrada. Você pode ler a aula; saia e reabra para responder. ' + error.message, true);
    }
  }

  async function answerQuestion(questionId) {
    if (!state.sessionId || state.leaving || state.completing) {
      status('Aguarde o registro da rodada antes de responder.', true);
      return;
    }
    if (state.pendingAnswers.has(questionId)) return;
    const sessionId = state.sessionId;
    const generation = state.generation;
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
    card.querySelectorAll('input').forEach((input) => { input.disabled = true; });
    state.pendingAnswers.add(questionId);
    updateFocusProgress();
    try {
      const result = await auth.api('/api/studies/attempts', {
        method: 'POST',
        body: JSON.stringify({ questionId, selectedOption: Number(selected.value), sessionId })
      });
      if (generation !== state.generation || sessionId !== state.sessionId) return;
      state.answered.set(questionId, result.correct);
      card.querySelectorAll('input').forEach((input) => { input.disabled = true; });
      button.textContent = 'Respondida';
      const feedback = card.querySelector('[data-feedback]');
      feedback.hidden = false;
      feedback.className = `study-feedback ${result.correct ? 'correct' : 'wrong'}`;
      feedback.textContent = `${result.correct ? 'Correto. ' : 'Ainda não. '}${result.explanation}`;
      updateFocusProgress();
    } catch (error) {
      if (generation !== state.generation || sessionId !== state.sessionId) return;
      button.disabled = false;
      button.textContent = 'Tentar registrar novamente';
      // A requisição pode ter sido gravada antes da perda da resposta: manter a
      // seleção e repetir o mesmo payload, sem criar uma segunda tentativa.
      status(error.message || 'Não foi possível confirmar a resposta. Tente registrar novamente.', true);
    } finally {
      if (generation === state.generation && sessionId === state.sessionId) {
        state.pendingAnswers.delete(questionId);
        updateFocusProgress();
      }
    }
  }

  async function finishSession(sessionId, durationSeconds) {
    if (!sessionId) return true;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        await auth.api(`/api/studies/sessions/${encodeURIComponent(sessionId)}`, {
          method: 'PATCH', body: JSON.stringify({ durationSeconds })
        });
        return true;
      } catch (_) { /* Uma repetição idempotente, com o mesmo identificador. */ }
    }
    return false;
  }

  async function leaveFocus() {
    if (state.leaving || !state.activeMission) return;
    state.leaving = true;
    ++state.generation;
    const sessionId = state.sessionId;
    await flushMarker();
    const durationSeconds = clock?.stop().durationSeconds || 0;
    state.sessionId = '';
    state.markerProtocol = 0;
    resetMarkerQueue();
    updateFocusProgress();
    const saved = await finishSession(sessionId, durationSeconds);
    document.body.style.overflow = '';
    $('studyFocus').hidden = true;
    $('studyDashboard').hidden = false;
    const topbar = document.querySelector('.study-topbar');
    if (topbar) topbar.inert = false;
    state.activeMission = null;
    state.activeReview = null;
    state.resumedAnswers.clear();
    state.pendingAnswers.clear();
    state.completing = false;
    await load();
    state.leaving = false;
    if (!saved) status('Não foi possível confirmar o salvamento do tempo desta sessão. As respostas já registradas não foram apagadas.');
    const returnTarget = $('continueStudy').disabled ? $('studyGreeting') : $('continueStudy');
    returnTarget.tabIndex = returnTarget.tabIndex < 0 ? -1 : returnTarget.tabIndex;
    returnTarget.focus({ preventScroll: true });
  }

  async function completeMission() {
    if (!state.activeMission || !state.sessionId || state.completing || state.leaving || state.pendingAnswers.size) return;
    state.completing = true;
    const mission = state.activeMission;
    const review = state.activeReview;
    const sessionId = state.sessionId;
    const generation = state.generation;
    updateFocusProgress();
    try {
      const endpoint = review
        ? `/api/studies/reviews/${encodeURIComponent(review.id)}/complete`
        : `/api/studies/missions/${encodeURIComponent(mission.id)}/complete`;
      const result = await auth.api(endpoint, { method: 'POST', body: JSON.stringify({ sessionId }) });
      if (generation !== state.generation || sessionId !== state.sessionId) return;
      if (result.newAchievements?.length) showAchievement(result.newAchievements[0]);
      status(
        review
          ? `Revisão concluída. +${result.xpGranted || 0} XP.`
          : mission.kind === 'boss'
            ? `Chefe vencido com ${result.score}% de acertos. +${result.xpGranted || 0} XP.`
            : `Missão concluída. +${result.xpGranted || 0} XP.`,
        true
      );
      setTimeout(() => {
        if (generation === state.generation && sessionId === state.sessionId) leaveFocus();
      }, 900);
    } catch (error) {
      if (generation !== state.generation || sessionId !== state.sessionId) return;
      state.completing = false;
      updateFocusProgress();
      status(error.message || 'Não foi possível confirmar a conclusão. Tente novamente.', true);
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
