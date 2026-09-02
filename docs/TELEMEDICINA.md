# Módulo de Telemedicina

Decisão permanente registrada em 01/09/2026.

## Objetivo

O módulo `/telemedicina/` substitui o controle operacional de retornos de teleconsulta que antes dependia de Google Docs + comentários + Google Agenda.

A ferramenta deve:

- manter um cadastro único por paciente e agrupar automaticamente seu histórico longitudinal;
- registrar cada teleconsulta com data, especialidade, resolutividade/conduta e observação operacional;
- identificar se há retorno e sua data-alvo quando ela puder ser determinada com segurança;
- iniciar a janela de solicitação 15 dias antes da data-alvo;
- gerar três lembretes em dias úteis consecutivos;
- manter a tarefa visível depois dos três avisos, passando para `ATRASADO` até que haja confirmação de solicitação;
- registrar quem confirmou a solicitação e quando;
- preservar o histórico mesmo depois de alta ou conclusão.

## Perfis e autorização

O perfil lógico `telemedicina` é exibido como **Técnico em Telemedicina**.

Acesso ao módulo:

- `admin` — Desenvolvedor;
- `telemedicina` — Técnico em Telemedicina.

A Coordenação não pode criar, editar, redefinir senha nem converter uma conta de Telemedicina. Somente o Desenvolvedor concede ou remove esse perfil.

### Implementação da identidade técnica

Para preservar a compatibilidade com a autenticação já consolidada, o registro principal da conta no D1 utiliza internamente o papel-base `recepcao`. Uma tabela lateral `auth_telemedicine_access` marca a capacidade exclusiva de Telemedicina.

`worker/auth-management-flex.js` converte essa combinação em `role: telemedicina` nas respostas e validações do portal. Assim:

- a interface enxerga um perfil independente;
- módulos que usam a camada flex não tratam o técnico como Recepção;
- a Coordenação não recebe a conta na sua lista de subordinados;
- o mecanismo de sessão existente não precisa ser reescrito.

Essa é uma decisão arquitetural deliberada e não deve ser removida sem revisar autenticação, sessões e todos os módulos profissionais.

## Armazenamento

Dados de pacientes não são armazenados em arquivos estáticos do site nem no repositório.

O Worker intermedeia o Firestore usando a conta de serviço já configurada. As coleções são:

- `telemedicine_patients`: cadastro agrupador do paciente;
- `telemedicine_followups`: situação atual por paciente + especialidade;
- `telemedicine_events`: histórico imutável/longitudinal de consultas, programações e solicitações.

O D1 continua responsável pela autenticação e pela tabela de autorização do perfil de Telemedicina.

## Identificação do paciente

O sistema não usa o nome como chave direta de URL. É gerado um identificador técnico derivado da forma normalizada do nome.

Na migração inicial, nomes equivalentes após normalização são agrupados. Grafias incompletas ou duvidosas não devem ser fundidas automaticamente com outro cadastro; ficam sinalizadas para revisão.

O CNS não integra este fluxo e não é importado pelo módulo.

## Estados operacionais

- `SEM PROGRAMAÇÃO`: há indicação de acompanhamento, porém não existe data-alvo confiável.
- `EM AGUARDO`: existe data-alvo e a primeira data de aviso ainda não chegou.
- `SOLICITAR`: o dia atual está dentro dos três dias úteis de aviso.
- `ATRASADO`: os três dias úteis passaram sem confirmação de solicitação.
- `SOLICITADO`: a nova solicitação foi confirmada no sistema, inclusive quando esse estado veio do histórico migrado.
- `CONCLUÍDO`: acompanhamento encerrado, alta, tratamento finalizado ou condição equivalente.

Uma tarefa atrasada nunca desaparece por causa da passagem do tempo.

## Cálculo dos lembretes

Quando existe retorno calculável:

1. calcular a data nominal do retorno a partir da última teleconsulta e do prazo informado, ou usar a data-alvo explicitamente registrada;
2. se a própria data de retorno cair em sábado ou domingo, avançá-la para o próximo dia útil;
3. subtrair 15 dias corridos dessa data-alvo já ajustada;
4. se a data do primeiro aviso cair em sábado ou domingo, avançar para a próxima segunda-feira;
5. usar essa data como primeiro aviso e gerar mais dois avisos nos dois dias úteis seguintes.

Exemplo histórico reproduzido pelo módulo:

- teleconsulta: 14/08/2026;
- retorno em 30 dias: data nominal 13/09/2026, domingo;
- retorno-alvo ajustado: 14/09/2026, segunda-feira;
- 15 dias antes: 30/08/2026, domingo;
- avisos: 31/08, 01/09 e 02/09.

Outro caso simples:

- teleconsulta: 01/08/2026;
- retorno em 30 dias: 31/08/2026, segunda-feira;
- 15 dias antes: 16/08/2026, domingo;
- avisos: 17/08, 18/08 e 19/08.

A regra atual trata sábado e domingo. Feriados municipais, estaduais e nacionais ainda não são consultados por calendário próprio do módulo; quando essa camada for adicionada, a regra deve preservar a intenção de três dias úteis reais e do retorno estimado em dia útil.

## Regras de interpretação

A automação histórica é conservadora.

Pode calcular automaticamente:

- `RETORNO COM 30 DIAS`;
- `RET 60 DIAS`;
- outras expressões com quantidade explícita de dias.

Não deve inventar data para textos vagos ou condicionais, por exemplo:

- `RETORNO EM 3 MESES` na migração histórica, quando a convenção exata não estiver formalizada;
- `RETORNO APÓS EXAMES`;
- `RETORNO APÓS FISIO`;
- `RETORNO APÓS RESSONÂNCIA`.

Esses casos ficam em `SEM PROGRAMAÇÃO` ou sinalizados para revisão até que a técnica informe uma data-alvo.

Alta, conclusão e tratamento finalizado prevalecem sobre comentários históricos de solicitação para definir se ainda existe acompanhamento ativo.

## Histórico do Google Docs

A migração inicial foi preparada fora do repositório e contém somente os campos necessários ao módulo. O CNS foi descartado.

O importador é exclusivo do Desenvolvedor e recebe lotes pelo endpoint autenticado `/api/telemedicina/import`.

A importação é idempotente: cada linha histórica recebe uma chave técnica determinística; reenviar o mesmo arquivo não cria novamente o mesmo evento.

O arquivo privado de migração nunca deve ser commitado no GitHub, anexado a uma página estática ou exposto em logs.

## Notificações

A fonte de verdade é sempre o painel interno: `SOLICITAR` e `ATRASADO` permanecem visíveis independentemente de uma notificação ter sido exibida.

A V1 também usa a Web Notifications API quando o usuário autoriza e está com o portal aberto. Isso é um reforço visual do aviso do dia, não uma garantia de push quando navegador/dispositivo estiver fechado.

Para notificações verdadeiramente em segundo plano será necessária uma etapa posterior com Web Push/FCM, assinatura do navegador e serviço de envio. Essa capacidade não deve ser simulada com timers locais não confiáveis.

## Experiência mobile

A Telemedicina deve ser operável prioritariamente por toque no celular, sem modificar a composição desktop quando a solicitação for apenas de harmonização mobile.

Decisão de interface registrada em 01/09/2026:

- até 860 px, o cabeçalho e o hero ficam compactos e o texto introdutório longo deixa de ocupar a primeira dobra;
- o resumo operacional permanece em grade 2 × 2 e cada card continua filtrando a lista;
- busca e filtro ficam concentrados no topo do bloco de trabalho;
- `Registrar consulta` vira uma ação flutuante `+ Consulta`, sempre acessível durante a rolagem;
- cada acompanhamento deixa de usar aparência de tabela comprimida e passa a ser um card vertical, com nome, conduta, especialidade, status, retorno e ações em blocos separados;
- `SOLICITAR` e `ATRASADO` mantêm destaque visual, e a ação primária de confirmar `Solicitado` recebe prioridade no card;
- a data-alvo e os três avisos voltam a ficar visíveis no card mobile quando existirem;
- formulários e histórico abrem como painel inferior no celular, com cabeçalho fixo dentro do modal;
- áreas de toque devem permanecer confortáveis e o conteúdo não pode ser truncado por colunas de desktop;
- regras mobile ficam restritas ao breakpoint responsivo do módulo e não devem alterar o desktop.

## Privacidade e logs

- não enviar pacientes ou dados clínicos para a IA do Guia Médico;
- não registrar nomes de pacientes em logs técnicos do Worker;
- não colocar nomes em URLs;
- não versionar o arquivo de migração;
- manter `Cache-Control: no-store` nas respostas da API;
- acesso ao Firestore sempre intermediado pelo Worker;
- dados de Telemedicina são dados pessoais sensíveis de saúde e devem permanecer no backend autenticado.

## Arquivos principais

Frontend:

- `telemedicina/index.html`
- `css/telemedicina.css`
- `js/telemedicina.js`
- `js/telemedicina-business-day.js`

Backend:

- `worker/telemedicine.js`
- `worker/telemedicine-rules.js`
- `worker/telemedicine-access.js`
- `worker/auth-management-flex.js`

Validação:

- `worker/tests/telemedicine-rules.test.mjs`
- `.github/workflows/validate-telemedicine.yml`
