import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const root = new URL('../../', import.meta.url);

async function read(path) {
  return fs.readFile(new URL(path, root), 'utf8');
}

test('painel 5A existe mas permanece oculto sem feature gate e capability extract', async () => {
  const [html, js, css, router, wrangler] = await Promise.all([
    read('documentos/index.html'),
    read('js/documents.js'),
    read('css/documents.css'),
    read('worker/documents-router.js'),
    read('worker/wrangler.toml')
  ]);

  assert.match(html, /id="documentAiButton"[^>]*hidden/);
  assert.match(html, /id="documentsAiPanel"[^>]*hidden/);
  assert.match(html, /nenhum conteúdo deste PDF é enviado a um provedor de IA/i);
  assert.match(css, /\.documents-ai-panel\[hidden\]/);
  assert.match(js, /\/api\/documents\/ai\/config/);
  assert.match(js, /documentAiCapabilities\(\)\.extract === true/);
  assert.match(js, /state\.documentAiConfig\?\.enabled === true/);
  assert.match(router, /requireCapability\(user, 'extract', origin\)/);
  assert.match(wrangler, /DOCUMENTS_AI_ENABLED = "false"/);
  assert.match(wrangler, /DOCUMENTS_AI_PROCESSING_ENABLED = "false"/);
});

test('frontend 5A não contém segredo de provedor nem rota de envio de página', async () => {
  const [html, js] = await Promise.all([
    read('documentos/index.html'),
    read('js/documents.js')
  ]);
  const frontend = html + '\n' + js;
  assert.doesNotMatch(frontend, /GEMINI_API_KEY|DRIVE_TOKEN_ENCRYPTION_KEY|AUTH_SESSION_SECRET/);
  assert.doesNotMatch(frontend, /\/api\/documents\/ai\/page\/analyze/);
  assert.doesNotMatch(frontend, /inlineData|base64.*page|page_text/i);
});

test('rotinas públicas exibidas no painel não incluem instrução interna', async () => {
  const js = await read('js/documents.js');
  assert.match(js, /routine\.id/);
  assert.match(js, /routine\.purpose/);
  assert.doesNotMatch(js, /routine\.system/);
});
