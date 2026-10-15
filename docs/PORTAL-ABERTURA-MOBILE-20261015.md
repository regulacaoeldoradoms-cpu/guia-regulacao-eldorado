# Abertura mobile — candidata de 15/10/2026

Pacote existente retomado na branch `feat/mobile-logo-opening-20261015`, base `429ee55d986825a7d244494a412f357ba189fac6`. Integração e publicação dependem de autorização específica após candidato e CI válidos; recibos do candidato ficam na PR dessa branch. O checkpoint da Missão Bancária não foi alterado.

## Comportamento e cobertura

Após login válido com destino à Home local (`/`, `/home/`, `/index.html`), dispositivos mobile usam fundo preto opaco e logo inteira, parada e centralizada, sem texto visível ou áudio. O Canvas acrescenta somente luz suave na ponte, caminho central e contornos. A composição cabe em retrato e paisagem. O ciclo visual de oito segundos não determina a duração da entrada.

`PortalHomeTransition` inicia a Home oficial sob a cobertura. DOM, módulos e prontidão continuam no controlador existente; a shell fica `inert` até revelar. Assim que a Home está pronta, a luz para e a cobertura desaparece em 420 ms, sem outra navegação ou reinicialização. Movimento reduzido oculta o Canvas e elimina a transição de opacidade (`#portalOpening.portal-mobile-opening{transition:none!important}`).

A seleção combina indicação mobile do navegador, agente do dispositivo e tela física compacta com toque e ponteiro grosso. Uma janela desktop estreita continua usando o vídeo original. No caminho mobile, o dispatcher retorna antes de preparar o MP4; nem a falta do controlador mobile inicia vídeo como substituto.

Sessão já ativa mantém o fluxo existente de `redirectIfAuthenticated`: redirecionamento normal, sem replay da abertura. Foram verificados cache recente e revalidação. Segurança, troca obrigatória de senha, verificação de email, Conselho e outros destinos não foram alterados. A abertura não foi distribuída pelas rotas do Portal.

## Falhas, saída e recursos

- Imagem lenta não é requisito de prontidão. Imagem quebrada usa o ícone estático existente; falha de Canvas desliga apenas os gráficos.
- Falha na Home devolve controle à navegação normal. A cobertura fica opaca até essa navegação, evitando expor login ou shell inerte.
- O limite existente da Home é 20 s; há guarda adicional de 21 s para um `mount` inesperadamente pendente. O fallback não aguarda um ciclo de animação.
- Saída normal, `pagehide` e `portal:session-cleared` encerram RAF, RAF de resize, ResizeObserver, listeners e timers da abertura. O Canvas sai com a cobertura no sucesso; no fallback fica inativo até o documento ser substituído.
- Os testes de recursos verificam atividade antes da saída e contadores zerados depois. A primeira instrumentação confundia um listener interno do AbortSignal da Home com recurso da abertura; a atribuição ao chamador direto corrigiu o teste, sem modificar o controlador da Home.

## Cache, versões e isolamento

HTML e SW referenciam `login-opening.js` e `login-opening-mobile.js` em `20261015-mobile-opening-1`, e WebP em `20261015-1`. O SW mantém `CACHE_VERSION = 20261009-pets-combined-8`, adiciona os recursos mobile e remove pontualmente o controlador desktop antigo. Não amplia limpeza de caches; o cache independente `portal-opening-media-v1` permanece.

WebP: SHA-256 `d1feb699d62030c3046eacf8518279d2a1f40966fa87113bd686f10b973cf6fe`. MP4 preservado: 3.275.007 bytes, SHA-256 `21aae188af40d816ef392380d5ae6b775453571e2c413c31ec0c7b8efb07b489`.

`login.js`, `login-home-transition.js`, `home.js`, Home HTML, Worker, bindings e configurações de infraestrutura permanecem iguais à base. Titon, Telemedicina, Agenda, Canal do Cidadão, tutorial e Missão Bancária não recebem mudanças. PR #660 não foi incorporada. Essa preservação foi conferida pelo diff; não equivale a uma nova homologação funcional de todos esses módulos.

`testing/browser/package-lock.json` foi inspecionado: contém a instalação local do Playwright 1.55.0 já fixado em `package.json`. Não havia lock desse pacote rastreado e os fluxos existentes usam `npm install`. Foi mantido local, fora do commit, sem exclusão ou alteração de política de dependências.

## Validação e evidência

Somente dados fictícios e APIs interceptadas; nenhuma conta real, consulta assistencial ou alteração no backend.

- **37/37 Node**: `node --test worker/tests/mobile-login-opening.test.mjs worker/tests/post-login-opening.test.mjs worker/tests/home-transition-security.test.mjs` (`unit-opening-candidate.log`, log local não versionado).
- **24/24 laboratório do vídeo**: `playwright-opening.config.mjs`, MP4 real em Chrome desktop e emulação Pixel 7 (`browser-desktop-candidate.log`). A emulação mobile desse laboratório valida a manutenção do controlador desktop legado, não a seleção do HTML de produção.
- **24 cenários distintos da Home**: 22 aprovados na execução conjunta (`browser-mobile-candidate.log`); o teste novo de limpeza foi corrigido e passou com recursos ativos antes da saída (`browser-cleanup-final-pass.log`). O novo cancelamento passou em `browser-cleanup-verified.log`. A execução anterior com instrumentação incorreta não é declarada integralmente verde.
- **10/10 combinações de layout do login**: 320/390/1440 px, claro/escuro, escala 100%/200% quando aplicável, teclado, erro sintético e tentativa novamente (`browser-login-layout-candidate.log`).
- **23 arquivos do gate de sintaxe do site** e sintaxe dos controladores, SW, build, verificação e teste mobile aprovados. Bundle estático construído pelo gate do laboratório. Diff sem erros e caminhos protegidos sem alteração.
- Reaproveitados os **25 contratos mobile/PWA** de `unit-mobile-pwa-final.log`, ainda válidos para os arquivos correspondentes. Logs anteriores `browser-home.log` e `browser-mobile-final.log` não representam o estado atual. A correção de movimento reduzido já estava aplicada na retomada.

Capturas inspecionadas da execução real em Chrome com APIs fictícias: [retrato](evidencias/abertura-mobile-20261015/mobile-portrait.png), [paisagem](evidencias/abertura-mobile-20261015/mobile-landscape.png), [mesma Home após revelar](evidencias/abertura-mobile-20261015/mobile-home-ready.png). A Home lenta permaneceu coberta por mais de oito segundos, sem flash, e revelou o mesmo documento após prontidão. A captura da Home é em paisagem e usa perfil administrativo fictício.

Limites: não houve aparelho físico, Safari/iOS, PWA instalado com SW real, aceite visual humano final ou verificação pós-publicação. Os testes de navegador bloqueiam SW; preservação e versionamento dele são cobertos por contratos e diff. `verify-login-publication.mjs` foi atualizado, mas só deve validar esses hashes depois de uma publicação autorizada.

## Continuidade

O pacote e as evidências permanecem preservados no ambiente de trabalho. Detalhes do computador, caminhos absolutos, diagnósticos das ferramentas e registros operacionais são mantidos somente no checkpoint local, fora deste documento público.

Próxima ação: conferir CI da PR no SHA candidato e pedir autorização específica antes de integrar ou publicar. Nenhum deploy foi executado.
