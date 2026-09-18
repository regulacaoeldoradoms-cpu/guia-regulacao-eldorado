# Agenda DigSaúde — Status

Atualizado em 18/09/2026.

## Estado atual

## Incidente de armazenamento — 17–18/09/2026

- Sintoma em produção: a rota `/agenda/` exibe **Falha ao consultar a Agenda** e **Armazenamento da Agenda indisponível.**
- Diagnóstico confirmado no código atual: essa mensagem/HTTP 503 é retornada por `worker/agenda.js` antes de qualquer leitura do Firestore quando `firebaseConfigured(env)` é falso.
- O guard depende conjuntamente de `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` e `FIREBASE_PRIVATE_KEY`. Portanto os contadores zerados na interface não comprovam perda dos registros; a consulta ao armazenamento nem chega a acontecer.
- A Agenda já havia sido homologada com sincronização real em 16/09/2026. Não tratar o incidente como instalação inicial nem criar uma base vazia substituta.
- `worker/wrangler.toml` já possui `keep_vars = true`; republicar o mesmo código sem recuperar a configuração externa não é correção suficiente.
- O PR documental #206 registrou corretamente o bloqueio, mas não restaurou produção porque a sessão não tinha acesso à configuração ativa da Cloudflare.
- Em 18/09 foi preparada a recuperação controlada `scripts/agenda/recuperar-firebase-agenda.mjs`. Ela não recebe nem imprime segredos. O fluxo confirma o 503, inspeciona apenas nomes/tipos dos bindings, localiza uma versão da Agenda previamente homologada, faz rollback temporário, confirma que o guard de armazenamento voltou a passar e republica a `main` atual com os bindings preservados.
- Versões históricas priorizadas por terem evidência real de Agenda funcional: `9dfd38af-4f3a-4f6e-a4ca-b177a377c0d6`, `8fcc9e5f-868b-4c0a-be59-9e16744c72b3` e `a790bd06-b51a-4a02-8bf2-fe2a28f84849`. O script valida os bindings antes de usar qualquer uma delas.
- Se a republicação da `main` falhar depois do rollback temporário, o script tenta restaurar automaticamente a versão produtiva que estava ativa antes da intervenção.
- A validação anônima não acessa pacientes: com o Firebase ausente a API responde 503; com o armazenamento restaurado a requisição sem sessão alcança novamente a barreira de autenticação (401/403).
- Estado neste documento: **ferramenta de recuperação preparada; resta executar no ambiente Cloudflare autenticado e depois homologar a Agenda real**. Não declarar o incidente encerrado antes dessa evidência.
- Primeira tentativa em 18/09 parou na etapa 1 com `RECUPERACAO_INTERROMPIDA=GIT_CLONE_FALHOU`, antes de qualquer alteração na Cloudflare. A ferramenta foi revisada para não depender do Git local: a `main` passa a ser obtida pela API pública do GitHub e por snapshot ZIP do commit exato, com reconfirmação do SHA antes da republicação.

### Execução controlada

A partir de uma máquina já autorizada no Cloudflare/Wrangler, com Node.js 22+ disponível; Git local não é mais necessário:

```powershell
node scripts/agenda/recuperar-firebase-agenda.mjs --recuperar
```

O operador deve confirmar digitando `RECUPERAR AGENDA` somente depois de o script mostrar a versão produtiva atual e a versão de recuperação. Não colar chave Firebase, token Cloudflare ou outro segredo no terminal além da autenticação normal do Wrangler, e nunca enviar esses valores por chat ou GitHub.

Depois de `AGENDA_RECUPERADA`:

1. atualizar `/agenda/`;
2. confirmar que os registros anteriores reapareceram;
3. executar uma sincronização autorizada pelo fluxo já homologado;
4. registrar a evidência e encerrar o incidente/PR #206.

