# Backend Social V1

## Decisão

A Camada Social V1 usa o D1 já vinculado ao Worker, mas mantém tabelas, rotas,
notificações e auditoria próprias. Nenhuma relação social concede acesso a módulo
profissional, ao Conselho, à Telemedicina, a manifestações ou a dados de saúde.

A chave relacional é `social_user_id`, um UUID imutável. O `auth_username` é apenas
a ligação interna com a conta autenticada. Nome e `@handle` podem mudar sem alterar
amizades, autoria ou notificações. Handles anteriores ficam em
`social_handle_aliases`, permitindo que links antigos continuem resolvendo o mesmo
perfil autenticado.

## Tabelas e índices

As migrações são executadas por `ensureSocialSchema()` com
`CREATE TABLE/INDEX IF NOT EXISTS` e são registradas em
`social_schema_migrations`. Em um novo isolate, a rotina faz primeiro uma única
consulta à versão aplicada; toda a sequência DDL só é repetida quando a versão ainda
não existe. Isso evita que a configuração da Home fique presa na inicialização do
schema já implantado.

- `social_users`: identidade estável, handle, bio, status, interesses, tokens de
  tema/padrão, ordem de módulos, visibilidade, audiência padrão, página inicial e
  suspensão exclusivamente social.
- `social_handle_aliases`: handles históricos ligados à identidade estável.
- `social_relationships`: uma linha por par não ordenado; estados `pending`,
  `friends`, `removed` e `blocked`, direção do pedido/bloqueio, origem e tombstone.
- `social_posts`: texto, audiência `friends` ou `self`, estado e timestamps.
- `social_comments`: comentários e estado de moderação.
- `social_reactions`: uma curtida por usuário/post.
- `social_notifications`: avisos sociais separados de `portal_notifications`, que
  continua pertencendo ao Canal do Cidadão/Conselho.
- `social_reports`: denúncias categorizadas e sua resolução.
- `social_moderation_audit`: trilha técnica de ações, sem e-mail, conteúdo clínico
  ou cópia integral do conteúdo moderado.
- `social_rate_limits`: contadores por identidade, ação e janela.

Há índices para pares/estado da amizade, feed cronológico, comentários por post,
notificações não lidas e fila de moderação.

## Elegibilidade

- Toda rota social valida a sessão no Worker.
- Toda conta autenticada e ativa, inclusive Bronze e qualquer papel vigente, pode
  entrar na Home e usar as ações sociais permitidas pelas políticas de relação,
  visibilidade, rate limit e bloqueio.
- O nível Bronze, Prata ou Ouro continua informativo para segurança da conta, mas não
  é gate da Camada Social básica.
- Conta inativa não chega às rotas porque a sessão é rejeitada pela autenticação.
- Suspensão social bloqueia ações sociais, mas não altera `auth_users.active`, o
  papel profissional nem o chat institucional.

## Visibilidade e descoberta

- A descoberta social é transversal ao cargo: cidadão e profissional podem localizar
  qualquer conta social elegível que esteja com visibilidade `portal`. A flag
  `accept_friend_requests` controla o envio de novos pedidos, não a descoberta do perfil.
- O cargo profissional continua sendo exibido como identidade autêntica do perfil,
  mas nunca é transformado em permissão social ou institucional.
- Bloqueio, suspensão, atividade da conta, visibilidade e rate limit continuam sendo
  aplicados antes de qualquer resultado.
- E-mail, identificadores técnicos, campos administrativos, manifestações e dados
  assistenciais nunca integram respostas sociais.
- Perfil usa `/perfil/?u=@handle`, uma rota estática compatível com a hospedagem.
  O backend resolve tanto o handle atual quanto aliases históricos.

## Chat social entre cidadãos amigos

O chat social reutiliza a infraestrutura de mensagens do Portal, mas aplica um gate
adicional no Worker. Para qualquer par social, cada contato social, leitura ou envio
de mensagem exige `social_relationships.state='friends'`, com ambas as contas
ativas e não suspensas socialmente. Isso permite amizade e conversa social também em
pares cidadão↔profissional. Remover a amizade ou bloquear revoga o canal social.

