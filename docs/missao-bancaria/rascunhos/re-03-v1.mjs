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
export const RE03_DRAFT = {
  "id": "draft.re03",
  "topicId": "draft.re03",
  "editorialKey": "RE-03",
  "candidateBlockId": "portuguese.meaning-writing",
  "title": "Reescrita integrada: corrigir o ponto sem alterar o recado",
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
      "id": "entrada",
      "heading": "1. Ler o pedido antes de corrigir",
      "body": "A tarefa pode pedir manter informação e corrigir um ponto gramatical. Identifique o agente, a ação, tempo/quantidade/negação e a condição do erro. Só reaplicamos casos anteriores: sujeito simples, presenciar com a, encontro com artigo definido e negativa sem pausa. Não supor que qualquer mudança deixe tudo equivalente.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "concordancia",
      "heading": "2. Corrigir sem mudar o sujeito",
      "body": "A frase de exercício Os leitores atentos leu o roteiro ontem pretende informar leitores plurais e leitura passada. CN ensinou verbo ligado ao núcleo do sujeito: corrija para Os leitores atentos leram o roteiro ontem. Mantenha sujeito plural, objeto singular e ontem; trocar para O leitor leu mudaria a quantidade pretendida.",
      "type": "explanation",
      "sourceIds": [
        "senado.concordancia"
      ]
    },
    {
      "id": "vinculo",
      "heading": "3. Preposição e artigo do caso",
      "body": "Pedido: padrão de assistir no sentido de presenciar; grupo definido a apresentação. A frase de exercício A aluna assistiu a apresentação indicada deve representar a preposição a e o artigo a: A aluna assistiu à apresentação indicada. Não acrescentar de nem trocar para a uma apresentação, pois o pedido manteve o grupo definido.",
      "type": "explanation",
      "sourceIds": [
        "senado.rg.assistir",
        "senado.crase"
      ]
    },
    {
      "id": "negativa",
      "heading": "4. Preservar não e o registro",
      "body": "Pedido formal: verbo simples lembro, negativa não sem pausa. A frase de exercício Não lembro-me do aviso deve ficar Não me lembro do aviso, conforme CP02. Não resolver apagando não: isso alteraria a mensagem e a condição. Sem extrapolar para pausas/locuções não ensinadas.",
      "type": "explanation",
      "sourceIds": [
        "funag.colocacao"
      ]
    },
    {
      "id": "ex-concordancia",
      "heading": "5. Exemplo resolvido: leitoras",
      "body": "As leitoras atentas revisou o roteiro hoje: o pedido informa leitoras plurais, revisão passada e hoje. Corrija somente o vínculo verbal para As leitoras atentas revisaram o roteiro hoje. Não tornar roteiro plural sem pedido nem trocar hoje por amanhã.",
      "type": "worked-example",
      "sourceIds": [
        "senado.concordancia"
      ]
    },
    {
      "id": "ex-vinculo",
      "heading": "6. Exemplo resolvido: oficina definida",
      "body": "No padrão de presenciar, A turma assistiu a oficina indicada deve conservar oficina com artigo definido a. Combine a preposição com esse artigo: A turma assistiu à oficina indicada. Com artigo uma seria a uma oficina, mas isso é outra determinação não pedida aqui.",
      "type": "worked-example",
      "sourceIds": [
        "senado.rg.assistir",
        "senado.crase"
      ]
    },
    {
      "id": "ex-negativa",
      "heading": "7. Exemplo resolvido: me",
      "body": "Não engano-me neste exemplo, sob pedido formal de verbo simples e negativa sem pausa, passa a Não me engano neste exemplo. O não permanece; me passa antes do verbo. Apagar não e usar Engano-me não preserva a negação.",
      "type": "worked-example",
      "sourceIds": [
        "funag.colocacao"
      ]
    },
    {
      "id": "retomadas",
      "heading": "8. Retomar o ponto pertinente",
      "body": "[RE-01](re-01-v1.md) · [RE-02](re-02-v1.md) · [CN-01](cn-01-v1.md#nucleo) · [CR-01](cr-01-v1.md#encontro) · [CP-02](cp-02-v1.md#negativa)",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "limites",
      "heading": "9. Correção delimitada",
      "body": "Os erros foram construídos para exercitar condições específicas e não são frases de pessoas reais. Não ensina todos os regimes de assistir, sujeitos coletivos, crase facultativa, todos os atratores ou registro único universal. Preservar a informação indicada não exige conservar a forma gramatical incorreta.",
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
      "id": "re03.q01",
      "prompt": "Pedido: manter leitores plurais, passado e ontem; corrigir Os leitores atentos leu o roteiro ontem. Qual resposta atende?",
      "options": [
        "Os leitores atentos leram os roteiros ontem, multiplicando obrigatoriamente o objeto.",
        "O leitor atento leu o roteiro ontem.",
        "Os leitores atentos lerão o roteiro amanhã.",
        "Os leitores atentos leram o roteiro ontem."
      ],
      "answer": 3,
      "explanation": "Leram acompanha o sujeito plural e conserva as demais informações pedidas.",
      "optionRationales": [
        "Acrescenta mudança do objeto não pedida.",
        "Muda quantidade do sujeito.",
        "Muda tempo e dia.",
        "Leram acompanha o sujeito plural e conserva as demais informações pedidas."
      ],
      "recoverySectionIds": [
        "concordancia"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "re03.q02",
      "prompt": "Na correção de As leitoras atentas revisou para As leitoras atentas revisaram, qual vínculo orienta a forma verbal?",
      "options": [
        "O objeto singular roteiro obrigatoriamente.",
        "O núcleo plural leitoras do sujeito.",
        "Somente a palavra hoje.",
        "O comprimento do adjetivo."
      ],
      "answer": 1,
      "explanation": "O verbo concorda com o sujeito de núcleo leitoras neste caso simples.",
      "optionRationales": [
        "Objeto não determina essa concordância.",
        "O verbo concorda com o sujeito de núcleo leitoras neste caso simples.",
        "Hoje indica tempo, não número do sujeito.",
        "Comprimento não decide a flexão."
      ],
      "recoverySectionIds": [
        "concordancia"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "re03.q03",
      "prompt": "Presenciar no padrão ensinado, com oficina e artigo a definido: qual correção representa preposição e artigo?",
      "options": [
        "A turma assistiu a uma oficina, conservando obrigatoriamente a mesma determinação.",
        "A turma assistiu de oficina indicada.",
        "A turma assistiu à oficina indicada.",
        "A turma assistiu ao oficina indicada."
      ],
      "answer": 2,
      "explanation": "A preposição a encontra o artigo a do grupo definido.",
      "optionRationales": [
        "Uma altera a determinação mantida pelo pedido.",
        "De não é o vínculo do caso.",
        "A preposição a encontra o artigo a do grupo definido.",
        "O não é o artigo do grupo feminino dado."
      ],
      "recoverySectionIds": [
        "vinculo"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "re03.q04",
      "prompt": "Por que trocar a oficina definida por uma oficina não é só corrigir o sinal no pedido dado?",
      "options": [
        "Muda a determinação do grupo nominal.",
        "Uma e a são sempre o mesmo artigo.",
        "Qualquer palavra feminina exige à uma.",
        "A determinação nunca afeta informação."
      ],
      "answer": 0,
      "explanation": "O pedido explicitou o artigo definido a; uma é outra escolha.",
      "optionRationales": [
        "O pedido explicitou o artigo definido a; uma é outra escolha.",
        "São artigos diferentes.",
        "Não ocorre a+a diante de uma neste caso.",
        "O exercício pede conservar essa informação."
      ],
      "recoverySectionIds": [
        "ex-vinculo"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "re03.q05",
      "prompt": "Pedido formal: negativa não sem pausa e verbo simples lembro. Qual correção preserva o caso de Não lembro-me do aviso?",
      "options": [
        "Lembro-me do aviso, apagando não.",
        "Não me lembro do aviso.",
        "Me lembro do aviso, apagando não.",
        "Não lembro me do aviso, como ênclise sem hífen."
      ],
      "answer": 1,
      "explanation": "Mantém negativa e põe me antes do verbo conforme CP02.",
      "optionRationales": [
        "Apaga a negação.",
        "Mantém negativa e põe me antes do verbo conforme CP02.",
        "Apaga a negação e não representa o caso dado.",
        "Não aplica a próclise requerida no caso."
      ],
      "recoverySectionIds": [
        "negativa"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "re03.q06",
      "prompt": "Qual condição deve ser conferida antes de aplicar a correção Não me engano neste recorte?",
      "options": [
        "Toda fala brasileira ser inválida.",
        "Só a quantidade de substantivos.",
        "Todo infinitivo admitir apenas ênclise.",
        "Registro formal, verbo simples e negativa sem pausa."
      ],
      "answer": 3,
      "explanation": "A regra reaplicada foi delimitada a essas condições.",
      "optionRationales": [
        "Não é o alcance da orientação formal.",
        "Contagem não estabelece o caso.",
        "O infinitivo tem outro ensino e pode admitir ambas as posições.",
        "A regra reaplicada foi delimitada a essas condições."
      ],
      "recoverySectionIds": [
        "negativa"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "re03.q07",
      "prompt": "Você corrigiu o verbo, mas mudou hoje para amanhã sem pedido. O que precisa recuperar?",
      "options": [
        "A informação temporal que devia ser conservada.",
        "A regra de todo plural exigir futuro.",
        "O direito de apagar toda informação para corrigir gramática.",
        "Só o número de letras de amanhã."
      ],
      "answer": 0,
      "explanation": "Correção gramatical não autoriza trocar o dia informado.",
      "optionRationales": [
        "Correção gramatical não autoriza trocar o dia informado.",
        "Plural não exige futuro.",
        "O pedido inclui preservação de informação.",
        "Letras não recuperam o conteúdo."
      ],
      "recoverySectionIds": [
        "ex-concordancia"
      ],
      "objectiveIds": [
        "O4"
      ]
    },
    {
      "id": "re03.q08",
      "prompt": "Qual afirmação respeita os limites da correção integrada?",
      "options": [
        "Prova que toda frase com me admite apenas uma posição.",
        "Completa toda gramática do edital.",
        "Só aplica condições já ensinadas e explicitadas, sem resolver todas as variantes e exceções.",
        "Transforma toda palavra feminina em caso de crase."
      ],
      "answer": 2,
      "explanation": "Os recortes e hipóteses permanecem delimitados.",
      "optionRationales": [
        "Infinitivos e registros têm condições diferentes.",
        "O pacote é introdutório.",
        "Os recortes e hipóteses permanecem delimitados.",
        "Gênero sozinho não fornece preposição e artigo."
      ],
      "recoverySectionIds": [
        "limites"
      ],
      "objectiveIds": [
        "O3"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "re03-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "re03.q01": [
        {
          "missionId": "draft.re03",
          "sectionId": "concordancia"
        }
      ],
      "re03.q02": [
        {
          "missionId": "draft.re03",
          "sectionId": "concordancia"
        }
      ],
      "re03.q03": [
        {
          "missionId": "draft.re03",
          "sectionId": "vinculo"
        }
      ],
      "re03.q04": [
        {
          "missionId": "draft.re03",
          "sectionId": "ex-vinculo"
        }
      ],
      "re03.q05": [
        {
          "missionId": "draft.re03",
          "sectionId": "negativa"
        }
      ],
      "re03.q06": [
        {
          "missionId": "draft.re03",
          "sectionId": "negativa"
        }
      ],
      "re03.q07": [
        {
          "missionId": "draft.re03",
          "sectionId": "ex-concordancia"
        }
      ],
      "re03.q08": [
        {
          "missionId": "draft.re03",
          "sectionId": "limites"
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
