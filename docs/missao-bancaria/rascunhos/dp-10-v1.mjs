export const SOURCES = [
  {
    "id": "cmn.dp.correspondentes",
    "label": "CMN — Resolução 4.935/2021",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/exibenormativo?tipo=Resolu%C3%A7%C3%A3o%20CMN&numero=4935",
    "locator": "Arts. 2º, 3º, 12 e 14: atuação contratada, responsabilidade e identificação; art. 8º revogado não utilizado",
    "version": "Versão vigente exibida pelo BCB, atualizada em 01/12/2025",
    "checkedAt": "2026-10-01"
  }
];

export const DP10_DRAFT = {
  "id": "draft.dp10",
  "topicId": "banking.digital-payments",
  "candidateBlockId": "banking.digital-payments",
  "editorialKey": "DP-10",
  "title": "Correspondentes: atendimento por conta da contratante",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Identificar correspondente e instituição contratante.",
  "sourceIds": [
    "cmn.dp.correspondentes"
  ],
  "sections": [
    {
      "id": "papel",
      "type": "explanation",
      "heading": "1. Quem atende e por conta de quem?",
      "body": "Um correspondente presta atividades de atendimento a clientes e usuários da instituição que o contrata, dentro do objeto contratual. Atua por conta e sob diretrizes dessa instituição. O ponto de atendimento não se torna uma agência própria apenas por oferecer esses serviços. Há também correspondência por plataforma eletrônica.",
      "sourceIds": [
        "cmn.dp.correspondentes"
      ]
    },
    {
      "id": "ex-loja",
      "type": "worked-example",
      "heading": "2. Exemplo resolvido: local e função",
      "body": "Uma loja fictícia recebe um pagamento como correspondente do Banco Horizonte, conforme serviço contratado. A loja é o ponto de atendimento contratado; o banco é a instituição contratante. A localização dentro do comércio não transforma a loja em agência própria do banco.",
      "sourceIds": []
    },
    {
      "id": "responsabilidade",
      "type": "explanation",
      "heading": "3. Contratar não elimina responsabilidade",
      "body": "O art. 3º da Resolução CMN 4.935 atribui à contratante responsabilidade integral pelo atendimento prestado por meio do correspondente. Isso não é uma declaração de que outros participantes nunca possam responder por seus atos; o ponto é que a instituição não se exonera simplesmente por terceirizar o atendimento.",
      "sourceIds": [
        "cmn.dp.correspondentes"
      ]
    },
    {
      "id": "ex-responsabilidade",
      "type": "worked-example",
      "heading": "4. Exemplo resolvido: resposta insuficiente",
      "body": "O cliente relata problema em serviço prestado pelo correspondente. A contratante responde: “Não temos responsabilidade alguma porque foi em outra empresa”. Essa justificativa contraria a regra estudada. O caso não exige decidir indenização ou culpa de uma pessoa específica; exige reconhecer a responsabilidade da contratante pelo atendimento.",
      "sourceIds": []
    },
    {
      "id": "propostas",
      "type": "explanation",
      "heading": "5. Encaminhar não é conceder",
      "body": "O contrato pode abranger recepção e envio de propostas de abertura de contas ou crédito, além de outros atendimentos previstos. Receber uma proposta não é garantir aprovação. Nas operações do caso, identifique a instituição concedente, o serviço contratado e a etapa realizada. Não se deve atribuir ao correspondente toda atividade financeira possível.",
      "sourceIds": [
        "cmn.dp.correspondentes"
      ]
    },
    {
      "id": "ex-proposta",
      "type": "worked-example",
      "heading": "6. Exemplo resolvido: pedido em análise",
      "body": "O correspondente recolhe a proposta de empréstimo e a encaminha ao banco, que ainda fará a análise. O fato comprovado é o envio da proposta. Não existe crédito concedido no enunciado; prometer aprovação apenas pela entrega do pedido ignora a etapa pendente.",
      "sourceIds": []
    },
    {
      "id": "identificacao",
      "type": "explanation",
      "heading": "7. Atendimento eletrônico também exige clareza",
      "body": "A norma contempla plataformas como sites e aplicativos. O contrato deve prever divulgação da condição de prestador, identificação da instituição contratante, serviços e canais de contato. O objetivo desta aula é ler quem oferece e responde pelo serviço, sem confundir uma interface com agência ou com autorização irrestrita.",
      "sourceIds": [
        "cmn.dp.correspondentes"
      ]
    },
    {
      "id": "ex-site",
      "type": "worked-example",
      "heading": "8. Exemplo resolvido: a mesma distinção na tela",
      "body": "Um site se identifica como correspondente e informa a instituição contratante. Ele recebe uma proposta nos limites do contrato. Ser digital muda o canal, não elimina os papéis nem transforma a recepção em aprovação. A conferência do caso começa pela identificação de cada participante.",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "Vocabulário essencial",
      "body": "Correspondente: contratado para atividades de atendimento. Contratante: instituição por conta da qual se atua. Proposta: pedido ainda sujeito ao processamento e à análise informados. Plataforma eletrônica: canal digital do correspondente.",
      "sourceIds": []
    },
    {
      "id": "resumo",
      "type": "summary",
      "heading": "Recuperação e síntese",
      "body": "Identifique contratado, contratante e atividade prevista. Separe recepção da proposta e resultado da análise. Se errar, nomeie a confusão, retome o trecho indicado e reconstrua o exemplo com suas palavras. Esta prática exposta não é avaliação independente de retenção.",
      "sourceIds": []
    }
  ],
  "questions": [
    {
      "prompt": "A loja recebe pagamento como correspondente contratado por um banco. Qual leitura é adequada?",
      "options": [
        "A loja é automaticamente agência própria.",
        "Loja e banco deixaram de ter papéis distintos.",
        "A loja atende por conta da contratante no serviço contratado.",
        "A loja passa a conceder qualquer crédito por conta própria."
      ],
      "answer": 2,
      "explanation": "Corresponde à relação descrita.",
      "optionRationales": [
        "Correspondência não equivale a agência própria.",
        "Os papéis continuam distintos.",
        "Corresponde à relação descrita.",
        "O contrato não é autorização irrestrita."
      ],
      "recoverySectionIds": [
        "papel",
        "ex-loja"
      ],
      "objectiveIds": [
        "O1",
        "O2"
      ],
      "id": "dp10.q01"
    },
    {
      "prompt": "A instituição contratante pode afastar toda responsabilidade pelo atendimento apenas porque foi prestado pelo correspondente?",
      "options": [
        "Não; a norma lhe atribui responsabilidade pelo atendimento contratado.",
        "Sim, sempre.",
        "Sim, se a loja tiver outra atividade.",
        "Sim, se houver aplicativo."
      ],
      "answer": 0,
      "explanation": "Aplica o art. 3º sem julgar outras responsabilidades.",
      "optionRationales": [
        "Aplica o art. 3º sem julgar outras responsabilidades.",
        "A terceirização não a exonera.",
        "A atividade comercial não elimina a regra.",
        "O canal eletrônico não elimina a regra."
      ],
      "recoverySectionIds": [
        "responsabilidade",
        "ex-responsabilidade"
      ],
      "objectiveIds": [
        "O3"
      ],
      "id": "dp10.q02"
    },
    {
      "prompt": "A proposta foi recebida e encaminhada para análise do banco. Qual etapa está comprovada?",
      "options": [
        "Liberação do empréstimo.",
        "Aprovação garantida.",
        "Liquidação de toda dívida.",
        "Envio da proposta, sem prova de concessão."
      ],
      "answer": 3,
      "explanation": "Respeita o estágio informado.",
      "optionRationales": [
        "Falta a concessão e liberação.",
        "Análise pendente não assegura aprovação.",
        "Nenhum pagamento de dívida foi descrito.",
        "Respeita o estágio informado."
      ],
      "recoverySectionIds": [
        "propostas",
        "ex-proposta"
      ],
      "objectiveIds": [
        "O4"
      ],
      "id": "dp10.q03"
    },
    {
      "prompt": "O correspondente pode prestar atendimento por plataforma eletrônica no recorte da norma?",
      "options": [
        "Não, somente em papel.",
        "Sim, observadas a contratação e as regras aplicáveis.",
        "Sim, ficando sem contratante.",
        "Sim, dispensando toda identificação."
      ],
      "answer": 1,
      "explanation": "Reconhece o canal sem afastar os requisitos.",
      "optionRationales": [
        "A norma inclui plataforma eletrônica.",
        "Reconhece o canal sem afastar os requisitos.",
        "A relação contratual continua central.",
        "A identificação continua relevante."
      ],
      "recoverySectionIds": [
        "papel",
        "identificacao"
      ],
      "objectiveIds": [
        "O5"
      ],
      "id": "dp10.q04"
    },
    {
      "prompt": "Qual informação ajuda a distinguir os papéis no atendimento?",
      "options": [
        "A condição de correspondente e a identificação da instituição contratante.",
        "Somente a cor do uniforme.",
        "Somente o tamanho da tela.",
        "A suposição de que toda loja é banco."
      ],
      "answer": 0,
      "explanation": "Esclarece por conta de quem o serviço é prestado.",
      "optionRationales": [
        "Esclarece por conta de quem o serviço é prestado.",
        "Não substitui identificação.",
        "É característica da interface.",
        "Generaliza indevidamente."
      ],
      "recoverySectionIds": [
        "identificacao",
        "ex-site"
      ],
      "objectiveIds": [
        "O1",
        "O5"
      ],
      "id": "dp10.q05"
    },
    {
      "prompt": "Responsabilidade da contratante pelo atendimento significa, nesta aula:",
      "options": [
        "Que nenhuma outra pessoa jamais possa responder por atos próprios.",
        "Que todo crédito deve ser aprovado.",
        "Que terceirizar não afasta essa responsabilidade, sem decidir todas as demais responsabilidades.",
        "Que a loja vira banco central."
      ],
      "answer": 2,
      "explanation": "Delimita corretamente o alcance da conclusão.",
      "optionRationales": [
        "A norma estudada não sustenta tal exclusão universal.",
        "Responsabilidade não é aprovação de crédito.",
        "Delimita corretamente o alcance da conclusão.",
        "Não há mudança dessa natureza."
      ],
      "recoverySectionIds": [
        "responsabilidade"
      ],
      "objectiveIds": [
        "O3"
      ],
      "id": "dp10.q06"
    },
    {
      "prompt": "O site do correspondente recebe pedido e informa análise pendente. Qual conclusão seria indevida?",
      "options": [
        "O canal é eletrônico.",
        "O empréstimo já está necessariamente aprovado.",
        "Há etapa posterior informada.",
        "A identificação da contratante continua importante."
      ],
      "answer": 1,
      "explanation": "Confunde recepção com concessão.",
      "optionRationales": [
        "É um dado do caso.",
        "Confunde recepção com concessão.",
        "A análise permanece pendente.",
        "O canal não elimina os papéis."
      ],
      "recoverySectionIds": [
        "ex-proposta",
        "ex-site"
      ],
      "objectiveIds": [
        "O4",
        "O5"
      ],
      "id": "dp10.q07"
    },
    {
      "prompt": "Quem confundiu ponto de atendimento com agência própria deve:",
      "options": [
        "Ignorar a relação contratual.",
        "Escolher pelo endereço físico apenas.",
        "Supor que todo atendente concede crédito.",
        "Reconstruir contratado, contratante, serviço e etapa do atendimento."
      ],
      "answer": 3,
      "explanation": "Recupera os papéis e limites.",
      "optionRationales": [
        "A relação é central para a distinção.",
        "Endereço não define a natureza.",
        "A recepção não garante concessão.",
        "Recupera os papéis e limites."
      ],
      "recoverySectionIds": [
        "papel",
        "propostas",
        "resumo"
      ],
      "objectiveIds": [
        "O6"
      ],
      "id": "dp10.q08"
    }
  ],
  "recall": [
    "Identifique contratado, contratante e atividade prevista.",
    "Separe recepção da proposta e resultado da análise."
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "dp10-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "dp10.q01": [
        {
          "missionId": "draft.dp10",
          "sectionId": "papel"
        },
        {
          "missionId": "draft.dp10",
          "sectionId": "ex-loja"
        }
      ],
      "dp10.q02": [
        {
          "missionId": "draft.dp10",
          "sectionId": "responsabilidade"
        },
        {
          "missionId": "draft.dp10",
          "sectionId": "ex-responsabilidade"
        }
      ],
      "dp10.q03": [
        {
          "missionId": "draft.dp10",
          "sectionId": "propostas"
        },
        {
          "missionId": "draft.dp10",
          "sectionId": "ex-proposta"
        }
      ],
      "dp10.q04": [
        {
          "missionId": "draft.dp10",
          "sectionId": "papel"
        },
        {
          "missionId": "draft.dp10",
          "sectionId": "identificacao"
        }
      ],
      "dp10.q05": [
        {
          "missionId": "draft.dp10",
          "sectionId": "identificacao"
        },
        {
          "missionId": "draft.dp10",
          "sectionId": "ex-site"
        }
      ],
      "dp10.q06": [
        {
          "missionId": "draft.dp10",
          "sectionId": "responsabilidade"
        }
      ],
      "dp10.q07": [
        {
          "missionId": "draft.dp10",
          "sectionId": "ex-proposta"
        },
        {
          "missionId": "draft.dp10",
          "sectionId": "ex-site"
        }
      ],
      "dp10.q08": [
        {
          "missionId": "draft.dp10",
          "sectionId": "papel"
        },
        {
          "missionId": "draft.dp10",
          "sectionId": "propostas"
        },
        {
          "missionId": "draft.dp10",
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
      "item": "Atualidades 11",
      "status": "histórico; referenceOnly"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Conhecimentos Bancários 11",
      "status": "histórico; referenceOnly"
    }
  ],
  "objectives": {
    "O1": "Identificar correspondente e instituição contratante.",
    "O2": "Separar atendimento contratado de agência própria.",
    "O3": "Reconhecer responsabilidade da contratante pelo atendimento.",
    "O4": "Distinguir encaminhamento de proposta e concessão de crédito.",
    "O5": "Reconhecer possibilidade de atendimento eletrônico com identificação adequada.",
    "O6": "Recuperar a confusão pela seção de ensino e refazer o caso."
  },
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Nomear a confusão e reconstruir o caso após retomar o ensino."
  },
  "limits": [
    "Recorte dos arts. 2º, 3º, 12 e 14 da Resolução CMN 4.935 vigente; sem limites de câmbio ou enumeração integral de requisitos.",
    "Art. 8º revogado em 2025 não utilizado; não é orientação para caso concreto.",
    "Casos e números autorais fictícios; não representam operação, oferta ou dado pessoal real.",
    "Sem XP/ordem/desbloqueio ou importação no runtime; não equivale a aceite humano da Fase 2."
  ]
};

export const ARITHMETIC = [];
