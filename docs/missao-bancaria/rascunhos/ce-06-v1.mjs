// Rascunho editorial isolado; não importar no runtime.
export const SOURCES = [
  {
    "id": "bcb.ce.conceito",
    "label": "BCB — O que é câmbio",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/oqueecambio",
    "version": "Página pública renderizada em 01/10/2026",
    "locator": "Conversão, turismo, remessas e comércio exterior; links para instituições e VET",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "lei.14286",
    "label": "Lei 14.286/2021 — câmbio",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14286.htm",
    "version": "Texto oficial consultado em 01/10/2026",
    "locator": "Arts. 2–5 e 19: taxa pactuada, autorização, finalidade e exceção eventual; sem procedimentos quantitativos",
    "checkedAt": "2026-10-01"
  }
];

export const CE06_DRAFT = {
  "id": "draft.ce06",
  "topicId": "draft.ce06",
  "editorialKey": "CE-06",
  "candidateBlockId": "banking.capital-exchange",
  "title": "Câmbio: ler a cotação e converter valores",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Converter valores com uma cotação explícita e identificar compra e venda pela perspectiva informada.",
  "sourceIds": [
    "bcb.ce.conceito",
    "lei.14286"
  ],
  "sections": [
    {
      "id": "inicio",
      "type": "explanation",
      "heading": "1. Duas moedas, uma unidade de medida",
      "body": "Câmbio envolve troca entre moedas. Escrever apenas 'a taxa é 5' deixa a informação incompleta. R$ 5 por US$ 1, ou 5 R$/US$, informa quantos reais correspondem a um dólar. Usaremos sempre essa convenção, salvo indicação expressa.",
      "sourceIds": [
        "bcb.ce.conceito"
      ]
    },
    {
      "id": "conversao",
      "type": "explanation",
      "heading": "2. Multiplicar ou dividir?",
      "body": "Se você parte de dólares e deseja reais, multiplique os dólares pela cotação em R$/US$: os dólares se cancelam. Se parte de reais e quer dólares, divida os reais pela cotação. Verifique se o resultado está na moeda pedida antes de conferir o número. Nos primeiros cálculos, não há custos adicionais.",
      "sourceIds": []
    },
    {
      "id": "ex-multiplicar",
      "type": "worked-example",
      "heading": "3. Exemplo resolvido: valor em reais",
      "body": "Um pagamento fictício de US$ 80 será convertido a R$ 5 por US$ 1. Cálculo: 80 × 5 = R$ 400. Multiplicamos porque cada um dos 80 dólares custa cinco reais. O resultado não é US$ 400 nem R$ 16.",
      "sourceIds": []
    },
    {
      "id": "ex-dividir",
      "type": "worked-example",
      "heading": "4. Exemplo resolvido: orçamento em dólares",
      "body": "Com R$ 600 e cotação única de R$ 5 por US$ 1, sem outros custos, o orçamento compra 600 ÷ 5 = US$ 120. Conferência inversa: 120 × 5 = R$ 600. A cotação inversa seria 1 ÷ 5 = US$ 0,20 por R$ 1.",
      "sourceIds": []
    },
    {
      "id": "perspectiva",
      "type": "explanation",
      "heading": "5. Quem compra a moeda estrangeira?",
      "body": "Em uma tabela com a perspectiva da instituição, 'compra' é a taxa pela qual ela compra moeda estrangeira do cliente; 'venda' é a taxa pela qual ela vende ao cliente. Portanto, o cliente que compra dólares usa a venda da instituição. Leia sempre quem é o sujeito: o verbo isolado não decide.",
      "sourceIds": [
        "bcb.ce.conceito"
      ]
    },
    {
      "id": "ex-perspectiva",
      "type": "worked-example",
      "heading": "6. Exemplo resolvido: duas pontas da tabela",
      "body": "Uma instituição informa compra de dólar a R$ 4,90 e venda a R$ 5,10. Sem outros custos, Lia compra US$ 100 e paga 100 × 5,10 = R$ 510. Se vender US$ 100 à instituição, recebe 100 × 4,90 = R$ 490. São operações e perspectivas diferentes; não se escolhe a menor taxa por preferência.",
      "sourceIds": []
    },
    {
      "id": "variacao",
      "type": "explanation",
      "heading": "7. Cotação sobe: qual moeda se fortalece?",
      "body": "Na convenção R$/US$, passar de 5 para 6 significa que o dólar exige mais reais: o real se desvaloriza perante o dólar. Passar de 5 para 4 significa que exige menos reais: o real se valoriza. Sempre nomeie as duas moedas. A cotação inversa se move no sentido contrário.",
      "sourceIds": []
    },
    {
      "id": "ex-variacao",
      "type": "worked-example",
      "heading": "8. Exemplo resolvido: o mesmo compromisso",
      "body": "Uma dívida fixa de US$ 50 custa R$ 250 quando a taxa é 5 R$/US$ e R$ 200 quando ela é 4 R$/US$. A redução de R$ 50 decorre apenas da cotação no caso. O compromisso continua US$ 50; a valorização do real não mudou a quantidade de dólares devida.",
      "sourceIds": []
    },
    {
      "id": "custos",
      "type": "explanation",
      "heading": "9. Preço da moeda e desembolso total",
      "body": "A conversão pela taxa pode não ser o desembolso final: uma operação pode ter tarifas e tributos. Compare o custo total das propostas para a mesma operação. A página do BCB apresenta o Valor Efetivo Total (VET) como medida que reúne a taxa e os encargos considerados na operação. Aqui nenhum tributo ou tarifa é presumido; só entram os valores explicitamente dados.",
      "sourceIds": [
        "bcb.ce.conceito"
      ]
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "10. Vocabulário essencial",
      "body": "Cotação: preço de uma moeda expresso em outra. R$/US$: reais por dólar. Taxa inversa: dólares por real, neste par. Compra/venda: verbos que exigem identificar a perspectiva. Valorização do real: menos reais necessários por dólar nesta convenção. Custo total: desembolso incluindo os encargos da operação.",
      "sourceIds": []
    },
    {
      "id": "retomada",
      "type": "summary",
      "heading": "11. Síntese e recuperação",
      "body": "Anote moeda de partida, moeda pedida e unidade da taxa. Retome conversao se escolheu a operação errada; perspectiva se confundiu comprador e vendedor; variacao se inverteu a força do real; custos se tratou uma cotação isolada como desembolso total. Refaça uma conversão inversa como conferência.",
      "sourceIds": []
    }
  ],
  "questions": [
    {
      "id": "ce06.q01",
      "prompt": "A taxa de 4 R$/US$ significa que:",
      "options": [
        "R$ 1 corresponde a US$ 4.",
        "US$ 1 corresponde a R$ 4.",
        "Quatro moedas diferentes são negociadas.",
        "Todo pagamento inclui tarifa de R$ 4."
      ],
      "answer": 1,
      "explanation": "O numerador informa reais e o denominador, dólares.",
      "optionRationales": [
        "Isso inverte as unidades.",
        "Correta: são quatro reais por dólar.",
        "A taxa compara duas moedas.",
        "Não há tarifa informada."
      ],
      "objectiveIds": [
        "O1"
      ],
      "recoverySectionIds": [
        "inicio"
      ]
    },
    {
      "id": "ce06.q02",
      "prompt": "Sem custos adicionais, quanto são US$ 30 à taxa de 5 R$/US$?",
      "options": [
        "R$ 150.",
        "R$ 6.",
        "US$ 150.",
        "R$ 35."
      ],
      "answer": 0,
      "explanation": "Multiplique 30 dólares por cinco reais por dólar.",
      "optionRationales": [
        "Correta: 30 × 5 = R$ 150.",
        "A divisão é para converter reais em dólares nesta convenção.",
        "A resposta deve estar em reais.",
        "Somar moeda e taxa não faz a conversão."
      ],
      "objectiveIds": [
        "O1",
        "O2"
      ],
      "recoverySectionIds": [
        "conversao",
        "ex-multiplicar"
      ]
    },
    {
      "id": "ce06.q03",
      "prompt": "Um orçamento de R$ 240 compra quantos dólares a 4 R$/US$, sem outros custos?",
      "options": [
        "US$ 960.",
        "US$ 244.",
        "US$ 236.",
        "US$ 60."
      ],
      "answer": 3,
      "explanation": "Para partir de reais, divida 240 por 4.",
      "optionRationales": [
        "A multiplicação usa a direção contrária.",
        "Não se somam orçamento e taxa.",
        "Subtrair não converte unidades.",
        "Correta: 240 ÷ 4 = US$ 60."
      ],
      "objectiveIds": [
        "O2"
      ],
      "recoverySectionIds": [
        "conversao",
        "ex-dividir"
      ]
    },
    {
      "id": "ce06.q04",
      "prompt": "Na perspectiva da instituição, compra do dólar = R$ 4,80 e venda = R$ 5,20. Sem outros custos, o cliente que compra US$ 50 paga:",
      "options": [
        "R$ 240.",
        "R$ 250.",
        "R$ 260.",
        "R$ 10."
      ],
      "answer": 2,
      "explanation": "A instituição vende os dólares ao cliente: 50 × 5,20 = R$ 260.",
      "optionRationales": [
        "Usa a taxa pela qual a instituição compra, não vende.",
        "A média das taxas não foi contratada.",
        "Correta: usa a venda da instituição.",
        "Não é o valor total convertido."
      ],
      "objectiveIds": [
        "O2",
        "O3"
      ],
      "recoverySectionIds": [
        "perspectiva",
        "ex-perspectiva"
      ]
    },
    {
      "id": "ce06.q05",
      "prompt": "Na convenção R$/US$, a taxa cai de 6 para 5. O que ocorreu com o real perante o dólar?",
      "options": [
        "Valorização do real.",
        "Desvalorização do real.",
        "A quantidade de dólares de todas as dívidas foi reduzida.",
        "Nada pode ser dito, mesmo com a convenção informada."
      ],
      "answer": 0,
      "explanation": "Agora são necessários menos reais para um dólar.",
      "optionRationales": [
        "Correta: o real compra mais dólares por unidade.",
        "Isso ocorreria com movimento contrário nesta convenção.",
        "A cotação não altera automaticamente o valor contratual em dólares.",
        "A convenção permite identificar o sentido nominal."
      ],
      "objectiveIds": [
        "O4"
      ],
      "recoverySectionIds": [
        "variacao",
        "ex-variacao"
      ]
    },
    {
      "id": "ce06.q06",
      "prompt": "Na taxa de 5 R$/US$, qual é a cotação inversa?",
      "options": [
        "5 US$/R$.",
        "0,50 R$/US$.",
        "25 US$/R$.",
        "0,20 US$/R$."
      ],
      "answer": 3,
      "explanation": "A inversa é 1 ÷ 5, e também inverte a unidade.",
      "optionRationales": [
        "Inverteu somente a unidade, sem inverter o número.",
        "Não é a inversa numérica nem a unidade pedida.",
        "Elevar ao quadrado não inverte a cotação.",
        "Correta: um real compra 0,20 dólar no modelo sem custos."
      ],
      "objectiveIds": [
        "O1",
        "O2"
      ],
      "recoverySectionIds": [
        "ex-dividir"
      ]
    },
    {
      "id": "ce06.q07",
      "prompt": "Duas propostas para a mesma compra de moeda têm taxas diferentes, mas as tarifas não foram informadas. Qual conclusão é adequada?",
      "options": [
        "A menor cotação sempre prova menor desembolso final.",
        "Tarifas são necessariamente iguais.",
        "É necessário comparar os custos totais antes de concluir.",
        "A maior cotação garante isenção de tributos."
      ],
      "answer": 2,
      "explanation": "Cotação isolada não determina todos os encargos da operação.",
      "optionRationales": [
        "Outros custos podem modificar a comparação.",
        "Nada informa igualdade de tarifas.",
        "Correta: falta informação relevante para o total.",
        "Não existe essa garantia no enunciado."
      ],
      "objectiveIds": [
        "O5"
      ],
      "recoverySectionIds": [
        "custos"
      ]
    },
    {
      "id": "ce06.q08",
      "prompt": "Uma obrigação continua em US$ 20; a taxa sobe de 5 para 6 R$/US$. Sem custos extras, o equivalente em reais passa de:",
      "options": [
        "R$ 100 para R$ 80.",
        "R$ 100 para R$ 120.",
        "R$ 20 para R$ 26.",
        "US$ 100 para US$ 120."
      ],
      "answer": 1,
      "explanation": "O cálculo é 20 × 5 e depois 20 × 6, mantendo os mesmos dólares.",
      "optionRationales": [
        "A alta desta cotação aumenta o equivalente em reais.",
        "Correta: a obrigação em dólares permanece igual.",
        "É preciso multiplicar a obrigação inteira.",
        "As unidades de resposta estão erradas."
      ],
      "objectiveIds": [
        "O2",
        "O4"
      ],
      "recoverySectionIds": [
        "ex-multiplicar",
        "ex-variacao"
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
    "editorialPass": "ce06-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "ce06.q01": [
        {
          "missionId": "draft.ce06",
          "sectionId": "inicio"
        }
      ],
      "ce06.q02": [
        {
          "missionId": "draft.ce06",
          "sectionId": "conversao"
        },
        {
          "missionId": "draft.ce06",
          "sectionId": "ex-multiplicar"
        }
      ],
      "ce06.q03": [
        {
          "missionId": "draft.ce06",
          "sectionId": "conversao"
        },
        {
          "missionId": "draft.ce06",
          "sectionId": "ex-dividir"
        }
      ],
      "ce06.q04": [
        {
          "missionId": "draft.ce06",
          "sectionId": "perspectiva"
        },
        {
          "missionId": "draft.ce06",
          "sectionId": "ex-perspectiva"
        }
      ],
      "ce06.q05": [
        {
          "missionId": "draft.ce06",
          "sectionId": "variacao"
        },
        {
          "missionId": "draft.ce06",
          "sectionId": "ex-variacao"
        }
      ],
      "ce06.q06": [
        {
          "missionId": "draft.ce06",
          "sectionId": "ex-dividir"
        }
      ],
      "ce06.q07": [
        {
          "missionId": "draft.ce06",
          "sectionId": "custos"
        }
      ],
      "ce06.q08": [
        {
          "missionId": "draft.ce06",
          "sectionId": "ex-multiplicar"
        },
        {
          "missionId": "draft.ce06",
          "sectionId": "ex-variacao"
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
      "item": "Itens 7 e 9 (nominal) — noções de câmbio",
      "status": "histórico; referenceOnly"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Itens 21 e 23 (nominal) — noções de câmbio",
      "status": "histórico; referenceOnly"
    }
  ],
  "objectives": {
    "O1": "Interpretar a unidade R$/US$ sem inverter seu significado.",
    "O2": "Escolher multiplicação ou divisão pela moeda de partida.",
    "O3": "Distinguir compra e venda pela perspectiva da instituição.",
    "O4": "Reconhecer valorização e desvalorização do real nessa convenção.",
    "O5": "Separar taxa de câmbio de custo total da operação.",
    "O6": "Recuperar a confusão conceitual pela seção de origem e reconstruir o caso."
  },
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Retomar as seções por questão, explicar o erro e refazer o raciocínio; sem indicador novo de domínio."
  },
  "limits": [
    "Conversões didáticas com taxas fictícias; sem cotação atual, previsão, tributação ou procedimento de contratação.",
    "Casos e valores fictícios; educação geral, sem recomendação de investimento ou procedimento para caso real. Não representa cobertura integral dos itens históricos.",
    "Prática exposta, não avaliação independente. IDs editoriais, sem XP/ordem/desbloqueio; publicação.status draft e nenhuma importação no runtime.",
    "Fontes novas consultadas em 01/10/2026; consultas reaproveitadas preservam a data original. Confirmar mudanças normativas pertinentes antes de publicação."
  ]
};

export const ARITHMETIC = [
  {
    "label": "ex1",
    "operation": "multiply",
    "values": [
      80,
      5
    ],
    "expected": 400
  },
  {
    "label": "ex2",
    "operation": "divide",
    "values": [
      600,
      5
    ],
    "expected": 120
  },
  {
    "label": "ex2 inversa",
    "operation": "divide",
    "values": [
      1,
      5
    ],
    "expected": 0.2
  },
  {
    "label": "ex3 compra cliente",
    "operation": "multiply",
    "values": [
      100,
      5.1
    ],
    "expected": 510
  },
  {
    "label": "ex3 venda cliente",
    "operation": "multiply",
    "values": [
      100,
      4.9
    ],
    "expected": 490
  },
  {
    "label": "ex4 antes",
    "operation": "multiply",
    "values": [
      50,
      5
    ],
    "expected": 250
  },
  {
    "label": "ex4 depois",
    "operation": "multiply",
    "values": [
      50,
      4
    ],
    "expected": 200
  },
  {
    "label": "ex4 diferença",
    "operation": "subtract",
    "values": [
      250,
      200
    ],
    "expected": 50
  },
  {
    "label": "q2",
    "operation": "multiply",
    "values": [
      30,
      5
    ],
    "expected": 150
  },
  {
    "label": "q3",
    "operation": "divide",
    "values": [
      240,
      4
    ],
    "expected": 60
  },
  {
    "label": "q4",
    "operation": "multiply",
    "values": [
      50,
      5.2
    ],
    "expected": 260
  },
  {
    "label": "q8 antes",
    "operation": "multiply",
    "values": [
      20,
      5
    ],
    "expected": 100
  },
  {
    "label": "q8 depois",
    "operation": "multiply",
    "values": [
      20,
      6
    ],
    "expected": 120
  }
];
