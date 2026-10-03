# Chat do portal — profissional e social entre amigos

Decisão permanente registrada em 03/09/2026 e atualizada para conversa social entre amigos e pré-carregamento privado em 11/09/2026.

## Finalidade

O chat interno possui dois gates independentes no Portal da Regulação de Saúde de
Eldorado/MS:

1. **chat profissional**, autorizado pelo cargo e independente de amizade;
2. **chat social entre amigos**, autorizado somente quando existe amizade aceita
   entre as duas contas, inclusive em pares cidadão↔profissional.

A busca social pode localizar contas profissionais para amizade, mas isso não cria
autorização profissional: o vínculo libera apenas o canal social enquanto a amizade
estiver ativa.

## Perfis autorizados

O backend admite os seguintes perfis lógicos no chat:

- `medico` — Médico(a);
- `recepcao` — Recepção;
- `coordenacao` — Coordenação;
- `telemedicina` — Técnico em Telemedicina;
- `admin` — Desenvolvedor.

O perfil `cidadao` permanece fora do **chat profissional**. Para o canal social, o
Worker acrescenta contatos cuja amizade esteja em `friends`, independentemente do
cargo do amigo. Funções do Conselho, por si só, não concedem acesso ao chat
profissional.

## Técnico em Telemedicina

O perfil lógico `telemedicina` passa a ter o mesmo direito de usar o chat interno que os demais perfis profissionais autorizados.

A identidade de Telemedicina continua seguindo a arquitetura definida em `docs/TELEMEDICINA.md`: a conta possui papel-base `recepcao` no registro principal do D1 e a tabela `auth_telemedicine_access` determina a capacidade lógica `telemedicina`.

Por isso, o chat deve sempre usar a camada de autenticação flexível e a decoração de identidade de Telemedicina antes de decidir autorização ou apresentar contatos. Isso evita que o Técnico em Telemedicina seja bloqueado indevidamente ou exibido como simples Recepção.

## Disponibilidade global nos módulos

O chat passa a ser um recurso de interface **global do Portal autenticado**. O bootstrap
`js/portal-global-chat.js` é carregado nos módulos operacionais, sociais, de conta e
administrativos e monta o mesmo `js/portal-chat.js` em cada rota. Login, cadastro e a
página pública do Conselho permanecem sem chat.

A disponibilidade visual não altera a matriz de autorização: profissionais continuam
sujeitos a `PROFESSIONAL_ROLES` no Worker; cidadão usa somente contatos sociais
autorizados por amizade em estado `friends`. Assim, mudar de Agenda para Documentos,
Telemedicina, Conselho, Configurações ou outro módulo não muda quem a pessoa pode
contatar — apenas mantém o chat acessível sem precisar voltar à Home.

Carregamentos antigos por página foram removidos para evitar duas instâncias, timers ou
polling duplicado. O Guia Médico conserva somente o observador visual que reposiciona
as ferramentas flutuantes quando o componente global entra no DOM.

## Comportamento do cabeçalho

O cabeçalho do chat deve manter o botão **Fechar/Recolher** sempre visível e legível
nos temas claro e escuro. O ícone deve herdar a cor do botão e usar traço explícito,
evitando depender do preenchimento padrão do SVG.

O botão **Voltar para usuários** é contextual: permanece oculto enquanto a lista de
contatos está aberta e só aparece depois que uma conversa é efetivamente aberta.
Ao retornar à lista, ele deve ser ocultado novamente.

## Regras de segurança

- A autorização é validada no Cloudflare Worker; exibir o componente visual não concede acesso.
- Contas inativas não podem aparecer como contato nem receber novas conversas.
- Cidadãos continuam isolados do diretório e do chat profissional no frontend e no backend.
- Chat social entre quaisquer duas contas exige amizade atual em `friends`; pedido, remoção ou bloqueio não autorizam conversa.
- Nenhum conteúdo de conversa, credencial ou dado protegido deve ser versionado no GitHub.
- Alterações futuras em perfis profissionais devem atualizar também os testes de `validate-portal-chat.yml`.

## Pré-carregamento privado, continuidade entre módulos e histórico

Decisão permanente atualizada em 02/10/2026: o chat deve priorizar abertura imediata e
continuidade entre módulos sem persistir o conteúdo das conversas em armazenamento
durável do navegador.

O carregamento passa a funcionar em camadas:

- depois da lista autorizada de contatos, o cliente pré-carrega somente a página mais
  recente de cada conversa, com até 120 mensagens, em no máximo três requisições
  concorrentes;
