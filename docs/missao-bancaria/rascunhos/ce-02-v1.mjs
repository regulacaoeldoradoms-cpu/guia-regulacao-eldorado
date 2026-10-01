// Rascunho editorial isolado; não importar no runtime.
export const SOURCES = [
  {
    "id": "cvm.ce.acoes",
    "label": "CVM — Ações",
    "url": "https://www.gov.br/investidor/pt-br/investir/tipos-de-investimentos/acoes",
    "version": "Página educativa consultada em 01/10/2026; recorte conceitual",
    "locator": "Participação e retorno; não usar os trechos tributários",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "lei.6404",
    "label": "Lei 6.404/1976 — texto consolidado",
    "url": "https://www.planalto.gov.br/ccivil_03/leis/l6404consol.htm",
    "version": "Texto oficial consolidado consultado em 01/10/2026",
    "locator": "Arts. 15, 17, 109, 110, 110-A e 111: espécies e direitos; sem prazos ou percentuais de dividendos",
    "checkedAt": "2026-10-01"
  }
];

export const CE02_DRAFT = {
  "id": "draft.ce02",
  "topicId": "draft.ce02",
  "editorialKey": "CE-02",
  "candidateBlockId": "banking.capital-exchange",
  "title": "Ações, participação e retorno",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Ler participação e retorno de ações e distinguir direitos básicos sem transformar preferências em ganho garantido.",
  "sourceIds": [
    "cvm.ce.acoes",
    "lei.6404"
  ],
  "sections": [
    {
      "id": "inicio",
      "type": "explanation",
      "heading": "1. Ser acionista",
      "body": "Retome [CE-01](ce-01-v1.md#direitos). A ação representa participação no capital. Cotação é o preço observado numa negociação; não é saldo garantido de uma conta. Para calcular uma participação simples, divida as ações da pessoa pelo total informado e multiplique por 100. A quantidade sozinha não informa poder de controle: espécies, classes, votos e outros acordos podem importar.",
      "sourceIds": [
        "cvm.ce.acoes"
      ]
    },
    {
      "id": "ex-participacao",
      "type": "worked-example",
      "heading": "2. Fração do capital",
      "body": "Uma companhia tem 1.000 ações, todas de uma mesma espécie/classe, e Joana possui 50. Passo 1: 50/1.000 = 0,05. Passo 2: 0,05 × 100 = 5% do capital representado. Isso não significa 50% nem garante comando sobre as decisões. O total usado no denominador deve corresponder ao universo indicado.",
      "sourceIds": []
    },
    {
      "id": "retorno",
      "type": "explanation",
      "heading": "3. Preço e distribuição",
      "body": "O resultado de um investimento em ações pode envolver mudança no preço e pagamentos da companhia, como dividendos, observadas as condições. Nos casos desta aula, sem custos, tributos ou outros eventos, calcule: valor da venda + dividendos recebidos − valor da compra. Dividendo é uma distribuição; não é juros de um empréstimo nem proteção automática contra queda de preço. Rentabilidade do período é resultado dividido pelo desembolso inicial, multiplicado por 100.",
      "sourceIds": [
        "cvm.ce.acoes"
      ]
    },
    {
      "id": "ex-ganho",
      "type": "worked-example",
      "heading": "4. Somar fluxos sem contar duas vezes",
      "body": "Uma pessoa compra 10 ações por R$20 cada, recebe ao todo R$10 de dividendos e vende todas por R$22 cada. Sem custos/tributos/outros eventos: compra R$200; venda R$220; resultado 220 + 10 − 200 = R$30. Rentabilidade: 30/200 × 100 = 15%. O valor da venda não é o lucro inteiro.",
      "sourceIds": []
    },
    {
      "id": "direitos",
      "type": "explanation",
      "heading": "5. Espécies e condições",
      "body": "Ordinárias se associam ao voto; preferenciais têm preferências/vantagens previstas na lei e no estatuto, como prioridade em dividendos ou reembolso do capital, conforme o caso. Não decore 'PN nunca vota': seu voto pode existir ou sofrer restrições; há hipóteses legais de aquisição desse direito. Participar dos lucros e fiscalizar a gestão na forma legal são exemplos de direitos essenciais. Isso não permite exigir qualquer quantia a qualquer momento. Leia a classe, o estatuto e a regra aplicável; a unidade não calcula votos nem dividendos obrigatórios.",
      "sourceIds": [
        "lei.6404"
      ]
    },
    {
      "id": "ex-preferencia",
      "type": "worked-example",
      "heading": "6. Uma prioridade não vira promessa",
      "body": "O estatuto fictício de uma companhia descreve uma classe PN com prioridade no reembolso de capital na liquidação e voto restrito. Passo 1: a prioridade informada trata de liquidação. Passo 2: não transforme isso em dividendo mensal fixo. Passo 3: voto restrito também não equivale a ausência de todo direito do acionista. O caso ensina a ler a condição, sem simular um processo real de liquidação.",
      "sourceIds": [
        "lei.6404"
      ]
    },
    {
      "id": "ex-perda",
      "type": "worked-example",
      "heading": "7. Receber e ainda perder",
      "body": "Compra de 5 ações por R$40 cada; venda por R$36 cada; dividendos totais R$5. Sem outros fluxos, custos ou tributos: compra R$200, venda R$180. Resultado = 180 + 5 − 200 = −R$15; −15/200 × 100 = −7,5%. Houve distribuição e, mesmo assim, resultado negativo.",
      "sourceIds": []
    },
    {
      "id": "limites",
      "type": "explanation",
      "heading": "8. Não extrapole",
      "body": "Preço maior no passado não fixa o próximo preço. Uma foto de participação não prova controle e uma previsão de dividendo não é recebimento já realizado. Os cálculos aqui usam fluxos dados e a mesma quantidade de ações, sem desdobramento, grupamento ou nova subscrição. Se esses eventos aparecerem, será preciso ajustar o caso antes de aplicar a conta simples.",
      "sourceIds": [
        "cvm.ce.acoes"
      ]
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "9. Vocabulário",
      "body": "Acionista: titular da participação. Cotação: preço observado. Dividendo: parcela de resultado distribuída conforme condições. Estatuto: regras da companhia. Espécie/classe: distinções de direitos. Rentabilidade: resultado em relação ao valor aplicado, no período explicitado.",
      "sourceIds": []
    },
    {
      "id": "resumo",
      "type": "summary",
      "heading": "10. Recuperação",
      "body": "Primeiro identifique a participação; depois liste os fluxos e, por fim, confira a regra dos direitos. Ao errar, diga se confundiu quantidade com percentual, venda com ganho ou preferência com promessa. Retome a seção correspondente.",
      "sourceIds": []
    }
  ],
  "questions": [
    {
      "id": "ce02.q01",
      "prompt": "Lia possui 30 das 600 ações de mesma espécie/classe que formam todo o capital. Qual participação?",
      "options": [
        "30%.",
        "50%.",
        "5%.",
        "600%."
      ],
      "answer": 2,
      "explanation": "30/600 × 100 = 5%.",
      "optionRationales": [
        "Confunde quantidade com percentual.",
        "Erra uma casa decimal.",
        "Usa o total adequado.",
        "Inverte a relação."
      ],
      "objectiveIds": [
        "O1"
      ],
      "recoverySectionIds": [
        "ex-participacao"
      ]
    },
    {
      "id": "ce02.q02",
      "prompt": "Compra total R$100; venda R$115; dividendos recebidos R$5. Sem outros fluxos/custos/tributos, qual resultado?",
      "options": [
        "R$20.",
        "R$115.",
        "R$5.",
        "R$120."
      ],
      "answer": 0,
      "explanation": "115 + 5 − 100 = R$20.",
      "optionRationales": [
        "Soma recebimentos e desconta compra.",
        "Omitiu o desembolso.",
        "Omitiu a mudança de preço.",
        "Soma recebimentos sem descontar compra."
      ],
      "objectiveIds": [
        "O2"
      ],
      "recoverySectionIds": [
        "retorno",
        "ex-ganho"
      ]
    },
    {
      "id": "ce02.q03",
      "prompt": "Uma PN tem vantagem descrita no estatuto. Isso permite afirmar que:",
      "options": [
        "nunca votará em qualquer situação.",
        "tem rendimento mensal garantido.",
        "não possui direitos essenciais.",
        "é preciso ler qual preferência e quais condições de voto se aplicam."
      ],
      "answer": 3,
      "explanation": "A vantagem não informa sozinha todos os direitos.",
      "optionRationales": [
        "Ignora hipóteses de voto.",
        "Inventa uma remuneração.",
        "Confunde restrição de voto com perda de todos os direitos.",
        "Relaciona espécie e condições."
      ],
      "objectiveIds": [
        "O3",
        "O4"
      ],
      "recoverySectionIds": [
        "direitos",
        "ex-preferencia"
      ]
    },
    {
      "id": "ce02.q04",
      "prompt": "Compra R$300; venda R$270; dividendos R$12. Sem demais fluxos, qual resultado?",
      "options": [
        "R$12 positivo.",
        "R$18 negativo.",
        "R$42 positivo.",
        "R$30 positivo."
      ],
      "answer": 1,
      "explanation": "270 + 12 − 300 = −18.",
      "optionRationales": [
        "Ignora a perda no preço.",
        "Combina os dois efeitos corretamente.",
        "Soma a queda como ganho.",
        "Troca o sinal e omite dividendos."
      ],
      "objectiveIds": [
        "O2"
      ],
      "recoverySectionIds": [
        "ex-perda"
      ]
    },
    {
      "id": "ce02.q05",
      "prompt": "Fiscalizar a gestão na forma legal é exemplo de:",
      "options": [
        "direito essencial do acionista.",
        "garantia de rentabilidade.",
        "dívida do acionista com a distribuidora.",
        "poder de fixar sozinho qualquer dividendo."
      ],
      "answer": 0,
      "explanation": "O direito tem exercício nos termos da lei.",
      "optionRationales": [
        "Distingue direito de resultado financeiro.",
        "Direito não assegura retorno.",
        "Não há tal dívida no caso.",
        "Participação não concede decisão individual ilimitada."
      ],
      "objectiveIds": [
        "O4"
      ],
      "recoverySectionIds": [
        "direitos"
      ]
    },
    {
      "id": "ce02.q06",
      "prompt": "Resultado de R$40 para desembolso R$200, no período dado. Qual rentabilidade?",
      "options": [
        "40%.",
        "5%.",
        "20%.",
        "200%."
      ],
      "answer": 2,
      "explanation": "40/200 × 100 = 20%.",
      "optionRationales": [
        "Usa o resultado em reais como percentual.",
        "Inverte a divisão.",
        "Relaciona resultado ao desembolso.",
        "Usa o desembolso como percentual."
      ],
      "objectiveIds": [
        "O2"
      ],
      "recoverySectionIds": [
        "ex-ganho"
      ]
    },
    {
      "id": "ce02.q07",
      "prompt": "Uma ação valorizou no ano anterior. Qual conclusão é sustentada apenas por esse fato?",
      "options": [
        "O próximo ano repetirá a alta.",
        "Houve valorização passada; o retorno futuro permanece incerto.",
        "Seu dividendo será necessariamente fixo.",
        "Todo comprador terá o mesmo ganho."
      ],
      "answer": 1,
      "explanation": "O dado é histórico, não promessa.",
      "optionRationales": [
        "Extrapola o período.",
        "Preserva o limite da informação.",
        "Inventa condição de distribuição.",
        "Ignora preço/data de entrada e saída."
      ],
      "objectiveIds": [
        "O5"
      ],
      "recoverySectionIds": [
        "limites"
      ]
    },
    {
      "id": "ce02.q08",
      "prompt": "Um relatório informa somente que Bruno possui 100 ações. Qual informação falta para calcular sua fração do capital no caso simples?",
      "options": [
        "O nome do aplicativo.",
        "A cotação de ontem.",
        "O banco onde recebe salário.",
        "O total de ações que compõem esse capital."
      ],
      "answer": 3,
      "explanation": "Sem o denominador, a quantidade não vira participação percentual.",
      "optionRationales": [
        "Canal não fornece o total.",
        "Preço não fornece quantidade total.",
        "Não define o universo de ações.",
        "Fornece o denominador necessário."
      ],
      "objectiveIds": [
        "O1",
        "O5"
      ],
      "recoverySectionIds": [
        "inicio",
        "ex-participacao"
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
    "editorialPass": "ce02-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "ce02.q01": [
        {
          "missionId": "draft.ce02",
          "sectionId": "ex-participacao"
        }
      ],
      "ce02.q02": [
        {
          "missionId": "draft.ce02",
          "sectionId": "retorno"
        },
        {
          "missionId": "draft.ce02",
          "sectionId": "ex-ganho"
        }
      ],
      "ce02.q03": [
        {
          "missionId": "draft.ce02",
          "sectionId": "direitos"
        },
        {
          "missionId": "draft.ce02",
          "sectionId": "ex-preferencia"
        }
      ],
      "ce02.q04": [
        {
          "missionId": "draft.ce02",
          "sectionId": "ex-perda"
        }
      ],
      "ce02.q05": [
        {
          "missionId": "draft.ce02",
          "sectionId": "direitos"
        }
      ],
      "ce02.q06": [
        {
          "missionId": "draft.ce02",
          "sectionId": "ex-ganho"
        }
      ],
      "ce02.q07": [
        {
          "missionId": "draft.ce02",
          "sectionId": "limites"
        }
      ],
      "ce02.q08": [
        {
          "missionId": "draft.ce02",
          "sectionId": "inicio"
        },
        {
          "missionId": "draft.ce02",
          "sectionId": "ex-participacao"
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
    "O1": "Calcular participação quando todas as ações relevantes são dadas.",
    "O2": "Separar preço, dividendo e resultado da operação.",
    "O3": "Distinguir ordinárias/preferenciais sem regras universais falsas.",
    "O4": "Localizar direitos e condições no estatuto/lei.",
    "O5": "Identificar limites dos dados e da rentabilidade passada.",
    "O6": "Recuperar a confusão conceitual pela seção de origem e reconstruir o caso."
  },
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Retomar as seções por questão, explicar o erro e refazer o raciocínio; sem indicador novo de domínio."
  },
  "limits": [
    "Sem tributação, valuation, porcentagem obrigatória de dividendos, voto plural detalhado ou análise de empresa real.",
    "Casos e valores fictícios; educação geral, sem recomendação de investimento ou procedimento para caso real. Não representa cobertura integral dos itens históricos.",
    "Prática exposta, não avaliação independente. IDs editoriais, sem XP/ordem/desbloqueio; publicação.status draft e nenhuma importação no runtime.",
    "Fontes novas consultadas em 01/10/2026; consultas reaproveitadas preservam a data original. Confirmar mudanças normativas pertinentes antes de publicação."
  ]
};

export const ARITHMETIC = [
  {
    "label": "participação",
    "operation": "divide",
    "values": [
      50,
      1000
    ],
    "expected": 0.05
  },
  {
    "label": "percentual",
    "operation": "multiply",
    "values": [
      0.05,
      100
    ],
    "expected": 5
  },
  {
    "label": "compra",
    "operation": "multiply",
    "values": [
      10,
      20
    ],
    "expected": 200
  },
  {
    "label": "venda",
    "operation": "multiply",
    "values": [
      10,
      22
    ],
    "expected": 220
  },
  {
    "label": "recebimentos",
    "operation": "add",
    "values": [
      220,
      10
    ],
    "expected": 230
  },
  {
    "label": "resultado",
    "operation": "subtract",
    "values": [
      230,
      200
    ],
    "expected": 30
  },
  {
    "label": "taxa",
    "operation": "divide",
    "values": [
      30,
      200
    ],
    "expected": 0.15
  },
  {
    "label": "taxa %",
    "operation": "multiply",
    "values": [
      0.15,
      100
    ],
    "expected": 15
  },
  {
    "label": "perda compra",
    "operation": "multiply",
    "values": [
      5,
      40
    ],
    "expected": 200
  },
  {
    "label": "perda venda",
    "operation": "multiply",
    "values": [
      5,
      36
    ],
    "expected": 180
  },
  {
    "label": "perda recebimento",
    "operation": "add",
    "values": [
      180,
      5
    ],
    "expected": 185
  },
  {
    "label": "perda",
    "operation": "subtract",
    "values": [
      185,
      200
    ],
    "expected": -15
  },
  {
    "label": "perda taxa",
    "operation": "divide",
    "values": [
      -15,
      200
    ],
    "expected": -0.075
  },
  {
    "label": "perda %",
    "operation": "multiply",
    "values": [
      -0.075,
      100
    ],
    "expected": -7.5
  },
  {
    "label": "q1",
    "operation": "divide",
    "values": [
      30,
      600
    ],
    "expected": 0.05
  },
  {
    "label": "q2 soma",
    "operation": "add",
    "values": [
      115,
      5
    ],
    "expected": 120
  },
  {
    "label": "q2",
    "operation": "subtract",
    "values": [
      120,
      100
    ],
    "expected": 20
  },
  {
    "label": "q4 soma",
    "operation": "add",
    "values": [
      270,
      12
    ],
    "expected": 282
  },
  {
    "label": "q4",
    "operation": "subtract",
    "values": [
      282,
      300
    ],
    "expected": -18
  },
  {
    "label": "q6",
    "operation": "divide",
    "values": [
      40,
      200
    ],
    "expected": 0.2
  }
];
