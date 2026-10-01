// Rascunho editorial isolado; não importar no runtime.
export const SOURCES = [
  {
    "id": "cvm.ce.debentures",
    "label": "CVM — Debêntures",
    "url": "https://www.gov.br/investidor/pt-br/investir/tipos-de-investimentos/debentures",
    "version": "Página educativa consultada em 01/10/2026",
    "locator": "Credor da emissora, debênture simples, remuneração e risco; sem tributação ou ritos de oferta",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "cvm.ce.bancarios",
    "label": "CVM — Títulos bancários",
    "url": "https://www.gov.br/investidor/pt-br/investir/tipos-de-investimentos/titulos-bancarios",
    "version": "Página educativa consultada em 01/10/2026",
    "locator": "Somente captação bancária/CDB; sem FGC, tributação, prazos mínimos ou supervisão de outros produtos",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "cvm.ce.caracteristicas",
    "label": "CVM — Características dos investimentos",
    "url": "https://www.gov.br/investidor/pt-br/investir/antes-de-investir/entenda-as-caracteristicas-dos-investimentos",
    "version": "Página de 2022, consultada em 01/10/2026",
    "locator": "Renda fixa/variável, remuneração e necessidade de avaliar risco/liquidez",
    "checkedAt": "2026-10-01"
  }
];

