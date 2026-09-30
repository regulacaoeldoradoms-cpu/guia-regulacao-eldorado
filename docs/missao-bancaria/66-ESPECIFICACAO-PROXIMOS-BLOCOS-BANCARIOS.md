# MISSÃO BANCÁRIA - ESPECIFICAÇÃO DOS PRÓXIMOS BLOCOS BANCÁRIOS

Data: 30/09/2026. Base de código inspecionada: `81f89b9e`.

**Estado: preparação documental autorizada, etapa A de autoria em elaboração.** A Fase 2 permanece ativa e sem aceite de encerramento. Esta especificação não abre a Fase 3, não cria missões no catálogo nem muda disponibilidade, progresso, XP, avaliações ou prontidão. Os exemplos abaixo são propostas de casos didáticos, ainda sem textos, números, gabaritos ou validação final.

## 1. Recorte e resultado esperado

Preparar dois blocos já existentes em [curriculum-v1.js](../../worker/studies-content/curriculum-v1.js), dentro da área `banking`:

| Ordem de preparação | ID existente | Título no mapa | Estado verificado no código |
| --- | --- | --- | --- |
| 1 | `banking.markets-policy` | Mercados, moeda, política monetária, juros e dívida pública | `missionIds: []`; sem missão publicada |
| 2 | `banking.products-credit` | Produtos bancários, crédito, contas e garantias | `missionIds: []`; sem missão publicada |

Os dois estão associados a `bb.agente-comercial.2022-001` e `caixa.tbn.2024-nm`. Essa associação ampla não comprova que cada conteúdo seja exigido pelos dois perfis. Ambos continuam `referenceOnly: true`: são editais-base históricos, sujeitos à escolha e conferência do escopo a adotar.

O resultado desta preparação é uma sequência revisável de competências, fontes e unidades de ensino. A conclusão de qualquer bloco exigirá rastreabilidade de todos os itens efetivamente adotados para cada perfil. A lista de aulas proposta aqui pode ser subdividida ou ampliada nessa conferência; não é uma declaração de cobertura completa de edital.

Aplicam-se o [Dossiê Mestre](00-DOSSIE-MESTRE.md), a [continuidade](11-INSTRUCAO-DE-CONTINUIDADE.md), o [contrato pedagógico](24-CONTRATO-PEDAGOGICO-GLOBAL.md), as [etapas A-F](26-PRODUCAO-PEDAGOGICA-EM-ETAPAS.md), o [plano da Fase 3](04-FASE-3-MUNDO-BANCARIOS.md) e a [rubrica de conclusão](63-CONTINUIDADE-E-CRITERIOS-DE-CONCLUSAO.md). A menção histórica do documento 04 a edital vigente não muda o caráter de referência dos perfis atuais.

## 2. Rastreabilidade e fronteiras de conteúdo

Cada competência abaixo usa uma chave editorial local, `MP-01` ou `PC-01`, por exemplo. São chaves deste planejamento; não são `missionId`, `topicId`, `questionId` ou `competencyId` adicionados ao runtime. Os IDs definitivos deverão ser fixados antes da primeira integração, sem reutilizar ou renomear os IDs publicados do SFN.

Para cada perfil, preencher uma linha independente na [matriz de rastreabilidade dos editais](65-RASTREABILIDADE-BANCARIOS-REFERENCIAS.md), ligando:

`perfil + versão + fonte/página + item/subitem → bloco → chave editorial → aula/trecho → exemplo → prática → avaliação → revisão`

Reutilizar uma aula entre BB e CAIXA somente quando conteúdo, profundidade e versão forem compatíveis. Uma associação ainda não conferida deve constar como pendente; ausência de confirmação não significa exclusão do edital. Quando o assunto for apenas apoio necessário ao iniciante, identificá-lo como pré-requisito didático, sem contá-lo automaticamente como item coberto.

O rastreio documental paralelo do documento 65 identificou os conjuntos abaixo para orientar a distribuição por objetivo. As associações são propostas editoriais; nenhum desses itens passa a estar coberto por esta especificação.

