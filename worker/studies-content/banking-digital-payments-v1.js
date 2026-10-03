// Gerado por node worker/scripts/studies-dp-candidate.mjs --write. Não editar.
// Rascunhos DP locais. Desativado; sem autorização de ativação/publicação.
export const DP_MISSIONS = Object.freeze([
  {
    "id": "banking.dp.canais",
    "topicId": "banking.dp.canais",
    "contentVersion": 1,
    "order": 51,
    "title": "Internet e mobile banking: canal, operação e instituição",
    "shortTitle": "DP-01",
    "kind": "lesson",
    "objective": "Separar os meios de acesso da operação, do produto e da instituição, respeitando os dados informados.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 25,
    "publication": {
      "status": "draft",
      "releaseId": "digital-payments-intro-r1",
      "releaseSequence": 5,
      "changeImpact": "new"
    },
    "sourceIds": [
      "dp.dp01.bcb.conta.deposito",
      "dp.dp01.bcb.conta.digital",
      "dp.dp01.bcb.conta.pagamento",
      "dp.dp01.caixa.dp.canais"
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
          "dp.dp01.caixa.dp.canais"
        ]
      },
      {
        "id": "ex-canais",
        "heading": "3. Exemplo resolvido: uma conta, dois acessos",
        "body": "Lia consulta a mesma conta no site do Banco Horizonte, usando um navegador no computador. Depois abre o aplicativo do mesmo banco no telefone e consulta novamente. O caso informa uma conta e uma instituição, acessadas por dois meios. A troca de canal não cria automaticamente uma segunda conta nem uma segunda instituição.\n\nSe Lia tivesse aberto o site pelo navegador do telefone, o dispositivo seria móvel, mas o caso continuaria descrevendo acesso ao site. Não seria correto inventar a abertura do aplicativo.",
        "type": "worked-example",
        "sourceIds": [
          "dp.dp01.caixa.dp.canais"
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
          "dp.dp01.bcb.conta.deposito",
          "dp.dp01.bcb.conta.digital",
          "dp.dp01.bcb.conta.pagamento"
        ]
      },
      {
        "id": "ex-produto",
        "heading": "7. Exemplo resolvido: duas telas parecidas",
        "body": "O serviço Alfa e o serviço Beta permitem consultar valores em um aplicativo. O contrato fictício de Alfa identifica uma conta de depósitos; o de Beta, uma conta de pagamento. A semelhança das telas não altera os produtos informados. Se o enunciado mostrasse apenas as telas, sem identificar os produtos, faltaria informação para essa classificação.",
        "type": "worked-example",
        "sourceIds": [
          "dp.dp01.bcb.conta.deposito",
          "dp.dp01.bcb.conta.digital",
          "dp.dp01.bcb.conta.pagamento"
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
        "id": "glossario",
        "type": "glossary",
        "heading": "Vocabulário essencial",
        "body": "Canal: forma de acesso ao serviço. Dispositivo: equipamento utilizado. Operação: ação solicitada ou executada. Produto: conta ou serviço com natureza e condições próprias. Instituição: participante responsável pela atividade descrita.",
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
    "recall": [
      "Explique as cinco perguntas: instituição, produto, operação, canal e dispositivo.",
      "Diferencie consulta, agendamento e execução confirmada num caso fictício.",
      "Nomeie a confusão e retome a seção indicada antes de repetir a questão."
    ],
    "questions": [
      {
        "id": "q.dp01.q01",
        "topicId": "banking.dp.canais",
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
        ]
      },
      {
        "id": "q.dp01.q02",
        "topicId": "banking.dp.canais",
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
        ]
      },
      {
        "id": "q.dp01.q03",
        "topicId": "banking.dp.canais",
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
        ]
      },
      {
        "id": "q.dp01.q04",
        "topicId": "banking.dp.canais",
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
        ]
      },
      {
        "id": "q.dp01.q05",
        "topicId": "banking.dp.canais",
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
        ]
      },
      {
        "id": "q.dp01.q06",
        "topicId": "banking.dp.canais",
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
        ]
      },
      {
        "id": "q.dp01.q07",
        "topicId": "banking.dp.canais",
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
        ]
      },
      {
        "id": "q.dp01.q08",
        "topicId": "banking.dp.canais",
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
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "dp01-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.dp01.q01": [
          {
            "missionId": "banking.dp.canais",
            "sectionId": "camadas"
          },
          {
            "missionId": "banking.dp.canais",
            "sectionId": "ex-canais"
          }
        ],
        "q.dp01.q02": [
          {
            "missionId": "banking.dp.canais",
            "sectionId": "canais"
          },
          {
            "missionId": "banking.dp.canais",
            "sectionId": "ex-canais"
          }
        ],
        "q.dp01.q03": [
          {
            "missionId": "banking.dp.canais",
            "sectionId": "camadas"
          },
          {
            "missionId": "banking.dp.canais",
            "sectionId": "estados"
          }
        ],
        "q.dp01.q04": [
          {
            "missionId": "banking.dp.canais",
            "sectionId": "estados"
          },
          {
            "missionId": "banking.dp.canais",
            "sectionId": "ex-estados"
          }
        ],
        "q.dp01.q05": [
          {
            "missionId": "banking.dp.canais",
            "sectionId": "produto"
          },
          {
            "missionId": "banking.dp.canais",
            "sectionId": "ex-produto"
          }
        ],
        "q.dp01.q06": [
          {
            "missionId": "banking.dp.canais",
            "sectionId": "estados"
          },
          {
            "missionId": "banking.dp.canais",
            "sectionId": "ex-estados"
          }
        ],
        "q.dp01.q07": [
          {
            "missionId": "banking.dp.canais",
            "sectionId": "responsavel"
          },
          {
            "missionId": "banking.dp.canais",
            "sectionId": "ex-responsavel"
          }
        ],
        "q.dp01.q08": [
          {
            "missionId": "banking.dp.canais",
            "sectionId": "produto"
          },
          {
            "missionId": "banking.dp.canais",
            "sectionId": "ex-produto"
          },
          {
            "missionId": "banking.dp.canais",
            "sectionId": "resumo"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.dp01",
      "blockId": "banking.digital-payments",
      "prerequisiteId": "banking.ce.boss",
      "parametersApproved": false
    }
  },
  {
    "id": "banking.dp.transformacao",
    "topicId": "banking.dp.transformacao",
    "contentVersion": 1,
    "order": 52,
    "title": "Transformação digital: canal, processo e modelo de negócio",
    "shortTitle": "DP-02",
    "kind": "lesson",
    "objective": "Distinguir mudanças de canal, processo e modelo, identificando efeitos e limites pelos dados do caso.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 25,
    "publication": {
      "status": "draft",
      "releaseId": "digital-payments-intro-r1",
      "releaseSequence": 5,
      "changeImpact": "new"
    },
    "sourceIds": [
      "dp.dp02.bcb.dp.fintechs"
    ],
    "sections": [
      {
        "id": "camadas",
        "heading": "1. O que mudou de fato?",
        "body": "“Digital” pode descrever mudanças diferentes. Nesta aula usaremos três perguntas didáticas. **Canal:** mudou a forma de interação? **Processo:** mudou o caminho que transforma uma solicitação em resultado? **Modelo de negócio:** mudou a maneira de organizar e oferecer valor ao público, incluindo participantes e formas de remuneração?\n\nAs três dimensões podem coexistir. Elas não são classes jurídicas nem rótulos mutuamente exclusivos. A questão deve informar o que mudou; instalar um aplicativo, por si só, não demonstra que toda a organização foi transformada.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "ex-canal",
        "heading": "2. Exemplo resolvido: a porta de entrada",
        "body": "Um banco passa a receber pelo aplicativo a mesma solicitação antes entregue em papel. O caso informa que análise, etapas internas e serviço final continuam iguais. A mudança comprovada é no canal de entrada. Não há dados para afirmar que o processo inteiro foi automatizado ou que surgiu outro modelo de negócio.\n\nIsso não torna a mudança irrelevante: ela pode facilitar o acesso. Apenas separa o que foi descrito do que ainda teria de ser demonstrado.",
        "type": "worked-example",
        "sourceIds": []
      },
      {
        "id": "processo",
        "heading": "3. Processo: acompanhe o caminho",
        "body": "Um processo reúne etapas, informações, responsabilidades e decisões. Para compará-lo antes e depois, observe o que foi retirado, acrescentado ou integrado. A presença de uma tela nova não esclarece sozinha o trabalho que ocorre depois do envio.\n\nAutomatizar uma etapa também não significa que todas as decisões se tornaram automáticas. Se o caso mantém uma análise humana, ela continua fazendo parte do processo. Não se deve inventar sua eliminação.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "ex-processo",
        "heading": "4. Exemplo resolvido: menos redigitação",
        "body": "No processo fictício anterior, o cliente preenche um formulário e um atendente digita novamente os mesmos dados. Na nova versão, os campos são transmitidos ao sistema e conferidos; um analista continua avaliando a solicitação. Há mudança no processo, com retirada da redigitação. O caso não permite afirmar aprovação automática, ausência de erros ou eliminação de todos os profissionais.",
        "type": "worked-example",
        "sourceIds": []
      },
      {
        "id": "modelo",
        "heading": "5. Modelo: participantes, necessidade e remuneração",
        "body": "Para interpretar um modelo de negócio, identifique o público atendido, o serviço entregue, os participantes e a forma de remuneração informada. Uma cobrança por assinatura e uma remuneração por serviço realizado são arranjos distintos nos casos didáticos. Nenhum deles é necessariamente melhor: faltam custos, riscos e preferências para esse julgamento.\n\nMudar a forma de remuneração não altera automaticamente a natureza jurídica do prestador nem elimina regras aplicáveis. A descrição econômica não substitui a identificação da atividade e de quem responde por ela.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "ex-modelo",
        "heading": "6. Exemplo resolvido: mesma tela, outra organização",
        "body": "Duas plataformas fictícias têm aparência semelhante e ajudam a organizar despesas. A primeira cobra assinatura do próprio usuário. Na segunda, o caso informa que o acesso do usuário não é cobrado e que empresas pagam pela divulgação identificada de suas ofertas. A diferença relevante descrita está na remuneração e nos participantes do modelo, não no tamanho dos botões.\n\n“Sem cobrança do usuário neste caso” não significa ausência de custos, de interesses comerciais ou de condições de uso. Não se pode concluir, apenas com esses dados, qual plataforma é mais vantajosa.",
        "type": "worked-example",
        "sourceIds": []
      },
      {
        "id": "inovacao",
        "heading": "7. Inovação financeira e efeitos possíveis",
        "body": "O BCB apresenta fintechs como empresas que empregam tecnologia intensamente para inovar nos serviços financeiros, com possibilidade de novos modelos de negócio. O termo ajuda a reconhecer um fenômeno econômico; não comprova, sozinho, autorização para qualquer atividade ou garantia de resultado.\n\nBenefícios esperados de uma mudança, como maior eficiência e melhor acesso, precisam ser confrontados com o caso. Um serviço pode reduzir uma etapa e ainda impor dificuldades a parte do público. Usaremos como critério a necessidade atendida e o funcionamento descrito, sem prometer que tecnologia sempre reduz preço ou risco.",
        "type": "explanation",
        "sourceIds": [
          "dp.dp02.bcb.dp.fintechs"
        ]
      },
      {
        "id": "ex-acesso",
        "heading": "8. Exemplo resolvido: melhoria com limite",
        "body": "Uma cooperativa fictícia cria consulta digital de informações. O caso informa que pessoas com conexão conseguem consultar sem deslocamento, mas parte do público não tem acesso estável à internet. A melhoria descrita beneficia o primeiro grupo; não demonstra que todas as barreiras de atendimento desapareceram. Avaliar a mudança exige considerar também as necessidades do segundo grupo, sem presumir uma solução específica não informada.",
        "type": "worked-example",
        "sourceIds": [
          "dp.dp02.bcb.dp.fintechs"
        ]
      },
      {
        "id": "evidencia",
        "heading": "9. Promessa, dado e conclusão",
        "body": "“O serviço foi redesenhado para agilizar” expressa uma intenção. “O caso mediu redução no tempo de uma etapa” apresenta um resultado limitado àquela medição. “Todas as operações serão instantâneas e sem erro” é uma conclusão muito mais ampla, que não decorre das duas primeiras frases.\n\nPergunte sempre: qual etapa, qual público e qual efeito foram efetivamente descritos? Essa leitura também evita concluir que toda empresa tecnológica é um banco ou que toda instituição que lança um aplicativo mudou de natureza.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "glossario",
        "type": "glossary",
        "heading": "Vocabulário essencial",
        "body": "Canal: forma de interação. Processo: conjunto de etapas e decisões. Modelo de negócio: organização de participantes, valor oferecido e remuneração. Evidência: informação efetivamente apresentada. Benefício possível: resultado esperado que ainda exige confirmação.",
        "sourceIds": []
      },
      {
        "id": "resumo",
        "heading": "10. Recuperação",
        "body": "Monte três linhas: canal, processo e modelo. Preencha cada uma com uma evidência do enunciado ou escreva “não informado”. Depois separe benefício esperado de resultado observado. Se errou, nomeie o salto: “deduzi automação pela tela”, “confundi remuneração com aparência” ou “transformei benefício possível em garantia”. Refaça o exemplo correspondente. A prática exposta não mede retenção independente.",
        "type": "summary",
        "sourceIds": []
      }
    ],
    "recall": [
      "Separe canal, processo e modelo com uma evidência por dimensão.",
      "Diferencie benefício esperado de resultado observado.",
      "Nomeie a inferência indevida e reconstrua o caso pela seção indicada."
    ],
    "questions": [
      {
        "id": "q.dp02.q01",
        "topicId": "banking.dp.transformacao",
        "prompt": "Uma solicitação antes entregue em papel passa a entrar pelo aplicativo; o caso informa que as etapas internas e o serviço final permanecem iguais. Qual mudança está comprovada?",
        "options": [
          "Toda decisão passou a ser automática.",
          "O banco perdeu sua natureza jurídica.",
          "O canal de entrada mudou.",
          "Todos os custos deixaram de existir."
        ],
        "answer": 2,
        "explanation": "é exatamente a alteração descrita.",
        "optionRationales": [
          "o caso preserva as etapas, sem informar automação integral.",
          "o canal não determina essa mudança jurídica.",
          "é exatamente a alteração descrita.",
          "não há informação sobre eliminação de custos."
        ]
      },
      {
        "id": "q.dp02.q02",
        "topicId": "banking.dp.transformacao",
        "prompt": "Na nova versão, os dados do formulário chegam diretamente ao sistema, mas um analista continua avaliando a solicitação. O que a descrição permite concluir?",
        "options": [
          "Nenhum processo mudou.",
          "Não há mais participação humana.",
          "Todas as solicitações são aprovadas.",
          "A redigitação foi retirada, mantendo-se a análise humana informada."
        ],
        "answer": 3,
        "explanation": "reconhece o efeito específico sem generalizar.",
        "optionRationales": [
          "a retirada da redigitação é mudança de etapa.",
          "contradiz a presença do analista.",
          "avaliação não é garantia de aprovação.",
          "reconhece o efeito específico sem generalizar."
        ]
      },
      {
        "id": "q.dp02.q03",
        "topicId": "banking.dp.transformacao",
        "prompt": "Duas plataformas do caso têm telas semelhantes. Uma recebe assinatura do usuário; a outra é remunerada por empresas que divulgam ofertas identificadas. Qual aspecto merece comparação?",
        "options": [
          "A forma de remuneração e os participantes do modelo.",
          "Apenas a cor das telas.",
          "A certeza de que ambas não têm custos.",
          "A certeza de que ambas são bancos."
        ],
        "answer": 0,
        "explanation": "corresponde à diferença explicitada.",
        "optionRationales": [
          "corresponde à diferença explicitada.",
          "não explica a remuneração descrita.",
          "remuneração de outra origem não elimina custos.",
          "o caso não atribui essa natureza às plataformas."
        ]
      },
      {
        "id": "q.dp02.q04",
        "topicId": "banking.dp.transformacao",
        "prompt": "Uma empresa é apresentada como fintech. Qual conclusão pode ser sustentada apenas por essa caracterização geral?",
        "options": [
          "Ela pode exercer qualquer atividade financeira sem requisitos próprios.",
          "O termo se relaciona a inovação financeira com tecnologia; a atividade concreta ainda precisa ser identificada.",
          "Todo produto que oferece tem retorno garantido.",
          "Todo serviço oferecido é gratuito."
        ],
        "answer": 1,
        "explanation": "preserva o sentido geral e seus limites.",
        "optionRationales": [
          "o rótulo não substitui requisitos da atividade.",
          "preserva o sentido geral e seus limites.",
          "não há garantia de retorno decorrente do termo.",
          "a caracterização não define preço."
        ]
      },
      {
        "id": "q.dp02.q05",
        "topicId": "banking.dp.transformacao",
        "prompt": "No exemplo da cooperativa, pessoas com internet estável consultam sem deslocamento, mas outra parte do público não tem essa conexão. Qual avaliação respeita os dados?",
        "options": [
          "Toda barreira de atendimento desapareceu.",
          "Nenhuma pessoa obteve benefício.",
          "Houve benefício para o grupo descrito, sem demonstrar solução para todas as necessidades.",
          "O caso comprova ausência total de custos operacionais."
        ],
        "answer": 2,
        "explanation": "reconhece benefício e limite simultaneamente.",
        "optionRationales": [
          "ignora o grupo sem acesso estável.",
          "contradiz a consulta sem deslocamento do primeiro grupo.",
          "reconhece benefício e limite simultaneamente.",
          "o caso não mede custos operacionais."
        ]
      },
      {
        "id": "q.dp02.q06",
        "topicId": "banking.dp.transformacao",
        "prompt": "O anúncio informa apenas que um sistema foi criado “para agilizar o atendimento”, sem apresentar medição. O que está informado?",
        "options": [
          "Uma redução de tempo comprovada em todas as operações.",
          "A ausência definitiva de erros.",
          "A substituição de todas as decisões por automação.",
          "Um objetivo declarado, sem comprovação do resultado no enunciado."
        ],
        "answer": 3,
        "explanation": "distingue objetivo de resultado observado.",
        "optionRationales": [
          "inventa medição e abrangência.",
          "acrescenta garantia ausente.",
          "intenção de agilizar não descreve essa transformação.",
          "distingue objetivo de resultado observado."
        ]
      },
      {
        "id": "q.dp02.q07",
        "topicId": "banking.dp.transformacao",
        "prompt": "Uma plataforma recebe por assinatura e outra por divulgação de ofertas. O enunciado não informa preços, condições ou preferências do usuário. Qual conclusão é adequada?",
        "options": [
          "Os modelos de remuneração diferem; não há dados suficientes para dizer qual é mais vantajoso.",
          "A assinatura é sempre a pior opção.",
          "A divulgação é sempre a melhor opção.",
          "Aparência semelhante torna os modelos idênticos."
        ],
        "answer": 0,
        "explanation": "reconhece a diferença e evita julgamento sem os dados necessários.",
        "optionRationales": [
          "reconhece a diferença e evita julgamento sem os dados necessários.",
          "generaliza sem comparar condições.",
          "comete a mesma generalização.",
          "confunde interface com organização econômica."
        ]
      },
      {
        "id": "q.dp02.q08",
        "topicId": "banking.dp.transformacao",
        "prompt": "Um aluno concluiu que o lançamento de um aplicativo automatizou todas as etapas internas, embora o caso não as descreva. Qual recuperação enfrenta o erro?",
        "options": [
          "Memorizar que todo aplicativo elimina o trabalho humano.",
          "Separar canal de processo e identificar quais etapas foram efetivamente informadas.",
          "Escolher a alternativa que promete o maior ganho.",
          "Trocar o nome do aplicativo sem rever a justificativa."
        ],
        "answer": 1,
        "explanation": "retorna à distinção ausente no raciocínio.",
        "optionRationales": [
          "repete o salto lógico.",
          "retorna à distinção ausente no raciocínio.",
          "benefício prometido não é evidência.",
          "muda o nome, mantendo a inferência indevida."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "dp02-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.dp02.q01": [
          {
            "missionId": "banking.dp.transformacao",
            "sectionId": "camadas"
          },
          {
            "missionId": "banking.dp.transformacao",
            "sectionId": "ex-canal"
          }
        ],
        "q.dp02.q02": [
          {
            "missionId": "banking.dp.transformacao",
            "sectionId": "processo"
          },
          {
            "missionId": "banking.dp.transformacao",
            "sectionId": "ex-processo"
          }
        ],
        "q.dp02.q03": [
          {
            "missionId": "banking.dp.transformacao",
            "sectionId": "modelo"
          },
          {
            "missionId": "banking.dp.transformacao",
            "sectionId": "ex-modelo"
          }
        ],
        "q.dp02.q04": [
          {
            "missionId": "banking.dp.transformacao",
            "sectionId": "inovacao"
          },
          {
            "missionId": "banking.dp.transformacao",
            "sectionId": "evidencia"
          }
        ],
        "q.dp02.q05": [
          {
            "missionId": "banking.dp.transformacao",
            "sectionId": "inovacao"
          },
          {
            "missionId": "banking.dp.transformacao",
            "sectionId": "ex-acesso"
          }
        ],
        "q.dp02.q06": [
          {
            "missionId": "banking.dp.transformacao",
            "sectionId": "evidencia"
          },
          {
            "missionId": "banking.dp.transformacao",
            "sectionId": "resumo"
          }
        ],
        "q.dp02.q07": [
          {
            "missionId": "banking.dp.transformacao",
            "sectionId": "modelo"
          },
          {
            "missionId": "banking.dp.transformacao",
            "sectionId": "ex-modelo"
          }
        ],
        "q.dp02.q08": [
          {
            "missionId": "banking.dp.transformacao",
            "sectionId": "camadas"
          },
          {
            "missionId": "banking.dp.transformacao",
            "sectionId": "processo"
          },
          {
            "missionId": "banking.dp.transformacao",
            "sectionId": "resumo"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.dp02",
      "blockId": "banking.digital-payments",
      "prerequisiteId": "banking.dp.canais",
      "parametersApproved": false
    }
  },
  {
    "id": "banking.dp.empresas",
    "topicId": "banking.dp.empresas",
    "contentVersion": 1,
    "order": 53,
    "title": "Fintechs, startups e bigtechs",
    "shortTitle": "DP-03",
    "kind": "lesson",
    "objective": "Distinguir fintech, startup e bigtech pela dimensão descrita.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "digital-payments-intro-r1",
      "releaseSequence": 5,
      "changeImpact": "new"
    },
    "sourceIds": [
      "dp.dp03.bcb.dp.fintechs",
      "dp.dp03.lei.dp.startups",
      "dp.dp03.bis.dp.bigtech"
    ],
    "sections": [
      {
        "id": "dimensoes",
        "type": "explanation",
        "heading": "1. Três termos, perguntas diferentes",
        "body": "Fintech destaca inovação em serviços financeiros com uso intensivo de tecnologia. Startup remete a empreendimento nascente ou recente marcado pela inovação; o enquadramento no regime da LC 182 tem requisitos adicionais. Bigtech descreve uma grande empresa tecnológica com atividades amplas, que pode também entrar em serviços financeiros. Os termos não são três licenças bancárias e podem se sobrepor em situações específicas.",
        "sourceIds": [
          "dp.dp03.bcb.dp.fintechs",
          "dp.dp03.lei.dp.startups",
          "dp.dp03.bis.dp.bigtech"
        ]
      },
      {
        "id": "ex-fintech",
        "type": "worked-example",
        "heading": "2. Exemplo resolvido: atividade financeira",
        "body": "A empresa fictícia Vela usa tecnologia intensamente para oferecer uma solução financeira inovadora. Isso sustenta a descrição geral de fintech. O caso não informa seu tempo de existência, dimensão, licença nem preço: não permite acrescentar que ela é startup legalmente enquadrada, bigtech, banco ou gratuita.",
        "sourceIds": [
          "dp.dp03.bcb.dp.fintechs"
        ]
      },
      {
        "id": "startup",
        "type": "explanation",
        "heading": "3. Inovação não se resume a ter um aplicativo",
        "body": "O art. 4º da LC 182 relaciona startups a empreendimentos novos ou recentes com inovação aplicada ao modelo, produto ou serviço. A própria lei acrescenta condições para o tratamento especial. Nesta introdução, não decoramos limites: aprendemos a não converter o uso de um aplicativo, sozinho, em enquadramento legal. Uma inovação pode ocorrer fora do setor financeiro.",
        "sourceIds": [
          "dp.dp03.lei.dp.startups"
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
          "dp.dp03.bis.dp.bigtech"
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
          "dp.dp03.bcb.dp.fintechs",
          "dp.dp03.bis.dp.bigtech"
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
    "recall": [
      "Separe atividade, fase do empreendimento e escala/ecossistema.",
      "Identifique o prestador real no caso; não atribua licença ou garantia ao rótulo."
    ],
    "questions": [
      {
        "id": "q.dp03.q01",
        "topicId": "banking.dp.empresas",
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
        ]
      },
      {
        "id": "q.dp03.q02",
        "topicId": "banking.dp.empresas",
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
        ]
      },
      {
        "id": "q.dp03.q03",
        "topicId": "banking.dp.empresas",
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
        ]
      },
      {
        "id": "q.dp03.q04",
        "topicId": "banking.dp.empresas",
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
        ]
      },
      {
        "id": "q.dp03.q05",
        "topicId": "banking.dp.empresas",
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
        ]
      },
      {
        "id": "q.dp03.q06",
        "topicId": "banking.dp.empresas",
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
        ]
      },
      {
        "id": "q.dp03.q07",
        "topicId": "banking.dp.empresas",
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
        ]
      },
      {
        "id": "q.dp03.q08",
        "topicId": "banking.dp.empresas",
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
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "dp03-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.dp03.q01": [
          {
            "missionId": "banking.dp.empresas",
            "sectionId": "dimensoes"
          },
          {
            "missionId": "banking.dp.empresas",
            "sectionId": "ex-fintech"
          }
        ],
        "q.dp03.q02": [
          {
            "missionId": "banking.dp.empresas",
            "sectionId": "startup"
          },
          {
            "missionId": "banking.dp.empresas",
            "sectionId": "ex-startup"
          }
        ],
        "q.dp03.q03": [
          {
            "missionId": "banking.dp.empresas",
            "sectionId": "dimensoes"
          },
          {
            "missionId": "banking.dp.empresas",
            "sectionId": "rede"
          }
        ],
        "q.dp03.q04": [
          {
            "missionId": "banking.dp.empresas",
            "sectionId": "rede"
          },
          {
            "missionId": "banking.dp.empresas",
            "sectionId": "ex-rede"
          }
        ],
        "q.dp03.q05": [
          {
            "missionId": "banking.dp.empresas",
            "sectionId": "rotulos"
          },
          {
            "missionId": "banking.dp.empresas",
            "sectionId": "ex-parceria"
          }
        ],
        "q.dp03.q06": [
          {
            "missionId": "banking.dp.empresas",
            "sectionId": "startup"
          }
        ],
        "q.dp03.q07": [
          {
            "missionId": "banking.dp.empresas",
            "sectionId": "rotulos"
          }
        ],
        "q.dp03.q08": [
          {
            "missionId": "banking.dp.empresas",
            "sectionId": "ex-parceria"
          },
          {
            "missionId": "banking.dp.empresas",
            "sectionId": "resumo"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.dp03",
      "blockId": "banking.digital-payments",
      "prerequisiteId": "banking.dp.transformacao",
      "parametersApproved": false
    }
  },
  {
    "id": "banking.dp.intermediacao",
    "topicId": "banking.dp.intermediacao",
    "contentVersion": 1,
    "order": 54,
    "title": "Shadow banking e intermediação não bancária",
    "shortTitle": "DP-04",
    "kind": "lesson",
    "objective": "Reconhecer intermediação financeira fora do sistema bancário tradicional.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "digital-payments-intro-r1",
      "releaseSequence": 5,
      "changeImpact": "new"
    },
    "sourceIds": [
      "dp.dp04.fsb.dp.nbfi"
    ],
    "sections": [
      {
        "id": "conceito",
        "type": "explanation",
        "heading": "1. Por que estudar além dos bancos?",
        "body": "O termo histórico shadow banking direciona a atenção à intermediação de crédito realizada fora do sistema bancário tradicional. O FSB hoje organiza seu acompanhamento como intermediação financeira não bancária (NBFI). O universo é diverso; ter atividade financeira sem ser banco não significa, por si só, prática clandestina. Há modelos e regras distintos.",
        "sourceIds": [
          "dp.dp04.fsb.dp.nbfi"
        ]
      },
      {
        "id": "ex-canal",
        "type": "worked-example",
        "heading": "2. Exemplo resolvido: financiamento por outro canal",
        "body": "Um fundo fictício reúne recursos de investidores e aplica em títulos de dívida de empresas. O financiamento alcança empresas por um canal não bancário. O exemplo não informa infração; o nome do canal não permite concluir ilegalidade ou falta de regulação.",
        "sourceIds": []
      },
      {
        "id": "liquidez",
        "type": "explanation",
        "heading": "3. Prazo e liquidez",
        "body": "Liquidez é a possibilidade de obter recursos disponíveis, inclusive convertendo ativos em dinheiro sem perdas excessivas. Um compromisso de resgate curto pode entrar em tensão com ativos que só geram caixa mais tarde ou são difíceis de vender. O problema é o descompasso; não basta observar que há ativos de valor positivo.",
        "sourceIds": [
          "dp.dp04.fsb.dp.nbfi"
        ]
      },
      {
        "id": "ex-resgate",
        "type": "worked-example",
        "heading": "4. Exemplo resolvido: dinheiro existe, mas quando?",
        "body": "No caso fictício, investidores podem pedir resgate em prazo curto, enquanto os recebimentos dos ativos ocorrem muito depois. Muitos pedidos juntos podem exigir venda antecipada. Se compradores exigirem desconto, a venda pode gerar perda. Isso ilustra risco de liquidez e de prazos; não prova que toda instituição não bancária vive a mesma situação.",
        "sourceIds": []
      },
      {
        "id": "alavancagem",
        "type": "explanation",
        "heading": "5. Recursos próprios e dívida",
        "body": "Alavancagem envolve ampliar exposições usando endividamento ou mecanismos equivalentes. Ganhos e perdas dos ativos podem ter efeito maior sobre os recursos próprios. Aqui usamos apenas dívida simples: receber dinheiro emprestado aumenta também uma obrigação, e não representa automaticamente aumento do patrimônio líquido.",
        "sourceIds": [
          "dp.dp04.fsb.dp.nbfi"
        ]
      },
      {
        "id": "ex-alavancagem",
        "type": "worked-example",
        "heading": "6. Exemplo resolvido: perda sobre recursos próprios",
        "body": "Uma entidade fictícia possui R$20 próprios, toma R$80 emprestados e compra R$100 em ativos. Se os ativos caem para R$90 e a dívida permanece R$80, restam R$10 de recursos próprios: perda de metade dos R$20 iniciais. Hipótese: sem outros ativos, receitas, custos ou obrigações. A queda de 10% no ativo não foi de apenas 10% sobre o capital próprio.",
        "sourceIds": []
      },
      {
        "id": "recorte",
        "type": "explanation",
        "heading": "7. Nem todo não banco tem o mesmo risco",
        "body": "O monitoramento amplo do FSB abrange diversos intermediários; uma medida mais estreita focaliza funções associadas a riscos financeiros semelhantes aos bancários, como transformação de prazos/liquidez e alavancagem. Interligações podem transmitir tensões: uma venda forçada afeta preços e outros participantes expostos. Não basta chamar toda empresa não bancária de shadow bank.",
        "sourceIds": [
          "dp.dp04.fsb.dp.nbfi"
        ]
      },
      {
        "id": "ex-contagio",
        "type": "worked-example",
        "heading": "8. Exemplo resolvido: ligação entre participantes",
        "body": "Duas entidades mantêm o mesmo tipo de ativo. No cenário informado, uma vende rapidamente em grande volume, pressionando o preço; a outra vê o valor de sua carteira cair. O caso ilustra transmissão de uma tensão por preços. Não comprova quebra de ambas nem ilegalidade da atividade.",
        "sourceIds": []
      },
      {
        "id": "glossario",
        "type": "glossary",
        "heading": "Vocabulário essencial",
        "body": "Intermediação não bancária: canal financeiro fora dos bancos tradicionais. Liquidez: capacidade de obter caixa. Descasamento: diferença entre prazos/características de recebimentos e pagamentos. Alavancagem: exposição ampliada com dívida ou mecanismo equivalente. Contágio: transmissão de tensão entre participantes.",
        "sourceIds": []
      },
      {
        "id": "resumo",
        "type": "summary",
        "heading": "Recuperação e síntese",
        "body": "Desenhe quem financia quem. Compare quando é preciso pagar e quando o caixa chega. Separe ativos, dívida e recursos próprios. Se errar, nomeie a confusão, retome o trecho indicado e reconstrua o exemplo com suas palavras. Esta prática exposta não é avaliação independente de retenção.",
        "sourceIds": []
      }
    ],
    "recall": [
      "Desenhe quem financia quem.",
      "Compare quando é preciso pagar e quando o caixa chega.",
      "Separe ativos, dívida e recursos próprios."
    ],
    "questions": [
      {
        "id": "q.dp04.q01",
        "topicId": "banking.dp.intermediacao",
        "prompt": "Um fundo reúne recursos e compra títulos de dívida de empresas. Qual leitura respeita o caso?",
        "options": [
          "A operação é criminosa só porque não é feita por banco.",
          "O nome fundo prova ausência de qualquer regra.",
          "Há financiamento por canal não bancário, sem prova de ilegalidade no enunciado.",
          "A operação não pode financiar empresas."
        ],
        "answer": 2,
        "explanation": "Descreve a atividade e preserva o limite da informação.",
        "optionRationales": [
          "A conclusão jurídica não decorre do canal.",
          "Modelos não bancários também podem ser regulados.",
          "Descreve a atividade e preserva o limite da informação.",
          "A compra de dívida canaliza financiamento no exemplo."
        ]
      },
      {
        "id": "q.dp04.q02",
        "topicId": "banking.dp.intermediacao",
        "prompt": "Resgates curtos são prometidos, mas os ativos só geram caixa muito depois. Qual tensão merece atenção?",
        "options": [
          "Descompasso de prazo e liquidez.",
          "Ausência necessária de qualquer ativo.",
          "Garantia de lucro imediato.",
          "Proibição universal de fundos."
        ],
        "answer": 0,
        "explanation": "O tempo para pagar e o tempo para receber podem divergir.",
        "optionRationales": [
          "O tempo para pagar e o tempo para receber podem divergir.",
          "Existem ativos, embora seu caixa seja posterior.",
          "O descompasso não garante ganho.",
          "O caso é de risco, não de proibição universal."
        ]
      },
      {
        "id": "q.dp04.q03",
        "topicId": "banking.dp.intermediacao",
        "prompt": "Uma carteira pode ter valor positivo e dificuldade de atender resgates imediatos porque:",
        "options": [
          "Todo ativo é dinheiro disponível.",
          "Patrimônio positivo elimina qualquer prazo.",
          "Resgate cria recursos sem venda ou recebimento.",
          "Converter ativos em caixa pode exigir tempo ou desconto."
        ],
        "answer": 3,
        "explanation": "Distingue valor econômico de disponibilidade imediata.",
        "optionRationales": [
          "Ativo pode ter prazo ou baixa liquidez.",
          "Valor não elimina o calendário dos fluxos.",
          "É preciso fonte de liquidez para pagar.",
          "Distingue valor econômico de disponibilidade imediata."
        ]
      },
      {
        "id": "q.dp04.q04",
        "topicId": "banking.dp.intermediacao",
        "prompt": "No exemplo de R$20 próprios e R$80 de dívida, os ativos caem de R$100 para R$90. Mantida a dívida, quanto resta de recursos próprios?",
        "options": [
          "R$90.",
          "R$10.",
          "R$80.",
          "R$20."
        ],
        "answer": 1,
        "explanation": "90 menos 80 resulta em 10.",
        "optionRationales": [
          "Esse é o ativo antes de deduzir a obrigação.",
          "90 menos 80 resulta em 10.",
          "Esse é o valor da dívida.",
          "O capital inicial foi reduzido pela perda."
        ]
      },
      {
        "id": "q.dp04.q05",
        "topicId": "banking.dp.intermediacao",
        "prompt": "A medida mais estreita do FSB, dentro do universo não bancário, procura:",
        "options": [
          "Funções com riscos como transformação de liquidez/prazos e alavancagem.",
          "Todas as lojas de qualquer setor.",
          "Somente bancos centrais.",
          "Provar que toda entidade não bancária é ilegal."
        ],
        "answer": 0,
        "explanation": "O recorte considera características de risco.",
        "optionRationales": [
          "O recorte considera características de risco.",
          "Ser não banco em sentido literal não define intermediação financeira.",
          "Não corresponde ao universo descrito.",
          "Monitoramento de risco não é acusação de ilegalidade."
        ]
      },
      {
        "id": "q.dp04.q06",
        "topicId": "banking.dp.intermediacao",
        "prompt": "Venda forçada por uma entidade reduz o preço de ativo também mantido por outra. O mecanismo ilustrado é:",
        "options": [
          "Garantia automática de quebra das duas.",
          "Eliminação da interdependência.",
          "Transmissão de tensão por preços e exposições comuns.",
          "Criação de moeda pelo fundo."
        ],
        "answer": 2,
        "explanation": "Identifica como o efeito alcança outro participante.",
        "optionRationales": [
          "O caso não traz esse desfecho.",
          "Há justamente uma ligação pelo ativo.",
          "Identifica como o efeito alcança outro participante.",
          "O exemplo trata de venda e preço."
        ]
      },
      {
        "id": "q.dp04.q07",
        "topicId": "banking.dp.intermediacao",
        "prompt": "Qual frase é compatível com a aula?",
        "options": [
          "Toda atividade não bancária opera sem regras.",
          "Há diversidade de modelos e regras; o risco depende da atividade e da estrutura.",
          "Só bancos podem participar de qualquer financiamento.",
          "Todo fundo tem resgate imediato e ativos longos."
        ],
        "answer": 1,
        "explanation": "Preserva a heterogeneidade do universo.",
        "optionRationales": [
          "Confunde fora dos bancos com fora da regulação.",
          "Preserva a heterogeneidade do universo.",
          "Ignora os canais não bancários apresentados.",
          "Generaliza condições de um exemplo."
        ]
      },
      {
        "id": "q.dp04.q08",
        "topicId": "banking.dp.intermediacao",
        "prompt": "Um aluno tratou ativo de R$90 como capital próprio de R$90, ignorando R$80 de dívida. Qual retomada é adequada?",
        "options": [
          "Apagar a dívida do enunciado.",
          "Usar apenas o nome da entidade.",
          "Concluir que não houve perda.",
          "Separar ativos e obrigações e refazer o saldo residual."
        ],
        "answer": 3,
        "explanation": "Corrige a confusão entre ativo e recursos próprios.",
        "optionRationales": [
          "Distorce a hipótese.",
          "O nome não resolve a conta.",
          "O capital caiu de 20 para 10.",
          "Corrige a confusão entre ativo e recursos próprios."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "dp04-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.dp04.q01": [
          {
            "missionId": "banking.dp.intermediacao",
            "sectionId": "conceito"
          },
          {
            "missionId": "banking.dp.intermediacao",
            "sectionId": "ex-canal"
          }
        ],
        "q.dp04.q02": [
          {
            "missionId": "banking.dp.intermediacao",
            "sectionId": "liquidez"
          },
          {
            "missionId": "banking.dp.intermediacao",
            "sectionId": "ex-resgate"
          }
        ],
        "q.dp04.q03": [
          {
            "missionId": "banking.dp.intermediacao",
            "sectionId": "liquidez"
          }
        ],
        "q.dp04.q04": [
          {
            "missionId": "banking.dp.intermediacao",
            "sectionId": "ex-alavancagem"
          }
        ],
        "q.dp04.q05": [
          {
            "missionId": "banking.dp.intermediacao",
            "sectionId": "recorte"
          }
        ],
        "q.dp04.q06": [
          {
            "missionId": "banking.dp.intermediacao",
            "sectionId": "ex-contagio"
          }
        ],
        "q.dp04.q07": [
          {
            "missionId": "banking.dp.intermediacao",
            "sectionId": "conceito"
          },
          {
            "missionId": "banking.dp.intermediacao",
            "sectionId": "recorte"
          }
        ],
        "q.dp04.q08": [
          {
            "missionId": "banking.dp.intermediacao",
            "sectionId": "ex-alavancagem"
          },
          {
            "missionId": "banking.dp.intermediacao",
            "sectionId": "resumo"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.dp04",
      "blockId": "banking.digital-payments",
      "prerequisiteId": "banking.dp.empresas",
      "parametersApproved": false
    }
  },
  {
    "id": "banking.dp.arranjos",
    "topicId": "banking.dp.arranjos",
    "contentVersion": 1,
    "order": 55,
    "title": "SPB, arranjos e participantes dos pagamentos",
    "shortTitle": "DP-05",
    "kind": "lesson",
    "objective": "Separar sistema, regras de um arranjo e participantes.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "digital-payments-intro-r1",
      "releaseSequence": 5,
      "changeImpact": "new"
    },
    "sourceIds": [
      "dp.dp05.bcb.dp.spb",
      "dp.dp05.bcb.dp.arranjos"
    ],
    "sections": [
      {
        "id": "spb",
        "type": "explanation",
        "heading": "1. A estrutura por trás da tela",
        "body": "Uma transferência envolve mais que o aplicativo visto pelo usuário. O SPB reúne infraestruturas do mercado financeiro e arranjos de pagamento. Infraestruturas organizam atividades como liquidação e registro; arranjos estabelecem regras para serviços de pagamento. Essa visão permite separar o conjunto de regras e sistemas das entidades que participam deles.",
        "sourceIds": [
          "dp.dp05.bcb.dp.spb"
        ]
      },
      {
        "id": "ex-camadas",
        "type": "worked-example",
        "heading": "2. Exemplo resolvido: três camadas",
        "body": "Uma tela recebe uma ordem, instituições processam a operação e a transferência se conclui segundo regras comuns. A tela é o canal; as instituições são participantes; as regras pertencem ao arranjo. A descrição de um canal não explica, sozinha, toda a infraestrutura.",
        "sourceIds": []
      },
      {
        "id": "arranjo",
        "type": "explanation",
        "heading": "3. Arranjo é um conjunto de regras",
        "body": "Um arranjo disciplina como determinado serviço de pagamento funciona e como seus participantes se relacionam. Não é sinônimo da empresa de quem o usuário é cliente. Na compra com cartão, regras comuns permitem a interação entre quem paga, quem recebe e os prestadores envolvidos. Pix e arranjos de cartões são exemplos apresentados pelo BCB.",
        "sourceIds": [
          "dp.dp05.bcb.dp.arranjos",
          "dp.dp05.bcb.dp.spb"
        ]
      },
      {
        "id": "ex-cartao",
        "type": "worked-example",
        "heading": "4. Exemplo resolvido: aceitação",
        "body": "No caso fictício, uma loja aceita o arranjo do cartão apresentado pelo comprador. A compatibilidade permite iniciar aquela compra conforme as regras aplicáveis. Isso não obriga toda loja a aceitar qualquer cartão nem garante a autorização de cada compra: ainda podem existir condições específicas da operação.",
        "sourceIds": []
      },
      {
        "id": "participantes",
        "type": "explanation",
        "heading": "5. Quem faz o quê?",
        "body": "O instituidor organiza o arranjo; os participantes executam papéis previstos nas regras. Instituições financeiras e instituições de pagamento podem participar de serviços de pagamento. Uma instituição de pagamento não vira banco apenas por participar de um arranjo; a natureza da instituição e a atividade devem ser identificadas separadamente.",
        "sourceIds": [
          "dp.dp05.bcb.dp.arranjos",
          "dp.dp05.bcb.dp.spb"
        ]
      },
      {
        "id": "ex-instituicao",
        "type": "worked-example",
        "heading": "6. Exemplo resolvido: mesma função, entidades distintas",
        "body": "O enunciado informa que um banco e uma instituição de pagamento prestam um serviço no mesmo arranjo. Compartilhar regras daquele serviço não torna iguais todas as suas atividades permitidas. A comparação correta observa a função comum sem apagar a diferença entre as instituições.",
        "sourceIds": []
      },
      {
        "id": "etapas",
        "type": "explanation",
        "heading": "7. Solicitar não é concluir",
        "body": "Para acompanhar uma operação, distinga a ordem do usuário, o processamento e a liquidação, entendida aqui como conclusão da transferência das obrigações ou recursos segundo as regras do sistema. Uma mensagem “solicitação recebida” não comprova por si só a liquidação. O significado do estado exibido deve ser lido no caso, sem inventar sucesso.",
        "sourceIds": [
          "dp.dp05.bcb.dp.spb"
        ]
      },
      {
        "id": "ex-estado",
        "type": "worked-example",
        "heading": "8. Exemplo resolvido: evidência incompleta",
        "body": "Uma tela diz “ordem recebida para processamento”, sem informar resultado. É correto dizer que a solicitação entrou no fluxo. É incorreto concluir que o recebedor já dispõe dos recursos. Uma confirmação explícita de conclusão daria evidência diferente; a aula não realiza pagamentos reais.",
        "sourceIds": []
      },
      {
        "id": "glossario",
        "type": "glossary",
        "heading": "Vocabulário essencial",
        "body": "SPB: conjunto de infraestruturas e arranjos. Arranjo: regras de um serviço de pagamento. Instituidor: organizador do arranjo. Participante: entidade que exerce papel nele. Liquidação: conclusão financeira segundo as regras aplicáveis.",
        "sourceIds": []
      },
      {
        "id": "resumo",
        "type": "summary",
        "heading": "Recuperação e síntese",
        "body": "Desenhe canal, regras e participantes em linhas separadas. Leia o estado da operação antes de concluir que houve liquidação. Se errar, nomeie a confusão, retome o trecho indicado e reconstrua o exemplo com suas palavras. Esta prática exposta não é avaliação independente de retenção.",
        "sourceIds": []
      }
    ],
    "recall": [
      "Desenhe canal, regras e participantes em linhas separadas.",
      "Leia o estado da operação antes de concluir que houve liquidação."
    ],
    "questions": [
      {
        "id": "q.dp05.q01",
        "topicId": "banking.dp.arranjos",
        "prompt": "O SPB, conforme a apresentação do BCB usada nesta aula, abrange:",
        "options": [
          "Somente aplicativos de celular.",
          "Infraestruturas do mercado financeiro e arranjos de pagamento.",
          "Apenas uma empresa emissora de cartões.",
          "Exclusivamente papel-moeda."
        ],
        "answer": 1,
        "explanation": "São os dois segmentos apresentados.",
        "optionRationales": [
          "Canal é apenas parte da experiência visível.",
          "São os dois segmentos apresentados.",
          "O conjunto é mais amplo que um prestador.",
          "Pagamentos e infraestruturas não se resumem a cédulas."
        ]
      },
      {
        "id": "q.dp05.q02",
        "topicId": "banking.dp.arranjos",
        "prompt": "O conjunto de regras e procedimentos de um serviço de pagamento é:",
        "options": [
          "O saldo de um usuário.",
          "Uma agência física.",
          "Necessariamente um banco.",
          "Um arranjo de pagamento."
        ],
        "answer": 3,
        "explanation": "Corresponde ao conceito ensinado.",
        "optionRationales": [
          "Saldo é valor em conta.",
          "Local de atendimento não é o conjunto de regras.",
          "Regras e instituição são dimensões distintas.",
          "Corresponde ao conceito ensinado."
        ]
      },
      {
        "id": "q.dp05.q03",
        "topicId": "banking.dp.arranjos",
        "prompt": "Banco e instituição de pagamento participam do mesmo arranjo. Isso permite concluir que:",
        "options": [
          "Exercem papéis sob regras comuns daquele serviço, sem identidade de todas as atividades.",
          "Ambos se tornaram bancos centrais.",
          "Todas as atividades permitidas às duas entidades são idênticas.",
          "Nenhuma regra é necessária."
        ],
        "answer": 0,
        "explanation": "Preserva função comum e natureza distinta.",
        "optionRationales": [
          "Preserva função comum e natureza distinta.",
          "Participar não cria autoridade monetária.",
          "O arranjo não iguala toda a autorização institucional.",
          "A participação ocorre justamente sob regras."
        ]
      },
      {
        "id": "q.dp05.q04",
        "topicId": "banking.dp.arranjos",
        "prompt": "“Ordem recebida para processamento”, sem outro resultado, comprova:",
        "options": [
          "Liquidação e crédito final ao recebedor.",
          "Lucro do recebedor.",
          "Entrada da solicitação no fluxo, sem comprovar conclusão.",
          "Fim de todas as obrigações da compra."
        ],
        "answer": 2,
        "explanation": "Respeita o estado informado.",
        "optionRationales": [
          "Acrescenta etapa não confirmada.",
          "Pagamento e lucro são conceitos distintos.",
          "Respeita o estado informado.",
          "O texto não confirma nem a conclusão financeira."
        ]
      },
      {
        "id": "q.dp05.q05",
        "topicId": "banking.dp.arranjos",
        "prompt": "Em um exemplo, o usuário toca em um botão no aplicativo. A tela é:",
        "options": [
          "Todo o SPB.",
          "O canal visível, sem representar sozinha as regras e infraestruturas.",
          "O instituidor de qualquer arranjo.",
          "Prova de liquidação."
        ],
        "answer": 1,
        "explanation": "Separa interface e sistema subjacente.",
        "optionRationales": [
          "Há participantes e infraestruturas além da tela.",
          "Separa interface e sistema subjacente.",
          "Uma tela não identifica esse papel.",
          "O toque pode apenas iniciar uma solicitação."
        ]
      },
      {
        "id": "q.dp05.q06",
        "topicId": "banking.dp.arranjos",
        "prompt": "Uma loja aceita determinado arranjo de cartão. Qual conclusão adicional não decorre disso?",
        "options": [
          "Há compatibilidade descrita para iniciar a compra.",
          "Regras comuns organizam o serviço.",
          "Outras condições podem ser relevantes.",
          "Todas as compras com qualquer cartão estão garantidas."
        ],
        "answer": 3,
        "explanation": "Generaliza além da aceitação descrita.",
        "optionRationales": [
          "É a compatibilidade informada.",
          "Corresponde ao papel do arranjo.",
          "Aceitação não elimina condições da operação.",
          "Generaliza além da aceitação descrita."
        ]
      },
      {
        "id": "q.dp05.q07",
        "topicId": "banking.dp.arranjos",
        "prompt": "Qual papel é associado à organização das regras do arranjo?",
        "options": [
          "O instituidor do arranjo.",
          "Todo comprador individual, sozinho.",
          "A mercadoria comprada.",
          "O saldo da conta."
        ],
        "answer": 0,
        "explanation": "É o papel organizador apresentado.",
        "optionRationales": [
          "É o papel organizador apresentado.",
          "O usuário adere ao serviço; não define sozinho suas regras.",
          "Produto comercial não organiza o arranjo.",
          "Saldo é valor, não entidade organizadora."
        ]
      },
      {
        "id": "q.dp05.q08",
        "topicId": "banking.dp.arranjos",
        "prompt": "Quem confundiu instituição com arranjo deve retomar:",
        "options": [
          "A cor do cartão, sem olhar os papéis.",
          "A suposição de que toda tela é um banco.",
          "A separação entre regras do serviço e entidades participantes.",
          "A ideia de que aceitar um cartão garante qualquer compra."
        ],
        "answer": 2,
        "explanation": "Reconstrói os conceitos necessários.",
        "optionRationales": [
          "Cor não resolve a distinção.",
          "Repete confusão entre canal e entidade.",
          "Reconstrói os conceitos necessários.",
          "Acrescenta outra generalização."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "dp05-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.dp05.q01": [
          {
            "missionId": "banking.dp.arranjos",
            "sectionId": "spb"
          }
        ],
        "q.dp05.q02": [
          {
            "missionId": "banking.dp.arranjos",
            "sectionId": "arranjo"
          }
        ],
        "q.dp05.q03": [
          {
            "missionId": "banking.dp.arranjos",
            "sectionId": "participantes"
          },
          {
            "missionId": "banking.dp.arranjos",
            "sectionId": "ex-instituicao"
          }
        ],
        "q.dp05.q04": [
          {
            "missionId": "banking.dp.arranjos",
            "sectionId": "etapas"
          },
          {
            "missionId": "banking.dp.arranjos",
            "sectionId": "ex-estado"
          }
        ],
        "q.dp05.q05": [
          {
            "missionId": "banking.dp.arranjos",
            "sectionId": "ex-camadas"
          }
        ],
        "q.dp05.q06": [
          {
            "missionId": "banking.dp.arranjos",
            "sectionId": "ex-cartao"
          }
        ],
        "q.dp05.q07": [
          {
            "missionId": "banking.dp.arranjos",
            "sectionId": "participantes"
          }
        ],
        "q.dp05.q08": [
          {
            "missionId": "banking.dp.arranjos",
            "sectionId": "arranjo"
          },
          {
            "missionId": "banking.dp.arranjos",
            "sectionId": "participantes"
          },
          {
            "missionId": "banking.dp.arranjos",
            "sectionId": "resumo"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.dp05",
      "blockId": "banking.digital-payments",
      "prerequisiteId": "banking.dp.intermediacao",
      "parametersApproved": false
    }
  },
  {
    "id": "banking.dp.pix",
    "topicId": "banking.dp.pix",
    "contentVersion": 1,
    "order": 56,
    "title": "Pix: transferência, conta e confirmação",
    "shortTitle": "DP-06",
    "kind": "lesson",
    "objective": "Reconhecer Pix como sistema de pagamento instantâneo.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "digital-payments-intro-r1",
      "releaseSequence": 5,
      "changeImpact": "new"
    },
    "sourceIds": [
      "dp.dp06.bcb.dp.pix"
    ],
    "sections": [
      {
        "id": "conceito",
        "type": "explanation",
        "heading": "1. O que o Pix faz",
        "body": "Pix permite transferir recursos entre contas em poucos segundos e funciona todos os dias, a qualquer hora. Não é uma conta nova nem uma moeda diferente do real. O BCB apresenta seu uso a partir de contas correntes, de poupança ou pré-pagas. A disponibilidade do sistema não elimina a necessidade de condições válidas para cada transação.",
        "sourceIds": [
          "dp.dp06.bcb.dp.pix"
        ]
      },
      {
        "id": "ex-conta",
        "type": "worked-example",
        "heading": "2. Exemplo resolvido: saldo e transferência",
        "body": "No cenário fictício, Joana tem R$180 disponíveis e conclui um Pix de R$50, sem tarifa ou outro lançamento. Seu saldo passa a R$130. O Pix movimentou recursos; não criou R$50 adicionais e não demonstra concessão de empréstimo.",
        "sourceIds": []
      },
      {
        "id": "disponibilidade",
        "type": "explanation",
        "heading": "3. Funcionar todos os dias não significa aprovar tudo",
        "body": "A operação pode depender de saldo, dados corretos e controles aplicáveis. A aula não fixa limites, tarifas nem regras de devolução. “O sistema está disponível” descreve o serviço; “esta transferência foi concluída” descreve uma operação específica. São afirmações diferentes.",
        "sourceIds": [
          "dp.dp06.bcb.dp.pix"
        ]
      },
      {
        "id": "ex-horario",
        "type": "worked-example",
        "heading": "4. Exemplo resolvido: domingo",
        "body": "Um Pix é solicitado no domingo. O dia, por si só, não impõe esperar uma agência abrir, pois o sistema tem disponibilidade contínua. Se o caso não informa a conclusão, não é possível deduzir que a transferência ocorreu apenas por ser um serviço instantâneo.",
        "sourceIds": []
      },
      {
        "id": "agendamento",
        "type": "explanation",
        "heading": "5. Agendar é instruir para depois",
        "body": "Pix agendado envolve uma instrução para data futura. A tela de agendamento registra essa intenção; não é prova de que o recebedor já recebeu. Compare o estado e a data da operação. Esta aula não detalha modalidades recorrentes nem regras técnicas de execução.",
        "sourceIds": [
          "dp.dp06.bcb.dp.pix"
        ]
      },
      {
        "id": "ex-agenda",
        "type": "worked-example",
        "heading": "6. Exemplo resolvido: hoje e amanhã",
        "body": "Na terça-feira, a tela confirma um agendamento para quarta-feira. O fato comprovado na terça é o agendamento. Não há base para tratar os recursos como recebidos na terça. Mesmo no dia previsto, a conclusão deve ser identificada pelo resultado informado.",
        "sourceIds": []
      },
      {
        "id": "conferencia",
        "type": "explanation",
        "heading": "7. Ler antes de confirmar",
        "body": "Em uma situação didática, o enunciado pode mostrar valor e destinatário para conferência. A existência de tecnologia de pagamento não substitui essa leitura. Rapidez não demonstra que toda informação digitada está correta, nem garante recuperação de qualquer erro. Não fazemos promessa de estorno ou de solução para casos reais.",
        "sourceIds": [
          "dp.dp06.bcb.dp.pix"
        ]
      },
      {
        "id": "ex-dados",
        "type": "worked-example",
        "heading": "8. Exemplo resolvido: valor diferente",
        "body": "O combinado fictício é R$35; a tela mostra R$350 antes da confirmação. A divergência está no valor. Identificá-la antes de confirmar enfrenta o problema descrito; presumir que a rapidez do Pix corrigirá a quantia não tem base.",
        "sourceIds": []
      },
      {
        "id": "glossario",
        "type": "glossary",
        "heading": "Vocabulário essencial",
        "body": "Pix: sistema de pagamento instantâneo. Conta: onde se registra o saldo. Agendamento: instrução para data futura. Conclusão: resultado da operação, distinto da mera solicitação.",
        "sourceIds": []
      },
      {
        "id": "resumo",
        "type": "summary",
        "heading": "Recuperação e síntese",
        "body": "Separe saldo, sistema e operação. Leia data, estado, valor e destinatário informados antes de concluir. Se errar, nomeie a confusão, retome o trecho indicado e reconstrua o exemplo com suas palavras. Esta prática exposta não é avaliação independente de retenção.",
        "sourceIds": []
      }
    ],
    "recall": [
      "Separe saldo, sistema e operação.",
      "Leia data, estado, valor e destinatário informados antes de concluir."
    ],
    "questions": [
      {
        "id": "q.dp06.q01",
        "topicId": "banking.dp.pix",
        "prompt": "Pix é apresentado nesta aula como:",
        "options": [
          "Uma conta obrigatória separada.",
          "Um empréstimo automático.",
          "Um sistema de pagamento instantâneo entre contas.",
          "Uma moeda distinta do real."
        ],
        "answer": 2,
        "explanation": "É a função geral descrita pelo BCB.",
        "optionRationales": [
          "Pode ser usado a partir de contas já existentes.",
          "Transferência não implica crédito concedido.",
          "É a função geral descrita pelo BCB.",
          "O sistema não é nova unidade monetária."
        ]
      },
      {
        "id": "q.dp06.q02",
        "topicId": "banking.dp.pix",
        "prompt": "Saldo de R$180, Pix concluído de R$50 e nenhum outro lançamento: qual saldo resulta?",
        "options": [
          "R$130.",
          "R$230.",
          "R$50.",
          "R$180."
        ],
        "answer": 0,
        "explanation": "180 menos 50 resulta em 130.",
        "optionRationales": [
          "180 menos 50 resulta em 130.",
          "Soma indevidamente o valor enviado.",
          "Confunde valor enviado com saldo residual.",
          "Ignora a transferência concluída."
        ]
      },
      {
        "id": "q.dp06.q03",
        "topicId": "banking.dp.pix",
        "prompt": "Qual leitura é adequada para um Pix solicitado no domingo, sem resultado informado?",
        "options": [
          "Só pode funcionar em dia útil.",
          "Obrigatoriamente já foi concluído.",
          "Cria crédito se faltar saldo.",
          "O sistema funciona nesse dia, mas falta comprovação do resultado da operação."
        ],
        "answer": 3,
        "explanation": "Separa disponibilidade do sistema e resultado específico.",
        "optionRationales": [
          "Contradiz a disponibilidade contínua.",
          "Instantaneidade não substitui evidência de conclusão.",
          "Não se pode inferir empréstimo.",
          "Separa disponibilidade do sistema e resultado específico."
        ]
      },
      {
        "id": "q.dp06.q04",
        "topicId": "banking.dp.pix",
        "prompt": "Uma tela na terça confirma Pix agendado para quarta. O que está comprovado naquele momento?",
        "options": [
          "Recebimento na terça.",
          "Agendamento para a data futura.",
          "Conclusão automática de qualquer outra transferência.",
          "Aumento de saldo por empréstimo."
        ],
        "answer": 1,
        "explanation": "É o estado descrito.",
        "optionRationales": [
          "Agendar não prova recebimento imediato.",
          "É o estado descrito.",
          "A tela não trata de outras operações.",
          "Não há crédito informado."
        ]
      },
      {
        "id": "q.dp06.q05",
        "topicId": "banking.dp.pix",
        "prompt": "O combinado é R$35 e a tela mostra R$350 antes da confirmação. Qual é a divergência?",
        "options": [
          "No valor, que deve ser conferido.",
          "Na definição de moeda nacional.",
          "Na impossibilidade de Pix aos domingos.",
          "Na garantia de correção automática pelo sistema."
        ],
        "answer": 0,
        "explanation": "Compara corretamente os dois números.",
        "optionRationales": [
          "Compara corretamente os dois números.",
          "O caso não muda a moeda.",
          "O dia não é o problema descrito.",
          "Não existe essa garantia no caso."
        ]
      },
      {
        "id": "q.dp06.q06",
        "topicId": "banking.dp.pix",
        "prompt": "A disponibilidade do Pix todos os dias permite concluir que:",
        "options": [
          "Todas as solicitações passam por qualquer controle.",
          "Toda conta tem saldo suficiente.",
          "O serviço pode ser usado nesses dias, observadas as condições da operação.",
          "Nenhum dado precisa ser conferido."
        ],
        "answer": 2,
        "explanation": "Mantém a distinção central.",
        "optionRationales": [
          "Disponibilidade não dispensa controles.",
          "Saldo é condição específica da conta.",
          "Mantém a distinção central.",
          "Rapidez não substitui leitura."
        ]
      },
      {
        "id": "q.dp06.q07",
        "topicId": "banking.dp.pix",
        "prompt": "Segundo a apresentação geral do BCB, o Pix pode movimentar recursos a partir de:",
        "options": [
          "Somente uma conta com o nome Pix.",
          "Contas correntes, de poupança ou pré-pagas.",
          "Somente dinheiro em papel.",
          "Somente empréstimos novos."
        ],
        "answer": 1,
        "explanation": "São as categorias citadas na fonte.",
        "optionRationales": [
          "Não exige criar uma categoria de conta chamada Pix.",
          "São as categorias citadas na fonte.",
          "O sistema transfere entre contas.",
          "Origem dos recursos não exige empréstimo."
        ]
      },
      {
        "id": "q.dp06.q08",
        "topicId": "banking.dp.pix",
        "prompt": "Um aluno apresentou agendamento como prova de recebimento. Qual retomada resolve a confusão?",
        "options": [
          "Supor que todo agendamento já liquidou.",
          "Trocar apenas o nome do recebedor.",
          "Ignorar a data da tela.",
          "Separar data da instrução, data prevista e estado de conclusão."
        ],
        "answer": 3,
        "explanation": "Reconstrói as etapas e sua evidência.",
        "optionRationales": [
          "Repete o erro.",
          "O nome não muda a etapa.",
          "A data é parte da informação necessária.",
          "Reconstrói as etapas e sua evidência."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "dp06-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.dp06.q01": [
          {
            "missionId": "banking.dp.pix",
            "sectionId": "conceito"
          }
        ],
        "q.dp06.q02": [
          {
            "missionId": "banking.dp.pix",
            "sectionId": "ex-conta"
          }
        ],
        "q.dp06.q03": [
          {
            "missionId": "banking.dp.pix",
            "sectionId": "disponibilidade"
          },
          {
            "missionId": "banking.dp.pix",
            "sectionId": "ex-horario"
          }
        ],
        "q.dp06.q04": [
          {
            "missionId": "banking.dp.pix",
            "sectionId": "agendamento"
          },
          {
            "missionId": "banking.dp.pix",
            "sectionId": "ex-agenda"
          }
        ],
        "q.dp06.q05": [
          {
            "missionId": "banking.dp.pix",
            "sectionId": "conferencia"
          },
          {
            "missionId": "banking.dp.pix",
            "sectionId": "ex-dados"
          }
        ],
        "q.dp06.q06": [
          {
            "missionId": "banking.dp.pix",
            "sectionId": "disponibilidade"
          }
        ],
        "q.dp06.q07": [
          {
            "missionId": "banking.dp.pix",
            "sectionId": "conceito"
          }
        ],
        "q.dp06.q08": [
          {
            "missionId": "banking.dp.pix",
            "sectionId": "agendamento"
          },
          {
            "missionId": "banking.dp.pix",
            "sectionId": "ex-agenda"
          },
          {
            "missionId": "banking.dp.pix",
            "sectionId": "resumo"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.dp06",
      "blockId": "banking.digital-payments",
      "prerequisiteId": "banking.dp.arranjos",
      "parametersApproved": false
    }
  },
  {
    "id": "banking.dp.open-finance",
    "topicId": "banking.dp.open-finance",
    "contentVersion": 1,
    "order": 57,
    "title": "Open Banking e Open Finance: escolha e compartilhamento",
    "shortTitle": "DP-07",
    "kind": "lesson",
    "objective": "Explicar compartilhamento autorizado no Open Finance.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "digital-payments-intro-r1",
      "releaseSequence": 5,
      "changeImpact": "new"
    },
    "sourceIds": [
      "dp.dp07.bcb.dp.openfinance"
    ],
    "sections": [
      {
        "id": "conceito",
        "type": "explanation",
        "heading": "1. Dados podem acompanhar a escolha do cliente",
        "body": "Open Banking é a denominação presente no edital histórico BB. O atual Open Finance amplia a perspectiva para serviços financeiros. No compartilhamento de dados do cliente, ele escolhe permitir que uma instituição acesse informações mantidas em outra. Isso pode facilitar comparação e oferta de serviços; não torna os dados públicos.",
        "sourceIds": [
          "dp.dp07.bcb.dp.openfinance"
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
          "dp.dp07.bcb.dp.openfinance"
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
          "dp.dp07.bcb.dp.openfinance"
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
          "dp.dp07.bcb.dp.openfinance"
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
    "recall": [
      "Delimite informação, destinatário e prazo.",
      "Separe autorização de dados, oferta de produto e ordem de pagamento."
    ],
    "questions": [
      {
        "id": "q.dp07.q01",
        "topicId": "banking.dp.open-finance",
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
        ]
      },
      {
        "id": "q.dp07.q02",
        "topicId": "banking.dp.open-finance",
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
        ]
      },
      {
        "id": "q.dp07.q03",
        "topicId": "banking.dp.open-finance",
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
        ]
      },
      {
        "id": "q.dp07.q04",
        "topicId": "banking.dp.open-finance",
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
        ]
      },
      {
        "id": "q.dp07.q05",
        "topicId": "banking.dp.open-finance",
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
        ]
      },
      {
        "id": "q.dp07.q06",
        "topicId": "banking.dp.open-finance",
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
        ]
      },
      {
        "id": "q.dp07.q07",
        "topicId": "banking.dp.open-finance",
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
        ]
      },
      {
        "id": "q.dp07.q08",
        "topicId": "banking.dp.open-finance",
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
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "dp07-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.dp07.q01": [
          {
            "missionId": "banking.dp.open-finance",
            "sectionId": "conceito"
          }
        ],
        "q.dp07.q02": [
          {
            "missionId": "banking.dp.open-finance",
            "sectionId": "controle"
          },
          {
            "missionId": "banking.dp.open-finance",
            "sectionId": "ex-escopo"
          }
        ],
        "q.dp07.q03": [
          {
            "missionId": "banking.dp.open-finance",
            "sectionId": "ex-escolha"
          },
          {
            "missionId": "banking.dp.open-finance",
            "sectionId": "ex-escopo"
          }
        ],
        "q.dp07.q04": [
          {
            "missionId": "banking.dp.open-finance",
            "sectionId": "oferta"
          },
          {
            "missionId": "banking.dp.open-finance",
            "sectionId": "ex-credito"
          }
        ],
        "q.dp07.q05": [
          {
            "missionId": "banking.dp.open-finance",
            "sectionId": "controle"
          }
        ],
        "q.dp07.q06": [
          {
            "missionId": "banking.dp.open-finance",
            "sectionId": "pagamento"
          },
          {
            "missionId": "banking.dp.open-finance",
            "sectionId": "ex-acao"
          }
        ],
        "q.dp07.q07": [
          {
            "missionId": "banking.dp.open-finance",
            "sectionId": "conceito"
          }
        ],
        "q.dp07.q08": [
          {
            "missionId": "banking.dp.open-finance",
            "sectionId": "oferta"
          },
          {
            "missionId": "banking.dp.open-finance",
            "sectionId": "ex-credito"
          },
          {
            "missionId": "banking.dp.open-finance",
            "sectionId": "resumo"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.dp07",
      "blockId": "banking.digital-payments",
      "prerequisiteId": "banking.dp.pix",
      "parametersApproved": false
    }
  },
  {
    "id": "banking.dp.blockchain",
    "topicId": "banking.dp.blockchain",
    "contentVersion": 1,
    "order": 58,
    "title": "Blockchain, criptoativos e moeda eletrônica",
    "shortTitle": "DP-08",
    "kind": "lesson",
    "objective": "Separar tecnologia de registro, ativo e moeda.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "digital-payments-intro-r1",
      "releaseSequence": 5,
      "changeImpact": "new"
    },
    "sourceIds": [
      "dp.dp08.nist.dp.blockchain",
      "dp.dp08.lei.dp.ativos"
    ],
    "sections": [
      {
        "id": "registro",
        "type": "explanation",
        "heading": "1. Comece pelo livro de registros",
        "body": "Blockchain organiza registros em blocos ligados criptograficamente, mantidos de forma distribuída. Participantes seguem regras para aceitar novos registros: consenso. A estrutura ajuda a evidenciar e dificultar alterações indevidas. Não significa que qualquer informação sobre o mundo real se torna verdadeira ao ser registrada.",
        "sourceIds": [
          "dp.dp08.nist.dp.blockchain"
        ]
      },
      {
        "id": "ex-registro",
        "type": "worked-example",
        "heading": "2. Exemplo resolvido: registrar não é verificar o mundo",
        "body": "Um sistema registra que uma mercadoria foi entregue porque recebeu essa informação de uma fonte externa. Se a fonte informou algo falso, preservar o registro não prova que a entrega ocorreu. É preciso distinguir integridade do registro e veracidade do fato informado.",
        "sourceIds": []
      },
      {
        "id": "redes",
        "type": "explanation",
        "heading": "3. Quem pode participar?",
        "body": "Há redes abertas e redes permissionadas. Nas permissionadas, regras limitam participação a pessoas ou entidades autorizadas. Distribuir registros entre participantes não implica necessariamente ausência de governança ou acesso irrestrito. Blockchain é uma família de soluções, não um desenho único.",
        "sourceIds": [
          "dp.dp08.nist.dp.blockchain"
        ]
      },
      {
        "id": "ex-rede",
        "type": "worked-example",
        "heading": "4. Exemplo resolvido: rede de instituições",
        "body": "No caso fictício, cinco instituições mantêm cópias e somente participantes autorizados validam registros. Trata-se de uma rede distribuída com participação permissionada. O número de cópias não transforma a validação em acesso livre para qualquer pessoa.",
        "sourceIds": []
      },
      {
        "id": "ativos",
        "type": "explanation",
        "heading": "5. Tecnologia não é o próprio ativo",
        "body": "Criptoativos são representações digitais que podem empregar criptografia e registros distribuídos. Seus direitos e riscos dependem do caso. No Brasil, a Lei 14.478 define ativo virtual para seus próprios efeitos e exclui, entre outros, moedas nacionais/estrangeiras, moeda eletrônica e representações já regidas como valores mobiliários ou ativos financeiros. Não se deve chamar todo saldo digital de ativo virtual dessa lei.",
        "sourceIds": [
          "dp.dp08.lei.dp.ativos",
          "dp.dp08.nist.dp.blockchain"
        ]
      },
      {
        "id": "ex-saldo",
        "type": "worked-example",
        "heading": "6. Exemplo resolvido: valor na tela",
        "body": "O enunciado informa expressamente que um saldo é moeda eletrônica nos termos da legislação de pagamentos. Estar em uma tela não o inclui automaticamente na definição de ativo virtual da Lei 14.478: essa categoria é expressamente excluída. O caso fornece a natureza; não estamos classificando um produto real apenas pela aparência.",
        "sourceIds": []
      },
      {
        "id": "risco",
        "type": "explanation",
        "heading": "7. Registro e investimento são perguntas distintas",
        "body": "Uma tecnologia pode registrar transferências, mas não determina sozinha preço futuro, demanda, liquidez, direito de resgate ou responsabilidade do emissor. Antes de inferir garantia, identifique o ativo e os direitos descritos. A aula não recomenda compra nem ensina negociação, custódia ou regras atuais de autorização de prestadores.",
        "sourceIds": []
      },
      {
        "id": "ex-retorno",
        "type": "worked-example",
        "heading": "8. Exemplo resolvido: a promessa sem fundamento",
        "body": "O anúncio fictício diz “usa blockchain, portanto o preço só sobe”. A conclusão não decorre da tecnologia: manter um registro e valorizar um ativo são fenômenos diferentes. Sem outras informações, não há fundamento para retorno garantido.",
        "sourceIds": []
      },
      {
        "id": "glossario",
        "type": "glossary",
        "heading": "Vocabulário essencial",
        "body": "Blockchain: registro distribuído encadeado. Consenso: regras/processo de aceitação dos registros. Permissionada: participação condicionada a autorização. Ativo virtual: categoria legal com definição e exclusões próprias. Moeda eletrônica: categoria distinta na legislação citada.",
        "sourceIds": []
      },
      {
        "id": "resumo",
        "type": "summary",
        "heading": "Recuperação e síntese",
        "body": "Pergunte separadamente como se registra e que direito se representa. Não deduza valor futuro, legalidade completa ou fato externo apenas pela tecnologia. Se errar, nomeie a confusão, retome o trecho indicado e reconstrua o exemplo com suas palavras. Esta prática exposta não é avaliação independente de retenção.",
        "sourceIds": []
      }
    ],
    "recall": [
      "Pergunte separadamente como se registra e que direito se representa.",
      "Não deduza valor futuro, legalidade completa ou fato externo apenas pela tecnologia."
    ],
    "questions": [
      {
        "id": "q.dp08.q01",
        "topicId": "banking.dp.blockchain",
        "prompt": "Qual descrição corresponde à ideia introdutória de blockchain?",
        "options": [
          "Registro distribuído em blocos vinculados por mecanismos criptográficos.",
          "Garantia de valorização de qualquer ativo.",
          "Uma conta de poupança obrigatória.",
          "Prova de que todo evento externo registrado é verdadeiro."
        ],
        "answer": 0,
        "explanation": "Descreve a organização do registro.",
        "optionRationales": [
          "Descreve a organização do registro.",
          "Preço não decorre da tecnologia de registro.",
          "Não é definição de produto bancário.",
          "Uma fonte externa pode informar algo falso."
        ]
      },
      {
        "id": "q.dp08.q02",
        "topicId": "banking.dp.blockchain",
        "prompt": "Uma entrega falsa é informada ao sistema e registrada de modo íntegro. O registro, sozinho:",
        "options": [
          "Torna a entrega verdadeira.",
          "Garante qualidade da mercadoria.",
          "Prova lucro do vendedor.",
          "Não comprova a veracidade do evento externo."
        ],
        "answer": 3,
        "explanation": "Integridade e verdade externa são dimensões diferentes.",
        "optionRationales": [
          "Persistir informação não muda o fato.",
          "Qualidade é outro fato não demonstrado.",
          "Não há dados de custos e receita.",
          "Integridade e verdade externa são dimensões diferentes."
        ]
      },
      {
        "id": "q.dp08.q03",
        "topicId": "banking.dp.blockchain",
        "prompt": "Cinco instituições mantêm cópias; somente autorizados validam. Qual descrição é adequada?",
        "options": [
          "Rede sem qualquer regra.",
          "Rede distribuída permissionada.",
          "Acesso de validação irrestrito a todos.",
          "Impossibilidade de distribuição."
        ],
        "answer": 1,
        "explanation": "Combina distribuição e controle de participação.",
        "optionRationales": [
          "Há regras de autorização.",
          "Combina distribuição e controle de participação.",
          "Contradiz o enunciado.",
          "Distribuição não exige participação irrestrita."
        ]
      },
      {
        "id": "q.dp08.q04",
        "topicId": "banking.dp.blockchain",
        "prompt": "O caso qualifica expressamente um saldo como moeda eletrônica da legislação de pagamentos. Para a Lei 14.478:",
        "options": [
          "O saldo entra na definição só porque é digital.",
          "Toda moeda eletrônica passa a ser ação.",
          "Moeda eletrônica está entre as exclusões da definição de ativo virtual.",
          "A tela determina um retorno garantido."
        ],
        "answer": 2,
        "explanation": "Aplica a distinção ao dado expresso do caso.",
        "optionRationales": [
          "Ignora uma exclusão expressa.",
          "Naturezas jurídicas não se trocam pela tela.",
          "Aplica a distinção ao dado expresso do caso.",
          "Tecnologia não garante retorno."
        ]
      },
      {
        "id": "q.dp08.q05",
        "topicId": "banking.dp.blockchain",
        "prompt": "A tecnologia blockchain, isoladamente, garante qual destas afirmações?",
        "options": [
          "Preço sempre crescente.",
          "Resgate sem qualquer condição.",
          "Ausência de risco financeiro.",
          "Nenhuma dessas três garantias financeiras decorre apenas da tecnologia."
        ],
        "answer": 3,
        "explanation": "Evita transferir uma propriedade do registro ao investimento.",
        "optionRationales": [
          "Preço depende de outros fatores.",
          "Resgate depende de direitos e condições.",
          "Registro não elimina risco financeiro.",
          "Evita transferir uma propriedade do registro ao investimento."
        ]
      },
      {
        "id": "q.dp08.q06",
        "topicId": "banking.dp.blockchain",
        "prompt": "Na introdução, consenso é:",
        "options": [
          "O processo de aceitar registros conforme regras da rede.",
          "Promessa de lucro unânime.",
          "Dispensa de toda governança.",
          "A taxa de juros de uma conta."
        ],
        "answer": 0,
        "explanation": "É a função descrita.",
        "optionRationales": [
          "É a função descrita.",
          "Não se trata de retorno.",
          "As regras são parte do processo.",
          "Não é uma taxa financeira."
        ]
      },
      {
        "id": "q.dp08.q07",
        "topicId": "banking.dp.blockchain",
        "prompt": "Uma representação digital de valor mobiliário passa automaticamente ao regime da Lei 14.478 só por ser digital?",
        "options": [
          "Sim, pois a tecnologia apaga a natureza do ativo.",
          "Não; é necessário respeitar as exclusões e o regime próprio informados na lei.",
          "Sim, e perde qualquer direito anterior.",
          "Sim, tornando-se moeda nacional."
        ],
        "answer": 1,
        "explanation": "Preserva a distinção jurídica ensinada.",
        "optionRationales": [
          "A forma digital não elimina o regime.",
          "Preserva a distinção jurídica ensinada.",
          "A perda de direitos não decorre da forma.",
          "Valor mobiliário não se torna moeda por digitalização."
        ]
      },
      {
        "id": "q.dp08.q08",
        "topicId": "banking.dp.blockchain",
        "prompt": "Para recuperar o erro “blockchain implica lucro certo”, o aluno deve:",
        "options": [
          "Repetir a promessa com outro ativo.",
          "Ignorar o direito representado.",
          "Separar integridade do registro, direitos do ativo e seu possível resultado financeiro.",
          "Usar apenas o nome comercial."
        ],
        "answer": 2,
        "explanation": "Refaz as distinções necessárias.",
        "optionRationales": [
          "Mantém a inferência indevida.",
          "Os direitos são relevantes.",
          "Refaz as distinções necessárias.",
          "Nome não prova garantia."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "dp08-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.dp08.q01": [
          {
            "missionId": "banking.dp.blockchain",
            "sectionId": "registro"
          }
        ],
        "q.dp08.q02": [
          {
            "missionId": "banking.dp.blockchain",
            "sectionId": "ex-registro"
          }
        ],
        "q.dp08.q03": [
          {
            "missionId": "banking.dp.blockchain",
            "sectionId": "redes"
          },
          {
            "missionId": "banking.dp.blockchain",
            "sectionId": "ex-rede"
          }
        ],
        "q.dp08.q04": [
          {
            "missionId": "banking.dp.blockchain",
            "sectionId": "ativos"
          },
          {
            "missionId": "banking.dp.blockchain",
            "sectionId": "ex-saldo"
          }
        ],
        "q.dp08.q05": [
          {
            "missionId": "banking.dp.blockchain",
            "sectionId": "risco"
          },
          {
            "missionId": "banking.dp.blockchain",
            "sectionId": "ex-retorno"
          }
        ],
        "q.dp08.q06": [
          {
            "missionId": "banking.dp.blockchain",
            "sectionId": "registro"
          },
          {
            "missionId": "banking.dp.blockchain",
            "sectionId": "redes"
          }
        ],
        "q.dp08.q07": [
          {
            "missionId": "banking.dp.blockchain",
            "sectionId": "ativos"
          }
        ],
        "q.dp08.q08": [
          {
            "missionId": "banking.dp.blockchain",
            "sectionId": "risco"
          },
          {
            "missionId": "banking.dp.blockchain",
            "sectionId": "ex-retorno"
          },
          {
            "missionId": "banking.dp.blockchain",
            "sectionId": "resumo"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.dp08",
      "blockId": "banking.digital-payments",
      "prerequisiteId": "banking.dp.open-finance",
      "parametersApproved": false
    }
  },
  {
    "id": "banking.dp.cbdc",
    "topicId": "banking.dp.cbdc",
    "contentVersion": 1,
    "order": 59,
    "title": "CBDC e Drex: conceito, proposta e limites",
    "shortTitle": "DP-09",
    "kind": "lesson",
    "objective": "Distinguir moeda digital de banco central, pagamento e ativo privado.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "digital-payments-intro-r1",
      "releaseSequence": 5,
      "changeImpact": "new"
    },
    "sourceIds": [
      "dp.dp09.bcb.dp.drex",
      "dp.dp09.bcb.dp.drex.conceito",
      "dp.dp09.bcb.dp.drex.lancamento",
      "dp.dp09.bcb.dp.pix",
      "dp.dp09.nist.dp.blockchain"
    ],
    "sections": [
      {
        "id": "cbdc",
        "type": "explanation",
        "heading": "1. Emissor e função vêm antes da tecnologia",
        "body": "CBDC é a sigla inglesa para moeda digital de banco central. O BCB apresenta Drex como o real em formato digital em uma plataforma para serviços financeiros. Isso é diferente de chamar qualquer criptoativo privado de moeda emitida pelo BC. Pix, por sua vez, é sistema de pagamento: não é uma CBDC.",
        "sourceIds": [
          "dp.dp09.bcb.dp.drex.conceito",
          "dp.dp09.bcb.dp.pix"
        ]
      },
      {
        "id": "ex-distincao",
        "type": "worked-example",
        "heading": "2. Exemplo resolvido: três descrições",
        "body": "O caso traz: uma transferência via Pix, um ativo digital privado e a proposta de moeda digital de banco central. A primeira é um pagamento; a segunda precisa ser identificada por seus direitos e emissor; a terceira corresponde ao conceito de CBDC. A palavra “digital” em comum não iguala as três.",
        "sourceIds": []
      },
      {
        "id": "intermediacao",
        "type": "explanation",
        "heading": "3. Atacado e varejo não são a mesma relação",
        "body": "A FAQ do BC distingue emissão pelo próprio Banco Central para liquidação entre instituições autorizadas e emissão pelas instituições autorizadas nas transações de varejo com clientes. Por isso, não se deve dizer que todo saldo do cliente na proposta equivale a uma conta direta no BC. A página geral prevê acesso intermediado por instituição autorizada.",
        "sourceIds": [
          "dp.dp09.bcb.dp.drex",
          "dp.dp09.bcb.dp.drex.conceito"
        ]
      },
      {
        "id": "ex-intermediario",
        "type": "worked-example",
        "heading": "4. Exemplo resolvido: ler o desenho informado",
        "body": "Uma descrição da proposta informa que o cliente acessará serviços por uma instituição autorizada. O enunciado não diz que ele abriu conta direta no Banco Central. A conclusão adequada preserva a intermediação e não transforma a instituição do cliente no próprio emissor da moeda de atacado.",
        "sourceIds": []
      },
      {
        "id": "ativos",
        "type": "explanation",
        "heading": "5. Representar um ativo e combinar condições",
        "body": "Tokenização, nesta introdução, significa representar digitalmente um ativo ou direito. A representação não explica sozinha qual direito existe: isso deve estar definido. Uma transação programada pode condicionar um movimento a outro, conforme regras e informações recebidas. Não é garantia de ausência de erro ou de verdade sobre fatos externos, retomando DP-08.",
        "sourceIds": [
          "dp.dp09.bcb.dp.drex",
          "dp.dp09.nist.dp.blockchain"
        ]
      },
      {
        "id": "ex-condicoes",
        "type": "worked-example",
        "heading": "6. Exemplo resolvido: entrega contra pagamento",
        "body": "Em um cenário didático, a transferência de um direito digital só se conclui se o pagamento correspondente também se concluir, conforme as regras informadas. A combinação pode reduzir o risco de uma parte entregar sem a contrapartida naquele mecanismo. Não prova que o direito é válido no mundo real nem elimina todo risco tecnológico ou jurídico. O cenário ilustra uma possibilidade, não uma função pública disponível aqui.",
        "sourceIds": []
      },
      {
        "id": "estagio",
        "type": "explanation",
        "heading": "7. Proposta não é serviço público já disponível",
        "body": "A página geral consultada em 01/10/2026 descreve funcionalidades futuras. A FAQ de lançamento, cuja atualização exibida é 20/02/2024, continua sem indicar data específica. Esse registro de fonte não permite prometer acesso, calendário ou funcionalidades de produção. Antes de eventual publicação desta aula, o estágio deve ser revalidado no BCB. Não incorporamos cronograma de notícia antiga.",
        "sourceIds": [
          "dp.dp09.bcb.dp.drex",
          "dp.dp09.bcb.dp.drex.lancamento"
        ]
      },
      {
        "id": "ex-anuncio",
        "type": "worked-example",
        "heading": "8. Exemplo resolvido: promessa e evidência",
        "body": "Um texto anuncia que a plataforma “poderá facilitar transações com ativos digitais”. Essa frase expressa uma possibilidade de desenho. Sem confirmação adicional, é incorreto afirmar que toda pessoa já dispõe da função, que haverá retorno financeiro ou que toda cédula foi substituída.",
        "sourceIds": []
      },
      {
        "id": "glossario",
        "type": "glossary",
        "heading": "Vocabulário essencial",
        "body": "CBDC: moeda digital de banco central. Atacado: liquidação entre instituições no desenho descrito. Varejo: relação com clientes intermediada por instituições. Tokenização: representação digital de ativo/direito. Piloto: ambiente de teste, distinto de disponibilidade pública.",
        "sourceIds": []
      },
      {
        "id": "resumo",
        "type": "summary",
        "heading": "Recuperação e síntese",
        "body": "Separe moeda, sistema de pagamento e ativo privado. Identifique emissor, intermediário e estágio confirmado. Se errar, nomeie a confusão, retome o trecho indicado e reconstrua o exemplo com suas palavras. Esta prática exposta não é avaliação independente de retenção.",
        "sourceIds": []
      }
    ],
    "recall": [
      "Separe moeda, sistema de pagamento e ativo privado.",
      "Identifique emissor, intermediário e estágio confirmado."
    ],
    "questions": [
      {
        "id": "q.dp09.q01",
        "topicId": "banking.dp.cbdc",
        "prompt": "CBDC designa:",
        "options": [
          "Qualquer aplicativo bancário.",
          "Moeda digital de banco central.",
          "Todo ativo privado que usa criptografia.",
          "Uma comissão de marketplace."
        ],
        "answer": 1,
        "explanation": "É a definição da sigla.",
        "optionRationales": [
          "Aplicativo é canal.",
          "É a definição da sigla.",
          "Emissor e natureza são relevantes.",
          "É outra categoria econômica."
        ]
      },
      {
        "id": "q.dp09.q02",
        "topicId": "banking.dp.cbdc",
        "prompt": "Qual distinção entre Pix e CBDC é adequada?",
        "options": [
          "Ambos são necessariamente a mesma moeda privada.",
          "Pix é uma conta direta no BC.",
          "Toda CBDC é apenas um agendamento.",
          "Pix é sistema de pagamento; CBDC é moeda digital de banco central."
        ],
        "answer": 3,
        "explanation": "Separa sistema e moeda.",
        "optionRationales": [
          "Confunde função e emissor.",
          "Pix não é essa conta.",
          "Moeda não se define como instrução futura.",
          "Separa sistema e moeda."
        ]
      },
      {
        "id": "q.dp09.q03",
        "topicId": "banking.dp.cbdc",
        "prompt": "A proposta informa acesso do cliente por instituição autorizada. Pode-se concluir conta direta de cada cliente no BC?",
        "options": [
          "Não; a intermediação informada deve ser preservada.",
          "Sim, porque tudo é digital.",
          "Sim, porque qualquer saldo tem o mesmo emissor.",
          "Sim, porque o aplicativo substitui a instituição."
        ],
        "answer": 0,
        "explanation": "Evita apagar uma diferença do desenho.",
        "optionRationales": [
          "Evita apagar uma diferença do desenho.",
          "Digital não define relação jurídica.",
          "A FAQ distingue os níveis de emissão.",
          "Canal não substitui automaticamente participante."
        ]
      },
      {
        "id": "q.dp09.q04",
        "topicId": "banking.dp.cbdc",
        "prompt": "No recorte da aula, tokenizar um direito significa:",
        "options": [
          "Garantir que ele sempre valoriza.",
          "Eliminar a necessidade de definir o direito.",
          "Representá-lo digitalmente, sem deduzir direitos ou garantias não descritos.",
          "Converter qualquer bem em moeda nacional."
        ],
        "answer": 2,
        "explanation": "Mantém representação e natureza distintas.",
        "optionRationales": [
          "Representação não é retorno.",
          "O direito precisa ser identificado.",
          "Mantém representação e natureza distintas.",
          "Não há conversão automática dessa natureza."
        ]
      },
      {
        "id": "q.dp09.q05",
        "topicId": "banking.dp.cbdc",
        "prompt": "Entrega e pagamento se condicionam mutuamente no exemplo. Qual conclusão respeita o alcance do mecanismo?",
        "options": [
          "Todos os riscos desapareceram.",
          "Pode reduzir risco de entrega sem contrapartida naquele desenho, sem provar ausência de outros riscos.",
          "O direito externo ficou necessariamente verdadeiro.",
          "A função já está disponível a todo cidadão."
        ],
        "answer": 1,
        "explanation": "Reconhece a função e o limite.",
        "optionRationales": [
          "Há riscos fora do mecanismo.",
          "Reconhece a função e o limite.",
          "Programação não prova fato externo.",
          "O exemplo é hipotético."
        ]
      },
      {
        "id": "q.dp09.q06",
        "topicId": "banking.dp.cbdc",
        "prompt": "Uma página diz que um serviço “poderá facilitar” transações. Isso comprova:",
        "options": [
          "Acesso atual de toda a população.",
          "Retorno financeiro garantido.",
          "Fim das cédulas.",
          "Uma possibilidade anunciada, sem demonstrar essas três conclusões."
        ],
        "answer": 3,
        "explanation": "Lê o tempo e o alcance da afirmação.",
        "optionRationales": [
          "Disponibilidade exige confirmação própria.",
          "Facilidade não é retorno.",
          "Não decorre da frase.",
          "Lê o tempo e o alcance da afirmação."
        ]
      },
      {
        "id": "q.dp09.q07",
        "topicId": "banking.dp.cbdc",
        "prompt": "Por que distinguir atacado e varejo na proposta descrita?",
        "options": [
          "Para não atribuir ao saldo do cliente a mesma relação direta de emissão/liquidação entre instituições no BC.",
          "Porque todo varejo vira banco central.",
          "Porque a intermediação elimina a moeda.",
          "Porque Pix deixa de ser pagamento."
        ],
        "answer": 0,
        "explanation": "Preserva emissor, intermediário e função.",
        "optionRationales": [
          "Preserva emissor, intermediário e função.",
          "Não há essa mudança.",
          "Intermediação não elimina o conceito monetário.",
          "A distinção não altera a função do Pix."
        ]
      },
      {
        "id": "q.dp09.q08",
        "topicId": "banking.dp.cbdc",
        "prompt": "O aluno tomou um caso hipotético de Drex como função pública já disponível. Deve:",
        "options": [
          "Inventar uma data para completar o texto.",
          "Presumir que qualquer anúncio basta.",
          "Separar desenho, teste e disponibilidade confirmada, consultando a fonte atual antes de publicar.",
          "Repetir um cronograma antigo sem verificar."
        ],
        "answer": 2,
        "explanation": "Recupera a distinção temporal e a necessidade de evidência.",
        "optionRationales": [
          "Criaria informação não comprovada.",
          "Anúncio não equivale a disponibilidade.",
          "Recupera a distinção temporal e a necessidade de evidência.",
          "A data antiga não confirma o estágio atual."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "dp09-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.dp09.q01": [
          {
            "missionId": "banking.dp.cbdc",
            "sectionId": "cbdc"
          }
        ],
        "q.dp09.q02": [
          {
            "missionId": "banking.dp.cbdc",
            "sectionId": "cbdc"
          },
          {
            "missionId": "banking.dp.cbdc",
            "sectionId": "ex-distincao"
          }
        ],
        "q.dp09.q03": [
          {
            "missionId": "banking.dp.cbdc",
            "sectionId": "intermediacao"
          },
          {
            "missionId": "banking.dp.cbdc",
            "sectionId": "ex-intermediario"
          }
        ],
        "q.dp09.q04": [
          {
            "missionId": "banking.dp.cbdc",
            "sectionId": "ativos"
          }
        ],
        "q.dp09.q05": [
          {
            "missionId": "banking.dp.cbdc",
            "sectionId": "ex-condicoes"
          }
        ],
        "q.dp09.q06": [
          {
            "missionId": "banking.dp.cbdc",
            "sectionId": "estagio"
          },
          {
            "missionId": "banking.dp.cbdc",
            "sectionId": "ex-anuncio"
          }
        ],
        "q.dp09.q07": [
          {
            "missionId": "banking.dp.cbdc",
            "sectionId": "intermediacao"
          }
        ],
        "q.dp09.q08": [
          {
            "missionId": "banking.dp.cbdc",
            "sectionId": "estagio"
          },
          {
            "missionId": "banking.dp.cbdc",
            "sectionId": "ex-anuncio"
          },
          {
            "missionId": "banking.dp.cbdc",
            "sectionId": "resumo"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.dp09",
      "blockId": "banking.digital-payments",
      "prerequisiteId": "banking.dp.blockchain",
      "parametersApproved": false
    }
  },
  {
    "id": "banking.dp.correspondentes",
    "topicId": "banking.dp.correspondentes",
    "contentVersion": 1,
    "order": 60,
    "title": "Correspondentes: atendimento por conta da contratante",
    "shortTitle": "DP-10",
    "kind": "lesson",
    "objective": "Identificar correspondente e instituição contratante.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "digital-payments-intro-r1",
      "releaseSequence": 5,
      "changeImpact": "new"
    },
    "sourceIds": [
      "dp.dp10.cmn.dp.correspondentes"
    ],
    "sections": [
      {
        "id": "papel",
        "type": "explanation",
        "heading": "1. Quem atende e por conta de quem?",
        "body": "Um correspondente presta atividades de atendimento a clientes e usuários da instituição que o contrata, dentro do objeto contratual. Atua por conta e sob diretrizes dessa instituição. O ponto de atendimento não se torna uma agência própria apenas por oferecer esses serviços. Há também correspondência por plataforma eletrônica.",
        "sourceIds": [
          "dp.dp10.cmn.dp.correspondentes"
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
          "dp.dp10.cmn.dp.correspondentes"
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
          "dp.dp10.cmn.dp.correspondentes"
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
          "dp.dp10.cmn.dp.correspondentes"
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
    "recall": [
      "Identifique contratado, contratante e atividade prevista.",
      "Separe recepção da proposta e resultado da análise."
    ],
    "questions": [
      {
        "id": "q.dp10.q01",
        "topicId": "banking.dp.correspondentes",
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
        ]
      },
      {
        "id": "q.dp10.q02",
        "topicId": "banking.dp.correspondentes",
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
        ]
      },
      {
        "id": "q.dp10.q03",
        "topicId": "banking.dp.correspondentes",
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
        ]
      },
      {
        "id": "q.dp10.q04",
        "topicId": "banking.dp.correspondentes",
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
        ]
      },
      {
        "id": "q.dp10.q05",
        "topicId": "banking.dp.correspondentes",
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
        ]
      },
      {
        "id": "q.dp10.q06",
        "topicId": "banking.dp.correspondentes",
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
        ]
      },
      {
        "id": "q.dp10.q07",
        "topicId": "banking.dp.correspondentes",
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
        ]
      },
      {
        "id": "q.dp10.q08",
        "topicId": "banking.dp.correspondentes",
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
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "dp10-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.dp10.q01": [
          {
            "missionId": "banking.dp.correspondentes",
            "sectionId": "papel"
          },
          {
            "missionId": "banking.dp.correspondentes",
            "sectionId": "ex-loja"
          }
        ],
        "q.dp10.q02": [
          {
            "missionId": "banking.dp.correspondentes",
            "sectionId": "responsabilidade"
          },
          {
            "missionId": "banking.dp.correspondentes",
            "sectionId": "ex-responsabilidade"
          }
        ],
        "q.dp10.q03": [
          {
            "missionId": "banking.dp.correspondentes",
            "sectionId": "propostas"
          },
          {
            "missionId": "banking.dp.correspondentes",
            "sectionId": "ex-proposta"
          }
        ],
        "q.dp10.q04": [
          {
            "missionId": "banking.dp.correspondentes",
            "sectionId": "papel"
          },
          {
            "missionId": "banking.dp.correspondentes",
            "sectionId": "identificacao"
          }
        ],
        "q.dp10.q05": [
          {
            "missionId": "banking.dp.correspondentes",
            "sectionId": "identificacao"
          },
          {
            "missionId": "banking.dp.correspondentes",
            "sectionId": "ex-site"
          }
        ],
        "q.dp10.q06": [
          {
            "missionId": "banking.dp.correspondentes",
            "sectionId": "responsabilidade"
          }
        ],
        "q.dp10.q07": [
          {
            "missionId": "banking.dp.correspondentes",
            "sectionId": "ex-proposta"
          },
          {
            "missionId": "banking.dp.correspondentes",
            "sectionId": "ex-site"
          }
        ],
        "q.dp10.q08": [
          {
            "missionId": "banking.dp.correspondentes",
            "sectionId": "papel"
          },
          {
            "missionId": "banking.dp.correspondentes",
            "sectionId": "propostas"
          },
          {
            "missionId": "banking.dp.correspondentes",
            "sectionId": "resumo"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.dp10",
      "blockId": "banking.digital-payments",
      "prerequisiteId": "banking.dp.cbdc",
      "parametersApproved": false
    }
  },
  {
    "id": "banking.dp.marketplace",
    "topicId": "banking.dp.marketplace",
    "contentVersion": 1,
    "order": 61,
    "title": "Marketplace: plataforma, oferta e pagamento",
    "shortTitle": "DP-11",
    "kind": "lesson",
    "objective": "Reconhecer intermediação entre ofertantes e compradores em marketplace.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "digital-payments-intro-r1",
      "releaseSequence": 5,
      "changeImpact": "new"
    },
    "sourceIds": [
      "dp.dp11.bis.dp.bigtech"
    ],
    "sections": [
      {
        "id": "plataforma",
        "type": "explanation",
        "heading": "1. Uma vitrine com mais de um ofertante",
        "body": "No recorte didático, marketplace é uma plataforma que aproxima ofertantes e compradores. A mesma plataforma pode também apresentar ofertas próprias: é necessário identificar quem vende em cada caso. O BIS analisa plataformas digitais que conectam atividades e participantes; aqui aplicamos essa ideia à leitura de uma vitrine, sem classificar empresas reais.",
        "sourceIds": [
          "dp.dp11.bis.dp.bigtech"
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
          "dp.dp11.bis.dp.bigtech"
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
    "recall": [
      "Mapeie plataforma, vendedor e pagamento.",
      "Compare a mesma base de preço e separe comissão de lucro."
    ],
    "questions": [
      {
        "id": "q.dp11.q01",
        "topicId": "banking.dp.marketplace",
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
        ]
      },
      {
        "id": "q.dp11.q02",
        "topicId": "banking.dp.marketplace",
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
        ]
      },
      {
        "id": "q.dp11.q03",
        "topicId": "banking.dp.marketplace",
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
        ]
      },
      {
        "id": "q.dp11.q04",
        "topicId": "banking.dp.marketplace",
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
        ]
      },
      {
        "id": "q.dp11.q05",
        "topicId": "banking.dp.marketplace",
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
        ]
      },
      {
        "id": "q.dp11.q06",
        "topicId": "banking.dp.marketplace",
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
        ]
      },
      {
        "id": "q.dp11.q07",
        "topicId": "banking.dp.marketplace",
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
        ]
      },
      {
        "id": "q.dp11.q08",
        "topicId": "banking.dp.marketplace",
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
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "dp11-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.dp11.q01": [
          {
            "missionId": "banking.dp.marketplace",
            "sectionId": "plataforma"
          },
          {
            "missionId": "banking.dp.marketplace",
            "sectionId": "ex-vitrine"
          }
        ],
        "q.dp11.q02": [
          {
            "missionId": "banking.dp.marketplace",
            "sectionId": "papeis"
          },
          {
            "missionId": "banking.dp.marketplace",
            "sectionId": "ex-pagamento"
          }
        ],
        "q.dp11.q03": [
          {
            "missionId": "banking.dp.marketplace",
            "sectionId": "ex-comissao"
          }
        ],
        "q.dp11.q04": [
          {
            "missionId": "banking.dp.marketplace",
            "sectionId": "remuneracao"
          },
          {
            "missionId": "banking.dp.marketplace",
            "sectionId": "ex-comissao"
          }
        ],
        "q.dp11.q05": [
          {
            "missionId": "banking.dp.marketplace",
            "sectionId": "ex-comparacao"
          }
        ],
        "q.dp11.q06": [
          {
            "missionId": "banking.dp.marketplace",
            "sectionId": "rede"
          }
        ],
        "q.dp11.q07": [
          {
            "missionId": "banking.dp.marketplace",
            "sectionId": "plataforma"
          },
          {
            "missionId": "banking.dp.marketplace",
            "sectionId": "papeis"
          }
        ],
        "q.dp11.q08": [
          {
            "missionId": "banking.dp.marketplace",
            "sectionId": "ex-comparacao"
          },
          {
            "missionId": "banking.dp.marketplace",
            "sectionId": "resumo"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.dp11",
      "blockId": "banking.digital-payments",
      "prerequisiteId": "banking.dp.correspondentes",
      "parametersApproved": false
    }
  },
  {
    "id": "banking.dp.segmentacao",
    "topicId": "banking.dp.segmentacao",
    "contentVersion": 1,
    "order": 62,
    "title": "Segmentação e interação nos canais digitais",
    "shortTitle": "DP-12",
    "kind": "lesson",
    "objective": "Interpretar segmentação como agrupamento para atender necessidades.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "digital-payments-intro-r1",
      "releaseSequence": 5,
      "changeImpact": "new"
    },
    "sourceIds": [
      "dp.dp12.bis.dp.bigtech",
      "dp.dp12.lei.dp.lgpd"
    ],
    "sections": [
      {
        "id": "segmentos",
        "type": "explanation",
        "heading": "1. Agrupar para compreender necessidades",
        "body": "Nesta aula, segmentar significa organizar grupos por características relevantes para uma finalidade de atendimento ou oferta. Pode-se considerar uma necessidade declarada ou um comportamento observado no cenário. O grupo ajuda a planejar a interação; não descreve tudo sobre cada pessoa nem autoriza tratá-la por estereótipos. O papel de dados em plataformas é discutido pelo BIS.",
        "sourceIds": [
          "dp.dp12.bis.dp.bigtech"
        ]
      },
      {
        "id": "ex-necessidade",
        "type": "worked-example",
        "heading": "2. Exemplo resolvido: necessidades distintas",
        "body": "No caso fictício, um grupo quer consultar despesas e outro procura informação sobre recebimentos do pequeno negócio. Organizar conteúdos por essas necessidades pode ajudar. Não se conclui que todos de um grupo têm a mesma renda, habilidade digital ou preferência de contato.",
        "sourceIds": []
      },
      {
        "id": "interacao",
        "type": "explanation",
        "heading": "3. Canal, mensagem e resposta",
        "body": "Interação envolve a troca entre instituição e usuário: informação oferecida, dúvidas, resposta e conclusão da necessidade. O canal deve ser avaliado conforme a situação. Uma mensagem enviada não prova compreensão, e um acesso ao aplicativo não prova satisfação. Observe a evidência efetivamente disponível.",
        "sourceIds": []
      },
      {
        "id": "ex-canal",
        "type": "worked-example",
        "heading": "4. Exemplo resolvido: preferência informada",
        "body": "Uma pessoa do cenário informa que prefere receber uma explicação escrita para consultar depois. Outra solicita conversa para esclarecer uma dúvida. Adequar o formato a essas necessidades é diferente de decidir a preferência de todas as pessoas pela idade ou pelo tipo de telefone.",
        "sourceIds": []
      },
      {
        "id": "dados",
        "type": "explanation",
        "heading": "5. Dados têm finalidade e limites",
        "body": "A LGPD estabelece princípios como finalidade, adequação, necessidade e não discriminação. Para uma finalidade determinada, o tratamento deve se limitar ao necessário e ter base legal aplicável. Consentimento é uma das bases previstas, não a única. Um interesse comercial não autoriza coletar qualquer informação sem examinar essas exigências.",
        "sourceIds": [
          "dp.dp12.lei.dp.lgpd"
        ]
      },
      {
        "id": "ex-minimo",
        "type": "worked-example",
        "heading": "6. Exemplo resolvido: informação que não ajuda a tarefa",
        "body": "A tarefa fictícia é escolher se uma explicação será entregue em texto ou conversa. A preferência de formato é relevante; pedir dados sem relação com essa finalidade não se justifica apenas pela frase “pode servir para algo depois”. O exemplo aplica a ideia de necessidade, sem coletar dados reais ou resolver um caso jurídico individual.",
        "sourceIds": []
      },
      {
        "id": "indicadores",
        "type": "explanation",
        "heading": "7. Medir a etapa certa",
        "body": "Clique, mensagem aberta, resposta recebida e necessidade resolvida são indicadores diferentes. Para comparar resultados, o enunciado precisa informar o que foi contado e qual era o objetivo. Uma campanha com mais cliques não demonstra, sozinha, maior compreensão, contratação adequada ou solução do problema.",
        "sourceIds": []
      },
      {
        "id": "ex-metrica",
        "type": "worked-example",
        "heading": "8. Exemplo resolvido: resultado limitado",
        "body": "O relatório fictício informa que mais pessoas abriram uma mensagem após a mudança de título. O efeito observado é mais aberturas. Sem dados adicionais, não se pode afirmar que todas entenderam a explicação ou que suas solicitações foram resolvidas. O resultado é útil, mas limitado à etapa medida.",
        "sourceIds": []
      },
      {
        "id": "glossario",
        "type": "glossary",
        "heading": "Vocabulário essencial",
        "body": "Segmentação: agrupamento por critérios relevantes a uma finalidade. Interação: troca entre usuário e instituição. Indicador: medida de uma etapa ou resultado definido. Necessidade: limitação ao tratamento pertinente à finalidade. Base legal: hipótese jurídica aplicável ao tratamento.",
        "sourceIds": []
      },
      {
        "id": "resumo",
        "type": "summary",
        "heading": "Recuperação e síntese",
        "body": "Use a característica informada sem inventar toda a pessoa. Relacione o indicador ao objetivo e o dado à finalidade. Se errar, nomeie a confusão, retome o trecho indicado e reconstrua o exemplo com suas palavras. Esta prática exposta não é avaliação independente de retenção.",
        "sourceIds": []
      }
    ],
    "recall": [
      "Use a característica informada sem inventar toda a pessoa.",
      "Relacione o indicador ao objetivo e o dado à finalidade."
    ],
    "questions": [
      {
        "id": "q.dp12.q01",
        "topicId": "banking.dp.segmentacao",
        "prompt": "Agrupar usuários por necessidade declarada de consulta ou recebimento é, no recorte didático:",
        "options": [
          "Prova de que todos do grupo são iguais.",
          "Autorização para usar qualquer dado.",
          "Uma forma de segmentar para organizar atendimento.",
          "Garantia de contratação de um produto."
        ],
        "answer": 2,
        "explanation": "Relaciona agrupamento e necessidade.",
        "optionRationales": [
          "A característica não descreve toda a pessoa.",
          "Finalidade e base legal continuam relevantes.",
          "Relaciona agrupamento e necessidade.",
          "Não há garantia de resultado comercial."
        ]
      },
      {
        "id": "q.dp12.q02",
        "topicId": "banking.dp.segmentacao",
        "prompt": "A pessoa informa preferência por explicação escrita. Qual resposta se apoia no dado do caso?",
        "options": [
          "Considerar esse formato para a necessidade descrita.",
          "Presumir a preferência de todos da mesma idade.",
          "Concluir que ela nunca precisa conversar.",
          "Deduzir sua renda pelo formato."
        ],
        "answer": 0,
        "explanation": "Usa a informação pertinente sem extrapolar.",
        "optionRationales": [
          "Usa a informação pertinente sem extrapolar.",
          "Transforma um caso em estereótipo.",
          "A preferência do cenário não cobre toda situação futura.",
          "Não há relação demonstrada com renda."
        ]
      },
      {
        "id": "q.dp12.q03",
        "topicId": "banking.dp.segmentacao",
        "prompt": "A frase “pode ser útil algum dia” basta para coletar qualquer dado?",
        "options": [
          "Sim, se houver objetivo comercial.",
          "Sim, se o serviço for digital.",
          "Sim, se a plataforma for grande.",
          "Não; finalidade, necessidade e base legal devem ser consideradas."
        ],
        "answer": 3,
        "explanation": "Reconhece os critérios ensinados.",
        "optionRationales": [
          "Interesse comercial não afasta os requisitos.",
          "O canal não afasta proteção de dados.",
          "Porte não elimina regras.",
          "Reconhece os critérios ensinados."
        ]
      },
      {
        "id": "q.dp12.q04",
        "topicId": "banking.dp.segmentacao",
        "prompt": "Segundo o recorte da LGPD estudado, consentimento é:",
        "options": [
          "A única base possível para qualquer tratamento.",
          "Uma das bases previstas, exigindo considerar a hipótese aplicável.",
          "Dispensa de finalidade.",
          "Permissão para discriminação ilícita."
        ],
        "answer": 1,
        "explanation": "Evita universalizar uma base.",
        "optionRationales": [
          "A lei prevê outras hipóteses.",
          "Evita universalizar uma base.",
          "Princípios continuam aplicáveis.",
          "O princípio de não discriminação continua relevante."
        ]
      },
      {
        "id": "q.dp12.q05",
        "topicId": "banking.dp.segmentacao",
        "prompt": "Mais aberturas de uma mensagem, sem outros dados, comprovam:",
        "options": [
          "Apenas maior quantidade de aberturas na comparação descrita.",
          "Resolução de toda solicitação.",
          "Compreensão de todo leitor.",
          "Adequação de todo produto ofertado."
        ],
        "answer": 0,
        "explanation": "Mantém a conclusão na etapa medida.",
        "optionRationales": [
          "Mantém a conclusão na etapa medida.",
          "Resolução é outro resultado.",
          "Abrir não comprova compreender.",
          "Abertura não avalia adequação do produto."
        ]
      },
      {
        "id": "q.dp12.q06",
        "topicId": "banking.dp.segmentacao",
        "prompt": "Qual afirmação respeita os limites da segmentação?",
        "options": [
          "Todos do grupo têm a mesma renda.",
          "Todo usuário de aplicativo prefere sempre o mesmo canal.",
          "Uma característica comum pode ajudar a organizar a interação, sem descrever toda a pessoa.",
          "Agrupar elimina a necessidade de ouvir o usuário."
        ],
        "answer": 2,
        "explanation": "Preserva utilidade e limite do agrupamento.",
        "optionRationales": [
          "A necessidade comum não prova renda igual.",
          "Canal usado não determina toda preferência.",
          "Preserva utilidade e limite do agrupamento.",
          "A resposta individual continua relevante."
        ]
      },
      {
        "id": "q.dp12.q07",
        "topicId": "banking.dp.segmentacao",
        "prompt": "Para comparar se uma mudança resolveu melhor a necessidade do usuário, basta contar cliques?",
        "options": [
          "Sim, porque clique é resolução.",
          "Não; é preciso indicador relacionado à resolução e dados compatíveis com o objetivo.",
          "Sim, porque abertura é compreensão.",
          "Sim, porque toda interação gera resultado positivo."
        ],
        "answer": 1,
        "explanation": "Liga medida ao objetivo real.",
        "optionRationales": [
          "Confunde etapas.",
          "Liga medida ao objetivo real.",
          "Outra confusão de etapas.",
          "Resultado positivo não é automático."
        ]
      },
      {
        "id": "q.dp12.q08",
        "topicId": "banking.dp.segmentacao",
        "prompt": "O aluno confundiu mensagem aberta com problema resolvido. Qual recuperação ataca o erro?",
        "options": [
          "Somar cliques de outro canal sem critério.",
          "Ignorar o objetivo de atendimento.",
          "Declarar sucesso sem medir.",
          "Reconstituir a sequência e identificar exatamente qual etapa foi observada."
        ],
        "answer": 3,
        "explanation": "Separa observação e resultado pretendido.",
        "optionRationales": [
          "Mais contagens não corrigem a definição.",
          "O objetivo orienta a escolha da medida.",
          "Repete a inferência indevida.",
          "Separa observação e resultado pretendido."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "dp12-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.dp12.q01": [
          {
            "missionId": "banking.dp.segmentacao",
            "sectionId": "segmentos"
          },
          {
            "missionId": "banking.dp.segmentacao",
            "sectionId": "ex-necessidade"
          }
        ],
        "q.dp12.q02": [
          {
            "missionId": "banking.dp.segmentacao",
            "sectionId": "interacao"
          },
          {
            "missionId": "banking.dp.segmentacao",
            "sectionId": "ex-canal"
          }
        ],
        "q.dp12.q03": [
          {
            "missionId": "banking.dp.segmentacao",
            "sectionId": "dados"
          },
          {
            "missionId": "banking.dp.segmentacao",
            "sectionId": "ex-minimo"
          }
        ],
        "q.dp12.q04": [
          {
            "missionId": "banking.dp.segmentacao",
            "sectionId": "dados"
          }
        ],
        "q.dp12.q05": [
          {
            "missionId": "banking.dp.segmentacao",
            "sectionId": "indicadores"
          },
          {
            "missionId": "banking.dp.segmentacao",
            "sectionId": "ex-metrica"
          }
        ],
        "q.dp12.q06": [
          {
            "missionId": "banking.dp.segmentacao",
            "sectionId": "segmentos"
          },
          {
            "missionId": "banking.dp.segmentacao",
            "sectionId": "ex-necessidade"
          }
        ],
        "q.dp12.q07": [
          {
            "missionId": "banking.dp.segmentacao",
            "sectionId": "indicadores"
          }
        ],
        "q.dp12.q08": [
          {
            "missionId": "banking.dp.segmentacao",
            "sectionId": "indicadores"
          },
          {
            "missionId": "banking.dp.segmentacao",
            "sectionId": "ex-metrica"
          },
          {
            "missionId": "banking.dp.segmentacao",
            "sectionId": "resumo"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.dp12",
      "blockId": "banking.digital-payments",
      "prerequisiteId": "banking.dp.marketplace",
      "parametersApproved": false
    }
  },
  {
    "id": "banking.dp.revisao",
    "topicId": "banking.dp.revisao",
    "contentVersion": 1,
    "order": 63,
    "title": "Revisão cumulativa de pagamentos digitais",
    "shortTitle": "DP-R",
    "kind": "lesson",
    "objective": "Integrar canal, processo, atividade e instituição sem inferências indevidas.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "digital-payments-intro-r1",
      "releaseSequence": 5,
      "changeImpact": "new"
    },
    "sourceIds": [
      "dp.dpr.bcb.dp.fintechs",
      "dp.dpr.fsb.dp.nbfi",
      "dp.dpr.bcb.dp.spb",
      "dp.dpr.bcb.dp.pix",
      "dp.dpr.bcb.dp.openfinance",
      "dp.dpr.nist.dp.blockchain",
      "dp.dpr.lei.dp.ativos",
      "dp.dpr.bcb.dp.drex",
      "dp.dpr.cmn.dp.correspondentes",
      "dp.dpr.bis.dp.bigtech",
      "dp.dpr.lei.dp.lgpd"
    ],
    "sections": [
      {
        "id": "mapa",
        "type": "explanation",
        "heading": "1. Quatro perguntas para integrar",
        "body": "Antes de classificar, pergunte: qual necessidade está descrita, quem exerce cada função, qual operação ou informação está em jogo e que resultado foi comprovado? DP-01/02 separam canal e transformação; DP-03/04 distinguem empresas, atividades e estruturas financeiras. Uma aparência digital não resolve essas perguntas.",
        "sourceIds": []
      },
      {
        "id": "ex-integrado",
        "type": "worked-example",
        "heading": "2. Exemplo resolvido: interface e risco",
        "body": "Uma fintech fictícia fornece tecnologia a um intermediário não bancário. O intermediário, no caso, mantém ativos longos e oferece resgates curtos. O rótulo fintech descreve a atuação tecnológica financeira; o descompasso deve ser analisado na estrutura do intermediário. Trocar o nome da interface não elimina esse risco.",
        "sourceIds": [
          "dp.dpr.bcb.dp.fintechs",
          "dp.dpr.fsb.dp.nbfi"
        ]
      },
      {
        "id": "fluxos",
        "type": "explanation",
        "heading": "3. Instrução e execução",
        "body": "SPB e arranjos organizam infraestruturas e regras. Pix é um sistema de pagamento; agendamento é uma instrução futura. Correspondentes atendem por conta da contratante e podem encaminhar propostas. Em cada situação, o verbo importa: receber, autorizar, encaminhar e concluir não têm o mesmo significado.",
        "sourceIds": [
          "dp.dpr.bcb.dp.spb",
          "dp.dpr.bcb.dp.pix",
          "dp.dpr.cmn.dp.correspondentes"
        ]
      },
      {
        "id": "ex-etapas",
        "type": "worked-example",
        "heading": "4. Exemplo resolvido: duas pendências",
        "body": "Um aplicativo confirma um agendamento para o dia seguinte. No mesmo cenário, um correspondente informa que encaminhou uma proposta de crédito para análise. Há duas ações realizadas: agendar e encaminhar. Não há evidência de recebimento do pagamento nem de concessão do crédito.",
        "sourceIds": []
      },
      {
        "id": "dados-ativos",
        "type": "explanation",
        "heading": "5. Compartilhar e representar",
        "body": "No Open Finance, a autorização de dados é delimitada; ela não torna toda transferência autorizada. Blockchain é tecnologia de registro, enquanto o ativo representado possui natureza e direitos próprios. CBDC e ativo privado não se igualam pela forma digital. Proposta de funcionalidade não comprova disponibilidade pública.",
        "sourceIds": [
          "dp.dpr.bcb.dp.openfinance",
          "dp.dpr.nist.dp.blockchain",
          "dp.dpr.lei.dp.ativos",
          "dp.dpr.bcb.dp.drex"
        ]
      },
      {
        "id": "ex-digital",
        "type": "worked-example",
        "heading": "6. Exemplo resolvido: quatro afirmações diferentes",
        "body": "O cenário informa compartilhamento com uma instituição, representação digital de um direito, registro distribuído e uma função ainda proposta. Para responder, mantenha quatro linhas: permissão, direito, tecnologia e estágio. Nenhuma linha, sozinha, prova lucro certo, pagamento efetuado ou acesso universal.",
        "sourceIds": []
      },
      {
        "id": "interacao",
        "type": "explanation",
        "heading": "7. Oferta e resultado",
        "body": "Marketplace pode reunir ofertantes e prestadores distintos. Segmentação organiza necessidades, mas não descreve toda a pessoa. Compare valores sob as mesmas condições e interprete indicadores conforme a etapa medida. Mais cliques não demonstram, por si só, contratação adequada ou resolução da necessidade.",
        "sourceIds": [
          "dp.dpr.bis.dp.bigtech",
          "dp.dpr.lei.dp.lgpd"
        ]
      },
      {
        "id": "ex-comparar",
        "type": "worked-example",
        "heading": "8. Exemplo resolvido: duas evidências",
        "body": "A vitrine fictícia passou a mostrar o custo de entrega junto ao preço e registrou mais aberturas de ofertas. Mostrar o total pode facilitar comparação; o dado medido é abertura. Sem outra informação, não se pode declarar que todos compraram melhor ou que cada dúvida foi resolvida.",
        "sourceIds": []
      },
      {
        "id": "glossario",
        "type": "glossary",
        "heading": "Vocabulário essencial",
        "body": "Canal: forma de interação. Estrutura: como recursos e obrigações se organizam. Etapa: estado comprovado da operação. Natureza: o que o ativo ou serviço representa. Indicador: medida de algo definido, sem abranger automaticamente outros resultados.",
        "sourceIds": []
      },
      {
        "id": "resumo",
        "type": "summary",
        "heading": "Recuperação e síntese",
        "body": "Faça uma linha para cada participante, etapa e resultado. Nomeie o erro e retome a aula de origem indicada após a questão. Se errar, nomeie a confusão, retome o trecho indicado e reconstrua o exemplo com suas palavras. Esta prática exposta não é avaliação independente de retenção.",
        "sourceIds": []
      }
    ],
    "recall": [
      "Faça uma linha para cada participante, etapa e resultado.",
      "Nomeie o erro e retome a aula de origem indicada após a questão."
    ],
    "questions": [
      {
        "id": "q.dpr.q01",
        "topicId": "banking.dp.revisao",
        "prompt": "Um formulário muda do papel para o aplicativo, mantendo as mesmas etapas internas. A tela informa apenas “pedido recebido”. O que está comprovado?",
        "options": [
          "Automação de todas as etapas e conclusão do pedido.",
          "Mudança de canal e recebimento da solicitação, sem prova de conclusão.",
          "Mudança da natureza jurídica da instituição.",
          "Eliminação de qualquer análise humana."
        ],
        "answer": 1,
        "explanation": "Distingue mudança de acesso e estado da operação.",
        "optionRationales": [
          "Acrescenta duas conclusões não informadas.",
          "Distingue mudança de acesso e estado da operação.",
          "Canal não define natureza jurídica.",
          "As etapas foram mantidas."
        ]
      },
      {
        "id": "q.dpr.q02",
        "topicId": "banking.dp.revisao",
        "prompt": "Uma fintech fornece tecnologia a intermediário não bancário com ativos longos e resgates curtos. Qual análise é correta?",
        "options": [
          "O rótulo fintech elimina o risco de liquidez.",
          "Todo intermediário não bancário é ilegal.",
          "A tecnologia garante recursos imediatos.",
          "É preciso analisar o descompasso de liquidez/prazos, sem inferir ilegalidade pelo rótulo."
        ],
        "answer": 3,
        "explanation": "Aplica a distinção entre rótulo, estrutura e risco.",
        "optionRationales": [
          "Tecnologia não elimina o descompasso.",
          "O canal não prova infração.",
          "Não há tal garantia.",
          "Aplica a distinção entre rótulo, estrutura e risco."
        ]
      },
      {
        "id": "q.dpr.q03",
        "topicId": "banking.dp.revisao",
        "prompt": "Uma instituição participante de um arranjo informa Pix agendado para amanhã. Qual conclusão respeita regras e etapa?",
        "options": [
          "A participação no arranjo não transforma o agendamento em liquidação imediata.",
          "Arranjo é o nome do saldo da pessoa.",
          "O recebedor já dispõe necessariamente do valor.",
          "A instrução cria crédito novo."
        ],
        "answer": 0,
        "explanation": "Separa regras comuns e resultado específico.",
        "optionRationales": [
          "Separa regras comuns e resultado específico.",
          "Arranjo é conjunto de regras, não saldo.",
          "O caso informa data futura.",
          "Não há empréstimo descrito."
        ]
      },
      {
        "id": "q.dpr.q04",
        "topicId": "banking.dp.revisao",
        "prompt": "O cliente autoriza B a receber um conjunto de dados de A. Não há ordem de pagamento. Qual leitura é adequada?",
        "options": [
          "Todos os bancos receberam autorização.",
          "O dinheiro foi transferido.",
          "Há compartilhamento delimitado, sem prova de pagamento ou de aprovação de crédito.",
          "O histórico tornou-se público."
        ],
        "answer": 2,
        "explanation": "Preserva escopo e distingue ações.",
        "optionRationales": [
          "O destinatário é B.",
          "A operação não foi descrita.",
          "Preserva escopo e distingue ações.",
          "Compartilhamento não equivale a publicação."
        ]
      },
      {
        "id": "q.dpr.q05",
        "topicId": "banking.dp.revisao",
        "prompt": "Uma proposta descreve registro distribuído e possível transação com ativo digital. O que ainda precisa ser distinguido?",
        "options": [
          "Apenas a cor do aplicativo.",
          "Direito representado, emissor e estágio de disponibilidade, sem garantia automática de retorno.",
          "Nada: blockchain garante todos os resultados.",
          "Nada: todo ativo digital é CBDC."
        ],
        "answer": 1,
        "explanation": "Integra as distinções de tecnologia, natureza e estágio.",
        "optionRationales": [
          "Interface não identifica essas dimensões.",
          "Integra as distinções de tecnologia, natureza e estágio.",
          "Tecnologia não assegura retorno ou validade externa.",
          "Ativo privado e moeda de banco central são distintos."
        ]
      },
      {
        "id": "q.dpr.q06",
        "topicId": "banking.dp.revisao",
        "prompt": "O correspondente encaminha uma proposta e a contratante ainda vai analisar. Qual afirmação é indevida?",
        "options": [
          "A recepção e o envio da proposta ocorreram.",
          "A concessão ainda não foi informada.",
          "A contratante conserva a responsabilidade pelo atendimento nos termos estudados.",
          "O envio da proposta já comprova aprovação do empréstimo."
        ],
        "answer": 3,
        "explanation": "Troca uma etapa pelo resultado que ainda falta.",
        "optionRationales": [
          "É a etapa descrita.",
          "Respeita a análise pendente.",
          "Aplica a regra sem julgar outras responsabilidades.",
          "Troca uma etapa pelo resultado que ainda falta."
        ]
      },
      {
        "id": "q.dpr.q07",
        "topicId": "banking.dp.revisao",
        "prompt": "Mesmo produto e condições iguais: oferta A custa R$70 mais R$25 de entrega; B custa R$90 com entrega. Qual leitura é correta?",
        "options": [
          "B tem menor total no caso: 90 contra 95.",
          "A é menor porque anuncia 70.",
          "A comissão da plataforma é necessariamente 25.",
          "O menor total prova lucro do vendedor."
        ],
        "answer": 0,
        "explanation": "Soma o custo informado antes de comparar.",
        "optionRationales": [
          "Soma o custo informado antes de comparar.",
          "Ignora entrega.",
          "Frete não foi definido como comissão.",
          "Faltam os custos do vendedor."
        ]
      },
      {
        "id": "q.dpr.q08",
        "topicId": "banking.dp.revisao",
        "prompt": "Depois de uma mudança, aumentaram cliques de um grupo. O aluno concluiu que todas as necessidades desse grupo foram resolvidas. Como recuperar o erro?",
        "options": [
          "Generalizar para todos os grupos.",
          "Coletar qualquer informação sem finalidade.",
          "Separar o indicador de clique do resultado de resolução, sem tratar o grupo como pessoas idênticas.",
          "Supor que interação digital garante satisfação."
        ],
        "answer": 2,
        "explanation": "Identifica duas extrapolações e retoma a medida correta.",
        "optionRationales": [
          "Amplia a inferência indevida.",
          "Contraria os limites de finalidade e necessidade.",
          "Identifica duas extrapolações e retoma a medida correta.",
          "Não há garantia universal."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "dpr-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.dpr.q01": [
          {
            "missionId": "banking.dp.revisao",
            "sectionId": "mapa"
          },
          {
            "missionId": "banking.dp.canais",
            "sectionId": "estados"
          },
          {
            "missionId": "banking.dp.transformacao",
            "sectionId": "ex-canal"
          }
        ],
        "q.dpr.q02": [
          {
            "missionId": "banking.dp.revisao",
            "sectionId": "ex-integrado"
          },
          {
            "missionId": "banking.dp.empresas",
            "sectionId": "rotulos"
          },
          {
            "missionId": "banking.dp.intermediacao",
            "sectionId": "liquidez"
          }
        ],
        "q.dpr.q03": [
          {
            "missionId": "banking.dp.revisao",
            "sectionId": "fluxos"
          },
          {
            "missionId": "banking.dp.revisao",
            "sectionId": "ex-etapas"
          },
          {
            "missionId": "banking.dp.arranjos",
            "sectionId": "arranjo"
          },
          {
            "missionId": "banking.dp.pix",
            "sectionId": "agendamento"
          }
        ],
        "q.dpr.q04": [
          {
            "missionId": "banking.dp.revisao",
            "sectionId": "dados-ativos"
          },
          {
            "missionId": "banking.dp.open-finance",
            "sectionId": "controle"
          },
          {
            "missionId": "banking.dp.open-finance",
            "sectionId": "pagamento"
          }
        ],
        "q.dpr.q05": [
          {
            "missionId": "banking.dp.revisao",
            "sectionId": "dados-ativos"
          },
          {
            "missionId": "banking.dp.revisao",
            "sectionId": "ex-digital"
          },
          {
            "missionId": "banking.dp.blockchain",
            "sectionId": "ativos"
          },
          {
            "missionId": "banking.dp.cbdc",
            "sectionId": "cbdc"
          },
          {
            "missionId": "banking.dp.cbdc",
            "sectionId": "estagio"
          }
        ],
        "q.dpr.q06": [
          {
            "missionId": "banking.dp.revisao",
            "sectionId": "fluxos"
          },
          {
            "missionId": "banking.dp.revisao",
            "sectionId": "ex-etapas"
          },
          {
            "missionId": "banking.dp.correspondentes",
            "sectionId": "propostas"
          },
          {
            "missionId": "banking.dp.correspondentes",
            "sectionId": "responsabilidade"
          }
        ],
        "q.dpr.q07": [
          {
            "missionId": "banking.dp.revisao",
            "sectionId": "interacao"
          },
          {
            "missionId": "banking.dp.marketplace",
            "sectionId": "ex-comparacao"
          }
        ],
        "q.dpr.q08": [
          {
            "missionId": "banking.dp.revisao",
            "sectionId": "interacao"
          },
          {
            "missionId": "banking.dp.revisao",
            "sectionId": "ex-comparar"
          },
          {
            "missionId": "banking.dp.revisao",
            "sectionId": "resumo"
          },
          {
            "missionId": "banking.dp.segmentacao",
            "sectionId": "segmentos"
          },
          {
            "missionId": "banking.dp.segmentacao",
            "sectionId": "indicadores"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.dpr",
      "blockId": "banking.digital-payments",
      "prerequisiteId": "banking.dp.segmentacao",
      "parametersApproved": false
    }
  },
  {
    "id": "banking.dp.boss",
    "topicId": "banking.dp.boss",
    "contentVersion": 1,
    "order": 64,
    "title": "Chefe de Pagamentos Digitais: identifique papéis, etapas e limites",
    "shortTitle": "DP-CHEFE",
    "kind": "boss",
    "objective": "Integrar doze casos próprios de pagamentos digitais, explicando as hipóteses e retomando o ensino de origem.",
    "xp": 220,
    "passScore": 75,
    "estimatedMinutes": 30,
    "publication": {
      "status": "draft",
      "releaseId": "digital-payments-intro-r1",
      "releaseSequence": 5,
      "changeImpact": "new"
    },
    "sourceIds": [
      "dp.dpchefe.bcb.conta.deposito",
      "dp.dpchefe.bcb.conta.digital",
      "dp.dpchefe.bcb.conta.pagamento",
      "dp.dpchefe.caixa.dp.canais",
      "dp.dpchefe.bcb.dp.fintechs",
      "dp.dpchefe.lei.dp.startups",
      "dp.dpchefe.bis.dp.bigtech",
      "dp.dpchefe.fsb.dp.nbfi",
      "dp.dpchefe.bcb.dp.spb",
      "dp.dpchefe.bcb.dp.arranjos",
      "dp.dpchefe.bcb.dp.pix",
      "dp.dpchefe.bcb.dp.openfinance",
      "dp.dpchefe.nist.dp.blockchain",
      "dp.dpchefe.lei.dp.ativos",
      "dp.dpchefe.bcb.dp.drex",
      "dp.dpchefe.bcb.dp.drex.conceito",
      "dp.dpchefe.bcb.dp.drex.lancamento",
      "dp.dpchefe.cmn.dp.correspondentes",
      "dp.dpchefe.lei.dp.lgpd"
    ],
    "sections": [
      {
        "id": "preparacao",
        "type": "explanation",
        "heading": "1. Ensino antes do desafio",
        "body": "As aulas [DP-01](dp-01-v1.md), [DP-02](dp-02-v1.md), [DP-03](dp-03-v1.md), [DP-04](dp-04-v1.md), [DP-05](dp-05-v1.md), [DP-06](dp-06-v1.md), [DP-07](dp-07-v1.md), [DP-08](dp-08-v1.md), [DP-09](dp-09-v1.md), [DP-10](dp-10-v1.md), [DP-11](dp-11-v1.md), [DP-12](dp-12-v1.md) e a [revisão DP-R](dp-r-v1.md) ensinam os conceitos cobrados. Leia os trechos de origem antes de usar o comentário de uma questão. Os casos são fictícios, sem operação real, preço atual ou dado do aluno.",
        "sourceIds": [],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "As aulas "
              },
              {
                "text": "DP-01",
                "missionId": "banking.dp.canais",
                "sectionId": "camadas",
                "wholeLesson": true
              },
              {
                "text": ", "
              },
              {
                "text": "DP-02",
                "missionId": "banking.dp.transformacao",
                "sectionId": "camadas",
                "wholeLesson": true
              },
              {
                "text": ", "
              },
              {
                "text": "DP-03",
                "missionId": "banking.dp.empresas",
                "sectionId": "dimensoes",
                "wholeLesson": true
              },
              {
                "text": ", "
              },
              {
                "text": "DP-04",
                "missionId": "banking.dp.intermediacao",
                "sectionId": "conceito",
                "wholeLesson": true
              },
              {
                "text": ", "
              },
              {
                "text": "DP-05",
                "missionId": "banking.dp.arranjos",
                "sectionId": "spb",
                "wholeLesson": true
              },
              {
                "text": ", "
              },
              {
                "text": "DP-06",
                "missionId": "banking.dp.pix",
                "sectionId": "conceito",
                "wholeLesson": true
              },
              {
                "text": ", "
              },
              {
                "text": "DP-07",
                "missionId": "banking.dp.open-finance",
                "sectionId": "conceito",
                "wholeLesson": true
              },
              {
                "text": ", "
              },
              {
                "text": "DP-08",
                "missionId": "banking.dp.blockchain",
                "sectionId": "registro",
                "wholeLesson": true
              },
              {
                "text": ", "
              },
              {
                "text": "DP-09",
                "missionId": "banking.dp.cbdc",
                "sectionId": "cbdc",
                "wholeLesson": true
              },
              {
                "text": ", "
              },
              {
                "text": "DP-10",
                "missionId": "banking.dp.correspondentes",
                "sectionId": "papel",
                "wholeLesson": true
              },
              {
                "text": ", "
              },
              {
                "text": "DP-11",
                "missionId": "banking.dp.marketplace",
                "sectionId": "plataforma",
                "wholeLesson": true
              },
              {
                "text": ", "
              },
              {
                "text": "DP-12",
                "missionId": "banking.dp.segmentacao",
                "sectionId": "segmentos",
                "wholeLesson": true
              },
              {
                "text": " e a "
              },
              {
                "text": "revisão DP-R",
                "missionId": "banking.dp.revisao",
                "sectionId": "mapa",
                "wholeLesson": true
              },
              {
                "text": " ensinam os conceitos cobrados. Leia os trechos de origem antes de usar o comentário de uma questão. Os casos são fictícios, sem operação real, preço atual ou dado do aluno."
              }
            ]
          }
        ]
      },
      {
        "id": "roteiro",
        "type": "explanation",
        "heading": "2. Seis grupos para organizar a leitura",
        "body": "Itens 1–2: canal, processo, modelo e estado. Itens 3–4: rótulo, estrutura financeira e risco. Itens 5–6: regras de pagamento, instrução e compartilhamento. Itens 7–8: tecnologia, direito, emissor e estágio. Itens 9–10: papéis no atendimento e na oferta, comissão e repasse. Itens 11–12: necessidade do grupo, finalidade dos dados e indicador realmente observado. Não inferir um resultado além do caso.",
        "sourceIds": []
      },
      {
        "id": "exemplo-metodo",
        "type": "worked-example",
        "heading": "3. Exemplo resolvido: uma anotação não é todo o resultado",
        "body": "Uma anotação fictícia diz apenas “informação enviada”. Primeiro, pergunte qual informação e para quem. Segundo, identifique se a ação foi compartilhamento de dados, pedido de análise ou outra etapa. Terceiro, verifique se foi descrita uma conclusão. Sem essas informações, o envio não prova pagamento, concessão de crédito ou resolução de dúvida. Nos itens seguintes, use os papéis e estados efetivamente informados.",
        "sourceIds": []
      },
      {
        "id": "glossario",
        "type": "glossary",
        "heading": "4. Termos para conferir",
        "body": "Canal: forma de interação. Processo: etapas e decisões. Modelo: organização de valor, participantes e remuneração. Liquidez: capacidade de obter caixa. Arranjo: regras de um serviço de pagamento. Escopo: dados, destinatário e período autorizados. Registro: representação de informações, sem provar todo fato externo. Contratante: instituição por conta da qual atua o correspondente. Repasse: valor transferido conforme as deduções descritas, distinto de lucro. Indicador: medida de uma etapa ou resultado definido.",
        "sourceIds": []
      },
      {
        "id": "recuperacao",
        "type": "summary",
        "heading": "5. Recuperar a confusão",
        "body": "Tente responder e justificar antes de ler os comentários. Se errar, nomeie a troca de papel, etapa, base de cálculo ou conclusão; retome as seções de origem e reconstrua o exemplo. Explique por que os outros três caminhos não atendem ao caso. Estes itens ficam expostos na prática e não são avaliação independente. Acerto ou conclusão não comprovam retenção duradoura nem prontidão de prova.",
        "sourceIds": []
      }
    ],
    "recall": [
      "Explique quem faz o quê e qual etapa foi comprovada.",
      "Separe tecnologia, natureza, direitos e resultado.",
      "Refaça o cálculo e declare seu denominador e suas hipóteses."
    ],
    "questions": [
      {
        "id": "q.dpchefe.q01",
        "topicId": "banking.dp.boss",
        "prompt": "O banco fictício Aurora permite enviar pelo navegador um pedido antes entregue no balcão. O caso informa que as etapas internas permanecem iguais e mostra “documentação recebida, análise pendente”. Qual conclusão reúne corretamente mudança e estado?",
        "options": [
          "O processo inteiro foi automatizado e o pedido aprovado.",
          "O canal de entrada mudou; a documentação foi recebida, mas a análise ainda não terminou.",
          "O uso de navegador transformou a conta em outra categoria jurídica.",
          "A análise deixou de existir porque o cliente não foi ao balcão."
        ],
        "answer": 1,
        "explanation": "Separa a forma de entrada do resultado efetivamente informado.",
        "optionRationales": [
          "Acrescenta automação integral e aprovação, ambas ausentes.",
          "Separa a forma de entrada do resultado efetivamente informado.",
          "A natureza da conta não decorre apenas do canal.",
          "Contradiz a informação expressa de análise pendente."
        ]
      },
      {
        "id": "q.dpchefe.q02",
        "topicId": "banking.dp.boss",
        "prompt": "Duas plataformas fictícias têm telas semelhantes. Uma cobra assinatura do usuário; a outra recebe remuneração por serviços concluídos para empresas parceiras. Nenhum preço, custo ou resultado de solicitação foi informado. Qual análise é sustentada?",
        "options": [
          "Telas semelhantes tornam os modelos econômicos idênticos.",
          "Receber por serviço concluído garante que toda solicitação será concluída.",
          "Assinatura é sempre mais cara, mesmo sem preços.",
          "As formas de remuneração diferem; não há dados para escolher a mais vantajosa nem garantir conclusão."
        ],
        "answer": 3,
        "explanation": "Reconhece a diferença descrita e preserva os limites do caso.",
        "optionRationales": [
          "Confunde interface e organização econômica.",
          "A regra de remuneração não garante o resultado de cada pedido.",
          "A comparação exige condições e valores não apresentados.",
          "Reconhece a diferença descrita e preserva os limites do caso."
        ]
      },
      {
        "id": "q.dpchefe.q03",
        "topicId": "banking.dp.boss",
        "prompt": "Uma empresa desenvolve tecnologia para inovar em serviços financeiros de um intermediário não bancário. O intermediário promete resgates curtos e mantém ativos que geram caixa muito depois. Qual leitura é adequada?",
        "options": [
          "A atuação tecnológica financeira pode ser descrita como fintech; o descompasso de prazos/liquidez do intermediário ainda precisa ser analisado.",
          "O rótulo fintech transforma todos os ativos em dinheiro disponível imediatamente.",
          "Ser não bancário prova que o intermediário atua ilegalmente.",
          "A tecnologia comprova enquadramento legal completo como startup e elimina o risco de resgate."
        ],
        "answer": 0,
        "explanation": "Distingue característica da empresa tecnológica e estrutura de risco do intermediário.",
        "optionRationales": [
          "Distingue característica da empresa tecnológica e estrutura de risco do intermediário.",
          "Tecnologia não muda automaticamente prazo ou liquidez dos ativos.",
          "O canal não bancário não prova ilegalidade.",
          "Nem todos os requisitos legais nem a eliminação do risco foram demonstrados."
        ]
      },
      {
        "id": "q.dpchefe.q04",
        "topicId": "banking.dp.boss",
        "prompt": "Uma entidade fictícia aplica R$100 em ativos, financiados por R$30 próprios e R$70 de dívida. Os ativos depois valem R$88, e a dívida permanece R$70. Sem qualquer outro ativo, obrigação, custo ou receita, qual cálculo e conclusão são corretos?",
        "options": [
          "Restam R$88 próprios, pois a dívida não entra nessa conta.",
          "Restam R$30 próprios, pois tecnologia financeira impede perda.",
          "Restam R$18 próprios: a perda de R$12 equivale a 40% do capital inicial, ilustrando o efeito da alavancagem.",
          "Restam R$70 próprios e a perda foi necessariamente ilegal."
        ],
        "answer": 2,
        "explanation": "88 − 70 = 18; 30 − 18 = 12; 12 ÷ 30 = 40%. A dívida amplia o efeito relativo da perda sobre os recursos próprios.",
        "optionRationales": [
          "R$88 é o ativo; é preciso deduzir R$70 de obrigação.",
          "O rótulo tecnológico não garante preservação do capital.",
          "88 − 70 = 18; 30 − 18 = 12; 12 ÷ 30 = 40%. A dívida amplia o efeito relativo da perda sobre os recursos próprios.",
          "Troca dívida por capital próprio e acrescenta conclusão jurídica sem base."
        ]
      },
      {
        "id": "q.dpchefe.q05",
        "topicId": "banking.dp.boss",
        "prompt": "Uma instituição participa de um arranjo de pagamento e seu aplicativo confirma apenas “Pix agendado para amanhã”. Qual conclusão combina a função do arranjo e a etapa informada?",
        "options": [
          "O arranjo é a própria conta do cliente e o valor já chegou ao recebedor.",
          "O arranjo fornece regras do serviço; o agendamento não comprova liquidação imediata.",
          "Participar do arranjo garante saldo suficiente em todas as contas.",
          "Qualquer agendamento representa empréstimo concedido pelo Banco Central."
        ],
        "answer": 1,
        "explanation": "Separa as regras comuns da instrução para data futura.",
        "optionRationales": [
          "Confunde regras, conta e resultado da operação.",
          "Separa as regras comuns da instrução para data futura.",
          "A participação não demonstra saldo de cada cliente.",
          "O caso não descreve concessão de crédito."
        ]
      },
      {
        "id": "q.dpchefe.q06",
        "topicId": "banking.dp.boss",
        "prompt": "No cenário fictício, uma instituição participante de serviços de pagamento recebe autorização para acessar um conjunto de dados do cliente mantidos em outra instituição por um período informado. Nenhuma ordem de pagamento foi dada. O que se pode concluir?",
        "options": [
          "Todas as instituições passaram a acessar qualquer dado.",
          "Participar de serviços de pagamento torna o acesso uma transferência concluída.",
          "A autorização garante concessão de crédito com a menor taxa.",
          "Houve permissão de compartilhamento no escopo descrito, sem comprovação de pagamento ou garantia de crédito."
        ],
        "answer": 3,
        "explanation": "Respeita o escopo autorizado e distingue informação de movimentação.",
        "optionRationales": [
          "A permissão tem destinatário, conteúdo e período delimitados.",
          "O papel da instituição não transforma acesso a dados em ordem ou liquidação.",
          "Informação adicional pode apoiar avaliação, sem garantir a oferta.",
          "Respeita o escopo autorizado e distingue informação de movimentação."
        ]
      },
      {
        "id": "q.dpchefe.q07",
        "topicId": "banking.dp.boss",
        "prompt": "Uma representação digital de direito privado usa registro distribuído. Um anúncio conclui: “por usar essa tecnologia, é moeda digital de banco central e terá valorização garantida”. Qual avaliação está correta?",
        "options": [
          "Tecnologia de registro, natureza do direito e emissor precisam ser distinguidos; o anúncio não demonstra CBDC nem retorno garantido.",
          "Qualquer registro distribuído é necessariamente emitido pelo Banco Central.",
          "Preservar um registro garante que o preço do direito sempre aumenta.",
          "Direito privado, Pix e CBDC são a mesma categoria por serem digitais."
        ],
        "answer": 0,
        "explanation": "Evita atribuir propriedades monetárias ou financeiras apenas ao registro.",
        "optionRationales": [
          "Evita atribuir propriedades monetárias ou financeiras apenas ao registro.",
          "Distribuição do registro não identifica o emissor da moeda.",
          "Integridade do registro não determina valor futuro.",
          "As funções e naturezas ensinadas são distintas."
        ]
      },
      {
        "id": "q.dpchefe.q08",
        "topicId": "banking.dp.boss",
        "prompt": "Um projeto hipotético futuro prevê acesso por instituição autorizada e uma transação que condiciona entrega de um direito digital ao pagamento correspondente. Ainda não há confirmação de disponibilidade pública. Qual leitura respeita o desenho informado?",
        "options": [
          "Toda pessoa já tem conta direta no Banco Central e acesso à função.",
          "A programação garante a verdade de qualquer fato externo e elimina todo risco.",
          "O desenho mantém intermediação e pode reduzir o risco de entrega sem contrapartida; não prova disponibilidade pública nem ausência de outros riscos.",
          "Uma proposta de funcionalidade equivale a pagamento já realizado."
        ],
        "answer": 2,
        "explanation": "Reconhece a condição proposta sem extrapolar emissor, estágio ou segurança.",
        "optionRationales": [
          "Apaga a intermediação e inventa disponibilidade.",
          "Validação de registros não verifica automaticamente o mundo externo nem elimina todos os riscos.",
          "Reconhece a condição proposta sem extrapolar emissor, estágio ou segurança.",
          "Uma descrição futura não comprova uma operação concreta."
        ]
      },
      {
        "id": "q.dpchefe.q09",
        "topicId": "banking.dp.boss",
        "prompt": "Numa plataforma fictícia, a oferta identifica a loja Norte como vendedora. Separadamente, um correspondente do Banco Vale recebe uma proposta de crédito e a encaminha à análise ainda pendente do banco. Qual conjunto de papéis e etapas está correto?",
        "options": [
          "A plataforma é obrigatoriamente a vendedora e o correspondente já concedeu o crédito.",
          "Norte é a vendedora informada; o correspondente encaminhou a proposta, sem comprovar concessão, e a contratante mantém a responsabilidade pelo atendimento nos termos estudados.",
          "O banco não tem responsabilidade pelo atendimento porque outra empresa recebeu a proposta.",
          "O vendedor, a plataforma e o correspondente tornam-se a mesma entidade por aparecerem no fluxo."
        ],
        "answer": 1,
        "explanation": "Preserva as atribuições explícitas, a análise pendente e a responsabilidade da contratante pelo atendimento.",
        "optionRationales": [
          "Contradiz o vendedor identificado e transforma o envio da proposta em concessão.",
          "Preserva as atribuições explícitas, a análise pendente e a responsabilidade da contratante pelo atendimento.",
          "Terceirizar o atendimento não afasta essa responsabilidade.",
          "Um fluxo com vários participantes não elimina seus papéis."
        ]
      },
      {
        "id": "q.dpchefe.q10",
        "topicId": "banking.dp.boss",
        "prompt": "Uma loja correspondente do Banco Vale também vende seus próprios produtos em um marketplace. Nessa venda, o preço é R$300 e a plataforma retém comissão de 4% sobre esse preço, sem outras deduções do repasse. A venda não é serviço prestado por conta do banco. Qual análise é correta?",
        "options": [
          "A comissão é R$4 e tudo que a loja vende vira serviço bancário.",
          "A plataforma recebe R$12 de lucro líquido comprovado, mesmo sem conhecer seus custos.",
          "O Banco Vale é necessariamente o vendedor e recebe R$288.",
          "A comissão é R$12 e o repasse é R$288 antes dos demais custos da loja; ser correspondente em outra atividade não transforma essa venda em serviço bancário."
        ],
        "answer": 3,
        "explanation": "300 × 0,04 = 12; 300 − 12 = 288. Os papéis são interpretados conforme a atividade descrita.",
        "optionRationales": [
          "4% é uma proporção de 300, não R$4 fixos; o papel depende da atividade.",
          "R$12 é receita de comissão no caso, sem dados para apurar lucro líquido.",
          "O enunciado identifica venda própria da loja e exclui atuação por conta do banco.",
          "300 × 0,04 = 12; 300 − 12 = 288. Os papéis são interpretados conforme a atividade descrita."
        ]
      },
      {
        "id": "q.dpchefe.q11",
        "topicId": "banking.dp.boss",
        "prompt": "Para organizar uma explicação, um grupo declara preferência por texto e outro por conversa. A equipe passa a registrar essa preferência para a finalidade informada. Qual raciocínio é adequado no recorte da aula?",
        "options": [
          "Usar a necessidade declarada para orientar a interação, sem supor que todos do grupo sejam iguais ou dispensar finalidade, necessidade e base legal aplicável.",
          "A preferência de formato prova renda, habilidade e toda necessidade futura de cada pessoa.",
          "A existência de um grupo autoriza coletar qualquer informação que talvez seja útil depois.",
          "Consentimento é sempre a única base possível para qualquer tratamento de dados."
        ],
        "answer": 0,
        "explanation": "Relaciona critério relevante e atendimento, mantendo os limites do agrupamento e do uso de dados.",
        "optionRationales": [
          "Relaciona critério relevante e atendimento, mantendo os limites do agrupamento e do uso de dados.",
          "Extrapola uma característica para toda a pessoa e para situações futuras.",
          "Interesse eventual não substitui finalidade e necessidade.",
          "A LGPD prevê outras hipóteses; a base aplicável exige consideração do caso."
        ]
      },
      {
        "id": "q.dpchefe.q12",
        "topicId": "banking.dp.boss",
        "prompt": "Após uma mensagem, 40 usuários responderam a uma pesquisa e 16 desses respondentes declararam que a dúvida foi resolvida. Não há dados sobre os demais usuários. Um aluno afirma que 40% de toda a população atendida teve sua dúvida resolvida. Qual correção enfrenta o erro?",
        "options": [
          "Substituir 16 por 40 e concluir resolução universal.",
          "Tratar cada resposta como aprovação automática de produto.",
          "16 ÷ 40 = 40% dos respondentes relataram resolução; falta base para estender o resultado a todos os usuários.",
          "Descartar a definição do indicador e contar apenas mensagens enviadas."
        ],
        "answer": 2,
        "explanation": "Corrige o denominador e limita a conclusão ao grupo observado e ao relato medido.",
        "optionRationales": [
          "A quantidade de respostas não equivale a quantidade de resoluções.",
          "A pesquisa não avalia aprovação de produto.",
          "Corrige o denominador e limita a conclusão ao grupo observado e ao relato medido.",
          "Mudar a contagem não resolve a extrapolação nem mede o resultado pretendido."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "dpchefe-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.dpchefe.q01": [
          {
            "missionId": "banking.dp.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "banking.dp.boss",
            "sectionId": "glossario"
          },
          {
            "missionId": "banking.dp.canais",
            "sectionId": "estados"
          },
          {
            "missionId": "banking.dp.transformacao",
            "sectionId": "ex-canal"
          }
        ],
        "q.dpchefe.q02": [
          {
            "missionId": "banking.dp.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "banking.dp.boss",
            "sectionId": "glossario"
          },
          {
            "missionId": "banking.dp.canais",
            "sectionId": "camadas"
          },
          {
            "missionId": "banking.dp.transformacao",
            "sectionId": "modelo"
          },
          {
            "missionId": "banking.dp.transformacao",
            "sectionId": "evidencia"
          }
        ],
        "q.dpchefe.q03": [
          {
            "missionId": "banking.dp.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "banking.dp.boss",
            "sectionId": "glossario"
          },
          {
            "missionId": "banking.dp.empresas",
            "sectionId": "dimensoes"
          },
          {
            "missionId": "banking.dp.empresas",
            "sectionId": "rotulos"
          },
          {
            "missionId": "banking.dp.intermediacao",
            "sectionId": "liquidez"
          }
        ],
        "q.dpchefe.q04": [
          {
            "missionId": "banking.dp.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "banking.dp.boss",
            "sectionId": "glossario"
          },
          {
            "missionId": "banking.dp.empresas",
            "sectionId": "rotulos"
          },
          {
            "missionId": "banking.dp.intermediacao",
            "sectionId": "alavancagem"
          },
          {
            "missionId": "banking.dp.intermediacao",
            "sectionId": "ex-alavancagem"
          }
        ],
        "q.dpchefe.q05": [
          {
            "missionId": "banking.dp.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "banking.dp.boss",
            "sectionId": "glossario"
          },
          {
            "missionId": "banking.dp.arranjos",
            "sectionId": "arranjo"
          },
          {
            "missionId": "banking.dp.pix",
            "sectionId": "agendamento"
          },
          {
            "missionId": "banking.dp.pix",
            "sectionId": "ex-agenda"
          }
        ],
        "q.dpchefe.q06": [
          {
            "missionId": "banking.dp.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "banking.dp.boss",
            "sectionId": "glossario"
          },
          {
            "missionId": "banking.dp.arranjos",
            "sectionId": "participantes"
          },
          {
            "missionId": "banking.dp.open-finance",
            "sectionId": "controle"
          },
          {
            "missionId": "banking.dp.open-finance",
            "sectionId": "oferta"
          },
          {
            "missionId": "banking.dp.open-finance",
            "sectionId": "pagamento"
          }
        ],
        "q.dpchefe.q07": [
          {
            "missionId": "banking.dp.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "banking.dp.boss",
            "sectionId": "glossario"
          },
          {
            "missionId": "banking.dp.blockchain",
            "sectionId": "ativos"
          },
          {
            "missionId": "banking.dp.blockchain",
            "sectionId": "risco"
          },
          {
            "missionId": "banking.dp.cbdc",
            "sectionId": "cbdc"
          },
          {
            "missionId": "banking.dp.cbdc",
            "sectionId": "ex-distincao"
          }
        ],
        "q.dpchefe.q08": [
          {
            "missionId": "banking.dp.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "banking.dp.boss",
            "sectionId": "glossario"
          },
          {
            "missionId": "banking.dp.blockchain",
            "sectionId": "ex-registro"
          },
          {
            "missionId": "banking.dp.cbdc",
            "sectionId": "intermediacao"
          },
          {
            "missionId": "banking.dp.cbdc",
            "sectionId": "ex-condicoes"
          },
          {
            "missionId": "banking.dp.cbdc",
            "sectionId": "estagio"
          }
        ],
        "q.dpchefe.q09": [
          {
            "missionId": "banking.dp.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "banking.dp.boss",
            "sectionId": "glossario"
          },
          {
            "missionId": "banking.dp.correspondentes",
            "sectionId": "propostas"
          },
          {
            "missionId": "banking.dp.correspondentes",
            "sectionId": "responsabilidade"
          },
          {
            "missionId": "banking.dp.marketplace",
            "sectionId": "plataforma"
          },
          {
            "missionId": "banking.dp.marketplace",
            "sectionId": "papeis"
          }
        ],
        "q.dpchefe.q10": [
          {
            "missionId": "banking.dp.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "banking.dp.boss",
            "sectionId": "glossario"
          },
          {
            "missionId": "banking.dp.correspondentes",
            "sectionId": "papel"
          },
          {
            "missionId": "banking.dp.marketplace",
            "sectionId": "remuneracao"
          },
          {
            "missionId": "banking.dp.marketplace",
            "sectionId": "ex-comissao"
          }
        ],
        "q.dpchefe.q11": [
          {
            "missionId": "banking.dp.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "banking.dp.boss",
            "sectionId": "glossario"
          },
          {
            "missionId": "banking.dp.segmentacao",
            "sectionId": "segmentos"
          },
          {
            "missionId": "banking.dp.segmentacao",
            "sectionId": "ex-canal"
          },
          {
            "missionId": "banking.dp.segmentacao",
            "sectionId": "dados"
          }
        ],
        "q.dpchefe.q12": [
          {
            "missionId": "banking.dp.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "banking.dp.boss",
            "sectionId": "glossario"
          },
          {
            "missionId": "banking.dp.boss",
            "sectionId": "recuperacao"
          },
          {
            "missionId": "banking.dp.segmentacao",
            "sectionId": "indicadores"
          },
          {
            "missionId": "banking.dp.segmentacao",
            "sectionId": "ex-metrica"
          },
          {
            "missionId": "banking.dp.segmentacao",
            "sectionId": "resumo"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.dpchefe",
      "blockId": "banking.digital-payments",
      "prerequisiteId": "banking.dp.revisao",
      "parametersApproved": false
    }
  }
]);
export const DP_SOURCES = Object.freeze([
  {
    "id": "dp.dp01.bcb.conta.deposito",
    "label": "BCB — Conta bancária (corrente ou poupança)",
    "url": "https://www.bcb.gov.br/meubc/faqs/p/o-que-e-conta-de-depositos",
    "version": "FAQ atualizada em 26/03/2024; consultada em 30/09/2026",
    "locator": "Resposta oficial completa no recorte indicado",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "dp.dp01.bcb.conta.digital",
    "label": "BCB — Conta digital ou eletrônica",
    "url": "https://www.bcb.gov.br/meubc/faqs/p/o-que-e-conta-digital-ou-eletronica",
    "version": "FAQ atualizada em 26/03/2024; consultada em 30/09/2026",
    "locator": "Resposta oficial completa no recorte indicado",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "dp.dp01.bcb.conta.pagamento",
    "label": "BCB — Tipos de conta de pagamento",
    "url": "https://www.bcb.gov.br/meubc/faqs/p/quais-sao-os-tipos-de-conta-de-pagamento",
    "version": "FAQ atualizada em 31/01/2023; consultada em 30/09/2026",
    "locator": "Resposta oficial completa no recorte indicado",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "dp.dp01.caixa.dp.canais",
    "label": "CAIXA — App CAIXA e Internet Banking CAIXA",
    "url": "https://www.caixa.gov.br/atendimento/canais-digitais/app-caixa-internet-banking/Paginas/default.aspx",
    "version": "Página institucional consultada em 01/10/2026, 01:50 UTC",
    "locator": "O que são os canais e exemplos de serviços; sem reproduzir procedimentos, limites ou versão Beta",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dp02.bcb.dp.fintechs",
    "label": "BCB — Fintechs",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/fintechs",
    "version": "Página institucional; consulta em 01/10/2026, 01:43 UTC",
    "locator": "Definição introdutória e benefícios possíveis; não reutilizar limites ou referências normativas de outras seções",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dp03.bcb.dp.fintechs",
    "label": "BCB — Fintechs",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/fintechs",
    "locator": "Definição introdutória; não utilizados limites ou normas antigos da página",
    "version": "Página oficial consultada em 01/10/2026",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dp03.lei.dp.startups",
    "label": "LC 182/2021 — Startups",
    "url": "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp182.htm",
    "locator": "Art. 4º: conceito e requisitos adicionais para enquadramento",
    "version": "Texto oficial consultado; sem ensino de limites numéricos",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dp03.bis.dp.bigtech",
    "label": "BIS — Big tech in finance",
    "url": "https://www.bis.org/publications/aer-2019/big-tech-finance-opportunities-risks",
    "locator": "Conceitos de plataforma, dados, rede e entrada em finanças; não estatísticas atuais",
    "version": "Annual Economic Report 2019, capítulo III",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dp04.fsb.dp.nbfi",
    "label": "FSB — Non-Bank Financial Intermediation",
    "url": "https://www.fsb.org/work-of-the-fsb/financial-innovation-and-structural-change/non-bank-financial-intermediation/",
    "locator": "Introdução e Monitoring: universo amplo, subconjunto de riscos, liquidez/prazos/alavancagem",
    "version": "Página oficial consultada em 01/10/2026",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dp05.bcb.dp.spb",
    "label": "BCB — Sistema de Pagamentos Brasileiro",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/spb",
    "locator": "Infraestruturas, arranjos e participantes",
    "version": "Página oficial consultada em 01/10/2026",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dp05.bcb.dp.arranjos",
    "label": "BCB — Arranjos de pagamento",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/arranjospagamento",
    "locator": "Conceito e distinção entre arranjo, participantes e instituições",
    "version": "Página oficial consultada em 01/10/2026",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dp06.bcb.dp.pix",
    "label": "BCB — Pix",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/pix",
    "locator": "Conceito, disponibilidade e contas; não tarifas/limites/exceções operacionais",
    "version": "Página oficial consultada em 01/10/2026",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dp07.bcb.dp.openfinance",
    "label": "BCB — Open Finance",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/openfinance",
    "locator": "Escolha de dados/destinatário/prazo, cancelamento e benefícios possíveis",
    "version": "Página oficial consultada em 01/10/2026",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dp08.nist.dp.blockchain",
    "label": "NIST — Blockchain Technology Overview",
    "url": "https://csrc.nist.gov/pubs/ir/8202/final",
    "locator": "Resumo executivo e seção 2: registro, consenso e redes permissionadas/abertas",
    "version": "NIST IR 8202, versão final de outubro de 2018",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dp08.lei.dp.ativos",
    "label": "Lei 14.478/2022 — Ativos virtuais",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/lei/l14478.htm",
    "locator": "Art. 3º e exclusões; art. 1º parágrafo único; sem regime atual de autorização das prestadoras",
    "version": "Texto oficial consultado em 01/10/2026",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dp09.bcb.dp.drex",
    "label": "BCB — Drex",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/drex",
    "locator": "Proposta de plataforma integrada e intermediação; sem data de lançamento ou acesso público presumido",
    "version": "Página oficial consultada em 01/10/2026",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dp09.bcb.dp.drex.conceito",
    "label": "BCB — FAQ Drex",
    "url": "https://www.bcb.gov.br/meubc/faqs/p/drex",
    "locator": "CBDC; distinção entre emissão de atacado pelo BC e representações de varejo por instituições autorizadas",
    "version": "FAQ com atualização exibida de 16/10/2023",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dp09.bcb.dp.drex.lancamento",
    "label": "BCB — FAQ Lançamento do Drex",
    "url": "https://www.bcb.gov.br/meubc/faqs/p/lancamento-do-drex",
    "locator": "Página mantém ausência de data específica; não é confirmação independente do estágio de todas as etapas",
    "version": "FAQ com atualização exibida de 20/02/2024; consultada em 01/10/2026",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dp09.bcb.dp.pix",
    "label": "BCB — Pix",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/pix",
    "locator": "Conceito, disponibilidade e contas; não tarifas/limites/exceções operacionais",
    "version": "Página oficial consultada em 01/10/2026",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dp09.nist.dp.blockchain",
    "label": "NIST — Blockchain Technology Overview",
    "url": "https://csrc.nist.gov/pubs/ir/8202/final",
    "locator": "Resumo executivo e seção 2: registro, consenso e redes permissionadas/abertas",
    "version": "NIST IR 8202, versão final de outubro de 2018",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dp10.cmn.dp.correspondentes",
    "label": "CMN — Resolução 4.935/2021",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/exibenormativo?tipo=Resolu%C3%A7%C3%A3o%20CMN&numero=4935",
    "locator": "Arts. 2º, 3º, 12 e 14: atuação contratada, responsabilidade e identificação; art. 8º revogado não utilizado",
    "version": "Versão vigente exibida pelo BCB, atualizada em 01/12/2025",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dp11.bis.dp.bigtech",
    "label": "BIS — Big tech in finance",
    "url": "https://www.bis.org/publications/aer-2019/big-tech-finance-opportunities-risks",
    "locator": "Conceitos de plataforma, dados, rede e entrada em finanças; não estatísticas atuais",
    "version": "Annual Economic Report 2019, capítulo III",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dp12.bis.dp.bigtech",
    "label": "BIS — Big tech in finance",
    "url": "https://www.bis.org/publications/aer-2019/big-tech-finance-opportunities-risks",
    "locator": "Conceitos de plataforma, dados, rede e entrada em finanças; não estatísticas atuais",
    "version": "Annual Economic Report 2019, capítulo III",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dp12.lei.dp.lgpd",
    "label": "Lei 13.709/2018 — LGPD",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm",
    "locator": "Art. 6º: finalidade, adequação, necessidade e não discriminação; art. 7º: bases legais",
    "version": "Texto oficial consultado em 01/10/2026",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dpr.bcb.dp.fintechs",
    "label": "BCB — Fintechs",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/fintechs",
    "locator": "Definição introdutória; não utilizados limites ou normas antigos da página",
    "version": "Página oficial consultada em 01/10/2026",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dpr.fsb.dp.nbfi",
    "label": "FSB — Non-Bank Financial Intermediation",
    "url": "https://www.fsb.org/work-of-the-fsb/financial-innovation-and-structural-change/non-bank-financial-intermediation/",
    "locator": "Introdução e Monitoring: universo amplo, subconjunto de riscos, liquidez/prazos/alavancagem",
    "version": "Página oficial consultada em 01/10/2026",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dpr.bcb.dp.spb",
    "label": "BCB — Sistema de Pagamentos Brasileiro",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/spb",
    "locator": "Infraestruturas, arranjos e participantes",
    "version": "Página oficial consultada em 01/10/2026",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dpr.bcb.dp.pix",
    "label": "BCB — Pix",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/pix",
    "locator": "Conceito, disponibilidade e contas; não tarifas/limites/exceções operacionais",
    "version": "Página oficial consultada em 01/10/2026",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dpr.bcb.dp.openfinance",
    "label": "BCB — Open Finance",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/openfinance",
    "locator": "Escolha de dados/destinatário/prazo, cancelamento e benefícios possíveis",
    "version": "Página oficial consultada em 01/10/2026",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dpr.nist.dp.blockchain",
    "label": "NIST — Blockchain Technology Overview",
    "url": "https://csrc.nist.gov/pubs/ir/8202/final",
    "locator": "Resumo executivo e seção 2: registro, consenso e redes permissionadas/abertas",
    "version": "NIST IR 8202, versão final de outubro de 2018",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dpr.lei.dp.ativos",
    "label": "Lei 14.478/2022 — Ativos virtuais",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/lei/l14478.htm",
    "locator": "Art. 3º e exclusões; art. 1º parágrafo único; sem regime atual de autorização das prestadoras",
    "version": "Texto oficial consultado em 01/10/2026",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dpr.bcb.dp.drex",
    "label": "BCB — Drex",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/drex",
    "locator": "Proposta de plataforma integrada e intermediação; sem data de lançamento ou acesso público presumido",
    "version": "Página oficial consultada em 01/10/2026",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dpr.cmn.dp.correspondentes",
    "label": "CMN — Resolução 4.935/2021",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/exibenormativo?tipo=Resolu%C3%A7%C3%A3o%20CMN&numero=4935",
    "locator": "Arts. 2º, 3º, 12 e 14: atuação contratada, responsabilidade e identificação; art. 8º revogado não utilizado",
    "version": "Versão vigente exibida pelo BCB, atualizada em 01/12/2025",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dpr.bis.dp.bigtech",
    "label": "BIS — Big tech in finance",
    "url": "https://www.bis.org/publications/aer-2019/big-tech-finance-opportunities-risks",
    "locator": "Conceitos de plataforma, dados, rede e entrada em finanças; não estatísticas atuais",
    "version": "Annual Economic Report 2019, capítulo III",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dpr.lei.dp.lgpd",
    "label": "Lei 13.709/2018 — LGPD",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm",
    "locator": "Art. 6º: finalidade, adequação, necessidade e não discriminação; art. 7º: bases legais",
    "version": "Texto oficial consultado em 01/10/2026",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dpchefe.bcb.conta.deposito",
    "label": "BCB — Conta bancária (corrente ou poupança)",
    "url": "https://www.bcb.gov.br/meubc/faqs/p/o-que-e-conta-de-depositos",
    "version": "FAQ atualizada em 26/03/2024; consultada em 30/09/2026",
    "locator": "Resposta oficial completa no recorte indicado",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "dp.dpchefe.bcb.conta.digital",
    "label": "BCB — Conta digital ou eletrônica",
    "url": "https://www.bcb.gov.br/meubc/faqs/p/o-que-e-conta-digital-ou-eletronica",
    "version": "FAQ atualizada em 26/03/2024; consultada em 30/09/2026",
    "locator": "Resposta oficial completa no recorte indicado",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "dp.dpchefe.bcb.conta.pagamento",
    "label": "BCB — Tipos de conta de pagamento",
    "url": "https://www.bcb.gov.br/meubc/faqs/p/quais-sao-os-tipos-de-conta-de-pagamento",
    "version": "FAQ atualizada em 31/01/2023; consultada em 30/09/2026",
    "locator": "Resposta oficial completa no recorte indicado",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "dp.dpchefe.caixa.dp.canais",
    "label": "CAIXA — App CAIXA e Internet Banking CAIXA",
    "url": "https://www.caixa.gov.br/atendimento/canais-digitais/app-caixa-internet-banking/Paginas/default.aspx",
    "version": "Página institucional consultada em 01/10/2026, 01:50 UTC",
    "locator": "O que são os canais e exemplos de serviços; sem reproduzir procedimentos, limites ou versão Beta",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dpchefe.bcb.dp.fintechs",
    "label": "BCB — Fintechs",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/fintechs",
    "version": "Página institucional; consulta em 01/10/2026, 01:43 UTC",
    "locator": "Definição introdutória e benefícios possíveis; não reutilizar limites ou referências normativas de outras seções",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dpchefe.lei.dp.startups",
    "label": "LC 182/2021 — Startups",
    "url": "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp182.htm",
    "locator": "Art. 4º: conceito e requisitos adicionais para enquadramento",
    "version": "Texto oficial consultado; sem ensino de limites numéricos",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dpchefe.bis.dp.bigtech",
    "label": "BIS — Big tech in finance",
    "url": "https://www.bis.org/publications/aer-2019/big-tech-finance-opportunities-risks",
    "locator": "Conceitos de plataforma, dados, rede e entrada em finanças; não estatísticas atuais",
    "version": "Annual Economic Report 2019, capítulo III",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dpchefe.fsb.dp.nbfi",
    "label": "FSB — Non-Bank Financial Intermediation",
    "url": "https://www.fsb.org/work-of-the-fsb/financial-innovation-and-structural-change/non-bank-financial-intermediation/",
    "locator": "Introdução e Monitoring: universo amplo, subconjunto de riscos, liquidez/prazos/alavancagem",
    "version": "Página oficial consultada em 01/10/2026",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dpchefe.bcb.dp.spb",
    "label": "BCB — Sistema de Pagamentos Brasileiro",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/spb",
    "locator": "Infraestruturas, arranjos e participantes",
    "version": "Página oficial consultada em 01/10/2026",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dpchefe.bcb.dp.arranjos",
    "label": "BCB — Arranjos de pagamento",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/arranjospagamento",
    "locator": "Conceito e distinção entre arranjo, participantes e instituições",
    "version": "Página oficial consultada em 01/10/2026",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dpchefe.bcb.dp.pix",
    "label": "BCB — Pix",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/pix",
    "locator": "Conceito, disponibilidade e contas; não tarifas/limites/exceções operacionais",
    "version": "Página oficial consultada em 01/10/2026",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dpchefe.bcb.dp.openfinance",
    "label": "BCB — Open Finance",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/openfinance",
    "locator": "Escolha de dados/destinatário/prazo, cancelamento e benefícios possíveis",
    "version": "Página oficial consultada em 01/10/2026",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dpchefe.nist.dp.blockchain",
    "label": "NIST — Blockchain Technology Overview",
    "url": "https://csrc.nist.gov/pubs/ir/8202/final",
    "locator": "Resumo executivo e seção 2: registro, consenso e redes permissionadas/abertas",
    "version": "NIST IR 8202, versão final de outubro de 2018",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dpchefe.lei.dp.ativos",
    "label": "Lei 14.478/2022 — Ativos virtuais",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/lei/l14478.htm",
    "locator": "Art. 3º e exclusões; art. 1º parágrafo único; sem regime atual de autorização das prestadoras",
    "version": "Texto oficial consultado em 01/10/2026",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dpchefe.bcb.dp.drex",
    "label": "BCB — Drex",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/drex",
    "locator": "Proposta de plataforma integrada e intermediação; sem data de lançamento ou acesso público presumido",
    "version": "Página oficial consultada em 01/10/2026",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dpchefe.bcb.dp.drex.conceito",
    "label": "BCB — FAQ Drex",
    "url": "https://www.bcb.gov.br/meubc/faqs/p/drex",
    "locator": "CBDC; distinção entre emissão de atacado pelo BC e representações de varejo por instituições autorizadas",
    "version": "FAQ com atualização exibida de 16/10/2023",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dpchefe.bcb.dp.drex.lancamento",
    "label": "BCB — FAQ Lançamento do Drex",
    "url": "https://www.bcb.gov.br/meubc/faqs/p/lancamento-do-drex",
    "locator": "Página mantém ausência de data específica; não é confirmação independente do estágio de todas as etapas",
    "version": "FAQ com atualização exibida de 20/02/2024; consultada em 01/10/2026",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dpchefe.cmn.dp.correspondentes",
    "label": "CMN — Resolução 4.935/2021",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/exibenormativo?tipo=Resolu%C3%A7%C3%A3o%20CMN&numero=4935",
    "locator": "Arts. 2º, 3º, 12 e 14: atuação contratada, responsabilidade e identificação; art. 8º revogado não utilizado",
    "version": "Versão vigente exibida pelo BCB, atualizada em 01/12/2025",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "dp.dpchefe.lei.dp.lgpd",
    "label": "Lei 13.709/2018 — LGPD",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm",
    "locator": "Art. 6º: finalidade, adequação, necessidade e não discriminação; art. 7º: bases legais",
    "version": "Texto oficial consultado em 01/10/2026",
    "checkedAt": "2026-10-01"
  }
]);
