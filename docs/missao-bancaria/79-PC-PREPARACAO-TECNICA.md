# PC — preparação técnica desativada

30/09/2026. Código/testes: `0e3e320484457b20180e3cd387b1e48068d1772b`. Fonte editorial: [#565 draft](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/pull/565), `4deec466c22669e6d187282c9f0cfff615e223f9`. Base main conferida: `0c615195d604baf8ac60f0dcf366597d5486280a`. Fase 2 ativa; aceite humano pedagógico não observado e Fase 3 não aberta. Não houve ativação, merge ou deploy de PC.

## Pacote preparado

Quinze aulas PC-01A/01–06/08–10/11A–E, revisão e Chefe: **17 missões, 208 trechos, 144 questões e 576 justificativas**. [Mapa editorial](77-PC-CONJUNTO-COMUM-RASCUNHOS.md) e [revisão/Chefe](78-PC-REVISAO-E-PROPOSTA-CHEFE.md) definem o recorte. Não representa cobertura integral de produtos, edital ou prontidão.

O [conversor offline](../../worker/scripts/studies-pc-candidate.mjs) gera [dados do Worker](../../worker/studies-content/banking-products-credit-v1.js), sem duplicar a autoria. Todas as entradas têm `publication.status: draft`; manifesto, fontes, planejamento e mapa continuam excluindo PC. Comparação serializada antes/depois confirmou o catálogo ativo idêntico: **20 missões/122 questões, dois dos 43 blocos disponíveis**.

- IDs `banking.pc.*`, tópicos iguais aos IDs candidatos, questões `q.` + ID editorial e fontes com prefixo por unidade. Nenhum ID SFN/MP renomeado.
- Ordem preparada 21–37: PC-01A após Chefe MP, demais unidades após conclusão anterior. Defaults existentes: 100 XP/aula/revisão; Chefe 220 XP/75% (9/12), sem medalha nova. `parametersApproved: false`; são parâmetros preparados, não ativação autorizada por este documento.
- Textos, exemplos, alternativas, gabaritos, justificativas, fontes e avisos de rascunho preservados integralmente. A precisão da questão 9 do Chefe explicita **conta de poupança aberta em 2011**, sem alterar resposta C ou cálculos.
- O mesmo conversor de apresentação MP prepara **três tabelas e 68 links de aula**. Não existem diagramas no material aprovado; não foram inventados. São 320 referências de recuperação nas questões, todas resolvíveis e sem cobrança futura.
- Leitor, autenticação, roteador, armazenamento, revisões e avaliação A/B não foram alterados. Nenhuma migração, novo binding, consulta D1 ou acesso à produção.

| Ordem | Unidades | Sufixos de `banking.pc.` |
| --- | --- | --- |
| 21–24 | PC-01A, 01, 02, 03 | pessoas, contas, credito, cartoes |
| 25–27 | PC-04, 05, 06 | custos, empresas-consumo, rural |
| 28–30 | PC-08, 09, 10 | garantias-pessoais, garantias-reais, acompanhamento |
| 31–35 | PC-11A–E | poupanca, capitalizacao, previdencia, seguros, consorcio |
| 36–37 | PC-R, Chefe | revisao, boss |

## Verificação proporcional

Node 24.17.0; testes válidos para o código acima, reaproveitáveis após alterações somente documentais:

- **Sete verificações Node PC**, uma das quais executa **seis cenários de roteador/catálogo reais em SQLite local**. Conversão determinística sem mutação, preservação editorial, IDs/fontes/links, exclusão de drafts, rejeição de pacote incompleto, publicação inválida, fonte desconhecida, questão duplicada e conteúdo futuro.
- Simulação isolada de publicação carrega manifesto/mapa reais: 37 missões, três blocos disponíveis e apenas SFN/MP concluídos; prontidão não medida. A simulação não muda o artefato draft nem declara cobertura integral do bloco PC.
- Autorização anônima/outro usuário/origem recusada antes de criar tabelas; sequência recusa PC sem Chefe MP concluído. Bootstrap não revela gabaritos. Tentativa duplicada/retomada, recuperação PC-R e Chefe com 8/12 recusado, 9/12 aprovado e XP concedido uma única vez.
- Adição simulada preserva todas as linhas `study_*`, progresso/XP/tentativas/conquistas/revisões, avaliação A concluída e sessão MP interrompida.
- **19 regressões existentes** de currículo, publicação e ensino passaram, pois esses pontos importam o catálogo alterado.
- **Sete Chromium PC** passaram: três tabelas com fonte ampliada em 320 px claro, 390 px escuro e desktop; links de consulta, repetição, resposta perdida/reenvio, resposta pendente durante consulta, saída/reabertura, retomada e exclusividade de wellyton. Nenhum acesso de rede fora da fixture local.
- Artefato gerado, sintaxe e diff conferidos. Suites integrais e revisão editorial de conteúdo inalterado não foram repetidas; evidências MP/SFN e revisão independente PC continuam válidas no escopo preservado.

```text
node worker/scripts/studies-pc-candidate.mjs --check-generated
node --test worker/tests/studies-pc-candidate.test.mjs
node --test worker/tests/studies-curriculum.test.mjs worker/tests/studies-publication.test.mjs worker/tests/studies-teaching.test.mjs
node testing/browser/node_modules/@playwright/test/cli.js test --config=testing/browser/studies-reader.config.mjs studies-pc.spec.mjs
```

SQLite e API Chromium são sintéticos. Esses resultados não são homologação autenticada de produção, revisão normativa integral ou aceite humano. O [PR técnico #568](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/pull/568) é draft sobre #565; CI obrigatória na base/SHA efetivos permanece gate de integração.

## Bloqueio específico da CI

No head `a540ffe945a21e9338b69d5d9c13be41dba900e1`, [678 testes Worker passaram](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/actions/runs/36788708193/job/110136209201), além de sintaxe/frontend. O passo seguinte usa uma expressão textual ampla em `.github/workflows/validate-missao-bancaria.yml` e rejeita seis ocorrências legítimas:

- PC-01A: aviso de exemplos sem CPF; não presumir incapacidade a partir de diagnóstico; não emitir diagnóstico jurídico de pessoa real.
- PC-10: distinguir recuperação de crédito de diagnóstico de aprendizagem.
- Chefe: título de recuperação e ressalva de que os grupos não são diagnóstico automático por conceito.

O erro é o detector de termos, sem falha nos testes Worker. Chromium da CI foi suspenso por dependência; sete Chromium locais passaram. Conteúdo revisado não foi reescrito para ocultar palavras, nem o gate desativado/relaxado. Recomenda-se decidir uma correção contextual restrita do detector com testes negativos de isolamento, antes de seguir para ativação. Preview Worker legado continua separado; não foi investigado novamente.

## Próxima ação e limites

Revisar a entrega agrupada de autoria + preparação e encaminhar a ativação do núcleo comum com os defaults acima pelo fluxo autorizado. Antes de publicar: retirar somente avisos de status que se tornarem desatualizados na cópia gerada, ativar metadados explicitamente, verificar regressões afetadas e CI, integrar em ordem e usar [deploy seguro](../WORKER-SAFE-DEPLOY.md), com confirmação das versões e smoke mínimo. Nenhuma dessas operações foi executada neste preparo.

**PC-07 é crédito habitacional.** Falta correspondência nominal/profundidade no edital efetivamente adotado para decidir requisito ou complemento identificado. Sistemas, fundos e programas exigiriam fontes próprias. Continua fora do catálogo, revisão e Chefe, sem bloquear o núcleo comum. Não presumir essa inclusão ou o aceite humano da Fase 2.
