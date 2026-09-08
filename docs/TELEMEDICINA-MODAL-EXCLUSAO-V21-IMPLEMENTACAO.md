# Implementação V21 — resumo técnico

A camada `telemedicina-modal-delete-v21` é carregada somente em `/telemedicina/`.

A ordem dos scripts é proposital: `telemedicina-modal-delete-v21.js` é carregado depois do cliente de autenticação e antes de `portal-interactions.js`. Assim, a guarda em fase de captura pode interromper eventos destinados ao conteúdo de fundo antes que a linguagem global de interações produza animação ou som nesses elementos.

O botão de exclusão é acrescentado aos cards existentes e aos cards renderizados posteriormente. Ele não usa `data-action`, evitando conflito com a interceptação mobile V9.

A API de exclusão não apaga fisicamente documentos do Firestore. Ela desativa o acompanhamento e registra autoria/data da exclusão. O dashboard já ignora acompanhamentos inativos; o histórico de situação atual ignora especificamente os marcados com `deletedAt`, sem esconder acompanhamentos concluídos por alta.
