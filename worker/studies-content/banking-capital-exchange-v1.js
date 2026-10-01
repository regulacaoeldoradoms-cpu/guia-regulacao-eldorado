// Gerado por node worker/scripts/studies-ce-candidate.mjs --write. Não editar.
// Fonte editorial #570; candidato desativado, sem autorização de publicação.
export const CE_MISSIONS = Object.freeze([
  {
    "id": "banking.ce.instrumentos",
    "topicId": "banking.ce.instrumentos",
    "contentVersion": 1,
    "order": 38,
    "title": "Emissão, revenda e destino dos recursos",
    "shortTitle": "CE-01",
    "kind": "lesson",
    "objective": "Distinguir os direitos básicos de ação e dívida, identificar quem recebe recursos na emissão/revenda e resolver casos simples sem presumir garantia ou informação ausente.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 25,
    "publication": {
      "status": "draft",
      "releaseId": "capital-exchange-intro-r1",
      "releaseSequence": 4,
      "changeImpact": "new"
    },
    "sourceIds": [
      "ce.ce01.cvm.ce.mercado",
      "ce.ce01.cvm.ce.ofertas",
      "ce.ce01.cvm.ce.acoes",
      "ce.ce01.cvm.ce.debentures"
    ],
    "sections": [
      {
        "id": "inicio",
        "type": "explanation",
        "heading": "1. Siga o dinheiro de cada negócio",
        "body": "Na [introdução aos mercados](mp-01-v1.md#capitais), vimos que uma companhia pode captar recursos com ações ou títulos de dívida. Agora vamos separar dois acontecimentos: colocar instrumentos novos no mercado e negociar instrumentos que já pertencem a alguém. A pergunta central é: quem recebe o dinheiro desta operação? Leia em conjunto quem vende, o que vende e se há emissão nova. Todos os nomes e valores a seguir são fictícios.",
        "sourceIds": [],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "Na "
              },
              {
                "text": "introdução aos mercados",
                "missionId": "banking.mp.mercados",
                "sectionId": "capitais",
                "wholeLesson": false
              },
              {
                "text": ", vimos que uma companhia pode captar recursos com ações ou títulos de dívida. Agora vamos separar dois acontecimentos: colocar instrumentos novos no mercado e negociar instrumentos que já pertencem a alguém. A pergunta central é: quem recebe o dinheiro desta operação? Leia em conjunto quem vende, o que vende e se há emissão nova. Todos os nomes e valores a seguir são fictícios."
              }
            ]
          }
        ]
      },
      {
        "id": "partes",
        "type": "explanation",
        "heading": "2. Emissor, investidor e vendedor",
        "body": "Emissor é quem cria o instrumento. Investidor é quem aplica recursos e adquire os direitos correspondentes. Vendedor é quem entrega o instrumento em determinada negociação. Esses papéis não são sinônimos: uma companhia pode emitir ações; anos depois, um acionista pode vender as suas ações a outro investidor. Nessa revenda, a companhia continua sendo a emissora, embora não seja quem está vendendo.",
        "sourceIds": [
          "ce.ce01.cvm.ce.mercado",
          "ce.ce01.cvm.ce.ofertas"
        ]
      },
      {
        "id": "direitos",
        "type": "explanation",
        "heading": "3. O instrumento define a relação",
        "body": "Ação representa uma parcela do capital social: quem a adquire torna-se acionista, participante do capital da companhia. Não é uma promessa de devolver o preço pago em uma data combinada; pode haver ganho ou perda. Uma debênture, por sua vez, representa dívida da companhia emissora. Seu titular é credor, com direitos definidos nas condições de emissão. Ter direito a receber não significa receber sem risco. Nesta aula usamos debênture simples, sem conversão em ações; as demais características ficam para outra unidade.",
        "sourceIds": [
          "ce.ce01.cvm.ce.acoes",
          "ce.ce01.cvm.ce.debentures"
        ]
      },
      {
        "id": "exemplo-direitos",
        "type": "worked-example",
        "heading": "4. Exemplo resolvido: a mesma companhia, relações diferentes",
        "body": "A companhia fictícia Aurora apresenta dois instrumentos: ações e debêntures simples. Lia adquire ações; Rui adquire debêntures. Passo 1: identifique o instrumento, sem olhar primeiro o valor aplicado. Passo 2: associe ação à participação e debênture à dívida. Passo 3: Lia é acionista; Rui é credor da Aurora. Não se pode concluir que Lia tem juros contratuais garantidos, nem que Rui virou sócio apenas porque financiou a mesma companhia. A distinção vale mesmo que ambos tenham aplicado R$1.000.",
        "sourceIds": [
          "ce.ce01.cvm.ce.acoes",
          "ce.ce01.cvm.ce.debentures"
        ]
      },
      {
        "id": "mercados",
        "type": "explanation",
        "heading": "5. Emissão nova e negociação posterior",
        "body": "Na colocação primária, a companhia emite novos instrumentos e capta os recursos correspondentes. Na negociação secundária aqui estudada, um investidor vende instrumentos já existentes a outro: o dinheiro da venda cabe ao vendedor. A companhia não capta esse valor só por ser a emissora. Revenda não cria automaticamente novas ações. Essas palavras descrevem a operação, não uma classificação permanente da pessoa: alguém pode comprar na emissão e vender mais tarde.",
        "sourceIds": [
          "ce.ce01.cvm.ce.ofertas"
        ]
      },
      {
        "id": "exemplo-emissao",
        "type": "worked-example",
        "heading": "6. Exemplo resolvido: recursos para a companhia",
        "body": "Aurora emite 100 novas ações a R$20 cada, todas adquiridas por investidores. Suponha ausência de custos e tributos no exemplo. Passo 1: há ações novas emitidas pela companhia. Passo 2: multiplique quantidade por preço: 100 × R$20 = R$2.000. Passo 3: a captação da companhia é R$2.000 nesta operação primária. Esse número não informa o valor de toda a empresa, pois não foi dado o total de ações já existentes; tampouco promete rentabilidade ao comprador.",
        "sourceIds": [
          "ce.ce01.cvm.ce.ofertas"
        ]
      },
      {
        "id": "exemplo-revenda",
        "type": "worked-example",
        "heading": "7. Exemplo resolvido: recursos para a vendedora",
        "body": "Lia comprou 10 ações a R$20 cada e depois vende as mesmas 10 ações a Rui por R$23 cada. Desconsidere custos, tributos e outros recebimentos. Passo 1: são ações existentes; há revenda. Passo 2: Rui paga 10 × R$23 = R$230 a Lia. A companhia não recebe esse pagamento. Passo 3: Lia havia desembolsado R$200; a diferença entre venda e compra é R$230 − R$200 = R$30. R$230 é o valor da venda, não o ganho. Isso descreve o caso já realizado, não prevê o preço da próxima negociação.",
        "sourceIds": [
          "ce.ce01.cvm.ce.ofertas",
          "ce.ce01.cvm.ce.acoes"
        ]
      },
      {
        "id": "mista",
        "type": "explanation",
        "heading": "8. Uma oferta pode reunir duas partes",
        "body": "Oferta mista combina uma parcela primária e outra secundária. Para resolver um caso, separe as quantidades novas e as já existentes antes de somar valores. O total movimentado não é necessariamente o total captado pela companhia. A parte vendida por acionistas pertence aos vendedores, observadas as condições da oferta. Não vamos tratar de ritos de registro ou documentos obrigatórios nesta unidade.",
        "sourceIds": [
          "ce.ce01.cvm.ce.ofertas"
        ]
      },
      {
        "id": "exemplo-mista",
        "type": "worked-example",
        "heading": "9. Exemplo resolvido: repartir o total",
        "body": "Em uma oferta fictícia, 60 ações novas da companhia e 40 ações existentes de um acionista são vendidas por R$10 cada. Suponha ausência de custos e tributos. Passo 1: parcela primária: 60 × R$10 = R$600 para a companhia. Passo 2: parcela secundária: 40 × R$10 = R$400 para o acionista vendedor. Passo 3: R$600 + R$400 = R$1.000 movimentados no total. O erro seria atribuir os R$1.000 inteiros à companhia. A mistura não impede analisar cada parcela.",
        "sourceIds": [
          "ce.ce01.cvm.ce.ofertas"
        ]
      },
      {
        "id": "servico-limites",
        "type": "explanation",
        "heading": "10. Distribuir não é assumir a dívida",
        "body": "Corretoras e outras instituições podem prestar serviços na colocação ou negociação. Sua presença não muda, por si só, os direitos do instrumento. Distribuir debêntures não torna a distribuidora responsável pelo pagamento da dívida da emissora aos investidores. Isso não elimina as responsabilidades próprias do serviço prestado; apenas separa os papéis. Também não basta ver o nome de uma companhia numa tela para concluir que a compra financia uma emissão nova. Se o enunciado não disser se são instrumentos novos ou existentes, falta informação para classificar a operação.",
        "sourceIds": [
          "ce.ce01.cvm.ce.mercado"
        ]
      },
      {
        "id": "glossario",
        "type": "glossary",
        "heading": "11. Vocabulário para consultar",
        "body": "Emissão: criação dos instrumentos pelo emissor. Acionista: titular de ações, participante do capital. Debenturista: titular de debêntures, credor da emissora. Captação: obtenção de recursos pela companhia no caso estudado. Revenda: venda de instrumento já existente por seu titular. Primária/secundária: classificação da operação conforme emissão/destino dos recursos. Oferta mista: reunião das duas parcelas. Valor da venda: quantidade multiplicada pelo preço; não confundir com a diferença entre recebimento e desembolso.",
        "sourceIds": []
      },
      {
        "id": "resumo",
        "type": "summary",
        "heading": "12. Reconstrua antes de responder",
        "body": "Para cada caso, escreva três linhas: instrumento e direito; existência ou não de emissão nova; destinatário do pagamento. Quando houver números, separe valor movimentado, captação da companhia e diferença obtida pelo vendedor. Se faltar informação, diga qual dado falta, sem inventá-lo. Ao errar uma questão, retorne à seção indicada, explique a confusão e refaça o caminho com os mesmos dados. Esta é prática exposta, não avaliação independente ou comprovação de retenção.",
        "sourceIds": []
      }
    ],
    "recall": [
      "Explique por que emissor e vendedor podem ser pessoas diferentes.",
      "Desenhe o caminho do pagamento na emissão e na revenda; depois confira as contas.",
      "Separe participação, dívida e serviço de distribuição.",
      "Releia a seção indicada pelo erro e refaça a classificação antes de calcular."
    ],
    "questions": [
      {
        "id": "q.ce01.q01",
        "topicId": "banking.ce.instrumentos",
        "prompt": "Mara adquiriu ações da companhia fictícia Ponte. Considerando somente esse instrumento, qual relação foi estabelecida?",
        "options": [
          "Mara tornou-se acionista, participante do capital da companhia.",
          "Mara concedeu um empréstimo com devolução obrigatória do preço pago em data certa.",
          "Mara passou a ser a distribuidora dos títulos da companhia.",
          "Mara adquiriu debêntures simples, pois toda aplicação gera o mesmo direito."
        ],
        "answer": 0,
        "explanation": "A ação representa participação no capital; sua aquisição não se confunde com um título de dívida.",
        "optionRationales": [
          "Relaciona corretamente ação e participação.",
          "Transforma participação em dívida com condições não fornecidas.",
          "Confunde a pessoa que investe com quem presta o serviço de distribuição.",
          "Troca o instrumento descrito; ação e debênture têm relações diferentes."
        ]
      },
      {
        "id": "q.ce01.q02",
        "topicId": "banking.ce.instrumentos",
        "prompt": "Uma companhia emitiu debêntures simples e Caio tornou-se titular delas. Qual afirmação descreve o caso?",
        "options": [
          "Caio é necessariamente acionista porque aportou recursos.",
          "Caio é credor da emissora; o direito de receber não elimina o risco de descumprimento.",
          "A companhia deixou de ser devedora quando uma corretora distribuiu os títulos.",
          "O pagamento depende apenas de Caio continuar sócio."
        ],
        "answer": 1,
        "explanation": "A debênture simples estabelece uma relação de dívida, sem conversão em ações no recorte estudado.",
        "optionRationales": [
          "Financiar por dívida não torna o credor acionista.",
          "Identifica a relação e separa direito contratual de pagamento sem risco.",
          "Distribuição não transfere automaticamente a dívida da emissora.",
          "Pressupõe uma condição de sócio que o instrumento do caso não criou."
        ]
      },
      {
        "id": "q.ce01.q03",
        "topicId": "banking.ce.instrumentos",
        "prompt": "A companhia Norte emite 50 ações novas por R$12 cada, integralmente adquiridas na oferta. Sem custos ou tributos no caso, qual é a captação dessa operação?",
        "options": [
          "R$12, pois quantidade não altera a captação.",
          "R$50, pois basta contar as ações.",
          "R$600, destinados à companhia emissora.",
          "R$600, necessariamente destinados a um acionista que já possuía essas ações."
        ],
        "answer": 2,
        "explanation": "50 × R$12 = R$600. O enunciado informa emissão nova, portanto os recursos correspondentes são captados pela companhia.",
        "optionRationales": [
          "Usa o preço unitário como se fosse o total.",
          "Usa a quantidade como se fosse valor em reais.",
          "Calcula o total e identifica corretamente o destinatário.",
          "Aplica a lógica da revenda a uma emissão explicitamente nova."
        ]
      },
      {
        "id": "q.ce01.q04",
        "topicId": "banking.ce.instrumentos",
        "prompt": "Nina comprou 8 ações a R$15 e vendeu as mesmas 8 a outro investidor por R$18. Ignore custos, tributos e outros recebimentos. Qual leitura está correta?",
        "options": [
          "A companhia recebeu R$144, porque seu nome identifica as ações.",
          "Nina ganhou R$144, independentemente do valor que pagou.",
          "Foram criadas 8 novas ações na revenda.",
          "Nina recebeu R$144 e teve diferença positiva de R$24; a companhia não captou o valor dessa revenda."
        ],
        "answer": 3,
        "explanation": "Venda: 8 × R$18 = R$144. Compra: 8 × R$15 = R$120. Diferença: R$24. O dinheiro dessa negociação vai à vendedora.",
        "optionRationales": [
          "Confunde emissora com destinatária do pagamento na revenda.",
          "Trata recebimento total como ganho, omitindo o desembolso anterior.",
          "A transferência das ações existentes não é emissão nova.",
          "Separa valor da venda, diferença obtida e destinatário."
        ]
      },
      {
        "id": "q.ce01.q05",
        "topicId": "banking.ce.instrumentos",
        "prompt": "Uma oferta combina 30 ações novas e 20 ações existentes de um acionista vendedor, todas a R$40. Sem custos ou tributos, como se repartem os R$2.000 movimentados?",
        "options": [
          "R$1.200 para a companhia e R$800 para o acionista vendedor.",
          "R$2.000 para a companhia e nada para o acionista.",
          "R$800 para a companhia e R$1.200 para o acionista.",
          "R$1.000 para cada um, pois toda oferta mista divide o dinheiro igualmente."
        ],
        "answer": 0,
        "explanation": "A parcela nova capta 30 × R$40 = R$1.200; a existente corresponde a 20 × R$40 = R$800 para o vendedor.",
        "optionRationales": [
          "Aplica quantidade e preço a cada parcela.",
          "Ignora a parcela secundária declarada.",
          "Inverte as quantidades novas e existentes.",
          "Inventa divisão igual, contrariando os dados."
        ]
      },
      {
        "id": "q.ce01.q06",
        "topicId": "banking.ce.instrumentos",
        "prompt": "Uma instituição atua somente como distribuidora de debêntures de Aurora. O caso não informa garantia adicional. Quem tem a obrigação de pagar a dívida representada por elas?",
        "options": [
          "A distribuidora, apenas porque apresentou o produto.",
          "Aurora, a companhia emissora.",
          "O comprador, porque toda operação de investimento o torna devedor.",
          "Qualquer acionista individual, automaticamente pelo valor integral."
        ],
        "answer": 1,
        "explanation": "A dívida é da emissora. A atuação como distribuidora não a transfere automaticamente para quem presta o serviço.",
        "optionRationales": [
          "Confunde distribuição com assunção da obrigação da emissora.",
          "Identifica a parte devedora sem inventar garantia.",
          "Inverte as posições de credor e devedor.",
          "Troca a companhia por um acionista individual sem fundamento no caso."
        ]
      },
      {
        "id": "q.ce01.q07",
        "topicId": "banking.ce.instrumentos",
        "prompt": "Uma tela informa apenas: 'Compra de 10 ações da companhia Luz a R$9 cada'. Não informa emissão nova nem identidade do vendedor. O que se pode concluir sobre primária/secundária?",
        "options": [
          "É primária, porque aparece o nome da companhia.",
          "É secundária, porque toda compra em tela é revenda.",
          "Falta saber se as ações são novas ou existentes e quem recebe o pagamento.",
          "É oferta mista, porque há quantidade e preço."
        ],
        "answer": 2,
        "explanation": "Nome, quantidade, preço e canal não esclarecem sozinhos se há colocação nova ou revenda.",
        "optionRationales": [
          "O nome identifica a emissora, não resolve a operação.",
          "O canal não prova que os instrumentos já pertenciam a um investidor.",
          "Aponta os dados que distinguem as hipóteses ensinadas.",
          "Quantidade e preço não demonstram duas parcelas diferentes."
        ]
      },
      {
        "id": "q.ce01.q08",
        "topicId": "banking.ce.instrumentos",
        "prompt": "Considere duas operações sem custos: I, a companhia Vale Azul emite 10 ações novas por R$30 cada; II, uma investidora vende a outra 5 ações já existentes da mesma companhia por R$32 cada. Qual total a companhia capta nessas duas operações?",
        "options": [
          "R$460: toda negociação com suas ações entra em seu caixa.",
          "R$160: apenas a revenda é captação da companhia.",
          "R$140: deve-se subtrair o valor da revenda da emissão.",
          "R$300: a emissão capta esse valor; os R$160 da revenda cabem à vendedora."
        ],
        "answer": 3,
        "explanation": "I capta 10 × R$30 = R$300. II movimenta 5 × R$32 = R$160 entre investidoras. Não se soma nem subtrai II para obter a captação da emissora neste caso.",
        "optionRationales": [
          "Soma fluxos com destinatários diferentes.",
          "Inverte a emissão e a revenda.",
          "Trata uma negociação entre investidoras como saída da companhia.",
          "Classifica cada operação antes de somar a captação da companhia."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "ce01-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.ce01.q01": [
          {
            "missionId": "banking.ce.instrumentos",
            "sectionId": "direitos"
          },
          {
            "missionId": "banking.ce.instrumentos",
            "sectionId": "exemplo-direitos"
          }
        ],
        "q.ce01.q02": [
          {
            "missionId": "banking.ce.instrumentos",
            "sectionId": "direitos"
          },
          {
            "missionId": "banking.ce.instrumentos",
            "sectionId": "servico-limites"
          }
        ],
        "q.ce01.q03": [
          {
            "missionId": "banking.ce.instrumentos",
            "sectionId": "mercados"
          },
          {
            "missionId": "banking.ce.instrumentos",
            "sectionId": "exemplo-emissao"
          }
        ],
        "q.ce01.q04": [
          {
            "missionId": "banking.ce.instrumentos",
            "sectionId": "exemplo-revenda"
          }
        ],
        "q.ce01.q05": [
          {
            "missionId": "banking.ce.instrumentos",
            "sectionId": "mista"
          },
          {
            "missionId": "banking.ce.instrumentos",
            "sectionId": "exemplo-mista"
          }
        ],
        "q.ce01.q06": [
          {
            "missionId": "banking.ce.instrumentos",
            "sectionId": "servico-limites"
          }
        ],
        "q.ce01.q07": [
          {
            "missionId": "banking.ce.instrumentos",
            "sectionId": "partes"
          },
          {
            "missionId": "banking.ce.instrumentos",
            "sectionId": "servico-limites"
          }
        ],
        "q.ce01.q08": [
          {
            "missionId": "banking.ce.instrumentos",
            "sectionId": "mercados"
          },
          {
            "missionId": "banking.ce.instrumentos",
            "sectionId": "exemplo-emissao"
          },
          {
            "missionId": "banking.ce.instrumentos",
            "sectionId": "exemplo-revenda"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.ce01",
      "blockId": "banking.capital-exchange",
      "prerequisiteId": "banking.pc.boss",
      "parametersApproved": false
    }
  },
  {
    "id": "banking.ce.acoes",
    "topicId": "banking.ce.acoes",
    "contentVersion": 1,
    "order": 39,
    "title": "Ações, participação e retorno",
    "shortTitle": "CE-02",
    "kind": "lesson",
    "objective": "Ler participação e retorno de ações e distinguir direitos básicos sem transformar preferências em ganho garantido.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "capital-exchange-intro-r1",
      "releaseSequence": 4,
      "changeImpact": "new"
    },
    "sourceIds": [
      "ce.ce02.cvm.ce.acoes",
      "ce.ce02.lei.6404"
    ],
    "sections": [
      {
        "id": "inicio",
        "type": "explanation",
        "heading": "1. Ser acionista",
        "body": "Retome [CE-01](ce-01-v1.md#direitos). A ação representa participação no capital. Cotação é o preço observado numa negociação; não é saldo garantido de uma conta. Para calcular uma participação simples, divida as ações da pessoa pelo total informado e multiplique por 100. A quantidade sozinha não informa poder de controle: espécies, classes, votos e outros acordos podem importar.",
        "sourceIds": [
          "ce.ce02.cvm.ce.acoes"
        ],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "Retome "
              },
              {
                "text": "CE-01",
                "missionId": "banking.ce.instrumentos",
                "sectionId": "direitos",
                "wholeLesson": false
              },
              {
                "text": ". A ação representa participação no capital. Cotação é o preço observado numa negociação; não é saldo garantido de uma conta. Para calcular uma participação simples, divida as ações da pessoa pelo total informado e multiplique por 100. A quantidade sozinha não informa poder de controle: espécies, classes, votos e outros acordos podem importar."
              }
            ]
          }
        ]
      },
      {
        "id": "ex-participacao",
        "type": "worked-example",
        "heading": "2. Fração do capital",
        "body": "Uma companhia tem 1.000 ações, todas de uma mesma espécie/classe, e Joana possui 50. Passo 1: 50/1.000 = 0,05. Passo 2: 0,05 × 100 = 5% do capital representado. Isso não significa 50% nem garante comando sobre as decisões. O total usado no denominador deve corresponder ao universo indicado.",
        "sourceIds": []
      },
      {
        "id": "retorno",
        "type": "explanation",
        "heading": "3. Preço e distribuição",
        "body": "O resultado de um investimento em ações pode envolver mudança no preço e pagamentos da companhia, como dividendos, observadas as condições. Nos casos desta aula, sem custos, tributos ou outros eventos, calcule: valor da venda + dividendos recebidos − valor da compra. Dividendo é uma distribuição; não é juros de um empréstimo nem proteção automática contra queda de preço. Rentabilidade do período é resultado dividido pelo desembolso inicial, multiplicado por 100.",
        "sourceIds": [
          "ce.ce02.cvm.ce.acoes"
        ]
      },
      {
        "id": "ex-ganho",
        "type": "worked-example",
        "heading": "4. Somar fluxos sem contar duas vezes",
        "body": "Uma pessoa compra 10 ações por R$20 cada, recebe ao todo R$10 de dividendos e vende todas por R$22 cada. Sem custos/tributos/outros eventos: compra R$200; venda R$220; resultado 220 + 10 − 200 = R$30. Rentabilidade: 30/200 × 100 = 15%. O valor da venda não é o lucro inteiro.",
        "sourceIds": []
      },
      {
        "id": "direitos",
        "type": "explanation",
        "heading": "5. Espécies e condições",
        "body": "Ordinárias se associam ao voto; preferenciais têm preferências/vantagens previstas na lei e no estatuto, como prioridade em dividendos ou reembolso do capital, conforme o caso. Não decore 'PN nunca vota': seu voto pode existir ou sofrer restrições; há hipóteses legais de aquisição desse direito. Participar dos lucros e fiscalizar a gestão na forma legal são exemplos de direitos essenciais. Isso não permite exigir qualquer quantia a qualquer momento. Leia a classe, o estatuto e a regra aplicável; a unidade não calcula votos nem dividendos obrigatórios.",
        "sourceIds": [
          "ce.ce02.lei.6404"
        ]
      },
      {
        "id": "ex-preferencia",
        "type": "worked-example",
        "heading": "6. Uma prioridade não vira promessa",
        "body": "O estatuto fictício de uma companhia descreve uma classe PN com prioridade no reembolso de capital na liquidação e voto restrito. Passo 1: a prioridade informada trata de liquidação. Passo 2: não transforme isso em dividendo mensal fixo. Passo 3: voto restrito também não equivale a ausência de todo direito do acionista. O caso ensina a ler a condição, sem simular um processo real de liquidação.",
        "sourceIds": [
          "ce.ce02.lei.6404"
        ]
      },
      {
        "id": "ex-perda",
        "type": "worked-example",
        "heading": "7. Receber e ainda perder",
        "body": "Compra de 5 ações por R$40 cada; venda por R$36 cada; dividendos totais R$5. Sem outros fluxos, custos ou tributos: compra R$200, venda R$180. Resultado = 180 + 5 − 200 = −R$15; −15/200 × 100 = −7,5%. Houve distribuição e, mesmo assim, resultado negativo.",
        "sourceIds": []
      },
      {
        "id": "limites",
        "type": "explanation",
        "heading": "8. Não extrapole",
        "body": "Preço maior no passado não fixa o próximo preço. Uma foto de participação não prova controle e uma previsão de dividendo não é recebimento já realizado. Os cálculos aqui usam fluxos dados e a mesma quantidade de ações, sem desdobramento, grupamento ou nova subscrição. Se esses eventos aparecerem, será preciso ajustar o caso antes de aplicar a conta simples.",
        "sourceIds": [
          "ce.ce02.cvm.ce.acoes"
        ]
      },
      {
        "id": "glossario",
        "type": "glossary",
        "heading": "9. Vocabulário",
        "body": "Acionista: titular da participação. Cotação: preço observado. Dividendo: parcela de resultado distribuída conforme condições. Estatuto: regras da companhia. Espécie/classe: distinções de direitos. Rentabilidade: resultado em relação ao valor aplicado, no período explicitado.",
        "sourceIds": []
      },
      {
        "id": "resumo",
        "type": "summary",
        "heading": "10. Recuperação",
        "body": "Primeiro identifique a participação; depois liste os fluxos e, por fim, confira a regra dos direitos. Ao errar, diga se confundiu quantidade com percentual, venda com ganho ou preferência com promessa. Retome a seção correspondente.",
        "sourceIds": []
      }
    ],
    "recall": [
      "Explique os conceitos sem consultar e confira a seção de origem.",
      "Refaça o exemplo, separando dados, hipótese e conclusão.",
      "Quando errar, nomeie a confusão e retome as seções indicadas antes de tentar novamente."
    ],
    "questions": [
      {
        "id": "q.ce02.q01",
        "topicId": "banking.ce.acoes",
        "prompt": "Lia possui 30 das 600 ações de mesma espécie/classe que formam todo o capital. Qual participação?",
        "options": [
          "30%.",
          "50%.",
          "5%.",
          "600%."
        ],
        "answer": 2,
        "explanation": "30/600 × 100 = 5%.",
        "optionRationales": [
          "Confunde quantidade com percentual.",
          "Erra uma casa decimal.",
          "Usa o total adequado.",
          "Inverte a relação."
        ]
      },
      {
        "id": "q.ce02.q02",
        "topicId": "banking.ce.acoes",
        "prompt": "Compra total R$100; venda R$115; dividendos recebidos R$5. Sem outros fluxos/custos/tributos, qual resultado?",
        "options": [
          "R$20.",
          "R$115.",
          "R$5.",
          "R$120."
        ],
        "answer": 0,
        "explanation": "115 + 5 − 100 = R$20.",
        "optionRationales": [
          "Soma recebimentos e desconta compra.",
          "Omitiu o desembolso.",
          "Omitiu a mudança de preço.",
          "Soma recebimentos sem descontar compra."
        ]
      },
      {
        "id": "q.ce02.q03",
        "topicId": "banking.ce.acoes",
        "prompt": "Uma PN tem vantagem descrita no estatuto. Isso permite afirmar que:",
        "options": [
          "nunca votará em qualquer situação.",
          "tem rendimento mensal garantido.",
          "não possui direitos essenciais.",
          "é preciso ler qual preferência e quais condições de voto se aplicam."
        ],
        "answer": 3,
        "explanation": "A vantagem não informa sozinha todos os direitos.",
        "optionRationales": [
          "Ignora hipóteses de voto.",
          "Inventa uma remuneração.",
          "Confunde restrição de voto com perda de todos os direitos.",
          "Relaciona espécie e condições."
        ]
      },
      {
        "id": "q.ce02.q04",
        "topicId": "banking.ce.acoes",
        "prompt": "Compra R$300; venda R$270; dividendos R$12. Sem demais fluxos, qual resultado?",
        "options": [
          "R$12 positivo.",
          "R$18 negativo.",
          "R$42 positivo.",
          "R$30 positivo."
        ],
        "answer": 1,
        "explanation": "270 + 12 − 300 = −18.",
        "optionRationales": [
          "Ignora a perda no preço.",
          "Combina os dois efeitos corretamente.",
          "Soma a queda como ganho.",
          "Troca o sinal e omite dividendos."
        ]
      },
      {
        "id": "q.ce02.q05",
        "topicId": "banking.ce.acoes",
        "prompt": "Fiscalizar a gestão na forma legal é exemplo de:",
        "options": [
          "direito essencial do acionista.",
          "garantia de rentabilidade.",
          "dívida do acionista com a distribuidora.",
          "poder de fixar sozinho qualquer dividendo."
        ],
        "answer": 0,
        "explanation": "O direito tem exercício nos termos da lei.",
        "optionRationales": [
          "Distingue direito de resultado financeiro.",
          "Direito não assegura retorno.",
          "Não há tal dívida no caso.",
          "Participação não concede decisão individual ilimitada."
        ]
      },
      {
        "id": "q.ce02.q06",
        "topicId": "banking.ce.acoes",
        "prompt": "Resultado de R$40 para desembolso R$200, no período dado. Qual rentabilidade?",
        "options": [
          "40%.",
          "5%.",
          "20%.",
          "200%."
        ],
        "answer": 2,
        "explanation": "40/200 × 100 = 20%.",
        "optionRationales": [
          "Usa o resultado em reais como percentual.",
          "Inverte a divisão.",
          "Relaciona resultado ao desembolso.",
          "Usa o desembolso como percentual."
        ]
      },
      {
        "id": "q.ce02.q07",
        "topicId": "banking.ce.acoes",
        "prompt": "Uma ação valorizou no ano anterior. Qual conclusão é sustentada apenas por esse fato?",
        "options": [
          "O próximo ano repetirá a alta.",
          "Houve valorização passada; o retorno futuro permanece incerto.",
          "Seu dividendo será necessariamente fixo.",
          "Todo comprador terá o mesmo ganho."
        ],
        "answer": 1,
        "explanation": "O dado é histórico, não promessa.",
        "optionRationales": [
          "Extrapola o período.",
          "Preserva o limite da informação.",
          "Inventa condição de distribuição.",
          "Ignora preço/data de entrada e saída."
        ]
      },
      {
        "id": "q.ce02.q08",
        "topicId": "banking.ce.acoes",
        "prompt": "Um relatório informa somente que Bruno possui 100 ações. Qual informação falta para calcular sua fração do capital no caso simples?",
        "options": [
          "O nome do aplicativo.",
          "A cotação de ontem.",
          "O banco onde recebe salário.",
          "O total de ações que compõem esse capital."
        ],
        "answer": 3,
        "explanation": "Sem o denominador, a quantidade não vira participação percentual.",
        "optionRationales": [
          "Canal não fornece o total.",
          "Preço não fornece quantidade total.",
          "Não define o universo de ações.",
          "Fornece o denominador necessário."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "ce02-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.ce02.q01": [
          {
            "missionId": "banking.ce.acoes",
            "sectionId": "ex-participacao"
          }
        ],
        "q.ce02.q02": [
          {
            "missionId": "banking.ce.acoes",
            "sectionId": "retorno"
          },
          {
            "missionId": "banking.ce.acoes",
            "sectionId": "ex-ganho"
          }
        ],
        "q.ce02.q03": [
          {
            "missionId": "banking.ce.acoes",
            "sectionId": "direitos"
          },
          {
            "missionId": "banking.ce.acoes",
            "sectionId": "ex-preferencia"
          }
        ],
        "q.ce02.q04": [
          {
            "missionId": "banking.ce.acoes",
            "sectionId": "ex-perda"
          }
        ],
        "q.ce02.q05": [
          {
            "missionId": "banking.ce.acoes",
            "sectionId": "direitos"
          }
        ],
        "q.ce02.q06": [
          {
            "missionId": "banking.ce.acoes",
            "sectionId": "ex-ganho"
          }
        ],
        "q.ce02.q07": [
          {
            "missionId": "banking.ce.acoes",
            "sectionId": "limites"
          }
        ],
        "q.ce02.q08": [
          {
            "missionId": "banking.ce.acoes",
            "sectionId": "inicio"
          },
          {
            "missionId": "banking.ce.acoes",
            "sectionId": "ex-participacao"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.ce02",
      "blockId": "banking.capital-exchange",
      "prerequisiteId": "banking.ce.instrumentos",
      "parametersApproved": false
    }
  },
  {
    "id": "banking.ce.divida",
    "topicId": "banking.ce.divida",
    "contentVersion": 1,
    "order": 40,
    "title": "Títulos de dívida e quem deve pagar",
    "shortTitle": "CE-03",
    "kind": "lesson",
    "objective": "Reconhecer emissor/devedor, forma de remuneração e prazo em títulos de dívida, sem confundir taxa contratada, liquidez e garantia.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "capital-exchange-intro-r1",
      "releaseSequence": 4,
      "changeImpact": "new"
    },
    "sourceIds": [
      "ce.ce03.cvm.ce.debentures",
      "ce.ce03.cvm.ce.bancarios",
      "ce.ce03.cvm.ce.caracteristicas"
    ],
    "sections": [
      {
        "id": "inicio",
        "type": "explanation",
        "heading": "1. Comece pelo emissor",
        "body": "Retome [a relação de dívida](ce-01-v1.md#direitos). O título identifica uma obrigação e suas condições. No CDB, o banco emissor capta recursos e assume a obrigação correspondente; a plataforma que apresenta o produto pode ser outra empresa. Na debênture simples, a companhia emissora é devedora; o investidor não se torna acionista. Identifique o emissor antes de comparar taxas.",
        "sourceIds": [
          "ce.ce03.cvm.ce.debentures",
          "ce.ce03.cvm.ce.bancarios"
        ],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "Retome "
              },
              {
                "text": "a relação de dívida",
                "missionId": "banking.ce.instrumentos",
                "sectionId": "direitos",
                "wholeLesson": false
              },
              {
                "text": ". O título identifica uma obrigação e suas condições. No CDB, o banco emissor capta recursos e assume a obrigação correspondente; a plataforma que apresenta o produto pode ser outra empresa. Na debênture simples, a companhia emissora é devedora; o investidor não se torna acionista. Identifique o emissor antes de comparar taxas."
              }
            ]
          }
        ]
      },
      {
        "id": "ex-emissor",
        "type": "worked-example",
        "heading": "2. Uma tela, dois devedores",
        "body": "A plataforma fictícia Zeta oferece um CDB do Banco Rio e uma debênture simples da Companhia Serra. Passo 1: Zeta é o canal descrito. Passo 2: no CDB, o emissor é Rio; na debênture, Serra. Passo 3: taxas iguais não tornam os riscos ou obrigações dos dois emissores idênticos.",
        "sourceIds": [
          "ce.ce03.cvm.ce.debentures",
          "ce.ce03.cvm.ce.bancarios"
        ]
      },
      {
        "id": "contrato",
        "type": "explanation",
        "heading": "3. O que ler nas condições",
        "body": "Principal é o valor emprestado; juros são remuneração; vencimento é a data prevista para cumprir a obrigação contratada. Há títulos com pagamentos intermediários, mas os exemplos abaixo pagam tudo no final. Renda fixa significa conhecer a regra de remuneração na contratação, não ausência de risco. Prefixada: taxa definida. Pós-fixada: regra vinculada a referência futura. Combinada: componente fixo e variável. O valor efetivo depende de cumprir as condições e de o devedor pagar.",
        "sourceIds": [
          "ce.ce03.cvm.ce.caracteristicas"
        ]
      },
      {
        "id": "ex-prefixada",
        "type": "worked-example",
        "heading": "4. Uma taxa para um período",
        "body": "Contrato fictício: R$1.000 por um único período, 8% nesse período, sem pagamentos intermediários. Sem custos/tributos e supondo adimplemento: juros = 1.000 × 0,08 = R$80; total = R$1.080. Não transforme 8% do período em taxa mensal ou anual sem saber sua duração. O cálculo é do valor contratado, não prova de solvência.",
        "sourceIds": []
      },
      {
        "id": "ex-indice",
        "type": "worked-example",
        "heading": "5. Regra conhecida, valor ainda variável",
        "body": "Título fictício promete, para um período, principal multiplicado pelo fator de um índice ainda não conhecido. A regra é pós-fixada. Se o fator realizado for 1,04, R$500 × 1,04 = R$520. Se for 1,02, serão R$510. A regra já existia antes; os dois valores ilustram cenários, sem escolher uma previsão. Não são taxas atuais de CDI ou Selic.",
        "sourceIds": [
          "ce.ce03.cvm.ce.caracteristicas"
        ]
      },
      {
        "id": "saida",
        "type": "explanation",
        "heading": "6. Vencimento não é disponibilidade diária",
        "body": "O vencimento e as possibilidades de saída antes dele são informações diferentes. Pode haver condições específicas de resgate/recompra ou negociação com outro investidor. Não presuma comprador, preço ou prazo de recebimento. Um título de renda fixa pode ser vendido antes do vencimento por menos que o valor aplicado. Taxa contratada, pagamento previsto e preço de negociação são grandezas distintas.",
        "sourceIds": [
          "ce.ce03.cvm.ce.caracteristicas",
          "ce.ce03.cvm.ce.debentures"
        ]
      },
      {
        "id": "ex-saida",
        "type": "worked-example",
        "heading": "7. Uma saída por valor menor",
        "body": "Uma pessoa aplicou R$1.000 em um título com pagamento contratual final de R$1.100. Antes do vencimento, vende-o a outro investidor por R$970, sem custos/tributos ou recebimentos anteriores. Resultado realizado = 970 − 1.000 = −R$30. Não recebeu os R$1.100 previstos para outra data; a venda não era pagamento final pelo emissor.",
        "sourceIds": []
      },
      {
        "id": "comparar",
        "type": "explanation",
        "heading": "8. Compare condições equivalentes",
        "body": "Uma taxa maior não resolve a comparação se período, emissor, custos, risco ou saída forem diferentes. Não some mecanicamente taxas de componentes combinados: a regra pode exigir fatores. Aqui apenas reconhecemos a estrutura; o contrato precisa informar o método. Nome do índice, sozinho, também não informa todos os termos. A aula não recomenda um produto.",
        "sourceIds": [
          "ce.ce03.cvm.ce.caracteristicas"
        ]
      },
      {
        "id": "glossario",
        "type": "glossary",
        "heading": "9. Vocabulário",
        "body": "CDB: certificado de depósito bancário. Debênture simples: dívida da companhia sem conversão em ação. Principal: valor emprestado. Indexador: referência usada na regra. Adimplemento: cumprimento da obrigação. Preço de saída: valor obtido na negociação.",
        "sourceIds": []
      },
      {
        "id": "resumo",
        "type": "summary",
        "heading": "10. Recuperação",
        "body": "Anote emissor, principal, forma de remuneração, período, pagamentos e saída. Refaça a conta apenas com hipóteses fornecidas. Ao errar, separe confusão sobre quem deve pagar daquela sobre quando e quanto será recebido.",
        "sourceIds": []
      }
    ],
    "recall": [
      "Explique os conceitos sem consultar e confira a seção de origem.",
      "Refaça o exemplo, separando dados, hipótese e conclusão.",
      "Quando errar, nomeie a confusão e retome as seções indicadas antes de tentar novamente."
    ],
    "questions": [
      {
        "id": "q.ce03.q01",
        "topicId": "banking.ce.divida",
        "prompt": "Um CDB do Banco Azul aparece no aplicativo de uma distribuidora. Quem é o emissor indicado?",
        "options": [
          "A distribuidora necessariamente.",
          "O Banco Azul.",
          "O investidor.",
          "Toda instituição que usa o aplicativo."
        ],
        "answer": 1,
        "explanation": "Canal de distribuição e emissor podem ser distintos.",
        "optionRationales": [
          "Troca serviço por emissão.",
          "Segue a identificação do produto.",
          "Investidor é credor no caso.",
          "Amplia a obrigação sem fundamento."
        ]
      },
      {
        "id": "q.ce03.q02",
        "topicId": "banking.ce.divida",
        "prompt": "R$800 a 5% por um período, pago no fim, sem custos/tributos e com cumprimento do contrato. Qual total?",
        "options": [
          "R$40.",
          "R$805.",
          "R$4.000.",
          "R$840."
        ],
        "answer": 3,
        "explanation": "Juros de R$40 somados ao principal.",
        "optionRationales": [
          "Só os juros.",
          "Confunde percentual com cinco reais.",
          "Multiplica por 5 em vez de 0,05.",
          "800 × 0,05 + 800."
        ]
      },
      {
        "id": "q.ce03.q03",
        "topicId": "banking.ce.divida",
        "prompt": "Um título tem regra de remuneração ligada a um índice futuro. Ele é:",
        "options": [
          "pós-fixado, se essa é a regra descrita.",
          "necessariamente ação.",
          "sempre prefixado.",
          "livre de risco."
        ],
        "answer": 0,
        "explanation": "A referência variável caracteriza a regra pós-fixada.",
        "optionRationales": [
          "Distingue regra conhecida e índice futuro.",
          "Troca dívida por participação.",
          "O valor do índice não está fixado.",
          "A regra não elimina risco."
        ]
      },
      {
        "id": "q.ce03.q04",
        "topicId": "banking.ce.divida",
        "prompt": "Saber apenas que um título vence em dois anos permite concluir que:",
        "options": [
          "há resgate diário obrigatório.",
          "qualquer venda antecipada será sem perda.",
          "falta conhecer as condições de saída antecipada.",
          "o emissor é a bolsa."
        ],
        "answer": 2,
        "explanation": "Prazo final não informa liquidez antes dele.",
        "optionRationales": [
          "Inventa condição de resgate.",
          "Preço antecipado pode variar.",
          "Reconhece a informação ausente.",
          "Prazo não identifica emissor."
        ]
      },
      {
        "id": "q.ce03.q05",
        "topicId": "banking.ce.divida",
        "prompt": "Compra R$600; venda antecipada R$570; nenhum outro fluxo/custo/tributo. Resultado?",
        "options": [
          "R$570 de lucro.",
          "R$30 de lucro.",
          "Zero, por ser renda fixa.",
          "R$30 de perda."
        ],
        "answer": 3,
        "explanation": "570 − 600 = −30.",
        "optionRationales": [
          "Confunde recebimento e resultado.",
          "Inverte o sinal.",
          "Renda fixa não impede perda na venda.",
          "Desconta o desembolso."
        ]
      },
      {
        "id": "q.ce03.q06",
        "topicId": "banking.ce.divida",
        "prompt": "Uma fórmula combina inflação e componente fixo. Antes de calcular, é preciso:",
        "options": [
          "somar sempre os percentuais.",
          "ler a regra de composição e o período contratados.",
          "usar a taxa de ontem sem perguntar período.",
          "tratar como ação porque há inflação."
        ],
        "answer": 1,
        "explanation": "A denominação não define sozinha a operação matemática.",
        "optionRationales": [
          "Pode exigir composição por fatores.",
          "Evita regra inventada.",
          "Troca período e dado.",
          "Uma referência variável não muda dívida para participação."
        ]
      },
      {
        "id": "q.ce03.q07",
        "topicId": "banking.ce.divida",
        "prompt": "Debênture simples e ação da mesma companhia:",
        "options": [
          "criam direitos idênticos.",
          "são ambas depósitos bancários.",
          "criam, respectivamente, relação de crédito e participação.",
          "transferem a dívida para a distribuidora."
        ],
        "answer": 2,
        "explanation": "A identidade da companhia não apaga a natureza do instrumento.",
        "optionRationales": [
          "Ignora a diferença entre dívida e capital.",
          "Nenhuma foi descrita como depósito.",
          "Mantém as duas relações.",
          "Distribuição não transfere dívida."
        ]
      },
      {
        "id": "q.ce03.q08",
        "topicId": "banking.ce.divida",
        "prompt": "Dois títulos anunciam 10%, sem informar prazo e condições. É correto:",
        "options": [
          "pedir período, regra, risco e condições antes de comparar.",
          "escolher o primeiro por ordem de anúncio.",
          "concluir que pagam a mesma quantia na mesma data.",
          "garantir que ambos permitem saída diária."
        ],
        "answer": 0,
        "explanation": "O percentual isolado é insuficiente.",
        "optionRationales": [
          "Lista dados necessários.",
          "Ordem não compara condições.",
          "Faltam principal, prazo e regra.",
          "A taxa não prova liquidez."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "ce03-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.ce03.q01": [
          {
            "missionId": "banking.ce.divida",
            "sectionId": "inicio"
          },
          {
            "missionId": "banking.ce.divida",
            "sectionId": "ex-emissor"
          }
        ],
        "q.ce03.q02": [
          {
            "missionId": "banking.ce.divida",
            "sectionId": "ex-prefixada"
          }
        ],
        "q.ce03.q03": [
          {
            "missionId": "banking.ce.divida",
            "sectionId": "contrato"
          },
          {
            "missionId": "banking.ce.divida",
            "sectionId": "ex-indice"
          }
        ],
        "q.ce03.q04": [
          {
            "missionId": "banking.ce.divida",
            "sectionId": "saida"
          }
        ],
        "q.ce03.q05": [
          {
            "missionId": "banking.ce.divida",
            "sectionId": "ex-saida"
          }
        ],
        "q.ce03.q06": [
          {
            "missionId": "banking.ce.divida",
            "sectionId": "comparar"
          }
        ],
        "q.ce03.q07": [
          {
            "missionId": "banking.ce.divida",
            "sectionId": "inicio"
          }
        ],
        "q.ce03.q08": [
          {
            "missionId": "banking.ce.divida",
            "sectionId": "comparar"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.ce03",
      "blockId": "banking.capital-exchange",
      "prerequisiteId": "banking.ce.acoes",
      "parametersApproved": false
    }
  },
  {
    "id": "banking.ce.fundos",
    "topicId": "banking.ce.fundos",
    "contentVersion": 1,
    "order": 41,
    "title": "Fundos, cotas e condições de movimentação",
    "shortTitle": "CE-04",
    "kind": "lesson",
    "objective": "Relacionar cotas e patrimônio, distinguir prestadores e interpretar condições de aplicação/resgate sem prometer liquidez ou retorno.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "capital-exchange-intro-r1",
      "releaseSequence": 4,
      "changeImpact": "new"
    },
    "sourceIds": [
      "ce.ce04.cvm.ce.fundos"
    ],
    "sections": [
      {
        "id": "inicio",
        "type": "explanation",
        "heading": "1. Uma aplicação coletiva",
        "body": "Um fundo reúne recursos para investir conforme regras. O investidor adquire cotas, não escolhe diretamente cada ativo da carteira como se operasse sozinho. A estrutura pode ter classes com patrimônios segregados; nos exemplos usaremos só uma classe e uma subclasse. Retome [ação e dívida](ce-01-v1.md#direitos): a cota não transforma o investidor automaticamente em acionista do banco que distribui o fundo.",
        "sourceIds": [
          "ce.ce04.cvm.ce.fundos"
        ],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "Um fundo reúne recursos para investir conforme regras. O investidor adquire cotas, não escolhe diretamente cada ativo da carteira como se operasse sozinho. A estrutura pode ter classes com patrimônios segregados; nos exemplos usaremos só uma classe e uma subclasse. Retome "
              },
              {
                "text": "ação e dívida",
                "missionId": "banking.ce.instrumentos",
                "sectionId": "direitos",
                "wholeLesson": false
              },
              {
                "text": ": a cota não transforma o investidor automaticamente em acionista do banco que distribui o fundo."
              }
            ]
          }
        ]
      },
      {
        "id": "cota",
        "type": "explanation",
        "heading": "2. Patrimônio e fração",
        "body": "Patrimônio líquido é o valor dos ativos menos obrigações, no recorte simplificado. Valor da cota = patrimônio líquido / quantidade de cotas. Aplicação dividida pelo valor de cota aplicável resulta em quantidade; quantidade multiplicada pela cota resulta em valor. A variação dos ativos e os encargos podem mudar a cota. Usamos valores já apurados, sem recalcular despesas embutidas.",
        "sourceIds": [
          "ce.ce04.cvm.ce.fundos"
        ]
      },
      {
        "id": "ex-cota",
        "type": "worked-example",
        "heading": "3. Calcular a fração",
        "body": "Classe fictícia: ativos R$12.000, obrigações R$2.000 e 1.000 cotas. Passo 1: patrimônio líquido = 12.000 − 2.000 = R$10.000. Passo 2: cota = 10.000/1.000 = R$10. Uma posição de 20 cotas corresponde a R$200 nessa apuração, não a vinte ações do administrador.",
        "sourceIds": []
      },
      {
        "id": "ex-aplicacao",
        "type": "worked-example",
        "heading": "4. Quantidade não é valor fixo",
        "body": "Com cota aplicável de R$5 e sem cobrança adicional no exemplo, uma aplicação de R$300 corresponde a 60 cotas. Se a cota depois for R$4,50, sem movimentação da posição, 60 × 4,50 = R$270. A quantidade permaneceu; o valor caiu R$30. A aplicação coletiva também pode ter perda.",
        "sourceIds": []
      },
      {
        "id": "papeis",
        "type": "explanation",
        "heading": "5. Quem faz o quê",
        "body": "Administrador e gestor são prestadores de serviços essenciais com funções e responsabilidades próprias. Administração envolve a estrutura e serviços administrativos; gestão envolve decisões sobre os ativos, dentro da política e dos limites. Distribuição é a colocação das cotas junto ao investidor. A escolha profissional dos ativos não é garantia de retorno. Regulamento e informações da classe esclarecem política, custos, riscos e condições.",
        "sourceIds": [
          "ce.ce04.cvm.ce.fundos"
        ]
      },
      {
        "id": "ex-papeis",
        "type": "worked-example",
        "heading": "6. Encontrar a função",
        "body": "No fundo fictício Horizonte, uma equipe decide vender um título e comprar outro conforme a política de investimento. Isso corresponde à gestão da carteira. A tarefa de organizar registros e informações do fundo pertence ao campo administrativo e aos serviços contratados pertinentes. Não atribua automaticamente toda função ao banco que apenas apresentou as cotas.",
        "sourceIds": [
          "ce.ce04.cvm.ce.fundos"
        ]
      },
      {
        "id": "movimentacao",
        "type": "explanation",
        "heading": "7. Aberta, fechada e prazos",
        "body": "Classe aberta admite resgate conforme regulamento; aberta não quer dizer dinheiro imediato. Classe fechada não admite o resgate ordinário por solicitação do cotista; amortização/liquidação têm regras próprias. Eventual negociação de cotas com outro investidor depende de condições e comprador. No resgate, separe solicitação, conversão das cotas em valor e pagamento. A data da conversão define qual cota será usada; a do pagamento indica quando ocorre o recebimento.",
        "sourceIds": [
          "ce.ce04.cvm.ce.fundos"
        ]
      },
      {
        "id": "ex-prazos",
        "type": "worked-example",
        "heading": "8. Ler a sequência informada",
        "body": "Condições fictícias: solicitação no dia útil D0, conversão em D2 e pagamento em D5. Uma pessoa resgata 40 cotas; a cota apurada em D2 é R$8. Sem cobrança adicional: 40 × 8 = R$320, pagos em D5. A cota vista em D0 não substitui a de D2 e R$320 não ficam disponíveis em D0. Esses prazos são dados do caso, não regra de todos os fundos.",
        "sourceIds": []
      },
      {
        "id": "glossario",
        "type": "glossary",
        "heading": "9. Vocabulário",
        "body": "Cota: fração do patrimônio da classe. Carteira: conjunto de ativos. Regulamento: condições do fundo/classes. Conversão: apuração do valor aplicável. Pagamento: entrega dos recursos. Amortização: pagamento de parcela nas condições previstas; não confundir com venda a outro investidor.",
        "sourceIds": []
      },
      {
        "id": "resumo",
        "type": "summary",
        "heading": "10. Recuperação",
        "body": "Confira classe e regras, depois patrimônio/quantidade, prestador e datas. Uma cota pode variar; uma classe aberta pode ter prazo de resgate. Não presuma garantia ou liquidez apenas pelo nome do fundo. Retome a seção correspondente ao erro.",
        "sourceIds": []
      }
    ],
    "recall": [
      "Explique os conceitos sem consultar e confira a seção de origem.",
      "Refaça o exemplo, separando dados, hipótese e conclusão.",
      "Quando errar, nomeie a confusão e retome as seções indicadas antes de tentar novamente."
    ],
    "questions": [
      {
        "id": "q.ce04.q01",
        "topicId": "banking.ce.fundos",
        "prompt": "Uma classe tem patrimônio líquido R$9.000 e 900 cotas iguais. Qual valor de cota?",
        "options": [
          "R$10.",
          "R$900.",
          "R$9.000.",
          "R$0,10."
        ],
        "answer": 0,
        "explanation": "9.000/900 = 10.",
        "optionRationales": [
          "Divide patrimônio pela quantidade.",
          "Usa quantidade como preço.",
          "Usa patrimônio total como preço.",
          "Inverte a razão."
        ]
      },
      {
        "id": "q.ce04.q02",
        "topicId": "banking.ce.fundos",
        "prompt": "Aplicação R$240, cota aplicável R$6, sem cobrança adicional. Quantas cotas?",
        "options": [
          "6.",
          "240.",
          "40.",
          "1.440."
        ],
        "answer": 2,
        "explanation": "240/6 = 40.",
        "optionRationales": [
          "Confunde preço e quantidade.",
          "Ignora o preço.",
          "Relaciona aplicação e preço.",
          "Multiplica em vez de dividir."
        ]
      },
      {
        "id": "q.ce04.q03",
        "topicId": "banking.ce.fundos",
        "prompt": "Escolher ativos da carteira dentro da política é atribuição de:",
        "options": [
          "todo cotista individualmente para a carteira inteira.",
          "gestão.",
          "emissor de qualquer ação comprada.",
          "qualquer distribuidor, automaticamente."
        ],
        "answer": 1,
        "explanation": "A função descrita é gestão dos ativos.",
        "optionRationales": [
          "Confunde investimento coletivo e escolha individual.",
          "Relaciona função e decisão.",
          "Emissor não gere automaticamente o fundo.",
          "Distribuição não é gestão por definição."
        ]
      },
      {
        "id": "q.ce04.q04",
        "topicId": "banking.ce.fundos",
        "prompt": "Classe aberta significa que:",
        "options": [
          "todo pedido é pago imediatamente.",
          "o principal é garantido.",
          "não pode haver custos.",
          "admite resgate nas condições do regulamento."
        ],
        "answer": 3,
        "explanation": "Abertura ao resgate não elimina prazos e riscos.",
        "optionRationales": [
          "Confunde possibilidade e instante.",
          "Não decorre da classificação.",
          "Não decorre da classificação.",
          "Mantém as condições."
        ]
      },
      {
        "id": "q.ce04.q05",
        "topicId": "banking.ce.fundos",
        "prompt": "No caso D0 solicitação, D2 conversão e D5 pagamento, qual cota usar?",
        "options": [
          "Sempre a de D0.",
          "Sempre a de D5.",
          "A de D2, conforme o caso.",
          "A maior das três."
        ],
        "answer": 2,
        "explanation": "A data de conversão indicada controla o cálculo.",
        "optionRationales": [
          "Troca solicitação por conversão.",
          "Troca pagamento por conversão.",
          "Segue a condição informada.",
          "Inventa escolha favorável."
        ]
      },
      {
        "id": "q.ce04.q06",
        "topicId": "banking.ce.fundos",
        "prompt": "50 cotas passam de R$10 a R$9, sem movimentação. O valor da posição:",
        "options": [
          "passa de R$500 a R$450.",
          "fica R$500 por obrigação do banco.",
          "sobe a R$550.",
          "vira 45 cotas automaticamente."
        ],
        "answer": 0,
        "explanation": "Quantidade permanece; o valor de cota diminui.",
        "optionRationales": [
          "Multiplica a mesma quantidade pelo novo valor.",
          "Inventa garantia.",
          "Troca queda por alta.",
          "A variação não altera sozinha a quantidade."
        ]
      },
      {
        "id": "q.ce04.q07",
        "topicId": "banking.ce.fundos",
        "prompt": "Uma classe fechada não admite resgate ordinário a pedido. Antes de contar com saída por venda, deve-se:",
        "options": [
          "considerar o dinheiro imediatamente disponível.",
          "exigir o mesmo prazo de qualquer classe aberta.",
          "presumir recompra obrigatória pelo distribuidor.",
          "verificar negociação permitida, comprador e preço."
        ],
        "answer": 3,
        "explanation": "Possibilidade de negociar não garante execução imediata.",
        "optionRationales": [
          "Confunde cota e saldo disponível.",
          "Transfere regra de outra classe.",
          "Inventa obrigação.",
          "Reconhece condições de liquidez."
        ]
      },
      {
        "id": "q.ce04.q08",
        "topicId": "banking.ce.fundos",
        "prompt": "Ativos R$5.000, obrigações R$500 e 450 cotas. Qual patrimônio líquido e cota?",
        "options": [
          "R$5.000 e R$500.",
          "R$4.500 e R$10.",
          "R$5.500 e R$10.",
          "R$500 e R$450."
        ],
        "answer": 1,
        "explanation": "5.000 − 500 = 4.500; 4.500/450 = 10.",
        "optionRationales": [
          "Não deduz obrigações.",
          "Faz as duas etapas.",
          "Soma obrigações ao patrimônio.",
          "Troca grandezas."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "ce04-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.ce04.q01": [
          {
            "missionId": "banking.ce.fundos",
            "sectionId": "cota"
          },
          {
            "missionId": "banking.ce.fundos",
            "sectionId": "ex-cota"
          }
        ],
        "q.ce04.q02": [
          {
            "missionId": "banking.ce.fundos",
            "sectionId": "ex-aplicacao"
          }
        ],
        "q.ce04.q03": [
          {
            "missionId": "banking.ce.fundos",
            "sectionId": "papeis"
          },
          {
            "missionId": "banking.ce.fundos",
            "sectionId": "ex-papeis"
          }
        ],
        "q.ce04.q04": [
          {
            "missionId": "banking.ce.fundos",
            "sectionId": "movimentacao"
          }
        ],
        "q.ce04.q05": [
          {
            "missionId": "banking.ce.fundos",
            "sectionId": "ex-prazos"
          }
        ],
        "q.ce04.q06": [
          {
            "missionId": "banking.ce.fundos",
            "sectionId": "ex-aplicacao"
          }
        ],
        "q.ce04.q07": [
          {
            "missionId": "banking.ce.fundos",
            "sectionId": "movimentacao"
          }
        ],
        "q.ce04.q08": [
          {
            "missionId": "banking.ce.fundos",
            "sectionId": "cota"
          },
          {
            "missionId": "banking.ce.fundos",
            "sectionId": "ex-cota"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.ce04",
      "blockId": "banking.capital-exchange",
      "prerequisiteId": "banking.ce.divida",
      "parametersApproved": false
    }
  },
  {
    "id": "banking.ce.riscos",
    "topicId": "banking.ce.riscos",
    "contentVersion": 1,
    "order": 42,
    "title": "Risco, liquidez e retorno: comparar sem prometer",
    "shortTitle": "CE-05",
    "kind": "lesson",
    "objective": "Distinguir os três riscos básicos e calcular um resultado líquido sob custos informados, sem transformar expectativa em garantia.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "capital-exchange-intro-r1",
      "releaseSequence": 4,
      "changeImpact": "new"
    },
    "sourceIds": [
      "ce.ce05.cvm.ce.risco",
      "ce.ce05.cvm.ce.liquidez"
    ],
    "sections": [
      {
        "id": "inicio",
        "type": "explanation",
        "heading": "1. Qual pergunta vem antes da taxa?",
        "body": "Depois de identificar ação, título ou cota, pergunte o que pode impedir o resultado esperado e quando o dinheiro estará disponível. Uma promessa de pagamento e uma possibilidade de venda são coisas diferentes. Nesta aula todos os valores são fictícios e as comparações usam o mesmo período e moeda.",
        "sourceIds": []
      },
      {
        "id": "riscos",
        "type": "explanation",
        "heading": "2. Três riscos, três perguntas",
        "body": "Crédito: a contraparte cumprirá a obrigação? Mercado: quanto pode mudar o preço do ativo? Liquidez: será possível convertê-lo em dinheiro no prazo necessário sem aceitar uma condição desfavorável? Os riscos podem coexistir. Renda fixa e negociação frequente não afastam todos eles.",
        "sourceIds": [
          "ce.ce05.cvm.ce.risco",
          "ce.ce05.cvm.ce.liquidez"
        ]
      },
      {
        "id": "ex-riscos",
        "type": "worked-example",
        "heading": "3. Exemplo resolvido: nomear o evento",
        "body": "No caso A, a emissora deixa de pagar a parcela contratada: o evento é de crédito. No B, o título cai de preço após mudança nas taxas do mercado: mercado. No C, não aparece comprador nas condições pretendidas e a venda urgente exige desconto: liquidez. Classificamos o fato destacado, sem declarar que os outros riscos desapareceram.",
        "sourceIds": [
          "ce.ce05.cvm.ce.risco"
        ]
      },
      {
        "id": "retorno",
        "type": "explanation",
        "heading": "4. Esperado não é recebido",
        "body": "Uma projeção de retorno descreve uma expectativa. O retorno realizado depende do que efetivamente ocorreu. Uma taxa contratada também precisa ser interpretada com as condições do contrato e seu cumprimento. Resultado favorável passado não assegura repetição.",
        "sourceIds": [
          "ce.ce05.cvm.ce.risco"
        ]
      },
      {
        "id": "ex-liquidez",
        "type": "worked-example",
        "heading": "5. Exemplo resolvido: venda urgente",
        "body": "Caio tem um ativo que poderia negociar por R$ 1.000 em condições normais do caso. Só há uma oferta imediata de R$ 940, e ele aceita por precisar do dinheiro hoje. A diferença é R$ 60. O exemplo destaca o custo da urgência; não prova inadimplência do emissor nem cria uma regra de desconto para o mercado.",
        "sourceIds": [
          "ce.ce05.cvm.ce.liquidez"
        ]
      },
      {
        "id": "liquido",
        "type": "explanation",
        "heading": "6. Do ganho bruto ao líquido",
        "body": "Nos exercícios: ganho bruto = total recebido antes dos custos menos aplicação inicial; ganho líquido = ganho bruto menos os custos expressamente informados. Taxa líquida = ganho líquido dividido pela aplicação inicial, vezes 100. Não desconte novamente um custo que o enunciado já tenha retirado. Impostos só entram quando houver valor ou hipótese explicitamente dada; não se presume uma alíquota.",
        "sourceIds": []
      },
      {
        "id": "ex-liquido",
        "type": "worked-example",
        "heading": "7. Exemplo resolvido: custos em reais",
        "body": "Uma aplicação inicial de R$ 1.000 gera recebimento bruto de R$ 1.120 no fim do período. Todos os custos do exercício somam R$ 20. Ganho bruto: 1.120 − 1.000 = R$ 120. Ganho líquido: 120 − 20 = R$ 100. Taxa líquida: 100 ÷ 1.000 × 100 = 10%. Não se calcula 10% sobre R$ 1.120.",
        "sourceIds": []
      },
      {
        "id": "diversificar",
        "type": "explanation",
        "heading": "8. Diversificação tem limites",
        "body": "Distribuir exposições entre diferentes emissores e fatores de risco pode reduzir concentração, mas não garante lucro nem elimina choques que atingem vários ativos. Contar aplicativos ou nomes comerciais é insuficiente: é preciso identificar a exposição econômica. A comparação também deve considerar prazo, moeda, liquidez e custos, além da taxa.",
        "sourceIds": [
          "ce.ce05.cvm.ce.risco",
          "ce.ce05.cvm.ce.liquidez"
        ]
      },
      {
        "id": "ex-concentracao",
        "type": "worked-example",
        "heading": "9. Exemplo resolvido: duas telas, um emissor",
        "body": "Rita compra R$ 600 de um CDB do Banco Aurora numa plataforma e R$ 400 de outro CDB do mesmo banco em outra. A soma exposta ao emissor continua R$ 1.000. Duas plataformas não significam dois devedores. Dividir a exposição entre emissores distintos mudaria a concentração, sem tornar o conjunto livre de risco.",
        "sourceIds": []
      },
      {
        "id": "glossario",
        "type": "glossary",
        "heading": "10. Vocabulário essencial",
        "body": "Risco de crédito: possibilidade de descumprimento da obrigação. Risco de mercado: variação de preço. Risco de liquidez: dificuldade de converter em dinheiro no prazo e condições pretendidos. Ganho líquido: ganho após os custos considerados. Diversificação: distribuição de exposições, sem garantia contra perdas.",
        "sourceIds": []
      },
      {
        "id": "retomada",
        "type": "summary",
        "heading": "11. Síntese e recuperação",
        "body": "Se confundiu o evento, volte a riscos e ex-riscos. Se confundiu promessa com resultado, retorne a retorno. Se errou a base percentual ou descontou duas vezes, refaça liquido e ex-liquido. Se contou telas como emissores, leia diversificar e ex-concentracao e explique quem deve o dinheiro.",
        "sourceIds": []
      }
    ],
    "recall": [
      "Explique os conceitos sem consultar e confira a seção de origem.",
      "Refaça o exemplo, separando dados, hipótese e conclusão.",
      "Quando errar, nomeie a confusão e retome as seções indicadas antes de tentar novamente."
    ],
    "questions": [
      {
        "id": "q.ce05.q01",
        "topicId": "banking.ce.riscos",
        "prompt": "Uma emissora não paga os juros contratados na data prevista. Qual risco o fato destaca?",
        "options": [
          "Somente liquidez.",
          "Ausência de risco por ser dívida.",
          "Exclusivamente oscilação do preço de bolsa.",
          "Crédito."
        ],
        "answer": 3,
        "explanation": "O evento descrito é o descumprimento da obrigação pela emissora.",
        "optionRationales": [
          "Não foi descrita uma dificuldade de venda.",
          "A forma de dívida não elimina inadimplência.",
          "O caso descreve falta de pagamento, não apenas preço.",
          "Correta: há falha no pagamento devido."
        ]
      },
      {
        "id": "q.ce05.q02",
        "topicId": "banking.ce.riscos",
        "prompt": "Um título tem negociação frequente, mas seu preço cai quando mudam as taxas do mercado. O que se conclui?",
        "options": [
          "A frequência de negócios impede perdas.",
          "Há manifestação de risco de mercado.",
          "O emissor necessariamente deixou de pagar.",
          "Toda renda fixa deixa de ser dívida quando oscila."
        ],
        "answer": 1,
        "explanation": "Preço oscilante e possibilidade de vender são dimensões diferentes.",
        "optionRationales": [
          "Negociar com facilidade não fixa o preço.",
          "Correta: o evento é a mudança de preço.",
          "A oscilação não prova inadimplência.",
          "A oscilação não altera a natureza do instrumento."
        ]
      },
      {
        "id": "q.ce05.q03",
        "topicId": "banking.ce.riscos",
        "prompt": "Uma projeção anuncia retorno de 12% no período. Qual interpretação é defensável?",
        "options": [
          "O ganho de 12% já foi realizado.",
          "Maior projeção elimina perdas.",
          "É uma expectativa, que pode diferir do resultado realizado.",
          "O percentual, sozinho, prova a liquidez diária."
        ],
        "answer": 2,
        "explanation": "Projeção não é comprovante de recebimento nem informação suficiente sobre liquidez.",
        "optionRationales": [
          "Falta o resultado efetivamente ocorrido.",
          "A projeção não elimina risco.",
          "Correta: esperado e realizado são distintos.",
          "A taxa não determina prazo de saída."
        ]
      },
      {
        "id": "q.ce05.q04",
        "topicId": "banking.ce.riscos",
        "prompt": "Aplicação inicial R$ 500; recebimento bruto final R$ 560; custos totais R$ 10. Qual a taxa líquida do período?",
        "options": [
          "10%.",
          "12%.",
          "2%.",
          "10,71%."
        ],
        "answer": 0,
        "explanation": "O ganho líquido é 560 − 500 − 10 = R$ 50; 50 ÷ 500 = 10%.",
        "optionRationales": [
          "Correta: o capital inicial é a base.",
          "12% é a taxa bruta, antes dos R$ 10.",
          "2% representa apenas a proporção dos custos.",
          "Usar o recebimento final como base não segue a fórmula."
        ]
      },
      {
        "id": "q.ce05.q05",
        "topicId": "banking.ce.riscos",
        "prompt": "R$ 300 e R$ 700 de CDBs do mesmo banco foram comprados em aplicativos diferentes. O que ocorreu?",
        "options": [
          "A exposição ficou dividida entre dois bancos.",
          "A exposição ao mesmo emissor soma R$ 1.000.",
          "O risco de crédito foi eliminado.",
          "Os aplicativos se tornaram os devedores dos CDBs."
        ],
        "answer": 1,
        "explanation": "A identidade do emissor, e não o número de telas, determina a concentração descrita.",
        "optionRationales": [
          "O enunciado informa um único banco emissor.",
          "Correta: 300 + 700 continuam no mesmo emissor.",
          "Não há eliminação do risco.",
          "O canal de compra não troca o emissor."
        ]
      },
      {
        "id": "q.ce05.q06",
        "topicId": "banking.ce.riscos",
        "prompt": "Para vender imediatamente, alguém aceita desconto porque não há outros compradores nas condições desejadas. Qual dimensão o caso enfatiza?",
        "options": [
          "Direito de voto.",
          "Pagamento garantido de dividendos.",
          "Inadimplência comprovada.",
          "Liquidez."
        ],
        "answer": 3,
        "explanation": "A urgência e a dificuldade de negociar nas condições pretendidas são o foco.",
        "optionRationales": [
          "Não se discute participação societária.",
          "O caso não envolve dividendos.",
          "A necessidade de desconto não prova descumprimento.",
          "Correta: prazo de saída e preço se relacionam."
        ]
      },
      {
        "id": "q.ce05.q07",
        "topicId": "banking.ce.riscos",
        "prompt": "Sobre uma carteira com diferentes emissores e fatores de risco, qual conclusão é correta?",
        "options": [
          "Pode ter menor concentração, mas continua sujeita a perdas.",
          "Nunca terá prejuízo.",
          "Não sofre choques econômicos comuns.",
          "Garante o maior retorno disponível."
        ],
        "answer": 0,
        "explanation": "Diversificar pode reduzir concentração sem eliminar riscos compartilhados.",
        "optionRationales": [
          "Correta: redução de concentração não é ausência de risco.",
          "A diversificação não garante resultado.",
          "Choques podem afetar vários ativos.",
          "Não há garantia de retorno máximo."
        ]
      },
      {
        "id": "q.ce05.q08",
        "topicId": "banking.ce.riscos",
        "prompt": "Aplicação inicial de R$ 400; recebimento final de R$ 440 já líquido de todos os custos do exercício. Qual o ganho líquido?",
        "options": [
          "R$ 440.",
          "R$ 0.",
          "R$ 40.",
          "É obrigatório descontar de novo os custos."
        ],
        "answer": 2,
        "explanation": "Como o recebimento já é líquido, basta 440 − 400 = R$ 40.",
        "optionRationales": [
          "R$ 440 inclui a devolução do capital.",
          "Houve diferença positiva de R$ 40.",
          "Correta: desconta-se apenas a aplicação inicial.",
          "Isso contaria o mesmo custo duas vezes."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "ce05-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.ce05.q01": [
          {
            "missionId": "banking.ce.riscos",
            "sectionId": "riscos"
          },
          {
            "missionId": "banking.ce.riscos",
            "sectionId": "ex-riscos"
          }
        ],
        "q.ce05.q02": [
          {
            "missionId": "banking.ce.riscos",
            "sectionId": "riscos"
          },
          {
            "missionId": "banking.ce.riscos",
            "sectionId": "ex-riscos"
          }
        ],
        "q.ce05.q03": [
          {
            "missionId": "banking.ce.riscos",
            "sectionId": "retorno"
          }
        ],
        "q.ce05.q04": [
          {
            "missionId": "banking.ce.riscos",
            "sectionId": "liquido"
          },
          {
            "missionId": "banking.ce.riscos",
            "sectionId": "ex-liquido"
          }
        ],
        "q.ce05.q05": [
          {
            "missionId": "banking.ce.riscos",
            "sectionId": "diversificar"
          },
          {
            "missionId": "banking.ce.riscos",
            "sectionId": "ex-concentracao"
          }
        ],
        "q.ce05.q06": [
          {
            "missionId": "banking.ce.riscos",
            "sectionId": "ex-liquidez"
          },
          {
            "missionId": "banking.ce.riscos",
            "sectionId": "riscos"
          }
        ],
        "q.ce05.q07": [
          {
            "missionId": "banking.ce.riscos",
            "sectionId": "diversificar"
          }
        ],
        "q.ce05.q08": [
          {
            "missionId": "banking.ce.riscos",
            "sectionId": "liquido"
          },
          {
            "missionId": "banking.ce.riscos",
            "sectionId": "ex-liquido"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.ce05",
      "blockId": "banking.capital-exchange",
      "prerequisiteId": "banking.ce.fundos",
      "parametersApproved": false
    }
  },
  {
    "id": "banking.ce.cotacao",
    "topicId": "banking.ce.cotacao",
    "contentVersion": 1,
    "order": 43,
    "title": "Câmbio: ler a cotação e converter valores",
    "shortTitle": "CE-06",
    "kind": "lesson",
    "objective": "Converter valores com uma cotação explícita e identificar compra e venda pela perspectiva informada.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "capital-exchange-intro-r1",
      "releaseSequence": 4,
      "changeImpact": "new"
    },
    "sourceIds": [
      "ce.ce06.bcb.ce.conceito",
      "ce.ce06.lei.14286"
    ],
    "sections": [
      {
        "id": "inicio",
        "type": "explanation",
        "heading": "1. Duas moedas, uma unidade de medida",
        "body": "Câmbio envolve troca entre moedas. Escrever apenas 'a taxa é 5' deixa a informação incompleta. R$ 5 por US$ 1, ou 5 R$/US$, informa quantos reais correspondem a um dólar. Usaremos sempre essa convenção, salvo indicação expressa.",
        "sourceIds": [
          "ce.ce06.bcb.ce.conceito"
        ]
      },
      {
        "id": "conversao",
        "type": "explanation",
        "heading": "2. Multiplicar ou dividir?",
        "body": "Se você parte de dólares e deseja reais, multiplique os dólares pela cotação em R$/US$: os dólares se cancelam. Se parte de reais e quer dólares, divida os reais pela cotação. Verifique se o resultado está na moeda pedida antes de conferir o número. Nos primeiros cálculos, não há custos adicionais.",
        "sourceIds": []
      },
      {
        "id": "ex-multiplicar",
        "type": "worked-example",
        "heading": "3. Exemplo resolvido: valor em reais",
        "body": "Um pagamento fictício de US$ 80 será convertido a R$ 5 por US$ 1. Cálculo: 80 × 5 = R$ 400. Multiplicamos porque cada um dos 80 dólares custa cinco reais. O resultado não é US$ 400 nem R$ 16.",
        "sourceIds": []
      },
      {
        "id": "ex-dividir",
        "type": "worked-example",
        "heading": "4. Exemplo resolvido: orçamento em dólares",
        "body": "Com R$ 600 e cotação única de R$ 5 por US$ 1, sem outros custos, o orçamento compra 600 ÷ 5 = US$ 120. Conferência inversa: 120 × 5 = R$ 600. A cotação inversa seria 1 ÷ 5 = US$ 0,20 por R$ 1.",
        "sourceIds": []
      },
      {
        "id": "perspectiva",
        "type": "explanation",
        "heading": "5. Quem compra a moeda estrangeira?",
        "body": "Em uma tabela com a perspectiva da instituição, 'compra' é a taxa pela qual ela compra moeda estrangeira do cliente; 'venda' é a taxa pela qual ela vende ao cliente. Portanto, o cliente que compra dólares usa a venda da instituição. Leia sempre quem é o sujeito: o verbo isolado não decide.",
        "sourceIds": [
          "ce.ce06.bcb.ce.conceito"
        ]
      },
      {
        "id": "ex-perspectiva",
        "type": "worked-example",
        "heading": "6. Exemplo resolvido: duas pontas da tabela",
        "body": "Uma instituição informa compra de dólar a R$ 4,90 e venda a R$ 5,10. Sem outros custos, Lia compra US$ 100 e paga 100 × 5,10 = R$ 510. Se vender US$ 100 à instituição, recebe 100 × 4,90 = R$ 490. São operações e perspectivas diferentes; não se escolhe a menor taxa por preferência.",
        "sourceIds": []
      },
      {
        "id": "variacao",
        "type": "explanation",
        "heading": "7. Cotação sobe: qual moeda se fortalece?",
        "body": "Na convenção R$/US$, passar de 5 para 6 significa que o dólar exige mais reais: o real se desvaloriza perante o dólar. Passar de 5 para 4 significa que exige menos reais: o real se valoriza. Sempre nomeie as duas moedas. A cotação inversa se move no sentido contrário.",
        "sourceIds": []
      },
      {
        "id": "ex-variacao",
        "type": "worked-example",
        "heading": "8. Exemplo resolvido: o mesmo compromisso",
        "body": "Uma dívida fixa de US$ 50 custa R$ 250 quando a taxa é 5 R$/US$ e R$ 200 quando ela é 4 R$/US$. A redução de R$ 50 decorre apenas da cotação no caso. O compromisso continua US$ 50; a valorização do real não mudou a quantidade de dólares devida.",
        "sourceIds": []
      },
      {
        "id": "custos",
        "type": "explanation",
        "heading": "9. Preço da moeda e desembolso total",
        "body": "A conversão pela taxa pode não ser o desembolso final: uma operação pode ter tarifas e tributos. Compare o custo total das propostas para a mesma operação. A página do BCB apresenta o Valor Efetivo Total (VET) como medida que reúne a taxa e os encargos considerados na operação. Aqui nenhum tributo ou tarifa é presumido; só entram os valores explicitamente dados.",
        "sourceIds": [
          "ce.ce06.bcb.ce.conceito"
        ]
      },
      {
        "id": "glossario",
        "type": "glossary",
        "heading": "10. Vocabulário essencial",
        "body": "Cotação: preço de uma moeda expresso em outra. R$/US$: reais por dólar. Taxa inversa: dólares por real, neste par. Compra/venda: verbos que exigem identificar a perspectiva. Valorização do real: menos reais necessários por dólar nesta convenção. Custo total: desembolso incluindo os encargos da operação.",
        "sourceIds": []
      },
      {
        "id": "retomada",
        "type": "summary",
        "heading": "11. Síntese e recuperação",
        "body": "Anote moeda de partida, moeda pedida e unidade da taxa. Retome conversao se escolheu a operação errada; perspectiva se confundiu comprador e vendedor; variacao se inverteu a força do real; custos se tratou uma cotação isolada como desembolso total. Refaça uma conversão inversa como conferência.",
        "sourceIds": []
      }
    ],
    "recall": [
      "Explique os conceitos sem consultar e confira a seção de origem.",
      "Refaça o exemplo, separando dados, hipótese e conclusão.",
      "Quando errar, nomeie a confusão e retome as seções indicadas antes de tentar novamente."
    ],
    "questions": [
      {
        "id": "q.ce06.q01",
        "topicId": "banking.ce.cotacao",
        "prompt": "A taxa de 4 R$/US$ significa que:",
        "options": [
          "R$ 1 corresponde a US$ 4.",
          "US$ 1 corresponde a R$ 4.",
          "Quatro moedas diferentes são negociadas.",
          "Todo pagamento inclui tarifa de R$ 4."
        ],
        "answer": 1,
        "explanation": "O numerador informa reais e o denominador, dólares.",
        "optionRationales": [
          "Isso inverte as unidades.",
          "Correta: são quatro reais por dólar.",
          "A taxa compara duas moedas.",
          "Não há tarifa informada."
        ]
      },
      {
        "id": "q.ce06.q02",
        "topicId": "banking.ce.cotacao",
        "prompt": "Sem custos adicionais, quanto são US$ 30 à taxa de 5 R$/US$?",
        "options": [
          "R$ 150.",
          "R$ 6.",
          "US$ 150.",
          "R$ 35."
        ],
        "answer": 0,
        "explanation": "Multiplique 30 dólares por cinco reais por dólar.",
        "optionRationales": [
          "Correta: 30 × 5 = R$ 150.",
          "A divisão é para converter reais em dólares nesta convenção.",
          "A resposta deve estar em reais.",
          "Somar moeda e taxa não faz a conversão."
        ]
      },
      {
        "id": "q.ce06.q03",
        "topicId": "banking.ce.cotacao",
        "prompt": "Um orçamento de R$ 240 compra quantos dólares a 4 R$/US$, sem outros custos?",
        "options": [
          "US$ 960.",
          "US$ 244.",
          "US$ 236.",
          "US$ 60."
        ],
        "answer": 3,
        "explanation": "Para partir de reais, divida 240 por 4.",
        "optionRationales": [
          "A multiplicação usa a direção contrária.",
          "Não se somam orçamento e taxa.",
          "Subtrair não converte unidades.",
          "Correta: 240 ÷ 4 = US$ 60."
        ]
      },
      {
        "id": "q.ce06.q04",
        "topicId": "banking.ce.cotacao",
        "prompt": "Na perspectiva da instituição, compra do dólar = R$ 4,80 e venda = R$ 5,20. Sem outros custos, o cliente que compra US$ 50 paga:",
        "options": [
          "R$ 240.",
          "R$ 250.",
          "R$ 260.",
          "R$ 10."
        ],
        "answer": 2,
        "explanation": "A instituição vende os dólares ao cliente: 50 × 5,20 = R$ 260.",
        "optionRationales": [
          "Usa a taxa pela qual a instituição compra, não vende.",
          "A média das taxas não foi contratada.",
          "Correta: usa a venda da instituição.",
          "Não é o valor total convertido."
        ]
      },
      {
        "id": "q.ce06.q05",
        "topicId": "banking.ce.cotacao",
        "prompt": "Na convenção R$/US$, a taxa cai de 6 para 5. O que ocorreu com o real perante o dólar?",
        "options": [
          "Valorização do real.",
          "Desvalorização do real.",
          "A quantidade de dólares de todas as dívidas foi reduzida.",
          "Nada pode ser dito, mesmo com a convenção informada."
        ],
        "answer": 0,
        "explanation": "Agora são necessários menos reais para um dólar.",
        "optionRationales": [
          "Correta: o real compra mais dólares por unidade.",
          "Isso ocorreria com movimento contrário nesta convenção.",
          "A cotação não altera automaticamente o valor contratual em dólares.",
          "A convenção permite identificar o sentido nominal."
        ]
      },
      {
        "id": "q.ce06.q06",
        "topicId": "banking.ce.cotacao",
        "prompt": "Na taxa de 5 R$/US$, qual é a cotação inversa?",
        "options": [
          "5 US$/R$.",
          "0,50 R$/US$.",
          "25 US$/R$.",
          "0,20 US$/R$."
        ],
        "answer": 3,
        "explanation": "A inversa é 1 ÷ 5, e também inverte a unidade.",
        "optionRationales": [
          "Inverteu somente a unidade, sem inverter o número.",
          "Não é a inversa numérica nem a unidade pedida.",
          "Elevar ao quadrado não inverte a cotação.",
          "Correta: um real compra 0,20 dólar no modelo sem custos."
        ]
      },
      {
        "id": "q.ce06.q07",
        "topicId": "banking.ce.cotacao",
        "prompt": "Duas propostas para a mesma compra de moeda têm taxas diferentes, mas as tarifas não foram informadas. Qual conclusão é adequada?",
        "options": [
          "A menor cotação sempre prova menor desembolso final.",
          "Tarifas são necessariamente iguais.",
          "É necessário comparar os custos totais antes de concluir.",
          "A maior cotação garante isenção de tributos."
        ],
        "answer": 2,
        "explanation": "Cotação isolada não determina todos os encargos da operação.",
        "optionRationales": [
          "Outros custos podem modificar a comparação.",
          "Nada informa igualdade de tarifas.",
          "Correta: falta informação relevante para o total.",
          "Não existe essa garantia no enunciado."
        ]
      },
      {
        "id": "q.ce06.q08",
        "topicId": "banking.ce.cotacao",
        "prompt": "Uma obrigação continua em US$ 20; a taxa sobe de 5 para 6 R$/US$. Sem custos extras, o equivalente em reais passa de:",
        "options": [
          "R$ 100 para R$ 80.",
          "R$ 100 para R$ 120.",
          "R$ 20 para R$ 26.",
          "US$ 100 para US$ 120."
        ],
        "answer": 1,
        "explanation": "O cálculo é 20 × 5 e depois 20 × 6, mantendo os mesmos dólares.",
        "optionRationales": [
          "A alta desta cotação aumenta o equivalente em reais.",
          "Correta: a obrigação em dólares permanece igual.",
          "É preciso multiplicar a obrigação inteira.",
          "As unidades de resposta estão erradas."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "ce06-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.ce06.q01": [
          {
            "missionId": "banking.ce.cotacao",
            "sectionId": "inicio"
          }
        ],
        "q.ce06.q02": [
          {
            "missionId": "banking.ce.cotacao",
            "sectionId": "conversao"
          },
          {
            "missionId": "banking.ce.cotacao",
            "sectionId": "ex-multiplicar"
          }
        ],
        "q.ce06.q03": [
          {
            "missionId": "banking.ce.cotacao",
            "sectionId": "conversao"
          },
          {
            "missionId": "banking.ce.cotacao",
            "sectionId": "ex-dividir"
          }
        ],
        "q.ce06.q04": [
          {
            "missionId": "banking.ce.cotacao",
            "sectionId": "perspectiva"
          },
          {
            "missionId": "banking.ce.cotacao",
            "sectionId": "ex-perspectiva"
          }
        ],
        "q.ce06.q05": [
          {
            "missionId": "banking.ce.cotacao",
            "sectionId": "variacao"
          },
          {
            "missionId": "banking.ce.cotacao",
            "sectionId": "ex-variacao"
          }
        ],
        "q.ce06.q06": [
          {
            "missionId": "banking.ce.cotacao",
            "sectionId": "ex-dividir"
          }
        ],
        "q.ce06.q07": [
          {
            "missionId": "banking.ce.cotacao",
            "sectionId": "custos"
          }
        ],
        "q.ce06.q08": [
          {
            "missionId": "banking.ce.cotacao",
            "sectionId": "ex-multiplicar"
          },
          {
            "missionId": "banking.ce.cotacao",
            "sectionId": "ex-variacao"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.ce06",
      "blockId": "banking.capital-exchange",
      "prerequisiteId": "banking.ce.riscos",
      "parametersApproved": false
    }
  },
  {
    "id": "banking.ce.operacoes",
    "topicId": "banking.ce.operacoes",
    "contentVersion": 1,
    "order": 44,
    "title": "Operações de câmbio: finalidade, instituição e condições",
    "shortTitle": "CE-07",
    "kind": "lesson",
    "objective": "Reconhecer operações básicas e a necessidade de identificar a instituição habilitada, a finalidade e as condições da contratação.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "capital-exchange-intro-r1",
      "releaseSequence": 4,
      "changeImpact": "new"
    },
    "sourceIds": [
      "ce.ce07.bcb.ce.conceito",
      "ce.ce07.bcb.ce.instituicoes",
      "ce.ce07.lei.14286"
    ],
    "sections": [
      {
        "id": "inicio",
        "type": "explanation",
        "heading": "1. A operação tem uma finalidade",
        "body": "Depois de converter valores, identifique por que a moeda está sendo trocada. Viajar, transferir recursos ao exterior e pagar uma importação são exemplos distintos. O meio pode ser eletrônico: câmbio não exige que o cliente receba cédulas estrangeiras em todas as situações.",
        "sourceIds": [
          "ce.ce07.bcb.ce.conceito"
        ]
      },
      {
        "id": "finalidades",
        "type": "explanation",
        "heading": "2. Vocabulário básico",
        "body": "Turismo é o contexto de uma viagem; remessa descreve o envio de recursos, cuja finalidade precisa ser identificada; importação envolve compra de bens ou serviços do exterior, e exportação, venda ao exterior. Uma transferência internacional não é, só por existir, pagamento de importação. É necessário ler o motivo informado.",
        "sourceIds": [
          "ce.ce07.bcb.ce.conceito"
        ]
      },
      {
        "id": "ex-finalidade",
        "type": "worked-example",
        "heading": "3. Exemplo resolvido: dois pagamentos",
        "body": "No caso A, Eva remete recursos próprios para sua conta no exterior. No B, uma empresa brasileira paga uma máquina que comprou de fornecedor estrangeiro. O B é pagamento relacionado à importação. Não há informação que transforme o A em compra de mercadoria. Classificar a finalidade exige olhar a operação subjacente.",
        "sourceIds": []
      },
      {
        "id": "autorizacao",
        "type": "explanation",
        "heading": "4. Quem realiza a operação?",
        "body": "A regra legal é realizar operações no mercado de câmbio por meio de instituições autorizadas pelo BCB, nos limites aplicáveis. Uma marca, anúncio ou aplicativo não demonstra sozinho essa autorização. Identifique a pessoa jurídica responsável e consulte as informações oficiais do BCB para a atividade. O próprio BCB regula e fiscaliza; ele não se torna a contraparte de toda operação de um cliente.",
        "sourceIds": [
          "ce.ce07.lei.14286",
          "ce.ce07.bcb.ce.instituicoes"
        ]
      },
      {
        "id": "ex-canal",
        "type": "worked-example",
        "heading": "5. Exemplo resolvido: a tela não comprova a habilitação",
        "body": "Um site fictício afirma 'câmbio autorizado' sem identificar a instituição responsável. A frase publicitária não basta para confirmar a habilitação. O passo conceitual é identificar quem efetivamente realiza a operação e conferir a autorização pertinente. Não se conclui, apenas pela aparência do site, nem regularidade nem fraude.",
        "sourceIds": []
      },
      {
        "id": "regras",
        "type": "explanation",
        "heading": "6. Taxa negociada e responsabilidades",
        "body": "A Lei 14.286 permite livre pactuação da taxa entre instituições autorizadas e clientes, observada a legislação. Isso não elimina controles. A instituição deve identificar e qualificar clientes e assegurar processamento lícito. A classificação da finalidade é responsabilidade do cliente, com suporte técnico da instituição quando necessário. Não se inventa uma finalidade para obter uma condição diferente.",
        "sourceIds": [
          "ce.ce07.lei.14286"
        ]
      },
      {
        "id": "ex-preco",
        "type": "worked-example",
        "heading": "7. Exemplo resolvido: propostas distintas",
        "body": "Para a mesma operação, duas instituições apresentam cotações diferentes. Isso, sozinho, não demonstra irregularidade nem obrigação de cobrar uma taxa única fixada pelo BCB. É preciso comparar as condições e o custo total. A liberdade de pactuar preço não dispensa autorização e obrigações legais.",
        "sourceIds": [
          "ce.ce07.lei.14286"
        ]
      },
      {
        "id": "ressalva",
        "type": "explanation",
        "heading": "8. Evitar uma regra absoluta falsa",
        "body": "O art. 19 da Lei 14.286 prevê uma exceção delimitada para compra e venda de moeda estrangeira em espécie entre pessoas físicas, de forma eventual e não profissional, até o limite legal. Esta aula não ensina o valor do limite nem um procedimento para utilizá-lo. A existência dessa exceção impede afirmar que qualquer troca entre duas pessoas é necessariamente proibida. Ela também não autoriza uma atividade profissional de câmbio sem habilitação.",
        "sourceIds": [
          "ce.ce07.lei.14286"
        ]
      },
      {
        "id": "ex-meio",
        "type": "worked-example",
        "heading": "9. Exemplo resolvido: remessa sem cédulas",
        "body": "Uma empresa contrata com instituição habilitada o pagamento eletrônico de uma importação. Não retira dólares em papel. Isso é compatível com o conceito de operação cambial: a finalidade é pagar o fornecedor no exterior e a liquidação não precisa ocorrer por entrega de cédulas ao cliente. Forma eletrônica não dispensa os controles da operação.",
        "sourceIds": [
          "ce.ce07.bcb.ce.conceito",
          "ce.ce07.lei.14286"
        ]
      },
      {
        "id": "glossario",
        "type": "glossary",
        "heading": "10. Vocabulário essencial",
        "body": "Remessa: envio de recursos, com finalidade própria. Importação: compra do exterior. Exportação: venda ao exterior. Instituição autorizada: responsável habilitado para a atividade no âmbito aplicável. Canal: meio de acesso à operação. Pactuação: acordo sobre condições, dentro das regras.",
        "sourceIds": []
      },
      {
        "id": "retomada",
        "type": "summary",
        "heading": "11. Síntese e recuperação",
        "body": "Se confundiu remessa com importação, releia finalidades e ex-finalidade. Se confiou só no aplicativo, retome autorizacao e ex-canal. Se confundiu preço livre com ausência de regra, volte a regras. Para afirmações com 'qualquer' ou 'sempre', confira ressalva e ex-meio antes de escolher.",
        "sourceIds": []
      }
    ],
    "recall": [
      "Explique os conceitos sem consultar e confira a seção de origem.",
      "Refaça o exemplo, separando dados, hipótese e conclusão.",
      "Quando errar, nomeie a confusão e retome as seções indicadas antes de tentar novamente."
    ],
    "questions": [
      {
        "id": "q.ce07.q01",
        "topicId": "banking.ce.operacoes",
        "prompt": "Uma empresa paga no exterior uma mercadoria comprada de fornecedor estrangeiro. A finalidade descrita está relacionada a:",
        "options": [
          "Dividendo obrigatório de ação.",
          "Turismo, necessariamente.",
          "Importação.",
          "Resgate de cota, necessariamente."
        ],
        "answer": 2,
        "explanation": "O pagamento decorre de compra de mercadoria do exterior.",
        "optionRationales": [
          "Não há distribuição societária no caso.",
          "Não há viagem informada.",
          "Correta: é o fato descrito.",
          "Não há fundo no enunciado."
        ]
      },
      {
        "id": "q.ce07.q02",
        "topicId": "banking.ce.operacoes",
        "prompt": "Um aplicativo exibe 'câmbio autorizado', sem identificar quem contrata a operação. Qual é a leitura adequada?",
        "options": [
          "A frase prova habilitação de qualquer operador.",
          "O BCB será necessariamente o vendedor da moeda.",
          "O uso de aplicativo dispensa instituição responsável.",
          "É preciso identificar a instituição e conferir a autorização pertinente no BCB."
        ],
        "answer": 3,
        "explanation": "O canal não substitui a identificação e a verificação da instituição.",
        "optionRationales": [
          "Publicidade não é prova suficiente.",
          "Regular não significa ser contraparte de toda operação.",
          "A forma digital não elimina responsabilidades.",
          "Correta: a verificação se refere ao responsável e à atividade."
        ]
      },
      {
        "id": "q.ce07.q03",
        "topicId": "banking.ce.operacoes",
        "prompt": "Duas instituições autorizadas oferecem taxas diferentes para o mesmo tipo de operação. Essa diferença, isoladamente:",
        "options": [
          "É compatível com a livre pactuação, observada a legislação.",
          "Prova que uma delas opera ilegalmente.",
          "Prova que não há controles legais.",
          "Significa que o cliente deve usar a média das taxas."
        ],
        "answer": 0,
        "explanation": "A lei não impõe uma cotação única de varejo para toda operação.",
        "optionRationales": [
          "Correta: o preço é pactuado dentro do marco legal.",
          "A diferença de preço não basta para tal conclusão.",
          "Liberdade de preço convive com regras.",
          "A média não se torna taxa contratada por essa razão."
        ]
      },
      {
        "id": "q.ce07.q04",
        "topicId": "banking.ce.operacoes",
        "prompt": "Sobre a classificação da finalidade, qual afirmativa corresponde ao recorte legal estudado?",
        "options": [
          "Pode ser inventada se reduzir o custo.",
          "É responsabilidade do cliente, com suporte técnico da instituição quando necessário.",
          "Nunca envolve informação do cliente.",
          "Dispensa controles de licitude pela instituição."
        ],
        "answer": 1,
        "explanation": "O art. 4º separa a informação de finalidade dos deveres da instituição.",
        "optionRationales": [
          "A classificação deve corresponder à operação.",
          "Correta: preserva os dois papéis.",
          "O cliente tem responsabilidade expressa.",
          "A finalidade não elimina os deveres institucionais."
        ]
      },
      {
        "id": "q.ce07.q05",
        "topicId": "banking.ce.operacoes",
        "prompt": "Uma pessoa remete recursos próprios à sua conta no exterior. Sem outra informação, qual conclusão é segura?",
        "options": [
          "Toda remessa é pagamento de importação.",
          "A operação é necessariamente turística.",
          "A finalidade não importa em nenhuma remessa.",
          "Há uma remessa; não se pode presumir compra de mercadoria."
        ],
        "answer": 3,
        "explanation": "Enviar recursos e comprar mercadoria são fatos que podem ou não coexistir.",
        "optionRationales": [
          "A regra é excessiva.",
          "Não há viagem informada.",
          "A finalidade integra a compreensão da operação.",
          "Correta: lê apenas os fatos fornecidos."
        ]
      },
      {
        "id": "q.ce07.q06",
        "topicId": "banking.ce.operacoes",
        "prompt": "Um pagamento de importação é processado eletronicamente por instituição habilitada. O cliente não retira cédulas. Isso:",
        "options": [
          "É compatível com operação cambial sem entrega de cédulas ao cliente.",
          "Impede que exista câmbio.",
          "Dispensa todos os controles legais.",
          "Transforma a importação em turismo."
        ],
        "answer": 0,
        "explanation": "Câmbio não se limita à compra de dinheiro em papel.",
        "optionRationales": [
          "Correta: a forma de liquidação pode ser eletrônica.",
          "O meio eletrônico não afasta o conceito.",
          "A forma de liquidação não afasta deveres.",
          "O meio não troca a finalidade."
        ]
      },
      {
        "id": "q.ce07.q07",
        "topicId": "banking.ce.operacoes",
        "prompt": "Qual frase evita absolutizar a regra de autorização?",
        "options": [
          "Qualquer troca entre pessoas físicas é sempre proibida.",
          "Existe uma exceção legal delimitada para troca eventual e não profissional em espécie entre pessoas físicas.",
          "A exceção para espécie permite atividade profissional irrestrita.",
          "A existência de uma exceção revoga todos os controles do mercado."
        ],
        "answer": 1,
        "explanation": "A ressalva do art. 19 tem condições e limite próprios, não estudados quantitativamente aqui.",
        "optionRationales": [
          "Ignora a exceção legal.",
          "Correta: reconhece a ressalva sem ampliá-la.",
          "A condição é justamente não profissional.",
          "Uma exceção delimitada não elimina o regime geral."
        ]
      },
      {
        "id": "q.ce07.q08",
        "topicId": "banking.ce.operacoes",
        "prompt": "Ao comparar propostas cambiais para a mesma operação, qual informação é relevante além da cotação isolada?",
        "options": [
          "Só a cor do aplicativo.",
          "Só a expressão 'oferta especial'.",
          "Responsável pela operação, condições e custo total.",
          "Nenhuma outra informação."
        ],
        "answer": 2,
        "explanation": "Preço, identificação e condições são dimensões complementares.",
        "optionRationales": [
          "A aparência não informa habilitação e custo.",
          "Publicidade não substitui os dados da operação.",
          "Correta: reúne os elementos necessários ao recorte.",
          "A cotação isolada é insuficiente."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "ce07-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.ce07.q01": [
          {
            "missionId": "banking.ce.operacoes",
            "sectionId": "finalidades"
          },
          {
            "missionId": "banking.ce.operacoes",
            "sectionId": "ex-finalidade"
          }
        ],
        "q.ce07.q02": [
          {
            "missionId": "banking.ce.operacoes",
            "sectionId": "autorizacao"
          },
          {
            "missionId": "banking.ce.operacoes",
            "sectionId": "ex-canal"
          }
        ],
        "q.ce07.q03": [
          {
            "missionId": "banking.ce.operacoes",
            "sectionId": "regras"
          },
          {
            "missionId": "banking.ce.operacoes",
            "sectionId": "ex-preco"
          }
        ],
        "q.ce07.q04": [
          {
            "missionId": "banking.ce.operacoes",
            "sectionId": "regras"
          }
        ],
        "q.ce07.q05": [
          {
            "missionId": "banking.ce.operacoes",
            "sectionId": "finalidades"
          },
          {
            "missionId": "banking.ce.operacoes",
            "sectionId": "ex-finalidade"
          }
        ],
        "q.ce07.q06": [
          {
            "missionId": "banking.ce.operacoes",
            "sectionId": "inicio"
          },
          {
            "missionId": "banking.ce.operacoes",
            "sectionId": "ex-meio"
          }
        ],
        "q.ce07.q07": [
          {
            "missionId": "banking.ce.operacoes",
            "sectionId": "ressalva"
          }
        ],
        "q.ce07.q08": [
          {
            "missionId": "banking.ce.operacoes",
            "sectionId": "autorizacao"
          },
          {
            "missionId": "banking.ce.operacoes",
            "sectionId": "ex-preco"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.ce07",
      "blockId": "banking.capital-exchange",
      "prerequisiteId": "banking.ce.cotacao",
      "parametersApproved": false
    }
  },
  {
    "id": "banking.ce.regimes",
    "topicId": "banking.ce.regimes",
    "contentVersion": 1,
    "order": 45,
    "title": "Regimes cambiais: regra, mercado e intervenção",
    "shortTitle": "CE-08",
    "kind": "lesson",
    "objective": "Identificar a regra de formação da taxa sem classificar um regime apenas por um episódio de estabilidade ou intervenção.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "capital-exchange-intro-r1",
      "releaseSequence": 4,
      "changeImpact": "new"
    },
    "sourceIds": [
      "ce.ce08.bcb.ce.politica"
    ],
    "sections": [
      {
        "id": "inicio",
        "type": "explanation",
        "heading": "1. Regime é a regra do jogo",
        "body": "A taxa observada é um número em uma data. O regime cambial é o arranjo que orienta sua formação e a atuação das autoridades. Para classificar, procure a regra assumida, não apenas um gráfico curto. Dois países podem exibir a mesma cotação hoje e adotar regimes diferentes.",
        "sourceIds": [
          "ce.ce08.bcb.ce.politica"
        ]
      },
      {
        "id": "fixo",
        "type": "explanation",
        "heading": "2. Fixo: compromisso com uma referência",
        "body": "No modelo fixo, a autoridade assume compromisso com uma paridade ou referência definida e atua para sustentá-la. Isso não quer dizer que a regra seja imutável por toda a história: a paridade pode ser alterada por decisão institucional. É diferente de um preço que ficou estável por coincidência entre oferta e demanda.",
        "sourceIds": [
          "ce.ce08.bcb.ce.politica"
        ]
      },
      {
        "id": "ex-fixo",
        "type": "worked-example",
        "heading": "3. Exemplo resolvido: a regra declarada",
        "body": "O país fictício A anuncia compromisso de manter uma unidade da moeda estrangeira igual a duas unidades da sua moeda e de atuar para preservar essa paridade. O elemento que caracteriza o exemplo fixo é o compromisso assumido. Observar apenas o número 2 em uma tela não seria evidência suficiente.",
        "sourceIds": []
      },
      {
        "id": "flutuante",
        "type": "explanation",
        "heading": "4. Flutuante não significa autoridade ausente",
        "body": "No modelo flutuante, a taxa é formada no mercado. A autoridade pode intervir em determinadas circunstâncias sem que exista compromisso de defender uma paridade específica. Por isso, 'houve intervenção' não basta para concluir que o regime é fixo.",
        "sourceIds": [
          "ce.ce08.bcb.ce.politica"
        ]
      },
      {
        "id": "ex-flutuante",
        "type": "worked-example",
        "heading": "5. Exemplo resolvido: intervenção e finalidade",
        "body": "No país B, a taxa é formada no mercado. Em um episódio de disfunção, a autoridade intervém para melhorar o funcionamento das negociações, sem anunciar um preço a defender. O episódio é compatível com flutuação. Seria necessário outro dado para inferir mudança de regime.",
        "sourceIds": []
      },
      {
        "id": "intermediario",
        "type": "explanation",
        "heading": "6. Intermediário: leia o compromisso específico",
        "body": "Arranjos intermediários combinam elementos de flexibilidade e compromisso. Uma banda cambial é um exemplo: a autoridade define limites para a taxa dentro do desenho adotado. Não existe uma única regra para todos os arranjos intermediários. A questão deve informar qual mecanismo considera.",
        "sourceIds": [
          "ce.ce08.bcb.ce.politica"
        ]
      },
      {
        "id": "ex-banda",
        "type": "worked-example",
        "heading": "7. Exemplo resolvido: uma banda fictícia",
        "body": "O país C permite que o mercado mova a taxa entre 3,80 e 4,20 unidades domésticas por unidade estrangeira e se compromete a defender os limites. O intervalo diferencia o caso de uma paridade única e de uma flutuação sem faixa prometida. Não se deve confundir a banda anunciada com o intervalo mínimo/máximo observado em uma semana.",
        "sourceIds": []
      },
      {
        "id": "brasil",
        "type": "explanation",
        "heading": "8. Referência brasileira e data",
        "body": "A descrição oficial consultada do BCB informa que o Brasil adota câmbio flutuante; sua atuação busca condições de funcionamento do mercado, sem determinar um nível específico para a taxa. Essa referência é temporal e deve ser reconferida se houver mudança pertinente antes da publicação do conteúdo.",
        "sourceIds": [
          "ce.ce08.bcb.ce.politica"
        ]
      },
      {
        "id": "ex-observacao",
        "type": "worked-example",
        "heading": "9. Exemplo resolvido: três dias não definem o regime",
        "body": "Em três dias, a taxa de um país permanece em 5. Não há informação sobre compromisso da autoridade. A estabilidade observada pode ocorrer em diferentes arranjos. A resposta correta é que os dados não bastam para classificar, e não que todo preço estável prova regime fixo.",
        "sourceIds": []
      },
      {
        "id": "glossario",
        "type": "glossary",
        "heading": "10. Vocabulário essencial",
        "body": "Paridade: relação de referência assumida no modelo fixo. Flutuação: formação de taxa no mercado. Banda: faixa definida no arranjo e sujeita ao compromisso informado. Intervenção: atuação da autoridade. Faixa observada: extremos de dados passados, que não provam uma banda institucional.",
        "sourceIds": []
      },
      {
        "id": "retomada",
        "type": "summary",
        "heading": "11. Síntese e recuperação",
        "body": "Se classificou pela cotação de um dia, retome inicio e ex-observacao. Se igualou qualquer intervenção a regime fixo, volte a flutuante e ex-flutuante. Se confundiu faixa observada com banda anunciada, leia intermediario e ex-banda. Use brasil apenas para a referência brasileira consultada.",
        "sourceIds": []
      }
    ],
    "recall": [
      "Explique os conceitos sem consultar e confira a seção de origem.",
      "Refaça o exemplo, separando dados, hipótese e conclusão.",
      "Quando errar, nomeie a confusão e retome as seções indicadas antes de tentar novamente."
    ],
    "questions": [
      {
        "id": "q.ce08.q01",
        "topicId": "banking.ce.regimes",
        "prompt": "Qual dado distingue o regime fixo no modelo estudado?",
        "options": [
          "Compromisso da autoridade com uma paridade definida.",
          "Qualquer repetição de preço por dois dias.",
          "Ausência absoluta de decisões da autoridade.",
          "Obrigação de a moeda nunca mudar de valor em toda a história."
        ],
        "answer": 0,
        "explanation": "O elemento central é a regra de compromisso, não um episódio isolado.",
        "optionRationales": [
          "Correta: descreve o arranjo institucional.",
          "Estabilidade temporária não prova a regra.",
          "A autoridade tem papel no compromisso.",
          "A referência pode ser alterada institucionalmente."
        ]
      },
      {
        "id": "q.ce08.q02",
        "topicId": "banking.ce.regimes",
        "prompt": "Uma autoridade intervém para melhorar a negociação, sem prometer defender uma cotação. O fato, sozinho:",
        "options": [
          "Prova abandono de toda flutuação.",
          "Prova uma banda com limites conhecidos.",
          "Demonstra que as taxas de mercado deixaram de existir.",
          "É compatível com câmbio flutuante."
        ],
        "answer": 3,
        "explanation": "Intervir e defender uma paridade são situações diferentes.",
        "optionRationales": [
          "A conclusão exige dados adicionais.",
          "Não foram anunciados limites.",
          "A intervenção descrita ocorre no mercado.",
          "Correta: flutuação não exige inação absoluta."
        ]
      },
      {
        "id": "q.ce08.q03",
        "topicId": "banking.ce.regimes",
        "prompt": "Um arranjo admite oscilação dentro de limites anunciados e assume sua defesa. O exemplo descreve:",
        "options": [
          "Apenas o maior e o menor preço observado na semana.",
          "Obrigatoriamente uma paridade única.",
          "Uma banda cambial, como arranjo intermediário.",
          "Ausência de compromisso institucional."
        ],
        "answer": 2,
        "explanation": "A faixa é uma regra anunciada e defendida, não uma estatística passada.",
        "optionRationales": [
          "O enunciado informa compromisso, não só observação.",
          "Há um intervalo, não uma única paridade.",
          "Correta: reúne flexibilidade dentro da faixa e compromisso com limites.",
          "Há compromisso explícito."
        ]
      },
      {
        "id": "q.ce08.q04",
        "topicId": "banking.ce.regimes",
        "prompt": "A taxa ficou exatamente igual durante três dias. Sem outros dados, pode-se:",
        "options": [
          "Afirmar que o regime é fixo.",
          "Reconhecer que falta conhecer a regra institucional.",
          "Afirmar que é flutuação pura.",
          "Afirmar que existe uma banda legal."
        ],
        "answer": 1,
        "explanation": "O comportamento de poucos dias não identifica unicamente o regime.",
        "optionRationales": [
          "A estabilidade é insuficiente.",
          "Correta: é necessário conhecer o arranjo.",
          "O mesmo problema impede essa conclusão.",
          "Nenhuma banda foi informada."
        ]
      },
      {
        "id": "q.ce08.q05",
        "topicId": "banking.ce.regimes",
        "prompt": "Na descrição oficial brasileira consultada para esta aula, o regime é:",
        "options": [
          "Fixo em R$ 1 por US$ 1.",
          "Uma banda obrigatória de 3,80 a 4,20.",
          "Flutuante, com possibilidade de atuação do BCB no funcionamento do mercado.",
          "Ausência de qualquer política cambial."
        ],
        "answer": 2,
        "explanation": "A faixa de 3,80 a 4,20 é somente o exemplo do país fictício C.",
        "optionRationales": [
          "Essa paridade não corresponde à fonte.",
          "Confunde exemplo fictício com o Brasil.",
          "Correta: corresponde à referência do BCB consultada.",
          "Há política e atuação mesmo sob flutuação."
        ]
      },
      {
        "id": "q.ce08.q06",
        "topicId": "banking.ce.regimes",
        "prompt": "Qual afirmativa sobre uma paridade fixa evita uma conclusão excessiva?",
        "options": [
          "Jamais pode haver decisão de alterar a paridade.",
          "Pode haver mudança institucional da referência; 'fixo' não significa eterno.",
          "Qualquer oscilação de ações revoga a paridade.",
          "Fixo significa taxa definida individualmente por cada cliente sem compromisso da autoridade."
        ],
        "answer": 1,
        "explanation": "O regime descreve o compromisso vigente, não uma impossibilidade histórica de mudança.",
        "optionRationales": [
          "É uma afirmação absoluta não sustentada.",
          "Correta: distingue regime vigente de imutabilidade.",
          "Preço de ação não define esse regime.",
          "A descrição elimina o elemento central do modelo fixo."
        ]
      },
      {
        "id": "q.ce08.q07",
        "topicId": "banking.ce.regimes",
        "prompt": "Um relatório diz 'a taxa oscilou entre 4,70 e 5,10 no mês', sem informar regra da autoridade. Qual leitura é adequada?",
        "options": [
          "É uma faixa observada, que não prova compromisso de banda.",
          "Há necessariamente uma banda oficial de 4,70 a 5,10.",
          "O relatório informa uma paridade fixa.",
          "A autoridade garantiu esses limites para o próximo mês."
        ],
        "answer": 0,
        "explanation": "Valores extremos observados não equivalem a limites institucionais.",
        "optionRationales": [
          "Correta: mantém a distinção.",
          "Não há compromisso informado.",
          "Foram observados vários valores.",
          "Nada garante o próximo período."
        ]
      },
      {
        "id": "q.ce08.q08",
        "topicId": "banking.ce.regimes",
        "prompt": "Para investigar se houve mudança de regime, qual informação é mais pertinente?",
        "options": [
          "A cor do gráfico de câmbio.",
          "Uma única operação de um turista.",
          "A cotação de uma ação sem vínculo com a regra cambial.",
          "Mudança no compromisso anunciado e na regra de formação da taxa."
        ],
        "answer": 3,
        "explanation": "A classificação se apoia no arranjo institucional e em sua execução.",
        "optionRationales": [
          "A representação visual não define a regra.",
          "Um negócio isolado não define o regime.",
          "O dado não identifica o compromisso cambial.",
          "Correta: trata do elemento que define o regime."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "ce08-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.ce08.q01": [
          {
            "missionId": "banking.ce.regimes",
            "sectionId": "fixo"
          },
          {
            "missionId": "banking.ce.regimes",
            "sectionId": "ex-fixo"
          }
        ],
        "q.ce08.q02": [
          {
            "missionId": "banking.ce.regimes",
            "sectionId": "flutuante"
          },
          {
            "missionId": "banking.ce.regimes",
            "sectionId": "ex-flutuante"
          }
        ],
        "q.ce08.q03": [
          {
            "missionId": "banking.ce.regimes",
            "sectionId": "intermediario"
          },
          {
            "missionId": "banking.ce.regimes",
            "sectionId": "ex-banda"
          }
        ],
        "q.ce08.q04": [
          {
            "missionId": "banking.ce.regimes",
            "sectionId": "inicio"
          },
          {
            "missionId": "banking.ce.regimes",
            "sectionId": "ex-observacao"
          }
        ],
        "q.ce08.q05": [
          {
            "missionId": "banking.ce.regimes",
            "sectionId": "brasil"
          },
          {
            "missionId": "banking.ce.regimes",
            "sectionId": "ex-banda"
          }
        ],
        "q.ce08.q06": [
          {
            "missionId": "banking.ce.regimes",
            "sectionId": "fixo"
          }
        ],
        "q.ce08.q07": [
          {
            "missionId": "banking.ce.regimes",
            "sectionId": "intermediario"
          },
          {
            "missionId": "banking.ce.regimes",
            "sectionId": "ex-banda"
          },
          {
            "missionId": "banking.ce.regimes",
            "sectionId": "ex-observacao"
          }
        ],
        "q.ce08.q08": [
          {
            "missionId": "banking.ce.regimes",
            "sectionId": "inicio"
          },
          {
            "missionId": "banking.ce.regimes",
            "sectionId": "fixo"
          },
          {
            "missionId": "banking.ce.regimes",
            "sectionId": "flutuante"
          },
          {
            "missionId": "banking.ce.regimes",
            "sectionId": "intermediario"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.ce08",
      "blockId": "banking.capital-exchange",
      "prerequisiteId": "banking.ce.operacoes",
      "parametersApproved": false
    }
  },
  {
    "id": "banking.ce.cambio-real",
    "topicId": "banking.ce.cambio-real",
    "contentVersion": 1,
    "order": 46,
    "title": "Câmbio nominal e real: preços e convenção explícita",
    "shortTitle": "CE-09",
    "kind": "lesson",
    "objective": "Calcular uma comparação real simples com convenção explícita, distinguindo cotação monetária de preços relativos.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "capital-exchange-intro-r1",
      "releaseSequence": 4,
      "changeImpact": "new"
    },
    "sourceIds": [
      "ce.ce09.imf.ce.real",
      "ce.ce09.bcb.ce.politica"
    ],
    "sections": [
      {
        "id": "inicio",
        "type": "explanation",
        "heading": "1. O número na cotação não conta toda a história",
        "body": "A taxa nominal e troca moedas: aqui, reais por dólar. Para comparar preços entre países, é preciso também olhar quanto custa uma cesta em cada lugar. Usaremos a mesma cesta hipotética, sem custos de transporte, tributos ou barreiras no exercício. Isso permite aprender a conta, não medir toda a competitividade de um país.",
        "sourceIds": [
          "ce.ce09.imf.ce.real"
        ]
      },
      {
        "id": "formula",
        "type": "explanation",
        "heading": "2. Defina símbolos antes de calcular",
        "body": "P* é o preço da cesta no exterior, em dólares; P é o preço da cesta doméstica, em reais. A convenção desta aula é q = e × P* ÷ P. Primeiro e × P* converte o preço estrangeiro em reais. Depois dividimos pelo preço doméstico. Assim q compara dois preços na mesma moeda. Outras fontes podem usar a inversa; nunca interprete o sentido sem ler a fórmula.",
        "sourceIds": [
          "ce.ce09.imf.ce.real"
        ]
      },
      {
        "id": "ex-nivel",
        "type": "worked-example",
        "heading": "3. Exemplo resolvido: a mesma cesta",
        "body": "Considere e = 5 R$/US$, P* = US$ 12 e P = R$ 60. A cesta estrangeira convertida custa 5 × 12 = R$ 60. Então q = 60 ÷ 60 = 1. No modelo informado, os preços coincidem. Isso não prova que a economia real esteja em equilíbrio: o exercício excluiu várias diferenças e custos.",
        "sourceIds": []
      },
      {
        "id": "sentido",
        "type": "explanation",
        "heading": "4. O que uma mudança de q significa aqui",
        "body": "Nesta convenção, q maior representa cesta estrangeira relativamente mais cara que a doméstica: desvalorização real da moeda doméstica. q menor representa valorização real. A expressão 'real' se refere ao ajuste pelos preços, não apenas à moeda brasileira. Não se deduz a causa olhando só q: podem mudar e, P* ou P.",
        "sourceIds": [
          "ce.ce09.imf.ce.real"
        ]
      },
      {
        "id": "ex-nominal",
        "type": "worked-example",
        "heading": "5. Exemplo resolvido: muda apenas a cotação",
        "body": "Mantendo P* = US$ 12 e P = R$ 60, e sobe de 5 para 6 R$/US$. Antes q = 1. Depois, a cesta estrangeira convertida custa 6 × 12 = R$ 72; q = 72 ÷ 60 = 1,20. Sob esses preços constantes, a desvalorização nominal do real também produz desvalorização real.",
        "sourceIds": []
      },
      {
        "id": "precos",
        "type": "explanation",
        "heading": "6. Cotação parada não garante q parado",
        "body": "Se a cotação nominal ficar constante e o preço doméstico aumentar, mantendo o preço estrangeiro, o denominador P sobe e q cai. Se o preço estrangeiro subir, mantendo os demais dados, o numerador sobe e q aumenta. Compare sempre os cenários completos, sem presumir preços constantes quando o enunciado os altera.",
        "sourceIds": []
      },
      {
        "id": "ex-precos",
        "type": "worked-example",
        "heading": "7. Exemplo resolvido: muda apenas o preço doméstico",
        "body": "Agora e = 5 R$/US$ e P* = US$ 10 permanecem. P sobe de R$ 40 para R$ 50. A cesta estrangeira convertida continua R$ 50. Antes q = 50 ÷ 40 = 1,25; depois q = 50 ÷ 50 = 1. Houve queda de q e valorização real nesta convenção, apesar de não haver mudança nominal do câmbio.",
        "sourceIds": []
      },
      {
        "id": "indice",
        "type": "explanation",
        "heading": "8. Índice de base 100 é uma régua de comparação",
        "body": "Escolha uma data-base com q₀ conhecido. O índice Iₜ = (qₜ ÷ q₀) × 100 informa a mudança em relação àquela base. O número 100 é uma normalização, não prova de preço justo ou equilíbrio. Não confunda o nível q com o índice I. Um índice maior que 100 apenas compara o q atual com o q da base, na convenção adotada.",
        "sourceIds": []
      },
      {
        "id": "ex-indice",
        "type": "worked-example",
        "heading": "9. Exemplo resolvido: nível e índice diferentes",
        "body": "Se q₀ = 1,20 e qₜ = 1,50, o índice atual é 1,50 ÷ 1,20 × 100 = 125. Isso significa q 25% acima da base. Não significa que q valha 125 nem que a moeda esteja exatamente 25% fora de um suposto equilíbrio. A base foi escolhida para comparar datas.",
        "sourceIds": []
      },
      {
        "id": "glossario",
        "type": "glossary",
        "heading": "10. Vocabulário essencial",
        "body": "Nominal: cotação entre moedas. P*: preço estrangeiro da cesta. P: preço doméstico da cesta. q: razão de preços na convenção declarada. Índice: comparação normalizada por uma base. Desvalorização real: aumento de q nesta fórmula; não transportar o sentido para a fórmula inversa.",
        "sourceIds": []
      },
      {
        "id": "retomada",
        "type": "summary",
        "heading": "11. Síntese e recuperação",
        "body": "Se misturou dólares com reais, retome formula e ex-nivel. Para o sentido de valorização, leia sentido com a fórmula à vista. Se ignorou preços internos, volte a precos e ex-precos. Se confundiu 100 com equilíbrio, refaça indice e ex-indice. Escreva a hipótese que ficou constante em cada comparação.",
        "sourceIds": []
      }
    ],
    "recall": [
      "Explique os conceitos sem consultar e confira a seção de origem.",
      "Refaça o exemplo, separando dados, hipótese e conclusão.",
      "Quando errar, nomeie a confusão e retome as seções indicadas antes de tentar novamente."
    ],
    "questions": [
      {
        "id": "q.ce09.q01",
        "topicId": "banking.ce.cambio-real",
        "prompt": "Na convenção e = reais por dólar, q = e × P* ÷ P compara:",
        "options": [
          "Somente duas cotações nominais sem preços.",
          "O número de ações de duas empresas.",
          "Uma taxa de juros com um saldo bancário.",
          "O preço estrangeiro convertido em reais com o preço doméstico."
        ],
        "answer": 3,
        "explanation": "Numerador e denominador são preços em reais de uma cesta comparável no exercício.",
        "optionRationales": [
          "P* e P são essenciais na fórmula.",
          "Não há participação societária na fórmula.",
          "As grandezas indicadas não correspondem aos símbolos.",
          "Correta: é a construção da medida."
        ]
      },
      {
        "id": "q.ce09.q02",
        "topicId": "banking.ce.cambio-real",
        "prompt": "Dados e = 4 R$/US$, P* = US$ 15 e P = R$ 50, qual é q?",
        "options": [
          "0,80.",
          "60.",
          "1,20.",
          "50."
        ],
        "answer": 2,
        "explanation": "Converta: 4 × 15 = R$ 60. Depois 60 ÷ 50 = 1,20.",
        "optionRationales": [
          "Não corresponde à conta definida.",
          "R$ 60 é o preço convertido, antes de dividir.",
          "Correta: divide preços na mesma moeda.",
          "R$ 50 é o preço doméstico, não a razão."
        ]
      },
      {
        "id": "q.ce09.q03",
        "topicId": "banking.ce.cambio-real",
        "prompt": "Na convenção explicitada, q aumenta de 1 para 1,10. Isso representa:",
        "options": [
          "Valorização real, porque qualquer alta favorece a moeda doméstica.",
          "Desvalorização real da moeda doméstica nessa medida.",
          "Prova de equilíbrio econômico.",
          "Obrigatoriamente uma mudança apenas na taxa nominal."
        ],
        "answer": 1,
        "explanation": "A cesta estrangeira ficou relativamente mais cara; a causa exige observar os componentes.",
        "optionRationales": [
          "O sentido depende da fórmula, não da palavra 'alta'.",
          "Correta: segue a convenção adotada.",
          "A variação não prova equilíbrio.",
          "Preços domésticos ou estrangeiros também podem mudar q."
        ]
      },
      {
        "id": "q.ce09.q04",
        "topicId": "banking.ce.cambio-real",
        "prompt": "Com e e P* constantes, P aumenta. Pela fórmula q = e × P* ÷ P, ocorre:",
        "options": [
          "Queda de q.",
          "Aumento necessário de q.",
          "Nenhuma mudança possível de q.",
          "Aumento obrigatório da cotação nominal e."
        ],
        "answer": 0,
        "explanation": "O denominador cresce e o numerador fica constante.",
        "optionRationales": [
          "Correta: há valorização real nesta convenção.",
          "É o sentido contrário ao efeito do denominador.",
          "q depende de P.",
          "O enunciado mantém e constante."
        ]
      },
      {
        "id": "q.ce09.q05",
        "topicId": "banking.ce.cambio-real",
        "prompt": "q era 0,80 na base e passou a 1. Qual é o índice atual com base 100?",
        "options": [
          "80.",
          "125.",
          "1.",
          "100,20."
        ],
        "answer": 1,
        "explanation": "I = 1 ÷ 0,80 × 100 = 125.",
        "optionRationales": [
          "Isso não normaliza a razão atual pela base.",
          "Correta: q ficou 25% acima da base.",
          "1 é o nível atual q, não o índice.",
          "Somar os níveis não faz a normalização."
        ]
      },
      {
        "id": "q.ce09.q06",
        "topicId": "banking.ce.cambio-real",
        "prompt": "Um índice de câmbio real tem valor 100 na data-base. Isso prova que:",
        "options": [
          "Nada sobre equilíbrio, por si só; 100 foi escolhido como base.",
          "A moeda estava exatamente em equilíbrio.",
          "A cotação nominal era R$ 100 por dólar.",
          "Todas as mercadorias tinham o mesmo preço nos dois países."
        ],
        "answer": 0,
        "explanation": "Normalização é convenção de apresentação, não teste de equilíbrio.",
        "optionRationales": [
          "Correta: separa índice e conclusão econômica.",
          "Faltam critérios e evidência para tal afirmação.",
          "Não há essa igualdade entre índice e cotação.",
          "A base não demonstra igualdade de todos os preços."
        ]
      },
      {
        "id": "q.ce09.q07",
        "topicId": "banking.ce.cambio-real",
        "prompt": "e fica em 5 e P* em 10; P cai de 50 para 40. Qual a mudança de q?",
        "options": [
          "De 1 para 0,80.",
          "Permanece em 1 porque e não mudou.",
          "De 50 para 40.",
          "De 1 para 1,25."
        ],
        "answer": 3,
        "explanation": "O preço estrangeiro convertido é 50; 50 ÷ 50 = 1 e 50 ÷ 40 = 1,25.",
        "optionRationales": [
          "Inverte o efeito da queda de P.",
          "Ignora a mudança do denominador.",
          "São os preços P, não a razão q.",
          "Correta: a mudança real pode ocorrer sem mudança nominal."
        ]
      },
      {
        "id": "q.ce09.q08",
        "topicId": "banking.ce.cambio-real",
        "prompt": "Outra fonte usa a razão inversa para definir câmbio real. Antes de interpretar uma alta, você deve:",
        "options": [
          "Aplicar automaticamente o sentido desta aula.",
          "Ignorar a fórmula e olhar só a palavra 'real'.",
          "Conferir a convenção e as unidades adotadas pela fonte.",
          "Considerar toda alta como ganho financeiro."
        ],
        "answer": 2,
        "explanation": "Inverter a razão inverte o sentido de sua variação.",
        "optionRationales": [
          "A interpretação não se transfere sem conferir.",
          "A palavra não especifica a fórmula.",
          "Correta: a convenção determina o significado.",
          "A medida não é uma garantia de resultado de investimento."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "ce09-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.ce09.q01": [
          {
            "missionId": "banking.ce.cambio-real",
            "sectionId": "inicio"
          },
          {
            "missionId": "banking.ce.cambio-real",
            "sectionId": "formula"
          }
        ],
        "q.ce09.q02": [
          {
            "missionId": "banking.ce.cambio-real",
            "sectionId": "formula"
          },
          {
            "missionId": "banking.ce.cambio-real",
            "sectionId": "ex-nivel"
          }
        ],
        "q.ce09.q03": [
          {
            "missionId": "banking.ce.cambio-real",
            "sectionId": "sentido"
          },
          {
            "missionId": "banking.ce.cambio-real",
            "sectionId": "precos"
          }
        ],
        "q.ce09.q04": [
          {
            "missionId": "banking.ce.cambio-real",
            "sectionId": "precos"
          },
          {
            "missionId": "banking.ce.cambio-real",
            "sectionId": "ex-precos"
          }
        ],
        "q.ce09.q05": [
          {
            "missionId": "banking.ce.cambio-real",
            "sectionId": "indice"
          },
          {
            "missionId": "banking.ce.cambio-real",
            "sectionId": "ex-indice"
          }
        ],
        "q.ce09.q06": [
          {
            "missionId": "banking.ce.cambio-real",
            "sectionId": "indice"
          },
          {
            "missionId": "banking.ce.cambio-real",
            "sectionId": "ex-indice"
          }
        ],
        "q.ce09.q07": [
          {
            "missionId": "banking.ce.cambio-real",
            "sectionId": "formula"
          },
          {
            "missionId": "banking.ce.cambio-real",
            "sectionId": "precos"
          },
          {
            "missionId": "banking.ce.cambio-real",
            "sectionId": "ex-precos"
          }
        ],
        "q.ce09.q08": [
          {
            "missionId": "banking.ce.cambio-real",
            "sectionId": "formula"
          },
          {
            "missionId": "banking.ce.cambio-real",
            "sectionId": "sentido"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.ce09",
      "blockId": "banking.capital-exchange",
      "prerequisiteId": "banking.ce.regimes",
      "parametersApproved": false
    }
  },
  {
    "id": "banking.ce.comercio",
    "topicId": "banking.ce.comercio",
    "contentVersion": 1,
    "order": 47,
    "title": "Câmbio e comércio exterior: receita, custo e hipóteses",
    "shortTitle": "CE-10",
    "kind": "lesson",
    "objective": "Calcular o efeito direto de uma mudança cambial em receitas e custos dados, sem prometer uma reação de toda a economia.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "capital-exchange-intro-r1",
      "releaseSequence": 4,
      "changeImpact": "new"
    },
    "sourceIds": [
      "ce.ce10.bcb.ce.politica",
      "ce.ce10.bcb.ce.transmissao"
    ],
    "sections": [
      {
        "id": "inicio",
        "type": "explanation",
        "heading": "1. Leia a moeda do contrato",
        "body": "Exportar é vender ao exterior; importar é comprar do exterior. A receita ou despesa pode estar contratada em moedas diferentes. Nesta aula e é R$/US$ e começamos com valores fixados em dólares. Sempre registre moeda, quantidade, preço e o que se mantém constante. Não confunda aumento em reais com aumento de dólares.",
        "sourceIds": [
          "ce.ce10.bcb.ce.politica"
        ]
      },
      {
        "id": "exportacao",
        "type": "explanation",
        "heading": "2. Receita em dólares, conta em reais",
        "body": "Para um recebimento fixo em dólares, o equivalente em reais é dólares × e. Se e aumenta, o mesmo recebimento em dólares vira mais reais. Esse é um efeito aritmético sob contrato fixo. Ele não prova que a empresa venderá mais unidades nem que o lucro subirá, pois custos também podem mudar.",
        "sourceIds": [
          "ce.ce10.bcb.ce.transmissao"
        ]
      },
      {
        "id": "ex-exportacao",
        "type": "worked-example",
        "heading": "3. Exemplo resolvido: recebimento fixo",
        "body": "Uma exportadora receberá US$ 100, sem custos cambiais no caso. A 5 R$/US$, recebe o equivalente a R$ 500; a 6 R$/US$, R$ 600. A diferença é R$ 100. Continuam sendo US$ 100. A conclusão diz respeito ao valor convertido desse recebimento, não ao lucro de toda a atividade.",
        "sourceIds": []
      },
      {
        "id": "importacao",
        "type": "explanation",
        "heading": "4. Pagamento em dólares, custo em reais",
        "body": "Para uma obrigação fixa em dólares, subir e aumenta o equivalente devido em reais. Uma queda de e faz o contrário, mantidas as demais condições. O resultado pode afetar decisões futuras de compra, mas a quantidade de uma encomenda já contratada não muda automaticamente só porque a taxa mudou.",
        "sourceIds": [
          "ce.ce10.bcb.ce.transmissao"
        ]
      },
      {
        "id": "ex-importacao",
        "type": "worked-example",
        "heading": "5. Exemplo resolvido: insumo importado",
        "body": "Uma empresa deve US$ 40 por um insumo. A 5 R$/US$ são R$ 200; a 6 R$/US$ são R$ 240. O custo convertido sobe R$ 40. O caso não informa repasse ao consumidor, redução de produção ou alteração da quantidade comprada; essas são respostas possíveis, não resultados calculados.",
        "sourceIds": []
      },
      {
        "id": "resultado",
        "type": "explanation",
        "heading": "6. Receita não é lucro",
        "body": "Para calcular resultado no exercício, deduza os custos informados da receita. Um exportador pode ter insumos importados. Assim, a desvalorização do real pode aumentar tanto a receita convertida quanto parte dos custos. Outros custos, contratos e proteção cambial podem alterar o efeito final. Não se conclui lucro apenas observando a receita.",
        "sourceIds": []
      },
      {
        "id": "ex-resultado",
        "type": "worked-example",
        "heading": "7. Exemplo resolvido: os dois lados da mesma empresa",
        "body": "No mesmo período, uma empresa recebe US$ 100 por exportação, paga US$ 40 por insumo importado e tem R$ 100 de outros custos fixos. Sem outros itens, a 5 R$/US$ seu resultado é 500 − 200 − 100 = R$ 200. A 6 R$/US$, é 600 − 240 − 100 = R$ 260. O aumento do resultado é R$ 60, menor que o aumento de R$ 100 da receita.",
        "sourceIds": []
      },
      {
        "id": "competitividade",
        "type": "explanation",
        "heading": "8. Incentivo não é promessa de volume",
        "body": "Mantido um preço em reais, um real mais fraco pode reduzir o preço equivalente em dólares para o comprador externo. Mantido um preço de importação em dólares, encarece-o em reais. São canais de incentivo. A reação de exportações e importações depende também de demanda, capacidade de produção, prazos e repasses; não é automática nem instantânea.",
        "sourceIds": [
          "ce.ce10.bcb.ce.politica",
          "ce.ce10.bcb.ce.transmissao"
        ]
      },
      {
        "id": "ex-preco",
        "type": "worked-example",
        "heading": "9. Exemplo resolvido: preço fixado em reais",
        "body": "Um produto custa R$ 120 e esse preço permanece fixo. A 4 R$/US$, equivale a US$ 30; a 5 R$/US$, a US$ 24. Ele ficou mais barato em dólares sob essa hipótese. Isso não prova aumento de vendas: não sabemos como os compradores reagirão nem se existem barreiras e custos adicionais.",
        "sourceIds": []
      },
      {
        "id": "glossario",
        "type": "glossary",
        "heading": "10. Vocabulário essencial",
        "body": "Receita: entrada decorrente da venda, antes de deduzir os custos. Resultado do caso: receita menos os custos especificados. Insumo: recurso usado na produção. Equivalente em reais: conversão pela taxa dada. Efeito parcial: conclusão que mantém os demais dados constantes.",
        "sourceIds": []
      },
      {
        "id": "retomada",
        "type": "summary",
        "heading": "11. Síntese e recuperação",
        "body": "Para errar menos, monte colunas com dólares, taxa e reais. Retome ex-exportacao ou ex-importacao para a conversão; resultado e ex-resultado para separar receita e lucro; competitividade e ex-preco para distinguir efeito de preço e quantidade. Ao justificar, diga sempre o que o enunciado manteve constante.",
        "sourceIds": []
      }
    ],
    "recall": [
      "Explique os conceitos sem consultar e confira a seção de origem.",
      "Refaça o exemplo, separando dados, hipótese e conclusão.",
      "Quando errar, nomeie a confusão e retome as seções indicadas antes de tentar novamente."
    ],
    "questions": [
      {
        "id": "q.ce10.q01",
        "topicId": "banking.ce.comercio",
        "prompt": "Um exportador receberá US$ 60. Com e passando de 5 para 6 R$/US$, sem outros custos e mantendo o contrato, o equivalente em reais:",
        "options": [
          "Passa de R$ 300 para R$ 250.",
          "Passa de R$ 300 para R$ 360.",
          "Permanece R$ 60.",
          "Prova aumento da quantidade vendida."
        ],
        "answer": 1,
        "explanation": "60 × 5 = 300 e 60 × 6 = 360.",
        "optionRationales": [
          "Inverte o sentido da conversão.",
          "Correta: converte o mesmo recebimento.",
          "Confunde moedas.",
          "Nada altera a quantidade contratada."
        ]
      },
      {
        "id": "q.ce10.q02",
        "topicId": "banking.ce.comercio",
        "prompt": "Uma importação custa US$ 25. A taxa cai de 6 para 4 R$/US$, sem outros custos. O pagamento equivalente em reais:",
        "options": [
          "Sobe de R$ 100 para R$ 150.",
          "Continua R$ 25.",
          "Cai de R$ 150 para R$ 100.",
          "Muda a quantidade contratada para 100 unidades."
        ],
        "answer": 2,
        "explanation": "25 × 6 = 150 e 25 × 4 = 100.",
        "optionRationales": [
          "Inverte antes e depois.",
          "Confunde valor em dólares e reais.",
          "Correta: menos reais são necessários.",
          "O cálculo não muda quantidades."
        ]
      },
      {
        "id": "q.ce10.q03",
        "topicId": "banking.ce.comercio",
        "prompt": "Uma exportadora tem receita em dólares e também insumos importados. O aumento da receita convertida, sozinho:",
        "options": [
          "Não basta para determinar a mudança do resultado.",
          "Prova aumento igual do lucro.",
          "Prova que nenhum custo mudou.",
          "Elimina a necessidade de ler os custos."
        ],
        "answer": 0,
        "explanation": "Parte dos custos pode variar com a mesma cotação.",
        "optionRationales": [
          "Correta: receita e resultado são diferentes.",
          "Falta deduzir as despesas.",
          "O enunciado indica exposição nos custos.",
          "A leitura dos custos é necessária."
        ]
      },
      {
        "id": "q.ce10.q04",
        "topicId": "banking.ce.comercio",
        "prompt": "Receita US$ 80, custo importado US$ 30 e outros custos R$ 50, todos fixos no período do caso. A 5 R$/US$, sem outros itens, o resultado é:",
        "options": [
          "R$ 400.",
          "R$ 250.",
          "R$ 150.",
          "R$ 200."
        ],
        "answer": 3,
        "explanation": "80 × 5 − 30 × 5 − 50 = 400 − 150 − 50 = R$ 200.",
        "optionRationales": [
          "É só a receita.",
          "Ainda falta deduzir os R$ 50.",
          "É apenas o custo importado.",
          "Correta: deduz os dois custos informados."
        ]
      },
      {
        "id": "q.ce10.q05",
        "topicId": "banking.ce.comercio",
        "prompt": "Um preço permanece em R$ 100. e sobe de 4 para 5 R$/US$. O equivalente em dólares:",
        "options": [
          "Cai de US$ 25 para US$ 20.",
          "Sobe de US$ 20 para US$ 25.",
          "Sobe de US$ 400 para US$ 500.",
          "Prova que as vendas vão dobrar."
        ],
        "answer": 0,
        "explanation": "Divida o preço em reais pela taxa de reais por dólar.",
        "optionRationales": [
          "Correta: 100 ÷ 4 e 100 ÷ 5.",
          "Inverte a comparação.",
          "Usa multiplicação na direção errada.",
          "Não há dados de demanda para tal conclusão."
        ]
      },
      {
        "id": "q.ce10.q06",
        "topicId": "banking.ce.comercio",
        "prompt": "Uma desvalorização do real altera incentivos a exportar e importar. Qual frase evita uma promessa indevida?",
        "options": [
          "O saldo comercial melhora no mesmo dia em qualquer situação.",
          "Todos os importadores cessam imediatamente suas compras.",
          "Todo exportador tem lucro maior, qualquer que seja seu custo.",
          "Volumes e saldo dependem também de contratos, demanda, capacidade e prazos."
        ],
        "answer": 3,
        "explanation": "O canal de preços não determina sozinho a reação de toda a economia.",
        "optionRationales": [
          "É uma generalização temporal e causal excessiva.",
          "Contratos e necessidades de importação não somem automaticamente.",
          "Os custos e demais condições importam.",
          "Correta: explicita condicionantes."
        ]
      },
      {
        "id": "q.ce10.q07",
        "topicId": "banking.ce.comercio",
        "prompt": "Uma dívida continua em US$ 40 e e sobe de 5 para 6 R$/US$. Qual valor aumentou diretamente no modelo?",
        "options": [
          "A quantidade de dólares da dívida, de 40 para 48.",
          "A quantidade de mercadorias, necessariamente.",
          "O equivalente em reais, de 200 para 240.",
          "O prazo contratual, de cinco para seis meses."
        ],
        "answer": 2,
        "explanation": "A mudança de cotação afeta a conversão em reais, não reescreve esses termos.",
        "optionRationales": [
          "A obrigação em dólares foi mantida.",
          "Não há mudança automática de quantidade.",
          "Correta: 40 × 5 e 40 × 6.",
          "A taxa não indica meses nem prazo."
        ]
      },
      {
        "id": "q.ce10.q08",
        "topicId": "banking.ce.comercio",
        "prompt": "No caso receita US$ 100, insumo US$ 40 e custo fixo R$ 100, qual o aumento do resultado ao passar de 5 para 6 R$/US$, sem outros itens?",
        "options": [
          "R$ 100.",
          "R$ 60.",
          "R$ 40.",
          "R$ 160."
        ],
        "answer": 1,
        "explanation": "O resultado passa de 500 − 200 − 100 = 200 para 600 − 240 − 100 = 260.",
        "optionRationales": [
          "É o aumento da receita, sem o aumento do custo.",
          "Correta: 260 − 200 = R$ 60.",
          "É o aumento do custo importado.",
          "Soma aumentos de receita e custo em vez de subtrair."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "ce10-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.ce10.q01": [
          {
            "missionId": "banking.ce.comercio",
            "sectionId": "exportacao"
          },
          {
            "missionId": "banking.ce.comercio",
            "sectionId": "ex-exportacao"
          }
        ],
        "q.ce10.q02": [
          {
            "missionId": "banking.ce.comercio",
            "sectionId": "importacao"
          },
          {
            "missionId": "banking.ce.comercio",
            "sectionId": "ex-importacao"
          }
        ],
        "q.ce10.q03": [
          {
            "missionId": "banking.ce.comercio",
            "sectionId": "resultado"
          },
          {
            "missionId": "banking.ce.comercio",
            "sectionId": "ex-resultado"
          }
        ],
        "q.ce10.q04": [
          {
            "missionId": "banking.ce.comercio",
            "sectionId": "resultado"
          },
          {
            "missionId": "banking.ce.comercio",
            "sectionId": "ex-resultado"
          }
        ],
        "q.ce10.q05": [
          {
            "missionId": "banking.ce.comercio",
            "sectionId": "competitividade"
          },
          {
            "missionId": "banking.ce.comercio",
            "sectionId": "ex-preco"
          }
        ],
        "q.ce10.q06": [
          {
            "missionId": "banking.ce.comercio",
            "sectionId": "competitividade"
          },
          {
            "missionId": "banking.ce.comercio",
            "sectionId": "resultado"
          }
        ],
        "q.ce10.q07": [
          {
            "missionId": "banking.ce.comercio",
            "sectionId": "inicio"
          },
          {
            "missionId": "banking.ce.comercio",
            "sectionId": "ex-importacao"
          }
        ],
        "q.ce10.q08": [
          {
            "missionId": "banking.ce.comercio",
            "sectionId": "ex-resultado"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.ce10",
      "blockId": "banking.capital-exchange",
      "prerequisiteId": "banking.ce.cambio-real",
      "parametersApproved": false
    }
  },
  {
    "id": "banking.ce.fluxos",
    "topicId": "banking.ce.fluxos",
    "contentVersion": 1,
    "order": 48,
    "title": "Juros, risco e fluxos de capitais: relações condicionais",
    "shortTitle": "CE-11",
    "kind": "lesson",
    "objective": "Relacionar juros, risco e câmbio com hipóteses explícitas, reconhecendo que uma taxa maior não garante entrada de recursos nem ganho em outra moeda.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "capital-exchange-intro-r1",
      "releaseSequence": 4,
      "changeImpact": "new"
    },
    "sourceIds": [
      "ce.ce11.bcb.ce.transmissao",
      "ce.ce11.cvm.ce.risco"
    ],
    "sections": [
      {
        "id": "inicio",
        "type": "explanation",
        "heading": "1. Comparar taxas exige ler a moeda e o período",
        "body": "Duas taxas de 10% e 6% só têm comparação temporal direta se se referirem ao mesmo período e à mesma base de apresentação. O diferencial aritmético é 4 pontos percentuais. Isso não é automaticamente um ganho realizável: moedas, custos, riscos e expectativas podem diferir.",
        "sourceIds": []
      },
      {
        "id": "ex-diferencial",
        "type": "worked-example",
        "heading": "2. Exemplo resolvido: pontos percentuais",
        "body": "Duas alternativas informam taxas anuais de 9% e 5%. A diferença é 9 − 5 = 4 pontos percentuais. Não é correto chamar essa diferença de 4% de ganho garantido. Se uma taxa fosse mensal e a outra anual, seria necessário compatibilizar os períodos antes de subtrair.",
        "sourceIds": []
      },
      {
        "id": "moedas",
        "type": "explanation",
        "heading": "3. O caminho de ida e volta",
        "body": "Um investidor que parte de dólares, aplica em reais e volta a dólares depende de duas conversões. No modelo de um período: dólares iniciais × e inicial = reais aplicados; reais finais = reais aplicados × (1 + taxa do período); dólares finais = reais finais ÷ e final. Só então se compara com os dólares iniciais. Rendimento em reais não é o mesmo que retorno em dólares.",
        "sourceIds": []
      },
      {
        "id": "ex-conversao",
        "type": "worked-example",
        "heading": "4. Exemplo resolvido: juros compensados pela cotação",
        "body": "Sem custos, US$ 100 são convertidos a 5 R$/US$, gerando R$ 500. A aplicação paga 10% no período e devolve R$ 550. Se a reconversão ocorre a 5,50 R$/US$, o investidor recebe 550 ÷ 5,50 = US$ 100: retorno de 0% em dólares. A aplicação rendeu em reais, mas o movimento cambial compensou esse rendimento na moeda de partida.",
        "sourceIds": []
      },
      {
        "id": "risco",
        "type": "explanation",
        "heading": "5. Prêmio de risco não é prêmio já recebido",
        "body": "Quem considera uma aplicação mais arriscada pode exigir uma compensação esperada adicional para aceitá-la. Esse prêmio exigido não garante que o valor será realizado. Para interpretar uma diferença entre taxas como compensação de risco, é preciso controlar outras diferenças, como prazo, moeda e características do instrumento; não basta subtrair duas taxas quaisquer.",
        "sourceIds": [
          "ce.ce11.cvm.ce.risco"
        ]
      },
      {
        "id": "ex-risco",
        "type": "worked-example",
        "heading": "6. Exemplo resolvido: comparação com hipóteses",
        "body": "Duas dívidas fictícias têm mesma moeda, prazo e demais condições; o caso informa que a única diferença relevante é o risco de crédito percebido. O retorno exigido passa de 7% para 10% quando o risco é maior. Sob essas hipóteses, a diferença de 3 pontos percentuais expressa a compensação adicional exigida. Não é promessa de receber três pontos extras nem comprovação de que a dívida será paga.",
        "sourceIds": [
          "ce.ce11.cvm.ce.risco"
        ]
      },
      {
        "id": "fluxo",
        "type": "explanation",
        "heading": "7. Como uma entrada pode pressionar a cotação",
        "body": "Se uma entrada de recursos exige vender dólares e comprar reais, ela pode aumentar a demanda por reais e pressionar sua valorização, mantendo os demais fatores constantes. Na convenção R$/US$, isso significa pressão de queda da cotação. Uma saída que exija o movimento oposto pode pressionar a alta. Nem todo movimento internacional passa pela mesma conversão no mesmo instante.",
        "sourceIds": [
          "ce.ce11.bcb.ce.transmissao"
        ]
      },
      {
        "id": "expectativas",
        "type": "explanation",
        "heading": "8. Juros maiores não decidem sozinhos",
        "body": "Uma alta de juros domésticos pode aumentar a atratividade relativa de aplicações e influenciar o câmbio, mas risco, expectativa de inflação, movimento cambial esperado, liquidez e condições externas também importam. Se esses fatores se alteram ao mesmo tempo, não se pode prometer entrada líquida nem valorização do real apenas pela taxa nominal anunciada.",
        "sourceIds": [
          "ce.ce11.bcb.ce.transmissao",
          "ce.ce11.cvm.ce.risco"
        ]
      },
      {
        "id": "ex-cenarios",
        "type": "worked-example",
        "heading": "9. Exemplo resolvido: mesma aplicação, dois câmbios finais",
        "body": "Retome R$ 550 finais originados de US$ 100 a 5 R$/US$. No cenário A, e final é 5: a reconversão dá US$ 110 e ganho de 10%. No B, e final é 5,50: dá US$ 100 e ganho de 0%. A diferença está na reconversão. São cenários dados, não previsão de qual ocorrerá, e não incluem custos.",
        "sourceIds": []
      },
      {
        "id": "glossario",
        "type": "glossary",
        "heading": "10. Vocabulário essencial",
        "body": "Ponto percentual: unidade da diferença entre taxas percentuais. Reconversão: volta à moeda de partida. Prêmio de risco: compensação adicional exigida por uma exposição, sob condições comparáveis. Fluxo: movimento de recursos em um período. Pressão cambial: influência condicional, sem determinação única do preço.",
        "sourceIds": []
      },
      {
        "id": "retomada",
        "type": "summary",
        "heading": "11. Síntese e recuperação",
        "body": "Para confusão de unidades de taxa, volte a inicio e ex-diferencial. Para ganho em outra moeda, refaça as três etapas de moedas e ex-conversao. Para uma garantia indevida, retome risco e ex-risco. Se transformou pressão em previsão, releia fluxo e expectativas, nomeando o que teria de ficar constante.",
        "sourceIds": []
      }
    ],
    "recall": [
      "Explique os conceitos sem consultar e confira a seção de origem.",
      "Refaça o exemplo, separando dados, hipótese e conclusão.",
      "Quando errar, nomeie a confusão e retome as seções indicadas antes de tentar novamente."
    ],
    "questions": [
      {
        "id": "q.ce11.q01",
        "topicId": "banking.ce.fluxos",
        "prompt": "Taxas de 12% e 8% referem-se ao mesmo período. O diferencial aritmético é:",
        "options": [
          "4 reais.",
          "20 pontos percentuais.",
          "4 pontos percentuais.",
          "Ganho garantido de 4% para qualquer investidor."
        ],
        "answer": 2,
        "explanation": "Subtrair percentuais na mesma base produz diferença em pontos percentuais.",
        "optionRationales": [
          "A unidade não é moeda.",
          "Somar não dá o diferencial.",
          "Correta: 12 − 8 = 4 p.p.",
          "O cálculo não elimina outras condições."
        ]
      },
      {
        "id": "q.ce11.q02",
        "topicId": "banking.ce.fluxos",
        "prompt": "US$ 200 viram R$ 1.000 a 5 R$/US$. Após rendimento de 10%, há R$ 1.100. A reconversão a 5,50 R$/US$ produz, sem custos:",
        "options": [
          "US$ 220 e ganho garantido de 10%.",
          "US$ 200 e retorno de 0% em dólares.",
          "US$ 1.100.",
          "US$ 100 e perda de 50%."
        ],
        "answer": 1,
        "explanation": "1.100 ÷ 5,50 = US$ 200, iguais ao valor inicial em dólares.",
        "optionRationales": [
          "Ignora a nova cotação.",
          "Correta: separa rendimento em reais e retorno em dólares.",
          "Falta converter a moeda.",
          "A divisão não resulta em US$ 100."
        ]
      },
      {
        "id": "q.ce11.q03",
        "topicId": "banking.ce.fluxos",
        "prompt": "Em duas dívidas com condições comparáveis, o investidor exige retorno maior por perceber mais risco. Essa compensação exigida:",
        "options": [
          "Já está necessariamente recebida.",
          "Garante ausência de inadimplência.",
          "Pode ser identificada por qualquer diferença de taxas, mesmo com prazos e moedas incompatíveis.",
          "É esperada/exigida, sem garantir o resultado realizado."
        ],
        "answer": 3,
        "explanation": "Prêmio exigido e resultado realizado são conceitos diferentes.",
        "optionRationales": [
          "Exigência não é recebimento.",
          "O risco não desaparece por haver taxa maior.",
          "A comparação precisa controlar as demais diferenças.",
          "Correta: preserva a incerteza."
        ]
      },
      {
        "id": "q.ce11.q04",
        "topicId": "banking.ce.fluxos",
        "prompt": "Uma entrada exige vender dólares e comprar reais. Mantidos os demais fatores, qual pressão é compatível com esse fluxo?",
        "options": [
          "Valorização do real e pressão de queda de R$/US$.",
          "Alta de R$/US$ por definição de qualquer entrada.",
          "Nenhum efeito pode existir em hipótese alguma.",
          "Desvalorização necessária e garantida do real."
        ],
        "answer": 0,
        "explanation": "O fluxo descrito aumenta a demanda por reais, sob a hipótese de outros fatores constantes.",
        "optionRationales": [
          "Correta: usa a conversão e a hipótese informadas.",
          "Inverte o movimento esperado no caso definido.",
          "O canal pode atuar.",
          "Pressão não é garantia e o sentido está invertido."
        ]
      },
      {
        "id": "q.ce11.q05",
        "topicId": "banking.ce.fluxos",
        "prompt": "A taxa doméstica nominal sobe, mas risco e expectativas cambiais também mudam. Qual conclusão é defensável?",
        "options": [
          "Haverá necessariamente entrada líquida.",
          "O real necessariamente se valorizará.",
          "Os demais fatores deixam de importar.",
          "A direção do fluxo e do câmbio não pode ser garantida apenas por essa alta de juros."
        ],
        "answer": 3,
        "explanation": "É necessário considerar as outras mudanças, não só uma variável.",
        "optionRationales": [
          "A entrada não decorre automaticamente de uma taxa.",
          "O câmbio reage a vários fatores.",
          "O enunciado enfatiza mudanças relevantes.",
          "Correta: a relação é condicional."
        ]
      },
      {
        "id": "q.ce11.q06",
        "topicId": "banking.ce.fluxos",
        "prompt": "Uma aplicação devolve R$ 600 e a cotação final é 5 R$/US$. Quantos dólares ela representa, sem custos?",
        "options": [
          "US$ 120.",
          "US$ 3.000.",
          "US$ 600.",
          "US$ 5."
        ],
        "answer": 0,
        "explanation": "Para reconverter reais em dólares, divida 600 por 5.",
        "optionRationales": [
          "Correta: 600 ÷ 5 = 120.",
          "Multiplica na direção errada.",
          "Confunde unidades.",
          "A taxa não é o valor final convertido."
        ]
      },
      {
        "id": "q.ce11.q07",
        "topicId": "banking.ce.fluxos",
        "prompt": "Para uma comparação didática atribuir 3 pontos percentuais adicionais ao risco, qual cuidado é necessário?",
        "options": [
          "Comparar qualquer taxa mensal com qualquer anual diretamente.",
          "Informar condições comparáveis e a hipótese de diferença relevante de risco.",
          "Ignorar a moeda das duas alternativas.",
          "Considerar retorno exigido igual a lucro certo."
        ],
        "answer": 1,
        "explanation": "O exemplo isola o risco para evitar atribuir a ele diferenças que têm outras causas.",
        "optionRationales": [
          "Os períodos precisam ser compatíveis.",
          "Correta: explicita o que foi controlado.",
          "A moeda altera a comparação.",
          "Exigência não garante realização."
        ]
      },
      {
        "id": "q.ce11.q08",
        "topicId": "banking.ce.fluxos",
        "prompt": "Uma saída exige vender reais e comprar dólares. Mantidos os demais fatores, isso pode:",
        "options": [
          "Garantir queda de R$/US$ em qualquer contexto.",
          "Fixar permanentemente a cotação.",
          "Pressionar a alta de R$/US$, sem determinar sozinha o resultado observado.",
          "Provar que toda operação externa funciona do mesmo modo."
        ],
        "answer": 2,
        "explanation": "A demanda por dólares pode exercer pressão, enquanto outros fluxos e fatores também atuam.",
        "optionRationales": [
          "Inverte o canal descrito e o torna absoluto.",
          "O fluxo não cria regime fixo.",
          "Correta: descreve pressão condicional.",
          "O próprio mecanismo depende da conversão informada."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "ce11-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.ce11.q01": [
          {
            "missionId": "banking.ce.fluxos",
            "sectionId": "inicio"
          },
          {
            "missionId": "banking.ce.fluxos",
            "sectionId": "ex-diferencial"
          }
        ],
        "q.ce11.q02": [
          {
            "missionId": "banking.ce.fluxos",
            "sectionId": "moedas"
          },
          {
            "missionId": "banking.ce.fluxos",
            "sectionId": "ex-conversao"
          }
        ],
        "q.ce11.q03": [
          {
            "missionId": "banking.ce.fluxos",
            "sectionId": "risco"
          },
          {
            "missionId": "banking.ce.fluxos",
            "sectionId": "ex-risco"
          }
        ],
        "q.ce11.q04": [
          {
            "missionId": "banking.ce.fluxos",
            "sectionId": "fluxo"
          }
        ],
        "q.ce11.q05": [
          {
            "missionId": "banking.ce.fluxos",
            "sectionId": "expectativas"
          }
        ],
        "q.ce11.q06": [
          {
            "missionId": "banking.ce.fluxos",
            "sectionId": "moedas"
          },
          {
            "missionId": "banking.ce.fluxos",
            "sectionId": "ex-cenarios"
          }
        ],
        "q.ce11.q07": [
          {
            "missionId": "banking.ce.fluxos",
            "sectionId": "ex-diferencial"
          },
          {
            "missionId": "banking.ce.fluxos",
            "sectionId": "risco"
          },
          {
            "missionId": "banking.ce.fluxos",
            "sectionId": "ex-risco"
          }
        ],
        "q.ce11.q08": [
          {
            "missionId": "banking.ce.fluxos",
            "sectionId": "fluxo"
          },
          {
            "missionId": "banking.ce.fluxos",
            "sectionId": "expectativas"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.ce11",
      "blockId": "banking.capital-exchange",
      "prerequisiteId": "banking.ce.comercio",
      "parametersApproved": false
    }
  },
  {
    "id": "banking.ce.revisao",
    "topicId": "banking.ce.revisao",
    "contentVersion": 1,
    "order": 49,
    "title": "Revisão cumulativa: do instrumento ao câmbio",
    "shortTitle": "CE-R",
    "kind": "lesson",
    "objective": "Resolver casos que combinam instrumentos e câmbio, identificando a confusão e retomando a aula que a ensina.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "capital-exchange-intro-r1",
      "releaseSequence": 4,
      "changeImpact": "new"
    },
    "sourceIds": [
      "ce.cer.cvm.ce.acoes",
      "ce.cer.cvm.ce.debentures",
      "ce.cer.cvm.ce.fundos",
      "ce.cer.cvm.ce.risco",
      "ce.cer.lei.14286",
      "ce.cer.bcb.ce.politica",
      "ce.cer.imf.ce.real",
      "ce.cer.bcb.ce.transmissao"
    ],
    "sections": [
      {
        "id": "inicio",
        "type": "explanation",
        "heading": "1. Como usar esta revisão",
        "body": "Tente reconstruir o caminho da resposta antes de olhar o comentário. Para cada erro, escreva uma frase: 'Confundi X com Y'. Em seguida abra a aula de origem indicada na questão, refaça o exemplo correspondente e explique a distinção com seus próprios termos. Repetir a alternativa certa sem recuperar o conceito não demonstra retenção.",
        "sourceIds": []
      },
      {
        "id": "instrumentos",
        "type": "explanation",
        "heading": "2. Instrumento e dinheiro: duas perguntas",
        "body": "Ação representa participação; dívida cria obrigação do emissor; cota representa fração de patrimônio de uma classe de fundo no recorte estudado. Depois pergunte se houve emissão nova ou revenda. A natureza do direito e o destino do dinheiro são dimensões diferentes. Retomada: [CE-01](ce-01-v1.md#mercados), [CE-02](ce-02-v1.md#inicio), [CE-03](ce-03-v1.md#ex-emissor) e [CE-04](ce-04-v1.md#cota).",
        "sourceIds": [
          "ce.cer.cvm.ce.acoes",
          "ce.cer.cvm.ce.debentures",
          "ce.cer.cvm.ce.fundos"
        ],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "Ação representa participação; dívida cria obrigação do emissor; cota representa fração de patrimônio de uma classe de fundo no recorte estudado. Depois pergunte se houve emissão nova ou revenda. A natureza do direito e o destino do dinheiro são dimensões diferentes. Retomada: "
              },
              {
                "text": "CE-01",
                "missionId": "banking.ce.instrumentos",
                "sectionId": "mercados",
                "wholeLesson": false
              },
              {
                "text": ", "
              },
              {
                "text": "CE-02",
                "missionId": "banking.ce.acoes",
                "sectionId": "inicio",
                "wholeLesson": false
              },
              {
                "text": ", "
              },
              {
                "text": "CE-03",
                "missionId": "banking.ce.divida",
                "sectionId": "ex-emissor",
                "wholeLesson": false
              },
              {
                "text": " e "
              },
              {
                "text": "CE-04",
                "missionId": "banking.ce.fundos",
                "sectionId": "cota",
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
        "id": "ex-instrumentos",
        "type": "worked-example",
        "heading": "3. Exemplo resolvido: mesma emissora, direitos distintos",
        "body": "Na hipótese, uma companhia emite novas ações e novas debêntures simples. Ana subscreve ações: torna-se acionista. Bruno subscreve debêntures: torna-se credor. Em ambos os casos os recursos da emissão chegam à companhia, sem custos no exemplo. Se Ana depois vende suas ações a Carla, esse segundo pagamento vai a Ana, sem nova captação pela companhia.",
        "sourceIds": []
      },
      {
        "id": "riscos",
        "type": "explanation",
        "heading": "4. Prazo e risco continuam presentes",
        "body": "Quantidade de cotas não fixa seu preço futuro. Uma dívida não elimina risco de crédito, mercado ou liquidez. Uma classe aberta admite resgates conforme regras, mas isso não significa receber imediatamente em qualquer circunstância. Retomada: [CE-04, movimentação](ce-04-v1.md#movimentacao) e [CE-05, riscos](ce-05-v1.md#riscos).",
        "sourceIds": [
          "ce.cer.cvm.ce.fundos",
          "ce.cer.cvm.ce.risco"
        ],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "Quantidade de cotas não fixa seu preço futuro. Uma dívida não elimina risco de crédito, mercado ou liquidez. Uma classe aberta admite resgates conforme regras, mas isso não significa receber imediatamente em qualquer circunstância. Retomada: "
              },
              {
                "text": "CE-04, movimentação",
                "missionId": "banking.ce.fundos",
                "sectionId": "movimentacao",
                "wholeLesson": false
              },
              {
                "text": " e "
              },
              {
                "text": "CE-05, riscos",
                "missionId": "banking.ce.riscos",
                "sectionId": "riscos",
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
        "id": "ex-riscos",
        "type": "worked-example",
        "heading": "5. Exemplo resolvido: do pedido ao dinheiro",
        "body": "No caso fictício, 30 cotas são resgatadas segundo valor de R$ 12 na conversão: R$ 360, sem encargos. O regulamento do caso separa o dia de pedido do dia de pagamento. Pedir resgate não antecipa automaticamente o recebimento. A quantidade 30, sozinha, também não prova que o resultado foi positivo: seria necessário conhecer a aplicação inicial e os demais fluxos.",
        "sourceIds": []
      },
      {
        "id": "cambio",
        "type": "explanation",
        "heading": "6. Taxa, operação e regime",
        "body": "Escreva a unidade da taxa e a perspectiva de compra/venda. Identifique a instituição e a finalidade da operação. Para classificar regime, leia o compromisso institucional: um episódio de intervenção não resolve a questão. Retomada: [CE-06](ce-06-v1.md#conversao), [CE-07](ce-07-v1.md#autorizacao) e [CE-08](ce-08-v1.md#flutuante).",
        "sourceIds": [
          "ce.cer.lei.14286",
          "ce.cer.bcb.ce.politica"
        ],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "Escreva a unidade da taxa e a perspectiva de compra/venda. Identifique a instituição e a finalidade da operação. Para classificar regime, leia o compromisso institucional: um episódio de intervenção não resolve a questão. Retomada: "
              },
              {
                "text": "CE-06",
                "missionId": "banking.ce.cotacao",
                "sectionId": "conversao",
                "wholeLesson": false
              },
              {
                "text": ", "
              },
              {
                "text": "CE-07",
                "missionId": "banking.ce.operacoes",
                "sectionId": "autorizacao",
                "wholeLesson": false
              },
              {
                "text": " e "
              },
              {
                "text": "CE-08",
                "missionId": "banking.ce.regimes",
                "sectionId": "flutuante",
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
        "id": "ex-conversao",
        "type": "worked-example",
        "heading": "7. Exemplo resolvido: compra do cliente",
        "body": "Uma instituição informa compra de dólar a R$ 4,90 e venda a R$ 5,10, na perspectiva dela. O cliente compra US$ 40 sem outros custos: utiliza a venda da instituição e paga 40 × 5,10 = R$ 204. O exercício não identifica o regime do país nem prova que a instituição esteja habilitada; esses dados exigem informações próprias.",
        "sourceIds": []
      },
      {
        "id": "efeitos",
        "type": "explanation",
        "heading": "8. A mesma taxa em perguntas diferentes",
        "body": "Com q = e × P* ÷ P, é preciso acompanhar também os preços. Para receitas e despesas em dólares, mantenha contratos e custos explícitos. Para aplicar em reais e voltar a dólares, refaça as duas conversões. Retomada: [CE-09](ce-09-v1.md#formula), [CE-10](ce-10-v1.md#resultado) e [CE-11](ce-11-v1.md#moedas). Uma pressão sobre a cotação não é previsão garantida.",
        "sourceIds": [
          "ce.cer.imf.ce.real",
          "ce.cer.bcb.ce.transmissao"
        ],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "Com q = e × P* ÷ P, é preciso acompanhar também os preços. Para receitas e despesas em dólares, mantenha contratos e custos explícitos. Para aplicar em reais e voltar a dólares, refaça as duas conversões. Retomada: "
              },
              {
                "text": "CE-09",
                "missionId": "banking.ce.cambio-real",
                "sectionId": "formula",
                "wholeLesson": false
              },
              {
                "text": ", "
              },
              {
                "text": "CE-10",
                "missionId": "banking.ce.comercio",
                "sectionId": "resultado",
                "wholeLesson": false
              },
              {
                "text": " e "
              },
              {
                "text": "CE-11",
                "missionId": "banking.ce.fluxos",
                "sectionId": "moedas",
                "wholeLesson": false
              },
              {
                "text": ". Uma pressão sobre a cotação não é previsão garantida."
              }
            ]
          }
        ]
      },
      {
        "id": "ex-efeitos",
        "type": "worked-example",
        "heading": "9. Exemplo resolvido: separar duas contas",
        "body": "Um caso informa e = 5, preço externo da cesta US$ 8 e preço doméstico R$ 40: q = 5 × 8 ÷ 40 = 1. Outro contrato, independente, prevê receita US$ 50 e despesa US$ 20, sem outros custos: resultado em reais = (50 − 20) × 5 = R$ 150. q é uma comparação de preços; R$ 150 é um resultado monetário do contrato. Não se confundem as unidades nem se usa um como prova de equilíbrio do outro.",
        "sourceIds": []
      },
      {
        "id": "glossario",
        "type": "glossary",
        "heading": "10. Vocabulário para separar confusões",
        "body": "Emissor: quem emite o instrumento. Cotista: titular de cotas. Crédito: cumprimento da obrigação. Liquidez: condição de converter em dinheiro. Cotação: relação entre moedas. Regime: regra de formação da taxa. Câmbio real: comparação ajustada pelos preços, conforme convenção. Diferencial: diferença entre taxas comparáveis. Prêmio de risco: compensação exigida, sem promessa de realização.",
        "sourceIds": []
      },
      {
        "id": "resumo",
        "type": "summary",
        "heading": "11. Síntese e recuperação",
        "body": "O caminho é instrumento → direito → fluxo → prazo/risco → moeda → hipótese → cálculo → limite da conclusão. As oito questões abaixo reaplicam esse caminho em casos novos; cada uma remete às seções de origem. As 11 aulas estão representadas nas referências. Prática comentada e conclusão de ciclos não equivalem a uma avaliação independente de prontidão.",
        "sourceIds": []
      }
    ],
    "recall": [
      "Explique os conceitos sem consultar e confira a seção de origem.",
      "Refaça o exemplo, separando dados, hipótese e conclusão.",
      "Quando errar, nomeie a confusão e retome as seções indicadas antes de tentar novamente."
    ],
    "questions": [
      {
        "id": "q.cer.q01",
        "topicId": "banking.ce.revisao",
        "prompt": "Uma companhia emite ações e debêntures simples novas. Lia subscreve as ações e Rui, as debêntures. Sem custos no caso, qual leitura é correta?",
        "options": [
          "Ambos se tornam proprietários de ações.",
          "Lia é acionista, Rui é credor e a companhia recebe os recursos dessas emissões.",
          "A companhia não recebe recursos de nenhuma emissão.",
          "Rui recebe direito de voto de acionista apenas por ter a debênture simples."
        ],
        "answer": 1,
        "explanation": "O tipo de instrumento define o direito; a emissão nova define o destino inicial do recurso.",
        "optionRationales": [
          "Debênture simples não é ação.",
          "Correta: separa participação, dívida e captação.",
          "Confunde emissão nova com revenda.",
          "O crédito não cria automaticamente voto societário."
        ]
      },
      {
        "id": "q.cer.q02",
        "topicId": "banking.ce.revisao",
        "prompt": "Uma classe aberta prevê pedido, conversão e pagamento em datas distintas. O cotista pede resgate, sem informação de conversão imediata. É correto concluir que:",
        "options": [
          "O dinheiro necessariamente está disponível no mesmo momento.",
          "A palavra 'aberta' elimina risco de mercado.",
          "O número de cotas determina sozinho o ganho.",
          "É preciso observar os prazos e condições; o pedido não é o pagamento."
        ],
        "answer": 3,
        "explanation": "A admissão de resgate não iguala suas etapas nem garante resultado.",
        "optionRationales": [
          "Contraria a separação de datas informada.",
          "O preço pode variar mesmo em classe aberta.",
          "Faltam preços e fluxos da aplicação.",
          "Correta: lê a condição efetiva de liquidez."
        ]
      },
      {
        "id": "q.cer.q03",
        "topicId": "banking.ce.revisao",
        "prompt": "Uma instituição identificada informa, na perspectiva dela, compra a 4,70 e venda a 5,30 R$/US$. Sem outros custos, o cliente que compra US$ 20:",
        "options": [
          "Paga R$ 106; a habilitação da instituição é uma verificação própria.",
          "Paga R$ 94, e o preço sozinho prova autorização.",
          "Paga R$ 100, usando a média obrigatória.",
          "Recebe R$ 106, porque compra e venda são sempre do cliente."
        ],
        "answer": 0,
        "explanation": "A instituição vende: 20 × 5,30 = R$ 106. Cotação não comprova autorização.",
        "optionRationales": [
          "Correta: resolve a conversão sem inferir habilitação do preço.",
          "Usa a ponta contrária e uma conclusão indevida.",
          "Não há obrigação de usar média.",
          "O cliente paga para comprar, e a perspectiva foi declarada."
        ]
      },
      {
        "id": "q.cer.q04",
        "topicId": "banking.ce.revisao",
        "prompt": "A taxa é formada no mercado e a autoridade intervém em uma disfunção, sem anunciar paridade a defender. Esse episódio:",
        "options": [
          "Prova regime fixo permanente.",
          "Prova uma banda de limites conhecidos.",
          "É compatível com flutuação; intervenção isolada não prova mudança de regime.",
          "Impede que o país adote flutuação."
        ],
        "answer": 2,
        "explanation": "A finalidade e o compromisso institucional importam para a classificação.",
        "optionRationales": [
          "Não existe compromisso fixo informado.",
          "Não foram informados limites.",
          "Correta: evita classificar apenas pelo evento.",
          "Flutuação não requer inação absoluta."
        ]
      },
      {
        "id": "q.cer.q05",
        "topicId": "banking.ce.revisao",
        "prompt": "Use q = e × P* ÷ P. e permanece 4 R$/US$ e P* permanece US$ 10; P sobe de R$ 32 para R$ 40. q:",
        "options": [
          "Fica constante porque e não mudou.",
          "Sobe de 1 para 1,25.",
          "Prova que a cotação estava em equilíbrio quando q era 1.",
          "Cai de 1,25 para 1, apesar da cotação nominal constante."
        ],
        "answer": 3,
        "explanation": "O numerador permanece R$ 40 e o denominador sobe: 40 ÷ 32 e 40 ÷ 40.",
        "optionRationales": [
          "Ignora o preço doméstico.",
          "Inverte antes e depois.",
          "q igual a 1 no modelo não demonstra equilíbrio econômico.",
          "Correta: os preços também alteram a medida real."
        ]
      },
      {
        "id": "q.cer.q06",
        "topicId": "banking.ce.revisao",
        "prompt": "Uma firma recebe US$ 70, paga US$ 20 de insumos e R$ 50 de outros custos. A 5 R$/US$, sem outros itens, o resultado é:",
        "options": [
          "R$ 350.",
          "R$ 200.",
          "R$ 250.",
          "US$ 200."
        ],
        "answer": 1,
        "explanation": "Receita R$ 350 menos custo importado R$ 100 menos custo local R$ 50 = R$ 200.",
        "optionRationales": [
          "É a receita antes dos custos.",
          "Correta: deduz os dois custos.",
          "Falta deduzir o custo local.",
          "A conta pedida usa reais."
        ]
      },
      {
        "id": "q.cer.q07",
        "topicId": "banking.ce.revisao",
        "prompt": "US$ 50 são convertidos a 4 R$/US$ e rendem 10% em reais no período. Sem custos, a reconversão a 4,40 R$/US$ dá:",
        "options": [
          "US$ 55, pois rendimento em reais e em dólares sempre coincide.",
          "US$ 220, ignorando a unidade.",
          "US$ 50; o retorno em dólares foi zero no caso.",
          "Ganho garantido de 10% em qualquer cotação."
        ],
        "answer": 2,
        "explanation": "São R$ 200 iniciais, R$ 220 finais e 220 ÷ 4,40 = US$ 50.",
        "optionRationales": [
          "Ignora a nova taxa de conversão.",
          "Confunde reais com dólares.",
          "Correta: contabiliza as duas conversões.",
          "O câmbio final faz parte do resultado."
        ]
      },
      {
        "id": "q.cer.q08",
        "topicId": "banking.ce.revisao",
        "prompt": "Um anúncio afirma: 'A taxa doméstica subiu; portanto a moeda certamente vai valorizar e qualquer aplicação local terá lucro em dólares'. Qual resposta é adequada?",
        "options": [
          "Juros podem influenciar fluxos, mas riscos, expectativas e reconversão impedem essa garantia.",
          "A promessa está correta porque uma taxa elimina todos os riscos.",
          "A conclusão independe do câmbio de saída.",
          "O retorno esperado é igual ao realizado por definição."
        ],
        "answer": 0,
        "explanation": "O anúncio transforma relações condicionais em certeza sobre o retorno.",
        "optionRationales": [
          "Correta: considera os fatores ensinados.",
          "Taxa maior não elimina riscos.",
          "A reconversão altera o valor na moeda inicial.",
          "Expectativa não é resultado recebido."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "cer-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.cer.q01": [
          {
            "missionId": "banking.ce.revisao",
            "sectionId": "instrumentos"
          },
          {
            "missionId": "banking.ce.revisao",
            "sectionId": "ex-instrumentos"
          },
          {
            "missionId": "banking.ce.instrumentos",
            "sectionId": "mercados"
          },
          {
            "missionId": "banking.ce.acoes",
            "sectionId": "inicio"
          },
          {
            "missionId": "banking.ce.divida",
            "sectionId": "inicio"
          }
        ],
        "q.cer.q02": [
          {
            "missionId": "banking.ce.revisao",
            "sectionId": "riscos"
          },
          {
            "missionId": "banking.ce.revisao",
            "sectionId": "ex-riscos"
          },
          {
            "missionId": "banking.ce.fundos",
            "sectionId": "movimentacao"
          },
          {
            "missionId": "banking.ce.riscos",
            "sectionId": "riscos"
          }
        ],
        "q.cer.q03": [
          {
            "missionId": "banking.ce.revisao",
            "sectionId": "cambio"
          },
          {
            "missionId": "banking.ce.revisao",
            "sectionId": "ex-conversao"
          },
          {
            "missionId": "banking.ce.cotacao",
            "sectionId": "perspectiva"
          },
          {
            "missionId": "banking.ce.operacoes",
            "sectionId": "autorizacao"
          }
        ],
        "q.cer.q04": [
          {
            "missionId": "banking.ce.revisao",
            "sectionId": "cambio"
          },
          {
            "missionId": "banking.ce.regimes",
            "sectionId": "flutuante"
          },
          {
            "missionId": "banking.ce.regimes",
            "sectionId": "ex-flutuante"
          }
        ],
        "q.cer.q05": [
          {
            "missionId": "banking.ce.revisao",
            "sectionId": "efeitos"
          },
          {
            "missionId": "banking.ce.revisao",
            "sectionId": "ex-efeitos"
          },
          {
            "missionId": "banking.ce.cambio-real",
            "sectionId": "formula"
          },
          {
            "missionId": "banking.ce.cambio-real",
            "sectionId": "ex-precos"
          }
        ],
        "q.cer.q06": [
          {
            "missionId": "banking.ce.revisao",
            "sectionId": "efeitos"
          },
          {
            "missionId": "banking.ce.revisao",
            "sectionId": "ex-efeitos"
          },
          {
            "missionId": "banking.ce.comercio",
            "sectionId": "resultado"
          },
          {
            "missionId": "banking.ce.comercio",
            "sectionId": "ex-resultado"
          }
        ],
        "q.cer.q07": [
          {
            "missionId": "banking.ce.revisao",
            "sectionId": "efeitos"
          },
          {
            "missionId": "banking.ce.fluxos",
            "sectionId": "moedas"
          },
          {
            "missionId": "banking.ce.fluxos",
            "sectionId": "ex-conversao"
          },
          {
            "missionId": "banking.ce.cotacao",
            "sectionId": "conversao"
          }
        ],
        "q.cer.q08": [
          {
            "missionId": "banking.ce.revisao",
            "sectionId": "riscos"
          },
          {
            "missionId": "banking.ce.revisao",
            "sectionId": "efeitos"
          },
          {
            "missionId": "banking.ce.riscos",
            "sectionId": "retorno"
          },
          {
            "missionId": "banking.ce.fluxos",
            "sectionId": "expectativas"
          },
          {
            "missionId": "banking.ce.fluxos",
            "sectionId": "fluxo"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.cer",
      "blockId": "banking.capital-exchange",
      "prerequisiteId": "banking.ce.fluxos",
      "parametersApproved": false
    }
  },
  {
    "id": "banking.ce.boss",
    "topicId": "banking.ce.boss",
    "contentVersion": 1,
    "order": 50,
    "title": "Chefe de Capitais e Câmbio: conecte os dados do caso",
    "shortTitle": "CE-CHEFE",
    "kind": "boss",
    "objective": "Integrar instrumentos, riscos e câmbio em doze casos próprios, explicando hipóteses e limites com recuperação nas aulas de origem.",
    "xp": 220,
    "passScore": 75,
    "estimatedMinutes": 30,
    "publication": {
      "status": "draft",
      "releaseId": "capital-exchange-intro-r1",
      "releaseSequence": 4,
      "changeImpact": "new"
    },
    "sourceIds": [
      "ce.cechefe.cvm.ce.acoes",
      "ce.cechefe.lei.6404",
      "ce.cechefe.cvm.ce.debentures",
      "ce.cechefe.cvm.ce.bancarios",
      "ce.cechefe.cvm.ce.fundos",
      "ce.cechefe.cvm.ce.risco",
      "ce.cechefe.bcb.ce.conceito",
      "ce.cechefe.lei.14286",
      "ce.cechefe.bcb.ce.politica",
      "ce.cechefe.imf.ce.real",
      "ce.cechefe.bcb.ce.transmissao"
    ],
    "sections": [
      {
        "id": "preparacao",
        "type": "explanation",
        "heading": "1. Ensino antes do desafio",
        "body": "As aulas [CE-01](ce-01-v1.md), [CE-02](ce-02-v1.md), [CE-03](ce-03-v1.md), [CE-04](ce-04-v1.md), [CE-05](ce-05-v1.md), [CE-06](ce-06-v1.md), [CE-07](ce-07-v1.md), [CE-08](ce-08-v1.md), [CE-09](ce-09-v1.md), [CE-10](ce-10-v1.md) e [CE-11](ce-11-v1.md) ensinam os conceitos cobrados. A [revisão CE-R](ce-r-v1.md) prepara a recuperação. Leia o ensino antes de usar o comentário de uma questão. Os exemplos são fictícios e não descrevem ofertas ou cotações atuais.",
        "sourceIds": [],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "As aulas "
              },
              {
                "text": "CE-01",
                "missionId": "banking.ce.instrumentos",
                "sectionId": "inicio",
                "wholeLesson": true
              },
              {
                "text": ", "
              },
              {
                "text": "CE-02",
                "missionId": "banking.ce.acoes",
                "sectionId": "inicio",
                "wholeLesson": true
              },
              {
                "text": ", "
              },
              {
                "text": "CE-03",
                "missionId": "banking.ce.divida",
                "sectionId": "inicio",
                "wholeLesson": true
              },
              {
                "text": ", "
              },
              {
                "text": "CE-04",
                "missionId": "banking.ce.fundos",
                "sectionId": "inicio",
                "wholeLesson": true
              },
              {
                "text": ", "
              },
              {
                "text": "CE-05",
                "missionId": "banking.ce.riscos",
                "sectionId": "inicio",
                "wholeLesson": true
              },
              {
                "text": ", "
              },
              {
                "text": "CE-06",
                "missionId": "banking.ce.cotacao",
                "sectionId": "inicio",
                "wholeLesson": true
              },
              {
                "text": ", "
              },
              {
                "text": "CE-07",
                "missionId": "banking.ce.operacoes",
                "sectionId": "inicio",
                "wholeLesson": true
              },
              {
                "text": ", "
              },
              {
                "text": "CE-08",
                "missionId": "banking.ce.regimes",
                "sectionId": "inicio",
                "wholeLesson": true
              },
              {
                "text": ", "
              },
              {
                "text": "CE-09",
                "missionId": "banking.ce.cambio-real",
                "sectionId": "inicio",
                "wholeLesson": true
              },
              {
                "text": ", "
              },
              {
                "text": "CE-10",
                "missionId": "banking.ce.comercio",
                "sectionId": "inicio",
                "wholeLesson": true
              },
              {
                "text": " e "
              },
              {
                "text": "CE-11",
                "missionId": "banking.ce.fluxos",
                "sectionId": "inicio",
                "wholeLesson": true
              },
              {
                "text": " ensinam os conceitos cobrados. A "
              },
              {
                "text": "revisão CE-R",
                "missionId": "banking.ce.revisao",
                "sectionId": "inicio",
                "wholeLesson": true
              },
              {
                "text": " prepara a recuperação. Leia o ensino antes de usar o comentário de uma questão. Os exemplos são fictícios e não descrevem ofertas ou cotações atuais."
              }
            ]
          }
        ]
      },
      {
        "id": "roteiro",
        "type": "explanation",
        "heading": "2. Seis grupos para organizar a leitura",
        "body": "Itens 1–2: identifique instrumento, direito, emissor e destino do pagamento. Itens 3–4: leia cota, prazo, custos e risco. Itens 5–6: marque moeda, perspectiva, finalidade e instituição. Itens 7–8: procure a regra cambial, sem classificá-la por um único episódio. Itens 9–10: separe preços relativos, receitas e resultado. Itens 11–12: complete a reconversão e mantenha as relações condicionais. Nenhum grupo cria uma nota de domínio por conceito.",
        "sourceIds": []
      },
      {
        "id": "exemplo-metodo",
        "type": "worked-example",
        "heading": "3. Exemplo resolvido: não responder antes de identificar a unidade",
        "body": "Uma anotação fictícia traz apenas '5% no período'. Primeiro, falta saber se é juros contratados, retorno realizado, variação de cotação ou outra medida. Segundo, falta saber a base e a moeda, quando pertinentes. Terceiro, o número sozinho não permite escolher o maior lucro em reais ou em dólares. A conclusão correta é identificar os dados que faltam. Nos casos seguintes esses dados são informados; use somente as condições efetivamente dadas.",
        "sourceIds": []
      },
      {
        "id": "glossario",
        "type": "glossary",
        "heading": "4. Termos que ajudam a conferir",
        "body": "Emissão: criação de instrumentos; revenda: negociação de instrumento existente. Participação: fração societária sob o total informado. Credor: titular de direito de crédito. Cota: fração do patrimônio da classe no recorte estudado. Conversão: cálculo entre moedas ou determinação do valor de cotas, conforme o contexto. Paridade/banda: compromisso cambial descrito. Índice base 100: comparação normalizada. Ponto percentual: diferença entre taxas percentuais comparáveis. Reconversão: retorno à moeda de partida.",
        "sourceIds": []
      },
      {
        "id": "recuperacao",
        "type": "summary",
        "heading": "5. Corrigir a confusão, sem inferir prontidão",
        "body": "Tente responder e justificar antes de abrir o comentário. Se errar, nomeie o dado ou conceito confundido e siga o link da aula de origem. Refaça o exemplo e explique por que cada distrator não atende ao caso. Estes itens são próprios do Chefe, mas ficam expostos nesta prática; não compõem avaliação independente. Repetição, acerto ou conclusão de ciclos não comprovam retenção duradoura ou prontidão.",
        "sourceIds": []
      }
    ],
    "recall": [
      "Explique os conceitos sem consultar e confira a seção de origem.",
      "Refaça o exemplo, separando dados, hipótese e conclusão.",
      "Quando errar, nomeie a confusão e retome as seções indicadas antes de tentar novamente."
    ],
    "questions": [
      {
        "id": "q.cechefe.q01",
        "topicId": "banking.ce.boss",
        "prompt": "Após uma emissão nova, uma companhia tem 1.500 ações da mesma espécie/classe. Ivo subscreveu 60 delas a R$ 10 cada. Depois, Nara revendeu 25 ações que já possuía a outro investidor por R$ 12 cada. Sem custos, qual leitura reúne os fatos corretamente?",
        "options": [
          "A companhia recebe os dois pagamentos e Ivo tem 60% das ações.",
          "Ivo tem 4% das ações; a companhia recebe R$ 600 na subscrição e Nara recebe R$ 300 na revenda.",
          "Nara recebe R$ 600 da emissão e a companhia recebe R$ 300 da revenda.",
          "Ivo se torna credor da companhia, sem participação societária."
        ],
        "answer": 1,
        "explanation": "Ivo possui 60 ÷ 1.500 = 4%. A subscrição rende 60 × 10 = R$ 600 à emissora; a revenda rende 25 × 12 = R$ 300 à vendedora.",
        "optionRationales": [
          "Revenda não gera nova captação pela companhia, e o percentual está errado.",
          "Correta: separa participação e os dois destinos do dinheiro.",
          "Troca os destinatários das duas operações.",
          "A compra de ações representa participação, não a dívida descrita em uma debênture simples."
        ]
      },
      {
        "id": "q.cechefe.q02",
        "topicId": "banking.ce.boss",
        "prompt": "Uma plataforma distribui um CDB emitido pelo Banco Lago: aplicação de R$ 900, remuneração de 6% em um único período e pagamento ao fim, se cumpridas as obrigações. O caso não concede resgate antecipado pelo emissor, mas há oferta de terceiro para comprar o título por R$ 870 hoje. Sem outros fluxos ou custos, qual conclusão é correta?",
        "options": [
          "A plataforma substitui o Banco Lago como devedora do CDB.",
          "Aceitar R$ 870 produz o mesmo ganho do pagamento contratual ao fim.",
          "A existência de 6% garante receber hoje R$ 954 de qualquer comprador.",
          "O Banco Lago é o emissor; o pagamento contratual seria R$ 954 ao fim sob a hipótese dada, e a venda por R$ 870 realizaria perda de R$ 30."
        ],
        "answer": 3,
        "explanation": "900 × 1,06 = 954 no vencimento sob cumprimento. Na venda proposta, 870 − 900 = −30. O distribuidor não troca o emissor nem garante o preço de saída.",
        "optionRationales": [
          "O enunciado identifica o banco como emissor.",
          "Preço de venda e pagamento futuro são diferentes.",
          "A remuneração contratada não determina a oferta de terceiro nem elimina a hipótese de cumprimento.",
          "Correta: mantém emissor, prazo, condição e resultado da saída."
        ]
      },
      {
        "id": "q.cechefe.q03",
        "topicId": "banking.ce.boss",
        "prompt": "Em uma data inicial, uma classe com única subclasse tem patrimônio líquido de R$ 9.000 e 750 cotas. Em data posterior, um pedido de resgate de 25 cotas é convertido a R$ 13 por cota, com pagamento dois dias úteis depois, conforme as condições do caso. Sem encargos, qual leitura é correta?",
        "options": [
          "A cota inicial era R$ 12; o resgate convertido é R$ 325, a receber na data de pagamento informada.",
          "A cota inicial era R$ 13 e o pedido garante recebimento imediato.",
          "As 25 cotas dão direito a todo o patrimônio de R$ 9.000.",
          "A quantidade de cotas impede qualquer mudança do seu preço entre datas."
        ],
        "answer": 0,
        "explanation": "9.000 ÷ 750 = R$ 12 inicialmente. O valor do resgate usa a conversão posterior: 25 × 13 = R$ 325, respeitado o prazo de pagamento.",
        "optionRationales": [
          "Correta: separa preço inicial, conversão e pagamento.",
          "Confunde as datas e ignora o prazo.",
          "O cotista possui apenas as cotas indicadas.",
          "Quantidade não fixa valor de cota."
        ]
      },
      {
        "id": "q.cechefe.q04",
        "topicId": "banking.ce.boss",
        "prompt": "Uma aplicação de R$ 750 resulta em recebimento bruto de R$ 840 e custos totais de R$ 15 no período. Em outra situação, o emissor deixa de pagar uma obrigação contratada. Qual alternativa combina corretamente a conta e o risco destacado?",
        "options": [
          "Ganho líquido R$ 90 e risco necessariamente apenas de liquidez.",
          "Taxa líquida de 12% e ausência de risco em dívida.",
          "Ganho líquido R$ 75, taxa líquida de 10% e evento de risco de crédito na outra situação.",
          "Ganho líquido R$ 840 e risco de mercado comprovado apenas pela falta de pagamento."
        ],
        "answer": 2,
        "explanation": "840 − 750 − 15 = R$ 75; 75 ÷ 750 = 10%. O descumprimento da obrigação destaca crédito, sem excluir outros riscos possíveis.",
        "optionRationales": [
          "R$ 90 é o ganho antes dos custos; falta de pagamento não é somente dificuldade de venda.",
          "12% é a taxa bruta, e dívida não elimina risco.",
          "Correta: usa a base inicial, os custos e a definição do evento.",
          "R$ 840 inclui principal; inadimplência não é apenas variação de preço."
        ]
      },
      {
        "id": "q.cechefe.q05",
        "topicId": "banking.ce.boss",
        "prompt": "Uma instituição informa, na perspectiva dela, compra do dólar a R$ 5,20 e venda a R$ 5,40. Um cliente vende US$ 150 à instituição, sem outros custos. Quanto recebe?",
        "options": [
          "R$ 810, porque toda operação do cliente usa a venda da instituição.",
          "US$ 780, pois multiplicar não altera a moeda.",
          "R$ 795, pois é obrigatório usar a média das duas pontas.",
          "R$ 780, usando a compra da instituição."
        ],
        "answer": 3,
        "explanation": "A instituição compra os dólares: 150 × 5,20 = R$ 780. O cliente vende, logo não usa a taxa de venda da instituição.",
        "optionRationales": [
          "Escolhe a ponta contrária à operação.",
          "O produto da conversão está em reais.",
          "Nenhuma média foi contratada.",
          "Correta: identifica a perspectiva e converte na direção certa."
        ]
      },
      {
        "id": "q.cechefe.q06",
        "topicId": "banking.ce.boss",
        "prompt": "Uma cliente envia recursos próprios para sua conta no exterior. O canal é um aplicativo que informa o nome da instituição responsável e apresenta uma cotação. Qual leitura evita presumir dados não informados?",
        "options": [
          "Toda remessa para conta própria é pagamento de importação.",
          "A finalidade descrita é remessa à conta própria; cabe conferir a habilitação pertinente da instituição, e o preço isolado não comprova autorização.",
          "O aplicativo substitui os deveres da instituição e dispensa identificar a finalidade.",
          "Toda cotação diferente daquela de outra instituição é necessariamente ilegal."
        ],
        "answer": 1,
        "explanation": "O motivo da transferência não é compra de mercadoria. Identificação e autorização devem ser verificadas para a atividade; a taxa pode ser pactuada dentro da legislação.",
        "optionRationales": [
          "Enviar recursos não implica compra do exterior.",
          "Correta: separa finalidade, canal, preço e habilitação.",
          "O canal não elimina responsabilidades.",
          "Diferença de preço, sozinha, não demonstra irregularidade."
        ]
      },
      {
        "id": "q.cechefe.q07",
        "topicId": "banking.ce.boss",
        "prompt": "No país fictício A, a autoridade se compromete a defender os limites de 5,10 e 5,70 unidades domésticas por unidade estrangeira, admitindo variação dentro da faixa. No país B, o relatório apenas registra que a taxa oscilou entre esses números na semana, sem informar compromisso. Qual interpretação é sustentada?",
        "options": [
          "Ambos têm obrigatoriamente a mesma banda oficial.",
          "A tem uma paridade única fixa em 5,40.",
          "A descreve uma banda; em B, a faixa observada não basta para identificar o regime.",
          "B garante que a taxa ficará na mesma faixa na semana seguinte."
        ],
        "answer": 2,
        "explanation": "O compromisso institucional diferencia uma banda de uma faixa de preços passados.",
        "optionRationales": [
          "O relatório de B não declara regra da autoridade.",
          "A faixa tem dois limites, não uma única paridade.",
          "Correta: não transforma estatística observada em compromisso.",
          "A observação passada não garante preços futuros."
        ]
      },
      {
        "id": "q.cechefe.q08",
        "topicId": "banking.ce.boss",
        "prompt": "Em um país, a taxa é formada no mercado. A autoridade realiza uma intervenção para melhorar negociações durante uma disfunção, sem anunciar paridade a defender. O preço permanece igual em alguns dias. Esses fatos permitem concluir que:",
        "options": [
          "São compatíveis com flutuação; intervenção e estabilidade temporária não provam, sozinhas, mudança para regime fixo.",
          "A intervenção necessariamente criou uma paridade permanente.",
          "A estabilidade de alguns dias revogou a formação de mercado.",
          "Toda flutuação proíbe qualquer atuação da autoridade."
        ],
        "answer": 0,
        "explanation": "A classificação depende da regra institucional; os episódios descritos não criam o compromisso de uma paridade.",
        "optionRationales": [
          "Correta: mantém os limites da evidência.",
          "Não há compromisso anunciado que sustente isso.",
          "Um preço repetido não determina mudança institucional.",
          "Flutuação não exige ausência absoluta de intervenção."
        ]
      },
      {
        "id": "q.cechefe.q09",
        "topicId": "banking.ce.boss",
        "prompt": "Use q = e × P* ÷ P. Na data atual, e = 6 R$/US$, P* = US$ 9 e P = R$ 45 para a cesta comparável. Na base, q₀ = 1 e o índice vale 100. Qual conclusão é correta?",
        "options": [
          "O índice atual é 120; isso compara q com a base, sem provar por si só afastamento de um câmbio de equilíbrio.",
          "O índice atual é 54, igual ao preço estrangeiro convertido.",
          "q atual é 120 e, portanto, a cotação nominal também é 120 R$/US$.",
          "O índice prova que qualquer investimento terá ganho de 20%."
        ],
        "answer": 0,
        "explanation": "6 × 9 = R$ 54; q = 54 ÷ 45 = 1,20; índice = 1,20 ÷ 1 × 100 = 120. Índice não é taxa de retorno ou prova isolada de equilíbrio.",
        "optionRationales": [
          "Correta: calcula e limita a interpretação.",
          "R$ 54 é uma etapa, ainda sem dividir pelo preço doméstico.",
          "Confunde nível q, índice e cotação.",
          "Comparação de preços não garante rendimento de aplicação."
        ]
      },
      {
        "id": "q.cechefe.q10",
        "topicId": "banking.ce.boss",
        "prompt": "Uma firma receberá US$ 150 por exportação, pagará US$ 60 de insumos e terá R$ 120 de outros custos. Todos esses valores e quantidades permanecem fixos no período do caso, sem outros itens. Se e passar de 4 para 5 R$/US$, o resultado em reais:",
        "options": [
          "Aumenta R$ 150, exatamente como a receita.",
          "Cai R$ 60, porque somente o custo importado reage.",
          "Aumenta R$ 90, de R$ 240 para R$ 330, sem demonstrar aumento da quantidade exportada.",
          "Permanece igual, pois todo exportador tem compensação cambial perfeita."
        ],
        "answer": 2,
        "explanation": "Antes: 600 − 240 − 120 = R$ 240. Depois: 750 − 300 − 120 = R$ 330. A diferença é R$ 90; as quantidades foram mantidas.",
        "optionRationales": [
          "Ignora que o custo importado também sobe.",
          "Ignora a receita em dólares.",
          "Correta: considera ambos os fluxos e a hipótese de quantidade fixa.",
          "Os fluxos em dólares não têm o mesmo valor no caso."
        ]
      },
      {
        "id": "q.cechefe.q11",
        "topicId": "banking.ce.boss",
        "prompt": "Sem custos, US$ 80 são convertidos a 5 R$/US$ e aplicados por um ano a 5%, resultando em R$ 420. A taxa de uma alternativa em dólares é 2% para o mesmo ano. Na reconversão da aplicação em reais, e é 6 R$/US$. Qual leitura é correta?",
        "options": [
          "O diferencial de 3 pontos percentuais garante ganhar 3% em dólares.",
          "A aplicação rendeu 5% em reais, mas voltou a US$ 70, perda de 12,5% em dólares; o diferencial de 3 pontos percentuais não era ganho garantido.",
          "A reconversão produz US$ 84, independentemente de e final.",
          "A perda em dólares prova que os R$ 420 não foram pagos."
        ],
        "answer": 1,
        "explanation": "420 ÷ 6 = US$ 70; (70 − 80) ÷ 80 = −12,5%. O diferencial 5% − 2% é 3 pontos percentuais, não retorno certo após câmbio.",
        "optionRationales": [
          "Subtrair taxas não resolve o efeito das moedas.",
          "Correta: separa remuneração, diferencial e retorno reconvertido.",
          "US$ 84 usaria a cotação inicial, não a final dada.",
          "O caso informa pagamento em reais; a perda deriva da reconversão."
        ]
      },
      {
        "id": "q.cechefe.q12",
        "topicId": "banking.ce.boss",
        "prompt": "A taxa doméstica aumenta, mas o risco percebido e as expectativas também mudam. Um fluxo de saída descrito no caso exige vender reais e comprar dólares. Mantidos os demais fatores para analisar esse fluxo específico, qual leitura é adequada?",
        "options": [
          "Juros maiores tornam impossível qualquer saída.",
          "O fluxo exige necessariamente comprar reais, apesar do enunciado.",
          "O maior retorno exigido elimina a possibilidade de perda.",
          "A compra de dólares pode pressionar a alta de R$/US$; a alta dos juros, sozinha, não garante entrada líquida nem valorização."
        ],
        "answer": 3,
        "explanation": "O sentido da conversão informada pode pressionar a cotação, enquanto juros, risco e expectativas atuam conjuntamente. Não há previsão garantida.",
        "optionRationales": [
          "O incentivo de juros não decide todos os fatores.",
          "Inverte a conversão expressamente dada.",
          "Compensação exigida não elimina incerteza.",
          "Correta: distingue pressão do fluxo e resultado agregado condicionado."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "cechefe-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.cechefe.q01": [
          {
            "missionId": "banking.ce.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "banking.ce.boss",
            "sectionId": "glossario"
          },
          {
            "missionId": "banking.ce.instrumentos",
            "sectionId": "mercados"
          },
          {
            "missionId": "banking.ce.instrumentos",
            "sectionId": "exemplo-revenda"
          },
          {
            "missionId": "banking.ce.acoes",
            "sectionId": "inicio"
          },
          {
            "missionId": "banking.ce.acoes",
            "sectionId": "ex-participacao"
          }
        ],
        "q.cechefe.q02": [
          {
            "missionId": "banking.ce.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "banking.ce.boss",
            "sectionId": "glossario"
          },
          {
            "missionId": "banking.ce.divida",
            "sectionId": "ex-emissor"
          },
          {
            "missionId": "banking.ce.divida",
            "sectionId": "contrato"
          },
          {
            "missionId": "banking.ce.divida",
            "sectionId": "saida"
          }
        ],
        "q.cechefe.q03": [
          {
            "missionId": "banking.ce.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "banking.ce.boss",
            "sectionId": "glossario"
          },
          {
            "missionId": "banking.ce.fundos",
            "sectionId": "cota"
          },
          {
            "missionId": "banking.ce.fundos",
            "sectionId": "ex-cota"
          },
          {
            "missionId": "banking.ce.fundos",
            "sectionId": "movimentacao"
          }
        ],
        "q.cechefe.q04": [
          {
            "missionId": "banking.ce.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "banking.ce.boss",
            "sectionId": "glossario"
          },
          {
            "missionId": "banking.ce.riscos",
            "sectionId": "liquido"
          },
          {
            "missionId": "banking.ce.riscos",
            "sectionId": "ex-liquido"
          },
          {
            "missionId": "banking.ce.riscos",
            "sectionId": "riscos"
          }
        ],
        "q.cechefe.q05": [
          {
            "missionId": "banking.ce.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "banking.ce.boss",
            "sectionId": "glossario"
          },
          {
            "missionId": "banking.ce.cotacao",
            "sectionId": "conversao"
          },
          {
            "missionId": "banking.ce.cotacao",
            "sectionId": "perspectiva"
          }
        ],
        "q.cechefe.q06": [
          {
            "missionId": "banking.ce.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "banking.ce.boss",
            "sectionId": "glossario"
          },
          {
            "missionId": "banking.ce.operacoes",
            "sectionId": "finalidades"
          },
          {
            "missionId": "banking.ce.operacoes",
            "sectionId": "autorizacao"
          },
          {
            "missionId": "banking.ce.operacoes",
            "sectionId": "regras"
          }
        ],
        "q.cechefe.q07": [
          {
            "missionId": "banking.ce.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "banking.ce.boss",
            "sectionId": "glossario"
          },
          {
            "missionId": "banking.ce.regimes",
            "sectionId": "fixo"
          },
          {
            "missionId": "banking.ce.regimes",
            "sectionId": "intermediario"
          },
          {
            "missionId": "banking.ce.regimes",
            "sectionId": "ex-banda"
          },
          {
            "missionId": "banking.ce.regimes",
            "sectionId": "ex-observacao"
          }
        ],
        "q.cechefe.q08": [
          {
            "missionId": "banking.ce.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "banking.ce.boss",
            "sectionId": "glossario"
          },
          {
            "missionId": "banking.ce.regimes",
            "sectionId": "flutuante"
          },
          {
            "missionId": "banking.ce.regimes",
            "sectionId": "ex-flutuante"
          },
          {
            "missionId": "banking.ce.regimes",
            "sectionId": "ex-observacao"
          }
        ],
        "q.cechefe.q09": [
          {
            "missionId": "banking.ce.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "banking.ce.boss",
            "sectionId": "glossario"
          },
          {
            "missionId": "banking.ce.cambio-real",
            "sectionId": "formula"
          },
          {
            "missionId": "banking.ce.cambio-real",
            "sectionId": "indice"
          },
          {
            "missionId": "banking.ce.cambio-real",
            "sectionId": "ex-indice"
          }
        ],
        "q.cechefe.q10": [
          {
            "missionId": "banking.ce.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "banking.ce.boss",
            "sectionId": "glossario"
          },
          {
            "missionId": "banking.ce.comercio",
            "sectionId": "resultado"
          },
          {
            "missionId": "banking.ce.comercio",
            "sectionId": "ex-resultado"
          },
          {
            "missionId": "banking.ce.comercio",
            "sectionId": "competitividade"
          }
        ],
        "q.cechefe.q11": [
          {
            "missionId": "banking.ce.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "banking.ce.boss",
            "sectionId": "glossario"
          },
          {
            "missionId": "banking.ce.fluxos",
            "sectionId": "inicio"
          },
          {
            "missionId": "banking.ce.fluxos",
            "sectionId": "ex-diferencial"
          },
          {
            "missionId": "banking.ce.fluxos",
            "sectionId": "moedas"
          },
          {
            "missionId": "banking.ce.fluxos",
            "sectionId": "ex-conversao"
          }
        ],
        "q.cechefe.q12": [
          {
            "missionId": "banking.ce.boss",
            "sectionId": "roteiro"
          },
          {
            "missionId": "banking.ce.boss",
            "sectionId": "glossario"
          },
          {
            "missionId": "banking.ce.boss",
            "sectionId": "recuperacao"
          },
          {
            "missionId": "banking.ce.fluxos",
            "sectionId": "risco"
          },
          {
            "missionId": "banking.ce.fluxos",
            "sectionId": "fluxo"
          },
          {
            "missionId": "banking.ce.fluxos",
            "sectionId": "expectativas"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.cechefe",
      "blockId": "banking.capital-exchange",
      "prerequisiteId": "banking.ce.revisao",
      "parametersApproved": false
    }
  }
]);
export const CE_SOURCES = Object.freeze([
  {
    "id": "ce.ce01.cvm.ce.mercado",
    "label": "CVM — O Mercado de Valores Mobiliários",
    "url": "https://www.gov.br/investidor/pt-br/investir/como-investir/conheca-o-mercado-de-capitais/o-mercado-de-valores-mobiliarios",
    "version": "Página educativa publicada em 25/10/2022; conteúdo consultado em 01/10/2026",
    "locator": "Participantes, prestação de serviços e responsabilidade da emissora",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "ce.ce01.cvm.ce.ofertas",
    "label": "CVM — Oferta primária x secundária",
    "url": "https://www.gov.br/investidor/pt-br/investir/como-investir/ofertas-publicas-de-distribuicao/oferta-primaria-x-secundaria",
    "version": "Página educativa publicada em 01/11/2022; conteúdo consultado em 01/10/2026",
    "locator": "Emissão nova, venda de ações existentes e ofertas mistas",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "ce.ce01.cvm.ce.acoes",
    "label": "CVM — Ações",
    "url": "https://www.gov.br/investidor/pt-br/investir/tipos-de-investimentos/acoes",
    "version": "Página educativa na versão acessível em 01/10/2026, sem data editorial visível",
    "locator": "Somente definição de ação/acionista e ausência de ganho garantido; tributação e procedimentos fora do recorte",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "ce.ce01.cvm.ce.debentures",
    "label": "CVM — Debêntures",
    "url": "https://www.gov.br/investidor/pt-br/investir/tipos-de-investimentos/debentures",
    "version": "Página educativa na versão acessível em 01/10/2026, sem data editorial visível",
    "locator": "Somente natureza de dívida, credor da emissora, debênture simples e risco de crédito",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "ce.ce02.cvm.ce.acoes",
    "label": "CVM — Ações",
    "url": "https://www.gov.br/investidor/pt-br/investir/tipos-de-investimentos/acoes",
    "version": "Página educativa consultada em 01/10/2026; recorte conceitual",
    "locator": "Participação e retorno; não usar os trechos tributários",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "ce.ce02.lei.6404",
    "label": "Lei 6.404/1976 — texto consolidado",
    "url": "https://www.planalto.gov.br/ccivil_03/leis/l6404consol.htm",
    "version": "Texto oficial consolidado consultado em 01/10/2026",
    "locator": "Arts. 15, 17, 109, 110, 110-A e 111: espécies e direitos; sem prazos ou percentuais de dividendos",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "ce.ce03.cvm.ce.debentures",
    "label": "CVM — Debêntures",
    "url": "https://www.gov.br/investidor/pt-br/investir/tipos-de-investimentos/debentures",
    "version": "Página educativa consultada em 01/10/2026",
    "locator": "Credor da emissora, debênture simples, remuneração e risco; sem tributação ou ritos de oferta",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "ce.ce03.cvm.ce.bancarios",
    "label": "CVM — Títulos bancários",
    "url": "https://www.gov.br/investidor/pt-br/investir/tipos-de-investimentos/titulos-bancarios",
    "version": "Página educativa consultada em 01/10/2026",
    "locator": "Somente captação bancária/CDB; sem FGC, tributação, prazos mínimos ou supervisão de outros produtos",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "ce.ce03.cvm.ce.caracteristicas",
    "label": "CVM — Características dos investimentos",
    "url": "https://www.gov.br/investidor/pt-br/investir/antes-de-investir/entenda-as-caracteristicas-dos-investimentos",
    "version": "Página de 2022, consultada em 01/10/2026",
    "locator": "Renda fixa/variável, remuneração e necessidade de avaliar risco/liquidez",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "ce.ce04.cvm.ce.fundos",
    "label": "CVM — Resolução 175, Parte Geral consolidada",
    "url": "https://conteudo.cvm.gov.br/export/sites/cvm/legislacao/resolucoes/anexos/100/resol175consolid_ParteGeral.pdf",
    "version": "Texto consolidado vinculado na página oficial que lista alteração 240/26; consultado em 01/10/2026",
    "locator": "Arts. 3º (datas), 4º–5º, 14, 40 e 80–86 da Parte Geral consolidada; classes/cotas, resgate e prestadores. Somente recorte introdutório.",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "ce.ce05.cvm.ce.risco",
    "label": "CVM — Risco e a relação risco x retorno",
    "url": "https://www.gov.br/investidor/pt-br/investir/antes-de-investir/entenda-as-caracteristicas-dos-investimentos/risco-e-a-relacao-risco-x-retorno",
    "version": "Página educacional de 15/09/2022; consulta em 01/10/2026",
    "locator": "Riscos de crédito, mercado e liquidez; retorno esperado versus realizado. Sem modelos estatísticos.",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "ce.ce05.cvm.ce.liquidez",
    "url": "https://www.gov.br/investidor/pt-br/investir/antes-de-investir/entenda-as-caracteristicas-dos-investimentos/liquidez",
    "checkedAt": "2026-10-01",
    "locator": "Liquidez como possibilidade de converter investimento em dinheiro, considerando prazo e preço.",
    "label": "CVM — Liquidez",
    "version": "Página educacional de 15/09/2022; consulta em 01/10/2026"
  },
  {
    "id": "ce.ce06.bcb.ce.conceito",
    "label": "BCB — O que é câmbio",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/oqueecambio",
    "version": "Página pública renderizada em 01/10/2026",
    "locator": "Conversão, turismo, remessas e comércio exterior; links para instituições e VET",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "ce.ce06.lei.14286",
    "label": "Lei 14.286/2021 — câmbio",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14286.htm",
    "version": "Texto oficial consultado em 01/10/2026",
    "locator": "Arts. 2–5 e 19: taxa pactuada, autorização, finalidade e exceção eventual; sem procedimentos quantitativos",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "ce.ce07.bcb.ce.conceito",
    "label": "BCB — O que é câmbio",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/oqueecambio",
    "version": "Página pública renderizada em 01/10/2026",
    "locator": "Conversão, turismo, remessas e comércio exterior; links para instituições e VET",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "ce.ce07.bcb.ce.instituicoes",
    "label": "BCB — Instituições do mercado de câmbio",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/instituicoescambio",
    "version": "Página pública renderizada em 01/10/2026",
    "locator": "Separação das consultas oficiais: operar, intermediar e correspondentes",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "ce.ce07.lei.14286",
    "label": "Lei 14.286/2021 — câmbio",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14286.htm",
    "version": "Texto oficial consultado em 01/10/2026",
    "locator": "Arts. 2–5 e 19: taxa pactuada, autorização, finalidade e exceção eventual; sem procedimentos quantitativos",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "ce.ce08.bcb.ce.politica",
    "label": "BCB — Política cambial",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/politicacambial",
    "version": "Página pública renderizada em 01/10/2026",
    "locator": "Regimes, flutuação no Brasil e atuação para funcionalidade; efeitos sobre comércio e preços",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "ce.ce09.imf.ce.real",
    "label": "FMI — Real Exchange Rates: What Money Can Buy",
    "url": "https://www.imf.org/en/publications/fandd/issues/series/back-to-basics/real-exchange-rates",
    "version": "Texto educativo Back to Basics, consultado em 01/10/2026",
    "locator": "Equação eP*/P; índices/base de comparação e limites da comparação de poder de compra",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "ce.ce09.bcb.ce.politica",
    "label": "BCB — Política cambial",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/politicacambial",
    "version": "Página pública renderizada em 01/10/2026",
    "locator": "Regimes, flutuação no Brasil e atuação para funcionalidade; efeitos sobre comércio e preços",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "ce.ce10.bcb.ce.politica",
    "label": "BCB — Política cambial",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/politicacambial",
    "version": "Página pública renderizada em 01/10/2026",
    "locator": "Regimes, flutuação no Brasil e atuação para funcionalidade; efeitos sobre comércio e preços",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "ce.ce10.bcb.ce.transmissao",
    "label": "BCB — Mecanismos de transmissão da política monetária",
    "url": "https://www.bcb.gov.br/controleinflacao/transmissaopoliticamonetaria",
    "version": "Consulta oficial de 30/09/2026 reaproveitada do preparo MP; sem nova leitura remota",
    "locator": "Canal de câmbio, diferencial de juros e efeitos condicionais sobre importação/exportação",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "ce.ce11.bcb.ce.transmissao",
    "label": "BCB — Mecanismos de transmissão da política monetária",
    "url": "https://www.bcb.gov.br/controleinflacao/transmissaopoliticamonetaria",
    "version": "Consulta oficial de 30/09/2026 reaproveitada do preparo MP; sem nova leitura remota",
    "locator": "Canal de câmbio, diferencial de juros e efeitos condicionais sobre importação/exportação",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "ce.ce11.cvm.ce.risco",
    "label": "CVM — Risco e a relação risco x retorno",
    "url": "https://www.gov.br/investidor/pt-br/investir/antes-de-investir/entenda-as-caracteristicas-dos-investimentos/risco-e-a-relacao-risco-x-retorno",
    "version": "Página educacional de 15/09/2022; consulta em 01/10/2026",
    "locator": "Riscos de crédito, mercado e liquidez; retorno esperado versus realizado. Sem modelos estatísticos.",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "ce.cer.cvm.ce.acoes",
    "label": "CVM — Ações",
    "url": "https://www.gov.br/investidor/pt-br/investir/tipos-de-investimentos/acoes",
    "version": "Página educativa consultada em 01/10/2026; recorte conceitual",
    "locator": "Participação e retorno; não usar os trechos tributários",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "ce.cer.cvm.ce.debentures",
    "label": "CVM — Debêntures",
    "url": "https://www.gov.br/investidor/pt-br/investir/tipos-de-investimentos/debentures",
    "version": "Página educativa consultada em 01/10/2026",
    "locator": "Credor da emissora, debênture simples, remuneração e risco; sem tributação ou ritos de oferta",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "ce.cer.cvm.ce.fundos",
    "label": "CVM — Resolução 175, Parte Geral consolidada",
    "url": "https://conteudo.cvm.gov.br/export/sites/cvm/legislacao/resolucoes/anexos/100/resol175consolid_ParteGeral.pdf",
    "version": "Texto consolidado vinculado na página oficial que lista alteração 240/26; consultado em 01/10/2026",
    "locator": "Arts. 3º (datas), 4º–5º, 14, 40 e 80–86 da Parte Geral consolidada; classes/cotas, resgate e prestadores. Somente recorte introdutório.",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "ce.cer.cvm.ce.risco",
    "label": "CVM — Risco e a relação risco x retorno",
    "url": "https://www.gov.br/investidor/pt-br/investir/antes-de-investir/entenda-as-caracteristicas-dos-investimentos/risco-e-a-relacao-risco-x-retorno",
    "version": "Página educacional de 15/09/2022; consulta em 01/10/2026",
    "locator": "Riscos de crédito, mercado e liquidez; retorno esperado versus realizado. Sem modelos estatísticos.",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "ce.cer.lei.14286",
    "label": "Lei 14.286/2021 — câmbio",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14286.htm",
    "version": "Texto oficial consultado em 01/10/2026",
    "locator": "Arts. 2–5 e 19: taxa pactuada, autorização, finalidade e exceção eventual; sem procedimentos quantitativos",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "ce.cer.bcb.ce.politica",
    "label": "BCB — Política cambial",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/politicacambial",
    "version": "Página pública renderizada em 01/10/2026",
    "locator": "Regimes, flutuação no Brasil e atuação para funcionalidade; efeitos sobre comércio e preços",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "ce.cer.imf.ce.real",
    "label": "FMI — Real Exchange Rates: What Money Can Buy",
    "url": "https://www.imf.org/en/publications/fandd/issues/series/back-to-basics/real-exchange-rates",
    "version": "Texto educativo Back to Basics, consultado em 01/10/2026",
    "locator": "Equação eP*/P; índices/base de comparação e limites da comparação de poder de compra",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "ce.cer.bcb.ce.transmissao",
    "label": "BCB — Mecanismos de transmissão da política monetária",
    "url": "https://www.bcb.gov.br/controleinflacao/transmissaopoliticamonetaria",
    "version": "Consulta oficial de 30/09/2026 reaproveitada do preparo MP; sem nova leitura remota",
    "locator": "Canal de câmbio, diferencial de juros e efeitos condicionais sobre importação/exportação",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "ce.cechefe.cvm.ce.acoes",
    "label": "CVM — Ações",
    "url": "https://www.gov.br/investidor/pt-br/investir/tipos-de-investimentos/acoes",
    "version": "Página educativa consultada em 01/10/2026; recorte conceitual",
    "locator": "Participação e retorno; não usar os trechos tributários",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "ce.cechefe.lei.6404",
    "label": "Lei 6.404/1976 — texto consolidado",
    "url": "https://www.planalto.gov.br/ccivil_03/leis/l6404consol.htm",
    "version": "Texto oficial consolidado consultado em 01/10/2026",
    "locator": "Arts. 15, 17, 109, 110, 110-A e 111: espécies e direitos; sem prazos ou percentuais de dividendos",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "ce.cechefe.cvm.ce.debentures",
    "label": "CVM — Debêntures",
    "url": "https://www.gov.br/investidor/pt-br/investir/tipos-de-investimentos/debentures",
    "version": "Página educativa consultada em 01/10/2026",
    "locator": "Credor da emissora, debênture simples, remuneração e risco; sem tributação ou ritos de oferta",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "ce.cechefe.cvm.ce.bancarios",
    "label": "CVM — Títulos bancários",
    "url": "https://www.gov.br/investidor/pt-br/investir/tipos-de-investimentos/titulos-bancarios",
    "version": "Página educativa consultada em 01/10/2026",
    "locator": "Somente captação bancária/CDB; sem FGC, tributação, prazos mínimos ou supervisão de outros produtos",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "ce.cechefe.cvm.ce.fundos",
    "label": "CVM — Resolução 175, Parte Geral consolidada",
    "url": "https://conteudo.cvm.gov.br/export/sites/cvm/legislacao/resolucoes/anexos/100/resol175consolid_ParteGeral.pdf",
    "version": "Texto consolidado vinculado na página oficial que lista alteração 240/26; consultado em 01/10/2026",
    "locator": "Arts. 3º (datas), 4º–5º, 14, 40 e 80–86 da Parte Geral consolidada; classes/cotas, resgate e prestadores. Somente recorte introdutório.",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "ce.cechefe.cvm.ce.risco",
    "label": "CVM — Risco e a relação risco x retorno",
    "url": "https://www.gov.br/investidor/pt-br/investir/antes-de-investir/entenda-as-caracteristicas-dos-investimentos/risco-e-a-relacao-risco-x-retorno",
    "version": "Página educacional de 15/09/2022; consulta em 01/10/2026",
    "locator": "Riscos de crédito, mercado e liquidez; retorno esperado versus realizado. Sem modelos estatísticos.",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "ce.cechefe.bcb.ce.conceito",
    "label": "BCB — O que é câmbio",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/oqueecambio",
    "version": "Página pública renderizada em 01/10/2026",
    "locator": "Conversão, turismo, remessas e comércio exterior; links para instituições e VET",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "ce.cechefe.lei.14286",
    "label": "Lei 14.286/2021 — câmbio",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14286.htm",
    "version": "Texto oficial consultado em 01/10/2026",
    "locator": "Arts. 2–5 e 19: taxa pactuada, autorização, finalidade e exceção eventual; sem procedimentos quantitativos",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "ce.cechefe.bcb.ce.politica",
    "label": "BCB — Política cambial",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/politicacambial",
    "version": "Página pública renderizada em 01/10/2026",
    "locator": "Regimes, flutuação no Brasil e atuação para funcionalidade; efeitos sobre comércio e preços",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "ce.cechefe.imf.ce.real",
    "label": "FMI — Real Exchange Rates: What Money Can Buy",
    "url": "https://www.imf.org/en/publications/fandd/issues/series/back-to-basics/real-exchange-rates",
    "version": "Texto educativo Back to Basics, consultado em 01/10/2026",
    "locator": "Equação eP*/P; índices/base de comparação e limites da comparação de poder de compra",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "ce.cechefe.bcb.ce.transmissao",
    "label": "BCB — Mecanismos de transmissão da política monetária",
    "url": "https://www.bcb.gov.br/controleinflacao/transmissaopoliticamonetaria",
    "version": "Consulta oficial de 30/09/2026 reaproveitada do preparo MP; sem nova leitura remota",
    "locator": "Canal de câmbio, diferencial de juros e efeitos condicionais sobre importação/exportação",
    "checkedAt": "2026-09-30"
  }
]);
