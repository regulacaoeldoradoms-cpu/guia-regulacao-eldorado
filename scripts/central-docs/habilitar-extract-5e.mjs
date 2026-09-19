/**
 * Habilita exclusivamente a capability extract da conta já autorizada para a Fase 5E.
 *
 * Segurança:
 * - usa o usuário já referenciado pelo controle-template 4D; nunca imprime username;
 * - exige que a conta exista, esteja ativa, tenha Regulador(a), can_view=1 e can_extract=0;
 * - exige ausência de outra janela controlada ativa;
 * - altera somente can_extract de 0 para 1;
 * - exige confirmação humana explícita;
 * - não altera role, can_view, can_edit, can_manage, secrets, Worker, Drive ou produção.
 */
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { createInterface } from 'node:readline/promises';
import { pathToFileURL } from 'node:url';

import {
  FIXED_5E,
  Safe5eError,
  activeVersionFromDeployment,
  inspectProductionVersion,
  parseJson,
  runWrangler,
  writeJson
} from './preparar-homologacao-5e.mjs';
import {
  capabilityDiagnosticSql,
  safeCapabilityState
} from './diagnosticar-capability-5e.mjs';

function must(value, code) {
  if (!value) throw new Safe5eError(code);
}

function updateExtractSql() {
  return "UPDATE auth_document_access SET can_extract=1, updated_at=CURRENT_TIMESTAMP, updated_by='phase5e-operator' " +
    "WHERE username=(SELECT allowed_username FROM document_drive_homologation_controls " +
    "WHERE control_id='" + FIXED_5E.templateControl + "') " +
    "AND can_view=1 AND can_extract=0 " +
    "AND EXISTS(SELECT 1 FROM auth_users u WHERE u.username=auth_document_access.username AND u.active=1) " +
    "AND EXISTS(SELECT 1 FROM auth_user_additional_roles r WHERE r.username=auth_document_access.username AND r.role_id='documentos') " +
    "AND NOT EXISTS(SELECT 1 FROM document_drive_homologation_controls " +
    "WHERE enabled=1 AND expires_at>CAST(strftime('%s','now') AS INTEGER));";
}

async function confirmHuman() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = String(await rl.question('Digite exatamente HABILITAR EXTRACT 5E para continuar: ')).trim();
    must(answer === 'HABILITAR EXTRACT 5E', 'CONFIRMACAO_EXTRACT_5E_NAO_RECEBIDA');
  } finally {
    rl.close();
  }
}

export async function enableExtract5e() {
  must(process.platform === 'win32' && process.env.LOCALAPPDATA, 'USAR_WINDOWS_DO_OPERADOR_5E');

  const baseDir = path.join(process.env.LOCALAPPDATA, 'CentralDocumentos5E');
  fs.mkdirSync(baseDir, { recursive: true });
  const work = path.join(baseDir, 'enable-extract-' + randomUUID());
  fs.mkdirSync(work, { recursive: true });

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

    const productionVersion = activeVersionFromDeployment(queryMinimal(['deployments', 'status']));
    const base = inspectProductionVersion(queryMinimal(['versions', 'view', productionVersion]));

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
      'd1', 'execute', 'AUTH_DB', '--remote',
      '--command', sql,
      '--json', '--config', d1Path
    ], work));

    const before = safeCapabilityState(queryD1(capabilityDiagnosticSql()));
    must(before.userExists, 'CONTA_5E_NAO_EXISTE');
    must(before.userActive, 'CONTA_5E_INATIVA');
    must(before.accessRow, 'LINHA_ACESSO_DOCUMENTAL_5E_AUSENTE');
    must(before.regulatorRole, 'FUNCAO_REGULADOR_5E_AUSENTE');
    must(before.canView, 'CAPABILITY_VIEW_5E_AUSENTE');
    must(!before.canExtract, 'CAPABILITY_EXTRACT_5E_JA_ATIVA');
    must(!before.activeControlledWindow, 'OUTRA_JANELA_CONTROLADA_ATIVA');

    console.log('');
    console.log('PRECONDICOES_ALTERACAO_EXTRACT_5E_OK');
    console.log('userActive=true');
    console.log('regulatorRole=true');
    console.log('canView=true');
    console.log('canExtract=false');
    console.log('activeControlledWindow=false');

    await confirmHuman();

    queryD1(updateExtractSql());

    const after = safeCapabilityState(queryD1(capabilityDiagnosticSql()));
    must(after.userExists && after.userActive, 'CONTA_5E_DIVERGIU_APOS_UPDATE');
    must(after.accessRow && after.regulatorRole && after.canView, 'ACESSO_5E_DIVERGIU_APOS_UPDATE');
    must(after.canExtract, 'CAPABILITY_EXTRACT_5E_NAO_ATIVADA');
    must(!after.activeControlledWindow, 'JANELA_CONTROLADA_ATIVADA_DURANTE_UPDATE');

    console.log('');
    console.log('CAPABILITY_EXTRACT_5E_HABILITADA');
    console.log('userActive=true');
    console.log('regulatorRole=true');
    console.log('canView=true');
    console.log('canExtract=true');
    console.log('activeControlledWindow=false');
    return after;
  } finally {
    fs.rmSync(work, { recursive: true, force: true });
  }
}

export async function main() {
  try {
    must(process.argv.length === 3 && process.argv[2] === '--habilitar', 'USAR_FLAG_HABILITAR_EXTRACT_5E');
    await enableExtract5e();
  } catch (error) {
    console.log('');
    console.log(
      'OPERACAO_EXTRACT_5E_INTERROMPIDA='
      + (error instanceof Safe5eError ? error.message : 'ERRO_EXTRACT_5E_NAO_CLASSIFICADO')
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
