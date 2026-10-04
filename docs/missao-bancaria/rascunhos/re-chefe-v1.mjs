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
export const RECHEFE_DRAFT = {
  "id": "draft.rechefe",
  "topicId": "draft.rechefe",
  "editorialKey": "RE-CHEFE",
  "candidateBlockId": "portuguese.meaning-writing",
  "title": "Reescrita: Chefe introdutório",
  "contentVersion": 1,
  "kind": "boss",
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
      "id": "ex-chefe",
      "heading": "4. Exemplo resolvido: preservar e corrigir",
      "body": "Pedido: leitoras plurais, passado e hoje. As leitoras revisou o texto hoje deve virar As leitoras revisaram o texto hoje, não singular nem futuro. Se houver negativa em outro caso formal, preservá-la antes de ajustar o átono.",
      "type": "worked-example",
      "sourceIds": [
        "senado.concordancia"
      ]
    },
    {
      "id": "retomadas",
      "heading": "5. Recuperar ensino",
      "body": "[RE-01](re-01-v1.md) · [RE-02](re-02-v1.md) · [RE-03](re-03-v1.md) · [RE-R](re-r-v1.md)",
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
      "id": "rechefe.q01",
      "prompt": "Original: A equipe não analisou o aviso hoje. Qual reescrita preserva o conteúdo fornecido?",
      "options": [
        "Hoje, todas as equipes analisaram os avisos.",
        "A equipe analisará o aviso amanhã.",
        "Hoje, a equipe não analisou o aviso.",
        "A equipe analisou o aviso hoje."
      ],
      "answer": 2,
      "explanation": "Conserva agente, negação, ação, objeto e dia, mudando ordem.",
      "optionRationales": [
        "Muda quantidade e negação.",
        "Muda tempo/dia e apaga negação.",
        "Conserva agente, negação, ação, objeto e dia, mudando ordem.",
        "Apaga a negação."
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
      ],
      "groupId": "G1"
    },
    {
      "id": "rechefe.q02",
      "prompt": "Qual critério deve ser separado de a frase ser gramaticalmente possível numa tarefa de equivalência?",
      "options": [
        "Preservar as informações dadas.",
        "Contar só letras.",
        "Aceitar qualquer frase correta como conteúdo idêntico.",
        "Proibir todo deslocamento temporal."
      ],
      "answer": 0,
      "explanation": "Gramática possível não garante conteúdo equivalente.",
      "optionRationales": [
        "Gramática possível não garante conteúdo equivalente.",
        "Letras não comprovam conteúdo.",
        "É generalização incorreta.",
        "Um deslocamento pode preservar no caso ensinado."
      ],
      "recoverySectionIds": [
        "conteudo"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "re01",
          "sectionId": "entrada"
        }
      ],
      "groupId": "G1"
    },
    {
      "id": "rechefe.q03",
      "prompt": "Original: Somente três leitoras receberão o texto se concluírem a atividade. Qual reescrita mantém limites?",
      "options": [
        "Somente três receberam o texto ontem.",
        "Três leitoras receberão o texto.",
        "Todas receberão o texto sem condição.",
        "Se concluírem a atividade, somente três leitoras receberão o texto."
      ],
      "answer": 3,
      "explanation": "Mantém restrição de participantes e condição.",
      "optionRationales": [
        "Muda tempo e apaga condição.",
        "Omite ambas as limitações.",
        "Muda quantidade e condição.",
        "Mantém restrição de participantes e condição."
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
      ],
      "groupId": "G2"
    },
    {
      "id": "rechefe.q04",
      "prompt": "Por que retirar se concluírem a atividade do original não é economia neutra?",
      "options": [
        "Toda condição é palavra ornamental.",
        "Exclui a condição que limitava o recebimento.",
        "Toda expressão com se é obrigatoriamente equivalente à ausência de condição.",
        "Não há diferença de alcance."
      ],
      "answer": 1,
      "explanation": "O caso condiciona o recebimento à conclusão.",
      "optionRationales": [
        "Há informação relevante.",
        "O caso condiciona o recebimento à conclusão.",
        "Não é equivalência universal.",
        "Excluir condição muda alcance."
      ],
      "recoverySectionIds": [
        "clareza"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "re02",
          "sectionId": "ex-condicao"
        }
      ],
      "groupId": "G2"
    },
    {
      "id": "rechefe.q05",
      "prompt": "Intenção dada: a revisora enviou o texto; havia duas pessoas e um pronome incerto. Que reescrita esclarece sem acrescentar outro agente?",
      "options": [
        "Ambas enviaram o texto.",
        "A revisora enviou o texto.",
        "A outra pessoa enviou o texto.",
        "Ela enviou o texto, mantendo a dúvida sem contexto."
      ],
      "answer": 1,
      "explanation": "Nomeia somente a pessoa indicada pela intenção.",
      "optionRationales": [
        "Acrescenta participação conjunta.",
        "Nomeia somente a pessoa indicada pela intenção.",
        "Muda agente pretendido.",
        "Mantém a referência incerta."
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
          "sectionId": "repeticao"
        }
      ],
      "groupId": "G3"
    },
    {
      "id": "rechefe.q06",
      "prompt": "No cenário, marcador é etiqueta colorida para localizar seção. Qual explicação conserva a definição fornecida?",
      "options": [
        "Um prazo obrigatório de pagamento.",
        "Aprovação automática de uma operação real.",
        "Garantia de que todos concluíram uma aula.",
        "Etiqueta colorida para localizar uma seção."
      ],
      "answer": 3,
      "explanation": "Repete a definição autoral do caso.",
      "optionRationales": [
        "Não é o sentido definido.",
        "Inventa efeito real não informado.",
        "Acrescenta conclusão não dada.",
        "Repete a definição autoral do caso."
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
          "sectionId": "termos"
        }
      ],
      "groupId": "G3"
    },
    {
      "id": "rechefe.q07",
      "prompt": "Pedido: passar A revisora atenta examinou o aviso para duas revisoras, mantendo objeto e passado. Qual resposta atende?",
      "options": [
        "As revisoras atentas examinaram o aviso.",
        "As revisora atenta examinou o aviso.",
        "A revisora atenta examinará os avisos.",
        "As revisoras atentas examinou o aviso."
      ],
      "answer": 0,
      "explanation": "Ajusta sujeito e concordância ao plural pedido, conservando passado e objeto.",
      "optionRationales": [
        "Ajusta sujeito e concordância ao plural pedido, conservando passado e objeto.",
        "Não ajusta plural.",
        "Muda quantidade, tempo e objeto.",
        "Verbo não acompanha sujeito plural dado."
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
          "sectionId": "numero"
        }
      ],
      "groupId": "G4"
    },
    {
      "id": "rechefe.q08",
      "prompt": "Pedido: leitores plurais, passado e ontem. Qual correção de Os leitores leu o texto ontem conserva essas informações?",
      "options": [
        "Os leitores lerão o texto amanhã.",
        "O leitor leu o texto ontem.",
        "Os leitores leram o texto ontem.",
        "Os leitores leram os textos ontem, como alteração obrigatória do objeto."
      ],
      "answer": 2,
      "explanation": "Verbo plural passado corrige o vínculo sem mudar o resto do pedido.",
      "optionRationales": [
        "Muda tempo/dia.",
        "Muda a quantidade de leitores.",
        "Verbo plural passado corrige o vínculo sem mudar o resto do pedido.",
        "Acrescenta plural ao objeto sem pedido."
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
      ],
      "groupId": "G4"
    },
    {
      "id": "rechefe.q09",
      "prompt": "Presenciar no padrão ensinado e oficina com artigo definido a: qual correção do grupo representa o encontro?",
      "options": [
        "Assistiu ao oficina indicada.",
        "Assistiu de oficina indicada.",
        "Assistiu a uma oficina, com determinação necessariamente idêntica.",
        "Assistiu à oficina indicada."
      ],
      "answer": 3,
      "explanation": "A preposição a com artigo a resulta em à.",
      "optionRationales": [
        "O não acompanha o grupo definido feminino.",
        "De não representa o vínculo dado.",
        "Uma modifica a determinação informada.",
        "A preposição a com artigo a resulta em à."
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
      ],
      "groupId": "G5"
    },
    {
      "id": "rechefe.q10",
      "prompt": "Por que corrigir esse grupo definido para a uma oficina não atende ao pedido de conservar artigo a?",
      "options": [
        "Uma e a são formas idênticas em qualquer grupo.",
        "Troca o artigo e a determinação explicitada.",
        "Todo feminino tem à uma.",
        "Só o tamanho da frase importa."
      ],
      "answer": 1,
      "explanation": "O pedido mantém o artigo definido; uma altera essa escolha.",
      "optionRationales": [
        "São artigos diferentes.",
        "O pedido mantém o artigo definido; uma altera essa escolha.",
        "Uma não fornece segundo a do encontro.",
        "Comprimento não preserva determinação."
      ],
      "recoverySectionIds": [
        "integrar"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "re03",
          "sectionId": "ex-vinculo"
        }
      ],
      "groupId": "G5"
    },
    {
      "id": "rechefe.q11",
      "prompt": "Pedido formal: não sem pausa, verbo simples engano e me. Qual correção preserva a negação de Não engano-me?",
      "options": [
        "Me engano, retirando não.",
        "Engano-me, retirando não.",
        "Não me engano.",
        "Não engano me, como ênclise sem hífen."
      ],
      "answer": 2,
      "explanation": "Conserva não e posiciona me antes conforme o caso formal.",
      "optionRationales": [
        "Apaga a negação do caso.",
        "Apaga a negação.",
        "Conserva não e posiciona me antes conforme o caso formal.",
        "Não aplica a próclise ensinada."
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
          "sectionId": "negativa"
        }
      ],
      "groupId": "G6"
    },
    {
      "id": "rechefe.q12",
      "prompt": "Você apagou a palavra não para encurtar o original. Que recuperação é necessária antes de escolher outra forma?",
      "options": [
        "Comparar a mensagem negativa original e o conteúdo afirmado após retirar não.",
        "Declarar a palavra ‘não’ sempre dispensável.",
        "Contar apenas sílabas.",
        "Inventar uma pausa e outra intenção."
      ],
      "answer": 0,
      "explanation": "A negação é informação relevante e deve ser preservada no pedido.",
      "optionRationales": [
        "A negação é informação relevante e deve ser preservada no pedido.",
        "A palavra ‘não’ preserva a negação e não é redundante neste caso.",
        "Sílabas não verificam conteúdo.",
        "Não se altera a hipótese para resolver."
      ],
      "recoverySectionIds": [
        "recuperacao"
      ],
      "objectiveIds": [
        "O4"
      ],
      "originRefs": [
        {
          "unit": "re01",
          "sectionId": "ex-conteudo"
        }
      ],
      "groupId": "G6"
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "rechefe-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "rechefe.q01": [
        {
          "missionId": "draft.rechefe",
          "sectionId": "conteudo"
        },
        {
          "missionId": "draft.re01",
          "sectionId": "conteudo"
        }
      ],
      "rechefe.q02": [
        {
          "missionId": "draft.rechefe",
          "sectionId": "conteudo"
        },
        {
          "missionId": "draft.re01",
          "sectionId": "entrada"
        }
      ],
      "rechefe.q03": [
        {
          "missionId": "draft.rechefe",
          "sectionId": "clareza"
        },
        {
          "missionId": "draft.re02",
          "sectionId": "condicoes"
        }
      ],
      "rechefe.q04": [
        {
          "missionId": "draft.rechefe",
          "sectionId": "clareza"
        },
        {
          "missionId": "draft.re02",
          "sectionId": "ex-condicao"
        }
      ],
      "rechefe.q05": [
        {
          "missionId": "draft.rechefe",
          "sectionId": "clareza"
        },
        {
          "missionId": "draft.re02",
          "sectionId": "repeticao"
        }
      ],
      "rechefe.q06": [
        {
          "missionId": "draft.rechefe",
          "sectionId": "clareza"
        },
        {
          "missionId": "draft.re02",
          "sectionId": "termos"
        }
      ],
      "rechefe.q07": [
        {
          "missionId": "draft.rechefe",
          "sectionId": "conteudo"
        },
        {
          "missionId": "draft.re01",
          "sectionId": "numero"
        }
      ],
      "rechefe.q08": [
        {
          "missionId": "draft.rechefe",
          "sectionId": "integrar"
        },
        {
          "missionId": "draft.re03",
          "sectionId": "concordancia"
        }
      ],
      "rechefe.q09": [
        {
          "missionId": "draft.rechefe",
          "sectionId": "integrar"
        },
        {
          "missionId": "draft.re03",
          "sectionId": "vinculo"
        }
      ],
      "rechefe.q10": [
        {
          "missionId": "draft.rechefe",
          "sectionId": "integrar"
        },
        {
          "missionId": "draft.re03",
          "sectionId": "ex-vinculo"
        }
      ],
      "rechefe.q11": [
        {
          "missionId": "draft.rechefe",
          "sectionId": "integrar"
        },
        {
          "missionId": "draft.re03",
          "sectionId": "negativa"
        }
      ],
      "rechefe.q12": [
        {
          "missionId": "draft.rechefe",
          "sectionId": "recuperacao"
        },
        {
          "missionId": "draft.re01",
          "sectionId": "ex-conteudo"
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
  ],
  "groups": [
    {
      "id": "G1",
      "label": "Conteúdo e forma",
      "units": [
        "re01"
      ]
    },
    {
      "id": "G2",
      "label": "Concisão com limites",
      "units": [
        "re02"
      ]
    },
    {
      "id": "G3",
      "label": "Referência e termo",
      "units": [
        "re02"
      ]
    },
    {
      "id": "G4",
      "label": "Concordância",
      "units": [
        "re01",
        "re03"
      ]
    },
    {
      "id": "G5",
      "label": "Vínculo e sinal",
      "units": [
        "re03"
      ]
    },
    {
      "id": "G6",
      "label": "Negativa e recuperação",
      "units": [
        "re01",
        "re03"
      ]
    }
  ]
};
export const ARITHMETIC = [];
