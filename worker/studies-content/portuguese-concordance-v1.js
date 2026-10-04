// Gerado por node worker/scripts/studies-cn-candidate.mjs --write. Não editar.
// Rascunhos CN locais. Desativado; sem autorização de ativação/publicação.
export const CN_MISSIONS = Object.freeze([
  {
    "id": "portuguese.syntax.concordance.verbal",
    "topicId": "portuguese.syntax.concordance.verbal",
    "contentVersion": 1,
    "order": 102,
    "title": "Concordância verbal: encontrar o núcleo do sujeito",
    "shortTitle": "CN-01",
    "kind": "lesson",
    "objective": "Ajustar formas aos termos relacionados em frases simples, distinguindo núcleo e usos impessoais ensinados.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "syntax-concordance-intro-r1",
      "releaseSequence": 13,
      "changeImpact": "new"
    },
    "sourceIds": [
      "cn.cn01.senado.concordancia",
      "cn.cn01.authorial.cn01"
    ],
    "sections": [
      {
        "id": "entrada",
        "heading": "1. O verbo se relaciona ao sujeito",
        "body": "CF ensinou pessoa/número e núcleo. Em A aluna lê e As alunas leem, lê/leem ajustam-se à terceira pessoa singular/plural do sujeito. Esse ajuste é concordância verbal. Aqui usamos sujeitos simples expressos e ordem normal. Não basta escolher a forma pela última palavra antes do verbo.",
        "type": "explanation",
        "sourceIds": [
          "cn.cn01.senado.concordancia"
        ]
      },
      {
        "id": "nucleo",
        "heading": "2. Núcleo e palavras que o acompanham",
        "body": "Em O roteiro das aulas chegou, o sujeito inteiro é O roteiro das aulas, mas roteiro é seu núcleo singular; chegou concorda com ele. Aulas integra o grupo introduzido por das e não controla o verbo. Compare Os roteiros da aula chegaram: roteiros agora é plural, mesmo que aula seja singular.",
        "type": "explanation",
        "sourceIds": [
          "cn.cn01.senado.concordancia"
        ]
      },
      {
        "id": "pessoa",
        "heading": "3. Pessoa e número expressos",
        "body": "Eu leio é primeira pessoa singular; nós lemos é primeira plural; ela lê é terceira singular; elas leem é terceira plural. O verbo continua relacionado ao sujeito expresso. Não se cobram diferenças regionais com tu/vós, sujeito oculto ou mistura de pessoas em sujeito composto.",
        "type": "explanation",
        "sourceIds": [
          "cn.cn01.senado.concordancia"
        ]
      },
      {
        "id": "ex-nucleo",
        "heading": "4. Exemplo resolvido: singular entre plurais",
        "body": "Em A lista de perguntas chegou, localize chegou. O que chegou? A lista de perguntas. Núcleo lista, terceira pessoa singular; use chegou, não chegaram. Perguntas é plural, mas acompanha lista num grupo preposicionado. O procedimento parte da estrutura, não de contar seres mencionados.",
        "type": "worked-example",
        "sourceIds": [
          "cn.cn01.senado.concordancia"
        ]
      },
      {
        "id": "ex-plural",
        "heading": "5. Exemplo resolvido: núcleo plural",
        "body": "Em Os cadernos da turma ficaram na sala, o sujeito é Os cadernos da turma; núcleo cadernos, terceira pessoa plural. Ficaram concorda com cadernos, não com turma. Na sala é circunstância de lugar.",
        "type": "worked-example",
        "sourceIds": [
          "cn.cn01.senado.concordancia"
        ]
      },
      {
        "id": "ex-pessoa",
        "heading": "6. Exemplo resolvido: sujeito nós",
        "body": "Em Nós revisamos o resumo, nós é sujeito de primeira pessoa plural, revisamos é a forma correspondente no contexto. A troca apenas de nós por eu exige ajuste verbal: Eu reviso o resumo, se o contexto for presente. Concordância não autoriza mudar o tempo pretendido.",
        "type": "worked-example",
        "sourceIds": [
          "cn.cn01.senado.concordancia"
        ]
      },
      {
        "id": "limites",
        "heading": "7. Corrigir sem trocar o vínculo",
        "body": "Marque primeiro sujeito/núcleo e o contexto temporal. O aluno lê / Os alunos leem são formas presentes ensinadas. A lista chegou / As listas chegaram são formas passadas ensinadas. Não tratar palavra próxima como núcleo nem usar concordância como motivo para trocar a informação temporal.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "glossario",
        "heading": "Vocabulário de apoio",
        "body": "Concordância é o ajuste de formas entre termos relacionados. Concordância verbal relaciona verbo e sujeito em pessoa/número nos casos ensinados; nominal relaciona determinantes/adjetivos ao substantivo em gênero/número. Núcleo é a palavra central do grupo. Sujeito composto tem mais de um núcleo. Verbo impessoal, nos usos ensinados, não tem sujeito; não confundir ausência de sujeito com sujeito oculto.",
        "type": "glossary",
        "sourceIds": []
      },
      {
        "id": "recuperacao",
        "heading": "Refazer pelo vínculo",
        "body": "Localize o verbo e o sujeito, quando houver; marque o núcleo e sua pessoa/número. Para formas nominais, identifique o substantivo a que se referem. Não decidir pela palavra mais próxima. Nos usos impessoais, compare haver/existir ou fazer temporal com os exemplos. Retome a aula de origem antes de justificar sua escolha.",
        "type": "summary",
        "sourceIds": []
      }
    ],
    "recall": [
      "Qual termo controla a concordância neste uso?",
      "Qual é sua pessoa/número ou gênero/número?",
      "Há sujeito ou o verbo é impessoal no caso ensinado?"
    ],
    "questions": [
      {
        "id": "q.cn01.q01",
        "topicId": "portuguese.syntax.concordance.verbal",
        "prompt": "Complete no passado: A relação de atividades ___ ontem.",
        "options": [
          "chegaram",
          "chegou",
          "chegamos",
          "chego"
        ],
        "answer": 1,
        "explanation": "Relação é núcleo singular de terceira pessoa; chegou preserva o passado.",
        "optionRationales": [
          "Atividades não é o núcleo do sujeito.",
          "Relação é núcleo singular de terceira pessoa; chegou preserva o passado.",
          "Chegamos corresponderia a nós.",
          "Chego muda pessoa e tempo."
        ]
      },
      {
        "id": "q.cn01.q02",
        "topicId": "portuguese.syntax.concordance.verbal",
        "prompt": "Qual termo controla o verbo em Os roteiros da aula chegaram?",
        "options": [
          "chegaram",
          "aula",
          "da",
          "roteiros"
        ],
        "answer": 3,
        "explanation": "Roteiros é o núcleo plural do sujeito.",
        "optionRationales": [
          "Chegaram é o verbo.",
          "Aula integra o grupo da aula.",
          "Da introduz o grupo, não é núcleo substantivo.",
          "Roteiros é o núcleo plural do sujeito."
        ]
      },
      {
        "id": "q.cn01.q03",
        "topicId": "portuguese.syntax.concordance.verbal",
        "prompt": "Qual frase usa a forma ensinada para nós no presente?",
        "options": [
          "Nós leem o roteiro.",
          "Nós lê o roteiro.",
          "Nós lemos o roteiro.",
          "Nós leio o roteiro."
        ],
        "answer": 2,
        "explanation": "Lemos ajusta-se à primeira pessoa plural.",
        "optionRationales": [
          "Leem é terceira plural.",
          "Lê é terceira singular.",
          "Lemos ajusta-se à primeira pessoa plural.",
          "Leio é primeira singular."
        ]
      },
      {
        "id": "q.cn01.q04",
        "topicId": "portuguese.syntax.concordance.verbal",
        "prompt": "Em A professora dos leitores revisou a nota, por que leitores não exige revisaram?",
        "options": [
          "O núcleo do sujeito é professora, singular.",
          "Toda palavra plural impõe verbo plural.",
          "Leitores é o único sujeito expresso.",
          "O verbo deve concordar com nota."
        ],
        "answer": 0,
        "explanation": "Leitores integra o grupo dos leitores; professora controla o verbo.",
        "optionRationales": [
          "Leitores integra o grupo dos leitores; professora controla o verbo.",
          "A regra não se aplica a todo plural da frase.",
          "O sujeito inteiro tem professora como núcleo.",
          "Nota é complemento do verbo."
        ]
      },
      {
        "id": "q.cn01.q05",
        "topicId": "portuguese.syntax.concordance.verbal",
        "prompt": "Ao passar O caderno da turma ficou aqui para núcleo plural, qual frase conserva o vínculo no passado?",
        "options": [
          "Os cadernos da turma ficamos aqui.",
          "Os cadernos da turma ficou aqui.",
          "Os cadernos da turma ficaram aqui.",
          "Os cadernos da turma fico aqui."
        ],
        "answer": 2,
        "explanation": "Cadernos plural exige ficaram na terceira pessoa plural passada.",
        "optionRationales": [
          "Ficamos é primeira plural.",
          "Ficou permanece singular.",
          "Cadernos plural exige ficaram na terceira pessoa plural passada.",
          "Fico muda pessoa e tempo."
        ]
      },
      {
        "id": "q.cn01.q06",
        "topicId": "portuguese.syntax.concordance.verbal",
        "prompt": "Qual par tem concordância de terceira pessoa no presente, como ensinado?",
        "options": [
          "Ela lê / Elas leem.",
          "Ela leem / Elas lê.",
          "Ela leio / Elas lemos.",
          "Ela lemos / Elas leio."
        ],
        "answer": 0,
        "explanation": "Lê é terceira singular; leem é terceira plural.",
        "optionRationales": [
          "Lê é terceira singular; leem é terceira plural.",
          "As formas estão invertidas.",
          "Leio e lemos são de primeira pessoa.",
          "As formas não correspondem aos sujeitos."
        ]
      },
      {
        "id": "q.cn01.q07",
        "topicId": "portuguese.syntax.concordance.verbal",
        "prompt": "Você escolheu chegaram em A lista de tarefas ___ ontem. Que recuperação corrige a escolha?",
        "options": [
          "Contar todas as palavras e pluralizar o verbo.",
          "Concordar sempre com tarefas por proximidade.",
          "Trocar ontem por amanhã sem revisar o verbo.",
          "Localizar lista como núcleo e usar chegou."
        ],
        "answer": 3,
        "explanation": "O núcleo singular lista controla chegou; a informação passada permanece.",
        "optionRationales": [
          "Concordância não depende da quantidade de palavras.",
          "Proximidade não muda o núcleo.",
          "Isso muda o contexto e não resolve o vínculo.",
          "O núcleo singular lista controla chegou; a informação passada permanece."
        ]
      },
      {
        "id": "q.cn01.q08",
        "topicId": "portuguese.syntax.concordance.verbal",
        "prompt": "Qual alteração exige ajuste de terceira pessoa singular para plural no exemplo?",
        "options": [
          "A aluna lê → A aluna leem.",
          "A aluna lê → As alunas leem.",
          "A aluna lê → A aluna leio.",
          "A aluna lê → A aluna lemos."
        ],
        "answer": 1,
        "explanation": "O sujeito passou de singular para plural, com forma correspondente.",
        "optionRationales": [
          "O sujeito continua singular nessa alternativa.",
          "O sujeito passou de singular para plural, com forma correspondente.",
          "Leio é de primeira singular.",
          "Lemos é de primeira plural."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "cn01-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.cn01.q01": [
          {
            "missionId": "portuguese.syntax.concordance.verbal",
            "sectionId": "nucleo"
          }
        ],
        "q.cn01.q02": [
          {
            "missionId": "portuguese.syntax.concordance.verbal",
            "sectionId": "nucleo"
          }
        ],
        "q.cn01.q03": [
          {
            "missionId": "portuguese.syntax.concordance.verbal",
            "sectionId": "pessoa"
          }
        ],
        "q.cn01.q04": [
          {
            "missionId": "portuguese.syntax.concordance.verbal",
            "sectionId": "ex-nucleo"
          }
        ],
        "q.cn01.q05": [
          {
            "missionId": "portuguese.syntax.concordance.verbal",
            "sectionId": "ex-plural"
          }
        ],
        "q.cn01.q06": [
          {
            "missionId": "portuguese.syntax.concordance.verbal",
            "sectionId": "pessoa"
          }
        ],
        "q.cn01.q07": [
          {
            "missionId": "portuguese.syntax.concordance.verbal",
            "sectionId": "recuperacao"
          }
        ],
        "q.cn01.q08": [
          {
            "missionId": "portuguese.syntax.concordance.verbal",
            "sectionId": "entrada"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.cn01",
      "blockId": "portuguese.syntax",
      "prerequisiteId": "portuguese.syntax.punctuation.boss",
      "parametersApproved": false
    }
  },
  {
    "id": "portuguese.syntax.concordance.nominal",
    "topicId": "portuguese.syntax.concordance.nominal",
    "contentVersion": 1,
    "order": 103,
    "title": "Concordância nominal: ligar formas ao substantivo",
    "shortTitle": "CN-02",
    "kind": "lesson",
    "objective": "Ajustar formas aos termos relacionados em frases simples, distinguindo núcleo e usos impessoais ensinados.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "syntax-concordance-intro-r1",
      "releaseSequence": 13,
      "changeImpact": "new"
    },
    "sourceIds": [
      "cn.cn02.incaper.nominal",
      "cn.cn02.authorial.cn02"
    ],
    "sections": [
      {
        "id": "entrada",
        "heading": "1. Outro vínculo de concordância",
        "body": "Em O caderno novo e Os cadernos novos, artigo/adjetivo acompanham o substantivo em gênero/número. É concordância nominal. Não confundir com a verbal: chegaram ajusta-se ao sujeito; novos relaciona-se a cadernos no grupo nominal.",
        "type": "explanation",
        "sourceIds": [
          "cn.cn02.incaper.nominal"
        ]
      },
      {
        "id": "genero",
        "heading": "2. Gênero gramatical e número",
        "body": "Caderno é substantivo masculino; lista é feminino. Novo/nova/novos/novas exibem formas de gênero/número nesses usos. Gênero gramatical não corresponde necessariamente a sexo: mesa é substantivo feminino. Número distingue singular/plural. Aqui um adjetivo refere-se a um único substantivo.",
        "type": "explanation",
        "sourceIds": [
          "cn.cn02.incaper.nominal"
        ]
      },
      {
        "id": "relacao",
        "heading": "3. Artigos e demonstrativos ensinados",
        "body": "O/os e a/as acompanham caderno/lista. Este/estes e esta/estas também acompanham os substantivos nos exemplos. Não usar proximidade isolada: em As notas do caderno novo, novo caracteriza caderno, singular masculino; notas é plural feminino, mas não é o substantivo caracterizado por novo nesse grupo.",
        "type": "explanation",
        "sourceIds": [
          "cn.cn02.incaper.nominal"
        ]
      },
      {
        "id": "ex-lista",
        "heading": "4. Exemplo resolvido: lista nova",
        "body": "Em Esta lista nova, lista é feminino singular; esta e nova apresentam o mesmo gênero/número. No plural, Estas listas novas. A mudança de número exige ajustar as três formas dadas.",
        "type": "worked-example",
        "sourceIds": [
          "cn.cn02.incaper.nominal"
        ]
      },
      {
        "id": "ex-caderno",
        "heading": "5. Exemplo resolvido: cadernos novos",
        "body": "Em Os cadernos novos chegaram, cadernos é masculino plural. Os e novos acompanham o substantivo; chegaram concorda com o sujeito plural. Há dois vínculos diferentes na mesma frase.",
        "type": "worked-example",
        "sourceIds": [
          "cn.cn02.incaper.nominal"
        ]
      },
      {
        "id": "ex-vinculo",
        "heading": "6. Exemplo resolvido: substantivo dentro do grupo",
        "body": "Em A capa dos cadernos novos rasgou, novos caracteriza cadernos, masculino plural. Capa é núcleo singular feminino do sujeito e controla rasgou. O adjetivo não concorda automaticamente com o núcleo do sujeito: ele concorda com o substantivo a que se refere nesse uso.",
        "type": "worked-example",
        "sourceIds": [
          "cn.cn02.incaper.nominal"
        ]
      },
      {
        "id": "limites",
        "heading": "7. Delimitar a regra",
        "body": "Não se cobram adjetivos ligados a vários substantivos, concordância de predicativos ou usos especiais de bastante/meio/anexo. Identifique o vínculo na frase dada e as formas já ensinadas. Não inventar uma terminação para todo adjetivo: há adjetivos de uma forma de gênero, fora da comparação novo/nova ensinada aqui.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "glossario",
        "heading": "Vocabulário de apoio",
        "body": "Concordância é o ajuste de formas entre termos relacionados. Concordância verbal relaciona verbo e sujeito em pessoa/número nos casos ensinados; nominal relaciona determinantes/adjetivos ao substantivo em gênero/número. Núcleo é a palavra central do grupo. Sujeito composto tem mais de um núcleo. Verbo impessoal, nos usos ensinados, não tem sujeito; não confundir ausência de sujeito com sujeito oculto.",
        "type": "glossary",
        "sourceIds": []
      },
      {
        "id": "recuperacao",
        "heading": "Refazer pelo vínculo",
        "body": "Localize o verbo e o sujeito, quando houver; marque o núcleo e sua pessoa/número. Para formas nominais, identifique o substantivo a que se referem. Não decidir pela palavra mais próxima. Nos usos impessoais, compare haver/existir ou fazer temporal com os exemplos. Retome a aula de origem antes de justificar sua escolha.",
        "type": "summary",
        "sourceIds": []
      }
    ],
    "recall": [
      "Qual termo controla a concordância neste uso?",
      "Qual é sua pessoa/número ou gênero/número?",
      "Há sujeito ou o verbo é impessoal no caso ensinado?"
    ],
    "questions": [
      {
        "id": "q.cn02.q01",
        "topicId": "portuguese.syntax.concordance.nominal",
        "prompt": "Qual grupo tem as formas ensinadas concordando com listas?",
        "options": [
          "Esta listas nova",
          "Este listas novo",
          "Estas listas novas",
          "Estes listas novos"
        ],
        "answer": 2,
        "explanation": "Listas é feminino plural; estas/novas acompanham esse substantivo.",
        "optionRationales": [
          "Esta/nova permanecem singular.",
          "Este/novo são masculino singular.",
          "Listas é feminino plural; estas/novas acompanham esse substantivo.",
          "Estes/novos são masculino plural."
        ]
      },
      {
        "id": "q.cn02.q02",
        "topicId": "portuguese.syntax.concordance.nominal",
        "prompt": "Em Os cadernos novos chegaram, quais palavras acompanham nominalmente cadernos?",
        "options": [
          "Os e novos",
          "Chegaram e os",
          "Chegaram e novos",
          "Apenas chegaram"
        ],
        "answer": 0,
        "explanation": "Artigo e adjetivo acompanham o substantivo em gênero/número.",
        "optionRationales": [
          "Artigo e adjetivo acompanham o substantivo em gênero/número.",
          "Chegaram integra a concordância verbal.",
          "Chegaram é verbo, não determinante/adjetivo.",
          "Chegaram é forma verbal ligada ao sujeito."
        ]
      },
      {
        "id": "q.cn02.q03",
        "topicId": "portuguese.syntax.concordance.nominal",
        "prompt": "Em A capa dos cadernos novos rasgou, por que novos está no masculino plural?",
        "options": [
          "Toda palavra antes de verbo fica plural.",
          "Caracteriza capa, feminino singular.",
          "Concorda com rasgou como sujeito.",
          "Caracteriza cadernos, masculino plural."
        ],
        "answer": 3,
        "explanation": "O adjetivo caracteriza cadernos no grupo dos cadernos novos.",
        "optionRationales": [
          "A posição não cria essa regra.",
          "O vínculo nominal dado não é com capa.",
          "Rasgou é verbo, não substantivo caracterizado.",
          "O adjetivo caracteriza cadernos no grupo dos cadernos novos."
        ]
      },
      {
        "id": "q.cn02.q04",
        "topicId": "portuguese.syntax.concordance.nominal",
        "prompt": "Qual passagem para plural ajusta as formas de Esta lista nova?",
        "options": [
          "Esta listas novas",
          "Estas listas novas",
          "Estas lista nova",
          "Estes listas novos"
        ],
        "answer": 1,
        "explanation": "As três formas passam ao feminino plural.",
        "optionRationales": [
          "Esta permanece singular.",
          "As três formas passam ao feminino plural.",
          "Lista/nova permanecem singular.",
          "Estes/novos mudam para masculino."
        ]
      },
      {
        "id": "q.cn02.q05",
        "topicId": "portuguese.syntax.concordance.nominal",
        "prompt": "Qual afirmação interpreta gênero no exemplo mesa?",
        "options": [
          "Feminino é uma classificação gramatical do substantivo.",
          "Mesa precisa ser uma pessoa de sexo feminino.",
          "Mesa é masculina porque é objeto.",
          "Objetos não têm gênero gramatical."
        ],
        "answer": 0,
        "explanation": "O gênero gramatical se aplica também a substantivos que não nomeiam pessoas.",
        "optionRationales": [
          "O gênero gramatical se aplica também a substantivos que não nomeiam pessoas.",
          "Gênero gramatical não exige pessoa/sexo.",
          "Ser objeto não determina gênero masculino.",
          "Mesa tem gênero gramatical feminino."
        ]
      },
      {
        "id": "q.cn02.q06",
        "topicId": "portuguese.syntax.concordance.nominal",
        "prompt": "Em As notas do caderno novo, qual substantivo novo caracteriza no grupo dado?",
        "options": [
          "as",
          "notas",
          "caderno",
          "do"
        ],
        "answer": 2,
        "explanation": "Novo caracteriza caderno, masculino singular.",
        "optionRationales": [
          "As é artigo, não substantivo caracterizado.",
          "Notas pertence a outro vínculo nesse grupo.",
          "Novo caracteriza caderno, masculino singular.",
          "Do introduz o grupo preposicionado."
        ]
      },
      {
        "id": "q.cn02.q07",
        "topicId": "portuguese.syntax.concordance.nominal",
        "prompt": "Você escreveu Este lista novo. Qual revisão aplica apenas o ajuste nominal ensinado?",
        "options": [
          "Estes lista novos",
          "Esta lista nova",
          "Este listas novo",
          "Nós lemos lista"
        ],
        "answer": 1,
        "explanation": "Lista feminino singular pede esta/nova.",
        "optionRationales": [
          "Estes/novos continuam incompatíveis.",
          "Lista feminino singular pede esta/nova.",
          "As formas não acompanham listas.",
          "Troca o conteúdo sem corrigir o grupo original."
        ]
      },
      {
        "id": "q.cn02.q08",
        "topicId": "portuguese.syntax.concordance.nominal",
        "prompt": "Em A capa dos cadernos novos rasgou, qual comparação distingue os vínculos?",
        "options": [
          "Rasgou é adjetivo masculino plural.",
          "Novos e rasgou concordam ambos com cadernos.",
          "Novos acompanha rasgou; capa acompanha novos.",
          "Novos acompanha cadernos; rasgou acompanha o sujeito de núcleo capa."
        ],
        "answer": 3,
        "explanation": "O adjetivo caracteriza cadernos; o verbo concorda com o sujeito singular capa.",
        "optionRationales": [
          "Rasgou é verbo singular no passado.",
          "Rasgou concorda com capa, não cadernos.",
          "Os vínculos estão trocados.",
          "O adjetivo caracteriza cadernos; o verbo concorda com o sujeito singular capa."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "cn02-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.cn02.q01": [
          {
            "missionId": "portuguese.syntax.concordance.nominal",
            "sectionId": "ex-lista"
          }
        ],
        "q.cn02.q02": [
          {
            "missionId": "portuguese.syntax.concordance.nominal",
            "sectionId": "ex-caderno"
          }
        ],
        "q.cn02.q03": [
          {
            "missionId": "portuguese.syntax.concordance.nominal",
            "sectionId": "ex-vinculo"
          }
        ],
        "q.cn02.q04": [
          {
            "missionId": "portuguese.syntax.concordance.nominal",
            "sectionId": "ex-lista"
          }
        ],
        "q.cn02.q05": [
          {
            "missionId": "portuguese.syntax.concordance.nominal",
            "sectionId": "genero"
          }
        ],
        "q.cn02.q06": [
          {
            "missionId": "portuguese.syntax.concordance.nominal",
            "sectionId": "relacao"
          }
        ],
        "q.cn02.q07": [
          {
            "missionId": "portuguese.syntax.concordance.nominal",
            "sectionId": "recuperacao"
          }
        ],
        "q.cn02.q08": [
          {
            "missionId": "portuguese.syntax.concordance.nominal",
            "sectionId": "ex-vinculo"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.cn02",
      "blockId": "portuguese.syntax",
      "prerequisiteId": "portuguese.syntax.concordance.verbal",
      "parametersApproved": false
    }
  },
  {
    "id": "portuguese.syntax.concordance.impessoais",
    "topicId": "portuguese.syntax.concordance.impessoais",
    "contentVersion": 1,
    "order": 104,
    "title": "Dois núcleos e usos impessoais: comparar estruturas",
    "shortTitle": "CN-03",
    "kind": "lesson",
    "objective": "Ajustar formas aos termos relacionados em frases simples, distinguindo núcleo e usos impessoais ensinados.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "syntax-concordance-intro-r1",
      "releaseSequence": 13,
      "changeImpact": "new"
    },
    "sourceIds": [
      "cn.cn03.senado.concordancia",
      "cn.cn03.authorial.cn03"
    ],
    "sections": [
      {
        "id": "entrada",
        "heading": "1. Sujeito composto antes do verbo",
        "body": "Em O aluno e a aluna chegaram, aluno/aluna são dois núcleos ligados por e e colocados antes do verbo. Nesse caso, chegou vira chegaram, terceira pessoa plural. Aqui ambos são de terceira pessoa; não generalizar para sujeito posposto ou diferentes conectivos e pessoas.",
        "type": "explanation",
        "sourceIds": [
          "cn.cn03.senado.concordancia"
        ]
      },
      {
        "id": "haver",
        "heading": "2. Haver indicando existência",
        "body": "Em Há livros na mesa, haver significa existir e é impessoal: não tem sujeito nesse uso. Livros não é sujeito de haver; o verbo fica na terceira pessoa singular. No passado: Havia livros na mesa. Não ensinar que todo haver é impessoal: outros usos ficam fora.",
        "type": "explanation",
        "sourceIds": [
          "cn.cn03.senado.concordancia"
        ]
      },
      {
        "id": "existir",
        "heading": "3. Existir tem sujeito no exemplo",
        "body": "Compare Existem livros na mesa e Existe um livro na mesa. Existir não é impessoal nesses casos: livros/um livro são sujeitos e o verbo concorda com eles. O significado próximo de há não autoriza copiar a regra de haver para existir.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "fazer",
        "heading": "4. Fazer indicando tempo decorrido",
        "body": "Em Faz dois anos que o grupo se reúne, fazer indica tempo decorrido e é impessoal, singular, mesmo com dois anos. No passado: Fazia dois anos que o grupo se reunia. Compare As equipes fazem resumos: fazer tem sujeito plural nesse outro uso e pode variar. Aqui não se cobram locuções com haver/fazer nem expressões de clima.",
        "type": "explanation",
        "sourceIds": [
          "cn.cn03.senado.concordancia"
        ]
      },
      {
        "id": "ex-composto",
        "heading": "5. Exemplo resolvido: dois núcleos anteriores",
        "body": "Em A professora e o aluno revisaram o texto, os dois núcleos antecedem o verbo e são de terceira pessoa; use revisaram no plural. Texto é complemento e não controla essa forma.",
        "type": "worked-example",
        "sourceIds": [
          "cn.cn03.senado.concordancia"
        ]
      },
      {
        "id": "ex-existencia",
        "heading": "6. Exemplo resolvido: mesma situação, estruturas diferentes",
        "body": "Sobre livros na sala: Há livros na sala / Existem livros na sala. Haver existencial permanece singular e sem sujeito; existir concorda com livros, sujeito plural. A interpretação de existência é próxima, mas as estruturas gramaticais não são idênticas.",
        "type": "worked-example",
        "sourceIds": [
          "cn.cn03.senado.concordancia"
        ]
      },
      {
        "id": "ex-tempo",
        "heading": "7. Exemplo resolvido: duração não é sujeito",
        "body": "Em Faz três meses que a turma começou, faz indica tempo decorrido e permanece singular. Compare Os alunos fazem exercícios: alunos é sujeito plural do fazer não temporal. Não pluralizar faz apenas por meses nem singularizar fazem apenas porque o infinitivo é o mesmo.",
        "type": "worked-example",
        "sourceIds": [
          "cn.cn03.senado.concordancia"
        ]
      },
      {
        "id": "glossario",
        "heading": "Vocabulário de apoio",
        "body": "Concordância é o ajuste de formas entre termos relacionados. Concordância verbal relaciona verbo e sujeito em pessoa/número nos casos ensinados; nominal relaciona determinantes/adjetivos ao substantivo em gênero/número. Núcleo é a palavra central do grupo. Sujeito composto tem mais de um núcleo. Verbo impessoal, nos usos ensinados, não tem sujeito; não confundir ausência de sujeito com sujeito oculto.",
        "type": "glossary",
        "sourceIds": []
      },
      {
        "id": "recuperacao",
        "heading": "Refazer pelo vínculo",
        "body": "Localize o verbo e o sujeito, quando houver; marque o núcleo e sua pessoa/número. Para formas nominais, identifique o substantivo a que se referem. Não decidir pela palavra mais próxima. Nos usos impessoais, compare haver/existir ou fazer temporal com os exemplos. Retome a aula de origem antes de justificar sua escolha.",
        "type": "summary",
        "sourceIds": []
      }
    ],
    "recall": [
      "Qual termo controla a concordância neste uso?",
      "Qual é sua pessoa/número ou gênero/número?",
      "Há sujeito ou o verbo é impessoal no caso ensinado?"
    ],
    "questions": [
      {
        "id": "q.cn03.q01",
        "topicId": "portuguese.syntax.concordance.impessoais",
        "prompt": "No caso ensinado, complete: A professora e o aluno ___ o roteiro ontem.",
        "options": [
          "revisaram",
          "revisou",
          "revisamos",
          "reviso"
        ],
        "answer": 0,
        "explanation": "Dois núcleos de terceira pessoa anteriores ao verbo pedem plural no passado.",
        "optionRationales": [
          "Dois núcleos de terceira pessoa anteriores ao verbo pedem plural no passado.",
          "Revisou é singular.",
          "Revisamos seria primeira plural.",
          "Reviso muda pessoa/tempo."
        ]
      },
      {
        "id": "q.cn03.q02",
        "topicId": "portuguese.syntax.concordance.impessoais",
        "prompt": "Qual frase aplica haver com sentido existencial no presente?",
        "options": [
          "Havemos cadernos na sala.",
          "Hão cadernos na sala.",
          "Há cadernos na sala.",
          "Hás cadernos na sala."
        ],
        "answer": 2,
        "explanation": "Haver existencial é impessoal e fica singular.",
        "optionRationales": [
          "Havemos não é a forma impessoal ensinada.",
          "Não se pluraliza por cadernos nesse uso.",
          "Haver existencial é impessoal e fica singular.",
          "Hás corresponde a segunda pessoa, não ao uso ensinado."
        ]
      },
      {
        "id": "q.cn03.q03",
        "topicId": "portuguese.syntax.concordance.impessoais",
        "prompt": "Qual comparação está de acordo com os usos ensinados?",
        "options": [
          "Hão notas / Existe notas.",
          "Há notas / Existem notas.",
          "Há notas / Existe notas.",
          "Hão notas / Existem notas."
        ],
        "answer": 1,
        "explanation": "Haver é impessoal; existir tem notas como sujeito plural.",
        "optionRationales": [
          "As duas formas estão inadequadas aos usos.",
          "Haver é impessoal; existir tem notas como sujeito plural.",
          "Existir deve ajustar-se ao sujeito plural.",
          "Haver existencial não se pluraliza."
        ]
      },
      {
        "id": "q.cn03.q04",
        "topicId": "portuguese.syntax.concordance.impessoais",
        "prompt": "Complete o caso de tempo decorrido: ___ três meses que a aula começou.",
        "options": [
          "Faço",
          "Fazem",
          "Fazemos",
          "Faz"
        ],
        "answer": 3,
        "explanation": "Fazer temporal é impessoal e permanece singular.",
        "optionRationales": [
          "Faço é primeira pessoa, incompatível com o uso.",
          "Três meses não exige plural no uso impessoal.",
          "Não há nós como sujeito nesse caso.",
          "Fazer temporal é impessoal e permanece singular."
        ]
      },
      {
        "id": "q.cn03.q05",
        "topicId": "portuguese.syntax.concordance.impessoais",
        "prompt": "Em Existem livros na mesa, qual é o sujeito no caso ensinado?",
        "options": [
          "existem",
          "na mesa",
          "livros",
          "Não há sujeito porque significa haver."
        ],
        "answer": 2,
        "explanation": "Livros é sujeito plural de existir.",
        "optionRationales": [
          "Existem é o verbo.",
          "Na mesa é circunstância de lugar.",
          "Livros é sujeito plural de existir.",
          "Significado próximo não torna as estruturas iguais."
        ]
      },
      {
        "id": "q.cn03.q06",
        "topicId": "portuguese.syntax.concordance.impessoais",
        "prompt": "Qual frase mostra fazer com sujeito plural, fora do uso temporal?",
        "options": [
          "As equipes fazem resumos.",
          "Faz três meses que começaram.",
          "Fazia dois anos que estudavam.",
          "Há livros na mesa."
        ],
        "answer": 0,
        "explanation": "Equipes é sujeito plural de fazem nesse uso não temporal.",
        "optionRationales": [
          "Equipes é sujeito plural de fazem nesse uso não temporal.",
          "Faz indica tempo decorrido, impessoal.",
          "Fazia indica tempo decorrido, impessoal.",
          "Há é haver existencial, outro verbo."
        ]
      },
      {
        "id": "q.cn03.q07",
        "topicId": "portuguese.syntax.concordance.impessoais",
        "prompt": "Você escreveu Haviam cadernos na sala para indicar existência. Qual correção mantém o passado e o uso de haver?",
        "options": [
          "Existem cadernos na sala.",
          "Havemos cadernos na sala.",
          "Há cadernos na sala.",
          "Havia cadernos na sala."
        ],
        "answer": 3,
        "explanation": "Havia é terceira pessoa singular passada do uso impessoal.",
        "optionRationales": [
          "Existem muda verbo e tempo, não é a correção solicitada.",
          "Havemos não mantém o uso impessoal/passado.",
          "Há muda para presente.",
          "Havia é terceira pessoa singular passada do uso impessoal."
        ]
      },
      {
        "id": "q.cn03.q08",
        "topicId": "portuguese.syntax.concordance.impessoais",
        "prompt": "Por que não basta tratar todo uso de fazer como impessoal?",
        "options": [
          "Fazer nunca tem sujeito.",
          "Em As equipes fazem resumos, fazer tem sujeito plural.",
          "Meses sempre controla fazer.",
          "A palavra anterior ao verbo sempre é sujeito."
        ],
        "answer": 1,
        "explanation": "O uso não temporal dado tem sujeito equipes e forma plural.",
        "optionRationales": [
          "É uma generalização que o exemplo refuta.",
          "O uso não temporal dado tem sujeito equipes e forma plural.",
          "No uso temporal ensinado, meses não é sujeito.",
          "A função depende da estrutura, não só da posição."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "cn03-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.cn03.q01": [
          {
            "missionId": "portuguese.syntax.concordance.impessoais",
            "sectionId": "ex-composto"
          }
        ],
        "q.cn03.q02": [
          {
            "missionId": "portuguese.syntax.concordance.impessoais",
            "sectionId": "haver"
          }
        ],
        "q.cn03.q03": [
          {
            "missionId": "portuguese.syntax.concordance.impessoais",
            "sectionId": "ex-existencia"
          }
        ],
        "q.cn03.q04": [
          {
            "missionId": "portuguese.syntax.concordance.impessoais",
            "sectionId": "fazer"
          }
        ],
        "q.cn03.q05": [
          {
            "missionId": "portuguese.syntax.concordance.impessoais",
            "sectionId": "existir"
          }
        ],
        "q.cn03.q06": [
          {
            "missionId": "portuguese.syntax.concordance.impessoais",
            "sectionId": "ex-tempo"
          }
        ],
        "q.cn03.q07": [
          {
            "missionId": "portuguese.syntax.concordance.impessoais",
            "sectionId": "recuperacao"
          }
        ],
        "q.cn03.q08": [
          {
            "missionId": "portuguese.syntax.concordance.impessoais",
            "sectionId": "fazer"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.cn03",
      "blockId": "portuguese.syntax",
      "prerequisiteId": "portuguese.syntax.concordance.nominal",
      "parametersApproved": false
    }
  },
  {
    "id": "portuguese.syntax.concordance.revisao",
    "topicId": "portuguese.syntax.concordance.revisao",
    "contentVersion": 1,
    "order": 105,
    "title": "Revisão: conferir o vínculo antes de flexionar",
    "shortTitle": "CN-R",
    "kind": "lesson",
    "objective": "Ajustar formas aos termos relacionados em frases simples, distinguindo núcleo e usos impessoais ensinados.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "syntax-concordance-intro-r1",
      "releaseSequence": 13,
      "changeImpact": "new"
    },
    "sourceIds": [
      "cn.cnr.senado.concordancia",
      "cn.cnr.incaper.nominal",
      "cn.cnr.authorial.cnr"
    ],
    "sections": [
      {
        "id": "entrada",
        "heading": "1. Recuperar os três procedimentos",
        "body": "Concordância verbal: sujeito/núcleo/pessoa/número. Nominal: substantivo caracterizado/gênero/número. Casos especiais ensinados: dois núcleos anteriores ligados por e e usos impessoais delimitados. Questões próprias retomam as aulas, sem avaliação independente ou prova de retenção.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "ex-verbal",
        "heading": "2. Exemplo resolvido: núcleo singular",
        "body": "A sequência de exercícios ficou pronta: sequência é o núcleo singular; exercícios não controla ficou. O adjetivo pronta caracteriza sequência, feminino singular. São vínculos identificados, não atração pela proximidade.",
        "type": "worked-example",
        "sourceIds": [
          "cn.cnr.senado.concordancia"
        ]
      },
      {
        "id": "ex-nominal",
        "heading": "3. Exemplo resolvido: vínculo dentro do sujeito",
        "body": "As páginas do caderno novo rasgaram: páginas é núcleo plural do sujeito e controla rasgaram; novo caracteriza caderno. O adjetivo e o verbo não precisam acompanhar o mesmo substantivo.",
        "type": "worked-example",
        "sourceIds": [
          "cn.cnr.incaper.nominal"
        ]
      },
      {
        "id": "ex-especial",
        "heading": "4. Exemplo resolvido: haver e existir",
        "body": "Havia fichas na mesa e Existiam fichas na mesa exprimem existência passada; havia é singular impessoal, existiam concorda com fichas plural. Não mudar o tempo ao corrigir o vínculo.",
        "type": "worked-example",
        "sourceIds": [
          "cn.cnr.senado.concordancia"
        ]
      },
      {
        "id": "retomadas",
        "heading": "Retomar as aulas de origem",
        "body": "[CN-01](cn-01-v1.md) · [CN-02](cn-02-v1.md) · [CN-03](cn-03-v1.md)",
        "type": "explanation",
        "sourceIds": [],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "CN-01",
                "missionId": "portuguese.syntax.concordance.verbal",
                "sectionId": "entrada",
                "wholeLesson": true
              },
              {
                "text": " · "
              },
              {
                "text": "CN-02",
                "missionId": "portuguese.syntax.concordance.nominal",
                "sectionId": "entrada",
                "wholeLesson": true
              },
              {
                "text": " · "
              },
              {
                "text": "CN-03",
                "missionId": "portuguese.syntax.concordance.impessoais",
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
        "body": "Concordância é o ajuste de formas entre termos relacionados. Concordância verbal relaciona verbo e sujeito em pessoa/número nos casos ensinados; nominal relaciona determinantes/adjetivos ao substantivo em gênero/número. Núcleo é a palavra central do grupo. Sujeito composto tem mais de um núcleo. Verbo impessoal, nos usos ensinados, não tem sujeito; não confundir ausência de sujeito com sujeito oculto.",
        "type": "glossary",
        "sourceIds": []
      },
      {
        "id": "recuperacao",
        "heading": "Refazer pelo vínculo",
        "body": "Localize o verbo e o sujeito, quando houver; marque o núcleo e sua pessoa/número. Para formas nominais, identifique o substantivo a que se referem. Não decidir pela palavra mais próxima. Nos usos impessoais, compare haver/existir ou fazer temporal com os exemplos. Retome a aula de origem antes de justificar sua escolha.",
        "type": "summary",
        "sourceIds": []
      }
    ],
    "recall": [
      "Qual termo controla a concordância neste uso?",
      "Qual é sua pessoa/número ou gênero/número?",
      "Há sujeito ou o verbo é impessoal no caso ensinado?"
    ],
    "questions": [
      {
        "id": "q.cnr.q01",
        "topicId": "portuguese.syntax.concordance.revisao",
        "prompt": "No passado, complete A sequência de tarefas ___ pronta.",
        "options": [
          "fico",
          "ficaram",
          "ficamos",
          "ficou"
        ],
        "answer": 3,
        "explanation": "Sequência é o núcleo singular do sujeito.",
        "optionRationales": [
          "Fico muda pessoa/tempo.",
          "Tarefas não controla o verbo.",
          "Ficamos corresponde a nós.",
          "Sequência é o núcleo singular do sujeito."
        ]
      },
      {
        "id": "q.cnr.q02",
        "topicId": "portuguese.syntax.concordance.revisao",
        "prompt": "Qual forma presente acompanha elas no exemplo de leitura?",
        "options": [
          "Elas lê a pauta.",
          "Elas leem a pauta.",
          "Elas leio a pauta.",
          "Elas lemos a pauta."
        ],
        "answer": 1,
        "explanation": "Leem é terceira pessoa plural.",
        "optionRationales": [
          "Lê é singular.",
          "Leem é terceira pessoa plural.",
          "Leio é primeira singular.",
          "Lemos é primeira plural."
        ]
      },
      {
        "id": "q.cnr.q03",
        "topicId": "portuguese.syntax.concordance.revisao",
        "prompt": "Em As páginas do caderno novo rasgaram, novo caracteriza qual termo?",
        "options": [
          "caderno",
          "páginas",
          "rasgaram",
          "as"
        ],
        "answer": 0,
        "explanation": "Novo caracteriza caderno no grupo dado.",
        "optionRationales": [
          "Novo caracteriza caderno no grupo dado.",
          "Páginas é outro substantivo do sujeito.",
          "Rasgaram é verbo.",
          "As é artigo."
        ]
      },
      {
        "id": "q.cnr.q04",
        "topicId": "portuguese.syntax.concordance.revisao",
        "prompt": "Qual grupo ajusta artigo e adjetivo a cadernos no plural?",
        "options": [
          "As cadernos novas",
          "O cadernos novo",
          "Os cadernos novos",
          "Os caderno novos"
        ],
        "answer": 2,
        "explanation": "Cadernos é masculino plural.",
        "optionRationales": [
          "As/novas são feminino.",
          "O/novo são singular.",
          "Cadernos é masculino plural.",
          "Caderno permaneceu singular."
        ]
      },
      {
        "id": "q.cnr.q05",
        "topicId": "portuguese.syntax.concordance.revisao",
        "prompt": "Qual forma completa no passado Havia fichas / ___ fichas?",
        "options": [
          "Existia",
          "Existiam",
          "Existimos",
          "Existe"
        ],
        "answer": 1,
        "explanation": "Existir tem fichas como sujeito plural e deve preservar o passado.",
        "optionRationales": [
          "Existia é singular.",
          "Existir tem fichas como sujeito plural e deve preservar o passado.",
          "Existimos muda pessoa.",
          "Existe muda número e tempo."
        ]
      },
      {
        "id": "q.cnr.q06",
        "topicId": "portuguese.syntax.concordance.revisao",
        "prompt": "Complete tempo decorrido: ___ quatro meses que o estudo começou.",
        "options": [
          "Faço",
          "Fazem",
          "Fazemos",
          "Faz"
        ],
        "answer": 3,
        "explanation": "Fazer temporal é impessoal singular.",
        "optionRationales": [
          "Não há sujeito eu.",
          "Meses não exige plural nesse uso.",
          "Não há sujeito nós.",
          "Fazer temporal é impessoal singular."
        ]
      },
      {
        "id": "q.cnr.q07",
        "topicId": "portuguese.syntax.concordance.revisao",
        "prompt": "Você pluralizou chegou por causa de exercícios em O roteiro de exercícios chegou. Que retomada é pertinente?",
        "options": [
          "Trocar roteiro por eu sem ajustar verbo.",
          "Usar sempre a palavra plural mais próxima.",
          "Voltar ao núcleo do sujeito e identificar roteiro singular.",
          "Retirar de para supor dois núcleos."
        ],
        "answer": 2,
        "explanation": "Roteiro singular controla chegou; a recuperação verifica a estrutura original.",
        "optionRationales": [
          "Não corrige o vínculo original.",
          "Proximidade não é o critério.",
          "Roteiro singular controla chegou; a recuperação verifica a estrutura original.",
          "Altera a estrutura em vez de analisá-la."
        ]
      },
      {
        "id": "q.cnr.q08",
        "topicId": "portuguese.syntax.concordance.revisao",
        "prompt": "Por que nova é adequada em Esta lista nova?",
        "options": [
          "Caracteriza lista, feminino singular.",
          "Caracteriza esta como verbo.",
          "Concorda com todo plural da frase.",
          "Todo adjetivo termina em a."
        ],
        "answer": 0,
        "explanation": "O vínculo e as características de lista explicam a forma no exemplo.",
        "optionRationales": [
          "O vínculo e as características de lista explicam a forma no exemplo.",
          "Esta não é verbo.",
          "Não há essa regra geral.",
          "Há outras formas; não generalizar a terminação."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "cnr-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.cnr.q01": [
          {
            "missionId": "portuguese.syntax.concordance.revisao",
            "sectionId": "ex-verbal"
          },
          {
            "missionId": "portuguese.syntax.concordance.verbal",
            "sectionId": "nucleo"
          }
        ],
        "q.cnr.q02": [
          {
            "missionId": "portuguese.syntax.concordance.revisao",
            "sectionId": "ex-verbal"
          },
          {
            "missionId": "portuguese.syntax.concordance.verbal",
            "sectionId": "pessoa"
          }
        ],
        "q.cnr.q03": [
          {
            "missionId": "portuguese.syntax.concordance.revisao",
            "sectionId": "ex-nominal"
          },
          {
            "missionId": "portuguese.syntax.concordance.nominal",
            "sectionId": "relacao"
          }
        ],
        "q.cnr.q04": [
          {
            "missionId": "portuguese.syntax.concordance.revisao",
            "sectionId": "ex-nominal"
          },
          {
            "missionId": "portuguese.syntax.concordance.nominal",
            "sectionId": "ex-caderno"
          }
        ],
        "q.cnr.q05": [
          {
            "missionId": "portuguese.syntax.concordance.revisao",
            "sectionId": "ex-especial"
          },
          {
            "missionId": "portuguese.syntax.concordance.impessoais",
            "sectionId": "ex-existencia"
          }
        ],
        "q.cnr.q06": [
          {
            "missionId": "portuguese.syntax.concordance.revisao",
            "sectionId": "ex-especial"
          },
          {
            "missionId": "portuguese.syntax.concordance.impessoais",
            "sectionId": "fazer"
          }
        ],
        "q.cnr.q07": [
          {
            "missionId": "portuguese.syntax.concordance.revisao",
            "sectionId": "recuperacao"
          },
          {
            "missionId": "portuguese.syntax.concordance.verbal",
            "sectionId": "ex-nucleo"
          }
        ],
        "q.cnr.q08": [
          {
            "missionId": "portuguese.syntax.concordance.revisao",
            "sectionId": "recuperacao"
          },
          {
            "missionId": "portuguese.syntax.concordance.nominal",
            "sectionId": "ex-lista"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.cnr",
      "blockId": "portuguese.syntax",
      "prerequisiteId": "portuguese.syntax.concordance.impessoais",
      "parametersApproved": false
    }
  },
  {
    "id": "portuguese.syntax.concordance.boss",
    "topicId": "portuguese.syntax.concordance.boss",
    "contentVersion": 1,
    "order": 106,
    "title": "Chefe: justificar concordância pelo termo controlador",
    "shortTitle": "CN-CHEFE",
    "kind": "boss",
    "objective": "Ajustar formas aos termos relacionados em frases simples, distinguindo núcleo e usos impessoais ensinados.",
    "xp": 220,
    "passScore": 75,
    "estimatedMinutes": 30,
    "publication": {
      "status": "draft",
      "releaseId": "syntax-concordance-intro-r1",
      "releaseSequence": 13,
      "changeImpact": "new"
    },
    "sourceIds": [
      "cn.cnchefe.senado.concordancia",
      "cn.cnchefe.incaper.nominal",
      "cn.cnchefe.authorial.cnchefe"
    ],
    "sections": [
      {
        "id": "entrada",
        "heading": "1. Desafio do recorte ensinado",
        "body": "Doze itens próprios combinam vínculos verbais/nominais e casos delimitados. Cada par tem origem em CN-01/02/03; o Chefe não mede prontidão do edital nem substitui avaliação independente.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "vinculos",
        "heading": "2. Roteiro de resolução",
        "body": "Identifique primeiro o verbo e o sujeito, quando houver. Depois veja quais determinantes/adjetivos acompanham qual substantivo. Nos dois núcleos anteriores ligados por e, use plural no recorte; em haver existencial/fazer temporal, reconheça uso impessoal. Não decidir apenas por palavra próxima.",
        "type": "explanation",
        "sourceIds": [
          "cn.cnchefe.senado.concordancia",
          "cn.cnchefe.incaper.nominal"
        ]
      },
      {
        "id": "exemplo",
        "heading": "3. Exemplo resolvido: estrutura preservada",
        "body": "O resumo das aulas ficou pronto: resumo controla ficou e é caracterizado por pronto. As aulas não controlam essas formas. Compare Os resumos da aula ficaram prontos: agora resumos é plural e ambos os vínculos se ajustam. A mudança foi do núcleo, sem alterar o contexto passado.",
        "type": "worked-example",
        "sourceIds": [
          "cn.cnchefe.senado.concordancia",
          "cn.cnchefe.incaper.nominal"
        ]
      },
      {
        "id": "retomadas",
        "heading": "4. Consultar o ensino",
        "body": "[CN-01](cn-01-v1.md) · [CN-02](cn-02-v1.md) · [CN-03](cn-03-v1.md) · [CN-R](cn-r-v1.md)",
        "type": "explanation",
        "sourceIds": [],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "CN-01",
                "missionId": "portuguese.syntax.concordance.verbal",
                "sectionId": "entrada",
                "wholeLesson": true
              },
              {
                "text": " · "
              },
              {
                "text": "CN-02",
                "missionId": "portuguese.syntax.concordance.nominal",
                "sectionId": "entrada",
                "wholeLesson": true
              },
              {
                "text": " · "
              },
              {
                "text": "CN-03",
                "missionId": "portuguese.syntax.concordance.impessoais",
                "sectionId": "entrada",
                "wholeLesson": true
              },
              {
                "text": " · "
              },
              {
                "text": "CN-R",
                "missionId": "portuguese.syntax.concordance.revisao",
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
        "body": "Concordância é o ajuste de formas entre termos relacionados. Concordância verbal relaciona verbo e sujeito em pessoa/número nos casos ensinados; nominal relaciona determinantes/adjetivos ao substantivo em gênero/número. Núcleo é a palavra central do grupo. Sujeito composto tem mais de um núcleo. Verbo impessoal, nos usos ensinados, não tem sujeito; não confundir ausência de sujeito com sujeito oculto.",
        "type": "glossary",
        "sourceIds": []
      },
      {
        "id": "recuperacao",
        "heading": "Refazer pelo vínculo",
        "body": "Localize o verbo e o sujeito, quando houver; marque o núcleo e sua pessoa/número. Para formas nominais, identifique o substantivo a que se referem. Não decidir pela palavra mais próxima. Nos usos impessoais, compare haver/existir ou fazer temporal com os exemplos. Retome a aula de origem antes de justificar sua escolha.",
        "type": "summary",
        "sourceIds": []
      }
    ],
    "recall": [
      "Qual termo controla a concordância neste uso?",
      "Qual é sua pessoa/número ou gênero/número?",
      "Há sujeito ou o verbo é impessoal no caso ensinado?"
    ],
    "questions": [
      {
        "id": "q.cnchefe.q01",
        "topicId": "portuguese.syntax.concordance.boss",
        "prompt": "Complete no passado O resumo das aulas ___ pronto.",
        "options": [
          "ficaram",
          "ficou",
          "ficamos",
          "fico"
        ],
        "answer": 1,
        "explanation": "Resumo é o núcleo singular de terceira pessoa, no contexto passado.",
        "optionRationales": [
          "Aulas não controla o verbo.",
          "Resumo é o núcleo singular de terceira pessoa, no contexto passado.",
          "Ficamos é primeira plural.",
          "Fico muda pessoa/tempo."
        ]
      },
      {
        "id": "q.cnchefe.q02",
        "topicId": "portuguese.syntax.concordance.boss",
        "prompt": "Em As fichas do grupo chegaram, qual termo controla chegaram?",
        "options": [
          "chegaram",
          "grupo",
          "do",
          "fichas"
        ],
        "answer": 3,
        "explanation": "Fichas é o núcleo plural do sujeito.",
        "optionRationales": [
          "Chegaram é verbo.",
          "Grupo integra o grupo do grupo.",
          "Do não é o núcleo substantivo.",
          "Fichas é o núcleo plural do sujeito."
        ]
      },
      {
        "id": "q.cnchefe.q03",
        "topicId": "portuguese.syntax.concordance.boss",
        "prompt": "Qual frase ajusta o verbo ao sujeito eu no presente, conforme as formas ensinadas?",
        "options": [
          "Eu leio a nota.",
          "Eu lemos a nota.",
          "Eu lê a nota.",
          "Eu leem a nota."
        ],
        "answer": 0,
        "explanation": "Leio é primeira pessoa singular.",
        "optionRationales": [
          "Leio é primeira pessoa singular.",
          "Lemos é primeira plural.",
          "Lê é terceira singular.",
          "Leem é terceira plural."
        ]
      },
      {
        "id": "q.cnchefe.q04",
        "topicId": "portuguese.syntax.concordance.boss",
        "prompt": "Ao substituir ela por elas em Ela lê o roteiro, qual forma preserva o presente e ajusta número?",
        "options": [
          "Elas leio o roteiro.",
          "Elas lê o roteiro.",
          "Elas leem o roteiro.",
          "Elas leram o roteiro."
        ],
        "answer": 2,
        "explanation": "Leem é terceira plural presente.",
        "optionRationales": [
          "Leio é primeira singular.",
          "Lê permanece singular.",
          "Leem é terceira plural presente.",
          "Leram muda para passado."
        ]
      },
      {
        "id": "q.cnchefe.q05",
        "topicId": "portuguese.syntax.concordance.boss",
        "prompt": "Qual grupo ajusta as formas ensinadas a uma única lista?",
        "options": [
          "Este lista novo",
          "Estas lista novas",
          "Esta lista nova",
          "Estes listas novos"
        ],
        "answer": 2,
        "explanation": "Lista feminino singular pede esta/nova.",
        "optionRationales": [
          "As formas são masculino.",
          "As formas são plural com substantivo singular.",
          "Lista feminino singular pede esta/nova.",
          "Há mudança de número e gênero incompatível."
        ]
      },
      {
        "id": "q.cnchefe.q06",
        "topicId": "portuguese.syntax.concordance.boss",
        "prompt": "Em A página dos cadernos novos caiu, por que novos e caiu não têm o mesmo número?",
        "options": [
          "Novos caracteriza cadernos; caiu concorda com o sujeito de núcleo página.",
          "Ambos deveriam ser plural porque cadernos é próximo.",
          "Novos caracteriza página e caiu caracteriza cadernos.",
          "Caiu é adjetivo e novos é verbo."
        ],
        "answer": 0,
        "explanation": "Os termos possuem vínculos diferentes na frase.",
        "optionRationales": [
          "Os termos possuem vínculos diferentes na frase.",
          "A proximidade não redefine o sujeito.",
          "Os vínculos foram trocados.",
          "As classes foram invertidas."
        ]
      },
      {
        "id": "q.cnchefe.q07",
        "topicId": "portuguese.syntax.concordance.boss",
        "prompt": "Complete o caso ensinado: A aluna e o professor ___ a pauta ontem.",
        "options": [
          "reviso",
          "revisou",
          "revisamos",
          "revisaram"
        ],
        "answer": 3,
        "explanation": "Dois núcleos anteriores, de terceira pessoa ligados por e, pedem plural no passado.",
        "optionRationales": [
          "Reviso muda pessoa/tempo.",
          "Revisou é singular.",
          "Revisamos é primeira plural.",
          "Dois núcleos anteriores, de terceira pessoa ligados por e, pedem plural no passado."
        ]
      },
      {
        "id": "q.cnchefe.q08",
        "topicId": "portuguese.syntax.concordance.boss",
        "prompt": "Qual limite evita generalizar a regra de sujeito composto deste lote?",
        "options": [
          "Todo verbo com duas palavras anteriores deve estar plural.",
          "Ela foi ensinada para núcleos de terceira pessoa anteriores ao verbo e ligados por e.",
          "Sujeito posposto sempre segue a mesma regra sem alternativas.",
          "Todo uso de e implica sujeito composto."
        ],
        "answer": 1,
        "explanation": "O recorte explicitamente delimita posição, pessoa e ligação dos núcleos.",
        "optionRationales": [
          "Palavras anteriores não são necessariamente núcleos.",
          "O recorte explicitamente delimita posição, pessoa e ligação dos núcleos.",
          "O caso posposto não foi ensinado no lote.",
          "E pode ligar outros termos/orações."
        ]
      },
      {
        "id": "q.cnchefe.q09",
        "topicId": "portuguese.syntax.concordance.boss",
        "prompt": "Qual dupla indica existência passada com as formas ensinadas?",
        "options": [
          "Havia roteiros / Existiam roteiros.",
          "Haviam roteiros / Existia roteiros.",
          "Há roteiros / Existiam roteiros.",
          "Havia roteiros / Existem roteiros."
        ],
        "answer": 0,
        "explanation": "Haver existencial singular e existir plural preservam o passado.",
        "optionRationales": [
          "Haver existencial singular e existir plural preservam o passado.",
          "As formas não respeitam as estruturas ensinadas.",
          "Há muda o primeiro caso para presente.",
          "Existem muda o segundo para presente."
        ]
      },
      {
        "id": "q.cnchefe.q10",
        "topicId": "portuguese.syntax.concordance.boss",
        "prompt": "Na frase Há resumos na mesa, por que resumos não exige haver no plural?",
        "options": [
          "Haver e existir têm sempre estrutura idêntica.",
          "Todo substantivo plural é sujeito.",
          "Haver existencial é impessoal e resumos não é seu sujeito.",
          "Mesa é sujeito e controla haver."
        ],
        "answer": 2,
        "explanation": "O uso existencial ensinado não tem sujeito.",
        "optionRationales": [
          "Existir tem sujeito nesses exemplos; haver não.",
          "A função não depende só de ser plural.",
          "O uso existencial ensinado não tem sujeito.",
          "Na mesa é circunstância, não sujeito."
        ]
      },
      {
        "id": "q.cnchefe.q11",
        "topicId": "portuguese.syntax.concordance.boss",
        "prompt": "Complete no passado: ___ dois anos que a turma se reunia.",
        "options": [
          "Faziam",
          "Fazia",
          "Fazemos",
          "Faço"
        ],
        "answer": 1,
        "explanation": "Fazer temporal é impessoal e fica singular; fazia preserva o passado.",
        "optionRationales": [
          "Anos não impõe plural no uso temporal.",
          "Fazer temporal é impessoal e fica singular; fazia preserva o passado.",
          "Fazemos muda pessoa/tempo.",
          "Faço muda pessoa/tempo."
        ]
      },
      {
        "id": "q.cnchefe.q12",
        "topicId": "portuguese.syntax.concordance.boss",
        "prompt": "Você decidiu usar faz em Os grupos fazem resumos porque fazer pode ser impessoal. Qual recuperação resolve?",
        "options": [
          "Trocar fazem por faço sem alterar o sujeito.",
          "Aplicar a impessoalidade a qualquer uso de fazer.",
          "Concordar com resumos por ser o complemento.",
          "Reconhecer o uso não temporal, com grupos como sujeito plural."
        ],
        "answer": 3,
        "explanation": "O uso dado tem sujeito grupos; não é fazer indicando tempo decorrido.",
        "optionRationales": [
          "Faço não corresponde a grupos.",
          "A regra é delimitada por uso.",
          "O complemento não controla o verbo nesse caso.",
          "O uso dado tem sujeito grupos; não é fazer indicando tempo decorrido."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "cnchefe-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.cnchefe.q01": [
          {
            "missionId": "portuguese.syntax.concordance.boss",
            "sectionId": "exemplo"
          },
          {
            "missionId": "portuguese.syntax.concordance.verbal",
            "sectionId": "nucleo"
          }
        ],
        "q.cnchefe.q02": [
          {
            "missionId": "portuguese.syntax.concordance.boss",
            "sectionId": "vinculos"
          },
          {
            "missionId": "portuguese.syntax.concordance.verbal",
            "sectionId": "ex-plural"
          }
        ],
        "q.cnchefe.q03": [
          {
            "missionId": "portuguese.syntax.concordance.boss",
            "sectionId": "vinculos"
          },
          {
            "missionId": "portuguese.syntax.concordance.verbal",
            "sectionId": "pessoa"
          }
        ],
        "q.cnchefe.q04": [
          {
            "missionId": "portuguese.syntax.concordance.boss",
            "sectionId": "vinculos"
          },
          {
            "missionId": "portuguese.syntax.concordance.verbal",
            "sectionId": "pessoa"
          }
        ],
        "q.cnchefe.q05": [
          {
            "missionId": "portuguese.syntax.concordance.boss",
            "sectionId": "vinculos"
          },
          {
            "missionId": "portuguese.syntax.concordance.nominal",
            "sectionId": "ex-lista"
          }
        ],
        "q.cnchefe.q06": [
          {
            "missionId": "portuguese.syntax.concordance.boss",
            "sectionId": "vinculos"
          },
          {
            "missionId": "portuguese.syntax.concordance.nominal",
            "sectionId": "ex-vinculo"
          }
        ],
        "q.cnchefe.q07": [
          {
            "missionId": "portuguese.syntax.concordance.boss",
            "sectionId": "vinculos"
          },
          {
            "missionId": "portuguese.syntax.concordance.impessoais",
            "sectionId": "entrada"
          }
        ],
        "q.cnchefe.q08": [
          {
            "missionId": "portuguese.syntax.concordance.boss",
            "sectionId": "recuperacao"
          },
          {
            "missionId": "portuguese.syntax.concordance.impessoais",
            "sectionId": "entrada"
          }
        ],
        "q.cnchefe.q09": [
          {
            "missionId": "portuguese.syntax.concordance.boss",
            "sectionId": "vinculos"
          },
          {
            "missionId": "portuguese.syntax.concordance.impessoais",
            "sectionId": "ex-existencia"
          }
        ],
        "q.cnchefe.q10": [
          {
            "missionId": "portuguese.syntax.concordance.boss",
            "sectionId": "vinculos"
          },
          {
            "missionId": "portuguese.syntax.concordance.impessoais",
            "sectionId": "haver"
          }
        ],
        "q.cnchefe.q11": [
          {
            "missionId": "portuguese.syntax.concordance.boss",
            "sectionId": "vinculos"
          },
          {
            "missionId": "portuguese.syntax.concordance.impessoais",
            "sectionId": "fazer"
          }
        ],
        "q.cnchefe.q12": [
          {
            "missionId": "portuguese.syntax.concordance.boss",
            "sectionId": "recuperacao"
          },
          {
            "missionId": "portuguese.syntax.concordance.impessoais",
            "sectionId": "ex-tempo"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.cnchefe",
      "blockId": "portuguese.syntax",
      "prerequisiteId": "portuguese.syntax.concordance.revisao",
      "parametersApproved": false
    }
  }
]);
export const CN_SOURCES = Object.freeze([
  {
    "id": "cn.cn01.senado.concordancia",
    "label": "Senado Federal — Manual de Comunicação: concordância verbal",
    "url": "https://www12.senado.leg.br/manualdecomunicacao/estilos/concordancia-verbal",
    "version": "Manual de Comunicação, página HTML consultada em 04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "Regra geral; sujeito único8 (haver/fazer impessoais); sujeito composto1–2 (posição)"
  },
  {
    "id": "cn.cn01.authorial.cn01",
    "label": "Material autoral da Missão Bancária — CN-01 (rascunho local)",
    "url": "https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado",
    "version": "Texto e exercícios autorais v1",
    "checkedAt": "2026-10-04",
    "locator": "docs/missao-bancaria/rascunhos/cn-01-v1.mjs",
    "provenance": "project-authored",
    "remoteArtifactAvailable": false
  },
  {
    "id": "cn.cn02.incaper.nominal",
    "label": "Incaper — Manual de Produção Editorial: concordância nominal",
    "url": "https://manual-editorial.incaper.es.gov.br/capitulo_onze.htm",
    "version": "Manual institucional, capítulo11, HTML consultado em04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "11.2.2 A (regra geral) e B (mais de um substantivo, limite do recorte); 11.2.1 sujeito único9 (ressalva coletivos)"
  },
  {
    "id": "cn.cn02.authorial.cn02",
    "label": "Material autoral da Missão Bancária — CN-02 (rascunho local)",
    "url": "https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado",
    "version": "Texto e exercícios autorais v1",
    "checkedAt": "2026-10-04",
    "locator": "docs/missao-bancaria/rascunhos/cn-02-v1.mjs",
    "provenance": "project-authored",
    "remoteArtifactAvailable": false
  },
  {
    "id": "cn.cn03.senado.concordancia",
    "label": "Senado Federal — Manual de Comunicação: concordância verbal",
    "url": "https://www12.senado.leg.br/manualdecomunicacao/estilos/concordancia-verbal",
    "version": "Manual de Comunicação, página HTML consultada em 04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "Regra geral; sujeito único8 (haver/fazer impessoais); sujeito composto1–2 (posição)"
  },
  {
    "id": "cn.cn03.authorial.cn03",
    "label": "Material autoral da Missão Bancária — CN-03 (rascunho local)",
    "url": "https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado",
    "version": "Texto e exercícios autorais v1",
    "checkedAt": "2026-10-04",
    "locator": "docs/missao-bancaria/rascunhos/cn-03-v1.mjs",
    "provenance": "project-authored",
    "remoteArtifactAvailable": false
  },
  {
    "id": "cn.cnr.senado.concordancia",
    "label": "Senado Federal — Manual de Comunicação: concordância verbal",
    "url": "https://www12.senado.leg.br/manualdecomunicacao/estilos/concordancia-verbal",
    "version": "Manual de Comunicação, página HTML consultada em 04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "Regra geral; sujeito único8 (haver/fazer impessoais); sujeito composto1–2 (posição)"
  },
  {
    "id": "cn.cnr.incaper.nominal",
    "label": "Incaper — Manual de Produção Editorial: concordância nominal",
    "url": "https://manual-editorial.incaper.es.gov.br/capitulo_onze.htm",
    "version": "Manual institucional, capítulo11, HTML consultado em04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "11.2.2 A (regra geral) e B (mais de um substantivo, limite do recorte); 11.2.1 sujeito único9 (ressalva coletivos)"
  },
  {
    "id": "cn.cnr.authorial.cnr",
    "label": "Material autoral da Missão Bancária — CN-R (rascunho local)",
    "url": "https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado",
    "version": "Texto e exercícios autorais v1",
    "checkedAt": "2026-10-04",
    "locator": "docs/missao-bancaria/rascunhos/cn-r-v1.mjs",
    "provenance": "project-authored",
    "remoteArtifactAvailable": false
  },
  {
    "id": "cn.cnchefe.senado.concordancia",
    "label": "Senado Federal — Manual de Comunicação: concordância verbal",
    "url": "https://www12.senado.leg.br/manualdecomunicacao/estilos/concordancia-verbal",
    "version": "Manual de Comunicação, página HTML consultada em 04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "Regra geral; sujeito único8 (haver/fazer impessoais); sujeito composto1–2 (posição)"
  },
  {
    "id": "cn.cnchefe.incaper.nominal",
    "label": "Incaper — Manual de Produção Editorial: concordância nominal",
    "url": "https://manual-editorial.incaper.es.gov.br/capitulo_onze.htm",
    "version": "Manual institucional, capítulo11, HTML consultado em04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "11.2.2 A (regra geral) e B (mais de um substantivo, limite do recorte); 11.2.1 sujeito único9 (ressalva coletivos)"
  },
  {
    "id": "cn.cnchefe.authorial.cnchefe",
    "label": "Material autoral da Missão Bancária — CN-CHEFE (rascunho local)",
    "url": "https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado",
    "version": "Texto e exercícios autorais v1",
    "checkedAt": "2026-10-04",
    "locator": "docs/missao-bancaria/rascunhos/cn-chefe-v1.mjs",
    "provenance": "project-authored",
    "remoteArtifactAvailable": false
  }
]);
