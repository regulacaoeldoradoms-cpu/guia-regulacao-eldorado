// Textos e exercícios autorais; rascunho local desativado.
export const SOURCES = [
  {
    "id": "incaper.clareza",
    "label": "Incaper - Manual de Produção Editorial: adequação da linguagem",
    "url": "https://manual-editorial.incaper.es.gov.br/capitulo_onze.htm",
    "version": "11.1D/E, orientação de clareza e ambiguidade; consultado em04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "11.1D: clareza e evitar ambiguidade;11.1E: explicar termos. Não atribuir lista lexical de sinônimos/antônimos a esta fonte."
  },
  {
    "id": "senado.concordancia",
    "label": "Senado Federal — Manual de Comunicação: concordância verbal",
    "url": "https://www12.senado.leg.br/manualdecomunicacao/estilos/concordancia-verbal",
    "version": "Manual de Comunicação, página HTML consultada em 04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "Regra geral; sujeito único8 (haver/fazer impessoais); sujeito composto1–2 (posição)"
  },
  {
    "id": "senado.rg.assistir",
    "label": "Senado Federal — Manual de Comunicação: assistir",
    "url": "https://www12.senado.leg.br/manualdecomunicacao/estilos/assistir",
    "version": "Orientação editorial nos sentidos presenciar/ajudar; HTML consultado em04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "Abertura: sentido estar presente/presenciar; parágrafo de auxiliar/ajudar: use como transitivo direto"
  },
  {
    "id": "senado.crase",
    "label": "Senado Federal - Manual de Comunicação: crase",
    "url": "https://www12.senado.leg.br/manualdecomunicacao/estilos/crase",
    "version": "HTML consultado em04/10/2026; recorte introdutório delimitado",
    "checkedAt": "2026-10-04",
    "locator": "Definição; Use crase1/3/4 e ressalva de clareza; Não ocorre1/2/3. Não cobrar casos facultativos/nomes próprios/paralelismo geral."
  },
  {
    "id": "funag.colocacao",
    "label": "FUNAG - Manual de Revisão: colocação pronominal (fontes Cunha/Cintra e Almeida)",
    "url": "https://funag.gov.br/manual/index.php?title=Coloca%C3%A7%C3%A3o_pronominal&oldid=553",
    "version": "oldid553; página atribui Cunha/Cintra2001 e Almeida2009; consultada em04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "Tipos antes/depois/meio; Com um só verbo2a (negativa sem pausa),4 (infinitivos próclise/ênclise); regra final início formal. Não aplicar as afirmações amplas de locuções verbais/advérbios/futuro a variantes não ensinadas."
  }
];
export const RER_DRAFT = {
  "id": "draft.rer",
  "topicId": "draft.rer",
  "editorialKey": "RE-R",
  "candidateBlockId": "portuguese.meaning-writing",
  "title": "Reescrita: revisão integrada do recorte",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Reescrever nos casos explicitados, preservando informações e aplicando condições gramaticais já ensinadas.",
  "sourceIds": [
    "incaper.clareza",
    "senado.concordancia",
    "senado.rg.assistir",
    "senado.crase",
    "funag.colocacao"
  ],
  "sections": [
    {
      "id": "conteudo",
      "heading": "1. Conteúdo e forma",
      "body": "RE01 separa conteúdo de correção formal. Mantenha agente/ação/objeto/tempo/negação; se o pedido muda singular para plural, reconhecer essa alteração intencional e ajustar concordância. Não chamar toda mudança solicitada de equivalência completa.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "clareza",
      "heading": "2. Limites que não podem desaparecer",
      "body": "RE02: somente e condição se concluírem são relevantes. Repetir pessoa pode esclarecer referência; explicar termo usa significado explicitado no cenário, sem inventar definição real.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "integrar",
      "heading": "3. Corrigir o caso dado",
      "body": "RE03: sujeito simples plural pede verbo plural; presenciar com a e artigo feminino definido forma à; negativa sem pausa no padrão formal pede átono antes. Correção não autoriza mudar dia, objeto ou retirar não.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "ex-conteudo",
      "heading": "4. Exemplo resolvido: deslocar",
      "body": "A turma não revisou o texto ontem e Ontem, a turma não revisou o texto conservam informações no caso. Todas revisarão amanhã altera sujeito/tempo/negação.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "ex-clareza",
      "heading": "5. Exemplo resolvido: condição",
      "body": "Se concluírem a revisão, somente duas leitoras receberão o roteiro mantém limite e condição. Duas leitoras receberão omite ambos.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "ex-integrar",
      "heading": "6. Exemplo resolvido: não",
      "body": "Não lembro-me do aviso, no pedido formal com verbo simples e sem pausa, corrige-se para Não me lembro do aviso. Não permanece; me muda de posição.",
      "type": "worked-example",
      "sourceIds": [
        "funag.colocacao"
      ]
    },
    {
      "id": "retomadas",
      "heading": "7. Retomar a condição",
      "body": "[RE-01](re-01-v1.md) · [RE-02](re-02-v1.md) · [RE-03](re-03-v1.md)",
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
      "id": "rer.q01",
      "prompt": "No caso de A turma não revisou o texto ontem, qual deslocamento mantém as informações explicitadas?",
      "options": [
        "Ontem, a turma não revisou o texto.",
        "Amanhã, todas revisarão o texto.",
        "Ontem, a turma revisou o texto.",
        "A turma perdeu o texto ontem."
      ],
      "answer": 0,
      "explanation": "Desloca tempo sem alterar agente/negação/ação/objeto/dia.",
      "optionRationales": [
        "Desloca tempo sem alterar agente/negação/ação/objeto/dia.",
        "Muda agente, tempo e negação.",
        "Apaga a negação.",
        "Muda a ação."
      ],
      "recoverySectionIds": [
        "conteudo"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "re01",
          "sectionId": "conteudo"
        }
      ]
    },
    {
      "id": "rer.q02",
      "prompt": "O pedido passa uma leitora para duas. Essa alteração pode ser chamada de preservação total da quantidade?",
      "options": [
        "Sim: só verbos mudam quantidade.",
        "Sim: singular e plural sempre dizem a mesma quantidade.",
        "Não: a quantidade foi mudada intencionalmente.",
        "Não: todas as demais informações devem ser apagadas."
      ],
      "answer": 2,
      "explanation": "Reconhecer a alteração pedida evita falsa equivalência completa.",
      "optionRationales": [
        "O sujeito também muda quantidade no caso.",
        "São quantidades distintas na hipótese dada.",
        "Reconhecer a alteração pedida evita falsa equivalência completa.",
        "O pedido não exige apagar conteúdo."
      ],
      "recoverySectionIds": [
        "conteudo"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "re01",
          "sectionId": "numero"
        }
      ]
    },
    {
      "id": "rer.q03",
      "prompt": "Qual reescrita mantém somente e se concluírem na condição de recebimento dada?",
      "options": [
        "Todas receberão o roteiro sem condição.",
        "Se concluírem a revisão, somente duas leitoras receberão o roteiro.",
        "Duas leitoras receberão o roteiro.",
        "Somente duas receberam o roteiro ontem."
      ],
      "answer": 1,
      "explanation": "Mantém limitação e condição.",
      "optionRationales": [
        "Muda quantidade e elimina condição.",
        "Mantém limitação e condição.",
        "Apaga limitação e condição.",
        "Muda tempo e apaga condição."
      ],
      "recoverySectionIds": [
        "clareza"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "re02",
          "sectionId": "condicoes"
        }
      ]
    },
    {
      "id": "rer.q04",
      "prompt": "Para esclarecer referência incerta entre duas pessoas, o que pode ser adequado?",
      "options": [
        "Escolher um nome aleatório como fato.",
        "Proibir qualquer repetição universalmente.",
        "Usar ambas sem a intenção informar participação conjunta.",
        "Repetir o nome da pessoa indicada pela intenção explícita."
      ],
      "answer": 3,
      "explanation": "O nome identifica o referente pretendido no caso.",
      "optionRationales": [
        "A intenção não deve ser inventada.",
        "A clareza pode justificar repetir.",
        "Ambas acrescenta participação.",
        "O nome identifica o referente pretendido no caso."
      ],
      "recoverySectionIds": [
        "clareza"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "re02",
          "sectionId": "repeticao"
        }
      ]
    },
    {
      "id": "rer.q05",
      "prompt": "Pedido: manter leitoras plurais e revisão passada. Qual correção do verbo de As leitoras revisou o roteiro atende?",
      "options": [
        "As leitoras revisarão o roteiro.",
        "A leitora revisou o roteiro.",
        "As leitoras revisaram o roteiro.",
        "As leitoras revisaram os roteiros obrigatoriamente."
      ],
      "answer": 2,
      "explanation": "Verbo plural passado acompanha sujeito plural sem mudança do objeto.",
      "optionRationales": [
        "Muda o tempo.",
        "Muda quantidade do sujeito.",
        "Verbo plural passado acompanha sujeito plural sem mudança do objeto.",
        "Muda a quantidade do objeto sem pedido."
      ],
      "recoverySectionIds": [
        "integrar"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "re03",
          "sectionId": "concordancia"
        }
      ]
    },
    {
      "id": "rer.q06",
      "prompt": "No padrão de presenciar com artigo definido a, como representar o encontro no grupo apresentação indicada?",
      "options": [
        "Assistiu à apresentação indicada.",
        "Assistiu de apresentação indicada.",
        "Assistiu à uma apresentação.",
        "Assistiu ao apresentação indicada."
      ],
      "answer": 0,
      "explanation": "A preposição e o artigo a se encontram.",
      "optionRationales": [
        "A preposição e o artigo a se encontram.",
        "De não é o vínculo dado.",
        "Uma não fornece artigo a para fusão.",
        "O não é o artigo do grupo dado."
      ],
      "recoverySectionIds": [
        "integrar"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "re03",
          "sectionId": "vinculo"
        }
      ]
    },
    {
      "id": "rer.q07",
      "prompt": "A correção formal apagou não de Não lembro-me. Qual informação foi perdida?",
      "options": [
        "A quantidade obrigatória de objetos.",
        "Somente a cor do texto.",
        "Nenhuma informação.",
        "A negação da mensagem original."
      ],
      "answer": 3,
      "explanation": "Retirar a palavra ‘não’ muda a afirmação negativa do caso.",
      "optionRationales": [
        "Não há quantidade de objetos imposta pela palavra.",
        "Cor não é a informação alterada.",
        "A negação é relevante.",
        "Retirar a palavra ‘não’ muda a afirmação negativa do caso."
      ],
      "recoverySectionIds": [
        "integrar"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "re03",
          "sectionId": "negativa"
        }
      ]
    },
    {
      "id": "rer.q08",
      "prompt": "Você encurtou o recebimento condicionado, apagando se concluírem. Que recuperação cabe?",
      "options": [
        "Considerar toda condição redundante.",
        "Retomar a condição explícita e verificar o alcance da reescrita.",
        "Ignorar o pedido de preservação.",
        "Criar outra condição real de crédito."
      ],
      "answer": 1,
      "explanation": "A condição informa quando ocorrerá o recebimento no cenário.",
      "optionRationales": [
        "Não é redundante no caso.",
        "A condição informa quando ocorrerá o recebimento no cenário.",
        "O pedido exige preservar informação.",
        "Não se trata de crédito real."
      ],
      "recoverySectionIds": [
        "recuperacao"
      ],
      "objectiveIds": [
        "O4"
      ],
      "originRefs": [
        {
          "unit": "re02",
          "sectionId": "ex-condicao"
        }
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "rer-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "rer.q01": [
        {
          "missionId": "draft.rer",
          "sectionId": "conteudo"
        }
      ],
      "rer.q02": [
        {
          "missionId": "draft.rer",
          "sectionId": "conteudo"
        }
      ],
      "rer.q03": [
        {
          "missionId": "draft.rer",
          "sectionId": "clareza"
        }
      ],
      "rer.q04": [
        {
          "missionId": "draft.rer",
          "sectionId": "clareza"
        }
      ],
      "rer.q05": [
        {
          "missionId": "draft.rer",
          "sectionId": "integrar"
        }
      ],
      "rer.q06": [
        {
          "missionId": "draft.rer",
          "sectionId": "integrar"
        }
      ],
      "rer.q07": [
        {
          "missionId": "draft.rer",
          "sectionId": "integrar"
        }
      ],
      "rer.q08": [
        {
          "missionId": "draft.rer",
          "sectionId": "recuperacao"
        }
      ]
    }
  }
};
export const EDITORIAL = {
  "stage": "Rascunho local fora do catálogo; revisão independente pendente",
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
    "Integra somente condições já ensinadas em CN/RG/CR/CP; fontes pertinentes reutilizadas, sem novas regras controversas. Não cobre voz passiva/discurso indireto/relativas/nominalização/elipse ou todos os períodos complexos.",
    "Sem produção/D1/push/ativação/merge/deploy; não prova edital completo, retenção ou aceite humano."
  ]
};
export const ARITHMETIC = [];
