// Rascunho editorial isolado; não importar no runtime.
export const SOURCES = [
  {
    "id": "lei.is.abono",
    "label": "Planalto — Lei 7.998/1990",
    "url": "https://www.planalto.gov.br/ccivil_03/leis/l7998.htm",
    "locator": "Arts. 9º, §§ 2º–4º, e 9º-A; ler com a Constituição, sem universalizar o antigo limite de renda",
    "version": "Texto oficial consultado em 03/10/2026; corte normativo declarado na aula",
    "checkedAt": "2026-10-03"
  },
  {
    "id": "cf.is.abono",
    "label": "Planalto — EC 135/2024",
    "url": "https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc135.htm",
    "locator": "Art. 1º, nova redação do art. 239, §§ 3º e 3º-A, da Constituição; transição do critério de renda",
    "version": "Texto oficial consultado em 03/10/2026; corte normativo declarado na aula",
    "checkedAt": "2026-10-03"
  },
  {
    "id": "mte.is.abono",
    "label": "MTE — Abono Salarial",
    "url": "https://www.gov.br/trabalho-e-emprego/pt-br/servicos/trabalhador/abono-salarial",
    "locator": "Quem pode utilizar o serviço, canais pagadores e distinção calendário 2026/ano-base 2024; sem copiar tabela/calendário",
    "version": "Texto oficial consultado em 03/10/2026; corte normativo declarado na aula",
    "checkedAt": "2026-10-03"
  }
];

