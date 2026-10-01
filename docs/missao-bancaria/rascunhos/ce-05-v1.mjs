// Rascunho editorial isolado; não importar no runtime.
export const SOURCES = [
  {
    "id": "cvm.ce.risco",
    "label": "CVM — Risco e a relação risco x retorno",
    "url": "https://www.gov.br/investidor/pt-br/investir/antes-de-investir/entenda-as-caracteristicas-dos-investimentos/risco-e-a-relacao-risco-x-retorno",
    "version": "Página educacional de 15/09/2022; consulta em 01/10/2026",
    "locator": "Riscos de crédito, mercado e liquidez; retorno esperado versus realizado. Sem modelos estatísticos.",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "cvm.ce.liquidez",
    "url": "https://www.gov.br/investidor/pt-br/investir/antes-de-investir/entenda-as-caracteristicas-dos-investimentos/liquidez",
    "checkedAt": "2026-10-01",
    "locator": "Liquidez como possibilidade de converter investimento em dinheiro, considerando prazo e preço.",
    "label": "CVM — Liquidez",
    "version": "Página educacional de 15/09/2022; consulta em 01/10/2026"
  }
];

export const CE05_DRAFT = {
  "id": "draft.ce05",
  "topicId": "draft.ce05",
  "editorialKey": "CE-05",
  "candidateBlockId": "banking.capital-exchange",
  "title": "Risco, liquidez e retorno: comparar sem prometer",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Distinguir os três riscos básicos e calcular um resultado líquido sob custos informados, sem transformar expectativa em garantia.",
  "sourceIds": [
    "cvm.ce.risco",
    "cvm.ce.liquidez"
  ],
  "sections": [
    {
      "id": "inicio",
      "type": "explanation",
      "heading": "1. Qual pergunta vem antes da taxa?",
      "body": "Depois de identificar ação, título ou cota, pergunte o que pode impedir o resultado esperado e quando o dinheiro estará disponível. Uma promessa de pagamento e uma possibilidade de venda são coisas diferentes. Nesta aula todos os valores são fictícios e as comparações usam o mesmo período e moeda.",
      "sourceIds": []
    },
    {
      "id": "riscos",
      "type": "explanation",
      "heading": "2. Três riscos, três perguntas",
      "body": "Crédito: a contraparte cumprirá a obrigação? Mercado: quanto pode mudar o preço do ativo? Liquidez: será possível convertê-lo em dinheiro no prazo necessário sem aceitar uma condição desfavorável? Os riscos podem coexistir. Renda fixa e negociação frequente não afastam todos eles.",
      "sourceIds": [
        "cvm.ce.risco",
        "cvm.ce.liquidez"
      ]
    },
    {
      "id": "ex-riscos",
      "type": "worked-example",
      "heading": "3. Exemplo resolvido: nomear o evento",
      "body": "No caso A, a emissora deixa de pagar a parcela contratada: o evento é de crédito. No B, o título cai de preço após mudança nas taxas do mercado: mercado. No C, não aparece comprador nas condições pretendidas e a venda urgente exige desconto: liquidez. Classificamos o fato destacado, sem declarar que os outros riscos desapareceram.",
      "sourceIds": [
        "cvm.ce.risco"
      ]
    },
    {
      "id": "retorno",
      "type": "explanation",
      "heading": "4. Esperado não é recebido",
      "body": "Uma projeção de retorno descreve uma expectativa. O retorno realizado depende do que efetivamente ocorreu. Uma taxa contratada também precisa ser interpretada com as condições do contrato e seu cumprimento. Resultado favorável passado não assegura repetição.",
      "sourceIds": [
        "cvm.ce.risco"
      ]
    },
    {
      "id": "ex-liquidez",
      "type": "worked-example",
      "heading": "5. Exemplo resolvido: venda urgente",
      "body": "Caio tem um ativo que poderia negociar por R$ 1.000 em condições normais do caso. Só há uma oferta imediata de R$ 940, e ele aceita por precisar do dinheiro hoje. A diferença é R$ 60. O exemplo destaca o custo da urgência; não prova inadimplência do emissor nem cria uma regra de desconto para o mercado.",
      "sourceIds": [
        "cvm.ce.liquidez"
      ]
    },
    {
      "id": "liquido",
      "type": "explanation",
      "heading": "6. Do ganho bruto ao líquido",
      "body": "Nos exercícios: ganho bruto = total recebido antes dos custos menos aplicação inicial; ganho líquido = ganho bruto menos os custos expressamente informados. Taxa líquida = ganho líquido dividido pela aplicação inicial, vezes 100. Não desconte novamente um custo que o enunciado já tenha retirado. Impostos só entram quando houver valor ou hipótese explicitamente dada; não se presume uma alíquota.",
      "sourceIds": []
    },
    {
      "id": "ex-liquido",
      "type": "worked-example",
      "heading": "7. Exemplo resolvido: custos em reais",
      "body": "Uma aplicação inicial de R$ 1.000 gera recebimento bruto de R$ 1.120 no fim do período. Todos os custos do exercício somam R$ 20. Ganho bruto: 1.120 − 1.000 = R$ 120. Ganho líquido: 120 − 20 = R$ 100. Taxa líquida: 100 ÷ 1.000 × 100 = 10%. Não se calcula 10% sobre R$ 1.120.",
      "sourceIds": []
    },
    {
      "id": "diversificar",
      "type": "explanation",
      "heading": "8. Diversificação tem limites",
      "body": "Distribuir exposições entre diferentes emissores e fatores de risco pode reduzir concentração, mas não garante lucro nem elimina choques que atingem vários ativos. Contar aplicativos ou nomes comerciais é insuficiente: é preciso identificar a exposição econômica. A comparação também deve considerar prazo, moeda, liquidez e custos, além da taxa.",
      "sourceIds": [
        "cvm.ce.risco",
        "cvm.ce.liquidez"
      ]
    },
    {
      "id": "ex-concentracao",
      "type": "worked-example",
      "heading": "9. Exemplo resolvido: duas telas, um emissor",
      "body": "Rita compra R$ 600 de um CDB do Banco Aurora numa plataforma e R$ 400 de outro CDB do mesmo banco em outra. A soma exposta ao emissor continua R$ 1.000. Duas plataformas não significam dois devedores. Dividir a exposição entre emissores distintos mudaria a concentração, sem tornar o conjunto livre de risco.",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "10. Vocabulário essencial",
      "body": "Risco de crédito: possibilidade de descumprimento da obrigação. Risco de mercado: variação de preço. Risco de liquidez: dificuldade de converter em dinheiro no prazo e condições pretendidos. Ganho líquido: ganho após os custos considerados. Diversificação: distribuição de exposições, sem garantia contra perdas.",
      "sourceIds": []
    },
    {
      "id": "retomada",
      "type": "summary",
      "heading": "11. Síntese e recuperação",
      "body": "Se confundiu o evento, volte a riscos e ex-riscos. Se confundiu promessa com resultado, retorne a retorno. Se errou a base percentual ou descontou duas vezes, refaça liquido e ex-liquido. Se contou telas como emissores, leia diversificar e ex-concentracao e explique quem deve o dinheiro.",
      "sourceIds": []
    }
  ],
  "questions": [
    {
      "id": "ce05.q01",
      "prompt": "Uma emissora não paga os juros contratados na data prevista. Qual risco o fato destaca?",
      "options": [
        "Somente liquidez.",
        "Ausência de risco por ser dívida.",
        "Exclusivamente oscilação do preço de bolsa.",
        "Crédito."
      ],
      "answer": 3,
      "explanation": "O evento descrito é o descumprimento da obrigação pela emissora.",
      "optionRationales": [
        "Não foi descrita uma dificuldade de venda.",
        "A forma de dívida não elimina inadimplência.",
        "O caso descreve falta de pagamento, não apenas preço.",
        "Correta: há falha no pagamento devido."
      ],
      "objectiveIds": [
        "O1"
      ],
      "recoverySectionIds": [
        "riscos",
        "ex-riscos"
      ]
    },
    {
      "id": "ce05.q02",
      "prompt": "Um título tem negociação frequente, mas seu preço cai quando mudam as taxas do mercado. O que se conclui?",
      "options": [
        "A frequência de negócios impede perdas.",
        "Há manifestação de risco de mercado.",
        "O emissor necessariamente deixou de pagar.",
        "Toda renda fixa deixa de ser dívida quando oscila."
      ],
      "answer": 1,
      "explanation": "Preço oscilante e possibilidade de vender são dimensões diferentes.",
      "optionRationales": [
        "Negociar com facilidade não fixa o preço.",
        "Correta: o evento é a mudança de preço.",
        "A oscilação não prova inadimplência.",
        "A oscilação não altera a natureza do instrumento."
      ],
      "objectiveIds": [
        "O1"
      ],
      "recoverySectionIds": [
        "riscos",
        "ex-riscos"
      ]
    },
    {
      "id": "ce05.q03",
      "prompt": "Uma projeção anuncia retorno de 12% no período. Qual interpretação é defensável?",
      "options": [
        "O ganho de 12% já foi realizado.",
        "Maior projeção elimina perdas.",
        "É uma expectativa, que pode diferir do resultado realizado.",
        "O percentual, sozinho, prova a liquidez diária."
      ],
      "answer": 2,
      "explanation": "Projeção não é comprovante de recebimento nem informação suficiente sobre liquidez.",
      "optionRationales": [
        "Falta o resultado efetivamente ocorrido.",
        "A projeção não elimina risco.",
        "Correta: esperado e realizado são distintos.",
        "A taxa não determina prazo de saída."
      ],
      "objectiveIds": [
        "O2"
      ],
      "recoverySectionIds": [
        "retorno"
      ]
    },
    {
      "id": "ce05.q04",
      "prompt": "Aplicação inicial R$ 500; recebimento bruto final R$ 560; custos totais R$ 10. Qual a taxa líquida do período?",
      "options": [
        "10%.",
        "12%.",
        "2%.",
        "10,71%."
      ],
      "answer": 0,
      "explanation": "O ganho líquido é 560 − 500 − 10 = R$ 50; 50 ÷ 500 = 10%.",
      "optionRationales": [
        "Correta: o capital inicial é a base.",
        "12% é a taxa bruta, antes dos R$ 10.",
        "2% representa apenas a proporção dos custos.",
        "Usar o recebimento final como base não segue a fórmula."
      ],
      "objectiveIds": [
        "O3"
      ],
      "recoverySectionIds": [
        "liquido",
        "ex-liquido"
      ]
    },
    {
      "id": "ce05.q05",
      "prompt": "R$ 300 e R$ 700 de CDBs do mesmo banco foram comprados em aplicativos diferentes. O que ocorreu?",
      "options": [
        "A exposição ficou dividida entre dois bancos.",
        "A exposição ao mesmo emissor soma R$ 1.000.",
        "O risco de crédito foi eliminado.",
        "Os aplicativos se tornaram os devedores dos CDBs."
      ],
      "answer": 1,
      "explanation": "A identidade do emissor, e não o número de telas, determina a concentração descrita.",
      "optionRationales": [
        "O enunciado informa um único banco emissor.",
        "Correta: 300 + 700 continuam no mesmo emissor.",
        "Não há eliminação do risco.",
        "O canal de compra não troca o emissor."
      ],
      "objectiveIds": [
        "O4"
      ],
      "recoverySectionIds": [
        "diversificar",
        "ex-concentracao"
      ]
    },
    {
      "id": "ce05.q06",
      "prompt": "Para vender imediatamente, alguém aceita desconto porque não há outros compradores nas condições desejadas. Qual dimensão o caso enfatiza?",
      "options": [
        "Direito de voto.",
        "Pagamento garantido de dividendos.",
        "Inadimplência comprovada.",
        "Liquidez."
      ],
      "answer": 3,
      "explanation": "A urgência e a dificuldade de negociar nas condições pretendidas são o foco.",
      "optionRationales": [
        "Não se discute participação societária.",
        "O caso não envolve dividendos.",
        "A necessidade de desconto não prova descumprimento.",
        "Correta: prazo de saída e preço se relacionam."
      ],
      "objectiveIds": [
        "O1"
      ],
      "recoverySectionIds": [
        "ex-liquidez",
        "riscos"
      ]
    },
    {
      "id": "ce05.q07",
      "prompt": "Sobre uma carteira com diferentes emissores e fatores de risco, qual conclusão é correta?",
      "options": [
        "Pode ter menor concentração, mas continua sujeita a perdas.",
        "Nunca terá prejuízo.",
        "Não sofre choques econômicos comuns.",
        "Garante o maior retorno disponível."
      ],
      "answer": 0,
      "explanation": "Diversificar pode reduzir concentração sem eliminar riscos compartilhados.",
      "optionRationales": [
        "Correta: redução de concentração não é ausência de risco.",
        "A diversificação não garante resultado.",
        "Choques podem afetar vários ativos.",
        "Não há garantia de retorno máximo."
      ],
      "objectiveIds": [
        "O4"
      ],
      "recoverySectionIds": [
        "diversificar"
      ]
    },
    {
      "id": "ce05.q08",
      "prompt": "Aplicação inicial de R$ 400; recebimento final de R$ 440 já líquido de todos os custos do exercício. Qual o ganho líquido?",
      "options": [
        "R$ 440.",
        "R$ 0.",
        "R$ 40.",
        "É obrigatório descontar de novo os custos."
      ],
      "answer": 2,
      "explanation": "Como o recebimento já é líquido, basta 440 − 400 = R$ 40.",
      "optionRationales": [
        "R$ 440 inclui a devolução do capital.",
        "Houve diferença positiva de R$ 40.",
        "Correta: desconta-se apenas a aplicação inicial.",
        "Isso contaria o mesmo custo duas vezes."
      ],
      "objectiveIds": [
        "O3",
        "O5"
      ],
      "recoverySectionIds": [
        "liquido",
        "ex-liquido"
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
    "editorialPass": "ce05-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "ce05.q01": [
        {
          "missionId": "draft.ce05",
          "sectionId": "riscos"
        },
        {
          "missionId": "draft.ce05",
          "sectionId": "ex-riscos"
        }
      ],
      "ce05.q02": [
        {
          "missionId": "draft.ce05",
          "sectionId": "riscos"
        },
        {
          "missionId": "draft.ce05",
          "sectionId": "ex-riscos"
        }
      ],
      "ce05.q03": [
        {
          "missionId": "draft.ce05",
          "sectionId": "retorno"
        }
      ],
      "ce05.q04": [
        {
          "missionId": "draft.ce05",
          "sectionId": "liquido"
        },
        {
          "missionId": "draft.ce05",
          "sectionId": "ex-liquido"
        }
      ],
      "ce05.q05": [
        {
          "missionId": "draft.ce05",
          "sectionId": "diversificar"
        },
        {
          "missionId": "draft.ce05",
          "sectionId": "ex-concentracao"
        }
      ],
      "ce05.q06": [
        {
          "missionId": "draft.ce05",
          "sectionId": "ex-liquidez"
        },
        {
          "missionId": "draft.ce05",
          "sectionId": "riscos"
        }
      ],
      "ce05.q07": [
        {
          "missionId": "draft.ce05",
          "sectionId": "diversificar"
        }
      ],
      "ce05.q08": [
        {
          "missionId": "draft.ce05",
          "sectionId": "liquido"
        },
        {
          "missionId": "draft.ce05",
          "sectionId": "ex-liquido"
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
      "item": "Itens 5 (investimentos) e 6 — recorte transversal",
      "status": "histórico; referenceOnly"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Itens 19 (investimentos) e 20 — recorte transversal",
      "status": "histórico; referenceOnly"
    }
  ],
  "objectives": {
    "O1": "Identificar crédito, mercado e liquidez pelo evento descrito.",
    "O2": "Separar retorno esperado, contratado e realizado.",
    "O3": "Calcular ganho e taxa líquidos com custos explícitos.",
    "O4": "Reconhecer concentração por emissor e limites da diversificação.",
    "O5": "Comparar alternativas com prazo, moeda e hipóteses compatíveis.",
    "O6": "Recuperar a confusão conceitual pela seção de origem e reconstruir o caso."
  },
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Retomar as seções por questão, explicar o erro e refazer o raciocínio; sem indicador novo de domínio."
  },
  "limits": [
    "Não ensina adequação de carteira pessoal, tributação, cobertura do FGC ou mensuração estatística de risco.",
    "Casos e valores fictícios; educação geral, sem recomendação de investimento ou procedimento para caso real. Não representa cobertura integral dos itens históricos.",
    "Prática exposta, não avaliação independente. IDs editoriais, sem XP/ordem/desbloqueio; publicação.status draft e nenhuma importação no runtime.",
    "Fontes novas consultadas em 01/10/2026; consultas reaproveitadas preservam a data original. Confirmar mudanças normativas pertinentes antes de publicação."
  ]
};

export const ARITHMETIC = [
  {
    "label": "desconto",
    "operation": "subtract",
    "values": [
      1000,
      940
    ],
    "expected": 60
  },
  {
    "label": "ganho bruto",
    "operation": "subtract",
    "values": [
      1120,
      1000
    ],
    "expected": 120
  },
  {
    "label": "ganho líquido",
    "operation": "subtract",
    "values": [
      120,
      20
    ],
    "expected": 100
  },
  {
    "label": "taxa líquida",
    "operation": "divide",
    "values": [
      100,
      1000
    ],
    "expected": 0.1
  },
  {
    "label": "concentração",
    "operation": "add",
    "values": [
      600,
      400
    ],
    "expected": 1000
  },
  {
    "label": "q4 bruto",
    "operation": "subtract",
    "values": [
      560,
      500
    ],
    "expected": 60
  },
  {
    "label": "q4 líquido",
    "operation": "subtract",
    "values": [
      60,
      10
    ],
    "expected": 50
  },
  {
    "label": "q4 taxa",
    "operation": "divide",
    "values": [
      50,
      500
    ],
    "expected": 0.1
  },
  {
    "label": "q5 concentração",
    "operation": "add",
    "values": [
      300,
      700
    ],
    "expected": 1000
  },
  {
    "label": "q8 ganho",
    "operation": "subtract",
    "values": [
      440,
      400
    ],
    "expected": 40
  }
];
