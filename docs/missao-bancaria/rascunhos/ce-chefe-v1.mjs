// Rascunho editorial isolado; não importar no runtime.
export const SOURCES = [
  {
    "id": "cvm.ce.acoes",
    "label": "CVM — Ações",
    "url": "https://www.gov.br/investidor/pt-br/investir/tipos-de-investimentos/acoes",
    "version": "Página educativa consultada em 01/10/2026; recorte conceitual",
    "locator": "Participação e retorno; não usar os trechos tributários",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "lei.6404",
    "label": "Lei 6.404/1976 — texto consolidado",
    "url": "https://www.planalto.gov.br/ccivil_03/leis/l6404consol.htm",
    "version": "Texto oficial consolidado consultado em 01/10/2026",
    "locator": "Arts. 15, 17, 109, 110, 110-A e 111: espécies e direitos; sem prazos ou percentuais de dividendos",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "cvm.ce.debentures",
    "label": "CVM — Debêntures",
    "url": "https://www.gov.br/investidor/pt-br/investir/tipos-de-investimentos/debentures",
    "version": "Página educativa consultada em 01/10/2026",
    "locator": "Credor da emissora, debênture simples, remuneração e risco; sem tributação ou ritos de oferta",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "cvm.ce.bancarios",
    "label": "CVM — Títulos bancários",
    "url": "https://www.gov.br/investidor/pt-br/investir/tipos-de-investimentos/titulos-bancarios",
    "version": "Página educativa consultada em 01/10/2026",
    "locator": "Somente captação bancária/CDB; sem FGC, tributação, prazos mínimos ou supervisão de outros produtos",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "cvm.ce.fundos",
    "label": "CVM — Resolução 175, Parte Geral consolidada",
    "url": "https://conteudo.cvm.gov.br/export/sites/cvm/legislacao/resolucoes/anexos/100/resol175consolid_ParteGeral.pdf",
    "version": "Texto consolidado vinculado na página oficial que lista alteração 240/26; consultado em 01/10/2026",
    "locator": "Arts. 3º (datas), 4º–5º, 14, 40 e 80–86 da Parte Geral consolidada; classes/cotas, resgate e prestadores. Somente recorte introdutório.",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "cvm.ce.risco",
    "label": "CVM — Risco e a relação risco x retorno",
    "url": "https://www.gov.br/investidor/pt-br/investir/antes-de-investir/entenda-as-caracteristicas-dos-investimentos/risco-e-a-relacao-risco-x-retorno",
    "version": "Página educacional de 15/09/2022; consulta em 01/10/2026",
    "locator": "Riscos de crédito, mercado e liquidez; retorno esperado versus realizado. Sem modelos estatísticos.",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "bcb.ce.conceito",
    "label": "BCB — O que é câmbio",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/oqueecambio",
    "version": "Página pública renderizada em 01/10/2026",
    "locator": "Conversão, turismo, remessas e comércio exterior; links para instituições e VET",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "lei.14286",
    "label": "Lei 14.286/2021 — câmbio",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14286.htm",
    "version": "Texto oficial consultado em 01/10/2026",
    "locator": "Arts. 2–5 e 19: taxa pactuada, autorização, finalidade e exceção eventual; sem procedimentos quantitativos",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "bcb.ce.politica",
    "label": "BCB — Política cambial",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/politicacambial",
    "version": "Página pública renderizada em 01/10/2026",
    "locator": "Regimes, flutuação no Brasil e atuação para funcionalidade; efeitos sobre comércio e preços",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "imf.ce.real",
    "label": "FMI — Real Exchange Rates: What Money Can Buy",
    "url": "https://www.imf.org/en/publications/fandd/issues/series/back-to-basics/real-exchange-rates",
    "version": "Texto educativo Back to Basics, consultado em 01/10/2026",
    "locator": "Equação eP*/P; índices/base de comparação e limites da comparação de poder de compra",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "bcb.ce.transmissao",
    "label": "BCB — Mecanismos de transmissão da política monetária",
    "url": "https://www.bcb.gov.br/controleinflacao/transmissaopoliticamonetaria",
    "version": "Consulta oficial de 30/09/2026 reaproveitada do preparo MP; sem nova leitura remota",
    "locator": "Canal de câmbio, diferencial de juros e efeitos condicionais sobre importação/exportação",
    "checkedAt": "2026-09-30"
  }
];

