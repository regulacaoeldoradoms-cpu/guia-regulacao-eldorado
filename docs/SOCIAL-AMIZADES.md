# Camada Social V1 — amizades e perfis

Decisão permanente atualizada em 08/09/2026.

## Estado implantado

A Ordem Mestre de 06/09/2026 autorizou a implementação que antes constava apenas
como visão futura. A V1 está implementada no código com backend social próprio,
perfil visitável e ciclo completo de amizade. A publicação é gradual por duas flags:
o backend pode ser validado antes de a raiz passar a exibir o feed.

Amizade é uma relação exclusivamente social. Ela nunca concede acesso ao chat
profissional, Telemedicina, Guia Médico, Recepção, Conselho, manifestações, anexos
ou qualquer dado assistencial.

## Identidade estável

Cada conta possui um `social_user_id` UUID imutável. Amizades, bloqueios, posts,
comentários, reações e notificações usam esse identificador, e não nome ou `@handle`.

O perfil é aberto dentro do Portal pela rota `/perfil/?u=handle`. Quando o cidadão
altera o `@`, o handle anterior é preservado em `social_handle_aliases`; URLs antigas,
autoria e amizades continuam resolvendo a mesma identidade.

`/conta/` permanece sendo o painel privado. `/perfil/` é a representação social
autenticada e não indexável.

## Estados e transições

Existe no máximo uma linha em `social_relationships` para cada par não ordenado de
identidades. Os estados persistidos são:

- `pending`: pedido enviado/recebido, com `initiated_by` indicando a direção;
- `friends`: amizade ativa;
- `removed`: pedido recusado/cancelado ou amizade removida;
- `blocked`: bloqueio ativo, com `blocked_by` indicando quem bloqueou.

A API traduz esses dados para os estados de interface `none`, `sent`, `received`,
`friends`, `removed`, `blocked` e `unavailable`. Todas as transições são validadas
no Worker. O navegador não é autoridade de autorização.

A V1 oferece:

- enviar e cancelar pedido;
- aceitar ou recusar pedido recebido;
- desfazer amizade;
- bloquear e desbloquear;
- consultar relações por estado com paginação por cursor;
- consultar o estado atual ao abrir um perfil.

Autoamizade, pedido duplicado e transições incompatíveis são recusados ou tratados
de forma idempotente. A pessoa bloqueada não descobre nem interage com quem a
bloqueou. Quem efetuou o bloqueio mantém apenas o acesso necessário para desbloquear.

## Rede inicial de colegas

Contas profissionais ativas, não autocadastradas, provisionadas pelo Desenvolvedor
ou pelo bootstrap técnico e elegíveis ao chat recebem amizades iniciais entre si.
Os perfis lógicos abrangidos são:

- Médico;
- Recepção;
- Coordenação;
- Técnico em Telemedicina;
- Desenvolvedor.

Cidadãos, funções isoladas do Conselho e contas criadas pela Coordenação não entram
na semeadura automática. A origem é verificada pelo backend por `created_by` e pela
capacidade real do chat; nenhum nome pessoal é hardcoded.

A migração `professional-friendships-v1` é idempotente. Remover uma amizade gera
`tombstone=1`, e bloquear também preserva a exceção. O provisionamento automático
nunca recria esses pares. Novos profissionais elegíveis são conectados no fluxo
administrativo de criação/alteração da conta.

## Descoberta e tipos de conta

- Cidadão Prata descobre somente outros cidadãos ativos, não suspensos, com perfil
  visível ao Portal e pedidos habilitados.
- Cidadão não recebe uma busca ampla de profissionais.
- Profissional elegível descobre outros profissionais e pode abrir o perfil pelo
  chat profissional.
- Relações manuais cidadão-profissional ficam fora da V1.
- Conta inativa ou socialmente suspensa sai da descoberta e não recebe novas ações.

Busca exige ao menos três caracteres, possui limite por conta/janela e retorna uma
página limitada por cursor. Perfis protegidos usam resposta genérica de não
encontrado para reduzir enumeração.

## Perfil social

O perfil pode conter foto da conta, capa por tema/padrão aprovado, nome, `@`, bio,
frase/status, interesses, seleção e ordem de módulos, contadores e posts permitidos
pela audiência. Não existe entrada de HTML, CSS, JavaScript, SVG ou iframe pelo
usuário.

O cargo de um profissional é derivado da autenticação flexível no backend e não é
editável na superfície social. E-mail, UUID interno, dados administrativos e dados
assistenciais não aparecem em perfis comuns. Preferências privadas, como página
inicial e audiência padrão, são devolvidas apenas ao próprio titular.

A foto continua sendo configurada em `/conta/` e exige Conta Prata. A capa da V1 usa
somente tokens visuais controlados; upload de mídia social foi adiado até existir
pipeline próprio com validação de MIME, transformação e remoção segura de metadados.

## Chat profissional é independente

O chat continua autorizado exclusivamente pelo cargo profissional. A amizade não
libera chat para cidadãos, e desfazer amizade ou bloquear na Camada Social não remove
uma comunicação institucional permitida pelo cargo.

O cabeçalho da conversa oferece `Ver perfil` para o contato profissional. O link
resolve pelo username/alias no backend social, sem consultar o grafo para decidir se
o chat pode funcionar.

## Privacidade, abuso e moderação

- Ações sociais ativas exigem Conta Prata; autocadastro Bronze mantém os recursos
  cidadãos já permitidos, sem descoberta nem interação social. Relações profissionais
  podem ser pré-semeadas no backend antes da regularização, como exige a regra
  institucional, mas a interface continua bloqueada até o gate Prata.
- `accept_friend_requests` é respeitado nos pedidos manuais.
- Busca e pedidos possuem rate limit em D1.
- Perfil, post e comentário podem ser denunciados.
- O Desenvolvedor pode ocultar conteúdo ou suspender somente a participação social.
- Suspensão social não altera `auth_users.active`, cargo, sessão nem ferramentas.
- A trilha de moderação registra metadados técnicos mínimos sem copiar conteúdo para
  logs ou GitHub.

## Extensões futuras

Comunidades, jogos, seguidores e chat social generalizado permanecem fora da V1.
Produtos futuros podem referenciar `social_user_id`, mas deverão criar políticas,
persistência e tipos de evento próprios, mantendo o isolamento assistencial.
