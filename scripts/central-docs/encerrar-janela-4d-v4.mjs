/**
 * Central de Documentos 4D V4 — encerramento fail-closed da janela.
 * Primeiro revoga o controle D1; depois, quando necessário, recoloca o alias em gate=false.
 */
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';

import {
  FIXED, SafeError, parseJson, inspectBindings, buildConfig,
  stateControlSql, runWrangler, writeJson, downloadRuntime,
  inspectMultipart, uploadedId, verifyUploadedAlias, verifyVersion
} from './preparar-nova-janela-4d-v4.mjs';

const UUID = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;
const CONTROL = /^phase4d_[a-f0-9]{32}$/;
const TAG = 'central-docs-phase4d-v4-closed';
const MESSAGE = 'Central Docs 4D V4: janela encerrada; escrita bloqueada';

export function readCloseLedger(base) {
  const file = path.join(base, 'nova-janela-v4.json');
  const value = parseJson(fs.readFileSync(file, 'utf8'));
  if (value?.revision !== '4.0.0'
    || !UUID.test(value.previewVersionId || '')
    || !CONTROL.test(value.controlId || '')
    || value.candidateRelease !== FIXED.candidateRelease
    || !Number.isSafeInteger(Number(value.expiresAt))
    || typeof value.writeGateEnabled !== 'boolean') {
    throw new SafeError('LEDGER_V4_DIVERGENTE');
  }
  if (value.writeGateEnabled === true && !UUID.test(value.writePreviewVersionId || '')) {
    throw new SafeError('PREVIEW_ESCRITA_NAO_IDENTIFICADO');
  }
  return { file, value };
}

export function disableControlSql(controlId) {
  if (!CONTROL.test(controlId)) throw new SafeError('CONTROLE_NOVO_INVALIDO');
  return "UPDATE document_drive_homologation_controls SET enabled=0 WHERE control_id='" + controlId + "';";
}

export function closedControlSql(controlId) {
  if (!CONTROL.test(controlId)) throw new SafeError('CONTROLE_NOVO_INVALIDO');
  return "SELECT enabled,expires_at,json_array_length(allowed_file_ids_json) AS file_count" +
    " FROM document_drive_homologation_controls WHERE control_id='" + controlId + "';";
}

function firstRow(value) {
  if (Array.isArray(value)) {
    for (const block of value) if (Array.isArray(block?.results) && block.results.length) return block.results[0];
  }
  if (Array.isArray(value?.results) && value.results.length) return value.results[0];
  return null;
}

export function validateClosedControl(value, ledger) {
  const r = firstRow(value);
  if (!r || Number(r.enabled) !== 0) throw new SafeError('REVOGACAO_D1_NAO_CONFIRMADA');
  if (Number(r.expires_at) !== Number(ledger.expiresAt)) throw new SafeError('PRAZO_CONTROLE_DIVERGENTE');
  if (Number(r.file_count) !== 1) throw new SafeError('ESCOPO_CONTROLE_DIVERGENTE');
  return true;
}

export function currentPreviewBase(version, ledger) {
  const expectedId = ledger.writeGateEnabled ? ledger.writePreviewVersionId : ledger.previewVersionId;
  if (version?.id !== expectedId) throw new SafeError('PREVIEW_ATUAL_DIVERGENTE');
  const b = inspectBindings(version);
  if (b.vars.DOCUMENTS_HOMOLOGATION_CONTROL_ID !== ledger.controlId) throw new SafeError('CONTROLE_PREVIEW_DIVERGENTE');
  if (b.vars.DOCUMENTS_HOMOLOGATION_RELEASE !== FIXED.candidateRelease) throw new SafeError('RELEASE_PREVIEW_DIVERGENTE');
  if (b.vars.DOCUMENTS_HOMOLOGATION_ORIGIN !== FIXED.pages
    || b.vars.DOCUMENTS_HOMOLOGATION_WORKER_ORIGIN !== FIXED.origin
    || b.vars.ALLOWED_ORIGINS !== FIXED.pages) throw new SafeError('ORIGENS_PREVIEW_DIVERGENTES');
  const expectedGate = ledger.writeGateEnabled ? 'true' : 'false';
  if (b.vars.DOCUMENTS_DRIVE_WRITE_ENABLED !== expectedGate) throw new SafeError('GATE_PREVIEW_DIVERGENTE');
  const runtime = version.resources?.script_runtime;
  if (runtime?.compatibility_date !== '2026-08-25') throw new SafeError('RUNTIME_DIVERGENTE');
  const flags = runtime.compatibility_flags ?? [];
  if (!Array.isArray(flags)) throw new SafeError('FLAGS_RUNTIME_INVALIDAS');
  return { ...b, compatibilityDate: runtime.compatibility_date, compatibilityFlags: flags };
}

async function httpBlocked() {
  const response = await fetch(FIXED.origin + '/api/documents/access', {
    method: 'GET', redirect: 'manual', cache: 'no-store', credentials: 'omit',
    headers: { Accept: 'application/json', Origin: FIXED.pages },
    signal: AbortSignal.timeout(15000)
  });
  const release = String(response.headers.get('X-Central-Docs-Preview-Release') || '').toLowerCase();
  if (response.status !== 403) throw new SafeError('BLOQUEIO_FINAL_NAO_CONFIRMADO');
  if (release !== FIXED.candidateRelease) throw new SafeError('RELEASE_FINAL_DIVERGENTE');
  return true;
}

