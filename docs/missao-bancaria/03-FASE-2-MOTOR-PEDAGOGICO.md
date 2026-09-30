# MISSÃO BANCÁRIA — FASE 2
## Motor pedagógico

Iniciada em: 29/09/2026.  
Status: **fase ativa**, após aceite explícito da Fase 1.

### Objetivo
Transformar o MVP já utilizável em uma plataforma capaz de ensinar de forma consistente, refinando o método com base no uso real de Wellyton enquanto novas missões continuam sendo publicadas.

### Primeiro recorte ativo

Recorte A: **catálogo pedagógico declarativo**, documentado em `52-FASE2-CATALOGO-PEDAGOGICO-DECLARATIVO.md`.

A primeira correção estrutural remove do manifesto a necessidade de conhecer funções de anexação específicas por grupo de aulas. O conteúdo existente deve permanecer idêntico para o usuário e para o histórico; a mudança é arquitetural e prepara a publicação incremental exigida por esta fase.

O Recorte A foi integrado pela PR #547. O contrato reutilizável de feedback pós-resposta percorre os Recortes B–B4 e fecha o primeiro bloco. O Recorte C1 implementa os seis estados pedagógicos; o C2 mede erros recorrentes. O recorte C3 ativo implementa domínio ponderado por recência, separado de cobertura, XP e prontidão.

### Unidade pedagógica padrão
Cada missão deve suportar:
- título;
- objetivo;
- leitura em blocos;
- exemplos;
- alerta/pegadinha;
- recordação ativa;
- minibatalha;
- questões;
- explicação de cada alternativa quando útil;
- conclusão;
- domínio;
- revisão futura.

### Estados
- não iniciado;
- em leitura;
- leitura concluída;
- prática;
- revisão;
- consolidado.

### Publicação incremental

O motor deve permitir publicar uma missão nova sem alterar código específico da aula e sem interromper o estudo das missões anteriores.

Requisitos:
- ID lógico estável por conteúdo;
- versão do texto/material;
- publicação independente;
- possibilidade de corrigir conteúdo;
- preservação de tentativas, domínio, XP e revisões;
- indicador de conteúdo novo disponível.

Mudanças editoriais simples não devem exigir refazer uma missão. Mudanças conceituais relevantes podem gerar revisão recomendada, com registro explícito.

### Métricas
- taxa de acerto;
- tentativas;
- tempo por missão;
- retenção em revisão;
- erros recorrentes;
- domínio ponderado por recência.

### Feedback
Erro deve produzir ensino, não punição.
A plataforma deve mostrar:
- resposta correta;
- por que é correta;
- por que a escolha do usuário falhou;
- qual conceito revisar.

### Critério de aceite
Um mesmo motor consegue publicar três missões de formatos diferentes sem código específico por aula, adicionar uma quarta missão posteriormente e preservar integralmente o progresso das três anteriores.
