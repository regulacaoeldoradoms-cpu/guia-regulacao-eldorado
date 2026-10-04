// Ensino e frases autorais; rascunho local desativado.
export const SOURCES = [
  {
    "id": "senado.concordancia",
    "label": "Senado Federal — Manual de Comunicação: concordância verbal",
    "url": "https://www12.senado.leg.br/manualdecomunicacao/estilos/concordancia-verbal",
    "version": "Manual de Comunicação, página HTML consultada em 04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "Regra geral; sujeito único8 (haver/fazer impessoais); sujeito composto1–2 (posição)"
  }
];
export const CN01_DRAFT = {
  "id": "draft.cn01",
  "topicId": "draft.cn01",
  "editorialKey": "CN-01",
  "candidateBlockId": "portuguese.syntax",
  "title": "Concordância verbal: encontrar o núcleo do sujeito",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Ajustar formas aos termos relacionados em frases simples, distinguindo núcleo e usos impessoais ensinados.",
  "sourceIds": [
    "senado.concordancia"
  ],
  "sections": [
    {
      "id": "entrada",
      "heading": "1. O verbo se relaciona ao sujeito",
      "body": "CF ensinou pessoa/número e núcleo. Em A aluna lê e As alunas leem, lê/leem ajustam-se à terceira pessoa singular/plural do sujeito. Esse ajuste é concordância verbal. Aqui usamos sujeitos simples expressos e ordem normal. Não basta escolher a forma pela última palavra antes do verbo.",
      "type": "explanation",
      "sourceIds": [
        "senado.concordancia"
      ]
    },
    {
      "id": "nucleo",
      "heading": "2. Núcleo e palavras que o acompanham",
      "body": "Em O roteiro das aulas chegou, o sujeito inteiro é O roteiro das aulas, mas roteiro é seu núcleo singular; chegou concorda com ele. Aulas integra o grupo introduzido por das e não controla o verbo. Compare Os roteiros da aula chegaram: roteiros agora é plural, mesmo que aula seja singular.",
      "type": "explanation",
      "sourceIds": [
        "senado.concordancia"
      ]
    },
    {
      "id": "pessoa",
      "heading": "3. Pessoa e número expressos",
      "body": "Eu leio é primeira pessoa singular; nós lemos é primeira plural; ela lê é terceira singular; elas leem é terceira plural. O verbo continua relacionado ao sujeito expresso. Não se cobram diferenças regionais com tu/vós, sujeito oculto ou mistura de pessoas em sujeito composto.",
      "type": "explanation",
      "sourceIds": [
        "senado.concordancia"
      ]
    },
    {
      "id": "ex-nucleo",
      "heading": "4. Exemplo resolvido: singular entre plurais",
      "body": "Em A lista de perguntas chegou, localize chegou. O que chegou? A lista de perguntas. Núcleo lista, terceira pessoa singular; use chegou, não chegaram. Perguntas é plural, mas acompanha lista num grupo preposicionado. O procedimento parte da estrutura, não de contar seres mencionados.",
      "type": "worked-example",
      "sourceIds": [
        "senado.concordancia"
      ]
    },
    {
      "id": "ex-plural",
      "heading": "5. Exemplo resolvido: núcleo plural",
      "body": "Em Os cadernos da turma ficaram na sala, o sujeito é Os cadernos da turma; núcleo cadernos, terceira pessoa plural. Ficaram concorda com cadernos, não com turma. Na sala é circunstância de lugar.",
      "type": "worked-example",
      "sourceIds": [
        "senado.concordancia"
      ]
    },
    {
      "id": "ex-pessoa",
      "heading": "6. Exemplo resolvido: sujeito nós",
      "body": "Em Nós revisamos o resumo, nós é sujeito de primeira pessoa plural, revisamos é a forma correspondente no contexto. A troca apenas de nós por eu exige ajuste verbal: Eu reviso o resumo, se o contexto for presente. Concordância não autoriza mudar o tempo pretendido.",
      "type": "worked-example",
      "sourceIds": [
        "senado.concordancia"
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
      "id": "cn01.q01",
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
      ],
      "recoverySectionIds": [
        "nucleo"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "cn01.q02",
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
      ],
      "recoverySectionIds": [
        "nucleo"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "cn01.q03",
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
      ],
      "recoverySectionIds": [
        "pessoa"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "cn01.q04",
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
      ],
      "recoverySectionIds": [
        "ex-nucleo"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "cn01.q05",
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
      ],
      "recoverySectionIds": [
        "ex-plural"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "cn01.q06",
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
      ],
      "recoverySectionIds": [
        "pessoa"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "cn01.q07",
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
      ],
      "recoverySectionIds": [
        "recuperacao"
      ],
      "objectiveIds": [
        "O4"
      ]
    },
    {
      "id": "cn01.q08",
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
      ],
      "recoverySectionIds": [
        "entrada"
      ],
      "objectiveIds": [
        "O3"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "cn01-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "cn01.q01": [
        {
          "missionId": "draft.cn01",
          "sectionId": "nucleo"
        }
      ],
      "cn01.q02": [
        {
          "missionId": "draft.cn01",
          "sectionId": "nucleo"
        }
      ],
      "cn01.q03": [
        {
          "missionId": "draft.cn01",
          "sectionId": "pessoa"
        }
      ],
      "cn01.q04": [
        {
          "missionId": "draft.cn01",
          "sectionId": "ex-nucleo"
        }
      ],
      "cn01.q05": [
        {
          "missionId": "draft.cn01",
          "sectionId": "ex-plural"
        }
      ],
      "cn01.q06": [
        {
          "missionId": "draft.cn01",
          "sectionId": "pessoa"
        }
      ],
      "cn01.q07": [
        {
          "missionId": "draft.cn01",
          "sectionId": "recuperacao"
        }
      ],
      "cn01.q08": [
        {
          "missionId": "draft.cn01",
          "sectionId": "entrada"
        }
      ]
    }
  }
};
export const EDITORIAL = {
  "stage": "Rascunho local fora do catálogo; parecer pedagógico independente aprovado no recorte introdutório; CN-01 q4 ajustada ao sujeito simples não coletivo após conferência de fonte",
  "objectives": {
    "O1": "Identificar o termo que controla a forma.",
    "O2": "Aplicar o ajuste nos casos ensinados.",
    "O3": "Distinguir vínculo, proximidade e impessoalidade.",
    "O4": "Retomar ensino e justificar a correção."
  },
  "recovery": {
    "objectiveId": "O4",
    "instruction": "Identificar o vínculo e as características do termo controlador antes de corrigir."
  },
  "limits": [
    "Plano05/bloco portuguese.syntax existente; pré-requisitos CF (verbo, pessoa/número, sujeito/núcleo) e PU (grupos); perfis históricos BB/CAIXA referenceOnly.",
    "Frases e exercícios autorais/fictícios, sem dados pessoais. Referências institucionais conferidas em04/10/2026 nas regras pertinentes; não cobrem todo o bloco nem atribuem os exemplos autorais aos manuais.",
    "Recorte introdutório: não cobre coletivos/partitivos, pronomes relativos, porcentagens, concordância com se, sujeito posposto ou misturas de pessoas em sujeitos compostos, adjetivo com múltiplos substantivos, predicativos e todas as expressões especiais.",
    "Sem XP/ordem/candidato/runtime/push/ativação/merge/deploy/D1; parecer não equivale a aceite humano, avaliação independente ou retenção."
  ]
};
export const ARITHMETIC = [];
