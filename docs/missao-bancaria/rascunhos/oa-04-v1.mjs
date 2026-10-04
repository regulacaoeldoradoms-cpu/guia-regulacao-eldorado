// Ensino e exercícios autorais; rascunho com fonte normativa primária.
export const SOURCES = [
  {
    "id": "acordo.oa.acentuacao",
    "label": "Acordo Ortográfico — acentuação gráfica",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2008/decreto/d6583.htm",
    "checkedAt": "2026-10-04",
    "version": "Decreto nº 6.583/2008, Anexo I — texto oficial consultado",
    "locator": "Anexo I, Base VIII, 1º d; Base IX, 3º/7º/8º; Base X, 1º/2º/4º; exemplos limitados do recorte"
  }
];

export const OA04_DRAFT = {
  "id": "draft.oa04",
  "topicId": "draft.oa04",
  "editorialKey": "OA-04",
  "candidateBlockId": "portuguese.spelling",
  "title": "Encontros vocálicos e mudanças gráficas: reconhecer o caso",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Distinguir ditongo e hiato nos exemplos dados e aplicar contrastes de acentuação de i/u, ditongos abertos e formas sem circunflexo, respeitando os limites ensinados.",
  "sourceIds": [
    "acordo.oa.acentuacao"
  ],
  "sections": [
    {
      "id": "encontros",
      "heading": "1. Preparação: mesmo grupo ou sílabas diferentes",
      "body": "Quando sons vocálicos aparecem juntos, observe como se distribuem na pronúncia. Neste recorte, ditongo combina uma vogal e uma semivogal na mesma sílaba; semivogal é o som vocálico menos destacado nessa combinação. Hiato separa sons vocálicos em sílabas diferentes.\n\nExemplos dados: em pai, ai permanece na mesma sílaba; em pa-ís, a e i pertencem a sílabas diferentes. Não decidir só pela presença de duas letras vocálicas na escrita.",
      "type": "explanation",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "hiato",
      "heading": "2. O caso tônico de i/u",
      "body": "O i ou u tônico em hiato recebe agudo no caso em que vem depois de vogal com que não forma ditongo e fica sozinho na sílaba ou acompanhado apenas de s: sa-í-da → saída; ba-ú → baú; pa-ís → país. A tonicidade é necessária: não é regra para todo i/u ao lado de outra vogal.\n\nHá limites. Em juiz, ju-iz, i divide sílaba com z e não recebe esse agudo; em rainha, ra-i-nha, o i antes de nh não recebe esse acento. O caso de paroxítonas com i/u tônicos depois de ditongo também tem restrição própria: bai-u-ca → baiuca. Não eliminar esses limites da regra.",
      "type": "explanation",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "ex-hiato",
      "heading": "3. Exemplo resolvido: país e juiz",
      "body": "Em “país”, pa-ÍS, o i tônico vem depois de a, em sílaba diferente, e está acompanhado apenas de s: usa agudo. Em “juiz”, ju-IZ, o i tônico está acompanhado de z: não se aplica esse acento do hiato. Ser tônico em hiato não basta sem verificar como a sílaba está formada.",
      "type": "worked-example",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "ditongo",
      "heading": "4. Ditongos abertos e a classe tônica",
      "body": "Compare “ideia”, i-DEI-a, e “herói”, he-RÓI. O Acordo não mantém agudo sobre ei/oi tônicos das paroxítonas do caso de ideia e heroico, he-ROI-co. Em “herói”, oxítona com ditongo aberto oi tônico, conserva-se o agudo.\n\nNão concluir que o Acordo eliminou todos os acentos em ditongos nem que qualquer ei/oi leva agudo. A pronúncia e a classe fazem parte da decisão.",
      "type": "explanation",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "ex-ditongo",
      "heading": "5. Exemplo resolvido: ideia e herói",
      "body": "Na frase autoral “A ideia foi apresentada pelo herói da história”, as grafias atuais são “ideia”, sem agudo, e “herói”, com agudo. As leituras fornecidas situam a tônica na penúltima de ideia e na última de herói. A diferença não depende de serem palavras curtas nem da posição na frase.",
      "type": "worked-example",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "duplas",
      "heading": "6. Voo e leem: duas vogais não impõem circunflexo",
      "body": "As grafias atuais são “voo” e “leem”, sem circunflexo nesses casos. Nas frases autorais “O voo foi adiado” e “Eles leem o aviso”, não escrever “vôo” ou “lêem”. O Acordo trata as formas oo e as formas verbais ee/em descritas na Base IX; este recorte não diz que toda palavra ou toda forma verbal perdeu acento. Não altera outras regras como a de proparoxítonas.",
      "type": "explanation",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "ex-duplas",
      "heading": "7. Exemplo resolvido: conferir o caso gráfico",
      "body": "Pergunta: quais grafias completam “O ... foi adiado. Eles ... o aviso”?\n\nResposta: “voo” e “leem”. As sequências de vogais não exigem circunflexo nesses exemplos. Para explicar, identifique o caso ensinado, em vez de transformar a decisão em “qualquer vogal dupla recebe acento” ou “nenhuma palavra mais recebe circunflexo”.",
      "type": "worked-example",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "limites",
      "heading": "8. O recorte não resolve todas as exceções",
      "body": "Há outros encontros vocálicos, formas verbais, variantes e acentos diferenciais no Acordo. Os itens deste lote cobram apenas as leituras e os casos ensinados. Grafia desconhecida exige regra pertinente ou consulta, não transferência automática de um exemplo. Ortografia de letras e hífen ainda têm autoria própria pendente no bloco.",
      "type": "explanation",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "glossario",
      "heading": "9. Vocabulário de apoio",
      "body": "Ditongo: vogal e semivogal na mesma sílaba nos casos apresentados. Hiato: sons vocálicos distribuídos por sílabas diferentes. Tônico: com destaque principal no uso indicado. Restrição: condição que impede aplicar uma regra geral do recorte. Grafia atual: escrita conforme o caso normativo apresentado, não uma inferência apenas da aparência das letras.",
      "type": "glossary",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "recuperacao",
      "heading": "10. Refazer pela pronúncia e pelo limite",
      "body": "Marque a tônica e a divisão fornecida; veja se os sons ficam juntos ou separados. Se é i/u em hiato, confira a sílaba e a restrição antes de acentuar. Se é ei/oi, confira a classe e o caso. Se é voo/leem, use as formas ensinadas sem generalizar para todo circunflexo. Explique a diferença entre duas palavras do mesmo grupo.",
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
      "id": "oa04.q01",
      "prompt": "Nas divisões fornecidas, qual comparação distingue ditongo e hiato?",
      "options": [
        "Pai mantém ai na mesma sílaba; pa-ís separa a e i.",
        "País tem uma sílaba e pai tem três.",
        "Qualquer dupla de letras vocálicas pertence à mesma sílaba.",
        "Toda vogal ao lado de outra elimina a sílaba tônica."
      ],
      "answer": 0,
      "explanation": "Conserva as distribuições sonoras dadas.",
      "optionRationales": [
        "Conserva as distribuições sonoras dadas.",
        "Contraria as divisões apresentadas.",
        "A escrita sozinha não estabelece essa regra universal.",
        "Tonicidade não é eliminada pela vizinhança de vogais."
      ],
      "recoverySectionIds": [
        "encontros"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "oa04.q02",
      "prompt": "Na leitura sa-Í-da, qual grafia e justificativa correspondem ao caso ensinado?",
      "options": [
        "Saida, porque todo hiato é escrito sem acento.",
        "Saída, pois i tônico em hiato fica sozinho na sílaba nesse caso.",
        "Sáida, deslocando o destaque para a sílaba anterior.",
        "Saídá, acentuando toda a sequência vocálica."
      ],
      "answer": 1,
      "explanation": "Aplica tonicidade, divisão e composição da sílaba.",
      "optionRationales": [
        "Há caso de hiato tônico acentuado no recorte.",
        "Aplica tonicidade, divisão e composição da sílaba.",
        "Muda a posição tônica fornecida.",
        "Não corresponde à grafia nem à regra dada."
      ],
      "recoverySectionIds": [
        "hiato"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "oa04.q03",
      "prompt": "Por que se escreve “juiz”, ju-IZ, sem agudo no i no caso apresentado?",
      "options": [
        "Porque a palavra não tem sílaba tônica.",
        "Porque z proíbe qualquer acento em qualquer palavra.",
        "Porque i divide a sílaba com z, diferente do caso sozinho ou com s.",
        "Porque todo hiato tem acento obrigatoriamente."
      ],
      "answer": 2,
      "explanation": "Usa o limite pertinente do caso.",
      "optionRationales": [
        "A leitura indica i tônico.",
        "A regra se refere à composição dessa sílaba, não a proibição universal de z.",
        "Usa o limite pertinente do caso.",
        "Esse atalho ignora a condição que o caso exige."
      ],
      "recoverySectionIds": [
        "hiato",
        "ex-hiato"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "oa04.q04",
      "prompt": "Qual par conserva as grafias atuais e o contraste de classe ensinado?",
      "options": [
        "Idéia e heroi.",
        "Idéia e herói, pois todo ei tônico recebe agudo.",
        "Ideia e heroi, pois nenhum oi tônico recebe agudo.",
        "Ideia e herói."
      ],
      "answer": 3,
      "explanation": "Preserva a ausência em ideia e a presença em herói.",
      "optionRationales": [
        "Troca as decisões dos dois casos.",
        "Ignora a regra da paroxítona ideia.",
        "Ignora a regra do ditongo aberto na oxítona herói.",
        "Preserva a ausência em ideia e a presença em herói."
      ],
      "recoverySectionIds": [
        "ditongo",
        "ex-ditongo"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "oa04.q05",
      "prompt": "Quais formas completam as frases do recorte: “O ... foi adiado. Eles ... o aviso”?",
      "options": [
        "Voo; leem.",
        "Vôo; lêem.",
        "Voo; lêem.",
        "Vôo; leem."
      ],
      "answer": 0,
      "explanation": "As duas formas atuais desse caso não têm circunflexo.",
      "optionRationales": [
        "As duas formas atuais desse caso não têm circunflexo.",
        "Mantém os dois circunflexos que não se usam nesses casos.",
        "Introduz o circunflexo em leem.",
        "Introduz o circunflexo em voo."
      ],
      "recoverySectionIds": [
        "duplas",
        "ex-duplas"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "oa04.q06",
      "prompt": "Nas leituras e limites fornecidos, qual grafia conserva o caso de i diante de nh?",
      "options": [
        "Raínha, por uma regra sem exceções para todo hiato.",
        "Rainha.",
        "Ráinha, mudando a tônica.",
        "Rainhá, mudando a tônica para a última sílaba."
      ],
      "answer": 1,
      "explanation": "Conserva a grafia do caso fornecido.",
      "optionRationales": [
        "Ignora a restrição ensinada diante de nh.",
        "Conserva a grafia do caso fornecido.",
        "Muda a posição do destaque.",
        "Também troca a posição tônica."
      ],
      "recoverySectionIds": [
        "hiato"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "oa04.q07",
      "prompt": "O caso bai-u-ca é paroxítono com u tônico depois de ditongo. Qual decisão corresponde ao limite ensinado?",
      "options": [
        "Baiúca, porque qualquer u tônico deve ser acentuado.",
        "Báiuca, deslocando o destaque.",
        "Baiuca, sem agudo no u nesse caso.",
        "Baiucá, convertendo a leitura dada em tônica final."
      ],
      "answer": 2,
      "explanation": "Preserva a restrição própria apresentada.",
      "optionRationales": [
        "Ignora a restrição de paroxítona após ditongo.",
        "Troca o destaque tônico.",
        "Preserva a restrição própria apresentada.",
        "Muda a pronúncia fornecida."
      ],
      "recoverySectionIds": [
        "hiato",
        "recuperacao"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "oa04.q08",
      "prompt": "Um estudante escreveu que o Acordo eliminou todos os acentos porque viu “voo” sem circunflexo. Qual recuperação é adequada?",
      "options": [
        "Retirar o acento de lâmpada sem consultar a regra.",
        "Generalizar a decisão de voo para qualquer palavra.",
        "Contar apenas as letras, sem identificar o caso.",
        "Voltar ao caso voo/leem e preservar as outras regras, como a de proparoxítonas."
      ],
      "answer": 3,
      "explanation": "Limita a alteração ao caso ensinado e conserva o restante do sistema.",
      "optionRationales": [
        "Usa um caso para apagar outra regra que não foi revogada por ele.",
        "Repete a generalização indevida.",
        "Não identifica o fato normativo relevante.",
        "Limita a alteração ao caso ensinado e conserva o restante do sistema."
      ],
      "recoverySectionIds": [
        "duplas",
        "limites",
        "recuperacao"
      ],
      "objectiveIds": [
        "O4"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "oa04-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "oa04.q01": [
        {
          "missionId": "draft.oa04",
          "sectionId": "encontros"
        }
      ],
      "oa04.q02": [
        {
          "missionId": "draft.oa04",
          "sectionId": "hiato"
        }
      ],
      "oa04.q03": [
        {
          "missionId": "draft.oa04",
          "sectionId": "hiato"
        },
        {
          "missionId": "draft.oa04",
          "sectionId": "ex-hiato"
        }
      ],
      "oa04.q04": [
        {
          "missionId": "draft.oa04",
          "sectionId": "ditongo"
        },
        {
          "missionId": "draft.oa04",
          "sectionId": "ex-ditongo"
        }
      ],
      "oa04.q05": [
        {
          "missionId": "draft.oa04",
          "sectionId": "duplas"
        },
        {
          "missionId": "draft.oa04",
          "sectionId": "ex-duplas"
        }
      ],
      "oa04.q06": [
        {
          "missionId": "draft.oa04",
          "sectionId": "hiato"
        }
      ],
      "oa04.q07": [
        {
          "missionId": "draft.oa04",
          "sectionId": "hiato"
        },
        {
          "missionId": "draft.oa04",
          "sectionId": "recuperacao"
        }
      ],
      "oa04.q08": [
        {
          "missionId": "draft.oa04",
          "sectionId": "duplas"
        },
        {
          "missionId": "draft.oa04",
          "sectionId": "limites"
        },
        {
          "missionId": "draft.oa04",
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
    "O1": "Reconhecer encontros e formas gráficas do recorte.",
    "O2": "Aplicar tonicidade, composição silábica e classe pertinente.",
    "O3": "Usar restrições sem generalizar uma regra isolada.",
    "O4": "Refazer o caso e manter as demais regras do sistema."
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
