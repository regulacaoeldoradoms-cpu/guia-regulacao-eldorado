export const SOURCES = [
  {
    "id": "bis.dp.bigtech",
    "label": "BIS — Big tech in finance",
    "url": "https://www.bis.org/publications/aer-2019/big-tech-finance-opportunities-risks",
    "locator": "Conceitos de plataforma, dados, rede e entrada em finanças; não estatísticas atuais",
    "version": "Annual Economic Report 2019, capítulo III",
    "checkedAt": "2026-10-01"
  }
];

export const DP11_DRAFT = {
  "id": "draft.dp11",
  "topicId": "banking.digital-payments",
  "candidateBlockId": "banking.digital-payments",
  "editorialKey": "DP-11",
  "title": "Marketplace: plataforma, oferta e pagamento",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Reconhecer intermediação entre ofertantes e compradores em marketplace.",
  "sourceIds": [
    "bis.dp.bigtech"
  ],
  "sections": [
    {
      "id": "plataforma",
      "type": "explanation",
      "heading": "1. Uma vitrine com mais de um ofertante",
      "body": "No recorte didático, marketplace é uma plataforma que aproxima ofertantes e compradores. A mesma plataforma pode também apresentar ofertas próprias: é necessário identificar quem vende em cada caso. O BIS analisa plataformas digitais que conectam atividades e participantes; aqui aplicamos essa ideia à leitura de uma vitrine, sem classificar empresas reais.",
      "sourceIds": [
        "bis.dp.bigtech"
      ]
    },
    {
      "id": "ex-vitrine",
      "type": "worked-example",
      "heading": "2. Exemplo resolvido: quem oferece?",
      "body": "Na plataforma fictícia Feira, a oferta A é vendida pela loja Sol e a oferta B pela loja Lua. Feira organiza a vitrine. Não se deve atribuir ambas as vendas à própria plataforma somente porque aparecem na mesma tela. O caso identifica os vendedores, sem decidir todas as responsabilidades jurídicas.",
      "sourceIds": []
    },
    {
      "id": "papeis",
      "type": "explanation",
      "heading": "3. Vender, aproximar e pagar são funções diferentes",
      "body": "Desenhe três funções: a plataforma aproxima participantes; o vendedor oferece o produto; o prestador de pagamento processa a operação financeira no papel descrito. Algumas organizações podem acumular funções, mas isso precisa constar do caso. Uma função não prova automaticamente as outras.",
      "sourceIds": []
    },
    {
      "id": "ex-pagamento",
      "type": "worked-example",
      "heading": "4. Exemplo resolvido: três participantes",
      "body": "A loja Sol vende pela Feira e o serviço fictício Ponto processa o pagamento. O caso distingue vendedor, plataforma e prestador de pagamento. Se o comprador usou um único aplicativo, isso não apaga os três papéis nem torna Ponto vendedor da mercadoria.",
      "sourceIds": []
    },
    {
      "id": "remuneracao",
      "type": "explanation",
      "heading": "5. Como a plataforma se remunera?",
      "body": "Comissão por venda, assinatura e publicidade são possibilidades de modelos. A questão deve informar qual vale no cenário. Receita recebida não é lucro: para chegar ao resultado seria necessário considerar custos e outras condições. Também não se pode inferir o custo total do comprador só pela comissão cobrada do vendedor.",
      "sourceIds": []
    },
    {
      "id": "ex-comissao",
      "type": "worked-example",
      "heading": "6. Exemplo resolvido: comissão expressamente definida",
      "body": "A hipótese fixa comissão de 5% sobre uma venda de R$200, sem outras deduções naquele cálculo. Cinco por cento equivale a 5/100: 200 × 0,05 = R$10. Restam R$190 do valor da venda ao vendedor antes de seus demais custos. R$10 é receita de comissão no exemplo, não lucro líquido da plataforma.",
      "sourceIds": []
    },
    {
      "id": "rede",
      "type": "explanation",
      "heading": "7. Comparar ofertas exige condições",
      "body": "Mais ofertantes podem ampliar opções e mais compradores podem atrair ofertantes: é o efeito de rede retomado de DP-03. Isso não torna todas as ofertas adequadas nem garante menor preço. Compare as condições descritas, incluindo valor final e características relevantes, sem assumir equivalência onde ela não foi informada.",
      "sourceIds": [
        "bis.dp.bigtech"
      ]
    },
    {
      "id": "ex-comparacao",
      "type": "worked-example",
      "heading": "8. Exemplo resolvido: preço anunciado e total",
      "body": "Duas ofertas do mesmo produto, com demais condições iguais no caso: A custa R$90 mais R$20 de entrega; B custa R$100 com entrega incluída. A soma de A é R$110. Portanto B tem menor total nesse cenário, embora seu preço anunciado isolado seja maior. Isso não estabelece uma regra universal sobre qualquer vendedor.",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "Vocabulário essencial",
      "body": "Marketplace: plataforma que aproxima oferta e demanda. Vendedor: quem oferece no caso. Comissão: remuneração definida por uma base. Receita: valor recebido; lucro depende também de custos. Efeito de rede: utilidade ligada à presença de participantes.",
      "sourceIds": []
    },
    {
      "id": "resumo",
      "type": "summary",
      "heading": "Recuperação e síntese",
      "body": "Mapeie plataforma, vendedor e pagamento. Compare a mesma base de preço e separe comissão de lucro. Se errar, nomeie a confusão, retome o trecho indicado e reconstrua o exemplo com suas palavras. Esta prática exposta não é avaliação independente de retenção.",
      "sourceIds": []
    }
  ],
  "questions": [
    {
      "prompt": "Duas lojas vendem ofertas numa plataforma. O que caracteriza o recorte de marketplace?",
      "options": [
        "A proibição de vários vendedores.",
        "A aproximação de ofertantes e compradores pela plataforma.",
        "A certeza de que a plataforma vende todo item.",
        "A inexistência de pagamento."
      ],
      "answer": 1,
      "explanation": "É a função de intermediação apresentada.",
      "optionRationales": [
        "Contradiz o caso.",
        "É a função de intermediação apresentada.",
        "A identidade do vendedor deve ser lida em cada oferta.",
        "O modelo pode incluir pagamentos."
      ],
      "recoverySectionIds": [
        "plataforma",
        "ex-vitrine"
      ],
      "objectiveIds": [
        "O1"
      ],
      "id": "dp11.q01"
    },
    {
      "prompt": "Loja Sol vende, Feira organiza a vitrine e Ponto processa pagamento. Quem é vendedor no caso?",
      "options": [
        "Ponto, porque processa.",
        "Qualquer visitante da tela.",
        "Feira obrigatoriamente.",
        "Loja Sol, conforme identificação expressa."
      ],
      "answer": 3,
      "explanation": "Preserva o papel informado.",
      "optionRationales": [
        "Processar não atribui a venda da mercadoria.",
        "Visitante não é o vendedor identificado.",
        "A vitrine não altera a atribuição dada.",
        "Preserva o papel informado."
      ],
      "recoverySectionIds": [
        "papeis",
        "ex-pagamento"
      ],
      "objectiveIds": [
        "O2"
      ],
      "id": "dp11.q02"
    },
    {
      "prompt": "Comissão de 5% sobre R$200, nas hipóteses da aula, resulta em:",
      "options": [
        "R$10 de comissão.",
        "R$5 de comissão.",
        "R$100 de lucro líquido.",
        "R$200 de comissão."
      ],
      "answer": 0,
      "explanation": "200 vezes 0,05 resulta em 10.",
      "optionRationales": [
        "200 vezes 0,05 resulta em 10.",
        "Confunde percentual com valor fixo.",
        "Não corresponde ao cálculo nem demonstra lucro.",
        "Equivaleria a 100%, não 5%."
      ],
      "recoverySectionIds": [
        "ex-comissao"
      ],
      "objectiveIds": [
        "O3"
      ],
      "id": "dp11.q03"
    },
    {
      "prompt": "R$10 recebidos como comissão comprovam:",
      "options": [
        "Lucro líquido de R$10 sem conhecer custos.",
        "Ausência de despesa da plataforma.",
        "Receita de comissão nesse cálculo, sem concluir lucro líquido.",
        "Custo total universal do comprador."
      ],
      "answer": 2,
      "explanation": "Separa receita e resultado.",
      "optionRationales": [
        "Lucro exige considerar custos e condições.",
        "Receita não elimina despesas.",
        "Separa receita e resultado.",
        "A comissão do vendedor não define todos os gastos do comprador."
      ],
      "recoverySectionIds": [
        "remuneracao",
        "ex-comissao"
      ],
      "objectiveIds": [
        "O3"
      ],
      "id": "dp11.q04"
    },
    {
      "prompt": "Mesmo produto e demais condições iguais: A é R$90 + R$20 de entrega; B é R$100 com entrega. Qual é o menor total?",
      "options": [
        "A, por anunciar 90.",
        "Ambas custam 90.",
        "A custa 100.",
        "B, pois 100 é menor que 110."
      ],
      "answer": 3,
      "explanation": "Compara o desembolso total informado.",
      "optionRationales": [
        "Ignora o frete.",
        "Não corresponde aos valores.",
        "A soma de A é 110.",
        "Compara o desembolso total informado."
      ],
      "recoverySectionIds": [
        "ex-comparacao"
      ],
      "objectiveIds": [
        "O4"
      ],
      "id": "dp11.q05"
    },
    {
      "prompt": "Mais vendedores atraem compradores e vice-versa. Isso ilustra:",
      "options": [
        "Efeito de rede, sem garantir qualidade de toda oferta.",
        "Garantia de menor preço de todos os produtos.",
        "Autorização bancária automática.",
        "Aprovação de todo crédito."
      ],
      "answer": 0,
      "explanation": "Reconhece o efeito e seus limites.",
      "optionRationales": [
        "Reconhece o efeito e seus limites.",
        "Quantidade não garante preço mínimo.",
        "Rede não é licença.",
        "Não há essa operação nem essa garantia."
      ],
      "recoverySectionIds": [
        "rede"
      ],
      "objectiveIds": [
        "O4",
        "O5"
      ],
      "id": "dp11.q06"
    },
    {
      "prompt": "Uma plataforma pode acumular funções de vendedor e prestador de outro serviço?",
      "options": [
        "Nunca, por definição absoluta.",
        "O caso deve informar as funções; não se presume nem se exclui o acúmulo apenas pela tela.",
        "Sim, e por isso todo pagamento é concedido como crédito.",
        "Sim, e toda oferta fica garantida pelo BC."
      ],
      "answer": 1,
      "explanation": "Exige identificação em vez de suposição.",
      "optionRationales": [
        "O recorte admite funções acumuladas quando descritas.",
        "Exige identificação em vez de suposição.",
        "Funções acumuladas não implicam empréstimo.",
        "Não decorre nenhuma garantia desse tipo."
      ],
      "recoverySectionIds": [
        "plataforma",
        "papeis"
      ],
      "objectiveIds": [
        "O2",
        "O5"
      ],
      "id": "dp11.q07"
    },
    {
      "prompt": "O aluno escolheu A olhando só R$90, ignorando os R$20 de entrega. Qual recuperação é útil?",
      "options": [
        "Apagar o frete do caso.",
        "Trocar o nome da loja.",
        "Recompor o total de cada oferta sob as mesmas condições informadas.",
        "Presumir que toda oferta em marketplace é melhor."
      ],
      "answer": 2,
      "explanation": "Corrige o critério de comparação.",
      "optionRationales": [
        "Elimina um custo relevante dado.",
        "Nome não resolve a comparação.",
        "Corrige o critério de comparação.",
        "Não há garantia geral."
      ],
      "recoverySectionIds": [
        "ex-comparacao",
        "resumo"
      ],
      "objectiveIds": [
        "O6"
      ],
      "id": "dp11.q08"
    }
  ],
  "recall": [
    "Mapeie plataforma, vendedor e pagamento.",
    "Compare a mesma base de preço e separe comissão de lucro."
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "dp11-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "dp11.q01": [
        {
          "missionId": "draft.dp11",
          "sectionId": "plataforma"
        },
        {
          "missionId": "draft.dp11",
          "sectionId": "ex-vitrine"
        }
      ],
      "dp11.q02": [
        {
          "missionId": "draft.dp11",
          "sectionId": "papeis"
        },
        {
          "missionId": "draft.dp11",
          "sectionId": "ex-pagamento"
        }
      ],
      "dp11.q03": [
        {
          "missionId": "draft.dp11",
          "sectionId": "ex-comissao"
        }
      ],
      "dp11.q04": [
        {
          "missionId": "draft.dp11",
          "sectionId": "remuneracao"
        },
        {
          "missionId": "draft.dp11",
          "sectionId": "ex-comissao"
        }
      ],
      "dp11.q05": [
        {
          "missionId": "draft.dp11",
          "sectionId": "ex-comparacao"
        }
      ],
      "dp11.q06": [
        {
          "missionId": "draft.dp11",
          "sectionId": "rede"
        }
      ],
      "dp11.q07": [
        {
          "missionId": "draft.dp11",
          "sectionId": "plataforma"
        },
        {
          "missionId": "draft.dp11",
          "sectionId": "papeis"
        }
      ],
      "dp11.q08": [
        {
          "missionId": "draft.dp11",
          "sectionId": "ex-comparacao"
        },
        {
          "missionId": "draft.dp11",
          "sectionId": "resumo"
        }
      ]
    }
  }
};