Esse gate não altera o chat profissional: Médico, Recepção, Coordenação, Técnico em
Telemedicina e Desenvolvedor continuam autorizados por cargo, sem depender do grafo
social. A amizade não concede ferramentas, cargo, Conselho, Telemedicina, Guia
Médico, Recepção ou qualquer dado protegido.

## Amizade profissional inicial

`ensureInitialProfessionalFriendships()` e `provisionProfessionalSocialGraph()`
consideram contas ativas, não autocadastradas,
criadas por um Desenvolvedor ou pelo bootstrap técnico e que sejam elegíveis ao chat
vigente: Médico, Recepção, Coordenação, Técnico em Telemedicina e Desenvolvedor.
Conselho isolado e cidadão não entram.

A rotina é idempotente. Ela cria apenas pares sem registro anterior. Relações
`removed` são tombstones e relações `blocked` têm precedência; ambas impedem que a
amizade automática reapareça. O provisionamento roda na migração social e depois da
criação/alteração administrativa de uma conta.

## Feed

O feed é cronológico, por cursor, composto pelos próprios posts e pelos posts de
amigos ativos e não bloqueados. A V1 aceita somente texto: o pipeline de mídia social
não foi ativado porque o armazenamento/transformação segura e a remoção de EXIF ainda
não estão disponíveis. Imagens grandes nunca são gravadas como base64 no D1.

Conteúdo é tratado como texto no backend e renderizado com `textContent` no cliente.
Autoria, audiência, bloqueio, edição, exclusão, comentário e reação são verificados
no Worker.

Excluir o próprio post limpa o texto, marca comentários vinculados como excluídos e
remove as reações. A exclusão lógica preserva somente a estrutura mínima necessária
para consistência e moderação, sem continuar servindo o conteúdo.

## Rate limits

Contadores D1 limitam, por conta e janela: busca, pedidos, publicações, comentários,
reações e denúncias. Respostas excedidas usam `429` e `retryAfterSeconds`. Listas usam
cursores e limites máximos para evitar enumeração ou extração irrestrita.

## Moderação

Somente `role=admin` acessa `/api/social/moderation/*`. O painel exibe o alvo social
da denúncia com renderização textual segura, permite descartar, ocultar conteúdo ou
suspender somente a participação social. A API técnica também permite restaurar
conteúdo ou participação. Cada ação gera auditoria com ator, tipo, alvo e metadados
mínimos; o conteúdo não é copiado para logs.

As respostas JSON usam `no-store`, `nosniff`, política restritiva de permissões e
CORS limitado às origens do Portal. Fotos são entregues como bytes autenticados, com
tipo fechado e CSP `default-src 'none'`. As novas páginas aplicam CSP compatível com
assets locais, imagens `data/blob` já usadas pelo perfil e o endpoint conhecido do
Worker.

## Flags, rollout e rollback

- `SOCIAL_BACKEND_ENABLED`: libera `/api/social/*`; padrão conservador `false` se a
  variável estiver ausente. Com o flag desligado, helpers de schema, aliases e
  semeadura também não executam escrita incidental.
- `SOCIAL_HOME_ENABLED`: permite que `/` apresente o feed; é uma flag separada, mas
  só produz efeito quando o backend social também está habilitado.

`/ferramentas/` usa a autenticação e o catálogo de permissões existente, sem depender
da API social. Se configuração/feed falhar, a raiz mostra um aviso e mantém o atalho
de Ferramentas. O rollback operacional é desligar `SOCIAL_HOME_ENABLED`; para conter
toda a camada, desligar também `SOCIAL_BACKEND_ENABLED`. As tabelas são aditivas e não
exigem rollback destrutivo.

## Extensões futuras

Comunidades e jogos poderão referenciar `social_user_id` e criar tipos de evento
próprios. Não há tabelas, eventos de feed ou controles visíveis falsos para esses
produtos na V1.
