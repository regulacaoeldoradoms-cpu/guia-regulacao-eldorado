// Ensino e exemplos autorais; primeira unidade local fora do catálogo.
export const SOURCES = [];
export const SM01_DRAFT = {
  "id": "draft.sm01",
  "topicId": "draft.sm01",
  "editorialKey": "SM-01",
  "candidateBlockId": "portuguese.meaning-writing",
  "title": "Semântica: usar pistas para escolher o sentido",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Interpretar sentidos e substituições nos textos fornecidos, sem tratar definição isolada como resposta automática.",
  "sourceIds": [],
  "sections": [
    {
      "id": "entrada",
      "heading": "1. Sentido no texto",
      "body": "Semântica trata de significados. Neste começo, vamos apenas interpretar palavras nas frases autorais fornecidas. A mesma forma escrita pode ter usos diferentes; a leitura deve considerar ação, palavras próximas e assunto. Não se exige listar todas as acepções de dicionário nem classificar teorias de significado.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "contexto",
      "heading": "2. Pistas que selecionam um uso",
      "body": "Compare A aluna sentou no banco de madeira da praça e O banco aprovou o pedido de abertura da conta. No primeiro, sentou, madeira e praça apontam para assento; no segundo, aprovar abertura de conta aponta para instituição financeira. São textos fictícios; não orientam abertura real de conta. A palavra isolada não permite escolher entre todos os usos.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "substituir",
      "heading": "3. Troca conforme o contexto",
      "body": "Em A equipe analisou o problema, examinou preserva a ideia básica de análise no contexto fornecido. Ignorou mudaria a ação. Isso não afirma que analisar e examinar sejam equivalentes em qualquer construção, registro ou nuance. Para uma troca, releia a frase inteira e compare o que se afirma, sem inventar fatos.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "literal",
      "heading": "4. Referência física e uso figurado",
      "body": "A ponte de concreto liga margens do rio descreve uma construção física. Em O diálogo foi uma ponte entre posições diferentes, com contexto sem obra ou rio, ponte representa aproximação. Neste recorte chamamos o segundo uso de figurado; isso não quer dizer automaticamente falso ou mentira. Não supor que toda palavra tenha só um sentido literal nem que todos os textos se dividam rigidamente em uma única categoria.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "ex-contexto",
      "heading": "5. Exemplo resolvido: duas frases com banco",
      "body": "Marque sentou/de madeira/praça e escolha assento. Na frase de abertura de conta, marque aprovou/pedido/conta e escolha instituição. A interpretação vem de pistas do trecho. Não concluir salário, titularidade ou direitos que as frases não informam.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "ex-troca",
      "heading": "6. Exemplo resolvido: analisar e ignorar",
      "body": "A equipe analisou o problema afirma uma ação de exame. Examinou preserva a ideia básica dada. Ignorou afirma outra ação e não é troca equivalente nesse contexto. A semelhança de tema ou classe verbal não garante preservar sentido.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "ex-figurado",
      "heading": "7. Exemplo resolvido: ponte no diálogo",
      "body": "Na reunião, o diálogo foi uma ponte entre posições diferentes; não havia rio nem obra. O contexto bloqueia uma leitura de construção física. A ideia comunicada é aproximação entre posições; isso não autoriza inferir acordo total, duração ou fatos não mencionados.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "limites",
      "heading": "8. Alcance desta primeira unidade",
      "body": "Só interpretar os textos e as trocas fornecidas. Não é lista normativa de acepções, definição de sinônimos perfeitos, todas as figuras de linguagem, distinção técnica completa de polissemia/homonímia, ambiguidade, pressuposição ou colocação pronominal. Essas ampliações terão ensino específico; figurado não prova falsidade.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "heading": "Vocabulário de apoio",
      "body": "Contexto: informações da frase/situação que ajudam a interpretar. Pista: elemento do texto que sustenta uma leitura. Sentido próximo: ideia semelhante neste uso, sem igualdade universal. Figurado: no exemplo de ponte, uso para representar aproximação, sem relatar obra física.",
      "type": "glossary",
      "sourceIds": []
    },
    {
      "id": "recuperacao",
      "heading": "Refazer pelas pistas",
      "body": "Sublinhe palavras próximas e ação; diga qual interpretação elas sustentam e qual excluem. Numa substituição, compare o que a frase afirma. Se escolheu definição isolada, volte ao contexto antes de tentar novamente.",
      "type": "summary",
      "sourceIds": []
    }
  ],
  "recall": [
    "Que pistas sustentam a leitura?",
    "A troca conserva a ideia básica neste contexto?",
    "Que inferência o texto não autoriza?"
  ],
  "questions": [
    {
      "id": "sm01.q01",
      "prompt": "Texto: A aluna sentou no banco de madeira da praça. No trecho dado, banco designa o quê?",
      "options": [
        "Instituição financeira.",
        "Assento de madeira.",
        "Um prazo de entrega.",
        "Uma conclusão obrigatória sobre renda."
      ],
      "answer": 1,
      "explanation": "Sentou e de madeira da praça selecionam o assento neste contexto.",
      "optionRationales": [
        "O material e a ação de sentar selecionam o assento, não a instituição.",
        "Sentou e de madeira da praça selecionam o assento neste contexto.",
        "Não há prazo no trecho.",
        "O trecho não permite inferir renda."
      ],
      "recoverySectionIds": [
        "contexto"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "sm01.q02",
      "prompt": "Texto: O banco aprovou o pedido de abertura da conta. Qual leitura de banco o contexto sustenta?",
      "options": [
        "Assento usado para descansar.",
        "Uma peça de madeira da praça.",
        "Um período do dia.",
        "Instituição financeira."
      ],
      "answer": 3,
      "explanation": "Ação de aprovar abertura de conta seleciona instituição no contexto fictício.",
      "optionRationales": [
        "Aprovar abertura de conta não descreve uso de assento.",
        "O trecho não fala de praça ou material.",
        "Banco não designa período neste uso.",
        "Ação de aprovar abertura de conta seleciona instituição no contexto fictício."
      ],
      "recoverySectionIds": [
        "ex-contexto"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "sm01.q03",
      "prompt": "Texto: A equipe analisou o problema. Para preservar o sentido básico neste contexto, qual troca é adequada?",
      "options": [
        "Examinou o problema.",
        "Ignorou o problema.",
        "Criou obrigatoriamente o problema.",
        "Escondeu necessariamente o problema."
      ],
      "answer": 0,
      "explanation": "Examinou preserva a ideia de analisar neste contexto, sem afirmar equivalência universal.",
      "optionRationales": [
        "Examinou preserva a ideia de analisar neste contexto, sem afirmar equivalência universal.",
        "Ignorar muda a ação.",
        "Analisar não implica criar o problema.",
        "Não há ocultação obrigatória."
      ],
      "recoverySectionIds": [
        "substituir"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "sm01.q04",
      "prompt": "Por que a troca analisou por examinou neste exemplo não prova que as palavras sejam intercambiáveis em toda frase?",
      "options": [
        "Porque palavras nunca têm sentidos próximos.",
        "Porque o tamanho das palavras sempre decide.",
        "Porque a equivalência foi avaliada no contexto e na ideia básica dada.",
        "Porque qualquer verbo deve substituir qualquer nome."
      ],
      "answer": 2,
      "explanation": "É uma adequação contextual delimitada, não igualdade universal.",
      "optionRationales": [
        "Sentidos próximos podem ocorrer no contexto.",
        "Comprimento não prova equivalência.",
        "É uma adequação contextual delimitada, não igualdade universal.",
        "Classes e funções não podem ser trocadas assim."
      ],
      "recoverySectionIds": [
        "limites"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "sm01.q05",
      "prompt": "Texto: A ponte de concreto liga as duas margens do rio. No caso dado, ponte tem qual uso?",
      "options": [
        "Uso obrigatório de instituição financeira.",
        "Referência concreta a uma construção que liga margens.",
        "Sentido de prazo escolar.",
        "Negação da existência de rio."
      ],
      "answer": 1,
      "explanation": "Concreto e margens do rio sustentam leitura física no trecho.",
      "optionRationales": [
        "O texto informa estrutura física, não instituição.",
        "Concreto e margens do rio sustentam leitura física no trecho.",
        "Não há prazo no texto.",
        "O rio está explicitado, não negado."
      ],
      "recoverySectionIds": [
        "literal"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "sm01.q06",
      "prompt": "Texto: Na reunião, o diálogo foi uma ponte entre posições diferentes; não havia rio nem obra. Qual interpretação é sustentada?",
      "options": [
        "Construíram necessariamente uma ponte de concreto.",
        "Todas as posições desapareceram.",
        "A reunião só tratava de transporte fluvial.",
        "O diálogo aproximou as posições, em uso figurado de ponte."
      ],
      "answer": 3,
      "explanation": "Ponte representa aproximação entre posições, sem construção literal no caso dado.",
      "optionRationales": [
        "O próprio contexto exclui obra física.",
        "Aproximação não implica apagar todas as posições.",
        "O trecho exclui rio e trata de posições.",
        "Ponte representa aproximação entre posições, sem construção literal no caso dado."
      ],
      "recoverySectionIds": [
        "ex-figurado"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "sm01.q07",
      "prompt": "O estudante escolheu o sentido de banco por lembrar uma definição isolada, ignorando sentou e de madeira. O que deve retomar?",
      "options": [
        "As pistas da frase e a ação ligada à palavra.",
        "Só a primeira letra da palavra.",
        "Uma conclusão sobre dinheiro não mencionada.",
        "A regra de que banco só tem um uso."
      ],
      "answer": 0,
      "explanation": "As pistas delimitam qual leitura cabe no contexto.",
      "optionRationales": [
        "As pistas delimitam qual leitura cabe no contexto.",
        "A letra inicial não resolve o sentido.",
        "Não se deve inventar informação externa.",
        "O lote mostrou dois usos contextuais."
      ],
      "recoverySectionIds": [
        "recuperacao"
      ],
      "objectiveIds": [
        "O4"
      ]
    },
    {
      "id": "sm01.q08",
      "prompt": "Qual cuidado é coerente com o recorte introdutório de sentidos?",
      "options": [
        "Todo sentido figurado é necessariamente mentira.",
        "Uma palavra tem sempre o mesmo sentido.",
        "Interpretar pelas pistas e não confundir sentido figurado com falsidade automática.",
        "Toda troca por palavra próxima preserva qualquer mensagem."
      ],
      "answer": 2,
      "explanation": "O contexto seleciona a leitura; figurado não equivale automaticamente a falsidade.",
      "optionRationales": [
        "Uso figurado pode comunicar uma ideia sem ser relato físico literal.",
        "Os exemplos mostram sentidos diferentes.",
        "O contexto seleciona a leitura; figurado não equivale automaticamente a falsidade.",
        "A adequação precisa ser avaliada em cada contexto."
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
    "editorialPass": "sm01-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "sm01.q01": [
        {
          "missionId": "draft.sm01",
          "sectionId": "contexto"
        }
      ],
      "sm01.q02": [
        {
          "missionId": "draft.sm01",
          "sectionId": "ex-contexto"
        }
      ],
      "sm01.q03": [
        {
          "missionId": "draft.sm01",
          "sectionId": "substituir"
        }
      ],
      "sm01.q04": [
        {
          "missionId": "draft.sm01",
          "sectionId": "limites"
        }
      ],
      "sm01.q05": [
        {
          "missionId": "draft.sm01",
          "sectionId": "literal"
        }
      ],
      "sm01.q06": [
        {
          "missionId": "draft.sm01",
          "sectionId": "ex-figurado"
        }
      ],
      "sm01.q07": [
        {
          "missionId": "draft.sm01",
          "sectionId": "recuperacao"
        }
      ],
      "sm01.q08": [
        {
          "missionId": "draft.sm01",
          "sectionId": "limites"
        }
      ]
    }
  }
};
export const EDITORIAL = {
  "stage": "Rascunho local fora do catálogo; parecer independente favorável, sem correções necessárias",
  "objectives": {
    "O1": "Identificar pistas e sentido no trecho.",
    "O2": "Interpretar e substituir nos exemplos delimitados.",
    "O3": "Evitar equivalência universal e inferências indevidas.",
    "O4": "Retomar as pistas ignoradas."
  },
  "recovery": {
    "objectiveId": "O4",
    "instruction": "Identificar ação/palavras próximas, justificar o sentido no trecho e testar a troca."
  },
  "limits": [
    "Plano05, bloco já existente portuguese.meaning-writing; nenhuma alteração do currículo ou arquitetura.",
    "Ensino/frases/questões autorais, sem atribuição de definição lexical a dicionário ou manual não conferido. Nenhuma regra jurídica ou fato real de aluno.",
    "Primeira unidade introdutória; sinônimos/antônimos contextuais e ambiguidade/reescrita são próximos recortes, sem cobertura integral de edital.",
    "Fora catálogo e sem candidato/XP/ordem; sem push/ativação/merge/deploy/D1, fase formal ou aceite humano."
  ]
};
export const ARITHMETIC = [];
