# MP — candidato técnico desativado

30/09/2026. Base editorial: [#563](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/pull/563), `36a8f9c688a44faf13bf3de287f74e291402a182`. Revisão independente dos 12 itens/48 justificativas do Chefe aprovada nesse SHA, sem mudanças. Não repetiu cálculo/esquema/fontes/Mermaid/integração; não constitui avaliação independente nem aceite humano. Revisões das aulas permanecem válidas conforme [72](72-MP-CHEFE-RASCUNHO-E-REVISAO.md). Fase 2 ativa; aceite humano não observado.

## Adaptação feita

[Conversor offline](../../worker/scripts/studies-mp-candidate.mjs), sem importação no Worker, lê os onze `.mjs` editoriais, mantém seus textos e respostas e produz objetos compatíveis com os contratos de ensino/publicação. Nenhum arquivo editorial foi alterado. Não há flag de ativação ou arquivo gerado importado pelo catálogo.

- IDs de missão/tópico candidatos usam `banking.mp.*`; questões usam `q.` antes do ID editorial. Nenhum ID SFN é renomeado. Referências locais e `originRefs` da revisão/Chefe são convertidas para as aulas corretas, sem referência futura.
- Fontes recebem namespace por unidade, preservando URL, localização, versão e data: 61 registros locais, com repetições intencionais das fontes entre aulas. Não sobrescrevem fontes SFN nem ampliam o registro ativo.
- As 336 justificativas podem ser consumidas pelo feedback pós-resposta existente. O registro SFN continua prioritário; dados ausentes/inválidos são rejeitados. O bootstrap continua expondo somente ID, enunciado e opções das questões.
- A conquista `study.sfn.boss` passa a exigir o Chefe SFN específico; outro Chefe não recebe essa conquista por ser `kind: boss`. Não se criou medalha MP nem se alteraram conquistas persistidas.
- O validador de ensino aceita fontes candidatas por argumento opcional; o comportamento padrão permanece o do catálogo publicado.

`node worker/scripts/studies-mp-candidate.mjs` imprime resumo verificável: **11 unidades, 84 questões, 336 justificativas, status draft, publicationReady false**. A conversão rejeita pacote incompleto, origem já marcada publicada, fonte/ref desconhecida, referência futura e colisões de IDs. Os rascunhos continuam fora de `PUBLISHED_MISSIONS`, `PLANNED_MISSIONS` e do mapeamento ativo de `banking.markets-policy`.

## Proposta agrupada, ainda não aprovada

| Ordem candidata | Unidade | Sufixo de `banking.mp.*` |
| --- | --- | --- |
| 10–12 | MP-01, MP-02, MP-03 | mercados, moeda, inflacao |
| 13–15 | MP-04, MP-05, MP-06 | politica-monetaria, instrumentos, qe-depositos |
| 16–18 | MP-07, MP-08, MP-09 | divida-publica, interbancario, curva-juros |
| 19–20 | MP-R, MP-CHEFE | revisao, boss |

Recomendação: manter as nove aulas + revisão + Chefe, sequência após o Chefe SFN, reaproveitando o gate atual (conclusão da missão anterior). Simulação usa 100 XP por aula/revisão; Chefe com 220 XP e 75% (9/12). Esses parâmetros estão explicitamente `parametersApproved: false`; não são uma decisão de produto já tomada. A liberação deve aprovar o pacote uma única vez, com recorte introdutório, escopo/edital e corte de fontes. Os perfis BB/CAIXA continuam históricos, sem adoção automática de edital ou alegação de cobertura integral. Release candidata: `markets-policy-intro-r1`, sequência 2, impacto `new`, sempre `draft` nesta preparação.

Não se alteram política +1/+7/+30, A/B, redação, simulados ou diagnóstico por conceito. MP-CHEFE é prática exposta, não nova forma independente. Nenhuma medalha nova é necessária para a proposta mínima.

## Falha real encontrada no teste com o catálogo SFN

O pré-requisito A/B consultava `banking.sfn.introducao` como tópico persistido; a introdução real grava `banking.sfn`. Assim, concluir as nove missões não satisfazia essa consulta. As fixtures anteriores preenchiam IDs de missão como tópicos e não detectavam a divergência.

Correção restrita: [conteúdo A/B](../../worker/studies-assessment-content/sfn-foundation-v1.js) expõe os IDs reais de progresso separadamente; [serviço](../../worker/study-assessments.js) usa essa lista na consulta. IDs das aulas/itens, versão A/B, scores, sete dias, registros e esquema permanecem iguais. Não há migração. Testes agora preenchem pré-requisitos a partir dos `topicId` do catálogo real e confirmam que alias incorreto não substitui introdução ainda incompleta. Esta correção também permanece sem merge/deploy.

## Evidência local e limites

Código validado em `f9468c8910a5da9c7f678680889d0a1c8e492d2f`. Node 24.17.0; [teste de candidato](../../worker/tests/studies-mp-candidate.test.mjs) e [cinco cenários de rota](../../worker/tests/helpers/studies-mp-route-runner.mjs): conversão conserva texto/opções/gabaritos; draft inacessível; exclusividade `wellyton`/origem antes de criar tabelas; bootstrap sem gabaritos; pré-requisitos SFN→MP e entre aulas; feedback e recuperação de MP-R; resposta repetida, retomada sem nova sessão, Chefe abaixo/acima do limiar e XP único.

Adição publicada **somente em memória** ao catálogo da fixture conserva todas as linhas `study_*`: progresso, tentativas, XP, conquista, revisões, avaliação A concluída e sessão SFN interrompida. Readiness permanece não medida; o mapa ativo continua 1/43. SQLite local executa o roteador e serviços reais; autenticação é sintética. Não é homologação de Cloudflare ou teste autenticado do aluno.

Passaram 20 testes externos de candidato/avaliação/rotas, incluindo os cinco cenários MP e os 22 fluxos existentes executados pelos dois wrappers. Feedback SFN e contrato de ensino também passaram (12 testes), sem alterações posteriores nesse escopo. Reutilizar esses resultados; não repetir revisão editorial nem suíte integral por documentação. Nenhum acesso D1/produção.

## Trabalho técnico que falta antes de pedir publicação

1. Adaptar apresentação preservando conteúdo: o conversor enumera 17 locais afetados, incluindo cinco diagramas, três tabelas e links de retomada. O leitor atual usa texto; imprimir Markdown/Mermaid como código não atende às aulas. Validar leitura e q11 do Chefe em Chromium, incluindo retorno/retomada e fluxos repetidos, sem consultas de produção. Não apagar gráficos ou resumir ensino para contornar a renderização.
2. Definir estimativas de duração e substituir avisos editoriais de rascunho pela apresentação do conteúdo aprovado no artefato de integração; manter os limites pedagógicos. Não editar fontes/gabaritos aprovados incidentalmente.
3. Após aprovação agrupada, produzir dados para o Worker, incluir fontes/missões no manifesto, registrar os IDs no plano/mapa curricular e ativar metadados de publicação de forma conjunta. Enquanto draft, não aumentar denominadores visíveis ao aluno.
4. Validar a integração final por SHA e gates aplicáveis; só então merge/publicação autorizados, `deploy:safe`, versão exata e smoke proporcional. Aceite humano da Fase 2 continua separado.

Próxima ação independente: apresentação das cinco figuras/três tabelas e navegação de retomada, reaproveitando os dados aprovados e o candidato testado. Não há bloqueio de acesso/ambiente; existe trabalho técnico restante e autorização de publicação ainda não concedida.
