# Camada Social V1 — amizades e perfis

Decisão permanente atualizada em 11/09/2026.

## Estado implantado

A Ordem Mestre de 06/09/2026 autorizou a implementação que antes constava apenas
como visão futura. A V1 está implementada no código com backend social próprio,
perfil visitável e ciclo completo de amizade. A publicação é gradual por duas flags:
o backend pode ser validado antes de a raiz passar a exibir o feed.

Amizade é uma relação exclusivamente social. Ela nunca concede acesso ao chat
profissional, Telemedicina, Guia Médico, Recepção, Conselho, manifestações, anexos
ou qualquer dado assistencial. Contas cidadãs e profissionais podem se localizar,
enviar/aceitar amizade e, quando o vínculo estiver em `friends`, conversar pelo
canal social. Essa autorização é revalidada no backend a cada leitura/envio e nunca
promove cargo, ferramenta ou capacidade institucional.

## Identidade estável

Cada conta possui um `social_user_id` UUID imutável. Amizades, bloqueios, posts,
comentários, reações e notificações usam esse identificador, e não nome ou `@handle`.

O perfil é aberto dentro do Portal pela rota `/perfil/?u=handle`. Quando o cidadão
altera o `@`, o handle anterior é preservado em `social_handle_aliases`; URLs antigas,
autoria e amizades continuam resolvendo a mesma identidade.

`/perfil/` é a representação social autenticada e não indexável e também
concentra a foto do próprio titular. Segurança, preferências e progressão ficam,
respectivamente, em `/seguranca/`, `/configuracoes/` e `/conquistas/`.
`/conta/` é somente uma rota legada de redirecionamento.

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

## Carregamento e paginação da interface

A lista completa de amizades é aquecida em segundo plano assim que a navegação social
fica disponível. O snapshot é isolado por usuário em `sessionStorage`, possui vida
curta e é limpo no logout. Dessa forma, ao abrir `/amigos/`, a lista já pode ser
renderizada imediatamente enquanto uma atualização silenciosa confirma o estado
mais recente.

O backend continua paginando por cursor em blocos seguros. O cliente percorre esses
blocos em segundo plano, reúne todos os resultados e aplica deduplicação defensiva por
`@handle`. O botão `Carregar mais` foi removido da lista de relacionamentos.

Na interface, o usuário escolhe quantos itens quer visualizar por página: 10, 20, 30
ou Todos. Quando houver mais de uma página, são exibidos controles numéricos de
navegação. Pedidos recebidos, enviados e bloqueios também são carregados integralmente
em segundo plano ao entrar em Amigos e usam a mesma paginação local.

Após aceitar, recusar, cancelar, remover, bloquear ou desbloquear alguém, o snapshot
transitório é invalidado e as listas são consultadas novamente antes de continuar.

O envio de um novo pedido usa **feedback otimista**: ao tocar em `Adicionar` ou
`Adicionar amigo`, o botão muda imediatamente para `Pedido enviado` e a interface
segue utilizável enquanto a API confirma a operação em segundo plano. Se o Worker
recusar ou falhar, o estado visual é revertido e o usuário recebe um aviso discreto.
A autorização real continua sendo exclusivamente do backend; a antecipação é apenas
de experiência visual.

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

- Qualquer conta social ativa pode localizar outra conta elegível, seja cidadã,
  profissional ou integrante do Conselho, desde que o perfil esteja visível ao
  Portal. Contas com `council_role=membro|presidente` são sincronizadas para a
  identidade social mesmo quando ainda não abriram a Camada Social, permitindo
  localizar membros e a Presidência pela pesquisa.
- A preferência de aceitar pedidos controla o envio de novos convites, não a
  existência do perfil na pesquisa.
- A busca continua autenticada, limitada, sujeita a bloqueios e sem expor e-mail,
  UUID, permissões internas ou dados assistenciais.
- O resultado profissional mantém o cargo/função autêntico fornecido pelo backend,
  mas esse rótulo é apenas identidade social e não autorização.
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

A foto é configurada diretamente em `/perfil/`, pelo ícone de câmera sobre o
avatar, e exige Conta Prata. A capa da V1 usa
somente tokens visuais controlados; upload de mídia social foi adiado até existir
pipeline próprio com validação de MIME, transformação e remoção segura de metadados.

## Chat profissional e conversa social entre amigos

O chat profissional continua autorizado exclusivamente pelo cargo e não depende de
amizade. Desfazer amizade, bloquear ou suspender a participação social não remove uma
comunicação institucional que o cargo profissional já permite.

O mesmo componente visual também oferece um canal social entre quaisquer duas contas
com amizade aceita, inclusive cidadão↔profissional. Pedido pendente não libera
conversa. Remover amizade, bloquear ou suspender o perfil social elimina esse canal e
o backend recusa novas mensagens sociais entre o par.

O chat profissional permanece separado: entre contas profissionais autorizadas, ele
continua disponível por cargo mesmo sem amizade e não é removido quando uma amizade
social termina. Para contatos sociais, o backend devolve o handle atual para abrir o
perfil correto.

## Privacidade, abuso e moderação

- Toda conta autenticada e ativa pode usar perfil, descoberta, amizades e feed desde
  o primeiro acesso. A confirmação do e-mail continua sendo uma evolução de segurança
  e requisito da foto de perfil, não um gate da Camada Social básica.
- Relações profissionais podem ser pré-semeadas no backend conforme a regra
  institucional, preservando remoções e bloqueios.
- `accept_friend_requests` é respeitado nos pedidos manuais.
- Busca e pedidos possuem rate limit em D1.
- Perfil, post e comentário podem ser denunciados.
- O Desenvolvedor pode ocultar conteúdo ou suspender somente a participação social.
- Suspensão social não altera `auth_users.active`, cargo, sessão nem ferramentas.
- A trilha de moderação registra metadados técnicos mínimos sem copiar conteúdo para
  logs ou GitHub.

## Navegação e descoberta na Home

Na Home desktop, o bloco vertical esquerdo abaixo da identidade passa a concentrar
`Segurança`, `Configurações` e `Conquistas`. Os atalhos redundantes para Perfil,
Amigos, Notificações e Privacidade Social foram removidos dali porque esses destinos
já possuem navegação própria.

Na barra horizontal da Home, o espaço antes usado por Segurança, Configurações e
Conquistas recebe uma busca de usuários. Ela reutiliza `/api/social/search`, portanto
mantém as mesmas regras de visibilidade, bloqueio e rate limit, e respeita a preferência de aceitar pedidos na ação de adicionar, mas não separa mais
cidadãos e profissionais na descoberta. O resultado permite abrir o perfil,
enviar/aceitar pedido e, quando a relação já for `friends`, abrir a conversa social. Em outras rotas, a navegação global continua exibindo
Segurança, Configurações e Conquistas para não criar becos de navegação. A navegação
mobile continua com os destinos existentes.

## Extensões futuras

Comunidades, jogos e seguidores permanecem fora da V1. Produtos futuros podem
referenciar `social_user_id`, mas deverão criar políticas, persistência e tipos de
evento próprios, mantendo o isolamento assistencial.
