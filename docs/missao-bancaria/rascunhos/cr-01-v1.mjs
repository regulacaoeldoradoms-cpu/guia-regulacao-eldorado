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
export const CR01_DRAFT = {
  "id": "draft.cr01",
  "topicId": "draft.cr01",
  "editorialKey": "CR-01",
  "candidateBlockId": "portuguese.syntax",
  "title": "Crase: reconhecer o encontro antes do sinal",
  "contentVersion": 1,
  "kind": "lesson",
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
      "id": "entrada",
      "heading": "1. Da regência ao sinal",
      "body": "RG separou preposição e artigo. Crase, neste primeiro caso, é o encontro da preposição a com artigo a/as; o sinal que indica esse encontro é o acento grave: a+a=à e a+as=às. Não confundir o fenômeno com o sinal nem com acento agudo. Outros encontros e certas locuções serão ensinados em CR03.",
      "type": "explanation",
      "sourceIds": [
        "senado.crase"
      ]
    },
    {
      "id": "encontro",
      "heading": "2. Duas condições juntas",
      "body": "No exemplo O grupo assistiu à apresentação, assistir significa presenciar e pede a no padrão já ensinado em RG02. O contexto usa a apresentação definida, com artigo a: a+a=à. Dizer apenas que apresentação é feminina não basta: é preciso o vínculo com a e o artigo. Não aplicar esta regra a qualquer palavra feminina.",
      "type": "explanation",
      "sourceIds": [
        "senado.crase"
      ]
    },
    {
      "id": "comparar",
      "heading": "3. Comparação masculina controlada",
      "body": "Mantendo assistir no sentido de presenciar e o complemento definido, compare assistiu à apresentação e assistiu ao debate. Ao reúne a+o e ajuda a reconhecer preposição e artigo. A comparação só ajuda se preservar vínculo, sentido e uso de artigo; não substitui a análise nem decide qualquer caso de crase sozinha.",
      "type": "explanation",
      "sourceIds": [
        "senado.crase"
      ]
    },
    {
      "id": "plural",
      "heading": "4. Plural definido",
      "body": "O grupo assistiu às apresentações indicadas: neste exemplo o complemento tem artigo as. A preposição a encontra as e forma às. O plural do nome não cria o sinal automaticamente; a combinação e a determinação do grupo precisam ser verificadas. A ausência de artigo será retomada em CR02.",
      "type": "explanation",
      "sourceIds": [
        "senado.crase"
      ]
    },
    {
      "id": "ex-encontro",
      "heading": "5. Exemplo resolvido: a apresentação definida",
      "body": "O enunciado informa uma apresentação específica e usa artigo. Em A aluna assistiu à apresentação indicada, presenciar exige a conforme RG02; apresentação vem com a. Junte os dois e escreva à. Se apagasse a preposição, perderia a orientação ensinada; se apagasse o artigo, mudaria a determinação.",
      "type": "worked-example",
      "sourceIds": [
        "senado.crase"
      ]
    },
    {
      "id": "ex-comparar",
      "heading": "6. Exemplo resolvido: debate e oficina",
      "body": "O grupo assistiu ao debate e, no mesmo sentido, à oficina indicada. Ao sinaliza a+o; à sinaliza a+a. A comparação conserva presenciar e os complementos definidos. A frase não ensina que todo substantivo feminino tenha crase nem que a oficina seja sempre precedida por a.",
      "type": "worked-example",
      "sourceIds": [
        "senado.crase"
      ]
    },
    {
      "id": "ex-plural",
      "heading": "7. Exemplo resolvido: apresentações definidas",
      "body": "A equipe assistiu às apresentações selecionadas: a é preposição ligada ao verbo; as é artigo do grupo plural. A+as=às. Não escrever à apresentações, pois esse sinal singular não representa o artigo as usado no caso.",
      "type": "worked-example",
      "sourceIds": [
        "senado.crase"
      ]
    },
    {
      "id": "limites",
      "heading": "8. O que não concluir",
      "body": "Crase não é simples sinônimo de palavra feminina. O encontro a+a depende da estrutura e do artigo. Há demonstrativos e locuções com sinal grave, ensinados depois; não afirmar que só femininos podem recebê-lo. Neste lote não se cobram casos facultativos ou todas as regências.",
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
      "id": "cr01.q01",
      "prompt": "No caso ensinado, de quais elementos resulta à em assistiu à apresentação definida?",
      "options": [
        "Dois verbos no infinitivo.",
        "Preposição a e artigo a.",
        "Artigo o e substantivo.",
        "Somente uma letra feminina."
      ],
      "answer": 1,
      "explanation": "O vínculo exige a e o grupo definido tem artigo a; a+a=à.",
      "optionRationales": [
        "Não são dois verbos.",
        "O vínculo exige a e o grupo definido tem artigo a; a+a=à.",
        "O artigo deste grupo é a, não o.",
        "É preciso identificar dois elementos, não classificar a letra."
      ],
      "recoverySectionIds": [
        "encontro"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "cr01.q02",
      "prompt": "Qual sinal escrito indica o encontro em à e às neste recorte?",
      "options": [
        "Apóstrofo.",
        "Acento agudo.",
        "Til.",
        "Acento grave."
      ],
      "answer": 3,
      "explanation": "O encontro ensinado é indicado por acento grave.",
      "optionRationales": [
        "Apóstrofo não é o sinal usado.",
        "Agudo não é o sinal em à.",
        "Til não marca esse encontro.",
        "O encontro ensinado é indicado por acento grave."
      ],
      "recoverySectionIds": [
        "entrada"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "cr01.q03",
      "prompt": "O grupo presenciou uma apresentação específica, com artigo definido. No padrão de RG02, qual escrita representa a+a?",
      "options": [
        "Assistiu à apresentação indicada.",
        "Assistiu a apresentação indicada, omitindo a fusão no caso dado.",
        "Assistiu de apresentação indicada.",
        "Assistiu por apresentação indicada."
      ],
      "answer": 0,
      "explanation": "No caso dado há preposição a e artigo a, formando à.",
      "optionRationales": [
        "No caso dado há preposição a e artigo a, formando à.",
        "O caso explicitou os dois elementos e exige representar seu encontro.",
        "De não é a preposição ensinada para presenciar.",
        "Por não corresponde ao vínculo ensinado."
      ],
      "recoverySectionIds": [
        "ex-encontro"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "cr01.q04",
      "prompt": "A comparação assistiu ao debate / assistiu à oficina ajuda por qual motivo, nas condições dadas?",
      "options": [
        "Ao é apenas o artigo o.",
        "Qualquer troca de palavra resolve toda crase.",
        "Ao mostra a+o, mantendo o sentido de presenciar e artigo definido.",
        "Todo nome feminino exige à."
      ],
      "answer": 2,
      "explanation": "A comparação preserva vínculo/sentido/artigo e evidencia os elementos.",
      "optionRationales": [
        "Ao inclui a preposição a.",
        "A comparação é condicionada, não universal.",
        "A comparação preserva vínculo/sentido/artigo e evidencia os elementos.",
        "Feminino sozinho não basta."
      ],
      "recoverySectionIds": [
        "comparar"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "cr01.q05",
      "prompt": "As apresentações selecionadas têm artigo as; o grupo as presenciou. Qual combinação foi ensinada?",
      "options": [
        "Assistiu de apresentações selecionadas.",
        "Assistiu à apresentações selecionadas.",
        "Assistiu ao apresentações selecionadas.",
        "Assistiu às apresentações selecionadas."
      ],
      "answer": 3,
      "explanation": "Preposição a com artigo as resulta em às.",
      "optionRationales": [
        "De não representa o vínculo do caso.",
        "À singular não representa as.",
        "Ao contém o, não as.",
        "Preposição a com artigo as resulta em às."
      ],
      "recoverySectionIds": [
        "plural"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "cr01.q06",
      "prompt": "O estudante escreveu à porque a palavra era feminina, sem verificar o vínculo. Que recuperação é pertinente?",
      "options": [
        "Adicionar sinal grave a todos os substantivos.",
        "Identificar a preposição e verificar se o grupo tem artigo.",
        "Contar apenas as sílabas.",
        "Trocar o tempo verbal sem analisar o complemento."
      ],
      "answer": 1,
      "explanation": "As duas condições precisam ser verificadas no caso a+a.",
      "optionRationales": [
        "Não existe essa regra para todo substantivo.",
        "As duas condições precisam ser verificadas no caso a+a.",
        "Sílabas não estabelecem esses elementos.",
        "Trocar tempo não resolve o vínculo."
      ],
      "recoverySectionIds": [
        "recuperacao"
      ],
      "objectiveIds": [
        "O4"
      ]
    },
    {
      "id": "cr01.q07",
      "prompt": "Qual afirmação evita generalizar este primeiro caso?",
      "options": [
        "Crase e acento agudo são iguais.",
        "Só o gênero do nome decide.",
        "A condição a+a não autoriza acentuar qualquer palavra feminina.",
        "Toda frase longa exige às."
      ],
      "answer": 2,
      "explanation": "A estrutura e o artigo também importam.",
      "optionRationales": [
        "O sinal em à é grave.",
        "Gênero sozinho não resolve.",
        "A estrutura e o artigo também importam.",
        "Comprimento não determina crase."
      ],
      "recoverySectionIds": [
        "limites"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "cr01.q08",
      "prompt": "Em assistiu ao debate, no mesmo sentido dado, quais elementos estão em ao?",
      "options": [
        "Preposição a e artigo o.",
        "Preposição de e artigo a.",
        "Dois artigos a.",
        "Apenas o verbo assistir."
      ],
      "answer": 0,
      "explanation": "Ao resulta de a+o no complemento definido masculino.",
      "optionRationales": [
        "Ao resulta de a+o no complemento definido masculino.",
        "Esses elementos não compõem ao.",
        "Não há dois artigos a.",
        "Ao não é verbo."
      ],
      "recoverySectionIds": [
        "ex-comparar"
      ],
      "objectiveIds": [
        "O1"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "cr01-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "cr01.q01": [
        {
          "missionId": "draft.cr01",
          "sectionId": "encontro"
        }
      ],
      "cr01.q02": [
        {
          "missionId": "draft.cr01",
          "sectionId": "entrada"
        }
      ],
      "cr01.q03": [
        {
          "missionId": "draft.cr01",
          "sectionId": "ex-encontro"
        }
      ],
      "cr01.q04": [
        {
          "missionId": "draft.cr01",
          "sectionId": "comparar"
        }
      ],
      "cr01.q05": [
        {
          "missionId": "draft.cr01",
          "sectionId": "plural"
        }
      ],
      "cr01.q06": [
        {
          "missionId": "draft.cr01",
          "sectionId": "recuperacao"
        }
      ],
      "cr01.q07": [
        {
          "missionId": "draft.cr01",
          "sectionId": "limites"
        }
      ],
      "cr01.q08": [
        {
          "missionId": "draft.cr01",
          "sectionId": "ex-comparar"
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
  ]
};
export const ARITHMETIC = [];
