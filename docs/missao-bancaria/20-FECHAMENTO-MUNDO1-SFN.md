# MISSÃO BANCÁRIA — FECHAMENTO DO MUNDO 1 — SFN

Data: 26/09/2026  
Estado: **INCORPORADO À `main` pela PR #498; HOMOLOGAÇÃO HUMANA PENDENTE**

Implementação incorporada pela PR #498.  
Merge commit: `20487883c948dffbeb4b6849baa3c39e9c577d9f`.

## Objetivo

Completar o primeiro mundo jogável da Missão Bancária com nove missões:

1. visão geral do SFN;
2. CMN;
3. Banco Central;
4. Copom;
5. CVM;
6. operadores do SFN;
7. seguros, previdência e capitalização;
8. pagamentos, Pix e consórcios;
9. Chefe do SFN.

O Mundo 1 passa a ter:
- **9/9 missões publicadas**;
- disponibilidade da campanha = 100%;
- progresso pessoal preservado sobre o escopo fixo de nove missões;
- revisões espaçadas;
- primeiro Chefe com critério real de aprovação.

## Missão 7 — Seguros, previdência e capitalização

ID:
`banking.sfn.seguros-previdencia`

Objetivos:
- distinguir CNSP, SUSEP e PREVIC;
- associar SUSEP a seguros, previdência complementar aberta, capitalização e resseguro;
- associar PREVIC às entidades fechadas de previdência complementar;
- diferenciar previdência complementar aberta e fechada.

Fontes oficiais conferidas em 26/09/2026:
- SUSEP — competências e mercados supervisionados:
  https://www.gov.br/susep/pt-br/acesso-a-informacao/institucional/sobre-a-susep
- SUSEP — Previdência Complementar Aberta:
  https://www.gov.br/susep/pt-br/copy_of_planos-e-produtos/previdencia-complementar-aberta
- PREVIC — Previdência Complementar Fechada:
  https://www.gov.br/previc/pt-br/licenciamento-e-habilitacao/como-participar
- PREVIC — missão institucional:
  https://www.gov.br/previc/pt-br/acesso-a-informacao-1/institucional/missao-visao-e-valores

## Missão 8 — Pagamentos, Pix e consórcios

ID:
`banking.sfn.pagamentos-consorcios`

Objetivos:
- entender a lógica do Sistema de Pagamentos Brasileiro;
- reconhecer que instituição de pagamento não é instituição financeira;
- situar Pix e SPI;
- compreender consórcio como autofinanciamento;
- reconhecer o Banco Central como supervisor/autorizador no segmento aplicável.

Fontes oficiais conferidas em 26/09/2026:
- Banco Central — Sistema de Pagamentos Brasileiro:
  https://www.bcb.gov.br/estabilidadefinanceira/spb
- Banco Central — Instituições de pagamento:
  https://www.bcb.gov.br/estabilidadefinanceira/instituicaopagamento
- Banco Central — Sistema de Pagamentos Instantâneos:
  https://www.bcb.gov.br/estabilidadefinanceira/sistemapagamentosinstantaneos
- Banco Central — FAQ Consórcio:
  https://www.bcb.gov.br/meubc/faqs/s/consorcio

## Aderência ao edital

Os editais-base continuam sendo:
- Banco do Brasil — Seleção Externa 2022/001;
- CAIXA — Edital nº 01/2024/NM.

Ambos incluem Sistema Financeiro Nacional e produtos/temas relacionados. O BB explicita arranjos de pagamento, Pix, capitalização, previdência, consórcio e seguros. A CAIXA 2024 explicita Pix e produtos bancários como capitalização, previdência, consórcio, investimentos e seguros.

## Missão 9 — Chefe do SFN

ID:
`banking.sfn.boss`

Tipo:
`boss`

Regras:
- 12 questões cumulativas;
- nenhuma matéria nova;
- somente as respostas da rodada atual contam;
- se houver resposta repetida, vale a resposta mais recente;
- nota mínima: **75%**;
- 75% em 12 questões = pelo menos 9 acertos;
- vitória concede 220 XP uma única vez;
- derrota não conclui a missão;
- nova tentativa exige abrir uma nova rodada;
- vitória concede a conquista `study.sfn.boss` — **SFN dominado**;
- a conquista é idempotente.

## Segurança da pontuação

A nota do Chefe:
1. identifica a sessão ativa mais recente da missão;
2. considera apenas tentativas registradas desde o início dessa sessão;
3. usa a última tentativa de cada questão por `rowid`;
4. exige todas as 12 questões;
5. calcula percentual;
6. bloqueia conclusão abaixo de 75%.

Tentativas históricas de outras sessões não completam o Chefe.

## Estado da Fase 1

O fechamento do Mundo 1 **não encerra a Fase 1 automaticamente**.

Ainda dependem de homologação humana:
- concluir missão real;
- sair e voltar com progresso preservado;
- confirmar conquista na página `/conquistas/`;
- confirmar expansão sem perda de progresso;
- confirmar revisão real quando vencer;
- testar e aprovar o Chefe do SFN.

Somente depois desses pontos a Fase 1 poderá receber aceite final.
