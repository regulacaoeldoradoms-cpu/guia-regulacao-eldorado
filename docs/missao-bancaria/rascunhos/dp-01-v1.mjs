// Rascunho local isolado; não importar no runtime. Sincronizado com dp-01-v1.md.
export const SOURCES = [
  {
    "id": "bcb.conta.deposito",
    "label": "BCB — Conta bancária (corrente ou poupança)",
    "url": "https://www.bcb.gov.br/meubc/faqs/p/o-que-e-conta-de-depositos",
    "version": "FAQ atualizada em 26/03/2024; consultada em 30/09/2026",
    "locator": "Resposta oficial completa no recorte indicado",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "bcb.conta.digital",
    "label": "BCB — Conta digital ou eletrônica",
    "url": "https://www.bcb.gov.br/meubc/faqs/p/o-que-e-conta-digital-ou-eletronica",
    "version": "FAQ atualizada em 26/03/2024; consultada em 30/09/2026",
    "locator": "Resposta oficial completa no recorte indicado",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "bcb.conta.pagamento",
    "label": "BCB — Tipos de conta de pagamento",
    "url": "https://www.bcb.gov.br/meubc/faqs/p/quais-sao-os-tipos-de-conta-de-pagamento",
    "version": "FAQ atualizada em 31/01/2023; consultada em 30/09/2026",
    "locator": "Resposta oficial completa no recorte indicado",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "caixa.dp.canais",
    "label": "CAIXA — App CAIXA e Internet Banking CAIXA",
    "url": "https://www.caixa.gov.br/atendimento/canais-digitais/app-caixa-internet-banking/Paginas/default.aspx",
    "version": "Página institucional consultada em 01/10/2026, 01:50 UTC",
    "locator": "O que são os canais e exemplos de serviços; sem reproduzir procedimentos, limites ou versão Beta",
    "checkedAt": "2026-10-01"
  }
];

