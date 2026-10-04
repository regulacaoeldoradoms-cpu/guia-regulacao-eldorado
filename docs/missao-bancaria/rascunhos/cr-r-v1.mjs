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
export const CRR_DRAFT = {
  "id": "draft.crr",
  "topicId": "draft.crr",
  "editorialKey": "CR-R",
  "candidateBlockId": "portuguese.syntax",
  "title": "Crase: revisão cumulativa do recorte",
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
      "id": "encontro",
      "heading": "1. Encontro e comparação",
      "body": "Retome CR01: a+a=à e a+as=às quando há preposição e artigo. Compare ao apenas conservando o vínculo, o sentido e a determinação. Feminino sozinho não cria crase.",
      "type": "explanation",
      "sourceIds": [
        "senado.crase"
      ]
    },
    {
      "id": "ausencia",
      "heading": "2. Ausência de um elemento",
      "body": "CR02: infinitivo não fornece artigo feminino a; uma não é a; a singular antes de plural sem artigo não se funde. Não apagar preposição nem generalizar que todo plural proíba às.",
      "type": "explanation",
      "sourceIds": [
        "senado.crase"
      ]
    },
    {
      "id": "demonstrativo",
      "heading": "3. Demonstrativo depende do vínculo",
      "body": "CR03: a+aquele/aquela/aquilo produz àquele/àquela/àquilo. Sem preposição, Aquela oficina começou mantém aquela. O sinal não depende só do gênero do nome seguinte.",
      "type": "explanation",
      "sourceIds": [
        "senado.crase"
      ]
    },
    {
      "id": "locucoes",
      "heading": "4. Expressões ensinadas",
      "body": "Às vezes=ocorrência ocasional; às pressas=modo apressado; à tarde=período. O sinal de à tarde é registrado por clareza no manual; não reduzir todo sinal grave a fusão literal com artigo.",
      "type": "explanation",
      "sourceIds": [
        "senado.crase"
      ]
    },
    {
      "id": "ex-encontro",
      "heading": "5. Exemplo resolvido: comparar",
      "body": "Assistiu à atividade indicada / assistiu ao encontro indicado: o caso de presenciar mantém preposição a e os grupos definidos. Compare a+a e a+o, não só o gênero.",
      "type": "worked-example",
      "sourceIds": [
        "senado.crase"
      ]
    },
    {
      "id": "ex-ausencia",
      "heading": "6. Exemplo resolvido: artigo e infinitivo",
      "body": "Começou a revisar não tem artigo feminino antes de revisar. Assistiu a uma atividade mantém uma, sem a+a. Não remover a preposição para corrigir o sinal.",
      "type": "worked-example",
      "sourceIds": [
        "senado.crase"
      ]
    },
    {
      "id": "ex-casos",
      "heading": "7. Exemplo resolvido: demonstrativo e modo",
      "body": "Assistiu àquela atividade combina a e aquela. Concluiu às pressas indica modo apressado. Um encontro com demonstrativo não é a mesma explicação usada para todas as locuções.",
      "type": "worked-example",
      "sourceIds": [
        "senado.crase"
      ]
    },
    {
      "id": "retomadas",
      "heading": "8. Voltar ao ponto do erro",
      "body": "[CR-01](cr-01-v1.md) · [CR-02](cr-02-v1.md) · [CR-03](cr-03-v1.md)",
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
      "id": "crr.q01",
      "prompt": "No complemento assistiu à atividade definida, em sentido de presenciar, o sinal representa quais elementos?",
      "options": [
        "A preposição a e o artigo a.",
        "Artigo uma e verbo.",
        "Dois nomes masculinos.",
        "Só um adjetivo feminino."
      ],
      "answer": 0,
      "explanation": "O caso com grupo definido reúne os dois elementos ensinados.",
      "optionRationales": [
        "O caso com grupo definido reúne os dois elementos ensinados.",
        "Uma não é o artigo do caso.",
        "Não são dois nomes.",
        "Gênero sozinho não explica."
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
          "sectionId": "encontro"
        }
      ]
    },
    {
      "id": "crr.q02",
      "prompt": "Mantendo presenciar e artigo definido, qual comparação mostra a+o diante de masculino?",
      "options": [
        "Assistiu às encontro indicado.",
        "Assistiu à encontro indicado.",
        "Assistiu ao encontro indicado.",
        "Assistiu de encontro indicado."
      ],
      "answer": 2,
      "explanation": "Ao reúne a preposição a com artigo o.",
      "optionRationales": [
        "As não acompanha esse nome singular masculino.",
        "À não representa artigo o.",
        "Ao reúne a preposição a com artigo o.",
        "De não corresponde ao vínculo indicado."
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
          "sectionId": "comparar"
        }
      ]
    },
    {
      "id": "crr.q03",
      "prompt": "No caso começou a revisar, que elemento falta para a+a?",
      "options": [
        "O sujeito plural obrigatório.",
        "Artigo feminino a antes do infinitivo revisar.",
        "O acento agudo na preposição.",
        "A preposição, que obrigatoriamente deve ser apagada."
      ],
      "answer": 1,
      "explanation": "Revisar é infinitivo; não fornece artigo feminino a.",
      "optionRationales": [
        "Número do sujeito não decide esse encontro.",
        "Revisar é infinitivo; não fornece artigo feminino a.",
        "Agudo não produz artigo.",
        "A preposição permanece no caso dado."
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
          "sectionId": "infinitivo"
        }
      ]
    },
    {
      "id": "crr.q04",
      "prompt": "Qual escrita segue o complemento plural explicitamente sem artigo?",
      "options": [
        "Assistiu ao oficinas variadas.",
        "Assistiu à oficinas variadas.",
        "Assistiu às oficinas variadas, embora o caso exclua artigo.",
        "Assistiu a oficinas variadas."
      ],
      "answer": 3,
      "explanation": "No caso sem artigo plural, a é só preposição.",
      "optionRationales": [
        "Ao inclui artigo o incompatível com esse grupo.",
        "À singular não compõe o grupo plural.",
        "Às introduziria o artigo as excluído pelo caso.",
        "No caso sem artigo plural, a é só preposição."
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
          "sectionId": "plural"
        }
      ]
    },
    {
      "id": "crr.q05",
      "prompt": "Qual afirmação evita erro ao comparar aquele e àquele?",
      "options": [
        "Nome masculino sempre impede àquele.",
        "Todo aquele tem sinal grave.",
        "O vínculo precisa fornecer a preposição a para o encontro.",
        "A comparação depende só de letras iguais."
      ],
      "answer": 2,
      "explanation": "O encontro depende do vínculo, não da mera grafia do demonstrativo.",
      "optionRationales": [
        "Debate masculino não impede a+aquele.",
        "Sem preposição não se marca o encontro.",
        "O encontro depende do vínculo, não da mera grafia do demonstrativo.",
        "É preciso analisar a estrutura."
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
          "sectionId": "contraste"
        }
      ]
    },
    {
      "id": "crr.q06",
      "prompt": "A frase Aquela atividade terminou funciona como sujeito mais predicado. Como fica o demonstrativo no caso dado?",
      "options": [
        "Aquela, sem sinal grave.",
        "Àquela, porque toda atividade é feminina.",
        "À aquela, sempre em duas palavras.",
        "Às aquela, porque terminou é passado."
      ],
      "answer": 0,
      "explanation": "Não há preposição a no sujeito dado.",
      "optionRationales": [
        "Não há preposição a no sujeito dado.",
        "Feminino não cria preposição no sujeito.",
        "Não se acrescenta à separado nesse sujeito.",
        "Passado não produz artigo as."
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
          "sectionId": "contraste"
        }
      ]
    },
    {
      "id": "crr.q07",
      "prompt": "Qual par de expressão e sentido corresponde ao ensino do lote?",
      "options": [
        "Às pressas: ocorrência ocasional.",
        "Às vezes: necessariamente sempre.",
        "À tarde: artigo masculino o.",
        "Às pressas: modo apressado."
      ],
      "answer": 3,
      "explanation": "Às pressas indica o modo apressado da ação.",
      "optionRationales": [
        "Ocorrência ocasional é às vezes.",
        "Às vezes significa ocasionalmente.",
        "À tarde indica período, não esse artigo.",
        "Às pressas indica o modo apressado da ação."
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
      ]
    },
    {
      "id": "crr.q08",
      "prompt": "O estudante explicou todo sinal grave como dois artigos a. Qual recuperação é adequada?",
      "options": [
        "Manter a explicação porque toda palavra com à é artigo duplo.",
        "Retomar preposição/artigo, demonstrativos e a ressalva de clareza nas locuções ensinadas.",
        "Eliminar todos os sinais graves.",
        "Trocar todo verbo por substantivo."
      ],
      "answer": 1,
      "explanation": "O primeiro encontro é preposição+artigo, e o recorte inclui outros casos delimitados.",
      "optionRationales": [
        "Dois artigos não é a definição ensinada.",
        "O primeiro encontro é preposição+artigo, e o recorte inclui outros casos delimitados.",
        "Casos que exigem sinal não devem ser apagados.",
        "Troca de classe não resolve a análise."
      ],
      "recoverySectionIds": [
        "recuperacao"
      ],
      "objectiveIds": [
        "O4"
      ],
      "originRefs": [
        {
          "unit": "cr03",
          "sectionId": "entrada"
        }
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "crr-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "crr.q01": [
        {
          "missionId": "draft.crr",
          "sectionId": "encontro"
        }
      ],
      "crr.q02": [
        {
          "missionId": "draft.crr",
          "sectionId": "encontro"
        }
      ],
      "crr.q03": [
        {
          "missionId": "draft.crr",
          "sectionId": "ausencia"
        }
      ],
      "crr.q04": [
        {
          "missionId": "draft.crr",
          "sectionId": "ausencia"
        }
      ],
      "crr.q05": [
        {
          "missionId": "draft.crr",
          "sectionId": "demonstrativo"
        }
      ],
      "crr.q06": [
        {
          "missionId": "draft.crr",
          "sectionId": "demonstrativo"
        }
      ],
      "crr.q07": [
        {
          "missionId": "draft.crr",
          "sectionId": "locucoes"
        }
      ],
      "crr.q08": [
        {
          "missionId": "draft.crr",
          "sectionId": "recuperacao"
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
