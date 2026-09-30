// Rascunho editorial, sem importação pelo runtime. Valores didáticos são fictícios.
export const SOURCES = [
  {
    "id": "bcb.selic",
    "label": "BCB — Taxa Selic",
    "url": "https://www.bcb.gov.br/controleinflacao/taxaselic",
    "version": "Página institucional consultada em 30/09/2026",
    "locator": "Definição da taxa efetiva nas compromissadas de um dia útil e atuação para alinhá-la à meta definida pelo Copom. Sem usar o valor atual.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "bcb.compulsorios",
    "label": "BCB — Recolhimentos compulsórios",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/recolhimentoscompulsorios",
    "version": "Página institucional consultada em 30/09/2026",
    "locator": "Recolhimento obrigatório ao BCB, liquidez e estabilidade financeira. Não utilizada para alíquotas atuais.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "br.l4595",
    "label": "Lei 4.595/1964",
    "url": "https://www.planalto.gov.br/ccivil_03/leis/l4595.htm",
    "version": "Redação dos incisos V e XII do artigo 10 dada pela LC 179/2021, consultada em 30/09/2026",
    "locator": "Competências do BCB para redesconto/empréstimo e operações com títulos federais, sob regulamentação; não confundir trechos revogados com vigentes.",
    "checkedAt": "2026-09-30"
  }
];
export const MP05_DRAFT = {
  "id": "draft.mp05",
  "topicId": "draft.mp05",
  "editorialKey": "MP-05",
  "candidateBlockId": "banking.markets-policy",
  "title": "Operações e instrumentos convencionais",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Ler participantes, fluxos e prazos de operações monetárias; distinguir compromissadas, compulsórios e redesconto sem confundi-los com crédito ao consumidor.",
  "sourceIds": [
    "bcb.selic",
    "bcb.compulsorios",
    "br.l4595"
  ],
  "sections": [
    {
      "id": "retomada",
      "type": "explanation",
      "heading": "1. Da decisão às operações",
      "body": "Em [MP-04](mp-04-v1.md), a meta de juros era a decisão; agora veremos operações que afetam a disponibilidade de recursos das instituições. Retome também liquidez em MP-02. Nesta aula, “liquidez bancária” se refere à capacidade de cumprir pagamentos nas condições e datas necessárias. Não é automaticamente o saldo disponível de um correntista. Pergunte sempre: quem entrega recursos, quem recebe e quando há devolução?",
      "sourceIds": []
    },
    {
      "id": "titulos",
      "type": "explanation",
      "heading": "2. O que circula junto com o dinheiro",
      "body": "Título de dívida registra uma obrigação de pagamento do emissor e um direito de seu titular, conforme condições próprias. Negociar o título pode mudar seu titular sem criar uma nova emissão. Preço é o valor pago na negociação; vencimento é a data prevista para cumprimento final da obrigação. Emissor e vendedor podem ser pessoas diferentes. O Tesouro emitir um título e o BCB operar com títulos existentes têm finalidades e fluxos distintos. MP-07 aprofundará dívida pública.",
      "sourceIds": [
        "br.l4595"
      ]
    },
    {
      "id": "compromissada",
      "type": "explanation",
      "heading": "3. Compromissada: observar as duas pontas",
      "body": "Uma compromissada combina uma compra ou venda de títulos agora com compromisso de operação inversa em data e condições acordadas. Para quem vende com compromisso de recomprar, entra dinheiro inicialmente e há compromisso de pagar na volta. Para quem compra com compromisso de revender, sai dinheiro inicialmente e há compromisso de recebê-lo na volta. Mudar o ponto de vista troca os verbos, mas não muda os participantes ou o sentido do fluxo. Não confunda o prazo da compromissada com o vencimento do título usado nela. As compromissadas federais de um dia útil integram a definição da Selic efetiva ensinada em MP-04.",
      "sourceIds": [
        "bcb.selic"
      ]
    },
    {
      "id": "exemplo-absorcao",
      "type": "worked-example",
      "heading": "4. Exemplo resolvido: absorção inicial de liquidez",
      "body": "Modelo fictício e simplificado: hoje o BCB vende um título ao banco A por 100 unidades monetárias, comprometendo-se a recomprá-lo amanhã por 101. Hoje: título vai do BCB ao banco; recursos vão do banco ao BCB. Essa ponta retira 100 da disponibilidade usada no modelo pelo banco. Amanhã: o título volta ao BCB e 101 seguem ao banco. Diferença: 101 − 100 = 1. O número é inventado para acompanhar as setas, não é uma taxa brasileira nem reproduz as regras de um leilão.",
      "sourceIds": []
    },
    {
      "id": "exemplo-injecao",
      "type": "worked-example",
      "heading": "5. Exemplo resolvido: inverter o ponto de vista",
      "body": "Segundo caso fictício: hoje o BCB compra do banco B um título por 200, com compromisso de revendê-lo amanhã por 202. Na ida, recursos saem do BCB e entram no banco: há provisão de liquidez inicial. Na volta, o banco entrega 202 e recebe o título. A diferença de 2 decorre exclusivamente dos valores dados. Nos dois exemplos, observar apenas “compra” sem identificar quem compra e em qual data pode inverter a resposta.",
      "sourceIds": []
    },
    {
      "id": "mercado-aberto",
      "type": "explanation",
      "heading": "6. Operar com títulos não é decidir gasto público",
      "body": "A Lei 4.595 atribui ao BCB operações com títulos públicos federais como instrumento monetário, sob regulamentação. Na aula, o efeito inicial das operações é acompanhado pelo fluxo de recursos. Isso não significa que o BCB esteja autorizando uma obra nem que qualquer compra de título seja nova receita de emissão para o Tesouro. Também não basta ver uma operação isolada para deduzir toda a orientação monetária: pode haver outras operações e vencimentos no mesmo dia.",
      "sourceIds": [
        "br.l4595"
      ]
    },
    {
      "id": "compulsorio",
      "type": "explanation",
      "heading": "7. Compulsório: obrigação de manter recursos no BCB",
      "body": "O recolhimento compulsório exige que instituições mantenham no BCB recursos calculados segundo regras aplicáveis a determinadas captações. Há bases e modalidades diferentes; não se deve memorizar uma alíquota inventada como vigente. O BCB descreve funções monetárias e de estabilidade financeira, inclusive disponibilidade de reservas em situações definidas. Alterar a exigência pode mudar recursos disponíveis, mas não garante aumento proporcional de empréstimos: demanda, risco e outras restrições continuam relevantes.",
      "sourceIds": [
        "bcb.compulsorios"
      ]
    },
    {
      "id": "exemplo-compulsorio",
      "type": "worked-example",
      "heading": "8. Exemplo resolvido: conta de uma regra hipotética",
      "body": "Regra exclusivamente didática: base de 1.000 e alíquota de 20%, sem deduções. Recolhimento: 1.000 × 0,20 = 200. Se só a alíquota passasse a 15%, seria 1.000 × 0,15 = 150; diferença de 50. Isso mede a alteração da exigência no modelo. Não prova que cada cliente recebeu dinheiro, nem que o crédito cresceu exatamente 50. Bases reais, deduções, períodos e remuneração exigiriam consulta à norma específica. Estes percentuais não são apresentados como atuais.",
      "sourceIds": []
    },
    {
      "id": "redesconto",
      "type": "explanation",
      "heading": "9. Redesconto e assistência de liquidez",
      "body": "A legislação autoriza o BCB a realizar redesconto e empréstimos com instituições financeiras públicas e privadas, sob regras próprias de remuneração, limites, prazos e garantias. No recorte introdutório, são meios de obter recursos do banco central para necessidades de liquidez, com obrigações e condições; não uma doação. Não são empréstimos pessoais do BCB ao correntista. A descrição geral não informa quem é elegível a uma linha específica hoje, sua taxa ou os ativos aceitos.",
      "sourceIds": [
        "br.l4595"
      ]
    },
    {
      "id": "exemplo-redesconto",
      "type": "worked-example",
      "heading": "10. Exemplo resolvido: de quem é a necessidade?",
      "body": "Um banco fictício tem pagamentos no dia e recursos a receber mais tarde. Admitindo explicitamente que cumpre os requisitos de uma operação de assistência do BCB, obtém recursos agora e assume devolução conforme o contrato. A necessidade analisada é a do banco, não um pedido de financiamento pessoal de seu cliente. A operação pode enfrentar o desencontro temporal; não prova por si que todos os ativos do banco valem mais que suas obrigações. Liquidez e solvência não são sinônimos.",
      "sourceIds": []
    },
    {
      "id": "comparacao",
      "type": "explanation",
      "heading": "11. Comparar pela obrigação e pelo fluxo",
      "body": "Nas compromissadas dos exemplos, siga título e dinheiro nas duas datas. No compulsório, identifique obrigação, base e recolhimento. No redesconto/assistência, identifique instituição tomadora e condições de devolução. Uma medida sobre exigência de reservas e uma concessão de recursos têm mecanismos diferentes, ainda que ambas possam afetar liquidez. Não classifique tudo como “imprimir cédulas”: fluxos financeiros também ocorrem por registros.",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "12. Vocabulário de operações",
      "body": "Contraparte: o outro participante da operação. Compromisso de recompra/revenda: obrigação de uma operação inversa futura. Absorção/provisão: redução/aumento inicial de disponibilidade no lado observado. Base de cálculo: montante ao qual se aplica uma regra. Alíquota: percentual usado nessa regra. Solvência: capacidade patrimonial de honrar obrigações; difere de disponibilidade no momento. Garantia: proteção prevista para cumprimento da obrigação, sem substituir a análise de regras.",
      "sourceIds": []
    },
    {
      "id": "resumo",
      "type": "summary",
      "heading": "13. Um método para não inverter as setas",
      "body": "Escreva duas linhas, “hoje” e “retorno”. Em cada uma, identifique origem e destino do dinheiro e do título. Depois nomeie o mecanismo; não comece decorando “compra aumenta” sem sujeito. Em problemas de compulsório, marque base/percentual e limite da inferência. Ao errar, refaça o mesmo fluxo pela perspectiva da contraparte e confira se as duas descrições concordam.",
      "sourceIds": []
    }
  ],
  "questions": [
    {
      "prompt": "Hoje o BCB vende um título a um banco com compromisso de recompra. Na ponta inicial descrita, os recursos seguem em qual direção?",
      "options": [
        "Do BCB ao banco, pois toda venda cria liquidez para o banco.",
        "Do banco ao BCB, reduzindo inicialmente sua disponibilidade no modelo.",
        "Do Tesouro ao correntista, necessariamente.",
        "Não há dinheiro em uma compromissada."
      ],
      "answer": 1,
      "explanation": "O comprador banco entrega recursos ao vendedor BCB nesta ponta.",
      "optionRationales": [
        "Inverte os participantes.",
        "Acompanha a contraprestação da compra.",
        "Introduz participantes ausentes.",
        "Ignora o pagamento pela compra."
      ],
      "recoverySectionIds": [
        "compromissada",
        "exemplo-absorcao"
      ],
      "objectiveIds": [
        "O1"
      ],
      "id": "mp05.q01",
      "topicId": "draft.mp05"
    },
    {
      "prompt": "No caso em que o BCB compra hoje e se compromete a revender amanhã, qual é a ponta de retorno no modelo?",
      "options": [
        "O banco recebe mais recursos e não devolve nada.",
        "O título é extinto automaticamente.",
        "O banco paga o valor combinado e recebe de volta o título.",
        "O correntista decide a meta Selic."
      ],
      "answer": 2,
      "explanation": "A operação inversa devolve o título ao banco contra recursos para o BCB.",
      "optionRationales": [
        "Suprime a obrigação de retorno.",
        "Confunde revenda com extinção.",
        "Inverte corretamente os fluxos da ida.",
        "Não tem relação com o contrato."
      ],
      "recoverySectionIds": [
        "exemplo-injecao"
      ],
      "objectiveIds": [
        "O1"
      ],
      "id": "mp05.q02",
      "topicId": "draft.mp05"
    },
    {
      "prompt": "Uma compromissada dura um dia e usa título que vence em dois anos. Isso permite concluir que o título vence amanhã?",
      "options": [
        "Não: prazo da operação e vencimento do título são diferentes.",
        "Sim: a revenda altera obrigatoriamente o vencimento.",
        "Sim: qualquer título usado em compromissada dura um dia.",
        "Não: títulos nunca vencem."
      ],
      "answer": 0,
      "explanation": "A obrigação de operação inversa não é o vencimento original do título.",
      "optionRationales": [
        "Distingue os dois prazos.",
        "Não há essa alteração no enunciado.",
        "Generaliza indevidamente o prazo.",
        "Nega a obrigação final dos títulos."
      ],
      "recoverySectionIds": [
        "titulos",
        "compromissada"
      ],
      "objectiveIds": [
        "O2"
      ],
      "id": "mp05.q03",
      "topicId": "draft.mp05"
    },
    {
      "prompt": "Regra fictícia sem deduções: base 800, alíquota 10%. Qual recolhimento ela determina?",
      "options": [
        "10, porque a alíquota é dez.",
        "800, independentemente da alíquota.",
        "8, dividindo a base por cem sem multiplicar por dez.",
        "80, calculando 800 × 0,10."
      ],
      "answer": 3,
      "explanation": "A porcentagem é aplicada à base definida.",
      "optionRationales": [
        "Confunde taxa e montante.",
        "Ignora a proporção.",
        "Calcula apenas 1% da base.",
        "Aplica a regra dada."
      ],
      "recoverySectionIds": [
        "compulsorio",
        "exemplo-compulsorio"
      ],
      "objectiveIds": [
        "O3"
      ],
      "id": "mp05.q04",
      "topicId": "draft.mp05"
    },
    {
      "prompt": "A redução hipotética de compulsório libera 50 de exigência. O que pode ser afirmado apenas com isso?",
      "options": [
        "Todo correntista recebeu 50.",
        "A exigência caiu 50 no modelo; o novo crédito depende de outros fatores.",
        "Os empréstimos cresceram necessariamente 500.",
        "O BCB doou permanentemente 50 a cada banco."
      ],
      "answer": 1,
      "explanation": "A conta mede exigência, não decisões de crédito nem transferências a clientes.",
      "optionRationales": [
        "Cria um repasse inexistente.",
        "Respeita o limite da conta.",
        "Inventa multiplicador e resultado.",
        "Confunde alteração de obrigação com doação."
      ],
      "recoverySectionIds": [
        "compulsorio",
        "exemplo-compulsorio"
      ],
      "objectiveIds": [
        "O3",
        "O5"
      ],
      "id": "mp05.q05",
      "topicId": "draft.mp05"
    },
    {
      "prompt": "Na assistência de liquidez apresentada, quem obtém recursos do BCB sob condições?",
      "options": [
        "Todo consumidor, sem intermediário.",
        "A instituição financeira elegível, assumindo as obrigações aplicáveis.",
        "A empresa varejista, dispensada de pagar.",
        "Qualquer pessoa, sem análise de regras."
      ],
      "answer": 1,
      "explanation": "A relação descrita é BCB–instituição financeira e depende de regulamentação.",
      "optionRationales": [
        "Troca instituição tomadora por correntista.",
        "Preserva participantes e condições.",
        "Transforma operação em doação direta.",
        "Elimina os requisitos."
      ],
      "recoverySectionIds": [
        "redesconto",
        "exemplo-redesconto"
      ],
      "objectiveIds": [
        "O4"
      ],
      "id": "mp05.q06",
      "topicId": "draft.mp05"
    },
    {
      "prompt": "Um banco supera falta de recursos hoje com operação permitida. Isso prova sua solvência?",
      "options": [
        "Sim, liquidez de hoje e solvência são a mesma medida.",
        "Sim, toda dívida futura desaparece.",
        "Não: resolver um fluxo de hoje não basta para avaliar ativos e obrigações.",
        "Não: obter liquidez prova insolvência."
      ],
      "answer": 2,
      "explanation": "O dado é temporal; a avaliação patrimonial exige outras informações.",
      "optionRationales": [
        "Confunde conceitos distintos.",
        "A operação preserva obrigações.",
        "Identifica a informação que falta.",
        "Conclui o oposto sem evidência."
      ],
      "recoverySectionIds": [
        "exemplo-redesconto",
        "glossario"
      ],
      "objectiveIds": [
        "O4",
        "O5"
      ],
      "id": "mp05.q07",
      "topicId": "draft.mp05"
    },
    {
      "prompt": "Uma compra de título existente pelo BCB basta para afirmar que o Tesouro acabou de captar recursos por nova emissão?",
      "options": [
        "Sim, todo vendedor de título público é o Tesouro.",
        "Não: é preciso identificar vendedor e natureza da operação.",
        "Sim, o título sempre nasce novamente ao ser negociado.",
        "Não: o Tesouro nunca emite títulos."
      ],
      "answer": 1,
      "explanation": "Emissor e vendedor podem ser diferentes; emissão e negociação precisam ser separadas.",
      "optionRationales": [
        "Confunde emissor e detentor.",
        "Usa a identificação correta do fluxo.",
        "Confunde troca de titular com nova emissão.",
        "Nega a emissão sem fundamento."
      ],
      "recoverySectionIds": [
        "titulos",
        "mercado-aberto"
      ],
      "objectiveIds": [
        "O2",
        "O5"
      ],
      "id": "mp05.q08",
      "topicId": "draft.mp05"
    }
  ],
  "recall": [
    "Desenhe as duas pontas de uma venda com recompra, nomeando participantes.",
    "Explique por que menor compulsório não determina sozinho o novo crédito.",
    "Recupere um erro invertendo a perspectiva e conferindo as mesmas setas."
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "mp05-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "mp05.q01": [
        {
          "missionId": "draft.mp05",
          "sectionId": "compromissada"
        },
        {
          "missionId": "draft.mp05",
          "sectionId": "exemplo-absorcao"
        }
      ],
      "mp05.q02": [
        {
          "missionId": "draft.mp05",
          "sectionId": "exemplo-injecao"
        }
      ],
      "mp05.q03": [
        {
          "missionId": "draft.mp05",
          "sectionId": "titulos"
        },
        {
          "missionId": "draft.mp05",
          "sectionId": "compromissada"
        }
      ],
      "mp05.q04": [
        {
          "missionId": "draft.mp05",
          "sectionId": "compulsorio"
        },
        {
          "missionId": "draft.mp05",
          "sectionId": "exemplo-compulsorio"
        }
      ],
      "mp05.q05": [
        {
          "missionId": "draft.mp05",
          "sectionId": "compulsorio"
        },
        {
          "missionId": "draft.mp05",
          "sectionId": "exemplo-compulsorio"
        }
      ],
      "mp05.q06": [
        {
          "missionId": "draft.mp05",
          "sectionId": "redesconto"
        },
        {
          "missionId": "draft.mp05",
          "sectionId": "exemplo-redesconto"
        }
      ],
      "mp05.q07": [
        {
          "missionId": "draft.mp05",
          "sectionId": "exemplo-redesconto"
        },
        {
          "missionId": "draft.mp05",
          "sectionId": "glossario"
        }
      ],
      "mp05.q08": [
        {
          "missionId": "draft.mp05",
          "sectionId": "titulos"
        },
        {
          "missionId": "draft.mp05",
          "sectionId": "mercado-aberto"
        }
      ]
    }
  }
};
export const EDITORIAL = {
  "stage": "B/C/E redigidas; revisão factual/editorial do autor; revisão independente/humana pendente; integração F não iniciada",
  "referenceOnlyProfiles": [
    {
      "id": "bb.agente-comercial.2022-001",
      "item": "Item 3, recorte introdutório",
      "status": "histórico; adoção/profundidade pendentes"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Itens 16/17, recorte introdutório",
      "status": "histórico; adoção/profundidade pendentes"
    }
  ],
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Retomar o exemplo indicado, explicar o erro e resolver um caso alterado; sem alterar a política de revisão do aplicativo."
  },
  "limits": [
    "Modelos de fluxos simplificados: não são manuais operacionais nem normas atuais de leilão.",
    "Não afirma taxas, alíquotas, elegibilidade ou garantias vigentes de modalidades específicas.",
    "Ensino geral de redesconto/assistência; modalidades normativas detalhadas continuam fora do recorte.",
    "Rascunho fora do catálogo; não é nova forma independente A/B, aceite de fase ou recomendação financeira."
  ]
};
export const ARITHMETIC = [
  {
    "label": "Absorção: diferença",
    "operation": "subtract",
    "values": [
      101,
      100
    ],
    "expected": 1
  },
  {
    "label": "Injeção: diferença",
    "operation": "subtract",
    "values": [
      202,
      200
    ],
    "expected": 2
  },
  {
    "label": "Compulsório inicial",
    "operation": "multiply",
    "values": [
      1000,
      0.2
    ],
    "expected": 200
  },
  {
    "label": "Compulsório alterado",
    "operation": "multiply",
    "values": [
      1000,
      0.15
    ],
    "expected": 150
  },
  {
    "label": "Diferença exigência",
    "operation": "subtract",
    "values": [
      200,
      150
    ],
    "expected": 50
  },
  {
    "label": "q04",
    "operation": "multiply",
    "values": [
      800,
      0.1
    ],
    "expected": 80
  }
];
