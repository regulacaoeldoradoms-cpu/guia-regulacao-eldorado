// Texto e exercícios autorais; rascunho fora do catálogo.
export const SOURCES = [];

export const LPR_DRAFT = {
  "id": "draft.lpr",
  "topicId": "draft.lpr",
  "editorialKey": "LP-R",
  "candidateBlockId": "portuguese.reading",
  "title": "Revisão de leitura: pistas, sentido e posição",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Aplicar as três aulas introdutórias a novos textos autorais, preservando o apoio e o alcance de cada conclusão.",
  "sourceIds": [],
  "sections": [
    {
      "id": "pistas",
      "heading": "1. Retomada: explícito, inferido e não demonstrado",
      "body": "Localize o que o texto diz e combine somente pistas pertinentes. Em um aviso, horário de atendimento e prazo de outra ação não são automaticamente iguais. Já estava no local quando uma atividade começou indica presença anterior ao início; não revela causa de chegada ou término da atividade.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "ex-aviso",
      "heading": "2. Exemplo resolvido: horários distintos",
      "body": "Aviso fictício: A feira funciona das 10h às 14h. A troca de cupons poderá ser feita até as 18h. O funcionamento informado vai de 10h a 14h; 18h é limite da troca de cupons. Não transportamos o segundo horário para funcionamento. A possibilidade de troca não vira obrigação.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "sentido",
      "heading": "3. Retomada: contexto e paráfrase",
      "body": "Texto enxuto pode descrever escrita concisa, sem excesso, conforme o contexto. A paráfrase conserva conteúdo relevante, não apenas palavras. Poderão não equivale a deverão; falta de garantia de que todos participarão não significa garantia de que ninguém participará. Compare objeto, modalidade, tempo e quantidade.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "ex-contexto",
      "heading": "4. Exemplo resolvido: sentido adequado",
      "body": "Frase fictícia: Na revisão, retiramos trechos repetidos e deixamos o relatório mais enxuto. Enxuto significa mais conciso nesse contexto, não seco ao sol nem corporalmente magro. A frase não diz que o relatório deixou de existir. Substituir por mais conciso mantém a relação com a retirada de repetições.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "posicao",
      "heading": "5. Retomada: tese, razão e atribuição",
      "body": "Prefiro ampliar a sala porque faltam lugares apresenta posição e razão. Identifique quem a apresenta. Segundo uma participante, o acervo é limitado relata avaliação dessa pessoa, sem comprovar pesquisa independente ou concordância universal. Priorizar uma ação antes de outra não significa rejeitar a segunda para sempre.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "ex-prioridade",
      "heading": "6. Exemplo resolvido: prioridade limitada",
      "body": "Texto fictício: O grupo propõe reformar a sala antes de comprar novas estantes, mas admite que ambas as ações poderão ser necessárias. Prioridade: reformar antes. Ressalva: possibilidade de necessidade das duas ações. Nunca comprar estantes apaga a ressalva e exagera a posição.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "recuperacao",
      "heading": "7. Recuperação",
      "body": "Nomeie a confusão: horário/referente; ordem/causa; sentido literal/contextual; possibilidade/obrigação; tese/razão; prioridade/rejeição. Releia o trecho local e a seção da aula de origem indicada no item. Refaça a resposta em palavras próprias e diga que informação não pode ser acrescentada.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "heading": "Glossário",
      "body": "**Pista:** informação textual pertinente à pergunta. **Paráfrase:** reescrita que conserva conteúdo relevante. **Tese:** posição defendida. **Razão:** apoio apresentado no texto. **Ressalva:** limite ou qualificação de uma afirmação.",
      "type": "glossary",
      "sourceIds": []
    },
    {
      "id": "resumo",
      "heading": "Resumo",
      "body": "Use evidência textual, preserve contexto e alcance, separe posição de justificativa. Os itens são prática cumulativa com origens; não são avaliação independente e sua conclusão não prova retenção.",
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
      "id": "lpr.q01",
      "prompt": "Aviso fictício: A feira funciona das 10h às 14h. A troca de cupons poderá ser feita até as 18h. Qual é o horário informado de funcionamento?",
      "options": [
        "Das 10h às 14h.",
        "Das 10h às 18h.",
        "Somente às 18h.",
        "Todo o dia, sem limite."
      ],
      "answer": 0,
      "explanation": "É o intervalo de funcionamento informado.",
      "optionRationales": [
        "É o intervalo de funcionamento informado.",
        "Aplica o prazo de troca ao funcionamento.",
        "Confunde limite de troca com todo o funcionamento.",
        "Esse alcance não foi informado."
      ],
      "recoverySectionIds": [
        "ex-aviso"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "lp01",
          "sectionId": "ex-explicita"
        }
      ]
    },
    {
      "id": "lpr.q02",
      "prompt": "Texto fictício: Quando a palestra começou, Ana já estava sentada na sala. Qual conclusão temporal é apoiada?",
      "options": [
        "Ana chegou depois do início.",
        "Ana estava na sala antes do início da palestra.",
        "A palestra terminou antes da chegada.",
        "O texto explica necessariamente por que Ana chegou cedo."
      ],
      "answer": 1,
      "explanation": "Já estava sentada indica presença anterior ao início.",
      "optionRationales": [
        "Contraria a presença já existente no início.",
        "Já estava sentada indica presença anterior ao início.",
        "O término não foi informado.",
        "Ordem temporal não demonstra a causa."
      ],
      "recoverySectionIds": [
        "pistas"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "lp01",
          "sectionId": "ex-limite"
        }
      ]
    },
    {
      "id": "lpr.q03",
      "prompt": "Frase fictícia: Na revisão, retiramos trechos repetidos e deixamos o relatório mais enxuto. Qual sentido de enxuto é pertinente?",
      "options": [
        "Seco por exposição ao sol.",
        "Fisicamente magro.",
        "Mais conciso, no contexto da escrita.",
        "Inexistente depois da revisão."
      ],
      "answer": 2,
      "explanation": "O contexto de retirar repetições orienta esse sentido.",
      "optionRationales": [
        "Não corresponde à revisão textual descrita.",
        "Transfere um sentido corporal para o relatório.",
        "O contexto de retirar repetições orienta esse sentido.",
        "Retirar repetições não prova extinção do relatório."
      ],
      "recoverySectionIds": [
        "ex-contexto"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "lp02",
          "sectionId": "contexto"
        }
      ]
    },
    {
      "id": "lpr.q04",
      "prompt": "Qual reescrita de Os interessados poderão enviar sugestões preserva a possibilidade, sem criar obrigação?",
      "options": [
        "Todos terão de enviar sugestões.",
        "Ninguém poderá enviar sugestões.",
        "Os interessados já enviaram sugestões.",
        "É permitido aos interessados enviar sugestões."
      ],
      "answer": 3,
      "explanation": "Conserva a possibilidade no contexto.",
      "optionRationales": [
        "Terão de cria obrigação.",
        "Nega a possibilidade apresentada.",
        "Troca possibilidade por ação concluída.",
        "Conserva a possibilidade no contexto."
      ],
      "recoverySectionIds": [
        "sentido"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "lp02",
          "sectionId": "ex-modalidade"
        }
      ]
    },
    {
      "id": "lpr.q05",
      "prompt": "O texto diz que a organização não garante que todos participarão. Qual leitura mantém esse limite?",
      "options": [
        "A participação de todos não está garantida; não foi afirmado que ninguém participará.",
        "Ninguém participará necessariamente.",
        "Todos já participaram.",
        "Participação e ausência são sempre equivalentes."
      ],
      "answer": 0,
      "explanation": "Ausência de garantia total não determina resultado universal oposto.",
      "optionRationales": [
        "Ausência de garantia total não determina resultado universal oposto.",
        "Acrescenta garantia de ausência universal.",
        "Acrescenta participação concluída.",
        "São estados distintos, sem equivalência apresentada."
      ],
      "recoverySectionIds": [
        "sentido"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "lp02",
          "sectionId": "limites"
        }
      ]
    },
    {
      "id": "lpr.q06",
      "prompt": "Texto fictício: Prefiro ampliar a sala porque faltam lugares para os encontros. Qual separação é adequada?",
      "options": [
        "Falta de lugares é a proposta de obra já executada.",
        "Ampliar a sala é a posição; falta de lugares é a razão apresentada.",
        "Toda pessoa concorda com a ampliação.",
        "Porque elimina a necessidade de identificar a posição."
      ],
      "answer": 1,
      "explanation": "Separa o que se defende e o apoio apresentado.",
      "optionRationales": [
        "Razão não é execução nem proposta de obra concluída.",
        "Separa o que se defende e o apoio apresentado.",
        "Concordância universal não foi informada.",
        "A relação exige identificar posição e razão."
      ],
      "recoverySectionIds": [
        "posicao"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "lp03",
          "sectionId": "argumento"
        }
      ]
    },
    {
      "id": "lpr.q07",
      "prompt": "Texto fictício: Segundo uma participante, o acervo é limitado. O enunciado apresenta essa avaliação como:",
      "options": [
        "Resultado comprovado de uma pesquisa não mencionada.",
        "Opinião necessariamente falsa.",
        "Ponto de vista atribuído à participante.",
        "Conclusão de todos os moradores."
      ],
      "answer": 2,
      "explanation": "Segundo uma participante marca a atribuição.",
      "optionRationales": [
        "A pesquisa não foi informada.",
        "Identificar opinião não prova falsidade.",
        "Segundo uma participante marca a atribuição.",
        "Não há atribuição universal."
      ],
      "recoverySectionIds": [
        "posicao"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "lp03",
          "sectionId": "atribuicao"
        }
      ]
    },
    {
      "id": "lpr.q08",
      "prompt": "Você leu reformar antes de comprar estantes, embora ambas possam ser necessárias como nunca comprar estantes. Qual retomada é adequada?",
      "options": [
        "Ignorar a ressalva.",
        "Supor uma proibição externa.",
        "Transformar toda prioridade em rejeição permanente.",
        "Reler prioridade e ressalva, retirando o nunca que não foi demonstrado."
      ],
      "answer": 3,
      "explanation": "Recupera as pistas que limitam a conclusão.",
      "optionRationales": [
        "Isso mantém a leitura incompleta.",
        "Acrescenta informação não apresentada.",
        "Repete a generalização indevida.",
        "Recupera as pistas que limitam a conclusão."
      ],
      "recoverySectionIds": [
        "ex-prioridade",
        "recuperacao"
      ],
      "objectiveIds": [
        "O4"
      ],
      "originRefs": [
        {
          "unit": "lp03",
          "sectionId": "ex-prioridade"
        }
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "lpr-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "lpr.q01": [
        {
          "missionId": "draft.lpr",
          "sectionId": "ex-aviso"
        }
      ],
      "lpr.q02": [
        {
          "missionId": "draft.lpr",
          "sectionId": "pistas"
        }
      ],
      "lpr.q03": [
        {
          "missionId": "draft.lpr",
          "sectionId": "ex-contexto"
        }
      ],
      "lpr.q04": [
        {
          "missionId": "draft.lpr",
          "sectionId": "sentido"
        }
      ],
      "lpr.q05": [
        {
          "missionId": "draft.lpr",
          "sectionId": "sentido"
        }
      ],
      "lpr.q06": [
        {
          "missionId": "draft.lpr",
          "sectionId": "posicao"
        }
      ],
      "lpr.q07": [
        {
          "missionId": "draft.lpr",
          "sectionId": "posicao"
        }
      ],
      "lpr.q08": [
        {
          "missionId": "draft.lpr",
          "sectionId": "ex-prioridade"
        },
        {
          "missionId": "draft.lpr",
          "sectionId": "recuperacao"
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
    "O1": "Localizar informação e sentido contextual.",
    "O2": "Reconstruir inferência e relação entre posição/razão.",
    "O3": "Conservar modalidade, atribuição e alcance.",
    "O4": "Identificar a confusão e recuperar o ensino."
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
    "Revisão das três aulas introdutórias, sem alegar conclusão de todo o bloco portuguese.reading."
  ]
};

export const ARITHMETIC = [];