export const EDITORIAL = {
  "stage": "Autoria concluída; revisão pedagógica independente pendente; fora do catálogo",
  "referenceOnlyProfiles": [
    {
      "id": "bb.agente-comercial.2022-001",
      "item": "Atualidades 10",
      "status": "histórico; referenceOnly"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Sem correspondência nominal; recorte específico BB no perfil histórico",
      "status": "histórico; referenceOnly"
    }
  ],
  "objectives": {
    "O1": "Reconhecer intermediação entre ofertantes e compradores em marketplace.",
    "O2": "Separar plataforma, vendedor e prestador do pagamento.",
    "O3": "Identificar remuneração explicitada no caso.",
    "O4": "Interpretar efeitos de rede e limites da comparação.",
    "O5": "Distinguir facilidade de acesso de garantia de oferta ou crédito.",
    "O6": "Recuperar a confusão pela seção de ensino e refazer o caso."
  },
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Nomear a confusão e reconstruir o caso após retomar o ensino."
  },
  "limits": [
    "Correspondência nominal apenas no perfil BB histórico; não equivale a item nominal do edital CAIXA.",
    "Casos econômicos simplificados; não definem responsabilidade jurídica de marketplace real.",
    "Casos e números autorais fictícios; não representam operação, oferta ou dado pessoal real.",
    "Sem XP/ordem/desbloqueio ou importação no runtime; não equivale a aceite humano da Fase 2."
  ]
};

export const ARITHMETIC = [
  {
    "label": "Comissão",
    "operation": "multiply",
    "values": [
      200,
      0.05
    ],
    "expected": 10
  },
  {
    "label": "Repasse antes de outros custos",
    "operation": "subtract",
    "values": [
      200,
      10
    ],
    "expected": 190
  },
  {
    "label": "Total da oferta A",
    "operation": "add",
    "values": [
      90,
      20
    ],
    "expected": 110
  }
];
