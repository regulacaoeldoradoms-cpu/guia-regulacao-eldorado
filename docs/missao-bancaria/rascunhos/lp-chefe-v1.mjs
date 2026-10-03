// Texto e exercícios autorais; rascunho fora do catálogo.
export const SOURCES = [];

export const LPCHEFE_DRAFT = {
  "id": "draft.lpchefe",
  "topicId": "draft.lpchefe",
  "editorialKey": "LP-CHEFE",
  "candidateBlockId": "portuguese.reading",
  "title": "Chefe de leitura introdutória: responder com apoio no texto",
  "contentVersion": 1,
  "kind": "boss",
  "publication": {
    "status": "draft"
  },
  "objective": "Aplicar informação, inferência, contexto, paráfrase e argumentação básica em casos autorais, recuperando cada tipo de erro.",
  "sourceIds": [],
  "sections": [
    {
      "id": "pistas",
      "heading": "1. Informação explícita e referente",
      "body": "Não misture horário de funcionamento com prazo de outra ação. Se um aviso disser sala das 8h às 11h e caixa até as 17h, abertura da sala corresponde ao primeiro intervalo. Uma palavra ou expressão deve ser relacionada ao objeto a que se refere; a pergunta pode pedir apenas um desses dados.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "inferencias",
      "heading": "2. Inferência não é invenção de causa",
      "body": "Informação temporal pode ser combinada: chegada às 9h50 e início às 10h sustentam chegada anterior. Encontrar uma reunião já em andamento indica seu estado naquele momento, sem comprovar causa da chegada. Uma hipótese possível não vira informação demonstrada; ausência de causa informada também não prova que uma hipótese seja impossível.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "contexto",
      "heading": "3. Exemplo resolvido: palavra em uso",
      "body": "Frases autorais: O manual funciona como ponte entre teoria e aplicação, ajudando a relacioná-las. Ponte indica ligação, não obra física. A discussão foi frutífera: dela surgiram propostas consideradas úteis. Frutífera indica produtiva nesse contexto. Em ambos os casos, o restante da frase orienta a leitura. Não transportar qualquer sentido literal nem prometer resultados que o texto não informa.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "parafrase",
      "heading": "4. Preservar conteúdo relevante",
      "body": "É permitido consultar o material antes da reunião conserva poderão consultar antes; terão de consultar depois muda obrigação e ordem. Alguns enviaram comentários comprova a existência indicada, sem demonstrar que todos enviaram ou que todos seria impossível. Conferir agente, objeto, tempo, modalidade, negação e quantidade evita reescritas que ampliam a afirmação.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "tese",
      "heading": "5. Separar posição e prioridade",
      "body": "Defendo reservar uma sala silenciosa apresenta uma posição. Uma frase sobre dificuldade causada por ruídos pode ser razão apresentada para essa proposta. Priorizar mesas antes de cadeiras, admitindo que ambas podem ser necessárias, não significa nunca comprar cadeiras. Compreender a posição não exige concordar com ela nem prova execução do projeto.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "razoes",
      "heading": "6. Identificar apoio e quem afirma",
      "body": "Na proposta de mais luminárias porque a iluminação dificulta a leitura em parte da sala, a dificuldade indicada é a razão apresentada. Não ampliar parte da sala para toda a cidade. Segundo uma visitante atribui um ponto de vista a ela; não informa pesquisa independente ou concordância universal. Opinião relatada não é automaticamente falsa.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "recuperacao",
      "heading": "7. Retomar pelo erro",
      "body": "Informação: localizar dado e referente. Inferência: reconstruir pistas e retirar causa inventada. Contexto: substituir palavra na frase inteira. Paráfrase: comparar tempo, modalidade e alcance. Posição: separar proposta e prioridade. Razão: localizar apoio e atribuição. Consulte a aula/seção de origem indicada; este Chefe é prática do recorte introdutório, não avaliação independente ou término de Português.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "retomadas",
      "heading": "Aulas para consulta",
      "body": "[Consultar LP-01](lp-01-v1.md)\n\n[Consultar LP-02](lp-02-v1.md)\n\n[Consultar LP-03](lp-03-v1.md)\n\n[Consultar LP-R](lp-r-v1.md)",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "heading": "Glossário",
      "body": "**Referente:** objeto a que uma expressão se liga. **Inferência:** conclusão apoiada nas pistas. **Paráfrase:** reescrita que conserva conteúdo relevante. **Tese:** posição defendida. **Argumento:** razão apresentada para apoiar a posição. **Atribuição:** identificação de quem afirma.",
      "type": "glossary",
      "sourceIds": []
    },
    {
      "id": "resumo",
      "heading": "Resumo",
      "body": "Use o texto como apoio. Preserve referente, contexto, ordem, modalidade e alcance. Separe proposta, razão e atribuição. Origem/retomada permite recuperar o conceito, mas conclusão de uma rodada não comprova retenção.",
      "type": "summary",
      "sourceIds": []
    }
  ],
  "recall": [
    "Qual trecho sustenta a conclusão?",
    "Qual mudança de palavras altera o alcance?",
    "Como reconstruir a resposta sem olhar o gabarito?"
  ],
  "questions": [
    {
      "id": "lpchefe.q01",
      "prompt": "Aviso fictício: A sala de exposição abre das 8h às 11h. A caixa de sugestões fica disponível até as 17h. Qual intervalo corresponde à abertura da sala?",
      "options": [
        "Das 8h às 17h.",
        "Somente às 17h.",
        "Das 8h às 11h.",
        "Durante todo o dia, sem limite."
      ],
      "answer": 2,
      "explanation": "É o intervalo explicitamente informado.",
      "optionRationales": [
        "Transporta para a sala o limite da caixa.",
        "Confunde limite da caixa com abertura.",
        "É o intervalo explicitamente informado.",
        "O alcance não foi informado."
      ],
      "recoverySectionIds": [
        "pistas"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "lp01",
          "sectionId": "ex-explicita"
        }
      ],
      "groupId": "lp.g1"
    },
    {
      "id": "lpchefe.q02",
      "prompt": "Aviso fictício: O encontro foi transferido para terça-feira. As inscrições poderão ser feitas até segunda-feira. Qual afirmação preserva as duas referências temporais?",
      "options": [
        "Encontro na terça; segunda aparece como limite de inscrição.",
        "Encontro na segunda, pois prazo e atividade são sempre o mesmo dia.",
        "Inscrição obrigatória somente na terça.",
        "Encontro e prazo já terminaram, sem necessidade de consultar datas."
      ],
      "answer": 0,
      "explanation": "Separa os acontecimentos e o limite informado.",
      "optionRationales": [
        "Separa os acontecimentos e o limite informado.",
        "Fundir as referências altera o aviso.",
        "Troca possibilidade, limite e exclusividade.",
        "O texto não informa passagem das datas."
      ],
      "recoverySectionIds": [
        "pistas"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "lp01",
          "sectionId": "ex-explicita"
        }
      ],
      "groupId": "lp.g1"
    },
    {
      "id": "lpchefe.q03",
      "prompt": "Texto fictício: O curso começou às 10h. Bia chegou à sala às 9h50. Qual relação é sustentada?",
      "options": [
        "Bia chegou depois do início.",
        "O curso terminou antes da chegada.",
        "O texto explica por que Bia chegou cedo.",
        "Bia chegou antes do início informado do curso."
      ],
      "answer": 3,
      "explanation": "Combina os dois horários sem acrescentar causa.",
      "optionRationales": [
        "9h50 é anterior a 10h.",
        "O término não foi informado.",
        "Horários não identificam essa causa.",
        "Combina os dois horários sem acrescentar causa."
      ],
      "recoverySectionIds": [
        "inferencias"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "lp01",
          "sectionId": "ex-limite"
        }
      ],
      "groupId": "lp.g2"
    },
    {
      "id": "lpchefe.q04",
      "prompt": "Texto fictício: Ao entrar, Rui encontrou a reunião já em andamento. O texto não informa por que ele chegou nesse momento. Pode-se concluir que um problema de transporte causou a chegada?",
      "options": [
        "Sim, pois toda chegada após o início tem essa causa.",
        "Não; a causa não foi demonstrada pelo texto.",
        "Sim, porque já em andamento prova problema de transporte.",
        "Não; o texto demonstra que transporte não poderia ser a causa."
      ],
      "answer": 1,
      "explanation": "Falta apoio textual para atribuir essa causa.",
      "optionRationales": [
        "Acrescenta uma generalização externa.",
        "Falta apoio textual para atribuir essa causa.",
        "A expressão informa estado da reunião, não causa da chegada.",
        "Falta de informação não prova impossibilidade."
      ],
      "recoverySectionIds": [
        "inferencias"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "lp01",
          "sectionId": "niveis"
        },
        {
          "unit": "lp01",
          "sectionId": "ex-limite"
        }
      ],
      "groupId": "lp.g2"
    },
    {
      "id": "lpchefe.q05",
      "prompt": "Frase fictícia: O manual funciona como ponte entre a teoria e a aplicação, ajudando o leitor a relacioná-las. Qual sentido de ponte é pertinente?",
      "options": [
        "Ligação entre teoria e aplicação, no contexto.",
        "Construção física sobre um rio descrito no texto.",
        "Prova de que não existe aplicação.",
        "Garantia de domínio completo apenas por possuir o manual."
      ],
      "answer": 0,
      "explanation": "O contexto explicita a relação entre teoria e aplicação.",
      "optionRationales": [
        "O contexto explicita a relação entre teoria e aplicação.",
        "O objeto da comparação é um manual, não obra física.",
        "Contraria a ligação descrita.",
        "Ajuda não é garantia de domínio."
      ],
      "recoverySectionIds": [
        "contexto"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "lp02",
          "sectionId": "contexto"
        }
      ],
      "groupId": "lp.g3"
    },
    {
      "id": "lpchefe.q06",
      "prompt": "Frase fictícia: A discussão foi frutífera: dela surgiram propostas que o grupo considerou úteis. Qual substituição conserva o sentido contextual de frutífera?",
      "options": [
        "Produziu necessariamente frutas comestíveis.",
        "Foi inexistente.",
        "Foi produtiva nesse contexto.",
        "Foi inútil em qualquer situação."
      ],
      "answer": 2,
      "explanation": "O contexto de propostas úteis orienta o sentido produtiva.",
      "optionRationales": [
        "Transfere indevidamente um sentido literal.",
        "Contraria a discussão e as propostas informadas.",
        "O contexto de propostas úteis orienta o sentido produtiva.",
        "Contraria a avaliação informada e amplia para qualquer situação."
      ],
      "recoverySectionIds": [
        "contexto"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "lp02",
          "sectionId": "contexto"
        },
        {
          "unit": "lp02",
          "sectionId": "ex-contexto"
        }
      ],
      "groupId": "lp.g3"
    },
    {
      "id": "lpchefe.q07",
      "prompt": "Frase fictícia: Os participantes poderão consultar o material antes da reunião. Qual reescrita conserva a possibilidade e a ordem?",
      "options": [
        "Os participantes terão de consultar depois da reunião.",
        "Ninguém poderá consultar o material.",
        "Todos já consultaram o material.",
        "É permitido aos participantes consultar o material antes da reunião."
      ],
      "answer": 3,
      "explanation": "Preserva possibilidade, participantes, material e ordem.",
      "optionRationales": [
        "Muda modalidade e ordem.",
        "Nega a possibilidade apresentada.",
        "Troca possibilidade por ação concluída universal.",
        "Preserva possibilidade, participantes, material e ordem."
      ],
      "recoverySectionIds": [
        "parafrase"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "lp02",
          "sectionId": "parafrase"
        },
        {
          "unit": "lp02",
          "sectionId": "ex-modalidade"
        }
      ],
      "groupId": "lp.g4"
    },
    {
      "id": "lpchefe.q08",
      "prompt": "Frase fictícia: Alguns visitantes enviaram comentários. Qual conclusão mantém apenas o alcance demonstrado?",
      "options": [
        "Houve visitantes que enviaram comentários; a frase não demonstra envio por todos.",
        "Todos enviaram necessariamente.",
        "Nenhum visitante enviou.",
        "É impossível que todos tenham enviado."
      ],
      "answer": 0,
      "explanation": "Preserva a existência informada sem decidir o total.",
      "optionRationales": [
        "Preserva a existência informada sem decidir o total.",
        "Amplia a informação sem apoio suficiente.",
        "Contraria a existência informada.",
        "A frase não demonstra essa impossibilidade."
      ],
      "recoverySectionIds": [
        "parafrase"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "lp01",
          "sectionId": "alcance"
        },
        {
          "unit": "lp02",
          "sectionId": "limites"
        }
      ],
      "groupId": "lp.g4"
    },
    {
      "id": "lpchefe.q09",
      "prompt": "Texto fictício: Defendo reservar uma sala silenciosa para estudo. Ruídos constantes dificultam a concentração de parte do grupo. Qual posição o autor defende?",
      "options": [
        "Todos os espaços já foram reformados.",
        "Reservar uma sala silenciosa para estudo.",
        "Nenhuma pessoa consegue estudar em qualquer lugar.",
        "Ruídos são a proposta de reserva em si."
      ],
      "answer": 1,
      "explanation": "É a posição apresentada por defendo.",
      "optionRationales": [
        "Execução não foi informada.",
        "É a posição apresentada por defendo.",
        "Amplia parte do grupo para uma conclusão universal.",
        "A menção aos ruídos é razão, não a proposta de reserva."
      ],
      "recoverySectionIds": [
        "tese"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "lp03",
          "sectionId": "assunto"
        },
        {
          "unit": "lp03",
          "sectionId": "ex-tese"
        }
      ],
      "groupId": "lp.g5"
    },
    {
      "id": "lpchefe.q10",
      "prompt": "Texto fictício: O grupo prioriza consertar as mesas antes de comprar novas cadeiras, mas admite que as duas ações podem ser necessárias. Qual leitura conserva a posição?",
      "options": [
        "Nunca haverá necessidade de cadeiras.",
        "As duas ações já foram concluídas.",
        "Não existe prioridade entre as ações.",
        "O conserto é prioritário, sem excluir possível necessidade da compra."
      ],
      "answer": 3,
      "explanation": "Mantém prioridade e ressalva.",
      "optionRationales": [
        "Apaga a ressalva e cria rejeição permanente.",
        "Execução não foi informada.",
        "Antes apresenta prioridade no caso.",
        "Mantém prioridade e ressalva."
      ],
      "recoverySectionIds": [
        "tese"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "lp03",
          "sectionId": "ex-prioridade"
        }
      ],
      "groupId": "lp.g5"
    },
    {
      "id": "lpchefe.q11",
      "prompt": "Texto fictício: Proponho instalar mais luminárias porque a iluminação atual dificulta a leitura em parte da sala. Qual é a razão apresentada?",
      "options": [
        "Todos já aceitaram a proposta.",
        "A dificuldade de leitura associada à iluminação atual, na parte indicada.",
        "A instalação já foi concluída.",
        "Parte da sala equivale necessariamente a toda a cidade."
      ],
      "answer": 1,
      "explanation": "É o apoio apresentado para a proposta.",
      "optionRationales": [
        "Aceitação universal não foi informada.",
        "É o apoio apresentado para a proposta.",
        "O texto apresenta proposta, não execução.",
        "Muda indevidamente o alcance."
      ],
      "recoverySectionIds": [
        "razoes"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "lp03",
          "sectionId": "argumento"
        }
      ],
      "groupId": "lp.g6"
    },
    {
      "id": "lpchefe.q12",
      "prompt": "Texto fictício: Segundo uma visitante, o novo horário é mais conveniente. Você concluiu que uma pesquisa provou concordância de todos. Qual retomada corrige o erro?",
      "options": [
        "Ignorar segundo uma visitante.",
        "Inventar os resultados da pesquisa.",
        "Reler a atribuição à visitante e retirar pesquisa e universalidade que o texto não apresenta.",
        "Tratar toda opinião como necessariamente falsa."
      ],
      "answer": 2,
      "explanation": "Identifica o ponto de vista relatado e seu limite.",
      "optionRationales": [
        "Apaga a pista de atribuição.",
        "Acrescenta informações ausentes.",
        "Identifica o ponto de vista relatado e seu limite.",
        "A existência de opinião não demonstra falsidade."
      ],
      "recoverySectionIds": [
        "razoes",
        "recuperacao"
      ],
      "objectiveIds": [
        "O4"
      ],
      "originRefs": [
        {
          "unit": "lp03",
          "sectionId": "atribuicao"
        }
      ],
      "groupId": "lp.g6"
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "lpchefe-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "lpchefe.q01": [
        {
          "missionId": "draft.lpchefe",
          "sectionId": "pistas"
        },
        {
          "missionId": "draft.lp01",
          "sectionId": "ex-explicita"
        }
      ],
      "lpchefe.q02": [
        {
          "missionId": "draft.lpchefe",
          "sectionId": "pistas"
        },
        {
          "missionId": "draft.lp01",
          "sectionId": "ex-explicita"
        }
      ],
      "lpchefe.q03": [
        {
          "missionId": "draft.lpchefe",
          "sectionId": "inferencias"
        },
        {
          "missionId": "draft.lp01",
          "sectionId": "ex-limite"
        }
      ],
      "lpchefe.q04": [
        {
          "missionId": "draft.lpchefe",
          "sectionId": "inferencias"
        },
        {
          "missionId": "draft.lp01",
          "sectionId": "niveis"
        },
        {
          "missionId": "draft.lp01",
          "sectionId": "ex-limite"
        }
      ],
      "lpchefe.q05": [
        {
          "missionId": "draft.lpchefe",
          "sectionId": "contexto"
        },
        {
          "missionId": "draft.lp02",
          "sectionId": "contexto"
        }
      ],
      "lpchefe.q06": [
        {
          "missionId": "draft.lpchefe",
          "sectionId": "contexto"
        },
        {
          "missionId": "draft.lp02",
          "sectionId": "contexto"
        },
        {
          "missionId": "draft.lp02",
          "sectionId": "ex-contexto"
        }
      ],
      "lpchefe.q07": [
        {
          "missionId": "draft.lpchefe",
          "sectionId": "parafrase"
        },
        {
          "missionId": "draft.lp02",
          "sectionId": "parafrase"
        },
        {
          "missionId": "draft.lp02",
          "sectionId": "ex-modalidade"
        }
      ],
      "lpchefe.q08": [
        {
          "missionId": "draft.lpchefe",
          "sectionId": "parafrase"
        },
        {
          "missionId": "draft.lp01",
          "sectionId": "alcance"
        },
        {
          "missionId": "draft.lp02",
          "sectionId": "limites"
        }
      ],
      "lpchefe.q09": [
        {
          "missionId": "draft.lpchefe",
          "sectionId": "tese"
        },
        {
          "missionId": "draft.lp03",
          "sectionId": "assunto"
        },
        {
          "missionId": "draft.lp03",
          "sectionId": "ex-tese"
        }
      ],
      "lpchefe.q10": [
        {
          "missionId": "draft.lpchefe",
          "sectionId": "tese"
        },
        {
          "missionId": "draft.lp03",
          "sectionId": "ex-prioridade"
        }
      ],
      "lpchefe.q11": [
        {
          "missionId": "draft.lpchefe",
          "sectionId": "razoes"
        },
        {
          "missionId": "draft.lp03",
          "sectionId": "argumento"
        }
      ],
      "lpchefe.q12": [
        {
          "missionId": "draft.lpchefe",
          "sectionId": "razoes"
        },
        {
          "missionId": "draft.lpchefe",
          "sectionId": "recuperacao"
        },
        {
          "missionId": "draft.lp03",
          "sectionId": "atribuicao"
        }
      ]
    }
  }
};