export const CE03_DRAFT = {
  "id": "draft.ce03",
  "topicId": "draft.ce03",
  "editorialKey": "CE-03",
  "candidateBlockId": "banking.capital-exchange",
  "title": "Títulos de dívida e quem deve pagar",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Reconhecer emissor/devedor, forma de remuneração e prazo em títulos de dívida, sem confundir taxa contratada, liquidez e garantia.",
  "sourceIds": [
    "cvm.ce.debentures",
    "cvm.ce.bancarios",
    "cvm.ce.caracteristicas"
  ],
  "sections": [
    {
      "id": "inicio",
      "type": "explanation",
      "heading": "1. Comece pelo emissor",
      "body": "Retome [a relação de dívida](ce-01-v1.md#direitos). O título identifica uma obrigação e suas condições. No CDB, o banco emissor capta recursos e assume a obrigação correspondente; a plataforma que apresenta o produto pode ser outra empresa. Na debênture simples, a companhia emissora é devedora; o investidor não se torna acionista. Identifique o emissor antes de comparar taxas.",
      "sourceIds": [
        "cvm.ce.debentures",
        "cvm.ce.bancarios"
      ]
    },
    {
      "id": "ex-emissor",
      "type": "worked-example",
      "heading": "2. Uma tela, dois devedores",
      "body": "A plataforma fictícia Zeta oferece um CDB do Banco Rio e uma debênture simples da Companhia Serra. Passo 1: Zeta é o canal descrito. Passo 2: no CDB, o emissor é Rio; na debênture, Serra. Passo 3: taxas iguais não tornam os riscos ou obrigações dos dois emissores idênticos.",
      "sourceIds": [
        "cvm.ce.debentures",
        "cvm.ce.bancarios"
      ]
    },
    {
      "id": "contrato",
      "type": "explanation",
      "heading": "3. O que ler nas condições",
      "body": "Principal é o valor emprestado; juros são remuneração; vencimento é a data prevista para cumprir a obrigação contratada. Há títulos com pagamentos intermediários, mas os exemplos abaixo pagam tudo no final. Renda fixa significa conhecer a regra de remuneração na contratação, não ausência de risco. Prefixada: taxa definida. Pós-fixada: regra vinculada a referência futura. Combinada: componente fixo e variável. O valor efetivo depende de cumprir as condições e de o devedor pagar.",
      "sourceIds": [
        "cvm.ce.caracteristicas"
      ]
    },
    {
      "id": "ex-prefixada",
      "type": "worked-example",
      "heading": "4. Uma taxa para um período",
      "body": "Contrato fictício: R$1.000 por um único período, 8% nesse período, sem pagamentos intermediários. Sem custos/tributos e supondo adimplemento: juros = 1.000 × 0,08 = R$80; total = R$1.080. Não transforme 8% do período em taxa mensal ou anual sem saber sua duração. O cálculo é do valor contratado, não prova de solvência.",
      "sourceIds": []
    },
    {
      "id": "ex-indice",
      "type": "worked-example",
      "heading": "5. Regra conhecida, valor ainda variável",
      "body": "Título fictício promete, para um período, principal multiplicado pelo fator de um índice ainda não conhecido. A regra é pós-fixada. Se o fator realizado for 1,04, R$500 × 1,04 = R$520. Se for 1,02, serão R$510. A regra já existia antes; os dois valores ilustram cenários, sem escolher uma previsão. Não são taxas atuais de CDI ou Selic.",
      "sourceIds": [
        "cvm.ce.caracteristicas"
      ]
    },
    {
      "id": "saida",
      "type": "explanation",
      "heading": "6. Vencimento não é disponibilidade diária",
      "body": "O vencimento e as possibilidades de saída antes dele são informações diferentes. Pode haver condições específicas de resgate/recompra ou negociação com outro investidor. Não presuma comprador, preço ou prazo de recebimento. Um título de renda fixa pode ser vendido antes do vencimento por menos que o valor aplicado. Taxa contratada, pagamento previsto e preço de negociação são grandezas distintas.",
      "sourceIds": [
        "cvm.ce.caracteristicas",
        "cvm.ce.debentures"
      ]
    },
    {
      "id": "ex-saida",
      "type": "worked-example",
      "heading": "7. Uma saída por valor menor",
      "body": "Uma pessoa aplicou R$1.000 em um título com pagamento contratual final de R$1.100. Antes do vencimento, vende-o a outro investidor por R$970, sem custos/tributos ou recebimentos anteriores. Resultado realizado = 970 − 1.000 = −R$30. Não recebeu os R$1.100 previstos para outra data; a venda não era pagamento final pelo emissor.",
      "sourceIds": []
    },
    {
      "id": "comparar",
      "type": "explanation",
      "heading": "8. Compare condições equivalentes",
      "body": "Uma taxa maior não resolve a comparação se período, emissor, custos, risco ou saída forem diferentes. Não some mecanicamente taxas de componentes combinados: a regra pode exigir fatores. Aqui apenas reconhecemos a estrutura; o contrato precisa informar o método. Nome do índice, sozinho, também não informa todos os termos. A aula não recomenda um produto.",
      "sourceIds": [
        "cvm.ce.caracteristicas"
      ]
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "9. Vocabulário",
      "body": "CDB: certificado de depósito bancário. Debênture simples: dívida da companhia sem conversão em ação. Principal: valor emprestado. Indexador: referência usada na regra. Adimplemento: cumprimento da obrigação. Preço de saída: valor obtido na negociação.",
      "sourceIds": []
    },
    {
      "id": "resumo",
      "type": "summary",
      "heading": "10. Recuperação",
      "body": "Anote emissor, principal, forma de remuneração, período, pagamentos e saída. Refaça a conta apenas com hipóteses fornecidas. Ao errar, separe confusão sobre quem deve pagar daquela sobre quando e quanto será recebido.",
      "sourceIds": []
    }
  ],
  "questions": [
    {
      "id": "ce03.q01",
      "prompt": "Um CDB do Banco Azul aparece no aplicativo de uma distribuidora. Quem é o emissor indicado?",
      "options": [
        "A distribuidora necessariamente.",
        "O Banco Azul.",
        "O investidor.",
        "Toda instituição que usa o aplicativo."
      ],
      "answer": 1,
      "explanation": "Canal de distribuição e emissor podem ser distintos.",
      "optionRationales": [
        "Troca serviço por emissão.",
        "Segue a identificação do produto.",
        "Investidor é credor no caso.",
        "Amplia a obrigação sem fundamento."
      ],
      "objectiveIds": [
        "O1"
      ],
      "recoverySectionIds": [
        "inicio",
        "ex-emissor"
      ]
    },
    {
      "id": "ce03.q02",
      "prompt": "R$800 a 5% por um período, pago no fim, sem custos/tributos e com cumprimento do contrato. Qual total?",
      "options": [
        "R$40.",
        "R$805.",
        "R$4.000.",
        "R$840."
      ],
      "answer": 3,
      "explanation": "Juros de R$40 somados ao principal.",
      "optionRationales": [
        "Só os juros.",
        "Confunde percentual com cinco reais.",
        "Multiplica por 5 em vez de 0,05.",
        "800 × 0,05 + 800."
      ],
      "objectiveIds": [
        "O2"
      ],
      "recoverySectionIds": [
        "ex-prefixada"
      ]
    },
    {
      "id": "ce03.q03",
      "prompt": "Um título tem regra de remuneração ligada a um índice futuro. Ele é:",
      "options": [
        "pós-fixado, se essa é a regra descrita.",
        "necessariamente ação.",
        "sempre prefixado.",
        "livre de risco."
      ],
      "answer": 0,
      "explanation": "A referência variável caracteriza a regra pós-fixada.",
      "optionRationales": [
        "Distingue regra conhecida e índice futuro.",
        "Troca dívida por participação.",
        "O valor do índice não está fixado.",
        "A regra não elimina risco."
      ],
      "objectiveIds": [
        "O3"
      ],
      "recoverySectionIds": [
        "contrato",
        "ex-indice"
      ]
    },
    {
      "id": "ce03.q04",
      "prompt": "Saber apenas que um título vence em dois anos permite concluir que:",
      "options": [
        "há resgate diário obrigatório.",
        "qualquer venda antecipada será sem perda.",
        "falta conhecer as condições de saída antecipada.",
        "o emissor é a bolsa."
      ],
      "answer": 2,
      "explanation": "Prazo final não informa liquidez antes dele.",
      "optionRationales": [
        "Inventa condição de resgate.",
        "Preço antecipado pode variar.",
        "Reconhece a informação ausente.",
        "Prazo não identifica emissor."
      ],
      "objectiveIds": [
        "O4",
        "O5"
      ],
      "recoverySectionIds": [
        "saida"
      ]
    },
    {
      "id": "ce03.q05",
      "prompt": "Compra R$600; venda antecipada R$570; nenhum outro fluxo/custo/tributo. Resultado?",
      "options": [
        "R$570 de lucro.",
        "R$30 de lucro.",
        "Zero, por ser renda fixa.",
        "R$30 de perda."
      ],
      "answer": 3,
      "explanation": "570 − 600 = −30.",
      "optionRationales": [
        "Confunde recebimento e resultado.",
        "Inverte o sinal.",
        "Renda fixa não impede perda na venda.",
        "Desconta o desembolso."
      ],
      "objectiveIds": [
        "O4"
      ],
      "recoverySectionIds": [
        "ex-saida"
      ]
    },
    {
      "id": "ce03.q06",
      "prompt": "Uma fórmula combina inflação e componente fixo. Antes de calcular, é preciso:",
      "options": [
        "somar sempre os percentuais.",
        "ler a regra de composição e o período contratados.",
        "usar a taxa de ontem sem perguntar período.",
        "tratar como ação porque há inflação."
      ],
      "answer": 1,
      "explanation": "A denominação não define sozinha a operação matemática.",
      "optionRationales": [
        "Pode exigir composição por fatores.",
        "Evita regra inventada.",
        "Troca período e dado.",
        "Uma referência variável não muda dívida para participação."
      ],
      "objectiveIds": [
        "O3",
        "O5"
      ],
      "recoverySectionIds": [
        "comparar"
      ]
    },
    {
      "id": "ce03.q07",
      "prompt": "Debênture simples e ação da mesma companhia:",
      "options": [
        "criam direitos idênticos.",
        "são ambas depósitos bancários.",
        "criam, respectivamente, relação de crédito e participação.",
        "transferem a dívida para a distribuidora."
      ],
      "answer": 2,
      "explanation": "A identidade da companhia não apaga a natureza do instrumento.",
      "optionRationales": [
        "Ignora a diferença entre dívida e capital.",
        "Nenhuma foi descrita como depósito.",
        "Mantém as duas relações.",
        "Distribuição não transfere dívida."
      ],
      "objectiveIds": [
        "O1"
      ],
      "recoverySectionIds": [
        "inicio"
      ]
    },
    {
      "id": "ce03.q08",
      "prompt": "Dois títulos anunciam 10%, sem informar prazo e condições. É correto:",
      "options": [
        "pedir período, regra, risco e condições antes de comparar.",
        "escolher o primeiro por ordem de anúncio.",
        "concluir que pagam a mesma quantia na mesma data.",
        "garantir que ambos permitem saída diária."
      ],
      "answer": 0,
      "explanation": "O percentual isolado é insuficiente.",
      "optionRationales": [
        "Lista dados necessários.",
        "Ordem não compara condições.",
        "Faltam principal, prazo e regra.",
        "A taxa não prova liquidez."
      ],
      "objectiveIds": [
        "O5"
      ],
      "recoverySectionIds": [
        "comparar"
      ]
    }
  ],
  "recall": [
    "Explique os conceitos sem consultar e confira a seção de origem.",
    "Refaça o exemplo, separando dados, hipótese e conclusão.",
    "Quando errar, nomeie a confusão e retome as seções indicadas antes de tentar novamente."
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "ce03-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "ce03.q01": [
        {
          "missionId": "draft.ce03",
          "sectionId": "inicio"
        },
        {
          "missionId": "draft.ce03",
          "sectionId": "ex-emissor"
        }
      ],
      "ce03.q02": [
        {
          "missionId": "draft.ce03",
          "sectionId": "ex-prefixada"
        }
      ],
      "ce03.q03": [
        {
          "missionId": "draft.ce03",
          "sectionId": "contrato"
        },
        {
          "missionId": "draft.ce03",
          "sectionId": "ex-indice"
        }
      ],
      "ce03.q04": [
        {
          "missionId": "draft.ce03",
          "sectionId": "saida"
        }
      ],
      "ce03.q05": [
        {
          "missionId": "draft.ce03",
          "sectionId": "ex-saida"
        }
      ],
      "ce03.q06": [
        {
          "missionId": "draft.ce03",
          "sectionId": "comparar"
        }
      ],
      "ce03.q07": [
        {
          "missionId": "draft.ce03",
          "sectionId": "inicio"
        }
      ],
      "ce03.q08": [
        {
          "missionId": "draft.ce03",
          "sectionId": "comparar"
        }
      ]
    }
  }
};

