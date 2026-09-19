import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const root = new URL('./', import.meta.url);

async function read(name) {
  return fs.readFile(new URL(name, root), 'utf8');
}

test('verificador 5E é somente leitura e não possui operações mutáveis', async () => {
  const source = await read('verificar-precondicoes-5e.mjs');

  assert.match(source, /PRECONDICOES_5E_OK/);
  assert.match(source, /workersAiBindingPresent=true/);
  assert.match(source, /freeOnlyModels=true/);
  assert.doesNotMatch(source, /geminiSecretPresent=true/);
  assert.match(source, /deployments', 'status/);
  assert.match(source, /versions', 'view/);
  assert.match(source, /templateControlSql\(\)/);
  assert.match(source, /validateTemplateControl/);
  assert.match(source, /d1', 'execute'.*--remote/s);

  assert.doesNotMatch(source, /createControlSql|enableControlSql|disableControlSql/);
  assert.doesNotMatch(source, /versions', 'upload|versions["'],\s*["']deploy|wrangler\s+deploy/);
  assert.doesNotMatch(source, /UPDATE\s+document_drive|INSERT\s+INTO\s+document_drive/i);
});

test('verificador fixa a referência e origem homologadas sem produção', async () => {
  const source = await read('verificar-precondicoes-5e.mjs');
  assert.match(source, /76bfefa17bae0729090277525186bdc7dcfc0068/);
  assert.match(source, /https:\/\/27a15b34\.portal-regulacao-central-staging\.pages\.dev/);
  assert.doesNotMatch(source, /regulacaoeldoradoms\.com\.br\/documentos/);
});

test('atalho verifica antes de preparar e mantém confirmação no preparo existente', async () => {
  const source = await read('iniciar-homologacao-5e.mjs');
  const check = source.indexOf('await check5eReadiness()');
  const prepare = source.indexOf('return prepare5e(');
  assert.ok(check >= 0);
  assert.ok(prepare > check);
  assert.match(source, /PRECONDICOES_CONFIRMADAS_5E=true/);
  assert.match(source, /sourceRef: FROZEN_5E_SOURCE_REF/);
  assert.match(source, /pagesOrigin: FROZEN_5E_PAGES_ORIGIN/);
  assert.doesNotMatch(source, /PREPARAR HOMOLOGACAO 5E/);
});

test('atalho e verificador nunca contêm valor de secret', async () => {
  const source = (await read('verificar-precondicoes-5e.mjs'))
    + '\n'
    + (await read('iniciar-homologacao-5e.mjs'));

  assert.doesNotMatch(source, /AIza[0-9A-Za-z_-]{20,}/);
  assert.doesNotMatch(source, /-----BEGIN PRIVATE KEY-----/);
  assert.doesNotMatch(source, /GEMINI_API_KEY\s*[:=]\s*['"][^'"]+['"]/);
});
