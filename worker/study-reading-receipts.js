'use strict';
import { getStudyRound, StudyRoundError } from './study-rounds.js';

// Local prototype only. A topic's historic coverage never confirms this session's reading.
export async function ensureReadingReceiptSchema(db) {
  await db.prepare(`CREATE TABLE IF NOT EXISTS study_reading_receipts (
    session_id TEXT PRIMARY KEY REFERENCES study_rounds(session_id),
    username TEXT NOT NULL,
    mission_id TEXT NOT NULL,
    content_version INTEGER NOT NULL,
    confirmed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`).run();
}

export async function studyReadingReceipt(db, username, mission, sessionId) {
  const receipt = await db.prepare(`SELECT p.confirmed_at FROM study_reading_receipts p
    JOIN study_rounds r ON r.session_id=p.session_id AND r.username=p.username
    JOIN study_sessions s ON s.session_id=r.session_id AND s.username=r.username
    WHERE p.session_id=? AND p.username=? AND p.mission_id=? AND p.content_version=?
      AND r.mission_id=p.mission_id AND s.mission_id=p.mission_id
      AND r.content_version=p.content_version AND datetime(p.confirmed_at) IS NOT NULL
      AND r.status='active' AND s.status='active'`)
    .bind(sessionId, username, mission.id, mission.contentVersion).first();
  return { readingReceiptProtocol: 1, readingComplete: !!receipt,
    readingConfirmedAt: receipt?.confirmed_at || null };
}

export async function recordStudyReading(db, username, mission, sessionId) {
  const round = await getStudyRound(db, username, mission, sessionId);
  if (round.status !== 'active' || round.session_status !== 'active') {
    throw new StudyRoundError('A sessão já foi encerrada.', 409, 'STUDY_SESSION_CLOSED');
  }
  const open = `EXISTS (SELECT 1 FROM study_rounds r JOIN study_sessions s ON s.session_id=r.session_id
    WHERE r.session_id=? AND r.username=? AND s.username=? AND r.mission_id=? AND s.mission_id=?
      AND r.content_version=? AND r.question_ids=? AND r.status='active' AND s.status='active')`;
  const params = [sessionId, username, username, mission.id, mission.id, mission.contentVersion, round.question_ids];
  // Receipt and initial coverage share one transaction. Replays neither refresh the receipt nor award XP.
  const statements = [db.prepare(`INSERT OR IGNORE INTO study_reading_receipts
    (session_id, username, mission_id, content_version) SELECT ?, ?, ?, ? WHERE ${open}`)
    .bind(sessionId, username, mission.id, mission.contentVersion, ...params)];
  if (round.mode !== 'review') statements.push(db.prepare(`INSERT INTO study_topic_progress
    (username, topic_id, coverage_state, mastery_score, content_version_seen, started_at)
    SELECT ?, ?, 1, 0, ?, CURRENT_TIMESTAMP WHERE ${open}
      AND EXISTS (SELECT 1 FROM study_reading_receipts p
        WHERE p.session_id=? AND p.username=? AND p.mission_id=? AND p.content_version=?
          AND datetime(p.confirmed_at) IS NOT NULL)
    ON CONFLICT(username, topic_id) DO UPDATE SET
      coverage_state=MAX(study_topic_progress.coverage_state,1),
      content_version_seen=MAX(study_topic_progress.content_version_seen,excluded.content_version_seen),
      started_at=COALESCE(study_topic_progress.started_at,CURRENT_TIMESTAMP), updated_at=CURRENT_TIMESTAMP
    WHERE study_topic_progress.coverage_state < 1`)
    .bind(username, mission.topicId, mission.contentVersion, ...params,
      sessionId, username, mission.id, mission.contentVersion));
  const results = await db.batch(statements);
  const receipt = await studyReadingReceipt(db, username, mission, sessionId);
  if (!receipt.readingComplete) throw new StudyRoundError('A sessão mudou antes de confirmar a leitura.', 409);
  const progress = await db.prepare('SELECT coverage_state FROM study_topic_progress WHERE username=? AND topic_id=?')
    .bind(username, mission.topicId).first();
  return { ...receipt, recorded: Number(results[1]?.meta?.changes || 0) > 0,
    readingRecorded: Number(results[0]?.meta?.changes || 0) > 0,
    coverageState: Math.max(0, Number(progress?.coverage_state || 0)), pedagogyProtocol: 1 };
}
