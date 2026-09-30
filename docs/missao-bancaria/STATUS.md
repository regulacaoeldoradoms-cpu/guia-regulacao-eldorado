# MISSÃO BANCÁRIA — STATUS

Atualizado em 30/09/2026 — Fase 1 aceita; Fase 2 ativa, com cadeia C3/C4 conciliada em PRs draft e fechamento ainda candidato.

## Estado e autorização

**Fase ativa: Fase 2. Motor pedagógico reutilizável.** Wellyton aprovou explicitamente a Fase 1 e autorizou o avanço em 29/09/2026. Ensino por leitura antes da avaliação continua obrigatório em toda unidade. Aplicar os documentos 24 e 26: subdividir a produção sem omitir ensino e preservar integralmente o progresso já conquistado.

Fonte oficial: `regulacaoeldoradoms-cpu/guia-regulacao-eldorado`.

## Decisões preservadas

`/estudos/`, `/api/studies/*`, usuário `wellyton` autorizado no backend. Conteúdo no GitHub; progresso em `study_*` do D1 `AUTH_DB`. Nenhum novo cargo, informação assistencial, segredo ou telemetria pedagógica externa. IDs, textos, perguntas, gabaritos, XP e conquistas mantidos. Bronze/Prata/Ouro continuam segurança da conta. Rollback mantém dados.

## Entregas incorporadas

- #488 documentação; Fase 0 aprovada em 25/09/2026; plano `15-FASE-0-PLANO-TECNICO.md`.
- #490 motor: `22257bca768cfc440578e0b8e11da62f15abc08f`.
- #495 expansão/revisões: `97cc6ab382d624841da46d6d9a9ff7f26a1a18ca`.
- #498 bloco/Chefe: `20487883c948dffbeb4b6849baa3c39e9c577d9f`.
- #499 retomada/Conquistas: `c5ebf3a0bb93bf303851835446ec32ff5decb0cd`.
- #500 sequência: `ac9128c7e807be8eff0ee5bc1579f792aa249a3d`.
- #501 ensino: `f6ae4c598156656e2c630372d6e2122259ffb1c2`.
- #502 leitor: `517c42a7511c2c72d01c242690fd32257b237ec3`.
- #503 aplicação introdutória: `c6c6dbfdd1e069053767bbec70ce2ce03b592dc3`.
- #504 CMN/BCB: `7a302b6f98fbde9b3ff5bc1aeca01bb8dad63378`.
- #505 Copom/CVM: `6040f0372997ca60bbf11502a94bd68e0cbad919`.
- #506 Operadores/Seguros: `614991af8d01def824e85b1b71f06fbd22b01d4a`.
- #507 Pagamentos/revisão: `f19b1cbb583fee9f38c79cda6538972af825ee72`.
- **#508 rodadas explícitas: `f391a665cd7ede05ea9d1a880e96589d89a67704`, incorporada nesta retomada.**
- #509 tempo visível/checkpoints: `841da112d93f2cc2c098fea2460ac01743abbc40`.
- #510 mapa curricular/prontidão: `1f52115e075790d6b83a6f395a5b8b3b2f1cfaf6`.
- #511 pré-requisitos backend: `804456e90c03bfdd845ae60663d580a69af3993c`.
- #512 retenção separada do acerto imediato: `0d3f2a06a63a31a84ca50e32f525e720c120f694`.
- #527 retomada controlada de sessão: `81397c7f0ca5f629f767e3e48f0549cff23df7b3`.
- #528 sequência histórica sem truncamento: `e119cdafe41b38c027cf4a3f038ee5d659dc8abe`.
- #519 especificação/autoria/arquitetura da avaliação independente: `eaf516ce45fa8c7512a23b862918c04bc4b13a2c`.
- #537 backend da avaliação independente: `2c6abfde61454a067271ac533c73c1eb1ac21cd7`.
- #542 hardening de concorrência da avaliação: `4da25ff93692bb69e98d0056905b4eab5be0a91a`.
- #543 contrato `assessmentProtocol` no bootstrap: `02215cc76a2bf47a26ecc5e32125da87cc95b4ac`.
- #544 revisão editorial/factual V3 do banco independente: `2a3379882ba2f4b4a00de182d521ad91f19c88f9`.
- #541 interface da avaliação independente: `9e5bebac7713b8ad7540aa31c6878e50e6b7faac`, integrada na `main`; CI específico, auditoria global, validação pós-merge e GitHub Pages concluíram em `success`.

Oito aulas, preparação do Chefe, 27 atividades formativas e 38 questões pontuadas representam apenas o primeiro bloco de SFN, não o curso/edital inteiro. O ensino e seus exemplos precedem a prática.

## Integração da #508 confirmada

As 24 execuções de GitHub Actions do head `c62c1475fd97144fe73086e64738e874ea900cba` foram consultadas com sucesso antes do merge, inclusive auditoria geral e navegador da Central. Não houve relaxamento de teste, baseline ou gate.

