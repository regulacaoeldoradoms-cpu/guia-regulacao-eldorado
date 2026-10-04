# Ordem local — Português comum antes de Institucional CAIXA

04/10/2026. Autorização encaminhada pelo pai: após proposta explícita de colocar Português antes do bloco específico CAIXA mantendo motor linear, usuário respondeu “Autorizo tudo, do português também”. Esta evidência autoriza o ajuste proposto de ordem, não ativação dos novos candidatos. Sem push/merge/deploy/D1 ou alteração da Central.

| Lote | Ordens anteriores | Ordens locais | ReleaseSequence local |
| --- | --- | --- | --- |
| DP |51–64|51–64|5 inalterada|
| LP |75–79|65–69|6|
| PT |80–85|70–75|7|
| OA |86–91|76–81|8|
| OL |92–96|82–86|9|
| HF |97–101|87–91|10|
| CF |102–106|92–96|11|
| IS CAIXA |65–74|97–106|12|

Entrada LP agora depende de ChefeDP; entrada IS de ChefeCF, último Português comum preparado. Demais entradas seguem Chefe anterior e todas as unidades a conclusão anterior. worker/studies.js não foi alterado: continua exigindo a missão anterior no catálogo publicado ordenado. Não introduz motor por perfil nem transforma metadado de pré-requisito em autorização. Português continua associado aos dois perfis históricos; Institucional somente CAIXA. Acrescentar novos recortes comuns antes de IS na preparação futura, sem publicar por esta autorização.

Ajustados sete geradores/artefatos e fixtures/testes correspondentes. Releases dos drafts alinhadas de6a12 para não colocar IS posterior numa sequência de publicação anterior à de Português. releaseIds,IDs,textos,perguntas,gabaritos,justificativas,recuperação,XP,passScore,contentVersion,fontes e parâmetros não aprovados preservados; só ordem/pré-requisito de entrada/releaseSequence mudaram. Comparação serializada dos sete lotes contra snapshot anterior confirmou esse limite. Catálogo,fontes,planejamento,mapa e curriculumSnapshot ativos idênticos ao HEAD anterior:50/374/quatro blocos,prontidão não medida.

Verificações afetadas:28 testes de sete candidatos aprovados (draft,artefato,sequência e seis cenários de roteador por lote =42cenários). LP simula publicação comum sem IS e pode iniciar após DP; IS exige CF concluído. Preserva study_*,XP,tentativas,conquista,revisões,A/B e sessão interrompida. Três regressões novas de cadeia/releases,perfis/exclusão passaram. Chromium: seis CF em9,7s e seis casos selecionados LP/IS em10,0s (retomadas320claro/390escuro e questão respondida sem nova sessão). Navegador PT/OA/OL/HF reutilizado nos fluxos inalterados; fixtures atualizadas mecanicamente para contagens e ausência de IS antes do comum. Sem repetir suíte inteira ou auditoria normativa/pedagógica.

Limites de liberação: ordem somente local; #602 conserva head remoto dbc272e9/24Actions aprovadas na árvore anterior. Reconciliação local com main220f3098 e PTdbc272e9 concluída em108; será necessário salvar o diff e cumprir CI obrigatória no commit de integração antes de ativar qualquer pacote. HF/CF não estão no PR. Main220f3098/#601 e Worker56204b57-9d96-49f5-8b78-921a8969e1cd/33checks foram informados pelo pai como publicados/verificados; este executor não os publicou nem revalidou produção. Usar essa base futura, que já inclui contratos#598/Home, sem reaplicar patches Central ou investigar preview. Aceite humano pedagógico fase2 não observado.

A origem de autoria4bea4009 foi preservada como ancestral. A correção PT validada emdbc272e9 foi reaproveitada por merge local, conservando ordem70–75 e artefato gerado. Não ampliar exceções do detector.
