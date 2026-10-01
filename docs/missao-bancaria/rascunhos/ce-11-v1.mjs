// Rascunho editorial isolado; não importar no runtime.
export const SOURCES = [
  {
    "id": "bcb.ce.transmissao",
    "label": "BCB — Mecanismos de transmissão da política monetária",
    "url": "https://www.bcb.gov.br/controleinflacao/transmissaopoliticamonetaria",
    "version": "Consulta oficial de 30/09/2026 reaproveitada do preparo MP; sem nova leitura remota",
    "locator": "Canal de câmbio, diferencial de juros e efeitos condicionais sobre importação/exportação",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "cvm.ce.risco",
    "label": "CVM — Risco e a relação risco x retorno",
    "url": "https://www.gov.br/investidor/pt-br/investir/antes-de-investir/entenda-as-caracteristicas-dos-investimentos/risco-e-a-relacao-risco-x-retorno",
    "version": "Página educacional de 15/09/2022; consulta em 01/10/2026",
    "locator": "Riscos de crédito, mercado e liquidez; retorno esperado versus realizado. Sem modelos estatísticos.",
    "checkedAt": "2026-10-01"
  }
];

export const CE11_DRAFT = {
  "id": "draft.ce11",
  "topicId": "draft.ce11",
  "editorialKey": "CE-11",
  "candidateBlockId": "banking.capital-exchange",
  "title": "Juros, risco e fluxos de capitais: relações condicionais",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Relacionar juros, risco e câmbio com hipóteses explícitas, reconhecendo que uma taxa maior não garante entrada de recursos nem ganho em outra moeda.",
  "sourceIds": [
    "bcb.ce.transmissao",
    "cvm.ce.risco"
  ],
  "sections": [
    {
      "id": "inicio",
      "type": "explanation",
      "heading": "1. Comparar taxas exige ler a moeda e o período",
      "body": "Duas taxas de 10% e 6% só têm comparação temporal direta se se referirem ao mesmo período e à mesma base de apresentação. O diferencial aritmético é 4 pontos percentuais. Isso não é automaticamente um ganho realizável: moedas, custos, riscos e expectativas podem diferir.",
      "sourceIds": []
    },
    {
      "id": "ex-diferencial",
      "type": "worked-example",
      "heading": "2. Exemplo resolvido: pontos percentuais",
      "body": "Duas alternativas informam taxas anuais de 9% e 5%. A diferença é 9 − 5 = 4 pontos percentuais. Não é correto chamar essa diferença de 4% de ganho garantido. Se uma taxa fosse mensal e a outra anual, seria necessário compatibilizar os períodos antes de subtrair.",
      "sourceIds": []
    },
    {
      "id": "moedas",
      "type": "explanation",
      "heading": "3. O caminho de ida e volta",
      "body": "Um investidor que parte de dólares, aplica em reais e volta a dólares depende de duas conversões. No modelo de um período: dólares iniciais × e inicial = reais aplicados; reais finais = reais aplicados × (1 + taxa do período); dólares finais = reais finais ÷ e final. Só então se compara com os dólares iniciais. Rendimento em reais não é o mesmo que retorno em dólares.",
      "sourceIds": []
    },
    {
      "id": "ex-conversao",
      "type": "worked-example",
      "heading": "4. Exemplo resolvido: juros compensados pela cotação",
      "body": "Sem custos, US$ 100 são convertidos a 5 R$/US$, gerando R$ 500. A aplicação paga 10% no período e devolve R$ 550. Se a reconversão ocorre a 5,50 R$/US$, o investidor recebe 550 ÷ 5,50 = US$ 100: retorno de 0% em dólares. A aplicação rendeu em reais, mas o movimento cambial compensou esse rendimento na moeda de partida.",
      "sourceIds": []
    },
    {
      "id": "risco",
      "type": "explanation",
      "heading": "5. Prêmio de risco não é prêmio já recebido",
      "body": "Quem considera uma aplicação mais arriscada pode exigir uma compensação esperada adicional para aceitá-la. Esse prêmio exigido não garante que o valor será realizado. Para interpretar uma diferença entre taxas como compensação de risco, é preciso controlar outras diferenças, como prazo, moeda e características do instrumento; não basta subtrair duas taxas quaisquer.",
      "sourceIds": [
        "cvm.ce.risco"
      ]
    },
    {
      "id": "ex-risco",
      "type": "worked-example",
      "heading": "6. Exemplo resolvido: comparação com hipóteses",
      "body": "Duas dívidas fictícias têm mesma moeda, prazo e demais condições; o caso informa que a única diferença relevante é o risco de crédito percebido. O retorno exigido passa de 7% para 10% quando o risco é maior. Sob essas hipóteses, a diferença de 3 pontos percentuais expressa a compensação adicional exigida. Não é promessa de receber três pontos extras nem comprovação de que a dívida será paga.",
      "sourceIds": [
        "cvm.ce.risco"
      ]
    },
    {
      "id": "fluxo",
      "type": "explanation",
      "heading": "7. Como uma entrada pode pressionar a cotação",
      "body": "Se uma entrada de recursos exige vender dólares e comprar reais, ela pode aumentar a demanda por reais e pressionar sua valorização, mantendo os demais fatores constantes. Na convenção R$/US$, isso significa pressão de queda da cotação. Uma saída que exija o movimento oposto pode pressionar a alta. Nem todo movimento internacional passa pela mesma conversão no mesmo instante.",
      "sourceIds": [
        "bcb.ce.transmissao"
      ]
    },
    {
      "id": "expectativas",
      "type": "explanation",
      "heading": "8. Juros maiores não decidem sozinhos",
      "body": "Uma alta de juros domésticos pode aumentar a atratividade relativa de aplicações e influenciar o câmbio, mas risco, expectativa de inflação, movimento cambial esperado, liquidez e condições externas também importam. Se esses fatores se alteram ao mesmo tempo, não se pode prometer entrada líquida nem valorização do real apenas pela taxa nominal anunciada.",
      "sourceIds": [
        "bcb.ce.transmissao",
        "cvm.ce.risco"
      ]
    },
    {
      "id": "ex-cenarios",
      "type": "worked-example",
      "heading": "9. Exemplo resolvido: mesma aplicação, dois câmbios finais",
      "body": "Retome R$ 550 finais originados de US$ 100 a 5 R$/US$. No cenário A, e final é 5: a reconversão dá US$ 110 e ganho de 10%. No B, e final é 5,50: dá US$ 100 e ganho de 0%. A diferença está na reconversão. São cenários dados, não previsão de qual ocorrerá, e não incluem custos.",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "10. Vocabulário essencial",
      "body": "Ponto percentual: unidade da diferença entre taxas percentuais. Reconversão: volta à moeda de partida. Prêmio de risco: compensação adicional exigida por uma exposição, sob condições comparáveis. Fluxo: movimento de recursos em um período. Pressão cambial: influência condicional, sem determinação única do preço.",
      "sourceIds": []
    },
    {
      "id": "retomada",
      "type": "summary",
      "heading": "11. Síntese e recuperação",
      "body": "Para confusão de unidades de taxa, volte a inicio e ex-diferencial. Para ganho em outra moeda, refaça as três etapas de moedas e ex-conversao. Para uma garantia indevida, retome risco e ex-risco. Se transformou pressão em previsão, releia fluxo e expectativas, nomeando o que teria de ficar constante.",
      "sourceIds": []
    }
  ],
  "questions": [
    {
      "id": "ce11.q01",
      "prompt": "Taxas de 12% e 8% referem-se ao mesmo período. O diferencial aritmético é:",
      "options": [
        "4 reais.",
        "20 pontos percentuais.",
        "4 pontos percentuais.",
        "Ganho garantido de 4% para qualquer investidor."
      ],
      "answer": 2,
      "explanation": "Subtrair percentuais na mesma base produz diferença em pontos percentuais.",
      "optionRationales": [
        "A unidade não é moeda.",
        "Somar não dá o diferencial.",
        "Correta: 12 − 8 = 4 p.p.",
        "O cálculo não elimina outras condições."
      ],
      "objectiveIds": [
        "O1"
      ],
      "recoverySectionIds": [
        "inicio",
        "ex-diferencial"
      ]
    },
    {
      "id": "ce11.q02",
      "prompt": "US$ 200 viram R$ 1.000 a 5 R$/US$. Após rendimento de 10%, há R$ 1.100. A reconversão a 5,50 R$/US$ produz, sem custos:",
      "options": [
        "US$ 220 e ganho garantido de 10%.",
        "US$ 200 e retorno de 0% em dólares.",
        "US$ 1.100.",
        "US$ 100 e perda de 50%."
      ],
      "answer": 1,
      "explanation": "1.100 ÷ 5,50 = US$ 200, iguais ao valor inicial em dólares.",
      "optionRationales": [
        "Ignora a nova cotação.",
        "Correta: separa rendimento em reais e retorno em dólares.",
        "Falta converter a moeda.",
        "A divisão não resulta em US$ 100."
      ],
      "objectiveIds": [
        "O2"
      ],
      "recoverySectionIds": [
        "moedas",
        "ex-conversao"
      ]
    },
    {
      "id": "ce11.q03",
      "prompt": "Em duas dívidas com condições comparáveis, o investidor exige retorno maior por perceber mais risco. Essa compensação exigida:",
      "options": [
        "Já está necessariamente recebida.",
        "Garante ausência de inadimplência.",
        "Pode ser identificada por qualquer diferença de taxas, mesmo com prazos e moedas incompatíveis.",
        "É esperada/exigida, sem garantir o resultado realizado."
      ],
      "answer": 3,
      "explanation": "Prêmio exigido e resultado realizado são conceitos diferentes.",
      "optionRationales": [
        "Exigência não é recebimento.",
        "O risco não desaparece por haver taxa maior.",
        "A comparação precisa controlar as demais diferenças.",
        "Correta: preserva a incerteza."
      ],
      "objectiveIds": [
        "O3"
      ],
      "recoverySectionIds": [
        "risco",
        "ex-risco"
      ]
    },
    {
      "id": "ce11.q04",
      "prompt": "Uma entrada exige vender dólares e comprar reais. Mantidos os demais fatores, qual pressão é compatível com esse fluxo?",
      "options": [
        "Valorização do real e pressão de queda de R$/US$.",
        "Alta de R$/US$ por definição de qualquer entrada.",
        "Nenhum efeito pode existir em hipótese alguma.",
        "Desvalorização necessária e garantida do real."
      ],
      "answer": 0,
      "explanation": "O fluxo descrito aumenta a demanda por reais, sob a hipótese de outros fatores constantes.",
      "optionRationales": [
        "Correta: usa a conversão e a hipótese informadas.",
        "Inverte o movimento esperado no caso definido.",
        "O canal pode atuar.",
        "Pressão não é garantia e o sentido está invertido."
      ],
      "objectiveIds": [
        "O4"
      ],
      "recoverySectionIds": [
        "fluxo"
      ]
    },
    {
      "id": "ce11.q05",
      "prompt": "A taxa doméstica nominal sobe, mas risco e expectativas cambiais também mudam. Qual conclusão é defensável?",
      "options": [
        "Haverá necessariamente entrada líquida.",
        "O real necessariamente se valorizará.",
        "Os demais fatores deixam de importar.",
        "A direção do fluxo e do câmbio não pode ser garantida apenas por essa alta de juros."
      ],
      "answer": 3,
      "explanation": "É necessário considerar as outras mudanças, não só uma variável.",
      "optionRationales": [
        "A entrada não decorre automaticamente de uma taxa.",
        "O câmbio reage a vários fatores.",
        "O enunciado enfatiza mudanças relevantes.",
        "Correta: a relação é condicional."
      ],
      "objectiveIds": [
        "O4",
        "O5"
      ],
      "recoverySectionIds": [
        "expectativas"
      ]
    },
    {
      "id": "ce11.q06",
      "prompt": "Uma aplicação devolve R$ 600 e a cotação final é 5 R$/US$. Quantos dólares ela representa, sem custos?",
      "options": [
        "US$ 120.",
        "US$ 3.000.",
        "US$ 600.",
        "US$ 5."
      ],
      "answer": 0,
      "explanation": "Para reconverter reais em dólares, divida 600 por 5.",
      "optionRationales": [
        "Correta: 600 ÷ 5 = 120.",
        "Multiplica na direção errada.",
        "Confunde unidades.",
        "A taxa não é o valor final convertido."
      ],
      "objectiveIds": [
        "O2"
      ],
      "recoverySectionIds": [
        "moedas",
        "ex-cenarios"
      ]
    },
    {
      "id": "ce11.q07",
      "prompt": "Para uma comparação didática atribuir 3 pontos percentuais adicionais ao risco, qual cuidado é necessário?",
      "options": [
        "Comparar qualquer taxa mensal com qualquer anual diretamente.",
        "Informar condições comparáveis e a hipótese de diferença relevante de risco.",
        "Ignorar a moeda das duas alternativas.",
        "Considerar retorno exigido igual a lucro certo."
      ],
      "answer": 1,
      "explanation": "O exemplo isola o risco para evitar atribuir a ele diferenças que têm outras causas.",
      "optionRationales": [
        "Os períodos precisam ser compatíveis.",
        "Correta: explicita o que foi controlado.",
        "A moeda altera a comparação.",
        "Exigência não garante realização."
      ],
      "objectiveIds": [
        "O1",
        "O3"
      ],
      "recoverySectionIds": [
        "ex-diferencial",
        "risco",
        "ex-risco"
      ]
    },
    {
      "id": "ce11.q08",
      "prompt": "Uma saída exige vender reais e comprar dólares. Mantidos os demais fatores, isso pode:",
      "options": [
        "Garantir queda de R$/US$ em qualquer contexto.",
        "Fixar permanentemente a cotação.",
        "Pressionar a alta de R$/US$, sem determinar sozinha o resultado observado.",
        "Provar que toda operação externa funciona do mesmo modo."
      ],
      "answer": 2,
      "explanation": "A demanda por dólares pode exercer pressão, enquanto outros fluxos e fatores também atuam.",
      "optionRationales": [
        "Inverte o canal descrito e o torna absoluto.",
        "O fluxo não cria regime fixo.",
        "Correta: descreve pressão condicional.",
        "O próprio mecanismo depende da conversão informada."
      ],
      "objectiveIds": [
        "O4",
        "O5"
      ],
      "recoverySectionIds": [
        "fluxo",
        "expectativas"
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
    "editorialPass": "ce11-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "ce11.q01": [
        {
          "missionId": "draft.ce11",
          "sectionId": "inicio"
        },
        {
          "missionId": "draft.ce11",
          "sectionId": "ex-diferencial"
        }
      ],
      "ce11.q02": [
        {
          "missionId": "draft.ce11",
          "sectionId": "moedas"
        },
        {
          "missionId": "draft.ce11",
          "sectionId": "ex-conversao"
        }
      ],
      "ce11.q03": [
        {
          "missionId": "draft.ce11",
          "sectionId": "risco"
        },
        {
          "missionId": "draft.ce11",
          "sectionId": "ex-risco"
        }
      ],
      "ce11.q04": [
        {
          "missionId": "draft.ce11",
          "sectionId": "fluxo"
        }
      ],
      "ce11.q05": [
        {
          "missionId": "draft.ce11",
          "sectionId": "expectativas"
        }
      ],
      "ce11.q06": [
        {
          "missionId": "draft.ce11",
          "sectionId": "moedas"
        },
        {
          "missionId": "draft.ce11",
          "sectionId": "ex-cenarios"
        }
      ],
      "ce11.q07": [
        {
          "missionId": "draft.ce11",
          "sectionId": "ex-diferencial"
        },
        {
          "missionId": "draft.ce11",
          "sectionId": "risco"
        },
        {
          "missionId": "draft.ce11",
          "sectionId": "ex-risco"
        }
      ],
      "ce11.q08": [
        {
          "missionId": "draft.ce11",
          "sectionId": "fluxo"
        },
        {
          "missionId": "draft.ce11",
          "sectionId": "expectativas"
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
      "item": "Item 11 — diferencial de juros, prêmios de risco, fluxo de capitais e efeitos sobre as taxas de câmbio",
      "status": "histórico; referenceOnly"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Item 25 — diferencial de juros, prêmios de risco, fluxo de capitais e efeitos sobre as taxas de câmbio",
      "status": "histórico; referenceOnly"
    }
  ],
  "objectives": {
    "O1": "Calcular diferencial de taxas em pontos percentuais no mesmo período.",
    "O2": "Separar rendimento em reais e resultado reconvertido em moeda estrangeira.",
    "O3": "Distinguir compensação exigida por risco de retorno garantido.",
    "O4": "Descrever pressão cambial de um fluxo mantendo outros fatores constantes.",
    "O5": "Reconhecer a influência de expectativas e risco na decisão de aplicar.",
    "O6": "Recuperar a confusão conceitual pela seção de origem e reconstruir o caso."
  },
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Retomar as seções por questão, explicar o erro e refazer o raciocínio; sem indicador novo de domínio."
  },
  "limits": [
    "Modelo introdutório com um período, sem custos ou tributos quando indicado; não deriva paridade de juros, precifica hedge nem faz previsão de câmbio ou orientação de investimento.",
    "Casos e valores fictícios; educação geral, sem recomendação de investimento ou procedimento para caso real. Não representa cobertura integral dos itens históricos.",
    "Prática exposta, não avaliação independente. IDs editoriais, sem XP/ordem/desbloqueio; publicação.status draft e nenhuma importação no runtime.",
    "Fontes novas consultadas em 01/10/2026; consultas reaproveitadas preservam a data original. Confirmar mudanças normativas pertinentes antes de publicação."
  ]
};

export const ARITHMETIC = [
  {
    "label": "ex1 diferencial",
    "operation": "subtract",
    "values": [
      9,
      5
    ],
    "expected": 4
  },
  {
    "label": "ex2 reais iniciais",
    "operation": "multiply",
    "values": [
      100,
      5
    ],
    "expected": 500
  },
  {
    "label": "ex2 reais finais",
    "operation": "multiply",
    "values": [
      500,
      1.1
    ],
    "expected": 550
  },
  {
    "label": "ex2 dólares finais",
    "operation": "divide",
    "values": [
      550,
      5.5
    ],
    "expected": 100
  },
  {
    "label": "ex3 prêmio",
    "operation": "subtract",
    "values": [
      10,
      7
    ],
    "expected": 3
  },
  {
    "label": "ex4 dólares A",
    "operation": "divide",
    "values": [
      550,
      5
    ],
    "expected": 110
  },
  {
    "label": "ex4 ganho A",
    "operation": "subtract",
    "values": [
      110,
      100
    ],
    "expected": 10
  },
  {
    "label": "ex4 taxa A",
    "operation": "divide",
    "values": [
      10,
      100
    ],
    "expected": 0.1
  },
  {
    "label": "q1 diferencial",
    "operation": "subtract",
    "values": [
      12,
      8
    ],
    "expected": 4
  },
  {
    "label": "q2 reais",
    "operation": "multiply",
    "values": [
      200,
      5
    ],
    "expected": 1000
  },
  {
    "label": "q2 final reais",
    "operation": "multiply",
    "values": [
      1000,
      1.1
    ],
    "expected": 1100
  },
  {
    "label": "q2 dólares",
    "operation": "divide",
    "values": [
      1100,
      5.5
    ],
    "expected": 200
  },
  {
    "label": "q6 dólares",
    "operation": "divide",
    "values": [
      600,
      5
    ],
    "expected": 120
  }
];
