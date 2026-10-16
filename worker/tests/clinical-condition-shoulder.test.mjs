import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import worker from '../gemini-assistant.js';
import { clinicalPilotRecord, hydrateClinicalPilot } from '../clinical-condition-pilot.js';
const root = new URL('../../', import.meta.url), read = p => fs.readFileSync(new URL(p, root), 'utf8');
const shoulder = clinicalPilotRecord('digsaude.ortopedia.dor-no-ombro');
const related = clinicalPilotRecord('sisreg-campo-grande.ortopedia.referencias-ombro');
const clone = value => JSON.parse(JSON.stringify(value));
const rule = id => shoulder.rules.find(rule => rule.id === id);
async function client(failId, transform = value => value) {
  const window = {}, document = { querySelector: () => null };
  const context = vm.createContext({ window, document, URL, AbortController, setTimeout, clearTimeout, fetch: async url => {
    const file = new URL(url, 'https://local.invalid').pathname.slice(1);
    const value = transform(JSON.parse(read(file))); return { ok: value.id !== failId, status: value.id === failId ? 503 : 200, json: async () => value };
  } });
  vm.runInContext(read('js/clinical-condition-pilot.js'), context); await window.ClinicalConditionPilot.ready;
  return window.ClinicalConditionPilot;
}
test('matriz OM preserva alternativas, incidências e TC condicional mais disponibilidade', () => {
  assert.equal(shoulder.rules.length, 16);
  assert.deepEqual(rule('RX').views, ['AP', 'P', 'axilar']);
  assert.equal(rule('RX').requirement, 'obrigatorio'); assert.equal(rule('USG').requirement, 'obrigatorio');
  assert.equal(rule('RM').requirement, 'opcional_documental'); assert.equal(rule('RM').availability, 'se_houver');
  assert.equal(rule('TC').requirement, 'condicional_se_houver'); assert.equal(rule('TC').availability, 'se_houver');
  assert.deepEqual(rule('TC').applicability.anyOf, ['historia_de_instabilidade', 'luxacao_recidivante']);
  assert.deepEqual(rule('OA').anyOf, [{ optimizedTreatmentMonths: 6, symptom: 'dor_refrataria' }, { functionalImpact: 'importante_prejuizo_as_atividades_de_vida_diaria' }]);
  assert.equal(rule('PARCIAL').optimizedTreatmentMonths, undefined);
  assert.deepEqual(rule('PARCIAL').anyOf, ['progressao', 'dor_refrataria_ao_tratamento_clinico_otimizado']);
  assert.equal(rule('LUXACAO').prerequisite, 'avaliacao_em_servico_de_emergencia');
  assert.match(rule('OA').text, /6 meses ou importante prejuízo/);
  assert.match(rule('CIRURGIA').text, /incerteza quando a data for desconhecida/);
});
test('cada item mantém localização e fonte; hash não é confundido com vigência', () => {
  for (const record of [shoulder, related]) {
    assert.ok(record.rules.every(rule => rule.sourceLocations.length && rule.sourceRefs.every(ref => record.sources.some(source => source.id === ref))));
    assert.ok(record.sources.filter(source => source.fileHash).every(source => /^[a-f0-9]{64}$/.test(source.fileHash)));
    assert.match(record.status, /sem_vigencia_confirmada/);
  }
  assert.equal(shoulder.sources[0].fileHash, clinicalPilotRecord().sources[0].fileHash);
  assert.equal(related.sources[0].fileHash, 'e55027e9c928148dedf022584e164ea8ad6059e6a5698970c87e36b69c60673c');
  assert.deepEqual(rule('RX').sourceLocations, [{ source: 'TEL2', physical: '49', printed: '43' }]);
  assert.match(shoulder.uncertainties.find(u => u.id === 'INDISPONIVEIS').text, /A seção não informa dispensa formal/);
});
test('SISREG preserva seções relacionadas sem importar pacote DigSaúde ou criar regra CORE', () => {
  assert.equal(related.rules.length, 11);
  assert.equal(related.recordType, 'related_sections_not_dedicated_shoulder_protocol');
  assert.match(related.provenance, /hash de S3/);
  assert.doesNotMatch(related.provenance, /hash de S2/);
  assert.equal(related.rules.find(rule => rule.id === 'IMAGEM_APS').requirement, 'deverao_ser_informados');
  assert.match(related.rules.find(rule => rule.id === 'IMAGEM_APS').text, /RX AP\/perfil e USG/);
  assert.match(related.rules.find(rule => rule.id === 'ESPECIALISTA').text, /especialista em ortopedia geral/);
  assert.match(related.rules.find(rule => rule.id === 'CIRURGIA_OMBRO').text, /cotovelo\/ombro e túnel cubital/);
  assert.match(related.systemBoundary, /não.*protocolo específico|Não constituem protocolo específico/i);
  assert.match(related.rules.find(rule => rule.id === 'AGUDOS').text, /não se aplica como regra de espera para trauma agudo/);
});
test('seleção por sistema, fronteira etária e falha de um registro ficam isoladas', async () => {
  const api = await client();
  assert.equal(api.matches('dor no ombro DigSaúde', shoulder.id), true);
  assert.equal(api.matches('dor no ombro SISREG', shoulder.id), false);
  assert.equal(api.matches('dor no ombro SISREG', related.id), true);
  assert.equal(api.matches('ombro CORE'), false);
  assert.equal(api.ageNotice({ years: 17, months: 11, days: 29 }, shoulder.id).id, 'FORA_FAIXA');
  assert.equal(api.ageNotice({ years: 18, months: 0, days: 0 }, shoulder.id), null);
  assert.equal(api.ageNotice({ years: 18, months: 0, days: 0 }, related.id).id, 'FRONTEIRA18');
  assert.equal(api.ageNotice({ years: 130, months: 11, days: 29 }, related.id), null);
  assert.equal(api.ageNotice({ years: 131, months: 0, days: 0 }, related.id).id, 'FORA_FAIXA');
  const partiallyUnavailable = await client(shoulder.id);
  assert.equal(partiallyUnavailable.record(shoulder.id), null);
  assert.equal(partiallyUnavailable.record(related.id).rules.length, 11);
  assert.equal(partiallyUnavailable.record().rules.length, 15);
  const missingPresentation = await client(undefined, value => {
    if (value.id === shoulder.id) value.sections = value.sections.filter(section => !section.ruleIds.includes('TC'));
    return value;
  });
  assert.equal(missingPresentation.record(shoulder.id), null);
  assert.equal(missingPresentation.record(related.id).rules.length, 11);
});
test('tela/impressão, resposta local e Worker conservam integralmente o recorte selecionado', async () => {
  const api = await client();
  for (const record of [shoulder, related]) {
    const selected = { record, age: { years: 18, months: 0, days: 0 }, query: 'ombro' };
    const projected = clone(api.protocolContext(selected));
    assert.deepEqual(hydrateClinicalPilot(projected), projected);
    assert.deepEqual(projected.clinicalConditionRecord, record);
    if (record.id === shoulder.id) {
      assert.equal(projected.informacoesClinicasObrigatorias.length, 4);
      assert.ok(projected.informacoesClinicasObrigatorias.every(text => !text.includes('interpretação de imagem')));
    }
    const html = api.printDocument(selected);
    assert.deepEqual([...html.matchAll(/data-clinical-rule="([^"]+)"/g)].map(m => m[1]).sort(), record.rules.map(r => r.id).sort());
    assert.match(html, /Notas de fonte e pontos em aberto/);
    assert.doesNotMatch(html, /Exame neurológico|Eletroencefalograma/);
  }
  const ctx = { record: shoulder, age: null };
  const answer = api.localAnswer('Quais exames para ombro?', ctx);
  assert.match(answer, /AP \+ P \+ axilar/); assert.match(answer, /USG de ombro: obrigatório/);
  assert.match(answer, /TC do ombro apenas se houver história de instabilidade ou luxação recidivante, e se houver o exame/);
  assert.match(answer, /não descreve dispensa/);
  const otherSystem = api.localAnswer('Quais exames no SISREG?', ctx);
  assert.match(otherSystem, /SISREG \/ Campo Grande/);
  assert.match(otherSystem, /RX AP\/perfil e USG/);
  assert.doesNotMatch(otherSystem, /AP \+ P \+ axilar: obrigatório/);
  assert.match(api.localAnswer('Quais exames para convulsão?', ctx), /escolha o sistema/);
  assert.equal(api.localOnlyQuestion('Quais exames no CORE?', ctx), true);
  assert.match(api.localAnswer('Quais exames no CORE?', ctx), /nenhuma fonte clínica ambulatorial foi validada/);
  const sg = clone(api.protocolContext({ record: related, age: null }));
  assert.deepEqual(sg.examesObrigatorios, []);
  assert.deepEqual(sg.examesCondicionais, []);
});
test('comparação mantém dois registros completos mesmo em envelope grande', async () => {
  const api = await client(); let captured;
  const protocols = [shoulder, related].map(record => api.protocolContext({ record, age: null }));
  const endpoint = 'https://local.invalid/api/ia', window = { REGULATION_AI_CONFIG: { endpoint }, fetch: async (url, init) => { captured = JSON.parse(init.body); return {}; } };
  vm.runInNewContext(read('js/pre-regulation-bridge.js'), { window, TextEncoder });
  await window.fetch(endpoint, { method: 'POST', body: JSON.stringify({ question: 'Compare os sistemas para ombro', protocols, catalog: Array.from({ length: 120 }, () => ({ nome: 'x'.repeat(500), faixaEtaria: 'x'.repeat(500), viaAcesso: 'x'.repeat(500), situacaoTeleconsulta: 'x'.repeat(500) })), history: Array.from({ length: 12 }, () => ({ role: 'user', text: 'contexto artificial '.repeat(120) })) }) });
  assert.equal(captured.protocols.length, 2);
  assert.deepEqual(captured.protocols.map(p => p.clinicalConditionRecord), [shoulder, related]);
});
test('API reidrata os dois sistemas e rejeita revisão trocada, com provedor simulado', async () => {
  const api = await client(); const protocols = [shoulder, related].map(record => clone(api.protocolContext({ record, age: null })));
  let prompt = '', calls = 0; const env = { AI_PROVIDER: 'cloudflare', CLOUDFLARE_AI_FALLBACK_ENABLED: 'true', AI: { run: async (model, input) => { calls++; prompt = input.messages[1].content; return { response: 'Resultado de teste local.' }; } } };
  const request = protocols => new Request('https://local.invalid/api/ia', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: 'Compare os sistemas para ombro', protocols }) });
  const response = await worker.fetch(request(protocols), env); assert.equal(response.status, 200); assert.equal(calls, 1);
  const extracted = JSON.parse(prompt.split('PROTOCOLOS MAIS RELEVANTES:\n')[1].split('\n\nCATÁLOGO OPERACIONAL RESUMIDO:')[0]);
  assert.deepEqual(extracted.map(p => p.clinicalConditionRecord), [shoulder, related]);
  assert.match(prompt, /TC requer a condição clínica descrita E disponibilidade/);
  assert.match(prompt, /não provam pactuação e não são regras CORE/);
  protocols[0].clinicalConditionRecord.revision = related.revision;
  assert.equal((await worker.fetch(request(protocols), env)).status, 409); assert.equal(calls, 1);
});
