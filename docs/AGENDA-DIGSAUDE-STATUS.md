# Agenda DigSaúde — Status

Atualizado em 16/09/2026.

## Estado atual

- Frente: Agenda DigSaúde V1.
- Produção: V1 mesclada na `main` pelo PR #185 em `77a1b7b55750ce19ba1c0d3cf8ddf5070ec6c751`.
- Homologação real iniciada em 16/09/2026 com sessão autorizada do DigSaúde.
- Primeiro bloqueio real encontrado: a sincronização dos 40 agendamentos falhou no Worker com `Too many subrequests by single Worker invocation`.
- Causa confirmada no código: a V1 fazia um `firestoreGet` e depois um `firestoreCreate`/`firestorePatch` por registro, excedendo o limite de subrequests do Cloudflare durante a primeira carga.
- Branch corretiva atual: `fix/agenda-firestore-batch-sync`.

## Correção preparada

- a sincronização passa a carregar o estado existente do Firestore uma única vez com `listAll`;
- os registros recebidos são comparados em memória pelo `sourceId`;
- criações, atualizações, reativações e desativações são acumuladas em memória;
- as gravações são enviadas pelo endpoint transacional `documents:commit` do Firestore;
- commits são divididos em lotes de até 450 gravações, abaixo do limite de 500 writes do Firestore;
- `markRead` continua usando leitura/gravação unitária, pois opera sobre apenas um registro;
- leitura individual por usuário, preservação de `readBy`, `firstSeenAt` e demais metadados foram mantidas;
- reativação de um agendamento agora também atualiza `lastChangedAt`, garantindo que volte a aparecer como não lido;
- foi adicionado teste de regressão para impedir retorno ao padrão N+1 de subrequests na sincronização.

## Por que esta abordagem

O erro não é do Tampermonkey, da sessão do DigSaúde nem do navegador. O snapshot chegou ao Portal e o Worker falhou ao persistir muitos registros com chamadas individuais ao Firestore. A correção reduz dezenas de subrequests externos para poucas chamadas controladas por sincronização, sem aumentar privilégios nem armazenar credenciais do DigSaúde.

## Alternativas descartadas

- aumentar artificialmente o limite de subrequests do Worker como solução principal;
- dividir a sincronização em dezenas de requisições do navegador;
- guardar senha/cookie do DigSaúde no backend;
- desativar a comparação de registros ou a leitura individual para reduzir chamadas.

Essas alternativas aumentariam fragilidade, exposição ou complexidade sem resolver a causa arquitetural.

## Segurança e privacidade

- o DigSaúde continua sendo a fonte oficial;
- o Portal continua somente leitura em relação ao DigSaúde;
- nenhuma senha, cookie, sessão ou token CSRF do DigSaúde é enviado ao Portal;
- a Agenda continua sem PostHog/observabilidade de conteúdo clínico;
- respostas da API permanecem `no-store`.

## Próximo passo exato

1. abrir PR da branch `fix/agenda-firestore-batch-sync` contra `main`;
2. validar todos os checks e o workflow da Agenda;
3. mesclar somente com CI verde;
4. aguardar o deploy automático do Worker;
5. repetir a primeira sincronização real dos 40 agendamentos pelo botão **Enviar Agenda ao Portal**;
6. confirmar na Agenda do Portal os totais, novos/alterados e leitura individual;
7. registrar o resultado final desta homologação neste arquivo.

## Riscos restantes

- a homologação real da primeira carga ainda precisa ser repetida após o deploy da correção;
- se a lista futura ultrapassar o limite de uma página do DigSaúde, snapshots parciais continuam proibidos de desativar ausentes;
- mudanças futuras no HTML Filament/Livewire podem exigir ajuste do extrator local.
