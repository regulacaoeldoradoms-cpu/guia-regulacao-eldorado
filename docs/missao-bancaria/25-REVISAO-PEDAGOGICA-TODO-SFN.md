# MISSÃO BANCÁRIA — REVISÃO PEDAGÓGICA DE TODO O BLOCO ATUAL

Data: 26/09/2026.
Entrega: ampliação da PR #501 na branch `fix/missao-bancaria-ensino-do-zero`.
Fase ativa: **Fase 1, sem aceite pedagógico final**.

## Decisão humana

Wellyton determinou que todo conteúdo tenha material para ler e aprender antes de fazer questões. A revisão não pode se limitar à primeira aula. A exigência foi registrada de modo transversal em `24-CONTRATO-PEDAGOGICO-GLOBAL.md`, na continuidade e nas regras de conteúdo.

## Material redigido nesta ampliação

| Unidade | Ensino anterior à prática |
| --- | --- |
| Introdução ao SFN | Mantida a revisão V2: dinheiro, poupança, crédito, intermediação e três funções. |
| CMN | Nome, função, moeda/crédito, composição por cargos, distinções e exemplos resolvidos. |
| Banco Central | Abreviações, autarquia, supervisão, políticas, banco dos bancos e meio circulante. |
| Copom | Comitê, juros, inflação, Selic, meta, composição e diferença entre taxa básica e contrato. |
| CVM | Valores mobiliários, ação, mercado de capitais, companhia aberta, oferta pública e supervisão. |
| Operadores | Depósito à vista, captação, crédito, carteiras bancárias e regra de banco múltiplo explicada por condições. |
| Seguros/previdência | Seguro, prêmio, resseguro, nomes completos de CNSP/SUSEP/PREVIC, aberta/fechada e capitalização. |
| Pagamentos/consórcios | SPB, arranjo, instituição de pagamento, Pix/SPI, liquidação, autofinanciamento e administradora. |
| Chefe | Preparação cumulativa e rastreio para as aulas anteriores; sem matéria inédita. |

Todas as oito aulas possuem explicações, situações resolvidas, consulta de vocabulário e síntese. O Chefe tem material preparatório e referências de origem. Isso é material redigido para revisão, não alegação de curso integral ou de domínio comprovado.

## Implementação

- Novo `worker/studies-content/sfn-aulas-v2.js`: revisão das sete outras aulas e preparação do Chefe.
- `manifest.js`: aplica o material a todas as nove missões, mantendo o catálogo original de perguntas.
- `contentVersion` 2; mesmos `id`, `topicId`, ordem, XP, perguntas, alternativas, gabaritos e critério do Chefe.
- Cada uma das 38 questões recebe metadados com missão e trecho de ensino correspondente.
- As 12 questões do Chefe também apontam para a aula anterior de origem.
- O renderizador existente já apresenta as seções antes das perguntas; nenhuma alteração de CSS ou autenticação é necessária nesta entrega.
- Sem migrações, exclusões, zeragem de progresso, mudanças de pontuação ou alteração do gate de publicação.
- Referências de ensino são metadados de validação; não foi implementado novo botão por questão.

## Validação global

`validateTeachingCatalog` percorre todo o catálogo e reporta ausência de explicação, exemplo, glossário, resumo, fonte ou vínculo de questão, referência quebrada e referência a aula futura. Os testes demonstram também casos inválidos. A função é usada em CI e não gera exceção no carregamento produtivo.

Os testes preservam a comparação de IDs, questões e recompensas, mas substituem a premissa antiga de que somente a primeira missão poderia mudar. Não basta haver conteúdo na introdução para as demais serem consideradas conformes.

## Precisão e fontes

Foram reabertas páginas oficiais do Ministério da Fazenda, CVM, SUSEP e PREVIC. A composição do CMN foi confirmada na página do Ministério da Fazenda; a previdência fechada usa a página da PREVIC sobre vínculo com patrocinador/instituidor. O catálogo mantém as fontes oficiais previamente usadas nas questões.

Limitação explícita: várias páginas do Banco Central, incluindo os textos das Resoluções BCB 61 e CMN 5.060, retornaram somente dependência de JavaScript nesta sessão. Não registrar isso como nova conferência integral. As afirmações normativas existentes foram preservadas, sem alterar gabaritos; sua reconferência integral permanece item de revisão final antes de promover a entrega. Não foram introduzidos valores atuais de juros nem nomes de autoridades.

Referências reabertas:
- https://www.gov.br/fazenda/pt-br/assuntos/cmn
- https://www.gov.br/cvm/pt-br/acesso-a-informacao-cvm/institucional/competencia
- https://www.gov.br/susep/pt-br/acesso-a-informacao/institucional/sobre-a-susep
- https://www.gov.br/susep/pt-br/copy_of_planos-e-produtos/previdencia-complementar-aberta
- https://www.gov.br/previc/pt-br/licenciamento-e-habilitacao/como-participar

## Estado de publicação

Esta ampliação atualiza uma PR existente; não incorpora automaticamente nada à main. Conferir CI e precisão, depois publicação do Worker e compreensão do usuário. Não declarar que todo o material já mudou no portal somente pelo commit.

Prioridade: concluir a revisão e publicar unidades com ensino adequado. Não criar novos mundos ou mais recompensas para compensar a insuficiência das aulas.