| Perfil histórico e localização | `banking.markets-policy` | `banking.products-credit` |
| --- | --- | --- |
| BB 2022/001, Anexo III, Agente Comercial, página 34 | Itens 2, 3, 4, 12 e 14 | Itens 5, 13 e 15; item 13 requer vínculo também com tesouraria/varejo em MP-08 |
| CAIXA 2024/NM, Anexo IV, TBN, páginas 33–34 | Itens 3, 16, 17, 18 e 26; item impresso **278**, na posição 28 | Itens 19, 27, 29, 36 e 37 |

Na CAIXA, preservar o rótulo impresso `278` e a posição 28 em campos distintos, como registrado pela conferência visual do documento 65. Não corrigir silenciosamente a numeração da fonte. O item 19 reúne produtos e temas de programas/benefícios: sua associação a este bloco não absorve a parte de `banking.institution-specific`. Cada parte precisa de vínculo próprio. Os textos e as particularidades de versão permanecem no documento 65; o detalhamento de cada objetivo de aula será conferido contra aquelas linhas antes de encerrar a etapa A.

Distribuição inicial para revisão de autoria:

| Unidades propostas | BB histórico | CAIXA histórica | Limite da associação |
| --- | --- | --- | --- |
| MP-01 | Item 2 | Item 3 | Classificação inicial dos mercados; profundidade de capitais/câmbio permanece em bloco próprio |
| MP-02 a MP-06 | Item 3 | Itens 16 e 17 | Decompor moeda, política convencional/não convencional e instrumentos; o debate sobre depósitos remunerados precisa de contexto datado |
| MP-07 | Item 4 | Item 18 | Orçamento, títulos e dívida; não substituir ensino fiscal por descrição de produto de investimento |
| MP-08 | Itens 12 e parte de 13 | Itens 26 e parte de 27 | Distinguir operações interbancárias de tesouraria/varejo; recuperação de crédito liga-se a PC-10 |
| MP-03 e MP-09 | Item 14, além da base didática para o item 3 | Item impresso 278, posição 28, além da base para 16/17 | Juros nominais/reais e estrutura a termo: conferir a profundidade antes das questões |
| PC-01A e PC-01 | Apoio didático a confirmar; sem correspondência nominal atribuída nesta entrega | Itens 36 e 37 | Contas e documentos; pessoas, capacidade, representação e domicílio exigem ensino e fontes legais próprios |
| PC-02 a PC-06 e PC-11 | Desdobramento do item 5, conforme cada produto | Desdobramento da parte de produtos do item 19 | Validar produto por produto; CET e vocabulário podem ser apoio, sem atribuir subitem inexistente |
| PC-08 e PC-09 | Item 15 | Item 29 | Separar cada garantia exigida e a profundidade legal aplicável |
| PC-10 | Parte do item 13 | Parte do item 27 | Recuperação de crédito não deve ser confundida com diagnóstico pedagógico do aluno |
| PC-07 | Correspondência não confirmada | Correspondência não confirmada nesta entrega | Crédito habitacional fica como candidato complementar ou institucional, dependendo de fonte e escopo adotado; não contar como exigência nominal já verificada |

| Fronteira | Tratamento proposto |
| --- | --- |
| `banking.sfn-foundation` | Reutilizar as aulas de instituições e supervisores como pré-requisito; verificar suficiência didática, sem exigir refazê-las nem alterar conclusão |
| `banking.capital-exchange` | Nos dois novos blocos, apresentar somente as distinções necessárias; investimentos, instrumentos de capitais e câmbio em profundidade permanecem vinculados ao bloco próprio |
| `banking.digital-payments` | Contas e cartões podem mencionar meios de pagamento já ensinados; funcionamento detalhado de Pix, arranjos e modelos digitais exige rastreio no bloco próprio |
| `banking.institution-specific` | Programas e atribuições específicos da CAIXA precisam de trilha identificada por perfil; não torná-los conteúdo comum por associação ao mundo bancário |
| `financial-math.*` | Explicações iniciais devem ensinar o vocabulário e a leitura das taxas necessárias. Fórmulas, equivalência, capitalização e amortização dependem de ensino correspondente; os blocos de matemática ainda planejados não podem ser pré-requisitos supostamente disponíveis |
| `sales-service.*` e `ethics-compliance.*` | Relacionamento com cliente, proteção de dados, prevenção a ilícitos e normas de atendimento terão vínculos próprios quando exigidos; uma menção em crédito não cobre essas disciplinas |

