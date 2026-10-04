// Gerado por node worker/scripts/studies-sm-candidate.mjs --write. Não editar.
// Rascunhos SM locais. Desativado; sem autorização de ativação/publicação.
export const SM_MISSIONS = Object.freeze([
  {
    "id": "portuguese.meaning.semantics.contexto",
    "topicId": "portuguese.meaning.semantics.contexto",
    "contentVersion": 1,
    "order": 117,
    "title": "Semântica: usar pistas para escolher o sentido",
    "shortTitle": "SM-01",
    "kind": "lesson",
    "objective": "Interpretar sentidos e substituições nos textos fornecidos, sem tratar definição isolada como resposta automática.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "meaning-sm-intro-r1",
      "releaseSequence": 16,
      "changeImpact": "new"
    },
    "sourceIds": [
      "sm.sm01.authorial.sm01"
    ],
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
        "id": "q.sm01.q01",
        "topicId": "portuguese.meaning.semantics.contexto",
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
        ]
      },
      {
        "id": "q.sm01.q02",
        "topicId": "portuguese.meaning.semantics.contexto",
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
        ]
      },
      {
        "id": "q.sm01.q03",
        "topicId": "portuguese.meaning.semantics.contexto",
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
        ]
      },
      {
        "id": "q.sm01.q04",
        "topicId": "portuguese.meaning.semantics.contexto",
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
        ]
      },
      {
        "id": "q.sm01.q05",
        "topicId": "portuguese.meaning.semantics.contexto",
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
        ]
      },
      {
        "id": "q.sm01.q06",
        "topicId": "portuguese.meaning.semantics.contexto",
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
        ]
      },
      {
        "id": "q.sm01.q07",
        "topicId": "portuguese.meaning.semantics.contexto",
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
        ]
      },
      {
        "id": "q.sm01.q08",
        "topicId": "portuguese.meaning.semantics.contexto",
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
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "sm01-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.sm01.q01": [
          {
            "missionId": "portuguese.meaning.semantics.contexto",
            "sectionId": "contexto"
          }
        ],
        "q.sm01.q02": [
          {
            "missionId": "portuguese.meaning.semantics.contexto",
            "sectionId": "ex-contexto"
          }
        ],
        "q.sm01.q03": [
          {
            "missionId": "portuguese.meaning.semantics.contexto",
            "sectionId": "substituir"
          }
        ],
        "q.sm01.q04": [
          {
            "missionId": "portuguese.meaning.semantics.contexto",
            "sectionId": "limites"
          }
        ],
        "q.sm01.q05": [
          {
            "missionId": "portuguese.meaning.semantics.contexto",
            "sectionId": "literal"
          }
        ],
        "q.sm01.q06": [
          {
            "missionId": "portuguese.meaning.semantics.contexto",
            "sectionId": "ex-figurado"
          }
        ],
        "q.sm01.q07": [
          {
            "missionId": "portuguese.meaning.semantics.contexto",
            "sectionId": "recuperacao"
          }
        ],
        "q.sm01.q08": [
          {
            "missionId": "portuguese.meaning.semantics.contexto",
            "sectionId": "limites"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.sm01",
      "blockId": "portuguese.meaning-writing",
      "prerequisiteId": "portuguese.syntax.crase.boss",
      "parametersApproved": false
    }
  },
  {
    "id": "portuguese.meaning.semantics.relacoes",
    "topicId": "portuguese.meaning.semantics.relacoes",
    "contentVersion": 1,
    "order": 118,
    "title": "Relações de sentido: proximidade e oposição no contexto",
    "shortTitle": "SM-02",
    "kind": "lesson",
    "objective": "Interpretar relações de sentido e reescrever os textos fornecidos, preservando contexto, referência e informação.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "meaning-sm-intro-r1",
      "releaseSequence": 16,
      "changeImpact": "new"
    },
    "sourceIds": [
      "sm.sm02.authorial.sm02"
    ],
    "sections": [
      {
        "id": "entrada",
        "heading": "1. Retomar a frase inteira",
        "body": "SM01 mostrou que sentidos dependem de pistas. Aqui comparamos trocas próximas e oposições em frases autorais. Podemos chamar sentidos próximos de sinônimos no contexto; oposição será examinada na dimensão informada. Não é tabela normativa de equivalência universal de palavras.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "proximos",
        "heading": "2. A ideia básica e as nuances",
        "body": "A explicação foi clara afirma que se compreendeu o conteúdo. No contexto que informa compreensão, compreensível preserva a ideia básica; confusa muda essa avaliação. Não afirmar que clara e compreensível sejam intercambiáveis em todo texto, pois clara pode tratar de cor/luminosidade em outros contextos.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "opostos",
        "heading": "3. Qual dimensão se opõe",
        "body": "O prazo foi ampliado: o enunciado informa aumento de duração. Reduzido contrasta com ampliado na dimensão duração; esclarecido não representa esse contrário. Aqui oposição não exige que as palavras sejam incompatíveis em todos os sentidos nem explica todas as classes de antônimos.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "negacao",
        "heading": "4. Negar não escolhe um extremo",
        "body": "No contexto de uma escala com graus intermediários, A explicação não foi muito clara não afirma automaticamente que foi totalmente incompreensível. Pode ter alguma clareza sem atingir o grau muito clara. Preserve muito e não; não transformar negação de um grau em certeza do extremo oposto.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "ex-proximos",
        "heading": "5. Exemplo resolvido: explicação",
        "body": "O texto informa que a explicação pôde ser compreendida: clara e compreensível aproximam-se na ideia básica. Confusa altera a avaliação. Teste no trecho, sem levar clara para um uso de cor nem inferir que todas as nuances são idênticas.",
        "type": "worked-example",
        "sourceIds": []
      },
      {
        "id": "ex-opostos",
        "heading": "6. Exemplo resolvido: duração",
        "body": "O prazo foi ampliado significa duração aumentada no enunciado dado. O prazo foi reduzido expressa diminuição nessa mesma dimensão. O prazo foi explicado altera o tipo de ação, sem fornecer o contraste de duração pedido.",
        "type": "worked-example",
        "sourceIds": []
      },
      {
        "id": "ex-negacao",
        "heading": "7. Exemplo resolvido: grau",
        "body": "A instrução não foi muito clara, e parte dela pôde ser entendida. O próprio complemento mostra grau intermediário. Totalmente incompreensível contradiria essa parte entendida; totalmente clara apagaria a negação de muito clara.",
        "type": "worked-example",
        "sourceIds": []
      },
      {
        "id": "limites",
        "heading": "8. Não sair da dimensão informada",
        "body": "Troca adequada depende de contexto, registro e alcance. Oposto em uma dimensão não vira inversão de todos os fatos. Não muito clara não é prova de ausência absoluta de compreensão. Não se cobra lista lexical técnica, pressuposição completa ou sinônimos perfeitos.",
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
        "id": "q.sm02.q01",
        "topicId": "portuguese.meaning.semantics.relacoes",
        "prompt": "O trecho afirma que a explicação pôde ser compreendida. Que troca preserva a ideia básica de clara nesse contexto?",
        "options": [
          "Escura, como descrição obrigatória de cor.",
          "Confusa.",
          "Compreensível.",
          "Inexistente."
        ],
        "answer": 2,
        "explanation": "Compreensível mantém a ideia de compreensão explicitada.",
        "optionRationales": [
          "O contexto não trata de cor.",
          "Confusa muda a avaliação.",
          "Compreensível mantém a ideia de compreensão explicitada.",
          "A explicação existe no trecho."
        ]
      },
      {
        "id": "q.sm02.q02",
        "topicId": "portuguese.meaning.semantics.relacoes",
        "prompt": "Por que clara/compreensível neste exemplo não formam equivalência universal?",
        "options": [
          "Clara pode ter outros usos e a troca foi avaliada apenas no contexto dado.",
          "Todas as palavras são incompatíveis em qualquer frase.",
          "Somente palavras do mesmo tamanho podem ser próximas.",
          "O contexto nunca interfere."
        ],
        "answer": 0,
        "explanation": "O sentido escolhido e as nuances dependem do trecho.",
        "optionRationales": [
          "O sentido escolhido e as nuances dependem do trecho.",
          "Há aproximação possível neste uso.",
          "Tamanho não decide a relação.",
          "O contexto foi justamente a condição."
        ]
      },
      {
        "id": "q.sm02.q03",
        "topicId": "portuguese.meaning.semantics.relacoes",
        "prompt": "O prazo foi ampliado, com aumento de duração. Qual palavra contrasta na mesma dimensão?",
        "options": [
          "Lido.",
          "Explicado.",
          "Colorido.",
          "Reduzido."
        ],
        "answer": 3,
        "explanation": "Reduzido indica diminuição de duração no caso dado.",
        "optionRationales": [
          "Ler não expressa esse contraste de duração.",
          "Explicar não informa diminuição da duração.",
          "Cor não é a dimensão dada.",
          "Reduzido indica diminuição de duração no caso dado."
        ]
      },
      {
        "id": "q.sm02.q04",
        "topicId": "portuguese.meaning.semantics.relacoes",
        "prompt": "Qual informação precisa ser mantida ao interpretar ampliado/reduzido como opostos no caso?",
        "options": [
          "Toda característica foi invertida.",
          "A comparação trata da duração do prazo.",
          "O prazo deixou obrigatoriamente de existir.",
          "A pessoa mudou necessariamente de cargo."
        ],
        "answer": 1,
        "explanation": "A oposição foi delimitada a uma dimensão.",
        "optionRationales": [
          "O caso não afirma inversão total.",
          "A oposição foi delimitada a uma dimensão.",
          "Diminuir duração não equivale a inexistência.",
          "Cargo não foi mencionado."
        ]
      },
      {
        "id": "q.sm02.q05",
        "topicId": "portuguese.meaning.semantics.relacoes",
        "prompt": "Há graus intermediários: a instrução não foi muito clara, e parte pôde ser entendida. Qual leitura é sustentada?",
        "options": [
          "Não atingiu o grau muito clara, sem ser necessariamente incompreensível por completo.",
          "Nada foi entendido obrigatoriamente.",
          "Tudo foi entendido com total clareza.",
          "A instrução foi apagada do texto."
        ],
        "answer": 0,
        "explanation": "A negação de muito clara permite grau intermediário, explicitado pela parte entendida.",
        "optionRationales": [
          "A negação de muito clara permite grau intermediário, explicitado pela parte entendida.",
          "Contradiz a parte entendida.",
          "Apaga a negação e exagera a informação.",
          "Não há apagamento informado."
        ]
      },
      {
        "id": "q.sm02.q06",
        "topicId": "portuguese.meaning.semantics.relacoes",
        "prompt": "Qual troca altera a avaliação no contexto em que clara significa compreensível?",
        "options": [
          "Que pôde ser entendida, conforme o contexto.",
          "Compreensível, mantendo a ideia básica.",
          "Confusa.",
          "Entendível, no sentido de possível de entender dado."
        ],
        "answer": 2,
        "explanation": "Confusa não conserva a avaliação de clareza indicada.",
        "optionRationales": [
          "Mantém a condição informada.",
          "Conserva a ideia básica no caso dado.",
          "Confusa não conserva a avaliação de clareza indicada.",
          "Também conserva a ideia básica delimitada."
        ]
      },
      {
        "id": "q.sm02.q07",
        "topicId": "portuguese.meaning.semantics.relacoes",
        "prompt": "O estudante interpretou não muito clara como totalmente incompreensível. Que recuperação é adequada?",
        "options": [
          "Apagar a palavra não.",
          "Retomar o grau muito, a negação e a parte explicitamente entendida.",
          "Desconsiderar o resto da frase.",
          "Transformar qualquer negação em extremo contrário."
        ],
        "answer": 1,
        "explanation": "Essas pistas evitam substituir grau intermediário por extremo não afirmado.",
        "optionRationales": [
          "Apagar não mudaria o conteúdo.",
          "Essas pistas evitam substituir grau intermediário por extremo não afirmado.",
          "O restante fornece evidência importante.",
          "É justamente a generalização errada."
        ]
      },
      {
        "id": "q.sm02.q08",
        "topicId": "portuguese.meaning.semantics.relacoes",
        "prompt": "Qual cuidado evita ampliar a oposição de prazo ampliado/reduzido?",
        "options": [
          "Escolher só pelo som das palavras.",
          "Deduzir renda pela palavra prazo.",
          "Afirmar que todo oposto nega qualquer informação da frase.",
          "Comparar a mesma dimensão sem inventar outros fatos."
        ],
        "answer": 3,
        "explanation": "A duração é a dimensão fornecida para o contraste.",
        "optionRationales": [
          "Som não estabelece o conteúdo neste caso.",
          "Não há renda informada.",
          "O contraste não inverte automaticamente todos os fatos.",
          "A duração é a dimensão fornecida para o contraste."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "sm02-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.sm02.q01": [
          {
            "missionId": "portuguese.meaning.semantics.relacoes",
            "sectionId": "proximos"
          }
        ],
        "q.sm02.q02": [
          {
            "missionId": "portuguese.meaning.semantics.relacoes",
            "sectionId": "limites"
          }
        ],
        "q.sm02.q03": [
          {
            "missionId": "portuguese.meaning.semantics.relacoes",
            "sectionId": "opostos"
          }
        ],
        "q.sm02.q04": [
          {
            "missionId": "portuguese.meaning.semantics.relacoes",
            "sectionId": "ex-opostos"
          }
        ],
        "q.sm02.q05": [
          {
            "missionId": "portuguese.meaning.semantics.relacoes",
            "sectionId": "negacao"
          }
        ],
        "q.sm02.q06": [
          {
            "missionId": "portuguese.meaning.semantics.relacoes",
            "sectionId": "ex-proximos"
          }
        ],
        "q.sm02.q07": [
          {
            "missionId": "portuguese.meaning.semantics.relacoes",
            "sectionId": "ex-negacao"
          }
        ],
        "q.sm02.q08": [
          {
            "missionId": "portuguese.meaning.semantics.relacoes",
            "sectionId": "limites"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.sm02",
      "blockId": "portuguese.meaning-writing",
      "prerequisiteId": "portuguese.meaning.semantics.contexto",
      "parametersApproved": false
    }
  },
  {
    "id": "portuguese.meaning.semantics.clareza",
    "topicId": "portuguese.meaning.semantics.clareza",
    "contentVersion": 1,
    "order": 119,
    "title": "Ambiguidade: explicitar a leitura sem inventar fatos",
    "shortTitle": "SM-03",
    "kind": "lesson",
    "objective": "Interpretar relações de sentido e reescrever os textos fornecidos, preservando contexto, referência e informação.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "meaning-sm-intro-r1",
      "releaseSequence": 16,
      "changeImpact": "new"
    },
    "sourceIds": [
      "sm.sm03.incaper.clareza",
      "sm.sm03.authorial.sm03"
    ],
    "sections": [
      {
        "id": "entrada",
        "heading": "1. Clareza e informação",
        "body": "O Manual de Produção Editorial do Incaper orienta clareza e evitar ambiguidade em textos técnicos/científicos. Usaremos essa finalidade em frases autorais: se o trecho permite mais de uma leitura, não adivinhar intenção real. Uma reescrita deve representar a intenção explicitada no enunciado.",
        "type": "explanation",
        "sourceIds": [
          "sm.sm03.incaper.clareza"
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
        "id": "q.sm03.q01",
        "topicId": "portuguese.meaning.semantics.clareza",
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
        ]
      },
      {
        "id": "q.sm03.q02",
        "topicId": "portuguese.meaning.semantics.clareza",
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
        ]
      },
      {
        "id": "q.sm03.q03",
        "topicId": "portuguese.meaning.semantics.clareza",
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
        ]
      },
      {
        "id": "q.sm03.q04",
        "topicId": "portuguese.meaning.semantics.clareza",
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
        ]
      },
      {
        "id": "q.sm03.q05",
        "topicId": "portuguese.meaning.semantics.clareza",
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
        ]
      },
      {
        "id": "q.sm03.q06",
        "topicId": "portuguese.meaning.semantics.clareza",
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
        ]
      },
      {
        "id": "q.sm03.q07",
        "topicId": "portuguese.meaning.semantics.clareza",
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
        ]
      },
      {
        "id": "q.sm03.q08",
        "topicId": "portuguese.meaning.semantics.clareza",
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
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "sm03-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.sm03.q01": [
          {
            "missionId": "portuguese.meaning.semantics.clareza",
            "sectionId": "referencia"
          }
        ],
        "q.sm03.q02": [
          {
            "missionId": "portuguese.meaning.semantics.clareza",
            "sectionId": "ex-referencia"
          }
        ],
        "q.sm03.q03": [
          {
            "missionId": "portuguese.meaning.semantics.clareza",
            "sectionId": "ex-conteudo"
          }
        ],
        "q.sm03.q04": [
          {
            "missionId": "portuguese.meaning.semantics.clareza",
            "sectionId": "alcance"
          }
        ],
        "q.sm03.q05": [
          {
            "missionId": "portuguese.meaning.semantics.clareza",
            "sectionId": "ex-agente"
          }
        ],
        "q.sm03.q06": [
          {
            "missionId": "portuguese.meaning.semantics.clareza",
            "sectionId": "limites"
          }
        ],
        "q.sm03.q07": [
          {
            "missionId": "portuguese.meaning.semantics.clareza",
            "sectionId": "ex-conteudo"
          }
        ],
        "q.sm03.q08": [
          {
            "missionId": "portuguese.meaning.semantics.clareza",
            "sectionId": "separar"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.sm03",
      "blockId": "portuguese.meaning-writing",
      "prerequisiteId": "portuguese.meaning.semantics.relacoes",
      "parametersApproved": false
    }
  },
  {
    "id": "portuguese.meaning.semantics.revisao",
    "topicId": "portuguese.meaning.semantics.revisao",
    "contentVersion": 1,
    "order": 120,
    "title": "Semântica: revisão contextual cumulativa",
    "shortTitle": "SM-R",
    "kind": "lesson",
    "objective": "Interpretar relações de sentido e reescrever os textos fornecidos, preservando contexto, referência e informação.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "meaning-sm-intro-r1",
      "releaseSequence": 16,
      "changeImpact": "new"
    },
    "sourceIds": [
      "sm.smr.incaper.clareza",
      "sm.smr.authorial.smr"
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
        "id": "ex-contexto",
        "heading": "4. Exemplo resolvido: contexto",
        "body": "Sentou no banco de madeira seleciona assento; banco aprovou conta seleciona instituição no texto fictício. Não inferir dinheiro de toda ocorrência de banco.",
        "type": "worked-example",
        "sourceIds": []
      },
      {
        "id": "ex-relacoes",
        "heading": "5. Exemplo resolvido: grau e contraste",
        "body": "Prazo ampliado/reduzido opõe duração. Instrução não muito clara, mas parcialmente entendida admite grau intermediário e não prova incompreensão total.",
        "type": "worked-example",
        "sourceIds": []
      },
      {
        "id": "ex-clareza",
        "heading": "6. Exemplo resolvido: pessoa e dia",
        "body": "Se a intenção é roteiro de Bia, explicite de Bia. Ontem, duas alunas revisaram o texto conserva o conteúdo de Duas alunas revisaram o texto ontem. Não mudar para todas/amanhã.",
        "type": "worked-example",
        "sourceIds": []
      },
      {
        "id": "retomadas",
        "heading": "7. Recuperar pelo trecho",
        "body": "[SM-01](sm-01-v1.md) · [SM-02](sm-02-v1.md) · [SM-03](sm-03-v1.md)",
        "type": "explanation",
        "sourceIds": [],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "SM-01",
                "missionId": "portuguese.meaning.semantics.contexto",
                "sectionId": "entrada",
                "wholeLesson": true
              },
              {
                "text": " · "
              },
              {
                "text": "SM-02",
                "missionId": "portuguese.meaning.semantics.relacoes",
                "sectionId": "entrada",
                "wholeLesson": true
              },
              {
                "text": " · "
              },
              {
                "text": "SM-03",
                "missionId": "portuguese.meaning.semantics.clareza",
                "sectionId": "entrada",
                "wholeLesson": true
              }
            ]
          }
        ]
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
        "id": "q.smr.q01",
        "topicId": "portuguese.meaning.semantics.revisao",
        "prompt": "Texto: A estudante descansou sentada no banco de madeira. Que pista favorece assento?",
        "options": [
          "Descansou sentada e de madeira.",
          "Somente a quantidade de letras de banco.",
          "Uma renda não mencionada.",
          "A certeza de abertura de conta."
        ],
        "answer": 0,
        "explanation": "A ação e o material sustentam a leitura de assento.",
        "optionRationales": [
          "A ação e o material sustentam a leitura de assento.",
          "Letras não selecionam a acepção no trecho.",
          "Não há renda informada.",
          "Não há abertura de conta."
        ]
      },
      {
        "id": "q.smr.q02",
        "topicId": "portuguese.meaning.semantics.revisao",
        "prompt": "No contexto de uma equipe que examinou um problema, qual troca conserva a ideia básica de analisou?",
        "options": [
          "Apagou necessariamente.",
          "Ignorou.",
          "Examinou.",
          "Criou obrigatoriamente."
        ],
        "answer": 2,
        "explanation": "Examinou aproxima-se da ação de analisar no contexto informado.",
        "optionRationales": [
          "Não há apagamento necessário.",
          "Muda a ação.",
          "Examinou aproxima-se da ação de analisar no contexto informado.",
          "Analisar não implica criar."
        ]
      },
      {
        "id": "q.smr.q03",
        "topicId": "portuguese.meaning.semantics.revisao",
        "prompt": "A explicação foi clara no sentido de pôde ser compreendida. Qual troca preserva essa ideia básica?",
        "options": [
          "Foi inexistente.",
          "Foi compreensível.",
          "Foi obrigatoriamente escura.",
          "Foi incompreensível."
        ],
        "answer": 1,
        "explanation": "Compreensível conserva a ideia no contexto delimitado.",
        "optionRationales": [
          "Nega existência não negada.",
          "Compreensível conserva a ideia no contexto delimitado.",
          "O trecho não descreve cor.",
          "Muda a avaliação."
        ]
      },
      {
        "id": "q.smr.q04",
        "topicId": "portuguese.meaning.semantics.revisao",
        "prompt": "O prazo teve duração aumentada. Qual termo contrasta nessa dimensão com ampliado?",
        "options": [
          "Explicado.",
          "Escrito.",
          "Lido.",
          "Reduzido."
        ],
        "answer": 3,
        "explanation": "Reduzido indica diminuição da duração no caso.",
        "optionRationales": [
          "Explicar não indica diminuir duração.",
          "Escrever não é esse contraste.",
          "Ler não opõe duração.",
          "Reduzido indica diminuição da duração no caso."
        ]
      },
      {
        "id": "q.smr.q05",
        "topicId": "portuguese.meaning.semantics.revisao",
        "prompt": "Parte da instrução foi entendida, mas ela não foi muito clara. Que cuidado se aplica?",
        "options": [
          "Apagar a palavra não.",
          "Concluir que nada foi entendido.",
          "Não converter a negação de muito clara em incompreensão total.",
          "Afirmar compreensão total obrigatória."
        ],
        "answer": 2,
        "explanation": "A parte entendida e o grau intermediário impedem o extremo não afirmado.",
        "optionRationales": [
          "Muda o conteúdo.",
          "Contradiz a parte entendida.",
          "A parte entendida e o grau intermediário impedem o extremo não afirmado.",
          "Exagera a informação."
        ]
      },
      {
        "id": "q.smr.q06",
        "topicId": "portuguese.meaning.semantics.revisao",
        "prompt": "Intenção dada: o roteiro é de Bia. Qual expressão esclarece seu roteiro na frase com Ana e Bia?",
        "options": [
          "O roteiro de Bia.",
          "O roteiro de Ana.",
          "Todos os roteiros.",
          "O roteiro de ambas obrigatoriamente."
        ],
        "answer": 0,
        "explanation": "Identifica a referência pretendida sem acrescentar fatos.",
        "optionRationales": [
          "Identifica a referência pretendida sem acrescentar fatos.",
          "Escolhe outra pessoa.",
          "Acrescenta totalidade.",
          "Acrescenta compartilhamento."
        ]
      },
      {
        "id": "q.smr.q07",
        "topicId": "portuguese.meaning.semantics.revisao",
        "prompt": "Qual informação muda ao trocar duas revisaram ontem por todas revisarão amanhã?",
        "options": [
          "Somente a cor da palavra.",
          "Só o tamanho da frase.",
          "Nenhuma informação.",
          "Quantidade e tempo/dia."
        ],
        "answer": 3,
        "explanation": "Duas/todas e passado/amanhã mudam o conteúdo.",
        "optionRationales": [
          "Cor não está em questão.",
          "Não é só tamanho.",
          "As pistas explicitadas mudaram.",
          "Duas/todas e passado/amanhã mudam o conteúdo."
        ]
      },
      {
        "id": "q.smr.q08",
        "topicId": "portuguese.meaning.semantics.revisao",
        "prompt": "Você adivinhou o referente de ela sem contexto em um trecho com duas pessoas. Que recuperação é adequada?",
        "options": [
          "Declarar uma escolha aleatória como fato.",
          "Identificar as referências possíveis e usar a intenção explicitada para reescrever.",
          "Afirmar que todo pronome é proibido.",
          "Ignorar as pessoas anteriores."
        ],
        "answer": 1,
        "explanation": "O caso exige contexto para escolher a leitura pretendida.",
        "optionRationales": [
          "O texto não dá essa certeza.",
          "O caso exige contexto para escolher a leitura pretendida.",
          "Pronomes não são todos proibidos.",
          "As referências anteriores importam."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "smr-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.smr.q01": [
          {
            "missionId": "portuguese.meaning.semantics.revisao",
            "sectionId": "contexto"
          },
          {
            "missionId": "portuguese.meaning.semantics.contexto",
            "sectionId": "contexto"
          }
        ],
        "q.smr.q02": [
          {
            "missionId": "portuguese.meaning.semantics.revisao",
            "sectionId": "contexto"
          },
          {
            "missionId": "portuguese.meaning.semantics.contexto",
            "sectionId": "substituir"
          }
        ],
        "q.smr.q03": [
          {
            "missionId": "portuguese.meaning.semantics.revisao",
            "sectionId": "relacoes"
          },
          {
            "missionId": "portuguese.meaning.semantics.relacoes",
            "sectionId": "proximos"
          }
        ],
        "q.smr.q04": [
          {
            "missionId": "portuguese.meaning.semantics.revisao",
            "sectionId": "relacoes"
          },
          {
            "missionId": "portuguese.meaning.semantics.relacoes",
            "sectionId": "opostos"
          }
        ],
        "q.smr.q05": [
          {
            "missionId": "portuguese.meaning.semantics.revisao",
            "sectionId": "relacoes"
          },
          {
            "missionId": "portuguese.meaning.semantics.relacoes",
            "sectionId": "negacao"
          }
        ],
        "q.smr.q06": [
          {
            "missionId": "portuguese.meaning.semantics.revisao",
            "sectionId": "clareza"
          },
          {
            "missionId": "portuguese.meaning.semantics.clareza",
            "sectionId": "referencia"
          }
        ],
        "q.smr.q07": [
          {
            "missionId": "portuguese.meaning.semantics.revisao",
            "sectionId": "clareza"
          },
          {
            "missionId": "portuguese.meaning.semantics.clareza",
            "sectionId": "alcance"
          }
        ],
        "q.smr.q08": [
          {
            "missionId": "portuguese.meaning.semantics.revisao",
            "sectionId": "recuperacao"
          },
          {
            "missionId": "portuguese.meaning.semantics.clareza",
            "sectionId": "separar"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.smr",
      "blockId": "portuguese.meaning-writing",
      "prerequisiteId": "portuguese.meaning.semantics.clareza",
      "parametersApproved": false
    }
  },
  {
    "id": "portuguese.meaning.semantics.boss",
    "topicId": "portuguese.meaning.semantics.boss",
    "contentVersion": 1,
    "order": 121,
    "title": "Semântica: Chefe contextual introdutório",
    "shortTitle": "SM-CHEFE",
    "kind": "boss",
    "objective": "Interpretar relações de sentido e reescrever os textos fornecidos, preservando contexto, referência e informação.",
    "xp": 220,
    "passScore": 75,
    "estimatedMinutes": 30,
    "publication": {
      "status": "draft",
      "releaseId": "meaning-sm-intro-r1",
      "releaseSequence": 16,
      "changeImpact": "new"
    },
    "sourceIds": [
      "sm.smchefe.incaper.clareza",
      "sm.smchefe.authorial.smchefe"
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
        "sourceIds": [],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "SM-01",
                "missionId": "portuguese.meaning.semantics.contexto",
                "sectionId": "entrada",
                "wholeLesson": true
              },
              {
                "text": " · "
              },
              {
                "text": "SM-02",
                "missionId": "portuguese.meaning.semantics.relacoes",
                "sectionId": "entrada",
                "wholeLesson": true
              },
              {
                "text": " · "
              },
              {
                "text": "SM-03",
                "missionId": "portuguese.meaning.semantics.clareza",
                "sectionId": "entrada",
                "wholeLesson": true
              },
              {
                "text": " · "
              },
              {
                "text": "SM-R",
                "missionId": "portuguese.meaning.semantics.revisao",
                "sectionId": "contexto",
                "wholeLesson": true
              }
            ]
          }
        ]
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
        "id": "q.smchefe.q01",
        "topicId": "portuguese.meaning.semantics.boss",
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
        ]
      },
      {
        "id": "q.smchefe.q02",
        "topicId": "portuguese.meaning.semantics.boss",
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
        ]
      },
      {
        "id": "q.smchefe.q03",
        "topicId": "portuguese.meaning.semantics.boss",
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
        ]
      },
      {
        "id": "q.smchefe.q04",
        "topicId": "portuguese.meaning.semantics.boss",
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
        ]
      },
      {
        "id": "q.smchefe.q05",
        "topicId": "portuguese.meaning.semantics.boss",
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
        ]
      },
      {
        "id": "q.smchefe.q06",
        "topicId": "portuguese.meaning.semantics.boss",
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
        ]
      },
      {
        "id": "q.smchefe.q07",
        "topicId": "portuguese.meaning.semantics.boss",
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
        ]
      },
      {
        "id": "q.smchefe.q08",
        "topicId": "portuguese.meaning.semantics.boss",
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
        ]
      },
      {
        "id": "q.smchefe.q09",
        "topicId": "portuguese.meaning.semantics.boss",
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
        ]
      },
      {
        "id": "q.smchefe.q10",
        "topicId": "portuguese.meaning.semantics.boss",
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
        ]
      },
      {
        "id": "q.smchefe.q11",
        "topicId": "portuguese.meaning.semantics.boss",
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
        ]
      },
      {
        "id": "q.smchefe.q12",
        "topicId": "portuguese.meaning.semantics.boss",
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
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "smchefe-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.smchefe.q01": [
          {
            "missionId": "portuguese.meaning.semantics.boss",
            "sectionId": "contexto"
          },
          {
            "missionId": "portuguese.meaning.semantics.contexto",
            "sectionId": "contexto"
          }
        ],
        "q.smchefe.q02": [
          {
            "missionId": "portuguese.meaning.semantics.boss",
            "sectionId": "contexto"
          },
          {
            "missionId": "portuguese.meaning.semantics.contexto",
            "sectionId": "literal"
          }
        ],
        "q.smchefe.q03": [
          {
            "missionId": "portuguese.meaning.semantics.boss",
            "sectionId": "contexto"
          },
          {
            "missionId": "portuguese.meaning.semantics.contexto",
            "sectionId": "substituir"
          }
        ],
        "q.smchefe.q04": [
          {
            "missionId": "portuguese.meaning.semantics.boss",
            "sectionId": "relacoes"
          },
          {
            "missionId": "portuguese.meaning.semantics.relacoes",
            "sectionId": "proximos"
          }
        ],
        "q.smchefe.q05": [
          {
            "missionId": "portuguese.meaning.semantics.boss",
            "sectionId": "relacoes"
          },
          {
            "missionId": "portuguese.meaning.semantics.relacoes",
            "sectionId": "opostos"
          }
        ],
        "q.smchefe.q06": [
          {
            "missionId": "portuguese.meaning.semantics.boss",
            "sectionId": "relacoes"
          },
          {
            "missionId": "portuguese.meaning.semantics.relacoes",
            "sectionId": "ex-negacao"
          }
        ],
        "q.smchefe.q07": [
          {
            "missionId": "portuguese.meaning.semantics.boss",
            "sectionId": "clareza"
          },
          {
            "missionId": "portuguese.meaning.semantics.clareza",
            "sectionId": "referencia"
          }
        ],
        "q.smchefe.q08": [
          {
            "missionId": "portuguese.meaning.semantics.boss",
            "sectionId": "clareza"
          },
          {
            "missionId": "portuguese.meaning.semantics.clareza",
            "sectionId": "separar"
          }
        ],
        "q.smchefe.q09": [
          {
            "missionId": "portuguese.meaning.semantics.boss",
            "sectionId": "clareza"
          },
          {
            "missionId": "portuguese.meaning.semantics.clareza",
            "sectionId": "ex-conteudo"
          }
        ],
        "q.smchefe.q10": [
          {
            "missionId": "portuguese.meaning.semantics.boss",
            "sectionId": "clareza"
          },
          {
            "missionId": "portuguese.meaning.semantics.clareza",
            "sectionId": "alcance"
          }
        ],
        "q.smchefe.q11": [
          {
            "missionId": "portuguese.meaning.semantics.boss",
            "sectionId": "contexto"
          },
          {
            "missionId": "portuguese.meaning.semantics.contexto",
            "sectionId": "limites"
          }
        ],
        "q.smchefe.q12": [
          {
            "missionId": "portuguese.meaning.semantics.boss",
            "sectionId": "recuperacao"
          },
          {
            "missionId": "portuguese.meaning.semantics.clareza",
            "sectionId": "ex-referencia"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.smchefe",
      "blockId": "portuguese.meaning-writing",
      "prerequisiteId": "portuguese.meaning.semantics.revisao",
      "parametersApproved": false
    }
  }
]);
export const SM_SOURCES = Object.freeze([
  {
    "id": "sm.sm01.authorial.sm01",
    "label": "Material autoral da Missão Bancária — SM-01 (rascunho local)",
    "url": "https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado",
    "version": "Texto e exercícios autorais v1",
    "checkedAt": "2026-10-04",
    "locator": "docs/missao-bancaria/rascunhos/sm-01-v1.mjs",
    "provenance": "project-authored",
    "remoteArtifactAvailable": false
  },
  {
    "id": "sm.sm02.authorial.sm02",
    "label": "Material autoral da Missão Bancária — SM-02 (rascunho local)",
    "url": "https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado",
    "version": "Texto e exercícios autorais v1",
    "checkedAt": "2026-10-04",
    "locator": "docs/missao-bancaria/rascunhos/sm-02-v1.mjs",
    "provenance": "project-authored",
    "remoteArtifactAvailable": false
  },
  {
    "id": "sm.sm03.incaper.clareza",
    "label": "Incaper - Manual de Produção Editorial: adequação da linguagem",
    "url": "https://manual-editorial.incaper.es.gov.br/capitulo_onze.htm",
    "version": "11.1D/E, orientação de clareza e ambiguidade; consultado em04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "11.1D: clareza e evitar ambiguidade;11.1E: explicar termos. Não atribuir lista lexical de sinônimos/antônimos a esta fonte."
  },
  {
    "id": "sm.sm03.authorial.sm03",
    "label": "Material autoral da Missão Bancária — SM-03 (rascunho local)",
    "url": "https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado",
    "version": "Texto e exercícios autorais v1",
    "checkedAt": "2026-10-04",
    "locator": "docs/missao-bancaria/rascunhos/sm-03-v1.mjs",
    "provenance": "project-authored",
    "remoteArtifactAvailable": false
  },
  {
    "id": "sm.smr.incaper.clareza",
    "label": "Incaper - Manual de Produção Editorial: adequação da linguagem",
    "url": "https://manual-editorial.incaper.es.gov.br/capitulo_onze.htm",
    "version": "11.1D/E, orientação de clareza e ambiguidade; consultado em04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "11.1D: clareza e evitar ambiguidade;11.1E: explicar termos. Não atribuir lista lexical de sinônimos/antônimos a esta fonte."
  },
  {
    "id": "sm.smr.authorial.smr",
    "label": "Material autoral da Missão Bancária — SM-R (rascunho local)",
    "url": "https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado",
    "version": "Texto e exercícios autorais v1",
    "checkedAt": "2026-10-04",
    "locator": "docs/missao-bancaria/rascunhos/sm-r-v1.mjs",
    "provenance": "project-authored",
    "remoteArtifactAvailable": false
  },
  {
    "id": "sm.smchefe.incaper.clareza",
    "label": "Incaper - Manual de Produção Editorial: adequação da linguagem",
    "url": "https://manual-editorial.incaper.es.gov.br/capitulo_onze.htm",
    "version": "11.1D/E, orientação de clareza e ambiguidade; consultado em04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "11.1D: clareza e evitar ambiguidade;11.1E: explicar termos. Não atribuir lista lexical de sinônimos/antônimos a esta fonte."
  },
  {
    "id": "sm.smchefe.authorial.smchefe",
    "label": "Material autoral da Missão Bancária — SM-CHEFE (rascunho local)",
    "url": "https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado",
    "version": "Texto e exercícios autorais v1",
    "checkedAt": "2026-10-04",
    "locator": "docs/missao-bancaria/rascunhos/sm-chefe-v1.mjs",
    "provenance": "project-authored",
    "remoteArtifactAvailable": false
  }
]);
