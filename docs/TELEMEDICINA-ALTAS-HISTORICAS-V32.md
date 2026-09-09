# Telemedicina — reconhecimento de altas históricas V32

Decisão permanente registrada em 09/09/2026.

## Origem da correção

A conferência do relatório unificado privado de Telemedicina mostrou que a migração histórica possui uma convenção anterior ao formulário atual do Portal:

- pacientes que receberam alta foram marcados no documento de origem por uma reação/comentário com o emoji de troféu `🏆`;
- muitos desses registros usam apenas `SIM` na coluna de resolutividade/observação, em vez da expressão literal `ALTA DO EPISÓDIO`;
- alguns registros antigos trazem `SIMM`, erro de digitação histórico equivalente a `SIM`;
- registros mais recentes também podem trazer explicitamente `ALTA DO EPISÓDIO` ou tratamento finalizado.

O arquivo privado não deve ser versionado no GitHub e nenhum nome, CNS ou outro dado de paciente é registrado nesta documentação.

## Resultado da auditoria

Na fonte privada conferida foram identificados **42 registros de alta** pelos sinais históricos combinados:

- 38 registros possuem marca de troféu;
- 9 registros possuem a palavra `ALTA` na resolutividade, sendo parte deles também marcada com troféu;
- 25 registros possuem resolutividade exatamente `SIM` ou `SIMM`, sendo parte deles também marcada com troféu;
- a união sem duplicidade desses sinais resulta em 42 altas históricas.

O painel mostrava apenas 11 porque o reconhecimento visual e o filtro de altas estavam concentrados principalmente na palavra `ALTA`, deixando invisíveis registros históricos cuja resolutividade era somente `SIM`/`SIMM` ou cuja confirmação de alta estava no comentário com troféu.

## Regra V32

A partir da V32, `isDischargeAchievement()` reconhece como alta:

1. registros atuais com `discharged: true`;
2. registros atuais com `followupMode: discharge`;
3. qualquer registro cuja resolutividade contenha a palavra isolada `ALTA`;
4. registros de origem `legacy` cujo campo de observação preservado contenha o troféu `🏆`;
5. registros de origem `legacy` cuja resolutividade normalizada seja exatamente `SIM` ou `SIMM`.

A regra de `SIM` é deliberadamente restrita a valor exato. Expressões históricas como `SIM, RETORNO APÓS EXAMES`, `SIM, ENCAMINHADO PARA PRESENCIAL`, `SIM, ENCAMINHADO PARA CIRURGIA` ou outras combinações não são convertidas automaticamente em alta apenas pela palavra `SIM`; nesses casos é necessário haver o marcador histórico de troféu ou outra evidência explícita de alta.

## Comportamento do painel

- uma alta histórica reconhecida fica com estado operacional `CONCLUÍDO`, mesmo que algum campo legado esteja inconsistente como `active: true`;
- o dashboard continua ocultando encerramentos que não sejam alta;
- todo item `CONCLUÍDO` que chega à lista principal é tratado visualmente como **Alta**, com o mesmo card dourado já definido;
- a fila **Altas** passa a refletir também os registros históricos reconhecidos pela nova convenção;
- nenhum lembrete, retorno ou pendência é criado para uma alta.

## Segurança e privacidade

- nenhum dado de paciente foi adicionado ao repositório;
- a correção atua sobre os registros privados já existentes no Firestore;
- o documento-fonte e qualquer arquivo de migração continuam privados;
- a regra adicional é limitada a registros `legacy`, evitando que texto livre de uma consulta nova transforme uma situação atual em alta por engano.

## Critérios de regressão

1. `ALTA DO EPISÓDIO` continua sendo alta.
2. `legacy + SIM` é alta.
3. `legacy + SIMM` é alta.
4. `legacy + comentário contendo 🏆` é alta mesmo sem a palavra `ALTA`.
5. `manual + SIM` não é convertido automaticamente em alta.
6. `legacy + SIM, RETORNO APÓS EXAMES` sem troféu não é alta.
7. uma alta reconhecida pelo troféu prevalece sobre um `active: true` legado e fica `CONCLUÍDO`.
8. desistência e encaminhamento presencial sem marcador de alta continuam fora da fila **Altas**.
9. nenhum identificador de paciente é versionado.
