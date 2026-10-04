// Ensino e frases autorais; rascunho local desativado.
export const SOURCES = [
  {
    "id": "senado.rg.assistir",
    "label": "Senado Federal — Manual de Comunicação: assistir",
    "url": "https://www12.senado.leg.br/manualdecomunicacao/estilos/assistir",
    "version": "Orientação editorial nos sentidos presenciar/ajudar; HTML consultado em04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "Abertura: sentido estar presente/presenciar; parágrafo de auxiliar/ajudar: use como transitivo direto"
  },
  {
    "id": "senado.rg.visar",
    "label": "Senado Federal — Manual de Comunicação: visar",
    "url": "https://www12.senado.leg.br/manualdecomunicacao/estilos/visar",
    "version": "Preferência editorial e ressalva do infinitivo; HTML consultado em04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "Objetivo: preferência por preposição a com nome; antes de infinitivo não usar a; sentido mirar/carimbar direto"
  }
];
export const RG02_DRAFT = {
  "id": "draft.rg02",
  "topicId": "draft.rg02",
  "editorialKey": "RG-02",
  "candidateBlockId": "portuguese.syntax",
  "title": "Regência verbal e sentido: seguir o padrão explicitado",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Identificar regente, sentido e dependente, aplicando só os vínculos ensinados e o padrão editorial explicitamente adotado.",
  "sourceIds": [
    "senado.rg.assistir",
    "senado.rg.visar"
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
        "senado.rg.assistir"
      ]
    },
    {
      "id": "ajudar",
      "heading": "3. Assistir no sentido de ajudar",
      "body": "No sentido de auxiliar/ajudar, o manual recomenda usar assistir como transitivo direto. No exemplo fictício O monitor assistiu o grupo na organização do mural, o contexto informa ajuda; o grupo completa o verbo sem preposição e o é artigo. O fato de presenciar usar a não autoriza copiar essa regência para qualquer sentido. Outras análises/variantes de registros diferentes não são cobradas.",
      "type": "explanation",
      "sourceIds": [
        "senado.rg.assistir"
      ]
    },
    {
      "id": "visar",
      "heading": "4. Visar: preferência e ressalva",
      "body": "Com sentido de ter objetivo e complemento nominal, o manual prefere visar com a: O programa visa a melhorias. Prefere não significa que a variante direta com nome seja universalmente proibida. Antes de verbo no infinitivo, esse manual orienta não usar a: O programa visa melhorar o roteiro. No sentido de mirar/carimbar, apresenta visar como direto: A funcionária visou o documento, com sentido de carimbar neste exemplo fictício; sem orientação sobre validade de documentos. Não cobrar crase aqui: os exemplos não exigem esse tópico.",
      "type": "explanation",
      "sourceIds": [
        "senado.rg.visar"
      ]
    },
    {
      "id": "ex-presenciar",
      "heading": "5. Exemplo resolvido: apresentação",
      "body": "O grupo assistiu a uma apresentação: o contexto é de presenciar; no padrão adotado, a liga o complemento ao verbo. Uma acompanha apresentação como artigo. Assistiu é singular porque o sujeito é O grupo: a concordância não substitui a análise de regência.",
      "type": "worked-example",
      "sourceIds": [
        "senado.rg.assistir"
      ]
    },
    {
      "id": "ex-ajudar",
      "heading": "6. Exemplo resolvido: auxílio no mural",
      "body": "O monitor assistiu o grupo na organização do mural, no sentido informado de ajudar. Seguindo o manual, o grupo é complemento direto; o é artigo, não preposição. Na organização do mural contextualiza a ajuda. Não decidir pelo mesmo verbo escrito sem verificar o sentido.",
      "type": "worked-example",
      "sourceIds": [
        "senado.rg.assistir"
      ]
    },
    {
      "id": "ex-visar",
      "heading": "7. Exemplo resolvido: nome e infinitivo",
      "body": "O programa visa a melhorias: melhorias é nome, a segue a preferência editorial para objetivo. O programa visa melhorar o roteiro: melhorar é infinitivo e a não aparece, conforme a ressalva do mesmo manual. Não reduzir a orientação a todo visar sempre exige a.",
      "type": "worked-example",
      "sourceIds": [
        "senado.rg.visar"
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
      "id": "rg02.q01",
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
      ],
      "recoverySectionIds": [
        "presenciar"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "rg02.q02",
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
      ],
      "recoverySectionIds": [
        "ajudar"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "rg02.q03",
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
      ],
      "recoverySectionIds": [
        "visar"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "rg02.q04",
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
      ],
      "recoverySectionIds": [
        "ex-visar"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "rg02.q05",
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
      ],
      "recoverySectionIds": [
        "limites"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "rg02.q06",
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
      ],
      "recoverySectionIds": [
        "visar"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "rg02.q07",
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
      ],
      "recoverySectionIds": [
        "recuperacao"
      ],
      "objectiveIds": [
        "O4"
      ]
    },
    {
      "id": "rg02.q08",
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
      ],
      "recoverySectionIds": [
        "ex-presenciar"
      ],
      "objectiveIds": [
        "O3"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "rg02-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "rg02.q01": [
        {
          "missionId": "draft.rg02",
          "sectionId": "presenciar"
        }
      ],
      "rg02.q02": [
        {
          "missionId": "draft.rg02",
          "sectionId": "ajudar"
        }
      ],
      "rg02.q03": [
        {
          "missionId": "draft.rg02",
          "sectionId": "visar"
        }
      ],
      "rg02.q04": [
        {
          "missionId": "draft.rg02",
          "sectionId": "ex-visar"
        }
      ],
      "rg02.q05": [
        {
          "missionId": "draft.rg02",
          "sectionId": "limites"
        }
      ],
      "rg02.q06": [
        {
          "missionId": "draft.rg02",
          "sectionId": "visar"
        }
      ],
      "rg02.q07": [
        {
          "missionId": "draft.rg02",
          "sectionId": "recuperacao"
        }
      ],
      "rg02.q08": [
        {
          "missionId": "draft.rg02",
          "sectionId": "ex-presenciar"
        }
      ]
    }
  }
};
export const EDITORIAL = {
  "stage": "Rascunho local fora do catálogo; parecer independente concluído, correções dirigidas RG-03 q6/RG-R q6 aplicadas",
  "objectives": {
    "O1": "Reconhecer o regente e o vínculo no contexto.",
    "O2": "Aplicar o padrão delimitado nos casos ensinados.",
    "O3": "Distinguir sentidos e alcance sem regra universal.",
    "O4": "Retomar ensino e corrigir o vínculo ignorado."
  },
  "recovery": {
    "objectiveId": "O4",
    "instruction": "Localizar regente/sentido/dependente e justificar a ligação conforme o recorte e a fonte, se adotada."
  },
  "limits": [
    "Plano05/documento114/bloco portuguese.syntax existente; pré-requisitos CF/RG-01/CN, perfis BB/CAIXA históricos/referenceOnly.",
    "Textos/exemplos/itens autorais e fictícios; referências verificadas somente para assistir/visar. Não reproduz exemplos institucionais nem orienta casos/procedimentos reais.",
    "RG-02 segue a orientação editorial do Senado explicitamente ensinada, não alega única regência possível em todos os registros. RG-03 é identificação estrutural em necessidade de/leitura do, sem lista normativa de nomes/preposições exclusivos ou todos os complementos nominais.",
    "Outros verbos/sentidos, regências nominais específicas, relativas com preposição, pronomes oblíquos e crase ficam fora do recorte; requerem ensino/fonte pertinentes antes de cobrar.",
    "Sem XP/ordem/candidato/push/ativação/merge/deploy/D1; reviewStatus human-review-pending não é aceite humano/avaliação independente/retenção."
  ]
};
export const ARITHMETIC = [];
