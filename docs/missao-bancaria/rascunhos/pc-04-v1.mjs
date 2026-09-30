// Rascunho editorial isolado; não importar no runtime.
export const SOURCES = [
  {
    "id": "cmn.cet.4881",
    "label": "CMN — Resolução 4.881/2020, CET",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/exibenormativo?tipo=Resolu%C3%A7%C3%A3o%20CMN&numero=4881",
    "version": "Texto normativo exibido pelo BCB, consultado em 30/09/2026",
    "locator": "Arts. 1º–5º e 7º–9º: âmbito, componentes, taxa anual, informação e exceções",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "bcb.credito.caderno",
    "label": "BCB — Caderno de Educação Financeira",
    "url": "https://www.bcb.gov.br/content/cidadaniafinanceira/documentos_cidadania/Cuidando_do_seu_dinheiro_Gestao_de_Financas_Pessoais/caderno_cidadania_financeira.pdf",
    "version": "2026, 2ª edição revisada; fonte já verificada no MP, recorte novo consultado",
    "locator": "Seções 3.1, 3.3 e 3.4, páginas impressas 32–37; recursos, juros, custo e compromissos",
    "checkedAt": "2026-09-30"
  }
];

export const PC04_DRAFT = {
  "id": "draft.pc04",
  "topicId": "draft.pc04",
  "editorialKey": "PC-04",
  "candidateBlockId": "banking.products-credit",
  "title": "Custo e condições da operação",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Ler custos e fluxos de propostas comparáveis, distinguir CET de juros ou prestação e reconhecer informação obrigatória e limites do indicador, sem calcular a fórmula geral.",
  "sourceIds": [
    "cmn.cet.4881",
    "bcb.credito.caderno"
  ],
  "sections": [
    {
      "id": "inicio",
      "type": "explanation",
      "heading": "1. Retome a dívida inteira, não só o anúncio",
      "body": "Em [PC-02](pc-02-v1.md#vocabulario), separamos principal, juros e prestação; em [PC-03](pc-03-v1.md#inicio), acompanhamos crédito e fatura. Agora vamos ler uma proposta antes de compará-la. Uma taxa anunciada pode descrever apenas juros. A prestação é um pagamento em reais. Nenhuma dessas informações, sozinha, resume necessariamente os encargos da operação. Primeiro identifique quanto fica disponível para o tomador, quando recebe, quanto deve pagar e em quais datas. Todos os números desta aula são didáticos; não representam ofertas, alíquotas de tributos ou tarifas permitidas para contratos reais.",
      "sourceIds": [
        "cmn.cet.4881"
      ]
    },
    {
      "id": "componentes",
      "type": "explanation",
      "heading": "2. O que o Custo Efetivo Total informa",
      "body": "Custo Efetivo Total, ou CET, é uma taxa que reúne encargos e despesas da operação na data do cálculo. A Resolução CMN 4.881 trata de sua informação em operações de crédito e arrendamento mercantil financeiro abrangidas, com pessoas naturais (inclusive empresários individuais), microempresas e empresas de pequeno porte. Não basta chamar qualquer empresa de pequena informalmente: a norma remete à classificação legal. Nosso exemplo de pessoa física evita essa classificação.\n\nO fluxo usado no cálculo considera o crédito concedido e os valores cobrados: amortizações, juros, tarifas, tributos, seguros e demais despesas vinculadas, quando aplicáveis, inclusive certos serviços de terceiros. Amortização aparece como devolução do principal no fluxo; isso não transforma todo principal devolvido em custo adicional. Despesa paga antecipadamente também importa. A lista de componentes não autoriza cobrar qualquer tarifa ou impor um seguro.",
      "sourceIds": [
        "cmn.cet.4881"
      ]
    },
    {
      "id": "exemplo-componentes",
      "type": "worked-example",
      "heading": "3. Exemplo resolvido: principal e encargos no fluxo",
      "body": "Pessoa física fictícia recebe R$1.000 líquidos hoje. O único pagamento, 365 dias depois, é R$1.180: R$1.000 devolvem o principal, R$100 são juros e R$80 são outros encargos vinculados, todos já incluídos. Passo 1: localizar a entrada de R$1.000. Passo 2: somar 1.000 + 100 + 80 = R$1.180. Passo 3: os valores adicionais ao principal somam 100 + 80 = R$180. O demonstrativo informa CET de 18,00% ao ano para esse fluxo anual simples. O caso já fornece o CET; ele não ensina a resolver a fórmula de contratos com vários pagamentos. Não conte os R$80 uma segunda vez nem chame R$1.180 inteiros de juros.",
      "sourceIds": []
    },
    {
      "id": "base-comparavel",
      "type": "explanation",
      "heading": "4. Compare propostas para a mesma necessidade",
      "body": "Uma comparação útil explicita o valor líquido disponível, as datas de liberação e pagamento, o prazo, encargos incluídos, periodicidade da taxa e condições variáveis. Valor anunciado de crédito e valor que realmente fica disponível podem diferir se houver despesas antecipadas. Dois contratos que anunciam R$1.000, mas liberam valores líquidos diferentes, não atendem à mesma necessidade de caixa automaticamente.\n\nO CET padroniza uma dimensão do custo. Ainda assim, não decide sozinho se a pessoa consegue pagar, se as garantias são adequadas ou se o contrato atende à finalidade. Para as questões seguintes, o critério será expressamente o menor custo do fluxo informado, sem recomendação de contratação.",
      "sourceIds": [
        "cmn.cet.4881",
        "bcb.credito.caderno"
      ]
    },
    {
      "id": "exemplo-propostas",
      "type": "worked-example",
      "heading": "5. Exemplo resolvido: juros menores, CET maior",
      "body": "Duas propostas fictícias liberam R$1.000 líquidos na mesma data e exigem um único pagamento após 365 dias, sem entrada, encargos antecipados ou indexador variável. Os valores abaixo esgotam o fluxo.\n\n| Informação | Proposta A | Proposta B |\n| --- | --- | --- |\n| Principal recebido | R$1.000 | R$1.000 |\n| Juros ao final | R$100 | R$150 |\n| Outros encargos ao final | R$100 | R$0 |\n| Pagamento final | R$1.200 | R$1.150 |\n| CET informado | 20,00% a.a. | 15,00% a.a. |\n\nPasso 1: conferir mesma entrada e mesma data final. Passo 2: A exige 1.000 + 100 + 100 = R$1.200; B exige 1.000 + 150 = R$1.150. Passo 3: embora os juros em reais de A sejam menores, seus outros encargos tornam o pagamento R$50 maior. O menor CET informado e o menor pagamento são os de B neste caso. Não generalize a soma ou essa conclusão para fluxos com datas diferentes.",
      "sourceIds": []
    },
    {
      "id": "parcelas",
      "type": "explanation",
      "heading": "6. Prestação menor pode acompanhar prazo maior",
      "body": "A prestação precisa caber nas datas do orçamento, mas olhar apenas seu valor pode esconder mais pagamentos. A soma nominal das parcelas ajuda a enxergar o desembolso total: nominal significa somar valores em reais sem trazê-los a uma mesma data por juros. Essa soma não substitui CET nem comparação financeira completa. Também verifique entrada e despesas fora das parcelas; somar só prestações não incorpora valores pagos separadamente.",
      "sourceIds": [
        "bcb.credito.caderno",
        "cmn.cet.4881"
      ]
    },
    {
      "id": "exemplo-parcelas",
      "type": "worked-example",
      "heading": "7. Exemplo resolvido: duas leituras de parcelas",
      "body": "Para a mesma liberação de R$1.000, o caso oferece X: quatro prestações de R$300; Y: seis de R$220. Não há entrada ou outros pagamentos. X soma 4 × 300 = R$1.200; Y soma 6 × 220 = R$1.320. A prestação de Y é menor, mas a soma nominal é R$120 maior. Isso responde apenas à pergunta sobre soma. Para comparar o custo considerando o tempo, ainda precisamos das datas, condições e CET; não deduzimos qual taxa é menor a partir desses totais.",
      "sourceIds": []
    },
    {
      "id": "periodos",
      "type": "explanation",
      "heading": "8. A taxa precisa de unidade e período",
      "body": "R$100 é um valor; 10% é uma proporção; 10% ao ano associa a taxa a um período. As abreviações a.m. e a.a. significam ao mês e ao ano. A Resolução 4.881 exige CET expresso como percentual anual, com duas casas decimais. Uma taxa mensal de juros e um CET anual não são a mesma informação. Converter corretamente taxas depende do regime e da fórmula aplicáveis; simplesmente multiplicar uma taxa mensal por 12 não resolve todo contrato. Nesta aula, a tarefa é identificar períodos e pedir bases comparáveis, não fazer essa conversão.",
      "sourceIds": [
        "cmn.cet.4881"
      ]
    },
    {
      "id": "exemplo-periodos",
      "type": "worked-example",
      "heading": "9. Exemplo resolvido: números que não podem ser ordenados sozinhos",
      "body": "Um anúncio X destaca juros de 2% a.m.; outro, Y, apresenta CET de 15,00% a.a. Passo 1: X e Y usam períodos diferentes. Passo 2: X informa juros, Y informa um indicador mais abrangente. Passo 3: não concluir que X custa menos apenas porque 2 é menor que 15. Solicitar os CETs anuais e demonstrativos para a mesma necessidade e conferir o fluxo. Não há dados suficientes aqui para apontar a proposta mais barata.",
      "sourceIds": []
    },
    {
      "id": "informacao",
      "type": "explanation",
      "heading": "10. Informação antes de contratar",
      "body": "Nas operações abrangidas, a instituição deve informar o CET e apresentar seu demonstrativo de cálculo antes da contratação. O demonstrativo detalha valores em reais e percentuais dos componentes e a soma das parcelas; se houver contratação, integra o contrato em destaque. Assim, uma resposta que ofereça essa informação somente depois da assinatura troca a ordem exigida. A publicidade que apresente a taxa de juros dessas operações também deve informar CET. A obrigação de informar não é promessa de aprovação do crédito.",
      "sourceIds": [
        "cmn.cet.4881"
      ]
    },
    {
      "id": "limites",
      "type": "explanation",
      "heading": "11. Limites: indexadores e operações com regra própria",
      "body": "Quando a operação utiliza referência de remuneração que varia durante o prazo, como um índice de preços ou taxa flutuante, a Resolução 4.881 determina que esse parâmetro não entre no cálculo do CET e seja informado no demonstrativo. Por isso, CET informado hoje não elimina a necessidade de entender a condição variável nem garante antecipadamente o custo final.\n\nA própria Resolução exclui de seu âmbito crédito rural e repasses de recursos externos. Isso não significa ausência de informação ou de regra específica nesses casos: significa que não se deve transportar automaticamente esta disciplina para eles. PC-06 tratará do recorte rural separadamente. Não estudaremos aqui suas regras de custo nem a fórmula geral do CET.",
      "sourceIds": [
        "cmn.cet.4881"
      ]
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "12. Vocabulário para reler a proposta",
      "body": "Valor líquido: recurso efetivamente disponível após deduções informadas. Encargo: obrigação de pagamento associada à operação, conforme sua natureza. Fluxo: valores e datas de entradas/saídas. CET: indicador percentual anual que consolida encargos e despesas segundo a regra aplicável. Demonstrativo: detalhamento que permite acompanhar os componentes informados. Indexador: referência usada em uma condição variável. Soma nominal: adição de valores sem ajuste financeiro pelo tempo.",
      "sourceIds": []
    },
    {
      "id": "resumo",
      "type": "summary",
      "heading": "13. Sequência de leitura",
      "body": "Identifique o tomador e a operação abrangida; leia valor líquido e calendário; separe principal, juros e outros componentes; compare CETs anuais em propostas compatíveis; observe parcelas e capacidade de pagamento separadamente; confira condições variáveis e informação prévia. Se falta uma dessas bases, explique o que falta antes de escolher uma alternativa.",
      "sourceIds": []
    }
  ],
  "recall": [
    "Sem olhar o texto, explique a diferença entre CET, juros e prestação.",
    "Reconstrua o fluxo anual A/B e diga exatamente por que os juros isolados levam ao erro.",
    "Após um erro, retome as seções indicadas e escreva qual informação faltou antes de repetir."
  ],
  "questions": [
    {
      "id": "pc04.q01",
      "topicId": "draft.pc04",
      "prompt": "Qual descrição do CET corresponde ao ensino desta aula?",
      "options": [
        "É sempre apenas a taxa de juros anunciada.",
        "É uma taxa que consolida encargos e despesas da operação na data do cálculo.",
        "É o valor de cada prestação em reais.",
        "É uma garantia de que o tomador conseguirá pagar."
      ],
      "answer": 1,
      "explanation": "CET é um indicador de custo; não se confunde com uma parcela, só juros ou capacidade de pagamento.",
      "optionRationales": [
        "Juros podem ser somente parte dos componentes.",
        "Identifica o indicador e o momento do cálculo.",
        "Parcela é valor de um pagamento, não a taxa consolidada.",
        "Capacidade de pagamento exige análise própria."
      ],
      "recoverySectionIds": [
        "componentes",
        "base-comparavel"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "pc04.q02",
      "topicId": "draft.pc04",
      "prompt": "Caso fictício: R$1.000 líquidos hoje; único pagamento futuro composto por R$1.000 de principal, R$100 de juros, R$30 de tributos e R$20 de outros encargos. Não há mais pagamentos. Qual leitura é correta?",
      "options": [
        "R$1.150 são integralmente juros.",
        "O pagamento total é R$1.100 porque tributos ficam sempre fora do fluxo.",
        "O pagamento é R$1.170, contando os R$20 outra vez.",
        "O pagamento total é R$1.150; R$150 são adicionais ao principal no caso."
      ],
      "answer": 3,
      "explanation": "Somamos os componentes uma vez: 1.000 + 100 + 30 + 20 = 1.150. Os adicionais somam 150.",
      "optionRationales": [
        "Confunde devolução do principal com juros.",
        "Ignora um componente cobrado expressamente informado.",
        "Duplica um encargo já incluído.",
        "Separa principal e adicionais sem duplicação."
      ],
      "recoverySectionIds": [
        "componentes",
        "exemplo-componentes"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "pc04.q03",
      "topicId": "draft.pc04",
      "prompt": "Nas propostas A/B do exemplo anual, ambas liberam R$1.000 e vencem na mesma data: A exige R$1.200, CET 20,00% a.a.; B exige R$1.150, CET 15,00% a.a. Pelo critério de custo informado, qual conclusão cabe?",
      "options": [
        "B tem menor CET e menor pagamento nesse fluxo.",
        "A é mais barata porque seus juros isolados são menores.",
        "A e B têm custo igual porque liberam o mesmo principal.",
        "B é automaticamente adequada a qualquer orçamento."
      ],
      "answer": 0,
      "explanation": "A comparação expressa do mesmo fluxo favorece B quanto ao custo, sem decidir adequação individual.",
      "optionRationales": [
        "Usa corretamente os dois dados comparáveis.",
        "Desconsidera os outros encargos de A.",
        "Mesmo valor liberado não iguala o que será cobrado.",
        "Custo menor não demonstra capacidade de pagar."
      ],
      "recoverySectionIds": [
        "exemplo-propostas",
        "base-comparavel"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "pc04.q04",
      "topicId": "draft.pc04",
      "prompt": "X: quatro parcelas de R$300. Y: seis de R$220. Mesma liberação, sem entrada ou outros pagamentos; datas e CET não foram informados. O que é possível afirmar?",
      "options": [
        "Y tem necessariamente a menor taxa.",
        "As somas são iguais porque as prestações de Y são menores.",
        "Y tem prestação menor, mas soma nominal de R$1.320, maior que R$1.200 de X.",
        "X soma R$300 e Y soma R$220."
      ],
      "answer": 2,
      "explanation": "A multiplicação mostra as somas nominais; não permite inferir toda a comparação financeira sem os demais dados.",
      "optionRationales": [
        "Taxa não decorre apenas da parcela isolada.",
        "Ignora o número de prestações.",
        "Distingue tamanho da parcela, quantidade e limite da conclusão.",
        "Usa apenas um pagamento de cada contrato."
      ],
      "recoverySectionIds": [
        "parcelas",
        "exemplo-parcelas"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "pc04.q05",
      "topicId": "draft.pc04",
      "prompt": "Um anúncio traz juros de 2% a.m. e outro CET de 15,00% a.a. Qual é o próximo passo coerente?",
      "options": [
        "Pedir CETs anuais e fluxos comparáveis, pois os números diferem em período e abrangência.",
        "Escolher o primeiro porque 2 é menor que 15.",
        "Tratar a.m. como ao ano.",
        "Multiplicar qualquer taxa mensal por 12 e considerar a análise encerrada."
      ],
      "answer": 0,
      "explanation": "A informação precisa usar bases comparáveis; esta aula não converte taxas nem decide a proposta com os dados incompletos.",
      "optionRationales": [
        "Reconhece as duas diferenças antes de comparar.",
        "Ordena números de indicadores diferentes.",
        "Troca a unidade temporal.",
        "Supõe uma regra geral de conversão e ignora outros encargos."
      ],
      "recoverySectionIds": [
        "periodos",
        "exemplo-periodos"
      ],
      "objectiveIds": [
        "O4"
      ]
    },
    {
      "id": "pc04.q06",
      "topicId": "draft.pc04",
      "prompt": "Uma operação com pessoa física está abrangida pela Resolução 4.881. Quando devem ser informados CET e demonstrativo?",
      "options": [
        "Apenas após a primeira prestação.",
        "Somente se o empréstimo for negado.",
        "Apenas depois de assinar, sem informação prévia.",
        "Antes da contratação; havendo contrato, o demonstrativo o integra em destaque."
      ],
      "answer": 3,
      "explanation": "A informação prévia faz parte da transparência exigida; não é condicionada ao primeiro pagamento.",
      "optionRationales": [
        "Atrasaria informação necessária à contratação.",
        "Não é requisito limitado a crédito recusado.",
        "Inverte a ordem prevista.",
        "Mantém o momento prévio e a inserção no contrato."
      ],
      "recoverySectionIds": [
        "informacao"
      ],
      "objectiveIds": [
        "O5"
      ]
    },
    {
      "id": "pc04.q07",
      "topicId": "draft.pc04",
      "prompt": "Um colega aplica automaticamente a Resolução 4.881 a um crédito rural porque também há juros. Qual resposta respeita o recorte?",
      "options": [
        "Toda regra de custo é igual para qualquer crédito.",
        "A norma exclui crédito rural; é necessário consultar sua disciplina própria, sem concluir que não há regras.",
        "Crédito rural nunca tem custo.",
        "A exclusão dispensa qualquer informação ao tomador."
      ],
      "answer": 1,
      "explanation": "O âmbito da norma importa; exclusão desta resolução não significa ausência de disciplina do crédito rural.",
      "optionRationales": [
        "Generaliza indevidamente o âmbito.",
        "Reconhece o limite e a necessidade de regra própria.",
        "Uma exceção de âmbito não transforma crédito em gratuito.",
        "Cria dispensa que não decorre do texto ensinado."
      ],
      "recoverySectionIds": [
        "limites"
      ],
      "objectiveIds": [
        "O5"
      ]
    },
    {
      "id": "pc04.q08",
      "topicId": "draft.pc04",
      "prompt": "O contrato usa índice de preços variável e está no âmbito da Resolução 4.881. Qual leitura do CET está correta?",
      "options": [
        "O CET garante que o custo final ficará imóvel.",
        "O índice variável deve ser ocultado por não entrar no cálculo.",
        "O parâmetro variável não entra nesse cálculo do CET e deve ser informado no demonstrativo; é preciso compreender sua condição.",
        "O índice de preços transforma a prestação em saldo próprio."
      ],
      "answer": 2,
      "explanation": "A norma separa o cálculo do CET da informação do referencial variável. Isso limita previsões sobre o custo final.",
      "optionRationales": [
        "Ignora a condição que pode mudar durante o prazo.",
        "Exclusão do cálculo não autoriza ocultar a informação.",
        "Preserva informação e limite do indicador.",
        "Confunde obrigação de crédito com recursos próprios."
      ],
      "recoverySectionIds": [
        "limites"
      ],
      "objectiveIds": [
        "O5"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "pc04-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "pc04.q01": [
        {
          "missionId": "draft.pc04",
          "sectionId": "componentes"
        },
        {
          "missionId": "draft.pc04",
          "sectionId": "base-comparavel"
        }
      ],
      "pc04.q02": [
        {
          "missionId": "draft.pc04",
          "sectionId": "componentes"
        },
        {
          "missionId": "draft.pc04",
          "sectionId": "exemplo-componentes"
        }
      ],
      "pc04.q03": [
        {
          "missionId": "draft.pc04",
          "sectionId": "exemplo-propostas"
        },
        {
          "missionId": "draft.pc04",
          "sectionId": "base-comparavel"
        }
      ],
      "pc04.q04": [
        {
          "missionId": "draft.pc04",
          "sectionId": "parcelas"
        },
        {
          "missionId": "draft.pc04",
          "sectionId": "exemplo-parcelas"
        }
      ],
      "pc04.q05": [
        {
          "missionId": "draft.pc04",
          "sectionId": "periodos"
        },
        {
          "missionId": "draft.pc04",
          "sectionId": "exemplo-periodos"
        }
      ],
      "pc04.q06": [
        {
          "missionId": "draft.pc04",
          "sectionId": "informacao"
        }
      ],
      "pc04.q07": [
        {
          "missionId": "draft.pc04",
          "sectionId": "limites"
        }
      ],
      "pc04.q08": [
        {
          "missionId": "draft.pc04",
          "sectionId": "limites"
        }
      ]
    }
  }
};

export const EDITORIAL = {
  "stage": "Plano 66 reaproveitado; rascunho fora do catálogo, revisão independente e humana pendentes; Fase 2 sem aceite humano observado",
  "referenceOnlyProfiles": [
    {
      "id": "bb.agente-comercial.2022-001",
      "item": "Item 5 histórico; recorte introdutório/apoio didático, sem atribuir subitem CET inexistente",
      "status": "histórico; adoção pendente"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Item 19 histórico; recorte introdutório/apoio didático, sem atribuir subitem CET inexistente",
      "status": "histórico; adoção pendente"
    }
  ],
  "objectives": {
    "O1": "Explicar o significado e o âmbito introdutório do CET.",
    "O2": "Separar principal e componentes adicionais sem duplicá-los.",
    "O3": "Ler fluxos comparáveis e limites de parcelas/somas nominais.",
    "O4": "Distinguir valores, percentuais e períodos sem conversões indevidas.",
    "O5": "Reconhecer informação prévia, indexadores e exceções de âmbito.",
    "O6": "Reconstruir o fluxo e corrigir a confusão após erro."
  },
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Retomar os trechos indicados, explicar a confusão e reconstruir o caso antes de repetir; não gerar indicador de domínio."
  },
  "limits": [
    "CET é apoio didático ao recorte de produtos, sem subitem histórico novo atribuído. Fórmula geral, taxas equivalentes, SAC/Price e cálculo de valor presente não são ensinados ou cobrados.",
    "Os CETs dos exemplos anuais são informados e coerentes com um pagamento após 365 dias. Valores não descrevem IOF, tarifa específica ou autorização de cobrança real. Crédito rural, repasses externos e condições variáveis conservam limites explícitos.",
    "Casos fictícios originais, sem recomendação para pessoa real. Fontes primárias consultadas em 30/09/2026; conferir alterações pertinentes antes de publicação futura.",
    "Prática exposta, fora de avaliações independentes. IDs locais, sem XP/ordem/gate produtivo ou importação no manifesto. Não demonstra cobertura integral do bloco ou edital histórico."
  ]
};

export const ARITHMETIC = [
  {
    "label": "componentes 1000+100",
    "operation": "add",
    "values": [
      1000,
      100
    ],
    "expected": 1100
  },
  {
    "label": "componentes total",
    "operation": "add",
    "values": [
      1100,
      80
    ],
    "expected": 1180
  },
  {
    "label": "componentes adicionais",
    "operation": "add",
    "values": [
      100,
      80
    ],
    "expected": 180
  },
  {
    "label": "A juros e encargos",
    "operation": "add",
    "values": [
      100,
      100
    ],
    "expected": 200
  },
  {
    "label": "A total",
    "operation": "add",
    "values": [
      1000,
      200
    ],
    "expected": 1200
  },
  {
    "label": "B total",
    "operation": "add",
    "values": [
      1000,
      150
    ],
    "expected": 1150
  },
  {
    "label": "diferença A B",
    "operation": "subtract",
    "values": [
      1200,
      1150
    ],
    "expected": 50
  },
  {
    "label": "X parcelas",
    "operation": "multiply",
    "values": [
      4,
      300
    ],
    "expected": 1200
  },
  {
    "label": "Y parcelas",
    "operation": "multiply",
    "values": [
      6,
      220
    ],
    "expected": 1320
  },
  {
    "label": "diferença parcelas",
    "operation": "subtract",
    "values": [
      1320,
      1200
    ],
    "expected": 120
  },
  {
    "label": "q2 encargos parciais",
    "operation": "add",
    "values": [
      100,
      30
    ],
    "expected": 130
  },
  {
    "label": "q2 encargos totais",
    "operation": "add",
    "values": [
      130,
      20
    ],
    "expected": 150
  },
  {
    "label": "q2 pagamento",
    "operation": "add",
    "values": [
      1000,
      150
    ],
    "expected": 1150
  },
  {
    "label": "CET informado coerente: um pagamento em 365 dias, adicional 180/líquido 1000",
    "operation": "divide",
    "values": [
      180,
      1000
    ],
    "expected": 0.18
  },
  {
    "label": "CET informado coerente: um pagamento em 365 dias, adicional 200/líquido 1000",
    "operation": "divide",
    "values": [
      200,
      1000
    ],
    "expected": 0.2
  },
  {
    "label": "CET informado coerente: um pagamento em 365 dias, adicional 150/líquido 1000",
    "operation": "divide",
    "values": [
      150,
      1000
    ],
    "expected": 0.15
  }
];
