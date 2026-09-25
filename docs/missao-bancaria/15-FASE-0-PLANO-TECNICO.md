# MISSÃO BANCÁRIA — FASE 0 — PLANO TÉCNICO V1

Data: 25/09/2026  
Estado: **EM HOMOLOGAÇÃO DOCUMENTAL**  
Base analisada: `main` após merge da PR #488, commit `abb7d7e5f7b747abab62f4df4ed8a2cb636b92ec`.

## 1. Objetivo desta decisão

Definir uma arquitetura que permita iniciar a Fase 1 sem:
- criar autenticação paralela;
- misturar dados de estudo com dados assistenciais;
- transformar a Missão Bancária em função profissional;
- perder progresso ao publicar novos conteúdos;
- quebrar módulos existentes do Portal.

Nenhum código funcional da Missão Bancária é publicado nesta Fase 0.

## 2. Estado real do Portal conferido

### Autenticação
O Portal já fornece sessão autenticada por Bearer token via `js/auth-client.js` e validação no Worker por `validatePortalSession`.

A identidade normalizada inclui `username`, portanto o gate inicial da Missão Bancária pode ser baseado diretamente em:

`username === 'wellyton'`

### Catálogo de ferramentas
`js/tools-catalog.js` é a matriz atual de cards em Home/Ferramentas.

Decisão:
- a futura entrada **Missão Bancária** será adicionada somente quando `user.username === 'wellyton'`;
- não será criada função adicional em `auth_user_additional_roles`;
- o módulo não deve aparecer para preview técnico genérico nem para outras contas.

### Backend
`worker/index.js` já centraliza roteamento de módulos autenticados.

Decisão:
- criar módulo independente `worker/studies.js`;
- exportar `isStudiesApi(pathname)` e `handleStudiesRoute(...)`;
- `worker/index.js` apenas delegará rotas `/api/studies/*`.

### Persistência
O Worker já possui o binding D1 `AUTH_DB`.

Decisão:
- reutilizar `AUTH_DB` somente com tabelas prefixadas `study_`;
- não usar tabelas clínicas, Firebase, Drive ou estruturas de Conselho;
- não criar `STUDY_DB` na V1, evitando nova infraestrutura sem benefício proporcional;
- se o domínio de estudo crescer para múltiplos usuários ou exigir isolamento físico, essa decisão pode ser revisitada em fase futura com migração explícita.

### Conquistas
`/conquistas/` já existe e Bronze/Prata/Ouro representam segurança da conta.

Decisão:
- Missão Bancária será uma categoria adicional;
- Bronze/Prata/Ouro não serão alterados;
- a ausência/erro da API de estudos nunca deve quebrar a progressão de segurança existente.

## 3. Superfícies planejadas

### Interface
- `/estudos/` — casca estática do módulo;
- `js/studies.js` — orquestra a experiência autenticada;
- `css/studies.css` — identidade visual própria e compatível com tema claro/escuro.

### API
Namespace reservado:

`/api/studies/*`

Primeiros contratos previstos para a Fase 1:
- `GET /api/studies/bootstrap`
- `POST /api/studies/sessions`
- `PATCH /api/studies/sessions/:id`
- `POST /api/studies/attempts`
- `POST /api/studies/missions/:id/complete`

Rotas definitivas podem ser reduzidas durante a Fase 1 se um contrato menor entregar a mesma fatia vertical.

## 4. Modelo de autorização

### Frontend
Fluxo:
1. exigir sessão normal do Portal;
2. obter usuário atual;
3. se `username !== 'wellyton'`, não montar conteúdo e encaminhar para Ferramentas/Home com estado de acesso negado;
4. somente após autorização chamar API de estudos.

A página HTML, por ser publicada como frontend estático, pode tecnicamente ser baixada como casca. Ela não contém progresso pessoal, respostas, conteúdo autenticado ou capacidade útil sem API.

### Backend
Toda rota `/api/studies/*` deve:
1. validar sessão;
2. normalizar username;
3. exigir exatamente `wellyton`;
4. retornar:
   - 401 para sessão ausente/inválida;
   - 403 para sessão válida de outro usuário.

O backend é a autoridade.

## 5. Estratégia de conteúdo

### Fonte canônica
Conteúdo pedagógico será versionado no GitHub junto ao produto.

Estrutura proposta:

`worker/studies-content/`
- `manifest.js`
- `banking-sfn.js`
- módulos seguintes por mundo/matéria.

Motivos:
- conteúdo real desde a primeira entrega;
- revisão por diff/PR;
- IDs estáveis;
- API pode ocultar gabarito até a resposta;
- não requer migração D1 para editar texto;
- rollback acompanha o código.

### Manifesto
Cada item deve possuir no mínimo:
- `topicId` estável;
- `missionId` estável;
- `contentVersion`;
- matéria/mundo;
- título;
- ordem apenas de apresentação;
- estado `planned|published|retired`;
- fonte/edital-base;
- peso lógico opcional para disponibilidade.

Exemplos:
- `banking.sfn.introducao`
- `banking.sfn.cmn`
- `banking.sfn.bacen`
- `banking.sfn.copom`

Posição visual nunca é identidade.

## 6. Modelo D1 proposto

### `study_profiles`
Metadados mínimos do estudante.

Campos previstos:
- username PK;
- created_at;
- updated_at.

XP e nível não serão inicialmente armazenados como contador mutável se puderem ser derivados com segurança dos eventos.

### `study_topic_progress`
- username;
- topic_id;
- coverage_state;
- mastery_score;
- content_version_seen;
- started_at;
- completed_at;
- updated_at;
- PK(username, topic_id).

