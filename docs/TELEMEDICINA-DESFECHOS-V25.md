# Telemedicina - Desfechos e condição já realizada V25

Decisão permanente registrada em 08/09/2026.

## Objetivo

Ampliar o formulário **Registrar teleconsulta** para representar corretamente situações que encerram o acompanhamento por Telemedicina e situações em que uma condição para retorno já foi cumprida.

A V25 complementa a V24 de falta sem alterar as regras já consolidadas de alta, retorno por prazo/data e falta.

## Novos desfechos sem alerta

### Desistiu

- registra que o paciente desistiu do tratamento/acompanhamento;
- não cria retorno, aviso, lembrete ou pendência;
- encerra o acompanhamento ativo daquela especialidade;
- mantém o evento no histórico longitudinal com a conduta canônica **PACIENTE DESISTIU DO TRATAMENTO**.

### Encaminhado para presencial

- registra que o tratamento não pôde ser concluído por Telemedicina e houve encaminhamento para atendimento presencial;
- não cria retorno, aviso, lembrete ou pendência;
- encerra o acompanhamento ativo daquela especialidade;
- mantém o evento no histórico longitudinal com a conduta canônica **ENCAMINHADO PARA ATENDIMENTO PRESENCIAL**.

Esses desfechos são históricos. Eles não entram em **Solicitar agora**, **Atrasados**, **Em aguardo** ou **Sem programação**.

## Retorno após uma condição

O campo de texto **Detalhe da condição** deixa de ser apresentado ao operador. Permanecem as condições estruturadas já existentes:

- Exames;
- Fisioterapia;
- Procedimento ou cirurgia;
- Conclusão do tratamento.

Ao lado da seleção passa a existir o botão **Já realizado**.

### Quando Já realizado estiver desligado

O comportamento permanece o mesmo: o retorno condicional não possui data artificial nem lembretes e fica em **SEM PROGRAMAÇÃO** até que a condição seja concluída.

### Quando Já realizado estiver ligado

- a conduta recebe o marcador canônico **JÁ REALIZADO**;
- não é criada data-alvo artificial;
- não são criados os três lembretes de retorno;
- o Worker deriva o status **SOLICITAR** diretamente dessa condição concluída;
- o registro passa a ser contado e exibido junto de **Solicitar agora**;
- depois da confirmação **Solicitado**, `requestedAt` continua tendo precedência e o status passa normalmente para **SOLICITADO**.

O indicador **Solicitar agora** passa, portanto, a agregar três origens operacionais:

1. retornos que entraram na janela normal de solicitação;
2. faltas que precisam ser solicitadas novamente;
3. retornos condicionais cuja condição já foi realizada.

## Interface

No desktop e no formulário inline mobile, o conjunto de resultados passa a admitir:

- Alta do episódio;
- Retorno com prazo ou data;
- Retorno após uma condição;
- Falta;
- Desistiu;
- Encaminhado para presencial.

Todos os ícones são SVG profissionais. Não são usados emojis.

O botão **Já realizado** é um controle binário com `aria-pressed`, texto explícito e estado visual. A informação não depende somente de cor.

## Compatibilidade técnica

A camada V25 é carregada antes do módulo principal de Telemedicina para adaptar de forma controlada os novos resultados ao contrato existente da API sem duplicar regras assistenciais.

A regra persistente do Worker reconhece `RETORNO APÓS ... - JÁ REALIZADO` como uma pendência imediata de solicitação. A precedência de `requestedAt` continua preservada.

As expressões de desistência e encaminhamento presencial também são reconhecidas como encerramento na leitura de registros históricos.

## Movimento

A V25 preserva a decisão anterior de manter `/telemedicina/` sem animações, transições ou deslocamentos decorativos. Os novos controles não introduzem movimento.

## Segurança e privacidade

- nenhuma autorização é ampliada;
- o mesmo endpoint autenticado da Telemedicina continua sendo usado;
- nenhuma informação de paciente é adicionada ao repositório;
- os eventos são armazenados somente nos serviços protegidos já usados pelo módulo.

## Arquivos principais

- `telemedicina/index.html`
- `js/telemedicina-absence-v24.js` - camada V24 ampliada para os desfechos V25;
- `css/telemedicina-absence-v24.css`;
- `worker/telemedicine-rules.js`;
- `worker/tests/telemedicine-outcomes-v25.test.mjs`;
- `.github/workflows/validate-telemedicine-outcomes-v25.yml`.

## Critérios de regressão

1. Falta continua exigindo justificativa e entrando em `SOLICITAR`.
2. Alta continua encerrando sem retorno.
3. Desistiu e Encaminhado para presencial ficam somente no histórico e sem alertas.
4. Retorno condicional não realizado continua em `SEM PROGRAMAÇÃO`.
5. Retorno condicional marcado **Já realizado** entra em `SOLICITAR` sem data ou lembretes artificiais.
6. Confirmar **Solicitado** continua levando a `SOLICITADO`.
7. Desktop e mobile exibem os novos resultados.
8. O campo de texto Detalhe da condição não fica disponível ao operador.
9. A rota continua sem animações.
10. Nenhum dado sensível é versionado.
