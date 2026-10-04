// Ensino e exemplos autorais; rascunho local desativado.
export const SOURCES = [
  {
    "id": "senado.crase",
    "label": "Senado Federal - Manual de Comunicação: crase",
    "url": "https://www12.senado.leg.br/manualdecomunicacao/estilos/crase",
    "version": "HTML consultado em04/10/2026; recorte introdutório delimitado",
    "checkedAt": "2026-10-04",
    "locator": "Definição; Use crase1/3/4 e ressalva de clareza; Não ocorre1/2/3. Não cobrar casos facultativos/nomes próprios/paralelismo geral."
  },
  {
    "id": "senado.assistir",
    "label": "Senado Federal - Manual de Comunicação: assistir",
    "url": "https://www12.senado.leg.br/manualdecomunicacao/estilos/assistir",
    "version": "Uso presenciar já verificado no lote RG em04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "Presenciar/estar presente: complemento com preposição a, reutilizado de RG02"
  }
];
export const CRCHEFE_DRAFT = {
  "id": "draft.crchefe",
  "topicId": "draft.crchefe",
  "editorialKey": "CR-CHEFE",
  "candidateBlockId": "portuguese.syntax",
  "title": "Crase: Chefe introdutório",
  "contentVersion": 1,
  "kind": "boss",
  "publication": {
    "status": "draft"
  },
  "objective": "Reconhecer e justificar o sinal grave nos encontros e expressões explicitamente ensinados, distinguindo condições e limites.",
  "sourceIds": [
    "senado.crase",
    "senado.assistir"
  ],
  "sections": [
    {
      "id": "encontro",
      "heading": "1. Recuperação: encontro definido",
      "body": "CR01: no padrão de presenciar, a liga o complemento; artigo definido a/as fornece o outro elemento. A+a=à, a+as=às. Compare ao somente preservando vínculo e artigo.",
      "type": "explanation",
      "sourceIds": [
        "senado.crase"
      ]
    },
    {
      "id": "ausencia",
      "heading": "2. Recuperação: sem segundo elemento",
      "body": "CR02: infinitivo, artigo uma e plural sem artigo não fornecem o artigo a/as do encontro. A preposição pode continuar presente, sem sinal grave. Não acentuar à antes de plural nem proibir todo às.",
      "type": "explanation",
      "sourceIds": [
        "senado.crase"
      ]
    },
    {
      "id": "demonstrativo",
      "heading": "3. Recuperação: apontar e vincular",
      "body": "CR03: preposição a com aquele/aquela/aquilo produz o encontro; sem essa preposição no sujeito dado, conserva-se aquele/aquela. Nome masculino depois de aquele não impede o encontro.",
      "type": "explanation",
      "sourceIds": [
        "senado.crase"
      ]
    },
    {
      "id": "locucoes",
      "heading": "4. Recuperação: expressões delimitadas",
      "body": "Às vezes indica ocasionalmente; às pressas indica modo apressado; à tarde, período. O manual registra sinal por clareza em à tarde; não explicar todo sinal como fusão literal com artigo.",
      "type": "explanation",
      "sourceIds": [
        "senado.crase"
      ]
    },
    {
      "id": "ex-chefe",
      "heading": "5. Exemplo resolvido: justificar antes de responder",
      "body": "O grupo assistiu à mostra indicada: presenciar fornece a, o grupo definido fornece artigo a. Em começou a preparar, preparar é infinitivo e não fornece esse artigo. Compare elementos, não apenas aparência feminina ou comprimento.",
      "type": "worked-example",
      "sourceIds": [
        "senado.crase"
      ]
    },
    {
      "id": "retomadas",
      "heading": "6. Consultar recuperação",
      "body": "[CR-01](cr-01-v1.md) · [CR-02](cr-02-v1.md) · [CR-03](cr-03-v1.md) · [CR-R](cr-r-v1.md)",
      "type": "explanation",
      "sourceIds": [
        "senado.crase"
      ]
    },
    {
      "id": "glossario",
      "heading": "Vocabulário de apoio",
      "body": "Preposição liga termos; artigo acompanha o substantivo. Crase é a fusão ensinada; acento grave é o sinal escrito em à/às. Infinitivo é forma como ler/organizar. Demonstrativo aponta algo, como aquele. Locução é grupo de palavras com função conjunta; neste recorte só se aplicam às vezes, às pressas e à tarde. O sinal grave em certas locuções pode ter função de clareza, sem uma fusão literal com artigo.",
      "type": "glossary",
      "sourceIds": [
        "senado.crase"
      ]
    },
    {
      "id": "recuperacao",
      "heading": "Recuperar pelo vínculo, não pela aparência",
      "body": "Releia a seção indicada e identifique o caso: encontro a+a; ausência de artigo ou preposição; demonstrativo; locução ensinada. Se usar comparação ao, mantenha o vínculo e o sentido. Justifique o sinal ou sua ausência, sem generalizar para todos os nomes femininos.",
      "type": "summary",
      "sourceIds": [
        "senado.crase"
      ]
    }
  ],
  "recall": [
    "Há preposição a e qual elemento a segue?",
    "A comparação preserva o vínculo e o sentido?",
    "É encontro de elementos ou locução ensinada?"
  ],
  "questions": [
    {
      "id": "crchefe.q01",
      "prompt": "O enunciado dá presenciar e artigo definido para mostra. Qual escrita representa o vínculo e o encontro?",
      "options": [
        "O grupo assistiu por mostra indicada.",
        "O grupo assistiu a mostra indicada, sem representar o encontro dado.",
        "O grupo assistiu à mostra indicada.",
        "O grupo assistiu à uma mostra indicada."
      ],
      "answer": 2,
      "explanation": "Preposição a e artigo a se encontram em à.",
      "optionRationales": [
        "Por não é o vínculo ensinado.",
        "O caso explicitou o artigo e a preposição.",
        "Preposição a e artigo a se encontram em à.",
        "Uma não compõe a+a."
      ],
      "recoverySectionIds": [
        "encontro"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "cr01",
          "sectionId": "encontro"
        }
      ],
      "groupId": "G1"
    },
    {
      "id": "crchefe.q02",
      "prompt": "Para justificar à no caso a+a com artigo, qual procedimento é adequado?",
      "options": [
        "Identificar separadamente a preposição do vínculo e o artigo do grupo.",
        "Contar apenas palavras femininas.",
        "Procurar um acento agudo no verbo.",
        "Assumir que todo complemento tem artigo a."
      ],
      "answer": 0,
      "explanation": "As duas condições da estrutura precisam ser verificadas.",
      "optionRationales": [
        "As duas condições da estrutura precisam ser verificadas.",
        "Gênero sozinho não fornece ambos.",
        "Agudo no verbo não decide crase.",
        "Os complementos podem ter outros artigos ou nenhum."
      ],
      "recoverySectionIds": [
        "encontro"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "cr01",
          "sectionId": "ex-encontro"
        }
      ],
      "groupId": "G1"
    },
    {
      "id": "crchefe.q03",
      "prompt": "Qual escrita representa presenciar com artigo as em exposições selecionadas?",
      "options": [
        "Assistiu de exposições selecionadas.",
        "Assistiu à exposições selecionadas.",
        "Assistiu ao exposições selecionadas.",
        "Assistiu às exposições selecionadas."
      ],
      "answer": 3,
      "explanation": "A+as resulta em às no grupo definido dado.",
      "optionRationales": [
        "De não corresponde ao vínculo dado.",
        "À singular não representa as.",
        "Ao contém o, incompatível com esse grupo.",
        "A+as resulta em às no grupo definido dado."
      ],
      "recoverySectionIds": [
        "encontro"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "cr01",
          "sectionId": "plural"
        }
      ],
      "groupId": "G2"
    },
    {
      "id": "crchefe.q04",
      "prompt": "O caso usa exposições sem artigo: assistiu a exposições variadas. Qual explicação está correta?",
      "options": [
        "A é artigo plural as.",
        "A é preposição, sem artigo para fusão neste grupo.",
        "O plural sempre exige às.",
        "A é o núcleo do sujeito."
      ],
      "answer": 1,
      "explanation": "O caso excluiu o artigo; o vínculo mantém a.",
      "optionRationales": [
        "A singular não é artigo as.",
        "O caso excluiu o artigo; o vínculo mantém a.",
        "Plural sozinho não impõe artigo.",
        "A não é núcleo do sujeito."
      ],
      "recoverySectionIds": [
        "ausencia"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "cr02",
          "sectionId": "plural"
        }
      ],
      "groupId": "G2"
    },
    {
      "id": "crchefe.q05",
      "prompt": "Em começou a preparar o roteiro, que escrita e razão seguem o caso ensinado?",
      "options": [
        "À preparar, porque todo verbo tem artigo a.",
        "A preparar, porque preparar é infinitivo sem artigo feminino a.",
        "Às preparar, porque roteiro é masculino.",
        "Ao preparar, como substituição obrigatória nesse vínculo."
      ],
      "answer": 1,
      "explanation": "Não há encontro a+a diante do infinitivo dado.",
      "optionRationales": [
        "Verbo nesse caso não recebe esse artigo.",
        "Não há encontro a+a diante do infinitivo dado.",
        "Gênero de roteiro não cria as diante do verbo.",
        "Ao não é substituição obrigatória no caso."
      ],
      "recoverySectionIds": [
        "ausencia"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "cr02",
          "sectionId": "infinitivo"
        }
      ],
      "groupId": "G3"
    },
    {
      "id": "crchefe.q06",
      "prompt": "O enunciado exige conservar artigo uma em assistiu a uma mostra. Qual análise é pertinente?",
      "options": [
        "Assistir perdeu o sentido só porque aparece uma.",
        "Uma deve virar artigo a sem mudar a determinação.",
        "O sinal grave é obrigatório antes de todo uma.",
        "A preposição a não se funde com o artigo uma como a+a."
      ],
      "answer": 3,
      "explanation": "A preposição permanece e uma é artigo diferente de a.",
      "optionRationales": [
        "O sentido de presenciar pode ser mantido.",
        "Trocar artigo modifica o grupo dado.",
        "Uma não fornece o segundo a.",
        "A preposição permanece e uma é artigo diferente de a."
      ],
      "recoverySectionIds": [
        "ausencia"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "cr02",
          "sectionId": "uma"
        }
      ],
      "groupId": "G3"
    },
    {
      "id": "crchefe.q07",
      "prompt": "O grupo presenciou aquele encontro. Seguindo o padrão com preposição a, qual escrita representa esse demonstrativo?",
      "options": [
        "Assistiu àquele encontro.",
        "Assistiu aquele encontro, sem representar a preposição dada.",
        "Assistiu à aquele encontro.",
        "Assistiu às aquele encontro."
      ],
      "answer": 0,
      "explanation": "A se encontra com o início de aquele.",
      "optionRationales": [
        "A se encontra com o início de aquele.",
        "A condição explicitada precisa ser representada.",
        "Não se escreve à separado nesse encontro.",
        "As não corresponde ao demonstrativo."
      ],
      "recoverySectionIds": [
        "demonstrativo"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "cr03",
          "sectionId": "demonstrativo"
        }
      ],
      "groupId": "G4"
    },
    {
      "id": "crchefe.q08",
      "prompt": "Em Aquela exposição terminou, por que não se marca o encontro no demonstrativo do sujeito?",
      "options": [
        "Porque todo sujeito deve usar àquela.",
        "Porque exposição deixou de ser feminina.",
        "Não há preposição a nesse grupo sujeito.",
        "Porque todo verbo no passado proíbe qualquer à."
      ],
      "answer": 2,
      "explanation": "O sujeito dado não tem a preposição necessária ao encontro.",
      "optionRationales": [
        "Sujeito não recebe automaticamente a preposição.",
        "Exposição continua feminina.",
        "O sujeito dado não tem a preposição necessária ao encontro.",
        "Tempo passado não é a regra."
      ],
      "recoverySectionIds": [
        "demonstrativo"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "cr03",
          "sectionId": "contraste"
        }
      ],
      "groupId": "G4"
    },
    {
      "id": "crchefe.q09",
      "prompt": "Na frase Às vezes a equipe retoma o roteiro, qual interpretação corresponde à expressão ensinada?",
      "options": [
        "A frase informa artigo masculino do roteiro.",
        "A retomada ocorre sempre, sem exceção.",
        "A retomada é obrigatoriamente apressada.",
        "A retomada ocorre ocasionalmente."
      ],
      "answer": 3,
      "explanation": "Às vezes expressa ocorrência ocasional.",
      "optionRationales": [
        "Não se trata de artigo masculino.",
        "Não significa sempre.",
        "Modo apressado seria às pressas.",
        "Às vezes expressa ocorrência ocasional."
      ],
      "recoverySectionIds": [
        "locucoes"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "cr03",
          "sectionId": "locucoes"
        }
      ],
      "groupId": "G5"
    },
    {
      "id": "crchefe.q10",
      "prompt": "Em A equipe revisou à tarde e concluiu às pressas, qual leitura conserva os sentidos ensinados?",
      "options": [
        "À tarde significa sempre; às pressas significa raramente.",
        "À tarde indica período; às pressas indica modo apressado.",
        "Ambas são obrigatoriamente artigos do mesmo nome.",
        "Às pressas indica o período da tarde."
      ],
      "answer": 1,
      "explanation": "As duas expressões têm funções e sentidos distintos no exemplo.",
      "optionRationales": [
        "Esses sentidos não foram ensinados.",
        "As duas expressões têm funções e sentidos distintos no exemplo.",
        "Não são artigos do mesmo nome.",
        "Modo apressado não é período."
      ],
      "recoverySectionIds": [
        "locucoes"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "cr03",
          "sectionId": "ex-locucoes"
        }
      ],
      "groupId": "G5"
    },
    {
      "id": "crchefe.q11",
      "prompt": "Por que não basta proibir sinal grave diante de toda grafia masculina?",
      "options": [
        "Porque todo artigo o vira a.",
        "Porque qualquer palavra masculina exige à.",
        "A+aquele pode produzir àquele antes de nome masculino, como debate.",
        "Porque a preposição a só aparece em sujeitos."
      ],
      "answer": 2,
      "explanation": "O encontro pode ocorrer no demonstrativo, não no gênero do nome seguinte.",
      "optionRationales": [
        "O artigo o não vira a automaticamente.",
        "Isso também é uma generalização falsa.",
        "O encontro pode ocorrer no demonstrativo, não no gênero do nome seguinte.",
        "A pode ligar complemento ao verbo."
      ],
      "recoverySectionIds": [
        "demonstrativo"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "cr03",
          "sectionId": "ex-aquele"
        }
      ],
      "groupId": "G6"
    },
    {
      "id": "crchefe.q12",
      "prompt": "Você usou apenas o gênero feminino para justificar sinais em todos os itens. Qual recuperação é adequada?",
      "options": [
        "Separar encontro/artigo, ausência de elemento, demonstrativo e locuções do recorte.",
        "Repetir o critério sem reler as condições.",
        "Retirar todo sinal para uniformizar.",
        "Aplicar casos facultativos não ensinados a todos os exemplos."
      ],
      "answer": 0,
      "explanation": "O recorte pede identificar a condição específica e seus limites.",
      "optionRationales": [
        "O recorte pede identificar a condição específica e seus limites.",
        "O erro está justamente na generalização.",
        "Isso apagaria sinais exigidos nos casos dados.",
        "Os casos facultativos estão fora deste recorte."
      ],
      "recoverySectionIds": [
        "recuperacao"
      ],
      "objectiveIds": [
        "O4"
      ],
      "originRefs": [
        {
          "unit": "cr01",
          "sectionId": "limites"
        }
      ],
      "groupId": "G6"
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "crchefe-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "crchefe.q01": [
        {
          "missionId": "draft.crchefe",
          "sectionId": "encontro"
        },
        {
          "missionId": "draft.cr01",
          "sectionId": "encontro"
        }
      ],
      "crchefe.q02": [
        {
          "missionId": "draft.crchefe",
          "sectionId": "encontro"
        },
        {
          "missionId": "draft.cr01",
          "sectionId": "ex-encontro"
        }
      ],
      "crchefe.q03": [
        {
          "missionId": "draft.crchefe",
          "sectionId": "encontro"
        },
        {
          "missionId": "draft.cr01",
          "sectionId": "plural"
        }
      ],
      "crchefe.q04": [
        {
          "missionId": "draft.crchefe",
          "sectionId": "ausencia"
        },
        {
          "missionId": "draft.cr02",
          "sectionId": "plural"
        }
      ],
      "crchefe.q05": [
        {
          "missionId": "draft.crchefe",
          "sectionId": "ausencia"
        },
        {
          "missionId": "draft.cr02",
          "sectionId": "infinitivo"
        }
      ],
      "crchefe.q06": [
        {
          "missionId": "draft.crchefe",
          "sectionId": "ausencia"
        },
        {
          "missionId": "draft.cr02",
          "sectionId": "uma"
        }
      ],
      "crchefe.q07": [
        {
          "missionId": "draft.crchefe",
          "sectionId": "demonstrativo"
        },
        {
          "missionId": "draft.cr03",
          "sectionId": "demonstrativo"
        }
      ],
      "crchefe.q08": [
        {
          "missionId": "draft.crchefe",
          "sectionId": "demonstrativo"
        },
        {
          "missionId": "draft.cr03",
          "sectionId": "contraste"
        }
      ],
      "crchefe.q09": [
        {
          "missionId": "draft.crchefe",
          "sectionId": "locucoes"
        },
        {
          "missionId": "draft.cr03",
          "sectionId": "locucoes"
        }
      ],
      "crchefe.q10": [
        {
          "missionId": "draft.crchefe",
          "sectionId": "locucoes"
        },
        {
          "missionId": "draft.cr03",
          "sectionId": "ex-locucoes"
        }
      ],
      "crchefe.q11": [
        {
          "missionId": "draft.crchefe",
          "sectionId": "demonstrativo"
        },
        {
          "missionId": "draft.cr03",
          "sectionId": "ex-aquele"
        }
      ],
      "crchefe.q12": [
        {
          "missionId": "draft.crchefe",
          "sectionId": "recuperacao"
        },
        {
          "missionId": "draft.cr01",
          "sectionId": "limites"
        }
      ]
    }
  }
};
export const EDITORIAL = {
  "stage": "Rascunho local fora do catálogo; parecer pedagógico independente favorável, sem correções necessárias",
  "objectives": {
    "O1": "Identificar elementos e vínculo no contexto.",
    "O2": "Aplicar o sinal ou sua ausência no caso ensinado.",
    "O3": "Reconhecer limites e evitar regras universais.",
    "O4": "Retomar a condição ignorada e justificar a correção."
  },
  "recovery": {
    "objectiveId": "O4",
    "instruction": "Retomar encontro/ausência/demonstrativo/locução pelo caso e justificar a escrita."
  },
  "limits": [
    "Plano05 e bloco portuguese.syntax existente; base RG/CN/CF preservada. BB/CAIXA históricos/referenceOnly. Não abre fase formal nem completa edital.",
    "Exemplos e questões autorais/fictícios; orientações primárias pertinentes verificadas antes da autoria, sem copiar exemplos institucionais.",
    "Recorte: a+a com artigo, ausência diante de infinitivo/uma e a singular antes de plural sem artigo, demonstrativos aquele/aquela/aquilo, três locuções ensinadas.",
    "Não cobrar nomes geográficos/próprios, possessivos/casos facultativos, relativas, horas, distância, casa/terra, moda subentendida ou paralelismo completo.",
    "Sem produção/D1/push/ativação/merge/deploy. ReviewStatus human-review-pending não comprova aceite humano ou retenção."
  ],
  "groups": [
    {
      "id": "G1",
      "label": "Encontro definido",
      "units": [
        "cr01"
      ]
    },
    {
      "id": "G2",
      "label": "Plural e comparação",
      "units": [
        "cr01",
        "cr02"
      ]
    },
    {
      "id": "G3",
      "label": "Infinitivo e uma",
      "units": [
        "cr02"
      ]
    },
    {
      "id": "G4",
      "label": "Demonstrativos",
      "units": [
        "cr03"
      ]
    },
    {
      "id": "G5",
      "label": "Locuções e sentido",
      "units": [
        "cr03"
      ]
    },
    {
      "id": "G6",
      "label": "Limites e recuperação",
      "units": [
        "cr01",
        "cr03"
      ]
    }
  ]
};
export const ARITHMETIC = [];
