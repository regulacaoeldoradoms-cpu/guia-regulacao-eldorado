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
export const SM03_DRAFT = {
  "id": "draft.sm03",
  "topicId": "draft.sm03",
  "editorialKey": "SM-03",
  "candidateBlockId": "portuguese.meaning-writing",
  "title": "Ambiguidade: explicitar a leitura sem inventar fatos",
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
      "id": "entrada",
      "heading": "1. Clareza e informação",
      "body": "O Manual de Produção Editorial do Incaper orienta clareza e evitar ambiguidade em textos técnicos/científicos. Usaremos essa finalidade em frases autorais: se o trecho permite mais de uma leitura, não adivinhar intenção real. Uma reescrita deve representar a intenção explicitada no enunciado.",
      "type": "explanation",
      "sourceIds": [
        "incaper.clareza"
      ]
    },
    {
      "id": "referencia",
      "heading": "2. Seu roteiro: de quem?",
      "body": "Ana disse a Bia que seu roteiro estava pronto. Sem outro contexto, seu roteiro pode ser entendido como de Ana ou de Bia. Se o enunciado informa que é o de Bia, Ana disse a Bia que o roteiro de Bia estava pronto explicita essa leitura. Não afirmar que sempre todo seu é ambíguo nem que o original prova ambas as leituras como fatos.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "alcance",
      "heading": "3. Quantidade, tempo e negação",
      "body": "Duas alunas revisaram o texto ontem fornece quantidade, ação e tempo. Trocar por Todas as alunas revisarão o texto amanhã muda essas informações. Reescrita clara não autoriza acrescentar totalidade, futuro ou outro dia. A gramática pode estar correta e o sentido ter mudado.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "separar",
      "heading": "4. Indicar o agente na reescrita",
      "body": "A organizadora entregou o roteiro à leitora e ela fez a revisão pode deixar incerto a quem ela se refere no trecho sem contexto. Se a intenção informada é a leitora ter revisado, escreva A organizadora entregou o roteiro à leitora, e a leitora fez a revisão. Repetir o nome pode dar clareza; não ensinar a proibição de qualquer repetição.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "ex-referencia",
      "heading": "5. Exemplo resolvido: intenção de Bia",
      "body": "Intenção dada: o roteiro é de Bia. No original com seu, identifique duas referências possíveis no recorte. Use o roteiro de Bia para explicitar a pretendida. O roteiro de Ana escolheria outra leitura; os roteiros de ambas acrescentaria uma informação não fornecida.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "ex-conteudo",
      "heading": "6. Exemplo resolvido: tempo e número",
      "body": "Compare Duas alunas revisaram o texto ontem e Ontem, duas alunas revisaram o texto. A ordem muda; quantidade, ação passada, objeto e dia permanecem. Todas as alunas revisarão amanhã não preserva o conteúdo, embora pudesse formar outra frase gramatical.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "ex-agente",
      "heading": "7. Exemplo resolvido: quem revisou",
      "body": "Intenção dada: a leitora revisou. Repita a leitora para substituir ela no trecho de duas pessoas. Trocar para a organizadora revisou altera o agente pretendido. O objetivo não é eliminar pronome de todo texto, mas resolver essa referência incerta.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "limites",
      "heading": "8. Alcance da revisão",
      "body": "São casos simples de referência e preservação de informação. O trecho não revela por si só a intenção do autor nem todos os fatos possíveis. Não se cobra teoria completa de ambiguidade, relativas, passiva, pressuposição, pontuação avançada ou colocação pronominal.",
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
      "id": "sm03.q01",
      "prompt": "Sem contexto adicional, Ana disse a Bia que seu roteiro estava pronto permite qual dúvida no recorte?",
      "options": [
        "Se todos os roteiros estão obrigatoriamente prontos.",
        "Se Ana e Bia são necessariamente a mesma pessoa.",
        "Se o roteiro nunca existiu.",
        "Se o roteiro referido é de Ana ou de Bia."
      ],
      "answer": 3,
      "explanation": "Seu pode retomar mais de uma referência pessoal no trecho dado.",
      "optionRationales": [
        "Não há totalidade informada.",
        "O texto apresenta duas pessoas, sem essa identidade.",
        "A dúvida é a referência, não inexistência.",
        "Seu pode retomar mais de uma referência pessoal no trecho dado."
      ],
      "recoverySectionIds": [
        "referencia"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "sm03.q02",
      "prompt": "A intenção informada é que o roteiro de Bia estava pronto. Qual reescrita explicita essa intenção?",
      "options": [
        "Ana disse a Bia que o roteiro de Ana estava pronto.",
        "Ana disse a Bia que o roteiro de Bia estava pronto.",
        "Ana disse a Bia que todos os roteiros estavam prontos.",
        "Ana disse a Bia que o roteiro ainda não estava pronto."
      ],
      "answer": 1,
      "explanation": "O roteiro de Bia identifica a referência pretendida.",
      "optionRationales": [
        "Escolhe a outra referência.",
        "O roteiro de Bia identifica a referência pretendida.",
        "Acrescenta totalidade.",
        "Muda a afirmação para negação."
      ],
      "recoverySectionIds": [
        "ex-referencia"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "sm03.q03",
      "prompt": "Qual troca preserva quantidade, ação e tempo de Duas alunas revisaram o texto ontem?",
      "options": [
        "Ontem, nenhuma aluna revisou o texto.",
        "Amanhã, todas as alunas revisarão o texto.",
        "Ontem, duas alunas revisaram o texto.",
        "Ontem, duas alunas perderam o texto."
      ],
      "answer": 2,
      "explanation": "Só muda a ordem, mantendo os fatos dados.",
      "optionRationales": [
        "Muda quantidade e negação.",
        "Muda dia, quantidade e tempo verbal.",
        "Só muda a ordem, mantendo os fatos dados.",
        "Muda a ação."
      ],
      "recoverySectionIds": [
        "ex-conteudo"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "sm03.q04",
      "prompt": "Por que uma frase gramaticalmente possível pode falhar como reescrita equivalente?",
      "options": [
        "Pode mudar agente, quantidade, tempo, ação ou negação.",
        "Toda correção gramatical prova conteúdo idêntico.",
        "Comprimento é o único critério de equivalência.",
        "Nunca se pode trocar ordem de termos."
      ],
      "answer": 0,
      "explanation": "Preservação do sentido exige comparar informações, além da forma.",
      "optionRationales": [
        "Preservação do sentido exige comparar informações, além da forma.",
        "Forma correta não garante sentido igual.",
        "Comprimento não prova equivalência.",
        "O exemplo ensinou ordem diferente com conteúdo preservado."
      ],
      "recoverySectionIds": [
        "alcance"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "sm03.q05",
      "prompt": "No trecho com organizadora e leitora, a intenção informa que a leitora revisou. Qual retomada explicita isso?",
      "options": [
        "Ela fez a revisão, mantendo a dúvida original sem outro contexto.",
        "A leitora fez a revisão.",
        "A organizadora fez a revisão.",
        "As duas fizeram necessariamente a revisão."
      ],
      "answer": 1,
      "explanation": "Repetir a leitora identifica o agente pretendido.",
      "optionRationales": [
        "Não resolve a referência incerta no recorte.",
        "Repetir a leitora identifica o agente pretendido.",
        "Altera o agente pretendido.",
        "Acrescenta participação conjunta."
      ],
      "recoverySectionIds": [
        "ex-agente"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "sm03.q06",
      "prompt": "Qual conclusão respeita a análise de seu roteiro no trecho sem contexto adicional?",
      "options": [
        "Todo seu é ambíguo em qualquer frase.",
        "As duas pessoas têm necessariamente o mesmo roteiro.",
        "O original prova todos os roteiros prontos.",
        "O trecho admite leituras diferentes; a intenção real precisa de contexto."
      ],
      "answer": 3,
      "explanation": "Possibilidade de leitura não é prova de intenção real nem de todos os fatos.",
      "optionRationales": [
        "Outros contextos podem esclarecer seu.",
        "Não há compartilhamento afirmado.",
        "Não há totalidade.",
        "Possibilidade de leitura não é prova de intenção real nem de todos os fatos."
      ],
      "recoverySectionIds": [
        "limites"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "sm03.q07",
      "prompt": "Você reescreveu duas alunas revisaram ontem como todas revisarão amanhã. O que deve conferir?",
      "options": [
        "Quantidade, tempo verbal e dia, além da ação.",
        "Só se amanhã tem mais letras.",
        "Só a primeira palavra.",
        "A proibição de qualquer ordem diferente."
      ],
      "answer": 0,
      "explanation": "A reescrita mudou informações explicitadas no original.",
      "optionRationales": [
        "A reescrita mudou informações explicitadas no original.",
        "Letras não resolvem conteúdo.",
        "As pistas estão em vários termos.",
        "Ordem pode mudar sem essas alterações."
      ],
      "recoverySectionIds": [
        "ex-conteudo"
      ],
      "objectiveIds": [
        "O4"
      ]
    },
    {
      "id": "sm03.q08",
      "prompt": "Qual escolha pode contribuir para clareza no caso de duas referências possíveis?",
      "options": [
        "Substituir todas as pessoas por ela sem contexto.",
        "Proibir qualquer repetição, mesmo que aumente a dúvida.",
        "Repetir o nome da pessoa indicada pela intenção do enunciado.",
        "Escolher uma referência ao acaso e declará-la fato."
      ],
      "answer": 2,
      "explanation": "Nomear a pessoa resolve o caso sem acrescentar uma intenção inventada.",
      "optionRationales": [
        "Isso pode manter ou ampliar a dúvida.",
        "A clareza pode justificar repetir.",
        "Nomear a pessoa resolve o caso sem acrescentar uma intenção inventada.",
        "O trecho sozinho não autoriza adivinhar intenção."
      ],
      "recoverySectionIds": [
        "separar"
      ],
      "objectiveIds": [
        "O1"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "sm03-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "sm03.q01": [
        {
          "missionId": "draft.sm03",
          "sectionId": "referencia"
        }
      ],
      "sm03.q02": [
        {
          "missionId": "draft.sm03",
          "sectionId": "ex-referencia"
        }
      ],
      "sm03.q03": [
        {
          "missionId": "draft.sm03",
          "sectionId": "ex-conteudo"
        }
      ],
      "sm03.q04": [
        {
          "missionId": "draft.sm03",
          "sectionId": "alcance"
        }
      ],
      "sm03.q05": [
        {
          "missionId": "draft.sm03",
          "sectionId": "ex-agente"
        }
      ],
      "sm03.q06": [
        {
          "missionId": "draft.sm03",
          "sectionId": "limites"
        }
      ],
      "sm03.q07": [
        {
          "missionId": "draft.sm03",
          "sectionId": "ex-conteudo"
        }
      ],
      "sm03.q08": [
        {
          "missionId": "draft.sm03",
          "sectionId": "separar"
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
