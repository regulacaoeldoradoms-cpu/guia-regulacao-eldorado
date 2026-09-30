// Rascunho editorial isolado; não importar no runtime.
export const SOURCES = [
  {
    "id": "bcb.rural",
    "label": "BCB — Crédito rural",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/creditorural",
    "locator": "Finalidades, fontes de recursos e requisitos gerais; não utilizar taxas ou calendários de programas",
    "version": "Fonte oficial consultada em 30/09/2026; regras do recorte identificado",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "bcb.rural.sistema",
    "label": "BCB — O que é crédito rural",
    "url": "https://www.bcb.gov.br/meubc/faqs/p/o-que-e-o-credito-rural",
    "locator": "FAQ atualizada em 23/08/2023: SNCR, CMN, BCB e Manual de Crédito Rural",
    "version": "Fonte oficial consultada em 30/09/2026; regras do recorte identificado",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "bcb.rural.beneficiarios",
    "label": "BCB — Quem pode obter crédito rural",
    "url": "https://www.bcb.gov.br/meubc/faqs/p/quem-pode-obter-credito-rural",
    "locator": "FAQ atualizada em 23/08/2023: categorias de beneficiários; condições específicas remetidas ao MCR",
    "version": "Fonte oficial consultada em 30/09/2026; regras do recorte identificado",
    "checkedAt": "2026-09-30"
  }
];

