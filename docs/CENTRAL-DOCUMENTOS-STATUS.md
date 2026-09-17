# Central de Documentos — Status

Última atualização: 17/09/2026

## Fase atual

**Fase 4 — Sincronização segura com Drive**, subfase **4D — homologação real controlada em andamento**. **Fase 0 encerrada**; Fases 1–3 encerradas; 4A–4C concluídas tecnicamente. Não reiniciar fases encerradas.

Branch da Central: `codex/central-docs-drive-sync-phase4`. **PR #201 aberto e sem merge**, último head observado: `9f295ca2766b890285b912b7ab714adeb63d2bc7`. Há trabalho paralelo nessa branch; reler PR, status e testes antes de retomá-la. Ela não foi alterada pelo hotfix abaixo.

Base anterior da intervenção: main `3dc193c34d5f0f02c0a50b2f51ba2e29e022f77f`. Main funcional após a correção: `8cefaf639a9399f77658867ef10f82a0fb694222` (merge #204). O histórico completo das decisões permanece no Git e nos PRs #202–#204.

## Correção concluída — botão Entrar e abertura

**PR #204 mesclado em main**, branch `fix/login-opening-transition-only`. Commit funcional: `22397c8c1162cc726695d980e4ca449c1e4d4166`; head final validado antes do merge: `44ab1357d8fe89c21c6cf7e1d3bf7622975c7861`.

**Última decisão humana:** aceitar o primeiro clique e autenticar normalmente; aguardar somente a transição enquanto o vídeo carrega em segundo plano. Sem texto operacional e sem botão intermediário para iniciar som/vídeo.

**Correção de interpretação:** o bloqueio antecipado do botão, implementado em #202, não era uma escolha do usuário. A descrição anterior de bloqueio "aprovado" estava incorreta. A regressão foi reaberta para correção, não para reiniciar fases do projeto.

## Diagnóstico e implementação

O HTML continha `disabled`; `setSubmitPreparing()` e retries infinitos mantinham o bloqueio. Aparência habilitada não tornava Entrar clicável. O prazo do fetch também terminava antes da leitura completa do corpo e `play()` podia ficar pendente fora da proteção temporal. Não se presume a causa específica de rede/decodificação no dispositivo do usuário, que não foi inspecionado.

A solução separa autenticação de mídia:

- **Entrar habilitado desde o HTML inicial**; clique, toque ou Enter inicia a autenticação imediatamente.
- Somente envios duplicados durante uma tentativa já iniciada são bloqueados; feedback normal **Entrando...** depois do clique.
- Credenciais incorretas são informadas sem esperar o vídeo e permitem nova tentativa.
- `js/login-opening.js` não modifica botão, credenciais ou `RegulationAuth.login`.
- Após autenticar, `warmForUser()` aquece recursos autorizados e somente `beforeNavigate()` espera o vídeo, mantendo o documento de login enquanto a mídia é preparada.
- O clique é preservado: com a mídia pronta, a abertura começa e a navegação continua automaticamente depois de `ended` e fade.
- Preparação com prazo total de 20 s desde o início, cobrindo cache, cabeçalhos, corpo completo e decodificação. Falha conhecida usa fallback de imediato, sem repetição infinita.
- Falha de mídia/controlador ou recusa de áudio não perde autenticação e segue pelo loader legado. Reprodução com `play()` pendente também tem prazo finito de 20 s; o término normal permanece pelo evento `ended`.
- Troca de senha, verificação de e-mail, destinos e permissões existentes preservados. Resposta tardia de `me()` não atropela tentativa já iniciada.

## Mídia e atualização de cache

Mesmo vídeo oficial `assets/portal-opening-v1.mp4`: 10,005 s, som, 1280 × 720, H.264/AAC, 24 fps, **2.393.970 bytes**. SHA-256 `98b866963ccf1debbca9d942e647307e8ed4e045c231af17117d150da4c9d766`. Nenhum byte do MP4 foi alterado.

Cache independente `portal-opening-media-v1`; somente mídia completa e reproduzível é persistida. Cache inválido é removido e a rede é tentada. Cache indisponível não bloqueia login.

HTML/precache usam `login-opening.js?v=20260917-2` e `login.js?v=20260917-2`. O Service Worker remove especificamente as URLs antigas dos controladores e renova `/login/`, preservando cache da mídia e demais recursos. Uma aba já aberta precisa recarregar o documento para executar o código novo.

## Validação concluída

**Local:** 182/182 testes Node da suíte completa; 9/9 específicos da abertura; sintaxe válida e bundle sintético de staging verificado.

**Pré-merge no head exato 44ab135...:** todos os workflows GitHub Actions consultados aprovados. Abertura: **24/24 casos Playwright, sem retry**, run `35262044619`, job `105339916247`. Central de Documentos navegador: sucesso, run `35262044644`, job `105339916360`.

Cobertura principal: clique durante download retido por 6 s, autenticação imediata e única, permanência na página até mídia pronta, 10 s reais por `ended`, teclado, senha incorreta/retry, cache sem rede, 404, MP4 incompleto, Cache Storage indisponível, controlador ausente, rede e `play()` pendentes.

O primeiro check de governança falhou somente porque a condensação documental retirou o marcador literal `Fase 0`; ele foi restaurado sem alterar a fase nem enfraquecer o check, e a revisão final passou.

## Publicação verificada no domínio oficial

Merge #204: **`8cefaf639a9399f77658867ef10f82a0fb694222`**.

Workflow pós-merge **`35262579705`**, job **`105341702943`**, concluído com **success**, incluindo contratos, testes de navegador e a etapa **Confirmar publicação estática em produção sem autenticar**.

Essa etapa executou `scripts/verify-login-publication.mjs`: GET público em `regulacaoeldoradoms.com.br/login/` confirmou HTML com Entrar habilitado e versões novas; os hashes públicos de `js/login.js`, `js/login-opening.js`, `portal-sw.js` e MP4 conferiram com o commit. Portanto a publicação não foi inferida apenas do preview Pages sintético.

O teste não autenticou usuário real nem consultou API, Drive, D1, dados clínicos ou segredos. Ele confirma publicação estática, não equivale a ouvir o som no computador do usuário.

## Decisões descartadas, riscos e rollback

Descartados: botão desabilitado disfarçado de habilitado; descartar o primeiro clique; retries/espera infinitos; botão adicional de som; texto "Preparando abertura..."; GIF; abertura automaticamente muda; remoção do loader legado. Mantidos MP4 oficial, prefetch existente e controles de acesso.

Riscos residuais: políticas restritivas de autoplay podem recusar som mesmo com mídia pronta, especialmente após clique precoce; aplica-se fallback sem segundo botão. `cover` mantém o corte periférico em outras proporções. Cache/rede podem falhar, mas agora possuem saída finita e não impedem a autenticação.

Rollback seguro, se necessário: retirar apenas a chamada opcional da abertura e sua referência por PR corretivo, mantendo botão habilitado e autenticação. Nunca restaurar o bloqueio do PR #202.

## Próxima ação exata

A correção solicitada está publicada e verificada. Na aba antiga bloqueada, recarregar a página para obter o novo documento. Não há nova etapa de implementação da abertura pendente; eventuais diferenças no navegador real devem ser tratadas a partir de evidências novas.

Retomar Fase 4D somente pela leitura atual de #201 e da branch correspondente; não fazer merge da Central antes de sua homologação real controlada.

## Handoff para o próximo chat

**Fase oficial:** Fase 4 / 4D, PR #201, independente.  
**Correção encerrada:** PR #204, bloqueio indevido de Entrar.  
**Merge funcional:** `8cefaf639a9399f77658867ef10f82a0fb694222`.  
**Resultado:** primeiro clique autentica; somente transição espera mídia; sem texto operacional; prazos finitos e fallback.  
**Evidências:** 182 testes Node locais, 24 casos Playwright no PR, Central navegador aprovada, workflow pós-merge `35262579705` com publicação pública validada por hash.  
**Pendência do dispositivo:** aba antiga precisa recarregar; não houve acesso ao computador ou à conta real do usuário.  
**Próximo passo:** acompanhar eventual retorno do usuário; para continuar a Central, reconstruir o estado atual da 4D/#201 sem reiniciar fases.  
**Privacidade:** sem dados sensíveis, autenticação real, escrita no Drive ou nova telemetria.
