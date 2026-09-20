/**
 * Recupera com segurança um preparo 5E interrompido depois de upload de preview.
 *
 * O script:
 * - nunca ativa controle;
 * - nunca faz upload/deploy/promoção;
 * - desabilita idempotentemente o controle marcado;
 * - confirma estado D1 desligado;
 * - localiza a versão preview correspondente entre versões recentes;
 * - confirma gates/release/controle e que a versão não é produção;
 * - somente então remove o marcador local que bloqueia repetição.
 */
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';

import {
  FIXED_5E,
  Safe5eError,
  activeVersionFromDeployment,
  disableControlSql,
  inspectProductionVersion,
  parseJson,
  runWrangler,
  stateControlSql,
  validateControl,
  writeJson
} from './preparar-homologacao-5e.mjs';

const SHA40 = /^[a-f0-9]{40}$/i;
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
const CONTROL = /^phase5e_[a-f0-9]{32}$/i;

function must(value, code) {
  if (!value) throw new Safe5eError(code);
}

function markerValue(value) {
  must(value && typeof value === 'object' && !Array.isArray(value), 'MARCADOR_5E_INVALIDO');
  const sourceRef = String(value.sourceRef || '').trim().toLowerCase();
  const controlId = String(value.controlId || '').trim();
  const expiresAt = Number(value.expiresAt);
  const attemptedAt = String(value.attemptedAt || '').trim();
  must(SHA40.test(sourceRef), 'MARCADOR_5E_SOURCE_INVALIDO');
  must(CONTROL.test(controlId), 'MARCADOR_5E_CONTROLE_INVALIDO');
  must(Number.isSafeInteger(expiresAt) && expiresAt > 0, 'MARCADOR_5E_PRAZO_INVALIDO');
  must(Number.isFinite(Date.parse(attemptedAt)), 'MARCADOR_5E_DATA_INVALIDA');
  return { sourceRef, controlId, expiresAt, attemptedAt };
}

function bindingMap(version) {
  const entries = Array.isArray(version?.resources?.bindings)
    ? version.resources.bindings
    : Array.isArray(version?.bindings)
      ? version.bindings
      : [];
  return new Map(entries.map((item) => [String(item?.name || ''), item]));
}

function plain(map, name) {
  const item = map.get(name);
  return item?.type === 'plain_text' ? String(item.text ?? '') : '';
}

function exactPagesOrigin(value) {
  try {
    const url = new URL(String(value || ''));
    return url.protocol === 'https:'
      && url.hostname.endsWith('.pages.dev')
      && !url.username
      && !url.password
      && !url.port
      && url.pathname === '/'
      && !url.search
      && !url.hash
      ? url.origin
      : '';
  } catch (_) {
    return '';
  }
}

function recentCandidate(item, attemptedAt) {
  if (!UUID.test(String(item?.id || ''))) return false;
  if (item?.annotations?.['workers/alias'] !== FIXED_5E.alias) return false;
  if (item?.annotations?.['workers/tag'] !== FIXED_5E.tag) return false;
  if (item?.annotations?.['workers/message'] !== FIXED_5E.message) return false;
  const created = Date.parse(item?.metadata?.created_on || '');
  const attempted = Date.parse(attemptedAt);
  return Number.isFinite(created)
    && created >= attempted - (5 * 60 * 1000)
    && created <= Date.now() + (5 * 60 * 1000);
}

