# MISSÃO BANCÁRIA — DOSSIÊ MESTRE V1

Data de criação: 25/09/2026  
Status: planejamento documental; nenhum código de produto autorizado por este documento isoladamente.

## 1. Objetivo

Criar uma ferramenta privada de preparação para concursos bancários, inicialmente focada em **CAIXA — Técnico Bancário Novo** e **Banco do Brasil — Escriturário/Agente Comercial**, com experiência de estudo por leitura, questões, recordação ativa, revisão espaçada e progressão visual.

O produto deve funcionar como uma **campanha de progressão**, não como um cursinho tradicional. O usuário precisa enxergar:
- o que estudar agora;
- quanto do edital já cobriu;
- quanto realmente domina;
- onde erra;
- quando revisar;
- como sua taxa de acertos evolui;
- qual é a próxima missão.

## 2. Usuário e acesso

Versão inicial destinada exclusivamente à conta autenticada cujo `username` normalizado seja `wellyton`.

Regras obrigatórias:
1. esconder a entrada da ferramenta para demais contas;
2. bloquear a rota/API no backend para qualquer outro usuário;
3. nunca confiar apenas em ocultação de interface;
4. acesso manual por URL deve receber bloqueio;
5. nenhum dado de paciente, CORE, telemedicina, documentos, Conselho ou outro módulo institucional entra no módulo de estudos.

## 3. Princípios pedagógicos

A experiência deve privilegiar:
- leitura curta e estruturada;
- exemplos concretos;
- recuperação ativa da memória;
- questões após a leitura;
- explicação do erro;
- revisão espaçada;
- repetição baseada em dificuldade;
- simulados;
- progresso visível.

Videoaula não é requisito do produto. Se um dia existir, deve ser opcional e suplementar.

### 3.1 Ciclo mínimo de uma missão

1. Objetivo da missão.
2. Leitura.
3. Destaques e pegadinhas.
4. Recordação ativa sem consultar o texto.
5. Minibatalha de 3 a 5 perguntas.
6. Bloco de questões.
7. Feedback de acertos e erros.
8. Atualização do domínio.
9. Agendamento de revisão.
10. XP e progresso.

## 4. Progressão

Cada tópico possui dois eixos independentes:

### Cobertura
- 0 — não iniciado;
- 1 — leitura concluída;
- 2 — prática iniciada;
- 3 — tópico coberto.

### Domínio
Calculado por desempenho recente, revisões e retenção.

Nunca confundir "100% do edital visto" com "100% dominado".

## 5. Indicadores centrais

O dashboard deve poder exibir:
- cobertura do edital;
- domínio geral;
- horas líquidas;
- número de questões;
- percentual de acertos;
- evolução por matéria;
- sequência de estudo;
- revisões pendentes;
- XP;
- nível;
- progresso semanal;
- próxima missão.

## 6. Gamificação

Gamificação existe para tornar progresso perceptível, não para mascarar desempenho.

Exemplos:
- XP por leitura concluída;
- XP por prática;
- XP por revisão no prazo;
- bônus por desempenho;
- "chefes" ao fim de blocos;
- conquistas por marcos reais.

XP nunca substitui taxa de acertos, retenção ou cobertura.

## 7. Modo foco

Sessões de estudo devem poder abrir em modo foco:
- interface limpa;
- sem navegação social;
- sem distrações;
- cronômetro opcional;
- barra de progresso da sessão;
- ação "marcar dúvida";
- navegação anterior/próximo.

## 8. Privacidade e separação institucional

O módulo é pessoal e deve ser tecnicamente isolado dos fluxos assistenciais e administrativos da Secretaria.

Não armazenar:
- pacientes;
- CPF/CNS;
- encaminhamentos;
- conteúdo de documentos da Saúde;
- credenciais;
- e-mails institucionais;
- dados de terceiros.

Persistir apenas dados de estudo do próprio usuário.

## 9. Conteúdo

O conteúdo pedagógico deve:
- usar editais e documentos oficiais como fonte de escopo;
- ser explicado com texto original;
- indicar quando uma regra depende de atualização normativa;
- registrar a versão do edital usada como referência;
- evitar copiar integralmente material pago ou bancos de questões protegidos;
- preferir questões autorais baseadas nas competências cobradas;
- usar provas públicas oficiais como referência quando permitido.

Detalhamento em `12-FONTES-E-CONTEUDO.md`.

## 10. Estratégia de construção

Não produzir todo o curso em uma única entrega.

Ordem obrigatória:
- Fase 0 — governança e arquitetura;
- Fase 1 — motor MVP;
- Fase 2 — motor pedagógico;
- Fase 3 — primeiro mundo completo: Conhecimentos Bancários;
- Fase 4 — Português + Matemática Financeira;
- Fase 5 — Atendimento/Vendas + TI/Digital;
- Fase 6 — Ética/Compliance + Estatística + Inglês;
- Fase 7 — revisão adaptativa e caderno de erros;
- Fase 8 — simulados e redação;
- Fase 9 — otimização e manutenção de conteúdo.

Cada fase possui documento próprio e critério de aceite.

## 11. Regra de avanço

Uma fase só pode ser considerada concluída após:
1. implementação;
2. teste técnico;
3. uso/homologação humana quando aplicável;
4. registro do estado;
5. aceite explícito antes da próxima fase.

Não antecipar fases se isso aumentar risco de retrabalho.

## 12. Regra de continuidade entre conversas/agentes

Antes de trabalhar neste projeto:
1. ler este Dossiê Mestre;
2. ler `11-INSTRUCAO-DE-CONTINUIDADE.md`;
3. identificar a fase ativa;
4. ler integralmente o documento dessa fase;
5. conferir o código atual;
6. preservar decisões já aprovadas;
7. registrar qualquer mudança de escopo.

## 13. Fora de escopo inicial

- rede social de estudantes;
- ranking entre usuários;
- assinatura comercial;
- conteúdo em vídeo obrigatório;
- IA que responda questões sem ensinar;
- mistura com dados operacionais da Regulação;
- publicação para todos os usuários do Portal.

## 14. Norte do produto

A ferramenta deve responder continuamente à pergunta:

> "Qual é a menor próxima ação que faz Wellyton avançar de forma mensurável rumo a uma prova bancária?"

Se uma funcionalidade não melhora aprendizado, constância, mensuração ou foco, ela não é prioritária.
