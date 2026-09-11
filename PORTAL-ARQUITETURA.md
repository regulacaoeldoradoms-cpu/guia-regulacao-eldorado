# Portal de acesso por perfil

Arquitetura revisada em 09/09/2026.

## Entrada única

- `/login/`: porta de entrada comum para profissionais e cidadãos.
- `/cadastro/`: auto cadastro exclusivo de cidadão, com usuário + senha.
- O cidadão não depende do Desenvolvedor para criar sua conta.
- O auto cadastro nunca concede cargo profissional, institucional ou técnico.
- O backend da autenticação continua no Cloudflare Worker + D1, preservando as contas profissionais existentes.
- O ambiente aberto depois do login é definido pelas permissões da conta.

## Ambientes

- `/`: Home social quando ativada; catálogo de trabalho como rollout/fallback.
- `/ferramentas/`: catálogo único de módulos autorizados, independente da API social.
- `/perfil/?u=handle`: perfil social autenticado; sem parâmetro, abre o próprio perfil.
- `/amigos/`: amizades, pedidos, bloqueios e descoberta protegida.
- `/notificacoes/`: notificações exclusivamente sociais.
- `/medico/`: Guia Médico e pré-regulação Gemini.
- `/recepcao/`: Conferência da Recepção.
- `/telemedicina/`: acompanhamento longitudinal de teleconsultas, retornos e lembretes operacionais.
- `/admin/usuarios/`: gestão de usuários conforme hierarquia.
- `/admin/monitoramento/`: monitoramento disponível para Coordenação e Desenvolvedor.
- `/admin/configuracao/`: diagnóstico técnico exclusivo do Desenvolvedor.
- `/admin/social/`: denúncias, moderação e observabilidade das migrações sociais,
  exclusivo do Desenvolvedor.
- `/cidadao/`: Hub do Cidadão, manifestações, notificações e acompanhamento.
- `/conselho/`: página pública do Conselho Municipal de Saúde.
- `/conselho/painel/`: área institucional para Presidente e membros autorizados do Conselho.
- `/perfil/`: perfil social autenticado; o titular também altera a própria foto e, para contas cidadãs, nome de exibição e @.\n- `/seguranca/`: alteração de senha, e-mail de segurança e confirmação do endereço.\n- `/configuracoes/`: sons da interface e preferências sociais.\n- `/conquistas/`: progressão Bronze/Prata/Ouro e superfície preparada para conquistas futuras.\n- `/conta/`: rota legada de compatibilidade; não contém mais funcionalidades e apenas redireciona para as áreas especializadas.


## Desempenho e cache seguro

Todas as entradas ativas registram `js/portal-performance.js`. Depois da
autenticação, a matriz única de `PortalTools` define quais páginas podem ser
pré-carregadas para cada conta. O service worker mantém somente páginas e assets
públicos versionados; navegações já preparadas abrem pelo cache e são atualizadas em
segundo plano.

A sessão local validada permite montar a interface imediatamente, com reconferência
silenciosa no Worker. APIs, feed, mensagens, chat, manifestações, anexos, dados de
pacientes e respostas administrativas nunca entram no cache estático. A autorização
continua sendo revalidada no backend em toda operação protegida.

A política completa, os limites e a validação estão em
`docs/PORTAL-DESEMPENHO-CACHE-V1.md`.

## PWA instalável e Web Push

O Portal é distribuído diretamente pela Web como PWA, sem dependência de loja de
aplicativos. `portal.webmanifest` define a identidade instalável única nas rotas
ativas; `js/portal-pwa.js` coordena instalação e assinatura; e `portal-sw.js`
recebe eventos Push mesmo sem uma página aberta. Manifestos antigos específicos de
módulo permanecem apenas como compatibilidade histórica e não dirigem novas
instalações.

O Web Push usa envio vazio: nenhum conteúdo clínico, mensagem, manifestação,
comentário ou identificador funcional é transportado no payload. O Service Worker
mostra apenas um aviso genérico e o conteúdo real é carregado depois da abertura e
da validação da sessão.

O D1 mantém `portal_push_vapid` e `portal_push_subscriptions`. A chave privada
VAPID é criada e mantida no backend; nunca é versionada no repositório público.
Chat profissional, notificações sociais e avisos institucionais do
Canal do Cidadão/Conselho podem acordar a PWA por essa infraestrutura. Quando há
uma tela do Portal visível, ela também recebe o sinal de atualização e o aviso
genérico do sistema continua disponível. No logout, a assinatura local é revogada
mesmo se a remoção remota do endpoint não puder ser concluída naquele momento.

