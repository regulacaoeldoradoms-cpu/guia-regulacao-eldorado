# Institucional CAIXA — plano e primeiro lote

03/10/2026. Bloco existente `banking.institution-specific`, exclusivo do perfil **histórico CAIXA 2024/NM — Técnico Bancário Novo**. Não adota edital vigente nem amplia para BB. Rascunhos fora do catálogo; Fase 2 sem aceite humano observado e Fase 3 não aberta.

## Rastreabilidade e sequência

Reaproveitada a matriz 65/JSON do [#559](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/pull/559), commit `400d48545710c1ec0b3a9628bd37813d065dac00`, sem integrar esse PR. O [PDF oficial](https://www.caixa.gov.br/Downloads/concurso-publico-editais/EDITAL_N_01_2024_NM_DE_22_DE_FEVEREIRO_DE_2024_.pdf) teve download/extração e conferência visual registrados em 30/09: Anexo IV pp.33–34, SHA-256 `6ef6262ce9f0f8a1db5225d288251b1c3f3761fc8ae368f3d6c77b57ae50014b`. O loop do navegador de pesquisa de 03/10 não justificou repetir o download já validado. Numeração e lacunas preservadas; recortes internos abaixo são editoriais, não novos subitens oficiais.

| Unidade | Item histórico | Competência e dependência |
| --- | --- | --- |
| [IS-01 PIS](rascunhos/is-01-v1.md) | 31; apoio 39/46 | Programa/cadastro/abono e corte temporal; SFN e PC-01 |
| [IS-02 Abono](rascunhos/is-02-v1.md) | 39/46, sem dupla contagem | Ano-base, requisitos cumulativos, proporcionalidade; IS-01, porcentagem explicada no texto |
| [IS-03 FGTS](rascunhos/is-03-v1.md) | 32, fundamentos | Fundo/conta vinculada, agentes e depósito; SFN e PC-01 |
| [IS-04 Utilização/saque](rascunhos/is-04-v1.md) | 32, complemento | Ler hipóteses, condições e modalidades sem garantir disponibilidade; IS-03 |
| [IS-05 Regularidade/CRF](rascunhos/is-05-v1.md) | 33 | Certificado, situação do empregador e limites da evidência; IS-03 |
| [IS-06 Recolhimento/GRF](rascunhos/is-06-v1.md) | 34 | Guia, obrigação, pagamento e transição para FGTS Digital; IS-03/05 |
| [IS-07 Seguro-desemprego](rascunhos/is-07-v1.md) | 39/46, outra competência | Finalidade e habilitação no recorte pertinente, distinto de abono; IS-01/02 |
| [IS-08 Bolsa Família](rascunhos/is-08-v1.md) | 35 | Lei histórica citada e marco posterior separados; distinguir cadastro, seleção e pagamento |
| [IS-R e proposta do Chefe](89-IS-REVISAO-E-PROPOSTA-CHEFE.md) | Itens acima | Revisão com origens e proposta de 12 itens próprios após completar o ensino |

Não incluir FIES, loterias, crédito habitacional PC-07 ou outro programa sem correspondência nominal nesse recorte. IS-03 não encerra o item 32; abono não encerra seguro-desemprego nem a LC 7 inteira. Benefícios e normas atuais são consultados por recorte, com corte de 03/10/2026; não transformar uma referência histórica em procedimento vigente.

## Entrega e verificação proporcional

Conjunto atual: oito aulas e revisão cumulativa, **72 questões e 288 justificativas**, 32 exemplos resolvidos e 11 cálculos conferidos. O Chefe tem proposta de 12 itens no documento 89, ainda sem autoria concluída. Fonte editorial `.mjs`, leitura `.md` gerada pelo validador existente. Sem XP, ordem, importação de runtime, mudança de regras de desbloqueio, acesso, frontend, Worker ou D1. Regras de publicação futuras dependem de aprovação própria.

Fontes primárias: LC 7/1970 (origem do PIS); Lei 7.998 e EC 135/2024 (abono e mudança do critério constitucional); serviço MTE (recorte datado de períodos/pagadores); Lei 8.036 (agentes e depósitos). Não reproduzir teto de renda antigo como universal, salário mínimo hipotético como atual ou saldo como autorização de saque.

Validação por unidade: `node docs/missao-bancaria/rascunhos/validate-mp01.mjs --unit=is01 --render` e novamente sem `--render`; substituir por `is02` até `is08` ou `isr`. Conferir esquema, gabaritos, quatro justificativas, cobertura de objetivos, cálculos novos, fontes, links/âncoras, UTF-8, sincronia e exclusão pelo filtro de publicação. Não repetir app/MP/PC/CE/DP por rascunhos. Revisão factual pelo autor não equivale a parecer independente, aceite humano ou homologação de produção.

Verificação final executada: as seis unidades passaram esquema, gabaritos, quatro justificativas, cobertura, fontes, UTF-8, sincronia, recuperação e filtro de publicação. Os seis cálculos foram conferidos. A geração inicial teve referências cruzadas ausentes até terminar todas as prévias; a passagem final sem render confirmou os links. Revisão independente permanece pendente.

IS-07, IS-08 e IS-R passaram verificações direcionadas; revisão tem origem por questão e recupera as oito aulas. Próxima etapa independente: escrever os 12 itens próprios do Chefe conforme o documento 89, verificando apenas fatos novos necessários. Push da branch institucional rejeitado por revisão automática; aguardar autorização específica, sem nova tentativa. Publicação DP segue separadamente pendente: #572 desativado; correção #598 em `2e600517` teve CI terminal 26/27, auditoria global 216 cenários aprovados; único check falho é preview Worker. Não reabrir esse diagnóstico para continuar autoria.
