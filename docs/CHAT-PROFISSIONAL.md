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

Por isso, a **listagem e apresentação dos contatos** continua usando a decoração de
identidade de Telemedicina para exibir corretamente a função lógica. No caminho rápido
de envio não é necessário carregar essa decoração: o papel-base `recepcao` já pertence
à matriz profissional e a autorização atômica no D1 aceita esse papel. Essa separação
evita bloquear o Técnico em Telemedicina sem obrigar cada mensagem a consultar
capabilities que não alteram a permissão de conversa.

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

## Emoticons e “Chamar atenção”

Decisão permanente registrada em 02/10/2026: a conversa possui uma pequena barra de
ações acima do campo de mensagem.

- **😀 Emoticons** abre um painel flutuante com uma seleção curta de emojis. O emoji
  escolhido é inserido na posição atual do cursor do campo de mensagem; não é enviado
  automaticamente e participa da mesma mensagem normal, com os mesmos limites,
  persistência, recibos e autorização.
- **⚡ Chamar atenção** reproduz de forma moderada a ideia do antigo MSN. A ação é um
  evento efêmero do WebSocket: não cria mensagem, não grava linha no D1 e não entra no
  histórico.
- Se o destinatário estiver com o Chat recolhido, somente o botão flutuante **Chat**
  treme por aproximadamente 1,8 segundo.
- Se o Chat estiver aberto, a página não é sacudida: o cabeçalho do painel recebe um
  pulso visual discreto e o status informa quem chamou a atenção.
- `prefers-reduced-motion: reduce` desativa a tremedeira e substitui a animação por
  destaque estático de borda/sombra.
- O botão possui cooldown de 5 segundos por destinatário no cliente e no servidor. O
  cooldown do servidor fica no attachment hibernável do próprio WebSocket, limitado a
  metadados pequenos; não usa D1 nem o armazenamento de mensagens.
- O Durable Object só encaminha a ação para usernames presentes na lista de contatos
  que o backend já autorizou e sincronizou para aquele usuário.
- O recurso exige o canal realtime conectado. Se o WebSocket estiver reconectando, o
  botão fica temporariamente indisponível; não há fallback D1/HTTP para “Chamar
  atenção”, justamente para manter a ação efêmera e barata.
- “Chamar atenção” não gera Web Push por padrão. Em aba invisível ou minimizada, não há
  tentativa de chamar atenção fora da interface do Portal.

### Correção de entrega e visibilidade — 02/10/2026

O teste entre dois clientes identificou que o remetente recebia `attention-ack` mesmo
quando o Durable Object destinatário informava zero sockets abertos. A confirmação
agora exige uma resposta válida com `sent > 0`. O cliente distingue contato sem
conexão, falha de transporte e contato indisponível, sem anunciar sucesso nesses
casos. A confirmação indica entrega ao canal conectado, não leitura pela pessoa.

Cada tentativa pode incluir um `requestId` efêmero, devolvido pelo servidor somente
ao remetente. O navegador ignora confirmações atrasadas de outra tentativa e deixa
de aguardar após quatro segundos sem resposta. Não há reenvio automático, fallback
HTTP, consulta D1, gravação de mensagem ou Web Push para essa ação. O intervalo de
cinco segundos por destinatário permanece inclusive após falha de entrega.

O fechamento de um socket antigo não pode desativar a conexão atual nem o botão.
Esse cenário foi reproduzido com duas conexões sobrepostas durante a obtenção do
ticket e agora o handler de fechamento verifica a identidade do socket antes de
alterar o estado. O destaque de movimento reduzido também recebe especificidade
suficiente para prevalecer sobre a sombra do botão na Home mobile.

Se o evento chegar enquanto a aba estiver oculta, somente a última chamada fica em
memória nessa página, com validade de quinze segundos. Ao voltar à aba dentro desse
prazo, o efeito aparece no botão Chat ou no cabeçalho conforme o estado atual do
painel. Chamadas antigas são descartadas e o encerramento da sessão limpa esse
estado. Não há armazenamento durável nem alerta externo ao Portal.

Regressões específicas: `worker/tests/chat-attention-delivery.test.mjs` verifica
encaminhamento, retorno offline, falhas, autorização e cooldown com a classe real do
Durable Object e conexões sintéticas; `worker/tests/chat-attention-client.test.mjs`
executa o cliente real em VM com DOM/conexões sintéticos para verificar apresentação,
tempo de espera, correlação e fechamento de socket antigo. Não usa contas ou
conversas reais e não substitui uma conferência visual em navegador.

### Correção do botão bloqueado por CSP — 02/10/2026

Depois da correção de entrega, o usuário ainda encontrou **Chamar atenção** desativado,
com o tooltip “A conexão em tempo real está reconectando”. A inspeção do HTML publicado
confirmou que a Home autorizava somente a origem HTTPS do Worker em `connect-src`.
O cliente abre o socket na mesma origem por `wss://`, que precisa de permissão própria
na política. Assim, as APIs e o fallback HTTP funcionavam, mas a CSP bloqueava a
conexão necessária para habilitar o botão. O healthcheck do Worker e os testes com
sockets sintéticos não verificam essa política do documento.

