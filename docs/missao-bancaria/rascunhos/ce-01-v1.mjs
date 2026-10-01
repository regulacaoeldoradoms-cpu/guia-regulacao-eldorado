// Rascunho editorial isolado; não importar no runtime.
export const SOURCES = [
  {
    "id": "cvm.ce.mercado",
    "label": "CVM — O Mercado de Valores Mobiliários",
    "url": "https://www.gov.br/investidor/pt-br/investir/como-investir/conheca-o-mercado-de-capitais/o-mercado-de-valores-mobiliarios",
    "version": "Página educativa publicada em 25/10/2022; conteúdo consultado em 01/10/2026",
    "locator": "Participantes, prestação de serviços e responsabilidade da emissora",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "cvm.ce.ofertas",
    "label": "CVM — Oferta primária x secundária",
    "url": "https://www.gov.br/investidor/pt-br/investir/como-investir/ofertas-publicas-de-distribuicao/oferta-primaria-x-secundaria",
    "version": "Página educativa publicada em 01/11/2022; conteúdo consultado em 01/10/2026",
    "locator": "Emissão nova, venda de ações existentes e ofertas mistas",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "cvm.ce.acoes",
    "label": "CVM — Ações",
    "url": "https://www.gov.br/investidor/pt-br/investir/tipos-de-investimentos/acoes",
    "version": "Página educativa na versão acessível em 01/10/2026, sem data editorial visível",
    "locator": "Somente definição de ação/acionista e ausência de ganho garantido; tributação e procedimentos fora do recorte",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "cvm.ce.debentures",
    "label": "CVM — Debêntures",
    "url": "https://www.gov.br/investidor/pt-br/investir/tipos-de-investimentos/debentures",
    "version": "Página educativa na versão acessível em 01/10/2026, sem data editorial visível",
    "locator": "Somente natureza de dívida, credor da emissora, debênture simples e risco de crédito",
    "checkedAt": "2026-10-01"
  }
];

