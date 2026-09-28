# MISSÃO BANCÁRIA — TEMPO VISÍVEL, PAUSA E SALVAMENTO PARCIAL

Data: 26/09/2026. Fase ativa: Fase 1.
Base: `f391a665cd7ede05ea9d1a880e96589d89a67704`, integração da PR #508 nesta retomada.
Branch: `feat/missao-bancaria-tempo-visivel`.
Estado inicial: implementação e testes locais concluídos; resultados remotos e publicação devem ser verificados separadamente.

## Objetivo e recorte

O cronômetro anterior media o tempo decorrido entre abertura e saída. Agora as novas sessões contam intervalos em que a aula está visível e não foi pausada pelo usuário. A medida continua sendo tempo registrado, não prova de atenção, leitura ou aprendizagem.

Nenhuma aula, exemplo, atividade formativa, questão pontuada, gabarito, conquista ou regra de XP é modificada. O bloco continua com oito aulas, preparação do Chefe, 27 atividades formativas e 38 questões pontuadas.

## Experiência implementada

- O cronômetro inicia depois da confirmação da sessão no servidor.
- Ao ocultar a aba ou ao receber `pagehide`, a contagem pausa; ao retornar, retoma, salvo quando houve pausa manual.
- O botão **Pausar tempo / Retomar tempo** mantém o estado manual mesmo após esconder e mostrar a página. Pausar não bloqueia a leitura, a consulta ou as questões.
- A interface distingue contagem, pausa manual, segundo plano, salvamento em andamento e tempo confirmado.
- O contador usa `performance.now()` e amostras periódicas, não mudanças do relógio civil do aparelho.
- Intervalos maiores que cinco segundos entre amostras são descartados conservadoramente, para não transformar suspensão do navegador em muitos minutos de estudo. Isso pode subestimar tempo quando o navegador fica bloqueado; não é um cronômetro de precisão certificada.
- Não se exige movimento do mouse, digitação, clique por parágrafo ou tempo mínimo de permanência. Esses sinais não comprovam que alguém esteja aprendendo.

O quadro do dashboard passa de **Horas líquidas** para **Tempo registrado**. O total conserva registros históricos pelo mecanismo anterior e inclui os novos registros com pausa. Nenhum tempo antigo é recalculado ou apagado.

## Salvamento parcial

A cada 30 segundos de funcionamento do controlador, havendo tempo ainda não confirmado, ele envia o **total cumulativo** da sessão. Também tenta salvar ao pausar, alterar visibilidade e receber o evento de reconexão. Não envia conteúdo das aulas, alternativas, rascunhos ou dados de outros módulos.

Endpoint: `POST /api/studies/sessions/:sessionId/checkpoint`, com `{durationSeconds}`. O gate de origem, autenticação e usuário autorizado é o mesmo das rotas de estudo.

O servidor:
- exige duração numérica, finita e não negativa;
- limita ao teto de seis horas e ao intervalo desde a abertura no servidor;
- grava o maior total validado já recebido, em vez de somar incrementos;
- não reduz tempo por mensagem antiga, repetição ou ordem de chegada invertida;
- não encerra a sessão ou rodada e não concede XP, conquista ou conclusão;
- não reabre nem acrescenta tempo a uma sessão já finalizada;
- devolve confirmação com o identificador da sessão, protocolo e duração persistida.

O cliente serializa os pedidos e combina atualizações mais recentes. Falha de rede ou confirmação incompatível não aparece como salvamento concluído. Um resultado atrasado da sessão anterior não atualiza o contador da próxima. Cada tentativa tem limite de espera; o próximo ciclo pode reenviar o total, sem duplicação de segundos.

## Persistência e fechamento

É utilizado o campo existente `study_sessions.duration_seconds`. **Este patch não cria tabelas nem faz migração de schema**; as duas tabelas de rodadas vieram da #508.

O fechamento idempotente da #508 passa a preservar o maior tempo já confirmado por checkpoint. Isso impede que um fechamento atrasado com valor inferior apague um salvamento parcial anterior.

As métricas passam a somar segundos efetivamente gravados de sessões ativas e encerradas. Assim, se o aplicativo for fechado sem uma confirmação final, o último checkpoint confirmado continua compondo o total. Encerrar depois não soma o mesmo tempo outra vez. Sessões apenas abertas, sem tempo gravado, acrescentam zero.

A sequência de dias não foi reescrita nesta rodada. Ela mantém sua regra anterior de tentativas/eventos ou sessões encerradas com duração mínima. Checkpoint não concede diretamente um dia de sequência. O limite histórico dos 500 eventos continua pendente.

## Limitações explícitas

