export const SOURCES = [
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
  }
];

export const DP08_DRAFT = {
  "id": "draft.dp08",
  "topicId": "banking.digital-payments",
  "candidateBlockId": "banking.digital-payments",
  "editorialKey": "DP-08",
  "title": "Blockchain, criptoativos e moeda eletrônica",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Separar tecnologia de registro, ativo e moeda.",
  "sourceIds": [
    "nist.dp.blockchain",
    "lei.dp.ativos"
  ],
  "sections": [
    {
      "id": "registro",
      "type": "explanation",
      "heading": "1. Comece pelo livro de registros",
      "body": "Blockchain organiza registros em blocos ligados criptograficamente, mantidos de forma distribuída. Participantes seguem regras para aceitar novos registros: consenso. A estrutura ajuda a evidenciar e dificultar alterações indevidas. Não significa que qualquer informação sobre o mundo real se torna verdadeira ao ser registrada.",
      "sourceIds": [
        "nist.dp.blockchain"
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
        "nist.dp.blockchain"
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
        "lei.dp.ativos",
        "nist.dp.blockchain"
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
  "questions": [
    {
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
      ],
      "recoverySectionIds": [
        "registro"
      ],
      "objectiveIds": [
        "O1",
        "O2"
      ],
      "id": "dp08.q01"
    },
    {
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
      ],
      "recoverySectionIds": [
        "ex-registro"
      ],
      "objectiveIds": [
        "O2",
        "O5"
      ],
      "id": "dp08.q02"
    },
    {
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
      ],
      "recoverySectionIds": [
        "redes",
        "ex-rede"
      ],
      "objectiveIds": [
        "O3"
      ],
      "id": "dp08.q03"
    },
    {
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
      ],
      "recoverySectionIds": [
        "ativos",
        "ex-saldo"
      ],
      "objectiveIds": [
        "O4"
      ],
      "id": "dp08.q04"
    },
    {
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
      ],
      "recoverySectionIds": [
        "risco",
        "ex-retorno"
      ],
      "objectiveIds": [
        "O5"
      ],
      "id": "dp08.q05"
    },
    {
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
      ],
      "recoverySectionIds": [
        "registro",
        "redes"
      ],
      "objectiveIds": [
        "O2",
        "O3"
      ],
      "id": "dp08.q06"
    },
    {
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
      ],
      "recoverySectionIds": [
        "ativos"
      ],
      "objectiveIds": [
        "O1",
        "O4"
      ],
      "id": "dp08.q07"
    },
    {
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
      ],
      "recoverySectionIds": [
        "risco",
        "ex-retorno",
        "resumo"
      ],
      "objectiveIds": [
        "O6"
      ],
      "id": "dp08.q08"
    }
  ],
  "recall": [
    "Pergunte separadamente como se registra e que direito se representa.",
    "Não deduza valor futuro, legalidade completa ou fato externo apenas pela tecnologia."
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "dp08-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "dp08.q01": [
        {
          "missionId": "draft.dp08",
          "sectionId": "registro"
        }
      ],
      "dp08.q02": [
        {
          "missionId": "draft.dp08",
          "sectionId": "ex-registro"
        }
      ],
      "dp08.q03": [
        {
          "missionId": "draft.dp08",
          "sectionId": "redes"
        },
        {
          "missionId": "draft.dp08",
          "sectionId": "ex-rede"
        }
      ],
      "dp08.q04": [
        {
          "missionId": "draft.dp08",
          "sectionId": "ativos"
        },
        {
          "missionId": "draft.dp08",
          "sectionId": "ex-saldo"
        }
      ],
      "dp08.q05": [
        {
          "missionId": "draft.dp08",
          "sectionId": "risco"
        },
        {
          "missionId": "draft.dp08",
          "sectionId": "ex-retorno"
        }
      ],
      "dp08.q06": [
        {
          "missionId": "draft.dp08",
          "sectionId": "registro"
        },
        {
          "missionId": "draft.dp08",
          "sectionId": "redes"
        }
      ],
      "dp08.q07": [
        {
          "missionId": "draft.dp08",
          "sectionId": "ativos"
        }
      ],
      "dp08.q08": [
        {
          "missionId": "draft.dp08",
          "sectionId": "risco"
        },
        {
          "missionId": "draft.dp08",
          "sectionId": "ex-retorno"
        },
        {
          "missionId": "draft.dp08",
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
      "item": "Atualidades 9",
      "status": "histórico; referenceOnly"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Conhecimentos Bancários 10",
      "status": "histórico; referenceOnly"
    }
  ],
  "objectives": {
    "O1": "Separar tecnologia de registro, ativo e moeda.",
    "O2": "Explicar registro distribuído e validação por regras.",
    "O3": "Distinguir redes abertas e permissionadas.",
    "O4": "Reconhecer exclusões da definição legal de ativo virtual.",
    "O5": "Evitar atribuir verdade externa ou retorno garantido à tecnologia.",
    "O6": "Recuperar a confusão pela seção de ensino e refazer o caso."
  },
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Nomear a confusão e reconstruir o caso após retomar o ensino."
  },
  "limits": [
    "Sem algoritmos, mineração, recomendações financeiras ou regime de autorização das prestadoras.",
    "NIST 2018 usado para fundamentos, sem afirmar desenho técnico de projeto atual.",
    "Casos e números autorais fictícios; não representam operação, oferta ou dado pessoal real.",
    "Sem XP/ordem/desbloqueio ou importação no runtime; não equivale a aceite humano da Fase 2."
  ]
};

export const ARITHMETIC = [];
