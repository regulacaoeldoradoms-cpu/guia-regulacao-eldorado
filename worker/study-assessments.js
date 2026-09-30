'use strict';

import {
  ASSESSMENT_VERSION,
  BLOCK_ID,
  BLOCK_CONTENT_VERSION,
  FORM_SIZE,
  REQUIRED_PROGRESS_TOPIC_IDS,
  assessmentQuestionById,
  assessmentQuestionsForForm,
  publicAssessmentQuestion
} from './studies-assessment-content/sfn-foundation-v1.js';

export class StudyAssessmentError extends Error {
  constructor(message, status = 409, code = 'STUDY_ASSESSMENT_CONFLICT') {
    super(message);
    this.name = 'StudyAssessmentError';
    this.status = status;
    this.code = code;
  }
}

const fail = (message, status = 409, code = 'STUDY_ASSESSMENT_CONFLICT') => {
  throw new StudyAssessmentError(message, status, code);
};
const assessmentKey = (value) => typeof value === 'string' && /^[a-f0-9-]{36}$/i.test(value);

export async function ensureAssessmentSchema(db) {
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS study_assessment_rounds (
      assessment_id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      block_id TEXT NOT NULL,
      form_id TEXT NOT NULL CHECK(form_id IN ('A','B')),
      assessment_version INTEGER NOT NULL,
      content_version INTEGER NOT NULL,
      question_ids TEXT NOT NULL,
      started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      completed_at TEXT,
      score REAL,
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','completed','invalidated')),
      result_json TEXT
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS study_assessment_answers (
      assessment_id TEXT NOT NULL REFERENCES study_assessment_rounds(assessment_id),
      question_id TEXT NOT NULL,
      selected_option INTEGER NOT NULL,
      correct INTEGER NOT NULL CHECK(correct IN (0,1)),
      answered_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (assessment_id, question_id)
    )`),
    db.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS idx_study_assessment_active
      ON study_assessment_rounds(username, block_id) WHERE status='active'`),
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_study_assessment_history
      ON study_assessment_rounds(username, block_id, assessment_version, form_id, completed_at)`)
  ]);
}

async function invalidateIncompatibleActive(db, username) {
  await db.prepare(`UPDATE study_assessment_rounds
    SET status='invalidated'
    WHERE username=? AND block_id=? AND status='active'
      AND (assessment_version<>? OR content_version<>?)`)
    .bind(username, BLOCK_ID, ASSESSMENT_VERSION, BLOCK_CONTENT_VERSION).run();
}

async function prerequisiteCoverage(db, username) {
  const placeholders = REQUIRED_PROGRESS_TOPIC_IDS.map(() => '?').join(',');
  const row = await db.prepare(`SELECT COUNT(*) AS total
    FROM study_topic_progress
    WHERE username=? AND coverage_state>=3 AND topic_id IN (${placeholders})`)
    .bind(username, ...REQUIRED_PROGRESS_TOPIC_IDS).first();
  return Number(row?.total || 0);
}

function parseQuestionIds(row) {
  let ids;
  try { ids = JSON.parse(row?.question_ids || '[]'); } catch { fail('Conjunto da avaliação indisponível.'); }
  if (!Array.isArray(ids) || ids.length !== FORM_SIZE || new Set(ids).size !== ids.length) {
    fail('Conjunto da avaliação indisponível.');
  }
  for (const id of ids) {
    const item = assessmentQuestionById(id);
    if (!item || item.formId !== row.form_id) fail('A avaliação mudou. Inicie uma nova rodada.');
  }
  return ids;
}

async function completedRounds(db, username) {
  const result = await db.prepare(`SELECT assessment_id, form_id, started_at, completed_at, score
    FROM study_assessment_rounds
    WHERE username=? AND block_id=? AND assessment_version=? AND content_version=? AND status='completed'
    ORDER BY completed_at ASC`)
    .bind(username, BLOCK_ID, ASSESSMENT_VERSION, BLOCK_CONTENT_VERSION).all();
  return result.results || [];
}

async function activeRound(db, username) {
  return db.prepare(`SELECT assessment_id, form_id, assessment_version, content_version,
      question_ids, started_at, completed_at, score, status, result_json
    FROM study_assessment_rounds
    WHERE username=? AND block_id=? AND status='active'
      AND assessment_version=? AND content_version=?
    ORDER BY started_at DESC LIMIT 1`)
    .bind(username, BLOCK_ID, ASSESSMENT_VERSION, BLOCK_CONTENT_VERSION).first();
}

async function answeredIds(db, assessmentId) {
  const result = await db.prepare(`SELECT question_id FROM study_assessment_answers
    WHERE assessment_id=? ORDER BY answered_at, question_id`).bind(assessmentId).all();
  return (result.results || []).map((row) => String(row.question_id || '')).filter(Boolean);
}

function sevenDaysAfter(value) {
  const text = String(value || '').trim();
  if (!text) return '';
  const iso = text.includes('T') ? text : text.replace(' ', 'T') + 'Z';
  const time = Date.parse(iso);
  if (!Number.isFinite(time)) return '';
  return new Date(time + 7 * 86400000).toISOString();
}

export async function getAssessmentState(db, username, now = new Date()) {
  await invalidateIncompatibleActive(db, username);
  const [active, completed, covered] = await Promise.all([
    activeRound(db, username),
    completedRounds(db, username),
    prerequisiteCoverage(db, username)
  ]);

  const formA = completed.find((row) => row.form_id === 'A') || null;
  const formB = completed.find((row) => row.form_id === 'B') || null;
  const prerequisitesComplete = covered === REQUIRED_PROGRESS_TOPIC_IDS.length;
  let availableForm = null;
  let nextEligibleAt = '';

  if (active) {
    availableForm = active.form_id;
  } else if (prerequisitesComplete && !formA) {
    availableForm = 'A';
  } else if (prerequisitesComplete && formA && !formB) {
    nextEligibleAt = sevenDaysAfter(formA.completed_at);
    const eligibleAt = Date.parse(nextEligibleAt);
    if (Number.isFinite(eligibleAt) && now.getTime() >= eligibleAt) availableForm = 'B';
  }

  const activeAnswered = active ? await answeredIds(db, active.assessment_id) : [];
  return {
    blockId: BLOCK_ID,
    assessmentVersion: ASSESSMENT_VERSION,
    contentVersion: BLOCK_CONTENT_VERSION,
    prerequisitesComplete,
    availableForm,
    nextEligibleAt: availableForm === 'B' ? '' : nextEligibleAt,
    completed: completed.map((row) => ({
      assessmentId: row.assessment_id,
      formId: row.form_id,
      startedAt: row.started_at,
      completedAt: row.completed_at,
      score: Number(row.score || 0),
      total: FORM_SIZE
    })),
    active: active ? {
      assessmentId: active.assessment_id,
      formId: active.form_id,
      startedAt: active.started_at,
      answeredCount: activeAnswered.length,
      total: FORM_SIZE
    } : null
  };
}

async function roundForUser(db, username, assessmentId) {
  if (!assessmentKey(assessmentId)) fail('Avaliação inválida.', 400, 'STUDY_ASSESSMENT_INVALID');
  const row = await db.prepare(`SELECT * FROM study_assessment_rounds
    WHERE assessment_id=? AND username=? AND block_id=? LIMIT 1`)
    .bind(assessmentId, username, BLOCK_ID).first();
  if (!row) fail('Avaliação não encontrada.', 404, 'STUDY_ASSESSMENT_NOT_FOUND');
  return row;
}

function publicRound(row, answeredQuestionIds = []) {
  const ids = parseQuestionIds(row);
  return {
    assessmentId: row.assessment_id,
    blockId: BLOCK_ID,
    formId: row.form_id,
    assessmentVersion: Number(row.assessment_version),
    contentVersion: Number(row.content_version),
    startedAt: row.started_at,
    answeredQuestionIds,
    questions: ids.map((id) => publicAssessmentQuestion(assessmentQuestionById(id)))
  };
}

export async function startIndependentAssessment(db, username, now = new Date()) {
  await invalidateIncompatibleActive(db, username);
  const active = await activeRound(db, username);
  if (active) return publicRound(active, await answeredIds(db, active.assessment_id));

  const state = await getAssessmentState(db, username, now);
  if (!state.prerequisitesComplete) {
    fail('Conclua as oito aulas e o Chefe deste bloco antes da avaliação independente.', 409, 'STUDY_ASSESSMENT_PREREQUISITE_REQUIRED');
  }
  if (!state.availableForm) {
    if (state.nextEligibleAt) {
      fail('A Forma B ainda não está disponível. Aguarde o intervalo mínimo após a Forma A.', 409, 'STUDY_ASSESSMENT_INTERVAL_REQUIRED');
    }
    fail('Não há nova forma independente disponível nesta versão.', 409, 'STUDY_ASSESSMENT_NOT_AVAILABLE');
  }

  const formId = state.availableForm;
  const questions = assessmentQuestionsForForm(formId);
  if (questions.length !== FORM_SIZE) fail('Banco independente indisponível.', 503, 'STUDY_ASSESSMENT_CONTENT_INVALID');
  const id = crypto.randomUUID();
  const ids = questions.map((item) => item.id);

  const inserted = await db.prepare(`INSERT OR IGNORE INTO study_assessment_rounds(
      assessment_id, username, block_id, form_id, assessment_version, content_version, question_ids
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`)
    .bind(id, username, BLOCK_ID, formId, ASSESSMENT_VERSION, BLOCK_CONTENT_VERSION, JSON.stringify(ids)).run();

  if (Number(inserted.meta?.changes || 0) === 0) {
    const concurrent = await activeRound(db, username);
    if (concurrent) return publicRound(concurrent, await answeredIds(db, concurrent.assessment_id));
    fail('Não foi possível confirmar o início da avaliação.', 409, 'STUDY_ASSESSMENT_START_CONFLICT');
  }

  const row = await roundForUser(db, username, id);
  return publicRound(row, []);
}

export async function recordIndependentAssessmentAnswer(db, username, assessmentId, questionId, selectedOption) {
  const row = await roundForUser(db, username, assessmentId);
  if (row.status !== 'active') fail('Esta avaliação já foi encerrada.', 409, 'STUDY_ASSESSMENT_CLOSED');
  if (Number(row.assessment_version) !== ASSESSMENT_VERSION || Number(row.content_version) !== BLOCK_CONTENT_VERSION) {
    await db.prepare(`UPDATE study_assessment_rounds SET status='invalidated'
      WHERE assessment_id=? AND username=? AND status='active'`).bind(assessmentId, username).run();
    fail('A avaliação foi atualizada. Inicie uma nova rodada.', 409, 'STUDY_ASSESSMENT_VERSION_CHANGED');
  }

  const ids = parseQuestionIds(row);
  const question = assessmentQuestionById(questionId);
  if (!question || !ids.includes(question.id)) fail('Questão não pertence a esta avaliação.', 400, 'STUDY_ASSESSMENT_QUESTION_INVALID');
  if (!Number.isInteger(selectedOption) || selectedOption < 0 || selectedOption >= question.options.length) {
    fail('Alternativa inválida.', 400, 'STUDY_ASSESSMENT_OPTION_INVALID');
  }

  const correct = selectedOption === question.answer ? 1 : 0;
  const write = await db.prepare(`INSERT OR IGNORE INTO study_assessment_answers(
      assessment_id, question_id, selected_option, correct
    ) VALUES (?, ?, ?, ?)`).bind(assessmentId, question.id, selectedOption, correct).run();

  const saved = await db.prepare(`SELECT selected_option FROM study_assessment_answers
    WHERE assessment_id=? AND question_id=?`).bind(assessmentId, question.id).first();
  if (!saved) fail('Não foi possível confirmar a resposta.', 409);
  if (Number(saved.selected_option) !== selectedOption) {
    fail('Esta questão já foi respondida com outra alternativa.', 409, 'STUDY_ASSESSMENT_ANSWER_CONFLICT');
  }

  const count = await db.prepare(`SELECT COUNT(*) AS total FROM study_assessment_answers
    WHERE assessment_id=?`).bind(assessmentId).first();

  return {
    assessmentId,
    questionId: question.id,
    recorded: Number(write.meta?.changes || 0) > 0,
    answeredCount: Number(count?.total || 0),
    total: ids.length
  };
}

function buildAssessmentResult(row, answers) {
  const ids = parseQuestionIds(row);
  const byId = new Map(answers.map((answer) => [answer.question_id, answer]));
  const details = ids.map((id) => {
    const question = assessmentQuestionById(id);
    const answer = byId.get(id);
    return {
      questionId: id,
      selectedOption: Number(answer.selected_option),
      correct: Number(answer.correct) === 1,
      correctOption: question.answer,
      explanation: question.explanation,
      primaryLessonId: question.primaryLessonId,
      teaches: question.teaches,
      competencyIds: question.competencyIds,
      sourceIds: question.sourceIds
    };
  });

  const competency = new Map();
  for (const detail of details) {
    for (const competencyId of detail.competencyIds) {
      if (!competency.has(competencyId)) competency.set(competencyId,{competencyId,total:0,correct:0,lessonIds:new Set()});
      const item = competency.get(competencyId);
      item.total++;
      if (detail.correct) item.correct++;
      item.lessonIds.add(detail.primaryLessonId);
    }
  }

  const correct = details.filter((item) => item.correct).length;
  const total = details.length;
  const score = total ? Math.round((correct / total) * 1000) / 10 : 0;
  const diagnostics = [...competency.values()].map((item) => ({
    competencyId: item.competencyId,
    total: item.total,
    correct: item.correct,
    accuracy: item.total ? Math.round((item.correct / item.total) * 1000) / 10 : 0,
    lessonIds: [...item.lessonIds]
  }));

  return {
    assessmentId: row.assessment_id,
    blockId: row.block_id,
    formId: row.form_id,
    assessmentVersion: Number(row.assessment_version),
    contentVersion: Number(row.content_version),
    startedAt: row.started_at,
    completedAt: row.completed_at || '',
    total,
    correct,
    score,
    diagnostics,
    recommendedLessonIds: [...new Set(details.filter((item) => !item.correct).map((item) => item.primaryLessonId))],
    items: details
  };
}

export async function completeIndependentAssessment(db, username, assessmentId) {
  let row = await roundForUser(db, username, assessmentId);
  if (row.status === 'completed') {
    if (row.result_json) {
      try { return JSON.parse(row.result_json); } catch {}
    }
    const existing = await db.prepare(`SELECT * FROM study_assessment_answers
      WHERE assessment_id=? ORDER BY answered_at, question_id`).bind(assessmentId).all();
    return buildAssessmentResult(row, existing.results || []);
  }
  if (row.status !== 'active') fail('Esta avaliação não pode ser concluída.', 409, 'STUDY_ASSESSMENT_CLOSED');
  if (Number(row.assessment_version) !== ASSESSMENT_VERSION || Number(row.content_version) !== BLOCK_CONTENT_VERSION) {
    await db.prepare(`UPDATE study_assessment_rounds SET status='invalidated'
      WHERE assessment_id=? AND username=? AND status='active'`).bind(assessmentId, username).run();
    fail('A avaliação foi atualizada. Inicie uma nova rodada.', 409, 'STUDY_ASSESSMENT_VERSION_CHANGED');
  }

  const ids = parseQuestionIds(row);
  const result = await db.prepare(`SELECT * FROM study_assessment_answers
    WHERE assessment_id=? ORDER BY answered_at, question_id`).bind(assessmentId).all();
  const answers = result.results || [];
  if (answers.length !== ids.length || ids.some((id) => !answers.some((answer) => answer.question_id === id))) {
    fail('Responda todos os itens antes de concluir a avaliação.', 409, 'STUDY_ASSESSMENT_INCOMPLETE');
  }

  const preview = buildAssessmentResult(row, answers);
  const completedAt = new Date().toISOString();
  const persisted = { ...preview, completedAt };
  await db.prepare(`UPDATE study_assessment_rounds
    SET status='completed', completed_at=?, score=?, result_json=?
    WHERE assessment_id=? AND username=? AND status='active'`)
    .bind(completedAt, persisted.score, JSON.stringify(persisted), assessmentId, username).run();

  row = await roundForUser(db, username, assessmentId);
  if (row.status !== 'completed') fail('Não foi possível confirmar o fechamento da avaliação.', 409);
  if (row.result_json) {
    try { return JSON.parse(row.result_json); } catch {}
  }
  return buildAssessmentResult(row, answers);
}
