# Portal de acesso por perfil

Arquitetura revisada em 01/09/2026.

## Entrada única

- `/login/`: porta de entrada comum para profissionais e cidadãos.
- `/cadastro/`: auto cadastro exclusivo de cidadão, com usuário + senha.
- O cidadão não depende do Desenvolvedor para criar sua conta.
- O auto cadastro nunca concede cargo profissional, institucional ou técnico.
- O backend da autenticação continua no Cloudflare Worker + D1, preservando as contas profissionais existentes.
- O ambiente aberto depois do login é definido pelas permissões da conta.

## Ambientes

- `/`: Início profissional.
- `/medico/`: Guia Médico e pré-regulação Gemini.
- `/recepcao/`: Conferência da Recepção.
- `/telemedicina/`: acompanhamento longitudinal de teleconsultas, retornos e lembretes operacionais.
- `/admin/usuarios/`: gestão de usuários conforme hierarquia.
- `/admin/monitoramento/`: monitoramento disponível para Coordenação e Desenvolvedor.
- `/admin/configuracao/`: diagnóstico técnico exclusivo do Desenvolvedor.
- `/cidadao/`: Hub do Cidadão, manifestações, notificações e acompanhamento.
- `/conselho/`: página pública do Conselho Municipal de Saúde.
- `/conselho/painel/`: área institucional para Presidente e membros autorizados do Conselho.
- `/conta/`: perfil, senha, e-mail de segurança, evolução da conta e preferências futuras.

## Perfis primários

1. `admin` — **Desenvolvedor**. Nível técnico máximo.
2. `coordenacao` — **Coordenação**. Guia, Recepção, Monitoramento e gestão apenas de médicos/recepção.
3. `medico` — **Médico**. Ambiente médico.
4. `recepcao` — **Recepção**. Conferência operacional.
5. `telemedicina` — **Técnico em Telemedicina**. Acompanhamento de teleconsultas e retornos; concedido apenas pelo Desenvolvedor.
6. `cidadao` — **Cidadão**. Hub do Cidadão.

O perfil primário não deve ser confundido com a função no Conselho nem com o nível Bronze/Prata/Ouro.

### Implementação do perfil de Telemedicina

Para preservar compatibilidade com o mecanismo de sessão já implantado, `telemedicina` é um perfil lógico da camada flexível de autenticação. No registro-base do D1 a conta utiliza `recepcao`, enquanto a tabela `auth_telemedicine_access` registra a capacidade exclusiva. `worker/auth-management-flex.js` expõe e valida a conta como `telemedicina` para o restante do portal.

Essa composição não concede acesso à Conferência da Recepção: módulos que usam a validação flexível recebem o perfil lógico `telemedicina`, não `recepcao`. A Coordenação também não recebe essas contas na sua lista de subordinados e não pode administrá-las.

A decisão detalhada está em `docs/TELEMEDICINA.md`.

## Funções do Conselho

Campo independente `council_role`:

- `presidente`: visualiza manifestações, responde oficialmente, altera andamento, conclui, acessa anexos e registra observações internas.
- `membro`: acesso anônimo e somente leitura ao conteúdo e ao histórico; não vê identidade, anexos ou observações internas e não pode interagir.
- vazio: sem acesso ao painel institucional.

No painel institucional, o perfil `admin` (Desenvolvedor) recebe capacidade operacional equivalente à Presidência sem alteração do `council_role` salvo na conta. Uma conta pode ser, por exemplo, `admin + membro` ou `cidadao + presidente`; a precedência técnica do Desenvolvedor vale somente no contexto institucional do Conselho.

## Hierarquia para concessão de acessos

- Desenvolvedor pode criar/atribuir: Coordenação, Médico, Recepção, Técnico em Telemedicina e Cidadão. Funções do Conselho também são atribuídas pelo Desenvolvedor.
- Coordenação pode criar/atribuir somente Médico e Recepção.
- O perfil Técnico em Telemedicina é administrado exclusivamente pelo Desenvolvedor e fica fora da lista de subordinados da Coordenação.
- Médico, Recepção, Técnico em Telemedicina e Cidadão não concedem cargos.
- Auto cadastro sempre cria exclusivamente `cidadao`; o cliente nunca escolhe um cargo privilegiado.
- A conta Desenvolvedor não pode se desativar ou remover o próprio nível técnico pelo formulário comum.

A validação é executada no backend. Esconder opções no frontend não é considerado controle de acesso.

## Telemedicina e dados sensíveis

O módulo de Telemedicina usa o Worker como única porta para leitura e escrita dos dados assistenciais operacionais. O navegador não acessa o Firestore diretamente.

