# Configurar login do Portal da Regulação

## Estado atual

O portal já possui as páginas e regras de perfil:

- `/login/` — autenticação;
- `/home/` — HUB de ferramentas;
- `/` — área médica: Guia Médico + pré-regulação com Gemini;
- `/recepcao/` — conferência documental da recepção.

Enquanto a autenticação não estiver configurada no Worker, `js/auth-config.js` deve permanecer com `enforcement: false`. Isso evita bloquear o Guia Médico atual.

## Perfis disponíveis

- `medico`: Guia Médico completo e pré-regulação Gemini;
- `recepcao`: checklist de documentos/exames e impressão de itens faltantes;
- `admin`: acesso às duas áreas.

## 1. Exigir HTTPS

O login deve ser utilizado somente em HTTPS. Antes de ativar o bloqueio por perfil, confirme que estes endereços abrem com certificado válido:

- `https://regulacaoeldoradoms.com.br/login/`
- `https://regulacaoeldoradoms.com.br/home/`

Não ative autenticação em produção se o navegador ainda exibir “Não seguro”.

## 2. Implantar a versão atual do Worker

A partir da pasta `worker/`, implante `gemini-assistant.js` no mesmo Worker que já atende o Gemini.

O código agora inclui, além de `/api/ia`, estas rotas:

- `GET /api/auth/status`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

## 3. Criar o segredo da sessão

No Cloudflare Workers, adicione um segredo chamado:

`AUTH_SESSION_SECRET`

Use uma sequência longa, aleatória e exclusiva. Não salve esse valor no GitHub.

## 4. Cadastrar usuários

Adicione outro segredo chamado:

`AUTH_USERS_JSON`

O valor deve ser um JSON em uma única linha. Exemplo apenas de estrutura:

```json
[{"username":"admin.regulacao","password":"SENHA_FORTE","name":"Administrador","role":"admin"},{"username":"medico01","password":"SENHA_FORTE","name":"Médico","role":"medico"},{"username":"recepcao01","password":"SENHA_FORTE","name":"Recepção","role":"recepcao"}]
```

Substitua todos os exemplos por usuários e senhas reais antes de salvar o segredo. Nunca coloque as credenciais reais em arquivos do repositório.

## 5. Testar o backend antes de bloquear o site

Após implantar o Worker e cadastrar os dois segredos, abra/teste a rota:

`/api/auth/status`

Ela deve responder que a autenticação está configurada.

Depois teste o login em `/login/` usando uma conta de cada perfil.

Confirme:

- médico → HUB mostra Guia Médico;
- recepção → HUB mostra Conferência da Recepção;
- admin → HUB mostra as duas ferramentas;
- recepção não consegue entrar na área médica quando o bloqueio estiver ativo;
- médico não recebe a ferramenta de conferência da recepção;
- logout encerra a sessão.

## 6. Ativar a proteção das páginas

Somente depois dos testes, altere em `js/auth-config.js`:

```js
enforcement: true
```

A partir daí, o acesso sem sessão será redirecionado para `/login/`.

## 7. Proteger também o Gemini

Depois de confirmar que a área médica envia o token corretamente ao Worker, altere em `worker/wrangler.toml`:

```toml
AUTH_ENFORCE_AI = "true"
```

e implante novamente o Worker.

Assim, a rota da IA só responderá para sessão com perfil `medico` ou `admin`.

## Segurança e limite do GitHub Pages

O repositório atualmente é público. Portanto, o login protege a navegação e o uso das ferramentas do portal, mas não torna confidenciais os arquivos estáticos que permanecem publicados no GitHub.

Não coloque dados de pacientes, senhas, chaves, prontuários ou outras informações confidenciais nesses arquivos.

Se futuramente for necessário esconder também o conteúdo dos protocolos ou qualquer dado interno, a solução deve migrar o conteúdo protegido para backend autenticado e/ou alterar a estratégia de hospedagem/repositório.

## Regra operacional da Recepção

A área `/recepcao/` foi deliberadamente limitada a materiais que possam ser conferidos administrativamente: documentos, relatórios, laudos, imagens e exames.

Ela não deve ser usada para concluir exame físico, exame neurológico, estado mental, hipótese diagnóstica, interpretação de exames, indicação cirúrgica, suspeita de câncer ou classificação de risco.