Essas fronteiras organizam a autoria; não retiram assuntos do escopo. Qualquer item oficial que atravesse blocos precisa manter todos os vínculos na matriz, sem duplicar sua contagem como cobertura.

## 3. Preparação do iniciante e pré-requisitos existentes

O [manifesto](../../worker/studies-content/manifest.js) compõe oito aulas e um Chefe de SFN. Foram conferidos os seguintes IDs e trechos disponíveis no catálogo, úteis à autoria:

| Conhecimento a recuperar | Aula e trechos existentes | Checagem antes de usar como pré-requisito |
| --- | --- | --- |
| Quem fornece, intermedeia e utiliza recursos | `banking.sfn.introducao`: `vocabulario`, `intermediacao`, `juros` | O aluno consegue explicar os papéis sem decorar apenas siglas? |
| Diferença entre orientação e execução | `banking.sfn.cmn`: `papel`, `diferencas`; `banking.sfn.bacen`: `politicas`, `banco-dos-bancos`, `circulante` | A retomada sustenta a nova explicação ou precisa de complemento dentro da unidade? |
| Selic e decisão de política | `banking.sfn.copom`: `juros`, `selic`, `meta`, `relacao` | Separar as dúvidas já ensinadas da profundidade nova de mecanismos e transmissão |
| Instituições, depósitos e carteiras | `banking.sfn.operadores`: `papel`, `deposito`, `carteira`; `banking.sfn.cvm`: `mercado`, `comparacao` | Instituição, mercado, conta e produto devem aparecer como conceitos distintos |
| Fronteiras com outros produtos | `banking.sfn.seguros-previdencia`: `seguro`, `previdencia-aberta`, `capitalizacao`; `banking.sfn.pagamentos-consorcios`: `arranjo`, `instituicao`, `consorcio` | A aula atual apresenta a categoria, mas não certifica domínio das regras de cada produto |

A presença desses trechos foi verificada por importação do catálogo; sua suficiência como pré-requisito continua sujeita à revisão de ensino. O Chefe de SFN não substitui essa revisão.

Cada unidade nova deve começar por uma retomada curta em linguagem comum, expandir siglas na primeira ocorrência e explicar termos antes dos exemplos. Valores, percentuais, período de uma taxa, saldo e fluxo precisam de exemplos resolvidos quando forem necessários. Se a base faltar, preparar uma seção de apoio ou uma unidade anterior completa. Não bloquear estudo por cronômetro, quantidade de cliques ou nota de uma sondagem inicial.

## 4. Bloco `banking.markets-policy`

### 4.1 Competências e sequência proposta

Pré-requisitos gerais: introdução ao SFN, papéis de CMN/BCB/Copom e operadores. A ordem abaixo é uma proposta de autoria. Relações de dependência devem ser satisfeitas antes da cobrança; não criam agora novos gates de acesso.

