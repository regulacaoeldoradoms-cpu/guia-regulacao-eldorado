# Portal — Abertura pós-login V1

Atualização: 17/09/2026 — correção da regressão de acesso após PR #202/#203.

## Requisito vigente

O vídeo oficial mantém som, aproximadamente 10 segundos completos, tela inteira, cache e fade. A preparação começa silenciosamente na tela de login. **Entrar deve aceitar o primeiro clique imediatamente; somente a transição aguarda o vídeo.**

O bloqueio do botão durante a preparação foi uma interpretação incorreta da implementação anterior, não uma decisão do usuário. O relato posterior à publicação rejeitou explicitamente esse bloqueio. Esta revisão substitui as descrições anteriores de "gate silencioso" no botão.

## Arquivo oficial preservado

`assets/portal-opening-v1.mp4`: MP4/H.264 + AAC, 1280 × 720, 24 fps, 10,005 segundos, 2.393.970 bytes.

SHA-256: `98b866963ccf1debbca9d942e647307e8ed4e045c231af17117d150da4c9d766`.

O binário não foi modificado. O teste calcula tamanho e hash reais.

## Fluxo corrigido

1. HTML inicial contém botão **Entrar habilitado**, sem `disabled`, `aria-disabled` ou estilo para disfarçar bloqueio.
2. `js/login-opening.js` prepara a mídia independentemente; não modifica botão, credenciais, permissões nem `RegulationAuth.login`.
3. Um clique, toque ou Enter no formulário inicia a autenticação imediatamente. Submits duplicados durante a mesma tentativa são ignorados.
4. Após o clique existe apenas o feedback normal **Entrando...**, não informação sobre a operação do vídeo.
5. Credenciais incorretas são informadas imediatamente, sem esperar a mídia, e permitem nova tentativa.
6. Com autenticação válida, o aquecimento autorizado do Portal começa e `login.js` chama `PortalLoginOpening.beforeNavigate()` antes de navegar.
7. Enquanto a mídia completa ainda é preparada, a página de login permanece visível. O clique não é perdido e não precisa ser repetido.
8. Só com o Blob completo e o elemento reproduzível a abertura ocupa a tela; após o evento real `ended`, há fade de 450 ms e a navegação segue para o destino normal do usuário.

A troca obrigatória de senha, verificação de e-mail e destinos existentes permanecem preservados. Uma resposta tardia de `me()` não pode atropelar uma tentativa de login já iniciada.

## Preparação e cache

O controlador consulta primeiro `portal-opening-media-v1`. Cópia de tamanho inválido ou não decodificável é removida e a rede é tentada. A cópia nova só é persistida depois de a mídia ficar reproduzível. Indisponibilidade do Cache Storage não é falha de autenticação e a rede continua disponível.

O download exige resposta completa, rejeita `206` e valida os 2.393.970 bytes. A URL de reprodução é `blob:`; MIME `application/octet-stream` do host é normalizado para `video/mp4` sem alterar os bytes. Nenhuma mídia externa é usada.

## Prazos e fallback

A preparação tem prazo total de **20 segundos a partir de seu início**, incluindo cache, cabeçalhos, corpo completo e decodificação. Esse prazo não acrescenta espera quando o vídeo já está pronto. Uma falha confirmada libera a transição sem esperar o prazo terminar. Não existe repetição infinita.

Se a mídia falhar ou o prazo expirar, não se abre uma superfície de vídeo incompleta: o login válido segue para o Portal com o loader legado. Se `play()` rejeitar ou nunca resolver, a reprodução também tem saída finita, de no máximo 20 segundos, sem perder a autenticação. A duração normal não é controlada por esse prazo: depende de `ended` e preserva os 10 segundos oficiais.

O fallback também funciona quando o JavaScript opcional da abertura não carregar.

## Som e restrições reais

Quando o vídeo já estiver pronto, o submit real prepara o mesmo elemento dentro do gesto do usuário. O início visível usa `muted=false`, `defaultMuted=false`, volume 1 e `playsinline`.

Pré-carregamento não elimina políticas de autoplay. No caso de clique antes de a mídia estar pronta, a reprodução posterior pode ser recusada por alguns navegadores/configurações. Não será criado botão adicional nem será exigido novo clique: aplica-se o fallback legado. Não se promete áudio universal nem se muda silenciosamente para abertura muda.

## Invalidação da correção

HTML e precache referenciam `login-opening.js?v=20260917-2` e `login.js?v=20260917-2`. O Service Worker remove especificamente as duas URLs antigas dos controladores do cache estático e renova `/login/` pelo fluxo existente com `cache: reload`.

O namespace geral `20260916-10` e o cache independente do MP4 são preservados. Não foi necessário invalidar documentos, sessão ou os demais recursos do Portal. Uma aba já aberta ainda executa o documento antigo até ser recarregada.

## Validação e publicação

Testes locais: **182/182** da suíte completa de Node; **9/9** específicos da abertura, incluindo execução de `login.js` em VM com mídia pendente, erro de credenciais e destino seguro. Bundle sintético de staging gerado e validado.

A suíte Playwright foi ampliada para 12 cenários em desktop/mobile (24 execuções): clique imediato com download retido por 6 s, 10 s reais de reprodução, cache sem rede, 404, MP4 incompleto, senha incorreta/retry, teclado, bloqueio de áudio, play pendente, rede travada, controlador ausente e Cache Storage indisponível. Resultado do CI ainda pendente nesta revisão.

Após o merge, o workflow verifica publicamente `/login/`, os dois controladores, Service Worker e MP4 por GET e hash no domínio oficial. **Deploy do Cloudflare Pages sintético não equivale a publicação do frontend oficial.** A verificação pública não autentica e não acessa APIs, pacientes, Drive ou segredos.

## Escopo e rollback

Correção isolada em `fix/login-opening-transition-only`, baseada em main `3dc193c34d5f0f02c0a50b2f51ba2e29e022f77f`. Fase 4D/PR #201 não é alterada. Não há nova telemetria nem mudança de regras de autenticação.

Em regressão visual, remover a chamada opcional `beforeNavigate` e a referência ao controlador da abertura por PR corretivo, mantendo o HTML habilitado e o login normal. Não reverter para o bloqueio de botão do PR #202.
