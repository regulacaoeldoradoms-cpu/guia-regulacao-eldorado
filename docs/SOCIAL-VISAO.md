# Camada Social V1 — visão de produto e navegação

Decisão permanente atualizada em 10/09/2026.

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
não altera a barra global `Início`, `Amigos`, `Ferramentas`, `Notificações` e `Perfil`,
nem o modo mobile, que mantêm suas dimensões e regras próprias.

`/ferramentas/` reutiliza o mesmo `PortalTools` usado pelo fallback da raiz. A matriz
de cards não é duplicada entre as duas páginas. A API social não é necessária para
renderizar ou abrir uma ferramenta autorizada.

Ferramentas permanece em primeiro nível na navegação desktop e na barra inferior
mobile. Se configuração, perfil ou feed falhar, a raiz volta para o catálogo de
Ferramentas com aviso curto; Telemedicina, Guia, Recepção e demais módulos continuam
seguindo suas autorizações próprias.

## Navegação global implantada

No desktop, a navegação oferece Início, Amigos, Ferramentas, Notificações e Perfil.
No mobile, prioriza Início, Amigos, Ferramentas, Avisos e Perfil. O catálogo de
Ferramentas é o único trecho dessa composição que varia conforme cargo e permissões.

`Notificações` no desktop e `Avisos` no mobile funcionam como controles de abertura,
não como navegação direta. Ao acioná-los, o Portal abre na própria tela um painel com
as notificações sociais recentes, preservando o contador de não lidas, a ação de
marcar como lidas, estado vazio e rolagem interna quando necessário. Clicar fora ou
pressionar `Esc` fecha o painel. No mobile, o mesmo conteúdo aparece como painel
amplo acima da barra inferior, respeitando safe areas.

A rota `/notificacoes/` continua existindo como histórico completo e fallback. Ela é
oferecida como ação secundária `Ver histórico completo` dentro do painel, sem obrigar
o usuário a abandonar a tela atual apenas para consultar notificações recentes.

Não existe item independente `Conta` na navegação global. A área de foto/nome no
cabeçalho continua sendo o acesso às configurações privadas em `/conta/`. `Perfil`
aponta para `/perfil/` e representa a identidade social pública da conta, incluindo
suas publicações visíveis conforme audiência e permissões.

Chat continua como recurso flutuante apenas para os cargos profissionais já
autorizados. Notificações sociais usam rota e tabela próprias; avisos do Conselho
continuam no Canal do Cidadão.

## Home social universal

O login comum leva à raiz e a raiz abre a Home social para toda conta autenticada e
ativa. Não existe preferência individual para substituir a Home por Ferramentas.
Quem precisa trabalhar entra pela aba `Ferramentas`, que continua em primeiro nível e
mostra somente os módulos autorizados para aquela conta. Troca obrigatória de senha e
primeiro acesso continuam tendo precedência.

## Feed social V1

O feed usa ordem cronológica explícita e paginação por cursor. Mostra publicações do
próprio usuário e de amigos ativos dentro da audiência `friends` ou `self`. Não
existe ranking comportamental, feed global ou diretório público de profissionais.

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

## Evolução posterior

Comunidades, fóruns, seguidores, jogos, conquistas e chat social cidadão-profissional
não foram implementados e não aparecem como controles falsos. A identidade UUID e a
separação de domínio permitem que esses produtos sejam adicionados depois com tabelas,
eventos e políticas próprias.