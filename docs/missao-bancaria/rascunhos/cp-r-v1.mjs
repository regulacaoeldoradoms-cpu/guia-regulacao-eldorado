// Textos e exercícios autorais; rascunho local desativado.
export const SOURCES = [
  {
    "id": "funag.colocacao",
    "label": "FUNAG - Manual de Revisão: colocação pronominal (fontes Cunha/Cintra e Almeida)",
    "url": "https://funag.gov.br/manual/index.php?title=Coloca%C3%A7%C3%A3o_pronominal&oldid=553",
    "version": "oldid553; página atribui Cunha/Cintra2001 e Almeida2009; consultada em04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "Tipos antes/depois/meio; Com um só verbo2a (negativa sem pausa),4 (infinitivos próclise/ênclise); regra final início formal. Não aplicar as afirmações amplas de locuções verbais/advérbios/futuro a variantes não ensinadas."
  }
];
export const CPR_DRAFT = {
  "id": "draft.cpr",
  "topicId": "draft.cpr",
  "editorialKey": "CP-R",
  "candidateBlockId": "portuguese.meaning-writing",
  "title": "Colocação pronominal: revisão delimitada",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Identificar e aplicar a colocação dos pronomes átonos nos casos delimitados pelo manual formal adotado.",
  "sourceIds": [
    "funag.colocacao"
  ],
  "sections": [
    {
      "id": "posicao",
      "heading": "1. Recuperação: posição",
      "body": "CP01: me antes do verbo é próclise, depois com hífen é ênclise, no meio da forma futura Lembrar-me-ei é mesóclise. Reconhecimento não prova obrigatoriedade em todo contexto.",
      "type": "explanation",
      "sourceIds": [
        "funag.colocacao"
      ]
    },
    {
      "id": "formal",
      "heading": "2. Recuperação: condição formal",
      "body": "CP02: negativa sem pausa com verbo simples requer antes; início formal sem fator atrativo usa verbo antes do átono no caso. Não generalizar a orientação para toda fala ou locução.",
      "type": "explanation",
      "sourceIds": [
        "funag.colocacao"
      ]
    },
    {
      "id": "infinitivo",
      "heading": "3. Recuperação: possibilidade",
      "body": "CP03 admite Para me lembrar / Para lembrar-me no infinitivo simples dado. Conservar me preserva referência; te mudaria a pessoa informada. Não escolher única possibilidade quando o caso ensinou duas.",
      "type": "explanation",
      "sourceIds": [
        "funag.colocacao"
      ]
    },
    {
      "id": "ex-posicao",
      "heading": "4. Exemplo resolvido: forma inteira",
      "body": "Eu me lembro: me antes; Lembro-me: depois; Lembrar-me-ei: no meio do futuro. Não chamar todo hífen de mesóclise.",
      "type": "worked-example",
      "sourceIds": [
        "funag.colocacao"
      ]
    },
    {
      "id": "ex-formal",
      "heading": "5. Exemplo resolvido: não e início",
      "body": "Não me engano mantém negativa sem pausa e próclise; Engano-me às vezes inicia oração formal sem atrator. Não apagar não para resolver colocação.",
      "type": "worked-example",
      "sourceIds": [
        "funag.colocacao"
      ]
    },
    {
      "id": "ex-infinitivo",
      "heading": "6. Exemplo resolvido: mesma pessoa",
      "body": "Para me lembrar e Para lembrar-me conservam me nas duas posições admitidas no caso de infinitivo simples. Trocar me por te não é só mudar posição.",
      "type": "worked-example",
      "sourceIds": [
        "funag.colocacao"
      ]
    },
    {
      "id": "retomadas",
      "heading": "7. Retomar a condição",
      "body": "[CP-01](cp-01-v1.md) · [CP-02](cp-02-v1.md) · [CP-03](cp-03-v1.md)",
      "type": "explanation",
      "sourceIds": [
        "funag.colocacao"
      ]
    },
    {
      "id": "glossario",
      "heading": "Vocabulário de apoio",
      "body": "Pronome átono é forma como me/te/se, que se liga ao verbo na construção. Próclise: antes; ênclise: depois, com hífen; mesóclise: no meio da forma futura exemplificada. Infinitivo: forma como lembrar. Registro formal adotado: orientação específica do manual, sem condenar todas as variantes de fala.",
      "type": "glossary",
      "sourceIds": [
        "funag.colocacao"
      ]
    },
    {
      "id": "recuperacao",
      "heading": "Recuperar pela condição",
      "body": "Identifique pronome e verbo, marque posição e condição do caso: negativa sem pausa, início formal ou infinitivo com duas possibilidades ensinadas. Não confundir posição com sentido do referente nem generalizar para todas as locuções/tempos/variedades.",
      "type": "summary",
      "sourceIds": [
        "funag.colocacao"
      ]
    }
  ],
  "recall": [
    "Onde está o pronome em relação ao verbo?",
    "Qual condição formal foi informada?",
    "O caso admite mais de uma posição?"
  ],
  "questions": [
    {
      "id": "cpr.q01",
      "prompt": "Me em Eu me engano aparece antes do verbo. Que posição foi ensinada?",
      "options": [
        "Próclise.",
        "Ênclise.",
        "Mesóclise.",
        "Ausência de pronome."
      ],
      "answer": 0,
      "explanation": "A posição anterior é próclise.",
      "optionRationales": [
        "A posição anterior é próclise.",
        "Posterior seria ênclise.",
        "Não está no meio de futuro.",
        "Me está presente."
      ],
      "recoverySectionIds": [
        "posicao"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "cp01",
          "sectionId": "antes"
        }
      ]
    },
    {
      "id": "cpr.q02",
      "prompt": "Como se classifica me em Engano-me no caso dado?",
      "options": [
        "Mesóclise.",
        "Próclise.",
        "Ênclise.",
        "Artigo definido."
      ],
      "answer": 2,
      "explanation": "O pronome vem depois do verbo, ligado por hífen.",
      "optionRationales": [
        "Não é forma futura com pronome interno.",
        "Não vem antes.",
        "O pronome vem depois do verbo, ligado por hífen.",
        "Me é pronome."
      ],
      "recoverySectionIds": [
        "posicao"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "cp01",
          "sectionId": "depois"
        }
      ]
    },
    {
      "id": "cpr.q03",
      "prompt": "No padrão formal adotado, qual opção preserva negativa sem pausa com verbo simples lembro?",
      "options": [
        "Não lembro-me.",
        "Não me lembro.",
        "Não lembro me, como ênclise sem hífen.",
        "Me não lembro, como construção dada."
      ],
      "answer": 1,
      "explanation": "A condição pede pronome antes do verbo.",
      "optionRationales": [
        "Não segue próclise requerida.",
        "A condição pede pronome antes do verbo.",
        "Não representa a construção ensinada.",
        "Não representa o arranjo dado."
      ],
      "recoverySectionIds": [
        "formal"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "cp02",
          "sectionId": "negativa"
        }
      ]
    },
    {
      "id": "cpr.q04",
      "prompt": "Qual escrita inicia a oração formal sem atrator dado com verbo lembro e átono me?",
      "options": [
        "Lembro me do tema, como ênclise sem hífen.",
        "Me lembro do tema, iniciando com átono.",
        "Me-lembro do tema.",
        "Lembro-me do tema."
      ],
      "answer": 3,
      "explanation": "Segue verbo antes do átono com hífen no caso formal.",
      "optionRationales": [
        "Falta a ligação escrita da ênclise.",
        "Não segue a orientação de início dada.",
        "Não representa a ligação ensinada.",
        "Segue verbo antes do átono com hífen no caso formal."
      ],
      "recoverySectionIds": [
        "formal"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "cp02",
          "sectionId": "inicio"
        }
      ]
    },
    {
      "id": "cpr.q05",
      "prompt": "No infinitivo simples delimitado, como avaliar Para me lembrar / Para lembrar-me?",
      "options": [
        "Só a segunda em todo uso.",
        "Só a primeira em todo uso.",
        "As duas formas são admitidas.",
        "As duas são mesóclise."
      ],
      "answer": 2,
      "explanation": "O ensino admite ambas no caso.",
      "optionRationales": [
        "A primeira também é admitida.",
        "A segunda também é admitida.",
        "O ensino admite ambas no caso.",
        "Não são internas a futuro."
      ],
      "recoverySectionIds": [
        "infinitivo"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "cp03",
          "sectionId": "entrada"
        }
      ]
    },
    {
      "id": "cpr.q06",
      "prompt": "O caso distingue quem fala de quem ouve. Trocar me por te muda apenas posição?",
      "options": [
        "Não: muda a referência pessoal informada.",
        "Sim: toda troca de pronome é posição.",
        "Sim: não existe referência pessoal.",
        "Não: muda obrigatoriamente o dia de hoje."
      ],
      "answer": 0,
      "explanation": "A forma e a referência mudam, não apenas a posição.",
      "optionRationales": [
        "A forma e a referência mudam, não apenas a posição.",
        "Posição compara a mesma forma em relação ao verbo.",
        "O caso explicitou pessoas diferentes.",
        "Dia não está nessa mudança."
      ],
      "recoverySectionIds": [
        "infinitivo"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "cp03",
          "sectionId": "preservar"
        }
      ]
    },
    {
      "id": "cpr.q07",
      "prompt": "Você chamou Lembrar-me-ei de ênclise simples depois de toda a forma. O que deve retomar?",
      "options": [
        "A regra de toda frase ser infinitivo.",
        "Só o gênero de aviso.",
        "A ausência de todos os hífens.",
        "A posição interna de me na forma futura exemplificada."
      ],
      "answer": 3,
      "explanation": "O exemplo é mesóclise, com pronome no meio.",
      "optionRationales": [
        "A forma dada é futura, não infinitivo simples.",
        "Gênero não resolve a posição.",
        "Há hífens no exemplo.",
        "O exemplo é mesóclise, com pronome no meio."
      ],
      "recoverySectionIds": [
        "recuperacao"
      ],
      "objectiveIds": [
        "O4"
      ],
      "originRefs": [
        {
          "unit": "cp01",
          "sectionId": "meio"
        }
      ]
    },
    {
      "id": "cpr.q08",
      "prompt": "Qual afirmação preserva o alcance da orientação formal de início?",
      "options": [
        "Prova que toda fala brasileira é sem regra.",
        "Não transforma variantes de fala em impossibilidade universal.",
        "Dispensa qualquer condição formal.",
        "Resolve todas as locuções verbais."
      ],
      "answer": 1,
      "explanation": "O registro adotado foi delimitado.",
      "optionRationales": [
        "Isso não é o ensino.",
        "O registro adotado foi delimitado.",
        "As condições continuam aplicáveis ao exercício.",
        "Locuções completas ficaram fora."
      ],
      "recoverySectionIds": [
        "formal"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "cp02",
          "sectionId": "limites"
        }
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "cpr-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "cpr.q01": [
        {
          "missionId": "draft.cpr",
          "sectionId": "posicao"
        }
      ],
      "cpr.q02": [
        {
          "missionId": "draft.cpr",
          "sectionId": "posicao"
        }
      ],
      "cpr.q03": [
        {
          "missionId": "draft.cpr",
          "sectionId": "formal"
        }
      ],
      "cpr.q04": [
        {
          "missionId": "draft.cpr",
          "sectionId": "formal"
        }
      ],
      "cpr.q05": [
        {
          "missionId": "draft.cpr",
          "sectionId": "infinitivo"
        }
      ],
      "cpr.q06": [
        {
          "missionId": "draft.cpr",
          "sectionId": "infinitivo"
        }
      ],
      "cpr.q07": [
        {
          "missionId": "draft.cpr",
          "sectionId": "recuperacao"
        }
      ],
      "cpr.q08": [
        {
          "missionId": "draft.cpr",
          "sectionId": "formal"
        }
      ]
    }
  }
};
export const EDITORIAL = {
  "stage": "Rascunho local fora do catálogo; parecer independente favorável, sem correções necessárias",
  "objectives": {
    "O1": "Identificar pronome, verbo e posição.",
    "O2": "Aplicar a condição formal ensinada.",
    "O3": "Distinguir possibilidades e limites da orientação.",
    "O4": "Retomar a condição ignorada."
  },
  "recovery": {
    "objectiveId": "O4",
    "instruction": "Conferir posição/negativa/pausa/início formal/infinitivo."
  },
  "limits": [
    "Plano05, bloco portuguese.meaning-writing existente; pré-requisito SM/CF/RG, perfis históricos/referenceOnly.",
    "FUNAG553 consultada antes da autoria; atribuição das fontes da página preservada. Exemplos autorais. Orientação formal delimitada, não condenação de toda fala brasileira.",
    "Recorte: reconhecer três posições; negativa sem pausa; início de oração formal sem fator atrativo; infinitivo com próclise/ênclise admitidas no caso.",
    "Não cobrar todas as regras de atração/pausas, locuções verbais/particípios, formas lo/no, funções e regência completa dos oblíquos, relativas ou escolhas controversas de futuro.",
    "Sem produção/D1/push/ativação/merge/deploy; não prova cobertura integral, retenção ou aceite humano."
  ]
};
export const ARITHMETIC = [];
