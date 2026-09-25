# MISSÃO BANCÁRIA — FONTE MESTRA PARA NOVAS SESSÕES

Data-base: 25/09/2026.

## Finalidade
Este documento existe para ser anexado como fonte de referência em novas sessões de desenvolvimento do projeto "Missão Bancária". Ele é autossuficiente o bastante para orientar continuidade, mas não substitui a leitura dos documentos versionados quando o repositório estiver acessível.

## Produto
Ferramenta privada de preparação para concursos bancários, inicialmente CAIXA — Técnico Bancário Novo e Banco do Brasil — Escriturário/Agente Comercial.

Usuário inicial: conta autenticada `wellyton`.

Objetivo de UX: transformar estudo em uma campanha de progressão visível, baseada em leitura, questões, recordação ativa, revisão espaçada e domínio mensurável. Videoaula não é método principal.

## Regras inegociáveis
1. Acesso real exclusivo deve ser validado no backend.
2. Outra conta não pode acessar por URL direta.
3. Nunca misturar dados de estudo com dados clínicos, pacientes, CORE, Telemedicina, Documentos ou Conselho.
4. Conteúdo deve seguir edital oficial versionado.
5. Texto pedagógico deve ser original; não copiar curso pago.
6. Gamificação serve à aprendizagem; XP não substitui acertos ou retenção.
7. Cobertura do edital e domínio real são métricas diferentes.
8. Não avançar de fase sem implementação, teste e aceite quando aplicável.
9. Preservar decisões humanas mais recentes.
10. Novas sessões devem ler esta fonte e os documentos da fase ativa antes de alterar código.
11. Wellyton deve poder estudar enquanto a plataforma é construída.
12. A primeira versão jogável deve conter conteúdo real; material fictício fica restrito a testes.
13. Novos conteúdos não podem apagar ou diluir progresso anterior.
14. "Conteúdo disponível" e "progresso no conteúdo disponível" são métricas separadas.
15. Medalhas de estudo devem aparecer na área existente `/conquistas/`, sem criar catálogo paralelo.
16. Bronze/Prata/Ouro continuam representando segurança da conta, não desempenho acadêmico.
17. Toda conquista de estudo exige regra persistida, verificável e idempotente.

## Experiência central
Dashboard:
- cobertura;
- domínio;
- XP e nível;
- horas líquidas;
- questões;
- taxa de acertos;
- sequência;
- meta semanal;
- revisões;
- próxima missão.

Missão:
1. objetivo;
2. leitura;
3. exemplos;
4. pegadinhas;
5. recordação ativa;
6. minibatalha;
7. questões;
8. explicação de erros;
9. domínio;
10. revisão futura;
11. XP.

Modo foco:
- interface limpa;
- cronômetro;
- progresso;
- anterior/próximo;
- marcar dúvida;
- sem distrações sociais.

Conquistas:
- categoria própria "Missão Bancária" dentro de `/conquistas/`;
- exemplos: Primeira missão, 100 questões, chefe de SFN, mundo concluído, 1.000 questões e marco de simulado;
- inicialmente visíveis somente para Wellyton;
- desbloqueio pelo backend;
- nunca confundir com os níveis Bronze/Prata/Ouro da conta.

## Progressão
Cobertura:
- não iniciado;
- leitura concluída;
- prática iniciada;
- tópico coberto.

Domínio:
- calculado por desempenho recente, revisões e retenção.

Disponibilidade:
- campanha planejada;
- conteúdo já publicado;
- progresso pessoal dentro do conteúdo publicado.

A expansão da campanha não pode fazer a barra pessoal "andar para trás".

## Fases

### Fase 0 — Governança e arquitetura
Definir rota `/estudos/`, API `/api/studies/*`, autorização `wellyton`, modelo de dados separado, observabilidade mínima e rollback.

Aceite: plano técnico revisado e isolamento demonstrável.

