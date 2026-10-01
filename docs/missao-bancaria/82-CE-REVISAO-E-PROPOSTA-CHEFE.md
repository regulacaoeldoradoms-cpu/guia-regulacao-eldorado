# Capitais e Câmbio — revisão e proposta do Chefe

01/10/2026. Continuação do [plano 80](80-CE-PLANO-E-PRIMEIRA-UNIDADE.md) e do [lote 81](81-CE-CONJUNTO-RASCUNHOS.md), no PR #570 draft. Autoria fora do catálogo, sem publicação ou aceite humano de fase.

## Revisão cumulativa entregue

[CE-R: leitura](rascunhos/ce-r-v1.md) e [fonte estruturada](rascunhos/ce-r-v1.mjs): 11 trechos, quatro exemplos, oito questões/32 justificativas e 17 contas. Reconstrói o caminho instrumento → direito → fluxo → risco → moeda → hipótese → cálculo → limite da conclusão. Nenhum conceito adicional é exigido antes de ensino.

| Questão | Confusão a recuperar | Aulas de origem |
| --- | --- | --- |
| 1 | Participação versus dívida; emissão versus revenda | CE-01/02/03 |
| 2 | Pedido de resgate versus recebimento; liquidez versus garantia | CE-04/05 |
| 3 | Compra do cliente versus venda da instituição; preço versus habilitação | CE-06/07 |
| 4 | Intervenção versus compromisso cambial | CE-08 |
| 5 | Cotação nominal parada versus mudança dos preços relativos | CE-09 |
| 6 | Receita versus resultado após custos | CE-10 |
| 7 | Rendimento em reais versus retorno reconvertido | CE-06/11 |
| 8 | Canal condicional versus promessa de valorização/lucro | CE-05/11 |

Os links por questão apontam às seções exatas, conferidas pelo validador. O aluno deve nomear a confusão, reler a origem e reconstruir o exemplo; não se cria indicador novo de domínio. A prática é exposta e não corresponde à avaliação independente A/B.

## Chefe redigido — 12 itens próprios

[Leitura do Chefe](rascunhos/ce-chefe-v1.md) e [fonte estruturada](rascunhos/ce-chefe-v1.mjs): cinco trechos de orientação/recuperação, um exemplo de método, **12 questões novas e 48 justificativas**, seis grupos com dois itens cada. O mapa abaixo orientou os casos efetivamente escritos. Nenhum assunto externo ao recorte comum histórico BB/CAIXA; fontes já verificadas nas aulas foram reaproveitadas.

| Grupo / itens | Desenho do caso e limite da conclusão | Retomada prevista |
| --- | --- | --- |
| G1 / 1–2 — Instrumentos e fluxos | (1) Participação/dívida e destino em emissão/revenda. (2) Emissor de CDB/debênture e remuneração/vencimento, sem garantia de pagamento | [CE-01](rascunhos/ce-01-v1.md#mercados), [CE-02](rascunhos/ce-02-v1.md#inicio), [CE-03](rascunhos/ce-03-v1.md#contrato) |
| G2 / 3–4 — Fundos e riscos | (3) Patrimônio/cota e condições de resgate. (4) Identificação de risco e resultado líquido com todos os custos dados; diversificação não garante lucro | [CE-04](rascunhos/ce-04-v1.md#cota), [CE-04](rascunhos/ce-04-v1.md#movimentacao), [CE-05](rascunhos/ce-05-v1.md#riscos), [CE-05](rascunhos/ce-05-v1.md#liquido) |
| G3 / 5–6 — Conversão e operação | (5) Unidade e perspectiva de compra/venda. (6) Finalidade e instituição autorizada, sem cobrar limite quantitativo ou rito fora da aula | [CE-06](rascunhos/ce-06-v1.md#perspectiva), [CE-07](rascunhos/ce-07-v1.md#finalidades), [CE-07](rascunhos/ce-07-v1.md#autorizacao) |
| G4 / 7–8 — Regimes | (7) Compromisso fixo ou banda explicitamente descritos. (8) Intervenção e estabilidade observada insuficientes para inferir mudança de regime | [CE-08](rascunhos/ce-08-v1.md#fixo), [CE-08](rascunhos/ce-08-v1.md#intermediario), [CE-08](rascunhos/ce-08-v1.md#ex-observacao) |
| G5 / 9–10 — Real e comércio | (9) eP*/P ou índice com base explícita, sem inferir equilíbrio. (10) Receita e custo de comércio exterior sob contratos definidos, sem garantir reação dos volumes | [CE-09](rascunhos/ce-09-v1.md#formula), [CE-09](rascunhos/ce-09-v1.md#indice), [CE-10](rascunhos/ce-10-v1.md#ex-resultado) |
| G6 / 11–12 — Juros e fluxos | (11) Reconversão e diferencial em período compatível. (12) Risco/expectativas e direção condicional de uma conversão de capital, sem previsão | [CE-11](rascunhos/ce-11-v1.md#moedas), [CE-11](rascunhos/ce-11-v1.md#risco), [CE-11](rascunhos/ce-11-v1.md#fluxo) |

Validação do Chefe: `node docs/missao-bancaria/rascunhos/validate-mp01.mjs --unit=cechefe --render` passou em 01/10/2026: 12 gabaritos com quatro justificativas, seis grupos, origens existentes, **32 contas**, UTF-8, links e MD/MJS sincronizados. Conferência de originalidade literal confirmou os 12 enunciados distintos dos 96 anteriores; não houve repetição da validação dessas questões. Próximo gate editorial: revisão independente somente do Chefe. Regras de ativação não foram implementadas pela autoria.

## Evidência e limite

Validação direcionada CE-R em 01/10/2026 aprovada e reaproveitada: **oito questões, cada uma com uma ou mais referências de origem**, cobertura cumulativa das 11 aulas, 17 contas, Markdown sincronizado, UTF-8/âncoras e exclusão do catálogo. O validador exige a união CE-01–11. Revisão independente de CE-01–11/CE-R no head `96cdd5b2` aprovada, sem correções substantivas; leitura pedagógica dos 12 Markdown, sem repetir cálculos, esquema, fontes ou links. **Não inclui o Chefe**, não é aceite humano da Fase 2 nem avaliação de retenção. Nenhum acesso D1/produção.
