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

## Fluxo de sincronização V1

1. O usuário entra normalmente no DigSaúde com a conta institucional autorizada.
2. Um userscript local adiciona o botão **Enviar Agenda ao Portal** na página de Consultas.
3. O script lê somente as linhas da aba **Agendados** já renderizadas no navegador.
4. O script abre `/agenda/sync/` no Portal e envia o snapshot por `postMessage`.
5. A ponte do Portal aceita mensagens somente da origem `https://teleatendimento.saude.ms.gov.br`, valida a sessão do Portal e chama a API same-origin.
6. O Worker persiste e compara os registros no Firestore.

A sessão, cookie, senha, token CSRF ou token de autenticação do DigSaúde não é coletado nem enviado ao Portal.

## Integridade da sincronização

O identificador do DigSaúde é usado como chave lógica. No Firestore, o caminho do documento usa um hash derivado desse identificador para evitar expor o ID bruto em caminhos técnicos.

Estados principais:

- novo: ID ainda não conhecido;
- alterado: ID conhecido com mudança em algum campo operacional;
- sem mudança: ID conhecido com os mesmos campos;
- removido da aba Agendados: registro conhecido que não apareceu em um snapshot comprovadamente completo.

Registros que saem da aba Agendados não são apagados. Eles ficam inativos para preservar histórico operacional.

O sincronizador somente considera um snapshot **completo** quando a quantidade de linhas lidas é igual ao contador da aba Agendados. Se houver mais registros do que a página carregada suporta, os itens recebidos podem ser atualizados, mas ausências não são interpretadas como remoção.

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

## Limitação conhecida da V1

A V1 não faz login automático no DigSaúde e não monitora a conta quando nenhum navegador autorizado está aberto. A atualização é iniciada por um Técnico em Telemedicina enquanto estiver autenticado no DigSaúde.

Monitoramento totalmente autônomo somente deve ser considerado se existir integração oficial ou credencial de serviço institucional apropriada. Não armazenar senha de usuário do DigSaúde no Portal como atalho.

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
