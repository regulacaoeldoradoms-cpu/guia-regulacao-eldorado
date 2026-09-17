# Central de Documentos — Status

Última atualização: 17/09/2026

## Fase atual

**Fase 4 — Sincronização segura com Drive**, subfase **4D — homologação real controlada em andamento**. **Fase 0 encerrada**; Fases 1–3 encerradas; 4A–4C concluídas tecnicamente. Não reiniciar fases encerradas.

A Central permanece na branch `codex/central-docs-drive-sync-phase4`, PR #201 aberto e sem merge. Último head observado nesta retomada: `4d64c5df54da096b4e4cb12ed79ac3fa8c97b530`. Há trabalho paralelo; reler branch, PR e evidências antes de retomá-la. Nenhuma alteração dessa branch, escrita no Drive ou conclusão da 4D nesta intervenção.

O incidente Agenda/Firebase está registrado separadamente no draft #206, branch `docs/agenda-firebase-indisponivel-20260917`; não foi resolvido nem alterado aqui.

Base anterior: main `e36ac882e4fec626ba3edcad26a2dbdc6777d3ed`. Correção funcional incorporada pelo **PR #207**, merge **`702471c7b180e31faa8e281ee0fefe04ee759474`**. O histórico detalhado permanece no Git e nos PRs.

## Mudança transversal concluída — Home inicializada durante a abertura

**Última decisão humana:** aproveitar os 10 s do vídeo para inicializar o Portal de fato e não exibir novamente login/loader ao terminar. Preservar Entrar habilitado desde o início, autenticação no primeiro clique, som e ausência de detalhes operacionais ou botão intermediário.

O PR #204 já havia corrigido o bloqueio indevido do botão. Essa correção permanece preservada; não reintroduzir gate na autenticação. O PR #207 trata outro defeito: a Home começava tarde, depois do vídeo.

Branch de desenvolvimento: `fix/opening-home-ready-handoff`, preexistente e vazia na retomada, reaproveitada sem duplicar trabalho. Head final validado: `e5f09ba37da552e3ebc1ded2795f3bb9bef2220e`.

## Diagnóstico e justificativa

`PortalPerformance.warmForUser()` aquece arquivos/rotas, mas não executa os módulos da Home nem monta perfil/feed. Antes da correção, `location.replace` só iniciava a Home ao terminar o vídeo. O fade também retirava a cobertura ainda sobre o login, causando o flash relatado. O diagnóstico veio do código; não foi inspecionada a conexão do usuário.

A solução inicializa a **Home oficial no mesmo documento, atrás da camada opaca do vídeo**, evitando a segunda navegação que perderia o trabalho já feito. Não é um roteador genérico, iframe permanente ou cópia independente do HTML.

## Implementação incorporada

- `js/login-home-transition.js` busca o HTML público da Home somente depois de autenticar e aceita apenas destinos locais de Home.
- Valida marcador/estrutura, caminhos de scripts e CSS permitidos; não executa scripts ou handlers inline da shell importada. Preserva CSP e autorizações dos módulos existentes.
- Com o vídeo cobrindo a tela, monta a `.portal-shell` oficial, retira o formulário, reutiliza autenticação/catálogo/desempenho e executa os módulos reais da Home.
- `PortalHomeReady` confirma configuração social, perfil/feed ou fallback utilizável de Ferramentas. O fade depende desse resultado, CSS/pintura e do evento real `ended`.
- A Home permanece `inert` durante a abertura; recebe interação/foco apenas na revelação. A posição de rolagem mobile é reiniciada sob a cobertura.
- O retorno `{handled:true}` evita `location.replace` no caminho normal: não reinicia a Home já carregada.
- Home lenta mantém o último quadro até prontidão ou prazo finito de 20 s desde o início de sua preparação. Falhas mantêm cobertura opaca até navegação normal, sem fade de volta ao login.
- Segurança, Conselho e demais destinos preservam navegação normal e seus controles. Sem backend, permissões, cache novo de respostas privadas ou telemetria alterados.

Preservados MP4 oficial, cache `portal-opening-media-v1`, som, 10,005 s completos e recuperação legada. Scripts de login, abertura, helper e Home usam `20260917-3`; SW invalida somente versões anteriores relacionadas, sem apagar sessão/documentos/mídia.

Arquivo: `assets/portal-opening-v1.mp4`, 2.393.970 bytes. SHA-256 `98b866963ccf1debbca9d942e647307e8ed4e045c231af17117d150da4c9d766`. Binário inalterado.

