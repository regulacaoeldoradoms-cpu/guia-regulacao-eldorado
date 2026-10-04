// Gerado por node worker/scripts/studies-cp-candidate.mjs --write. Não editar.
// Rascunhos CP locais. Desativado; sem autorização de ativação/publicação.
export const CP_MISSIONS = Object.freeze([
  {
    "id": "portuguese.meaning.pronouns.posicoes",
    "topicId": "portuguese.meaning.pronouns.posicoes",
    "contentVersion": 1,
    "order": 122,
    "title": "Colocação pronominal: localizar antes de aplicar",
    "shortTitle": "CP-01",
    "kind": "lesson",
    "objective": "Identificar e aplicar a colocação dos pronomes átonos nos casos delimitados pelo manual formal adotado.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "meaning-cp-intro-r1",
      "releaseSequence": 17,
      "changeImpact": "new"
    },
    "sourceIds": [
      "cp.cp01.funag.colocacao",
      "cp.cp01.authorial.cp01"
    ],
    "sections": [
      {
        "id": "entrada",
        "heading": "1. Pronome e verbo",
        "body": "Colocação pronominal observa a posição de um pronome átono em relação ao verbo. Neste começo usamos me/te/se em frases autorais e reconhecemos a posição, sem uma lista completa de funções dos pronomes. O padrão formal usado nas etapas seguintes é o do Manual de Revisão da FUNAG, nas condições delimitadas.",
        "type": "explanation",
        "sourceIds": [
          "cp.cp01.funag.colocacao"
        ]
      },
      {
        "id": "antes",
        "heading": "2. Próclise",
        "body": "Em Eu me lembro do aviso, me aparece antes de lembro: é próclise. Eu é sujeito; me é o pronome ligado ao verbo. A classificação descreve a posição: ainda não prova que qualquer próclise seja obrigatória em todo contexto.",
        "type": "explanation",
        "sourceIds": [
          "cp.cp01.funag.colocacao"
        ]
      },
      {
        "id": "depois",
        "heading": "3. Ênclise",
        "body": "Em Lembro-me do aviso, me vem depois do verbo, ligado por hífen: ênclise. Não confundir a posição do pronome com troca da pessoa que lembra. A condição formal para início de oração será tratada em CP02.",
        "type": "explanation",
        "sourceIds": [
          "cp.cp01.funag.colocacao"
        ]
      },
      {
        "id": "meio",
        "heading": "4. Mesóclise: reconhecer a forma",
        "body": "No exemplo formal Lembrar-me-ei do aviso, me fica no meio da forma futura: mesóclise. O manual situa essa posição em formas de futuro do presente/pretérito. Aqui apenas reconhecemos esse exemplo; não se cobra escolher mesóclise em todos os contextos nem se diz que todo futuro a exige.",
        "type": "explanation",
        "sourceIds": [
          "cp.cp01.funag.colocacao"
        ]
      },
      {
        "id": "ex-antes",
        "heading": "5. Exemplo resolvido: identificar o par",
        "body": "Eu me lembro do aviso: marque lembro como verbo e me como pronome antes dele. Classifique próclise. A palavra Eu não é o pronome átono cuja posição se analisa.",
        "type": "worked-example",
        "sourceIds": [
          "cp.cp01.funag.colocacao"
        ]
      },
      {
        "id": "ex-depois",
        "heading": "6. Exemplo resolvido: hífen",
        "body": "Lembro-me do aviso: me está depois de Lembro e ligado por hífen. Classifique ênclise. Não chamar essa construção de mesóclise, pois o pronome não aparece no meio de uma forma futura.",
        "type": "worked-example",
        "sourceIds": [
          "cp.cp01.funag.colocacao"
        ]
      },
      {
        "id": "ex-meio",
        "heading": "7. Exemplo resolvido: futuro",
        "body": "Lembrar-me-ei do aviso: me está entre partes da forma verbal futura, não simplesmente depois de toda a forma. Classifique mesóclise. Não extrapolar a obrigatoriedade da escolha para qualquer futuro.",
        "type": "worked-example",
        "sourceIds": [
          "cp.cp01.funag.colocacao"
        ]
      },
      {
        "id": "limites",
        "heading": "8. Posição e norma não são a mesma pergunta",
        "body": "Reconhecer posição é diferente de escolher forma segundo uma regra. As próximas aulas ensinam negativa/início formal e infinitivo. Fora deste recorte: todas as funções dos oblíquos, alterações lo/no, particípios, locuções verbais e todas as variedades de registro.",
        "type": "explanation",
        "sourceIds": [
          "cp.cp01.funag.colocacao"
        ]
      },
      {
        "id": "glossario",
        "heading": "Vocabulário de apoio",
        "body": "Pronome átono é forma como me/te/se, que se liga ao verbo na construção. Próclise: antes; ênclise: depois, com hífen; mesóclise: no meio da forma futura exemplificada. Infinitivo: forma como lembrar. Registro formal adotado: orientação específica do manual, sem condenar todas as variantes de fala.",
        "type": "glossary",
        "sourceIds": [
          "cp.cp01.funag.colocacao"
        ]
      },
      {
        "id": "recuperacao",
        "heading": "Recuperar pela condição",
        "body": "Identifique pronome e verbo, marque posição e condição do caso: negativa sem pausa, início formal ou infinitivo com duas possibilidades ensinadas. Não confundir posição com sentido do referente nem generalizar para todas as locuções/tempos/variedades.",
        "type": "summary",
        "sourceIds": [
          "cp.cp01.funag.colocacao"
        ]
      }
    ],
    "recall": [
      "Onde está o pronome em relação ao verbo?",
      "Qual condição formal foi informada?",
      "O caso admite mais de uma posição?"
    ],
    "questions": [
      {
        "id": "q.cp01.q01",
        "topicId": "portuguese.meaning.pronouns.posicoes",
        "prompt": "Em Eu me lembro do aviso, qual é o pronome átono analisado?",
        "options": [
          "Eu.",
          "Me.",
          "Aviso.",
          "Do."
        ],
        "answer": 1,
        "explanation": "Me é a forma ligada ao verbo lembro no exemplo.",
        "optionRationales": [
          "Eu é sujeito, não o átono analisado.",
          "Me é a forma ligada ao verbo lembro no exemplo.",
          "Aviso é nome.",
          "Do não é esse pronome átono."
        ]
      },
      {
        "id": "q.cp01.q02",
        "topicId": "portuguese.meaning.pronouns.posicoes",
        "prompt": "Me antes de lembro em Eu me lembro recebe qual classificação de posição?",
        "options": [
          "Artigo definido.",
          "Ênclise.",
          "Mesóclise.",
          "Próclise."
        ],
        "answer": 3,
        "explanation": "Próclise é a posição anterior ao verbo.",
        "optionRationales": [
          "A pergunta trata do pronome, não de artigo.",
          "Ênclise é posterior.",
          "Mesóclise é interna à forma futura exemplificada.",
          "Próclise é a posição anterior ao verbo."
        ]
      },
      {
        "id": "q.cp01.q03",
        "topicId": "portuguese.meaning.pronouns.posicoes",
        "prompt": "Qual posição aparece em Lembro-me do aviso?",
        "options": [
          "Ênclise.",
          "Próclise.",
          "Mesóclise.",
          "Ausência de pronome."
        ],
        "answer": 0,
        "explanation": "Me vem depois do verbo, com hífen.",
        "optionRationales": [
          "Me vem depois do verbo, com hífen.",
          "Me não vem antes do verbo.",
          "Não está no meio de forma futura.",
          "Me está presente."
        ]
      },
      {
        "id": "q.cp01.q04",
        "topicId": "portuguese.meaning.pronouns.posicoes",
        "prompt": "Qual sinal liga verbo e pronome em Lembro-me no exemplo?",
        "options": [
          "Til.",
          "Acento grave.",
          "Hífen.",
          "Dois-pontos."
        ],
        "answer": 2,
        "explanation": "O exemplo usa hífen entre verbo e pronome.",
        "optionRationales": [
          "Til não é o sinal dado.",
          "Grave não é a ligação escrita nesse exemplo.",
          "O exemplo usa hífen entre verbo e pronome.",
          "Dois-pontos não separam esse par."
        ]
      },
      {
        "id": "q.cp01.q05",
        "topicId": "portuguese.meaning.pronouns.posicoes",
        "prompt": "Qual classificação descreve me em Lembrar-me-ei?",
        "options": [
          "Artigo indefinido.",
          "Próclise.",
          "Ênclise simples depois de toda a forma.",
          "Mesóclise."
        ],
        "answer": 3,
        "explanation": "O pronome aparece no meio da forma futura exemplificada.",
        "optionRationales": [
          "Me não é artigo.",
          "Não vem antes de toda a forma.",
          "Não vem depois de toda a forma.",
          "O pronome aparece no meio da forma futura exemplificada."
        ]
      },
      {
        "id": "q.cp01.q06",
        "topicId": "portuguese.meaning.pronouns.posicoes",
        "prompt": "Qual limite acompanha o exemplo de mesóclise nesta aula?",
        "options": [
          "Todo futuro obriga mesóclise em qualquer contexto.",
          "Reconhecer o exemplo não prova que todo futuro exija mesóclise.",
          "Toda próclise está proibida.",
          "O gênero de aviso decide sempre a posição."
        ],
        "answer": 1,
        "explanation": "A aula limita a classificação, sem essa escolha universal.",
        "optionRationales": [
          "É generalização não ensinada.",
          "A aula limita a classificação, sem essa escolha universal.",
          "Há casos de próclise ensinados e admitidos.",
          "Gênero do nome não é a condição de posição dada."
        ]
      },
      {
        "id": "q.cp01.q07",
        "topicId": "portuguese.meaning.pronouns.posicoes",
        "prompt": "Você confundiu Eu com o átono em Eu me lembro. Que recuperação é pertinente?",
        "options": [
          "Apagar todo pronome.",
          "Contar só substantivos.",
          "Marcar lembro como verbo e me como pronome cuja posição se compara.",
          "Trocar aviso por plural sem olhar o verbo."
        ],
        "answer": 2,
        "explanation": "O par pronome/verbo estabelece a posição analisada.",
        "optionRationales": [
          "Apagar não ensina a análise.",
          "Isso não identifica o átono.",
          "O par pronome/verbo estabelece a posição analisada.",
          "Plural de aviso não resolve a confusão."
        ]
      },
      {
        "id": "q.cp01.q08",
        "topicId": "portuguese.meaning.pronouns.posicoes",
        "prompt": "Qual comparação identifica corretamente antes/depois nos exemplos dados?",
        "options": [
          "Eu me lembro: antes; Lembro-me: depois.",
          "Eu me lembro: depois; Lembro-me: antes.",
          "Ambos são mesóclise.",
          "Nenhum tem verbo."
        ],
        "answer": 0,
        "explanation": "Me fica antes no primeiro e depois no segundo.",
        "optionRationales": [
          "Me fica antes no primeiro e depois no segundo.",
          "Inverte as posições.",
          "Não são internos a futuro.",
          "Lembro é verbo nos dois."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "cp01-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.cp01.q01": [
          {
            "missionId": "portuguese.meaning.pronouns.posicoes",
            "sectionId": "antes"
          }
        ],
        "q.cp01.q02": [
          {
            "missionId": "portuguese.meaning.pronouns.posicoes",
            "sectionId": "antes"
          }
        ],
        "q.cp01.q03": [
          {
            "missionId": "portuguese.meaning.pronouns.posicoes",
            "sectionId": "depois"
          }
        ],
        "q.cp01.q04": [
          {
            "missionId": "portuguese.meaning.pronouns.posicoes",
            "sectionId": "ex-depois"
          }
        ],
        "q.cp01.q05": [
          {
            "missionId": "portuguese.meaning.pronouns.posicoes",
            "sectionId": "meio"
          }
        ],
        "q.cp01.q06": [
          {
            "missionId": "portuguese.meaning.pronouns.posicoes",
            "sectionId": "limites"
          }
        ],
        "q.cp01.q07": [
          {
            "missionId": "portuguese.meaning.pronouns.posicoes",
            "sectionId": "ex-antes"
          }
        ],
        "q.cp01.q08": [
          {
            "missionId": "portuguese.meaning.pronouns.posicoes",
            "sectionId": "entrada"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.cp01",
      "blockId": "portuguese.meaning-writing",
      "prerequisiteId": "portuguese.meaning.semantics.boss",
      "parametersApproved": false
    }
  },
  {
    "id": "portuguese.meaning.pronouns.formal",
    "topicId": "portuguese.meaning.pronouns.formal",
    "contentVersion": 1,
    "order": 123,
    "title": "Colocação formal: negativa e início da oração",
    "shortTitle": "CP-02",
    "kind": "lesson",
    "objective": "Identificar e aplicar a colocação dos pronomes átonos nos casos delimitados pelo manual formal adotado.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "meaning-cp-intro-r1",
      "releaseSequence": 17,
      "changeImpact": "new"
    },
    "sourceIds": [
      "cp.cp02.funag.colocacao",
      "cp.cp02.authorial.cp02"
    ],
    "sections": [
      {
        "id": "entrada",
        "heading": "1. Um padrão e duas condições",
        "body": "Aplicamos a orientação formal do manual nas condições explicitadas, sem julgar toda fala brasileira. Os casos são um verbo simples, negativa sem pausa e início de oração sem outro fator atrativo. Não extrapolar para locuções verbais ou todas as palavras atrativas.",
        "type": "explanation",
        "sourceIds": [
          "cp.cp02.funag.colocacao"
        ]
      },
      {
        "id": "negativa",
        "heading": "2. Negativa sem pausa",
        "body": "Em Não me lembro do aviso, não é palavra negativa e não há pausa entre ela e o verbo. O manual requer próclise nesta condição: me antes de lembro. Não escrever Não lembro-me para representar esse mesmo caso no padrão formal adotado.",
        "type": "explanation",
        "sourceIds": [
          "cp.cp02.funag.colocacao"
        ]
      },
      {
        "id": "inicio",
        "heading": "3. Início formal",
        "body": "Para início de oração formal, o manual orienta não começar com pronome oblíquo átono. No caso sem fator atrativo dado, Lembro-me do aviso coloca me depois do verbo. Me lembro do aviso ocorre em fala brasileira, mas não atende a orientação formal de início adotada neste exercício. Não declarar que a fala seja sem regra ou inferior.",
        "type": "explanation",
        "sourceIds": [
          "cp.cp02.funag.colocacao"
        ]
      },
      {
        "id": "condicao",
        "heading": "4. Identificar antes de escolher",
        "body": "Não me lembro do aviso tem negativa sem pausa; Lembro-me do aviso começa com verbo no caso sem fator atrativo. Não impor a ênclise do segundo ao primeiro nem pôr regra de que todo me deve vir antes. O enunciado deve informar o registro e as condições.",
        "type": "explanation",
        "sourceIds": [
          "cp.cp02.funag.colocacao"
        ]
      },
      {
        "id": "ex-negativa",
        "heading": "5. Exemplo resolvido: não",
        "body": "Não me engano neste cálculo fictício: negativa não, verbo simples engano e ausência de pausa. Coloque me antes do verbo conforme a orientação ensinada. Não transformar esta regra em ensino de todos os contextos com qualquer pausa.",
        "type": "worked-example",
        "sourceIds": [
          "cp.cp02.funag.colocacao"
        ]
      },
      {
        "id": "ex-inicio",
        "heading": "6. Exemplo resolvido: formal sem atrator",
        "body": "Intenção: iniciar oração formal sem palavra atrativa com verbo Lembro e pronome me. Escreva Lembro-me do aviso. A regra formal de início orienta essa escolha; não se afirma que me lembro seja impossível em todas as variedades.",
        "type": "worked-example",
        "sourceIds": [
          "cp.cp02.funag.colocacao"
        ]
      },
      {
        "id": "ex-contraste",
        "heading": "7. Exemplo resolvido: duas condições",
        "body": "Compare Não me engano e Engano-me às vezes: o primeiro traz negativa sem pausa, o segundo inicia oração formal com verbo simples, sem fator atrativo. A escolha muda com a condição. Não retirar o não só para aplicar a forma pós-verbal.",
        "type": "worked-example",
        "sourceIds": [
          "cp.cp02.funag.colocacao"
        ]
      },
      {
        "id": "limites",
        "heading": "8. O que ainda exige ensino",
        "body": "Não cobrar negativas separadas por pausa, todos os advérbios, subordinadas/interrogativas, verbos compostos/locuções, funções completas de se ou adaptações de o/a. A orientação formal delimitada não é declaração de que só uma variedade de fala existe.",
        "type": "explanation",
        "sourceIds": [
          "cp.cp02.funag.colocacao"
        ]
      },
      {
        "id": "glossario",
        "heading": "Vocabulário de apoio",
        "body": "Pronome átono é forma como me/te/se, que se liga ao verbo na construção. Próclise: antes; ênclise: depois, com hífen; mesóclise: no meio da forma futura exemplificada. Infinitivo: forma como lembrar. Registro formal adotado: orientação específica do manual, sem condenar todas as variantes de fala.",
        "type": "glossary",
        "sourceIds": [
          "cp.cp02.funag.colocacao"
        ]
      },
      {
        "id": "recuperacao",
        "heading": "Recuperar pela condição",
        "body": "Identifique pronome e verbo, marque posição e condição do caso: negativa sem pausa, início formal ou infinitivo com duas possibilidades ensinadas. Não confundir posição com sentido do referente nem generalizar para todas as locuções/tempos/variedades.",
        "type": "summary",
        "sourceIds": [
          "cp.cp02.funag.colocacao"
        ]
      }
    ],
    "recall": [
      "Onde está o pronome em relação ao verbo?",
      "Qual condição formal foi informada?",
      "O caso admite mais de uma posição?"
    ],
    "questions": [
      {
        "id": "q.cp02.q01",
        "topicId": "portuguese.meaning.pronouns.formal",
        "prompt": "No padrão formal adotado, com verbo simples e negativa não sem pausa, qual escrita segue a condição ensinada?",
        "options": [
          "Não lembro me do aviso, como ênclise sem hífen.",
          "Não lembro-me do aviso.",
          "Não me lembro do aviso.",
          "Me não lembro do aviso, alterando o arranjo dado."
        ],
        "answer": 2,
        "explanation": "Negativa sem pausa requer o átono antes do verbo no caso ensinado.",
        "optionRationales": [
          "Não representa a posição requerida e omite ligação.",
          "Não atende à próclise requerida nesse caso.",
          "Negativa sem pausa requer o átono antes do verbo no caso ensinado.",
          "Não representa a construção dada com não seguido do grupo verbal."
        ]
      },
      {
        "id": "q.cp02.q02",
        "topicId": "portuguese.meaning.pronouns.formal",
        "prompt": "Qual condição sustenta a próclise de Não me lembro no recorte?",
        "options": [
          "Palavra negativa sem pausa entre ela e o verbo.",
          "Nome aviso ser masculino.",
          "Toda frase ter oito palavras.",
          "Haver obrigatoriamente verbo no futuro."
        ],
        "answer": 0,
        "explanation": "Não e a ausência de pausa são as condições explicitadas.",
        "optionRationales": [
          "Não e a ausência de pausa são as condições explicitadas.",
          "Gênero de aviso não explica a posição.",
          "Contagem não é a regra.",
          "Lembro não é futuro no exemplo."
        ]
      },
      {
        "id": "q.cp02.q03",
        "topicId": "portuguese.meaning.pronouns.formal",
        "prompt": "Para iniciar oração formal sem fator atrativo, com verbo lembro e pronome me, qual opção segue a orientação adotada?",
        "options": [
          "Lembro me do aviso, apresentando ênclise sem hífen.",
          "Me lembro do aviso, iniciando com átono.",
          "Me-lembro do aviso.",
          "Lembro-me do aviso."
        ],
        "answer": 3,
        "explanation": "Verbo antes do átono, com hífen, segue a orientação de início formal dada.",
        "optionRationales": [
          "A ligação por hífen falta na ênclise proposta.",
          "O manual orienta não iniciar essa oração com átono.",
          "Hífen antes do verbo não representa a ênclise dada.",
          "Verbo antes do átono, com hífen, segue a orientação de início formal dada."
        ]
      },
      {
        "id": "q.cp02.q04",
        "topicId": "portuguese.meaning.pronouns.formal",
        "prompt": "Qual afirmação respeita o contraste entre orientação formal e fala brasileira no exemplo?",
        "options": [
          "Me lembro é impossível em toda fala brasileira.",
          "Me lembro no início pode ocorrer na fala, mas não segue a orientação formal adotada no exercício.",
          "Toda fala brasileira é sem regras.",
          "O exercício aboliu qualquer regra formal."
        ],
        "answer": 1,
        "explanation": "O enunciado delimita registro, sem condenar universalmente variantes.",
        "optionRationales": [
          "A aula não afirma impossibilidade de uso na fala.",
          "O enunciado delimita registro, sem condenar universalmente variantes.",
          "Variedade linguística não significa ausência de regras.",
          "A orientação formal foi explicitada."
        ]
      },
      {
        "id": "q.cp02.q05",
        "topicId": "portuguese.meaning.pronouns.formal",
        "prompt": "Qual par aplica as duas condições ensinadas ao verbo engano?",
        "options": [
          "Não me engano / Engano-me às vezes.",
          "Não engano-me / Me engano às vezes, no início formal dado.",
          "Não engano me / Me-engano às vezes.",
          "Me não engano / Me engano, dispensando as condições."
        ],
        "answer": 0,
        "explanation": "Negativa sem pausa: antes; início formal sem atrator: depois com hífen.",
        "optionRationales": [
          "Negativa sem pausa: antes; início formal sem atrator: depois com hífen.",
          "Inverte a orientação nos dois casos.",
          "Não representa as ligações escritas ensinadas.",
          "Não atende às condições do caso dado."
        ]
      },
      {
        "id": "q.cp02.q06",
        "topicId": "portuguese.meaning.pronouns.formal",
        "prompt": "O estudante apagou não para usar ênclise. Por que isso é inadequado como preservação da frase original?",
        "options": [
          "Qualquer palavra pode ser apagada sem consequência.",
          "Não não altera nenhum conteúdo.",
          "Muda a negação e o sentido antes de resolver a colocação.",
          "Negativa é sempre artigo."
        ],
        "answer": 2,
        "explanation": "A condição negativa e a informação original precisam ser mantidas.",
        "optionRationales": [
          "Apagar pode mudar conteúdo.",
          "Não rejeita a afirmação original.",
          "A condição negativa e a informação original precisam ser mantidas.",
          "Não é artigo neste uso."
        ]
      },
      {
        "id": "q.cp02.q07",
        "topicId": "portuguese.meaning.pronouns.formal",
        "prompt": "Você aplicou a forma Lembro-me à frase que começa com Não, sem pausa. Que recuperação resolve?",
        "options": [
          "Ignorar a negativa.",
          "Retomar a negativa e posicionar me antes do verbo conforme o caso formal.",
          "Concluir que todo me sempre deve vir depois.",
          "Mudar o registro sem ler o enunciado."
        ],
        "answer": 1,
        "explanation": "A negativa sem pausa requer a próclise ensinada.",
        "optionRationales": [
          "A negativa é a condição relevante.",
          "A negativa sem pausa requer a próclise ensinada.",
          "É generalização inadequada.",
          "O registro foi dado e deve ser respeitado."
        ]
      },
      {
        "id": "q.cp02.q08",
        "topicId": "portuguese.meaning.pronouns.formal",
        "prompt": "Qual limite acompanha a regra de negativa desta aula?",
        "options": [
          "Determina o gênero de todos os nomes.",
          "Resolve automaticamente todas as locuções verbais.",
          "Proíbe próclise em qualquer frase.",
          "Não cobre todos os casos com pausa, locuções ou outras palavras atrativas."
        ],
        "answer": 3,
        "explanation": "A regra foi delimitada a verbo simples e negativa sem pausa.",
        "optionRationales": [
          "Gênero nominal não é objeto da regra.",
          "Locuções não foram ensinadas.",
          "O caso requer próclise.",
          "A regra foi delimitada a verbo simples e negativa sem pausa."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "cp02-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.cp02.q01": [
          {
            "missionId": "portuguese.meaning.pronouns.formal",
            "sectionId": "negativa"
          }
        ],
        "q.cp02.q02": [
          {
            "missionId": "portuguese.meaning.pronouns.formal",
            "sectionId": "negativa"
          }
        ],
        "q.cp02.q03": [
          {
            "missionId": "portuguese.meaning.pronouns.formal",
            "sectionId": "inicio"
          }
        ],
        "q.cp02.q04": [
          {
            "missionId": "portuguese.meaning.pronouns.formal",
            "sectionId": "inicio"
          }
        ],
        "q.cp02.q05": [
          {
            "missionId": "portuguese.meaning.pronouns.formal",
            "sectionId": "ex-contraste"
          }
        ],
        "q.cp02.q06": [
          {
            "missionId": "portuguese.meaning.pronouns.formal",
            "sectionId": "condicao"
          }
        ],
        "q.cp02.q07": [
          {
            "missionId": "portuguese.meaning.pronouns.formal",
            "sectionId": "ex-negativa"
          }
        ],
        "q.cp02.q08": [
          {
            "missionId": "portuguese.meaning.pronouns.formal",
            "sectionId": "limites"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.cp02",
      "blockId": "portuguese.meaning-writing",
      "prerequisiteId": "portuguese.meaning.pronouns.posicoes",
      "parametersApproved": false
    }
  },
  {
    "id": "portuguese.meaning.pronouns.infinitivo",
    "topicId": "portuguese.meaning.pronouns.infinitivo",
    "contentVersion": 1,
    "order": 124,
    "title": "Infinitivo: reconhecer possibilidades sem regra universal",
    "shortTitle": "CP-03",
    "kind": "lesson",
    "objective": "Identificar e aplicar a colocação dos pronomes átonos nos casos delimitados pelo manual formal adotado.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "meaning-cp-intro-r1",
      "releaseSequence": 17,
      "changeImpact": "new"
    },
    "sourceIds": [
      "cp.cp03.funag.colocacao",
      "cp.cp03.authorial.cp03"
    ],
    "sections": [
      {
        "id": "entrada",
        "heading": "1. Mais de uma posição pode valer",
        "body": "O manual admite próclise e ênclise com infinitivos. Aplicaremos só um infinitivo simples, sem negativa/atração adicional ou início de oração isolado: Para me lembrar do aviso, anotei uma pista e Para lembrar-me do aviso, anotei uma pista. Não transformar a tendência de ênclise em proibição da alternativa admitida.",
        "type": "explanation",
        "sourceIds": [
          "cp.cp03.funag.colocacao"
        ]
      },
      {
        "id": "infinitivo",
        "heading": "2. Antes e depois de lembrar",
        "body": "Em Para me lembrar do aviso, me vem antes de lembrar: próclise. Em Para lembrar-me do aviso, vem depois, com hífen: ênclise. As duas construções do caso são admitidas na orientação citada; não alterar me para eu, pois não é apenas deslocar o mesmo pronome.",
        "type": "explanation",
        "sourceIds": [
          "cp.cp03.funag.colocacao"
        ]
      },
      {
        "id": "preservar",
        "heading": "3. Mesmo referente, mesma finalidade",
        "body": "Nos dois exemplos, quem anotou procura lembrar o aviso: a finalidade foi conservada na hipótese dada. Trocar por Para te lembrar mudaria a referência pessoal indicada, não só a posição. Não é necessário classificar todas as funções dos pronomes para perceber essa mudança explícita.",
        "type": "explanation",
        "sourceIds": [
          "cp.cp03.funag.colocacao"
        ]
      },
      {
        "id": "comparar",
        "heading": "4. Não confundir com negativa ou futuro",
        "body": "Para me lembrar contém infinitivo simples no caso delimitado. Não me lembro contém verbo flexionado e negativa sem pausa, com condição de CP02. Lembrar-me-ei é a forma futura exemplificada em CP01. Diferencie a construção antes de aplicar uma regra; não dizer que todo hífen indica mesóclise.",
        "type": "explanation",
        "sourceIds": [
          "cp.cp03.funag.colocacao"
        ]
      },
      {
        "id": "ex-duas",
        "heading": "5. Exemplo resolvido: duas formas",
        "body": "Intenção: anotei uma pista com finalidade de eu lembrar o aviso. Para me lembrar do aviso, anotei uma pista e Para lembrar-me do aviso, anotei uma pista conservam essa finalidade e deslocam o mesmo me antes/depois do infinitivo. A orientação citada admite ambas no caso.",
        "type": "worked-example",
        "sourceIds": [
          "cp.cp03.funag.colocacao"
        ]
      },
      {
        "id": "ex-referente",
        "heading": "6. Exemplo resolvido: posição ou pessoa",
        "body": "Compare me antes/depois de lembrar: mantém a forma me. Compare me com te na hipótese que distingue quem anota de quem recebe lembrete: muda a referência informada. Uma pergunta de colocação não autoriza trocar a pessoa para fabricar resposta.",
        "type": "worked-example",
        "sourceIds": [
          "cp.cp03.funag.colocacao"
        ]
      },
      {
        "id": "ex-forma",
        "heading": "7. Exemplo resolvido: qual construção",
        "body": "Para lembrar-me usa infinitivo e ênclise. Lembrar-me-ei apresenta pronome no meio do futuro exemplificado. Ter hífen nas duas expressões não torna a colocação igual. Observe onde o pronome fica em relação à forma verbal inteira.",
        "type": "worked-example",
        "sourceIds": [
          "cp.cp03.funag.colocacao"
        ]
      },
      {
        "id": "limites",
        "heading": "8. Possibilidades delimitadas",
        "body": "Não escolher uma única forma como universalmente correta quando o ensino admite duas. Este caso não cobre todo infinitivo com o/a, alterações de terminação, locuções com auxiliares, pausa, participiais ou futuros com qualquer fator atrativo. As ampliações exigem ensino pertinente.",
        "type": "explanation",
        "sourceIds": [
          "cp.cp03.funag.colocacao"
        ]
      },
      {
        "id": "glossario",
        "heading": "Vocabulário de apoio",
        "body": "Pronome átono é forma como me/te/se, que se liga ao verbo na construção. Próclise: antes; ênclise: depois, com hífen; mesóclise: no meio da forma futura exemplificada. Infinitivo: forma como lembrar. Registro formal adotado: orientação específica do manual, sem condenar todas as variantes de fala.",
        "type": "glossary",
        "sourceIds": [
          "cp.cp03.funag.colocacao"
        ]
      },
      {
        "id": "recuperacao",
        "heading": "Recuperar pela condição",
        "body": "Identifique pronome e verbo, marque posição e condição do caso: negativa sem pausa, início formal ou infinitivo com duas possibilidades ensinadas. Não confundir posição com sentido do referente nem generalizar para todas as locuções/tempos/variedades.",
        "type": "summary",
        "sourceIds": [
          "cp.cp03.funag.colocacao"
        ]
      }
    ],
    "recall": [
      "Onde está o pronome em relação ao verbo?",
      "Qual condição formal foi informada?",
      "O caso admite mais de uma posição?"
    ],
    "questions": [
      {
        "id": "q.cp03.q01",
        "topicId": "portuguese.meaning.pronouns.infinitivo",
        "prompt": "No caso de infinitivo simples ensinado, qual avaliação de Para me lembrar / Para lembrar-me respeita o manual citado?",
        "options": [
          "Ambas são mesóclise.",
          "Só a primeira existe em qualquer construção.",
          "Só a segunda existe em qualquer construção.",
          "Ambas são admitidas no caso."
        ],
        "answer": 3,
        "explanation": "O manual admite próclise e ênclise com infinitivos no recorte dado.",
        "optionRationales": [
          "Não são posição interna a uma forma futura.",
          "A segunda é admitida no caso.",
          "A primeira também é admitida.",
          "O manual admite próclise e ênclise com infinitivos no recorte dado."
        ]
      },
      {
        "id": "q.cp03.q02",
        "topicId": "portuguese.meaning.pronouns.infinitivo",
        "prompt": "Em Para lembrar-me do aviso, onde está me?",
        "options": [
          "Antes do infinitivo, em próclise.",
          "Depois do infinitivo, em ênclise.",
          "No meio de uma forma futura, em mesóclise.",
          "Ausente."
        ],
        "answer": 1,
        "explanation": "Me vem depois de lembrar, ligado por hífen.",
        "optionRationales": [
          "A posição não é anterior.",
          "Me vem depois de lembrar, ligado por hífen.",
          "Lembrar não está no futuro exemplificado.",
          "Me está presente."
        ]
      },
      {
        "id": "q.cp03.q03",
        "topicId": "portuguese.meaning.pronouns.infinitivo",
        "prompt": "Em Para me lembrar do aviso, qual posição é descrita?",
        "options": [
          "Mesóclise obrigatória.",
          "Ênclise ao infinitivo.",
          "Próclise ao infinitivo.",
          "Artigo do nome aviso."
        ],
        "answer": 2,
        "explanation": "Me vem antes de lembrar.",
        "optionRationales": [
          "Não está dentro do futuro.",
          "Não vem depois.",
          "Me vem antes de lembrar.",
          "Me não é artigo de aviso."
        ]
      },
      {
        "id": "q.cp03.q04",
        "topicId": "portuguese.meaning.pronouns.infinitivo",
        "prompt": "A finalidade dada é quem anotou lembrar o aviso. Que par conserva me e muda apenas sua posição no caso?",
        "options": [
          "Para me lembrar / Para lembrar-me.",
          "Para me lembrar / Para te lembrar.",
          "Para lembrar-me / Para lembrar-te.",
          "Para me lembrar / Para eu esquecer."
        ],
        "answer": 0,
        "explanation": "As duas formas conservam me e a finalidade indicada.",
        "optionRationales": [
          "As duas formas conservam me e a finalidade indicada.",
          "Troca referência pessoal informada.",
          "Troca me por te.",
          "Troca pronome/construção e ação."
        ]
      },
      {
        "id": "q.cp03.q05",
        "topicId": "portuguese.meaning.pronouns.infinitivo",
        "prompt": "Qual mudança não é apenas colocação do mesmo pronome, sob a hipótese de pessoas distintas dada?",
        "options": [
          "Me antes de lembrar passar a depois.",
          "Trocar me por te.",
          "Lembrar-me passar a me lembrar no caso admitido.",
          "Conservar me nas duas posições ensinadas."
        ],
        "answer": 1,
        "explanation": "Muda a referência pessoal informada, não apenas a posição.",
        "optionRationales": [
          "Isso é deslocar a mesma forma.",
          "Muda a referência pessoal informada, não apenas a posição.",
          "Isso desloca a mesma forma no caso.",
          "Conservar forma permite comparar posição."
        ]
      },
      {
        "id": "q.cp03.q06",
        "topicId": "portuguese.meaning.pronouns.infinitivo",
        "prompt": "Qual afirmação diferencia lembrar-me de lembrar-me-ei?",
        "options": [
          "Me é artigo plural em ambas.",
          "Todo hífen prova mesóclise.",
          "As duas expressões não têm pronome.",
          "O primeiro é ênclise no infinitivo; o segundo tem mesóclise na forma futura exemplificada."
        ],
        "answer": 3,
        "explanation": "A posição depende da forma verbal inteira.",
        "optionRationales": [
          "Me não é artigo.",
          "Hífen também liga ênclise.",
          "Me é pronome presente.",
          "A posição depende da forma verbal inteira."
        ]
      },
      {
        "id": "q.cp03.q07",
        "topicId": "portuguese.meaning.pronouns.infinitivo",
        "prompt": "Você marcou só Para lembrar-me como possível no caso que admite duas formas. Que recuperação é adequada?",
        "options": [
          "Rever a admissão de próclise e ênclise no infinitivo simples dado.",
          "Declarar todo infinitivo proibido.",
          "Aplicar negativa que não aparece no caso.",
          "Trocar me por te para evitar a comparação."
        ],
        "answer": 0,
        "explanation": "O ensino delimita ambas as formas como admitidas.",
        "optionRationales": [
          "O ensino delimita ambas as formas como admitidas.",
          "Infinitivo não foi proibido.",
          "Não há essa condição no caso.",
          "Mudar pessoa não resolve a possibilidade de posição."
        ]
      },
      {
        "id": "q.cp03.q08",
        "topicId": "portuguese.meaning.pronouns.infinitivo",
        "prompt": "Qual cuidado evita extrapolar esta aula?",
        "options": [
          "Dizer que toda forma futura exige me antes.",
          "Assumir que todas as regras já foram cobertas.",
          "Não estender o exemplo a todas as locuções, terminações e fatores atrativos sem ensino.",
          "Proibir toda variante de fala brasileira."
        ],
        "answer": 2,
        "explanation": "O recorte tem infinitivo simples e condições explicitadas.",
        "optionRationales": [
          "Futuros com todas as condições não foram ensinados.",
          "Há ampliações expressamente pendentes.",
          "O recorte tem infinitivo simples e condições explicitadas.",
          "Não é o alcance da orientação formal adotada."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "cp03-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.cp03.q01": [
          {
            "missionId": "portuguese.meaning.pronouns.infinitivo",
            "sectionId": "entrada"
          }
        ],
        "q.cp03.q02": [
          {
            "missionId": "portuguese.meaning.pronouns.infinitivo",
            "sectionId": "infinitivo"
          }
        ],
        "q.cp03.q03": [
          {
            "missionId": "portuguese.meaning.pronouns.infinitivo",
            "sectionId": "infinitivo"
          }
        ],
        "q.cp03.q04": [
          {
            "missionId": "portuguese.meaning.pronouns.infinitivo",
            "sectionId": "ex-duas"
          }
        ],
        "q.cp03.q05": [
          {
            "missionId": "portuguese.meaning.pronouns.infinitivo",
            "sectionId": "preservar"
          }
        ],
        "q.cp03.q06": [
          {
            "missionId": "portuguese.meaning.pronouns.infinitivo",
            "sectionId": "comparar"
          }
        ],
        "q.cp03.q07": [
          {
            "missionId": "portuguese.meaning.pronouns.infinitivo",
            "sectionId": "ex-duas"
          }
        ],
        "q.cp03.q08": [
          {
            "missionId": "portuguese.meaning.pronouns.infinitivo",
            "sectionId": "limites"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.cp03",
      "blockId": "portuguese.meaning-writing",
      "prerequisiteId": "portuguese.meaning.pronouns.formal",
      "parametersApproved": false
    }
  },
  {
    "id": "portuguese.meaning.pronouns.revisao",
    "topicId": "portuguese.meaning.pronouns.revisao",
    "contentVersion": 1,
    "order": 125,
    "title": "Colocação pronominal: revisão delimitada",
    "shortTitle": "CP-R",
    "kind": "lesson",
    "objective": "Identificar e aplicar a colocação dos pronomes átonos nos casos delimitados pelo manual formal adotado.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "meaning-cp-intro-r1",
      "releaseSequence": 17,
      "changeImpact": "new"
    },
    "sourceIds": [
      "cp.cpr.funag.colocacao",
      "cp.cpr.authorial.cpr"
    ],
    "sections": [
      {
        "id": "posicao",
        "heading": "1. Recuperação: posição",
        "body": "CP01: me antes do verbo é próclise, depois com hífen é ênclise, no meio da forma futura Lembrar-me-ei é mesóclise. Reconhecimento não prova obrigatoriedade em todo contexto.",
        "type": "explanation",
        "sourceIds": [
          "cp.cpr.funag.colocacao"
        ]
      },
      {
        "id": "formal",
        "heading": "2. Recuperação: condição formal",
        "body": "CP02: negativa sem pausa com verbo simples requer antes; início formal sem fator atrativo usa verbo antes do átono no caso. Não generalizar a orientação para toda fala ou locução.",
        "type": "explanation",
        "sourceIds": [
          "cp.cpr.funag.colocacao"
        ]
      },
      {
        "id": "infinitivo",
        "heading": "3. Recuperação: possibilidade",
        "body": "CP03 admite Para me lembrar / Para lembrar-me no infinitivo simples dado. Conservar me preserva referência; te mudaria a pessoa informada. Não escolher única possibilidade quando o caso ensinou duas.",
        "type": "explanation",
        "sourceIds": [
          "cp.cpr.funag.colocacao"
        ]
      },
      {
        "id": "ex-posicao",
        "heading": "4. Exemplo resolvido: forma inteira",
        "body": "Eu me lembro: me antes; Lembro-me: depois; Lembrar-me-ei: no meio do futuro. Não chamar todo hífen de mesóclise.",
        "type": "worked-example",
        "sourceIds": [
          "cp.cpr.funag.colocacao"
        ]
      },
      {
        "id": "ex-formal",
        "heading": "5. Exemplo resolvido: não e início",
        "body": "Não me engano mantém negativa sem pausa e próclise; Engano-me às vezes inicia oração formal sem atrator. Não apagar não para resolver colocação.",
        "type": "worked-example",
        "sourceIds": [
          "cp.cpr.funag.colocacao"
        ]
      },
      {
        "id": "ex-infinitivo",
        "heading": "6. Exemplo resolvido: mesma pessoa",
        "body": "Para me lembrar e Para lembrar-me conservam me nas duas posições admitidas no caso de infinitivo simples. Trocar me por te não é só mudar posição.",
        "type": "worked-example",
        "sourceIds": [
          "cp.cpr.funag.colocacao"
        ]
      },
      {
        "id": "retomadas",
        "heading": "7. Retomar a condição",
        "body": "[CP-01](cp-01-v1.md) · [CP-02](cp-02-v1.md) · [CP-03](cp-03-v1.md)",
        "type": "explanation",
        "sourceIds": [
          "cp.cpr.funag.colocacao"
        ],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "CP-01",
                "missionId": "portuguese.meaning.pronouns.posicoes",
                "sectionId": "entrada",
                "wholeLesson": true
              },
              {
                "text": " · "
              },
              {
                "text": "CP-02",
                "missionId": "portuguese.meaning.pronouns.formal",
                "sectionId": "entrada",
                "wholeLesson": true
              },
              {
                "text": " · "
              },
              {
                "text": "CP-03",
                "missionId": "portuguese.meaning.pronouns.infinitivo",
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
        "body": "Pronome átono é forma como me/te/se, que se liga ao verbo na construção. Próclise: antes; ênclise: depois, com hífen; mesóclise: no meio da forma futura exemplificada. Infinitivo: forma como lembrar. Registro formal adotado: orientação específica do manual, sem condenar todas as variantes de fala.",
        "type": "glossary",
        "sourceIds": [
          "cp.cpr.funag.colocacao"
        ]
      },
      {
        "id": "recuperacao",
        "heading": "Recuperar pela condição",
        "body": "Identifique pronome e verbo, marque posição e condição do caso: negativa sem pausa, início formal ou infinitivo com duas possibilidades ensinadas. Não confundir posição com sentido do referente nem generalizar para todas as locuções/tempos/variedades.",
        "type": "summary",
        "sourceIds": [
          "cp.cpr.funag.colocacao"
        ]
      }
    ],
    "recall": [
      "Onde está o pronome em relação ao verbo?",
      "Qual condição formal foi informada?",
      "O caso admite mais de uma posição?"
    ],
    "questions": [
      {
        "id": "q.cpr.q01",
        "topicId": "portuguese.meaning.pronouns.revisao",
        "prompt": "Me em Eu me engano aparece antes do verbo. Que posição foi ensinada?",
        "options": [
          "Próclise.",
          "Ênclise.",
          "Mesóclise.",
          "Ausência de pronome."
        ],
        "answer": 0,
        "explanation": "A posição anterior é próclise.",
        "optionRationales": [
          "A posição anterior é próclise.",
          "Posterior seria ênclise.",
          "Não está no meio de futuro.",
          "Me está presente."
        ]
      },
      {
        "id": "q.cpr.q02",
        "topicId": "portuguese.meaning.pronouns.revisao",
        "prompt": "Como se classifica me em Engano-me no caso dado?",
        "options": [
          "Mesóclise.",
          "Próclise.",
          "Ênclise.",
          "Artigo definido."
        ],
        "answer": 2,
        "explanation": "O pronome vem depois do verbo, ligado por hífen.",
        "optionRationales": [
          "Não é forma futura com pronome interno.",
          "Não vem antes.",
          "O pronome vem depois do verbo, ligado por hífen.",
          "Me é pronome."
        ]
      },
      {
        "id": "q.cpr.q03",
        "topicId": "portuguese.meaning.pronouns.revisao",
        "prompt": "No padrão formal adotado, qual opção preserva negativa sem pausa com verbo simples lembro?",
        "options": [
          "Não lembro-me.",
          "Não me lembro.",
          "Não lembro me, como ênclise sem hífen.",
          "Me não lembro, como construção dada."
        ],
        "answer": 1,
        "explanation": "A condição pede pronome antes do verbo.",
        "optionRationales": [
          "Não segue próclise requerida.",
          "A condição pede pronome antes do verbo.",
          "Não representa a construção ensinada.",
          "Não representa o arranjo dado."
        ]
      },
      {
        "id": "q.cpr.q04",
        "topicId": "portuguese.meaning.pronouns.revisao",
        "prompt": "Qual escrita inicia a oração formal sem atrator dado com verbo lembro e átono me?",
        "options": [
          "Lembro me do tema, como ênclise sem hífen.",
          "Me lembro do tema, iniciando com átono.",
          "Me-lembro do tema.",
          "Lembro-me do tema."
        ],
        "answer": 3,
        "explanation": "Segue verbo antes do átono com hífen no caso formal.",
        "optionRationales": [
          "Falta a ligação escrita da ênclise.",
          "Não segue a orientação de início dada.",
          "Não representa a ligação ensinada.",
          "Segue verbo antes do átono com hífen no caso formal."
        ]
      },
      {
        "id": "q.cpr.q05",
        "topicId": "portuguese.meaning.pronouns.revisao",
        "prompt": "No infinitivo simples delimitado, como avaliar Para me lembrar / Para lembrar-me?",
        "options": [
          "Só a segunda em todo uso.",
          "Só a primeira em todo uso.",
          "As duas formas são admitidas.",
          "As duas são mesóclise."
        ],
        "answer": 2,
        "explanation": "O ensino admite ambas no caso.",
        "optionRationales": [
          "A primeira também é admitida.",
          "A segunda também é admitida.",
          "O ensino admite ambas no caso.",
          "Não são internas a futuro."
        ]
      },
      {
        "id": "q.cpr.q06",
        "topicId": "portuguese.meaning.pronouns.revisao",
        "prompt": "O caso distingue quem fala de quem ouve. Trocar me por te muda apenas posição?",
        "options": [
          "Não: muda a referência pessoal informada.",
          "Sim: toda troca de pronome é posição.",
          "Sim: não existe referência pessoal.",
          "Não: muda obrigatoriamente o dia de hoje."
        ],
        "answer": 0,
        "explanation": "A forma e a referência mudam, não apenas a posição.",
        "optionRationales": [
          "A forma e a referência mudam, não apenas a posição.",
          "Posição compara a mesma forma em relação ao verbo.",
          "O caso explicitou pessoas diferentes.",
          "Dia não está nessa mudança."
        ]
      },
      {
        "id": "q.cpr.q07",
        "topicId": "portuguese.meaning.pronouns.revisao",
        "prompt": "Você chamou Lembrar-me-ei de ênclise simples depois de toda a forma. O que deve retomar?",
        "options": [
          "A regra de toda frase ser infinitivo.",
          "Só o gênero de aviso.",
          "A ausência de todos os hífens.",
          "A posição interna de me na forma futura exemplificada."
        ],
        "answer": 3,
        "explanation": "O exemplo é mesóclise, com pronome no meio.",
        "optionRationales": [
          "A forma dada é futura, não infinitivo simples.",
          "Gênero não resolve a posição.",
          "Há hífens no exemplo.",
          "O exemplo é mesóclise, com pronome no meio."
        ]
      },
      {
        "id": "q.cpr.q08",
        "topicId": "portuguese.meaning.pronouns.revisao",
        "prompt": "Qual afirmação preserva o alcance da orientação formal de início?",
        "options": [
          "Prova que toda fala brasileira é sem regra.",
          "Não transforma variantes de fala em impossibilidade universal.",
          "Dispensa qualquer condição formal.",
          "Resolve todas as locuções verbais."
        ],
        "answer": 1,
        "explanation": "O registro adotado foi delimitado.",
        "optionRationales": [
          "Isso não é o ensino.",
          "O registro adotado foi delimitado.",
          "As condições continuam aplicáveis ao exercício.",
          "Locuções completas ficaram fora."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "cpr-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.cpr.q01": [
          {
            "missionId": "portuguese.meaning.pronouns.revisao",
            "sectionId": "posicao"
          },
          {
            "missionId": "portuguese.meaning.pronouns.posicoes",
            "sectionId": "antes"
          }
        ],
        "q.cpr.q02": [
          {
            "missionId": "portuguese.meaning.pronouns.revisao",
            "sectionId": "posicao"
          },
          {
            "missionId": "portuguese.meaning.pronouns.posicoes",
            "sectionId": "depois"
          }
        ],
        "q.cpr.q03": [
          {
            "missionId": "portuguese.meaning.pronouns.revisao",
            "sectionId": "formal"
          },
          {
            "missionId": "portuguese.meaning.pronouns.formal",
            "sectionId": "negativa"
          }
        ],
        "q.cpr.q04": [
          {
            "missionId": "portuguese.meaning.pronouns.revisao",
            "sectionId": "formal"
          },
          {
            "missionId": "portuguese.meaning.pronouns.formal",
            "sectionId": "inicio"
          }
        ],
        "q.cpr.q05": [
          {
            "missionId": "portuguese.meaning.pronouns.revisao",
            "sectionId": "infinitivo"
          },
          {
            "missionId": "portuguese.meaning.pronouns.infinitivo",
            "sectionId": "entrada"
          }
        ],
        "q.cpr.q06": [
          {
            "missionId": "portuguese.meaning.pronouns.revisao",
            "sectionId": "infinitivo"
          },
          {
            "missionId": "portuguese.meaning.pronouns.infinitivo",
            "sectionId": "preservar"
          }
        ],
        "q.cpr.q07": [
          {
            "missionId": "portuguese.meaning.pronouns.revisao",
            "sectionId": "recuperacao"
          },
          {
            "missionId": "portuguese.meaning.pronouns.posicoes",
            "sectionId": "meio"
          }
        ],
        "q.cpr.q08": [
          {
            "missionId": "portuguese.meaning.pronouns.revisao",
            "sectionId": "formal"
          },
          {
            "missionId": "portuguese.meaning.pronouns.formal",
            "sectionId": "limites"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.cpr",
      "blockId": "portuguese.meaning-writing",
      "prerequisiteId": "portuguese.meaning.pronouns.infinitivo",
      "parametersApproved": false
    }
  },
  {
    "id": "portuguese.meaning.pronouns.boss",
    "topicId": "portuguese.meaning.pronouns.boss",
    "contentVersion": 1,
    "order": 126,
    "title": "Colocação pronominal: Chefe introdutório",
    "shortTitle": "CP-CHEFE",
    "kind": "boss",
    "objective": "Identificar e aplicar a colocação dos pronomes átonos nos casos delimitados pelo manual formal adotado.",
    "xp": 220,
    "passScore": 75,
    "estimatedMinutes": 30,
    "publication": {
      "status": "draft",
      "releaseId": "meaning-cp-intro-r1",
      "releaseSequence": 17,
      "changeImpact": "new"
    },
    "sourceIds": [
      "cp.cpchefe.funag.colocacao",
      "cp.cpchefe.authorial.cpchefe"
    ],
    "sections": [
      {
        "id": "posicao",
        "heading": "1. Recuperação: posição",
        "body": "CP01: me antes do verbo é próclise, depois com hífen é ênclise, no meio da forma futura Lembrar-me-ei é mesóclise. Reconhecimento não prova obrigatoriedade em todo contexto.",
        "type": "explanation",
        "sourceIds": [
          "cp.cpchefe.funag.colocacao"
        ]
      },
      {
        "id": "formal",
        "heading": "2. Recuperação: condição formal",
        "body": "CP02: negativa sem pausa com verbo simples requer antes; início formal sem fator atrativo usa verbo antes do átono no caso. Não generalizar a orientação para toda fala ou locução.",
        "type": "explanation",
        "sourceIds": [
          "cp.cpchefe.funag.colocacao"
        ]
      },
      {
        "id": "infinitivo",
        "heading": "3. Recuperação: possibilidade",
        "body": "CP03 admite Para me lembrar / Para lembrar-me no infinitivo simples dado. Conservar me preserva referência; te mudaria a pessoa informada. Não escolher única possibilidade quando o caso ensinou duas.",
        "type": "explanation",
        "sourceIds": [
          "cp.cpchefe.funag.colocacao"
        ]
      },
      {
        "id": "ex-chefe",
        "heading": "4. Exemplo resolvido: condição antes da escolha",
        "body": "Não me lembro da tarefa tem negativa sem pausa e próclise. Para lembrar-me da tarefa contém infinitivo e ênclise, admitida junto de Para me lembrar no caso. Não transplantar regra de uma construção para outra sem identificar a condição.",
        "type": "worked-example",
        "sourceIds": [
          "cp.cpchefe.funag.colocacao"
        ]
      },
      {
        "id": "retomadas",
        "heading": "5. Retomar ensino",
        "body": "[CP-01](cp-01-v1.md) · [CP-02](cp-02-v1.md) · [CP-03](cp-03-v1.md) · [CP-R](cp-r-v1.md)",
        "type": "explanation",
        "sourceIds": [
          "cp.cpchefe.funag.colocacao"
        ],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "CP-01",
                "missionId": "portuguese.meaning.pronouns.posicoes",
                "sectionId": "entrada",
                "wholeLesson": true
              },
              {
                "text": " · "
              },
              {
                "text": "CP-02",
                "missionId": "portuguese.meaning.pronouns.formal",
                "sectionId": "entrada",
                "wholeLesson": true
              },
              {
                "text": " · "
              },
              {
                "text": "CP-03",
                "missionId": "portuguese.meaning.pronouns.infinitivo",
                "sectionId": "entrada",
                "wholeLesson": true
              },
              {
                "text": " · "
              },
              {
                "text": "CP-R",
                "missionId": "portuguese.meaning.pronouns.revisao",
                "sectionId": "posicao",
                "wholeLesson": true
              }
            ]
          }
        ]
      },
      {
        "id": "glossario",
        "heading": "Vocabulário de apoio",
        "body": "Pronome átono é forma como me/te/se, que se liga ao verbo na construção. Próclise: antes; ênclise: depois, com hífen; mesóclise: no meio da forma futura exemplificada. Infinitivo: forma como lembrar. Registro formal adotado: orientação específica do manual, sem condenar todas as variantes de fala.",
        "type": "glossary",
        "sourceIds": [
          "cp.cpchefe.funag.colocacao"
        ]
      },
      {
        "id": "recuperacao",
        "heading": "Recuperar pela condição",
        "body": "Identifique pronome e verbo, marque posição e condição do caso: negativa sem pausa, início formal ou infinitivo com duas possibilidades ensinadas. Não confundir posição com sentido do referente nem generalizar para todas as locuções/tempos/variedades.",
        "type": "summary",
        "sourceIds": [
          "cp.cpchefe.funag.colocacao"
        ]
      }
    ],
    "recall": [
      "Onde está o pronome em relação ao verbo?",
      "Qual condição formal foi informada?",
      "O caso admite mais de uma posição?"
    ],
    "questions": [
      {
        "id": "q.cpchefe.q01",
        "topicId": "portuguese.meaning.pronouns.boss",
        "prompt": "Em Eu me lembro da tarefa, qual par identifica verbo e átono cuja posição se analisa?",
        "options": [
          "Da e tarefa.",
          "Eu e tarefa.",
          "Lembro e me.",
          "Eu e da."
        ],
        "answer": 2,
        "explanation": "Lembro é verbo; me é o átono analisado.",
        "optionRationales": [
          "Da não é o verbo desse par.",
          "Eu é sujeito e tarefa é nome.",
          "Lembro é verbo; me é o átono analisado.",
          "Não identifica verbo e átono."
        ]
      },
      {
        "id": "q.cpchefe.q02",
        "topicId": "portuguese.meaning.pronouns.boss",
        "prompt": "Me depois do verbo em Lembro-me da tarefa recebe qual classificação?",
        "options": [
          "Ênclise.",
          "Próclise.",
          "Mesóclise.",
          "Artigo indefinido."
        ],
        "answer": 0,
        "explanation": "A posição posterior com hífen é ênclise.",
        "optionRationales": [
          "A posição posterior com hífen é ênclise.",
          "Não é anterior.",
          "Não é interna a futuro.",
          "Me não é artigo."
        ]
      },
      {
        "id": "q.cpchefe.q03",
        "topicId": "portuguese.meaning.pronouns.boss",
        "prompt": "O padrão é formal, com negativa não sem pausa e verbo simples engano. Qual forma segue o ensino?",
        "options": [
          "Me não engano nessa tarefa, como arranjo pedido.",
          "Não engano-me nessa tarefa.",
          "Não engano me nessa tarefa, como ênclise sem hífen.",
          "Não me engano nessa tarefa."
        ],
        "answer": 3,
        "explanation": "A condição negativa pede próclise ao verbo.",
        "optionRationales": [
          "Não representa a construção fornecida.",
          "Não segue a condição ensinada.",
          "Não representa a ligação/posição requerida.",
          "A condição negativa pede próclise ao verbo."
        ]
      },
      {
        "id": "q.cpchefe.q04",
        "topicId": "portuguese.meaning.pronouns.boss",
        "prompt": "Por que Não me lembro não deve virar Lembro-me ao preservar a frase negativa dada?",
        "options": [
          "Porque não nunca muda sentido.",
          "A troca apagaria a negação, mudando conteúdo e condição.",
          "Porque toda frase sem não é equivalente.",
          "Porque me é sempre artigo."
        ],
        "answer": 1,
        "explanation": "A informação negativa precisa permanecer.",
        "optionRationales": [
          "Não nega o conteúdo.",
          "A informação negativa precisa permanecer.",
          "Apagar negação altera a mensagem.",
          "Me é pronome."
        ]
      },
      {
        "id": "q.cpchefe.q05",
        "topicId": "portuguese.meaning.pronouns.boss",
        "prompt": "Qual opção atende ao início de oração formal sem atrator dado, com verbo engano e átono me?",
        "options": [
          "Me engano às vezes, iniciando com átono.",
          "Engano-me às vezes.",
          "Me-engano às vezes.",
          "Engano me às vezes, como ênclise sem hífen."
        ],
        "answer": 1,
        "explanation": "Verbo antes de me com hífen segue o caso formal.",
        "optionRationales": [
          "Não segue a orientação de início adotada.",
          "Verbo antes de me com hífen segue o caso formal.",
          "Ligação antes do verbo não é a ênclise ensinada.",
          "O hífen de ligação está ausente."
        ]
      },
      {
        "id": "q.cpchefe.q06",
        "topicId": "portuguese.meaning.pronouns.boss",
        "prompt": "Qual leitura do exemplo inicial Me lembro na fala respeita o limite do exercício?",
        "options": [
          "A existência da variante elimina o padrão formal do exercício.",
          "A variante é impossível em qualquer fala.",
          "Toda fala é inferior e sem regras.",
          "A variante pode ocorrer na fala, embora não cumpra o padrão formal de início aqui adotado."
        ],
        "answer": 3,
        "explanation": "A orientação foi delimitada por registro e condição.",
        "optionRationales": [
          "O exercício continua seguindo o padrão explicitado.",
          "Não se afirmou impossibilidade linguística universal.",
          "Isso não é conclusão ensinada.",
          "A orientação foi delimitada por registro e condição."
        ]
      },
      {
        "id": "q.cpchefe.q07",
        "topicId": "portuguese.meaning.pronouns.boss",
        "prompt": "No caso simples ensinado, quais formas com infinitivo e me são admitidas?",
        "options": [
          "Para me lembrar da tarefa / Para lembrar-me da tarefa.",
          "Só Para me lembrar, em qualquer construção.",
          "Só Para lembrar-me, em qualquer construção.",
          "Nenhuma forma com infinitivo."
        ],
        "answer": 0,
        "explanation": "A orientação admite antes e depois no caso dado.",
        "optionRationales": [
          "A orientação admite antes e depois no caso dado.",
          "A alternativa posterior também é admitida.",
          "A anterior também é admitida.",
          "O infinitivo foi ensinado."
        ]
      },
      {
        "id": "q.cpchefe.q08",
        "topicId": "portuguese.meaning.pronouns.boss",
        "prompt": "Em Para me lembrar da tarefa, qual posição me ocupa?",
        "options": [
          "No meio de futuro, em mesóclise.",
          "Depois, em ênclise.",
          "Antes do infinitivo, em próclise.",
          "É artigo do substantivo tarefa."
        ],
        "answer": 2,
        "explanation": "Me antecede lembrar.",
        "optionRationales": [
          "Não está dentro de forma futura.",
          "Não vem depois.",
          "Me antecede lembrar.",
          "Me não é artigo de tarefa."
        ]
      },
      {
        "id": "q.cpchefe.q09",
        "topicId": "portuguese.meaning.pronouns.boss",
        "prompt": "No exemplo Lembrar-me-ei da tarefa, qual posição foi ensinada?",
        "options": [
          "Ausência de pronome.",
          "Ênclise depois de toda a forma.",
          "Próclise antes de toda a forma.",
          "Mesóclise na forma futura exemplificada."
        ],
        "answer": 3,
        "explanation": "Me está no meio da forma futura.",
        "optionRationales": [
          "Me está presente.",
          "Não está depois de toda a forma.",
          "Não está antes de toda a forma.",
          "Me está no meio da forma futura."
        ]
      },
      {
        "id": "q.cpchefe.q10",
        "topicId": "portuguese.meaning.pronouns.boss",
        "prompt": "Sob a hipótese de falante e ouvinte distintos, trocar Para lembrar-me por Para lembrar-te é só colocação?",
        "options": [
          "Sim: todo pronome tem a mesma referência.",
          "Não: troca a forma e a referência pessoal informada.",
          "Sim: te é apenas me depois do verbo.",
          "Não: muda obrigatoriamente o tempo verbal para passado."
        ],
        "answer": 1,
        "explanation": "Não desloca o mesmo pronome; troca a pessoa indicada.",
        "optionRationales": [
          "O caso distingue pessoas.",
          "Não desloca o mesmo pronome; troca a pessoa indicada.",
          "Te não é a mesma forma me.",
          "A mudança indicada não é de tempo verbal."
        ]
      },
      {
        "id": "q.cpchefe.q11",
        "topicId": "portuguese.meaning.pronouns.boss",
        "prompt": "Qual limite evita transformar o exemplo de infinitivo em regra universal?",
        "options": [
          "Proibir toda próclise ao infinitivo.",
          "Aplicar a mesma conclusão a qualquer locução.",
          "Não decidir todas as locuções e terminações sem ensino específico.",
          "Obrigar mesóclise em todos os infinitivos."
        ],
        "answer": 2,
        "explanation": "O recorte delimitou infinitivo simples e condições específicas.",
        "optionRationales": [
          "Próclise foi admitida no caso.",
          "Locuções amplas ficaram fora.",
          "O recorte delimitou infinitivo simples e condições específicas.",
          "Infinitivo simples não é futuro com mesóclise."
        ]
      },
      {
        "id": "q.cpchefe.q12",
        "topicId": "portuguese.meaning.pronouns.boss",
        "prompt": "Você ignorou não sem pausa e marcou ênclise no verbo simples. Que recuperação se aplica?",
        "options": [
          "Identificar a negativa e retomar a próclise do caso formal ensinado.",
          "Apagar não para forçar a alternativa.",
          "Generalizar ênclise a toda frase.",
          "Inventar pausa ausente no enunciado."
        ],
        "answer": 0,
        "explanation": "A condição explicitada determina a recuperação.",
        "optionRationales": [
          "A condição explicitada determina a recuperação.",
          "Apagaria conteúdo original.",
          "Contraria o caso negativo ensinado.",
          "Não se pode alterar a hipótese dada."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "cpchefe-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.cpchefe.q01": [
          {
            "missionId": "portuguese.meaning.pronouns.boss",
            "sectionId": "posicao"
          },
          {
            "missionId": "portuguese.meaning.pronouns.posicoes",
            "sectionId": "antes"
          }
        ],
        "q.cpchefe.q02": [
          {
            "missionId": "portuguese.meaning.pronouns.boss",
            "sectionId": "posicao"
          },
          {
            "missionId": "portuguese.meaning.pronouns.posicoes",
            "sectionId": "depois"
          }
        ],
        "q.cpchefe.q03": [
          {
            "missionId": "portuguese.meaning.pronouns.boss",
            "sectionId": "formal"
          },
          {
            "missionId": "portuguese.meaning.pronouns.formal",
            "sectionId": "negativa"
          }
        ],
        "q.cpchefe.q04": [
          {
            "missionId": "portuguese.meaning.pronouns.boss",
            "sectionId": "formal"
          },
          {
            "missionId": "portuguese.meaning.pronouns.formal",
            "sectionId": "condicao"
          }
        ],
        "q.cpchefe.q05": [
          {
            "missionId": "portuguese.meaning.pronouns.boss",
            "sectionId": "formal"
          },
          {
            "missionId": "portuguese.meaning.pronouns.formal",
            "sectionId": "inicio"
          }
        ],
        "q.cpchefe.q06": [
          {
            "missionId": "portuguese.meaning.pronouns.boss",
            "sectionId": "formal"
          },
          {
            "missionId": "portuguese.meaning.pronouns.formal",
            "sectionId": "inicio"
          }
        ],
        "q.cpchefe.q07": [
          {
            "missionId": "portuguese.meaning.pronouns.boss",
            "sectionId": "infinitivo"
          },
          {
            "missionId": "portuguese.meaning.pronouns.infinitivo",
            "sectionId": "entrada"
          }
        ],
        "q.cpchefe.q08": [
          {
            "missionId": "portuguese.meaning.pronouns.boss",
            "sectionId": "infinitivo"
          },
          {
            "missionId": "portuguese.meaning.pronouns.infinitivo",
            "sectionId": "infinitivo"
          }
        ],
        "q.cpchefe.q09": [
          {
            "missionId": "portuguese.meaning.pronouns.boss",
            "sectionId": "posicao"
          },
          {
            "missionId": "portuguese.meaning.pronouns.posicoes",
            "sectionId": "meio"
          }
        ],
        "q.cpchefe.q10": [
          {
            "missionId": "portuguese.meaning.pronouns.boss",
            "sectionId": "infinitivo"
          },
          {
            "missionId": "portuguese.meaning.pronouns.infinitivo",
            "sectionId": "preservar"
          }
        ],
        "q.cpchefe.q11": [
          {
            "missionId": "portuguese.meaning.pronouns.boss",
            "sectionId": "infinitivo"
          },
          {
            "missionId": "portuguese.meaning.pronouns.infinitivo",
            "sectionId": "limites"
          }
        ],
        "q.cpchefe.q12": [
          {
            "missionId": "portuguese.meaning.pronouns.boss",
            "sectionId": "recuperacao"
          },
          {
            "missionId": "portuguese.meaning.pronouns.formal",
            "sectionId": "ex-negativa"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.cpchefe",
      "blockId": "portuguese.meaning-writing",
      "prerequisiteId": "portuguese.meaning.pronouns.revisao",
      "parametersApproved": false
    }
  }
]);
export const CP_SOURCES = Object.freeze([
  {
    "id": "cp.cp01.funag.colocacao",
    "label": "FUNAG - Manual de Revisão: colocação pronominal (fontes Cunha/Cintra e Almeida)",
    "url": "https://funag.gov.br/manual/index.php?title=Coloca%C3%A7%C3%A3o_pronominal&oldid=553",
    "version": "oldid553; página atribui Cunha/Cintra2001 e Almeida2009; consultada em04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "Tipos antes/depois/meio; Com um só verbo2a (negativa sem pausa),4 (infinitivos próclise/ênclise); regra final início formal. Não aplicar as afirmações amplas de locuções verbais/advérbios/futuro a variantes não ensinadas."
  },
  {
    "id": "cp.cp01.authorial.cp01",
    "label": "Material autoral da Missão Bancária — CP-01 (rascunho local)",
    "url": "https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado",
    "version": "Texto e exercícios autorais v1",
    "checkedAt": "2026-10-04",
    "locator": "docs/missao-bancaria/rascunhos/cp-01-v1.mjs",
    "provenance": "project-authored",
    "remoteArtifactAvailable": false
  },
  {
    "id": "cp.cp02.funag.colocacao",
    "label": "FUNAG - Manual de Revisão: colocação pronominal (fontes Cunha/Cintra e Almeida)",
    "url": "https://funag.gov.br/manual/index.php?title=Coloca%C3%A7%C3%A3o_pronominal&oldid=553",
    "version": "oldid553; página atribui Cunha/Cintra2001 e Almeida2009; consultada em04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "Tipos antes/depois/meio; Com um só verbo2a (negativa sem pausa),4 (infinitivos próclise/ênclise); regra final início formal. Não aplicar as afirmações amplas de locuções verbais/advérbios/futuro a variantes não ensinadas."
  },
  {
    "id": "cp.cp02.authorial.cp02",
    "label": "Material autoral da Missão Bancária — CP-02 (rascunho local)",
    "url": "https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado",
    "version": "Texto e exercícios autorais v1",
    "checkedAt": "2026-10-04",
    "locator": "docs/missao-bancaria/rascunhos/cp-02-v1.mjs",
    "provenance": "project-authored",
    "remoteArtifactAvailable": false
  },
  {
    "id": "cp.cp03.funag.colocacao",
    "label": "FUNAG - Manual de Revisão: colocação pronominal (fontes Cunha/Cintra e Almeida)",
    "url": "https://funag.gov.br/manual/index.php?title=Coloca%C3%A7%C3%A3o_pronominal&oldid=553",
    "version": "oldid553; página atribui Cunha/Cintra2001 e Almeida2009; consultada em04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "Tipos antes/depois/meio; Com um só verbo2a (negativa sem pausa),4 (infinitivos próclise/ênclise); regra final início formal. Não aplicar as afirmações amplas de locuções verbais/advérbios/futuro a variantes não ensinadas."
  },
  {
    "id": "cp.cp03.authorial.cp03",
    "label": "Material autoral da Missão Bancária — CP-03 (rascunho local)",
    "url": "https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado",
    "version": "Texto e exercícios autorais v1",
    "checkedAt": "2026-10-04",
    "locator": "docs/missao-bancaria/rascunhos/cp-03-v1.mjs",
    "provenance": "project-authored",
    "remoteArtifactAvailable": false
  },
  {
    "id": "cp.cpr.funag.colocacao",
    "label": "FUNAG - Manual de Revisão: colocação pronominal (fontes Cunha/Cintra e Almeida)",
    "url": "https://funag.gov.br/manual/index.php?title=Coloca%C3%A7%C3%A3o_pronominal&oldid=553",
    "version": "oldid553; página atribui Cunha/Cintra2001 e Almeida2009; consultada em04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "Tipos antes/depois/meio; Com um só verbo2a (negativa sem pausa),4 (infinitivos próclise/ênclise); regra final início formal. Não aplicar as afirmações amplas de locuções verbais/advérbios/futuro a variantes não ensinadas."
  },
  {
    "id": "cp.cpr.authorial.cpr",
    "label": "Material autoral da Missão Bancária — CP-R (rascunho local)",
    "url": "https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado",
    "version": "Texto e exercícios autorais v1",
    "checkedAt": "2026-10-04",
    "locator": "docs/missao-bancaria/rascunhos/cp-r-v1.mjs",
    "provenance": "project-authored",
    "remoteArtifactAvailable": false
  },
  {
    "id": "cp.cpchefe.funag.colocacao",
    "label": "FUNAG - Manual de Revisão: colocação pronominal (fontes Cunha/Cintra e Almeida)",
    "url": "https://funag.gov.br/manual/index.php?title=Coloca%C3%A7%C3%A3o_pronominal&oldid=553",
    "version": "oldid553; página atribui Cunha/Cintra2001 e Almeida2009; consultada em04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "Tipos antes/depois/meio; Com um só verbo2a (negativa sem pausa),4 (infinitivos próclise/ênclise); regra final início formal. Não aplicar as afirmações amplas de locuções verbais/advérbios/futuro a variantes não ensinadas."
  },
  {
    "id": "cp.cpchefe.authorial.cpchefe",
    "label": "Material autoral da Missão Bancária — CP-CHEFE (rascunho local)",
    "url": "https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado",
    "version": "Texto e exercícios autorais v1",
    "checkedAt": "2026-10-04",
    "locator": "docs/missao-bancaria/rascunhos/cp-chefe-v1.mjs",
    "provenance": "project-authored",
    "remoteArtifactAvailable": false
  }
]);
