import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

function read(path) {
  return fs.readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
}

test('capacidade Telemedicina mantém papel-base coerente sem conceder acesso por texto', () => {
  const source = read('worker/telemedicine-access.js');
  assert.match(source, /const UNDERLYING_ROLE = 'recepcao'/);
  assert.match(source, /ensureTelemedicineUnderlyingRole/);
  assert.match(source, /await ensureTelemedicineUnderlyingRole\(env, normalized\)/);
  assert.match(source, /if \(user\.role !== UNDERLYING_ROLE\) await ensureTelemedicineUnderlyingRole/);
  assert.match(source, /SELECT enabled FROM auth_telemedicine_access WHERE username = \?/);
  assert.doesNotMatch(source, /jobTitle.*telemedicineAccessFor|DEFAULT_JOB_TITLE.*enabled/);
});

test('schema de acesso é cacheado por binding D1 sem contaminar bindings distintos', () => {
  const source = read('worker/telemedicine-access.js');
  assert.match(source, /const accessSchemaReady = new WeakSet\(\)/);
  assert.match(source, /const accessSchemaPromises = new WeakMap\(\)/);
  assert.match(source, /accessSchemaReady\.has\(binding\)/);
  assert.match(source, /accessSchemaPromises\.has\(binding\)/);
  assert.match(source, /accessSchemaReady\.add\(binding\)/);
  assert.match(source, /accessSchemaPromises\.delete\(binding\)/);
});

test('registros históricos com capacidade habilitada são reparados antes das rotas', () => {
  const migration = read('worker/role-migration.js');
  const worker = read('worker/index.js');
  assert.match(migration, /telemedicineInvariantChecked/);
  assert.match(migration, /auth_telemedicine_access/);
  assert.match(migration, /SELECT username FROM auth_telemedicine_access WHERE enabled = 1/);
  assert.match(migration, /SET role = 'recepcao'/);
  assert.match(migration, /role <> 'admin'/);
  assert.match(worker, /await enforceDeveloperSeparation\(env\)/);
});

test('V34.1 recupera somente papel legado explícito sem reativar revogação existente', () => {
  const migration = read('worker/role-migration.js');
  assert.match(migration, /ensureTelemedicineAccessSchema/);
  assert.match(migration, /INSERT OR IGNORE INTO auth_telemedicine_access/);
  assert.match(migration, /FROM auth_users\s+WHERE role = 'telemedicina'/);
  assert.match(migration, /role = 'telemedicina'[\s\S]+SELECT username FROM auth_telemedicine_access WHERE enabled = 1/);
  assert.doesNotMatch(migration, /job_title/);
});

test('backend continua exigindo autorização de servidor em todas as rotas Telemedicina', () => {
  for (const path of ['worker/telemedicine.js', 'worker/telemedicine-router-v2.js']) {
    const source = read(path);
    assert.match(source, /validatePortalSession/);
    assert.match(source, /telemedicineAccessFor/);
    assert.match(source, /Acesso exclusivo da Telemedicina ou do Desenvolvedor/);
  }
});

test('rotas usam a capacidade explícita como fonte de verdade e autocorrigem papel-base divergente', () => {
  for (const path of ['worker/telemedicine.js', 'worker/telemedicine-router-v2.js', 'worker/agenda.js']) {
    const source = read(path);
    assert.match(source, /if \(!\(await telemedicineAccessFor\(env, user\.username\)\)\) return null/);
    assert.match(source, /user\.role !== 'recepcao'\) await ensureTelemedicineUnderlyingRole\(env, user\.username\)/);
    assert.doesNotMatch(source, /user\.role === 'recepcao' && await telemedicineAccessFor/);
  }
});

test('V34.3: revogação de Telemedicina é explícita e edição comum não derruba a capacidade', () => {
  const flex = read('worker/auth-management-flex.js');
  const admin = read('js/admin-users.js');

  assert.match(flex, /requestedTelemedicineAccess = null/);
  assert.match(flex, /Object\.prototype\.hasOwnProperty\.call\(body, 'telemedicineAccess'\)/);
  assert.match(flex, /typeof body\.telemedicineAccess !== 'boolean'/);
  assert.match(flex, /requestedTelemedicineAccess = body\.telemedicineAccess/);
  assert.match(flex, /targetTelemedicineEnabled[\s\S]+requestedTelemedicineAccess !== false/);
  assert.match(flex, /requestedTelemedicineAccess === false[\s\S]+setTelemedicineAccess\(env, targetUsername, false/);
  assert.doesNotMatch(flex, /setTelemedicineAccess\(env, targetUsername, requestedRole === 'telemedicina'/);

  assert.match(admin, /selectedRole === 'telemedicina'/);
  assert.match(admin, /input\.role = 'telemedicina'/);
  assert.match(admin, /input\.telemedicineAccess = true/);
  assert.match(admin, /editingUser\?\.role === 'telemedicina'/);
  assert.match(admin, /input\.telemedicineAccess = false/);
  assert.match(admin, /autorização técnica do backend está inconsistente/);
  assert.match(flex, /requestedTelemedicineAccess === true && requestedRole !== 'telemedicina'/);
  assert.match(flex, /actor\?\.role === 'admin' && requestedRole/);
});

test('V34.5: painel de usuários tolera falha transitória de rede sem repetir gravações', () => {
  const page = read('admin/usuarios/index.html');
  const admin = read('js/admin-users.js');

  assert.match(page, /admin-users\.js\?v=20260928-v34-5/);
  assert.match(admin, /listUsersWithNetworkRetry/);
  assert.match(admin, /const delays = \[350, 900\]/);
  assert.match(admin, /failed to fetch\|network\\s\*error\|networkerror\|load failed\|fetch failed/i);
  assert.match(admin, /return await auth\.listUsers\(\)/);
  assert.match(admin, /data-action="retry-users"/);
  assert.doesNotMatch(admin, /updateUser[\s\S]{0,200}listUsersWithNetworkRetry/);
  assert.match(admin, /Telemedicina: autorização técnica pendente/);
  assert.match(admin, /selectedRole === 'telemedicina'[\s\S]+input\.telemedicineAccess = true/);
});
