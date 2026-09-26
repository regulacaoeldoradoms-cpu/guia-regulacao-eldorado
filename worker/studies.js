'use strict';

import { validatePortalSession } from './auth-management-flex.js';
import {
  STUDY_SOURCES,
  PUBLISHED_MISSIONS,
  PLANNED_MISSIONS,
  missionById,
  questionById,
  sourceMap
} from './studies-content/manifest.js';

const ALLOWED_USERNAME = 'wellyton';
const MAX_SESSION_SECONDS = 6 * 60 * 60;
const schemaReady = new WeakSet();
const schemaPromises = new WeakMap();

function normalizeUsername(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '.')
    .replace(/[^a-z0-9._-]/g, '')
    .replace(/[._-]{2,}/g, '.')
    .replace(/^[._-]+|[._-]+$/g, '')
    .slice(0, 40);
}

export function studyUsernameAllowed(value) {
  return normalizeUsername(value) === ALLOWED_USERNAME;
}

function headers(origin, allowed = true) {
  const value = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  };
  if (origin && allowed) {
    value['Access-Control-Allow-Origin'] = origin;
    value.Vary = 'Origin';
  }
  return value;
}

function json(body, status, origin, allowed = true) {
  return new Response(JSON.stringify(body), { status, headers: headers(origin, allowed) });
}

function preflight(origin, allowed) {
  if (!allowed) return json({ error: 'Origem não autorizada.' }, 403, origin, false);
  const value = headers(origin, true);
  value['Access-Control-Allow-Methods'] = 'GET, POST, PATCH, OPTIONS';
  value['Access-Control-Allow-Headers'] = 'Authorization, Content-Type';
  value['Access-Control-Max-Age'] = '600';
  return new Response(null, { status: 204, headers: value });
}

export function isStudiesApi(pathname) {
  return String(pathname || '').startsWith('/api/studies/');
}

async function ensureStudySchema(env) {
  const db = env.AUTH_DB;
  if (!db) throw new Error('Banco de progresso indisponível.');
  if (schemaReady.has(db)) return true;
  if (schemaPromises.has(db)) return schemaPromises.get(db);

  const operation = (async () => {
    const statements = [
      `CREATE TABLE IF NOT EXISTS study_profiles (
        username TEXT PRIMARY KEY,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS study_topic_progress (
        username TEXT NOT NULL,
        topic_id TEXT NOT NULL,
        coverage_state INTEGER NOT NULL DEFAULT 0,
        mastery_score REAL NOT NULL DEFAULT 0,
        content_version_seen INTEGER NOT NULL DEFAULT 0,
        started_at TEXT,
        completed_at TEXT,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (username, topic_id)
      )`,
      `CREATE TABLE IF NOT EXISTS study_sessions (
        session_id TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        mission_id TEXT,
        started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        finished_at TEXT,
        duration_seconds INTEGER NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'active'
      )`,
      `CREATE TABLE IF NOT EXISTS study_attempts (
        attempt_id TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        question_id TEXT NOT NULL,
        topic_id TEXT NOT NULL,
        content_version INTEGER NOT NULL,
        selected_option INTEGER NOT NULL,
        correct INTEGER NOT NULL,
        attempted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS study_reviews (
        review_id TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        topic_id TEXT NOT NULL,
        cycle INTEGER NOT NULL,
        due_at TEXT NOT NULL,
        completed_at TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        UNIQUE(username, topic_id, cycle)
      )`,
      `CREATE TABLE IF NOT EXISTS study_xp_events (
        event_id TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        event_type TEXT NOT NULL,
        ref_id TEXT NOT NULL,
        points INTEGER NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(username, event_type, ref_id)
      )`,
      `CREATE TABLE IF NOT EXISTS study_achievements (
        username TEXT NOT NULL,
        achievement_id TEXT NOT NULL,
        rule_version INTEGER NOT NULL DEFAULT 1,
        unlocked_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        source_ref TEXT,
        PRIMARY KEY (username, achievement_id)
      )`
    ];
    for (const sql of statements) await db.prepare(sql).run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_study_attempts_user_topic ON study_attempts(username, topic_id, attempted_at)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_study_sessions_user_finished ON study_sessions(username, finished_at)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_study_reviews_user_due ON study_reviews(username, status, due_at)').run();
    schemaReady.add(db);
    return true;
  })().catch((error) => {
    schemaReady.delete(db);
    throw error;
  }).finally(() => {
    schemaPromises.delete(db);
  });

  schemaPromises.set(db, operation);
  return operation;
}

