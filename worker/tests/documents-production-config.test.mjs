import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const wranglerUrl = new URL('../wrangler.toml', import.meta.url);

test('produção libera Drive e IA documental normal sem automação antecipatória', async () => {
  const toml = await readFile(wranglerUrl, 'utf8');

  assert.match(
    toml,
    /ALLOWED_ORIGINS = "https:\/\/regulacaoeldoradoms\.com\.br,https:\/\/www\.regulacaoeldoradoms\.com\.br"/
  );
  assert.doesNotMatch(
    toml,
    /codex-central-docs-drive-syn\.portal-regulacao-central-staging\.pages\.dev/
  );
  assert.match(toml, /DOCUMENTS_DRIVE_WRITE_ENABLED = "true"/);
  assert.match(toml, /DOCUMENTS_HOMOLOGATION_ORIGIN = ""/);
  assert.match(toml, /DOCUMENTS_AI_ENABLED = "true"/);
  assert.match(toml, /DOCUMENTS_AI_PROCESSING_ENABLED = "true"/);
  assert.match(toml, /DOCUMENTS_AI_BACKGROUND_ENABLED = "false"/);
  assert.match(toml, /DOCUMENTS_AI_FREE_ONLY = "true"/);
  assert.match(toml, /DOCUMENTS_AI_FAST_VISION_ENABLED = "false"/);
  assert.match(toml, /\[ai\]\s*binding = "AI"/s);
});
