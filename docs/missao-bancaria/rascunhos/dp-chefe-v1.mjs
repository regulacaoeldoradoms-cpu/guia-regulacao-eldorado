// Rascunho fora do catálogo; pré-requisitos e recuperação preservados.
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
  },
  {
    "id": "bcb.dp.fintechs",
    "label": "BCB — Fintechs",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/fintechs",
    "locator": "Definição introdutória; não utilizados limites ou normas antigos da página",
    "version": "Página oficial consultada em 01/10/2026",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "lei.dp.startups",
    "label": "LC 182/2021 — Startups",
    "url": "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp182.htm",
    "locator": "Art. 4º: conceito e requisitos adicionais para enquadramento",
    "version": "Texto oficial consultado; sem ensino de limites numéricos",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "bis.dp.bigtech",
    "label": "BIS — Big tech in finance",
    "url": "https://www.bis.org/publications/aer-2019/big-tech-finance-opportunities-risks",
    "locator": "Conceitos de plataforma, dados, rede e entrada em finanças; não estatísticas atuais",
    "version": "Annual Economic Report 2019, capítulo III",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "fsb.dp.nbfi",
    "label": "FSB — Non-Bank Financial Intermediation",
    "url": "https://www.fsb.org/work-of-the-fsb/financial-innovation-and-structural-change/non-bank-financial-intermediation/",
    "locator": "Introdução e Monitoring: universo amplo, subconjunto de riscos, liquidez/prazos/alavancagem",
    "version": "Página oficial consultada em 01/10/2026",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "bcb.dp.spb",
    "label": "BCB — Sistema de Pagamentos Brasileiro",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/spb",
    "locator": "Infraestruturas, arranjos e participantes",
    "version": "Página oficial consultada em 01/10/2026",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "bcb.dp.arranjos",
    "label": "BCB — Arranjos de pagamento",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/arranjospagamento",
    "locator": "Conceito e distinção entre arranjo, participantes e instituições",
    "version": "Página oficial consultada em 01/10/2026",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "bis.dp.liquidacao",
    "label": "CPSS-IOSCO — Principles for financial market infrastructures",
    "url": "https://www.bis.org/publications/principles-financial-market-infrastructures.pdf",
    "locator": "Abril de 2012, princípio 8, §3.8.1 e anexo H: liquidação final como transferência de ativo ou cumprimento de obrigação; recorte de pagamentos.",
    "version": "Documento de abril de 2012; conceito consultado em 03/10/2026",
    "checkedAt": "2026-10-03"
  },
  {
    "id": "bcb.dp.pix",
    "label": "BCB — Pix",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/pix",
    "locator": "Conceito, disponibilidade e contas; não tarifas/limites/exceções operacionais",
    "version": "Página oficial consultada em 01/10/2026",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "bcb.dp.openfinance",
    "label": "BCB — Open Finance",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/openfinance",
    "locator": "Escolha de dados/destinatário/prazo, cancelamento e benefícios possíveis",
    "version": "Página oficial consultada em 01/10/2026",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "lei.dp.conservacao",
    "label": "Lei 13.709/2018 — LGPD",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm",
    "locator": "Arts. 16, I, e 18, VI/IX: conservação para obrigação legal ou regulatória, ressalvas à eliminação e revogação do consentimento.",
    "version": "Texto compilado consultado em 03/10/2026",
    "checkedAt": "2026-10-03"
  },
  {
    "id": "nist.dp.blockchain",
    "label": "NIST — Blockchain Technology Overview",
    "url": "https://csrc.nist.gov/pubs/ir/8202/final",
    "locator": "Resumo executivo e seção 2: registro, consenso e redes permissionadas/abertas",
    "version": "NIST IR 8202, versão final de outubro de 2018",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "lei.dp.ativos",
    "label": "Lei 14.478/2022 — Ativos virtuais",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/lei/l14478.htm",
    "locator": "Art. 3º e exclusões; art. 1º parágrafo único; sem regime atual de autorização das prestadoras",
    "version": "Texto oficial consultado em 01/10/2026",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "bcb.dp.drex",
    "label": "BCB — Drex",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/drex",
    "locator": "Proposta de plataforma integrada e intermediação; sem data de lançamento ou acesso público presumido",
    "version": "Página oficial; revalidada em 03/10/2026",
    "checkedAt": "2026-10-03"
  },
  {
    "id": "bcb.dp.drex.conceito",
    "label": "BCB — FAQ Drex",
    "url": "https://www.bcb.gov.br/meubc/faqs/p/drex",
    "locator": "CBDC; distinção entre emissão de atacado pelo BC e representações de varejo por instituições autorizadas",
    "version": "FAQ com atualização exibida de 16/10/2023; revalidada em 03/10/2026",
    "checkedAt": "2026-10-03"
  },
  {
    "id": "bcb.dp.drex.lancamento",
    "label": "BCB — FAQ Lançamento do Drex",
    "url": "https://www.bcb.gov.br/meubc/faqs/p/lancamento-do-drex",
    "locator": "Página mantém ausência de data específica; não é confirmação independente do estágio de todas as etapas",
    "version": "FAQ com atualização exibida de 20/02/2024; revalidada em 03/10/2026",
    "checkedAt": "2026-10-03"
  },
  {
    "id": "cmn.dp.correspondentes",
    "label": "CMN — Resolução 4.935/2021",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/exibenormativo?tipo=Resolu%C3%A7%C3%A3o%20CMN&numero=4935",
    "locator": "Arts. 2º, 3º, 12 e 14: atuação contratada, responsabilidade e identificação; art. 8º revogado não utilizado",
    "version": "Versão vigente exibida pelo BCB, atualizada em 01/12/2025",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "lei.dp.lgpd",
    "label": "Lei 13.709/2018 — LGPD",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm",
    "locator": "Art. 6º: finalidade, adequação, necessidade e não discriminação; art. 7º: bases legais",
    "version": "Texto oficial consultado em 01/10/2026",
    "checkedAt": "2026-10-01"
  }
];

