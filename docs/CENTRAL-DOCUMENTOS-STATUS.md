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

Esta mudança é independente da Fase 4 e não altera os critérios do PR #201.

Branch: `feat/post-login-opening-video`  
PR: **#202 — draft, aberto, sem merge**  
Documento de decisão: `docs/PORTAL-ABERTURA-POS-LOGIN-V1.md`

### Estado real atual

- o vídeo aprovado pelo usuário está fisicamente versionado em `assets/portal-opening-v1.mp4`;
- upload realizado no commit `2ba3533c3e14606e0ba7a2c285bfec142de30aaf`;
- blob Git: `6ab3032978f4a7e8c667e72edd691c5e4d3decc8`;
- tamanho confirmado pelo GitHub: **2.393.970 bytes**;
- a suíte valida diretamente o SHA-256 esperado `98b866963ccf1debbca9d942e647307e8ed4e045c231af17117d150da4c9d766` sobre o arquivo versionado;
- a Home continua usando o mesmo `js/home.js` real para a abertura e o mesmo mecanismo de aquecimento existente do Portal.

### Decisão funcional consolidada

- `assets/portal-opening-v1.mp4` é o **arquivo oficial da abertura pós-login**;
- reproduzir os aproximadamente **10 segundos completos**, com som;
- tela inteira, `object-fit: cover` e fade suave ao terminar;
- loader antigo permanece como fallback;
- Home continua carregando em paralelo por baixo da abertura;
- Cache Storage versionado mantém o vídeo localmente após a primeira reprodução concluída;
- se autoplay com som for bloqueado pelo navegador, exibir **“Iniciar abertura com som”**; não trocar automaticamente para vídeo mudo;
- a abertura termina pelo evento real `ended`, sem cronômetro que corte o vídeo.

### Janela de aquecimento de ~10 s

O usuário confirmou que a duração de aproximadamente 10 s é desejável também porque oferece tempo útil para pré-carregar mais componentes do Portal.

A decisão técnica é **reutilizar o mecanismo de performance já existente**, e não criar um segundo pré-carregador paralelo:

- `PortalPerformance.warmForUser()` já é acionado no login;
- Home, Ferramentas e rotas autorizadas do perfil são aquecidas pelo Service Worker;
- a Home social, autenticação e demais assets continuam inicializando durante o vídeo;
- conexões restritas/Save-Data continuam respeitando as regras atuais de contenção;
- o Portal não prolonga artificialmente a espera após o fim do vídeo apenas para concluir aquecimento.

Justificativa: os 10 s funcionam como **orçamento útil de carregamento em segundo plano**, mascarando parte da latência sem bloquear a aplicação nem duplicar requisições.

### Descoberta e correção de CSP do cache

Ao revisar especificamente a segunda execução, foi identificado que o caminho cacheado cria uma URL `blob:` com `URL.createObjectURL(blob)`. A CSP anterior da Home não declarava `media-src`, então `default-src 'self'` poderia bloquear o Blob e tornar o cache inutilizável na prática.

Correção aplicada:
- `index.html` agora declara `media-src 'self' blob:`;
- nenhuma origem externa de mídia foi liberada;
- o teste de contrato passou a exigir essa diretiva e o uso do Blob local;
- a política do staging sintético recebeu a mesma diretiva.

Alternativa descartada: abrir exceção ampla de mídia/CDN. Não é necessária; same-origin + Blob local é suficiente.

### Laboratório sintético e Playwright

Foi criado um laboratório isolado em `testing/post-login-opening/`, incorporado ao bundle de staging em `/opening/`.

Características:
- usa o mesmo `js/home.js` e o mesmo MP4 oficial;
- sessão e loader são totalmente fictícios;
- não usa Google Drive, D1, Worker de produção, usuários reais, dados clínicos ou segredos;
- `testing/browser/post-login-opening.spec.mjs` valida Chromium desktop e mobile;
- workflow dedicado: `.github/workflows/validate-post-login-opening-browser.yml`.

Cobertura de navegador:
- duração real próxima de 10,005 s;
- camada ocupando todo o viewport;
- áudio não mutado e volume 1;
- Cache Storage populado e segunda abertura usando URL `blob:` mesmo com a rede do MP4 bloqueada;
- gesto **Iniciar abertura com som** quando `NotAllowedError` é simulado;
- falha de mídia removendo a abertura e devolvendo a interface ao loader legado.

### Testes e checks

Cobertura de `worker/tests/post-login-opening.test.mjs` protege:
- binário oficial por tamanho + SHA-256;
- detecção de navegação pós-login;
- loader legado preservado;
- tela cheia;
- áudio obrigatório e ausência de fallback silencioso;
- bloqueio de autoplay com gesto explícito;
- finalização por `ended`;
- Cache Storage versionado;
- CSP compatível com Blob local;
- remoção de cache inválido;
- fallback em erro de mídia.

A rodada anterior mostrou 22/23 workflows verdes e revelou apenas um contrato literal de governança (`Fase 0`/handoff), já corrigido. As alterações posteriores de CSP e laboratório dispararam nova matriz, que precisa ficar integralmente verde antes da homologação humana.

## O que foi descartado

- GIF, por peso/qualidade e ausência de áudio;
- autoplay forçado em modo mudo;
- remoção do spinner legado;
- bloquear a Home até o fim do vídeo;
- criar um segundo sistema de prefetch concorrente ao `PortalPerformance`;
- liberar mídia externa na CSP;
- misturar esta alteração no PR #201;
- hospedagem externa improvisada do vídeo.

## Riscos conhecidos

- navegador pode bloquear autoplay com áudio por política própria;
- `object-fit: cover` pode cortar periferia em telas muito diferentes de 16:9;
- Cache Storage pode estar indisponível ou sem quota, devendo cair para rede/fallback;
- pré-carregamento excessivo em rede lenta deve continuar sendo limitado pelo mecanismo atual;
- o staging Cloudflare é sintético e deve continuar sem dados reais;
- não mesclar #202 sem validar áudio, enquadramento, duração completa, segunda abertura cacheada e fallback real.

## Próxima ação exata

1. aguardar/conferir a matriz completa de checks do head atualizado da branch `feat/post-login-opening-video`;
2. corrigir qualquer falha real do novo Playwright da abertura e repetir até ficar verde;
3. confirmar deployment Cloudflare do bundle sintético;
4. abrir `/opening/` no preview da branch e homologar visual e sonoramente em desktop e mobile;
5. repetir a abertura para confirmar o cache local;
6. testar o caminho de fallback e, se possível, o bloqueio real de autoplay com som;
7. somente após aceite humano explícito retirar #202 de draft e considerar merge;
8. manter PR #201/Fase 4 independente durante todo esse processo.

## Handoff para o próximo chat

**Fase atual:** Fase 4 — Sincronização segura com Drive, subfase 4D, PR #201.  
**Mudança transversal paralela:** abertura pós-login, PR #202.  
**Última ação concluída:** vídeo oficial incorporado; integridade criptográfica protegida; CSP corrigida para o Blob cacheado; laboratório sintético `/opening/` e Playwright desktop/mobile adicionados.  
**Branch da abertura:** `feat/post-login-opening-video`.  
**Pendência:** CI do novo laboratório + homologação visual/sonora/cache/fallback.  
**Risco principal atual:** autoplay com som depende da política do navegador; cache depende de `media-src 'self' blob:` já corrigido.  
**Próximo passo:** consolidar a matriz do head atual e, ficando verde, testar o preview `/opening/` antes de qualquer merge.
