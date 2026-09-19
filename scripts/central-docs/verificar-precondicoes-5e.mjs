/**
 * Verificação somente leitura das pré-condições operacionais da Fase 5E.
 *
 * Não cria controle, não altera D1, não faz upload de versão e não promove produção.
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
  templateControlSql,
  validateTemplateControl,
  writeJson
} from './preparar-homologacao-5e.mjs';

export const FROZEN_5E_SOURCE_REF = '408bff833f9437b0c8c2f8ec1bf2ffb8926609b0';
export const FROZEN_5E_PAGES_ORIGIN = 'https://915c3113.portal-regulacao-central-staging.pages.dev';

function must(value, code) {
  if (!value) throw new Safe5eError(code);
}

export async function check5eReadiness() {
  must(process.platform === 'win32' && process.env.LOCALAPPDATA, 'USAR_WINDOWS_DO_OPERADOR_5E');

  const baseDir = path.join(process.env.LOCALAPPDATA, 'CentralDocumentos5E');
  fs.mkdirSync(baseDir, { recursive: true });
  const work = path.join(baseDir, 'readiness-' + randomUUID());
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

    const template = parseJson(runWrangler([
      'd1', 'execute', 'AUTH_DB', '--remote',
      '--command', templateControlSql(),
      '--json', '--config', d1Path
    ], work));
    validateTemplateControl(template);

    console.log('');
    console.log('PRECONDICOES_5E_OK');
    console.log('productionVersion=' + productionVersion);
    console.log('geminiSecretPresent=true');
    console.log('extractCapability=true');
    console.log('activeControlledWindow=false');
    console.log('sourceRef=' + FROZEN_5E_SOURCE_REF);
    console.log('pagesOrigin=' + FROZEN_5E_PAGES_ORIGIN);
    console.log('proxima_acao=PREPARAR_HOMOLOGACAO_5E');
    return {
      productionVersion,
      sourceRef: FROZEN_5E_SOURCE_REF,
      pagesOrigin: FROZEN_5E_PAGES_ORIGIN
    };
  } finally {
    fs.rmSync(work, { recursive: true, force: true });
  }
}

export async function main() {
  try {
    must(process.argv.length === 3 && process.argv[2] === '--verificar', 'USAR_FLAG_VERIFICAR_5E');
    await check5eReadiness();
  } catch (error) {
    console.log('');
    console.log(
      'PRECONDICOES_5E_BLOQUEADAS='
      + (error instanceof Safe5eError ? error.message : 'ERRO_VERIFICACAO_5E_NAO_CLASSIFICADO')
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
