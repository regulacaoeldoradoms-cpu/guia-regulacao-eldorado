// Ensino e frases autorais; rascunho local desativado.
export const SOURCES = [
  {
    "id": "senado.virgula",
    "label": "Senado Federal — Manual de Comunicação: vírgula",
    "url": "https://www12.senado.leg.br/manualdecomunicacao/estilos/virgula",
    "version": "Manual de Comunicação, página HTML consultada em 04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "Não separe; Use vírgula: enumeração, termos explicativos/deslocados; ressalva de adjunto curto"
  },
  {
    "id": "funag.virgula",
    "label": "FUNAG — Manual de Revisão: vírgula (reprodução de Cunha/Cintra)",
    "url": "https://funag.gov.br/manual/index.php?title=V%C3%ADrgula&oldid=490",
    "version": "Página institucional oldid490; atribuição a Cunha/Cintra, Nova gramática, 3ª ed., 2003, pp.644–650",
    "checkedAt": "2026-10-04",
    "locator": "I.1 e observação (enumeração); I.2 a/b (aposto/vocativo); II.4 e observação (explicativa/restritiva)"
  }
];
export const PUR_DRAFT = {
  "id": "draft.pur",
  "topicId": "draft.pur",
  "editorialKey": "PU-R",
  "candidateBlockId": "portuguese.syntax",
  "title": "Revisão: pontuação com estrutura e alcance",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Relacionar pontuação, estrutura e alcance em frases simples ensinadas, sem generalizar o recorte.",
  "sourceIds": [
    "senado.virgula",
    "funag.virgula"
  ],
  "sections": [
    {
      "id": "entrada",
      "heading": "1. Recuperar o vínculo",
      "body": "Esta revisão aplica PU-01/02/03 em oito contextos novos. Antes de escolher, localize verbo/locução, grupos e função do trecho. Revisão com consulta não é avaliação independente nem prova de retenção.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "nucleo",
      "heading": "2. Exemplo resolvido: não contar palavras",
      "body": "Em O grupo vai revisar a nota., vai revisar é uma locução que organiza uma oração no período dado. Em O grupo leu a nota e a turma escreveu o resumo., leu/escreveu organizam duas orações no mesmo período. A ligação é decidida pela estrutura, não por contar palavras verbais isoladas.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "estrutura",
      "heading": "3. Exemplo resolvido: delimitar observação",
      "body": "Se conforme o combinado for tratado como observação intercalada delimitada, escreva A equipe, conforme o combinado, leu o roteiro. A estrutura básica é A equipe leu o roteiro. Não conservar só o sinal inicial da intercalação nem inserir outro entre leu e o roteiro.",
      "type": "worked-example",
      "sourceIds": [
        "senado.virgula",
        "funag.virgula"
      ]
    },
    {
      "id": "sentido",
      "heading": "4. Exemplo resolvido: chamada e alcance",
      "body": "Em Colegas, a proposta chegou, Colegas é chamada e a proposta é sujeito. Em Os colegas que leram a proposta responderam, a leitura identifica o grupo referido; com o trecho entre duas vírgulas, ela é apresentada como explicação do conjunto referido. Nenhuma dessas formas obriga ampliar o referente para toda a escola.",
      "type": "worked-example",
      "sourceIds": [
        "funag.virgula"
      ]
    },
    {
      "id": "retomadas",
      "heading": "5. Voltar à origem do erro",
      "body": "Consulte [PU-01](pu-01-v1.md), [PU-02](pu-02-v1.md) ou [PU-03](pu-03-v1.md). Explique que vínculo uma alternativa quebra ou que informação ela acrescenta. Refaça um exemplo próximo, distinguindo contagem de oração, posição da vírgula e sentido da delimitação.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "heading": "Vocabulário de apoio",
      "body": "Frase comunica algo em uma situação; oração organiza-se em torno de verbo ou locução verbal; período contém uma ou mais orações nos exemplos. Termos são palavras/grupos com função, como sujeito e complemento. Intercalação insere informação entre partes da estrutura. Vocativo chama o interlocutor; aposto explicativo esclarece um termo. Restrição identifica o grupo referido; explicação acrescenta informação sobre ele. Esses termos têm ensino e exemplos no recorte, não uma classificação completa.",
      "type": "glossary",
      "sourceIds": []
    },
    {
      "id": "recuperacao",
      "heading": "Refazer pela estrutura e pelo sentido",
      "body": "Localize verbo/locução e grupos; marque qual função tem o trecho e o que a pergunta pede. Retome o exemplo de origem e compare a alternativa escolhida. Se houve mudança de vírgulas, explique o sentido preservado ou alterado. Não decidir pelo comprimento da frase nem só por uma pausa de respiração.",
      "type": "summary",
      "sourceIds": []
    }
  ],
  "recall": [
    "Qual verbo/locução e quais grupos aparecem?",
    "O trecho é sujeito, complemento, intercalação, chamada ou explicação?",
    "As vírgulas conservam a estrutura e o alcance pretendido?"
  ],
  "questions": [
    {
      "id": "pur.q01",
      "prompt": "Em A turma vai preparar a proposta., que análise segue o recorte ensinado?",
      "options": [
        "Frase sem verbo porque vai é apenas pontuação.",
        "Dois períodos porque há duas palavras verbais.",
        "Três orações porque turma, preparar e proposta são palavras diferentes.",
        "Um período com uma oração organizada pela locução vai preparar."
      ],
      "answer": 3,
      "explanation": "A locução organiza uma oração e o ponto encerra o período dado.",
      "optionRationales": [
        "Vai preparar tem formas verbais.",
        "Confunde palavra verbal e período.",
        "Palavras não contam orações mecanicamente.",
        "A locução organiza uma oração e o ponto encerra o período dado."
      ],
      "recoverySectionIds": [
        "nucleo"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "pu01",
          "sectionId": "ex-uma"
        }
      ]
    },
    {
      "id": "pur.q02",
      "prompt": "Qual conclusão sobre a saudação Boa noite! evita generalização pelo sinal?",
      "options": [
        "Toda exclamação corresponde a duas orações.",
        "Ela comunica algo sem verbo expresso; a exclamação não cria uma oração.",
        "Noite se torna verbo antes de exclamação.",
        "Frases só podem comunicar quando têm verbo."
      ],
      "answer": 1,
      "explanation": "Conserva a frase sem núcleo verbal expresso no caso.",
      "optionRationales": [
        "Sinal não decide essa contagem.",
        "Conserva a frase sem núcleo verbal expresso no caso.",
        "Noite é substantivo.",
        "A saudação é exemplo de frase sem verbo."
      ],
      "recoverySectionIds": [
        "nucleo"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "pu01",
          "sectionId": "ex-frase"
        }
      ]
    },
    {
      "id": "pur.q03",
      "prompt": "Qual frase em ordem simples, sem intercalação/inversão, conserva sujeito/verbo e verbo/complemento?",
      "options": [
        "O grupo atento conferiu a pauta.",
        "O grupo atento, conferiu a pauta.",
        "O grupo atento conferiu, a pauta.",
        "O grupo, atento conferiu a pauta."
      ],
      "answer": 0,
      "explanation": "Não quebra os grupos ligados na estrutura simples pedida.",
      "optionRationales": [
        "Não quebra os grupos ligados na estrutura simples pedida.",
        "Insere quebra sujeito/verbo.",
        "Insere quebra verbo/complemento.",
        "Não delimita uma observação intercalada; quebra o grupo simples."
      ],
      "recoverySectionIds": [
        "estrutura"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "pu02",
          "sectionId": "ex-estrutura"
        }
      ]
    },
    {
      "id": "pur.q04",
      "prompt": "Tratando segundo o combinado como observação intercalada delimitada por vírgulas, qual forma cumpre a instrução?",
      "options": [
        "A equipe segundo o combinado, revisou o texto.",
        "A equipe, segundo o combinado revisou o texto.",
        "A equipe, segundo o combinado, revisou o texto.",
        "A equipe segundo o combinado revisou o texto."
      ],
      "answer": 2,
      "explanation": "Os dois limites da observação estão marcados.",
      "optionRationales": [
        "Falta limite inicial.",
        "Falta limite final.",
        "Os dois limites da observação estão marcados.",
        "Não cumpre a delimitação por vírgulas pedida, sem afirmar impossibilidade de outra organização."
      ],
      "recoverySectionIds": [
        "estrutura"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "pu02",
          "sectionId": "ex-intercalacao"
        }
      ]
    },
    {
      "id": "pur.q05",
      "prompt": "Em Colegas, o material chegou, qual análise distingue chamada e sujeito?",
      "options": [
        "Colegas é sujeito; o material é vocativo.",
        "Colegas é vocativo; o material é sujeito.",
        "Chegou é substantivo dentro do vocativo.",
        "Todo termo inicial é sujeito, mesmo em chamada."
      ],
      "answer": 1,
      "explanation": "A chegada é declarada sobre o material; Colegas dirige a mensagem.",
      "optionRationales": [
        "Troca as funções.",
        "A chegada é declarada sobre o material; Colegas dirige a mensagem.",
        "Chegou é verbo expresso.",
        "A chamada é contraste à regra falsa."
      ],
      "recoverySectionIds": [
        "sentido"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "pu03",
          "sectionId": "ex-chamada"
        }
      ]
    },
    {
      "id": "pur.q06",
      "prompt": "Compare O grupo leu a nota. A turma escreveu o resumo. com O grupo leu a nota e a turma escreveu o resumo. Qual distinção é ensinada?",
      "options": [
        "Leu e escreveu sempre formam uma única locução.",
        "Os dois trechos obrigatoriamente têm três períodos.",
        "O segundo não tem oração por conter e.",
        "O primeiro trecho tem dois períodos; o segundo reúne duas orações em um período."
      ],
      "answer": 3,
      "explanation": "A organização escrita e os núcleos expressos distinguem os casos.",
      "optionRationales": [
        "Os verbos pertencem a orações com sujeitos distintos.",
        "Não há os três encerramentos indicados.",
        "E liga as orações.",
        "A organização escrita e os núcleos expressos distinguem os casos."
      ],
      "recoverySectionIds": [
        "nucleo"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "pu01",
          "sectionId": "periodo"
        }
      ]
    },
    {
      "id": "pur.q07",
      "prompt": "Na enumeração simples de pauta, lista e resumo com último item ligado por e, qual escrita corresponde ao modelo?",
      "options": [
        "A turma conferiu, a pauta a lista e o resumo.",
        "A turma, conferiu a pauta a lista e o resumo.",
        "A turma conferiu a pauta, a lista e o resumo.",
        "A turma conferiu a pauta a lista, e o resumo."
      ],
      "answer": 2,
      "explanation": "A vírgula separa os primeiros itens da lista solicitada.",
      "optionRationales": [
        "Quebra verbo/primeiro complemento.",
        "Quebra sujeito/verbo e não separa os primeiros itens.",
        "A vírgula separa os primeiros itens da lista solicitada.",
        "Não separa pauta e lista como itens no modelo pedido."
      ],
      "recoverySectionIds": [
        "estrutura"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "pu02",
          "sectionId": "ex-lista"
        }
      ]
    },
    {
      "id": "pur.q08",
      "prompt": "Um estudante diz que Os alunos que leram a pauta responderam prova necessariamente a existência de alunos que não leram. Qual retomada corrige?",
      "options": [
        "A restrição identifica o grupo referido, sem obrigar a existência de excluídos.",
        "Toda restrição afirma que existe pelo menos um excluído.",
        "Retirar vírgulas sempre torna toda informação falsa.",
        "A frase fala de todos os alunos do país."
      ],
      "answer": 0,
      "explanation": "Não acrescenta existência ou universo não dados.",
      "optionRationales": [
        "Não acrescenta existência ou universo não dados.",
        "Generaliza além do alcance da construção.",
        "Pontuação não é uma regra de falsidade universal.",
        "Amplia o referente sem apoio."
      ],
      "recoverySectionIds": [
        "sentido"
      ],
      "objectiveIds": [
        "O4"
      ],
      "originRefs": [
        {
          "unit": "pu03",
          "sectionId": "restricao"
        }
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "pur-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "pur.q01": [
        {
          "missionId": "draft.pur",
          "sectionId": "nucleo"
        }
      ],
      "pur.q02": [
        {
          "missionId": "draft.pur",
          "sectionId": "nucleo"
        }
      ],
      "pur.q03": [
        {
          "missionId": "draft.pur",
          "sectionId": "estrutura"
        }
      ],
      "pur.q04": [
        {
          "missionId": "draft.pur",
          "sectionId": "estrutura"
        }
      ],
      "pur.q05": [
        {
          "missionId": "draft.pur",
          "sectionId": "sentido"
        }
      ],
      "pur.q06": [
        {
          "missionId": "draft.pur",
          "sectionId": "nucleo"
        }
      ],
      "pur.q07": [
        {
          "missionId": "draft.pur",
          "sectionId": "estrutura"
        }
      ],
      "pur.q08": [
        {
          "missionId": "draft.pur",
          "sectionId": "sentido"
        }
      ]
    }
  }
};
export const EDITORIAL = {
  "stage": "Rascunho local fora do catálogo; parecer pedagógico independente concluído, precisão da justificativa PU-03 q5 aplicada",
  "objectives": {
    "O1": "Identificar oração, grupo e função do trecho.",
    "O2": "Aplicar a pontuação delimitada nos exemplos.",
    "O3": "Comparar estrutura e alcance sem regra universal.",
    "O4": "Retomar ensino e corrigir o vínculo ignorado."
  },
  "recovery": {
    "objectiveId": "O4",
    "instruction": "Localizar verbo/grupos, identificar função do trecho e justificar pontuação e alcance."
  },
  "limits": [
    "Plano05/bloco portuguese.syntax existente, após CF; BB/CAIXA históricos/referenceOnly, sem cobertura integral ou fase formal.",
    "Frases, nomes e questões são autorais/fictícios; sem instruções de casos reais ou atribuição bibliográfica fictícia.",
    "Recorte introdutório; não todas as classes de orações, sinais, vírgulas, conjunções, citações, abreviaturas ou regras estilísticas.",
    "Referências de pontuação conferidas em04/10/2026 somente nas afirmações pertinentes; página FUNAG reproduz Cunha/Cintra2003, sem autoria original atribuída à FUNAG. Exemplos e itens continuam autorais.",
    "Sem XP/ordem/runtime/push/ativação/merge/deploy/D1; revisão/Chefe não são avaliação independente ou prova de retenção."
  ]
};
export const ARITHMETIC = [];
