// Rascunho editorial, sem importação pelo runtime. Valores didáticos são fictícios.
export const SOURCES = [
  {
    "id": "cvm.sfn",
    "label": "CVM — Funcionamento do Sistema Financeiro Nacional",
    "url": "https://www.gov.br/investidor/pt-br/investir/como-investir/conheca-o-mercado-de-capitais/funcionamento-do-sistema-financeiro-nacional",
    "version": "Publicação de 25/10/2022, consulta reaproveitada em 30/09/2026",
    "locator": "Segmentos monetário, de crédito, de capitais e cambial; operações entre bancos e BCB. Não descreve organograma obrigatório de um banco.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "bcb.selic",
    "label": "BCB — Taxa Selic",
    "url": "https://www.bcb.gov.br/controleinflacao/taxaselic",
    "version": "Página institucional consultada em 30/09/2026",
    "locator": "Definição da taxa efetiva nas compromissadas de um dia útil e atuação para alinhá-la à meta definida pelo Copom. Sem usar o valor atual.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "bcb.transmissao",
    "label": "BCB — Mecanismos de transmissão da política monetária",
    "url": "https://www.bcb.gov.br/controleinflacao/transmissaopoliticamonetaria",
    "version": "Página institucional consultada em 30/09/2026",
    "locator": "Canais de consumo/investimento, câmbio, ativos, crédito e expectativas; efeitos condicionais, sem estimar magnitude ou prazo.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "bcb.compulsorios",
    "label": "BCB — Recolhimentos compulsórios",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/recolhimentoscompulsorios",
    "version": "Página institucional consultada em 30/09/2026",
    "locator": "Recolhimento obrigatório ao BCB, liquidez e estabilidade financeira. Não utilizada para alíquotas atuais.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "br.l4595",
    "label": "Lei 4.595/1964",
    "url": "https://www.planalto.gov.br/ccivil_03/leis/l4595.htm",
    "version": "Redação dos incisos V e XII do artigo 10 dada pela LC 179/2021, consultada em 30/09/2026",
    "locator": "Competências do BCB para redesconto/empréstimo e operações com títulos federais, sob regulamentação; não confundir trechos revogados com vigentes.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "br.l14185",
    "label": "Lei 14.185/2021 — depósitos voluntários",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14185.htm",
    "version": "Lei de 14/07/2021, publicada em 15/07/2021; texto consultado em 30/09/2026",
    "locator": "Artigos 1º e 3º: autorização, remuneração definida pelo BCB e condições regulamentares; não informa taxa vigente.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "boe.qe",
    "label": "Bank of England — Quantitative easing",
    "url": "https://www.bankofengland.co.uk/monetary-policy/quantitative-easing",
    "version": "Página atualizada em 05/12/2025, consultada em 30/09/2026",
    "locator": "Conceito de compras de títulos com reservas e transmissão para juros mais longos; contexto britânico iniciado em março de 2009. Não transpor política, meta ou situação atual ao Brasil.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "stn.fiscal",
    "label": "Tesouro Nacional — Sobre Política Fiscal",
    "url": "https://www.gov.br/tesouronacional/pt-br/estatisticas-fiscais-e-planejamento/sobre-politica-fiscal",
    "version": "Atualização de 08/07/2022, consultada em 30/09/2026",
    "locator": "Receitas/despesas, fluxos/estoques e resultado primário; exemplo didático não reproduz contabilidade fiscal oficial.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "br.d12814",
    "label": "Decreto 12.814/2026 — títulos públicos",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2026/decreto/d12814.htm",
    "version": "Decreto de 09/01/2026, DOU de 12/01/2026; consultado em 30/09/2026",
    "locator": "Arts. 2º, 3º, 7º e 11: LTN/LFT/NTN-B/NTN-F. Arts. 31–32: revogação do Decreto 11.301/2022 e vigência na publicação. Recorte introdutório, sem listar todas as séries.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "bce.curva",
    "label": "BCE — Euro area yield curves",
    "url": "https://www.ecb.europa.eu/stats/financial_markets_and_interest_rates/euro_area_yield_curves/html/index.en.html",
    "version": "Página metodológica consultada em 30/09/2026",
    "locator": "Definição da relação entre taxas e prazos remanescentes; expectativas e riscos. Apenas conceitos gerais, sem importar taxas ou método europeu ao Brasil.",
    "checkedAt": "2026-09-30"
  }
];
export const MPR_DRAFT = {
  "id": "draft.mpr",
  "topicId": "draft.mpr",
  "editorialKey": "MP-R",
  "candidateBlockId": "banking.markets-policy",
  "title": "Revisão cumulativa: mercados, política e dívida",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Conectar conceitos já ensinados em MP-01–09, justificar classificações e recuperar erros pelas aulas de origem, sem tratar prática exposta como avaliação independente.",
  "sourceIds": [
    "cvm.sfn",
    "bcb.selic",
    "bcb.transmissao",
    "bcb.compulsorios",
    "br.l4595",
    "br.l14185",
    "boe.qe",
    "stn.fiscal",
    "br.d12814",
    "bce.curva"
  ],
  "sections": [
    {
      "id": "acesso",
      "type": "explanation",
      "heading": "1. Comece pelas aulas de origem",
      "body": "Esta revisão só poderá ser usada após ensino e acesso efetivo a todas as unidades anteriores. Hoje o conjunto inteiro continua em rascunho, fora do aplicativo. Se um conceito ainda não foi estudado, volte à origem antes de tentar as questões: [MP-01 mercados](mp-01-v1.md), [MP-02 moeda e pagamentos](mp-02-v1.md), [MP-03 preços e juros](mp-03-v1.md), [MP-04 transmissão](mp-04-v1.md), [MP-05 operações](mp-05-v1.md), [MP-06 temas datados](mp-06-v1.md), [MP-07 dívida](mp-07-v1.md), [MP-08 relações bancárias](mp-08-v1.md) e [MP-09 curva](mp-09-v1.md). Os comentários ficam disponíveis: isto é prática formativa exposta, não uma forma independente ou comprovação de retenção.",
      "sourceIds": []
    },
    {
      "id": "metodo",
      "type": "explanation",
      "heading": "2. Quatro camadas para resolver um caso",
      "body": "Primeiro, marque participantes e o que está sendo trocado. Segundo, registre data, prazo, valor e unidade. Terceiro, identifique o tipo de afirmação: objetivo, operação, posição numa data ou resultado observado. Quarto, confronte a conclusão com os dados: ela inventa nova emissão, taxa futura, crédito automático ou informação não medida? Esse método reúne as distinções ensinadas; não exige decorar uma sigla para cada frase.",
      "sourceIds": []
    },
    {
      "id": "exemplo-integrado",
      "type": "worked-example",
      "heading": "3. Caso resolvido: quatro acontecimentos na mesma semana",
      "body": "Caso inteiramente fictício. A: um governo emite título e recebe 40 de uma investidora. B: ela vende o título existente a outro investidor por 41. C: dois bancos ajustam recursos entre si para cobrir um intervalo de pagamentos. D: a meta de juros é elevada e uma empresa revê um projeto financiado. Resolução: A é captação por emissão, com obrigação do emissor; em B o pagamento de 41 vai à vendedora, não constitui nova captação do governo; C é relação entre bancos, sem transformar cada correntista em devedor dessa operação; D conecta decisão monetária a possível reação de investimento. Ocorrerem na mesma semana não prova que um evento causou integralmente os outros. Origens: [emissão/revenda](mp-07-v1.md#emissao-negociacao), [relações entre bancos](mp-08-v1.md#interbancario), [transmissão](mp-04-v1.md#transmissao).",
      "sourceIds": []
    },
    {
      "id": "exemplo-numerico",
      "type": "worked-example",
      "heading": "4. Caso resolvido: valores iguais podem medir coisas diferentes",
      "body": "Outro caso fictício: o dinheiro cresce 6% e a cesta de referência também 6% no mesmo período, sem custos ou outras movimentações. A taxa real é 1,06/1,06 − 1 = 0. Ao lado, uma curva mostra 6% a.a. para um prazo de dois anos na data de observação. A coincidência “6%” não faz da curva a inflação realizada nem um retorno acumulado de dois anos. É preciso ler a unidade e a variável. Origens: [taxa real](mp-03-v1.md#real) e [eixos da curva](mp-09-v1.md#eixos).",
      "sourceIds": []
    },
    {
      "id": "exemplo-instrumentos",
      "type": "worked-example",
      "heading": "5. Caso resolvido: o recurso foi exigido, depositado ou trocado por ativo?",
      "body": "Caso fictício: três registros mencionam recursos no banco central. A instituição X cumpre uma exigência de recolhimento calculada sobre captação: compulsório. A instituição Y escolhe um depósito remunerado nas condições aplicáveis: depósito voluntário. Em outro país, o banco central compra ativos em programa para influenciar condições mais longas: situação compatível com o QE ensinado, se respeitado seu contexto. Classificar só pelo local dos recursos apagaria obrigação, voluntariedade e troca de ativos. Origens: [compulsório](mp-05-v1.md#compulsorio), [depósitos](mp-06-v1.md#depositos) e [QE](mp-06-v1.md#qe).",
      "sourceIds": []
    },
    {
      "id": "recuperacao",
      "type": "explanation",
      "heading": "6. Recuperar o raciocínio depois do erro",
      "body": "Antes de abrir a resposta, escreva uma justificativa curta. Se errar, escolha a categoria do erro: participante/mercado, saldo/instrumento, base/período, fluxo/estoque ou certeza indevida. Volte ao exemplo de origem indicado; explique por que o distrator parecia correto; resolva novamente mudando um participante ou número. Acertar depois de ler o comentário mostra uma etapa de correção, não retenção demonstrada em outro momento. Este roteiro não altera datas de revisão, XP ou a política do aplicativo.",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "7. Distinções que não podem desaparecer",
      "body": "Emissor não é necessariamente o vendedor atual. Instrumento de pagamento não é o saldo que o financia. Crescimento nominal não é crescimento real. Objetivo monetário não é resultado garantido. Compulsório não é depósito voluntário. Operação entre bancos não é crédito direto a cada cliente. Fluxo não é estoque. Taxa por prazo não é promessa da taxa futura. As definições e exemplos completos permanecem nas aulas vinculadas.",
      "sourceIds": []
    },
    {
      "id": "resumo",
      "type": "summary",
      "heading": "8. Prática, desafio e avaliação são evidências distintas",
      "body": "A prática abaixo usa casos novos, mas, ao ser exposta com comentários, passa a compor o material de estudo. Um desafio final do bloco deverá ter casos próprios e acesso às aulas anteriores; sua conclusão não provará prontidão para concurso. Formas independentes exigem itens reservados, controle de exposição e desenho próprios. Nada aqui amplia A/B nem muda a autorização de publicação. O [plano do desafio](../71-MP-BLOCO-RASCUNHO-E-REVISAO.md) estabelece dependências e critérios antes de qualquer integração.",
      "sourceIds": []
    }
  ],
  "questions": [
    {
      "prompt": "Uma empresa emite um título de dívida para captar recursos. Que distinção ajuda a entender a operação?",
      "options": [
        "O comprador virou automaticamente sócio com direito a voto.",
        "É uma relação de dívida; o direito decorre das condições do título, diferente de uma participação acionária.",
        "Toda captação é moeda estrangeira.",
        "O distribuidor passa sempre a ser o devedor da emissora."
      ],
      "answer": 1,
      "explanation": "Dívida e participação societária representam relações distintas, como ensinado na MP-01.",
      "optionRationales": [
        "Confunde título de dívida e ação.",
        "Mantém a natureza da obrigação.",
        "Inventa operação cambial.",
        "Confunde distribuição e obrigação de pagamento."
      ],
      "recoverySectionIds": [
        "metodo",
        "glossario"
      ],
      "objectiveIds": [
        "O1"
      ],
      "id": "mpr.q01",
      "topicId": "draft.mpr",
      "originRefs": [
        {
          "unit": "mp01",
          "sectionId": "capitais"
        }
      ]
    },
    {
      "prompt": "Uma pessoa paga usando um instrumento, mas os recursos saem de seu saldo já existente. Qual conclusão é correta?",
      "options": [
        "O instrumento é o mesmo que o saldo.",
        "Todo uso de instrumento cria crédito novo.",
        "Instrumento e recursos que financiam o pagamento são conceitos diferentes.",
        "O limite de crédito é sempre saldo próprio."
      ],
      "answer": 2,
      "explanation": "MP-02 ensina a separar meio de iniciar o pagamento e origem dos recursos.",
      "optionRationales": [
        "Apaga a distinção funcional.",
        "Pode haver uso de saldo existente.",
        "Preserva instrumento/origem dos recursos.",
        "Confunde crédito possível e recursos próprios."
      ],
      "recoverySectionIds": [
        "glossario",
        "recuperacao"
      ],
      "objectiveIds": [
        "O2"
      ],
      "id": "mpr.q02",
      "topicId": "draft.mpr",
      "originRefs": [
        {
          "unit": "mp02",
          "sectionId": "instrumento"
        }
      ]
    },
    {
      "prompt": "Caso fictício no mesmo período: dinheiro cresce 3% e cesta 5%, sem custos ou movimentações. Qual sinal da taxa real?",
      "options": [
        "Negativo, pois 1,03/1,05 é menor que 1.",
        "Positivo, pois a quantia cresceu.",
        "Zero, pois ambas as taxas são positivas.",
        "Não há como identificar nem o sinal com os dois dados."
      ],
      "answer": 0,
      "explanation": "O fator do dinheiro ficou abaixo do fator dos preços. A fórmula foi ensinada na MP-03.",
      "optionRationales": [
        "Compara fatores na ordem correta.",
        "Ignora poder de compra.",
        "Positividade não torna as taxas iguais.",
        "Os dados do mesmo período são suficientes."
      ],
      "recoverySectionIds": [
        "exemplo-numerico"
      ],
      "objectiveIds": [
        "O2"
      ],
      "id": "mpr.q03",
      "topicId": "draft.mpr",
      "originRefs": [
        {
          "unit": "mp03",
          "sectionId": "real"
        }
      ]
    },
    {
      "prompt": "Uma alta de juros é seguida de redução de um índice de inflação. Qual frase respeita o que foi ensinado?",
      "options": [
        "Toda a redução foi necessariamente causada por essa decisão.",
        "O resultado prova que não existiram outros fatores.",
        "A decisão obrigou todas as empresas a reduzir preços.",
        "É compatível com canais de transmissão, mas a observação isolada não mede toda a causalidade."
      ],
      "answer": 3,
      "explanation": "O caso combina decisão e resultado observado; identificar canais não elimina fatores simultâneos.",
      "optionRationales": [
        "Atribui integralmente causa sem identificação.",
        "Inventa ausência de fatores concorrentes.",
        "Transforma influência em imposição.",
        "Delimita a inferência possível."
      ],
      "recoverySectionIds": [
        "exemplo-integrado",
        "metodo"
      ],
      "objectiveIds": [
        "O3"
      ],
      "id": "mpr.q04",
      "topicId": "draft.mpr",
      "originRefs": [
        {
          "unit": "mp04",
          "sectionId": "exemplo-rotulos"
        }
      ]
    },
    {
      "prompt": "No modelo, hoje o BCB compra título de um banco com compromisso de revendê-lo. A ponta inicial descrita:",
      "options": [
        "Retira recursos do banco para o BCB.",
        "Fornece recursos ao banco contra o título, com retorno acordado.",
        "Extingue a dívida do título automaticamente.",
        "É sempre nova emissão do Tesouro."
      ],
      "answer": 1,
      "explanation": "A compra pelo BCB entrega recursos à contraparte banco; não é necessário inventar emissão.",
      "optionRationales": [
        "Inverte as setas.",
        "Identifica participante e fluxo.",
        "Compra não é extinção automática.",
        "Emissor e vendedor podem diferir."
      ],
      "recoverySectionIds": [
        "metodo",
        "glossario"
      ],
      "objectiveIds": [
        "O3"
      ],
      "id": "mpr.q05",
      "topicId": "draft.mpr",
      "originRefs": [
        {
          "unit": "mp05",
          "sectionId": "exemplo-injecao"
        }
      ]
    },
    {
      "prompt": "Instituição financeira escolhe depósito remunerado no BCB. Em outro caso, um banco central estrangeiro realiza programa de compras de ativos. Qual comparação é adequada?",
      "options": [
        "São necessariamente o mesmo QE.",
        "Ambos são compulsórios por envolver banco central.",
        "Depósito e compra de ativo são relações diferentes; país e condições importam.",
        "Toda remuneração financeira é um tributo."
      ],
      "answer": 2,
      "explanation": "A comparação exige identificar o direito e a obrigação, não apenas o local dos recursos.",
      "optionRationales": [
        "Elimina diferença de instrumento.",
        "Ignora voluntariedade e compra.",
        "Preserva características e contexto.",
        "Confunde pagamento contratual e tributo."
      ],
      "recoverySectionIds": [
        "exemplo-instrumentos"
      ],
      "objectiveIds": [
        "O3"
      ],
      "id": "mpr.q06",
      "topicId": "draft.mpr",
      "originRefs": [
        {
          "unit": "mp06",
          "sectionId": "exemplo-classificacao"
        }
      ]
    },
    {
      "prompt": "Modelo sem juros/ajustes: dívida inicial 200, emissão 60, resgate 50. Depois um investidor revende título existente por 12 a outro. Qual dívida final no modelo?",
      "options": [
        "210; a revenda não acrescenta automaticamente 12 ao estoque do emissor.",
        "222; toda revenda cria nova dívida do emissor.",
        "110; basta somar os fluxos.",
        "12; só importa a última transação."
      ],
      "answer": 0,
      "explanation": "200 + 60 − 50 = 210. A troca de detentor foi separada da emissão na MP-07.",
      "optionRationales": [
        "Considera fluxos do emissor e posição inicial.",
        "Conta troca de titular como nova emissão.",
        "Ignora posição inicial e sinais.",
        "Confunde preço de negociação e estoque total."
      ],
      "recoverySectionIds": [
        "exemplo-integrado",
        "glossario"
      ],
      "objectiveIds": [
        "O4"
      ],
      "id": "mpr.q07",
      "topicId": "draft.mpr",
      "originRefs": [
        {
          "unit": "mp07",
          "sectionId": "exemplo-estoque"
        }
      ]
    },
    {
      "prompt": "Banco F empresta recursos ao banco G. G também tem contratos com clientes. Quem é devedor de F na primeira operação?",
      "options": [
        "Cada cliente de G individualmente, sem contrato adicional.",
        "G, conforme a operação entre os bancos.",
        "O Tesouro, só porque há dois bancos.",
        "Ninguém, pois relações interbancárias não criam obrigações."
      ],
      "answer": 1,
      "explanation": "Não se transfere a obrigação de G aos clientes sem fundamento no caso.",
      "optionRationales": [
        "Troca a contraparte por terceiros.",
        "Identifica o tomador contratado.",
        "Introduz devedor alheio ao enunciado.",
        "Elimina obrigações da relação."
      ],
      "recoverySectionIds": [
        "exemplo-integrado",
        "metodo"
      ],
      "objectiveIds": [
        "O1"
      ],
      "id": "mpr.q08",
      "topicId": "draft.mpr",
      "originRefs": [
        {
          "unit": "mp08",
          "sectionId": "exemplo-interbancario"
        }
      ]
    },
    {
      "prompt": "Fotografia fictícia comparável: taxa anual de 7% no prazo de um ano e 5% no prazo de três. Qual leitura é segura?",
      "options": [
        "A inflação será 5% daqui a três anos.",
        "A Selic cairá exatamente dois pontos no ano seguinte.",
        "O retorno acumulado em três anos é necessariamente 5%.",
        "A taxa anual do prazo de três anos é dois pontos percentuais menor nessa fotografia."
      ],
      "answer": 3,
      "explanation": "O dado relaciona prazos e taxas na mesma data, sem garantir resultados futuros.",
      "optionRationales": [
        "Transforma taxa por prazo em inflação realizada.",
        "Cria trajetória de política futura.",
        "Troca unidade anual por acumulada.",
        "Lê unidades e diferença corretamente."
      ],
      "recoverySectionIds": [
        "exemplo-numerico",
        "glossario"
      ],
      "objectiveIds": [
        "O5"
      ],
      "id": "mpr.q09",
      "topicId": "draft.mpr",
      "originRefs": [
        {
          "unit": "mp09",
          "sectionId": "exemplo-futuro"
        }
      ]
    },
    {
      "prompt": "Após errar e ler o comentário, uma pessoa acerta a mesma questão. Qual registro é honesto?",
      "options": [
        "Aprendeu definitivamente todos os conceitos do bloco.",
        "Já está pronta para aprovação no concurso.",
        "Corrigiu essa resposta com apoio; retenção e transferência ainda precisam de evidências próprias.",
        "A questão se tornou inédita por ter sido respondida de novo."
      ],
      "answer": 2,
      "explanation": "Correção apoiada é útil, mas exposição e familiaridade limitam o que se pode concluir.",
      "optionRationales": [
        "Generaliza um acerto com apoio.",
        "Confunde prática e prontidão.",
        "Distingue apoio, exposição e evidência futura.",
        "Repetição não restaura ineditismo."
      ],
      "recoverySectionIds": [
        "recuperacao",
        "resumo"
      ],
      "objectiveIds": [
        "O5",
        "O6"
      ],
      "id": "mpr.q10",
      "topicId": "draft.mpr",
      "originRefs": [
        {
          "unit": "mpr",
          "sectionId": "recuperacao"
        }
      ]
    }
  ],
  "recall": [
    "Reconstrua o caso integrado sem olhar a classificação e consulte só a origem de um conceito incerto.",
    "Escreva uma justificativa para um distrator: qual dado ele trocou ou inventou?",
    "Depois da correção, altere uma característica e explique por que o raciocínio permanece válido ou muda."
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "mpr-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "mpr.q01": [
        {
          "missionId": "draft.mpr",
          "sectionId": "metodo"
        },
        {
          "missionId": "draft.mpr",
          "sectionId": "glossario"
        }
      ],
      "mpr.q02": [
        {
          "missionId": "draft.mpr",
          "sectionId": "glossario"
        },
        {
          "missionId": "draft.mpr",
          "sectionId": "recuperacao"
        }
      ],
      "mpr.q03": [
        {
          "missionId": "draft.mpr",
          "sectionId": "exemplo-numerico"
        }
      ],
      "mpr.q04": [
        {
          "missionId": "draft.mpr",
          "sectionId": "exemplo-integrado"
        },
        {
          "missionId": "draft.mpr",
          "sectionId": "metodo"
        }
      ],
      "mpr.q05": [
        {
          "missionId": "draft.mpr",
          "sectionId": "metodo"
        },
        {
          "missionId": "draft.mpr",
          "sectionId": "glossario"
        }
      ],
      "mpr.q06": [
        {
          "missionId": "draft.mpr",
          "sectionId": "exemplo-instrumentos"
        }
      ],
      "mpr.q07": [
        {
          "missionId": "draft.mpr",
          "sectionId": "exemplo-integrado"
        },
        {
          "missionId": "draft.mpr",
          "sectionId": "glossario"
        }
      ],
      "mpr.q08": [
        {
          "missionId": "draft.mpr",
          "sectionId": "exemplo-integrado"
        },
        {
          "missionId": "draft.mpr",
          "sectionId": "metodo"
        }
      ],
      "mpr.q09": [
        {
          "missionId": "draft.mpr",
          "sectionId": "exemplo-numerico"
        },
        {
          "missionId": "draft.mpr",
          "sectionId": "glossario"
        }
      ],
      "mpr.q10": [
        {
          "missionId": "draft.mpr",
          "sectionId": "recuperacao"
        },
        {
          "missionId": "draft.mpr",
          "sectionId": "resumo"
        }
      ]
    }
  }
};
export const EDITORIAL = {
  "stage": "B/C/E redigidas; revisão factual/editorial do autor; revisão independente/humana pendente; integração F não iniciada",
  "referenceOnlyProfiles": [
    {
      "id": "bb.agente-comercial.2022-001",
      "item": "Recortes dos itens 2/3/4/12/13/14, sem cobertura integral",
      "status": "histórico; adoção/profundidade pendentes"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Recortes dos itens 3/16/17/18/26/27/278, sem cobertura integral",
      "status": "histórico; adoção/profundidade pendentes"
    }
  ],
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Retomar o exemplo indicado, explicar o erro e resolver um caso alterado; sem alterar a política de revisão do aplicativo."
  },
  "limits": [
    "Revisão condicional ao acesso/ensino de MP-01–09; hoje todas seguem fora do catálogo.",
    "Itens novos em relação às aulas, mas expostos nesta documentação; não são candidatos inéditos para avaliação independente.",
    "Rubrica de recuperação manual, sem diagnóstico automatizado por conceito ou reagendamento adaptativo.",
    "Rascunho fora do catálogo; não é nova forma independente A/B, aceite de fase ou recomendação financeira."
  ]
};
export const ARITHMETIC = [
  {
    "label": "Caso real fator",
    "operation": "divide",
    "values": [
      1.06,
      1.06
    ],
    "expected": 1
  },
  {
    "label": "Caso real taxa",
    "operation": "subtract",
    "values": [
      1,
      1
    ],
    "expected": 0
  },
  {
    "label": "q03 fator",
    "operation": "divide",
    "values": [
      1.03,
      1.05
    ],
    "expected": 0.9809523809523809
  },
  {
    "label": "q07 emissão",
    "operation": "add",
    "values": [
      200,
      60
    ],
    "expected": 260
  },
  {
    "label": "q07 resgate",
    "operation": "subtract",
    "values": [
      260,
      50
    ],
    "expected": 210
  },
  {
    "label": "q09 diferença",
    "operation": "subtract",
    "values": [
      7,
      5
    ],
    "expected": 2
  }
];
