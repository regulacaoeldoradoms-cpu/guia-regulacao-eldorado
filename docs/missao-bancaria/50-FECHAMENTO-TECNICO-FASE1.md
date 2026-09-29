# MISSÃO BANCÁRIA — FECHAMENTO TÉCNICO CANDIDATO DA FASE 1

Data: 29/09/2026.  
Estado: **Fase 1 aceita e encerrada em 29/09/2026**.  
Marco seguinte: Fase 2 aberta por autorização explícita de Wellyton.

## 1. O que este documento significa

Este documento nasceu como fechamento técnico candidato. Em 29/09/2026, após a publicação confirmada do frontend e do Worker, Wellyton concedeu o aceite humano global e autorizou a Fase 2.

O estado técnico que fundamentou o aceite foi:
1. interface independente #541 integrada em `main` (`9e5bebac7713b8ad7540aa31c6878e50e6b7faac`) após CI e auditoria global verdes;
2. frontend confirmado por `Validar site`, `Validar Missao Bancaria` e `pages build and deployment` pós-merge em `success`; Worker produtivo confirmado pelo Workers Builds `109558351269` no merge #544 e novamente pelo check `109653080446` no merge #545;
3. roteiro humano disponível no documento 46;
4. aceite explícito posterior registrado em `51-ACEITE-FASE1-ABERTURA-FASE2.md`.

CI verde não substituiu o aceite: a decisão final foi humana. O registro não fabrica marcações individuais para H1–H14.

## 2. Critérios técnicos da Fase 1

### Acesso e isolamento
- rota `/estudos/` protegida;
- API `/api/studies/*` limitada à conta autorizada;
- acesso direto de outra conta bloqueado;
- nenhum dado assistencial ou administrativo reutilizado.

Estado técnico: **implementado e automatizado**.

### Dashboard e progresso
- XP, nível, questões, acerto, tempo registrado, sequência e revisões;
- bloco atual separado do curso-base;
- mapa curricular de 12 áreas / 43 blocos;
- prontidão permanece “Ainda não medida”;
- XP não é tratado como probabilidade de aprovação.

Estado técnico: **implementado e automatizado**.

### Ensino e prática
- oito aulas reais do primeiro bloco de SFN;
- ensino por leitura antes da cobrança;
- leitor por partes;
- recordação ativa;
- 27 atividades formativas;
- 38 questões pontuadas;
- Chefe do primeiro bloco;
- feedback explicativo depois da resposta no treino.

Estado técnico: **implementado; clareza real ainda depende de uso humano**.

### Persistência e retomada
- rodadas persistentes;
- respostas idempotentes;
- tempo visível com checkpoints;
- pausa em segundo plano;
- sessão ativa recuperável sem duplicar rodada;
- respostas e tempo confirmado restaurados;
- backend impede segunda rodada enquanto houver sessão retomável;
- sequência histórica não é truncada por 500 eventos.

Estado técnico: **implementado e automatizado**.

### Revisão e retenção
- revisões espaçadas persistidas;
- nova tentativa para revisão;
- evidência de retenção separada do acerto imediato;
- histórico sem score não recebe nota inventada;
- revisão mais recente sem score não herda nota antiga;
- retenção não vira prontidão automaticamente.

Estado técnico: **implementado e automatizado**.

### Conquistas
- “Primeira missão” e Chefe do SFN baseados em evento persistido;
- idempotência de recompensa;
- categoria de estudo separada de Bronze/Prata/Ouro da segurança.

Estado técnico: **implementado e automatizado**.

## 3. Avaliação independente

A camada independente corrige a principal limitação de usar questões já vistas como prova suficiente de aprendizado.

Backend já integrado:
- 32 itens autorais;
- formas A/B de 16 sem sobreposição;
- distribuição equilibrada de posição correta;
- `ASSESSMENT_VERSION = 2`;
- schema próprio `study_assessment_*`;
- forma B somente após A + sete dias;
- nenhuma correção durante a rodada;
- nenhuma concessão de XP;
- nenhuma alteração de cobertura/prontidão;
- início e fechamento seguros sob concorrência;
- revisão editorial/factual V3 com guardrails de similaridade e comprimento.

Interface integrada e publicada (#541):
- painel de elegibilidade/estado;
- modo próprio sem consulta à aula;
- salvamento individual neutro;
- retomada da forma;
- bloqueio cruzado com sessão de estudo;
- correção e diagnóstico apenas no fechamento.

Estado técnico: **backend e interface integrados e publicados antes do aceite da fase**.

## 4. Mapeamento para os 12 critérios originais da Fase 1

1. entrar — coberto tecnicamente;
2. iniciar missão — coberto;
3. concluir etapas — coberto;
4. sair — coberto;
5. voltar — coberto, inclusive recuperação de sessão;
6. progresso preservado — coberto;
7. outra conta bloqueada — coberto;
8. missão real ponta a ponta — coberto tecnicamente e aceito humanamente no fechamento global;
9. expansão sem apagar progresso — coberto por arquitetura/testes;
10. campanha disponível x progresso pessoal — coberto;
11. primeira conquista uma única vez — coberto;
12. conquista em `/conquistas/` sem alterar segurança — coberto.

A clareza e a experiência de uso receberam aceite humano global em 29/09/2026. Falhas reais encontradas depois podem gerar correção sem desfazer silenciosamente o histórico.

## 5. O que o aceite NÃO significa

O encerramento da Fase 1 não significa:
- curso completo;
- Conhecimentos Bancários completo;
- prontidão de prova medida;
- probabilidade de aprovação;
- domínio certificado;
- validação psicométrica das formas A/B.

A cobertura curricular publicada continua limitada ao primeiro bloco do mapa-base.

## 6. Homologação humana concluída

Wellyton declarou em 29/09/2026: **“esta aprovado pode ir para a fase 2”**.

Esse aceite global encerra a Fase 1 e está registrado no documento 51. Não foram inventados resultados item a item para H1–H14. Os cenários H11/H12, dependentes de passagem natural do tempo, continuam observáveis no uso normal e podem gerar correção caso revelem falha real.

## 7. Continuidade após o aceite

1. preservar os checks separados de frontend e Worker;
2. manter a Fase 1 como baseline aceita, sem reescrever progresso;
3. desenvolver a Fase 2 conforme `03-FASE-2-MOTOR-PEDAGOGICO.md`;
4. usar `52-FASE2-CATALOGO-PEDAGOGICO-DECLARATIVO.md` como primeiro recorte ativo;
5. tratar regressões reais da Fase 1 como correções, não como motivo para apagar histórico.

## 8. Norte preservado

A ferramenta continua separando:
- progresso de jogo;
- cobertura;
- desempenho imediato;
- retenção;
- avaliação independente;
- prontidão.

Nenhuma dessas dimensões deve ser usada como atalho para afirmar que o usuário está pronto para a prova sem evidência representativa.
