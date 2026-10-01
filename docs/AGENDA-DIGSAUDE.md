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

O Portal não trata endpoints internos do Livewire como API pública e não armazena credenciais do DigSaúde. Para o contato do paciente, o sincronizador faz um GET same-origin da página individual da consulta, lê do HTML atual o componente e a ação **Ver Dados do Paciente** e reproduz localmente a chamada Livewire correspondente. O método, parâmetros, snapshot e token CSRF são obtidos da própria página carregada naquela sessão; nenhum deles é enviado ao Portal. Da resposta, somente o telefone é extraído.

## Fluxo de sincronização V2 — automático enquanto o DigSaúde estiver aberto

1. O usuário entra normalmente no DigSaúde com a conta institucional autorizada.
2. O userscript local adiciona **Ativar sincronização automática** à página de Consultas.
3. Um clique consciente abre a ponte protegida `/agenda/sync/`; isso é necessário porque navegadores bloqueiam a criação silenciosa de janelas sem gesto do usuário.
4. A ponte valida a sessão do Portal e permanece aberta; ela pode ser minimizada, mas não fechada enquanto a automação estiver ativa.
5. A cada 15 minutos, o userscript faz um GET autenticado **somente no próprio domínio do DigSaúde** para `consultas?activeTab=Agendados`, com `credentials: include` e `cache: no-store`.
6. A resposta HTML é interpretada em memória com `DOMParser`; a tela do DigSaúde em uso não é recarregada nem alterada.
7. O script calcula uma assinatura local do snapshot. Se nada mudou desde a última sincronização confirmada e não há atualização de contato pendente, evita envio desnecessário.
8. Quando há mudança — ou quando o usuário força uma verificação pelo botão — o snapshot é enviado à ponte por `postMessage`.
9. A ponte aceita mensagens somente da origem oficial do DigSaúde, deduplica cada envio por `syncId`, valida a sessão do Portal e chama a API same-origin.
10. O Worker compara e persiste os registros em lote no Firestore e responde somente com os identificadores dos agendamentos cujo telefone está ausente ou precisa de atualização.
11. O userscript consulta no máximo **2 fichas simultaneamente**, dentro do próprio domínio autenticado do DigSaúde. Para cada ficha, ele faz GET da consulta e uma chamada `/livewire/update` derivada do HTML/snapshot atual para executar **Ver Dados do Paciente**, localiza o telefone na resposta e envia um segundo snapshot parcial somente com os contatos necessários.
12. O telefone fica persistido de forma privada junto ao registro da Agenda e é atualizado novamente após 24 horas de uso/sincronização, sem exigir que o DigSaúde permaneça aberto para a Ediane depois da coleta.

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
- telefone do paciente, normalizado para uso operacional no WhatsApp e com data técnica da última sincronização;
- município;
- tipo de agendamento;
- estabelecimento;
- status;
- datas técnicas de primeira detecção, última detecção e última alteração.

Da página individual, **somente o telefone** é importado. Não são importados CPF, CNS, endereço, data de nascimento, PDF, encaminhamento, diagnóstico, CID, prescrição, resultado de exame ou demais campos do cadastro/atendimento.

## Estado de leitura

Cada usuário autorizado possui sua própria marca de leitura. Abrir um agendamento para um técnico não o torna visualizado para outro técnico.

Um registro volta a ficar não lido para o usuário se sofrer alteração após a última leitura.

## Privacidade e observabilidade

A página Agenda não carrega a camada de observabilidade do Portal. Nome de paciente, telefone, identificador do DigSaúde, especialidade associada ao paciente e demais campos da Agenda não podem ser enviados ao PostHog ou a outra ferramenta de analytics.

O telefone não é devolvido na listagem geral da Agenda. O card recebe somente `contactAvailable`; o número é liberado apenas sob demanda em `POST /api/agenda/contact`, depois da mesma validação de sessão e capacidade Telemedicina aplicada ao restante do módulo. As respostas da API usam `Cache-Control: no-store`.

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

## V3 — Avisar por WhatsApp sem abrir o DigSaúde — 01/10/2026

Decisão operacional permanente:

- Wellyton/operador responsável mantém a sincronização do DigSaúde;
- Ediane, que acompanha as teleconsultas, deve conseguir trabalhar somente pela `/agenda/` depois que os contatos já estiverem sincronizados;
- o botão **Abrir no DigSaúde** é removido do card e substituído por **Avisar por WhatsApp**;
- o clique consulta o telefone privado no backend, abre diretamente `wa.me` para aquele paciente e preenche a mensagem; o Portal **não envia automaticamente**;
- clicar em **Avisar por WhatsApp** também marca o agendamento como visualizado para aquele usuário, preservando a memória individual de leitura;
- se um registro legado ainda não tiver telefone, o card mostra **Aguardando contato** até a próxima sincronização; como o DigSaúde exige telefone no cadastro do paciente, ausência persistente é tratada como falha de coleta/sincronização, não como estado normal do paciente.

Mensagem pré-preenchida:

```text
Olá, [nome do paciente]
Este é um lembrete da sua consulta agendada:
Data: [DATA] Horário: [HORARIO]
Especialidade: [ESPECIALIDADE]
Caso não possa comparecer, pedimos que nos avise com antecedência na unidade de atendimento.
Dúvidas? Estamos à disposição!
```

O **local não é inserido automaticamente**. Ediane informa o local em uma mensagem seguinte, de acordo com a organização daquele atendimento.

### Segurança do contato

- número armazenado somente no Firestore protegido da Agenda;
- número não aparece na listagem geral, no HTML estático, GitHub, PostHog, logs ou telemetria;
- nenhuma senha, cookie, token de sessão ou CSRF do DigSaúde é exportado; o CSRF é lido e usado somente na requisição same-origin local;
- a extração ocorre por GET + Livewire same-origin no navegador autorizado, sem iframe e sem contornar `X-Frame-Options`;
- a consulta individual é usada somente para obter o campo de telefone;
- o sincronizador limita a concorrência a 2 fichas para não sobrecarregar o DigSaúde;
- contatos faltantes são tentados novamente e contatos existentes são revalidados periodicamente.

