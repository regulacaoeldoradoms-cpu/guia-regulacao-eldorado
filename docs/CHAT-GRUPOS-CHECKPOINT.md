# Grupos do chat — checkpoint V1

## Estado em 08/10/2026

PR #611, branch `feat/chat-groups-reviewed-20261008`.
Base main conferida: `8e1a208bb924606a85aa4ada2397a81ae80011b5` (PR #609).
Versão `20261008-chat-groups-1`. Implementação concluída na candidata;
integração e publicação ainda dependem dos gates finais da PR e do deploy seguro.
Especificação: [CHAT-GRUPOS.md](CHAT-GRUPOS.md).

## Regra permanente

Somente amigos aceitos e vigentes do criador original podem ser convidados e aceitar.
Outros administradores respeitam esse criador imutável. O servidor revalida amizade,
sessão, participação e intervalo. Grupo não cria amizade nem acesso individual/profissional.

## Revisão incorporada

Convites notificam externamente somente novos convidados; mensagens notificam somente
membros aceitos não silenciados. Histórico transmite metadados de foto por autor
da página, com autorização revalidada. Cache privado carrega a imagem por versão
e associa aos balões somente em memória, inclusive na sincronização incremental.
Retry confirma mensagem já persistida no intervalo autorizado após encerramento;
mensagens novas continuam negadas. Fotos do grupo usam rota privada e cache em memória
por versão; falhas transitórias liberam nova tentativa na próxima atualização.
O seletor de amigos omite fotos completas e conserva a autorização do criador.
Detalhes retornam metadados leves das fotos dos participantes, obtidas pela mesma
fila/cache privado por grupo, conta e versão. A rota revalida o acesso e restringe
fotos de convidados pendentes aos administradores.
O marcador individual `receivedThroughId` é preservado/normalizado no snapshot do
Service Worker e hidratado antes dos eventos realtime, evitando recontagem na retomada.

Preload/contador individuais, fotos, datas, diálogos, reentrada, limites atômicos,
logout e desativação foram preservados. A entrega concorrente #609, conteúdos de
estudo, bindings e gate seguro permanecem íntegros. Auxiliar temporário
`.github/workflows/apply-group-avatar-review.yml` removido da candidata.

## Evidências e limites

Retomada local: **832 casos Node verificados** entre suíte ampla e confirmação
focada; **46/46 focados** (31 grupos + 15 integração/snapshot), sem falhas/skips;
sintaxe afetada e diff sem erros; **4/4 Chromium** claro/escuro × desktop/mobile,
três contas fictícias, incluindo recuperação de foto após HTTP 503 sintético e
fotos de participantes preservadas com cache na reabertura dos detalhes.
Recebimento individual: **15/15 Chromium** na retomada final. A espera do cenário
de histórico oculto agora aguarda recibo observável por até dois segundos em vez
de presumir resposta dentro de 80 ms; a asserção de autorização/leitura foi mantida.
As três regressões preservadas e a nova de candidatos integram o gate existente
em `chat-group-notification-payload.test.mjs`, junto à regressão dos detalhes
privados, sem execução duplicada nesse gate.
Evidências: `final-resumed-all-tests.log`, `final-resumed-browser.log` e
`final-resumed-focused-tests.log` e `evidence-final-20261008/groups-browser.json`,
fora da árvore publicada. O teste novo teve expectativa ajustada de 404 para o
403 vigente de sessão revogada; implementação não mudou após a suíte ampla.

Reaproveitados oito cenários de apresentação do gate `a51bdd8`, pois a mudança de
snapshot não altera fotos/datas/layout; o CI final executa suas integrações.
Backup anterior à sincronização:
`preserved-resume-20261008-093042/repo`. `resume-final-review.cjs` não foi reaplicado.
Não foram usados contas reais, conversas reais ou dados de pacientes.

## Próxima ação

Conferir CI terminal e revisão do head final, integrar por squash somente após gates
aprovados e publicar pelo [fluxo seguro existente](WORKER-SAFE-DEPLOY.md).
Registrar na PR SHA integrado, builds Pages/Worker e verificação dos 27 arquivos
públicos, realtime e barreiras anônimas/CORS. Este checkpoint não comprova publicação.
Aceite humano autenticado permanece separado dos testes sintéticos; não acessar
conversas reais para validar a entrega. Não inclui anexos, chamadas, links públicos
de entrada ou criptografia ponta a ponta.
