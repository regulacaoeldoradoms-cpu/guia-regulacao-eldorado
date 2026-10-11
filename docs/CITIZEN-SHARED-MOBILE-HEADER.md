# Cabeçalho mobile compartilhado

Escopo: Home, Amigos, Perfil e Mascotes, a partir do main `f89bd97e` aprovado no aparelho pelo usuário. Sem mudança em permissões, conteúdo, barra inferior, runtime dos mascotes ou política de cache.

O diagnóstico sintético reproduziu a desmontagem do menu Conta pela Home ao trocar de área: Amigos e Mascotes passavam de 57 para 145 px de cabeçalho e ficavam sem Conta; Perfil criava um segundo apresentador de conta. Estilos nativos também mudavam a largura disponível para o título. O print Library `libfile_71f867652d6481919ea1798d2a6e4603` não pôde ser inspecionado: o helper suportado falhou no download para destino local; não houve transferência alternativa.

`citizen-mobile-header` agora mantém um único controlador, menu e controles nativos de conta nas quatro áreas. Os apresentadores de Home e Perfil ficam responsáveis pelo conteúdo de suas áreas. O cabeçalho usa logo, texto exato **Portal da regulação** e **Conta**, com geometria consistente, estilos isolados, controles originais e restauração do desktop/impressão. As chaves versionadas atualizadas pertencem aos assets afetados e seus chamadores.

Validação local: 12 cenários claros/escuros e 108 estados de rota (320/390/900/1440 px, incluindo texto sintético a 200% em 320/390); preservação de identidade do documento/cabeçalho/menu/controlador/barra/logout, endereço `/`, Conta/Escape e ausência de sobreposição. Comparação de 18 estados nativos desktop com o main anterior passou. Passaram também 21 cenários/371 verificações de navegação persistente, 2 cenários/44 verificações de Perfil e 6 cenários de preservação desktop/impressão contra `ac89d0fb`. Fixtures isoladas, sem dados reais ou endpoints clínicos.

O workflow cidadão inclui o novo teste focado. Gates CI, integração e deploy do SHA precisam ser confirmados antes de declarar publicação. A aceitação no aparelho dos PR631/632 não equivale à validação desta correção no aparelho.
