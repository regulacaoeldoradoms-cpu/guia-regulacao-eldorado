// Ensino e exercícios autorais; rascunho local desativado.
export const SOURCES = [
  {
    "id": "acordo.hf.hifen",
    "label": "Acordo Ortográfico — hífen no recorte introdutório",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2008/decreto/d6583.htm",
    "checkedAt": "2026-10-04",
    "version": "Decreto nº 6.583/2008, Anexo I — texto oficial consultado",
    "locator": "Anexo I, Bases XVI 1º a/b/observação/d e 2º a/b, XV 1º/observação e 6º; somente HF-01–03"
  }
];
export const HFR_DRAFT = {
  "id": "draft.hfr",
  "topicId": "draft.hfr",
  "editorialKey": "HF-R",
  "candidateBlockId": "portuguese.spelling",
  "title": "Revisão de hífen: condição e contraste",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Decidir o hífen pela formação, condição e exceção ensinadas, aplicando grafias em frases sem transformar o recorte em regra universal.",
  "sourceIds": [
    "acordo.hf.hifen"
  ],
  "sections": [
    {
      "id": "entrada",
      "heading": "1. Revisar sem misturar formações",
      "body": "Oito questões próprias retomam os três recortes. Identifique primeiro elementos, composto ou locução; localize a condição e a exceção. As grafias dadas não substituem ensino de toda formação de palavras.",
      "type": "explanation",
      "sourceIds": [
        "acordo.hf.hifen"
      ]
    },
    {
      "id": "primeiro",
      "heading": "2. H, vogais iguais e co",
      "body": "Nos casos ensinados, base com h usa hífen; contato de vogais iguais também, como auto-observação e semi-interno. Co com o aglutina-se nos exemplos coobrigação/coocupante. A exceção não apaga a condição dos outros primeiros elementos.",
      "type": "explanation",
      "sourceIds": [
        "acordo.hf.hifen"
      ]
    },
    {
      "id": "contato",
      "heading": "3. Diferentes, r/s e inter",
      "body": "Autoaprendizagem/extraescolar: vogais diferentes, sem hífen. Contrarregra/minissaia/microssistema: primeiro em vogal, base em r/s, união e duplicação. Inter-regional: caso de inter com r, com hífen. Conservar o primeiro elemento é essencial para decidir.",
      "type": "explanation",
      "sourceIds": [
        "acordo.hf.hifen"
      ]
    },
    {
      "id": "convencao",
      "heading": "4. Composto ou locução do repertório",
      "body": "Guarda-chuva/segunda-feira/arco-íris são hifenizados; girassol/paraquedas são aglutinados. Sala de jantar/fim de semana/cão de guarda são locuções sem hífen. Cor-de-rosa conserva a exceção, cor de vinho não recebe hífen.",
      "type": "explanation",
      "sourceIds": [
        "acordo.hf.hifen"
      ]
    },
    {
      "id": "ex-vogais",
      "heading": "5. Exemplo resolvido: regra e exceção",
      "body": "Auto-observação tem contato o/o com hífen; coobrigação tem contato o/o, mas segue o caso particular de co sem hífen. Comparar apenas as duas vogais, ignorando o primeiro elemento, não explica o contraste.",
      "type": "worked-example",
      "sourceIds": [
        "acordo.hf.hifen"
      ]
    },
    {
      "id": "ex-contato",
      "heading": "6. Exemplo resolvido: r não decide sozinho",
      "body": "Contra + regra → contrarregra; inter + regional → inter-regional. No primeiro caso, o elemento termina em vogal e duplica r; no segundo, o caso delimitado inter com r leva hífen.",
      "type": "worked-example",
      "sourceIds": [
        "acordo.hf.hifen"
      ]
    },
    {
      "id": "ex-convencao",
      "heading": "7. Exemplo resolvido: expressão com de",
      "body": "Sala de jantar não recebe hífen; cor-de-rosa conserva os hífens consagrados. Ambas contêm de, mas a regra geral admite exceção. A presença de de não é uma receita universal.",
      "type": "worked-example",
      "sourceIds": [
        "acordo.hf.hifen"
      ]
    },
    {
      "id": "glossario",
      "heading": "Vocabulário de apoio",
      "body": "Hífen: sinal usado na ligação escrita dos casos previstos. Prefixo: elemento que se acrescenta antes de uma base. Elemento de recomposição: elemento não autônomo, como auto/micro nos casos dados. Base: elemento ao qual se liga o primeiro. Aglutinação gráfica: união escrita sem espaço ou hífen nos casos do recorte. Tônica: sílaba com maior destaque de pronúncia. Composto: palavra formada pela combinação de elementos; os casos com hífen são dados na aula. Locução: combinação de palavras que funciona como uma expressão; seus casos também precisam ser observados.",
      "type": "glossary",
      "sourceIds": [
        "acordo.hf.hifen"
      ]
    },
    {
      "id": "recuperacao",
      "heading": "Refazer pela condição, não pelo sinal",
      "body": "Identifique a formação e as letras de contato; procure a condição e a exceção pertinente. Em composto/locução, retome a forma convencional ensinada. Registre o que uma alternativa incorreta ignorou e escreva uma frase nova. Fora dos casos ensinados, consulte referência lexical autorizada; não invente uma regra universal a partir de um exemplo.",
      "type": "summary",
      "sourceIds": [
        "acordo.hf.hifen"
      ]
    }
  ],
  "recall": [
    "Qual é a formação: primeiro elemento/base ou composto/locução?",
    "Qual condição, letra de contato ou forma convencional está presente?",
    "Qual exceção ou limite impede a regra universal?"
  ],
  "questions": [
    {
      "id": "hfr.q01",
      "prompt": "Na formação auto + observação, qual motivo justifica o hífen no caso dado?",
      "options": [
        "Contato de duas vogais iguais o/o, sem o caso particular de co.",
        "Toda palavra de cinco sílabas leva hífen.",
        "A base começa por h.",
        "O primeiro elemento é co."
      ],
      "answer": 0,
      "explanation": "Mantém formação e condição pertinentes.",
      "optionRationales": [
        "Mantém formação e condição pertinentes.",
        "Número de sílabas não é a condição.",
        "Observação começa por o.",
        "O primeiro elemento fornecido é auto."
      ],
      "recoverySectionIds": [
        "primeiro"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "hf01",
          "sectionId": "iguais"
        }
      ]
    },
    {
      "id": "hfr.q02",
      "prompt": "Dados co + obrigação em \"Foi descrita uma ___\", qual grafia conserva o contraste com auto-observação?",
      "options": [
        "Co obrigação.",
        "Co-obrigação.",
        "Cobr igação.",
        "Coobrigação."
      ],
      "answer": 3,
      "explanation": "Conserva a aglutinação particular de co e os dois o.",
      "optionRationales": [
        "Não é a forma aglutinada do caso.",
        "Ignora a exceção ensinada.",
        "Elimina/separa letras sem conservar a forma.",
        "Conserva a aglutinação particular de co e os dois o."
      ],
      "recoverySectionIds": [
        "primeiro"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "hf01",
          "sectionId": "co"
        }
      ]
    },
    {
      "id": "hfr.q03",
      "prompt": "Dados auto + aprendizagem, qual condição sustenta a grafia sem hífen?",
      "options": [
        "Os dois elementos se iniciam por h.",
        "O primeiro termina em o e o segundo começa em a, vogais diferentes.",
        "Toda palavra com auto nunca usa hífen.",
        "Aprendizagem contém menos de três letras."
      ],
      "answer": 1,
      "explanation": "Identifica o contato efetivo e o caso.",
      "optionRationales": [
        "Não corresponde aos elementos dados.",
        "Identifica o contato efetivo e o caso.",
        "Auto-observação é contraexemplo ensinado.",
        "Não é uma descrição nem uma regra do caso."
      ],
      "recoverySectionIds": [
        "contato"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "hf02",
          "sectionId": "diferentes"
        }
      ]
    },
    {
      "id": "hfr.q04",
      "prompt": "Qual par conserva os casos microssistema e inter-regional?",
      "options": [
        "Os dois perdem uma consoante inicial.",
        "Os dois sempre aglutinam com ss.",
        "Micro + sistema aglutina com ss; inter + regional usa hífen.",
        "Inter + regional deve copiar a duplicação de s."
      ],
      "answer": 2,
      "explanation": "Distingue os primeiros elementos e as bases.",
      "optionRationales": [
        "As grafias conservam as letras pertinentes.",
        "Inter-regional não tem esse contato.",
        "Distingue os primeiros elementos e as bases.",
        "A base regional começa por r."
      ],
      "recoverySectionIds": [
        "contato"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "hf02",
          "sectionId": "inter"
        }
      ]
    },
    {
      "id": "hfr.q05",
      "prompt": "Qual palavra do repertório é composta e escrita sem hífen?",
      "options": [
        "Sala-de-jantar.",
        "Gira-sol.",
        "Guarda chuva.",
        "Girassol."
      ],
      "answer": 3,
      "explanation": "Conserva a grafia aglutinada do composto registrado.",
      "optionRationales": [
        "Hifeniza uma locução indevidamente.",
        "Altera o caso girassol.",
        "Retira o hífen do composto guarda-chuva.",
        "Conserva a grafia aglutinada do composto registrado."
      ],
      "recoverySectionIds": [
        "convencao"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "hf03",
          "sectionId": "aglutinados"
        }
      ]
    },
    {
      "id": "hfr.q06",
      "prompt": "Qual comparação preserva as duas descrições de cor do recorte?",
      "options": [
        "Toda descrição de cor deve usar hífen.",
        "Cor-de-rosa tem hífens; cor de vinho é locução sem hífen.",
        "Toda expressão com de deve perder hífen.",
        "As duas precisam ser aglutinadas numa palavra só."
      ],
      "answer": 1,
      "explanation": "Conserva a exceção e a forma não hifenizada.",
      "optionRationales": [
        "Cor de vinho mostra o limite.",
        "Conserva a exceção e a forma não hifenizada.",
        "Cor-de-rosa mostra a exceção.",
        "Não são as formas ensinadas."
      ],
      "recoverySectionIds": [
        "convencao"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "hf03",
          "sectionId": "excecoes"
        }
      ]
    },
    {
      "id": "hfr.q07",
      "prompt": "Em super + homem no conto, qual revisão conserva a condição de h inicial da base?",
      "options": [
        "Superomem.",
        "Superhomem.",
        "Super-homem.",
        "Super homem."
      ],
      "answer": 2,
      "explanation": "Mantém h e o hífen do caso.",
      "optionRationales": [
        "Apaga h da base.",
        "Elimina o hífen pertinente.",
        "Mantém h e o hífen do caso.",
        "Não é a forma hifenizada fornecida."
      ],
      "recoverySectionIds": [
        "primeiro"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "hf01",
          "sectionId": "h"
        }
      ]
    },
    {
      "id": "hfr.q08",
      "prompt": "Um estudante aplicou a forma inter-regional a contra + regra e escreveu contra-regra. Qual retomada é adequada?",
      "options": [
        "Conservar os elementos: contra termina em vogal; a base em r exige contrarregra, com rr e sem hífen nesse caso.",
        "Escrever todas as formações com espaço.",
        "Eliminar r da base regra.",
        "Usar hífen em todas as palavras com r."
      ],
      "answer": 0,
      "explanation": "Retoma a condição ignorada e o contraste.",
      "optionRationales": [
        "Retoma a condição ignorada e o contraste.",
        "Não é a grafia dos casos ensinados.",
        "Desfaz a base fornecida.",
        "Generaliza indevidamente a letra r."
      ],
      "recoverySectionIds": [
        "recuperacao"
      ],
      "objectiveIds": [
        "O4"
      ],
      "originRefs": [
        {
          "unit": "hf02",
          "sectionId": "rs"
        }
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "hfr-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "hfr.q01": [
        {
          "missionId": "draft.hfr",
          "sectionId": "primeiro"
        }
      ],
      "hfr.q02": [
        {
          "missionId": "draft.hfr",
          "sectionId": "primeiro"
        }
      ],
      "hfr.q03": [
        {
          "missionId": "draft.hfr",
          "sectionId": "contato"
        }
      ],
      "hfr.q04": [
        {
          "missionId": "draft.hfr",
          "sectionId": "contato"
        }
      ],
      "hfr.q05": [
        {
          "missionId": "draft.hfr",
          "sectionId": "convencao"
        }
      ],
      "hfr.q06": [
        {
          "missionId": "draft.hfr",
          "sectionId": "convencao"
        }
      ],
      "hfr.q07": [
        {
          "missionId": "draft.hfr",
          "sectionId": "primeiro"
        }
      ],
      "hfr.q08": [
        {
          "missionId": "draft.hfr",
          "sectionId": "recuperacao"
        }
      ]
    }
  }
};
export const EDITORIAL = {
  "stage": "Rascunho local desativado; parecer pedagógico independente concluído sem correções",
  "objectives": {
    "O1": "Identificar a formação e a condição pertinente ao hífen.",
    "O2": "Aplicar a grafia em contexto, conservando letras e exceções.",
    "O3": "Distinguir casos próximos sem criar regra universal.",
    "O4": "Retomar a condição ou forma lexical e corrigir a generalização."
  },
  "recovery": {
    "objectiveId": "O4",
    "instruction": "Nomear a formação e a condição; comparar a exceção/contraste e refazer uma frase."
  },
  "limits": [
    "Plano 05/bloco portuguese.spelling existente; recorte introdutório, não toda ortografia ou hífen.",
    "Frases, explicações e questões autorais; referência normativa não é autora das frases.",
    "Fonte primária conferida em 04/10/2026 somente Bases XV/XVI pertinentes; exemplos e hipóteses delimitados.",
    "Não cobra todos prefixos, sufixos, topônimos, espécies, bem/mal, pronomes, ênclise/tmese ou divisão de linha.",
    "Sem XP/ordem editorial, envio, ativação, merge, deploy ou D1. Gate human-review-pending distinto de parecer pedagógico."
  ]
};
export const ARITHMETIC = [];
