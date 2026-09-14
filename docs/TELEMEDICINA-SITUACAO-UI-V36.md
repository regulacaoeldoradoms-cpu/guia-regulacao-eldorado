# Telemedicina - Situacao UI V36

Decisao permanente registrada em 14/09/2026.

A janela Alterar situacao deve seguir a linguagem visual da janela Registrar teleconsulta.

- mostrar quatro opcoes em cartoes selecionaveis: Alta do episodio, Retorno com prazo ou data, Retorno apos uma condicao e Falta do paciente;
- cada cartao deve ter icone vetorial, cor semantica, titulo e descricao curta;
- mostrar somente os campos compativeis com a opcao escolhida;
- manter a regra operacional e a autorizacao no backend, sem criar estados apenas no frontend;
- manter a situacao anterior no historico;
- a moldura externa do modal fica fixa e somente o corpo interno rola;
- a barra de rolagem deve permanecer visualmente dentro da janela em desktop e mobile;
- preservar navegacao por teclado, rotulos textuais e contraste; a informacao nao depende apenas de cor.


## Ajuste condicional V38

Decisao permanente registrada em 14/09/2026.

Na janela **Alterar situacao**, a opcao **Retorno apos uma condicao** nao deve exibir campo separado **Detalhe da condicao**. O operador escolhe apenas o tipo da condicao e informa qualquer explicacao adicional em **Observacao da correcao**.

O marcador **Condicao ja realizada** permanece como controle operacional. Quando marcado, a resolucao canonica recebe **JA REALIZADO** e o acompanhamento passa a ser derivado pelo Worker como **SOLICITAR**, exibido ao operador como **Solicitar agora**.

Para **Outra condicao**, o frontend envia internamente o valor canonico **OUTRA CONDICAO** apenas para compatibilidade com o contrato existente; esse valor tecnico nao e apresentado como campo livre ao usuario.
