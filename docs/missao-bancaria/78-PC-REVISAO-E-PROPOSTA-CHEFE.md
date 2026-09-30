# Produtos e Crédito — revisão cumulativa e Chefe em rascunho

Rascunho editorial em 30/09/2026, fora do catálogo. A [PC-R](rascunhos/pc-r-v1.md) contém 18 trechos, quatro exemplos integrados, 12 casos novos e 48 justificativas, com recuperação local e referências de origem por questão. Apoia-se nas 15 aulas PC-01A/01–06/08–10/11A–E, sem PC-07 condicionado. Não é forma independente nem simulado representativo de BB/CAIXA.

## Dependências e uso

Na preparação editorial, ler a aula antes de suas questões; na revisão, retornar diretamente à origem do conceito. O encadeamento recomendado para preparar o pacote é PC-01A → 01 → 02 → 03/04 → 05 → 06 → 08 → 09 → 10 → 11A–E → PC-R → Chefe, respeitando as dependências detalhadas do [documento 77](77-PC-CONJUNTO-COMUM-RASCUNHOS.md). É ordem de estudo proposta, **sem IDs/gates/XP produtivos definidos nesta entrega**.

## Chefe redigido: 12 itens próprios em seis grupos

O [Chefe em dois formatos](rascunhos/pc-chefe-v1.md) segue a tabela abaixo: 12 casos próprios, 48 justificativas, cinco trechos preparatórios e referências de ensino/recuperação, no padrão editorial do MP. O conjunto PC agora soma 144 questões expostas. O Chefe não introduz regras normativas novas; reaproveita as aulas e suas fontes. Antes de publicar, fixar IDs produtivos, revisar os itens e decidir a integração do conjunto. Este rascunho não concede autorização de publicação nem cria protocolo de avaliação independente.

