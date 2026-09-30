import test from 'node:test';
import assert from 'node:assert/strict';
import { compilePresentation } from '../scripts/studies-mp-presentation.mjs';
import { loadMpEditorial, compileMpCandidate } from '../scripts/studies-mp-candidate.mjs';
import { MP_MISSIONS, MP_SOURCES } from '../studies-content/banking-markets-policy-v1.js';

const candidate = compileMpCandidate(await loadMpEditorial());
const blocks = candidate.missions.flatMap(mission => [...mission.sections, ...mission.questions].flatMap(item => item.presentation || []));

test('artefato integrado corresponde à conversão e tem a publicação explicitamente aprovada', () => {
  assert.deepEqual(MP_MISSIONS, candidate.missions);
  assert.deepEqual(MP_SOURCES, candidate.sources);
  assert.ok(MP_MISSIONS.every(mission => mission.publication.status === 'published'));
});

test('cinco figuras e três tabelas derivam dos dados aprovados, sem baixar Mermaid', () => {
  const curves = blocks.filter(block => block.type === 'line-chart');
  assert.deepEqual(curves.map(curve => curve.y), [[6, 7, 8], [9, 8, 7], [8, 6, 7]]);
  assert.ok(curves.every(curve => curve.x.join() === '1,2,3'));
  assert.equal(blocks.filter(block => block.type === 'table').length, 3);
  const flows = blocks.filter(block => block.type === 'flow');
  assert.equal(flows.length, 2);
  assert.equal(flows[0].edges[0].from, 'Banco A: fornece recursos');
  assert.equal(flows[0].edges[0].label, '30 hoje');
  for (const flow of flows) {
    assert.equal(flow.edges.length, 2);
    assert.equal(flow.edges[0].from, flow.edges[1].to);
    assert.equal(flow.edges[0].to, flow.edges[1].from);
  }
});

test('cada referência abre trecho real anterior, sem alterar corpo ou enunciado revisado', () => {
  for (const mission of candidate.missions) for (const item of [...mission.sections, ...mission.questions]) {
    for (const block of item.presentation || []) for (const run of block.runs || []) {
      if (!run.missionId) continue;
      const target = candidate.missions.find(entry => entry.id === run.missionId);
      assert.ok(target && target.order <= mission.order);
      assert.ok(target.sections.some(section => section.id === run.sectionId));
    }
  }
  assert.equal(blocks.flatMap(block => block.runs || []).filter(run => run.href).length, 1);
  assert.ok(candidate.missions.every(mission => Number.isInteger(mission.estimatedMinutes) && mission.estimatedMinutes >= 20));
});

test('formato desconhecido, tabela divergente e link não resolvido bloqueiam conversão', () => {
  assert.throws(() => compilePresentation('```mermaid\nsequenceDiagram\n```'), /não suportado/);
  assert.throws(() => compilePresentation('[x](javascript:alert)', () => null), /não resolvido/);
  assert.throws(() => compilePresentation('| Ano | Taxa |\n| --- | --- |\n| 1 |'), /Tabela MP inválida/);
  const mismatch = '| Anos | Taxa |\n| --- | --- |\n| 1 | 1 |\n| 2 | 2 |\n\n```mermaid\nxychart-beta\n title "Teste"\n x-axis "Anos" [1, 2]\n y-axis "Taxa" 0 --> 5\n line [2, 3]\n```';
  assert.throws(() => compilePresentation(mismatch), /divergentes/);
});
