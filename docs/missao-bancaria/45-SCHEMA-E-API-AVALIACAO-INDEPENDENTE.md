# MISSÃO BANCÁRIA — SCHEMA E API DA AVALIAÇÃO INDEPENDENTE — PROPOSTA V1

Data: 29/09/2026.  
Estado: **proposta técnica; sem código de produção nesta entrega**.  
Dependências: `41-AVALIACAO-INDEPENDENTE.md` e `44-BANCO-AUTORAL-AVALIACAO-INDEPENDENTE-RASCUNHO.md`.

## 1. Decisão de arquitetura

A avaliação independente não reutiliza `study_rounds.mode`.

Motivo: o schema atual limita `mode` a `lesson/boss/review`. Alterar esse CHECK para encaixar avaliação independente aumentaria o risco de regressão em rodadas já estáveis.

A proposta usa tabelas próprias e aditivas:
- `study_assessment_rounds`;
- `study_assessment_answers`.

Nenhuma tabela atual precisa ser reconstruída.

## 2. Tabela de rodadas

Proposta:

```sql
CREATE TABLE IF NOT EXISTS study_assessment_rounds (
  assessment_id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  block_id TEXT NOT NULL,
  form_id TEXT NOT NULL CHECK(form_id IN ('A','B')),
  assessment_version INTEGER NOT NULL,
  content_version INTEGER NOT NULL,
  question_ids TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK(status IN ('active','completed','invalidated')),
  started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TEXT,
  score REAL
);
```

Índices:

```sql
CREATE INDEX IF NOT EXISTS idx_study_assessment_user_block
  ON study_assessment_rounds(username, block_id, started_at);

CREATE INDEX IF NOT EXISTS idx_study_assessment_user_status
  ON study_assessment_rounds(username, status);
```

### Regras

- `question_ids` é JSON congelado no início da rodada.
- A ordem pode ser embaralhada no servidor, mas depois fica imutável.
- `score` só é preenchido no fechamento.
- `invalidated` preserva histórico quando uma rodada ativa se torna incompatível com nova versão editorial.
- Rodada concluída nunca é apagada por atualização de conteúdo.

## 3. Tabela de respostas

```sql
CREATE TABLE IF NOT EXISTS study_assessment_answers (
  assessment_id TEXT NOT NULL
    REFERENCES study_assessment_rounds(assessment_id),
  question_id TEXT NOT NULL,
  selected_option INTEGER NOT NULL,
  correct INTEGER NOT NULL CHECK(correct IN (0,1)),
  answered_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (assessment_id, question_id)
);
```

O `correct` fica no banco para cálculo e auditoria, mas **não é retornado ao cliente durante a rodada**.

## 4. Elegibilidade

### Forma A

Só pode iniciar quando:
1. o usuário é `wellyton`;
2. o bloco é `banking.sfn-foundation`;
3. as oito aulas e o Chefe estão concluídos;
4. não existe Forma A concluída na mesma versão;
5. não existe rodada independente ativa compatível.

### Forma B

Além das condições anteriores:
1. a Forma A precisa estar concluída;
2. `started_at` da B precisa ser pelo menos sete dias depois de `completed_at` da A;
3. a Forma B não pode reutilizar IDs da Forma A;
4. não pode existir Forma B concluída na mesma versão.

O intervalo é regra de elegibilidade, não garantia de retenção.

## 5. Endpoints propostos

### GET `/api/studies/assessments/banking.sfn-foundation`

Retorna somente estado:
- `availableForm`: `A`, `B` ou `null`;
- `nextEligibleAt`;
- resumo de rodadas concluídas;
- rodada ativa resumível, se existir.

Não retorna banco de questões.

### POST `/api/studies/assessments/banking.sfn-foundation/start`

Servidor:
1. revalida elegibilidade;
2. escolhe a forma;
3. congela IDs;
4. grava rodada;
5. retorna apenas prompt/opções dos 16 itens.

Resposta não contém:
- `answer`;
- `correct`;
- explicação;
- banco não sorteado.