### Fase 1 — Motor MVP
Criar acesso privado, dashboard, persistência, XP, níveis, cronômetro, mapa de campanha, próxima missão e modo foco. A primeira versão jogável já contém um pequeno recorte real de Conhecimentos Bancários.

Aceite: iniciar missão real, concluir, sair, voltar e encontrar progresso preservado; outra conta deve falhar; uma nova missão pode ser publicada sem apagar progresso anterior.

### Fase 2 — Motor pedagógico
Criar formato reutilizável de aula/missão com leitura, recordação, questões, feedback, domínio e revisão, permitindo publicação incremental.

Aceite: pelo menos três missões diferentes publicadas pelo mesmo motor sem código específico por aula e uma expansão posterior preservando o histórico anterior.

### Fase 3 — Mundo 1: Conhecimentos Bancários
Expandir em blocos o conteúdo bancário iniciado anteriormente até completar o primeiro mundo. Usar edital oficial vigente como escopo. Criar trilha, questões, revisões, chefe temático e diagnóstico por subtema. Cada bloco pronto pode ser liberado imediatamente para estudo.

Aceite: estudo ponta a ponta com lacunas claramente identificadas.

### Fase 4 — Português + Matemática Financeira
Português aplicado à prova, começando por interpretação e avançando por estruturas relevantes. Matemática com explicação curta, exemplo, tentativa e correção.

Aceite: trilhas completas, revisões e chefes temáticos.

### Fase 5 — Atendimento/Vendas + TI/Digital
Cobrir relacionamento, negociação, atendimento, vendas, experiência do cliente, informática, segurança e temas digitais previstos no edital.

Aceite: bom tratamento de questões situacionais e conceituais.

### Fase 6 — Ética/Compliance + Estatística + Inglês
Normas versionadas; estatística progressiva; inglês focado em interpretação.

Aceite: cobertura integral do edital-base.

### Fase 7 — Revisão adaptativa e caderno de erros
Revisões espaçadas, fila de erros, tópicos frágeis, recuperação, histórico e priorização por desempenho/recência/peso.

Aceite: sistema consegue explicar por que cada revisão entrou na fila.

### Fase 8 — Simulados e redação
Simulados por matéria, bloco e completos, temporizados, com relatório; redação quando prevista.

Aceite: executar prova simulada ponta a ponta e gerar plano de correção.

### Fase 9 — Otimização e manutenção
Desempenho, UX, mobile, acessibilidade, atualização de edital, versionamento e preservação de progresso entre editais.

Aceite: adotar novo edital sem zerar progresso válido.

## Estratégia de entrega contínua

A construção oficial é:

> construir pequeno ciclo completo → Wellyton estuda → observar → ajustar → publicar mais conteúdo.

Conteúdos usam IDs lógicos estáveis, como `banking.sfn.cmn`, para que mudanças de ordem, novas aulas ou revisões editoriais não apaguem histórico.

## Fontes
Hierarquia:
1. edital oficial;
2. banca/órgão;
3. legislação e normas;
4. documentos institucionais;
5. provas anteriores oficiais;
6. fontes secundárias de apoio.

Cada snapshot de edital deve guardar órgão, cargo, banca, data, fonte, disciplinas e pesos/quantidades oficiais.

## Instrução operacional para nova sessão

> Continue o projeto Missão Bancária a partir da documentação versionada no repositório. Antes de alterar código, leia o Dossiê Mestre, a Instrução de Continuidade e o documento da fase ativa. Confira o estado real da main/branch e preserve decisões aprovadas. Trabalhe somente no escopo da fase atual, mas priorize uma fatia vertical utilizável que Wellyton possa estudar assim que estiver estável. Não use conteúdo fictício na experiência real e preserve integralmente o progresso ao publicar novas missões. Não misture dados de estudo com dados institucionais. Ao concluir uma entrega, registre implementação, testes, pendências e o que depende de homologação humana.

## Hierarquia em caso de conflito
1. instrução humana explícita mais recente;
2. segurança e código atual;
3. Dossiê Mestre atualizado;
4. documento da fase ativa;
5. documentos históricos.
