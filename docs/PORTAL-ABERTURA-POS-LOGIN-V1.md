# Portal — Abertura pós-login V1

Atualizado em 17/09/2026. PR #207 incorporado e publicado: Home inicializada durante o vídeo, sem flash de login no fim normal.

## Requisito vigente

Entrar permanece habilitado, autentica no primeiro clique e não expõe preparo de mídia. A abertura oficial mantém som e 10,005 segundos completos. Durante a reprodução inicia a Home de fato, não apenas baixa scripts. O fim normal depende de vídeo encerrado **e Home utilizável**, sem loader intermediário ou reinicialização por nova navegação.

## Diagnóstico

`warmForUser()` aquece arquivos/rotas por Service Worker, mas não monta DOM nem executa Home/perfil/feed. Em #204 a Home só iniciava após `location.replace`; o fade removia a cobertura ainda sobre o login. Foram corrigidas essas duas causas do código. A conexão do usuário não foi inspecionada.

## Entrada da Home no mesmo documento

`js/login-home-transition.js` prepara o HTML público somente depois de autenticar. Aceita Home local `/`, `/home/`, `/index.html`; segurança, Conselho e demais destinos mantêm navegação normal. Não é roteador genérico nem iframe permanente.

Com a camada opaca do vídeo presente, importa `.portal-shell` do HTML oficial, retira o formulário e aplica estilos/módulos da própria Home atrás do vídeo. Não existe cópia independente do markup. Reutiliza globais de autenticação, catálogo e desempenho. `history.replaceState` define a rota para os módulos; autorizações continuam verificadas normalmente.

`PortalHomeReady` resolve após configuração social, perfil/feed ou fallback legítimo de Ferramentas. A revelação espera também CSS e primeira pintura. O login recebe `{handled:true}` e não navega de novo, preservando a página já inicializada. No mobile, a rolagem da tela de login não é herdada.

Se a Home demorar mais que o vídeo, mantém o último quadro até o resultado, com prazo de inicialização de 20 s desde a preparação. Não é promessa de carregar todos os módulos/dados em 10 s; não se pré-carrega conteúdo clínico em massa nem se remove validação de sessão.

## Segurança, som e fallback

HTML exige marcador e estrutura esperados. Scripts externos, iframe, objeto, embed e handlers inline na shell são rejeitados. Apenas scripts locais com caminhos permitidos são carregados, sem avaliação arbitrária de código. A CSP oficial é preservada. A shell fica `inert` sob o vídeo e recupera interação/foco na revelação.

Falha de mídia/script/Home usa navegação normal. Cobertura já exibida permanece opaca até navegar, sem fade para login. Política de áudio restritiva pode recusar `play()`; isso não exige botão extra nem perde autenticação. Os prazos finitos de mídia/reprodução e o loader legado do #204 permanecem.

## Mídia e cache

MP4 oficial `assets/portal-opening-v1.mp4`: 2.393.970 bytes; SHA-256 `98b866963ccf1debbca9d942e647307e8ed4e045c231af17117d150da4c9d766`; H.264/AAC, 1280×720, 24 fps, 10,005 s. Binário inalterado e cache `portal-opening-media-v1` preservado.

Controladores de login, abertura, Home e helper usam versão `20260917-3`. SW atualiza pontualmente URLs anteriores, sem apagar sessão, documentos ou mídia. Aba antiga precisa recarregar o documento para usar a nova versão.

## Validação e publicação

Local: **184/184 Node**, incluindo 11 específicos; sintaxe e bundle válidos. Mantidos testes de permissão/privacidade; contratos do HTML/versão atualizados apenas onde a implementação mudou.

CI no head `e5f09ba37da552e3ebc1ded2795f3bb9bef2220e`: **24/24 testes anteriores e 8/8 da Home real**, sem retry, run `35271695809`, job `105372390991`. Central navegador também aprovada, run `35271695728`.

Testes da Home usam módulos/HTML reais com APIs fictícias integralmente interceptadas. Confirmam perfil/feed durante o vídeo, ausência de flash frame a frame, mesmo documento, Home lenta, credenciais incorretas, troca de senha, rolagem e logout. O fixture sem SW simula ausência de Push; a primeira falha foi espera em SW.ready no logout, não na entrada. Não houve teste de desvinculação de Push real, conta real ou homologação auditiva do dispositivo.

Merge #207: **`702471c7b180e31faa8e281ee0fefe04ee759474`**. GitHub Pages build/deploy aprovado no run `35272153680`.

Pós-merge **`35272154996` / job `105373903467` aprovado**, incluindo browser e verificação pública estática. O smoke conferiu login habilitado/versões e hashes de Home HTML/JS, helper, login, abertura, SW e MP4 no domínio oficial `regulacaoeldoradoms.com.br`. Esse GET público não autentica ou consulta APIs e é distinto do preview sintético.

## Decisões e continuidade

Descartados só prefetch, temporizador fixo como prova de prontidão, fade sobre login, iframe seguido de recarga, bloqueio de Entrar, botão de som, texto operacional e remoção de recuperação/permissões. Fase 4D/#201 e incidente Agenda/#206 permanecem independentes.

Riscos: rede/backend mais lentos que o vídeo, restrições de áudio e necessidade de manter a lista de scripts permitidos. Fallback finito mantém acesso. Rollback seguro por PR: retirar somente helper/retorno handled, mantendo autenticação imediata e cobertura opaca até navegação; nunca voltar ao botão bloqueado do #202.

Estado e próximos passos persistentes: `docs/CENTRAL-DOCUMENTOS-STATUS.md`.