| Chave / unidade proposta | Pré-requisito específico | Objetivo observável após o ensino | Exemplo a desenvolver e verificação posterior |
| --- | --- | --- | --- |
| MP-01 - O que acontece em cada mercado | Introdução: intermediação; operadores; visão inicial da CVM | Classificar uma operação pelo problema econômico e pelos participantes, justificando a diferença entre mercado monetário, de crédito, de capitais e cambial | Caso didático com quatro necessidades distintas; primeiro resolver a classificação de uma delas. Na prática, mudar participantes e finalidade, pedindo justificar por que outra classificação não serve |
| MP-02 - Moeda, pagamentos e liquidez | MP-01; introdução: vocabulário; BCB: circulante | Explicar as funções da moeda e distinguir meio de pagamento, recursos disponíveis e necessidade de liquidez em situações apresentadas | Acompanhar uma compra e uma obrigação com datas diferentes. Explicar os termos antes de perguntar; não introduzir multiplicador ou agregados monetários sem previsão confirmada e ensino adicional |
| MP-03 - Preços, inflação e leitura de juros | MP-02; apoio de porcentagem e período da taxa a preparar | Distinguir mudança de um preço, variação de um conjunto de preços e poder de compra; interpretar taxa nominal e taxa real no nível definido pelo perfil | Cesta didática com dados inventados identificados e comparação temporal. Se houver cálculo de taxa real, explicar fórmula, hipóteses e aproximação antes; um novo conjunto de dados compõe a prática |
| MP-04 - Objetivos, instrumentos e transmissão monetária | MP-02/03; CMN, BCB e Copom | Descrever uma cadeia de efeitos possível de uma decisão monetária e distinguir objetivo, instrumento e resultado observado | Diagrama comentado de uma decisão, seus canais e fatores que podem alterar o resultado. Na prática, reconhecer inferências excessivas; não prometer efeito imediato ou inevitável |
| MP-05 - Operações e instrumentos convencionais | MP-04; vocabulário de título, prazo e liquidez a ensinar | Comparar operações definidas no escopo adotado por finalidade, participantes, prazo e efeito no cenário dado | Fluxo didático de recursos e títulos em operações distintas, com retorno no prazo quando pertinente. Confirmar previamente compromissadas, compulsórios, redesconto e respectivos limites; criar unidades menores se a leitura exigir |
| MP-06 - Instrumentos não convencionais e temas datados | MP-04/05 | Distinguir os instrumentos efetivamente exigidos e explicar o contexto indicado na fonte, separando regra, hipótese e debate histórico | Comparação entre dois cenários expressamente datados. Incluir quantitative easing e depósitos remunerados somente após vincular cada tema ao item correto e verificar fontes específicas; nenhuma equivalência é presumida |
| MP-07 - Orçamento, dívida pública e títulos | MP-01/03; noção de título ensinada em MP-05 | Distinguir orçamento, financiamento da dívida, emissão e negociação de título; identificar o papel de cada instituição nos cenários | Fluxo resolvido de necessidade de financiamento e outro de negociação posterior. As características e nomes dos títulos serão conferidos; precificação detalhada permanece em matemática/investimentos |
| MP-08 - Mercado interbancário, tesouraria e varejo | MP-01/02/05 | Comparar uma necessidade de liquidez de instituição com uma operação de cliente e identificar fluxos e participantes | Dois diagramas com valores didáticos: ajuste entre instituições e operação de varejo. Pergunta nova altera o contexto e pede localizar a diferença, sem reduzir todo banco a uma única função |
| MP-09 - Prazos e curva de juros | MP-03/07; leitura de gráfico a preparar | Ler eixos, unidades e vencimentos de uma curva; distinguir taxa de prazo específico de uma afirmação sobre todos os prazos | Gráfico inteiramente didático, sem previsão de mercado. Resolver a leitura de dois pontos e depois perguntar sobre outro gráfico; fontes e profundidade de estrutura a termo ainda pendentes |
| MP-R - Revisão cumulativa do bloco | Apenas unidades anteriores efetivamente ensinadas e liberadas | Explicar erros de classificação e conectar mercados, instrumentos e dívida em caso novo | Roteiro de consulta às aulas de origem, caso resolvido e prática cumulativa. Chefe e avaliação independente são entregas distintas, a especificar depois do ensino; não reaproveitar exemplos como itens inéditos |

As correspondências iniciais de MP-06, MP-08 e MP-09 estão registradas acima; falta decompor cada objetivo e conferir suas fontes de ensino. Nenhuma dessas unidades pode ser omitida apenas por ser mais complexa ou considerada coberta por uma introdução. A adoção futura de outro perfil exige novo rastreio.

### 4.2 Critérios de revisão específicos

- Cada definição precisa de contraste compreensível: mercado/instituição/produto; moeda/pagamento; objetivo/instrumento; estoque/fluxo; emissão/negociação.
- A revisão factual deve conferir, em fontes oficiais, a distinção entre a decisão sobre a meta de juros, sua operacionalização e taxas observadas. Taxas atuais, metas numéricas e composição institucional não serão preenchidas por memória.
- Exemplos de transmissão devem explicitar hipóteses e limites. Um resultado de cenário não pode virar previsão universal para inflação, crédito, câmbio ou atividade.
- Política monetária, política fiscal e gestão da dívida devem ter papéis diferenciados. A revisão deve conferir regras e exceções antes de usar frases absolutas sobre operações entre Tesouro e BCB.
- Operações, títulos, nomes e instrumentos sujeitos a atualização exigem data de referência. Cenários históricos devem informar o período, sem apresentar aquele regime como vigente.
- Na recuperação do erro, indicar a distinção conceitual e o trecho exato a reler. Não premiar somente reconhecimento da sigla ou memorização da posição da alternativa.

