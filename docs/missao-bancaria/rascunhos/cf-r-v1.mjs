// Texto e exercícios autorais; rascunho local desativado.
export const SOURCES = [];
export const CFR_DRAFT = {
  "id": "draft.cfr",
  "topicId": "draft.cfr",
  "editorialKey": "CF-R",
  "candidateBlockId": "portuguese.syntax",
  "title": "Revisão: classes, verbos e grupos sem confundir perguntas",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Analisar classes, formas verbais e grupos nas frases simples ensinadas, preservando contexto e limites.",
  "sourceIds": [],
  "sections": [
    {
      "id": "entrada",
      "heading": "1. Revisão com contexto",
      "body": "Retome CF-01/02/03: a pergunta pode pedir classe da palavra, forma verbal ou função do grupo. Os oito itens têm contextos próprios e indicam aula de origem para recuperação; não medem prontidão geral ou retenção futura.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "classes",
      "heading": "2. Nome de ação e classe",
      "body": "Em A revisão começou, revisão nomeia atividade como substantivo; começou é verbo. Em A turma revisou, revisou é forma verbal. Uma atividade nomeada não torna automaticamente a palavra um verbo.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "verbo",
      "heading": "3. Forma e referência temporal",
      "body": "Em Amanhã a equipe divulga o resumo, divulga tem forma do presente e amanhã situa o acontecimento no futuro da fala. Em A equipe divulga resumos toda semana, o presente apresenta hábito. Não ignorar a pista contextual.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "grupos",
      "heading": "4. Completar a análise",
      "body": "Em O grupo de colegas precisou de tempo ontem, O grupo de colegas é sujeito completo com núcleo grupo; precisou de tempo ontem é predicado. De tempo completa precisou como objeto indireto no uso; ontem indica tempo, não objeto.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "retomadas",
      "heading": "5. Voltar ao ensino",
      "body": "Consulte [CF-01](cf-01-v1.md), [CF-02](cf-02-v1.md) ou [CF-03](cf-03-v1.md) conforme a origem do erro. Pergunte o que foi confundido: palavra/grupo, classe/função, forma/contexto ou complemento/circunstância. Refaça a leitura da frase antes de escolher.",
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
      "id": "cfr.q01",
      "prompt": "Em O leitor cuidadoso releu a carta, qual distinção entre classe e função é adequada?",
      "options": [
        "Releu é sujeito por indicar ação.",
        "Cuidadoso é todo o sujeito; o leitor é verbo.",
        "Carta é verbo porque foi relida.",
        "Cuidadoso é adjetivo; O leitor cuidadoso é sujeito."
      ],
      "answer": 3,
      "explanation": "Separa classe da palavra e função do grupo.",
      "optionRationales": [
        "Releu é verbo do predicado.",
        "O sujeito inclui o grupo completo; leitor é substantivo.",
        "Carta é substantivo no complemento.",
        "Separa classe da palavra e função do grupo."
      ],
      "recoverySectionIds": [
        "classes"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "cf01",
          "sectionId": "ex-frase"
        }
      ]
    },
    {
      "id": "cfr.q02",
      "prompt": "Compare O roteiro chegou e A equipe preparou o roteiro. Que conclusão é apoiada?",
      "options": [
        "Roteiro é sujeito em toda frase por ser substantivo.",
        "Roteiro é substantivo nas duas; o grupo com roteiro muda de sujeito para complemento.",
        "Roteiro torna-se adjetivo ao completar preparou.",
        "As duas orações não apresentam verbo."
      ],
      "answer": 1,
      "explanation": "A classe permanece e a função muda com a oração.",
      "optionRationales": [
        "Ignora o complemento do segundo exemplo.",
        "A classe permanece e a função muda com a oração.",
        "Ser complemento não torna a palavra adjetivo.",
        "Chegou/preparou são verbos."
      ],
      "recoverySectionIds": [
        "classes"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "cf01",
          "sectionId": "ex-troca"
        }
      ]
    },
    {
      "id": "cfr.q03",
      "prompt": "Em A sala está silenciosa, qual palavra é verbo de estado?",
      "options": [
        "Está.",
        "Sala.",
        "Silenciosa.",
        "A."
      ],
      "answer": 0,
      "explanation": "Está apresenta o estado no exemplo.",
      "optionRationales": [
        "Está apresenta o estado no exemplo.",
        "Sala é substantivo.",
        "Silenciosa é adjetivo.",
        "A é artigo."
      ],
      "recoverySectionIds": [
        "verbo"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "cf02",
          "sectionId": "ex-estado"
        }
      ]
    },
    {
      "id": "cfr.q04",
      "prompt": "Em Amanhã o grupo apresenta o resumo, qual conclusão conserva forma e contexto?",
      "options": [
        "Amanhã transforma apresenta em adjetivo.",
        "Apresenta obriga acontecimento neste segundo.",
        "Apresenta tem forma do presente com referência futura dada por amanhã.",
        "A frase necessariamente fala do passado."
      ],
      "answer": 2,
      "explanation": "Mantém a pista contextual futura.",
      "optionRationales": [
        "A forma continua verbal.",
        "Ignora amanhã.",
        "Mantém a pista contextual futura.",
        "Amanhã é futuro da fala no caso."
      ],
      "recoverySectionIds": [
        "verbo"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "cf02",
          "sectionId": "ex-tempo"
        }
      ]
    },
    {
      "id": "cfr.q05",
      "prompt": "Em A turma de colegas precisou de orientação ontem, qual análise corresponde aos casos ensinados?",
      "options": [
        "Ontem é objeto direto; de orientação é sujeito.",
        "De orientação completa precisou; ontem é circunstância de tempo.",
        "De colegas é objeto indireto de precisou só por ter de.",
        "Todo grupo com substantivo é sujeito."
      ],
      "answer": 1,
      "explanation": "Distingue complemento preposicionado e informação temporal.",
      "optionRationales": [
        "Troca as funções.",
        "Distingue complemento preposicionado e informação temporal.",
        "De colegas especifica turma no sujeito.",
        "Substantivos também integram complementos."
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
          "sectionId": "ex-complemento"
        }
      ]
    },
    {
      "id": "cfr.q06",
      "prompt": "Um estudante chamou leitura de verbo em A leitura terminou. Qual retomada cabe?",
      "options": [
        "Usar a posição inicial como regra universal de classe.",
        "Eliminar terminou porque só a atividade pode ser verbo.",
        "Classificar toda palavra com ação no significado como verbo.",
        "Distinguir leitura como substantivo que nomeia atividade de terminou como verbo."
      ],
      "answer": 3,
      "explanation": "Conserva atividade nomeada e forma verbal.",
      "optionRationales": [
        "Posição não define sozinha a classe.",
        "Terminado o raciocínio, terminou continua sendo verbo.",
        "Generaliza além do contraste ensinado.",
        "Conserva atividade nomeada e forma verbal."
      ],
      "recoverySectionIds": [
        "classes"
      ],
      "objectiveIds": [
        "O4"
      ],
      "originRefs": [
        {
          "unit": "cf01",
          "sectionId": "ex-acao"
        }
      ]
    },
    {
      "id": "cfr.q07",
      "prompt": "Partindo de Ela lê a pauta todo dia, qual forma corresponde ao sujeito Elas no recorte?",
      "options": [
        "Elas leitura a pauta todo dia.",
        "Elas lê a pauta todo dia.",
        "Elas leem a pauta todo dia.",
        "Elas lerá a pauta todo dia."
      ],
      "answer": 2,
      "explanation": "Ajusta a terceira pessoa do singular para o plural no hábito dado.",
      "optionRationales": [
        "Substantivo não substitui a forma verbal.",
        "Mantém singular.",
        "Ajusta a terceira pessoa do singular para o plural no hábito dado.",
        "Futuro singular não mantém o caso pedido."
      ],
      "recoverySectionIds": [
        "verbo"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "cf02",
          "sectionId": "ex-numero"
        }
      ]
    },
    {
      "id": "cfr.q08",
      "prompt": "Em O grupo de estudantes conferiu a lista, que resposta dá o sujeito completo, sem trocá-lo pelo núcleo?",
      "options": [
        "O grupo de estudantes.",
        "Grupo.",
        "Estudantes.",
        "Conferiu a lista."
      ],
      "answer": 0,
      "explanation": "Inclui todo o grupo sobre o qual se declara a conferência.",
      "optionRationales": [
        "Inclui todo o grupo sobre o qual se declara a conferência.",
        "É só núcleo.",
        "Integra a especificação do grupo.",
        "É predicado."
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
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "cfr-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "cfr.q01": [
        {
          "missionId": "draft.cfr",
          "sectionId": "classes"
        }
      ],
      "cfr.q02": [
        {
          "missionId": "draft.cfr",
          "sectionId": "classes"
        }
      ],
      "cfr.q03": [
        {
          "missionId": "draft.cfr",
          "sectionId": "verbo"
        }
      ],
      "cfr.q04": [
        {
          "missionId": "draft.cfr",
          "sectionId": "verbo"
        }
      ],
      "cfr.q05": [
        {
          "missionId": "draft.cfr",
          "sectionId": "grupos"
        }
      ],
      "cfr.q06": [
        {
          "missionId": "draft.cfr",
          "sectionId": "classes"
        }
      ],
      "cfr.q07": [
        {
          "missionId": "draft.cfr",
          "sectionId": "verbo"
        }
      ],
      "cfr.q08": [
        {
          "missionId": "draft.cfr",
          "sectionId": "grupos"
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
  ]
};
export const ARITHMETIC = [];
