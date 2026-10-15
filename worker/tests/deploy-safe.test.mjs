import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import {
  SAFE_DEPLOY,
  ISOLATED_PREVIEW_PROFILES,
  CRITICAL_BINDINGS,
  activeVersionFromDeployment,
  latestVersionEntry,
  latestVersionFromList,
  isSafeDeployCandidateVersion,
  isKnownIsolatedPreviewVersion,
  newUploadedVersion,
  authDbDatabaseId,
  currentSecretBindingNames,
  validateCandidateBindings,
  validateEquivalentNonProductionBindings,
  pendingLifecycleBindings,
  injectAuthDbDatabaseId,
  injectRequiredSecrets,
  classifyAgendaProbe,
  classifyAdminUsersProbe,
  classifyChatRealtimeProbe,
  classifyPortalTutorialProbe,
  probePortalTutorial,
  wranglerArgs,
  wranglerCliPath
} from '../scripts/deploy-safe.mjs';

function version(bindings) {
  return { resources: { bindings } };
}

const DB = '11111111-2222-3333-4444-555555555555';

function activeBindings() {
  return [
    { name: 'AUTH_DB', type: 'd1', id: DB },
    { name: 'AI', type: 'ai' },
    { name: 'CHAT_REALTIME', type: 'durable_object_namespace', namespace_id: 'chat-realtime-test' },
    { name: 'FIREBASE_PROJECT_ID', type: 'plain_text', text: 'portal-projeto' },
    { name: 'FIREBASE_CLIENT_EMAIL', type: 'plain_text', text: 'firebase@example.test' },
    { name: 'FIREBASE_PRIVATE_KEY', type: 'secret_text' },
    { name: 'FIREBASE_STORAGE_BUCKET', type: 'plain_text', text: 'portal-projeto.firebasestorage.app' },
    { name: 'AUTH_SESSION_SECRET', type: 'secret_text' },
    { name: 'AUTH_RATE_LIMIT_SECRET', type: 'secret_text' },
    { name: 'GMAIL_BRIDGE_SECRET', type: 'secret_text' },
    { name: 'TITON_GEMINI_API_KEY', type: 'secret_text' },
    { name: 'GEMINI_API_KEY', type: 'secret_text' },
    { name: 'GOOGLE_DRIVE_OAUTH_CLIENT_SECRET', type: 'secret_text' },
    { name: 'DRIVE_TOKEN_ENCRYPTION_KEY', type: 'secret_text' },
    { name: 'POSTHOG_PROJECT_TOKEN', type: 'secret_text' },
    { name: 'ALLOWED_ORIGINS', type: 'plain_text', text: 'https://example.test' }
  ];
}

