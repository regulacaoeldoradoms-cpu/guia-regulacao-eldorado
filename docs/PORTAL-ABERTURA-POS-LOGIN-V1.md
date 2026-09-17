# Portal — Abertura pós-login V1

Atualização: 17/09/2026 — regressão de acesso corrigida e publicada pelo PR #204.

## Requisito vigente

O vídeo oficial mantém som, aproximadamente 10 segundos completos, tela inteira, cache e fade. A preparação começa silenciosamente na tela de login. **Entrar aceita o primeiro clique imediatamente; somente a transição aguarda o vídeo.**

O bloqueio do botão durante a preparação foi uma interpretação incorreta da implementação anterior, não uma decisão do usuário. Esta revisão substitui as descrições anteriores de "gate silencioso" no botão. O relato posterior à publicação motivou o hotfix.

## Arquivo oficial preservado

`assets/portal-opening-v1.mp4`: MP4/H.264 + AAC, 1280 × 720, 24 fps, 10,005 segundos, 2.393.970 bytes.

SHA-256: `98b866963ccf1debbca9d942e647307e8ed4e045c231af17117d150da4c9d766`. O binário não foi modificado; os testes calculam tamanho e hash reais.

## Fluxo corrigido

1. HTML inicial contém **Entrar habilitado**, sem `disabled`, `aria-disabled` ou estilo que disfarce bloqueio.
2. `js/login-opening.js` prepara a mídia de forma independente, sem modificar botão, credenciais, permissões ou `RegulationAuth.login`.
3. Clique, toque ou Enter inicia a autenticação imediatamente. Submits duplicados durante a mesma tentativa são ignorados. Depois do clique existe apenas o feedback normal **Entrando...**.
4. Credenciais incorretas são informadas sem esperar a mídia, permitindo nova tentativa.
5. Com autenticação válida, o aquecimento autorizado começa e `login.js` chama `PortalLoginOpening.beforeNavigate()` antes de navegar.
6. Enquanto a mídia é preparada, a página de login permanece visível. O primeiro clique não é perdido e não precisa ser repetido.
7. Somente com o Blob completo e o elemento reproduzível a abertura ocupa a tela. Após o evento real `ended`, há fade de 450 ms e navegação para o destino normal do usuário.

Troca obrigatória de senha, verificação de e-mail e destinos existentes permanecem preservados. Uma resposta tardia de `me()` não pode atropelar uma tentativa de login já iniciada.

## Preparação e cache

Cache `portal-opening-media-v1` consultado primeiro. Cópia de tamanho inválido ou não decodificável é removida e a rede é tentada. Nova cópia só é persistida após mídia reproduzível. Falha de Cache Storage não é falha de autenticação.

O download exige resposta completa, rejeita `206` e valida 2.393.970 bytes. A reprodução usa `blob:`. MIME `application/octet-stream` é normalizado para `video/mp4` sem alterar os bytes. Nenhuma mídia externa é usada.

## Prazos e fallback

Prazo total de preparação: **20 segundos a partir de seu início**, incluindo cache, cabeçalhos, corpo completo e decodificação. Não acrescenta espera quando o vídeo já está pronto. Falha confirmada aplica fallback imediatamente; não há repetição infinita.

Se a mídia falhar ou o prazo expirar, não se abre vídeo incompleto: o login válido segue para o Portal com loader legado. `play()` rejeitado ou pendente também possui saída finita de 20 segundos. A duração normal permanece controlada por `ended`, preservando os 10 segundos oficiais.

A ausência do controlador opcional da abertura não desabilita o login nem impede a navegação válida.

## Som e limites

Com vídeo já pronto, o submit real prepara o mesmo elemento dentro do gesto do usuário. O início visível usa `muted=false`, `defaultMuted=false`, volume 1 e `playsinline`.

Pré-carregamento não elimina políticas de autoplay. Após clique anterior à mídia pronta, alguns navegadores/configurações podem recusar reprodução com áudio. Nesse caso aplica-se fallback, sem segundo botão, novo clique obrigatório ou abertura silenciosamente muda. Não se promete áudio universal.

## Atualização de cache

HTML e precache usam `login-opening.js?v=20260917-2` e `login.js?v=20260917-2`. O SW remove especificamente as duas URLs antigas dos controladores do cache estático e renova `/login/` pelo fluxo existente com `cache: reload`.

Namespace geral `20260916-10`, mídia, documentos e sessão preservados. Uma aba já aberta executa o documento antigo até ser recarregada.

## Validação e publicação concluídas

PR #204, head testado `44ab1357d8fe89c21c6cf7e1d3bf7622975c7861`; merge `8cefaf639a9399f77658867ef10f82a0fb694222`.

- 182/182 testes Node locais; 9/9 específicos incluindo execução do login em VM.
- 24/24 Playwright sem retry no PR: run `35262044619`, job `105339916247`.
- Teste compartilhado da Central aprovado: run `35262044644`.
- Pós-merge aprovado: run `35262579705`, job `105341702943`, incluindo browser e verificação de publicação estática no domínio oficial.

Cobertura: download retido por 6 s com primeiro clique aceito, 10 s reais de reprodução, cache sem rede, 404, mídia incompleta, erro de credenciais/retry, teclado, recusa de áudio, play/rede pendentes, controlador ausente e cache bloqueado.

`verify-login-publication.mjs` confirmou por GET público o HTML habilitado e as versões dos scripts em `regulacaoeldoradoms.com.br/login/`; comparou hashes dos dois controladores, Service Worker e MP4 com o commit. Essa evidência é distinta do deploy do Pages sintético. Não houve autenticação real, acesso a APIs, Drive, pacientes ou segredos, nem homologação auditiva no dispositivo do usuário.

## Escopo, alternativas e rollback

Fase 4D/PR #201 não foi alterada. Não há nova telemetria nem mudança de regras de autenticação.

Descartados bloqueio do botão, cliques ignorados, espera infinita, botão adicional de som, texto operacional, GIF e abertura automaticamente muda. Mantidos vídeo oficial, loader legado e prefetch autorizado existente.

Rollback seguro: remover somente chamada opcional `beforeNavigate` e referência ao controlador da abertura por PR corretivo, mantendo HTML habilitado e login normal. Não reverter para o bloqueio do PR #202.
