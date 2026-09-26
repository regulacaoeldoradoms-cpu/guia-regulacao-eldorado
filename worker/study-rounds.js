'use strict';

// Chamado apenas depois da autenticação/autorização da rota de estudos.
// Tabelas adicionais: nenhum registro antigo é reatribuído ou removido.
export class StudyRoundError extends Error {
  constructor(message, status = 409, code = 'STUDY_ROUND_CONFLICT') {
    super(message);
    this.name = 'StudyRoundError';
    this.status = status;
    this.code = code;
  }
}
const fail = (message, status, code) => { throw new StudyRoundError(message, status, code); };
const sessionKey = (value) => typeof value === 'string' && /^[a-f0-9-]{36}$/i.test(value);

export async function ensureRoundSchema(db) {
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS study_rounds (
      session_id TEXT PRIMARY KEY REFERENCES study_sessions(session_id),
      username TEXT NOT NULL,
      mission_id TEXT NOT NULL,
      mode TEXT NOT NULL CHECK(mode IN ('lesson','boss','review')),
      review_id TEXT,
      content_version INTEGER NOT NULL,
      question_ids TEXT NOT NULL,
      pass_score REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','passed','failed')),
      score REAL,
      completed_at TEXT
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS study_round_answers (
      session_id TEXT NOT NULL REFERENCES study_rounds(session_id),
      question_id TEXT NOT NULL,
      attempt_id TEXT NOT NULL UNIQUE REFERENCES study_attempts(attempt_id),
      PRIMARY KEY (session_id, question_id)
    )`),
    db.prepare('CREATE INDEX IF NOT EXISTS idx_study_rounds_user_review ON study_rounds(username, review_id)')
  ]);
}

export async function startStudyRound(db, username, mission, reviewId = null) {
  if (reviewId !== null && (typeof reviewId !== 'string' || !reviewId)) {
    fail('Revisão inválida.', 400);
  }
  if (reviewId) {
    const review = await db.prepare(`SELECT topic_id, status,
      CASE WHEN due_at <= datetime('now') THEN 1 ELSE 0 END AS due
      FROM study_reviews WHERE username=? AND review_id=?`).bind(username, reviewId).first();
    if (!review || review.topic_id !== mission.topicId) fail('Revisão não encontrada para esta missão.', 404);
    if (review.status !== 'pending' || Number(review.due) !== 1) fail('Esta revisão não está disponível.');
  }
  const id = crypto.randomUUID();
  const mode = reviewId ? 'review' : mission.kind === 'boss' ? 'boss' : 'lesson';
  const ids = mission.questions.map((question) => question.id);
  if (!ids.length || new Set(ids).size !== ids.length) fail('Conteúdo da rodada indisponível.', 409);
  await db.batch([
    db.prepare('INSERT INTO study_sessions(session_id, username, mission_id) VALUES (?, ?, ?)')
      .bind(id, username, mission.id),
    db.prepare(`INSERT INTO study_rounds(session_id, username, mission_id, mode, review_id,
      content_version, question_ids, pass_score) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
      .bind(id, username, mission.id, mode, reviewId, mission.contentVersion,
        JSON.stringify(ids), mode === 'boss' ? Number(mission.passScore || 0) : 0)
  ]);
  return { sessionId: id, started: true, roundProtocol: 1, mode };
}

export async function getStudyRound(db, username, mission, id, expectedMode = null, reviewId = null) {
  if (!sessionKey(id)) fail('Atualize a página e reabra a missão para registrar uma rodada.', 409, 'STUDY_ROUND_REQUIRED');
  const row = await db.prepare(`SELECT r.*, s.status AS session_status
    FROM study_rounds AS r JOIN study_sessions AS s ON s.session_id=r.session_id
    WHERE r.session_id=? AND r.username=? AND s.username=? AND s.mission_id=r.mission_id`)
    .bind(id, username, username).first();
  if (!row || row.mission_id !== mission.id) fail('Rodada não encontrada para esta missão.', 404);
  if (expectedMode && (row.mode !== expectedMode || (expectedMode === 'review' && row.review_id !== reviewId))) {
    fail('A rodada não corresponde a esta atividade.');
  }
  if (Number(row.content_version) !== mission.contentVersion) fail('O conteúdo foi atualizado. Reabra a missão para iniciar outra rodada.');
  let ids;
  try { ids = JSON.parse(row.question_ids); } catch { fail('Conteúdo da rodada indisponível.'); }
  if (!Array.isArray(ids) || !ids.length || ids.some((id) => !mission.questions.some((q) => q.id === id))) {
    fail('O conjunto de questões mudou. Reabra a missão.');
  }
  return { ...row, questionIds: ids };
}

