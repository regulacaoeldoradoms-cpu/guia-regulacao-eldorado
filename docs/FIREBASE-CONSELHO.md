# Configuração do Firebase — Canal do Conselho

Este arquivo descreve somente a infraestrutura necessária para ativar o armazenamento e a verificação de e-mail da V1. Nenhuma credencial real deve ser salva no GitHub.

## Serviços utilizados

- Cloud Firestore: manifestações, mensagens, histórico, observações internas e metadados de anexos.
- Cloud Storage for Firebase / Google Cloud Storage: anexos privados.
- Firebase Authentication / Identity Platform: espelho técnico usado apenas para confirmação do e-mail de segurança.

A autenticação principal do Portal da Regulação continua sendo feita pelo Worker + D1 com usuário e senha. O cidadão não precisa usar o Firebase diretamente nem recebe credenciais do projeto.

## Acesso ao banco e aos anexos

A V1 foi desenhada para **não permitir acesso Firebase direto pelo navegador**.

Os arquivos versionados:

- `firebase/firestore.rules`
- `firebase/storage.rules`
- `firebase.json`

negam leitura e escrita direta por clientes Firebase. O Worker acessa Firestore e Storage por conta de serviço/IAM depois de validar a sessão e a permissão do usuário no Portal.

Isso significa que uma pessoa não ganha acesso às manifestações apenas por descobrir o identificador do projeto Firebase ou tentar usar o SDK do Firebase fora do site.

## Authentication

Para o fluxo de verificação por e-mail, habilitar o provedor **E-mail/senha** no Firebase Authentication. O Worker cria uma identidade técnica espelhada com UID derivado do usuário do portal, usa uma senha aleatória temporária somente no backend e solicita ao Firebase o envio do link de confirmação.

A senha técnica do espelho Firebase nunca é retornada ao navegador e não substitui a senha da conta do portal.

## Variáveis/segredos do Worker

Configurar no ambiente do Cloudflare Worker:

```text
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
FIREBASE_WEB_API_KEY
FIREBASE_STORAGE_BUCKET
```

Também configurar:

```text
AUTH_DEVELOPER_USERNAMES
AUTH_RATE_LIMIT_SECRET
```

- `FIREBASE_PRIVATE_KEY` deve ser Secret.
- `AUTH_RATE_LIMIT_SECRET` deve ser diferente do segredo de sessão.
- Não colar chave privada no repositório, HTML, JavaScript público ou documentação.
- A conta de serviço deve receber o menor conjunto de permissões necessário.
- `worker/.dev.vars.example` existe somente como modelo e contém placeholders.

## Separação de dados

O painel do Conselho não recebe o e-mail de segurança.

- D1: conta, e-mail de segurança, flags de verificação, índice técnico protocolo↔conta, rate limits, notificações genéricas e auditoria sem texto da manifestação.
- Firestore: conteúdo da manifestação.
- Storage: arquivo do anexo.
- O documento principal da manifestação não contém e-mail nem nome de usuário do cidadão.
- O caminho interno do objeto no Storage não é devolvido pela API ao navegador.

A modalidade de privacidade é congelada na criação. E-mail não verificado produz nova manifestação `anonima`; após a confirmação, o autor pode escolher `sigilosa` ou `identificada`, com padrão/fallback `sigilosa`. Vincular, confirmar ou substituir e-mail não altera protocolos anteriores. A V1 não permite simplesmente apagar um e-mail já confirmado; é possível substituí-lo por outro endereço e confirmá-lo.

## Teste de ativação

1. Conectar o Firebase no Worker.
2. Publicar/configurar as regras privadas de Firestore e Storage fornecidas no repositório.
3. Manter `AUTH_REQUIRE_EMAIL_VERIFICATION=false`.
4. Criar uma conta de cidadão de teste sem e-mail e confirmar acesso ao Hub.
5. Adicionar e-mail na página da conta.
6. Solicitar verificação.
7. Abrir o link recebido.
8. Voltar à página da conta e confirmar que o e-mail aparece como verificado.
9. Sem e-mail verificado, tentar solicitar `sigilosa` e `identificada` diretamente pela API e confirmar que ambas resultam em `anonima`.
10. Confirmar o e-mail e criar uma manifestação com a opção padrão; o resultado deve ser `sigilosa`, sem endereço de e-mail ou nome de usuário da conta.
11. Criar outra manifestação escolhendo `identificada` e confirmar que somente nome de perfil, @ e cargo/função autorizados aparecem.
12. Confirmar que o protocolo anônimo criado antes da verificação permanece `anonima`.
13. Testar uma conta profissional existente.
14. Manter `AUTH_REQUIRE_EMAIL_VERIFICATION=false` na V1 até concluir todos os testes controlados de acesso profissional.
15. Somente após nova decisão institucional e validação em ambiente controlado considerar a ativação em produção.

## Itens deliberadamente posteriores

- verificação adicional ao entrar em dispositivo novo;
- App Check/reCAPTCHA Enterprise;
- chave de recuperação para conta sem e-mail;
- amizade/chat cidadão-profissional;
- feed público.
