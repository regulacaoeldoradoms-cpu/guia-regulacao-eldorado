# MISSÃO BANCÁRIA — EXPANSÃO SFN V1.1

Data: 26/09/2026  
Estado: **EM BRANCH; HOMOLOGAÇÃO PENDENTE**

Branch:
`feat/missao-bancaria-fase1-expansao-sfn-v2`

## Objetivo

Provar a principal promessa incremental da Fase 1:

> publicar conteúdo novo sem apagar XP, tentativas, domínio, revisões, conquistas ou progresso já obtido.

## Mudança de modelo de progresso

O Mundo 1 — Sistema Financeiro Nacional passa a ter um escopo planejado fixo de **9 missões**.

A interface separa três medidas:

- **Campanha disponível:** missões publicadas / 9;
- **Progresso conquistado:** missões concluídas / 9;
- **Conclusão do conteúdo liberado:** missões concluídas / missões atualmente publicadas.

Exemplo:
- antes: 4 missões publicadas, 2 concluídas → progresso conquistado = 2/9;
- depois: 6 missões publicadas, as mesmas 2 concluídas → progresso conquistado continua = 2/9;
- a conclusão do conteúdo liberado muda de 2/4 para 2/6;
- nenhuma conclusão, XP, tentativa, revisão ou conquista é removida.

O cálculo está isolado em função testável no backend e possui teste de regressão específico.

## Escopo fixo do Mundo 1

1. `banking.sfn.introducao` — publicado;
2. `banking.sfn.cmn` — publicado;
3. `banking.sfn.bacen` — publicado;
4. `banking.sfn.copom` — publicado;
5. `banking.sfn.cvm` — expansão V1.1;
6. `banking.sfn.operadores` — expansão V1.1;
7. `banking.sfn.seguros-previdencia` — planejado;
8. `banking.sfn.pagamentos-consorcios` — planejado;
9. `banking.sfn.boss` — planejado.

## Missão 5 — CVM

Objetivos:
- distinguir CVM de Banco Central;
- associar CVM ao mercado de valores mobiliários/mercado de capitais;
- reconhecer companhias abertas, fundos, securitizadoras, corretoras e ofertas públicas como elementos típicos da esfera da CVM;
- reforçar proteção ao investidor e integridade do mercado.

Fontes oficiais conferidas:
- CVM — Qual o papel da CVM?;
- CVM — Mandato Legal;
- editais-base BB e CAIXA.

## Missão 6 — Operadores do SFN

Objetivos:
- reconhecer o papel operacional;
- diferenciar operador, normatizador e supervisor;
- introduzir banco comercial e banco múltiplo;
- reconhecer instituições supervisionadas pelo Banco Central.

Pontos normativos usados:
- banco múltiplo possui, no mínimo, duas carteiras, sendo uma obrigatoriamente comercial ou de investimento;
- o Banco Central supervisiona, entre outras, bancos, cooperativas de crédito, financeiras, instituições de pagamento e administradoras de consórcio.

## Fontes conferidas

### CVM — papel institucional
https://www.gov.br/cvm/pt-br/acesso-a-informacao-cvm/perguntas-frequentes-da-cvm/teste-assunto/teste-combo-assunto

### CVM — mandato legal
https://www.gov.br/cvm/pt-br/acesso-a-informacao-cvm/institucional/competencia

### Banco Central — instituições supervisionadas
https://www.bcb.gov.br/meubc/faqs/p/instituicoesqueobancocentralsupervisiona

### CMN — bancos comerciais e múltiplos
https://www.bcb.gov.br/estabilidadefinanceira/exibenormativo?numero=5060&tipo=Resolu%C3%A7%C3%A3o+CMN

## Cache

O asset `/js/studies.js` recebe nova versão de URL para impedir que dispositivos mantenham o cliente V1 em cache ao liberar a V1.1.

## Critério desta expansão

A expansão pode ser incorporada quando:
1. CI da Missão Bancária estiver verde;
2. suíte geral do Worker estiver verde;
3. não houver regressão do Portal;
4. V1.1 aparecer sem apagar dados V1;
5. progresso conquistado permanecer matematicamente estável;
6. Wellyton puder abrir a próxima missão normalmente.

A expansão não encerra a Fase 1.
