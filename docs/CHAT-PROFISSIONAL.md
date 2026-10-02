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

- `worker/portal-chat-v2.js` — autorização, contatos, presença e mensagens;
- `worker/auth-management-flex.js` — sessão com perfil lógico de Telemedicina;
- `worker/telemedicine-access.js` — decoração do papel-base `recepcao` como `telemedicina`;
- `worker/social.js` e `worker/social-policy.js` — resolução e autorização do perfil,
  participando apenas do gate do chat social cidadão↔cidadão;
- `js/portal-chat.js` — gate cliente por cargo e link `Ver perfil`;
- `css/portal-chat-profile-link.css` — apresentação responsiva do link;
- `.github/workflows/validate-portal-chat.yml` — validações automáticas da integração, do chat profissional e do gate social cidadão↔cidadão.