async function requireStudyUser(request, env, origin, originAllowed) {
  if (!originAllowed) return { response: json({ error: 'Origem não autorizada.' }, 403, origin, false) };
  const user = await validatePortalSession(request, env, []);
  if (!user) return { response: json({ error: 'Sessão inválida ou expirada.' }, 401, origin, true) };
  if (!studyUsernameAllowed(user.username)) {
    return { response: json({ error: 'Esta experiência está disponível somente para a conta autorizada.' }, 403, origin, true) };
  }
  await ensureStudySchema(env);
  await env.AUTH_DB.prepare(`INSERT INTO study_profiles(username)
    VALUES (?) ON CONFLICT(username) DO UPDATE SET updated_at=CURRENT_TIMESTAMP`).bind(ALLOWED_USERNAME).run();
  return { user: { username: ALLOWED_USERNAME, name: user.name || 'Wellyton' } };
}

function publicMission(mission) {
  const sources = sourceMap();
  return {
    id: mission.id,
    topicId: mission.topicId,
    contentVersion: mission.contentVersion,
    order: mission.order,
    title: mission.title,
    shortTitle: mission.shortTitle,
    estimatedMinutes: mission.estimatedMinutes,
    xp: mission.xp,
    objective: mission.objective,
    sections: mission.sections,
    recall: mission.recall,
    sources: mission.sourceIds.map((id) => sources.get(id)).filter(Boolean),
    questions: mission.questions.map((question) => ({
      id: question.id,
      prompt: question.prompt,
      options: question.options
    }))
  };
}

function levelForXp(xp) {
  const total = Math.max(0, Number(xp || 0));
  const levels = [
    { min: 0, level: 1, title: 'Recruta', next: 150 },
    { min: 150, level: 2, title: 'Iniciante', next: 400 },
    { min: 400, level: 3, title: 'Aspirante Bancário', next: 800 },
    { min: 800, level: 4, title: 'Competitivo', next: 1400 },
    { min: 1400, level: 5, title: 'Pré-aprovação', next: 2200 },
    { min: 2200, level: 6, title: 'Reta final', next: null }
  ];
  return [...levels].reverse().find((item) => total >= item.min) || levels[0];
}

async function progressMap(env, username) {
  const result = await env.AUTH_DB.prepare(`SELECT topic_id, coverage_state, mastery_score,
      content_version_seen, started_at, completed_at, updated_at
    FROM study_topic_progress WHERE username=?`).bind(username).all();
  return Object.fromEntries((result.results || []).map((row) => [row.topic_id, {
    coverageState: Number(row.coverage_state || 0),
    masteryScore: Number(row.mastery_score || 0),
    contentVersionSeen: Number(row.content_version_seen || 0),
    startedAt: row.started_at || '',
    completedAt: row.completed_at || '',
    updatedAt: row.updated_at || ''
  }]));
}

export function computeCampaignProgress(progress, publishedMissions = PUBLISHED_MISSIONS, plannedMissions = PLANNED_MISSIONS) {
  const planned = Math.max(1, plannedMissions.length);
  const published = publishedMissions.length;
  const completedPublished = publishedMissions.filter((mission) =>
    Number(progress?.[mission.topicId]?.coverageState || 0) >= 3
  ).length;
  const round = (value) => Math.round(value * 1000) / 10;
  return {
    publishedMissions: published,
    plannedMissions: planned,
    campaignAvailability: round(published / planned),
    completedPublished,
    availableCompletion: published ? round(completedPublished / published) : 0,
    campaignProgress: round(completedPublished / planned),
    availableProgress: round(completedPublished / planned)
  };
}