Checks do merge: Workers Builds `108494329133` (versão informada `a9ab8920-932f-492b-b311-4e77f9deca20`), GitHub Pages `108494187535` e Pages de staging `108494153620` bem-sucedidos. O comentário final da #508 registra os detalhes. Preview e staging não comprovam, isoladamente, qual versão atende todo o tráfego produtivo. Não foi usada sessão pessoal de Wellyton.

O vínculo de rodadas já está na main. As tabelas aditivas `study_rounds` e `study_round_answers` são da #508, não da entrega de tempo abaixo.

## Nova entrega — tempo visível e checkpoints

Documento: `37-TEMPO-VISIVEL-E-SALVAMENTO-PARCIAL.md`.
Branch: `feat/missao-bancaria-tempo-visivel`, sobre o merge da #508.

Implementado:
- contagem somente em intervalos com a aula visível e sem pausa manual;
- pausa automática por visibilidade e botão Pausar/Retomar sem bloquear ensino ou questões;
- descarte conservador de lacunas de amostragem maiores que cinco segundos;
- salvamento cumulativo periódico (30 s), também tentado ao pausar, mudar visibilidade e reconectar;
- recibo confirmado pelo servidor antes de mostrar tempo salvo;
- checkpoint sem encerrar sessão/rodada, conceder XP ou enviar texto pessoal;
- maior total validado preservado contra duplicações e mensagens fora de ordem;
- fechamento não reduz tempo já gravado;
- dashboard soma segundos confirmados de sessões abertas e encerradas, sem duplicá-los;
- rótulo Tempo registrado, preservando o histórico misto de medições antigas e novas.

Sem migração ou nova tabela neste patch: usa `study_sessions.duration_seconds`. Não altera os arquivos de ensino, leitor, questões, gabaritos ou recompensas. O protocolo de tempo é anunciado na abertura para não enviar checkpoints a um servidor anterior que não os suporte.

## Testes e limitações

Localmente passaram **13 testes do contador, nove de SQL real e dez fluxos do roteador real**, com identidade/catálogo sintéticos. Os sete fluxos de rota anteriores foram mantidos. Sintaxe verificada. Nenhum dado produtivo foi utilizado.

CI preparado: nove cenários de navegador adicionais, mantendo os 55 anteriores, total previsto de 64. Usam relógio controlado, HTML/CSS reais e API simulada. **Resultado remoto, merge desta branch e publicação ainda precisam ser consultados e registrados.** Não foram executados navegador local ou teste físico em Android nesta rodada.

Fechamento abrupto do aplicativo ou falha de rede pode perder o trecho posterior ao último checkpoint confirmado. Não há fila offline durável, restauração automática da mesma sessão após recarga ou garantia de envio em pagehide. Lacunas longas descartadas podem subcontar tempo. Visibilidade não prova atenção; janelas simultaneamente visíveis ainda não são coordenadas entre aparelhos. Todos esses limites aparecem no documento 37; o aviso principal está na interface.

## Nova entrega empilhada — mapa curricular e prontidão

Documento: `38-MAPA-CURRICULAR-E-PRONTIDAO.md`.  
Branch: `feat/missao-bancaria-mapa-curricular`, inicialmente empilhada sobre a PR #509 para evitar conflito nos arquivos de dashboard enquanto o cronômetro é validado.

Problema tratado: as mesmas nove missões eram usadas como conteúdo publicado e planejamento total do bloco, permitindo uma leitura visual de 9/9 como se o curso estivesse completo. O dashboard passa a separar explicitamente:
- **bloco atual publicado**;
- **cobertura curricular do curso-base**;
- **prontidão de prova**.

Mapa V1:
- dois editais-base históricos versionados: BB 2022/001 — Agente Comercial e CAIXA 2024/NM — TBN;
- 12 áreas de formação;
- 43 blocos pedagógicos planejados;
- 1 área iniciada;
- 1 bloco atualmente com material publicado;
- 0 áreas integralmente cobertas.

Os 43 blocos são agrupamentos pedagógicos próprios, não contagem oficial de itens de edital. A distribuição oficial de questões/pontos dos dois editais-base é armazenada separadamente e validada por teste.

Concluir as nove missões atuais pode concluir somente o bloco `banking.sfn-foundation`; não conclui Conhecimentos Bancários nem o curso.

Os títulos de XP que podiam sugerir prontidão — “Competitivo”, “Pré-aprovação” e “Reta final” — são substituídos por nomes neutros de campanha. XP permanece motivação/participação e não probabilidade de aprovação.

O dashboard passa a mostrar **Prontidão de prova: Ainda não medida**, com explicação de que essa avaliação exige cobertura, retenção e simulados representativos. Nenhum percentual de prontidão é calculado a partir de XP, horas ou leitura.

Arquivos funcionais: `worker/studies-content/curriculum-v1.js`, bootstrap, dashboard e CSS exclusivo do mapa. Sem alteração de D1, aulas, questões, gabaritos, XP já conquistado, conquistas ou revisões.

Testes adicionados impedem regressão para “9/9 = curso completo”, validam os totais oficiais das provas-base, os 12 eixos/43 blocos e a permanência da prontidão como não medida neste estágio. O resultado remoto desta branch ainda deve ser consultado depois do push final; não presumir merge ou publicação.

