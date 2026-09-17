# Central de Documentos — Status

Última atualização: 17/09/2026

## Fase atual

**Fase 4 — Sincronização segura com Drive.** Subfase **4D — homologação real controlada em andamento**. Fases 0–3 encerradas; 4A–4C concluídas tecnicamente. Não reiniciar fases encerradas.

Branch da Central: `codex/central-docs-drive-sync-phase4`. PR **#201 aberto, sem merge**; último head observado na consulta de PRs: `954dc620a4cf008703c5dd847e984aff2e99c3f9`. A branch está sendo atualizada em paralelo e deve ser relida antes de retomá-la. Seus critérios de aceite não são alterados por esta correção.

Main conferida para esta intervenção: `3dc193c34d5f0f02c0a50b2f51ba2e29e022f77f`. PR #202 integrou a abertura no merge `f28a1d4d88bb16dd71bf61231ceb6830580c058d`; PR #203 registrou a conclusão anterior.

## Prioridade imediata — regressão no botão Entrar

O usuário relatou após a publicação que **Entrar permanece bloqueado**, esclarecendo novamente que queria aguardar somente o redirecionamento enquanto o vídeo carrega.

**Correção de interpretação:** o bloqueio antecipado da autenticação e do botão não é uma escolha do usuário. A descrição anterior de bloqueio "aprovado" estava incorreta e é substituída por este registro. A abertura é reaberta exclusivamente para corrigir esta regressão comprovada, sem reiniciar o projeto.

Branch da correção: `fix/login-opening-transition-only`, criada da main conferida. PR corretivo: ainda a abrir nesta revisão.

Documento técnico vigente: `docs/PORTAL-ABERTURA-POS-LOGIN-V1.md`.

## Diagnóstico e justificativas

O HTML inicial continha `disabled` e o controlador chamava `setSubmitPreparing()` durante preparação e retries infinitos. Estilizar o botão como habilitado não o tornava clicável. Além disso, o prazo do fetch era encerrado antes da leitura completa do corpo e `play()` podia ficar pendente fora da proteção temporal.

A correção separa as responsabilidades: **autenticação imediatamente no clique; somente `beforeNavigate()` espera a mídia**. O controlador visual não substitui mais `RegulationAuth.login` nem escreve no botão. O erro exato de rede/decodificação do dispositivo do usuário não foi inspecionado; não se presume uma causa específica para esse dispositivo.

## Implementação da correção

- HTML real e laboratório começam com **Entrar habilitado**, sem gate escondido.
- Um clique/toque/Enter inicia a autenticação sem aguardar o MP4; tentativas simultâneas duplicadas são evitadas apenas após o submit.
- Feedback normal **Entrando...** depois do clique, sem texto operacional sobre abertura.
- Credenciais incorretas são tratadas de imediato e permitem tentar novamente.
- Depois de autenticar, o Portal é aquecido e a navegação espera o resultado da preparação na página de login, sem perder o clique.
- Preparação completa/decodificação com prazo total de 20 s a partir do início; falha conhecida aplica fallback imediatamente. Sem retry infinito.
- Vídeo oficial preservado: 10,005 s, som, tela inteira, término real por `ended`, fade e cache `portal-opening-media-v1`.
- Falha/indisponibilidade de mídia ou do controlador não invalida autenticação; usa navegação normal e loader legado. `play()` pendente também tem prazo finito.
- Scripts versionados `20260917-2`; Service Worker invalida apenas as URLs antigas de login e renova `/login/`, preservando o cache do MP4 e demais recursos.
- Resposta tardia da checagem automática de sessão não atropela o login já iniciado.

Arquivo oficial: `assets/portal-opening-v1.mp4`, **2.393.970 bytes**; SHA-256 `98b866963ccf1debbca9d942e647307e8ed4e045c231af17117d150da4c9d766`. Nenhuma alteração no binário.

## Evidências e pendências de validação

**Concluído localmente:** 182/182 testes Node da suíte completa; 9/9 testes específicos incluindo execução do login em VM; sintaxe dos controladores válida; bundle sintético de staging gerado e varrido sem referência a dados/APIs proibidos.

**A executar no CI:** Playwright ampliado para 24 execuções desktop/mobile, incluindo o primeiro clique durante download artificialmente retido por 6 segundos, duração real de 10 s, cache, teclado, falhas de mídia, senha incorreta, JavaScript ausente e prazos finitos. Não há navegador instalado nesta execução local; não declarar browser aprovado antes do CI.

**Publicação pendente:** após merge, verificar por GET público o HTML de login e hashes dos JS, Service Worker e MP4 no domínio oficial. Foi incluído `scripts/verify-login-publication.mjs` no workflow pós-merge. Nenhuma autenticação real ou consulta de API ocorre nesse teste. Pages staging sintético não comprova publicação no domínio oficial.

## Decisões e alternativas descartadas

Descartados o botão desabilitado com aparência normal, descartar cliques precoces e espera infinita: contradizem o requisito e impedem o acesso. Descartados também o botão adicional de som, texto "Preparando abertura...", GIF, vídeo automaticamente mudo e remoção do loader legado.

Mantidos o mesmo MP4, reprodução no documento do login, prefetch existente e escopos de autorização. Não se altera Drive, Worker, D1, cargo ou política de dados. Aumentar o namespace de todos os caches é desnecessário para esta correção: a invalidação pontual dos controladores e as novas URLs tratam a atualização sem apagar a mídia.

## Riscos e rollback

Políticas restritivas de autoplay ainda podem recusar som, sobretudo se o clique ocorreu antes de a mídia ficar pronta. Nesse caso não se inventa segundo botão nem se mantém o usuário preso: segue o fallback. Cache indisponível usa rede; mídia ausente/incompleta não é reproduzida; `cover` mantém o risco conhecido de corte periférico.

A aba já aberta pode executar código antigo até recarregar. O teste público pós-merge deve confirmar publicação; teste sintético não equivale a ouvir áudio no computador do usuário.

Rollback seguro: retirar somente a chamada opcional da abertura/referência ao controlador por PR corretivo, preservando botão habilitado e autenticação. Não restaurar o bloqueio anterior.

## Próxima ação exata

Abrir PR da branch corretiva, validar CI no head exato e revisar diff restrito. Com os testes verdes, concluir a correção solicitada, verificar publicação no domínio oficial sem dados reais e registrar os SHAs/resultados. Depois retomar a Fase 4D somente a partir do estado atualizado de #201.

## Handoff para o próximo chat

**Fase oficial:** Fase 4 / 4D, PR #201, não alterada.  
**Prioridade atual:** hotfix do botão Entrar após PR #202/#203.  
**Base:** main `3dc193c34d5f0f02c0a50b2f51ba2e29e022f77f`.  
**Branch:** `fix/login-opening-transition-only`; PR a abrir.  
**Última decisão humana:** aceitar clique/autenticar normalmente; aguardar somente a transição enquanto a mídia carrega, sem detalhes operacionais.  
**Última ação concluída:** implementação local e 182 testes Node aprovados; browser/CI e publicação ainda não confirmados.  
**Fontes principais:** `js/login.js`, `js/login-opening.js`, `login/index.html`, `portal-sw.js`, testes de abertura, `scripts/verify-login-publication.mjs`, documento de abertura V1.  
**Próximo passo:** conferir PR/CI da correção, corrigir regressões se existirem e publicar de forma verificável.  
**Privacidade:** sem usuários reais, conteúdo clínico, Drive, segredos ou nova telemetria.
