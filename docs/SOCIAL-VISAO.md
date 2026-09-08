# Camada Social V1 — visão de produto e navegação

Decisão permanente atualizada em 08/09/2026.

## Estado

A Camada Social deixou de ser somente roadmap. Perfil, amizade, feed textual,
comentários, curtida, notificações, descoberta protegida, moderação, navegação global
e a rota `/ferramentas/` estão implementados.

A ativação é deliberadamente gradual:

- `SOCIAL_BACKEND_ENABLED` libera APIs, schema e superfícies sociais;
- `SOCIAL_HOME_ENABLED` troca a apresentação da raiz pelo feed somente depois do QA
  funcional no ambiente publicado.

Com a segunda flag desligada, `/` mantém o catálogo de trabalho e informa que a Home
social está em validação. A estrutura do feed já fica disponível no mesmo artefato,
sem exigir uma migração destrutiva posterior.

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
- dois a quatro atalhos autorizados de trabalho, com três como padrão da V1;
- contexto de privacidade e separação entre social e assistencial.

`/ferramentas/` reutiliza o mesmo `PortalTools` usado pelo fallback da raiz. A matriz
de cards não é duplicada entre as duas páginas. A API social não é necessária para
renderizar ou abrir uma ferramenta autorizada.

Ferramentas permanece em primeiro nível na navegação desktop e na barra inferior
mobile. Se configuração, perfil ou feed falhar, a raiz volta para o catálogo de
Ferramentas com aviso curto; Telemedicina, Guia, Recepção e demais módulos continuam
seguindo suas autorizações próprias.

## Navegação global implantada

No desktop, a navegação oferece Início, Meu perfil, Amigos, Ferramentas,
Notificações e Conta conforme elegibilidade. No mobile, prioriza Início, Amigos,
Ferramentas, Avisos e Conta com áreas sociais omitidas para contas sem o gate.

Chat continua como recurso flutuante apenas para os cargos profissionais já
autorizados. Notificações sociais usam rota e tabela próprias; avisos do Conselho
continuam no Canal do Cidadão.

## Página inicial preferida

Em `/conta/`, usuários com acesso social podem escolher:

- `Feed`: abrir a Home social quando a flag estiver ativa;
- `Ferramentas`: entrar diretamente em `/ferramentas/`.

Login continua levando à raiz, que aplica a preferência depois de validar sessão e
configuração. Troca obrigatória de senha, primeiro acesso e regularização de
segurança sempre têm precedência.

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
- Ações sociais ativas exigem Conta Prata; Ouro não é requisito para a V1 básica.
- Bronze continua usando as capacidades cidadãs vigentes sem descoberta social.
- Cidadãos descobrem somente cidadãos que optaram pela visibilidade e pelos pedidos.
- Profissionais não aparecem em busca cidadã ampla.
- Perfil profissional mostra cargo autêntico fornecido pelo backend.
- E-mail, UUID e preferências privadas não aparecem para terceiros.
- CSP das novas superfícies restringe origens e conteúdo executável.

## Interação e acessibilidade

As páginas reutilizam `PortalInteractions`; não existe segundo gerenciador de sons.
Estados possuem texto e cor, com `aria-live` para resultados relevantes. Ícones são
SVG vetoriais do Portal, sem emojis como pictogramas.

A interface possui foco visível, controles nativos de formulário, diálogo modal
nativo, navegação por teclado, tratamento de `prefers-reduced-motion`, contraste
forçado, safe areas e breakpoint dedicado para evitar compressão/overflow mobile.

## Evolução posterior

Comunidades, fóruns, seguidores, jogos, conquistas e chat social cidadão-profissional
não foram implementados e não aparecem como controles falsos. A identidade UUID e a
separação de domínio permitem que esses produtos sejam adicionados depois com tabelas,
eventos e políticas próprias.
