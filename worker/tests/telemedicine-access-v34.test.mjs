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

test('backend continua exigindo autorização de servidor em todas as rotas Telemedicina', () => {
  for (const path of ['worker/telemedicine.js', 'worker/telemedicine-router-v2.js']) {
    const source = read(path);
    assert.match(source, /validatePortalSession/);
    assert.match(source, /telemedicineAccessFor/);
    assert.match(source, /Acesso exclusivo da Telemedicina ou do Desenvolvedor/);
  }
});
