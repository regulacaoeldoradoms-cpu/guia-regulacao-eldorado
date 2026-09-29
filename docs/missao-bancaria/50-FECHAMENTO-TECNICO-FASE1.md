# MISSÃO BANCÁRIA — FECHAMENTO TÉCNICO CANDIDATO DA FASE 1

Data: 29/09/2026.  
Estado: **candidata a homologação humana; Fase 1 ainda não aceita**.  
Dependência imediata: comprovação da publicação produtiva do Worker e, depois, homologação humana.

## 1. O que este documento significa

Este registro não encerra a Fase 1 por conta própria.

Ele consolida que o motor MVP e o primeiro bloco real chegaram ao ponto em que o trabalho restante para o aceite da fase deve ser principalmente:
1. interface independente #541 integrada em `main` (`9e5bebac7713b8ad7540aa31c6878e50e6b7faac`) após CI e auditoria global verdes;
2. frontend confirmado por `Validar site`, `Validar Missao Bancaria` e `pages build and deployment` pós-merge em `success`; Worker produtivo ainda requer comprovação separada;
3. executar o roteiro humano do documento 46;
4. corrigir qualquer falha encontrada;
5. registrar o aceite explícito.

CI verde não substitui a homologação humana.

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

Interface candidata (#541):
- painel de elegibilidade/estado;
- modo próprio sem consulta à aula;
- salvamento individual neutro;
- retomada da forma;
- bloqueio cruzado com sessão de estudo;
- correção e diagnóstico apenas no fechamento.

Estado técnico: **backend integrado; interface aguardando gate final/merge**.

## 4. Mapeamento para os 12 critérios originais da Fase 1

1. entrar — coberto tecnicamente;
2. iniciar missão — coberto;
3. concluir etapas — coberto;
4. sair — coberto;
5. voltar — coberto, inclusive recuperação de sessão;
6. progresso preservado — coberto;
7. outra conta bloqueada — coberto;
8. missão real ponta a ponta — produto suporta; confirmação humana pendente;
9. expansão sem apagar progresso — coberto por arquitetura/testes;
10. campanha disponível x progresso pessoal — coberto;
11. primeira conquista uma única vez — coberto;
12. conquista em `/conquistas/` sem alterar segurança — coberto.

Os itens 8 e a clareza dos demais continuam sujeitos ao roteiro humano.

## 5. O que NÃO está sendo declarado

Este fechamento técnico não significa:
- Fase 1 homologada;
- curso completo;
- Conhecimentos Bancários completo;
- prontidão de prova medida;
- probabilidade de aprovação;
- domínio certificado;
- validação psicométrica das formas A/B.

A cobertura curricular publicada continua limitada ao primeiro bloco do mapa-base.

## 6. Homologação humana obrigatória

Usar `46-ROTEIRO-HOMOLOGACAO-FASE1.md`.

Para aceite:
- H1–H10 e H13–H14 precisam ser aprovados;
- H11/H12 podem permanecer pendentes somente por dependência temporal natural e sem evidência de falha;
- qualquer problema que impeça estudar uma missão real ponta a ponta reabre correção técnica;
- o resultado deve ser registrado no STATUS.

## 7. Ordem segura a partir daqui

1. manter registrado que #541 está integrada e Pages está publicada;
2. resolver ou comprovar a publicação produtiva do Worker, sem tratar a presença do código em `main` como deploy;
3. executar homologação humana da Fase 1;
4. corrigir falhas, se houver;
5. obter aceite explícito;
6. **só então** abrir formalmente a Fase 2.

## 8. Norte preservado

A ferramenta continua separando:
- progresso de jogo;
- cobertura;
- desempenho imediato;
- retenção;
- avaliação independente;
- prontidão.

Nenhuma dessas dimensões deve ser usada como atalho para afirmar que o usuário está pronto para a prova sem evidência representativa.