export async function closeWindow() {
  if (process.platform !== 'win32' || !process.env.LOCALAPPDATA) throw new SafeError('USAR_WINDOWS_DO_OPERADOR');
  const baseDir = path.join(process.env.LOCALAPPDATA, 'CentralDocumentos4D');
  const { file: ledgerPath, value: ledger } = readCloseLedger(baseDir);
  const lockPath = path.join(baseDir, 'encerrar-v4.lock');
  if (fs.existsSync(lockPath)) throw new SafeError('OUTRA_EXECUCAO_V4_ATIVA');

  let lock;
  try { lock = fs.openSync(lockPath, 'wx', 0o600); }
  catch { throw new SafeError('OUTRA_EXECUCAO_V4_ATIVA'); }

  const work = path.join(baseDir, 'v4-close-' + randomUUID());
  fs.mkdirSync(work, { recursive: true });
  let gateFalseConfirmed = ledger.writeGateEnabled === false;

  try {
    console.log('1/5 Identificando preview e D1 da janela...');
    const minimal = path.join(work, 'wrangler.readonly.json');
    writeJson(minimal, { name: FIXED.worker, account_id: FIXED.account, send_metrics: false });
    const queryMinimal = args => parseJson(runWrangler([...args,'--json','--config',minimal], work));
    const expectedVersionId = ledger.writeGateEnabled ? ledger.writePreviewVersionId : ledger.previewVersionId;
    const currentVersion = queryMinimal(['versions','view',expectedVersionId]);
    const base = currentPreviewBase(currentVersion, ledger);

    const d1Config = path.join(work, 'wrangler.d1.json');
    writeJson(d1Config, {
      name: FIXED.worker, account_id: FIXED.account, send_metrics: false,
      d1_databases: [{ binding:'AUTH_DB', database_name:'portal-regulacao-users', database_id:base.db }]
    });
    const queryD1 = args => parseJson(runWrangler([...args,'--json','--config',d1Config], work));

    console.log('2/5 Revogando controle D1 primeiro...');
    queryD1(['d1','execute','AUTH_DB','--remote','--command',disableControlSql(ledger.controlId)]);
    validateClosedControl(queryD1(['d1','execute','AUTH_DB','--remote','--command',closedControlSql(ledger.controlId)]), ledger);

    let closedPreviewVersionId = expectedVersionId;
    if (ledger.writeGateEnabled === true) {
      console.log('3/5 Preparando alias com gate false...');
      const entry = await downloadRuntime(work);
      const config = buildConfig(base, entry, ledger.controlId);
      config.vars.DOCUMENTS_DRIVE_WRITE_ENABLED = 'false';
      const configPath = path.join(work, 'wrangler.closed.json');
      writeJson(configPath, config);
      const flags = ['--preview-alias', FIXED.alias, '--tag', TAG, '--message', MESSAGE];
      const dry = path.join(work, 'closed-dry.multipart');
      runWrangler(['versions','upload',...flags,'--dry-run','--outfile',dry,'--config',configPath], work);
      await inspectMultipart(fs.readFileSync(dry), config);

      console.log('4/5 Enviando somente versão preview bloqueada...');
      const sent = path.join(work, 'closed-enviado.multipart');
      const output = runWrangler(['versions','upload',...flags,'--outfile',sent,'--config',configPath], work);
      closedPreviewVersionId = uploadedId(output);
      verifyUploadedAlias(output);
      verifyVersion(queryMinimal(['versions','view',closedPreviewVersionId]), config, closedPreviewVersionId);
      gateFalseConfirmed = true;
    } else {
      console.log('3/5 Gate já estava false; nenhuma nova versão é necessária.');
      console.log('4/5 Mantendo preview bloqueado existente.');
    }

    console.log('5/5 Confirmando bloqueio HTTP final...');
    await httpBlocked();

    writeJson(ledgerPath, {
      ...ledger,
      controlEnabled: false,
      writeGateEnabled: gateFalseConfirmed ? false : ledger.writeGateEnabled,
      closedPreviewVersionId,
      closedAt: new Date().toISOString()
    });

    console.log('');
    console.log('JANELA_4D_ENCERRADA');
    console.log('controlId=' + ledger.controlId);
    console.log('controlEnabled=false');
    console.log('writeGate=' + (gateFalseConfirmed ? 'false' : 'nao_confirmado'));
    console.log('previewVersion=' + closedPreviewVersionId);
    console.log('release=' + FIXED.candidateRelease);
    console.log('httpBlocked=true');
  } catch (error) {
    console.log('');
    console.log('ENCERRAMENTO_INCOMPLETO=' + (error instanceof SafeError ? error.message : 'ERRO_NAO_CLASSIFICADO'));
    console.log('NAO_REABILITAR_CONTROLE_SEM_DIAGNOSTICO');
  } finally {
    try { fs.rmSync(work, { recursive: true, force: true }); } catch {}
    try { if (lock) fs.closeSync(lock); } catch {}
    try { fs.unlinkSync(lockPath); } catch {}
  }
}

export async function main() {
  if (process.argv.length !== 3 || process.argv[2] !== '--encerrar') throw new SafeError('USAR_ENCERRAR');
  if (Number(process.versions.node.split('.')[0]) < 22) throw new SafeError('NODE_22_OU_SUPERIOR_NECESSARIO');
  await closeWindow();
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch(error => {
    console.log('');
    console.log('ENCERRAMENTO_INCOMPLETO=' + (error instanceof SafeError ? error.message : 'ERRO_NAO_CLASSIFICADO'));
    process.exitCode = 1;
  });
}
