# MISSÃO BANCÁRIA — CONTINUIDADE E CRITÉRIOS DE CONCLUSÃO

Data: 30/09/2026.  
Fase ativa: **Fase 2 — motor pedagógico reutilizável, sem aceite de encerramento registrado**.  
Referência de inventário: auditoria da `main` em `ff6ecbe`, conferida nos arquivos de conteúdo e contratos do motor nesta continuidade.

## 1. Alcance e decisões preservadas

A Fase 1 foi aceita em 29/09/2026. A implementação incremental e as correções da Fase 2 podem continuar sem pedir uma nova autorização a cada etapa. A existência de um encerramento candidato, de uma PR, de testes aprovados ou de um build não substitui integração, publicação verificada, uso humano e aceite explícito da fase. As Fases 3–9 permanecem planejadas; esta rubrica não as abre.

O acesso continua exclusivo à conta autenticada cujo `username` normalizado é `wellyton`, com bloqueio real no backend e proteção contra acesso direto por URL/API de outras contas. O módulo permanece isolado dos módulos de trabalho e dos dados assistenciais. Não ampliar o público nem usar dados de pacientes para testar.

Preservar ensino por leitura, exemplos resolvidos, prática justificada e progressão visual. Aplicar [24-CONTRATO-PEDAGOGICO-GLOBAL.md](24-CONTRATO-PEDAGOGICO-GLOBAL.md) e [26-PRODUCAO-PEDAGOGICA-EM-ETAPAS.md](26-PRODUCAO-PEDAGOGICA-EM-ETAPAS.md): subdividir a autoria quando necessário, sem publicar questões antes do ensino correspondente.

O desenvolvimento autorizado permite preparar código, documentação, testes e PRs em draft. Merge e publicação produtiva continuam sujeitos à decisão correspondente. Toda publicação do Worker deve seguir [WORKER-SAFE-DEPLOY.md](../WORKER-SAFE-DEPLOY.md), sem `wrangler deploy` direto nem relaxamento do gate.

## 2. Inventário verificável e seus limites

| Dimensão | Evidência no inventário | Limite da evidência |
| --- | --- | --- |
| Ensino publicado no catálogo | Oito aulas de SFN e um Chefe, com 38 questões pontuadas no total | É o bloco inicial; não completa Conhecimentos Bancários nem o curso |
| Avaliação independente de SFN | Formas A e B com 16 itens cada, total de 32; B fica elegível sete dias após concluir A | Após concluir A/B, não há nova forma disponível na versão atual; não constitui banco suficiente para avaliações indefinidas |
| Organização curricular | 12 áreas e 43 blocos planejados; apenas `banking.sfn-foundation` contém missões publicadas | Os outros 42 blocos não têm missões publicadas; blocos não equivalem a itens oficiais do edital |
| Perfis de referência | BB 2022/001 — Agente Comercial e CAIXA 2024/NM — TBN, ambos `referenceOnly: true` | Referências históricas de planejamento; não são declaração de edital vigente nem de escopo futuro já adotado |
| Prontidão de prova | `readiness.status = 'not_measured'`, rótulo “Ainda não medida” | XP, tempo, conclusão do bloco ou notas isoladas não autorizam estimativa de aprovação |

Fontes do inventário: [manifest.js](../../worker/studies-content/manifest.js), [curriculum-v1.js](../../worker/studies-content/curriculum-v1.js), [sfn-foundation-v1.js](../../worker/studies-assessment-content/sfn-foundation-v1.js) e [study-assessments.js](../../worker/study-assessments.js). “Publicado” nesta tabela é o estado do catálogo; confirmar separadamente quais versões de frontend e Worker estão efetivamente servidas.

Não reutilizar o antigo “cerca de 32%” como situação atual. `1/43` descreve a disponibilidade de blocos pedagógicos do mapa, sem informar percentual do edital ou do produto. Também não converter `9/9` do bloco em curso concluído. O mapa amplo atual ainda precisa do rastreamento de itens e subitens descrito abaixo.

