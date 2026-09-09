# Telemedicina — salvamento atômico e fila de Altas V29/V30/V31

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

## Altas como fila própria

O botão administrativo **Unificar especialidades** deixa de ocupar espaço na barra da Telemedicina. A manutenção técnica continua preservada no código para compatibilidade e auditoria, mas não fica mais exposta como ação operacional cotidiana.

No mesmo espaço passa a existir o botão **Altas**. O nome foi escolhido em vez de “Concluídos” porque o destaque dourado representa especificamente **alta do episódio**. Outros encerramentos possíveis não devem receber automaticamente a mesma semântica visual.

O botão **Altas** funciona como atalho de fila:

- primeiro toque/clique: mostra somente os cards com status `CONCLUÍDO` que permanecem visíveis por alta;
- segundo toque/clique: volta para todas as situações;
- ao entrar na fila de Altas, uma busca textual antiga é limpa para que a fila não pareça vazia ou sem resposta por causa de um filtro residual;
- o filtro **Altas** continua disponível na lista de situações;
- o card de alta continua amarelo/dourado, com coroa e histórico acessível;
- a alta não cria retorno, lembrete ou pendência operacional.

## Correção V30 — interação

A V29 tinha um manipulador próprio do botão `Altas`. Na prática, isso deixava a ação dependente de uma camada separada das rotinas de filtro já usadas pelo desktop e pelo mobile. Na V30 o botão passa a declarar `data-status-filter="CONCLUÍDO"` e fica integrado ao mesmo contrato de filtragem já utilizado pelos demais atalhos da Telemedicina.

Para manter o comportamento de alternância no segundo clique e evitar conflitos entre os manipuladores desktop/mobile, a V30 captura especificamente o clique de `#dischargeQueue`, aplica o filtro, dispara o evento `change` do seletor e encerra a propagação do clique original. Assim, a renderização continua sendo feita pelas rotinas já existentes de cada contexto.

## Correção V31 — nomenclatura e visual dourado

Na V31, a palavra **“conquista” deixa de ser nomenclatura de interface**. Ela havia sido usada apenas como referência conceitual durante o desenvolvimento. Para o usuário, a área passa a usar somente **Alta/Altas**.

A V31 também corrige um erro de sintaxe no início de `css/telemedicina-altas-v30.css`: o arquivo continha a diretiva JavaScript `'use strict';`, inválida em CSS. Essa diretiva fazia o navegador descartar justamente a primeira regra do arquivo, que definia o fundo dourado permanente, o posicionamento e o recorte necessários para o reflexo. Por isso o botão podia aparecer branco em repouso, dourar apenas no `hover` e não exibir corretamente a animação.

Com a correção:

- o botão fica **dourado permanentemente**, inclusive sem mouse sobre ele;
- o acabamento usa gradiente dourado e contraste suficiente para o texto;
- o reflexo luminoso atravessa o botão periodicamente;
- o estado ativo recebe contorno adicional, sem deixar de ser dourado;
- `prefers-reduced-motion` continua respeitado;
- dimensões e posição da barra permanecem inalteradas;
- os textos visíveis passam a usar apenas **Alta**, **Altas**, **Desfecho** e **Alta registrada**.

## Desktop e mobile

A fila **Altas** usa a mesma barra e o mesmo filtro em desktop e mobile. No mobile, a camada também mantém a alta recém-salva visível de imediato no cache de interface, sem reativar o acompanhamento no Firestore. Após nova leitura do dashboard, a regra persistente da V28 continua responsável por exibir a alta encerrada com destaque dourado.

## Cache e publicação

Como o Portal usa service worker e cache de páginas/ativos, mudanças visuais e de texto devem usar versionamento novo nos arquivos carregados pela página da Telemedicina quando necessário, evitando que CSS ou JavaScript antigos permaneçam em uso após a publicação.

## Arquivos

- `worker/firestore-atomic-v29.js` — commit atômico no Firestore;
- `worker/telemedicine-router-v2.js` — registro atômico de consulta e compatibilidade com as demais rotas;
- `js/telemedicina-altas-v30.js` — comportamento confiável da fila de Altas e continuidade visual após o salvamento mobile;
- `css/telemedicina-altas-v30.css` — acabamento dourado permanente e reflexo do botão;
- `js/telemedicina-discharge-achievement-v28.js` — apresentação textual dos cards de alta;
- `telemedicina/index.html` — integração do botão ao filtro nativo e versionamento dos ativos;
- `worker/tests/firestore-atomic-v29.test.mjs` — contrato do lote atômico;
- `.github/workflows/validate-telemedicine-atomic-v29.yml` — validação do salvamento atômico;
- `.github/workflows/validate-telemedicine-altas-v30.yml` — validação específica da interação e do visual da fila de Altas.

## Limites e segurança

- não gravar dados de paciente no repositório público;
- não expor `FIREBASE_PRIVATE_KEY`, tokens ou outras credenciais no frontend;
- não transformar uma alta em acompanhamento ativo no banco apenas para fazê-la aparecer na tela;
- não aplicar o destaque dourado de alta a desistência, encaminhamento presencial ou outros desfechos sem decisão de produto explícita;
- preservar as regras da V28: alta concluída permanece visível, sem lembretes e sem pendências.
