// Rascunho editorial isolado; não importar no runtime.
export const SOURCES = [
  {
    "id": "bcb.ce.politica",
    "label": "BCB — Política cambial",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/politicacambial",
    "version": "Página pública renderizada em 01/10/2026",
    "locator": "Regimes, flutuação no Brasil e atuação para funcionalidade; efeitos sobre comércio e preços",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "bcb.ce.transmissao",
    "label": "BCB — Mecanismos de transmissão da política monetária",
    "url": "https://www.bcb.gov.br/controleinflacao/transmissaopoliticamonetaria",
    "version": "Consulta oficial de 30/09/2026 reaproveitada do preparo MP; sem nova leitura remota",
    "locator": "Canal de câmbio, diferencial de juros e efeitos condicionais sobre importação/exportação",
    "checkedAt": "2026-09-30"
  }
];

export const CE10_DRAFT = {
  "id": "draft.ce10",
  "topicId": "draft.ce10",
  "editorialKey": "CE-10",
  "candidateBlockId": "banking.capital-exchange",
  "title": "Câmbio e comércio exterior: receita, custo e hipóteses",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Calcular o efeito direto de uma mudança cambial em receitas e custos dados, sem prometer uma reação de toda a economia.",
  "sourceIds": [
    "bcb.ce.politica",
    "bcb.ce.transmissao"
  ],
  "sections": [
    {
      "id": "inicio",
      "type": "explanation",
      "heading": "1. Leia a moeda do contrato",
      "body": "Exportar é vender ao exterior; importar é comprar do exterior. A receita ou despesa pode estar contratada em moedas diferentes. Nesta aula e é R$/US$ e começamos com valores fixados em dólares. Sempre registre moeda, quantidade, preço e o que se mantém constante. Não confunda aumento em reais com aumento de dólares.",
      "sourceIds": [
        "bcb.ce.politica"
      ]
    },
    {
      "id": "exportacao",
      "type": "explanation",
      "heading": "2. Receita em dólares, conta em reais",
      "body": "Para um recebimento fixo em dólares, o equivalente em reais é dólares × e. Se e aumenta, o mesmo recebimento em dólares vira mais reais. Esse é um efeito aritmético sob contrato fixo. Ele não prova que a empresa venderá mais unidades nem que o lucro subirá, pois custos também podem mudar.",
      "sourceIds": [
        "bcb.ce.transmissao"
      ]
    },
    {
      "id": "ex-exportacao",
      "type": "worked-example",
      "heading": "3. Exemplo resolvido: recebimento fixo",
      "body": "Uma exportadora receberá US$ 100, sem custos cambiais no caso. A 5 R$/US$, recebe o equivalente a R$ 500; a 6 R$/US$, R$ 600. A diferença é R$ 100. Continuam sendo US$ 100. A conclusão diz respeito ao valor convertido desse recebimento, não ao lucro de toda a atividade.",
      "sourceIds": []
    },
    {
      "id": "importacao",
      "type": "explanation",
      "heading": "4. Pagamento em dólares, custo em reais",
      "body": "Para uma obrigação fixa em dólares, subir e aumenta o equivalente devido em reais. Uma queda de e faz o contrário, mantidas as demais condições. O resultado pode afetar decisões futuras de compra, mas a quantidade de uma encomenda já contratada não muda automaticamente só porque a taxa mudou.",
      "sourceIds": [
        "bcb.ce.transmissao"
      ]
    },
    {
      "id": "ex-importacao",
      "type": "worked-example",
      "heading": "5. Exemplo resolvido: insumo importado",
      "body": "Uma empresa deve US$ 40 por um insumo. A 5 R$/US$ são R$ 200; a 6 R$/US$ são R$ 240. O custo convertido sobe R$ 40. O caso não informa repasse ao consumidor, redução de produção ou alteração da quantidade comprada; essas são respostas possíveis, não resultados calculados.",
      "sourceIds": []
    },
    {
      "id": "resultado",
      "type": "explanation",
      "heading": "6. Receita não é lucro",
      "body": "Para calcular resultado no exercício, deduza os custos informados da receita. Um exportador pode ter insumos importados. Assim, a desvalorização do real pode aumentar tanto a receita convertida quanto parte dos custos. Outros custos, contratos e proteção cambial podem alterar o efeito final. Não se conclui lucro apenas observando a receita.",
      "sourceIds": []
    },
    {
      "id": "ex-resultado",
      "type": "worked-example",
      "heading": "7. Exemplo resolvido: os dois lados da mesma empresa",
      "body": "No mesmo período, uma empresa recebe US$ 100 por exportação, paga US$ 40 por insumo importado e tem R$ 100 de outros custos fixos. Sem outros itens, a 5 R$/US$ seu resultado é 500 − 200 − 100 = R$ 200. A 6 R$/US$, é 600 − 240 − 100 = R$ 260. O aumento do resultado é R$ 60, menor que o aumento de R$ 100 da receita.",
      "sourceIds": []
    },
    {
      "id": "competitividade",
      "type": "explanation",
      "heading": "8. Incentivo não é promessa de volume",
      "body": "Mantido um preço em reais, um real mais fraco pode reduzir o preço equivalente em dólares para o comprador externo. Mantido um preço de importação em dólares, encarece-o em reais. São canais de incentivo. A reação de exportações e importações depende também de demanda, capacidade de produção, prazos e repasses; não é automática nem instantânea.",
      "sourceIds": [
        "bcb.ce.politica",
        "bcb.ce.transmissao"
      ]
    },
    {
      "id": "ex-preco",
      "type": "worked-example",
      "heading": "9. Exemplo resolvido: preço fixado em reais",
      "body": "Um produto custa R$ 120 e esse preço permanece fixo. A 4 R$/US$, equivale a US$ 30; a 5 R$/US$, a US$ 24. Ele ficou mais barato em dólares sob essa hipótese. Isso não prova aumento de vendas: não sabemos como os compradores reagirão nem se existem barreiras e custos adicionais.",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "10. Vocabulário essencial",
      "body": "Receita: entrada decorrente da venda, antes de deduzir os custos. Resultado do caso: receita menos os custos especificados. Insumo: recurso usado na produção. Equivalente em reais: conversão pela taxa dada. Efeito parcial: conclusão que mantém os demais dados constantes.",
      "sourceIds": []
    },
    {
      "id": "retomada",
      "type": "summary",
      "heading": "11. Síntese e recuperação",
      "body": "Para errar menos, monte colunas com dólares, taxa e reais. Retome ex-exportacao ou ex-importacao para a conversão; resultado e ex-resultado para separar receita e lucro; competitividade e ex-preco para distinguir efeito de preço e quantidade. Ao justificar, diga sempre o que o enunciado manteve constante.",
      "sourceIds": []
    }
  ],
  "questions": [
    {
      "id": "ce10.q01",
      "prompt": "Um exportador receberá US$ 60. Com e passando de 5 para 6 R$/US$, sem outros custos e mantendo o contrato, o equivalente em reais:",
      "options": [
        "Passa de R$ 300 para R$ 250.",
        "Passa de R$ 300 para R$ 360.",
        "Permanece R$ 60.",
        "Prova aumento da quantidade vendida."
      ],
      "answer": 1,
      "explanation": "60 × 5 = 300 e 60 × 6 = 360.",
      "optionRationales": [
        "Inverte o sentido da conversão.",
        "Correta: converte o mesmo recebimento.",
        "Confunde moedas.",
        "Nada altera a quantidade contratada."
      ],
      "objectiveIds": [
        "O1",
        "O5"
      ],
      "recoverySectionIds": [
        "exportacao",
        "ex-exportacao"
      ]
    },
    {
      "id": "ce10.q02",
      "prompt": "Uma importação custa US$ 25. A taxa cai de 6 para 4 R$/US$, sem outros custos. O pagamento equivalente em reais:",
      "options": [
        "Sobe de R$ 100 para R$ 150.",
        "Continua R$ 25.",
        "Cai de R$ 150 para R$ 100.",
        "Muda a quantidade contratada para 100 unidades."
      ],
      "answer": 2,
      "explanation": "25 × 6 = 150 e 25 × 4 = 100.",
      "optionRationales": [
        "Inverte antes e depois.",
        "Confunde valor em dólares e reais.",
        "Correta: menos reais são necessários.",
        "O cálculo não muda quantidades."
      ],
      "objectiveIds": [
        "O2"
      ],
      "recoverySectionIds": [
        "importacao",
        "ex-importacao"
      ]
    },
    {
      "id": "ce10.q03",
      "prompt": "Uma exportadora tem receita em dólares e também insumos importados. O aumento da receita convertida, sozinho:",
      "options": [
        "Não basta para determinar a mudança do resultado.",
        "Prova aumento igual do lucro.",
        "Prova que nenhum custo mudou.",
        "Elimina a necessidade de ler os custos."
      ],
      "answer": 0,
      "explanation": "Parte dos custos pode variar com a mesma cotação.",
      "optionRationales": [
        "Correta: receita e resultado são diferentes.",
        "Falta deduzir as despesas.",
        "O enunciado indica exposição nos custos.",
        "A leitura dos custos é necessária."
      ],
      "objectiveIds": [
        "O3"
      ],
      "recoverySectionIds": [
        "resultado",
        "ex-resultado"
      ]
    },
    {
      "id": "ce10.q04",
      "prompt": "Receita US$ 80, custo importado US$ 30 e outros custos R$ 50, todos fixos no período do caso. A 5 R$/US$, sem outros itens, o resultado é:",
      "options": [
        "R$ 400.",
        "R$ 250.",
        "R$ 150.",
        "R$ 200."
      ],
      "answer": 3,
      "explanation": "80 × 5 − 30 × 5 − 50 = 400 − 150 − 50 = R$ 200.",
      "optionRationales": [
        "É só a receita.",
        "Ainda falta deduzir os R$ 50.",
        "É apenas o custo importado.",
        "Correta: deduz os dois custos informados."
      ],
      "objectiveIds": [
        "O1",
        "O2",
        "O3"
      ],
      "recoverySectionIds": [
        "resultado",
        "ex-resultado"
      ]
    },
    {
      "id": "ce10.q05",
      "prompt": "Um preço permanece em R$ 100. e sobe de 4 para 5 R$/US$. O equivalente em dólares:",
      "options": [
        "Cai de US$ 25 para US$ 20.",
        "Sobe de US$ 20 para US$ 25.",
        "Sobe de US$ 400 para US$ 500.",
        "Prova que as vendas vão dobrar."
      ],
      "answer": 0,
      "explanation": "Divida o preço em reais pela taxa de reais por dólar.",
      "optionRationales": [
        "Correta: 100 ÷ 4 e 100 ÷ 5.",
        "Inverte a comparação.",
        "Usa multiplicação na direção errada.",
        "Não há dados de demanda para tal conclusão."
      ],
      "objectiveIds": [
        "O4"
      ],
      "recoverySectionIds": [
        "competitividade",
        "ex-preco"
      ]
    },
    {
      "id": "ce10.q06",
      "prompt": "Uma desvalorização do real altera incentivos a exportar e importar. Qual frase evita uma promessa indevida?",
      "options": [
        "O saldo comercial melhora no mesmo dia em qualquer situação.",
        "Todos os importadores cessam imediatamente suas compras.",
        "Todo exportador tem lucro maior, qualquer que seja seu custo.",
        "Volumes e saldo dependem também de contratos, demanda, capacidade e prazos."
      ],
      "answer": 3,
      "explanation": "O canal de preços não determina sozinho a reação de toda a economia.",
      "optionRationales": [
        "É uma generalização temporal e causal excessiva.",
        "Contratos e necessidades de importação não somem automaticamente.",
        "Os custos e demais condições importam.",
        "Correta: explicita condicionantes."
      ],
      "objectiveIds": [
        "O4",
        "O5"
      ],
      "recoverySectionIds": [
        "competitividade",
        "resultado"
      ]
    },
    {
      "id": "ce10.q07",
      "prompt": "Uma dívida continua em US$ 40 e e sobe de 5 para 6 R$/US$. Qual valor aumentou diretamente no modelo?",
      "options": [
        "A quantidade de dólares da dívida, de 40 para 48.",
        "A quantidade de mercadorias, necessariamente.",
        "O equivalente em reais, de 200 para 240.",
        "O prazo contratual, de cinco para seis meses."
      ],
      "answer": 2,
      "explanation": "A mudança de cotação afeta a conversão em reais, não reescreve esses termos.",
      "optionRationales": [
        "A obrigação em dólares foi mantida.",
        "Não há mudança automática de quantidade.",
        "Correta: 40 × 5 e 40 × 6.",
        "A taxa não indica meses nem prazo."
      ],
      "objectiveIds": [
        "O2",
        "O5"
      ],
      "recoverySectionIds": [
        "inicio",
        "ex-importacao"
      ]
    },
    {
      "id": "ce10.q08",
      "prompt": "No caso receita US$ 100, insumo US$ 40 e custo fixo R$ 100, qual o aumento do resultado ao passar de 5 para 6 R$/US$, sem outros itens?",
      "options": [
        "R$ 100.",
        "R$ 60.",
        "R$ 40.",
        "R$ 160."
      ],
      "answer": 1,
      "explanation": "O resultado passa de 500 − 200 − 100 = 200 para 600 − 240 − 100 = 260.",
      "optionRationales": [
        "É o aumento da receita, sem o aumento do custo.",
        "Correta: 260 − 200 = R$ 60.",
        "É o aumento do custo importado.",
        "Soma aumentos de receita e custo em vez de subtrair."
      ],
      "objectiveIds": [
        "O3"
      ],
      "recoverySectionIds": [
        "ex-resultado"
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
    "editorialPass": "ce10-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "ce10.q01": [
        {
          "missionId": "draft.ce10",
          "sectionId": "exportacao"
        },
        {
          "missionId": "draft.ce10",
          "sectionId": "ex-exportacao"
        }
      ],
      "ce10.q02": [
        {
          "missionId": "draft.ce10",
          "sectionId": "importacao"
        },
        {
          "missionId": "draft.ce10",
          "sectionId": "ex-importacao"
        }
      ],
      "ce10.q03": [
        {
          "missionId": "draft.ce10",
          "sectionId": "resultado"
        },
        {
          "missionId": "draft.ce10",
          "sectionId": "ex-resultado"
        }
      ],
      "ce10.q04": [
        {
          "missionId": "draft.ce10",
          "sectionId": "resultado"
        },
        {
          "missionId": "draft.ce10",
          "sectionId": "ex-resultado"
        }
      ],
      "ce10.q05": [
        {
          "missionId": "draft.ce10",
          "sectionId": "competitividade"
        },
        {
          "missionId": "draft.ce10",
          "sectionId": "ex-preco"
        }
      ],
      "ce10.q06": [
        {
          "missionId": "draft.ce10",
          "sectionId": "competitividade"
        },
        {
          "missionId": "draft.ce10",
          "sectionId": "resultado"
        }
      ],
      "ce10.q07": [
        {
          "missionId": "draft.ce10",
          "sectionId": "inicio"
        },
        {
          "missionId": "draft.ce10",
          "sectionId": "ex-importacao"
        }
      ],
      "ce10.q08": [
        {
          "missionId": "draft.ce10",
          "sectionId": "ex-resultado"
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
      "item": "Item 10 — impactos das taxas de câmbio sobre exportações e importações",
      "status": "histórico; referenceOnly"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Item 24 — impactos das taxas de câmbio sobre exportações e importações",
      "status": "histórico; referenceOnly"
    }
  ],
  "objectives": {
    "O1": "Converter recebimento de exportação fixado em moeda estrangeira.",
    "O2": "Converter pagamento de importação fixado em moeda estrangeira.",
    "O3": "Separar receita de resultado após custos informados.",
    "O4": "Explicitar condições ao relacionar câmbio e competitividade.",
    "O5": "Distinguir efeito aritmético do contrato de resposta de volumes e saldo agregado.",
    "O6": "Recuperar a confusão conceitual pela seção de origem e reconstruir o caso."
  },
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Retomar as seções por questão, explicar o erro e refazer o raciocínio; sem indicador novo de domínio."
  },
  "limits": [
    "Casos sem proteção cambial, impostos ou tarifas e com contratos/quantidades explicitados. Não ensina logística, documentos, derivativos ou previsão da balança comercial.",
    "Casos e valores fictícios; educação geral, sem recomendação de investimento ou procedimento para caso real. Não representa cobertura integral dos itens históricos.",
    "Prática exposta, não avaliação independente. IDs editoriais, sem XP/ordem/desbloqueio; publicação.status draft e nenhuma importação no runtime.",
    "Fontes novas consultadas em 01/10/2026; consultas reaproveitadas preservam a data original. Confirmar mudanças normativas pertinentes antes de publicação."
  ]
};

export const ARITHMETIC = [
  {
    "label": "exportação antes",
    "operation": "multiply",
    "values": [
      100,
      5
    ],
    "expected": 500
  },
  {
    "label": "exportação depois",
    "operation": "multiply",
    "values": [
      100,
      6
    ],
    "expected": 600
  },
  {
    "label": "importação antes",
    "operation": "multiply",
    "values": [
      40,
      5
    ],
    "expected": 200
  },
  {
    "label": "importação depois",
    "operation": "multiply",
    "values": [
      40,
      6
    ],
    "expected": 240
  },
  {
    "label": "margem antes",
    "operation": "subtract",
    "values": [
      500,
      200
    ],
    "expected": 300
  },
  {
    "label": "resultado antes",
    "operation": "subtract",
    "values": [
      300,
      100
    ],
    "expected": 200
  },
  {
    "label": "margem depois",
    "operation": "subtract",
    "values": [
      600,
      240
    ],
    "expected": 360
  },
  {
    "label": "resultado depois",
    "operation": "subtract",
    "values": [
      360,
      100
    ],
    "expected": 260
  },
  {
    "label": "aumento resultado",
    "operation": "subtract",
    "values": [
      260,
      200
    ],
    "expected": 60
  },
  {
    "label": "preço USD antes",
    "operation": "divide",
    "values": [
      120,
      4
    ],
    "expected": 30
  },
  {
    "label": "preço USD depois",
    "operation": "divide",
    "values": [
      120,
      5
    ],
    "expected": 24
  },
  {
    "label": "q1 antes",
    "operation": "multiply",
    "values": [
      60,
      5
    ],
    "expected": 300
  },
  {
    "label": "q1 depois",
    "operation": "multiply",
    "values": [
      60,
      6
    ],
    "expected": 360
  },
  {
    "label": "q2 antes",
    "operation": "multiply",
    "values": [
      25,
      6
    ],
    "expected": 150
  },
  {
    "label": "q2 depois",
    "operation": "multiply",
    "values": [
      25,
      4
    ],
    "expected": 100
  },
  {
    "label": "q4 receita",
    "operation": "multiply",
    "values": [
      80,
      5
    ],
    "expected": 400
  },
  {
    "label": "q4 custo",
    "operation": "multiply",
    "values": [
      30,
      5
    ],
    "expected": 150
  },
  {
    "label": "q4 margem",
    "operation": "subtract",
    "values": [
      400,
      150
    ],
    "expected": 250
  },
  {
    "label": "q4 resultado",
    "operation": "subtract",
    "values": [
      250,
      50
    ],
    "expected": 200
  },
  {
    "label": "q5 antes",
    "operation": "divide",
    "values": [
      100,
      4
    ],
    "expected": 25
  },
  {
    "label": "q5 depois",
    "operation": "divide",
    "values": [
      100,
      5
    ],
    "expected": 20
  }
];