export const DPCHEFE_DRAFT = {
  "id": "draft.dpchefe",
  "topicId": "draft.dpchefe",
  "editorialKey": "DP-CHEFE",
  "candidateBlockId": "banking.digital-payments",
  "title": "Chefe de Pagamentos Digitais: identifique papéis, etapas e limites",
  "contentVersion": 1,
  "kind": "boss",
  "publication": {
    "status": "draft"
  },
  "objective": "Integrar doze casos próprios de pagamentos digitais, explicando as hipóteses e retomando o ensino de origem.",
  "sourceIds": [
    "bcb.conta.deposito",
    "bcb.conta.digital",
    "bcb.conta.pagamento",
    "caixa.dp.canais",
    "bcb.dp.fintechs",
    "lei.dp.startups",
    "bis.dp.bigtech",
    "fsb.dp.nbfi",
    "bcb.dp.spb",
    "bcb.dp.arranjos",
    "bis.dp.liquidacao",
    "bcb.dp.pix",
    "bcb.dp.openfinance",
    "lei.dp.conservacao",
    "nist.dp.blockchain",
    "lei.dp.ativos",
    "bcb.dp.drex",
    "bcb.dp.drex.conceito",
    "bcb.dp.drex.lancamento",
    "cmn.dp.correspondentes",
    "lei.dp.lgpd"
  ],
  "sections": [
    {
      "id": "preparacao",
      "type": "explanation",
      "heading": "1. Ensino antes do desafio",
      "body": "As aulas [DP-01](dp-01-v1.md), [DP-02](dp-02-v1.md), [DP-03](dp-03-v1.md), [DP-04](dp-04-v1.md), [DP-05](dp-05-v1.md), [DP-06](dp-06-v1.md), [DP-07](dp-07-v1.md), [DP-08](dp-08-v1.md), [DP-09](dp-09-v1.md), [DP-10](dp-10-v1.md), [DP-11](dp-11-v1.md), [DP-12](dp-12-v1.md) e a [revisão DP-R](dp-r-v1.md) ensinam os conceitos cobrados. Leia os trechos de origem antes de usar o comentário de uma questão. Os casos são fictícios, sem operação real, preço atual ou dado do aluno.",
      "sourceIds": []
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
  "questions": [
    {
      "id": "dpchefe.q01",
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
          "unit": "dp01",
          "sectionId": "estados"
        },
        {
          "unit": "dp02",
          "sectionId": "ex-canal"
        }
      ],
      "groupId": "G1"
    },
    {
      "id": "dpchefe.q02",
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
          "unit": "dp01",
          "sectionId": "camadas"
        },
        {
          "unit": "dp02",
          "sectionId": "modelo"
        },
        {
          "unit": "dp02",
          "sectionId": "evidencia"
        }
      ],
      "groupId": "G1"
    },
    {
      "id": "dpchefe.q03",
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
          "unit": "dp03",
          "sectionId": "dimensoes"
        },
        {
          "unit": "dp03",
          "sectionId": "rotulos"
        },
        {
          "unit": "dp04",
          "sectionId": "liquidez"
        }
      ],
      "groupId": "G2"
    },
    {
      "id": "dpchefe.q04",
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
          "unit": "dp03",
          "sectionId": "rotulos"
        },
        {
          "unit": "dp04",
          "sectionId": "alavancagem"
        },
        {
          "unit": "dp04",
          "sectionId": "ex-alavancagem"
        }
      ],
      "groupId": "G2"
    },
    {
      "id": "dpchefe.q05",
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
          "unit": "dp05",
          "sectionId": "arranjo"
        },
        {
          "unit": "dp06",
          "sectionId": "agendamento"
        },
        {
          "unit": "dp06",
          "sectionId": "ex-agenda"
        }
      ],
      "groupId": "G3"
    },
    {
      "id": "dpchefe.q06",
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
          "unit": "dp05",
          "sectionId": "participantes"
        },
        {
          "unit": "dp07",
          "sectionId": "controle"
        },
        {
          "unit": "dp07",
          "sectionId": "oferta"
        },
        {
          "unit": "dp07",
          "sectionId": "pagamento"
        }
      ],
      "groupId": "G3"
    },
    {
      "id": "dpchefe.q07",
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
          "unit": "dp08",
          "sectionId": "ativos"
        },
        {
          "unit": "dp08",
          "sectionId": "risco"
        },
        {
          "unit": "dp09",
          "sectionId": "cbdc"
        },
        {
          "unit": "dp09",
          "sectionId": "ex-distincao"
        }
      ],
      "groupId": "G4"
    },
    {
      "id": "dpchefe.q08",
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
          "unit": "dp08",
          "sectionId": "ex-registro"
        },
        {
          "unit": "dp09",
          "sectionId": "intermediacao"
        },
        {
          "unit": "dp09",
          "sectionId": "ex-condicoes"
        },
        {
          "unit": "dp09",
          "sectionId": "estagio"
        }
      ],
      "groupId": "G4"
    },
    {
      "id": "dpchefe.q09",
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
          "unit": "dp10",
          "sectionId": "propostas"
        },
        {
          "unit": "dp10",
          "sectionId": "responsabilidade"
        },
        {
          "unit": "dp11",
          "sectionId": "plataforma"
        },
        {
          "unit": "dp11",
          "sectionId": "papeis"
        }
      ],
      "groupId": "G5"
    },
    {
      "id": "dpchefe.q10",
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
          "unit": "dp10",
          "sectionId": "papel"
        },
        {
          "unit": "dp11",
          "sectionId": "remuneracao"
        },
        {
          "unit": "dp11",
          "sectionId": "ex-comissao"
        }
      ],
      "groupId": "G5"
    },
    {
      "id": "dpchefe.q11",
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
      ],
      "objectiveIds": [
        "O6"
      ],
      "recoverySectionIds": [
        "roteiro",
        "glossario"
      ],
      "originRefs": [
        {
          "unit": "dp12",
          "sectionId": "segmentos"
        },
        {
          "unit": "dp12",
          "sectionId": "ex-canal"
        },
        {
          "unit": "dp12",
          "sectionId": "dados"
        }
      ],
      "groupId": "G6"
    },
    {
      "id": "dpchefe.q12",
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
      ],
      "objectiveIds": [
        "O6"
      ],
      "recoverySectionIds": [
        "roteiro",
        "glossario",
        "recuperacao"
      ],
      "originRefs": [
        {
          "unit": "dp12",
          "sectionId": "indicadores"
        },
        {
          "unit": "dp12",
          "sectionId": "ex-metrica"
        },
        {
          "unit": "dp12",
          "sectionId": "resumo"
        }
      ],
      "groupId": "G6"
    }
  ],
  "recall": [
    "Explique quem faz o quê e qual etapa foi comprovada.",
    "Separe tecnologia, natureza, direitos e resultado.",
    "Refaça o cálculo e declare seu denominador e suas hipóteses."
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "dpchefe-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "dpchefe.q01": [
        {
          "missionId": "draft.dpchefe",
          "sectionId": "roteiro"
        },
        {
          "missionId": "draft.dpchefe",
          "sectionId": "glossario"
        },
        {
          "missionId": "draft.dp01",
          "sectionId": "estados"
        },
        {
          "missionId": "draft.dp02",
          "sectionId": "ex-canal"
        }
      ],
      "dpchefe.q02": [
        {
          "missionId": "draft.dpchefe",
          "sectionId": "roteiro"
        },
        {
          "missionId": "draft.dpchefe",
          "sectionId": "glossario"
        },
        {
          "missionId": "draft.dp01",
          "sectionId": "camadas"
        },
        {
          "missionId": "draft.dp02",
          "sectionId": "modelo"
        },
        {
          "missionId": "draft.dp02",
          "sectionId": "evidencia"
        }
      ],
      "dpchefe.q03": [
        {
          "missionId": "draft.dpchefe",
          "sectionId": "roteiro"
        },
        {
          "missionId": "draft.dpchefe",
          "sectionId": "glossario"
        },
        {
          "missionId": "draft.dp03",
          "sectionId": "dimensoes"
        },
        {
          "missionId": "draft.dp03",
          "sectionId": "rotulos"
        },
        {
          "missionId": "draft.dp04",
          "sectionId": "liquidez"
        }
      ],
      "dpchefe.q04": [
        {
          "missionId": "draft.dpchefe",
          "sectionId": "roteiro"
        },
        {
          "missionId": "draft.dpchefe",
          "sectionId": "glossario"
        },
        {
          "missionId": "draft.dp03",
          "sectionId": "rotulos"
        },
        {
          "missionId": "draft.dp04",
          "sectionId": "alavancagem"
        },
        {
          "missionId": "draft.dp04",
          "sectionId": "ex-alavancagem"
        }
      ],
      "dpchefe.q05": [
        {
          "missionId": "draft.dpchefe",
          "sectionId": "roteiro"
        },
        {
          "missionId": "draft.dpchefe",
          "sectionId": "glossario"
        },
        {
          "missionId": "draft.dp05",
          "sectionId": "arranjo"
        },
        {
          "missionId": "draft.dp06",
          "sectionId": "agendamento"
        },
        {
          "missionId": "draft.dp06",
          "sectionId": "ex-agenda"
        }
      ],
      "dpchefe.q06": [
        {
          "missionId": "draft.dpchefe",
          "sectionId": "roteiro"
        },
        {
          "missionId": "draft.dpchefe",
          "sectionId": "glossario"
        },
        {
          "missionId": "draft.dp05",
          "sectionId": "participantes"
        },
        {
          "missionId": "draft.dp07",
          "sectionId": "controle"
        },
        {
          "missionId": "draft.dp07",
          "sectionId": "oferta"
        },
        {
          "missionId": "draft.dp07",
          "sectionId": "pagamento"
        }
      ],
      "dpchefe.q07": [
        {
          "missionId": "draft.dpchefe",
          "sectionId": "roteiro"
        },
        {
          "missionId": "draft.dpchefe",
          "sectionId": "glossario"
        },
        {
          "missionId": "draft.dp08",
          "sectionId": "ativos"
        },
        {
          "missionId": "draft.dp08",
          "sectionId": "risco"
        },
        {
          "missionId": "draft.dp09",
          "sectionId": "cbdc"
        },
        {
          "missionId": "draft.dp09",
          "sectionId": "ex-distincao"
        }
      ],
      "dpchefe.q08": [
        {
          "missionId": "draft.dpchefe",
          "sectionId": "roteiro"
        },
        {
          "missionId": "draft.dpchefe",
          "sectionId": "glossario"
        },
        {
          "missionId": "draft.dp08",
          "sectionId": "ex-registro"
        },
        {
          "missionId": "draft.dp09",
          "sectionId": "intermediacao"
        },
        {
          "missionId": "draft.dp09",
          "sectionId": "ex-condicoes"
        },
        {
          "missionId": "draft.dp09",
          "sectionId": "estagio"
        }
      ],
      "dpchefe.q09": [
        {
          "missionId": "draft.dpchefe",
          "sectionId": "roteiro"
        },
        {
          "missionId": "draft.dpchefe",
          "sectionId": "glossario"
        },
        {
          "missionId": "draft.dp10",
          "sectionId": "propostas"
        },
        {
          "missionId": "draft.dp10",
          "sectionId": "responsabilidade"
        },
        {
          "missionId": "draft.dp11",
          "sectionId": "plataforma"
        },
        {
          "missionId": "draft.dp11",
          "sectionId": "papeis"
        }
      ],
      "dpchefe.q10": [
        {
          "missionId": "draft.dpchefe",
          "sectionId": "roteiro"
        },
        {
          "missionId": "draft.dpchefe",
          "sectionId": "glossario"
        },
        {
          "missionId": "draft.dp10",
          "sectionId": "papel"
        },
        {
          "missionId": "draft.dp11",
          "sectionId": "remuneracao"
        },
        {
          "missionId": "draft.dp11",
          "sectionId": "ex-comissao"
        }
      ],
      "dpchefe.q11": [
        {
          "missionId": "draft.dpchefe",
          "sectionId": "roteiro"
        },
        {
          "missionId": "draft.dpchefe",
          "sectionId": "glossario"
        },
        {
          "missionId": "draft.dp12",
          "sectionId": "segmentos"
        },
        {
          "missionId": "draft.dp12",
          "sectionId": "ex-canal"
        },
        {
          "missionId": "draft.dp12",
          "sectionId": "dados"
        }
      ],
      "dpchefe.q12": [
        {
          "missionId": "draft.dpchefe",
          "sectionId": "roteiro"
        },
        {
          "missionId": "draft.dpchefe",
          "sectionId": "glossario"
        },
        {
          "missionId": "draft.dpchefe",
          "sectionId": "recuperacao"
        },
        {
          "missionId": "draft.dp12",
          "sectionId": "indicadores"
        },
        {
          "missionId": "draft.dp12",
          "sectionId": "ex-metrica"
        },
        {
          "missionId": "draft.dp12",
          "sectionId": "resumo"
        }
      ]
    }
  }
};

