// Rascunho editorial isolado; não importar no runtime.
export const SOURCES = [
  {
    "id": "bcb.cartao.tipos",
    "label": "BCB — Tipos de cartão",
    "url": "https://www.bcb.gov.br/meubc/faqs/p/tipos-de-cartao",
    "version": "FAQ atualizada em 17/05/2023",
    "locator": "Débito, crédito e pré-pago; benefícios/consignado fora do recorte",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "bcb.cartao.fatura",
    "label": "BCB — Apresentação das informações na fatura",
    "url": "https://www.bcb.gov.br/meubc/faqs/p/apresentacao-das-informacoes-na-fatura-do-cartao-de-credito",
    "version": "FAQ atualizada em 06/08/2024",
    "locator": "Áreas de destaque, alternativas de pagamento e informações complementares",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "bcb.cartao.minimo",
    "label": "BCB — Valor da fatura e pagamento mínimo",
    "url": "https://www.bcb.gov.br/meubc/faqs/p/valor-da-fatura-ate-vencimento-do-cartao-e-o-pagamento-minimo",
    "version": "FAQ atualizada em 06/08/2024",
    "locator": "Valor obrigatório, mínimo contratual e distinção do total",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "bcb.cartao.pagamento",
    "label": "BCB — Quando o cliente não paga o valor mínimo da fatura",
    "url": "https://www.bcb.gov.br/meubc/faqs/p/quando-o-cliente-nao-paga-o-valor-minimo-da-fatura",
    "version": "FAQ atualizada em 08/07/2024",
    "locator": "Parcelamento da fatura, crédito rotativo e inadimplência",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "cmn.rotativo",
    "label": "CMN — Resolução 4.549, financiamento do saldo da fatura",
    "url": "https://normativos.bcb.gov.br/Lists/Normativos/Attachments/50330/Res_4549_v2_L.pdf",
    "version": "Resolução 4.549/2017, texto compilado v2 com alteração pela Resolução 5.112/2023",
    "locator": "Arts. 1º, 2º e 4º; crédito rotativo e exclusão do consignado",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "bcb.cheque.especial",
    "label": "BCB — O que é o Cheque Especial?",
    "url": "https://www.bcb.gov.br/meubc/faqs/p/o-que-e-o-cheque-especial",
    "version": "FAQ atualizada em 31/01/2023",
    "locator": "Crédito vinculado à conta de depósitos à vista; limite e uso",
    "checkedAt": "2026-09-30"
  }
];