## Nova correção empilhada — pré-requisitos no backend

Documento: `39-PREREQUISITOS-BACKEND.md`.  
Branch: `fix/missao-bancaria-prerequisitos-backend`, empilhada sobre o mapa curricular.

Problema: a interface bloqueava missões futuras, mas a API de abertura aceitava um `missionId` direto sem conferir a conclusão da missão anterior.

Implementado:
- primeira missão livre;
- conteúdo já concluído pode ser reaberto;
- missão futura ainda não concluída exige `coverage_state >= 3` da missão publicada imediatamente anterior;
- ausência do pré-requisito retorna HTTP 409 / `STUDY_PREREQUISITE_REQUIRED`;
- pedido bloqueado não cria sessão;
- fechamento da missão revalida o pré-requisito, inclusive contra sessão antiga criada antes do gate;
- revisões continuam usando sua autorização específica por `reviewId` e não são bloqueadas pela fila normal.

Sem alteração de schema, conteúdo, perguntas, gabaritos, XP ou histórico. Teste comportamental do roteador comprova bloqueio antes do pré-requisito e liberação depois da conclusão.

Limite: esta regra cobre a fila atual de nove missões. O mapa curricular de 43 blocos exigirá pré-requisitos explícitos por competência/trilha ao criar novas áreas paralelas; não transformar o curso inteiro numa fila linear por acidente.

## Nova entrega empilhada — evidência de retenção

Documento: `40-EVIDENCIA-RETENCAO.md`.  
Branch: `feat/missao-bancaria-evidencia-retencao`, empilhada sobre a correção de pré-requisitos.

O cartão da missão passa a separar:
- **Acerto nas tentativas** — desempenho acumulado;
- **Retenção** — revisões posteriores identificadas.

Estados descritivos: sem revisão posterior; revisão histórica sem nota isolável; evidência em coleta; ciclos previstos observados. Nenhum deles é chamado de domínio, prontidão ou aprovação.

A evidência usa `study_reviews` e scores de `study_rounds`, sem tabela nova. Revisões antigas sem score isolável são preservadas como históricas; nenhuma pontuação é inventada ou reconstruída por horário.

Mesmo três ciclos registrados não alteram **Prontidão de prova: Ainda não medida**. Prontidão continuará exigindo cobertura curricular, avaliação independente e simulados representativos.

Testes verificam histórico sem score, deduplicação por ciclo, pontuação realmente mais recente por `completed_at` mesmo com ciclos concluídos fora de ordem, ausência de herança de nota quando a revisão mais recente não tem score, ausência de linguagem de domínio e exibição separada no frontend.


## Integrações de 28/09/2026

- **#510 — mapa curricular e prontidão:** integrada na `main` em `1f52115e075790d6b83a6f395a5b8b3b2f1cfaf6`. A auditoria global terminou aprovada no rerun do run 105, sem relaxamento de baseline/tolerância.
- **#511 — pré-requisitos no backend:** integrada na `main` em `804456e90c03bfdd845ae60663d580a69af3993c`. O gate vale na abertura e no fechamento da missão, inclusive contra sessão legada.
- **#512 — evidência de retenção:** permanece em validação final. Head atual `49fcdb3caffd9160d0678781f336d143ffb00bca`; validações específicas já passaram e a auditoria global ainda precisa concluir antes do merge.
- **#519 — avaliação independente:** continua somente especificação, bloqueada para implementação de produção até a #512 estar integrada/estável.

Placar de referência da Fase 2: Fase 1 = 100% encerrada; motor técnico ~97%; Fase 2 ~55% com os requisitos centrais do motor implementados em cadeia de validação, incluindo publicação incremental; cobertura curricular publicada 1/43 blocos (~2,3%); projeto completo ~37%. Os percentuais são estimativas de engenharia/escopo, não medida de aprendizado nem prontidão para prova. Os percentuais são estimativas de engenharia/escopo, não medida de aprendizado nem prontidão para prova.

## Nova entrega empilhada — retomada controlada de sessão

Documento: `42-RETOMADA-CONTROLADA-DE-SESSAO.md`.  
Branch: `feat/missao-bancaria-retomada-sessao`, empilhada sobre a evidência de retenção.

O bootstrap passa a anunciar `resumeProtocol: 1` e pode devolver uma `resumableSession` quando existir uma rodada ativa compatível iniciada nas últimas 12 horas.

Ao retomar:
- a mesma sessão/rodada é reutilizada; nenhuma nova é criada;
- backend recusa nova rodada com `STUDY_SESSION_RESUME_REQUIRED` enquanto houver sessão retomável;
- os demais cartões ficam bloqueados até retomar/encerrar a sessão atual;
- IDs das respostas já gravadas naquela rodada são restaurados sem reenviar alternativas;
- o tempo parte do total já confirmado pelo servidor e checkpoints seguintes continuam cumulativos;
- revisão usa o `reviewId` validado pelo backend e não depende do limite visual de dez revisões;
- sessão encerrada ou antiga demais deixa de ser sugerida, sem ser apagada silenciosamente.