## 5. Bloco `banking.products-credit`

### 5.1 Competências e sequência proposta

Pré-requisitos gerais: intermediação, instituições e depósitos; MP-01 e o vocabulário de taxas necessário ao recorte. A preparação de PC-01/02 pode avançar junto à pesquisa de mercados, sem supor que os dois blocos precisem ser publicados de uma só vez.

| Chave / unidade proposta | Pré-requisito específico | Objetivo observável após o ensino | Exemplo a desenvolver e verificação posterior |
| --- | --- | --- | --- |
| PC-01A - Pessoas, capacidade e representação | Vocabulário de pessoa, documento e relação contratual a preparar | Distinguir pessoa física/jurídica e identificar, em caso didático, os elementos de capacidade, representação e domicílio relevantes ao recorte | Casos separados, com nomes inventados e sem documentos pessoais. Explicar os termos antes de apresentar documentos simulados; regras e exceções legais precisam de fonte própria. Unidade vinculada ao item 37 da CAIXA, sem associação nominal presumida ao BB |
| PC-01 - Conta, saldo e serviços | Introdução e operadores: depósito; PC-01A quando o caso exigir | Distinguir o tipo de conta, seus usos e o serviço descrito em um caso; separar saldo próprio de limite de crédito e reconhecer informações documentais necessárias | Extrato inteiramente fictício, sem CPF, número de conta ou dado real. Primeiro explicar entradas, saídas e saldo; depois classificar novas movimentações. Abertura, movimentação, tipos de conta e documentos exigem fonte atual conferida |
| PC-02 - Crédito, empréstimo e financiamento | PC-01; vocabulário de valor, prazo, juros e obrigação a ensinar | Identificar partes, finalidade, recursos recebidos e obrigações; comparar modalidades a partir de características explicitadas | Uma necessidade de compra e uma de recursos sem destinação específica, com condições didáticas. Explicar a análise antes de pedir comparação; não recomendar contratação ao usuário |
| PC-03 - Cartões e limites de crédito | PC-01/02 | Interpretar instrumento de pagamento, fatura, vencimento e uso de crédito no cenário apresentado | Fatura didática com datas e alternativas de pagamento. Desdobrar cartão e cheque especial em aulas separadas se necessário; limites de juros, prazos e regras atuais ficam pendentes de verificação normativa |
| PC-04 - Custo e condições da operação | PC-02/03; leitura de taxas e períodos | Ler propostas comparáveis, reconhecer informações relevantes para o custo e explicar por que prestação ou taxa anunciada isolada é insuficiente | Duas propostas fictícias com mesmo valor e prazo, encargos identificados e CET informado. Revisar os números e a coerência antes de publicar; cálculo completo de CET exige ensino matemático próprio |
| PC-05 - Crédito comercial e ao consumidor | PC-02/04 | Relacionar a necessidade descrita à finalidade e às características das modalidades adotadas no perfil, justificando a comparação | Dois casos separados: necessidade comercial e aquisição para consumo. Conferir vocabulário, modalidades e limites; separar unidades quando o conjunto de pré-requisitos aumentar |
| PC-06 - Crédito rural | PC-02/04; finalidade de financiamento | Distinguir finalidades e participantes previstos no recorte confirmado, usando os elementos do caso | Situação didática de uma atividade rural, com todas as informações necessárias. Beneficiários, fontes, exigências, programas, taxas e calendário demandam consulta ao material oficial aplicável |
| PC-07 - Crédito habitacional, candidato condicionado | PC-02/04; noção de garantia a introduzir ou recuperar de PC-08/09 | Se incluído no escopo ou como complemento identificado, comparar características e condições do financiamento de moradia | Caso fictício com finalidade, valor e prazo; regras de sistemas, fundos e programas só entram após conferência. Questões que dependam de garantias ficam depois do ensino de PC-08/09. Não tratado como exigência nominal confirmada nesta preparação |
| PC-08 - Garantias pessoais | PC-02; obrigação principal e partes a ensinar | Identificar quem assume a obrigação no caso e distinguir as garantias pessoais expressamente previstas no edital | Dois instrumentos simplificados e comentados. Aval, fiança e fiança bancária exigem fontes legais próprias; não transformar a comparação em aconselhamento jurídico ou omitir condições relevantes |
| PC-09 - Garantias reais | PC-02; bens, propriedade e posse a explicar | Reconhecer o papel do bem e comparar garantias reais segundo características verificadas | Casos distintos para cada garantia confirmada, como penhor, hipoteca ou alienação fiduciária. Ensinar vocabulário jurídico e condições antes da cobrança; consequências e execução dependem de revisão legal específica |
| PC-10 - Acompanhamento e recuperação de crédito | PC-02/04/08/09 | Distinguir concessão, acompanhamento, atraso e recuperação em um fluxo didático, indicando quais informações faltam para a análise | Linha do tempo de uma operação com um evento de atraso e opções descritas no caso. Não ensinar cobrança, classificação de risco ou regras de renegociação com base apenas em senso comum |
| PC-11 - Outros produtos e suas fronteiras | Aulas SFN de seguros/previdência e pagamentos/consórcios | Comparar finalidade, funcionamento básico, custos e riscos dos produtos confirmados sem tratar categorias distintas como equivalentes | Desdobrar por produto: poupança; capitalização; previdência; seguros; consórcio. Cada produto precisa de aula, exemplo e fonte próprios quando exigidos. Investimentos detalhados ligam-se a `banking.capital-exchange`; exposição institucional no SFN não encerra o estudo do produto |
| PC-R - Revisão cumulativa do bloco | Somente unidades ensinadas e disponíveis | Explicar uma comparação de produtos/garantias e localizar a origem de um erro recorrente | Casos inéditos de aplicação, com trecho de recuperação por conceito. O conjunto de casos não substitui simulado representativo nem concede diagnóstico de prontidão |

