# Critérios de teste — Telemedicina V21

## Modalidade

1. Abrir `Registrar consulta` no desktop.
2. Clicar sucessivamente em paciente, data, especialidade, opções de conduta, prazo, data-alvo e observação.
3. Confirmar que não ocorre interação, foco ou acionamento visual em cards, filtros, cabeçalho ou botões atrás da janela.
4. Confirmar que Tab e Shift+Tab permanecem dentro da janela.
5. Confirmar que clique no backdrop apenas fecha a janela, sem acionar o elemento localizado abaixo dele.
6. Confirmar ausência da piscada de composição ao alternar o foco entre campos nativos.

## Exclusão

1. Confirmar botão vermelho `Excluir` com ícone vetorial de lixeira em todos os cards ativos.
2. Abrir a confirmação e cancelar; o card deve permanecer inalterado.
3. Confirmar a exclusão; o Worker deve responder com sucesso, o card deve desaparecer e o dashboard recarregado não deve trazê-lo novamente.
4. Abrir o histórico do mesmo paciente por outro acompanhamento: o acompanhamento excluído não deve constar como situação atual, mas os eventos históricos anteriores devem continuar disponíveis.
5. Registrar nova teleconsulta para o mesmo paciente e especialidade: o acompanhamento pode voltar a existir e os campos `deletedAt`/`deletedBy` são limpos pelo novo registro.
6. Repetir em desktop e mobile, preservando a experiência inline já existente no mobile.

Os testes não devem usar dados reais em artefatos, logs ou arquivos do repositório.
