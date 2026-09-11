# Camada Social V1 — visão de produto e navegação

Decisão permanente atualizada em 11/09/2026.

## Estado

A Camada Social deixou de ser somente roadmap. Perfil, amizade, feed textual,
comentários, curtida, notificações, descoberta protegida, moderação, navegação global
e a rota `/ferramentas/` estão implementados.

A ativação passou a ser efetiva em produção em 08/09/2026:

- `SOCIAL_BACKEND_ENABLED=true` libera APIs, schema e superfícies sociais;
- `SOCIAL_HOME_ENABLED=true` faz da raiz `/` a Home social para todas as contas
  autenticadas e ativas.

Ferramentas permanece como fallback operacional independente. Se a API social falhar,
a participação social estiver suspensa ou a Home for deliberadamente desativada, `/`
volta ao catálogo de trabalho sem perder dados sociais nem interromper os módulos
profissionais.

## Princípio de produto

A experiência recupera a ideia de pertencimento, perfil pessoal e amizades da
internet social clássica com linguagem visual original do Portal. Não copia nome,
marca, composição, assets, textos ou código do Orkut.

A V1 combina convivência digital com acesso rápido ao trabalho. A camada social pode
ser pessoal e expressiva, enquanto cargo profissional, autenticação e dados
assistenciais permanecem institucionais e separados.

## Home e Ferramentas

Quando a Home está ativa, `/` usa composição responsiva:

- identidade e atalhos sociais;
- feed cronológico e compositor no centro;
- atalhos autorizados de trabalho com quantidade configurável pelo usuário entre 1 e
  o total efetivamente disponível para seu perfil; o padrão é até cinco atalhos;
- o botão `Ver todas as Ferramentas` fica oculto quando todos os módulos autorizados
  já estiverem visíveis na própria Home;
- contexto de privacidade e separação entre social e assistencial.

No desktop largo, a área útil da Home social é aproximadamente 10% maior para reduzir
espaços laterais vazios e ampliar cards, tipografia, controles e atalhos. Essa ampliação
não altera a lógica visual da barra global nem o modo mobile, que mantêm suas
dimensões e regras próprias. Segurança, Configurações e Conquistas também fazem
parte dessa navegação global.

`/ferramentas/` reutiliza o mesmo `PortalTools` usado pelo fallback da raiz. A matriz
de cards não é duplicada entre as duas páginas. A API social não é necessária para
renderizar ou abrir uma ferramenta autorizada.

Ferramentas permanece em primeiro nível na navegação desktop e na barra inferior
mobile. Se configuração, perfil ou feed falhar, a raiz volta para o catálogo de
Ferramentas com aviso curto; Telemedicina, Guia, Recepção e demais módulos continuam
seguindo suas autorizações próprias.

## Navegação global implantada

No desktop, a navegação global oferece Início, Amigos, Ferramentas, Notificações e
Perfil. Na **Home**, Segurança, Configurações e Conquistas saem da barra horizontal e
passam para o bloco vertical esquerdo abaixo da identidade; o espaço liberado recebe
a busca social de usuários. Nas demais rotas, Segurança, Configurações e Conquistas
continuam na barra global para preservar acesso direto.

No mobile, os destinos existentes permanecem em uma barra horizontal rolável; o
painel de Notificações aparece como Avisos. O catálogo de Ferramentas continua
variando conforme cargo e permissões.

`Notificações` no desktop e `Avisos` no mobile funcionam como controles de abertura,
não como navegação direta. Ao acioná-los, o Portal abre na própria tela um painel com
as notificações sociais recentes, preservando o contador de não lidas, a ação de
marcar como lidas, estado vazio e rolagem interna quando necessário. Clicar fora ou
pressionar `Esc` fecha o painel. No mobile, o mesmo conteúdo aparece como painel
amplo acima da barra inferior, respeitando safe areas.

