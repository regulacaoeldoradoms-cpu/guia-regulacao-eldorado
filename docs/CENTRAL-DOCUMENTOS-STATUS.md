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

### Mudança de arquitetura aprovada em homologação

A homologação humana mostrou que a implementação anterior podia apresentar **“Iniciar abertura com som”** por política de autoplay do navegador. O usuário rejeitou explicitamente esse botão e definiu novo comportamento obrigatório:

- o vídeo deve começar a carregar **ainda na tela de login**;
- o botão **Entrar não pode ser liberado até o vídeo completo estar preparado em segundo plano**;
- depois de autenticar, a abertura deve iniciar sem botão intermediário;
- a abertura deve manter som, 10 s completos, tela inteira, cache e aquecimento do Portal.

A abertura foi movida da Home para o próprio fluxo de login.

### Implementação atual

Novo arquivo: `js/login-opening.js`.

Fluxo:

1. `login/index.html` solicita preload do MP4 e inicia o botão **Entrar** desabilitado como **“Preparando abertura...”**.
2. `js/login-opening.js` procura o MP4 em `portal-opening-media-v1`; sem cache válido, baixa a resposta completa.
3. O Blob só é aceito se tiver exatamente **2.393.970 bytes**.
4. O vídeo oculto é carregado até estado reproduzível.
5. Somente depois o botão **Entrar** é habilitado.
6. O gesto do próprio Login prepara o elemento de mídia para reprodução com áudio, sem reproduzir uma prévia audível.
7. A autenticação real acontece normalmente.
8. Após autenticação válida, `PortalPerformance.warmForUser(user, { immediate: true })` continua o aquecimento do Portal.
9. O vídeo já preparado ocupa a tela inteira na própria página de login, com `muted=false` e volume 1.
10. O fluxo normal termina pelo evento real `ended`, aplica fade e só então o `login.js` navega para a rota do usuário.

`index.html` não dispara mais abertura por referrer e `js/home.js` teve toda a implementação antiga de abertura/gate de áudio removida. O loader tradicional da Home foi preservado.

### Sem botão intermediário

O código novo não cria `portalOpeningStartWithSound`, `portal-opening-sound-gate` nem o texto **“Iniciar abertura com som”**.

Se o navegador, excepcionalmente, ainda bloquear a reprodução mesmo após a preparação ligada ao gesto de login:

- não aparece segundo botão;
- a camada é removida;
- a autenticação não é perdida;
- a navegação segue para a Home;
- o loader legado continua sendo o fallback seguro.

### Falha de preparação

Se o MP4 não puder ser obtido integralmente ou ficar reproduzível:

- **Entrar permanece desabilitado**;
- o usuário recebe mensagem de que a abertura ainda está sendo preparada;
- uma nova tentativa ocorre automaticamente;
- nenhuma autenticação é iniciada enquanto o vídeo não estiver pronto.

Esse bloqueio é intencional e corresponde ao requisito explícito aprovado pelo usuário.

### Cache e CSP

Cache Storage: `portal-opening-media-v1`.

A cópia pode ser gravada já durante a preparação do login. A segunda autenticação prioriza o Blob local e pode funcionar sem nova transferência do MP4.

O staging sintético mantém CSP `media-src 'self' blob:`. Nenhuma origem externa de mídia foi aberta.

### Service Worker

Foi mantida a versão contratual `CACHE_VERSION = '20260916-10'` para não quebrar contratos históricos da suíte.

O próprio `portal-sw.js` foi alterado para pré-cachear `/js/login-opening.js?v=20260917-1`. Como o script do Service Worker mudou e já usa `skipWaiting()` + `clients.claim()`, a instalação nova atualiza `/login/` e `/` no cache existente sem exigir troca do identificador histórico.

Uma tentativa de elevar `CACHE_VERSION` para `20260917-1` foi descartada depois de revelar três falhas de contrato legado que não representavam problema funcional. A versão foi restaurada, preservando a atualização do precache.

### Laboratório e testes

O laboratório sintético `/opening/` agora reproduz um login fictício, sem Drive, D1, pacientes, usuários reais ou segredos.