- páginas antigas deixam de ser carregadas integralmente para todos os contatos no
  início. Quando o usuário rola uma conversa para o topo, o histórico anterior é
  buscado em páginas de 120 mensagens e inserido sem deslocar a leitura;
- mensagens já confirmadas, rascunhos e o estado visual do painel podem ser
  compartilhados entre as páginas autenticadas por uma memória privada do Service
  Worker. Isso permite trocar de Agenda, Telemedicina, Documentos, Guia Médico e
  demais módulos sem reconstruir o chat do zero;
- essa memória é separada por um hash derivado da sessão autenticada, possui validade
  limitada e tamanho defensivo, e nunca é gravada em `localStorage`,
  `sessionStorage`, IndexedDB ou Cache Storage;
- o Service Worker pode ser encerrado pelo navegador. Portanto essa memória é uma
  aceleração, não uma fonte de verdade. Se ela desaparecer, o D1 continua sendo a
  fonte autoritativa e o cliente recupera apenas a página recente, sincronizando o
  restante sob demanda;
- contatos não são reaproveitados para autorização. A lista de contatos sempre é
  validada novamente pelo Worker antes que uma conversa restaurada possa ser aberta;
- `peek=1` continua sendo usado para pré-carregamento e histórico antigo sem marcar
  mensagens como lidas;
- a memória privada é limpa quando a sessão é encerrada.

Esse desenho preserva a regra de segurança: cache local nunca concede acesso a um
contato e nunca substitui a autorização do Worker.

## Envio otimista e tolerância a falhas

Decisão permanente registrada em 02/10/2026: ao pressionar **Enviar** ou Enter, a
mensagem deve aparecer imediatamente no balão, antes da resposta da rede.

Enquanto a requisição está pendente, o balão mostra um indicador discreto de envio.
Se a operação falhar, o próprio balão oferece **Reenviar**. O campo de texto é liberado
imediatamente, permitindo enviar novas mensagens sem aguardar a anterior.

Cada tentativa recebe um `client_id` gerado no navegador. O backend mantém esse
identificador único por remetente, tornando reenvios idempotentes: se a rede cair
depois de o servidor já ter gravado a mensagem, a nova tentativa recupera a mensagem
existente em vez de criar uma duplicata. Requisições de envio usam `keepalive` para
aumentar a chance de conclusão durante a troca de módulo.

Mensagens ainda pendentes ou com falha não entram no snapshot compartilhado entre
módulos. Somente mensagens confirmadas pelo backend são reaproveitadas.

Os recibos mantêm a semântica definida abaixo: o indicador de envio pendente não
substitui o recibo de recebimento nem o de visualização.

## Recibos de recebimento e visualização

Decisão permanente registrada em 02/10/2026: mensagens enviadas pelo chat exibem
recibos progressivos para o remetente, sem transformar o simples pré-carregamento em
leitura.

Estados definidos:

- **sem marca**: a mensagem foi enviada, mas o destinatário ainda não abriu a área do chat;
- **✓**: o destinatário abriu a área do chat. Esse estado representa recebimento no chat,
  mesmo que ele não tenha aberto a conversa específica;
- **✓✓ verde**: o destinatário abriu a conversa específica. Esse estado representa
  visualização da conversa.

A implementação mantém `delivered_at` separado de `read_at` em
`portal_chat_messages`. A abertura do painel chama a rota autenticada
`POST /api/chat/delivery`, que marca como recebidas as mensagens destinadas à conta.
A leitura continua ocorrendo somente na abertura efetiva da conversa; requisições de
pré-carregamento com `peek=1` não alteram nenhum recibo de leitura.

Para mensagens que chegam enquanto o painel já está aberto, o cliente sincroniza o
estado de recebimento durante as atualizações normais da lista. O remetente recebe o
estado consolidado da conversa nas consultas de mensagens e atualiza os indicadores
sem recarregar o histórico completo.

## Confirmação rápida de envio no servidor

Decisão permanente atualizada em 02/10/2026: o balão otimista continua aparecendo no
mesmo instante do clique, mas o estado **enviando** deve desaparecer assim que a
mensagem estiver gravada de forma idempotente no D1. Notificação push, publicação do
evento WebSocket e atualização do diretório não pertencem ao caminho crítico do ACK.

