# Canal do Cidadão e Conselho Municipal de Saúde — V1

## Situação

Esta versão implementa o Canal do Cidadão integrado ao Portal da Regulação, com implantação controlada de autenticação, Firebase e funções do Conselho antes da abertura pública.

## Princípio de identidade: uma conta, vários módulos

O portal não cria uma segunda identidade para quem já possui perfil profissional.

A conta é única. O usuário mantém o mesmo:

- nome de conta;
- @nome de usuário;
- foto de perfil;
- e-mail de segurança;
- nível Bronze/Prata/Ouro;
- histórico de segurança da conta.

O campo `role` indica a função principal do usuário no portal e não deixa de existir quando ele entra no Canal do Cidadão:

- `medico` continua aparecendo como Médico;
- `recepcao` continua aparecendo como Recepção;
- `coordenacao` continua aparecendo como Coordenação;
- `admin` continua aparecendo como Desenvolvedor;
- `cidadao` é usado para quem não possui função profissional no portal.

O Canal do Cidadão é um módulo disponível para qualquer conta ativa, não uma troca de perfil.

Em futuras funções sociais ou diretórios públicos, uma conta profissional deverá continuar aparecendo com seu cargo/função de saúde, e não como “Cidadão”, mesmo quando estiver navegando no Canal do Cidadão.

## Entregas da V1

- Login único em `/login/`.
- Autocadastro público por usuário + senha em `/cadastro/`.
- Hub do Cidadão em `/cidadao/`.
- Canal do Cidadão disponível também para contas profissionais existentes.
- Evolução da mesma conta em Bronze, Prata e Ouro.
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
- D1 para autenticação, índice técnico de propriedade, contador de protocolo, notificações genéricas, auditoria e rate limits.
- Perfil `coordenacao` separado de `admin`/Desenvolvedor.
- Funções independentes do Conselho: `membro` e `presidente`.
- Chat cidadão-profissional e feed social ainda fora da V1.

## Perfis e permissões

### Desenvolvedor (`admin`)

- administração técnica;
- Guia Médico;
- Conferência da Recepção;
- Monitoramento;
- gestão de perfis e funções institucionais;
- acesso ao Conselho somente quando também possuir `council_role=membro` ou `presidente`;
- acesso ao Canal do Cidadão com a mesma conta.

A V1 bloqueia a desativação acidental da própria conta Desenvolvedor e impede a remoção do próprio nível técnico pelo formulário comum.

### Coordenação (`coordenacao`)

- Guia Médico;
- pré-regulação com IA para apoio operacional dentro dos limites definidos pelo sistema;
- Conferência da Recepção;
- Monitoramento;
- criação/gestão somente de contas `medico` e `recepcao`;
- sem acesso automático ao Conselho;
- sem permissão para promover contas a Desenvolvedor;
- acesso ao Canal do Cidadão com a mesma conta.

### Médico (`medico`)

- Guia Médico e recursos profissionais correspondentes;
- acesso ao Canal do Cidadão com a mesma conta.

### Recepção (`recepcao`)

- Conferência da Recepção e recursos profissionais autorizados;
- acesso ao Canal do Cidadão com a mesma conta.

### Cidadão (`cidadao`)

Representa a conta que não possui função profissional no portal.

- Canal do Cidadão;
- manifestações próprias;
- notificações próprias;
- conta e segurança;
- evolução Bronze/Prata/Ouro;
- sem descoberta/chat direto com profissionais na V1.

### Conselho

`council_role` é independente do perfil principal.

- `presidente`: lê manifestações, responde oficialmente, altera andamento e registra observações internas;
- `membro`: lê manifestações, histórico e registra observações internas.

Quando o mesmo usuário também possui função no Conselho, o sistema mantém separadas as ações da própria manifestação e as ações institucionais do Conselho. Essa separação é de autorização da operação, não de identidade da conta.

## Evolução Bronze, Prata e Ouro

Os níveis pertencem à conta inteira e valem em todos os módulos do portal. Não existe um nível profissional e outro nível cidadão.

Eles são uma classificação interna do portal e não têm relação com os níveis oficiais da conta Gov.br. Também não alteram prioridade, credibilidade ou força de uma manifestação.

### Bronze

Requisito: conta criada com usuário + senha.

### Prata

Requisito: e-mail de segurança confirmado.

Desbloqueia/prepara:

- foto de perfil;
- perfil social futuro;
- preferência para receber pedidos de amizade quando a camada social existir.

A mesma foto é reutilizada em toda a conta. Não existe uma foto “profissional” e outra “cidadã”.

### Ouro

Requisito planejado: proteção reforçada em novo dispositivo / segunda etapa de autenticação.

O Ouro ainda não pode ser alcançado na V1.

## Privacidade das manifestações

A identidade da conta e a privacidade da manifestação são assuntos separados.

O e-mail de segurança fica na autenticação e não é enviado ao documento Firestore da manifestação.

### Conta sem função profissional