export const DP01_DRAFT = {
  "id": "draft.dp01",
  "topicId": "draft.dp01",
  "editorialKey": "DP-01",
  "candidateBlockId": "banking.digital-payments",
  "title": "Internet e mobile banking: canal, operação e instituição",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Separar os meios de acesso da operação, do produto e da instituição, respeitando os dados informados.",
  "sourceIds": [
    "bcb.conta.deposito",
    "bcb.conta.digital",
    "bcb.conta.pagamento",
    "caixa.dp.canais"
  ],
  "sections": [
    {
      "id": "camadas",
      "heading": "1. Cinco perguntas antes da resposta",
      "body": "Um telefone pode mostrar várias informações bancárias. Para entender um caso, pergunte: quem presta o serviço? Qual produto ou conta está envolvido? O que o cliente fez? Por qual canal? Em qual dispositivo?\n\n**Instituição** é a entidade responsável no caso. **Produto** é o objeto oferecido ou contratado, como uma conta ou um empréstimo. **Operação** é a ação, como consultar saldo ou solicitar um pagamento. **Canal** é o meio de interação. **Dispositivo** é o aparelho, como computador, tablet ou telefone. Essas respostas não são intercambiáveis.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "canais",
      "heading": "2. Navegador e aplicativo",
      "body": "Internet banking designa o acesso a serviços bancários pela internet; no contraste didático usado aqui, o enunciado identificará o acesso pelo site em um navegador. Mobile banking destaca o uso de dispositivo móvel, frequentemente por aplicativo. São dimensões relacionadas: um aplicativo bancário também usa a internet, e um telefone também pode abrir um site no navegador.\n\nPor isso, uma questão que exige distinguir site e aplicativo deve informar qual foi usado. A frase “usou o celular” é insuficiente para afirmar que houve uso de aplicativo. Ler os detalhes evita transformar uma associação frequente em regra absoluta.",
      "type": "explanation",
      "sourceIds": [
        "caixa.dp.canais"
      ]
    },
    {
      "id": "ex-canais",
      "heading": "3. Exemplo resolvido: uma conta, dois acessos",
      "body": "Lia consulta a mesma conta no site do Banco Horizonte, usando um navegador no computador. Depois abre o aplicativo do mesmo banco no telefone e consulta novamente. O caso informa uma conta e uma instituição, acessadas por dois meios. A troca de canal não cria automaticamente uma segunda conta nem uma segunda instituição.\n\nSe Lia tivesse aberto o site pelo navegador do telefone, o dispositivo seria móvel, mas o caso continuaria descrevendo acesso ao site. Não seria correto inventar a abertura do aplicativo.",
      "type": "worked-example",
      "sourceIds": [
        "caixa.dp.canais"
      ]
    },
    {
      "id": "estados",
      "heading": "4. O verbo e o estado da operação importam",
      "body": "Consultar saldo significa obter informação. Não significa, por si só, transferir recursos. Preencher os dados de uma operação é uma etapa distinta de sua conclusão. Um agendamento informa uma execução pretendida para a data indicada, sujeita às condições aplicáveis; não comprova que a execução futura já ocorreu.\n\nNos exercícios, use apenas o estado informado: consulta, solicitação, agendamento ou execução confirmada. Se o caso não informa a confirmação, não a presuma. Não vamos deduzir o comportamento de um aplicativo real nem seus prazos.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "ex-estados",
      "heading": "5. Exemplo resolvido: intenção não é execução",
      "body": "Rui preenche os dados de um pagamento no aplicativo. O caso informa que ele saiu antes da confirmação e que nenhuma operação foi registrada. Houve preparação da solicitação, mas não pagamento concluído. A resposta decorre desses dados explícitos, não de uma suposta regra de todos os aplicativos.\n\nEm outro caso, a tela registra “agendado para amanhã”. A conclusão segura é a existência de agendamento. Para afirmar que o pagamento foi executado, é necessário esse dado adicional.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "produto",
      "heading": "6. A aparência não define a conta",
      "body": "O BCB explica que “conta digital” descreve uma forma de relacionamento e não constitui, por si só, uma modalidade regulatória de conta. É preciso identificar se o produto é, por exemplo, conta de depósitos ou conta de pagamento. O acesso por aplicativo não elimina essa distinção ensinada em PC-01.\n\nO canal também não basta para concluir que todo serviço é gratuito, que existe crédito aprovado ou que uma oferta foi contratada. Para essas conclusões, o exercício precisa informar produto, condições e ação efetivamente realizada.",
      "type": "explanation",
      "sourceIds": [
        "bcb.conta.deposito",
        "bcb.conta.digital",
        "bcb.conta.pagamento"
      ]
    },
    {
      "id": "ex-produto",
      "heading": "7. Exemplo resolvido: duas telas parecidas",
      "body": "O serviço Alfa e o serviço Beta permitem consultar valores em um aplicativo. O contrato fictício de Alfa identifica uma conta de depósitos; o de Beta, uma conta de pagamento. A semelhança das telas não altera os produtos informados. Se o enunciado mostrasse apenas as telas, sem identificar os produtos, faltaria informação para essa classificação.",
      "type": "worked-example",
      "sourceIds": [
        "bcb.conta.deposito",
        "bcb.conta.digital",
        "bcb.conta.pagamento"
      ]
    },
    {
      "id": "responsavel",
      "heading": "8. Quem responde pela atividade descrita?",
      "body": "Uma marca, um aplicativo e a instituição responsável não são automaticamente a mesma informação. Leia quem presta cada serviço no caso. Uma tela pode permitir consultar diferentes produtos; isso não transfere, por si só, todas as obrigações para um único participante. Retome a distinção entre canal e responsável vista em CE-07 e entre plataforma e emissor vista em CE-05.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "ex-responsavel",
      "heading": "9. Exemplo resolvido: a informação que falta",
      "body": "Um anúncio fictício informa apenas “resolva sua vida financeira no app Nuvem”. Ele não identifica a natureza da conta nem quem assume cada obrigação. O nome do aplicativo permite identificar a interface anunciada; não basta para afirmar que Nuvem é um banco ou devedor de todos os produtos oferecidos. A resposta correta aponta os dados faltantes, em vez de inventá-los.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "resumo",
      "heading": "10. Recuperação e resumo",
      "body": "Escreva cinco campos: instituição, produto, operação, canal e dispositivo. Marque “não informado” onde faltarem dados. Depois registre o estado da operação. Se errou, nomeie a troca: “confundi canal com produto”, “confundi aparelho com aplicativo” ou “confundi agendamento com execução”. Retome a seção correspondente e refaça o exemplo antes de tentar novamente. Esta prática é exposta; acerto repetido não comprova retenção duradoura.",
      "type": "summary",
      "sourceIds": []
    }
  ],
  "questions": [
    {
      "id": "dp01.q01",
      "prompt": "Lia consulta a mesma conta do Banco Horizonte pelo site no computador e, depois, pelo aplicativo no telefone. Qual conclusão corresponde ao caso?",
      "options": [
        "Ela necessariamente abriu duas contas.",
        "Ela consultou uma conta por dois meios de acesso.",
        "O aplicativo transformou a conta em empréstimo.",
        "O telefone tornou o prestador um banco diferente."
      ],
      "answer": 1,
      "explanation": "preserva produto e instituição e reconhece os acessos descritos.",
      "optionRationales": [
        "o caso informa a mesma conta, não nova abertura.",
        "preserva produto e instituição e reconhece os acessos descritos.",
        "mudar o acesso não contrata nem transforma o produto.",
        "dispositivo não cria outra instituição."
      ],
      "objectiveIds": [
        "O1",
        "O2"
      ],
      "recoverySectionIds": [
        "camadas",
        "ex-canais"
      ]
    },
    {
      "id": "dp01.q02",
      "prompt": "O único dado é “Davi consultou seu saldo usando um telefone”. O que falta para afirmar que ele usou o aplicativo do banco?",
      "options": [
        "A cor do telefone.",
        "O valor do saldo.",
        "A identificação do meio de acesso, pois ele poderia ter usado um navegador.",
        "Nada: todo acesso bancário em telefone é obrigatoriamente por aplicativo."
      ],
      "answer": 2,
      "explanation": "distingue aparelho de meio de acesso e reconhece a hipótese não informada.",
      "optionRationales": [
        "a cor não identifica o software usado.",
        "o valor não esclarece o canal.",
        "distingue aparelho de meio de acesso e reconhece a hipótese não informada.",
        "um telefone também pode acessar sites."
      ],
      "objectiveIds": [
        "O2"
      ],
      "recoverySectionIds": [
        "canais",
        "ex-canais"
      ]
    },
    {
      "id": "dp01.q03",
      "prompt": "O caso informa apenas que Sara consultou o saldo, sem realizar outra operação. Qual conclusão é válida?",
      "options": [
        "A consulta, sozinha, comprova uma transferência.",
        "A consulta contrata um empréstimo.",
        "A consulta fecha a conta.",
        "Sara obteve uma informação; não há transferência informada."
      ],
      "answer": 3,
      "explanation": "respeita a ação e os limites do caso.",
      "optionRationales": [
        "confunde consulta com movimentação.",
        "não há contratação de crédito descrita.",
        "não existe encerramento informado.",
        "respeita a ação e os limites do caso."
      ],
      "objectiveIds": [
        "O1",
        "O3"
      ],
      "recoverySectionIds": [
        "camadas",
        "estados"
      ]
    },
    {
      "id": "dp01.q04",
      "prompt": "Rui preencheu os dados de um pagamento e saiu antes de confirmar. O enunciado informa expressamente que nenhuma operação foi registrada. O que ocorreu?",
      "options": [
        "Preparação, sem pagamento concluído no caso.",
        "Pagamento concluído, porque os campos estavam preenchidos.",
        "Agendamento automático, embora não informado.",
        "Transferência obrigatória para outra instituição."
      ],
      "answer": 0,
      "explanation": "usa o estado explicitamente informado.",
      "optionRationales": [
        "usa o estado explicitamente informado.",
        "preenchimento não supera a informação de ausência de registro.",
        "inventa um agendamento.",
        "inventa execução e destino."
      ],
      "objectiveIds": [
        "O3"
      ],
      "recoverySectionIds": [
        "estados",
        "ex-estados"
      ]
    },
    {
      "id": "dp01.q05",
      "prompt": "Um anúncio chama o produto de “conta digital”, mas não informa sua modalidade. Qual atitude interpreta corretamente essa expressão?",
      "options": [
        "Concluir que ela é necessariamente uma conta de pagamento.",
        "Identificar o produto e suas condições; o rótulo digital não determina sozinho a modalidade.",
        "Concluir que todo serviço é gratuito.",
        "Concluir que todo saldo é limite de crédito."
      ],
      "answer": 1,
      "explanation": "distingue relacionamento digital da natureza do produto.",
      "optionRationales": [
        "o rótulo não determina essa classificação.",
        "distingue relacionamento digital da natureza do produto.",
        "faltam condições de tarifação; o canal não as resolve.",
        "confunde recursos e crédito, já separados em PC-01."
      ],
      "objectiveIds": [
        "O4"
      ],
      "recoverySectionIds": [
        "produto",
        "ex-produto"
      ]
    },
    {
      "id": "dp01.q06",
      "prompt": "Uma confirmação fictícia informa “pagamento agendado para amanhã”, sem dado posterior. O que ela comprova?",
      "options": [
        "Que a execução de amanhã já ocorreu.",
        "Que não houve qualquer agendamento.",
        "Que existe agendamento, sem comprovar execução futura.",
        "Que todas as condições futuras já estão garantidas."
      ],
      "answer": 2,
      "explanation": "preserva a diferença entre agendar e executar.",
      "optionRationales": [
        "antecipa uma execução não informada.",
        "contradiz o registro do caso.",
        "preserva a diferença entre agendar e executar.",
        "acrescenta garantia ausente."
      ],
      "objectiveIds": [
        "O3"
      ],
      "recoverySectionIds": [
        "estados",
        "ex-estados"
      ]
    },
    {
      "id": "dp01.q07",
      "prompt": "Um anúncio mostra apenas o nome do app Nuvem e a frase “serviços financeiros”. Qual informação é necessária para atribuir a responsabilidade por um produto específico?",
      "options": [
        "O tamanho do ícone.",
        "A quantidade de telas.",
        "A marca do telefone.",
        "A identificação do prestador e do produto e das obrigações descritas."
      ],
      "answer": 3,
      "explanation": "busca as informações pertinentes sem classificar o app por suposição.",
      "optionRationales": [
        "aparência não identifica obrigação.",
        "número de telas não define o prestador.",
        "o fabricante do aparelho não resolve a responsabilidade pelo produto.",
        "busca as informações pertinentes sem classificar o app por suposição."
      ],
      "objectiveIds": [
        "O1",
        "O4"
      ],
      "recoverySectionIds": [
        "responsavel",
        "ex-responsavel"
      ]
    },
    {
      "id": "dp01.q08",
      "prompt": "Uma pessoa concluiu que duas contas tinham a mesma modalidade apenas porque ambas eram acessadas por aplicativo. Qual recuperação é mais útil?",
      "options": [
        "Separar canal de produto e reler a modalidade informada para cada conta.",
        "Memorizar que todo aplicativo oferece um único tipo de conta.",
        "Ignorar os contratos e comparar apenas as cores das telas.",
        "Trocar “aplicativo” por “telefone” sem rever o raciocínio."
      ],
      "answer": 0,
      "explanation": "corrige a confusão específica, apoiando-se no dado relevante.",
      "optionRationales": [
        "corrige a confusão específica, apoiando-se no dado relevante.",
        "transforma a mesma inferência incorreta em regra geral.",
        "troca informação do produto por aparência.",
        "altera a palavra, mas mantém a confusão entre acesso e produto."
      ],
      "objectiveIds": [
        "O4",
        "O5"
      ],
      "recoverySectionIds": [
        "produto",
        "ex-produto",
        "resumo"
      ]
    }
  ],
  "recall": [
    "Explique as cinco perguntas: instituição, produto, operação, canal e dispositivo.",
    "Diferencie consulta, agendamento e execução confirmada num caso fictício.",
    "Nomeie a confusão e retome a seção indicada antes de repetir a questão."
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "dp01-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "dp01.q01": [
        {
          "missionId": "draft.dp01",
          "sectionId": "camadas"
        },
        {
          "missionId": "draft.dp01",
          "sectionId": "ex-canais"
        }
      ],
      "dp01.q02": [
        {
          "missionId": "draft.dp01",
          "sectionId": "canais"
        },
        {
          "missionId": "draft.dp01",
          "sectionId": "ex-canais"
        }
      ],
      "dp01.q03": [
        {
          "missionId": "draft.dp01",
          "sectionId": "camadas"
        },
        {
          "missionId": "draft.dp01",
          "sectionId": "estados"
        }
      ],
      "dp01.q04": [
        {
          "missionId": "draft.dp01",
          "sectionId": "estados"
        },
        {
          "missionId": "draft.dp01",
          "sectionId": "ex-estados"
        }
      ],
      "dp01.q05": [
        {
          "missionId": "draft.dp01",
          "sectionId": "produto"
        },
        {
          "missionId": "draft.dp01",
          "sectionId": "ex-produto"
        }
      ],
      "dp01.q06": [
        {
          "missionId": "draft.dp01",
          "sectionId": "estados"
        },
        {
          "missionId": "draft.dp01",
          "sectionId": "ex-estados"
        }
      ],
      "dp01.q07": [
        {
          "missionId": "draft.dp01",
          "sectionId": "responsavel"
        },
        {
          "missionId": "draft.dp01",
          "sectionId": "ex-responsavel"
        }
      ],
      "dp01.q08": [
        {
          "missionId": "draft.dp01",
          "sectionId": "produto"
        },
        {
          "missionId": "draft.dp01",
          "sectionId": "ex-produto"
        },
        {
          "missionId": "draft.dp01",
          "sectionId": "resumo"
        }
      ]
    }
  }
};

