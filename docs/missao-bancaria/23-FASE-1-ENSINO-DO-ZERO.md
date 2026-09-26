# MISSÃO BANCÁRIA — FASE 1 — ENSINO DO ZERO

Data: 26/09/2026.
Estado: correção pedagógica implementada para revisão; publicação e homologação devem ser verificadas separadamente.

## Feedback que motivou a correção

Wellyton abriu a primeira aula real e observou que havia fases e questões, mas não uma explicação adequada para começar. Informou não conhecer as siglas. A captura mostra conceitos como intermediação financeira, normativo e CMN usados sem preparação suficiente.

A crítica é procedente. Os textos iniciais eram sínteses de revisão. Nove cartões publicados e 38 questões não equivalem a nove aulas pedagogicamente completas. **A Fase 1 permanece aberta e não está homologada no ensino.**

## Recorte desta entrega

Reconstrução SOMENTE da aula `banking.sfn.introducao`, para começar sem conhecimentos bancários prévios:

1. significado de Sistema Financeiro Nacional e da sigla SFN;
2. situações cotidianas;
3. poupar, poupador, tomador e crédito;
4. exemplo fictício de intermediação financeira;
5. juros com números inventados, sem recomendação financeira;
6. motivo da existência de regras e fiscalização;
7. Conselho Monetário Nacional (CMN), nome e função;
8. Banco Central do Brasil (BC/BCB/Bacen), nome e função;
9. operadores e distinção Banco do Brasil x Banco Central;
10. analogia com limites explicitados;
11. dois exemplos resolvidos;
12. vocabulário das alternativas;
13. resumo de consulta e recordação orientada;
14. as mesmas três questões já existentes.

As demais oito missões NÃO foram reescritas nesta entrega. A revisão delas é prioritária após calibrar esta primeira aula com Wellyton. Não apresentar o curso inteiro como corrigido.

## Implementação

- Conteúdo editorial em `worker/studies-content/sfn-introducao-v2.js`.
- `manifest.js` publica a revisão de uma única missão e resolve missão/tópico/questão a partir do mesmo catálogo.
- `contentVersion` da introdução passa de 1 para 2.
- Mesmos `id`, `topicId`, ordem, XP, perguntas, alternativas e gabaritos.
- Nenhuma migração D1, exclusão de dados ou alteração de permissões.
- Nenhuma alteração de CSS, autenticação, cronômetro, pontuação ou pipeline.
- O renderizador existente já aceita `heading` e `body`. Não é necessário criar um editor ou nova infraestrutura para corrigir a aula.
- A atualização depende de publicação do Worker; apenas fazer merge não prova que o texto novo está no portal.

## Aderência das questões ao ensino

- `q.sfn.01`: partes 6 a 9 ensinam a diferença entre funções; parte 13 explica termos dos distratores.
- `q.sfn.02`: partes 3, 4, 9 e 11 explicam intermediação e papel operacional.
- `q.sfn.03`: partes 7, 8, 12 e 14 distinguem o conselho do banco supervisor e dos operadores.

## Fontes

Conferidas em 26/09/2026:
- Portal do Investidor: https://www.gov.br/investidor/pt-br/investir/como-investir/conheca-o-mercado-de-capitais/sistema-financeiro-nacional/
- Ministério da Fazenda: https://www.gov.br/fazenda/pt-br/assuntos/cmn

Uso limitado da página educacional do Portal do Investidor: estrutura em normativos/supervisores/operadores e conceitos. A seção sobre composição ministerial nessa página é antiga; NÃO foi usada para ensinar composição atual. A primeira aula não cobra composição, nomes de autoridades, juros atuais nem regras de contratação.

As páginas do Banco Central já catalogadas foram mantidas como referência complementar; sua leitura automática retornou dependência de JavaScript nesta conferência. Não registrar esse retorno como verificação integral do conteúdo.

## Testes

Novo teste `worker/tests/studies-teaching.test.mjs` executa o catálogo real e verifica:
- missão publicada com a revisão pedagógica;
- nomes e termos essenciais no conteúdo;
- resolução coerente por missão/tópico/questão;
- catálogo de fontes sem duplicatas;
- mesmos IDs, ordem, XP, questões e gabaritos;
- demais missões preservadas sem alterações;
- formato textual compatível com o renderizador.

Essas verificações detectam regressões técnicas; não substituem avaliação humana de clareza.

## Próximo aceite

Pedir a Wellyton que leia a introdução revisada e explique, em suas palavras, o significado de SFN e as três funções. Primeiro resolver compreensão; depois avaliar XP/conquista. Não exigir que complete o bloco inteiro para descobrir se a explicação básica funciona.

O critério pedagógico passou a integrar `12-FONTES-E-CONTEUDO.md` e o documento da Fase 1. A correção não autoriza antecipar a Fase 2 nem declarar domínio pela quantidade de questões.
