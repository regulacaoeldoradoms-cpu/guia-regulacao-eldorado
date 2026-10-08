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
export const RGR_DRAFT = {
  "id": "draft.rgr",
  "topicId": "draft.rgr",
  "editorialKey": "RG-R",
  "candidateBlockId": "portuguese.syntax",
  "title": "Revisão: verbo ou nome, sentido e ligação",
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
        "senado.rg.visar"
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
      "id": "rgr.q01",
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
      ],
      "recoverySectionIds": [
        "ex-base"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "rg01",
          "sectionId": "ex-vinculos"
        }
      ]
    },
    {
      "id": "rgr.q02",
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
      ],
      "recoverySectionIds": [
        "ex-base"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "rg01",
          "sectionId": "direto"
        }
      ]
    },
    {
      "id": "rgr.q03",
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
      ],
      "recoverySectionIds": [
        "ex-sentido"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "rg02",
          "sectionId": "presenciar"
        }
      ]
    },
    {
      "id": "rgr.q04",
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
      ],
      "recoverySectionIds": [
        "ex-sentido"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "rg02",
          "sectionId": "visar"
        }
      ]
    },
    {
      "id": "rgr.q05",
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
      ],
      "recoverySectionIds": [
        "ex-sentido"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "rg02",
          "sectionId": "ajudar"
        }
      ]
    },
    {
      "id": "rgr.q06",
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
      ],
      "recoverySectionIds": [
        "ex-nominal"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "rg03",
          "sectionId": "leitura"
        }
      ]
    },
    {
      "id": "rgr.q07",
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
      ]
    },
    {
      "id": "rgr.q08",
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
      ],
      "recoverySectionIds": [
        "recuperacao"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "rg01",
          "sectionId": "limites"
        }
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "rgr-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "rgr.q01": [
        {
          "missionId": "draft.rgr",
          "sectionId": "ex-base"
        }
      ],
      "rgr.q02": [
        {
          "missionId": "draft.rgr",
          "sectionId": "ex-base"
        }
      ],
      "rgr.q03": [
        {
          "missionId": "draft.rgr",
          "sectionId": "ex-sentido"
        }
      ],
      "rgr.q04": [
        {
          "missionId": "draft.rgr",
          "sectionId": "ex-sentido"
        }
      ],
      "rgr.q05": [
        {
          "missionId": "draft.rgr",
          "sectionId": "ex-sentido"
        }
      ],
      "rgr.q06": [
        {
          "missionId": "draft.rgr",
          "sectionId": "ex-nominal"
        }
      ],
      "rgr.q07": [
        {
          "missionId": "draft.rgr",
          "sectionId": "recuperacao"
        }
      ],
      "rgr.q08": [
        {
          "missionId": "draft.rgr",
          "sectionId": "recuperacao"
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
