# Canal do Cidadão e Conselho Municipal de Saúde — V1

## Situação

Esta versão implementa a estrutura do Canal do Cidadão em uma branch separada. Ela não deve ser incorporada à `main` antes da configuração dos itens marcados em **Antes do deploy**.

## Entregas da V1

- Login único em `/login/`, apresentado como porta de entrada do portal.
- Auto cadastro de cidadão por usuário + senha em `/cadastro/`.
- Hub do Cidadão em `/cidadao/`.
- Evolução da conta cidadã em Bronze, Prata e Ouro.
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

A V1 bloqueia a desativação acidental da própria conta Desenvolvedor e também impede que o Desenvolvedor remova o próprio nível técnico pelo formulário comum de usuários.

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
- evolução Bronze/Prata/Ouro;
- sem listagem/chat com profissionais na V1.

### Conselho

`council_role` é independente do perfil primário.

- `presidente`: lê manifestações, responde oficialmente, altera andamento e registra observações internas.
- `membro`: lê manifestações, histórico e registra observações internas.

## Evolução da conta do cidadão

Os níveis são internos deste portal e não têm relação com os níveis oficiais da conta Gov.br. Eles não alteram prioridade, credibilidade ou força de uma manifestação.

### Bronze

Requisito: criar a conta com usuário + senha.

Já libera:

- manifestações ao Conselho;
- protocolos;
- acompanhamento e conversa vinculada ao protocolo;
- notificações internas.

### Prata

Requisito: confirmar o e-mail de segurança.

Além do Bronze, libera:

- foto de perfil;
- preparação do perfil social;
- preferência para receber pedidos de amizade quando a camada social for ativada.

### Ouro

Requisito planejado: proteção reforçada em novo dispositivo / segunda etapa de autenticação.

O Ouro ainda não pode ser alcançado na V1. A arquitetura já possui o nível e os gates correspondentes para futura liberação de dispositivos confiáveis e recursos sociais mais sensíveis.

Mesmo no Ouro, o cidadão não ganha acesso automático aos profissionais. A relação social continuará dependendo de amizade/autorização e da configuração de privacidade de cada usuário.

## Privacidade

O e-mail de segurança fica na tabela de autenticação e não é enviado ao documento Firestore da manifestação.

- o auto cadastro cidadão recebe somente usuário + senha;
- o formulário público não solicita nome de exibição, telefone, CPF ou e-mail;
- a interface orienta o cidadão a não usar nome completo ou outros dados pessoais no nome de usuário quando desejar preservar sua identificação;
- a foto de perfil fica bloqueada no Bronze e é liberada no Prata;
- a foto pertence ao perfil da conta e não é mostrada ao Conselho dentro da manifestação;
- cidadão sem e-mail: interface usa `anonima`/sem identificação por e-mail ou telefone;
- cidadão com e-mail: interface usa `sigilosa`;
- o nível Bronze/Prata/Ouro é separado do rótulo de privacidade da manifestação;
- Presidente e membros do Conselho recebem apenas a indicação do nível de privacidade e `Identidade protegida`;
- o painel institucional não exibe o e-mail de segurança.

O vínculo técnico entre protocolo e conta é mantido em D1 para garantir que somente o autor consulte e responda à própria manifestação. Esse índice não contém o texto da manifestação.

## Migração segura da verificação de e-mail

A ativação futura de `AUTH_REQUIRE_EMAIL_VERIFICATION=true` não bloqueia o login de uma conta profissional válida. A conta consegue autenticar e é encaminhada para `/conta/`, onde permanecem liberadas apenas as rotas necessárias para senha, e-mail e confirmação. As demais APIs profissionais passam a retornar `EMAIL_VERIFICATION_REQUIRED` até a confirmação.

Isso evita o cenário em que um médico ou coordenador seria bloqueado antes de conseguir cadastrar o próprio e-mail.

## Antes do deploy

### 1. Identificar o Desenvolvedor real

No Worker, configurar `AUTH_DEVELOPER_USERNAMES` com o nome de usuário do Wellyton no portal.

Exemplo conceitual, sem usar valor real no GitHub:

```text
AUTH_DEVELOPER_USERNAMES=<usuario-do-desenvolvedor>
```

A comparação normaliza espaços, maiúsculas e acentos da mesma forma que o login do portal.

A migração dos administradores legados também exige `AUTH_MIGRATE_LEGACY_ADMINS=true`. Essa flag permanece `false` por padrão e só deve ser ligada temporariamente depois de confirmar a conta Desenvolvedor correta.

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

1. criar uma Conta Bronze de cidadão;
2. confirmar que a foto de perfil permanece bloqueada;
3. cadastrar e-mail em `/conta/`;
4. solicitar verificação;
5. abrir o link recebido;
6. voltar à conta;
7. confirmar que `emailVerified` atualiza e a conta passa para Prata;
8. confirmar que a foto de perfil é desbloqueada;
9. testar cidadão sem e-mail e cidadão com e-mail;
10. testar uma conta profissional existente;
11. confirmar que uma conta profissional ainda consegue entrar em `/conta/` quando a exigência estiver ativa;
12. confirmar que as demais ferramentas ficam bloqueadas somente até a verificação ser concluída.

### 4. Não ativar a exigência dos profissionais imediatamente

Durante a migração:

```toml
AUTH_REQUIRE_EMAIL_VERIFICATION = "false"
```

O Hub Profissional já orienta quem ainda não confirmou o e-mail.

Somente depois que o Firebase estiver funcionando e as contas existentes puderem concluir a confirmação, alterar para:

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
5. Desenvolvedor não consegue se desativar ou se rebaixar acidentalmente pelo formulário comum;
6. cidadão cria conta fornecendo apenas usuário + senha e recebe nível Bronze;
7. foto de perfil permanece bloqueada no Bronze;
8. cidadão confirma e-mail, passa a Prata e desbloqueia a foto;
9. cidadão Bronze não consegue ativar a preferência futura de pedidos de amizade;
10. cidadão Prata consegue salvar essa preferência, embora a rede social continue desativada;
11. cidadão não enxerga chat/lista de profissionais;
12. cidadão abre manifestação e recebe protocolo;
13. segunda manifestação dentro de duas horas é recusada;
14. cidadão consegue responder no protocolo mesmo durante as duas horas;
15. Presidente vê a manifestação sem o e-mail da conta e sem foto social;
16. membro do Conselho vê e registra observação interna, mas não envia resposta oficial;
17. Presidente altera o status e responde;
18. cidadão recebe a notificação interna e vê a atualização;
19. anexos ficam privados e somente autor/Conselho autorizado conseguem abrir;
20. conta com e-mail aparece como sigilosa;
21. conta sem e-mail não ganha e-mail/telefone por preenchimento automático;
22. ativar temporariamente a exigência de e-mail em ambiente controlado e confirmar que o profissional consegue entrar em `/conta/`, mas não nas APIs protegidas;
23. logs e banco D1 não armazenam o texto clínico da manifestação fora do Firestore.

## Próximas fases, fora da V1

- desafio adicional quando a conta entrar em dispositivo novo e consequente liberação do nível Ouro;
- App Check/reCAPTCHA Enterprise depois que o Firebase estiver conectado;
- recuperação de conta sem e-mail por chave de recuperação;
- amizade e chat cidadão↔profissional somente mediante relação autorizada;
- feed/comunidade pública somente após definição institucional e de moderação.
