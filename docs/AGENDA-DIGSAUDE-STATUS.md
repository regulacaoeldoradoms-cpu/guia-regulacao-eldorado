# Agenda DigSaúde — Status

Atualizado em 16/09/2026.

## Estado atual

- Frente: Agenda DigSaúde.
- V1 original mesclada na `main` pelo PR #185 em `77a1b7b55750ce19ba1c0d3cf8ddf5070ec6c751`.
- Correção do limite de subrequests mesclada pelo PR #186 em `cd1d67232f34acd77d0b194be194a75d816fc8ce`.
- Deploy do Worker corrigido concluído com sucesso em 16/09/2026, versão Cloudflare `a790bd06-b51a-4a02-8bf2-fe2a28f84849`.
- O usuário repetiu a sincronização real após o deploy e confirmou que **deu certo**; portanto a primeira sincronização funcional em produção está homologada.
- Nova unidade autorizada: **V2 — sincronização automática enquanto o DigSaúde estiver aberto**.
- PR #188 — **Agenda V2: sincronização automática enquanto DigSaúde estiver aberto** — validado e mesclado na `main` em `ebf82dc3666a0c253387ee0fcdf0b786934ab815`.
- Produção: deploy concluído com sucesso; Worker publicado na versão Cloudflare `8fcc9e5f-868b-4c0a-be59-9e16744c72b3` e pipeline de deploy do site concluído com sucesso.
- Estado atual: V2 publicada e **homologação inicial real concluída** no navegador autorizado.
- Evidência real em 16/09/2026: a ponte `/agenda/sync/` exibiu `Automático ativo · última sincronização: 10:13 · 0 novo(s), 0 alterado(s)`, confirmando conexão persistente e primeira sincronização automática bem-sucedida sem mudanças.

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

## Implementação publicada

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
- PR #188 passou com todos os workflows da branch em verde, incluindo `Validar Agenda DigSaúde V1` e regressões gerais.
- Pós-merge da `main` em `ebf82dc3`: **26/26 check-runs concluídos com sucesso**, incluindo build, deploy, Worker, validações de Agenda, autenticação, Telemedicina, Conselho, Social e demais regressões.
- Deploy do Worker confirmado com sucesso na versão `8fcc9e5f-868b-4c0a-be59-9e16744c72b3`.

## Homologação real da V2

- userscript 1.1.0 instalado e executando no navegador autorizado;
- botão **Ativar sincronização automática** acionado com sucesso;
- ponte protegida do Portal aberta e autenticada;
- primeira sincronização automática concluída com sucesso às **10:13 de 16/09/2026**;
- resultado observado: **0 novo(s), 0 alterado(s)**, coerente com uma execução sem mudanças desde a sincronização anterior;
- nenhuma nova falha de subrequests, autenticação ou comunicação foi observada nessa execução.

A homologação funcional inicial está aprovada. Ainda faltam somente testes operacionais de continuidade ao longo do uso normal.

## Próximo passo exato

1. deixar DigSaúde e a ponte do Portal abertos durante o expediente;
2. confirmar uma próxima verificação automática após o intervalo de 15 minutos ou ao recuperar foco vencido;
3. quando ocorrer uma mudança real no DigSaúde, confirmar que o Portal registra `+novo` ou `~alterado` sem intervenção manual;
4. em momento controlado, fechar a ponte, confirmar que o automático pausa e depois reativá-lo;
5. se esses três comportamentos passarem, considerar a V2 integralmente homologada e encerrar esta unidade.

## Riscos restantes

- timers de páginas em segundo plano podem ser atrasados pelo navegador; ao recuperar foco, o script antecipa a verificação vencida;
- se a lista futura ultrapassar uma página do DigSaúde, snapshots parciais não podem desativar ausentes;
- mudanças futuras no HTML Filament/Livewire podem exigir ajuste do extrator;
- o Tampermonkey já instalado manualmente precisa receber esta atualização uma vez; a partir da V1.1.0 ficam registrados URLs de atualização.
