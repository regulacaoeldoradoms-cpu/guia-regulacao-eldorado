# MISSÃO BANCÁRIA — STATUS

Atualizado em 26/09/2026 — revisão dos segmentos na PR #501.

## Estado e autorização atual

**Fase ativa: Fase 1. Ensino por leitura é a prioridade.**

Wellyton autorizou o avanço, revisões, testes e integrações necessárias sem aguardar seu acesso imediato ao portal. A autorização é registrada em `28-REVISAO-SEGMENTOS-E-AUTORIZACAO.md`. **Avaliação humana de compreensão continua pendente; não alegar que já ocorreu.**

Todo conteúdo segue `24-CONTRATO-PEDAGOGICO-GLOBAL.md` e `26-PRODUCAO-PEDAGOGICA-EM-ETAPAS.md`. Dividir a produção quando necessário, sem publicar apenas perguntas ou reduzir o ensino para caber em uma rodada.

## Base já incorporada antes da PR #501

- PR #488: documentação-base; Fase 0 aprovada por Wellyton em 25/09/2026.
- Plano arquitetural: `15-FASE-0-PLANO-TECNICO.md`.
- #490 motor inicial: `22257bca768cfc440578e0b8e11da62f15abc08f`.
- #495 expansão/revisões: `97cc6ab382d624841da46d6d9a9ff7f26a1a18ca`.
- #498 bloco de nove missões e Chefe: `20487883c948dffbeb4b6849baa3c39e9c577d9f`.
- #499 retomada parcial/Conquistas: `c5ebf3a0bb93bf303851835446ec32ff5decb0cd`.
- #500 sequência: `ac9128c7e807be8eff0ee5bc1579f792aa249a3d`.

9/9 significa somente o primeiro bloco de SFN. Não é o curso ou o edital completo.

## Regras preservadas

Acesso exclusivo de `wellyton` no backend; `/estudos/` e `/api/studies/*`; nenhum novo cargo; conteúdo no GitHub; progresso em tabelas `study_*` no D1 `AUTH_DB`. IDs, perguntas, respostas, XP e conquistas preservados. Bronze/Prata/Ouro continuam separados do estudo. Nenhuma telemetria pedagógica externa. Rollback sem apagar dados.

## PR #501 — ensino antes da prática

Branch: `fix/missao-bancaria-ensino-do-zero`.
Base desta rodada: `ddd15a2a5dc9834b525b87068c17dd9f830677da`; main observada: `5e82869b8ae52e26392bf5ff139caa7674f23f90`.

Já redigidos: oito aulas com conceitos, vocabulário, exemplos resolvidos e consulta; uma preparação cumulativa do Chefe; 38 questões mapeadas ao ensino correspondente.

### Revisão dos fundamentos — lote A

Documento `27-REVISAO-FUNDAMENTOS-LOTE-A.md`.
13 trechos revisados em Introdução, CMN, Banco Central e Copom. Preserva-se o resultado dessa revisão.

### Revisão dos segmentos — rodada atual

Documento `28-REVISAO-SEGMENTOS-E-AUTORIZACAO.md`.
25 trechos revisados em CVM, Operadores, Seguros/Previdência, Pagamentos/Consórcios e preparação do Chefe. Novas fontes legais primárias e testes de integração editorial. Nenhuma nova questão ou recompensa; nenhum dado real alterado.

Todas as nove missões possuem passagem editorial identificada, mas a homologação permanece pendente. Essa marca não é certificado automático de precisão normativa ou aprendizagem.

## Precisão e publicação

Leis 6.385, 6.404, 12.865 e 11.795, LC 109 e páginas institucionais SUSEP/PREVIC foram abertas para os trechos utilizados. No lote A foi consultada a LC 179.

**Pendência delimitada:** a regra de carteiras foi localizada na explicação institucional histórica do BCB, mas não foi obtido o texto primário consolidado da Resolução CMN 5.060. Não tratar a página histórica, minuta ou índice de publicação como consolidação vigente. A referência original foi mantida sem carimbo novo de conferência integral.

Próximo passo técnico: concluir essa conferência ou separar formalmente o recorte ainda pendente antes de promover publicação definitiva; consultar CI do novo head e verificar separadamente o resultado de build/produção. Não presumir resultado de CI no momento de escrever este status.

## Histórico de publicação e limites técnicos

Incidente inicial: frontend publicado antes do Worker, erro “Rota não encontrada”. Correções #492/#494; commit `90cc6d8e16039bb7ed1482bec3f75feadb860816`. #493 fechada sem merge; #491/#496/#497 substituídas.

No merge #500 houve 24 execuções de CI bem-sucedidas; checks históricos Pages/Worker `108407207253`, `108407233680`, `108407276388`; versão informada `b110fd9f-3cdf-4047-93a5-a147e9dcde47`. Isso não comprova publicação desta PR. Tentativa anterior de HTTP falhou em DNS local, sem demonstrar indisponibilidade do portal.

Continuam pendentes: recorde histórico da sequência além de 500 eventos; cronômetro/interrupções; isolamento e retomada de rodadas; comprovação real de persistência. Não foram resolvidos por revisão editorial.

## Avaliação humana posterior

Quando o usuário voltar a estudar: clareza, aplicação do que leu, progresso após sair/voltar, conquistas sem duplicação, revisões e desafio. Não solicitar acesso imediato nem alegar esses resultados em sua ausência. O desenvolvimento autorizado prossegue dentro do escopo, preservando as pendências com transparência.