export const CE01_DRAFT = {
  "id": "draft.ce01",
  "topicId": "draft.ce01",
  "editorialKey": "CE-01",
  "candidateBlockId": "banking.capital-exchange",
  "title": "Emissão, revenda e destino dos recursos",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Distinguir os direitos básicos de ação e dívida, identificar quem recebe recursos na emissão/revenda e resolver casos simples sem presumir garantia ou informação ausente.",
  "sourceIds": [
    "cvm.ce.mercado",
    "cvm.ce.ofertas",
    "cvm.ce.acoes",
    "cvm.ce.debentures"
  ],
  "sections": [
    {
      "id": "inicio",
      "type": "explanation",
      "heading": "1. Siga o dinheiro de cada negócio",
      "body": "Na [introdução aos mercados](mp-01-v1.md#capitais), vimos que uma companhia pode captar recursos com ações ou títulos de dívida. Agora vamos separar dois acontecimentos: colocar instrumentos novos no mercado e negociar instrumentos que já pertencem a alguém. A pergunta central é: quem recebe o dinheiro desta operação? Leia em conjunto quem vende, o que vende e se há emissão nova. Todos os nomes e valores a seguir são fictícios.",
      "sourceIds": []
    },
    {
      "id": "partes",
      "type": "explanation",
      "heading": "2. Emissor, investidor e vendedor",
      "body": "Emissor é quem cria o instrumento. Investidor é quem aplica recursos e adquire os direitos correspondentes. Vendedor é quem entrega o instrumento em determinada negociação. Esses papéis não são sinônimos: uma companhia pode emitir ações; anos depois, um acionista pode vender as suas ações a outro investidor. Nessa revenda, a companhia continua sendo a emissora, embora não seja quem está vendendo.",
      "sourceIds": [
        "cvm.ce.mercado",
        "cvm.ce.ofertas"
      ]
    },
    {
      "id": "direitos",
      "type": "explanation",
      "heading": "3. O instrumento define a relação",
      "body": "Ação representa uma parcela do capital social: quem a adquire torna-se acionista, participante do capital da companhia. Não é uma promessa de devolver o preço pago em uma data combinada; pode haver ganho ou perda. Uma debênture, por sua vez, representa dívida da companhia emissora. Seu titular é credor, com direitos definidos nas condições de emissão. Ter direito a receber não significa receber sem risco. Nesta aula usamos debênture simples, sem conversão em ações; as demais características ficam para outra unidade.",
      "sourceIds": [
        "cvm.ce.acoes",
        "cvm.ce.debentures"
      ]
    },
    {
      "id": "exemplo-direitos",
      "type": "worked-example",
      "heading": "4. Exemplo resolvido: a mesma companhia, relações diferentes",
      "body": "A companhia fictícia Aurora apresenta dois instrumentos: ações e debêntures simples. Lia adquire ações; Rui adquire debêntures. Passo 1: identifique o instrumento, sem olhar primeiro o valor aplicado. Passo 2: associe ação à participação e debênture à dívida. Passo 3: Lia é acionista; Rui é credor da Aurora. Não se pode concluir que Lia tem juros contratuais garantidos, nem que Rui virou sócio apenas porque financiou a mesma companhia. A distinção vale mesmo que ambos tenham aplicado R$1.000.",
      "sourceIds": [
        "cvm.ce.acoes",
        "cvm.ce.debentures"
      ]
    },
    {
      "id": "mercados",
      "type": "explanation",
      "heading": "5. Emissão nova e negociação posterior",
      "body": "Na colocação primária, a companhia emite novos instrumentos e capta os recursos correspondentes. Na negociação secundária aqui estudada, um investidor vende instrumentos já existentes a outro: o dinheiro da venda cabe ao vendedor. A companhia não capta esse valor só por ser a emissora. Revenda não cria automaticamente novas ações. Essas palavras descrevem a operação, não uma classificação permanente da pessoa: alguém pode comprar na emissão e vender mais tarde.",
      "sourceIds": [
        "cvm.ce.ofertas"
      ]
    },
    {
      "id": "exemplo-emissao",
      "type": "worked-example",
      "heading": "6. Exemplo resolvido: recursos para a companhia",
      "body": "Aurora emite 100 novas ações a R$20 cada, todas adquiridas por investidores. Suponha ausência de custos e tributos no exemplo. Passo 1: há ações novas emitidas pela companhia. Passo 2: multiplique quantidade por preço: 100 × R$20 = R$2.000. Passo 3: a captação da companhia é R$2.000 nesta operação primária. Esse número não informa o valor de toda a empresa, pois não foi dado o total de ações já existentes; tampouco promete rentabilidade ao comprador.",
      "sourceIds": [
        "cvm.ce.ofertas"
      ]
    },
    {
      "id": "exemplo-revenda",
      "type": "worked-example",
      "heading": "7. Exemplo resolvido: recursos para a vendedora",
      "body": "Lia comprou 10 ações a R$20 cada e depois vende as mesmas 10 ações a Rui por R$23 cada. Desconsidere custos, tributos e outros recebimentos. Passo 1: são ações existentes; há revenda. Passo 2: Rui paga 10 × R$23 = R$230 a Lia. A companhia não recebe esse pagamento. Passo 3: Lia havia desembolsado R$200; a diferença entre venda e compra é R$230 − R$200 = R$30. R$230 é o valor da venda, não o ganho. Isso descreve o caso já realizado, não prevê o preço da próxima negociação.",
      "sourceIds": [
        "cvm.ce.ofertas",
        "cvm.ce.acoes"
      ]
    },
    {
      "id": "mista",
      "type": "explanation",
      "heading": "8. Uma oferta pode reunir duas partes",
      "body": "Oferta mista combina uma parcela primária e outra secundária. Para resolver um caso, separe as quantidades novas e as já existentes antes de somar valores. O total movimentado não é necessariamente o total captado pela companhia. A parte vendida por acionistas pertence aos vendedores, observadas as condições da oferta. Não vamos tratar de ritos de registro ou documentos obrigatórios nesta unidade.",
      "sourceIds": [
        "cvm.ce.ofertas"
      ]
    },
    {
      "id": "exemplo-mista",
      "type": "worked-example",
      "heading": "9. Exemplo resolvido: repartir o total",
      "body": "Em uma oferta fictícia, 60 ações novas da companhia e 40 ações existentes de um acionista são vendidas por R$10 cada. Suponha ausência de custos e tributos. Passo 1: parcela primária: 60 × R$10 = R$600 para a companhia. Passo 2: parcela secundária: 40 × R$10 = R$400 para o acionista vendedor. Passo 3: R$600 + R$400 = R$1.000 movimentados no total. O erro seria atribuir os R$1.000 inteiros à companhia. A mistura não impede analisar cada parcela.",
      "sourceIds": [
        "cvm.ce.ofertas"
      ]
    },
    {
      "id": "servico-limites",
      "type": "explanation",
      "heading": "10. Distribuir não é assumir a dívida",
      "body": "Corretoras e outras instituições podem prestar serviços na colocação ou negociação. Sua presença não muda, por si só, os direitos do instrumento. Distribuir debêntures não torna a distribuidora responsável pelo pagamento da dívida da emissora aos investidores. Isso não elimina as responsabilidades próprias do serviço prestado; apenas separa os papéis. Também não basta ver o nome de uma companhia numa tela para concluir que a compra financia uma emissão nova. Se o enunciado não disser se são instrumentos novos ou existentes, falta informação para classificar a operação.",
      "sourceIds": [
        "cvm.ce.mercado"
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
      "id": "ce01.q01",
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
      ],
      "objectiveIds": [
        "O1"
      ],
      "recoverySectionIds": [
        "direitos",
        "exemplo-direitos"
      ]
    },
    {
      "id": "ce01.q02",
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
      ],
      "objectiveIds": [
        "O1",
        "O4"
      ],
      "recoverySectionIds": [
        "direitos",
        "servico-limites"
      ]
    },
    {
      "id": "ce01.q03",
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
      ],
      "objectiveIds": [
        "O2",
        "O3"
      ],
      "recoverySectionIds": [
        "mercados",
        "exemplo-emissao"
      ]
    },
    {
      "id": "ce01.q04",
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
      ],
      "objectiveIds": [
        "O2",
        "O3"
      ],
      "recoverySectionIds": [
        "exemplo-revenda"
      ]
    },
    {
      "id": "ce01.q05",
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
      ],
      "objectiveIds": [
        "O2",
        "O3"
      ],
      "recoverySectionIds": [
        "mista",
        "exemplo-mista"
      ]
    },
    {
      "id": "ce01.q06",
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
      ],
      "objectiveIds": [
        "O4"
      ],
      "recoverySectionIds": [
        "servico-limites"
      ]
    },
    {
      "id": "ce01.q07",
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
      ],
      "objectiveIds": [
        "O5"
      ],
      "recoverySectionIds": [
        "partes",
        "servico-limites"
      ]
    },
    {
      "id": "ce01.q08",
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
      ],
      "objectiveIds": [
        "O2",
        "O3",
        "O5"
      ],
      "recoverySectionIds": [
        "mercados",
        "exemplo-emissao",
        "exemplo-revenda"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "ce01-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "ce01.q01": [
        {
          "missionId": "draft.ce01",
          "sectionId": "direitos"
        },
        {
          "missionId": "draft.ce01",
          "sectionId": "exemplo-direitos"
        }
      ],
      "ce01.q02": [
        {
          "missionId": "draft.ce01",
          "sectionId": "direitos"
        },
        {
          "missionId": "draft.ce01",
          "sectionId": "servico-limites"
        }
      ],
      "ce01.q03": [
        {
          "missionId": "draft.ce01",
          "sectionId": "mercados"
        },
        {
          "missionId": "draft.ce01",
          "sectionId": "exemplo-emissao"
        }
      ],
      "ce01.q04": [
        {
          "missionId": "draft.ce01",
          "sectionId": "exemplo-revenda"
        }
      ],
      "ce01.q05": [
        {
          "missionId": "draft.ce01",
          "sectionId": "mista"
        },
        {
          "missionId": "draft.ce01",
          "sectionId": "exemplo-mista"
        }
      ],
      "ce01.q06": [
        {
          "missionId": "draft.ce01",
          "sectionId": "servico-limites"
        }
      ],
      "ce01.q07": [
        {
          "missionId": "draft.ce01",
          "sectionId": "partes"
        },
        {
          "missionId": "draft.ce01",
          "sectionId": "servico-limites"
        }
      ],
      "ce01.q08": [
        {
          "missionId": "draft.ce01",
          "sectionId": "mercados"
        },
        {
          "missionId": "draft.ce01",
          "sectionId": "exemplo-emissao"
        },
        {
          "missionId": "draft.ce01",
          "sectionId": "exemplo-revenda"
        }
      ]
    }
  }
};

