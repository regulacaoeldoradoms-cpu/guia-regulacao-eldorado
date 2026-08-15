# Canal do Cidadão e Conselho Municipal de Saúde — V1

## Situação

Esta versão implementa a estrutura do Canal do Cidadão em uma branch separada. Ela não deve ser incorporada à `main` antes da configuração dos itens marcados em **Antes do deploy**.

## Entregas da V1

- Login único em `/login/`.
- Auto cadastro de cidadão por usuário + senha em `/cadastro/`.
- Hub do Cidadão em `/cidadao/`.
- Página pública do Conselho em `/conselho/`.
- Painel institucional em `/conselho/painel/`.
- Tipos de manifestação: sugestão, reclamação, elogio e denúncia.
- Protocolo `CMS-AAAA-000000`.
- Linha do tempo, mensagens, notificações internas e observações internas do Conselho.
- Anexos privados JPG/PNG/PDF, até 5 MB cada e máximo de 5 por manifestação.
- Limite de uma nova manifestação a cada duas horas por conta.
- Respostas dentro de manifestação existente não entram nesse limite.
- Firestore para conteúdo das manifestações.
- Cloud Storage/Firebase Storage para anexos.
- D1 somente para autenticação, índice técnico de propriedade, contador de protocolo, notificações genéricas e rate limits.
- Perfil `coordenacao` separado de `admin`/Desenvolvedor.
- Funções independentes do Conselho: `membro` e `presidente`.
- Cidadãos isolados do chat e do diretório profissional.
- Preferência `accept_friend_requests` criada somente para preparar uma função futura; amizade e feed não fazem parte da V1.

## Perfis e permissões

### Desenvolvedor (`admin`)

- administração técnica;
- Guia Médico;
- Conferência da Recepção;
- Monitoramento;
- gestão de perfis subordinados;
- atribuição das funções do Conselho;
- acesso ao Conselho apenas se também receber `council_role=membro` ou `presidente`.

### Coordenação (`coordenacao`)

- Guia Médico;
- Conferência da Recepção;
- Monitoramento;
- criação/gestão somente de contas `medico` e `recepcao`;
- não recebe automaticamente acesso ao Conselho;
- não pode promover a si própria nem terceiros a Desenvolvedor.

### Médico (`medico`)

- Guia Médico e recursos profissionais correspondentes.

### Recepção (`recepcao`)

- Conferência da Recepção e chat profissional autorizado.

### Cidadão (`cidadao`)

- Hub do Cidadão;
- manifestações próprias;
- notificações próprias;
- conta e segurança;
- sem listagem/chat com profissionais na V1.

### Conselho

`council_role` é independente do perfil primário.

- `presidente`: lê manifestações, responde oficialmente, altera andamento e registra observações internas.
- `membro`: lê manifestações, histórico e registra observações internas.

## Privacidade

O e-mail de segurança fica na tabela de autenticação e não é enviado ao documento Firestore da manifestação.

- cidadão sem e-mail: interface usa `anonima`/sem identificação por e-mail ou telefone;
- cidadão com e-mail: interface usa `sigilosa`;
- Presidente e membros do Conselho recebem apenas a indicação do nível de privacidade e `Identidade protegida`;
- o painel institucional não exibe o e-mail de segurança.

O vínculo técnico entre protocolo e conta é mantido em D1 para garantir que somente o autor consulte e responda à própria manifestação. Esse índice não contém o texto da manifestação.

## Antes do deploy

### 1. Identificar o Desenvolvedor real

No Worker, configurar `AUTH_DEVELOPER_USERNAMES` com o nome de usuário do Wellyton no portal.

Exemplo conceitual, sem usar valor real no GitHub:

```text
AUTH_DEVELOPER_USERNAMES=<usuario-do-desenvolvedor>
```

Após configurado, contas antigas que ainda estejam como `admin` e não constem nessa lista migram automaticamente para `coordenacao`.

**Não publicar a migração sem confirmar esse valor.**

### 2. Criar/conectar o projeto Firebase

Configurar no Worker:

```text
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
FIREBASE_WEB_API_KEY
FIREBASE_STORAGE_BUCKET
```

`FIREBASE_PRIVATE_KEY` deve ser Secret do Worker, nunca arquivo do repositório.

A conta de serviço deve receber somente os privilégios necessários para os recursos utilizados.

### 3. Testar verificação de e-mail

Com Firebase configurado:

1. cadastrar e-mail em `/conta/`;
2. solicitar verificação;
3. abrir o link recebido;
4. voltar à conta;
5. confirmar que `emailVerified` atualiza;
6. testar cidadão sem e-mail e cidadão com e-mail;
7. testar uma conta profissional existente.

### 4. Não ativar a exigência dos profissionais imediatamente

Durante a migração:

```toml
AUTH_REQUIRE_EMAIL_VERIFICATION = "false"
```

O Hub Profissional já orienta quem ainda não confirmou o e-mail.

Somente depois que as contas existentes forem regularizadas, alterar para:

```toml
AUTH_REQUIRE_EMAIL_VERIFICATION = "true"
```

### 5. Definir funções do Conselho

Depois do deploy controlado:

- Wellyton: manter perfil Desenvolvedor e atribuir `council_role=membro`;
- Elizabete: atribuir `council_role=presidente`;
- Coordenação não recebe função do Conselho automaticamente.

## Testes mínimos antes de liberar ao público

1. médico entra pelo `/login/` e continua no ambiente profissional;
2. recepção entra e mantém a Conferência;
3. Coordenador vê Guia, Recepção, Monitoramento e usuários subordinados;
4. Coordenador não consegue atribuir `admin`, `coordenacao` ou função do Conselho;
5. cidadão cria conta sem e-mail;
6. cidadão não enxerga chat/lista de profissionais;
7. cidadão abre manifestação e recebe protocolo;
8. segunda manifestação dentro de duas horas é recusada;
9. cidadão consegue responder no protocolo mesmo durante as duas horas;
10. Presidente vê a manifestação sem o e-mail da conta;
11. membro do Conselho vê e registra observação interna, mas não envia resposta oficial;
12. Presidente altera o status e responde;
13. cidadão recebe a notificação interna e vê a atualização;
14. anexos ficam privados e somente autor/Conselho autorizado conseguem abrir;
15. conta com e-mail aparece como sigilosa;
16. conta sem e-mail não ganha e-mail/telefone por preenchimento automático;
17. logs e banco D1 não armazenam o texto clínico da manifestação fora do Firestore.

## Próximas fases, fora da V1

- desafio adicional quando a conta entrar em dispositivo novo;
- App Check/reCAPTCHA Enterprise depois que o Firebase estiver conectado;
- recuperação de conta sem e-mail por chave de recuperação;
- amizade e chat cidadão↔profissional somente mediante relação autorizada;
- preferência para receber pedidos de amizade já preparada no modelo;
- feed/comunidade pública somente após definição institucional e de moderação.