Sem schema novo, XP, conquista, cobertura ou prontidão alterados. Testes do roteador real cobrem retomada, encerramento e janela temporal; o cronômetro cobre retomada a partir do tempo salvo.

## Nova correção empilhada — sequência histórica sem truncamento

Documento: `43-SEQUENCIA-HISTORICA-SEM-TRUNCAMENTO.md`.  
Branch: `fix/missao-bancaria-sequencia-historica`, empilhada sobre a retomada controlada de sessão.

A sequência deixa de buscar os 500 eventos mais recentes e passa a agregar dias locais distintos no banco antes de enviá-los ao cálculo. Isso impede que grande volume de questões em poucos dias apague artificialmente séries antigas.

Preservado:
- mesmas fontes de atividade legítima;
- sessão só conta quando encerrada e com pelo menos 60 segundos;
- abertura do módulo não cria sequência;
- nenhum schema ou dado histórico é reescrito.

Teste adicional cobre 600 eventos distribuídos sobre 20 dias e impede regressão para `LIMIT 500`.

## Roteiro preparado — homologação humana da Fase 1

Documento: `46-ROTEIRO-HOMOLOGACAO-FASE1.md`.

Foi preparado um roteiro de aceite humano separado dos testes técnicos. Ele cobre acesso/isolamento, clareza do dashboard, ensino antes da prática, persistência/retomada, conclusão/conquista, revisão/retenção, sequência e uso em desktop/celular.

O roteiro não cria dados fictícios nem exige manipular datas produtivas. Cenários dependentes de tempo natural podem permanecer pendentes sem transformar CI verde em homologação automática.

## Especificação preparada — avaliação independente

Documento: `41-AVALIACAO-INDEPENDENTE.md`.  
Branch documental: `docs/missao-bancaria-avaliacao-independente`, baseada na cadeia até a evidência de retenção.

Objetivo: impedir que questões já vistas no ensino/revisão sejam usadas sozinhas como prova de domínio. A especificação separa um banco autoral de avaliação, inicialmente com **32 itens inéditos** do primeiro bloco de SFN, divididos em duas formas A/B de 16 itens sem sobreposição. A forma B só fica elegível sete dias após a forma A. Durante a rodada não há feedback de acerto por item; gabarito/explicação só aparecem no fechamento. Continua sem XP por participação e sem alterar prontidão automaticamente.

A implementação de produção **não começa antes da estabilização/integração da cadeia #510–#512**. O documento registra schema sugerido, isolamento, prevenção de vazamento, diagnóstico por competência e testes obrigatórios.

## Autoria preparada — banco independente A/B

Documento: `44-BANCO-AUTORAL-AVALIACAO-INDEPENDENTE-RASCUNHO.md`.

Foi preparado um rascunho editorial com **32 itens inéditos**, distribuídos em duas formas A/B de 16 questões sem sobreposição, com dois itens primários por cada uma das oito aulas em cada forma.

Cada item registra aula/trecho ensinado, fontes, resposta, explicação e motivo dos distratores. O arquivo permanece **fora do produto**: não é importado pelo Worker, não aparece no bootstrap e não altera XP, cobertura, retenção ou prontidão.

Antes de virar catálogo de produção ainda são obrigatórias revisão semântica contra treino/Chefe, conferência factual nas fontes, revisão de dificuldade/pistas e testes de isolamento.

## Arquitetura preparada — avaliação independente

Documento: `45-SCHEMA-E-API-AVALIACAO-INDEPENDENTE.md`.

Foi definida uma proposta aditiva com tabelas próprias `study_assessment_rounds` e `study_assessment_answers`, sem alterar o CHECK de `study_rounds.mode`.

A proposta fixa:
- elegibilidade A/B e intervalo de sete dias;
- conjunto de itens congelado;
- resposta idempotente sem revelar correção durante a rodada;
- fechamento idempotente;
- isolamento do banco de treino;
- versionamento/invalidação sem apagar histórico;
- diagnóstico por competência sem alterar prontidão automaticamente.

Continua sem código de produção: implementação só começa depois da integração/estabilidade da #512.

## Nova entrega empilhada — backend da avaliação independente

Documento: `47-AVALIACAO-INDEPENDENTE-BACKEND.md`.  
Branch: `feat/missao-bancaria-avaliacao-independente-backend`, empilhada sobre a sequência histórica.

Implementado em draft:
- catálogo independente com 32 itens autorais, 16 por forma A/B, sem sobreposição;
- serviço e schema próprios `study_assessment_*`, separados das rodadas de treino;
- elegibilidade após oito aulas + Chefe;
- Forma B somente após A + sete dias;
- início/resposta/fechamento idempotentes;
- nenhuma correção por item antes do fechamento;
- diagnóstico final por competência e aula;
- zero XP, zero alteração de cobertura e zero alteração automática de prontidão.

O bootstrap comum continua sem enviar o banco `eval.sfn.*`. A interface está em validação na #541. O banco recebeu revisão editorial/factual V3; a homologação humana de clareza/dificuldade continua pendente.

