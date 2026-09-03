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
- O formulário sanfonado possui implementação própria em `js/telemedicina-mobile-v9.js`; toda mudança funcional no formulário desktop correspondente deve ser reproduzida e validada nele enquanto essa duplicação existir.
- A data é exibida como **Data da última consulta** e a resolutividade usa três cartões exclusivos: **Alta do episódio**, **Retorno com prazo ou data** e **Retorno após uma condição**.
- Os cartões usam ícones e cores semânticas — verde, azul e âmbar — e revelam apenas os campos aplicáveis à escolha.
- Ao selecionar alta, prazo, data-alvo, condição, observação e prévia desaparecem imediatamente; o painel envia `followupMode: discharge`, encerra o retorno e aciona a mesma celebração visual da versão desktop.
- No retorno condicionado, o painel oferece exames, fisioterapia, procedimento/cirurgia, conclusão do tratamento e outra condição; não calcula data nem lembretes.
- O arquivo mobile não pode reintroduzir os campos antigos de texto livre de resolutividade ou de marcação “Necessita acompanhamento/retorno”.

## Legibilidade móvel e cabeçalho V15

Decisão permanente registrada em 03/09/2026:

- a barra azul superior permanece em uma única linha horizontal no celular;
- o cabeçalho usa 82 px de altura e praticamente toda a largura disponível, sem voltar à composição comprimida de 58 px;
- a ordem horizontal é **Telemedicina**, **Início**, foto com nome/cargo do usuário e **Sair**;
- o nome permanece visível ao lado da foto e pode ocupar até duas linhas dentro do bloco da conta;
- em telas de até 380 px, somente o cargo pode ser ocultado para preservar o nome e os comandos na mesma linha;
- indicadores, busca, filtros, formulário, opções de conduta e cartões de pacientes usam uma escala tipográfica ampliada, com controles próximos de 16 px e textos operacionais secundários próximos de 14 px;
- o modo Grade 2×2 continua disponível e seus cartões usam altura mínima de 350 px para acomodar o texto maior sem cortes;
- todas essas regras ficam isoladas em `css/telemedicina-mobile-v15.css` e não alteram o desktop.

## Concorrência de trabalho

A V9 prioriza o fluxo operacional em sequência rápida. Requisições de salvamento são independentes no navegador: uma chamada ainda pendente não cria overlay, modal global ou bloqueio de interação nos demais cards.

O backend e as regras de negócio não mudam. A V9 reutiliza as APIs autenticadas já existentes e continua dependendo da validação do Worker.

## Privacidade e escopo

- Nenhum dado de paciente é versionado por esta alteração.
- Nenhuma informação clínica é enviada para a IA.
- A mudança é exclusivamente de experiência mobile e não altera permissões, Firestore, estados operacionais, cálculo de lembretes ou autenticação.
- Os modais permanecem no HTML para o desktop e para compatibilidade; no contexto mobile V9, as ações diárias são interceptadas antes de abrir essas janelas.
