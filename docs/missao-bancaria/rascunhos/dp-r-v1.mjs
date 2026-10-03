export const SOURCES = [
  {
    "id": "bcb.dp.fintechs",
    "label": "BCB — Fintechs",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/fintechs",
    "locator": "Definição introdutória; não utilizados limites ou normas antigos da página",
    "version": "Página oficial consultada em 01/10/2026",
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
    "id": "cmn.dp.correspondentes",
    "label": "CMN — Resolução 4.935/2021",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/exibenormativo?tipo=Resolu%C3%A7%C3%A3o%20CMN&numero=4935",
    "locator": "Arts. 2º, 3º, 12 e 14: atuação contratada, responsabilidade e identificação; art. 8º revogado não utilizado",
    "version": "Versão vigente exibida pelo BCB, atualizada em 01/12/2025",
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
    "id": "lei.dp.lgpd",
    "label": "Lei 13.709/2018 — LGPD",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm",
    "locator": "Art. 6º: finalidade, adequação, necessidade e não discriminação; art. 7º: bases legais",
    "version": "Texto oficial consultado em 01/10/2026",
    "checkedAt": "2026-10-01"
  }
];

export const DPR_DRAFT = {
  "id": "draft.dpr",
  "topicId": "banking.digital-payments",
  "candidateBlockId": "banking.digital-payments",
  "editorialKey": "DP-R",
  "title": "Revisão cumulativa de pagamentos digitais",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Integrar canal, processo, atividade e instituição sem inferências indevidas.",
  "sourceIds": [
    "bcb.dp.fintechs",
    "fsb.dp.nbfi",
    "bcb.dp.spb",
    "bcb.dp.pix",
    "bcb.dp.openfinance",
    "nist.dp.blockchain",
    "lei.dp.ativos",
    "bcb.dp.drex",
    "cmn.dp.correspondentes",
    "bis.dp.bigtech",
    "lei.dp.lgpd"
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
        "bcb.dp.fintechs",
        "fsb.dp.nbfi"
      ]
    },
    {
      "id": "fluxos",
      "type": "explanation",
      "heading": "3. Instrução e execução",
      "body": "SPB e arranjos organizam infraestruturas e regras. Pix é um sistema de pagamento; agendamento é uma instrução futura. Correspondentes atendem por conta da contratante e podem encaminhar propostas. Em cada situação, o verbo importa: receber, autorizar, encaminhar e concluir não têm o mesmo significado.",
      "sourceIds": [
        "bcb.dp.spb",
        "bcb.dp.pix",
        "cmn.dp.correspondentes"
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
        "bcb.dp.openfinance",
        "nist.dp.blockchain",
        "lei.dp.ativos",
        "bcb.dp.drex"
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
        "bis.dp.bigtech",
        "lei.dp.lgpd"
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
  "questions": [
    {
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
      ],
      "recoverySectionIds": [
        "mapa"
      ],
      "objectiveIds": [
        "O1"
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
      "id": "dpr.q01"
    },
    {
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
      ],
      "recoverySectionIds": [
        "ex-integrado"
      ],
      "objectiveIds": [
        "O1",
        "O2"
      ],
      "originRefs": [
        {
          "unit": "dp03",
          "sectionId": "rotulos"
        },
        {
          "unit": "dp04",
          "sectionId": "liquidez"
        }
      ],
      "id": "dpr.q02"
    },
    {
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
      ],
      "recoverySectionIds": [
        "fluxos",
        "ex-etapas"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "dp05",
          "sectionId": "arranjo"
        },
        {
          "unit": "dp06",
          "sectionId": "agendamento"
        }
      ],
      "id": "dpr.q03"
    },
    {
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
      ],
      "recoverySectionIds": [
        "dados-ativos"
      ],
      "objectiveIds": [
        "O4"
      ],
      "originRefs": [
        {
          "unit": "dp07",
          "sectionId": "controle"
        },
        {
          "unit": "dp07",
          "sectionId": "pagamento"
        }
      ],
      "id": "dpr.q04"
    },
    {
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
      ],
      "recoverySectionIds": [
        "dados-ativos",
        "ex-digital"
      ],
      "objectiveIds": [
        "O4"
      ],
      "originRefs": [
        {
          "unit": "dp08",
          "sectionId": "ativos"
        },
        {
          "unit": "dp09",
          "sectionId": "cbdc"
        },
        {
          "unit": "dp09",
          "sectionId": "estagio"
        }
      ],
      "id": "dpr.q05"
    },
    {
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
      ],
      "recoverySectionIds": [
        "fluxos",
        "ex-etapas"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "dp10",
          "sectionId": "propostas"
        },
        {
          "unit": "dp10",
          "sectionId": "responsabilidade"
        }
      ],
      "id": "dpr.q06"
    },
    {
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
      ],
      "recoverySectionIds": [
        "interacao"
      ],
      "objectiveIds": [
        "O5"
      ],
      "originRefs": [
        {
          "unit": "dp11",
          "sectionId": "ex-comparacao"
        }
      ],
      "id": "dpr.q07"
    },
    {
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
      ],
      "recoverySectionIds": [
        "interacao",
        "ex-comparar",
        "resumo"
      ],
      "objectiveIds": [
        "O5",
        "O6"
      ],
      "originRefs": [
        {
          "unit": "dp12",
          "sectionId": "segmentos"
        },
        {
          "unit": "dp12",
          "sectionId": "indicadores"
        }
      ],
      "id": "dpr.q08"
    }
  ],
  "recall": [
    "Faça uma linha para cada participante, etapa e resultado.",
    "Nomeie o erro e retome a aula de origem indicada após a questão."
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "dpr-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "dpr.q01": [
        {
          "missionId": "draft.dpr",
          "sectionId": "mapa"
        }
      ],
      "dpr.q02": [
        {
          "missionId": "draft.dpr",
          "sectionId": "ex-integrado"
        }
      ],
      "dpr.q03": [
        {
          "missionId": "draft.dpr",
          "sectionId": "fluxos"
        },
        {
          "missionId": "draft.dpr",
          "sectionId": "ex-etapas"
        }
      ],
      "dpr.q04": [
        {
          "missionId": "draft.dpr",
          "sectionId": "dados-ativos"
        }
      ],
      "dpr.q05": [
        {
          "missionId": "draft.dpr",
          "sectionId": "dados-ativos"
        },
        {
          "missionId": "draft.dpr",
          "sectionId": "ex-digital"
        }
      ],
      "dpr.q06": [
        {
          "missionId": "draft.dpr",
          "sectionId": "fluxos"
        },
        {
          "missionId": "draft.dpr",
          "sectionId": "ex-etapas"
        }
      ],
      "dpr.q07": [
        {
          "missionId": "draft.dpr",
          "sectionId": "interacao"
        }
      ],
      "dpr.q08": [
        {
          "missionId": "draft.dpr",
          "sectionId": "interacao"
        },
        {
          "missionId": "draft.dpr",
          "sectionId": "ex-comparar"
        },
        {
          "missionId": "draft.dpr",
          "sectionId": "resumo"
        }
      ]
    }
  }
};

