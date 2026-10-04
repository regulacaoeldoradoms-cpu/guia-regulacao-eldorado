// Ensino e exercícios autorais; candidato editorial local desativado.
export const SOURCES = [
  {
    "id": "acordo.ol.letras",
    "label": "Acordo Ortográfico — letras e grafias do recorte",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2008/decreto/d6583.htm",
    "checkedAt": "2026-10-04",
    "version": "Decreto nº 6.583/2008, Anexo I — texto oficial consultado",
    "locator": "Anexo I, Bases I (alfabeto/dígrafos), II (h inicial), III 1º/2º (ch/x, g/j) e V 1º/2º a (vogais átonas); somente OL-01–03"
  }
];
export const OLR_DRAFT = {
  "id": "draft.olr",
  "topicId": "draft.olr",
  "editorialKey": "OL-R",
  "candidateBlockId": "portuguese.spelling",
  "title": "Revisão de letras: comparar, aplicar e consultar",
  "contentVersion": 1,
  "kind": "lesson",
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
      "heading": "1. Revisar com palavra e contexto",
      "body": "Esta revisão usa oito itens novos. Identifique palavra e sentido; escolha entre uma regra delimitada, um contraste de representação e a forma lexical ensinada. Não diga apenas que uma opção parece mais comum.",
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
      "id": "ex-base",
      "heading": "5. Exemplo resolvido: frase curta",
      "body": "Em Hoje guardou a chave, hoje conserva h e chave conserva ch. O h inicial e o dígrafo são situações diferentes: não se explica cada letra por um som separado.",
      "type": "worked-example",
      "sourceIds": [
        "acordo.ol.letras"
      ]
    },
    {
      "id": "ex-forma",
      "heading": "6. Exemplo resolvido: registro lexical",
      "body": "Em Ela vai puxar a ficha, puxar usa x e ficha usa ch. A decisão recupera as duas formas ensinadas, sem criar uma regra para todo som semelhante.",
      "type": "worked-example",
      "sourceIds": [
        "acordo.ol.letras"
      ]
    },
    {
      "id": "ex-vogal",
      "heading": "7. Exemplo resolvido: limite da dedução",
      "body": "Em O cadeado ficou na caixa de costume, cadeado mantém e na relação com cadeia; costume mantém o pela forma lexical do repertório. As justificativas não são idênticas e nenhuma resolve todas as vogais átonas.",
      "type": "worked-example",
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
      "id": "olr.q01",
      "prompt": "Qual análise de nh em \"O ninho ficou no galho\" aplica o contraste ensinado?",
      "options": [
        "Duas letras representam um som consonantal no caso nh.",
        "Nh é a 27ª letra do alfabeto.",
        "Nh tem dois sons obrigatórios porque tem duas letras.",
        "Toda combinação de duas letras é nh."
      ],
      "answer": 0,
      "explanation": "Reconhece o dígrafo dado.",
      "optionRationales": [
        "Reconhece o dígrafo dado.",
        "Dígrafo não é letra adicional.",
        "Confunde número de letras e representação sonora.",
        "Não descreve a combinação específica."
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
      ]
    },
    {
      "id": "olr.q02",
      "prompt": "Qual forma conserva o nome ensinado da unidade de tempo?",
      "options": [
        "Ora, apagando h em qualquer caso.",
        "Hhora, duplicando h para torná-lo audível.",
        "Hora, com h inicial na palavra pretendida.",
        "Hóra, porque todo h exige acento seguinte."
      ],
      "answer": 2,
      "explanation": "Mantém a grafia lexical e o sentido.",
      "optionRationales": [
        "Não conserva a palavra hora pedida.",
        "A duplicação não pertence à forma.",
        "Mantém a grafia lexical e o sentido.",
        "A palavra ensinada não tem esse sinal."
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
      ]
    },
    {
      "id": "olr.q03",
      "prompt": "Qual par completa as formas do repertório \"___ a pessoa e ___ a cadeira\"?",
      "options": [
        "Xamar; puchar.",
        "Chamar; puxar.",
        "Chamar; puchar.",
        "Xamar; puxar."
      ],
      "answer": 1,
      "explanation": "Conserva ch em chamar e x em puxar.",
      "optionRationales": [
        "Altera as duas formas lexicais.",
        "Conserva ch em chamar e x em puxar.",
        "Puxar é com x.",
        "Chamar é com ch."
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
      ]
    },
    {
      "id": "olr.q04",
      "prompt": "Qual opção mantém as palavras ensinadas \"___ de organizar\" e \"a ___ do metal\"?",
      "options": [
        "Geito; ferrujem.",
        "Jeito; ferrujem.",
        "Geito; ferrugem.",
        "Jeito; ferrugem."
      ],
      "answer": 3,
      "explanation": "Mantém as grafias lexicais de ambas.",
      "optionRationales": [
        "Troca as letras nos dois casos.",
        "A segunda forma requer g no repertório.",
        "A primeira forma requer j.",
        "Mantém as grafias lexicais de ambas."
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
      ]
    },
    {
      "id": "olr.q05",
      "prompt": "Qual frase conserva duas formas lexicais de vogais do recorte?",
      "options": [
        "A tigela ficou no lugar de custume.",
        "A tegela ficou no lugar de custume.",
        "A tigela ficou no lugar de costume.",
        "A tegela ficou no lugar de costume."
      ],
      "answer": 2,
      "explanation": "Mantém i em tigela e o em costume.",
      "optionRationales": [
        "Troca o de costume.",
        "Troca as duas vogais pertinentes.",
        "Mantém i em tigela e o em costume.",
        "Troca i de tigela."
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
      ]
    },
    {
      "id": "olr.q06",
      "prompt": "Qual relação fundamenta o e pré-tônico de cadeado no caso ensinado?",
      "options": [
        "Parecer com qualquer palavra que tenha c.",
        "Relação dada com cadeia, substantivo terminado em eia.",
        "Toda vogal átona da língua ser e.",
        "Toda palavra terminada em o dispensar consulta."
      ],
      "answer": 1,
      "explanation": "Conserva a base e a condição do caso.",
      "optionRationales": [
        "Semelhança de inicial não é a condição.",
        "Conserva a base e a condição do caso.",
        "O repertório mostra outras vogais átonas.",
        "O final não resolve toda a grafia."
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
      ]
    },
    {
      "id": "olr.q07",
      "prompt": "Por que erva não autoriza eliminar h de hoje?",
      "options": [
        "Porque todas as palavras devem receber h.",
        "Porque todo h tem som obrigatório.",
        "Porque hoje deve ser escrito com dois h.",
        "Porque são formas lexicais diferentes; a supressão em erva não é regra para todo h."
      ],
      "answer": 3,
      "explanation": "Preserva as duas convenções e o limite.",
      "optionRationales": [
        "Erva é sem h.",
        "O ensino distingue h inicial sem som próprio.",
        "Não é a forma lexical.",
        "Preserva as duas convenções e o limite."
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
      ]
    },
    {
      "id": "olr.q08",
      "prompt": "Uma dúvida de e/i não está no repertório nem na família ensinada. Qual ação é adequada?",
      "options": [
        "Consultar palavra e sentido em vocabulário ou dicionário autorizado, registrando a grafia pertinente.",
        "Escolher e em todos os casos.",
        "Trocar a palavra por qualquer sequência de letras.",
        "Copiar a pronúncia como grafia obrigatória."
      ],
      "answer": 0,
      "explanation": "Resolve a lacuna por referência lexical pertinente.",
      "optionRationales": [
        "Resolve a lacuna por referência lexical pertinente.",
        "Cria regra universal falsa.",
        "Não verifica a palavra desejada.",
        "A pronúncia não decide sozinha."
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
          "sectionId": "familia"
        }
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "olr-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "olr.q01": [
        {
          "missionId": "draft.olr",
          "sectionId": "base"
        }
      ],
      "olr.q02": [
        {
          "missionId": "draft.olr",
          "sectionId": "base"
        }
      ],
      "olr.q03": [
        {
          "missionId": "draft.olr",
          "sectionId": "consoantes"
        }
      ],
      "olr.q04": [
        {
          "missionId": "draft.olr",
          "sectionId": "consoantes"
        }
      ],
      "olr.q05": [
        {
          "missionId": "draft.olr",
          "sectionId": "vogais"
        }
      ],
      "olr.q06": [
        {
          "missionId": "draft.olr",
          "sectionId": "vogais"
        }
      ],
      "olr.q07": [
        {
          "missionId": "draft.olr",
          "sectionId": "base"
        }
      ],
      "olr.q08": [
        {
          "missionId": "draft.olr",
          "sectionId": "recuperacao"
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
  ]
};
export const ARITHMETIC = [];
