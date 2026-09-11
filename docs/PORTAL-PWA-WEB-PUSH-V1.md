# PWA e Web Push — decisão permanente

Atualizado em 10/09/2026.

## Decisão de produto

O Portal da Regulação de Saúde de Eldorado/MS é distribuído diretamente pela Web
como **Progressive Web App (PWA)**. Não depende de publicação na Play Store.

Em navegadores compatíveis, o Portal oferece instalação no dispositivo e abre em
modo `standalone`. No iPhone/iPad, a instalação é realizada pelo comando
**Adicionar à Tela de Início** do sistema.

As rotas ativas que antes possuíam manifestos próprios de módulo passam a apontar
para `portal.webmanifest`, preservando uma única identidade, `start_url` e
`scope` para o aplicativo do Portal. Os manifestos especializados antigos podem
permanecer versionados apenas por compatibilidade histórica, sem dirigir novas
instalações.

No mobile e em dispositivos de toque, o convite de instalação deve ser apresentado
como um cartão amplo e legível, próximo à largura da tela, com ícone, título,
explicação e botões maiores. O desktop preserva o cartão compacto para não interferir
no layout institucional.

## Notificações em segundo plano

A PWA usa Service Worker + Push API para receber avisos mesmo quando não existe
uma aba do Portal aberta. O registro do dispositivo é sempre associado à conta
autenticada no backend. Se outra tela do Portal estiver visível, ela recebe também
um sinal de atualização em segundo plano e o aviso genérico do sistema continua
sendo exibido, evitando que novos eventos fiquem silenciosos em outra rota.

Eventos atualmente conectados ao Web Push:

- nova mensagem do chat profissional;
- pedido de amizade, aceite de amizade e comentário da Camada Social;
- notificações institucionais geradas pelo Canal do Cidadão/Conselho.

O clique no aviso abre o Portal. O conteúdo protegido continua sendo consultado
somente depois da abertura e da validação da sessão.

## Privacidade

O envio ao provedor Push é deliberadamente **sem payload**. Nenhum nome de
paciente, diagnóstico, CID, encaminhamento, mensagem, conteúdo de manifestação,
texto de comentário, nome de usuário ou outro conteúdo funcional é enviado no
POST Web Push.

O Service Worker exibe apenas o aviso genérico:

> Você recebeu uma nova notificação no Portal. Abra para consultar.

Assim, a notificação do sistema não replica conteúdo clínico ou de manifestações
na tela bloqueada.

## Persistência técnica

O D1 mantém apenas a infraestrutura necessária:

- `portal_push_vapid`: par VAPID do Portal; a chave privada permanece no backend;
- `portal_push_subscriptions`: endpoint Push, conta associada, expiração e
  metadados técnicos mínimos de entrega.

A chave VAPID é criada no backend na primeira necessidade e nunca é versionada no
GitHub. Somente a chave pública é entregue ao navegador autenticado.

Cada conta mantém no máximo oito assinaturas recentes. Endpoints expirados ou
respondidos com 404/410 são removidos automaticamente.

## Sessão e dispositivo compartilhado

Antes do logout, o cliente revoga primeiro a assinatura Push local do navegador e,
enquanto a sessão ainda é válida, tenta remover também o endpoint associado no
backend. Se o logout ocorrer sem rede e a remoção remota falhar, a revogação local
impede aquele navegador de continuar recebendo Push; o endpoint órfão é descartado
automaticamente quando o provedor responder 404/410. Uma sessão futura cria uma
nova assinatura para a conta autenticada.

## Compatibilidade e fallback

Se Push API ou Service Worker não estiverem disponíveis, o Portal continua
funcionando normalmente. O chat preserva a notificação local já existente quando
a página está em execução. Quando a assinatura Web Push está ativa, a notificação
local é suprimida para evitar duplicidade.

No iOS, o Portal orienta primeiro a instalação na Tela de Início antes de solicitar
a permissão de notificações.

## Arquivos centrais

- `portal.webmanifest`: identidade instalável;
- `portal-sw.js`: cache, evento `push` e clique na notificação;
- `js/portal-pwa.js`: instalação, permissão, assinatura e sincronização;
- `js/portal-performance.js`: carregamento global da camada PWA;
- `worker/push-notifications.js`: API de assinaturas, VAPID e entrega;
- `worker/tests/pwa-web-push.test.mjs`: regressões de integração e privacidade.

## Regra de evolução

Novos tipos de aviso podem reutilizar `notifyUserPush()`, mas o Push deve
continuar sem payload sensível. O evento persistente correspondente deve ser
gravado no domínio correto do backend e carregado somente após a abertura do
Portal autenticado.