async function metrics(env, username, progress) {
  const [attempts, sessions, xpRow, reviews] = await Promise.all([
    env.AUTH_DB.prepare(`SELECT COUNT(*) AS total,
      COALESCE(SUM(correct),0) AS correct FROM study_attempts WHERE username=?`).bind(username).first(),
    env.AUTH_DB.prepare(`SELECT COALESCE(SUM(duration_seconds),0) AS seconds
      FROM study_sessions WHERE username=? AND status='finished'`).bind(username).first(),
    env.AUTH_DB.prepare(`SELECT COALESCE(SUM(points),0) AS xp
      FROM study_xp_events WHERE username=?`).bind(username).first(),
    env.AUTH_DB.prepare(`SELECT COUNT(*) AS pending FROM study_reviews
      WHERE username=? AND status='pending' AND due_at <= datetime('now')`).bind(username).first()
  ]);
  const totalQuestions = Number(attempts?.total || 0);
  const correctQuestions = Number(attempts?.correct || 0);
  const xp = Number(xpRow?.xp || 0);
  const level = levelForXp(xp);
  return {
    xp,
    level: level.level,
    levelTitle: level.title,
    nextLevelXp: level.next,
    hoursSeconds: Number(sessions?.seconds || 0),
    questions: totalQuestions,
    correctQuestions,
    accuracy: totalQuestions ? Math.round((correctQuestions / totalQuestions) * 1000) / 10 : 0,
    reviewsDue: Number(reviews?.pending || 0),
    ...computeCampaignProgress(progress)
  };
}

async function achievementRows(env, username) {
  const result = await env.AUTH_DB.prepare(`SELECT achievement_id, rule_version, unlocked_at, source_ref
    FROM study_achievements WHERE username=? ORDER BY unlocked_at`).bind(username).all();
  const catalog = {
    'study.first_mission': { title: 'Primeira missão', description: 'Concluiu a primeira missão real da Missão Bancária.' }
  };
  return (result.results || []).map((row) => ({
    id: row.achievement_id,
    title: catalog[row.achievement_id]?.title || row.achievement_id,
    description: catalog[row.achievement_id]?.description || 'Conquista da Missão Bancária.',
    ruleVersion: Number(row.rule_version || 1),
    unlockedAt: row.unlocked_at,
    sourceRef: row.source_ref || ''
  }));
}

async function handleBootstrap(env, user, origin) {
  const progress = await progressMap(env, user.username);
  return json({
    user,
    contentRelease: 'sfn-v1.1',
    metrics: await metrics(env, user.username, progress),
    progress,
    missions: PUBLISHED_MISSIONS.map(publicMission),
    sources: STUDY_SOURCES
  }, 200, origin);
}

async function handleAchievements(env, user, origin) {
  return json({ achievements: await achievementRows(env, user.username) }, 200, origin);
}

async function upsertPracticeProgress(env, username, mission, mastery) {
  await env.AUTH_DB.prepare(`INSERT INTO study_topic_progress(
      username, topic_id, coverage_state, mastery_score, content_version_seen, started_at
    ) VALUES (?, ?, 2, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(username, topic_id) DO UPDATE SET
      coverage_state=MAX(study_topic_progress.coverage_state,2),
      mastery_score=excluded.mastery_score,
      content_version_seen=MAX(study_topic_progress.content_version_seen,excluded.content_version_seen),
      started_at=COALESCE(study_topic_progress.started_at,CURRENT_TIMESTAMP),
      updated_at=CURRENT_TIMESTAMP`)
    .bind(username, mission.topicId, mastery, mission.contentVersion).run();
}

