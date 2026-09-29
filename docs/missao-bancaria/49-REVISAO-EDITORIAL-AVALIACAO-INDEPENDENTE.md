# MISSÃO BANCÁRIA — REVISÃO EDITORIAL/FACTUAL DA AVALIAÇÃO INDEPENDENTE V2

Data: 29/09/2026.  
Fase ativa: Fase 1.  
Catálogo: `worker/studies-assessment-content/sfn-foundation-v1.js`.

## Objetivo

Revisar o banco independente antes da interface produtiva, com foco em dois riscos que não são detectados apenas por gabarito válido:

1. item excessivamente parecido com treino/Chefe;
2. pista involuntária pela forma ou pelo comprimento das alternativas.

## Similaridade com treino

A suíte já compara os 32 prompts independentes contra as 38 questões de treino/Chefe e rejeita cópia literal ou proximidade excessiva.

Na revisão editorial adicional:
- nenhuma questão independente atingiu similaridade lexical >= 0,55 com o melhor prompt do treino;
- maior aproximação encontrada: B11 x `q.oper.02`, ainda abaixo do corte e com formulação/contexto diferentes;
- os IDs A/B continuam sem sobreposição.

Isso não prova independência psicométrica, mas reduz reutilização óbvia do enunciado.

## Posição da alternativa correta

Mantido o balanceamento:
- Forma A: 4×A, 4×B, 4×C, 4×D;
- Forma B: 4×A, 4×B, 4×C, 4×D.

## Comprimento e pistas

A revisão V3 reescreveu alternativas com diferenças desproporcionais de tamanho, sem mudar:
- competência;
- enunciado;
- índice da resposta correta;
- fonte;
- vínculo de ensino.

Após a revisão, a diferença máxima de comprimento entre alternativas de qualquer item ficou em 33 caracteres.

Foi adicionado teste de regressão que falha se um item voltar a ultrapassar diferença de 35 caracteres.

O limite é um guardrail editorial, não uma regra universal de qualidade; leitura humana continua necessária.

## Conferência factual dirigida

Foram reconferidos os pontos mais sensíveis contra as fontes oficiais já cadastradas no projeto:

- CMN: papel normativo e composição;
- BCB: supervisão, execução de políticas e função de banco dos bancos;
- Copom: meta Selic e funcionamento no BCB;
- CVM: valores mobiliários, ofertas públicas, fundos e manipulação de mercado;
- banco múltiplo: regra de carteiras;
- SUSEP/PREVIC: previdência aberta/fechada, capitalização e seguros;
- instituição de pagamento: natureza não financeira e vedação a atividade privativa;
- SPI: infraestrutura centralizada e LBTR;
- SPB: sistema/infraestruturas/arranjos, não entidade única;
- consórcio: autofinanciamento e ausência de garantia de contemplação imediata.

A conferência não transforma o banco em certificação psicométrica nem substitui o uso humano.

## Versionamento

O catálogo passa de `ASSESSMENT_VERSION = 1` para `2`.

Motivo: houve mudança editorial em alternativas exibidas ao aluno. Rodadas V1 existentes continuam históricas; o serviço já possui mecanismo para não misturar silenciosamente rodada ativa incompatível com a versão corrente.

## Preservação

- 32 IDs permanecem iguais;
- 16 itens por forma;
- mesmo equilíbrio por aula;
- nenhum XP;
- nenhuma alteração de cobertura;
- nenhuma prontidão automática;
- bootstrap comum continua sem expor o banco inteiro;
- correção continua indisponível durante a rodada.

## Pendência humana

Ainda é obrigatório observar:
- clareza real para Wellyton;
- dificuldade percebida;
- existência de pistas semânticas não capturadas por tamanho;
- comportamento depois de intervalo real entre A e B.

Esses pontos pertencem à homologação humana, não ao CI.
