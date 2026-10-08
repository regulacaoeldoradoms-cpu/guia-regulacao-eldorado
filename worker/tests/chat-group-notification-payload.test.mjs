import assert from 'node:assert/strict';
import test from 'node:test';
import { groupFixture } from './helpers/chat-group-fixture.mjs';
const run = (name, fn) => test(name, async () => { const f = await groupFixture(); try { await fn(f); } finally { f.close(); } });

run('grupo: convite avisa somente novas contas convidadas, não membros ou convites antigos', async f => {
  const id = await f.create(); await f.json('beta', '/' + id + '/accept', {});
  await f.friend('alpha', 'delta'); const pushes = [];
  f.env.AUTH_DB.beforeQuery = (sql, values) => { if (sql.includes('SELECT endpoint') && sql.includes('FROM portal_push_subscriptions')) pushes.push(values[0]); };
  const result = await f.json('alpha', '/' + id + '/invite', { members: ['delta'] });
  assert.equal(result.status, 200); assert.deepEqual(pushes, ['delta']);
  pushes.length = 0;
  assert.equal((await f.json('alpha', '/' + id + '/invite', { members: ['delta'] })).status, 409);
  assert.deepEqual(pushes, [], 'Rejected/repeated invitation does not trigger new pushes');
});

run('grupo: histórico retorna uma foto por remetente, não uma cópia em cada mensagem', async f => {
  const image = 'data:image/png;base64,' + Buffer.concat([Buffer.from('\x89PNG\r\n\x1a\n', 'binary'), Buffer.alloc(120000)]).toString('base64');
  const id = await f.create(['beta']); await f.json('beta', '/' + id + '/accept', {});
  await f.env.AUTH_DB.prepare('UPDATE auth_users SET avatar_data=? WHERE username=?').bind(image, 'alpha').run();
  for (let n = 0; n < 80; n++) await f.env.AUTH_DB.prepare('INSERT INTO portal_chat_group_messages(group_id,from_user,client_id,body) VALUES (?,?,?,?)').bind(id, 'alpha', 'fixture-' + n, 'Texto de teste ' + n).run();
  const page = await f.json('beta', '/' + id + '/messages');
  assert.equal(page.messages.length, 80);
  assert.ok(page.messages.every(m => m.avatarDataUrl === undefined));
  assert.equal(page.senders.length, 1); assert.equal(page.senders[0].username, 'alpha');
  assert.equal(page.senders[0].avatarDataUrl, image);
  assert.ok(JSON.stringify(page).length < image.length + 25000, 'Photo must not be repeated 80 times');
  const empty = await f.json('beta', '/' + id + '/messages?after=' + page.messages.at(-1).id);
  assert.deepEqual(empty.messages, []); assert.deepEqual(empty.senders, []);
  assert.equal((await f.json('outsider', '/' + id + '/messages')).status, 404);
});

run('grupo: a busca de fotos do histórico revalida a participação', async f => {
  const id = await f.create(['beta']); await f.json('beta', '/' + id + '/accept', {});
  await f.json('alpha', '/' + id + '/messages', {body:'Teste privado',clientId:'group-' + crypto.randomUUID()});
  let revoked = false;
  f.env.AUTH_DB.beforeQuery = sql => {
    if (!revoked && sql.includes('SELECT DISTINCT u.username,u.avatar_data')) {
      revoked = true;
      f.env.AUTH_DB.database.prepare("UPDATE portal_chat_group_members SET state='removed' WHERE group_id=? AND username='beta'").run(id);
    }
  };
  const page = await f.json('beta', '/' + id + '/messages');
  assert.equal(revoked, true); assert.deepEqual(page.senders, []);
});

run('grupo: candidatos omitem fotos completas e continuam restritos aos amigos do criador', async f => {
  const image = 'data:image/png;base64,' + Buffer.alloc(120000).toString('base64');
  await f.env.AUTH_DB.prepare('UPDATE auth_users SET avatar_data=?').bind(image).run();
  const candidates = await f.json('alpha', '/friends');
  assert.deepEqual(candidates.friends.map(u => u.username).sort(), ['beta', 'gamma']);
  assert.ok(candidates.friends.every(u => !Object.hasOwn(u, 'avatarDataUrl')));
  assert.ok(JSON.stringify(candidates).length < 2000);
  const id = await f.create(['beta']); await f.json('beta', '/' + id + '/accept', {});
  await f.json('alpha', '/' + id + '/members', { username: 'beta', action: 'promote' });
  const adminCandidates = await f.json('beta', '/friends?groupId=' + id);
  assert.deepEqual(adminCandidates.friends.map(u => u.username), ['gamma']);
  assert.ok(adminCandidates.friends.every(u => !Object.hasOwn(u, 'avatarDataUrl')));
});

run('grupo: detalhes leves e fotos privadas revalidam acesso e visibilidade dos convidados', async f => {
  const image = 'data:image/png;base64,' + Buffer.alloc(120000).toString('base64');
  await f.env.AUTH_DB.prepare("UPDATE auth_users SET avatar_data=?,avatar_version='fixture-v1'").bind(image).run();
  const id = await f.create(); await f.json('beta', '/' + id + '/accept', {});
  const details = await f.json('alpha', '/' + id);
  assert.equal(details.members.length, 3);
  assert.ok(details.members.every(m => m.avatarAvailable === 1 && m.avatarVersion === 'fixture-v1' && !Object.hasOwn(m, 'avatarDataUrl')));
  assert.ok(JSON.stringify(details).length < 3000);
  const path = '/' + id + '/member-avatar?username=';
  assert.equal((await f.json('alpha', path + 'gamma')).avatarDataUrl, image);
  assert.equal((await f.json('beta', path + 'alpha')).avatarDataUrl, image);
  assert.equal((await f.json('beta', path + 'gamma')).status, 404, 'Pending invitees remain private to admins');
  assert.equal((await f.json('gamma', path + 'alpha')).status, 404);
  assert.equal((await f.json('outsider', path + 'alpha')).status, 404);
  assert.equal((await f.json('alpha', path + 'outsider')).status, 404);
  assert.equal((await f.json('beta', path + 'alpha', undefined, {sessionVersion: 99})).status, 403);
  let revoked = false;
  f.env.AUTH_DB.beforeQuery = sql => {
    if (!revoked && sql.includes('SELECT u.avatar_data AS avatarDataUrl')) {
      revoked = true;
      f.env.AUTH_DB.database.prepare("UPDATE portal_chat_group_members SET state='removed' WHERE group_id=? AND username='beta'").run(id);
    }
  };
  assert.equal((await f.json('beta', path + 'alpha')).status, 404);
  assert.equal(revoked, true);
});