- Firestore `telemedicine_patients`: cadastro agrupador do paciente.
- Firestore `telemedicine_followups`: situação operacional atual por paciente + especialidade.
- Firestore `telemedicine_events`: linha do tempo de consultas, programações e confirmações de solicitação.
- D1 `auth_telemedicine_access`: capacidade do perfil Técnico em Telemedicina.

O histórico é organizado por paciente, eliminando a dependência de uma lista cronológica com nomes repetidos. O CNS não integra o fluxo migrado. Arquivos privados de migração e conteúdo nominal de pacientes não são versionados.

A janela operacional inicia 15 dias antes da data-alvo do retorno e contém três avisos em dias úteis consecutivos. Após o terceiro aviso, a pendência passa a `ATRASADO` e permanece até confirmação. Retornos vagos ou condicionais não recebem data inventada.

## Evolução da conta do cidadão

A camada de cidadão utiliza três níveis internos, inspirados apenas na ideia de progressão de segurança. Eles **não têm relação com os níveis oficiais da conta Gov.br** e não alteram prioridade, legitimidade ou peso de uma manifestação.

### Bronze

Requisito: conta criada com usuário + senha.

Desbloqueia:

- Canal do Cidadão;
- nova manifestação;
- protocolo e acompanhamento;
- conversa vinculada à manifestação;
- notificações internas.

### Prata

Requisito: e-mail de segurança confirmado.

Além do Bronze, desbloqueia:

- foto de perfil;
- preparação do perfil social;
- preferência para receber pedidos de amizade quando a camada social for ativada.

A foto de perfil pertence à conta/social e não é exibida no painel do Conselho dentro das manifestações.

### Ouro

Requisito planejado: proteção reforçada em novo dispositivo / segunda etapa de autenticação.

O nível Ouro ainda não pode ser alcançado na V1. A arquitetura já prevê esse nível para:

- dispositivos confiáveis;
- recursos sociais mais sensíveis;
- elegibilidade para comunicação social avançada quando essa camada for implementada.

Mesmo no nível Ouro, um cidadão não recebe acesso automático a médicos, recepcionistas ou outros profissionais. As regras de amizade, consentimento e privacidade continuam obrigatórias.

## Separação dos administradores legados

Antes da publicação desta versão deve ser configurada a variável `AUTH_DEVELOPER_USERNAMES` no Worker com o(s) usuário(s) que realmente são Desenvolvedores. O valor é normalizado da mesma forma que o login.

A migração dos antigos `admin` para `coordenacao` possui uma trava adicional: `AUTH_MIGRATE_LEGACY_ADMINS=false` por padrão. Ela só deve ser ligada temporariamente depois de confirmar a conta Desenvolvedor correta.

Isso corrige o uso anterior do perfil Desenvolvedor para liberar ferramentas de Coordenação sem criar risco de rebaixamento acidental.

## Conselho e Firebase

O conteúdo das manifestações não é armazenado no Google Drive e não possui fallback para Drive ou D1.

- Cloud Firestore: manifestação, mensagens, andamento, observações internas e metadados de anexos; também armazena as coleções protegidas de Telemedicina.
- Cloud Storage/Firebase Storage: JPG, PNG e PDF privados.
- D1: autenticação do portal, capacidades técnicas, índice protocolo↔conta, contador de protocolo, rate limit, notificações genéricas e auditoria sem conteúdo da manifestação.
- O documento principal da manifestação no Firestore não contém o nome de usuário do cidadão.
- O acesso ao Firestore/Storage é intermediado pelo Worker. O navegador não recebe credencial de conta de serviço.
- As regras versionadas em `firebase/firestore.rules` e `firebase/storage.rules` negam todo acesso direto por clientes Firebase na V1; o Worker usa IAM/conta de serviço.

Sem a configuração Firebase, o portal profissional continua funcionando e os módulos dependentes do Firestore informam que aguardam conexão do armazenamento.

## Privacidade da conta do cidadão

- Cadastro inicial pede apenas usuário + senha; não pede nome de exibição, e-mail, telefone ou CPF.
- A tela orienta a não usar nome completo ou outro dado pessoal no nome de usuário quando a pessoa quiser preservar a identificação.
- A foto de perfil fica bloqueada enquanto a conta estiver Bronze e é liberada apenas após confirmação do e-mail/nível Prata.
- Sem e-mail confirmado, o autor escolhe em cada nova manifestação entre `anonima` e `identificada`; valor ausente, inválido ou pedido de `sigilosa` resulta em `anonima`.
- Com `emailVerified=true`, o autor escolhe entre `sigilosa` e `identificada`; valor ausente ou inválido resulta em `sigilosa`.
- Em manifestação sigilosa, nome, @, foto, e-mail e função do autor não são exibidos ao Conselho.
- Em manifestação identificada, o Conselho recebe nome de perfil, @ e cargo/função quando houver; o e-mail continua protegido.
- A modalidade fica congelada no momento da criação. Vincular, confirmar ou substituir e-mail depois não altera protocolos anteriores.
- Na V1, um e-mail já confirmado não pode simplesmente ser apagado; ele pode ser substituído e novamente confirmado.
- O nível da conta e o rótulo de privacidade são conceitos diferentes, mas apenas e-mail confirmado permite escolher sigilosa ou identificada.
- O e-mail é usado para segurança/recuperação da conta e futura verificação em novo dispositivo.