// Execute the unchanged gate module with a local, fail-closed Wrangler double.
// The fixture CLI cannot call Cloudflare, including its upload/deploy paths.
async function deployFixture(t, { tutorial = 'enabled', failingProbe = null } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'safe-deploy-flow-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const script = path.join(root, 'scripts', 'deploy-safe.mjs');
  const cli = path.join(root, 'node_modules', 'wrangler', 'bin', 'wrangler.js');
  fs.mkdirSync(path.dirname(script), { recursive: true });
  fs.mkdirSync(path.dirname(cli), { recursive: true });
  fs.copyFileSync(new URL('../scripts/deploy-safe.mjs', import.meta.url), script);
  fs.writeFileSync(path.join(root, 'package.json'), '{"type":"module"}');
  fs.writeFileSync(path.join(root, 'wrangler.toml'), [
    `name = "${SAFE_DEPLOY.worker}"`, 'keep_vars = true',
    '[[d1_databases]]', 'binding = "AUTH_DB"', 'database_name = "synthetic-only"'
  ].join('\n'));
  const original = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
  const candidate = 'bbbbbbbb-cccc-dddd-eeee-ffffffffffff';
  const concurrent = 'cccccccc-dddd-eeee-ffff-aaaaaaaaaaaa';
  const statePath = path.join(root, 'fixture-state.json');
  const bindings = activeBindings();
  if (tutorial) bindings.push({
    name: 'PORTAL_TUTORIAL_COMPLETION_ENABLED', type: 'plain_text',
    text: String(tutorial === 'enabled')
  });
  fs.writeFileSync(statePath, JSON.stringify({
    original, candidate, concurrent, bindings, uploaded: false,
    versions: [{ version_id: original, percentage: 100 }], events: []
  }));
  const read = () => JSON.parse(fs.readFileSync(statePath, 'utf8'));
  const update = (change) => {
    const state = read();
    change(state);
    fs.writeFileSync(statePath, JSON.stringify(state));
  };
  fs.writeFileSync(cli, `
    import fs from 'node:fs';
    const file = new URL('../../../fixture-state.json', import.meta.url);
    const state = JSON.parse(fs.readFileSync(file, 'utf8'));
    const args = process.argv.slice(2);
    state.events.push({ command: args.slice(0, 3) });
    let result;
    let failed = false;
    if (args[0] === 'deployments' && args[1] === 'status') {
      result = { versions: state.versions };
      if (state.swapAfterStatus) {
        state.versions = [{ version_id: state.concurrent, percentage: 100 }];
        state.swapAfterStatus = false;
        state.events.push({ concurrentAfterSnapshot: true });
      }
      failed = !!state.failStatus;
    } else if (args[0] === 'versions' && args[1] === 'view') {
      if (![state.original, state.candidate, state.concurrent].includes(args[2])) failed = true;
      result = { resources: { bindings: state.bindings } };
    } else if (args[0] === 'versions' && args[1] === 'list') {
      result = [{ id: state.original, metadata: { created_on: '2026-01-01T00:00:00Z' } }];
      if (state.uploaded) result.push({
        id: state.candidate, metadata: { created_on: '2026-01-02T00:00:00Z' }
      });
    } else if (args[0] === 'versions' && args[1] === 'upload') {
      if (!args.includes('--dry-run')) state.uploaded = true;
      result = {};
    } else if (args[0] === 'versions' && args[1] === 'deploy') {
      const id = args[2].replace('@100%', '');
      if (![state.original, state.candidate].includes(id)) failed = true;
      else state.versions = [{ version_id: id, percentage: 100 }];
      result = {};
    } else failed = true;
    fs.writeFileSync(file, JSON.stringify(state));
    if (failed) { console.error('synthetic fixture command rejected'); process.exit(1); }
    console.log(JSON.stringify(result));
  `);
  const gate = await import(pathToFileURL(script).href);
  const logs = [];
  t.mock.method(console, 'log', (...args) => logs.push(args.join(' ')));
  let tutorialProbes = 0;
  let afterProbe = () => tutorialResponse();
  const tutorialResponse = () => new Response(JSON.stringify({
    code: tutorial === 'enabled' ? 'SESSION_REQUIRED' : 'TUTORIAL_DISABLED'
  }), { status: tutorial === 'enabled' ? 401 : 503 });
  const fetcher = async (url, options) => {
    assert.ok(['GET', 'OPTIONS'].includes(options.method));
    assert.equal(options.body, undefined);
    assert.equal(new Headers(options.headers).has('authorization'), false);
    update(state => state.events.push({ probe: url, method: options.method }));
    if (url === failingProbe) throw new Error('synthetic legacy probe connection failure');
    if (url === SAFE_DEPLOY.portalTutorialApi) {
      tutorialProbes += 1;
      return tutorialProbes === 1 ? tutorialResponse() : afterProbe();
    }
    if (url === SAFE_DEPLOY.agendaApi) return new Response(null, { status: 401 });
    if (url === SAFE_DEPLOY.adminUsersApi) return new Response(null, {
      status: options.method === 'OPTIONS' ? 204 : 401,
      headers: { 'Access-Control-Allow-Origin': SAFE_DEPLOY.portalOrigin }
    });
    if (url === SAFE_DEPLOY.chatRealtimeHealthApi) return Response.json({ ok: true });
    assert.fail('Unexpected request: fixture never falls back to network');
  };
  return {
    root, original, candidate, concurrent, read, update, logs,
    run: () => gate.safeDeploy({ workerRoot: root, fetcher }),
    afterProbe: (callback) => { afterProbe = callback; },
    tutorialResponse
  };
}

function assertTutorialIntervention(fixture) {
  const events = fixture.read().events;
  const lastProbe = events.findLastIndex(event => event.probe === SAFE_DEPLOY.portalTutorialApi);
  assert.deepEqual(events.slice(lastProbe + 1).filter(event => event.command?.[1] === 'deploy'), []);
  assert.deepEqual(events.filter(event => event.command?.[1] === 'deploy')
    .map(event => event.command[2]), [fixture.candidate + '@100%']);
  assert.ok(fixture.logs.includes('ROLLBACK_DE_SEGURANCA=BLOQUEADO_SONDAGEM_TUTORIAL'));
  assert.ok(fixture.logs.includes('INTERVENCAO_MANUAL=OBRIGATORIA'));
  assert.ok(!fixture.logs.includes('DEPLOY_SEGURO_CONCLUIDO'));
  assert.ok(!fixture.logs.includes('portalTutorialFlagPreservada=OK'));
}