export const PC06_DRAFT = {
  "id": "draft.pc06",
  "topicId": "draft.pc06",
  "editorialKey": "PC-06",
  "candidateBlockId": "banking.products-credit",
  "title": "Crédito rural: finalidade antes do nome do programa",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Reconhecer custeio, investimento, comercialização e industrialização em casos simples, identificar os participantes e separar enquadramento, aprovação e condições variáveis.",
  "sourceIds": [
    "bcb.rural",
    "bcb.rural.sistema",
    "bcb.rural.beneficiarios"
  ],
  "sections": [
    {
      "id": "inicio",
      "type": "explanation",
      "heading": "1. Uma operação dirigida à atividade rural",
      "body": "Retome [PC-02](pc-02-v1.md#vocabulario): crédito cria uma obrigação de devolver recursos nas condições combinadas. Crédito rural é concedido por instituições integrantes do Sistema Nacional de Crédito Rural (SNCR) para finalidades e condições próprias. A palavra rural não transforma todo empréstimo feito por alguém que mora no campo em uma operação enquadrada nesse sistema. Precisamos saber quem toma os recursos, em que serão usados e qual regra se aplica. Não é doação nem aprovação automática.",
      "sourceIds": [
        "bcb.rural.sistema"
      ]
    },
    {
      "id": "participantes",
      "type": "explanation",
      "heading": "2. Quem faz o quê",
      "body": "O tomador utiliza os recursos e assume a obrigação; a instituição financeira analisa, contrata e acompanha a operação. Entre as categorias de beneficiários estão produtores rurais, pessoas físicas ou jurídicas, e cooperativas de produtores. A regulamentação contempla também categorias específicas, como determinados beneficiadores e agroindústrias; seus requisitos não podem ser deduzidos apenas do nome da empresa. Ser de uma categoria admitida é um ponto de partida para verificar condições, não um direito automático ao financiamento. O CMN estabelece normas; o BCB coordena o sistema e fiscaliza seu cumprimento. O Manual de Crédito Rural (MCR) reúne a disciplina a consultar.",
      "sourceIds": [
        "bcb.rural.sistema",
        "bcb.rural.beneficiarios"
      ]
    },
    {
      "id": "custeio",
      "type": "explanation",
      "heading": "3. Custeio: despesas do ciclo de produção",
      "body": "Um ciclo produtivo vai da preparação à obtenção da produção. Custeio atende despesas normais desse ciclo, como insumos e despesas da lavoura até a colheita. A pergunta é: o recurso sustenta a produção deste ciclo? Não classifique somente pelo tamanho do valor ou pelo prazo anunciado. Uma compra cara pode continuar sendo insumo de um ciclo. A operação real depende do enquadramento e das condições admitidas.",
      "sourceIds": [
        "bcb.rural"
      ]
    },
    {
      "id": "exemplo-custeio",
      "type": "worked-example",
      "heading": "4. Exemplo resolvido: preparar uma safra",
      "body": "No caso fictício, uma produtora precisa de R$6.000 em sementes e R$4.000 em outros insumos para o ciclo atual. Passo 1: identificar o uso — despesas da produção em curso. Passo 2: somar 6.000 + 4.000 = R$10.000. Passo 3: classificar a finalidade didática como custeio. O total não informa taxa, montante financiável nem aprovação. Os valores não são orçamento técnico de uma lavoura real.",
      "sourceIds": []
    },
    {
      "id": "investimento",
      "type": "explanation",
      "heading": "5. Investimento: benefício por vários períodos",
      "body": "Investimento rural atende bens ou serviços cujos benefícios alcançam mais de um período de produção. Um trator utilizado em diversas safras é o exemplo usual. Aqui investimento é uma finalidade do crédito rural; não significa comprar ações ou fazer uma aplicação financeira. Um plano pode reunir necessidades de finalidades distintas: é preciso separar os usos, não rotular tudo pelo item mais caro.",
      "sourceIds": [
        "bcb.rural"
      ]
    },
    {
      "id": "exemplo-investimento",
      "type": "worked-example",
      "heading": "6. Exemplo resolvido: máquina e insumos separados",
      "body": "Uma produtora descreve R$80.000 para um trator durável e R$10.000 para os insumos do ciclo atual. Primeiro separamos os usos: o trator beneficia várias safras; os insumos são consumidos na produção deste ciclo. A classificação introdutória é investimento para o primeiro e custeio para o segundo. Somam R$90.000 de necessidades descritas, sem afirmar que haverá contrato único ou financiamento integral.",
      "sourceIds": []
    },
    {
      "id": "comercializacao",
      "type": "explanation",
      "heading": "7. Comercialização: viabilizar a venda da produção",
      "body": "Comercialização se relaciona aos recursos necessários à colocação da produção de produtores ou cooperativas no mercado. O foco é o escoamento ou a negociação do produto obtido, e não a compra de sementes para produzi-lo. A data, sozinha, não resolve a classificação: precisamos da finalidade expressa e do instrumento previsto na regulamentação. Não há promessa de preço mínimo ou compra pública só porque a palavra comercialização foi usada.",
      "sourceIds": [
        "bcb.rural"
      ]
    },
    {
      "id": "exemplo-comercializacao",
      "type": "worked-example",
      "heading": "8. Exemplo resolvido: separar produzir e vender",
      "body": "O enunciado informa uma operação rural destinada a viabilizar a comercialização da produção já colhida de uma cooperativa, nos termos admitidos. Passo 1: reconhecer que a produção já existe. Passo 2: localizar a finalidade expressa de colocá-la no mercado. A categoria pedida é comercialização. Se o caso apenas dissesse “precisa de dinheiro em agosto”, não teríamos finalidade suficiente para essa conclusão.",
      "sourceIds": []
    },
    {
      "id": "industrializacao",
      "type": "explanation",
      "heading": "9. Industrialização: transformar a produção",
      "body": "Industrialização financia o processamento de produtos agropecuários nas situações previstas, como o realizado por cooperativas ou por produtor em sua propriedade rural. Transformar a matéria-prima é diferente de apenas vendê-la. A definição não autoriza presumir que qualquer fábrica urbana ou compra de equipamento se enquadre nessa finalidade rural. Beneficiário, atividade e operação precisam corresponder à disciplina aplicável.",
      "sourceIds": [
        "bcb.rural",
        "bcb.rural.beneficiarios"
      ]
    },
    {
      "id": "exemplo-industrializacao",
      "type": "worked-example",
      "heading": "10. Exemplo resolvido: processamento pela cooperativa",
      "body": "Uma cooperativa descreve operação admitida para processar a produção agrícola de seus cooperados. O recurso é para esse processamento, não para adquirir uma máquina durável no exemplo. A finalidade informada é industrialização. Se outro caso destinasse recursos a uma máquina usada por várias safras, seria necessário analisar o investimento descrito; a presença de processamento na atividade da entidade não rotula todos os seus contratos.",
      "sourceIds": []
    },
    {
      "id": "condicoes",
      "type": "explanation",
      "heading": "11. Finalidade não substitui análise e condições",
      "body": "A instituição examina elementos como orçamento ou projeto quando exigido, uso dos recursos e calendário de utilização e reembolso, além dos requisitos aplicáveis. Há recursos de origens diversas; não se pode deduzir que todo crédito rural usa dinheiro público, taxa igual ou subsídio. Programas, encargos, limites e calendários podem mudar. Esta aula não fornece taxas vigentes nem recomenda uma linha. Em [PC-04](pc-04-v1.md#limites), vimos que a Resolução CMN 4.881 exclui o crédito rural do seu âmbito: deve-se conferir a disciplina específica, sem concluir que o tomador perde o direito à informação.",
      "sourceIds": [
        "bcb.rural"
      ]
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "12. Vocabulário de recuperação",
      "body": "Safra/ciclo: período de produção considerado no caso. Insumo: recurso utilizado na produção, como sementes. Custeio: despesas normais do ciclo. Investimento rural: benefício em vários períodos. Comercialização: recursos para colocar a produção no mercado. Industrialização: processamento da produção nas condições previstas. Enquadramento: compatibilidade com os requisitos da modalidade; não é sinônimo de aprovação.",
      "sourceIds": []
    },
    {
      "id": "resumo",
      "type": "summary",
      "heading": "13. Roteiro para classificar",
      "body": "Identifique o tomador e o uso concreto. Pergunte se o gasto sustenta o ciclo, beneficia vários períodos, viabiliza a venda ou processa a produção. Depois separe essa classificação das condições e da decisão de crédito. Se faltar a finalidade ou o enquadramento, diga o que falta em vez de adivinhar pelo valor ou endereço.",
      "sourceIds": []
    }
  ],
  "recall": [
    "Sem olhar, diferencie as quatro finalidades usando um gasto ou uso concreto.",
    "Se confundiu investimento e custeio, retome o número de períodos beneficiados; se confundiu comercialização e industrialização, diferencie vender e processar.",
    "Explique por que ser produtor não é o mesmo que ter um financiamento aprovado."
  ],
  "questions": [
    {
      "id": "pc06.q01",
      "topicId": "draft.pc06",
      "prompt": "Um produtor quer recursos para sementes e insumos do ciclo atual, em operação rural admitida. Qual finalidade foi descrita?",
      "options": [
        "Comercialização, pois toda produção será vendida.",
        "Custeio, por atender despesas desse ciclo.",
        "Investimento, porque qualquer compra usa dinheiro.",
        "Industrialização, mesmo sem processamento."
      ],
      "answer": 1,
      "explanation": "O uso atual é produzir no ciclo, característica do custeio.",
      "optionRationales": [
        "A venda futura não muda o uso imediato informado.",
        "Relaciona finalidade e período corretamente.",
        "Investimento rural tem sentido específico de benefício em vários períodos.",
        "O caso não descreve transformação da produção."
      ],
      "recoverySectionIds": [
        "custeio",
        "exemplo-custeio"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "pc06.q02",
      "topicId": "draft.pc06",
      "prompt": "Um trator será usado em várias safras. Qual é a classificação introdutória dessa necessidade?",
      "options": [
        "Custeio apenas porque é comprado neste ano.",
        "Comercialização apenas porque custou caro.",
        "Depósito de poupança.",
        "Investimento rural, pelo benefício em vários períodos."
      ],
      "answer": 3,
      "explanation": "O critério é o uso duradouro, não o ano da compra.",
      "optionRationales": [
        "Data de aquisição não transforma bem durável em insumo de um ciclo.",
        "Preço não define finalidade.",
        "Uma máquina produtiva não é um depósito financeiro.",
        "Reconhece o benefício em diversos períodos."
      ],
      "recoverySectionIds": [
        "investimento",
        "exemplo-investimento"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "pc06.q03",
      "topicId": "draft.pc06",
      "prompt": "A operação descrita se destina a viabilizar a colocação da produção já colhida de uma cooperativa no mercado. O enunciado confirma seu enquadramento. Qual finalidade pede?",
      "options": [
        "Comercialização.",
        "Custeio da compra de sementes.",
        "Industrialização, necessariamente.",
        "Compra de ações."
      ],
      "answer": 0,
      "explanation": "A finalidade expressa é comercializar a produção.",
      "optionRationales": [
        "Corresponde ao uso descrito.",
        "Não há sementes para novo ciclo no caso.",
        "Vender não implica processar.",
        "Não há participação societária na operação."
      ],
      "recoverySectionIds": [
        "comercializacao",
        "exemplo-comercializacao"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "pc06.q04",
      "topicId": "draft.pc06",
      "prompt": "Uma cooperativa toma crédito rural admitido para processar a produção de seus cooperados. O caso exclui compra de máquina durável. Qual finalidade é a mais direta?",
      "options": [
        "Comercialização apenas porque a cooperativa vende depois.",
        "Custeio de sementes não mencionadas.",
        "Industrialização.",
        "Investimento em qualquer aplicação financeira."
      ],
      "answer": 2,
      "explanation": "Processamento é o uso expressamente descrito e enquadrado.",
      "optionRationales": [
        "A venda posterior não substitui o uso informado.",
        "Inventa despesa que não consta do caso.",
        "Identifica a transformação da produção.",
        "Troca a finalidade rural por aplicação financeira."
      ],
      "recoverySectionIds": [
        "industrializacao",
        "exemplo-industrializacao"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "pc06.q05",
      "topicId": "draft.pc06",
      "prompt": "Pessoa física é produtora rural e pertence a uma categoria admitida. Isso basta para concluir que seu pedido será aprovado?",
      "options": [
        "Sim, todo produtor recebe qualquer valor.",
        "Não; enquadramento, finalidade e condições da operação ainda precisam ser verificados.",
        "Sim, desde que more no campo, sem outra análise.",
        "Não pode sequer ser beneficiária porque só empresas podem."
      ],
      "answer": 1,
      "explanation": "Categoria admitida não elimina análise ou requisitos específicos.",
      "optionRationales": [
        "Converte elegibilidade geral em aprovação irrestrita.",
        "Conserva as etapas necessárias.",
        "Endereço não substitui as condições.",
        "Exclui indevidamente produtores pessoas físicas."
      ],
      "recoverySectionIds": [
        "participantes",
        "condicoes"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "pc06.q06",
      "topicId": "draft.pc06",
      "prompt": "Quem estabelece normas gerais do crédito rural e qual referência reúne sua disciplina?",
      "options": [
        "O tomador sozinho; qualquer anúncio serve como norma.",
        "A cooperativa sempre substitui o CMN.",
        "Somente a prefeitura, em todos os contratos.",
        "O CMN normatiza; o MCR reúne regras, com coordenação e fiscalização do BCB no sistema."
      ],
      "answer": 3,
      "explanation": "É necessário distinguir tomador, instituição financeira e autoridades do sistema.",
      "optionRationales": [
        "Condições contratuais não substituem normas.",
        "Ser beneficiária não dá à cooperativa esse papel.",
        "Não corresponde à estrutura ensinada.",
        "Identifica as funções e a referência normativa."
      ],
      "recoverySectionIds": [
        "participantes"
      ],
      "objectiveIds": [
        "O4"
      ]
    },
    {
      "id": "pc06.q07",
      "topicId": "draft.pc06",
      "prompt": "Duas necessidades: R$7.000 de insumos do ciclo e R$30.000 de equipamento usado por vários períodos. Qual leitura é correta?",
      "options": [
        "Somam R$37.000 e têm finalidades distintas: custeio e investimento; isso não prova aprovação integral.",
        "Somam R$23.000 e são a mesma finalidade.",
        "O equipamento transforma todos os gastos em investimento.",
        "Os R$37.000 serão necessariamente concedidos sem análise."
      ],
      "answer": 0,
      "explanation": "7.000 + 30.000 = 37.000; separar usos evita classificação e aprovação indevidas.",
      "optionRationales": [
        "Calcula e preserva os limites.",
        "Subtrai em vez de somar e apaga a diferença de usos.",
        "Generaliza a partir de um dos componentes.",
        "Inventa decisão de crédito."
      ],
      "recoverySectionIds": [
        "exemplo-investimento",
        "condicoes"
      ],
      "objectiveIds": [
        "O1",
        "O3"
      ]
    },
    {
      "id": "pc06.q08",
      "topicId": "draft.pc06",
      "prompt": "Um texto não informa programa, data de contratação, fonte dos recursos nem condições. Que conclusão deve ser evitada?",
      "options": [
        "É preciso consultar as condições aplicáveis.",
        "Finalidade e custo são dimensões diferentes.",
        "Todo crédito rural tem a mesma taxa e usa somente recursos públicos.",
        "A informação ausente impede afirmar uma taxa específica."
      ],
      "answer": 2,
      "explanation": "A modalidade admite fontes e condições diferentes; a aula não fornece taxas de programas.",
      "optionRationales": [
        "É o próximo passo coerente.",
        "A separação evita erro.",
        "É a generalização indevida.",
        "Respeita a insuficiência dos dados."
      ],
      "recoverySectionIds": [
        "condicoes"
      ],
      "objectiveIds": [
        "O5"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "pc06-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "pc06.q01": [
        {
          "missionId": "draft.pc06",
          "sectionId": "custeio"
        },
        {
          "missionId": "draft.pc06",
          "sectionId": "exemplo-custeio"
        }
      ],
      "pc06.q02": [
        {
          "missionId": "draft.pc06",
          "sectionId": "investimento"
        },
        {
          "missionId": "draft.pc06",
          "sectionId": "exemplo-investimento"
        }
      ],
      "pc06.q03": [
        {
          "missionId": "draft.pc06",
          "sectionId": "comercializacao"
        },
        {
          "missionId": "draft.pc06",
          "sectionId": "exemplo-comercializacao"
        }
      ],
      "pc06.q04": [
        {
          "missionId": "draft.pc06",
          "sectionId": "industrializacao"
        },
        {
          "missionId": "draft.pc06",
          "sectionId": "exemplo-industrializacao"
        }
      ],
      "pc06.q05": [
        {
          "missionId": "draft.pc06",
          "sectionId": "participantes"
        },
        {
          "missionId": "draft.pc06",
          "sectionId": "condicoes"
        }
      ],
      "pc06.q06": [
        {
          "missionId": "draft.pc06",
          "sectionId": "participantes"
        }
      ],
      "pc06.q07": [
        {
          "missionId": "draft.pc06",
          "sectionId": "exemplo-investimento"
        },
        {
          "missionId": "draft.pc06",
          "sectionId": "condicoes"
        }
      ],
      "pc06.q08": [
        {
          "missionId": "draft.pc06",
          "sectionId": "condicoes"
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
    "O1: distinguir custeio e investimento",
    "O2: distinguir comercialização e industrialização",
    "O3: separar beneficiário/enquadramento/aprovação",
    "O4: reconhecer SNCR, CMN, BCB e MCR",
    "O5: reconhecer limites das condições e fontes",
    "O6: reconstruir o critério da classificação no trecho indicado"
  ],
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Retomar os trechos indicados, explicar a confusão e reconstruir o caso antes de repetir; não gerar indicador de domínio."
  },
  "limits": [
    "Recorte introdutório; não esgota MCR, programas, beneficiários, exigências ambientais, encargos ou análise técnica rural. Não aborda PC-07 habitacional condicionado.",
    "Casos fictícios originais, sem recomendação para pessoa real. Fontes primárias consultadas em 30/09/2026; conferir alterações pertinentes antes de publicação futura.",
    "Prática exposta, fora de avaliações independentes. IDs locais, sem XP/ordem/gate produtivo ou importação no manifesto. Não demonstra cobertura integral do bloco ou edital histórico."
  ]
};

export const ARITHMETIC = [
  {
    "label": "Insumos do exemplo",
    "operation": "add",
    "values": [
      6000,
      4000
    ],
    "expected": 10000
  },
  {
    "label": "Duas finalidades",
    "operation": "add",
    "values": [
      80000,
      10000
    ],
    "expected": 90000
  },
  {
    "label": "Questão 7",
    "operation": "add",
    "values": [
      7000,
      30000
    ],
    "expected": 37000
  }
];
