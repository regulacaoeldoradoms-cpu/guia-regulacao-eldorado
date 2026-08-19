# Canal do Cidadão e Conselho Municipal de Saúde — V1

## Situação

Esta versão implementa o Canal do Cidadão integrado ao Portal da Regulação, com implantação controlada de autenticação, Firebase e funções do Conselho antes da abertura pública.

## Princípio de identidade: uma conta, vários módulos

O portal não cria uma segunda identidade para quem já possui perfil profissional. A conta é única e mantém nome, @nome de usuário, foto de perfil, e-mail de segurança, nível Bronze/Prata/Ouro e histórico de segurança.

O campo `role` continua indicando a função principal em todos os módulos:

- `medico`: Médico;
- `recepcao`: Recepção;
- `coordenacao`: Coordenação;
- `admin`: Desenvolvedor;
- `cidadao`: pessoa sem função profissional no portal.

O Canal do Cidadão é um módulo da mesma conta, não uma troca de perfil. Em recursos sociais futuros, profissionais continuam aparecendo pelo cargo/função de saúde.

## Entregas da V1

- login único em `/login/`;
- autocadastro público por usuário + senha em `/cadastro/`;
- Canal do Cidadão em `/cidadao/`;
- página pública do Conselho em `/conselho/`;
- painel institucional em `/conselho/painel/`;
- tipos de manifestação: sugestão, reclamação, elogio e denúncia;
- protocolo `CMS-AAAA-000000`;
- linha do tempo, mensagens, notificações internas e observações internas;
- anexos privados JPG/PNG/PDF, até 5 MB cada e máximo de 5;
- uma nova manifestação a cada duas horas por conta;
- Firestore para conteúdo e Storage para anexos;
- D1 para autenticação, propriedade dos protocolos, auditoria, notificações e rate limits;
- `council_role=membro|presidente` separado do perfil principal;
- feed social e chat cidadão-profissional fora da V1.

## Perfis e permissões

### Desenvolvedor (`admin`)

Mantém administração técnica e os módulos profissionais autorizados. Só acessa o painel do Conselho se também possuir função `membro` ou `presidente`.

### Coordenação (`coordenacao`)

Mantém Guia Médico, pré-regulação com IA, Conferência da Recepção, Monitoramento e gestão apenas de contas subordinadas permitidas.

### Médico (`medico`)

Mantém Guia Médico e recursos profissionais correspondentes.

### Recepção (`recepcao`)

Mantém Conferência da Recepção e recursos profissionais autorizados.

### Cidadão (`cidadao`)

Representa a conta sem função profissional no portal.

### Conselho

`council_role` é independente do perfil principal:

- `membro`: lê manifestações, histórico, anexos e registra observações internas;
- `presidente`: possui as funções do membro e também responde oficialmente e altera o andamento.

### Regra da Presidência

Enquanto uma conta possuir `council_role=presidente`, ela **não pode abrir nova manifestação**. O bloqueio existe no backend e a ação de criação é ocultada no Canal do Cidadão.

A Presidência ainda pode consultar manifestações próprias já existentes, caso tenham sido criadas antes da atribuição da função.

## Bronze, Prata e Ouro

Os níveis pertencem à conta inteira e não criam um nível separado para o ambiente profissional.

- **Bronze:** usuário + senha.
- **Prata:** e-mail de segurança confirmado.
- **Ouro:** proteção reforçada em novo dispositivo / segunda etapa de autenticação, ainda futura.

Os níveis são internos do portal, não têm relação com os níveis oficiais da conta Gov.br e não alteram prioridade ou força de uma manifestação.

A foto de perfil é única para a conta e acompanha os diferentes módulos.

## Privacidade das manifestações

A privacidade é definida no momento em que cada manifestação é criada e fica congelada naquele protocolo.

### Anônima

Se o e-mail da conta **ainda não estiver verificado**, a nova manifestação é registrada como `anonima`, inclusive quando a conta pertence a Médico, Recepção, Coordenação ou Desenvolvedor.

Ter uma conta profissional, por si só, não força a manifestação a ser sigilosa.

### Conta verificada: escolha entre sigilosa e identificada

Quando `emailVerified=true`, o autor escolhe a modalidade de cada nova manifestação:

- `sigilosa`: o Conselho recebe o conteúdo, mas nome, @ e perfil do autor não são exibidos na manifestação;
- `identificada`: o Conselho recebe também uma identificação segura do perfil no momento do envio, contendo nome de perfil, @ e cargo/função quando houver.

