# PC-01A — pessoas antes de contas

30/09/2026. Fase 2 ativa, aceite humano não observado; Fase 3 não aberta. Rascunho isolado, sem alteração do catálogo ou do progresso do aluno. A decisão sobre ativar #563/#564 tem prioridade sobre prolongar a autoria PC.

A [aula com prática comentada](rascunhos/pc-01a-v1.md) tem como fonte única [pc-01a-v1.mjs](rascunhos/pc-01a-v1.mjs). Reaproveita a unidade **PC-01A — Pessoas, capacidade e representação** do [plano 66 em 400d4854, #559](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/blob/400d48545710c1ec0b3a9628bd37813d065dac00/docs/missao-bancaria/66-ESPECIFICACAO-PROXIMOS-BLOCOS-BANCARIOS.md), sem integrar aquela PR nem reauditar o mapa. Bloco candidato: `banking.products-credit`; IDs apenas locais: `draft.pc01a` e `pc01a.q01`–`q08`.

## Ensino e rastreabilidade

Entrega: 14 trechos, cinco exemplos resolvidos, oito questões e 32 justificativas de alternativas; três propostas de recordação/recuperação. Explicações precedem a prática. A associação histórica é ao recorte do item 37 do Anexo IV/TBN da CAIXA 2024/NM; não declara o item coberto por inteiro. BB 2022/001 permanece apoio didático sem correspondência nominal atribuída. Não é escolha de novo edital vigente.

| Objetivo | Ensino e exemplo | Prática e recuperação |
| --- | --- | --- |
| O1: pessoas física/jurídica | `pessoas`, `exemplo-pessoas` | q01 |
| O2: direitos/exercício, idade e exceções | `capacidade`, `exemplo-idades`, `excecoes`, `exemplo-excecoes` | q02–04, q08 |
| O3: representação, assistência e poderes | `capacidade`, `representacao`, `exemplo-poderes` | q01–02, q05–06 |
| O4: domicílio pertinente à relação | `domicilio`, `exemplo-domicilio` | q07–08 |
| O5: dados insuficientes | `excecoes`, `representacao`, `documentos` | q04–06 |
| O6: corrigir o raciocínio após erro | `resumo`, recordação e referências por questão | reler, explicar o erro e reconstruir o caso |

Casos inteiramente fictícios, sem identificação pessoal. Documentos são ensinados como elementos para verificar identidade e poderes, sem inventar lista bancária. A conta e suas exigências são PC-01, unidade seguinte já prevista.

## Conferência de autoria e limites

Fontes primárias consultadas em **30/09/2026**: [Código Civil compilado](https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm), arts. 1º–5º, 45/47/49-A, 70–76, 115/116/118, 653/654/657/661, 1.634 VII e 1.635 II/III; [Lei Brasileira de Inclusão](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm), arts. 6º/84/85. Quatro entradas de fonte organizam esses dois textos por assunto; não representam quatro normas diferentes.

Conferidos pelo autor os limites de 16/18 anos completos, emancipação informada nos casos, ausência de incapacidade automática por deficiência, diferença entre representação/assistência, poderes limitados e domicílio ligado à relação. Gabaritos: B, D, A, C, A, D, B, C. Não há cálculos novos. As alternativas incorretas são corrigidas com a regra ensinada, sem introduzir regra bancária ou matéria inédita no feedback.

Não abrange todos os casos de incapacidade, emancipação, curatela, tutela, responsabilidade, mandato ou domicílio. Não decide situação jurídica real, não esgota o edital histórico, não substitui avaliação independente nem demonstra aprendizagem. Revisão independente e clareza humana pendentes; nenhuma publicação autorizada para PC.

## Verificação direcionada

`node docs/missao-bancaria/rascunhos/validate-mp01.mjs --unit=pc01a --render` gera a leitura; sem `--render`, confere igualdade. Reutiliza o validador existente, com apenas seleção de unidade/bloco/documento adicionada. Verifica IDs, ensino, respostas, justificativas, objetivos, recuperação, fontes, UTF-8, links e exclusão do draft pelo filtro real de publicação. Nenhuma importação no manifesto.

Testes do aplicativo/MP anteriores continuam válidos para seu escopo inalterado e não foram repetidos. Sem Chromium, produção ou D1 nesta entrega editorial. Próxima ação: priorizar decisão MP; enquanto pendente, encaminhar revisão pontual desta aula e preparar PC-01 conforme plano, com fontes bancárias próprias.
