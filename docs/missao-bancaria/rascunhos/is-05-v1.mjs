// Rascunho editorial isolado; não importar no runtime.
export const SOURCES = [
  {
    "id": "lei.is.crf",
    "label": "Planalto — Lei 8.036/1990",
    "url": "https://www.planalto.gov.br/ccivil_03/leis/l8036consol.htm",
    "locator": "Arts. 17, II, 26-A e 27; objeto do certificado, guias e obrigação, sem prazo de validade universal",
    "version": "Texto oficial consultado em 03/10/2026; corte normativo declarado na aula",
    "checkedAt": "2026-10-03"
  }
];

export const IS05_DRAFT = {
  "id": "draft.is05",
  "topicId": "draft.is05",
  "editorialKey": "IS-05",
  "candidateBlockId": "banking.institution-specific",
  "title": "Regularidade do FGTS: certificado e limites da evidência",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Separar Certificado de Regularidade do FGTS, guia e extrato, interpretando identidade, data e alcance de uma evidência.",
  "sourceIds": [
    "lei.is.crf"
  ],
  "sections": [
    {
      "id": "documentos",
      "heading": "1. Três documentos, três perguntas",
      "body": "CRF significa Certificado de Regularidade do FGTS. Seu objeto é a regularidade relativa ao FGTS do empregador, não o saldo particular de um trabalhador. Uma guia indica valores para recolhimento; um extrato registra informações de conta vinculada. Identificar a finalidade evita usar um documento para responder a outra pergunta. A lei prevê serviços digitais de emissão do CRF e geração de guias como funções distintas.",
      "type": "explanation",
      "sourceIds": [
        "lei.is.crf"
      ]
    },
    {
      "id": "ex-objetos",
      "heading": "2. Exemplo resolvido: selecionar a evidência pertinente",
      "body": "Uma atividade pede evidência de regularidade do empregador perante o FGTS. O objeto pertinente é o CRF, observado seu alcance e validade no caso. O saldo de uma conta de trabalhador não responde à mesma pergunta. Se a atividade pedisse registro de movimentos de uma conta, um extrato seria o objeto pertinente.",
      "type": "worked-example",
      "sourceIds": [
        "lei.is.crf"
      ]
    },
    {
      "id": "alcance",
      "heading": "3. Regularidade específica não é autorização universal",
      "body": "Um CRF não substitui certidões de outras obrigações, análise de crédito, habilitação completa em uma licitação ou aprovação de um benefício. A Lei 8.036 prevê situações em que sua apresentação é obrigatória, como habilitação/licitação nos termos do art. 27. Ser documento necessário em um contexto não significa ser o único requisito desse contexto. Esta unidade não dá orientação para uma licitação real.",
      "type": "explanation",
      "sourceIds": [
        "lei.is.crf"
      ]
    },
    {
      "id": "ex-necessario",
      "heading": "4. Exemplo resolvido: necessário não significa suficiente",
      "body": "O caso didático pressupõe procedimento que exige CRF e outros documentos. A empresa apresentou CRF válido, mas não forneceu os demais documentos. Está atendida a exigência do certificado no caso; não podemos declarar toda a habilitação completa. É o mesmo raciocínio de requisitos cumulativos usado no abono, aplicado agora a outro objeto.",
      "type": "worked-example",
      "sourceIds": [
        "lei.is.crf"
      ]
    },
    {
      "id": "identidade",
      "heading": "5. Identidade, período e autenticidade",
      "body": "Para interpretar um certificado, observe a identificação do empregador, a data, a validade nele informada e a confirmação de autenticidade pelo meio oficial pertinente. Uma imagem isolada, um certificado de outro empregador ou uma data de validade ultrapassada não sustentam automaticamente a conclusão solicitada. Não reproduzimos procedimento operacional de consulta nem fixamos prazo universal de validade sem fonte específica.",
      "type": "explanation",
      "sourceIds": [
        "lei.is.crf"
      ]
    },
    {
      "id": "ex-identidade",
      "heading": "6. Exemplo resolvido: documento de outra entidade",
      "body": "A tarefa pergunta pela empresa Aurora, mas o documento fictício está identificado como empresa Boreal. O conteúdo de Boreal não comprova regularidade de Aurora. Em outro caso, a validade expressamente informada termina em 10 de outubro e a consulta é em 15 de outubro do mesmo ano: esse documento não fornece evidência válida para a data posterior apenas por ter sido válido antes.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "guia",
      "heading": "7. Emitir uma guia não comprova recolhimento",
      "body": "O art. 26-A relaciona valores de FGTS e período laboral nas guias. Gerar esse instrumento é distinto de recolher. Um pagamento individual também não equivale, por si só, a certificado de regularidade global. Não inventamos que o simples envio de um arquivo elimina outras obrigações ou pendências.",
      "type": "explanation",
      "sourceIds": [
        "lei.is.crf"
      ]
    },
    {
      "id": "ex-guia",
      "heading": "8. Exemplo resolvido: valor, pagamento e certificado",
      "body": "O enunciado informa guia emitida para R$ 160, mas sem registro de pagamento. Há instrumento de recolhimento e valor, não prova de quitação. Se outro caso acrescentar recolhimento confirmado dessa guia, ele prova esse pagamento descrito; ainda não demonstra todas as condições de regularidade do empregador. Não saltamos de um evento particular para uma conclusão global.",
      "type": "worked-example",
      "sourceIds": [
        "lei.is.crf"
      ]
    },
    {
      "id": "glossario",
      "heading": "Glossário",
      "body": "**Programa:** estrutura de objetivos e regras. **Benefício:** prestação prevista para quem satisfaz condições. **Ano-base:** período usado para verificar dados. **Operador/pagador:** entidade que executa funções atribuídas; não elimina requisitos legais. **Hipótese didática:** dado fixado para resolver um exercício, sem prometer resultado de um pedido real.",
      "type": "glossary",
      "sourceIds": []
    },
    {
      "id": "resumo",
      "heading": "Resumo e recuperação",
      "body": "Identifique primeiro o objeto e o período. Depois separe pessoa interessada, requisitos e função da instituição. Se errar uma distinção, releia o trecho indicado, refaça o exemplo em palavras próprias e explique por que a alternativa escolhida excedeu os dados. Conclusão da prática não prova retenção nem autoriza uma operação real.",
      "type": "summary",
      "sourceIds": []
    }
  ],
  "recall": [
    "Qual é o objeto tratado e qual período foi informado?",
    "Que conclusão depende de requisito adicional?",
    "Como você resolveria novamente o exemplo sem olhar o gabarito?"
  ],
  "questions": [
    {
      "id": "is05.q01",
      "prompt": "Qual documento se relaciona diretamente com a regularidade do empregador perante o FGTS?",
      "options": [
        "CRF.",
        "Extrato pessoal de qualquer trabalhador.",
        "Tabela de tarifas de cartão.",
        "Uma simulação de juros sem identificação."
      ],
      "answer": 0,
      "explanation": "É o certificado do objeto pedido.",
      "optionRationales": [
        "É o certificado do objeto pedido.",
        "Saldo pessoal não equivale à regularidade do empregador.",
        "Tarifas não são o certificado.",
        "A simulação não responde à regularidade."
      ],
      "recoverySectionIds": [
        "documentos",
        "ex-objetos"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "is05.q02",
      "prompt": "O exercício pede movimentos de uma conta vinculada. Qual objeto atende melhor a essa pergunta?",
      "options": [
        "Qualquer CRF como substituto universal.",
        "Extrato da conta pertinente.",
        "Um certificado de outra obrigação fiscal.",
        "Um calendário de abono sem relação com a conta."
      ],
      "answer": 1,
      "explanation": "É o registro da conta referido no ensino.",
      "optionRationales": [
        "CRF responde a outra finalidade.",
        "É o registro da conta referido no ensino.",
        "O objeto é distinto.",
        "Abono e conta vinculada não se confundem."
      ],
      "recoverySectionIds": [
        "documentos",
        "ex-objetos"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "is05.q03",
      "prompt": "Um procedimento exige CRF e outros documentos. Só o CRF foi apresentado. Qual conclusão é adequada?",
      "options": [
        "Toda a habilitação está completa.",
        "Nenhum requisito foi atendido.",
        "A exigência do CRF pode estar atendida, mas isso não demonstra todas as demais.",
        "O certificado elimina automaticamente as demais exigências."
      ],
      "answer": 2,
      "explanation": "Reconhece a evidência sem extrapolar.",
      "optionRationales": [
        "Necessário não significa suficiente.",
        "Ignora o documento efetivamente apresentado.",
        "Reconhece a evidência sem extrapolar.",
        "Não há dispensa ensinada."
      ],
      "recoverySectionIds": [
        "alcance",
        "ex-necessario"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "is05.q04",
      "prompt": "O documento fictício identifica Boreal, mas a pergunta é sobre Aurora. O que fazer?",
      "options": [
        "Transferir automaticamente a regularidade entre as empresas.",
        "Ignorar a identidade porque ambos são empregadores.",
        "Usar apenas a cor do documento.",
        "Reconhecer que ele não comprova a situação de Aurora."
      ],
      "answer": 3,
      "explanation": "Respeita a identificação do caso.",
      "optionRationales": [
        "Não há transferência de evidência entre entidades.",
        "A identidade importa.",
        "Aparência não resolve o objeto.",
        "Respeita a identificação do caso."
      ],
      "recoverySectionIds": [
        "identidade",
        "ex-identidade"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "is05.q05",
      "prompt": "A validade indicada terminou em 10 de outubro; a data do caso é 15 de outubro. Qual inferência preserva esse dado?",
      "options": [
        "A validade anterior não basta como evidência válida para a data posterior.",
        "A validade nunca importa.",
        "O documento se renova sozinho por estar em uma imagem.",
        "A data é substituída pelo saldo de um empregado."
      ],
      "answer": 0,
      "explanation": "Compara os períodos sem inventar renovação.",
      "optionRationales": [
        "Compara os períodos sem inventar renovação.",
        "Ignora uma condição expressa.",
        "A imagem não demonstra renovação.",
        "Saldo não muda a validade informada."
      ],
      "recoverySectionIds": [
        "identidade",
        "ex-identidade"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "is05.q06",
      "prompt": "Uma guia de R$ 160 foi emitida e o caso não informa pagamento. O que ela comprova no recorte?",
      "options": [
        "Quitação automática.",
        "Emissão e valor do instrumento, sem prova de recolhimento.",
        "Regularidade de todas as obrigações da empresa.",
        "Direito imediato a saque do trabalhador."
      ],
      "answer": 1,
      "explanation": "Distingue as etapas explicitadas.",
      "optionRationales": [
        "Emitir não é recolher.",
        "Distingue as etapas explicitadas.",
        "Extrapola o evento particular.",
        "A guia não substitui hipótese de saque."
      ],
      "recoverySectionIds": [
        "guia",
        "ex-guia"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "is05.q07",
      "prompt": "O caso agora confirma pagamento de uma guia específica. Isso, sozinho, prova regularidade global do empregador?",
      "options": [
        "Sim, qualquer pagamento basta.",
        "Sim, pois não há outras obrigações.",
        "Não; comprova o pagamento descrito, sem demonstrar todas as condições globais.",
        "Não; pagamento jamais tem relevância."
      ],
      "answer": 2,
      "explanation": "Reconhece a prova no alcance correto.",
      "optionRationales": [
        "Generaliza a evidência específica.",
        "Não foi demonstrada ausência de outras obrigações.",
        "Reconhece a prova no alcance correto.",
        "Recusar extrapolação não significa ignorar o pagamento."
      ],
      "recoverySectionIds": [
        "guia",
        "ex-guia"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "is05.q08",
      "prompt": "Um aluno conclui que CRF significa aprovação automática de crédito. Qual trecho corrige diretamente essa confusão?",
      "options": [
        "A grafia do nome de uma empresa.",
        "A soma do saldo de todos os empregados.",
        "A troca do aplicativo.",
        "O alcance do certificado e a diferença entre requisito específico e decisão completa."
      ],
      "answer": 3,
      "explanation": "Retoma a distinção efetivamente ensinada.",
      "optionRationales": [
        "Não resolve a troca de objetos.",
        "Saldo não autoriza crédito.",
        "Canal não muda o alcance do documento.",
        "Retoma a distinção efetivamente ensinada."
      ],
      "recoverySectionIds": [
        "alcance",
        "ex-necessario"
      ],
      "objectiveIds": [
        "O4"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "is05-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "is05.q01": [
        {
          "missionId": "draft.is05",
          "sectionId": "documentos"
        },
        {
          "missionId": "draft.is05",
          "sectionId": "ex-objetos"
        }
      ],
      "is05.q02": [
        {
          "missionId": "draft.is05",
          "sectionId": "documentos"
        },
        {
          "missionId": "draft.is05",
          "sectionId": "ex-objetos"
        }
      ],
      "is05.q03": [
        {
          "missionId": "draft.is05",
          "sectionId": "alcance"
        },
        {
          "missionId": "draft.is05",
          "sectionId": "ex-necessario"
        }
      ],
      "is05.q04": [
        {
          "missionId": "draft.is05",
          "sectionId": "identidade"
        },
        {
          "missionId": "draft.is05",
          "sectionId": "ex-identidade"
        }
      ],
      "is05.q05": [
        {
          "missionId": "draft.is05",
          "sectionId": "identidade"
        },
        {
          "missionId": "draft.is05",
          "sectionId": "ex-identidade"
        }
      ],
      "is05.q06": [
        {
          "missionId": "draft.is05",
          "sectionId": "guia"
        },
        {
          "missionId": "draft.is05",
          "sectionId": "ex-guia"
        }
      ],
      "is05.q07": [
        {
          "missionId": "draft.is05",
          "sectionId": "guia"
        },
        {
          "missionId": "draft.is05",
          "sectionId": "ex-guia"
        }
      ],
      "is05.q08": [
        {
          "missionId": "draft.is05",
          "sectionId": "alcance"
        },
        {
          "missionId": "draft.is05",
          "sectionId": "ex-necessario"
        }
      ]
    }
  }
};

export const EDITORIAL = {
  "stage": "Rascunho fora do catálogo; revisão pedagógica independente pendente",
  "referenceOnlyProfiles": [
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Conhecimentos Bancários 33; Anexo IV pp.33–34",
      "status": "histórico; referenceOnly"
    }
  ],
  "objectives": {
    "O1": "Separar Certificado de Regularidade do FGTS, guia e extrato, interpretando identidade, data e alcance de uma evidência.",
    "O2": "Separar papéis, períodos e condições sem presumir direitos.",
    "O3": "Aplicar as hipóteses e os cálculos explicitamente ensinados.",
    "O4": "Reconhecer o erro e recuperar o trecho de ensino."
  },
  "recovery": {
    "objectiveId": "O4",
    "instruction": "Identificar a confusão, reler a seção indicada e reconstruir o exemplo."
  },
  "limits": [
    "Recorte exclusivo do perfil histórico CAIXA; não atribuído nominalmente ao BB.",
    "Fonte de escopo: matriz 65 do PR #559 em 400d4854, reaproveitada sem integrar o PR ou adotar edital vigente.",
    "Corte de consulta normativa: 03/10/2026; normas atuais distintas do edital histórico.",
    "Casos fictícios; não constitui atendimento, concessão de benefício, prática real ou avaliação independente.",
    "Sem XP, ordem, ativação, D1, alteração de permissões ou aceite humano de fase.",
    "Não ensina prazos universais de validade, emissão prática, licitação completa ou decisão de crédito.",
    "Páginas operacionais de CRF não ficaram legíveis nesta consulta; a aula se limita ao recorte legal e aos dados explícitos dos exemplos."
  ]
};

export const ARITHMETIC = [];
