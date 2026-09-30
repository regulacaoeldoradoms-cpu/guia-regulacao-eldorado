// Rascunho editorial isolado; não importar no runtime.
export const SOURCES = [
  {
    "id": "susep.pgbl.vgbl",
    "label": "SUSEP — PGBL e VGBL",
    "url": "https://www.gov.br/susep/pt-br/assuntos/meu-futuro-seguro/seguros-previdencia-e-capitalizacao/providencia-complementar-aberta/pgbl-vgbl",
    "locator": "Página modificada em 22/9/2022, consultada em 30/9/2026: natureza, acumulação, ausência de rentabilidade mínima, bases gerais de IR no resgate e distinção resgate/portabilidade; não adotar limites antigos de investimentos ou regras tributárias detalhadas",
    "version": "Fonte oficial consultada em 30/09/2026; regras do recorte identificado",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "susep.previdencia.info",
    "label": "SUSEP — Previdência aberta: informações importantes",
    "url": "https://www.gov.br/susep/pt-br/assuntos/meu-futuro-seguro/seguros-previdencia-e-capitalizacao/providencia-complementar-aberta/informacoes-importantes",
    "locator": "Página modificada em 22/9/2022, consultada em 30/9/2026: cobertura, regulamento, custos e contribuição definida",
    "version": "Fonte oficial consultada em 30/09/2026; regras do recorte identificado",
    "checkedAt": "2026-09-30"
  }
];

