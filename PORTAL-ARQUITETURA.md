# Portal de acesso por perfil

Arquitetura revisada em 15/08/2026.

## Entrada única

- `/login/`: autenticação de profissionais e cidadãos.
- `/cadastro/`: auto cadastro exclusivo de cidadão, com usuário + senha.
- O backend da autenticação continua no Cloudflare Worker + D1, preservando as contas profissionais existentes.
- O ambiente aberto depois do login é definido pelas permissões da conta.

## Ambientes

- `/`: Início profissional.
- `/medico/`: Guia Médico e pré-regulação Gemini.
- `/recepcao/`: Conferência da Recepção.
- `/admin/usuarios/`: gestão de usuários conforme hierarquia.
- `/admin/monitoramento/`: monitoramento disponível para Coordenação e Desenvolvedor.
- `/cidadao/`: Hub do Cidadão, manifestações, notificações e acompanhamento.
- `/conselho/`: página pública do Conselho Municipal de Saúde.
- `/conselho/painel/`: área institucional para Presidente e membros autorizados do Conselho.
- `/conta/`: perfil, senha, e-mail de segurança e preferências de privacidade.

## Perfis primários

1. `admin` — **Desenvolvedor**. Nível técnico máximo.
2. `coordenacao` — **Coordenação**. Guia, Recepção, Monitoramento e gestão apenas de médicos/recepção.
3. `medico` — **Médico**. Ambiente médico.
4. `recepcao` — **Recepção**. Conferência operacional.
5. `cidadao` — **Cidadão**. Hub do Cidadão.

O perfil primário não deve ser confundido com a função no Conselho.

## Funções do Conselho

Campo independente `council_role`:

- `presidente`: visualiza manifestações, responde oficialmente, altera andamento, conclui e registra observações internas.
- `membro`: visualiza manifestações e histórico e registra observações internas.
- vazio: sem acesso ao painel institucional.

Uma conta pode ser, por exemplo, `admin + membro` ou `cidadao + presidente`.

## Hierarquia para concessão de acessos

- Desenvolvedor pode criar/atribuir: Coordenação, Médico, Recepção e Cidadão. Funções do Conselho também são atribuídas pelo Desenvolvedor.
- Coordenação pode criar/atribuir somente Médico e Recepção.
- Médico, Recepção e Cidadão não concedem cargos.
- Auto cadastro sempre cria exclusivamente `cidadao`; o cliente nunca escolhe um cargo privilegiado.

A validação é executada no backend. Esconder opções no frontend não é considerado controle de acesso.

## Separação dos administradores legados

Antes da publicação desta versão deve ser configurada a variável `AUTH_DEVELOPER_USERNAMES` no Worker com o(s) usuário(s) que realmente são Desenvolvedores. Contas antigas com `role=admin` que não estiverem nessa lista serão migradas automaticamente para `coordenacao`.

Isso corrige o uso anterior do perfil Desenvolvedor para liberar ferramentas de Coordenação.

## Conselho e Firebase

O conteúdo das manifestações não é armazenado no Google Drive e não possui fallback para Drive ou D1.

- Cloud Firestore: manifestação, mensagens, andamento, observações internas e metadados de anexos.
- Cloud Storage/Firebase Storage: JPG, PNG e PDF privados.
- D1: apenas autenticação do portal, índice técnico protocolo↔conta, contador de protocolo, rate limit e notificações genéricas.
- O acesso ao Firestore/Storage é intermediado pelo Worker. O navegador não recebe credencial de conta de serviço.

Sem a configuração Firebase, o portal profissional continua funcionando e o módulo do Conselho informa que aguarda conexão do armazenamento.

## Privacidade da conta do cidadão

- Cadastro inicial não exige e-mail ou telefone.
- Sem e-mail: interface identifica a conta como sem identificação por e-mail/telefone e a manifestação como `anonima` no contexto do painel do Conselho.
- Com e-mail: a manifestação passa automaticamente para `sigilosa`.
- O e-mail de segurança não é incluído no documento da manifestação e não é exibido à Presidente nem aos membros do Conselho.
- O e-mail é usado para segurança/recuperação da conta e futura verificação em novo dispositivo.

## Comunicação das manifestações

O portal é o canal normal de comunicação:

- protocolo `CMS-AAAA-000000`;
- mensagens entre cidadão e Conselho vinculadas ao protocolo;
- linha do tempo;
- notificações internas;
- anexos;
- respostas oficiais pela Presidência.

Não há dependência de WhatsApp ou e-mail para informar cada movimentação.

## Limites e proteção contra abuso

- 1 nova manifestação por conta a cada 2 horas.
- O limite não bloqueia respostas dentro de uma manifestação já aberta.
- Máximo inicial de 5 anexos por manifestação.
- Anexos: JPG, PNG ou PDF, até 5 MB por arquivo.
- Auto cadastro possui limite técnico por conexão, armazenando apenas hash para a regra antiabuso.
- App Check/reCAPTCHA poderá ser adicionado ao endpoint público após o projeto Firebase ser conectado.

## Chat e futura camada social

Na V1, cidadãos não possuem acesso ao chat profissional nem à lista de médicos, recepcionistas, coordenadores ou desenvolvedores.

A arquitetura de conta já contém `accept_friend_requests`, mas amizade, busca social, feed, seguidores e chat cidadão↔profissional ficam fora da V1. Quando implementados, o chat só poderá existir após uma relação de amizade autorizada e cada usuário poderá optar por receber ou não pedidos.

## Repositório público

O repositório é público. Portanto, nenhuma credencial, chave privada, e-mail protegido ou conteúdo de manifestação pode ser salvo no GitHub. Dados protegidos ficam em serviços autenticados no backend. Segredos permanecem no painel da Cloudflare.
