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
export const SMCHEFE_DRAFT = {
  "id": "draft.smchefe",
  "topicId": "draft.smchefe",
  "editorialKey": "SM-CHEFE",
  "candidateBlockId": "portuguese.meaning-writing",
  "title": "Semântica: Chefe contextual introdutório",
  "contentVersion": 1,
  "kind": "boss",
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
      "id": "ex-chefe",
      "heading": "4. Exemplo resolvido: pistas e reescrita",
      "body": "Na frase Descansou no banco de madeira, o contexto seleciona assento. Na frase com duas pessoas e seu, não escolha a referência real sem informação adicional. Use o nome que o enunciado indicar e preserve ação/tempo.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "retomadas",
      "heading": "5. Retomar o ensino",
      "body": "[SM-01](sm-01-v1.md) · [SM-02](sm-02-v1.md) · [SM-03](sm-03-v1.md) · [SM-R](sm-r-v1.md)",
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
      "id": "smchefe.q01",
      "prompt": "O texto informa que a leitora se sentou em um banco feito de madeira na praça. Qual leitura do termo é sustentada?",
      "options": [
        "Prazo de crédito.",
        "Instituição que aprovou uma conta.",
        "Assento.",
        "Garantia de renda."
      ],
      "answer": 2,
      "explanation": "Sentar/material/praça selecionam assento no caso.",
      "optionRationales": [
        "Não há prazo de crédito.",
        "Não há ação institucional informada.",
        "Sentar/material/praça selecionam assento no caso.",
        "Não há renda informada."
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
      ],
      "groupId": "G1"
    },
    {
      "id": "smchefe.q02",
      "prompt": "Texto: O acordo foi uma ponte entre as posições; não havia rio nem construção. Qual leitura cabe?",
      "options": [
        "Aproximação figurada entre posições.",
        "Obra física obrigatoriamente construída.",
        "Garantia de que todas as divergências desapareceram.",
        "Prova de que todo enunciado figurado é mentira."
      ],
      "answer": 0,
      "explanation": "O contexto delimita a imagem de aproximação sem obra física.",
      "optionRationales": [
        "O contexto delimita a imagem de aproximação sem obra física.",
        "O contexto exclui construção.",
        "Aproximar não prova acordo total.",
        "Figurado não equivale automaticamente a mentira."
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
          "sectionId": "literal"
        }
      ],
      "groupId": "G1"
    },
    {
      "id": "smchefe.q03",
      "prompt": "A frase informa uma equipe que analisou uma dificuldade. Que substituição preserva a ideia básica nesse contexto?",
      "options": [
        "Perdeu qualquer capacidade de ler.",
        "Ignorou a dificuldade.",
        "Criou a dificuldade necessariamente.",
        "Examinou a dificuldade."
      ],
      "answer": 3,
      "explanation": "Examinou conserva a ideia básica de análise no trecho.",
      "optionRationales": [
        "Não há tal perda informada.",
        "Muda a ação.",
        "Não há criação necessária.",
        "Examinou conserva a ideia básica de análise no trecho."
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
      ],
      "groupId": "G2"
    },
    {
      "id": "smchefe.q04",
      "prompt": "A avaliação foi clara, no contexto que informa entendimento. Qual troca mantém a ideia básica?",
      "options": [
        "A avaliação foi confusa.",
        "A avaliação foi compreensível.",
        "A avaliação foi apagada.",
        "A avaliação foi azul obrigatoriamente."
      ],
      "answer": 1,
      "explanation": "Compreensível preserva a ideia de entendimento.",
      "optionRationales": [
        "Muda a avaliação.",
        "Compreensível preserva a ideia de entendimento.",
        "Acrescenta apagamento.",
        "Cor não é a dimensão do trecho."
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
      ],
      "groupId": "G2"
    },
    {
      "id": "smchefe.q05",
      "prompt": "A duração do prazo foi ampliada. Qual escolha apresenta contraste na mesma dimensão?",
      "options": [
        "Prazo ilustrado.",
        "Duração reduzida.",
        "Pessoa elogiada.",
        "Texto corrigido."
      ],
      "answer": 1,
      "explanation": "Reduzir duração contrasta com ampliá-la.",
      "optionRationales": [
        "Ilustrar não diminui necessariamente duração.",
        "Reduzir duração contrasta com ampliá-la.",
        "Pessoa não é a dimensão dada.",
        "Corrigir texto não indica duração reduzida."
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
      ],
      "groupId": "G3"
    },
    {
      "id": "smchefe.q06",
      "prompt": "A explicação não foi muito clara; uma parte foi compreendida. Qual conclusão deve ser evitada?",
      "options": [
        "Que o contexto não afirmou clareza total.",
        "Que parte foi compreendida.",
        "Que o grau muito clara foi negado.",
        "Que ela foi totalmente incompreensível."
      ],
      "answer": 3,
      "explanation": "Totalmente incompreensível contradiria a parte entendida e excederia a negação.",
      "optionRationales": [
        "Isso respeita o limite do trecho.",
        "Isso está explicitado.",
        "Isso preserva a negação.",
        "Totalmente incompreensível contradiria a parte entendida e excederia a negação."
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
          "sectionId": "ex-negacao"
        }
      ],
      "groupId": "G3"
    },
    {
      "id": "smchefe.q07",
      "prompt": "Lia disse a Eva que seu texto estava pronto; a intenção dada é texto de Eva. Qual reescrita corresponde?",
      "options": [
        "Lia disse a Eva que o texto de Eva estava pronto.",
        "Lia disse a Eva que o texto de Lia estava pronto.",
        "Lia disse a Eva que ambos os textos estavam prontos.",
        "Lia disse a Eva que nenhum texto estava pronto."
      ],
      "answer": 0,
      "explanation": "Nomear Eva explicita a referência pretendida.",
      "optionRationales": [
        "Nomear Eva explicita a referência pretendida.",
        "Escolhe outra referência.",
        "Acrescenta prontidão conjunta.",
        "Nega a informação pretendida."
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
      ],
      "groupId": "G4"
    },
    {
      "id": "smchefe.q08",
      "prompt": "A instrutora entregou o texto à revisora e ela o revisou; intenção: a revisora fez a revisão. Qual substituição resolve a referência?",
      "options": [
        "Ambas revisaram obrigatoriamente o texto.",
        "A instrutora revisou o texto.",
        "A revisora revisou o texto.",
        "Ela revisou o texto, mantendo a dúvida sem contexto."
      ],
      "answer": 2,
      "explanation": "Nomeia o agente indicado pela intenção.",
      "optionRationales": [
        "Acrescenta participação conjunta.",
        "Muda o agente.",
        "Nomeia o agente indicado pela intenção.",
        "Não resolve a dúvida no caso dado."
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
          "sectionId": "separar"
        }
      ],
      "groupId": "G4"
    },
    {
      "id": "smchefe.q09",
      "prompt": "Original: Três leitoras examinaram o roteiro hoje. Qual reescrita conserva as informações fornecidas?",
      "options": [
        "Hoje, três leitoras apagaram o roteiro.",
        "Amanhã, todas as leitoras examinarão o roteiro.",
        "Hoje, nenhuma leitora examinou o roteiro.",
        "Hoje, três leitoras examinaram o roteiro."
      ],
      "answer": 3,
      "explanation": "Muda só a ordem, mantendo dia/quantidade/ação/objeto.",
      "optionRationales": [
        "Muda ação.",
        "Muda dia, quantidade e tempo.",
        "Muda quantidade e negação.",
        "Muda só a ordem, mantendo dia/quantidade/ação/objeto."
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
          "sectionId": "ex-conteudo"
        }
      ],
      "groupId": "G5"
    },
    {
      "id": "smchefe.q10",
      "prompt": "Qual critério identifica mudança de conteúdo em uma reescrita gramaticalmente possível?",
      "options": [
        "Contar só as letras.",
        "Comparar agente, ação, quantidade, tempo e negação do trecho.",
        "Assumir equivalência de toda frase correta.",
        "Proibir qualquer deslocamento de termos."
      ],
      "answer": 1,
      "explanation": "Essas informações podem mudar apesar de a gramática ser possível.",
      "optionRationales": [
        "Letras não provam equivalência.",
        "Essas informações podem mudar apesar de a gramática ser possível.",
        "Forma correta não garante conteúdo igual.",
        "Há deslocamentos que preservam o conteúdo."
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
      ],
      "groupId": "G5"
    },
    {
      "id": "smchefe.q11",
      "prompt": "Qual afirmação conserva os limites dos sentidos próximos ensinados?",
      "options": [
        "A palavra banco nunca tem sentidos diferentes.",
        "Toda palavra próxima é intercambiável universalmente.",
        "A troca é contextual e não autoriza equivalência em qualquer construção.",
        "Sentido figurado prova falsidade automática."
      ],
      "answer": 2,
      "explanation": "Contexto e nuances precisam ser respeitados.",
      "optionRationales": [
        "Os textos mostraram usos diferentes.",
        "É a generalização evitada.",
        "Contexto e nuances precisam ser respeitados.",
        "A figura pode comunicar uma ideia sem relatar fato físico."
      ],
      "recoverySectionIds": [
        "contexto"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "sm01",
          "sectionId": "limites"
        }
      ],
      "groupId": "G6"
    },
    {
      "id": "smchefe.q12",
      "prompt": "Ao resolver uma referência incerta, você acrescentou ambos sem a intenção informar isso. Que recuperação é pertinente?",
      "options": [
        "Retomar as leituras possíveis e escolher só a referência indicada pelo enunciado.",
        "Afirmar que ambos é sempre equivalente a seu.",
        "Apagar toda referência pessoal.",
        "Inventar propriedade conjunta para facilitar."
      ],
      "answer": 0,
      "explanation": "Ambos acrescenta conteúdo; a intenção delimitada deve orientar a reescrita.",
      "optionRationales": [
        "Ambos acrescenta conteúdo; a intenção delimitada deve orientar a reescrita.",
        "Não é equivalência universal.",
        "Apagar não esclarece a intenção.",
        "Isso inventaria informação."
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
          "sectionId": "ex-referencia"
        }
      ],
      "groupId": "G6"
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "smchefe-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "smchefe.q01": [
        {
          "missionId": "draft.smchefe",
          "sectionId": "contexto"
        },
        {
          "missionId": "draft.sm01",
          "sectionId": "contexto"
        }
      ],
      "smchefe.q02": [
        {
          "missionId": "draft.smchefe",
          "sectionId": "contexto"
        },
        {
          "missionId": "draft.sm01",
          "sectionId": "literal"
        }
      ],
      "smchefe.q03": [
        {
          "missionId": "draft.smchefe",
          "sectionId": "contexto"
        },
        {
          "missionId": "draft.sm01",
          "sectionId": "substituir"
        }
      ],
      "smchefe.q04": [
        {
          "missionId": "draft.smchefe",
          "sectionId": "relacoes"
        },
        {
          "missionId": "draft.sm02",
          "sectionId": "proximos"
        }
      ],
      "smchefe.q05": [
        {
          "missionId": "draft.smchefe",
          "sectionId": "relacoes"
        },
        {
          "missionId": "draft.sm02",
          "sectionId": "opostos"
        }
      ],
      "smchefe.q06": [
        {
          "missionId": "draft.smchefe",
          "sectionId": "relacoes"
        },
        {
          "missionId": "draft.sm02",
          "sectionId": "ex-negacao"
        }
      ],
      "smchefe.q07": [
        {
          "missionId": "draft.smchefe",
          "sectionId": "clareza"
        },
        {
          "missionId": "draft.sm03",
          "sectionId": "referencia"
        }
      ],
      "smchefe.q08": [
        {
          "missionId": "draft.smchefe",
          "sectionId": "clareza"
        },
        {
          "missionId": "draft.sm03",
          "sectionId": "separar"
        }
      ],
      "smchefe.q09": [
        {
          "missionId": "draft.smchefe",
          "sectionId": "clareza"
        },
        {
          "missionId": "draft.sm03",
          "sectionId": "ex-conteudo"
        }
      ],
      "smchefe.q10": [
        {
          "missionId": "draft.smchefe",
          "sectionId": "clareza"
        },
        {
          "missionId": "draft.sm03",
          "sectionId": "alcance"
        }
      ],
      "smchefe.q11": [
        {
          "missionId": "draft.smchefe",
          "sectionId": "contexto"
        },
        {
          "missionId": "draft.sm01",
          "sectionId": "limites"
        }
      ],
      "smchefe.q12": [
        {
          "missionId": "draft.smchefe",
          "sectionId": "recuperacao"
        },
        {
          "missionId": "draft.sm03",
          "sectionId": "ex-referencia"
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
  ],
  "groups": [
    {
      "id": "G1",
      "label": "Contexto e figura",
      "units": [
        "sm01"
      ]
    },
    {
      "id": "G2",
      "label": "Proximidade contextual",
      "units": [
        "sm01",
        "sm02"
      ]
    },
    {
      "id": "G3",
      "label": "Oposição e grau",
      "units": [
        "sm02"
      ]
    },
    {
      "id": "G4",
      "label": "Referência e intenção",
      "units": [
        "sm03"
      ]
    },
    {
      "id": "G5",
      "label": "Preservação de informação",
      "units": [
        "sm03"
      ]
    },
    {
      "id": "G6",
      "label": "Limites e recuperação",
      "units": [
        "sm01",
        "sm03"
      ]
    }
  ]
};
export const ARITHMETIC = [];
