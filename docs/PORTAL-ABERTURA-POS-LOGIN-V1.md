# Portal — Abertura pós-login V1

Data da decisão: 17/09/2026  
Escopo: mudança transversal de experiência do Portal, sem alterar o escopo funcional da Fase 4 da Central de Documentos.

## Decisão aprovada

O vídeo anexado pelo usuário em 17/09/2026 é o **vídeo oficial de abertura pós-login do Portal**.

Requisitos vigentes:

- reproduzir os aproximadamente **10 segundos completos**;
- manter **som**;
- ocupar a tela inteira;
- **não exibir botão intermediário para iniciar o vídeo ou o som**;
- começar a baixar/preparar o vídeo enquanto o usuário ainda está na tela de login;
- manter o botão **Entrar bloqueado até o MP4 completo estar disponível e decodificável localmente**;
- após autenticação válida, reproduzir a abertura na própria página de login e somente depois navegar para o Portal;
- manter o loader legado da Home como fallback para o carregamento normal do Portal;
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

## Revisão arquitetural após homologação humana

A primeira implementação montava a abertura já na Home e, quando a política do navegador bloqueava autoplay com áudio, apresentava **“Iniciar abertura com som”**. Na homologação de 17/09/2026 o usuário rejeitou esse comportamento.

A arquitetura foi então alterada: **a abertura agora pertence ao fluxo de login, não à Home**.

Motivos:

1. o vídeo pode ser totalmente preparado antes de o usuário tentar entrar;
2. o clique real em **Entrar** pode ser aproveitado para preparar a reprodução com áudio dentro do mesmo documento;
3. não há transição para uma tela de vídeo ainda sem mídia disponível;
4. a Home deixa de ter qualquer botão ou gate de áudio da abertura;
5. a navegação para o Portal só ocorre depois do término normal da abertura ou de uma falha excepcional de reprodução.

A alternativa “pré-carregar no login, navegar para a Home e só então tocar” foi descartada porque a navegação pode perder a ativação do usuário e reintroduzir bloqueios de autoplay com som.

## Fluxo atual

1. `login/index.html` solicita preload do MP4 e carrega `js/login-opening.js` antes de `js/login.js`.
2. O botão **Entrar** nasce desabilitado com o texto **“Preparando abertura...”**.
3. `js/login-opening.js` procura primeiro uma cópia válida em `portal-opening-media-v1`.
4. Sem cache válido, baixa a resposta completa da rede.
5. O Blob só é aceito se tiver exatamente **2.393.970 bytes**; mídia incompleta não libera o login.
6. O Blob é convertido em URL local `blob:` e um `<video>` oculto é carregado até estado reproduzível.
7. Somente então o botão muda para **Entrar** e é habilitado.
8. O gesto no botão prepara o mesmo elemento de mídia sem reproduzir uma prévia audível.
9. A autenticação real ocorre normalmente.
10. Com usuário autenticado, `PortalPerformance.warmForUser(user, { immediate: true })` inicia/continua o aquecimento do Portal.
11. O mesmo vídeo já preparado ocupa a tela inteira, com `muted=false` e volume 1.
12. Após `ended`, ocorre fade e o `login.js` segue para a rota normal do usuário.
13. A Home não possui mais implementação de abertura; `js/home.js` voltou a cuidar apenas da Home e preserva o loader legado.

## Falha de preparação

Se o MP4 não puder ser baixado por completo ou decodificado:

- o botão **Entrar permanece desabilitado**;
- a tela de login informa que a abertura ainda está sendo preparada;
- ocorre nova tentativa automática;
- não se autentica/navega para uma abertura incompleta.

Esse bloqueio é intencional e foi solicitado explicitamente pelo usuário.

## Falha excepcional de reprodução após autenticação

Não existe mais botão **“Iniciar abertura com som”**.

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

O Service Worker mantém a versão contratual `20260916-10`, mas seu script foi alterado para incluir `/js/login-opening.js?v=20260917-1` no conjunto de recursos centrais.

Como o próprio script do Service Worker mudou e usa `skipWaiting()` + `clients.claim()`, uma nova instalação atualiza as páginas `/login/` e `/` no cache existente sem exigir mudança do identificador que é protegido por contratos históricos da suíte.

Foi descartada a troca desnecessária da versão do cache após ela provocar falhas em contratos legados sem trazer benefício funcional adicional.

## Laboratório sintético e Playwright

O laboratório `/opening/` foi remodelado para reproduzir o novo fluxo:

- formulário de login fictício;
- botão inicialmente bloqueado até o MP4 estar completamente preparado;
- mesma `js/login-opening.js` usada pelo Portal;
- autenticação fictícia sem dados reais;
- destino sintético `/opening/complete.html` após a abertura;
- mesmo MP4 oficial;
- sem Google Drive, D1, Worker de produção, pacientes, usuários reais ou segredos.

A suíte de navegador cobre desktop e mobile e verifica:

- botão de login só habilita após o MP4 completo estar no cache/preparado;
- nenhum `portalOpeningStartWithSound` é criado;
- vídeo usa Blob local, tela inteira, `muted=false` e volume 1;
- segunda preparação funciona com a rede do MP4 bloqueada, provando reutilização do cache;
- `NotAllowedError` excepcional não cria botão intermediário;
- sem MP4 completo, autenticação não é iniciada.

## Fallback e privacidade

O loader antigo da Home continua preservado. A abertura não adiciona telemetria com identidade, dados clínicos, documentos ou IDs do Drive.

## Relação com a Central de Documentos

A fase oficial continua sendo **Fase 4 — Sincronização segura com Drive, subfase 4D**, no PR #201. A abertura permanece isolada no PR #202 e não altera os critérios da Fase 4.

## Critérios de aceite atualizados

- binário oficial presente e protegido por SHA-256;
- login desabilitado até o vídeo completo estar preparado;
- nenhum botão intermediário para iniciar vídeo/som;
- abertura em tela inteira em desktop e mobile;
- áudio ativo quando o navegador permitir a reprodução preparada pelo gesto de login;
- ~10 s completos e finalização por `ended`;
- fade final;
- aquecimento do Portal em paralelo;
- cache reutilizado em nova autenticação;
- falha de preparação impede Login e tenta novamente;
- falha excepcional de reprodução não perde a autenticação e cai para o fluxo normal;
- Home sem implementação duplicada da abertura;
- testes de contrato e Playwright verdes;
- homologação visual/sonora humana do novo preview antes de retirar o PR #202 de draft.