export const CECHEFE_DRAFT = {
  "id": "draft.cechefe",
  "topicId": "draft.cechefe",
  "editorialKey": "CE-CHEFE",
  "candidateBlockId": "banking.capital-exchange",
  "title": "Chefe de Capitais e Câmbio: conecte os dados do caso",
  "contentVersion": 1,
  "kind": "boss",
  "publication": {
    "status": "draft"
  },
  "objective": "Integrar instrumentos, riscos e câmbio em doze casos próprios, explicando hipóteses e limites com recuperação nas aulas de origem.",
  "sourceIds": [
    "cvm.ce.acoes",
    "lei.6404",
    "cvm.ce.debentures",
    "cvm.ce.bancarios",
    "cvm.ce.fundos",
    "cvm.ce.risco",
    "bcb.ce.conceito",
    "lei.14286",
    "bcb.ce.politica",
    "imf.ce.real",
    "bcb.ce.transmissao"
  ],
  "sections": [
    {
      "id": "preparacao",
      "type": "explanation",
      "heading": "1. Ensino antes do desafio",
      "body": "As aulas [CE-01](ce-01-v1.md), [CE-02](ce-02-v1.md), [CE-03](ce-03-v1.md), [CE-04](ce-04-v1.md), [CE-05](ce-05-v1.md), [CE-06](ce-06-v1.md), [CE-07](ce-07-v1.md), [CE-08](ce-08-v1.md), [CE-09](ce-09-v1.md), [CE-10](ce-10-v1.md) e [CE-11](ce-11-v1.md) ensinam os conceitos cobrados. A [revisão CE-R](ce-r-v1.md) prepara a recuperação. Leia o ensino antes de usar o comentário de uma questão. Os exemplos são fictícios e não descrevem ofertas ou cotações atuais.",
      "sourceIds": []
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
  "questions": [
    {
      "id": "cechefe.q01",
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
      ],
      "objectiveIds": [
        "O1"
      ],
      "recoverySectionIds": [
        "roteiro",
        "glossario"
      ],
      "originRefs": [
        {
          "unit": "ce01",
          "sectionId": "mercados"
        },
        {
          "unit": "ce01",
          "sectionId": "exemplo-revenda"
        },
        {
          "unit": "ce02",
          "sectionId": "inicio"
        },
        {
          "unit": "ce02",
          "sectionId": "ex-participacao"
        }
      ],
      "groupId": "G1"
    },
    {
      "id": "cechefe.q02",
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
      ],
      "objectiveIds": [
        "O1",
        "O2"
      ],
      "recoverySectionIds": [
        "roteiro",
        "glossario"
      ],
      "originRefs": [
        {
          "unit": "ce03",
          "sectionId": "ex-emissor"
        },
        {
          "unit": "ce03",
          "sectionId": "contrato"
        },
        {
          "unit": "ce03",
          "sectionId": "saida"
        }
      ],
      "groupId": "G1"
    },
    {
      "id": "cechefe.q03",
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
      ],
      "objectiveIds": [
        "O2"
      ],
      "recoverySectionIds": [
        "roteiro",
        "glossario"
      ],
      "originRefs": [
        {
          "unit": "ce04",
          "sectionId": "cota"
        },
        {
          "unit": "ce04",
          "sectionId": "ex-cota"
        },
        {
          "unit": "ce04",
          "sectionId": "movimentacao"
        }
      ],
      "groupId": "G2"
    },
    {
      "id": "cechefe.q04",
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
      ],
      "objectiveIds": [
        "O2"
      ],
      "recoverySectionIds": [
        "roteiro",
        "glossario"
      ],
      "originRefs": [
        {
          "unit": "ce05",
          "sectionId": "liquido"
        },
        {
          "unit": "ce05",
          "sectionId": "ex-liquido"
        },
        {
          "unit": "ce05",
          "sectionId": "riscos"
        }
      ],
      "groupId": "G2"
    },
    {
      "id": "cechefe.q05",
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
      ],
      "objectiveIds": [
        "O3"
      ],
      "recoverySectionIds": [
        "roteiro",
        "glossario"
      ],
      "originRefs": [
        {
          "unit": "ce06",
          "sectionId": "conversao"
        },
        {
          "unit": "ce06",
          "sectionId": "perspectiva"
        }
      ],
      "groupId": "G3"
    },
    {
      "id": "cechefe.q06",
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
      ],
      "objectiveIds": [
        "O3"
      ],
      "recoverySectionIds": [
        "roteiro",
        "glossario"
      ],
      "originRefs": [
        {
          "unit": "ce07",
          "sectionId": "finalidades"
        },
        {
          "unit": "ce07",
          "sectionId": "autorizacao"
        },
        {
          "unit": "ce07",
          "sectionId": "regras"
        }
      ],
      "groupId": "G3"
    },
    {
      "id": "cechefe.q07",
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
      ],
      "objectiveIds": [
        "O4"
      ],
      "recoverySectionIds": [
        "roteiro",
        "glossario"
      ],
      "originRefs": [
        {
          "unit": "ce08",
          "sectionId": "fixo"
        },
        {
          "unit": "ce08",
          "sectionId": "intermediario"
        },
        {
          "unit": "ce08",
          "sectionId": "ex-banda"
        },
        {
          "unit": "ce08",
          "sectionId": "ex-observacao"
        }
      ],
      "groupId": "G4"
    },
    {
      "id": "cechefe.q08",
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
      ],
      "objectiveIds": [
        "O4"
      ],
      "recoverySectionIds": [
        "roteiro",
        "glossario"
      ],
      "originRefs": [
        {
          "unit": "ce08",
          "sectionId": "flutuante"
        },
        {
          "unit": "ce08",
          "sectionId": "ex-flutuante"
        },
        {
          "unit": "ce08",
          "sectionId": "ex-observacao"
        }
      ],
      "groupId": "G4"
    },
    {
      "id": "cechefe.q09",
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
      ],
      "objectiveIds": [
        "O4"
      ],
      "recoverySectionIds": [
        "roteiro",
        "glossario"
      ],
      "originRefs": [
        {
          "unit": "ce09",
          "sectionId": "formula"
        },
        {
          "unit": "ce09",
          "sectionId": "indice"
        },
        {
          "unit": "ce09",
          "sectionId": "ex-indice"
        }
      ],
      "groupId": "G5"
    },
    {
      "id": "cechefe.q10",
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
      ],
      "objectiveIds": [
        "O4"
      ],
      "recoverySectionIds": [
        "roteiro",
        "glossario"
      ],
      "originRefs": [
        {
          "unit": "ce10",
          "sectionId": "resultado"
        },
        {
          "unit": "ce10",
          "sectionId": "ex-resultado"
        },
        {
          "unit": "ce10",
          "sectionId": "competitividade"
        }
      ],
      "groupId": "G5"
    },
    {
      "id": "cechefe.q11",
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
      ],
      "objectiveIds": [
        "O5"
      ],
      "recoverySectionIds": [
        "roteiro",
        "glossario"
      ],
      "originRefs": [
        {
          "unit": "ce11",
          "sectionId": "inicio"
        },
        {
          "unit": "ce11",
          "sectionId": "ex-diferencial"
        },
        {
          "unit": "ce11",
          "sectionId": "moedas"
        },
        {
          "unit": "ce11",
          "sectionId": "ex-conversao"
        }
      ],
      "groupId": "G6"
    },
    {
      "id": "cechefe.q12",
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
      ],
      "objectiveIds": [
        "O5"
      ],
      "recoverySectionIds": [
        "roteiro",
        "glossario",
        "recuperacao"
      ],
      "originRefs": [
        {
          "unit": "ce11",
          "sectionId": "risco"
        },
        {
          "unit": "ce11",
          "sectionId": "fluxo"
        },
        {
          "unit": "ce11",
          "sectionId": "expectativas"
        }
      ],
      "groupId": "G6"
    }
  ],
  "recall": [
    "Explique os conceitos sem consultar e confira a seção de origem.",
    "Refaça o exemplo, separando dados, hipótese e conclusão.",
    "Quando errar, nomeie a confusão e retome as seções indicadas antes de tentar novamente."
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "cechefe-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "cechefe.q01": [
        {
          "missionId": "draft.cechefe",
          "sectionId": "roteiro"
        },
        {
          "missionId": "draft.cechefe",
          "sectionId": "glossario"
        },
        {
          "missionId": "draft.ce01",
          "sectionId": "mercados"
        },
        {
          "missionId": "draft.ce01",
          "sectionId": "exemplo-revenda"
        },
        {
          "missionId": "draft.ce02",
          "sectionId": "inicio"
        },
        {
          "missionId": "draft.ce02",
          "sectionId": "ex-participacao"
        }
      ],
      "cechefe.q02": [
        {
          "missionId": "draft.cechefe",
          "sectionId": "roteiro"
        },
        {
          "missionId": "draft.cechefe",
          "sectionId": "glossario"
        },
        {
          "missionId": "draft.ce03",
          "sectionId": "ex-emissor"
        },
        {
          "missionId": "draft.ce03",
          "sectionId": "contrato"
        },
        {
          "missionId": "draft.ce03",
          "sectionId": "saida"
        }
      ],
      "cechefe.q03": [
        {
          "missionId": "draft.cechefe",
          "sectionId": "roteiro"
        },
        {
          "missionId": "draft.cechefe",
          "sectionId": "glossario"
        },
        {
          "missionId": "draft.ce04",
          "sectionId": "cota"
        },
        {
          "missionId": "draft.ce04",
          "sectionId": "ex-cota"
        },
        {
          "missionId": "draft.ce04",
          "sectionId": "movimentacao"
        }
      ],
      "cechefe.q04": [
        {
          "missionId": "draft.cechefe",
          "sectionId": "roteiro"
        },
        {
          "missionId": "draft.cechefe",
          "sectionId": "glossario"
        },
        {
          "missionId": "draft.ce05",
          "sectionId": "liquido"
        },
        {
          "missionId": "draft.ce05",
          "sectionId": "ex-liquido"
        },
        {
          "missionId": "draft.ce05",
          "sectionId": "riscos"
        }
      ],
      "cechefe.q05": [
        {
          "missionId": "draft.cechefe",
          "sectionId": "roteiro"
        },
        {
          "missionId": "draft.cechefe",
          "sectionId": "glossario"
        },
        {
          "missionId": "draft.ce06",
          "sectionId": "conversao"
        },
        {
          "missionId": "draft.ce06",
          "sectionId": "perspectiva"
        }
      ],
      "cechefe.q06": [
        {
          "missionId": "draft.cechefe",
          "sectionId": "roteiro"
        },
        {
          "missionId": "draft.cechefe",
          "sectionId": "glossario"
        },
        {
          "missionId": "draft.ce07",
          "sectionId": "finalidades"
        },
        {
          "missionId": "draft.ce07",
          "sectionId": "autorizacao"
        },
        {
          "missionId": "draft.ce07",
          "sectionId": "regras"
        }
      ],
      "cechefe.q07": [
        {
          "missionId": "draft.cechefe",
          "sectionId": "roteiro"
        },
        {
          "missionId": "draft.cechefe",
          "sectionId": "glossario"
        },
        {
          "missionId": "draft.ce08",
          "sectionId": "fixo"
        },
        {
          "missionId": "draft.ce08",
          "sectionId": "intermediario"
        },
        {
          "missionId": "draft.ce08",
          "sectionId": "ex-banda"
        },
        {
          "missionId": "draft.ce08",
          "sectionId": "ex-observacao"
        }
      ],
      "cechefe.q08": [
        {
          "missionId": "draft.cechefe",
          "sectionId": "roteiro"
        },
        {
          "missionId": "draft.cechefe",
          "sectionId": "glossario"
        },
        {
          "missionId": "draft.ce08",
          "sectionId": "flutuante"
        },
        {
          "missionId": "draft.ce08",
          "sectionId": "ex-flutuante"
        },
        {
          "missionId": "draft.ce08",
          "sectionId": "ex-observacao"
        }
      ],
      "cechefe.q09": [
        {
          "missionId": "draft.cechefe",
          "sectionId": "roteiro"
        },
        {
          "missionId": "draft.cechefe",
          "sectionId": "glossario"
        },
        {
          "missionId": "draft.ce09",
          "sectionId": "formula"
        },
        {
          "missionId": "draft.ce09",
          "sectionId": "indice"
        },
        {
          "missionId": "draft.ce09",
          "sectionId": "ex-indice"
        }
      ],
      "cechefe.q10": [
        {
          "missionId": "draft.cechefe",
          "sectionId": "roteiro"
        },
        {
          "missionId": "draft.cechefe",
          "sectionId": "glossario"
        },
        {
          "missionId": "draft.ce10",
          "sectionId": "resultado"
        },
        {
          "missionId": "draft.ce10",
          "sectionId": "ex-resultado"
        },
        {
          "missionId": "draft.ce10",
          "sectionId": "competitividade"
        }
      ],
      "cechefe.q11": [
        {
          "missionId": "draft.cechefe",
          "sectionId": "roteiro"
        },
        {
          "missionId": "draft.cechefe",
          "sectionId": "glossario"
        },
        {
          "missionId": "draft.ce11",
          "sectionId": "inicio"
        },
        {
          "missionId": "draft.ce11",
          "sectionId": "ex-diferencial"
        },
        {
          "missionId": "draft.ce11",
          "sectionId": "moedas"
        },
        {
          "missionId": "draft.ce11",
          "sectionId": "ex-conversao"
        }
      ],
      "cechefe.q12": [
        {
          "missionId": "draft.cechefe",
          "sectionId": "roteiro"
        },
        {
          "missionId": "draft.cechefe",
          "sectionId": "glossario"
        },
        {
          "missionId": "draft.cechefe",
          "sectionId": "recuperacao"
        },
        {
          "missionId": "draft.ce11",
          "sectionId": "risco"
        },
        {
          "missionId": "draft.ce11",
          "sectionId": "fluxo"
        },
        {
          "missionId": "draft.ce11",
          "sectionId": "expectativas"
        }
      ]
    }
  }
};

