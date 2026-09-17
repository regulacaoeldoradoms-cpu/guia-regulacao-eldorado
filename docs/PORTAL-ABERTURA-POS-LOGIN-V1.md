# Portal — Abertura pós-login V1

Atualizado em 17/09/2026. Continuação após #204/#205: corrigir Home iniciada tarde e flash do login ao terminar o vídeo.

## Requisito vigente

Entrar permanece habilitado, autentica no primeiro clique e não expõe preparo de mídia. A abertura oficial mantém som e 10,005 segundos completos. Durante a reprodução deve iniciar a Home de fato, não apenas baixar scripts. O fim normal é vídeo encerrado **e Home utilizável**, sem flash de login, loader intermediário ou reinicialização por nova navegação.

## Diagnóstico

`warmForUser()` aquece arquivos/rotas por Service Worker. Isso não monta o DOM, executa os módulos da Home nem espera perfil/feed. Em #204 a Home só iniciava após `location.replace`. Além disso, `playOpening()` removia a cobertura antes de navegar: a tela de login ficava visível durante o fade. São duas causas distintas confirmadas no código; a conexão do usuário não foi inspecionada.

## Entrada da Home no mesmo documento

`js/login-home-transition.js` prepara o HTML público da Home somente depois de autenticar. Não é roteador genérico nem iframe persistente. Aceita somente destinos locais `/`, `/home/`, `/index.html`; segurança, Conselho e demais destinos preservam navegação normal.

Quando a camada de vídeo opaca existe, importa a `.portal-shell` do HTML oficial, retira o formulário de login e aplica estilos/módulos da própria Home atrás do vídeo. Não há segunda cópia independente do markup. Globais compartilhados de autenticação, catálogo e desempenho são reutilizados. A URL é atualizada por `history.replaceState`; permissões continuam verificadas pelos módulos existentes.

`window.PortalHomeReady` resolve quando a Home terminou configuração social, perfil e feed ou montou o fallback existente de Ferramentas. O controlador aguarda também CSS e a primeira pintura antes de revelar. O login recebe `{handled:true}` e não chama `location.replace` no caminho normal, preservando a página já inicializada.

Se a Home demorar mais que o vídeo, o último quadro permanece até o resultado, com prazo de inicialização de 20 s desde o início da preparação da Home. Não há promessa de carregar todos os módulos do Portal em 10 s. Não se baixa em massa conteúdo clínico nem se remove validação de sessão para ganhar velocidade.

## Segurança, som e fallback

HTML deve conter marcador de bootstrap e estrutura esperada. Scripts externos, iframe, objeto, embed e handlers inline na shell são rejeitados. Apenas caminhos de scripts locais allowlisted são carregados; nenhuma avaliação de script arbitrário. A CSP oficial da Home é mantida. A shell fica `inert` durante a abertura e recupera foco/interação na revelação.

Mídia, script ou Home indisponíveis usam o fallback com navegação normal. Quando a cobertura já existe, ela permanece opaca até navegar; nunca se faz fade de volta ao login. Políticas restritivas de áudio ainda podem recusar `play()`; isso não exige segundo botão nem perde autenticação. Os prazos finitos de mídia e reprodução da correção #204 permanecem.

## Mídia e cache preservados

`assets/portal-opening-v1.mp4`: 2.393.970 bytes; SHA-256 `98b866963ccf1debbca9d942e647307e8ed4e045c231af17117d150da4c9d766`; H.264/AAC, 1280×720, 24 fps, 10,005 s. Binário inalterado e cache `portal-opening-media-v1` preservado.

Controladores de login, abertura, Home e helper usam versão `20260917-3`. O Service Worker atualiza pontualmente URLs anteriores, sem apagar sessão, documentos ou o cache da mídia.

## Validação e implantação

Local: 184/184 testes Node aprovados, 11/11 específicos da abertura, sintaxe válida e bundle sintético validado. Ajustados somente os contratos do HTML/versão que mudaram; testes de permissão e privacidade preservados.

Pendente no CI: os 24 cenários existentes e 8 execuções adicionais de Home real desktop/mobile, com APIs fictícias interceptadas. Cobrem inicialização de perfil/feed durante o vídeo, ausência de flash frame a frame, mesma página sem segunda navegação, Home lenta, erro de credenciais, troca de senha e logout.

Branch `fix/opening-home-ready-handoff`, baseada em main `e36ac882e4fec626ba3edcad26a2dbdc6777d3ed`. Sem merge/publicação nesta revisão. Após merge, verificar HTML e hashes dos arquivos no domínio oficial pelo smoke já existente; Pages sintético não comprova produção.

## Decisões e continuidade

Descartados: confiar só no prefetch, temporizador fixo em vez de prontidão, fade sobre login, iframe seguido de recarga, bloqueio de Entrar, remover loader de recuperação e alterar permissões. Fase 4D/#201 e incidente Agenda/#206 permanecem independentes.

Rollback seguro: retirar somente helper/retorno handled, mantendo autenticação imediata e cobertura opaca até navegação. Não retornar ao botão bloqueado do PR #202. Estado e próximos passos em `docs/CENTRAL-DOCUMENTOS-STATUS.md`.