## 3. Rubrica de conclusão — quatro evidências separadas

### A. Estabilidade técnica no commit exato

Uma entrega só pode ser declarada tecnicamente validada quando o registro identifica o SHA final testado, ambiente, comandos, resultados e limitações. Resultados de um ancestral não certificam mudanças posteriores. Antes de pedir validação humana, executar os testes aplicáveis sobre o commit final, incluindo os fluxos interrompidos e repetidos da interface.

| Grupo | Critério verificável |
| --- | --- |
| Autorização e isolamento | `wellyton` autorizado; outra conta e requisição sem autenticação bloqueadas; acesso manual à rota/API não contorna a regra; nenhuma dependência de dados institucionais |
| Retomada | Interromper e recarregar leitura, prática, revisão e avaliação independente; restaurar somente a sessão compatível e suas respostas confirmadas, sem nova recompensa ou perda de histórico |
| Rede e repetição | Falha de envio, reconexão, duplo clique, reenvio e confirmação repetida não duplicam tentativas, XP, conquistas ou conclusão; erro não exibe salvamento confirmado |
| Concorrência | Duas abas, resposta atrasada e fechamento concorrente preservam a autoridade do backend e não concluem rodada incompleta |
| Atualização | Frontend/Worker compatíveis e fallback de protocolos antigos; versões incompatíveis tratadas explicitamente; ausência de evidência de domínio permanece “Ainda não medido”, distinta de desempenho real igual a zero |
| Publicação incremental | Metadado inválido rejeitado; rascunho excluído; baseline sem selo de novidade; missão nova identificada; alteração editorial não exige revisão; atualização conceitual recomenda revisão sem apagar conclusão |
| Preservação | Comparar antes/depois IDs, progresso, cobertura, domínio e ausência de medida, XP, tentativas, conquistas, revisões, avaliações independentes e prontidão; o histórico original permanece válido |

Usar como referência a CI [validate-missao-bancaria.yml](../../.github/workflows/validate-missao-bancaria.yml): Node 24; `npm run check` e `npm test` em `worker`; verificações adicionais de sintaxe de frontend, rodadas, avaliações e conteúdo; verificações de isolamento e fontes; Chromium com `testing/browser/studies-reader.config.mjs`. Executar também os checks globais aplicáveis ao diff final, sem remover testes, reduzir baselines ou afrouxar gates para obter aprovação.

Os testes Chromium existentes exercitam HTML/CSS e fluxos de interface com API simulada. São evidência de regressão sintética, não homologação com API real nem prova de funcionamento em produção. Declarar separadamente testes locais, Actions, build de Pages, build de Worker, publicação observada e validação humana. Um Worker build falho requer logs e diagnóstico; por si só não comprova incidente produtivo.

### B. Cobertura de conteúdo do escopo adotado

Para afirmar que o conteúdo de um perfil está completo, primeiro registrar qual edital/versão foi adotado e verificar suas fontes. Enquanto essa escolha não ocorrer, conservar a natureza histórica dos perfis atuais. Manter matrizes separadas para BB e CAIXA, mesmo quando reutilizarem uma aula.

Cada linha da matriz deve rastrear:

`perfil + edital/versão + fonte + item/subitem → competência observável → aula/trecho → exemplo resolvido → prática → avaliação → revisão`

Registrar identificadores estáveis, data da conferência da fonte, estado de autoria/revisão/publicação e lacunas. Não marcar um subitem como coberto apenas porque existe um bloco de nome semelhante. Não somar pesos dos dois editais em uma porcentagem única.

Critério por competência: ensino acessível ao iniciante e pré-requisitos disponíveis; exemplo resolvido com raciocínio; questões compatíveis com o que foi ensinado e alternativas justificadas; revisão e indicação do trecho a recuperar. O material precisa passar por revisão de precisão e clareza. Testes de formato e vínculos são necessários, mas não atestam qualidade didática sozinhos.

A conclusão do conteúdo exige que todos os itens e subitens incluídos no escopo adotado tenham essa cadeia comprovada, com exceções explicitadas e aceitas. Aula escrita, aula publicada e assunto aprendido são estados diferentes.

