/**
 * Encerra a janela 5E em modo fail-closed.
 *
 * Ordem:
 * 1. revoga o controle D1;
 * 2. confirma revogação;
 * 3. publica somente uma nova versão preview com gates de IA false;
 * 4. confirma alias/release e HTTP bloqueado;
 * 5. nunca promove produção.
 */
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';

import {
  FIXED_5E,
  Safe5eError,
  activeVersionFromDeployment,
  buildPreviewConfig,
  disableControlSql,
  downloadRuntime,
  inspectMultipart,
  inspectProductionVersion,
  parseJson,
  runWrangler,
  stateControlSql,
  uploadedVersionId,
  validateControl,
  verifyAliasOutput,
  verifyPreviewVersion,
  writeJson
} from './preparar-homologacao-5e.mjs';

function must(value, code) {
  if (!value) throw new Safe5eError(code);
}

function readLedger(baseDir) {
  const file = path.join(baseDir, 'janela-5e.json');
  must(fs.existsSync(file), 'LEDGER_5E_AUSENTE');
  let value;
  try {
    value = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (_) {
    throw new Safe5eError('LEDGER_5E_INVALIDO');
  }
  must(value?.state === 'active', 'JANELA_5E_NAO_ESTA_ATIVA');
  must(/^phase5e_[a-f0-9]{32}$/i.test(String(value.controlId || '')), 'CONTROLE_5E_LEDGER_INVALIDO');
  must(/^[a-f0-9]{40}$/i.test(String(value.sourceRef || '')), 'SOURCE_REF_5E_LEDGER_INVALIDO');
  must(/^[a-f0-9-]{36}$/i.test(String(value.previewVersion || '')), 'PREVIEW_5E_LEDGER_INVALIDO');
  must(Number.isSafeInteger(Number(value.expiresAt)), 'EXPIRACAO_5E_LEDGER_INVALIDA');
  return { file, value };
}

async function httpBlocked(pagesOrigin, release) {
  const response = await fetch(FIXED_5E.workerOrigin + '/api/documents/ai/config', {
    method: 'GET',
    redirect: 'manual',
    cache: 'no-store',
    credentials: 'omit',
    headers: { Accept: 'application/json', Origin: pagesOrigin },
    signal: AbortSignal.timeout(15000)
  });
  must(response.status === 403, 'HTTP_5E_NAO_BLOQUEADO_APOS_ENCERRAMENTO');
  must(
    String(response.headers.get('X-Central-Docs-AI-Preview-Release') || '').toLowerCase() === release,
    'RELEASE_5E_FINAL_DIVERGENTE'
  );
  must(response.headers.get('Access-Control-Allow-Origin') === pagesOrigin, 'CORS_5E_FINAL_DIVERGENTE');
}

export async function close5e() {
  must(process.platform === 'win32' && process.env.LOCALAPPDATA, 'USAR_WINDOWS_DO_OPERADOR_5E');
  const baseDir = path.join(process.env.LOCALAPPDATA, 'CentralDocumentos5E');
  const { file: ledgerPath, value: ledger } = readLedger(baseDir);

  const lockPath = path.join(baseDir, 'encerrar-5e.lock');
  let lock;
  try {
    lock = fs.openSync(lockPath, 'wx', 0o600);
  } catch (_) {
    throw new Safe5eError('OUTRA_EXECUCAO_ENCERRAMENTO_5E_ATIVA');
  }

  const work = path.join(baseDir, 'close-' + randomUUID());
  fs.mkdirSync(work, { recursive: true });
  let controlRevoked = false;

  try {
    const minimalPath = path.join(work, 'wrangler.readonly.json');
    writeJson(minimalPath, {
      name: FIXED_5E.worker,
      account_id: FIXED_5E.account,
      send_metrics: false
    });
    const queryMinimal = (args) => parseJson(runWrangler(
      [...args, '--json', '--config', minimalPath],
      work
    ));

    console.log('1/5 Reconfirmando preview e banco da janela...');
    const preview = queryMinimal(['versions', 'view', ledger.previewVersion]);
    const base = inspectProductionVersion(preview);

    const d1Path = path.join(work, 'wrangler.d1.json');
    writeJson(d1Path, {
      name: FIXED_5E.worker,
      account_id: FIXED_5E.account,
      send_metrics: false,
      d1_databases: [{
        binding: 'AUTH_DB',
        database_name: 'portal-regulacao-users',
        database_id: base.dbId
      }]
    });
    const queryD1 = (sql) => parseJson(runWrangler([
      'd1', 'execute', 'AUTH_DB', '--remote', '--command', sql,
      '--json', '--config', d1Path
    ], work));

    console.log('2/5 Revogando controle D1 antes de qualquer upload...');
    queryD1(disableControlSql(ledger.controlId));
    validateControl(
      queryD1(stateControlSql(ledger.controlId)),
      Number(ledger.expiresAt),
      0
    );
    controlRevoked = true;

    console.log('3/5 Preparando alias final com gates de IA false...');
    const entry = await downloadRuntime(work, ledger.sourceRef);
    const config = buildPreviewConfig(base, entry, {
      sourceRef: ledger.sourceRef,
      pagesOrigin: ledger.pagesOrigin,
      controlId: ledger.controlId
    });
    config.vars.DOCUMENTS_AI_ENABLED = 'false';
    config.vars.DOCUMENTS_AI_PROCESSING_ENABLED = 'false';
    config.vars.DOCUMENTS_DRIVE_WRITE_ENABLED = 'false';

    const configPath = path.join(work, 'wrangler.closed-5e.json');
    writeJson(configPath, config);

    const flags = [
      '--preview-alias', FIXED_5E.alias,
      '--tag', FIXED_5E.tag,
      '--message', FIXED_5E.message,
      '--experimental-provision=false',
      '--experimental-auto-create=false'
    ];
    const dry = path.join(work, 'closed-5e.multipart');
    runWrangler([
      'versions', 'upload', ...flags,
      '--dry-run', '--outfile', dry,
      '--config', configPath
    ], work);
    await inspectMultipart(fs.readFileSync(dry), config);

    const productionBefore = activeVersionFromDeployment(
      queryMinimal(['deployments', 'status'])
    );

    console.log('4/5 Enviando somente versão preview bloqueada...');
    const output = runWrangler([
      'versions', 'upload', ...flags, '--config', configPath
    ], work);
    const closedVersion = uploadedVersionId(output);
    verifyAliasOutput(output);
    verifyPreviewVersion(
      queryMinimal(['versions', 'view', closedVersion]),
      config,
      closedVersion
    );

    must(
      activeVersionFromDeployment(queryMinimal(['deployments', 'status'])) === productionBefore,
      'PRODUCAO_MUDOU_DURANTE_ENCERRAMENTO_5E'
    );

    console.log('5/5 Confirmando HTTP bloqueado e gravando fechamento...');
    await httpBlocked(ledger.pagesOrigin, ledger.sourceRef);

    writeJson(ledgerPath, {
      ...ledger,
      state: 'closed',
      controlEnabled: false,
      aiGate: false,
      driveWriteGate: false,
      closedPreviewVersion: closedVersion,
      closedAt: new Date().toISOString()
    });

    console.log('');
    console.log('JANELA_5E_ENCERRADA');
    console.log('controlId=' + ledger.controlId);
    console.log('controlEnabled=false');
    console.log('aiGate=false');
    console.log('driveWriteGate=false');
    console.log('previewVersion=' + closedVersion);
    console.log('release=' + ledger.sourceRef);
    console.log('httpBlocked=true');
    return { closedVersion };
  } catch (error) {
    if (controlRevoked) {
      console.log('');
      console.log('CONTROLE_5E_REVOGADO=true');
      console.log('ENCERRAMENTO_5E_PREVIEW_PENDENTE=true');
    }
    throw error;
  } finally {
    try { if (lock) fs.closeSync(lock); } catch (_) {}
    fs.rmSync(lockPath, { force: true });
    fs.rmSync(work, { recursive: true, force: true });
  }
}

export async function main() {
  try {
    must(process.argv.length === 3 && process.argv[2] === '--encerrar', 'USAR_FLAG_ENCERRAR_5E');
    await close5e();
  } catch (error) {
    console.log('');
    console.log(
      'OPERACAO_INTERROMPIDA='
      + (error instanceof Safe5eError ? error.message : 'ERRO_ENCERRAMENTO_5E_NAO_CLASSIFICADO')
    );
    process.exitCode = 1;
  }
}

if (
  process.argv[1]
  && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  await main();
}
