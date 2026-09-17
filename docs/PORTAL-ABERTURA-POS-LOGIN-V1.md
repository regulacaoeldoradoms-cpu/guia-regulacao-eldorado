# Portal — Abertura pós-login V1

Data da decisão: 17/09/2026  
Escopo: mudança transversal de experiência do Portal, sem alterar o escopo funcional da Fase 4 da Central de Documentos.

## Decisão aprovada

O vídeo anexado pelo usuário em 17/09/2026 é o **vídeo oficial de abertura pós-login do Portal**.

Requisitos vigentes:

- reproduzir aproximadamente **10 segundos completos** do vídeo;
- manter **som**;
- ocupar a tela inteira;
- **não exibir botão intermediário para iniciar vídeo ou som**;
- começar a baixar/preparar a mídia enquanto o usuário ainda está na tela de login;
- a preparação técnica deve ser **invisível para o usuário**: o botão continua apresentado normalmente como **Entrar**, sem mensagens como “Preparando abertura...”;
- internamente, a autenticação/navegação só pode prosseguir quando o MP4 completo estiver disponível e decodificável localmente;
- após autenticação válida, reproduzir a abertura na própria página de login e somente depois navegar para o Portal;
- manter o loader legado da Home como fallback do carregamento normal do Portal;
- aproveitar os ~10 s para o aquecimento já existente de Home, Ferramentas e rotas autorizadas;
- armazenar/reutilizar a mídia em Cache Storage;
- usar transição suave ao terminar;
- não cortar o vídeo por cronômetro: a conclusão normal depende do evento real `ended`.

## Arquivo oficial

`/assets/portal-opening-v1.mp4`

- MP4 / H.264 + AAC;
- 1280 × 720;
- 24 fps;
- duração medida: 10,005 s;
- tamanho: 2.393.970 bytes;
- SHA-256: `98b866963ccf1debbca9d942e647307e8ed4e045c231af17117d150da4c9d766`.

A suíte valida tamanho e SHA-256 diretamente sobre o binário versionado para impedir substituição silenciosa.

## Evolução arquitetural após homologação humana

A primeira implementação montava a abertura já na Home e, quando a política do navegador bloqueava autoplay com áudio, apresentava **“Iniciar abertura com som”**. Na homologação de 17/09/2026 o usuário rejeitou esse comportamento.

A abertura foi então movida para o fluxo de login. Em uma segunda correção, o usuário esclareceu que o carregamento em segundo plano é um detalhe operacional e **não deve ser comunicado visualmente**. O objetivo é impedir que o Portal avance antes de a mídia estar pronta, sem transformar isso em um estado de interface.

A arquitetura vigente é, portanto, **gate técnico silencioso no login + reprodução no mesmo documento + navegação depois do vídeo**.

### Por que o gate continua interno

O botão é apresentado como **Entrar** durante toda a preparação, mas a ação fica tecnicamente retida até o vídeo estar pronto. Essa escolha é deliberada:

1. impede transição para uma superfície de abertura sem mídia;
2. garante que o clique efetivo de login ocorra somente depois de o vídeo estar disponível;
3. permite usar esse clique para preparar reprodução com áudio ainda no mesmo documento;
4. reduz o risco de perder a ativação do usuário durante uma espera assíncrona e reintroduzir bloqueio de autoplay;
5. não expõe detalhes operacionais ao usuário.

A alternativa de aceitar o clique antes da mídia estar pronta e simplesmente aguardar foi descartada porque o tempo assíncrono pode consumir a ativação transitória do navegador necessária para a reprodução com som.

## Fluxo atual

1. `login/index.html` solicita preload do MP4 e carrega `js/login-opening.js` antes de `js/login.js`.
2. `js/login-opening.js` aplica um **gate interno silencioso**: o controle aparece como **Entrar**, sem texto de preparação, sem aviso no status e sem aparência de carregamento.
3. O controlador procura primeiro uma cópia válida em `portal-opening-media-v1`.
4. Sem cache válido, baixa a resposta completa da rede.
5. O Blob só é aceito se tiver exatamente **2.393.970 bytes**; mídia incompleta não libera o fluxo.
6. O Blob é convertido em URL local `blob:` e um `<video>` oculto é carregado até estado reproduzível.
7. Somente depois o gate interno é retirado.
8. O gesto real em **Entrar** prepara o mesmo elemento de mídia sem reproduzir uma prévia audível.
9. A autenticação real ocorre normalmente.
10. Com usuário autenticado, `PortalPerformance.warmForUser(user, { immediate: true })` inicia/continua o aquecimento do Portal.
11. O mesmo vídeo já preparado ocupa a tela inteira, com `muted=false` e volume 1.
12. Após `ended`, ocorre fade e o `login.js` segue para a rota normal do usuário.
13. A Home não possui implementação de abertura; `js/home.js` cuida apenas da Home e preserva o loader legado.

## Falha de preparação

Se o MP4 não puder ser obtido integralmente ou não ficar reproduzível:

- o gate interno permanece ativo;
- **o usuário continua vendo apenas o botão normal “Entrar”**;
- não aparece mensagem operacional no `loginStatus`;
- uma nova tentativa ocorre automaticamente;
- autenticação e navegação não são iniciadas enquanto a mídia não estiver pronta.

