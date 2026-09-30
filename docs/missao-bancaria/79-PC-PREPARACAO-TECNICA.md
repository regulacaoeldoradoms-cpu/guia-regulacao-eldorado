# PC — ativação autorizada e validação

30/09/2026. Ativação e correção contextual do detector aprovadas pelo usuário às 23:16 UTC. Código validado: `30e2787a2bb2d51ee57ae76b781b89a092bc9926`. Fonte editorial `4deec466c22669e6d187282c9f0cfff615e223f9`, [#565 integrado](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/pull/565) em `1b3e74892e425f6dd514cd93b0b81d4da71c7483`. [#568](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/pull/568) contém ativação validada localmente, ainda pendente de CI/integração/publicação. Fase 2 ativa, sem aceite humano pedagógico observado; Fase 3 não aberta.

## Pacote preparado

Quinze aulas PC-01A/01–06/08–10/11A–E, revisão e Chefe: **17 missões, 208 trechos, 144 questões e 576 justificativas**. [Mapa editorial](77-PC-CONJUNTO-COMUM-RASCUNHOS.md) e [revisão/Chefe](78-PC-REVISAO-E-PROPOSTA-CHEFE.md) definem o recorte. Não representa cobertura integral de produtos, edital ou prontidão.

O [conversor offline](../../worker/scripts/studies-pc-candidate.mjs) gera [dados do Worker](../../worker/studies-content/banking-products-credit-v1.js), sem duplicar a autoria. O núcleo autorizado tem `publication.status: published` no candidato: **37 missões/266 questões, três dos 43 blocos disponíveis**. A comparação serializada confirmou as 20 missões/122 questões, fontes e planejamento SFN/MP integralmente preservados. Drafts equivalentes continuam excluídos pelo registro de publicação. Esse estado candidato ainda precisa de integração e deploy para chegar ao usuário.

- IDs `banking.pc.*`, tópicos iguais aos IDs candidatos, questões `q.` + ID editorial e fontes com prefixo por unidade. Nenhum ID SFN/MP renomeado.
- Ordem preparada 21–37: PC-01A após Chefe MP, demais unidades após conclusão anterior. Defaults existentes: 100 XP/aula/revisão; Chefe 220 XP/75% (9/12), sem medalha nova. `parametersApproved: true`, conforme aprovação específica de publicação.
- Ensino, exemplos, alternativas, gabaritos, justificativas e fontes preservados. Somente quatro avisos editoriais de status foram ajustados na cópia publicada, discriminados abaixo; os rascunhos originais permanecem intactos. A precisão da questão 9 do Chefe explicita **conta de poupança aberta em 2011**, sem alterar resposta C ou cálculos.
- O mesmo conversor de apresentação MP prepara **três tabelas e 68 links de aula**. Não existem diagramas no material aprovado; não foram inventados. São 320 referências de recuperação nas questões, todas resolvíveis e sem cobrança futura.
- Leitor, autenticação, roteador, armazenamento, revisões e avaliação A/B não foram alterados. Nenhuma migração, novo binding, consulta D1 ou acesso à produção.

| Ordem | Unidades | Sufixos de `banking.pc.` |
| --- | --- | --- |
| 21–24 | PC-01A, 01, 02, 03 | pessoas, contas, credito, cartoes |
| 25–27 | PC-04, 05, 06 | custos, empresas-consumo, rural |
| 28–30 | PC-08, 09, 10 | garantias-pessoais, garantias-reais, acompanhamento |
| 31–35 | PC-11A–E | poupanca, capitalizacao, previdencia, seguros, consorcio |
| 36–37 | PC-R, Chefe | revisao, boss |

## Verificação da ativação

Node 24.17.0: sintaxe Worker aprovada e **691 testes Worker passaram**, zero falhas/skip. Incluem os 13 testes do detector, sete verificações PC e cenários do roteador real com SQLite. **14 Chromium PC/MP passaram**: tabelas/figuras em celular e desktop, temas claro/escuro, consulta repetida, perda/reenvio de resposta, resposta pendente durante consulta, saída/reabertura, retomada e exclusividade.

A adição preserva todas as linhas study_*, XP/tentativas/conquistas/revisões, avaliação A concluída e sessão MP interrompida. Sequência exige Chefe MP; Chefe PC recusa 8/12 e aprova 9/12, concede 220 XP uma vez e não concede medalha SFN. Bootstrap não revela respostas; acesso anônimo/outro usuário/origem inválida continuam recusados. Readiness permanece não medido. Compiladores consideram somente missões anteriores ao respectivo bloco, permitindo regenerar MP sem tratar PC posterior como pré-requisito. Ambos os artefatos gerados foram conferidos.

SQLite e API Chromium são sintéticos: não houve consulta D1/produção nem homologação autenticada. Suítes anteriores inalteradas e revisão independente do conteúdo são reutilizadas; CI obrigatória na base/SHA efetivos continua gate de integração. Checkpoints/documentação posteriores ao código validado não exigem repetição manual.

Avisos de status ajustados somente na cópia gerada:

1. PC-R/inicio: retirada “Elas e esta revisão ainda são rascunhos, disponíveis aqui para revisão editorial, fora do aplicativo.”
2. Chefe/preparacao: retirada “Os materiais PC permanecem rascunhos, acessíveis nestes documentos e fora do catálogo.”
3. Chefe/recuperacao: “mas ficam expostos nesta prévia;” passa a “mas ficam expostos nesta prática;”.
4. Chefe/recuperacao: retirada “Nenhuma regra de XP, limiar, publicação, desbloqueio ou revisão adaptativa foi criada neste rascunho.”

## Correção restrita do detector de isolamento

A CI anterior passou 678 testes Worker, mas seu grep confundia seis usos didáticos legítimos de CPF/diagnóstico com conteúdo assistencial. A correção específica foi aprovada às 23:16 UTC, junto da publicação PC, preservando os padrões e o escopo do gate. O workflow usa agora um comando Node obrigatório; permissões e dependência do Chromium são mantidas.

As seis ocorrências abaixo são identificadas pelo arquivo gerado PC, missão, seção/campo, hash SHA-256 do valor completo e ocorrência única desse valor. O arquivo precisa conservar o formato de módulo JSON gerado; não é importado ou executado pelo detector. Somente o termo dentro de cada valor exato é aceito. Texto alterado, movido ou duplicado perde esse reconhecimento. O padrão de dependências nunca recebe contexto permitido. Limites de palavras ASCII são conservadores quando vizinhos de Unicode.

| Local exato | Trecho literal que contém o termo |
| --- | --- |
| PC-01A / perguntas / body | Os exemplos são fictícios, sem CPF, número de conta ou documento pessoal. |
| PC-01A / excecoes / body | Isso não permite deduzir incapacidade a partir de aparência, diagnóstico ou deficiência. |
| PC-01A / resumo / body | As perguntas seguintes são prática exposta da aula, não avaliação independente, diagnóstico jurídico de alguém real ou comprovação de retenção duradoura. |
| PC-10 / glossario / body | Recuperação: busca de regularização/recebimento, sem confusão com o diagnóstico de aprendizagem do aluno. |
| Chefe / recuperacao / heading | 5. Corrigir o raciocínio sem transformar prática em diagnóstico |
| Chefe / recall[2] | Não trate os grupos do Chefe como diagnóstico automático por conceito nem como forma independente de avaliação. |

**13 testes locais passaram** em Node 24.17.0, com resultados reaproveitados na suíte de ativação. Cobrem os dez termos/variantes em backend, frontend e HTML (30 casos), cinco dependências em código e fontes (dez casos), rotas/SQL/identificadores sintéticos, conteúdo proibido acrescentado a cada campo permitido, alteração de um caractere nos seis campos, cópia para outro campo/missão/arquivo, duplicação de missão, JSON inválido/propriedades duplicadas/código executável, arquivos novos nos diretórios e arquivo ausente. O comando CLI retorna falha para termos/dependências e imprime somente tipo/termo/local, sem valores pessoais. Workflow conserva permissões de leitura e dependência obrigatória do Chromium.

Comandos executados: node --test worker/tests/studies-isolation.test.mjs; node worker/scripts/check-studies-isolation.mjs; verificação de sintaxe/diff. O restante da validação está registrado acima. A verificação continua lexical, com limites anteriores; não substitui autorização ou testes de isolamento do aplicativo. O ajuste não dispensa nenhum outro gate.

## Próxima ação e limites

Concluir os checks de #568 no SHA efetivo, integrar após #565 e acompanhar publicação por [deploy seguro](../WORKER-SAFE-DEPLOY.md), preservando bindings/rollback. Confirmar versão Worker ativa, frontend e smoke mínimo, sem varrer dados. Publicação só será relatada após essa confirmação. Preview Worker legado permanece separado da produção.

**PC-07 é crédito habitacional.** Falta correspondência nominal/profundidade no edital efetivamente adotado para decidir requisito ou complemento identificado. Sistemas, fundos e programas exigiriam fontes próprias. Continua fora do catálogo, revisão e Chefe, sem bloquear o núcleo comum. Não presumir essa inclusão ou o aceite humano da Fase 2.
