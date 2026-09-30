# MISSÃO BANCÁRIA — RASTREABILIDADE BANCÁRIOS — REFERÊNCIAS HISTÓRICAS

Data da conferência: 30/09/2026.

Fase ativa: **Fase 2; esta entrega documental não abre a Fase 3**.

Catálogo inspecionado: `81f89b9eeb19dc84b77d77152f8e9fc663967585`; `curriculumVersion: 1`.

## 1. Escopo e forma de leitura

Esta matriz organiza somente a disciplina **Conhecimentos Bancários** dos perfis históricos BB 2022/001 — Agente Comercial e CAIXA 2024/NM — Técnico Bancário Novo. Não substitui a escolha de um edital futuro, não altera o runtime, não publica aulas e não declara qualquer dos dois editais vigente. Os perfis existentes continuam `referenceOnly: true`.

O [JSON de rastreabilidade](planejamento/rastreabilidade-bancarios-referencias-v1.json) contém 70 entradas: 24 do BB e 46 posições da lista da CAIXA. Cada entrada registra perfil, fonte/versão, página, item impresso, objetivo observável proposto, blocos candidatos, evidência existente e lacuna. A cadeia documental é:

`perfil + fonte/versão + item → competência proposta → aula/trecho → prática → avaliação independente`

Os dois anexos, no trecho aqui analisado, não subdividem os itens com numeração decimal. Por isso, `officialSubitem` permanece `null`. Listas internas de produtos ou conceitos são preservadas no escopo resumido e precisam ser desdobradas editorialmente na autoria; não receberão números apresentados como se viessem do edital. IDs `plan.*` pertencem apenas ao planejamento, com `runtimeId: null`.

As competências propostas foram redigidas para orientar ensino futuro. As referências às aulas e avaliações existentes vieram dos IDs e vínculos reais do catálogo, com leitura dos trechos pertinentes. Nenhuma linha é certificação de cobertura integral de um item amplo.

## 2. Fontes e versões efetivamente conferidas

### Banco do Brasil

