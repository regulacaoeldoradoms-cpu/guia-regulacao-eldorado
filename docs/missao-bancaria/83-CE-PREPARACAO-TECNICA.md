# Capitais e Câmbio — preparação técnica desativada

01/10/2026. Fonte editorial: [#570 draft](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/pull/570), head `2bbbb0a4da4041c90dd764b65760773ea627baee`. CE-01–11/CE-R tiveram parecer pedagógico independente favorável em `96cdd5b2`; parecer do Chefe pendente. Fase 2 sem aceite humano observado, Fase 3 não aberta. #569 permanece draft, sem autorização de transição/merge.

## Pacote e estado efetivo

O [conversor offline CE](../../worker/scripts/studies-ce-candidate.mjs) reutiliza a estrutura PC e o [conversor de apresentação MP](../../worker/scripts/studies-mp-presentation.mjs). Gera [dados CE](../../worker/studies-content/banking-capital-exchange-v1.js): **13 missões, 135 trechos, 49 exemplos, 108 questões/432 justificativas e 43 registros de fonte identificados por unidade**. Preserva integralmente textos, alternativas, gabaritos, justificativas e fontes; nenhum aviso foi removido da cópia gerada.

Todas as missões mantêm `publication.status: 'draft'`, `parametersApproved: false` e sequência candidata 4. Não existe ativação por CLI/ambiente. Manifesto/mapa usam o filtro existente; fontes CE não são expostas com o pacote desativado. **Catálogo efetivo: 37 missões/266 questões, três blocos disponíveis.** Snapshot serializado de missões, fontes e planejamento SFN/MP/PC idêntico ao anterior: SHA-256 `bbec004e3e3bc149006b5fb7ee4f7981831f323f07db3f40002b34951ff010f7`, capturado em `2bbbb0a4`.

Roteador, leitor, permissões, armazenamento, A/B, revisão, bindings, detector e compiladores MP/PC não foram alterados. Nenhuma migração, recurso novo, consulta D1 ou acesso produtivo.

## IDs, leitura e parâmetros propostos

| Ordem candidata | Unidades | Sufixos de `banking.ce.` |
| --- | --- | --- |
| 38–41 | CE-01–04 | instrumentos, acoes, divida, fundos |
| 42–45 | CE-05–08 | riscos, cotacao, operacoes, regimes |
| 46–48 | CE-09–11 | cambio-real, comercio, fluxos |
| 49–50 | CE-R / Chefe | revisao, boss |

Tópico igual ao ID da missão; questões `q.` + ID editorial; fontes prefixadas por unidade. Proposta pelo padrão existente: liberar após Chefe PC, exigir conclusão da unidade anterior, **100 XP por aula/revisão; Chefe 220 XP e 75% (9/12), sem nova conquista**. Estimativa de leitura não controla cronômetro ou conclusão. Parâmetros ainda não aprovados para ativação CE.

O texto aprovado contém **28 links de aula** em nove seções, sem tabelas ou diagramas; nenhum formato inventado. Todos foram convertidos à apresentação existente. A única retomada externa é CE-01 → MP-01/capitais, resolvida para `banking.mp.mercados`/`capitais`. Destinos desconhecidos/futuros são recusados. As **249 referências de recuperação** resolvem para seções existentes, sem cobrança futura.

## Verificação proporcional executada

Node 24.17.0; somente recorte afetado:

- Chefe: 12 itens/48 justificativas, seis grupos, **32 contas**, recuperação, UTF-8 e MD/MJS aprovados. Enunciados distintos dos 96 anteriores; essas questões não foram revalidadas.
- **5 testes do candidato:** catálogo serializado preservado, fidelidade da conversão, entradas/referências inválidas rejeitadas, artefato reproduzível, links e recuperação.
- **6 cenários do roteador real em SQLite local:** manifesto/mapa com ativação apenas sintética; draft inacessível; anônimo/outro usuário/origem inválida recusados antes de persistência; sequência após PC; feedback pós-resposta; repetição/retomada; preservação de todas as tabelas study_*, XP/tentativas/conquistas/revisões, avaliação A e sessão PC interrompida; Chefe recusa 8/12, aceita 9/12 e concede XP uma vez.
- **35 regressões aplicáveis:** currículo, publicação, ensino, feedback e isolamento. Nenhuma ampliação das seis exceções editoriais exatas PC.
- **6 cenários Chromium CE:** consulta das aulas/revisão e link CE→MP com fonte ampliada em 320px claro/390px escuro; reenvio após perda de resposta; resposta pendente durante consulta/saída; retomada sem nova sessão; exclusividade de `wellyton`. Dois testes inicialmente usavam atributo DOM inexistente: corrigidos para clicar o link real e conferir a seção, sem alterar aplicativo ou tolerâncias. Só esses dois foram repetidos; quatro resultados inalterados reaproveitados.
- Sintaxe dos novos módulos/manifesto/mapa, `--check-generated`, detector e diff aprovados.

Comandos: `node docs/missao-bancaria/rascunhos/validate-mp01.mjs --unit=cechefe`; `node worker/scripts/studies-ce-candidate.mjs --check-generated`; `node --test worker/tests/studies-ce-candidate.test.mjs`; testes `studies-{curriculum,publication,teaching,question-feedback,isolation}.test.mjs`; `node worker/scripts/check-studies-isolation.mjs`; Playwright com `testing/browser/studies-reader.config.mjs`, filtro `studies-ce.spec.mjs` (reexecução restrita a `retomadas CE e MP`).

Ativação simulada ocorre somente em memória. SQLite e API Chromium são fixtures, não homologação autenticada nem leitura do histórico do aluno. CI obrigatória e comparação com a base efetiva continuam gates para integração futura; não foram substituídas por estes testes.

## Próxima decisão agrupada

Receber revisão independente do Chefe; corrigir só pontos afetados se houver. Agrupar checkpoint #569, editorial #570 e PR técnico baseado nele, com números exatos, para autorização específica de integração e ativação/publicação CE nos parâmetros acima. Nenhum merge, transição de #569 ou deploy realizado. Eventual publicação deve seguir [deploy protegido](../WORKER-SAFE-DEPLOY.md), CI da árvore final e smoke mínimo, preservando SFN/MP/PC. PC-07 excluído; não declarar cobertura integral de edital ou produto.