test('sondagem falha fechada sem entrar na janela check-then-act do rollback', async (t) => {
  const fixture = await deployFixture(t);
  fixture.afterProbe(() => {
    // The c84 gate reads ownership, then this double activates another release
    // before the rollback promotion. The fixed path must issue neither command.
    fixture.update(state => { state.swapAfterStatus = true; });
    return Response.json({ code: 'TUTORIAL_DISABLED' }, { status: 503 });
  });
  await assert.rejects(fixture.run(), /PORTAL_TUTORIAL_ESTADO_MUDOU_APOS_DEPLOY/);
  assertTutorialIntervention(fixture);
  const events = fixture.read().events;
  const lastProbe = events.findLastIndex(event => event.probe === SAFE_DEPLOY.portalTutorialApi);
  assert.deepEqual(events.slice(lastProbe + 1), []);
  assert.deepEqual(fixture.read().versions, [{ version_id: fixture.candidate, percentage: 100 }]);
});

test('gate rejeita troca de versão durante a sondagem sem sobrescrever publicação concorrente', async (t) => {
  const fixture = await deployFixture(t);
  const entered = Promise.withResolvers();
  const response = Promise.withResolvers();
  fixture.afterProbe(() => { entered.resolve(); return response.promise; });
  const pending = fixture.run();
  await entered.promise;
  fixture.update(state => {
    state.versions = [{ version_id: fixture.concurrent, percentage: 100 }];
  });
  response.resolve(fixture.tutorialResponse());
  await assert.rejects(pending, /VERSAO_FINAL_DIVERGENTE/);
  assert.deepEqual(fixture.read().versions, [{ version_id: fixture.concurrent, percentage: 100 }]);
  assertTutorialIntervention(fixture);
});

for (const tutorial of ['enabled', 'disabled', null]) {
  test(`gate confirma candidata após a última sondagem: tutorial ${tutorial ?? 'ausente'}`, async (t) => {
    const fixture = await deployFixture(t, { tutorial });
    const result = await fixture.run();
    assert.equal(result.candidateVersion, fixture.candidate);
    assert.ok(fixture.logs.includes('DEPLOY_SEGURO_CONCLUIDO'));
    const events = fixture.read().events;
    if (tutorial) {
      assert.equal(events.at(-2).probe, SAFE_DEPLOY.portalTutorialApi);
      assert.equal(events.at(-1).command?.[0], 'deployments');
      assert.ok(events.findLastIndex(event => event.command?.[1] === 'view') < events.length - 2);
    } else {
      assert.equal(events.at(-2).command?.[0], 'deployments');
      assert.deepEqual(events.at(-1).command, ['versions', 'view', fixture.candidate]);
    }
    assert.equal(events.filter(event => event.probe === SAFE_DEPLOY.portalTutorialApi).length, tutorial ? 2 : 0);
    assert.ok(!fs.readdirSync(fixture.root).some(file => file.startsWith('.wrangler.safe-deploy-')));
  });
}

for (const uncertain of ['split', 'unavailable']) {
  test(`gate bloqueia deployment ${uncertain} após sondagem sem promover rollback às cegas`, async (t) => {
    const fixture = await deployFixture(t);
    fixture.afterProbe(() => {
      fixture.update(state => {
        if (uncertain === 'split') state.versions = [
          { version_id: fixture.candidate, percentage: 50 },
          { version_id: fixture.concurrent, percentage: 50 }
        ];
        else state.failStatus = true;
      });
      return fixture.tutorialResponse();
    });
    await assert.rejects(fixture.run(), uncertain === 'split'
      ? /PRODUCAO_NAO_E_VERSAO_UNICA_EM_100/ : /FALHA_AO_LER_DEPLOYMENT/);
    assertTutorialIntervention(fixture);
  });
}

test('estado do tutorial divergente exige intervenção e não promove outra versão mesmo com candidata ativa', async (t) => {
  const fixture = await deployFixture(t);
  fixture.afterProbe(() => Response.json({ code: 'TUTORIAL_DISABLED' }, { status: 503 }));
  await assert.rejects(fixture.run(), /PORTAL_TUTORIAL_ESTADO_MUDOU_APOS_DEPLOY/);
  assert.deepEqual(fixture.read().versions, [{ version_id: fixture.candidate, percentage: 100 }]);
  assertTutorialIntervention(fixture);
});

test('versão original restaurada durante a sondagem não é promovida novamente nem declarada sucesso', async (t) => {
  const fixture = await deployFixture(t);
  fixture.afterProbe(() => {
    fixture.update(state => { state.versions = [{ version_id: fixture.original, percentage: 100 }]; });
    return fixture.tutorialResponse();
  });
  await assert.rejects(fixture.run(), /VERSAO_FINAL_DIVERGENTE/);
  assert.deepEqual(fixture.read().versions, [{ version_id: fixture.original, percentage: 100 }]);
  assertTutorialIntervention(fixture);
});