export const PC03_DRAFT = {
  "id": "draft.pc03",
  "topicId": "draft.pc03",
  "editorialKey": "PC-03",
  "candidateBlockId": "banking.products-credit",
  "title": "Cartões, fatura e limite de crédito",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Distinguir funções de cartão, interpretar datas e valores da fatura e reconhecer o crédito usado, sem confundir limite com renda ou compra parcelada com financiamento do saldo.",
  "sourceIds": [
    "bcb.cartao.tipos",
    "bcb.cartao.fatura",
    "bcb.cartao.minimo",
    "bcb.cartao.pagamento",
    "cmn.rotativo",
    "bcb.cheque.especial"
  ],
  "sections": [
    {
      "id": "inicio",
      "type": "explanation",
      "heading": "1. O cartão é um instrumento; a obrigação depende da função",
      "body": "Retome [saldo e limite](pc-01-v1.md#saldo-limite) e [partes do crédito](pc-02-v1.md#inicio). Um cartão pode oferecer mais de uma função. A aparência física, a marca ou o aplicativo não bastam para dizer de onde virão os recursos nem quando haverá pagamento. Nesta aula separaremos débito, pré-pago e crédito comum, sem consignação em folha. Todos os casos e valores são fictícios. Não trataremos uma compra real nem recomendaremos um produto.",
      "sourceIds": []
    },
    {
      "id": "funcoes",
      "type": "explanation",
      "heading": "2. Débito, pré-pago e crédito",
      "body": "Na função débito, o valor da transação é descontado da conta vinculada; usar débito não significa, por si, contratar parcelamento da fatura. No pré-pago, é necessário aportar recursos na conta de pagamento antes de utilizá-los. No crédito comum, compras autorizadas geram obrigações registradas em fatura, para pagamento conforme o contrato. O cartão não transforma o limite concedido em patrimônio ou renda. Um instrumento com as duas funções exige identificar qual foi escolhida na operação. Aqui, débito usa saldo sem recorrer a limite; se houver outro crédito contratado que cubra a movimentação, isso será informado separadamente.",
      "sourceIds": [
        "bcb.cartao.tipos",
        "bcb.cartao.fatura"
      ]
    },
    {
      "id": "exemplo-funcoes",
      "type": "worked-example",
      "heading": "3. Exemplo resolvido: mesma compra, formas diferentes",
      "body": "Compra fictícia de R$90. Caso A: débito em conta com R$250, sem uso de crédito e sem outros movimentos; após o débito, restam R$160. Caso B: cartão pré-pago com R$120 previamente aportados; após usar R$90, restam R$30. Caso C: crédito comum, cuja compra autorizada de R$90 será lançada na fatura; não se presume que R$90 saiu imediatamente da conta corrente. Passo 1: identifique a função informada. Passo 2: localize o recurso ou a obrigação. Passo 3: só calcule o saldo quando o caso trouxer a conta atingida e as condições. Ter o mesmo preço não torna as três operações iguais.",
      "sourceIds": [
        "bcb.cartao.tipos",
        "bcb.cartao.fatura"
      ]
    },
    {
      "id": "datas",
      "type": "explanation",
      "heading": "4. Fechamento é diferente de vencimento",
      "body": "A fatura reúne lançamentos de um período. Fechamento é o encerramento dos lançamentos daquele ciclo; vencimento é a data indicada para pagar a fatura. Não são sinônimos. A fatura destaca total, vencimento e limite total; também apresenta lançamentos, opções de pagamento, custos das alternativas e informação sobre encerramento do próximo ciclo. Uma compra feita perto do fechamento pode depender do processamento para aparecer em um ciclo ou outro: não adivinhe o lançamento pela data da compra isolada. Nos exercícios, a fatura emitida informará em qual ciclo a compra entrou.",
      "sourceIds": [
        "bcb.cartao.fatura"
      ]
    },
    {
      "id": "exemplo-datas",
      "type": "worked-example",
      "heading": "5. Exemplo resolvido: leia a fatura efetivamente emitida",
      "body": "Fatura fictícia emitida: ciclo encerrado em 25/08, vencimento em 05/09, total R$480. Ela lista uma compra de R$80 já processada e incluída nesse total. Passo 1: 25/08 identifica o fechamento do ciclo. Passo 2: 05/09 é o vencimento informado para o pagamento. Passo 3: os R$80 já compõem os R$480; somá-los novamente produziria R$560 e duplicaria uma despesa. Esses dados não dizem o vencimento de uma compra futura ainda não lançada.",
      "sourceIds": [
        "bcb.cartao.fatura"
      ]
    },
    {
      "id": "total-minimo",
      "type": "explanation",
      "heading": "6. Total, valor obrigatório e alternativa de financiamento",
      "body": "Valor total é a soma cobrada naquela fatura, segundo seus lançamentos. O valor obrigatório para pagamento pode envolver saldo do rotativo com encargos, parcelas anteriores e mínimo contratual. Portanto, não aplique uma porcentagem mínima universal por memória nem confunda qualquer pagamento parcial com cumprimento das condições. Se a fatura não for integralmente paga no vencimento, é necessário identificar a alternativa contratada e seus custos: parcelamento da fatura é uma operação de crédito; pagamento parcial sem parcelamento pode levar ao rotativo; descumprir o pagamento exigido pode caracterizar inadimplência. Pagar o valor obrigatório não equivale a quitar o total. As taxas e condições precisam ser lidas na fatura e no contrato.",
      "sourceIds": [
        "bcb.cartao.minimo",
        "bcb.cartao.pagamento"
      ]
    },
    {
      "id": "exemplo-pagamento",
      "type": "worked-example",
      "heading": "7. Exemplo resolvido: pagamento parcial deixa saldo",
      "body": "Fatura fictícia total de R$600, sem dívida anterior, com valor obrigatório informado de R$120. O caso diz que o titular paga R$200 no vencimento, cumpre o obrigatório, não contrata parcelamento e que a diferença entra no rotativo conforme o contrato. Passo 1: R$200 é maior que R$120, mas menor que R$600. Passo 2: R$600 − R$200 = R$400 de saldo inicial financiado. Passo 3: não concluímos que a próxima fatura será apenas R$400: podem incidir juros e encargos, além de novos lançamentos. O exercício calcula a diferença inicial, sem estimar taxa, CET ou evolução da dívida.",
      "sourceIds": [
        "bcb.cartao.minimo",
        "bcb.cartao.pagamento"
      ]
    },
    {
      "id": "rotativo",
      "type": "explanation",
      "heading": "8. Rotativo não é financiamento sem prazo",
      "body": "No cartão comum estudado aqui, o saldo não quitado só pode permanecer financiado no rotativo até o vencimento da fatura seguinte. O saldo remanescente pode passar a linha parcelada em condições mais vantajosas que as do rotativo, observadas as regras aplicáveis; não se presume perdão da dívida. Parcelar uma compra e financiar o saldo da fatura são operações distintas. Esta explicação não se aplica automaticamente aos contratos com consignação em folha, excluídos desse recorte normativo. Não calcularemos limites de encargos ou renegociação nesta aula.",
      "sourceIds": [
        "cmn.rotativo"
      ]
    },
    {
      "id": "limites",
      "type": "explanation",
      "heading": "9. Limite do cartão não é saldo nem cheque especial",
      "body": "Limite total é o teto de crédito informado para aquele produto; disponível é a parcela ainda utilizável nas condições do contrato. Uma tela deve ser lida sem somar limite à renda. Não existe aqui uma regra universal de recomposição após pagamento ou de consumo do limite por compras parceladas: os casos devem trazer a condição utilizada. Cheque especial é outro crédito: pré-aprovado e vinculado à conta de depósitos à vista, pode cobrir movimentações quando os recursos disponíveis não bastam. Seu limite, mesmo mostrado no extrato, não pertence ao cliente; o uso pode gerar juros. Ter cartão de crédito não prova possuir cheque especial, nem o contrário.",
      "sourceIds": [
        "bcb.cartao.fatura",
        "bcb.cheque.especial"
      ]
    },
    {
      "id": "exemplo-limites",
      "type": "worked-example",
      "heading": "10. Exemplo resolvido: duas linhas, duas obrigações",
      "body": "Caso fictício: conta corrente com R$100 sem crédito, cheque especial não usado de R$400, e cartão com limite total R$900 e R$300 já comprometidos; não há outras reservas. Passo 1: o cartão tem R$600 disponíveis nas condições declaradas. Passo 2: um débito autorizado de R$160 na conta usa primeiro os R$100 e, conforme o caso, R$60 do cheque especial. Passo 3: o caso não vinculou esse débito ao cartão; não subtraia os R$60 do limite dele. Passo 4: os R$60 usados são crédito com obrigação, não aumento de renda. Não se calcula aqui juros nem prazo do cheque especial.",
      "sourceIds": [
        "bcb.cartao.fatura",
        "bcb.cheque.especial"
      ]
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "11. Termos para conferir a decisão",
      "body": "Função: forma escolhida para executar o pagamento. Fatura: demonstrativo dos lançamentos e valores cobrados do ciclo. Fechamento: encerramento dos lançamentos do ciclo. Vencimento: data indicada para pagar. Rotativo: modalidade de financiamento de saldo da fatura não integralmente pago, dentro do prazo normativo. Parcelamento da fatura: financiamento parcelado de sua dívida, distinto do parcelamento de uma compra. Cheque especial: linha de crédito vinculada à conta de depósitos à vista. Limite disponível não é recurso próprio.",
      "sourceIds": [
        "bcb.cartao.tipos",
        "bcb.cartao.fatura",
        "bcb.cartao.pagamento",
        "cmn.rotativo",
        "bcb.cheque.especial"
      ]
    },
    {
      "id": "resumo",
      "type": "summary",
      "heading": "12. Perguntas que organizam a leitura",
      "body": "Qual função foi usada? Que conta foi debitada ou que obrigação foi criada? Qual ciclo e qual vencimento constam da fatura? O pagamento informado quita o total ou deixa diferença? Qual crédito está sendo utilizado? Separe essas perguntas antes de calcular. Quando faltar contrato, taxa, processamento ou condição do limite, registre o dado ausente; não invente uma regra para preencher a lacuna. A próxima aula de custos aprofundará comparação e CET.",
      "sourceIds": []
    }
  ],
  "questions": [
    {
      "id": "pc03.q01",
      "topicId": "draft.pc03",
      "prompt": "Compra fictícia de R$50 no pré-pago, com R$90 previamente aportados e sem outros movimentos. Qual leitura corresponde ao caso?",
      "options": [
        "A compra exige que R$50 sejam cobrados em fatura de crédito.",
        "O limite de cheque especial aumenta em R$50.",
        "O aporte anterior não tem relação com essa operação.",
        "Os recursos previamente aportados caem para R$40."
      ],
      "answer": 3,
      "explanation": "Pré-pago utiliza os recursos aportados: R$90 − R$50 = R$40.",
      "optionRationales": [
        "Confunde pré-pago com crédito.",
        "Introduz uma linha de crédito não informada.",
        "Ignora a condição que permite a transação.",
        "Identifica função e subtração corretas."
      ],
      "recoverySectionIds": [
        "funcoes",
        "exemplo-funcoes"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "pc03.q02",
      "topicId": "draft.pc03",
      "prompt": "Uma fatura fictícia informa fechamento em 22/08 e vencimento em 02/09. Qual afirmação é sustentada?",
      "options": [
        "02/09 é a data indicada para pagar essa fatura.",
        "22/08 e 02/09 são dois vencimentos intercambiáveis.",
        "Toda compra feita em 22/08 necessariamente foi incluída.",
        "O fechamento prova que a dívida já foi paga."
      ],
      "answer": 0,
      "explanation": "As datas têm funções diferentes e o caso informa o vencimento.",
      "optionRationales": [
        "Usa a data explicitamente fornecida.",
        "Troca encerramento de ciclo por pagamento.",
        "Desconsidera o processamento do lançamento.",
        "Fechar o ciclo não quita obrigações."
      ],
      "recoverySectionIds": [
        "datas",
        "exemplo-datas"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "pc03.q03",
      "topicId": "draft.pc03",
      "prompt": "Fatura fictícia total de R$450, incluindo uma compra de R$70 listada entre os lançamentos. Quanto é o total informado, sem duplicar esse lançamento?",
      "options": [
        "R$520.",
        "R$380.",
        "R$450.",
        "R$70."
      ],
      "answer": 2,
      "explanation": "Os R$70 já integram o total de R$450.",
      "optionRationales": [
        "Soma novamente um valor já incluído.",
        "Retira uma compra que faz parte da fatura.",
        "Preserva a soma consolidada informada.",
        "Confunde um lançamento com toda a fatura."
      ],
      "recoverySectionIds": [
        "datas",
        "exemplo-datas"
      ],
      "objectiveIds": [
        "O2",
        "O3"
      ]
    },
    {
      "id": "pc03.q04",
      "topicId": "draft.pc03",
      "prompt": "Fatura fictícia de R$500; o caso informa pagamento obrigatório de R$100, pagamento realizado de R$150 no vencimento e diferença entrando no rotativo, sem parcelamento. Qual saldo inicial é financiado, antes dos encargos?",
      "options": [
        "R$100.",
        "R$350.",
        "R$500.",
        "Zero, porque o obrigatório foi cumprido."
      ],
      "answer": 1,
      "explanation": "R$500 − R$150 = R$350; cumprir o obrigatório não quita o total.",
      "optionRationales": [
        "Confunde o obrigatório com a diferença.",
        "Subtrai o pagamento efetivo do total.",
        "Ignora os R$150 pagos.",
        "Confunde regularidade do pagamento exigido com quitação integral."
      ],
      "recoverySectionIds": [
        "total-minimo",
        "exemplo-pagamento"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "pc03.q05",
      "topicId": "draft.pc03",
      "prompt": "Um anúncio fictício mostra somente o limite do cartão. Qual informação permite conhecer o valor obrigatório de pagamento da fatura atual?",
      "options": [
        "Aplicar sempre 10% do limite.",
        "Usar o saldo da conta corrente como pagamento mínimo.",
        "Consultar a fatura e as condições contratuais pertinentes.",
        "Dividir o limite por dois, independentemente da dívida."
      ],
      "answer": 2,
      "explanation": "Limite não informa sozinho o valor obrigatório, que depende dos componentes e condições descritos.",
      "optionRationales": [
        "Inventa percentual universal e base de cálculo.",
        "Confunde recursos da conta com obrigação da fatura.",
        "Busca as informações que efetivamente definem o pagamento.",
        "Cria uma fórmula sem fundamento no caso."
      ],
      "recoverySectionIds": [
        "total-minimo",
        "limites"
      ],
      "objectiveIds": [
        "O3",
        "O5"
      ]
    },
    {
      "id": "pc03.q06",
      "topicId": "draft.pc03",
      "prompt": "No cartão comum do recorte estudado, um saldo entrou no rotativo após pagamento parcial. Até quando essa modalidade pode financiar esse saldo?",
      "options": [
        "Até o vencimento da fatura subsequente.",
        "Por prazo indefinido se houver qualquer pagamento mensal.",
        "Até o titular obter outro cartão, sem vencimento intermediário.",
        "Somente até o dia de fechamento da mesma fatura já vencida."
      ],
      "answer": 0,
      "explanation": "O limite temporal é o vencimento seguinte, não uma renovação indefinida.",
      "optionRationales": [
        "Aplica o prazo do recorte normativo.",
        "Ignora o limite temporal da modalidade.",
        "Cria condição ausente da norma.",
        "Confunde fechamento e vencimento."
      ],
      "recoverySectionIds": [
        "rotativo",
        "datas"
      ],
      "objectiveIds": [
        "O4"
      ]
    },
    {
      "id": "pc03.q07",
      "topicId": "draft.pc03",
      "prompt": "Caso fictício: R$80 sem crédito na conta; pagamento de R$130 usa primeiro esses recursos e depois cheque especial autorizado. Cartão tem R$500 de limite disponível, sem vínculo com a operação. O que aconteceu?",
      "options": [
        "Os R$130 foram necessariamente debitados do limite do cartão.",
        "Entraram R$50 de renda na conta.",
        "O cliente passa a ser proprietário de todo o cheque especial disponível.",
        "Foram utilizados R$50 de cheque especial; não há uso informado do cartão."
      ],
      "answer": 3,
      "explanation": "Faltavam R$50 para cobrir a saída da conta e o caso indicou qual linha foi usada.",
      "optionRationales": [
        "Substitui a linha informada por outra.",
        "Crédito utilizado não é renda.",
        "Limite concedido não é patrimônio.",
        "Distingue o débito na conta das obrigações do cartão."
      ],
      "recoverySectionIds": [
        "limites",
        "exemplo-limites"
      ],
      "objectiveIds": [
        "O1",
        "O5"
      ]
    },
    {
      "id": "pc03.q08",
      "topicId": "draft.pc03",
      "prompt": "O caso informa apenas uma compra parcelada no cartão, sem atraso ou financiamento da fatura. Qual conclusão é adequada?",
      "options": [
        "Houve obrigatoriamente adesão ao rotativo.",
        "Parcelamento da compra não prova parcelamento da dívida da fatura.",
        "O cheque especial foi usado automaticamente.",
        "Toda a fatura será gratuita e sem obrigação de pagamento."
      ],
      "answer": 1,
      "explanation": "São operações distintas; as condições não fornecidas não podem ser presumidas.",
      "optionRationales": [
        "Infere uma modalidade não informada.",
        "Conserva a distinção entre compra e financiamento do saldo.",
        "Introduz outra linha sem evidência.",
        "Confunde forma de compra com inexistência de obrigação."
      ],
      "recoverySectionIds": [
        "rotativo",
        "total-minimo"
      ],
      "objectiveIds": [
        "O4",
        "O5"
      ]
    }
  ],
  "recall": [
    "Reconstrua os três casos de função de cartão, explicando de onde saiu o valor ou qual obrigação foi criada. Confira exemplo-funcoes.",
    "Sem consultar, diferencie fechamento, vencimento, total e obrigatório; depois refaça exemplo-pagamento.",
    "Após errar, retome as seções indicadas, nomeie a confusão e explique por que cada alternativa falha. Em outra sessão, reconstrua um caso; não há adaptação automática ou presunção de domínio."
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "pc03-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "pc03.q01": [
        {
          "missionId": "draft.pc03",
          "sectionId": "funcoes"
        },
        {
          "missionId": "draft.pc03",
          "sectionId": "exemplo-funcoes"
        }
      ],
      "pc03.q02": [
        {
          "missionId": "draft.pc03",
          "sectionId": "datas"
        },
        {
          "missionId": "draft.pc03",
          "sectionId": "exemplo-datas"
        }
      ],
      "pc03.q03": [
        {
          "missionId": "draft.pc03",
          "sectionId": "datas"
        },
        {
          "missionId": "draft.pc03",
          "sectionId": "exemplo-datas"
        }
      ],
      "pc03.q04": [
        {
          "missionId": "draft.pc03",
          "sectionId": "total-minimo"
        },
        {
          "missionId": "draft.pc03",
          "sectionId": "exemplo-pagamento"
        }
      ],
      "pc03.q05": [
        {
          "missionId": "draft.pc03",
          "sectionId": "total-minimo"
        },
        {
          "missionId": "draft.pc03",
          "sectionId": "limites"
        }
      ],
      "pc03.q06": [
        {
          "missionId": "draft.pc03",
          "sectionId": "rotativo"
        },
        {
          "missionId": "draft.pc03",
          "sectionId": "datas"
        }
      ],
      "pc03.q07": [
        {
          "missionId": "draft.pc03",
          "sectionId": "limites"
        },
        {
          "missionId": "draft.pc03",
          "sectionId": "exemplo-limites"
        }
      ],
      "pc03.q08": [
        {
          "missionId": "draft.pc03",
          "sectionId": "rotativo"
        },
        {
          "missionId": "draft.pc03",
          "sectionId": "total-minimo"
        }
      ]
    }
  }
};

export const EDITORIAL = {
  "stage": "Recorte previsto no plano; autoria e recuperação redigidas, revisão independente e humana pendentes; integração não iniciada",
  "referenceOnlyProfiles": [
    {
      "id": "bb.agente-comercial.2022-001",
      "item": "Item 5 histórico; recorte introdutório de cartões/produtos",
      "status": "histórico; adoção pendente"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Item 19 histórico; recorte introdutório de cartões/produtos",
      "status": "histórico; adoção pendente"
    }
  ],
  "objectives": {
    "O1": "Distinguir débito, pré-pago, crédito e origem da obrigação.",
    "O2": "Ler ciclo, fechamento, vencimento e lançamentos sem duplicação.",
    "O3": "Separar total, obrigatório, pagamento efetivo e saldo inicial.",
    "O4": "Distinguir rotativo, parcelamento da fatura e parcelamento da compra.",
    "O5": "Separar limites de produtos e reconhecer informações ausentes.",
    "O6": "Retomar o conceito após erro e reconstruir o raciocínio."
  },
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Usar recoverySectionIds, explicar a confusão e reconstruir o exemplo antes de nova tentativa."
  },
  "limits": [
    "Somente cartão comum, sem consignação em folha. Cheque especial aparece para comparação básica, sem taxas, tetos, contratação ou renegociação.",
    "Sem percentual mínimo universal, recomposição universal de limite, limite de encargos/portabilidade, recomendação de produto ou análise de caso real. Não representa cobertura integral de item histórico.",
    "Fontes oficiais verificadas em 30/09/2026; Resolução 4.549 compilada v2 consultada nessa data. Revalidar mudanças pertinentes antes de publicação.",
    "Casos originais fictícios; prática exposta fora de A/B. IDs locais, sem XP/ordem/desbloqueio ou importação no catálogo. Revisão pedagógica independente e humana pendentes."
  ]
};

export const ARITHMETIC = [
  {
    "label": "débito",
    "operation": "subtract",
    "values": [
      250,
      90
    ],
    "expected": 160
  },
  {
    "label": "pré-pago",
    "operation": "subtract",
    "values": [
      120,
      90
    ],
    "expected": 30
  },
  {
    "label": "parcial",
    "operation": "subtract",
    "values": [
      600,
      200
    ],
    "expected": 400
  },
  {
    "label": "disponível cartão",
    "operation": "subtract",
    "values": [
      900,
      300
    ],
    "expected": 600
  },
  {
    "label": "cheque usado",
    "operation": "subtract",
    "values": [
      160,
      100
    ],
    "expected": 60
  },
  {
    "label": "q01",
    "operation": "subtract",
    "values": [
      90,
      50
    ],
    "expected": 40
  },
  {
    "label": "q04",
    "operation": "subtract",
    "values": [
      500,
      150
    ],
    "expected": 350
  },
  {
    "label": "q07",
    "operation": "subtract",
    "values": [
      130,
      80
    ],
    "expected": 50
  }
];