export const EDITORIAL = {
  "stage": "Plano introdutório do bloco existente; revisão independente de conteúdo e humana pendentes; integração não iniciada",
  "referenceOnlyProfiles": [
    {
      "id": "bb.agente-comercial.2022-001",
      "item": "Anexo III, p.34, Conhecimentos Bancários, item 6; recorte introdutório, sem cobertura integral",
      "status": "histórico; referenceOnly"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Anexo IV, pp.33–34, Conhecimentos Bancários TBN, item 20; recorte introdutório, sem cobertura integral",
      "status": "histórico; referenceOnly"
    }
  ],
  "objectives": {
    "O1": "Distinguir participante do capital e credor da emissora.",
    "O2": "Identificar emissão/revenda e destinatário dos recursos.",
    "O3": "Calcular valores simples separando venda, captação e diferença obtida.",
    "O4": "Separar serviços de distribuição da dívida da emissora.",
    "O5": "Reconhecer dados insuficientes e analisar operações separadas.",
    "O6": "Recuperar a confusão pela seção de ensino e reconstruir o caso."
  },
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Nomear a troca de papéis ou de valores, voltar à seção indicada e refazer com os dados do caso; sem novo indicador de domínio."
  },
  "limits": [
    "Recorte de noções de capitais dos perfis históricos BB/CAIXA; não é orientação de investimento ou cobertura integral de edital.",
    "Fontes CVM consultadas em 01/10/2026 apenas nos recortes identificados; não incorporar automaticamente detalhes legais/tributários das páginas educativas.",
    "Sem espécies de ações, direitos societários detalhados, ritos de oferta, tributação, FGC, avaliação de empresas ou derivativos; fatos normativos mutáveis exigem consulta própria nas futuras unidades.",
    "Valores/casos originais fictícios; ausência de custos/tributos e outros recebimentos explicitada quando necessária. Venda de instrumentos existentes é entre investidores nos exemplos; não modela operações com ações em tesouraria.",
    "Rascunho editorial com prática exposta; fora do catálogo e das formas independentes, sem XP, ordem ou desbloqueio produtivo. Preservar exclusividade e progresso existentes."
  ]
};

