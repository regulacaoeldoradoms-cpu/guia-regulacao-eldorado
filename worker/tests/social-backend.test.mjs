import assert from 'node:assert/strict';
import test from 'node:test';

let DatabaseSync = null;
try {
  ({ DatabaseSync } = await import('node:sqlite'));
} catch (_) {
  // As suítes históricas ainda podem rodar em Node anterior ao node:sqlite.
  // O workflow social fixa Node 24 e sempre executa estes testes de integração.
}
const sqliteTest = DatabaseSync ? test : test.skip;

import { ensureAuthSchema, handlePortalRoute } from '../auth-management-v2.js';
import { handleChatRoute } from '../portal-chat-v2.js';
import { persistAtomicChatMessage } from '../chat-send-atomic.js';
import { handleProfileRoute } from '../profile-photo.js';
import { handleSocialRoute } from '../social.js';
import {
  ensureInitialProfessionalFriendships,
  ensureSocialSchema,
  provisionProfessionalSocialGraph,
  resolveSocialUser,
  syncSocialUser
} from '../social-schema.js';
import {
  canCreateManualRelationship,
  canDiscoverSocialProfile,
  relationshipStateFor,
  rolePresentation,
  socialGate
} from '../social-policy.js';

class D1Statement {
  constructor(database, sql, values = []) {
    this.database = database;
    this.sql = sql;
    this.values = values;
  }

  bind(...values) {
    return new D1Statement(this.database, this.sql, values);
  }

  run() {
    const result = this.database.prepare(this.sql).run(...this.values);
    return {
      success: true,
      meta: {
        changes: Number(result.changes || 0),
        last_row_id: Number(result.lastInsertRowid || 0)
      }
    };
  }

  first() {
    return this.database.prepare(this.sql).get(...this.values) || null;
  }

  all() {
    return { results: this.database.prepare(this.sql).all(...this.values) };
  }
}

class D1Database {
  constructor(database = null) {
    this.database = database || new DatabaseSync(':memory:');
    this.preparedSql = [];
  }

  prepare(sql) {
    this.preparedSql.push(String(sql));
    return new D1Statement(this.database, sql);
  }
}

function environment() {
  return {
    AUTH_DB: new D1Database(),
    AUTH_SESSION_SECRET: 'segredo-local-apenas-para-testes-automatizados',
    AUTH_RATE_LIMIT_SECRET: 'limite-local-apenas-para-testes',
    SOCIAL_BACKEND_ENABLED: 'true',
    SOCIAL_HOME_ENABLED: 'false'
  };
}

async function payload(response) {
  return response.json();
}

async function register(env, username, ip = '127.0.0.1') {
  const response = await handlePortalRoute(new Request('https://portal.test/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': ip },
    body: JSON.stringify({ username, password: 'Senha-Segura-2026' })
  }), env, '', true);
  assert.equal(response.status, 201);
  return payload(response);
}

function socialRequest(path, token, options = {}) {
  return new Request(`https://portal.test${path}`, {
    method: options.method || 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });
}

async function callSocial(env, path, token, options = {}) {
  return handleSocialRoute(socialRequest(path, token, options), env, '', true);
}

async function callChat(env, path, token, options = {}) {
  return handleChatRoute(socialRequest(path, token, options), env, '', true);
}

