# Telemedicina Mobile V9

## Decisão permanente

No mobile, as ações operacionais diárias da Telemedicina deixam de depender de janelas modais bloqueantes e passam a funcionar como **painéis sanfonados inline**.

A decisão vale para:

- Programar retorno;
- Marcar solicitação como realizada;
- Consultar histórico do paciente;
- Registrar nova teleconsulta.

O desktop preserva o comportamento anterior com modais.

## Regras de interação

- Cada card pode manter seu próprio painel aberto sem fechar os demais.
- Abrir uma ação em um paciente não bloqueia a interação com outros cards.
- Enquanto um card salva em segundo plano, somente o botão de salvamento daquele painel fica temporariamente desabilitado.
- O salvamento de um card não deve executar recarga global da lista nem fechar sanfonas abertas em outros pacientes.
- No modo Grade 2×2, um card com sanfona aberta pode ocupar temporariamente as duas colunas para garantir largura adequada ao formulário; os demais cards permanecem operáveis.
- Dentro do mesmo card, abrir outra ação substitui apenas o painel daquele paciente.
- O painel permanece aberto após sucesso ou erro para que o operador veja o resultado e decida quando recolhê-lo.
- Busca e filtros mobile devem ocultar/exibir os cards existentes sem reconstruir toda a lista, evitando perda de formulários em andamento.
- Nova teleconsulta usa um painel inline no bloco de trabalho; após salvar, o formulário continua disponível para o próximo registro.

## Concorrência de trabalho

A V9 prioriza o fluxo operacional em sequência rápida. Requisições de salvamento são independentes no navegador: uma chamada ainda pendente não cria overlay, modal global ou bloqueio de interação nos demais cards.

O backend e as regras de negócio não mudam. A V9 reutiliza as APIs autenticadas já existentes e continua dependendo da validação do Worker.

## Privacidade e escopo

- Nenhum dado de paciente é versionado por esta alteração.
- Nenhuma informação clínica é enviada para a IA.
- A mudança é exclusivamente de experiência mobile e não altera permissões, Firestore, estados operacionais, cálculo de lembretes ou autenticação.
- Os modais permanecem no HTML para o desktop e para compatibilidade; no contexto mobile V9, as ações diárias são interceptadas antes de abrir essas janelas.