- `pagehide` e eventos de encerramento podem não chegar quando o sistema fecha o aplicativo abruptamente. Não se garante envio no último instante.
- O trecho posterior ao último salvamento confirmado pode se perder, sobretudo se houver falha de rede. Não há fila offline durável nesta entrega.
- Recarregar ou abrir outra página não restaura automaticamente o cronômetro ou a mesma rodada; o tempo parcial já salvo permanece no servidor. Marcador de leitura e recuperação da sessão são recortes posteriores.
- Visibilidade não comprova atenção. Duas janelas visíveis em dispositivos ou telas distintos ainda podem registrar intervalos simultâneos; não foi criado bloqueio global entre aparelhos.
- Intervalos longos descartados podem gerar subcontagem. Não há promessa de medir com exatidão cada segundo de leitura.
- A interface não trata o total misto de registros novos e antigos como atenção comprovada nem recalcula o passado.

## Compatibilidade e preservação

Bootstrap e abertura anunciam `timeProtocol: 1`. O cliente somente envia checkpoints quando a abertura confirmou esse protocolo. Com servidor anterior, informa a indisponibilidade do salvamento parcial, sem apresentar confirmação falsa; o fechamento existente continua sendo usado.

Se o script de tempo não carregar, a aula e a prática continuam utilizáveis, mas o contador fica indisponível e não inventa uma duração pela navegação. Os assets novos são versionados. Verificar frontend e Worker na publicação; apenas um deles não comprova o recurso completo.

Arquivos funcionais: novo `js/studies-clock.js`, CSS restrito ao cronômetro, integração em `js/studies.js`/`estudos/index.html` e adição pontual ao serviço/roteador. O leitor por partes e todos os arquivos de conteúdo permanecem inalterados. Não há novo cargo, segredo, binding, telemetria externa ou relaxamento de gate de publicação.

Rollback: reverter o conjunto de frontend/Worker de forma coordenada, mantendo dados. Os segundos gravados são reutilizados pelo código atual; a versão anterior não exibe checkpoints de sessões ainda abertas até que terminem. Não apagar registros para reverter a interface.

## Validação realmente executada

Localmente passaram:
- **13 testes de contador/controlador**, incluindo visibilidade, pausa manual, retorno da página, suspensão, limite, reconexão, pedidos sobrepostos, resposta antiga e servidor anterior;
- **nove testes com SQL real em SQLite descartável**, incluindo gravação parcial, repetição, concorrência simulada, ordem invertida, limites, sessão finalizada, isolamento por usuário e falha injetada;
- **dez fluxos do roteador real** com autenticação e catálogo sintéticos — sete anteriores e três novos de checkpoint, métricas e autorização. A persistência é SQL real, não respostas prontas.

O wrapper confirma as dez execuções do roteador. Sintaxe do novo teste de navegador foi verificada. Os arquivos existentes copiados para edição local foram conferidos pelos hashes Git, e o conteúdo enviado deve coincidir com os arquivos testados.

Não foi executado navegador local nesta rodada nem usada sessão de Wellyton ou D1 produtivo. O ambiente local não resolveu DNS do GitHub; leitura/escrita oficial é feita pelo conector. SQLite descartável não certifica toda a infraestrutura distribuída do D1.

Para CI foram acrescentados **nove cenários de navegador**, mantendo os 55 existentes, total previsto de **64**. Usam HTML/CSS/clientes do repositório, autenticação e servidor simulados, com relógio controlado do Playwright. Incluem fluxo de 30 segundos, ocultação, pausa manual, retorno online, recibo atrasado, suspensão longa e compatibilidade. O evento de visibilidade é controlado na fixture; isso não é teste físico de bloqueio de tela em um aparelho Android.

Nenhum cenário anterior, tolerância, baseline ou limiar é removido. O teste do roteador passa de sete para dez fluxos porque três foram adicionados; os sete anteriores permanecem.

## Referências técnicas consultadas

- MDN, Page Visibility API: https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
- MDN, Performance.now: https://developer.mozilla.org/en-US/docs/Web/API/Performance/now
- MDN, Window.pagehide: https://developer.mozilla.org/en-US/docs/Web/API/Window/pagehide_event
- Cloudflare D1, prepared statements: https://developers.cloudflare.com/d1/worker-api/prepared-statements/
- Playwright, controle do relógio nos testes: https://playwright.dev/docs/clock

São referências de implementação e limites, não certificação de atenção, acessibilidade integral ou entrega no encerramento do aplicativo.

## Continuidade

A #508 foi integrada após 24 verificações consultadas com sucesso. Seus checks de GitHub Pages, Worker e Pages de staging passaram e foram registrados na PR, sem confundir preview/staging com confirmação do tráfego produtivo.

Concluir o CI e integrar esta correção se elegível; registrar build e publicação separadamente. Próximos recortes: recuperação controlada de sessões/marcador, sequência histórica sem truncamento e requisitos de desbloqueio no backend, sem apagar progresso. A Fase 1 permanece aberta para avaliação humana; Wellyton autorizou prosseguir sem acessar agora.
