'use strict';

import { validatePortalSession } from './auth-management-flex.js';
import {
  StudyRoundError, ensureRoundSchema, startStudyRound, recordRoundAttempt,
  evaluateStudyRound, commitReviewReward, finishStudySession, checkpointStudySession
} from './study-rounds.js';
import {
  STUDY_SOURCES,
  PUBLISHED_MISSIONS,
  PLANNED_MISSIONS,
  missionById,
  missionByTopicId,
  questionById,
  sourceMap
} from './studies-content/manifest.js';
import { curriculumSnapshot } from './studies-content/curriculum-v1.js';

const ALLOWED_USERNAME = 'wellyton';
const STUDY_TIME_ZONE = 'America/Campo_Grande';
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
      )`,
      `CREATE TABLE IF NOT EXISTS study_session_markers (
        session_id TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        mission_id TEXT NOT NULL,
        content_version INTEGER NOT NULL,
        view TEXT NOT NULL DEFAULT 'lesson' CHECK(view IN ('lesson','practice')),
        section_id TEXT,
        all_sections INTEGER NOT NULL DEFAULT 0 CHECK(all_sections IN (0,1)),
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`
    ];
    for (const sql of statements) await db.prepare(sql).run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_study_attempts_user_topic ON study_attempts(username, topic_id, attempted_at)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_study_sessions_user_finished ON study_sessions(username, finished_at)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_study_reviews_user_due ON study_reviews(username, status, due_at)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_study_session_markers_user ON study_session_markers(username, updated_at)').run();
    await ensureRoundSchema(db);
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
    kind: mission.kind || 'lesson',
    passScore: Number(mission.passScore || 0),
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
    { min: 150, level: 2, title: 'Explorador', next: 400 },
    { min: 400, level: 3, title: 'Praticante', next: 800 },
    { min: 800, level: 4, title: 'Estrategista', next: 1400 },
    { min: 1400, level: 5, title: 'Maratonista', next: 2200 },
    { min: 2200, level: 6, title: 'Veterano', next: null }
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

function localDayKey(value, timeZone = STUDY_TIME_ZONE) {
  const text = String(value || '').trim();
  if (!text) return '';
  const iso = text.includes('T') ? text : text.replace(' ', 'T') + 'Z';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone, year:'numeric', month:'2-digit', day:'2-digit'
  }).formatToParts(date);
  const get = (type) => parts.find((part) => part.type === type)?.value || '';
  const year = get('year'), month = get('month'), day = get('day');
  return year && month && day ? `${year}-${month}-${day}` : '';
}

function dayNumber(key) {
  const match = String(key || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return NaN;
  return Math.floor(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])) / 86400000);
}

export function computeStudyStreak(activityTimestamps, now = new Date(), timeZone = STUDY_TIME_ZONE) {
  const days = [...new Set((Array.isArray(activityTimestamps) ? activityTimestamps : [])
    .map((value) => localDayKey(value, timeZone))
    .filter(Boolean))]
    .sort()
    .reverse();

  const todayKey = localDayKey(now.toISOString(), timeZone);
  const today = dayNumber(todayKey);
  const numbers = days.map(dayNumber).filter(Number.isFinite);

  let best = 0;
  let run = 0;
  let previous = null;
  for (const current of numbers) {
    if (previous === null || previous - current === 1) run += 1;
    else run = 1;
    if (run > best) best = run;
    previous = current;
  }

  let current = 0;
  if (numbers.length && (numbers[0] === today || numbers[0] === today - 1)) {
    current = 1;
    for (let index = 1; index < numbers.length; index++) {
      if (numbers[index - 1] - numbers[index] !== 1) break;
      current++;
    }
  }

  return {
    current,
    best,
    lastStudyDay: days[0] || ''
  };
}

async function studyStreak(env, username) {
  const result = await env.AUTH_DB.prepare(`SELECT activity_at FROM (
      SELECT attempted_at AS activity_at
      FROM study_attempts
      WHERE username=?
      UNION ALL
      SELECT finished_at AS activity_at
      FROM study_sessions
      WHERE username=? AND status='finished' AND duration_seconds >= 60 AND finished_at IS NOT NULL
      UNION ALL
      SELECT created_at AS activity_at
      FROM study_xp_events
      WHERE username=?
    )
    WHERE activity_at IS NOT NULL
    ORDER BY activity_at DESC
    LIMIT 500`).bind(username, username, username).all();

  return computeStudyStreak((result.results || []).map((row) => row.activity_at));
}

export function summarizeRetentionEvidence(rows = [], totalCycles = 3) {
  const timestamp = (value) => {
    const text = String(value || '').trim();
    if (!text) return 0;
    const normalized = text.includes('T') ? text : text.replace(' ', 'T') + 'Z';
    const parsed = Date.parse(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  };
  const normalized = (Array.isArray(rows) ? rows : [])
    .map((row) => {
      const completedAt = String(row.completed_at || row.completedAt || '');
      return {
        cycle: Number(row.cycle || 0),
        score: row.score === null || row.score === undefined ? null : Number(row.score),
        completedAt,
        completedTime: timestamp(completedAt)
      };
    })
    .filter((row) => Number.isInteger(row.cycle) && row.cycle > 0)
    .sort((a, b) => a.cycle - b.cycle);

  const byCycle = new Map();
  for (const row of normalized) {
    const previous = byCycle.get(row.cycle);
    if (!previous || row.completedTime >= previous.completedTime) byCycle.set(row.cycle, row);
  }
  const cycles = [...byCycle.values()];
  const scored = cycles.filter((row) => Number.isFinite(row.score));
  const lastReview = cycles.reduce((current, row) =>
    !current || row.completedTime >= current.completedTime ? row : current, null);
  const completedCycles = cycles.length;
  const scoredCycles = scored.length;
  const status = completedCycles === 0 ? 'not_observed'
    : scoredCycles === 0 ? 'historical_unscored'
    : scoredCycles >= totalCycles ? 'schedule_observed'
    : 'collecting';

  return {
    totalCycles,
    completedCycles,
    scoredCycles,
    latestScore: Number.isFinite(lastReview?.score) ? Math.round(lastReview.score * 10) / 10 : null,
    latestCycle: lastReview?.cycle || null,
    lastReviewAt: lastReview?.completedAt || '',
    status,
    label: status === 'not_observed' ? 'Sem revisão posterior'
      : status === 'historical_unscored' ? 'Revisão histórica sem nota isolável'
      : status === 'schedule_observed' ? 'Ciclos previstos observados'
      : 'Evidência em coleta'
  };
}

async function learningEvidenceMap(env, username) {
  const result = await env.AUTH_DB.prepare(`SELECT v.topic_id, v.cycle, v.completed_at,
      (SELECT r.score FROM study_rounds r
        WHERE r.review_id=v.review_id AND r.username=v.username
          AND r.mode='review' AND r.status='passed' AND r.completed_at IS NOT NULL
        ORDER BY r.completed_at DESC LIMIT 1) AS score
    FROM study_reviews v
    WHERE v.username=? AND v.status='completed'
    ORDER BY v.topic_id, v.cycle, v.completed_at`).bind(username).all();

  const grouped = {};
  for (const row of result.results || []) {
    const topicId = String(row.topic_id || '');
    if (!topicId) continue;
    if (!grouped[topicId]) grouped[topicId] = [];
    grouped[topicId].push(row);
  }
  return Object.fromEntries(PUBLISHED_MISSIONS.map((mission) => [
    mission.topicId,
    summarizeRetentionEvidence(grouped[mission.topicId] || [])
  ]));
}

async function metrics(env, username, progress) {
  const [attempts, sessions, xpRow, reviews, streak] = await Promise.all([
    env.AUTH_DB.prepare(`SELECT COUNT(*) AS total,
      COALESCE(SUM(correct),0) AS correct FROM study_attempts WHERE username=?`).bind(username).first(),
    env.AUTH_DB.prepare(`SELECT COALESCE(SUM(duration_seconds),0) AS seconds
      FROM study_sessions WHERE username=? AND status IN ('active','finished')`).bind(username).first(),
    env.AUTH_DB.prepare(`SELECT COALESCE(SUM(points),0) AS xp
      FROM study_xp_events WHERE username=?`).bind(username).first(),
    env.AUTH_DB.prepare(`SELECT COUNT(*) AS pending FROM study_reviews
      WHERE username=? AND status='pending' AND due_at <= datetime('now')`).bind(username).first(),
    studyStreak(env, username)
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
    streak,
    ...computeCampaignProgress(progress)
  };
}

async function attemptedQuestionsMap(env, username) {
  const result = await env.AUTH_DB.prepare(`SELECT topic_id, question_id
    FROM study_attempts
    WHERE username=?
    GROUP BY topic_id, question_id
    ORDER BY topic_id, question_id`).bind(username).all();

  const map = {};
  for (const row of result.results || []) {
    const topicId = String(row.topic_id || '');
    const questionId = String(row.question_id || '');
    if (!topicId || !questionId) continue;
    if (!map[topicId]) map[topicId] = [];
    map[topicId].push(questionId);
  }
  return map;
}

async function achievementRows(env, username) {
  const result = await env.AUTH_DB.prepare(`SELECT achievement_id, rule_version, unlocked_at, source_ref
    FROM study_achievements WHERE username=? ORDER BY unlocked_at`).bind(username).all();
  const catalog = {
    'study.first_mission': { title: 'Primeira missão', description: 'Concluiu a primeira missão real da Missão Bancária.' },
    'study.sfn.boss': { title: 'Chefe do SFN vencido', description: 'Venceu o Chefe do primeiro bloco de Sistema Financeiro Nacional com o desempenho mínimo exigido.' }
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

async function dueReviewRows(env, username) {
  const result = await env.AUTH_DB.prepare(`SELECT review_id, topic_id, cycle, due_at
    FROM study_reviews
    WHERE username=? AND status='pending' AND due_at <= datetime('now')
    ORDER BY due_at ASC LIMIT 10`).bind(username).all();

  return (result.results || []).map((row) => {
    const mission = missionByTopicId(row.topic_id);
    if (!mission) return null;
    return {
      id: row.review_id,
      topicId: row.topic_id,
      cycle: Number(row.cycle || 0),
      dueAt: row.due_at,
      missionId: mission.id,
      title: mission.shortTitle || mission.title
    };
  }).filter(Boolean);
}

async function activeStudySession(env, username) {
  const row = await env.AUTH_DB.prepare(`SELECT s.session_id, s.mission_id, s.started_at, s.duration_seconds,
      r.mode, r.review_id, r.content_version
    FROM study_sessions s
    JOIN study_rounds r ON r.session_id=s.session_id AND r.username=s.username
    WHERE s.username=? AND s.status='active' AND r.status='active'
    ORDER BY s.started_at DESC LIMIT 1`).bind(username).first();
  if (!row) return null;

  const mission = missionById(row.mission_id);
  let resumable = Boolean(mission && Number(row.content_version) === Number(mission.contentVersion));
  let reason = resumable ? '' : 'O conteúdo desta sessão foi atualizado e não pode ser retomado com segurança.';
  let review = null;

  if (row.mode === 'review') {
    const reviewRow = row.review_id
      ? await env.AUTH_DB.prepare(`SELECT review_id, topic_id, cycle, due_at, status
          FROM study_reviews WHERE review_id=? AND username=? LIMIT 1`)
          .bind(row.review_id, username).first()
      : null;
    if (!reviewRow || reviewRow.status !== 'pending' || reviewRow.topic_id !== mission?.topicId) {
      resumable = false;
      reason = 'Esta revisão não está mais disponível para retomada.';
    } else {
      review = {
        id: reviewRow.review_id,
        topicId: reviewRow.topic_id,
        cycle: Number(reviewRow.cycle || 0),
        dueAt: reviewRow.due_at || '',
        missionId: mission?.id || row.mission_id,
        title: mission?.shortTitle || mission?.title || 'Revisão'
      };
    }
  }

  let marker = null;
  if (resumable && mission) {
    const markerRow = await env.AUTH_DB.prepare(`SELECT mission_id, content_version, view, section_id,
        all_sections, updated_at
      FROM study_session_markers
      WHERE session_id=? AND username=? LIMIT 1`).bind(row.session_id, username).first();
    if (markerRow && markerRow.mission_id === mission.id
      && Number(markerRow.content_version) === Number(mission.contentVersion)) {
      const sectionIds = new Set((mission.sections || []).map((section) => section.id));
      const sectionId = sectionIds.has(markerRow.section_id)
        ? markerRow.section_id
        : (mission.sections?.[0]?.id || '');
      marker = {
        view: markerRow.view === 'practice' ? 'practice' : 'lesson',
        sectionId,
        allSections: Boolean(Number(markerRow.all_sections || 0)),
        updatedAt: markerRow.updated_at || ''
      };
    }
  }

  let answers = [];
  if (resumable && mission) {
    const result = await env.AUTH_DB.prepare(`SELECT x.question_id, a.selected_option, a.correct
      FROM study_round_answers x
      JOIN study_attempts a ON a.attempt_id=x.attempt_id
      WHERE x.session_id=? AND a.username=? AND a.topic_id=?
      ORDER BY a.attempted_at, x.question_id`).bind(row.session_id, username, mission.topicId).all();
    const questions = new Map(mission.questions.map((question) => [question.id, question]));
    answers = (result.results || []).map((item) => {
      const question = questions.get(item.question_id);
      if (!question) return null;
      return {
        questionId: item.question_id,
        selectedOption: Number(item.selected_option),
        correct: Boolean(Number(item.correct)),
        explanation: question.explanation
      };
    }).filter(Boolean);
  }

  return {
    sessionId: row.session_id,
    missionId: row.mission_id,
    title: mission?.shortTitle || mission?.title || 'Sessão anterior',
    mode: row.mode,
    reviewId: row.review_id || null,
    review,
    durationSeconds: Math.max(0, Number(row.duration_seconds || 0)),
    startedAt: row.started_at || '',
    resumable,
    reason,
    marker,
    answers
  };
}

async function handleBootstrap(env, user, origin) {
  const progress = await progressMap(env, user.username);
  return json({
    user,
    roundProtocol: 1,
    timeProtocol: 1,
    markerProtocol: 1,
    contentRelease: 'sfn-v1.2',
    metrics: await metrics(env, user.username, progress),
    progress,
    curriculum: curriculumSnapshot(PUBLISHED_MISSIONS, progress),
    learningEvidence: await learningEvidenceMap(env, user.username),
    activeSession: await activeStudySession(env, user.username),
    attemptedQuestions: await attemptedQuestionsMap(env, user.username),
    reviews: await dueReviewRows(env, user.username),
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

async function readStudyBody(request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new StudyRoundError('Requisição de estudo inválida.', 400);
  }
  return body;
}

async function handleAttempt(request, env, user, origin) {
  const body = await readStudyBody(request);
  const found = questionById(body.questionId);
  if (!found) return json({ error: 'Questão não encontrada.' }, 404, origin);
  const result = await recordRoundAttempt(
    env.AUTH_DB, user.username, found.mission, found.question,
    body.selectedOption, body.sessionId
  );
  const correct = result.correct;

  const stats = await env.AUTH_DB.prepare(`SELECT COUNT(*) AS total, COALESCE(SUM(correct),0) AS correct
    FROM study_attempts WHERE username=? AND topic_id=?`).bind(user.username, found.mission.topicId).first();
  const total = Number(stats?.total || 0);
  const hits = Number(stats?.correct || 0);
  const mastery = total ? Math.round((hits / total) * 1000) / 10 : 0;
  await upsertPracticeProgress(env, user.username, found.mission, mastery);

  return json({
    correct,
    recorded: result.recorded,
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

async function handleComplete(request, pathname, env, user, origin) {
  const match = pathname.match(/^\/api\/studies\/missions\/([^/]+)\/complete$/);
  const mission = match ? missionById(decodeURIComponent(match[1])) : null;
  if (!mission) return json({ error: 'Missão não encontrada.' }, 404, origin);
  const body = await readStudyBody(request);
  // Revalida o pré-requisito também no fechamento. Isso invalida uma eventual
  // sessão futura criada por um cliente antigo antes de este gate existir.
  await assertMissionPrerequisite(env, user.username, mission);
  const result = await evaluateStudyRound(
    env.AUTH_DB, user.username, mission, body.sessionId,
    mission.kind === 'boss' ? 'boss' : 'lesson'
  );
  const bossResult = mission.kind === 'boss' ? result : null;
  if (bossResult && !bossResult.passed) {
    return json({
      error: `Chefe não vencido: ${bossResult.score}% de acertos. É necessário atingir pelo menos ${bossResult.passScore}%. Saia e reabra a missão para uma nova rodada.`,
      completed: false, passed: false, score: bossResult.score, passScore: bossResult.passScore
    }, 422, origin);
  }

  await env.AUTH_DB.prepare(`INSERT INTO study_topic_progress(
      username, topic_id, coverage_state, mastery_score, content_version_seen, started_at, completed_at
    ) VALUES (?, ?, 3, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT(username, topic_id) DO UPDATE SET
      coverage_state=3,
      mastery_score=CASE WHEN excluded.mastery_score > 0 THEN excluded.mastery_score ELSE study_topic_progress.mastery_score END,
      content_version_seen=MAX(study_topic_progress.content_version_seen,excluded.content_version_seen),
      started_at=COALESCE(study_topic_progress.started_at,CURRENT_TIMESTAMP),
      completed_at=COALESCE(study_topic_progress.completed_at,CURRENT_TIMESTAMP),
      updated_at=CURRENT_TIMESTAMP`).bind(
        user.username,
        mission.topicId,
        bossResult?.score || 0,
        mission.contentVersion
      ).run();

  const xpGranted = await grantXp(env, user.username, 'mission_complete', mission.id, mission.xp);
  const newAchievements = [];

  const firstMissionGranted = await grantAchievement(env, user.username, 'study.first_mission', mission.id);
  if (firstMissionGranted) {
    newAchievements.push({
      id: 'study.first_mission',
      title: 'Primeira missão',
      description: 'Você concluiu sua primeira missão real.'
    });
  }

  if (mission.kind === 'boss') {
    const bossAchievementGranted = await grantAchievement(env, user.username, 'study.sfn.boss', mission.id);
    if (bossAchievementGranted) {
      newAchievements.push({
        id: 'study.sfn.boss',
        title: 'Chefe do SFN vencido',
        description: 'Você venceu o Chefe do primeiro bloco de Sistema Financeiro Nacional.'
      });
    }
  }

  await scheduleReviews(env, user.username, mission.topicId);

  const progress = await progressMap(env, user.username);
  return json({
    completed: true,
    passed: mission.kind === 'boss' ? true : undefined,
    score: bossResult?.score,
    passScore: Number(mission.passScore || 0) || undefined,
    xpGranted: xpGranted ? mission.xp : 0,
    newAchievements,
    metrics: await metrics(env, user.username, progress)
  }, 200, origin);
}

async function handleCompleteReview(request, pathname, env, user, origin) {
  const match = pathname.match(/^\/api\/studies\/reviews\/([a-f0-9-]+)\/complete$/i);
  if (!match) return json({ error: 'Revisão não encontrada.' }, 404, origin);
  const body = await readStudyBody(request);
  const review = await env.AUTH_DB.prepare(`SELECT review_id, topic_id FROM study_reviews
    WHERE review_id=? AND username=? LIMIT 1`).bind(match[1], user.username).first();
  if (!review) return json({ error: 'Revisão não encontrada.' }, 404, origin);
  const mission = missionByTopicId(review.topic_id);
  if (!mission) return json({ error: 'Conteúdo da revisão não encontrado.' }, 404, origin);
  await evaluateStudyRound(env.AUTH_DB, user.username, mission, body.sessionId, 'review', review.review_id);
  const xpGranted = await commitReviewReward(env.AUTH_DB, user.username, review.review_id, body.sessionId);
  const progress = await progressMap(env, user.username);
  return json({
    completed: true,
    xpGranted,
    metrics: await metrics(env, user.username, progress),
    reviews: await dueReviewRows(env, user.username)
  }, 200, origin);
}

async function assertMissionPrerequisite(env, username, mission, reviewId = null) {
  // Revisões possuem seu próprio gate por review_id e só existem depois da
  // conclusão da missão correspondente.
  if (reviewId) return;
  const index = PUBLISHED_MISSIONS.findIndex((item) => item.id === mission.id);
  if (index <= 0) return;

  // Conteúdo já concluído pode ser reaberto para consulta ou nova prática.
  const own = await env.AUTH_DB.prepare(`SELECT coverage_state FROM study_topic_progress
    WHERE username=? AND topic_id=? LIMIT 1`).bind(username, mission.topicId).first();
  if (Number(own?.coverage_state || 0) >= 3) return;

  const previous = PUBLISHED_MISSIONS[index - 1];
  const row = await env.AUTH_DB.prepare(`SELECT coverage_state FROM study_topic_progress
    WHERE username=? AND topic_id=? LIMIT 1`).bind(username, previous.topicId).first();
  if (Number(row?.coverage_state || 0) < 3) {
    throw new StudyRoundError(
      `Conclua a missão anterior — ${previous.shortTitle || previous.title} — antes de iniciar esta etapa.`,
      409,
      'STUDY_PREREQUISITE_REQUIRED'
    );
  }
}

async function handleStartSession(request, env, user, origin) {
  const body = await readStudyBody(request);
  const mission = missionById(body.missionId);
  if (!mission) return json({ error: 'Missão não encontrada.' }, 404, origin);
  await assertMissionPrerequisite(env, user.username, mission, body.reviewId ?? null);
  const active = await activeStudySession(env, user.username);
  if (active) {
    throw new StudyRoundError(
      'Há uma sessão anterior ainda aberta. Retome ou encerre essa sessão antes de iniciar outra.',
      409,
      'STUDY_ACTIVE_SESSION_EXISTS'
    );
  }
  const result = await startStudyRound(env.AUTH_DB, user.username, mission, body.reviewId ?? null);
  return json({ ...result, markerProtocol: 1 }, 201, origin);
}

async function handleStudyMarker(request, pathname, env, user, origin) {
  const match = pathname.match(/^\/api\/studies\/sessions\/([a-f0-9-]+)\/marker$/i);
  if (!match) return json({ error: 'Sessão não encontrada.' }, 404, origin);
  const body = await readStudyBody(request);
  const view = body.view === 'practice' ? 'practice' : body.view === 'lesson' ? 'lesson' : '';
  if (!view || typeof body.allSections !== 'boolean' || typeof body.sectionId !== 'string') {
    throw new StudyRoundError('Marcador de leitura inválido.', 400, 'STUDY_MARKER_INVALID');
  }

  const row = await env.AUTH_DB.prepare(`SELECT s.mission_id, s.status AS session_status,
      r.status AS round_status, r.content_version
    FROM study_sessions s
    JOIN study_rounds r ON r.session_id=s.session_id AND r.username=s.username
    WHERE s.session_id=? AND s.username=? LIMIT 1`).bind(match[1], user.username).first();
  if (!row) throw new StudyRoundError('Sessão não encontrada.', 404, 'STUDY_SESSION_NOT_FOUND');
  if (row.session_status !== 'active' || row.round_status !== 'active') {
    throw new StudyRoundError('A sessão já foi encerrada.', 409, 'STUDY_SESSION_CLOSED');
  }

  const mission = missionById(row.mission_id);
  if (!mission || Number(row.content_version) !== Number(mission.contentVersion)) {
    throw new StudyRoundError('O conteúdo foi atualizado. O marcador antigo não será aplicado.', 409, 'STUDY_MARKER_CONTENT_CHANGED');
  }
  const validSections = new Set((mission.sections || []).map((section) => section.id));
  if (validSections.size && !validSections.has(body.sectionId)) {
    throw new StudyRoundError('Parte da aula não encontrada.', 400, 'STUDY_MARKER_SECTION_INVALID');
  }

  await env.AUTH_DB.prepare(`INSERT INTO study_session_markers(
      session_id, username, mission_id, content_version, view, section_id, all_sections, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(session_id) DO UPDATE SET
      username=excluded.username,
      mission_id=excluded.mission_id,
      content_version=excluded.content_version,
      view=excluded.view,
      section_id=excluded.section_id,
      all_sections=excluded.all_sections,
      updated_at=CURRENT_TIMESTAMP`)
    .bind(match[1], user.username, mission.id, mission.contentVersion, view,
      body.sectionId, body.allSections ? 1 : 0).run();

  return json({
    markerSaved: true,
    markerProtocol: 1,
    sessionId: match[1],
    marker: { view, sectionId: body.sectionId, allSections: body.allSections }
  }, 200, origin);
}

async function handleFinishSession(request, pathname, env, user, origin) {
  const match = pathname.match(/^\/api\/studies\/sessions\/([a-f0-9-]+)$/i);
  if (!match) return json({ error: 'Sessão não encontrada.' }, 404, origin);
  const body = await readStudyBody(request);
  const result = await finishStudySession(env.AUTH_DB, user.username, match[1], body.durationSeconds);
  return json(result, 200, origin);
}

async function handleTimeCheckpoint(request, pathname, env, user, origin) {
  const match = pathname.match(/^\/api\/studies\/sessions\/([a-f0-9-]+)\/checkpoint$/i);
  if (!match) return json({ error: 'Sessão não encontrada.' }, 404, origin);
  const body = await readStudyBody(request);
  const result = await checkpointStudySession(env.AUTH_DB, user.username, match[1], body.durationSeconds);
  return json(result, 200, origin);
}

export async function handleStudiesRoute(request, env, origin, originAllowed = true) {
  const url = new URL(request.url);
  if (request.method === 'OPTIONS') return preflight(origin, originAllowed);

  const access = await requireStudyUser(request, env, origin, originAllowed);
  if (access.response) return access.response;
  const user = access.user;

  try {
    if (request.method === 'GET' && url.pathname === '/api/studies/bootstrap') {
      return await handleBootstrap(env, user, origin);
    }
    if (request.method === 'GET' && url.pathname === '/api/studies/achievements') {
      return await handleAchievements(env, user, origin);
    }
    if (request.method === 'POST' && url.pathname === '/api/studies/attempts') {
      return await handleAttempt(request, env, user, origin);
    }
    if (request.method === 'POST' && url.pathname === '/api/studies/sessions') {
      return await handleStartSession(request, env, user, origin);
    }
    if (request.method === 'POST' && /^\/api\/studies\/sessions\/[a-f0-9-]+\/checkpoint$/i.test(url.pathname)) {
      return await handleTimeCheckpoint(request, url.pathname, env, user, origin);
    }
    if (request.method === 'POST' && /^\/api\/studies\/sessions\/[a-f0-9-]+\/marker$/i.test(url.pathname)) {
      return await handleStudyMarker(request, url.pathname, env, user, origin);
    }
    if (request.method === 'PATCH' && /^\/api\/studies\/sessions\/[a-f0-9-]+$/i.test(url.pathname)) {
      return await handleFinishSession(request, url.pathname, env, user, origin);
    }
    if (request.method === 'POST' && /^\/api\/studies\/missions\/[^/]+\/complete$/.test(url.pathname)) {
      return await handleComplete(request, url.pathname, env, user, origin);
    }
    if (request.method === 'POST' && /^\/api\/studies\/reviews\/[a-f0-9-]+\/complete$/i.test(url.pathname)) {
      return await handleCompleteReview(request, url.pathname, env, user, origin);
    }
    return json({ error: 'Rota de estudos não encontrada.' }, 404, origin);
  } catch (error) {
    if (error instanceof StudyRoundError) {
      return json({ error: error.message, code: error.code }, error.status, origin);
    }
    throw error;
  }
}
