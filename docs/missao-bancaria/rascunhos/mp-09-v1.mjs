// Rascunho editorial, sem importação pelo runtime. Valores didáticos são fictícios.
export const SOURCES = [
  {
    "id": "bce.curva",
    "label": "BCE — Euro area yield curves",
    "url": "https://www.ecb.europa.eu/stats/financial_markets_and_interest_rates/euro_area_yield_curves/html/index.en.html",
    "version": "Página metodológica consultada em 30/09/2026",
    "locator": "Definição da relação entre taxas e prazos remanescentes; expectativas e riscos. Apenas conceitos gerais, sem importar taxas ou método europeu ao Brasil.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "bcb.selic",
    "label": "BCB — Taxa Selic",
    "url": "https://www.bcb.gov.br/controleinflacao/taxaselic",
    "version": "Página institucional consultada em 30/09/2026",
    "locator": "Definição da taxa efetiva nas compromissadas de um dia útil e atuação para alinhá-la à meta definida pelo Copom. Sem usar o valor atual.",
    "checkedAt": "2026-09-30"
  }
];
export const MP09_DRAFT = {
  "id": "draft.mp09",
  "topicId": "draft.mp09",
  "editorialKey": "MP-09",
  "candidateBlockId": "banking.markets-policy",
  "title": "Prazos e curva de juros",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Ler eixos, unidades e prazos de uma curva didática, comparar seus pontos e distinguir taxa de prazo específico, retorno acumulado e previsão do futuro.",
  "sourceIds": [
    "bce.curva",
    "bcb.selic"
  ],
  "sections": [
    {
      "id": "retomada",
      "type": "explanation",
      "heading": "1. Da taxa isolada à comparação de prazos",
      "body": "Retome porcentagens/períodos em [MP-03](mp-03-v1.md) e vencimento/preço em [MP-07](mp-07-v1.md). Prazo remanescente é quanto falta, a partir da data de observação, até o vencimento. Uma curva de juros relaciona taxas e prazos. Para uma comparação útil, informe data, moeda, tipo de taxa e características dos instrumentos. Misturar moedas, riscos ou convenções sem aviso pode atribuir ao prazo diferenças que vieram de outra característica.",
      "sourceIds": [
        "bce.curva"
      ]
    },
    {
      "id": "eixos",
      "type": "explanation",
      "heading": "2. Como ler um gráfico antes de interpretar",
      "body": "O eixo horizontal, lido da esquerda para a direita, mostrará prazo remanescente em anos. O vertical, de baixo para cima, mostrará taxa em porcentagem ao ano (% a.a.). Um ponto combina as duas coordenadas. Os três pontos do gráfico A pertencem à mesma data fictícia e, por hipótese didática, a instrumentos comparáveis. A linha apenas conecta os pontos para facilitar a leitura; não adiciona observações intermediárias nem mostra um caminho no calendário. A tabela oferece os mesmos dados para leitura sem gráfico.",
      "sourceIds": []
    },
    {
      "id": "grafico-a",
      "type": "explanation",
      "heading": "3. Gráfico A: uma fotografia fictícia dos prazos",
      "body": "Data fictícia A. Mesma moeda, mesma convenção de taxa anual e risco comparável por hipótese. Os números não são cotações brasileiras nem dados do BCE.\n\n| Prazo remanescente (anos) | Taxa (% a.a.) |\n| --- | --- |\n| 1 | 6 |\n| 2 | 7 |\n| 3 | 8 |\n\n```mermaid\nxychart-beta\n  title \"A: mesma data, prazos diferentes — dados fictícios\"\n  x-axis \"Prazo remanescente (anos)\" [1, 2, 3]\n  y-axis \"Taxa (% a.a.)\" 5 --> 9\n  line [6, 7, 8]\n```",
      "sourceIds": []
    },
    {
      "id": "exemplo-leitura",
      "type": "worked-example",
      "heading": "4. Exemplo resolvido: duas coordenadas, duas unidades",
      "body": "No gráfico A, localize 2 no eixo horizontal: significa dois anos até o vencimento, não o segundo ano de um histórico. Suba até o ponto; a taxa no eixo vertical é 7% a.a. Para um ano, o ponto mostra 6% a.a. Diferença: 7 − 6 = 1 ponto percentual. A comparação usa duas taxas na mesma data para prazos diferentes. Não diz que a taxa básica subirá de 6% para 7% daqui a um ano.",
      "sourceIds": []
    },
    {
      "id": "formas",
      "type": "explanation",
      "heading": "5. Ascendente, descendente e plana",
      "body": "Uma curva ascendente tem taxas maiores nos prazos mais longos do recorte; descendente, menores; plana, aproximadamente iguais. São descrições da relação observada, não regras universais. A forma pode refletir expectativas e avaliação de riscos incorporadas aos preços. “Prêmio” designa aqui remuneração adicional exigida por riscos ou condições; não um bônus garantido. Uma leitura de tendência da curva não fornece certeza sobre inflação, recessão ou decisões futuras.",
      "sourceIds": [
        "bce.curva"
      ]
    },
    {
      "id": "exemplo-futuro",
      "type": "worked-example",
      "heading": "6. Exemplo resolvido: a foto não é um filme",
      "body": "Um estudante olha a curva A e diz: “O juro de três anos é 8%, então a Selic será exatamente 8% no terceiro ano”. Primeiro erro: o eixo mostra prazo remanescente, não uma sequência de futuras decisões do Copom. Segundo: taxa de determinado instrumento/prazo e taxa Selic são medidas diferentes. Terceiro: expectativas e riscos nos preços não garantem realização. A conclusão segura é apenas a taxa de 8% a.a. atribuída, no modelo e naquela data, ao prazo de três anos.",
      "sourceIds": [
        "bcb.selic"
      ]
    },
    {
      "id": "acumulado",
      "type": "explanation",
      "heading": "7. Taxa anual e retorno acumulado não são iguais",
      "body": "Para entender a unidade, considere separadamente uma aplicação fictícia com taxa efetiva fixa de 10% ao ano durante dois anos, reinvestindo integralmente os juros, sem custos ou outras movimentações. Depois de um ano, multiplica-se por 1,10. No segundo, a nova base também é multiplicada por 1,10. Isso ensina a capitalização composta deste modelo; não é autorização para calcular todos os preços da curva, que dependeriam das convenções de cada instrumento.",
      "sourceIds": []
    },
    {
      "id": "exemplo-acumulado",
      "type": "worked-example",
      "heading": "8. Exemplo resolvido: usar a nova base",
      "body": "Partindo de 100 no modelo da seção anterior: ano 1, 100 × 1,10 = 110; ano 2, 110 × 1,10 = 121. O ganho de 21 sobre os 100 iniciais equivale a 21% acumulados em dois anos. 10% a.a. não significa 10% para todo o prazo; somar 10 + 10 daria 20%, diferente deste modelo composto. Não se devem aplicar esses números fictícios a um título real só pelo nome.",
      "sourceIds": []
    },
    {
      "id": "exemplo-comparar",
      "type": "worked-example",
      "heading": "9. Exemplo resolvido: mudança numa ponta",
      "body": "Outro par de fotografias fictícias comparáveis: antes, taxas de 5% para um ano e 7% para três; depois, 6% para um ano e 7% para três. A ponta curta subiu 1 ponto percentual; a longa não mudou. Logo, dizer “todas as taxas subiram igualmente” seria falso. O intervalo longa menos curta passou de 2 para 1 ponto percentual. Uma única taxa não resume toda a estrutura por prazos.",
      "sourceIds": []
    },
    {
      "id": "grafico-b",
      "type": "explanation",
      "heading": "10. Gráfico B para uma nova leitura",
      "body": "Use este segundo conjunto fictício nas questões indicadas. Mesmas hipóteses de comparação interna do gráfico A, mas outra situação; não é uma série temporal de A para B.\n\n| Prazo remanescente (anos) | Taxa (% a.a.) |\n| --- | --- |\n| 1 | 9 |\n| 2 | 8 |\n| 3 | 7 |\n\n```mermaid\nxychart-beta\n  title \"B: outra situação fictícia\"\n  x-axis \"Prazo remanescente (anos)\" [1, 2, 3]\n  y-axis \"Taxa (% a.a.)\" 6 --> 10\n  line [9, 8, 7]\n```",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "11. Vocabulário de leitura",
      "body": "Prazo remanescente: tempo até vencer a partir da observação. Curva/estrutura a termo: relação entre taxas e prazos. Ponta curta/longa: prazos menores/maiores no recorte. Pontos percentuais: unidade de diferença entre porcentagens. Taxa anual: expressa em um ano segundo convenção indicada. Acumulado: variação ao longo de todo o intervalo. Expectativa: avaliação de futuro, não realização garantida.",
      "sourceIds": []
    },
    {
      "id": "resumo",
      "type": "summary",
      "heading": "12. Primeiro leia; depois limite a conclusão",
      "body": "Leia data, eixos e unidades; localize o ponto; compare prazos compatíveis; descreva a forma. Só então avalie se a frase pretendida vai além dos dados. Não trate curva como previsão infalível nem taxa anual como retorno acumulado. Ao recuperar um erro, escreva a coordenada completa e diga qual eixo ou período havia confundido.",
      "sourceIds": []
    }
  ],
  "questions": [
    {
      "prompt": "No gráfico B, qual leitura corresponde ao ponto de dois anos?",
      "options": [
        "8% a.a. para prazo remanescente de dois anos, naquela situação fictícia.",
        "8% acumulados garantidos em quaisquer dois anos.",
        "A inflação será 8% daqui a dois anos.",
        "A Selic será necessariamente 8% no segundo ano."
      ],
      "answer": 0,
      "explanation": "O ponto liga prazo e taxa na data de observação; não informa essas outras medidas.",
      "optionRationales": [
        "Lê as duas coordenadas.",
        "Troca unidade anual por acumulada e cria garantia.",
        "A curva não mede diretamente inflação futura.",
        "Troca prazo de instrumento por decisão futura."
      ],
      "recoverySectionIds": [
        "eixos",
        "exemplo-leitura",
        "grafico-b"
      ],
      "objectiveIds": [
        "O1"
      ],
      "id": "mp09.q01",
      "topicId": "draft.mp09"
    },
    {
      "prompt": "Como descrever o gráfico B no recorte de um a três anos?",
      "options": [
        "Plano, pois há três pontos.",
        "Ascendente, porque o prazo cresce.",
        "Descendente, porque a taxa cai de 9% para 7% conforme o prazo aumenta.",
        "Histórico anual da Selic."
      ],
      "answer": 2,
      "explanation": "A forma compara taxas por prazo, não a contagem de pontos nem passagem de anos.",
      "optionRationales": [
        "Quantidade de pontos não define forma.",
        "O crescimento do eixo não implica crescimento da taxa.",
        "Compara a direção das taxas corretamente.",
        "Confunde fotografia por prazo e histórico."
      ],
      "recoverySectionIds": [
        "formas",
        "grafico-b"
      ],
      "objectiveIds": [
        "O2"
      ],
      "id": "mp09.q02",
      "topicId": "draft.mp09"
    },
    {
      "prompt": "No gráfico B, a taxa de um ano supera a de três anos em quanto?",
      "options": [
        "2 reais.",
        "2 pontos percentuais.",
        "Exatamente 2% de variação relativa da taxa de três anos.",
        "16 pontos percentuais."
      ],
      "answer": 1,
      "explanation": "9% − 7% = 2 pontos percentuais; a diferença não é um valor monetário.",
      "optionRationales": [
        "Usa unidade monetária para taxas.",
        "Nomeia corretamente a diferença.",
        "Confunde diferença em pontos e proporção relativa.",
        "Soma em vez de subtrair."
      ],
      "recoverySectionIds": [
        "exemplo-leitura",
        "grafico-b"
      ],
      "objectiveIds": [
        "O2"
      ],
      "id": "mp09.q03",
      "topicId": "draft.mp09"
    },
    {
      "prompt": "O que uma taxa longa elevada permite afirmar sozinha sobre a decisão futura do Copom?",
      "options": [
        "Que a taxa básica seguirá exatamente a mesma trajetória.",
        "Que a inflação futura já está medida.",
        "Que todo investimento terá ganho garantido.",
        "Não determina essa decisão: instrumentos, expectativas e riscos precisam ser separados."
      ],
      "answer": 3,
      "explanation": "Uma taxa observada por prazo não é uma sequência garantida de decisões monetárias.",
      "optionRationales": [
        "Transforma preço e expectativa em certeza.",
        "Confunde informação de mercado e medição futura.",
        "Cria garantia não presente.",
        "Mantém o limite da evidência."
      ],
      "recoverySectionIds": [
        "formas",
        "exemplo-futuro"
      ],
      "objectiveIds": [
        "O3"
      ],
      "id": "mp09.q04",
      "topicId": "draft.mp09"
    },
    {
      "prompt": "Modelo fictício: 100 a 5% efetivos ao ano por dois anos, reinvestindo juros, sem custos ou movimentações. Qual montante final?",
      "options": [
        "110, porque basta somar as taxas.",
        "105, pois a taxa só pode valer uma vez.",
        "110,25, calculando 100 × 1,05 × 1,05.",
        "125, porque dois anos significam elevar 5 ao quadrado e somar."
      ],
      "answer": 2,
      "explanation": "Primeiro chega a 105; depois 105 × 1,05 = 110,25. O exemplo declara capitalização composta.",
      "optionRationales": [
        "Usa modelo simples em lugar do composto fornecido.",
        "Ignora o segundo período.",
        "Atualiza a base no segundo ano.",
        "Não usa fatores de crescimento."
      ],
      "recoverySectionIds": [
        "acumulado",
        "exemplo-acumulado"
      ],
      "objectiveIds": [
        "O4"
      ],
      "id": "mp09.q05",
      "topicId": "draft.mp09"
    },
    {
      "prompt": "Taxas comparáveis: a curta passa de 4% para 5% e a longa permanece 6%. Qual afirmação é correta?",
      "options": [
        "Toda a curva subiu 1 ponto percentual.",
        "A curta subiu 1 ponto percentual, e o intervalo longa menos curta caiu de 2 para 1 ponto.",
        "A longa caiu 1 ponto percentual.",
        "Nenhuma taxa mudou."
      ],
      "answer": 1,
      "explanation": "A mudança de um ponto da estrutura não implica mudança igual em todos.",
      "optionRationales": [
        "Generaliza a mudança curta.",
        "Calcula as diferenças nas duas fotografias.",
        "A taxa longa permaneceu 6%.",
        "Ignora a alteração curta."
      ],
      "recoverySectionIds": [
        "exemplo-comparar"
      ],
      "objectiveIds": [
        "O5"
      ],
      "id": "mp09.q06",
      "topicId": "draft.mp09"
    },
    {
      "prompt": "Duas taxas têm prazos diferentes, mas também moedas e riscos diferentes. Podemos atribuir toda a diferença apenas ao prazo?",
      "options": [
        "Não: a comparação mistura outras características relevantes.",
        "Sim, o prazo sempre explica tudo.",
        "Sim, basta ambas conterem o símbolo %.",
        "Não: taxas nunca podem ser comparadas em nenhum caso."
      ],
      "answer": 0,
      "explanation": "É necessário controlar ou explicitar as características, em vez de supor comparabilidade.",
      "optionRationales": [
        "Identifica a limitação.",
        "Ignora moeda e risco.",
        "Unidade percentual sozinha não basta.",
        "Generaliza uma limitação específica."
      ],
      "recoverySectionIds": [
        "retomada",
        "resumo"
      ],
      "objectiveIds": [
        "O5"
      ],
      "id": "mp09.q07",
      "topicId": "draft.mp09"
    }
  ],
  "recall": [
    "Leia um ponto do gráfico B dizendo prazo, unidade e data fictícia.",
    "Explique por que uma fotografia da curva não é um histórico nem garantia do futuro.",
    "Após errar, retome a coordenada/base correta e refaça a comparação com um ponto diferente."
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "mp09-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "mp09.q01": [
        {
          "missionId": "draft.mp09",
          "sectionId": "eixos"
        },
        {
          "missionId": "draft.mp09",
          "sectionId": "exemplo-leitura"
        },
        {
          "missionId": "draft.mp09",
          "sectionId": "grafico-b"
        }
      ],
      "mp09.q02": [
        {
          "missionId": "draft.mp09",
          "sectionId": "formas"
        },
        {
          "missionId": "draft.mp09",
          "sectionId": "grafico-b"
        }
      ],
      "mp09.q03": [
        {
          "missionId": "draft.mp09",
          "sectionId": "exemplo-leitura"
        },
        {
          "missionId": "draft.mp09",
          "sectionId": "grafico-b"
        }
      ],
      "mp09.q04": [
        {
          "missionId": "draft.mp09",
          "sectionId": "formas"
        },
        {
          "missionId": "draft.mp09",
          "sectionId": "exemplo-futuro"
        }
      ],
      "mp09.q05": [
        {
          "missionId": "draft.mp09",
          "sectionId": "acumulado"
        },
        {
          "missionId": "draft.mp09",
          "sectionId": "exemplo-acumulado"
        }
      ],
      "mp09.q06": [
        {
          "missionId": "draft.mp09",
          "sectionId": "exemplo-comparar"
        }
      ],
      "mp09.q07": [
        {
          "missionId": "draft.mp09",
          "sectionId": "retomada"
        },
        {
          "missionId": "draft.mp09",
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
      "item": "Item 14",
      "status": "histórico; adoção/profundidade pendentes"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Item impresso 278, posição 28",
      "status": "histórico; adoção/profundidade pendentes"
    }
  ],
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Retomar o exemplo indicado, explicar o erro e resolver um caso alterado; sem alterar a política de revisão do aplicativo."
  },
  "limits": [
    "Gráficos inteiramente fictícios, com tabelas equivalentes para acessibilidade; não são cotações nem reprodução da curva brasileira.",
    "Estrutura a termo introdutória: sem estimação, interpolação, taxas a termo implícitas ou precificação completa.",
    "Modelo composto ensinado separadamente com taxa efetiva fixa, sem afirmar convenção de qualquer título real.",
    "Rascunho fora do catálogo; não é nova forma independente A/B, aceite de fase ou recomendação financeira."
  ]
};
export const ARITHMETIC = [
  {
    "label": "Diferença A",
    "operation": "subtract",
    "values": [
      7,
      6
    ],
    "expected": 1
  },
  {
    "label": "Composto: ano 1",
    "operation": "multiply",
    "values": [
      100,
      1.1
    ],
    "expected": 110
  },
  {
    "label": "Composto: ano 2",
    "operation": "multiply",
    "values": [
      110,
      1.1
    ],
    "expected": 121
  },
  {
    "label": "Composto: ganho",
    "operation": "subtract",
    "values": [
      121,
      100
    ],
    "expected": 21
  },
  {
    "label": "Intervalo antes",
    "operation": "subtract",
    "values": [
      7,
      5
    ],
    "expected": 2
  },
  {
    "label": "Intervalo depois",
    "operation": "subtract",
    "values": [
      7,
      6
    ],
    "expected": 1
  },
  {
    "label": "q03",
    "operation": "subtract",
    "values": [
      9,
      7
    ],
    "expected": 2
  },
  {
    "label": "q05 ano 1",
    "operation": "multiply",
    "values": [
      100,
      1.05
    ],
    "expected": 105
  },
  {
    "label": "q05 ano 2",
    "operation": "multiply",
    "values": [
      105,
      1.05
    ],
    "expected": 110.25
  },
  {
    "label": "q06 antes",
    "operation": "subtract",
    "values": [
      6,
      4
    ],
    "expected": 2
  },
  {
    "label": "q06 depois",
    "operation": "subtract",
    "values": [
      6,
      5
    ],
    "expected": 1
  }
];
