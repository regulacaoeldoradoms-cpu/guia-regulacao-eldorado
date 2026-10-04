# Leitura introdutória — preparo local desativado

03/10/2026. Continuação do [lote 92](92-LP-LEITURA-LOTE-REVISAO-CHEFE.md). Três aulas, revisão e Chefe: **44 questões/176 justificativas**, sem cobertura completa do bloco ou abertura formal da fase. Perfis históricos/referenceOnly preservados.

## Conteúdo e revisão

Parecer independente dos cinco Markdown no head `474c1f85943d2399948e6a1cf50157cd25e422ba`: sem outros problemas relevantes além de dois grupos localizados. Corrigidos em MJS e Markdown: retirada de “necessariamente” em LP-02 questão 3/A e LP-R questão 5/B, eliminando ambiguidade de escopo; LP-03 seção `ex-comparacao` e questão 5/A agora distinguem a defesa da abertura aos sábados da prioridade expressa por B, sem atribuir prioridade a A. IDs, gabaritos e cálculos preservados. Três unidades afetadas renderizadas/conferidas; não repetida revisão integral. Parecer limita-se ao conteúdo, não a schema, fontes, aplicativo, retenção ou aceite humano.

## Adaptação existente

`worker/scripts/studies-lp-candidate.mjs` reutiliza o compilador de apresentação MP/PC e o preparo IS. Gera `portuguese-reading-v1.js`: cinco missões **draft**, `parametersApproved:false`, manifesto e mapa ligados exclusivamente pelo filtro de publicação. Quatro links do Chefe convertidos em consultas às três aulas/revisão; texto, alternativas, justificativas e referências de recuperação preservados.

Proposta técnica, ainda sem autorização de ativação: ordens 75–79, após Chefe IS, sequência por conclusão anterior, 100 XP/aula/revisão, Chefe 220 XP/75%, sem conquista nova. A dependência de IS, recorte nominal CAIXA, **não estabelece obrigação curricular de BB**: reavaliar esse parâmetro antes de ativar Português comum aos dois perfis. Não foi criada arquitetura de trilhas nem alteração de regras.

Os textos são autorais, com `SOURCES=[]` nos rascunhos. O contrato existente exige proveniência por missão: o preparo acrescenta registro `project-authored`, label de rascunho local, versão e locator do artefato. URL identifica apenas o repositório do projeto; `remoteArtifactAvailable:false` explicita que esses arquivos ainda não foram enviados. Não atribui autoria a instituição, não apresenta fonte normativa e não relaxa o validador. Só a missão recebe o registro; corpo editorial segue integralmente igual.

## Verificação direcionada

- Nove testes LP, incluindo seis cenários do roteador real com SQLite em memória: drafts inacessíveis; autorização/origem antes de persistir; sequência, feedback após resposta e duplicação; preservação de todas as tabelas `study_*`, XP, A/B, revisões e sessão interrompida SFN/MP/PC/CE/DP/IS; recuperação; Chefe 8/12 rejeitado e 9/12 aprovado com XP único.
- Seis Chromium LP: 320 px claro/390 px escuro com fonte ampliada; quatro consultas; seleção após consulta; falha de rede e retry; resposta pendente durante consulta, saída e retomada; questão respondida sem nova sessão; outro usuário bloqueado. Fixture sintética totalmente interceptada, sem API real/D1.
- Artefato regenerável, sincronia dos formatos afetados, sintaxe e catálogo/fontes anteriores serializados idênticos. Catálogo real permanece **50 missões/374 questões/quatro blocos**. Projeção em memória inclui DP/IS/LP somente para testes; não equivale à publicação.

Comandos: `node --test worker/tests/studies-lp-candidate.test.mjs`; `node worker/scripts/studies-lp-candidate.mjs --check-generated`; Chromium somente `studies-lp.spec.mjs` com `studies-reader.config.mjs`. Reaproveitadas evidências MP/PC/CE/DP/IS inalteradas; sem suíte completa ou produção.

Institucional [#600 draft](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/pull/600), SHA `709901d7cca28684e7b2b5cac9292e3c667dfb31`: CI terminal **25/27 verdes**. Estudos/Chromium estudos/Pages passaram. Suíte global falhou com `ENOENT worker/ai-resilience.js` na fixture (120 falhas); preview Worker externo falho. Sem evidência de regressão funcional ou incidente de produção; gates continuam pendentes, sem dispensa. Este registro acompanha o marco técnico LP; não gerou commit remoto só de status.

Próxima etapa local: organização textual e coesão/coerência, conforme plano 05 e `portuguese.text`. LP sem push/PR, ativação, merge ou deploy autorizados; não impede autoria local. Aceite humano pedagógico da fase 2 não observado.