### `study_sessions`
- session_id PK;
- username;
- mission_id opcional;
- started_at;
- finished_at;
- duration_seconds;
- status.

Tempo deve ser limitado/validado no servidor para evitar sessões abertas indefinidamente inflando métricas.

### `study_attempts`
- attempt_id PK;
- username;
- question_id;
- topic_id;
- content_version;
- selected_option;
- correct;
- attempted_at.

### `study_reviews`
- review_id PK;
- username;
- topic_id;
- cycle;
- due_at;
- completed_at;
- status.

### `study_xp_events`
Fonte canônica para XP:
- event_id PK;
- username;
- event_type;
- ref_id;
- points;
- created_at;
- UNIQUE(username, event_type, ref_id).

Essa restrição impede recompensa duplicada.

### `study_achievements`
- username;
- achievement_id;
- rule_version;
- unlocked_at;
- source_ref;
- PK(username, achievement_id).

### Versionamento de conteúdo
Não haverá tabela obrigatória de conteúdo na V1.

O equivalente a `study_content_releases` será o manifesto versionado no repositório. O progresso grava `content_version_seen`.

## 7. Cálculos de progresso

Devem existir quatro métricas separadas:

1. **Campanha planejada disponível**  
   proporção do conteúdo planejado já publicado.

2. **Progresso no conteúdo disponível**  
   conclusão de Wellyton considerando apenas conteúdo publicado.

3. **Cobertura do edital**  
   assuntos vistos/praticados conforme regra pedagógica.

4. **Domínio**  
   desempenho calculado por tentativas, revisões e recência.

Adicionar uma missão nova:
- pode alterar a disponibilidade da campanha;
- pode alterar o denominador do conteúdo disponível dali em diante;
- não apaga conclusão, XP, conquistas ou histórico de itens anteriores.

A UI deve evitar mensagens que façam uma conquista já obtida parecer perdida.

## 8. Conquistas

Primeira integração prevista:
- `study.first_mission` — concluir primeira missão real.

A concessão ocorre no mesmo fluxo transacional lógico da conclusão:
1. validar missão;
2. persistir conclusão;
3. inserir XP idempotente;
4. inserir conquista idempotente;
5. responder com `newAchievements`.

`/conquistas/` fará leitura resumida autenticada e exibirá a categoria Missão Bancária somente para Wellyton.

## 9. Observabilidade e privacidade

### Não enviar para PostHog/log externo
- username;
- questão;
- resposta;
- nota;
- domínio;
- XP;
- tópico estudado;
- conteúdo da aula;
- tempo individual detalhado de estudo.

### Permitido em logs técnicos mínimos
Somente quando necessário:
- evento genérico;
- rota genérica;
- status HTTP;
- duração técnica;
- código de falha sem conteúdo pessoal.

Preferência V1: nenhuma telemetria externa específica de aprendizagem. Métricas pedagógicas permanecem no D1.

## 10. Arquivos previstos para Fase 1

### Novos
- `estudos/index.html`
- `js/studies.js`
- `css/studies.css`
- `worker/studies.js`
- `worker/studies-content/manifest.js`
- `worker/studies-content/banking-sfn.js`
- `worker/tests/studies.test.mjs`

### Existentes a tocar com escopo mínimo
- `js/tools-catalog.js` — card exclusivo;
- `worker/index.js` — roteamento;
- `js/achievements.js` — leitura/renderização segura da categoria;
- `conquistas/index.html` — recipiente da categoria;
- `portal-sw.js` — somente se necessário para a casca estática;
- `js/portal-performance.js` — inclusão controlada da rota;
- testes/allowlists correspondentes;
- documentação da Missão Bancária.

Evitar alterar `additional-roles.js`, perfis profissionais ou modelos clínicos.

## 11. Testes obrigatórios antes de qualquer publicação

### Autorização
- sem token -> 401;
- token válido de outro usuário -> 403;
- Wellyton -> acesso;
- card aparece somente para Wellyton.

### Persistência
- concluir missão e recarregar preserva estado;
- publicar missão nova não apaga progresso anterior;
- repetir conclusão não duplica XP;
- repetir conclusão não duplica conquista.

### Isolamento
- payload não contém pacientes/CORE/Drive;
- schema usa apenas prefixo `study_`;
- falha do módulo não afeta autenticação nem demais rotas.

### Interface
- claro/escuro;
- desktop/mobile;
- loading;
- vazio;
- erro;
- acesso negado;
- modo foco;
- prefers-reduced-motion para celebrações.

## 12. Rollback

A Fase 1 deve ser reversível em duas camadas:

1. **Frontend**
   - remover card da matriz de ferramentas;
   - remover/publicar novamente a rota estática sem afetar outros módulos.

2. **Backend**
   - remover delegação `isStudiesApi` de `worker/index.js`;
   - manter tabelas `study_` intactas para não destruir progresso.

Rollback não deve executar DROP de tabelas automaticamente.

Conteúdo versionado volta pelo commit anterior sem reescrever progresso.

## 13. Critérios para sair da Fase 0

A Fase 0 pode ser aprovada quando Wellyton aceitar este plano e estiverem preservadas as seguintes decisões:

- rota `/estudos/`;
- API `/api/studies/*`;
- gate exclusivo `wellyton`;
- `AUTH_DB` com tabelas `study_*`;
- conteúdo versionado no repositório;
- IDs estáveis;
- progresso e conquistas idempotentes;
- integração não destrutiva com `/conquistas/`;
- sem telemetria pedagógica externa;
- rollback sem apagar progresso.

Após aceite explícito, a próxima fase é:

**Fase 1 — Motor MVP + primeiro recorte real de Sistema Financeiro Nacional.**
