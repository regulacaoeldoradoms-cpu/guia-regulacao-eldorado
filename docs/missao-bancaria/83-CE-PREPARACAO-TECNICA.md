# Capitais e Câmbio — ativação aprovada e preparação técnica

01/10/2026. Preparo no [#571 integrado](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/pull/571), código validado `f8075c0089c81959f43e14caf7affd0c348b7a54`. Fonte editorial: [#570 integrado](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/pull/570), head `2bbbb0a4da4041c90dd764b65760773ea627baee`. CE-01–11/CE-R tiveram parecer pedagógico independente favorável em `96cdd5b2`; Chefe aprovado independentemente em `2bbbb0a4`, sem correções; contas/esquema/fontes anteriores reaproveitados. Fase 2 sem aceite humano observado, Fase 3 não aberta. Integração #569/#570/#571 e deploy protegido autorizados pelo usuário em 01/10/2026, 01:20 UTC, com os parâmetros abaixo. Autorização não substitui CI nem aceite humano pedagógico.

## Pacote e estado efetivo

O [conversor offline CE](../../worker/scripts/studies-ce-candidate.mjs) reutiliza a estrutura PC e o [conversor de apresentação MP](../../worker/scripts/studies-mp-presentation.mjs). Gera [dados CE](../../worker/studies-content/banking-capital-exchange-v1.js): **13 missões, 135 trechos, 49 exemplos, 108 questões/432 justificativas e 43 registros de fonte identificados por unidade**. Preserva integralmente textos, alternativas, gabaritos, justificativas e fontes; nenhum aviso foi removido da cópia gerada.

A ativação aprovada usa `publication.status: 'published'`, `parametersApproved: true` e sequência 4; as fontes editoriais permanecem draft. Não existe ativação por CLI/ambiente. Manifesto/mapa usam o filtro existente. **Catálogo da candidata ativada: 50 missões/374 questões, quatro blocos disponíveis.** Publicação confirmada no marco abaixo. Snapshot serializado de missões, fontes e planejamento SFN/MP/PC idêntico ao anterior: SHA-256 `bbec004e3e3bc149006b5fb7ee4f7981831f323f07db3f40002b34951ff010f7`, capturado em `2bbbb0a4`.

Roteador, leitor, permissões, armazenamento, A/B, revisão, bindings, detector e compiladores MP/PC não foram alterados. Nenhuma migração, recurso novo, consulta D1 ou acesso produtivo.

## IDs, leitura e parâmetros aprovados

| Ordem candidata | Unidades | Sufixos de `banking.ce.` |
| --- | --- | --- |
| 38–41 | CE-01–04 | instrumentos, acoes, divida, fundos |
| 42–45 | CE-05–08 | riscos, cotacao, operacoes, regimes |
| 46–48 | CE-09–11 | cambio-real, comercio, fluxos |
| 49–50 | CE-R / Chefe | revisao, boss |

Tópico igual ao ID da missão; questões `q.` + ID editorial; fontes prefixadas por unidade. Parâmetros aprovados pelo padrão existente: liberar após Chefe PC, exigir conclusão da unidade anterior, **100 XP por aula/revisão; Chefe 220 XP e 75% (9/12), sem nova conquista**. Estimativa de leitura não controla cronômetro ou conclusão. Sem mudança de limiar, XP ou desbloqueio além do aprovado.

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

Os cenários de migração de catálogo ocorrem somente em memória. SQLite e API Chromium são fixtures, não homologação autenticada nem leitura do histórico do aluno. CI obrigatória e comparação com a base efetiva continuam gates para integração futura; não foram substituídas por estes testes.

## Ativação e integração autorizadas

Revisões editoriais concluídas. O usuário aprovou checkpoint #569, editorial #570 e técnico #571, nessa ordem, e publicação nos parâmetros acima. A ativação altera somente status/parâmetros do pacote e expectativas afetadas dos testes; nenhum texto didático mudou. O relógio SQLite das fixtures MP/PC/CE fica fixo por caso: o código já atualiza `study_profiles.updated_at` a cada acesso autenticado, e a comparação integral não deve depender da virada do segundo. Domínios oficiais CVM/FMI e data de consulta de 01/10 foram adicionados às expectativas de fontes.

Ativação: **49 testes direcionados e seis Chromium CE passaram**; incluem os 18 cenários de roteador dos recortes MP/PC/CE. Sintaxe, artefato gerado, isolamento e diff aprovados. Nenhuma questão foi reescrita; validações editoriais anteriores reaproveitadas.

Integração exige CI da candidata ativada, comparação de base e [deploy protegido](../WORKER-SAFE-DEPLOY.md), com confirmação da versão ativa e smoke mínimo. Preservar SFN/MP/PC; PC-07 excluído. Fase 2 continua sem aceite humano observado. Próximo bloco previsto: `banking.digital-payments`; primeira unidade de canais internet/mobile, sem declarar edital atual nem cobertura integral.

## Publicação confirmada — 01/10/2026

#569 integrado em a5a4f8a0; #570 em f3e3c45b; #571 em **a4e903e66a1fffd3f838c7077cacef45864514ca**. A árvore integrada `95d0483de15901fbc28a5eae899837d2f3ccb524` é idêntica à candidata `f2e29de1`. **24 Actions da ativação e 28 checks pós-merge verdes**, incluindo o raster, sem exceção, alteração de baseline ou threshold.

Build produtivo **9918956a-b991-4ac7-b680-957ffce01f81** aprovado pelo fluxo existente deploy:safe. Worker **f90d08cf-ba75-44bb-ac0a-c3bda196eba3**, deployment **797e421f-b6eb-4ec1-9bb1-7cf50cf3d84c**, confirmado em 100%. Pages **2723dc45-38b8-42c5-849e-83ddf94f66cf** aprovado para o mesmo SHA. Às **01:59 UTC**, quatro arquivos frontend corresponderam aos hashes Git; smoke anônimo: estudos 401, Agenda 403, preflight administrativo 204 e GET 401 com CORS correto. Corpos administrativos não foram consumidos. Nenhuma consulta autenticada ao histórico do aluno; preservação comprovada nas fixtures e CI.

O build documental intermediário de #570 falhou sem substituir a versão do #569; a causa desse build não foi comprovada. A publicação específica de CE concluiu normalmente pelo gate, sem intervenção no pipeline ou acesso adicional. O preview legado da branch continua separado do sucesso produtivo. Autorização de publicação não representa aceite humano da Fase 2.
