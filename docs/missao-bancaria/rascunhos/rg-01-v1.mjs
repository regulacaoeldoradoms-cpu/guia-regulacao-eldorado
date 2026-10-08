// Ensino e frases autorais; rascunho local desativado.
export const SOURCES = [];
export const RG01_DRAFT = {
  "id": "draft.rg01",
  "topicId": "draft.rg01",
  "editorialKey": "RG-01",
  "candidateBlockId": "portuguese.syntax",
  "title": "Regência e concordância: separar os vínculos",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Reconhecer a ligação verbo/complemento nos usos já ensinados, distinguindo-a do ajuste ao sujeito.",
  "sourceIds": [],
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
      "sourceIds": []
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
      "id": "rg01.q01",
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
      ],
      "recoverySectionIds": [
        "direto"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "rg01.q02",
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
      ],
      "recoverySectionIds": [
        "indireto"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "rg01.q03",
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
      ],
      "recoverySectionIds": [
        "ex-vinculos"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "rg01.q04",
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
      ],
      "recoverySectionIds": [
        "direto"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "rg01.q05",
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
      ],
      "recoverySectionIds": [
        "indireto"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "rg01.q06",
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
      ],
      "recoverySectionIds": [
        "limites"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "rg01.q07",
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
      ],
      "recoverySectionIds": [
        "recuperacao"
      ],
      "objectiveIds": [
        "O4"
      ]
    },
    {
      "id": "rg01.q08",
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
    "editorialPass": "rg01-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "rg01.q01": [
        {
          "missionId": "draft.rg01",
          "sectionId": "direto"
        }
      ],
      "rg01.q02": [
        {
          "missionId": "draft.rg01",
          "sectionId": "indireto"
        }
      ],
      "rg01.q03": [
        {
          "missionId": "draft.rg01",
          "sectionId": "ex-vinculos"
        }
      ],
      "rg01.q04": [
        {
          "missionId": "draft.rg01",
          "sectionId": "direto"
        }
      ],
      "rg01.q05": [
        {
          "missionId": "draft.rg01",
          "sectionId": "indireto"
        }
      ],
      "rg01.q06": [
        {
          "missionId": "draft.rg01",
          "sectionId": "limites"
        }
      ],
      "rg01.q07": [
        {
          "missionId": "draft.rg01",
          "sectionId": "recuperacao"
        }
      ],
      "rg01.q08": [
        {
          "missionId": "draft.rg01",
          "sectionId": "limites"
        }
      ]
    }
  }
};
export const EDITORIAL = {
  "stage": "Rascunho local fora do catálogo; parecer pedagógico independente aprovado no recorte introdutório",
  "objectives": {
    "O1": "Distinguir sujeito, complemento e circunstância nos usos ensinados.",
    "O2": "Reconhecer a ligação direta ou com de no uso dado.",
    "O3": "Separar regência e concordância sem regra universal.",
    "O4": "Retomar a base e corrigir o vínculo ignorado."
  },
  "recovery": {
    "objectiveId": "O4",
    "instruction": "Identificar os termos e justificar separadamente flexão e ligação."
  },
  "limits": [
    "Plano05/bloco portuguese.syntax existente; CF-03/CN-01 como bases, sem novo bloco/arquitetura ou abertura formal de fase.",
    "Ensino, frases e questões autorais/fictícios; reutiliza somente os usos elementares de CF-03 já revisados, não introduz nova lista normativa de regências. Não atribuir esses exercícios aos manuais PU/CN.",
    "Outras regências/sentidos e usos normativos de verbos, regência nominal, relativas e crase ficam fora; a expansão exige recorte e referência pertinentes antes de cobrar.",
    "Sem ordem/XP/candidato Worker/push/ativação/merge/deploy/D1; contrato human-review-pending não é aceite humano."
  ]
};
export const ARITHMETIC = [];
