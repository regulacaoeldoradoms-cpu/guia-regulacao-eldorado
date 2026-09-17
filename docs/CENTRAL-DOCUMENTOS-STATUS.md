# Central de Documentos — Status

Última atualização: 17/09/2026

> Estado autoritativo atual. O histórico detalhado permanece recuperável no Git. O estado técnico completo da Fase 4 está no PR #201 e na branch `codex/central-docs-drive-sync-phase4`.

## Fase atual

**Fase 4 — Sincronização segura com Drive**

Subfase atual: **4D — homologação real iniciada; correções de conflito e proteção de fechamento em andamento**.

Branch da Fase 4: `codex/central-docs-drive-sync-phase4`  
PR da Fase 4: **#201 — aberto, sem merge**  
Head conferido da Fase 4: `a92bbcc40b7c38eb126dbe375c3db31272efde72`  
Base oficial `main`: `336b647300faee2c958475a3b51b6b0522e0dd06`

A **Fase 0** permanece encerrada. As Fases **1, 2 e 3** também permanecem encerradas. As subfases 4A, 4B e 4C estão concluídas tecnicamente. A 4D ainda não está aprovada e o PR #201 não deve ser mesclado antes do fechamento da homologação real controlada.

## Mudança transversal em andamento — abertura pós-login em vídeo

Branch: `feat/post-login-opening-video`  
PR: **#202 — draft, aberto, sem merge**  
Documento de decisão: `docs/PORTAL-ABERTURA-POS-LOGIN-V1.md`

Esta mudança permanece independente da Fase 4 e não altera os critérios do PR #201.

### Arquivo oficial

`assets/portal-opening-v1.mp4`

- MP4 / H.264 + AAC;
- 1280 × 720;
- 24 fps;
- 10,005 s;
- 2.393.970 bytes;
- SHA-256 `98b866963ccf1debbca9d942e647307e8ed4e045c231af17117d150da4c9d766`.

O binário permanece protegido por teste de tamanho + SHA-256.

### Decisão humana mais recente

O usuário esclareceu que a preparação do vídeo é **operacional interno** e não deve aparecer na interface.

Comportamento obrigatório atual:

- o vídeo começa a carregar na própria tela de login;
- o usuário vê o botão normalmente como **Entrar** durante todo o tempo;
- não aparece **“Preparando abertura...”**, aviso equivalente ou indicador operacional no `loginStatus`;
- a autenticação/navegação só prossegue quando o MP4 completo estiver disponível e decodificável;
- depois da autenticação, a abertura começa sem botão intermediário;
- o vídeo mantém som, tela inteira, aproximadamente 10 s completos, cache e aquecimento do Portal.

### Implementação atual — gate silencioso

Arquivo principal: `js/login-opening.js`.

Fluxo:

1. a tela de login solicita preload de `assets/portal-opening-v1.mp4`;
2. `js/login-opening.js` aplica um gate técnico interno enquanto preserva visual/texto **Entrar**;
3. o controlador consulta primeiro `portal-opening-media-v1`;
4. sem cache válido, baixa a resposta completa;
5. o Blob só é aceito com exatamente **2.393.970 bytes**;
6. o `<video>` oculto é preparado até estado reproduzível;
7. somente então o gate interno é retirado;
8. o clique efetivo em **Entrar** prepara a reprodução com áudio no mesmo documento;
9. a autenticação ocorre normalmente;
10. `PortalPerformance.warmForUser(user, { immediate: true })` aquece o Portal em paralelo;
11. o vídeo já preparado ocupa toda a tela, com `muted=false`, volume 1 e `object-fit: cover`;
12. o fluxo normal termina pelo evento real `ended`, aplica fade e só então `login.js` navega para a rota do usuário.

O gate continua tecnicamente retendo a ação até a mídia estar pronta porque liberar o clique antes e aguardar de forma assíncrona poderia consumir a ativação transitória do navegador e reintroduzir bloqueio de áudio. Essa retenção é invisível na apresentação do botão.

### Sem botão ou texto intermediário

O código vigente não cria `portalOpeningStartWithSound`, `portal-opening-sound-gate` nem **“Iniciar abertura com som”**.

A preparação também não publica mensagem operacional de carregamento.

Se o navegador excepcionalmente recusar a reprodução mesmo após a preparação ligada ao gesto de login:

- não aparece segundo botão;
- a camada é removida;
- a autenticação não é perdida;
- a navegação segue para a Home;
- o loader legado continua como fallback seguro.

### Falha de preparação

Se o MP4 não puder ser obtido integralmente ou ficar reproduzível:

- o gate interno permanece ativo;
- visualmente o botão continua **Entrar**;
- não aparece mensagem operacional;
- uma nova tentativa ocorre automaticamente;
- nenhuma autenticação/navegação é iniciada enquanto o vídeo não estiver pronto.

### Cache, CSP e Service Worker

Cache Storage da mídia: `portal-opening-media-v1`.

A cópia pode ser gravada já durante a preparação do login. Nova autenticação prioriza o Blob local e pode funcionar sem nova transferência do MP4.

O staging sintético mantém CSP `media-src 'self' blob:`. Nenhuma origem externa de mídia foi liberada.

O Service Worker preserva a versão contratual `CACHE_VERSION = '20260916-10'` e pré-carrega `/js/login-opening.js?v=20260917-1`. A tentativa anterior de alterar a versão para `20260917-1` foi descartada porque rompeu contratos históricos sem benefício funcional necessário.

