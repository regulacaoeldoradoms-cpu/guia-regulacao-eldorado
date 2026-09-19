/**
 * Atalho operacional da Fase 5E.
 *
 * Primeiro faz a verificação somente leitura. Somente se todas as pré-condições
 * estiverem verdes chama o preparo existente, que continua exigindo confirmação humana.
 */
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { Safe5eError, prepare5e } from './preparar-homologacao-5e.mjs';
import {
  FROZEN_5E_PAGES_ORIGIN,
  FROZEN_5E_SOURCE_REF,
  check5eReadiness
} from './verificar-precondicoes-5e.mjs';

function must(value, code) {
  if (!value) throw new Safe5eError(code);
}

export async function launch5e() {
  const readiness = await check5eReadiness();
  must(readiness.sourceRef === FROZEN_5E_SOURCE_REF, 'SOURCE_REF_5E_ATALHO_DIVERGENTE');
  must(readiness.pagesOrigin === FROZEN_5E_PAGES_ORIGIN, 'PAGES_ORIGIN_5E_ATALHO_DIVERGENTE');

  console.log('');
  console.log('PRECONDICOES_CONFIRMADAS_5E=true');
  console.log('O preparo real ainda exigirá a frase humana de confirmação.');
  return prepare5e({
    sourceRef: FROZEN_5E_SOURCE_REF,
    pagesOrigin: FROZEN_5E_PAGES_ORIGIN
  });
}

export async function main() {
  try {
    must(process.argv.length === 3 && process.argv[2] === '--iniciar', 'USAR_FLAG_INICIAR_5E');
    await launch5e();
  } catch (error) {
    console.log('');
    console.log(
      'OPERACAO_INTERROMPIDA='
      + (error instanceof Safe5eError ? error.message : 'ERRO_ATALHO_5E_NAO_CLASSIFICADO')
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
