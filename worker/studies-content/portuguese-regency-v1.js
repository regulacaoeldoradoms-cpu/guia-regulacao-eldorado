// Gerado por node worker/scripts/studies-rg-candidate.mjs --write. Não editar.
// Rascunhos RG locais. Desativado; sem autorização de ativação/publicação.
export const RG_MISSIONS = Object.freeze([
  {
    "id": "portuguese.syntax.regency.vinculos",
    "topicId": "portuguese.syntax.regency.vinculos",
    "contentVersion": 1,
    "order": 107,
    "title": "Regência e concordância: separar os vínculos",
    "shortTitle": "RG-01",
    "kind": "lesson",
    "objective": "Reconhecer a ligação verbo/complemento nos usos já ensinados, distinguindo-a do ajuste ao sujeito.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "syntax-regency-intro-r1",
      "releaseSequence": 14,
      "changeImpact": "new"
    },
    "sourceIds": [
      "rg.rg01.authorial.rg01"
    ],
    "sections": [
      {
        "id": "entrada",
        "heading": "1. Outra relação além da concordância",
        "body": "CN ensinou ajustar verbo ao sujeito em pessoa/número. Regência observa outra relação: um termo se liga a outro que depende dele, como verbo e complemento. No recorte verbal, investigue se esse uso do verbo pede complemento sem preposição ou com determinada preposição. Não confundir flexionar o verbo com escolher essa ligação.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "direto",
        "heading": "2. Complemento sem preposição no uso dado",
        "body": "Retomando CF-03: em A equipe leu o roteiro, o roteiro completa leu sem preposição, objeto direto no exemplo. Em o roteiro, o é artigo que acompanha roteiro, não preposição. Em A equipe preparou o resumo ontem, o resumo completa preparou sem preposição; ontem indica tempo, não é objeto apenas por vir depois do verbo.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "indireto",
        "heading": "3. Complemento com preposição no uso dado",
        "body": "Em A aluna precisa de material, precisar significa necessitar. De introduz o complemento material: de material é objeto indireto no uso ensinado em CF. De é preposição, elemento que liga termos. Não se ensinaram todos os significados de precisar nem todos os verbos; não decidir só pela palavra que aparece após o verbo.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "ex-direto",
        "heading": "4. Exemplo resolvido: ler",
        "body": "A aluna leu o aviso: leu é verbo; A aluna é sujeito; o aviso é complemento sem preposição no uso dado. O que se ensina sobre regência aqui é o vínculo verbo/complemento. A flexão leu está em terceira pessoa singular passada, um vínculo de concordância diferente.",
        "type": "worked-example",
        "sourceIds": []
      },
      {
        "id": "ex-indireto",
        "heading": "5. Exemplo resolvido: precisar de",
        "body": "O aluno precisa de tempo: no sentido de necessitar, precisa se liga a de tempo; manter de nesse uso. O aluno é sujeito e controla a terceira pessoa singular precisa. Tempo não controla essa forma verbal.",
        "type": "worked-example",
        "sourceIds": []
      },
      {
        "id": "ex-vinculos",
        "heading": "6. Exemplo resolvido: mudar número sem trocar regência",
        "body": "A aluna precisa de tempo → As alunas precisam de tempo. A mudança do sujeito para plural pede precisam. A relação com o complemento no mesmo sentido continua com de: de tempo. Concordância varia a forma; regência identifica a ligação. Não retirar a preposição por causa do plural.",
        "type": "worked-example",
        "sourceIds": []
      },
      {
        "id": "limites",
        "heading": "7. Não transformar um exemplo em lista universal",
        "body": "Esta aula reutiliza usos já ensinados em CF e os relaciona à concordância de CN. Não ensina todas as regências, mudança de sentido de outros verbos, regência nominal, relativo com preposição ou crase. Nem todo grupo com de completa verbo: em CF, grupos como das aulas também acompanham substantivo dentro do sujeito. Leia o vínculo e o sentido.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "retomadas",
        "heading": "8. Consultar as bases",
        "body": "[CF-03: sujeito e complementos](cf-03-v1.md#complementos) · [CN-01: concordância verbal](cn-01-v1.md#nucleo)",
        "type": "explanation",
        "sourceIds": [],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "CF-03: sujeito e complementos",
                "missionId": "portuguese.syntax.foundation.grupos",
                "sectionId": "complementos",
                "wholeLesson": false
              },
              {
                "text": " · "
              },
              {
                "text": "CN-01: concordância verbal",
                "missionId": "portuguese.syntax.concordance.verbal",
                "sectionId": "nucleo",
                "wholeLesson": false
              }
            ]
          }
        ]
      },
      {
        "id": "glossario",
        "heading": "Vocabulário de apoio",
        "body": "Termo regente: termo do qual outro depende nessa relação. Termo regido: termo dependente. Regência verbal: vínculo entre verbo e complemento no uso apresentado. Preposição: palavra que liga termos, como de. Artigo: acompanha substantivo, como o em o roteiro. Concordância: ajuste de pessoa/número ou gênero/número entre termos relacionados. Objeto direto/indireto foram ensinados nos exemplos de CF.",
        "type": "glossary",
        "sourceIds": []
      },
      {
        "id": "recuperacao",
        "heading": "Refazer sem confundir vínculos",
        "body": "Localize sujeito/verbo/complemento e a circunstância, se houver. Explique qual termo controla a forma verbal e qual elemento liga o complemento. Retome CF-03 para a função; CN-01 para a concordância. Só então corrija a opção, mantendo o sentido da frase.",
        "type": "summary",
        "sourceIds": []
      }
    ],
    "recall": [
      "Qual é o sujeito e qual é o complemento?",
      "O uso dado liga o complemento sem preposição ou com de?",
      "Estou corrigindo concordância ou regência?"
    ],
    "questions": [
      {
        "id": "q.rg01.q01",
        "topicId": "portuguese.syntax.regency.vinculos",
        "prompt": "No uso A equipe leu o roteiro, como o roteiro se liga ao verbo?",
        "options": [
          "Completa leu por meio de de.",
          "Completa leu sem preposição.",
          "É sujeito que controla leu.",
          "É uma indicação de tempo."
        ],
        "answer": 1,
        "explanation": "O roteiro é objeto direto no uso de ler ensinado.",
        "optionRationales": [
          "Não aparece de nessa relação.",
          "O roteiro é objeto direto no uso de ler ensinado.",
          "A equipe é o sujeito.",
          "O roteiro não indica quando a leitura ocorreu."
        ]
      },
      {
        "id": "q.rg01.q02",
        "topicId": "portuguese.syntax.regency.vinculos",
        "prompt": "No uso A aluna precisa de material, que elemento liga o complemento material ao verbo?",
        "options": [
          "O sinal final.",
          "O artigo o.",
          "A forma plural precisam.",
          "A preposição de."
        ],
        "answer": 3,
        "explanation": "De liga o complemento ao verbo precisar no sentido de necessitar usado aqui.",
        "optionRationales": [
          "Pontuação não substitui a preposição exigida nesse uso.",
          "Esse artigo não aparece na relação dada.",
          "Precisam é outra flexão verbal, não elemento de ligação.",
          "De liga o complemento ao verbo precisar no sentido de necessitar usado aqui."
        ]
      },
      {
        "id": "q.rg01.q03",
        "topicId": "portuguese.syntax.regency.vinculos",
        "prompt": "Compare A aluna precisa de tempo e As alunas precisam de tempo. Qual análise distingue os vínculos?",
        "options": [
          "Pluralizar o sujeito exige retirar de.",
          "Precisa/precisam são preposições; de é a forma verbal.",
          "Precisa/precisam ajustam-se ao sujeito; de mantém o vínculo com o complemento.",
          "De passou a ser sujeito no plural."
        ],
        "answer": 2,
        "explanation": "Concordância ajusta a forma verbal; regência conserva a relação com de no mesmo uso.",
        "optionRationales": [
          "A mudança de número não retira a preposição nesse uso.",
          "As classes foram trocadas.",
          "Concordância ajusta a forma verbal; regência conserva a relação com de no mesmo uso.",
          "De não é sujeito."
        ]
      },
      {
        "id": "q.rg01.q04",
        "topicId": "portuguese.syntax.regency.vinculos",
        "prompt": "Em A equipe preparou o resumo ontem, qual distinção foi ensinada?",
        "options": [
          "O resumo completa preparou; ontem indica tempo.",
          "Ontem é objeto direto e o resumo indica tempo.",
          "Tudo depois do verbo é objeto.",
          "Preparou deve concordar com ontem."
        ],
        "answer": 0,
        "explanation": "O resumo é complemento no exemplo; ontem é circunstância temporal.",
        "optionRationales": [
          "O resumo é complemento no exemplo; ontem é circunstância temporal.",
          "As funções foram invertidas.",
          "Posição depois do verbo não basta.",
          "O sujeito A equipe controla a concordância verbal."
        ]
      },
      {
        "id": "q.rg01.q05",
        "topicId": "portuguese.syntax.regency.vinculos",
        "prompt": "Se o sentido é necessitar no uso ensinado, qual frase conserva o vínculo de precisar?",
        "options": [
          "O aluno precisa para orientação.",
          "O aluno precisa orientação.",
          "O aluno precisa de orientação.",
          "O aluno precisa o orientação."
        ],
        "answer": 2,
        "explanation": "De introduz o complemento nesse uso de precisar.",
        "optionRationales": [
          "Para não é a preposição ensinada nessa relação.",
          "Falta a preposição exigida no uso delimitado.",
          "De introduz o complemento nesse uso de precisar.",
          "O não substitui de e o grupo fica inadequado."
        ]
      },
      {
        "id": "q.rg01.q06",
        "topicId": "portuguese.syntax.regency.vinculos",
        "prompt": "Qual afirmação interpreta o de de A equipe precisou de tempo sem criar regra universal?",
        "options": [
          "Introduz o complemento do verbo nesse uso; outros grupos com de exigem análise própria.",
          "Todo de sempre introduz objeto indireto de um verbo.",
          "Todo grupo depois de verbo é objeto indireto.",
          "Preposição elimina a necessidade de analisar o verbo."
        ],
        "answer": 0,
        "explanation": "O vínculo com precisar foi ensinado; a presença isolada de de não determina toda função.",
        "optionRationales": [
          "O vínculo com precisar foi ensinado; a presença isolada de de não determina toda função.",
          "De pode ligar outros termos, como visto em CF.",
          "Há circunstâncias e complementos sem preposição.",
          "O uso verbal e o sentido continuam relevantes."
        ]
      },
      {
        "id": "q.rg01.q07",
        "topicId": "portuguese.syntax.regency.vinculos",
        "prompt": "Você confundiu a flexão precisam com a ligação de em Os alunos precisam de material. Qual recuperação é adequada?",
        "options": [
          "Trocar toda preposição por um artigo.",
          "Retirar de para marcar sujeito plural.",
          "Concordar precisam com material por proximidade.",
          "Separar sujeito/forma verbal e verbo/complemento, justificando cada vínculo."
        ],
        "answer": 3,
        "explanation": "Alunos controla a flexão; de liga o complemento a precisar no uso ensinado.",
        "optionRationales": [
          "Artigo e preposição não têm a mesma função.",
          "Número do sujeito não elimina essa relação.",
          "Material não é sujeito nesse exemplo.",
          "Alunos controla a flexão; de liga o complemento a precisar no uso ensinado."
        ]
      },
      {
        "id": "q.rg01.q08",
        "topicId": "portuguese.syntax.regency.vinculos",
        "prompt": "Qual limite conserva o recorte desta aula?",
        "options": [
          "Toda forma de precisar exige de em qualquer sentido.",
          "Ler/preparar e precisar foram analisados nos sentidos e frases apresentados.",
          "Todo verbo que vem antes de o é objeto direto.",
          "Uma lista de preposições substitui a leitura do contexto."
        ],
        "answer": 1,
        "explanation": "A regra é delimitada pelos usos apresentados, não por uma lista universal.",
        "optionRationales": [
          "Não se ensinaram todos os sentidos de precisar.",
          "A regra é delimitada pelos usos apresentados, não por uma lista universal.",
          "O verbo não é objeto e a posição isolada não prova função.",
          "O contexto e o vínculo são necessários."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "rg01-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.rg01.q01": [
          {
            "missionId": "portuguese.syntax.regency.vinculos",
            "sectionId": "direto"
          }
        ],
        "q.rg01.q02": [
          {
            "missionId": "portuguese.syntax.regency.vinculos",
            "sectionId": "indireto"
          }
        ],
        "q.rg01.q03": [
          {
            "missionId": "portuguese.syntax.regency.vinculos",
            "sectionId": "ex-vinculos"
          }
        ],
        "q.rg01.q04": [
          {
            "missionId": "portuguese.syntax.regency.vinculos",
            "sectionId": "direto"
          }
        ],
        "q.rg01.q05": [
          {
            "missionId": "portuguese.syntax.regency.vinculos",
            "sectionId": "indireto"
          }
        ],
        "q.rg01.q06": [
          {
            "missionId": "portuguese.syntax.regency.vinculos",
            "sectionId": "limites"
          }
        ],
        "q.rg01.q07": [
          {
            "missionId": "portuguese.syntax.regency.vinculos",
            "sectionId": "recuperacao"
          }
        ],
        "q.rg01.q08": [
          {
            "missionId": "portuguese.syntax.regency.vinculos",
            "sectionId": "limites"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.rg01",
      "blockId": "portuguese.syntax",
      "prerequisiteId": "portuguese.syntax.concordance.boss",
      "parametersApproved": false
    }
  },
  {
    "id": "portuguese.syntax.regency.sentidos",
    "topicId": "portuguese.syntax.regency.sentidos",
    "contentVersion": 1,
    "order": 108,
    "title": "Regência verbal e sentido: seguir o padrão explicitado",
    "shortTitle": "RG-02",
    "kind": "lesson",
    "objective": "Identificar regente, sentido e dependente, aplicando só os vínculos ensinados e o padrão editorial explicitamente adotado.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "syntax-regency-intro-r1",
      "releaseSequence": 14,
      "changeImpact": "new"
    },
    "sourceIds": [
      "rg.rg02.senado.rg.assistir",
      "rg.rg02.senado.rg.visar",
      "rg.rg02.authorial.rg02"
    ],
    "sections": [
      {
        "id": "entrada",
        "heading": "1. Sentido antes da ligação",
        "body": "RG-01 separou regência e concordância. Agora dois verbos mostram que a ligação depende do sentido e do padrão adotado. Este lote adota para os itens a orientação editorial do Manual de Comunicação do Senado sobre assistir/visar, explicitando suas ressalvas. Não é uma lista de todas as variantes aceitas em todos os registros.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "presenciar",
        "heading": "2. Assistir no sentido de presenciar",
        "body": "No padrão aqui ensinado, assistir significando estar presente/presenciar tem complemento com a: Os alunos assistiram a uma apresentação. A uma apresentação é complemento do verbo nesse uso. Não confundir a preposição a com um artigo nem omiti-la ao seguir este padrão. Não se ensinam aqui todos os usos de assistir.",
        "type": "explanation",
        "sourceIds": [
          "rg.rg02.senado.rg.assistir"
        ]
      },
      {
        "id": "ajudar",
        "heading": "3. Assistir no sentido de ajudar",
        "body": "No sentido de auxiliar/ajudar, o manual recomenda usar assistir como transitivo direto. No exemplo fictício O monitor assistiu o grupo na organização do mural, o contexto informa ajuda; o grupo completa o verbo sem preposição e o é artigo. O fato de presenciar usar a não autoriza copiar essa regência para qualquer sentido. Outras análises/variantes de registros diferentes não são cobradas.",
        "type": "explanation",
        "sourceIds": [
          "rg.rg02.senado.rg.assistir"
        ]
      },
      {
        "id": "visar",
        "heading": "4. Visar: preferência e ressalva",
        "body": "Com sentido de ter objetivo e complemento nominal, o manual prefere visar com a: O programa visa a melhorias. Prefere não significa que a variante direta com nome seja universalmente proibida. Antes de verbo no infinitivo, esse manual orienta não usar a: O programa visa melhorar o roteiro. No sentido de mirar/carimbar, apresenta visar como direto: A funcionária visou o documento, com sentido de carimbar neste exemplo fictício; sem orientação sobre validade de documentos. Não cobrar crase aqui: os exemplos não exigem esse tópico.",
        "type": "explanation",
        "sourceIds": [
          "rg.rg02.senado.rg.visar"
        ]
      },
      {
        "id": "ex-presenciar",
        "heading": "5. Exemplo resolvido: apresentação",
        "body": "O grupo assistiu a uma apresentação: o contexto é de presenciar; no padrão adotado, a liga o complemento ao verbo. Uma acompanha apresentação como artigo. Assistiu é singular porque o sujeito é O grupo: a concordância não substitui a análise de regência.",
        "type": "worked-example",
        "sourceIds": [
          "rg.rg02.senado.rg.assistir"
        ]
      },
      {
        "id": "ex-ajudar",
        "heading": "6. Exemplo resolvido: auxílio no mural",
        "body": "O monitor assistiu o grupo na organização do mural, no sentido informado de ajudar. Seguindo o manual, o grupo é complemento direto; o é artigo, não preposição. Na organização do mural contextualiza a ajuda. Não decidir pelo mesmo verbo escrito sem verificar o sentido.",
        "type": "worked-example",
        "sourceIds": [
          "rg.rg02.senado.rg.assistir"
        ]
      },
      {
        "id": "ex-visar",
        "heading": "7. Exemplo resolvido: nome e infinitivo",
        "body": "O programa visa a melhorias: melhorias é nome, a segue a preferência editorial para objetivo. O programa visa melhorar o roteiro: melhorar é infinitivo e a não aparece, conforme a ressalva do mesmo manual. Não reduzir a orientação a todo visar sempre exige a.",
        "type": "worked-example",
        "sourceIds": [
          "rg.rg02.senado.rg.visar"
        ]
      },
      {
        "id": "limites",
        "heading": "8. Um padrão não é toda a língua",
        "body": "As respostas seguem o sentido informado e a orientação editorial ensinada. Visar a com nome é preferência, não condenação universal da construção direta; o caso de infinitivo tem ressalva. Assistir depende do sentido apresentado. Não se cobram aspiração, preferência, obediência, relativas, pronomes ou todas as regências nominais.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "glossario",
        "heading": "Vocabulário de apoio",
        "body": "Regência: relação de dependência entre termos. Regente é o termo do qual outro depende; regido é o dependente. Regência verbal liga verbo e complemento no uso dado; nominal relaciona um nome e o grupo que dele depende. Preposição liga termos; artigo acompanha substantivo. Infinitivo é a forma verbal como melhorar/organizar. Preferência editorial é escolha indicada por um manual para seu padrão, não proibição universal de outras variantes.",
        "type": "glossary",
        "sourceIds": []
      },
      {
        "id": "recuperacao",
        "heading": "Refazer pelo termo e pelo sentido",
        "body": "Localize o termo regente e seu sentido no contexto; identifique o dependente e a ligação. Se o item adota orientação de manual, releia também o alcance e as ressalvas. Separe concordância, regência e artigo. Não trocar preposição mecanicamente nem generalizar uma frase para todos os usos.",
        "type": "summary",
        "sourceIds": []
      }
    ],
    "recall": [
      "Qual termo rege a ligação neste uso?",
      "O sentido e a orientação de referência foram explicitados?",
      "Qual ressalva impede uma regra universal?"
    ],
    "questions": [
      {
        "id": "q.rg02.q01",
        "topicId": "portuguese.syntax.regency.sentidos",
        "prompt": "Seguindo o padrão do Senado ensinado, qual construção apresenta assistir no sentido de presenciar?",
        "options": [
          "Os alunos assistiram de uma apresentação.",
          "Os alunos assistiram uma apresentação.",
          "Os alunos assistiram a uma apresentação.",
          "Os alunos assistiram por uma apresentação."
        ],
        "answer": 2,
        "explanation": "A introduz o complemento no sentido de presenciar, no padrão adotado.",
        "optionRationales": [
          "De não é a ligação ensinada.",
          "Não segue a ligação ensinada para este padrão/sentido.",
          "A introduz o complemento no sentido de presenciar, no padrão adotado.",
          "Por não é a ligação ensinada."
        ]
      },
      {
        "id": "q.rg02.q02",
        "topicId": "portuguese.syntax.regency.sentidos",
        "prompt": "O contexto informa ajuda: O monitor assistiu o grupo no mural. Segundo a orientação ensinada, o grupo completa o verbo como?",
        "options": [
          "Complemento direto, sem preposição.",
          "Complemento introduzido pela preposição o.",
          "Sujeito que determina assistiu.",
          "Um termo que só pode indicar tempo."
        ],
        "answer": 0,
        "explanation": "O manual orienta uso direto no sentido de ajudar; o acompanha grupo como artigo.",
        "optionRationales": [
          "O manual orienta uso direto no sentido de ajudar; o acompanha grupo como artigo.",
          "O é artigo nesse grupo, não preposição.",
          "O monitor é sujeito.",
          "O grupo identifica quem recebeu ajuda no caso."
        ]
      },
      {
        "id": "q.rg02.q03",
        "topicId": "portuguese.syntax.regency.sentidos",
        "prompt": "Para objetivo com nome, qual frase segue a preferência editorial ensinada para visar?",
        "options": [
          "O projeto visa por melhorias.",
          "O projeto visa de melhorias.",
          "O projeto visa com melhorias.",
          "O projeto visa a melhorias."
        ],
        "answer": 3,
        "explanation": "A é a preposição preferida pelo manual no caso com nome e sentido de objetivo.",
        "optionRationales": [
          "Por não segue essa preferência no vínculo dado.",
          "De não segue essa preferência no vínculo dado.",
          "Com não segue a preferência no vínculo dado.",
          "A é a preposição preferida pelo manual no caso com nome e sentido de objetivo."
        ]
      },
      {
        "id": "q.rg02.q04",
        "topicId": "portuguese.syntax.regency.sentidos",
        "prompt": "Conforme a ressalva do manual adotado, qual forma se usa diante de melhorar, infinitivo?",
        "options": [
          "O programa visa a melhorar o roteiro.",
          "O programa visa melhorar o roteiro.",
          "O programa visa de melhorar o roteiro.",
          "O programa visa por melhorar o roteiro."
        ],
        "answer": 1,
        "explanation": "O manual orienta não inserir a antes do infinitivo nesse caso.",
        "optionRationales": [
          "Não segue a ressalva editorial aqui adotada; não é proibição geral de outras referências/variantes.",
          "O manual orienta não inserir a antes do infinitivo nesse caso.",
          "De não corresponde à orientação.",
          "Por não corresponde à orientação."
        ]
      },
      {
        "id": "q.rg02.q05",
        "topicId": "portuguese.syntax.regency.sentidos",
        "prompt": "Qual leitura conserva o alcance de visar a melhorias no manual estudado?",
        "options": [
          "É preferência para objetivo com nome, com ressalva própria antes de infinitivo.",
          "Todo uso de visar exige a.",
          "Visar direto com nome é impossível em qualquer registro.",
          "A orientação depende só de a frase ser comprida."
        ],
        "answer": 0,
        "explanation": "O texto delimita sentido, tipo de complemento e caráter preferencial.",
        "optionRationales": [
          "O texto delimita sentido, tipo de complemento e caráter preferencial.",
          "Mirar/carimbar e infinitivo não seguem essa generalização.",
          "Preferência não equivale a proibição universal.",
          "Comprimento não define a regência."
        ]
      },
      {
        "id": "q.rg02.q06",
        "topicId": "portuguese.syntax.regency.sentidos",
        "prompt": "O enunciado explica que visou o documento significa carimbou no exemplo fictício. No manual estudado, o documento completa visar como?",
        "options": [
          "Sujeito composto.",
          "Complemento obrigatoriamente ligado por a.",
          "Complemento direto.",
          "Circunstância de tempo."
        ],
        "answer": 2,
        "explanation": "O sentido de carimbar é apresentado como direto.",
        "optionRationales": [
          "Documento não é o sujeito no caso.",
          "Não se aplica a ele a preferência do sentido de objetivo.",
          "O sentido de carimbar é apresentado como direto.",
          "Documento não indica tempo."
        ]
      },
      {
        "id": "q.rg02.q07",
        "topicId": "portuguese.syntax.regency.sentidos",
        "prompt": "Você impôs a mesma ligação em dois usos de assistir sem ler o contexto. Que recuperação é pertinente?",
        "options": [
          "Decidir só pela quantidade de palavras.",
          "Identificar se é presenciar ou ajudar e retomar o padrão do sentido informado.",
          "Tratar todo a como artigo.",
          "Trocar o sujeito para evitar ler o complemento."
        ],
        "answer": 1,
        "explanation": "O sentido e a orientação ensinada controlam a comparação.",
        "optionRationales": [
          "Comprimento não define regência.",
          "O sentido e a orientação ensinada controlam a comparação.",
          "A pode ser preposição no caso de presenciar.",
          "Isso altera a frase sem analisar o vínculo."
        ]
      },
      {
        "id": "q.rg02.q08",
        "topicId": "portuguese.syntax.regency.sentidos",
        "prompt": "Em O grupo assistiu a uma apresentação, qual distinção corresponde ao caso ensinado?",
        "options": [
          "Assistiu concorda com apresentação porque ela vem depois.",
          "A é o sujeito; uma é verbo.",
          "A substitui a concordância com o sujeito.",
          "A é preposição; uma acompanha apresentação; assistiu ajusta-se ao sujeito singular."
        ],
        "answer": 3,
        "explanation": "Há ligação de regência com a e ajuste verbal com o sujeito O grupo.",
        "optionRationales": [
          "O complemento não controla a flexão no caso.",
          "As classes/funções foram trocadas.",
          "São vínculos diferentes.",
          "Há ligação de regência com a e ajuste verbal com o sujeito O grupo."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "rg02-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.rg02.q01": [
          {
            "missionId": "portuguese.syntax.regency.sentidos",
            "sectionId": "presenciar"
          }
        ],
        "q.rg02.q02": [
          {
            "missionId": "portuguese.syntax.regency.sentidos",
            "sectionId": "ajudar"
          }
        ],
        "q.rg02.q03": [
          {
            "missionId": "portuguese.syntax.regency.sentidos",
            "sectionId": "visar"
          }
        ],
        "q.rg02.q04": [
          {
            "missionId": "portuguese.syntax.regency.sentidos",
            "sectionId": "ex-visar"
          }
        ],
        "q.rg02.q05": [
          {
            "missionId": "portuguese.syntax.regency.sentidos",
            "sectionId": "limites"
          }
        ],
        "q.rg02.q06": [
          {
            "missionId": "portuguese.syntax.regency.sentidos",
            "sectionId": "visar"
          }
        ],
        "q.rg02.q07": [
          {
            "missionId": "portuguese.syntax.regency.sentidos",
            "sectionId": "recuperacao"
          }
        ],
        "q.rg02.q08": [
          {
            "missionId": "portuguese.syntax.regency.sentidos",
            "sectionId": "ex-presenciar"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.rg02",
      "blockId": "portuguese.syntax",
      "prerequisiteId": "portuguese.syntax.regency.vinculos",
      "parametersApproved": false
    }
  },
  {
    "id": "portuguese.syntax.regency.nominal",
    "topicId": "portuguese.syntax.regency.nominal",
    "contentVersion": 1,
    "order": 109,
    "title": "Regência nominal: identificar o nome e seu dependente",
    "shortTitle": "RG-03",
    "kind": "lesson",
    "objective": "Identificar regente, sentido e dependente, aplicando só os vínculos ensinados e o padrão editorial explicitamente adotado.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "syntax-regency-intro-r1",
      "releaseSequence": 14,
      "changeImpact": "new"
    },
    "sourceIds": [
      "rg.rg03.authorial.rg03"
    ],
    "sections": [
      {
        "id": "entrada",
        "heading": "1. O regente não precisa ser verbo",
        "body": "Regência nominal observa relação de dependência a partir de um nome, como substantivo ou adjetivo. Aqui vamos identificar só dois grupos nominais dados, necessidade de revisão e leitura do roteiro. Os exemplos são autorais de estrutura, não uma lista normativa de preposições exclusivas para todos os nomes/sentidos.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "necessidade",
        "heading": "2. Necessidade de revisão",
        "body": "Em Há necessidade de revisão, necessidade é substantivo; de revisão depende desse nome e esclarece de que há necessidade no uso dado. A relação nominal é com necessidade, não com há. De liga os termos; não conclua que todo grupo com de seja objeto de um verbo.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "leitura",
        "heading": "3. Leitura do roteiro e contração",
        "body": "Em A leitura do roteiro terminou, do é a contração de de com o, artigo que acompanha roteiro: de + o = do. Do roteiro depende do substantivo leitura no grupo dado. O sujeito inteiro tem leitura como núcleo e controla terminou. Não se cobra distinguir toda classe de complemento/adjunto nominal; o objetivo é identificar nome e vínculo.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "vinculos",
        "heading": "4. Comparar sem criar exclusividade",
        "body": "Compare A aluna precisa de tempo e Há necessidade de tempo: no primeiro, o grupo com de completa precisa no uso ensinado; no segundo, depende do nome necessidade. A mesma preposição não torna as relações idênticas. Não afirmar que um nome só admite uma preposição em todos os sentidos; outros usos e adjetivos exigem ensino específico.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "ex-nome",
        "heading": "5. Exemplo resolvido: qual termo rege",
        "body": "Em Há necessidade de orientação, marque necessidade como nome; de orientação identifica o conteúdo dessa necessidade. Há é haver impessoal, como ensinado em CN. O grupo de orientação liga-se ao nome no exemplo, sem trocar o verbo por uma forma plural.",
        "type": "worked-example",
        "sourceIds": []
      },
      {
        "id": "ex-leitura",
        "heading": "6. Exemplo resolvido: nome e forma verbal",
        "body": "A leitura dos roteiros terminou: dos reúne de + os; o grupo dos roteiros depende de leitura. Leitura é núcleo singular do sujeito e controla terminou; roteiros plural não controla o verbo. Há vínculo nominal e concordância verbal na mesma frase.",
        "type": "worked-example",
        "sourceIds": []
      },
      {
        "id": "ex-comparar",
        "heading": "7. Exemplo resolvido: trocar estrutura",
        "body": "A equipe precisou de tempo contém verbo precisou e seu complemento de tempo. A necessidade de tempo aumentou contém nome necessidade e seu dependente de tempo; aumentou concorda com o sujeito de núcleo necessidade. Não decidir só pela palavra de nem chamar todo dependente de nome de objeto indireto.",
        "type": "worked-example",
        "sourceIds": []
      },
      {
        "id": "limites",
        "heading": "8. O que ainda fica fora",
        "body": "Aula introdutória de identificação estrutural em dois grupos nominais. Não ensina lista de regências de adjetivos, nomes com múltiplas preposições, relativos, pronomes ou crase; não afirma preposição exclusiva para todos os usos de necessidade/leitura. A expansão normativa lexical exige referência pertinente antes de novas questões prescritivas.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "glossario",
        "heading": "Vocabulário de apoio",
        "body": "Regência: relação de dependência entre termos. Regente é o termo do qual outro depende; regido é o dependente. Regência verbal liga verbo e complemento no uso dado; nominal relaciona um nome e o grupo que dele depende. Preposição liga termos; artigo acompanha substantivo. Infinitivo é a forma verbal como melhorar/organizar. Preferência editorial é escolha indicada por um manual para seu padrão, não proibição universal de outras variantes.",
        "type": "glossary",
        "sourceIds": []
      },
      {
        "id": "recuperacao",
        "heading": "Refazer pelo termo e pelo sentido",
        "body": "Localize o termo regente e seu sentido no contexto; identifique o dependente e a ligação. Se o item adota orientação de manual, releia também o alcance e as ressalvas. Separe concordância, regência e artigo. Não trocar preposição mecanicamente nem generalizar uma frase para todos os usos.",
        "type": "summary",
        "sourceIds": []
      }
    ],
    "recall": [
      "Qual termo rege a ligação neste uso?",
      "O sentido e a orientação de referência foram explicitados?",
      "Qual ressalva impede uma regra universal?"
    ],
    "questions": [
      {
        "id": "q.rg03.q01",
        "topicId": "portuguese.syntax.regency.nominal",
        "prompt": "No grupo necessidade de revisão, qual termo é o nome regente no uso dado?",
        "options": [
          "necessidade",
          "de",
          "revisão",
          "Um verbo oculto obrigatório."
        ],
        "answer": 0,
        "explanation": "Necessidade é o substantivo do qual depende de revisão no exemplo.",
        "optionRationales": [
          "Necessidade é o substantivo do qual depende de revisão no exemplo.",
          "De liga termos.",
          "Revisão é o dependente apresentado.",
          "Não há essa exigência de um verbo oculto."
        ]
      },
      {
        "id": "q.rg03.q02",
        "topicId": "portuguese.syntax.regency.nominal",
        "prompt": "Em A leitura do roteiro terminou, qual composição de do foi ensinada?",
        "options": [
          "Duas formas do sujeito eu.",
          "Dois verbos no passado.",
          "De + o, preposição e artigo.",
          "A + a, sempre."
        ],
        "answer": 2,
        "explanation": "Do reúne de com o, artigo de roteiro.",
        "optionRationales": [
          "Não é combinação de pronomes eu.",
          "Não é uma locução verbal.",
          "Do reúne de com o, artigo de roteiro.",
          "Não é a composição ensinada."
        ]
      },
      {
        "id": "q.rg03.q03",
        "topicId": "portuguese.syntax.regency.nominal",
        "prompt": "Compare precisa de tempo e necessidade de tempo. Qual distinção preserva os usos dados?",
        "options": [
          "Ambos só podem ter regência verbal porque há de.",
          "De tempo depende de um verbo no primeiro e de um nome no segundo.",
          "Ambos só podem ter regência nominal porque há tempo.",
          "A preposição de elimina qualquer dependência."
        ],
        "answer": 1,
        "explanation": "Precisa é verbo; necessidade é nome na comparação apresentada.",
        "optionRationales": [
          "A presença de de não decide qual termo rege.",
          "Precisa é verbo; necessidade é nome na comparação apresentada.",
          "Tempo não transforma o verbo em nome.",
          "De participa da ligação, não a elimina."
        ]
      },
      {
        "id": "q.rg03.q04",
        "topicId": "portuguese.syntax.regency.nominal",
        "prompt": "Em A leitura dos roteiros terminou, qual termo controla terminou no caso?",
        "options": [
          "Qualquer palavra depois do verbo.",
          "Roteiros, por ser plural e próximo.",
          "Dos, por ser preposição/artigo.",
          "O sujeito de núcleo leitura, singular."
        ],
        "answer": 3,
        "explanation": "Leitura é o núcleo singular do sujeito; terminou mantém a concordância.",
        "optionRationales": [
          "A concordância não depende dessa posição.",
          "Roteiros integra o grupo nominal dependente.",
          "Dos não é núcleo do sujeito.",
          "Leitura é o núcleo singular do sujeito; terminou mantém a concordância."
        ]
      },
      {
        "id": "q.rg03.q05",
        "topicId": "portuguese.syntax.regency.nominal",
        "prompt": "Em Há necessidade de orientação, de orientação está ligado a qual termo no exemplo?",
        "options": [
          "A um sujeito orientação que pluraliza há.",
          "A há como objeto indireto obrigatório.",
          "Ao substantivo necessidade.",
          "A uma data não expressa."
        ],
        "answer": 2,
        "explanation": "O grupo esclarece a necessidade e depende desse nome no caso.",
        "optionRationales": [
          "Há é impessoal e orientação não é seu sujeito.",
          "Não é o vínculo nominal descrito.",
          "O grupo esclarece a necessidade e depende desse nome no caso.",
          "Orientação não introduz uma data no exemplo."
        ]
      },
      {
        "id": "q.rg03.q06",
        "topicId": "portuguese.syntax.regency.nominal",
        "prompt": "Qual afirmação respeita os limites da aula nominal?",
        "options": [
          "Identificamos vínculos nos grupos dados, sem provar preposição exclusiva para todo nome/sentido.",
          "Todo grupo com de é sempre objeto indireto.",
          "Todo nome só admite a preposição de.",
          "Regência nominal exige que o termo regente seja verbo."
        ],
        "answer": 0,
        "explanation": "A identificação estrutural não autoriza lista universal ou exclusividade lexical.",
        "optionRationales": [
          "A identificação estrutural não autoriza lista universal ou exclusividade lexical.",
          "Grupos com de podem depender de nomes.",
          "Não se ensinou essa regra universal.",
          "O regente nominal é um nome, não um verbo."
        ]
      },
      {
        "id": "q.rg03.q07",
        "topicId": "portuguese.syntax.regency.nominal",
        "prompt": "Você chamou de tempo de objeto indireto em A necessidade de tempo aumentou só por haver de. Qual retomada é pertinente?",
        "options": [
          "Retirar necessidade para evitar analisar a frase.",
          "Trocar aumentou por aumentaram por proximidade.",
          "Concluir que toda preposição rege um verbo.",
          "Identificar necessidade como nome regente do grupo e distinguir o verbo aumentou."
        ],
        "answer": 3,
        "explanation": "O grupo depende do nome; a função não é decidida só pela preposição.",
        "optionRationales": [
          "Isso muda a estrutura sem recuperá-la.",
          "Não corrige o vínculo e contraria o núcleo singular.",
          "A preposição pode ligar nome e dependente.",
          "O grupo depende do nome; a função não é decidida só pela preposição."
        ]
      },
      {
        "id": "q.rg03.q08",
        "topicId": "portuguese.syntax.regency.nominal",
        "prompt": "Em A leitura dos roteiros terminou, qual combinação identifica os dois vínculos?",
        "options": [
          "Terminou concorda com roteiros; dos é verbo.",
          "Dos roteiros depende de leitura; terminou concorda com o sujeito de núcleo leitura.",
          "Leitura concorda em pessoa com dos.",
          "Toda relação da frase é apenas pontuação."
        ],
        "answer": 1,
        "explanation": "Há relação nominal no grupo e verbal de concordância com o sujeito.",
        "optionRationales": [
          "Os vínculos/classes foram trocados.",
          "Há relação nominal no grupo e verbal de concordância com o sujeito.",
          "Pessoa verbal não é propriedade de dos.",
          "Os vínculos são sintáticos, não só pontuação."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "rg03-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.rg03.q01": [
          {
            "missionId": "portuguese.syntax.regency.nominal",
            "sectionId": "necessidade"
          }
        ],
        "q.rg03.q02": [
          {
            "missionId": "portuguese.syntax.regency.nominal",
            "sectionId": "leitura"
          }
        ],
        "q.rg03.q03": [
          {
            "missionId": "portuguese.syntax.regency.nominal",
            "sectionId": "vinculos"
          }
        ],
        "q.rg03.q04": [
          {
            "missionId": "portuguese.syntax.regency.nominal",
            "sectionId": "ex-leitura"
          }
        ],
        "q.rg03.q05": [
          {
            "missionId": "portuguese.syntax.regency.nominal",
            "sectionId": "ex-nome"
          }
        ],
        "q.rg03.q06": [
          {
            "missionId": "portuguese.syntax.regency.nominal",
            "sectionId": "limites"
          }
        ],
        "q.rg03.q07": [
          {
            "missionId": "portuguese.syntax.regency.nominal",
            "sectionId": "recuperacao"
          }
        ],
        "q.rg03.q08": [
          {
            "missionId": "portuguese.syntax.regency.nominal",
            "sectionId": "ex-leitura"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.rg03",
      "blockId": "portuguese.syntax",
      "prerequisiteId": "portuguese.syntax.regency.sentidos",
      "parametersApproved": false
    }
  },
  {
    "id": "portuguese.syntax.regency.revisao",
    "topicId": "portuguese.syntax.regency.revisao",
    "contentVersion": 1,
    "order": 110,
    "title": "Revisão: verbo ou nome, sentido e ligação",
    "shortTitle": "RG-R",
    "kind": "lesson",
    "objective": "Identificar regente, sentido e dependente, aplicando só os vínculos ensinados e o padrão editorial explicitamente adotado.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "syntax-regency-intro-r1",
      "releaseSequence": 14,
      "changeImpact": "new"
    },
    "sourceIds": [
      "rg.rgr.senado.rg.assistir",
      "rg.rgr.senado.rg.visar",
      "rg.rgr.authorial.rgr"
    ],
    "sections": [
      {
        "id": "entrada",
        "heading": "1. Recuperar sem decorar listas",
        "body": "Questões próprias combinam os usos de RG-01, a orientação explícita do Senado em RG-02 e a identificação nominal de RG-03. Recuperação deve começar por regente/sentido/dependente. Não é avaliação independente nem prova de retenção.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "ex-base",
        "heading": "2. Exemplo resolvido: forma e preposição",
        "body": "Os alunos precisam de orientação: alunos controla precisam, plural; de mantém a ligação do complemento no sentido de necessitar. Não mudar a preposição por causa do plural.",
        "type": "worked-example",
        "sourceIds": []
      },
      {
        "id": "ex-sentido",
        "heading": "3. Exemplo resolvido: padrão e ressalva",
        "body": "O programa visa a melhorias / O programa visa melhorar o roteiro: conforme a orientação do Senado, com nome usa-se preferencialmente a; diante do infinitivo, o manual orienta não usar a. Isso não cria regra universal para todo visar.",
        "type": "worked-example",
        "sourceIds": [
          "rg.rgr.senado.rg.visar"
        ]
      },
      {
        "id": "ex-nominal",
        "heading": "4. Exemplo resolvido: grupo dependente",
        "body": "A necessidade de revisão aumentou: de revisão depende do nome necessidade; aumentou concorda com o núcleo singular do sujeito. Não chamar de revisão de objeto indireto só por ter de.",
        "type": "worked-example",
        "sourceIds": []
      },
      {
        "id": "retomadas",
        "heading": "5. Consultar origens",
        "body": "[RG-01](rg-01-v1.md) · [RG-02](rg-02-v1.md) · [RG-03](rg-03-v1.md)",
        "type": "explanation",
        "sourceIds": [],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "RG-01",
                "missionId": "portuguese.syntax.regency.vinculos",
                "sectionId": "entrada",
                "wholeLesson": true
              },
              {
                "text": " · "
              },
              {
                "text": "RG-02",
                "missionId": "portuguese.syntax.regency.sentidos",
                "sectionId": "entrada",
                "wholeLesson": true
              },
              {
                "text": " · "
              },
              {
                "text": "RG-03",
                "missionId": "portuguese.syntax.regency.nominal",
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
        "body": "Regência: relação de dependência entre termos. Regente é o termo do qual outro depende; regido é o dependente. Regência verbal liga verbo e complemento no uso dado; nominal relaciona um nome e o grupo que dele depende. Preposição liga termos; artigo acompanha substantivo. Infinitivo é a forma verbal como melhorar/organizar. Preferência editorial é escolha indicada por um manual para seu padrão, não proibição universal de outras variantes.",
        "type": "glossary",
        "sourceIds": []
      },
      {
        "id": "recuperacao",
        "heading": "Refazer pelo termo e pelo sentido",
        "body": "Localize o termo regente e seu sentido no contexto; identifique o dependente e a ligação. Se o item adota orientação de manual, releia também o alcance e as ressalvas. Separe concordância, regência e artigo. Não trocar preposição mecanicamente nem generalizar uma frase para todos os usos.",
        "type": "summary",
        "sourceIds": []
      }
    ],
    "recall": [
      "Qual termo rege a ligação neste uso?",
      "O sentido e a orientação de referência foram explicitados?",
      "Qual ressalva impede uma regra universal?"
    ],
    "questions": [
      {
        "id": "q.rgr.q01",
        "topicId": "portuguese.syntax.regency.revisao",
        "prompt": "Em As alunas precisam de material, que análise corresponde ao ensino?",
        "options": [
          "O plural exige tirar de.",
          "De é a forma verbal plural.",
          "Material controla precisam por proximidade.",
          "Precisam ajusta-se ao sujeito plural; de introduz o complemento no uso dado."
        ],
        "answer": 3,
        "explanation": "Concordância e regência são vínculos distintos.",
        "optionRationales": [
          "A mudança de número não remove a ligação.",
          "De é preposição.",
          "Alunas controla a forma verbal.",
          "Concordância e regência são vínculos distintos."
        ]
      },
      {
        "id": "q.rgr.q02",
        "topicId": "portuguese.syntax.regency.revisao",
        "prompt": "No caso A equipe preparou a nota ontem, qual distinção é adequada?",
        "options": [
          "Ontem é objeto e a nota indica tempo.",
          "A nota completa preparou sem preposição; ontem indica tempo.",
          "Todas as palavras depois do verbo são objeto.",
          "Preparou concorda com ontem."
        ],
        "answer": 1,
        "explanation": "O complemento e a circunstância foram distinguidos nos usos ensinados.",
        "optionRationales": [
          "As funções foram invertidas.",
          "O complemento e a circunstância foram distinguidos nos usos ensinados.",
          "A posição isolada não decide a função.",
          "O sujeito A equipe controla o verbo."
        ]
      },
      {
        "id": "q.rgr.q03",
        "topicId": "portuguese.syntax.regency.revisao",
        "prompt": "Segundo o padrão do Senado adotado, assistir no sentido de presenciar usa qual ligação no caso dado?",
        "options": [
          "Assistiu a uma apresentação.",
          "Assistiu de uma apresentação.",
          "Assistiu por uma apresentação.",
          "Assistiu com uma apresentação, com a mesma função ensinada."
        ],
        "answer": 0,
        "explanation": "A é a preposição do padrão estudado para presenciar.",
        "optionRationales": [
          "A é a preposição do padrão estudado para presenciar.",
          "De não é a ligação estudada.",
          "Por não é a ligação estudada.",
          "Com não corresponde ao vínculo ensinado neste caso."
        ]
      },
      {
        "id": "q.rgr.q04",
        "topicId": "portuguese.syntax.regency.revisao",
        "prompt": "Qual afirmação sobre visar conserva a orientação estudada?",
        "options": [
          "Direto com nome é impossível em todos os registros.",
          "Todo visar exige a.",
          "Objetivo com nome prefere a; infinitivo tem ressalva no manual.",
          "O sentido de carimbar só pode ser indireto."
        ],
        "answer": 2,
        "explanation": "A fonte apresenta preferência e delimita o caso de infinitivo.",
        "optionRationales": [
          "Preferência não é proibição universal.",
          "Existem sentidos/casos diferentes na própria orientação.",
          "A fonte apresenta preferência e delimita o caso de infinitivo.",
          "Carimbar é apresentado como direto."
        ]
      },
      {
        "id": "q.rgr.q05",
        "topicId": "portuguese.syntax.regency.revisao",
        "prompt": "O monitor assistiu o grupo, com sentido informado de ajudar. Pelo padrão do manual, qual leitura é adequada?",
        "options": [
          "O é preposição obrigatória do sentido de presenciar.",
          "O grupo é complemento direto; o é artigo.",
          "O grupo é sujeito de assistiu.",
          "A frase é nominal sem verbo."
        ],
        "answer": 1,
        "explanation": "A orientação para ajudar é direta, e assistir continua verbo.",
        "optionRationales": [
          "O não é preposição nessa construção.",
          "A orientação para ajudar é direta, e assistir continua verbo.",
          "Monitor é sujeito no caso.",
          "Assistiu é verbo expresso."
        ]
      },
      {
        "id": "q.rgr.q06",
        "topicId": "portuguese.syntax.regency.revisao",
        "prompt": "Em A leitura dos roteiros terminou, de qual nome depende o grupo dos roteiros?",
        "options": [
          "dos",
          "terminou",
          "um sujeito oculto obrigatório",
          "leitura"
        ],
        "answer": 3,
        "explanation": "Dos roteiros integra o grupo dependente de leitura no caso.",
        "optionRationales": [
          "Dos é contração, não nome regente.",
          "Terminou é verbo e não o nome regente desse grupo.",
          "Não é preciso inventar esse sujeito.",
          "Dos roteiros integra o grupo dependente de leitura no caso."
        ]
      },
      {
        "id": "q.rgr.q07",
        "topicId": "portuguese.syntax.regency.revisao",
        "prompt": "Você chamou de revisão de objeto indireto em A necessidade de revisão aumentou. Qual recuperação é pertinente?",
        "options": [
          "Pluralizar aumentou sem identificar o núcleo.",
          "Tratar todo de como sinal suficiente de objeto verbal.",
          "Reconhecer o nome necessidade como regente desse grupo e analisar o verbo separadamente.",
          "Omitir necessidade para não analisar a relação."
        ],
        "answer": 2,
        "explanation": "A dependência nominal não é definida como objeto verbal só pela preposição.",
        "optionRationales": [
          "Isso confunde concordância e regência.",
          "A presença de de não basta.",
          "A dependência nominal não é definida como objeto verbal só pela preposição.",
          "Muda a frase em vez de recuperá-la."
        ]
      },
      {
        "id": "q.rgr.q08",
        "topicId": "portuguese.syntax.regency.revisao",
        "prompt": "No uso A aluna precisa de tempo, qual limite foi ensinado?",
        "options": [
          "A análise se restringe ao sentido de necessitar apresentado.",
          "Todo precisar em qualquer sentido foi classificado.",
          "Toda preposição da língua foi listada.",
          "Todos os nomes com de foram classificados como objetos."
        ],
        "answer": 0,
        "explanation": "O recorte não ensinou todas as acepções/regências.",
        "optionRationales": [
          "O recorte não ensinou todas as acepções/regências.",
          "Não se ensinou essa lista total.",
          "Não houve lista de todas as preposições.",
          "Nomes podem ter dependentes com de."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "rgr-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.rgr.q01": [
          {
            "missionId": "portuguese.syntax.regency.revisao",
            "sectionId": "ex-base"
          },
          {
            "missionId": "portuguese.syntax.regency.vinculos",
            "sectionId": "ex-vinculos"
          }
        ],
        "q.rgr.q02": [
          {
            "missionId": "portuguese.syntax.regency.revisao",
            "sectionId": "ex-base"
          },
          {
            "missionId": "portuguese.syntax.regency.vinculos",
            "sectionId": "direto"
          }
        ],
        "q.rgr.q03": [
          {
            "missionId": "portuguese.syntax.regency.revisao",
            "sectionId": "ex-sentido"
          },
          {
            "missionId": "portuguese.syntax.regency.sentidos",
            "sectionId": "presenciar"
          }
        ],
        "q.rgr.q04": [
          {
            "missionId": "portuguese.syntax.regency.revisao",
            "sectionId": "ex-sentido"
          },
          {
            "missionId": "portuguese.syntax.regency.sentidos",
            "sectionId": "visar"
          }
        ],
        "q.rgr.q05": [
          {
            "missionId": "portuguese.syntax.regency.revisao",
            "sectionId": "ex-sentido"
          },
          {
            "missionId": "portuguese.syntax.regency.sentidos",
            "sectionId": "ajudar"
          }
        ],
        "q.rgr.q06": [
          {
            "missionId": "portuguese.syntax.regency.revisao",
            "sectionId": "ex-nominal"
          },
          {
            "missionId": "portuguese.syntax.regency.nominal",
            "sectionId": "leitura"
          }
        ],
        "q.rgr.q07": [
          {
            "missionId": "portuguese.syntax.regency.revisao",
            "sectionId": "recuperacao"
          },
          {
            "missionId": "portuguese.syntax.regency.nominal",
            "sectionId": "ex-comparar"
          }
        ],
        "q.rgr.q08": [
          {
            "missionId": "portuguese.syntax.regency.revisao",
            "sectionId": "recuperacao"
          },
          {
            "missionId": "portuguese.syntax.regency.vinculos",
            "sectionId": "limites"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.rgr",
      "blockId": "portuguese.syntax",
      "prerequisiteId": "portuguese.syntax.regency.nominal",
      "parametersApproved": false
    }
  },
  {
    "id": "portuguese.syntax.regency.boss",
    "topicId": "portuguese.syntax.regency.boss",
    "contentVersion": 1,
    "order": 111,
    "title": "Chefe: justificar regente, sentido e ligação",
    "shortTitle": "RG-CHEFE",
    "kind": "boss",
    "objective": "Identificar regente, sentido e dependente, aplicando só os vínculos ensinados e o padrão editorial explicitamente adotado.",
    "xp": 220,
    "passScore": 75,
    "estimatedMinutes": 30,
    "publication": {
      "status": "draft",
      "releaseId": "syntax-regency-intro-r1",
      "releaseSequence": 14,
      "changeImpact": "new"
    },
    "sourceIds": [
      "rg.rgchefe.senado.rg.assistir",
      "rg.rgchefe.senado.rg.visar",
      "rg.rgchefe.authorial.rgchefe"
    ],
    "sections": [
      {
        "id": "entrada",
        "heading": "1. Desafio do recorte delimitado",
        "body": "Doze itens próprios, seis pares, com ensino/recuperação de RG-01/02/03. Quando o enunciado adota o manual do Senado, aplique sua orientação com as ressalvas, sem transformar preferência em proibição universal.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "roteiro",
        "heading": "2. Procedimento",
        "body": "Identifique verbo ou nome regente, seu sentido, dependente e preposição quando houver. Separe flexão do sujeito e ligação do complemento. Diferencie objeto e circunstância nos usos dados. Regência nominal deste lote é estrutural, sem lista de preposições exclusivas.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "exemplo",
        "heading": "3. Exemplo resolvido: os vínculos não se confundem",
        "body": "A equipe precisa de tempo / A necessidade de tempo aumentou: a primeira liga de tempo ao verbo precisar no sentido de necessitar; a segunda liga de tempo ao nome necessidade e ajusta aumentou ao sujeito singular. A mesma preposição não basta para classificar o vínculo.",
        "type": "worked-example",
        "sourceIds": []
      },
      {
        "id": "retomadas",
        "heading": "4. Consultar o ensino",
        "body": "[RG-01](rg-01-v1.md) · [RG-02](rg-02-v1.md) · [RG-03](rg-03-v1.md) · [RG-R](rg-r-v1.md)",
        "type": "explanation",
        "sourceIds": [],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "RG-01",
                "missionId": "portuguese.syntax.regency.vinculos",
                "sectionId": "entrada",
                "wholeLesson": true
              },
              {
                "text": " · "
              },
              {
                "text": "RG-02",
                "missionId": "portuguese.syntax.regency.sentidos",
                "sectionId": "entrada",
                "wholeLesson": true
              },
              {
                "text": " · "
              },
              {
                "text": "RG-03",
                "missionId": "portuguese.syntax.regency.nominal",
                "sectionId": "entrada",
                "wholeLesson": true
              },
              {
                "text": " · "
              },
              {
                "text": "RG-R",
                "missionId": "portuguese.syntax.regency.revisao",
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
        "body": "Regência: relação de dependência entre termos. Regente é o termo do qual outro depende; regido é o dependente. Regência verbal liga verbo e complemento no uso dado; nominal relaciona um nome e o grupo que dele depende. Preposição liga termos; artigo acompanha substantivo. Infinitivo é a forma verbal como melhorar/organizar. Preferência editorial é escolha indicada por um manual para seu padrão, não proibição universal de outras variantes.",
        "type": "glossary",
        "sourceIds": []
      },
      {
        "id": "recuperacao",
        "heading": "Refazer pelo termo e pelo sentido",
        "body": "Localize o termo regente e seu sentido no contexto; identifique o dependente e a ligação. Se o item adota orientação de manual, releia também o alcance e as ressalvas. Separe concordância, regência e artigo. Não trocar preposição mecanicamente nem generalizar uma frase para todos os usos.",
        "type": "summary",
        "sourceIds": []
      }
    ],
    "recall": [
      "Qual termo rege a ligação neste uso?",
      "O sentido e a orientação de referência foram explicitados?",
      "Qual ressalva impede uma regra universal?"
    ],
    "questions": [
      {
        "id": "q.rgchefe.q01",
        "topicId": "portuguese.syntax.regency.boss",
        "prompt": "Em Os alunos precisam de orientação, que termo controla a flexão precisam?",
        "options": [
          "Orientação, por vir depois.",
          "O sujeito de núcleo alunos, plural.",
          "De, por ser a preposição.",
          "Qualquer termo do complemento."
        ],
        "answer": 1,
        "explanation": "A forma verbal ajusta-se ao sujeito plural; a regência é outra relação.",
        "optionRationales": [
          "Orientação integra o complemento.",
          "A forma verbal ajusta-se ao sujeito plural; a regência é outra relação.",
          "De não é sujeito.",
          "O complemento não controla essa flexão no caso."
        ]
      },
      {
        "id": "q.rgchefe.q02",
        "topicId": "portuguese.syntax.regency.boss",
        "prompt": "Passando A aluna precisa de material para As alunas precisam de material, qual vínculo foi preservado no mesmo uso?",
        "options": [
          "Ausência de preposição no complemento.",
          "A forma verbal singular precisa.",
          "Material como sujeito do verbo.",
          "A ligação do complemento por de."
        ],
        "answer": 3,
        "explanation": "O plural muda a flexão, mas mantém de no uso de necessitar.",
        "optionRationales": [
          "De está presente.",
          "A forma verbal mudou para precisam.",
          "Alunas continua sujeito.",
          "O plural muda a flexão, mas mantém de no uso de necessitar."
        ]
      },
      {
        "id": "q.rgchefe.q03",
        "topicId": "portuguese.syntax.regency.boss",
        "prompt": "Em O grupo preparou a proposta ontem, qual termo completa preparou no uso ensinado?",
        "options": [
          "A proposta, sem preposição.",
          "Ontem, como objeto direto.",
          "O grupo, como objeto indireto.",
          "Um complemento inexistente obrigatório com por."
        ],
        "answer": 0,
        "explanation": "A proposta é o complemento direto no uso dado.",
        "optionRationales": [
          "A proposta é o complemento direto no uso dado.",
          "Ontem é circunstância de tempo.",
          "O grupo é sujeito.",
          "Não há essa exigência na frase."
        ]
      },
      {
        "id": "q.rgchefe.q04",
        "topicId": "portuguese.syntax.regency.boss",
        "prompt": "Qual afirmação evita usar só posição como regra em A equipe leu o aviso ontem?",
        "options": [
          "Ontem controla a terceira pessoa leu.",
          "Tudo depois de leu tem a mesma função.",
          "O aviso é complemento no uso dado; ontem tem função temporal.",
          "O aviso é preposição."
        ],
        "answer": 2,
        "explanation": "O uso verbal e o sentido distinguem complemento/circunstância.",
        "optionRationales": [
          "O sujeito controla a flexão.",
          "A posição não determina função única.",
          "O uso verbal e o sentido distinguem complemento/circunstância.",
          "O aviso é grupo nominal."
        ]
      },
      {
        "id": "q.rgchefe.q05",
        "topicId": "portuguese.syntax.regency.boss",
        "prompt": "Segundo o manual adotado, com sentido explícito de presenciar, qual frase segue a ligação ensinada?",
        "options": [
          "O grupo assistiu por uma palestra.",
          "O grupo assistiu de uma palestra.",
          "O grupo assistiu a uma palestra.",
          "O grupo assistiu com uma palestra, no mesmo vínculo de presenciar ensinado."
        ],
        "answer": 2,
        "explanation": "A introduz o complemento no padrão delimitado.",
        "optionRationales": [
          "Por não é a ligação ensinada.",
          "De não é a ligação ensinada.",
          "A introduz o complemento no padrão delimitado.",
          "Com não segue o vínculo do caso."
        ]
      },
      {
        "id": "q.rgchefe.q06",
        "topicId": "portuguese.syntax.regency.boss",
        "prompt": "O monitor assistiu o grupo, e o enunciado explica ajuda na organização. Pelo manual estudado, como analisar o grupo?",
        "options": [
          "Complemento direto, com o como artigo.",
          "Sujeito que controla o verbo.",
          "Complemento introduzido pela preposição o.",
          "Uma data de organização."
        ],
        "answer": 0,
        "explanation": "No sentido informado de ajudar, a orientação é direta.",
        "optionRationales": [
          "No sentido informado de ajudar, a orientação é direta.",
          "Monitor é sujeito no caso.",
          "O é artigo, não preposição.",
          "O grupo não nomeia data."
        ]
      },
      {
        "id": "q.rgchefe.q07",
        "topicId": "portuguese.syntax.regency.boss",
        "prompt": "Para objetivo com nome, qual opção segue a preferência editorial do Senado ensinada?",
        "options": [
          "O programa visa por resultados.",
          "O programa visa de resultados.",
          "O programa visa em resultados.",
          "O programa visa a resultados."
        ],
        "answer": 3,
        "explanation": "A é a preposição preferida no caso com nome e sentido informado.",
        "optionRationales": [
          "Por não segue a preferência.",
          "De não segue a preferência.",
          "Em não segue a preferência.",
          "A é a preposição preferida no caso com nome e sentido informado."
        ]
      },
      {
        "id": "q.rgchefe.q08",
        "topicId": "portuguese.syntax.regency.boss",
        "prompt": "Qual afirmação mantém a ressalva de visar no manual estudado?",
        "options": [
          "A preferência para nome prova que todo visar exige a.",
          "Antes do infinitivo, ele orienta a forma visa organizar, sem a.",
          "O manual proíbe universalmente qualquer variante de outros registros.",
          "O sentido de carimbar exige a segundo o mesmo manual."
        ],
        "answer": 1,
        "explanation": "A orientação específica para infinitivo impede a generalização todo visar exige a.",
        "optionRationales": [
          "Há sentidos/casos com orientação diferente.",
          "A orientação específica para infinitivo impede a generalização todo visar exige a.",
          "O alcance é editorial, não condenação de toda variante.",
          "Carimbar é apresentado como direto."
        ]
      },
      {
        "id": "q.rgchefe.q09",
        "topicId": "portuguese.syntax.regency.boss",
        "prompt": "Em Há necessidade de revisão, qual é o nome regente do grupo de revisão no exemplo?",
        "options": [
          "necessidade",
          "há",
          "de",
          "um verbo oculto obrigatório"
        ],
        "answer": 0,
        "explanation": "O dependente de revisão esclarece o nome necessidade.",
        "optionRationales": [
          "O dependente de revisão esclarece o nome necessidade.",
          "Há é verbo, mas não o nome regente desse grupo.",
          "De liga termos.",
          "Não é necessário inventar esse verbo."
        ]
      },
      {
        "id": "q.rgchefe.q10",
        "topicId": "portuguese.syntax.regency.boss",
        "prompt": "No trecho A leitura do aviso terminou, de quais palavras resulta do?",
        "options": [
          "Dois verbos no passado.",
          "A + a em qualquer frase.",
          "Preposição de + artigo o.",
          "Um sujeito composto."
        ],
        "answer": 2,
        "explanation": "Do é a contração de de com o nesse grupo nominal.",
        "optionRationales": [
          "Não são verbos.",
          "Não corresponde à composição ensinada.",
          "Do é a contração de de com o nesse grupo nominal.",
          "Não cria dois núcleos de sujeito."
        ]
      },
      {
        "id": "q.rgchefe.q11",
        "topicId": "portuguese.syntax.regency.boss",
        "prompt": "Você chamou de tempo de objeto indireto em A necessidade de tempo aumentou somente por haver de. Qual recuperação se aplica?",
        "options": [
          "Tomar toda preposição como prova de objeto verbal.",
          "Localizar o nome necessidade como regente e analisar aumentou separadamente.",
          "Concordar aumentou com tempo sem olhar o sujeito.",
          "Trocar a frase por outra sem justificar o vínculo."
        ],
        "answer": 1,
        "explanation": "No caso, de tempo depende do nome; não se classifica só pela preposição.",
        "optionRationales": [
          "Grupos preposicionados podem depender de nomes.",
          "No caso, de tempo depende do nome; não se classifica só pela preposição.",
          "A flexão liga-se ao sujeito de núcleo necessidade.",
          "Não recupera a análise do caso original."
        ]
      },
      {
        "id": "q.rgchefe.q12",
        "topicId": "portuguese.syntax.regency.boss",
        "prompt": "Qual limite conserva a precisão da aula nominal deste lote?",
        "options": [
          "Regência nominal e concordância verbal são sempre a mesma relação.",
          "Toda regência nominal usa apenas de.",
          "Todo nome com de é verbo.",
          "Os grupos dados mostram dependência nominal, sem provar preposições exclusivas para todo nome/sentido."
        ],
        "answer": 3,
        "explanation": "O ensino estrutural delimitado não constitui lista lexical universal.",
        "optionRationales": [
          "Os vínculos foram distinguidos no ensino.",
          "Não se afirmou essa exclusividade.",
          "Nome não vira verbo por ser acompanhado de de.",
          "O ensino estrutural delimitado não constitui lista lexical universal."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "rgchefe-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.rgchefe.q01": [
          {
            "missionId": "portuguese.syntax.regency.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "portuguese.syntax.regency.vinculos",
            "sectionId": "ex-vinculos"
          }
        ],
        "q.rgchefe.q02": [
          {
            "missionId": "portuguese.syntax.regency.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "portuguese.syntax.regency.vinculos",
            "sectionId": "ex-vinculos"
          }
        ],
        "q.rgchefe.q03": [
          {
            "missionId": "portuguese.syntax.regency.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "portuguese.syntax.regency.vinculos",
            "sectionId": "direto"
          }
        ],
        "q.rgchefe.q04": [
          {
            "missionId": "portuguese.syntax.regency.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "portuguese.syntax.regency.vinculos",
            "sectionId": "direto"
          }
        ],
        "q.rgchefe.q05": [
          {
            "missionId": "portuguese.syntax.regency.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "portuguese.syntax.regency.sentidos",
            "sectionId": "presenciar"
          }
        ],
        "q.rgchefe.q06": [
          {
            "missionId": "portuguese.syntax.regency.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "portuguese.syntax.regency.sentidos",
            "sectionId": "ajudar"
          }
        ],
        "q.rgchefe.q07": [
          {
            "missionId": "portuguese.syntax.regency.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "portuguese.syntax.regency.sentidos",
            "sectionId": "visar"
          }
        ],
        "q.rgchefe.q08": [
          {
            "missionId": "portuguese.syntax.regency.boss",
            "sectionId": "recuperacao"
          },
          {
            "missionId": "portuguese.syntax.regency.sentidos",
            "sectionId": "ex-visar"
          }
        ],
        "q.rgchefe.q09": [
          {
            "missionId": "portuguese.syntax.regency.boss",
            "sectionId": "exemplo"
          },
          {
            "missionId": "portuguese.syntax.regency.nominal",
            "sectionId": "necessidade"
          }
        ],
        "q.rgchefe.q10": [
          {
            "missionId": "portuguese.syntax.regency.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "portuguese.syntax.regency.nominal",
            "sectionId": "leitura"
          }
        ],
        "q.rgchefe.q11": [
          {
            "missionId": "portuguese.syntax.regency.boss",
            "sectionId": "recuperacao"
          },
          {
            "missionId": "portuguese.syntax.regency.nominal",
            "sectionId": "ex-comparar"
          }
        ],
        "q.rgchefe.q12": [
          {
            "missionId": "portuguese.syntax.regency.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "portuguese.syntax.regency.nominal",
            "sectionId": "limites"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.rgchefe",
      "blockId": "portuguese.syntax",
      "prerequisiteId": "portuguese.syntax.regency.revisao",
      "parametersApproved": false
    }
  }
]);
export const RG_SOURCES = Object.freeze([
  {
    "id": "rg.rg01.authorial.rg01",
    "label": "Material autoral da Missão Bancária — RG-01 (rascunho local)",
    "url": "https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado",
    "version": "Texto e exercícios autorais v1",
    "checkedAt": "2026-10-04",
    "locator": "docs/missao-bancaria/rascunhos/rg-01-v1.mjs",
    "provenance": "project-authored",
    "remoteArtifactAvailable": false
  },
  {
    "id": "rg.rg02.senado.rg.assistir",
    "label": "Senado Federal — Manual de Comunicação: assistir",
    "url": "https://www12.senado.leg.br/manualdecomunicacao/estilos/assistir",
    "version": "Orientação editorial nos sentidos presenciar/ajudar; HTML consultado em04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "Abertura: sentido estar presente/presenciar; parágrafo de auxiliar/ajudar: use como transitivo direto"
  },
  {
    "id": "rg.rg02.senado.rg.visar",
    "label": "Senado Federal — Manual de Comunicação: visar",
    "url": "https://www12.senado.leg.br/manualdecomunicacao/estilos/visar",
    "version": "Preferência editorial e ressalva do infinitivo; HTML consultado em04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "Objetivo: preferência por preposição a com nome; antes de infinitivo não usar a; sentido mirar/carimbar direto"
  },
  {
    "id": "rg.rg02.authorial.rg02",
    "label": "Material autoral da Missão Bancária — RG-02 (rascunho local)",
    "url": "https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado",
    "version": "Texto e exercícios autorais v1",
    "checkedAt": "2026-10-04",
    "locator": "docs/missao-bancaria/rascunhos/rg-02-v1.mjs",
    "provenance": "project-authored",
    "remoteArtifactAvailable": false
  },
  {
    "id": "rg.rg03.authorial.rg03",
    "label": "Material autoral da Missão Bancária — RG-03 (rascunho local)",
    "url": "https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado",
    "version": "Texto e exercícios autorais v1",
    "checkedAt": "2026-10-04",
    "locator": "docs/missao-bancaria/rascunhos/rg-03-v1.mjs",
    "provenance": "project-authored",
    "remoteArtifactAvailable": false
  },
  {
    "id": "rg.rgr.senado.rg.assistir",
    "label": "Senado Federal — Manual de Comunicação: assistir",
    "url": "https://www12.senado.leg.br/manualdecomunicacao/estilos/assistir",
    "version": "Orientação editorial nos sentidos presenciar/ajudar; HTML consultado em04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "Abertura: sentido estar presente/presenciar; parágrafo de auxiliar/ajudar: use como transitivo direto"
  },
  {
    "id": "rg.rgr.senado.rg.visar",
    "label": "Senado Federal — Manual de Comunicação: visar",
    "url": "https://www12.senado.leg.br/manualdecomunicacao/estilos/visar",
    "version": "Preferência editorial e ressalva do infinitivo; HTML consultado em04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "Objetivo: preferência por preposição a com nome; antes de infinitivo não usar a; sentido mirar/carimbar direto"
  },
  {
    "id": "rg.rgr.authorial.rgr",
    "label": "Material autoral da Missão Bancária — RG-R (rascunho local)",
    "url": "https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado",
    "version": "Texto e exercícios autorais v1",
    "checkedAt": "2026-10-04",
    "locator": "docs/missao-bancaria/rascunhos/rg-r-v1.mjs",
    "provenance": "project-authored",
    "remoteArtifactAvailable": false
  },
  {
    "id": "rg.rgchefe.senado.rg.assistir",
    "label": "Senado Federal — Manual de Comunicação: assistir",
    "url": "https://www12.senado.leg.br/manualdecomunicacao/estilos/assistir",
    "version": "Orientação editorial nos sentidos presenciar/ajudar; HTML consultado em04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "Abertura: sentido estar presente/presenciar; parágrafo de auxiliar/ajudar: use como transitivo direto"
  },
  {
    "id": "rg.rgchefe.senado.rg.visar",
    "label": "Senado Federal — Manual de Comunicação: visar",
    "url": "https://www12.senado.leg.br/manualdecomunicacao/estilos/visar",
    "version": "Preferência editorial e ressalva do infinitivo; HTML consultado em04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "Objetivo: preferência por preposição a com nome; antes de infinitivo não usar a; sentido mirar/carimbar direto"
  },
  {
    "id": "rg.rgchefe.authorial.rgchefe",
    "label": "Material autoral da Missão Bancária — RG-CHEFE (rascunho local)",
    "url": "https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado",
    "version": "Texto e exercícios autorais v1",
    "checkedAt": "2026-10-04",
    "locator": "docs/missao-bancaria/rascunhos/rg-chefe-v1.mjs",
    "provenance": "project-authored",
    "remoteArtifactAvailable": false
  }
]);