## Migração de e-mail profissional

Quando `AUTH_REQUIRE_EMAIL_VERIFICATION` for ativado, credenciais profissionais válidas continuam conseguindo autenticar. O usuário é direcionado para `/conta/`, onde pode cadastrar/confirmar o e-mail. As demais APIs profissionais permanecem bloqueadas até a confirmação.

Isso evita bloquear uma conta antes que ela tenha como regularizar o próprio e-mail.

## Comunicação das manifestações

O portal é o canal normal de comunicação:

- protocolo `CMS-AAAA-000000`;
- mensagens entre cidadão e Conselho vinculadas ao protocolo;
- linha do tempo;
- notificações internas;
- anexos;
- respostas oficiais pela Presidência.

Não há dependência de WhatsApp ou e-mail para informar cada movimentação.

## Auditoria institucional

Ações do Conselho geram registros técnicos separados, sem copiar o texto da manifestação:

- visualização de manifestação por membro autorizado;
- resposta oficial;
- alteração de andamento;
- observação interna;
- acesso/envio de anexo pelo Conselho.

O objetivo é permitir rastreabilidade sem duplicar conteúdo sensível em logs administrativos.

## Limites e proteção contra abuso

- 1 nova manifestação por conta a cada 2 horas.
- O limite não bloqueia respostas dentro de uma manifestação já aberta.
- Máximo inicial de 5 anexos por manifestação.
- Anexos: JPG, PNG ou PDF, até 5 MB por arquivo.
- Auto cadastro possui limite técnico por conexão, armazenando apenas hash para a regra antiabuso.
- App Check/reCAPTCHA poderá ser adicionado ao endpoint público após o projeto Firebase ser conectado.

## Chat e futura camada social

Na V1, cidadãos não possuem acesso ao chat profissional nem à lista de médicos, recepcionistas, coordenadores ou desenvolvedores. O Técnico em Telemedicina também não recebe acesso ao chat profissional apenas por possuir esse perfil; qualquer integração futura deve ser decidida explicitamente.

A arquitetura de conta já contém `accept_friend_requests` e gates de nível:

- Bronze: sem recursos sociais;
- Prata: foto de perfil e preferência futura de pedidos de amizade;
- Ouro: elegibilidade futura para recursos sociais avançados.

Amizade, busca social, feed, seguidores e chat cidadão↔profissional ficam fora da V1. Quando implementados, o chat só poderá existir após relação autorizada. Cada usuário poderá escolher se aceita pedidos, e o nível da conta nunca contornará as regras de privacidade do profissional.

## Repositório e proteção de dados

Em 01/09/2026 o repositório foi alterado para **privado**. Essa mudança reduz a exposição do código, mas não transforma o GitHub em banco de dados assistencial.

Nenhuma credencial, chave privada, e-mail protegido, conteúdo de manifestação, nome de paciente, arquivo de migração de Telemedicina ou outro dado sensível deve ser salvo no repositório. Dados protegidos ficam em serviços autenticados no backend. Segredos permanecem no painel da Cloudflare. O `.gitignore` bloqueia arquivos locais comuns de segredo, e `worker/.dev.vars.example` contém somente placeholders.

## Linguagem permanente de interação

Desde 06/09/2026, todas as rotas ativas utilizam a camada central `PortalInteractions`. Ela coordena estados visuais, movimento, foco, anúncios acessíveis e uma identidade sonora original sem interferir nas regras funcionais de cada módulo.

As preferências `interface_sounds_enabled`, `interface_sound_volume` e `interface_sounds_muted` pertencem à conta e são persistidas no D1 pelo endpoint de segurança. Sons começam desativados para contas existentes e novas. A ausência, o bloqueio ou a falha de áudio nunca pode bloquear uma ação.

Novos módulos devem registrar apenas interações semanticamente relevantes, reutilizar os tokens centrais, respeitar `prefers-reduced-motion`, manter feedback textual/visual completo e utilizar ícones SVG em vez de emojis. É proibido implementar um listener sonoro indiscriminado para todos os botões ou links.

A especificação, a matriz de rotas, a API, a identidade sonora e o checklist de evolução estão em `docs/PORTAL-INTERACTIONS-V1.md`.
