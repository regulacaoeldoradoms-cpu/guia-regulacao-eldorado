# Agenda DigSaúde — Status

Atualizado em 16/09/2026.

## Estado atual

- Frente: Agenda DigSaúde.
- V1 original mesclada na `main` pelo PR #185 em `77a1b7b55750ce19ba1c0d3cf8ddf5070ec6c751`.
- Correção do limite de subrequests mesclada pelo PR #186 em `cd1d67232f34acd77d0b194be194a75d816fc8ce`.
- Deploy do Worker corrigido concluído com sucesso em 16/09/2026, versão Cloudflare `a790bd06-b51a-4a02-8bf2-fe2a28f84849`.
- O usuário repetiu a sincronização real após o deploy e confirmou que **deu certo**; portanto a primeira sincronização funcional em produção está homologada.
- Nova unidade autorizada: **V2 — sincronização automática enquanto o DigSaúde estiver aberto**.
- Branch atual: `feat/agenda-auto-sync-v2`.
- Produção: a V2 ainda não foi mesclada nem publicada.

## Objetivo da V2

Eliminar a necessidade de clicar manualmente para cada atualização sem armazenar credenciais do DigSaúde e sem recarregar a tela que o técnico estiver usando.

Comportamento planejado:

- um clique inicial por sessão em **Ativar sincronização automática**;
- ponte protegida do Portal permanece aberta e pode ser minimizada;
- verificação em segundo plano a cada 15 minutos;
- o userscript busca a própria página `consultas?activeTab=Agendados` no domínio do DigSaúde usando a sessão já autenticada pelo navegador;
- a resposta HTML é interpretada em memória com `DOMParser`, sem navegar ou recarregar a interface do usuário;
- snapshot só é enviado ao Portal quando houver diferença em relação à última sincronização confirmada;
- clicar no botão enquanto o automático está ativo força uma verificação imediata;
- ao voltar à aba/janela depois de mais de 15 minutos, uma verificação é antecipada;
- se a ponte do Portal for fechada, o automático pausa e exige reativação explícita.

## Implementação preparada na branch

- userscript atualizado para V1.1.0;
- `@updateURL` e `@downloadURL` adicionados para facilitar atualizações futuras do Tampermonkey;
- GET same-origin do DigSaúde com `credentials: include` e `cache: no-store`;
- nenhuma leitura de `document.cookie`, localStorage, sessionStorage, token CSRF ou Authorization;
- assinatura local do snapshot para evitar POSTs sem mudança;
- `syncId` por envio para deduplicação da ponte;
- ponte `/agenda/sync/` deixou de fechar após uma sincronização e passou a aceitar múltiplos ciclos;
- a ponte continua aceitando mensagens apenas da origem oficial do DigSaúde e revalida a sessão do Portal;
- backend passou a aceitar snapshot completo com zero agendamentos, mas continua rejeitando vazio ambíguo;
- tela da Agenda explica o novo fluxo e mantém sincronização manual imediata como contingência;
- testes de regressão ampliados para automação, deduplicação, privacidade e snapshot vazio.

## Decisões e justificativas

### Intervalo de 15 minutos

É frequente o bastante para acompanhamento operacional diário sem gerar tráfego e gravações desnecessárias. O script não envia novamente quando nada mudou.

### Ponte persistente do Portal

Navegadores bloqueiam a abertura silenciosa de pop-ups fora de um gesto do usuário. Por isso a automação é ativada com um clique consciente e reutiliza a mesma janela autenticada. A janela pode ser minimizada, mas precisa permanecer aberta.

### Busca em segundo plano no próprio DigSaúde

Em vez de recarregar a aba em uso ou depender de endpoints internos do Livewire, o userscript faz um GET autenticado da própria página Agendados. Isso usa a sessão já existente sem ler, copiar ou transmitir cookies.

### Sem automação com navegador fechado

A V2 continua sendo uma automação local assistida. Monitoramento com navegador fechado exigiria integração institucional apropriada; senha/cookie de usuário não serão armazenados no backend como atalho.

## Alternativas descartadas

- recarregar a tela atual do DigSaúde a cada intervalo: interromperia o trabalho do usuário;
- tratar `/livewire/update` como API estável: acoplamento frágil ao framework interno;
- abrir uma nova janela do Portal silenciosamente a cada 15 minutos: bloqueado por políticas normais do navegador;
- guardar senha ou sessão do DigSaúde no Portal: risco de segurança e governança;
- enviar snapshots idênticos continuamente: desperdício de chamadas e gravações.

## Segurança e privacidade

- DigSaúde continua como fonte oficial;
- Portal continua somente leitura em relação ao DigSaúde;
- nenhuma senha, cookie, sessão ou token CSRF do DigSaúde é enviado ao Portal;
- `credentials: include` é usado apenas no GET same-origin dentro do próprio DigSaúde;
- Agenda continua sem PostHog/observabilidade de conteúdo clínico;
- respostas da API permanecem `no-store`;
- permissões permanecem Técnico em Telemedicina/Desenvolvedor.

## Checks e testes

- V1 e correção de subrequests já homologadas em produção.
- Testes V2 adicionados em `worker/tests/agenda.test.mjs`.
- Checks da branch V2 ainda pendentes até abertura do PR.

## Próximo passo exato

1. abrir PR da branch `feat/agenda-auto-sync-v2` contra `main`;
2. validar todos os workflows, especialmente `Validar Agenda DigSaúde V1` e regressões gerais;
3. corrigir qualquer falha sem ampliar o escopo;
4. mesclar somente com CI verde;
5. aguardar deploy de produção;
6. o usuário atualizar o userscript existente no Tampermonkey para a versão 1.1.0;
7. no DigSaúde, clicar uma vez em **Ativar sincronização automática**, minimizar a ponte do Portal e homologar:
   - sincronização inicial;
   - botão indicando automático ativo;
   - nova verificação sem mudança;
   - verificação após alteração real ou forçada;
   - pausa ao fechar a ponte e reativação posterior;
8. registrar o resultado real desta homologação.

## Riscos restantes

- timers de páginas em segundo plano podem ser atrasados pelo navegador; ao recuperar foco, o script antecipa a verificação vencida;
- se a lista futura ultrapassar uma página do DigSaúde, snapshots parciais não podem desativar ausentes;
- mudanças futuras no HTML Filament/Livewire podem exigir ajuste do extrator;
- o Tampermonkey já instalado manualmente precisa receber esta atualização uma vez; a partir da V1.1.0 ficam registrados URLs de atualização.
