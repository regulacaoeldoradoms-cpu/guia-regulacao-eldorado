// Rascunho editorial isolado; não importar no runtime.
export const SOURCES = [
  {
    "id": "lei.is.pis",
    "label": "Planalto — LC 7/1970",
    "url": "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp07.htm",
    "locator": "Art. 1º; criação e finalidade histórica do PIS, sem transpor regras tributárias antigas",
    "version": "Texto oficial consultado em 03/10/2026; corte normativo declarado na aula",
    "checkedAt": "2026-10-03"
  },
  {
    "id": "lei.is.abono",
    "label": "Planalto — Lei 7.998/1990",
    "url": "https://www.planalto.gov.br/ccivil_03/leis/l7998.htm",
    "locator": "Arts. 9º, §§ 2º–4º, e 9º-A; ler com a Constituição, sem universalizar o antigo limite de renda",
    "version": "Texto oficial consultado em 03/10/2026; corte normativo declarado na aula",
    "checkedAt": "2026-10-03"
  },
  {
    "id": "cf.is.abono",
    "label": "Planalto — EC 135/2024",
    "url": "https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc135.htm",
    "locator": "Art. 1º, nova redação do art. 239, §§ 3º e 3º-A, da Constituição; transição do critério de renda",
    "version": "Texto oficial consultado em 03/10/2026; corte normativo declarado na aula",
    "checkedAt": "2026-10-03"
  },
  {
    "id": "mte.is.abono",
    "label": "MTE — Abono Salarial",
    "url": "https://www.gov.br/trabalho-e-emprego/pt-br/servicos/trabalhador/abono-salarial",
    "locator": "Quem pode utilizar o serviço, canais pagadores e distinção calendário 2026/ano-base 2024; sem copiar tabela/calendário",
    "version": "Texto oficial consultado em 03/10/2026; corte normativo declarado na aula",
    "checkedAt": "2026-10-03"
  }
];

