# Central de Documentos — Configuração OAuth Google Drive

Data: 11/09/2026  
Fase: 1 — validação da integração read-only

## Objetivo

Conectar uma única vez a conta institucional do Google Drive ao backend da Central de Documentos, sem colocar credenciais no GitHub ou no navegador.

## Valores já definidos pelo código

Redirect URI do OAuth:

`https://yellow-wave-d0a1guia-regulacao-ia.regulacaoeldoradoms.workers.dev/api/documents/oauth/callback`

Retorno ao Portal:

`https://regulacaoeldoradoms.com.br/documentos/`

Escopo solicitado:

`https://www.googleapis.com/auth/drive`

## Google Cloud

1. Criar ou selecionar um projeto exclusivo/identificável para a Central de Documentos.
2. Habilitar **Google Drive API**.
3. Configurar a tela de consentimento OAuth.
4. Enquanto a integração estiver em desenvolvimento, cadastrar a conta institucional do Drive como test user.
5. Criar um OAuth Client do tipo **Web application**.
6. Cadastrar exatamente o Redirect URI acima em **Authorized redirect URIs**.
7. Copiar o Client ID e o Client Secret.

Não versionar nem colar Client Secret em arquivos do repositório.

## Cloudflare Worker

Adicionar no ambiente do Worker:

- `GOOGLE_DRIVE_OAUTH_CLIENT_ID` — variável;
- `GOOGLE_DRIVE_OAUTH_CLIENT_SECRET` — Secret;
- `DRIVE_TOKEN_ENCRYPTION_KEY` — Secret aleatório forte e independente dos demais segredos.

Não substituir `AUTH_SESSION_SECRET`; a chave de criptografia do Drive deve ser separada.

Os valores abaixo já estão versionados por não serem segredos:
- `GOOGLE_DRIVE_OAUTH_REDIRECT_URI`;
- `DOCUMENTS_PORTAL_RETURN_URL`.

## Consentimento institucional

Depois do deploy com as configurações acima:

1. entrar no Portal com conta Desenvolvedor;
2. abrir **Central de Documentos**;
3. liberar a própria capability de Leitura se ainda estiver desligada;
4. selecionar **Conectar Google Drive**;
5. autenticar com a conta institucional correta;
6. aceitar o escopo solicitado;
7. retornar automaticamente à Central.

O refresh token retornado pelo Google é criptografado pelo Worker antes de ser persistido no D1. O navegador não recebe esse token.

## Validação obrigatória

Após a conexão:

- abrir Meu Drive;
- entrar em pelo menos uma pasta/subpasta;
- pesquisar um nome de arquivo;
- abrir um PDF permitido;
- confirmar que o PDF aparece dentro do Portal;
- confirmar que nenhuma escrita ocorreu;
- verificar no PostHog somente eventos técnicos permitidos;
- conferir que não chegaram nomes de arquivo, fileId, pesquisa ou conteúdo do PDF.

## Produção

O projeto em modo Testing é apenas transição de desenvolvimento. Para o escopo restrito `drive`, a publicação definitiva precisa seguir os requisitos vigentes de verificação/conformidade do Google antes de ser tratada como integração estável de produção.
