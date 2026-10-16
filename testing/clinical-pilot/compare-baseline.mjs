// Compare every legacy record through the old and new local consumers.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root = fileURLToPath(new URL('../../', import.meta.url));
const base = '380a40b1a5e58c309151b066fef0b79ec9313489';
const cache = new Map();
const before = file => {
  if (!cache.has(file)) cache.set(file, execFileSync('git', ['--no-optional-locks', '-c', 'safe.directory=' + root.replace(/\\/g, '/').replace(/\/$/, ''), 'show', base + ':' + file], { cwd: root, maxBuffer: 20 * 1024 * 1024 }));
  return cache.get(file);
};
const after = file => fs.readFileSync(path.join(root, file));
const clone = value => JSON.parse(JSON.stringify(value));
const source = after('data/protocol-source.html');
const lf = value => value.toString('utf8').replace(/\r\n/g, '\n');
assert.equal(lf(source), lf(before('data/protocol-source.html')));
const rawRecords = JSON.parse(source.toString('utf8').match(/const PROTOCOLOS\s*=\s*(\[[\s\S]*?\]);/)[1]);
const report = { base, mirrorUnchangedAfterGitLineEndingNormalization: true, mirrorSha256Lf: createHash('sha256').update(lf(source)).digest('hex'), rawRecords: rawRecords.length, comparisons: [] };
const medicalSets = [];
for (const file of ['js/medical-app.js', 'js/app.js']) {
  const results = [];
  for (const sourceCode of [before(file), after(file)]) {
    const context = vm.createContext({ window: {}, document: { body: { dataset: { page: 'guide' } } }, rawRecords: clone(rawRecords) });
    vm.runInContext(sourceCode.toString('utf8').replace(/initialize\(\);\s*$/, ''), context);
    results.push(clone(vm.runInContext('[...rawRecords,...EXTRA_PROTOCOLS].map(applyOperationalOverrides)', context)));
  }
  assert.deepEqual(results[1], results[0]);
  report.comparisons.push({ consumer: file, unchangedRecords: results[0].length });
  medicalSets.push(results[1]);
}
const projectedSets = [];
for (const records of medicalSets) {
  const results = [];
  for (const sourceCode of [before('js/ai-assistant.js'), after('js/ai-assistant.js')]) {
    const context = vm.createContext({ window: {}, state: { protocols: clone(records), selected: null }, document: { readyState: 'loading', addEventListener() {} } });
    const code = sourceCode.toString('utf8').replace(/\}\)\(\);\s*$/, 'window.testApi={requestContext,protocolContext};})();');
    vm.runInContext(code, context);
    results.push(records.map(record => { context.state.selected = record; return clone(context.window.testApi.requestContext('Quais exames e documentos constam para ' + record.nome + '?')); }));
  }
  assert.deepEqual(results[1], results[0]);
  projectedSets.push(results[1]);
  report.comparisons.push({ consumer: 'js/ai-assistant.js', unchangedContexts: results[1].length });
}
const workerContexts = [];
for (const sourceCode of [before('worker/gemini-assistant.js'), after('worker/gemini-assistant.js')]) {
  const context = vm.createContext({ hydrateClinicalPilot: () => null });
  const code = sourceCode.toString('utf8').replace(/^import .*?;\s*$/mg, '').split('export default')[0];
  vm.runInContext(code, context);
  workerContexts.push(context);
}
for (const contexts of projectedSets) {
  let checked = 0;
  for (const item of contexts) {
    const transformed = [];
    for (const sourceCode of [before('js/pre-regulation-bridge.js'), after('js/pre-regulation-bridge.js')]) {
      let captured;
      const window = { REGULATION_AI_CONFIG: { endpoint: 'https://local.invalid/api/ia' }, fetch: async (url, init) => { captured = JSON.parse(init.body); return new Response('{}'); } };
      vm.runInNewContext(sourceCode.toString('utf8'), { window, TextEncoder });
      const payload = { question: 'Quais exames e documentos?', history: [], protocols: item.protocols, catalog: item.catalog };
      await window.fetch('https://local.invalid/api/ia', { method: 'POST', body: JSON.stringify(payload) });
      transformed.push(captured);
    }
    assert.deepEqual(transformed[1], transformed[0]);
    const workerResults = workerContexts.map(context => {
      context.payload = clone(transformed[1]);
      return clone(vm.runInContext('({protocols:cleanProtocols(payload.protocols),prompt:buildPrompt(payload.question,cleanProtocols(payload.protocols),cleanCatalog(payload.catalog),[],payload.history,payload.assistantMode)})', context));
    });
    assert.deepEqual(workerResults[1], workerResults[0]); checked++;
  }
  report.comparisons.push({ consumer: 'js/pre-regulation-bridge.js + worker/gemini-assistant.js', unchangedPayloadsAndPrompts: checked });
}
report.passed = true;
const output = path.resolve(process.argv[2] || path.join(root, '.local/clinical-pilot/baseline-comparison.json'));
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report));