export const IS01_DRAFT = {
  "id": "draft.is01",
  "topicId": "draft.is01",
  "editorialKey": "IS-01",
  "candidateBlockId": "banking.institution-specific",
  "title": "PIS: programa, cadastro e benefício",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Distinguir o Programa de Integração Social, informação cadastral e abono salarial, reconhecendo limites da referência histórica.",
  "sourceIds": [
    "lei.is.pis",
    "lei.is.abono",
    "cf.is.abono",
    "mte.is.abono"
  ],
  "sections": [
    {
      "id": "programa",
      "heading": "1. O nome por extenso e a finalidade",
      "body": "PIS significa Programa de Integração Social. A LC 7/1970 instituiu o programa para integrar o empregado à vida e ao desenvolvimento das empresas. Esse é o ponto de partida histórico do item do edital. Não significa que cada trabalhador seja sócio da empresa, nem que tenha direito automático a um pagamento anual. Uma finalidade legal e um benefício com condições são objetos distintos.",
      "type": "explanation",
      "sourceIds": [
        "lei.is.pis"
      ]
    },
    {
      "id": "camadas",
      "heading": "2. Programa, cadastro, contribuição e abono",
      "body": "A expressão PIS aparece em contextos diferentes. Programa é o nome institucional. Cadastro identifica uma pessoa nos registros usados pelo sistema. Contribuição se refere a uma obrigação de financiamento, sujeita a legislação própria. Abono salarial é um benefício anual disciplinado pela Lei 7.998 e pela Constituição. Saber um identificador cadastral não demonstra, sozinho, habilitação ao abono. Esta aula não ensina apuração tributária nem ressarcimento de quotas históricas.",
      "type": "explanation",
      "sourceIds": [
        "lei.is.pis",
        "lei.is.abono"
      ]
    },
    {
      "id": "ex-cadastro",
      "heading": "3. Exemplo resolvido: identificação não é concessão",
      "body": "No caso fictício, Joana possui registro cadastral, mas o enunciado não informa tempo de cadastro, atividade no ano-base ou renda. Podemos concluir que há uma identificação. Não podemos concluir que ela está habilitada ao abono, porque faltam informações sobre requisitos. O passo correto é separar o dado existente da conclusão ainda não demonstrada.",
      "type": "worked-example",
      "sourceIds": [
        "lei.is.abono"
      ]
    },
    {
      "id": "pagador",
      "heading": "4. Instituição pagadora e requisitos",
      "body": "Na explicação atual do MTE, a CAIXA paga o abono relacionado a empregadores contribuintes do PIS; o Banco do Brasil paga o relacionado ao Pasep. A instituição pagadora não transforma qualquer conta bancária em direito ao benefício. Também não se deduz o programa apenas pela profissão informalmente descrita: leia o vínculo e o enquadramento informados no caso.",
      "type": "explanation",
      "sourceIds": [
        "mte.is.abono"
      ]
    },
    {
      "id": "ex-pagador",
      "heading": "5. Exemplo resolvido: a conta não substitui o vínculo",
      "body": "O exercício informa que Marcos está habilitado ao abono e trabalhou para empregador contribuinte do PIS no ano-base. A instituição pagadora indicada é a CAIXA. Se o caso apenas dissesse que Marcos tem uma conta na CAIXA, faltaria a informação necessária para essa classificação. Não confundimos o banco de uso cotidiano com o enquadramento do benefício.",
      "type": "worked-example",
      "sourceIds": [
        "mte.is.abono"
      ]
    },
    {
      "id": "tempo",
      "heading": "6. A referência histórica não congela a regra",
      "body": "O perfil do currículo é CAIXA 2024/NM, usado como referência histórica. Para estudar a criação do programa, a LC 7/1970 é fonte pertinente. Para afirmar uma regra atual de abono, é necessário ler a legislação posterior e a Constituição. A EC 135/2024 alterou o critério constitucional de renda; por isso, uma frase antiga sobre dois salários mínimos não pode ser aplicada indefinidamente a todo exercício futuro. Não reproduzimos alíquotas tributárias antigas como se fossem atuais.",
      "type": "explanation",
      "sourceIds": [
        "lei.is.pis",
        "cf.is.abono"
      ]
    },
    {
      "id": "ex-tempo",
      "heading": "7. Exemplo resolvido: pergunta de origem ou regra atual?",
      "body": "Uma pergunta pede qual lei criou o PIS: o objeto é histórico, e a resposta é LC 7/1970. Outra pergunta pede se uma pessoa receberá abono em determinado calendário: o objeto é a habilitação naquele exercício, que exige os dados e regras pertinentes. As duas perguntas usam a sigla PIS, mas não se resolvem com a mesma informação.",
      "type": "worked-example",
      "sourceIds": [
        "lei.is.pis",
        "cf.is.abono"
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
      "id": "is01.q01",
      "prompt": "Qual é o significado de PIS neste recorte?",
      "options": [
        "Programa de Integração Social.",
        "Programa de Investimento em Seguros.",
        "Produto de Intermediação da Selic.",
        "Plano Individual de Saque do FGTS."
      ],
      "answer": 0,
      "explanation": "É o nome do programa instituído pela LC 7.",
      "optionRationales": [
        "É o nome do programa instituído pela LC 7.",
        "A sigla não designa seguro.",
        "Selic não define o programa.",
        "FGTS é objeto distinto."
      ],
      "recoverySectionIds": [
        "programa"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "is01.q02",
      "prompt": "Qual leitura respeita a finalidade da LC 7/1970?",
      "options": [
        "Todo empregado se torna acionista.",
        "Promove integração do empregado à vida e ao desenvolvimento das empresas.",
        "Concede empréstimo sem análise.",
        "Autoriza qualquer saque do FGTS."
      ],
      "answer": 1,
      "explanation": "Reconhece a finalidade sem inventar um direito societário.",
      "optionRationales": [
        "Integração não significa aquisição automática de ações.",
        "Reconhece a finalidade sem inventar um direito societário.",
        "Não é concessão irrestrita de crédito.",
        "Não é regra de saque do FGTS."
      ],
      "recoverySectionIds": [
        "programa"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "is01.q03",
      "prompt": "Joana tem registro cadastral. O caso nada informa sobre os requisitos de abono. Qual conclusão é segura?",
      "options": [
        "Ela receberá o valor máximo.",
        "Ela nunca poderá receber.",
        "O cadastro não basta para afirmar habilitação.",
        "Ela deve encerrar sua conta."
      ],
      "answer": 2,
      "explanation": "Separa identificação e verificação de requisitos.",
      "optionRationales": [
        "O valor máximo não decorre do cadastro.",
        "A ausência de dados não prova impedimento definitivo.",
        "Separa identificação e verificação de requisitos.",
        "Não existe orientação de encerramento no ensino."
      ],
      "recoverySectionIds": [
        "camadas",
        "ex-cadastro"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "is01.q04",
      "prompt": "Qual associação distingue objetos corretamente?",
      "options": [
        "Cadastro é o pagamento anual.",
        "Contribuição é um saldo pessoal livremente disponível.",
        "PIS é uma operação de câmbio.",
        "Abono é benefício sujeito a condições, distinto da identificação cadastral."
      ],
      "answer": 3,
      "explanation": "Preserva as camadas ensinadas.",
      "optionRationales": [
        "Registro e prestação são distintos.",
        "Obrigação de financiamento não é saldo livre do empregado.",
        "Não se trata de câmbio.",
        "Preserva as camadas ensinadas."
      ],
      "recoverySectionIds": [
        "camadas"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "is01.q05",
      "prompt": "O caso informa habilitação e vínculo com empregador contribuinte do PIS. Qual é a instituição pagadora indicada no recorte?",
      "options": [
        "CAIXA.",
        "CVM.",
        "Copom.",
        "Conselho Curador do FGTS."
      ],
      "answer": 0,
      "explanation": "É a instituição indicada para esse enquadramento.",
      "optionRationales": [
        "É a instituição indicada para esse enquadramento.",
        "CVM é supervisora do mercado de valores mobiliários.",
        "Copom não paga o abono.",
        "O Conselho do FGTS não substitui o pagador do abono."
      ],
      "recoverySectionIds": [
        "pagador",
        "ex-pagador"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "is01.q06",
      "prompt": "Marcos apenas possui uma conta na CAIXA. Isso comprova direito ao abono?",
      "options": [
        "Sim, qualquer conta basta.",
        "Não; faltam dados dos requisitos e do enquadramento.",
        "Sim, desde que a conta use aplicativo.",
        "Não; todos os correntistas estão excluídos."
      ],
      "answer": 1,
      "explanation": "Recusa a inferência sem inventar exclusão.",
      "optionRationales": [
        "Ter conta não é habilitação.",
        "Recusa a inferência sem inventar exclusão.",
        "O canal não substitui condições legais.",
        "A conta tampouco prova exclusão."
      ],
      "recoverySectionIds": [
        "ex-pagador"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "is01.q07",
      "prompt": "Uma questão pergunta qual norma instituiu o PIS. Qual fonte atende diretamente a esse objeto histórico?",
      "options": [
        "A tabela de tarifas de um aplicativo.",
        "Uma previsão de juros futura.",
        "A LC 7/1970.",
        "O extrato de uma pessoa não identificada."
      ],
      "answer": 2,
      "explanation": "É a norma de instituição do programa.",
      "optionRationales": [
        "Tarifas não identificam a lei criadora.",
        "Juros não respondem à origem legal.",
        "É a norma de instituição do programa.",
        "Um extrato não é a fonte normativa pedida."
      ],
      "recoverySectionIds": [
        "tempo",
        "ex-tempo"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "is01.q08",
      "prompt": "Um material antigo afirma um limite de renda para abono e pretende aplicá-lo automaticamente a todos os anos futuros. Qual revisão é necessária?",
      "options": [
        "Trocar apenas a fonte do aplicativo.",
        "Presumir que nenhum limite existe.",
        "Confundir contribuição com abono.",
        "Conferir a Constituição e as regras do exercício, sem universalizar o texto antigo."
      ],
      "answer": 3,
      "explanation": "Aplica a distinção temporal, inclusive a EC 135.",
      "optionRationales": [
        "A mudança de aplicativo não valida a norma.",
        "Não foi ensinada ausência de critério de renda.",
        "Os objetos devem permanecer separados.",
        "Aplica a distinção temporal, inclusive a EC 135."
      ],
      "recoverySectionIds": [
        "tempo",
        "ex-tempo"
      ],
      "objectiveIds": [
        "O4"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "is01-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "is01.q01": [
        {
          "missionId": "draft.is01",
          "sectionId": "programa"
        }
      ],
      "is01.q02": [
        {
          "missionId": "draft.is01",
          "sectionId": "programa"
        }
      ],
      "is01.q03": [
        {
          "missionId": "draft.is01",
          "sectionId": "camadas"
        },
        {
          "missionId": "draft.is01",
          "sectionId": "ex-cadastro"
        }
      ],
      "is01.q04": [
        {
          "missionId": "draft.is01",
          "sectionId": "camadas"
        }
      ],
      "is01.q05": [
        {
          "missionId": "draft.is01",
          "sectionId": "pagador"
        },
        {
          "missionId": "draft.is01",
          "sectionId": "ex-pagador"
        }
      ],
      "is01.q06": [
        {
          "missionId": "draft.is01",
          "sectionId": "ex-pagador"
        }
      ],
      "is01.q07": [
        {
          "missionId": "draft.is01",
          "sectionId": "tempo"
        },
        {
          "missionId": "draft.is01",
          "sectionId": "ex-tempo"
        }
      ],
      "is01.q08": [
        {
          "missionId": "draft.is01",
          "sectionId": "tempo"
        },
        {
          "missionId": "draft.is01",
          "sectionId": "ex-tempo"
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
      "item": "Conhecimentos Bancários 31; apoio de distinção aos itens 39/46; Anexo IV pp.33–34",
      "status": "histórico; referenceOnly"
    }
  ],
  "objectives": {
    "O1": "Distinguir o Programa de Integração Social, informação cadastral e abono salarial, reconhecendo limites da referência histórica.",
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
    "Não cobre contribuição tributária, quotas, regras completas de cadastro ou habilitação do abono."
  ]
};

export const ARITHMETIC = [];
