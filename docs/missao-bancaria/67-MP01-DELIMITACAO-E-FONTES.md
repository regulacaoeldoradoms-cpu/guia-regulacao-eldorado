# MISSÃO BANCÁRIA - MP-01 - DELIMITAÇÃO E FONTES

Data de preparação e consulta: **30/09/2026**. Incorporação documental da nota de preparo MP-01, previamente revisada. Referência de planejamento: PR #559, commit `38a134dc`, documentos [65](65-RASTREABILIDADE-BANCARIOS-REFERENCIAS.md) e [66](66-ESPECIFICACAO-PROXIMOS-BLOCOS-BANCARIOS.md); catálogo referenciado por esses documentos: `81f89b9eeb19dc84b77d77152f8e9fc663967585`.

**Estado: proposta da etapa A; não é aula nem entrega estudável.** A Fase 2 permanece ativa, com seu aceite separado desta preparação. Esta entrega não abre a Fase 3, não registra publicação e não altera runtime, IDs, permissões, progresso, tentativas, XP ou prontidão. O público permanece exclusivamente a conta `wellyton`.

Aplicam-se o [Contrato Pedagógico Global](24-CONTRATO-PEDAGOGICO-GLOBAL.md), as [etapas A-F de autoria](26-PRODUCAO-PEDAGOGICA-EM-ETAPAS.md) e os [critérios de continuidade e conclusão](63-CONTINUIDADE-E-CRITERIOS-DE-CONCLUSAO.md). Esta delimitação mantém separado o planejamento da produção, da publicação e do aprendizado do aluno.

## 1. Identidade e recorte

- Chave editorial: `MP-01`, “O que acontece em cada mercado”. Não é ID de runtime.
- Bloco candidato existente: `banking.markets-policy`, atualmente sem missões.
- Objetivo central proposto: **distinguir os mercados monetário, de crédito, de capitais e de câmbio em situações introdutórias, justificando a classificação pela finalidade da operação, pelo objeto e pelos papéis dos participantes**.
- A classificação será uma ferramenta de comparação. O ensino precisará explicar seus limites e a conexão entre os segmentos, antes de exigir uma resposta única em qualquer caso.

