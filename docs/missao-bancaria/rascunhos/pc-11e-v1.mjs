// Rascunho editorial isolado; não importar no runtime.
export const SOURCES = [
  {
    "id": "lei.consorcio",
    "label": "Lei 11.795/2008 — sistema de consórcio",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2008/lei/l11795.htm",
    "locator": "Arts. 2º–5º, 10–11, 22–23: grupo, administração, contrato, contemplação por sorteio/lance e recursos do grupo",
    "version": "Fonte oficial consultada em 30/09/2026; regras do recorte identificado",
    "checkedAt": "2026-09-30"
  }
];

export const PC11E_DRAFT = {
  "id": "draft.pc11e",
  "topicId": "draft.pc11e",
  "editorialKey": "PC-11E",
  "candidateBlockId": "banking.products-credit",
  "title": "Consórcio: grupo, contemplação e custos",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Distinguir autofinanciamento de crédito imediatamente liberado, identificar grupo/administradora e ler contemplação, custos e obrigações sem prometer data.",
  "sourceIds": [
    "lei.consorcio"
  ],
  "sections": [
    {
      "id": "inicio",
      "type": "explanation",
      "heading": "1. Aquisição organizada por um grupo",
      "body": "Consórcio reúne pessoas em grupo, com prazo e número de cotas definidos, para aquisição de bens ou serviços por autofinanciamento. As contribuições do grupo sustentam o mecanismo coletivo segundo o contrato. Não é automaticamente um empréstimo em que um banco entrega todo o valor no início e depois cobra parcelas. Para entender a diferença, separe aderir ao grupo, contribuir e ser contemplado; esses eventos não acontecem necessariamente ao mesmo tempo.",
      "sourceIds": [
        "lei.consorcio"
      ]
    },
    {
      "id": "partes",
      "type": "explanation",
      "heading": "2. Grupo, administradora, consorciado e cota",
      "body": "Consorciado é o participante que assume as obrigações da sua cota. Cota identifica sua participação contratual no grupo. Administradora organiza e administra o sistema conforme a lei; não se confunde com cada grupo. O patrimônio de um grupo é separado do de outros grupos e do da administradora nos termos legais. Por isso, a existência de recursos em outro grupo não autoriza supor disponibilidade automática para o seu. O contrato de participação por adesão especifica direitos e deveres.",
      "sourceIds": [
        "lei.consorcio"
      ]
    },
    {
      "id": "exemplo-partes",
      "type": "worked-example",
      "heading": "3. Exemplo resolvido: duas cotas, dois grupos",
      "body": "Administradora A administra os grupos G1 e G2. Joana participa de G1. Um anúncio diz que G2 possui recursos disponíveis. Passo 1: identificar grupo de Joana. Passo 2: reconhecer patrimônios separados. Passo 3: não concluir que o dinheiro de G2 será usado automaticamente para contemplar Joana em G1. A mesma administradora não transforma os grupos em uma única conta livre.",
      "sourceIds": []
    },
    {
      "id": "contemplacao",
      "type": "explanation",
      "heading": "4. Contemplação não é simples inscrição",
      "body": "Contemplação atribui o crédito ao consorciado nos termos legais e contratuais, para a finalidade prevista. Ocorre por sorteio ou lance, conforme o contrato, e depende de recursos suficientes no grupo para a finalidade. Lance é uma oferta feita segundo as regras do grupo; não é promessa universal de vitória nem substitui todos os requisitos. Participar de um sorteio não garante resultado. O prazo do grupo não autoriza um vendedor a assegurar contemplação imediata a toda nova cota.",
      "sourceIds": [
        "lei.consorcio"
      ]
    },
    {
      "id": "exemplo-data",
      "type": "worked-example",
      "heading": "5. Exemplo resolvido: necessidade com data certa",
      "body": "Um personagem fictício precisa de um equipamento na próxima semana, mas apenas aderiu ao grupo e ainda não foi contemplado. Passo 1: reconhecer a data de necessidade. Passo 2: constatar que não há contemplação informada. Passo 3: não tratar a cota como recurso integral já disponível para essa semana. Isso explica a diferença de funcionamento, sem recomendar outro produto ou prometer aprovação de financiamento.",
      "sourceIds": []
    },
    {
      "id": "lance",
      "type": "explanation",
      "heading": "6. Lance deve ser lido no contrato",
      "body": "O caso pode apresentar um lance e suas regras, mas não devemos inventar empate, percentual mínimo, lance embutido ou critério de vencedor. A lei remete ao contrato para sorteio/lance. Mesmo um valor alto não permite, sem essas informações, afirmar contemplação certa. É preciso distinguir oferta de lance, resultado e efetiva atribuição do crédito. Depois da contemplação, continuam aplicáveis as condições de uso e obrigações; ela não equivale a perdão geral das parcelas.",
      "sourceIds": [
        "lei.consorcio"
      ]
    },
    {
      "id": "exemplo-lance",
      "type": "worked-example",
      "heading": "7. Exemplo resolvido: percentual é só uma parte do caso",
      "body": "Crédito de referência fictício: R$40.000. Lance ofertado: R$8.000. A proporção é 8.000 ÷ 40.000 = 0,20, ou 20%. O cálculo não diz se o lance vence: faltam regras, outros lances e resultado, além das condições do grupo. Não chamamos o percentual de juros do contrato. Também não supomos que os R$8.000 já foram pagos ou que são dinheiro da administradora.",
      "sourceIds": []
    },
    {
      "id": "custos",
      "type": "explanation",
      "heading": "8. Autofinanciamento não significa custo zero",
      "body": "A administradora tem direito à taxa de administração e aos demais valores admitidos e previstos no contrato. A contribuição pode envolver parcelas destinadas ao fundo comum e outros componentes aplicáveis, que precisam ser discriminados. Fundo comum é o conjunto de recursos voltado às finalidades do grupo. Não tratar taxa de administração como juros de empréstimo nem concluir “sem juros de financiamento, logo gratuito”. Valores de referência e prestações podem seguir critérios contratuais; não prometer parcelas fixas por toda a vigência sem conferir.",
      "sourceIds": [
        "lei.consorcio"
      ]
    },
    {
      "id": "exemplo-custo",
      "type": "worked-example",
      "heading": "9. Exemplo resolvido: ler componentes dados",
      "body": "Uma parcela fictícia foi explicitamente decomposta em R$400 para fundo comum e R$50 de taxa de administração, sem outros componentes apenas nesse pagamento. O total é R$450. Os R$50 não desaparecem da soma porque o produto é autofinanciamento. O exemplo não estabelece percentual legal de taxa, nem garante que todas as prestações futuras serão iguais.",
      "sourceIds": []
    },
    {
      "id": "obrigacoes",
      "type": "explanation",
      "heading": "10. Crédito atribuído não encerra a leitura",
      "body": "A contemplação deve ser acompanhada da leitura das condições de utilização do crédito, garantias quando cabíveis e pagamentos remanescentes. O consorciado assume obrigações contratuais; não existe liberação irrestrita de dinheiro para qualquer finalidade por simplesmente participar. Desistência, exclusão, transferência de cota e restituição seguem regras específicas que não estão esgotadas nesta aula. Não converter “quero sair” em promessa de devolução integral imediata sem enquadramento.",
      "sourceIds": [
        "lei.consorcio"
      ]
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "11. Vocabulário de recuperação",
      "body": "Grupo: conjunto organizado para a finalidade coletiva. Administradora: pessoa jurídica que organiza/administra os grupos. Cota: participação identificada. Contemplação: atribuição do crédito na disciplina aplicável. Lance: oferta sujeita às regras de contemplação. Fundo comum: recursos do grupo para suas finalidades. Taxa de administração: remuneração da administradora, distinta de dinheiro destinado ao fundo comum.",
      "sourceIds": []
    },
    {
      "id": "resumo",
      "type": "summary",
      "heading": "12. Antes de comparar com financiamento",
      "body": "Localize grupo, cota e contrato. Separe inscrição, contribuição, lance e contemplação. Leia custo total e condições sem prometer gratuidade, data ou parcelas fixas. Compare o momento de disponibilidade com a necessidade descrita, sem trocar a mecânica do consórcio por empréstimo imediatamente liberado.",
      "sourceIds": []
    }
  ],
  "recall": [
    "Reconstrua inscrição, contribuição, lance e contemplação como eventos distintos.",
    "Mostre por que uma parcela menor ou a expressão sem juros não demonstra custo zero.",
    "Explique o que falta para conhecer data, resultado do lance e condições de uso do crédito."
  ],
  "questions": [
    {
      "id": "pc11e.q01",
      "topicId": "draft.pc11e",
      "prompt": "Qual característica define o recorte de consórcio ensinado?",
      "options": [
        "Banco entrega necessariamente todo crédito na adesão.",
        "Cada grupo usa livremente o patrimônio de todos os outros.",
        "Autofinanciamento organizado de um grupo para adquirir bens ou serviços.",
        "Participante nunca assume obrigação de contribuir."
      ],
      "answer": 2,
      "explanation": "O mecanismo é coletivo e contratual, com etapas próprias.",
      "optionRationales": [
        "Confunde com liberação imediata de empréstimo.",
        "Ignora separação patrimonial.",
        "Identifica a estrutura.",
        "Apaga as obrigações do participante."
      ],
      "recoverySectionIds": [
        "inicio",
        "partes"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "pc11e.q02",
      "topicId": "draft.pc11e",
      "prompt": "Joana está no G1, mas há recursos anunciados no G2 da mesma administradora. O que cabe afirmar?",
      "options": [
        "Patrimônios dos grupos são separados; isso não prova recursos disponíveis no G1.",
        "G2 deve automaticamente pagar a contemplação de Joana.",
        "Administradora e grupos são sempre uma conta única.",
        "O anúncio prova que Joana venceu sorteio."
      ],
      "answer": 0,
      "explanation": "A identidade da administradora não extingue a separação entre grupos.",
      "optionRationales": [
        "Conserva a distinção.",
        "Inventa transferência automática.",
        "Contraria o regime ensinado.",
        "Não houve resultado informado."
      ],
      "recoverySectionIds": [
        "partes",
        "exemplo-partes"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "pc11e.q03",
      "topicId": "draft.pc11e",
      "prompt": "Alguém aderiu ao consórcio ontem e precisa do bem em uma semana, sem contemplação informada. Pode tratar o crédito como integralmente disponível nessa data?",
      "options": [
        "Sim, toda adesão é contemplação.",
        "Sim, se a publicidade disser apenas “planejamento”.",
        "Sim, porque a cota elimina o calendário.",
        "Não; adesão e contemplação são eventos distintos, sem data garantida no caso."
      ],
      "answer": 3,
      "explanation": "A necessidade do personagem não muda o estágio da cota.",
      "optionRationales": [
        "Confunde etapas.",
        "Slogan não garante o evento.",
        "A mecânica depende de tempo e regras.",
        "Reconhece o limite dos dados."
      ],
      "recoverySectionIds": [
        "contemplacao",
        "exemplo-data"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "pc11e.q04",
      "topicId": "draft.pc11e",
      "prompt": "Lance R$8.000 sobre referência R$40.000. O que o cálculo permite afirmar?",
      "options": [
        "É taxa de juros mensal de 20%.",
        "O lance equivale a 20% da referência, sem provar vitória.",
        "O lance garante contemplação porque excede R$1.",
        "O valor já foi pago necessariamente."
      ],
      "answer": 1,
      "explanation": "A proporção não fornece resultado nem condição de pagamento.",
      "optionRationales": [
        "Troca proporção de lance por juros.",
        "Calcula e mantém os limites.",
        "Cria critério que não foi dado.",
        "Oferta não comprova pagamento."
      ],
      "recoverySectionIds": [
        "lance",
        "exemplo-lance"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "pc11e.q05",
      "topicId": "draft.pc11e",
      "prompt": "Parcela dada: R$400 fundo comum e R$50 taxa de administração, sem outros componentes nesse pagamento. Qual leitura é correta?",
      "options": [
        "Total R$450; autofinanciamento não elimina a remuneração administrativa.",
        "Total R$400, porque consórcio nunca tem custo.",
        "Total R$50, porque fundo comum não é pago.",
        "Todo valor é juros de empréstimo bancário."
      ],
      "answer": 0,
      "explanation": "Somar os componentes evita a falsa gratuidade.",
      "optionRationales": [
        "Usa todos os valores uma vez.",
        "Exclui encargo expressamente informado.",
        "Apaga a parcela para o grupo.",
        "Confunde estrutura de consórcio e empréstimo."
      ],
      "recoverySectionIds": [
        "custos",
        "exemplo-custo"
      ],
      "objectiveIds": [
        "O4"
      ]
    },
    {
      "id": "pc11e.q06",
      "topicId": "draft.pc11e",
      "prompt": "A contemplação ocorre conforme contrato e recursos suficientes do grupo, por:",
      "options": [
        "qualquer promessa verbal de vendedor, independentemente do contrato.",
        "sorteio ou lance, sem garantia universal de data a toda nova cota.",
        "entrada na agência, sempre imediatamente.",
        "apenas decisão livre de outro participante, sem regra."
      ],
      "answer": 1,
      "explanation": "A lei e o contrato disciplinam os mecanismos.",
      "optionRationales": [
        "Promessa não substitui requisitos.",
        "Identifica mecanismos e limite.",
        "Comparecimento não é contemplação.",
        "Não corresponde ao sistema ensinado."
      ],
      "recoverySectionIds": [
        "contemplacao"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "pc11e.q07",
      "topicId": "draft.pc11e",
      "prompt": "Após ser contemplado, o participante pode concluir automaticamente que não deve mais parcelas e pode usar qualquer valor sem condições?",
      "options": [
        "Sim, contemplação é perdão geral de dívida.",
        "Sim, todo consórcio é doação.",
        "Sim, o contrato deixa de existir.",
        "Não; utilização do crédito e obrigações remanescentes seguem condições aplicáveis."
      ],
      "answer": 3,
      "explanation": "Contemplação não encerra todas as obrigações por si só.",
      "optionRationales": [
        "Cria quitação indevida.",
        "Não é doação.",
        "O evento ocorre dentro do contrato.",
        "Mantém a leitura da relação contratual."
      ],
      "recoverySectionIds": [
        "lance",
        "obrigacoes"
      ],
      "objectiveIds": [
        "O5"
      ]
    },
    {
      "id": "pc11e.q08",
      "topicId": "draft.pc11e",
      "prompt": "Uma pessoa deseja desistir. Qual resposta permanece dentro do ensino desta aula?",
      "options": [
        "Prometer restituição integral hoje em qualquer situação.",
        "Dizer que nunca existe qualquer restituição.",
        "Verificar regras específicas e enquadramento, sem promessa universal de prazo/valor.",
        "Usar automaticamente as regras de resgate da poupança."
      ],
      "answer": 2,
      "explanation": "O tema tem disciplina própria não esgotada no recorte.",
      "optionRationales": [
        "Inventa prazo e valor universais.",
        "Generaliza em sentido oposto.",
        "Identifica a necessidade de regra própria.",
        "Mistura produtos diferentes."
      ],
      "recoverySectionIds": [
        "obrigacoes"
      ],
      "objectiveIds": [
        "O5"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "pc11e-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "pc11e.q01": [
        {
          "missionId": "draft.pc11e",
          "sectionId": "inicio"
        },
        {
          "missionId": "draft.pc11e",
          "sectionId": "partes"
        }
      ],
      "pc11e.q02": [
        {
          "missionId": "draft.pc11e",
          "sectionId": "partes"
        },
        {
          "missionId": "draft.pc11e",
          "sectionId": "exemplo-partes"
        }
      ],
      "pc11e.q03": [
        {
          "missionId": "draft.pc11e",
          "sectionId": "contemplacao"
        },
        {
          "missionId": "draft.pc11e",
          "sectionId": "exemplo-data"
        }
      ],
      "pc11e.q04": [
        {
          "missionId": "draft.pc11e",
          "sectionId": "lance"
        },
        {
          "missionId": "draft.pc11e",
          "sectionId": "exemplo-lance"
        }
      ],
      "pc11e.q05": [
        {
          "missionId": "draft.pc11e",
          "sectionId": "custos"
        },
        {
          "missionId": "draft.pc11e",
          "sectionId": "exemplo-custo"
        }
      ],
      "pc11e.q06": [
        {
          "missionId": "draft.pc11e",
          "sectionId": "contemplacao"
        }
      ],
      "pc11e.q07": [
        {
          "missionId": "draft.pc11e",
          "sectionId": "lance"
        },
        {
          "missionId": "draft.pc11e",
          "sectionId": "obrigacoes"
        }
      ],
      "pc11e.q08": [
        {
          "missionId": "draft.pc11e",
          "sectionId": "obrigacoes"
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
    "O1: reconhecer autofinanciamento",
    "O2: separar participantes e patrimônios",
    "O3: interpretar contemplação/lance",
    "O4: ler custos do caso",
    "O5: reconhecer obrigações e limites",
    "O6: recuperar a etapa e a condição omitidas"
  ],
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Retomar os trechos indicados, explicar a confusão e reconstruir o caso antes de repetir; não gerar indicador de domínio."
  },
  "limits": [
    "Sem regras detalhadas de assembleia, modalidades de lance, restituição, desistência, reajuste, garantias ou tributação. Não promete data de contemplação nem recomenda contratação.",
    "Casos fictícios originais, sem recomendação para pessoa real. Fontes primárias consultadas em 30/09/2026; conferir alterações pertinentes antes de publicação futura.",
    "Prática exposta, fora de avaliações independentes. IDs locais, sem XP/ordem/gate produtivo ou importação no manifesto. Não demonstra cobertura integral do bloco ou edital histórico."
  ]
};

export const ARITHMETIC = [
  {
    "label": "Proporção de lance",
    "operation": "divide",
    "values": [
      8000,
      40000
    ],
    "expected": 0.2
  },
  {
    "label": "Proporção em percentual",
    "operation": "multiply",
    "values": [
      0.2,
      100
    ],
    "expected": 20
  },
  {
    "label": "Parcela do exemplo",
    "operation": "add",
    "values": [
      400,
      50
    ],
    "expected": 450
  }
];