Cobertura automatizada atualizada:

- Login começa desabilitado;
- MP4 completo é exigido antes de habilitar Entrar;
- tamanho/hash oficial continuam protegidos;
- nenhum botão adicional de som existe;
- vídeo usa tela inteira, Blob local, `muted=false` e volume 1;
- segunda preparação usa Cache Storage mesmo com rede do MP4 bloqueada;
- `NotAllowedError` excepcional não cria botão intermediário;
- MP4 indisponível mantém Login bloqueado e impede chamada de autenticação;
- Home não contém mais a implementação antiga da abertura.

A matriz de CI do novo fluxo está sendo consolidada no head atual. O PR #202 deve permanecer draft até a matriz ficar verde e o novo preview ser homologado pelo usuário.

## Decisões e alternativas descartadas

- **Descartado:** botão “Iniciar abertura com som”. Motivo: rejeitado na homologação e adiciona interação não desejada.
- **Descartado:** tocar somente depois de navegar para a Home. Motivo: navegação pode perder ativação do usuário e reintroduzir autoplay bloqueado.
- **Descartado:** liberar Login antes de terminar o download. Motivo: pode abrir a superfície de vídeo sem mídia pronta.
- **Descartado:** GIF. Motivo: sem áudio, peso/qualidade inferiores.
- **Descartado:** autoplay mudo automático. Motivo: contraria o requisito de som.
- **Descartado:** remover loader legado. Motivo: ele continua sendo a recuperação segura da Home.
- **Descartado:** segundo sistema de prefetch. Motivo: `PortalPerformance` + Service Worker já executam o aquecimento autorizado.
- **Descartado:** mudança desnecessária do identificador histórico do cache do Service Worker.

## Riscos conhecidos

- em navegadores com política muito restritiva, a reprodução com áudio ainda pode ser recusada; nesse caso não há prompt extra e o Portal segue para a Home;
- se o MP4 não puder ser preparado, Login permanece bloqueado por decisão funcional aprovada;
- `object-fit: cover` pode cortar periferia em proporções muito diferentes de 16:9;
- Cache Storage pode estar indisponível; nesse caso a preparação usa a rede;
- o staging Cloudflare é sintético e deve permanecer sem dados reais;
- não mesclar #202 antes de nova homologação humana do fluxo revisado.

## Próxima ação exata

1. consolidar a matriz de CI do head atual e corrigir qualquer regressão real;
2. confirmar o deployment Cloudflare atualizado da branch;
3. abrir `https://feat-post-login-opening-vide.portal-regulacao-central-staging.pages.dev/opening/` após o novo deploy;
4. conferir que **Preparando abertura...** aparece antes de Entrar quando necessário;
5. confirmar que **Entrar só habilita depois do vídeo pronto**;
6. clicar Entrar e confirmar que o vídeo começa sem qualquer botão adicional;
7. validar som, 10 s completos, enquadramento, fade e segunda execução cacheada;
8. após aceite humano explícito, atualizar este status, retirar #202 de draft e só então considerar merge;
9. manter PR #201/Fase 4 independente.

## Handoff para o próximo chat

**Fase oficial:** Fase 4 — Sincronização segura com Drive, subfase 4D, PR #201.  
**Mudança transversal:** abertura pós-login, PR #202.  
**Última decisão humana:** remover completamente o botão “Iniciar abertura com som” e impedir Login enquanto o MP4 não estiver totalmente preparado.  
**Arquitetura atual:** preparação integral + cache na página de login; reprodução após autenticação ainda no mesmo documento; navegação somente depois da abertura/fallback.  
**Arquivos principais:** `login/index.html`, `js/login-opening.js`, `js/login.js`, `index.html`, `js/home.js`, `portal-sw.js`, `testing/post-login-opening/*`, `testing/browser/post-login-opening.spec.mjs`, `worker/tests/post-login-opening.test.mjs`.  
**PR:** #202 continua draft e sem merge.  
**Pendência:** CI final + deploy atualizado + homologação humana do novo fluxo.  
**Próximo passo:** testar o preview renovado somente depois de CI/deploy confirmados; não fazer merge antes do aceite.