A ausência de mensagem é intencional: o carregamento da abertura é implementação interna, não informação de produto para o usuário.

## Falha excepcional de reprodução após autenticação

Não existe botão **“Iniciar abertura com som”** nem outro prompt intermediário.

Se, apesar da preparação ligada ao gesto do login, o navegador ainda recusar a reprodução com áudio ou a mídia falhar naquele instante:

- a camada de abertura é retirada;
- não é solicitado um segundo clique;
- a autenticação permanece válida;
- o fluxo segue para a Home, cujo loader legado continua sendo o fallback seguro.

Isso evita prender o usuário após as credenciais já terem sido aceitas.

## Cache local

Cache Storage: `portal-opening-media-v1`.

Comportamento vigente:

- a cópia pode ser populada **já durante a preparação na tela de login**, sem esperar a primeira reprodução terminar;
- execuções seguintes priorizam a cópia cacheada;
- a resposta cacheada também precisa resultar no tamanho exato esperado;
- cache inválido é removido e a rede é tentada novamente;
- o vídeo preparado é reproduzido por URL `blob:` local;
- indisponibilidade/quota do Cache Storage não impede a preparação pela rede.

O staging sintético usa CSP `media-src 'self' blob:`; nenhuma origem externa de mídia foi liberada.

## Janela de aquecimento de ~10 s

Os 10 segundos continuam sendo deliberados também como orçamento de carregamento em segundo plano.

O Portal reutiliza `PortalPerformance.warmForUser()` e o Service Worker existentes. Não foi criado um segundo prefetch independente. Em conexões restritas/Save-Data, as regras existentes de contenção continuam prevalecendo.

A abertura não acrescenta espera depois de `ended` para concluir prefetch; a Home assume o fluxo normal e, se necessário, mostra seu loader legado.

## Service Worker

O Service Worker mantém a versão contratual `20260916-10`, mas inclui `/js/login-opening.js?v=20260917-1` no conjunto de recursos centrais.

Como o próprio script do Service Worker usa `skipWaiting()` + `clients.claim()`, uma nova instalação atualiza as páginas `/login/` e `/` no cache existente sem exigir mudança do identificador protegido por contratos históricos da suíte.

Foi descartada a troca desnecessária da versão do cache após ela provocar falhas em contratos legados sem trazer benefício funcional adicional.

## Laboratório sintético e Playwright

O laboratório `/opening/` reproduz o fluxo sem dados reais:

- formulário de login fictício;
- gate interno de preparação sem texto operacional;
- mesma `js/login-opening.js` usada pelo Portal;
- autenticação fictícia;
- destino sintético `/opening/complete.html` após a abertura;
- mesmo MP4 oficial;
- sem Google Drive, D1, Worker de produção, pacientes, usuários reais ou segredos.

Foi identificado um defeito no servidor HTTP da própria suíte: `/opening/` era tratado como diretório e não resolvia automaticamente `index.html`, fazendo os testes falharem por ausência de `#loginSubmit`. O servidor de staging foi corrigido para resolver diretórios para `index.html` mantendo a proteção contra path traversal.

No head `47a7280e8331c6e42be39722e55b53f1ee45b8e4`, o workflow dedicado **Validar abertura pós-login — navegador** concluiu com sucesso após essa correção.

A suíte de navegador cobre desktop e mobile e verifica:

- MP4 completo antes da liberação interna do fluxo;
- botão visualmente apresentado como **Entrar** durante a preparação;
- ausência de mensagem operacional em `loginStatus`;
- ausência de `portalOpeningStartWithSound`;
- vídeo por Blob local, tela inteira, `muted=false` e volume 1;
- segunda preparação usando Cache Storage mesmo com a rede do MP4 bloqueada;
- `NotAllowedError` excepcional sem botão intermediário;
- MP4 indisponível sem chamada de autenticação.

## Fallback e privacidade

O loader antigo da Home continua preservado. A abertura não adiciona telemetria com identidade, dados clínicos, documentos ou IDs do Drive.

## Relação com a Central de Documentos

A fase oficial continua sendo **Fase 4 — Sincronização segura com Drive, subfase 4D**, no PR #201. A abertura permanece isolada no PR #202 e não altera os critérios da Fase 4.

## Critérios de aceite atualizados

- binário oficial presente e protegido por SHA-256;
- preparação integral do vídeo antes de autenticação/navegação;
- botão apresentado normalmente como **Entrar**, sem texto ou aviso de preparação;
- nenhum botão intermediário para iniciar vídeo/som;
- abertura em tela inteira em desktop e mobile;
- áudio ativo quando o navegador permitir a reprodução preparada pelo gesto de login;
- ~10 s completos e finalização por `ended`;
- fade final;
- aquecimento do Portal em paralelo;
- cache reutilizado em nova autenticação;
- falha de preparação permanece silenciosa e tenta novamente;
- falha excepcional de reprodução não perde a autenticação e cai para o fluxo normal;
- Home sem implementação duplicada da abertura;
- workflow dedicado de navegador verde no head atual;
- homologação visual/sonora humana do novo preview antes de retirar o PR #202 de draft.
