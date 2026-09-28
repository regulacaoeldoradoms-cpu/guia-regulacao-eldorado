'use strict';

import { StudyRoundError } from './study-rounds.js';
import { assessmentQuestionById } from './studies-content/sfn-assessment-v1.js';

const fail = (message, status = 409, code = 'STUDY_ASSESSMENT_CONFLICT') => {
  throw new StudyRoundError(message, status, code);
};
const key = (value) => typeof value === 'string' && /^[a-f0-9-]{36}$/i.test(value);

export async function ensureAssessmentSchema(db) {
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS study_assessment_runs (
      run_id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      assessment_id TEXT NOT NULL,
      form_id TEXT NOT NULL,
      question_ids TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','completed')),
      score REAL,
      started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      completed_at TEXT
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS study_assessment_answers (
      run_id TEXT NOT NULL REFERENCES study_assessment_runs(run_id),
      question_id TEXT NOT NULL,
      selected_option INTEGER NOT NULL,
      correct INTEGER NOT NULL,
      answered_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (run_id, question_id)
    )`),
    db.prepare('CREATE INDEX IF NOT EXISTS idx_study_assessment_runs_user ON study_assessment_runs(username, assessment_id, started_at)'),
    db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_study_assessment_active ON study_assessment_runs(username, assessment_id) WHERE status='active'")
  ]);
}

function formById(assessment, formId) {
  return assessment.forms.find((item) => item.id === formId) || null;
}

function publicQuestion(item) {
  return { id: item.id, prompt: item.prompt, options: item.options };
}

function parseQuestionIds(row, assessment) {
  let ids;
  try { ids = JSON.parse(row.question_ids); }
  catch { fail('Conjunto da avaliação indisponível. Reabra a avaliação.'); }
  const form = formById(assessment, row.form_id);
  if (!form || !Array.isArray(ids) || ids.length !== assessment.questionCount) {
    fail('Versão da avaliação incompatível. Inicie uma nova tentativa.');
  }
  const formIds = new Set(form.questions.map((item) => item.id));
  if (ids.some((id) => !formIds.has(id)) || new Set(ids).size !== ids.length) {
    fail('Questões da avaliação foram alteradas. Inicie uma nova tentativa.');
  }
  return { ids, form };
}

async function runRow(db, username, assessment, runId) {
  if (!key(runId)) fail('Tentativa de avaliação não encontrada.', 404);
  const row = await db.prepare(`SELECT * FROM study_assessment_runs
    WHERE run_id=? AND username=? AND assessment_id=? LIMIT 1`)
    .bind(runId, username, assessment.id).first();
  if (!row) fail('Tentativa de avaliação não encontrada.', 404);
  const parsed = parseQuestionIds(row, assessment);
  return { ...row, questionIds: parsed.ids, form: parsed.form };
}

async function selectedAnswers(db, username, runId) {
  const result = await db.prepare(`SELECT a.question_id, a.selected_option
    FROM study_assessment_answers a
    JOIN study_assessment_runs r ON r.run_id=a.run_id
    WHERE a.run_id=? AND r.username=?
    ORDER BY a.answered_at, a.question_id`).bind(runId, username).all();
  return Object.fromEntries((result.results || []).map((row) => [
    row.question_id, Number(row.selected_option)
  ]));
}

export async function startAssessmentRun(db, username, assessment) {
  const active = await db.prepare(`SELECT * FROM study_assessment_runs
    WHERE username=? AND assessment_id=? AND status='active'
    ORDER BY started_at DESC LIMIT 1`).bind(username, assessment.id).first();

  if (active) {
    const parsed = parseQuestionIds(active, assessment);
    return {
      runId: active.run_id,
      resumed: true,
      formId: active.form_id,
      questions: parsed.ids.map((id) => publicQuestion(parsed.form.questions.find((item) => item.id === id))),
      answered: await selectedAnswers(db, username, active.run_id)
    };
  }

  const countRow = await db.prepare(`SELECT COUNT(*) AS total FROM study_assessment_runs
    WHERE username=? AND assessment_id=? AND status='completed'`)
    .bind(username, assessment.id).first();
  const completed = Number(countRow?.total || 0);
  const form = assessment.forms[completed % assessment.forms.length];
  if (!form || form.questions.length !== assessment.questionCount) fail('Forma de avaliação indisponível.');

  const runId = crypto.randomUUID();
  const ids = form.questions.map((item) => item.id);
  const inserted = await db.prepare(`INSERT OR IGNORE INTO study_assessment_runs(
      run_id, username, assessment_id, form_id, question_ids
    ) VALUES (?, ?, ?, ?, ?)`)
    .bind(runId, username, assessment.id, form.id, JSON.stringify(ids)).run();

  if (Number(inserted.meta?.changes || 0) === 0) {
    const concurrent = await db.prepare(`SELECT * FROM study_assessment_runs
      WHERE username=? AND assessment_id=? AND status='active'
      ORDER BY started_at DESC LIMIT 1`).bind(username, assessment.id).first();
    if (!concurrent) fail('Não foi possível recuperar a tentativa ativa.');
    const parsed = parseQuestionIds(concurrent, assessment);
    return {
      runId: concurrent.run_id,
      resumed: true,
      formId: concurrent.form_id,
      questions: parsed.ids.map((id) => publicQuestion(parsed.form.questions.find((item) => item.id === id))),
      answered: await selectedAnswers(db, username, concurrent.run_id)
    };
  }

  return {
    runId,
    resumed: false,
    formId: form.id,
    questions: form.questions.map(publicQuestion),
    answered: {}
  };
}

export async function recordAssessmentAnswer(db, username, assessment, runId, questionId, selectedOption) {
  const run = await runRow(db, username, assessment, runId);
  if (run.status !== 'active') fail('Esta avaliação já foi concluída. Inicie outra tentativa.');
  if (!Number.isInteger(selectedOption)) fail('Alternativa inválida.', 400);
  if (!run.questionIds.includes(questionId)) fail('Questão não pertence a esta avaliação.', 400);

  const found = assessmentQuestionById(questionId);
  if (!found || found.assessment.id !== assessment.id || found.form.id !== run.form_id) {
    fail('Questão da avaliação não encontrada.', 404);
  }
  const question = found.question;
  if (selectedOption < 0 || selectedOption >= question.options.length) fail('Alternativa inválida.', 400);

  const correct = selectedOption === question.answer ? 1 : 0;
  const result = await db.prepare(`INSERT OR IGNORE INTO study_assessment_answers(
      run_id, question_id, selected_option, correct
    ) SELECT ?, ?, ?, ? WHERE EXISTS (
      SELECT 1 FROM study_assessment_runs
      WHERE run_id=? AND username=? AND assessment_id=? AND status='active'
    )`).bind(runId, question.id, selectedOption, correct, runId, username, assessment.id).run();

  const saved = await db.prepare(`SELECT a.selected_option
    FROM study_assessment_answers a JOIN study_assessment_runs r ON r.run_id=a.run_id
    WHERE a.run_id=? AND a.question_id=? AND r.username=? AND r.assessment_id=?`)
    .bind(runId, question.id, username, assessment.id).first();
  if (!saved) fail('A resposta não foi registrada.');
  if (Number(saved.selected_option) !== selectedOption) {
    fail('Esta questão já foi respondida nesta tentativa. Conclua ou inicie outra avaliação.');
  }

  const count = await db.prepare(`SELECT COUNT(*) AS total FROM study_assessment_answers
    WHERE run_id=?`).bind(runId).first();
  return {
    recorded: Number(result.meta?.changes || 0) > 0,
    answered: Number(count?.total || 0),
    total: assessment.questionCount
  };
}

function correctionFor(question, selectedOption, missions) {
  const missionMap = new Map(missions.map((mission) => [mission.id, mission]));
  return {
    questionId: question.id,
    selectedOption,
    correctOption: question.answer,
    correct: selectedOption === question.answer,
    explanation: question.explanation,
    reviewTargets: question.teachingRefs.map((teachingRef) => {
      const mission = missionMap.get(teachingRef.missionId);
      const section = mission?.sections?.find((item) => item.id === teachingRef.sectionId);
      return {
        missionId: teachingRef.missionId,
        sectionId: teachingRef.sectionId,
        missionTitle: mission?.shortTitle || mission?.title || teachingRef.missionId,
        sectionTitle: section?.heading || teachingRef.sectionId
      };
    })
  };
}

export async function completeAssessmentRun(db, username, assessment, runId, missions) {
  let run = await runRow(db, username, assessment, runId);
  const rows = (await db.prepare(`SELECT question_id, selected_option, correct
    FROM study_assessment_answers WHERE run_id=? ORDER BY answered_at, question_id`)
    .bind(runId).all()).results || [];

  if (rows.length !== assessment.questionCount) {
    fail(`Responda todas as ${assessment.questionCount} questões antes de concluir a avaliação.`);
  }

  if (run.status === 'active') {
    const hits = rows.reduce((sum, row) => sum + Number(row.correct || 0), 0);
    const score = Math.round((hits / assessment.questionCount) * 1000) / 10;
    await db.prepare(`UPDATE study_assessment_runs
      SET status='completed', score=?, completed_at=CURRENT_TIMESTAMP
      WHERE run_id=? AND username=? AND assessment_id=? AND status='active'`)
      .bind(score, runId, username, assessment.id).run();
    run = await runRow(db, username, assessment, runId);
  }

  const selected = new Map(rows.map((row) => [row.question_id, Number(row.selected_option)]));
  return {
    completed: true,
    runId,
    score: Number(run.score || 0),
    questionCount: assessment.questionCount,
    corrections: run.questionIds.map((id) => {
      const item = run.form.questions.find((question) => question.id === id);
      return correctionFor(item, selected.get(id), missions);
    })
  };
}

export async function assessmentEvidence(db, username, assessment) {
  const result = await db.prepare(`SELECT run_id, form_id, score, completed_at
    FROM study_assessment_runs
    WHERE username=? AND assessment_id=? AND status='completed'
    ORDER BY completed_at, started_at, run_id`).bind(username, assessment.id).all();
  const runs = result.results || [];
  return {
    attempts: runs.length,
    firstScore: runs.length ? Number(runs[0].score || 0) : null,
    latestScore: runs.length ? Number(runs[runs.length - 1].score || 0) : null,
    firstCompletedAt: runs[0]?.completed_at || '',
    latestCompletedAt: runs[runs.length - 1]?.completed_at || '',
    formsSeen: [...new Set(runs.map((row) => row.form_id))]
  };
}