export const EDITORIAL = {
  "stage": "Autoria concluída; revisão pedagógica independente pendente; fora do catálogo",
  "referenceOnlyProfiles": [
    {
      "id": "bb.agente-comercial.2022-001",
      "item": "Atualidades 1–7 e 9–15, nos recortes do plano 84",
      "status": "histórico; referenceOnly"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Conhecimentos Bancários 4–15 e 38, nos recortes do plano 84; marketplace/segmentação não nominais",
      "status": "histórico; referenceOnly"
    }
  ],
  "objectives": {
    "O1": "Integrar canal, processo, atividade e instituição sem inferências indevidas.",
    "O2": "Relacionar financiamento não bancário a estrutura e risco.",
    "O3": "Separar regras de pagamento, instrução, agendamento e conclusão.",
    "O4": "Distinguir compartilhamento, ativo digital, CBDC e disponibilidade.",
    "O5": "Interpretar papéis comerciais e indicadores de interação.",
    "O6": "Recuperar a confusão pela seção de ensino e refazer o caso."
  },
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Nomear a confusão e reconstruir o caso após retomar o ensino."
  },
  "limits": [
    "Revisão exposta, não avaliação independente; oito itens integram doze aulas sem representar simulado completo de edital.",
    "Recortes marketplace/segmentação têm origem nominal BB; não representam cobertura nominal CAIXA.",
    "Casos e números autorais fictícios; não representam operação, oferta ou dado pessoal real.",
    "Sem XP/ordem/desbloqueio ou importação no runtime; não equivale a aceite humano da Fase 2."
  ]
};

export const ARITHMETIC = [
  {
    "label": "Total de oferta na revisão",
    "operation": "add",
    "values": [
      70,
      25
    ],
    "expected": 95
  }
];
