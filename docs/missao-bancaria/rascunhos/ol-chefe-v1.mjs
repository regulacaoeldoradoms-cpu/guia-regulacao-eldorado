// Ensino e exercícios autorais; candidato editorial local desativado.
export const SOURCES = [
  {
    "id": "acordo.ol.letras",
    "label": "Acordo Ortográfico — letras e grafias do recorte",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2008/decreto/d6583.htm",
    "checkedAt": "2026-10-04",
    "version": "Decreto nº 6.583/2008, Anexo I — texto oficial consultado",
    "locator": "Anexo I, Bases I, II, III 1º/2º e V 1º/2º a; somente casos e limites ensinados em OL-01–03"
  }
];
export const OLCHEFE_DRAFT = {
  "id": "draft.olchefe",
  "topicId": "draft.olchefe",
  "editorialKey": "OL-CHEFE",
  "candidateBlockId": "portuguese.spelling",
  "title": "Chefe de letras: forma, contexto e limite",
  "contentVersion": 1,
  "kind": "boss",
  "publication": {
    "status": "draft"
  },
  "objective": "Revisar uma frase pelo significado e pela grafia convencional do recorte, sem deduzir toda ortografia apenas da pronúncia.",
  "sourceIds": [
    "acordo.ol.letras"
  ],
  "sections": [
    {
      "id": "entrada",
      "heading": "1. Doze decisões próprias",
      "body": "Este Chefe reúne seis grupos de dois itens. Antes de responder, identifique a palavra pretendida, o caso ensinado e a generalização que deve ser evitada. Itens próprios não são avaliação independente nem comprovam retenção.",
      "type": "explanation",
      "sourceIds": [
        "acordo.ol.letras"
      ]
    },
    {
      "id": "base",
      "heading": "2. Letra e som",
      "body": "O alfabeto tem 26 letras; sinais e dígrafos não acrescentam letras. Ch/lh/nh representam um som consonantal nos casos dados, ao contrário de pr em prato. H inicial de hoje/hora permanece, embora sem som próprio no uso apresentado; erva não recebe h.",
      "type": "explanation",
      "sourceIds": [
        "acordo.ol.letras"
      ]
    },
    {
      "id": "consoantes",
      "heading": "3. Repertório de consoantes",
      "body": "Chave/ficha/chamar/mancha têm ch; mexer/deixar/puxar/xícara têm x. Girafa/relógio/ferrugem têm g; jeito/hoje/rejeitar têm j. Não copiar uma letra de outra palavra só pela semelhança sonora.",
      "type": "explanation",
      "sourceIds": [
        "acordo.ol.letras"
      ]
    },
    {
      "id": "vogais",
      "heading": "4. Repertório de vogais e família",
      "body": "Quase/semear com e, tigela/tijolo com i, costume com o, entupir com u nas posições ensinadas. Areia/areal e cadeia/cadeado exemplificam e antes da tônica na relação delimitada; outras dúvidas podem exigir consulta.",
      "type": "explanation",
      "sourceIds": [
        "acordo.ol.letras"
      ]
    },
    {
      "id": "ex-chefe",
      "heading": "5. Exemplo resolvido: motivos diferentes",
      "body": "Em Hoje ela guardou a ficha no lugar de costume, hoje conserva h lexical; ficha conserva ch lexical; costume conserva o lexical. Não há uma regra de som que escolha todas as letras da frase. A recuperação deve registrar cada forma e evitar transferir a grafia de outra palavra.",
      "type": "worked-example",
      "sourceIds": [
        "acordo.ol.letras"
      ]
    },
    {
      "id": "retomadas",
      "heading": "6. Consultas por dificuldade",
      "body": "[OL-01: letra, som e h](ol-01-v1.md)\n\n[OL-02: ch/x e g/j](ol-02-v1.md)\n\n[OL-03: vogais átonas e família](ol-03-v1.md)\n\n[OL-R: revisão cumulativa](ol-r-v1.md)",
      "type": "explanation",
      "sourceIds": [
        "acordo.ol.letras"
      ]
    },
    {
      "id": "glossario",
      "heading": "Vocabulário de apoio",
      "body": "Grafia: forma escrita convencional de uma palavra. Letra: sinal do alfabeto. Som: elemento percebido na fala; não é idêntico à letra. Dígrafo: duas letras que representam um som consonantal nos casos ensinados. Grafia lexical: forma que precisa ser conhecida ou consultada, em vez de deduzida por uma regra geral. Vogal átona: vogal numa sílaba sem o destaque principal.",
      "type": "glossary",
      "sourceIds": [
        "acordo.ol.letras"
      ]
    },
    {
      "id": "recuperacao",
      "heading": "Refazer com uma pista concreta",
      "body": "Leia a frase, identifique a palavra e compare com o caso ensinado. Registre o motivo ou a forma lexical; escreva outra frase conservando a palavra. Se o caso não foi ensinado e não há regra suficiente, consulte um vocabulário ortográfico ou dicionário autorizado, conferindo entrada e sentido. Uma consulta não permite inventar uma regra para todas as palavras.",
      "type": "summary",
      "sourceIds": [
        "acordo.ol.letras"
      ]
    }
  ],
  "recall": [
    "Qual palavra e sentido estão em jogo?",
    "Há uma regra ensinada para este caso ou uma grafia lexical a conferir?",
    "Qual contraste explica o erro sem criar uma regra universal?"
  ],
  "questions": [
    {
      "id": "olchefe.q01",
      "prompt": "Na frase \"A folha caiu\", qual análise de lh corresponde ao recorte?",
      "options": [
        "Cada letra tem um som separado obrigatório.",
        "É uma letra nova fora do alfabeto.",
        "É dígrafo consonantal: duas letras representam um som no caso.",
        "É a mesma combinação de pr em prato."
      ],
      "answer": 2,
      "explanation": "Aplica o caso ensinado.",
      "optionRationales": [
        "Não conserva o caso lh.",
        "Dígrafo não é letra adicional.",
        "Aplica o caso ensinado.",
        "Pr corresponde a dois sons no exemplo."
      ],
      "recoverySectionIds": [
        "base"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "ol01",
          "sectionId": "digrafos"
        }
      ],
      "groupId": "letra-som"
    },
    {
      "id": "olchefe.q02",
      "prompt": "Qual conclusão sobre á e a conserva a distinção ensinada?",
      "options": [
        "Á usa a letra a com sinal gráfico; isso não aumenta o alfabeto.",
        "Cada sinal de acento cria uma letra nova.",
        "A não pertence ao alfabeto quando recebe sinal.",
        "O alfabeto varia conforme os acentos de cada frase."
      ],
      "answer": 0,
      "explanation": "Mantém a distinção entre letra e acento.",
      "optionRationales": [
        "Mantém a distinção entre letra e acento.",
        "Confunde sinal e letra.",
        "O sinal não exclui a letra.",
        "O número de letras não muda por frase."
      ],
      "recoverySectionIds": [
        "base"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "ol01",
          "sectionId": "alfabeto"
        }
      ],
      "groupId": "letra-som"
    },
    {
      "id": "olchefe.q03",
      "prompt": "Qual par mantém os casos de h inicial ensinados?",
      "options": [
        "Oje e herva.",
        "Hoje e herva.",
        "Oje e erva.",
        "Hoje e erva."
      ],
      "answer": 3,
      "explanation": "Mantém as duas formas do repertório.",
      "optionRationales": [
        "Altera as duas grafias.",
        "Erva não recebe h.",
        "Hoje conserva h.",
        "Mantém as duas formas do repertório."
      ],
      "recoverySectionIds": [
        "base"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "ol01",
          "sectionId": "h"
        }
      ],
      "groupId": "h"
    },
    {
      "id": "olchefe.q04",
      "prompt": "Ao revisar \"A reunião começa à hora indicada\", qual motivo conserva h em hora?",
      "options": [
        "Toda palavra iniciada por o recebe h.",
        "Hora é a forma lexical ensinada para o nome pretendido, apesar de h inicial sem som próprio no uso apresentado.",
        "H indica que a palavra é proparoxítona.",
        "Todo h precisa ter som próprio."
      ],
      "answer": 1,
      "explanation": "Conserva palavra, sentido e grafia.",
      "optionRationales": [
        "Não é uma regra universal.",
        "Conserva palavra, sentido e grafia.",
        "H não determina posição tônica.",
        "O ensino apresenta h sem som próprio."
      ],
      "recoverySectionIds": [
        "base"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "ol01",
          "sectionId": "h"
        }
      ],
      "groupId": "h"
    },
    {
      "id": "olchefe.q05",
      "prompt": "Qual par do repertório conserva uma forma com x e uma com ch, nessa ordem?",
      "options": [
        "Deixar e mancha.",
        "Deichar e manxa.",
        "Deichar e mancha.",
        "Deixar e manxa."
      ],
      "answer": 0,
      "explanation": "As duas formas conservam o repertório.",
      "optionRationales": [
        "As duas formas conservam o repertório.",
        "Troca ambas as representações.",
        "Deixar é com x.",
        "Mancha é com ch."
      ],
      "recoverySectionIds": [
        "consoantes"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "ol02",
          "sectionId": "chx"
        }
      ],
      "groupId": "ch-x"
    },
    {
      "id": "olchefe.q06",
      "prompt": "Qual correção mantém a palavra de \"Ele guardou a xícara\", segundo o repertório?",
      "options": [
        "Chícara, pois todo esse som deve usar ch.",
        "Xxícara, para separar letra e som.",
        "Xícara, sem trocar x por ch apenas pela semelhança sonora.",
        "Xíc ara, porque x forma palavra separada."
      ],
      "answer": 2,
      "explanation": "Preserva a forma lexical ensinada.",
      "optionRationales": [
        "Cria regra universal falsa.",
        "Não existe essa duplicação na forma.",
        "Preserva a forma lexical ensinada.",
        "Não é uma unidade escrita correta do caso."
      ],
      "recoverySectionIds": [
        "consoantes"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "ol02",
          "sectionId": "chx"
        }
      ],
      "groupId": "ch-x"
    },
    {
      "id": "olchefe.q07",
      "prompt": "Qual forma corresponde à palavra ensinada para o animal da frase \"A ___ apareceu no desenho\"?",
      "options": [
        "Jirafa.",
        "Girafa.",
        "Ggirafa.",
        "Gjirafa."
      ],
      "answer": 1,
      "explanation": "Conserva o repertório com g.",
      "optionRationales": [
        "Troca g por j no caso lexical.",
        "Conserva o repertório com g.",
        "Duplica g indevidamente.",
        "Mistura representações sem conservar a forma."
      ],
      "recoverySectionIds": [
        "consoantes"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "ol02",
          "sectionId": "gj"
        }
      ],
      "groupId": "g-j"
    },
    {
      "id": "olchefe.q08",
      "prompt": "Qual opção conserva dois casos lexicais ensinados com j?",
      "options": [
        "Geito e regeitar.",
        "Jeito e regeitar.",
        "Geito e rejeitar.",
        "Jeito e rejeitar."
      ],
      "answer": 3,
      "explanation": "Mantém as duas formas com j.",
      "optionRationales": [
        "Troca ambos os j.",
        "Rejeitar conserva j.",
        "Jeito conserva j.",
        "Mantém as duas formas com j."
      ],
      "recoverySectionIds": [
        "consoantes"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "ol02",
          "sectionId": "gj"
        }
      ],
      "groupId": "g-j"
    },
    {
      "id": "olchefe.q09",
      "prompt": "Qual forma conserva as vogais ensinadas no infinitivo \"___ a passagem\"?",
      "options": [
        "Intopir.",
        "Entopir.",
        "Entupir.",
        "Entupur."
      ],
      "answer": 2,
      "explanation": "Conserva a grafia lexical com u na segunda sílaba.",
      "optionRationales": [
        "Troca vogais sem conservar o caso.",
        "Troca u por o.",
        "Conserva a grafia lexical com u na segunda sílaba.",
        "Muda a vogal da terminação do infinitivo."
      ],
      "recoverySectionIds": [
        "vogais"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "ol03",
          "sectionId": "lexicais"
        }
      ],
      "groupId": "vogais-lexicais"
    },
    {
      "id": "olchefe.q10",
      "prompt": "Qual par conserva duas grafias de vogais ensinadas?",
      "options": [
        "Quasi e te jolo.",
        "Quase e tijolo.",
        "Quasi e tijolo.",
        "Quase e tejolo."
      ],
      "answer": 1,
      "explanation": "Mantém e em quase e i na primeira sílaba de tijolo.",
      "optionRationales": [
        "Altera ambas as formas.",
        "Mantém e em quase e i na primeira sílaba de tijolo.",
        "Troca e final de quase.",
        "Troca i de tijolo."
      ],
      "recoverySectionIds": [
        "vogais"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "ol03",
          "sectionId": "lexicais"
        }
      ],
      "groupId": "vogais-lexicais"
    },
    {
      "id": "olchefe.q11",
      "prompt": "Em areia → a-re-AL, qual pista fundamenta o e antes da tônica no caso?",
      "options": [
        "Qualquer semelhança sonora com areia resolve todas as palavras.",
        "Toda palavra deve eliminar i.",
        "O número de letras ser sempre igual ao da base.",
        "A relação indicada com o substantivo em eia e a posição pré-tônica previstas no recorte."
      ],
      "answer": 3,
      "explanation": "Reconstrói a condição ensinada.",
      "optionRationales": [
        "O caso exige relação pertinente e condições.",
        "Não é uma regra universal.",
        "A formação pode alterar o tamanho da palavra.",
        "Reconstrói a condição ensinada."
      ],
      "recoverySectionIds": [
        "vogais"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "ol03",
          "sectionId": "familia"
        }
      ],
      "groupId": "familia-consulta"
    },
    {
      "id": "olchefe.q12",
      "prompt": "Uma palavra nova tem uma vogal átona duvidosa e não se enquadra no caso de família ensinado. Qual recuperação evita inventar regra?",
      "options": [
        "Consultar entrada e sentido em referência lexical autorizada e registrar a forma correta no contexto.",
        "Escolher a alternativa mais longa.",
        "Aplicar a regra de areia a qualquer palavra parecida.",
        "Escrever sempre u."
      ],
      "answer": 0,
      "explanation": "Reconhece o limite e verifica a palavra pertinente.",
      "optionRationales": [
        "Reconhece o limite e verifica a palavra pertinente.",
        "Tamanho não determina grafia.",
        "Não demonstra a condição necessária.",
        "Não há essa regra."
      ],
      "recoverySectionIds": [
        "recuperacao"
      ],
      "objectiveIds": [
        "O4"
      ],
      "originRefs": [
        {
          "unit": "ol03",
          "sectionId": "consulta"
        }
      ],
      "groupId": "familia-consulta"
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "olchefe-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "olchefe.q01": [
        {
          "missionId": "draft.olchefe",
          "sectionId": "base"
        },
        {
          "missionId": "draft.ol01",
          "sectionId": "digrafos"
        }
      ],
      "olchefe.q02": [
        {
          "missionId": "draft.olchefe",
          "sectionId": "base"
        },
        {
          "missionId": "draft.ol01",
          "sectionId": "alfabeto"
        }
      ],
      "olchefe.q03": [
        {
          "missionId": "draft.olchefe",
          "sectionId": "base"
        },
        {
          "missionId": "draft.ol01",
          "sectionId": "h"
        }
      ],
      "olchefe.q04": [
        {
          "missionId": "draft.olchefe",
          "sectionId": "base"
        },
        {
          "missionId": "draft.ol01",
          "sectionId": "h"
        }
      ],
      "olchefe.q05": [
        {
          "missionId": "draft.olchefe",
          "sectionId": "consoantes"
        },
        {
          "missionId": "draft.ol02",
          "sectionId": "chx"
        }
      ],
      "olchefe.q06": [
        {
          "missionId": "draft.olchefe",
          "sectionId": "consoantes"
        },
        {
          "missionId": "draft.ol02",
          "sectionId": "chx"
        }
      ],
      "olchefe.q07": [
        {
          "missionId": "draft.olchefe",
          "sectionId": "consoantes"
        },
        {
          "missionId": "draft.ol02",
          "sectionId": "gj"
        }
      ],
      "olchefe.q08": [
        {
          "missionId": "draft.olchefe",
          "sectionId": "consoantes"
        },
        {
          "missionId": "draft.ol02",
          "sectionId": "gj"
        }
      ],
      "olchefe.q09": [
        {
          "missionId": "draft.olchefe",
          "sectionId": "vogais"
        },
        {
          "missionId": "draft.ol03",
          "sectionId": "lexicais"
        }
      ],
      "olchefe.q10": [
        {
          "missionId": "draft.olchefe",
          "sectionId": "vogais"
        },
        {
          "missionId": "draft.ol03",
          "sectionId": "lexicais"
        }
      ],
      "olchefe.q11": [
        {
          "missionId": "draft.olchefe",
          "sectionId": "vogais"
        },
        {
          "missionId": "draft.ol03",
          "sectionId": "familia"
        }
      ],
      "olchefe.q12": [
        {
          "missionId": "draft.olchefe",
          "sectionId": "recuperacao"
        },
        {
          "missionId": "draft.ol03",
          "sectionId": "consulta"
        }
      ]
    }
  }
};
export const EDITORIAL = {
  "stage": "Rascunho local desativado; parecer pedagógico independente concluído, com ajustes aplicados; sem aceite de publicação",
  "objectives": {
    "O1": "Reconhecer a pista gráfica ou lexical pertinente ao caso.",
    "O2": "Aplicar a grafia ensinada em frase própria.",
    "O3": "Distinguir regularidade limitada e generalização indevida.",
    "O4": "Reconstruir a grafia, o motivo e a consulta de recuperação."
  },
  "recovery": {
    "objectiveId": "O4",
    "instruction": "Retomar a palavra no contexto, registrar grafia e contraste e refazer uma frase própria."
  },
  "limits": [
    "Recorte introdutório do plano 05 e bloco portuguese.spelling, não cobertura integral de letras, hífen ou edital.",
    "Ensino, frases e exercícios autorais; exemplos normativos usados pontualmente, sem atribuir à fonte autoria das frases.",
    "Fonte primária e locator conferidos em 04/10/2026; consultar vocabulário/dicionário autorizado quando o caso não estiver ensinado.",
    "Sem XP/ordem, envio, ativação ou publicação; human-review-pending distinto do parecer pedagógico independente."
  ],
  "groups": [
    {
      "id": "letra-som",
      "units": [
        "ol01"
      ]
    },
    {
      "id": "h",
      "units": [
        "ol01"
      ]
    },
    {
      "id": "ch-x",
      "units": [
        "ol02"
      ]
    },
    {
      "id": "g-j",
      "units": [
        "ol02"
      ]
    },
    {
      "id": "vogais-lexicais",
      "units": [
        "ol03"
      ]
    },
    {
      "id": "familia-consulta",
      "units": [
        "ol03"
      ]
    }
  ]
};
export const ARITHMETIC = [];
