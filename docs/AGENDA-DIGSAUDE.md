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