| Perfil histórico | Referência de escopo | Ligação proposta |
| --- | --- | --- |
| `bb.agente-comercial.2022-001` | [Edital BB 2022/001, Anexo III, Agente Comercial, p. 34, item 2](https://www.bb.com.br/docs/portal/dipes/EditalSelExtern2022001.pdf#page=34) | Segmentos monetário, de crédito, de capitais e cambial → MP-01 |
| `caixa.tbn.2024-nm` | [Edital CAIXA 2024/NM, Anexo IV, TBN, p. 33, item 3](https://www.caixa.gov.br/Downloads/concurso-publico-editais/EDITAL_N_01_2024_NM_DE_22_DE_FEVEREIRO_DE_2024_.pdf#page=33) | Mesmos quatro segmentos → MP-01, com linha de rastreio própria |

Os itens oficiais não têm subitens decimais nesse trecho. A verificação dos editais, versões e particularidades da fonte é a já registrada no documento 65 em 30/09/2026; esta nota não a apresenta como nova auditoria integral dos PDFs. Ambos os perfis continuam `referenceOnly: true`. Preparar MP-01 não cobre integralmente esses itens, o bloco, a disciplina ou um edital futuro.

O escopo é uma primeira comparação compreensível para iniciante. Produtos e garantias, instrumentos monetários, dívida pública, modalidades cambiais, operações de capitais e normas de autorização exigem os recortes posteriores indicados no documento 66. Uma necessidade de aprofundamento identificada na autoria não deverá ser omitida para fazer a unidade caber em determinado tamanho.

## 2. Objetivos observáveis para a futura autoria

As chaves abaixo servem somente à revisão desta nota. Não criam competências, questões ou métricas no aplicativo.

| Chave local | Resultado a ensinar antes de verificar | Evidência futura esperada, ainda sem questão redigida |
| --- | --- | --- |
| O1 | Separar mercado, instituição, operação e instrumento/produto | Explicação em palavras próprias que não trate o nome de um banco como nome de um mercado |
| O2 | Identificar finalidade, objeto e papéis em uma descrição simples | Justificativa que use informações do caso, sem depender de uma palavra isolada ou só do prazo |
| O3 | Contrastar os quatro segmentos no nível introdutório delimitado pelas fontes | Comparação fundamentada entre descrições novas, após ensino e exemplos de todos os segmentos |
| O4 | Distinguir os papéis de quem concede recursos, de quem toma recursos, de quem emite e de quem investe, conforme a operação | Reconhecimento dos papéis sem presumir que intermediação tem a mesma forma em todos os casos |
| O5 | Reconhecer que uma descrição incompleta pode ser insuficiente para classificar a operação | Identificação da informação que falta; rejeição de uma conclusão absoluta sem suporte |
| O6 | Localizar no próprio material a explicação que permite rever um erro de comparação | Retomada do contraste pertinente, mantendo conclusão de leitura, desempenho imediato e retenção como evidências distintas |

Nenhum objetivo exige cálculo de taxa, fórmula de juros, cotação atual ou conhecimento prévio de instrumentos especializados. Se esses elementos se tornarem necessários, a delimitação deve ser revista e o ensino correspondente preparado antes da cobrança.

## 3. Pré-requisitos e apoio a preparar

As referências abaixo foram confrontadas em 30/09/2026 com o texto efetivamente composto por [manifest.js](../../worker/studies-content/manifest.js), no checkout `75bbe0d4`, importado com Node 24.17.0. A leitura considerou as substituições editoriais e atividades anexadas, não apenas os títulos ou o arquivo-base. As cinco aulas examinadas nesta tabela mantêm `contentVersion: 2` e `teaching.reviewStatus: human-review-pending`.

Os juízos de suficiência dizem respeito ao conteúdo textual disponível para uma retomada introdutória. Não atestam compreensão de Wellyton, retenção, revisão factual integral ou aceite humano. Nenhuma linha abaixo cria um requisito de acesso.

| Necessidade em MP-01 | IDs e trechos reais examinados | O que o texto já explica | Suficiência e ação de autoria ainda necessária |
| --- | --- | --- | --- |
| Recursos, poupança, tomador e obrigação de pagamento | `banking.sfn.introducao`: `vocabulario`, `intermediacao` | Distingue poupar de usar a caderneta, nomeia poupador/tomador e define crédito com pagamento futuro. O exemplo da oficina explica captação, concessão, intermediação e risco de não receber | **Base disponível para retomada.** Preservar a ressalva de que um depósito específico não é necessariamente entregue a um tomador específico. Se usar credor, devedor, superavitário ou deficitário, explicar esses termos antes: os trechos não desenvolvem esse vocabulário |
| Instituição, atividade, mercado e instrumento/produto | `banking.sfn.introducao`: `operadores`; `banking.sfn.operadores`: `papel`, `comercial`, `carteira`; `banking.sfn.cvm`: `mercado` | Distingue operador de supervisor e de formulação de política; explica carteira como conjunto autorizado de operações; apresenta capitais como ambiente de emissão/negociação, sem exigir prédio | **Parcial.** Ensinar em MP-01 o quadro de comparação entre mercado/segmento, instituição, operação e instrumento/produto. Carteira bancária e mercado não foram contrastados explicitamente; não pedir que o aluno deduza a equivalência ou diferença pelo nome |
| Depósito, concessão de crédito e papéis da instituição | `banking.sfn.operadores`: `deposito`, `comercial`, `glossario`; `banking.sfn.introducao`: `intermediacao` | Explica a obrigação da instituição perante o depositante, o saldo movimentável e a concessão com condições de devolução; rejeita a imagem de um envelope individual no cofre | **Base disponível, com extensão necessária.** MP-01 precisa ligar essas relações ao segmento de crédito e contrastar o papel da instituição com a intermediação de uma emissão. Não transformar a retomada em ensino de criação de moeda, custos ou regras completas de crédito |
| Participação societária versus dívida | `banking.sfn.cvm`: `acoes`, `resumo` | Ação é contrastada com empréstimo; debênture aparece como relação de dívida do emissor. O texto recusa que todo valor mobiliário represente participação | **Base disponível para retomada, não conceito ausente.** Reaplicar o contraste ao comparar segmentos; explicar qualquer novo instrumento escolhido. A atividade existente `apply.cvm.participacao-divida.v1`, anexada a `resumo`, também trabalha esse contraste, mas não comprova aprendizagem do aluno |
| Emissão, negociação posterior e destino dos recursos | `banking.sfn.cvm`: `mercado`, `exemplo-oferta`, `resumo` | Define emissão/negociação, distingue primário/secundário e mostra quem recebe na emissão e na venda posterior. Adverte que nem toda oferta pública é captação nova da empresa | **Base disponível para retomada, não conceito ausente.** Preservar esses limites em MP-01. A atividade existente `apply.cvm.destino.v1`, anexada a `resumo`, reforça emissor versus vendedor; eventual ampliação para outros instrumentos exigirá ensino/fonte próprios |
| Emissor, investidor, intermediário e supervisor | `banking.sfn.cvm`: `participantes`, `exemplo-oferta`, `glossario`, `comparacao` | O caso de Alfa/Clara/corretora/CVM nomeia quem capta, investe, intermedeia e supervisiona. O texto separa essas funções e admite competências complementares de supervisores | **Base disponível, com extensão necessária.** Ensinar a comparação entre os papéis nessa emissão e no contrato de crédito. O texto não desenvolve a diferença de obrigações entre a instituição que concede crédito e a que presta serviços na emissão; não cobrar essa relação antes de explicá-la |
| Liquidez, recursos disponíveis e liquidação | `banking.sfn.bacen`: `banco-dos-bancos`; `banking.sfn.operadores`: `deposito`; `banking.sfn.copom`: `selic` | Explica liquidação como efetivação de obrigação/operação, relações entre bancos e movimentação de saldo. Nenhum desses trechos desenvolve liquidez | **A ensinar em MP-01 antes do segmento monetário.** Delimitar liquidez no contexto adotado, distinguir de liquidação e não presumir equivalência com liquidez de investimento. A busca auxiliar não encontrou o termo `liquidez` nos corpos das oito aulas; esse resultado apenas apoia a leitura, não prova sozinho suficiência ou ausência de ensino |
| Mercado monetário versus política monetária e mercado de crédito | `banking.sfn.bacen`: `politicas`, `circulante`; `banking.sfn.copom`: `selic`, `meta`, `relacao` | Há noções de política/moeda/juros, meio circulante e financiamento de curtíssimo prazo ligado à taxa Selic. Sistema, taxa e meta são separados; a meta não é apresentada como taxa de todos os contratos | **Parcial.** MP-01 precisa ensinar a finalidade, os participantes e os fluxos do segmento monetário no recorte escolhido e contrastá-los com crédito. A menção a curtíssimo prazo não fornece esse contraste. Não usar prazo isolado, dinheiro físico ou a palavra Selic como regra de classificação |
| Câmbio, moedas e cotação | `banking.sfn.bacen`: `politicas`, `glossario` | Define câmbio como troca entre moedas e vincula política cambial a esse campo | **Parcial.** Ensinar moeda nacional/estrangeira, conversão e os papéis no caso introdutório. Se houver cotação, ensinar antes a ordem das moedas e a unidade da taxa. Esses trechos não explicam a leitura de uma cotação; regimes e normas de autorização permanecem fora deste recorte |
| Prazo, vencimento e juros | `banking.sfn.copom`: `juros`, `selic`, `meta`; `banking.sfn.operadores`: `deposito` | Juros são explicados com recebimento/devolução após prazo; depósito à vista é contrastado com vencimento futuro; há menção a curtíssimo prazo | **Parcial.** Explicitar os sentidos necessários aos casos de MP-01 e por que o prazo sozinho não determina o segmento. Não pressupor limites numéricos universais, cálculo de juros ou leitura de curva |
| Siglas e consulta | `banking.sfn.introducao`: `consulta`; `banking.sfn.cvm`: `glossario`; `banking.sfn.bacen`: `glossario` | SFN, CMN, BC/BCB/Bacen e CVM têm expansão e função inicial para consulta | **Base disponível para retomada.** Reapresentar somente as siglas usadas em MP-01. Glossário não substitui a comparação ainda ausente entre os quatro segmentos |

**Resultado da conferência:** a base existente permite retomar vocabulário de crédito, papéis institucionais e distinções importantes de capitais. Ainda é necessário ensinar dentro de MP-01 a comparação conjunta dos quatro mercados por finalidade/objeto/papéis, as relações contrastadas de crédito e capitais, liquidez no contexto monetário e a leitura cambial que vier a ser utilizada. Não transferir essas lacunas silenciosamente ao aluno nem chamar de conteúdo novo o que já está explicado e precisa apenas de retomada.

Antes da etapa B, usar esta tabela para planejar as retomadas e fechar as fontes das extensões escolhidas. Qualquer base ausente exige explicação anterior à sua utilização. Não acrescentar bloqueio por nota, tempo de leitura, refazer missão concluída ou cliques.

### Vocabulário a ensinar ou recuperar

Esta lista delimita necessidades de ensino; não contém o glossário final do aluno.

| Grupo | Palavras e relações que precisam ficar claras | Ação na autoria |
| --- | --- | --- |
| Estrutura da comparação | mercado, segmento, instituição, operação, instrumento, produto | Abrir com distinções em linguagem comum; verificar se “instrumento” e “produto” precisam de tratamento separado conforme os casos escolhidos |
| Participantes e fluxo | recursos, necessidade de financiamento, tomador, credor, investidor, emissor, intermediário | Nomear os papéis antes de apresentar fluxos; não usar “superavitário/deficitário” como atalhos sem explicação |
| Tempo e disponibilidade | prazo, vencimento, recursos disponíveis, liquidez | Distinguir o sentido usado em cada contexto. A liquidez de um investimento e a liquidez do sistema não devem ser fundidas em uma definição sem contexto |
| Crédito | empréstimo, financiamento, obrigação de devolução, juros | Recuperar o básico; detalhes de modalidades, custos e garantias pertencem a `banking.products-credit` |
| Capitais | valor mobiliário, ação, participação, emissão, negociação | Retomar as distinções já ensinadas em `banking.sfn.cvm`, sem tratá-las como inteiramente ausentes. Qualquer extensão dos instrumentos e relações exige ensino e fonte suficientes antes da cobrança |
| Câmbio | moeda nacional, moeda estrangeira, conversão, taxa de câmbio | Prever explicação mínima. Regimes, autorização de agentes e instrumentos cambiais não serão pressupostos |
| Siglas | SFN, BCB/BC, CVM; outras somente se necessárias | Expandir na primeira ocorrência. Não introduzir siglas por ornamentação nem cobrar reconhecimento sem ensino |

## 4. Ordem proposta de elaboração

1. Preparar uma retomada curta dos papéis de quem necessita e de quem disponibiliza recursos, com os limites da simplificação.
2. Estabelecer mercado versus instituição versus operação; a mesma instituição não deve funcionar como pista suficiente para toda classificação.
3. Definir o vocabulário mínimo e os critérios de comparação antes de apresentar os segmentos.
4. Desenvolver cada segmento com finalidade, objeto, participantes e limite da descrição, em leituras encadeadas. A ordem didática provisória é crédito, capitais, monetário e câmbio; a ordem dos itens do edital será mantida no quadro de consulta.
5. Planejar os exemplos resolvidos da etapa C e uma síntese comparativa depois das explicações. Esta nota não redige os exemplos.
6. Revisar casos ambíguos e simplificações, conferir fatos e fontes e assegurar que todos os conhecimentos necessários já tenham sido ensinados.
7. Somente após isso, preparar a verificação de compreensão e a recuperação dos erros nas etapas E/F autorizadas futuramente. Esta nota não cria enunciados, alternativas, respostas ou gabaritos.

A ordem acima é uma escolha editorial proposta, não uma mudança na progressão do produto. A revisão pode subdividir as leituras para preservar a compreensão, sem reduzir o ensino nem multiplicar missões ou XP artificialmente.

## 5. Fontes oficiais de ensino efetivamente legíveis

Três fontes abaixo foram abertas e seus trechos pertinentes lidos em 30/09/2026. Os trechos literais são curtos e servem à auditoria de origem; não são textos da futura aula. As chaves de fonte são locais a esta nota.

### CVM-01 — referência comparativa dos quatro segmentos

- Documento: [Funcionamento do Sistema Financeiro Nacional](https://www.gov.br/investidor/pt-br/investir/como-investir/conheca-o-mercado-de-capitais/funcionamento-do-sistema-financeiro-nacional), Portal do Investidor/CVM.
- Publicação exibida: 25/10/2022, 12:40; atualização separada não exibida. Acesso: 30/09/2026; HTML substantivo legível.
- Localização: parágrafo que enumera os segmentos, seguido pelos parágrafos de mercado monetário, câmbio e crédito; encerramento sobre capitais.
- Trecho literal: “costuma-se dividir o mercado financeiro em quatro grandes mercados”.
- Evidência aproveitável: segmentação em monetário, câmbio, crédito e capitais; ligação do monetário a transferências de curtíssimo prazo e liquidez; do câmbio à conversão entre moedas; do crédito à atuação de instituições que captam e emprestam. O encerramento introduz capitais como alternativa de financiamento.
- Limite: “em geral” não equivale a prazo obrigatório de um dia. A explicação de intervenção monetária é resumida; não fundamenta a mecânica ou a regulamentação atual de cada instrumento. A divisão é introdutória, não autorização para classificar qualquer caso pela presença de uma palavra.

### CVM-02 — contraste entre crédito e capitais

- Documento: [O Mercado de Valores Mobiliários](https://www.gov.br/investidor/pt-br/investir/como-investir/conheca-o-mercado-de-capitais/o-mercado-de-valores-mobiliarios), Portal do Investidor/CVM.
- Publicação exibida: 25/10/2022, 12:40; atualização separada não exibida. Acesso: 30/09/2026; HTML substantivo legível.
- Localização: comparação inicial com crédito; parágrafos sobre serviços de intermediação e sobre títulos de dívida/patrimoniais.
- Trecho literal: “as instituições financeiras no mercado de capitais atuam como prestadoras de serviços. Elas estruturam operações”.
- Evidência aproveitável: papéis distintos da instituição que concede crédito e da que presta serviços na captação por valores mobiliários; distinção entre dívida e participação societária.
- Limite: a própria página distingue ações de títulos de dívida. Sua generalização inicial sobre “emprestar” não deve virar definição de toda aplicação em capitais. “Diretamente” não elimina intermediários, e a ausência de responsabilidade automática pela dívida da emissora não dispensa os prestadores de seus próprios deveres. Detalhes jurídicos desses deveres ficam pendentes de fonte específica se forem usados.

### BCB-01 — apoio ao vocabulário de crédito

- Documento: [Caderno de Educação Financeira — Conteúdo Básico](https://www.bcb.gov.br/content/cidadaniafinanceira/documentos_cidadania/Cuidando_do_seu_dinheiro_Gestao_de_Financas_Pessoais/caderno_cidadania_financeira.pdf), Banco Central do Brasil, versão 2026, 2ª edição revisada, 98 páginas.
- Acesso: 30/09/2026; PDF com extração textual legível. O endereço antigo `/pre/pef/port/caderno_cidadania_financeira.pdf` hoje contém apenas a indicação dessa nova versão.
- Localização: módulo 3, seção 3.1, p. 32; seção 3.4, p. 35. O índice de página do extrator é, respectivamente, 31 e 34.
- Trecho literal, seção 3.1: “O crédito é uma fonte adicional de recursos que não são seus, mas obtidos de terceiros”.
- Evidência aproveitável: o texto apresenta crédito como recursos de terceiros e, na seção 3.4, explicita o compromisso de devolver o que foi tomado. Pode apoiar a retomada de tomador, credor e dívida.
- Limite: fonte de educação financeira pessoal; não é, sozinha, uma descrição dos quatro mercados nem um inventário das normas vigentes. Não transformar seu exemplo cotidiano em regra absoluta sobre todas as operações financeiras. Sua explicação de liquidez de investimento, seção 5.3, pp. 60–61, não basta para ensinar liquidez do sistema monetário.

### Ligação entre objetivos, conceitos e fontes

| Contraste/apoio a planejar | Fontes de base | Objetivos locais | Pendência para o texto futuro |
| --- | --- | --- | --- |
| Mercado monetário frente aos demais | CVM-01 | O1–O3, O5 | Explicação iniciante de liquidez no contexto do sistema e fonte adicional para qualquer instrumento específico |
| Crédito frente a capitais | CVM-01, CVM-02; BCB-01 para vocabulário | O2–O4 | Definir os papéis e ensinar o instrumento de cada caso; não reduzir a distinção ao prazo |
| Capitais frente a crédito e câmbio | CVM-02, CVM-01; trechos de `banking.sfn.cvm` conferidos na seção 3 | O1–O4 | Retomar emissão/negociação e participação/dívida já ensinadas; conferir fontes próprias se ampliar o caso existente de negociação posterior |
| Câmbio frente aos demais | CVM-01 | O1–O3, O5 | Explicar conversão e unidade de cotação antes de qualquer valor; normas, agentes autorizados e derivados não estão verificados aqui |
| Retomada após erro | Ensino que vier a ser redigido com essas bases | O6 | Criar vínculos entre ensino, prática e revisão apenas nas etapas futuras; nenhuma avaliação pronta |

Essa ligação registra fundamentação da proposta. Não declara que as fontes bastam para toda a autoria nem que objetivos já foram ensinados.

## 6. Fontes tentadas que não sustentam afirmações nesta nota

- [BCB — Sistema Financeiro Nacional](https://www.bcb.gov.br/estabilidadefinanceira/sfn): consulta de 30/09/2026 retornou apenas uma linha sem o conteúdo. Não foi usada como evidência factual; um resultado de busca não substitui a leitura.
- [BCB — página antiga de mercado de câmbio](https://www.bcb.gov.br/pre/bc_atende/port/mercado_de_cambio.asp): não acessível pelo navegador de pesquisa nesta rodada. Não se presumiu seu conteúdo nem vigência.
- [CVM — página de apresentação da 5ª edição do livro TOP Mercado de Valores Mobiliários Brasileiro](https://www.gov.br/investidor/pt-br/educacional/publicacoes-educacionais/livros-cvm/cvm-livro_top_valores_mobiliarios_br_5ed.pdf): apresentação legível, criada em 11/12/2024 e modificada em 28/03/2025. O download associado excedeu o limite do navegador de pesquisa, que informou 13.241.512 bytes. A apresentação não comprova que trechos internos do livro foram lidos; o livro não fundamenta as distinções desta nota.

## 7. Critérios de revisão e pendências

| Critério da etapa A | Estado e próxima ação |
| --- | --- |
| Vínculo ao escopo adotável | Proposto separadamente para BB item 2 e CAIXA item 3. A escolha definitiva do edital/perfil e da data de corte continua pendente |
| Objetivo, pré-requisitos e palavras novas | Confronto textual registrado na seção 3; retomadas e lacunas separadas. Falta preparar o ensino das extensões e revisar a compreensão do material quando for redigido |
| Fonte legível para cada contraste | Base introdutória conferida em CVM-01/CVM-02/BCB-01; pendências por contraste acima. Fontes inacessíveis excluídas da evidência |
| Limite das simplificações | Não classificar só por prazo, sigla, nome da instituição ou local físico; não pressupor ausência de intermediários no mercado de capitais; examinar caso e fonte antes de escolher um contraste |
| Adequação iniciante | Planejar termos antes do uso, raciocínio explícito e retomada dentro da unidade; links oficiais são fundamento da autoria, não tarefa obrigatória para o aluno aprender |
| Cadeia de ensino e avaliação | B, C, D, E e F pendentes; não há aula, exemplo resolvido ou questão concluídos por esta nota |
| Revisão humana e publicação | Não realizadas; esta preparação não substitui o aceite da Fase 2 nem autoriza integração/publicação de Fase 3 |

O próximo passo é fechar as pendências de fonte das extensões identificadas e usar o confronto da seção 3 para delimitar retomadas e novo ensino, antes de uma futura etapa B autorizada. A incorporação deste documento não registra aceite do plano, do ensino ou da Fase 2. Para esta mudança documental, conferir links, UTF-8 e diff; testes de runtime não atestariam a qualidade da delimitação pedagógica. O diagnóstico do aluno e a prontidão para prova permanecem independentes do progresso desta preparação.