As treze páginas autenticadas que já possuem CSP passam a incluir, em `connect-src`,
somente a origem adicional
`wss://yellow-wave-d0a1guia-regulacao-ia.regulacaoeldoradoms.workers.dev`.
A origem HTTPS e as demais diretivas são preservadas. A mesma correção alcança a
transição após o login, que importa a meta CSP da Home. Não há liberação genérica de
`wss:`, curingas ou mudança de autenticação, contatos ou transporte de eventos.

O cache do Service Worker muda para `20261003-chat-websocket-csp-1` para renovar o HTML.
Uma página já aberta precisa ser recarregada para receber a política nova; substituir
somente o JavaScript não altera a CSP que o navegador já aplicou.

O teste em `worker/tests/global-chat.test.mjs` compara as políticas dos módulos com as
origens HTTPS/WSS do endpoint configurado, incluindo restrição ao host exato. Ele
integra o gate de chat existente e cobre a lacuna do teste anterior. A regra de
correspondência de esquemas está no
[CSP3, seção 6.7.2.9](https://www.w3.org/TR/CSP3/#match-schemes).

## Confirmação rápida de envio no servidor

Decisão permanente atualizada em 02/10/2026: o balão otimista aparece no instante do
clique e, quando o WebSocket estiver saudável, **a própria mensagem também é enviada
pelo canal já aberto**. O POST HTTP deixa de ser o transporte primário e permanece como
fallback idempotente.

Fluxo primário:

1. o cliente envia `{ type: "send", to, body, clientId }` pelo WebSocket existente;
2. o Durable Object recupera do attachment a identidade e a versão da sessão que foram
   assinadas no ticket HMAC do upgrade;
3. uma única instrução `INSERT OR IGNORE ... SELECT` no D1 valida, na mesma operação,
   conta ativa, `session_version`, gate de e-mail quando habilitado, destinatário ativo
   e autorização institucional ou amizade `friends`;
4. se a linha for criada, o próprio resultado da escrita fornece o ID e o servidor
   envia `send-ack` imediatamente pelo mesmo WebSocket;
5. somente depois do ACK são disparados entrega realtime ao destinatário e Web Push.

A autorização permanece integralmente no servidor. O Durable Object não confia na
lista visual de contatos para gravar mensagens. Para profissionais, o `INSERT ...
SELECT` valida os cargos atuais no D1; para canais sociais, a mesma instrução exige a
amizade atual e perfis sociais não suspensos. Alterações de cargo, desativação da conta,
revogação da amizade ou mudança da `session_version` passam a bloquear a escrita sem
depender de reconexão do navegador.

O ticket realtime passou a incluir a `session_version` dentro da carga HMAC assinada.
O Worker compara essa versão novamente durante o upgrade e o Durable Object a conserva
somente no attachment hibernável do socket. A cada envio, o D1 revalida a versão atual.

No caso comum de mensagem nova, não há SELECT anterior nem posterior à escrita. Uma
consulta por `client_id` ocorre somente quando `INSERT OR IGNORE` não cria a linha,
para distinguir um retry legítimo de uma autorização que deixou de existir. Assim,
reenvios continuam idempotentes e não geram mensagem duplicada.

Se o socket não confirmar o envio em aproximadamente **1,8 segundo**, se fechar ou se
não estiver conectado, o cliente repete a mesma tentativa pelo
`POST /api/chat/messages` usando o mesmo `client_id`. A constraint única do D1
garante que a corrida WebSocket↔HTTP não duplique a mensagem. O POST conserva o caminho
rápido implementado anteriormente.

Telemetria técnica permanece sem identidade e sem conteúdo da conversa:

- WebSocket: evento `chat_ws_send_ack` com duração do ACK e indicador de
  criação/retry;
- WebSocket recusado: `chat_ws_send_rejected` com código técnico e duração;
- fallback HTTP: `Server-Timing`, `X-Portal-Chat-Ack-Ms` e
  `chat_send_ack`.

O cliente atualiza a data da conversa localmente e não recarrega o diretório inteiro
após uma confirmação de envio.

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
atualização anterior. Quando o canal em tempo real retorna, o polling rápido dá lugar
à reconciliação leve da conversa visível, descrita na correção de 07/10/2026 abaixo.

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
- `worker/chat-send-atomic.js` — autorização e gravação atômicas das mensagens enviadas pelo WebSocket;
- `worker/auth-management-flex.js` — sessão com perfil lógico de Telemedicina;
- `worker/telemedicine-access.js` — decoração do papel-base `recepcao` como `telemedicina`;
- `worker/social.js` e `worker/social-policy.js` — resolução e autorização do perfil,
  participando apenas do gate do chat social cidadão↔cidadão;
- `js/portal-chat.js` — gate cliente por cargo e link `Ver perfil`;
- `css/portal-chat-profile-link.css` — apresentação responsiva do link;
- `.github/workflows/validate-portal-chat.yml` — validações automáticas da integração, do chat profissional e do gate social cidadão↔cidadão.

## Fotos e divisão cronológica da conversa — 07/10/2026

Decisão aprovada: o cabeçalho da conversa aberta mostra a foto do interlocutor ao
lado do nome. A lista e o cabeçalho usam a foto já autorizada por /api/chat/users,
com iniciais como alternativa quando não existe foto ou o arquivo não pode ser
exibido. A foto é um elemento img, separado do fundo: o degradê importante do tema
escuro não pode apagá-la. Só são aceitos os mesmos data URLs raster JPEG, PNG e WebP
limitados a 220000 caracteres da API de perfil. Não há novas URLs externas,
permissões, upload ou requisições por avatar. Ao voltar à lista o avatar do cabeçalho
é ocultado e ao encerrar a sessão é limpo. Snapshots privados continuam sem fotos;
a revalidação de contatos ocorre em segundo plano imediatamente após restauração,
sem o antigo atraso fixo de dez segundos.

O histórico exibe uma divisão central no início de cada dia com mensagens:
**Hoje**, **Ontem**, ou a data completa **DD/MM/AAAA**. Usa o mesmo fuso local do
navegador já empregado no horário das mensagens; timestamps SQL sem fuso são UTC,
e timestamps ISO com Z/offset mantêm seu fuso explícito. Datas inválidas não viram
Hoje: recebem Data não disponível. As etiquetas relativas se atualizam na virada
do dia e ao voltar à aba, sem buscar mensagens só para recalcular o texto.

O marcador **Novas mensagens** permanece independente. Quando os dois coincidem,
a ordem é data, Novas mensagens, primeiro balão não lido. Os divisores são
reconciliados sem recriar os balões ao receber mensagens, confirmar envio otimista,
reabrir a conversa ou carregar páginas antigas. A junção de duas páginas do mesmo
dia não duplica o divisor e preserva a posição de leitura.

Alteração somente de apresentação: não modifica corpo, sent_at, ordem armazenada,
recibos, transporte, autorização ou banco. Testes de datas/avatares integram o gate
de chat; a conferência visual usa somente perfis e mensagens fictícios em navegador
isolado, com temas claro/escuro e tamanhos desktop/mobile.

## Recebimento sem reabrir a conversa — 07/10/2026

O cliente deve apresentar mensagens novas na conversa já aberta, inclusive ao voltar
à aba. O canal WebSocket continua primário e imediato. Foram reproduzidas duas falhas:
mensagens recebidas com a aba oculta ficavam só na memória e uma resposta HTTP antiga
podia substituir uma mensagem WebSocket mais nova. A foto e a linha do tempo não são
a origem desses caminhos; ambos já existiam antes da alteração de apresentação.

Regras da correção:

- voltar à aba, recuperar a internet ou restaurar uma página pelo histórico reconcilia
  os balões em memória imediatamente e busca o delta autorizado, sem fechar o painel;
- respostas HTTP/preload/histórico são combinadas com a memória atual, não substituem
  mensagens novas; os IDs preservam ordem e eliminam eventos duplicados;
- um cursor por conversa avança somente por páginas HTTP confirmadas: um evento
  WebSocket posterior ou ACK próprio não pode fazer a consulta pular um evento perdido;
- com WebSocket conectado há uma consulta leve a cada 30 segundos somente para a
  conversa aberta e a aba visível; desconectado permanece o fallback de 4,5 segundos;
- leituras simultâneas da mesma conversa são agrupadas. Não há novo polling global do
  diretório, nova persistência de conteúdo ou alteração do backend/D1;
- sincronização usa peek=1 e só confirma leitura por throughId depois de apresentar os
  balões na conversa visível; aba oculta não gera visualização. Recibos são agrupados
  e uma mensagem nova durante um ACK pendente recebe confirmação posterior;
- encerrar a sessão limpa cursores/estado e respostas antigas não repovoam a memória.

Testes de recebimento usam duas sessões fictícias, cliente real e HTTP/WebSocket
interceptados. Cobrem os dois temas e tamanhos desktop/mobile, recebimento em aba
oculta, resposta inicial atrasada, perda de evento seguida de outro ID, duplicação e
fallback. Isso não equivale a uma conversa real autenticada em produção.

## Grupos privados — implementação de 08/10/2026

O chat passa a oferecer grupos privados no mesmo painel, sem mudar a autorização das
conversas individuais. A regra completa e os limites ficam em [CHAT-GRUPOS.md](CHAT-GRUPOS.md).
Grupos só admitem amigos aceitos do criador original, com convite e aceite revalidado.

A corrida residual da PR #608 foi corrigida nesta entrega: deduplicação usa um conjunto
limitado de eventos efetivamente tratados, não a presença da mensagem no cache HTTP.
Assim, o primeiro evento apresenta/avisa uma mensagem pré-carregada; o segundo não duplica.
Os dois cenários de preload antes do evento passam a integrar os 14 testes de recebimento
individual no gate de navegador. Fotos, datas e o protocolo WebSocket individual são preservados.
