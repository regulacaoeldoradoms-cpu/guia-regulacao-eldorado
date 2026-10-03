# Português - lote introdutório de leitura

03/10/2026. Recorte do [plano 91](91-LP-LEITURA-PRIMEIRO-RASCUNHO.md), baseado na prioridade do [plano 05](05-FASE-4-PORTUGUES-MATEMATICA.md) e bloco `portuguese.reading` existente. Perfis BB 2022/001 e CAIXA 2024/NM históricos/referenceOnly; sem edital vigente ou abertura formal de fase.

| Unidade | Competência e pré-requisito | Artefato |
| --- | --- | --- |
| LP-01 | Explícito, inferência apoiada e limite; leitura iniciante | [Texto](rascunhos/lp-01-v1.md) |
| LP-02 | Contexto, paráfrase, modalidade e alcance; LP-01 | [Texto](rascunhos/lp-02-v1.md) |
| LP-03 | Assunto, posição, razão, ressalva e atribuição; LP-01/02 | [Texto](rascunhos/lp-03-v1.md) |
| LP-R | Oito itens cumulativos novos com origens nas três aulas | [Revisão](rascunhos/lp-r-v1.md) |
| LP-CHEFE | Doze itens próprios, seis grupos com retomada | [Chefe](rascunhos/lp-chefe-v1.md) |

**44 questões/176 justificativas** no conjunto. As aulas incluem ensino iniciante, três exemplos resolvidos cada e recuperação por item. Revisão tem três exemplos novos; Chefe tem retomada, exemplo contextual e links às aulas/revisão. Seis grupos do Chefe: explícito; inferência/limite; contexto; paráfrase/alcance; posição/prioridade; razão/atribuição. Não copiam enunciados anteriores nem constituem formas de avaliação independente.

Todos os textos, frases e exercícios são autorais/fictícios, sem citações de terceiros, procedimentos reais, dados de alunos ou normas mutáveis. `SOURCES=[]` declara essa origem, em vez de atribuir textos inventados a uma instituição. Correspondência preliminar ao mapa não representa rastreabilidade item/subitem final nem cobertura completa de interpretação, argumentação ou Português. Não criar uma nova arquitetura ou disciplina a partir deste recorte.

IDs estáveis `draft.lp01/02/03/lpr/lpchefe`; questões prefixadas por unidade. Artefatos draft com `human-review-pending`, sem XP, ordem, importação no runtime ou ativação. Parecer pedagógico independente pendente; conferência do autor não o substitui. Revisão e Chefe usam `originRefs` e cobertura verificável, no padrão existente.

Validação proporcional: `node docs/missao-bancaria/rascunhos/validate-mp01.mjs --unit=lp02 --render`, repetir LP-03/R/Chefe e conferir sem render. Verificar esquema, gabaritos/quatro justificativas, objetivos, origens, recuperação, UTF-8, links, sincronia e exclusão do catálogo. LP-02/03/R/Chefe passaram a conferência final sem render. As primeiras gerações apontaram Markdown cruzados ainda ausentes; após gerar as quatro unidades, os links foram confirmados. Conferidos 44 IDs únicos e Chefe com 12 enunciados próprios, gabaritos A/B/C/D com três ocorrências cada. Leitura direcionada pelo autor não identificou correção relevante; parecer independente ainda pendente. Não repetir Institucional ou suítes aplicativo por autoria local. Nenhuma API real, produção ou D1.

Próxima etapa: parecer independente agrupado desse recorte; preparar tecnicamente somente desativado após o parecer. Os assuntos seguintes do plano 05 (organização textual, coesão/coerência e depois gramática aplicada) permanecem planejados; não declarar este lote como conclusão do bloco inteiro. Institucional enviado separadamente no PR draft #600, ainda desativado, sem autorização de merge/deploy. Português permanece somente na branch local `docs/missao-portugues-leitura-local`.
