// Rascunho editorial isolado; não importar no runtime.
export const SOURCES = [
  {
    "id": "lei.is.seguro",
    "label": "Planalto - Lei 7.998/1990",
    "url": "https://www.planalto.gov.br/ccivil_03/leis/l7998.htm",
    "locator": "Arts. 2º e 3º, especialmente inciso I e condições cumulativas; recorte do trabalhador formal, sem modalidades especiais",
    "version": "Texto oficial consultado em 03/10/2026; corte normativo declarado na aula",
    "checkedAt": "2026-10-03"
  }
];

export const IS07_DRAFT = {
  "id": "draft.is07",
  "topicId": "draft.is07",
  "editorialKey": "IS-07",
  "candidateBlockId": "banking.institution-specific",
  "title": "Seguro-desemprego: finalidade, períodos e requisitos",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Distinguir seguro-desemprego de abono e verificar o requisito de salários conforme a ordem da solicitação, sem confundir uma condição com concessão.",
  "sourceIds": [
    "lei.is.seguro"
  ],
  "sections": [
    {
      "id": "finalidade",
      "heading": "1. O que o programa procura atender",
      "body": "Seguro-desemprego não é uma conta de depósitos do empregado. A Lei 7.998 prevê assistência financeira temporária e ações de orientação, recolocação e qualificação. Esta aula estuda o recorte do trabalhador formal dispensado sem justa causa do art. 3º. Existem outras situações e modalidades, que não devem receber automaticamente as regras deste recorte. Abono salarial e seguro-desemprego compartilham a lei, mas possuem fatos e requisitos diferentes.",
      "type": "explanation",
      "sourceIds": [
        "lei.is.seguro"
      ]
    },
    {
      "id": "condicoes",
      "heading": "2. Uma condição não substitui as outras",
      "body": "A dispensa sem justa causa, sozinha, não prova direito ao pagamento. É necessário comprovar os requisitos aplicáveis do art. 3º: salários nos períodos exigidos; ausência das prestações incompatíveis, observadas as exceções legais; ausência de renda própria suficiente à manutenção pessoal e familiar; e qualificação quando aplicável nos termos do regulamento. Não resumimos tudo a estar sem trabalho nem decidimos um pedido real. Nos exercícios de períodos, as demais condições serão explicitamente dadas como satisfeitas ou deixadas em aberto.",
      "type": "explanation",
      "sourceIds": [
        "lei.is.seguro"
      ]
    },
    {
      "id": "periodos",
      "heading": "3. Solicitação e janela de salários",
      "body": "No inciso I do art. 3º, primeira solicitação: salários relativos a pelo menos 12 meses nos 18 imediatamente anteriores à dispensa; segunda: pelo menos nove nos 12 imediatamente anteriores; demais: cada um dos seis meses imediatamente anteriores. O número da solicitação não é o número de parcelas. A primeira e a segunda regras contam meses dentro de uma janela; a terceira exige todos os seis imediatamente anteriores. Não substitua salários pelo tempo de cadastro do PIS.",
      "type": "explanation",
      "sourceIds": [
        "lei.is.seguro"
      ]
    },
    {
      "id": "ex-primeira",
      "heading": "4. Exemplo resolvido: primeira solicitação",
      "body": "Caso fictício: primeira solicitação, dispensa sem justa causa e salários em 12 dos últimos 18 meses; as demais condições aplicáveis foram comprovadas. O requisito de salários desse recorte foi satisfeito. Se fossem 11 meses, faltaria um para o mínimo de 12. Esse raciocínio não determina quantidade nem valor de parcelas; também não é confirmação administrativa de pagamento.",
      "type": "worked-example",
      "sourceIds": [
        "lei.is.seguro"
      ]
    },
    {
      "id": "ex-segunda",
      "heading": "5. Exemplo resolvido: segunda solicitação",
      "body": "Caso fictício: segunda solicitação, salários em nove dos últimos 12 meses. O requisito temporal do inciso I é satisfeito, mas o caso não informa as demais condições. Conclusão correta: o período atende ao mínimo; concessão não demonstrada pelos dados. Não exigir os 12 de 18 da primeira solicitação nem prometer o benefício.",
      "type": "worked-example",
      "sourceIds": [
        "lei.is.seguro"
      ]
    },
    {
      "id": "ex-demais",
      "heading": "6. Exemplo resolvido: todos os seis imediatamente anteriores",
      "body": "Na terceira solicitação, o caso informa salários em cinco dos seis meses imediatamente anteriores à dispensa e também em um mês mais antigo. O mês antigo não substitui o que falta na janela de seis: a regra exige cada um desses seis meses. Somar seis meses espalhados sem ler a janela leva ao erro.",
      "type": "worked-example",
      "sourceIds": [
        "lei.is.seguro"
      ]
    },
    {
      "id": "comparacao",
      "heading": "7. Separar abono, FGTS e seguro-desemprego",
      "body": "IS-02 trata do abono com ano-base e requisitos próprios; IS-03/04 tratam de depósitos em conta vinculada e hipóteses de saque. Aqui o foco é assistência temporária e habilitação no recorte definido. Uma pessoa pode ter saldo de FGTS sem isso provar habilitação ao seguro-desemprego. Pedido, análise, habilitação e pagamento são etapas diferentes; uma solicitação protocolada não prova crédito efetuado.",
      "type": "explanation",
      "sourceIds": [
        "lei.is.seguro"
      ]
    },
    {
      "id": "recuperacao",
      "heading": "8. Recuperar uma resposta precipitada",
      "body": "Se você marcou que a dispensa garante pagamento, volte a condições. Se confundiu 12/18, nove/12 e seis imediatamente anteriores, escreva a ordem da solicitação antes de contar. Se confundiu abono com seguro, reconstrua finalidade e fato gerador em duas frases. Nenhum exercício desta aula calcula parcelas, promete aprovação ou abrange empregado doméstico, pescador artesanal ou trabalhador resgatado.",
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
      "id": "is07.q01",
      "prompt": "No recorte ensinado, qual descrição corresponde ao seguro-desemprego?",
      "options": [
        "Assistência financeira temporária, acompanhada de ações relacionadas ao emprego.",
        "Conta vinculada que recebe depósitos de FGTS.",
        "Abono concedido apenas pelo tempo de cadastro.",
        "Empréstimo que deve ser contratado para receber benefício."
      ],
      "answer": 0,
      "explanation": "A lei combina assistência temporária e ações relacionadas ao emprego.",
      "optionRationales": [
        "A lei combina assistência temporária e ações relacionadas ao emprego.",
        "Conta vinculada é objeto do FGTS, não definição do seguro.",
        "Tempo de cadastro não define este programa nem basta para abono.",
        "O programa não foi apresentado como contratação de crédito."
      ],
      "recoverySectionIds": [
        "finalidade"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "is07.q02",
      "prompt": "Primeira solicitação: salários em 11 dos últimos 18 meses. O requisito de salários ensinado foi satisfeito?",
      "options": [
        "Sim, porque houve dispensa.",
        "Não; o mínimo dessa solicitação é 12 dos últimos 18 meses.",
        "Sim; basta qualquer total de seis meses.",
        "Não; sempre se exigem 18 meses de salários."
      ],
      "answer": 1,
      "explanation": "Onze é inferior ao mínimo de 12 nessa janela.",
      "optionRationales": [
        "Dispensa não elimina o requisito temporal.",
        "Onze é inferior ao mínimo de 12 nessa janela.",
        "A regra dos demais pedidos não vale para o primeiro.",
        "A janela de 18 não significa mínimo de 18."
      ],
      "recoverySectionIds": [
        "periodos",
        "ex-primeira"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "is07.q03",
      "prompt": "Segunda solicitação: nove dos últimos 12 meses com salários, demais condições não informadas. O que se pode concluir?",
      "options": [
        "Pagamento já realizado.",
        "Deve ser aplicada a janela de 18 meses do primeiro pedido.",
        "Requisito temporal satisfeito; os dados não comprovam concessão.",
        "Número de parcelas igual a nove."
      ],
      "answer": 2,
      "explanation": "Distingue uma condição atendida da decisão completa.",
      "optionRationales": [
        "Nada comprova pagamento.",
        "O caso é a segunda solicitação.",
        "Distingue uma condição atendida da decisão completa.",
        "Meses de salários não são número de parcelas."
      ],
      "recoverySectionIds": [
        "condicoes",
        "ex-segunda"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "is07.q04",
      "prompt": "Terceira solicitação: cinco dos seis meses imediatamente anteriores com salários, mais um mês antigo. Qual leitura é correta?",
      "options": [
        "Seis meses somados sempre bastam.",
        "O mês antigo substitui qualquer mês recente.",
        "É preciso usar a regra de 12 dos últimos 18.",
        "Não atende à exigência de salários em cada um dos seis meses imediatamente anteriores."
      ],
      "answer": 3,
      "explanation": "Falta um mês dentro dos seis imediatamente anteriores.",
      "optionRationales": [
        "A regra exige a janela específica, não soma livre.",
        "O mês está fora da janela requerida.",
        "Essa é a regra da primeira solicitação.",
        "Falta um mês dentro dos seis imediatamente anteriores."
      ],
      "recoverySectionIds": [
        "periodos",
        "ex-demais"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "is07.q05",
      "prompt": "Saldo de FGTS informado em um caso, sem dados de habilitação ao seguro, prova qual conclusão?",
      "options": [
        "Existência do saldo informado, sem provar direito ao seguro-desemprego.",
        "Concessão automática de seguro-desemprego.",
        "Que FGTS e seguro são o mesmo benefício.",
        "Que todos os requisitos do art. 3º foram verificados."
      ],
      "answer": 0,
      "explanation": "Cada evidência possui objeto próprio.",
      "optionRationales": [
        "Cada evidência possui objeto próprio.",
        "Saldo não comprova os requisitos do seguro.",
        "Conta vinculada e assistência temporária são objetos diferentes.",
        "O caso não fornece essa verificação."
      ],
      "recoverySectionIds": [
        "comparacao"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "is07.q06",
      "prompt": "Qual informação deve ser identificada antes de escolher a janela de salários?",
      "options": [
        "Quantidade de parcelas pretendidas.",
        "Se é primeira, segunda ou outra solicitação.",
        "Saldo da conta vinculada.",
        "Apenas tempo de cadastro no PIS."
      ],
      "answer": 1,
      "explanation": "A ordem da solicitação seleciona a regra temporal ensinada.",
      "optionRationales": [
        "Parcelas não selecionam a janela do inciso I.",
        "A ordem da solicitação seleciona a regra temporal ensinada.",
        "Saldo de FGTS não seleciona a janela.",
        "Cadastro do PIS não substitui os salários exigidos."
      ],
      "recoverySectionIds": [
        "periodos"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "is07.q07",
      "prompt": "Um pedido foi protocolado, sem informação de análise ou crédito. Qual afirmação respeita os dados?",
      "options": [
        "O crédito já entrou na conta.",
        "O protocolo elimina requisitos.",
        "Há evidência de solicitação; não de pagamento.",
        "O protocolo define o valor das parcelas."
      ],
      "answer": 2,
      "explanation": "As etapas devem ser separadas.",
      "optionRationales": [
        "O enunciado não informa crédito.",
        "Solicitar não elimina condições.",
        "As etapas devem ser separadas.",
        "Não há cálculo nem decisão sobre valor."
      ],
      "recoverySectionIds": [
        "comparacao"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "is07.q08",
      "prompt": "Você errou por considerar a dispensa suficiente. Qual retomada enfrenta esse erro?",
      "options": [
        "Decorar o saldo de FGTS.",
        "Tratar todo benefício como abono.",
        "Contar parcelas sem verificar condições.",
        "Reler condições e separar requisito isolado de habilitação completa."
      ],
      "answer": 3,
      "explanation": "A retomada examina o salto entre uma condição e concessão.",
      "optionRationales": [
        "Saldo não corrige a confusão.",
        "Abono possui finalidade e requisitos distintos.",
        "Isso repete a conclusão sem base.",
        "A retomada examina o salto entre uma condição e concessão."
      ],
      "recoverySectionIds": [
        "condicoes",
        "recuperacao"
      ],
      "objectiveIds": [
        "O4"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "is07-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "is07.q01": [
        {
          "missionId": "draft.is07",
          "sectionId": "finalidade"
        }
      ],
      "is07.q02": [
        {
          "missionId": "draft.is07",
          "sectionId": "periodos"
        },
        {
          "missionId": "draft.is07",
          "sectionId": "ex-primeira"
        }
      ],
      "is07.q03": [
        {
          "missionId": "draft.is07",
          "sectionId": "condicoes"
        },
        {
          "missionId": "draft.is07",
          "sectionId": "ex-segunda"
        }
      ],
      "is07.q04": [
        {
          "missionId": "draft.is07",
          "sectionId": "periodos"
        },
        {
          "missionId": "draft.is07",
          "sectionId": "ex-demais"
        }
      ],
      "is07.q05": [
        {
          "missionId": "draft.is07",
          "sectionId": "comparacao"
        }
      ],
      "is07.q06": [
        {
          "missionId": "draft.is07",
          "sectionId": "periodos"
        }
      ],
      "is07.q07": [
        {
          "missionId": "draft.is07",
          "sectionId": "comparacao"
        }
      ],
      "is07.q08": [
        {
          "missionId": "draft.is07",
          "sectionId": "condicoes"
        },
        {
          "missionId": "draft.is07",
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
      "item": "Conhecimentos Bancários 39/46; Anexo IV pp.33–34",
      "status": "histórico; referenceOnly"
    }
  ],
  "objectives": {
    "O1": "Distinguir seguro-desemprego de abono e verificar o requisito de salários conforme a ordem da solicitação, sem confundir uma condição com concessão.",
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
    "Sem tabela de parcelas, valores, prazos de requerimento ou modalidades especiais.",
    "As janelas são do art. 3º, I; os exercícios não substituem verificação dos demais requisitos."
  ]
};

export const ARITHMETIC = [];
