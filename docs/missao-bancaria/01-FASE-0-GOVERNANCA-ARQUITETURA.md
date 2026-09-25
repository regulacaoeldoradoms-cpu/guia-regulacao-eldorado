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
- plano de rollback;
- estratégia de IDs estáveis para conteúdos;
- versionamento de conteúdo sem perda de progresso;
- separação entre conteúdo planejado, disponível e progresso pessoal;
- arquitetura que permita publicar novas missões sem migrações destrutivas;
- integração prevista com a rota existente `/conquistas/`;
- separação explícita entre nível de segurança da conta e conquistas de estudo.

### Regras
- backend é a autoridade de acesso;
- frontend apenas reflete autorização;
- não reutilizar tabelas clínicas;
- não armazenar dados de pacientes;
- nenhuma alteração deve quebrar login, Ferramentas, Telemedicina, Documentos, Conselho ou Camada Social;
- progresso do usuário não pode depender da posição visual de uma aula;
- cada tópico/missão deve ter ID estável;
- nova publicação de conteúdo não pode zerar, diluir ou reclassificar silenciosamente conquistas anteriores;
- a arquitetura deve permitir uso real desde a primeira entrega jogável.

### Modelo lógico mínimo
Entidades previstas:
- study_profile;
- study_topics;
- study_progress;
- study_sessions;
- study_attempts;
- study_reviews;
- study_xp_events;
- study_achievements;
- study_content_releases ou mecanismo equivalente de versionamento/publicação;
- study_achievements com regra idempotente de desbloqueio e timestamp de conquista.

O desenho final pode mudar, mas a separação de domínio deve permanecer.

### Identidade e versionamento de conteúdo

Requisitos:
- IDs semânticos e estáveis;
- versão do conteúdo separada do ID lógico;
- progresso vinculado ao ID lógico, não ao número da aula ou posição na lista;
- capacidade de acrescentar missões sem recalcular indevidamente o que já foi concluído;
- alterações substanciais que exijam nova aprendizagem devem ser explicitamente versionadas e tratadas como revisão, nunca como apagamento silencioso.

### Métricas de disponibilidade

O modelo deve conseguir representar separadamente:
- percentual da campanha planejada já publicado;
- percentual concluído do conteúdo publicado;
- cobertura do edital;
- domínio real.

### Integração com Conquistas

A arquitetura deve permitir que `/conquistas/` consulte somente um resumo de medalhas da Missão Bancária sem expor conteúdo detalhado de estudo a outras contas.

Requisitos:
- backend valida `username === 'wellyton'` para dados de estudo;
- conquistas de estudo possuem ID estável, por exemplo `study.first_mission`;
- desbloqueio é idempotente;
- cada conquista guarda data de obtenção e regra/versão que a concedeu;
- Bronze/Prata/Ouro existentes não podem ser alterados pela Missão Bancária;
- a ausência do módulo de estudos não pode quebrar a página geral de Conquistas.

### Critério de aceite
Fase 0 é aprovada quando existe um plano técnico revisado, sem código produtivo obrigatório, com autorização claramente testável, nenhuma dependência de dados institucionais e estratégia comprovável para preservar progresso durante a expansão incremental da campanha.
