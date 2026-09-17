# Central de Documentos — Status

Última atualização: 17/09/2026

> Estado autoritativo atual. O histórico detalhado permanece recuperável no Git. O estado técnico completo da Fase 4 está no PR #201 e na branch `codex/central-docs-drive-sync-phase4`.

## Fase atual

**Fase 4 — Sincronização segura com Drive**

Subfase atual: **4D — homologação real iniciada; correções de conflito e proteção de fechamento em andamento**.

Branch da Fase 4: `codex/central-docs-drive-sync-phase4`  
PR da Fase 4: **#201 — aberto, sem merge**  
Head conferido da Fase 4: `a92bbcc40b7c38eb126dbe375c3db31272efde72`  
Base oficial `main`: `f28a1d4d88bb16dd71bf61231ceb6830580c058d`

A **Fase 0** permanece encerrada. As Fases **1, 2 e 3** também permanecem encerradas. As subfases 4A, 4B e 4C estão concluídas tecnicamente. A 4D ainda não está aprovada e o PR #201 não deve ser mesclado antes do fechamento da homologação real controlada.

## Mudança transversal concluída — abertura pós-login em vídeo

Branch de desenvolvimento: `feat/post-login-opening-video`  
PR: **#202 — homologado e mesclado em `main`**  
Merge commit: `f28a1d4d88bb16dd71bf61231ceb6830580c058d`  
Documento de decisão: `docs/PORTAL-ABERTURA-POS-LOGIN-V1.md`

Esta mudança foi encerrada como melhoria transversal do Portal e não altera os critérios do PR #201/Fase 4.

### Arquivo oficial

`assets/portal-opening-v1.mp4`

- MP4 / H.264 + AAC;
- 1280 × 720;
- 24 fps;
- 10,005 s;
- 2.393.970 bytes;
- SHA-256 `98b866963ccf1debbca9d942e647307e8ed4e045c231af17117d150da4c9d766`.

O binário permanece protegido por teste de tamanho + SHA-256.

### Decisão humana final

Em 17/09/2026 o usuário deu **aceite explícito para implementação** após a revisão do fluxo final.

Comportamento final aprovado:

- o vídeo começa a carregar na própria tela de login;
- o usuário vê somente o botão normal **Entrar**;
- não aparece **“Preparando abertura...”**, aviso equivalente ou detalhe operacional no `loginStatus`;
- a autenticação/navegação só prossegue quando o MP4 completo estiver disponível e decodificável;
- depois da autenticação, a abertura começa no mesmo documento, sem botão intermediário;
- som ativo, tela inteira e aproximadamente 10 s completos;
- término normal pelo evento real `ended`;
- fade suave ao final;
- reutilização do Cache Storage nas autenticações seguintes;
- durante a abertura, o Portal continua aquecendo Home, Ferramentas e rotas autorizadas pelo mecanismo existente.

### Arquitetura implementada

Arquivo principal: `js/login-opening.js`.

Fluxo consolidado:

1. `login/index.html` inicia o preload do MP4;
2. o próprio HTML inicial já mostra **Entrar**, evitando flash de texto operacional;
3. `js/login-opening.js` mantém um gate técnico interno sem alterar a aparência do botão;
4. o controlador consulta primeiro `portal-opening-media-v1`;
5. sem cache válido, baixa o MP4 integralmente;
6. o Blob só é aceito com exatamente **2.393.970 bytes**;
7. o `<video>` oculto é carregado até estado reproduzível;
8. somente então o gate interno é retirado;
9. o clique efetivo em **Entrar** prepara a reprodução com áudio no mesmo documento;
10. a autenticação ocorre normalmente;
11. `PortalPerformance.warmForUser(user, { immediate: true })` aquece o Portal em paralelo;
12. o vídeo ocupa toda a tela, com `muted=false`, volume 1 e `object-fit: cover`;
13. após `ended`, ocorre fade e só então `login.js` navega para a rota do usuário.

A retenção interna antes de o vídeo estar pronto é deliberada: aceitar o clique cedo e aguardar depois poderia consumir a ativação transitória do navegador e reintroduzir bloqueio de áudio. Esse mecanismo permanece invisível ao usuário.

### Fallbacks e falhas

Não existe `portalOpeningStartWithSound`, `portal-opening-sound-gate` nem botão **“Iniciar abertura com som”**.

Se o navegador excepcionalmente recusar a reprodução após autenticação:

- nenhum segundo botão é exibido;
- a camada de abertura é retirada;
- a autenticação não é perdida;
- o fluxo segue para a Home;
- o loader legado permanece como fallback seguro.

Se o MP4 não puder ser preparado integralmente:

- o gate interno permanece ativo;
- visualmente o botão continua **Entrar**;
- não aparece mensagem operacional;
- ocorre nova tentativa automática;
- nenhuma autenticação/navegação inicia enquanto a mídia não estiver pronta.

### Cache, CSP e Service Worker

Cache Storage da mídia: `portal-opening-media-v1`.

A cópia pode ser gravada já durante a preparação na tela de login. Autenticações seguintes priorizam o Blob local.

A CSP necessária para o fluxo cacheado permanece restrita a `media-src 'self' blob:`; nenhuma origem externa de mídia foi liberada.