### Descoberta no CI e correção

No head anterior `95098e0d29b520fd8af2f666bdea6a8e883b73a7`, todos os workflows do PR ficaram verdes exceto **Validar abertura pós-login — navegador**.

Diagnóstico do log: os 8 cenários falharam antes de executar a lógica do vídeo porque o servidor local de staging tratava `/opening/` como diretório e não resolvia `index.html`; o locator `#loginSubmit` portanto não existia.

Correção aplicada em `testing/browser/serve-staging.mjs`:

- rotas de diretório passam a resolver `<diretório>/index.html`;
- proteção contra path traversal permanece ativa.

O laboratório também foi atualizado para não exibir estado operacional durante a preparação.

### Validação atual

No head funcional `47a7280e8331c6e42be39722e55b53f1ee45b8e4`:

- o workflow dedicado **Validar abertura pós-login — navegador** concluiu com **sucesso**;
- a suíte cobre desktop e mobile;
- o MP4 oficial passa por validação de tamanho e SHA-256 antes do browser test;
- os testes validam gate silencioso, botão apresentado como **Entrar**, ausência de mensagem operacional, tela inteira, áudio ativo, Blob local, reutilização de Cache Storage, ausência de botão extra e bloqueio de autenticação quando a mídia não está disponível;
- os demais workflows já concluídos desse head estavam verdes na última conferência;
- **Validar Central de Documentos — navegador** ainda estava em execução na última conferência e precisa ser checado antes de declarar toda a matriz concluída.

Após essa validação, a documentação de decisão foi atualizada para refletir o gate silencioso. O PR continua draft.

## Decisões e alternativas descartadas

- **Descartado:** botão “Iniciar abertura com som”. Motivo: rejeitado na homologação e adiciona interação não desejada.
- **Descartado:** texto “Preparando abertura...” ou aviso equivalente. Motivo: detalhe operacional que não deve ser exposto ao usuário.
- **Descartado:** aceitar o clique antes de a mídia estar pronta e aguardar depois. Motivo: pode perder a ativação transitória necessária para áudio e recriar o problema de autoplay.
- **Descartado:** tocar somente depois de navegar para a Home. Motivo: navegação pode perder ativação do usuário e reintroduzir autoplay bloqueado.
- **Descartado:** GIF. Motivo: sem áudio, peso/qualidade inferiores.
- **Descartado:** autoplay mudo automático. Motivo: contraria o requisito de som.
- **Descartado:** remover loader legado. Motivo: ele continua sendo a recuperação segura da Home.
- **Descartado:** segundo sistema de prefetch. Motivo: `PortalPerformance` + Service Worker já executam o aquecimento autorizado.
- **Descartado:** mudança desnecessária do identificador histórico do cache do Service Worker.

## Riscos conhecidos

- em navegadores com política muito restritiva, a reprodução com áudio ainda pode ser recusada; nesse caso não há prompt extra e o Portal segue para a Home;
- se a rede/cache não permitir preparar o MP4, a ação de entrada permanece retida silenciosamente até nova tentativa bem-sucedida;
- `object-fit: cover` pode cortar periferia em proporções muito diferentes de 16:9;
- Cache Storage pode estar indisponível; nesse caso a preparação usa a rede;
- o staging Cloudflare é sintético e deve permanecer sem dados reais;
- não mesclar #202 antes de nova homologação humana do fluxo revisado.

## Próxima ação exata

1. confirmar a conclusão de **Validar Central de Documentos — navegador** no head atual;
2. confirmar o deployment Cloudflare atualizado da branch;
3. abrir `https://feat-post-login-opening-vide.portal-regulacao-central-staging.pages.dev/opening/` após o deploy;
4. confirmar visualmente que o botão aparece sempre como **Entrar**, sem “Preparando abertura...” e sem qualquer aviso operacional;
5. clicar **Entrar** e confirmar que a abertura começa imediatamente, sem botão adicional;
6. validar som, ~10 s completos, enquadramento, fade e segunda execução cacheada;
7. após aceite humano explícito, atualizar este status, retirar #202 de draft e só então considerar merge;
8. manter PR #201/Fase 4 independente.

## Handoff para o próximo chat

**Fase oficial:** Fase 4 — Sincronização segura com Drive, subfase 4D, PR #201.  
**Mudança transversal:** abertura pós-login, PR #202.  
**Última decisão humana:** preparação do vídeo deve ser invisível; o usuário vê somente o botão normal **Entrar** e nunca detalhes operacionais.  
**Arquitetura atual:** gate técnico silencioso + preparação integral/cache na página de login + reprodução após autenticação no mesmo documento + navegação depois da abertura/fallback.  
**Último head funcional validado da abertura:** `47a7280e8331c6e42be39722e55b53f1ee45b8e4`; workflow dedicado de navegador verde.  
**Arquivos principais:** `login/index.html`, `js/login-opening.js`, `js/login.js`, `index.html`, `js/home.js`, `portal-sw.js`, `testing/post-login-opening/*`, `testing/browser/post-login-opening.spec.mjs`, `testing/browser/serve-staging.mjs`, `worker/tests/post-login-opening.test.mjs`.  
**PR:** #202 continua draft e sem merge.  
**Pendência:** finalizar matriz do head atual + deploy atualizado + homologação humana do preview.  
**Próximo passo:** testar o preview renovado somente depois da confirmação do CI/deploy; não fazer merge antes do aceite.
