# Reescrita — lote introdutório e preparo local

04/10/2026. Bloco existente `portuguese.meaning-writing`, plano05 e [par inicial120](120-RE-PRIMEIRO-LOTE.md). Sem abertura de fase ou publicação.

| Unidade | Recorte | Questões |
| --- | --- | --- |
| [RE01](rascunhos/re-01-v1.md) | Conteúdo e forma; preservar tempo, negação e objeto | 8 |
| [RE02](rascunhos/re-02-v1.md) | Concisão, condição, referência e explicação contextual | 8 |
| [RE03](rascunhos/re-03-v1.md) | Integrar concordância simples, assistir/presenciar + artigo definido/crase e negativa sem pausa com um verbo | 8 |
| [RER](rascunhos/re-r-v1.md) | Revisão cumulativa das três aulas | 8 |
| [REChefe](rascunhos/re-chefe-v1.md) | Doze itens próprios, seis grupos de recuperação | 12 |

Total: cinco unidades,44 questões/176 justificativas/13 exemplos. RE01/02 e suas precisões anteriores permaneceram byte-idênticas a6307acc. Revisão independente dos três novos Markdown:28 questões/112 justificativas/sete exemplos, favorável condicionada a precisão aplicada no Chefe q12B: “Declarar a palavra ‘não’ sempre dispensável.” Justificativa: “A palavra ‘não’ preserva a negação e não é redundante neste caso.” GabaritoA mantido; dois formatos e artefato sincronizados. Na revisão cumulativa, a palavra ‘não’ também aparece entre aspas na explicação sobre retirar a negação. Parecer limitado ao conteúdo, sem homologação ou aceite humano.

Fontes pertinentes já verificadas em04/10/2026 e reutilizadas: Incaper11.1D/E para clareza; Senado para concordância, assistir/presenciar e crase; FUNAG/oldid553 para negativa sem pausa (um verbo). A atribuição Cunha/Cintra/Almeida da página FUNAG foi preservada. Não houve nova pesquisa normativa nem extensão dessas regras a todas as variantes. Detalhes/fontes anteriores em111/115/116/118/119. Fora do recorte: passiva, discurso indireto, relativas, nominalização, elipse e períodos complexos; exigem ensino prévio e fonte pertinente.

Candidato `studies-re-candidate.mjs`/`portuguese-rewriting-v1.js`:127–131/release18 após ChefeCP126. IS muda apenas ordem/pré-requisito/release para132–141/release19 após ChefeRE131. Todos draft/parametersApproved:false; proposta padrão100XP/unidade e220XP/75%Chefe, não ativada. Links compilados para aulas/seções anteriores verificadas, sem navegação externa ou alteração do leitor.

## Verificação executada

21 testes distintos aprovados:10RE+8IS+3ordem, incluindo12cenáriosSQLite offline. Cobrem autorização/negação antes de persistência, retomada/repetição, feedback pós-resposta, preservação de XP/tentativas/conquista/revisões/A/sessão, pacote inválido e dependências futuras. Após precisão editorial q12B, somente três testes afetados do RE foram repetidos e aprovados.

Nove casosChromium distintos aprovados:6RE+3IS afetados (320claro/390escuro/fonte ampliada/retomadas, falha de rede/repetição, resposta pendente, saída de consulta, acesso exclusivo). Nenhum skip/threshold/timeout ampliado. Schemas/render dos três novos editoriais, artefatosRE/IS --check-generated e scanner textual de isolamento aprovados;13negativos do detector reutilizados porque detector/workflow inalterados.

Comparação com6307acc: catálogo ativo/fontes/planejamento/mapa/snapshot idênticos; RE01/02 preservadas; IS texto/IDs/fontes/questões/XP e demais campos idênticos, só metadados acima mudaram.44IDs/enunciadosRE únicos e precisão final q12B sincronizada. Central/js/css/motor/leitor/rodadas/A-B inalterados. Fixtures/SQLite não homologam API real, produção, retenção ou aceite humano. Sem produção/D1/push/merge/deploy. [Pacote123](123-PORTUGUES-PACOTE-LOCAL-E-PUBLICACAO-PENDENTE.md) reúne contagens e gates.
