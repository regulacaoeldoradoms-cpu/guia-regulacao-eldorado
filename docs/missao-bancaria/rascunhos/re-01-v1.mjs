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
export const RE01_DRAFT = {
  "id": "draft.re01",
  "topicId": "draft.re01",
  "editorialKey": "RE-01",
  "candidateBlockId": "portuguese.meaning-writing",
  "title": "Reescrita: conferir conteúdo e forma separadamente",
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
      "heading": "1. Duas perguntas",
      "body": "Uma reescrita pode ser gramaticalmente possível e alterar a mensagem; pode também conservar uma ideia básica mas não seguir o padrão formal pedido. Separe as perguntas: o conteúdo dado foi preservado? A forma segue a condição do exercício? Retomamos SM/CN/CP, sem ensinar toda transformação sintática.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "conteudo",
      "heading": "2. Conferir informações",
      "body": "A turma não revisou o roteiro ontem informa agente, negação, ação, objeto e dia. Ontem, a turma não revisou o roteiro conserva essas informações e muda a ordem. A turma revisará o roteiro amanhã muda negação, tempo e dia, apesar de poder ser uma frase gramatical.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "forma",
      "heading": "3. Conferir padrão explicitado",
      "body": "No padrão formal de CP02, início de oração sem atrator usa Lembro-me do aviso. Me lembro do aviso pode conservar a ideia básica na fala, mas não segue a orientação formal de início adotada naquele exercício. Não confundir diferença de registro com inexistência de sentido ou condenação de toda fala.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "numero",
      "heading": "4. Alteração pedida não é equivalência total",
      "body": "Se o enunciado pede passar A leitora atenta revisou o texto para duas leitoras, a resposta será As leitoras atentas revisaram o texto, preservando ação/objeto e ajustando artigo/adjetivo/verbo. A quantidade foi alterada de propósito; não chamar as frases de totalmente equivalentes em todos os fatos.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "ex-conteudo",
      "heading": "5. Exemplo resolvido: posição de ontem",
      "body": "Original: A turma não revisou o roteiro ontem. Reescrita: Ontem, a turma não revisou o roteiro. Marque os mesmos agente/não/revisou/roteiro/ontem. Deslocar ontem aqui não muda a informação temporal; não extrair obrigação de que qualquer deslocamento seja neutro.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "ex-forma",
      "heading": "6. Exemplo resolvido: padrão formal",
      "body": "Pedido: início formal sem atrator com lembro/me. Lembro-me do aviso segue CP02. Me lembro do aviso conserva a ideia básica no exemplo de fala, mas o pedido formal distingue as opções. A correção aplica uma condição declarada, não um juízo sobre pessoas.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "ex-numero",
      "heading": "7. Exemplo resolvido: duas leitoras",
      "body": "A leitora atenta revisou o texto passa para As leitoras atentas revisaram o texto sob o pedido de plural. Ajuste a/as, leitora/leitoras, atenta/atentas e revisou/revisaram. O texto continua singular porque o pedido não mandou multiplicar o objeto. A mudança numérica do sujeito é intencional.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "limites",
      "heading": "8. O que não está concluído",
      "body": "Não ensina toda voz passiva, discurso indireto, relativos, nominalização, elipse ou período composto. Equivalência contextual e correção formal são critérios distintos. Toda mudança solicitada deve ser identificada, sem apagar negação/quantidade por economia.",
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
      "id": "re01.q01",
      "prompt": "Qual reescrita mantém o conteúdo de A turma não revisou o roteiro ontem no caso fornecido?",
      "options": [
        "A turma revisará o roteiro amanhã.",
        "Ontem, a turma não revisou o roteiro.",
        "A turma revisou o roteiro ontem.",
        "Todas as turmas revisaram os roteiros amanhã."
      ],
      "answer": 1,
      "explanation": "Muda a ordem, conservando agente/negação/ação/objeto/dia.",
      "optionRationales": [
        "Muda tempo, dia e negação.",
        "Muda a ordem, conservando agente/negação/ação/objeto/dia.",
        "Apaga a negação.",
        "Muda quantidade, objeto e tempo."
      ],
      "recoverySectionIds": [
        "conteudo"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "re01.q02",
      "prompt": "Por que uma frase gramaticalmente possível pode falhar como equivalente?",
      "options": [
        "Toda frase longa é equivalente a outra.",
        "Gramática possível garante equivalência total.",
        "O número de letras é o único critério.",
        "Pode mudar informações afirmadas ou negadas."
      ],
      "answer": 3,
      "explanation": "Conteúdo precisa ser conferido separadamente da forma.",
      "optionRationales": [
        "Comprimento não garante equivalência.",
        "São critérios diferentes.",
        "Letras não provam conteúdo.",
        "Conteúdo precisa ser conferido separadamente da forma."
      ],
      "recoverySectionIds": [
        "entrada"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "re01.q03",
      "prompt": "No pedido de CP02 para início formal sem atrator com lembro/me, qual forma segue a orientação adotada?",
      "options": [
        "Lembro-me do aviso.",
        "Me lembro do aviso, iniciando com átono.",
        "Me-lembro do aviso.",
        "Lembro me do aviso, como ênclise sem hífen."
      ],
      "answer": 0,
      "explanation": "Verbo antes de átono com hífen segue o caso formal ensinado.",
      "optionRationales": [
        "Verbo antes de átono com hífen segue o caso formal ensinado.",
        "Não segue a orientação de início dada.",
        "Não é a ligação de ênclise ensinada.",
        "Falta o hífen de ligação da ênclise."
      ],
      "recoverySectionIds": [
        "forma"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "re01.q04",
      "prompt": "O pedido muda uma leitora para duas, mantendo ação e objeto. Qual resposta ajusta a concordância?",
      "options": [
        "A leitoras atentos revisou os textos obrigatoriamente.",
        "As leitora atenta revisou o texto.",
        "As leitoras atentas revisaram o texto.",
        "As leitoras atentas revisou o texto."
      ],
      "answer": 2,
      "explanation": "Artigo/nome/adjetivo/verbo acompanham o sujeito plural; objeto permanece no pedido.",
      "optionRationales": [
        "Não segue concordância e muda objeto sem pedido.",
        "Não ajusta número dos termos.",
        "Artigo/nome/adjetivo/verbo acompanham o sujeito plural; objeto permanece no pedido.",
        "O verbo não acompanha o sujeito plural dado."
      ],
      "recoverySectionIds": [
        "numero"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "re01.q05",
      "prompt": "Ao mudar uma leitora para duas conforme o enunciado, as frases ficam equivalentes em toda quantidade?",
      "options": [
        "Não: toda informação deve obrigatoriamente ser apagada.",
        "Sim: singular e plural sempre dizem a mesma quantidade.",
        "Sim: só o objeto pode mudar quantidade.",
        "Não: a quantidade mudou de propósito conforme o pedido."
      ],
      "answer": 3,
      "explanation": "A mudança pedida deve ser reconhecida, não ocultada.",
      "optionRationales": [
        "Não há pedido de apagar toda informação.",
        "Singular/plural diferem na hipótese dada.",
        "Sujeito também pode mudar quantidade.",
        "A mudança pedida deve ser reconhecida, não ocultada."
      ],
      "recoverySectionIds": [
        "ex-numero"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "re01.q06",
      "prompt": "Qual cuidado respeita a comparação formal e fala de Me lembro / Lembro-me no exemplo?",
      "options": [
        "Declarar a fala inteira sem sentido.",
        "Distinguir orientação formal pedida da ideia básica e da ocorrência na fala.",
        "Dispensar a condição formal do exercício.",
        "Afirmar equivalência de todas as regras em todo registro."
      ],
      "answer": 1,
      "explanation": "A condição formal e a ideia comunicada são perguntas distintas.",
      "optionRationales": [
        "Não é conclusão permitida.",
        "A condição formal e a ideia comunicada são perguntas distintas.",
        "A condição foi explicitada.",
        "Registros e condições não são todos iguais."
      ],
      "recoverySectionIds": [
        "ex-forma"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "re01.q07",
      "prompt": "Você apagou não para encurtar a frase original. Que recuperação é pertinente?",
      "options": [
        "Afirmar que não é sempre redundante.",
        "Contar apenas letras.",
        "Conferir a negação e comparar o que passou a ser afirmado.",
        "Trocar sujeito sem olhar conteúdo."
      ],
      "answer": 2,
      "explanation": "Retirar a palavra ‘não’ muda a mensagem negativa.",
      "optionRationales": [
        "Não nega a afirmação neste caso.",
        "Letras não resolvem essa mudança.",
        "Retirar a palavra ‘não’ muda a mensagem negativa.",
        "Mudar sujeito não recupera a negação."
      ],
      "recoverySectionIds": [
        "ex-conteudo"
      ],
      "objectiveIds": [
        "O4"
      ]
    },
    {
      "id": "re01.q08",
      "prompt": "No plural pedido para as leitoras, por que o texto pode continuar singular?",
      "options": [
        "O pedido alterou o sujeito, não a quantidade do objeto.",
        "Todo objeto deve seguir o número do sujeito.",
        "Texto não pode estar no singular.",
        "Revisaram exige dois objetos obrigatoriamente."
      ],
      "answer": 0,
      "explanation": "Não se deve acrescentar mudança de objeto que não foi pedida.",
      "optionRationales": [
        "Não se deve acrescentar mudança de objeto que não foi pedida.",
        "Não existe essa regra universal.",
        "O objeto singular cabe no caso.",
        "O verbo não impõe quantidade de objetos assim."
      ],
      "recoverySectionIds": [
        "ex-numero"
      ],
      "objectiveIds": [
        "O1"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "re01-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "re01.q01": [
        {
          "missionId": "draft.re01",
          "sectionId": "conteudo"
        }
      ],
      "re01.q02": [
        {
          "missionId": "draft.re01",
          "sectionId": "entrada"
        }
      ],
      "re01.q03": [
        {
          "missionId": "draft.re01",
          "sectionId": "forma"
        }
      ],
      "re01.q04": [
        {
          "missionId": "draft.re01",
          "sectionId": "numero"
        }
      ],
      "re01.q05": [
        {
          "missionId": "draft.re01",
          "sectionId": "ex-numero"
        }
      ],
      "re01.q06": [
        {
          "missionId": "draft.re01",
          "sectionId": "ex-forma"
        }
      ],
      "re01.q07": [
        {
          "missionId": "draft.re01",
          "sectionId": "ex-conteudo"
        }
      ],
      "re01.q08": [
        {
          "missionId": "draft.re01",
          "sectionId": "ex-numero"
        }
      ]
    }
  }
};
export const EDITORIAL = {
  "stage": "Rascunho local fora do catálogo; parecer independente favorável, precisão RE01q7 aplicada nos comentários",
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
    "Plano05/documento120, bloco portuguese.meaning-writing existente. Perfis históricos/referenceOnly, sem novo currículo/fase formal.",
    "Ensino e textos autorais; Incaper11.1D/E somente orientação de clareza/evitar ambiguidade, não tabela lexical normativa.",
    "Relações e reescritas delimitadas; não ensinar sinônimos perfeitos universais, toda polissemia/homonímia, pressuposição, todas as figuras, passiva ou colocação pronominal.",
    "Sem produção/D1/push/ativação/merge/deploy; não prova edital completo, retenção ou aceite humano."
  ]
};
export const ARITHMETIC = [];