Uma conta `cidadao` sem e-mail pode abrir manifestação marcada como `anonima`/sem identificação por e-mail ou telefone.

Quando passa a possuir e-mail, suas manifestações passam a ser tratadas como `sigilosa`, inclusive protocolos anteriores quando ocorre a sincronização prevista.

### Conta profissional

Contas `medico`, `recepcao`, `coordenacao` e `admin` devem confirmar e-mail para usar o Canal do Cidadão. Portanto, manifestações abertas por essas contas são sempre tratadas como `sigilosa`, nunca como anônimas.

O painel institucional do Conselho não recebe automaticamente:

- e-mail de segurança;
- @nome de usuário;
- foto do perfil;
- cargo profissional;
- identificadores técnicos de autenticação.

O painel recebe a indicação de privacidade e a manifestação com identidade protegida. O próprio texto ou anexo pode revelar a identidade se o usuário incluir dados pessoais.

## Mesma foto e futuro perfil social

`avatar_data` pertence à conta e é a única foto de perfil usada pelo portal.

No futuro, quando recursos sociais forem ativados:

- usuário profissional deverá ser exibido pelo cargo/função profissional;
- o fato de ele ter acesso ao Canal do Cidadão não o transforma visualmente em “Cidadão”;
- cidadão sem função profissional continua identificado como cidadão;
- amizade/chat não serão liberados automaticamente apenas por compartilhar o mesmo portal.

## Separação operacional para usuário que também integra o Conselho

Uma conta pode acumular, por exemplo:

- `role=admin`;
- `council_role=presidente`.

Essa pessoa usa a mesma identidade em todo o portal. Entretanto, ao consultar ou responder a uma manifestação própria pelo Canal do Cidadão, o backend exige propriedade do protocolo e impede que a ação seja interpretada como resposta oficial do Conselho.

Resposta oficial, alteração de andamento e observações internas continuam restritas ao painel institucional e às permissões do Conselho.

## Segurança e e-mail profissional

Durante a migração, `AUTH_REQUIRE_EMAIL_VERIFICATION` pode permanecer temporariamente `false` para não bloquear contas antigas antes que consigam configurar o endereço.

Mesmo nesse período, o Canal do Cidadão exige e-mail confirmado de contas profissionais antes de aceitar uma nova manifestação, garantindo que elas sejam sempre sigilosas.

Depois que todas as contas profissionais estiverem regularizadas, a intenção é ativar:

```toml
AUTH_REQUIRE_EMAIL_VERIFICATION = "true"
```

O login continua acessível e a página `/conta/` permanece disponível para regularização.

## Firebase e dados

Configuração esperada no Worker:

```text
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
FIREBASE_WEB_API_KEY
FIREBASE_STORAGE_BUCKET
```

`FIREBASE_PRIVATE_KEY` deve permanecer como Secret do Worker.

As regras do Firestore e Storage negam acesso direto pelo cliente; o portal acessa esses recursos pelo Worker/conta de serviço autorizada.

## Testes mínimos antes de liberar ao público

1. Médico continua identificado como Médico em todos os módulos.
2. Recepção continua identificada como Recepção.
3. Coordenação continua identificada como Coordenação.
4. Desenvolvedor continua identificado como Desenvolvedor.
5. Todos esses perfis veem o cartão do Canal do Cidadão no Hub.
6. Entrar no Canal não troca o perfil visual para “Cidadão”.
7. O mesmo avatar aparece nos ambientes da mesma conta.
8. Conta com e-mail verificado aparece como Prata, independentemente do perfil principal.
9. Conta Bronze não consegue alterar foto nem ativar preferência social reservada ao Prata.
10. Conta profissional sem e-mail verificado não consegue abrir nova manifestação.
11. Conta profissional verificada abre manifestação sempre como `sigilosa`.
12. Conta `cidadao` sem e-mail pode abrir manifestação anônima.
13. Segunda manifestação em menos de duas horas é recusada.
14. Autor continua podendo responder a protocolo existente.
15. Usuário que também integra o Conselho consegue responder à própria manifestação sem transformar a resposta em manifestação institucional.
16. Presidente vê a manifestação sem e-mail, @, foto ou cargo do autor.
17. Membro vê e registra observação interna, mas não envia resposta oficial.
18. Presidente altera status e responde oficialmente.
19. Autor recebe notificação interna e vê histórico atualizado.
20. Anexos permanecem privados e acessíveis somente ao autor e Conselho autorizado.
21. PDF é entregue como download; JPG/PNG somente após autorização.
22. Logs e D1 não armazenam o texto integral da manifestação fora do Firestore.

## Próximas fases, fora da V1

- desafio adicional em novo dispositivo e liberação efetiva do nível Ouro;
- recuperação de conta por mecanismos adicionais;
- amizade e chat entre cidadãos e profissionais somente mediante autorização;
- perfis sociais mantendo cargo profissional quando aplicável;
- feed/comunidade pública após definição institucional de moderação e privacidade;
- App Check/reCAPTCHA Enterprise após conclusão da implantação e dos testes.