for (const failure of ['network', 'unknown', 'malformed']) {
  test(`falha ${failure} da sondagem exige intervenção sem novo comando Wrangler`, async (t) => {
    const fixture = await deployFixture(t);
    fixture.afterProbe(() => {
      fixture.update(state => { state.versions = [{ version_id: fixture.concurrent, percentage: 100 }]; });
      if (failure === 'network') throw new Error('synthetic connection failure');
      return failure === 'malformed' ? new Response('synthetic-invalid-json', { status: 401 })
        : Response.json({ code: 'SYNTHETIC_UNKNOWN' }, { status: 401 });
    });
    await assert.rejects(fixture.run(), failure === 'network'
      ? /PORTAL_TUTORIAL_NAO_RESPONDE/ : /PORTAL_TUTORIAL_ESTADO_MUDOU_APOS_DEPLOY/);
    assert.deepEqual(fixture.read().versions, [{ version_id: fixture.concurrent, percentage: 100 }]);
    assertTutorialIntervention(fixture);
    const events = fixture.read().events;
    const lastProbe = events.findLastIndex(event => event.probe === SAFE_DEPLOY.portalTutorialApi);
    assert.deepEqual(events.slice(lastProbe + 1), []);
  });
}

for (const tutorial of ['enabled', null]) {
  for (const [name, api, error] of [
    ['Agenda', SAFE_DEPLOY.agendaApi, /AGENDA_NAO_RESPONDE/],
    ['Usuários', SAFE_DEPLOY.adminUsersApi, /ADMIN_USERS_NAO_RESPONDE/],
    ['Chat', SAFE_DEPLOY.chatRealtimeHealthApi, /CHAT_REALTIME_NAO_RESPONDE/]
  ]) {
    test(`falha antiga de ${name} preserva rollback antes da nova fase: tutorial ${tutorial ?? 'ausente'}`, async (t) => {
      const fixture = await deployFixture(t, { tutorial, failingProbe: api });
      await assert.rejects(fixture.run(), error);
      assert.deepEqual(fixture.read().versions, [{ version_id: fixture.original, percentage: 100 }]);
      assert.deepEqual(fixture.read().events.filter(event => event.command?.[1] === 'deploy')
        .map(event => event.command[2]), [fixture.candidate + '@100%', fixture.original + '@100%']);
      assert.ok(fixture.logs.includes('ROLLBACK_DE_SEGURANCA=OK'));
      assert.ok(!fixture.logs.includes('INTERVENCAO_MANUAL=OBRIGATORIA'));
      assert.ok(!fixture.logs.includes('DEPLOY_SEGURO_CONCLUIDO'));
    });
  }
}

test('aceita somente deployment produtivo único em 100%', () => {
  const id = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
  assert.equal(activeVersionFromDeployment({
    versions: [{ version_id: id, percentage: 100 }]
  }), id);

  assert.throws(() => activeVersionFromDeployment({
    versions: [
      { version_id: id, percentage: 50 },
      { version_id: '99999999-8888-7777-6666-555555555555', percentage: 50 }
    ]
  }), /PRODUCAO_NAO_E_VERSAO_UNICA_EM_100/);
});

test('identifica a Worker Version mais recente por created_on', () => {
  const oldId = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
  const newId = '99999999-8888-7777-6666-555555555555';
  const values = [
    { id: oldId, metadata: { created_on: '2026-09-18T10:00:00.000Z' } },
    { id: newId, metadata: { created_on: '2026-09-18T11:00:00.000Z' } }
  ];
  assert.equal(latestVersionEntry(values).id, newId);
  assert.equal(latestVersionFromList(values), newId);
});

test('reconhece somente candidata órfã criada pelo próprio gate', () => {
  assert.equal(isSafeDeployCandidateVersion({
    annotations: { 'workers/message': SAFE_DEPLOY.candidateMessage }
  }), true);
  assert.equal(isSafeDeployCandidateVersion({
    annotations: { 'workers/tag': SAFE_DEPLOY.candidateTag }
  }), true);
  assert.equal(isSafeDeployCandidateVersion({
    annotations: { 'workers/message': 'upload manual qualquer' }
  }), false);
});

test('reconhece somente o preview 5E isolado pelo trio exato de annotations', () => {
  const profile = ISOLATED_PREVIEW_PROFILES[0];
  const exact = {
    annotations: {
      'workers/alias': profile.alias,
      'workers/tag': profile.tag,
      'workers/message': profile.message
    }
  };
  assert.equal(isKnownIsolatedPreviewVersion(exact), true);
  assert.equal(isKnownIsolatedPreviewVersion({
    annotations: {
      'workers/alias': profile.alias,
      'workers/tag': profile.tag,
      'workers/message': 'mensagem divergente'
    }
  }), false);
  assert.equal(isKnownIsolatedPreviewVersion({
    annotations: {
      'workers/alias': profile.alias,
      'workers/tag': 'tag divergente',
      'workers/message': profile.message
    }
  }), false);
  assert.equal(isKnownIsolatedPreviewVersion({
    annotations: {
      'workers/tag': profile.tag,
      'workers/message': profile.message
    }
  }), false);
  assert.equal(isKnownIsolatedPreviewVersion({
    annotations: {
      'workers/message': SAFE_DEPLOY.candidateMessage
    }
  }), false);
});

