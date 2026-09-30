// Rascunho editorial, sem importação pelo runtime. Valores didáticos são fictícios.
export const SOURCES = [
  {
    "id": "br.lc179",
    "label": "Lei Complementar 179/2021",
    "url": "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp179.htm",
    "version": "Texto consultado em 30/09/2026",
    "locator": "Artigos 1º e 2º: objetivos do BCB e metas de política monetária estabelecidas pelo CMN.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "bcb.selic",
    "label": "BCB — Taxa Selic",
    "url": "https://www.bcb.gov.br/controleinflacao/taxaselic",
    "version": "Página institucional consultada em 30/09/2026",
    "locator": "Definição da taxa efetiva nas compromissadas de um dia útil e atuação para alinhá-la à meta definida pelo Copom. Sem usar o valor atual.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "bcb.transmissao",
    "label": "BCB — Mecanismos de transmissão da política monetária",
    "url": "https://www.bcb.gov.br/controleinflacao/transmissaopoliticamonetaria",
    "version": "Página institucional consultada em 30/09/2026",
    "locator": "Canais de consumo/investimento, câmbio, ativos, crédito e expectativas; efeitos condicionais, sem estimar magnitude ou prazo.",
    "checkedAt": "2026-09-30"
  }
];
export const MP04_DRAFT = {
  "id": "draft.mp04",
  "topicId": "draft.mp04",
  "editorialKey": "MP-04",
  "candidateBlockId": "banking.markets-policy",
  "title": "Objetivos, instrumentos e transmissão monetária",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Distinguir o objetivo da política monetária, sua decisão operacional e possíveis efeitos, explicando uma cadeia causal sem transformá-la em certeza.",
  "sourceIds": [
    "br.lc179",
    "bcb.selic",
    "bcb.transmissao"
  ],
  "sections": [
    {
      "id": "retomada",
      "type": "explanation",
      "heading": "1. Antes da cadeia: três perguntas diferentes",
      "body": "Retome moeda/liquidez em [MP-02](mp-02-v1.md) e inflação/juros em [MP-03](mp-03-v1.md). Objetivo responde “aonde se quer chegar”; instrumento, “qual variável ou operação se usa”; resultado observado, “o que de fato aconteceu depois”. Querer conter pressões de preços, alterar uma taxa de referência e observar a inflação são três fatos diferentes. Sem essa separação, qualquer movimento de preços acaba sendo atribuído automaticamente à última decisão do banco central.",
      "sourceIds": []
    },
    {
      "id": "objetivos",
      "type": "explanation",
      "heading": "2. Objetivo legal e escolhas de política",
      "body": "No Brasil, a LC 179/2021 estabelece a estabilidade de preços como objetivo fundamental do BCB. Sem prejudicá-lo, inclui estabilidade e eficiência do sistema financeiro, suavização das flutuações da atividade econômica e fomento do pleno emprego. A mesma lei atribui ao CMN as metas de política monetária e ao BCB a condução necessária para cumpri-las. Objetivo legal não é a previsão de que todos os preços ficarão constantes. Não decoramos nesta unidade um número de meta ou uma taxa atual: isso exigiria identificar norma, vigência e período.",
      "sourceIds": [
        "br.lc179"
      ]
    },
    {
      "id": "selic",
      "type": "explanation",
      "heading": "3. Meta Selic e Selic efetiva",
      "body": "O Copom, comitê do BCB, define a meta da taxa Selic. A taxa efetiva é uma média observada nas operações compromissadas com títulos públicos federais de um dia útil. O BCB opera para alinhá-la à meta. A meta expressa uma decisão; a efetiva descreve operações realizadas. A Selic influencia as condições financeiras, mas não é a taxa de todos os contratos: prazo, risco, custos e condições contratuais também importam. MP-05 ensinará as duas pontas de uma compromissada antes de cobrar seus fluxos.",
      "sourceIds": [
        "bcb.selic"
      ]
    },
    {
      "id": "exemplo-rotulos",
      "type": "worked-example",
      "heading": "4. Exemplo resolvido: não trocar decisão por resultado",
      "body": "Notícia fictícia: “O comitê elevou a meta de juros para conter pressões inflacionárias; no mês seguinte um índice subiu menos”. Passo 1: conter pressões é a finalidade. Passo 2: elevar a meta é a decisão de instrumento. Passo 3: o índice subir menos é a observação posterior. Passo 4: ela não prova, sozinha, que toda a mudança resultou da decisão. Safra, câmbio e outros eventos podem ter variado; ainda há tempo de transmissão. A taxa fictícia não precisa ser informada para distinguir essas categorias.",
      "sourceIds": []
    },
    {
      "id": "transmissao",
      "type": "explanation",
      "heading": "5. Como uma decisão pode chegar ao gasto",
      "body": "Transmissão é o caminho entre a decisão e outras variáveis. Condições de crédito mais caras podem fazer uma família adiar uma compra financiada ou uma empresa rever um investimento. Gastos menores podem aliviar a pressão da demanda sobre preços. A decisão passa por contratos, expectativas e escolhas; pessoas com contratos já fixados não enfrentam necessariamente a mesma mudança imediata. Uma redução da taxa pode atuar no sentido contrário, mas não obriga ninguém a tomar crédito ou gastar.",
      "sourceIds": [
        "bcb.transmissao"
      ]
    },
    {
      "id": "exemplo-credito",
      "type": "worked-example",
      "heading": "6. Exemplo resolvido: custo do financiamento e investimento",
      "body": "Uma loja fictícia planeja comprar equipamento financiado. Após piorarem as condições do financiamento, o custo total esperado deixa de caber no projeto e ela adia a compra. A sequência é: condição financeira → decisão de investimento → menor demanda pelo equipamento naquele momento. Não foi preciso supor proibição de comprar nem queda instantânea de todo preço. Outra empresa, com caixa próprio e projeto diferente, poderia decidir de outro modo.",
      "sourceIds": []
    },
    {
      "id": "outros-canais",
      "type": "explanation",
      "heading": "7. Outros canais, sem previsão automática",
      "body": "O BCB também descreve canais de câmbio, preços de ativos e expectativas. Mudanças no câmbio alteram custos de importados; mudanças no valor dos ativos podem alterar riqueza e decisões; expectativas sobre inflação influenciam escolhas de preços e contratos. Esses canais interagem e dependem do contexto. Uma elevação de juros pode favorecer valorização da moeda, mas outros fluxos e riscos podem levar o câmbio na direção oposta. Credibilidade afeta a reação das expectativas. “Pode influenciar” não significa “determina sozinho”.",
      "sourceIds": [
        "bcb.transmissao"
      ]
    },
    {
      "id": "exemplo-cambio",
      "type": "worked-example",
      "heading": "8. Exemplo resolvido: sinal contrário não elimina o canal",
      "body": "No país fictício, os juros sobem, mas um choque externo aumenta a procura por moeda estrangeira e a moeda local se desvaloriza. É incorreto concluir que o câmbio deixou de importar para preços. Também é incorreto garantir valorização apenas pela decisão de juros. Há influências simultâneas; seria preciso separar os efeitos para atribuir a variação observada a uma causa. Importações mais caras podem pressionar custos mesmo com política monetária restritiva.",
      "sourceIds": []
    },
    {
      "id": "tempo",
      "type": "explanation",
      "heading": "9. Tempo, choque de oferta e limite da conclusão",
      "body": "Efeito com defasagem é aquele que aparece ao longo do tempo. Rever financiamento, produção ou preços leva tempo, e não existe nesta aula um prazo universal. Um choque de oferta, como perda de produção, pode encarecer bens mesmo sem aumento da demanda. Juros não reconstroem diretamente a produção perdida; podem atuar sobre demanda e propagação do choque. Para avaliar uma decisão é preciso considerar contexto e horizonte, não uma única observação posterior.",
      "sourceIds": [
        "bcb.transmissao"
      ]
    },
    {
      "id": "exemplo-choque",
      "type": "worked-example",
      "heading": "10. Exemplo resolvido: três inferências distintas",
      "body": "Caso fictício: uma colheita é perdida e o preço de um alimento sobe. O fato permite dizer que houve pressão específica de oferta. Não permite concluir a taxa geral de inflação só por esse item, nem que juros mais altos restaurariam a colheita. Se esse aumento influenciar outros preços e expectativas, existe uma questão de propagação a analisar. A política pode influenciar essa propagação sem desfazer fisicamente o choque inicial.",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "11. Vocabulário para acompanhar notícias",
      "body": "Objetivo: finalidade buscada. Instrumento: meio de atuação. Meta operacional: referência para a condução, como a meta Selic. Taxa efetiva: taxa apurada nas operações. Canal: caminho de influência. Demanda: decisões de compra de bens e serviços. Defasagem: intervalo da transmissão. Choque de oferta: alteração das condições de produção/disponibilidade. Expectativa: avaliação sobre o futuro, que pode não se realizar.",
      "sourceIds": []
    },
    {
      "id": "resumo",
      "type": "summary",
      "heading": "12. Explicar antes de prever",
      "body": "Identifique objetivo, decisão e observação. Nomeie ao menos uma etapa intermediária entre juros e preços. Acrescente a condição que pode mudar o resultado e evite “sempre”, “imediatamente” ou “todos os contratos”. Recuperar um erro exige reconstituir a cadeia, não só memorizar o nome do canal. A prática a seguir usa casos novos e fictícios.",
      "sourceIds": []
    }
  ],
  "questions": [
    {
      "prompt": "Um relato diz: “alterar a meta Selic para buscar estabilidade de preços”. Qual separação é correta?",
      "options": [
        "Estabilidade é instrumento; alteração da meta é resultado observado.",
        "Estabilidade é objetivo; alteração da meta é decisão sobre instrumento.",
        "Ambas são medidas já observadas da inflação.",
        "A decisão garante todos os preços constantes."
      ],
      "answer": 1,
      "explanation": "A finalidade e o meio de atuação não se confundem com a inflação que será medida.",
      "optionRationales": [
        "Inverte as categorias.",
        "Distingue a finalidade da decisão.",
        "Não foi apresentada medição de inflação.",
        "Transforma objetivo em garantia."
      ],
      "recoverySectionIds": [
        "objetivos",
        "exemplo-rotulos"
      ],
      "objectiveIds": [
        "O1"
      ],
      "id": "mp04.q01",
      "topicId": "draft.mp04"
    },
    {
      "prompt": "Qual afirmação distingue meta Selic e taxa efetiva?",
      "options": [
        "São duas metas definidas por cada agência bancária.",
        "A efetiva é necessariamente a taxa de todo empréstimo ao consumidor.",
        "A meta vem da decisão do Copom; a efetiva é apurada nas operações descritas.",
        "A efetiva é uma promessa de inflação futura."
      ],
      "answer": 2,
      "explanation": "A decisão orienta a atuação; a taxa apurada se refere ao mercado de operações de um dia útil indicado na aula.",
      "optionRationales": [
        "Atribui a decisão a agentes incorretos.",
        "Confunde referência monetária e contratos particulares.",
        "Mantém a distinção decisão/observação.",
        "Troca taxa de juros por promessa de preços."
      ],
      "recoverySectionIds": [
        "selic"
      ],
      "objectiveIds": [
        "O2"
      ],
      "id": "mp04.q02",
      "topicId": "draft.mp04"
    },
    {
      "prompt": "Uma empresa adia uma máquina porque o financiamento ficou mais caro. Qual encadeamento explica o caso?",
      "options": [
        "Condição de crédito → investimento → demanda.",
        "Meta Selic → obrigação de fechar a empresa.",
        "Inflação medida → proibição de investir.",
        "Liquidez → extinção de todos os contratos."
      ],
      "answer": 0,
      "explanation": "A reação da empresa liga a condição financeira à decisão real de gasto.",
      "optionRationales": [
        "Nomeia etapas apresentadas no caso.",
        "Adiar um projeto não é fechamento obrigatório.",
        "Não existe proibição no enunciado.",
        "Não houve extinção contratual."
      ],
      "recoverySectionIds": [
        "transmissao",
        "exemplo-credito"
      ],
      "objectiveIds": [
        "O3"
      ],
      "id": "mp04.q03",
      "topicId": "draft.mp04"
    },
    {
      "prompt": "Os juros sobem e, junto com um choque externo, a moeda local se desvaloriza. Qual conclusão respeita os limites?",
      "options": [
        "Juros nunca influenciam o câmbio.",
        "O dado prova que o banco central queria depreciar a moeda.",
        "A moeda deveria valorizar-se em qualquer contexto.",
        "Outras influências podem superar o efeito esperado de um canal."
      ],
      "answer": 3,
      "explanation": "O resultado reúne fatores simultâneos; uma observação não isola causalidade.",
      "optionRationales": [
        "Generaliza a partir de um caso.",
        "Atribui intenção sem informação.",
        "Trata tendência como certeza.",
        "Reconhece fatores concorrentes."
      ],
      "recoverySectionIds": [
        "outros-canais",
        "exemplo-cambio"
      ],
      "objectiveIds": [
        "O4"
      ],
      "id": "mp04.q04",
      "topicId": "draft.mp04"
    },
    {
      "prompt": "Uma alta de juros ocorreu ontem. Hoje um alimento encareceu por perda de safra. O que é correto?",
      "options": [
        "A decisão fracassou necessariamente em todo objetivo.",
        "Ela não recompõe a safra e seus efeitos precisam ser avaliados com tempo e contexto.",
        "A inflação de toda a economia é igual à desse alimento.",
        "A política só funciona se todos os preços caírem no dia seguinte."
      ],
      "answer": 1,
      "explanation": "Choque específico e efeitos defasados impedem a conclusão automática.",
      "optionRationales": [
        "Um dia e um item não bastam.",
        "Distingue limite físico e horizonte de transmissão.",
        "Confunde item e conjunto.",
        "Cria critério que a aula não sustenta."
      ],
      "recoverySectionIds": [
        "tempo",
        "exemplo-choque"
      ],
      "objectiveIds": [
        "O5"
      ],
      "id": "mp04.q05",
      "topicId": "draft.mp04"
    },
    {
      "prompt": "Qual reescrita de “cortar juros fará todas as famílias gastar imediatamente” é mais adequada?",
      "options": [
        "Cortar juros impede qualquer aumento de gasto.",
        "A reação é idêntica para todas as famílias.",
        "Condições financeiras podem estimular gasto, dependendo de contratos, expectativas e escolhas.",
        "Toda família é obrigada a contratar crédito novo."
      ],
      "answer": 2,
      "explanation": "O canal passa por decisões e circunstâncias, sem impor reação universal.",
      "optionRationales": [
        "Troca uma certeza indevida por outra.",
        "Ignora diferenças de situação.",
        "Explicita mecanismo e condições.",
        "Não existe obrigação descrita."
      ],
      "recoverySectionIds": [
        "transmissao",
        "tempo",
        "resumo"
      ],
      "objectiveIds": [
        "O3",
        "O5"
      ],
      "id": "mp04.q06",
      "topicId": "draft.mp04"
    }
  ],
  "recall": [
    "Sem consultar, separe objetivo, instrumento e resultado numa notícia fictícia.",
    "Reconstrua dois canais e uma condição que pode mudar seu efeito.",
    "Após errar, retome a seção indicada e substitua a certeza indevida por uma explicação condicionada."
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "mp04-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "mp04.q01": [
        {
          "missionId": "draft.mp04",
          "sectionId": "objetivos"
        },
        {
          "missionId": "draft.mp04",
          "sectionId": "exemplo-rotulos"
        }
      ],
      "mp04.q02": [
        {
          "missionId": "draft.mp04",
          "sectionId": "selic"
        }
      ],
      "mp04.q03": [
        {
          "missionId": "draft.mp04",
          "sectionId": "transmissao"
        },
        {
          "missionId": "draft.mp04",
          "sectionId": "exemplo-credito"
        }
      ],
      "mp04.q04": [
        {
          "missionId": "draft.mp04",
          "sectionId": "outros-canais"
        },
        {
          "missionId": "draft.mp04",
          "sectionId": "exemplo-cambio"
        }
      ],
      "mp04.q05": [
        {
          "missionId": "draft.mp04",
          "sectionId": "tempo"
        },
        {
          "missionId": "draft.mp04",
          "sectionId": "exemplo-choque"
        }
      ],
      "mp04.q06": [
        {
          "missionId": "draft.mp04",
          "sectionId": "transmissao"
        },
        {
          "missionId": "draft.mp04",
          "sectionId": "tempo"
        },
        {
          "missionId": "draft.mp04",
          "sectionId": "resumo"
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
    "Pré-requisitos MP-02/03 e noções CMN/BCB/Copom do SFN; drafts precisam estar acessíveis juntos antes de futura integração.",
    "Sem taxa atual, número de meta, prazo fixo de transmissão ou estimativa causal.",
    "Rascunho fora do catálogo; não é nova forma independente A/B, aceite de fase ou recomendação financeira."
  ]
};
export const ARITHMETIC = [];