### POST `/api/studies/assessments/:assessmentId/answers`

Payload:
```json
{
  "questionId": "eval.sfn.a01",
  "selectedOption": 1
}
```

Comportamento:
- valida usuário, rodada, versão e pertencimento do item;
- primeira gravação é aceita;
- repetição com a mesma alternativa é idempotente;
- repetição com alternativa diferente retorna conflito;
- resposta HTTP durante a rodada informa somente `recorded` e IDs necessários para reconciliação;
- **não informa se acertou**.

### POST `/api/studies/assessments/:assessmentId/complete`

Só fecha quando todos os 16 itens possuem resposta.

Depois do fechamento pode retornar:
- score bruto;
- total/acertos;
- diagnóstico por competência;
- itens com resposta do usuário, correta e explicação;
- aulas/trechos recomendados para revisão.

Não concede XP por participação e não altera `readiness` automaticamente.

## 6. Idempotência

### Início

Se houver rodada ativa compatível, o endpoint de início devolve a mesma rodada em vez de criar outra.

### Resposta

Chave primária `(assessment_id, question_id)` impede duplicação.

- mesmo payload repetido: sucesso idempotente;
- alternativa diferente para item já respondido: HTTP 409.

### Fechamento

Se a rodada já estiver `completed`, retorna o resultado persistido sem recalcular histórico.

## 7. Isolamento do treino

O módulo do banco independente deverá ficar separado do manifesto comum.

Proposta de arquivos futuros:
- `worker/studies-assessment-content/sfn-foundation-v1.js`;
- `worker/study-assessments.js`.

O `manifest.js` das missões comuns **não importa** esse banco.

O bootstrap normal pode retornar apenas o estado da avaliação, nunca os itens não iniciados.

## 8. Versionamento

Constantes propostas:
- `ASSESSMENT_VERSION = 1`;
- `BLOCK_CONTENT_VERSION` derivada explicitamente da versão pedagógica do bloco.

Se uma rodada ativa foi criada com versão incompatível:
- marcar como `invalidated`;
- não apagá-la;
- não contar score;
- permitir iniciar nova rodada da forma aplicável.

Rodadas concluídas preservam versão e resultado histórico.

## 9. Diagnóstico por competência

Cada item precisa carregar metadados editoriais:
- `primaryLessonId`;
- `teaches`;
- `competencyIds`;
- `sourceIds`.

Após o fechamento, erros são agrupados por competência e ligados à aula/trecho.

Não criar “domínio 73%” a partir desse agrupamento.

## 10. Segurança e privacidade

Mantêm-se os mesmos gates do módulo:
- sessão válida;
- origem autorizada;
- username normalizado exatamente `wellyton`;
- `Cache-Control: no-store`;
- nenhuma informação assistencial;
- nenhuma telemetria pedagógica externa.

## 11. Testes mínimos da implementação futura

1. usuário diferente recebe 403 antes de inicializar schema;
2. bootstrap comum não contém IDs `eval.sfn.*`;
3. GET de estado não vaza questões;
4. Forma A exige Chefe concluído;
5. Forma B exige A + sete dias;
6. A/B não compartilham IDs;
7. início repetido reutiliza rodada ativa;
8. conjunto de IDs fica congelado;
9. resposta duplicada igual é idempotente;
10. resposta duplicada diferente falha;
11. resposta individual não inclui correção;
12. fechamento incompleto falha;
13. fechamento completo fixa score;
14. repetição de fechamento retorna mesmo resultado;
15. atualização de versão invalida apenas rodada ativa incompatível;
16. XP/cobertura/prontidão permanecem inalterados;
17. diagnóstico aponta somente aula já ensinada e fonte cadastrada.

## 12. Próxima etapa

Depois de #512 estar integrada e estável:
1. revisar esta proposta contra o head real da `main`;
2. revisar os 32 itens do documento 44;
3. implementar serviço/schema em branch própria;
4. testar backend antes de criar UI;
5. só então integrar interface da avaliação independente.