test('fonte do gate diferencia candidata produtiva de preview isolado conhecido', () => {
  const source = fs.readFileSync(new URL('../scripts/deploy-safe.mjs', import.meta.url), 'utf8');
  assert.match(source, /previewIsoladoAnterior/);
  assert.match(source, /RECONHECIDO_SEM_TRAFEGO_PRODUTIVO/);
  assert.match(source, /isKnownIsolatedPreviewVersion/);
  assert.match(source, /validateEquivalentNonProductionBindings/);
  assert.match(source, /versaoNaoProdutivaEquivalente/);
  assert.match(source, /ULTIMA_VERSAO_NAO_E_A_PRODUCAO_PARE_E_REVISE/);
});

test('identifica exatamente uma candidata nova', () => {
  const oldId = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
  const newId = '99999999-8888-7777-6666-555555555555';
  assert.equal(newUploadedVersion(
    [{ id: oldId }],
    [{ id: newId }, { id: oldId }]
  ), newId);
  assert.throws(() => newUploadedVersion([{ id: oldId }], [{ id: oldId }]), /VERSAO_CANDIDATA_NAO_IDENTIFICADA/);
});

test('obtém o mesmo AUTH_DB da versão ativa', () => {
  assert.equal(authDbDatabaseId(version(activeBindings())), DB);
});

test('lista todos os secrets atuais para preservação dinâmica', () => {
  assert.deepEqual(currentSecretBindingNames(version(activeBindings())), [
    'AUTH_RATE_LIMIT_SECRET',
    'AUTH_SESSION_SECRET',
    'DRIVE_TOKEN_ENCRYPTION_KEY',
    'FIREBASE_PRIVATE_KEY',
    'GEMINI_API_KEY',
    'GMAIL_BRIDGE_SECRET',
    'GOOGLE_DRIVE_OAUTH_CLIENT_SECRET',
    'POSTHOG_PROJECT_TOKEN',
    'TITON_GEMINI_API_KEY'
  ]);
});

test('candidata íntegra preserva críticos, secrets e Firebase público', () => {
  const active = version(activeBindings());
  const candidate = version(activeBindings().map((binding) => ({ ...binding })));
  const result = validateCandidateBindings(active, candidate);
  assert.equal(result.critical, CRITICAL_BINDINGS.length);
  assert.equal(result.preservedSecrets, 9);
  assert.equal(result.authDbId, DB);
});

test('flag pública remota do tutorial deve ser preservada exatamente sem configurar ou reativar', () => {
  const name='PORTAL_TUTORIAL_COMPLETION_ENABLED';
  for(const text of ['true','false']){
    const active=version([...activeBindings(),{name,type:'plain_text',text}]);
    assert.doesNotThrow(()=>validateCandidateBindings(active,version([...activeBindings(),{name,type:'plain_text',text}])));
    for(const bindings of [activeBindings(),[...activeBindings(),{name,type:'plain_text',text:text==='true'?'false':'true'}],[...activeBindings(),{name,type:'secret_text'}]]){
      assert.throws(()=>validateCandidateBindings(active,version(bindings)),/PORTAL_TUTORIAL_FLAG_NAO_PRESERVADA/);
    }
  }
});

test('flag opaca do tutorial preserva nome/tipo sem ler nenhum valor de secret', () => {
  const name='PORTAL_TUTORIAL_COMPLETION_ENABLED';
  const flag=()=>({name,type:'secret_text',get text(){throw new Error('Secret value must never be read');}});
  const active=version([...activeBindings(),flag()]);
  assert.doesNotThrow(()=>validateCandidateBindings(active,version([...activeBindings(),flag()])));
  assert.throws(()=>validateCandidateBindings(active,version(activeBindings())),/SEGREDO_ATUAL_NAO_PRESERVADO_PORTAL_TUTORIAL_COMPLETION_ENABLED/);
});

