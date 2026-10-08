export const SOURCES = [
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
    "id": "bcb.dp.pix",
    "label": "BCB — Pix",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/pix",
    "locator": "Conceito, disponibilidade e contas; não tarifas/limites/exceções operacionais",
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
  }
];

export const DP09_DRAFT = {
  "id": "draft.dp09",
  "topicId": "banking.digital-payments",
  "candidateBlockId": "banking.digital-payments",
  "editorialKey": "DP-09",
  "title": "CBDC e Drex: conceito, proposta e limites",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Distinguir moeda digital de banco central, pagamento e ativo privado.",
  "sourceIds": [
    "bcb.dp.drex",
    "bcb.dp.drex.conceito",
    "bcb.dp.drex.lancamento",
    "bcb.dp.pix",
    "nist.dp.blockchain"
  ],
  "sections": [
    {
      "id": "cbdc",
      "type": "explanation",
      "heading": "1. Emissor e função vêm antes da tecnologia",
      "body": "CBDC é a sigla inglesa para moeda digital de banco central. O BCB apresenta Drex como o real em formato digital em uma plataforma para serviços financeiros. Isso é diferente de chamar qualquer criptoativo privado de moeda emitida pelo BC. Pix, por sua vez, é sistema de pagamento: não é uma CBDC.",
      "sourceIds": [
        "bcb.dp.drex.conceito",
        "bcb.dp.pix"
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
        "bcb.dp.drex",
        "bcb.dp.drex.conceito"
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
        "bcb.dp.drex",
        "nist.dp.blockchain"
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
      "body": "As três páginas do BCB foram reconsultadas em 03/10/2026. A página geral continua descrevendo funcionalidades futuras; a FAQ de conceito conserva atualização exibida de 16/10/2023 e a de lançamento, de 20/02/2024, não indica data específica. A consulta confirma o teor dessas páginas, sem comprovar todas as etapas atuais do projeto. Não permite prometer acesso público, calendário ou funcionalidades de produção. Os exemplos desta aula descrevem a proposta, sem incorporarem cronograma de notícia antiga.",
      "sourceIds": [
        "bcb.dp.drex",
        "bcb.dp.drex.lancamento"
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
  "questions": [
    {
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
      ],
      "recoverySectionIds": [
        "cbdc"
      ],
      "objectiveIds": [
        "O1"
      ],
      "id": "dp09.q01"
    },
    {
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
      ],
      "recoverySectionIds": [
        "cbdc",
        "ex-distincao"
      ],
      "objectiveIds": [
        "O1",
        "O2"
      ],
      "id": "dp09.q02"
    },
    {
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
      ],
      "recoverySectionIds": [
        "intermediacao",
        "ex-intermediario"
      ],
      "objectiveIds": [
        "O3"
      ],
      "id": "dp09.q03"
    },
    {
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
      ],
      "recoverySectionIds": [
        "ativos"
      ],
      "objectiveIds": [
        "O4"
      ],
      "id": "dp09.q04"
    },
    {
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
      ],
      "recoverySectionIds": [
        "ex-condicoes"
      ],
      "objectiveIds": [
        "O4",
        "O5"
      ],
      "id": "dp09.q05"
    },
    {
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
      ],
      "recoverySectionIds": [
        "estagio",
        "ex-anuncio"
      ],
      "objectiveIds": [
        "O5"
      ],
      "id": "dp09.q06"
    },
    {
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
      ],
      "recoverySectionIds": [
        "intermediacao"
      ],
      "objectiveIds": [
        "O2",
        "O3"
      ],
      "id": "dp09.q07"
    },
    {
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
      ],
      "recoverySectionIds": [
        "estagio",
        "ex-anuncio",
        "resumo"
      ],
      "objectiveIds": [
        "O6"
      ],
      "id": "dp09.q08"
    }
  ],
  "recall": [
    "Separe moeda, sistema de pagamento e ativo privado.",
    "Identifique emissor, intermediário e estágio confirmado."
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "dp09-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "dp09.q01": [
        {
          "missionId": "draft.dp09",
          "sectionId": "cbdc"
        }
      ],
      "dp09.q02": [
        {
          "missionId": "draft.dp09",
          "sectionId": "cbdc"
        },
        {
          "missionId": "draft.dp09",
          "sectionId": "ex-distincao"
        }
      ],
      "dp09.q03": [
        {
          "missionId": "draft.dp09",
          "sectionId": "intermediacao"
        },
        {
          "missionId": "draft.dp09",
          "sectionId": "ex-intermediario"
        }
      ],
      "dp09.q04": [
        {
          "missionId": "draft.dp09",
          "sectionId": "ativos"
        }
      ],
      "dp09.q05": [
        {
          "missionId": "draft.dp09",
          "sectionId": "ex-condicoes"
        }
      ],
      "dp09.q06": [
        {
          "missionId": "draft.dp09",
          "sectionId": "estagio"
        },
        {
          "missionId": "draft.dp09",
          "sectionId": "ex-anuncio"
        }
      ],
      "dp09.q07": [
        {
          "missionId": "draft.dp09",
          "sectionId": "intermediacao"
        }
      ],
      "dp09.q08": [
        {
          "missionId": "draft.dp09",
          "sectionId": "estagio"
        },
        {
          "missionId": "draft.dp09",
          "sectionId": "ex-anuncio"
        },
        {
          "missionId": "draft.dp09",
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
      "item": "Atualidades 9: moedas digitais; Drex não citado nominalmente",
      "status": "histórico; referenceOnly"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Conhecimentos Bancários 14: moeda digital brasileira",
      "status": "histórico; referenceOnly"
    }
  ],
  "objectives": {
    "O1": "Distinguir moeda digital de banco central, pagamento e ativo privado.",
    "O2": "Relacionar Drex à proposta de plataforma do real em formato digital.",
    "O3": "Separar emissão de atacado e representações intermediadas de varejo.",
    "O4": "Interpretar tokenização e condições de uma transação no caso.",
    "O5": "Separar proposta/teste, disponibilidade e garantia de resultado.",
    "O6": "Recuperar a confusão pela seção de ensino e refazer o caso."
  },
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Nomear a confusão e reconstruir o caso após retomar o ensino."
  },
  "limits": [
    "CAIXA tem moeda digital brasileira nominal; BB tem moedas digitais, sem Drex nominal.",
    "Estágio de Drex requer revalidação antes de publicação; FAQs consultadas mantêm datas de atualização antigas explicitadas.",
    "Não promete lançamento, arquitetura definitiva, conta direta no BC, retorno ou substituição de cédulas.",
    "Casos e números autorais fictícios; não representam operação, oferta ou dado pessoal real.",
    "Sem XP/ordem/desbloqueio ou importação no runtime; não equivale a aceite humano da Fase 2."
  ]
};

export const ARITHMETIC = [];