### C. Prática de prova, recuperação de erros e redação

Seguir o planejamento de [09-FASE-8-SIMULADOS-REDACAO.md](09-FASE-8-SIMULADOS-REDACAO.md), sem declarar essa fase aberta ou implementada. O produto completo precisa permitir simulados representativos de cada perfil, distribuição e tempo coerentes com o edital adotado, resultado por disciplina/competência e plano de correção após a prova.

A recuperação deve distinguir repetição do mesmo item de dificuldade no conceito. O contador atual de erros recorrentes por questão não equivale a um diagnóstico conceitual ou a uma trilha de recuperação. A avaliação independente já agrega resultados por `competencyId` e recomenda aulas em `buildAssessmentResult`; preservar essa capacidade. A lacuna aqui é a organização conceitual do caderno de erros recorrentes e sua recuperação continuada. Uma futura trilha deve levar ao ensino pertinente, oferecer nova aplicação e medir a nova tentativa sem apagar o erro anterior.

As avaliações independentes precisam de formas suficientes e controle de exposição: registrar quais itens já foram vistos, evitar apresentar repetição como evidência inédita, definir quando uma nova forma fica disponível e tornar explícito o esgotamento do banco. A/B atuais são um primeiro recorte. Quantidade de formas, reaplicação e política de exposição exigem planejamento e decisão antes da expansão do protocolo.

Quando prevista no perfil, redação exige ensino, exemplos comentados, planejamento, produção, revisão orientada e histórico de versões. Seu resultado não pode ser substituído pela nota objetiva nem apresentado como avaliação oficial da banca.

### D. Diagnóstico do aluno separado da conclusão do produto

Relatar separadamente disponibilidade de conteúdo, progresso pessoal no conteúdo disponível, desempenho imediato, revisões observadas e avaliação independente. Domínio sem evidência deve permanecer ausente/não medido; uma nota real zero permanece zero.

Prontidão depende de cobertura suficiente do escopo adotado, retenção em intervalos reais, questões independentes, resultado por disciplina, simulados sob tempo e redação quando aplicável. Até existir critério aprovado e evidência adequada, manter “Ainda não medida”. Nem ferramenta estável nem curso completo garantem aprovação do aluno; o desempenho do aluno também não encerra a construção do produto.

## 4. Revisões atrasadas — limitação e decisão pendente

O motor atual cria os três vencimentos juntos, em `scheduleReviews`, para +1, +7 e +30 dias a partir da primeira conclusão da missão. `dueReviewRows` pode listar os três ciclos vencidos ao mesmo tempo depois de um atraso. Não há reagendamento dos próximos ciclos pela data real de conclusão do anterior. As rodadas de revisão usam as questões da própria aula.

Responder todos os itens permite concluir uma revisão mesmo com nota zero; a nota mínima de aprovação do Chefe não é uma regra geral das revisões. Por isso, três ciclos com resultados registrados — inclusive três notas zero — podem produzir `schedule_observed` e o estado interno `consolidated`. Trata-se de uma limitação semântica e de evidência de retenção já existente, não de regressão introduzida pela publicação incremental.

**Correção conservadora desta continuidade:** exibir “Ciclos concluídos” e explicar que concluir ciclos não comprova domínio nem prontidão. Preservar o ID `consolidated`, os cálculos, os prazos, os dados e as recompensas. Esse ajuste de linguagem não implanta revisão adaptativa.

### Alternativas para decisão de produto

| Alternativa | Comportamento diante do atraso | Consequência |
| --- | --- | --- |
| Manter o calendário atual com descrição explícita | +1/+7/+30 continuam ancorados na conclusão original; os ciclos podem ser realizados em sequência quando todos vencerem | Preserva integralmente a política atual; conclusão registra execução, sem demonstrar espaçamento real |
| Adotar intervalos contados da conclusão real | Primeiro ciclo após um dia; segundo somente sete dias após concluir o primeiro; terceiro somente trinta dias após concluir o segundo | Evita acumular três revisões elegíveis no mesmo retorno; muda a política para pelo menos 38 dias no percurso sem atraso |