A opção padrão para conta verificada é `sigilosa`. Se o cliente omitir ou enviar um valor inválido, o backend mantém a manifestação como sigilosa.

O e-mail de segurança nunca é incluído no documento da manifestação e continua restrito à camada de autenticação, inclusive quando o autor escolhe se identificar.

### Sem alteração retroativa

Uma manifestação criada como anônima permanece anônima mesmo se o usuário confirmar um e-mail posteriormente. Da mesma forma, uma manifestação criada como sigilosa ou identificada mantém sua modalidade original.

Alterações posteriores no e-mail não convertem retroativamente protocolos antigos.

O texto e os anexos podem revelar identidade se o próprio usuário incluir dados pessoais.

## Conta profissional e Canal do Cidadão

Médico, Recepção, Coordenação e Desenvolvedor usam a mesma conta no Canal do Cidadão. Não existe perfil cidadão paralelo.

Uma conta profissional sem e-mail verificado continua Bronze e pode abrir manifestação anônima, salvo se possuir a função de Presidente do Conselho.

Depois da confirmação do e-mail, a mesma conta passa a Prata e pode escolher, em cada novo envio, entre manifestação sigilosa e manifestação identificada.

## Usuário que também integra o Conselho

A identidade da conta continua única, mas o sistema mantém contexto operacional para não confundir uma ação pessoal com uma ação institucional.

Ao acessar uma manifestação própria pelo Canal do Cidadão, a resposta é tratada como resposta do autor. No painel do Conselho, ações seguem as permissões de `membro` ou `presidente`.

Essa separação é de autorização, não de identidade.

## Segurança e e-mail profissional

Durante a migração, `AUTH_REQUIRE_EMAIL_VERIFICATION=false` pode permanecer temporariamente para não bloquear contas antigas.

Isso não impede que uma conta profissional ainda não verificada use o Canal do Cidadão de forma anônima. Quando a exigência geral for ativada futuramente, o comportamento de acesso profissional deverá ser novamente validado em ambiente controlado.

## Firebase e dados

Configuração esperada no Worker:

```text
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
FIREBASE_WEB_API_KEY
FIREBASE_STORAGE_BUCKET
```

`FIREBASE_PRIVATE_KEY` permanece como Secret do Worker. Firestore e Storage não devem ser expostos diretamente ao cliente.

## Testes mínimos antes de liberar ao público

1. Médico, Recepção, Coordenação e Desenvolvedor mantêm seus próprios cargos no Canal do Cidadão.
2. O mesmo avatar acompanha a conta em todos os módulos.
3. Conta sem e-mail verificado aparece como Bronze.
4. Conta com e-mail verificado aparece como Prata.
5. Conta profissional sem e-mail verificado consegue criar manifestação anônima.
6. Conta verificada visualiza as opções Sigilosa e Identificada antes do envio.
7. Conta verificada que não altera a opção padrão cria manifestação sigilosa.
8. Conta verificada que escolhe Identificada exibe ao Conselho nome de perfil, @ e cargo/função quando houver, sem expor e-mail.
9. Manifestação anônima não muda retroativamente depois da verificação do e-mail.
10. Presidente do Conselho não vê ação para nova manifestação.
11. Tentativa direta da Presidência de criar manifestação recebe bloqueio do backend.
12. Membro do Conselho pode visualizar e registrar observação interna, mas não responder oficialmente nem alterar andamento.
13. Presidente pode responder oficialmente e alterar andamento.
14. O Conselho não recebe e-mail de segurança nem identificadores técnicos de autenticação na manifestação.
15. Segunda manifestação em menos de duas horas é recusada.
16. Autor continua podendo responder dentro de protocolo existente.
17. Anexos permanecem privados e acessíveis apenas aos autorizados.
18. PDF é entregue como download e JPG/PNG somente após autorização.
19. D1 e logs não armazenam o texto integral da manifestação fora do Firestore.

## Próximas fases

- nível Ouro e desafio adicional em novo dispositivo;
- recuperação de conta por mecanismos adicionais;
- amizade/chat entre usuários somente com autorização;
- perfis sociais mantendo cargo profissional quando aplicável;
- feed/comunidade pública após definição institucional;
- App Check/reCAPTCHA Enterprise depois da validação da V1.