- Frente: Agenda DigSaúde.
- V1 original mesclada na `main` pelo PR #185 em `77a1b7b55750ce19ba1c0d3cf8ddf5070ec6c751`.
- Correção do limite de subrequests mesclada pelo PR #186 em `cd1d67232f34acd77d0b194be194a75d816fc8ce`.
- Deploy do Worker corrigido concluído com sucesso em 16/09/2026, versão Cloudflare `a790bd06-b51a-4a02-8bf2-fe2a28f84849`.
- O usuário repetiu a sincronização real após o deploy e confirmou que **deu certo**; portanto a primeira sincronização funcional em produção está homologada.
- Nova unidade autorizada: **V2 — sincronização automática enquanto o DigSaúde estiver aberto**.
- PR #188 — **Agenda V2: sincronização automática enquanto DigSaúde estiver aberto** — validado e mesclado na `main` em `ebf82dc3666a0c253387ee0fcdf0b786934ab815`.
- Produção: deploy concluído com sucesso; Worker publicado na versão Cloudflare `8fcc9e5f-868b-4c0a-be59-9e16744c72b3` e pipeline de deploy do site concluído com sucesso.
- Estado atual: V2 publicada e **homologação inicial real concluída** no navegador autorizado.
- Ajuste visual autorizado em 16/09/2026: mover o controle do sincronizador para o canto inferior esquerdo e, após ativação, reduzi-lo a um chip compacto com apenas o ícone `⟳`, exibindo detalhes somente em hover/clique.
- Ajuste visual implementado no PR #191 — **Agenda: chip compacto do sincronizador no canto inferior esquerdo** — e mesclado na `main` em `abf7882f125cc9b3b3e322a2b14981e304aaec67`.
- Pós-merge do PR #191: **26/26 check-runs concluídos com sucesso**, incluindo build/deploy, validação da Agenda e regressões gerais.
- Produção: userscript **1.1.1** publicado; resta somente homologar visualmente o novo chip no navegador autorizado.
- Nova correção autorizada em 16/09/2026: **persistência real de visualização dos agendamentos** e manutenção do card após marcar como visto.
- Problema observado: ao marcar um card como visto, ele desaparecia porque a tela iniciava no filtro `Novos / alterados`; além disso, o estado de leitura podia voltar após uma nova sincronização porque a memória ficava embutida no mesmo documento que o sincronizador substitui.
- Correção implementada no PR #193 — **Agenda: manter visualizados na lista e persistir memória de leitura** — e mesclada na `main` em `dac9dbe006ada9fd68b033799a6ead3c4743843d`.
- PR #193: **21/21 checks** concluídos com sucesso antes do merge.
- Pós-merge da `main`: **26/26 check-runs** concluídos com sucesso, incluindo build, deploy, validação da Agenda e regressões gerais.
- Worker publicado com sucesso na versão Cloudflare `9dfd38af-4f3a-4f6e-a4ca-b177a377c0d6`.
- Evidência real em 16/09/2026: a ponte `/agenda/sync/` exibiu `Automático ativo · última sincronização: 10:13 · 0 novo(s), 0 alterado(s)`, confirmando conexão persistente e primeira sincronização automática bem-sucedida sem mudanças.
- Nova melhoria autorizada em 16/09/2026: **seletor de ordenação cronológica dos agendamentos**, com `Agendamento mais próximo` como padrão e alternativa `Agendamento mais distante`.
- Implementação concluída no PR #196 — **Agenda: adicionar ordenação cronológica de agendamentos** — e mesclada na `main` em `9c4fd1fa6e4b1f06459224051a6f1933999eb818`.
- PR #196: **21/21 checks** concluídos com sucesso antes do merge.
- Pós-merge da `main`: **26/26 check-runs** concluídos com sucesso, incluindo build e deploy. Produção publicada; resta homologação visual/funcional no navegador autorizado.
- Nova melhoria autorizada em 16/09/2026: **controle operacional automático das 2 salas de teleconsulta do Posto Manoel Gomes**, com janela direta de 30 minutos, Psiquiatria fora do cálculo e alerta de capacidade excedida.
- Implementação concluída no PR #198 — **Agenda: controlar capacidade das salas** — e mesclada na `main` em `1444f6bffa5d5fe9723b76fae8b8e812cddcaf51`.
- PR #198: **21/21 checks** concluídos com sucesso antes do merge.
- Pós-merge da `main`: **26/26 check-runs** concluídos com sucesso, incluindo build e deploy; produção publicada.
- Fluxo final de remanejamento: a mensagem com data, horários, pacientes e especialidades é preparada localmente; o usuário copia o texto e abre o WhatsApp do suporte, sem colocar dados de pacientes na URL.
- Ajuste visual autorizado em 16/09/2026: quando a ocupação estiver em **2/2 salas**, o card inteiro deve ficar amarelo para deixar a capacidade máxima imediatamente visível; capacidade excedida continua com destaque vermelho.

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

- userscript automático atualizado e publicado como V1.1.1;
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

## Ciclo de vida dos cards

Decisão funcional confirmada em 16/09/2026:

- **marcar como visto não remove o card** enquanto a consulta ainda estiver na aba **Agendados** do DigSaúde;
- o Portal mantém esse card como ativo e apenas muda sua apresentação para **visualizado**;
- quando uma sincronização completa confirmar que a consulta **não está mais na lista Agendados original**, o registro é marcado como inativo e desaparece da visão padrão do Portal;
- a remoção da visão padrão é determinada pela **fonte oficial DigSaúde**, não apenas pela passagem da data no relógio local;
- o histórico inativo continua recuperável somente se o usuário marcar manualmente **Mostrar removidos da aba Agendados**;
- a memória de visualização continua armazenada separadamente para consistência, mas não mantém um card inativo visível.

Justificativa: o objetivo da Agenda é acompanhamento operacional até o agendamento deixar a fila oficial; ela não deve se transformar em histórico permanente de pacientes após a saída do DigSaúde.

## Ordenação cronológica dos agendamentos

Decisão funcional confirmada em 16/09/2026:

- a barra de acompanhamento passa a ter um seletor **Ordenar por data do agendamento**;
- opções: **Agendamento mais próximo** e **Agendamento mais distante**;
- **Agendamento mais próximo** é o padrão;
- a ordenação considera primeiro a data e, em caso de empate, o horário do agendamento;
- registros sem data ou sem horário ficam ao final para não ultrapassarem agendamentos com data/hora definida;
- a ordenação é aplicada depois dos filtros de escopo, especialidade e pesquisa;
- a mudança é somente de apresentação; não altera dados sincronizados nem a ordem na fonte DigSaúde.

## Controle operacional das salas

Decisão funcional aprovada em 16/09/2026:

- existem **2 salas de teleconsulta** no Posto Manoel Gomes;
- o cálculo usa uma **janela direta de até 30 minutos**, sem encadeamento transitivo: 08:00 e 09:00 não pertencem ao mesmo conflito apenas porque existe 08:30;
- **Psiquiatria fica fora do cálculo**, pois é atendida pelo médico na própria Unidade Básica de Saúde e não ocupa essas duas salas;
- 2 agendamentos elegíveis dentro da janela recebem aviso **2/2 salas no intervalo**, mas ainda são atendíveis;
- na interface, os cards envolvidos em **2/2 salas** usam fundo amarelo forte e borda âmbar no card inteiro, independentemente de estarem novos/alterados ou já visualizados; o estado crítico de 3+ continua vermelho e prevalece visualmente;
- 3 ou mais agendamentos elegíveis dentro da mesma janela direta geram **Capacidade excedida**;
- o alerta crítico lista data, horários, nomes dos pacientes e especialidades;
- a mensagem é preenchida automaticamente no Portal com data, horários, nomes dos pacientes e especialidades, iniciando por “Olá, identificamos conflito de horários...” e solicitando o remanejamento mínimo necessário;
- por privacidade, os dados de pacientes não são colocados na URL do WhatsApp: o usuário usa **Copiar mensagem** e **Abrir WhatsApp do suporte** para o contato +55 67 8163-1815, revisa e confirma o envio;
- o Portal não envia a mensagem automaticamente;
- o cálculo usa somente os registros ativos já sincronizados e não modifica o DigSaúde;
- a Agenda continua sem observabilidade de conteúdo de paciente.

Justificativa: automatizar a conferência operacional antes feita pela planilha de conflitos, sem transformar o Portal em fonte oficial do agendamento e sem ampliar coleta de dados.

## Próximo passo exato

1. concluir os checks e publicar o ajuste visual do card **2/2 salas** somente com CI verde;
2. no Portal, atualizar a Agenda com `Ctrl+F5`;
3. confirmar que os dois cards do cenário real de **2/2 salas no intervalo** aparecem inteiramente amarelos;
4. confirmar que um cenário de **Capacidade excedida** continua vermelho e não é sobrescrito pelo amarelo;
5. registrar a homologação humana desta correção visual no status.

## Riscos restantes

- timers de páginas em segundo plano podem ser atrasados pelo navegador; ao recuperar foco, o script antecipa a verificação vencida;
- se a lista futura ultrapassar uma página do DigSaúde, snapshots parciais não podem desativar ausentes;
- mudanças futuras no HTML Filament/Livewire podem exigir ajuste do extrator;
- o Tampermonkey já instalado manualmente precisa receber esta atualização uma vez; a partir da V1.1.0 ficam registrados URLs de atualização.