A segunda alternativa é a proposta para uma próxima decisão, **não uma regra aprovada ou implementada**. Confirmar se os intervalos desejados são esses ou se devem preservar outro calendário nominal; não trocar silenciosamente +1/+7/+30 por uma nova interpretação. Definir também o tratamento dos ciclos pendentes existentes, dos ciclos já concluídos e de uma rodada aberta. Preservar o histórico; qualquer migração deve ser proposta e revisada antes da execução.

Adaptação por nota, limiar de retenção, revisão extra após erro e itens alternativos são decisões adicionais. Reagendar datas não resolve, sozinho, a repetição dos mesmos itens nem cria medida independente de aprendizagem. Não alterar esses critérios junto com uma simples correção de rótulo.

### Cobertura exigida para uma futura mudança de política

1. Relógio controlado: primeiro acesso aos ciclos depois de mais de trinta dias; registrar o comportamento atual e a diferença esperada na política escolhida.
2. Atraso no primeiro ou segundo ciclo: próximo vencimento calculado pela conclusão real aprovada; nenhuma liberação antecipada por datas antigas.
3. Três notas zero e notas mistas: histórico e resultados preservados; execução não se transforma em domínio ou prontidão.
4. Clique repetido, duas abas, resposta fora de ordem e recarga no fechamento: um evento de conclusão e um agendamento efetivo, sem XP duplicado.
5. Dados anteriores à política, ciclo sem nota, missão com atualização editorial/conceitual e rodada aberta: compatibilidade e migração conforme decisão, sem apagar evidências.
6. API real em ambiente autorizado e UI: horário de elegibilidade, mensagens, retomada e impossibilidade de iniciar ciclo ainda indisponível coerentes entre cliente e backend.

Esta lista é um contrato de testes futuros. Resultados efetivamente executados devem ser registrados na entrega correspondente; a lista não afirma que uma política nova foi testada.

## 5. Ordem prática de continuidade

1. Consultar o estado vivo de branches, PRs, checks e trabalhos concorrentes antes de alterar arquivos; preservar as correções C3 que distinguem domínio desconhecido/null de zero ao atualizar a cadeia C3/C4 e seu encerramento candidato.
2. Corrigir pendências reais da fase ativa, testar o commit final e registrar evidências/limites. Diagnosticar falhas de Worker com logs autorizados, sem inferir publicação ou incidente e sem contornar o gate.
3. Preparar integração e publicação para decisão com PRs draft, diffs e testes revisáveis. Depois de autorizadas, conferir separadamente frontend, Worker e compatibilidade; obter validação humana e aceite real da Fase 2, sem fabricá-los.
4. Enquanto o aceite estiver pendente, continuar correções e documentação independentes dentro do escopo aprovado. Planejar o rastreamento curricular, a política de revisão e a expansão de avaliações; escolhas substantivas permanecem propostas.
5. Após abertura formal das fases correspondentes, completar Conhecimentos Bancários e priorizar Português, Matemática/Matemática Financeira, Informática/TIC e Vendas/Atendimento conforme o perfil escolhido, seguidos dos demais conteúdos. Cada nova competência deve chegar ao aluno como unidade completa de ensino, prática e revisão.

## 6. Registro mínimo de cada entrega

Manter no STATUS e no registro específico: problema e decisão; fase/recorte; arquivos e IDs afetados; SHA final e PR; testes realmente executados e resultados; revisão pedagógica realizada ou pendente; conteúdo disponível; versão publicada comprovada ou “não verificada”; limitações e bloqueios; próximo passo concreto e decisão humana necessária, quando houver.

Relatar três linhas de estado separadas: **conteúdo**, **funcionalidade** e **validação**. Não produzir um percentual global de conclusão sem denominador definido e aprovado. Este documento estabelece critérios e continuidade; não certifica que esses critérios já foram cumpridos.
