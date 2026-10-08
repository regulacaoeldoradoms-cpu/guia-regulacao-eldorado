// Ensino e exercícios autorais; rascunho local desativado.
export const SOURCES = [
  {
    "id": "acordo.hf.hifen",
    "label": "Acordo Ortográfico — hífen no recorte introdutório",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2008/decreto/d6583.htm",
    "checkedAt": "2026-10-04",
    "version": "Decreto nº 6.583/2008, Anexo I — texto oficial consultado",
    "locator": "Anexo I, Bases XV 1º/observação/6º e XVI 1º a/b/observação/d, 2º a/b; somente HF-01–03"
  }
];
export const HFCHEFE_DRAFT = {
  "id": "draft.hfchefe",
  "topicId": "draft.hfchefe",
  "editorialKey": "HF-CHEFE",
  "candidateBlockId": "portuguese.spelling",
  "title": "Chefe de hífen: conservar a condição e a exceção",
  "contentVersion": 1,
  "kind": "boss",
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
      "heading": "1. Doze itens próprios",
      "body": "Seis grupos retomam as três aulas. Nos itens de formação, os elementos são fornecidos; nos compostos/locuções, o repertório foi ensinado. Explique a condição ou a forma convencional e o erro do distrator. Este Chefe não é avaliação independente, cobertura integral de hífen ou prova de retenção.",
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
      "id": "ex-chefe",
      "heading": "5. Exemplo resolvido: decisão em três passos",
      "body": "Em A autoaprendizagem foi retomada na segunda-feira, primeiro localize a formação auto + aprendizagem: o/a diferentes, união sem hífen. Depois reconheça segunda-feira como composto registrado com hífen. Finalmente explique por que uma condição de prefixação não decide a grafia do outro caso.",
      "type": "worked-example",
      "sourceIds": [
        "acordo.hf.hifen"
      ]
    },
    {
      "id": "retomadas",
      "heading": "6. Consultas por dificuldade",
      "body": "[HF-01: h, vogais iguais e co](hf-01-v1.md)\n\n[HF-02: diferentes, r/s e inter](hf-02-v1.md)\n\n[HF-03: compostos e locuções](hf-03-v1.md)\n\n[HF-R: revisão cumulativa](hf-r-v1.md)",
      "type": "explanation",
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
      "id": "hfchefe.q01",
      "prompt": "Na frase \"O conto usa a palavra extra-humano\", dados extra + humano, qual condição explica o hífen?",
      "options": [
        "Primeiro elemento terminado em r.",
        "Segundo elemento iniciado por h.",
        "Contato de duas vogais iguais.",
        "Toda expressão de ficção precisa de hífen."
      ],
      "answer": 1,
      "explanation": "Usa a letra inicial da base no caso ensinado.",
      "optionRationales": [
        "Extra termina em a.",
        "Usa a letra inicial da base no caso ensinado.",
        "O contato dado é a/h.",
        "Gênero do texto não é a condição."
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
          "sectionId": "h"
        }
      ],
      "groupId": "h-vogais-iguais"
    },
    {
      "id": "hfchefe.q02",
      "prompt": "Dados semi + interno em um elemento descrito no texto, qual grafia aplica contato i/i?",
      "options": [
        "Seminterno.",
        "Semiinterno.",
        "Semi interno.",
        "Semi-interno."
      ],
      "answer": 3,
      "explanation": "Conserva as vogais iguais e o hífen do caso.",
      "optionRationales": [
        "Apaga uma vogal da formação.",
        "Retira o hífen pertinente.",
        "Troca a forma por dois elementos separados.",
        "Conserva as vogais iguais e o hífen do caso."
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
          "sectionId": "iguais"
        }
      ],
      "groupId": "h-vogais-iguais"
    },
    {
      "id": "hfchefe.q03",
      "prompt": "Qual forma corresponde ao caso particular de co + ocupante do repertório?",
      "options": [
        "Coocupante.",
        "Co-ocupante.",
        "Cocupante.",
        "Co ocupante."
      ],
      "answer": 0,
      "explanation": "Aglutina co com o e conserva as duas vogais.",
      "optionRationales": [
        "Aglutina co com o e conserva as duas vogais.",
        "Ignora a exceção pertinente.",
        "Elimina uma vogal.",
        "Não é a forma aglutinada ensinada."
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
      ],
      "groupId": "co"
    },
    {
      "id": "hfchefe.q04",
      "prompt": "Por que coobrigação não torna incorreta auto-observação?",
      "options": [
        "A presença de o elimina todos os hífens.",
        "Todos os primeiros elementos têm a mesma exceção.",
        "Co com o é caso particular; auto com o/o conserva a condição de hífen do recorte.",
        "As duas grafias são decididas pelo tamanho da frase."
      ],
      "answer": 2,
      "explanation": "Mantém regra e exceção delimitadas.",
      "optionRationales": [
        "Auto-observação é hifenizada.",
        "A exceção de co não é transferida a auto.",
        "Mantém regra e exceção delimitadas.",
        "Tamanho da frase não resolve formação."
      ],
      "recoverySectionIds": [
        "primeiro"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "hf01",
          "sectionId": "co"
        }
      ],
      "groupId": "co"
    },
    {
      "id": "hfchefe.q05",
      "prompt": "Dados extra + escolar em \"Uma oficina ___\", qual forma aplica a junção de vogais diferentes?",
      "options": [
        "Extraiscolar.",
        "Extra-escolar.",
        "Extr escolar.",
        "Extraescolar."
      ],
      "answer": 3,
      "explanation": "Conserva a/e e une sem hífen.",
      "optionRationales": [
        "Muda a vogal inicial da base.",
        "Aplica a regra de vogais iguais sem esse contato.",
        "Elimina/separa letras da formação.",
        "Conserva a/e e une sem hífen."
      ],
      "recoverySectionIds": [
        "contato"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "hf02",
          "sectionId": "diferentes"
        }
      ],
      "groupId": "vogais-diferentes"
    },
    {
      "id": "hfchefe.q06",
      "prompt": "Qual contraste entre autoaprendizagem e auto-observação respeita as bases fornecidas?",
      "options": [
        "Todas as formações com auto usam hífen.",
        "O/a em aprendizagem leva à união sem hífen; o/o em observação leva ao hífen nesses casos.",
        "Todas as formações com auto perdem o o final.",
        "As duas têm contato de vogais iguais."
      ],
      "answer": 1,
      "explanation": "Compara o contato pertinente sem generalizar.",
      "optionRationales": [
        "Autoaprendizagem é sem hífen.",
        "Compara o contato pertinente sem generalizar.",
        "As duas formas conservam o o do primeiro elemento.",
        "O/a é diferente de o/o."
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
          "sectionId": "diferentes"
        }
      ],
      "groupId": "vogais-diferentes"
    },
    {
      "id": "hfchefe.q07",
      "prompt": "Na formação mini + saia para a peça de roupa, qual forma conserva o caso vogal/s?",
      "options": [
        "Mini-saia.",
        "Minisaia.",
        "Minissaia.",
        "Mini saia."
      ],
      "answer": 2,
      "explanation": "Aglutina com duplicação de s.",
      "optionRationales": [
        "Usa hífen indevido no caso.",
        "Omite a duplicação.",
        "Aglutina com duplicação de s.",
        "Não conserva a forma aglutinada."
      ],
      "recoverySectionIds": [
        "contato"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "hf02",
          "sectionId": "rs"
        }
      ],
      "groupId": "rs-inter"
    },
    {
      "id": "hfchefe.q08",
      "prompt": "Qual comparação impede transferir a regra de contra + regra para inter + regional?",
      "options": [
        "Contra termina em vogal e gera contrarregra; inter termina em r e gera inter-regional no caso ensinado.",
        "Todo contato com r deve ser escrito sem hífen.",
        "Todo primeiro elemento termina em vogal.",
        "Inter-regional contém ss por regra de s."
      ],
      "answer": 0,
      "explanation": "Preserva elementos e condições distintos.",
      "optionRationales": [
        "Preserva elementos e condições distintos.",
        "Inter-regional é contraexemplo do recorte.",
        "Inter termina em r.",
        "A base não começa por s."
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
      ],
      "groupId": "rs-inter"
    },
    {
      "id": "hfchefe.q09",
      "prompt": "Qual par conserva dois compostos hifenizados do repertório?",
      "options": [
        "Segunda-feira e arcoíris.",
        "Segundafeira e arco-íris.",
        "Segunda-feira e arco-íris.",
        "Segunda feira e arco íris."
      ],
      "answer": 2,
      "explanation": "Mantém as duas formas registradas com hífen.",
      "optionRationales": [
        "Retira o hífen do segundo caso.",
        "Retira o hífen do primeiro caso.",
        "Mantém as duas formas registradas com hífen.",
        "Substitui ambos por espaços."
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
          "sectionId": "compostos"
        }
      ],
      "groupId": "compostos"
    },
    {
      "id": "hfchefe.q10",
      "prompt": "Qual explicação conserva paraquedas sem fazer uma regra universal para compostos?",
      "options": [
        "É uma forma aglutinada registrada, enquanto guarda-chuva conserva hífen.",
        "Todo composto deve perder hífen.",
        "Todo composto deve usar hífen porque tem elementos.",
        "Paraquedas recebe hífen apenas quando aparece no fim da frase."
      ],
      "answer": 0,
      "explanation": "Distingue formas convencionais do repertório.",
      "optionRationales": [
        "Distingue formas convencionais do repertório.",
        "Guarda-chuva mostra o limite.",
        "Paraquedas é caso aglutinado.",
        "Posição na frase não altera a grafia do caso."
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
          "sectionId": "aglutinados"
        }
      ],
      "groupId": "compostos"
    },
    {
      "id": "hfchefe.q11",
      "prompt": "Qual opção conserva as locuções comuns ensinadas sem hífen?",
      "options": [
        "Fim de-semana e cão de-guarda.",
        "Fim-de-semana e cão-de-guarda.",
        "Fimdesemana e cãodeguarda.",
        "Fim de semana e cão de guarda."
      ],
      "answer": 3,
      "explanation": "Mantém palavras separadas sem hífen nos casos dados.",
      "optionRationales": [
        "Acrescenta hífen em parte das expressões.",
        "Hifeniza ambas indevidamente.",
        "Aglutina as locuções sem fundamento.",
        "Mantém palavras separadas sem hífen nos casos dados."
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
          "sectionId": "locucoes"
        }
      ],
      "groupId": "locucoes-excecoes"
    },
    {
      "id": "hfchefe.q12",
      "prompt": "Um estudante escreveu \"cor de rosa\" por aplicar a regra geral das locuções sem conferir exceções. Qual retomada é adequada?",
      "options": [
        "Hifenizar toda expressão que descreve cor.",
        "Rever a exceção cor-de-rosa e contrastar com cor de vinho, mantendo cada grafia ensinada.",
        "Retirar hífen de todos os compostos.",
        "Trocar o significado sem conferir a palavra pretendida."
      ],
      "answer": 1,
      "explanation": "Recupera a exceção pertinente e o limite da generalização.",
      "optionRationales": [
        "Cor de vinho continua sem hífen no recorte.",
        "Recupera a exceção pertinente e o limite da generalização.",
        "Amplia o erro para outra classe de casos.",
        "Não corrige a forma pretendida."
      ],
      "recoverySectionIds": [
        "recuperacao"
      ],
      "objectiveIds": [
        "O4"
      ],
      "originRefs": [
        {
          "unit": "hf03",
          "sectionId": "excecoes"
        }
      ],
      "groupId": "locucoes-excecoes"
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "hfchefe-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "hfchefe.q01": [
        {
          "missionId": "draft.hfchefe",
          "sectionId": "primeiro"
        },
        {
          "missionId": "draft.hf01",
          "sectionId": "h"
        }
      ],
      "hfchefe.q02": [
        {
          "missionId": "draft.hfchefe",
          "sectionId": "primeiro"
        },
        {
          "missionId": "draft.hf01",
          "sectionId": "iguais"
        }
      ],
      "hfchefe.q03": [
        {
          "missionId": "draft.hfchefe",
          "sectionId": "primeiro"
        },
        {
          "missionId": "draft.hf01",
          "sectionId": "co"
        }
      ],
      "hfchefe.q04": [
        {
          "missionId": "draft.hfchefe",
          "sectionId": "primeiro"
        },
        {
          "missionId": "draft.hf01",
          "sectionId": "co"
        }
      ],
      "hfchefe.q05": [
        {
          "missionId": "draft.hfchefe",
          "sectionId": "contato"
        },
        {
          "missionId": "draft.hf02",
          "sectionId": "diferentes"
        }
      ],
      "hfchefe.q06": [
        {
          "missionId": "draft.hfchefe",
          "sectionId": "contato"
        },
        {
          "missionId": "draft.hf02",
          "sectionId": "diferentes"
        }
      ],
      "hfchefe.q07": [
        {
          "missionId": "draft.hfchefe",
          "sectionId": "contato"
        },
        {
          "missionId": "draft.hf02",
          "sectionId": "rs"
        }
      ],
      "hfchefe.q08": [
        {
          "missionId": "draft.hfchefe",
          "sectionId": "contato"
        },
        {
          "missionId": "draft.hf02",
          "sectionId": "inter"
        }
      ],
      "hfchefe.q09": [
        {
          "missionId": "draft.hfchefe",
          "sectionId": "convencao"
        },
        {
          "missionId": "draft.hf03",
          "sectionId": "compostos"
        }
      ],
      "hfchefe.q10": [
        {
          "missionId": "draft.hfchefe",
          "sectionId": "convencao"
        },
        {
          "missionId": "draft.hf03",
          "sectionId": "aglutinados"
        }
      ],
      "hfchefe.q11": [
        {
          "missionId": "draft.hfchefe",
          "sectionId": "convencao"
        },
        {
          "missionId": "draft.hf03",
          "sectionId": "locucoes"
        }
      ],
      "hfchefe.q12": [
        {
          "missionId": "draft.hfchefe",
          "sectionId": "recuperacao"
        },
        {
          "missionId": "draft.hf03",
          "sectionId": "excecoes"
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
  ],
  "groups": [
    {
      "id": "h-vogais-iguais",
      "units": [
        "hf01"
      ]
    },
    {
      "id": "co",
      "units": [
        "hf01"
      ]
    },
    {
      "id": "vogais-diferentes",
      "units": [
        "hf02"
      ]
    },
    {
      "id": "rs-inter",
      "units": [
        "hf02"
      ]
    },
    {
      "id": "compostos",
      "units": [
        "hf03"
      ]
    },
    {
      "id": "locucoes-excecoes",
      "units": [
        "hf03"
      ]
    }
  ]
};
export const ARITHMETIC = [];