test('smoke anônimo distingue flag habilitada e desabilitada sem autenticar ou gravar', async () => {
  for(const [status,code,state] of [[401,'SESSION_REQUIRED','enabled'],[503,'TUTORIAL_DISABLED','disabled'],[503,'TUTORIAL_UNAVAILABLE','unknown'],[403,'ORIGIN_DENIED','unknown'],[200,'SESSION_REQUIRED','unknown']]){
    const probe=await probePortalTutorial(async(url,options)=>{
      assert.equal(url,SAFE_DEPLOY.portalTutorialApi);assert.equal(options.method,'GET');
      assert.equal(options.headers.Origin,SAFE_DEPLOY.portalOrigin);
      assert.equal(options.headers.Authorization,undefined);assert.equal(options.body,undefined);
      return new Response(JSON.stringify({code}),{status});
    });
    assert.deepEqual(probe,{status,state,known:state!=='unknown'});
  }
  assert.deepEqual(classifyPortalTutorialProbe(401,{}),{status:401,state:'unknown',known:false});
  await assert.rejects(probePortalTutorial(async()=>{throw new Error('Synthetic unavailable');}),/PORTAL_TUTORIAL_NAO_RESPONDE/);
});

test('migração inicial do chat realtime permite somente o binding allowlisted ausente na versão antiga', () => {
  const withoutRealtime = activeBindings().filter((binding) => binding.name !== 'CHAT_REALTIME');
  const active = version(withoutRealtime);
  const toml = [
    'name = "yellow-wave-d0a1guia-regulacao-ia"',
    'keep_vars = true',
    '',
    '[[durable_objects.bindings]]',
    'name = "CHAT_REALTIME"',
    'class_name = "PortalChatRealtime"',
    '',
    '[[migrations]]',
    'tag = "chat-realtime-v1"',
    'new_sqlite_classes = ["PortalChatRealtime"]'
  ].join('\n');

  assert.deepEqual(pendingLifecycleBindings(toml, active), ['CHAT_REALTIME']);
  assert.doesNotThrow(() => validateCandidateBindings(active, active, {
    allowMissingCritical: ['CHAT_REALTIME']
  }));
  assert.throws(() => validateCandidateBindings(active, active), /BINDING_CRITICO_AUSENTE_CHAT_REALTIME/);
  assert.deepEqual(pendingLifecycleBindings(toml, version(activeBindings())), []);
});

test('versão não produtiva equivalente pode ser ignorada sem relaxar bindings', () => {
  const active = version(activeBindings());
  const other = version(activeBindings().map((binding) => ({ ...binding })));
  const result = validateEquivalentNonProductionBindings(active, other);
  assert.equal(result.bindings, activeBindings().length);
});

test('versão não produtiva com qualquer valor público divergente continua bloqueada', () => {
  const active = version(activeBindings());
  const changed = activeBindings().map((binding) => (
    binding.name === 'ALLOWED_ORIGINS'
      ? { ...binding, text: 'https://origem-divergente.test' }
      : { ...binding }
  ));
  assert.throws(
    () => validateEquivalentNonProductionBindings(active, version(changed)),
    /VERSAO_NAO_PRODUTIVA_BINDING_DIVERGENTE_ALLOWED_ORIGINS/
  );
});

test('versão não produtiva com binding extra ou ausente continua bloqueada', () => {
  const active = version(activeBindings());
  assert.throws(
    () => validateEquivalentNonProductionBindings(
      active,
      version([...activeBindings(), { name:'EXTRA_BINDING', type:'plain_text', text:'x' }])
    ),
    /VERSAO_NAO_PRODUTIVA_BINDINGS_DIVERGENTES/
  );
  assert.throws(
    () => validateEquivalentNonProductionBindings(
      active,
      version(activeBindings().filter((binding) => binding.name !== 'POSTHOG_PROJECT_TOKEN'))
    ),
    /SEGREDO_ATUAL_NAO_PRESERVADO_POSTHOG_PROJECT_TOKEN/
  );
});

test('Gemini não é requisito fixo do gate quando já está ausente na produção', () => {
  const withoutGemini = activeBindings().filter((binding) => binding.name !== 'GEMINI_API_KEY');
  const active = version(withoutGemini);
  const candidate = version(withoutGemini.map((binding) => ({ ...binding })));
  const result = validateCandidateBindings(active, candidate);
  assert.equal(result.critical, CRITICAL_BINDINGS.length);
  assert.equal(result.preservedSecrets, 8);
});

test('se Gemini existir na produção, o gate continua bloqueando seu desaparecimento', () => {
  const active = version(activeBindings());
  const candidate = version(activeBindings().filter((binding) => binding.name !== 'GEMINI_API_KEY'));
  assert.throws(
    () => validateCandidateBindings(active, candidate),
    /SEGREDO_ATUAL_NAO_PRESERVADO_GEMINI_API_KEY/
  );
});

