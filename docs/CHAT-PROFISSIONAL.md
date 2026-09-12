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

## Regras de segurança

- A autorização é validada no Cloudflare Worker; exibir o componente visual não concede acesso.
- Contas inativas não podem aparecer como contato nem receber novas conversas.
- Cidadãos continuam isolados do diretório e do chat profissional no frontend e no backend.
- Chat social entre quaisquer duas contas exige amizade atual em `friends`; pedido, remoção ou bloqueio não autorizam conversa.
- Nenhum conteúdo de conversa, credencial ou dado protegido deve ser versionado no GitHub.
- Alterações futuras em perfis profissionais devem atualizar também os testes de `validate-portal-chat.yml`.

## Pré-carregamento privado das conversas

Depois que a lista de contatos autorizados é carregada, o cliente inicia em segundo
plano o pré-carregamento paginado do histórico da conversa. O primeiro lote mantém a
janela de 120 mensagens já usada pelo chat e, quando houver conteúdo anterior, o
cliente busca os lotes mais antigos em sequência até completar o histórico disponível.
O objetivo é que, ao tocar em uma pessoa, as mensagens já estejam na memória da
página e apareçam imediatamente.

Regras permanentes desse comportamento:

- o pré-carregamento usa no máximo três requisições concorrentes para não disputar
  recursos com a navegação principal;
- a rota protegida de mensagens aceita `peek=1`: ela revalida sessão e autorização,
  entrega o conteúdo permitido, mas **não** marca mensagens como lidas;
- somente a abertura efetiva da conversa mantém o comportamento de leitura e marca
  as mensagens recebidas como lidas;
- o conteúdo pré-carregado fica apenas em memória JavaScript da página; não é
  gravado em `localStorage`, `sessionStorage`, Cache Storage nem no cache estático
  do Service Worker;
- a memória é descartada ao sair da página ou quando a sessão é limpa;
- o histórico anterior é buscado em páginas de 120 mensagens, com trava defensiva
  contra paginação infinita; novas mensagens são incorporadas ao snapshot em segundo
  plano quando `lastMessageAt` muda, sem refazer todo o histórico;
- qualquer falha de pré-carregamento é silenciosa e a conversa continua podendo ser
  carregada normalmente sob demanda.

Esse cache transitório nunca substitui a autorização do Worker. O frontend não pode
usar uma cópia antiga para liberar um contato que deixou de ser autorizado.

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
