import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import worker from '../gemini-assistant.js';
import { hydrateClinicalPilot, clinicalPilotRecord } from '../clinical-condition-pilot.js';

const root = new URL('../../', import.meta.url);
const read = path => fs.readFileSync(new URL(path, root), 'utf8');
const matrix = JSON.parse(read('worker/tests/fixtures/convulsao-epilepsia-matriz-documental.json'));
const record = clinicalPilotRecord();
const clone = value => JSON.parse(JSON.stringify(value));

async function client({ value = record, ok = true, panel = null, stalled = false } = {}) {
  const document = { querySelector: () => null, getElementById: id => id === 'detailPanel' ? panel : null };
  const context = vm.createContext({ URL, JSON, console, AbortController, setTimeout: (callback, delay) => setTimeout(callback, stalled ? 1 : delay), clearTimeout, document, window: {}, fetch: async () => stalled ? new Promise(() => {}) : ({ ok, status: ok ? 200 : 503, json: async () => clone(value) }) });
  vm.runInContext(read('js/clinical-condition-pilot.js'), context);
  const api = context.window.ClinicalConditionPilot;
  await api.ready;
  return api;
}

test('as quinze regras preservam a matriz e as qualificações documentais recebidas', () => {
  assert.equal(record.rules.length, 15);
  const expected = clone(matrix.rules);
  expected.find(rule => rule.id === 'EFEITOS').text = 'Epilepsia prévia com efeitos adversos intoleráveis da medicação.';
  expected.find(rule => rule.id === 'MONO').text = 'Epilepsia prévia com controle inadequado apesar de monoterapia otimizada em dose plena, descartada má adesão.';
  expected.find(rule => rule.id === 'DIFICIL').text = 'Epilepsia prévia com controle inadequado apesar de duas ou mais medicações anticrise em dose plena, descartada má adesão (difícil controle).';
  expected.find(rule => rule.id === 'NEURO').sourceRefs = ['TEL2', 'MAN1'];
  assert.deepEqual(record.rules.map((rule, i) => Object.fromEntries(Object.keys(expected[i]).map(key => [key, rule[key]]))), expected);
  assert.deepEqual(record.uncertainties.map(note => note.id), matrix.uncertainties.map(note => note.id));
  assert.ok(record.uncertainties.every(note => note.kind));
  assert.match(record.status, /sem_vigencia_confirmada/);
  assert.equal(record.sources[0].fileHash, '96445fc56ecf27e3b81a47389c923a0a4c837372eeab5e31c7fba054ad139315');
  assert.match(record.sources[0].hashVerification, /frente documental/);
  assert.match(record.sources[0].pending, /Origem institucional, vigência atual/);
  assert.deepEqual(record.rules.find(rule => rule.id === 'NEURO').sourceLocations.map(location => location.physical), ['38', '4']);
  assert.deepEqual(record.rules.find(rule => rule.id === 'TRATAMENTO').sourceLocations, [{ source: 'TEL2', physical: '38', printed: '32' }]);
  assert.deepEqual(record.sources[0].pages, { physical: '36–38', printed: '30–32', documentTotal: 72 });
  assert.deepEqual(record.rules.find(rule => rule.id === 'APRESENTACAO').alternatives, ['anexados', 'descritos']);
  assert.deepEqual(record.rules.filter(rule => ['EEG', 'TC', 'RM'].includes(rule.id)).map(rule => rule.requirement), ['opcional_documental', 'opcional_documental', 'opcional_documental']);
});

test('faixa etária usa o limite explícito e deixa 17 anos sem destino inferido', async () => {
  const api = await client();
  assert.equal(api.ageNotice({ years: 16, months: 11, days: 29 }), null);
  assert.equal(api.ageNotice({ years: 16, months: 11, days: 30 }).id, 'FORA_FAIXA');
  const seventeen = api.ageNotice({ years: 17, months: 0, days: 0 });
  assert.equal(seventeen.id, 'IDADE17');
  assert.match(seventeen.text, /não define outra rota nem transfere o caso para o SISREG/);
  assert.equal(api.ageNotice({ years: 18, months: 0, days: 0 }).id, 'FORA_FAIXA');
  assert.deepEqual(clone(api.ageFromText('convulsão 16 anos 11 meses 29 dias')), { years: 16, months: 11, days: 29 });
});

