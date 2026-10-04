// Rascunho local; ensino autoral com referência normativa primária.
export const SOURCES = [
  {
    "id": "acordo.oa.acentuacao",
    "label": "Acordo Ortográfico — acentuação gráfica",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2008/decreto/d6583.htm",
    "checkedAt": "2026-10-04",
    "version": "Decreto nº 6.583/2008, Anexo I — texto oficial consultado",
    "locator": "Bases VIII (oxítonas), IX (paroxítonas) e XI (proparoxítonas); recorte preparatório, sem síntese integral de regras"
  }
];

export const OA01_DRAFT = {
  "id": "draft.oa01",
  "topicId": "draft.oa01",
  "editorialKey": "OA-01",
  "candidateBlockId": "portuguese.spelling",
  "title": "Acentuação: sílaba tônica antes da regra",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Distinguir sílaba tônica e acento gráfico, classificar palavras pelas leituras dadas e recuperar atalhos incorretos antes de aplicar regras de acentuação.",
  "sourceIds": [
    "acordo.oa.acentuacao"
  ],
  "sections": [
    {
      "id": "entrada",
      "heading": "1. Antes da regra: ouvir e localizar",
      "body": "Leia a frase autoral: A casa tem uma lâmpada perto da mesa.\n\nPara estudar acentuação, primeiro precisamos distinguir a sílaba que recebe destaque na pronúncia do sinal escrito sobre uma letra. Não comece colocando acento em toda palavra. Esta unidade ensina o passo preparatório; as listas de terminações e casos especiais ficam para as aulas seguintes.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "silaba",
      "heading": "2. Sílabas: partes da pronúncia",
      "body": "Nestes exemplos simples, podemos dividir as palavras em partes pronunciadas: ca-sa; ca-fé; lâm-pa-da. Essas partes são sílabas. Os hífens aqui apenas mostram a divisão didática; não fazem parte da grafia usual dessas palavras.\n\nA unidade não ensina ainda todas as regras de separação silábica, encontros vocálicos ou divisão de palavras no fim da linha.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "tonica",
      "heading": "3. Sílaba tônica e sílabas átonas",
      "body": "Sílaba tônica é a que recebe maior destaque na pronúncia da palavra. Nas leituras indicadas aqui: CA-sa; ca-FÉ; LÂM-pa-da. As maiúsculas apenas destacam a sílaba tônica para o exercício; não alteram a grafia usual. As outras sílabas são átonas neste uso. Não confundir destaque de pronúncia com obrigatoriedade de um sinal gráfico.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "ex-casa",
      "heading": "4. Exemplo resolvido: destaque sem sinal",
      "body": "Pergunta: em “casa”, qual sílaba é tônica e há acento gráfico na palavra?\n\nNa leitura CA-sa, a sílaba tônica é “ca”. A grafia “casa” não tem acento gráfico. Logo, a existência de sílaba tônica não exige, por si só, que toda palavra receba um sinal. Para decidir a grafia, é preciso considerar a regra aplicável, não apenas ouvir uma sílaba destacada.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "posicao",
      "heading": "5. Contar a posição a partir do fim",
      "body": "Em palavras com mais de uma sílaba deste recorte: tônica na última → oxítona; na penúltima → paroxítona; na antepenúltima → proparoxítona. Última é a que encerra a palavra; penúltima é a imediatamente anterior; antepenúltima é a anterior à penúltima.\n\nCom as leituras dadas: ca-FÉ é oxítona; CA-sa é paroxítona; LÂM-pa-da é proparoxítona. Não definir a classe pelo número total de sílabas ou pela presença de acento escrito.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "ex-cafe",
      "heading": "6. Exemplo resolvido: duas sílabas não bastam para classificar",
      "body": "“Casa” e “café” têm duas sílabas nos exemplos. Em CA-sa, a tônica é a penúltima: paroxítona. Em ca-FÉ, é a última: oxítona. O número total é igual, mas a posição tônica é diferente.\n\nNa frase autoral “O café ficou sobre a mesa”, a classificação de “café” depende da pronúncia da palavra, não de sua posição no final ou no início da frase.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "ex-lampada",
      "heading": "7. Exemplo resolvido: antepenúltima",
      "body": "Na leitura LÂM-pa-da, “da” é a última sílaba, “pa” é a penúltima e “lâm” é a antepenúltima. A tônica “lâm” ocupa a antepenúltima posição: a palavra é proparoxítona. Não dizer que qualquer palavra com três sílabas é proparoxítona: é preciso localizar a tônica.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "grafico",
      "heading": "8. Acento gráfico é um sinal da escrita",
      "body": "Nas grafias dadas, “café” tem acento agudo e “lâmpada” tem acento circunflexo; “casa” não tem esses sinais. O Acordo Ortográfico trata a acentuação gráfica em regras próprias para oxítonas, paroxítonas e proparoxítonas. Por isso, identificar a posição tônica é um passo anterior à aplicação das regras, não uma regra suficiente para acentuar qualquer palavra.\n\nAs formas das palavras usadas aqui são exemplos; esta aula não cobra decorar terminações, exceções ou uma distinção completa entre todos os sinais gráficos.",
      "type": "explanation",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "novos",
      "heading": "9. Aplicar a leitura indicada a palavras novas",
      "body": "Na frase autoral “A janela ficou aberta”, use a leitura ja-NE-la: “ne” é a penúltima sílaba, logo a palavra é paroxítona. Na frase “O abacaxi ficou na mesa”, use a-ba-ca-XI: “xi” é a última sílaba, logo é oxítona. A grafia usual dessas duas palavras não tem acento gráfico.\n\nIsso ajuda a evitar dois atalhos incorretos: contar sílabas sem localizar o destaque e supor que toda oxítona tem acento escrito.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "heading": "10. Vocabulário de apoio",
      "body": "Sílaba: uma das partes pronunciadas na divisão didática apresentada. Tônica: sílaba com destaque na pronúncia da palavra. Átona: sílaba sem esse destaque principal. Oxítona: tônica na última. Paroxítona: tônica na penúltima. Proparoxítona: tônica na antepenúltima. Acento gráfico: sinal escrito, como o agudo de “café” ou o circunflexo de “lâmpada”.",
      "type": "glossary",
      "sourceIds": []
    },
    {
      "id": "recuperacao",
      "heading": "11. Retomar sem decorar um atalho",
      "body": "Leia a palavra no contexto e use a pronúncia indicada no exercício. Separe as sílabas, destaque a tônica e conte sua posição a partir do fim. Só depois compare a grafia e a regra pertinente. Se errou, diga se confundiu número de sílabas, posição tônica ou sinal gráfico; refaça outro exemplo antes de consultar uma lista de terminações.",
      "type": "summary",
      "sourceIds": []
    }
  ],
  "recall": [
    "Qual sílaba recebe destaque na leitura dada?",
    "Onde ela fica contando a partir do fim?",
    "Há sinal gráfico na forma escrita ou só destaque na pronúncia?"
  ],
  "questions": [
    {
      "id": "oa01.q01",
      "prompt": "Na frase “A casa ficou silenciosa”, use a leitura CA-sa. Qual sílaba é tônica em “casa”?",
      "options": [
        "Ca.",
        "Sa.",
        "As duas com o mesmo destaque principal, conforme a leitura dada.",
        "Nenhuma, pois “casa” não tem acento gráfico."
      ],
      "answer": 0,
      "explanation": "A leitura indicada destaca “ca”.",
      "optionRationales": [
        "A leitura indicada destaca “ca”.",
        "“Sa” não é a sílaba destacada nessa leitura.",
        "O exercício indica um destaque principal em “ca”.",
        "Ausência de sinal gráfico não elimina a sílaba tônica."
      ],
      "recoverySectionIds": [
        "tonica",
        "ex-casa"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "oa01.q02",
      "prompt": "Qual comparação entre “casa” e “café” está correta nas leituras CA-sa e ca-FÉ?",
      "options": [
        "As duas são oxítonas por terem duas sílabas.",
        "“Casa” é paroxítona e “café” é oxítona, pela posição tônica.",
        "“Casa” não pode ser classificada porque não tem acento gráfico.",
        "“Café” é proparoxítona por aparecer no início de uma frase."
      ],
      "answer": 1,
      "explanation": "Identifica penúltima em “casa” e última em “café”.",
      "optionRationales": [
        "O número de sílabas não define sozinho a posição tônica.",
        "Identifica penúltima em “casa” e última em “café”.",
        "A classificação usa a pronúncia, não a presença de sinal.",
        "Duas sílabas não fornecem antepenúltima; a posição na frase não determina essa classe."
      ],
      "recoverySectionIds": [
        "posicao",
        "ex-cafe"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "oa01.q03",
      "prompt": "Na leitura LÂM-pa-da, qual é a posição da sílaba tônica?",
      "options": [
        "Última.",
        "Penúltima.",
        "Antepenúltima.",
        "Uma quarta sílaba que não aparece na divisão dada."
      ],
      "answer": 2,
      "explanation": "“Lâm” vem antes da penúltima e recebe o destaque.",
      "optionRationales": [
        "A última é “da”, sem destaque principal nessa leitura.",
        "A penúltima é “pa”.",
        "“Lâm” vem antes da penúltima e recebe o destaque.",
        "A divisão fornecida tem três sílabas."
      ],
      "recoverySectionIds": [
        "posicao",
        "ex-lampada"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "oa01.q04",
      "prompt": "O que “casa”, na leitura CA-sa e grafia dada, demonstra?",
      "options": [
        "Toda palavra tônica exige acento agudo.",
        "Uma palavra sem sinal escrito não tem sílabas.",
        "A última sílaba é sempre tônica.",
        "Uma palavra pode ter sílaba tônica sem acento gráfico."
      ],
      "answer": 3,
      "explanation": "Distingue destaque de pronúncia e sinal na escrita.",
      "optionRationales": [
        "Acrescenta uma exigência que o próprio exemplo contraria.",
        "Ausência de acento gráfico não elimina sílabas.",
        "“Ca” é a penúltima e é tônica na leitura dada.",
        "Distingue destaque de pronúncia e sinal na escrita."
      ],
      "recoverySectionIds": [
        "ex-casa",
        "grafico"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "oa01.q05",
      "prompt": "Na frase “A janela ficou aberta”, a leitura dada é ja-NE-la. Qual classificação corresponde a “janela”?",
      "options": [
        "Paroxítona.",
        "Oxítona.",
        "Proparoxítona.",
        "Sem classificação tônica, porque não há acento gráfico."
      ],
      "answer": 0,
      "explanation": "“Ne” ocupa a penúltima posição.",
      "optionRationales": [
        "“Ne” ocupa a penúltima posição.",
        "A última é “la”, não a tônica dada.",
        "A antepenúltima é “ja”, não a tônica dada.",
        "É possível classificar pela leitura indicada sem sinal gráfico."
      ],
      "recoverySectionIds": [
        "posicao",
        "novos"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "oa01.q06",
      "prompt": "Na leitura a-ba-ca-XI, qual afirmação preserva os dados apresentados sobre “abacaxi”?",
      "options": [
        "É paroxítona por ter quatro sílabas.",
        "É oxítona e, na grafia dada, não tem acento gráfico.",
        "É proparoxítona porque começa com a letra a.",
        "Recebe obrigatoriamente acento em todas as suas sílabas."
      ],
      "answer": 1,
      "explanation": "Localiza a última sílaba tônica e distingue a grafia do destaque.",
      "optionRationales": [
        "O total de sílabas não torna “xi” penúltima.",
        "Localiza a última sílaba tônica e distingue a grafia do destaque.",
        "A primeira letra não determina a posição tônica.",
        "Essa exigência não existe no exemplo e não decorre da pronúncia."
      ],
      "recoverySectionIds": [
        "novos",
        "grafico"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "oa01.q07",
      "prompt": "Qual descrição dos sinais escritos nas formas dadas é correta?",
      "options": [
        "“Café” tem circunflexo e “lâmpada” tem agudo.",
        "“Casa” tem acento agudo na última sílaba.",
        "“Café” tem agudo e “lâmpada” tem circunflexo.",
        "As três grafias apresentam o mesmo sinal gráfico."
      ],
      "answer": 2,
      "explanation": "Identifica corretamente os sinais nas duas formas.",
      "optionRationales": [
        "Inverte os nomes dos sinais mostrados.",
        "A grafia fornecida “casa” não tem esse sinal.",
        "Identifica corretamente os sinais nas duas formas.",
        "“Casa” não tem esses sinais e as outras usam sinais diferentes."
      ],
      "recoverySectionIds": [
        "grafico"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "oa01.q08",
      "prompt": "Um estudante chamou “café” de proparoxítona porque viu um acento escrito. Qual retomada corrige esse atalho?",
      "options": [
        "Ignorar a leitura e classificar qualquer palavra acentuada como proparoxítona.",
        "Contar apenas as letras e apagar o acento.",
        "Usar a posição da palavra na frase como posição tônica.",
        "Voltar a ca-FÉ, localizar a última sílaba tônica e só depois distinguir o sinal gráfico."
      ],
      "answer": 3,
      "explanation": "Reconstrói a classificação pela pronúncia e separa os dois conceitos.",
      "optionRationales": [
        "Repete o atalho que causou o erro.",
        "Número de letras não substitui a localização da sílaba tônica.",
        "São posições diferentes: na palavra e na frase.",
        "Reconstrói a classificação pela pronúncia e separa os dois conceitos."
      ],
      "recoverySectionIds": [
        "ex-cafe",
        "recuperacao"
      ],
      "objectiveIds": [
        "O4"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "oa01-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "oa01.q01": [
        {
          "missionId": "draft.oa01",
          "sectionId": "tonica"
        },
        {
          "missionId": "draft.oa01",
          "sectionId": "ex-casa"
        }
      ],
      "oa01.q02": [
        {
          "missionId": "draft.oa01",
          "sectionId": "posicao"
        },
        {
          "missionId": "draft.oa01",
          "sectionId": "ex-cafe"
        }
      ],
      "oa01.q03": [
        {
          "missionId": "draft.oa01",
          "sectionId": "posicao"
        },
        {
          "missionId": "draft.oa01",
          "sectionId": "ex-lampada"
        }
      ],
      "oa01.q04": [
        {
          "missionId": "draft.oa01",
          "sectionId": "ex-casa"
        },
        {
          "missionId": "draft.oa01",
          "sectionId": "grafico"
        }
      ],
      "oa01.q05": [
        {
          "missionId": "draft.oa01",
          "sectionId": "posicao"
        },
        {
          "missionId": "draft.oa01",
          "sectionId": "novos"
        }
      ],
      "oa01.q06": [
        {
          "missionId": "draft.oa01",
          "sectionId": "novos"
        },
        {
          "missionId": "draft.oa01",
          "sectionId": "grafico"
        }
      ],
      "oa01.q07": [
        {
          "missionId": "draft.oa01",
          "sectionId": "grafico"
        }
      ],
      "oa01.q08": [
        {
          "missionId": "draft.oa01",
          "sectionId": "ex-cafe"
        },
        {
          "missionId": "draft.oa01",
          "sectionId": "recuperacao"
        }
      ]
    }
  }
};

export const EDITORIAL = {
  "stage": "Rascunho local desativado; parecer pedagógico independente concluído, sem aceite de publicação",
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
    "O1": "Localizar a sílaba tônica e reconhecer sinais nas formas dadas.",
    "O2": "Classificar a posição tônica em leituras expressamente fornecidas.",
    "O3": "Distinguir pronúncia, sinal gráfico e atalhos incorretos.",
    "O4": "Refazer a classificação pela leitura e posição da sílaba."
  },
  "recovery": {
    "objectiveId": "O4",
    "instruction": "Localizar a pista, identificar a informação acrescentada e refazer a resposta."
  },
  "limits": [
    "Recorte do plano 05 e bloco portuguese.spelling existente, sem abertura formal de fase ou cobertura integral de item/subitem de edital.",
    "Frases, explicações e exercícios autorais; as formas gráficas e a referência normativa não são apresentadas como criação do autor.",
    "Acordo Ortográfico consultado em 04/10/2026; referência às Bases VIII, IX e XI, sem reconstruir o histórico jurídico ou ensinar todas as exceções.",
    "Leituras e divisões simples fornecidas para o exercício; não ensina todas as regras de separação silábica, encontros vocálicos ou translineação.",
    "Sem lista completa de terminações, sinais gráficos, casos de hífen ou regras de acentuação nesta primeira aula.",
    "Fora do catálogo, sem XP/ordem/importação runtime; parecer independente concluído, sem aceite humano ou publicação."
  ]
};

export const ARITHMETIC = [];