function assertOpen(row) {
  if (row.status !== 'active' || row.session_status !== 'active') {
    fail('Esta rodada foi encerrada. Reabra a missão para tentar novamente.');
  }
}

export async function recordRoundAttempt(db, username, mission, question, selectedOption, sessionId) {
  if (!Number.isInteger(selectedOption) || selectedOption < 0 || selectedOption >= question.options.length) {
    fail('Alternativa inválida.', 400);
  }
  const round = await getStudyRound(db, username, mission, sessionId);
  assertOpen(round);
  if (!round.questionIds.includes(question.id)) fail('Questão não pertence à rodada.', 400);
  const attemptId = crypto.randomUUID();
  const correct = selectedOption === question.answer ? 1 : 0;
  // Uma transação insere tentativa e vínculo juntos. A condição é reavaliada
  // dentro da transação, inclusive se outra requisição finalizar a rodada.
  const results = await db.batch([
    db.prepare(`INSERT INTO study_attempts(attempt_id, username, question_id, topic_id,
      content_version, selected_option, correct)
      SELECT ?, ?, ?, ?, ?, ?, ? WHERE EXISTS (
        SELECT 1 FROM study_rounds r JOIN study_sessions s ON s.session_id=r.session_id
        WHERE r.session_id=? AND r.username=? AND s.username=?
          AND r.status='active' AND s.status='active'
      ) AND NOT EXISTS (
        SELECT 1 FROM study_round_answers WHERE session_id=? AND question_id=?
      )`).bind(attemptId, username, question.id, mission.topicId, mission.contentVersion,
        selectedOption, correct, sessionId, username, username, sessionId, question.id),
    db.prepare(`INSERT INTO study_round_answers(session_id, question_id, attempt_id)
      SELECT ?, ?, attempt_id FROM study_attempts WHERE attempt_id=? AND username=?`)
      .bind(sessionId, question.id, attemptId, username)
  ]);
  const saved = await db.prepare(`SELECT a.attempt_id, a.selected_option, a.correct
    FROM study_round_answers x JOIN study_attempts a ON a.attempt_id=x.attempt_id
    WHERE x.session_id=? AND x.question_id=? AND a.username=? AND a.topic_id=?`)
    .bind(sessionId, question.id, username, mission.topicId).first();
  if (!saved) fail('A rodada foi encerrada antes de registrar a resposta.');
  if (Number(saved.selected_option) !== selectedOption) {
    fail('Esta questão já foi respondida nesta rodada. Reabra a missão para responder novamente.');
  }
  return { correct: !!Number(saved.correct), recorded: Number(results[0]?.meta?.changes || 0) > 0 };
}

