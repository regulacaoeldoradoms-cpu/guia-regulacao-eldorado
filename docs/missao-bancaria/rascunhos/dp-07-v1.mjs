export const SOURCES = [
  {
    "id": "bcb.dp.openfinance",
    "label": "BCB — Open Finance",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/openfinance",
    "locator": "Escolha de dados/destinatário/prazo, cancelamento e benefícios possíveis",
    "version": "Página oficial consultada em 01/10/2026",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "lei.dp.conservacao",
    "label": "Lei 13.709/2018 — LGPD",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm",
    "locator": "Arts. 16, I, e 18, VI/IX: conservação para obrigação legal ou regulatória, ressalvas à eliminação e revogação do consentimento.",
    "version": "Texto compilado consultado em 03/10/2026",
    "checkedAt": "2026-10-03"
  }
];

export const DP07_DRAFT = {
  "id": "draft.dp07",
  "topicId": "banking.digital-payments",
  "candidateBlockId": "banking.digital-payments",
  "editorialKey": "DP-07",
  "title": "Open Banking e Open Finance: escolha e compartilhamento",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Explicar compartilhamento autorizado no Open Finance.",
  "sourceIds": [
    "bcb.dp.openfinance",
    "lei.dp.conservacao"
  ],
  "sections": [
    {
      "id": "conceito",
      "type": "explanation",
      "heading": "1. Dados podem acompanhar a escolha do cliente",
      "body": "Open Banking é a denominação presente no edital histórico BB. O atual Open Finance amplia a perspectiva para serviços financeiros. No compartilhamento de dados do cliente, ele escolhe permitir que uma instituição acesse informações mantidas em outra. Isso pode facilitar comparação e oferta de serviços; não torna os dados públicos.",
      "sourceIds": [
        "bcb.dp.openfinance"
      ]
    },
    {
      "id": "ex-escolha",
      "type": "worked-example",
      "heading": "2. Exemplo resolvido: informação entre instituições",
      "body": "Lia autoriza a instituição B a receber dados de sua relação com A no escopo informado. B pode usar essas informações dentro da finalidade e condições aplicáveis. A autorização para B não equivale a divulgar o histórico para qualquer empresa.",
      "sourceIds": []
    },
    {
      "id": "controle",
      "type": "explanation",
      "heading": "3. O que conferir na autorização",
      "body": "A apresentação do BCB destaca a escolha dos dados, da instituição destinatária e do período. A autorização pode ser cancelada. Não ensinamos prazo máximo fixo, porque o recorte é entender o controle e não decorar uma condição que pode mudar. Cancelar o compartilhamento não significa apagar automaticamente toda informação cuja conservação tenha fundamento legal.",
      "sourceIds": [
        "bcb.dp.openfinance",
        "lei.dp.conservacao"
      ]
    },
    {
      "id": "ex-escopo",
      "type": "worked-example",
      "heading": "4. Exemplo resolvido: permissão delimitada",
      "body": "O caso autoriza B a receber um conjunto identificado de informações durante o período indicado. Nada permite concluir que C também recebeu autorização ou que qualquer outro conjunto foi incluído. A leitura correta mantém destinatário, conteúdo e período descritos.",
      "sourceIds": []
    },
    {
      "id": "oferta",
      "type": "explanation",
      "heading": "5. Conhecer melhor não é prometer aprovação",
      "body": "Uma instituição com informações adicionais pode avaliar melhor uma necessidade e formular ofertas. Isso não garante taxa menor, concessão de crédito ou produto adequado em toda situação. A comparação ainda depende das condições efetivas, retomando o cuidado de PC com custo e contrato.",
      "sourceIds": [
        "bcb.dp.openfinance"
      ]
    },
    {
      "id": "ex-credito",
      "type": "worked-example",
      "heading": "6. Exemplo resolvido: comparar antes de concluir",
      "body": "Um cliente compartilha dados e recebe duas propostas com condições diferentes. O compartilhamento ajudou a obter alternativas no caso; não demonstra sozinho qual é melhor. É preciso comparar custos e condições relevantes. Nenhuma aprovação universal resulta da autorização.",
      "sourceIds": []
    },
    {
      "id": "pagamento",
      "type": "explanation",
      "heading": "7. Informação e movimentação são ações diferentes",
      "body": "Open Finance também pode apoiar iniciação de pagamentos e integração de serviços. Permitir acesso a dados não equivale, por si só, a confirmar qualquer transferência. Observe qual ação foi autorizada e o estado informado. Não se deve entregar senhas a terceiros para “abrir” dados: o fluxo legítimo ocorre nos canais das instituições.",
      "sourceIds": [
        "bcb.dp.openfinance"
      ]
    },
    {
      "id": "ex-acao",
      "type": "worked-example",
      "heading": "8. Exemplo resolvido: uma tela não autoriza tudo",
      "body": "No cenário, a pessoa autoriza somente compartilhamento de informações e nenhuma ordem de pagamento é descrita. Pode-se afirmar a permissão de acesso no escopo informado. Não há base para concluir que dinheiro saiu da conta. A função de pagamento exigiria o fluxo correspondente.",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "Vocabulário essencial",
      "body": "Open Finance: compartilhamento e integração de serviços financeiros sob regras próprias. Escopo: quais dados, para quem e por quanto tempo. Oferta: proposta sujeita a condições. Iniciação de pagamento: ação distinta do simples acesso a dados.",
      "sourceIds": []
    },
    {
      "id": "resumo",
      "type": "summary",
      "heading": "Recuperação e síntese",
      "body": "Delimite informação, destinatário e prazo. Separe autorização de dados, oferta de produto e ordem de pagamento. Se errar, nomeie a confusão, retome o trecho indicado e reconstrua o exemplo com suas palavras. Esta prática exposta não é avaliação independente de retenção.",
      "sourceIds": []
    }
  ],
  "questions": [
    {
      "prompt": "No compartilhamento de dados pelo Open Finance, qual leitura é correta?",
      "options": [
        "Toda empresa passa a acessar todos os dados.",
        "A informação se torna pública.",
        "A conta é encerrada automaticamente.",
        "O cliente autoriza compartilhamento delimitado entre instituições."
      ],
      "answer": 3,
      "explanation": "Preserva escolha e escopo.",
      "optionRationales": [
        "A autorização não se estende a todas.",
        "Compartilhar não é publicar.",
        "O caso não prevê encerramento.",
        "Preserva escolha e escopo."
      ],
      "recoverySectionIds": [
        "conceito"
      ],
      "objectiveIds": [
        "O1",
        "O2"
      ],
      "id": "dp07.q01"
    },
    {
      "prompt": "Quais dimensões a autorização deve permitir identificar no recorte da aula?",
      "options": [
        "Somente a cor da tela.",
        "Dados, destinatário e período.",
        "Lucro garantido e taxa obrigatória.",
        "Todos os futuros produtos automaticamente aprovados."
      ],
      "answer": 1,
      "explanation": "São os elementos destacados.",
      "optionRationales": [
        "A aparência não delimita a permissão.",
        "São os elementos destacados.",
        "Não são garantias do compartilhamento.",
        "Compartilhamento não aprova produtos."
      ],
      "recoverySectionIds": [
        "controle",
        "ex-escopo"
      ],
      "objectiveIds": [
        "O3"
      ],
      "id": "dp07.q02"
    },
    {
      "prompt": "Autorizar B a receber informações de A permite concluir que C também foi autorizada?",
      "options": [
        "Não; o destinatário deve respeitar o escopo informado.",
        "Sim, por existir tecnologia.",
        "Sim, porque os dados ficam públicos.",
        "Sim, porque B se torna dona irrestrita dos dados."
      ],
      "answer": 0,
      "explanation": "A permissão não se amplia por presunção.",
      "optionRationales": [
        "A permissão não se amplia por presunção.",
        "Tecnologia não acrescenta destinatário.",
        "Os dados não se tornam públicos.",
        "A autorização não é poder irrestrito de uso."
      ],
      "recoverySectionIds": [
        "ex-escolha",
        "ex-escopo"
      ],
      "objectiveIds": [
        "O1",
        "O3"
      ],
      "id": "dp07.q03"
    },
    {
      "prompt": "Uma oferta de crédito após compartilhamento:",
      "options": [
        "Tem aprovação e menor taxa garantidas.",
        "Dispensa comparar condições.",
        "Pode ampliar alternativas, mas ainda exige análise das condições concretas.",
        "É necessariamente um pagamento já concluído."
      ],
      "answer": 2,
      "explanation": "Separa oportunidade de resultado assegurado.",
      "optionRationales": [
        "Benefício possível não é garantia.",
        "Condições continuam relevantes.",
        "Separa oportunidade de resultado assegurado.",
        "Oferta não executa transferência."
      ],
      "recoverySectionIds": [
        "oferta",
        "ex-credito"
      ],
      "objectiveIds": [
        "O4"
      ],
      "id": "dp07.q04"
    },
    {
      "prompt": "O cliente pode cancelar a autorização de compartilhamento?",
      "options": [
        "Nunca.",
        "Sim; isso não implica apagar automaticamente toda informação legalmente conservada.",
        "Só se deixar de usar qualquer banco.",
        "Sim, o que prova extinção de toda obrigação contratual."
      ],
      "answer": 1,
      "explanation": "Distingue cancelamento e consequências que não podem ser presumidas.",
      "optionRationales": [
        "O BCB informa a possibilidade de cancelamento.",
        "Distingue cancelamento e consequências que não podem ser presumidas.",
        "Essa exigência não foi apresentada.",
        "Cancelar compartilhamento não extingue contratos."
      ],
      "recoverySectionIds": [
        "controle"
      ],
      "objectiveIds": [
        "O3"
      ],
      "id": "dp07.q05"
    },
    {
      "prompt": "O caso descreve apenas compartilhamento de dados, sem ordem de pagamento. Qual conclusão é indevida?",
      "options": [
        "Houve uma autorização no escopo informado.",
        "Falta informação sobre qualquer transferência.",
        "Dados e pagamento são ações distintas.",
        "Dinheiro foi necessariamente transferido."
      ],
      "answer": 3,
      "explanation": "Adiciona operação não descrita.",
      "optionRationales": [
        "Corresponde ao caso.",
        "Respeita a ausência da operação.",
        "É a distinção ensinada.",
        "Adiciona operação não descrita."
      ],
      "recoverySectionIds": [
        "pagamento",
        "ex-acao"
      ],
      "objectiveIds": [
        "O5"
      ],
      "id": "dp07.q06"
    },
    {
      "prompt": "Como interpretar Open Banking no edital histórico e Open Finance nesta aula?",
      "options": [
        "Relacionar o termo histórico ao desenvolvimento de um escopo financeiro mais amplo.",
        "Tratá-los como novas moedas.",
        "Supor que ambos publicam saldos de todos os clientes.",
        "Concluir que o compartilhamento dispensa autorização."
      ],
      "answer": 0,
      "explanation": "Reconhece a evolução da denominação e do escopo.",
      "optionRationales": [
        "Reconhece a evolução da denominação e do escopo.",
        "São estruturas de serviços, não moedas.",
        "Não há publicação universal de dados.",
        "A escolha do cliente continua central no compartilhamento tratado."
      ],
      "recoverySectionIds": [
        "conceito"
      ],
      "objectiveIds": [
        "O2"
      ],
      "id": "dp07.q07"
    },
    {
      "prompt": "Um aluno inferiu aprovação obrigatória de empréstimo após compartilhar dados. A recuperação correta é:",
      "options": [
        "Memorizar que dados eliminam todo risco.",
        "Aumentar a promessa para todos os produtos.",
        "Separar informação adicional, análise da instituição e condições da oferta.",
        "Ignorar o contrato."
      ],
      "answer": 2,
      "explanation": "Enfrenta o salto entre conhecer e aprovar.",
      "optionRationales": [
        "Informação não elimina todo risco.",
        "Repete e amplia o erro.",
        "Enfrenta o salto entre conhecer e aprovar.",
        "As condições são parte da avaliação."
      ],
      "recoverySectionIds": [
        "oferta",
        "ex-credito",
        "resumo"
      ],
      "objectiveIds": [
        "O6"
      ],
      "id": "dp07.q08"
    }
  ],
  "recall": [
    "Delimite informação, destinatário e prazo.",
    "Separe autorização de dados, oferta de produto e ordem de pagamento."
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "dp07-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "dp07.q01": [
        {
          "missionId": "draft.dp07",
          "sectionId": "conceito"
        }
      ],
      "dp07.q02": [
        {
          "missionId": "draft.dp07",
          "sectionId": "controle"
        },
        {
          "missionId": "draft.dp07",
          "sectionId": "ex-escopo"
        }
      ],
      "dp07.q03": [
        {
          "missionId": "draft.dp07",
          "sectionId": "ex-escolha"
        },
        {
          "missionId": "draft.dp07",
          "sectionId": "ex-escopo"
        }
      ],
      "dp07.q04": [
        {
          "missionId": "draft.dp07",
          "sectionId": "oferta"
        },
        {
          "missionId": "draft.dp07",
          "sectionId": "ex-credito"
        }
      ],
      "dp07.q05": [
        {
          "missionId": "draft.dp07",
          "sectionId": "controle"
        }
      ],
      "dp07.q06": [
        {
          "missionId": "draft.dp07",
          "sectionId": "pagamento"
        },
        {
          "missionId": "draft.dp07",
          "sectionId": "ex-acao"
        }
      ],
      "dp07.q07": [
        {
          "missionId": "draft.dp07",
          "sectionId": "conceito"
        }
      ],
      "dp07.q08": [
        {
          "missionId": "draft.dp07",
          "sectionId": "oferta"
        },
        {
          "missionId": "draft.dp07",
          "sectionId": "ex-credito"
        },
        {
          "missionId": "draft.dp07",
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
      "item": "Atualidades 4",
      "status": "histórico; referenceOnly"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Conhecimentos Bancários 13",
      "status": "histórico; referenceOnly"
    }
  ],
  "objectives": {
    "O1": "Explicar compartilhamento autorizado no Open Finance.",
    "O2": "Relacionar a denominação histórica Open Banking ao escopo financeiro mais amplo.",
    "O3": "Identificar dados, destinatário, prazo e cancelamento.",
    "O4": "Separar possibilidade de oferta melhor de garantia de crédito.",
    "O5": "Distinguir compartilhamento de dados e execução de pagamento.",
    "O6": "Recuperar a confusão pela seção de ensino e refazer o caso."
  },
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Nomear a confusão e reconstruir o caso após retomar o ensino."
  },
  "limits": [
    "Sem prazo máximo de consentimento, especificações de APIs ou roteiro de operação real.",
    "Cancelamento não é afirmação de eliminação automática de dados ou obrigações.",
    "Casos e números autorais fictícios; não representam operação, oferta ou dado pessoal real.",
    "Sem XP/ordem/desbloqueio ou importação no runtime; não equivale a aceite humano da Fase 2."
  ]
};

export const ARITHMETIC = [];
