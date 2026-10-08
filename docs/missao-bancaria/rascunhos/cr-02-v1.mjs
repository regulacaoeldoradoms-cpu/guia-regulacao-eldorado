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
export const CR02_DRAFT = {
  "id": "draft.cr02",
  "topicId": "draft.cr02",
  "editorialKey": "CR-02",
  "candidateBlockId": "portuguese.syntax",
  "title": "Crase: reconhecer quando não há encontro",
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
      "heading": "1. A aparência não decide",
      "body": "CR01 ensinou o encontro a+a. Agora a ausência de um elemento explica a escrita sem sinal. Só aplicaremos os casos definidos: infinitivo, artigo uma, nome masculino sem palavra feminina subentendida e a singular antes de nome plural sem artigo. Não cobrar exceções não ensinadas.",
      "type": "explanation",
      "sourceIds": [
        "senado.crase"
      ]
    },
    {
      "id": "infinitivo",
      "heading": "2. Antes de infinitivo",
      "body": "No exemplo O grupo começou a organizar o roteiro, organizar é infinitivo e não recebe artigo feminino a. Não ocorre encontro a+a diante desse verbo; escrever a organizar, sem sinal grave. Isso não exige retirar a preposição existente.",
      "type": "explanation",
      "sourceIds": [
        "senado.crase"
      ]
    },
    {
      "id": "uma",
      "heading": "3. Preposição e artigo uma",
      "body": "Em A aluna assistiu a uma apresentação, presenciar mantém a preposição a; uma é artigo indefinido, não o artigo a. Não ocorre a+a. Assistiu à apresentação determinada é outra construção, com artigo definido; não tratar a uma e à como simples grafias intercambiáveis da mesma determinação.",
      "type": "explanation",
      "sourceIds": [
        "senado.crase"
      ]
    },
    {
      "id": "plural",
      "heading": "4. A singular antes de plural sem artigo",
      "body": "Em O grupo assistiu a apresentações variadas, o caso usa apresentações sem artigo; a é só a preposição. Não escrever à apresentações. Com artigo as, outro grupo fica às apresentações selecionadas. Não dizer que nunca há crase no plural: às é possível quando há as.",
      "type": "explanation",
      "sourceIds": [
        "senado.crase"
      ]
    },
    {
      "id": "masculino",
      "heading": "5. Nome masculino e limites",
      "body": "Em O grupo assistiu a um debate, um acompanha o nome masculino; a é preposição. Em assistiu ao debate definido, a+o forma ao, não à. Este recorte não inclui palavra feminina subentendida nem à moda de; portanto não transformar o caso comum em proibição universal diante de qualquer grafia masculina.",
      "type": "explanation",
      "sourceIds": [
        "senado.crase"
      ]
    },
    {
      "id": "ex-verbo",
      "heading": "6. Exemplo resolvido: organizar",
      "body": "A turma começou a organizar o roteiro: identifique organizar como verbo no infinitivo. Não há artigo feminino a diante dele; conserve a e não coloque sinal grave. A regra não é apagar toda preposição diante de verbo.",
      "type": "worked-example",
      "sourceIds": [
        "senado.crase"
      ]
    },
    {
      "id": "ex-uma",
      "heading": "7. Exemplo resolvido: apresentação não definida",
      "body": "O enunciado não apresenta uma determinada apresentação e usa uma: assistiu a uma apresentação. A liga o complemento ao verbo; uma não vira a para produzir fusão. A escolha do artigo modifica a determinação do grupo.",
      "type": "worked-example",
      "sourceIds": [
        "senado.crase"
      ]
    },
    {
      "id": "ex-plural",
      "heading": "8. Exemplo resolvido: contraste no plural",
      "body": "Assistiu a apresentações variadas usa plural sem artigo no caso dado. Assistiu às apresentações selecionadas usa artigo as. No primeiro não há fusão; no segundo a+as resulta em às. A escrita depende dos elementos, não de decorar que plural proíbe o sinal.",
      "type": "worked-example",
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
      "id": "cr02.q01",
      "prompt": "Por que a organizar fica sem sinal grave em começou a organizar, no caso ensinado?",
      "options": [
        "A preposição deve desaparecer.",
        "Infinitivo é sempre substantivo feminino.",
        "Organizar é infinitivo e não há artigo feminino a diante dele.",
        "Toda frase sem sujeito fica sem sinal."
      ],
      "answer": 2,
      "explanation": "Não ocorre o encontro a+a diante do infinitivo dado.",
      "optionRationales": [
        "A conserva seu papel no vínculo.",
        "Organizar funciona como verbo neste caso.",
        "Não ocorre o encontro a+a diante do infinitivo dado.",
        "A frase tem sujeito e essa não é a condição ensinada."
      ],
      "recoverySectionIds": [
        "infinitivo"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "cr02.q02",
      "prompt": "Qual escrita segue o caso com infinitivo explicitamente ensinado?",
      "options": [
        "A turma começou a ler o roteiro.",
        "A turma começou à ler o roteiro.",
        "A turma começou às ler o roteiro.",
        "A turma começou ao ler o roteiro, como substituição obrigatória de a."
      ],
      "answer": 0,
      "explanation": "Ler é infinitivo, sem artigo feminino que forme a+a.",
      "optionRationales": [
        "Ler é infinitivo, sem artigo feminino que forme a+a.",
        "Não há fusão a+a diante de ler.",
        "As não é artigo desse verbo.",
        "Ao não é a substituição obrigatória no vínculo dado."
      ],
      "recoverySectionIds": [
        "ex-verbo"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "cr02.q03",
      "prompt": "Em assistiu a uma apresentação, o que impede o encontro a+a?",
      "options": [
        "Uma é sempre preposição.",
        "Assistir perdeu necessariamente o sentido de presenciar.",
        "Apresentação virou nome masculino.",
        "O artigo do grupo é uma, não a."
      ],
      "answer": 3,
      "explanation": "A preposição a continua; o artigo uma não fornece o segundo a.",
      "optionRationales": [
        "Uma é artigo indefinido aqui.",
        "O sentido de presenciar foi preservado.",
        "Apresentação permanece feminina.",
        "A preposição a continua; o artigo uma não fornece o segundo a."
      ],
      "recoverySectionIds": [
        "uma"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "cr02.q04",
      "prompt": "O enunciado escolhe artigo uma. Qual escrita preserva essa determinação e a preposição de presenciar?",
      "options": [
        "Assistiu à uma oficina.",
        "Assistiu a uma oficina.",
        "Assistiu às uma oficina.",
        "Assistiu ao uma oficina."
      ],
      "answer": 1,
      "explanation": "A liga ao verbo, sem fusão com artigo uma.",
      "optionRationales": [
        "Não se forma a+a com uma.",
        "A liga ao verbo, sem fusão com artigo uma.",
        "Não há artigo as neste grupo.",
        "O não é o artigo utilizado."
      ],
      "recoverySectionIds": [
        "ex-uma"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "cr02.q05",
      "prompt": "Em assistiu a apresentações variadas, sem artigo no caso dado, como funciona a?",
      "options": [
        "Somente como preposição.",
        "Como artigo plural as.",
        "Como fusão obrigatória com a.",
        "Como núcleo do sujeito."
      ],
      "answer": 0,
      "explanation": "O grupo plural foi apresentado sem artigo; a introduz o complemento.",
      "optionRationales": [
        "O grupo plural foi apresentado sem artigo; a introduz o complemento.",
        "As não aparece no caso dado.",
        "Não há segundo a para fusão.",
        "A não é núcleo nominal do sujeito."
      ],
      "recoverySectionIds": [
        "plural"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "cr02.q06",
      "prompt": "Qual par preserva o contraste entre plural sem artigo e plural com artigo as?",
      "options": [
        "Às apresentações variadas sem artigo / a apresentações selecionadas com artigo as.",
        "À apresentações variadas / à apresentações selecionadas.",
        "A apresentações variadas / às apresentações selecionadas.",
        "Ao apresentações variadas / ao apresentações selecionadas."
      ],
      "answer": 2,
      "explanation": "No primeiro só há preposição; no segundo a+as.",
      "optionRationales": [
        "A descrição explícita dos artigos foi invertida na escrita.",
        "À singular não representa o plural desses grupos.",
        "No primeiro só há preposição; no segundo a+as.",
        "Ao inclui artigo o, inadequado aos grupos dados."
      ],
      "recoverySectionIds": [
        "ex-plural"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "cr02.q07",
      "prompt": "No exemplo assistiu a um debate, sem palavra feminina subentendida, por que não se usa à?",
      "options": [
        "Todo substantivo masculino esconde obrigatoriamente moda.",
        "Não há artigo feminino a; um acompanha debate.",
        "Um e a são o mesmo artigo.",
        "A preposição a nunca se liga a nomes masculinos."
      ],
      "answer": 1,
      "explanation": "O caso dado não contém o artigo feminino para a+a.",
      "optionRationales": [
        "Não há essa palavra subentendida no exemplo.",
        "O caso dado não contém o artigo feminino para a+a.",
        "Um é artigo indefinido diferente de a.",
        "A pode ligar complemento masculino, como neste caso."
      ],
      "recoverySectionIds": [
        "masculino"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "cr02.q08",
      "prompt": "O estudante concluiu que todo plural impede crase. O que deve retomar?",
      "options": [
        "A troca automática de apresentações por um verbo.",
        "A proibição de qualquer artigo plural.",
        "A regra de pôr à antes de todo plural.",
        "A diferença entre a sem artigo e a+as formando às."
      ],
      "answer": 3,
      "explanation": "Plural admite às quando há a preposição e artigo as.",
      "optionRationales": [
        "Trocar classe não justifica os elementos.",
        "Artigos plurais existem.",
        "À singular não resolve o caso.",
        "Plural admite às quando há a preposição e artigo as."
      ],
      "recoverySectionIds": [
        "ex-plural"
      ],
      "objectiveIds": [
        "O4"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "cr02-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "cr02.q01": [
        {
          "missionId": "draft.cr02",
          "sectionId": "infinitivo"
        }
      ],
      "cr02.q02": [
        {
          "missionId": "draft.cr02",
          "sectionId": "ex-verbo"
        }
      ],
      "cr02.q03": [
        {
          "missionId": "draft.cr02",
          "sectionId": "uma"
        }
      ],
      "cr02.q04": [
        {
          "missionId": "draft.cr02",
          "sectionId": "ex-uma"
        }
      ],
      "cr02.q05": [
        {
          "missionId": "draft.cr02",
          "sectionId": "plural"
        }
      ],
      "cr02.q06": [
        {
          "missionId": "draft.cr02",
          "sectionId": "ex-plural"
        }
      ],
      "cr02.q07": [
        {
          "missionId": "draft.cr02",
          "sectionId": "masculino"
        }
      ],
      "cr02.q08": [
        {
          "missionId": "draft.cr02",
          "sectionId": "ex-plural"
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
