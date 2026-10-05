# Agenda DigSaúde

Decisão registrada em 16/09/2026.

## Objetivo

A ferramenta `/agenda/` é uma camada operacional de acompanhamento dos agendamentos já autorizados no DigSaúde. O DigSaúde continua sendo a fonte oficial e o Portal não cria, altera, cancela nem reagenda consultas no sistema estadual.

O problema resolvido é de acompanhamento: destacar novos agendamentos e alterações, organizar por data e especialidade e manter o estado de visualização individual para cada Técnico em Telemedicina.

## Perfis e autorização

Acesso permitido:

- `admin` — Desenvolvedor;
- capacidade `telemedicina` — Técnico em Telemedicina.

A interface aplica a mesma regra do módulo de Telemedicina e o Worker revalida a autorização no servidor. Não basta esconder o card no frontend.

## Fonte dos dados

A aba **Agendados** do DigSaúde é renderizada como uma tabela Filament/Livewire. Cada consulta possui um identificador estável no registro da tabela e uma rota individual no formato `/consultas/{id}/view`.

A V1 não trata endpoints internos do Livewire como API pública e não armazena credenciais do DigSaúde.

## Fluxo de sincronização V2 — automático enquanto o DigSaúde estiver aberto

1. O usuário entra normalmente no DigSaúde com a conta institucional autorizada.
2. O userscript local adiciona **Ativar sincronização automática** à página de Consultas.
3. Um clique consciente abre a ponte protegida `/agenda/sync/`; isso é necessário porque navegadores bloqueiam a criação silenciosa de janelas sem gesto do usuário.
4. A ponte valida a sessão do Portal e permanece aberta; ela pode ser minimizada, mas não fechada enquanto a automação estiver ativa.
5. A cada 15 minutos, o userscript faz um GET autenticado **somente no próprio domínio do DigSaúde** para `consultas?activeTab=Agendados`, com `credentials: include` e `cache: no-store`.
6. A resposta HTML é interpretada em memória com `DOMParser`; a tela do DigSaúde em uso não é recarregada nem alterada.
7. O script calcula uma assinatura local do snapshot. Se nada mudou desde a última sincronização confirmada, não envia novamente ao Portal.
8. Quando há mudança — ou quando o usuário força uma verificação pelo botão — o snapshot é enviado à ponte por `postMessage`.
9. A ponte aceita mensagens somente da origem oficial do DigSaúde, deduplica cada envio por `syncId`, valida a sessão do Portal e chama a API same-origin.
10. O Worker compara e persiste os registros em lote no Firestore.

A sessão, cookie, senha, token CSRF ou token de autenticação do DigSaúde não é coletado nem enviado ao Portal. O `credentials: include` é usado exclusivamente pelo navegador no GET same-origin do próprio DigSaúde; o userscript não lê nem exporta cookies.

## Integridade da sincronização

O identificador do DigSaúde é usado como chave lógica. No Firestore, o caminho do documento usa um hash derivado desse identificador para evitar expor o ID bruto em caminhos técnicos.

Estados principais:

- novo: ID ainda não conhecido;
- alterado: ID conhecido com mudança em algum campo operacional;
- sem mudança: ID conhecido com os mesmos campos;
- removido da aba Agendados: registro conhecido que não apareceu em um snapshot comprovadamente completo.

Registros que saem da aba Agendados não são apagados. Eles ficam inativos para preservar histórico operacional.

O sincronizador somente considera um snapshot **completo** quando a quantidade de linhas lidas é igual ao contador da aba Agendados. Se houver mais registros do que a página carregada suporta, os itens recebidos podem ser atualizados, mas ausências não são interpretadas como remoção.

Um snapshot completo com contador **0** é aceito como estado válido e pode desativar os registros anteriormente ativos. Um snapshot vazio sem essa comprovação é rejeitado para evitar apagar logicamente a fila por falha de carregamento.

## Campos armazenados

A V1 limita-se aos campos operacionais visíveis na lista:

- identificador da consulta;
- data da solicitação;
- especialidade;
- indicação de retorno/devolução;
- classificação exibida;
- data e horário do agendamento;
- especialista;
- paciente;
- município;
- tipo de agendamento;
- estabelecimento;
- status;
- datas técnicas de primeira detecção, última detecção e última alteração.