PC-05/06/11 precisam da decomposição por produto dos itens já identificados; PC-10 tem correspondência em ambos os perfis. PC-01A/01 têm vínculo expresso aos itens 36/37 da CAIXA; para BB, seu papel de apoio deve ser identificado. CET exige enquadramento próprio, e PC-07 permanece candidato sem correspondência nominal confirmada. O registro de rastreabilidade deve impedir que tópicos específicos de uma instituição sejam cobrados como obrigatórios para a outra.

### 5.2 Critérios de revisão específicos

- Ensinar primeiro quem participa, o que é contratado, quando os recursos circulam e quais obrigações surgem. Somente depois comparar nomes de produtos.
- Explicar siglas e termos jurídicos usados nos enunciados. A ausência de conhecimento jurídico prévio não pode ser tratada como erro de conteúdo já ensinado.
- Em comparações de custos, manter valores, períodos e condições comparáveis e verificar cálculos. Dados inventados são exemplos, não taxas disponíveis no mercado nem condições de produto de BB/CAIXA.
- Distinguir material educacional de norma aplicável. Regras sobre crédito, garantias, tarifas, taxas, tributos, benefícios e programas exigem fonte, versão e data, inclusive eventual transição ou exceção relevante.
- Reaproveitar ensino do SFN por vínculo, sem supor que identificar o supervisor ensine todas as regras de um produto. A alternativa errada deve receber explicação de por que falha naquele caso.
- Produzir recuperação por distinção conceitual planejada; o contador atual de erros por questão não será apresentado como novo diagnóstico por conceito já implementado.

## 6. Fontes: conferência preliminar e pendências

Consulta realizada em 30/09/2026. Este registro indica o que foi acessado na preparação; não certifica revisão factual das futuras aulas. O snapshot anterior permanece em [16-FONTES-SFN-V1.md](16-FONTES-SFN-V1.md). Editais e alterações pertencem ao rastreio separado por perfil no documento 65.

