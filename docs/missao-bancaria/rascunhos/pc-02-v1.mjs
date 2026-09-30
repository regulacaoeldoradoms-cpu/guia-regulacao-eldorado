// Rascunho editorial isolado; não importar no runtime.
export const SOURCES = [
  {
    "id": "bcb.credito.tipos",
    "label": "BCB — Diferença entre empréstimo, financiamento e leasing",
    "url": "https://www.bcb.gov.br/meubc/faqs/p/diferenca-entre-emprestimo-financiamento-e-arrendamento-mercantil-leasing",
    "version": "FAQ atualizada em 21/05/2026",
    "locator": "Contraste empréstimo/financiamento; leasing apenas como limite do recorte",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "bcb.credito.condicoes",
    "label": "BCB — Condições para contratar empréstimo",
    "url": "https://www.bcb.gov.br/meubc/faqs/p/condicoes-para-contratar-emprestimo-em-um-banco",
    "version": "FAQ atualizada em 31/01/2023, consultada em 30/09/2026",
    "locator": "Análise e concessão; condições combinadas entre cliente e instituição",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "bcb.credito.caderno",
    "label": "BCB — Caderno de Educação Financeira",
    "url": "https://www.bcb.gov.br/content/cidadaniafinanceira/documentos_cidadania/Cuidando_do_seu_dinheiro_Gestao_de_Financas_Pessoais/caderno_cidadania_financeira.pdf",
    "version": "2026, 2ª edição revisada; fonte já verificada no MP, recorte novo consultado",
    "locator": "Seções 3.1, 3.3 e 3.4, páginas impressas 32–37; recursos, juros, custo e compromissos",
    "checkedAt": "2026-09-30"
  }
];