Não são importados PDF, encaminhamento, diagnóstico, CID, prescrição, resultado de exame ou conteúdo clínico da página individual.

## Estado de leitura

Cada usuário autorizado possui sua própria marca de leitura. Abrir um agendamento para um técnico não o torna visualizado para outro técnico.

Um registro volta a ficar não lido para o usuário se sofrer alteração após a última leitura.

## Privacidade e observabilidade

A página Agenda não carrega a camada de observabilidade do Portal. Nome de paciente, identificador do DigSaúde, especialidade associada ao paciente e demais campos da Agenda não podem ser enviados ao PostHog ou a outra ferramenta de analytics.

As respostas da API usam `Cache-Control: no-store`.

## Limitações conhecidas da V2

A V2 não faz login automático no DigSaúde e não monitora a conta quando o navegador autorizado está fechado. Para iniciar a automação em cada sessão de trabalho, o Técnico em Telemedicina precisa clicar uma vez em **Ativar sincronização automática** e manter a ponte do Portal aberta. Se a ponte for fechada, a automação pausa e exige reativação explícita.

O intervalo de 15 minutos é uma escolha operacional para equilibrar atualização frequente e carga desnecessária. O userscript também verifica ao retornar à aba/janela se o intervalo já venceu.

Monitoramento totalmente autônomo com navegador fechado somente deve ser considerado se existir integração oficial ou credencial de serviço institucional apropriada. Não armazenar senha de usuário do DigSaúde no Portal como atalho.

## Arquivos principais

- `agenda/index.html`
- `agenda/sync/index.html`
- `agenda/digsaude-agenda-sync.user.js`
- `css/agenda.css`
- `js/agenda.js`
- `js/agenda-sync-bridge.js`
- `worker/agenda.js`
- `worker/tests/agenda.test.mjs`
- `.github/workflows/validate-agenda.yml`

## V3 — contato do paciente e aviso por WhatsApp

Decisão permanente registrada em 01/10/2026.

Objetivo operacional: o profissional que realiza a sincronização do DigSaúde alimenta a Agenda com o telefone do paciente para que o Técnico em Telemedicina possa, depois, trabalhar somente no `/agenda/`, inclusive com o DigSaúde fechado.

### Coleta do contato

- o telefone é obtido somente dentro da sessão já autenticada do DigSaúde;
- o sincronizador consulta a rota individual `/consultas/{id}/view` correspondente ao mesmo `sourceId` já presente na aba Agendados;
- o sincronizador usa a janela auxiliar same-origin, aguarda a rota exata da consulta e um novo Document, aciona **Ver Dados do Paciente** e lê somente o diálogo visível **Dados do Paciente**;
- o userscript não roda sua interface dentro da janela auxiliar, evitando recursão;
- o próprio DigSaúde executa o Livewire normalmente; o sincronizador não monta nem replica payload interno do framework;
- todo o fluxo permanece same-origin e usa somente a sessão já autenticada do navegador;
- senha, cookie, bearer token e sessão do DigSaúde não são enviados ao Portal;
- a extração é serializada para reduzir carga no sistema estadual;
- o contato fica em cache apenas em memória no navegador por até 24 horas; não usa `localStorage` nem `sessionStorage`.

### Persistência no Portal

O telefone normalizado é enviado junto com o snapshot operacional da Agenda e armazenado no Firestore privado do módulo. Ele não é versionado no GitHub, não entra em PostHog, logs ou observabilidade e é devolvido apenas pela API autenticada da Agenda para usuários autorizados de Telemedicina/Desenvolvedor.

No patch local de 05/10/2026, contatos legados não são considerados verificados. A coleta recebe versão e vínculo com a consulta; o Worker vincula o contato ao paciente/data de solicitação do espelho e limita sua validade a 24 horas. Uma coleta realizada que retorne vazio ou falhe revoga o destino anterior. Um snapshot que não tentou coletar contato só preserva um contato verificado, ainda válido e da mesma associação. Esta alteração está apenas local. O diálogo/campo foi homologado estruturalmente em 05/10/2026; a validação operacional completa e a publicação continuam pendentes.