export const EDITORIAL = {
  "stage": "Doze itens próprios redigidos conforme documento 82; revisão independente do Chefe e publicação pendentes; fora do catálogo",
  "referenceOnlyProfiles": [
    {
      "id": "bb.agente-comercial.2022-001",
      "item": "Itens 5 (investimentos), 6–11 — recortes do documento 80",
      "status": "histórico; referenceOnly"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Itens 19 (investimentos), 20–25 — recortes do documento 80",
      "status": "histórico; referenceOnly"
    }
  ],
  "objectives": {
    "O1": "Relacionar direitos, emissor e destino dos recursos.",
    "O2": "Interpretar cotas, riscos e ganho líquido sob condições dadas.",
    "O3": "Integrar conversão, finalidade e habilitação da instituição.",
    "O4": "Distinguir regra cambial, preço relativo e efeito parcial no comércio.",
    "O5": "Relacionar juros, reconversão e fluxos sem garantia de resultado.",
    "O6": "Recuperar a confusão conceitual pela seção de origem e reconstruir o caso."
  },
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Retomar as seções por questão, explicar o erro e refazer o raciocínio; sem indicador novo de domínio."
  },
  "limits": [
    "Doze itens próprios de prática exposta, não avaliação independente. Fontes e conceitos das aulas já verificadas são reaproveitados; não há norma, produto ou procedimento novo.",
    "Casos e valores fictícios; educação geral, sem recomendação de investimento ou procedimento para caso real. Não representa cobertura integral dos itens históricos.",
    "Prática exposta, não avaliação independente. IDs editoriais, sem XP/ordem/desbloqueio; publicação.status draft e nenhuma importação no runtime.",
    "Fontes novas consultadas em 01/10/2026; consultas reaproveitadas preservam a data original. Confirmar mudanças normativas pertinentes antes de publicação."
  ],
  "groups": [
    {
      "id": "G1",
      "title": "Instrumentos e fluxos",
      "units": [
        "ce01",
        "ce02",
        "ce03"
      ]
    },
    {
      "id": "G2",
      "title": "Fundos e riscos",
      "units": [
        "ce04",
        "ce05"
      ]
    },
    {
      "id": "G3",
      "title": "Conversão e operação",
      "units": [
        "ce06",
        "ce07"
      ]
    },
    {
      "id": "G4",
      "title": "Regimes",
      "units": [
        "ce08"
      ]
    },
    {
      "id": "G5",
      "title": "Real e comércio",
      "units": [
        "ce09",
        "ce10"
      ]
    },
    {
      "id": "G6",
      "title": "Juros e fluxos",
      "units": [
        "ce11"
      ]
    }
  ]
};