export const EDITORIAL = {
  "stage": "Rascunho local fora do catálogo; revisão pedagógica independente pendente",
  "referenceOnlyProfiles": [
    {
      "id": "bb.agente-comercial.2022-001",
      "item": "Atualidades do Mercado Financeiro 2/3; p.33",
      "status": "histórico; referenceOnly"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Conhecimentos Bancários 5/6; Anexo IV pp.33–34",
      "status": "histórico; referenceOnly"
    }
  ],
  "objectives": {
    "O1": "Distinguir canal, dispositivo, operação, produto e instituição.",
    "O2": "Interpretar navegador/aplicativo sem inferir somente pelo aparelho.",
    "O3": "Distinguir consulta, solicitação, agendamento e execução com dados explícitos.",
    "O4": "Reconhecer informações insuficientes sobre conta, condições e responsável.",
    "O5": "Identificar a confusão e recuperar o conceito pelo trecho de ensino."
  },
  "recovery": {
    "objectiveId": "O5",
    "instruction": "Nomear a confusão, reler o trecho de origem e reconstruir o exemplo."
  },
  "limits": [
    "Não descreve operações de aplicativos reais; casos fictícios e distinções conceituais.",
    "CAIXA: terminologia e exemplos gerais de canais conferidos em 01/10/2026; sem transcrever procedimentos de cadastro, autenticação ou limites.",
    "Sem valores, limites, tarifas, crédito real, XP/ordem/desbloqueio produtivo ou alteração de permissões.",
    "BCB reutilizado de PC-01, verificação de 30/09/2026 preservada; edital BB conferido pontualmente em 01/10/2026.",
    "Prática exposta, não avaliação independente nem aceite humano da Fase 2."
  ]
};

export const ARITHMETIC = [];
