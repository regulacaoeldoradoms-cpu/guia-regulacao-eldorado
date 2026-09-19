/**
 * Diagnóstico somente leitura da capability documental exigida pela Fase 5E.
 *
 * Não imprime username, não altera D1, não faz upload/deploy e não lê valor de secret.
 */
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
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

function must(value, code) {
  if (!value) throw new Safe5eError(code);
}

function firstRow(value) {
  if (Array.isArray(value)) {
    for (const block of value) {
      if (Array.isArray(block?.results) && block.results.length) return block.results[0];
    }
  }
  if (Array.isArray(value?.results) && value.results.length) return value.results[0];
  return null;
}

export function capabilityDiagnosticSql() {
  return "SELECT " +
    "EXISTS(SELECT 1 FROM auth_users u WHERE u.username=c.allowed_username) AS user_exists," +
    "EXISTS(SELECT 1 FROM auth_users u WHERE u.username=c.allowed_username AND u.active=1) AS user_active," +
    "EXISTS(SELECT 1 FROM auth_document_access a WHERE a.username=c.allowed_username) AS access_row," +
    "COALESCE((SELECT a.can_view FROM auth_document_access a WHERE a.username=c.allowed_username),0) AS can_view," +
    "COALESCE((SELECT a.can_extract FROM auth_document_access a WHERE a.username=c.allowed_username),0) AS can_extract," +
    "EXISTS(SELECT 1 FROM auth_user_additional_roles r WHERE r.username=c.allowed_username AND r.role_id='documentos') AS regulator_role," +
    "(SELECT count(*) FROM document_drive_homologation_controls " +
    " WHERE enabled=1 AND expires_at>CAST(strftime('%s','now') AS INTEGER)) AS active_controls " +
    "FROM document_drive_homologation_controls c " +
    "WHERE c.control_id='" + FIXED_5E.templateControl + "';";
}

export function safeCapabilityState(value) {
  const row = firstRow(value);
  must(row, 'CONTROLE_TEMPLATE_5E_NAO_ENCONTRADO');
  return Object.freeze({
    userExists: Number(row.user_exists) === 1,
    userActive: Number(row.user_active) === 1,
    accessRow: Number(row.access_row) === 1,
    canView: Number(row.can_view) === 1,
    canExtract: Number(row.can_extract) === 1,
    regulatorRole: Number(row.regulator_role) === 1,
    activeControlledWindow: Number(row.active_controls) > 0
  });
}

export async function diagnose5eCapability() {
  must(process.platform === 'win32' && process.env.LOCALAPPDATA, 'USAR_WINDOWS_DO_OPERADOR_5E');

  const baseDir = path.join(process.env.LOCALAPPDATA, 'CentralDocumentos5E');
  fs.mkdirSync(baseDir, { recursive: true });
  const work = path.join(baseDir, 'capability-diagnostic-' + randomUUID());
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

    const diagnostic = parseJson(runWrangler([
      'd1', 'execute', 'AUTH_DB', '--remote',
      '--command', capabilityDiagnosticSql(),
      '--json', '--config', d1Path
    ], work));
    const state = safeCapabilityState(diagnostic);

    console.log('');
    console.log('DIAGNOSTICO_CAPABILITY_5E');
    console.log('userExists=' + state.userExists);
    console.log('userActive=' + state.userActive);
    console.log('accessRow=' + state.accessRow);
    console.log('regulatorRole=' + state.regulatorRole);
    console.log('canView=' + state.canView);
    console.log('canExtract=' + state.canExtract);
    console.log('activeControlledWindow=' + state.activeControlledWindow);
    return state;
  } finally {
    fs.rmSync(work, { recursive: true, force: true });
  }
}

export async function main() {
  try {
    must(process.argv.length === 3 && process.argv[2] === '--diagnosticar', 'USAR_FLAG_DIAGNOSTICAR_5E');
    await diagnose5eCapability();
  } catch (error) {
    console.log('');
    console.log(
      'DIAGNOSTICO_CAPABILITY_5E_FALHOU='
      + (error instanceof Safe5eError ? error.message : 'ERRO_DIAGNOSTICO_5E_NAO_CLASSIFICADO')
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
