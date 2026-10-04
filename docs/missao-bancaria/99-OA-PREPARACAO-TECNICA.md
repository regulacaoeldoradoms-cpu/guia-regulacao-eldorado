# Acentuação — preparo técnico desativado

04/10/2026. [Lote 98](98-OA-LOTE-REVISAO-E-CHEFE.md): quatro aulas, revisão e Chefe, **52 questões/208 justificativas**, 16 seções de exemplos e cinco consultas de retomada. Parecer pedagógico independente dos seis Markdown concluído em **a94119958b4b0a433c6421c479413d117fae4dee**, sem correções necessárias. Não equivale a aceite humano ou autorização de publicação; human-review-pending conserva o gate de liberação.

## Adaptação mínima

Compilador studies-oa-candidate.mjs reaproveita o pipeline PT e gera portuguese-accentuation-v1.js: seis missões draft, parametersApproved:false, ordens propostas 86–91 após Chefe PT e sequência por conclusão anterior. 100 XP/aula/revisão e Chefe 220 XP/75% somente propostos, sem conquista nova. Manifesto e mapa portuguese.spelling filtram publicação; não existe opção CLI/ambiente de ativação. A dependência IS→LP da cadeia anterior permanece pendente de decisão, conforme [93](93-LP-PREPARACAO-TECNICA.md).

Cinco links convertidos em consultas ao ensino existente. Textos, alternativas, gabaritos, justificativas e recuperação preservados. Seis referências identificadas por unidade apontam à fonte primária do Acordo Ortográfico, Anexo I do Decreto 6.583/2008, com locator e consulta em 04/10/2026; frases/exercícios continuam autorais. Não inventada proveniência normativa para frases.

## Evidências executadas

- Esquema, fontes/data/locator, IDs, gabaritos, quatro justificativas/item, origem, recuperação, UTF-8, links e sincronia de OA-02/03/04/R/Chefe; OA-01 já validado, sem repetição de auditoria. Primeiras renderizações identificaram links a Markdown ainda não gerados; após gerar o lote, todos passaram. Confirmados 52 IDs/enunciados únicos e explicação igual à justificativa correta. Após o parecer, somente cabeçalhos editoriais dos seis formatos atualizados e sincronizados; corpo aprovado inalterado.
- **Nove testes OA**, incluindo **seis cenários de roteador real/SQLite em memória**: exclusão de drafts; fonte primária; artefato preservado; ensino/prontidão não medida; 401/403/origem negados antes da persistência; draft inacessível; sequência; feedback só após resposta; duplicação/retomada; preservação integral de study_*, XP, tentativas, conquista SFN, revisão, avaliação A e sessão interrompida dos blocos anteriores; recuperação externa; Chefe 8/12 rejeitado, 9/12 aceito e XP único. Negativos cobrem conteúdo incompleto, duplicado, ativado indevidamente, fonte/recuperação desconhecida e recuperação futura.
- **Seis Chromium OA, 6/6 em 9,4 s**: cinco consultas com fonte ampliada em 320 px claro/390 px escuro sem overflow; seleção preservada após consulta/rede/retry e resposta única; resposta pendente durante consulta/saída; retomada de questão respondida sem nova sessão; usuário diferente de wellyton bloqueado. HTTP totalmente interceptado, sem API real/D1.
- Artefato gerado, sintaxe e diff conferidos. Catálogo/fontes ativos serializados idênticos ao controle anterior: **50 missões/374 questões/quatro blocos reais**. Projeção de 91 missões/nove blocos inclui DP/IS/LP/PT/OA somente nas fixtures, sem disponibilidade no produto.

Comandos: node --test worker/tests/studies-oa-candidate.test.mjs; node worker/scripts/studies-oa-candidate.mjs --check-generated; somente studies-oa.spec.mjs com studies-reader.config.mjs. Testes anteriores LP/PT/IS/DP/CE válidos nos fluxos inalterados reaproveitados. Sem suíte geral, produção ou histórico real do aluno; fixtures não são homologação autenticada, retenção ou aceite humano.

## Pendências e próxima ação

Tudo **local e desativado**, sem push/PR, ativação, merge ou deploy. Cadeia deriva de DP #572/IS #600, não da main atual: reconciliar commits concorrentes e contratos preparados em #598 antes de integração autorizada; não reaberto diagnóstico de gates/preview, nem alterada IA clínica.

Próximo recorte de autoria: ortografia de letras já prevista no bloco, especificando sequência introdutória curta antes dos exercícios. Hífen e demais regras continuam pendentes; acentuação introdutória não é toda ortografia. Fase 2 sem aceite humano pedagógico observado; fases seguintes não abertas.
