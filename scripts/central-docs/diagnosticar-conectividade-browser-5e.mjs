/**
 * Diagnóstico somente leitura da conectividade Browser -> Worker preview 5E.
 *
 * Não usa credenciais reais, não lê username autorizado, não chama Gemini,
 * não altera D1/Drive/Worker e não promove produção.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { FIXED_5E, Safe5eError } from './preparar-homologacao-5e.mjs';

function must(value, code) {
  if (!value) throw new Safe5eError(code);
}

function readLedger() {
  must(process.platform === 'win32' && process.env.LOCALAPPDATA, 'USAR_WINDOWS_DO_OPERADOR_5E');
  const file = path.join(process.env.LOCALAPPDATA, 'CentralDocumentos5E', 'janela-5e.json');
  must(fs.existsSync(file), 'LEDGER_5E_AUSENTE');
  let ledger;
  try { ledger = JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (_) { throw new Safe5eError('LEDGER_5E_INVALIDO'); }
  must(ledger?.state === 'active', 'JANELA_5E_NAO_ATIVA');
  must(/^https:\/\/[^/]+\.pages\.dev$/.test(String(ledger.pagesOrigin || '')), 'PAGES_ORIGIN_5E_INVALIDA');
  must(/^[a-f0-9]{40}$/i.test(String(ledger.sourceRef || '')), 'RELEASE_5E_INVALIDA');
  return ledger;
}

async function request(pathname, init, timeoutMs = 15000) {
  return fetch(FIXED_5E.workerOrigin + pathname, {
    redirect: 'manual',
    cache: 'no-store',
    credentials: 'omit',
    ...init,
    signal: AbortSignal.timeout(timeoutMs)
  });
}

function releaseOk(response, ledger) {
  return String(response.headers.get('X-Central-Docs-AI-Preview-Release') || '').toLowerCase()
    === String(ledger.sourceRef || '').toLowerCase();
}

function corsOk(response, ledger) {
  return response.headers.get('Access-Control-Allow-Origin') === ledger.pagesOrigin;
}

export async function diagnoseBrowserConnectivity5e() {
  const ledger = readLedger();
  const origin = ledger.pagesOrigin;

  console.log('1/3 GET protegido com Origin autorizado...');
  const get = await request('/api/documents/ai/config', {
    method: 'GET',
    headers: { Accept: 'application/json', Origin: origin }
  });
  const getPass = get.status === 401 && corsOk(get, ledger) && releaseOk(get, ledger);

  console.log('2/3 Preflight CORS do login...');
  const options = await request('/api/auth/login', {
    method: 'OPTIONS',
    headers: {
      Origin: origin,
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'content-type'
    }
  });
  const allowMethods = String(options.headers.get('Access-Control-Allow-Methods') || '');
  const allowHeaders = String(options.headers.get('Access-Control-Allow-Headers') || '').toLowerCase();
  const optionsPass = options.status === 200
    && corsOk(options, ledger)
    && releaseOk(options, ledger)
    && allowMethods.split(',').map(v => v.trim()).includes('POST')
    && allowHeaders.split(',').map(v => v.trim()).includes('content-type');

  console.log('3/3 POST sintético sem credenciais reais...');
  const post = await request('/api/auth/login', {
    method: 'POST',
    headers: { Origin: origin, 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: '__phase5e_probe__', password: '__not_a_real_password__' })
  });
  let postCode = '';
  try {
    const payload = await post.json();
    postCode = String(payload?.code || '');
  } catch (_) {}
  const postPass = post.status === 403
    && postCode === 'AI_HOMOLOGATION_USER_DENIED'
    && corsOk(post, ledger)
    && releaseOk(post, ledger);

  console.log('');
  console.log('DIAGNOSTICO_CONECTIVIDADE_BROWSER_5E');
  console.log('getProtected=' + (getPass ? 'OK' : 'FALHOU'));
  console.log('preflightLogin=' + (optionsPass ? 'OK' : 'FALHOU'));
  console.log('postSynthetic=' + (postPass ? 'OK' : 'FALHOU'));
  console.log('workerReachable=' + (getPass || optionsPass || postPass));
  console.log('corsReady=' + (getPass && optionsPass && postPass));
  console.log('releaseMatch=' + (releaseOk(get, ledger) && releaseOk(options, ledger) && releaseOk(post, ledger)));

  if (!(getPass && optionsPass && postPass)) {
    throw new Safe5eError('CONECTIVIDADE_BROWSER_5E_DIVERGENTE');
  }
  return true;
}

export async function main() {
  try {
    must(process.argv.length === 3 && process.argv[2] === '--diagnosticar', 'USAR_FLAG_DIAGNOSTICAR_CONECTIVIDADE_5E');
    await diagnoseBrowserConnectivity5e();
  } catch (error) {
    console.log('');
    console.log('DIAGNOSTICO_CONECTIVIDADE_BROWSER_5E_FALHOU='
      + (error instanceof Safe5eError ? error.message : 'ERRO_CONECTIVIDADE_5E_NAO_CLASSIFICADO'));
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await main();
}
