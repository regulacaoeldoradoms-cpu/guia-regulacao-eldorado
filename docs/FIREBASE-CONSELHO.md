# Configuração do Firebase — Canal do Conselho

Este arquivo descreve somente a infraestrutura necessária para ativar o armazenamento e a verificação de e-mail da V1. Nenhuma credencial real deve ser salva no GitHub.

## Serviços utilizados

- Cloud Firestore: manifestações, mensagens, histórico, observações internas e metadados de anexos.
- Cloud Storage for Firebase / Google Cloud Storage: anexos privados.
- Firebase Authentication / Identity Platform: espelho técnico usado apenas para confirmação do e-mail de segurança.

A autenticação principal do Portal da Regulação continua sendo feita pelo Worker + D1 com usuário e senha. O cidadão não precisa usar o Firebase diretamente nem recebe credenciais do projeto.

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

- `FIREBASE_PRIVATE_KEY` deve ser Secret.
- Não colar chave privada no repositório, HTML, JavaScript público ou documentação.
- A conta de serviço deve receber o menor conjunto de permissões necessário.

## Separação de dados

O painel do Conselho não recebe o e-mail de segurança.

- D1: conta, e-mail de segurança, flags de verificação e índices técnicos.
- Firestore: conteúdo da manifestação.
- Storage: arquivo do anexo.
- O documento da manifestação não contém o e-mail da conta.

## Teste de ativação

1. Conectar o Firebase no Worker.
2. Manter `AUTH_REQUIRE_EMAIL_VERIFICATION=false`.
3. Criar uma conta de cidadão de teste sem e-mail e confirmar acesso ao Hub.
4. Adicionar e-mail na página da conta.
5. Solicitar verificação.
6. Abrir o link recebido.
7. Voltar à página da conta e confirmar que o e-mail aparece como verificado.
8. Criar manifestação e confirmar que o painel do Conselho mostra apenas `Sigilosa`, sem endereço de e-mail.
9. Testar uma conta profissional existente.
10. Somente após regularizar os profissionais, avaliar alterar `AUTH_REQUIRE_EMAIL_VERIFICATION=true`.

## Itens deliberadamente posteriores

- verificação adicional ao entrar em dispositivo novo;
- App Check/reCAPTCHA Enterprise;
- chave de recuperação para conta sem e-mail;
- amizade/chat cidadão-profissional;
- feed público.
