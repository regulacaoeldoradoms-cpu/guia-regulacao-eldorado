# Checkpoint dos mascotes

Main em `bd7dad3890a4eb52d1d16e99c73bd569aeb08331`, PR #619 integrada após 29/29 checks. Build produtivo do Worker aprovado (`4372f488-19fc-49fb-8e3b-021b551d2953`, versão `2b100c45-578d-49e8-b830-cf88c8388321`) e frontend aprovado; confirmação ao vivo desta versão ainda depende do navegador real. QA anterior em `491ae932` confirmou gato transparente global, escala 128 × 96 px, movimento nos dois eixos, continuidade entre módulos/reload e clique atravessando a camada, sem alterar o gato real. Cuidados/loja/cama ficam na página Mascotes.

## Etapa autorizada: sete vidas, potinho e falas

Branch `preparation/mascotes-sete-vidas`, reconciliada sobre `bd7dad3890a4eb52d1d16e99c73bd569aeb08331` (PR #619 integrada após 29/29 checks). Usuário autorizou em 09/10 às 20:07 UTC os dois pacotes, preço base de 20 moedas, enchimento gratuito e perdas somadas. A publicação deste conjunto depende dos gates do novo head; os 29/29 do head isolado `fb50fcd5` não validam a reconciliação. Nenhuma nova migration, flag, credencial ou permissão; campos adicionais no JSON existente do dono, persistidos pela mesma transação CAS e recibos idempotentes. GET somente projeta o estado legado, sem gravar.

Parâmetros centralizados em `worker/pet-life-rules.js`:

| Parâmetro | Regra aprovada |
| --- | --- |
| Vidas iniciais | 7 |
| Comida cheia até vazia | 8 horas de cuidados ativos |
| Comida vazia | perda de 1 vida por hora crítica |
| Água cheia até vazia | 4 horas de cuidados ativos |
| Água vazia | perda de 1 vida por 30 minutos críticos |
| Potinho cheio | 48 horas de proteção, depois consumo normal de 4 horas |
| Preço base aprovado | 20 moedas de atividade; multiplicador de preços existente permanece |
| Encher potinho | gratuito; reinicia proteção, não recupera vidas |

O relógio exige amostras aceitas pelo servidor: uso ativo, aba dona do lease, expediente configurado e necessidades sem pausa. Fechado/offline, fora do expediente, folgas, férias, abas concorrentes ou intervalos expirados não consomem; não há catchup. Fome/sede têm contadores críticos independentes. Perdas simultâneas se somam e são limitadas às vidas restantes. Alimentar/dar água zeram somente seu contador de necessidade e seu contador crítico; nunca devolvem vidas. Cuidados manuais cortam o intervalo anterior apenas da necessidade cuidada. O relógio de proteção do potinho é independente; dar água comum não suspende sua contagem, e somente encher o potinho reinicia as 48 horas.

Gatos antigos conservam aparência, necessidades, preferência, moedas, inventário e conquistas. Recebem 7 vidas, sem período crítico anterior: a primeira mutação válida inicia o relógio; consultas não debitam tempo nem vidas. Morte fica persistida e oculta o acompanhante; care/placement são recusados. Só depois da morte uma nova adoção cria um gato com sete vidas, preservando registros de mortes, recibos, inventário e conquista única. Potinho já comprado fica disponível para encher gratuitamente na nova adoção.

Validação local do conjunto: 917/917 testes completos do Worker, sintaxe, dez cenários de vidas e 11 de falas no Chromium, nove de cache/sessão e 37 de navegação global. Suíte global original validada com Playwright 1.62.1 do runtime principal; a instalação CUA 1.57 não é a ferramenta desta evidência. SQLite em memória, duas contas fictícias e requisições externas bloqueadas; nenhuma escrita em produção. Domínio cobre fronteiras de 8h/4h/48h, contadores críticos, legado/GET sem escrita, lease/pausa/offline, cuidado manual, replays, rollback, concorrência, morte/readopção e isolamento. Falas cobrem todas as 67 antes de repetir, fronteira, duração/cadência, module/reload, alertas/ocultação/modal, duas contas e versão. Cache real atualizado confirma catálogo novo e ausência de APIs privadas em CacheStorage. CI conserva auditoria geral, navegação global e ambos os cenários de vidas/falas. Artefatos locais em `/workspace/scratch/mascotes-combined/`, fora do repositório.

Scripts históricos `install`, `fix-*`, `integrate` e `video-setup` são fontes do checkpoint original; não foram executados. Nenhuma dependência instalada neste executor. Testes usam Node 24/SQLite e Playwright/Chromium já disponíveis.

Falas preservadas da PR #619: 67 textos únicos (42 originais + 25 de humor), catálogo inteiro antes de repetir e sem repetição na fronteira; primeira/próximas em 25–40 segundos, balão de 7 segundos. Ciclo e horários sobrevivem à navegação/reload por aba e sessão, somente IDs/versão/horários sob chave SHA-256; outra conta não herda a fila. Alertas têm prioridade e falas invisíveis não consomem o ciclo.

Reconciliação preserva guardas de morte/revisão no runtime, instância de falas e conferência de sessão após await no bootstrap, CSS de vidas, testes de vidas e falas na auditoria geral. Cache novo `20261009-pets-combined-8`, imports/runtime/CSS/página `pets-combined-v8`. Validações locais do conjunto concluídas; CI do head reconciliado em andamento. Registrar o resultado terminal e SHA no PR antes de integrar.

Próxima ação: concluir validações locais e CI obrigatório do head reconciliado, integrar com SHA conferido e confirmar os builds produtivos e smokes. Não há nova migração nem alteração de dados por este executor. Publicação futura deve cumprir `docs/WORKER-SAFE-DEPLOY.md`, preservar AUTH_DB e bindings/secrets. Rollback conservador desabilita mascotes pelo fluxo seguro e preserva tabelas/estado, inclusive vidas e histórico; não usar código antigo para reabrir adoções ou apagar mortes.
