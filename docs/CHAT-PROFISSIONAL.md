# Chat profissional do portal

Decisão permanente registrada em 03/09/2026.

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

## Implementação relacionada

- `worker/portal-chat-v2.js` — autorização, contatos, presença e mensagens;
- `worker/auth-management-flex.js` — sessão com perfil lógico de Telemedicina;
- `worker/telemedicine-access.js` — decoração do papel-base `recepcao` como `telemedicina`;
- `.github/workflows/validate-portal-chat.yml` — validações automáticas da integração e do isolamento de cidadãos.
