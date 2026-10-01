// Rascunho editorial isolado; não importar no runtime.
export const SOURCES = [
  {
    "id": "bcb.ce.conceito",
    "label": "BCB — O que é câmbio",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/oqueecambio",
    "version": "Página pública renderizada em 01/10/2026",
    "locator": "Conversão, turismo, remessas e comércio exterior; links para instituições e VET",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "bcb.ce.instituicoes",
    "label": "BCB — Instituições do mercado de câmbio",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/instituicoescambio",
    "version": "Página pública renderizada em 01/10/2026",
    "locator": "Separação das consultas oficiais: operar, intermediar e correspondentes",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "lei.14286",
    "label": "Lei 14.286/2021 — câmbio",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14286.htm",
    "version": "Texto oficial consultado em 01/10/2026",
    "locator": "Arts. 2–5 e 19: taxa pactuada, autorização, finalidade e exceção eventual; sem procedimentos quantitativos",
    "checkedAt": "2026-10-01"
  }
];

export const CE07_DRAFT = {
  "id": "draft.ce07",
  "topicId": "draft.ce07",
  "editorialKey": "CE-07",
  "candidateBlockId": "banking.capital-exchange",
  "title": "Operações de câmbio: finalidade, instituição e condições",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Reconhecer operações básicas e a necessidade de identificar a instituição habilitada, a finalidade e as condições da contratação.",
  "sourceIds": [
    "bcb.ce.conceito",
    "bcb.ce.instituicoes",
    "lei.14286"
  ],
  "sections": [
    {
      "id": "inicio",
      "type": "explanation",
      "heading": "1. A operação tem uma finalidade",
      "body": "Depois de converter valores, identifique por que a moeda está sendo trocada. Viajar, transferir recursos ao exterior e pagar uma importação são exemplos distintos. O meio pode ser eletrônico: câmbio não exige que o cliente receba cédulas estrangeiras em todas as situações.",
      "sourceIds": [
        "bcb.ce.conceito"
      ]
    },
    {
      "id": "finalidades",
      "type": "explanation",
      "heading": "2. Vocabulário básico",
      "body": "Turismo é o contexto de uma viagem; remessa descreve o envio de recursos, cuja finalidade precisa ser identificada; importação envolve compra de bens ou serviços do exterior, e exportação, venda ao exterior. Uma transferência internacional não é, só por existir, pagamento de importação. É necessário ler o motivo informado.",
      "sourceIds": [
        "bcb.ce.conceito"
      ]
    },
    {
      "id": "ex-finalidade",
      "type": "worked-example",
      "heading": "3. Exemplo resolvido: dois pagamentos",
      "body": "No caso A, Eva remete recursos próprios para sua conta no exterior. No B, uma empresa brasileira paga uma máquina que comprou de fornecedor estrangeiro. O B é pagamento relacionado à importação. Não há informação que transforme o A em compra de mercadoria. Classificar a finalidade exige olhar a operação subjacente.",
      "sourceIds": []
    },
    {
      "id": "autorizacao",
      "type": "explanation",
      "heading": "4. Quem realiza a operação?",
      "body": "A regra legal é realizar operações no mercado de câmbio por meio de instituições autorizadas pelo BCB, nos limites aplicáveis. Uma marca, anúncio ou aplicativo não demonstra sozinho essa autorização. Identifique a pessoa jurídica responsável e consulte as informações oficiais do BCB para a atividade. O próprio BCB regula e fiscaliza; ele não se torna a contraparte de toda operação de um cliente.",
      "sourceIds": [
        "lei.14286",
        "bcb.ce.instituicoes"
      ]
    },
    {
      "id": "ex-canal",
      "type": "worked-example",
      "heading": "5. Exemplo resolvido: a tela não comprova a habilitação",
      "body": "Um site fictício afirma 'câmbio autorizado' sem identificar a instituição responsável. A frase publicitária não basta para confirmar a habilitação. O passo conceitual é identificar quem efetivamente realiza a operação e conferir a autorização pertinente. Não se conclui, apenas pela aparência do site, nem regularidade nem fraude.",
      "sourceIds": []
    },
    {
      "id": "regras",
      "type": "explanation",
      "heading": "6. Taxa negociada e responsabilidades",
      "body": "A Lei 14.286 permite livre pactuação da taxa entre instituições autorizadas e clientes, observada a legislação. Isso não elimina controles. A instituição deve identificar e qualificar clientes e assegurar processamento lícito. A classificação da finalidade é responsabilidade do cliente, com suporte técnico da instituição quando necessário. Não se inventa uma finalidade para obter uma condição diferente.",
      "sourceIds": [
        "lei.14286"
      ]
    },
    {
      "id": "ex-preco",
      "type": "worked-example",
      "heading": "7. Exemplo resolvido: propostas distintas",
      "body": "Para a mesma operação, duas instituições apresentam cotações diferentes. Isso, sozinho, não demonstra irregularidade nem obrigação de cobrar uma taxa única fixada pelo BCB. É preciso comparar as condições e o custo total. A liberdade de pactuar preço não dispensa autorização e obrigações legais.",
      "sourceIds": [
        "lei.14286"
      ]
    },
    {
      "id": "ressalva",
      "type": "explanation",
      "heading": "8. Evitar uma regra absoluta falsa",
      "body": "O art. 19 da Lei 14.286 prevê uma exceção delimitada para compra e venda de moeda estrangeira em espécie entre pessoas físicas, de forma eventual e não profissional, até o limite legal. Esta aula não ensina o valor do limite nem um procedimento para utilizá-lo. A existência dessa exceção impede afirmar que qualquer troca entre duas pessoas é necessariamente proibida. Ela também não autoriza uma atividade profissional de câmbio sem habilitação.",
      "sourceIds": [
        "lei.14286"
      ]
    },
    {
      "id": "ex-meio",
      "type": "worked-example",
      "heading": "9. Exemplo resolvido: remessa sem cédulas",
      "body": "Uma empresa contrata com instituição habilitada o pagamento eletrônico de uma importação. Não retira dólares em papel. Isso é compatível com o conceito de operação cambial: a finalidade é pagar o fornecedor no exterior e a liquidação não precisa ocorrer por entrega de cédulas ao cliente. Forma eletrônica não dispensa os controles da operação.",
      "sourceIds": [
        "bcb.ce.conceito",
        "lei.14286"
      ]
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "10. Vocabulário essencial",
      "body": "Remessa: envio de recursos, com finalidade própria. Importação: compra do exterior. Exportação: venda ao exterior. Instituição autorizada: responsável habilitado para a atividade no âmbito aplicável. Canal: meio de acesso à operação. Pactuação: acordo sobre condições, dentro das regras.",
      "sourceIds": []
    },
    {
      "id": "retomada",
      "type": "summary",
      "heading": "11. Síntese e recuperação",
      "body": "Se confundiu remessa com importação, releia finalidades e ex-finalidade. Se confiou só no aplicativo, retome autorizacao e ex-canal. Se confundiu preço livre com ausência de regra, volte a regras. Para afirmações com 'qualquer' ou 'sempre', confira ressalva e ex-meio antes de escolher.",
      "sourceIds": []
    }
  ],
  "questions": [
    {
      "id": "ce07.q01",
      "prompt": "Uma empresa paga no exterior uma mercadoria comprada de fornecedor estrangeiro. A finalidade descrita está relacionada a:",
      "options": [
        "Dividendo obrigatório de ação.",
        "Turismo, necessariamente.",
        "Importação.",
        "Resgate de cota, necessariamente."
      ],
      "answer": 2,
      "explanation": "O pagamento decorre de compra de mercadoria do exterior.",
      "optionRationales": [
        "Não há distribuição societária no caso.",
        "Não há viagem informada.",
        "Correta: é o fato descrito.",
        "Não há fundo no enunciado."
      ],
      "objectiveIds": [
        "O1"
      ],
      "recoverySectionIds": [
        "finalidades",
        "ex-finalidade"
      ]
    },
    {
      "id": "ce07.q02",
      "prompt": "Um aplicativo exibe 'câmbio autorizado', sem identificar quem contrata a operação. Qual é a leitura adequada?",
      "options": [
        "A frase prova habilitação de qualquer operador.",
        "O BCB será necessariamente o vendedor da moeda.",
        "O uso de aplicativo dispensa instituição responsável.",
        "É preciso identificar a instituição e conferir a autorização pertinente no BCB."
      ],
      "answer": 3,
      "explanation": "O canal não substitui a identificação e a verificação da instituição.",
      "optionRationales": [
        "Publicidade não é prova suficiente.",
        "Regular não significa ser contraparte de toda operação.",
        "A forma digital não elimina responsabilidades.",
        "Correta: a verificação se refere ao responsável e à atividade."
      ],
      "objectiveIds": [
        "O2"
      ],
      "recoverySectionIds": [
        "autorizacao",
        "ex-canal"
      ]
    },
    {
      "id": "ce07.q03",
      "prompt": "Duas instituições autorizadas oferecem taxas diferentes para o mesmo tipo de operação. Essa diferença, isoladamente:",
      "options": [
        "É compatível com a livre pactuação, observada a legislação.",
        "Prova que uma delas opera ilegalmente.",
        "Prova que não há controles legais.",
        "Significa que o cliente deve usar a média das taxas."
      ],
      "answer": 0,
      "explanation": "A lei não impõe uma cotação única de varejo para toda operação.",
      "optionRationales": [
        "Correta: o preço é pactuado dentro do marco legal.",
        "A diferença de preço não basta para tal conclusão.",
        "Liberdade de preço convive com regras.",
        "A média não se torna taxa contratada por essa razão."
      ],
      "objectiveIds": [
        "O3"
      ],
      "recoverySectionIds": [
        "regras",
        "ex-preco"
      ]
    },
    {
      "id": "ce07.q04",
      "prompt": "Sobre a classificação da finalidade, qual afirmativa corresponde ao recorte legal estudado?",
      "options": [
        "Pode ser inventada se reduzir o custo.",
        "É responsabilidade do cliente, com suporte técnico da instituição quando necessário.",
        "Nunca envolve informação do cliente.",
        "Dispensa controles de licitude pela instituição."
      ],
      "answer": 1,
      "explanation": "O art. 4º separa a informação de finalidade dos deveres da instituição.",
      "optionRationales": [
        "A classificação deve corresponder à operação.",
        "Correta: preserva os dois papéis.",
        "O cliente tem responsabilidade expressa.",
        "A finalidade não elimina os deveres institucionais."
      ],
      "objectiveIds": [
        "O4"
      ],
      "recoverySectionIds": [
        "regras"
      ]
    },
    {
      "id": "ce07.q05",
      "prompt": "Uma pessoa remete recursos próprios à sua conta no exterior. Sem outra informação, qual conclusão é segura?",
      "options": [
        "Toda remessa é pagamento de importação.",
        "A operação é necessariamente turística.",
        "A finalidade não importa em nenhuma remessa.",
        "Há uma remessa; não se pode presumir compra de mercadoria."
      ],
      "answer": 3,
      "explanation": "Enviar recursos e comprar mercadoria são fatos que podem ou não coexistir.",
      "optionRationales": [
        "A regra é excessiva.",
        "Não há viagem informada.",
        "A finalidade integra a compreensão da operação.",
        "Correta: lê apenas os fatos fornecidos."
      ],
      "objectiveIds": [
        "O1"
      ],
      "recoverySectionIds": [
        "finalidades",
        "ex-finalidade"
      ]
    },
    {
      "id": "ce07.q06",
      "prompt": "Um pagamento de importação é processado eletronicamente por instituição habilitada. O cliente não retira cédulas. Isso:",
      "options": [
        "É compatível com operação cambial sem entrega de cédulas ao cliente.",
        "Impede que exista câmbio.",
        "Dispensa todos os controles legais.",
        "Transforma a importação em turismo."
      ],
      "answer": 0,
      "explanation": "Câmbio não se limita à compra de dinheiro em papel.",
      "optionRationales": [
        "Correta: a forma de liquidação pode ser eletrônica.",
        "O meio eletrônico não afasta o conceito.",
        "A forma de liquidação não afasta deveres.",
        "O meio não troca a finalidade."
      ],
      "objectiveIds": [
        "O5"
      ],
      "recoverySectionIds": [
        "inicio",
        "ex-meio"
      ]
    },
    {
      "id": "ce07.q07",
      "prompt": "Qual frase evita absolutizar a regra de autorização?",
      "options": [
        "Qualquer troca entre pessoas físicas é sempre proibida.",
        "Existe uma exceção legal delimitada para troca eventual e não profissional em espécie entre pessoas físicas.",
        "A exceção para espécie permite atividade profissional irrestrita.",
        "A existência de uma exceção revoga todos os controles do mercado."
      ],
      "answer": 1,
      "explanation": "A ressalva do art. 19 tem condições e limite próprios, não estudados quantitativamente aqui.",
      "optionRationales": [
        "Ignora a exceção legal.",
        "Correta: reconhece a ressalva sem ampliá-la.",
        "A condição é justamente não profissional.",
        "Uma exceção delimitada não elimina o regime geral."
      ],
      "objectiveIds": [
        "O2",
        "O3"
      ],
      "recoverySectionIds": [
        "ressalva"
      ]
    },
    {
      "id": "ce07.q08",
      "prompt": "Ao comparar propostas cambiais para a mesma operação, qual informação é relevante além da cotação isolada?",
      "options": [
        "Só a cor do aplicativo.",
        "Só a expressão 'oferta especial'.",
        "Responsável pela operação, condições e custo total.",
        "Nenhuma outra informação."
      ],
      "answer": 2,
      "explanation": "Preço, identificação e condições são dimensões complementares.",
      "optionRationales": [
        "A aparência não informa habilitação e custo.",
        "Publicidade não substitui os dados da operação.",
        "Correta: reúne os elementos necessários ao recorte.",
        "A cotação isolada é insuficiente."
      ],
      "objectiveIds": [
        "O2",
        "O3",
        "O5"
      ],
      "recoverySectionIds": [
        "autorizacao",
        "ex-preco"
      ]
    }
  ],
  "recall": [
    "Explique os conceitos sem consultar e confira a seção de origem.",
    "Refaça o exemplo, separando dados, hipótese e conclusão.",
    "Quando errar, nomeie a confusão e retome as seções indicadas antes de tentar novamente."
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "ce07-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "ce07.q01": [
        {
          "missionId": "draft.ce07",
          "sectionId": "finalidades"
        },
        {
          "missionId": "draft.ce07",
          "sectionId": "ex-finalidade"
        }
      ],
      "ce07.q02": [
        {
          "missionId": "draft.ce07",
          "sectionId": "autorizacao"
        },
        {
          "missionId": "draft.ce07",
          "sectionId": "ex-canal"
        }
      ],
      "ce07.q03": [
        {
          "missionId": "draft.ce07",
          "sectionId": "regras"
        },
        {
          "missionId": "draft.ce07",
          "sectionId": "ex-preco"
        }
      ],
      "ce07.q04": [
        {
          "missionId": "draft.ce07",
          "sectionId": "regras"
        }
      ],
      "ce07.q05": [
        {
          "missionId": "draft.ce07",
          "sectionId": "finalidades"
        },
        {
          "missionId": "draft.ce07",
          "sectionId": "ex-finalidade"
        }
      ],
      "ce07.q06": [
        {
          "missionId": "draft.ce07",
          "sectionId": "inicio"
        },
        {
          "missionId": "draft.ce07",
          "sectionId": "ex-meio"
        }
      ],
      "ce07.q07": [
        {
          "missionId": "draft.ce07",
          "sectionId": "ressalva"
        }
      ],
      "ce07.q08": [
        {
          "missionId": "draft.ce07",
          "sectionId": "autorizacao"
        },
        {
          "missionId": "draft.ce07",
          "sectionId": "ex-preco"
        }
      ]
    }
  }
};

