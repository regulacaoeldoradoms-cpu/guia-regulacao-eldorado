# MISSÃO BANCÁRIA — FASE 0
## Governança, isolamento e arquitetura

### Objetivo
Definir como o módulo entra no Portal sem interferir em módulos institucionais.

### Entregas
- rota proposta: `/estudos/`;
- namespace de API proposto: `/api/studies/*`;
- regra de autorização exclusiva para `username === 'wellyton'`;
- modelo de dados separado;
- inventário de arquivos novos e arquivos existentes que poderão ser tocados;
- regra de observabilidade sem conteúdo de estudo sensível;
- plano de rollback.

### Regras
- backend é a autoridade de acesso;
- frontend apenas reflete autorização;
- não reutilizar tabelas clínicas;
- não armazenar dados de pacientes;
- nenhuma alteração deve quebrar login, Ferramentas, Telemedicina, Documentos, Conselho ou Camada Social.

### Modelo lógico mínimo
Entidades previstas:
- study_profile;
- study_topics;
- study_progress;
- study_sessions;
- study_attempts;
- study_reviews;
- study_xp_events;
- study_achievements.

O desenho final pode mudar, mas a separação de domínio deve permanecer.

### Critério de aceite
Fase 0 é aprovada quando existe um plano técnico revisado, sem código produtivo obrigatório, com autorização claramente testável e nenhuma dependência de dados institucionais.
