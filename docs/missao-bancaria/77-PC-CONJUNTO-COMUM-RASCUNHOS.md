# Produtos e Crédito — conjunto comum em rascunho

Estado editorial em 30/09/2026. Continuidade do plano 66, consultado em `400d48545710c1ec0b3a9628bd37813d065dac00` no [PR #559](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/pull/559), sem integrar esse PR. Fontes e recortes constam de cada unidade; versões antigas de páginas educativas são identificadas, sem incorporar detalhes normativos fora do recorte.

**Entrega:** nove aulas novas, cada uma com quatro exemplos resolvidos e oito questões com justificativa das quatro alternativas; 111 trechos, 36 exemplos, 72 questões e 288 justificativas. Somam-se aos seis rascunhos PC-01A/01–05 e à [revisão cumulativa/proposta de Chefe](78-PC-REVISAO-E-PROPOSTA-CHEFE.md). Os 16 artefatos de ensino/revisão têm 132 questões formativas; o Chefe agora acrescenta 12 itens próprios, totalizando 144 questões expostas no pacote. Revisão independente do Chefe permanece pendente.

| Unidade e leitura | Pré-requisito didático | Competência cobrada | Fonte/limite central |
| --- | --- | --- | --- |
| [PC-06 Rural](rascunhos/pc-06-v1.md) | PC-02/04/05 | Classificar quatro finalidades e separar enquadramento de concessão | BCB: crédito rural, SNCR e beneficiários; sem taxas, calendários ou programas |
| [PC-08 Garantias pessoais](rascunhos/pc-08-v1.md) | PC-01A/02 | Identificar partes, fiança/aval, benefício de ordem e fiança bancária | CC 818–828, 897–903; ressalva de leis especiais; sem universalizar aval parcial |
| [PC-09 Garantias reais](rascunhos/pc-09-v1.md) | PC-02/08 | Separar posse/propriedade em penhor, hipoteca e alienação fiduciária | CC e Lei 9.514, arts. 22–23; sem ensinar execução/prazos |
| [PC-10 Acompanhamento](rascunhos/pc-10-v1.md) | PC-02/04/08/09 | Ler vencido/vincendo e oferta/acordo; limites de cobrança | CDC 42, 52, 54-D em relações de consumo; sem classificação de risco inventada |
| [PC-11A Poupança](rascunhos/pc-11a-v1.md) | PC-01; porcentagem explicada no exemplo | Regime do depósito, aniversário, menor saldo e TR/adicional | BCB e Lei 12.703; taxas dos exemplos hipotéticas, sem composição completa/tributação/FGC |
| [PC-11B Capitalização](rascunhos/pc-11b-v1.md) | PC-01/11A | Cotas, prazos, direitos e modalidades tradicional/popular | SUSEP; sem percentual/carência universal ou prêmio garantido |
| [PC-11C Previdência/VGBL](rascunhos/pc-11c-v1.md) | PC-01/11A | Natureza, reserva/custos, eventos e base tributável | SUSEP, versão educativa indicada; sem tabelas fiscais, deduções, sucessão ou antigos limites de investimento |
| [PC-11D Seguros](rascunhos/pc-11d-v1.md) | PC-11B/11C para contrastes | Prêmio, partes, risco, exclusão e limite | Lei 15.040/2024 vigente; não apresentar CC revogado como norma atual |
| [PC-11E Consórcio](rascunhos/pc-11e-v1.md) | PC-02/04 | Grupo, contemplação/lance, custos e obrigações | Lei 11.795; sem promessa de prazo/resultado ou restituição universal |

## Rastreabilidade e escopo

Preservar os vínculos **históricos** do plano 66, sem confundir apoio didático e cobertura completa: PC-06/11 desdobram produtos do item 5 BB 2022/001 e da parte de produtos do item 19 CAIXA 2024/NM; PC-08/09 se ligam aos itens 15 BB/29 CAIXA; PC-10 à parte de recuperação dos itens 13 BB/27 CAIXA. PC-01A/01 continuam com vínculos próprios 36/37 CAIXA e apoio a confirmar no BB. Isso não adota um edital atual nem integra benefícios/programas exclusivos da CAIXA ao núcleo comum.

**PC-07 habitacional permanece candidato condicionado**, sem correspondência nominal confirmada e sem cobrança na revisão/Chefe proposto. Não é necessária uma decisão sobre ele para revisar o conjunto comum; sua eventual inclusão requer confirmar escopo e profundidade. A autoria introdutória não encerra cobertura integral de cada produto, legislação ou edital.

IDs são editoriais `draft.pc*`; `publication.status` continua `draft`. Sem XP, ordem ou importação no manifesto. Nenhuma mudança em frontend, Worker, autorização exclusiva de `wellyton`, tabelas ou progresso. Não consultar D1/produção para validar conteúdo.

## Verificação e revisão

As versões `.md` são geradas dos `.mjs`, preservando uma fonte editorial. Verificação direcionada: esquema, gabaritos indexados, quatro justificativas por questão, objetivos, recuperação, cálculos novos, UTF-8, links/âncoras e exclusão efetiva do catálogo. Resultado executado em 30/09/2026 com Node 24.17.0: dez unidades novas aprovadas no validador, 31 verificações aritméticas e 399 verificações de links locais (incluem referências repetidas entre documentos). As 25 origens de PC-R existem; 132 enunciados do pacote são distintos por comparação textual. Catálogo publicado permaneceu idêntico e os dez drafts foram efetivamente excluídos pelo filtro existente. Sintaxe do validador e `git diff --check` aprovados. Não foram repetidos testes do aplicativo, cálculos antigos ou revisão de conteúdo já aprovada.

Comando reproduzível por unidade: `node docs/missao-bancaria/rascunhos/validate-mp01.mjs --unit=pc06` (também `pc08`, `pc09`, `pc10`, `pc11a`, `pc11b`, `pc11c`, `pc11d`, `pc11e`, `pcr`). O render inicial exigiu gerar todas as prévias antes da verificação cruzada de links; a passagem final sem `--render` aprovou as dez unidades. Evidência detalhada local: `../pc-remaining-validation.json`; os números e limites são preservados aqui no repositório.

PC-01A/01–03 tiveram revisão independente de conteúdo em `87776733f14776784a286033684acfcb44e50949`; as duas precisões de PC-01A foram aplicadas nos dois formatos em `4c5c2172`. PC-04/05 e o lote PC-06/08–10/11A–E/PC-R receberam parecer independente agrupado encaminhado pelo pai em 30/09/2026: sem outros bloqueios além de PC-11B q03. Correção aplicada nos dois formatos, mantendo D: “O fim dos pagamentos não determina, por si só, o fim da vigência; o resgate depende das condições.” Justificativas passaram a explicitar a falta de calendário; apenas essa questão mudou na aula. Parecer limitado a conteúdo e conferências pontuais de fontes, sem auditoria integral, validação de aplicativo ou aceite humano de fase.

Próxima etapa: revisão independente somente dos [12 itens do Chefe](78-PC-REVISAO-E-PROPOSTA-CHEFE.md), sem reabrir aulas aprovadas e inalteradas. Fase 2 permanece sem aceite humano observado; Fase 3 não foi formalmente aberta.