## Hardening adicional — avaliação independente sob concorrência

Branch: `fix/missao-bancaria-avaliacao-concorrencia`, sobre o backend já integrado.

O início e o fechamento da avaliação independente passam a ser determinísticos mesmo sob duas requisições simultâneas:
- início concorrente converge para uma única rodada ativa;
- fechamento concorrente retorna o mesmo resultado persistido;
- nenhum XP, cobertura, prontidão ou histórico de treino é alterado.

A suíte ganhou cenários explícitos de concorrência para início e fechamento.

## Nova entrega empilhada — interface da avaliação independente

Documento: `48-AVALIACAO-INDEPENDENTE-INTERFACE.md`.  
Branch: `feat/missao-bancaria-avaliacao-independente-ui`, sobre o backend independente já integrado.

Implementado em draft:
- painel de estado A/B no dashboard;
- modo próprio de avaliação, separado da aula;
- 16 itens por forma;
- resposta individual sem feedback de correção;
- retomada da mesma forma ativa;
- fechamento apenas após 16 respostas;
- correção e diagnóstico somente após encerrar;
- histórico resumido de formas concluídas;
- grade de missões e revisões bloqueada enquanto uma forma independente estiver ativa, com o botão principal priorizando a retomada da avaliação;
- com `assessmentProtocol: 1`, falha ao consultar o estado da avaliação é tratada de forma fail-closed: aulas permanecem temporariamente bloqueadas até o estado ser confirmado; bootstrap antigo sem o protocolo mantém o fluxo clássico compatível.

O fluxo usa nós DOM/`textContent` para os itens recebidos do backend. A UI não concede XP, não altera cobertura nem calcula prontidão.

A suíte Chromium ganhou cenários específicos para ausência de consulta durante a rodada, neutralidade do feedback, retomada e correção apenas no fechamento.

## Revisão editorial/factual da avaliação independente

Documento: `49-REVISAO-EDITORIAL-AVALIACAO-INDEPENDENTE.md`.

O catálogo independente passa a `ASSESSMENT_VERSION = 2` após revisão das alternativas com maior risco de pista por comprimento. IDs, competências, fontes e posições corretas foram preservados.

Guardrails adicionados:
- nenhuma semelhança lexical alta com os prompts do treino no teste atual;
- equilíbrio 4×A/4×B/4×C/4×D por forma mantido;
- diferença de comprimento entre alternativas limitada por teste de regressão;
- conferência dirigida de CMN, BCB, Copom, CVM, banco múltiplo, SUSEP/PREVIC, instituição de pagamento, SPI/SPB e consórcio.

Isso melhora a qualidade editorial, mas não é homologação humana nem certificação de prontidão.

## Fechamento técnico candidato da Fase 1

Documento: `50-FECHAMENTO-TECNICO-FASE1.md`.

A Fase 1 passa a ter um registro consolidado de prontidão **técnica candidata**, sem confundir isso com aceite humano.

O documento mapeia os 12 critérios originais da fase contra o estado atual, registra que backend/retomada/retenção/sequência/avaliação independente possuem cobertura automatizada e mantém explícito que:
- a interface independente #541 foi integrada e o frontend teve GitHub Pages pós-merge em `success`;
- o Worker produtivo foi confirmado separadamente: o merge #544 (`2a3379882ba2f4b4a00de182d521ad91f19c88f9`) teve Workers Builds `109558351269` em `success`; o merge documental #545 (`342a7033c17a227915b0197d2c7d34232a26671a`), já contendo o mesmo backend, voltou a ter Workers Builds `109653080446` em `success`. As falhas vistas em heads de PR eram previews e não devem ser confundidas com o deploy produtivo final;
- o roteiro humano do documento 46 continua obrigatório;
- a Fase 2 não deve começar antes do aceite explícito da Fase 1.

## Aceite da Fase 1 e abertura da Fase 2

Documento: `51-ACEITE-FASE1-ABERTURA-FASE2.md`.

Em 29/09/2026, após o fechamento técnico e a confirmação de publicação de frontend e Worker, Wellyton declarou: **“esta aprovado pode ir para a fase 2”**. A Fase 1 fica encerrada por aceite explícito. O registro é global e não inventa preenchimento item a item do roteiro H1–H14.

A aprovação da fase não significa curso completo, domínio certificado ou prontidão de prova. A cobertura curricular permanece em 1/43 blocos publicados.

## Fase 2 — Recorte A integrado

Documento: `52-FASE2-CATALOGO-PEDAGOGICO-DECLARATIVO.md`.  
PR #547 integrada na `main` em `419e10644173effb548a230c82bd62476a21aa2e`.

Resultado:
- o manifesto de produção deixou de encadear cinco funções `attach*` específicas de grupos de aulas;
- `application-registry.js` centraliza a composição por dados;
- as nove missões e 27 atividades mantiveram IDs e conteúdo;
- 22/22 workflows da PR ficaram verdes antes do merge;
- GitHub/Cloudflare Pages do merge foi publicado com sucesso;
- o Workers Builds associado ao merge #547 encerrou em falha, portanto o código do Recorte A está em `main`, mas esta entrega isolada não é registrada como nova versão de Worker produtiva.

