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

**Causa atual não comprovada:** o GitHub expõe apenas IDs/links dos builds, sem texto de erro e sem anotações. Não havia ferramenta Cloudflare autenticada disponível nesta execução. Não inferir que a causa é o problema histórico de previews nem tratar o check como incidente produtivo confirmado.

Próxima investigação autorizada: obter o primeiro erro e os comandos dos builds Cloudflare `35ccc217-ee7d-4be4-90b4-e59a32f3f129` (sucesso) e `6f5ed47a-22f0-4cbe-8515-1c4cd972f8a5` (falha), além dos builds vinculados aos PRs. Comparar branch, ambiente e comando antes de propor correção. Preservar integralmente [WORKER-SAFE-DEPLOY.md](../WORKER-SAFE-DEPLOY.md).

## Limites e decisões

Integração em `main`, publicação de frontend/Worker e homologação humana continuam pendentes. O documento 63 separa conteúdo, funcionalidade, validação e diagnóstico do aluno. Reagendamento pela conclusão real, política por nota, ampliação de formas independentes e adoção de edital são propostas que exigem decisão; não foram implementados implicitamente nesta correção.
