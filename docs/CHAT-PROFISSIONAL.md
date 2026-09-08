# Chat profissional do portal

Decisão permanente registrada em 03/09/2026 e integrada à Camada Social em 06/09/2026.

## Finalidade

O chat interno é um recurso de comunicação direta entre contas profissionais autorizadas do Portal da Regulação de Saúde de Eldorado/MS. Ele não funciona como diretório público e não cria autorização de contato para cidadãos.

## Perfis autorizados

O backend admite os seguintes perfis lógicos no chat:

- `medico` — Médico;
- `recepcao` — Recepção;
- `coordenacao` — Coordenação;
- `telemedicina` — Técnico em Telemedicina;
- `admin` — Desenvolvedor.

O perfil `cidadao` permanece fora do chat profissional. Funções do Conselho, por si só, também não concedem acesso ao chat.

## Técnico em Telemedicina

O perfil lógico `telemedicina` passa a ter o mesmo direito de usar o chat interno que os demais perfis profissionais autorizados.

A identidade de Telemedicina continua seguindo a arquitetura definida em `docs/TELEMEDICINA.md`: a conta possui papel-base `recepcao` no registro principal do D1 e a tabela `auth_telemedicine_access` determina a capacidade lógica `telemedicina`.

Por isso, o chat deve sempre usar a camada de autenticação flexível e a decoração de identidade de Telemedicina antes de decidir autorização ou apresentar contatos. Isso evita que o Técnico em Telemedicina seja bloqueado indevidamente ou exibido como simples Recepção.

## Regras de segurança

- A autorização é validada no Cloudflare Worker; exibir o componente visual não concede acesso.
- Contas inativas não podem aparecer como contato nem receber novas conversas.
- Cidadãos continuam isolados do chat profissional no frontend e no backend.
- Nenhum conteúdo de conversa, credencial ou dado protegido deve ser versionado no GitHub.
- Alterações futuras em perfis profissionais devem atualizar também os testes de `validate-portal-chat.yml`.

## Integração com o perfil social

O cabeçalho de uma conversa ativa apresenta `Ver perfil`. O cliente usa o username
técnico do contato apenas para formar uma referência autenticada; o backend social
resolve o handle atual ou seu alias e aplica a matriz de visibilidade antes de
entregar o perfil ou a foto.

Essa integração não mudou a autorização do chat:

- `worker/portal-chat-v2.js` não consulta amizade, bloqueio ou suspensão social;
- o componente do chat só é montado para os cinco perfis profissionais autorizados;
- amizade removida e bloqueio social não eliminam comunicação institucional exigida
  pelo cargo;
- amizade entre cidadãos não concede acesso ao chat;
- uma suspensão aplicada pelo painel social não altera sessão, cargo, presença nem
  mensagens profissionais.

O link pode resultar em perfil indisponível quando a identidade social ainda não
satisfaz o gate de segurança ou quando a política de visualização negar o acesso.
Essa recusa não impede a conversa profissional.

## Implementação relacionada

- `worker/portal-chat-v2.js` — autorização, contatos, presença e mensagens;
- `worker/auth-management-flex.js` — sessão com perfil lógico de Telemedicina;
- `worker/telemedicine-access.js` — decoração do papel-base `recepcao` como `telemedicina`;
- `worker/social.js` e `worker/social-policy.js` — resolução e autorização do perfil,
  sem participar da decisão de chat;
- `js/portal-chat.js` — gate cliente por cargo e link `Ver perfil`;
- `css/portal-chat-profile-link.css` — apresentação responsiva do link;
- `.github/workflows/validate-portal-chat.yml` — validações automáticas da integração e do isolamento de cidadãos.
