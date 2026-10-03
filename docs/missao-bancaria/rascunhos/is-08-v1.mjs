// Rascunho editorial isolado; não importar no runtime.
export const SOURCES = [
  {
    "id": "lei.is.bolsa",
    "label": "Planalto - Lei 14.601/2023",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14601.htm",
    "locator": "Arts. 1º-5º, 7º-8º, 10-12 e 15; conceitos, requisitos, papéis e limites, sem apresentar valores como imutáveis",
    "version": "Texto oficial consultado em 03/10/2026; corte normativo declarado na aula",
    "checkedAt": "2026-10-03"
  },
  {
    "id": "lei.is.bolsa-historica",
    "label": "Planalto - Lei 10.836/2004",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2004/lei/l10.836.htm",
    "locator": "Referência histórica nominal do item 35; página assinala revogação, não usada como procedimento atual",
    "version": "Texto oficial consultado em 03/10/2026; corte normativo declarado na aula",
    "checkedAt": "2026-10-03"
  }
];

export const IS08_DRAFT = {
  "id": "draft.is08",
  "topicId": "draft.is08",
  "editorialKey": "IS-08",
  "candidateBlockId": "banking.institution-specific",
  "title": "Bolsa Família: cadastro, família, seleção e pagamento",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Separar o programa histórico citado no edital do marco posterior e distinguir cadastro, elegibilidade, benefício e função do agente pagador.",
  "sourceIds": [
    "lei.is.bolsa",
    "lei.is.bolsa-historica"
  ],
  "sections": [
    {
      "id": "corte",
      "heading": "1. Duas referências, duas perguntas",
      "body": "O item 35 do edital histórico CAIXA cita a Lei 10.836/2004. Essa referência continua identificada no mapa; não a substituímos silenciosamente. A página oficial assinala a revogação da lei antiga. Para os conceitos atuais delimitados nesta aula, consultamos a Lei 14.601/2023, que instituiu o Bolsa Família em substituição ao Auxílio Brasil. Questão sobre a referência histórica e questão sobre uma regra atual exigem leitura do período, sem transportar automaticamente valores ou procedimentos entre marcos.",
      "type": "explanation",
      "sourceIds": [
        "lei.is.bolsa",
        "lei.is.bolsa-historica"
      ]
    },
    {
      "id": "programa",
      "heading": "2. Transferência de renda e seus objetivos",
      "body": "O Bolsa Família é programa de transferência direta e condicionada de renda, com objetivos de combater a fome, interromper a reprodução intergeracional da pobreza e promover desenvolvimento e proteção social. Transferência não é um empréstimo que a família precisa contratar para acessar o programa. Também não é depósito patronal de FGTS nem abono salarial. Os termos do programa e suas condições devem ser lidos no marco aplicável.",
      "type": "explanation",
      "sourceIds": [
        "lei.is.bolsa"
      ]
    },
    {
      "id": "familia",
      "heading": "3. Família e renda por pessoa",
      "body": "A lei define família como grupo doméstico de uma ou mais pessoas no mesmo domicílio, cujos membros contribuem para a renda ou dependem dela para despesas. Renda mensal por pessoa, ou per capita, é a renda familiar considerada dividida pelo número de integrantes. O cálculo legal exclui determinados rendimentos; por isso os exemplos fornecem a renda já considerada segundo as regras do caso, sem ensinar que todo dinheiro recebido sempre entra na soma.",
      "type": "explanation",
      "sourceIds": [
        "lei.is.bolsa"
      ]
    },
    {
      "id": "ex-renda",
      "heading": "4. Exemplo resolvido: divisão não é benefício",
      "body": "Caso fictício: quatro integrantes e renda familiar mensal já considerada de R$ 800. Dividimos 800 por quatro: R$ 200 por pessoa. Isso calcula renda per capita; não o valor do benefício nem, por si só, aprovação. Para conferir ingresso, seria necessário comparar com o parâmetro aplicável ao período, conferir cadastro e demais regras. Não usamos um teto hipotético como valor vigente.",
      "type": "worked-example",
      "sourceIds": [
        "lei.is.bolsa"
      ]
    },
    {
      "id": "cadastro",
      "heading": "5. Cadastro, elegibilidade e seleção",
      "body": "O CadÚnico registra informações socioeconômicas; não é uma conta bancária ou pagamento. O art. 5º exige inscrição e renda per capita dentro do limite aplicável. Estar inscrito, isoladamente, não comprova esse conjunto nem pagamento. A lei vincula a operacionalização às regras do programa e às dotações orçamentárias; por isso cadastro, atendimento aos critérios, seleção/concessão e disponibilização do benefício devem ser diferenciados. Não ensinamos calendário, garantia de entrada imediata ou valor universal.",
      "type": "explanation",
      "sourceIds": [
        "lei.is.bolsa"
      ]
    },
    {
      "id": "ex-cadastro",
      "heading": "6. Exemplo resolvido: evidência incompleta",
      "body": "Caso fictício: um documento informa somente inscrição de uma família no CadÚnico. Não informa renda, seleção, concessão ou pagamento. Pode-se afirmar a inscrição indicada. Não se pode concluir que um benefício já foi liberado. Acrescentar a existência de uma conta bancária não supre os dados que faltam.",
      "type": "worked-example",
      "sourceIds": [
        "lei.is.bolsa"
      ]
    },
    {
      "id": "papeis",
      "heading": "7. Gestão não é apenas pagamento",
      "body": "A execução e a gestão são públicas, com atuação descentralizada dos entes federativos. A Lei 14.601 atribui à CAIXA a função de agente operador e pagador, nas condições pactuadas com o governo federal. Essa função não transforma abrir uma conta em decisão de elegibilidade nem autoriza presumir que a instituição define sozinha as condições do programa. Pagamento é feito ao responsável familiar segundo as regras, preferencialmente à mulher.",
      "type": "explanation",
      "sourceIds": [
        "lei.is.bolsa"
      ]
    },
    {
      "id": "ex-etapas",
      "heading": "8. Exemplo resolvido: concessão e crédito",
      "body": "O caso fictício informa seleção confirmada, mas nenhuma evidência da disponibilização de uma parcela. A seleção é uma informação diferente de crédito confirmado. Se depois for apresentado comprovante de uma parcela paga, ele prova aquele pagamento informado, não pagamentos futuros ilimitados. Tampouco o comprovante define todas as atribuições de gestão.",
      "type": "worked-example",
      "sourceIds": [
        "lei.is.bolsa"
      ]
    },
    {
      "id": "manutencao",
      "heading": "9. Manutenção e condicionalidades",
      "body": "A transferência é condicionada: manutenção envolve requisitos e condicionalidades previstos na lei e no regulamento, relacionados à educação e à saúde, com procedimentos de acompanhamento e atendimento. Não presumimos que um relato isolado produz desligamento imediato. A lei veda procedimentos punitivos ou de exposição vexatória no tratamento do descumprimento. Esta aula não avalia situações de saúde ou documentos reais, nem ensina fiscalização ou regras de proteção e transição de renda.",
      "type": "explanation",
      "sourceIds": [
        "lei.is.bolsa"
      ]
    },
    {
      "id": "recuperacao",
      "heading": "10. Recuperar a confusão entre etapas",
      "body": "Se marcou pagamento automático pelo cadastro, releia cadastro e reconstrua quais informações faltam. Se dividiu o benefício em vez da renda, refaça o exemplo de renda por pessoa e nomeie cada quantidade. Se confundiu agente pagador com gestor exclusivo, releia papéis. Valores, seleção, manutenção e procedimentos concretos exigem o marco e o período corretos; referência histórica não equivale a instrução atual.",
      "type": "explanation",
      "sourceIds": []
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
      "id": "is08.q01",
      "prompt": "O que caracteriza o Bolsa Família no marco ensinado?",
      "options": [
        "Transferência direta e condicionada de renda.",
        "Empréstimo obrigatório para famílias cadastradas.",
        "Conta de FGTS formada por depósitos do empregador.",
        "Abono salarial definido exclusivamente por salários anteriores."
      ],
      "answer": 0,
      "explanation": "Essa é a natureza do programa no art. 2º.",
      "optionRationales": [
        "Essa é a natureza do programa no art. 2º.",
        "Contratar crédito não define a transferência.",
        "Conta vinculada pertence a outro objeto.",
        "Abono e Bolsa Família têm objetos e condições diferentes."
      ],
      "recoverySectionIds": [
        "programa"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "is08.q02",
      "prompt": "Quatro integrantes e renda considerada de R$ 800: qual a renda mensal por pessoa?",
      "options": [
        "R$ 800.",
        "R$ 200.",
        "R$ 3.200.",
        "Não existe divisão porque cadastro é conta bancária."
      ],
      "answer": 1,
      "explanation": "800 dividido por quatro resulta em 200.",
      "optionRationales": [
        "Esse é o total familiar, não a renda por pessoa.",
        "800 dividido por quatro resulta em 200.",
        "Multiplicação não calcula renda per capita.",
        "Cadastro não é conta; a divisão foi ensinada."
      ],
      "recoverySectionIds": [
        "familia",
        "ex-renda"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "is08.q03",
      "prompt": "Um caso informa apenas inscrição no CadÚnico. O que está comprovado pelos dados?",
      "options": [
        "Concessão imediata do benefício.",
        "Valor de todas as parcelas futuras.",
        "A inscrição informada, sem comprovar seleção ou pagamento.",
        "Atendimento a todos os critérios de renda."
      ],
      "answer": 2,
      "explanation": "Respeita o limite da evidência fornecida.",
      "optionRationales": [
        "Cadastro isolado não comprova concessão.",
        "Não há dados de parcelas.",
        "Respeita o limite da evidência fornecida.",
        "Nenhuma renda foi informada."
      ],
      "recoverySectionIds": [
        "cadastro",
        "ex-cadastro"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "is08.q04",
      "prompt": "Qual distinção preserva a referência do edital e o corte atual da aula?",
      "options": [
        "A Lei 10.836 é automaticamente a única regra atual.",
        "A Lei 14.601 apaga a referência histórica do mapa.",
        "Ambas têm necessariamente os mesmos valores e procedimentos.",
        "A referência histórica é identificada; os conceitos atuais delimitados usam o marco posterior."
      ],
      "answer": 3,
      "explanation": "Separa rastreabilidade histórica e consulta atual.",
      "optionRationales": [
        "A página assinala revogação da lei antiga.",
        "O mapa preserva a correspondência nominal histórica.",
        "Regras não podem ser transportadas sem verificação.",
        "Separa rastreabilidade histórica e consulta atual."
      ],
      "recoverySectionIds": [
        "corte"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "is08.q05",
      "prompt": "A CAIXA atua como agente operador e pagador. Qual conclusão é adequada?",
      "options": [
        "Essa função não torna abertura de conta prova de elegibilidade.",
        "Abrir conta substitui requisitos do programa.",
        "A instituição passa a definir sozinha todas as condições.",
        "O cadastro municipal deixa de ter qualquer papel."
      ],
      "answer": 0,
      "explanation": "Papéis operacionais não eliminam requisitos.",
      "optionRationales": [
        "Papéis operacionais não eliminam requisitos.",
        "Conta não substitui os critérios.",
        "A gestão pública não foi definida como exclusiva da CAIXA.",
        "Atuação descentralizada e cadastro permanecem distintos do pagamento."
      ],
      "recoverySectionIds": [
        "papeis",
        "cadastro"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "is08.q06",
      "prompt": "Seleção confirmada, sem evidência de parcela disponibilizada: qual afirmação respeita o caso?",
      "options": [
        "Todas as parcelas futuras estão pagas.",
        "Há seleção informada, mas pagamento não foi comprovado.",
        "Seleção é sinônimo de comprovante bancário.",
        "O valor do benefício é igual à renda per capita."
      ],
      "answer": 1,
      "explanation": "Separa etapas e evidência de crédito.",
      "optionRationales": [
        "O caso não informa isso.",
        "Separa etapas e evidência de crédito.",
        "São informações distintas.",
        "Renda por pessoa não é cálculo do benefício."
      ],
      "recoverySectionIds": [
        "ex-etapas"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "is08.q07",
      "prompt": "No exemplo, R$ 200 por pessoa é qual quantidade?",
      "options": [
        "Valor garantido do benefício.",
        "Saldo obrigatório de uma conta.",
        "Renda per capita calculada a partir da renda considerada.",
        "Preço de um empréstimo obrigatório."
      ],
      "answer": 2,
      "explanation": "Nomeia corretamente o resultado da divisão.",
      "optionRationales": [
        "O exercício não calcula benefício.",
        "Não é cálculo de saldo.",
        "Nomeia corretamente o resultado da divisão.",
        "O programa não foi apresentado como crédito contratado."
      ],
      "recoverySectionIds": [
        "ex-renda"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "is08.q08",
      "prompt": "Você marcou que cadastro basta para receber. Qual retomada corrige o erro?",
      "options": [
        "Decorar apenas a sigla da conta.",
        "Tratar a lei antiga como procedimento atual completo.",
        "Trocar renda familiar por número de parcelas.",
        "Reler cadastro e enumerar quais requisitos e etapas ainda não foram demonstrados."
      ],
      "answer": 3,
      "explanation": "A retomada identifica o salto injustificado de inscrição para pagamento.",
      "optionRationales": [
        "Não enfrenta a confusão entre etapas.",
        "Isso acrescenta erro temporal.",
        "São quantidades diferentes.",
        "A retomada identifica o salto injustificado de inscrição para pagamento."
      ],
      "recoverySectionIds": [
        "cadastro",
        "recuperacao"
      ],
      "objectiveIds": [
        "O4"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "is08-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "is08.q01": [
        {
          "missionId": "draft.is08",
          "sectionId": "programa"
        }
      ],
      "is08.q02": [
        {
          "missionId": "draft.is08",
          "sectionId": "familia"
        },
        {
          "missionId": "draft.is08",
          "sectionId": "ex-renda"
        }
      ],
      "is08.q03": [
        {
          "missionId": "draft.is08",
          "sectionId": "cadastro"
        },
        {
          "missionId": "draft.is08",
          "sectionId": "ex-cadastro"
        }
      ],
      "is08.q04": [
        {
          "missionId": "draft.is08",
          "sectionId": "corte"
        }
      ],
      "is08.q05": [
        {
          "missionId": "draft.is08",
          "sectionId": "papeis"
        },
        {
          "missionId": "draft.is08",
          "sectionId": "cadastro"
        }
      ],
      "is08.q06": [
        {
          "missionId": "draft.is08",
          "sectionId": "ex-etapas"
        }
      ],
      "is08.q07": [
        {
          "missionId": "draft.is08",
          "sectionId": "ex-renda"
        }
      ],
      "is08.q08": [
        {
          "missionId": "draft.is08",
          "sectionId": "cadastro"
        },
        {
          "missionId": "draft.is08",
          "sectionId": "recuperacao"
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
      "item": "Conhecimentos Bancários 35; Anexo IV pp.33–34",
      "status": "histórico; referenceOnly"
    }
  ],
  "objectives": {
    "O1": "Separar o programa histórico citado no edital do marco posterior e distinguir cadastro, elegibilidade, benefício e função do agente pagador.",
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
    "Sem tabela de benefícios, calendário, tetos apresentados como atuais, regra de proteção ou procedimentos de atendimento.",
    "Recorte conceitual não esgota a lei histórica inteira nem todos os regulamentos do programa atual."
  ]
};

export const ARITHMETIC = [
  {
    "label": "Renda considerada por integrante",
    "operation": "divide",
    "values": [
      800,
      4
    ],
    "expected": 200
  }
];
