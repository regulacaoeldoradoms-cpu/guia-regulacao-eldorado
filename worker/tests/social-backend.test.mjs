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
  constructor() {
    this.database = new DatabaseSync(':memory:');
  }

  prepare(sql) {
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

test('política mantém nível, tipos de conta e estados relacionais separados', () => {
  const bronze = { active: true, emailVerified: false };
  assert.equal(socialGate(bronze, {}).code, 'ACCOUNT_LEVEL_REQUIRED');
  assert.equal(socialGate({ ...bronze, emailVerified: true }, {}).allowed, true);
  assert.equal(socialGate({ ...bronze, emailVerified: true }, { suspended_at: '2026-09-06' }).code, 'SOCIAL_SUSPENDED');

  const citizenA = { social_user_id: 'a', role: 'cidadao' };
  const citizenB = { social_user_id: 'b', role: 'cidadao', active: 1, profile_visibility: 'portal', acceptFriendRequests: 1 };
  const doctor = { social_user_id: 'm', role: 'medico', active: 1, profile_visibility: 'portal', acceptFriendRequests: 1 };
  assert.equal(canCreateManualRelationship(citizenA, citizenB), true);
  assert.equal(canCreateManualRelationship(citizenA, doctor), false);
  assert.equal(canDiscoverSocialProfile(citizenA, citizenB, null), true);
  assert.equal(canDiscoverSocialProfile(citizenA, doctor, null), false);
  assert.equal(relationshipStateFor('a', 'b', { state: 'pending', initiated_by: 'a' }), 'sent');
  assert.equal(relationshipStateFor('a', 'b', { state: 'pending', initiated_by: 'b' }), 'received');
  assert.equal(relationshipStateFor('a', 'b', { state: 'blocked', blocked_by: 'b' }), 'unavailable');
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

sqliteTest('fluxo social real aplica gate Prata, amizade, feed e bloqueio no backend', async () => {
  const env = environment();
  const first = await register(env, 'ana.social', '127.0.0.10');
  const second = await register(env, 'bia.social', '127.0.0.11');

  const bronzePost = await callSocial(env, '/api/social/posts', first.token, {
    method: 'POST', body: { body: 'Publicação indevida' }
  });
  assert.equal(bronzePost.status, 403);
  assert.equal((await payload(bronzePost)).code, 'ACCOUNT_LEVEL_REQUIRED');

  await env.AUTH_DB.prepare("UPDATE auth_users SET email_verified = 1, accept_friend_requests = 1 WHERE username IN ('ana.social','bia.social')").run();
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
  assert.equal((await payload(feed)).posts[0].id, postPayload.post.id);

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
  assert.equal(citizenChat.status, 403, 'amizade entre cidadãos não concede acesso ao chat profissional');
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
  assert.deepEqual(citizenSearch.profiles, [], 'busca cidadã ampla não enumera profissionais');
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
