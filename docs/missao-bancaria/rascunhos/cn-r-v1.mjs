// Ensino e frases autorais; rascunho local desativado.
export const SOURCES = [
  {
    "id": "senado.concordancia",
    "label": "Senado Federal — Manual de Comunicação: concordância verbal",
    "url": "https://www12.senado.leg.br/manualdecomunicacao/estilos/concordancia-verbal",
    "version": "Manual de Comunicação, página HTML consultada em 04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "Regra geral; sujeito único8 (haver/fazer impessoais); sujeito composto1–2 (posição)"
  },
  {
    "id": "incaper.nominal",
    "label": "Incaper — Manual de Produção Editorial: concordância nominal",
    "url": "https://manual-editorial.incaper.es.gov.br/capitulo_onze.htm",
    "version": "Manual institucional, capítulo11, HTML consultado em04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "11.2.2 A (regra geral) e B (mais de um substantivo, limite do recorte); 11.2.1 sujeito único9 (ressalva coletivos)"
  }
];
export const CNR_DRAFT = {
  "id": "draft.cnr",
  "topicId": "draft.cnr",
  "editorialKey": "CN-R",
  "candidateBlockId": "portuguese.syntax",
  "title": "Revisão: conferir o vínculo antes de flexionar",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Ajustar formas aos termos relacionados em frases simples, distinguindo núcleo e usos impessoais ensinados.",
  "sourceIds": [
    "senado.concordancia",
    "incaper.nominal"
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
        "senado.concordancia"
      ]
    },
    {
      "id": "ex-nominal",
      "heading": "3. Exemplo resolvido: vínculo dentro do sujeito",
      "body": "As páginas do caderno novo rasgaram: páginas é núcleo plural do sujeito e controla rasgaram; novo caracteriza caderno. O adjetivo e o verbo não precisam acompanhar o mesmo substantivo.",
      "type": "worked-example",
      "sourceIds": [
        "incaper.nominal"
      ]
    },
    {
      "id": "ex-especial",
      "heading": "4. Exemplo resolvido: haver e existir",
      "body": "Havia fichas na mesa e Existiam fichas na mesa exprimem existência passada; havia é singular impessoal, existiam concorda com fichas plural. Não mudar o tempo ao corrigir o vínculo.",
      "type": "worked-example",
      "sourceIds": [
        "senado.concordancia"
      ]
    },
    {
      "id": "retomadas",
      "heading": "Retomar as aulas de origem",
      "body": "[CN-01](cn-01-v1.md) · [CN-02](cn-02-v1.md) · [CN-03](cn-03-v1.md)",
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
      "id": "cnr.q01",
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
      ],
      "recoverySectionIds": [
        "ex-verbal"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "cn01",
          "sectionId": "nucleo"
        }
      ]
    },
    {
      "id": "cnr.q02",
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
      ],
      "recoverySectionIds": [
        "ex-verbal"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "cn01",
          "sectionId": "pessoa"
        }
      ]
    },
    {
      "id": "cnr.q03",
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
      ],
      "recoverySectionIds": [
        "ex-nominal"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "cn02",
          "sectionId": "relacao"
        }
      ]
    },
    {
      "id": "cnr.q04",
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
      ],
      "recoverySectionIds": [
        "ex-nominal"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "cn02",
          "sectionId": "ex-caderno"
        }
      ]
    },
    {
      "id": "cnr.q05",
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
      ],
      "recoverySectionIds": [
        "ex-especial"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "cn03",
          "sectionId": "ex-existencia"
        }
      ]
    },
    {
      "id": "cnr.q06",
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
      ],
      "recoverySectionIds": [
        "ex-especial"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "cn03",
          "sectionId": "fazer"
        }
      ]
    },
    {
      "id": "cnr.q07",
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
      ],
      "recoverySectionIds": [
        "recuperacao"
      ],
      "objectiveIds": [
        "O4"
      ],
      "originRefs": [
        {
          "unit": "cn01",
          "sectionId": "ex-nucleo"
        }
      ]
    },
    {
      "id": "cnr.q08",
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
      ],
      "recoverySectionIds": [
        "recuperacao"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "cn02",
          "sectionId": "ex-lista"
        }
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "cnr-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "cnr.q01": [
        {
          "missionId": "draft.cnr",
          "sectionId": "ex-verbal"
        }
      ],
      "cnr.q02": [
        {
          "missionId": "draft.cnr",
          "sectionId": "ex-verbal"
        }
      ],
      "cnr.q03": [
        {
          "missionId": "draft.cnr",
          "sectionId": "ex-nominal"
        }
      ],
      "cnr.q04": [
        {
          "missionId": "draft.cnr",
          "sectionId": "ex-nominal"
        }
      ],
      "cnr.q05": [
        {
          "missionId": "draft.cnr",
          "sectionId": "ex-especial"
        }
      ],
      "cnr.q06": [
        {
          "missionId": "draft.cnr",
          "sectionId": "ex-especial"
        }
      ],
      "cnr.q07": [
        {
          "missionId": "draft.cnr",
          "sectionId": "recuperacao"
        }
      ],
      "cnr.q08": [
        {
          "missionId": "draft.cnr",
          "sectionId": "recuperacao"
        }
      ]
    }
  }
};
export const EDITORIAL = {
  "stage": "Rascunho local fora do catálogo; parecer pedagógico independente aprovado no recorte introdutório",
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
