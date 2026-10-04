// Texto e exercícios autorais; rascunho fora do catálogo.
export const SOURCES = [];

export const PT02_DRAFT = {
  "id": "draft.pt02",
  "topicId": "draft.pt02",
  "editorialKey": "PT-02",
  "candidateBlockId": "portuguese.text",
  "title": "Referências e substituições: quem ou o que está sendo retomado?",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Localizar retomadas em textos curtos, preservar seu referente em reescritas e reconhecer ambiguidade quando as pistas não distinguem duas possibilidades.",
  "sourceIds": [],
  "sections": [
    {
      "id": "retomada",
      "heading": "1. Por que não repetimos todas as palavras",
      "body": "Um texto pode apresentar um participante ou objeto e depois retomá-lo com outra expressão. Para acompanhar a informação, pergunte: a quem ou a que essa expressão se refere? Não basta reconhecer que duas palavras estão próximas; é preciso verificar o sentido das frases. Aqui vamos usar exemplos curtos, sem exigir nomenclatura gramatical extensa.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "texto-a",
      "heading": "2. Texto autoral A: um objeto e uma retomada",
      "body": "Rafael comprou um livro de mapas. Esse volume ficou sobre a mesa durante a leitura.\n\nA expressão “esse volume” retoma o livro. Neste contexto, não significa o nível do som nem a quantidade de água; a informação anterior oferece a pista.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "ex-volume",
      "heading": "3. Exemplo resolvido: manter o mesmo objeto",
      "body": "Pergunta: qual expressão pode substituir “esse volume” em A sem trocar o objeto referido?\n\nResposta: “o livro de mapas”. Não usar “a mesa”: ela é o lugar onde o objeto ficou, não o objeto retomado. A palavra “volume” tem usos diferentes, mas a escolha deve considerar esta frase.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "pronome",
      "heading": "4. Uma retomada por pronome",
      "body": "Texto autoral B: Lucas encontrou uma mochila. Ele a levou ao balcão.\n\nNeste trecho, “ele” retoma Lucas e “a” retoma a mochila. Substituir a segunda frase por “Lucas levou a mochila ao balcão” explicita as referências sem trocar os papéis. Essa é uma forma de conferir a compreensão, não uma regra de que textos devam sempre repetir nomes.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "ex-papeis",
      "heading": "5. Exemplo resolvido: não inverter os participantes",
      "body": "Pergunta: quem levou o quê ao balcão em B?\n\nLucas levou a mochila. Resposta “a mochila levou Lucas” troca quem age e o objeto da ação. A resposta “Lucas levou um livro” conserva a pessoa, mas troca o objeto por outro que não foi informado.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "ambiguidade",
      "heading": "6. Quando a referência não fica suficientemente clara",
      "body": "Texto autoral C: Lia conversou com Bia depois que ela chegou.\n\nSem outra informação, o trecho permite associar “ela” a Lia ou a Bia. Não escolher obrigatoriamente o nome mais próximo como se fosse uma prova. O contexto pode resolver uma referência; quando ele não resolve, reconhecer a dúvida é uma resposta precisa, não falta de leitura.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "ex-explicitar",
      "heading": "7. Exemplo resolvido: esclarecer uma referência",
      "body": "Se a intenção é informar que Bia chegou antes da conversa, reescreva: “Lia conversou com Bia depois que Bia chegou”. A repetição do nome elimina a dúvida sobre quem chegou.\n\nSe a intenção fosse a chegada de Lia, seria necessário explicitar Lia. O autor precisa fornecer a informação; o leitor não deve inventá-la.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "ideia",
      "heading": "8. Uma expressão pode retomar uma ideia",
      "body": "Texto autoral D: O encontro foi transferido para sexta-feira. Essa mudança foi avisada à equipe.\n\n“Essa mudança” retoma a transferência do encontro para sexta-feira, não necessariamente uma mudança de sala, de participantes ou de duração. Uma retomada pode resumir uma informação anterior, em vez de repetir uma única palavra.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "limites",
      "heading": "9. Substituição não pode acrescentar certeza",
      "body": "Uma retomada deve conservar o que o trecho oferece. De “Rafael comprou um livro de mapas” para “Rafael comprou o melhor livro de mapas” há um julgamento novo. De “O encontro foi transferido” para “O encontro foi cancelado” há outro acontecimento. Duas expressões sobre um mesmo assunto não são automaticamente equivalentes.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "heading": "10. Vocabulário de apoio",
      "body": "Referente: participante, objeto ou informação a que uma expressão se refere. Retomada: expressão que recupera algo apresentado no texto. Substituição: uso de outra expressão no lugar de uma anterior. Ambiguidade referencial: mais de uma referência permanece possível nas pistas disponíveis. Contexto: informações que ajudam a escolher o sentido adequado.",
      "type": "glossary",
      "sourceIds": []
    },
    {
      "id": "recuperacao",
      "heading": "11. Recuperar uma troca de referência",
      "body": "Sublinhe a expressão de retomada e volte à informação anterior. Reescreva a frase com o nome ou a ideia por extenso. Confira se a reescrita preserva pessoa, objeto e acontecimento. Se dois referentes continuarem possíveis, diga quais são e qual informação faltou para distingui-los. Depois refaça a questão sem usar apenas a distância entre palavras.",
      "type": "summary",
      "sourceIds": []
    }
  ],
  "recall": [
    "Que palavra retoma qual informação?",
    "Qual relação o trecho expressa?",
    "Que informação a alternativa acrescentou ou trocou?"
  ],
  "questions": [
    {
      "id": "pt02.q01",
      "prompt": "Em A, a expressão “esse volume” retoma:",
      "options": [
        "O livro de mapas.",
        "A mesa.",
        "O nível de um som.",
        "Uma quantidade de água."
      ],
      "answer": 0,
      "explanation": "O livro foi apresentado e é o objeto colocado sobre a mesa.",
      "optionRationales": [
        "O livro foi apresentado e é o objeto colocado sobre a mesa.",
        "A mesa indica o lugar, não o objeto retomado.",
        "Não há som em A.",
        "Não há água em A."
      ],
      "recoverySectionIds": [
        "texto-a",
        "ex-volume"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "pt02.q02",
      "prompt": "Qual reescrita explicita as referências de B preservando os papéis?",
      "options": [
        "A mochila levou Lucas ao balcão.",
        "Lucas levou a mochila ao balcão.",
        "Lucas levou um livro ao balcão.",
        "O balcão encontrou a mochila."
      ],
      "answer": 1,
      "explanation": "Repete os referentes de “ele” e “a” sem trocar o sentido.",
      "optionRationales": [
        "Inverte quem age e o objeto da ação.",
        "Repete os referentes de “ele” e “a” sem trocar o sentido.",
        "Introduz outro objeto.",
        "Atribui uma ação ao balcão que não aparece no trecho."
      ],
      "recoverySectionIds": [
        "pronome",
        "ex-papeis"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "pt02.q03",
      "prompt": "Sem contexto adicional, o que se pode afirmar sobre “ela” em C?",
      "options": [
        "Só pode ser Bia, porque está mais perto.",
        "Só pode ser Lia, porque inicia a primeira frase.",
        "A chegada pode ser atribuída a Lia ou a Bia; o trecho não distingue as duas.",
        "O pronome prova que uma terceira pessoa chegou."
      ],
      "answer": 2,
      "explanation": "As duas participantes são possibilidades nas pistas dadas.",
      "optionRationales": [
        "A proximidade sozinha não elimina a outra leitura.",
        "Iniciar a frase não resolve sozinho a referência.",
        "As duas participantes são possibilidades nas pistas dadas.",
        "Nenhuma terceira participante foi apresentada."
      ],
      "recoverySectionIds": [
        "ambiguidade",
        "ex-explicitar"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "pt02.q04",
      "prompt": "A intenção é informar que Bia chegou antes da conversa. Qual reescrita esclarece essa informação?",
      "options": [
        "Lia conversou com Bia depois que ela chegou.",
        "Lia conversou com Bia depois que Lia chegou.",
        "Lia conversou com Bia antes que Bia chegasse.",
        "Lia conversou com Bia depois que Bia chegou."
      ],
      "answer": 3,
      "explanation": "Explicita Bia e conserva a chegada antes da conversa.",
      "optionRationales": [
        "Conserva a dúvida que se queria eliminar.",
        "Explicita a chegada de Lia, não a de Bia.",
        "Troca a ordem temporal pretendida.",
        "Explicita Bia e conserva a chegada antes da conversa."
      ],
      "recoverySectionIds": [
        "ambiguidade",
        "ex-explicitar"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "pt02.q05",
      "prompt": "Em D, “essa mudança” se refere:",
      "options": [
        "À transferência do encontro para sexta-feira.",
        "À troca obrigatória de todos os participantes.",
        "Ao cancelamento definitivo do encontro.",
        "À mudança de sala, expressamente informada."
      ],
      "answer": 0,
      "explanation": "Retoma a informação da primeira frase.",
      "optionRationales": [
        "Retoma a informação da primeira frase.",
        "Não foi informada troca de participantes.",
        "Transferir a data não equivale a cancelar definitivamente.",
        "Nenhuma sala foi mencionada."
      ],
      "recoverySectionIds": [
        "ideia"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "pt02.q06",
      "prompt": "Qual mudança acrescenta uma avaliação que não está em A?",
      "options": [
        "Trocar “esse volume” por “o livro de mapas”.",
        "Reescrever “um livro de mapas” como “o melhor livro de mapas”.",
        "Explicitar que o objeto ficou sobre a mesa.",
        "Retomar o livro usando a expressão já presente “esse volume”."
      ],
      "answer": 1,
      "explanation": "Acrescenta uma comparação avaliativa ausente.",
      "optionRationales": [
        "Neste contexto, preserva o objeto.",
        "Acrescenta uma comparação avaliativa ausente.",
        "A localização está expressa em A.",
        "A expressão já faz parte de A."
      ],
      "recoverySectionIds": [
        "texto-a",
        "limites"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "pt02.q07",
      "prompt": "Um leitor afirma que “essa mudança”, em D, prova alteração da duração do encontro. Qual correção é adequada?",
      "options": [
        "Afirmar que toda mudança de dia aumenta a duração.",
        "Trocar “sexta-feira” por qualquer sala sem reler.",
        "Voltar à primeira frase e retomar apenas a transferência de data informada.",
        "Eliminar a primeira frase e tratar o pronome como informação completa."
      ],
      "answer": 2,
      "explanation": "Reconstrói a referência sem acrescentar mudança de duração.",
      "optionRationales": [
        "Essa regra não foi dada e não decorre do trecho.",
        "Troca data por lugar sem apoio.",
        "Reconstrói a referência sem acrescentar mudança de duração.",
        "A referência depende da informação anterior."
      ],
      "recoverySectionIds": [
        "ideia",
        "recuperacao"
      ],
      "objectiveIds": [
        "O4"
      ]
    },
    {
      "id": "pt02.q08",
      "prompt": "Qual procedimento ajuda a recuperar uma questão com pronome ambíguo?",
      "options": [
        "Escolher sempre o último nome mencionado.",
        "Escolher sempre o primeiro nome mencionado.",
        "Acrescentar um terceiro participante para decidir.",
        "Testar os nomes na frase e verificar se as pistas realmente distinguem um deles."
      ],
      "answer": 3,
      "explanation": "Explicita as possibilidades e permite reconhecer a informação ausente.",
      "optionRationales": [
        "A distância sozinha não é uma prova universal.",
        "A posição inicial sozinha também não resolve todas as referências.",
        "Acrescenta um participante que o texto não forneceu.",
        "Explicita as possibilidades e permite reconhecer a informação ausente."
      ],
      "recoverySectionIds": [
        "ambiguidade",
        "recuperacao"
      ],
      "objectiveIds": [
        "O4"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "pt02-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "pt02.q01": [
        {
          "missionId": "draft.pt02",
          "sectionId": "texto-a"
        },
        {
          "missionId": "draft.pt02",
          "sectionId": "ex-volume"
        }
      ],
      "pt02.q02": [
        {
          "missionId": "draft.pt02",
          "sectionId": "pronome"
        },
        {
          "missionId": "draft.pt02",
          "sectionId": "ex-papeis"
        }
      ],
      "pt02.q03": [
        {
          "missionId": "draft.pt02",
          "sectionId": "ambiguidade"
        },
        {
          "missionId": "draft.pt02",
          "sectionId": "ex-explicitar"
        }
      ],
      "pt02.q04": [
        {
          "missionId": "draft.pt02",
          "sectionId": "ambiguidade"
        },
        {
          "missionId": "draft.pt02",
          "sectionId": "ex-explicitar"
        }
      ],
      "pt02.q05": [
        {
          "missionId": "draft.pt02",
          "sectionId": "ideia"
        }
      ],
      "pt02.q06": [
        {
          "missionId": "draft.pt02",
          "sectionId": "texto-a"
        },
        {
          "missionId": "draft.pt02",
          "sectionId": "limites"
        }
      ],
      "pt02.q07": [
        {
          "missionId": "draft.pt02",
          "sectionId": "ideia"
        },
        {
          "missionId": "draft.pt02",
          "sectionId": "recuperacao"
        }
      ],
      "pt02.q08": [
        {
          "missionId": "draft.pt02",
          "sectionId": "ambiguidade"
        },
        {
          "missionId": "draft.pt02",
          "sectionId": "recuperacao"
        }
      ]
    }
  }
};

export const EDITORIAL = {
  "stage": "Rascunho local desativado; parecer pedagógico independente concluído, sem aceite de publicação",
  "referenceOnlyProfiles": [
    {
      "id": "bb.agente-comercial.2022-001",
      "item": "Português: organização/tipologia textual e coesão/coerência, recorte do plano 05/mapa existente",
      "status": "histórico; referenceOnly"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Português: organização/tipologia textual e coesão/coerência, recorte do plano 05/mapa existente",
      "status": "histórico; referenceOnly"
    }
  ],
  "objectives": {
    "O1": "Localizar o referente de uma retomada explícita.",
    "O2": "Explicitar referências preservando os papéis e a ordem.",
    "O3": "Reconhecer ambiguidade ou informação acrescentada.",
    "O4": "Retomar a pista e reconstruir a referência sem inventar contexto."
  },
  "recovery": {
    "objectiveId": "O4",
    "instruction": "Localizar a pista textual, identificar a troca indevida e reconstruir a resposta."
  },
  "limits": [
    "Recorte previsto em docs/missao-bancaria/05-FASE-4-PORTUGUES-MATEMATICA.md e curriculum-v1.js, sem abrir formalmente a Fase 4.",
    "Textos A/B e frases são integralmente criados pelo autor para exercícios; não são citações, notícias ou instruções de serviços reais.",
    "Sem norma mutável, fonte jurídica ou consulta real nesta unidade; não fabricar fonte bibliográfica para texto autoral.",
    "Correspondência preliminar ao bloco existente não afirma cobertura integral de item/subitem de edital, adoção de edital vigente ou avaliação independente.",
    "Sem XP, ordem, importação no runtime, alteração de progresso, aceite humano ou publicação.",
    "Recorte inicial de portuguese.text; não apresenta classificação completa de tipos/gêneros, teoria linguística exaustiva ou cobertura integral de edital."
  ]
};

export const ARITHMETIC = [];
