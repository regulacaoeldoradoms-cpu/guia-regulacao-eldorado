// Ensino e exercícios autorais; candidato editorial local desativado.
export const SOURCES = [
  {
    "id": "acordo.ol.letras",
    "label": "Acordo Ortográfico — letras e grafias do recorte",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2008/decreto/d6583.htm",
    "checkedAt": "2026-10-04",
    "version": "Decreto nº 6.583/2008, Anexo I — texto oficial consultado",
    "locator": "Anexo I, Base III, introdução e 1º/2º; formas chave/ficha/chamar/mancha, mexer/deixar/puxar/xícara, girafa/relógio/ferrugem e jeito/hoje/rejeitar"
  }
];
export const OL02_DRAFT = {
  "id": "draft.ol02",
  "topicId": "draft.ol02",
  "editorialKey": "OL-02",
  "candidateBlockId": "portuguese.spelling",
  "title": "Ch ou x, g ou j: grafia lexical em contexto",
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
      "heading": "1. Ouvir não escolhe sempre a letra",
      "body": "Frase autoral: Ela encontrou a chave e foi mexer na caixa. Ch e x podem representar o mesmo som consonantal em palavras diferentes. O mesmo ocorre com g e j em certos casos, como girafa e jeito. Não é uma autorização para trocar as letras: as grafias convencionais são distintas.",
      "type": "explanation",
      "sourceIds": [
        "acordo.ol.letras"
      ]
    },
    {
      "id": "chx",
      "heading": "2. Pequeno repertório de ch e x",
      "body": "Formas deste recorte: chave, ficha, chamar e mancha com ch; mexer, deixar, puxar e xícara com x. Guarde a palavra em uma frase e compare a forma. Não foi ensinada uma regra que determine ch/x apenas pelo som ou pela vogal anterior. X também tem outros valores sonoros, fora desta aula.",
      "type": "explanation",
      "sourceIds": [
        "acordo.ol.letras"
      ]
    },
    {
      "id": "gj",
      "heading": "3. Pequeno repertório de g e j",
      "body": "Antes de e/i, g pode representar o mesmo som consonantal que j nos exemplos. Girafa, relógio e ferrugem são formas com g; jeito, hoje e rejeitar são formas com j. Jeito não vira geito por começar com o mesmo som de girafa. O h de hoje e o j interior cumprem convenções diferentes.",
      "type": "explanation",
      "sourceIds": [
        "acordo.ol.letras"
      ]
    },
    {
      "id": "consulta",
      "heading": "4. O que fazer diante de um caso não ensinado",
      "body": "Primeiro identifique a palavra pelo sentido da frase. Se a forma não está no repertório e nenhuma regra estudada resolve, consulte uma entrada de vocabulário ortográfico ou dicionário autorizado, conservando acentos e letras. Uma busca por uma forma imaginada pode falhar: confira a entrada encontrada e o sentido. Não considere a primeira ocorrência informal na internet uma prova normativa.",
      "type": "explanation",
      "sourceIds": [
        "acordo.ol.letras"
      ]
    },
    {
      "id": "ex-mexer",
      "heading": "5. Exemplo resolvido: mexer",
      "body": "Em Ela vai mexer na caixa, mexer é a forma lexical com x ensinada. Mecher não corresponde a essa forma padrão. O fato de chamar ter ch não permite transferir suas letras para outro verbo apenas pela semelhança sonora.",
      "type": "worked-example",
      "sourceIds": [
        "acordo.ol.letras"
      ]
    },
    {
      "id": "ex-ficha",
      "heading": "6. Exemplo resolvido: ficha",
      "body": "Em A ficha ficou na mesa, ficha é a forma lexical com ch. Fixar a palavra com seu sentido ajuda mais que escrever uma regra falsa para qualquer som parecido. Não confundir esta forma com outras palavras que eventualmente tenham x.",
      "type": "worked-example",
      "sourceIds": [
        "acordo.ol.letras"
      ]
    },
    {
      "id": "ex-jeito",
      "heading": "7. Exemplo resolvido: jeito",
      "body": "Em Ela encontrou um jeito de organizar a tarefa, jeito tem j. Girafa tem g antes de i; as duas formas ilustram por que um som parecido não decide a mesma letra em todas as palavras. Para um caso fora do repertório, a consulta lexical continua necessária.",
      "type": "worked-example",
      "sourceIds": [
        "acordo.ol.letras"
      ]
    },
    {
      "id": "limites",
      "heading": "8. Repertório, não uma regra total",
      "body": "As listas são curtas e intencionais. Não cobrem todas as exceções, valores de x, terminações ou famílias de palavras. A Base III explica que essas distinções se relacionam à história das palavras; nesta aula aplicamos formas identificadas, sem exigir conhecimento de etimologia para responder.",
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
      "id": "ol02.q01",
      "prompt": "Qual forma completa o verbo ensinado em \"Ela vai ___ na caixa\"?",
      "options": [
        "Mexxer.",
        "Mecher.",
        "Mexer.",
        "Meixer."
      ],
      "answer": 2,
      "explanation": "Conserva a grafia lexical com x.",
      "optionRationales": [
        "Duplica x indevidamente.",
        "Troca x por ch sem fundamento no caso.",
        "Conserva a grafia lexical com x.",
        "Acrescenta i à forma ensinada."
      ],
      "recoverySectionIds": [
        "chx"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "ol02.q02",
      "prompt": "Qual palavra do repertório é escrita com ch?",
      "options": [
        "Chamar.",
        "Xamar.",
        "Xchamar.",
        "Chxamar."
      ],
      "answer": 0,
      "explanation": "Conserva ch na forma lexical.",
      "optionRationales": [
        "Conserva ch na forma lexical.",
        "Não é a forma do verbo ensinado.",
        "Acrescenta letras indevidas.",
        "Mistura alternativas sem preservar a grafia."
      ],
      "recoverySectionIds": [
        "chx"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "ol02.q03",
      "prompt": "Qual opção conserva as grafias ensinadas na frase \"A ___ ficou perto da ___\"?",
      "options": [
        "Fix a; xave.",
        "Ficha; chave.",
        "Fixa; xave.",
        "Fixa; chavi."
      ],
      "answer": 1,
      "explanation": "As duas formas usam ch no repertório dado.",
      "optionRationales": [
        "Altera a palavra e sua unidade gráfica.",
        "As duas formas usam ch no repertório dado.",
        "As formas não conservam ficha/chave.",
        "Troca a primeira palavra e a vogal da segunda."
      ],
      "recoverySectionIds": [
        "chx"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "ol02.q04",
      "prompt": "Qual forma padrão do repertório indica uma maneira de realizar algo em \"Há um ___ de resolver\"?",
      "options": [
        "Geito.",
        "Jeitto.",
        "Gjeito.",
        "Jeito."
      ],
      "answer": 3,
      "explanation": "Conserva jeito, com j e sentido pertinente.",
      "optionRationales": [
        "Troca j por g no caso lexical.",
        "Duplica t sem regra.",
        "Acrescenta outra letra à palavra.",
        "Conserva jeito, com j e sentido pertinente."
      ],
      "recoverySectionIds": [
        "gj"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "ol02.q05",
      "prompt": "Qual par conserva os casos com g ensinados?",
      "options": [
        "Girafa e ferrugem.",
        "Jirafa e ferrujem.",
        "Girafa e ferrujem.",
        "Jirafa e ferrugem."
      ],
      "answer": 0,
      "explanation": "As duas formas seguem o repertório com g.",
      "optionRationales": [
        "As duas formas seguem o repertório com g.",
        "As duas trocam g por j.",
        "Troca g na segunda forma.",
        "Troca g na primeira forma."
      ],
      "recoverySectionIds": [
        "gj"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "ol02.q06",
      "prompt": "Por que o som semelhante em \"girafa\" e \"jeito\" não autoriza uma troca geral de g por j?",
      "options": [
        "Porque toda palavra deve usar g.",
        "Porque nenhuma letra representa sons na fala.",
        "Porque o Acordo eliminou j do alfabeto.",
        "Porque a grafia lexical de cada palavra precisa ser preservada; som parecido não fornece uma regra universal de letras."
      ],
      "answer": 3,
      "explanation": "Distingue som e convenção escrita.",
      "optionRationales": [
        "Jeito é um contraexemplo ensinado.",
        "Letras representam sons, sem correspondência sempre única.",
        "J permanece no alfabeto.",
        "Distingue som e convenção escrita."
      ],
      "recoverySectionIds": [
        "limites"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "ol02.q07",
      "prompt": "Qual procedimento é adequado quando uma palavra não está no repertório e a regra estudada não resolve a dúvida?",
      "options": [
        "Copiar qualquer postagem informal como norma.",
        "Consultar entrada e sentido em vocabulário ortográfico ou dicionário autorizado.",
        "Trocar todas as letras que soam parecido.",
        "Escolher a grafia com mais letras."
      ],
      "answer": 1,
      "explanation": "Confere a palavra e o contexto por referência pertinente.",
      "optionRationales": [
        "Uma ocorrência informal não prova a forma normativa.",
        "Confere a palavra e o contexto por referência pertinente.",
        "Não conserva a grafia.",
        "O tamanho não determina a correção."
      ],
      "recoverySectionIds": [
        "consulta"
      ],
      "objectiveIds": [
        "O4"
      ]
    },
    {
      "id": "ol02.q08",
      "prompt": "Um estudante escreveu \"mecher\" porque conhece \"chamar\". Qual correção do raciocínio é adequada?",
      "options": [
        "Manter mecher, pois semelhança de som garante ch.",
        "Passar a escrever todo verbo com x.",
        "Retomar mexer/chamar como formas lexicais distintas, sem transferir automaticamente a letra de uma palavra para outra.",
        "Eliminar as consoantes dos dois verbos."
      ],
      "answer": 2,
      "explanation": "Reconstrói o contraste ensinado.",
      "optionRationales": [
        "É a generalização que provocou o erro.",
        "Cria outra regra universal falsa.",
        "Reconstrói o contraste ensinado.",
        "Destrói as formas escritas."
      ],
      "recoverySectionIds": [
        "recuperacao"
      ],
      "objectiveIds": [
        "O4"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "ol02-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "ol02.q01": [
        {
          "missionId": "draft.ol02",
          "sectionId": "chx"
        }
      ],
      "ol02.q02": [
        {
          "missionId": "draft.ol02",
          "sectionId": "chx"
        }
      ],
      "ol02.q03": [
        {
          "missionId": "draft.ol02",
          "sectionId": "chx"
        }
      ],
      "ol02.q04": [
        {
          "missionId": "draft.ol02",
          "sectionId": "gj"
        }
      ],
      "ol02.q05": [
        {
          "missionId": "draft.ol02",
          "sectionId": "gj"
        }
      ],
      "ol02.q06": [
        {
          "missionId": "draft.ol02",
          "sectionId": "limites"
        }
      ],
      "ol02.q07": [
        {
          "missionId": "draft.ol02",
          "sectionId": "consulta"
        }
      ],
      "ol02.q08": [
        {
          "missionId": "draft.ol02",
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
