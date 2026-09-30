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
    doubt: false,
    generation: 0,
    leaving: false,
    completing: false,
    pendingAnswers: new Set(),
    assessmentState: null,
    assessmentUnavailable: false,
    activeAssessment: null,
    assessmentAnswers: new Set(),
    assessmentPending: new Set(),
    assessmentCompleting: false
  };

  const $ = (id) => document.getElementById(id);
  const reader = window.StudyReader?.create($('studyFocus'), openReadingReference) || null;
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

  function resumableMission() {
    const resumable = state.data?.resumableSession;
    if (!resumable?.sessionId || !resumable?.missionId) return null;
    const mission = state.data?.missions?.find((item) => item.id === resumable.missionId) || null;
    if (!mission) return null;
    const review = resumable.reviewId ? { id: resumable.reviewId } : null;
    return { mission, review, resumable };
  }

  function retentionLabel(evidence) {
    if (!evidence || evidence.status === 'not_observed') return 'Retenção: sem revisão posterior';
    if (evidence.status === 'historical_unscored') {
      return `Retenção: ${evidence.completedCycles}/${evidence.totalCycles} revisões registradas · histórico sem nota isolável`;
    }
    const rawScore = evidence.latestScore;
    const hasScore = rawScore !== null && rawScore !== undefined && rawScore !== '' && Number.isFinite(Number(rawScore));
    const score = hasScore ? ` · última: ${rawScore}%` : '';
    return `Retenção: ${evidence.scoredCycles}/${evidence.totalCycles} revisões com resultado${score} · ${evidence.label.toLowerCase()}`;
  }

  function assessmentMessage(text) {
    const el = $('assessmentStatus');
    if (el) el.textContent = text || '';
  }

  function formatAssessmentDate(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString('pt-BR', {
      day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'
    });
  }

  function lessonLabel(id) {
    return state.data?.missions?.find((mission) => mission.id === id)?.shortTitle
      || state.data?.missions?.find((mission) => mission.id === id)?.title
      || id;
  }

  function renderAssessmentPanel() {
    const panel = $('assessmentPanel');
    if (!panel) return;
    const data = state.assessmentState;
    if (!data) {
      panel.hidden = true;
      return;
    }

    panel.hidden = false;
    const history = $('assessmentHistory');
    history.replaceChildren();
    for (const item of data.completed || []) {
      const chip = document.createElement('span');
      chip.className = 'study-assessment-chip';
      chip.textContent = `Forma ${item.formId}: ${item.score}% · ${formatAssessmentDate(item.completedAt)}`;
      history.append(chip);
    }

    const button = $('startAssessment');
    button.disabled = true;
    button.onclick = null;

    if (data.active) {
      $('assessmentMeta').textContent = `Forma ${data.active.formId} em andamento · ${data.active.answeredCount}/${data.active.total} respostas registradas.`;
      button.textContent = `Retomar Forma ${data.active.formId}`;
      button.disabled = false;
      button.onclick = startAssessment;
      return;
    }

    const studyResume = resumableMission();
    if (studyResume) {
      $('assessmentMeta').textContent = `Finalize ou encerre primeiro a sessão em andamento — ${studyResume.mission.shortTitle || studyResume.mission.title}.`;
      button.textContent = 'Sessão de estudo em andamento';
      return;
    }

    if (data.availableForm) {
      $('assessmentMeta').textContent = data.availableForm === 'A'
        ? 'Forma A disponível. São 16 questões inéditas, sem consulta e sem feedback até o encerramento.'
        : 'Forma B disponível após o intervalo mínimo. Ela usa outros 16 itens, sem repetir a Forma A.';
      button.textContent = `Iniciar Forma ${data.availableForm}`;
      button.disabled = false;
      button.onclick = startAssessment;
      return;
    }

    if (!data.prerequisitesComplete) {
      $('assessmentMeta').textContent = 'Disponível depois de concluir as oito aulas e o Chefe do primeiro bloco.';
      button.textContent = 'Avaliação ainda bloqueada';
      return;
    }

    if (data.nextEligibleAt) {
      const when = formatAssessmentDate(data.nextEligibleAt);
      $('assessmentMeta').textContent = when
        ? `Forma B ficará disponível a partir de ${when}.`
        : 'Forma B aguardando o intervalo mínimo de sete dias.';
      button.textContent = 'Aguardando Forma B';
      return;
    }

    $('assessmentMeta').textContent = 'As formas independentes disponíveis nesta versão já foram concluídas.';
    button.textContent = 'Formas concluídas';
  }

  async function loadAssessmentState(refreshDashboard = true) {
    try {
      state.assessmentState = await auth.api('/api/studies/assessments/banking.sfn-foundation', { method:'GET' });
      state.assessmentUnavailable = false;
      renderAssessmentPanel();
    } catch (_) {
      state.assessmentState = null;
      const supported = Number(state.data?.assessmentProtocol || 0) === 1;
      state.assessmentUnavailable = supported;
      const panel = $('assessmentPanel');
      if (panel) panel.hidden = !supported;
      if (supported) {
        if ($('assessmentMeta')) $('assessmentMeta').textContent = 'Não foi possível confirmar o estado da avaliação. As aulas ficam temporariamente bloqueadas para não quebrar o isolamento de uma forma eventualmente ativa.';
        if ($('startAssessment')) {
          $('startAssessment').disabled = true;
          $('startAssessment').onclick = null;
          $('startAssessment').textContent = 'Avaliação indisponível';
        }
        assessmentMessage('Tente novamente quando a conexão com a avaliação for restabelecida.');
      }
    }
    if (refreshDashboard && state.data) renderDashboard();
  }

  function updateAssessmentProgress() {
    const round = state.activeAssessment;
    if (!round) return;
    const total = round.questions?.length || 0;
    const answered = Math.min(total, state.assessmentAnswers.size);
    $('assessmentProgressLabel').textContent = `${answered} de ${total} respostas registradas`;
    const progress = $('assessmentProgress');
    progress.setAttribute('aria-valuenow', String(answered));
    progress.setAttribute('aria-valuemax', String(total));
    progress.setAttribute('aria-valuetext', `${answered} de ${total} respostas registradas`);
    $('assessmentProgressBar').style.width = total ? `${Math.round(answered / total * 100)}%` : '0%';
    $('completeAssessment').disabled = !total || answered < total || state.assessmentPending.size > 0 || state.assessmentCompleting;
  }

  function markAssessmentAnswered(card) {
    card.querySelectorAll('input').forEach((input) => { input.disabled = true; });
    const button = card.querySelector('[data-assessment-answer]');
    const feedback = card.querySelector('[data-assessment-feedback]');
    if (button) {
      button.disabled = true;
      button.textContent = 'Resposta registrada';
    }
    if (feedback) {
      feedback.hidden = false;
      feedback.textContent = 'Resposta registrada. A correção só aparece depois de encerrar a forma.';
    }
  }

  function renderAssessmentRound(round) {
    state.activeAssessment = round;
    state.assessmentAnswers = new Set(Array.isArray(round.answeredQuestionIds) ? round.answeredQuestionIds : []);
    state.assessmentPending.clear();
    state.assessmentCompleting = false;
    $('assessmentResult').hidden = true;
    $('assessmentResultSummary').textContent = '';
    $('assessmentDiagnostics').replaceChildren();
    $('assessmentReviewList').replaceChildren();
    $('completeAssessment').hidden = false;
    $('assessmentFocusTitle').textContent = `Forma ${round.formId} · Avaliação independente`;
    $('assessmentQuestionList').replaceChildren();

    round.questions.forEach((question, index) => {
      const card = document.createElement('article');
      card.className = 'study-assessment-question';
      card.dataset.assessmentQuestionId = question.id;

      const title = document.createElement('strong');
      title.textContent = `${index + 1}. ${question.prompt}`;
      const fieldset = document.createElement('fieldset');

      question.options.forEach((option, optionIndex) => {
        const label = document.createElement('label');
        label.className = 'study-assessment-option';
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `assessment-${question.id}`;
        input.value = String(optionIndex);
        const text = document.createElement('span');
        text.textContent = option;
        label.append(input, text);
        fieldset.append(label);
      });

      const save = document.createElement('button');
      save.type = 'button';
      save.dataset.assessmentAnswer = question.id;
      save.textContent = 'Registrar resposta';
      const feedback = document.createElement('div');
      feedback.className = 'study-assessment-feedback';
      feedback.dataset.assessmentFeedback = '';
      feedback.hidden = true;

      card.append(title, fieldset, save, feedback);
      $('assessmentQuestionList').append(card);

      save.addEventListener('click', () => answerAssessmentQuestion(question.id));
      if (state.assessmentAnswers.has(question.id)) markAssessmentAnswered(card);
    });

    updateAssessmentProgress();
  }

  async function startAssessment() {
    if (state.activeMission || state.leaving || state.activeAssessment || resumableMission()) return;
    const button = $('startAssessment');
    button.disabled = true;
    const previousText = button.textContent;
    button.textContent = 'Abrindo avaliação...';
    try {
      const round = await auth.api('/api/studies/assessments/banking.sfn-foundation/start', {
        method:'POST', body:'{}'
      });
      const topbar = document.querySelector('.study-topbar');
      if (topbar) topbar.inert = true;
      $('studyDashboard').hidden = true;
      $('studyAssessmentFocus').hidden = false;
      document.body.style.overflow = 'hidden';
      renderAssessmentRound(round);
      assessmentMessage('');
      $('assessmentFocusTitle').focus({ preventScroll:true });
    } catch (error) {
      assessmentMessage(error.message || 'Não foi possível abrir a avaliação independente.');
      await loadAssessmentState();
    } finally {
      button.textContent = previousText;
      renderAssessmentPanel();
    }
  }

  async function answerAssessmentQuestion(questionId) {
    const round = state.activeAssessment;
    if (!round || state.assessmentCompleting || state.assessmentPending.has(questionId) || state.assessmentAnswers.has(questionId)) return;
    const card = document.querySelector(`[data-assessment-question-id="${CSS.escape(questionId)}"]`);
    const selected = card?.querySelector('input:checked');
    const feedback = card?.querySelector('[data-assessment-feedback]');
    if (!selected) {
      if (feedback) {
        feedback.hidden = false;
        feedback.textContent = 'Escolha uma alternativa antes de registrar.';
      }
      return;
    }

    const button = card.querySelector('[data-assessment-answer]');
    button.disabled = true;
    state.assessmentPending.add(questionId);
    updateAssessmentProgress();
    try {
      const result = await auth.api(`/api/studies/assessments/${encodeURIComponent(round.assessmentId)}/answers`, {
        method:'POST',
        body:JSON.stringify({ questionId, selectedOption:Number(selected.value) })
      });
      if (result.questionId !== questionId) throw new Error('Confirmação de resposta inválida.');
      state.assessmentAnswers.add(questionId);
      markAssessmentAnswered(card);
      assessmentMessage('');
    } catch (error) {
      button.disabled = false;
      if (feedback) {
        feedback.hidden = false;
        feedback.textContent = error.message || 'Não foi possível confirmar a resposta.';
      }
    } finally {
      state.assessmentPending.delete(questionId);
      updateAssessmentProgress();
    }
  }

  function renderAssessmentResult(result) {
    $('assessmentResult').hidden = false;
    $('completeAssessment').hidden = true;
    $('assessmentResultSummary').textContent = `${result.score}% · ${result.correct}/${result.total} respostas corretas`;

    const diagnostics = $('assessmentDiagnostics');
    diagnostics.replaceChildren();
    for (const item of result.diagnostics || []) {
      const card = document.createElement('div');
      card.className = 'study-assessment-diagnostic';
      const labels = (item.lessonIds || []).map(lessonLabel).join(', ');
      card.textContent = `${labels || item.competencyId}: ${item.correct}/${item.total} · ${item.accuracy}%`;
      diagnostics.append(card);
    }

    if (Array.isArray(result.recommendedLessonIds) && result.recommendedLessonIds.length) {
      const card = document.createElement('div');
      card.className = 'study-assessment-diagnostic';
      card.textContent = 'Revisar: ' + result.recommendedLessonIds.map(lessonLabel).join(', ');
      diagnostics.append(card);
    }

    const questions = new Map((state.activeAssessment?.questions || []).map((question) => [question.id, question]));
    const list = $('assessmentReviewList');
    list.replaceChildren();
    (result.items || []).forEach((item, index) => {
      const question = questions.get(item.questionId);
      if (!question) return;
      const card = document.createElement('article');
      card.className = 'study-assessment-review-item';
      card.dataset.correct = String(item.correct);
      const title = document.createElement('strong');
      title.textContent = `${index + 1}. ${question.prompt}`;
      const chosen = document.createElement('p');
      chosen.textContent = `Sua resposta: ${question.options[item.selectedOption] ?? '—'}`;
      const correct = document.createElement('p');
      correct.textContent = `Resposta correta: ${question.options[item.correctOption] ?? '—'}`;
      const explanation = document.createElement('p');
      explanation.textContent = item.explanation || '';
      card.append(title, chosen, correct, explanation);
      list.append(card);
    });
    $('assessmentResult').scrollIntoView({ behavior:'smooth', block:'start' });
  }

  async function completeAssessment() {
    const round = state.activeAssessment;
    if (!round || state.assessmentCompleting || state.assessmentPending.size) return;
    if (state.assessmentAnswers.size < (round.questions?.length || 0)) return;
    state.assessmentCompleting = true;
    updateAssessmentProgress();
    assessmentMessage('Corrigindo a forma...');
    try {
      const result = await auth.api(`/api/studies/assessments/${encodeURIComponent(round.assessmentId)}/complete`, {
        method:'POST', body:'{}'
      });
      renderAssessmentResult(result);
      assessmentMessage('Forma concluída. O resultado não altera XP nem prontidão automaticamente.');
      await loadAssessmentState();
    } catch (error) {
      assessmentMessage(error.message || 'Não foi possível encerrar a avaliação.');
    } finally {
      state.assessmentCompleting = false;
      updateAssessmentProgress();
    }
  }

  async function leaveAssessment() {
    if (!state.activeAssessment) return;
    state.activeAssessment = null;
    state.assessmentAnswers.clear();
    state.assessmentPending.clear();
    state.assessmentCompleting = false;
    $('studyAssessmentFocus').hidden = true;
    $('studyDashboard').hidden = false;
    document.body.style.overflow = '';
    const topbar = document.querySelector('.study-topbar');
    if (topbar) topbar.inert = false;
    await loadAssessmentState();
    const target = $('startAssessment').disabled ? $('assessmentTitle') : $('startAssessment');
    target.focus?.({ preventScroll:true });
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
    const recurringCard = $('metricRecurringErrorsCard');
    if (recurringCard) {
      const supported = Number(data.errorPatternProtocol || 0) === 1;
      recurringCard.hidden = !supported;
      if (supported) $('metricRecurringErrors').textContent = String(Math.max(0, Number(m.recurringErrors || 0)));
    }
    const domainCard = $('metricRecentDomainCard');
    if (domainCard) {
      const supported = Number(data.domainProtocol || 0) === 1;
      domainCard.hidden = !supported;
      if (supported) {
        const rawScore = data.recentDomain?.overallScore;
        const score = rawScore === null || rawScore === undefined || rawScore === '' ? NaN : Number(rawScore);
        const measured = Number.isFinite(score);
        $('metricRecentDomain').textContent = measured ? `${score}%` : '—';
        $('metricRecentDomainMeta').textContent = measured
          ? `${data.recentDomain?.observedTopics || 0}/${data.recentDomain?.totalTopics || data.missions.length} tópicos com evidência`
          : 'Ainda não medido';
      }
    }
    const streak = m.streak || { current:0, best:0, lastStudyDay:'' };
    $('metricStreak').textContent = `${streak.current} ${streak.current === 1 ? 'dia' : 'dias'}`;
    $('metricBestStreak').textContent = `Melhor: ${streak.best} ${streak.best === 1 ? 'dia' : 'dias'}`;
    $('availabilityLabel').textContent = `${m.publishedMissions}/${m.plannedMissions} missões deste bloco publicadas`;
    $('personalProgressLabel').textContent = `${m.completedPublished}/${m.publishedMissions} missões concluídas · ${m.availableCompletion}% do bloco publicado`;
    setBar('availabilityBar', m.campaignAvailability);
    setBar('personalProgressBar', m.availableCompletion);
    const releaseNotice = $('contentReleaseNotice');
    if (releaseNotice) {
      const supported = Number(data.publicationProtocol || 0) === 1;
      releaseNotice.hidden = !supported;
      if (supported) {
        const publication = data.publication || {};
        const messages = [];
        const newCount = Math.max(0, Number(publication.newCount || 0));
        const revisionCount = Math.max(0, Number(publication.revisionRecommendedCount || 0));
        if (newCount) messages.push(`${newCount} ${newCount === 1 ? 'nova missão disponível' : 'novas missões disponíveis'}`);
        if (revisionCount) messages.push(`${revisionCount} ${revisionCount === 1 ? 'revisão conceitual recomendada' : 'revisões conceituais recomendadas'}`);
        releaseNotice.textContent = messages.length
          ? messages.join(' · ')
          : 'Nenhum conteúdo novo ou revisão conceitual pendente.';
      }
    }
    renderCurriculum(data.curriculum);

    const activeAssessment = state.assessmentState?.active || null;
    const assessmentUnavailable = state.assessmentUnavailable === true;
    const review = Array.isArray(data.reviews) && data.reviews.length ? data.reviews[0] : null;
    const reviewPanel = $('reviewPanel');
    if (reviewPanel) {
      reviewPanel.hidden = !review;
      if (review) {
        $('reviewTitle').textContent = `Revisão ${review.cycle}: ${review.title}`;
        const due = formatReviewDue(review.dueAt);
        $('reviewMeta').textContent = assessmentUnavailable
          ? 'A revisão aguarda a confirmação do estado da avaliação independente.'
          : activeAssessment
            ? `Retome primeiro a Forma ${activeAssessment.formId} da avaliação independente.`
            : due
            ? `Vencida desde ${due}. Refaça a minibatalha para consolidar o conteúdo.`
            : 'Refaça a minibatalha para consolidar o conteúdo.';
        $('startReview').disabled = assessmentUnavailable || Boolean(activeAssessment);
        $('startReview').onclick = assessmentUnavailable || activeAssessment ? null : () => openMission(review.missionId, review);
      } else {
        $('startReview').disabled = true;
        $('startReview').onclick = null;
      }
    }

    const resume = resumableMission();
    const grid = $('missionGrid');
    grid.innerHTML = data.missions.map((mission, index) => {
      const done = completed(mission);
      const unlocked = isUnlocked(index);
      const progress = data.progress[mission.topicId];
      const evidence = data.learningEvidence?.[mission.topicId];
      const pedagogical = data.pedagogicalStates?.[mission.topicId];
      const recurring = data.recurringErrors?.[mission.topicId];
      const recurringLabel = Number(data.errorPatternProtocol || 0) === 1
        ? `Erros recorrentes ativos: ${Math.max(0, Number(recurring?.count || 0))}`
        : '';
      const recentDomain = data.recentDomain?.byTopic?.[mission.topicId];
      const rawDomainScore = recentDomain?.score;
      const domainScore = rawDomainScore === null || rawDomainScore === undefined || rawDomainScore === ''
        ? NaN
        : Number(rawDomainScore);
      const domainLabel = Number(data.domainProtocol || 0) === 1
        ? Number.isFinite(domainScore)
          ? `Domínio recente: ${domainScore}% · ${recentDomain.label}`
          : 'Domínio recente: ainda não medido'
        : '';
      const boss = mission.kind === 'boss';
      const isActive = resume?.mission.id === mission.id;
      const blockedByActive = Boolean(resume && !isActive);
      const blockedByAssessment = Boolean(activeAssessment);
      const label = assessmentUnavailable ? 'Aguardando estado da avaliação'
        : blockedByAssessment ? `Retome avaliação · Forma ${activeAssessment.formId}`
        : isActive ? 'Sessão em andamento'
          : done ? 'Concluída'
            : unlocked && !blockedByActive ? (boss ? 'Chefe disponível' : 'Disponível')
              : blockedByActive ? 'Retome a sessão atual' : 'Bloqueada';
      const requirement = boss && mission.passScore ? ` · mínimo ${mission.passScore}%` : '';
      const disabled = assessmentUnavailable || blockedByAssessment || (!isActive && (!unlocked || blockedByActive));
      return `<button class="study-mission ${done ? 'done' : ''} ${boss ? 'boss' : ''}" type="button" data-mission-id="${mission.id}" ${disabled ? 'disabled' : ''}>
        <span class="state">${label}</span>
        <h3>${mission.order}. ${mission.title}</h3>
        <p>${mission.estimatedMinutes} min · +${mission.xp} XP${requirement}</p>
        ${pedagogical ? `<p>Etapa pedagógica: ${pedagogical.label}</p>` : ''}
        ${recurringLabel ? `<p>${recurringLabel}</p>` : ''}
        ${domainLabel ? `<p>${domainLabel}</p>` : ''}
        <p>${progress ? `Acerto nas tentativas: ${Math.round(progress.masteryScore || 0)}%` : 'Ainda não iniciada'}</p>
        <p>${retentionLabel(evidence)}</p>
      </button>`;
    }).join('');

    grid.querySelectorAll('[data-mission-id]').forEach((button) => {
      const mission = data.missions.find((item) => item.id === button.dataset.missionId);
      const pedagogical = data.pedagogicalStates?.[mission?.topicId];
      if (pedagogical?.id === 'consolidated' && pedagogical.explanation) {
        const explanation = document.createElement('p');
        explanation.textContent = pedagogical.explanation;
        button.append(explanation);
      }
      button.addEventListener('click', () => {
        if (resume?.mission.id === button.dataset.missionId) resumeMission(resume);
        else openMission(button.dataset.missionId);
      });
    });

    const next = nextMission();
    $('continueStudy').disabled = assessmentUnavailable || (!activeAssessment && !resume && !next);
    $('continueStudy').textContent = assessmentUnavailable
      ? 'Aguardando confirmação da avaliação'
      : activeAssessment
        ? `Retomar avaliação: Forma ${activeAssessment.formId}`
        : resume
        ? `Retomar: ${resume.mission.shortTitle}`
        : next ? `Continuar: ${next.shortTitle}` : 'Conteúdo atual concluído';
    $('continueStudy').onclick = assessmentUnavailable
      ? null
      : activeAssessment
        ? startAssessment
        : resume
        ? () => resumeMission(resume)
        : next ? () => openMission(next.id) : null;
  }

  async function load() {
    status('Carregando seu progresso...');
    try {
      state.data = await auth.api('/api/studies/bootstrap', { method: 'GET' });
      // O estado da avaliação é carregado antes de liberar a grade para impedir
      // uma janela de consulta entre o bootstrap e a descoberta de uma forma ativa.
      await loadAssessmentState(false);
      renderDashboard();
      status(state.assessmentUnavailable
        ? 'Não foi possível confirmar o estado da avaliação independente. As aulas permanecem bloqueadas até a reconexão.'
        : '');
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
        <div data-question-prompt></div>
        <fieldset>${question.options.map((option, optionIndex) =>
          `<label class="study-option"><input type="radio" name="${question.id}" value="${optionIndex}"><span>${option}</span></label>`
        ).join('')}</fieldset>
        <button type="button" data-answer-question="${question.id}">Responder</button>
        <div class="study-feedback" data-feedback hidden></div>
      </article>`
    ).join('');
    for (const [index, question] of mission.questions.entries()) {
      const target = $('questionList').children[index].querySelector('[data-question-prompt]');
      const heading = document.createElement('strong');
      heading.textContent = `${index + 1}. ${question.presentation ? 'Leia o caso e os dados:' : question.prompt}`;
      target.append(heading);
      if (question.presentation && !window.StudyReader?.renderContent(target, question.presentation, openReadingReference)) {
        const fallback = document.createElement('p'); fallback.textContent = question.prompt; target.append(fallback);
      }
    }
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

  function startTimer(supportsCheckpoints, initialSeconds = 0) {
    if (clock) clock.start(state.sessionId, supportsCheckpoints, initialSeconds);
    else {
      $('studyTimer').textContent = '—';
      if ($('studyTimerStatus')) $('studyTimerStatus').textContent = 'Cronômetro indisponível; atualize a página.';
    }
  }

  function enterFocus(mission, review = null) {
    const generation = ++state.generation;
    state.activeMission = mission;
    state.activeReview = review;
    state.sessionId = '';
    clock?.reset();
    state.completing = false;
    state.pendingAnswers.clear();
    state.answered.clear();
    state.doubt = false;
    $('studyTimer').textContent = '00:00';
    $('markDoubt').textContent = 'Marcar dúvida';
    const topbar = document.querySelector('.study-topbar');
    if (topbar) topbar.inert = true;
    $('studyDashboard').hidden = true;
    $('studyFocus').hidden = false;
    document.body.style.overflow = 'hidden';
    renderMission(mission);
    return generation;
  }

  function restoreRoundAnswers(questionIds = []) {
    const valid = new Set(state.activeMission?.questions?.map((question) => question.id) || []);
    for (const questionId of Array.isArray(questionIds) ? questionIds : []) {
      if (!valid.has(questionId)) continue;
      state.answered.set(questionId, 'resume');
      const card = document.querySelector(`[data-question-id="${CSS.escape(questionId)}"]`);
      if (!card) continue;
      card.querySelectorAll('input').forEach((input) => { input.disabled = true; });
      const button = card.querySelector('[data-answer-question]');
      const feedback = card.querySelector('[data-feedback]');
      if (button) { button.disabled = true; button.textContent = 'Respondida'; }
      if (feedback) {
        feedback.hidden = false;
        feedback.className = 'study-feedback prior';
        feedback.textContent = 'Resposta já registrada nesta sessão. Continue de onde parou.';
      }
    }
    updateFocusProgress();
  }

  function resumeMission(entry = resumableMission()) {
    if (!entry || state.activeMission || state.leaving || state.assessmentUnavailable || state.assessmentState?.active) return;
    const { mission, review, resumable } = entry;
    const generation = enterFocus(mission, review);
    state.sessionId = resumable.sessionId;
    restoreRoundAnswers(resumable.answeredQuestionIds);
    startTimer(state.data?.timeProtocol === 1 && state.data?.resumeProtocol === 1, resumable.durationSeconds || 0);
    status('Sessão recuperada. Continue de onde parou; o tempo anterior já confirmado foi preservado.', true);
    if (generation !== state.generation) return;
  }

  async function openMission(id, review = null) {
    if (state.activeMission || state.leaving) return;
    if (state.assessmentUnavailable) {
      status('Aguarde a confirmação do estado da avaliação independente antes de abrir uma aula.');
      $('assessmentPanel')?.scrollIntoView({ behavior:'smooth', block:'center' });
      return;
    }
    if (state.assessmentState?.active) {
      status(`Retome a Forma ${state.assessmentState.active.formId} da avaliação independente antes de consultar uma missão.`);
      $('assessmentPanel')?.scrollIntoView({ behavior:'smooth', block:'center' });
      return;
    }
    const mission = state.data?.missions?.find((item) => item.id === id);
    if (!mission) return;
    const generation = enterFocus(mission, review);
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
      startTimer(response.timeProtocol === 1);
      updateFocusProgress();
      status('', true);
    } catch (error) {
      if (generation !== state.generation) return;
      state.sessionId = '';
      updateFocusProgress();
      status('A rodada não foi registrada. Você pode ler a aula; saia e reabra para responder. ' + error.message, true);
    }
  }

  function renderAttemptFeedback(card, questionId, result) {
    const feedback = card?.querySelector('[data-feedback]');
    if (!feedback) return;
    feedback.hidden = false;
    feedback.className = `study-feedback ${result.correct ? 'correct' : 'wrong'}`;
    feedback.replaceChildren();

    const line = (label, text) => {
      if (!text) return;
      const paragraph = document.createElement('p');
      if (label) {
        const strong = document.createElement('strong');
        strong.textContent = label;
        paragraph.append(strong);
      }
      paragraph.append(document.createTextNode(String(text)));
      feedback.append(paragraph);
    };

    const mission = state.activeMission;
    const question = mission?.questions?.find((item) => item.id === questionId);
    if (result.correct) {
      line('', `Correto. ${result.explanation || ''}`);
    } else {
      line('', 'Ainda não.');
      line('Por que sua escolha não funciona: ', result.selectedFeedback || '');
      const correctIndex = Number(result.correctOption);
      const correctText = Number.isInteger(correctIndex) ? question?.options?.[correctIndex] : '';
      line('Resposta correta: ', correctText || '');
      line('Por que é correta: ', result.explanation || '');
    }

    const refs = Array.isArray(result.reviewRefs) ? result.reviewRefs : [];
    const localSections = [...new Set(refs
      .filter((ref) => ref?.missionId === mission?.id && typeof ref.sectionId === 'string')
      .map((ref) => ref.sectionId))];

    if (localSections.length) {
      const links = document.createElement('div');
      links.className = 'study-feedback-review-links';
      const label = document.createElement('span');
      label.textContent = 'Rever conceito:';
      links.append(label);
      for (const sectionId of localSections) {
        const section = mission.sections?.find((item) => item.id === sectionId);
        if (!section) continue;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'study-feedback-review';
        button.textContent = section.heading;
        button.addEventListener('click', () => reader?.openSection(sectionId));
        links.append(button);
      }
      if (links.querySelector('button')) feedback.append(links);
    }

    const externalRefs = [...new Map(refs
      .filter((ref) => ref?.missionId && ref.missionId !== mission?.id && typeof ref.sectionId === 'string')
      .map((ref) => [`${ref.missionId}:${ref.sectionId}`, ref])).values()];
    if (externalRefs.length) {
      const links = document.createElement('div'); links.className = 'study-feedback-review-links';
      for (const ref of externalRefs) {
        const targetMission = state.data?.missions?.find((item) => item.id === ref.missionId);
        const targetSection = targetMission?.sections?.find((item) => item.id === ref.sectionId);
        if (!targetMission || !targetSection) continue;
        const button = document.createElement('button'); button.type = 'button'; button.className = 'study-feedback-review';
        button.textContent = `Consultar ${targetMission.shortTitle || targetMission.title}: ${targetSection.heading}`;
        button.addEventListener('click', () => openReadingReference(ref)); links.append(button);
      }
      if (links.children.length) feedback.append(links);
    }
  }

  function openReadingReference(ref) {
    const current = state.activeMission;
    const target = state.data?.missions?.find(item => item.id === ref.missionId);
    if (!current || !target || state.leaving || Number(target.order) > Number(current.order)) return;
    if (target.id === current.id) reader?.openSection(ref.sectionId);
    else reader?.showReference(target, ref.sectionId, ref.wholeLesson === true);
  }

  async function markReadingComplete() {
    if (Number(state.data?.pedagogyProtocol || 0) !== 1) return;
    if (!state.sessionId || !state.activeMission || state.activeReview || state.leaving) return;

    const sessionId = state.sessionId;
    const generation = state.generation;
    const mission = state.activeMission;
    try {
      const receipt = await auth.api(`/api/studies/sessions/${encodeURIComponent(sessionId)}/reading-complete`, {
        method: 'POST', body: '{}'
      });
      if (generation !== state.generation || sessionId !== state.sessionId) return;
      if (!state.data.progress) state.data.progress = {};
      const previous = state.data.progress[mission.topicId] || {};
      state.data.progress[mission.topicId] = {
        ...previous,
        coverageState: Math.max(Number(previous.coverageState || 0), Number(receipt.coverageState || 1))
      };
      if (!state.data.pedagogicalStates) state.data.pedagogicalStates = {};
      state.data.pedagogicalStates[mission.topicId] = {
        id: 'practice',
        label: 'Prática',
        explanation: 'A leitura foi encerrada nesta etapa e a sessão está em prática.'
      };
    } catch (_) {
      if (generation === state.generation && sessionId === state.sessionId) {
        status('A prática continua disponível, mas não foi possível registrar agora a conclusão da leitura.', true);
      }
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
      renderAttemptFeedback(card, questionId, result);
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
    const durationSeconds = clock?.stop().durationSeconds || 0;
    state.sessionId = '';
    updateFocusProgress();
    const saved = await finishSession(sessionId, durationSeconds);
    document.body.style.overflow = '';
    $('studyFocus').hidden = true;
    $('studyDashboard').hidden = false;
    const topbar = document.querySelector('.study-topbar');
    if (topbar) topbar.inert = false;
    state.activeMission = null;
    state.activeReview = null;
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

  $('studyPracticeButton')?.addEventListener('click', markReadingComplete);
  $('leaveFocus').addEventListener('click', leaveFocus);
  $('completeMission').addEventListener('click', completeMission);
  $('leaveAssessment').addEventListener('click', leaveAssessment);
  $('completeAssessment').addEventListener('click', completeAssessment);
  $('markDoubt').addEventListener('click', () => {
    state.doubt = !state.doubt;
    $('markDoubt').textContent = state.doubt ? 'Dúvida marcada' : 'Marcar dúvida';
  });

  await load();
})();
