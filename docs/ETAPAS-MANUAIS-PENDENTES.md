# Etapas manuais pendentes — Canal do Cidadão / Conselho V1

Este checklist reúne somente o que exige acesso aos painéis externos ou validação institucional. O código correspondente já deve estar preparado antes dessas etapas.

## 1. Cloudflare Worker — identificar o Desenvolvedor

Criar/configurar a variável:

```text
AUTH_DEVELOPER_USERNAMES=Wellyton Ritter Honorato
```

O Worker normaliza o valor para o mesmo formato usado internamente pelo login (`wellyton.ritter.honorato`).

A migração dos administradores antigos fica **desligada por padrão**:

```text
AUTH_MIGRATE_LEGACY_ADMINS=false
```

Primeiro confirmar que a conta de Wellyton entra normalmente e mantém `role=admin`. Somente depois disso a migração poderá ser ativada deliberadamente.

## 2. Cloudflare Worker — segredo do rate limit

Criar um segredo aleatório independente:

```text
AUTH_RATE_LIMIT_SECRET=<valor-aleatorio-longo>
```

Não reutilizar senha pessoal, chave Firebase ou `AUTH_SESSION_SECRET`.

## 3. Firebase — criar/conectar o projeto

Habilitar:

- Cloud Firestore;
- Cloud Storage;
- Firebase Authentication / Identity Platform com provedor E-mail/senha para o espelho de verificação.

Configurar no Worker:

```text
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
FIREBASE_WEB_API_KEY
FIREBASE_STORAGE_BUCKET
```

A chave privada deve ficar como Secret no Cloudflare, nunca no GitHub.

## 4. Firebase — publicar regras privadas

O repositório já contém:

```text
firebase/firestore.rules
firebase/storage.rules
firebase.json
```

Publicar essas regras no projeto Firebase correspondente. Na V1 elas negam leitura/escrita direta por clientes Firebase; o acesso do portal ocorre pelo Worker/conta de serviço.

## 5. IAM da conta de serviço

Conceder somente as permissões necessárias para o Worker utilizar:

- documentos do Firestore usados pelo módulo do Conselho;
- objetos do bucket de anexos;
- operações de Identity Platform/Firebase Authentication necessárias à verificação de e-mail.

Evitar papéis amplos de proprietário/editor quando não forem necessários.

## 6. Teste controlado antes da migração dos cargos

Com:

```text
AUTH_REQUIRE_EMAIL_VERIFICATION=false
AUTH_MIGRATE_LEGACY_ADMINS=false
```

realizar:

1. entrar como Wellyton;
2. confirmar que Guia, Recepção, Monitoramento e administração continuam disponíveis;
3. criar uma conta cidadã de teste;
4. confirmar que nomes institucionais reservados não podem ser usados no auto cadastro;
5. confirmar que o cidadão não vê chat nem profissionais;
6. testar manifestação, protocolo, resposta, histórico, notificação e anexos;
7. testar manifestação sem e-mail;
8. vincular e-mail à conta cidadã e confirmar mudança para `Sigilosa` inclusive em protocolos anteriores;
9. testar envio e confirmação real de e-mail;
10. confirmar que o painel do Conselho não mostra e-mail nem nome de usuário do cidadão;
11. confirmar que o nome original do arquivo anexado não aparece no painel nem no caminho do objeto novo;
12. tentar enviar arquivo com extensão/MIME incompatível e confirmar que o Worker rejeita pela assinatura real do conteúdo;
13. confirmar que PDF é entregue como download e que JPG/PNG são servidos apenas após autorização.

## 7. Migrar os cargos antigos

Somente depois que `AUTH_DEVELOPER_USERNAMES` estiver confirmado e o passo anterior estiver concluído, alterar deliberadamente:

```text
AUTH_MIGRATE_LEGACY_ADMINS=true
```

Então:

- Wellyton permanece `admin` / Desenvolvedor;
- contas antigas que estavam como Desenvolvedor apenas para acesso operacional migram para `coordenacao`;
- Coordenação mantém Guia, Conferência da Recepção, Monitoramento e gestão apenas de médicos/recepção.

Depois de conferir a migração, a flag pode voltar para `false`; as contas já migradas permanecem com o novo perfil.

## 8. Funções do Conselho

Após o deploy controlado:

- Wellyton: manter Desenvolvedor e atribuir `council_role=membro`;
- Elizabete: atribuir `council_role=presidente`;
- demais usuários não recebem função do Conselho automaticamente.

## 9. Migração do e-mail dos profissionais/institucionais

Primeiro manter:

```text
AUTH_REQUIRE_EMAIL_VERIFICATION=false
```

Pedir que médicos, Recepção, Coordenação, Desenvolvedor e contas com função no Conselho cadastrem e confirmem e-mail.

Depois de testar o fluxo e garantir que todos conseguem chegar à tela `/conta/`, alterar para:

```text
AUTH_REQUIRE_EMAIL_VERIFICATION=true
```

Quando ativado, o login continua funcionando, mas as demais ferramentas ficam bloqueadas até a confirmação. A tela da conta permanece acessível para regularização. Isso vale também para contas com função `membro` ou `presidente` no Conselho.

## 10. Validação institucional antes de abrir ao público

Revisar com o Conselho/gestão municipal:

- texto público do canal;
- tipos de manifestação;
- quem pode responder oficialmente;
- política de retenção/arquivamento;
- aviso de privacidade e orientações ao cidadão;
- fluxo para situações que não devem ser tratadas apenas como manifestação administrativa.

O site já diferencia o Canal do Conselho de atendimento assistencial e informa que ele não realiza agendamento, não altera solicitação da Regulação e não substitui atendimento de urgência/emergência. O texto institucional final ainda deve ser validado antes da abertura pública.

## Não fazer na primeira publicação

Deixar desativados até fase posterior:

- feed social;
- amizade/chat cidadão-profissional;
- descoberta pública de profissionais;
- autenticação adicional por novo dispositivo;
- recuperação por chave sem e-mail;
- App Check/reCAPTCHA Enterprise até o projeto Firebase estar conectado e testado.

## Regra de segurança da publicação

Não mesclar/publicar o PR enquanto Firebase/Cloudflare não estiverem configurados e o teste controlado acima não tiver sido concluído. O PR deve permanecer em rascunho até lá.