A especificação completa está em `docs/PORTAL-PWA-WEB-PUSH-V1.md`.

## Camada Social V1

A camada social usa a mesma sessão, mas possui domínio de dados e autorização
próprios. `social_user_id` é um UUID imutável ligado internamente a
`auth_users.username`. Handles antigos são aliases; mudanças de nome ou `@` não
alteram autoria nem relações.

### Persistência D1

- `social_schema_migrations`: versões aplicadas e detalhes técnicos mínimos;
- `social_users`: identidade, perfil, preferências e suspensão somente social;
- `social_handle_aliases`: resolução de URLs antigas;
- `social_relationships`: uma linha por par, estado, direção, origem e tombstone;
- `social_posts`, `social_comments`, `social_reactions`: feed textual;
- `social_notifications`: avisos sociais, separados de `portal_notifications`;
- `social_reports`: denúncias categorizadas;
- `social_moderation_audit`: trilha técnica sem duplicar conteúdo;
- `social_rate_limits`: limites por identidade, ação e janela.

Schemas e índices são aditivos e idempotentes. As versões atuais são
`social-v1-20260906` e `professional-friendships-v1`. A semeadura profissional usa
`created_by`, atividade da conta e capacidade real do chat, e nunca recria um par
com tombstone ou bloqueio.

### APIs

Todas as rotas abaixo ficam sob `/api/social/*`, validam sessão e aplicam a política
no Worker:

- `config`, `me`, `profiles/:handle` e `avatars/:handle`;
- `search` e `relationships`;
- `feed`, `posts`, `comments` e `reaction`;
- `notifications` e `reports`;
- `moderation/reports`, `moderation/users`, `moderation/content` e
  `migrations/status` para o Desenvolvedor.

Listas usam cursor e limite fixo. Ownership, audiência, amizade, bloqueio,
visibilidade, atividade e suspensão são revalidados no backend. Respostas comuns não
contêm e-mail, UUID, conteúdo de manifestação ou dado assistencial.

### Flags e resiliência

- `SOCIAL_BACKEND_ENABLED`: ativa schema e APIs; ausência equivale a `false`.
- `SOCIAL_HOME_ENABLED`: permite ao `/` mostrar o feed; depende da flag anterior.

O rollout mantém flags separadas para backend e Home. `js/home.js` mantém um estado de carregamento próprio enquanto resolve a configuração;
a última configuração válida da sessão pode abrir a superfície imediatamente e é
revalidada em segundo plano. Perfil social e feed são solicitados em paralelo;
`/ferramentas/` não depende da API social para exibir ou abrir os módulos.
O rollback não apaga tabelas: desligar primeiro a Home e, se necessário, o backend.

### Matriz de visibilidade

- Bronze não executa ações sociais nem entra em descoberta.
- Prata/Ouro usa a camada dentro das políticas de tipo de conta e relação.
- Cidadão descobre somente cidadãos elegíveis; profissionais não formam diretório
  amplo para cidadãos.
- Profissionais podem descobrir outros profissionais e abrir perfil pelo chat.
- Suspensão social remove descoberta/ações, mas não altera login, cargo ou ferramenta.
- Amizade social jamais autoriza chat, Conselho, Telemedicina, Guia ou Recepção.

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
- perfil social e personalização controlada;
- amizade, descoberta permitida, feed textual e notificações sociais;
- preferências de pedidos, visibilidade, audiência e Home Feed/Ferramentas.

A foto de perfil pertence à conta/social e não é exibida no painel do Conselho dentro das manifestações.

### Ouro

Requisito planejado: proteção reforçada em novo dispositivo / segunda etapa de autenticação.

O nível Ouro ainda não pode ser alcançado na V1. A arquitetura já prevê esse nível para:

- dispositivos confiáveis;
- recursos sociais mais sensíveis;
- elegibilidade futura para recursos sociais mais sensíveis quando forem
  especificados e implementados.

Mesmo no nível Ouro, um cidadão não recebe acesso automático a médicos, recepcionistas ou outros profissionais. As regras de amizade, consentimento e privacidade continuam obrigatórias.

## Separação dos administradores legados

Antes da publicação desta versão deve ser configurada a variável `AUTH_DEVELOPER_USERNAMES` no Worker com o(s) usuário(s) que realmente são Desenvolvedores. O valor é normalizado da mesma forma que o login.