test('impressão, contingência e projeção de IA mantêm exceção, classificação e alternativas', async () => {
  const api = await client();
  const selected = { record, age: { years: 17, months: 0, days: 0 }, query: 'convulsão febril simples, 17 anos', channel: 'guide' };
  const projected = clone(api.protocolContext(selected));
  assert.deepEqual(projected.clinicalConditionRecord, record);
  assert.deepEqual(projected.examesObrigatorios, []);
  assert.equal(projected.informacoesClinicasObrigatorias.length, 3);
  assert.equal(projected.recomendadosQuandoDisponiveis.length, 3);
  assert.equal(projected.clinicalContextualAlerts[0].id, 'IDADE17');
  const html = api.printDocument(selected);
  const ids = [...html.matchAll(/data-clinical-rule="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(ids.sort(), record.rules.map(rule => rule.id).sort());
  assert.match(html, /17 anos: faixa não explicitada/);
  assert.match(html, /anexados ou descritos/);
  assert.doesNotMatch(html, /Relatório Escolar|BERA|M-CHAT|SNAP-IV/);
  const febrile = api.localAnswer('Convulsão febril simples pode ser encaminhada por esse critério?', selected);
  assert.match(febrile, /Este critério exclui convulsão febril simples/);
  assert.doesNotMatch(febrile, /deve ser encaminhad[oa] ao SISREG/);
  const exams = api.localAnswer('Quais exames são obrigatórios?', selected);
  assert.match(exams, /Avaliação clínica obrigatória/);
  assert.match(exams, /não são pré-requisitos documentais obrigatórios/);
  assert.match(exams, /não dispensa exames clinicamente indicados/);
  assert.match(api.localAnswer('Relatório escolar é obrigatório?', selected), /não consta nos requisitos desta condição/);
  assert.match(api.localAnswer('E para neurologia adulto no SISREG?', selected), /não foram integrados a este recorte/);
  assert.match(api.localAnswer('Qual o prazo de validade do EEG?', selected), /não foram localizados prazo máximo de espera, validade de EEG/);
  assert.match(api.printDocument(selected), /não converter relato em diagnóstico ou exame/);
});

test('registro ausente ou cortado não é apresentado como piloto nem substituído pela lista geral', async () => {
  const panel = { innerHTML: '' };
  const broken = clone(record); broken.rules.pop();
  const api = await client({ value: broken, panel });
  assert.equal(api.record(), null);
  assert.equal(api.render({ id: 'neuropediatria' }, { conditionId: record.id }), true);
  assert.match(panel.innerHTML, /Nenhuma lista geral foi usada como substituta/);
  assert.equal((await client({ ok: false })).record(), null);
  const unavailable = await client({ stalled: true, panel });
  assert.equal(unavailable.record(), null);
  unavailable.render({ id: 'neuropediatria' }, { conditionId: record.id });
  assert.match(panel.innerHTML, /Tempo de carregamento excedido/);
});

test('Worker reconstitui regras canônicas e rejeita revisão incompatível', async () => {
  const api = await client();
  const projected = clone(api.protocolContext({ record, age: null }));
  projected.clinicalConditionRecord.rules = [{ id: 'EEG', text: 'EEG obrigatório inventado pelo cliente' }];
  const hydrated = hydrateClinicalPilot(projected);
  assert.deepEqual(hydrated.clinicalConditionRecord, record);
  assert.deepEqual(hydrated.examesObrigatorios, []);
  assert.equal(hydrateClinicalPilot({ id: 'cardiologia' }), null);
  assert.throws(() => hydrateClinicalPilot({ ...projected, clinicalConditionRecord: { revision: 'antiga' } }), error => error.status === 409);
  assert.throws(() => hydrateClinicalPilot({ ...projected, clinicalAge: { years: 17, months: 99, days: 0 } }), error => error.status === 400);
});

test('ponte preserva o registro integral mesmo ao reduzir um envelope grande', async () => {
  const api = await client();
  const projected = clone(api.protocolContext({ record, age: { years: 17, months: 0, days: 0 } }));
  let captured;
  const endpoint = 'https://synthetic.invalid/api/ia';
  const ctx = vm.createContext({ TextEncoder, window: { REGULATION_AI_CONFIG: { endpoint }, fetch: async (_url, init) => { captured = JSON.parse(init.body); return { ok: true }; } } });
  vm.runInContext(read('js/pre-regulation-bridge.js'), ctx);
  await ctx.window.fetch(endpoint, { method: 'POST', body: JSON.stringify({ question: 'Exames para convulsão infantil?', protocols: [projected], catalog: Array.from({ length: 120 }, () => ({ nome: 'x'.repeat(500), faixaEtaria: 'x'.repeat(500), viaAcesso: 'x'.repeat(500), situacaoTeleconsulta: 'x'.repeat(500) })), history: Array.from({ length: 12 }, () => ({ role: 'user', text: 'contexto sintético '.repeat(100) })) }) });
  assert.deepEqual(captured.protocols[0].clinicalConditionRecord, record);
  assert.equal(captured.contextCompression, 'clinical_condition_integral_v1');
  assert.equal(captured.protocols[0].clinicalContextualAlerts[0].id, 'IDADE17');
});

test('API recebe todas as regras e fontes com provedor estritamente simulado', async () => {
  const api = await client();
  const protocol = clone(api.protocolContext({ record, age: { years: 17, months: 0, days: 0 } }));
  let prompt = ''; let calls = 0;
  const env = { AI_PROVIDER: 'cloudflare', CLOUDFLARE_AI_FALLBACK_ENABLED: 'true', AI: { run: async (_model, input) => { calls++; prompt = input.messages[1].content; return { response: 'Resposta sintética, sem chamada externa.' }; } } };
  const request = body => new Request('https://synthetic.invalid/api/ia', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  let response = await worker.fetch(request({ question: 'Quais exames para convulsão infantil?', protocols: [protocol], history: [] }), env);
  assert.equal(response.status, 200);
  assert.equal(calls, 1);
  const canonical = JSON.parse(prompt.split('PROTOCOLOS MAIS RELEVANTES:\n')[1].split('\n\nCATÁLOGO OPERACIONAL RESUMIDO:')[0]);
  assert.deepEqual(canonical[0].clinicalConditionRecord, record);
  assert.match(prompt, /17 anos: faixa não explicitada/);
  assert.match(prompt, /Não importar exigências de TEA ou outros motivos/);
  const largeCatalog = Array.from({ length: 120 }, () => ({ nome: 'x'.repeat(180), faixaEtaria: 'x'.repeat(250), viaAcesso: 'x'.repeat(220), situacaoTeleconsulta: 'x'.repeat(220), ultimaConferencia: 'x'.repeat(80) }));
  response = await worker.fetch(request({ question: 'Exames para o piloto?', protocols: [protocol], catalog: largeCatalog }), env);
  assert.equal(response.status, 413);
  assert.match((await response.json()).error, /nenhuma regra foi cortada/);
  assert.equal(calls, 1, 'Envelope excessivo não chama o provedor, nem mesmo simulado');
});

test('HTML, espelho e cache usam registro separado e a mesma revisão', () => {
  for (const file of ['medico/index.html', 'protocolo/index.html', 'recepcao/index.html']) {
    const html = read(file);
    assert.match(html, /<meta name="clinical-condition-pilot" content="20261020-1">/);
    assert.match(html, /clinical-condition-pilot\.js\?v=20261020-1/);
    assert.match(html, /clinical-condition-pilot\.css\?v=20261020-1/);
  }
  const clientSource = read('js/clinical-condition-pilot.js');
  assert.match(clientSource, /file:'convulsao-epilepsia-20261016'/);
  assert.match(clientSource, /VERSION='20261020-1'/);
  assert.match(read('worker/clinical-condition-pilot.js'), /convulsao-epilepsia-20261016\.json/);
  assert.doesNotMatch(read('.github/workflows/sync-local-protocol-source.yml'), /clinical-conditions/);
  assert.doesNotMatch(read('data/protocol-source.html'), /clinicalConditionRecord/);
  assert.match(read('.github/workflows/validate-clinical-pilot.yml'), /contents: read/);
});

test('upgrade de HTML antigo fica restrito às três rotas clínicas e conserva fallback', async () => {
  for (const scenario of [{ path: '/medico/', fresh: true }, { path: '/protocolo/', fresh: true }, { path: '/recepcao/', fresh: true }, { path: '/telemedicina/', fresh: false }, { path: '/medico/', fresh: false, offline: true }]) {
    const wait = []; const old = new Response('<html>shell anterior</html>');
    const ctx = vm.createContext({ URL, Request, Response, TextEncoder, TextDecoder, AbortController, setTimeout, clearTimeout, console,
      self: { location: { origin: 'https://synthetic.invalid' }, addEventListener() {} },
      caches: { open: async () => ({ match: async () => old.clone(), put: async () => {} }) },
      fetch: async () => { if (scenario.offline) throw new Error('offline sintético'); return new Response('<meta name="clinical-condition-pilot" content="20261020-1">shell novo'); }
    });
    vm.runInContext(read('portal-sw.js') + '\nglobalThis.handlePilotPage=handlePage;', ctx);
    const response = await ctx.handlePilotPage({ request: new Request('https://synthetic.invalid' + scenario.path), waitUntil: promise => wait.push(promise) });
    assert.equal((await response.text()).includes('shell novo'), scenario.fresh);
    await Promise.allSettled(wait);
  }
});
