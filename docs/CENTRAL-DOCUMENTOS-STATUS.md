# Central de Documentos — Status

Última atualização: 17/09/2026

## Fase atual

**Fase 4 — Sincronização segura com Drive**, subfase **4D — homologação real controlada em andamento**. **Fase 0 encerrada**; Fases 1–3 encerradas; 4A–4C concluídas tecnicamente. Não reiniciar fases encerradas.

A Central permanece na branch `codex/central-docs-drive-sync-phase4`, PR #201 aberto e sem merge. Último head observado nesta retomada: `4d64c5df54da096b4e4cb12ed79ac3fa8c97b530`; há trabalho paralelo, reler antes de retomar. Nenhuma escrita no Drive ou alteração dessa branch nesta intervenção.

Base main conferida: `e36ac882e4fec626ba3edcad26a2dbdc6777d3ed`. PR #204 corrigiu o bloqueio indevido de Entrar no merge `8cefaf639a9399f77658867ef10f82a0fb694222`; #205 registrou a publicação. Essa correção permanece preservada.

O incidente Agenda/Firebase está registrado separadamente no draft #206, branch `docs/agenda-firebase-indisponivel-20260917`. Não foi resolvido nem alterado aqui; não confundir com a abertura.

## Objetivo transversal atual — Home pronta ao terminar a abertura

O usuário relatou que, após o vídeo, apareciam novamente login e loader. Solicitou continuação após interrupção do chat. A branch **`fix/opening-home-ready-handoff`** já existia apontando para main sem alterações e foi reutilizada, sem duplicar trabalho.

**Última decisão humana:** o vídeo deve ser aproveitado para pré-carregar/inicializar o Portal; a transição não deve exibir login nem novo carregamento normal ao terminar. Entrar deve continuar habilitado, com autenticação no primeiro clique e sem texto operacional ou botão intermediário.

## Diagnóstico confirmado

O aquecimento `PortalPerformance.warmForUser()` baixa recursos, mas não executa a inicialização da Home. `location.replace` só a iniciava depois do vídeo. O fade/removal da cobertura ocorria sobre o login, expondo-o antes da navegação. Não foi medido o navegador do usuário; o diagnóstico deriva do fluxo implementado.

## Decisão e implementação em validação

A Home é inicializada no **mesmo documento**, sob a camada opaca da abertura: HTML oficial e módulos existentes, sem iframe permanente, sem template duplicado e sem segunda navegação no caminho normal.

Novo `js/login-home-transition.js`: aceita somente Home local; valida marcador/estrutura do HTML, caminhos allowlisted de scripts e CSS, rejeita conteúdo executável inline na shell e preserva CSP. Reutiliza auth/catálogo/desempenho e deixa a shell `inert` enquanto coberta. Nenhuma API privada recebe novo cache ou telemetria.

`js/home.js` fornece `PortalHomeReady` após configuração, perfil/feed ou fallback existente de Ferramentas. A abertura só faz fade com `ended` e Home pronta, CSS e primeira pintura. Em seguida libera interação/foco e retorna `handled:true`, impedindo que o login recarregue a Home já pronta.

Se a Home ainda não terminou, mantém o último quadro, com prazo de bootstrap de 20 s. Falhas usam navegação normal; uma cobertura já exibida não é removida/fadeada para o login. Rotas de segurança, Conselho e outros destinos continuam com navegação normal e controles existentes.

Preservados: MP4 oficial de 10,005 s com som, cache `portal-opening-media-v1`, prazos finitos/fallback do #204, Entrar habilitado, credenciais/rotas/autorizações e prefetch já existente. Scripts atualizados para `20260917-3` com invalidação pontual do SW.

## Evidências atuais

- 184/184 testes Node locais, incluindo 11 testes específicos da abertura; sintaxe válida.
- Bundle sintético de staging gerado e validado.
- Testes sociais mantidos; somente contrato de versão e marcador do HTML atualizado para corresponder à implementação.
- Novos testes usam HTML/controladores/DOM reais da Home e interceptam todas as APIs externas com dados fictícios, sem conta real.
- **Browser/CI ainda pendente:** 24 cenários existentes e 8 execuções adicionais desktop/mobile (Home durante os 10 s, mesma página, flash frame a frame, Home lenta, senha incorreta, rota de segurança, logout).
- Navegação no navegador local foi bloqueada pela política do ambiente; não declarar homologação local de navegador. A execução real será pelo GitHub Actions.
- Sem merge ou publicação desta revisão. Após merge, smoke público verificará HTML e hashes no domínio oficial, não apenas Pages sintético.

## Alternativas descartadas, riscos e rollback

Descartados: só prefetch; espera fixa de 10 s sem sinal de prontidão; iframe com recarga posterior; fade que revela login; novo bloqueio do botão; esconder falha de autorização ou alterar backend para acelerar.

Riscos: rede/backend podem exceder 10 s; política de autoplay pode recusar som; mudanças futuras nos scripts da Home exigem atualizar allowlist. Fallback é finito e mantém autenticação, não uma garantia de carregar todos os módulos/dados. Não foi executada autenticação real nem medição de áudio no dispositivo do usuário.

Rollback por PR: desativar apenas handoff no mesmo documento, preservando login imediato e cobertura opaca até navegação. Não restaurar o botão bloqueado do PR #202.

## Próxima ação exata

Publicar o conjunto atomicamente na branch existente, abrir PR, conferir diff e executar CI do head exato. Corrigir somente falhas verificadas. Com testes relevantes verdes, integrar a correção solicitada e confirmar os arquivos publicados no domínio oficial; registrar evidências finais neste status. Não mesclar #201 nem #206 como parte desta tarefa.

## Handoff para o próximo chat

**Fase oficial:** 4D, PR #201, independente.  
**Objetivo atual:** Home real iniciada durante vídeo, sem flash de login/loader ao final.  
**Base main:** `e36ac882e4fec626ba3edcad26a2dbdc6777d3ed`.  
**Branch:** `fix/opening-home-ready-handoff`; PR ainda a abrir nesta revisão.  
**Última ação concluída:** implementação local e 184 testes Node aprovados; browser/CI e publicação pendentes.  
**Decisão:** mesmo documento, `PortalHomeReady` + `ended`; sem nova navegação normal.  
**Arquivos:** `js/login-home-transition.js`, `js/login-opening.js`, `js/home.js`, `js/login.js`, HTML/SW, testes e documento `PORTAL-ABERTURA-POS-LOGIN-V1.md`.  
**Próximo passo:** conferir PR/CI, resolver regressões reais, publicar e validar hashes oficiais.  
**Privacidade:** nenhum dado clínico, conta real, segredo, escrita no Drive ou telemetria nova.
