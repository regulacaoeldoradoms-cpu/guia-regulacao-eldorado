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
export const CPCHEFE_DRAFT = {
  "id": "draft.cpchefe",
  "topicId": "draft.cpchefe",
  "editorialKey": "CP-CHEFE",
  "candidateBlockId": "portuguese.meaning-writing",
  "title": "Colocação pronominal: Chefe introdutório",
  "contentVersion": 1,
  "kind": "boss",
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
      "id": "ex-chefe",
      "heading": "4. Exemplo resolvido: condição antes da escolha",
      "body": "Não me lembro da tarefa tem negativa sem pausa e próclise. Para lembrar-me da tarefa contém infinitivo e ênclise, admitida junto de Para me lembrar no caso. Não transplantar regra de uma construção para outra sem identificar a condição.",
      "type": "worked-example",
      "sourceIds": [
        "funag.colocacao"
      ]
    },
    {
      "id": "retomadas",
      "heading": "5. Retomar ensino",
      "body": "[CP-01](cp-01-v1.md) · [CP-02](cp-02-v1.md) · [CP-03](cp-03-v1.md) · [CP-R](cp-r-v1.md)",
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
      "id": "cpchefe.q01",
      "prompt": "Em Eu me lembro da tarefa, qual par identifica verbo e átono cuja posição se analisa?",
      "options": [
        "Da e tarefa.",
        "Eu e tarefa.",
        "Lembro e me.",
        "Eu e da."
      ],
      "answer": 2,
      "explanation": "Lembro é verbo; me é o átono analisado.",
      "optionRationales": [
        "Da não é o verbo desse par.",
        "Eu é sujeito e tarefa é nome.",
        "Lembro é verbo; me é o átono analisado.",
        "Não identifica verbo e átono."
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
      ],
      "groupId": "G1"
    },
    {
      "id": "cpchefe.q02",
      "prompt": "Me depois do verbo em Lembro-me da tarefa recebe qual classificação?",
      "options": [
        "Ênclise.",
        "Próclise.",
        "Mesóclise.",
        "Artigo indefinido."
      ],
      "answer": 0,
      "explanation": "A posição posterior com hífen é ênclise.",
      "optionRationales": [
        "A posição posterior com hífen é ênclise.",
        "Não é anterior.",
        "Não é interna a futuro.",
        "Me não é artigo."
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
      ],
      "groupId": "G1"
    },
    {
      "id": "cpchefe.q03",
      "prompt": "O padrão é formal, com negativa não sem pausa e verbo simples engano. Qual forma segue o ensino?",
      "options": [
        "Me não engano nessa tarefa, como arranjo pedido.",
        "Não engano-me nessa tarefa.",
        "Não engano me nessa tarefa, como ênclise sem hífen.",
        "Não me engano nessa tarefa."
      ],
      "answer": 3,
      "explanation": "A condição negativa pede próclise ao verbo.",
      "optionRationales": [
        "Não representa a construção fornecida.",
        "Não segue a condição ensinada.",
        "Não representa a ligação/posição requerida.",
        "A condição negativa pede próclise ao verbo."
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
      ],
      "groupId": "G2"
    },
    {
      "id": "cpchefe.q04",
      "prompt": "Por que Não me lembro não deve virar Lembro-me ao preservar a frase negativa dada?",
      "options": [
        "Porque não nunca muda sentido.",
        "A troca apagaria a negação, mudando conteúdo e condição.",
        "Porque toda frase sem não é equivalente.",
        "Porque me é sempre artigo."
      ],
      "answer": 1,
      "explanation": "A informação negativa precisa permanecer.",
      "optionRationales": [
        "Não nega o conteúdo.",
        "A informação negativa precisa permanecer.",
        "Apagar negação altera a mensagem.",
        "Me é pronome."
      ],
      "recoverySectionIds": [
        "formal"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "cp02",
          "sectionId": "condicao"
        }
      ],
      "groupId": "G2"
    },
    {
      "id": "cpchefe.q05",
      "prompt": "Qual opção atende ao início de oração formal sem atrator dado, com verbo engano e átono me?",
      "options": [
        "Me engano às vezes, iniciando com átono.",
        "Engano-me às vezes.",
        "Me-engano às vezes.",
        "Engano me às vezes, como ênclise sem hífen."
      ],
      "answer": 1,
      "explanation": "Verbo antes de me com hífen segue o caso formal.",
      "optionRationales": [
        "Não segue a orientação de início adotada.",
        "Verbo antes de me com hífen segue o caso formal.",
        "Ligação antes do verbo não é a ênclise ensinada.",
        "O hífen de ligação está ausente."
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
      ],
      "groupId": "G3"
    },
    {
      "id": "cpchefe.q06",
      "prompt": "Qual leitura do exemplo inicial Me lembro na fala respeita o limite do exercício?",
      "options": [
        "A existência da variante elimina o padrão formal do exercício.",
        "A variante é impossível em qualquer fala.",
        "Toda fala é inferior e sem regras.",
        "A variante pode ocorrer na fala, embora não cumpra o padrão formal de início aqui adotado."
      ],
      "answer": 3,
      "explanation": "A orientação foi delimitada por registro e condição.",
      "optionRationales": [
        "O exercício continua seguindo o padrão explicitado.",
        "Não se afirmou impossibilidade linguística universal.",
        "Isso não é conclusão ensinada.",
        "A orientação foi delimitada por registro e condição."
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
          "sectionId": "inicio"
        }
      ],
      "groupId": "G3"
    },
    {
      "id": "cpchefe.q07",
      "prompt": "No caso simples ensinado, quais formas com infinitivo e me são admitidas?",
      "options": [
        "Para me lembrar da tarefa / Para lembrar-me da tarefa.",
        "Só Para me lembrar, em qualquer construção.",
        "Só Para lembrar-me, em qualquer construção.",
        "Nenhuma forma com infinitivo."
      ],
      "answer": 0,
      "explanation": "A orientação admite antes e depois no caso dado.",
      "optionRationales": [
        "A orientação admite antes e depois no caso dado.",
        "A alternativa posterior também é admitida.",
        "A anterior também é admitida.",
        "O infinitivo foi ensinado."
      ],
      "recoverySectionIds": [
        "infinitivo"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "cp03",
          "sectionId": "entrada"
        }
      ],
      "groupId": "G4"
    },
    {
      "id": "cpchefe.q08",
      "prompt": "Em Para me lembrar da tarefa, qual posição me ocupa?",
      "options": [
        "No meio de futuro, em mesóclise.",
        "Depois, em ênclise.",
        "Antes do infinitivo, em próclise.",
        "É artigo do substantivo tarefa."
      ],
      "answer": 2,
      "explanation": "Me antecede lembrar.",
      "optionRationales": [
        "Não está dentro de forma futura.",
        "Não vem depois.",
        "Me antecede lembrar.",
        "Me não é artigo de tarefa."
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
          "sectionId": "infinitivo"
        }
      ],
      "groupId": "G4"
    },
    {
      "id": "cpchefe.q09",
      "prompt": "No exemplo Lembrar-me-ei da tarefa, qual posição foi ensinada?",
      "options": [
        "Ausência de pronome.",
        "Ênclise depois de toda a forma.",
        "Próclise antes de toda a forma.",
        "Mesóclise na forma futura exemplificada."
      ],
      "answer": 3,
      "explanation": "Me está no meio da forma futura.",
      "optionRationales": [
        "Me está presente.",
        "Não está depois de toda a forma.",
        "Não está antes de toda a forma.",
        "Me está no meio da forma futura."
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
          "sectionId": "meio"
        }
      ],
      "groupId": "G5"
    },
    {
      "id": "cpchefe.q10",
      "prompt": "Sob a hipótese de falante e ouvinte distintos, trocar Para lembrar-me por Para lembrar-te é só colocação?",
      "options": [
        "Sim: todo pronome tem a mesma referência.",
        "Não: troca a forma e a referência pessoal informada.",
        "Sim: te é apenas me depois do verbo.",
        "Não: muda obrigatoriamente o tempo verbal para passado."
      ],
      "answer": 1,
      "explanation": "Não desloca o mesmo pronome; troca a pessoa indicada.",
      "optionRationales": [
        "O caso distingue pessoas.",
        "Não desloca o mesmo pronome; troca a pessoa indicada.",
        "Te não é a mesma forma me.",
        "A mudança indicada não é de tempo verbal."
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
          "sectionId": "preservar"
        }
      ],
      "groupId": "G5"
    },
    {
      "id": "cpchefe.q11",
      "prompt": "Qual limite evita transformar o exemplo de infinitivo em regra universal?",
      "options": [
        "Proibir toda próclise ao infinitivo.",
        "Aplicar a mesma conclusão a qualquer locução.",
        "Não decidir todas as locuções e terminações sem ensino específico.",
        "Obrigar mesóclise em todos os infinitivos."
      ],
      "answer": 2,
      "explanation": "O recorte delimitou infinitivo simples e condições específicas.",
      "optionRationales": [
        "Próclise foi admitida no caso.",
        "Locuções amplas ficaram fora.",
        "O recorte delimitou infinitivo simples e condições específicas.",
        "Infinitivo simples não é futuro com mesóclise."
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
          "sectionId": "limites"
        }
      ],
      "groupId": "G6"
    },
    {
      "id": "cpchefe.q12",
      "prompt": "Você ignorou não sem pausa e marcou ênclise no verbo simples. Que recuperação se aplica?",
      "options": [
        "Identificar a negativa e retomar a próclise do caso formal ensinado.",
        "Apagar não para forçar a alternativa.",
        "Generalizar ênclise a toda frase.",
        "Inventar pausa ausente no enunciado."
      ],
      "answer": 0,
      "explanation": "A condição explicitada determina a recuperação.",
      "optionRationales": [
        "A condição explicitada determina a recuperação.",
        "Apagaria conteúdo original.",
        "Contraria o caso negativo ensinado.",
        "Não se pode alterar a hipótese dada."
      ],
      "recoverySectionIds": [
        "recuperacao"
      ],
      "objectiveIds": [
        "O4"
      ],
      "originRefs": [
        {
          "unit": "cp02",
          "sectionId": "ex-negativa"
        }
      ],
      "groupId": "G6"
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "cpchefe-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "cpchefe.q01": [
        {
          "missionId": "draft.cpchefe",
          "sectionId": "posicao"
        },
        {
          "missionId": "draft.cp01",
          "sectionId": "antes"
        }
      ],
      "cpchefe.q02": [
        {
          "missionId": "draft.cpchefe",
          "sectionId": "posicao"
        },
        {
          "missionId": "draft.cp01",
          "sectionId": "depois"
        }
      ],
      "cpchefe.q03": [
        {
          "missionId": "draft.cpchefe",
          "sectionId": "formal"
        },
        {
          "missionId": "draft.cp02",
          "sectionId": "negativa"
        }
      ],
      "cpchefe.q04": [
        {
          "missionId": "draft.cpchefe",
          "sectionId": "formal"
        },
        {
          "missionId": "draft.cp02",
          "sectionId": "condicao"
        }
      ],
      "cpchefe.q05": [
        {
          "missionId": "draft.cpchefe",
          "sectionId": "formal"
        },
        {
          "missionId": "draft.cp02",
          "sectionId": "inicio"
        }
      ],
      "cpchefe.q06": [
        {
          "missionId": "draft.cpchefe",
          "sectionId": "formal"
        },
        {
          "missionId": "draft.cp02",
          "sectionId": "inicio"
        }
      ],
      "cpchefe.q07": [
        {
          "missionId": "draft.cpchefe",
          "sectionId": "infinitivo"
        },
        {
          "missionId": "draft.cp03",
          "sectionId": "entrada"
        }
      ],
      "cpchefe.q08": [
        {
          "missionId": "draft.cpchefe",
          "sectionId": "infinitivo"
        },
        {
          "missionId": "draft.cp03",
          "sectionId": "infinitivo"
        }
      ],
      "cpchefe.q09": [
        {
          "missionId": "draft.cpchefe",
          "sectionId": "posicao"
        },
        {
          "missionId": "draft.cp01",
          "sectionId": "meio"
        }
      ],
      "cpchefe.q10": [
        {
          "missionId": "draft.cpchefe",
          "sectionId": "infinitivo"
        },
        {
          "missionId": "draft.cp03",
          "sectionId": "preservar"
        }
      ],
      "cpchefe.q11": [
        {
          "missionId": "draft.cpchefe",
          "sectionId": "infinitivo"
        },
        {
          "missionId": "draft.cp03",
          "sectionId": "limites"
        }
      ],
      "cpchefe.q12": [
        {
          "missionId": "draft.cpchefe",
          "sectionId": "recuperacao"
        },
        {
          "missionId": "draft.cp02",
          "sectionId": "ex-negativa"
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
  ],
  "groups": [
    {
      "id": "G1",
      "label": "Antes e depois",
      "units": [
        "cp01"
      ]
    },
    {
      "id": "G2",
      "label": "Negativa",
      "units": [
        "cp02"
      ]
    },
    {
      "id": "G3",
      "label": "Início formal",
      "units": [
        "cp02"
      ]
    },
    {
      "id": "G4",
      "label": "Infinitivo",
      "units": [
        "cp03"
      ]
    },
    {
      "id": "G5",
      "label": "Forma e pessoa",
      "units": [
        "cp01",
        "cp03"
      ]
    },
    {
      "id": "G6",
      "label": "Limites e recuperação",
      "units": [
        "cp02",
        "cp03"
      ]
    }
  ]
};
export const ARITHMETIC = [];