async function handleAttempt(request, env, user, origin) {
  const body = await request.json().catch(() => ({}));
  const found = questionById(body.questionId);
  if (!found) return json({ error: 'Questão não encontrada.' }, 404, origin);
  const selected = Number(body.selectedOption);
  if (!Number.isInteger(selected) || selected < 0 || selected >= found.question.options.length) {
    return json({ error: 'Alternativa inválida.' }, 400, origin);
  }
  const correct = selected === found.question.answer;
  await env.AUTH_DB.prepare(`INSERT INTO study_attempts(
      attempt_id, username, question_id, topic_id, content_version, selected_option, correct
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`).bind(
      crypto.randomUUID(), user.username, found.question.id, found.mission.topicId,
      found.mission.contentVersion, selected, correct ? 1 : 0
    ).run();

  const stats = await env.AUTH_DB.prepare(`SELECT COUNT(*) AS total, COALESCE(SUM(correct),0) AS correct
    FROM study_attempts WHERE username=? AND topic_id=?`).bind(user.username, found.mission.topicId).first();
  const total = Number(stats?.total || 0);
  const hits = Number(stats?.correct || 0);
  const mastery = total ? Math.round((hits / total) * 1000) / 10 : 0;
  await upsertPracticeProgress(env, user.username, found.mission, mastery);

  return json({
    correct,
    correctOption: found.question.answer,
    explanation: found.question.explanation,
    masteryScore: mastery
  }, 200, origin);
}

async function grantXp(env, username, eventType, refId, points) {
  const result = await env.AUTH_DB.prepare(`INSERT OR IGNORE INTO study_xp_events(
      event_id, username, event_type, ref_id, points
    ) VALUES (?, ?, ?, ?, ?)`).bind(
      crypto.randomUUID(), username, eventType, refId, Math.max(0, Number(points || 0))
    ).run();
  return Number(result.meta?.changes || 0) > 0;
}

async function grantAchievement(env, username, achievementId, sourceRef) {
  const result = await env.AUTH_DB.prepare(`INSERT OR IGNORE INTO study_achievements(
      username, achievement_id, rule_version, source_ref
    ) VALUES (?, ?, 1, ?)`).bind(username, achievementId, sourceRef).run();
  return Number(result.meta?.changes || 0) > 0;
}

async function scheduleReviews(env, username, topicId) {
  const cycles = [
    { cycle: 1, modifier: '+1 day' },
    { cycle: 2, modifier: '+7 days' },
    { cycle: 3, modifier: '+30 days' }
  ];
  for (const item of cycles) {
    await env.AUTH_DB.prepare(`INSERT OR IGNORE INTO study_reviews(
      review_id, username, topic_id, cycle, due_at
    ) VALUES (?, ?, ?, ?, datetime('now', ?))`).bind(
      crypto.randomUUID(), username, topicId, item.cycle, item.modifier
    ).run();
  }
}