Para isso, a rota `POST /api/chat/messages` usa um caminho de autenticação específico
do Chat: valida a assinatura da sessão, confirma no D1 que a conta continua ativa e
que a versão da sessão ainda é válida, preserva o gate de e-mail profissional quando
habilitado e verifica a autorização do destinatário sem carregar capabilities de
Telemedicina, Conselho, papéis adicionais ou Central de Documentos.

A autorização continua server-side. Para conversa profissional, o alvo ativo é
validado diretamente pelo cargo institucional; quando a autorização depende de
amizade, a relação `friends` continua sendo conferida no D1. Nenhum cache local
substitui essa decisão.

No envio com `client_id`, o caso normal faz `INSERT OR IGNORE` e constrói a
confirmação a partir do próprio resultado da escrita. A consulta pelo `client_id`
ocorre somente quando a inserção foi ignorada, isto é, no retry idempotente. Isso
remove as leituras anterior e posterior que existiam em todo envio novo.

O roteador principal também encaminha `/api/chat/*` antes das migrações e guards
globais que não pertencem ao Chat. O preflight CORS do Chat passa pelo mesmo caminho
curto. A própria rota continua responsável por origem, sessão, gate de e-mail e
permissão de contato.

A resposta de envio inclui telemetria técnica sem conteúdo da mensagem:

- `Server-Timing: chat_ack;dur=..., d1_write;dur=...`;
- `X-Portal-Chat-Ack-Ms`;
- log estruturado `chat_send_ack` com duração total, duração da escrita e indicação
  de criação/retry, sem nome de usuário e sem texto da conversa.

Depois do ACK, push e entrega WebSocket são executados por `waitUntil` quando o
runtime fornece `ExecutionContext`. O cliente atualiza localmente a data da conversa
e não força uma nova carga do diretório apenas porque acabou de enviar uma mensagem.

## Tempo real, indicador de digitação e novas mensagens

Decisão permanente registrada em 02/10/2026: o chat passa a usar WebSocket como canal
primário de atualização, mantendo as APIs autenticadas e o D1 como fonte de verdade.

A infraestrutura em tempo real usa um Durable Object SQLite da Cloudflare por usuário.
O objeto mantém conexões WebSocket hibernáveis e somente metadados mínimos de presença
e a lista de contatos atualmente autorizados. **O conteúdo das mensagens não é
persistido no Durable Object**: mensagens, recibos e histórico continuam no D1.

O upgrade WebSocket não transporta o token principal da sessão na URL. Antes de
conectar, o cliente autenticado solicita um ticket HMAC de curta duração em
`POST /api/chat/realtime/ticket`. O ticket é enviado como subprotocolo WebSocket,
validado pelo Worker e vinculado ao usuário antes de o pedido ser encaminhado ao
Durable Object.

Eventos em tempo real:

- **mensagem**: depois da gravação no D1, o destinatário conectado recebe o registro
  confirmado imediatamente; o envio otimista do remetente continua independente;
- **recibo**: recebimento e visualização atualizam os risquinhos sem aguardar o próximo
  polling;
- **digitando…**: o remetente envia apenas estado efêmero, validado contra a mesma
  autorização de contato do chat. O estado expira automaticamente e não é gravado no
  histórico;
- **presença**: conexão/desconexão atualiza o estado visual de online. Há uma pequena
  tolerância durante troca de módulo para não piscar offline/online entre páginas;
- **reconciliação**: a lista de contatos continua sendo consultada periodicamente no
  backend para que mudanças de cargo, amizade, bloqueio ou ativação permaneçam
  autoritativas.

Se WebSocket não puder conectar, o chat continua funcional por fallback HTTP: a
conversa ativa sincroniza a cada 4,5 segundos e os contatos mantêm o ciclo de
atualização anterior. Quando o canal em tempo real retorna, o polling de mensagens é
interrompido automaticamente.

A conversa ativa também exibe um separador **Novas mensagens** antes da primeira
mensagem ainda não lida. O backend fornece o ID exato da primeira pendência de leitura
e o divisor continua correto mesmo quando o histórico anterior precisa ser carregado
sob demanda.

O estado **digitando…** aparece somente na conversa correspondente. Ele é encerrado
ao enviar, esvaziar o campo, trocar de conversa ou após expiração defensiva, evitando
indicador preso em caso de perda de rede.

## Proteção de cota D1 e incidente de 02/10/2026

Em 02/10/2026 a conta Workers Free atingiu o limite diário de **5 milhões de linhas
lidas no D1**. Quando esse limite é alcançado, a Cloudflare rejeita novas consultas
D1 até o reset diário de 00:00 UTC. O sintoma visível foi a Home cair para
Ferramentas com `SOCIAL_TEMPORARILY_UNAVAILABLE · HTTP 500`; a Camada Social não
era a origem do defeito, apenas uma das primeiras superfícies que precisavam consultar
o D1 depois do esgotamento da cota.