test('Titon Gemini é requisito fixo do gate quando a comparação está versionada', () => {
  const active = version(activeBindings());
  const candidate = version(activeBindings().filter((binding) => binding.name !== 'TITON_GEMINI_API_KEY'));
  assert.throws(
    () => validateCandidateBindings(active, candidate),
    /BINDING_CRITICO_AUSENTE_TITON_GEMINI_API_KEY/
  );
});

test('bloqueia candidata sem chave privada Firebase', () => {
  const active = version(activeBindings());
  const candidate = version(activeBindings().filter((binding) => binding.name !== 'FIREBASE_PRIVATE_KEY'));
  assert.throws(
    () => validateCandidateBindings(active, candidate),
    /BINDING_CRITICO_AUSENTE_FIREBASE_PRIVATE_KEY/
  );
});

test('bloqueia desaparecimento de qualquer segredo que já exista em produção', () => {
  const active = version(activeBindings());
  const candidate = version(activeBindings().filter((binding) => binding.name !== 'POSTHOG_PROJECT_TOKEN'));
  assert.throws(
    () => validateCandidateBindings(active, candidate),
    /SEGREDO_ATUAL_NAO_PRESERVADO_POSTHOG_PROJECT_TOKEN/
  );
});

test('bloqueia troca silenciosa de project id, client email ou bucket Firebase', () => {
  const active = version(activeBindings());
  for (const name of ['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_STORAGE_BUCKET']) {
    const bindings = activeBindings().map((binding) => (
      binding.name === name ? { ...binding, text: String(binding.text) + '-alterado' } : { ...binding }
    ));
    assert.throws(
      () => validateCandidateBindings(active, version(bindings)),
      new RegExp('FIREBASE_PUBLICO_DIVERGENTE_' + name)
    );
  }
});

test('bloqueia candidata apontando para outro D1', () => {
  const active = version(activeBindings());
  const bindings = activeBindings().map((binding) => (
    binding.name === 'AUTH_DB'
      ? { ...binding, id: '00000000-1111-2222-3333-444444444444' }
      : { ...binding }
  ));
  assert.throws(() => validateCandidateBindings(active, version(bindings)), /AUTH_DB_DIVERGENTE/);
});

test('injeta secrets.required dinamicamente sem gravar valores', () => {
  const source = [
    'name = "yellow-wave-d0a1guia-regulacao-ia"',
    'keep_vars = true',
    ''
  ].join('\n');
  const patched = injectRequiredSecrets(source, [
    'FIREBASE_PRIVATE_KEY',
    'AUTH_SESSION_SECRET',
    'AUTH_SESSION_SECRET'
  ]);
  assert.match(
    patched,
    /\[secrets\]\nrequired = \[ "AUTH_SESSION_SECRET", "FIREBASE_PRIVATE_KEY" \]/
  );
  assert.doesNotMatch(patched, /secret-value|private-key-value/);
  assert.throws(
    () => injectRequiredSecrets(patched, ['AUTH_SESSION_SECRET']),
    /SECAO_SECRETS_JA_EXISTE_NO_WRANGLER/
  );
});

test('injeta database_id somente no AUTH_DB e exige keep_vars', () => {
  const source = [
    'name = "yellow-wave-d0a1guia-regulacao-ia"',
    'keep_vars = true',
    '',
    '[[d1_databases]]',
    'binding = "OUTRA_DB"',
    'database_name = "outra"',
    '',
    '[[d1_databases]]',
    'binding = "AUTH_DB"',
    'database_name = "portal-regulacao-users"',
    ''
  ].join('\n');
  const patched = injectAuthDbDatabaseId(source, DB);
  assert.match(patched, new RegExp('binding = "AUTH_DB"\\ndatabase_name = "portal-regulacao-users"\\ndatabase_id = "' + DB + '"'));
  assert.doesNotMatch(patched, /binding = "OUTRA_DB"\ndatabase_name = "outra"\ndatabase_id/);
});

test('probe anônimo da Agenda distingue saudável de Firebase ausente', () => {
  assert.deepEqual(classifyAgendaProbe(403), { status: 403, healthy: true, firebaseBroken: false });
  assert.deepEqual(classifyAgendaProbe(401), { status: 401, healthy: true, firebaseBroken: false });
  assert.deepEqual(classifyAgendaProbe(503), { status: 503, healthy: false, firebaseBroken: true });
});

test('probe pós-deploy de Usuários exige preflight CORS e GET anônimo protegido', () => {
  assert.deepEqual(
    classifyAdminUsersProbe(204, 401, SAFE_DEPLOY.portalOrigin, SAFE_DEPLOY.portalOrigin),
    { preflightStatus: 204, getStatus: 401, healthy: true }
  );
  assert.equal(classifyAdminUsersProbe(500, 401, SAFE_DEPLOY.portalOrigin, SAFE_DEPLOY.portalOrigin).healthy, false);
  assert.equal(classifyAdminUsersProbe(204, 500, SAFE_DEPLOY.portalOrigin, SAFE_DEPLOY.portalOrigin).healthy, false);
  assert.equal(classifyAdminUsersProbe(204, 401, '', SAFE_DEPLOY.portalOrigin).healthy, false);
  assert.equal(classifyAdminUsersProbe(204, 401, SAFE_DEPLOY.portalOrigin, '').healthy, false);
});