function matchesMarker(version, marker, dbId, productionVersion) {
  if (!version || !UUID.test(String(version.id || ''))) return false;
  if (String(version.id) === String(productionVersion)) return false;
  if (version.annotations?.['workers/alias'] !== FIXED_5E.alias) return false;
  if (version.annotations?.['workers/tag'] !== FIXED_5E.tag) return false;
  if (version.annotations?.['workers/message'] !== FIXED_5E.message) return false;

  const map = bindingMap(version);
  if (plain(map, 'DOCUMENTS_AI_HOMOLOGATION_RELEASE').toLowerCase() !== marker.sourceRef) return false;
  if (plain(map, 'DOCUMENTS_AI_HOMOLOGATION_CONTROL_ID') !== marker.controlId) return false;
  if (!exactPagesOrigin(plain(map, 'DOCUMENTS_AI_HOMOLOGATION_ORIGIN'))) return false;
  if (plain(map, 'DOCUMENTS_AI_ENABLED').toLowerCase() !== 'true') return false;
  if (plain(map, 'DOCUMENTS_AI_PROCESSING_ENABLED').toLowerCase() !== 'true') return false;
  if (plain(map, 'DOCUMENTS_AI_FREE_ONLY').toLowerCase() !== 'true') return false;
  if (plain(map, 'DOCUMENTS_DRIVE_WRITE_ENABLED').toLowerCase() !== 'false') return false;
  const db = map.get('AUTH_DB');
  if (db?.type !== 'd1' || String(db.id || '') !== String(dbId)) return false;
  const ai = map.get('AI');
  if (ai?.type !== 'ai') return false;
  return true;
}

export async function recoverInterrupted5e() {
  must(process.platform === 'win32' && process.env.LOCALAPPDATA, 'USAR_WINDOWS_DO_OPERADOR_5E');

  const baseDir = path.join(process.env.LOCALAPPDATA, 'CentralDocumentos5E');
  const markerPath = path.join(baseDir, 'upload-5e-incerto.json');
  must(fs.existsSync(markerPath), 'MARCADOR_5E_INCERTO_AUSENTE');

  const marker = markerValue(JSON.parse(fs.readFileSync(markerPath, 'utf8')));
  const work = path.join(baseDir, 'recover-' + randomUUID());
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

    const deployments = queryMinimal(['deployments', 'status']);
    const productionVersion = activeVersionFromDeployment(deployments);
    const production = queryMinimal(['versions', 'view', productionVersion]);
    const base = inspectProductionVersion(production);

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
      '--command', sql, '--json', '--config', d1Path
    ], work));

    // Idempotente e fail-closed: jamais habilita o controle.
    queryD1(disableControlSql(marker.controlId));
    validateControl(
      queryD1(stateControlSql(marker.controlId)),
      marker.expiresAt,
      0
    );

    const versions = queryMinimal(['versions', 'list']);
    must(Array.isArray(versions), 'LISTA_VERSOES_5E_INVALIDA');
    const candidateIds = versions
      .filter((item) => recentCandidate(item, marker.attemptedAt))
      .map((item) => String(item.id));

    const matches = [];
    for (const id of candidateIds) {
      const version = queryMinimal(['versions', 'view', id]);
      if (matchesMarker(version, marker, base.dbId, productionVersion)) {
        matches.push(version);
      }
    }
    must(matches.length === 1, matches.length ? 'PREVIEW_5E_INCERTO_AMBIGUO' : 'PREVIEW_5E_INCERTO_NAO_LOCALIZADO');

    const preview = matches[0];
    fs.rmSync(markerPath, { force: true });
    must(!fs.existsSync(markerPath), 'MARCADOR_5E_INCERTO_NAO_REMOVIDO');

    console.log('');
    console.log('PREPARO_5E_RECUPERADO');
    console.log('controlEnabled=false');
    console.log('driveWriteGate=false');
    console.log('previewVersion=' + preview.id);
    console.log('release=' + marker.sourceRef);
    console.log('productionVersion=' + productionVersion);
    console.log('markerCleared=true');
    console.log('proxima_acao=ATUALIZAR_SCRIPTS_E_EXECUTAR_READINESS_5E');
    return {
      previewVersion: preview.id,
      release: marker.sourceRef,
      productionVersion
    };
  } finally {
    fs.rmSync(work, { recursive: true, force: true });
  }
}

export async function main() {
  try {
    must(
      process.argv.length === 3 && process.argv[2] === '--recuperar',
      'USAR_FLAG_RECUPERAR_5E'
    );
    await recoverInterrupted5e();
  } catch (error) {
    console.log('');
    console.log(
      'RECUPERACAO_5E_BLOQUEADA='
      + (error instanceof Safe5eError ? error.message : 'ERRO_RECUPERACAO_5E_NAO_CLASSIFICADO')
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