| Grupo / itens redigidos | Caso e habilidade | Ensino/recuperação de referência |
| --- | --- | --- |
| G1 — 1 | Documento de representação + extrato: separar poderes, pessoa e saldo/limite | [PC-01A representação](rascunhos/pc-01a-v1.md#representacao); [PC-01 saldo](rascunhos/pc-01-v1.md#saldo-limite) |
| G1 — 2 | Proposta de aquisição: entrada, valor financiado, finalidade contratual e custo comparável | [PC-02 fluxo](rascunhos/pc-02-v1.md#fluxo); [PC-04 base](rascunhos/pc-04-v1.md#base-comparavel) |
| G2 — 3 | Fatura e anúncio: pagamento parcial, calendário e período do indicador | [PC-03 datas](rascunhos/pc-03-v1.md#datas); [PC-03 total](rascunhos/pc-03-v1.md#total-minimo); [PC-04 períodos](rascunhos/pc-04-v1.md#periodos) |
| G2 — 4 | Necessidade empresarial/rural declarada: separar recebível atual/futuro e finalidade do gasto | [PC-05 recebíveis](rascunhos/pc-05-v1.md#recebiveis); [PC-06 custeio](rascunhos/pc-06-v1.md#custeio); [PC-06 investimento](rascunhos/pc-06-v1.md#investimento) |
| G3 — 5 | Instrumentos distintos: identificar aval/fiança e não transportar benefício de ordem | [PC-08 aval](rascunhos/pc-08-v1.md#aval); [PC-08 ordem](rascunhos/pc-08-v1.md#ordem) |
| G3 — 6 | Mesmo bem/uso em regimes declarados: distinguir penhor, hipoteca e propriedade fiduciária | [PC-09 penhor](rascunhos/pc-09-v1.md#penhor); [PC-09 comparação](rascunhos/pc-09-v1.md#comparar) |
| G4 — 7 | Linha de vencimentos: identificar atraso sem antecipar obrigação futura nem inventar causa | [PC-10 acompanhamento](rascunhos/pc-10-v1.md#acompanhamento); [PC-10 atraso](rascunhos/pc-10-v1.md#atraso) |
| G4 — 8 | Oferta de acordo e cobrança de consumo: distinguir aceitação/pagamento e meio lícito | [PC-10 recuperação](rascunhos/pc-10-v1.md#recuperacao); [PC-10 cobrança](rascunhos/pc-10-v1.md#cobranca) |
| G5 — 9 | Poupança com depósito datado/saque: identificar regime e base, sem rendimento diário inventado | [PC-11A base](rascunhos/pc-11a-v1.md#base); [PC-11A regimes](rascunhos/pc-11a-v1.md#antigos) |
| G5 — 10 | Capitalização e plano por sobrevivência: distinguir cotas, reserva, evento e condições | [PC-11B cotas](rascunhos/pc-11b-v1.md#cotas); [PC-11C eventos](rascunhos/pc-11c-v1.md#resgate); [PC-11C base](rascunhos/pc-11c-v1.md#tributacao) |
| G6 — 11 | Seguro com informações parciais: separar prêmio/limite e reconhecer cobertura ainda não demonstrada | [PC-11D prêmio](rascunhos/pc-11d-v1.md#premio); [PC-11D limite](rascunhos/pc-11d-v1.md#limites) |
| G6 — 12 | Consórcio com necessidade datada: contemplação incerta, lance e custos próprios | [PC-11E contemplação](rascunhos/pc-11e-v1.md#contemplacao); [PC-11E lance](rascunhos/pc-11e-v1.md#lance); [PC-11E custos](rascunhos/pc-11e-v1.md#custos) |

Os grupos organizam autoria e recuperação; **não criam diagnóstico automático por conceito**. Pontuação, desbloqueio, XP e percentual do Chefe não são inferidos como autorização deste rascunho. A política publicada do MP permanece inalterada. O recorte introdutório não garante domínio, retenção ou aprovação em concurso.

## Verificação e próximos passos

Chefe aprovado no validador editorial com Node 24.17.0: 12 questões/48 justificativas, seis grupos com dois itens cada, 33 referências de ensino existentes e incluídas na cobertura, 17 cálculos e 110 verificações de links locais. Gabaritos distribuídos em três A/B/C/D; 12 enunciados sem duplicação textual frente aos 132 anteriores. MD gerado do MJS, catálogo publicado idêntico/draft excluído; PC-07 ausente. Sintaxe/diff conferidos. Comando: `node docs/missao-bancaria/rascunhos/validate-mp01.mjs --unit=pcchefe`; evidência local `../pc-chefe-validation.json`. Não houve nova auditoria normativa ou suíte de aplicativo.

PC-R aprovada na validação estrutural: 25 referências de origem existentes, 12 gabaritos indexados, 48 justificativas e dez cálculos novos; links desta proposta conferidos. Resultados e limites no documento 77/checkpoint. Parecer independente do ensino PC-04/05/06/08–10/11A–E/PC-R foi encaminhado pelo pai em 30/09/2026: aprovado com uma correção em PC-11B q03, aplicada nos dois formatos. Não identificou outros bloqueios; conferiu referências pontuais de CET, modalidades SUSEP e Lei 15.040, sem auditoria normativa integral. Parecer separado do Chefe encaminhado pelo pai: outros 11 itens com resposta única defensável; única precisão em q09, aplicada nos dois formatos: identificar explicitamente “conta de poupança”. Gabarito C e cálculos preservados; conferência limitada ao enunciado e sincronia, sem repetir pesquisa ou revisão. Aceite humano pedagógico da Fase 2 continua não observado.

## Condicionamento exato de PC-07

**Título/assunto:** Crédito habitacional, candidato condicionado — introdução ao financiamento de moradia (finalidade, valor, prazo e condições). O plano 66/documento 77 não confirmou correspondência nominal desse recorte nos perfis históricos BB 2022/001 e CAIXA 2024/NM. Falta uma fonte de escopo que identifique o item/subitem e a profundidade no edital efetivamente adotado; não basta associar genericamente moradia ao mundo bancário.

A futura decisão é incluí-lo como requisito comprovado desse escopo ou como complemento explicitamente identificado (comum ou institucional, conforme o vínculo), ou mantê-lo fora. Se incluído, sistemas, fundos e programas só entram após conferir fontes oficiais próprias e sua versão. PC-02/04 antecedem a unidade; questões dependentes de garantias devem vir após PC-08/09. Nenhum desses conteúdos foi inventado, cobrado em PC-R/Chefe ou ativado. Essa pendência não impede revisar o núcleo comum já preparado.
