// Rascunho editorial isolado; não importar no runtime.
export const SOURCES = [
  {
    "id": "susep.capitalizacao",
    "label": "SUSEP — Apresentação da capitalização",
    "url": "https://www.gov.br/susep/pt-br/assuntos/meu-futuro-seguro/seguros-previdencia-e-capitalizacao/capitalizacao/explicacao",
    "locator": "Página modificada em 5/10/2022, consultada em 30/09/2026: participantes, cotas, provisão, prazos e condições gerais",
    "version": "Fonte oficial consultada em 30/09/2026; regras do recorte identificado",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "susep.capitalizacao.modalidades",
    "label": "SUSEP — Modalidades de capitalização",
    "url": "https://www.gov.br/susep/pt-br/assuntos/meu-futuro-seguro/seguros-previdencia-e-capitalizacao/capitalizacao/modalidades",
    "locator": "Página modificada em 10/12/2024, consultada em 30/09/2026: distinção tradicional/popular e direitos nas modalidades; sem reproduzir numeração duplicada da página",
    "version": "Fonte oficial consultada em 30/09/2026; regras do recorte identificado",
    "checkedAt": "2026-09-30"
  }
];

export const PC11B_DRAFT = {
  "id": "draft.pc11b",
  "topicId": "draft.pc11b",
  "editorialKey": "PC-11B",
  "candidateBlockId": "banking.products-credit",
  "title": "Capitalização: parte do pagamento, sorteio e resgate",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Separar pagamento total, saldo capitalizado e prêmio de sorteio, reconhecer participantes e comparar modalidades sem confundi-las com poupança.",
  "sourceIds": [
    "susep.capitalizacao",
    "susep.capitalizacao.modalidades"
  ],
  "sections": [
    {
      "id": "inicio",
      "type": "explanation",
      "heading": "1. Não basta ouvir a palavra “guardar”",
      "body": "Título de capitalização forma um capital com parte do pagamento, segundo suas condições, e pode incluir participação em sorteios. É produto de sociedade de capitalização autorizada. Não é a mesma conta de [poupança](pc-11a-v1.md#inicio): distribuição dos pagamentos, disponibilidade, prazo e direitos são próprios. O nome capitalização também não deve ser confundido com o conceito matemático geral de aplicar juros a um valor. Antes de comparar, identifique o produto concreto.",
      "sourceIds": [
        "susep.capitalizacao"
      ]
    },
    {
      "id": "partes",
      "type": "explanation",
      "heading": "2. Quem paga e quem tem os direitos",
      "body": "Subscritor é quem assume o pagamento na aquisição do título; titular é quem tem os direitos previstos, como resgate e participação em sorteios. Esses papéis podem coincidir, mas isso não deve ser presumido em toda modalidade. As condições gerais descrevem deveres, direitos, percentuais e prazos. Vender o produto em uma agência bancária não transforma automaticamente o banco na sociedade de capitalização responsável, nem muda a natureza do título.",
      "sourceIds": [
        "susep.capitalizacao"
      ]
    },
    {
      "id": "cotas",
      "type": "explanation",
      "heading": "3. O pagamento tem destinos diferentes",
      "body": "A cota de capitalização é a parcela que contribui para formar o saldo de resgate. A cota de sorteio custeia sorteios; não é um prêmio já ganho. A cota de carregamento cobre despesas e demais componentes previstos na estrutura do produto. Os percentuais constam das condições gerais. A provisão matemática de resgate é o saldo formado para resgate segundo essas regras; os juros e a atualização incidem sobre essa provisão, não automaticamente sobre todo dinheiro pago. Não presumimos percentuais iguais para todos os títulos ou meses.",
      "sourceIds": [
        "susep.capitalizacao"
      ]
    },
    {
      "id": "exemplo-cotas",
      "type": "worked-example",
      "heading": "4. Exemplo resolvido: dividir um pagamento hipotético",
      "body": "Em um título fictício, o pagamento considerado é de R$100: R$70 para capitalização, R$10 para sorteio e R$20 para carregamento. Passo 1: conferir 70 + 10 + 20 = R$100. Passo 2: identificar R$70 como parcela destinada à formação do capital naquele pagamento. Passo 3: não tratar R$100 inteiros como capital aplicado nem R$10 como prêmio recebido. Esses valores são uma decomposição didática dada, não padrão regulatório nem oferta real.",
      "sourceIds": []
    },
    {
      "id": "prazos",
      "type": "explanation",
      "heading": "5. Pagar, manter e resgatar são momentos distintos",
      "body": "Prazo de pagamento é o período de contribuições; vigência é o período em que o título está em vigor, acumulando conforme as condições e dando os direitos previstos. Os prazos podem diferir. Resgate é receber o valor a que se tem direito segundo o título, não necessariamente retirar a soma integral de pagamentos a qualquer instante. Antes de inferir o valor disponível, consulte condições e tabela de resgate; nesta aula não existe promessa geral de liquidez imediata ou de restituição integral em toda modalidade.",
      "sourceIds": [
        "susep.capitalizacao",
        "susep.capitalizacao.modalidades"
      ]
    },
    {
      "id": "exemplo-prazo",
      "type": "worked-example",
      "heading": "6. Exemplo resolvido: o fim dos pagamentos não basta",
      "body": "Hipótese: título com seis pagamentos previstos e vigência de doze meses. Concluir o sexto pagamento não significa, por si, que a vigência terminou ou que todo valor pode ser resgatado naquele dia. Primeiro separe as duas linhas do calendário. Depois confira as condições do direito de resgate. Não calculamos valor antecipado porque o caso não fornece sua tabela.",
      "sourceIds": []
    },
    {
      "id": "modalidades",
      "type": "explanation",
      "heading": "7. Tradicional e popular têm objetivos diferentes",
      "body": "Na modalidade tradicional, o objetivo é restituir ao final da vigência ao menos o total pago pelo subscritor, desde que todos os pagamentos previstos tenham sido feitos nas datas programadas. Isso não promete a mesma restituição a qualquer momento anterior nem ganho real acima da inflação. Na popular, a participação em sorteios é central e o valor devolvido ao final é inferior ao total pago. Por isso, afirmar que todo título devolve integralmente todos os pagamentos é errado. Outras modalidades têm destinação e direitos próprios: incentivo, filantropia premiável, instrumento de garantia e compra-programada. Não decoramos requisitos dessas modalidades sem ensino específico.",
      "sourceIds": [
        "susep.capitalizacao.modalidades"
      ]
    },
    {
      "id": "exemplo-modalidade",
      "type": "worked-example",
      "heading": "8. Exemplo resolvido: uma condição omitida muda a conclusão",
      "body": "Anúncio didático: “Você receberá ao final ao menos o total pago”. Antes de usar a frase como regra universal, identificamos que o caso se refere à modalidade tradicional e exige os pagamentos previstos nas datas. Não transportamos a conclusão para a popular nem para resgate antecipado. Se o texto não informa modalidade e condições, a resposta correta é identificar a informação faltante, não inventá-la.",
      "sourceIds": []
    },
    {
      "id": "sorteio",
      "type": "explanation",
      "heading": "9. Possibilidade de prêmio não é rentabilidade certa",
      "body": "Participar de um sorteio não significa ser contemplado. Um prêmio eventual é diferente do saldo capitalizado e não deve ser somado como se fosse recebimento garantido na comparação de produtos. Na modalidade incentivo, por exemplo, o consumidor participa dos sorteios, enquanto o resgate pertence ao subscritor, segundo a explicação da SUSEP. Esse caso torna visível por que pagar, participar e ter direito ao resgate não são sempre a mesma posição. Não inferimos probabilidade de ganhar sem regras e dados do sorteio.",
      "sourceIds": [
        "susep.capitalizacao",
        "susep.capitalizacao.modalidades"
      ]
    },
    {
      "id": "exemplo-direitos",
      "type": "worked-example",
      "heading": "10. Exemplo resolvido: promoção com modalidade declarada",
      "body": "Uma empresa subscritora oferece a consumidores participação em sorteios de título da modalidade incentivo. O caso informa que o resgate pertence à subscritora. Primeiro identificamos a modalidade; depois os direitos distintos. O consumidor participante não pode ser apresentado, só por isso, como titular de uma poupança no valor do resgate. Ganhar o sorteio também não foi dado como fato.",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "11. Vocabulário de recuperação",
      "body": "Cota: destino de parte de um pagamento. Carregamento: componente destinado aos custos e demais finalidades previstas do produto. Capitalização: formação do saldo segundo as condições. Resgate: recebimento desse saldo nos termos aplicáveis. Prêmio de sorteio: pagamento condicionado ao resultado do sorteio. Vigência: período de duração do título; pode diferir do prazo de pagamento.",
      "sourceIds": []
    },
    {
      "id": "resumo",
      "type": "summary",
      "heading": "12. Antes de comparar",
      "body": "Identifique sociedade responsável, modalidade, subscritor e titular. Separe as cotas do pagamento e os calendários. Leia o resgate e as condições sem adicionar um prêmio incerto como retorno garantido. Poupança, capitalização e sorteio não são categorias intercambiáveis.",
      "sourceIds": []
    }
  ],
  "recall": [
    "Refaça a decomposição de R$100 e diga o que cada parte representa.",
    "Compare tradicional e popular sem omitir condições e momento.",
    "Explique por que possível prêmio não é saldo próprio já disponível."
  ],
  "questions": [
    {
      "id": "pc11b.q01",
      "topicId": "draft.pc11b",
      "prompt": "No pagamento fictício de R$100, há R$70 para capitalização, R$10 para sorteio e R$20 para carregamento. Qual valor foi destinado à formação de capital nesse pagamento?",
      "options": [
        "R$100, sem distinção.",
        "R$10, pois é o prêmio ganho.",
        "R$70.",
        "R$20, porque todo custo é resgate."
      ],
      "answer": 2,
      "explanation": "O enunciado separa a cota de capitalização das outras destinações.",
      "optionRationales": [
        "Ignora as cotas.",
        "Sorteio não é prêmio garantido nem capital.",
        "Usa a parcela expressamente indicada.",
        "Carregamento não é capitalização."
      ],
      "recoverySectionIds": [
        "cotas",
        "exemplo-cotas"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "pc11b.q02",
      "topicId": "draft.pc11b",
      "prompt": "Qual leitura distingue subscritor e titular?",
      "options": [
        "Quem assume o pagamento e quem tem os direitos podem ocupar papéis diferentes, conforme o título.",
        "São sempre instituições reguladoras.",
        "Titular significa exclusivamente quem vende na agência.",
        "As condições gerais são irrelevantes para essa distinção."
      ],
      "answer": 0,
      "explanation": "Os termos identificam posições contratuais, que podem ou não coincidir.",
      "optionRationales": [
        "Preserva a distinção.",
        "Não são funções do regulador.",
        "Venda não define titularidade.",
        "O instrumento justamente descreve os direitos."
      ],
      "recoverySectionIds": [
        "partes"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "pc11b.q03",
      "topicId": "draft.pc11b",
      "prompt": "Seis pagamentos e doze meses de vigência foram informados. Após o sexto pagamento, o que cabe concluir?",
      "options": [
        "Toda a vigência terminou automaticamente.",
        "O resgate integral imediato é garantido.",
        "Os prazos são necessariamente ilegais por serem diferentes.",
        "Fim dos pagamentos e fim da vigência não são a mesma data; resgate depende das condições."
      ],
      "answer": 3,
      "explanation": "A informação disponível não estabelece resgate imediato.",
      "optionRationales": [
        "Confunde calendários.",
        "Cria direito não informado.",
        "A fonte admite prazos distintos.",
        "Mantém o limite dos dados."
      ],
      "recoverySectionIds": [
        "prazos",
        "exemplo-prazo"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "pc11b.q04",
      "topicId": "draft.pc11b",
      "prompt": "Na modalidade tradicional descrita, a restituição mínima do total pago ao final depende de:",
      "options": [
        "ganhar obrigatoriamente um sorteio.",
        "cumprir todos os pagamentos previstos nas datas programadas, segundo as condições.",
        "resgatar antes da vigência terminar em qualquer data.",
        "o produto virar conta de poupança."
      ],
      "answer": 1,
      "explanation": "A condição acompanha a definição dessa modalidade.",
      "optionRationales": [
        "Prêmio não é a condição ensinada.",
        "Inclui o requisito omitido em generalizações.",
        "Muda o momento da restituição.",
        "A natureza do produto não se altera."
      ],
      "recoverySectionIds": [
        "modalidades",
        "exemplo-modalidade"
      ],
      "objectiveIds": [
        "O4"
      ]
    },
    {
      "id": "pc11b.q05",
      "topicId": "draft.pc11b",
      "prompt": "Qual afirmação é compatível com a modalidade popular ensinada?",
      "options": [
        "A devolução final é inferior ao total pago; sorteios têm papel central.",
        "Todo pagamento retorna integralmente por regra universal.",
        "É idêntica à tradicional em todos os direitos.",
        "O prêmio de sorteio é garantido a cada participante."
      ],
      "answer": 0,
      "explanation": "A modalidade não tem a mesma restituição mínima da tradicional.",
      "optionRationales": [
        "Reconhece a característica relevante.",
        "Generaliza indevidamente.",
        "Apaga diferenças de finalidade e restituição.",
        "Participação não prova contemplação."
      ],
      "recoverySectionIds": [
        "modalidades",
        "sorteio"
      ],
      "objectiveIds": [
        "O4"
      ]
    },
    {
      "id": "pc11b.q06",
      "topicId": "draft.pc11b",
      "prompt": "Ao comparar um título, alguém adiciona ao saldo um prêmio que ainda não ganhou. Qual erro comete?",
      "options": [
        "Usa o valor certo de um prêmio já comprovado no caso.",
        "Separa adequadamente risco e resultado.",
        "Trata um evento incerto como recebimento garantido.",
        "Aplica a regra de aniversário da poupança."
      ],
      "answer": 2,
      "explanation": "Sorteio é possibilidade, não fluxo certo para todo participante.",
      "optionRationales": [
        "O caso diz que não ganhou.",
        "A soma elimina indevidamente a incerteza.",
        "Identifica o problema da comparação.",
        "O erro não é regra de poupança."
      ],
      "recoverySectionIds": [
        "sorteio"
      ],
      "objectiveIds": [
        "O5"
      ]
    },
    {
      "id": "pc11b.q07",
      "topicId": "draft.pc11b",
      "prompt": "Na promoção declarada como modalidade incentivo, o resgate pertence à subscritora e o consumidor participa dos sorteios. O consumidor:",
      "options": [
        "já ganhou todo o resgate automaticamente.",
        "não deve ser tratado como titular de poupança no valor do resgate só por participar.",
        "virou subscritor em qualquer hipótese.",
        "ganhará obrigatoriamente o próximo sorteio."
      ],
      "answer": 1,
      "explanation": "A modalidade permite distinguir os direitos do caso.",
      "optionRationales": [
        "Contraria a destinação informada.",
        "Evita confundir participação e resgate.",
        "O papel da empresa foi expressamente dado.",
        "Cria certeza inexistente."
      ],
      "recoverySectionIds": [
        "sorteio",
        "exemplo-direitos"
      ],
      "objectiveIds": [
        "O1",
        "O5"
      ]
    },
    {
      "id": "pc11b.q08",
      "topicId": "draft.pc11b",
      "prompt": "Para analisar título sem modalidade, tabela de resgate ou prazos informados, qual é o próximo passo?",
      "options": [
        "Prometer restituição integral em qualquer data.",
        "Usar automaticamente a regra da poupança.",
        "Supor que todos os títulos têm as mesmas cotas.",
        "Obter condições do produto antes de concluir disponibilidade e direitos."
      ],
      "answer": 3,
      "explanation": "As informações ausentes são necessárias à leitura do produto.",
      "optionRationales": [
        "Inventa direito.",
        "Mistura categorias.",
        "Ignora percentuais e modalidades próprios.",
        "Identifica a lacuna correta."
      ],
      "recoverySectionIds": [
        "prazos",
        "resumo"
      ],
      "objectiveIds": [
        "O3",
        "O5"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "pc11b-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "pc11b.q01": [
        {
          "missionId": "draft.pc11b",
          "sectionId": "cotas"
        },
        {
          "missionId": "draft.pc11b",
          "sectionId": "exemplo-cotas"
        }
      ],
      "pc11b.q02": [
        {
          "missionId": "draft.pc11b",
          "sectionId": "partes"
        }
      ],
      "pc11b.q03": [
        {
          "missionId": "draft.pc11b",
          "sectionId": "prazos"
        },
        {
          "missionId": "draft.pc11b",
          "sectionId": "exemplo-prazo"
        }
      ],
      "pc11b.q04": [
        {
          "missionId": "draft.pc11b",
          "sectionId": "modalidades"
        },
        {
          "missionId": "draft.pc11b",
          "sectionId": "exemplo-modalidade"
        }
      ],
      "pc11b.q05": [
        {
          "missionId": "draft.pc11b",
          "sectionId": "modalidades"
        },
        {
          "missionId": "draft.pc11b",
          "sectionId": "sorteio"
        }
      ],
      "pc11b.q06": [
        {
          "missionId": "draft.pc11b",
          "sectionId": "sorteio"
        }
      ],
      "pc11b.q07": [
        {
          "missionId": "draft.pc11b",
          "sectionId": "sorteio"
        },
        {
          "missionId": "draft.pc11b",
          "sectionId": "exemplo-direitos"
        }
      ],
      "pc11b.q08": [
        {
          "missionId": "draft.pc11b",
          "sectionId": "prazos"
        },
        {
          "missionId": "draft.pc11b",
          "sectionId": "resumo"
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
    "O1: distinguir produto e participantes",
    "O2: separar cotas e saldo",
    "O3: ler prazos e resgate",
    "O4: distinguir tradicional/popular",
    "O5: reconhecer sorteio e limites de comparação",
    "O6: retomar a condição omitida"
  ],
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Retomar os trechos indicados, explicar a confusão e reconstruir o caso antes de repetir; não gerar indicador de domínio."
  },
  "limits": [
    "Sem percentuais mínimos, carências ou probabilidade de sorteio universal. Outras modalidades são apresentadas como fronteiras, sem alegar domínio integral de sua regulamentação.",
    "Casos fictícios originais, sem recomendação para pessoa real. Fontes primárias consultadas em 30/09/2026; conferir alterações pertinentes antes de publicação futura.",
    "Prática exposta, fora de avaliações independentes. IDs locais, sem XP/ordem/gate produtivo ou importação no manifesto. Não demonstra cobertura integral do bloco ou edital histórico."
  ]
};

export const ARITHMETIC = [
  {
    "label": "Cotas de formação/sorteio",
    "operation": "add",
    "values": [
      70,
      10
    ],
    "expected": 80
  },
  {
    "label": "Total com carregamento",
    "operation": "add",
    "values": [
      80,
      20
    ],
    "expected": 100
  }
];
