import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const entry = readFileSync(new URL('../../worker/index.js', import.meta.url), 'utf8');
const resilience = readFileSync(new URL('../../worker/ai-resilience.js', import.meta.url), 'utf8');
function assertWiring(source) {
  assert.match(source, /import\s*\{\s*fetchAiResilient\s*\}\s*from\s*['"]\.\/ai-resilience\.js['"]/);
  assert.match(source, /if\s*\(url\.pathname === '\/api\/ia' && request\.method === 'POST'\)\s*\{\s*return fetchAiResilient\(request, env, ctx, origin, originAllowed\);\s*\}/);
}
test('the POST IA route delegates to the extracted resilience module', () => {
  assertWiring(entry);
  assert.match(resilience, /export async function fetchAiResilient\(/);
  for (const marker of ['GEMINI_TOTAL_TIMEOUT_MS','gemini_resilience_exhausted','cloudflare_ai_fallback_succeeded','AI_PROVIDERS_TEMPORARILY_UNAVAILABLE']) assert.ok(resilience.includes(marker), marker);
});
test('a removed module import remains a failed contract', () => {
  assert.throws(() => assertWiring(entry.replace("import { fetchAiResilient } from './ai-resilience.js';", '')));
});
test('bypassing resilience or routing it under the wrong method remains a failed contract', () => {
  assert.throws(() => assertWiring(entry.replace('return fetchAiResilient(request, env, ctx, origin, originAllowed);', 'return aiWorker.fetch(request, env, ctx);')));
  assert.throws(() => assertWiring(entry.replace("url.pathname === '/api/ia' && request.method === 'POST'", "url.pathname === '/api/ia' && request.method === 'GET'")));
});
