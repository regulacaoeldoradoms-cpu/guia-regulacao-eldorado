// Ensino e exercícios autorais; rascunho com fonte normativa primária.
export const SOURCES = [
  {
    "id": "acordo.oa.acentuacao",
    "label": "Acordo Ortográfico — acentuação gráfica",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2008/decreto/d6583.htm",
    "checkedAt": "2026-10-04",
    "version": "Decreto nº 6.583/2008, Anexo I — texto oficial consultado",
    "locator": "Anexo I, Base VIII, 1º a/c e 2º a; exemplos de monossílabos do recorte a/e/o, sem todos os casos especiais"
  }
];

export const OA02_DRAFT = {
  "id": "draft.oa02",
  "topicId": "draft.oa02",
  "editorialKey": "OA-02",
  "candidateBlockId": "portuguese.spelling",
  "title": "Oxítonas e monossílabos tônicos: aplicar a regra ao caso",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Distinguir palavras com uma ou mais sílabas e aplicar o recorte de acentuação de oxítonas e monossílabos tônicos, sem generalizar que toda sílaba final tônica exige acento.",
  "sourceIds": [
    "acordo.oa.acentuacao"
  ],
  "sections": [
    {
      "id": "entrada",
      "heading": "1. Retome a posição tônica",
      "body": "OA-01 ensinou a separar destaque da pronúncia e sinal gráfico. Agora leia: O café ficou perto do sofá. Nas leituras ca-FÉ e so-FÁ, a última sílaba é tônica. As palavras têm mais de uma sílaba e são oxítonas. Antes da regra, confirme classe e terminação da palavra.",
      "type": "explanation",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "monossilabo",
      "heading": "2. Uma sílaba: outra identificação inicial",
      "body": "Monossílabo é palavra de uma sílaba. Neste recorte, “pé”, “pó” e “mês” são monossílabos tônicos: têm destaque próprio na pronúncia das frases dadas. Não chamar “pé” de paroxítona nem procurar uma penúltima sílaba que não existe.\n\nNem todo monossílabo recebe acento gráfico. Em “A casa ficou aberta”, o artigo “a” é átono nesse uso e não recebe acento. Contexto e pronúncia importam; não usar apenas a quantidade de letras.",
      "type": "explanation",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "finais",
      "heading": "3. Oxítonas terminadas em a, e, o, com ou sem s",
      "body": "No recorte de palavras como sofá/sofás, café/cafés, cipó/cipós, você/vocês e robô/robôs, a última vogal tônica terminando em a, e ou o, com ou sem s, recebe acento gráfico. O agudo e o circunflexo seguem a pronúncia: “café” usa agudo; “você” usa circunflexo. Esta aula usa as leituras correntes indicadas, sem cobrar todas as variantes de timbre ou casos especiais do Acordo.",
      "type": "explanation",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "ex-final",
      "heading": "4. Exemplo resolvido: classe e terminação",
      "body": "Na frase “O sofá ficou perto da janela”, a leitura so-FÁ mostra tônica final e terminação a. A grafia é “sofá”, conforme o caso ensinado. Já “janela”, ja-NE-la, não é oxítona; terminar em a não basta para aplicar esta regra. Primeiro a classe, depois a terminação.",
      "type": "worked-example",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "em",
      "heading": "5. Oxítonas com mais de uma sílaba em em/ens",
      "body": "Palavras oxítonas com mais de uma sílaba terminadas em em ou ens, no caso introdutório de também, armazém e armazéns, recebem acento agudo. A condição de mais de uma sílaba impede aplicar esse caso a “bem”.\n\nO Acordo prevê casos próprios das formas compostas de ter/vir e de plural; eles não são resolvidos pela frase “todo em recebe agudo” e ficam fora da cobrança desta aula.",
      "type": "explanation",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "ex-em",
      "heading": "6. Exemplo resolvido: também e bem",
      "body": "Compare “Ele também veio” e “Ele veio bem cedo”. “Também”, tam-BÉM, é oxítona com duas sílabas terminada em em: usa acento. “Bem” tem uma sílaba e não recebe acento gráfico. Não aplicar a “bem” uma regra que exige mais de uma sílaba.",
      "type": "worked-example",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "mono-regra",
      "heading": "7. Monossílabos tônicos do recorte",
      "body": "Monossílabos tônicos terminados em a, e ou o, seguidos ou não de s, recebem acento gráfico nos casos como pá/pás, pé/pés, pó/pós, mês e nós. “Pé” e “pó” usam agudo; “mês” usa circunflexo. Monossílabos como “sol” e “bem” não recebem acento por esse caso: suas terminações são outras. Há regras adicionais para outros encontros vocálicos; não foram eliminadas por esse recorte.",
      "type": "explanation",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "ex-mono",
      "heading": "8. Exemplo resolvido: pé e sol",
      "body": "Na frase “O pé ficou perto do sol desenhado”, “pé” é monossílabo tônico terminado em e, acentuado no caso ensinado. “Sol” é monossílabo tônico terminado em l, sem acento por essa regra. Ser tônico não equivale a terminar em a/e/o.",
      "type": "worked-example",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "limites",
      "heading": "9. Não acentuar apenas por ser oxítona",
      "body": "“Abacaxi”, a-ba-ca-XI, é oxítona, mas a terminação i não pertence ao caso a/e/o desta aula e a palavra é escrita sem acento. Não usar “toda oxítona tem acento”. Também não usar a conclusão inversa “qualquer palavra terminada em i nunca tem acento”: hiatos, que serão ensinados em OA-04, têm casos próprios.",
      "type": "explanation",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "glossario",
      "heading": "10. Vocabulário de apoio",
      "body": "Monossílabo: palavra com uma sílaba. Tônico: com destaque próprio no uso apresentado. Oxítona: palavra com tônica final; aqui comparada a monossílabos para escolher a regra adequada. Terminação: parte final da grafia relevante para a regra. Timbre: característica da vogal que participa da escolha entre agudo e circunflexo nos casos indicados.",
      "type": "glossary",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "recuperacao",
      "heading": "11. Refazer a decisão",
      "body": "Informe: palavra e leitura, número de sílabas, classe/tonicidade, terminação e caso da regra. Se errou, veja se ignorou a classe, aplicou em/ens a um monossílabo ou inventou que toda oxítona é acentuada. Refazer a sequência de decisão é mais útil que decorar uma lista sem seus limites.",
      "type": "summary",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    }
  ],
  "recall": [
    "Qual é a sílaba tônica e a classe neste caso?",
    "Qual terminação ou encontro vocálico está presente?",
    "Qual regra e qual limite justificam a grafia?"
  ],
  "questions": [
    {
      "id": "oa02.q01",
      "prompt": "Na leitura so-FÁ da frase “O sofá ficou na sala”, qual justificativa corresponde à grafia “sofá”?",
      "options": [
        "Oxítona terminada em a, no caso ensinado.",
        "Paroxítona terminada em a.",
        "Monossílabo átono.",
        "Todas as palavras da frase recebem acento por ter cinco letras."
      ],
      "answer": 0,
      "explanation": "Localiza tônica final e terminação a.",
      "optionRationales": [
        "Localiza tônica final e terminação a.",
        "A tônica não é a penúltima.",
        "A palavra tem duas sílabas e destaque próprio.",
        "Quantidade de letras não é a regra e a frase não sustenta isso."
      ],
      "recoverySectionIds": [
        "finais",
        "ex-final"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "oa02.q02",
      "prompt": "Qual comparação preserva o ensino sobre “pé” e “café”?",
      "options": [
        "Ambas têm duas sílabas.",
        "“Pé” é monossílabo tônico; “café” tem duas sílabas e é oxítona.",
        "“Pé” é paroxítona porque recebeu acento.",
        "“Café” é monossílabo porque só uma sílaba é tônica."
      ],
      "answer": 1,
      "explanation": "Distingue número de sílabas e classe da palavra.",
      "optionRationales": [
        "“Pé” tem uma sílaba.",
        "Distingue número de sílabas e classe da palavra.",
        "Não há penúltima sílaba em “pé”.",
        "Ter uma tônica não reduz o número total de sílabas."
      ],
      "recoverySectionIds": [
        "monossilabo",
        "finais"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "oa02.q03",
      "prompt": "Por que o caso em/ens de OA-02 se aplica a “também”, mas não exige acento em “bem”?",
      "options": [
        "Porque qualquer palavra curta perde sua sílaba tônica.",
        "Porque “bem” tem três sílabas.",
        "Porque o caso ensinado exige oxítona com mais de uma sílaba; “bem” tem uma.",
        "Porque a letra m impede qualquer acento em português."
      ],
      "answer": 2,
      "explanation": "Usa a condição explícita da regra.",
      "optionRationales": [
        "Palavras curtas podem ser tônicas.",
        "“Bem” tem uma sílaba.",
        "Usa a condição explícita da regra.",
        "“Também” contraria essa suposta proibição."
      ],
      "recoverySectionIds": [
        "em",
        "ex-em"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "oa02.q04",
      "prompt": "Na frase “Ele esperou um mês”, qual descrição identifica o caso de “mês”?",
      "options": [
        "Monossílabo átono sem sinal gráfico.",
        "Oxítona com três sílabas e acento agudo.",
        "Paroxítona que recebe agudo por terminar em l.",
        "Monossílabo tônico terminado em e com s, escrito com circunflexo."
      ],
      "answer": 3,
      "explanation": "Conserva número de sílabas, tonicidade, terminação e sinal da forma padrão.",
      "optionRationales": [
        "O uso dado é tônico e a forma tem circunflexo.",
        "A palavra tem uma sílaba e usa circunflexo.",
        "Não há penúltima sílaba nem terminação l.",
        "Conserva número de sílabas, tonicidade, terminação e sinal da forma padrão."
      ],
      "recoverySectionIds": [
        "mono-regra"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "oa02.q05",
      "prompt": "Nas leituras indicadas, qual comparação evita o atalho “toda oxítona tem acento”?",
      "options": [
        "“Café” é acentuada e “abacaxi” não, apesar de ambas terem tônica final.",
        "“Café” é paroxítona e “abacaxi” não tem tônica.",
        "“Abacaxi” deve receber agudo só por ser oxítona.",
        "As duas são monossílabos átonos."
      ],
      "answer": 0,
      "explanation": "Distingue classe tônica da regra de grafia.",
      "optionRationales": [
        "Distingue classe tônica da regra de grafia.",
        "As duas têm tônica final nas leituras dadas.",
        "Ignora a terminação e o limite do caso.",
        "As duas têm várias sílabas e destaque tônico."
      ],
      "recoverySectionIds": [
        "limites",
        "finais"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "oa02.q06",
      "prompt": "Na frase “O sol apareceu”, qual análise de “sol” corresponde ao recorte?",
      "options": [
        "Monossílabo átono que termina em e.",
        "Monossílabo tônico terminado em l, sem acento por a/e/o.",
        "Oxítona de três sílabas em em.",
        "Palavra obrigatoriamente escrita “sól”."
      ],
      "answer": 1,
      "explanation": "Conserva tonicidade e terminação do exemplo.",
      "optionRationales": [
        "A leitura dada tem destaque e terminação l.",
        "Conserva tonicidade e terminação do exemplo.",
        "A palavra tem uma sílaba e não termina em em.",
        "A grafia padrão “sol” não recebe esse acento."
      ],
      "recoverySectionIds": [
        "mono-regra",
        "ex-mono"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "oa02.q07",
      "prompt": "Qual par conserva as grafias e os sinais dos casos apresentados?",
      "options": [
        "Cafe e voce, ambas sem sinal.",
        "Cafê e vocé.",
        "Café e você.",
        "Café e voce, porque circunflexo nunca ocorre em oxítonas."
      ],
      "answer": 2,
      "explanation": "Mantém agudo em “café” e circunflexo em “você”.",
      "optionRationales": [
        "Suprime sinais exigidos nesses casos.",
        "Inverte os sinais das formas dadas.",
        "Mantém agudo em “café” e circunflexo em “você”.",
        "O exemplo “você” mostra circunflexo em oxítona."
      ],
      "recoverySectionIds": [
        "finais"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "oa02.q08",
      "prompt": "Um estudante acentuou “janela” só porque termina em a. Qual recuperação corrige o erro?",
      "options": [
        "Acentuar toda letra a do texto.",
        "Ignorar a leitura e contar somente letras.",
        "Afirmar que todas as palavras em a são oxítonas.",
        "Voltar a ja-NE-la e verificar a classe antes de aplicar a regra de oxítonas."
      ],
      "answer": 3,
      "explanation": "Identifica paroxítona e impede usar uma regra de outra classe.",
      "optionRationales": [
        "Não é a regra de acentuação.",
        "A leitura é necessária para identificar a classe.",
        "A terminação não define a posição tônica.",
        "Identifica paroxítona e impede usar uma regra de outra classe."
      ],
      "recoverySectionIds": [
        "ex-final",
        "recuperacao"
      ],
      "objectiveIds": [
        "O4"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "oa02-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "oa02.q01": [
        {
          "missionId": "draft.oa02",
          "sectionId": "finais"
        },
        {
          "missionId": "draft.oa02",
          "sectionId": "ex-final"
        }
      ],
      "oa02.q02": [
        {
          "missionId": "draft.oa02",
          "sectionId": "monossilabo"
        },
        {
          "missionId": "draft.oa02",
          "sectionId": "finais"
        }
      ],
      "oa02.q03": [
        {
          "missionId": "draft.oa02",
          "sectionId": "em"
        },
        {
          "missionId": "draft.oa02",
          "sectionId": "ex-em"
        }
      ],
      "oa02.q04": [
        {
          "missionId": "draft.oa02",
          "sectionId": "mono-regra"
        }
      ],
      "oa02.q05": [
        {
          "missionId": "draft.oa02",
          "sectionId": "limites"
        },
        {
          "missionId": "draft.oa02",
          "sectionId": "finais"
        }
      ],
      "oa02.q06": [
        {
          "missionId": "draft.oa02",
          "sectionId": "mono-regra"
        },
        {
          "missionId": "draft.oa02",
          "sectionId": "ex-mono"
        }
      ],
      "oa02.q07": [
        {
          "missionId": "draft.oa02",
          "sectionId": "finais"
        }
      ],
      "oa02.q08": [
        {
          "missionId": "draft.oa02",
          "sectionId": "ex-final"
        },
        {
          "missionId": "draft.oa02",
          "sectionId": "recuperacao"
        }
      ]
    }
  }
};

export const EDITORIAL = {
  "stage": "Rascunho local fora do catálogo; revisão independente pendente",
  "referenceOnlyProfiles": [
    {
      "id": "bb.agente-comercial.2022-001",
      "item": "Português: ortografia e acentuação, recorte do plano 05/mapa existente",
      "status": "histórico; referenceOnly"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Português: ortografia e acentuação, recorte do plano 05/mapa existente",
      "status": "histórico; referenceOnly"
    }
  ],
  "objectives": {
    "O1": "Aplicar os casos de terminação a/e/o e em/ens ensinados.",
    "O2": "Distinguir monossílabo tônico e palavra de mais de uma sílaba.",
    "O3": "Reconhecer os limites da regra e atalhos incorretos.",
    "O4": "Refazer a decisão pela tonicidade, classe e terminação."
  },
  "recovery": {
    "objectiveId": "O4",
    "instruction": "Identificar tonicidade, caso gráfico e regra; comparar o distrator e refazer a aplicação."
  },
  "limits": [
    "Recorte de acentuação do plano 97/bloco portuguese.spelling; não completa ortografia, hífen ou cobertura de edital.",
    "Frases, explicações e exercícios autorais, com base normativa identificada; exemplos não são citações extensas do Acordo.",
    "Acordo Ortográfico consultado em 04/10/2026; locator delimita os dispositivos usados. Regras e contrastes limitados ao ensino deste recorte.",
    "Leituras e divisões dadas nos casos; sem inventar regra universal a partir de uma grafia isolada ou excluir outras regras do Acordo.",
    "Sem edição de dados reais, XP/ordem/importação runtime ou publicação. Parecer independente agrupado pendente."
  ]
};

export const ARITHMETIC = [];