export const ARITHMETIC = [
  {
    "label": "exemplo emissão",
    "operation": "multiply",
    "values": [
      100,
      20
    ],
    "expected": 2000
  },
  {
    "label": "exemplo revenda recebimento",
    "operation": "multiply",
    "values": [
      10,
      23
    ],
    "expected": 230
  },
  {
    "label": "exemplo revenda compra",
    "operation": "multiply",
    "values": [
      10,
      20
    ],
    "expected": 200
  },
  {
    "label": "exemplo revenda diferença",
    "operation": "subtract",
    "values": [
      230,
      200
    ],
    "expected": 30
  },
  {
    "label": "exemplo mista nova",
    "operation": "multiply",
    "values": [
      60,
      10
    ],
    "expected": 600
  },
  {
    "label": "exemplo mista existente",
    "operation": "multiply",
    "values": [
      40,
      10
    ],
    "expected": 400
  },
  {
    "label": "exemplo mista total",
    "operation": "add",
    "values": [
      600,
      400
    ],
    "expected": 1000
  },
  {
    "label": "q03",
    "operation": "multiply",
    "values": [
      50,
      12
    ],
    "expected": 600
  },
  {
    "label": "q04 venda",
    "operation": "multiply",
    "values": [
      8,
      18
    ],
    "expected": 144
  },
  {
    "label": "q04 compra",
    "operation": "multiply",
    "values": [
      8,
      15
    ],
    "expected": 120
  },
  {
    "label": "q04 diferença",
    "operation": "subtract",
    "values": [
      144,
      120
    ],
    "expected": 24
  },
  {
    "label": "q05 nova",
    "operation": "multiply",
    "values": [
      30,
      40
    ],
    "expected": 1200
  },
  {
    "label": "q05 existente",
    "operation": "multiply",
    "values": [
      20,
      40
    ],
    "expected": 800
  },
  {
    "label": "q05 total",
    "operation": "add",
    "values": [
      1200,
      800
    ],
    "expected": 2000
  },
  {
    "label": "q08 emissão",
    "operation": "multiply",
    "values": [
      10,
      30
    ],
    "expected": 300
  },
  {
    "label": "q08 revenda",
    "operation": "multiply",
    "values": [
      5,
      32
    ],
    "expected": 160
  }
];