## Fase 2 — Feedback pedagógico reutilizável

Recorte B — documento `53-FASE2-FEEDBACK-PEDAGOGICO.md`, PR #548 integrada em `126dbc1bac79d425f43df55d840f95c2f6ef5891`:
- nove questões de Introdução, CMN e Banco Central receberam justificativa específica por alternativa;
- o feedback continua somente pós-tentativa, sem gabarito ou catálogo de motivos no bootstrap;
- o frontend diferencia erro, resposta correta, justificativa e releitura orientada.

Recorte B2 — documento `54-FASE2-FEEDBACK-COPOM-CVM.md`, PR #549 integrada em `4a3dafd29f372b840d63baeab33fbae2dfa1e2b2`:
- seis questões de Copom e CVM foram adicionadas ao mesmo contrato;
- cobertura enriquecida passou de 9 para 15 questões;
- nenhuma nova rota, renderer ou regra específica por aula foi criada.

Recorte B3:
- Operadores + Seguros/Previdência;
- sete questões adicionais;
- catálogo enriquecido chega a 22 questões no mesmo contrato.

Recorte B4 em desenvolvimento:
- Pagamentos/Consórcios + Chefe do SFN;
- 16 questões finais do bloco;
- objetivo de chegar a 38/38 questões com justificativa específica por alternativa;
- referências cumulativas do Chefe passam a exibir “Revisar depois” para a aula de origem sem trocar de missão durante a rodada.

A regra de sequência não foi alterada por checkpoints: sessões encerradas/atividade pedagógica continuam sendo consideradas conforme o mecanismo existente. Rascunhos de autoavaliação permanecem temporários e não são enviados.

Histórico de incidentes: erro inicial “Rota não encontrada” motivou #492/#494; #493 sem merge; #491/#496/#497 substituídas. Não reintroduzir versões abandonadas ou alterar gates para esconder falhas. A Fase 1 está encerrada; a Fase 2 está ativa.


## Fase 2 — Recorte C1: estados pedagógicos

Documento: `57-FASE2-ESTADOS-PEDAGOGICOS.md`.  
Branch: `feat/missao-bancaria-fase2-estados-pedagogicos`, empilhada sobre o Recorte B4.

Objetivo:
- implementar os seis estados definidos na Fase 2: não iniciado, em leitura, leitura concluída, prática, revisão e consolidado;
- persistir “leitura concluída” somente na transição real da leitura para a prática;
- derivar os demais estados de progresso, sessão ativa e evidência de revisão já existentes;
- manter “Consolidado” como estado local de ciclo de revisão, com aviso explícito de que não mede prontidão de prova.

Contrato:
- `pedagogyProtocol: 1` no bootstrap;
- `pedagogicalStates` por tópico;
- endpoint idempotente `POST /api/studies/sessions/:id/reading-complete`;
- frontend novo só chama o endpoint quando o Worker anuncia o protocolo;
- Worker antigo permanece compatível;
- reabrir conteúdo já coberto não regride o estado;
- três ciclos previstos de revisão com resultado podem produzir “Consolidado”, sem alterar o campo de prontidão.

Próximo requisito após C1: erros recorrentes e domínio ponderado por recência.


## Fase 2 — Recorte C2: erros recorrentes

Documento: `58-FASE2-ERROS-RECORRENTES.md`.  
Branch: `feat/missao-bancaria-fase2-erros-recorrentes`, empilhada sobre o Recorte C1.

Critério ativo:
- a mesma questão precisa ter pelo menos **dois erros históricos**;
- a **tentativa mais recente precisa continuar errada**;
- uma resposta correta posterior desativa o alerta;
- as tentativas antigas permanecem preservadas;
- nenhum histórico é apagado ou reescrito.

Implementação:
- sem nova tabela ou migração;
- consulta derivada de `study_attempts`;
- `errorPatternProtocol: 1` no bootstrap;
- total ativo em `metrics.recurringErrors`;
- mapa por tópico em `recurringErrors`;
- dashboard exibe total somente quando o protocolo estiver disponível;
- cartão da missão exibe quantidade ativa por tópico;
- Worker antigo mantém compatibilidade porque o novo card fica oculto sem protocolo.

Semântica:
- “erro recorrente” é padrão de tentativa, não domínio;
- não altera cobertura, XP, retenção, prontidão, avaliação independente ou conquistas;
- a correção posterior remove apenas o alerta ativo, não o registro histórico.

Validação:
- dois erros consecutivos ativam o alerta;
- tentativa correta posterior o desativa;
- histórico permanece no banco;
- navegador mostra o total e o contador por missão;
- nenhuma rota de escrita nova é criada.

Próximo requisito após C2: domínio ponderado por recência, mantendo-o separado de cobertura e prontidão.


## Fase 2 — Recorte C3: domínio ponderado por recência

