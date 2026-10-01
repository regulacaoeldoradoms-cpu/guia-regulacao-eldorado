// Rascunho editorial isolado; não importar no runtime.
export const SOURCES = [
  {
    "id": "imf.ce.real",
    "label": "FMI — Real Exchange Rates: What Money Can Buy",
    "url": "https://www.imf.org/en/publications/fandd/issues/series/back-to-basics/real-exchange-rates",
    "version": "Texto educativo Back to Basics, consultado em 01/10/2026",
    "locator": "Equação eP*/P; índices/base de comparação e limites da comparação de poder de compra",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "bcb.ce.politica",
    "label": "BCB — Política cambial",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/politicacambial",
    "version": "Página pública renderizada em 01/10/2026",
    "locator": "Regimes, flutuação no Brasil e atuação para funcionalidade; efeitos sobre comércio e preços",
    "checkedAt": "2026-10-01"
  }
];

export const CE09_DRAFT = {
  "id": "draft.ce09",
  "topicId": "draft.ce09",
  "editorialKey": "CE-09",
  "candidateBlockId": "banking.capital-exchange",
  "title": "Câmbio nominal e real: preços e convenção explícita",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Calcular uma comparação real simples com convenção explícita, distinguindo cotação monetária de preços relativos.",
  "sourceIds": [
    "imf.ce.real",
    "bcb.ce.politica"
  ],
  "sections": [
    {
      "id": "inicio",
      "type": "explanation",
      "heading": "1. O número na cotação não conta toda a história",
      "body": "A taxa nominal e troca moedas: aqui, reais por dólar. Para comparar preços entre países, é preciso também olhar quanto custa uma cesta em cada lugar. Usaremos a mesma cesta hipotética, sem custos de transporte, tributos ou barreiras no exercício. Isso permite aprender a conta, não medir toda a competitividade de um país.",
      "sourceIds": [
        "imf.ce.real"
      ]
    },
    {
      "id": "formula",
      "type": "explanation",
      "heading": "2. Defina símbolos antes de calcular",
      "body": "P* é o preço da cesta no exterior, em dólares; P é o preço da cesta doméstica, em reais. A convenção desta aula é q = e × P* ÷ P. Primeiro e × P* converte o preço estrangeiro em reais. Depois dividimos pelo preço doméstico. Assim q compara dois preços na mesma moeda. Outras fontes podem usar a inversa; nunca interprete o sentido sem ler a fórmula.",
      "sourceIds": [
        "imf.ce.real"
      ]
    },
    {
      "id": "ex-nivel",
      "type": "worked-example",
      "heading": "3. Exemplo resolvido: a mesma cesta",
      "body": "Considere e = 5 R$/US$, P* = US$ 12 e P = R$ 60. A cesta estrangeira convertida custa 5 × 12 = R$ 60. Então q = 60 ÷ 60 = 1. No modelo informado, os preços coincidem. Isso não prova que a economia real esteja em equilíbrio: o exercício excluiu várias diferenças e custos.",
      "sourceIds": []
    },
    {
      "id": "sentido",
      "type": "explanation",
      "heading": "4. O que uma mudança de q significa aqui",
      "body": "Nesta convenção, q maior representa cesta estrangeira relativamente mais cara que a doméstica: desvalorização real da moeda doméstica. q menor representa valorização real. A expressão 'real' se refere ao ajuste pelos preços, não apenas à moeda brasileira. Não se deduz a causa olhando só q: podem mudar e, P* ou P.",
      "sourceIds": [
        "imf.ce.real"
      ]
    },
    {
      "id": "ex-nominal",
      "type": "worked-example",
      "heading": "5. Exemplo resolvido: muda apenas a cotação",
      "body": "Mantendo P* = US$ 12 e P = R$ 60, e sobe de 5 para 6 R$/US$. Antes q = 1. Depois, a cesta estrangeira convertida custa 6 × 12 = R$ 72; q = 72 ÷ 60 = 1,20. Sob esses preços constantes, a desvalorização nominal do real também produz desvalorização real.",
      "sourceIds": []
    },
    {
      "id": "precos",
      "type": "explanation",
      "heading": "6. Cotação parada não garante q parado",
      "body": "Se a cotação nominal ficar constante e o preço doméstico aumentar, mantendo o preço estrangeiro, o denominador P sobe e q cai. Se o preço estrangeiro subir, mantendo os demais dados, o numerador sobe e q aumenta. Compare sempre os cenários completos, sem presumir preços constantes quando o enunciado os altera.",
      "sourceIds": []
    },
    {
      "id": "ex-precos",
      "type": "worked-example",
      "heading": "7. Exemplo resolvido: muda apenas o preço doméstico",
      "body": "Agora e = 5 R$/US$ e P* = US$ 10 permanecem. P sobe de R$ 40 para R$ 50. A cesta estrangeira convertida continua R$ 50. Antes q = 50 ÷ 40 = 1,25; depois q = 50 ÷ 50 = 1. Houve queda de q e valorização real nesta convenção, apesar de não haver mudança nominal do câmbio.",
      "sourceIds": []
    },
    {
      "id": "indice",
      "type": "explanation",
      "heading": "8. Índice de base 100 é uma régua de comparação",
      "body": "Escolha uma data-base com q₀ conhecido. O índice Iₜ = (qₜ ÷ q₀) × 100 informa a mudança em relação àquela base. O número 100 é uma normalização, não prova de preço justo ou equilíbrio. Não confunda o nível q com o índice I. Um índice maior que 100 apenas compara o q atual com o q da base, na convenção adotada.",
      "sourceIds": []
    },
    {
      "id": "ex-indice",
      "type": "worked-example",
      "heading": "9. Exemplo resolvido: nível e índice diferentes",
      "body": "Se q₀ = 1,20 e qₜ = 1,50, o índice atual é 1,50 ÷ 1,20 × 100 = 125. Isso significa q 25% acima da base. Não significa que q valha 125 nem que a moeda esteja exatamente 25% fora de um suposto equilíbrio. A base foi escolhida para comparar datas.",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "10. Vocabulário essencial",
      "body": "Nominal: cotação entre moedas. P*: preço estrangeiro da cesta. P: preço doméstico da cesta. q: razão de preços na convenção declarada. Índice: comparação normalizada por uma base. Desvalorização real: aumento de q nesta fórmula; não transportar o sentido para a fórmula inversa.",
      "sourceIds": []
    },
    {
      "id": "retomada",
      "type": "summary",
      "heading": "11. Síntese e recuperação",
      "body": "Se misturou dólares com reais, retome formula e ex-nivel. Para o sentido de valorização, leia sentido com a fórmula à vista. Se ignorou preços internos, volte a precos e ex-precos. Se confundiu 100 com equilíbrio, refaça indice e ex-indice. Escreva a hipótese que ficou constante em cada comparação.",
      "sourceIds": []
    }
  ],
  "questions": [
    {
      "id": "ce09.q01",
      "prompt": "Na convenção e = reais por dólar, q = e × P* ÷ P compara:",
      "options": [
        "Somente duas cotações nominais sem preços.",
        "O número de ações de duas empresas.",
        "Uma taxa de juros com um saldo bancário.",
        "O preço estrangeiro convertido em reais com o preço doméstico."
      ],
      "answer": 3,
      "explanation": "Numerador e denominador são preços em reais de uma cesta comparável no exercício.",
      "optionRationales": [
        "P* e P são essenciais na fórmula.",
        "Não há participação societária na fórmula.",
        "As grandezas indicadas não correspondem aos símbolos.",
        "Correta: é a construção da medida."
      ],
      "objectiveIds": [
        "O1",
        "O2"
      ],
      "recoverySectionIds": [
        "inicio",
        "formula"
      ]
    },
    {
      "id": "ce09.q02",
      "prompt": "Dados e = 4 R$/US$, P* = US$ 15 e P = R$ 50, qual é q?",
      "options": [
        "0,80.",
        "60.",
        "1,20.",
        "50."
      ],
      "answer": 2,
      "explanation": "Converta: 4 × 15 = R$ 60. Depois 60 ÷ 50 = 1,20.",
      "optionRationales": [
        "Não corresponde à conta definida.",
        "R$ 60 é o preço convertido, antes de dividir.",
        "Correta: divide preços na mesma moeda.",
        "R$ 50 é o preço doméstico, não a razão."
      ],
      "objectiveIds": [
        "O2"
      ],
      "recoverySectionIds": [
        "formula",
        "ex-nivel"
      ]
    },
    {
      "id": "ce09.q03",
      "prompt": "Na convenção explicitada, q aumenta de 1 para 1,10. Isso representa:",
      "options": [
        "Valorização real, porque qualquer alta favorece a moeda doméstica.",
        "Desvalorização real da moeda doméstica nessa medida.",
        "Prova de equilíbrio econômico.",
        "Obrigatoriamente uma mudança apenas na taxa nominal."
      ],
      "answer": 1,
      "explanation": "A cesta estrangeira ficou relativamente mais cara; a causa exige observar os componentes.",
      "optionRationales": [
        "O sentido depende da fórmula, não da palavra 'alta'.",
        "Correta: segue a convenção adotada.",
        "A variação não prova equilíbrio.",
        "Preços domésticos ou estrangeiros também podem mudar q."
      ],
      "objectiveIds": [
        "O3",
        "O4"
      ],
      "recoverySectionIds": [
        "sentido",
        "precos"
      ]
    },
    {
      "id": "ce09.q04",
      "prompt": "Com e e P* constantes, P aumenta. Pela fórmula q = e × P* ÷ P, ocorre:",
      "options": [
        "Queda de q.",
        "Aumento necessário de q.",
        "Nenhuma mudança possível de q.",
        "Aumento obrigatório da cotação nominal e."
      ],
      "answer": 0,
      "explanation": "O denominador cresce e o numerador fica constante.",
      "optionRationales": [
        "Correta: há valorização real nesta convenção.",
        "É o sentido contrário ao efeito do denominador.",
        "q depende de P.",
        "O enunciado mantém e constante."
      ],
      "objectiveIds": [
        "O2",
        "O3",
        "O4"
      ],
      "recoverySectionIds": [
        "precos",
        "ex-precos"
      ]
    },
    {
      "id": "ce09.q05",
      "prompt": "q era 0,80 na base e passou a 1. Qual é o índice atual com base 100?",
      "options": [
        "80.",
        "125.",
        "1.",
        "100,20."
      ],
      "answer": 1,
      "explanation": "I = 1 ÷ 0,80 × 100 = 125.",
      "optionRationales": [
        "Isso não normaliza a razão atual pela base.",
        "Correta: q ficou 25% acima da base.",
        "1 é o nível atual q, não o índice.",
        "Somar os níveis não faz a normalização."
      ],
      "objectiveIds": [
        "O5"
      ],
      "recoverySectionIds": [
        "indice",
        "ex-indice"
      ]
    },
    {
      "id": "ce09.q06",
      "prompt": "Um índice de câmbio real tem valor 100 na data-base. Isso prova que:",
      "options": [
        "Nada sobre equilíbrio, por si só; 100 foi escolhido como base.",
        "A moeda estava exatamente em equilíbrio.",
        "A cotação nominal era R$ 100 por dólar.",
        "Todas as mercadorias tinham o mesmo preço nos dois países."
      ],
      "answer": 0,
      "explanation": "Normalização é convenção de apresentação, não teste de equilíbrio.",
      "optionRationales": [
        "Correta: separa índice e conclusão econômica.",
        "Faltam critérios e evidência para tal afirmação.",
        "Não há essa igualdade entre índice e cotação.",
        "A base não demonstra igualdade de todos os preços."
      ],
      "objectiveIds": [
        "O5"
      ],
      "recoverySectionIds": [
        "indice",
        "ex-indice"
      ]
    },
    {
      "id": "ce09.q07",
      "prompt": "e fica em 5 e P* em 10; P cai de 50 para 40. Qual a mudança de q?",
      "options": [
        "De 1 para 0,80.",
        "Permanece em 1 porque e não mudou.",
        "De 50 para 40.",
        "De 1 para 1,25."
      ],
      "answer": 3,
      "explanation": "O preço estrangeiro convertido é 50; 50 ÷ 50 = 1 e 50 ÷ 40 = 1,25.",
      "optionRationales": [
        "Inverte o efeito da queda de P.",
        "Ignora a mudança do denominador.",
        "São os preços P, não a razão q.",
        "Correta: a mudança real pode ocorrer sem mudança nominal."
      ],
      "objectiveIds": [
        "O2",
        "O4"
      ],
      "recoverySectionIds": [
        "formula",
        "precos",
        "ex-precos"
      ]
    },
    {
      "id": "ce09.q08",
      "prompt": "Outra fonte usa a razão inversa para definir câmbio real. Antes de interpretar uma alta, você deve:",
      "options": [
        "Aplicar automaticamente o sentido desta aula.",
        "Ignorar a fórmula e olhar só a palavra 'real'.",
        "Conferir a convenção e as unidades adotadas pela fonte.",
        "Considerar toda alta como ganho financeiro."
      ],
      "answer": 2,
      "explanation": "Inverter a razão inverte o sentido de sua variação.",
      "optionRationales": [
        "A interpretação não se transfere sem conferir.",
        "A palavra não especifica a fórmula.",
        "Correta: a convenção determina o significado.",
        "A medida não é uma garantia de resultado de investimento."
      ],
      "objectiveIds": [
        "O1",
        "O2",
        "O3"
      ],
      "recoverySectionIds": [
        "formula",
        "sentido"
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
    "editorialPass": "ce09-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "ce09.q01": [
        {
          "missionId": "draft.ce09",
          "sectionId": "inicio"
        },
        {
          "missionId": "draft.ce09",
          "sectionId": "formula"
        }
      ],
      "ce09.q02": [
        {
          "missionId": "draft.ce09",
          "sectionId": "formula"
        },
        {
          "missionId": "draft.ce09",
          "sectionId": "ex-nivel"
        }
      ],
      "ce09.q03": [
        {
          "missionId": "draft.ce09",
          "sectionId": "sentido"
        },
        {
          "missionId": "draft.ce09",
          "sectionId": "precos"
        }
      ],
      "ce09.q04": [
        {
          "missionId": "draft.ce09",
          "sectionId": "precos"
        },
        {
          "missionId": "draft.ce09",
          "sectionId": "ex-precos"
        }
      ],
      "ce09.q05": [
        {
          "missionId": "draft.ce09",
          "sectionId": "indice"
        },
        {
          "missionId": "draft.ce09",
          "sectionId": "ex-indice"
        }
      ],
      "ce09.q06": [
        {
          "missionId": "draft.ce09",
          "sectionId": "indice"
        },
        {
          "missionId": "draft.ce09",
          "sectionId": "ex-indice"
        }
      ],
      "ce09.q07": [
        {
          "missionId": "draft.ce09",
          "sectionId": "formula"
        },
        {
          "missionId": "draft.ce09",
          "sectionId": "precos"
        },
        {
          "missionId": "draft.ce09",
          "sectionId": "ex-precos"
        }
      ],
      "ce09.q08": [
        {
          "missionId": "draft.ce09",
          "sectionId": "formula"
        },
        {
          "missionId": "draft.ce09",
          "sectionId": "sentido"
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
      "item": "Item 9 — taxas de câmbio nominais e reais",
      "status": "histórico; referenceOnly"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Item 23 — taxas de câmbio nominais e reais",
      "status": "histórico; referenceOnly"
    }
  ],
  "objectives": {
    "O1": "Distinguir cotação nominal de comparação real de preços.",
    "O2": "Usar q = e × P* ÷ P com unidades e cestas comparáveis informadas.",
    "O3": "Interpretar aumento ou queda de q apenas na convenção declarada.",
    "O4": "Separar alteração cambial nominal de alteração dos preços.",
    "O5": "Entender índice com base 100 sem tratá-lo como prova de equilíbrio.",
    "O6": "Recuperar a confusão conceitual pela seção de origem e reconstruir o caso."
  },
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Retomar as seções por questão, explicar o erro e refazer o raciocínio; sem indicador novo de domínio."
  },
  "limits": [
    "Modelo bilateral didático com cesta comparável e dados fornecidos; não calcula taxa efetiva ponderada, câmbio de equilíbrio, previsão ou recomendação. Índices são normalizados explicitamente.",
    "Casos e valores fictícios; educação geral, sem recomendação de investimento ou procedimento para caso real. Não representa cobertura integral dos itens históricos.",
    "Prática exposta, não avaliação independente. IDs editoriais, sem XP/ordem/desbloqueio; publicação.status draft e nenhuma importação no runtime.",
    "Fontes novas consultadas em 01/10/2026; consultas reaproveitadas preservam a data original. Confirmar mudanças normativas pertinentes antes de publicação."
  ]
};

export const ARITHMETIC = [
  {
    "label": "ex1 preço",
    "operation": "multiply",
    "values": [
      5,
      12
    ],
    "expected": 60
  },
  {
    "label": "ex1 q",
    "operation": "divide",
    "values": [
      60,
      60
    ],
    "expected": 1
  },
  {
    "label": "ex2 preço",
    "operation": "multiply",
    "values": [
      6,
      12
    ],
    "expected": 72
  },
  {
    "label": "ex2 q",
    "operation": "divide",
    "values": [
      72,
      60
    ],
    "expected": 1.2
  },
  {
    "label": "ex3 preço",
    "operation": "multiply",
    "values": [
      5,
      10
    ],
    "expected": 50
  },
  {
    "label": "ex3 q inicial",
    "operation": "divide",
    "values": [
      50,
      40
    ],
    "expected": 1.25
  },
  {
    "label": "ex3 q final",
    "operation": "divide",
    "values": [
      50,
      50
    ],
    "expected": 1
  },
  {
    "label": "ex4 razão",
    "operation": "divide",
    "values": [
      1.5,
      1.2
    ],
    "expected": 1.25
  },
  {
    "label": "ex4 índice",
    "operation": "multiply",
    "values": [
      1.25,
      100
    ],
    "expected": 125
  },
  {
    "label": "q2 preço",
    "operation": "multiply",
    "values": [
      4,
      15
    ],
    "expected": 60
  },
  {
    "label": "q2 q",
    "operation": "divide",
    "values": [
      60,
      50
    ],
    "expected": 1.2
  },
  {
    "label": "q5 razão",
    "operation": "divide",
    "values": [
      1,
      0.8
    ],
    "expected": 1.25
  },
  {
    "label": "q5 índice",
    "operation": "multiply",
    "values": [
      1.25,
      100
    ],
    "expected": 125
  }
];