export const EDITORIAL = {
  "stage": "Doze itens próprios redigidos conforme documento 86; revisão pedagógica independente e publicação pendentes; fora do catálogo",
  "referenceOnlyProfiles": [
    {
      "id": "bb.agente-comercial.2022-001",
      "item": "Atualidades: recortes do documento 84",
      "status": "histórico; referenceOnly"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Conhecimentos Bancários: recortes do documento 84; marketplace/segmentação sem item nominal",
      "status": "histórico; referenceOnly"
    }
  ],
  "objectives": {
    "O1": "Integrar canal, processo, modelo e estado informado.",
    "O2": "Interpretar rótulo econômico e estrutura de risco.",
    "O3": "Separar arranjo, instrução, liquidação e compartilhamento.",
    "O4": "Distinguir registro, direito, emissor e estágio.",
    "O5": "Identificar papéis e calcular comissão/repasse sob hipóteses explícitas.",
    "O6": "Relacionar necessidade, indicador e recuperação da inferência indevida."
  },
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Nomear a confusão, retomar as origens e reconstruir o caso."
  },
  "groups": [
    {
      "id": "G1",
      "units": [
        "dp01",
        "dp02"
      ]
    },
    {
      "id": "G2",
      "units": [
        "dp03",
        "dp04"
      ]
    },
    {
      "id": "G3",
      "units": [
        "dp05",
        "dp06",
        "dp07"
      ]
    },
    {
      "id": "G4",
      "units": [
        "dp08",
        "dp09"
      ]
    },
    {
      "id": "G5",
      "units": [
        "dp10",
        "dp11"
      ]
    },
    {
      "id": "G6",
      "units": [
        "dp12"
      ]
    }
  ],
  "limits": [
    "Itens expostos de integração introdutória; não constituem avaliação independente ou simulado integral de edital.",
    "Fontes e ensino de 01/10/2026 reaproveitados, sem nova afirmação sobre estágio atual do Drex; revalidar antes de publicação.",
    "Casos próprios fictícios; sem dados reais, oferta, tarifa atual ou operação em produção.",
    "Marketplace/segmentação têm correspondência nominal BB; não atribuir cobertura nominal CAIXA.",
    "Sem XP, ordem ou ativação. Aceite humano da Fase 2 não observado."
  ]
};

export const ARITHMETIC = [
  {
    "label": "Capital após queda",
    "operation": "subtract",
    "values": [
      88,
      70
    ],
    "expected": 18
  },
  {
    "label": "Perda do capital",
    "operation": "subtract",
    "values": [
      30,
      18
    ],
    "expected": 12
  },
  {
    "label": "Perda relativa",
    "operation": "divide",
    "values": [
      12,
      30
    ],
    "expected": 0.4
  },
  {
    "label": "Comissão sobre venda",
    "operation": "multiply",
    "values": [
      300,
      0.04
    ],
    "expected": 12
  },
  {
    "label": "Repasse antes de demais custos",
    "operation": "subtract",
    "values": [
      300,
      12
    ],
    "expected": 288
  },
  {
    "label": "Proporção de respondentes",
    "operation": "divide",
    "values": [
      16,
      40
    ],
    "expected": 0.4
  }
];