A migração dos antigos `admin` para `coordenacao` possui uma trava adicional: `AUTH_MIGRATE_LEGACY_ADMINS=false` por padrão. Ela só deve ser ligada temporariamente depois de confirmar a conta Desenvolvedor correta.

Isso corrige o uso anterior do perfil Desenvolvedor para liberar ferramentas de Coordenação sem criar risco de rebaixamento acidental.

## Conselho e Firebase

O conteúdo das manifestações não é armazenado no Google Drive e não possui fallback para Drive ou D1.

- Cloud Firestore: manifestação, mensagens, andamento, observações internas e metadados de anexos; também armazena as coleções protegidas de Telemedicina.
- Cloud Storage/Firebase Storage: JPG, PNG e PDF privados.
- D1: autenticação, capacidades técnicas, índice protocolo↔conta, contador, rate
  limits, notificações institucionais sem conteúdo e tabelas `social_*` isoladas.
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

Quando `AUTH_REQUIRE_EMAIL_VERIFICATION` for ativado, credenciais profissionais válidas continuam conseguindo autenticar. O usuário é direcionado para `/seguranca/`, onde pode cadastrar/confirmar o e-mail. As demais APIs profissionais permanecem bloqueadas até a confirmação.

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

## Chat profissional e Camada Social

Cidadãos continuam sem acesso ao diretório/chat **profissional** e sem lista de
médicos, recepcionistas, coordenadores, técnicos ou desenvolvedores. Médico,
Recepção, Coordenação, Técnico em Telemedicina e Desenvolvedor usam o chat por
autorização de cargo validada no Worker, independentemente de amizade.

A Camada Social acrescenta um segundo gate de conversa: duas contas cidadãs podem
conversar diretamente somente enquanto houver amizade aceita entre elas
(`social_relationships.state='friends'`). Pedido pendente não libera chat;
remoção/bloqueio revogam novas mensagens. Essa regra não concede nenhuma ferramenta
profissional nem permite cidadão↔profissional.

Na Home desktop, Segurança, Configurações e Conquistas ficam no bloco vertical
esquerdo, enquanto o espaço correspondente na barra horizontal recebe pesquisa de
usuários. A busca reutiliza a descoberta protegida do backend social; portanto não
contorna visibilidade, bloqueio, rate limit nem a separação cidadão/profissional.

O cabeçalho da conversa oferece `Ver perfil`. Para profissionais, o grafo social
não participa da autorização; para cidadãos, o vínculo de amizade é revalidado pelo
Worker. Seguidores, comunidades, jogos e chat social cidadão↔profissional permanecem
fora do escopo.

## Repositório e proteção de dados

Na conferência de 06/09/2026, o repositório estava **público**. Por isso, nenhum dado
social real, conteúdo privado, credencial ou material assistencial pode ser
versionado; a proteção não depende da visibilidade do código.

Nenhuma credencial, chave privada, e-mail protegido, conteúdo de manifestação, nome de paciente, arquivo de migração de Telemedicina ou outro dado sensível deve ser salvo no repositório. Dados protegidos ficam em serviços autenticados no backend. Segredos permanecem no painel da Cloudflare. O `.gitignore` bloqueia arquivos locais comuns de segredo, e `worker/.dev.vars.example` contém somente placeholders.

## Linguagem permanente de interação

Desde 06/09/2026, todas as rotas ativas utilizam a camada central `PortalInteractions`. Ela coordena estados visuais, movimento, foco, anúncios acessíveis e uma identidade sonora original sem interferir nas regras funcionais de cada módulo.

As preferências `interface_sounds_enabled`, `interface_sound_volume` e `interface_sounds_muted` pertencem à conta e são persistidas no D1 pelo endpoint de segurança. Sons começam desativados para contas existentes e novas. A ausência, o bloqueio ou a falha de áudio nunca pode bloquear uma ação.

Novos módulos devem registrar apenas interações semanticamente relevantes, reutilizar os tokens centrais, respeitar `prefers-reduced-motion`, manter feedback textual/visual completo e utilizar ícones SVG em vez de emojis. É proibido implementar um listener sonoro indiscriminado para todos os botões ou links.

A especificação, a matriz de rotas, a API, a identidade sonora e o checklist de evolução estão em `docs/PORTAL-INTERACTIONS-V1.md`.
