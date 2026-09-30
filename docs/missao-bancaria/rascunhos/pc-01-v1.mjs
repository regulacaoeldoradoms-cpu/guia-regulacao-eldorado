// Rascunho editorial isolado; não importar no runtime.
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
    "id": "bcb.conta.salario",
    "label": "BCB — O que é conta-salário",
    "url": "https://www.bcb.gov.br/meubc/faqs/p/o-que-e-conta-salario",
    "version": "FAQ atualizada em 31/01/2023; consultada em 30/09/2026",
    "locator": "Resposta oficial completa no recorte indicado",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "cmn.4753",
    "label": "CMN — Resolução 4.753, contas de depósitos",
    "url": "https://normativos.bcb.gov.br/Lists/Normativos/Attachments/50847/Res_4753_v6_L.pdf",
    "version": "Texto vigente compilado v6, incluindo alterações de 2025; consultado em 30/09/2026",
    "locator": "Arts. 2º, 2º-A, 3º, 4º e 5º",
    "checkedAt": "2026-09-30"
  }
];

export const PC01_DRAFT = {
  "id": "draft.pc01",
  "topicId": "draft.pc01",
  "editorialKey": "PC-01",
  "candidateBlockId": "banking.products-credit",
  "title": "Conta, saldo e serviços",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Distinguir tipos de conta, canal e serviços; interpretar extrato fictício e separar recursos em conta de limite de crédito; reconhecer informações de identificação e contrato que faltam.",
  "sourceIds": [
    "bcb.conta.deposito",
    "bcb.conta.digital",
    "bcb.conta.pagamento",
    "bcb.conta.salario",
    "cmn.4753"
  ],
  "sections": [
    {
      "id": "inicio",
      "type": "explanation",
      "heading": "1. Conta, movimentação e serviço não são a mesma coisa",
      "body": "Uma conta permite registrar e acompanhar uma relação com a instituição: entradas, saídas e valores associados ao titular, conforme seu tipo e contrato. Titular é a pessoa em cujo nome ela está. Uma transferência é uma movimentação; consultar extrato é um serviço. O aplicativo é um canal de acesso: seu visual não revela sozinho o tipo da conta. Antes desta aula, retome [pessoas e representação](pc-01a-v1.md#documentos) quando houver alguém agindo por outra pessoa. Todos os extratos, nomes e valores seguintes são fictícios e simplificados, sem dados pessoais.",
      "sourceIds": []
    },
    {
      "id": "tipos",
      "type": "explanation",
      "heading": "2. Reconheça o tipo pelo funcionamento",
      "body": "Conta corrente é conta de depósitos à vista: serve à movimentação de recursos, como pagamentos e transferências. Poupança também é conta de depósitos, voltada a guardar valores com remuneração conforme regras próprias. Não estudaremos aqui a fórmula do rendimento. Conta de pagamento pré-paga usa valores previamente colocados pelo cliente; a pós-paga permite transações sem aporte prévio, como no cartão de crédito. Pré-paga e pós-paga descrevem quando se fornecem recursos, não quem é o titular.\n\nConta-salário decorre da contratação do serviço de pagamento pelo empregador: recebe créditos dele, e não depósitos livres de outras origens. Receber salário em uma conta corrente comum não a transforma, por si, em conta-salário. Já conta digital é um nome popular associado ao canal eletrônico; pode corresponder a conta de depósitos ou de pagamento. São classificações diferentes: tipo da conta e forma de acesso.",
      "sourceIds": [
        "bcb.conta.deposito",
        "bcb.conta.pagamento",
        "bcb.conta.salario",
        "bcb.conta.digital"
      ]
    },
    {
      "id": "exemplo-tipos",
      "type": "worked-example",
      "heading": "3. Exemplo resolvido: duas telas parecidas",
      "body": "Casos fictícios. A instituição descreve o produto de Ana como conta de depósitos à vista, movimentada pelo aplicativo. O de Beto é conta de pagamento pré-paga, usada com valores previamente aportados. Passo 1: os dois usam um aplicativo. Passo 2: leia o tipo declarado e a origem dos recursos, não apenas a aparência da tela. Passo 3: Ana tem conta corrente com acesso digital; Beto tem conta de pagamento pré-paga. Não há base para dizer que os produtos são juridicamente idênticos porque ambos permitem pagar. O exemplo não compara garantias, rendimento ou tarifa.",
      "sourceIds": [
        "bcb.conta.deposito",
        "bcb.conta.pagamento",
        "bcb.conta.digital"
      ]
    },
    {
      "id": "extrato",
      "type": "explanation",
      "heading": "4. Como ler entradas, saídas e saldo",
      "body": "Extrato é o registro das movimentações de um período. No nosso extrato didático, entrada soma e saída subtrai: saldo final = saldo inicial + entradas − saídas. A descrição informa o evento, como depósito, transferência ou pagamento. A palavra crédito pode indicar apenas um lançamento de entrada; não prova que a origem seja um empréstimo. Para saber a origem, leia a descrição. Um empréstimo efetivamente recebido aumenta o saldo, mas cria obrigação de devolução: entrada não é sinônimo de renda.\n\nObserve a data e o estado da operação. Agendado não significa já realizado. Nos exemplos, só entram no cálculo operações expressamente efetivadas; não há bloqueios, valores em compensação, estornos ou tarifas omitidas. Em um extrato real, esses dados precisam ser examinados, e o nome usado para cada saldo pode variar.",
      "sourceIds": []
    },
    {
      "id": "exemplo-extrato",
      "type": "worked-example",
      "heading": "5. Exemplo resolvido: confira cada linha",
      "body": "Extrato fictício e completo para o cálculo: saldo inicial R$400; depósito efetivado de R$250; pagamento efetivado de R$180; transferência enviada e efetivada de R$70. Passo 1: 400 + 250 = 650. Passo 2: 650 − 180 = 470. Passo 3: 470 − 70 = 400. Saldo final: R$400. Uma transferência de R$90 aparece somente agendada para o dia seguinte; não foi debitada neste saldo. Se ela for efetivada depois, sem outra movimentação, o saldo será 400 − 90 = R$310. A previsão não reescreve o extrato atual.",
      "sourceIds": []
    },
    {
      "id": "saldo-limite",
      "type": "explanation",
      "heading": "6. Separe recursos em conta de crédito disponível",
      "body": "Um limite de crédito é uma possibilidade de usar recursos emprestados nas condições contratadas. Não é dinheiro próprio recebido como renda. Em nossa tela fictícia, saldo de recursos sem crédito e limite não utilizado aparecem separados. Some-os apenas se a pergunta pedir capacidade de movimentação incluindo crédito e informar que o limite está disponível para aquele ato; não chame o total de saldo próprio. Quando o pagamento supera os recursos sem crédito e o contrato cobre a diferença, há uso de crédito. PC-02 ensinará as partes e obrigações; PC-03 retomará o cheque especial. Esta aula não presume crédito automático para qualquer conta.",
      "sourceIds": []
    },
    {
      "id": "exemplo-limite",
      "type": "worked-example",
      "heading": "7. Exemplo resolvido: o total da tela não é renda",
      "body": "Caso fictício: saldo sem crédito R$200; limite de crédito não utilizado R$600. A tela mostra R$800 como total incluindo limite, com essa composição explícita. Um pagamento de R$350 é autorizado, usando primeiro os R$200 e depois o limite contratado. Passo 1: recursos sem crédito são R$200, não R$800. Passo 2: a falta é 350 − 200 = R$150. Passo 3: R$150 de crédito foram utilizados e deverão ser pagos conforme o contrato. Antes de encargos e sem outros movimentos, restam R$450 do limite não utilizado. Não invente um saldo positivo de R$450: esse número é crédito ainda disponível.",
      "sourceIds": []
    },
    {
      "id": "abertura",
      "type": "explanation",
      "heading": "8. Identificação, representação e contrato",
      "body": "Para contas de depósitos, a Resolução CMN 4.753 exige verificar e validar identidade, qualificação e autenticidade das informações dos titulares e, quando cabível, representantes. Qualificação reúne informações para conhecer o perfil do cliente, inclusive sua capacidade econômico-financeira; não é o mesmo que apresentar só um nome. Se houver pessoa incapaz, também se identifica e qualifica quem a assiste ou representa. Os dados devem ser atualizados. Não existe, neste recorte, uma lista que autorize concluir “qualquer conta pode ser aberta apenas com estes dois documentos”.\n\nA norma admite solicitação pelos canais oferecidos para essa finalidade, inclusive eletrônicos, mas exclui telefonia por voz. O contrato deve explicar funcionamento, movimentação, tarifas, segurança, direitos e deveres; deve ser disponibilizada uma via e, antes da contratação, um prospecto de informações essenciais. A norma atual também exige consulta ao sistema previsto na Resolução BCB 475 antes de abrir conta à vista/poupança e de alterar titulares ou representantes; o procedimento completo e suas exceções não são ensinados aqui. Portanto, esta aula não é um roteiro completo de abertura nem garante aprovação do pedido.",
      "sourceIds": [
        "cmn.4753"
      ]
    },
    {
      "id": "exemplo-documentos",
      "type": "worked-example",
      "heading": "9. Exemplo resolvido: identificar não é conceder poderes",
      "body": "Caso fictício: um adulto apresenta sua identificação e pede conta de depósitos em nome de uma sociedade. O relato não informa seus poderes para representá-la. Passo 1: a identificação responde quem ele é. Passo 2: isso não demonstra poder para agir em nome da sociedade; retome [o exemplo de representação](pc-01a-v1.md#exemplo-pessoas). Passo 3: falta comprovar a qualidade e os poderes pertinentes, além dos demais controles de abertura. Mesmo um cadastro completo não significa concessão automática de cartão de crédito ou empréstimo. A conta e esses produtos têm condições próprias.",
      "sourceIds": [
        "cmn.4753"
      ]
    },
    {
      "id": "servicos",
      "type": "explanation",
      "heading": "10. O serviço deve ser lido junto com a conta",
      "body": "Uma conta pode oferecer pagamentos, transferências, saques e consulta a extratos nos termos aplicáveis. Canal, limite de movimentação, disponibilidade e cobrança precisam ser verificados: não se conclui que tudo é gratuito ou ilimitado porque existe um aplicativo. Este recorte não lista franquias de serviços essenciais nem valores de tarifas. A informação contratual deve explicar as regras de movimentação e cobrança. Da mesma forma, parar de usar a conta não equivale a comunicar seu encerramento; a norma prevê providências para fechar a relação e tratar saldo, compromissos e produtos vinculados. Aqui reconhecemos essa distinção, sem ensinar todo o procedimento.",
      "sourceIds": [
        "cmn.4753"
      ]
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "11. Consulta rápida",
      "body": "Titular: pessoa em cujo nome está a conta. Canal: meio de acesso ou atendimento. Extrato: registro de movimentações. Entrada/saída: lançamento que acrescenta/retira valor no exemplo. Saldo: posição resultante, com seu critério e data. Limite de crédito: recursos que podem ser emprestados conforme contrato. Agendamento: ordem para execução futura, distinta de lançamento efetivado. Qualificação: informações necessárias para conhecer o perfil do cliente.",
      "sourceIds": []
    },
    {
      "id": "resumo",
      "type": "summary",
      "heading": "12. Antes das questões",
      "body": "Reconstrua o extrato sem olhar os passos. Depois explique por que saldo, crédito não utilizado e total incluindo crédito respondem a perguntas diferentes. Por fim, compare tipo da conta, canal eletrônico e serviço, usando Ana e Beto. Se errar, recupere a seção indicada e escreva o motivo da correção; a prática não mede prontidão para concurso nem substitui análise de uma conta real.",
      "sourceIds": []
    }
  ],
  "recall": [
    "Explique sem consultar por que conta digital não define o tipo de conta e por que limite não é renda. Confira tipos e saldo-limite.",
    "Reconstrua o extrato do exemplo, linha por linha; depois separe saldo efetivado e compromisso futuro. Confira exemplo-extrato.",
    "Escolha um erro, releia os recoverySectionIds, nomeie a confusão e reescreva a justificativa antes de consultar o comentário. Em nova sessão, reconstrua o caso sem olhar. Isso não altera política adaptativa nem presume domínio."
  ],
  "questions": [
    {
      "id": "pc01.q01",
      "topicId": "draft.pc01",
      "prompt": "Um produto fictício é descrito no contrato como conta de depósitos à vista, acessada por aplicativo. Qual classificação é sustentada?",
      "options": [
        "Conta-salário, porque todo aplicativo recebe salários.",
        "Conta de pagamento pós-paga, porque é digital.",
        "Conta corrente com canal eletrônico.",
        "Poupança, porque mantém saldo."
      ],
      "answer": 2,
      "explanation": "O tipo informado é depósitos à vista; aplicativo descreve acesso.",
      "optionRationales": [
        "Não há contratação de conta-salário descrita.",
        "Canal digital não define pós-pagamento.",
        "Combina tipo e canal sem confundi-los.",
        "Saldo não transforma conta corrente em poupança."
      ],
      "recoverySectionIds": [
        "tipos",
        "exemplo-tipos"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "pc01.q02",
      "topicId": "draft.pc01",
      "prompt": "Na conta de pagamento fictícia, só se realizam transações com valores previamente aportados pelo cliente. Qual característica aparece?",
      "options": [
        "Pré-paga.",
        "Pós-paga obrigatoriamente.",
        "Crédito ilimitado.",
        "Conta-salário por definição."
      ],
      "answer": 0,
      "explanation": "O aporte anterior à transação caracteriza a modalidade pré-paga.",
      "optionRationales": [
        "Aplica o critério ensinado.",
        "Inverte o momento do aporte.",
        "Aporte prévio não informa concessão de crédito.",
        "Origem de conta-salário não foi informada."
      ],
      "recoverySectionIds": [
        "tipos",
        "exemplo-tipos"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "pc01.q03",
      "topicId": "draft.pc01",
      "prompt": "Extrato fictício sem outros movimentos: saldo inicial R$300, entrada efetivada R$200 e saída efetivada R$120. Qual saldo resulta?",
      "options": [
        "R$620.",
        "R$180.",
        "R$500.",
        "R$380."
      ],
      "answer": 3,
      "explanation": "300 + 200 = 500; 500 − 120 = 380.",
      "optionRationales": [
        "Soma a saída em vez de subtrair.",
        "Ignora a entrada.",
        "Ignora a saída.",
        "Considera as duas movimentações com seus sinais."
      ],
      "recoverySectionIds": [
        "extrato",
        "exemplo-extrato"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "pc01.q04",
      "topicId": "draft.pc01",
      "prompt": "Uma tela fictícia separa R$150 de recursos sem crédito e R$500 de limite não utilizado. Um pagamento de R$260 é autorizado, usando primeiro os recursos sem crédito e depois o limite. Quanto crédito foi usado?",
      "options": [
        "R$500.",
        "R$110.",
        "R$650.",
        "R$260."
      ],
      "answer": 1,
      "explanation": "A diferença é 260 − 150 = R$110. Limite total não equivale ao valor efetivamente tomado.",
      "optionRationales": [
        "Confunde o limite com sua utilização.",
        "Calcula a parte que faltava aos recursos sem crédito.",
        "Soma os valores da tela, sem identificar a falta.",
        "Ignora os R$150 já existentes."
      ],
      "recoverySectionIds": [
        "saldo-limite",
        "exemplo-limite"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "pc01.q05",
      "topicId": "draft.pc01",
      "prompt": "No extrato fictício, uma transferência está apenas agendada para amanhã. Não foi debitada e não há bloqueio ou reserva de saldo. Como tratá-la no saldo efetivado de hoje?",
      "options": [
        "Descontá-la duas vezes para garantir segurança.",
        "Somá-la como uma nova entrada.",
        "Não descontá-la como lançamento já efetivado; considerar o compromisso na projeção futura.",
        "Excluir definitivamente a ordem, pois agendamentos não têm efeito futuro."
      ],
      "answer": 2,
      "explanation": "A pergunta distingue posição efetivada e previsão, com ausência de bloqueio explicitada.",
      "optionRationales": [
        "Cria débitos inexistentes.",
        "Troca saída futura por entrada.",
        "Preserva os estados e reconhece a projeção.",
        "Confunde ausência de débito hoje com inexistência do compromisso."
      ],
      "recoverySectionIds": [
        "extrato",
        "exemplo-extrato"
      ],
      "objectiveIds": [
        "O2",
        "O5"
      ]
    },
    {
      "id": "pc01.q06",
      "topicId": "draft.pc01",
      "prompt": "Um cliente fictício pede conta de depósitos em nome de sociedade e apresenta apenas sua própria identificação. O relato não traz poderes de representação. Qual conclusão é adequada?",
      "options": [
        "Falta verificar a representação e os demais controles; identificar a pessoa não comprova seus poderes.",
        "A identificação pessoal dá poderes ilimitados sobre qualquer sociedade.",
        "A abertura precisa ser aprovada automaticamente.",
        "A instituição deve ignorar quem solicita a abertura."
      ],
      "answer": 0,
      "explanation": "Identificação e poderes são informações distintas e necessárias conforme o caso.",
      "optionRationales": [
        "Nomeia o dado ausente sem substituir os controles.",
        "Cria poderes que o documento não demonstra.",
        "Transforma identificação parcial em aprovação.",
        "Contraria a identificação de quem atua pela conta."
      ],
      "recoverySectionIds": [
        "abertura",
        "exemplo-documentos"
      ],
      "objectiveIds": [
        "O4",
        "O5"
      ]
    },
    {
      "id": "pc01.q07",
      "topicId": "draft.pc01",
      "prompt": "Um anúncio fictício informa somente “conta digital com serviços”. O que falta para concluir o funcionamento e eventual cobrança de um serviço?",
      "options": [
        "A cor do aplicativo.",
        "O número de anúncios publicados.",
        "O tempo que o cliente passa no celular.",
        "O tipo da conta e as condições aplicáveis ao serviço no contrato e nas informações essenciais."
      ],
      "answer": 3,
      "explanation": "Canal digital não define sozinho o tipo, as condições e os custos.",
      "optionRationales": [
        "Aparência não demonstra regras.",
        "Publicidade repetida não completa as condições.",
        "Uso de celular não identifica o contrato.",
        "Busca informação pertinente ao funcionamento e à cobrança."
      ],
      "recoverySectionIds": [
        "tipos",
        "abertura",
        "servicos"
      ],
      "objectiveIds": [
        "O1",
        "O4",
        "O5"
      ]
    },
    {
      "id": "pc01.q08",
      "topicId": "draft.pc01",
      "prompt": "Caso fictício: o empregador deposita salário na conta corrente comum já mantida pelo empregado. O relato não informa contratação do serviço de conta-salário. Qual afirmação é sustentada?",
      "options": [
        "Qualquer entrada salarial transforma automaticamente a conta em conta-salário.",
        "A origem salarial de uma entrada não muda, por si, o tipo de conta corrente informado.",
        "A conta passa a aceitar apenas depósitos do empregador sem alteração da relação.",
        "O pagamento salarial transforma recursos recebidos em limite de crédito."
      ],
      "answer": 1,
      "explanation": "É preciso separar tipo de conta e origem da movimentação.",
      "optionRationales": [
        "Confunde entrada com natureza da relação.",
        "Preserva o tipo informado e a distinção ensinada.",
        "Transfere regra de outra modalidade sem fundamento.",
        "Confunde remuneração com empréstimo disponível."
      ],
      "recoverySectionIds": [
        "tipos",
        "extrato"
      ],
      "objectiveIds": [
        "O1",
        "O2"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "pc01-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "pc01.q01": [
        {
          "missionId": "draft.pc01",
          "sectionId": "tipos"
        },
        {
          "missionId": "draft.pc01",
          "sectionId": "exemplo-tipos"
        }
      ],
      "pc01.q02": [
        {
          "missionId": "draft.pc01",
          "sectionId": "tipos"
        },
        {
          "missionId": "draft.pc01",
          "sectionId": "exemplo-tipos"
        }
      ],
      "pc01.q03": [
        {
          "missionId": "draft.pc01",
          "sectionId": "extrato"
        },
        {
          "missionId": "draft.pc01",
          "sectionId": "exemplo-extrato"
        }
      ],
      "pc01.q04": [
        {
          "missionId": "draft.pc01",
          "sectionId": "saldo-limite"
        },
        {
          "missionId": "draft.pc01",
          "sectionId": "exemplo-limite"
        }
      ],
      "pc01.q05": [
        {
          "missionId": "draft.pc01",
          "sectionId": "extrato"
        },
        {
          "missionId": "draft.pc01",
          "sectionId": "exemplo-extrato"
        }
      ],
      "pc01.q06": [
        {
          "missionId": "draft.pc01",
          "sectionId": "abertura"
        },
        {
          "missionId": "draft.pc01",
          "sectionId": "exemplo-documentos"
        }
      ],
      "pc01.q07": [
        {
          "missionId": "draft.pc01",
          "sectionId": "tipos"
        },
        {
          "missionId": "draft.pc01",
          "sectionId": "abertura"
        },
        {
          "missionId": "draft.pc01",
          "sectionId": "servicos"
        }
      ],
      "pc01.q08": [
        {
          "missionId": "draft.pc01",
          "sectionId": "tipos"
        },
        {
          "missionId": "draft.pc01",
          "sectionId": "extrato"
        }
      ]
    }
  }
};

export const EDITORIAL = {
  "stage": "Plano existente reaproveitado; ensino, exemplos, prática e recuperação redigidos; revisão independente e humana pendentes; integração não iniciada",
  "referenceOnlyProfiles": [
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Itens 36/37 históricos, recorte de contas; sem declarar cobertura integral",
      "status": "histórico; adoção pendente"
    }
  ],
  "objectives": {
    "O1": "Distinguir tipo de conta, canal e movimentação.",
    "O2": "Interpretar saldo e lançamentos efetivados sem confundir agendamento.",
    "O3": "Separar recursos em conta de limite e crédito utilizado.",
    "O4": "Identificar verificações de titular, representação, contrato e serviço.",
    "O5": "Reconhecer dados insuficientes sem presumir poderes, cobrança ou disponibilidade.",
    "O6": "Recuperar uma confusão conceitual e reconstruir o caso após erro."
  },
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Retomar as seções indicadas por questão, explicar a confusão e reconstruir o raciocínio, sem novo indicador de domínio."
  },
  "limits": [
    "Recorte introdutório de contas, saldo e serviços do plano PC-01; não esgota os itens 36/37 históricos CAIXA nem constitui procedimento de abertura para um caso real.",
    "Sem catálogo de documentos obrigatório para todo banco, tarifas ou gratuidades quantitativas, regras completas de conta-salário, poupança, FGC ou portabilidade; os enunciados não cobram esses tópicos.",
    "Resolução CMN 4.753 consultada no texto vigente v6, com alterações até 2025; exemplos simplificam lançamentos e explicitam ausência de reserva/bloqueio quando necessário.",
    "Fontes primárias consultadas em 30/09/2026; confirmar alterações pertinentes antes de publicação futura. Casos fictícios originais, sem dados pessoais ou orientação para casos reais.",
    "Prática exposta, fora de avaliações independentes. IDs locais, sem XP, ordem, pré-requisito produtivo ou importação no catálogo."
  ]
};

export const ARITHMETIC = [
  {
    "label": "exemplo entrada",
    "operation": "add",
    "values": [
      400,
      250
    ],
    "expected": 650
  },
  {
    "label": "exemplo pagamento",
    "operation": "subtract",
    "values": [
      650,
      180
    ],
    "expected": 470
  },
  {
    "label": "exemplo transferência",
    "operation": "subtract",
    "values": [
      470,
      70
    ],
    "expected": 400
  },
  {
    "label": "projeção",
    "operation": "subtract",
    "values": [
      400,
      90
    ],
    "expected": 310
  },
  {
    "label": "crédito usado",
    "operation": "subtract",
    "values": [
      350,
      200
    ],
    "expected": 150
  },
  {
    "label": "limite restante",
    "operation": "subtract",
    "values": [
      600,
      150
    ],
    "expected": 450
  },
  {
    "label": "q03 entrada",
    "operation": "add",
    "values": [
      300,
      200
    ],
    "expected": 500
  },
  {
    "label": "q03 final",
    "operation": "subtract",
    "values": [
      500,
      120
    ],
    "expected": 380
  },
  {
    "label": "q04 crédito",
    "operation": "subtract",
    "values": [
      260,
      150
    ],
    "expected": 110
  }
];