export const EDITORIAL = {
  "stage": "Rascunho fora do catálogo; revisão independente agrupada e humana pendentes",
  "referenceOnlyProfiles": [
    {
      "id": "bb.agente-comercial.2022-001",
      "item": "Item 7 — instituições autorizadas e operações básicas",
      "status": "histórico; referenceOnly"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Item 21 — instituições autorizadas e operações básicas",
      "status": "histórico; referenceOnly"
    }
  ],
  "objectives": {
    "O1": "Identificar turismo, remessa e pagamento comercial em casos simples.",
    "O2": "Separar instituição habilitada, canal e autoridade reguladora.",
    "O3": "Distinguir taxa livremente pactuada de ausência de regras.",
    "O4": "Relacionar finalidade informada pelo cliente e controles da instituição.",
    "O5": "Ler a operação sem impor uso de cédulas ou exigências não informadas.",
    "O6": "Recuperar a confusão conceitual pela seção de origem e reconstruir o caso."
  },
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Retomar as seções por questão, explicar o erro e refazer o raciocínio; sem indicador novo de domínio."
  },
  "limits": [
    "Lei 14.286/2021, arts. 2º–5º e ressalva do art. 19; sem limites quantitativos, formulários, tributação ou roteiro de contratação real. Não substitui normas operacionais específicas.",
    "Casos e valores fictícios; educação geral, sem recomendação de investimento ou procedimento para caso real. Não representa cobertura integral dos itens históricos.",
    "Prática exposta, não avaliação independente. IDs editoriais, sem XP/ordem/desbloqueio; publicação.status draft e nenhuma importação no runtime.",
    "Fontes novas consultadas em 01/10/2026; consultas reaproveitadas preservam a data original. Confirmar mudanças normativas pertinentes antes de publicação."
  ]
};

export const ARITHMETIC = [];
