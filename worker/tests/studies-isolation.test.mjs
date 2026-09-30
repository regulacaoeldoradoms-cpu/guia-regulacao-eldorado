import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { PC_FILE, FIXED_FILES, REVIEWED_FIELDS, scanStudiesIsolation, collectStudyFiles } from '../scripts/check-studies-isolation.mjs';
import { PC_MISSIONS, PC_SOURCES } from '../studies-content/banking-products-credit-v1.js';

const root = fileURLToPath(new URL('../../', import.meta.url));
const source = readFileSync(resolve(root, PC_FILE), 'utf8').replace(/\r\n/g, '\n');
const comments = source.split('\n').slice(0, 2).join('\n') + '\n';
const clinical = ['CNS', 'CPF', 'prontuario', 'prontuário', 'paciente', 'patient', 'diagnostico', 'diagnóstico', 'encaminhamento', 'CORE'];
const institutional = ['firebase', 'firestore', 'google_drive', 'document_drive', 'telemedicina'];
const scan = (text, file = PC_FILE) => scanStudiesIsolation([[file, text]]);
function render(missions = PC_MISSIONS, sources = PC_SOURCES) {
  return comments + 'export const PC_MISSIONS = Object.freeze(' + JSON.stringify(missions, null, 2) + ');\n'
    + 'export const PC_SOURCES = Object.freeze(' + JSON.stringify(sources, null, 2) + ');\n';
}
function fieldIn(missions, [missionId, sectionId, field]) {
  const mission = missions.find(m => m.id === missionId);
  return sectionId === null ? [mission.recall, field] : [mission.sections.find(s => s.id === sectionId), field];
}
function tempRepo(t) {
  const dir = mkdtempSync(resolve(tmpdir(), 'pc-isolation-'));
  // Remoção restrita ao diretório criado neste teste; nunca usa caminho de conteúdo recebido.
  t.after(() => {
    assert.ok(dir.startsWith(resolve(tmpdir(), 'pc-isolation-')));
    rmSync(dir, { recursive: true, force: true });
  });
  for (const file of [...FIXED_FILES, 'worker/studies-content/empty.js', 'worker/studies-assessment-content/empty.js']) {
    mkdirSync(dirname(resolve(dir, file)), { recursive: true });
    writeFileSync(resolve(dir, file), '');
  }
  return dir;
}

test('catálogo intacto: somente seis ocorrências editoriais exatas deixam de ser falsos positivos', () => {
  assert.equal(render(), source);
  assert.equal((source.match(/\b(CNS|CPF|prontu[aá]rio|paciente|patient|diagn[oó]stico|encaminhamento|CORE)\b/giu) || []).length, 6);
  assert.equal(REVIEWED_FIELDS.length, 6);
  assert.deepEqual(scan(source), []);
  assert.deepEqual(scanStudiesIsolation(collectStudyFiles(root)), []);
});

test('conserva todos os termos assistenciais, variantes e escopos backend/frontend', () => {
  for (const file of ['worker/studies.js', 'js/studies.js', 'estudos/index.html']) {
    for (const term of clinical) {
      const issues = scan('"' + term.toLowerCase() + '"', file);
      assert.equal(issues.length, 1, file + ': ' + term);
      assert.equal(issues[0].rule, 'clinical-term');
    }
  }
});

test('limites Unicode não abrem passagem para termos proibidos', () => {
  for (const token of ['CPF²', 'ÁCPF', '診CPF', 'patient©']) assert.ok(scan(token, 'worker/studies.js').length > 0);
});

test('cinco dependências institucionais continuam proibidas inclusive nas fontes do PC', () => {
  for (const dependency of institutional) {
    assert.equal(scan('import x from "' + dependency.toUpperCase() + '";', 'worker/study-rounds.js')[0].rule, 'institutional-dependency');
    const sources = structuredClone(PC_SOURCES);
    sources[0].url = 'https://' + dependency + '.example.test';
    const issues = scan(render(PC_MISSIONS, sources));
    assert.equal(issues.length, 1);
    assert.equal(issues[0].rule, 'institutional-dependency');
  }
});

test('não exclui o arquivo PC: rotas, SQL e identificadores sintéticos novos continuam bloqueados', () => {
  for (const payload of ['/api/patient/123', '/api/telemedicina/consultas', 'SELECT * FROM paciente', '{"CPF":"000.000.000-00"}', '{"CNS":"000000000000000"}']) {
    const sources = structuredClone(PC_SOURCES);
    sources[0].note = payload;
    assert.ok(scan(render(PC_MISSIONS, sources)).length > 0, payload);
  }
});