test('probe pós-deploy do chat realtime exige HTTP 200 e confirmação do Durable Object', () => {
  assert.deepEqual(classifyChatRealtimeProbe(200, { ok: true }), { status: 200, healthy: true });
  assert.equal(classifyChatRealtimeProbe(503, { ok: false }).healthy, false);
  assert.equal(classifyChatRealtimeProbe(200, { ok: false }).healthy, false);
});

test('gate usa Wrangler local fixado pelo package.json sem passar por npx', () => {
  assert.deepEqual(wranglerArgs(['versions', 'list']), ['versions', 'list']);
  const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(pkg.devDependencies?.wrangler, SAFE_DEPLOY.wranglerVersion);

  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'safe-deploy-wrangler-'));
  try {
    const cli = path.join(root, 'node_modules', 'wrangler', 'bin', 'wrangler.js');
    fs.mkdirSync(path.dirname(cli), { recursive: true });
    fs.writeFileSync(cli, '#!/usr/bin/env node\n');
    assert.equal(wranglerCliPath(root), cli);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('fonte do gate não usa deploy monolítico nem contém credenciais', () => {
  const source = fs.readFileSync(new URL('../scripts/deploy-safe.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /wrangler\s+deploy/);
  assert.doesNotMatch(source, /-----BEGIN PRIVATE KEY-----/);
  assert.doesNotMatch(source, /AIza[0-9A-Za-z_-]{20,}/);
  assert.match(source, /'versions', 'upload'/);
  assert.match(source, /'versions', 'deploy'/);
  assert.match(source, /function deployLifecycle/);
  assert.match(source, /\['deploy'/);
  assert.match(source, /deployLifecycleDireto/);
  assert.match(source, /pendingLifecycleBindings/);
  assert.match(source, /--experimental-provision=false/);
  assert.match(source, /DRY_RUN_DA_MIGRACAO_DURABLE_OBJECT_FALHOU/);
  assert.match(source, /--experimental-auto-create=false/);
  assert.doesNotMatch(source, /'--strict'/);
  assert.match(source, /'--tag', SAFE_DEPLOY\.candidateTag/);
  assert.match(source, /injectRequiredSecrets\(/);
  assert.match(source, /candidataOrfaAnterior/);
  assert.doesNotMatch(source, /must\(latestBefore === originalVersion/);
  assert.match(source, /CLOUDFLARE_ACCOUNT_ID: SAFE_DEPLOY\.account/);
  assert.match(source, /account_id: SAFE_DEPLOY\.account/);
  assert.match(source, /node_modules', 'wrangler', 'bin', 'wrangler\.js'/);
  assert.match(source, /run\(process\.execPath, \[cli, \.\.\.wranglerArgs\(args\)\]/);
  assert.doesNotMatch(source, /npx\.cmd|run\('npx'/);
  assert.match(source, /ULTIMA_VERSAO_NAO_E_A_PRODUCAO_PARE_E_REVISE/);
  assert.match(source, /path\.join\(root, '\.wrangler\.safe-deploy-'/);
  assert.match(source, /fs\.rmSync\(deployConfig/);
  assert.doesNotMatch(source, /path\.join\(tempRoot, 'wrangler\.safe-deploy\.toml'\)/);
  assert.match(source, /ROLLBACK_DE_SEGURANCA=OK/);
  assert.match(source, /AGENDA_FIREBASE_503_APOS_DEPLOY/);
  assert.match(source, /CHAT_REALTIME_NAO_PASSOU_POS_DEPLOY/);
  assert.match(source, /chatRealtimeHealthApi/);
});


test('produção desativa Preview URLs para o gate seguro', () => {
  const wrangler = fs.readFileSync(new URL('../wrangler.toml', import.meta.url), 'utf8');
  assert.match(wrangler, /^preview_urls\s*=\s*false\s*$/m);
  assert.match(wrangler, /^workers_dev\s*=\s*true\s*$/m);
});


test('Worker Previews exige Wrangler 4.135.0 ou superior', () => {
  const parts = String(SAFE_DEPLOY.wranglerVersion).split('.').map(Number);
  const current = parts[0] * 1000000 + parts[1] * 1000 + parts[2];
  const minimum = 4 * 1000000 + 135 * 1000;
  assert.ok(current >= minimum, SAFE_DEPLOY.wranglerVersion);
});