O Service Worker mantém `CACHE_VERSION = '20260916-10'` e pré-carrega `/js/login-opening.js?v=20260917-1`. A alternativa de alterar a versão histórica do cache foi descartada porque rompeu contratos legados sem trazer benefício funcional necessário.

### Correção descoberta durante o CI

O workflow de abertura chegou a falhar porque o servidor local do laboratório não resolvia `/opening/` para `/opening/index.html`.

Correção aplicada em `testing/browser/serve-staging.mjs`:

- diretórios passam a resolver `index.html`;
- proteção contra path traversal permanece ativa.

Essa correção foi validada também pela suíte de navegador da Central de Documentos, sem regressão.

### Validação pré-merge

Head homologado antes do merge: `4a6593a3194055395161c339d8ec9b08ee2e5421`.

Resultados relevantes:

- todos os workflows GitHub Actions associados ao head concluíram com `success`;
- **Validar abertura pós-login — navegador:** sucesso;
- Playwright da abertura: **8/8 cenários aprovados** em Chrome desktop e mobile;
- **Validar Central de Documentos — navegador:** sucesso;
- integridade do MP4 validada por tamanho e SHA-256;
- Cloudflare Pages staging publicado com sucesso.

### Merge e validação pós-merge

O PR #202 foi retirado de draft e mesclado em `main` em 17/09/2026.

Merge commit oficial:

`f28a1d4d88bb16dd71bf61231ceb6830580c058d`

Após o merge:

- `main` passou a apontar para `f28a1d4...`;
- os checks pós-merge concluíram sem falhas detectadas;
- Cloudflare Pages concluiu o deployment do commit `f28a1d4` com **sucesso**;
- o build do Worker também concluiu com **sucesso** nesta execução pós-merge.

Deployment Pages associado ao merge:

`https://756e5e79.portal-regulacao-central-staging.pages.dev`

## Decisões e alternativas descartadas

- **Descartado:** botão “Iniciar abertura com som”. Motivo: adiciona interação não desejada e foi rejeitado na homologação.
- **Descartado:** texto “Preparando abertura...” ou equivalente. Motivo: detalhe operacional que não deve ser exposto ao usuário.
- **Descartado:** aceitar o clique antes de a mídia estar pronta e aguardar depois. Motivo: risco de perder a ativação transitória necessária ao áudio.
- **Descartado:** tocar somente depois de navegar para a Home. Motivo: navegação pode reintroduzir bloqueio de autoplay com som.
- **Descartado:** GIF. Motivo: ausência de áudio e pior relação peso/qualidade.
- **Descartado:** autoplay mudo automático. Motivo: contraria o requisito aprovado de som.
- **Descartado:** remover loader legado. Motivo: ele continua sendo a recuperação segura da Home.
- **Descartado:** segundo sistema de prefetch. Motivo: `PortalPerformance` + Service Worker já executam o aquecimento autorizado.
- **Descartado:** mudança desnecessária do identificador histórico do cache do Service Worker.

## Riscos residuais

- navegadores com política excepcionalmente restritiva ainda podem recusar áudio; nesse caso o Portal segue sem prompt adicional;
- se a rede/cache não permitir preparar o MP4, a entrada fica retida silenciosamente até nova tentativa bem-sucedida;
- `object-fit: cover` pode cortar periferia em proporções muito diferentes de 16:9;
- Cache Storage pode estar indisponível; nesse caso a preparação usa a rede.

Esses riscos possuem fallback definido e não bloqueiam o encerramento da V1.

## Próxima ação exata

1. considerar a mudança transversal da abertura **encerrada**;
2. não reabrir o PR #202 nem voltar a tratar essa tarefa como fase ativa salvo nova decisão explícita;
3. retomar o trabalho prioritário da **Fase 4 — subfase 4D**, branch `codex/central-docs-drive-sync-phase4`, PR #201;
4. antes de qualquer nova alteração da Central, reconstruir o estado real do PR #201, branch, testes e pendências de homologação;
5. manter a abertura pós-login apenas como funcionalidade já incorporada à `main`.

## Handoff para o próximo chat

**Fase oficial:** Fase 4 — Sincronização segura com Drive, subfase 4D, PR #201.  
**Mudança transversal concluída:** abertura pós-login em vídeo, PR #202, mesclada em `main`.  
**Merge commit:** `f28a1d4d88bb16dd71bf61231ceb6830580c058d`.  
**Resultado:** vídeo oficial de ~10 s com som, gate silencioso no login, cache local, fade, fallback legado e aquecimento do Portal em paralelo.  
**Validação:** Playwright 8/8 desktop/mobile; checks pré-merge verdes; checks pós-merge sem falhas; Cloudflare Pages pós-merge com sucesso.  
**Decisões descartadas:** botão de som, texto operacional, GIF, autoplay mudo, remoção do loader legado e segundo prefetch independente.  
**Riscos residuais:** política extrema de autoplay, falha de rede/cache e corte periférico por `cover`, todos com comportamento de fallback definido.  
**Próximo passo:** reconstruir o estado atual da Fase 4D/PR #201 e continuar exatamente de sua pendência real, sem reiniciar fases encerradas.