[PDF oficial BB — Edital nº 01 — 2022/001, de 22/12/2022](https://www.bb.com.br/docs/portal/dipes/EditalSelExtern2022001.pdf#page=1), 36 páginas. A capa incorpora alterações publicadas no DOU de 04/01/2023 (seção 3, p. 53), 24/02/2023 (p. 86) e 27/02/2023 (pp. 86–87). O recorte usado é **Anexo III, Conhecimentos Específicos, Agente Comercial, Conhecimentos Bancários, página 34**, itens 1–24. O trecho de Agente de Tecnologia foi distinguido do perfil de interesse.

O acesso textual ao PDF oficial foi bem-sucedido em 30/09/2026. O registro de origem existente `edital.bb.2022-001` foi preservado; esta documentação acrescenta um snapshot de verificação, sem alterar sua data no runtime.

### CAIXA

[PDF oficial CAIXA — Edital nº 01/2024/NM, de 22/02/2024](https://www.caixa.gov.br/Downloads/concurso-publico-editais/EDITAL_N_01_2024_NM_DE_22_DE_FEVEREIRO_DE_2024_.pdf#page=1), 37 páginas. A capa incorpora a alteração do DOU de 27/02/2024, seção 3, edição 39, p. 118. O recorte é **Anexo IV, Conhecimentos Específicos, Técnico Bancário Novo, Conhecimentos Bancários, páginas 33–34**; não é o conteúdo específico de TBN TI.

O navegador de pesquisa encontrou loop de redirecionamento. Um download HTTPS direto autorizado no PC-REGULACAO-3 retornou HTTP 200, `application/pdf`, 759124 bytes. O texto foi extraído e as páginas 33–34 foram renderizadas e conferidas visualmente. SHA-256 do arquivo obtido:

`6ef6262ce9f0f8a1db5225d288251b1c3f3761fc8ae368f3d6c77b57ae50014b`

Duas particularidades da própria fonte foram preservadas:

- O tópico de juros aparece literalmente como **“278”**, entre 27 e 29. A matriz guarda `sourceItemLabel: "278"` e `sourceOrder: 28`; a ordem interna não corrige a numeração impressa.
- Os itens **39 e 46** repetem a referência à Lei 7.998/1990, beneficiários e critérios de saque. Ambos continuam rastreáveis, com indicação de duplicidade; uma futura unidade não deve ser contada duas vezes por isso.

A referência à Lei 10.836/2004 no item 35 é a que consta deste edital histórico. Esta conferência identifica o que a fonte pediu; não confirma vigência atual dessa lei nem das demais normas citadas. A autoria futura deve registrar a data de corte normativa escolhida e verificar fontes atuais ou a versão histórica exigida, sem misturá-las.

## 3. Evidência publicada e limites

O catálogo inspecionado mantém oito aulas e o Chefe de `banking.sfn-foundation`, 27 atividades formativas e 38 questões pontuadas. As avaliações independentes têm 32 itens: formas A/B, `assessmentVersion: 2` e `BLOCK_CONTENT_VERSION: 2`. Todas as nove missões estão em `contentVersion: 2`. Os IDs foram preservados no inventário do JSON.

| Competência existente na avaliação independente | Aula de origem | Evidência preservada |
| --- | --- | --- |
| `sfn.classificacao-funcional` | `banking.sfn.introducao` | Três questões pontuadas; quatro itens A/B |
| `sfn.cmn-diretrizes` | `banking.sfn.cmn` | Três questões pontuadas; quatro itens A/B |
| `sfn.bcb-execucao-supervisao` | `banking.sfn.bacen` | Três questões pontuadas; quatro itens A/B |
| `sfn.copom-politica-monetaria` | `banking.sfn.copom` | Três questões pontuadas; quatro itens A/B |
| `sfn.cvm-valores-mobiliarios` | `banking.sfn.cvm` | Três questões pontuadas; quatro itens A/B |
| `sfn.operadores-instituicoes` | `banking.sfn.operadores` | Três questões pontuadas; quatro itens A/B |
| `sfn.seguros-previdencia-supervisao` | `banking.sfn.seguros-previdencia` | Quatro questões pontuadas; quatro itens A/B |
| `sfn.pagamentos-consorcios` | `banking.sfn.pagamentos-consorcios` | Quatro questões pontuadas; quatro itens A/B |

O Chefe adiciona 12 questões cumulativas, com referências às aulas de origem. O JSON registra os IDs das 27 atividades formativas, suas seções de ensino, as 38 questões e seus vínculos, além dos 32 itens independentes e competências. O Chefe não é uma terceira forma independente.

Fontes locais: [manifest.js](../../worker/studies-content/manifest.js), [application-registry.js](../../worker/studies-content/application-registry.js), [sfn-foundation-v1.js](../../worker/studies-assessment-content/sfn-foundation-v1.js) e [curriculum-v1.js](../../worker/studies-content/curriculum-v1.js). Os registros de fontes didáticas são copiados como inventário, incluindo suas datas originais; esta entrega não reconferiu todas essas normas ou páginas.

Estados usados:

- **Recorte publicado:** existe cadeia de ensino e prática no bloco inicial; falta revisão de exaustividade frente ao item amplo.
- **Parcial:** há ensino de alguns conceitos e itens correspondentes, com lacunas explícitas.
- **Pré-requisito:** o texto oferece contexto/vocabulário, sem cadeia suficiente para o objetivo específico. A matriz não conta suas questões como avaliação daquele item.
- **Lacuna:** nenhuma cadeia publicada correspondente foi identificada.

Exemplos de limites verificados no texto: explicar quem fixa a meta Selic não cobre QE ou compromissadas; definir depósito à vista não cobre documentos de abertura de conta; definir o BCB como banco dos bancos não cobre operações interbancárias; apresentar seguros, previdência e capitalização pelo supervisor não completa a lista de produtos. Pix/SPI tem ensino inicial real, mas não certifica todo o item Pix ou SPB.

## 4. Blocos candidatos

As letras abaixo abreviam **IDs já existentes** no mapa; não são novos blocos nem atribuições aprovadas para publicação.

| Código | ID existente | Destino candidato |
| --- | --- | --- |
| S | `banking.sfn-foundation` | SFN inicial |
| M | `banking.markets-policy` | Mercados e política |
| P | `banking.products-credit` | Produtos, contas, crédito e garantias |
| C | `banking.capital-exchange` | Capitais e câmbio |
| D | `banking.digital-payments` | Digital e pagamentos |
| I | `banking.institution-specific` | Institucional CAIXA |
| E | `ethics-compliance.integrity` | Ética/integridade |
| A | `ethics-compliance.aml-anticorruption` | Prevenção, integridade e socioambiental |
| L | `ethics-compliance.privacy-security` | Sigilo, privacidade e segurança |
| R | `sales-service.rules` | Relacionamento e autorregulação |
| N | `sales-service.negotiation` | Negociação |
| V | `sales-service.sales` | Vendas/estratégia |
| U | `sales-service.customer` | Cliente e serviços |
| T | `informatics.security-data` | Segurança de informação |

Um item pode demandar mais de um bloco. A atribuição é editorial e permanece proposta. Em particular:

- **† BB:** os itens de ética, sigilo, LGPD, lavagem, anticorrupção e socioambiental estão dentro de Conhecimentos Bancários no edital BB. A área `ethics-compliance` no mapa atual está associada apenas à CAIXA. A matriz explicita essa lacuna de associação; não altera o mapa nem elimina a exigência do BB.
- **CAIXA 40:** saúde, bem-estar e ergonomia não têm destino inequívoco nos blocos atuais. A classificação permanece pendente; nenhum nome existente foi forçado para esconder a lacuna.
- **CAIXA 41–45:** constam de Conhecimentos Bancários na fonte, ainda que o ensino futuro possa ser reutilizado de Vendas/Atendimento. Preservar a disciplina de origem na apuração.
- **BB digital:** o edital traz os temas digitais em Atualidades do Mercado Financeiro, seção distinta na página 33. A associação histórica do bloco `banking.digital-payments` ao BB não torna esses tópicos novos itens de Conhecimentos Bancários. Uma matriz das outras disciplinas será trabalho separado.

## 5. Matriz BB — Agente Comercial

Numeração conforme o [Anexo III, página 34 do PDF oficial BB](https://www.bb.com.br/docs/portal/dipes/EditalSelExtern2022001.pdf#page=34). Escopo abaixo em paráfrase; objetivos observáveis completos e vínculos estão no JSON. O sinal † remete à lacuna de associação descrita acima, sem alterar a fonte.

| Item impresso | Escopo resumido | Bloco candidato | Evidência atual |
| --- | --- | --- | --- |
| 1 | Estrutura, órgãos e instituições do SFN | S | Recorte publicado: SFN |
| 2 | Mercados monetário, de crédito, de capitais e cambial | M, C | Parcial: MERCADOS |
| 3 | Moeda; política convencional e não convencional; QE; Selic; compromissadas; depósitos remunerados | M | Parcial: POLITICA |
| 4 | Orçamento, títulos do Tesouro e dívida pública | M | Pré-requisito: TITULOS |
| 5 | Cartões, CDC, crédito rural, poupança, capitalização, previdência, consórcio, investimentos e seguros | P, C | Parcial: PRODUTOS |
| 6 | Fundamentos do mercado de capitais | C | Parcial: CAPITAIS |
| 7 | Instituições autorizadas e operações básicas de câmbio | C | Pré-requisito: CAMBIO |
| 8 | Regimes cambiais fixos, flutuantes e intermediários | C | Lacuna |
| 9 | Câmbio nominal e real | C | Lacuna |
| 10 | Câmbio, exportações e importações | C | Lacuna |
| 11 | Diferencial de juros, risco, fluxos de capitais e câmbio | C, M | Lacuna |
| 12 | Operações interbancárias | M | Pré-requisito: INTERBANCARIO |
| 13 | Tesouraria, varejo e recuperação de crédito | M, P | Pré-requisito: VAREJO |
| 14 | Juros de curto prazo, curva de juros, taxas nominal e real | M | Pré-requisito: JUROS |
| 15 | Aval, fiança, penhor mercantil, alienação fiduciária, hipoteca e fiança bancária | P | Lacuna |
| 16 | Lavagem: conceito, etapas, prevenção; Lei 9.613/1998, Circular 3.978/2020 e Carta Circular 4.001/2020 | A † | Lacuna |
| 17 | Autorregulação e normativos SARB | R | Lacuna |
| 18 | Sigilo bancário e LC 105/2001 | L † | Lacuna |
| 19 | LGPD e Lei 13.709/2018 | L † | Lacuna |
| 20 | Anticorrupção: Lei 12.846/2013 e Decreto 11.129/2022 | A † | Lacuna |
| 21 | Segurança cibernética: Resolução CMN 4.893/2021 | L, T † | Lacuna |
| 22 | Ética, moral, valores, gestão da ética e Código de Ética BB | E † | Lacuna |
| 23 | Política socioambiental do Banco do Brasil | A † | Lacuna |
| 24 | ASG, economia sustentável, financiamentos e mercado PJ | A, P † | Lacuna |

## 6. Matriz CAIXA — Técnico Bancário Novo

Numeração conforme o [Anexo IV, páginas 33–34 do PDF oficial CAIXA](https://www.caixa.gov.br/Downloads/concurso-publico-editais/EDITAL_N_01_2024_NM_DE_22_DE_FEVEREIRO_DE_2024_.pdf#page=33). `278` e a repetição 39/46 foram mantidos.

| Item impresso | Escopo resumido | Bloco candidato | Evidência atual |
| --- | --- | --- | --- |
| 1 | Estatuto Social da CAIXA | I | Lacuna |
| 2 | Estrutura, órgãos e instituições do SFN | S | Recorte publicado: SFN |
| 3 | Mercados monetário, de crédito, de capitais e cambial | M, C | Parcial: MERCADOS |
| 4 | Bancos na era digital: tendências e desafios | D | Lacuna |
| 5 | Internet banking | D | Lacuna |
| 6 | Mobile banking | D | Lacuna |
| 7 | Novos modelos de negócios | D | Lacuna |
| 8 | Fintechs, startups e big techs | D | Lacuna |
| 9 | Shadow banking | D | Lacuna |
| 10 | Moedas e ativos digitais: blockchain, bitcoin e criptomoedas | D | Lacuna |
| 11 | Correspondentes bancários | P, D | Pré-requisito: CORRESPONDENTE |
| 12 | Pix | D | Parcial: PIX |
| 13 | Open finance | D | Lacuna |
| 14 | Moedas digitais de bancos centrais e DREX | D | Lacuna |
| 15 | Transformação digital no SFN | D | Lacuna |
| 16 | Moeda; políticas monetárias convencionais e não convencionais; QE | M | Parcial: POLITICA |
| 17 | Selic, compromissadas e depósitos remunerados no BCB | M | Parcial: SELIC |
| 18 | Orçamento, títulos do Tesouro e dívida pública | M | Pré-requisito: TITULOS |
| 19 | Programas sociais e benefícios; cartões, CDC, crédito rural, poupança, capitalização, previdência, consórcio, investimentos e seguros | P, C, I | Parcial: PRODUTOS |
| 20 | Fundamentos do mercado de capitais | C | Parcial: CAPITAIS |
| 21 | Instituições autorizadas e operações básicas de câmbio | C | Pré-requisito: CAMBIO |
| 22 | Regimes cambiais fixos, flutuantes e intermediários | C | Lacuna |
| 23 | Câmbio nominal e real | C | Lacuna |
| 24 | Câmbio, exportações e importações | C | Lacuna |
| 25 | Diferencial de juros, risco, fluxos de capitais e câmbio | C, M | Lacuna |
| 26 | Operações interbancárias | M | Pré-requisito: INTERBANCARIO |
| 27 | Tesouraria, varejo e recuperação de crédito | M, P | Pré-requisito: VAREJO |
| 278 (posição 28) | Juros de curto prazo, curva de juros, taxas nominal e real | M | Pré-requisito: JUROS |
| 29 | Aval, fiança, penhor mercantil, alienação fiduciária, hipoteca e fiança bancária | P | Lacuna |
| 30 | Autorregulação bancária | R | Lacuna |
| 31 | PIS: LC 7/1970 | I | Lacuna |
| 32 | FGTS: Lei 8.036/1990, hipóteses e condições de utilização/saque | I | Lacuna |
| 33 | Certificado de Regularidade do FGTS | I | Lacuna |
| 34 | Guia de Recolhimento do FGTS (GRF) | I | Lacuna |
| 35 | Bolsa Família: Lei 10.836/2004 citada no edital | I | Lacuna |
| 36 | Abertura/movimentação de contas e documentos básicos | P | Pré-requisito: CONTAS |
| 37 | PF/PJ: capacidade e incapacidade civil, representação e domicílio | P | Lacuna |
| 38 | Sistema de Pagamentos Brasileiro | D | Parcial: SPB |
| 39 | Lei 7.998/1990: programa de desemprego e abono; beneficiários e saque | I | Lacuna |
| 40 | Saúde, bem-estar e ergonomia | A definir | Lacuna |
| 41 | Negociação e escuta empática | N | Lacuna |
| 42 | Estratégia empresarial, mercado, concorrência, imagem, identidade e posicionamento | V | Lacuna |
| 43 | Segmentação e CRM | U | Lacuna |
| 44 | Intangibilidade, inseparabilidade, variabilidade e perecibilidade dos serviços | U | Lacuna |
| 45 | Qualidade em serviços | U | Lacuna |
| 46 | Lei 7.998/1990: programa de desemprego e abono; beneficiários e saque | I | Lacuna |

## 7. Próximos recortes delimitados, ainda em planejamento

1. **`banking.markets-policy`:** BB 2/3/4/12/14 e parcela de tesouraria do 13; CAIXA 3/16/17/18/26/278 e parcela de 27. Partir de mercados e moeda, avançar a inflação/juros e instrumentos, depois dívida, interbancário e curva. Câmbio e instrumentos de capitais exigem ligação explícita ao bloco próprio.
2. **`banking.products-credit`:** BB 5/13/15; CAIXA 11/19/27/29/36/37. Separar produto, crédito, custo, conta, capacidade/representação, garantias e recuperação. Produtos de investimento remetem também a `banking.capital-exchange`; programas/benefícios do item CAIXA 19 remetem a `banking.institution-specific`. Habitação não aparece nominalmente nessa lista histórica de produtos; qualquer unidade específica precisa de vínculo adicional ou rótulo de complementar.
3. **`banking.capital-exchange`:** BB 6–11 e investimentos do 5; CAIXA 20–25 e investimentos do 19. A aula CVM é prévia aproveitável, sem dispensar ensino de instrumentos, riscos e câmbio.
4. **`banking.digital-payments`:** CAIXA 4–15/38, com correspondentes em coordenação com produtos. Preservar a aula atual de pagamentos/consórcios. O vínculo a BB exige rastrear separadamente Atualidades, fora da matriz bancária desta entrega.
5. **`banking.institution-specific`:** CAIXA 1, programas/benefícios de 19 e itens 31–35/39/46. Versionar estatuto, programas e legislação; tratar 39/46 como duas referências da fonte a uma necessidade didática compartilhada.
6. **Transversais:** manter filas separadas para BB 16–24, CAIXA 30/40–45 e suas relações com outras disciplinas. Resolver associação ao perfil e destino editorial antes de afirmar cobertura.

A prioridade e decomposição detalhada dos primeiros blocos podem ser refinadas como planejamento documental. Cada unidade futura continua exigindo objetivo, ensino iniciante, exemplo resolvido, prática justificada, avaliação e revisão, conforme os documentos 24/26/63. Esta lista não autoriza publicar a Fase 3 nem cria promessa de datas.

## 8. Verificações e pendências

Verificações desta entrega: leitura das fontes oficiais nas versões identificadas; extração e inspeção visual das páginas CAIXA; importação somente leitura do catálogo. A validação documental com Node 24 conferiu as 70 linhas únicas, os 15 conjuntos de evidência, existência de blocos/seções/questões referenciados, versões e preservação das nove missões, 27 atividades formativas, 38 questões pontuadas e 32 itens independentes. Também confirmou as particularidades 278 e 39/46 e os seis links locais deste documento. Não foram executados testes de aplicação, API produtiva ou uso humano como parte desta pesquisa documental.

Permanecem pendentes: escolha/verificação do escopo a adotar; revisão de exaustividade de cada item e decomposição em competências menores; associação curricular dos tópicos transversais; verificação normativa na autoria; produção das unidades faltantes; formas independentes suficientes e controle de exposição; homologação de clareza e validação de aprendizagem. Nenhuma linha foi marcada como item integralmente concluído.

Não calcular porcentagem de edital, produto ou prontidão por quantidade de linhas desta matriz. Ela contém itens amplos, itens compostos e uma repetição de fonte; o mapa de 43 blocos usa outro denominador. A ferramenta permanece com Fase 2 ativa e com os critérios separados de [63-CONTINUIDADE-E-CRITERIOS-DE-CONCLUSAO.md](63-CONTINUIDADE-E-CRITERIOS-DE-CONCLUSAO.md).
