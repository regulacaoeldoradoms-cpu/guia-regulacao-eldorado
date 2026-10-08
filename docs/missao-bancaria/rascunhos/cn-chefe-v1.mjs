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
export const CNCHEFE_DRAFT = {
  "id": "draft.cnchefe",
  "topicId": "draft.cnchefe",
  "editorialKey": "CN-CHEFE",
  "candidateBlockId": "portuguese.syntax",
  "title": "Chefe: justificar concordância pelo termo controlador",
  "contentVersion": 1,
  "kind": "boss",
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
        "senado.concordancia",
        "incaper.nominal"
      ]
    },
    {
      "id": "exemplo",
      "heading": "3. Exemplo resolvido: estrutura preservada",
      "body": "O resumo das aulas ficou pronto: resumo controla ficou e é caracterizado por pronto. As aulas não controlam essas formas. Compare Os resumos da aula ficaram prontos: agora resumos é plural e ambos os vínculos se ajustam. A mudança foi do núcleo, sem alterar o contexto passado.",
      "type": "worked-example",
      "sourceIds": [
        "senado.concordancia",
        "incaper.nominal"
      ]
    },
    {
      "id": "retomadas",
      "heading": "4. Consultar o ensino",
      "body": "[CN-01](cn-01-v1.md) · [CN-02](cn-02-v1.md) · [CN-03](cn-03-v1.md) · [CN-R](cn-r-v1.md)",
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
      "id": "cnchefe.q01",
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
      ],
      "recoverySectionIds": [
        "exemplo"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "cn01",
          "sectionId": "nucleo"
        }
      ],
      "groupId": "nucleo"
    },
    {
      "id": "cnchefe.q02",
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
      ],
      "recoverySectionIds": [
        "vinculos"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "cn01",
          "sectionId": "ex-plural"
        }
      ],
      "groupId": "nucleo"
    },
    {
      "id": "cnchefe.q03",
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
      ],
      "recoverySectionIds": [
        "vinculos"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "cn01",
          "sectionId": "pessoa"
        }
      ],
      "groupId": "pessoa"
    },
    {
      "id": "cnchefe.q04",
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
      ],
      "recoverySectionIds": [
        "vinculos"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "cn01",
          "sectionId": "pessoa"
        }
      ],
      "groupId": "pessoa"
    },
    {
      "id": "cnchefe.q05",
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
      ],
      "recoverySectionIds": [
        "vinculos"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "cn02",
          "sectionId": "ex-lista"
        }
      ],
      "groupId": "nominal"
    },
    {
      "id": "cnchefe.q06",
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
      ],
      "recoverySectionIds": [
        "vinculos"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "cn02",
          "sectionId": "ex-vinculo"
        }
      ],
      "groupId": "nominal"
    },
    {
      "id": "cnchefe.q07",
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
      ],
      "recoverySectionIds": [
        "vinculos"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "cn03",
          "sectionId": "entrada"
        }
      ],
      "groupId": "composto"
    },
    {
      "id": "cnchefe.q08",
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
      ],
      "recoverySectionIds": [
        "recuperacao"
      ],
      "objectiveIds": [
        "O4"
      ],
      "originRefs": [
        {
          "unit": "cn03",
          "sectionId": "entrada"
        }
      ],
      "groupId": "composto"
    },
    {
      "id": "cnchefe.q09",
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
      ],
      "recoverySectionIds": [
        "vinculos"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "cn03",
          "sectionId": "ex-existencia"
        }
      ],
      "groupId": "existencia"
    },
    {
      "id": "cnchefe.q10",
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
      ],
      "recoverySectionIds": [
        "vinculos"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "cn03",
          "sectionId": "haver"
        }
      ],
      "groupId": "existencia"
    },
    {
      "id": "cnchefe.q11",
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
      ],
      "recoverySectionIds": [
        "vinculos"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "cn03",
          "sectionId": "fazer"
        }
      ],
      "groupId": "tempo"
    },
    {
      "id": "cnchefe.q12",
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
      ],
      "recoverySectionIds": [
        "recuperacao"
      ],
      "objectiveIds": [
        "O4"
      ],
      "originRefs": [
        {
          "unit": "cn03",
          "sectionId": "ex-tempo"
        }
      ],
      "groupId": "tempo"
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "cnchefe-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "cnchefe.q01": [
        {
          "missionId": "draft.cnchefe",
          "sectionId": "exemplo"
        },
        {
          "missionId": "draft.cn01",
          "sectionId": "nucleo"
        }
      ],
      "cnchefe.q02": [
        {
          "missionId": "draft.cnchefe",
          "sectionId": "vinculos"
        },
        {
          "missionId": "draft.cn01",
          "sectionId": "ex-plural"
        }
      ],
      "cnchefe.q03": [
        {
          "missionId": "draft.cnchefe",
          "sectionId": "vinculos"
        },
        {
          "missionId": "draft.cn01",
          "sectionId": "pessoa"
        }
      ],
      "cnchefe.q04": [
        {
          "missionId": "draft.cnchefe",
          "sectionId": "vinculos"
        },
        {
          "missionId": "draft.cn01",
          "sectionId": "pessoa"
        }
      ],
      "cnchefe.q05": [
        {
          "missionId": "draft.cnchefe",
          "sectionId": "vinculos"
        },
        {
          "missionId": "draft.cn02",
          "sectionId": "ex-lista"
        }
      ],
      "cnchefe.q06": [
        {
          "missionId": "draft.cnchefe",
          "sectionId": "vinculos"
        },
        {
          "missionId": "draft.cn02",
          "sectionId": "ex-vinculo"
        }
      ],
      "cnchefe.q07": [
        {
          "missionId": "draft.cnchefe",
          "sectionId": "vinculos"
        },
        {
          "missionId": "draft.cn03",
          "sectionId": "entrada"
        }
      ],
      "cnchefe.q08": [
        {
          "missionId": "draft.cnchefe",
          "sectionId": "recuperacao"
        },
        {
          "missionId": "draft.cn03",
          "sectionId": "entrada"
        }
      ],
      "cnchefe.q09": [
        {
          "missionId": "draft.cnchefe",
          "sectionId": "vinculos"
        },
        {
          "missionId": "draft.cn03",
          "sectionId": "ex-existencia"
        }
      ],
      "cnchefe.q10": [
        {
          "missionId": "draft.cnchefe",
          "sectionId": "vinculos"
        },
        {
          "missionId": "draft.cn03",
          "sectionId": "haver"
        }
      ],
      "cnchefe.q11": [
        {
          "missionId": "draft.cnchefe",
          "sectionId": "vinculos"
        },
        {
          "missionId": "draft.cn03",
          "sectionId": "fazer"
        }
      ],
      "cnchefe.q12": [
        {
          "missionId": "draft.cnchefe",
          "sectionId": "recuperacao"
        },
        {
          "missionId": "draft.cn03",
          "sectionId": "ex-tempo"
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
  ],
  "groups": [
    {
      "id": "nucleo",
      "label": "Sujeito e núcleo",
      "units": [
        "cn01"
      ]
    },
    {
      "id": "pessoa",
      "label": "Pessoa/número",
      "units": [
        "cn01"
      ]
    },
    {
      "id": "nominal",
      "label": "Vínculo nominal",
      "units": [
        "cn02"
      ]
    },
    {
      "id": "composto",
      "label": "Dois núcleos anteriores",
      "units": [
        "cn03"
      ]
    },
    {
      "id": "existencia",
      "label": "Haver/existir",
      "units": [
        "cn03"
      ]
    },
    {
      "id": "tempo",
      "label": "Fazer temporal",
      "units": [
        "cn03"
      ]
    }
  ]
};
export const ARITHMETIC = [];
