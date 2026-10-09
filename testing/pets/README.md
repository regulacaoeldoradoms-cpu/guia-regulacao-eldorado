# Checkpoint dos mascotes

Produção confirmada em `491ae932ca96a019c3909a0f6becaee16ea48b9e`: PRs #616/#617 publicadas, 33/33 checks do merge aprovados. Cada head passou 29/29 gates, incluindo 218 cenários gerais e 37 verificações do acompanhante. Gato transparente diretamente no body, movimento nos dois eixos, escala 128 × 96 px, navegação Mascotes e 42 falas fixas. Cuidados/loja/cama/visibilidade ficam na página dedicada. QA real confirmou versão ativa e DOM em Home/Ferramentas/Estudos/Documentos; a janela original tinha viewport zerada, depois uma viewport de teste 1440 × 900 confirmou aparência sem quadro, movimento em dois eixos, reload/ida e volta com o mesmo gato e clique atravessando a camada. Override removido. Nenhum balão apareceu durante a amostragem; aparência dos balões não confirmada ao vivo. Conta e gato reais não foram alterados.

## Etapa em rascunho: sete vidas e potinho

Branch `preparation/mascotes-sete-vidas`, baseada na produção acima. Não autorizada para merge/deploy. Nenhuma nova migration, flag, credencial ou permissão; campos adicionais no JSON existente do dono, persistidos pela mesma transação CAS e recibos idempotentes. GET somente projeta o estado legado, sem gravar.

Parâmetros centralizados em `worker/pet-life-rules.js`:

| Parâmetro | Proposta desta etapa |
| --- | --- |
| Vidas iniciais | 7 |
| Comida cheia até vazia | 8 horas de cuidados ativos |
| Comida vazia | perda de 1 vida por hora crítica |
| Água cheia até vazia | 4 horas de cuidados ativos |
| Água vazia | perda de 1 vida por 30 minutos críticos |
| Potinho cheio | 48 horas de proteção, depois consumo normal de 4 horas |
| Preço base proposto | 20 moedas de atividade; multiplicador de preços existente permanece |
| Encher potinho | gratuito; reinicia proteção, não recupera vidas |

O relógio exige amostras aceitas pelo servidor: uso ativo, aba dona do lease, expediente configurado e necessidades sem pausa. Fechado/offline, fora do expediente, folgas, férias, abas concorrentes ou intervalos expirados não consomem; não há catchup. Fome/sede têm contadores críticos independentes. Perdas simultâneas se somam e são limitadas às vidas restantes. Alimentar/dar água zeram somente seu contador de necessidade e seu contador crítico; nunca devolvem vidas. Cuidados manuais cortam o intervalo anterior apenas da necessidade cuidada. O relógio de proteção do potinho é independente; dar água comum não suspende sua contagem, e somente encher o potinho reinicia as 48 horas.

Gatos antigos conservam aparência, necessidades, preferência, moedas, inventário e conquistas. Recebem 7 vidas, sem período crítico anterior: a primeira mutação válida inicia o relógio; consultas não debitam tempo nem vidas. Morte fica persistida e oculta o acompanhante; care/placement são recusados. Só depois da morte uma nova adoção cria um gato com sete vidas, preservando registros de mortes, recibos, inventário e conquista única. Potinho já comprado fica disponível para encher gratuitamente na nova adoção.

Dez cenários novos de navegador em `lives.cjs` e 37 existentes em `global-navigation.cjs`, 911/911 testes completos do Worker, 89 contratos afetados, nove cenários de cache/sessão. SQLite em memória e duas contas fictícias; requisições externas bloqueadas. Testes do domínio usam todas as fronteiras de 8h/4h/48h e intervalos críticos; integração cobre legado, GET sem escrita, lease/pausa/offline, cuidado manual, replays, rollback transacional, concorrência, morte, nova adoção e isolamento. O CI mantém a auditoria geral sem relaxar gates e acrescenta os cenários de vidas. Artefatos locais em `/workspace/scratch/mascotes-vidas/` não entram no repositório.

Scripts históricos `install`, `fix-*`, `integrate` e `video-setup` são fontes do checkpoint original; não foram executados. Nenhuma dependência instalada neste executor. Testes usam Node 24/SQLite e Playwright/Chromium já disponíveis.

Próxima ação: revisar diff/PR e gates do head final; confirmar preço e perdas simultâneas antes de autorização específica para produção. Publicação futura deve cumprir `docs/WORKER-SAFE-DEPLOY.md`, preservar AUTH_DB e bindings/secrets. Rollback conservador desabilita mascotes pelo fluxo seguro e preserva tabelas/estado, inclusive vidas e histórico; não usar código antigo para reabrir adoções ou apagar mortes.
