// Inventário offline; não ativa conteúdo nem importa ferramentas no Worker.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PUBLISHED_MISSIONS } from '../studies-content/manifest.js';
import { DP_MISSIONS } from '../studies-content/banking-digital-payments-v1.js';
import { IS_MISSIONS } from '../studies-content/banking-institution-specific-v1.js';

const manifest = await readFile(new URL('../studies-content/manifest.js', import.meta.url), 'utf8');
const groups = [];
for (const match of manifest.matchAll(/import \{ (\w+)_MISSIONS, \w+_SOURCES \} from '\.\/(portuguese-[^']+)';/g)) {
  const module = await import(`../studies-content/${match[2]}`);
  groups.push({ name: match[1], missions: module[`${match[1]}_MISSIONS`] });
}
groups.sort((a, b) => a.missions[0].order - b.missions[0].order);
assert.equal(groups.length, 13);
const portuguese = groups.flatMap(g => g.missions);
const chain = [...PUBLISHED_MISSIONS, ...DP_MISSIONS, ...portuguese, ...IS_MISSIONS];
assert.equal(new Set(chain.map(m => m.id)).size, chain.length);
assert.deepEqual(chain.map(m => m.order), chain.map((_, i) => i + 1));
const drafts = chain.slice(PUBLISHED_MISSIONS.length);
assert(drafts.every(m => m.publication.status === 'draft' && m.candidate.parametersApproved === false));
for (let i = PUBLISHED_MISSIONS.length; i < chain.length; i++) {
  assert.equal(chain[i].candidate.prerequisiteId, chain[i - 1].id);
}
const count = missions => ({ units: missions.length, questions: missions.reduce((n, m) => n + m.questions.length, 0), optionReasons: missions.reduce((n, m) => n + m.questions.reduce((s, q) => s + q.optionRationales.length, 0), 0) });
const blocks = [...new Set(portuguese.map(m => m.candidate.blockId))].map(blockId => ({ blockId, ...count(portuguese.filter(m => m.candidate.blockId === blockId)) }));
const remoteNames = new Set(['LP', 'PT', 'OA', 'OL']);
const localOnly = groups.filter(g => !remoteNames.has(g.name)).flatMap(g => g.missions);
console.log(JSON.stringify({ publicationReady: false, verifiedBase: '220f30989ff6215dc539c1d51f72823bb90e7c77', remoteDraft: { pr: 602, head: 'dbc272e983a4da0d75e60b564cd06d9280b14f4a', ...count(groups.filter(g => remoteNames.has(g.name)).flatMap(g => g.missions)) }, localOnly: count(localOnly), portuguese: count(portuguese), blocks, prerequisitesOutsidePortuguese: { DP: count(DP_MISSIONS), IS_CAIXA: count(IS_MISSIONS) }, chainUnits: chain.length, groups: groups.map(g => ({ name: g.name, ...count(g.missions), orders: [g.missions[0].order, g.missions.at(-1).order], prerequisiteId: g.missions[0].candidate.prerequisiteId, releaseSequence: g.missions[0].publication.releaseSequence })) }, null, 2));
