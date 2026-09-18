/**
 * Central de Documentos 4D V4 — habilita escrita SOMENTE depois da validação de login/leitura.
 * Usa a janela nova já preparada; nunca reutiliza a janela antiga.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createInterface } from 'node:readline/promises';
import { randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';

import {
  FIXED, PUBLIC_NAMES, SECRET_NAMES, SafeError, parseJson,
  productionSnapshot, inspectBindings, inspectProduction, buildConfig,
  stateControlSql, validateNewControl, latestVersion, uploadedId,
  verifyUploadedAlias, verifyVersion, runWrangler, writeJson,
  downloadRuntime, inspectMultipart
} from './preparar-nova-janela-4d-v4.mjs';

const UUID = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;
const CONTROL = /^phase4d_[a-f0-9]{32}$/;
const TAG = 'central-docs-phase4d-v4-write';
const MESSAGE = 'Central Docs 4D V4: escrita temporaria controlada';

export function readLedger(base) {
  const file = path.join(base, 'nova-janela-v4.json');
  const value = parseJson(fs.readFileSync(file, 'utf8'));
  if (value?.revision !== '4.0.0'
    || !UUID.test(value.previewVersionId || '')
    || !CONTROL.test(value.controlId || '')
    || value.candidateRelease !== FIXED.candidateRelease
    || value.writeGateEnabled !== false
    || value.production?.deploymentId !== FIXED.productionDeployment
    || value.production?.versionId !== FIXED.productionVersion
    || value.production?.percentage !== 100
    || !Number.isSafeInteger(Number(value.expiresAt))) {
    throw new SafeError('LEDGER_V4_DIVERGENTE');
  }
  const remaining = Number(value.expiresAt) - Math.floor(Date.now() / 1000);
  if (remaining < 15 * 60) throw new SafeError('JANELA_COM_POUCO_TEMPO_RESTANTE');
  return { file, value };
}

export function preparedBase(version, ledger) {
  if (version?.id !== ledger.previewVersionId) throw new SafeError('PREVIEW_PREPARADO_DIVERGENTE');
  const b = inspectBindings(version);
  if (b.vars.DOCUMENTS_DRIVE_WRITE_ENABLED !== 'false') throw new SafeError('PREVIEW_JA_TEM_ESCRITA');
  if (b.vars.DOCUMENTS_HOMOLOGATION_CONTROL_ID !== ledger.controlId) throw new SafeError('CONTROLE_PREVIEW_DIVERGENTE');
  if (b.vars.DOCUMENTS_HOMOLOGATION_RELEASE !== FIXED.candidateRelease) throw new SafeError('RELEASE_PREVIEW_DIVERGENTE');
  if (b.vars.DOCUMENTS_HOMOLOGATION_ORIGIN !== FIXED.pages
    || b.vars.DOCUMENTS_HOMOLOGATION_WORKER_ORIGIN !== FIXED.origin
    || b.vars.ALLOWED_ORIGINS !== FIXED.pages) throw new SafeError('ORIGENS_PREVIEW_DIVERGENTES');
  const runtime = version.resources?.script_runtime;
  if (runtime?.compatibility_date !== '2026-08-25') throw new SafeError('RUNTIME_DIVERGENTE');
  const flags = runtime.compatibility_flags ?? [];
  if (!Array.isArray(flags)) throw new SafeError('FLAGS_RUNTIME_INVALIDAS');
  return { ...b, compatibilityDate: runtime.compatibility_date, compatibilityFlags: flags };
}

export function sessionSql(controlId) {
  if (!CONTROL.test(controlId)) throw new SafeError('CONTROLE_NOVO_INVALIDO');
  return "SELECT count(*) AS sessions FROM document_drive_homologation_sessions WHERE control_id='" + controlId + "';";
}

export function firstRow(value) {
  if (Array.isArray(value)) {
    for (const block of value) if (Array.isArray(block?.results) && block.results.length) return block.results[0];
  }
  if (Array.isArray(value?.results) && value.results.length) return value.results[0];
  return null;
}

async function confirmHuman() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    console.log('');
    console.log('A leitura sem escrita deve ter sido validada no frontend.');
    console.log('A proxima versao do PREVIEW tera DOCUMENTS_DRIVE_WRITE_ENABLED=true.');
    console.log('Produção não será alterada. O controle D1 e o prazo existente serão mantidos.');
    const answer = await rl.question('Para autorizar, digite CONFIRMO LEITURA E LIBERAR ESCRITA 4D: ');
    if (answer.trim() !== 'CONFIRMO LEITURA E LIBERAR ESCRITA 4D') throw new SafeError('CANCELADO_PELO_OPERADOR');
  } finally { rl.close(); }
}

export async function enableWrite() {
  if (process.platform !== 'win32' || !process.env.LOCALAPPDATA) throw new SafeError('USAR_WINDOWS_DO_OPERADOR');
  const baseDir = path.join(process.env.LOCALAPPDATA, 'CentralDocumentos4D');
  const { file: ledgerPath, value: ledger } = readLedger(baseDir);

  const lockPath = path.join(baseDir, 'habilitar-v4.lock');
  const markerPath = path.join(baseDir, 'habilitar-v4-upload-tentado.json');
  if (fs.existsSync(lockPath)) throw new SafeError('OUTRA_EXECUCAO_V4_ATIVA');
  if (fs.existsSync(markerPath)) throw new SafeError('UPLOAD_DE_ESCRITA_V4_JA_TENTADO_NAO_REPETIR');

  let lock;
  try { lock = fs.openSync(lockPath, 'wx', 0o600); }
  catch { throw new SafeError('OUTRA_EXECUCAO_V4_ATIVA'); }

  const work = path.join(baseDir, 'v4-write-' + randomUUID());
  fs.mkdirSync(work, { recursive: true });
  let previewConfig = '';
  let uploaded = false;

  try {
    console.log('1/6 Reconfirmando produção e janela preparada...');
    const minimal = path.join(work, 'wrangler.readonly.json');
    writeJson(minimal, { name: FIXED.worker, account_id: FIXED.account, send_metrics: false });
    const queryMinimal = args => parseJson(runWrangler([...args, '--json', '--config', minimal], work));
    productionSnapshot(queryMinimal(['deployments', 'status']));

    const preparedVersion = queryMinimal(['versions', 'view', ledger.previewVersionId]);
    const base = preparedBase(preparedVersion, ledger);
    inspectProduction(queryMinimal(['versions', 'view', FIXED.productionVersion]), base);
    if (latestVersion(queryMinimal(['versions', 'list'])) !== ledger.previewVersionId) {
      throw new SafeError('OUTRA_VERSAO_FOI_ENVIADA_PARE_PARA_CONFERIR');
    }

    const d1Config = path.join(work, 'wrangler.d1.json');
    writeJson(d1Config, {
      name: FIXED.worker, account_id: FIXED.account, send_metrics: false,
      d1_databases: [{ binding: 'AUTH_DB', database_name: 'portal-regulacao-users', database_id: base.db }]
    });
    const queryD1 = args => parseJson(runWrangler([...args, '--json', '--config', d1Config], work));
    validateNewControl(queryD1(['d1','execute','AUTH_DB','--remote','--command',stateControlSql(ledger.controlId)]),
      Number(ledger.expiresAt), 1);
    const sessions = firstRow(queryD1(['d1','execute','AUTH_DB','--remote','--command',sessionSql(ledger.controlId)]));
    if (!sessions || Number(sessions.sessions) !== 0) throw new SafeError('SESSAO_DE_UPLOAD_JA_EXISTE');

    await confirmHuman();

    console.log('2/6 Baixando runtime fixo e verificando integridade...');
    const entry = await downloadRuntime(work);
    const config = buildConfig(base, entry, ledger.controlId);
    config.vars.DOCUMENTS_DRIVE_WRITE_ENABLED = 'true';
    previewConfig = path.join(work, 'wrangler.write.json');
    writeJson(previewConfig, config);

    console.log('3/6 Gerando e inspecionando dry-run...');
    const flags = ['--preview-alias', FIXED.alias, '--tag', TAG, '--message', MESSAGE];
    const dry = path.join(work, 'write-dry.multipart');
    runWrangler(['versions','upload',...flags,'--dry-run','--outfile',dry,'--config',previewConfig], work);
    await inspectMultipart(fs.readFileSync(dry), config);

    console.log('4/6 Reconfirmando produção e marcando tentativa...');
    productionSnapshot(queryMinimal(['deployments', 'status']));
    if (latestVersion(queryMinimal(['versions', 'list'])) !== ledger.previewVersionId) {
      throw new SafeError('UPLOAD_CONCORRENTE_DETECTADO');
    }
    writeJson(markerPath, {
      revision: '4.0.0-write',
      attemptedAt: new Date().toISOString(),
      controlId: ledger.controlId,
      preparedPreviewVersionId: ledger.previewVersionId,
      expiresAt: ledger.expiresAt
    });

    console.log('5/6 Enviando somente nova versão preview com escrita true...');
    const sent = path.join(work, 'write-enviado.multipart');
    const output = runWrangler(['versions','upload',...flags,'--outfile',sent,'--config',previewConfig], work);
    uploaded = true;
    const writeVersionId = uploadedId(output);
    verifyUploadedAlias(output);
    verifyVersion(queryMinimal(['versions','view',writeVersionId]), config, writeVersionId);

    const versions = [...queryMinimal(['versions','list'])]
      .sort((a,b)=>Date.parse(b.metadata.created_on)-Date.parse(a.metadata.created_on));
    if (versions[0]?.id !== writeVersionId || versions[1]?.id !== ledger.previewVersionId) {
      throw new SafeError('UPLOAD_CONCORRENTE_DETECTADO');
    }

    console.log('6/6 Confirmando controle ainda ativo e produção intacta...');
    validateNewControl(queryD1(['d1','execute','AUTH_DB','--remote','--command',stateControlSql(ledger.controlId)]),
      Number(ledger.expiresAt), 1);
    productionSnapshot(queryMinimal(['deployments', 'status']));

    writeJson(ledgerPath, { ...ledger, writeGateEnabled: true, writePreviewVersionId: writeVersionId,
      writeEnabledAt: new Date().toISOString() });

    console.log('');
    console.log('ESCRITA_4D_LIBERADA');
    console.log('previewVersion=' + writeVersionId);
    console.log('controlId=' + ledger.controlId);
    console.log('expiresAt=' + new Date(Number(ledger.expiresAt) * 1000).toISOString());
    console.log('release=' + FIXED.candidateRelease);
    console.log('writeGate=true');
    console.log('production=' + FIXED.productionVersion + '/' + FIXED.productionDeployment + '/100');
    console.log('proxima_acao=EXECUTAR_MATRIZ_REAL_4D');
  } catch (error) {
    console.log('');
    console.log('OPERACAO_INTERROMPIDA=' + (error instanceof SafeError ? error.message : 'ERRO_NAO_CLASSIFICADO'));
    if (uploaded || fs.existsSync(markerPath)) console.log('NAO_REPETIR_SEM_CONFERIR_O_PREVIEW');
  } finally {
    try { fs.rmSync(work, { recursive: true, force: true }); } catch {}
    try { if (lock) fs.closeSync(lock); } catch {}
    try { fs.unlinkSync(lockPath); } catch {}
  }
}

export async function main() {
  if (process.argv.length !== 3 || process.argv[2] !== '--liberar') throw new SafeError('USAR_LIBERAR');
  if (Number(process.versions.node.split('.')[0]) < 22) throw new SafeError('NODE_22_OU_SUPERIOR_NECESSARIO');
  await enableWrite();
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch(error => {
    console.log('');
    console.log('OPERACAO_INTERROMPIDA=' + (error instanceof SafeError ? error.message : 'ERRO_NAO_CLASSIFICADO'));
    process.exitCode = 1;
  });
}