| Fonte oficial | Estado da consulta nesta preparação | Uso proposto e limite |
| --- | --- | --- |
| [BCB - Caderno de Educação Financeira](https://www.bcb.gov.br/content/cidadaniafinanceira/documentos_cidadania/Cuidando_do_seu_dinheiro_Gestao_de_Financas_Pessoais/caderno_cidadania_financeira.pdf) | PDF acessível: versão 2026, 2ª edição revisada, 98 páginas. Identificados módulo 3, crédito e dívidas, e trecho sobre CET na página impressa 37 | Insumo de linguagem inicial para PC-02/04; redigir casos originais. A publicação educacional não substitui norma, edital nem revisão de cálculos. O endereço legado do Caderno contém somente aviso de mudança de URL |
| [BCB - Controle da inflação](https://www.bcb.gov.br/controleinflacao) e [transmissão monetária](https://www.bcb.gov.br/controleinflacao/transmissaopoliticamonetaria) | Ferramenta retornou apenas aviso de dependência de JavaScript; conteúdo não conferido | Fontes candidatas de MP-03/04. Obter conteúdo oficial legível e localizar os trechos antes da redação factual |
| [BCB - Tipos de empréstimo](https://www.bcb.gov.br/cidadaniafinanceira/tiposemprestimo) | Ferramenta retornou apenas aviso de JavaScript; conteúdo não conferido | Fonte candidata para modalidades, a validar; não usada como prova de regra vigente |
| [Tesouro Nacional - Sobre a Dívida Pública](https://www.gov.br/tesouronacional/pt-br/divida-publica-federal/sobre-a-divida-publica) | Página legível; alteração indicada em 26/10/2020 | Ponto de entrada para MP-07; completar fontes de conceitos e legislação antes de elaborar a aula |
| [Tesouro Nacional - Títulos da Dívida Interna](https://www.gov.br/tesouronacional/pt-br/divida-publica-federal/mercado-interno/titulos-da-divida-interna) | Página legível; alteração indicada em 15/03/2023; referências a instrumentos e legislação identificadas | Inventário inicial de fontes para MP-07; conferir texto normativo e características atuais. Não extrair automaticamente valores de tabela como regras atuais |
| [Tesouro Nacional - Gestão da Dívida](https://www.gov.br/tesouronacional/pt-br/perguntas-frequentes/divida-publica/gestao-da-divida) | Página legível; alteração indicada em 18/06/2020; contém exemplos históricos e nomenclaturas datadas | Apoio para distinguir funções institucionais; conferir vigência e contexto das referências. Não transpor trechos antigos para a aula como cenário presente |

Pendências que impedem tratar as unidades como material pronto:

1. Fechar os itens/subitens e a versão de referência de cada perfil, com as retificações aplicáveis.
2. Obter fontes oficiais legíveis de mercados, moeda, inflação, instrumentos, transmissão, mercado interbancário e curva de juros, com localização dos trechos utilizados. MP-06 exige fontes adicionais e contexto histórico.
3. Localizar e revisar normas vigentes e, quando necessário, normas históricas do período do edital sobre contas, crédito, cartões, custos, garantias e recuperação. Registrar divergências entre referência histórica e regra atual, sem atualização silenciosa do enunciado.
4. Conferir fontes específicas de crédito rural/habitacional e de cada produto de PC-11; definir o vínculo com outros blocos e com o perfil da CAIXA quando aplicável.
5. Preparar o vocabulário matemático/jurídico que ainda não estiver ensinado e testar a clareza das explicações com leitura humana.

Não foram produzidos textos de aula, gabaritos ou afirmações sobre taxas atuais nesta preparação. A pesquisa não usa notícias como substitutas de fonte normativa, nem questões de bancos pagos como material autoral.

## 7. Autoria A-F por unidade

| Etapa | Entrega verificável | Estado nesta especificação |
| --- | --- | --- |
| A - Delimitar | Linha de edital por perfil; competência; pré-requisitos; vocabulário; fontes/versões e pendências; proposta de IDs antes da integração | Iniciada: blocos e sequência identificados; matriz e revisão completa de fontes ainda pendentes |
| B - Explicar | Texto original por leitura, desenvolvido para iniciante; definições, funcionamento, diferenças e limites | Não iniciada |
| C - Demonstrar | Exemplo resolvido com cada passo explicado; dados identificados como didáticos; trecho de consulta depois da explicação | Casos planejados nas tabelas; exemplos não redigidos ou validados |
| D - Revisar ensino | Conferência factual/normativa e de cálculos; leitura crítica de clareza; pendências classificadas e resolvidas | Não iniciada; consulta preliminar de fontes não equivale à etapa D |
| E - Verificar compreensão | Recordação ativa; minibatalha e aplicação com justificativas; vínculo de cada item ao trecho ensinado; material de recuperação; separação entre prática e avaliação independente | Objetivos de verificação planejados; nenhum item pronto |
| F - Integrar unidade completa | IDs estáveis, fontes, versão, metadados de publicação; validação do catálogo e preservação; teste da UI; publicação e revisão humana registradas quando autorizadas | Fora desta entrega; depende dos critérios e da decisão de fase/publicação |

A autoria pode ocupar várias rodadas por unidade. A quantidade de aulas, exemplos e perguntas será suficiente para ensinar e verificar cada objetivo; não será reduzida para caber em um único prompt nem ampliada apenas para atingir contagens.

Para cada competência, planejar ao menos um exemplo resolvido, uma recuperação em palavras próprias e uma aplicação com contexto diferente. A prática precisa explicar a resposta correta e os erros plausíveis, com referência exata ao ensino. Se a pergunta depender de conhecimento ausente, corrigir a aula ou o pré-requisito antes de liberar o item.

Itens destinados a avaliação independente devem ter IDs e controle editorial de exposição separados dos exemplos e da prática. Quantidade de formas, reaplicação e agendamento dependem da decisão registrada no documento 63; esta especificação não amplia A/B nem afirma que novos itens já são inéditos para o aluno.

## 8. Critérios anteriores a qualquer publicação

Uma unidade candidata só pode ser apresentada como pronta para integração quando:

1. Cada objetivo cobrado tem cadeia de ensino, exemplo, prática, correção e revisão, e vínculo confirmado no perfil pertinente ou indicação de apoio didático.
2. Todos os termos, siglas, operações e pré-requisitos usados nas perguntas foram ensinados em material acessível; não há dependência oculta de um bloco apenas planejado.
3. As fontes de cada afirmação factual/normativa têm URL, versão, data da conferência e localização; pendências que possam mudar resposta ou interpretação foram resolvidas. Conteúdo histórico está identificado.
4. Exemplos e alternativas passaram por revisão de precisão, cálculos e ambiguidade. O gabarito não introduz o primeiro ensino do conceito.
5. O revisor consegue explicar a solução apenas com a aula e os pré-requisitos indicados. Clareza humana registrada permanece distinta da validação automatizada de estrutura.
6. O material contém orientação de recuperação e plano de revisão; concluir ciclos não é usado como prova de domínio, de espaçamento real ou de prontidão.

Na etapa F, aplicar ainda o contrato do manifesto: ensino com explicação, exemplo resolvido, glossário e resumo; fontes existentes; `teaching.questionCoverage` sem referência quebrada ou pré-requisito futuro; requisitos específicos de Chefe quando houver. A publicação incremental deve rejeitar metadados inválidos, excluir material em elaboração e preservar IDs, conclusões, tentativas, XP, conquistas e avaliações.

Antes de pedir homologação, testar o commit final e os fluxos aplicáveis de leitura, prática, retomada, revisões, rede, repetição e atualização, além da exclusividade de `wellyton` e isolamento institucional. Os testes de UI sintéticos continuam distintos de validação com API real e da versão efetivamente publicada. Integração e publicação devem seguir as decisões e gates já registrados; este documento não concede autorização adicional.

## 9. Próxima ação concreta e registro de estado

Próximo recorte independente seguro: concluir a etapa A de **MP-01**, **PC-01A** e **PC-01**, ligando cada objetivo à matriz do documento 65, verificando as fontes ainda pendentes e avaliando os trechos SFN indicados. Produzir uma lista de vocabulário e um roteiro de explicação antes de escrever questões. MP-02 e PC-02 seguem depois da revisão desses pré-requisitos.

Quando houver decisão sobre o perfil adotado, ajustar a sequência pelo escopo comprovado e registrar as diferenças de BB/CAIXA. A autorização para abrir a Fase 3, publicar unidades, mudar a política de revisão ou expandir o protocolo de avaliações deve permanecer explícita; não é consequência automática deste planejamento.

**Conteúdo:** duas especificações iniciais de blocos existentes; nenhuma nova aula ou questão publicada, nenhuma porcentagem de edital/produto calculada.

**Funcionalidade:** runtime, catálogo, permissões, banco e dados pessoais sem alteração por esta entrega documental.

**Validação:** IDs de blocos, associação a perfis e trechos de pré-requisito conferidos no catálogo; fontes consultadas e limites listados. Revisão factual das aulas, testes de implementação, publicação, homologação humana e aceite de fase continuam pendentes e não são reivindicados por este documento.