### Ação no card

O botão principal do card deixa de ser **Abrir no DigSaúde** e passa a ser **Avisar por WhatsApp**.

Ao clicar:
- a Agenda reconfirma a capacidade v2 do Worker e o contato da mesma ficha antes de atribuir o destino à janela; perda de capacidade, mudança ou revogação interrompem a abertura;
- a mensagem é apenas preparada; o envio continua exigindo confirmação humana no WhatsApp;
- o agendamento é marcado como visualizado para aquele usuário;
- o local do atendimento não é incluído automaticamente, pois será informado em seguida pelo Técnico em Telemedicina.

Mensagem-base:

```text
Olá, [nome do paciente]
Este é um lembrete da sua consulta agendada:
Data: [DATA]
Horário: [HORÁRIO]
Especialidade: [ESPECIALIDADE]

Caso não possa comparecer, pedimos que nos avise com antecedência na unidade de atendimento.

Dúvidas? Estamos à disposição!
```

Para Psiquiatria, a apresentação usa **Médico Psiquiatra**, preservando o texto operacional já utilizado pela equipe.

### Privacidade

Telefone é dado pessoal protegido. Não deve aparecer em documentação pública com valor real, telemetria, logs, mensagens de erro ou URLs internas do Portal. A única URL externa formada com o número é a ação consciente do usuário para `wa.me`, aberta no navegador do usuário autorizado.

### V3.1 — correção da captura de contato — 01/10/2026

A primeira V3 foi publicada com reconstrução manual da chamada Livewire observada no DevTools. Em produção, os cards permaneceram em **Sincronizando contato…**, indicando que o enriquecimento falhava antes de obter o telefone. O snapshot da Agenda continuava sendo enviado, mas com contato vazio.

Correção: usar a própria interface/componente do DigSaúde como executor. Para cada consulta, o userscript cria um iframe same-origin fora da tela, aguarda o carregamento, procura o telefone, clica no botão real **Ver Dados do Paciente** quando necessário e observa o DOM até o telefone aparecer. O iframe é removido imediatamente depois e o processo é serializado em uma consulta por vez.

Isso elimina dependência do formato interno do payload Livewire e mantém a coleta dentro da sessão autenticada do DigSaúde, sem copiar cookies, token CSRF ou credenciais para o Portal.

### V3.2 — correção para X-Frame-Options DENY — 02/10/2026

Diagnóstico real do ambiente DigSaúde: as respostas do sistema incluem `X-Frame-Options: DENY`. Portanto, mesmo um iframe same-origin não pode renderizar a consulta; a V3.1 conseguia percorrer o fluxo lógico, mas o navegador bloqueava a página auxiliar antes de o telefone aparecer.

Correção:
- remover o iframe;
- reutilizar uma única janela popup aberta por gesto explícito do usuário ao ativar a sincronização;
- essa janela navega, uma consulta por vez, para a rota individual do DigSaúde, aciona **Ver Dados do Paciente** e lê somente o telefone;
- concluída a coleta, a mesma janela navega para a ponte protegida do Portal e entrega o snapshot;
- nas verificações seguintes, a mesma janela alterna entre DigSaúde e Portal, sem criar novos pop-ups;
- a janela pode permanecer minimizada;
- falhas de contato permanecem visíveis no status final como **N contato(s) pendente(s)** em vez de parecer que todos foram sincronizados.

A arquitetura continua sem copiar cookie, senha, bearer token ou CSRF do DigSaúde para o Portal. A janela auxiliar é top-level, portanto não é afetada pelo bloqueio de frames do sistema estadual.

### V3.3 — contato persistido, leitura somente dos faltantes e confirmação real — 02/10/2026

Após a V3.2, a coleta visual conseguiu percorrer as consultas, porém a experiência continuava lenta e a interface não comprovava que os números tinham sido efetivamente persistidos. O contador anterior indicava tentativas de leitura, não confirmação no Firestore.