export const PC02_DRAFT = {
  "id": "draft.pc02",
  "topicId": "draft.pc02",
  "editorialKey": "PC-02",
  "candidateBlockId": "banking.products-credit",
  "title": "Crédito, empréstimo e financiamento",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Identificar partes e obrigações do crédito; distinguir empréstimo e financiamento pela destinação contratual; separar principal, entrada, prestações e total, reconhecendo limites da comparação.",
  "sourceIds": [
    "bcb.credito.tipos",
    "bcb.credito.condicoes",
    "bcb.credito.caderno"
  ],
  "sections": [
    {
      "id": "inicio",
      "type": "explanation",
      "heading": "1. Recursos agora, obrigação depois",
      "body": "Em [PC-01](pc-01-v1.md#saldo-limite), separamos saldo de crédito disponível. Agora vamos examinar uma operação contratada. Tomador é quem recebe o crédito; devedor é quem tem obrigação de pagar; credor tem o direito de receber. No empréstimo bancário simples usado aqui, banco e cliente assumem esses papéis. Crédito não é renda extra gratuita: permite usar recursos de terceiros, acompanhado de compromissos. Não recomendaremos uma operação para alguém real. Os casos são fictícios e seus dados estão completos apenas para a pergunta proposta.",
      "sourceIds": [
        "bcb.credito.caderno"
      ]
    },
    {
      "id": "vocabulario",
      "type": "explanation",
      "heading": "2. Leia valor, juros, prazo e prestação",
      "body": "Principal é o valor da dívida sobre o qual se estrutura a operação, antes de confundi-lo com o total de pagamentos. Juros remuneram o uso de recursos no tempo; taxa expressa essa remuneração em relação a um valor e a um período. Prazo informa por quanto tempo vai a relação; vencimento é a data em que um pagamento deve ocorrer. Prestação é cada pagamento previsto. Ela pode incluir devolução de parte do principal, juros e outros componentes: não trate toda prestação como juros, nem toda como redução do principal.\n\nAmortização é a redução do principal pelo pagamento. Nesta aula, quando separarmos principal e juros, o próprio caso dará esses valores. Não calcularemos sistema de amortização, juros compostos ou uma taxa a partir das parcelas. O custo pode conter tarifas, tributos e outros encargos; PC-04 desenvolverá a comparação pelo Custo Efetivo Total, CET.",
      "sourceIds": [
        "bcb.credito.caderno"
      ]
    },
    {
      "id": "exemplo-partes",
      "type": "worked-example",
      "heading": "3. Exemplo resolvido: identifique a obrigação",
      "body": "Caso fictício: o Banco Ponte empresta R$1.000 a Camila, com devolução de R$1.080 em uma única data combinada. Para este exemplo, R$80 são exclusivamente juros, sem outros encargos. Passo 1: o banco é credor; Camila é tomadora e devedora. Passo 2: R$1.000 são o principal recebido; R$1.080 são o pagamento total. Passo 3: 1.080 − 1.000 = R$80 de juros no cenário. A entrada de R$1.000 no extrato não elimina o compromisso de R$1.080. O valor R$80 só é classificado integralmente como juros porque o caso excluiu outros componentes; sem essa informação, não se deve presumir a composição.",
      "sourceIds": []
    },
    {
      "id": "modalidades",
      "type": "explanation",
      "heading": "4. Empréstimo e financiamento: observe a destinação contratual",
      "body": "No contraste introdutório adotado pelo BCB, empréstimo disponibiliza recursos sem destinação específica vinculada à aquisição de um bem no contrato; financiamento é crédito destinado a adquirir um bem definido, como um veículo. Ter um plano pessoal para gastar um empréstimo não transforma o contrato automaticamente em financiamento: observe o vínculo da operação, não apenas o desejo do tomador. Nos dois casos há crédito e obrigação de pagamento.\n\nO nome da modalidade, sozinho, não demonstra a menor taxa, a existência de toda e qualquer garantia ou a melhor escolha. Garantia é um mecanismo associado ao cumprimento da obrigação; seus tipos e regras serão ensinados em PC-08/09. Não vamos presumir uma garantia ausente do enunciado. Leasing, que envolve arrendamento de um bem, também não será tratado como sinônimo dessas duas operações; sua mecânica está fora desta unidade.",
      "sourceIds": [
        "bcb.credito.tipos"
      ]
    },
    {
      "id": "exemplo-modalidades",
      "type": "worked-example",
      "heading": "5. Exemplo resolvido: necessidade parecida, contratos diferentes",
      "body": "Dois casos fictícios. Dora contrata crédito pessoal sem vinculação contratual a um bem, para organizar despesas escolhidas por ela. Enzo contrata financiamento destinado, no contrato, à compra de uma máquina identificada. Passo 1: a operação de Dora tem recursos de uso não vinculado ao bem; classifica-se aqui como empréstimo. Passo 2: o crédito de Enzo tem aquisição definida no contrato; é financiamento. Passo 3: se Dora decidir comprar também uma máquina com seu dinheiro emprestado, essa decisão posterior não reclassifica sozinha o contrato. Não sabemos qual operação custa menos, pois faltam condições comparáveis.",
      "sourceIds": [
        "bcb.credito.tipos"
      ]
    },
    {
      "id": "fluxo",
      "type": "explanation",
      "heading": "6. Acompanhe o que entra e o que será pago",
      "body": "Separar momentos ajuda a ler uma proposta. Primeiro identifique o valor liberado e sua destinação. Depois localize datas, quantidade e valor dos pagamentos. Some os pagamentos quando essa for a pergunta. Se existir entrada com recursos próprios em uma compra, ela se soma às prestações para determinar o desembolso total da compra; não deve ser novamente incluída no principal financiado. Diferença entre preço à vista e total a prazo não demonstra, sozinha, uma taxa periódica. É preciso conhecer valores e datas e aprender o método de cálculo apropriado.",
      "sourceIds": []
    },
    {
      "id": "exemplo-fluxo",
      "type": "worked-example",
      "heading": "7. Exemplo resolvido: entrada não é parcela financiada",
      "body": "Compra fictícia: máquina com preço à vista R$3.000. A pessoa paga entrada de R$600 de recursos próprios; o contrato financia os R$2.400 restantes. São seis prestações de R$430; não há outro pagamento neste exemplo. Passo 1: 3.000 − 600 = R$2.400 financiados. Passo 2: 6 × 430 = R$2.580 pagos nas prestações. Passo 3: 600 + 2.580 = R$3.180 desembolsados na compra. A diferença para o preço à vista é R$180. Como o caso não separa a composição desse acréscimo, não vamos chamá-lo integralmente de juros nem transformá-lo em taxa mensal. Também não somamos a entrada novamente aos R$2.400 para dizer que foram financiados R$3.000.",
      "sourceIds": []
    },
    {
      "id": "prestacao",
      "type": "explanation",
      "heading": "8. Uma prestação menor não responde a todas as perguntas",
      "body": "Prestação, quantidade de pagamentos, datas, custo e risco respondem a perguntas distintas. Uma prestação menor pode vir acompanhada de prazo maior. Para comparar totais, a multiplicação basta quando todos os pagamentos iguais são informados e não há outros desembolsos; para comparar o custo financeiro no tempo, essa conta isolada não basta. Ler o total não substitui considerar a capacidade de pagar e o CET em condições comparáveis. Tampouco ter conta no banco ou visualizar oferta significa que o crédito esteja concedido: o BCB esclarece que há análise e que o banco não é obrigado a liberar o empréstimo.",
      "sourceIds": [
        "bcb.credito.condicoes",
        "bcb.credito.caderno"
      ]
    },
    {
      "id": "exemplo-comparacao",
      "type": "worked-example",
      "heading": "9. Exemplo resolvido: total e prazo separados",
      "body": "Duas propostas fictícias liberam R$1.000 hoje, sem entrada nem cobrança adicional. A prevê cinco pagamentos mensais de R$220; B, dez de R$120. Primeiro: A soma 5 × 220 = R$1.100. Segundo: B soma 10 × 120 = R$1.200. Terceiro: B tem prestação menor, mas soma maior e prazo maior. Podemos afirmar esses três fatos; não calcular uma taxa que não foi ensinada nem recomendar a proposta para uma pessoa real. Para uma comparação completa, ainda faltam as datas precisas e informações de custo e condições; PC-04 desenvolverá essa leitura.",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "10. Vocabulário para conferir o caso",
      "body": "Credor/devedor: quem tem direito de receber/obrigação de pagar. Tomador: quem recebe o crédito. Principal: valor da dívida distinguido dos juros e outros componentes. Juros: remuneração pelo uso no tempo. Amortização: redução do principal. Prazo: duração. Vencimento: data de pagamento. Prestação: pagamento previsto. Entrada: parcela inicial paga com recursos próprios no exemplo. Destinação contratual: finalidade vinculada na operação. CET: medida do custo que considera os componentes da operação, a desenvolver em PC-04.",
      "sourceIds": []
    },
    {
      "id": "resumo",
      "type": "summary",
      "heading": "11. Prepare a explicação, não apenas o nome",
      "body": "Reconstrua os papéis de Camila e do banco; depois compare o contrato de Dora com o de Enzo. Refaça a soma da compra da máquina e separe valor financiado, prestações e entrada. Se uma pergunta trouxer apenas prestação pequena ou um anúncio, diga o que falta antes de escolher. As questões são prática exposta: acertar o cálculo elementar não comprova domínio de matemática financeira ou de contratação real.",
      "sourceIds": []
    }
  ],
  "recall": [
    "Explique a diferença entre finalidade escolhida pelo cliente e vinculação contratual do financiamento. Confira modalidades e exemplo-modalidades.",
    "Desenhe o fluxo da compra financiada: entrada, principal e prestações. Refaça exemplo-fluxo e explique por que parcela menor pode acompanhar total maior.",
    "Escolha um erro, releia os recoverySectionIds, nomeie a confusão e reescreva a justificativa antes de consultar o comentário. Em nova sessão, reconstrua o caso sem olhar. Isso não altera política adaptativa nem presume domínio."
  ],
  "questions": [
    {
      "id": "pc02.q01",
      "topicId": "draft.pc02",
      "prompt": "Caso fictício: um banco entrega recursos emprestados a Nina, que deve devolvê-los conforme o contrato. Quais papéis foram descritos?",
      "options": [
        "Nina é credora e o banco devedor apenas porque houve uma entrada.",
        "Nina é tomadora/devedora; o banco é credor nessa operação.",
        "Nina vira sócia do banco ao receber o valor.",
        "A entrada elimina qualquer obrigação futura."
      ],
      "answer": 1,
      "explanation": "O recurso recebido vem acompanhado da obrigação de devolução ao credor.",
      "optionRationales": [
        "Inverte os papéis da operação.",
        "Identifica recebimento e obrigação.",
        "Crédito não implica participação societária.",
        "Ignora o contrato informado."
      ],
      "recoverySectionIds": [
        "inicio",
        "exemplo-partes"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "pc02.q02",
      "topicId": "draft.pc02",
      "prompt": "Um crédito pessoal fictício não vincula os recursos a um bem no contrato. O cliente decide usar parte deles para comprar uma mesa. Qual análise segue o contraste ensinado?",
      "options": [
        "O contrato vira necessariamente financiamento pela decisão posterior.",
        "Comprar um bem extingue a dívida.",
        "Não é crédito porque existe uma finalidade pessoal.",
        "A decisão de compra não transforma automaticamente o empréstimo em financiamento vinculado."
      ],
      "answer": 3,
      "explanation": "A finalidade pessoal não substitui a destinação contratual da operação.",
      "optionRationales": [
        "Troca critério contratual por decisão de uso.",
        "Compra não demonstra pagamento ao credor.",
        "Confunde finalidade pessoal com inexistência de crédito.",
        "Preserva o critério do contrato."
      ],
      "recoverySectionIds": [
        "modalidades",
        "exemplo-modalidades"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "pc02.q03",
      "topicId": "draft.pc02",
      "prompt": "Caso fictício: um contrato destina o crédito expressamente à aquisição de um equipamento identificado. Qual classificação introdutória é adequada?",
      "options": [
        "Financiamento, pela aquisição vinculada no contrato.",
        "Poupança, porque haverá prestações.",
        "Empréstimo sem destinação vinculada, apesar da cláusula expressa.",
        "Conta-salário, porque envolve pagamentos."
      ],
      "answer": 0,
      "explanation": "O caso fornece o vínculo da operação a um bem determinado.",
      "optionRationales": [
        "Aplica o critério da destinação.",
        "Prestação não caracteriza poupança.",
        "Contraria o dado central do enunciado.",
        "Pagamento não basta para definir conta-salário."
      ],
      "recoverySectionIds": [
        "modalidades",
        "exemplo-modalidades"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "pc02.q04",
      "topicId": "draft.pc02",
      "prompt": "Caso fictício: a pessoa recebe R$800 de principal e pagará R$860; o caso informa que a diferença é só juros, sem encargos adicionais. Quanto são os juros?",
      "options": [
        "R$800.",
        "R$860.",
        "R$60.",
        "R$1.660."
      ],
      "answer": 2,
      "explanation": "860 − 800 = R$60, classificados como juros porque essa composição foi expressa.",
      "optionRationales": [
        "Confunde principal com juros.",
        "Confunde total com juros.",
        "Calcula a diferença e respeita a hipótese.",
        "Soma valores que precisam ser comparados."
      ],
      "recoverySectionIds": [
        "vocabulario",
        "exemplo-partes"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "pc02.q05",
      "topicId": "draft.pc02",
      "prompt": "Compra fictícia: preço à vista R$2.000, entrada de R$500 e cinco prestações de R$320, sem outros pagamentos. Quais valores correspondem ao principal financiado e ao total desembolsado?",
      "options": [
        "R$2.000 e R$1.600.",
        "R$1.500 e R$2.100.",
        "R$500 e R$2.000.",
        "R$2.500 e R$3.600."
      ],
      "answer": 1,
      "explanation": "Principal: 2.000 − 500 = 1.500. Prestações: 5 × 320 = 1.600. Desembolso: 500 + 1.600 = 2.100.",
      "optionRationales": [
        "Ignora a entrada na formação do principal e do desembolso.",
        "Separa valor financiado e desembolso total.",
        "Confunde entrada com principal e preço à vista com total a prazo.",
        "Soma a entrada ao preço para criar principal inexistente."
      ],
      "recoverySectionIds": [
        "fluxo",
        "exemplo-fluxo"
      ],
      "objectiveIds": [
        "O3",
        "O4"
      ]
    },
    {
      "id": "pc02.q06",
      "topicId": "draft.pc02",
      "prompt": "Duas propostas fictícias liberam o mesmo valor hoje, sem outros pagamentos: A tem quatro prestações de R$300; B, oito de R$170. Qual conclusão é demonstrável?",
      "options": [
        "A soma R$1.200; B soma R$1.360, embora B tenha prestação menor.",
        "B necessariamente tem total menor porque sua prestação é menor.",
        "A e B têm o mesmo total, pois liberam o mesmo valor.",
        "Os dados já permitem afirmar que B tem taxa mensal menor, sem cálculo."
      ],
      "answer": 0,
      "explanation": "A soma é 4 × 300; B é 8 × 170. Valor de uma prestação não substitui quantidade de pagamentos.",
      "optionRationales": [
        "Compara os totais e identifica o contraste.",
        "Ignora a quantidade.",
        "Confunde recurso liberado com devolução total.",
        "Afirma taxa sem método e dados suficientes."
      ],
      "recoverySectionIds": [
        "prestacao",
        "exemplo-comparacao"
      ],
      "objectiveIds": [
        "O4",
        "O5"
      ]
    },
    {
      "id": "pc02.q07",
      "topicId": "draft.pc02",
      "prompt": "Em uma prestação fictícia de R$150, o caso informa R$110 de amortização e R$40 de juros, sem outros componentes. O que reduz o principal?",
      "options": [
        "R$150 integralmente, pois juros e amortização são iguais.",
        "R$40, pois juros sempre reduzem principal.",
        "Nada, pois pagar nunca altera principal.",
        "R$110, a parcela de amortização informada."
      ],
      "answer": 3,
      "explanation": "Amortização é a redução do principal; a composição foi explicitada.",
      "optionRationales": [
        "Ignora a separação informada.",
        "Inverte os componentes.",
        "Nega a função da amortização.",
        "Aplica a definição ao componente indicado."
      ],
      "recoverySectionIds": [
        "vocabulario",
        "exemplo-partes"
      ],
      "objectiveIds": [
        "O1",
        "O3"
      ]
    },
    {
      "id": "pc02.q08",
      "topicId": "draft.pc02",
      "prompt": "Um anúncio fictício diz apenas “parcela pequena; você já tem conta aqui”. Qual conclusão é sustentada?",
      "options": [
        "A conta obriga o banco a conceder o crédito.",
        "A parcela pequena garante menor custo total.",
        "Faltam condições e análise: conta e anúncio não demonstram concessão nem adequação do crédito.",
        "O anúncio dispensa conhecer prazo e valores."
      ],
      "answer": 2,
      "explanation": "A concessão envolve análise; comparar condições exige informação além de uma parcela ou relação de conta.",
      "optionRationales": [
        "Cria obrigação de concessão inexistente no recorte.",
        "Ignora quantidade, encargos e prazo.",
        "Reconhece o que está ausente.",
        "Descarta dados essenciais à compreensão."
      ],
      "recoverySectionIds": [
        "prestacao",
        "exemplo-comparacao"
      ],
      "objectiveIds": [
        "O5"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "pc02-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "pc02.q01": [
        {
          "missionId": "draft.pc02",
          "sectionId": "inicio"
        },
        {
          "missionId": "draft.pc02",
          "sectionId": "exemplo-partes"
        }
      ],
      "pc02.q02": [
        {
          "missionId": "draft.pc02",
          "sectionId": "modalidades"
        },
        {
          "missionId": "draft.pc02",
          "sectionId": "exemplo-modalidades"
        }
      ],
      "pc02.q03": [
        {
          "missionId": "draft.pc02",
          "sectionId": "modalidades"
        },
        {
          "missionId": "draft.pc02",
          "sectionId": "exemplo-modalidades"
        }
      ],
      "pc02.q04": [
        {
          "missionId": "draft.pc02",
          "sectionId": "vocabulario"
        },
        {
          "missionId": "draft.pc02",
          "sectionId": "exemplo-partes"
        }
      ],
      "pc02.q05": [
        {
          "missionId": "draft.pc02",
          "sectionId": "fluxo"
        },
        {
          "missionId": "draft.pc02",
          "sectionId": "exemplo-fluxo"
        }
      ],
      "pc02.q06": [
        {
          "missionId": "draft.pc02",
          "sectionId": "prestacao"
        },
        {
          "missionId": "draft.pc02",
          "sectionId": "exemplo-comparacao"
        }
      ],
      "pc02.q07": [
        {
          "missionId": "draft.pc02",
          "sectionId": "vocabulario"
        },
        {
          "missionId": "draft.pc02",
          "sectionId": "exemplo-partes"
        }
      ],
      "pc02.q08": [
        {
          "missionId": "draft.pc02",
          "sectionId": "prestacao"
        },
        {
          "missionId": "draft.pc02",
          "sectionId": "exemplo-comparacao"
        }
      ]
    }
  }
};

export const EDITORIAL = {
  "stage": "Plano existente reaproveitado; ensino, exemplos, prática e recuperação redigidos; revisão independente e humana pendentes; integração não iniciada",
  "referenceOnlyProfiles": [
    {
      "id": "bb.agente-comercial.2022-001",
      "item": "Item 5 histórico, recorte de produtos bancários",
      "status": "histórico; adoção pendente"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Item 19 histórico, recorte de produtos bancários",
      "status": "histórico; adoção pendente"
    }
  ],
  "objectives": {
    "O1": "Identificar tomador, devedor, credor e obrigação.",
    "O2": "Distinguir empréstimo de financiamento pela destinação contratual.",
    "O3": "Separar principal, juros, amortização e prestação nos dados fornecidos.",
    "O4": "Calcular entrada, principal financiado e soma nominal dos pagamentos.",
    "O5": "Reconhecer limites da comparação e insuficiência de anúncio ou vínculo de conta.",
    "O6": "Recuperar o conceito e reconstruir o fluxo antes de repetir a prática."
  },
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Retomar as seções indicadas por questão, explicar a confusão e reconstruir o raciocínio, sem novo indicador de domínio."
  },
  "limits": [
    "Recorte introdutório PC-02; referências BB item 5 e CAIXA item 19 são históricas e não representam cobertura integral nem adoção de edital atual.",
    "Sem fórmulas de CET, SAC/Price ou comparação de valor presente; somas nominais são apenas um critério explicitado, não recomendação ou diagnóstico de adequação financeira.",
    "Leasing é apenas limite de classificação na fonte; não é ensinado nem cobrado. As regras próprias de cartões, cheque especial e custos serão recortes seguintes.",
    "Fontes primárias consultadas em 30/09/2026; confirmar alterações pertinentes antes de publicação futura. Casos fictícios originais, sem dados pessoais ou orientação para casos reais.",
    "Prática exposta, fora de avaliações independentes. IDs locais, sem XP, ordem, pré-requisito produtivo ou importação no catálogo."
  ]
};

export const ARITHMETIC = [
  {
    "label": "exemplo juros",
    "operation": "subtract",
    "values": [
      1080,
      1000
    ],
    "expected": 80
  },
  {
    "label": "máquina principal",
    "operation": "subtract",
    "values": [
      3000,
      600
    ],
    "expected": 2400
  },
  {
    "label": "máquina prestações",
    "operation": "multiply",
    "values": [
      6,
      430
    ],
    "expected": 2580
  },
  {
    "label": "máquina total",
    "operation": "add",
    "values": [
      600,
      2580
    ],
    "expected": 3180
  },
  {
    "label": "máquina diferença",
    "operation": "subtract",
    "values": [
      3180,
      3000
    ],
    "expected": 180
  },
  {
    "label": "comparação A",
    "operation": "multiply",
    "values": [
      5,
      220
    ],
    "expected": 1100
  },
  {
    "label": "comparação B",
    "operation": "multiply",
    "values": [
      10,
      120
    ],
    "expected": 1200
  },
  {
    "label": "q04",
    "operation": "subtract",
    "values": [
      860,
      800
    ],
    "expected": 60
  },
  {
    "label": "q05 principal",
    "operation": "subtract",
    "values": [
      2000,
      500
    ],
    "expected": 1500
  },
  {
    "label": "q05 parcelas",
    "operation": "multiply",
    "values": [
      5,
      320
    ],
    "expected": 1600
  },
  {
    "label": "q05 total",
    "operation": "add",
    "values": [
      500,
      1600
    ],
    "expected": 2100
  },
  {
    "label": "q06 A",
    "operation": "multiply",
    "values": [
      4,
      300
    ],
    "expected": 1200
  },
  {
    "label": "q06 B",
    "operation": "multiply",
    "values": [
      8,
      170
    ],
    "expected": 1360
  },
  {
    "label": "q07 prestação",
    "operation": "add",
    "values": [
      110,
      40
    ],
    "expected": 150
  }
];
