// Texto e exercícios autorais; rascunho local desativado.
export const SOURCES = [];
export const CFCHEFE_DRAFT = {
  "id": "draft.cfchefe",
  "topicId": "draft.cfchefe",
  "editorialKey": "CF-CHEFE",
  "candidateBlockId": "portuguese.syntax",
  "title": "Chefe: analisar palavras e grupos com contexto",
  "contentVersion": 1,
  "kind": "boss",
  "publication": {
    "status": "draft"
  },
  "objective": "Analisar classes, formas verbais e grupos nas frases simples ensinadas, preservando contexto e limites.",
  "sourceIds": [],
  "sections": [
    {
      "id": "entrada",
      "heading": "1. Um desafio de recorte",
      "body": "Doze itens próprios combinam classes, verbos e grupos já ensinados. Cada item tem origem e recuperação; acerto com consulta não equivale a avaliação independente ou prontidão global. Não se exige classificação não ensinada.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "classe",
      "heading": "2. Perguntar classe ou função",
      "body": "Em A estudante atenta organizou o texto, atenta é adjetivo; A estudante atenta é sujeito completo. Texto é substantivo dentro do complemento. Um substantivo pode integrar sujeito ou complemento em frases diferentes.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "nome",
      "heading": "3. Nomear não é flexionar",
      "body": "Preparação nomeia uma atividade, como substantivo; preparou é forma verbal. Em A preparação começou, o verbo é começou. Não definir verbo só pelo fato de a palavra nomear algo realizado.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "tempo",
      "heading": "4. Estado e contexto",
      "body": "Está em A equipe está tranquila é verbo de estado. Em Amanhã a equipe divulga a nota, divulga tem forma do presente e a referência futura vem de amanhã. No presente habitual, como lê todos os dias, não há garantia de ação neste segundo.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "pessoa",
      "heading": "5. Ajustar os exemplos dados",
      "body": "Eu leio/nós lemos são primeira pessoa singular/plural; ela lê/elas leem são terceira singular/plural. Nos exemplos habituais fornecidos, a mudança de número exige a forma correspondente, sem alterar a leitura em passado. Não cobrar toda conjugação.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "grupos",
      "heading": "6. Exemplo resolvido: análise completa",
      "body": "Em A equipe de colegas leu o roteiro ontem, A equipe de colegas é sujeito com núcleo equipe. Leu o roteiro ontem é predicado; o roteiro é objeto direto no caso; ontem é circunstância temporal. De colegas especifica equipe dentro do sujeito e não é objeto indireto de leu.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "retomadas",
      "heading": "7. Recuperar o ponto do erro",
      "body": "Consulte [CF-01](cf-01-v1.md), [CF-02](cf-02-v1.md), [CF-03](cf-03-v1.md) ou a [revisão](cf-r-v1.md). Identifique a pergunta confundida, compare uma frase resolvida e justifique por que a alternativa errada não conserva o caso.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "heading": "Vocabulário mínimo",
      "body": "Classe é categoria da palavra no contexto; função é papel do termo na oração. Forma verbal é uma realização do verbo, como leu/lerá. Pessoa gramatical e número distinguem eu/nós e ele/eles. Complemento completa o verbo nos usos ensinados; circunstância informa tempo/lugar nos exemplos, sem se tornar objeto por sua posição.",
      "type": "glossary",
      "sourceIds": []
    },
    {
      "id": "recuperacao",
      "heading": "Retomar a pergunta e o contexto",
      "body": "Marque se a questão pede classe, forma verbal ou função. Localize o verbo e os grupos completos; retome a seção indicada e compare um exemplo próximo. Registre o que a resposta errada ignorou e refaça a análise. Não transformar os casos introdutórios em regra universal.",
      "type": "summary",
      "sourceIds": []
    }
  ],
  "recall": [
    "Classe: que tipo de palavra é no contexto? Função: que papel tem o termo na oração?",
    "Compare aviso como substantivo no sujeito e no complemento.",
    "Não reduzir sujeito completo ao núcleo nem classificar toda ação nomeada como verbo."
  ],
  "questions": [
    {
      "id": "cfchefe.q01",
      "prompt": "Em O aluno atento preparou o roteiro, qual palavra é adjetivo no contexto?",
      "options": [
        "Preparou.",
        "Aluno.",
        "Atento.",
        "Roteiro."
      ],
      "answer": 2,
      "explanation": "Atento caracteriza aluno.",
      "optionRationales": [
        "Preparou é verbo.",
        "Aluno é substantivo no sujeito.",
        "Atento caracteriza aluno.",
        "Roteiro é substantivo no complemento."
      ],
      "recoverySectionIds": [
        "classe"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "cf01",
          "sectionId": "classes"
        }
      ],
      "groupId": "classe-funcao"
    },
    {
      "id": "cfchefe.q02",
      "prompt": "Compare A nota chegou e O grupo leu a nota. Qual análise é defensável?",
      "options": [
        "Nota é substantivo nas duas; A nota é sujeito na primeira e a nota completa leu na segunda.",
        "Nota deve ser sujeito nas duas por ser substantivo.",
        "Nota vira verbo ao ser lida.",
        "Chegou e leu são apenas nomes de objetos."
      ],
      "answer": 0,
      "explanation": "Classe da palavra e função do grupo não são idênticas.",
      "optionRationales": [
        "Classe da palavra e função do grupo não são idênticas.",
        "Ignora o complemento do segundo exemplo.",
        "Ser lido não transforma o nome em verbo.",
        "São formas verbais."
      ],
      "recoverySectionIds": [
        "classe"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "cf01",
          "sectionId": "ex-troca"
        }
      ],
      "groupId": "classe-funcao"
    },
    {
      "id": "cfchefe.q03",
      "prompt": "Em A preparação terminou, qual palavra é verbo?",
      "options": [
        "A preparação.",
        "Preparação.",
        "A.",
        "Terminou."
      ],
      "answer": 3,
      "explanation": "Terminou é a forma verbal; preparação nomeia atividade.",
      "optionRationales": [
        "É grupo do sujeito, não palavra verbal.",
        "É substantivo de atividade.",
        "É artigo.",
        "Terminou é a forma verbal; preparação nomeia atividade."
      ],
      "recoverySectionIds": [
        "nome"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "cf01",
          "sectionId": "ex-acao"
        }
      ],
      "groupId": "atividade-nomeada"
    },
    {
      "id": "cfchefe.q04",
      "prompt": "Um estudante afirma que revisão é verbo em A revisão começou porque nomeia ação. Qual correção preserva o recorte?",
      "options": [
        "Todas as palavras que nomeiam atividade são verbos.",
        "Revisão é substantivo; começou é verbo, mostrando que nome de ação não basta para classe verbo.",
        "Começou é substantivo porque vem depois do sujeito.",
        "A oração não tem verbo quando há nome de atividade."
      ],
      "answer": 1,
      "explanation": "Retoma o contraste entre nomear atividade e apresentar forma verbal.",
      "optionRationales": [
        "Generaliza indevidamente.",
        "Retoma o contraste entre nomear atividade e apresentar forma verbal.",
        "Posição não altera a forma verbal começou.",
        "Começou continua verbo expresso."
      ],
      "recoverySectionIds": [
        "nome"
      ],
      "objectiveIds": [
        "O4"
      ],
      "originRefs": [
        {
          "unit": "cf01",
          "sectionId": "ex-acao"
        }
      ],
      "groupId": "atividade-nomeada"
    },
    {
      "id": "cfchefe.q05",
      "prompt": "Em A turma está tranquila, qual afirmação reconhece o verbo sem reduzir tudo a ação?",
      "options": [
        "Está é verbo de estado; tranquila é adjetivo que caracteriza turma.",
        "Tranquila é o único verbo porque descreve situação.",
        "Não existe verbo nessa oração.",
        "Turma é verbo por fazer parte do sujeito."
      ],
      "answer": 0,
      "explanation": "Conserva a distinção classe/estado ensinada.",
      "optionRationales": [
        "Conserva a distinção classe/estado ensinada.",
        "Tranquila é adjetivo.",
        "Está é verbo expresso.",
        "Turma é substantivo."
      ],
      "recoverySectionIds": [
        "tempo"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "cf02",
          "sectionId": "ex-estado"
        }
      ],
      "groupId": "estado-tempo"
    },
    {
      "id": "cfchefe.q06",
      "prompt": "Em Amanhã o grupo divulga o roteiro, que conclusão conserva as pistas?",
      "options": [
        "Amanhã transforma divulga em nome de objeto.",
        "Divulga prova divulgação neste segundo.",
        "Divulga tem forma do presente com referência futura explicitada por amanhã.",
        "A frase obriga referência ao dia anterior."
      ],
      "answer": 2,
      "explanation": "A referência temporal vem do contexto futuro fornecido.",
      "optionRationales": [
        "A classe verbo permanece.",
        "Ignora amanhã.",
        "A referência temporal vem do contexto futuro fornecido.",
        "Amanhã não indica dia anterior."
      ],
      "recoverySectionIds": [
        "tempo"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "cf02",
          "sectionId": "ex-tempo"
        }
      ],
      "groupId": "estado-tempo"
    },
    {
      "id": "cfchefe.q07",
      "prompt": "Qual descrição corresponde a Eu leio e Nós lemos no recorte?",
      "options": [
        "Terceira pessoa do singular e terceira do plural.",
        "Primeira pessoa do singular e primeira do plural, respectivamente.",
        "Primeira plural e primeira singular, respectivamente.",
        "Terceira plural e primeira singular, respectivamente."
      ],
      "answer": 1,
      "explanation": "Eu/nós incluem quem fala e diferenciam singular/plural.",
      "optionRationales": [
        "Ele/eles são os exemplos de terceira pessoa.",
        "Eu/nós incluem quem fala e diferenciam singular/plural.",
        "Inverte número.",
        "Inverte pessoa/número dos exemplos."
      ],
      "recoverySectionIds": [
        "pessoa"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "cf02",
          "sectionId": "pessoa"
        }
      ],
      "groupId": "pessoa-numero"
    },
    {
      "id": "cfchefe.q08",
      "prompt": "Como ajustar Ela lê a agenda diariamente para sujeito Elas mantendo o hábito ensinado?",
      "options": [
        "Elas lerá a agenda diariamente.",
        "Elas lê a agenda diariamente.",
        "Elas leitura a agenda diariamente.",
        "Elas leem a agenda diariamente."
      ],
      "answer": 3,
      "explanation": "Leem corresponde à terceira pessoa plural no presente dado.",
      "optionRationales": [
        "Lerá não preserva plural/presente do caso.",
        "Lê mantém singular.",
        "Leitura é substantivo.",
        "Leem corresponde à terceira pessoa plural no presente dado."
      ],
      "recoverySectionIds": [
        "pessoa"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "cf02",
          "sectionId": "ex-numero"
        }
      ],
      "groupId": "pessoa-numero"
    },
    {
      "id": "cfchefe.q09",
      "prompt": "Em O grupo de colegas conferiu o texto, qual resposta dá sujeito completo e núcleo, nessa ordem?",
      "options": [
        "Grupo; O grupo de colegas.",
        "Conferiu o texto; conferiu.",
        "Colegas; texto.",
        "O grupo de colegas; grupo."
      ],
      "answer": 3,
      "explanation": "O grupo inteiro exerce sujeito; grupo é sua palavra central.",
      "optionRationales": [
        "Inverte grupo completo e núcleo.",
        "É predicado/verbo.",
        "Mistura parte da especificação e complemento.",
        "O grupo inteiro exerce sujeito; grupo é sua palavra central."
      ],
      "recoverySectionIds": [
        "grupos"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "cf03",
          "sectionId": "ex-grupo"
        }
      ],
      "groupId": "grupos-nucleo"
    },
    {
      "id": "cfchefe.q10",
      "prompt": "Em A equipe atenta organizou o roteiro, qual é o predicado completo?",
      "options": [
        "Organizou.",
        "Organizou o roteiro.",
        "A equipe atenta.",
        "Atenta."
      ],
      "answer": 1,
      "explanation": "Inclui verbo e complemento da declaração.",
      "optionRationales": [
        "É só o verbo.",
        "Inclui verbo e complemento da declaração.",
        "É sujeito completo.",
        "É adjetivo no grupo do sujeito."
      ],
      "recoverySectionIds": [
        "grupos"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "cf03",
          "sectionId": "predicado"
        }
      ],
      "groupId": "grupos-nucleo"
    },
    {
      "id": "cfchefe.q11",
      "prompt": "Em A turma de leitores precisou de apoio ontem, qual análise distingue os três grupos destacados?",
      "options": [
        "De leitores especifica turma no sujeito; de apoio completa precisou; ontem indica tempo.",
        "De leitores e ontem são objetos diretos só por conterem informação.",
        "De apoio é sujeito completo porque começa por preposição.",
        "Todo grupo com de é objeto indireto do verbo da oração."
      ],
      "answer": 0,
      "explanation": "Identifica vínculos e circunstância temporal, sem usar apenas posição/preposição.",
      "optionRationales": [
        "Identifica vínculos e circunstância temporal, sem usar apenas posição/preposição.",
        "De leitores integra sujeito e ontem é tempo.",
        "A turma de leitores é sujeito completo.",
        "De leitores liga-se a turma, não a precisou."
      ],
      "recoverySectionIds": [
        "grupos"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "cf03",
          "sectionId": "ex-de"
        }
      ],
      "groupId": "complemento-tempo"
    },
    {
      "id": "cfchefe.q12",
      "prompt": "Em A equipe trabalhou ontem, um estudante classifica ontem como objeto direto apenas por vir após o verbo. Qual retomada corrige?",
      "options": [
        "A equipe deve ser objeto por vir antes do verbo.",
        "Todo termo depois do verbo é objeto direto.",
        "Ontem informa tempo no exemplo; posição após verbo não basta para objeto.",
        "Ontem é forma verbal no passado."
      ],
      "answer": 2,
      "explanation": "Retoma a distinção entre circunstância e complemento.",
      "optionRationales": [
        "A equipe é sujeito expresso.",
        "Generaliza a posição.",
        "Retoma a distinção entre circunstância e complemento.",
        "Trabalhou é verbo; ontem é pista temporal."
      ],
      "recoverySectionIds": [
        "recuperacao"
      ],
      "objectiveIds": [
        "O4"
      ],
      "originRefs": [
        {
          "unit": "cf03",
          "sectionId": "circunstancia"
        }
      ],
      "groupId": "complemento-tempo"
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "cfchefe-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "cfchefe.q01": [
        {
          "missionId": "draft.cfchefe",
          "sectionId": "classe"
        },
        {
          "missionId": "draft.cf01",
          "sectionId": "classes"
        }
      ],
      "cfchefe.q02": [
        {
          "missionId": "draft.cfchefe",
          "sectionId": "classe"
        },
        {
          "missionId": "draft.cf01",
          "sectionId": "ex-troca"
        }
      ],
      "cfchefe.q03": [
        {
          "missionId": "draft.cfchefe",
          "sectionId": "nome"
        },
        {
          "missionId": "draft.cf01",
          "sectionId": "ex-acao"
        }
      ],
      "cfchefe.q04": [
        {
          "missionId": "draft.cfchefe",
          "sectionId": "nome"
        },
        {
          "missionId": "draft.cf01",
          "sectionId": "ex-acao"
        }
      ],
      "cfchefe.q05": [
        {
          "missionId": "draft.cfchefe",
          "sectionId": "tempo"
        },
        {
          "missionId": "draft.cf02",
          "sectionId": "ex-estado"
        }
      ],
      "cfchefe.q06": [
        {
          "missionId": "draft.cfchefe",
          "sectionId": "tempo"
        },
        {
          "missionId": "draft.cf02",
          "sectionId": "ex-tempo"
        }
      ],
      "cfchefe.q07": [
        {
          "missionId": "draft.cfchefe",
          "sectionId": "pessoa"
        },
        {
          "missionId": "draft.cf02",
          "sectionId": "pessoa"
        }
      ],
      "cfchefe.q08": [
        {
          "missionId": "draft.cfchefe",
          "sectionId": "pessoa"
        },
        {
          "missionId": "draft.cf02",
          "sectionId": "ex-numero"
        }
      ],
      "cfchefe.q09": [
        {
          "missionId": "draft.cfchefe",
          "sectionId": "grupos"
        },
        {
          "missionId": "draft.cf03",
          "sectionId": "ex-grupo"
        }
      ],
      "cfchefe.q10": [
        {
          "missionId": "draft.cfchefe",
          "sectionId": "grupos"
        },
        {
          "missionId": "draft.cf03",
          "sectionId": "predicado"
        }
      ],
      "cfchefe.q11": [
        {
          "missionId": "draft.cfchefe",
          "sectionId": "grupos"
        },
        {
          "missionId": "draft.cf03",
          "sectionId": "ex-de"
        }
      ],
      "cfchefe.q12": [
        {
          "missionId": "draft.cfchefe",
          "sectionId": "recuperacao"
        },
        {
          "missionId": "draft.cf03",
          "sectionId": "circunstancia"
        }
      ]
    }
  }
};
export const EDITORIAL = {
  "stage": "Rascunho local fora do catálogo; parecer pedagógico independente concluído sem correções",
  "objectives": {
    "O1": "Distinguir classe, forma verbal e função no contexto.",
    "O2": "Aplicar análise de verbo e grupos completos.",
    "O3": "Comparar casos sem regra universal.",
    "O4": "Retomar ensino e corrigir a pergunta confundida."
  },
  "recovery": {
    "objectiveId": "O4",
    "instruction": "Localizar verbo/grupos e retomar a seção de ensino."
  },
  "limits": [
    "Plano 05/bloco portuguese.syntax; BB/CAIXA históricos/referenceOnly; recorte, não cobertura integral.",
    "Texto, frases e itens autorais; sem atribuição normativa fictícia ou norma jurídica mutável.",
    "Não todos os modos/tempos/classes/sujeitos/complementos, voz passiva, concordância, regência ou crase.",
    "Revisão/Chefe não são avaliação independente ou prova de retenção.",
    "Sem XP/ordem editorial/runtime/push/ativação/merge/deploy/D1; parecer não é aceite humano."
  ],
  "groups": [
    {
      "id": "classe-funcao",
      "units": [
        "cf01"
      ]
    },
    {
      "id": "atividade-nomeada",
      "units": [
        "cf01"
      ]
    },
    {
      "id": "estado-tempo",
      "units": [
        "cf02"
      ]
    },
    {
      "id": "pessoa-numero",
      "units": [
        "cf02"
      ]
    },
    {
      "id": "grupos-nucleo",
      "units": [
        "cf03"
      ]
    },
    {
      "id": "complemento-tempo",
      "units": [
        "cf03"
      ]
    }
  ]
};
export const ARITHMETIC = [];