A V3.3 muda o ciclo:
- ao abrir a ponte, o Portal consulta uma rota autenticada mínima `/api/agenda/contact-state`;
- a resposta contém somente contagens e os `sourceId` já associados a um telefone válido; nenhum número de telefone é devolvido à página do DigSaúde;
- o sincronizador consulta no DigSaúde **somente** agendamentos ainda sem contato persistido;
- o telefone é localizado também pela relação visual **Telefone → campo de entrada**, além dos seletores técnicos Filament, evitando esperar timeout quando o campo já está na tela;
- o tempo máximo por consulta caiu de 18 s para 8 s; em sucesso normal a coleta termina assim que o campo aparece;
- telefone fica fora da assinatura usada para detectar mudanças da Agenda, mas uma nova captura de contato força o envio mesmo quando os demais dados do agendamento não mudaram;
- depois do commit, a ponte consulta novamente `contact-state` e informa ao sincronizador a cobertura real persistida;
- o status final passa a mostrar **X contatos disponíveis · Y pendentes**, em vez de inferir sucesso a partir do número de tentativas.

Consequência operacional: a primeira carga ainda precisa enriquecer os contatos faltantes; depois disso, sincronizações normais não percorrem novamente pacientes cujo telefone já está salvo.

### V3.4 — extração robusta do telefone e foco somente em lembretes úteis — 02/10/2026

Após a V3.3, a cobertura persistida confirmou que apenas uma pequena parte dos contatos realmente havia sido capturada. A causa remanescente estava no formato real do campo: o DigSaúde pode apresentar o telefone em estruturas Filament diferentes, com rótulo visual, wrappers sem `name/id/wire:model` previsíveis e, em alguns casos, texto com formatação ou mais de um número.

A V3.4 amplia a leitura sem relaxar a privacidade:
- tenta atributos técnicos conhecidos;
- usa também o vínculo visual do rótulo **Telefone** com seu wrapper;
- aceita número formatado, múltiplos valores separados por `/`, `;`, vírgula, quebra de linha ou barra vertical e escolhe o primeiro telefone brasileiro válido;
- evita falsos positivos próximos de campos CPF, CNS, CEP e Número;
- continua sem exportar o telefone para logs/telemetria;
- contatos já persistidos continuam sendo ignorados;
- somente agendamentos de **hoje ou datas futuras** entram na coleta de telefone; cards antigos não desperdiçam tempo nem continuam exibindo “Sincronizando contato…”;
- cards com data passada passam a mostrar **Data já passou** no lugar da ação de WhatsApp.

Esse recorte é coerente com a finalidade do recurso: preparar lembretes de consultas atuais/futuras, não enriquecer retrospectivamente agendamentos antigos.

### V3.4 — extração robusta e lembretes úteis — 02/10/2026

A cobertura persistida revelou que o fluxo ainda não reconhecia de forma confiável todos os formatos do campo de telefone no DOM real do DigSaúde.

A V3.4:
- tenta os atributos técnicos conhecidos do campo;
- usa também o wrapper associado ao rótulo visual **Telefone**;
- aceita número formatado e mais de um número no mesmo campo, usando o primeiro telefone brasileiro válido;
- evita interpretar campos numéricos vizinhos como telefone;
- continua sem registrar telefone em logs ou telemetria;
- contatos já persistidos não são consultados novamente;
- somente consultas de hoje ou futuras entram no enriquecimento de contato;
- cards antigos exibem **Data já passou** em vez de “Sincronizando contato…”.

A finalidade é operacional: preparar lembretes para consultas atuais e futuras sem gastar tempo enriquecendo retrospectivamente agendamentos antigos.

### Compatibilidade de entrega e rollback — 05/10/2026

O contrato `contactCapability: patient-details-v2` impede que frontend, ponte e coletor atualizados usem contatos de um Worker anterior. A perda da capacidade limpa caches e pausa a coleta; o botão não contém link navegável pré-carregado e revalida a mesma ficha antes de abrir um destino. O gate de deploy e seu rollback continuam intactos. Atualizar/reabrir clientes e coletor é necessário; links antigos já carregados não recebem essa proteção. Detalhes e testes em `AGENDA-CONTATO-COMPATIBILIDADE.md`.