A rota `/notificacoes/` continua existindo como histórico completo e fallback. Ela é
oferecida como ação secundária `Ver histórico completo` dentro do painel, sem obrigar
o usuário a abandonar a tela atual apenas para consultar notificações recentes.

Não existe item independente `Conta` na navegação global. A antiga página
monolítica foi redistribuída: `Perfil` aponta para `/perfil/`, `Segurança` para
`/seguranca/`, `Configurações` para `/configuracoes/` e `Conquistas` para
`/conquistas/`. A área de foto/nome no cabeçalho também abre o próprio Perfil.
A rota `/conta/` permanece somente como redirecionamento de compatibilidade para
URLs antigas.

O chat flutuante continua atendendo os cargos profissionais por autorização de
cargo, sem depender de amizade. Para cidadãos, ele passa a listar somente outros
cidadãos com amizade aceita e permite conversa social apenas enquanto esse vínculo
permanecer ativo. Não existe chat social cidadão↔profissional. Notificações sociais
usam rota e tabela próprias; avisos do Conselho continuam no Canal do Cidadão.

## Home social universal

O login comum leva à raiz e a raiz abre a Home social para toda conta autenticada e
ativa. Não existe preferência individual para substituir a Home por Ferramentas.
Quem precisa trabalhar entra pela aba `Ferramentas`, que continua em primeiro nível e
mostra somente os módulos autorizados para aquela conta. Troca obrigatória de senha e
primeiro acesso continuam tendo precedência.

## Amigos

A área `/amigos/` não utiliza mais o padrão visual de `Carregar mais` para a lista
de relacionamentos. A lista completa de amigos é pré-carregada em segundo plano a
partir das páginas por cursor do backend, com deduplicação defensiva antes da
renderização.

Ao entrar em Amigos, o usuário pode escolher 10, 20, 30 ou Todos os itens por página.
Quando a escolha não é `Todos`, a interface apresenta navegação numérica entre as
páginas. O tamanho selecionado é uma preferência local não sensível e não altera
qualquer regra de relacionamento ou autorização.

A lista de amigos pode usar um snapshot transitório por usuário em
`sessionStorage`, de vida curta e limpo no logout, para que a abertura da tela seja
imediata. Pedidos recebidos, enviados e bloqueios são aquecidos em segundo plano ao
entrar na área e permanecem fora do cache persistente do service worker.

## Feed social V1

O feed usa ordem cronológica explícita e paginação por cursor. Mostra publicações do
próprio usuário e de amigos ativos dentro da audiência `friends` ou `self`. Não
existe ranking comportamental, feed global ou diretório público de profissionais.

Na interface, as publicações são apresentadas em lotes de 10. A primeira abertura
mostra as 10 mais recentes disponíveis; novos lotes são acrescentados automaticamente
quando a rolagem se aproxima do fim do feed, sem botão visível de `Carregar mais
publicações`. O mesmo padrão é usado no módulo de publicações do perfil. O cliente
mantém controle de IDs já renderizados para impedir duplicação visual mesmo se uma
requisição for repetida ou concluída mais de uma vez.

Comentários seguem uma paginação visual menor: até 5 comentários são mostrados de uma
vez. `Carregar mais comentários` só aparece quando ainda existe pelo menos um sexto
comentário não exibido; cada acionamento acrescenta até mais 5. Comentários também são
desduplicados pelo identificador antes de entrarem no DOM.

A V1 permite:

- publicar texto;
- editar/excluir post próprio;
- comentar e excluir comentário próprio;
- uma curtida vetorial por usuário/post;
- denunciar perfil, post ou comentário;
- carregar páginas progressivamente.

Ao excluir um post, o texto é limpo, comentários são apagados logicamente e reações
são removidas. Texto de usuário é renderizado com `textContent`, nunca como HTML.

Imagem social não foi liberada nesta etapa. A foto da conta já existente permanece
disponível, mas posts com mídia aguardam namespace de objetos, validação real de
MIME, transformação e remoção de EXIF mediados pelo Worker.