export const EDITORIAL = {
  "stage": "Rascunho local fora do catálogo; revisão independente pendente",
  "referenceOnlyProfiles": [
    {
      "id": "bb.agente-comercial.2022-001",
      "item": "Português: compreensão e interpretação, recorte do plano 05/mapa existente",
      "status": "histórico; referenceOnly"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Português: compreensão e interpretação, recorte do plano 05/mapa existente",
      "status": "histórico; referenceOnly"
    }
  ],
  "objectives": {
    "O1": "Localizar informação e posição defendida.",
    "O2": "Reconstruir inferência, contexto e razão apresentada.",
    "O3": "Preservar alcance e reconhecer excesso de conclusão.",
    "O4": "Retomar a pista ou atribuição confundida."
  },
  "recovery": {
    "objectiveId": "O4",
    "instruction": "Localizar as pistas, nomear a confusão e refazer o exemplo."
  },
  "limits": [
    "Recorte previsto em docs/missao-bancaria/05-FASE-4-PORTUGUES-MATEMATICA.md e curriculum-v1.js, sem abrir formalmente a Fase 4.",
    "Textos A/B e frases são integralmente criados pelo autor para exercícios; não são citações, notícias ou instruções de serviços reais.",
    "Sem norma mutável, fonte jurídica ou consulta real nesta unidade; não fabricar fonte bibliográfica para texto autoral.",
    "Correspondência preliminar ao bloco existente não afirma cobertura integral de item/subitem de edital, adoção de edital vigente ou avaliação independente.",
    "Sem XP, ordem, importação no runtime, alteração de progresso, aceite humano ou publicação.",
    "Chefe de três aulas introdutórias, sem alegar cobertura integral de portuguese.reading ou Português."
  ],
  "groups": [
    {
      "id": "lp.g1",
      "label": "Informação explícita",
      "units": [
        "lp01"
      ]
    },
    {
      "id": "lp.g2",
      "label": "Inferência e limite",
      "units": [
        "lp01"
      ]
    },
    {
      "id": "lp.g3",
      "label": "Sentido contextual",
      "units": [
        "lp02"
      ]
    },
    {
      "id": "lp.g4",
      "label": "Paráfrase e alcance",
      "units": [
        "lp01",
        "lp02"
      ]
    },
    {
      "id": "lp.g5",
      "label": "Posição e prioridade",
      "units": [
        "lp03"
      ]
    },
    {
      "id": "lp.g6",
      "label": "Razão e atribuição",
      "units": [
        "lp03"
      ]
    }
  ]
};

export const ARITHMETIC = [];
