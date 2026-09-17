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

As Fases **0, 1, 2 e 3** permanecem encerradas. As subfases 4A, 4B e 4C estão concluídas tecnicamente. A 4D ainda não está aprovada e o PR #201 não deve ser mesclado antes do fechamento da homologação real controlada.

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
- a suíte passou a validar diretamente o SHA-256 esperado `98b866963ccf1debbca9d942e647307e8ed4e045c231af17117d150da4c9d766` sobre o arquivo versionado;
- commit que adicionou essa validação: `006031e99469ee1ace7a95adf49b89461b024301`;
- documentação atualizada no commit `2147ffbb07d133e1bf5c2f283b89f204bbeb2d39`.

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
- remoção de cache inválido;
- fallback em erro de mídia.

No commit de upload `2ba3533c...`, **22 de 23 workflows já concluíram com sucesso** no momento desta atualização; `Validar carregamento resiliente dos protocolos` ainda estava em fila, sem falha registrada. Uma nova rodada foi disparada pelas alterações de teste/documentação e deve ser consolidada antes da homologação.

## O que foi descartado

- GIF, por peso/qualidade e ausência de áudio;
- autoplay forçado em modo mudo;
- remoção do spinner legado;
- bloquear a Home até o fim do vídeo;
- criar um segundo sistema de prefetch concorrente ao `PortalPerformance`;
- misturar esta alteração no PR #201;
- hospedagem externa improvisada do vídeo.

## Riscos conhecidos

- navegador pode bloquear autoplay com áudio por política própria;
- `object-fit: cover` pode cortar periferia em telas muito diferentes de 16:9;
- Cache Storage pode estar indisponível ou sem quota, devendo cair para rede/fallback;
- pré-carregamento excessivo em rede lenta deve continuar sendo limitado pelo mecanismo atual;
- não mesclar #202 sem validar áudio, enquadramento, duração completa, segunda autenticação usando cache e fallback real.

## Próxima ação exata

1. aguardar/conferir a matriz completa de checks do head atualizado da branch `feat/post-login-opening-video`;
2. confirmar que o novo teste de SHA-256 passa no CI, provando que o binário versionado é exatamente o aprovado;
3. disponibilizar/abrir preview da branch e homologar visual e sonoramente em desktop e mobile;
4. repetir uma segunda autenticação para validar reutilização do cache local;
5. testar o caminho de fallback e, se possível, o cenário em que autoplay com som é bloqueado;
6. somente após aceite humano explícito retirar #202 de draft e considerar merge;
7. manter PR #201/Fase 4 independente durante todo esse processo.

## Handoff

**Fase atual:** Fase 4 — Sincronização segura com Drive, subfase 4D, PR #201.  
**Mudança transversal paralela:** abertura pós-login, PR #202.  
**Última ação concluída:** vídeo oficial incorporado ao repositório; validação criptográfica adicionada; documentação atualizada; duração de ~10 s registrada também como janela de aquecimento do Portal.  
**Branch da abertura:** `feat/post-login-opening-video`.  
**Pendência:** checks finais + homologação visual/sonora/cache/fallback.  
**Próximo passo:** consolidar CI e testar o preview antes de qualquer merge.
