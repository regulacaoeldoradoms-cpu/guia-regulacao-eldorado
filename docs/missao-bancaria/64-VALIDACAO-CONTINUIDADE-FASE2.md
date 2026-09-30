# Continuidade da Fase 2 — registro de validação

Data: 30/09/2026. Ambiente: PC-REGULACAO-3, checkout isolado, Windows, Node 24.17.0.

## Escopo

Conciliação da cadeia C3/C4 e fechamento candidato; correção conservadora do rótulo de ciclos; retenção sem nota; cobertura de retomada no Chromium; rubrica de continuidade. Os quatro commits C3 de ausência de evidência estão preservados como ancestrais. Não houve merge na `main`, deploy manual, migração de dados ou uso de conta/dados reais nos testes.

Os PRs existentes permanecem draft: [#554](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/pull/554), [#555](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/pull/555) e [#556](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/pull/556). A correção de semântica e continuidade é preparada em PR draft separada sobre #556. Consultar o SHA final e seus checks nessa PR; resultados de ancestrais não certificam alterações posteriores.

## Testes locais

- `npm run check` em `worker`: aprovado.
- `npm test` em `worker`: 659 testes aprovados, zero falhas/ignorados; inclui autorização, isolamento, rodadas, publicação, avaliação, regressões globais e gate de deploy.
- Testes direcionados de estado/retenção/rotas: 13 aprovados; o wrapper executa 22 fluxos integrados em roteador real com SQLite em memória e identidade/catalogo sintéticos.
- Verificações estáticas equivalentes ao workflow Missão Bancária no Windows: 90 asserções de sintaxe, arquivos obrigatórios, contratos, fontes e isolamento aprovadas.
- `node node_modules/playwright/cli.js test --config=studies-reader.config.mjs` em `testing/browser`: 78 testes aprovados, incluindo retomada, redes/reenvios, respostas atrasadas, três ciclos com zero e ausência de nota. Playwright 1.55.0 e Chromium Headless Shell 140.0.7339.16 (build 1187), sem API real.

O instalador automático local não terminou a extração do navegador. O mesmo ZIP oficial baixado foi extraído localmente e os auxiliares oficiais `winldd-1007`/`ffmpeg-1011` foram preparados no workspace. A primeira tentativa sem esses auxiliares falhou antes de iniciar testes; não foi contada como execução aprovada. Nenhuma validação do Playwright foi desativada.

Depois deste registro, executar novamente os gates sobre o commit final e associar o SHA e os resultados no corpo da PR. O registro de preparação não dispensa essa conferência.

Na reconferência remota da cadeia já enviada: #555 em `6b940527` estava conciliável, com 23/24 Actions concluídos com sucesso e auditoria de modo escuro ainda em andamento; #556 em `9657ce8a` estava conciliável, com 20/20 Actions concluídos com sucesso. Estes são snapshots da consulta, não promessa sobre o resultado final de checks externos.

O cenário novo de atraso envelhece somente datas da fixture em memória. Confirma três ciclos disponíveis juntos, mesmas questões, três notas zero, agenda original preservada e recompensa única por ciclo mesmo com reenvio. Não implementa revisão adaptativa nem certifica retenção espaçada.

Os testes de navegador usam API simulada e bloqueiam requisições externas. Não substituem homologação com API real nem validação de produção. O roteiro humano permanece no documento 62; nenhum aceite foi criado por automação.

## Diagnóstico do check externo Worker

Consulta somente leitura dos checks existentes em 30/09. No mesmo SHA `ff6ecbe` de `main`, `check-runs?filter=all` revelou [sucesso às 09:56:13 UTC](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/runs/109834609250) e [outra execução falha às 09:56:49 UTC](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/runs/109834814799). O sucesso informa versão `b79fe776-c9f9-4bcc-9fa8-ef75cff25669` e alias de preview `main`; isso não identifica a versão atualmente servindo o tráfego produtivo.

Falhas também observadas em [#554 / 23587c5](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/runs/109839748934), [#555 / 5fe2d6c](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/runs/109838796884) e [#556 / 8feaed6](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/runs/109839500194). Pages passou nesses SHAs; o resultado de Pages não demonstra publicação do Worker.

**Investigação inicial, antes do log fornecido pelo usuário:** o GitHub expõe apenas IDs/links dos builds, sem texto de erro e sem anotações. A autenticação existente do Wrangler 4.135.0 foi confirmada pelo fluxo suportado da CLI. Consultas somente leitura à API oficial de logs dos builds `35ccc217-ee7d-4be4-90b4-e59a32f3f129`, `6f5ed47a-22f0-4cbe-8515-1c4cd972f8a5` e `d9a88c96-b08a-4e30-864e-dbdb0d92e440` retornaram **HTTP 403, código 12004, Forbidden**. Nenhuma permissão foi ampliada, nenhum segredo foi exposto e nenhuma publicação foi executada. Não inferir que a causa é o problema histórico de previews nem tratar o check como incidente produtivo confirmado.

Pedido inicial de handoff: pela sessão já autorizada do dashboard, obter o comando executado e a primeira mensagem de erro do [build falho de #556](https://dash.cloudflare.com/?to=/467be828c364ccf084240c34bb609b42/workers/services/view/yellow-wave-d0a1guia-regulacao-ia/production/builds/d9a88c96-b08a-4e30-864e-dbdb0d92e440), sem credenciais ou valores de secrets. O usuário forneceu esse log; a atualização do diagnóstico está abaixo. O 403 não foi contornado. Preservar integralmente [WORKER-SAFE-DEPLOY.md](../WORKER-SAFE-DEPLOY.md).

## Falha global da Central: sincronização do teste

O [run 36731623543](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/actions/runs/36731623543), no SHA `81f89b9e`, falhou no cenário de desfazer/refazer da Central: o atalho de refazer esperava quatro páginas, mas havia três. O trace da tentativa original e da repetição mostra que o atalho foi enviado durante `data-operation-state=busy`, quando o editor deliberadamente ignora teclas. PDF.js já havia atualizado os elementos de página antes da conclusão assíncrona do rebuild.

O código e o teste da Central eram idênticos aos de `main` `ff6ecbe`. A mesma falha aparece como intermitente no [run anterior 36700074265](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/actions/runs/36700074265), em `5fe2d6c`, e foi reproduzida localmente na base. Portanto, a falha não é atribuída à mudança de semântica da Missão Bancária.

A correção fica exclusivamente em `testing/browser/central-docs-editor.spec.mjs`: aguardar estado pronto e botão habilitado antes dos atalhos. As asserções de quatro → três → quatro páginas e proteção dos campos editáveis permanecem. Um cenário adicional bloqueia deterministicamente a conclusão do rebuild local, confirma que refazer durante a operação é ignorado e que um novo atalho, após a liberação, restaura as quatro páginas com uma única revisão adicional. Não há alteração funcional da Central/Titon, aumento de timeout, retry, skip ou mudança de pipeline.

No SHA final `07a191e60901b7f6171f088eb9999c49392f68f7`, `npm run check` e 659 testes Worker, 78 testes Chromium da Missão Bancária, 90 asserções estáticas e a suíte Central completa (78 aprovados, quatro skips já existentes) passaram localmente. Antes do commit, os dois cenários de atalhos passaram em 20 repetições desktop/mobile. A revisão independente não encontrou bloqueadores.

No Windows, depois de todos os workers da suíte Central terminarem, foi necessário encerrar somente o servidor local daquela execução para destravar o cleanup; o runner concluiu com código zero. A [suíte Central na CI desse SHA](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/actions/runs/36734077773) também passou: 78 aprovados, quatro skips existentes, sem falhas ou retries, sem essa intervenção local. O [Chromium da Missão Bancária](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/actions/runs/36734077447) passou com 78 testes. Consultar os checks globais terminais no PR #557; o diagnóstico não transforma a execução anterior que falhou em aprovada.

## Limites e decisões

### Atualização após recebimento do log pelo usuário

Em 30/09, o usuário encaminhou o log do build `d9a88c96-b08a-4e30-864e-dbdb0d92e440`. Entre 10:10:33 e 10:10:36 UTC, o comando `npx wrangler versions upload`, com Wrangler 4.135.0, falhou na validação de correspondência entre o nome configurado `yellow-wave-d0a1guia-regulacao-ia` e o Worker de destino. A instalação das dependências havia terminado normalmente. O bloqueio inicial de acesso aos logs foi suprido por esse fornecimento; a configuração responsável ainda precisa ser confirmada.

A distribuição local exata do Wrangler foi inspecionada: `verifyWorkerMatchesCITag` em `wrangler-dist/cli.js` valida `WRANGLER_CI_MATCH_TAG` contra `default_environment.script.tag` do serviço. O mesmo texto aparece quando o Worker não é encontrado na conta consultada ou quando essa identidade difere da esperada pelo build. `WRANGLER_CI_OVERRIDE_NAME` também pode substituir o nome efetivo. Portanto, o texto **não justifica renomear produção** nem remover as proteções da CI. O identificador de serviço comparado não é a annotation de versão `portal-safe-deploy`. Essa verificação precede o upload da versão; dry-run não a executa.

Consulta somente leitura pela CLI autenticada confirmou que o Worker do TOML existe na conta autorizada. O deployment mais recente listado, `b27fe7c8-fee5-4e69-af64-33bb8aef7f02`, de 09:56:00 UTC, aponta a versão `b79fe776-c9f9-4bcc-9fa8-ef75cff25669` em 100%. Essa versão contém as annotations `portal-safe-deploy` e `Portal: candidato validado pelo gate de deploy seguro`, com alias `main`. Foram consultados somente metadados e nomes/tipos de bindings; valores secretos não foram expostos. Isso identifica o estado observado, não publica #554–557 nem substitui reconferência no momento de um deploy.

Próximo dado necessário no dashboard: vínculo do build com conta/Worker existentes; branch e SHA; classificação produtiva ou não produtiva; root directory; comandos de build, deploy e branches não produtivas; eventual override de nome e correspondência da identidade esperada pelo build. Comparar esses campos com o build de `main` que passou. Não solicitar valores de tokens ou secrets. Correção mínima candidata: ajustar o vínculo/configuração de build responsável, preservando o Worker, a conta e os bindings. Somente depois de identificar o campo divergente será possível propor uma alteração concreta.

Produção deve continuar com root `/worker`, branch `main` e `npm run deploy:safe`. O comando `versions upload` isolado não promove tráfego, mas também não executa o gate; não se deve inferir a classificação da branch somente por ele. A [documentação oficial de Builds](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/#build-settings) distingue os comandos de deploy e preview e informa que esses campos ficam em Settings → Build. Nenhuma mudança de pipeline, acesso, Worker ou bindings foi executada nesta investigação.

O usuário autorizou a integração e publicação de #554–557 em 30/09, condicionadas à conclusão das verificações e ao esclarecimento do build Worker, usando as proteções existentes. Essa autorização não dispensa os gates: integração em `main` e publicação de frontend/Worker permanecem pendentes enquanto as condições não forem atendidas. Homologação e aceite humano da Fase 2 continuam separados e pendentes. O documento 63 separa conteúdo, funcionalidade, validação e diagnóstico do aluno. Reagendamento pela conclusão real, política por nota, ampliação de formas independentes e adoção de edital são propostas que exigem decisão; não foram implementados implicitamente nesta correção.
