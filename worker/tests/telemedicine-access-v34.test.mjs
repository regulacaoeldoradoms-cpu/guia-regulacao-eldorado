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
  assert.match(source, /grantTelemedicineAccess[\s\S]+UPDATE auth_users[\s\S]+SET role = \?/);
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

test('backend continua exigindo autorização de servidor e distingue sessão inválida de falta de acesso', () => {
  for (const path of ['worker/telemedicine.js', 'worker/telemedicine-router-v2.js']) {
    const source = read(path);
    assert.match(source, /validatePortalSession/);
    assert.match(source, /telemedicineAccessFor/);
    assert.match(source, /status: 401[\s\S]+Sessão inválida ou expirada/);
    assert.match(source, /status: 403[\s\S]+Acesso exclusivo da Telemedicina ou do Desenvolvedor/);
    assert.match(source, /authorizationDenied/);
  }
});

test('rotas usam a capacidade explícita como fonte de verdade e autocorrigem papel-base divergente', () => {
  for (const path of ['worker/telemedicine.js', 'worker/telemedicine-router-v2.js', 'worker/agenda.js']) {
    const source = read(path);
    assert.match(source, /if \(!\(await telemedicineAccessFor\(env, user\.username\)\)\) \{/);
    assert.match(source, /authorizationDenied: true[\s\S]+status: 403/);
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
  assert.match(flex, /requestedTelemedicineAccess === false[\s\S]+revokeTelemedicineAccess\(env, targetUsername,[\s\S]+profile-change/);
  assert.match(flex, /requestedRole === 'telemedicina'[\s\S]+grantTelemedicineAccess/);
  assert.doesNotMatch(flex, /setTelemedicineAccess/);

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


test('V34.6: revogação física exige intenção, auditoria e batch transacional', () => {
  const access = read('worker/telemedicine-access.js');
  const flex = read('worker/auth-management-flex.js');

  assert.match(access, /auth_telemedicine_revocation_intent/);
  assert.match(access, /auth_telemedicine_access_audit/);
  assert.match(access, /trg_auth_telemedicine_revoke_update_guard/);
  assert.match(access, /trg_auth_telemedicine_revoke_insert_guard/);
  assert.match(access, /trg_auth_telemedicine_delete_guard/);
  assert.match(access, /TELEMEDICINE_REVOCATION_REQUIRES_INTENT/);
  assert.match(access, /TELEMEDICINE_ACCESS_DELETE_FORBIDDEN/);
  assert.match(access, /export async function grantTelemedicineAccess/);
  assert.match(access, /export async function revokeTelemedicineAccess/);
  assert.match(access, /reason !== EXPLICIT_REVOCATION_REASON/);
  assert.match(access, /env\.AUTH_DB\.batch\(\[/);
  assert.doesNotMatch(access, /export async function setTelemedicineAccess/);
  assert.doesNotMatch(flex, /setTelemedicineAccess/);
});

test('V34.6: intenção ativa autorrepara capacidade antes de negar a Telemedicina', () => {
  const access = read('worker/telemedicine-access.js');

  assert.match(access, /ENABLED_AUDIT_ACTIONS/);
  assert.match(access, /baseline_enabled/);
  assert.match(access, /auto_repaired/);
  assert.match(access, /latestAuditAction/);
  assert.match(access, /if \(ENABLED_AUDIT_ACTIONS\.has\(action\)\)/);
  assert.match(access, /repairTelemedicineAccess/);
  assert.match(access, /V34\.6\.1: a decisão é revalidada dentro do próprio batch transacional/);
  assert.match(access, /COALESCE\(\(\$\{activeIntentSql\}\), ''\) IN \('baseline_enabled','granted','auto_repaired'\)/);
  assert.match(access, /const \[state, latest\] = await Promise\.all/);
  assert.match(access, /action TEXT NOT NULL CHECK\(action IN \('baseline_enabled','granted','revoked','auto_repaired'\)\)/);
  assert.match(access, /Linhas desabilitadas permanecem intocadas/);
});


test('V34.7: lista administrativa usa decoração Telemedicina em lote', () => {
  const access = read('worker/telemedicine-access.js');

  assert.match(access, /SELECT username, enabled FROM auth_telemedicine_access/);
  assert.match(access, /SELECT audit\.username, audit\.action[\s\S]+MAX\(id\) AS id/);
  assert.match(access, /const \[accessResult, auditResult\] = await Promise\.all/);
  assert.match(access, /repairCandidates/);
  assert.match(access, /bulk-admin-list-integrity/);
  assert.doesNotMatch(access, /for \(const user of Array\.isArray\(users\)[\s\S]+decorateTelemedicineUser/);
});

test('V34.8: Agenda também separa sessão expirada de ausência de capacidade', () => {
  const source = read('worker/agenda.js');
  assert.match(source, /status: 401[\s\S]+Sessão inválida ou expirada/);
  assert.match(source, /status: 403[\s\S]+Acesso exclusivo da Telemedicina ou do Desenvolvedor/);
  assert.match(source, /user\?\.authorizationDenied/);
});

test('V34.7: preflight administrativo responde antes de migração ou acesso ao D1', () => {
  const worker = read('worker/index.js');

  const preflight = worker.indexOf("request.method === 'OPTIONS' && url.pathname.startsWith('/api/admin/users')");
  const migration = worker.indexOf('await enforceDeveloperSeparation(env)');
  assert.ok(preflight >= 0, 'preflight antecipado não encontrado');
  assert.ok(migration >= 0, 'migração global não encontrada');
  assert.ok(preflight < migration, 'preflight deve ocorrer antes de qualquer migração/D1');
  assert.match(worker, /return handlePortalRoute\(request, env, origin, originAllowed\)/);
});