Documento: `59-FASE2-DOMINIO-RECENCIA.md`.  
Branch: `feat/missao-bancaria-fase2-dominio-recencia`, empilhada sobre o Recorte C2.

Objetivo:
- separar domínio recente de acerto histórico acumulado;
- dar mais peso às tentativas recentes;
- incorporar retenção posterior sem transformar ausência de revisão em domínio cheio;
- manter domínio completamente separado de cobertura, XP e prontidão de prova.

Fórmula V1:
- usa no máximo as 20 tentativas mais recentes do tópico;
- peso da tentativa mais recente = 1;
- cada tentativa anterior recebe peso multiplicado por 0,85;
- desempenho imediato ponderado = média de acerto com esses pesos;
- domínio final = 70% desempenho imediato ponderado + 30% retenção posterior mais recente;
- quando não existe revisão posterior com nota, os 30% de retenção permanecem sem evidência e contribuem com zero;
- portanto, sem revisão, o domínio provisório máximo é 70.

Estados descritivos:
- `not_observed` — sem tentativas;
- `provisional` — tentativas registradas, sem revisão posterior pontuada;
- `review_observed` — revisão posterior com nota;
- `retention_observed` — ciclos previstos de revisão observados.

Contrato:
- `domainProtocol: 1`;
- `recentDomain.overallScore`;
- `recentDomain.observedTopics`;
- `recentDomain.byTopic[topicId]`;
- dashboard e cartões exibem domínio somente quando o protocolo estiver presente;
- Worker antigo permanece compatível.

Semântica:
- domínio recente não é prontidão de prova;
- não altera cobertura;
- não concede XP;
- não muda tentativas, revisões, conquistas ou avaliação independente;
- o cálculo é derivado e pode evoluir por nova versão documentada sem reescrever histórico.

Validação:
- tentativa recente pesa mais que antiga;
- ausência de revisão mantém o estado provisório;
- revisão posterior entra com peso de 30%;
- três ciclos observados alteram o rótulo de evidência, não a fórmula;
- roteador real e navegador exibem o mesmo resultado.

Próximo requisito após C3: publicação incremental de novas missões com preservação integral do histórico e indicador de conteúdo novo.


## Fase 2 — Recorte C4: publicação incremental

Documento: `60-FASE2-PUBLICACAO-INCREMENTAL.md`.  
Branch: `feat/missao-bancaria-fase2-publicacao-incremental`, empilhada sobre o Recorte C3.

Objetivo:
- publicar nova missão por dados, sem função específica por aula;
- permitir missão em `draft` sem expô-la ao aluno;
- preservar conteúdo existente ao acrescentar uma nova release;
- sinalizar conteúdo novo ainda não iniciado;
- distinguir revisão editorial de mudança conceitual relevante.

Registro declarativo:
- `status`: `draft` ou `published`;
- `releaseId`;
- `releaseSequence`;
- `changeImpact`: `baseline`, `new`, `editorial` ou `conceptual`.

Compatibilidade:
- as nove missões atuais recebem automaticamente a release-base `sfn-foundation-r1`, sequência 1;
- `contentRelease: sfn-v1.2` é preservado para consumidores legados;
- o novo contrato usa `publicationProtocol: 1` e o objeto `publication`;
- nenhuma tabela ou migração é criada.

Indicadores:
- `newCount/newMissionIds` para missões publicadas depois da baseline e ainda não iniciadas;
- `revisionRecommendedCount/revisionRecommendedIds` somente para mudança conceitual em conteúdo já visto;
- mudança editorial simples não exige refazer missão.

Teste de aceite estrutural:
- três missões sintéticas de estruturas diferentes passam pelo mesmo registro;
- uma quarta missão de release posterior é adicionada sem alterar o motor;
- a quarta aparece como nova;
- o objeto de progresso das três anteriores permanece integralmente igual;
- missão em `draft` não entra no catálogo publicado.

Próximo passo depois do C4: consolidar a cadeia C1–C4 na `main`, confirmar publicação e executar a avaliação técnica/humana do critério de aceite da Fase 2 antes de encerrá-la.


### Hardening do Recorte C4

O registro de publicação foi reforçado para falhar fechado também em runtime: `publishedCatalog()` executa a validação dos metadados antes de compor o catálogo e interrompe a publicação quando houver `status`, `changeImpact`, `releaseId` ou `releaseSequence` explícitos inválidos. O teste do recorte exige essa falha; não há relaxamento de CI nem normalização silenciosa para `published`.


## Fechamento técnico candidato da Fase 2

Documentos:
- `61-FECHAMENTO-TECNICO-FASE2.md`;
- `62-ROTEIRO-HOMOLOGACAO-FASE2.md`.

A matriz de fechamento foi preparada sobre a cadeia até C4, mas **não encerra a Fase 2**. Antes do aceite ainda são obrigatórios:
- C3 e C4 integrados com gates verdes;
- frontend e Worker produtivos confirmados após merge contendo a cadeia completa;
- homologação humana do roteiro 62;
- aceite explícito de Wellyton.

A Fase 3 permanece fechada até esse aceite.

### C3 — correção de ausência de evidência