export const IS02_DRAFT = {
  "id": "draft.is02",
  "topicId": "draft.is02",
  "editorialKey": "IS-02",
  "candidateBlockId": "banking.institution-specific",
  "title": "Abono salarial: ano-base, habilitação e proporcionalidade",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Ler requisitos cumulativos, período de referência e cálculo proporcional do abono sob hipóteses explícitas.",
  "sourceIds": [
    "lei.is.abono",
    "cf.is.abono",
    "mte.is.abono"
  ],
  "sections": [
    {
      "id": "periodos",
      "heading": "1. Dois períodos diferentes",
      "body": "Ano-base é o período cujos dados de trabalho e remuneração são examinados. Exercício de pagamento é o calendário em que o benefício será pago. Eles não precisam coincidir. O serviço oficial do MTE informa calendário 2026 associado ao ano-base 2024. Esse exemplo é datado: não é regra de que todo calendário futuro terá sempre esse mesmo ano-base.",
      "type": "explanation",
      "sourceIds": [
        "mte.is.abono"
      ]
    },
    {
      "id": "ex-periodos",
      "heading": "2. Exemplo resolvido: ler cada coluna",
      "body": "Uma ficha didática informa ano-base 2024 e pagamento no calendário 2026. Para verificar a atividade do caso, procuramos o período 2024. Para identificar o calendário informado, usamos 2026. Não deslocamos os dados de trabalho automaticamente para o ano em que o dinheiro é pago.",
      "type": "worked-example",
      "sourceIds": [
        "mte.is.abono"
      ]
    },
    {
      "id": "condicoes",
      "heading": "3. Requisitos se combinam",
      "body": "Entre os requisitos estão o vínculo com empregador contribuinte, atividade remunerada por ao menos 30 dias no ano-base e cadastro há pelo menos cinco anos. Também importam o critério de renda aplicável e o correto processamento das informações. Cumprir um requisito isolado não equivale a cumprir todos. Nos exercícios de valor, a habilitação completa será fornecida como hipótese, para não decidir um caso real a partir de dados parciais.",
      "type": "explanation",
      "sourceIds": [
        "lei.is.abono"
      ]
    },
    {
      "id": "renda",
      "heading": "4. Critério de renda e corte temporal",
      "body": "O texto da Lei 7.998 contém a referência histórica de renda. Sua leitura atual precisa considerar a EC 135/2024, que alterou o art. 239 da Constituição e estabeleceu regra de atualização/transição a partir de 2026. Não aplicaremos automaticamente dois salários mínimos correntes como limite de todo exercício. Esta unidade não fixa teto de renda nem calendário para futuros pedidos; exige consultar a regra pertinente ao exercício.",
      "type": "explanation",
      "sourceIds": [
        "cf.is.abono"
      ]
    },
    {
      "id": "ex-condicoes",
      "heading": "5. Exemplo resolvido: condição necessária não é suficiente",
      "body": "O caso informa que Alice trabalhou 40 dias no ano-base, mas possui apenas dois anos de cadastro. Para o requisito de cadastro ensinado, dois anos não atingem cinco. O fato de superar 30 dias de atividade não resolve a condição que falta. Se o enunciado não informasse o tempo de cadastro, a conclusão seria insuficiência de dados, não reprovação automática.",
      "type": "worked-example",
      "sourceIds": [
        "lei.is.abono"
      ]
    },
    {
      "id": "proporcao",
      "heading": "6. Doze avos e mês computável",
      "body": "Para pessoa já habilitada, o valor é proporcional aos meses trabalhados no ano-base: salário mínimo vigente no pagamento dividido por 12, multiplicado pelos meses computáveis. A fração igual ou superior a 15 dias de trabalho conta como mês integral para essa finalidade. A Lei 7.998 prevê emissão em unidades inteiras de moeda, elevando eventual fração decimal à unidade inteira seguinte. Não confundimos essa regra específica com arredondamento comum de centavos.",
      "type": "explanation",
      "sourceIds": [
        "lei.is.abono"
      ]
    },
    {
      "id": "ex-calculo",
      "heading": "7. Exemplo resolvido: seis meses, com habilitação dada",
      "body": "Considere pessoa já habilitada, seis meses computáveis e salário mínimo hipotético de R$ 1.500 no pagamento. Primeiro calculamos 1.500 ÷ 12 = 125. Depois 125 × 6 = 750. O valor didático é R$ 750. Usamos um salário mínimo hipotético para explicar a operação, não o valor legal de 2026. Ter seis meses tampouco prova, por si só, os demais requisitos de habilitação.",
      "type": "worked-example",
      "sourceIds": [
        "lei.is.abono"
      ]
    },
    {
      "id": "ex-fracao",
      "heading": "8. Exemplo resolvido: dias e valor fracionado",
      "body": "No caso de uma pessoa já habilitada, um período de 16 dias de trabalho em determinado mês é computável como mês integral nessa regra. Não significa que todo benefício trabalhista use a mesma contagem. Em outro cálculo já completo, o resultado antes da emissão é R$ 250,20: a regra específica do abono leva a R$ 251. Não transformamos o resultado em R$ 250 nem em R$ 250,20 para emissão.",
      "type": "worked-example",
      "sourceIds": [
        "lei.is.abono"
      ]
    },
    {
      "id": "glossario",
      "heading": "Glossário",
      "body": "**Programa:** estrutura de objetivos e regras. **Benefício:** prestação prevista para quem satisfaz condições. **Ano-base:** período usado para verificar dados. **Operador/pagador:** entidade que executa funções atribuídas; não elimina requisitos legais. **Hipótese didática:** dado fixado para resolver um exercício, sem prometer resultado de um pedido real.",
      "type": "glossary",
      "sourceIds": []
    },
    {
      "id": "resumo",
      "heading": "Resumo e recuperação",
      "body": "Identifique primeiro o objeto e o período. Depois separe pessoa interessada, requisitos e função da instituição. Se errar uma distinção, releia o trecho indicado, refaça o exemplo em palavras próprias e explique por que a alternativa escolhida excedeu os dados. Conclusão da prática não prova retenção nem autoriza uma operação real.",
      "type": "summary",
      "sourceIds": []
    }
  ],
  "recall": [
    "Qual é o objeto tratado e qual período foi informado?",
    "Que conclusão depende de requisito adicional?",
    "Como você resolveria novamente o exemplo sem olhar o gabarito?"
  ],
  "questions": [
    {
      "id": "is02.q01",
      "prompt": "A ficha informa ano-base 2024 e calendário 2026. Qual período contém os dados de atividade examinados?",
      "options": [
        "2024.",
        "2026 necessariamente.",
        "Qualquer ano sem distinção.",
        "Somente o dia da consulta."
      ],
      "answer": 0,
      "explanation": "É o ano-base explicitado.",
      "optionRationales": [
        "É o ano-base explicitado.",
        "Pagamento e atividade não se confundem.",
        "O enunciado especificou o período.",
        "Uma data de consulta não substitui o ano-base."
      ],
      "recoverySectionIds": [
        "periodos",
        "ex-periodos"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "is02.q02",
      "prompt": "Alice trabalhou 40 dias no ano-base e tem dois anos de cadastro. Sobre o requisito de cinco anos, qual conclusão é correta?",
      "options": [
        "A atividade dispensa o cadastro.",
        "O requisito de cadastro indicado não está cumprido.",
        "Dois anos equivalem automaticamente a cinco.",
        "Qualquer conta bancária completa os anos faltantes."
      ],
      "answer": 1,
      "explanation": "Dois é inferior ao mínimo ensinado.",
      "optionRationales": [
        "Requisitos se combinam.",
        "Dois é inferior ao mínimo ensinado.",
        "Não existe equivalência de períodos.",
        "Uma conta não substitui o requisito."
      ],
      "recoverySectionIds": [
        "condicoes",
        "ex-condicoes"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "is02.q03",
      "prompt": "O enunciado informa somente 40 dias de atividade e silencia sobre renda, cadastro e demais condições. É possível afirmar habilitação completa?",
      "options": [
        "Sim, só os dias importam.",
        "Não; logo a pessoa nunca será beneficiária.",
        "Não há dados suficientes para afirmar habilitação completa.",
        "Sim, se o telefone for recente."
      ],
      "answer": 2,
      "explanation": "Preserva a insuficiência de informações.",
      "optionRationales": [
        "Um requisito não representa todos.",
        "Ausência de dados não é exclusão definitiva.",
        "Preserva a insuficiência de informações.",
        "O dispositivo não define habilitação."
      ],
      "recoverySectionIds": [
        "condicoes"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "is02.q04",
      "prompt": "Por que não aplicar dois salários mínimos correntes como teto invariável de abono a todos os exercícios futuros?",
      "options": [
        "Porque a renda nunca é considerada.",
        "Porque o banco pode criar qualquer regra.",
        "Porque ano-base e aplicativo são iguais.",
        "Porque a EC 135 alterou o critério constitucional e sua atualização/transição."
      ],
      "answer": 3,
      "explanation": "Exige a regra temporal pertinente.",
      "optionRationales": [
        "Há critério de renda.",
        "O pagador não substitui a norma.",
        "São categorias diferentes.",
        "Exige a regra temporal pertinente."
      ],
      "recoverySectionIds": [
        "renda"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "is02.q05",
      "prompt": "Pessoa já habilitada, salário mínimo hipotético R$ 1.500 e seis meses computáveis: qual valor resulta da fórmula ensinada?",
      "options": [
        "R$ 750.",
        "R$ 9.000.",
        "R$ 125.",
        "R$ 1.500 em qualquer duração."
      ],
      "answer": 0,
      "explanation": "1.500 ÷ 12 × 6 = 750.",
      "optionRationales": [
        "1.500 ÷ 12 × 6 = 750.",
        "Multiplica sem aplicar os doze avos.",
        "É a fração de um mês, não de seis.",
        "Ignora a proporcionalidade."
      ],
      "recoverySectionIds": [
        "proporcao",
        "ex-calculo"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "is02.q06",
      "prompt": "Para a contagem do abono, um período de 16 dias de trabalho em um mês satisfaz qual limiar ensinado?",
      "options": [
        "Nunca conta como mês.",
        "É ao menos 15 dias e conta como mês integral nessa regra.",
        "Conta automaticamente como dois meses.",
        "Dispensa todas as demais condições."
      ],
      "answer": 1,
      "explanation": "Aplica a regra específica sem generalizar.",
      "optionRationales": [
        "Contraria o limiar legal.",
        "Aplica a regra específica sem generalizar.",
        "Dias no mesmo mês não criam dois meses.",
        "Contagem não é habilitação completa."
      ],
      "recoverySectionIds": [
        "proporcao",
        "ex-fracao"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "is02.q07",
      "prompt": "O resultado completo antes da emissão do abono é R$ 250,20. Pela regra específica ensinada, qual valor inteiro será emitido?",
      "options": [
        "R$ 250.",
        "R$ 250,20.",
        "R$ 251.",
        "R$ 300 sem cálculo."
      ],
      "answer": 2,
      "explanation": "Eleva a fração à unidade inteira seguinte.",
      "optionRationales": [
        "Descarta a suplementação da fração.",
        "Não emite em unidade inteira.",
        "Eleva a fração à unidade inteira seguinte.",
        "Não existe arredondamento arbitrário para centenas."
      ],
      "recoverySectionIds": [
        "proporcao",
        "ex-fracao"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "is02.q08",
      "prompt": "Um aluno calculou corretamente o valor proporcional de um caso cujo enunciado pressupõe habilitação. Pode usar só esse cálculo para comprovar direito de uma pessoa real?",
      "options": [
        "Sim, uma fórmula substitui todos os dados.",
        "Sim, a instituição pagadora dispensa a verificação.",
        "Sim, o salário hipotético é o valor legal atual.",
        "Não; a hipótese do exercício não comprova os requisitos do caso real."
      ],
      "answer": 3,
      "explanation": "Identifica o limite e retoma as condições.",
      "optionRationales": [
        "Cálculo e habilitação são objetos diferentes.",
        "A função pagadora não apaga condições.",
        "Hipótese não é salário mínimo vigente.",
        "Identifica o limite e retoma as condições."
      ],
      "recoverySectionIds": [
        "condicoes",
        "ex-calculo"
      ],
      "objectiveIds": [
        "O4"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "is02-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "is02.q01": [
        {
          "missionId": "draft.is02",
          "sectionId": "periodos"
        },
        {
          "missionId": "draft.is02",
          "sectionId": "ex-periodos"
        }
      ],
      "is02.q02": [
        {
          "missionId": "draft.is02",
          "sectionId": "condicoes"
        },
        {
          "missionId": "draft.is02",
          "sectionId": "ex-condicoes"
        }
      ],
      "is02.q03": [
        {
          "missionId": "draft.is02",
          "sectionId": "condicoes"
        }
      ],
      "is02.q04": [
        {
          "missionId": "draft.is02",
          "sectionId": "renda"
        }
      ],
      "is02.q05": [
        {
          "missionId": "draft.is02",
          "sectionId": "proporcao"
        },
        {
          "missionId": "draft.is02",
          "sectionId": "ex-calculo"
        }
      ],
      "is02.q06": [
        {
          "missionId": "draft.is02",
          "sectionId": "proporcao"
        },
        {
          "missionId": "draft.is02",
          "sectionId": "ex-fracao"
        }
      ],
      "is02.q07": [
        {
          "missionId": "draft.is02",
          "sectionId": "proporcao"
        },
        {
          "missionId": "draft.is02",
          "sectionId": "ex-fracao"
        }
      ],
      "is02.q08": [
        {
          "missionId": "draft.is02",
          "sectionId": "condicoes"
        },
        {
          "missionId": "draft.is02",
          "sectionId": "ex-calculo"
        }
      ]
    }
  }
};

export const EDITORIAL = {
  "stage": "Rascunho fora do catálogo; revisão pedagógica independente pendente",
  "referenceOnlyProfiles": [
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Conhecimentos Bancários 39/46 (mesmo recorte, sem dupla contagem); Anexo IV pp.33–34",
      "status": "histórico; referenceOnly"
    }
  ],
  "objectives": {
    "O1": "Ler requisitos cumulativos, período de referência e cálculo proporcional do abono sob hipóteses explícitas.",
    "O2": "Separar papéis, períodos e condições sem presumir direitos.",
    "O3": "Aplicar as hipóteses e os cálculos explicitamente ensinados.",
    "O4": "Reconhecer o erro e recuperar o trecho de ensino."
  },
  "recovery": {
    "objectiveId": "O4",
    "instruction": "Identificar a confusão, reler a seção indicada e reconstruir o exemplo."
  },
  "limits": [
    "Recorte exclusivo do perfil histórico CAIXA; não atribuído nominalmente ao BB.",
    "Fonte de escopo: matriz 65 do PR #559 em 400d4854, reaproveitada sem integrar o PR ou adotar edital vigente.",
    "Corte de consulta normativa: 03/10/2026; normas atuais distintas do edital histórico.",
    "Casos fictícios; não constitui atendimento, concessão de benefício, prática real ou avaliação independente.",
    "Sem XP, ordem, ativação, D1, alteração de permissões ou aceite humano de fase.",
    "Não reproduz teto de renda/calendário completo; não constitui decisão individual de habilitação.",
    "Seguro-desemprego será unidade própria; não é coberto por ensinar abono."
  ]
};

export const ARITHMETIC = [
  {
    "label": "fração mensal hipotética",
    "operation": "divide",
    "values": [
      1500,
      12
    ],
    "expected": 125
  },
  {
    "label": "seis meses",
    "operation": "multiply",
    "values": [
      125,
      6
    ],
    "expected": 750
  }
];
