export const SOURCES = [
  {
    "id": "bcb.dp.fintechs",
    "label": "BCB — Fintechs",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/fintechs",
    "locator": "Definição introdutória; não utilizados limites ou normas antigos da página",
    "version": "Página oficial consultada em 01/10/2026",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "lei.dp.startups",
    "label": "LC 182/2021 — Startups",
    "url": "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp182.htm",
    "locator": "Art. 4º: conceito e requisitos adicionais para enquadramento",
    "version": "Texto oficial consultado; sem ensino de limites numéricos",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "bis.dp.bigtech",
    "label": "BIS — Big tech in finance",
    "url": "https://www.bis.org/publications/aer-2019/big-tech-finance-opportunities-risks",
    "locator": "Conceitos de plataforma, dados, rede e entrada em finanças; não estatísticas atuais",
    "version": "Annual Economic Report 2019, capítulo III",
    "checkedAt": "2026-10-01"
  }
];

export const DP03_DRAFT = {
  "id": "draft.dp03",
  "topicId": "banking.digital-payments",
  "candidateBlockId": "banking.digital-payments",
  "editorialKey": "DP-03",
  "title": "Fintechs, startups e bigtechs",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Distinguir fintech, startup e bigtech pela dimensão descrita.",
  "sourceIds": [
    "bcb.dp.fintechs",
    "lei.dp.startups",
    "bis.dp.bigtech"
  ],
  "sections": [
    {
      "id": "dimensoes",
      "type": "explanation",
      "heading": "1. Três termos, perguntas diferentes",
      "body": "Fintech destaca inovação em serviços financeiros com uso intensivo de tecnologia. Startup remete a empreendimento nascente ou recente marcado pela inovação; o enquadramento no regime da LC 182 tem requisitos adicionais. Bigtech descreve uma grande empresa tecnológica com atividades amplas, que pode também entrar em serviços financeiros. Os termos não são três licenças bancárias e podem se sobrepor em situações específicas.",
      "sourceIds": [
        "bcb.dp.fintechs",
        "lei.dp.startups",
        "bis.dp.bigtech"
      ]
    },
    {
      "id": "ex-fintech",
      "type": "worked-example",
      "heading": "2. Exemplo resolvido: atividade financeira",
      "body": "A empresa fictícia Vela usa tecnologia intensamente para oferecer uma solução financeira inovadora. Isso sustenta a descrição geral de fintech. O caso não informa seu tempo de existência, dimensão, licença nem preço: não permite acrescentar que ela é startup legalmente enquadrada, bigtech, banco ou gratuita.",
      "sourceIds": [
        "bcb.dp.fintechs"
      ]
    },
    {
      "id": "startup",
      "type": "explanation",
      "heading": "3. Inovação não se resume a ter um aplicativo",
      "body": "O art. 4º da LC 182 relaciona startups a empreendimentos novos ou recentes com inovação aplicada ao modelo, produto ou serviço. A própria lei acrescenta condições para o tratamento especial. Nesta introdução, não decoramos limites: aprendemos a não converter o uso de um aplicativo, sozinho, em enquadramento legal. Uma inovação pode ocorrer fora do setor financeiro.",
      "sourceIds": [
        "lei.dp.startups"
      ]
    },
    {
      "id": "ex-startup",
      "type": "worked-example",
      "heading": "4. Exemplo resolvido: novidade fora das finanças",
      "body": "Um empreendimento recente desenvolve uma solução inovadora para organizar entregas. O caso permite discutir características de startup, mas não comprova todos os requisitos legais. Como não descreve serviço financeiro, não há base para chamá-lo de fintech apenas por usar tecnologia.",
      "sourceIds": []
    },
    {
      "id": "rede",
      "type": "explanation",
      "heading": "5. Plataforma, dados e rede",
      "body": "No estudo do BIS, empresas tecnológicas de grande escala podem integrar serviços financeiros a negócios mais amplos. Efeitos de rede ocorrem quando a presença de participantes aumenta a utilidade para outros participantes. Dados, rede e atividades podem se reforçar, mas também levantar questões de competição e privacidade. Benefício potencial não assegura sucesso nem justifica qualquer uso de informação.",
      "sourceIds": [
        "bis.dp.bigtech"
      ]
    },
    {
      "id": "ex-rede",
      "type": "worked-example",
      "heading": "6. Exemplo resolvido: participantes de dois lados",
      "body": "No mercado fictício Ponte, mais vendedores ampliam as opções para compradores; mais compradores tornam a plataforma atraente para vendedores. Esse reforço entre os lados ilustra efeito de rede. Não informa lucro, qualidade de cada oferta ou autorização para prestar serviço financeiro.",
      "sourceIds": []
    },
    {
      "id": "rotulos",
      "type": "explanation",
      "heading": "7. O rótulo não substitui a atividade",
      "body": "Para comparar prestadores, identifique o serviço, quem o executa, suas condições e o enquadramento aplicável. Tecnologia não torna toda empresa banco. Também não prova gratuidade, ausência de risco ou garantia de crédito. Uma bigtech pode oferecer acesso a serviço de uma instituição parceira: aparecer na tela não é suficiente para identificar o prestador.",
      "sourceIds": [
        "bcb.dp.fintechs",
        "bis.dp.bigtech"
      ]
    },
    {
      "id": "ex-parceria",
      "type": "worked-example",
      "heading": "8. Exemplo resolvido: a marca da tela",
      "body": "Um aplicativo de grande empresa tecnológica exibe proposta de crédito; o enunciado identifica um banco parceiro como concedente. A interface pertence ao aplicativo e o crédito é concedido pelo banco informado. Trocar esses papéis só por causa da marca visual seria um erro.",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "Vocabulário essencial",
      "body": "Fintech: inovação tecnológica financeira. Startup: empreendimento inovador novo/recente, com requisitos próprios para o regime legal. Bigtech: grande empresa tecnológica de atuação ampla. Efeito de rede: utilidade de participar relacionada à presença de outros participantes.",
      "sourceIds": []
    },
    {
      "id": "resumo",
      "type": "summary",
      "heading": "Recuperação e síntese",
      "body": "Separe atividade, fase do empreendimento e escala/ecossistema. Identifique o prestador real no caso; não atribua licença ou garantia ao rótulo. Se errar, nomeie a confusão, retome o trecho indicado e reconstrua o exemplo com suas palavras. Esta prática exposta não é avaliação independente de retenção.",
      "sourceIds": []
    }
  ],
  "questions": [
    {
      "prompt": "Vela inova em serviços financeiros com uso intensivo de tecnologia. Qual caracterização geral é sustentada?",
      "options": [
        "Bigtech, necessariamente.",
        "Fintech, sem deduzir licença ou porte.",
        "Banco central.",
        "Startup legalmente enquadrada, sem outros dados."
      ],
      "answer": 1,
      "explanation": "É a dimensão descrita; outros atributos exigem dados.",
      "optionRationales": [
        "Não foi informado grande porte ou ecossistema amplo.",
        "É a dimensão descrita; outros atributos exigem dados.",
        "Inovação privada não cria autoridade monetária.",
        "O enquadramento possui requisitos próprios."
      ],
      "recoverySectionIds": [
        "dimensoes",
        "ex-fintech"
      ],
      "objectiveIds": [
        "O1",
        "O2"
      ],
      "id": "dp03.q01"
    },
    {
      "prompt": "Uma empresa recente inova em logística, sem serviço financeiro descrito. O que se pode afirmar?",
      "options": [
        "Toda inovação é fintech.",
        "Ter software comprova licença bancária.",
        "O caso permite discutir características de startup, sem comprovar o enquadramento legal completo.",
        "Nenhuma startup pode atuar fora das finanças."
      ],
      "answer": 2,
      "explanation": "Mantém o foco em inovação e os limites da informação.",
      "optionRationales": [
        "Fintech se refere a serviços financeiros.",
        "Software não equivale a autorização.",
        "Mantém o foco em inovação e os limites da informação.",
        "Startups não se restringem às finanças."
      ],
      "recoverySectionIds": [
        "startup",
        "ex-startup"
      ],
      "objectiveIds": [
        "O3"
      ],
      "id": "dp03.q02"
    },
    {
      "prompt": "A designação bigtech, no recorte desta aula, destaca:",
      "options": [
        "Grande empresa tecnológica com atividades amplas, inclusive eventual atuação financeira.",
        "Qualquer loja que criou uma página.",
        "A única licença para receber depósitos.",
        "Empresa obrigatoriamente nascente."
      ],
      "answer": 0,
      "explanation": "Reconhece escala e amplitude do conceito econômico.",
      "optionRationales": [
        "Reconhece escala e amplitude do conceito econômico.",
        "Uma página não demonstra essas características.",
        "O termo não é licença bancária.",
        "Grande empresa tecnológica não precisa ser nascente."
      ],
      "recoverySectionIds": [
        "dimensoes",
        "rede"
      ],
      "objectiveIds": [
        "O1",
        "O4"
      ],
      "id": "dp03.q03"
    },
    {
      "prompt": "Mais vendedores atraem compradores e mais compradores atraem vendedores em Ponte. O que foi descrito?",
      "options": [
        "Garantia de lucro.",
        "Garantia de qualidade de toda oferta.",
        "Ausência de competição.",
        "Efeito de rede entre os dois lados."
      ],
      "answer": 3,
      "explanation": "O valor de participar se relaciona à presença do outro grupo.",
      "optionRationales": [
        "O caso não informa receitas e custos.",
        "Participação não garante cada oferta.",
        "A concorrência não foi eliminada pelo exemplo.",
        "O valor de participar se relaciona à presença do outro grupo."
      ],
      "recoverySectionIds": [
        "rede",
        "ex-rede"
      ],
      "objectiveIds": [
        "O4"
      ],
      "id": "dp03.q04"
    },
    {
      "prompt": "O banco parceiro é identificado como concedente do crédito mostrado no aplicativo de uma bigtech. Quem concede nesse caso?",
      "options": [
        "O banco parceiro informado.",
        "Qualquer anunciante da tela.",
        "O usuário do aplicativo.",
        "O Banco Central, por existir tecnologia."
      ],
      "answer": 0,
      "explanation": "Preserva o papel explicitamente atribuído.",
      "optionRationales": [
        "Preserva o papel explicitamente atribuído.",
        "Exibir anúncio não atribui concessão.",
        "O usuário é potencial tomador, não o concedente descrito.",
        "A tecnologia não transforma a operação em crédito do BC."
      ],
      "recoverySectionIds": [
        "rotulos",
        "ex-parceria"
      ],
      "objectiveIds": [
        "O5"
      ],
      "id": "dp03.q05"
    },
    {
      "prompt": "Qual dado, isoladamente, é insuficiente para comprovar enquadramento de startup nos termos da LC 182?",
      "options": [
        "Demonstração de todos os requisitos legais aplicáveis.",
        "O simples fato de possuir aplicativo.",
        "Verificação dos requisitos do regime no caso concreto.",
        "Análise das condições legais relevantes."
      ],
      "answer": 1,
      "explanation": "Ter aplicativo não prova inovação nem as demais condições.",
      "optionRationales": [
        "Essa alternativa fala em comprovar os requisitos, não apenas uma aparência.",
        "Ter aplicativo não prova inovação nem as demais condições.",
        "A verificação é justamente o que falta ao rótulo isolado.",
        "A análise não se confunde com a presença do aplicativo."
      ],
      "recoverySectionIds": [
        "startup"
      ],
      "objectiveIds": [
        "O3",
        "O5"
      ],
      "id": "dp03.q06"
    },
    {
      "prompt": "Um anúncio diz apenas “somos fintech”. Qual conclusão adicional é indevida?",
      "options": [
        "O caso ainda requer identificar a atividade.",
        "O termo não define sozinho o preço.",
        "Todos os serviços são gratuitos e sem risco.",
        "O rótulo não basta para atribuir uma licença."
      ],
      "answer": 2,
      "explanation": "Gratuidade e risco zero não decorrem do termo.",
      "optionRationales": [
        "Essa cautela respeita a informação limitada.",
        "Preço depende das condições.",
        "Gratuidade e risco zero não decorrem do termo.",
        "A atividade concreta exige identificação própria."
      ],
      "recoverySectionIds": [
        "rotulos"
      ],
      "objectiveIds": [
        "O5"
      ],
      "id": "dp03.q07"
    },
    {
      "prompt": "Um aluno confundiu a marca da interface com o concedente do crédito. Qual recuperação corrige o raciocínio?",
      "options": [
        "Escolher sempre a empresa maior.",
        "Memorizar a cor do aplicativo.",
        "Tratar todo participante como banco.",
        "Reconstituir quem exibe a proposta e quem concede, conforme o enunciado."
      ],
      "answer": 3,
      "explanation": "A separação de funções enfrenta a confusão.",
      "optionRationales": [
        "Porte não substitui o papel informado.",
        "A cor não identifica a responsabilidade descrita.",
        "Os papéis podem ser distintos.",
        "A separação de funções enfrenta a confusão."
      ],
      "recoverySectionIds": [
        "ex-parceria",
        "resumo"
      ],
      "objectiveIds": [
        "O6"
      ],
      "id": "dp03.q08"
    }
  ],
  "recall": [
    "Separe atividade, fase do empreendimento e escala/ecossistema.",
    "Identifique o prestador real no caso; não atribua licença ou garantia ao rótulo."
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "dp03-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "dp03.q01": [
        {
          "missionId": "draft.dp03",
          "sectionId": "dimensoes"
        },
        {
          "missionId": "draft.dp03",
          "sectionId": "ex-fintech"
        }
      ],
      "dp03.q02": [
        {
          "missionId": "draft.dp03",
          "sectionId": "startup"
        },
        {
          "missionId": "draft.dp03",
          "sectionId": "ex-startup"
        }
      ],
      "dp03.q03": [
        {
          "missionId": "draft.dp03",
          "sectionId": "dimensoes"
        },
        {
          "missionId": "draft.dp03",
          "sectionId": "rede"
        }
      ],
      "dp03.q04": [
        {
          "missionId": "draft.dp03",
          "sectionId": "rede"
        },
        {
          "missionId": "draft.dp03",
          "sectionId": "ex-rede"
        }
      ],
      "dp03.q05": [
        {
          "missionId": "draft.dp03",
          "sectionId": "rotulos"
        },
        {
          "missionId": "draft.dp03",
          "sectionId": "ex-parceria"
        }
      ],
      "dp03.q06": [
        {
          "missionId": "draft.dp03",
          "sectionId": "startup"
        }
      ],
      "dp03.q07": [
        {
          "missionId": "draft.dp03",
          "sectionId": "rotulos"
        }
      ],
      "dp03.q08": [
        {
          "missionId": "draft.dp03",
          "sectionId": "ex-parceria"
        },
        {
          "missionId": "draft.dp03",
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
      "item": "Atualidades 6",
      "status": "histórico; referenceOnly"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Conhecimentos Bancários 8",
      "status": "histórico; referenceOnly"
    }
  ],
  "objectives": {
    "O1": "Distinguir fintech, startup e bigtech pela dimensão descrita.",
    "O2": "Identificar inovação financeira com uso intensivo de tecnologia.",
    "O3": "Reconhecer inovação e requisitos próprios do enquadramento de startup.",
    "O4": "Interpretar plataformas e efeitos de rede sem garantia de sucesso.",
    "O5": "Evitar inferir autorização, preço ou risco apenas pelo rótulo.",
    "O6": "Recuperar a confusão pela seção de ensino e refazer o caso."
  },
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Nomear a confusão e reconstruir o caso após retomar o ensino."
  },
  "limits": [
    "BIS 2019 utilizado somente para conceitos; sem estatísticas atuais ou classificação de empresas reais.",
    "LC 182 limitada ao conceito e necessidade de requisitos; não substitui enquadramento jurídico.",
    "Casos e números autorais fictícios; não representam operação, oferta ou dado pessoal real.",
    "Sem XP/ordem/desbloqueio ou importação no runtime; não equivale a aceite humano da Fase 2."
  ]
};

export const ARITHMETIC = [];