async function ensureAtomicChatTestSchema(env) {
  await env.AUTH_DB.prepare(`CREATE TABLE IF NOT EXISTS portal_chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_user TEXT NOT NULL,
    to_user TEXT NOT NULL,
    body TEXT NOT NULL,
    client_id TEXT,
    sent_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    delivered_at TEXT,
    read_at TEXT
  )`).run();
  await env.AUTH_DB.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS idx_chat_client_message
    ON portal_chat_messages(from_user, client_id) WHERE client_id IS NOT NULL`).run();
}

test('política libera a camada social para toda conta ativa e mantém permissões e estados separados', () => {
  const bronze = { active: true, emailVerified: false };
  assert.equal(socialGate(bronze, {}).allowed, true);
  assert.equal(socialGate(bronze, {}).level, 'bronze');
  assert.equal(socialGate({ ...bronze, emailVerified: true }, {}).allowed, true);
  assert.equal(socialGate({ ...bronze, emailVerified: true }, { suspended_at: '2026-09-06' }).code, 'SOCIAL_SUSPENDED');
  assert.equal(socialGate({ ...bronze, active: false }, {}).code, 'ACCOUNT_INACTIVE');

  const citizenA = { social_user_id: 'a', role: 'cidadao' };
  const citizenB = { social_user_id: 'b', role: 'cidadao', active: 1, profile_visibility: 'portal', acceptFriendRequests: 1 };
  const doctor = { social_user_id: 'm', role: 'medico', active: 1, profile_visibility: 'portal', acceptFriendRequests: 1 };
  assert.equal(canCreateManualRelationship(citizenA, citizenB), true);
  assert.equal(canCreateManualRelationship(citizenA, doctor), true);
  assert.equal(canDiscoverSocialProfile(citizenA, citizenB, null), true);
  assert.equal(canDiscoverSocialProfile(citizenA, doctor, null), true);
  assert.equal(canDiscoverSocialProfile(citizenA, { ...doctor, profile_visibility: 'friends' }, null), false);
  assert.equal(rolePresentation({ role: 'cidadao', councilRole: 'membro', jobTitle: '' }).label, 'Membro do Conselho');
  assert.equal(rolePresentation({ role: 'cidadao', councilRole: 'presidente', jobTitle: '' }).label, 'Presidente do Conselho');
  assert.equal(rolePresentation({ role: 'medico', councilRole: 'presidente', jobTitle: 'Clínico' }).label, 'Médico(a)',
    'cargo profissional permanece a identidade principal quando a conta também participa do Conselho');
  assert.equal(relationshipStateFor('a', 'b', { state: 'pending', initiated_by: 'a' }), 'sent');
  assert.equal(relationshipStateFor('a', 'b', { state: 'pending', initiated_by: 'b' }), 'received');
  assert.equal(relationshipStateFor('a', 'b', { state: 'blocked', blocked_by: 'b' }), 'unavailable');
});

sqliteTest('busca social inclui membros e Presidência do Conselho mesmo antes do primeiro acesso social', async () => {
  const env = environment();
  const viewer = await register(env, 'busca.conselho', '127.0.0.41');
  await register(env, 'joana.colegiado', '127.0.0.42');
  await register(env, 'maria.presidencia', '127.0.0.43');

  await env.AUTH_DB.prepare(`UPDATE auth_users SET
      name = CASE username
        WHEN 'joana.colegiado' THEN 'Joana da Silva'
        WHEN 'maria.presidencia' THEN 'Maria Souza'
        ELSE name END,
      council_role = CASE username
        WHEN 'joana.colegiado' THEN 'membro'
        WHEN 'maria.presidencia' THEN 'presidente'
        ELSE council_role END,
      accept_friend_requests = 1
    WHERE username IN ('joana.colegiado','maria.presidencia')`).run();

  await ensureSocialSchema(env);
  const before = await env.AUTH_DB.prepare(`SELECT COUNT(*) AS total
    FROM social_users WHERE auth_username IN ('joana.colegiado','maria.presidencia')`).first();
  assert.equal(Number(before?.total || 0), 0, 'contas do Conselho ainda não precisam ter aberto a Camada Social');

  const memberSearch = await payload(await callSocial(env, '/api/social/search?q=joana', viewer.token));
  const member = memberSearch.profiles.find((item) => item.handle === 'joana.colegiado');
  assert.ok(member, 'membro do Conselho deve ser localizável por nome');
  assert.equal(member.professional?.label, 'Membro do Conselho');

  const presidentSearch = await payload(await callSocial(env, '/api/social/search?q=presidente', viewer.token));
  const president = presidentSearch.profiles.find((item) => item.handle === 'maria.presidencia');
  assert.ok(president, 'Presidência deve ser localizável pelo cargo do Conselho');
  assert.equal(president.professional?.label, 'Presidente do Conselho');

  const after = await env.AUTH_DB.prepare(`SELECT COUNT(*) AS total
    FROM social_users WHERE auth_username IN ('joana.colegiado','maria.presidencia')`).first();
  assert.equal(Number(after?.total || 0), 2, 'a busca deve sincronizar identidades sociais faltantes do Conselho');
});

sqliteTest('flag desligada contém schema, semeadura e aliases sociais', async () => {
  const env = environment();
  env.SOCIAL_BACKEND_ENABLED = 'false';
  await ensureAuthSchema(env);
  assert.equal(await ensureSocialSchema(env), false);
  assert.deepEqual(await provisionProfessionalSocialGraph(env), { users: 0, pairs: 0 });
  const socialTable = await env.AUTH_DB.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'social_users'").first();
  assert.equal(socialTable, null);
});

sqliteTest('novo isolate reconhece a migração social sem repetir todo o DDL', async () => {
  const env = environment();
  await ensureAuthSchema(env);
  await ensureSocialSchema(env);

  const coldBinding = new D1Database(env.AUTH_DB.database);
  const coldEnv = { ...env, AUTH_DB: coldBinding };
  assert.equal(await ensureSocialSchema(coldEnv), true);
  assert.equal(coldBinding.preparedSql.length, 1);
  assert.match(coldBinding.preparedSql[0], /SELECT version FROM social_schema_migrations/);
  assert.equal(coldBinding.preparedSql.some((sql) => /\b(?:CREATE|ALTER|PRAGMA)\b/i.test(sql)), false);
});

sqliteTest('migração profissional é idempotente e preserva tombstone', async () => {
  const env = environment();
  await ensureAuthSchema(env);
  const insert = env.AUTH_DB.prepare(`INSERT INTO auth_users
    (username, name, job_title, role, password_hash, password_salt, active,
      must_change_password, session_version, created_by, self_registered)
    VALUES (?, ?, ?, ?, 'hash', 'salt', 1, 0, 1, ?, 0)`);
  await insert.bind('dev', 'Desenvolvedor', 'Desenvolvedor', 'admin', 'bootstrap').run();
  await insert.bind('medica', 'Médica', 'Médica reguladora', 'medico', 'dev').run();
  await insert.bind('recepcao', 'Recepção', 'Recepção', 'recepcao', 'dev').run();
  await insert.bind('coordenada', 'Criada pela Coordenação', 'Recepção', 'recepcao', 'recepcao').run();
  await insert.bind('cidada', 'Conta cidadã', 'Cidadão', 'cidadao', 'self').run();

  await ensureSocialSchema(env);
  const first = await ensureInitialProfessionalFriendships(env);
  assert.equal(first.users, 3, 'apenas profissionais provisionados pelo Desenvolvedor/bootstrap');
  assert.equal(first.pairs, 3);
  const second = await ensureInitialProfessionalFriendships(env);
  assert.equal(second.existing, true);
  assert.equal((await env.AUTH_DB.prepare("SELECT COUNT(*) AS total FROM social_relationships WHERE state = 'friends'").first()).total, 3);

  const dev = await syncSocialUser(env, 'dev');
  const doctor = await syncSocialUser(env, 'medica');
  const pair = [dev.social_user_id, doctor.social_user_id].sort();
  await env.AUTH_DB.prepare(`UPDATE social_relationships SET state = 'removed', tombstone = 1
    WHERE pair_low = ? AND pair_high = ?`).bind(pair[0], pair[1]).run();
  await provisionProfessionalSocialGraph(env);
  const removed = await env.AUTH_DB.prepare('SELECT state, tombstone FROM social_relationships WHERE pair_low = ? AND pair_high = ?')
    .bind(pair[0], pair[1]).first();
  assert.equal(removed.state, 'removed');
  assert.equal(removed.tombstone, 1);

  await insert.bind('nova.medica', 'Nova médica', 'Médica reguladora', 'medico', 'dev').run();
  const provisioned = await provisionProfessionalSocialGraph(env, 'nova.medica');
  assert.equal(provisioned.pairs, 3, 'nova profissional recebe os pares elegíveis sem ressuscitar tombstone antigo');
});

sqliteTest('aliases preservam links após mudança de handle', async () => {
  const env = environment();
  await ensureAuthSchema(env);
  await env.AUTH_DB.prepare(`INSERT INTO auth_users
    (username, name, job_title, role, password_hash, password_salt, active,
      must_change_password, session_version, created_by, self_registered)
    VALUES ('cidada', 'Pessoa Cidadã', 'Cidadão', 'cidadao', 'hash', 'salt', 1, 0, 1, 'self', 1)`).run();
  const original = await syncSocialUser(env, 'cidada');
  await env.AUTH_DB.prepare("UPDATE auth_users SET public_handle = 'novo.handle' WHERE username = 'cidada'").run();
  const updated = await syncSocialUser(env, 'cidada');
  const oldLink = await resolveSocialUser(env, 'cidada');
  const newLink = await resolveSocialUser(env, 'novo.handle');
  assert.equal(updated.social_user_id, original.social_user_id);
  assert.equal(oldLink.social_user_id, original.social_user_id);
  assert.equal(newLink.social_user_id, original.social_user_id);
  assert.equal(newLink.handle, 'novo.handle');
});

sqliteTest('perfil protegido não pode ser enumerado por ação direta de amizade', async () => {
  const env = environment();
  const viewer = await register(env, 'visitante.social', '127.0.0.31');
  const protectedUser = await register(env, 'perfil.fechado', '127.0.0.32');
  await env.AUTH_DB.prepare("UPDATE auth_users SET email_verified = 1 WHERE username IN ('visitante.social','perfil.fechado')").run();
  await callSocial(env, '/api/social/me', viewer.token, {
    method: 'PATCH', body: { profileVisibility: 'portal', acceptFriendRequests: true }
  });
  await callSocial(env, '/api/social/me', protectedUser.token, {
    method: 'PATCH', body: { profileVisibility: 'friends', acceptFriendRequests: false }
  });

  for (const action of ['request', 'block']) {
    const response = await callSocial(env, '/api/social/relationships', viewer.token, {
      method: 'POST', body: { action, targetHandle: 'perfil.fechado' }
    });
    assert.equal(response.status, 404);
    assert.equal((await payload(response)).error, 'Perfil social não disponível para esta ação.');
  }
  const relationships = await env.AUTH_DB.prepare('SELECT COUNT(*) AS total FROM social_relationships').first();
  assert.equal(relationships.total, 0);
});

sqliteTest('fluxo social real funciona desde a Conta Bronze e mantém amizade, feed e bloqueio', async () => {
  const env = environment();
  env.SOCIAL_HOME_ENABLED = 'true';
  const first = await register(env, 'ana.social', '127.0.0.10');
  const second = await register(env, 'bia.social', '127.0.0.11');

  const bronzeConfig = await payload(await callSocial(env, '/api/social/config', first.token));
  assert.equal(bronzeConfig.homeEnabled, true);
  assert.equal(bronzeConfig.available, true);
  assert.equal(bronzeConfig.accountLevel, 'bronze');
  assert.equal(bronzeConfig.gate, null);

  const bronzePost = await callSocial(env, '/api/social/posts', first.token, {
    method: 'POST', body: { body: 'Publicação disponível desde o primeiro acesso' }
  });
  assert.equal(bronzePost.status, 201);
  const bronzePostPayload = await payload(bronzePost);

  for (const session of [first, second]) {
    const configured = await callSocial(env, '/api/social/me', session.token, {
      method: 'PATCH', body: { profileVisibility: 'portal', acceptFriendRequests: true }
    });
    assert.equal(configured.status, 200);
  }

  const search = await callSocial(env, '/api/social/search?q=bia', first.token);
  assert.equal(search.status, 200);
  assert.equal((await payload(search)).profiles[0].handle, 'bia.social');

  const requested = await callSocial(env, '/api/social/relationships', first.token, {
    method: 'POST', body: { action: 'request', targetHandle: 'bia.social' }
  });
  const requestPayload = await payload(requested);
  assert.equal(requestPayload.relationship, 'sent', JSON.stringify(requestPayload));
  const accepted = await callSocial(env, '/api/social/relationships', second.token, {
    method: 'POST', body: { action: 'accept', targetHandle: 'ana.social' }
  });
  assert.equal((await payload(accepted)).relationship, 'friends');

  const post = await callSocial(env, '/api/social/posts', second.token, {
    method: 'POST', body: { body: 'Uma atualização social segura', audience: 'friends' }
  });
  assert.equal(post.status, 201);
  const postPayload = await payload(post);
  assert.equal(postPayload.post.body, 'Uma atualização social segura');

  const feed = await callSocial(env, '/api/social/feed', first.token);
  assert.equal(feed.status, 200);
  const feedPosts = (await payload(feed)).posts;
  assert.ok(feedPosts.some((item) => item.id === bronzePostPayload.post.id));
  assert.ok(feedPosts.some((item) => item.id === postPayload.post.id));

  const blocked = await callSocial(env, '/api/social/relationships', second.token, {
    method: 'POST', body: { action: 'block', targetHandle: 'ana.social' }
  });
  assert.equal((await payload(blocked)).relationship, 'blocked');
  const hiddenProfile = await callSocial(env, '/api/social/profiles/bia.social', first.token);
  assert.equal(hiddenProfile.status, 404, 'a pessoa bloqueada deixa de descobrir o bloqueador');
  const blockedRequest = await callSocial(env, '/api/social/relationships', first.token, {
    method: 'POST', body: { action: 'request', targetHandle: 'bia.social' }
  });
  assert.equal(blockedRequest.status, 404, 'a pessoa bloqueada não consegue interagir com o bloqueador');
  const blockedComment = await callSocial(env, `/api/social/posts/${postPayload.post.id}/comments`, first.token, {
    method: 'POST', body: { body: 'Tentativa após bloqueio' }
  });
  assert.equal(blockedComment.status, 404);

  const chatTables = await env.AUTH_DB.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'portal_chat_messages'").first();
  assert.equal(chatTables, null, 'amizade e bloqueio social não alteram nem criam o chat profissional');
});

sqliteTest('foto social recebe versão estável e muda somente quando o avatar é atualizado', async () => {
  const env = environment();
  const session = await register(env, 'avatar.social', '127.0.0.90');
  await env.AUTH_DB.prepare("UPDATE auth_users SET email_verified = 1 WHERE username = 'avatar.social'").run();

  const firstPhoto = await handleProfileRoute(socialRequest('/api/auth/profile', session.token, {
    method: 'PATCH',
    body: { avatarDataUrl: 'data:image/png;base64,YXZhdGFyLTE=' }
  }), env, '', true);
  assert.equal(firstPhoto.status, 200);
  const firstPayload = await payload(firstPhoto);
  assert.ok(firstPayload.avatarVersion);

  const firstProfile = await payload(await callSocial(env, '/api/social/me', session.token));
  assert.equal(firstProfile.profile.avatarAvailable, true);
  assert.equal(firstProfile.profile.avatarVersion, firstPayload.avatarVersion);

  const image = await callSocial(env, '/api/social/avatars/avatar.social', session.token);
  assert.equal(image.status, 200);
  assert.equal(image.headers.get('X-Portal-Avatar-Version'), firstPayload.avatarVersion);
  assert.match(image.headers.get('ETag') || '', /avatar-/);

  const unchangedProfile = await payload(await callSocial(env, '/api/social/me', session.token));
  assert.equal(unchangedProfile.profile.avatarVersion, firstPayload.avatarVersion);

  const target = await register(env, 'alvo.avatar', '127.0.0.91');
  await env.AUTH_DB.prepare("UPDATE auth_users SET email_verified = 1 WHERE username = 'alvo.avatar'").run();
  const crossAccountAttempt = await handleProfileRoute(socialRequest('/api/auth/profile', session.token, {
    method: 'PATCH',
    body: {
      avatarDataUrl: 'data:image/png;base64,VElUVUxBUi1TT01FTlRF',
      targetUsername: 'alvo.avatar'
    }
  }), env, '', true);
  assert.equal(crossAccountAttempt.status, 200);
  const targetAvatar = await env.AUTH_DB.prepare("SELECT avatar_data AS avatarData FROM auth_users WHERE username = 'alvo.avatar'").first();
  assert.equal(targetAvatar.avatarData, '', 'parâmetro de alvo não pode alterar a foto de outra conta');
  const sessionAvatar = await env.AUTH_DB.prepare("SELECT avatar_data AS avatarData FROM auth_users WHERE username = 'avatar.social'").first();
  assert.equal(sessionAvatar.avatarData, 'data:image/png;base64,VElUVUxBUi1TT01FTlRF',
    'o endpoint de foto permanece vinculado ao usuário autenticado');

  const secondPhoto = await handleProfileRoute(socialRequest('/api/auth/profile', session.token, {
    method: 'PATCH',
    body: { avatarDataUrl: 'data:image/png;base64,YXZhdGFyLTI=' }
  }), env, '', true);
  assert.equal(secondPhoto.status, 200);
  const secondPayload = await payload(secondPhoto);
  assert.ok(secondPayload.avatarVersion);
  assert.notEqual(secondPayload.avatarVersion, firstPayload.avatarVersion);

  const secondProfile = await payload(await callSocial(env, '/api/social/me', session.token));
  assert.equal(secondProfile.profile.avatarVersion, secondPayload.avatarVersion);
});

sqliteTest('Home social é universal para todos os papéis e não depende de e-mail confirmado', async () => {
  const env = environment();
  env.SOCIAL_HOME_ENABLED = 'true';
  const roles = ['cidadao', 'medico', 'recepcao', 'coordenacao', 'telemedicina', 'admin'];

  for (const [index, role] of roles.entries()) {
    const username = `home.${role}`;
    const session = await register(env, username, `127.0.1.${index + 1}`);
    await env.AUTH_DB.prepare('UPDATE auth_users SET role = ?, email_verified = 0 WHERE username = ?')
      .bind(role, username).run();
    const config = await payload(await callSocial(env, '/api/social/config', session.token));
    assert.equal(config.homeEnabled, true, role);
    assert.equal(config.available, true, role);
    assert.equal(config.accountLevel, 'bronze', role);
    assert.equal(config.gate, null, role);
    assert.equal(config.profile.homePreference, 'feed', role);
  }
});

sqliteTest('mutação é limitada ao autor e preferências próprias não vazam', async () => {
  const env = environment();
  const first = await register(env, 'clara.social', '127.0.0.20');
  const second = await register(env, 'dora.social', '127.0.0.21');
  await env.AUTH_DB.prepare("UPDATE auth_users SET email_verified = 1, accept_friend_requests = 1 WHERE username IN ('clara.social','dora.social')").run();

  for (const session of [first, second]) {
    const configured = await callSocial(env, '/api/social/me', session.token, {
      method: 'PATCH', body: { profileVisibility: 'portal', acceptFriendRequests: true, homePreference: 'tools' }
    });
    assert.equal(configured.status, 200);
    assert.equal((await payload(configured)).profile.homePreference, 'feed');
  }
  await callSocial(env, '/api/social/relationships', first.token, {
    method: 'POST', body: { action: 'request', targetHandle: 'dora.social' }
  });
  await callSocial(env, '/api/social/relationships', second.token, {
    method: 'POST', body: { action: 'accept', targetHandle: 'clara.social' }
  });

  const created = await callSocial(env, '/api/social/posts', second.token, {
    method: 'POST', body: { body: 'Conteúdo pertencente à Dora', audience: 'friends' }
  });
  const createdBody = await payload(created);
  const postId = createdBody.post.id;
  const unauthorizedEdit = await callSocial(env, `/api/social/posts/${postId}`, first.token, {
    method: 'PATCH', body: { body: 'Tentativa de alteração' }
  });
  assert.equal(unauthorizedEdit.status, 404);
  const unauthorizedDelete = await callSocial(env, `/api/social/posts/${postId}`, first.token, { method: 'DELETE' });
  assert.equal(unauthorizedDelete.status, 404);
  const unauthorizedProfileEdit = await callSocial(env, '/api/social/profiles/dora.social', first.token, {
    method: 'PATCH', body: { bio: 'Tentativa de alteração' }
  });
  assert.equal(unauthorizedProfileEdit.status, 404);
  const ownEdit = await payload(await callSocial(env, `/api/social/posts/${postId}`, second.token, {
    method: 'PATCH', body: { body: 'Conteúdo atualizado pela autora', audience: 'friends' }
  }));
  assert.equal(ownEdit.post.body, 'Conteúdo atualizado pela autora');

  const comment = await callSocial(env, `/api/social/posts/${postId}/comments`, first.token, {
    method: 'POST', body: { body: 'Comentário da Clara' }
  });
  const commentId = (await payload(comment)).comment.id;
  const unauthorizedCommentDelete = await callSocial(env, `/api/social/comments/${commentId}`, second.token, { method: 'DELETE' });
  assert.equal(unauthorizedCommentDelete.status, 404);
  const ownCommentDelete = await callSocial(env, `/api/social/comments/${commentId}`, first.token, { method: 'DELETE' });
  assert.equal(ownCommentDelete.status, 200);

  const otherProfile = await payload(await callSocial(env, '/api/social/profiles/dora.social', first.token));
  assert.equal(otherProfile.profile.homePreference, undefined);
  assert.equal(otherProfile.profile.defaultPostAudience, undefined);
  assert.equal(otherProfile.profile.profileVisibility, undefined);
  assert.equal(Object.hasOwn(otherProfile.profile, 'email'), false);

  const secondComment = await payload(await callSocial(env, `/api/social/posts/${postId}/comments`, first.token, {
    method: 'POST', body: { body: 'Será removido junto com o post' }
  }));
  await callSocial(env, `/api/social/posts/${postId}/reaction`, first.token, { method: 'PUT' });
  const ownDelete = await callSocial(env, `/api/social/posts/${postId}`, second.token, { method: 'DELETE' });
  assert.equal(ownDelete.status, 200);
  const deletedPost = await env.AUTH_DB.prepare('SELECT status, body FROM social_posts WHERE id = ?').bind(postId).first();
  assert.equal(deletedPost.status, 'deleted');
  assert.equal(deletedPost.body, '');
  const deletedComment = await env.AUTH_DB.prepare('SELECT status, body FROM social_comments WHERE id = ?').bind(secondComment.comment.id).first();
  assert.equal(deletedComment.status, 'deleted');
  assert.equal(deletedComment.body, '');
  assert.equal((await env.AUTH_DB.prepare('SELECT COUNT(*) AS total FROM social_reactions WHERE post_id = ?').bind(postId).first()).total, 0);

  const citizenChat = await callChat(env, '/api/chat/users', first.token);
  assert.equal(citizenChat.status, 200, 'amizade aceita entre cidadãos libera somente o chat social entre o par');
  const citizenContacts = (await payload(citizenChat)).users;
  assert.ok(citizenContacts.some((item) => item.username === 'dora.social' && item.role === 'cidadao'));

  const citizenMessage = await callChat(env, '/api/chat/messages', first.token, {
    method: 'POST', body: { to: 'dora.social', body: 'Conversa social entre amigos' }
  });
  assert.equal(citizenMessage.status, 201);
  const unreadBeforePeek = await env.AUTH_DB.prepare(`SELECT COUNT(*) AS total FROM portal_chat_messages
    WHERE to_user = 'dora.social' AND from_user = 'clara.social' AND read_at IS NULL`).first();
  assert.equal(Number(unreadBeforePeek.total || 0), 1);

  const preloadedConversation = await payload(await callChat(
    env,
    '/api/chat/messages?with=clara.social&after=0&peek=1',
    second.token
  ));
  assert.equal(preloadedConversation.messages.at(-1).body, 'Conversa social entre amigos');
  const unreadAfterPeek = await env.AUTH_DB.prepare(`SELECT COUNT(*) AS total FROM portal_chat_messages
    WHERE to_user = 'dora.social' AND from_user = 'clara.social' AND read_at IS NULL`).first();
  assert.equal(Number(unreadAfterPeek.total || 0), 1, 'pré-carregamento não pode marcar a mensagem como lida');
  const receiptAfterPeek = await env.AUTH_DB.prepare(`SELECT delivered_at AS deliveredAt, read_at AS readAt
    FROM portal_chat_messages WHERE to_user = 'dora.social' AND from_user = 'clara.social'
    ORDER BY id DESC LIMIT 1`).first();
  assert.equal(receiptAfterPeek.deliveredAt, null, 'pré-carregamento não equivale a abrir o chat');
  assert.equal(receiptAfterPeek.readAt, null);

  const delivered = await callChat(env, '/api/chat/delivery', second.token, { method: 'POST', body: {} });
  assert.equal(delivered.status, 200);
  const receiptAfterChatOpen = await env.AUTH_DB.prepare(`SELECT id, delivered_at AS deliveredAt, read_at AS readAt
    FROM portal_chat_messages WHERE to_user = 'dora.social' AND from_user = 'clara.social'
    ORDER BY id DESC LIMIT 1`).first();
  assert.ok(receiptAfterChatOpen.deliveredAt, 'abrir o chat marca a mensagem como recebida');
  assert.equal(receiptAfterChatOpen.readAt, null, 'abrir só o chat não pode marcar a conversa como visualizada');

  const senderReceipt = await payload(await callChat(
    env,
    '/api/chat/messages?with=dora.social&after=0&peek=1',
    first.token
  ));
  assert.ok(Number(senderReceipt.receipt.deliveredThroughId || 0) >= Number(receiptAfterChatOpen.id || 0));
  assert.equal(Number(senderReceipt.receipt.readThroughId || 0), 0);

  const citizenConversation = await payload(await callChat(env, '/api/chat/messages?with=clara.social', second.token));
  assert.equal(citizenConversation.messages.at(-1).body, 'Conversa social entre amigos');
  const unreadAfterOpen = await env.AUTH_DB.prepare(`SELECT COUNT(*) AS total FROM portal_chat_messages
    WHERE to_user = 'dora.social' AND from_user = 'clara.social' AND read_at IS NULL`).first();
  assert.equal(Number(unreadAfterOpen.total || 0), 0, 'abrir a conversa continua marcando as mensagens como lidas');

  const optimisticClientId = 'chat-123456789abc-idempotente';
  const optimisticFirst = await callChat(env, '/api/chat/messages', first.token, {
    method: 'POST',
    body: { to: 'dora.social', body: 'Envio otimista idempotente', clientId: optimisticClientId }
  });
  assert.equal(optimisticFirst.status, 201);
  const optimisticRetry = await callChat(env, '/api/chat/messages', first.token, {
    method: 'POST',
    body: { to: 'dora.social', body: 'Envio otimista idempotente', clientId: optimisticClientId }
  });
  assert.equal(optimisticRetry.status, 200);
  assert.equal((await payload(optimisticRetry)).duplicate, true);
  const optimisticRows = await env.AUTH_DB.prepare(`SELECT COUNT(*) AS total FROM portal_chat_messages
    WHERE from_user = 'clara.social' AND client_id = ?`).bind(optimisticClientId).first();
  assert.equal(Number(optimisticRows.total || 0), 1, 'reenvio com o mesmo client_id não duplica mensagem');

  for (let index = 0; index < 125; index += 1) {
    await env.AUTH_DB.prepare(`INSERT INTO portal_chat_messages(from_user, to_user, body, read_at)
      VALUES ('clara.social', 'dora.social', ?, CURRENT_TIMESTAMP)`).bind(`Histórico ${index}`).run();
  }
  const latestHistoryPage = await payload(await callChat(
    env,
    '/api/chat/messages?with=clara.social&after=0&peek=1',
    second.token
  ));
  assert.equal(latestHistoryPage.pageSize, 120);
  assert.equal(latestHistoryPage.messages.length, 120);
  const firstLatestId = Number(latestHistoryPage.messages[0].id || 0);
  const olderHistoryPage = await payload(await callChat(
    env,
    `/api/chat/messages?with=clara.social&after=0&before=${firstLatestId}&peek=1`,
    second.token
  ));
  assert.ok(olderHistoryPage.messages.length >= 1);
  assert.ok(olderHistoryPage.messages.every((message) => Number(message.id || 0) < firstLatestId));

  const removedFriendship = await callSocial(env, '/api/social/relationships', first.token, {
    method: 'POST', body: { action: 'remove', targetHandle: 'dora.social' }
  });
  assert.equal((await payload(removedFriendship)).relationship, 'removed');
  const chatAfterRemoval = await payload(await callChat(env, '/api/chat/users', first.token));
  assert.ok(!chatAfterRemoval.users.some((item) => item.username === 'dora.social'));
  const blockedChatAfterRemoval = await callChat(env, '/api/chat/messages', first.token, {
    method: 'POST', body: { to: 'dora.social', body: 'Não deve ser enviado' }
  });
  assert.equal(blockedChatAfterRemoval.status, 404);

  const authState = await payload(await handlePortalRoute(socialRequest('/api/auth/me', first.token), env, '', true));
  assert.equal(authState.user.role, 'cidadao', 'amizade não altera o cargo nem permissões da conta');

  await env.AUTH_DB.prepare("UPDATE auth_users SET active = 0 WHERE username = 'dora.social'").run();
  const inactiveProfile = await callSocial(env, '/api/social/profiles/dora.social', first.token);
  assert.equal(inactiveProfile.status, 404);
  const inactiveAction = await callSocial(env, '/api/social/relationships', first.token, {
    method: 'POST', body: { action: 'remove', targetHandle: 'dora.social' }
  });
  assert.equal(inactiveAction.status, 404, 'conta inativa não recebe nova interação social');
});

sqliteTest('chat fast path preserva a exigência de e-mail profissional quando o gate estiver ativo', async () => {
  const env = environment();
  const sender = await register(env, 'envio.rapido', '127.0.0.81');
  await register(env, 'destino.rapido', '127.0.0.82');
  await env.AUTH_DB.prepare(`UPDATE auth_users
    SET role = 'recepcao'
    WHERE username IN ('envio.rapido','destino.rapido')`).run();
  env.AUTH_REQUIRE_EMAIL_VERIFICATION = 'true';

  const blocked = await callChat(env, '/api/chat/messages', sender.token, {
    method: 'POST',
    body: { to: 'destino.rapido', body: 'Mensagem bloqueada sem e-mail', clientId: 'chat-fast-email-gate-001' }
  });
  assert.equal(blocked.status, 403);
  assert.equal((await payload(blocked)).code, 'EMAIL_VERIFICATION_REQUIRED');

  await env.AUTH_DB.prepare(`UPDATE auth_users
    SET email_verified = 1
    WHERE username = 'envio.rapido'`).run();

  const allowed = await callChat(env, '/api/chat/messages', sender.token, {
    method: 'POST',
    body: { to: 'destino.rapido', body: 'Mensagem liberada com e-mail', clientId: 'chat-fast-email-gate-002' }
  });
  assert.equal(allowed.status, 201);
  const allowedPayload = await payload(allowed);
  assert.equal(allowedPayload.message.body, 'Mensagem liberada com e-mail');
  assert.ok(Number(allowedPayload.message.id || 0) > 0);
});

sqliteTest('envio websocket atômico valida sessão, autorização institucional e retry sem duplicar', async () => {
  const env = environment();
  await ensureAuthSchema(env);
  await ensureAtomicChatTestSchema(env);

  const insert = env.AUTH_DB.prepare(`INSERT INTO auth_users
    (username, name, job_title, role, password_hash, password_salt, active,
      must_change_password, session_version, created_by, self_registered, email_verified)
    VALUES (?, ?, ?, ?, 'hash', 'salt', 1, 0, ?, 'test', 0, ?)`);
  await insert.bind('ws.sender', 'Remetente', 'Recepção', 'recepcao', 4, 1).run();
  await insert.bind('ws.target', 'Destinatário', 'Médico', 'medico', 1, 1).run();
  await insert.bind('ws.citizen', 'Cidadão', 'Cidadão', 'cidadao', 1, 1).run();

  const first = await persistAtomicChatMessage(env, {
    fromUser: 'ws.sender',
    toUser: 'ws.target',
    body: 'Mensagem atômica',
    clientId: 'chat-websocket-atomic-001',
    sessionVersion: 4
  });
  assert.equal(first.ok, true);
  assert.equal(first.created, true);
  assert.equal(first.message.body, 'Mensagem atômica');
  assert.ok(Number(first.message.id || 0) > 0);

  const retry = await persistAtomicChatMessage(env, {
    fromUser: 'ws.sender',
    toUser: 'ws.target',
    body: 'Mensagem atômica',
    clientId: 'chat-websocket-atomic-001',
    sessionVersion: 4
  });
  assert.equal(retry.ok, true);
  assert.equal(retry.duplicate, true);
  assert.equal(Number(retry.message.id), Number(first.message.id));

  const stale = await persistAtomicChatMessage(env, {
    fromUser: 'ws.sender',
    toUser: 'ws.target',
    body: 'Sessão antiga',
    clientId: 'chat-websocket-atomic-002',
    sessionVersion: 3
  });
  assert.equal(stale.ok, false);
  assert.equal(stale.code, 'CHAT_SEND_NOT_ALLOWED');

  const citizenWithoutFriendship = await persistAtomicChatMessage(env, {
    fromUser: 'ws.sender',
    toUser: 'ws.citizen',
    body: 'Sem amizade',
    clientId: 'chat-websocket-atomic-003',
    sessionVersion: 4
  });
  assert.equal(citizenWithoutFriendship.ok, false);

  env.AUTH_REQUIRE_EMAIL_VERIFICATION = 'true';
  await env.AUTH_DB.prepare("UPDATE auth_users SET email_verified = 0 WHERE username = 'ws.sender'").run();
  const emailBlocked = await persistAtomicChatMessage(env, {
    fromUser: 'ws.sender',
    toUser: 'ws.target',
    body: 'Gate de e-mail',
    clientId: 'chat-websocket-atomic-004',
    sessionVersion: 4
  });
  assert.equal(emailBlocked.ok, false);

  await env.AUTH_DB.prepare("UPDATE auth_users SET email_verified = 1 WHERE username = 'ws.sender'").run();
  const emailAllowed = await persistAtomicChatMessage(env, {
    fromUser: 'ws.sender',
    toUser: 'ws.target',
    body: 'Gate de e-mail liberado',
    clientId: 'chat-websocket-atomic-005',
    sessionVersion: 4
  });
  assert.equal(emailAllowed.ok, true);

  const total = await env.AUTH_DB.prepare(`SELECT COUNT(*) AS total
    FROM portal_chat_messages
    WHERE from_user = 'ws.sender' AND client_id = 'chat-websocket-atomic-001'`).first();
  assert.equal(Number(total.total || 0), 1);
});

sqliteTest('envio websocket atômico respeita amizade social e suspensão', async () => {
  const env = environment();
  const sender = await register(env, 'ws.amigo.a', '127.0.0.91');
  await ensureAtomicChatTestSchema(env);
  await register(env, 'ws.amigo.b', '127.0.0.92');
  await ensureSocialSchema(env);
  const first = await syncSocialUser(env, 'ws.amigo.a');
  const second = await syncSocialUser(env, 'ws.amigo.b');
  const [low, high] = [first.social_user_id, second.social_user_id].sort();

  await env.AUTH_DB.prepare(`INSERT INTO social_relationships
    (pair_low, pair_high, state, initiated_by, origin)
    VALUES (?, ?, 'friends', ?, 'manual')`).bind(low, high, first.social_user_id).run();

  const allowed = await persistAtomicChatMessage(env, {
    fromUser: 'ws.amigo.a',
    toUser: 'ws.amigo.b',
    body: 'Amizade confirmada',
    clientId: 'chat-websocket-social-001',
    sessionVersion: 1
  });
  assert.equal(allowed.ok, true);
  assert.equal(allowed.created, true);

  await env.AUTH_DB.prepare(`UPDATE social_users
    SET suspended_at = CURRENT_TIMESTAMP
    WHERE auth_username = 'ws.amigo.a'`).run();

  const suspended = await persistAtomicChatMessage(env, {
    fromUser: 'ws.amigo.a',
    toUser: 'ws.amigo.b',
    body: 'Suspenso não envia social',
    clientId: 'chat-websocket-social-002',
    sessionVersion: 1
  });
  assert.equal(suspended.ok, false);

  assert.ok(sender.token, 'registro de suporte mantém a sessão original válida para o cenário');
});

sqliteTest('feed usa cursor cronológico sem duplicar nem perder itens', async () => {
  const env = environment();
  const session = await register(env, 'pagina.social', '127.0.0.25');
  await env.AUTH_DB.prepare("UPDATE auth_users SET email_verified = 1 WHERE username = 'pagina.social'").run();
  await callSocial(env, '/api/social/me', session.token);
  const social = await resolveSocialUser(env, 'pagina.social');
  for (let index = 0; index < 25; index += 1) {
    const second = String(index).padStart(2, '0');
    await env.AUTH_DB.prepare(`INSERT INTO social_posts(id, author_id, body, audience, created_at, updated_at)
      VALUES (?, ?, ?, 'self', ?, ?)`).bind(
      `post_page_${second}`,
      social.social_user_id,
      `Item ${second}`,
      `2026-09-06 12:00:${second}`,
      `2026-09-06 12:00:${second}`
    ).run();
  }
  const firstPage = await payload(await callSocial(env, '/api/social/feed', session.token));
  assert.equal(firstPage.posts.length, 20);
  assert.ok(firstPage.nextCursor);
  const secondPage = await payload(await callSocial(env, `/api/social/feed?cursor=${encodeURIComponent(firstPage.nextCursor)}`, session.token));
  assert.equal(secondPage.posts.length, 5);
  assert.equal(secondPage.nextCursor, '');
  const ids = [...firstPage.posts, ...secondPage.posts].map((post) => post.id);
  assert.equal(new Set(ids).size, 25);
  assert.deepEqual(ids, [...ids].sort().reverse());
});

sqliteTest('moderação social não desativa sessão, cargo nem chat profissional', async () => {
  const env = environment();
  const doctor = await register(env, 'medica.social', '127.0.0.30');
  const reception = await register(env, 'recepcao.social', '127.0.0.31');
  const moderator = await register(env, 'dev.social', '127.0.0.32');
  const citizen = await register(env, 'cidada.social', '127.0.0.33');
  await env.AUTH_DB.prepare(`UPDATE auth_users SET email_verified = 1,
    role = CASE username
      WHEN 'medica.social' THEN 'medico'
      WHEN 'recepcao.social' THEN 'recepcao'
      WHEN 'dev.social' THEN 'admin'
      ELSE role END
    WHERE username IN ('medica.social','recepcao.social','dev.social','cidada.social')`).run();

  await callSocial(env, '/api/social/me', doctor.token, {
    method: 'PATCH', body: { acceptFriendRequests: true }
  });
  await callSocial(env, '/api/social/me', reception.token, {
    method: 'PATCH', body: { acceptFriendRequests: true }
  });
  await callSocial(env, '/api/social/me', moderator.token);
  await callSocial(env, '/api/social/me', citizen.token);
  const citizenSearch = await payload(await callSocial(env, '/api/social/search?q=medica', citizen.token));
  assert.ok(citizenSearch.profiles.some((item) => item.handle === 'medica.social' && item.professional?.role === 'medico'),
    'busca social deve localizar contas elegíveis independentemente do cargo');

  const professionalSearch = await payload(await callSocial(env, '/api/social/search?q=cidada', doctor.token));
  assert.ok(professionalSearch.profiles.some((item) => item.handle === 'cidada.social' && item.professional === null),
    'profissional deve conseguir localizar cidadão elegível para amizade');

  const citizenRejectsRequests = await callSocial(env, '/api/social/relationships', doctor.token, {
    method: 'POST', body: { action: 'request', targetHandle: 'cidada.social' }
  });
  assert.equal(citizenRejectsRequests.status, 409,
    'perfil visível continua respeitando a preferência de não aceitar novos pedidos');

  const beforeFriendship = await payload(await callChat(env, '/api/chat/users', citizen.token));
  assert.ok(!beforeFriendship.users.some((item) => item.username === 'medica.social'),
    'localizar um profissional não concede chat antes da amizade');

  const crossRequest = await callSocial(env, '/api/social/relationships', citizen.token, {
    method: 'POST', body: { action: 'request', targetHandle: 'medica.social' }
  });
  assert.equal((await payload(crossRequest)).relationship, 'sent');
  const crossAccept = await callSocial(env, '/api/social/relationships', doctor.token, {
    method: 'POST', body: { action: 'accept', targetHandle: 'cidada.social' }
  });
  assert.equal((await payload(crossAccept)).relationship, 'friends');

  const citizenChatDirectory = await payload(await callChat(env, '/api/chat/users', citizen.token));
  assert.ok(citizenChatDirectory.users.some((item) => item.username === 'medica.social' && item.role === 'medico'),
    'amizade aceita libera somente o contato social entre o par');

  const citizenToProfessional = await callChat(env, '/api/chat/messages', citizen.token, {
    method: 'POST', body: { to: 'medica.social', body: 'Mensagem social entre amigos' }
  });
  assert.equal(citizenToProfessional.status, 201);
  const professionalConversation = await payload(await callChat(env, '/api/chat/messages?with=cidada.social', doctor.token));
  assert.equal(professionalConversation.messages.at(-1).body, 'Mensagem social entre amigos');

  const citizenAuth = await payload(await handlePortalRoute(socialRequest('/api/auth/me', citizen.token), env, '', true));
  assert.equal(citizenAuth.user.role, 'cidadao', 'amizade com profissional não promove cargo nem ferramenta');

  const removeCrossFriendship = await callSocial(env, '/api/social/relationships', citizen.token, {
    method: 'POST', body: { action: 'remove', targetHandle: 'medica.social' }
  });
  assert.equal((await payload(removeCrossFriendship)).relationship, 'removed');
  const blockedAfterRemoval = await callChat(env, '/api/chat/messages', citizen.token, {
    method: 'POST', body: { to: 'medica.social', body: 'Não deve passar sem amizade' }
  });
  assert.equal(blockedAfterRemoval.status, 404, 'remoção da amizade revoga o canal social cidadão-profissional');

  await callSocial(env, '/api/social/relationships', doctor.token, {
    method: 'POST', body: { action: 'request', targetHandle: 'recepcao.social' }
  });
  await callSocial(env, '/api/social/relationships', reception.token, {
    method: 'POST', body: { action: 'accept', targetHandle: 'medica.social' }
  });
  const post = await payload(await callSocial(env, '/api/social/posts', reception.token, {
    method: 'POST', body: { body: 'Publicação denunciada no teste', audience: 'friends' }
  }));
  const report = await payload(await callSocial(env, '/api/social/reports', doctor.token, {
    method: 'POST', body: { targetType: 'post', target: post.post.id, reason: 'inadequado', details: 'Teste controlado' }
  }));

  const forbidden = await callSocial(env, '/api/social/moderation/reports', citizen.token);
  assert.equal(forbidden.status, 403, 'moderação permanece exclusiva do Desenvolvedor');

  const queue = await payload(await callSocial(env, '/api/social/moderation/reports', moderator.token));
  assert.equal(queue.reports[0].target.text, 'Publicação denunciada no teste');
  assert.equal(queue.reports[0].target.author.handle, 'recepcao.social');
  const suspended = await callSocial(env, `/api/social/moderation/reports/${report.reportId}`, moderator.token, {
    method: 'PATCH', body: { status: 'resolved', action: 'suspend_user' }
  });
  assert.equal(suspended.status, 200);
  const socialConfig = await payload(await callSocial(env, '/api/social/config', reception.token));
  assert.equal(socialConfig.available, false);
  assert.equal(socialConfig.gate.code, 'SOCIAL_SUSPENDED');

  const authResponse = await handlePortalRoute(socialRequest('/api/auth/me', reception.token), env, '', true);
  assert.equal(authResponse.status, 200);
  const authState = await payload(authResponse);
  assert.equal(authState.user.role, 'recepcao');
  assert.equal(authState.user.active, true);

  const chat = await callChat(env, '/api/chat/users', reception.token);
  assert.equal(chat.status, 200, 'suspensão social não bloqueia chat profissional');
  const contacts = (await payload(chat)).users;
  assert.ok(contacts.some((item) => item.username === 'medica.social'));

  const audit = await env.AUTH_DB.prepare("SELECT action, target_type AS targetType FROM social_moderation_audit WHERE actor_username = 'dev.social'").first();
  assert.equal(audit.action, 'report_suspend_user');
  assert.equal(audit.targetType, 'post');
});


sqliteTest('diretório do chat identifica recebimentos já incluídos no contador sem perder o marcador após leitura',async()=>{
  const env=environment();
  const sender=await register(env,'unread.sender','127.0.0.111');
  const receiver=await register(env,'unread.receiver','127.0.0.112');
  await env.AUTH_DB.prepare("UPDATE auth_users SET role='recepcao' WHERE username IN ('unread.sender','unread.receiver')").run();
  const sent=await payload(await callChat(env,'/api/chat/messages',sender.token,{method:'POST',body:{to:'unread.receiver',body:'Mensagem sintética'}}));
  const before=await payload(await callChat(env,'/api/chat/users',receiver.token));
  const contact=before.users.find(u=>u.username==='unread.sender');
  assert.equal(contact.unread,1);assert.equal(contact.receivedThroughId,sent.message.id);
  await callChat(env,'/api/chat/read',receiver.token,{method:'POST',body:{with:'unread.sender',throughId:sent.message.id}});
  const after=await payload(await callChat(env,'/api/chat/users',receiver.token));
  assert.equal(after.users.find(u=>u.username==='unread.sender').unread,0);
  assert.equal(after.users.find(u=>u.username==='unread.sender').receivedThroughId,sent.message.id);
});
