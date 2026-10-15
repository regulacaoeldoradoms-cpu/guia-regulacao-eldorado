# Identidade DigSaúde — evidência local e compatibilidade

Revisão local de 15/10/2026 sobre `2314cf19` (primeira candidata `c95c620e`); branch `fix/agenda-durable-patient-contacts`. Investigação sem dados reais ou rede clínica. A publicação posterior foi autorizada somente para persistência por consulta; migração e reuso entre consultas continuam fora do escopo. O checkout original permanece em `d6e4c349` e a frente do tutorial não foi alterada.

## O que o repositório comprova

| Evidência | Conclusão permitida | Limite |
| --- | --- | --- |
| Commit `77a1b7b5`, `sourceIdFor()` no userscript original | `wire:key` com `.table.records.{id}`/checkbox identifica a consulta usada em `/consultas/{id}/view` | Não é prova de ID do paciente |
| Commit `3914abe2`, `extractRows()` | A coluna 9 fornece `patient` por `textContent`; os conhecidos são IDs das consultas | Nome não é identidade entre consultas |
| Commit `aadafe9f`, `extractContact()` | O fluxo antigo reutilizava `wire:snapshot` para executar a ação de dados do paciente e extrair telefone | Não extraía nem persistia chave de paciente; nenhum payload real foi consultado nesta revisão |
| Commit `8fd973e3` e [estrutura observada](AGENDA-CONTATO-ESTRUTURA-OBSERVADA.json) | Diálogo visível `Dados do Paciente`, campo `mountedActionsData.0.telefonecel` | O `0` é índice da ação, e `telefonecel` é o campo; nenhum deles identifica paciente |
| [Fixture do diálogo](../worker/tests/fixtures/agenda-patient-dialog.html) | Projeção sanitizada da estrutura do telefone, com valores/consulta sintéticos | Excluiu outros campos e `wire:snapshot`; não contém ID técnico do paciente |
| [Fixture do menu](../worker/tests/fixtures/agenda-patient-menu.html) | Modelo sintético do dropdown Filament para testar ação | Não é inspeção real de links/campos de paciente |
| `worker/telemedicine.js`, `patientIdFor(name)` | A chave interna de Telemedicina é hash do nome normalizado | Não deve unir contatos de pacientes/homônimos da Agenda |

O histórico anterior à candidata foi pesquisado nos arquivos do coletor, Worker, fixtures e estrutura observada com `git log d6e4c349 -G 'patientId|patientSourceId|paciente_id|patient_id|/pacientes/' -- ...`: sem correspondência nesses caminhos. Isso não prova ausência de um ID no DigSaúde; prova que a origem/semântica desse ID **não está documentada pelo material local inspecionado**. `/pacientes/{id}` foi introduzido apenas como hipótese em `c95c620e`.

O protótipo dessa hipótese permanece testável com um contrato sintético explícito, mas está **desativado na coleta normal** (`PATIENT_ID_CONTRACT = ''`). Uma URL que coincida com a hipótese não ativa o contrato. Não se inventou chave por nome, telefone, CPF/CNS ou ID de consulta.

## Compatibilidade corrigida

O contato legado v2 válido continua disponível pela API e WhatsApp no vínculo original: mesma consulta/`sourceId`, paciente/data de solicitação associados na prova de captura, proveniência e validações de associação preservadas, sem expiração automática. Verificar esses campos dentro da mesma consulta não associa pacientes entre consultas. Um ID técnico apenas proposto não remove o legado, não o promove nem força recoleta enquanto válido.

Novos contatos sem chave técnica continuam pelo fluxo v2 por consulta. A prova confirmada **não expira automaticamente após 24h**. Vazio/falha e outra captura automática não substituem valor/prova nem atualizam artificialmente a data de verificação. Versão ausente, data inválida/futura, associação divergente ou bloqueio continuam indisponíveis; remover o prazo não fabrica procedência. Homônimos em outra consulta não herdam telefone nem são afetados por correção/exclusão de um paciente do diretório somente por terem o mesmo nome.

Uma consulta **já vinculada** ao diretório não pode perder seu ID e voltar ao modo legado para restaurar correção/exclusão. Essa perda fica marcada (`contactIdentityRequired`) até receber associação técnica explícita novamente. Exclusões do diretório são aplicadas às associações confirmadas; não se promete propagá-las a registros legados independentes cuja identidade é desconhecida.

