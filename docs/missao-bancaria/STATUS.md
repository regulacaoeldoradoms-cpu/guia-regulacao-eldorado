# MISSÃO BANCÁRIA — STATUS

Atualizado em 26/09/2026 — revisão pedagógica e conferência pontual na PR #501.

## Estado e autorização atual

**Fase ativa: Fase 1. Ensino por leitura antes da prática é a prioridade.**

Wellyton autorizou o avanço, revisões, testes e integrações necessárias sem aguardar seu acesso imediato ao portal. Registro: `28-REVISAO-SEGMENTOS-E-AUTORIZACAO.md`. Avaliação humana de compreensão continua pendente; não alegar que já ocorreu.

Todo conteúdo segue `24-CONTRATO-PEDAGOGICO-GLOBAL.md` e `26-PRODUCAO-PEDAGOGICA-EM-ETAPAS.md`. Dividir a produção quando necessário, sem reduzir ou omitir ensino.

## Base incorporada antes da PR #501

- #488: documentação-base; Fase 0 aprovada em 25/09/2026; plano `15-FASE-0-PLANO-TECNICO.md`.
- #490 motor inicial: `22257bca768cfc440578e0b8e11da62f15abc08f`.
- #495 expansão/revisões: `97cc6ab382d624841da46d6d9a9ff7f26a1a18ca`.
- #498 bloco de nove missões/Chefe: `20487883c948dffbeb4b6849baa3c39e9c577d9f`.
- #499 retomada/Conquistas: `c5ebf3a0bb93bf303851835446ec32ff5decb0cd`.
- #500 sequência: `ac9128c7e807be8eff0ee5bc1579f792aa249a3d`.

9/9 refere-se somente ao primeiro bloco de SFN, não a curso ou edital completo.

## Regras preservadas

Acesso exclusivo de `wellyton` no backend; `/estudos/` e `/api/studies/*`; nenhum novo cargo; conteúdo no GitHub e progresso em tabelas `study_*` no D1 `AUTH_DB`. IDs, perguntas, respostas, XP e conquistas preservados. Bronze/Prata/Ouro separados do estudo. Nenhuma telemetria pedagógica externa. Rollback sem apagar dados.

## PR #501 — conteúdo de ensino

Branch: `fix/missao-bancaria-ensino-do-zero`.
Main observada: `5e82869b8ae52e26392bf5ff139caa7674f23f90`.

Oito aulas com conceitos, vocabulário, exemplos resolvidos e consulta; preparação cumulativa do Chefe; 38 questões mapeadas ao ensino correspondente.

- Documento 27: lote A, 13 trechos revisados em Introdução, CMN, Banco Central e Copom.
- Documento 28: 25 trechos revisados em CVM, Operadores, Seguros/Previdência, Pagamentos/Consórcios e Chefe; novas fontes legais primárias e testes de aplicação real ao catálogo.
- Documento 29: conferência pontual das carteiras por cotejo de texto normativo reproduzido, explicação institucional e alterações indexadas no BCB. Não alegar acesso direto integral à página do BCB, que continua dependendo de JavaScript.

Todas as nove missões possuem passagem editorial identificada. Nenhuma avaliação humana foi inventada; nenhum novo mundo, pergunta ou recompensa foi criado nesta rodada.

## Precisão e decisão de publicação

Leis 6.385, 6.404, 12.865 e 11.795, LC 109 e páginas SUSEP/PREVIC foram abertas para os trechos utilizados; a LC 179 foi consultada no lote A.

A pendência anterior sobre carteiras foi delimitada e conferida por cotejo, conforme documento 29. O texto do art. 4º foi lido em reprodução jurídica externa e comparado à explicação institucional; as alterações indexadas pelo BCB nos arts. 6º e 7º foram confrontadas com a reprodução. O repositório externo não foi rotulado como fonte oficial. Não houve alteração de gabarito nem introdução de regras de capital ou de autorização completa.

Com a conferência dos pontos cobrados concluída, a PR está apta à etapa de CI/integração, sem depender de novo aceite por parágrafo. Isso não afirma que já houve merge ou publicação: registrar os resultados reais após cada operação.

## Testes confirmados

Head de código `0de24d0526d0773069c5614555b170220d2cf9bb`:
- `Validar Missao Bancaria`, run `36253087141`, job `108434668235`: completed/success.
- Nesse job passaram Worker/testes, validação de frontend, isolamento e documentação/fontes.

Os registros 29 e este STATUS são ajustes documentais posteriores. Consultar CI do head final antes de incorporar; não presumir resultado das execuções ainda não lidas.

## Histórico e limites técnicos

Incidente inicial: frontend publicado antes do Worker, erro “Rota não encontrada”. Correções #492/#494, commit `90cc6d8e16039bb7ed1482bec3f75feadb860816`. #493 sem merge; #491/#496/#497 substituídas.

No merge #500 houve 24 execuções de CI bem-sucedidas; checks históricos `108407207253`, `108407233680`, `108407276388`; versão informada `b110fd9f-3cdf-4047-93a5-a147e9dcde47`. Não são evidência da publicação desta PR.

Continuam pendentes: recorde histórico além de 500 eventos; cronômetro/interrupções; isolamento e retomada de rodadas; persistência real. Não foram resolvidos por revisão editorial.

## Avaliação posterior

Não solicitar acesso imediato. Quando Wellyton estudar: avaliar clareza, aplicação do que leu, progresso após sair/voltar, conquistas sem duplicação, revisões e Chefe. Não declarar esses resultados em sua ausência. A autorização de continuidade permite avançar nas entregas planejadas; não autoriza omitir pendências ou afirmar aprovação pedagógica inexistente.
