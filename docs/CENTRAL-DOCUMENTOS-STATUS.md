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

## Mudança transversal homologada — abertura pós-login em vídeo

Branch: `feat/post-login-opening-video`  
PR: **#202 — homologado pelo usuário; pronto para sair de draft e ser mesclado**  
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

### Decisão humana final desta mudança

Em 17/09/2026, após a revisão do fluxo revisado, o usuário deu **aceite explícito para implementar** a abertura pós-login.

O comportamento aprovado e agora congelado para esta V1 é:

- o vídeo começa a carregar na própria tela de login;
- o usuário vê o botão normalmente como **Entrar** durante todo o tempo;
- não aparece **“Preparando abertura...”**, aviso equivalente ou indicador operacional no `loginStatus`;
- a autenticação/navegação só prossegue quando o MP4 completo estiver disponível e decodificável;
- depois da autenticação, a abertura começa sem botão intermediário;
- o vídeo mantém som, tela inteira e aproximadamente 10 s completos;
- a conclusão normal depende do evento real `ended`;
- há fade suave ao final;
- Cache Storage é reutilizado nas autenticações seguintes;
- durante a abertura, o Portal continua aquecendo Home, Ferramentas e rotas autorizadas pelo mecanismo já existente.

### Implementação consolidada — gate silencioso

Arquivo principal: `js/login-opening.js`.

Fluxo:

1. a tela de login solicita preload de `assets/portal-opening-v1.mp4`;
2. o próprio `login/index.html` já renderiza o botão como **Entrar**, evitando qualquer flash transitório de texto operacional;
3. `js/login-opening.js` aplica um gate técnico interno enquanto preserva visual/texto **Entrar**;
4. o controlador consulta primeiro `portal-opening-media-v1`;
5. sem cache válido, baixa a resposta completa;
6. o Blob só é aceito com exatamente **2.393.970 bytes**;
7. o `<video>` oculto é preparado até estado reproduzível;
8. somente então o gate interno é retirado;
9. o clique efetivo em **Entrar** prepara a reprodução com áudio no mesmo documento;
10. a autenticação ocorre normalmente;
11. `PortalPerformance.warmForUser(user, { immediate: true })` aquece o Portal em paralelo;
12. o vídeo já preparado ocupa toda a tela, com `muted=false`, volume 1 e `object-fit: cover`;
13. o fluxo normal termina pelo evento real `ended`, aplica fade e só então `login.js` navega para a rota do usuário.

O gate retém a ação até a mídia estar pronta porque aceitar o clique antes e aguardar posteriormente pode consumir a ativação transitória do navegador e reintroduzir bloqueio de áudio. Essa retenção é invisível ao usuário.

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

No head anterior `95098e0d29b520fd8af2f666bdea6a8e883b73a7`, o workflow dedicado de abertura falhou antes de executar a lógica funcional porque o servidor local de staging tratava `/opening/` como diretório e não resolvia `index.html`; o locator `#loginSubmit` portanto não existia.

Correção aplicada em `testing/browser/serve-staging.mjs`:

- rotas de diretório passam a resolver `<diretório>/index.html`;
- proteção contra path traversal permanece ativa.

O laboratório também foi atualizado para não expor estado operacional durante a preparação.

### Validação técnica final antes do merge

Head atual conferido do PR #202: `22309dfa2f8b49cc675c240cd6f3f1e382d4c289`.

Resultados:

- **todos os workflows GitHub Actions associados ao head concluíram com `success`**;
- **Validar abertura pós-login — navegador:** sucesso;
- Playwright da abertura: **8/8 cenários aprovados** em Chrome desktop e mobile;
- **Validar Central de Documentos — navegador:** sucesso;
- suíte de contrato/sintaxe e demais módulos: verdes;
- o MP4 oficial passou por validação de tamanho e SHA-256 antes dos testes de navegador;
- a suíte comprova gate silencioso, botão apresentado como **Entrar**, ausência de mensagem operacional, tela inteira, áudio ativo, Blob local, reutilização de Cache Storage, ausência de botão extra e nenhuma autenticação quando a mídia está indisponível.

### Cloudflare Pages

O GitHub App da Cloudflare confirmou deployment do head `22309df` com **sucesso**.

Preview imutável do deployment: `https://04cd2383.portal-regulacao-central-staging.pages.dev`  
Branch preview: `https://feat-post-login-opening-vide.portal-regulacao-central-staging.pages.dev`  
Laboratório de homologação: `https://feat-post-login-opening-vide.portal-regulacao-central-staging.pages.dev/opening/`

O mesmo conjunto de checks pode registrar falha ao tentar criar **Worker Preview** de `yellow-wave-d0a1guia-regulacao-ia`, porque a conta não possui acesso a Worker Previews. Isso é **não bloqueante para esta mudança**: o Pages staging foi publicado com sucesso, o laboratório não usa o Worker de produção e nenhum código de Worker é necessário para a abertura.

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
- o check de Worker Preview continua não relacionado e não deve ser confundido com a validação do Pages staging.

## Próxima ação exata

1. retirar o PR #202 de draft;
2. mesclar o PR #202 em `main`, preservando o head homologado;
3. conferir o novo SHA de `main` e o deployment pós-merge;
4. registrar em `docs/CENTRAL-DOCUMENTOS-STATUS.md` que a mudança transversal foi incorporada à `main`;
5. encerrar esta mudança transversal e retomar como trabalho prioritário a **Fase 4 / subfase 4D** no PR #201.

## Handoff para o próximo chat

**Fase oficial:** Fase 4 — Sincronização segura com Drive, subfase 4D, PR #201.  
**Mudança transversal:** abertura pós-login, PR #202, **homologada e autorizada para merge**.  
**Última decisão humana:** usuário deu aceite explícito para implementar a abertura revisada; preparação do vídeo permanece invisível e a interface mostra somente **Entrar**.  
**Arquitetura final:** gate técnico silencioso + preparação integral/cache na página de login + reprodução após autenticação no mesmo documento + navegação depois da abertura/fallback.  
**Head atual do PR:** `22309dfa2f8b49cc675c240cd6f3f1e382d4c289`.  
**Validação:** GitHub Actions integralmente verde; abertura Playwright 8/8; Central navegador verde; Cloudflare Pages staging publicado com sucesso.  
**Bloqueio externo não relacionado:** Worker Preview indisponível na conta Cloudflare; não afeta o Pages staging nem a abertura.  
**Próximo passo:** retirar #202 de draft, fazer merge, registrar o SHA final de `main` e então retornar à Fase 4D do PR #201.