async function handleComplete(pathname, env, user, origin) {
  const match = pathname.match(/^\/api\/studies\/missions\/([^/]+)\/complete$/);
  const mission = match ? missionById(decodeURIComponent(match[1])) : null;
  if (!mission) return json({ error: 'Missão não encontrada.' }, 404, origin);

  const answered = await env.AUTH_DB.prepare(`SELECT COUNT(DISTINCT question_id) AS total
    FROM study_attempts WHERE username=? AND topic_id=?`).bind(user.username, mission.topicId).first();
  if (Number(answered?.total || 0) < mission.questions.length) {
    return json({ error: 'Responda todas as questões da missão antes de concluí-la.' }, 409, origin);
  }

  await env.AUTH_DB.prepare(`INSERT INTO study_topic_progress(
      username, topic_id, coverage_state, mastery_score, content_version_seen, started_at, completed_at
    ) VALUES (?, ?, 3, 0, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT(username, topic_id) DO UPDATE SET
      coverage_state=3,
      content_version_seen=MAX(study_topic_progress.content_version_seen,excluded.content_version_seen),
      started_at=COALESCE(study_topic_progress.started_at,CURRENT_TIMESTAMP),
      completed_at=COALESCE(study_topic_progress.completed_at,CURRENT_TIMESTAMP),
      updated_at=CURRENT_TIMESTAMP`).bind(user.username, mission.topicId, mission.contentVersion).run();

  const xpGranted = await grantXp(env, user.username, 'mission_complete', mission.id, mission.xp);
  const achievementGranted = await grantAchievement(env, user.username, 'study.first_mission', mission.id);
  await scheduleReviews(env, user.username, mission.topicId);

  const progress = await progressMap(env, user.username);
  return json({
    completed: true,
    xpGranted: xpGranted ? mission.xp : 0,
    newAchievements: achievementGranted ? [{
      id: 'study.first_mission',
      title: 'Primeira missão',
      description: 'Você concluiu sua primeira missão real.'
    }] : [],
    metrics: await metrics(env, user.username, progress)
  }, 200, origin);
}

async function handleStartSession(request, env, user, origin) {
  const body = await request.json().catch(() => ({}));
  const mission = missionById(body.missionId);
  if (!mission) return json({ error: 'Missão não encontrada.' }, 404, origin);
  const sessionId = crypto.randomUUID();
  await env.AUTH_DB.prepare(`INSERT INTO study_sessions(session_id, username, mission_id)
    VALUES (?, ?, ?)`).bind(sessionId, user.username, mission.id).run();
  return json({ sessionId, started: true }, 201, origin);
}

async function handleFinishSession(request, pathname, env, user, origin) {
  const match = pathname.match(/^\/api\/studies\/sessions\/([a-f0-9-]+)$/i);
  if (!match) return json({ error: 'Sessão não encontrada.' }, 404, origin);
  const body = await request.json().catch(() => ({}));
  const duration = Math.min(MAX_SESSION_SECONDS, Math.max(0, Math.floor(Number(body.durationSeconds || 0))));
  const result = await env.AUTH_DB.prepare(`UPDATE study_sessions
    SET finished_at=CURRENT_TIMESTAMP, duration_seconds=?, status='finished'
    WHERE session_id=? AND username=? AND status='active'`)
    .bind(duration, match[1], user.username).run();
  if (!Number(result.meta?.changes || 0)) return json({ error: 'Sessão já encerrada ou inexistente.' }, 409, origin);
  return json({ finished: true, durationSeconds: duration }, 200, origin);
}

export async function handleStudiesRoute(request, env, origin, originAllowed = true) {
  const url = new URL(request.url);
  if (request.method === 'OPTIONS') return preflight(origin, originAllowed);

  const access = await requireStudyUser(request, env, origin, originAllowed);
  if (access.response) return access.response;
  const user = access.user;

  if (request.method === 'GET' && url.pathname === '/api/studies/bootstrap') {
    return handleBootstrap(env, user, origin);
  }
  if (request.method === 'GET' && url.pathname === '/api/studies/achievements') {
    return handleAchievements(env, user, origin);
  }
  if (request.method === 'POST' && url.pathname === '/api/studies/attempts') {
    return handleAttempt(request, env, user, origin);
  }
  if (request.method === 'POST' && url.pathname === '/api/studies/sessions') {
    return handleStartSession(request, env, user, origin);
  }
  if (request.method === 'PATCH' && /^\/api\/studies\/sessions\/[a-f0-9-]+$/i.test(url.pathname)) {
    return handleFinishSession(request, url.pathname, env, user, origin);
  }
  if (request.method === 'POST' && /^\/api\/studies\/missions\/[^/]+\/complete$/.test(url.pathname)) {
    return handleComplete(url.pathname, env, user, origin);
  }
  return json({ error: 'Rota de estudos não encontrada.' }, 404, origin);
}
