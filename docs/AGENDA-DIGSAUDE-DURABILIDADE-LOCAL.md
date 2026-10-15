# Contatos duráveis da Agenda — candidata local

Atualizado em 15/10/2026. Base `d6e4c3497d22b219d2c891afff1ba2d33146d763` (merge #657), branch `fix/agenda-durable-patient-contacts`, worktree `/workspace/agenda-durable-contacts`. Somente implementação e testes locais; sem push, PR, publicação ou migração de produção. Checkout original preservado. Nenhum arquivo do tutorial/PR658 foi alterado ou incorporado a esta frente.

## Diagnóstico

O telefone já era persistido no Firestore privado da Agenda, não em D1. A perda de reaproveitamento vinha do modelo: contato embutido na consulta (`sourceId`), associação a nome/data de solicitação, validade de 24h e revogação por tentativa vazia/falha. O estado inicial enviava somente IDs das consultas ativas; não reconhecia uma consulta nova de um paciente já conhecido. O cache do userscript era apenas de memória. Os commits de snapshots não conferiam a versão lida.

Não existe identidade técnica de paciente nem organização nos campos do espelho atual. O módulo de Telemedicina possui uma chave derivada do nome; ela não é prova de identidade para juntar contatos de homônimos. Essa chave não foi reaproveitada.

## Comportamento candidato

- Reutiliza Firestore, gateway e autorização atuais. Contatos ficam em `telemedicine_digsaude_agenda_organizations/{hash-organizacao}/contacts/{hash-paciente}`. A chave usa o ID técnico do recurso de paciente; não usa nome, telefone ou ID da consulta.
- A organização vem do servidor: `AGENDA_ORGANIZATION_ID`, com o escopo fixo deste portal `eldorado-ms` como padrão. Payload, query e postMessage não escolhem organização. Nenhuma configuração foi aplicada. Para Eldorado, consultas e recibos anteriores mantêm seus caminhos; outros escopos usam caminhos próprios para consultas, contatos e recibos. Isso é isolamento por implantação, não multitenancy por usuário no mesmo Worker.
- O adaptador candidato procura um link explícito do recurso `/pacientes/{id}` na célula do paciente, da mesma origem e unidade. Aceita também as terminações `/view` e `/edit`, sem navegar nelas. Ausência, conflito, origem/unidade divergente ou ID inválido não produzem chave. Sem chave, novas capturas não são persistidas; no protocolo completo, a ponte evita essas visitas e informa `identityMissing` somente como contagem. Isso impede contornar exclusão sob outro ID de consulta. **Esse formato ainda não foi homologado no DigSaúde real.**
- Captura vinculada exige `contactVersion: patient-details-v2`, `contactSourceId` da mesma consulta e `contactPatientSourceId` igual ao `patientSourceId`. O contato durável não expira em 24h e não é copiado para o snapshot mutável. Uma nova consulta do mesmo ID reutiliza o diretório, inclusive com nome/data alterados. Contatos não saem da API de listagem em consultas inativas.
- A coleta insere somente ausentes, com precondição de inexistência. Não atualiza um contato já armazenado. Número vazio, falha, snapshot parcial/completo vazio, remoção ou reaparecimento de consulta não excluem o contato. Tentativas concorrentes usam precondições Firestore e repetição limitada; falha do snapshot depois de salvar o contato não descarta a captura.
- `POST /api/agenda/contact-state` consulta os pacientes do snapshot atual antes de visitar fichas. A ponte devolve somente contagens e IDs de consultas conhecidas/bloqueadas, sem nomes, números, IDs de pacientes ou versões do diretório. A leitura em lote é limitada a 250 chaves por chamada; respostas incompletas falham, sem serem tratadas como ausência. Duas consultas do mesmo paciente desconhecido na rodada compartilham uma captura.
- A API protegida `POST /api/agenda/contact` recebe `patientSourceId`, `action: correct|delete`, `expectedRevision` e `phone` somente para correção. Usa a mesma autorização Agenda (admin/capacidade Telemedicina) e CAS por `updateTime`. Correção vazia é inválida; versão desatualizada retorna 409. Exclusão remove o número e mantém marcador mínimo, impedindo restauração por coleta/replay; restauração exige correção explícita sobre a revisão atual. Essa operação não possui nova UI nesta candidata.
- O clique de WhatsApp continua exigindo resposta autenticada atual e mesma ficha/contato; compara também ID técnico e revisão. A interface distingue contato removido e paciente ainda sem identificação, sem prometer sincronização de um contato bloqueado. O telefone não entra em log, telemetria, armazenamento de navegador ou resposta da ponte. Hashes de caminhos e marcadores continuam sendo dados protegidos, não anonimização.

As operações condicionais seguem [Precondition](https://firebase.google.com/docs/firestore/reference/rest/v1/Precondition); a consulta limitada usa [documents.batchGet](https://firebase.google.com/docs/firestore/reference/rest/v1/projects.databases.documents/batchGet), conferindo cada resultado `found`/`missing`, independentemente da ordem. O gateway mantém o comportamento anterior para chamadas sem precondição/metadados.

## Transição e requisitos antes de implantação

1. Homologar uma projeção sanitizada da estrutura que fornece o ID técnico do paciente, incluindo estabilidade entre consultas e escopo da unidade. Se a lista não expuser o link, o adaptador não habilita reaproveitamento entre consultas: será necessário um identificador oficial equivalente, sem inferência por nome/CPF/telefone. Nenhuma inspeção real foi feita nesta tarefa.
2. Conferir o vínculo institucional do namespace legado com Eldorado. O código não oferece seleção de organização pelo cliente. Uma implantação compartilhada por várias organizações precisaria resolver a organização pela sessão no servidor; não deve ser habilitada apenas mudando o valor padrão.
3. Contatos legados sem ID técnico não são promovidos automaticamente. A candidata conserva o valor e a prova originais da mesma associação, inclusive se expirados ou sem prova verificável, mas **a API do contrato novo não os disponibiliza sem vínculo com o diretório**: cópias legadas não podem contornar correções/exclusões do paciente. O validador v2/24h permanece apenas para verificar proveniência legada; o diretório novo não expira por esse prazo. Novas capturas sem ID técnico são ignoradas pelo backend, inclusive no replay de clientes antigos. Uma captura nova com vínculo técnico confirmado faz a transição individual. Para reaproveitar números antigos sem recoleta, é indispensável um mapeamento autorizado e verificado paciente↔consulta, com tratamento de ambiguidades e invalidações. Não foi criado nem executado backfill por nomes.
4. O contrato de entrega passa a `contactCapability: patient-directory-v1` no Worker, frontend, ponte e coletor. Proveniência da extração permanece `patient-details-v2`. Coletor candidato **1.2.9**, URLs/cache `20261015-directory-1`. Clientes novos recusam Worker v2/antigo; clientes anteriores recusam a capacidade nova. Atualizar/reabrir todos de forma coordenada antes de retomar avisos; suspender uso durante divergência/rollback. Nenhum gate ou rollback de deploy foi alterado.
5. A extensão é aditiva no Firestore, sem DDL/D1 ou alteração de regras/bindings/credenciais. A criação dos documentos ocorreria na primeira sincronização futura autorizada; não aconteceu em produção. Antes de eventual migração, definir o destino de cópias legadas, correções/exclusões já solicitadas e backups. O marcador mínimo de exclusão deve ser preservado enquanto a coleta automática puder reintroduzir o mesmo ID; remoção integral exige um procedimento próprio. Retenção não foi executada nem ampliada em dados reais.

Limites: persistência/concorrência comprovadas com adaptador em memória, serialização/restauração e scripts reais; não houve autenticação, Firestore ou navegador clínico reais. A paginação das consultas/recibos mantém o limite anterior de 20×100 documentos, agora falhando explicitamente se incompleta. O diretório durável não é varrido e não tem esse limite de cardinalidade; consulta apenas chaves necessárias. A ordenação temporal global de snapshots concorrentes permanece a do módulo; a proteção desta entrega garante que snapshots não sobrescrevam contatos/correções/exclusões do diretório.

## Evidências verificadas

**153 testes passaram**: 16 novos de durabilidade, 135 regressões da Agenda/contrato/navegação/capacidade/recuperação Firebase e 2 de commit atômico existente. As expectativas antigas de revogar por vazio/falha foram alteradas para conservar valor/prova da mesma associação; mudança de associação e uso de legado não verificado continuam recusados. Fixtures de coleta→href agora usam ID técnico explícito e a projeção real do diretório.

Os novos cenários cobrem recarga e outra sessão com armazenamento restaurado; mais de 24h; consultas novas/removidas; vazio/parcial/falha; idempotência; homônimos; organização e recibos separados; inserção e correções concorrentes; exclusão/correção vencendo coleta obsoleta; replay sem identidade sob outro ID de consulta; falha depois de salvar contato; ausência/vínculo inválido; respostas em lote incompletas; ponte real + coletor visitando somente desconhecidos e compartilhando captura por paciente; cancelamento, resposta tardia e janela indisponível. A matriz do frontend/ponte/coletor recusa protocolo anterior e revalida identidade/revisão no clique.

```sh
node --test --test-timeout=10000 \
  worker/tests/agenda-contact-durability.test.mjs \
  worker/tests/agenda.test.mjs \
  worker/tests/agenda-contact-contract.test.mjs \
  worker/tests/agenda-contact-recurrence.test.mjs \
  worker/tests/agenda-capacity.test.mjs \
  scripts/agenda/recuperar-firebase-agenda.test.mjs \
  worker/tests/firestore-atomic-v29.test.mjs
```

Sintaxe dos cinco JS alterados e `git diff --check` aprovados. Workflow Agenda inclui a suíte nova e observa gateway/diagnósticos. Nenhuma dependência foi instalada; não houve leitura de `.env`, dados de pacientes, sessões, cookies, tokens, bancos ou credenciais reais. Testes do tutorial e suítes gerais não afetadas não foram repetidos. `AGENTS.md` e o checkpoint foram lidos; o checkpoint da Missão Bancária não foi alterado por esta frente.

Próxima ação: revisar a candidata local e o contrato do ID técnico; autorizar separadamente eventual homologação estrutural sanitizada e plano de migração/entrega. Não há autorização de push, PR, merge ou publicação nesta tarefa.
