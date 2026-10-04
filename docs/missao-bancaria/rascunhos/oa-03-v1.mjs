// Ensino e exercícios autorais; rascunho com fonte normativa primária.
export const SOURCES = [
  {
    "id": "acordo.oa.acentuacao",
    "label": "Acordo Ortográfico — acentuação gráfica",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2008/decreto/d6583.htm",
    "checkedAt": "2026-10-04",
    "version": "Decreto nº 6.583/2008, Anexo I — texto oficial consultado",
    "locator": "Anexo I, Base IX, 1º/2º a/b, e Base XI, 1º/2º; recorte l/r/i/is e proparoxítonas simples"
  }
];

export const OA03_DRAFT = {
  "id": "draft.oa03",
  "topicId": "draft.oa03",
  "editorialKey": "OA-03",
  "candidateBlockId": "portuguese.spelling",
  "title": "Paroxítonas e proparoxítonas: contrastar classe e terminação",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Aplicar casos introdutórios de paroxítonas e a regra de proparoxítonas, preservando a classe tônica e reconhecendo que classes diferentes não usam a mesma lista de terminações.",
  "sourceIds": [
    "acordo.oa.acentuacao"
  ],
  "sections": [
    {
      "id": "entrada",
      "heading": "1. A classe vem antes da lista",
      "body": "Compare a frase autoral: O lápis ficou perto da lâmpada. Nas leituras LÁ-pis e LÂM-pa-da, a tônica não é final. “Lápis” é paroxítona; “lâmpada” é proparoxítona. Ambas têm acento, mas a justificativa depende de classe e caso, não apenas de reconhecer um sinal escrito.",
      "type": "explanation",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "paroxitona",
      "heading": "2. Paroxítona: destaque na penúltima",
      "body": "Nas leituras ME-sa e ca-DER-no, a tônica é penúltima e as grafias dadas não têm acento. Isso não significa que toda paroxítona seja escrita sem acento. O Acordo prevê casos acentuados; nesta introdução vamos aplicar algumas terminações frequentes, sem copiar a lista de oxítonas.",
      "type": "explanation",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "terminacoes",
      "heading": "3. Casos acentuados deste recorte",
      "body": "Nos casos paroxítonos dados, terminações l, r e i/is recebem acento: FÁ-cil → fácil; a-ÇÚ-car → açúcar; TÁ-xi → táxi; LÁ-pis → lápis. O sinal segue a pronúncia do caso; não usar esta lista como se cobrisse todos os timbres ou todas as terminações do Acordo.\n\nO Acordo tem outros casos de paroxítonas; eles não deixam de existir por não serem cobrados aqui.",
      "type": "explanation",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "ex-facil",
      "heading": "4. Exemplo resolvido: fácil e café",
      "body": "“Fácil”, FÁ-cil, tem tônica penúltima e termina em l: paroxítona acentuada pelo caso ensinado. “Café”, ca-FÉ, tem tônica final e termina em e: oxítona acentuada por outra regra. Não inverter as classes nem dizer que ambos são acentuados pela mesma terminação.",
      "type": "worked-example",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "ex-lapis",
      "heading": "5. Exemplo resolvido: lápis e abacaxi",
      "body": "“Lápis”, LÁ-pis, é paroxítona terminada em is e recebe acento. “Abacaxi”, a-ba-ca-XI, é oxítona terminada em i e não recebe acento por esse caso. A letra final parecida não permite aplicar uma regra de paroxítonas a uma oxítona.",
      "type": "worked-example",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "proparoxitona",
      "heading": "6. Proparoxítonas: posição antepenúltima",
      "body": "No recorte, todas as proparoxítonas recebem acento gráfico. Exemplos com leituras dadas: LÂM-pa-da → lâmpada; PÁS-sa-ro → pássaro; ÚL-ti-mo → último. Agudo e circunflexo aparecem conforme a pronúncia, sem que a regra seja “todas levam agudo”.\n\nAqui usamos palavras de divisão simples. Sequências vocálicas finais que admitem análises diferentes não são necessárias para resolver os itens desta aula.",
      "type": "explanation",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "ex-proparox",
      "heading": "7. Exemplo resolvido: pássaro e caderno",
      "body": "Em PÁS-sa-ro, a tônica é antepenúltima: “pássaro” é proparoxítona e recebe acento. Em ca-DER-no, a tônica é penúltima: “caderno” é paroxítona e a grafia dada não tem acento. Ter três sílabas não determina a classe nem exige acento sozinho.",
      "type": "worked-example",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "contrastes",
      "heading": "8. Guardar o motivo, não apenas a forma",
      "body": "Use uma ficha de raciocínio: fácil — paroxítona, l; açúcar — paroxítona, r; táxi — paroxítona, i; lápis — paroxítona, is; lâmpada — proparoxítona. O texto “A tarefa ficou fácil” oferece contexto, mas a posição da palavra dentro da frase não muda sua classe tônica. Não criar um acento em “mesa” só porque ela aparece ao lado de uma palavra acentuada.",
      "type": "explanation",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "limites",
      "heading": "9. Uma lista introdutória não é o sistema inteiro",
      "body": "Outras terminações, hiatos, ditongos e formas verbais têm regras próprias. Nesta aula, uma palavra diferente só pode ser julgada se a regra aplicável foi ensinada ou fornecida. OA-04 apresentará encontros vocálicos e mudanças gráficas frequentes, sem declarar que a lista daqui resolve toda acentuação.",
      "type": "explanation",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "glossario",
      "heading": "10. Vocabulário de apoio",
      "body": "Paroxítona: tônica na penúltima. Proparoxítona: tônica na antepenúltima. Terminação: parte final usada pela regra pertinente. Contraste de regras: casos com grafias acentuadas cuja justificativa depende de classes diferentes. Agudo/circunflexo: sinais gráficos, não nomes de classes tônicas.",
      "type": "glossary",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "recuperacao",
      "heading": "11. Comparar os dois casos sem trocar a regra",
      "body": "Sublinhe a tônica, classifique e só depois compare a terminação. Se confundiu “lápis” com “abacaxi”, explique a diferença de classe. Se acentuou “caderno” por ter três sílabas, compare ca-DER-no com PÁS-sa-ro. A recuperação deve nomear o motivo, não apenas copiar a grafia certa.",
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
      "id": "oa03.q01",
      "prompt": "Na leitura FÁ-cil da frase “A tarefa ficou fácil”, qual justificativa é adequada?",
      "options": [
        "Paroxítona terminada em l no caso ensinado.",
        "Oxítona terminada em e.",
        "Monossílabo átono.",
        "Proparoxítona por aparecer no fim da frase."
      ],
      "answer": 0,
      "explanation": "Localiza a tônica penúltima e a terminação l.",
      "optionRationales": [
        "Localiza a tônica penúltima e a terminação l.",
        "A tônica não é final e a palavra não termina em e.",
        "A palavra tem duas sílabas e é tônica.",
        "A posição na frase não fornece uma antepenúltima sílaba."
      ],
      "recoverySectionIds": [
        "terminacoes",
        "ex-facil"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "oa03.q02",
      "prompt": "Qual comparação conserva as leituras LÁ-pis e a-ba-ca-XI e suas regras?",
      "options": [
        "As duas são paroxítonas terminadas em is.",
        "“Lápis” é paroxítona acentuada; “abacaxi” é oxítona sem acento no caso dado.",
        "As duas são proparoxítonas porque têm a letra a.",
        "“Abacaxi” recebe a regra de “lápis” só porque termina em i."
      ],
      "answer": 1,
      "explanation": "Distingue classe e grafia corretamente.",
      "optionRationales": [
        "“Abacaxi” tem tônica final e termina em i, não is.",
        "Distingue classe e grafia corretamente.",
        "A presença da letra não determina classe.",
        "Ignora a classe para transferir a regra."
      ],
      "recoverySectionIds": [
        "ex-lapis"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "oa03.q03",
      "prompt": "Na leitura a-ÇÚ-car, qual é a classe e a terminação usadas para justificar “açúcar” no recorte?",
      "options": [
        "Oxítona em a.",
        "Monossílabo em s.",
        "Paroxítona em r.",
        "Proparoxítona em l."
      ],
      "answer": 2,
      "explanation": "Conserva a posição tônica e a terminação do caso.",
      "optionRationales": [
        "A tônica é penúltima e a grafia termina em r.",
        "Há três sílabas e terminação r.",
        "Conserva a posição tônica e a terminação do caso.",
        "A tônica não é antepenúltima e não há terminação l."
      ],
      "recoverySectionIds": [
        "terminacoes",
        "contrastes"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "oa03.q04",
      "prompt": "Na leitura LÂM-pa-da, qual afirmação corresponde à regra ensinada?",
      "options": [
        "Não recebe acento porque toda palavra de três sílabas é átona.",
        "Recebe agudo obrigatoriamente, pois toda proparoxítona usa esse sinal.",
        "É paroxítona acentuada por terminar em da.",
        "É proparoxítona acentuada; a grafia dada usa circunflexo."
      ],
      "answer": 3,
      "explanation": "Distingue a classe e o sinal da forma fornecida.",
      "optionRationales": [
        "A leitura tem tônica e o número de sílabas não torna a palavra átona.",
        "O exemplo usa circunflexo e a regra não impõe apenas agudo.",
        "A tônica é antepenúltima e “da” não é o caso proposto.",
        "Distingue a classe e o sinal da forma fornecida."
      ],
      "recoverySectionIds": [
        "proparoxitona"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "oa03.q05",
      "prompt": "Qual par ilustra que três sílabas não determinam sozinho a posição tônica?",
      "options": [
        "PÁS-sa-ro e ca-DER-no.",
        "FÁ-cil e ca-FÉ, ambas com três sílabas.",
        "PÁ e PÉ, ambas com três sílabas.",
        "Só palavras com acento têm sílabas."
      ],
      "answer": 0,
      "explanation": "As duas têm três sílabas, mas tônica antepenúltima e penúltima.",
      "optionRationales": [
        "As duas têm três sílabas, mas tônica antepenúltima e penúltima.",
        "As duas divisões dadas têm duas sílabas.",
        "São exemplos de uma sílaba.",
        "Sílabas não dependem da presença de sinal gráfico."
      ],
      "recoverySectionIds": [
        "ex-proparox"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "oa03.q06",
      "prompt": "Na leitura TÁ-xi e no recorte de regras da aula, qual grafia é adequada?",
      "options": [
        "Taxi, pois toda paroxítona perde acento.",
        "Táxi, paroxítona terminada em i no caso ensinado.",
        "Taxí, mudando a tônica para a última sílaba.",
        "Táxí, marcando todas as sílabas."
      ],
      "answer": 1,
      "explanation": "Preserva a leitura e o caso de terminação i.",
      "optionRationales": [
        "O Acordo prevê casos de paroxítonas acentuadas.",
        "Preserva a leitura e o caso de terminação i.",
        "Troca a posição tônica indicada.",
        "Não é a grafia padrão nem a regra dada."
      ],
      "recoverySectionIds": [
        "terminacoes"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "oa03.q07",
      "prompt": "Qual afirmação respeita o limite da lista introdutória de paroxítonas?",
      "options": [
        "Não existem outras regras de acentuação além de l/r/i/is.",
        "Qualquer palavra nova pode ser resolvida por copiar a regra de uma classe diferente.",
        "Há outros casos no Acordo; a lista da aula não substitui o sistema inteiro.",
        "Toda palavra terminada em a recebe a regra de “fácil”."
      ],
      "answer": 2,
      "explanation": "Conserva a delimitação do ensino.",
      "optionRationales": [
        "O texto normativo contém outros casos.",
        "A classe e o caso precisam ser preservados.",
        "Conserva a delimitação do ensino.",
        "“Fácil” termina em l e a regra não se transfere assim."
      ],
      "recoverySectionIds": [
        "limites"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "oa03.q08",
      "prompt": "Um estudante classificou “caderno” como proparoxítona porque tem três sílabas. Qual retomada é adequada?",
      "options": [
        "Contar as letras e ignorar a pronúncia.",
        "Acrescentar um acento sem localizar a tônica.",
        "Usar a posição da palavra no parágrafo como posição tônica.",
        "Voltar a ca-DER-no e comparar a penúltima tônica com a antepenúltima de PÁS-sa-ro."
      ],
      "answer": 3,
      "explanation": "Reconstrói a diferença de classe pela leitura fornecida.",
      "optionRationales": [
        "Número de letras não resolve a posição tônica.",
        "Repete o atalho sem aplicar a regra.",
        "São posições diferentes.",
        "Reconstrói a diferença de classe pela leitura fornecida."
      ],
      "recoverySectionIds": [
        "ex-proparox",
        "recuperacao"
      ],
      "objectiveIds": [
        "O4"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "oa03-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "oa03.q01": [
        {
          "missionId": "draft.oa03",
          "sectionId": "terminacoes"
        },
        {
          "missionId": "draft.oa03",
          "sectionId": "ex-facil"
        }
      ],
      "oa03.q02": [
        {
          "missionId": "draft.oa03",
          "sectionId": "ex-lapis"
        }
      ],
      "oa03.q03": [
        {
          "missionId": "draft.oa03",
          "sectionId": "terminacoes"
        },
        {
          "missionId": "draft.oa03",
          "sectionId": "contrastes"
        }
      ],
      "oa03.q04": [
        {
          "missionId": "draft.oa03",
          "sectionId": "proparoxitona"
        }
      ],
      "oa03.q05": [
        {
          "missionId": "draft.oa03",
          "sectionId": "ex-proparox"
        }
      ],
      "oa03.q06": [
        {
          "missionId": "draft.oa03",
          "sectionId": "terminacoes"
        }
      ],
      "oa03.q07": [
        {
          "missionId": "draft.oa03",
          "sectionId": "limites"
        }
      ],
      "oa03.q08": [
        {
          "missionId": "draft.oa03",
          "sectionId": "ex-proparox"
        },
        {
          "missionId": "draft.oa03",
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
    "O1": "Aplicar os casos de paroxítonas do recorte.",
    "O2": "Conservar classe e sinal ao comparar palavras.",
    "O3": "Reconhecer atalhos e limites da lista ensinada.",
    "O4": "Refazer a classe e a regra a partir da tônica."
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