export const PC11C_DRAFT = {
  "id": "draft.pc11c",
  "topicId": "draft.pc11c",
  "editorialKey": "PC-11C",
  "candidateBlockId": "banking.products-credit",
  "title": "Previdência e VGBL: acumulação, benefício e fronteiras",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Reconhecer o funcionamento introdutório de PGBL e VGBL, distinguir custos, resgate e benefício e ler uma base tributável dada sem recomendar plano.",
  "sourceIds": [
    "susep.pgbl.vgbl",
    "susep.previdencia.info"
  ],
  "sections": [
    {
      "id": "inicio",
      "type": "explanation",
      "heading": "1. Recursos para uma etapa futura",
      "body": "Previdência complementar complementa a organização de renda futura; não deve ser confundida com conta corrente ou benefício previdenciário público automaticamente garantido. Aqui estudamos produtos de acumulação por sobrevivência: formar recursos durante um período para recebimento futuro nos termos do plano. Sobrevivência é o evento de a pessoa estar viva na data prevista para o benefício, não uma promessa de proteção contra todo risco. Coberturas de morte ou invalidez têm natureza própria e não devem ser presumidas só pelo nome do produto.",
      "sourceIds": [
        "susep.previdencia.info",
        "susep.pgbl.vgbl"
      ]
    },
    {
      "id": "natureza",
      "type": "explanation",
      "heading": "2. PGBL e VGBL: parecidos na finalidade, diferentes na natureza",
      "body": "PGBL significa Plano Gerador de Benefícios Livres e é plano de previdência complementar aberta. VGBL significa Vida Gerador de Benefícios Livres e é seguro de pessoas com cobertura por sobrevivência. Ambos podem servir à acumulação de recursos, mas isso não torna as categorias jurídicas idênticas. Participante é o termo usual no plano previdenciário; segurado, no seguro. Nesta aula não os confundimos com entidades fechadas de previdência nem detalhamos benefícios públicos.",
      "sourceIds": [
        "susep.pgbl.vgbl"
      ]
    },
    {
      "id": "exemplo-natureza",
      "type": "worked-example",
      "heading": "3. Exemplo resolvido: identificar antes de comparar",
      "body": "Dois prospectos didáticos usam a frase “renda para o futuro”: um identifica PGBL e o outro VGBL. Passo 1: não classificar apenas pelo slogan. Passo 2: PGBL é previdência complementar aberta; VGBL é seguro de pessoas por sobrevivência. Passo 3: só depois comparar condições, custos e regras. A semelhança do objetivo não torna um automaticamente melhor para toda pessoa.",
      "sourceIds": []
    },
    {
      "id": "acumulacao",
      "type": "explanation",
      "heading": "4. Acumulação e recebimento não são a mesma fase",
      "body": "Durante o período de acumulação (diferimento), contribuições ou prêmios e os resultados dos recursos aplicados compõem a reserva, conforme condições e custos. Na etapa de recebimento, pode haver renda ou pagamento único nas condições contratadas. Contribuição definida significa que não se deve presumir um valor final de benefício previamente fixado. No PGBL/VGBL, não há rentabilidade mínima garantida na fase de acumulação: exposição dos recursos e resultados importam. Não usar rentabilidade passada como promessa futura.",
      "sourceIds": [
        "susep.pgbl.vgbl",
        "susep.previdencia.info"
      ]
    },
    {
      "id": "custos",
      "type": "explanation",
      "heading": "5. Custos diminuem recursos disponíveis",
      "body": "Carregamento é encargo relacionado às contribuições/prêmios conforme as condições; taxa de administração remunera a gestão dos recursos do fundo. Seus mecanismos não são idênticos e precisam de leitura própria. Verificar se há cobrança, base, percentual e momento é diferente de assumir uma taxa universal. Uma contribuição bruta e o valor líquido destinado à reserva podem divergir; resultado do fundo e saldo final também não se inferem apenas do valor pago.",
      "sourceIds": [
        "susep.pgbl.vgbl",
        "susep.previdencia.info"
      ]
    },
    {
      "id": "exemplo-custo",
      "type": "worked-example",
      "heading": "6. Exemplo resolvido: contribuição bruta e líquida",
      "body": "Exemplo fictício restrito a um pagamento: contribuição de R$1.000, com carregamento hipotético informado de R$20 no ingresso. Desconsiderando outras movimentações apenas nesse instante, 1.000 − 20 = R$980 seguem para a reserva. Não afirmamos que R$980 serão o valor do resgate final: faltam resultados, custos futuros e condições. Os R$20 não são alíquota obrigatória de produto real.",
      "sourceIds": []
    },
    {
      "id": "resgate",
      "type": "explanation",
      "heading": "7. Resgatar, portar e receber renda",
      "body": "Resgate é retirar recursos segundo as condições; portabilidade é transferi-los para outro plano admitido, respeitando requisitos, não receber livremente o dinheiro na conta para gastá-lo. Receber renda é entrar na forma de benefício escolhida nos termos contratados. Esses eventos não são sinônimos. Prazos, carências e compatibilidade dos planos precisam ser verificados. Não ensinamos transferência automática de PGBL para VGBL ou vice-versa, nem pressupomos que toda renda futura seja vitalícia.",
      "sourceIds": [
        "susep.pgbl.vgbl"
      ]
    },
    {
      "id": "exemplo-evento",
      "type": "worked-example",
      "heading": "8. Exemplo resolvido: o destino do recurso",
      "body": "Caso A pede saque de reserva em dinheiro, nas condições do plano: é pedido de resgate. Caso B pede transferência admitida diretamente para outro plano compatível, sem saque para consumo: é pedido de portabilidade. Caso C já recebe a renda contratada: está na etapa de benefício. Identificar o evento vem antes de apurar custos, requisitos e tributos; não basta chamar tudo de “retirada”.",
      "sourceIds": []
    },
    {
      "id": "tributacao",
      "type": "explanation",
      "heading": "9. Base de imposto não é alíquota nem imposto devido",
      "body": "No recorte geral de resgate de PGBL/VGBL descrito pela SUSEP, há diferença de base para Imposto de Renda: no PGBL, o valor total resgatado; no VGBL, os rendimentos. Base é o montante sobre o qual se aplica a regra tributária; alíquota é o percentual aplicável. Saber a base não informa sozinho quanto se paga. Regime, momento, regras vigentes e situação do titular importam. Eventual dedutibilidade de contribuições PGBL na declaração tem requisitos próprios; não é isenção automática do resgate. Esta aula não calcula dedução, limites, tabelas ou imposto em caso real, nem trata de transmissão por morte.",
      "sourceIds": [
        "susep.pgbl.vgbl"
      ]
    },
    {
      "id": "exemplo-base",
      "type": "worked-example",
      "heading": "10. Exemplo resolvido: comparar somente bases dadas",
      "body": "Hipótese simples de resgate total, sem eventos anteriores: contribuições/prêmios de R$10.000, saldo de R$12.000, dos quais R$2.000 são rendimentos. Pela distinção geral ensinada, a base de IR seria R$12.000 no PGBL e R$2.000 no VGBL. Nenhuma alíquota foi fornecida; portanto não calculamos o imposto nem concluímos qual produto é mais vantajoso para uma pessoa. O caso não representa consulta fiscal.",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "11. Vocabulário para reler o plano",
      "body": "Diferimento: etapa de acumulação anterior ao benefício. Reserva: recursos formados segundo o plano. Contribuição/prêmio: pagamento para o produto previdenciário/segurador. Resgate: retirada nas condições previstas. Portabilidade: transferência entre planos admitidos. Base tributável: montante alcançado pela regra de tributação. Alíquota: percentual aplicável, não o próprio saldo.",
      "sourceIds": []
    },
    {
      "id": "resumo",
      "type": "summary",
      "heading": "12. Roteiro de leitura",
      "body": "Identifique PGBL ou VGBL e a cobertura. Separe acumulação e benefício, contribuição bruta e reserva, custo e resultado. Distinga resgate, portabilidade e renda. Ao falar de imposto, conserve base e alíquota separadas e não invente uma recomendação individual.",
      "sourceIds": []
    }
  ],
  "recall": [
    "Explique a natureza de PGBL e VGBL sem olhar as siglas.",
    "Separe pagamento bruto, custo e reserva no exemplo.",
    "Reconstrua resgate/portabilidade/renda e depois base/alíquota, sem recomendar produto."
  ],
  "questions": [
    {
      "id": "pc11c.q01",
      "topicId": "draft.pc11c",
      "prompt": "Qual identificação de natureza está correta?",
      "options": [
        "VGBL é conta de poupança.",
        "PGBL e VGBL são necessariamente benefícios públicos.",
        "PGBL é seguro de automóvel.",
        "PGBL é previdência complementar aberta; VGBL é seguro de pessoas por sobrevivência."
      ],
      "answer": 3,
      "explanation": "A finalidade semelhante de acumular não apaga as categorias jurídicas.",
      "optionRationales": [
        "Produto não é depósito de poupança.",
        "Não se tornam benefício público.",
        "Troca o produto e a cobertura.",
        "Distingue corretamente as naturezas."
      ],
      "recoverySectionIds": [
        "natureza",
        "exemplo-natureza"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "pc11c.q02",
      "topicId": "draft.pc11c",
      "prompt": "Na fase de acumulação de PGBL/VGBL, o que a aula ensina?",
      "options": [
        "Existe sempre rentabilidade mínima positiva.",
        "Não há rentabilidade mínima garantida; resultados e custos importam.",
        "O saldo final é necessariamente igual a toda contribuição bruta.",
        "Rentabilidade passada garante a mesma taxa futura."
      ],
      "answer": 1,
      "explanation": "A reserva depende da evolução e das condições do produto.",
      "optionRationales": [
        "Contraria a característica ensinada.",
        "Preserva o risco e a influência dos custos.",
        "Ignora custos e resultados.",
        "Transforma histórico em promessa."
      ],
      "recoverySectionIds": [
        "acumulacao",
        "custos"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "pc11c.q03",
      "topicId": "draft.pc11c",
      "prompt": "No exemplo, pagamento de R$1.000 tem carregamento dado de R$20 no ingresso. Quanto segue para reserva naquele instante, sem outras movimentações?",
      "options": [
        "R$980, sem afirmar o valor final de resgate.",
        "R$1.020, pois todo encargo acrescenta reserva.",
        "R$20, porque esse é o valor total aplicado.",
        "R$1.000 independentemente da dedução."
      ],
      "answer": 0,
      "explanation": "A dedução reduz o recurso líquido no instante considerado.",
      "optionRationales": [
        "Calcula e mantém o limite temporal.",
        "Soma o que foi deduzido.",
        "Confunde encargo e líquido.",
        "Ignora o dado do caso."
      ],
      "recoverySectionIds": [
        "custos",
        "exemplo-custo"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "pc11c.q04",
      "topicId": "draft.pc11c",
      "prompt": "Transferência admitida diretamente para outro plano compatível, sem sacar para consumo, é:",
      "options": [
        "renda vitalícia em qualquer situação.",
        "saque livre necessariamente.",
        "portabilidade, sujeita aos requisitos aplicáveis.",
        "compra de consórcio."
      ],
      "answer": 2,
      "explanation": "A destinação ao plano receptor distingue o evento.",
      "optionRationales": [
        "Benefício e portabilidade não são iguais.",
        "O caso exclui saque para consumo.",
        "Identifica evento e condições.",
        "Não há grupo de consórcio."
      ],
      "recoverySectionIds": [
        "resgate",
        "exemplo-evento"
      ],
      "objectiveIds": [
        "O4"
      ]
    },
    {
      "id": "pc11c.q05",
      "topicId": "draft.pc11c",
      "prompt": "No caso de resgate total, R$10.000 pagos e saldo R$12.000, com rendimento R$2.000: quais bases gerais de IR foram ensinadas?",
      "options": [
        "PGBL R$12.000 e VGBL R$2.000.",
        "PGBL R$2.000 e VGBL R$12.000.",
        "Ambos necessariamente sem base alguma.",
        "Ambos sempre R$10.000, ignorando rendimento."
      ],
      "answer": 0,
      "explanation": "A diferença é total resgatado versus rendimentos, no recorte declarado.",
      "optionRationales": [
        "Aplica a distinção ao caso.",
        "Inverte os produtos.",
        "Inventaria isenção universal.",
        "Não corresponde às bases ensinadas."
      ],
      "recoverySectionIds": [
        "tributacao",
        "exemplo-base"
      ],
      "objectiveIds": [
        "O5"
      ]
    },
    {
      "id": "pc11c.q06",
      "topicId": "draft.pc11c",
      "prompt": "Saber que a base é R$2.000 permite, sem alíquota e regime, afirmar que o imposto devido é R$2.000?",
      "options": [
        "Sim, base sempre é igual ao imposto.",
        "Não; base e imposto apurado são grandezas diferentes.",
        "Sim, basta saber o nome comercial.",
        "Não, porque nunca há imposto em nenhum resgate."
      ],
      "answer": 1,
      "explanation": "É necessário aplicar a disciplina tributária; base não é a cobrança final.",
      "optionRationales": [
        "Confunde conceitos.",
        "Reconhece a informação que falta.",
        "Nome não fornece o cálculo completo.",
        "Nega indevidamente qualquer tributação."
      ],
      "recoverySectionIds": [
        "tributacao",
        "exemplo-base"
      ],
      "objectiveIds": [
        "O5"
      ]
    },
    {
      "id": "pc11c.q07",
      "topicId": "draft.pc11c",
      "prompt": "Qual conclusão sobre cobertura e benefício deve ser evitada?",
      "options": [
        "É preciso conferir o tipo de cobertura.",
        "Sobrevivência é um evento definido no produto.",
        "A forma de renda depende das condições.",
        "Todo produto de acumulação cobre morte/invalidez e garante renda vitalícia fixa."
      ],
      "answer": 3,
      "explanation": "Nome e finalidade genérica não garantem todas as coberturas ou formas de renda.",
      "optionRationales": [
        "É leitura necessária.",
        "Corresponde ao vocabulário ensinado.",
        "Conserva o contrato como referência.",
        "Generaliza cobertura e benefício indevidamente."
      ],
      "recoverySectionIds": [
        "inicio",
        "acumulacao",
        "resgate"
      ],
      "objectiveIds": [
        "O1",
        "O2"
      ]
    },
    {
      "id": "pc11c.q08",
      "topicId": "draft.pc11c",
      "prompt": "Uma eventual dedução de contribuição PGBL na declaração significa automaticamente que todo resgate é isento?",
      "options": [
        "Sim, em todos os regimes.",
        "Sim, porque PGBL equivale a dinheiro público.",
        "Não; dedução, requisitos e tributação do resgate são questões distintas.",
        "Sim, sem necessidade de regra tributária."
      ],
      "answer": 2,
      "explanation": "A aula distingue o tratamento da contribuição e do recebimento.",
      "optionRationales": [
        "Cria isenção universal.",
        "Produto complementar não é benefício público automático.",
        "Mantém a distinção e os limites.",
        "Ignora a disciplina legal necessária."
      ],
      "recoverySectionIds": [
        "tributacao"
      ],
      "objectiveIds": [
        "O5"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "pc11c-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "pc11c.q01": [
        {
          "missionId": "draft.pc11c",
          "sectionId": "natureza"
        },
        {
          "missionId": "draft.pc11c",
          "sectionId": "exemplo-natureza"
        }
      ],
      "pc11c.q02": [
        {
          "missionId": "draft.pc11c",
          "sectionId": "acumulacao"
        },
        {
          "missionId": "draft.pc11c",
          "sectionId": "custos"
        }
      ],
      "pc11c.q03": [
        {
          "missionId": "draft.pc11c",
          "sectionId": "custos"
        },
        {
          "missionId": "draft.pc11c",
          "sectionId": "exemplo-custo"
        }
      ],
      "pc11c.q04": [
        {
          "missionId": "draft.pc11c",
          "sectionId": "resgate"
        },
        {
          "missionId": "draft.pc11c",
          "sectionId": "exemplo-evento"
        }
      ],
      "pc11c.q05": [
        {
          "missionId": "draft.pc11c",
          "sectionId": "tributacao"
        },
        {
          "missionId": "draft.pc11c",
          "sectionId": "exemplo-base"
        }
      ],
      "pc11c.q06": [
        {
          "missionId": "draft.pc11c",
          "sectionId": "tributacao"
        },
        {
          "missionId": "draft.pc11c",
          "sectionId": "exemplo-base"
        }
      ],
      "pc11c.q07": [
        {
          "missionId": "draft.pc11c",
          "sectionId": "inicio"
        },
        {
          "missionId": "draft.pc11c",
          "sectionId": "acumulacao"
        },
        {
          "missionId": "draft.pc11c",
          "sectionId": "resgate"
        }
      ],
      "pc11c.q08": [
        {
          "missionId": "draft.pc11c",
          "sectionId": "tributacao"
        }
      ]
    }
  }
};

export const EDITORIAL = {
  "stage": "Plano 66 reaproveitado; rascunho fora do catálogo, revisão independente e humana pendentes; Fase 2 sem aceite humano observado",
  "referenceOnlyProfiles": [
    {
      "id": "bb.agente-comercial.2022-001",
      "item": "Mapa histórico do plano 66; rastreabilidade específica no documento 77/78, sem adoção de edital",
      "status": "histórico; adoção pendente"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Mapa histórico do plano 66; rastreabilidade específica no documento 77/78, sem adoção de edital",
      "status": "histórico; adoção pendente"
    }
  ],
  "objectives": [
    "O1: identificar natureza e cobertura",
    "O2: distinguir acumulação e benefício",
    "O3: separar custos e reserva",
    "O4: distinguir resgate/portabilidade/renda",
    "O5: interpretar a base tributável sem extrapolar",
    "O6: recuperar o conceito na aula"
  ],
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Retomar os trechos indicados, explicar a confusão e reconstruir o caso antes de repetir; não gerar indicador de domínio."
  },
  "limits": [
    "Recorte introdutório por sobrevivência; não esgota previdência aberta/fechada, coberturas de risco ou regras de renda.",
    "Fonte educativa da SUSEP tem versão histórica indicada. Não incorporar sua enumeração antiga de limites de renda variável, procedimentos ou detalhes fiscais como regra atual; regras específicas exigem conferência normativa antes de ensino/publicação.",
    "Sem alíquotas/tabelas, cálculo de dedução fiscal, sucessão, IOF ou recomendação tributária/contratual.",
    "Casos fictícios originais, sem recomendação para pessoa real. Fontes primárias consultadas em 30/09/2026; conferir alterações pertinentes antes de publicação futura.",
    "Prática exposta, fora de avaliações independentes. IDs locais, sem XP/ordem/gate produtivo ou importação no manifesto. Não demonstra cobertura integral do bloco ou edital histórico."
  ]
};

export const ARITHMETIC = [
  {
    "label": "Contribuição líquida",
    "operation": "subtract",
    "values": [
      1000,
      20
    ],
    "expected": 980
  },
  {
    "label": "Rendimentos do caso",
    "operation": "subtract",
    "values": [
      12000,
      10000
    ],
    "expected": 2000
  }
];
