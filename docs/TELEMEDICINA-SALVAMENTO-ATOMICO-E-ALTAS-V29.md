# Telemedicina — salvamento atômico e fila de Altas V29

## Decisão permanente

O registro manual de uma teleconsulta deve ser tratado como **uma única operação lógica**. O paciente, o evento histórico e o acompanhamento atual não podem ficar parcialmente gravados quando houver falha entre etapas.

A partir da V29, o endpoint `POST /api/telemedicina/consultations` grava os três documentos necessários em **um único commit atômico do Firestore**. O resultado esperado é “tudo ou nada”: ou paciente + evento + acompanhamento são confirmados juntos, ou nenhuma dessas três alterações é aplicada.

## Motivo

O fluxo anterior executava três gravações sequenciais. Uma interrupção depois da primeira ou da segunda gravação podia deixar o histórico e o card em estados diferentes. Isso era especialmente indesejável em altas, porque o evento poderia existir sem que o card concluído aparecesse corretamente no painel.

O salvamento atômico elimina essa classe de falha parcial sem alterar o formulário, os campos clínico-operacionais, as regras de retorno ou as permissões da Telemedicina.

## Implementação

- `worker/firestore-atomic-v29.js` monta e envia um `documents:commit` autenticado pela conta de serviço já configurada no Worker;
- `worker/telemedicine-router-v2.js` intercepta somente a criação de teleconsultas e preserva as mesmas validações, normalizações e respostas do fluxo existente;
- cada commit contém exatamente os documentos de paciente, evento histórico e acompanhamento;
- documentos novos usam precondição de inexistência; documentos já existentes usam precondição de existência e máscara de atualização;
- as credenciais continuam exclusivamente nas variáveis/segredos do Cloudflare Worker e não são publicadas no repositório nem enviadas ao navegador.

A atomicidade protege contra gravações parciais dentro de uma tentativa. Ela não deve ser confundida com idempotência de reenvio depois de uma resposta de rede ambígua; esse é um mecanismo distinto e, se necessário, deve ser tratado separadamente.

## Altas como fila de conquista

O botão administrativo **Unificar especialidades** deixa de ocupar espaço na barra da Telemedicina. A manutenção técnica continua preservada no código para compatibilidade e auditoria, mas não fica mais exposta como ação operacional cotidiana.

No mesmo espaço passa a existir o botão **Altas**. O nome foi escolhido em vez de “Concluídos” porque a conquista dourada representa especificamente **alta do episódio**. Outros encerramentos possíveis não devem receber automaticamente a mesma semântica visual.

O botão **Altas** funciona como atalho de fila:

- primeiro toque/clique: mostra somente os cards com status `CONCLUÍDO` que permanecem visíveis como altas/conquistas;
- segundo toque/clique: volta para todas as situações;
- o filtro “Altas / conquistas” continua disponível na lista de situações;
- o card de alta continua amarelo/dourado, com coroa e histórico acessível;
- a alta não cria retorno, lembrete ou pendência operacional.

## Desktop e mobile

A fila **Altas** usa a mesma barra e o mesmo filtro em desktop e mobile. No mobile, a V29 também mantém a alta recém-salva visível de imediato no cache de interface, sem reativar o acompanhamento no Firestore. Após nova leitura do dashboard, a regra persistente da V28 continua responsável por exibir a alta encerrada como conquista.

## Arquivos

- `worker/firestore-atomic-v29.js` — commit atômico no Firestore;
- `worker/telemedicine-router-v2.js` — registro atômico de consulta e compatibilidade com as demais rotas;
- `js/telemedicina-altas-v29.js` — fila/atalho de Altas e continuidade visual após o salvamento mobile;
- `telemedicina/index.html` — substituição visual do antigo botão de manutenção pelo botão Altas;
- `worker/tests/firestore-atomic-v29.test.mjs` — contrato do lote atômico;
- `.github/workflows/validate-telemedicine-atomic-v29.yml` — validação automatizada da V29.

## Limites e segurança

- não gravar dados de paciente no repositório público;
- não expor `FIREBASE_PRIVATE_KEY`, tokens ou outras credenciais no frontend;
- não transformar uma alta em acompanhamento ativo no banco apenas para fazê-la aparecer na tela;
- não usar a fila Altas para classificar desistência, encaminhamento presencial ou outros desfechos como conquista sem decisão de produto explícita;
- preservar as regras da V28: alta concluída permanece visível, sem lembretes e sem pendências.