export const ARITHMETIC = [
  {
    "label": "q1 participação",
    "operation": "divide",
    "values": [
      60,
      1500
    ],
    "expected": 0.04
  },
  {
    "label": "q1 percentual",
    "operation": "multiply",
    "values": [
      0.04,
      100
    ],
    "expected": 4
  },
  {
    "label": "q1 emissão",
    "operation": "multiply",
    "values": [
      60,
      10
    ],
    "expected": 600
  },
  {
    "label": "q1 revenda",
    "operation": "multiply",
    "values": [
      25,
      12
    ],
    "expected": 300
  },
  {
    "label": "q2 vencimento",
    "operation": "multiply",
    "values": [
      900,
      1.06
    ],
    "expected": 954
  },
  {
    "label": "q2 venda",
    "operation": "subtract",
    "values": [
      870,
      900
    ],
    "expected": -30
  },
  {
    "label": "q3 cota inicial",
    "operation": "divide",
    "values": [
      9000,
      750
    ],
    "expected": 12
  },
  {
    "label": "q3 resgate",
    "operation": "multiply",
    "values": [
      25,
      13
    ],
    "expected": 325
  },
  {
    "label": "q4 ganho bruto",
    "operation": "subtract",
    "values": [
      840,
      750
    ],
    "expected": 90
  },
  {
    "label": "q4 ganho líquido",
    "operation": "subtract",
    "values": [
      90,
      15
    ],
    "expected": 75
  },
  {
    "label": "q4 taxa",
    "operation": "divide",
    "values": [
      75,
      750
    ],
    "expected": 0.1
  },
  {
    "label": "q5 venda do cliente",
    "operation": "multiply",
    "values": [
      150,
      5.2
    ],
    "expected": 780
  },
  {
    "label": "q9 preço convertido",
    "operation": "multiply",
    "values": [
      6,
      9
    ],
    "expected": 54
  },
  {
    "label": "q9 q",
    "operation": "divide",
    "values": [
      54,
      45
    ],
    "expected": 1.2
  },
  {
    "label": "q9 razão à base",
    "operation": "divide",
    "values": [
      1.2,
      1
    ],
    "expected": 1.2
  },
  {
    "label": "q9 índice",
    "operation": "multiply",
    "values": [
      1.2,
      100
    ],
    "expected": 120
  },
  {
    "label": "q10 receita antes",
    "operation": "multiply",
    "values": [
      150,
      4
    ],
    "expected": 600
  },
  {
    "label": "q10 custo antes",
    "operation": "multiply",
    "values": [
      60,
      4
    ],
    "expected": 240
  },
  {
    "label": "q10 margem antes",
    "operation": "subtract",
    "values": [
      600,
      240
    ],
    "expected": 360
  },
  {
    "label": "q10 resultado antes",
    "operation": "subtract",
    "values": [
      360,
      120
    ],
    "expected": 240
  },
  {
    "label": "q10 receita depois",
    "operation": "multiply",
    "values": [
      150,
      5
    ],
    "expected": 750
  },
  {
    "label": "q10 custo depois",
    "operation": "multiply",
    "values": [
      60,
      5
    ],
    "expected": 300
  },
  {
    "label": "q10 margem depois",
    "operation": "subtract",
    "values": [
      750,
      300
    ],
    "expected": 450
  },
  {
    "label": "q10 resultado depois",
    "operation": "subtract",
    "values": [
      450,
      120
    ],
    "expected": 330
  },
  {
    "label": "q10 diferença",
    "operation": "subtract",
    "values": [
      330,
      240
    ],
    "expected": 90
  },
  {
    "label": "q11 aplicação",
    "operation": "multiply",
    "values": [
      80,
      5
    ],
    "expected": 400
  },
  {
    "label": "q11 valor final",
    "operation": "multiply",
    "values": [
      400,
      1.05
    ],
    "expected": 420
  },
  {
    "label": "q11 dólares",
    "operation": "divide",
    "values": [
      420,
      6
    ],
    "expected": 70
  },
  {
    "label": "q11 resultado",
    "operation": "subtract",
    "values": [
      70,
      80
    ],
    "expected": -10
  },
  {
    "label": "q11 taxa",
    "operation": "divide",
    "values": [
      -10,
      80
    ],
    "expected": -0.125
  },
  {
    "label": "q11 percentual",
    "operation": "multiply",
    "values": [
      -0.125,
      100
    ],
    "expected": -12.5
  },
  {
    "label": "q11 diferencial",
    "operation": "subtract",
    "values": [
      5,
      2
    ],
    "expected": 3
  }
];
