// Ensino e exercícios autorais; candidato editorial local desativado.
export const SOURCES = [
  {
    "id": "acordo.ol.letras",
    "label": "Acordo Ortográfico — letras e grafias do recorte",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2008/decreto/d6583.htm",
    "checkedAt": "2026-10-04",
    "version": "Decreto nº 6.583/2008, Anexo I — texto oficial consultado",
    "locator": "Anexo I, Base I, 1º/Obs.1 e 2º; Base II, 1º a e 2º a; somente alfabeto, dígrafos simples e h lexical"
  }
];
export const OL01_DRAFT = {
  "id": "draft.ol01",
  "topicId": "draft.ol01",
  "editorialKey": "OL-01",
  "candidateBlockId": "portuguese.spelling",
  "title": "Letras, sons e h: ler antes de revisar",
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
      "heading": "1. O som não é uma receita de escrita",
      "body": "Frase autoral: Hoje ele encontrou a chave. A pronúncia ajuda a reconhecer palavras, mas não determina sozinha cada letra. O h inicial de hoje não corresponde a um som pronunciado no uso usual brasileiro; em chave, ch representa um som. Aprender grafia exige olhar a forma e o contexto, não somar uma letra para cada som.",
      "type": "explanation",
      "sourceIds": [
        "acordo.ol.letras"
      ]
    },
    {
      "id": "alfabeto",
      "heading": "2. Letra e sinal gráfico",
      "body": "O alfabeto tem 26 letras, incluindo k, w e y. Uma palavra acentuada não acrescenta uma nova letra ao alfabeto: a continua sendo a letra a em á. O ç é c com cedilha, usado na escrita, e não uma 27ª letra. O Acordo prevê usos especiais de k/w/y, como símbolos e nomes de origem estrangeira; pertencer ao alfabeto não torna livre sua substituição em qualquer palavra.",
      "type": "explanation",
      "sourceIds": [
        "acordo.ol.letras"
      ]
    },
    {
      "id": "digrafos",
      "heading": "3. Duas letras, um som nos casos dados",
      "body": "Em chave, ch representa um som consonantal; em folha, lh; em ninho, nh. São dígrafos consonantais. Duas letras lado a lado não formam automaticamente um dígrafo: em prato, p e r correspondem a sons consonantais distintos. Não é necessário contar todos os sons dessas palavras para aplicar o contraste. Outros grupos, como gu/qu, dependem do caso e ficam fora desta cobrança.",
      "type": "explanation",
      "sourceIds": [
        "acordo.ol.letras"
      ]
    },
    {
      "id": "h",
      "heading": "4. H inicial: grafia lexical",
      "body": "Hoje, hora e homem são formas com h inicial. No uso usual brasileiro apresentado, esse h não tem som próprio; isso não autoriza apagá-lo. Erva é escrita sem h. O Acordo registra esses casos, inclusive a supressão consagrada em erva. Não há aqui a regra de que toda palavra iniciada por vogal deva ganhar h, nem de que todo h deva sumir.",
      "type": "explanation",
      "sourceIds": [
        "acordo.ol.letras"
      ]
    },
    {
      "id": "ex-hoje",
      "heading": "5. Exemplo resolvido: hoje",
      "body": "Na frase O atendimento começa hoje, a palavra indica o dia atual. Conserva-se hoje, com h inicial, mesmo sem ouvir um som correspondente ao h. Oje não é a forma padrão do caso ensinado. O acerto não se justifica por uma regra de que todo início em o recebe h.",
      "type": "worked-example",
      "sourceIds": [
        "acordo.ol.letras"
      ]
    },
    {
      "id": "ex-digrafo",
      "heading": "6. Exemplo resolvido: chave e prato",
      "body": "Em A chave ficou perto do prato, ch é o dígrafo consonantal ensinado. Em prato, pr tem dois sons consonantais no caso dado. A presença de duas letras é uma pista insuficiente para decidir: deve-se observar o que elas representam.",
      "type": "worked-example",
      "sourceIds": [
        "acordo.ol.letras"
      ]
    },
    {
      "id": "ex-erva",
      "heading": "7. Exemplo resolvido: erva",
      "body": "Em A erva cresceu no vaso, a forma ensinada é erva, sem h. A história registrada pelo Acordo não pode ser aplicada como apagamento geral do h: hoje e hora continuam com ele. Guardar o contraste ajuda a evitar uma generalização falsa.",
      "type": "worked-example",
      "sourceIds": [
        "acordo.ol.letras"
      ]
    },
    {
      "id": "limites",
      "heading": "8. Não fazer da contagem uma regra",
      "body": "Não cobraremos transcrição fonética, todos os dígrafos, regras de h em compostos ou nomes estrangeiros. O alvo é distinguir letra e som, reconhecer os três dígrafos simples e preservar h inicial nos casos ensinados. O contexto e a referência lexical orientam a correção.",
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
      "id": "ol01.q01",
      "prompt": "Qual análise de ch na frase \"A chave abriu a porta\" corresponde ao ensino?",
      "options": [
        "Cada letra representa obrigatoriamente um som separado.",
        "Duas letras representam um som consonantal nesse caso.",
        "Ch é uma letra adicional do alfabeto.",
        "Toda dupla de letras é um dígrafo."
      ],
      "answer": 1,
      "explanation": "É o dígrafo ensinado em chave.",
      "optionRationales": [
        "Não corresponde ao caso ch dado.",
        "É o dígrafo ensinado em chave.",
        "O alfabeto não contém ch como letra única.",
        "Pr em prato mostra que a regra universal falha."
      ],
      "recoverySectionIds": [
        "digrafos"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "ol01.q02",
      "prompt": "Qual revisão conserva a grafia ensinada em \"O serviço começa ___\"?",
      "options": [
        "Oje, pois só se escreve o que se ouve.",
        "Hhoje, pois um h sem som deve ser duplicado.",
        "Hoji, pois toda vogal final deve ser i.",
        "Hoje, com h inicial, para indicar o dia atual."
      ],
      "answer": 3,
      "explanation": "Conserva palavra e sentido no contexto.",
      "optionRationales": [
        "Apaga uma letra da forma padrão ensinada.",
        "Não há essa duplicação na grafia.",
        "Cria uma substituição não ensinada.",
        "Conserva palavra e sentido no contexto."
      ],
      "recoverySectionIds": [
        "h"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "ol01.q03",
      "prompt": "Qual afirmação distingue corretamente o alfabeto e a cedilha?",
      "options": [
        "O alfabeto tem 26 letras; ç é c com cedilha, não uma letra adicional.",
        "K, w e y não pertencem ao alfabeto.",
        "Ç é a 27ª letra obrigatória.",
        "Cada letra acentuada cria uma nova letra do alfabeto."
      ],
      "answer": 0,
      "explanation": "Distingue letra e sinal usado na escrita.",
      "optionRationales": [
        "Distingue letra e sinal usado na escrita.",
        "As três integram as 26 letras.",
        "A cedilha não cria uma letra adicional.",
        "O acento é um sinal, não uma nova letra."
      ],
      "recoverySectionIds": [
        "alfabeto"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "ol01.q04",
      "prompt": "Qual comparação entre \"folha\" e \"prato\" respeita os casos ensinados?",
      "options": [
        "Lh e pr são letras únicas do alfabeto.",
        "Lh e pr sempre representam dois sons.",
        "Lh é dígrafo no caso dado; pr corresponde a dois sons consonantais em prato.",
        "Pr é dígrafo apenas porque tem duas letras."
      ],
      "answer": 2,
      "explanation": "Usa o contraste de representação sonora.",
      "optionRationales": [
        "São combinações de letras, não letras únicas.",
        "Lh é o dígrafo ensinado.",
        "Usa o contraste de representação sonora.",
        "Duas letras não bastam para definir dígrafo."
      ],
      "recoverySectionIds": [
        "digrafos"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "ol01.q05",
      "prompt": "Qual grafia corresponde ao caso lexical ensinado para a planta da frase \"A ___ cresceu\"?",
      "options": [
        "Erhva.",
        "Herva.",
        "Hher va.",
        "Erva."
      ],
      "answer": 3,
      "explanation": "É a forma ensinada sem h.",
      "optionRationales": [
        "Insere h em posição não ensinada.",
        "Reintroduz h no caso em que foi suprimido.",
        "Cria letras e separação sem fundamento.",
        "É a forma ensinada sem h."
      ],
      "recoverySectionIds": [
        "ex-erva"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "ol01.q06",
      "prompt": "Por que não se deve escrever \"ora\" no lugar de \"hora\" quando se quer o nome da unidade de tempo ensinada?",
      "options": [
        "Porque hora é a grafia lexical desse nome; a ausência de som do h não autoriza apagá-lo.",
        "Porque toda palavra que começa por o leva h.",
        "Porque h sempre recebe acento agudo.",
        "Porque as duas formas têm o mesmo sentido em qualquer frase."
      ],
      "answer": 0,
      "explanation": "Preserva a palavra e seu sentido específico.",
      "optionRationales": [
        "Preserva a palavra e seu sentido específico.",
        "A regra universal não foi ensinada e é falsa.",
        "H não recebe esse acento.",
        "A mudança de grafia não preserva qualquer sentido automaticamente."
      ],
      "recoverySectionIds": [
        "h"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "ol01.q07",
      "prompt": "Qual grupo contém apenas os dígrafos consonantais exemplificados nesta aula?",
      "options": [
        "Pr, ch e k.",
        "K, w e y.",
        "Ch, lh e nh.",
        "Toda dupla de vogais."
      ],
      "answer": 2,
      "explanation": "São os três grupos simples ensinados.",
      "optionRationales": [
        "Pr não é dígrafo em prato e k é letra.",
        "São letras isoladas.",
        "São os três grupos simples ensinados.",
        "Não é o recorte nem a definição dada."
      ],
      "recoverySectionIds": [
        "digrafos"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "ol01.q08",
      "prompt": "Um estudante retirou o h de \"hoje\" por não ouvi-lo. Qual retomada corrige o raciocínio?",
      "options": [
        "Apagar todo h inicial da língua.",
        "Rever hoje/hora/erva e distinguir grafia convencional de correspondência direta entre letra e som.",
        "Trocar o h por qualquer consoante audível.",
        "Contar só as letras das alternativas."
      ],
      "answer": 1,
      "explanation": "Reconstrói o contraste e a forma ensinada.",
      "optionRationales": [
        "Generaliza o erro.",
        "Reconstrói o contraste e a forma ensinada.",
        "Não conserva a palavra.",
        "Não explica a convenção do caso."
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
    "editorialPass": "ol01-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "ol01.q01": [
        {
          "missionId": "draft.ol01",
          "sectionId": "digrafos"
        }
      ],
      "ol01.q02": [
        {
          "missionId": "draft.ol01",
          "sectionId": "h"
        }
      ],
      "ol01.q03": [
        {
          "missionId": "draft.ol01",
          "sectionId": "alfabeto"
        }
      ],
      "ol01.q04": [
        {
          "missionId": "draft.ol01",
          "sectionId": "digrafos"
        }
      ],
      "ol01.q05": [
        {
          "missionId": "draft.ol01",
          "sectionId": "ex-erva"
        }
      ],
      "ol01.q06": [
        {
          "missionId": "draft.ol01",
          "sectionId": "h"
        }
      ],
      "ol01.q07": [
        {
          "missionId": "draft.ol01",
          "sectionId": "digrafos"
        }
      ],
      "ol01.q08": [
        {
          "missionId": "draft.ol01",
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
