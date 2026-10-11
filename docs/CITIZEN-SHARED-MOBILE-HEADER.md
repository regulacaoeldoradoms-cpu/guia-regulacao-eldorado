# Cabeçalho mobile compartilhado

Escopo: Home, Amigos, Perfil e Mascotes, a partir do main `f89bd97e` aprovado no aparelho pelo usuário. Sem mudança em permissões, conteúdo, barra inferior, runtime dos mascotes ou política de cache.

O diagnóstico sintético reproduziu a desmontagem do menu Conta pela Home ao trocar de área: Amigos e Mascotes passavam de 57 para 145 px de cabeçalho e ficavam sem Conta; Perfil criava um segundo apresentador de conta. Estilos nativos também mudavam a largura disponível para o título. O print Library `libfile_71f867652d6481919ea1798d2a6e4603` não pôde ser inspecionado: o helper suportado falhou no download para destino local; não houve transferência alternativa.

`citizen-mobile-header` agora mantém um único controlador, menu e controles nativos de conta nas quatro áreas. Os apresentadores de Home e Perfil ficam responsáveis pelo conteúdo de suas áreas. Selecionar um link em Conta fecha o menu e mantém o foco em um controle visível até a chegada da área; o link de Perfil é verificado a partir das quatro áreas, inclusive quando Perfil já está ativo. O cabeçalho usa logo, texto exato **Portal da regulação** e **Conta**, com geometria consistente, estilos isolados, controles originais e restauração do desktop/impressão. As chaves versionadas atualizadas pertencem aos assets afetados e seus chamadores.

Validação local: 12 cenários claros/escuros e 108 estados de rota (320/390/900/1440 px, incluindo texto sintético a 200% em 320/390); preservação de identidade do documento/cabeçalho/menu/controlador/barra/logout, endereço `/`, Conta/Escape e ausência de sobreposição. Comparação de 18 estados nativos desktop com o main anterior passou. Passaram também 21 cenários/371 verificações de navegação persistente, 2 cenários/44 verificações de Perfil e 6 cenários de preservação desktop/impressão contra `ac89d0fb`. Fixtures isoladas, sem dados reais ou endpoints clínicos.

O workflow cidadão inclui o novo teste focado. Gates CI, integração e deploy do SHA precisam ser confirmados antes de declarar publicação. A aceitação no aparelho dos PR631/632 não equivale à validação desta correção no aparelho.

## Extensão às áreas de conta e Canal do Cidadão

Solicitação posterior ao PR633: aplicar o mesmo cabeçalho mobile também em `/configuracoes/`, `/seguranca/`, `/conquistas/`, `/ferramentas/` e `/cidadao/`, totalizando nove áreas. Reutiliza o mesmo controlador e os controles nativos. Mantida a política de URL existente: áreas principais em `/` e áreas secundárias em suas rotas, com o mesmo documento retido nas trocas. Não adiciona Ferramentas à barra inferior nem atalho em Perfil.

O teste `shared-account-header.mjs` usa os acessos existentes em Conta (Canal do Cidadão via Ferramentas), com entradas diretas nas cinco rotas. Passaram 48 cenários e 288 estados de navegação em claro/escuro, 320/390 px e texto sintético a 200%: repetição das trocas, Escape, geometria/identidade do cabeçalho, rascunhos de Home/Configurações/Segurança e rolagem. Não envia preferências nem senha. O gate geral amplia somente as superfícies mobile autorizadas, conserva os contratos dos controles/formulários e compara desktop/impressão sem mudar limites de pixels. Assets afetados recebem chaves específicas; runtime global de cache permanece intacto.

A apresentação e o carregamento do Canal do Cidadão estão documentados em `CITIZEN-MOBILE-PANEL.md`. Fixtures isoladas não comprovam aceitação em aparelho real. Publicação exige CI completo e confirmação do deploy do SHA integrado.
