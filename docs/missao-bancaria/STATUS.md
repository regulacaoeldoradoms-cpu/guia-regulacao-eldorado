# MISSÃO BANCÁRIA — STATUS

Atualizado em 28/09/2026 — #510 e #511 integradas; retenção em validação final.

## Estado e autorização

**Fase ativa: Fase 1. Ensino por leitura antes da avaliação.** Wellyton autorizou desenvolvimento, testes e integrações elegíveis sem acesso imediato nem nova confirmação por pequena etapa. Não confundir autorização com aprendizagem observada. Aplicar os documentos 24 e 26: subdividir a produção sem omitir o ensino.

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

Placar de referência do projeto nesta etapa: motor técnico ~81%; Fase 1 ~90% tecnicamente, ainda sem homologação humana; cobertura curricular publicada 1/43 blocos (~2,3%); projeto completo ~30%.

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

O bootstrap comum continua sem enviar o banco `eval.sfn.*`. A UI ainda não foi implementada e a revisão factual/editorial final dos 32 itens continua pendente antes de homologação.

## Hardening adicional — avaliação independente sob concorrência

Branch: `fix/missao-bancaria-avaliacao-concorrencia`, sobre o backend já integrado.

O início e o fechamento da avaliação independente passam a ser determinísticos mesmo sob duas requisições simultâneas:
- início concorrente converge para uma única rodada ativa;
- fechamento concorrente retorna o mesmo resultado persistido;
- nenhum XP, cobertura, prontidão ou histórico de treino é alterado.

A suíte ganhou cenários explícitos de concorrência para início e fechamento.

## Próximos recortes autorizados

Concluir CI e integração elegível, verificar publicação de frontend/Worker separadamente. Depois concluir a integração da retomada e desta correção histórica; os limites técnicos pós-cronômetro ficam então concentrados em validação/publicação e homologação humana. Desbloqueio no backend e comprovação real da persistência/clareza continuam pendentes. Não exigir teste imediato do usuário nem declarar a Fase 1 homologada só por testes técnicos.

A regra de sequência não foi alterada por checkpoints: sessões encerradas/atividade pedagógica continuam sendo consideradas conforme o mecanismo existente. Rascunhos de autoavaliação permanecem temporários e não são enviados.

Histórico de incidentes: erro inicial “Rota não encontrada” motivou #492/#494; #493 sem merge; #491/#496/#497 substituídas. Não reintroduzir versões abandonadas ou alterar gates para esconder falhas. A Fase 1 continua aberta.