export const EDITORIAL = {
  "stage": "Rascunho fora do catálogo; revisão independente agrupada e humana pendentes",
  "referenceOnlyProfiles": [
    {
      "id": "bb.agente-comercial.2022-001",
      "item": "Itens 5 (investimentos) e 6",
      "status": "histórico; referenceOnly"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Itens 19 (investimentos) e 20",
      "status": "histórico; referenceOnly"
    }
  ],
  "objectives": {
    "O1": "Distinguir dívida bancária de dívida de companhia.",
    "O2": "Ler principal, juros e vencimento.",
    "O3": "Classificar remuneração prefixada, pós-fixada e combinada.",
    "O4": "Separar valor contratual e preço de saída antecipada.",
    "O5": "Identificar informações necessárias antes de comparar títulos.",
    "O6": "Recuperar a confusão conceitual pela seção de origem e reconstruir o caso."
  },
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Retomar as seções por questão, explicar o erro e refazer o raciocínio; sem indicador novo de domínio."
  },
  "limits": [
    "Somente CDB e debênture simples como exemplos; sem FGC, tributação, garantias especiais, preço de título por desconto ou lista exaustiva de instrumentos.",
    "Casos e valores fictícios; educação geral, sem recomendação de investimento ou procedimento para caso real. Não representa cobertura integral dos itens históricos.",
    "Prática exposta, não avaliação independente. IDs editoriais, sem XP/ordem/desbloqueio; publicação.status draft e nenhuma importação no runtime.",
    "Fontes novas consultadas em 01/10/2026; consultas reaproveitadas preservam a data original. Confirmar mudanças normativas pertinentes antes de publicação."
  ]
};

export const ARITHMETIC = [
  {
    "label": "juros",
    "operation": "multiply",
    "values": [
      1000,
      0.08
    ],
    "expected": 80
  },
  {
    "label": "total",
    "operation": "add",
    "values": [
      1000,
      80
    ],
    "expected": 1080
  },
  {
    "label": "índice A",
    "operation": "multiply",
    "values": [
      500,
      1.04
    ],
    "expected": 520
  },
  {
    "label": "índice B",
    "operation": "multiply",
    "values": [
      500,
      1.02
    ],
    "expected": 510
  },
  {
    "label": "saída",
    "operation": "subtract",
    "values": [
      970,
      1000
    ],
    "expected": -30
  },
  {
    "label": "q2 juros",
    "operation": "multiply",
    "values": [
      800,
      0.05
    ],
    "expected": 40
  },
  {
    "label": "q2 total",
    "operation": "add",
    "values": [
      800,
      40
    ],
    "expected": 840
  },
  {
    "label": "q5",
    "operation": "subtract",
    "values": [
      570,
      600
    ],
    "expected": -30
  }
];