test('alterar um caractere de cada campo revisado exige nova revisão, sem autorização herdada', () => {
  for (const path of REVIEWED_FIELDS) {
    const missions = structuredClone(PC_MISSIONS);
    const [owner, key] = fieldIn(missions, path);
    owner[key] += '!';
    assert.equal(scan(render(missions)).length, 1, path.join('/'));
  }
});

test('dados proibidos na mesma linha/campo dos seis textos legítimos continuam detectados', () => {
  for (const path of REVIEWED_FIELDS) {
    const missions = structuredClone(PC_MISSIONS);
    const [owner, key] = fieldIn(missions, path);
    owner[key] += ' CPF: 000.000.000-00; paciente fictício.';
    const issues = scan(render(missions));
    assert.ok(issues.some(issue => issue.term === 'CPF'));
    assert.ok(issues.some(issue => issue.term === 'paciente'));
    assert.ok(issues.length >= 3);
  }
});

test('não admite texto aprovado copiado em outro campo, missão ou arquivo', () => {
  for (const path of REVIEWED_FIELDS) {
    const missions = structuredClone(PC_MISSIONS);
    const [owner, key] = fieldIn(missions, path);
    missions[1].questions[0].prompt = owner[key];
    assert.equal(scan(render(missions)).length, 2);
  }
  assert.equal(scan(source, 'worker/studies.js').length, 6);
  assert.equal(scan(source, 'worker/studies-content/outro.js').length, 6);
});

test('mudar caminho semântico ou duplicar missão não transforma texto em exceção geral', () => {
  const moved = structuredClone(PC_MISSIONS);
  moved[0].sections.find(s => s.id === 'perguntas').id = 'outra-secao';
  assert.equal(scan(render(moved)).length, 1);
  const duplicated = structuredClone(PC_MISSIONS);
  duplicated.push(duplicated[0]);
  assert.ok(scan(render(duplicated)).length >= 6);
});

test('JSON inválido, propriedades duplicadas ou código executável não recebem contextos aprovados', () => {
  assert.equal(scan(source.replace('Object.freeze([', 'Object.freeze([/* inválido */')).length, 6);
  const duplicateKey = source.replace('"id": "banking.pc.pessoas",', '"id": "banking.pc.pessoas",\n    "id": "banking.pc.pessoas",');
  assert.equal(scan(duplicateKey).length, 6);
  assert.equal(scan(source + 'globalThis.__isolationExecuted = true;\n').length, 6);
  assert.equal(globalThis.__isolationExecuted, undefined);
});

test('enumeração conserva os arquivos da CI e inclui novos JS dos dois diretórios de conteúdo', t => {
  const dir = tempRepo(t);
  writeFileSync(resolve(dir, 'worker/studies-content/new.js'), 'patient');
  writeFileSync(resolve(dir, 'worker/studies-assessment-content/new.js'), 'firebase');
  const files = collectStudyFiles(dir);
  assert.deepEqual(files.map(([file]) => file).sort(), [
    'worker/studies.js', 'worker/study-rounds.js', 'worker/study-assessments.js',
    'js/studies.js', 'js/studies-reader.js', 'js/studies-clock.js', 'estudos/index.html',
    'worker/studies-content/empty.js', 'worker/studies-content/new.js',
    'worker/studies-assessment-content/empty.js', 'worker/studies-assessment-content/new.js'
  ].sort());
  assert.equal(scanStudiesIsolation(files).length, 2);
});

test('comando da CI falha com termo, dependência ou arquivo ausente; não imprime valores pessoais', t => {
  const dir = tempRepo(t);
  const command = resolve(root, 'worker/scripts/check-studies-isolation.mjs');
  const run = () => spawnSync(process.execPath, [command], { cwd: dir, encoding: 'utf8', timeout: 5000 });
  assert.equal(run().status, 0);
  const target = resolve(dir, 'worker/studies.js');
  writeFileSync(target, 'const data={CPF:"000.000.000-00"};');
  let result = run();
  assert.equal(result.status, 1);
  assert.match(result.stderr, /clinical-term: CPF/);
  assert.doesNotMatch(result.stderr, /000\.000\.000-00/);
  writeFileSync(target, 'import x from "firestore";');
  result = run();
  assert.equal(result.status, 1);
  assert.match(result.stderr, /institutional-dependency: firestore/);
  rmSync(target);
  assert.notEqual(run().status, 0);
});

test('workflow mantém detector obrigatório e Chromium dependente, sem permissões adicionais', () => {
  const workflow = readFileSync(resolve(root, '.github/workflows/validate-missao-bancaria.yml'), 'utf8');
  assert.match(workflow, /name: Validar isolamento assistencial\s+run: node worker\/scripts\/check-studies-isolation\.mjs/);
  assert.match(workflow, /permissions:\s+contents: read/);
  assert.match(workflow, /name: Leitura e prática — Chromium sintético\s+needs: validate-studies/);
});
