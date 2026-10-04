// Textos e exercícios autorais; rascunho local desativado.
export const SOURCES = [
  {
    "id": "incaper.clareza",
    "label": "Incaper - Manual de Produção Editorial: adequação da linguagem",
    "url": "https://manual-editorial.incaper.es.gov.br/capitulo_onze.htm",
    "version": "11.1D/E, orientação de clareza e ambiguidade; consultado em04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "11.1D: clareza e evitar ambiguidade;11.1E: explicar termos. Não atribuir lista lexical de sinônimos/antônimos a esta fonte."
  }
];
export const SMR_DRAFT = {
  "id": "draft.smr",
  "topicId": "draft.smr",
  "editorialKey": "SM-R",
  "candidateBlockId": "portuguese.meaning-writing",
  "title": "Semântica: revisão contextual cumulativa",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Interpretar relações de sentido e reescrever os textos fornecidos, preservando contexto, referência e informação.",
  "sourceIds": [
    "incaper.clareza"
  ],
  "sections": [
    {
      "id": "contexto",
      "heading": "1. Pistas e troca",
      "body": "SM01: a ação e palavras próximas selecionam a leitura. Uma troca deve preservar a ideia básica no contexto; banco-assento não é instituição financeira no trecho com madeira/praça.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "relacoes",
      "heading": "2. Relação e dimensão",
      "body": "SM02: clara/compreensível na explicação entendida; ampliado/reduzido na duração. Não muito clara não é automaticamente totalmente incompreensível, sobretudo se parte foi entendida.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "clareza",
      "heading": "3. Referência e intenção",
      "body": "SM03: seu/ela podem ter mais de uma referência nos casos fornecidos. Nomear a pessoa indicada na intenção esclarece sem adivinhar o autor. Preservar quantidade, tempo, ação e negação.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "ex-contexto",
      "heading": "4. Exemplo resolvido: contexto",
      "body": "Sentou no banco de madeira seleciona assento; banco aprovou conta seleciona instituição no texto fictício. Não inferir dinheiro de toda ocorrência de banco.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "ex-relacoes",
      "heading": "5. Exemplo resolvido: grau e contraste",
      "body": "Prazo ampliado/reduzido opõe duração. Instrução não muito clara, mas parcialmente entendida admite grau intermediário e não prova incompreensão total.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "ex-clareza",
      "heading": "6. Exemplo resolvido: pessoa e dia",
      "body": "Se a intenção é roteiro de Bia, explicite de Bia. Ontem, duas alunas revisaram o texto conserva o conteúdo de Duas alunas revisaram o texto ontem. Não mudar para todas/amanhã.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "retomadas",
      "heading": "7. Recuperar pelo trecho",
      "body": "[SM-01](sm-01-v1.md) · [SM-02](sm-02-v1.md) · [SM-03](sm-03-v1.md)",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "heading": "Vocabulário de apoio",
      "body": "Sentido próximo conserva uma ideia semelhante neste contexto; oposição contrasta uma dimensão informada, não todo o universo. Negação rejeita a afirmação, sem escolher automaticamente um extremo contrário. Ambiguidade é possibilidade de mais de uma leitura no trecho; reescrita para clareza explicita a leitura pretendida sem acrescentar fatos.",
      "type": "glossary",
      "sourceIds": []
    },
    {
      "id": "recuperacao",
      "heading": "Recuperar pelo trecho",
      "body": "Sublinhe ação, referência, quantidade, tempo e negação. Teste a alternativa dentro da frase e explique o que ela mantém ou muda. Se há mais de uma leitura, não escolha a intenção real sem contexto; compare uma reescrita com a intenção explicitada.",
      "type": "summary",
      "sourceIds": []
    }
  ],
  "recall": [
    "O que a frase afirma ou nega?",
    "Qual dimensão a troca mantém ou muda?",
    "A intenção da reescrita foi informada?"
  ],
  "questions": [
    {
      "id": "smr.q01",
      "prompt": "Texto: A estudante descansou sentada no banco de madeira. Que pista favorece assento?",
      "options": [
        "Descansou sentada e de madeira.",
        "Somente a quantidade de letras de banco.",
        "Uma renda não mencionada.",
        "A certeza de abertura de conta."
      ],
      "answer": 0,
      "explanation": "A ação e o material sustentam a leitura de assento.",
      "optionRationales": [
        "A ação e o material sustentam a leitura de assento.",
        "Letras não selecionam a acepção no trecho.",
        "Não há renda informada.",
        "Não há abertura de conta."
      ],
      "recoverySectionIds": [
        "contexto"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "sm01",
          "sectionId": "contexto"
        }
      ]
    },
    {
      "id": "smr.q02",
      "prompt": "No contexto de uma equipe que examinou um problema, qual troca conserva a ideia básica de analisou?",
      "options": [
        "Apagou necessariamente.",
        "Ignorou.",
        "Examinou.",
        "Criou obrigatoriamente."
      ],
      "answer": 2,
      "explanation": "Examinou aproxima-se da ação de analisar no contexto informado.",
      "optionRationales": [
        "Não há apagamento necessário.",
        "Muda a ação.",
        "Examinou aproxima-se da ação de analisar no contexto informado.",
        "Analisar não implica criar."
      ],
      "recoverySectionIds": [
        "contexto"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "sm01",
          "sectionId": "substituir"
        }
      ]
    },
    {
      "id": "smr.q03",
      "prompt": "A explicação foi clara no sentido de pôde ser compreendida. Qual troca preserva essa ideia básica?",
      "options": [
        "Foi inexistente.",
        "Foi compreensível.",
        "Foi obrigatoriamente escura.",
        "Foi incompreensível."
      ],
      "answer": 1,
      "explanation": "Compreensível conserva a ideia no contexto delimitado.",
      "optionRationales": [
        "Nega existência não negada.",
        "Compreensível conserva a ideia no contexto delimitado.",
        "O trecho não descreve cor.",
        "Muda a avaliação."
      ],
      "recoverySectionIds": [
        "relacoes"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "sm02",
          "sectionId": "proximos"
        }
      ]
    },
    {
      "id": "smr.q04",
      "prompt": "O prazo teve duração aumentada. Qual termo contrasta nessa dimensão com ampliado?",
      "options": [
        "Explicado.",
        "Escrito.",
        "Lido.",
        "Reduzido."
      ],
      "answer": 3,
      "explanation": "Reduzido indica diminuição da duração no caso.",
      "optionRationales": [
        "Explicar não indica diminuir duração.",
        "Escrever não é esse contraste.",
        "Ler não opõe duração.",
        "Reduzido indica diminuição da duração no caso."
      ],
      "recoverySectionIds": [
        "relacoes"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "sm02",
          "sectionId": "opostos"
        }
      ]
    },
    {
      "id": "smr.q05",
      "prompt": "Parte da instrução foi entendida, mas ela não foi muito clara. Que cuidado se aplica?",
      "options": [
        "Apagar a palavra não.",
        "Concluir que nada foi entendido.",
        "Não converter a negação de muito clara em incompreensão total.",
        "Afirmar compreensão total obrigatória."
      ],
      "answer": 2,
      "explanation": "A parte entendida e o grau intermediário impedem o extremo não afirmado.",
      "optionRationales": [
        "Muda o conteúdo.",
        "Contradiz a parte entendida.",
        "A parte entendida e o grau intermediário impedem o extremo não afirmado.",
        "Exagera a informação."
      ],
      "recoverySectionIds": [
        "relacoes"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "sm02",
          "sectionId": "negacao"
        }
      ]
    },
    {
      "id": "smr.q06",
      "prompt": "Intenção dada: o roteiro é de Bia. Qual expressão esclarece seu roteiro na frase com Ana e Bia?",
      "options": [
        "O roteiro de Bia.",
        "O roteiro de Ana.",
        "Todos os roteiros.",
        "O roteiro de ambas obrigatoriamente."
      ],
      "answer": 0,
      "explanation": "Identifica a referência pretendida sem acrescentar fatos.",
      "optionRationales": [
        "Identifica a referência pretendida sem acrescentar fatos.",
        "Escolhe outra pessoa.",
        "Acrescenta totalidade.",
        "Acrescenta compartilhamento."
      ],
      "recoverySectionIds": [
        "clareza"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "sm03",
          "sectionId": "referencia"
        }
      ]
    },
    {
      "id": "smr.q07",
      "prompt": "Qual informação muda ao trocar duas revisaram ontem por todas revisarão amanhã?",
      "options": [
        "Somente a cor da palavra.",
        "Só o tamanho da frase.",
        "Nenhuma informação.",
        "Quantidade e tempo/dia."
      ],
      "answer": 3,
      "explanation": "Duas/todas e passado/amanhã mudam o conteúdo.",
      "optionRationales": [
        "Cor não está em questão.",
        "Não é só tamanho.",
        "As pistas explicitadas mudaram.",
        "Duas/todas e passado/amanhã mudam o conteúdo."
      ],
      "recoverySectionIds": [
        "clareza"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "sm03",
          "sectionId": "alcance"
        }
      ]
    },
    {
      "id": "smr.q08",
      "prompt": "Você adivinhou o referente de ela sem contexto em um trecho com duas pessoas. Que recuperação é adequada?",
      "options": [
        "Declarar uma escolha aleatória como fato.",
        "Identificar as referências possíveis e usar a intenção explicitada para reescrever.",
        "Afirmar que todo pronome é proibido.",
        "Ignorar as pessoas anteriores."
      ],
      "answer": 1,
      "explanation": "O caso exige contexto para escolher a leitura pretendida.",
      "optionRationales": [
        "O texto não dá essa certeza.",
        "O caso exige contexto para escolher a leitura pretendida.",
        "Pronomes não são todos proibidos.",
        "As referências anteriores importam."
      ],
      "recoverySectionIds": [
        "recuperacao"
      ],
      "objectiveIds": [
        "O4"
      ],
      "originRefs": [
        {
          "unit": "sm03",
          "sectionId": "separar"
        }
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "smr-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "smr.q01": [
        {
          "missionId": "draft.smr",
          "sectionId": "contexto"
        }
      ],
      "smr.q02": [
        {
          "missionId": "draft.smr",
          "sectionId": "contexto"
        }
      ],
      "smr.q03": [
        {
          "missionId": "draft.smr",
          "sectionId": "relacoes"
        }
      ],
      "smr.q04": [
        {
          "missionId": "draft.smr",
          "sectionId": "relacoes"
        }
      ],
      "smr.q05": [
        {
          "missionId": "draft.smr",
          "sectionId": "relacoes"
        }
      ],
      "smr.q06": [
        {
          "missionId": "draft.smr",
          "sectionId": "clareza"
        }
      ],
      "smr.q07": [
        {
          "missionId": "draft.smr",
          "sectionId": "clareza"
        }
      ],
      "smr.q08": [
        {
          "missionId": "draft.smr",
          "sectionId": "recuperacao"
        }
      ]
    }
  }
};
export const EDITORIAL = {
  "stage": "Rascunho local fora do catálogo; parecer independente favorável, sem correções necessárias",
  "objectives": {
    "O1": "Reconhecer relação e referência no trecho.",
    "O2": "Preservar a ideia básica ou a intenção explicitada.",
    "O3": "Evitar oposição absoluta e inferência não sustentada.",
    "O4": "Retomar pistas e condição ignorada."
  },
  "recovery": {
    "objectiveId": "O4",
    "instruction": "Conferir contexto/referência/negação e comparar o conteúdo da reescrita."
  },
  "limits": [
    "Plano05/documento117, bloco portuguese.meaning-writing existente. Perfis históricos/referenceOnly, sem novo currículo/fase formal.",
    "Ensino e textos autorais; Incaper11.1D/E somente orientação de clareza/evitar ambiguidade, não tabela lexical normativa.",
    "Relações e reescritas delimitadas; não ensinar sinônimos perfeitos universais, toda polissemia/homonímia, pressuposição, todas as figuras, passiva ou colocação pronominal.",
    "Sem produção/D1/push/ativação/merge/deploy; não prova edital completo, retenção ou aceite humano."
  ]
};
export const ARITHMETIC = [];