## Validação concluída

Local: **184/184 testes Node**, incluindo 11 específicos da abertura; sintaxe válida; bundle sintético gerado e verificado. Testes sociais preservados, com ajustes somente no contrato de versão/marcador do HTML alterado.

CI pré-merge no head `e5f09ba...`:

- Abertura/Home: **32/32 testes de navegador sem retry** (24 existentes + 8 de Home real), run `35271695809`, job `105372390991`.
- Contratos da abertura: 11/11 no mesmo job.
- Central de Documentos navegador: sucesso, run `35271695728`, job `105372390380`.
- Demais workflows GitHub Actions consultados: sucesso.

A suíte nova usa HTML, autenticação e módulos reais com todas as APIs externas interceptadas e dados fictícios. Confirma perfil/feed durante os 10 s, mesmo documento sem segunda navegação, ausência de flash observada frame a frame, Home lenta, erro de credenciais, troca de senha, rolagem inicial e logout.

A primeira rodada teve 24/24 anteriores e 6/8 novos; os outros dois chegaram ao fim da entrada corretamente, mas aguardavam logout porque o fixture bloqueava SW enquanto expunha Push. Corrigido o fixture para simular navegador sem Push, mantendo POST/logout reais com API fictícia. A validação final não comprova desvinculação de uma assinatura Push real. Não houve homologação auditiva no dispositivo do usuário nem navegador local autorizado; os testes de navegador foram executados no CI.

## Publicação confirmada no domínio oficial

PR #207 mesclado em `702471c7b180e31faa8e281ee0fefe04ee759474`.

- GitHub Pages build/deploy: **success**, run `35272153680`.
- Workflow pós-merge da abertura: **success**, run `35272154996`, job `105373903467`, incluindo os testes e a etapa **Confirmar publicação estática em produção sem autenticar**.
- O smoke fez GET público do login e conferiu versões/estado habilitado do botão; os hashes públicos de Home HTML, Home JS, helper, login, abertura, SW e MP4 corresponderam ao commit no domínio `regulacaoeldoradoms.com.br`.

A publicação não foi presumida apenas pelo preview Cloudflare. A verificação pública não autentica nem consulta APIs, dados de pacientes ou Drive; comprova arquivos publicados, não o som ou a rede do dispositivo do usuário.

## Alternativas descartadas, riscos e rollback

Descartados: só prefetch; temporizador fixo como prova de prontidão; iframe seguido de recarga; fade que revela login; novo bloqueio de Entrar; texto operacional; botão de som; remoção de autorização ou do loader de recuperação.

Riscos residuais: rede/backend podem exceder 10 s; áudio pode ser recusado pelo navegador; mudanças nos scripts da Home exigem atualização da lista permitida. O fallback é finito. Não se promete carregar todos os módulos/dados do Portal em 10 s e não se pré-carrega conteúdo clínico em massa.

Rollback por PR: desativar somente o handoff no mesmo documento, preservando login imediato e cobertura opaca até navegação. Não restaurar o botão bloqueado do PR #202.

## Próxima ação exata

A correção da abertura/Home está incorporada e publicada. Uma aba antiga deve recarregar o documento para executar os controladores novos. Não há implementação pendente desta correção; eventual diferença no dispositivo real deve ser tratada a partir de nova evidência.

Para continuar a Central, reconstruir o estado atual da 4D/#201 antes de alterar qualquer coisa. Não mesclar #201 antes de sua homologação nem misturar o incidente #206 nesta entrega.

## Handoff para o próximo chat

**Fase oficial:** 4D, PR #201, independente.  
**Correção concluída:** Home inicializada durante abertura, PR #207.  
**Merge funcional:** `702471c7b180e31faa8e281ee0fefe04ee759474`.  
**Resultado:** `PortalHomeReady` + `ended`, Home no mesmo documento, sem flash/reinicialização no caminho normal; Entrar imediato preservado.  
**Evidências:** 184 Node locais; 32 Playwright pré-merge; Central navegador aprovada; pós-merge `35272154996` aprovado com hashes públicos confirmados.  
**Limites:** sem conta real, medição de áudio no dispositivo ou validação de assinatura Push real.  
**Próximo passo:** retorno do usuário sobre o login atualizado ou retomada da 4D pelo estado real de #201; não reiniciar fases encerradas.  
**Privacidade:** sem dados clínicos, segredos, escrita no Drive ou telemetria nova.