O diagnóstico de `wrangler d1 insights` mostrou amplificação concentrada no diretório
do Chat:

- a consulta de amizades sociais usada pelo Chat executou 3.467 vezes e respondeu por
  aproximadamente 4,0 milhões de linhas lidas no período analisado;
- a consulta institucional do diretório adicionou aproximadamente 397 mil linhas;
- a resolução individual de `socialHandle` gerou mais de 73 mil consultas/leitura
  unitária;
- o restante da aplicação completou o consumo até o teto diário.

A correção permanente mantém todas as funções de tempo real, mas reduz consultas:

- contas profissionais consultam a malha institucional diretamente e usam a consulta
  social adicional apenas para amizades com contas cidadãs, evitando carregar de novo
  todos os profissionais já presentes no diretório;
- o `socialHandle` profissional passa a vir por `JOIN`, eliminando o padrão N+1;
- o upgrade WebSocket não recompõe o diretório no D1: ele reutiliza a configuração
  enviada pela rota autenticada de usuários;
- `digitando…` usa o próprio WebSocket quando disponível e só recorre à rota HTTP no
  fallback;
- o cliente pré-carrega no máximo as duas conversas recentes mais úteis, em vez de
  varrer todos os contatos;
- a reconciliação do diretório em tempo real passa para 120 segundos; no fallback,
  30 segundos;
- heartbeat D1 passa para 60 segundos;
- chamadas duplicadas de diretório são coalescidas e respeitam janela mínima de
  15 segundos;
- a memória privada do Service Worker também preserva um snapshot leve dos contatos
  por até a próxima reconciliação, evitando nova consulta imediata ao trocar de módulo;
- a criação/verificação do schema do Chat é memoizada por binding D1 durante a vida
  do isolate.

A autorização continua no backend em operações protegidas. O snapshot local não
concede permissão e não contém conteúdo clínico. O D1 permanece a fonte de verdade
para mensagens e estados persistentes; o Durable Object continua restrito a eventos
efêmeros e metadados mínimos.

## Integração com o perfil social

O cabeçalho de uma conversa ativa apresenta `Ver perfil`. O cliente usa o username
técnico do contato apenas para formar uma referência autenticada; o backend social
resolve o handle atual ou seu alias e aplica a matriz de visibilidade antes de
entregar o perfil ou a foto.

A integração mantém autorizações separadas:

- para profissional, `worker/portal-chat-v2.js` continua autorizando pelo cargo e a
  amizade não participa da decisão;
- para o canal social, o Worker consulta o vínculo entre o usuário e o amigo e exige
  `social_relationships.state='friends'`, sem separar por cargo;
- o componente do chat pode ser montado para cidadão e profissional; contatos sociais
  aparecem somente quando a amizade estiver ativa;
- amizade removida/bloqueio revogam a conversa social, sem afetar a comunicação
  institucional autorizada por cargo;
- uma suspensão social não altera sessão, cargo nem chat profissional, mas impede o
  chat social do cidadão enquanto o perfil social estiver suspenso.

O link pode resultar em perfil indisponível quando a identidade social ainda não
satisfaz o gate de segurança ou quando a política de visualização negar o acesso.
Essa recusa não impede a conversa profissional.

## Implementação relacionada

- `worker/portal-chat-v2.js` — autorização, contatos, presença, mensagens, recibos e rotas realtime;
- `worker/chat-realtime.js` — tickets efêmeros e ponte autenticada para o canal WebSocket;
- `worker/chat-realtime-do.js` — Durable Object hibernável para eventos em tempo real, sem persistir conteúdo das conversas;
- `worker/auth-management-flex.js` — sessão com perfil lógico de Telemedicina;
- `worker/telemedicine-access.js` — decoração do papel-base `recepcao` como `telemedicina`;
- `worker/social.js` e `worker/social-policy.js` — resolução e autorização do perfil,
  participando apenas do gate do chat social cidadão↔cidadão;
- `js/portal-chat.js` — gate cliente por cargo e link `Ver perfil`;
- `css/portal-chat-profile-link.css` — apresentação responsiva do link;
- `.github/workflows/validate-portal-chat.yml` — validações automáticas da integração, do chat profissional e do gate social cidadão↔cidadão.