**Não é necessário mapear globalmente os contatos antigos para continuar usando a Agenda.** O diretório permite migração progressiva, individual, após comprovar a fonte técnica. A durabilidade agora é comprovada na mesma consulta, usando a prova v2 original; não foi inferida identidade de paciente. `POST /api/agenda/contact` com `sourceId`, `action`, `expectedRevision` e `phone` somente na correção permite corrigir/excluir esse vínculo sob a mesma autorização. CAS e marcador persistido impedem replay/concorrência de desfazer correção/exclusão. Nova revisão explícita é exigida para restaurar o número. Não foi feito backfill nem criada uma nova base para a consulta.

## Organização: limite existente preservado

O código/configuração versionados representam uma implantação institucional única: `validatePortalSession()` consulta o usuário ativo no `AUTH_DB`; `authorizedUser()` permite admin ou capacidade Telemedicina; `auth_telemedicine_access` é indexado por usuário, sem seletor de organização. `worker/wrangler.toml` declara um banco institucional e os dois domínios do mesmo portal. O gateway recebe um único binding de projeto Firestore; as regras Firebase negam acesso direto dos clientes.

Portanto, o limite atual é a implantação e seus bindings, não uma permissão multiorganização por linha. A candidata mantém sessão, perfis, capacidade, origens, banco/projeto e caminhos legados. O escopo do diretório é definido no servidor; payload/query/postMessage não o escolhem. Não é necessário cadastrar organização, ampliar acesso ou migrar o namespace legado para esta implantação. Essa conclusão é de código/configuração local; nenhuma configuração produtiva foi lida. Arquivos de autenticação, acesso Telemedicina, `wrangler.toml`, roteador e regras Firebase estão idênticos ao commit anterior.

## Menor evidência que ainda falta

Somente para habilitar **reuso entre consultas diferentes**: obter contrato oficial do fornecedor, ou projeções estruturais sanitizadas da célula do paciente e/ou diálogo visível que exponham um identificador explicitamente do paciente, com sua relação com a consulta. A evidência deve confirmar o mesmo identificador em duas consultas distintas do mesmo paciente e distingui-lo de uma terceira consulta de outro paciente. IDs/consultas devem ser substituídos por tokens sintéticos consistentes (`PACIENTE_A`, `CONSULTA_1`, etc.); basta a estrutura e a relação, sem nomes, telefones, CPF/CNS, conteúdo clínico, cookies, tokens ou `wire:snapshot` completo.

Confirmar também o escopo/unicidade desse campo e sua estabilidade após recarga. Depois disso, ajustar/habilitar **um adaptador** e acrescentar uma fixture sanitizada com os mesmos controles de origem, consulta, Document e diálogo. Não são necessários login adicional, nova credencial/permissão, varredura de pacientes ou mapeamento global. Essa coleta de evidência real/sanitizada não foi executada nem autorizada por esta tarefa; pode ser fornecida pelo operador/fornecedor sem acesso do assistente aos valores reais.

## Verificação desta revisão

82 testes dos três arquivos afetados passaram: Agenda, contrato e 21 de durabilidade. Os quatro novos cenários comprovam prova com mais de 24h e anos de idade, nova sessão, consulta removida/reaparecida, desconhecido ainda ausente, correção/exclusão explícitas sem backfill, replay concorrente e duas correções com uma revisão. A ponte real ignora o contato por consulta com prova antiga e ainda coleta o desconhecido; data/procedência originais permanecem. Datas futuras/inválidas e associação divergente continuam recusadas.

Os demais resultados anteriores foram reaproveitados somente nos caminhos inalterados; não se repetiram suítes gerais, recuperação Firebase, gateway, capacidade, recorrência/navegação ou tutorial. A fonte de ID do paciente continua não comprovada e o adaptador hipotético continua desativado. O único limite residual desta frente é o reuso **entre consultas diferentes**, cujo formato mínimo de evidência sanitizada está descrito acima.

A entrega autorizada também fixa `PATIENT_DIRECTORY_ENABLED = false` no Worker, bloqueando a API do diretório por paciente. A variante habilitada existe somente nos testes sintéticos do caminho preparado. Nenhum cliente, payload ou variável de implantação ativa esse recurso.
