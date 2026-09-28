'use strict';

(() => {
  if (window.StudyAssessmentUI) return;

  function create({ root, auth, onUpdated } = {}) {
    if (!root || !auth?.api) return null;
    const $ = (id) => root.querySelector('#' + id);
    const title = $('assessmentFocusTitle');
    const meta = $('assessmentFocusMeta');
    const status = $('assessmentFocusStatus');
    const list = $('assessmentQuestionList');
    const progress = $('assessmentProgress');
    const progressLabel = $('assessmentAnsweredLabel');
    const complete = $('completeAssessment');
    const close = $('leaveAssessment');
    const correction = $('assessmentCorrection');
    const correctionSummary = $('assessmentCorrectionSummary');
    const correctionList = $('assessmentCorrectionList');

    if (![title,meta,status,list,progress,progressLabel,complete,close,correction,correctionSummary,correctionList].every(Boolean)) return null;

    const state = {
      summary: null,
      runId: '',
      formId: '',
      questions: [],
      answered: new Map(),
      busy: false,
      generation: 0,
      completed: false
    };

    function text(node, value) { node.textContent = String(value ?? ''); }

    function setProgress() {
      const total = state.questions.length;
      const answered = state.answered.size;
      progress.setAttribute('aria-valuemax', String(total || 1));
      progress.setAttribute('aria-valuenow', String(answered));
      progress.setAttribute('aria-valuetext', `${answered} de ${total} questões respondidas`);
      const bar = progress.querySelector('span');
      if (bar) bar.style.width = total ? `${Math.round(answered / total * 100)}%` : '0%';
      text(progressLabel, `${answered} de ${total} questões respondidas`);
      complete.disabled = state.busy || state.completed || !state.runId || !total || answered !== total;
    }

    function assessmentPath(suffix = '') {
      return `/api/studies/assessments/${encodeURIComponent(state.summary.id)}${suffix}`;
    }

    function renderQuestions() {
      list.replaceChildren();
      for (const [index, question] of state.questions.entries()) {
        const card = document.createElement('article');
        card.className = 'study-question study-assessment-question';
        card.dataset.assessmentQuestionId = question.id;

        const prompt = document.createElement('strong');
        prompt.textContent = `${index + 1}. ${question.prompt}`;
        const fieldset = document.createElement('fieldset');
        const selected = state.answered.get(question.id);
        question.options.forEach((option, optionIndex) => {
          const label = document.createElement('label');
          label.className = 'study-option';
          const input = document.createElement('input');
          input.type = 'radio';
          input.name = `assessment-${question.id}`;
          input.value = String(optionIndex);
          input.checked = selected === optionIndex;
          input.disabled = selected !== undefined;
          const span = document.createElement('span');
          span.textContent = option;
          label.append(input, span);
          fieldset.append(label);
        });

        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.assessmentAnswer = question.id;
        button.textContent = selected === undefined ? 'Registrar resposta' : 'Resposta registrada';
        button.disabled = selected !== undefined;

        const feedback = document.createElement('div');
        feedback.className = 'study-feedback prior';
        feedback.hidden = selected === undefined;
        feedback.textContent = 'Resposta registrada. O gabarito será mostrado somente ao concluir a avaliação.';

        button.addEventListener('click', () => answer(question.id, card));
        card.append(prompt, fieldset, button, feedback);
        list.append(card);
      }
      setProgress();
    }

    async function answer(questionId, card) {
      if (!state.runId || state.busy || state.completed || state.answered.has(questionId)) return;
      const selected = card.querySelector('input:checked');
      if (!selected) {
        const feedback = card.querySelector('.study-feedback');
        feedback.hidden = false;
        feedback.className = 'study-feedback wrong';
        feedback.textContent = 'Escolha uma alternativa antes de registrar.';
        return;
      }

      const generation = state.generation;
      const value = Number(selected.value);
      const button = card.querySelector('button[data-assessment-answer]');
      state.busy = true;
      button.disabled = true;
      card.querySelectorAll('input').forEach((input) => { input.disabled = true; });
      setProgress();
      try {
        const result = await auth.api(assessmentPath(`/runs/${encodeURIComponent(state.runId)}/answers`), {
          method: 'POST',
          body: JSON.stringify({ questionId, selectedOption: value })
        });
        if (generation !== state.generation) return;
        if (Object.prototype.hasOwnProperty.call(result, 'correct') ||
            Object.prototype.hasOwnProperty.call(result, 'correctOption')) {
          throw new Error('O servidor revelou correção antes do fim da avaliação.');
        }
        state.answered.set(questionId, value);
        button.textContent = 'Resposta registrada';
        const feedback = card.querySelector('.study-feedback');
        feedback.hidden = false;
        feedback.className = 'study-feedback prior';
        feedback.textContent = 'Resposta registrada. O gabarito será mostrado somente ao concluir a avaliação.';
      } catch (error) {
        if (generation !== state.generation) return;
        button.disabled = false;
        card.querySelectorAll('input').forEach((input) => { input.disabled = false; });
        text(status, error.message || 'Não foi possível registrar a resposta.');
      } finally {
        if (generation === state.generation) {
          state.busy = false;
          renderQuestions();
        }
      }
    }

    function renderCorrections(result) {
      correction.hidden = false;
      list.hidden = true;
      progress.hidden = true;
      progressLabel.hidden = true;
      complete.hidden = true;
      const first = result.evidence?.firstScore;
      const latest = result.evidence?.latestScore;
      const attempts = Number(result.evidence?.attempts || 0);
      text(correctionSummary,
        `Resultado desta forma: ${result.score}%. Primeira tentativa: ${first ?? '—'}%. Tentativas concluídas: ${attempts}. Este resultado é evidência diagnóstica, não prontidão de prova.`
      );
      correctionList.replaceChildren();

      const questionMap = new Map(state.questions.map((question) => [question.id, question]));
      for (const [index, item] of (result.corrections || []).entries()) {
        const card = document.createElement('article');
        card.className = `study-assessment-correction ${item.correct ? 'correct' : 'wrong'}`;

        const heading = document.createElement('h3');
        const question = questionMap.get(item.questionId);
        heading.textContent = `${index + 1}. ${item.correct ? 'Acertou' : 'Revisar'} — ${question?.prompt || item.questionId}`;

        const explanation = document.createElement('p');
        explanation.textContent = item.explanation || '';

        const answer = document.createElement('p');
        const chosenText = question?.options?.[item.selectedOption] ?? `alternativa ${item.selectedOption + 1}`;
        const correctText = question?.options?.[item.correctOption] ?? `alternativa ${item.correctOption + 1}`;
        answer.textContent = item.correct
          ? `Sua resposta: ${chosenText}.`
          : `Sua resposta: ${chosenText}. Resposta correta: ${correctText}.`;

        card.append(heading, answer, explanation);
        if (Array.isArray(item.reviewTargets) && item.reviewTargets.length) {
          const review = document.createElement('p');
          review.className = 'study-assessment-review-target';
          review.textContent = 'Revisar no material: ' + item.reviewTargets
            .map((target) => `${target.missionTitle} — ${target.sectionTitle}`)
            .join('; ');
          card.append(review);
        }
        correctionList.append(card);
      }
    }

    async function finish() {
      if (state.busy || state.completed || !state.runId || state.answered.size !== state.questions.length) return;
      state.busy = true;
      complete.disabled = true;
      const generation = state.generation;
      text(status, 'Calculando o diagnóstico...');
      try {
        const result = await auth.api(assessmentPath(`/runs/${encodeURIComponent(state.runId)}/complete`), {
          method: 'POST',
          body: JSON.stringify({})
        });
        if (generation !== state.generation) return;
        state.completed = true;
        text(status, '');
        renderCorrections(result);
        if (typeof onUpdated === 'function') await onUpdated(result.evidence);
      } catch (error) {
        if (generation !== state.generation) return;
        text(status, error.message || 'Não foi possível concluir a avaliação.');
      } finally {
        if (generation === state.generation) {
          state.busy = false;
          setProgress();
        }
      }
    }

    async function open(summary) {
      if (!summary?.id || !summary.unlocked || state.busy) return false;
      state.generation += 1;
      const generation = state.generation;
      state.summary = summary;
      state.runId = '';
      state.formId = '';
      state.questions = [];
      state.answered.clear();
      state.completed = false;
      correction.hidden = true;
      list.hidden = false;
      progress.hidden = false;
      progressLabel.hidden = false;
      complete.hidden = false;
      list.replaceChildren();
      correctionList.replaceChildren();
      text(title, summary.title);
      text(meta, '12 questões novas. Sem consulta durante a tentativa; sem XP. Você pode sair e retomar esta mesma forma depois.');
      text(status, 'Abrindo avaliação...');
      root.hidden = false;
      document.body.style.overflow = 'hidden';
      try {
        const result = await auth.api(assessmentPath('/runs'), {
          method: 'POST',
          body: JSON.stringify({})
        });
        if (generation !== state.generation) return false;
        state.runId = result.runId;
        state.formId = result.formId;
        state.questions = Array.isArray(result.questions) ? result.questions : [];
        state.answered = new Map(Object.entries(result.answered || {}).map(([id, value]) => [id, Number(value)]));
        text(meta,
          `Forma ${state.formId} · ${state.questions.length} questões novas · sem XP. ${result.resumed ? 'Tentativa retomada.' : 'Nova tentativa.'} A correção aparece somente no final.`
        );
        text(status, '');
        renderQuestions();
        title.focus({ preventScroll: true });
        return true;
      } catch (error) {
        if (generation !== state.generation) return false;
        text(status, error.message || 'Não foi possível abrir a avaliação.');
        return false;
      }
    }

    function closePanel() {
      state.generation += 1;
      state.busy = false;
      root.hidden = true;
      document.body.style.overflow = '';
      return true;
    }

    complete.addEventListener('click', finish);
    close.addEventListener('click', closePanel);

    return Object.freeze({ open, close: closePanel, isOpen: () => !root.hidden });
  }

  window.StudyAssessmentUI = Object.freeze({ create });
})();