export async function evaluateStudyRound(db, username, mission, sessionId, mode, reviewId = null) {
  const round = await getStudyRound(db, username, mission, sessionId, mode, reviewId);
  // Resultado já fixado pode ser recuperado para reparar uma resposta perdida.
  if (round.status !== 'active') return { passed: round.status === 'passed', score: Number(round.score || 0), passScore: Number(round.pass_score), replayed: true };
  assertOpen(round);
  if (mode === 'review') {
    const review = await db.prepare(`SELECT status FROM study_reviews
      WHERE review_id=? AND username=? AND topic_id=? AND due_at <= datetime('now')`)
      .bind(reviewId, username, mission.topicId).first();
    if (!review || review.status !== 'pending') fail('Esta revisão já foi concluída ou não está disponível.');
  }
  // Aulas comuns mantêm a retomada pelo histórico. Revisão/Chefe usam só o vínculo
  // explícito desta rodada, nunca horário >= início ou tentativas de outra aba.
  const rows = mode === 'lesson'
    ? (await db.prepare(`SELECT question_id, MAX(correct) AS correct FROM study_attempts
        WHERE username=? AND topic_id=? GROUP BY question_id`).bind(username, mission.topicId).all()).results || []
    : (await db.prepare(`SELECT x.question_id, a.correct FROM study_round_answers x
        JOIN study_attempts a ON a.attempt_id=x.attempt_id
        WHERE x.session_id=? AND a.username=? AND a.topic_id=?`)
        .bind(sessionId, username, mission.topicId).all()).results || [];
  const allowed = new Set(round.questionIds);
  const answers = new Map(rows.filter((row) => allowed.has(row.question_id)).map((row) => [row.question_id, Number(row.correct)]));
  if (answers.size !== allowed.size) {
    fail(mode === 'review' ? 'Responda todas as questões novamente antes de concluir a revisão.' : 'Responda todas as questões desta atividade antes de concluí-la.');
  }
  const hits = [...answers.values()].filter(Boolean).length;
  const score = Math.round(hits / allowed.size * 1000) / 10;
  const passed = mode !== 'boss' || score >= Number(round.pass_score);
  await db.prepare(`UPDATE study_rounds SET status=?, score=?, completed_at=CURRENT_TIMESTAMP
    WHERE session_id=? AND username=? AND status='active'
      AND EXISTS (SELECT 1 FROM study_sessions WHERE session_id=? AND username=? AND status='active')`)
    .bind(passed ? 'passed' : 'failed', score, sessionId, username, sessionId, username).run();
  const current = await getStudyRound(db, username, mission, sessionId, mode, reviewId);
  if (current.status === 'active') fail('A sessão foi encerrada antes de concluir a rodada.');
  return { passed: current.status === 'passed', score: Number(current.score), passScore: Number(current.pass_score), replayed: false };
}

export async function commitReviewReward(db, username, reviewId, sessionId) {
  // Conclusão e evento de XP juntos: uma falha intermediária não deixa revisão
  // concluída sem recompensa. Repetições recuperam o resultado sem duplicar XP.
  const results = await db.batch([
    db.prepare(`UPDATE study_reviews SET status='completed', completed_at=CURRENT_TIMESTAMP
      WHERE username=? AND review_id=? AND status='pending' AND EXISTS (
        SELECT 1 FROM study_rounds WHERE session_id=? AND username=?
          AND review_id=? AND mode='review' AND status='passed'
      )`).bind(username, reviewId, sessionId, username, reviewId),
    db.prepare(`INSERT OR IGNORE INTO study_xp_events(event_id, username, event_type, ref_id, points)
      SELECT ?, ?, 'review_complete', ?, 20 WHERE EXISTS (
        SELECT 1 FROM study_reviews v JOIN study_rounds r ON r.review_id=v.review_id
        WHERE v.review_id=? AND v.username=? AND v.status='completed'
          AND r.session_id=? AND r.username=? AND r.mode='review' AND r.status='passed'
      )`).bind(crypto.randomUUID(), username, reviewId, reviewId, username, sessionId, username)
  ]);
  return Number(results[1]?.meta?.changes || 0) ? 20 : 0;
}

export async function finishStudySession(db, username, sessionId, durationSeconds) {
  if (!sessionKey(sessionId)) fail('Sessão não encontrada.', 404);
  if (typeof durationSeconds !== 'number' || !Number.isFinite(durationSeconds) || durationSeconds < 0) {
    fail('Duração inválida.', 400);
  }
  const reported = Math.min(21600, Math.floor(durationSeconds));
  await db.prepare(`UPDATE study_sessions SET finished_at=CURRENT_TIMESTAMP,
      duration_seconds=MIN(?, MAX(0, unixepoch('now')-unixepoch(started_at))), status='finished'
    WHERE session_id=? AND username=? AND status='active'`)
    .bind(reported, sessionId, username).run();
  const saved = await db.prepare(`SELECT duration_seconds, status FROM study_sessions
    WHERE session_id=? AND username=?`).bind(sessionId, username).first();
  if (!saved) fail('Sessão não encontrada.', 404);
  if (saved.status !== 'finished') fail('Não foi possível encerrar a sessão.');
  return { finished: true, durationSeconds: Number(saved.duration_seconds || 0) };
}
