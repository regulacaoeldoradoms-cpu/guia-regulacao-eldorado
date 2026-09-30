// Gerado por node worker/scripts/studies-mp-candidate.mjs --write. Não editar.
// Fonte editorial #563; todas as missões permanecem draft. Sem autorização de ativação.
export const MP_MISSIONS = Object.freeze([
  {
    "id": "banking.mp.mercados",
    "topicId": "banking.mp.mercados",
    "contentVersion": 1,
    "order": 10,
    "title": "O que acontece em cada mercado",
    "shortTitle": "MP-01",
    "kind": "lesson",
    "objective": "Comparar monetário, crédito, capitais e câmbio pela operação, pelo objeto e pelos papéis; reconhecer informação insuficiente.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 25,
    "publication": {
      "status": "draft",
      "releaseId": "markets-policy-intro-r1",
      "releaseSequence": 2,
      "changeImpact": "new"
    },
    "sourceIds": [
      "mp.mp01.cvm.sfn.segmentos",
      "mp.mp01.cvm.valores.papeis",
      "mp.mp01.bcb.credito.2026",
      "mp.mp01.cvm.primario.secundario"
    ],
    "sections": [
      {
        "id": "perguntas",
        "type": "explanation",
        "heading": "1. Observe a operação antes de escolher o mercado",
        "body": "Nesta aula você vai comparar quatro segmentos: monetário, de crédito, de capitais e de câmbio. Não precisa calcular juros nem conhecer uma cotação atual. Leia primeiro o que aconteceu: quem participou, o que foi negociado e para qual finalidade. Mercado é o conjunto de relações em que essas operações acontecem; não precisa ser um prédio. Instituição é uma organização participante. Operação é o negócio realizado. Instrumento ou produto é aquilo que estrutura esse negócio. Assim, o nome de um banco não responde, sozinho, qual mercado aparece no caso.",
        "sourceIds": []
      },
      {
        "id": "credito",
        "type": "explanation",
        "heading": "2. Crédito: receber recursos e assumir uma obrigação",
        "body": "Tomador é quem recebe os recursos emprestados; devedor é quem tem a obrigação de pagar. Credor é quem tem o direito de receber. No empréstimo bancário que estudaremos, o banco concede recursos à pessoa ou empresa, que deve devolvê-los nas condições contratadas. Juros são a remuneração pelo uso dos recursos durante um período. Prazo é esse intervalo; vencimento é a data em que uma obrigação deve ser cumprida. Esses termos ajudam a ler o contrato, mas uma operação não vira monetária apenas porque vence logo. Esta aula não compara custos nem recomenda contratar crédito.",
        "sourceIds": [
          "mp.mp01.bcb.credito.2026"
        ]
      },
      {
        "id": "exemplo-credito",
        "type": "worked-example",
        "heading": "3. Exemplo resolvido: as despesas de uma oficina",
        "body": "Caso inteiramente fictício: a Oficina Cedro contrata com o Banco Ponte um empréstimo em reais para pagar despesas do mês. Deve devolver ao banco conforme o contrato. Passo 1: a finalidade é obter recursos para a oficina. Passo 2: a oficina é tomadora/devedora; o banco é credor nessa relação. Passo 3: a operação descrita é concessão de crédito, não compra de participação na oficina nem troca de moedas. Conclusão: mercado de crédito. O uso posterior do dinheiro para comprar peças é outra operação; não muda a natureza do empréstimo que estamos classificando.",
        "sourceIds": []
      },
      {
        "id": "capitais",
        "type": "explanation",
        "heading": "4. Capitais: emitir instrumentos para captar recursos",
        "body": "Emissor é quem cria e coloca um instrumento no mercado. Investidor é quem aplica recursos nele. Uma ação representa participação na sociedade: seu titular passa a ser um sócio, chamado acionista, não credor só por possuir a ação. Uma debênture é um título que formaliza dívida da emissora nas condições previstas. Portanto, há dívida também no mercado de capitais. Distribuir títulos é prestar o serviço de colocá-los junto aos investidores. Distribuir títulos não torna o distribuidor responsável pelo pagamento da dívida da emissora aos investidores. Isso não significa ausência de intermediários ou de deveres próprios dos prestadores. Observe o instrumento e o papel exercido, não apenas a palavra banco. O segmento também inclui negociação posterior: se um investidor vende a outro um instrumento já emitido, o pagamento vai ao vendedor, sem representar automaticamente novos recursos para a companhia. Emissão e negociação posterior são operações distintas.",
        "sourceIds": [
          "mp.mp01.cvm.valores.papeis",
          "mp.mp01.cvm.primario.secundario"
        ]
      },
      {
        "id": "exemplo-capitais",
        "type": "worked-example",
        "heading": "5. Exemplo resolvido: duas formas de financiar a mesma empresa",
        "body": "Caso fictício: para um projeto, a Companhia Horizonte estuda duas alternativas. Na primeira, contrata empréstimo com o Banco Ponte. Na segunda, emite debêntures que investidores compram; o banco somente presta o serviço de distribuição nessa operação. Passo 1: a finalidade geral, financiar o projeto, é igual. Passo 2: na primeira alternativa, a companhia deve ao banco que lhe concedeu crédito. Na segunda, deve aos investidores titulares das debêntures, conforme os títulos. Passo 3: a primeira é crédito bancário; a segunda é captação no mercado de capitais. O nome do banco e a existência de dívida não bastam para distingui-las. Se a companhia emitisse ações, o investidor teria participação societária, não o mesmo direito de recebimento de uma debênture. Não estamos afirmando rentabilidade ou ausência de risco.",
        "sourceIds": []
      },
      {
        "id": "monetario",
        "type": "explanation",
        "heading": "6. Monetário: recursos para a liquidez do sistema",
        "body": "No contexto desta aula, liquidez significa disponibilidade de recursos para cumprir pagamentos no momento necessário. Liquidação é a efetivação de uma obrigação ou operação; não é sinônimo de liquidez. O mercado monetário envolve transferências de curtíssimo prazo, inclusive entre instituições financeiras e em operações com o Banco Central, ligadas à liquidez do sistema. Política monetária é o conjunto de decisões e ações sobre as condições da moeda e dos juros; mercado monetário é um campo de operações. Não são a mesma coisa. Não estudaremos aqui instrumentos específicos nem um número obrigatório de dias.",
        "sourceIds": [
          "mp.mp01.cvm.sfn.segmentos"
        ]
      },
      {
        "id": "exemplo-monetario",
        "type": "worked-example",
        "heading": "7. Exemplo resolvido: ajustar recursos para pagamentos",
        "body": "Caso fictício e simplificado: o Banco Lago precisa de recursos disponíveis para cumprir pagamentos hoje. Outro banco transfere recursos por curtíssimo prazo em uma operação destinada a esse ajuste de liquidez. Passo 1: identifique a finalidade expressa, ajustar a disponibilidade entre instituições. Passo 2: observe os participantes e o prazo, em conjunto. Passo 3: nesse recorte, a operação pertence ao mercado monetário. Compare com a oficina: ali o banco concedeu crédito a uma empresa para suas despesas. Dizer apenas que uma operação dura pouco não informa quem participa ou o que ela resolve. O exemplo não ensina o mecanismo de liquidação nem as regras de um instrumento específico.",
        "sourceIds": []
      },
      {
        "id": "cambio",
        "type": "explanation",
        "heading": "8. Câmbio: a conversão entre moedas",
        "body": "Real é a moeda brasileira; euro e dólar são exemplos de moedas estrangeiras. No câmbio, o objeto da operação é a troca entre moedas. Cotação expressa a relação de troca: uma indicação em reais por euro informa quantos reais correspondem a uma unidade de euro naquele preço. A ordem das moedas importa. Não usaremos valores ou taxas atuais. Um pagamento internacional pode envolver câmbio, mas apenas citar exterior não informa se houve conversão: é preciso ler a operação descrita.",
        "sourceIds": [
          "mp.mp01.cvm.sfn.segmentos"
        ]
      },
      {
        "id": "exemplo-cambio",
        "type": "worked-example",
        "heading": "9. Exemplo resolvido: converter recursos para uma viagem",
        "body": "Caso fictício: Júlia usa reais que já possui para comprar euros para uma viagem, por meio de uma instituição que presta esse serviço. Passo 1: o objeto é converter reais em euros. Passo 2: não há empréstimo nem aquisição de participação em empresa no caso. Passo 3: a conversão é uma operação de câmbio. A viagem explica a necessidade, mas a pista decisiva é a troca de moedas. Se o enunciado dissesse somente que Júlia pagou um serviço no exterior, faltaria saber como ocorreu o pagamento; não seria correto inventar a conversão.",
        "sourceIds": []
      },
      {
        "id": "limites",
        "type": "explanation",
        "heading": "10. Separe os negócios e reconheça o que falta",
        "body": "Use três perguntas: qual é a finalidade da operação; qual é o objeto ou instrumento; quais papéis os participantes exercem? Analise cada operação separadamente. Uma empresa pode tomar empréstimo em reais e depois converter parte dos reais em moeda estrangeira: o encadeamento contém crédito e câmbio. Quando o relato informa apenas que uma empresa obteve recursos com ajuda de um banco, faltam detalhes para escolher entre concessão de crédito e distribuição de títulos. Pedir essa informação é uma resposta fundamentada, não um erro de memória. Os quatro segmentos se relacionam; esta comparação introdutória não resolve toda operação complexa.",
        "sourceIds": []
      },
      {
        "id": "exemplo-limite",
        "type": "worked-example",
        "heading": "11. Exemplo resolvido: não completar o enunciado por conta própria",
        "body": "Caso fictício: a Companhia Serra anuncia que conseguiu recursos com apoio do Banco Vale. Um colega conclui que houve empréstimo bancário. Passo 1: localize o dado conhecido, apoio do banco. Passo 2: perceba o dado ausente, a operação realizada. Passo 3: pergunte se o banco concedeu um empréstimo ou prestou serviços em uma emissão. Nenhuma dessas alternativas está demonstrada no anúncio. A conclusão correta é que a descrição é insuficiente. Reler o contraste entre a oficina e a emissão ajuda a descobrir exatamente o que falta, em vez de decorar que banco significa sempre crédito.",
        "sourceIds": []
      },
      {
        "id": "glossario",
        "type": "glossary",
        "heading": "12. Consulta rápida depois de compreender",
        "body": "Instituição: organização participante. Operação: negócio realizado. Credor/devedor: quem tem direito de receber/obrigação de pagar. Emissor: quem emite o instrumento. Investidor: quem aplica recursos. Ação: participação societária. Debênture: dívida da emissora. Liquidez, no recorte usado: disponibilidade para cumprir pagamentos. Liquidação: efetivação da obrigação/operação. Cotação: relação de troca entre moedas. Consulte as explicações anteriores para entender cada termo no caso, sem substituir o raciocínio por esta lista.",
        "sourceIds": []
      },
      {
        "id": "resumo",
        "type": "summary",
        "heading": "13. Prepare sua explicação antes da prática",
        "body": "Reconstrua os quatro exemplos sem consultar: o empréstimo da oficina; a emissão da companhia; o ajuste entre bancos; a conversão para a viagem. Em cada um, diga quem participa, qual operação acontece e por que a classificou assim. Depois confira os passos resolvidos. Se sua justificativa usar só prazo, nome do banco ou existência de dívida, volte ao contraste pertinente. Os itens seguintes são prática desta aula, não avaliação independente. Acertar agora ou concluir uma revisão não comprova retenção duradoura nem prontidão para prova.",
        "sourceIds": []
      }
    ],
    "recall": [
      "Explique mercado, instituição e operação com um dos casos; compare com a seção perguntas.",
      "Por que existir dívida não prova que houve empréstimo bancário? Confira capitais e exemplo-capitais.",
      "Escolha um erro da prática, localize a seção indicada e explique a diferença sem consultar a alternativa. Depois confira os passos do exemplo."
    ],
    "questions": [
      {
        "id": "q.mp01.q01",
        "topicId": "banking.mp.mercados",
        "prompt": "Caso fictício: o Banco Leste concede um empréstimo à Padaria Sol. Qual associação identifica instituição e operação, respectivamente?",
        "options": [
          "Crédito e Banco Leste.",
          "Padaria Sol e mercado financeiro.",
          "Banco Leste e concessão do empréstimo.",
          "Empréstimo e Padaria Sol."
        ],
        "answer": 2,
        "explanation": "A organização participante é o banco; o negócio realizado é a concessão. A padaria também é uma organização participante, mas não o nome da operação.",
        "optionRationales": [
          "Inverte segmento e instituição.",
          "O segundo termo é um ambiente amplo, não a operação descrita.",
          "Distingue quem participa do que foi feito.",
          "Inverte operação e organização."
        ]
      },
      {
        "id": "q.mp01.q02",
        "topicId": "banking.mp.mercados",
        "prompt": "Caso fictício: um banco empresta reais à Loja Ipê por poucos dias para pagar fornecedores. Qual classificação é sustentada pelo relato?",
        "options": [
          "Crédito: há concessão à loja com obrigação de devolver.",
          "Monetário: todo empréstimo curto pertence a esse segmento.",
          "Capitais: qualquer recurso usado por empresa vem desse mercado.",
          "Câmbio: pagar fornecedores significa trocar moedas."
        ],
        "answer": 0,
        "explanation": "A operação descrita é concessão de crédito à loja. Seu prazo curto não basta para transformá-la em ajuste de liquidez entre instituições.",
        "optionRationales": [
          "Usa operação e papéis efetivamente informados.",
          "Usa só o prazo e ignora a finalidade e as partes.",
          "Confunde finalidade empresarial com instrumento de captação.",
          "O relato não informa troca entre moedas."
        ]
      },
      {
        "id": "q.mp01.q03",
        "topicId": "banking.mp.mercados",
        "prompt": "Caso fictício: a Companhia Aurora emite debêntures adquiridas por investidores; um banco presta somente distribuição. Qual leitura combina instrumento e papéis?",
        "options": [
          "Os investidores viram acionistas por terem adquirido debêntures.",
          "O banco se torna automaticamente o devedor dos títulos por distribuí-los.",
          "A participação de um banco transforma a emissão em empréstimo bancário.",
          "A companhia é emissora/devedora; os investidores são titulares da dívida no mercado de capitais."
        ],
        "answer": 3,
        "explanation": "A debênture expressa dívida da emissora. O banco exerce o serviço descrito, sem que distribuição e tomada da dívida sejam a mesma função.",
        "optionRationales": [
          "Confunde dívida com participação em ações.",
          "Confunde distribuição com a obrigação da emissora.",
          "Classifica pela instituição, ignorando a emissão.",
          "Identifica título e relações descritas."
        ]
      },
      {
        "id": "q.mp01.q04",
        "topicId": "banking.mp.mercados",
        "prompt": "Caso fictício: dois bancos realizam uma transferência de curtíssimo prazo para ajustar recursos disponíveis aos pagamentos do dia. Qual raciocínio é mais adequado?",
        "options": [
          "Crédito ao consumidor, porque todo pagamento é consumo.",
          "Monetário, considerando em conjunto liquidez, participantes e prazo.",
          "Câmbio, porque todo recurso transferido muda de moeda.",
          "Capitais, porque toda instituição precisa de capital."
        ],
        "answer": 1,
        "explanation": "O caso delimita ajuste de liquidez entre bancos por curtíssimo prazo. É essa combinação, não uma palavra isolada, que sustenta a classificação.",
        "optionRationales": [
          "Não há consumidor ou crédito ao consumo descrito.",
          "Usa os três elementos presentes no caso.",
          "Transferência não implica conversão entre moedas.",
          "A palavra capital não demonstra emissão ou negociação de títulos."
        ]
      },
      {
        "id": "q.mp01.q05",
        "topicId": "banking.mp.mercados",
        "prompt": "Caso fictício: Bia converte euros que já possui em reais. O banco recebe as moedas e realiza a conversão. O que determina a classificação introdutória?",
        "options": [
          "O fato de ocorrer em banco prova que é empréstimo.",
          "Receber reais sempre significa emitir uma dívida.",
          "A troca entre moedas caracteriza câmbio.",
          "Possuir euros significa ser acionista de uma empresa estrangeira."
        ],
        "answer": 2,
        "explanation": "O objeto explicitado é a conversão entre moedas. Nenhuma dívida ou participação societária foi descrita.",
        "optionRationales": [
          "Ignora o serviço efetivamente informado.",
          "Confunde recebimento de moeda com obrigação de pagamento.",
          "Usa o objeto da operação, inclusive na direção inversa à do exemplo.",
          "Confunde moeda estrangeira com ação."
        ]
      },
      {
        "id": "q.mp01.q06",
        "topicId": "banking.mp.mercados",
        "prompt": "Um anúncio fictício informa apenas: “A Empresa Mar conseguiu recursos com auxílio de um banco”. Qual informação ajudaria a distinguir crédito bancário de captação por títulos?",
        "options": [
          "O valor total dos recursos obtidos, sem explicar a operação.",
          "Se houve empréstimo concedido pelo banco ou distribuição de títulos emitidos pela empresa.",
          "Por quantos anos a empresa pretende utilizar os recursos, sem descrever o instrumento.",
          "Se a empresa deseja usar o dinheiro em um projeto."
        ],
        "answer": 1,
        "explanation": "É preciso identificar a operação e a relação entre as partes. A finalidade geral de financiar um projeto pode estar presente nas duas alternativas.",
        "optionRationales": [
          "O mesmo valor pode ser obtido por operações diferentes.",
          "Distingue concessão e prestação de serviço na emissão.",
          "O horizonte de uso não informa como os recursos foram captados.",
          "A finalidade isolada pode ser igual nos dois casos."
        ]
      },
      {
        "id": "q.mp01.q07",
        "topicId": "banking.mp.mercados",
        "prompt": "Caso fictício: uma empresa contrata empréstimo em reais e, depois, compra dólares com parte desses recursos. Como analisar os dois negócios descritos?",
        "options": [
          "Primeiro crédito, depois câmbio: classificar cada operação.",
          "Somente câmbio, apagando a obrigação do empréstimo.",
          "Somente crédito, pois a origem do dinheiro impede outra classificação.",
          "Somente monetário, porque houve movimentação de dinheiro."
        ],
        "answer": 0,
        "explanation": "O contrato de empréstimo e a conversão têm objetos diferentes. A ligação entre eles não elimina suas características.",
        "optionRationales": [
          "Preserva as duas relações explicitadas.",
          "Ignora a primeira operação.",
          "Confunde origem dos recursos com o objeto da operação seguinte.",
          "Movimentação de dinheiro não basta para essa classificação."
        ]
      },
      {
        "id": "q.mp01.q08",
        "topicId": "banking.mp.mercados",
        "prompt": "Caso fictício: dois investidores adquirem, na emissão, instrumentos diferentes da mesma companhia: Lia compra ações e Rui compra debêntures. Qual contraste foi ensinado?",
        "options": [
          "Ambos são acionistas porque entregaram dinheiro à companhia.",
          "Ambos têm o mesmo direito de receber uma dívida, independentemente do instrumento.",
          "Lia é credora pelas ações e Rui acionista pelas debêntures.",
          "Lia adquire participação societária; Rui adquire um título de dívida."
        ],
        "answer": 3,
        "explanation": "O destino dos recursos não torna iguais os direitos associados a instrumentos diferentes. Ação e debênture precisam ser distinguidas.",
        "optionRationales": [
          "Ignora a natureza da debênture.",
          "Transforma participação em dívida.",
          "Inverte as características ensinadas.",
          "Relaciona cada instrumento ao tipo de vínculo."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "mp01-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.mp01.q01": [
          {
            "missionId": "banking.mp.mercados",
            "sectionId": "perguntas"
          },
          {
            "missionId": "banking.mp.mercados",
            "sectionId": "exemplo-credito"
          }
        ],
        "q.mp01.q02": [
          {
            "missionId": "banking.mp.mercados",
            "sectionId": "credito"
          },
          {
            "missionId": "banking.mp.mercados",
            "sectionId": "exemplo-credito"
          },
          {
            "missionId": "banking.mp.mercados",
            "sectionId": "exemplo-monetario"
          }
        ],
        "q.mp01.q03": [
          {
            "missionId": "banking.mp.mercados",
            "sectionId": "capitais"
          },
          {
            "missionId": "banking.mp.mercados",
            "sectionId": "exemplo-capitais"
          }
        ],
        "q.mp01.q04": [
          {
            "missionId": "banking.mp.mercados",
            "sectionId": "monetario"
          },
          {
            "missionId": "banking.mp.mercados",
            "sectionId": "exemplo-monetario"
          }
        ],
        "q.mp01.q05": [
          {
            "missionId": "banking.mp.mercados",
            "sectionId": "cambio"
          },
          {
            "missionId": "banking.mp.mercados",
            "sectionId": "exemplo-cambio"
          }
        ],
        "q.mp01.q06": [
          {
            "missionId": "banking.mp.mercados",
            "sectionId": "exemplo-capitais"
          },
          {
            "missionId": "banking.mp.mercados",
            "sectionId": "limites"
          },
          {
            "missionId": "banking.mp.mercados",
            "sectionId": "exemplo-limite"
          }
        ],
        "q.mp01.q07": [
          {
            "missionId": "banking.mp.mercados",
            "sectionId": "credito"
          },
          {
            "missionId": "banking.mp.mercados",
            "sectionId": "cambio"
          },
          {
            "missionId": "banking.mp.mercados",
            "sectionId": "limites"
          }
        ],
        "q.mp01.q08": [
          {
            "missionId": "banking.mp.mercados",
            "sectionId": "capitais"
          },
          {
            "missionId": "banking.mp.mercados",
            "sectionId": "exemplo-capitais"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.mp01",
      "blockId": "banking.markets-policy",
      "prerequisiteId": "banking.sfn.boss",
      "parametersApproved": false
    }
  },
  {
    "id": "banking.mp.moeda",
    "topicId": "banking.mp.moeda",
    "contentVersion": 1,
    "order": 11,
    "title": "Moeda, pagamentos e liquidez",
    "shortTitle": "MP-02",
    "kind": "lesson",
    "objective": "Explicar funções da moeda, separar instrumentos de recursos e interpretar disponibilidade e vencimentos em casos simples.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 25,
    "publication": {
      "status": "draft",
      "releaseId": "markets-policy-intro-r1",
      "releaseSequence": 2,
      "changeImpact": "new"
    },
    "sourceIds": [
      "mp.mp02.bce.moeda.funcoes",
      "mp.mp02.bcb.pagamento.conceito",
      "mp.mp02.bcb.liquidez.2026"
    ],
    "sections": [
      {
        "id": "retomada",
        "type": "explanation",
        "heading": "1. O que muda quando observamos o dinheiro e as datas?",
        "body": "MP-01 comparou operações e participantes. Agora vamos separar a moeda usada para expressar valores, o instrumento que permite pagar e os recursos disponíveis no momento necessário. Não basta saber que alguém possui bens ou espera receber dinheiro: uma obrigação tem uma data. Aqui, obrigação é o compromisso de pagar; vencimento é a data prevista para cumpri-lo. Os exemplos são fictícios e trazem todas as condições necessárias. Usaremos apenas soma e subtração, sem juros, agregados monetários ou criação de moeda.",
        "sourceIds": []
      },
      {
        "id": "funcoes",
        "type": "explanation",
        "heading": "2. Três funções da moeda, com perguntas diferentes",
        "body": "Unidade de conta: em que unidade expressamos e comparamos valores? Um preço de R$ 20 e outro de R$ 25 podem ser comparados porque estão em reais. Meio de troca: o que usamos para realizar a troca e pagar? Usar dinheiro para adquirir um produto cumpre essa função, sem precisar oferecer ao vendedor outro produto que ele deseje. Reserva de valor: como transferimos poder de compra para uso futuro? Guardar moeda permite adiar seu uso. Essa função não garante comprar sempre a mesma quantidade de produtos: os preços podem mudar. As funções podem coexistir; quando uma pergunta destaca uma ação, identifique a função evidenciada por ela.",
        "sourceIds": [
          "mp.mp02.bce.moeda.funcoes"
        ]
      },
      {
        "id": "exemplo-funcoes",
        "type": "worked-example",
        "heading": "3. Exemplo resolvido: comparar, pagar e guardar",
        "body": "Caso fictício: Nara tem R$ 40. Compara dois cadernos de mesmas características, por R$ 20 e R$ 25; compra o primeiro por R$ 20 e guarda os R$ 20 restantes para outro dia. Passo 1: ao comparar preços expressos em reais, destaca-se unidade de conta. Passo 2: ao entregar R$ 20 para pagar, destaca-se meio de troca. Passo 3: ao manter R$ 20 para usar depois, destaca-se reserva de valor. A conta é R$ 40 menos R$ 20, resultando em R$ 20. Não concluímos que o preço do caderno ficará igual nem que essas funções pertencem a três moedas diferentes.",
        "sourceIds": []
      },
      {
        "id": "instrumento",
        "type": "explanation",
        "heading": "4. O cartão e o saldo respondem a perguntas diferentes",
        "body": "Dinheiro em espécie é o que está em notas e moedas físicas. Recursos também podem ser movimentados por registros em conta, sem sacar dinheiro. Um instrumento de pagamento, como um cartão, permite realizar ou iniciar uma operação; ele não deve ser somado ao saldo como se fosse outra quantia de dinheiro. Saldo é o valor registrado na conta em determinado momento. Para saber o que pode ser usado, precisamos conhecer a disponibilidade e as condições da operação. Nos casos desta aula, saldo próprio disponível significa recurso já existente, sem bloqueio e sem incluir limite de crédito. Esse limite é possibilidade de usar recursos de terceiros sob condições, não dinheiro próprio adicional.",
        "sourceIds": [
          "mp.mp02.bcb.pagamento.conceito",
          "mp.mp02.bcb.liquidez.2026"
        ]
      },
      {
        "id": "exemplo-instrumento",
        "type": "worked-example",
        "heading": "5. Exemplo resolvido: pagar não multiplica o saldo",
        "body": "Caso fictício: Rui possui R$ 200 de saldo próprio disponível em conta e R$ 50 em espécie. Faz uma compra de R$ 30 a débito; o enunciado informa que o pagamento foi concluído, descontado da conta e não houve tarifa ou outra movimentação. Passo 1: antes da compra, os recursos próprios somam R$ 200 + R$ 50 = R$ 250. Passo 2: a conta fica com R$ 200 − R$ 30 = R$ 170. Passo 3: os R$ 50 em espécie continuam iguais; o total restante é R$ 170 + R$ 50 = R$ 220. O cartão não acrescenta um terceiro saldo. Não contamos os mesmos R$ 200 uma vez como conta e outra como cartão.",
        "sourceIds": []
      },
      {
        "id": "datas",
        "type": "explanation",
        "heading": "6. Saldo de hoje e recebimento futuro não são a mesma informação",
        "body": "Uma entrada acrescenta recursos quando efetivamente disponível; uma saída retira recursos. O saldo em uma data resulta do saldo inicial mais entradas já disponíveis, menos saídas já realizadas. É uma fotografia daquele momento. Entradas e saídas descrevem movimentações durante um período. Um valor previsto para depois do vencimento não está disponível antes só porque consta do planejamento. Antes de somar, coloque cada evento na linha do tempo. Se o enunciado não informar quando um recebimento estará disponível ou se há bloqueio, indique a informação que falta em vez de inventá-la.",
        "sourceIds": [
          "mp.mp02.bcb.liquidez.2026"
        ]
      },
      {
        "id": "exemplo-datas",
        "type": "worked-example",
        "heading": "7. Exemplo resolvido: o total do mês não resolve o vencimento",
        "body": "Caso fictício, sem outras entradas, saídas ou crédito: no dia 5, Lia tem R$ 180 disponíveis. Deve pagar R$ 280 no dia 6. Um recebimento de R$ 150 só ficará disponível no dia 10. Passo 1: pare a linha do tempo no vencimento, dia 6. Há R$ 180, não R$ 330. Passo 2: compare com a obrigação: R$ 280 − R$ 180 = R$ 100 de insuficiência nessa data. Passo 3: os R$ 150 do dia 10 não pagam automaticamente a conta no dia 6. O planejamento mostra uma necessidade de liquidez a resolver; não determina qual contratação ou renegociação fazer. Não registramos o pagamento como realizado sem recursos. Se nada tiver sido pago até o dia 10, a chegada dos R$ 150 elevará os recursos a R$ 330; isso não apaga o atraso anterior nem calcula suas consequências.",
        "sourceIds": []
      },
      {
        "id": "liquidez",
        "type": "explanation",
        "heading": "8. Possuir um bem não significa poder pagar agora",
        "body": "Para um bem ou investimento, liquidez envolve a facilidade de convertê-lo em dinheiro por um valor adequado, considerando o prazo. Um bem pode ter valor e ainda assim não encontrar comprador a tempo, ou exigir redução relevante no preço para venda rápida. Para cumprir uma obrigação, a questão prática é quando os recursos estarão disponíveis em relação ao vencimento. Essa necessidade de liquidez se relaciona ao conceito usado em MP-01, mas não torna a venda de qualquer bem uma operação do mercado monetário. Liquidação, por sua vez, é a efetivação da obrigação ou operação; uma expectativa de entrada ainda não é um pagamento liquidado.",
        "sourceIds": [
          "mp.mp02.bcb.liquidez.2026"
        ]
      },
      {
        "id": "exemplo-liquidez",
        "type": "worked-example",
        "heading": "9. Exemplo resolvido: valor estimado e dinheiro disponível",
        "body": "Caso fictício: a Oficina Brisa tem R$ 100 disponíveis e uma máquina avaliada em R$ 1.000. Precisa pagar R$ 800 amanhã. Não há comprador confirmado, crédito ou outra entrada. Passo 1: R$ 1.000 é uma avaliação do bem, não recebimento já realizado. Passo 2: para amanhã, o único recurso confirmado é R$ 100. A diferença é R$ 800 − R$ 100 = R$ 700. Passo 3: vender a máquina poderia gerar recursos, mas faltam preço efetivo e data de disponibilidade; não podemos tratar R$ 1.100 como dinheiro pronto para pagar. O caso evidencia um problema de prazo/disponibilidade; não prova sozinho que todos os bens da oficina valem menos que suas obrigações.",
        "sourceIds": []
      },
      {
        "id": "limites",
        "type": "explanation",
        "heading": "10. O que verificar antes de concluir que o pagamento é possível",
        "body": "Pergunte: qual valor vence, em qual data, quais recursos já estarão disponíveis e que condições o caso fornece? Diferencie saldo próprio, limite de crédito, valor esperado e bem avaliado. Não confunda mensagem de operação solicitada com confirmação de pagamento concluído. Os casos aqui explicitam conclusão ou disponibilidade; não ensinam prazos de liquidação de produtos reais. Quando faltar um dado decisivo, explique qual é. Um pagamento em dinheiro físico e um realizado por instrumento eletrônico podem cumprir a mesma finalidade econômica, com formas e procedimentos diferentes.",
        "sourceIds": []
      },
      {
        "id": "glossario",
        "type": "glossary",
        "heading": "11. Termos para retomar sem adivinhar",
        "body": "Unidade de conta: referência comum para expressar valores. Meio de troca: função da moeda usada para realizar trocas. Reserva de valor: possibilidade de conservar moeda para uso futuro, sem garantia de poder de compra constante. Instrumento de pagamento: meio operacional usado para realizar/iniciar pagamento. Saldo: posição registrada em um momento. Entrada/saída: movimentação de recursos. Vencimento: data prevista para cumprir obrigação. Liquidez de um bem: facilidade de conversão em dinheiro por valor adequado e no prazo considerado. Liquidação: efetivação da operação/obrigação.",
        "sourceIds": []
      },
      {
        "id": "resumo",
        "type": "summary",
        "heading": "12. Da leitura à prática",
        "body": "Antes de responder, explique as três ações de Nara, reconstrua o saldo de Rui e desenhe as datas de Lia. Para um caso com bem a vender, diga o que precisa saber antes de contar com o dinheiro. Compare sua explicação com os exemplos. Ao errar, retome a seção indicada, refaça a conta ou a linha do tempo e só depois releia a resposta. Em outra sessão, explique um contraste sem consultar; isso é orientação de estudo, não um novo agendamento adaptativo do aplicativo. Prática exposta e conclusão de leitura não equivalem a avaliação independente ou prontidão.",
        "sourceIds": []
      }
    ],
    "recall": [
      "Dê um exemplo próprio de cada função da moeda e confira funcoes.",
      "Refaça a conta de Rui e a linha do tempo de Lia, justificando o que entra em cada data.",
      "Após um erro, localize recoverySectionIds, explique a diferença com suas palavras e confira o exemplo antes de tentar novamente."
    ],
    "questions": [
      {
        "id": "q.mp02.q01",
        "topicId": "banking.mp.moeda",
        "prompt": "Caso fictício: antes de comprar, Davi compara dois produtos equivalentes, por R$ 35 e R$ 42. Qual função da moeda está em destaque nessa comparação?",
        "options": [
          "Reserva de valor, porque qualquer preço é uma poupança.",
          "Unidade de conta, porque os valores usam a mesma referência.",
          "Meio de troca, porque comparar já significa pagar.",
          "Nenhuma função, pois a compra ainda não ocorreu."
        ],
        "answer": 1,
        "explanation": "Expressar ambos os preços em reais permite comparar valores antes do pagamento.",
        "optionRationales": [
          "Preço anunciado não significa valor guardado.",
          "Reconhece a função usada na comparação.",
          "Confunde comparar valores com concluir uma troca.",
          "Unidade de conta pode ser usada antes de comprar."
        ]
      },
      {
        "id": "q.mp02.q02",
        "topicId": "banking.mp.moeda",
        "prompt": "Caso fictício: Iara guarda R$ 70 para utilizar no mês seguinte. Qual conclusão é sustentada?",
        "options": [
          "Os mesmos R$ 70 necessariamente comprarão os mesmos produtos.",
          "Guardar dinheiro já é pagar antecipadamente qualquer obrigação futura.",
          "A função de reserva de valor só existe quando o valor rende juros.",
          "Ela adia o uso da moeda; isso não garante poder de compra constante."
        ],
        "answer": 3,
        "explanation": "A moeda pode ser mantida para uso posterior, mas os preços podem mudar. O caso não informa rendimento ou pagamento.",
        "optionRationales": [
          "Confunde quantia nominal com o que ela permite comprar.",
          "Guardar não identifica um pagamento concluído.",
          "A definição ensinada não depende de juros.",
          "Separa a função e seu limite."
        ]
      },
      {
        "id": "q.mp02.q03",
        "topicId": "banking.mp.moeda",
        "prompt": "Caso fictício: Caio tem R$ 120 próprios disponíveis em conta e R$ 30 em espécie. Uma compra de R$ 25 a débito foi concluída e descontada da conta, sem tarifa ou outras movimentações. Quanto resta de recursos próprios?",
        "options": [
          "R$ 125: R$ 95 em conta e R$ 30 em espécie.",
          "R$ 150, porque usar cartão não afeta recursos próprios.",
          "R$ 245, somando novamente o saldo inicial como valor do cartão.",
          "R$ 95, porque o pagamento também elimina o dinheiro em espécie."
        ],
        "answer": 0,
        "explanation": "A conta fica com R$ 120 − R$ 25 = R$ 95. Somando os R$ 30 em espécie, restam R$ 125. O cartão é instrumento, não saldo adicional.",
        "optionRationales": [
          "Mantém separadas as posições e desconta a compra uma única vez.",
          "Ignora o débito informado.",
          "Conta os mesmos recursos duas vezes.",
          "Ignora os R$ 30 em espécie, que não foram gastos."
        ]
      },
      {
        "id": "q.mp02.q04",
        "topicId": "banking.mp.moeda",
        "prompt": "Caso fictício, sem outras movimentações: no dia 2, Eva tem R$ 90 disponíveis. Uma obrigação de R$ 140 vence no dia 3, e R$ 80 só ficam disponíveis no dia 7. Qual análise vale no vencimento?",
        "options": [
          "Sobram R$ 30, pois todas as entradas futuras já compõem o saldo.",
          "Faltam R$ 140, pois o recebimento futuro invalida o saldo existente.",
          "Faltam R$ 50: o recebimento do dia 7 não está disponível no dia 3.",
          "A obrigação foi paga no dia 3 por haver previsão de recebimento."
        ],
        "answer": 2,
        "explanation": "No dia 3 há R$ 90; a diferença para R$ 140 é R$ 50. A data da entrada futura é decisiva.",
        "optionRationales": [
          "Antecipa indevidamente R$ 80.",
          "Desconsidera os R$ 90 já disponíveis.",
          "Compara saldo e obrigação na mesma data.",
          "Confunde previsão com execução do pagamento."
        ]
      },
      {
        "id": "q.mp02.q05",
        "topicId": "banking.mp.moeda",
        "prompt": "Caso fictício: alguém possui um bem avaliado em R$ 2.000, sem comprador confirmado, e precisa pagar R$ 600 amanhã. O que falta para contar com a venda para esse pagamento?",
        "options": [
          "Apenas a avaliação superar R$ 600.",
          "Preço efetivo e disponibilidade dos recursos a tempo do vencimento.",
          "A data em que o bem foi comprado, independentemente do prazo de venda.",
          "Somar o valor avaliado ao saldo, sem outras informações."
        ],
        "answer": 1,
        "explanation": "Valor estimado não prova venda nem disponibilidade. É preciso considerar preço e prazo para o pagamento.",
        "optionRationales": [
          "Comparar valores ignora a conversão e a data.",
          "Identifica as informações relevantes.",
          "A data de aquisição não informa quando a venda gerará recursos.",
          "Transforma expectativa em dinheiro já disponível."
        ]
      },
      {
        "id": "q.mp02.q06",
        "topicId": "banking.mp.moeda",
        "prompt": "Um relato fictício informa “há R$ 400 em conta”, mas não diz se o valor é saldo próprio disponível ou inclui limite de crédito. Uma conta de R$ 350 vence hoje. Qual resposta é mais adequada?",
        "options": [
          "O pagamento com recursos próprios é garantido pela soma exibida.",
          "É impossível pagar em qualquer condição.",
          "Todo limite de crédito é dinheiro próprio já depositado.",
          "Falta identificar a composição e a disponibilidade do valor antes de afirmar suficiência de recursos próprios."
        ],
        "answer": 3,
        "explanation": "O total informado é ambíguo. Precisamos distinguir saldo próprio disponível e possibilidade de tomar recursos de terceiros.",
        "optionRationales": [
          "Supõe uma condição não informada.",
          "Transforma ausência de informação em impossibilidade absoluta.",
          "Confunde possibilidade de crédito com recurso próprio.",
          "Solicita o dado decisivo, sem inventar a composição."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "mp02-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.mp02.q01": [
          {
            "missionId": "banking.mp.moeda",
            "sectionId": "funcoes"
          },
          {
            "missionId": "banking.mp.moeda",
            "sectionId": "exemplo-funcoes"
          }
        ],
        "q.mp02.q02": [
          {
            "missionId": "banking.mp.moeda",
            "sectionId": "funcoes"
          },
          {
            "missionId": "banking.mp.moeda",
            "sectionId": "exemplo-funcoes"
          }
        ],
        "q.mp02.q03": [
          {
            "missionId": "banking.mp.moeda",
            "sectionId": "instrumento"
          },
          {
            "missionId": "banking.mp.moeda",
            "sectionId": "exemplo-instrumento"
          }
        ],
        "q.mp02.q04": [
          {
            "missionId": "banking.mp.moeda",
            "sectionId": "datas"
          },
          {
            "missionId": "banking.mp.moeda",
            "sectionId": "exemplo-datas"
          }
        ],
        "q.mp02.q05": [
          {
            "missionId": "banking.mp.moeda",
            "sectionId": "liquidez"
          },
          {
            "missionId": "banking.mp.moeda",
            "sectionId": "exemplo-liquidez"
          },
          {
            "missionId": "banking.mp.moeda",
            "sectionId": "limites"
          }
        ],
        "q.mp02.q06": [
          {
            "missionId": "banking.mp.moeda",
            "sectionId": "instrumento"
          },
          {
            "missionId": "banking.mp.moeda",
            "sectionId": "limites"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.mp02",
      "blockId": "banking.markets-policy",
      "prerequisiteId": "banking.mp.mercados",
      "parametersApproved": false
    }
  },
  {
    "id": "banking.mp.inflacao",
    "topicId": "banking.mp.inflacao",
    "contentVersion": 1,
    "order": 12,
    "title": "Preços, inflação e leitura de juros",
    "shortTitle": "MP-03",
    "kind": "lesson",
    "objective": "Comparar preços e poder de compra, interpretar porcentagens e distinguir juros nominais/reais com base e período explícitos.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 25,
    "publication": {
      "status": "draft",
      "releaseId": "markets-policy-intro-r1",
      "releaseSequence": 2,
      "changeImpact": "new"
    },
    "sourceIds": [
      "mp.mp03.bce.inflacao.conceito",
      "mp.mp03.bcb.juros.2026"
    ],
    "sections": [
      {
        "id": "retomada",
        "type": "explanation",
        "heading": "1. Dinheiro contado e poder de compra",
        "body": "MP-02 mostrou que guardar uma quantia não garante comprar sempre a mesma quantidade. Poder de compra é o que essa quantia permite adquirir. Nesta aula, vamos comparar valores em datas diferentes. Primeiro aprenderemos porcentagem, depois preços e juros. Todos os preços e taxas dos exemplos são inventados para estudo; não representam o Brasil atual, uma oferta bancária ou a rentabilidade de um produto.",
        "sourceIds": []
      },
      {
        "id": "porcentagem",
        "type": "explanation",
        "heading": "2. Porcentagem: uma comparação com base definida",
        "body": "Por cento significa por cem: 8% = 8/100 = 0,08. Para achar 8% de R$ 100, multiplicamos 100 por 0,08 e obtemos R$ 8. Se somarmos esse aumento ao valor inicial, teremos R$ 108. Podemos escrever a mesma conta como 100 × (1 + 0,08) = 100 × 1,08. O número 1 conserva o valor inicial; 0,08 acrescenta a parcela. Para medir uma variação, calculamos (valor final − valor inicial) / valor inicial e multiplicamos por 100 para expressar em porcentagem. A base é o valor inicial, não o final. Usaremos bases positivas e sempre informaremos o período.",
        "sourceIds": []
      },
      {
        "id": "exemplo-porcentagem",
        "type": "worked-example",
        "heading": "3. Exemplo resolvido: cinco reais não significam cinco por cento",
        "body": "Caso fictício: o preço de um item passa de R$ 20 para R$ 25 entre duas datas. Passo 1: o aumento em reais é 25 − 20 = 5. Passo 2: compare com a base inicial: 5/20 = 0,25. Passo 3: 0,25 × 100 = 25%. Logo, houve aumento de R$ 5, correspondente a 25% do preço inicial. Dividir por 25 usaria outra base e responderia a outra pergunta. Dizer que aumentou 5% confundiria uma quantia em reais com uma proporção.",
        "sourceIds": []
      },
      {
        "id": "inflacao",
        "type": "explanation",
        "heading": "4. O preço de um item e o conjunto de preços",
        "body": "Inflação se refere a aumento geral de preços de bens e serviços, não apenas ao encarecimento de um item isolado. Isso não exige que todos os preços subam na mesma proporção. Para estudar o conjunto, precisamos saber quais itens entram, suas participações e quais datas são comparadas. Um índice resume uma medição definida; os hábitos de consumo de uma pessoa podem ser diferentes da composição usada nele. Assim, observar só o produto que mais chamou atenção não permite calcular a inflação de uma economia.",
        "sourceIds": [
          "mp.mp03.bce.inflacao.conceito"
        ]
      },
      {
        "id": "cesta",
        "type": "explanation",
        "heading": "5. Uma cesta pequena para compreender o raciocínio",
        "body": "Cesta significa aqui um conjunto de itens em quantidades especificadas. Para comparar seu custo, mantemos as quantidades e características e calculamos quantidade × preço para cada item; depois somamos. A participação de cada item no gasto inicial influencia o resultado. Portanto, não basta tirar a média simples das porcentagens de aumento de todos os preços. Nosso modelo serve apenas para ensinar essa comparação: não reproduz a metodologia de um índice oficial nem permite declarar a inflação brasileira.",
        "sourceIds": [
          "mp.mp03.bce.inflacao.conceito"
        ]
      },
      {
        "id": "exemplo-cesta",
        "type": "worked-example",
        "heading": "6. Exemplo resolvido: um item sobe, outro fica igual",
        "body": "Cesta fictícia: duas unidades do produto A e uma do produto B. Na data inicial, A custa R$ 10 e B R$ 20. O total é 2 × 10 + 1 × 20 = R$ 40. Na data final, A custa R$ 12 e B continua R$ 20: 2 × 12 + 1 × 20 = R$ 44. A cesta ficou R$ 4 mais cara; 4/40 = 0,10, ou 10%. O preço de A subiu 20%, mas não podemos aplicar esses 20% a toda a cesta. Com os antigos R$ 40 já não se compra exatamente esse mesmo conjunto, que agora exige R$ 44. Isso ilustra perda de poder de compra em relação à cesta definida, não uma estatística oficial.",
        "sourceIds": []
      },
      {
        "id": "exemplo-desaceleracao",
        "type": "worked-example",
        "heading": "7. Exemplo resolvido: subir menos não é cair",
        "body": "Índice inteiramente fictício de uma mesma cesta: parte de 100, aumenta 10% no primeiro período e 5% no seguinte. No primeiro, 100 × 1,10 = 110. No segundo, a nova base é 110: 110 × 1,05 = 115,50. A taxa de aumento caiu de 10% para 5%, mas o nível passou de 110 para 115,50: continuou subindo. A queda da taxa é de 5 pontos percentuais, diferença entre duas taxas; não é queda de 5% no nível de preços. Para o nível cair nesse segundo período, a variação teria de ser negativa. Uma taxa menor, ainda positiva, não faz os preços voltarem ao patamar inicial.",
        "sourceIds": []
      },
      {
        "id": "nominal",
        "type": "explanation",
        "heading": "8. Juros e o período a que a taxa se refere",
        "body": "Juros remuneram o uso de recursos ao longo do tempo. Neste contraste com inflação, taxa nominal é a variação do valor monetário antes de ajustar o poder de compra. Não estamos estudando aqui a outra convenção de taxa nominal versus efetiva usada em capitalização. Uma taxa precisa de período: 8% em um ano e 8% em um mês não expressam a mesma duração. Nos exemplos, consideramos um único período, sem novos aportes ou retiradas, custos ou tributos. Essas hipóteses precisam estar declaradas; não descrevem automaticamente um produto real.",
        "sourceIds": [
          "mp.mp03.bcb.juros.2026"
        ]
      },
      {
        "id": "exemplo-nominal",
        "type": "worked-example",
        "heading": "9. Exemplo resolvido: crescimento da quantia",
        "body": "Caso fictício: no período considerado, R$ 100 se transformam em R$ 108, sob as hipóteses anteriores. O acréscimo é R$ 8. Dividindo 8 pelos 100 iniciais, obtemos 8% de crescimento nominal. Ainda falta a mudança dos preços para dizer quanto mudou o poder de compra. Ter mais reais não responde sozinho se conseguimos comprar mais, igual ou menos que antes.",
        "sourceIds": []
      },
      {
        "id": "real",
        "type": "explanation",
        "heading": "10. Taxa real: comparar os dois fatores",
        "body": "Chamaremos de i a taxa nominal do período e de p a inflação de referência do mesmo período, ambas em forma decimal. O dinheiro é multiplicado por (1 + i); o nível de preços, por (1 + p). Para saber a mudança relativa do poder de compra, dividimos o fator do dinheiro pelo fator dos preços. A razão (1 + i)/(1 + p) informa quanto poder de compra final corresponde a uma unidade inicial. Subtraindo 1, obtemos a taxa real r: r = (1 + i)/(1 + p) − 1. Essa é uma derivação algébrica para as hipóteses do modelo, com 1 + p positivo. Subtrair i − p é aproximação; não é igualdade exata em geral. A referência de preços também precisa ser identificada.",
        "sourceIds": []
      },
      {
        "id": "exemplo-real",
        "type": "worked-example",
        "heading": "11. Exemplo resolvido: ganho nominal e ganho real",
        "body": "Caso fictício: no mesmo período, o dinheiro cresce 8% e a cesta de referência encarece 4%, sem custos, tributos ou outras movimentações. Passo 1: escreva as taxas decimais, 0,08 e 0,04. Passo 2: calcule os fatores, 1,08 e 1,04. Passo 3: divida 1,08 por 1,04; o resultado é aproximadamente 1,0384615. Passo 4: subtraia 1 e converta em porcentagem: aproximadamente 3,8462% de ganho real. A quantia cresceu 8%, mas parte desse crescimento compensou preços maiores. A conta 8% − 4% = 4% fornece apenas uma aproximação. Não arredonde os fatores antes de terminar a divisão.",
        "sourceIds": []
      },
      {
        "id": "limites",
        "type": "explanation",
        "heading": "12. Sinal, período e informação suficiente",
        "body": "Nas hipóteses usadas, se o dinheiro e os preços crescerem à mesma taxa no mesmo período, a razão dos fatores será 1 e a taxa real será zero. Se o dinheiro crescer menos que os preços, a taxa real será negativa, mesmo com crescimento nominal positivo. Se crescer mais, será positiva. Não compare diretamente uma taxa mensal com inflação anual: faltaria converter para períodos comparáveis, operação que não foi ensinada nesta unidade. Também não confunda taxa real observada, com inflação já conhecida, e uma expectativa baseada em inflação futura. Os exercícios fornecem os dois dados do período; não fazem previsão.",
        "sourceIds": []
      },
      {
        "id": "glossario",
        "type": "glossary",
        "heading": "13. Consulta de unidades e significados",
        "body": "Porcentagem: proporção por cem. Base: valor usado como referência na comparação. Pontos percentuais: diferença entre taxas expressas em porcentagem. Nível de preços: patamar medido; taxa de variação: mudança relativa entre dois patamares. Cesta: conjunto de itens/quantidades definido para comparação. Poder de compra: o que o dinheiro permite adquirir. Taxa nominal, nesta aula: crescimento monetário antes de ajustar preços. Taxa real: variação relativa do poder de compra diante da referência e período informados.",
        "sourceIds": []
      },
      {
        "id": "resumo",
        "type": "summary",
        "heading": "14. Antes de escolher uma alternativa",
        "body": "Marque a base inicial, a unidade e o período de cada dado. Refaça a cesta antes de usar uma taxa de um item para o total. Separe queda da taxa e queda do nível. Ao comparar juros e preços, escreva os dois fatores e confira os períodos. Depois de um erro, retome o exemplo indicado e explique por que a outra conta responde a pergunta diferente. As questões são prática exposta. Concluir a aula não mede retenção, não amplia A/B e não comprova prontidão para prova.",
        "sourceIds": []
      }
    ],
    "recall": [
      "Explique por que R$ 5 de aumento não significam necessariamente 5%.",
      "Reconstrua a cesta e explique por que a taxa de A não é a taxa do conjunto.",
      "Depois de errar, retome a referência indicada, marque base/período e refaça o raciocínio antes de conferir o comentário."
    ],
    "questions": [
      {
        "id": "q.mp03.q01",
        "topicId": "banking.mp.inflacao",
        "prompt": "Um preço fictício passa de R$ 30 para R$ 36. Qual é a variação percentual em relação ao preço inicial?",
        "options": [
          "6%, porque aumentou R$ 6.",
          "16,67%, usando R$ 36 como base.",
          "20%, porque 6/30 = 0,20.",
          "120%, porque o valor final é 1,20 vez o inicial."
        ],
        "answer": 2,
        "explanation": "O aumento de R$ 6 deve ser dividido pela base R$ 30: 0,20, ou 20%.",
        "optionRationales": [
          "Confunde reais e porcentagem.",
          "Usa a base final, diferente da solicitada.",
          "Calcula a mudança relativa à base inicial.",
          "Confunde proporção final/inicial com aumento, que exige subtrair 1."
        ]
      },
      {
        "id": "q.mp03.q02",
        "topicId": "banking.mp.inflacao",
        "prompt": "Um anúncio informa que um único produto ficou 40% mais caro. O que podemos concluir sobre a inflação de toda a economia apenas com esse dado?",
        "options": [
          "Não basta: faltam informações do conjunto de preços e da medição.",
          "Ela foi exatamente 40%.",
          "Todos os demais produtos também subiram 40%.",
          "Ela foi zero porque somente um preço foi informado."
        ],
        "answer": 0,
        "explanation": "A informação descreve um item. Não permite inferir o comportamento do conjunto nem afirmar ausência de inflação.",
        "optionRationales": [
          "Reconhece o limite da informação.",
          "Transfere a taxa de um item para toda a economia.",
          "Inventa movimentos dos demais preços.",
          "Ausência de dados não prova variação zero."
        ]
      },
      {
        "id": "q.mp03.q03",
        "topicId": "banking.mp.inflacao",
        "prompt": "Cesta fictícia fixa: duas unidades de A e uma de B. A passa de R$ 10 para R$ 12; B permanece R$ 30. Qual a variação do custo total?",
        "options": [
          "20%, copiando a taxa de A.",
          "10%, média simples entre 20% e 0%.",
          "4%, pois o custo aumentou R$ 4.",
          "8%: o total passou de R$ 50 para R$ 54."
        ],
        "answer": 3,
        "explanation": "Inicial: 2 × 10 + 30 = 50. Final: 2 × 12 + 30 = 54. Variação: 4/50 = 0,08, ou 8%.",
        "optionRationales": [
          "Ignora a parcela do gasto com B.",
          "Ignora as participações no gasto inicial.",
          "Confunde valor absoluto com taxa.",
          "Conserva quantidades e usa a base total correta."
        ]
      },
      {
        "id": "q.mp03.q04",
        "topicId": "banking.mp.inflacao",
        "prompt": "Em um índice fictício, a taxa de aumento passa de 8% em um período para 3% no seguinte. Sobre o segundo período, qual leitura é correta?",
        "options": [
          "O nível caiu 5%.",
          "O nível continuou aumentando, à taxa menor de 3%.",
          "O nível voltou automaticamente ao ponto inicial.",
          "A queda foi de 5% no valor de todos os itens."
        ],
        "answer": 1,
        "explanation": "A taxa de 3% continua positiva. A diferença entre 8% e 3% é de 5 pontos percentuais, não uma queda de 5% no nível.",
        "optionRationales": [
          "Confunde diferença entre taxas e variação do nível.",
          "Separa ritmo de aumento e patamar de preços.",
          "Taxa positiva não implica retorno ao nível inicial.",
          "Além de confundir unidades, atribui movimento igual a cada item."
        ]
      },
      {
        "id": "q.mp03.q05",
        "topicId": "banking.mp.inflacao",
        "prompt": "Num período fictício, sem custos ou movimentações adicionais, o dinheiro e a cesta de referência crescem ambos 6%. Qual é a taxa real no modelo ensinado?",
        "options": [
          "12%.",
          "6%.",
          "Zero, pois 1,06/1,06 − 1 = 0.",
          "Negativa, pois qualquer inflação elimina todo ganho nominal."
        ],
        "answer": 2,
        "explanation": "Os dois fatores são iguais, mantendo o poder de compra em relação à cesta definida.",
        "optionRationales": [
          "Soma taxas que devem ser comparadas por fatores.",
          "Ignora a mudança dos preços.",
          "Aplica a relação exata ao mesmo período.",
          "Não considera o crescimento nominal igual ao dos preços."
        ]
      },
      {
        "id": "q.mp03.q06",
        "topicId": "banking.mp.inflacao",
        "prompt": "Nas mesmas hipóteses, o dinheiro cresce 4% e os preços de referência 8% no período. Sem calcular o valor exato, qual o sinal da taxa real?",
        "options": [
          "Negativo: o fator do dinheiro é menor que o fator dos preços.",
          "Positivo, porque há mais unidades monetárias.",
          "Zero, porque as duas taxas são positivas.",
          "Não pode ser analisado mesmo com ambos os dados e período."
        ],
        "answer": 0,
        "explanation": "A razão 1,04/1,08 é menor que 1; depois de subtrair 1, o resultado é negativo.",
        "optionRationales": [
          "Usa o contraste correto dos fatores.",
          "Confunde crescimento da quantia com poder de compra.",
          "Taxas positivas não precisam ser iguais.",
          "Os dados fornecidos permitem identificar o sinal."
        ]
      },
      {
        "id": "q.mp03.q07",
        "topicId": "banking.mp.inflacao",
        "prompt": "Em um exercício fictício com taxa nominal de 12% e inflação de 5% no mesmo período, sem custos, qual expressão calcula a taxa real exata?",
        "options": [
          "12 − 5, sempre exatamente 7%.",
          "(1,05/1,12) − 1.",
          "1,12 + 1,05.",
          "(1,12/1,05) − 1."
        ],
        "answer": 3,
        "explanation": "Divide-se o fator de crescimento do dinheiro pelo fator dos preços e subtrai-se 1. A diferença simples é apenas aproximação.",
        "optionRationales": [
          "Trata aproximação como identidade exata.",
          "Inverte os fatores.",
          "Soma fatores que precisam ser comparados.",
          "Mantém a ordem e a conversão ensinadas."
        ]
      },
      {
        "id": "q.mp03.q08",
        "topicId": "banking.mp.inflacao",
        "prompt": "Um relato traz juros de um mês e inflação de um ano. Podemos aplicar diretamente a fórmula desta aula com esses dois dados?",
        "options": [
          "Sim: basta ambos estarem em porcentagem.",
          "Não: é necessário usar taxas de períodos comparáveis antes da comparação.",
          "Sim: períodos não mudam a interpretação de taxas.",
          "Não: nunca é possível comparar juros e inflação."
        ],
        "answer": 1,
        "explanation": "A unidade temporal integra o significado da taxa. A aula exige o mesmo período e não ensinou a conversão entre mês e ano.",
        "optionRationales": [
          "Ignora o período de referência.",
          "Identifica o requisito que falta.",
          "Desconsidera a duração associada a cada taxa.",
          "Generaliza indevidamente uma restrição aos dados apresentados."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "mp03-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.mp03.q01": [
          {
            "missionId": "banking.mp.inflacao",
            "sectionId": "porcentagem"
          },
          {
            "missionId": "banking.mp.inflacao",
            "sectionId": "exemplo-porcentagem"
          }
        ],
        "q.mp03.q02": [
          {
            "missionId": "banking.mp.inflacao",
            "sectionId": "inflacao"
          },
          {
            "missionId": "banking.mp.inflacao",
            "sectionId": "cesta"
          }
        ],
        "q.mp03.q03": [
          {
            "missionId": "banking.mp.inflacao",
            "sectionId": "cesta"
          },
          {
            "missionId": "banking.mp.inflacao",
            "sectionId": "exemplo-cesta"
          }
        ],
        "q.mp03.q04": [
          {
            "missionId": "banking.mp.inflacao",
            "sectionId": "exemplo-desaceleracao"
          },
          {
            "missionId": "banking.mp.inflacao",
            "sectionId": "glossario"
          }
        ],
        "q.mp03.q05": [
          {
            "missionId": "banking.mp.inflacao",
            "sectionId": "real"
          },
          {
            "missionId": "banking.mp.inflacao",
            "sectionId": "limites"
          }
        ],
        "q.mp03.q06": [
          {
            "missionId": "banking.mp.inflacao",
            "sectionId": "real"
          },
          {
            "missionId": "banking.mp.inflacao",
            "sectionId": "exemplo-real"
          },
          {
            "missionId": "banking.mp.inflacao",
            "sectionId": "limites"
          }
        ],
        "q.mp03.q07": [
          {
            "missionId": "banking.mp.inflacao",
            "sectionId": "porcentagem"
          },
          {
            "missionId": "banking.mp.inflacao",
            "sectionId": "real"
          },
          {
            "missionId": "banking.mp.inflacao",
            "sectionId": "exemplo-real"
          }
        ],
        "q.mp03.q08": [
          {
            "missionId": "banking.mp.inflacao",
            "sectionId": "nominal"
          },
          {
            "missionId": "banking.mp.inflacao",
            "sectionId": "limites"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.mp03",
      "blockId": "banking.markets-policy",
      "prerequisiteId": "banking.mp.moeda",
      "parametersApproved": false
    }
  },
  {
    "id": "banking.mp.politica-monetaria",
    "topicId": "banking.mp.politica-monetaria",
    "contentVersion": 1,
    "order": 13,
    "title": "Objetivos, instrumentos e transmissão monetária",
    "shortTitle": "MP-04",
    "kind": "lesson",
    "objective": "Distinguir o objetivo da política monetária, sua decisão operacional e possíveis efeitos, explicando uma cadeia causal sem transformá-la em certeza.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "markets-policy-intro-r1",
      "releaseSequence": 2,
      "changeImpact": "new"
    },
    "sourceIds": [
      "mp.mp04.br.lc179",
      "mp.mp04.bcb.selic",
      "mp.mp04.bcb.transmissao"
    ],
    "sections": [
      {
        "id": "retomada",
        "type": "explanation",
        "heading": "1. Antes da cadeia: três perguntas diferentes",
        "body": "Retome moeda/liquidez em [MP-02](mp-02-v1.md) e inflação/juros em [MP-03](mp-03-v1.md). Objetivo responde “aonde se quer chegar”; instrumento, “qual variável ou operação se usa”; resultado observado, “o que de fato aconteceu depois”. Querer conter pressões de preços, alterar uma taxa de referência e observar a inflação são três fatos diferentes. Sem essa separação, qualquer movimento de preços acaba sendo atribuído automaticamente à última decisão do banco central.",
        "sourceIds": [],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "Retome moeda/liquidez em "
              },
              {
                "text": "MP-02",
                "missionId": "banking.mp.moeda",
                "sectionId": "retomada",
                "wholeLesson": true
              },
              {
                "text": " e inflação/juros em "
              },
              {
                "text": "MP-03",
                "missionId": "banking.mp.inflacao",
                "sectionId": "retomada",
                "wholeLesson": true
              },
              {
                "text": ". Objetivo responde “aonde se quer chegar”; instrumento, “qual variável ou operação se usa”; resultado observado, “o que de fato aconteceu depois”. Querer conter pressões de preços, alterar uma taxa de referência e observar a inflação são três fatos diferentes. Sem essa separação, qualquer movimento de preços acaba sendo atribuído automaticamente à última decisão do banco central."
              }
            ]
          }
        ]
      },
      {
        "id": "objetivos",
        "type": "explanation",
        "heading": "2. Objetivo legal e escolhas de política",
        "body": "No Brasil, a LC 179/2021 estabelece a estabilidade de preços como objetivo fundamental do BCB. Sem prejudicá-lo, inclui estabilidade e eficiência do sistema financeiro, suavização das flutuações da atividade econômica e fomento do pleno emprego. A mesma lei atribui ao CMN as metas de política monetária e ao BCB a condução necessária para cumpri-las. Objetivo legal não é a previsão de que todos os preços ficarão constantes. Não decoramos nesta unidade um número de meta ou uma taxa atual: isso exigiria identificar norma, vigência e período.",
        "sourceIds": [
          "mp.mp04.br.lc179"
        ]
      },
      {
        "id": "selic",
        "type": "explanation",
        "heading": "3. Meta Selic e Selic efetiva",
        "body": "O Copom, comitê do BCB, define a meta da taxa Selic. A taxa efetiva é uma média observada nas operações compromissadas com títulos públicos federais de um dia útil. O BCB opera para alinhá-la à meta. A meta expressa uma decisão; a efetiva descreve operações realizadas. A Selic influencia as condições financeiras, mas não é a taxa de todos os contratos: prazo, risco, custos e condições contratuais também importam. MP-05 ensinará as duas pontas de uma compromissada antes de cobrar seus fluxos.",
        "sourceIds": [
          "mp.mp04.bcb.selic"
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
          "mp.mp04.bcb.transmissao"
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
          "mp.mp04.bcb.transmissao"
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
          "mp.mp04.bcb.transmissao"
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
    "recall": [
      "Sem consultar, separe objetivo, instrumento e resultado numa notícia fictícia.",
      "Reconstrua dois canais e uma condição que pode mudar seu efeito.",
      "Após errar, retome a seção indicada e substitua a certeza indevida por uma explicação condicionada."
    ],
    "questions": [
      {
        "id": "q.mp04.q01",
        "topicId": "banking.mp.politica-monetaria",
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
        ]
      },
      {
        "id": "q.mp04.q02",
        "topicId": "banking.mp.politica-monetaria",
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
        ]
      },
      {
        "id": "q.mp04.q03",
        "topicId": "banking.mp.politica-monetaria",
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
        ]
      },
      {
        "id": "q.mp04.q04",
        "topicId": "banking.mp.politica-monetaria",
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
        ]
      },
      {
        "id": "q.mp04.q05",
        "topicId": "banking.mp.politica-monetaria",
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
        ]
      },
      {
        "id": "q.mp04.q06",
        "topicId": "banking.mp.politica-monetaria",
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
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "mp04-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.mp04.q01": [
          {
            "missionId": "banking.mp.politica-monetaria",
            "sectionId": "objetivos"
          },
          {
            "missionId": "banking.mp.politica-monetaria",
            "sectionId": "exemplo-rotulos"
          }
        ],
        "q.mp04.q02": [
          {
            "missionId": "banking.mp.politica-monetaria",
            "sectionId": "selic"
          }
        ],
        "q.mp04.q03": [
          {
            "missionId": "banking.mp.politica-monetaria",
            "sectionId": "transmissao"
          },
          {
            "missionId": "banking.mp.politica-monetaria",
            "sectionId": "exemplo-credito"
          }
        ],
        "q.mp04.q04": [
          {
            "missionId": "banking.mp.politica-monetaria",
            "sectionId": "outros-canais"
          },
          {
            "missionId": "banking.mp.politica-monetaria",
            "sectionId": "exemplo-cambio"
          }
        ],
        "q.mp04.q05": [
          {
            "missionId": "banking.mp.politica-monetaria",
            "sectionId": "tempo"
          },
          {
            "missionId": "banking.mp.politica-monetaria",
            "sectionId": "exemplo-choque"
          }
        ],
        "q.mp04.q06": [
          {
            "missionId": "banking.mp.politica-monetaria",
            "sectionId": "transmissao"
          },
          {
            "missionId": "banking.mp.politica-monetaria",
            "sectionId": "tempo"
          },
          {
            "missionId": "banking.mp.politica-monetaria",
            "sectionId": "resumo"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.mp04",
      "blockId": "banking.markets-policy",
      "prerequisiteId": "banking.mp.inflacao",
      "parametersApproved": false
    }
  },
  {
    "id": "banking.mp.instrumentos",
    "topicId": "banking.mp.instrumentos",
    "contentVersion": 1,
    "order": 14,
    "title": "Operações e instrumentos convencionais",
    "shortTitle": "MP-05",
    "kind": "lesson",
    "objective": "Ler participantes, fluxos e prazos de operações monetárias; distinguir compromissadas, compulsórios e redesconto sem confundi-los com crédito ao consumidor.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 25,
    "publication": {
      "status": "draft",
      "releaseId": "markets-policy-intro-r1",
      "releaseSequence": 2,
      "changeImpact": "new"
    },
    "sourceIds": [
      "mp.mp05.bcb.selic",
      "mp.mp05.bcb.compulsorios",
      "mp.mp05.br.l4595"
    ],
    "sections": [
      {
        "id": "retomada",
        "type": "explanation",
        "heading": "1. Da decisão às operações",
        "body": "Em [MP-04](mp-04-v1.md), a meta de juros era a decisão; agora veremos operações que afetam a disponibilidade de recursos das instituições. Retome também liquidez em MP-02. Nesta aula, “liquidez bancária” se refere à capacidade de cumprir pagamentos nas condições e datas necessárias. Não é automaticamente o saldo disponível de um correntista. Pergunte sempre: quem entrega recursos, quem recebe e quando há devolução?",
        "sourceIds": [],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "Em "
              },
              {
                "text": "MP-04",
                "missionId": "banking.mp.politica-monetaria",
                "sectionId": "retomada",
                "wholeLesson": true
              },
              {
                "text": ", a meta de juros era a decisão; agora veremos operações que afetam a disponibilidade de recursos das instituições. Retome também liquidez em MP-02. Nesta aula, “liquidez bancária” se refere à capacidade de cumprir pagamentos nas condições e datas necessárias. Não é automaticamente o saldo disponível de um correntista. Pergunte sempre: quem entrega recursos, quem recebe e quando há devolução?"
              }
            ]
          }
        ]
      },
      {
        "id": "titulos",
        "type": "explanation",
        "heading": "2. O que circula junto com o dinheiro",
        "body": "Título de dívida registra uma obrigação de pagamento do emissor e um direito de seu titular, conforme condições próprias. Negociar o título pode mudar seu titular sem criar uma nova emissão. Preço é o valor pago na negociação; vencimento é a data prevista para cumprimento final da obrigação. Emissor e vendedor podem ser pessoas diferentes. O Tesouro emitir um título e o BCB operar com títulos existentes têm finalidades e fluxos distintos. MP-07 aprofundará dívida pública.",
        "sourceIds": [
          "mp.mp05.br.l4595"
        ]
      },
      {
        "id": "compromissada",
        "type": "explanation",
        "heading": "3. Compromissada: observar as duas pontas",
        "body": "Uma compromissada combina uma compra ou venda de títulos agora com compromisso de operação inversa em data e condições acordadas. Para quem vende com compromisso de recomprar, entra dinheiro inicialmente e há compromisso de pagar na volta. Para quem compra com compromisso de revender, sai dinheiro inicialmente e há compromisso de recebê-lo na volta. Mudar o ponto de vista troca os verbos, mas não muda os participantes ou o sentido do fluxo. Não confunda o prazo da compromissada com o vencimento do título usado nela. As compromissadas federais de um dia útil integram a definição da Selic efetiva ensinada em MP-04.",
        "sourceIds": [
          "mp.mp05.bcb.selic"
        ]
      },
      {
        "id": "exemplo-absorcao",
        "type": "worked-example",
        "heading": "4. Exemplo resolvido: absorção inicial de liquidez",
        "body": "Modelo fictício e simplificado: hoje o BCB vende um título ao banco A por 100 unidades monetárias, comprometendo-se a recomprá-lo amanhã por 101. Hoje: título vai do BCB ao banco; recursos vão do banco ao BCB. Essa ponta retira 100 da disponibilidade usada no modelo pelo banco. Amanhã: o título volta ao BCB e 101 seguem ao banco. Diferença: 101 − 100 = 1. O número é inventado para acompanhar as setas, não é uma taxa brasileira nem reproduz as regras de um leilão.",
        "sourceIds": []
      },
      {
        "id": "exemplo-injecao",
        "type": "worked-example",
        "heading": "5. Exemplo resolvido: inverter o ponto de vista",
        "body": "Segundo caso fictício: hoje o BCB compra do banco B um título por 200, com compromisso de revendê-lo amanhã por 202. Na ida, recursos saem do BCB e entram no banco: há provisão de liquidez inicial. Na volta, o banco entrega 202 e recebe o título. A diferença de 2 decorre exclusivamente dos valores dados. Nos dois exemplos, observar apenas “compra” sem identificar quem compra e em qual data pode inverter a resposta.",
        "sourceIds": []
      },
      {
        "id": "mercado-aberto",
        "type": "explanation",
        "heading": "6. Operar com títulos não é decidir gasto público",
        "body": "A Lei 4.595 atribui ao BCB operações com títulos públicos federais como instrumento monetário, sob regulamentação. Na aula, o efeito inicial das operações é acompanhado pelo fluxo de recursos. Isso não significa que o BCB esteja autorizando uma obra nem que qualquer compra de título seja nova receita de emissão para o Tesouro. Também não basta ver uma operação isolada para deduzir toda a orientação monetária: pode haver outras operações e vencimentos no mesmo dia.",
        "sourceIds": [
          "mp.mp05.br.l4595"
        ]
      },
      {
        "id": "compulsorio",
        "type": "explanation",
        "heading": "7. Compulsório: obrigação de manter recursos no BCB",
        "body": "O recolhimento compulsório exige que instituições mantenham no BCB recursos calculados segundo regras aplicáveis a determinadas captações. Há bases e modalidades diferentes; não se deve memorizar uma alíquota inventada como vigente. O BCB descreve funções monetárias e de estabilidade financeira, inclusive disponibilidade de reservas em situações definidas. Alterar a exigência pode mudar recursos disponíveis, mas não garante aumento proporcional de empréstimos: demanda, risco e outras restrições continuam relevantes.",
        "sourceIds": [
          "mp.mp05.bcb.compulsorios"
        ]
      },
      {
        "id": "exemplo-compulsorio",
        "type": "worked-example",
        "heading": "8. Exemplo resolvido: conta de uma regra hipotética",
        "body": "Regra exclusivamente didática: base de 1.000 e alíquota de 20%, sem deduções. Recolhimento: 1.000 × 0,20 = 200. Se só a alíquota passasse a 15%, seria 1.000 × 0,15 = 150; diferença de 50. Isso mede a alteração da exigência no modelo. Não prova que cada cliente recebeu dinheiro, nem que o crédito cresceu exatamente 50. Bases reais, deduções, períodos e remuneração exigiriam consulta à norma específica. Estes percentuais não são apresentados como atuais.",
        "sourceIds": []
      },
      {
        "id": "redesconto",
        "type": "explanation",
        "heading": "9. Redesconto e assistência de liquidez",
        "body": "A legislação autoriza o BCB a realizar redesconto e empréstimos com instituições financeiras públicas e privadas, sob regras próprias de remuneração, limites, prazos e garantias. No recorte introdutório, são meios de obter recursos do banco central para necessidades de liquidez, com obrigações e condições; não uma doação. Não são empréstimos pessoais do BCB ao correntista. A descrição geral não informa quem é elegível a uma linha específica hoje, sua taxa ou os ativos aceitos.",
        "sourceIds": [
          "mp.mp05.br.l4595"
        ]
      },
      {
        "id": "exemplo-redesconto",
        "type": "worked-example",
        "heading": "10. Exemplo resolvido: de quem é a necessidade?",
        "body": "Um banco fictício tem pagamentos no dia e recursos a receber mais tarde. Admitindo explicitamente que cumpre os requisitos de uma operação de assistência do BCB, obtém recursos agora e assume devolução conforme o contrato. A necessidade analisada é a do banco, não um pedido de financiamento pessoal de seu cliente. A operação pode enfrentar o desencontro temporal; não prova por si que todos os ativos do banco valem mais que suas obrigações. Liquidez e solvência não são sinônimos.",
        "sourceIds": []
      },
      {
        "id": "comparacao",
        "type": "explanation",
        "heading": "11. Comparar pela obrigação e pelo fluxo",
        "body": "Nas compromissadas dos exemplos, siga título e dinheiro nas duas datas. No compulsório, identifique obrigação, base e recolhimento. No redesconto/assistência, identifique instituição tomadora e condições de devolução. Uma medida sobre exigência de reservas e uma concessão de recursos têm mecanismos diferentes, ainda que ambas possam afetar liquidez. Não classifique tudo como “imprimir cédulas”: fluxos financeiros também ocorrem por registros.",
        "sourceIds": []
      },
      {
        "id": "glossario",
        "type": "glossary",
        "heading": "12. Vocabulário de operações",
        "body": "Contraparte: o outro participante da operação. Compromisso de recompra/revenda: obrigação de uma operação inversa futura. Absorção/provisão: redução/aumento inicial de disponibilidade no lado observado. Base de cálculo: montante ao qual se aplica uma regra. Alíquota: percentual usado nessa regra. Solvência: capacidade patrimonial de honrar obrigações; difere de disponibilidade no momento. Garantia: proteção prevista para cumprimento da obrigação, sem substituir a análise de regras.",
        "sourceIds": []
      },
      {
        "id": "resumo",
        "type": "summary",
        "heading": "13. Um método para não inverter as setas",
        "body": "Escreva duas linhas, “hoje” e “retorno”. Em cada uma, identifique origem e destino do dinheiro e do título. Depois nomeie o mecanismo; não comece decorando “compra aumenta” sem sujeito. Em problemas de compulsório, marque base/percentual e limite da inferência. Ao errar, refaça o mesmo fluxo pela perspectiva da contraparte e confira se as duas descrições concordam.",
        "sourceIds": []
      }
    ],
    "recall": [
      "Desenhe as duas pontas de uma venda com recompra, nomeando participantes.",
      "Explique por que menor compulsório não determina sozinho o novo crédito.",
      "Recupere um erro invertendo a perspectiva e conferindo as mesmas setas."
    ],
    "questions": [
      {
        "id": "q.mp05.q01",
        "topicId": "banking.mp.instrumentos",
        "prompt": "Hoje o BCB vende um título a um banco com compromisso de recompra. Na ponta inicial descrita, os recursos seguem em qual direção?",
        "options": [
          "Do BCB ao banco, pois toda venda cria liquidez para o banco.",
          "Do banco ao BCB, reduzindo inicialmente sua disponibilidade no modelo.",
          "Do Tesouro ao correntista, necessariamente.",
          "Não há dinheiro em uma compromissada."
        ],
        "answer": 1,
        "explanation": "O comprador banco entrega recursos ao vendedor BCB nesta ponta.",
        "optionRationales": [
          "Inverte os participantes.",
          "Acompanha a contraprestação da compra.",
          "Introduz participantes ausentes.",
          "Ignora o pagamento pela compra."
        ]
      },
      {
        "id": "q.mp05.q02",
        "topicId": "banking.mp.instrumentos",
        "prompt": "No caso em que o BCB compra hoje e se compromete a revender amanhã, qual é a ponta de retorno no modelo?",
        "options": [
          "O banco recebe mais recursos e não devolve nada.",
          "O título é extinto automaticamente.",
          "O banco paga o valor combinado e recebe de volta o título.",
          "O correntista decide a meta Selic."
        ],
        "answer": 2,
        "explanation": "A operação inversa devolve o título ao banco contra recursos para o BCB.",
        "optionRationales": [
          "Suprime a obrigação de retorno.",
          "Confunde revenda com extinção.",
          "Inverte corretamente os fluxos da ida.",
          "Não tem relação com o contrato."
        ]
      },
      {
        "id": "q.mp05.q03",
        "topicId": "banking.mp.instrumentos",
        "prompt": "Uma compromissada dura um dia e usa título que vence em dois anos. Isso permite concluir que o título vence amanhã?",
        "options": [
          "Não: prazo da operação e vencimento do título são diferentes.",
          "Sim: a revenda altera obrigatoriamente o vencimento.",
          "Sim: qualquer título usado em compromissada dura um dia.",
          "Não: títulos nunca vencem."
        ],
        "answer": 0,
        "explanation": "A obrigação de operação inversa não é o vencimento original do título.",
        "optionRationales": [
          "Distingue os dois prazos.",
          "Não há essa alteração no enunciado.",
          "Generaliza indevidamente o prazo.",
          "Nega a obrigação final dos títulos."
        ]
      },
      {
        "id": "q.mp05.q04",
        "topicId": "banking.mp.instrumentos",
        "prompt": "Regra fictícia sem deduções: base 800, alíquota 10%. Qual recolhimento ela determina?",
        "options": [
          "10, porque a alíquota é dez.",
          "800, independentemente da alíquota.",
          "8, dividindo a base por cem sem multiplicar por dez.",
          "80, calculando 800 × 0,10."
        ],
        "answer": 3,
        "explanation": "A porcentagem é aplicada à base definida.",
        "optionRationales": [
          "Confunde taxa e montante.",
          "Ignora a proporção.",
          "Calcula apenas 1% da base.",
          "Aplica a regra dada."
        ]
      },
      {
        "id": "q.mp05.q05",
        "topicId": "banking.mp.instrumentos",
        "prompt": "A redução hipotética de compulsório libera 50 de exigência. O que pode ser afirmado apenas com isso?",
        "options": [
          "Todo correntista recebeu 50.",
          "A exigência caiu 50 no modelo; o novo crédito depende de outros fatores.",
          "Os empréstimos cresceram necessariamente 500.",
          "O BCB doou permanentemente 50 a cada banco."
        ],
        "answer": 1,
        "explanation": "A conta mede exigência, não decisões de crédito nem transferências a clientes.",
        "optionRationales": [
          "Cria um repasse inexistente.",
          "Respeita o limite da conta.",
          "Inventa multiplicador e resultado.",
          "Confunde alteração de obrigação com doação."
        ]
      },
      {
        "id": "q.mp05.q06",
        "topicId": "banking.mp.instrumentos",
        "prompt": "Na assistência de liquidez apresentada, quem obtém recursos do BCB sob condições?",
        "options": [
          "Todo consumidor, sem intermediário.",
          "A instituição financeira elegível, assumindo as obrigações aplicáveis.",
          "A empresa varejista, dispensada de pagar.",
          "Qualquer pessoa, sem análise de regras."
        ],
        "answer": 1,
        "explanation": "A relação descrita é BCB–instituição financeira e depende de regulamentação.",
        "optionRationales": [
          "Troca instituição tomadora por correntista.",
          "Preserva participantes e condições.",
          "Transforma operação em doação direta.",
          "Elimina os requisitos."
        ]
      },
      {
        "id": "q.mp05.q07",
        "topicId": "banking.mp.instrumentos",
        "prompt": "Um banco supera falta de recursos hoje com operação permitida. Isso prova sua solvência?",
        "options": [
          "Sim, liquidez de hoje e solvência são a mesma medida.",
          "Sim, toda dívida futura desaparece.",
          "Não: resolver um fluxo de hoje não basta para avaliar ativos e obrigações.",
          "Não: obter liquidez prova insolvência."
        ],
        "answer": 2,
        "explanation": "O dado é temporal; a avaliação patrimonial exige outras informações.",
        "optionRationales": [
          "Confunde conceitos distintos.",
          "A operação preserva obrigações.",
          "Identifica a informação que falta.",
          "Conclui o oposto sem evidência."
        ]
      },
      {
        "id": "q.mp05.q08",
        "topicId": "banking.mp.instrumentos",
        "prompt": "Uma compra de título existente pelo BCB basta para afirmar que o Tesouro acabou de captar recursos por nova emissão?",
        "options": [
          "Sim, todo vendedor de título público é o Tesouro.",
          "Não: é preciso identificar vendedor e natureza da operação.",
          "Sim, o título sempre nasce novamente ao ser negociado.",
          "Não: o Tesouro nunca emite títulos."
        ],
        "answer": 1,
        "explanation": "Emissor e vendedor podem ser diferentes; emissão e negociação precisam ser separadas.",
        "optionRationales": [
          "Confunde emissor e detentor.",
          "Usa a identificação correta do fluxo.",
          "Confunde troca de titular com nova emissão.",
          "Nega a emissão sem fundamento."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "mp05-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.mp05.q01": [
          {
            "missionId": "banking.mp.instrumentos",
            "sectionId": "compromissada"
          },
          {
            "missionId": "banking.mp.instrumentos",
            "sectionId": "exemplo-absorcao"
          }
        ],
        "q.mp05.q02": [
          {
            "missionId": "banking.mp.instrumentos",
            "sectionId": "exemplo-injecao"
          }
        ],
        "q.mp05.q03": [
          {
            "missionId": "banking.mp.instrumentos",
            "sectionId": "titulos"
          },
          {
            "missionId": "banking.mp.instrumentos",
            "sectionId": "compromissada"
          }
        ],
        "q.mp05.q04": [
          {
            "missionId": "banking.mp.instrumentos",
            "sectionId": "compulsorio"
          },
          {
            "missionId": "banking.mp.instrumentos",
            "sectionId": "exemplo-compulsorio"
          }
        ],
        "q.mp05.q05": [
          {
            "missionId": "banking.mp.instrumentos",
            "sectionId": "compulsorio"
          },
          {
            "missionId": "banking.mp.instrumentos",
            "sectionId": "exemplo-compulsorio"
          }
        ],
        "q.mp05.q06": [
          {
            "missionId": "banking.mp.instrumentos",
            "sectionId": "redesconto"
          },
          {
            "missionId": "banking.mp.instrumentos",
            "sectionId": "exemplo-redesconto"
          }
        ],
        "q.mp05.q07": [
          {
            "missionId": "banking.mp.instrumentos",
            "sectionId": "exemplo-redesconto"
          },
          {
            "missionId": "banking.mp.instrumentos",
            "sectionId": "glossario"
          }
        ],
        "q.mp05.q08": [
          {
            "missionId": "banking.mp.instrumentos",
            "sectionId": "titulos"
          },
          {
            "missionId": "banking.mp.instrumentos",
            "sectionId": "mercado-aberto"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.mp05",
      "blockId": "banking.markets-policy",
      "prerequisiteId": "banking.mp.politica-monetaria",
      "parametersApproved": false
    }
  },
  {
    "id": "banking.mp.qe-depositos",
    "topicId": "banking.mp.qe-depositos",
    "contentVersion": 1,
    "order": 15,
    "title": "Instrumentos não convencionais e temas datados",
    "shortTitle": "MP-06",
    "kind": "lesson",
    "objective": "Explicar a ideia de QE e distinguir compra de ativos, operação temporária e depósito voluntário remunerado, identificando país, data e limites de cada referência.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "markets-policy-intro-r1",
      "releaseSequence": 2,
      "changeImpact": "new"
    },
    "sourceIds": [
      "mp.mp06.boe.qe",
      "mp.mp06.br.l14185",
      "mp.mp06.bcb.selic",
      "mp.mp06.bcb.compulsorios"
    ],
    "sections": [
      {
        "id": "retomada",
        "type": "explanation",
        "heading": "1. Comparar instrumentos exige contexto",
        "body": "Leia [MP-04](mp-04-v1.md) e [MP-05](mp-05-v1.md) antes desta unidade. Política monetária não se resume a uma única ferramenta. “Não convencional” costuma identificar instrumentos usados em contextos em que a atuação usual sobre juros de curto prazo encontra limites. O nome não torna duas medidas equivalentes. Vamos estudar um exemplo estrangeiro de compra de ativos e uma autorização brasileira de depósitos: fatos distintos, sem afirmar que o Brasil adotou o programa estrangeiro.",
        "sourceIds": [],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "Leia "
              },
              {
                "text": "MP-04",
                "missionId": "banking.mp.politica-monetaria",
                "sectionId": "retomada",
                "wholeLesson": true
              },
              {
                "text": " e "
              },
              {
                "text": "MP-05",
                "missionId": "banking.mp.instrumentos",
                "sectionId": "retomada",
                "wholeLesson": true
              },
              {
                "text": " antes desta unidade. Política monetária não se resume a uma única ferramenta. “Não convencional” costuma identificar instrumentos usados em contextos em que a atuação usual sobre juros de curto prazo encontra limites. O nome não torna duas medidas equivalentes. Vamos estudar um exemplo estrangeiro de compra de ativos e uma autorização brasileira de depósitos: fatos distintos, sem afirmar que o Brasil adotou o programa estrangeiro."
              }
            ]
          }
        ]
      },
      {
        "id": "qe",
        "type": "explanation",
        "heading": "2. QE: a ideia e o caso britânico delimitado",
        "body": "Quantitative easing, ou QE, envolve compras de ativos pelo banco central, em programas voltados a influenciar condições financeiras além da taxa curta. No exemplo do Bank of England, compras de títulos pagas com reservas do banco central buscaram reduzir juros mais longos e apoiar gasto, especialmente com pouco espaço para reduzir a taxa curta. Reservas aqui são registros de recursos no banco central, não cédulas entregues diretamente a cada família. O BoE iniciou QE em março de 2009. A data identifica um caso histórico; não descreve a política brasileira atual.",
        "sourceIds": [
          "mp.mp06.boe.qe"
        ]
      },
      {
        "id": "preco-rendimento",
        "type": "explanation",
        "heading": "3. Apoio de matemática: preço e retorno de um pagamento fixo",
        "body": "Considere apenas um título fictício que promete pagar 110 em uma data futura, sem pagamentos intermediários. Se comprado por 100 e pago integralmente no prazo, o retorno bruto do período é (110 − 100)/100 = 10%. Se o mesmo pagamento de 110 for comprado por 105, o retorno bruto será (110 − 105)/105, aproximadamente 4,7619%. Pagamento e data iguais, preço maior e retorno menor. Isso é uma derivação do modelo, não uma fórmula completa de precificação de títulos com cupons nem uma taxa anualizada.",
        "sourceIds": []
      },
      {
        "id": "exemplo-qe",
        "type": "worked-example",
        "heading": "4. Exemplo resolvido: seguir uma compra de ativos",
        "body": "Em um país fictício, o banco central compra um título já existente de um investidor; a liquidação passa pelo banco desse investidor. O investidor troca o título por recursos e o sistema bancário recebe reservas na liquidação. A compra pode pressionar o preço do título para cima; no modelo de pagamento fixo, um preço maior corresponde a retorno menor. Isso ajuda a compreender o canal de juros, mas não prova que todo vendedor gastará, que todo banco emprestará ou que cada preço subirá em proporção fixa.",
        "sourceIds": [
          "mp.mp06.boe.qe"
        ]
      },
      {
        "id": "comparar",
        "type": "explanation",
        "heading": "5. QE e compromissada não são sinônimos",
        "body": "Nos exemplos de MP-05, a operação tinha retorno combinado: compra/venda agora e operação inversa depois. No programa de QE aqui estudado, a explicação é a compra de ativos e manutenção de uma carteira como instrumento. Título, prazo, escala, finalidade e condições precisam ser conhecidos; não basta o banco central aparecer comprando algo para chamar a operação de QE. Uma negociação de curto prazo para alinhar a taxa efetiva à meta também não prova, por si, a existência de um programa de compras de longo alcance.",
        "sourceIds": [
          "mp.mp06.boe.qe",
          "mp.mp06.bcb.selic"
        ]
      },
      {
        "id": "depositos",
        "type": "explanation",
        "heading": "6. Depósitos voluntários remunerados no Brasil",
        "body": "A Lei 14.185, de 14 de julho de 2021, autorizou o BCB a acolher depósitos voluntários à vista ou a prazo de instituições financeiras, com remuneração por ele estabelecida. As condições dos depósitos a prazo, como limites, prazos e negociação, dependem de regulamentação do BCB. Voluntário distingue a escolha de contratar da exigência de compulsório. Remunerado indica pagamento segundo condições; não significa conta varejista aberta a qualquer pessoa. A lei não fornece uma taxa universal para usar hoje.",
        "sourceIds": [
          "mp.mp06.br.l14185"
        ]
      },
      {
        "id": "exemplo-deposito",
        "type": "worked-example",
        "heading": "7. Exemplo resolvido: depósito não é compra de título",
        "body": "Caso fictício: um banco decide colocar 80 unidades em um depósito a prazo no banco central, conforme condições dadas. Durante o prazo estipulado, esses recursos deixam de estar livres para outros pagamentos do banco; ele tem o direito definido pelo depósito. Não houve, no enunciado, compra de título de um investidor nem obrigação de recolhimento calculada sobre captação. Para descrever remuneração e retirada, precisaríamos das condições contratadas. Não se deve preencher essa falta de dados com a taxa de outro instrumento.",
        "sourceIds": []
      },
      {
        "id": "exemplo-classificacao",
        "type": "worked-example",
        "heading": "8. Exemplo resolvido: três fatos, três justificativas",
        "body": "Situação A: banco cumpre recolhimento exigido por uma regra sobre sua captação — compulsório. B: banco escolhe depósito a prazo remunerado no banco central — depósito voluntário nas condições aplicáveis. C: banco central anuncia programa de compras de ativos com objetivo de influenciar condições mais longas — caso compatível com o conceito de QE ensinado. Ter banco central e recursos financeiros nos três relatos não apaga a diferença entre obrigação, contrato de depósito e compra de ativos.",
        "sourceIds": []
      },
      {
        "id": "datas",
        "type": "explanation",
        "heading": "9. Não usar o tempo presente de uma página antiga",
        "body": "Fonte e data fazem parte do conteúdo. A lei brasileira é de 2021; a página explicativa britânica consultada foi atualizada em 2025 e descreve iniciativas históricas. Referências BB 2022/001 e CAIXA 2024/NM também são históricas. Uma questão conceitual pode usar esses fatos delimitados; uma questão sobre a política “atual” exigiria checagem específica do país e do período. Não estamos dizendo que um anúncio britânico vale como norma brasileira ou que todo instrumento novo é QE.",
        "sourceIds": []
      },
      {
        "id": "glossario",
        "type": "glossary",
        "heading": "10. Termos com limites explícitos",
        "body": "QE: programa de compras de ativos com finalidade monetária, no recorte ensinado. Reservas do banco central: recursos registrados para a liquidação bancária, distintos do papel-moeda nas mãos do público. Carteira: conjunto de ativos mantidos. Depósito voluntário: recursos colocados por escolha contratual. Remuneração: pagamento estabelecido nas condições da operação. Retorno bruto do modelo: diferença recebimento/preço em relação ao preço, sem custos, tributos ou inadimplência.",
        "sourceIds": []
      },
      {
        "id": "resumo",
        "type": "summary",
        "heading": "11. Quatro perguntas para classificar",
        "body": "Identifique país e período; depois quem entrega os recursos e que direito recebe; verifique se há imposição de uma regra ou escolha contratual; por fim veja se existe reversão previamente combinada. Não conclua pela palavra “liquidez” isolada. Depois de errar, mude apenas uma característica do caso e explique por que a classificação muda ou permanece.",
        "sourceIds": []
      }
    ],
    "recall": [
      "Explique a diferença entre comprar um ativo e acolher um depósito.",
      "Refaça o retorno do pagamento fixo com os dois preços, mantendo o período.",
      "Ao recuperar um erro, marque país/data e a característica que decide a classificação."
    ],
    "questions": [
      {
        "id": "q.mp06.q01",
        "topicId": "banking.mp.qe-depositos",
        "prompt": "No exemplo britânico apresentado, qual descrição corresponde ao QE?",
        "options": [
          "Empréstimo pessoal automático para toda família.",
          "Recolhimento compulsório calculado sobre depósitos.",
          "Compras de títulos com reservas buscando influenciar condições financeiras mais longas.",
          "Decisão que proíbe qualquer variação de preços."
        ],
        "answer": 2,
        "explanation": "A operação ensinada compra ativos e procura influenciar condições financeiras; não concede crédito pessoal direto.",
        "optionRationales": [
          "Confunde canal de transmissão e contrato de varejo.",
          "Troca aquisição de ativos por obrigação de recolhimento.",
          "Mantém instrumento e objetivo do exemplo.",
          "Cria garantia inexistente."
        ]
      },
      {
        "id": "q.mp06.q02",
        "topicId": "banking.mp.qe-depositos",
        "prompt": "No modelo de pagamento único de 110, elevar o preço de compra de 100 para 105, mantendo data e pagamento, faz o retorno bruto do período:",
        "options": [
          "Cair, de 10% para aproximadamente 4,7619%.",
          "Subir para 15%.",
          "Ficar necessariamente em 10%.",
          "Virar automaticamente a taxa anual atual do Brasil."
        ],
        "answer": 0,
        "explanation": "O ganho cai de 10 sobre 100 para 5 sobre 105. Trata-se do mesmo período fictício.",
        "optionRationales": [
          "Compara corretamente ganho e base.",
          "Soma valores sem aplicar a relação.",
          "Ignora a mudança do preço pago.",
          "Transpõe período fictício e contexto."
        ]
      },
      {
        "id": "q.mp06.q03",
        "topicId": "banking.mp.qe-depositos",
        "prompt": "Qual diferença separa a compromissada de MP-05 do exemplo de QE?",
        "options": [
          "Qualquer compra pelo BCB é QE.",
          "QE significa recolhimento compulsório.",
          "Toda compromissada elimina o título.",
          "A compromissada tem operação inversa combinada; o exemplo de QE trata de programa de compras de ativos."
        ],
        "answer": 3,
        "explanation": "É necessário examinar condições e finalidade, não apenas o verbo comprar.",
        "optionRationales": [
          "Apaga condições e objetivo.",
          "Confunde mecanismos.",
          "Revenda não extingue automaticamente o título.",
          "Reconhece a distinção ensinada."
        ]
      },
      {
        "id": "q.mp06.q04",
        "topicId": "banking.mp.qe-depositos",
        "prompt": "A Lei 14.185/2021 autoriza qual relação no recorte estudado?",
        "options": [
          "Qualquer família abrir depósito varejista diretamente no BCB.",
          "Depósitos voluntários de instituições financeiras no BCB, sob condições aplicáveis.",
          "Compulsório obrigatório de todo salário recebido.",
          "Adoção automática do programa britânico de QE."
        ],
        "answer": 1,
        "explanation": "A lei se refere às instituições financeiras e atribui condições ao BCB.",
        "optionRationales": [
          "Amplia o público sem base.",
          "Preserva sujeito e caráter da operação.",
          "Transforma voluntariedade em imposição ao trabalhador.",
          "Mistura países e instrumentos."
        ]
      },
      {
        "id": "q.mp06.q05",
        "topicId": "banking.mp.qe-depositos",
        "prompt": "Um banco escolhe um depósito a prazo remunerado no BCB. Podemos chamá-lo de compulsório só porque os recursos ficam no BCB?",
        "options": [
          "Sim: localização determina obrigatoriedade.",
          "Sim: toda remuneração cria uma imposição.",
          "Não: é preciso distinguir escolha contratual e recolhimento exigido.",
          "Não: compulsórios não envolvem recursos no BCB."
        ],
        "answer": 2,
        "explanation": "Localização dos recursos não substitui a análise da obrigação.",
        "optionRationales": [
          "Confunde local e natureza.",
          "Remuneração não determina compulsoriedade.",
          "Usa o critério correto.",
          "Nega a característica do compulsório."
        ]
      },
      {
        "id": "q.mp06.q06",
        "topicId": "banking.mp.qe-depositos",
        "prompt": "Uma página britânica descreve QE iniciado em 2009. Qual uso é apropriado?",
        "options": [
          "Ensinar o caso com país/data, sem afirmar que descreve a política brasileira atual.",
          "Tratar toda frase no presente como dado brasileiro de hoje.",
          "Concluir que Brasil e Reino Unido têm a mesma meta e regras.",
          "Ignorar a data porque conceitos e decisões nunca mudam."
        ],
        "answer": 0,
        "explanation": "Contexto histórico e jurisdição precisam permanecer explícitos.",
        "optionRationales": [
          "Delimita corretamente a evidência.",
          "Transpõe tempo e país.",
          "Importa normas estrangeiras.",
          "Elimina controle de atualidade."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "mp06-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.mp06.q01": [
          {
            "missionId": "banking.mp.qe-depositos",
            "sectionId": "qe"
          },
          {
            "missionId": "banking.mp.qe-depositos",
            "sectionId": "exemplo-qe"
          }
        ],
        "q.mp06.q02": [
          {
            "missionId": "banking.mp.qe-depositos",
            "sectionId": "preco-rendimento"
          }
        ],
        "q.mp06.q03": [
          {
            "missionId": "banking.mp.qe-depositos",
            "sectionId": "comparar"
          }
        ],
        "q.mp06.q04": [
          {
            "missionId": "banking.mp.qe-depositos",
            "sectionId": "depositos"
          },
          {
            "missionId": "banking.mp.qe-depositos",
            "sectionId": "exemplo-deposito"
          }
        ],
        "q.mp06.q05": [
          {
            "missionId": "banking.mp.qe-depositos",
            "sectionId": "depositos"
          },
          {
            "missionId": "banking.mp.qe-depositos",
            "sectionId": "exemplo-classificacao"
          }
        ],
        "q.mp06.q06": [
          {
            "missionId": "banking.mp.qe-depositos",
            "sectionId": "datas"
          },
          {
            "missionId": "banking.mp.qe-depositos",
            "sectionId": "resumo"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.mp06",
      "blockId": "banking.markets-policy",
      "prerequisiteId": "banking.mp.instrumentos",
      "parametersApproved": false
    }
  },
  {
    "id": "banking.mp.divida-publica",
    "topicId": "banking.mp.divida-publica",
    "contentVersion": 1,
    "order": 16,
    "title": "Orçamento, dívida pública e títulos",
    "shortTitle": "MP-07",
    "kind": "lesson",
    "objective": "Separar planejamento orçamentário, fluxos de financiamento e estoque de dívida; distinguir emissão, negociação posterior e formas básicas de remuneração de títulos.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 25,
    "publication": {
      "status": "draft",
      "releaseId": "markets-policy-intro-r1",
      "releaseSequence": 2,
      "changeImpact": "new"
    },
    "sourceIds": [
      "mp.mp07.stn.fiscal",
      "mp.mp07.br.l4320",
      "mp.mp07.br.d12814",
      "mp.mp07.cvm.primario",
      "mp.mp07.br.l4595"
    ],
    "sections": [
      {
        "id": "retomada",
        "type": "explanation",
        "heading": "1. Dívida não é uma palavra para qualquer gasto",
        "body": "Pré-requisitos: mercados em [MP-01](mp-01-v1.md), porcentagens/juros em [MP-03](mp-03-v1.md) e título/participantes em [MP-05](mp-05-v1.md). Comprar um bem, planejar uma despesa, arrecadar receita e emitir dívida são fatos diferentes. Nesta aula, acompanharemos quem entrega recursos e qual obrigação nasce ou permanece. Os exemplos são modelos fictícios, sem reproduzir o orçamento federal ou avaliar a situação fiscal atual.",
        "sourceIds": [],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "Pré-requisitos: mercados em "
              },
              {
                "text": "MP-01",
                "missionId": "banking.mp.mercados",
                "sectionId": "perguntas",
                "wholeLesson": true
              },
              {
                "text": ", porcentagens/juros em "
              },
              {
                "text": "MP-03",
                "missionId": "banking.mp.inflacao",
                "sectionId": "retomada",
                "wholeLesson": true
              },
              {
                "text": " e título/participantes em "
              },
              {
                "text": "MP-05",
                "missionId": "banking.mp.instrumentos",
                "sectionId": "retomada",
                "wholeLesson": true
              },
              {
                "text": ". Comprar um bem, planejar uma despesa, arrecadar receita e emitir dívida são fatos diferentes. Nesta aula, acompanharemos quem entrega recursos e qual obrigação nasce ou permanece. Os exemplos são modelos fictícios, sem reproduzir o orçamento federal ou avaliar a situação fiscal atual."
              }
            ]
          }
        ]
      },
      {
        "id": "orcamento",
        "type": "explanation",
        "heading": "2. Orçamento e política fiscal",
        "body": "Orçamento público organiza a previsão de receitas e a autorização de despesas de um período. Prever arrecadação não significa que o dinheiro já entrou; autorizar despesa não significa que todo valor já foi pago. Política fiscal envolve escolhas de receitas e despesas, com efeitos econômicos e distributivos. Para entender uma notícia, separe plano, execução e financiamento. Uma autorização de gasto, por si só, não demonstra que houve emissão de título nem que o BCB mudou a taxa de juros.",
        "sourceIds": [
          "mp.mp07.stn.fiscal",
          "mp.mp07.br.l4320"
        ]
      },
      {
        "id": "fluxo-estoque",
        "type": "explanation",
        "heading": "3. Fluxo ao longo do período, estoque em uma data",
        "body": "Fluxo mede o que ocorreu entre datas; estoque mede uma posição em determinada data. Arrecadar 100 durante o ano é fluxo. Dever 500 no encerramento é estoque. Déficit e dívida não são o mesmo número. A evolução da dívida depende de emissões, resgates e outros ajustes; um resultado fiscal do período não deve ser somado mecanicamente a qualquer medida de dívida sem conhecer a definição. Aqui usaremos um modelo declarado sem juros nem ajustes, só para aprender o raciocínio.",
        "sourceIds": [
          "mp.mp07.stn.fiscal"
        ]
      },
      {
        "id": "exemplo-fluxo",
        "type": "worked-example",
        "heading": "4. Exemplo resolvido: necessidade e forma de financiamento",
        "body": "Modelo fictício: entradas de recursos de 100, pagamentos de 120 no período, sem caixa inicial e sem outros fluxos. A diferença é 120 − 100 = 20. Para que todos os pagamentos do modelo ocorram, faltam 20. Se o governo emitir um título por 20 e um investidor o comprar, entram os recursos e nasce a obrigação nas condições do título. O gasto não se tornou gratuito. A necessidade de 20 não prova que a dívida total é 20: pode existir estoque anterior. O caso não descreve regras legais de autorização de endividamento.",
        "sourceIds": []
      },
      {
        "id": "resultado",
        "type": "explanation",
        "heading": "5. Resultado primário e juros: cuidado com o recorte",
        "body": "O resultado primário compara receitas e despesas classificadas como primárias no período; não incorpora os juros da dívida nesse recorte. Superávit primário indica receitas primárias maiores que despesas primárias; déficit, o inverso. O resultado nominal incorpora também os juros líquidos, observadas a metodologia e a convenção de sinais da fonte. Um superávit primário não implica automaticamente ausência de dívida nem dispensa de refinanciar vencimentos. Para cálculos oficiais, são necessárias as classificações e a metodologia, que não serão presumidas.",
        "sourceIds": [
          "mp.mp07.stn.fiscal"
        ]
      },
      {
        "id": "exemplo-estoque",
        "type": "worked-example",
        "heading": "6. Exemplo resolvido: refinanciar não é zerar a dívida",
        "body": "Modelo sem juros, indexação ou outros ajustes: estoque inicial 500. Durante o período, vencem e são pagos 100; uma nova emissão de 100 fornece os recursos para esse pagamento. Estoque final: 500 − 100 + 100 = 500. Houve emissão e resgate, embora o estoque final não tenha aumentado. Se a emissão fosse de 120 com o mesmo resgate de 100, o estoque seria 520 no modelo. Refinanciar é obter novo financiamento para cumprir obrigações; não significa que o credor perdoou a dívida.",
        "sourceIds": []
      },
      {
        "id": "emissao-negociacao",
        "type": "explanation",
        "heading": "7. Mercado primário e negociação posterior",
        "body": "Na emissão do nosso exemplo, o investidor entrega recursos ao emissor e recebe o título. Se depois vende esse título existente a outro investidor, o pagamento da negociação vai ao vendedor. Isso não é automaticamente nova captação do emissor. O título continua representando a obrigação definida; muda quem detém o direito. O preço de revenda pode ser diferente do preço pago antes. No caso de títulos federais, identifique se a operação é emissão do Tesouro ou atuação do BCB com finalidade monetária: os papéis não se confundem.",
        "sourceIds": [
          "mp.mp07.cvm.primario",
          "mp.mp07.br.l4595"
        ]
      },
      {
        "id": "exemplo-secundario",
        "type": "worked-example",
        "heading": "8. Exemplo resolvido: seguir o pagamento até o destinatário",
        "body": "Caso fictício: na emissão, Ana paga 90 ao emissor por um título. Depois Bruno compra esse mesmo título de Ana por 92. Na segunda operação, os 92 vão a Ana; Bruno passa a deter o título. O emissor não recebeu mais 92 só por causa dessa troca. A diferença de 2 entre os preços é um ganho bruto de negociação para Ana no modelo, sem custos ou outros pagamentos. Não é a remuneração garantida a Bruno nem uma nova dívida de Ana com ele.",
        "sourceIds": []
      },
      {
        "id": "remuneracao",
        "type": "explanation",
        "heading": "9. Três leituras básicas da remuneração",
        "body": "Prefixado: a condição de remuneração nominal é definida na contratação; isso não fixa o preço de uma revenda futura. Pós-fixado: a remuneração depende da evolução de um referencial especificado. Vinculado à inflação: usa índice de preços, podendo combinar atualização do principal com uma parcela de juros definida. É necessário ler prazo e fluxo de pagamentos. Cupom é um pagamento periódico de juros; não é sinônimo do valor total recebido nem está presente em todo título. “Valor nominal do título” é uma referência contratual, distinta do contraste entre taxa nominal e real em MP-03.",
        "sourceIds": []
      },
      {
        "id": "titulos-2026",
        "type": "explanation",
        "heading": "10. Exemplos federais com data normativa explícita",
        "body": "Recorte do Decreto 12.814/2026: LTN tem rendimento definido pelo deságio sobre o valor nominal e resgate desse valor no vencimento; LFT tem rendimento associado à taxa Selic indicada na norma; NTN-B atualiza o valor nominal pelo IPCA e prevê juros semestrais; NTN-F prevê juros semestrais e resgate do valor nominal. Deságio é preço inferior à referência nominal. Essas siglas não esgotam os títulos/séries existentes. O decreto entrou em vigor em sua publicação, em 12/01/2026, revogando o Decreto 11.301/2022. Não se deve usar a norma antiga, ainda ligada em página de 2023, como prova da regra atual. Tampouco transpor a norma de 2026 para uma prova histórica sem declarar a data de corte.",
        "sourceIds": [
          "mp.mp07.br.d12814"
        ]
      },
      {
        "id": "exemplo-preco",
        "type": "worked-example",
        "heading": "11. Exemplo resolvido: valor prometido e preço de venda",
        "body": "Título inteiramente fictício de pagamento único de 100 no fim do período. Carla compra por 95; se houver pagamento integral no vencimento, a diferença bruta será 5. Antes disso, uma proposta de compra de 93 significaria receber 2 menos que os 95 pagos, se ela aceitasse vender, sem custos ou pagamentos anteriores. Saber o recebimento contratual no vencimento não fixa a proposta de revenda. Esse modelo simples não descreve todos os títulos citados nem suas condições comerciais.",
        "sourceIds": []
      },
      {
        "id": "glossario",
        "type": "glossary",
        "heading": "12. Vocabulário fiscal e de títulos",
        "body": "Orçamento: previsão/autorização organizada para um período. Execução: fatos realizados. Fluxo: movimento entre datas. Estoque: posição numa data. Emissão: criação/colocação de um título pelo emissor nas condições da operação. Resgate: cumprimento do pagamento do título. Refinanciamento: novo financiamento para cumprir obrigação existente. Indexação: atualização por referencial. Cupom: juros periódicos. Deságio: diferença de preço abaixo do valor de referência.",
        "sourceIds": []
      },
      {
        "id": "resumo",
        "type": "summary",
        "heading": "13. O roteiro para ler um caso de dívida",
        "body": "Marque período e data, separe estoque e fluxo, identifique emissão ou negociação de título existente e descubra o destinatário dos recursos. Depois leia indexador, vencimento e pagamentos. Não use o nome do título para prometer uma revenda sem perda. Ao recuperar um erro, redesenhe quem paga a quem e indique a informação que ainda falta para concluir.",
        "sourceIds": []
      }
    ],
    "recall": [
      "Dê um exemplo de fluxo e de estoque, indicando as datas.",
      "Reconstrua emissão, revenda e resgate com participantes diferentes.",
      "Após errar, escreva qual informação foi confundida: autorização, pagamento, estoque, fluxo ou preço."
    ],
    "questions": [
      {
        "id": "q.mp07.q01",
        "topicId": "banking.mp.divida-publica",
        "prompt": "Uma despesa foi autorizada no orçamento. O que esse fato sozinho comprova?",
        "options": [
          "Que foi paga integralmente.",
          "Que o BCB já comprou o título correspondente.",
          "A autorização prevista, não a execução do pagamento ou sua forma de financiamento.",
          "Que a arrecadação prevista entrou integralmente."
        ],
        "answer": 2,
        "explanation": "Autorização, execução e financiamento precisam ser verificados separadamente.",
        "optionRationales": [
          "Confunde autorização e realização.",
          "Inventa operação monetária.",
          "Respeita o alcance do dado.",
          "Previsão de receita não é recebimento."
        ]
      },
      {
        "id": "q.mp07.q02",
        "topicId": "banking.mp.divida-publica",
        "prompt": "Qual dado é estoque, e não fluxo do período?",
        "options": [
          "Receita arrecadada durante o mês.",
          "Dívida apurada no encerramento do mês.",
          "Resgates pagos durante o ano.",
          "Títulos emitidos durante a semana."
        ],
        "answer": 1,
        "explanation": "A dívida numa data é uma posição; os demais itens são movimentos entre datas.",
        "optionRationales": [
          "É entrada ao longo de um intervalo.",
          "Identifica posição temporal.",
          "É saída ocorrida no período.",
          "É movimento de emissão."
        ]
      },
      {
        "id": "q.mp07.q03",
        "topicId": "banking.mp.divida-publica",
        "prompt": "No modelo sem ajustes, estoque inicial 300, resgates 40 e emissões 50. Qual estoque final?",
        "options": [
          "310.",
          "90.",
          "350.",
          "260."
        ],
        "answer": 0,
        "explanation": "300 − 40 + 50 = 310; é preciso considerar os dois fluxos.",
        "optionRationales": [
          "Inclui posição inicial e ambos os movimentos.",
          "Soma fluxos e ignora estoque inicial.",
          "Ignora resgates.",
          "Ignora emissões."
        ]
      },
      {
        "id": "q.mp07.q04",
        "topicId": "banking.mp.divida-publica",
        "prompt": "O governo tem superávit primário em um período. Qual conclusão é indevida apenas com essa informação?",
        "options": [
          "Receitas primárias excederam despesas primárias no recorte.",
          "É necessário observar juros para outro recorte de resultado.",
          "Pode haver vencimentos a refinanciar.",
          "Toda a dívida pública já foi eliminada."
        ],
        "answer": 3,
        "explanation": "Um resultado de fluxo não demonstra estoque nulo de dívida.",
        "optionRationales": [
          "É o sentido do superávit primário definido.",
          "Reconhece o recorte dos juros.",
          "É compatível com obrigações anteriores.",
          "Confunde resultado do período e dívida acumulada."
        ]
      },
      {
        "id": "q.mp07.q05",
        "topicId": "banking.mp.divida-publica",
        "prompt": "Um investidor vende um título existente a outro por 70. Quem recebe esses 70 na negociação descrita?",
        "options": [
          "Necessariamente o emissor como nova captação.",
          "O investidor vendedor.",
          "O BCB, mesmo sem participar.",
          "Ninguém, pois títulos existentes não têm preço."
        ],
        "answer": 1,
        "explanation": "A negociação transfere recursos ao detentor que vendeu, sem nova emissão indicada.",
        "optionRationales": [
          "Confunde emissão e revenda.",
          "Segue o fluxo descrito.",
          "Introduz participante ausente.",
          "Nega o pagamento explicitamente informado."
        ]
      },
      {
        "id": "q.mp07.q06",
        "topicId": "banking.mp.divida-publica",
        "prompt": "Qual associação respeita o recorte normativo explicitamente datado na aula?",
        "options": [
          "Toda LTN paga cupom semestral.",
          "Toda NTN-B é sem indexação.",
          "LFT tem rendimento associado à Selic na norma; NTN-B tem atualização pelo IPCA e juros semestrais.",
          "Só existem duas espécies de título público."
        ],
        "answer": 2,
        "explanation": "São características selecionadas do Decreto 12.814/2026, sem inventário completo.",
        "optionRationales": [
          "Transpõe cupom de outro título.",
          "Nega a atualização indicada.",
          "Preserva as características ensinadas.",
          "Transforma recorte em lista exaustiva."
        ]
      },
      {
        "id": "q.mp07.q07",
        "topicId": "banking.mp.divida-publica",
        "prompt": "Saber o valor de pagamento de um título fictício no vencimento garante a mesma quantia ao vendê-lo antes?",
        "options": [
          "Sim, preço de negociação e pagamento final são sempre iguais.",
          "Não: a revenda tem preço próprio, que pode gerar perda em relação à compra.",
          "Sim, prefixado significa preço de revenda fixo.",
          "Não: títulos nunca podem ser negociados."
        ],
        "answer": 1,
        "explanation": "Condição de vencimento e preço antes dele são variáveis distintas.",
        "optionRationales": [
          "Confunde duas datas e operações.",
          "Reconhece risco da negociação antecipada.",
          "Confunde remuneração contratada e mercado secundário.",
          "Generaliza proibição inexistente."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "mp07-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.mp07.q01": [
          {
            "missionId": "banking.mp.divida-publica",
            "sectionId": "orcamento"
          }
        ],
        "q.mp07.q02": [
          {
            "missionId": "banking.mp.divida-publica",
            "sectionId": "fluxo-estoque"
          }
        ],
        "q.mp07.q03": [
          {
            "missionId": "banking.mp.divida-publica",
            "sectionId": "fluxo-estoque"
          },
          {
            "missionId": "banking.mp.divida-publica",
            "sectionId": "exemplo-estoque"
          }
        ],
        "q.mp07.q04": [
          {
            "missionId": "banking.mp.divida-publica",
            "sectionId": "resultado"
          },
          {
            "missionId": "banking.mp.divida-publica",
            "sectionId": "exemplo-estoque"
          }
        ],
        "q.mp07.q05": [
          {
            "missionId": "banking.mp.divida-publica",
            "sectionId": "emissao-negociacao"
          },
          {
            "missionId": "banking.mp.divida-publica",
            "sectionId": "exemplo-secundario"
          }
        ],
        "q.mp07.q06": [
          {
            "missionId": "banking.mp.divida-publica",
            "sectionId": "remuneracao"
          },
          {
            "missionId": "banking.mp.divida-publica",
            "sectionId": "titulos-2026"
          }
        ],
        "q.mp07.q07": [
          {
            "missionId": "banking.mp.divida-publica",
            "sectionId": "remuneracao"
          },
          {
            "missionId": "banking.mp.divida-publica",
            "sectionId": "exemplo-preco"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.mp07",
      "blockId": "banking.markets-policy",
      "prerequisiteId": "banking.mp.qe-depositos",
      "parametersApproved": false
    }
  },
  {
    "id": "banking.mp.interbancario",
    "topicId": "banking.mp.interbancario",
    "contentVersion": 1,
    "order": 17,
    "title": "Mercado interbancário, tesouraria e varejo",
    "shortTitle": "MP-08",
    "kind": "lesson",
    "objective": "Identificar quem contrata com quem em uma necessidade de liquidez bancária ou operação de cliente, distinguindo fluxos e funções sem presumir um organograma universal.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "markets-policy-intro-r1",
      "releaseSequence": 2,
      "changeImpact": "new"
    },
    "sourceIds": [
      "mp.mp08.cvm.sfn",
      "mp.mp08.bcb.selic",
      "mp.mp08.br.l4595"
    ],
    "sections": [
      {
        "id": "retomada",
        "type": "explanation",
        "heading": "1. Um banco pode aparecer em relações diferentes",
        "body": "Retome a classificação de mercados em [MP-01](mp-01-v1.md), saldo/crédito em [MP-02](mp-02-v1.md) e operações em [MP-05](mp-05-v1.md). “O banco recebeu dinheiro” não descreve sozinho a operação. Pode ser um depósito de cliente, um empréstimo de outro banco ou liquidação de um título. Precisamos identificar a contraparte, a obrigação criada e a data. A função desempenhada numa operação é mais informativa do que apenas o nome da instituição.",
        "sourceIds": [],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "Retome a classificação de mercados em "
              },
              {
                "text": "MP-01",
                "missionId": "banking.mp.mercados",
                "sectionId": "perguntas",
                "wholeLesson": true
              },
              {
                "text": ", saldo/crédito em "
              },
              {
                "text": "MP-02",
                "missionId": "banking.mp.moeda",
                "sectionId": "retomada",
                "wholeLesson": true
              },
              {
                "text": " e operações em "
              },
              {
                "text": "MP-05",
                "missionId": "banking.mp.instrumentos",
                "sectionId": "retomada",
                "wholeLesson": true
              },
              {
                "text": ". “O banco recebeu dinheiro” não descreve sozinho a operação. Pode ser um depósito de cliente, um empréstimo de outro banco ou liquidação de um título. Precisamos identificar a contraparte, a obrigação criada e a data. A função desempenhada numa operação é mais informativa do que apenas o nome da instituição."
              }
            ]
          }
        ]
      },
      {
        "id": "interbancario",
        "type": "explanation",
        "heading": "2. Operações entre bancos",
        "body": "No recorte monetário, instituições ajustam necessidades e disponibilidades de curto prazo. Interbancário identifica uma relação entre bancos; não é um nome alternativo para qualquer empréstimo de um banco. Um banco com recursos disponíveis pode fornecer recursos a outro, sob condições pactuadas. A operação cria obrigação entre as instituições. Não é, por esse motivo, um crédito pessoal contratado por cada correntista do banco tomador. Operações monetárias também podem envolver o BCB, mas isso não transforma qualquer relação banco–cliente em interbancária.",
        "sourceIds": [
          "mp.mp08.cvm.sfn"
        ]
      },
      {
        "id": "exemplo-interbancario",
        "type": "worked-example",
        "heading": "3. Exemplo resolvido: acompanhar um ajuste entre bancos",
        "body": "Modelo fictício: banco A tem 70 de disponibilidade e banco B precisa de 30 para seu fluxo do dia. Admitindo operação permitida entre eles, A entrega 30 a B, que assume devolver o valor e a remuneração combinada no prazo. Na ida, A fica com 40 de disponibilidade no modelo; B recebe 30. A tem um direito perante B, não perante cada cliente de B. A transferência redistribui recursos entre os dois bancos no instante descrito; o exemplo não mede o crédito total nem a quantidade total de moeda na economia.\n\n```mermaid\nflowchart LR\n  A[\"Banco A: fornece recursos\"] -->|\"30 hoje\"| B[\"Banco B: obtém recursos\"]\n  B -->|\"devolução e remuneração no prazo\"| A\n```",
        "sourceIds": [],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "Modelo fictício: banco A tem 70 de disponibilidade e banco B precisa de 30 para seu fluxo do dia. Admitindo operação permitida entre eles, A entrega 30 a B, que assume devolver o valor e a remuneração combinada no prazo. Na ida, A fica com 40 de disponibilidade no modelo; B recebe 30. A tem um direito perante B, não perante cada cliente de B. A transferência redistribui recursos entre os dois bancos no instante descrito; o exemplo não mede o crédito total nem a quantidade total de moeda na economia."
              }
            ]
          },
          {
            "type": "flow",
            "edges": [
              {
                "from": "Banco A: fornece recursos",
                "to": "Banco B: obtém recursos",
                "label": "30 hoje"
              },
              {
                "from": "Banco B: obtém recursos",
                "to": "Banco A: fornece recursos",
                "label": "devolução e remuneração no prazo"
              }
            ]
          }
        ]
      },
      {
        "id": "varejo",
        "type": "explanation",
        "heading": "4. A operação de cliente tem outra contraparte",
        "body": "Varejo bancário é um modo de organizar o atendimento e a oferta de serviços a um conjunto amplo de clientes, incluindo pessoas e pequenos negócios. Aqui estudamos o caso de crédito a uma pessoa. O banco e o cliente são as contrapartes; o cliente assume a obrigação de devolver conforme o contrato. Como o banco administra seus recursos é outra relação. Não deduza que o crédito de um cliente está ligado individualmente a um empréstimo interbancário específico sem essa informação.",
        "sourceIds": []
      },
      {
        "id": "exemplo-varejo",
        "type": "worked-example",
        "heading": "5. Exemplo resolvido: o mesmo número não faz a mesma operação",
        "body": "Outro caso fictício: banco C concede 30 de crédito à cliente Lia, que assume o pagamento contratual. A origem e o destino agora são banco e pessoa. O número 30 coincide com o exemplo anterior, mas a contraparte tomadora mudou. No primeiro caso, B devia a A; aqui, Lia deve a C. Não há no relato prova de que C tomou 30 de outro banco para financiar Lia.\n\n```mermaid\nflowchart LR\n  C[\"Banco C: credor\"] -->|\"crédito de 30\"| L[\"Lia: cliente tomadora\"]\n  L -->|\"pagamento contratual\"| C\n```",
        "sourceIds": [],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "Outro caso fictício: banco C concede 30 de crédito à cliente Lia, que assume o pagamento contratual. A origem e o destino agora são banco e pessoa. O número 30 coincide com o exemplo anterior, mas a contraparte tomadora mudou. No primeiro caso, B devia a A; aqui, Lia deve a C. Não há no relato prova de que C tomou 30 de outro banco para financiar Lia."
              }
            ]
          },
          {
            "type": "flow",
            "edges": [
              {
                "from": "Banco C: credor",
                "to": "Lia: cliente tomadora",
                "label": "crédito de 30"
              },
              {
                "from": "Lia: cliente tomadora",
                "to": "Banco C: credor",
                "label": "pagamento contratual"
              }
            ]
          }
        ]
      },
      {
        "id": "tesouraria",
        "type": "explanation",
        "heading": "6. Tesouraria: olhar para recursos, prazos e posições",
        "body": "Usaremos “tesouraria” como função de administrar recursos e posições financeiras da instituição, inclusive acompanhar entradas, saídas e vencimentos. Essa lente ajuda a entender uma necessidade de liquidez do próprio banco. Não define um organograma obrigatório: responsabilidades e nomes de áreas variam. Atendimento ao cliente e gestão financeira institucional podem coexistir no mesmo banco; isso não torna a operação com cliente idêntica ao ajuste entre instituições. Avaliar cada contrato evita reduzir o banco a uma única função.",
        "sourceIds": []
      },
      {
        "id": "exemplo-calendario",
        "type": "worked-example",
        "heading": "7. Exemplo resolvido: total suficiente, horário inadequado",
        "body": "Banco fictício tem 15 disponíveis pela manhã, deve pagar 25 ao meio-dia e espera receber 20 no fim do dia. Ao meio-dia, faltam 25 − 15 = 10 se nenhum outro recurso entrar. Somar logo 15 + 20 e concluir que não há necessidade ignora o horário do recebimento. No total do dia, 15 + 20 − 25 = 10, mas essa sobra final não pagou antecipadamente o compromisso do meio-dia. Uma operação permitida para o intervalo pode atender a necessidade; condições e devolução continuam relevantes.",
        "sourceIds": []
      },
      {
        "id": "taxas",
        "type": "explanation",
        "heading": "8. Identificar a taxa da operação certa",
        "body": "Uma taxa precisa indicar operações, prazo e método de apuração. A Selic efetiva, por exemplo, corresponde ao recorte de compromissadas federais de um dia útil explicado em MP-04. Não é correto atribuí-la automaticamente a todo crédito varejista ou a todo contrato entre bancos. Se um exercício fornece apenas “taxa de 8%” sem prazo e sem dizer a que operação pertence, faltam informações. Não introduziremos cálculo de uma taxa interbancária específica sem seus dados e convenções.",
        "sourceIds": [
          "mp.mp08.bcb.selic"
        ]
      },
      {
        "id": "comparacao",
        "type": "explanation",
        "heading": "9. Recuperação de crédito não é ajuste de liquidez",
        "body": "Se um cliente atrasa uma dívida, há um problema de cumprimento daquela obrigação. Recuperação de crédito é o conjunto de ações para buscar esse recebimento dentro das regras aplicáveis; sua abordagem jurídica/negocial pertence ao recorte PC-10 previsto, não a esta aula. Se um banco precisa cobrir um desencontro de horários, a pergunta imediata é de liquidez. Os fenômenos podem se relacionar, mas não são sinônimos. Não é possível diagnosticar a qualidade de toda a carteira apenas pelo ajuste de caixa de um dia.",
        "sourceIds": []
      },
      {
        "id": "glossario",
        "type": "glossary",
        "heading": "10. Vocabulário para comparar relações",
        "body": "Interbancário: entre bancos. Varejo bancário: atendimento/serviços ao conjunto de clientes descrito, não um tipo único de contrato. Tesouraria: função de gestão de recursos e posições usada neste recorte. Credor: quem tem direito de receber. Tomador/devedor: quem assume obrigação na operação. Posição: recursos ou obrigações observados numa data. Vencimento: prazo de cumprimento. Carteira: conjunto de operações/ativos.",
        "sourceIds": []
      },
      {
        "id": "resumo",
        "type": "summary",
        "heading": "11. Um quadro antes de classificar",
        "body": "Faça quatro colunas: quem entrega, quem recebe, qual obrigação e quando. A mesma quantia pode aparecer em contratos diferentes. A mesma instituição pode atuar com clientes, outras instituições e BCB. Após errar, troque uma contraparte no desenho e explique por que a relação mudou. Não acrescente uma fonte de financiamento não informada.",
        "sourceIds": []
      }
    ],
    "recall": [
      "Compare os dois diagramas identificando credor e devedor.",
      "Explique por que sobra ao fim do dia pode coexistir com falta ao meio-dia.",
      "Depois de errar, refaça as quatro colunas sem inventar participantes ou contratos."
    ],
    "questions": [
      {
        "id": "q.mp08.q01",
        "topicId": "banking.mp.interbancario",
        "prompt": "Banco D fornece recursos de curto prazo ao banco E. Qual relação foi descrita?",
        "options": [
          "Crédito pessoal automático a todos os clientes de E.",
          "Operação entre os bancos D e E.",
          "Emissão obrigatória de ações de E.",
          "Transferência sem obrigação porque ambos são bancos."
        ],
        "answer": 1,
        "explanation": "As contrapartes são as duas instituições; condições da operação continuam relevantes.",
        "optionRationales": [
          "Troca os devedores sem informação.",
          "Identifica os participantes.",
          "Não existe emissão no relato.",
          "A natureza bancária não elimina obrigação."
        ]
      },
      {
        "id": "q.mp08.q02",
        "topicId": "banking.mp.interbancario",
        "prompt": "Banco D concede crédito à cliente Nara. O mesmo valor havia aparecido num exemplo entre bancos. O que determina a distinção?",
        "options": [
          "A quantia, sozinha.",
          "A cor do cartão da cliente.",
          "As contrapartes e as obrigações, não a coincidência numérica.",
          "Ser todo crédito obrigatoriamente interbancário."
        ],
        "answer": 2,
        "explanation": "Cliente tomadora e banco tomador pertencem a relações distintas.",
        "optionRationales": [
          "O valor não identifica a relação.",
          "Dado irrelevante ao contrato apresentado.",
          "Usa a informação que diferencia os casos.",
          "Apaga a contraparte cliente."
        ]
      },
      {
        "id": "q.mp08.q03",
        "topicId": "banking.mp.interbancario",
        "prompt": "Um banco tem 12 disponíveis agora, deve 20 antes de receber 15 no fim do dia. Qual necessidade imediata no modelo?",
        "options": [
          "Faltam 8 para o pagamento anterior ao recebimento.",
          "Sobram 7 agora, somando o recebimento futuro.",
          "Faltam 20, ignorando os 12 disponíveis.",
          "Não se pode comparar datas em uma análise de liquidez."
        ],
        "answer": 0,
        "explanation": "Antes da entrada futura, 20 − 12 = 8. A sobra final não elimina o intervalo.",
        "optionRationales": [
          "Respeita os horários.",
          "Antecipa recursos ainda indisponíveis.",
          "Ignora recursos presentes.",
          "A data é justamente parte da análise."
        ]
      },
      {
        "id": "q.mp08.q04",
        "topicId": "banking.mp.interbancario",
        "prompt": "Qual uso de “tesouraria” corresponde ao recorte da aula?",
        "options": [
          "Nome obrigatório de toda agência no país.",
          "Sinônimo de todos os empréstimos pessoais.",
          "Função exclusiva de instituições que não atendem clientes.",
          "Função de gerir recursos/posições; a organização concreta pode variar."
        ],
        "answer": 3,
        "explanation": "A aula descreve função, sem impor estrutura interna universal.",
        "optionRationales": [
          "Confunde função e regra de nomenclatura.",
          "Reduz função institucional a um contrato de varejo.",
          "Inventa exclusividade.",
          "Preserva o limite da definição."
        ]
      },
      {
        "id": "q.mp08.q05",
        "topicId": "banking.mp.interbancario",
        "prompt": "Um enunciado informa uma taxa de uma operação interbancária. Podemos atribuí-la automaticamente ao empréstimo de um cliente?",
        "options": [
          "Sim, todas as taxas de um banco são iguais.",
          "Não: precisamos das condições e do prazo da operação do cliente.",
          "Sim, pois percentuais não dependem de contratos.",
          "Não: crédito ao cliente nunca tem juros."
        ],
        "answer": 1,
        "explanation": "Taxa é associada a operações e condições; não basta compartilhar uma instituição.",
        "optionRationales": [
          "Elimina diferenças contratuais.",
          "Identifica a informação necessária.",
          "Ignora prazo e operação.",
          "Nega a remuneração possível do crédito."
        ]
      },
      {
        "id": "q.mp08.q06",
        "topicId": "banking.mp.interbancario",
        "prompt": "Um banco ajusta sua liquidez ao meio-dia. Isso comprova que todos os seus clientes estão inadimplentes?",
        "options": [
          "Sim: toda necessidade temporal prova inadimplência total.",
          "Sim: liquidez é o número de atrasos da carteira.",
          "Não: o ajuste temporal não permite essa conclusão sobre a carteira.",
          "Não: bancos nunca sofrem inadimplência."
        ],
        "answer": 2,
        "explanation": "Datas de entradas/saídas e qualidade de crédito exigem informações diferentes.",
        "optionRationales": [
          "Generaliza sem dados.",
          "Troca definição de liquidez.",
          "Respeita o alcance da evidência.",
          "Nega risco sem fundamento."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "mp08-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.mp08.q01": [
          {
            "missionId": "banking.mp.interbancario",
            "sectionId": "interbancario"
          },
          {
            "missionId": "banking.mp.interbancario",
            "sectionId": "exemplo-interbancario"
          }
        ],
        "q.mp08.q02": [
          {
            "missionId": "banking.mp.interbancario",
            "sectionId": "varejo"
          },
          {
            "missionId": "banking.mp.interbancario",
            "sectionId": "exemplo-varejo"
          }
        ],
        "q.mp08.q03": [
          {
            "missionId": "banking.mp.interbancario",
            "sectionId": "tesouraria"
          },
          {
            "missionId": "banking.mp.interbancario",
            "sectionId": "exemplo-calendario"
          }
        ],
        "q.mp08.q04": [
          {
            "missionId": "banking.mp.interbancario",
            "sectionId": "tesouraria"
          },
          {
            "missionId": "banking.mp.interbancario",
            "sectionId": "glossario"
          }
        ],
        "q.mp08.q05": [
          {
            "missionId": "banking.mp.interbancario",
            "sectionId": "taxas"
          }
        ],
        "q.mp08.q06": [
          {
            "missionId": "banking.mp.interbancario",
            "sectionId": "exemplo-calendario"
          },
          {
            "missionId": "banking.mp.interbancario",
            "sectionId": "comparacao"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.mp08",
      "blockId": "banking.markets-policy",
      "prerequisiteId": "banking.mp.divida-publica",
      "parametersApproved": false
    }
  },
  {
    "id": "banking.mp.curva-juros",
    "topicId": "banking.mp.curva-juros",
    "contentVersion": 1,
    "order": 18,
    "title": "Prazos e curva de juros",
    "shortTitle": "MP-09",
    "kind": "lesson",
    "objective": "Ler eixos, unidades e prazos de uma curva didática, comparar seus pontos e distinguir taxa de prazo específico, retorno acumulado e previsão do futuro.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "markets-policy-intro-r1",
      "releaseSequence": 2,
      "changeImpact": "new"
    },
    "sourceIds": [
      "mp.mp09.bce.curva",
      "mp.mp09.bcb.selic"
    ],
    "sections": [
      {
        "id": "retomada",
        "type": "explanation",
        "heading": "1. Da taxa isolada à comparação de prazos",
        "body": "Retome porcentagens/períodos em [MP-03](mp-03-v1.md) e vencimento/preço em [MP-07](mp-07-v1.md). Prazo remanescente é quanto falta, a partir da data de observação, até o vencimento. Uma curva de juros relaciona taxas e prazos. Para uma comparação útil, informe data, moeda, tipo de taxa e características dos instrumentos. Misturar moedas, riscos ou convenções sem aviso pode atribuir ao prazo diferenças que vieram de outra característica.",
        "sourceIds": [
          "mp.mp09.bce.curva"
        ],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "Retome porcentagens/períodos em "
              },
              {
                "text": "MP-03",
                "missionId": "banking.mp.inflacao",
                "sectionId": "retomada",
                "wholeLesson": true
              },
              {
                "text": " e vencimento/preço em "
              },
              {
                "text": "MP-07",
                "missionId": "banking.mp.divida-publica",
                "sectionId": "retomada",
                "wholeLesson": true
              },
              {
                "text": ". Prazo remanescente é quanto falta, a partir da data de observação, até o vencimento. Uma curva de juros relaciona taxas e prazos. Para uma comparação útil, informe data, moeda, tipo de taxa e características dos instrumentos. Misturar moedas, riscos ou convenções sem aviso pode atribuir ao prazo diferenças que vieram de outra característica."
              }
            ]
          }
        ]
      },
      {
        "id": "eixos",
        "type": "explanation",
        "heading": "2. Como ler um gráfico antes de interpretar",
        "body": "O eixo horizontal, lido da esquerda para a direita, mostrará prazo remanescente em anos. O vertical, de baixo para cima, mostrará taxa em porcentagem ao ano (% a.a.). Um ponto combina as duas coordenadas. Os três pontos do gráfico A pertencem à mesma data fictícia e, por hipótese didática, a instrumentos comparáveis. A linha apenas conecta os pontos para facilitar a leitura; não adiciona observações intermediárias nem mostra um caminho no calendário. A tabela oferece os mesmos dados para leitura sem gráfico.",
        "sourceIds": []
      },
      {
        "id": "grafico-a",
        "type": "explanation",
        "heading": "3. Gráfico A: uma fotografia fictícia dos prazos",
        "body": "Data fictícia A. Mesma moeda, mesma convenção de taxa anual e risco comparável por hipótese. Os números não são cotações brasileiras nem dados do BCE.\n\n| Prazo remanescente (anos) | Taxa (% a.a.) |\n| --- | --- |\n| 1 | 6 |\n| 2 | 7 |\n| 3 | 8 |\n\n```mermaid\nxychart-beta\n  title \"A: mesma data, prazos diferentes — dados fictícios\"\n  x-axis \"Prazo remanescente (anos)\" [1, 2, 3]\n  y-axis \"Taxa (% a.a.)\" 5 --> 9\n  line [6, 7, 8]\n```",
        "sourceIds": [],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "Data fictícia A. Mesma moeda, mesma convenção de taxa anual e risco comparável por hipótese. Os números não são cotações brasileiras nem dados do BCE."
              }
            ]
          },
          {
            "type": "table",
            "headers": [
              "Prazo remanescente (anos)",
              "Taxa (% a.a.)"
            ],
            "rows": [
              [
                "1",
                "6"
              ],
              [
                "2",
                "7"
              ],
              [
                "3",
                "8"
              ]
            ]
          },
          {
            "type": "line-chart",
            "title": "A: mesma data, prazos diferentes — dados fictícios",
            "xLabel": "Prazo remanescente (anos)",
            "yLabel": "Taxa (% a.a.)",
            "x": [
              1,
              2,
              3
            ],
            "y": [
              6,
              7,
              8
            ],
            "yMin": 5,
            "yMax": 9
          }
        ]
      },
      {
        "id": "exemplo-leitura",
        "type": "worked-example",
        "heading": "4. Exemplo resolvido: duas coordenadas, duas unidades",
        "body": "No gráfico A, localize 2 no eixo horizontal: significa dois anos até o vencimento, não o segundo ano de um histórico. Suba até o ponto; a taxa no eixo vertical é 7% a.a. Para um ano, o ponto mostra 6% a.a. Diferença: 7 − 6 = 1 ponto percentual. A comparação usa duas taxas na mesma data para prazos diferentes. Não diz que a taxa básica subirá de 6% para 7% daqui a um ano.",
        "sourceIds": []
      },
      {
        "id": "formas",
        "type": "explanation",
        "heading": "5. Ascendente, descendente e plana",
        "body": "Uma curva ascendente tem taxas maiores nos prazos mais longos do recorte; descendente, menores; plana, aproximadamente iguais. São descrições da relação observada, não regras universais. A forma pode refletir expectativas e avaliação de riscos incorporadas aos preços. “Prêmio” designa aqui remuneração adicional exigida por riscos ou condições; não um bônus garantido. Uma leitura de tendência da curva não fornece certeza sobre inflação, recessão ou decisões futuras.",
        "sourceIds": [
          "mp.mp09.bce.curva"
        ]
      },
      {
        "id": "exemplo-futuro",
        "type": "worked-example",
        "heading": "6. Exemplo resolvido: a foto não é um filme",
        "body": "Um estudante olha a curva A e diz: “O juro de três anos é 8%, então a Selic será exatamente 8% no terceiro ano”. Primeiro erro: o eixo mostra prazo remanescente, não uma sequência de futuras decisões do Copom. Segundo: taxa de determinado instrumento/prazo e taxa Selic são medidas diferentes. Terceiro: expectativas e riscos nos preços não garantem realização. A conclusão segura é apenas a taxa de 8% a.a. atribuída, no modelo e naquela data, ao prazo de três anos.",
        "sourceIds": [
          "mp.mp09.bcb.selic"
        ]
      },
      {
        "id": "acumulado",
        "type": "explanation",
        "heading": "7. Taxa anual e retorno acumulado não são iguais",
        "body": "Para entender a unidade, considere separadamente uma aplicação fictícia com taxa efetiva fixa de 10% ao ano durante dois anos, reinvestindo integralmente os juros, sem custos ou outras movimentações. Depois de um ano, multiplica-se por 1,10. No segundo, a nova base também é multiplicada por 1,10. Isso ensina a capitalização composta deste modelo; não é autorização para calcular todos os preços da curva, que dependeriam das convenções de cada instrumento.",
        "sourceIds": []
      },
      {
        "id": "exemplo-acumulado",
        "type": "worked-example",
        "heading": "8. Exemplo resolvido: usar a nova base",
        "body": "Partindo de 100 no modelo da seção anterior: ano 1, 100 × 1,10 = 110; ano 2, 110 × 1,10 = 121. O ganho de 21 sobre os 100 iniciais equivale a 21% acumulados em dois anos. 10% a.a. não significa 10% para todo o prazo; somar 10 + 10 daria 20%, diferente deste modelo composto. Não se devem aplicar esses números fictícios a um título real só pelo nome.",
        "sourceIds": []
      },
      {
        "id": "exemplo-comparar",
        "type": "worked-example",
        "heading": "9. Exemplo resolvido: mudança numa ponta",
        "body": "Outro par de fotografias fictícias comparáveis: antes, taxas de 5% para um ano e 7% para três; depois, 6% para um ano e 7% para três. A ponta curta subiu 1 ponto percentual; a longa não mudou. Logo, dizer “todas as taxas subiram igualmente” seria falso. O intervalo longa menos curta passou de 2 para 1 ponto percentual. Uma única taxa não resume toda a estrutura por prazos.",
        "sourceIds": []
      },
      {
        "id": "grafico-b",
        "type": "explanation",
        "heading": "10. Gráfico B para uma nova leitura",
        "body": "Use este segundo conjunto fictício nas questões indicadas. Mesmas hipóteses de comparação interna do gráfico A, mas outra situação; não é uma série temporal de A para B.\n\n| Prazo remanescente (anos) | Taxa (% a.a.) |\n| --- | --- |\n| 1 | 9 |\n| 2 | 8 |\n| 3 | 7 |\n\n```mermaid\nxychart-beta\n  title \"B: outra situação fictícia\"\n  x-axis \"Prazo remanescente (anos)\" [1, 2, 3]\n  y-axis \"Taxa (% a.a.)\" 6 --> 10\n  line [9, 8, 7]\n```",
        "sourceIds": [],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "Use este segundo conjunto fictício nas questões indicadas. Mesmas hipóteses de comparação interna do gráfico A, mas outra situação; não é uma série temporal de A para B."
              }
            ]
          },
          {
            "type": "table",
            "headers": [
              "Prazo remanescente (anos)",
              "Taxa (% a.a.)"
            ],
            "rows": [
              [
                "1",
                "9"
              ],
              [
                "2",
                "8"
              ],
              [
                "3",
                "7"
              ]
            ]
          },
          {
            "type": "line-chart",
            "title": "B: outra situação fictícia",
            "xLabel": "Prazo remanescente (anos)",
            "yLabel": "Taxa (% a.a.)",
            "x": [
              1,
              2,
              3
            ],
            "y": [
              9,
              8,
              7
            ],
            "yMin": 6,
            "yMax": 10
          }
        ]
      },
      {
        "id": "glossario",
        "type": "glossary",
        "heading": "11. Vocabulário de leitura",
        "body": "Prazo remanescente: tempo até vencer a partir da observação. Curva/estrutura a termo: relação entre taxas e prazos. Ponta curta/longa: prazos menores/maiores no recorte. Pontos percentuais: unidade de diferença entre porcentagens. Taxa anual: expressa em um ano segundo convenção indicada. Acumulado: variação ao longo de todo o intervalo. Expectativa: avaliação de futuro, não realização garantida.",
        "sourceIds": []
      },
      {
        "id": "resumo",
        "type": "summary",
        "heading": "12. Primeiro leia; depois limite a conclusão",
        "body": "Leia data, eixos e unidades; localize o ponto; compare prazos compatíveis; descreva a forma. Só então avalie se a frase pretendida vai além dos dados. Não trate curva como previsão infalível nem taxa anual como retorno acumulado. Ao recuperar um erro, escreva a coordenada completa e diga qual eixo ou período havia confundido.",
        "sourceIds": []
      }
    ],
    "recall": [
      "Leia um ponto do gráfico B dizendo prazo, unidade e data fictícia.",
      "Explique por que uma fotografia da curva não é um histórico nem garantia do futuro.",
      "Após errar, retome a coordenada/base correta e refaça a comparação com um ponto diferente."
    ],
    "questions": [
      {
        "id": "q.mp09.q01",
        "topicId": "banking.mp.curva-juros",
        "prompt": "No gráfico B, qual leitura corresponde ao ponto de dois anos?",
        "options": [
          "8% a.a. para prazo remanescente de dois anos, naquela situação fictícia.",
          "8% acumulados garantidos em quaisquer dois anos.",
          "A inflação será 8% daqui a dois anos.",
          "A Selic será necessariamente 8% no segundo ano."
        ],
        "answer": 0,
        "explanation": "O ponto liga prazo e taxa na data de observação; não informa essas outras medidas.",
        "optionRationales": [
          "Lê as duas coordenadas.",
          "Troca unidade anual por acumulada e cria garantia.",
          "A curva não mede diretamente inflação futura.",
          "Troca prazo de instrumento por decisão futura."
        ]
      },
      {
        "id": "q.mp09.q02",
        "topicId": "banking.mp.curva-juros",
        "prompt": "Como descrever o gráfico B no recorte de um a três anos?",
        "options": [
          "Plano, pois há três pontos.",
          "Ascendente, porque o prazo cresce.",
          "Descendente, porque a taxa cai de 9% para 7% conforme o prazo aumenta.",
          "Histórico anual da Selic."
        ],
        "answer": 2,
        "explanation": "A forma compara taxas por prazo, não a contagem de pontos nem passagem de anos.",
        "optionRationales": [
          "Quantidade de pontos não define forma.",
          "O crescimento do eixo não implica crescimento da taxa.",
          "Compara a direção das taxas corretamente.",
          "Confunde fotografia por prazo e histórico."
        ]
      },
      {
        "id": "q.mp09.q03",
        "topicId": "banking.mp.curva-juros",
        "prompt": "No gráfico B, a taxa de um ano supera a de três anos em quanto?",
        "options": [
          "2 reais.",
          "2 pontos percentuais.",
          "Exatamente 2% de variação relativa da taxa de três anos.",
          "16 pontos percentuais."
        ],
        "answer": 1,
        "explanation": "9% − 7% = 2 pontos percentuais; a diferença não é um valor monetário.",
        "optionRationales": [
          "Usa unidade monetária para taxas.",
          "Nomeia corretamente a diferença.",
          "Confunde diferença em pontos e proporção relativa.",
          "Soma em vez de subtrair."
        ]
      },
      {
        "id": "q.mp09.q04",
        "topicId": "banking.mp.curva-juros",
        "prompt": "O que uma taxa longa elevada permite afirmar sozinha sobre a decisão futura do Copom?",
        "options": [
          "Que a taxa básica seguirá exatamente a mesma trajetória.",
          "Que a inflação futura já está medida.",
          "Que todo investimento terá ganho garantido.",
          "Não determina essa decisão: instrumentos, expectativas e riscos precisam ser separados."
        ],
        "answer": 3,
        "explanation": "Uma taxa observada por prazo não é uma sequência garantida de decisões monetárias.",
        "optionRationales": [
          "Transforma preço e expectativa em certeza.",
          "Confunde informação de mercado e medição futura.",
          "Cria garantia não presente.",
          "Mantém o limite da evidência."
        ]
      },
      {
        "id": "q.mp09.q05",
        "topicId": "banking.mp.curva-juros",
        "prompt": "Modelo fictício: 100 a 5% efetivos ao ano por dois anos, reinvestindo juros, sem custos ou movimentações. Qual montante final?",
        "options": [
          "110, porque basta somar as taxas.",
          "105, pois a taxa só pode valer uma vez.",
          "110,25, calculando 100 × 1,05 × 1,05.",
          "125, porque dois anos significam elevar 5 ao quadrado e somar."
        ],
        "answer": 2,
        "explanation": "Primeiro chega a 105; depois 105 × 1,05 = 110,25. O exemplo declara capitalização composta.",
        "optionRationales": [
          "Usa modelo simples em lugar do composto fornecido.",
          "Ignora o segundo período.",
          "Atualiza a base no segundo ano.",
          "Não usa fatores de crescimento."
        ]
      },
      {
        "id": "q.mp09.q06",
        "topicId": "banking.mp.curva-juros",
        "prompt": "Taxas comparáveis: a curta passa de 4% para 5% e a longa permanece 6%. Qual afirmação é correta?",
        "options": [
          "Toda a curva subiu 1 ponto percentual.",
          "A curta subiu 1 ponto percentual, e o intervalo longa menos curta caiu de 2 para 1 ponto.",
          "A longa caiu 1 ponto percentual.",
          "Nenhuma taxa mudou."
        ],
        "answer": 1,
        "explanation": "A mudança de um ponto da estrutura não implica mudança igual em todos.",
        "optionRationales": [
          "Generaliza a mudança curta.",
          "Calcula as diferenças nas duas fotografias.",
          "A taxa longa permaneceu 6%.",
          "Ignora a alteração curta."
        ]
      },
      {
        "id": "q.mp09.q07",
        "topicId": "banking.mp.curva-juros",
        "prompt": "Duas taxas têm prazos diferentes, mas também moedas e riscos diferentes. Podemos atribuir toda a diferença apenas ao prazo?",
        "options": [
          "Não: a comparação mistura outras características relevantes.",
          "Sim, o prazo sempre explica tudo.",
          "Sim, basta ambas conterem o símbolo %.",
          "Não: taxas nunca podem ser comparadas em nenhum caso."
        ],
        "answer": 0,
        "explanation": "É necessário controlar ou explicitar as características, em vez de supor comparabilidade.",
        "optionRationales": [
          "Identifica a limitação.",
          "Ignora moeda e risco.",
          "Unidade percentual sozinha não basta.",
          "Generaliza uma limitação específica."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "mp09-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.mp09.q01": [
          {
            "missionId": "banking.mp.curva-juros",
            "sectionId": "eixos"
          },
          {
            "missionId": "banking.mp.curva-juros",
            "sectionId": "exemplo-leitura"
          },
          {
            "missionId": "banking.mp.curva-juros",
            "sectionId": "grafico-b"
          }
        ],
        "q.mp09.q02": [
          {
            "missionId": "banking.mp.curva-juros",
            "sectionId": "formas"
          },
          {
            "missionId": "banking.mp.curva-juros",
            "sectionId": "grafico-b"
          }
        ],
        "q.mp09.q03": [
          {
            "missionId": "banking.mp.curva-juros",
            "sectionId": "exemplo-leitura"
          },
          {
            "missionId": "banking.mp.curva-juros",
            "sectionId": "grafico-b"
          }
        ],
        "q.mp09.q04": [
          {
            "missionId": "banking.mp.curva-juros",
            "sectionId": "formas"
          },
          {
            "missionId": "banking.mp.curva-juros",
            "sectionId": "exemplo-futuro"
          }
        ],
        "q.mp09.q05": [
          {
            "missionId": "banking.mp.curva-juros",
            "sectionId": "acumulado"
          },
          {
            "missionId": "banking.mp.curva-juros",
            "sectionId": "exemplo-acumulado"
          }
        ],
        "q.mp09.q06": [
          {
            "missionId": "banking.mp.curva-juros",
            "sectionId": "exemplo-comparar"
          }
        ],
        "q.mp09.q07": [
          {
            "missionId": "banking.mp.curva-juros",
            "sectionId": "retomada"
          },
          {
            "missionId": "banking.mp.curva-juros",
            "sectionId": "resumo"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.mp09",
      "blockId": "banking.markets-policy",
      "prerequisiteId": "banking.mp.interbancario",
      "parametersApproved": false
    }
  },
  {
    "id": "banking.mp.revisao",
    "topicId": "banking.mp.revisao",
    "contentVersion": 1,
    "order": 19,
    "title": "Revisão cumulativa: mercados, política e dívida",
    "shortTitle": "MP-R",
    "kind": "lesson",
    "objective": "Conectar conceitos já ensinados em MP-01–09, justificar classificações e recuperar erros pelas aulas de origem, sem tratar prática exposta como avaliação independente.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 25,
    "publication": {
      "status": "draft",
      "releaseId": "markets-policy-intro-r1",
      "releaseSequence": 2,
      "changeImpact": "new"
    },
    "sourceIds": [
      "mp.mpr.cvm.sfn",
      "mp.mpr.bcb.selic",
      "mp.mpr.bcb.transmissao",
      "mp.mpr.bcb.compulsorios",
      "mp.mpr.br.l4595",
      "mp.mpr.br.l14185",
      "mp.mpr.boe.qe",
      "mp.mpr.stn.fiscal",
      "mp.mpr.br.d12814",
      "mp.mpr.bce.curva"
    ],
    "sections": [
      {
        "id": "acesso",
        "type": "explanation",
        "heading": "1. Comece pelas aulas de origem",
        "body": "Esta revisão só poderá ser usada após ensino e acesso efetivo a todas as unidades anteriores. Hoje o conjunto inteiro continua em rascunho, fora do aplicativo. Se um conceito ainda não foi estudado, volte à origem antes de tentar as questões: [MP-01 mercados](mp-01-v1.md), [MP-02 moeda e pagamentos](mp-02-v1.md), [MP-03 preços e juros](mp-03-v1.md), [MP-04 transmissão](mp-04-v1.md), [MP-05 operações](mp-05-v1.md), [MP-06 temas datados](mp-06-v1.md), [MP-07 dívida](mp-07-v1.md), [MP-08 relações bancárias](mp-08-v1.md) e [MP-09 curva](mp-09-v1.md). Os comentários ficam disponíveis: isto é prática formativa exposta, não uma forma independente ou comprovação de retenção.",
        "sourceIds": [],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "Esta revisão só poderá ser usada após ensino e acesso efetivo a todas as unidades anteriores. Hoje o conjunto inteiro continua em rascunho, fora do aplicativo. Se um conceito ainda não foi estudado, volte à origem antes de tentar as questões: "
              },
              {
                "text": "MP-01 mercados",
                "missionId": "banking.mp.mercados",
                "sectionId": "perguntas",
                "wholeLesson": true
              },
              {
                "text": ", "
              },
              {
                "text": "MP-02 moeda e pagamentos",
                "missionId": "banking.mp.moeda",
                "sectionId": "retomada",
                "wholeLesson": true
              },
              {
                "text": ", "
              },
              {
                "text": "MP-03 preços e juros",
                "missionId": "banking.mp.inflacao",
                "sectionId": "retomada",
                "wholeLesson": true
              },
              {
                "text": ", "
              },
              {
                "text": "MP-04 transmissão",
                "missionId": "banking.mp.politica-monetaria",
                "sectionId": "retomada",
                "wholeLesson": true
              },
              {
                "text": ", "
              },
              {
                "text": "MP-05 operações",
                "missionId": "banking.mp.instrumentos",
                "sectionId": "retomada",
                "wholeLesson": true
              },
              {
                "text": ", "
              },
              {
                "text": "MP-06 temas datados",
                "missionId": "banking.mp.qe-depositos",
                "sectionId": "retomada",
                "wholeLesson": true
              },
              {
                "text": ", "
              },
              {
                "text": "MP-07 dívida",
                "missionId": "banking.mp.divida-publica",
                "sectionId": "retomada",
                "wholeLesson": true
              },
              {
                "text": ", "
              },
              {
                "text": "MP-08 relações bancárias",
                "missionId": "banking.mp.interbancario",
                "sectionId": "retomada",
                "wholeLesson": true
              },
              {
                "text": " e "
              },
              {
                "text": "MP-09 curva",
                "missionId": "banking.mp.curva-juros",
                "sectionId": "retomada",
                "wholeLesson": true
              },
              {
                "text": ". Os comentários ficam disponíveis: isto é prática formativa exposta, não uma forma independente ou comprovação de retenção."
              }
            ]
          }
        ]
      },
      {
        "id": "metodo",
        "type": "explanation",
        "heading": "2. Quatro camadas para resolver um caso",
        "body": "Primeiro, marque participantes e o que está sendo trocado. Segundo, registre data, prazo, valor e unidade. Terceiro, identifique o tipo de afirmação: objetivo, operação, posição numa data ou resultado observado. Quarto, confronte a conclusão com os dados: ela inventa nova emissão, taxa futura, crédito automático ou informação não medida? Esse método reúne as distinções ensinadas; não exige decorar uma sigla para cada frase.",
        "sourceIds": []
      },
      {
        "id": "exemplo-integrado",
        "type": "worked-example",
        "heading": "3. Caso resolvido: quatro acontecimentos na mesma semana",
        "body": "Caso inteiramente fictício. A: um governo emite título e recebe 40 de uma investidora. B: ela vende o título existente a outro investidor por 41. C: dois bancos ajustam recursos entre si para cobrir um intervalo de pagamentos. D: a meta de juros é elevada e uma empresa revê um projeto financiado. Resolução: A é captação por emissão, com obrigação do emissor; em B o pagamento de 41 vai à vendedora, não constitui nova captação do governo; C é relação entre bancos, sem transformar cada correntista em devedor dessa operação; D conecta decisão monetária a possível reação de investimento. Ocorrerem na mesma semana não prova que um evento causou integralmente os outros. Origens: [emissão/revenda](mp-07-v1.md#emissao-negociacao), [relações entre bancos](mp-08-v1.md#interbancario), [transmissão](mp-04-v1.md#transmissao).",
        "sourceIds": [],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "Caso inteiramente fictício. A: um governo emite título e recebe 40 de uma investidora. B: ela vende o título existente a outro investidor por 41. C: dois bancos ajustam recursos entre si para cobrir um intervalo de pagamentos. D: a meta de juros é elevada e uma empresa revê um projeto financiado. Resolução: A é captação por emissão, com obrigação do emissor; em B o pagamento de 41 vai à vendedora, não constitui nova captação do governo; C é relação entre bancos, sem transformar cada correntista em devedor dessa operação; D conecta decisão monetária a possível reação de investimento. Ocorrerem na mesma semana não prova que um evento causou integralmente os outros. Origens: "
              },
              {
                "text": "emissão/revenda",
                "missionId": "banking.mp.divida-publica",
                "sectionId": "emissao-negociacao",
                "wholeLesson": false
              },
              {
                "text": ", "
              },
              {
                "text": "relações entre bancos",
                "missionId": "banking.mp.interbancario",
                "sectionId": "interbancario",
                "wholeLesson": false
              },
              {
                "text": ", "
              },
              {
                "text": "transmissão",
                "missionId": "banking.mp.politica-monetaria",
                "sectionId": "transmissao",
                "wholeLesson": false
              },
              {
                "text": "."
              }
            ]
          }
        ]
      },
      {
        "id": "exemplo-numerico",
        "type": "worked-example",
        "heading": "4. Caso resolvido: valores iguais podem medir coisas diferentes",
        "body": "Outro caso fictício: o dinheiro cresce 6% e a cesta de referência também 6% no mesmo período, sem custos ou outras movimentações. A taxa real é 1,06/1,06 − 1 = 0. Ao lado, uma curva mostra 6% a.a. para um prazo de dois anos na data de observação. A coincidência “6%” não faz da curva a inflação realizada nem um retorno acumulado de dois anos. É preciso ler a unidade e a variável. Origens: [taxa real](mp-03-v1.md#real) e [eixos da curva](mp-09-v1.md#eixos).",
        "sourceIds": [],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "Outro caso fictício: o dinheiro cresce 6% e a cesta de referência também 6% no mesmo período, sem custos ou outras movimentações. A taxa real é 1,06/1,06 − 1 = 0. Ao lado, uma curva mostra 6% a.a. para um prazo de dois anos na data de observação. A coincidência “6%” não faz da curva a inflação realizada nem um retorno acumulado de dois anos. É preciso ler a unidade e a variável. Origens: "
              },
              {
                "text": "taxa real",
                "missionId": "banking.mp.inflacao",
                "sectionId": "real",
                "wholeLesson": false
              },
              {
                "text": " e "
              },
              {
                "text": "eixos da curva",
                "missionId": "banking.mp.curva-juros",
                "sectionId": "eixos",
                "wholeLesson": false
              },
              {
                "text": "."
              }
            ]
          }
        ]
      },
      {
        "id": "exemplo-instrumentos",
        "type": "worked-example",
        "heading": "5. Caso resolvido: o recurso foi exigido, depositado ou trocado por ativo?",
        "body": "Caso fictício: três registros mencionam recursos no banco central. A instituição X cumpre uma exigência de recolhimento calculada sobre captação: compulsório. A instituição Y escolhe um depósito remunerado nas condições aplicáveis: depósito voluntário. Em outro país, o banco central compra ativos em programa para influenciar condições mais longas: situação compatível com o QE ensinado, se respeitado seu contexto. Classificar só pelo local dos recursos apagaria obrigação, voluntariedade e troca de ativos. Origens: [compulsório](mp-05-v1.md#compulsorio), [depósitos](mp-06-v1.md#depositos) e [QE](mp-06-v1.md#qe).",
        "sourceIds": [],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "Caso fictício: três registros mencionam recursos no banco central. A instituição X cumpre uma exigência de recolhimento calculada sobre captação: compulsório. A instituição Y escolhe um depósito remunerado nas condições aplicáveis: depósito voluntário. Em outro país, o banco central compra ativos em programa para influenciar condições mais longas: situação compatível com o QE ensinado, se respeitado seu contexto. Classificar só pelo local dos recursos apagaria obrigação, voluntariedade e troca de ativos. Origens: "
              },
              {
                "text": "compulsório",
                "missionId": "banking.mp.instrumentos",
                "sectionId": "compulsorio",
                "wholeLesson": false
              },
              {
                "text": ", "
              },
              {
                "text": "depósitos",
                "missionId": "banking.mp.qe-depositos",
                "sectionId": "depositos",
                "wholeLesson": false
              },
              {
                "text": " e "
              },
              {
                "text": "QE",
                "missionId": "banking.mp.qe-depositos",
                "sectionId": "qe",
                "wholeLesson": false
              },
              {
                "text": "."
              }
            ]
          }
        ]
      },
      {
        "id": "recuperacao",
        "type": "explanation",
        "heading": "6. Recuperar o raciocínio depois do erro",
        "body": "Antes de abrir a resposta, escreva uma justificativa curta. Se errar, escolha a categoria do erro: participante/mercado, saldo/instrumento, base/período, fluxo/estoque ou certeza indevida. Volte ao exemplo de origem indicado; explique por que o distrator parecia correto; resolva novamente mudando um participante ou número. Acertar depois de ler o comentário mostra uma etapa de correção, não retenção demonstrada em outro momento. Este roteiro não altera datas de revisão, XP ou a política do aplicativo.",
        "sourceIds": []
      },
      {
        "id": "glossario",
        "type": "glossary",
        "heading": "7. Distinções que não podem desaparecer",
        "body": "Emissor não é necessariamente o vendedor atual. Instrumento de pagamento não é o saldo que o financia. Crescimento nominal não é crescimento real. Objetivo monetário não é resultado garantido. Compulsório não é depósito voluntário. Operação entre bancos não é crédito direto a cada cliente. Fluxo não é estoque. Taxa por prazo não é promessa da taxa futura. As definições e exemplos completos permanecem nas aulas vinculadas.",
        "sourceIds": []
      },
      {
        "id": "resumo",
        "type": "summary",
        "heading": "8. Prática, desafio e avaliação são evidências distintas",
        "body": "A prática abaixo usa casos novos, mas, ao ser exposta com comentários, passa a compor o material de estudo. Um desafio final do bloco deverá ter casos próprios e acesso às aulas anteriores; sua conclusão não provará prontidão para concurso. Formas independentes exigem itens reservados, controle de exposição e desenho próprios. Nada aqui amplia A/B nem muda a autorização de publicação. O [plano do desafio](../71-MP-BLOCO-RASCUNHO-E-REVISAO.md) estabelece dependências e critérios antes de qualquer integração.",
        "sourceIds": [],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "A prática abaixo usa casos novos, mas, ao ser exposta com comentários, passa a compor o material de estudo. Um desafio final do bloco deverá ter casos próprios e acesso às aulas anteriores; sua conclusão não provará prontidão para concurso. Formas independentes exigem itens reservados, controle de exposição e desenho próprios. Nada aqui amplia A/B nem muda a autorização de publicação. O "
              },
              {
                "text": "plano do desafio",
                "href": "https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/blob/36a8f9c688a44faf13bf3de287f74e291402a182/docs/missao-bancaria/71-MP-BLOCO-RASCUNHO-E-REVISAO.md"
              },
              {
                "text": " estabelece dependências e critérios antes de qualquer integração."
              }
            ]
          }
        ]
      }
    ],
    "recall": [
      "Reconstrua o caso integrado sem olhar a classificação e consulte só a origem de um conceito incerto.",
      "Escreva uma justificativa para um distrator: qual dado ele trocou ou inventou?",
      "Depois da correção, altere uma característica e explique por que o raciocínio permanece válido ou muda."
    ],
    "questions": [
      {
        "id": "q.mpr.q01",
        "topicId": "banking.mp.revisao",
        "prompt": "Uma empresa emite um título de dívida para captar recursos. Que distinção ajuda a entender a operação?",
        "options": [
          "O comprador virou automaticamente sócio com direito a voto.",
          "É uma relação de dívida; o direito decorre das condições do título, diferente de uma participação acionária.",
          "Toda captação é moeda estrangeira.",
          "O distribuidor passa sempre a ser o devedor da emissora."
        ],
        "answer": 1,
        "explanation": "Dívida e participação societária representam relações distintas, como ensinado na MP-01.",
        "optionRationales": [
          "Confunde título de dívida e ação.",
          "Mantém a natureza da obrigação.",
          "Inventa operação cambial.",
          "Confunde distribuição e obrigação de pagamento."
        ]
      },
      {
        "id": "q.mpr.q02",
        "topicId": "banking.mp.revisao",
        "prompt": "Uma pessoa paga usando um instrumento, mas os recursos saem de seu saldo já existente. Qual conclusão é correta?",
        "options": [
          "O instrumento é o mesmo que o saldo.",
          "Todo uso de instrumento cria crédito novo.",
          "Instrumento e recursos que financiam o pagamento são conceitos diferentes.",
          "O limite de crédito é sempre saldo próprio."
        ],
        "answer": 2,
        "explanation": "MP-02 ensina a separar meio de iniciar o pagamento e origem dos recursos.",
        "optionRationales": [
          "Apaga a distinção funcional.",
          "Pode haver uso de saldo existente.",
          "Preserva instrumento/origem dos recursos.",
          "Confunde crédito possível e recursos próprios."
        ]
      },
      {
        "id": "q.mpr.q03",
        "topicId": "banking.mp.revisao",
        "prompt": "Caso fictício no mesmo período: dinheiro cresce 3% e cesta 5%, sem custos ou movimentações. Qual sinal da taxa real?",
        "options": [
          "Negativo, pois 1,03/1,05 é menor que 1.",
          "Positivo, pois a quantia cresceu.",
          "Zero, pois ambas as taxas são positivas.",
          "Não há como identificar nem o sinal com os dois dados."
        ],
        "answer": 0,
        "explanation": "O fator do dinheiro ficou abaixo do fator dos preços. A fórmula foi ensinada na MP-03.",
        "optionRationales": [
          "Compara fatores na ordem correta.",
          "Ignora poder de compra.",
          "Positividade não torna as taxas iguais.",
          "Os dados do mesmo período são suficientes."
        ]
      },
      {
        "id": "q.mpr.q04",
        "topicId": "banking.mp.revisao",
        "prompt": "Uma alta de juros é seguida de redução de um índice de inflação. Qual frase respeita o que foi ensinado?",
        "options": [
          "Toda a redução foi necessariamente causada por essa decisão.",
          "O resultado prova que não existiram outros fatores.",
          "A decisão obrigou todas as empresas a reduzir preços.",
          "É compatível com canais de transmissão, mas a observação isolada não mede toda a causalidade."
        ],
        "answer": 3,
        "explanation": "O caso combina decisão e resultado observado; identificar canais não elimina fatores simultâneos.",
        "optionRationales": [
          "Atribui integralmente causa sem identificação.",
          "Inventa ausência de fatores concorrentes.",
          "Transforma influência em imposição.",
          "Delimita a inferência possível."
        ]
      },
      {
        "id": "q.mpr.q05",
        "topicId": "banking.mp.revisao",
        "prompt": "No modelo, hoje o BCB compra título de um banco com compromisso de revendê-lo. A ponta inicial descrita:",
        "options": [
          "Retira recursos do banco para o BCB.",
          "Fornece recursos ao banco contra o título, com retorno acordado.",
          "Extingue a dívida do título automaticamente.",
          "É sempre nova emissão do Tesouro."
        ],
        "answer": 1,
        "explanation": "A compra pelo BCB entrega recursos à contraparte banco; não é necessário inventar emissão.",
        "optionRationales": [
          "Inverte as setas.",
          "Identifica participante e fluxo.",
          "Compra não é extinção automática.",
          "Emissor e vendedor podem diferir."
        ]
      },
      {
        "id": "q.mpr.q06",
        "topicId": "banking.mp.revisao",
        "prompt": "Instituição financeira escolhe depósito remunerado no BCB. Em outro caso, um banco central estrangeiro realiza programa de compras de ativos. Qual comparação é adequada?",
        "options": [
          "São necessariamente o mesmo QE.",
          "Ambos são compulsórios por envolver banco central.",
          "Depósito e compra de ativo são relações diferentes; país e condições importam.",
          "Toda remuneração financeira é um tributo."
        ],
        "answer": 2,
        "explanation": "A comparação exige identificar o direito e a obrigação, não apenas o local dos recursos.",
        "optionRationales": [
          "Elimina diferença de instrumento.",
          "Ignora voluntariedade e compra.",
          "Preserva características e contexto.",
          "Confunde pagamento contratual e tributo."
        ]
      },
      {
        "id": "q.mpr.q07",
        "topicId": "banking.mp.revisao",
        "prompt": "Modelo sem juros/ajustes: dívida inicial 200, emissão 60, resgate 50. Depois um investidor revende título existente por 12 a outro. Qual dívida final no modelo?",
        "options": [
          "210; a revenda não acrescenta automaticamente 12 ao estoque do emissor.",
          "222; toda revenda cria nova dívida do emissor.",
          "110; basta somar os fluxos.",
          "12; só importa a última transação."
        ],
        "answer": 0,
        "explanation": "200 + 60 − 50 = 210. A troca de detentor foi separada da emissão na MP-07.",
        "optionRationales": [
          "Considera fluxos do emissor e posição inicial.",
          "Conta troca de titular como nova emissão.",
          "Ignora posição inicial e sinais.",
          "Confunde preço de negociação e estoque total."
        ]
      },
      {
        "id": "q.mpr.q08",
        "topicId": "banking.mp.revisao",
        "prompt": "Banco F empresta recursos ao banco G. G também tem contratos com clientes. Quem é devedor de F na primeira operação?",
        "options": [
          "Cada cliente de G individualmente, sem contrato adicional.",
          "G, conforme a operação entre os bancos.",
          "O Tesouro, só porque há dois bancos.",
          "Ninguém, pois relações interbancárias não criam obrigações."
        ],
        "answer": 1,
        "explanation": "Não se transfere a obrigação de G aos clientes sem fundamento no caso.",
        "optionRationales": [
          "Troca a contraparte por terceiros.",
          "Identifica o tomador contratado.",
          "Introduz devedor alheio ao enunciado.",
          "Elimina obrigações da relação."
        ]
      },
      {
        "id": "q.mpr.q09",
        "topicId": "banking.mp.revisao",
        "prompt": "Fotografia fictícia comparável: taxa anual de 7% no prazo de um ano e 5% no prazo de três. Qual leitura é segura?",
        "options": [
          "A inflação será 5% daqui a três anos.",
          "A Selic cairá exatamente dois pontos no ano seguinte.",
          "O retorno acumulado em três anos é necessariamente 5%.",
          "A taxa anual do prazo de três anos é dois pontos percentuais menor nessa fotografia."
        ],
        "answer": 3,
        "explanation": "O dado relaciona prazos e taxas na mesma data, sem garantir resultados futuros.",
        "optionRationales": [
          "Transforma taxa por prazo em inflação realizada.",
          "Cria trajetória de política futura.",
          "Troca unidade anual por acumulada.",
          "Lê unidades e diferença corretamente."
        ]
      },
      {
        "id": "q.mpr.q10",
        "topicId": "banking.mp.revisao",
        "prompt": "Após errar e ler o comentário, uma pessoa acerta a mesma questão. Qual registro é honesto?",
        "options": [
          "Aprendeu definitivamente todos os conceitos do bloco.",
          "Já está pronta para aprovação no concurso.",
          "Corrigiu essa resposta com apoio; retenção e transferência ainda precisam de evidências próprias.",
          "A questão se tornou inédita por ter sido respondida de novo."
        ],
        "answer": 2,
        "explanation": "Correção apoiada é útil, mas exposição e familiaridade limitam o que se pode concluir.",
        "optionRationales": [
          "Generaliza um acerto com apoio.",
          "Confunde prática e prontidão.",
          "Distingue apoio, exposição e evidência futura.",
          "Repetição não restaura ineditismo."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "mpr-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.mpr.q01": [
          {
            "missionId": "banking.mp.revisao",
            "sectionId": "metodo"
          },
          {
            "missionId": "banking.mp.revisao",
            "sectionId": "glossario"
          },
          {
            "missionId": "banking.mp.mercados",
            "sectionId": "capitais"
          }
        ],
        "q.mpr.q02": [
          {
            "missionId": "banking.mp.revisao",
            "sectionId": "glossario"
          },
          {
            "missionId": "banking.mp.revisao",
            "sectionId": "recuperacao"
          },
          {
            "missionId": "banking.mp.moeda",
            "sectionId": "instrumento"
          }
        ],
        "q.mpr.q03": [
          {
            "missionId": "banking.mp.revisao",
            "sectionId": "exemplo-numerico"
          },
          {
            "missionId": "banking.mp.inflacao",
            "sectionId": "real"
          }
        ],
        "q.mpr.q04": [
          {
            "missionId": "banking.mp.revisao",
            "sectionId": "exemplo-integrado"
          },
          {
            "missionId": "banking.mp.revisao",
            "sectionId": "metodo"
          },
          {
            "missionId": "banking.mp.politica-monetaria",
            "sectionId": "exemplo-rotulos"
          }
        ],
        "q.mpr.q05": [
          {
            "missionId": "banking.mp.revisao",
            "sectionId": "metodo"
          },
          {
            "missionId": "banking.mp.revisao",
            "sectionId": "glossario"
          },
          {
            "missionId": "banking.mp.instrumentos",
            "sectionId": "exemplo-injecao"
          }
        ],
        "q.mpr.q06": [
          {
            "missionId": "banking.mp.revisao",
            "sectionId": "exemplo-instrumentos"
          },
          {
            "missionId": "banking.mp.qe-depositos",
            "sectionId": "exemplo-classificacao"
          }
        ],
        "q.mpr.q07": [
          {
            "missionId": "banking.mp.revisao",
            "sectionId": "exemplo-integrado"
          },
          {
            "missionId": "banking.mp.revisao",
            "sectionId": "glossario"
          },
          {
            "missionId": "banking.mp.divida-publica",
            "sectionId": "exemplo-estoque"
          }
        ],
        "q.mpr.q08": [
          {
            "missionId": "banking.mp.revisao",
            "sectionId": "exemplo-integrado"
          },
          {
            "missionId": "banking.mp.revisao",
            "sectionId": "metodo"
          },
          {
            "missionId": "banking.mp.interbancario",
            "sectionId": "exemplo-interbancario"
          }
        ],
        "q.mpr.q09": [
          {
            "missionId": "banking.mp.revisao",
            "sectionId": "exemplo-numerico"
          },
          {
            "missionId": "banking.mp.revisao",
            "sectionId": "glossario"
          },
          {
            "missionId": "banking.mp.curva-juros",
            "sectionId": "exemplo-futuro"
          }
        ],
        "q.mpr.q10": [
          {
            "missionId": "banking.mp.revisao",
            "sectionId": "recuperacao"
          },
          {
            "missionId": "banking.mp.revisao",
            "sectionId": "resumo"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.mpr",
      "blockId": "banking.markets-policy",
      "prerequisiteId": "banking.mp.curva-juros",
      "parametersApproved": false
    }
  },
  {
    "id": "banking.mp.boss",
    "topicId": "banking.mp.boss",
    "contentVersion": 1,
    "order": 20,
    "title": "Chefe — conectar mercados, instrumentos e dívida",
    "shortTitle": "MP-CHEFE",
    "kind": "boss",
    "objective": "Aplicar as distinções ensinadas em MP-01–09 a doze casos próprios, justificando a resposta e retomando o ensino de origem após erro.",
    "xp": 220,
    "passScore": 75,
    "estimatedMinutes": 30,
    "publication": {
      "status": "draft",
      "releaseId": "markets-policy-intro-r1",
      "releaseSequence": 2,
      "changeImpact": "new"
    },
    "sourceIds": [
      "mp.mpchefe.cvm.sfn.segmentos",
      "mp.mpchefe.cvm.valores.papeis",
      "mp.mpchefe.bcb.credito.2026",
      "mp.mpchefe.cvm.primario.secundario",
      "mp.mpchefe.bce.moeda.funcoes",
      "mp.mpchefe.bcb.pagamento.conceito",
      "mp.mpchefe.bcb.liquidez.2026",
      "mp.mpchefe.bce.inflacao.conceito",
      "mp.mpchefe.bcb.juros.2026",
      "mp.mpchefe.br.lc179",
      "mp.mpchefe.bcb.selic",
      "mp.mpchefe.bcb.transmissao",
      "mp.mpchefe.bcb.compulsorios",
      "mp.mpchefe.br.l4595",
      "mp.mpchefe.boe.qe",
      "mp.mpchefe.br.l14185",
      "mp.mpchefe.stn.fiscal",
      "mp.mpchefe.br.l4320",
      "mp.mpchefe.br.d12814",
      "mp.mpchefe.cvm.primario",
      "mp.mpchefe.cvm.sfn",
      "mp.mpchefe.bce.curva"
    ],
    "sections": [
      {
        "id": "preparacao",
        "type": "explanation",
        "heading": "1. Ensino e acesso antes do Chefe",
        "body": "Este desafio depende de [MP-01](mp-01-v1.md), [MP-02](mp-02-v1.md), [MP-03](mp-03-v1.md), [MP-04](mp-04-v1.md), [MP-05](mp-05-v1.md), [MP-06](mp-06-v1.md), [MP-07](mp-07-v1.md), [MP-08](mp-08-v1.md) e [MP-09](mp-09-v1.md) ensinadas e acessíveis. A [MP-R](mp-r-v1.md) permite preparar a revisão antes da tentativa. Hoje todos esses materiais são rascunhos fora do aplicativo. Não use o Chefe para substituir as aulas nem para cobrar um conceito antes de ler a origem indicada.",
        "sourceIds": [],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "Este desafio depende de "
              },
              {
                "text": "MP-01",
                "missionId": "banking.mp.mercados",
                "sectionId": "perguntas",
                "wholeLesson": true
              },
              {
                "text": ", "
              },
              {
                "text": "MP-02",
                "missionId": "banking.mp.moeda",
                "sectionId": "retomada",
                "wholeLesson": true
              },
              {
                "text": ", "
              },
              {
                "text": "MP-03",
                "missionId": "banking.mp.inflacao",
                "sectionId": "retomada",
                "wholeLesson": true
              },
              {
                "text": ", "
              },
              {
                "text": "MP-04",
                "missionId": "banking.mp.politica-monetaria",
                "sectionId": "retomada",
                "wholeLesson": true
              },
              {
                "text": ", "
              },
              {
                "text": "MP-05",
                "missionId": "banking.mp.instrumentos",
                "sectionId": "retomada",
                "wholeLesson": true
              },
              {
                "text": ", "
              },
              {
                "text": "MP-06",
                "missionId": "banking.mp.qe-depositos",
                "sectionId": "retomada",
                "wholeLesson": true
              },
              {
                "text": ", "
              },
              {
                "text": "MP-07",
                "missionId": "banking.mp.divida-publica",
                "sectionId": "retomada",
                "wholeLesson": true
              },
              {
                "text": ", "
              },
              {
                "text": "MP-08",
                "missionId": "banking.mp.interbancario",
                "sectionId": "retomada",
                "wholeLesson": true
              },
              {
                "text": " e "
              },
              {
                "text": "MP-09",
                "missionId": "banking.mp.curva-juros",
                "sectionId": "retomada",
                "wholeLesson": true
              },
              {
                "text": " ensinadas e acessíveis. A "
              },
              {
                "text": "MP-R",
                "missionId": "banking.mp.revisao",
                "sectionId": "acesso",
                "wholeLesson": true
              },
              {
                "text": " permite preparar a revisão antes da tentativa. Hoje todos esses materiais são rascunhos fora do aplicativo. Não use o Chefe para substituir as aulas nem para cobrar um conceito antes de ler a origem indicada."
              }
            ]
          }
        ]
      },
      {
        "id": "roteiro",
        "type": "explanation",
        "heading": "2. Um roteiro para os seis agrupamentos",
        "body": "Nos itens 1–2, identifique participantes, obrigação e quem atua apenas distribuindo. Nos 3–4, separe recursos próprios, crédito, datas e poder de compra. Nos 5–6, distinga objetivo, decisão, observação e atribuição causal. Nos 7–8, siga as duas pontas e as condições de cada instrumento. Nos 9–10, diferencie emissão, resgate, negociação e preço. Nos 11–12, leia prazo, unidade e base de capitalização. Os cenários e valores a seguir foram criados para esta prática; não representam ofertas ou taxas atuais.",
        "sourceIds": []
      },
      {
        "id": "exemplo-metodo",
        "type": "worked-example",
        "heading": "3. Exemplo resolvido de preparação: a ordem das perguntas",
        "body": "Uma nota fictícia diz somente: “Uma instituição recebeu recursos ontem e fará um pagamento amanhã”. Passo 1: há duas datas, mas não sabemos se o pagamento é devolução desses mesmos recursos. Passo 2: faltam contraparte e obrigação, então não podemos concluir que houve compulsório, empréstimo ou compra de título. Passo 3: pedir esses dados é a conclusão adequada; o nome da instituição não completa o relato. O exemplo demonstra como evitar uma classificação inventada. Os itens do Chefe fornecem as hipóteses necessárias para uma resposta única.",
        "sourceIds": []
      },
      {
        "id": "glossario",
        "type": "glossary",
        "heading": "4. Consulta antes de responder",
        "body": "Credor/devedor: participantes de um direito e de uma obrigação de pagamento. Distribuidor: quem participa da colocação do título; distribuição, por si, não transfere para ele a obrigação da emissora. Estoque/fluxo: posição numa data e movimento num intervalo. Preço de negociação: quantia paga numa troca, distinta do pagamento contratual no vencimento. Fator de crescimento: 1 mais a taxa decimal do período. Ponto percentual: unidade de diferença entre taxas. Consulte as explicações completas nas aulas vinculadas, se algum termo ainda não estiver claro.",
        "sourceIds": []
      },
      {
        "id": "recuperacao",
        "type": "summary",
        "heading": "5. Depois de um erro ou acerto com dúvida",
        "body": "Tente justificar sua resposta antes de abrir o comentário. Depois, compare também os distratores. Ao errar, retome o trecho de origem, marque o dado confundido e refaça as contas ou setas. As doze questões são novas em relação aos enunciados das aulas, mas ficam expostas nesta prévia: não são itens reservados para avaliação independente. Acertar o Chefe, especialmente depois de consultar respostas, não comprova retenção, prontidão ou aprovação. Nenhuma regra de XP, revisão adaptativa ou liberação foi implantada por este rascunho.",
        "sourceIds": []
      }
    ],
    "recall": [
      "Antes da tentativa, indique a origem de um conceito que ainda precise retomar.",
      "Depois de responder, explique qual dado torna sua alternativa a única correta no caso.",
      "Ao recuperar um erro, altere um participante, valor ou prazo e refaça o raciocínio sem consultar o gabarito."
    ],
    "questions": [
      {
        "id": "q.mpchefe.q01",
        "topicId": "banking.mp.boss",
        "prompt": "Dois contratos fictícios e independentes: o banco Sol fornece 70 ao banco Lua; o banco Lua concede 14 de crédito à Oficina Norte. Quem deve pagar ao Sol no primeiro contrato e ao Lua no segundo, respectivamente?",
        "options": [
          "Oficina Norte; banco Sol.",
          "Banco Lua; banco Sol.",
          "Banco Lua; Oficina Norte.",
          "Oficina Norte; banco Lua."
        ],
        "answer": 2,
        "explanation": "No primeiro contrato, Lua é tomador de Sol. No segundo, a oficina é tomadora de Lua. O caso não transfere a obrigação do banco para a oficina nem informa vinculação individual entre os dois financiamentos.",
        "optionRationales": [
          "A oficina não é tomadora de Sol; Sol não recebeu crédito no segundo contrato.",
          "Acerta o primeiro tomador, mas inverte o segundo contrato.",
          "Identifica o devedor de cada relação sem misturar contratos.",
          "Troca o tomador do primeiro e coloca o credor do segundo como seu próprio devedor."
        ]
      },
      {
        "id": "q.mpchefe.q02",
        "topicId": "banking.mp.boss",
        "prompt": "A companhia fictícia Mirante emite títulos de dívida. A instituição Horizonte faz apenas a distribuição, sem assumir garantia ou obrigação adicional, e Talita compra um título. Quem é o devedor dos pagamentos previstos nesse título?",
        "options": [
          "Mirante, conforme as condições do título.",
          "Horizonte, somente porque o distribuiu.",
          "Talita, somente porque o comprou.",
          "Horizonte e Talita, em lugar da emissora."
        ],
        "answer": 0,
        "explanation": "A emissora Mirante é a devedora no título. A atuação de Horizonte como distribuidora, por si, não a torna responsável pelo pagamento da dívida da emissora aos investidores; o caso exclui obrigação adicional.",
        "optionRationales": [
          "Preserva a obrigação da emissora e as condições do instrumento.",
          "Confunde distribuir o título com assumir o pagamento da dívida.",
          "Talita adquire um direito pelo título; não assume a obrigação de sua emissora.",
          "Transfere a dívida para participantes que não a assumiram no caso."
        ]
      },
      {
        "id": "q.mpchefe.q03",
        "topicId": "banking.mp.boss",
        "prompt": "No modelo fictício de uma conta, há R$ 46 de saldo próprio disponível hoje, limite de crédito ainda não utilizado de R$ 34 e recebimento previsto de R$ 20 amanhã. Um pagamento hoje deve usar exclusivamente recursos próprios já disponíveis, sem tarifas, outras saídas, contratação de crédito ou novas entradas. Qual valor máximo atende a essa condição?",
        "options": [
          "R$ 100, somando os três valores.",
          "R$ 80, juntando saldo e limite.",
          "R$ 66, antecipando o recebimento.",
          "R$ 46, considerando apenas o saldo próprio de hoje."
        ],
        "answer": 3,
        "explanation": "O limite é possibilidade de crédito, não saldo próprio; o recebimento de amanhã não está disponível hoje. Pelas hipóteses expressas, só os R$ 46 atendem simultaneamente à origem e à data requeridas.",
        "optionRationales": [
          "Soma crédito não utilizado e entrada futura como se fossem recursos próprios atuais.",
          "Inclui um limite que o enunciado não permite contratar.",
          "Trata o recebimento futuro como dinheiro disponível no momento do pagamento.",
          "Respeita tanto a origem própria quanto a disponibilidade atual."
        ]
      },
      {
        "id": "q.mpchefe.q04",
        "topicId": "banking.mp.boss",
        "prompt": "Num único período fictício, uma quantia cresce 12% e a cesta de preços de referência encarece 8%. Sem custos, tributos, aportes ou retiradas, qual é o ganho real no modelo ensinado, arredondado a duas casas percentuais?",
        "options": [
          "4,00%, usando a diferença como resultado exato.",
          "3,70%, calculando (1,12 / 1,08 − 1) × 100.",
          "12,00%, usando apenas o crescimento da quantia.",
          "−3,57%, calculando (1,08 / 1,12 − 1) × 100."
        ],
        "answer": 1,
        "explanation": "O fator do dinheiro é dividido pelo fator dos preços: 1,12 / 1,08 − 1 = aproximadamente 0,037037. Em porcentagem, cerca de 3,70%. A subtração simples fornece aproximação, não a igualdade exata pedida.",
        "optionRationales": [
          "Usa a aproximação de quatro pontos como se fosse a taxa real exata.",
          "Compara os fatores na ordem e no período corretos, arredondando no final.",
          "Ignora o encarecimento da cesta.",
          "Inverte a razão entre o fator do dinheiro e o dos preços."
        ]
      },
      {
        "id": "q.mpchefe.q05",
        "topicId": "banking.mp.boss",
        "prompt": "Relatório fictício: (I) buscar estabilidade de preços; (II) o Copom altera a meta Selic; (III) calcula-se a taxa média efetivamente praticada nas compromissadas federais de um dia útil. Qual classificação mantém as três informações distintas?",
        "options": [
          "I: objetivo; II: decisão de política; III: taxa apurada nas operações.",
          "I: taxa apurada; II: objetivo; III: decisão do Copom.",
          "I: objetivo; II: inflação já medida; III: preço fixado para todo empréstimo.",
          "I: decisão sobre a Selic; II: taxa de cada contrato; III: objetivo legal."
        ],
        "answer": 0,
        "explanation": "A finalidade, a decisão sobre a meta e a taxa observada têm funções diferentes. A terceira informação é sobre as operações especificadas; não é a inflação nem a taxa de todos os contratos.",
        "optionRationales": [
          "Separa finalidade, decisão e observação operacional.",
          "Troca as três categorias apresentadas.",
          "Confunde juros e inflação e universaliza a taxa observada.",
          "Atribui à finalidade e aos dados sentidos que eles não têm."
        ]
      },
      {
        "id": "q.mpchefe.q06",
        "topicId": "banking.mp.boss",
        "prompt": "Uma fábrica fictícia adia uma expansão. No mesmo mês, seu financiamento ficou mais caro e as encomendas de clientes externos diminuíram. Um analista atribui integralmente o adiamento à mudança dos juros. Qual avaliação usa apenas as evidências dadas?",
        "options": [
          "A conclusão está provada, pois eventos no mesmo mês têm uma única causa.",
          "A queda das encomendas prova que juros nunca afetam investimento.",
          "Os dois fatores necessariamente explicam metade do efeito cada um.",
          "O encarecimento pode influenciar o investimento, mas não foi isolado do efeito das encomendas."
        ],
        "answer": 3,
        "explanation": "O encarecimento do financiamento pode influenciar a decisão de investir, mas existe outra mudança relevante. Sem separar influências, não se pode atribuir todo o resultado a um fator nem dividir percentuais de participação.",
        "optionRationales": [
          "Coincidência temporal não identifica uma causa exclusiva.",
          "Reconhecer outra influência não elimina o mecanismo monetário.",
          "Inventa uma repartição numérica sem dados.",
          "Reconhece mecanismo plausível e a limitação da atribuição causal."
        ]
      },
      {
        "id": "q.mpchefe.q07",
        "topicId": "banking.mp.boss",
        "prompt": "Num modelo fictício, hoje um banco entrega 250 ao BCB e recebe um título. Ficou combinado que, amanhã, o banco devolverá esse título ao BCB e receberá 253. Pela perspectiva do BCB, qual descrição é correta?",
        "options": [
          "Compra com revenda: o BCB fornece 250 na ida e recebe 253 na volta.",
          "Venda com recompra: o BCB recebe 250 na ida e paga 253 na volta.",
          "Venda definitiva: o BCB recebe 250 e não há operação inversa prevista.",
          "Depósito compulsório: o banco entrega 250 sem receber título ou pactuar retorno."
        ],
        "answer": 1,
        "explanation": "As setas descritas mostram venda inicial pelo BCB e recompra combinada. A ponta inicial absorve 250 da disponibilidade do banco no modelo; a de retorno entrega 253, diferença de 3. Os valores não representam taxa ou leilão real.",
        "optionRationales": [
          "Inverte os fluxos de recursos dados no enunciado.",
          "Preserva participante, direção inicial e compromisso de retorno.",
          "Ignora o acordo explícito para amanhã.",
          "Troca a compra de título com retorno por uma obrigação de recolhimento não informada."
        ]
      },
      {
        "id": "q.mpchefe.q08",
        "topicId": "banking.mp.boss",
        "prompt": "Três fichas fictícias: X — uma instituição financeira escolhe depósito remunerado no banco central, sob condições aplicáveis; Y — o banco central compra um título com compromisso de revendê-lo no prazo combinado; Z — em outro país, um programa compra ativos com reservas do banco central buscando influenciar juros mais longos, como no conceito estudado. Qual sequência classifica X, Y e Z?",
        "options": [
          "Compulsório; compra definitiva; empréstimo pessoal.",
          "QE; depósito voluntário; recolhimento obrigatório.",
          "Depósito voluntário; compromissada; programa de QE no contexto descrito.",
          "Compromissada; compulsório; depósito voluntário."
        ],
        "answer": 2,
        "explanation": "X se distingue pela escolha de depositar; Y inclui uma operação inversa pactuada; Z descreve o programa de compras apresentado no ensino de QE. A comparação não transporta a política estrangeira ao Brasil nem equipara todos os instrumentos.",
        "optionRationales": [
          "Apaga a escolha de X, o retorno de Y e a compra de ativos de Z.",
          "Troca os mecanismos e atribui obrigatoriedade não descrita.",
          "Identifica o direito, a condição e a finalidade de cada ficha.",
          "Desconsidera as características decisivas das três operações."
        ]
      },
      {
        "id": "q.mpchefe.q09",
        "topicId": "banking.mp.boss",
        "prompt": "Dois planos fictícios partem do mesmo estoque de dívida de 600, sem juros, indexação ou outros ajustes. Ambos resgatam 80 de principal. O plano A emite 80; o plano B emite 110, usando os 30 adicionais para outros pagamentos. Quais são os estoques finais, A e B, respectivamente?",
        "options": [
          "520 e 520.",
          "680 e 710.",
          "600 e 600.",
          "600 e 630."
        ],
        "answer": 3,
        "explanation": "Plano A: 600 − 80 + 80 = 600. Plano B: 600 − 80 + 110 = 630. Emitir exatamente o principal resgatado recompõe o financiamento; a emissão adicional de B aumenta o estoque no modelo. O uso dos recursos não elimina a obrigação emitida.",
        "optionRationales": [
          "Considera os resgates e ignora ambas as emissões.",
          "Considera as emissões e ignora os resgates.",
          "Trata a emissão adicional de B como se não criasse obrigação.",
          "Considera estoque inicial, resgate e emissão em cada plano."
        ]
      },
      {
        "id": "q.mpchefe.q10",
        "topicId": "banking.mp.boss",
        "prompt": "Título fictício com pagamento único de 150 no vencimento: Dora comprou-o na emissão por 144, sem cupons ou outros pagamentos. Antes do vencimento, aceita vendê-lo a Enzo por 141. Desconsidere custos e tributos. Qual leitura descreve essa segunda negociação?",
        "options": [
          "O emissor capta mais 141 e Dora continua titular do mesmo título.",
          "Dora recebe 141 e realiza diferença bruta de −3 em relação à compra; Enzo passa a deter o direito do título.",
          "Enzo recebe imediatamente 150 do emissor e Dora ganha 6 pela revenda.",
          "Dora recebe obrigatoriamente 150 na revenda porque esse é o pagamento previsto no vencimento."
        ],
        "answer": 1,
        "explanation": "Enzo paga os 141 à vendedora Dora; 141 − 144 = −3. A troca de titular não é automaticamente nova captação do emissor. O pagamento contratual de 150 no vencimento não fixa o preço de venda antecipada.",
        "optionRationales": [
          "Confunde revenda com emissão e ignora a transferência do título.",
          "Segue o destinatário do pagamento, o resultado bruto da venda e a mudança de titular.",
          "Antecipa pagamento do emissor que não ocorreu e troca o preço efetivo da venda.",
          "Confunde pagamento no vencimento com preço negociado antes dele."
        ]
      },
      {
        "id": "q.mpchefe.q11",
        "topicId": "banking.mp.boss",
        "prompt": "O gráfico e a tabela mostram a mesma fotografia inteiramente fictícia: mesma data, moeda, convenção de taxa anual e instrumentos comparáveis por hipótese. Qual leitura respeita os pontos e os limites da informação?\n\n| Prazo remanescente (anos) | Taxa (% a.a.) |\n| --- | --- |\n| 1 | 8 |\n| 2 | 6 |\n| 3 | 7 |\n\n```mermaid\nxychart-beta\n  title \"Chefe: fotografia fictícia, não previsão\"\n  x-axis \"Prazo remanescente (anos)\" [1, 2, 3]\n  y-axis \"Taxa (% a.a.)\" 5 --> 9\n  line [8, 6, 7]\n```",
        "options": [
          "As taxas aumentam continuamente de um a três anos.",
          "A taxa de dois anos garante que a Selic será 6% no segundo ano.",
          "A taxa de três anos supera a de dois em 1 ponto percentual, mas está abaixo da de um ano.",
          "O investimento de três anos renderá exatamente 7% acumulados em todo o prazo."
        ],
        "answer": 2,
        "explanation": "Os pontos mostram 8%, 6% e 7% a.a. por prazo na mesma data. De dois para três anos a diferença é 7 − 6 = 1 ponto percentual; a taxa de três anos continua abaixo de 8%. O desenho não é uma sequência de decisões futuras nem informa retorno acumulado de 7%.",
        "optionRationales": [
          "Ignora a queda de 8% para 6% entre os dois primeiros prazos.",
          "Transforma uma taxa por prazo em garantia de política futura.",
          "Compara corretamente dois pares de pontos e suas unidades.",
          "Confunde taxa anual indicada com retorno de todo o período."
        ],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "O gráfico e a tabela mostram a mesma fotografia inteiramente fictícia: mesma data, moeda, convenção de taxa anual e instrumentos comparáveis por hipótese. Qual leitura respeita os pontos e os limites da informação?"
              }
            ]
          },
          {
            "type": "table",
            "headers": [
              "Prazo remanescente (anos)",
              "Taxa (% a.a.)"
            ],
            "rows": [
              [
                "1",
                "8"
              ],
              [
                "2",
                "6"
              ],
              [
                "3",
                "7"
              ]
            ]
          },
          {
            "type": "line-chart",
            "title": "Chefe: fotografia fictícia, não previsão",
            "xLabel": "Prazo remanescente (anos)",
            "yLabel": "Taxa (% a.a.)",
            "x": [
              1,
              2,
              3
            ],
            "y": [
              8,
              6,
              7
            ],
            "yMin": 5,
            "yMax": 9
          }
        ]
      },
      {
        "id": "q.mpchefe.q12",
        "topicId": "banking.mp.boss",
        "prompt": "Modelo fictício de capitalização composta: 300 aplicados por três anos completos a 6% efetivos ao ano, taxa fixa, com reinvestimento integral, sem custos, tributos, aportes ou retiradas. Multiplique pela nova base a cada ano e arredonde somente o montante final a duas casas. Qual resultado e leitura são corretos?",
        "options": [
          "357,30: 300 × 1,06 × 1,06 × 1,06; os 6% são anuais, não o ganho de todo o prazo.",
          "354,00: acrescentar 18% à base inicial reproduz exatamente o modelo composto.",
          "318,00: aplicar o fator 1,06 uma vez basta para os três anos.",
          "360,00: todo prazo de três anos transforma 6% anuais em 20% acumulados."
        ],
        "answer": 0,
        "explanation": "Ano 1: 318. Ano 2: 337,08. Ano 3: 357,3048, arredondado para 357,30. Reinvestimento faz o fator atuar sobre a nova base. Não se pressupõe essa convenção em um produto real; ela está expressa no modelo.",
        "optionRationales": [
          "Aplica os três fatores e arredonda apenas o montante final.",
          "Usa acréscimo simples de 18%, diferente da composição especificada.",
          "Ignora dois períodos de crescimento.",
          "Inventa uma conversão para 20% sem relação com os fatores dados."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "mpchefe-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.mpchefe.q01": [
          {
            "missionId": "banking.mp.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "banking.mp.boss",
            "sectionId": "glossario"
          },
          {
            "missionId": "banking.mp.interbancario",
            "sectionId": "interbancario"
          },
          {
            "missionId": "banking.mp.interbancario",
            "sectionId": "exemplo-varejo"
          },
          {
            "missionId": "banking.mp.mercados",
            "sectionId": "credito"
          }
        ],
        "q.mpchefe.q02": [
          {
            "missionId": "banking.mp.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "banking.mp.boss",
            "sectionId": "glossario"
          },
          {
            "missionId": "banking.mp.mercados",
            "sectionId": "capitais"
          },
          {
            "missionId": "banking.mp.mercados",
            "sectionId": "exemplo-capitais"
          }
        ],
        "q.mpchefe.q03": [
          {
            "missionId": "banking.mp.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "banking.mp.boss",
            "sectionId": "recuperacao"
          },
          {
            "missionId": "banking.mp.moeda",
            "sectionId": "instrumento"
          },
          {
            "missionId": "banking.mp.moeda",
            "sectionId": "datas"
          },
          {
            "missionId": "banking.mp.moeda",
            "sectionId": "limites"
          }
        ],
        "q.mpchefe.q04": [
          {
            "missionId": "banking.mp.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "banking.mp.boss",
            "sectionId": "glossario"
          },
          {
            "missionId": "banking.mp.inflacao",
            "sectionId": "real"
          },
          {
            "missionId": "banking.mp.inflacao",
            "sectionId": "exemplo-real"
          },
          {
            "missionId": "banking.mp.inflacao",
            "sectionId": "limites"
          }
        ],
        "q.mpchefe.q05": [
          {
            "missionId": "banking.mp.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "banking.mp.boss",
            "sectionId": "recuperacao"
          },
          {
            "missionId": "banking.mp.politica-monetaria",
            "sectionId": "objetivos"
          },
          {
            "missionId": "banking.mp.politica-monetaria",
            "sectionId": "selic"
          },
          {
            "missionId": "banking.mp.politica-monetaria",
            "sectionId": "exemplo-rotulos"
          }
        ],
        "q.mpchefe.q06": [
          {
            "missionId": "banking.mp.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "banking.mp.boss",
            "sectionId": "recuperacao"
          },
          {
            "missionId": "banking.mp.politica-monetaria",
            "sectionId": "transmissao"
          },
          {
            "missionId": "banking.mp.politica-monetaria",
            "sectionId": "exemplo-credito"
          },
          {
            "missionId": "banking.mp.politica-monetaria",
            "sectionId": "tempo"
          }
        ],
        "q.mpchefe.q07": [
          {
            "missionId": "banking.mp.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "banking.mp.boss",
            "sectionId": "glossario"
          },
          {
            "missionId": "banking.mp.instrumentos",
            "sectionId": "compromissada"
          },
          {
            "missionId": "banking.mp.instrumentos",
            "sectionId": "exemplo-absorcao"
          },
          {
            "missionId": "banking.mp.instrumentos",
            "sectionId": "comparacao"
          }
        ],
        "q.mpchefe.q08": [
          {
            "missionId": "banking.mp.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "banking.mp.boss",
            "sectionId": "recuperacao"
          },
          {
            "missionId": "banking.mp.instrumentos",
            "sectionId": "compromissada"
          },
          {
            "missionId": "banking.mp.qe-depositos",
            "sectionId": "qe"
          },
          {
            "missionId": "banking.mp.qe-depositos",
            "sectionId": "comparar"
          },
          {
            "missionId": "banking.mp.qe-depositos",
            "sectionId": "depositos"
          }
        ],
        "q.mpchefe.q09": [
          {
            "missionId": "banking.mp.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "banking.mp.boss",
            "sectionId": "glossario"
          },
          {
            "missionId": "banking.mp.divida-publica",
            "sectionId": "fluxo-estoque"
          },
          {
            "missionId": "banking.mp.divida-publica",
            "sectionId": "exemplo-fluxo"
          },
          {
            "missionId": "banking.mp.divida-publica",
            "sectionId": "exemplo-estoque"
          }
        ],
        "q.mpchefe.q10": [
          {
            "missionId": "banking.mp.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "banking.mp.boss",
            "sectionId": "glossario"
          },
          {
            "missionId": "banking.mp.divida-publica",
            "sectionId": "emissao-negociacao"
          },
          {
            "missionId": "banking.mp.divida-publica",
            "sectionId": "exemplo-secundario"
          },
          {
            "missionId": "banking.mp.divida-publica",
            "sectionId": "remuneracao"
          },
          {
            "missionId": "banking.mp.divida-publica",
            "sectionId": "exemplo-preco"
          }
        ],
        "q.mpchefe.q11": [
          {
            "missionId": "banking.mp.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "banking.mp.boss",
            "sectionId": "glossario"
          },
          {
            "missionId": "banking.mp.curva-juros",
            "sectionId": "eixos"
          },
          {
            "missionId": "banking.mp.curva-juros",
            "sectionId": "formas"
          },
          {
            "missionId": "banking.mp.curva-juros",
            "sectionId": "exemplo-futuro"
          },
          {
            "missionId": "banking.mp.curva-juros",
            "sectionId": "exemplo-comparar"
          }
        ],
        "q.mpchefe.q12": [
          {
            "missionId": "banking.mp.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "banking.mp.boss",
            "sectionId": "glossario"
          },
          {
            "missionId": "banking.mp.curva-juros",
            "sectionId": "acumulado"
          },
          {
            "missionId": "banking.mp.curva-juros",
            "sectionId": "exemplo-acumulado"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.mpchefe",
      "blockId": "banking.markets-policy",
      "prerequisiteId": "banking.mp.revisao",
      "parametersApproved": false
    }
  }
]);
export const MP_SOURCES = Object.freeze([
  {
    "id": "mp.mp01.cvm.sfn.segmentos",
    "label": "CVM — Funcionamento do Sistema Financeiro Nacional",
    "url": "https://www.gov.br/investidor/pt-br/investir/como-investir/conheca-o-mercado-de-capitais/funcionamento-do-sistema-financeiro-nacional",
    "version": "Página publicada em 25/10/2022",
    "checkedAt": "2026-09-30",
    "locator": "Parágrafos de segmentação, monetário, câmbio e crédito"
  },
  {
    "id": "mp.mp01.cvm.valores.papeis",
    "label": "CVM — O Mercado de Valores Mobiliários",
    "url": "https://www.gov.br/investidor/pt-br/investir/como-investir/conheca-o-mercado-de-capitais/o-mercado-de-valores-mobiliarios",
    "version": "Página publicada em 25/10/2022",
    "checkedAt": "2026-09-30",
    "locator": "Comparação crédito/capitais; prestação de serviços; dívida e participação"
  },
  {
    "id": "mp.mp01.bcb.credito.2026",
    "label": "BCB — Caderno de Educação Financeira",
    "url": "https://www.bcb.gov.br/content/cidadaniafinanceira/documentos_cidadania/Cuidando_do_seu_dinheiro_Gestao_de_Financas_Pessoais/caderno_cidadania_financeira.pdf",
    "version": "2026, 2ª edição revisada",
    "checkedAt": "2026-09-30",
    "locator": "Seções 3.1 e 3.4, páginas impressas 32 e 35"
  },
  {
    "id": "mp.mp01.cvm.primario.secundario",
    "label": "CVM — Mercado Primário x Mercado Secundário",
    "url": "https://www.gov.br/investidor/pt-br/investir/como-investir/como-funciona-a-bolsa/mercado-primario-x-mercado-secundario",
    "version": "Página publicada em 26/08/2022",
    "checkedAt": "2026-09-30",
    "locator": "Parágrafos sobre novas emissões e negociação entre investidores"
  },
  {
    "id": "mp.mp02.bce.moeda.funcoes",
    "label": "Banco Central Europeu — O que é a moeda?",
    "url": "https://www.ecb.europa.eu/ecb-and-you/explainers/tell-me-more/html/what_is_money.pt.html",
    "version": "Atualização de 19/06/2024",
    "checkedAt": "2026-09-30",
    "locator": "Como a moeda é utilizada: três funções. Usado somente para conceitos gerais, não para regras brasileiras ou emissão do euro."
  },
  {
    "id": "mp.mp02.bcb.pagamento.conceito",
    "label": "BCB — O que é instituição de pagamento?",
    "url": "https://www.bcb.gov.br/pre/composicao/instpagamento.asp?frame=1",
    "version": "Página educacional legada, sem data editorial exibida",
    "checkedAt": "2026-09-30",
    "locator": "Instrumento de pagamento, movimentação sem moeda em espécie e registro de transações. Normas listadas nessa página não são tratadas como vigentes nesta aula."
  },
  {
    "id": "mp.mp02.bcb.liquidez.2026",
    "label": "BCB — Caderno de Educação Financeira",
    "url": "https://www.bcb.gov.br/content/cidadaniafinanceira/documentos_cidadania/Cuidando_do_seu_dinheiro_Gestao_de_Financas_Pessoais/caderno_cidadania_financeira.pdf",
    "version": "2026, 2ª edição revisada",
    "checkedAt": "2026-09-30",
    "locator": "Seções 2.1, orçamento; 3.1, crédito; 5.3, liquidez de investimentos, páginas impressas 23, 32 e 60–61"
  },
  {
    "id": "mp.mp03.bce.inflacao.conceito",
    "label": "Banco Central Europeu — O que é a inflação?",
    "url": "https://www.ecb.europa.eu/ecb-and-you/explainers/tell-me-more/html/what_is_inflation.pt.html",
    "version": "Página explicativa, sem data editorial exibida",
    "checkedAt": "2026-09-30",
    "locator": "Aumento geral dos preços, ponderação, hábitos de consumo e comparação de cestas. Sem transpor IHPC, meta ou números europeus ao Brasil."
  },
  {
    "id": "mp.mp03.bcb.juros.2026",
    "label": "BCB — Caderno de Educação Financeira",
    "url": "https://www.bcb.gov.br/content/cidadaniafinanceira/documentos_cidadania/Cuidando_do_seu_dinheiro_Gestao_de_Financas_Pessoais/caderno_cidadania_financeira.pdf",
    "version": "2026, 2ª edição revisada",
    "checkedAt": "2026-09-30",
    "locator": "Seção 3.2, valor do dinheiro no tempo e juros, página impressa 32. Não utilizada como fonte de uma taxa de mercado."
  },
  {
    "id": "mp.mp04.br.lc179",
    "label": "Lei Complementar 179/2021",
    "url": "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp179.htm",
    "version": "Texto consultado em 30/09/2026",
    "locator": "Artigos 1º e 2º: objetivos do BCB e metas de política monetária estabelecidas pelo CMN.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mp04.bcb.selic",
    "label": "BCB — Taxa Selic",
    "url": "https://www.bcb.gov.br/controleinflacao/taxaselic",
    "version": "Página institucional consultada em 30/09/2026",
    "locator": "Definição da taxa efetiva nas compromissadas de um dia útil e atuação para alinhá-la à meta definida pelo Copom. Sem usar o valor atual.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mp04.bcb.transmissao",
    "label": "BCB — Mecanismos de transmissão da política monetária",
    "url": "https://www.bcb.gov.br/controleinflacao/transmissaopoliticamonetaria",
    "version": "Página institucional consultada em 30/09/2026",
    "locator": "Canais de consumo/investimento, câmbio, ativos, crédito e expectativas; efeitos condicionais, sem estimar magnitude ou prazo.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mp05.bcb.selic",
    "label": "BCB — Taxa Selic",
    "url": "https://www.bcb.gov.br/controleinflacao/taxaselic",
    "version": "Página institucional consultada em 30/09/2026",
    "locator": "Definição da taxa efetiva nas compromissadas de um dia útil e atuação para alinhá-la à meta definida pelo Copom. Sem usar o valor atual.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mp05.bcb.compulsorios",
    "label": "BCB — Recolhimentos compulsórios",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/recolhimentoscompulsorios",
    "version": "Página institucional consultada em 30/09/2026",
    "locator": "Recolhimento obrigatório ao BCB, liquidez e estabilidade financeira. Não utilizada para alíquotas atuais.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mp05.br.l4595",
    "label": "Lei 4.595/1964",
    "url": "https://www.planalto.gov.br/ccivil_03/leis/l4595.htm",
    "version": "Redação dos incisos V e XII do artigo 10 dada pela LC 179/2021, consultada em 30/09/2026",
    "locator": "Competências do BCB para redesconto/empréstimo e operações com títulos federais, sob regulamentação; não confundir trechos revogados com vigentes.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mp06.boe.qe",
    "label": "Bank of England — Quantitative easing",
    "url": "https://www.bankofengland.co.uk/monetary-policy/quantitative-easing",
    "version": "Página atualizada em 05/12/2025, consultada em 30/09/2026",
    "locator": "Conceito de compras de títulos com reservas e transmissão para juros mais longos; contexto britânico iniciado em março de 2009. Não transpor política, meta ou situação atual ao Brasil.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mp06.br.l14185",
    "label": "Lei 14.185/2021 — depósitos voluntários",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14185.htm",
    "version": "Lei de 14/07/2021, publicada em 15/07/2021; texto consultado em 30/09/2026",
    "locator": "Artigos 1º e 3º: autorização, remuneração definida pelo BCB e condições regulamentares; não informa taxa vigente.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mp06.bcb.selic",
    "label": "BCB — Taxa Selic",
    "url": "https://www.bcb.gov.br/controleinflacao/taxaselic",
    "version": "Página institucional consultada em 30/09/2026",
    "locator": "Definição da taxa efetiva nas compromissadas de um dia útil e atuação para alinhá-la à meta definida pelo Copom. Sem usar o valor atual.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mp06.bcb.compulsorios",
    "label": "BCB — Recolhimentos compulsórios",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/recolhimentoscompulsorios",
    "version": "Página institucional consultada em 30/09/2026",
    "locator": "Recolhimento obrigatório ao BCB, liquidez e estabilidade financeira. Não utilizada para alíquotas atuais.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mp07.stn.fiscal",
    "label": "Tesouro Nacional — Sobre Política Fiscal",
    "url": "https://www.gov.br/tesouronacional/pt-br/estatisticas-fiscais-e-planejamento/sobre-politica-fiscal",
    "version": "Atualização de 08/07/2022, consultada em 30/09/2026",
    "locator": "Receitas/despesas, fluxos/estoques e resultado primário; exemplo didático não reproduz contabilidade fiscal oficial.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mp07.br.l4320",
    "label": "Lei 4.320/1964 — orçamento e execução",
    "url": "https://www.planalto.gov.br/ccivil_03/leis/l4320.htm",
    "version": "Texto consultado em 30/09/2026",
    "locator": "Arts. 47–50, 90 e 102: limites autorizados, programação, execução e comparação entre previsão e realização. Sem apresentar processo orçamentário completo.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mp07.br.d12814",
    "label": "Decreto 12.814/2026 — títulos públicos",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2026/decreto/d12814.htm",
    "version": "Decreto de 09/01/2026, DOU de 12/01/2026; consultado em 30/09/2026",
    "locator": "Arts. 2º, 3º, 7º e 11: LTN/LFT/NTN-B/NTN-F. Arts. 31–32: revogação do Decreto 11.301/2022 e vigência na publicação. Recorte introdutório, sem listar todas as séries.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mp07.cvm.primario",
    "label": "CVM — Mercado primário x mercado secundário",
    "url": "https://www.gov.br/investidor/pt-br/investir/como-investir/como-funciona-a-bolsa/mercado-primario-x-mercado-secundario",
    "version": "Publicação de 26/08/2022, consulta reaproveitada em 30/09/2026",
    "locator": "Emissão/captação e negociação de títulos existentes; exemplos delimitados ao emissor e às contrapartes indicadas.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mp07.br.l4595",
    "label": "Lei 4.595/1964",
    "url": "https://www.planalto.gov.br/ccivil_03/leis/l4595.htm",
    "version": "Redação dos incisos V e XII do artigo 10 dada pela LC 179/2021, consultada em 30/09/2026",
    "locator": "Competências do BCB para redesconto/empréstimo e operações com títulos federais, sob regulamentação; não confundir trechos revogados com vigentes.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mp08.cvm.sfn",
    "label": "CVM — Funcionamento do Sistema Financeiro Nacional",
    "url": "https://www.gov.br/investidor/pt-br/investir/como-investir/conheca-o-mercado-de-capitais/funcionamento-do-sistema-financeiro-nacional",
    "version": "Publicação de 25/10/2022, consulta reaproveitada em 30/09/2026",
    "locator": "Segmentos monetário, de crédito, de capitais e cambial; operações entre bancos e BCB. Não descreve organograma obrigatório de um banco.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mp08.bcb.selic",
    "label": "BCB — Taxa Selic",
    "url": "https://www.bcb.gov.br/controleinflacao/taxaselic",
    "version": "Página institucional consultada em 30/09/2026",
    "locator": "Definição da taxa efetiva nas compromissadas de um dia útil e atuação para alinhá-la à meta definida pelo Copom. Sem usar o valor atual.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mp08.br.l4595",
    "label": "Lei 4.595/1964",
    "url": "https://www.planalto.gov.br/ccivil_03/leis/l4595.htm",
    "version": "Redação dos incisos V e XII do artigo 10 dada pela LC 179/2021, consultada em 30/09/2026",
    "locator": "Competências do BCB para redesconto/empréstimo e operações com títulos federais, sob regulamentação; não confundir trechos revogados com vigentes.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mp09.bce.curva",
    "label": "BCE — Euro area yield curves",
    "url": "https://www.ecb.europa.eu/stats/financial_markets_and_interest_rates/euro_area_yield_curves/html/index.en.html",
    "version": "Página metodológica consultada em 30/09/2026",
    "locator": "Definição da relação entre taxas e prazos remanescentes; expectativas e riscos. Apenas conceitos gerais, sem importar taxas ou método europeu ao Brasil.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mp09.bcb.selic",
    "label": "BCB — Taxa Selic",
    "url": "https://www.bcb.gov.br/controleinflacao/taxaselic",
    "version": "Página institucional consultada em 30/09/2026",
    "locator": "Definição da taxa efetiva nas compromissadas de um dia útil e atuação para alinhá-la à meta definida pelo Copom. Sem usar o valor atual.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mpr.cvm.sfn",
    "label": "CVM — Funcionamento do Sistema Financeiro Nacional",
    "url": "https://www.gov.br/investidor/pt-br/investir/como-investir/conheca-o-mercado-de-capitais/funcionamento-do-sistema-financeiro-nacional",
    "version": "Publicação de 25/10/2022, consulta reaproveitada em 30/09/2026",
    "locator": "Segmentos monetário, de crédito, de capitais e cambial; operações entre bancos e BCB. Não descreve organograma obrigatório de um banco.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mpr.bcb.selic",
    "label": "BCB — Taxa Selic",
    "url": "https://www.bcb.gov.br/controleinflacao/taxaselic",
    "version": "Página institucional consultada em 30/09/2026",
    "locator": "Definição da taxa efetiva nas compromissadas de um dia útil e atuação para alinhá-la à meta definida pelo Copom. Sem usar o valor atual.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mpr.bcb.transmissao",
    "label": "BCB — Mecanismos de transmissão da política monetária",
    "url": "https://www.bcb.gov.br/controleinflacao/transmissaopoliticamonetaria",
    "version": "Página institucional consultada em 30/09/2026",
    "locator": "Canais de consumo/investimento, câmbio, ativos, crédito e expectativas; efeitos condicionais, sem estimar magnitude ou prazo.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mpr.bcb.compulsorios",
    "label": "BCB — Recolhimentos compulsórios",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/recolhimentoscompulsorios",
    "version": "Página institucional consultada em 30/09/2026",
    "locator": "Recolhimento obrigatório ao BCB, liquidez e estabilidade financeira. Não utilizada para alíquotas atuais.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mpr.br.l4595",
    "label": "Lei 4.595/1964",
    "url": "https://www.planalto.gov.br/ccivil_03/leis/l4595.htm",
    "version": "Redação dos incisos V e XII do artigo 10 dada pela LC 179/2021, consultada em 30/09/2026",
    "locator": "Competências do BCB para redesconto/empréstimo e operações com títulos federais, sob regulamentação; não confundir trechos revogados com vigentes.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mpr.br.l14185",
    "label": "Lei 14.185/2021 — depósitos voluntários",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14185.htm",
    "version": "Lei de 14/07/2021, publicada em 15/07/2021; texto consultado em 30/09/2026",
    "locator": "Artigos 1º e 3º: autorização, remuneração definida pelo BCB e condições regulamentares; não informa taxa vigente.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mpr.boe.qe",
    "label": "Bank of England — Quantitative easing",
    "url": "https://www.bankofengland.co.uk/monetary-policy/quantitative-easing",
    "version": "Página atualizada em 05/12/2025, consultada em 30/09/2026",
    "locator": "Conceito de compras de títulos com reservas e transmissão para juros mais longos; contexto britânico iniciado em março de 2009. Não transpor política, meta ou situação atual ao Brasil.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mpr.stn.fiscal",
    "label": "Tesouro Nacional — Sobre Política Fiscal",
    "url": "https://www.gov.br/tesouronacional/pt-br/estatisticas-fiscais-e-planejamento/sobre-politica-fiscal",
    "version": "Atualização de 08/07/2022, consultada em 30/09/2026",
    "locator": "Receitas/despesas, fluxos/estoques e resultado primário; exemplo didático não reproduz contabilidade fiscal oficial.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mpr.br.d12814",
    "label": "Decreto 12.814/2026 — títulos públicos",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2026/decreto/d12814.htm",
    "version": "Decreto de 09/01/2026, DOU de 12/01/2026; consultado em 30/09/2026",
    "locator": "Arts. 2º, 3º, 7º e 11: LTN/LFT/NTN-B/NTN-F. Arts. 31–32: revogação do Decreto 11.301/2022 e vigência na publicação. Recorte introdutório, sem listar todas as séries.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mpr.bce.curva",
    "label": "BCE — Euro area yield curves",
    "url": "https://www.ecb.europa.eu/stats/financial_markets_and_interest_rates/euro_area_yield_curves/html/index.en.html",
    "version": "Página metodológica consultada em 30/09/2026",
    "locator": "Definição da relação entre taxas e prazos remanescentes; expectativas e riscos. Apenas conceitos gerais, sem importar taxas ou método europeu ao Brasil.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mpchefe.cvm.sfn.segmentos",
    "label": "CVM — Funcionamento do Sistema Financeiro Nacional",
    "url": "https://www.gov.br/investidor/pt-br/investir/como-investir/conheca-o-mercado-de-capitais/funcionamento-do-sistema-financeiro-nacional",
    "version": "Página publicada em 25/10/2022",
    "checkedAt": "2026-09-30",
    "locator": "Parágrafos de segmentação, monetário, câmbio e crédito"
  },
  {
    "id": "mp.mpchefe.cvm.valores.papeis",
    "label": "CVM — O Mercado de Valores Mobiliários",
    "url": "https://www.gov.br/investidor/pt-br/investir/como-investir/conheca-o-mercado-de-capitais/o-mercado-de-valores-mobiliarios",
    "version": "Página publicada em 25/10/2022",
    "checkedAt": "2026-09-30",
    "locator": "Comparação crédito/capitais; prestação de serviços; dívida e participação"
  },
  {
    "id": "mp.mpchefe.bcb.credito.2026",
    "label": "BCB — Caderno de Educação Financeira",
    "url": "https://www.bcb.gov.br/content/cidadaniafinanceira/documentos_cidadania/Cuidando_do_seu_dinheiro_Gestao_de_Financas_Pessoais/caderno_cidadania_financeira.pdf",
    "version": "2026, 2ª edição revisada",
    "checkedAt": "2026-09-30",
    "locator": "Seções 3.1 e 3.4, páginas impressas 32 e 35"
  },
  {
    "id": "mp.mpchefe.cvm.primario.secundario",
    "label": "CVM — Mercado Primário x Mercado Secundário",
    "url": "https://www.gov.br/investidor/pt-br/investir/como-investir/como-funciona-a-bolsa/mercado-primario-x-mercado-secundario",
    "version": "Página publicada em 26/08/2022",
    "checkedAt": "2026-09-30",
    "locator": "Parágrafos sobre novas emissões e negociação entre investidores"
  },
  {
    "id": "mp.mpchefe.bce.moeda.funcoes",
    "label": "Banco Central Europeu — O que é a moeda?",
    "url": "https://www.ecb.europa.eu/ecb-and-you/explainers/tell-me-more/html/what_is_money.pt.html",
    "version": "Atualização de 19/06/2024",
    "checkedAt": "2026-09-30",
    "locator": "Como a moeda é utilizada: três funções. Usado somente para conceitos gerais, não para regras brasileiras ou emissão do euro."
  },
  {
    "id": "mp.mpchefe.bcb.pagamento.conceito",
    "label": "BCB — O que é instituição de pagamento?",
    "url": "https://www.bcb.gov.br/pre/composicao/instpagamento.asp?frame=1",
    "version": "Página educacional legada, sem data editorial exibida",
    "checkedAt": "2026-09-30",
    "locator": "Instrumento de pagamento, movimentação sem moeda em espécie e registro de transações. Normas listadas nessa página não são tratadas como vigentes nesta aula."
  },
  {
    "id": "mp.mpchefe.bcb.liquidez.2026",
    "label": "BCB — Caderno de Educação Financeira",
    "url": "https://www.bcb.gov.br/content/cidadaniafinanceira/documentos_cidadania/Cuidando_do_seu_dinheiro_Gestao_de_Financas_Pessoais/caderno_cidadania_financeira.pdf",
    "version": "2026, 2ª edição revisada",
    "checkedAt": "2026-09-30",
    "locator": "Seções 2.1, orçamento; 3.1, crédito; 5.3, liquidez de investimentos, páginas impressas 23, 32 e 60–61"
  },
  {
    "id": "mp.mpchefe.bce.inflacao.conceito",
    "label": "Banco Central Europeu — O que é a inflação?",
    "url": "https://www.ecb.europa.eu/ecb-and-you/explainers/tell-me-more/html/what_is_inflation.pt.html",
    "version": "Página explicativa, sem data editorial exibida",
    "checkedAt": "2026-09-30",
    "locator": "Aumento geral dos preços, ponderação, hábitos de consumo e comparação de cestas. Sem transpor IHPC, meta ou números europeus ao Brasil."
  },
  {
    "id": "mp.mpchefe.bcb.juros.2026",
    "label": "BCB — Caderno de Educação Financeira",
    "url": "https://www.bcb.gov.br/content/cidadaniafinanceira/documentos_cidadania/Cuidando_do_seu_dinheiro_Gestao_de_Financas_Pessoais/caderno_cidadania_financeira.pdf",
    "version": "2026, 2ª edição revisada",
    "checkedAt": "2026-09-30",
    "locator": "Seção 3.2, valor do dinheiro no tempo e juros, página impressa 32. Não utilizada como fonte de uma taxa de mercado."
  },
  {
    "id": "mp.mpchefe.br.lc179",
    "label": "Lei Complementar 179/2021",
    "url": "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp179.htm",
    "version": "Texto consultado em 30/09/2026",
    "locator": "Artigos 1º e 2º: objetivos do BCB e metas de política monetária estabelecidas pelo CMN.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mpchefe.bcb.selic",
    "label": "BCB — Taxa Selic",
    "url": "https://www.bcb.gov.br/controleinflacao/taxaselic",
    "version": "Página institucional consultada em 30/09/2026",
    "locator": "Definição da taxa efetiva nas compromissadas de um dia útil e atuação para alinhá-la à meta definida pelo Copom. Sem usar o valor atual.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mpchefe.bcb.transmissao",
    "label": "BCB — Mecanismos de transmissão da política monetária",
    "url": "https://www.bcb.gov.br/controleinflacao/transmissaopoliticamonetaria",
    "version": "Página institucional consultada em 30/09/2026",
    "locator": "Canais de consumo/investimento, câmbio, ativos, crédito e expectativas; efeitos condicionais, sem estimar magnitude ou prazo.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mpchefe.bcb.compulsorios",
    "label": "BCB — Recolhimentos compulsórios",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/recolhimentoscompulsorios",
    "version": "Página institucional consultada em 30/09/2026",
    "locator": "Recolhimento obrigatório ao BCB, liquidez e estabilidade financeira. Não utilizada para alíquotas atuais.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mpchefe.br.l4595",
    "label": "Lei 4.595/1964",
    "url": "https://www.planalto.gov.br/ccivil_03/leis/l4595.htm",
    "version": "Redação dos incisos V e XII do artigo 10 dada pela LC 179/2021, consultada em 30/09/2026",
    "locator": "Competências do BCB para redesconto/empréstimo e operações com títulos federais, sob regulamentação; não confundir trechos revogados com vigentes.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mpchefe.boe.qe",
    "label": "Bank of England — Quantitative easing",
    "url": "https://www.bankofengland.co.uk/monetary-policy/quantitative-easing",
    "version": "Página atualizada em 05/12/2025, consultada em 30/09/2026",
    "locator": "Conceito de compras de títulos com reservas e transmissão para juros mais longos; contexto britânico iniciado em março de 2009. Não transpor política, meta ou situação atual ao Brasil.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mpchefe.br.l14185",
    "label": "Lei 14.185/2021 — depósitos voluntários",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14185.htm",
    "version": "Lei de 14/07/2021, publicada em 15/07/2021; texto consultado em 30/09/2026",
    "locator": "Artigos 1º e 3º: autorização, remuneração definida pelo BCB e condições regulamentares; não informa taxa vigente.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mpchefe.stn.fiscal",
    "label": "Tesouro Nacional — Sobre Política Fiscal",
    "url": "https://www.gov.br/tesouronacional/pt-br/estatisticas-fiscais-e-planejamento/sobre-politica-fiscal",
    "version": "Atualização de 08/07/2022, consultada em 30/09/2026",
    "locator": "Receitas/despesas, fluxos/estoques e resultado primário; exemplo didático não reproduz contabilidade fiscal oficial.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mpchefe.br.l4320",
    "label": "Lei 4.320/1964 — orçamento e execução",
    "url": "https://www.planalto.gov.br/ccivil_03/leis/l4320.htm",
    "version": "Texto consultado em 30/09/2026",
    "locator": "Arts. 47–50, 90 e 102: limites autorizados, programação, execução e comparação entre previsão e realização. Sem apresentar processo orçamentário completo.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mpchefe.br.d12814",
    "label": "Decreto 12.814/2026 — títulos públicos",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2026/decreto/d12814.htm",
    "version": "Decreto de 09/01/2026, DOU de 12/01/2026; consultado em 30/09/2026",
    "locator": "Arts. 2º, 3º, 7º e 11: LTN/LFT/NTN-B/NTN-F. Arts. 31–32: revogação do Decreto 11.301/2022 e vigência na publicação. Recorte introdutório, sem listar todas as séries.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mpchefe.cvm.primario",
    "label": "CVM — Mercado primário x mercado secundário",
    "url": "https://www.gov.br/investidor/pt-br/investir/como-investir/como-funciona-a-bolsa/mercado-primario-x-mercado-secundario",
    "version": "Publicação de 26/08/2022, consulta reaproveitada em 30/09/2026",
    "locator": "Emissão/captação e negociação de títulos existentes; exemplos delimitados ao emissor e às contrapartes indicadas.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mpchefe.cvm.sfn",
    "label": "CVM — Funcionamento do Sistema Financeiro Nacional",
    "url": "https://www.gov.br/investidor/pt-br/investir/como-investir/conheca-o-mercado-de-capitais/funcionamento-do-sistema-financeiro-nacional",
    "version": "Publicação de 25/10/2022, consulta reaproveitada em 30/09/2026",
    "locator": "Segmentos monetário, de crédito, de capitais e cambial; operações entre bancos e BCB. Não descreve organograma obrigatório de um banco.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "mp.mpchefe.bce.curva",
    "label": "BCE — Euro area yield curves",
    "url": "https://www.ecb.europa.eu/stats/financial_markets_and_interest_rates/euro_area_yield_curves/html/index.en.html",
    "version": "Página metodológica consultada em 30/09/2026",
    "locator": "Definição da relação entre taxas e prazos remanescentes; expectativas e riscos. Apenas conceitos gerais, sem importar taxas ou método europeu ao Brasil.",
    "checkedAt": "2026-09-30"
  }
]);
