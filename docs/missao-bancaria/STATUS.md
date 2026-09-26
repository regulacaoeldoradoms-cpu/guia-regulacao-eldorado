# MISSÃO BANCÁRIA — STATUS

Atualizado em 26/09/2026 — revisão pedagógica em andamento na PR #501.

## Estado oficial

**Fase ativa: Fase 1. Sem aceite pedagógico final.**

A prioridade é material de ensino por leitura antes da avaliação. Todas as disciplinas e versões seguem `24-CONTRATO-PEDAGOGICO-GLOBAL.md` e `26-PRODUCAO-PEDAGOGICA-EM-ETAPAS.md`. Se o recorte ficar grande, dividir a produção; não reduzir o ensino.

## Base aprovada e já incorporada antes da PR #501

- PR #488: documentação-base.
- Fase 0 aprovada por Wellyton em 25/09/2026; plano `15-FASE-0-PLANO-TECNICO.md`.
- PR #490: primeiro motor; commit `22257bca768cfc440578e0b8e11da62f15abc08f`.
- PR #495: CVM/Operadores e revisões; commit `97cc6ab382d624841da46d6d9a9ff7f26a1a18ca`.
- PR #498: bloco inicial com nove missões/38 questões e Chefe; commit `20487883c948dffbeb4b6849baa3c39e9c577d9f`.
- PR #499: retomada parcial e correção de Conquistas; commit `c5ebf3a0bb93bf303851835446ec32ff5decb0cd`.
- PR #500: sequência de estudo; commit `ac9128c7e807be8eff0ee5bc1579f792aa249a3d`.

**9/9 é o primeiro bloco de SFN, não o edital, o curso ou toda a matéria Conhecimentos Bancários.** Testes técnicos e número de questões não certificam qualidade de ensino.

## Decisões preservadas

`/estudos/`, `/api/studies/*`, conta `wellyton` validada no backend, sem cargo novo. Conteúdo no GitHub, progresso no D1 `AUTH_DB` em tabelas `study_*`. IDs estáveis, sem zerar tentativas/XP/conquistas. Medalhas em `/conquistas/`, separadas dos níveis de segurança Bronze/Prata/Ouro. Nenhuma telemetria pedagógica externa. Rollback sem apagar dados.

## Bloqueio pedagógico relatado por Wellyton

A primeira aula foi aberta, mas o usuário não compreendia siglas e termos. Os textos eram insuficientes para quem começa do zero. A orientação seguinte tornou obrigatórios ensino, exemplos e consulta antes das questões em TODO conteúdo. Foi autorizado dividir a autoria em mais rodadas, sem aprovações burocráticas por parágrafo.

A captura da interface não equivale à homologação de aprendizado, persistência ou conquista. A Fase 1 permanece aberta.

## PR #501 — trabalho ainda não incorporado

Branch: `fix/missao-bancaria-ensino-do-zero`.
Base desta rodada: head `c76ebeb2a3f0aea0fa52902ea941365f8f60eda2`, sobre main `5e82869b8ae52e26392bf5ff139caa7674f23f90`.

Já redigidos na PR: oito aulas e preparação do Chefe, com vocabulário, explicações, exemplos resolvidos e rastreio das 38 questões. Documentos 23–26 registram a evolução e o contrato global. Isso não significa revisão final concluída nem publicação confirmada.

### Rodada atual: lote A de revisão dos fundamentos

Documento: `27-REVISAO-FUNDAMENTOS-LOTE-A.md`.

- Introdução: intermediação, risco de crédito, dinheiro reservado fora do banco e limites dos macetes de verbo.
- CMN: diretrizes gerais versus contrato e relação com um Banco Central autônomo.
- Banco Central: autarquia, autonomia, estabilidade de preços e condução da política monetária.
- Copom: vocabulário da Selic, taxa apurada/meta e diferença de juros contratuais.

**13 trechos revisados em quatro aulas já existentes.** Nenhuma questão ou recompensa nova. IDs, gabaritos, dados e pontuação preservados.

Fontes consultadas: Lei Complementar nº 179/2021 no Planalto, CMN no Ministério da Fazenda e estrutura do SFN no Portal do Investidor. Texto oficial indexado da Resolução BCB nº 61/2021 recuperado, com limitação da abertura direta documentada. A conferência integral da Resolução CMN nº 5.060/2023 segue pendente para o lote de Operadores.

Novo teste verifica que a revisão chega ao catálogo servido e mantém o histórico contratual do conteúdo. CI do novo head deve ser consultado após o push; não há resultado presumido neste documento. Não houve merge ou deploy nesta rodada.

## Próxima ação

Revisar CVM e Operadores com resolução da fonte primária da norma de carteiras. Depois revisar Seguros/Previdência, Pagamentos/Consórcios e coerência do Chefe. Concluir a avaliação de compreensão sem reduzir tudo a memorização literal. Só então promover o material revisado, após CI e verificação separada de publicação do Worker. Não criar novos mundos para compensar o ensino insuficiente.

## Histórico técnico e limites mantidos

Incidente inicial: frontend abriu antes do backend e houve “Rota não encontrada”. Correções anteriores: PR #492 (Wrangler), PR #494 (gate fail-closed); commit `90cc6d8e16039bb7ed1482bec3f75feadb860816`. PR #493 foi fechada sem merge; #491/#496/#497 foram substituídas.

Na retomada da PR #500, 24 execuções de CI foram confirmadas com sucesso. Check-runs do merge `ac9128c...`: Cloudflare Pages `108407207253`, GitHub Pages `108407233680` e Workers Builds `108407276388` bem-sucedidos; versão informada `b110fd9f-3cdf-4047-93a5-a147e9dcde47`. Isso é evidência histórica daquele merge, não da PR #501 nem de 100% do tráfego produtivo. A tentativa anterior de HTTP falhou no DNS local, sem provar indisponibilidade do portal.

Limitações técnicas ainda pendentes: sequência baseada nos 500 eventos recentes não é recorde histórico irrestrito; cronômetro/interrupções no celular, isolamento de rodadas e persistência real ainda precisam de validação específica. Não resolvidas pela revisão editorial.

## Aceite humano pendente

Clareza do ensino e aplicação do que foi lido; conclusão de missão; sair/voltar mantendo respostas/XP; conquista sem duplicação; expansão preservando histórico; revisão real; aprovação/reprovação do Chefe. Não encerrar a Fase 1 nem abrir formalmente a Fase 2 sem aceite explícito.
