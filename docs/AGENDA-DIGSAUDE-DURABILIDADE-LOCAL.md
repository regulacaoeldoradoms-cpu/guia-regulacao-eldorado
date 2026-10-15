# Contatos duráveis da Agenda — candidata local

Atualizado em 15/10/2026. Base `d6e4c3497d22b219d2c891afff1ba2d33146d763` (merge #657), branch `fix/agenda-durable-patient-contacts`, worktree `/workspace/agenda-durable-contacts`. Revisão sobre a primeira candidata local `c95c620e`. Somente código/testes locais; sem push, PR, publicação ou migração de produção. Checkout original e tutorial/PR658 preservados.

## Diagnóstico e revisão

O telefone já era persistido no Firestore privado, embutido na consulta (`sourceId`). A prova v2 associa contato à consulta/paciente/data da solicitação e tem validade de 24h. Vazio/falha revogavam o valor; IDs conhecidos eram somente consultas ativas. Isso provocava perda e recoleta. O cache do userscript era só de memória; os commits não conferiam a versão lida.

A revisão corrige a indisponibilidade global introduzida em `c95c620e`: **contatos antigos válidos continuam disponíveis na consulta original, sem mapeamento global**. A coleta de desconhecidos também continua por consulta quando não há chave técnica de paciente. Nome só participa da verificação da mesma consulta; nunca é chave para unir pacientes entre consultas.

A investigação do histórico/fixtures comprova o ID da consulta, mas não a origem de um ID estável do paciente. O protótipo `/pacientes/{id}` é hipótese e fica desativado (`PATIENT_ID_CONTRACT = ''`). [Evidências por arquivo/commit, escopo organizacional e menor intervenção pendente](AGENDA-DIGSAUDE-IDENTIDADE-EVIDENCIAS.md).

## Comportamento candidato

- Reutiliza Firestore/gateway/autorização atuais. Legados mantêm os caminhos existentes e a prova v2, inclusive validade de 24h. Snapshot vazio/parcial, ausência da lista ou falha não apagam o contato; valor/prova da mesma associação são conservados sem renovar validade. Prova ausente/divergente ou expirada não libera destino.
- O diretório preparado usa organização definida no servidor e ID técnico explícito de paciente em `telemedicine_digsaude_agenda_organizations/{hash-organizacao}/contacts/{hash-paciente}`. Nenhuma chave é criada por nome, telefone ou consulta. `AGENDA_ORGANIZATION_ID` é apenas configuração da implantação; o padrão institucional `eldorado-ms` preserva caminhos legados. Payload/query/postMessage não escolhem escopo. Nenhuma configuração foi aplicada.
- Quando houver vínculo técnico confirmado, captura v2 exige a mesma consulta e `contactPatientSourceId` igual ao `patientSourceId`. O diretório não expira em 24h nem é copiado para o snapshot. Insere apenas ausentes com precondição de inexistência; valores salvos, correções e marcadores de exclusão não são substituídos pela coleta. Falha do snapshot depois de salvar o contato não descarta a captura.
- `POST /api/agenda/contact-state` confirma os conhecidos do snapshot atual antes de visitar fichas. Legado válido da mesma consulta continua conhecido, mesmo com um ID técnico apenas proposto; não é promovido por isso. Ponte devolve só contagens/IDs de consultas conhecidas ou bloqueadas. Consulta em lote limita-se às chaves necessárias, 250 por chamada; resposta incompleta falha. O coletor compartilha uma captura somente quando há chave técnica explícita igual.
- `POST /api/agenda/contact` permite correção/exclusão explícitas do diretório sob a mesma autorização Agenda e CAS por revisão/`updateTime`; vazio é inválido e conflito retorna 409. Exclusão remove o número e conserva marcador mínimo. Uma consulta já vinculada não pode perder o ID e voltar ao modo legado para restaurar contato (`contactIdentityRequired`). Mudanças do diretório não são propagadas a legados independentes por nome. Não há nova UI de correção nesta candidata.
- O clique de WhatsApp revalida a mesma ficha/contato, ID e revisão antes de abrir destino. A interface distingue remoção/perda de associação; um legado ainda desconhecido mantém a indicação normal de sincronização. Telefones não entram em log, telemetria, armazenamento do navegador ou resposta da ponte. Hashes/marcadores continuam dados protegidos, não anonimização.

CAS segue [Precondition](https://firebase.google.com/docs/firestore/reference/rest/v1/Precondition); a leitura limitada usa [documents.batchGet](https://firebase.google.com/docs/firestore/reference/rest/v1/projects.databases.documents/batchGet), conferindo `found`/`missing` por nome, sem depender da ordem. Chamadas anteriores do gateway sem precondição/metadados mantêm seu comportamento.

## Intervenção e transição

Para manter o funcionamento existente, não é necessário cadastrar organização, alterar permissões ou mapear todos os contatos. Auth/capacidade, origens, `AUTH_DB`, binding de projeto Firestore, regras e caminhos legados permanecem como na implantação institucional única. A verificação foi de código/configuração, sem leitura de produção.

Somente o reuso automático entre consultas diferentes depende de comprovar a fonte do ID do paciente: contrato oficial ou projeção estrutural sanitizada com duas consultas do mesmo paciente e um controle de outro, usando tokens sintéticos consistentes. Depois, habilitar um adaptador e sua fixture. Não se exige varredura de pacientes, novo login, credencial ou permissão. A conversão dos legados pode ser progressiva e individual; backfill global é opcional e não foi preparado/executado.

O contrato de entrega da candidata é `contactCapability: patient-directory-v1`, com proveniência de captura `patient-details-v2`. Coletor **1.2.9**, cache `20261015-directory-1`. Uma entrega futura precisa atualizar/reabrir Worker, frontend, ponte e coletor de forma coordenada; diferença de capacidade pausa o uso. Gates/rollback de deploy não mudaram. Firestore é aditivo, sem DDL/D1 ou alteração de bindings/regras/credenciais. Nenhuma operação produtiva ocorreu. Exclusão integral de cópias legadas/backups exige procedimento próprio com suas identidades confirmadas; não há propagação por nomes.

Limites: persistência/concorrência verificadas com adaptador em memória, serialização/restauração e scripts reais; sem autenticação/Firestore/navegador clínico reais. Consultas/recibos mantêm o limite anterior de 20×100 documentos, agora falhando se incompletos. O diretório lê apenas chaves necessárias. A ordenação temporal global dos snapshots permanece a do módulo; snapshots não sobrescrevem contatos do diretório. O TTL legado não foi removido por inferência.

## Evidências verificadas

A candidata `c95c620e` tinha **153 testes sintéticos aprovados**. Nesta revisão passaram **17 testes da suíte de durabilidade e 10 regressões afetadas** de Agenda/contrato. Incluem recarga/sessões, snapshots, original v2 disponível sem mapeamento, validade/associação, desconhecidos, concorrência, correção/exclusão, perda de ID, ausência de associação por nomes e adaptador hipotético desativado. As expectativas da primeira candidata de esconder todos os legados foram substituídas pela compatibilidade do vínculo original.

Sintaxe dos três JS alterados, importação do módulo, diff e referências documentais aprovados. Evidência dos demais caminhos em `c95c620e` foi reaproveitada; não se repetiram suites gerais, gateway, recuperação Firebase, capacidade/navegação ou tutorial inalterados. [Detalhes da revisão](AGENDA-DIGSAUDE-IDENTIDADE-EVIDENCIAS.md).

Próxima ação: revisar a candidata local; obter apenas o contrato estrutural do ID se for habilitar reuso entre consultas. Sem push, PR, merge, publicação ou migração autorizados nesta tarefa. `AGENTS.md` e o checkpoint foram lidos; o checkpoint bancário não foi alterado.