## Fotos de perfil e cache local

A foto social não deve ser baixada do zero a cada navegação. O backend mantém uma
`avatarVersion` opaca e independente para cada conta. Essa versão só muda quando a
foto é atualizada ou removida e acompanha os resumos sociais autorizados do perfil,
feed, comentários, notificações, busca e amizades.

O cliente mantém os blobs das fotos em Cache Storage local, com chave isolada pelo
usuário que está visualizando, pelo `@handle` e pela versão do avatar. Ao voltar para
uma página, uma versão já conhecida é reaproveitada diretamente do dispositivo. Uma
versão nova provoca um único download; depois disso, a versão anterior daquele avatar
é descartada. Requisições concorrentes da mesma foto na mesma tela são deduplicadas.

A autorização não é cacheada: o Worker continua validando sessão, visibilidade e
relacionamento antes de entregar uma foto que ainda não esteja localmente disponível.
O cache de avatares é excluído no logout e permanece totalmente separado do cache
estático do service worker e de qualquer dado assistencial.

## Separação absoluta entre social e assistencial

O backend social usa apenas tabelas `social_*` e a identidade mínima da conta. Não
consulta Firestore, Storage, manifestações, anexos, Telemedicina, prontuários,
encaminhamentos ou dados de pacientes.

Ferramentas são links autorizados, não eventos do feed. Nenhuma utilização de módulo,
manifestação, consulta ou alteração administrativa gera publicação automática.
Amizade, perfil, nível ou reação nunca são usados como autorização profissional.

## Privacidade e elegibilidade

- A camada é autenticada e suas páginas dedicadas são `noindex,nofollow`.
- Perfil, amizades, feed e ações sociais básicas estão disponíveis desde a Conta
  Bronze; o nível da conta não altera a Home.
- A confirmação do e-mail continua fortalecendo a segurança e liberando a foto de
  perfil, sem controlar o acesso à Camada Social básica.
- Cidadãos descobrem somente cidadãos que optaram pela visibilidade e pelos pedidos.
- Profissionais não aparecem em busca cidadã ampla.
- Perfil profissional mostra cargo autêntico fornecido pelo backend.
- E-mail, UUID e preferências privadas não aparecem para terceiros.
- CSP das novas superfícies restringe origens e conteúdo executável.

## Interação e acessibilidade

As páginas reutilizam `PortalInteractions`; não existe segundo gerenciador de sons.
Estados possuem texto e cor, com `aria-live` para resultados relevantes. Ícones são
SVG vetoriais do Portal, sem emojis como pictogramas.

O painel de notificações usa botão nativo, `aria-expanded`, `aria-controls` e
`aria-haspopup`; pode ser fechado por `Esc`, devolvendo o foco ao acionador. O conteúdo
é rolável sem deslocar a página inteira e mantém alternativa de histórico completo.

A interface possui foco visível, controles nativos de formulário, diálogo modal
nativo, navegação por teclado, tratamento de `prefers-reduced-motion`, contraste
forçado, safe areas e breakpoint dedicado para evitar compressão/overflow mobile.

## Busca social na Home

A pesquisa do topo da Home reutiliza o endpoint protegido `/api/social/search`.
Exige pelo menos três caracteres, respeita rate limit, visibilidade, bloqueios e a
separação de tipos de conta. O resultado permite abrir perfil, enviar/aceitar pedido
e, quando já houver amizade, iniciar o chat social permitido.

## Evolução posterior

Comunidades, fóruns, seguidores, jogos, desbloqueios de conquistas por jogos e chat
social cidadão-profissional ainda não foram implementados. A rota `/conquistas/`
já existe como superfície real da progressão da conta e identifica explicitamente
como `Planejada` qualquer medalha futura sem regra real de desbloqueio. A identidade
UUID e a separação de domínio permitem que esses produtos sejam adicionados depois
com tabelas, eventos e políticas próprias.
