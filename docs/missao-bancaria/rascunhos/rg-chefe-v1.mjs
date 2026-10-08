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
export const RGCHEFE_DRAFT = {
  "id": "draft.rgchefe",
  "topicId": "draft.rgchefe",
  "editorialKey": "RG-CHEFE",
  "candidateBlockId": "portuguese.syntax",
  "title": "Chefe: justificar regente, sentido e ligação",
  "contentVersion": 1,
  "kind": "boss",
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
      "id": "rgchefe.q01",
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
      ],
      "recoverySectionIds": [
        "roteiro"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "rg01",
          "sectionId": "ex-vinculos"
        }
      ],
      "groupId": "base"
    },
    {
      "id": "rgchefe.q02",
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
      ],
      "recoverySectionIds": [
        "roteiro"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "rg01",
          "sectionId": "ex-vinculos"
        }
      ],
      "groupId": "base"
    },
    {
      "id": "rgchefe.q03",
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
      ],
      "recoverySectionIds": [
        "roteiro"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "rg01",
          "sectionId": "direto"
        }
      ],
      "groupId": "complemento"
    },
    {
      "id": "rgchefe.q04",
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
      ],
      "recoverySectionIds": [
        "roteiro"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "rg01",
          "sectionId": "direto"
        }
      ],
      "groupId": "complemento"
    },
    {
      "id": "rgchefe.q05",
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
      ],
      "recoverySectionIds": [
        "roteiro"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "rg02",
          "sectionId": "presenciar"
        }
      ],
      "groupId": "assistir"
    },
    {
      "id": "rgchefe.q06",
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
      ],
      "recoverySectionIds": [
        "roteiro"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "rg02",
          "sectionId": "ajudar"
        }
      ],
      "groupId": "assistir"
    },
    {
      "id": "rgchefe.q07",
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
      ],
      "recoverySectionIds": [
        "roteiro"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "rg02",
          "sectionId": "visar"
        }
      ],
      "groupId": "visar"
    },
    {
      "id": "rgchefe.q08",
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
      ],
      "recoverySectionIds": [
        "recuperacao"
      ],
      "objectiveIds": [
        "O4"
      ],
      "originRefs": [
        {
          "unit": "rg02",
          "sectionId": "ex-visar"
        }
      ],
      "groupId": "visar"
    },
    {
      "id": "rgchefe.q09",
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
      ],
      "recoverySectionIds": [
        "exemplo"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "rg03",
          "sectionId": "necessidade"
        }
      ],
      "groupId": "nominal"
    },
    {
      "id": "rgchefe.q10",
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
      ],
      "recoverySectionIds": [
        "roteiro"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "rg03",
          "sectionId": "leitura"
        }
      ],
      "groupId": "nominal"
    },
    {
      "id": "rgchefe.q11",
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
      ],
      "recoverySectionIds": [
        "recuperacao"
      ],
      "objectiveIds": [
        "O4"
      ],
      "originRefs": [
        {
          "unit": "rg03",
          "sectionId": "ex-comparar"
        }
      ],
      "groupId": "retomada"
    },
    {
      "id": "rgchefe.q12",
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
      ],
      "recoverySectionIds": [
        "roteiro"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "rg03",
          "sectionId": "limites"
        }
      ],
      "groupId": "retomada"
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "rgchefe-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "rgchefe.q01": [
        {
          "missionId": "draft.rgchefe",
          "sectionId": "roteiro"
        },
        {
          "missionId": "draft.rg01",
          "sectionId": "ex-vinculos"
        }
      ],
      "rgchefe.q02": [
        {
          "missionId": "draft.rgchefe",
          "sectionId": "roteiro"
        },
        {
          "missionId": "draft.rg01",
          "sectionId": "ex-vinculos"
        }
      ],
      "rgchefe.q03": [
        {
          "missionId": "draft.rgchefe",
          "sectionId": "roteiro"
        },
        {
          "missionId": "draft.rg01",
          "sectionId": "direto"
        }
      ],
      "rgchefe.q04": [
        {
          "missionId": "draft.rgchefe",
          "sectionId": "roteiro"
        },
        {
          "missionId": "draft.rg01",
          "sectionId": "direto"
        }
      ],
      "rgchefe.q05": [
        {
          "missionId": "draft.rgchefe",
          "sectionId": "roteiro"
        },
        {
          "missionId": "draft.rg02",
          "sectionId": "presenciar"
        }
      ],
      "rgchefe.q06": [
        {
          "missionId": "draft.rgchefe",
          "sectionId": "roteiro"
        },
        {
          "missionId": "draft.rg02",
          "sectionId": "ajudar"
        }
      ],
      "rgchefe.q07": [
        {
          "missionId": "draft.rgchefe",
          "sectionId": "roteiro"
        },
        {
          "missionId": "draft.rg02",
          "sectionId": "visar"
        }
      ],
      "rgchefe.q08": [
        {
          "missionId": "draft.rgchefe",
          "sectionId": "recuperacao"
        },
        {
          "missionId": "draft.rg02",
          "sectionId": "ex-visar"
        }
      ],
      "rgchefe.q09": [
        {
          "missionId": "draft.rgchefe",
          "sectionId": "exemplo"
        },
        {
          "missionId": "draft.rg03",
          "sectionId": "necessidade"
        }
      ],
      "rgchefe.q10": [
        {
          "missionId": "draft.rgchefe",
          "sectionId": "roteiro"
        },
        {
          "missionId": "draft.rg03",
          "sectionId": "leitura"
        }
      ],
      "rgchefe.q11": [
        {
          "missionId": "draft.rgchefe",
          "sectionId": "recuperacao"
        },
        {
          "missionId": "draft.rg03",
          "sectionId": "ex-comparar"
        }
      ],
      "rgchefe.q12": [
        {
          "missionId": "draft.rgchefe",
          "sectionId": "roteiro"
        },
        {
          "missionId": "draft.rg03",
          "sectionId": "limites"
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
  ],
  "groups": [
    {
      "id": "base",
      "label": "Vínculo e concordância",
      "units": [
        "rg01"
      ]
    },
    {
      "id": "complemento",
      "label": "Complemento e circunstância",
      "units": [
        "rg01"
      ]
    },
    {
      "id": "assistir",
      "label": "Sentidos de assistir",
      "units": [
        "rg02"
      ]
    },
    {
      "id": "visar",
      "label": "Preferência e ressalva",
      "units": [
        "rg02"
      ]
    },
    {
      "id": "nominal",
      "label": "Nome e dependente",
      "units": [
        "rg03"
      ]
    },
    {
      "id": "retomada",
      "label": "Recuperação nominal",
      "units": [
        "rg03"
      ]
    }
  ]
};
export const ARITHMETIC = [];