A interface de domínio recente foi endurecida para não converter `null` em `0` por coerção JavaScript. Quando não existe evidência, o resumo permanece `—` / **Ainda não medido**, e o cartão da missão não exibe `0%` artificial. Há teste Chromium específico para essa condição.

## Continuidade de 30/09 — cadeia conciliada e revisão semanticamente explícita

- PR #555: conciliação por merge em `6b940527`, preservando os quatro commits posteriores do C3, o teste de domínio nulo e o teste de publicação incremental.
- PR #556: atualização sobre essa cadeia em `9657ce8a`, preservando a matriz candidata e o roteiro humano. Nenhum desses merges foi feito na `main`.
- Correção adicional: “Consolidado” passa a **Ciclos concluídos**, com explicação de que resultados registrados não comprovam domínio nem prontidão. O ID `consolidated`, os prazos e os dados permanecem; isso substitui somente a nomenclatura histórica descrita no C1 acima.
- Última revisão sem nota deixa de mostrar `null%`; desempenho real zero permanece zero.
- A seleção Chromium passou a incluir o teste existente de retomada de sessão, antes fora do arquivo de configuração usado pela CI.
- O novo teste SQLite registra a limitação vigente: +1/+7/+30 podem vencer juntos e três notas zero encerram ciclos, sem reagendar datas. Repete conclusão para verificar XP idempotente e preserva histórico, conquistas, avaliações independentes e prontidão.

**Conteúdo:** oito aulas + Chefe, 38 questões pontuadas e 32 itens A/B de avaliação independente; um bloco publicado entre 43 planejados, sem converter essa contagem em percentual do edital/produto. Nenhum novo conteúdo foi publicado nesta continuidade.

**Funcionalidade:** correções conservadoras preparadas em branch isolada. Autorização continua exclusiva a `wellyton`; não houve migração, mudança adaptativa de revisão ou alteração dos módulos institucionais.

**Validação:** evidências e limitações em `64-VALIDACAO-CONTINUIDADE-FASE2.md`. O estado de merge, build, publicação e homologação permanece separado. A Fase 2 não recebeu aceite nesta continuidade.

Próximos passos e critérios objetivos: `63-CONTINUIDADE-E-CRITERIOS-DE-CONCLUSAO.md`. Integração/publicação de #554-557 autorizadas em 30/09, condicionadas aos checks concluídos e ao esclarecimento do build Worker, preservando `deploy:safe`. A API de logs respondeu 403; o usuário forneceu o log e as configurações pelo chat principal. A falha observada ocorre no comando de preview `versions upload`, na validação da identidade antes do upload; produção está configurada com `deploy:safe` e teve publicação distinta confirmada em `main` `59ba80ab`. Não há justificativa para renomear o Worker, migrar previews, compartilhar recursos ou alterar acesso por suposição.

A correção restrita ao teste da Central passou na CI de #557 `07a191e6` com 78 testes e quatro skips já existentes. Os checks desse SHA terminaram com 24 Actions aprovados, um falho, Pages aprovado e Worker externo falho. A falha restante da auditoria visual é raster em `/medico/` light desktop, na região do botão IA; estilos/layout e erros JavaScript passaram. O documento 64 registra métricas e limites. Não houve alteração de baseline, threshold ou comportamento clínico, nem merge/deploy desta cadeia. A publicação permanece retida pelo diagnóstico/gates; homologação/aceite da Fase 2, política futura de revisões e escopo curricular também continuam pendentes. Não abrir a Fase 3 automaticamente.

## Preparo curricular independente - 30/09

- Documento 65 e matriz JSON: 70 entradas históricas de Conhecimentos Bancários, com BB/CAIXA separados, fontes/versões, objetivos propostos, evidências reais e lacunas. A numeração impressa `278` e a duplicidade 39/46 da CAIXA foram preservadas explicitamente.
- Documento 66: especificação inicial de `banking.markets-policy` e `banking.products-credit`, com pré-requisitos, sequência, exemplos planejados, critérios de revisão e etapas A-F.
- Documento 67: delimitação proposta da etapa A de MP-01, com seis objetivos observáveis, vocabulário e três fontes oficiais legíveis. O confronto de 24 trechos e duas atividades existentes separa retomadas de lacunas em 11 necessidades; emissão/negociação e participação/dívida já têm ensino, enquanto comparação conjunta dos mercados, liquidez e leitura cambial precisam de desenvolvimento.
- Nenhum item foi declarado integralmente coberto apenas por referência ao SFN. Nenhuma aula, questão, forma independente ou regra de revisão foi adicionada ao runtime.
- Próxima ação: fechar as fontes das extensões propostas em MP-01 a partir do confronto de pré-requisitos, e preparar a etapa A de PC-01A e PC-01 antes da redação de questões. Escopo a adotar, revisão normativa, autoria, publicação e aceite continuam pendentes.

Este preparo está na PR draft #559, fora da autorização específica de integração/publicação de #554-557. Não muda os 43 blocos planejados, o único bloco publicado ou a prontidão do aluno. Não equivale à abertura formal da Fase 3.
