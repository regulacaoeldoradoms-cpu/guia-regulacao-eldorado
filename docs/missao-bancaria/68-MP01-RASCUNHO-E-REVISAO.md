# MP-01 — aula em rascunho e revisão

30/09/2026. **Fase 2 ativa, sem aceite humano. Fase 3 não aberta.** Esta entrega desenvolve a etapa A preparada na [#559, documento 67, commit 400d4854](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/blob/400d48545710c1ec0b3a9628bd37813d065dac00/docs/missao-bancaria/67-MP01-DELIMITACAO-E-FONTES.md); não repete a auditoria curricular nem integra aquela PR.

Leia a [aula MP-01 com prática comentada](rascunhos/mp-01-v1.md). A fonte editorial é [mp-01-v1.mjs](rascunhos/mp-01-v1.mjs); o Markdown é gerado para revisão. Nenhum import foi acrescentado ao manifesto do aplicativo. `draft.mp01` e as questões são identificadores locais, sem reserva de IDs produtivos, XP, ordem ou release de conteúdo.

## Entrega e revisão de autoria

Foram redigidos ensino para iniciante, cinco exemplos resolvidos, três prompts de recordação/recuperação e oito questões com justificativa de cada alternativa. A sequência explica vocabulário antes da cobrança. A estrutura segue `explanation`, `worked-example`, `glossary`, `summary`, questões e `teaching.questionCoverage` já existentes, com fontes locais de rascunho.

| Objetivo do preparo | Ensino e exemplo | Verificação e recuperação |
| --- | --- | --- |
| O1: mercado/instituição/operação/instrumento | `perguntas`, `exemplo-credito` | q01; primeiro prompt de recordação |
| O2: finalidade, objeto e papéis | `credito` a `exemplo-limite` | q01–q07; referências específicas em cada item |
| O3: comparação dos quatro segmentos | explicações e exemplos de crédito, capitais, monetário e câmbio | q02–q05, q07–q08 |
| O4: concedente, tomador, emissor e investidor | `credito`, `capitais`, exemplos correspondentes | q02–q03, q08 |
| O5: informação insuficiente/limites | `limites`, `exemplo-limite` | q06–q07 |
| O6: localizar a explicação após erro | `resumo`, terceiro prompt e referências de recuperação | reescrever a justificativa e conferir o exemplo indicado; sem novo indicador no aplicativo |

Revisão factual/editorial realizada pelo autor: comparados os contrastes com as três fontes primárias já selecionadas no preparo, novamente acessadas em 30/09/2026. CVM: páginas “Funcionamento do Sistema Financeiro Nacional” e “O Mercado de Valores Mobiliários”, publicadas em 25/10/2022. BCB: Caderno de Educação Financeira 2026, 2ª edição, seções 3.1/3.4, páginas impressas 32/35. Uma quarta fonte, CVM “Mercado Primário x Mercado Secundário”, publicada em 26/08/2022 e consultada na mesma data, fundamenta a ressalva sobre negociação posterior. URLs e localizadores estão na aula e no registro estruturado.

Foram evitadas as simplificações: dívida implica sempre empréstimo bancário; banco só atua em um segmento; curtíssimo prazo sozinho classifica a operação; prestação de serviços equivale a assumir a dívida da emissora. Os casos são originais e fictícios. Não há taxa atual, cálculo de juros ou afirmação de regra normativa vigente. Liquidez está delimitada à disponibilidade para pagamentos, sem desenvolver instrumentos monetários. A cotação aparece somente como vocabulário, sem valores ou regras de contratação.

**Estado A–F:** A reaproveitada; B/C/E redigidas; D revisada pelo autor, com clareza/revisão humana pendentes; F não iniciada. Não há publicação, teste com aluno, nova avaliação independente ou evidência de aprendizagem. As oito questões são prática exposta, não itens para ampliar A/B. BB/CAIXA continuam perfis históricos separados, com adoção do escopo pendente.

## Verificação direcionada

Executar `node docs/missao-bancaria/rascunhos/validate-mp01.mjs` na raiz. O script confere IDs, estrutura de ensino, fontes, respostas, justificativas das alternativas, cobertura O1–O6, vínculos de recuperação e igualdade da prévia legível. Reutiliza o filtro real de publicação para comprovar que acrescentar o objeto **draft** à entrada não modifica a lista publicada. A validação não importa o rascunho no runtime, não acessa dados pessoais e não substitui revisão de conteúdo/homologação. Não há motivo para repetir suíte integral por esta entrega editorial.

## Checklist humano mínimo da Fase 2

Resumo do [roteiro completo 62](62-ROTEIRO-HOMOLOGACAO-FASE2.md), para uso na versão já publicada; não depende deste rascunho:

1. Com `wellyton`, abrir uma aula no computador e no celular: ensino, botões e indicadores devem estar legíveis. Retomar uma sessão e conferir o último progresso confirmado.
2. Em uma questão respondida incorretamente, conferir feedback após a tentativa e **Rever conceito**; no Chefe, a origem deve ficar disponível para revisar sem trocar a missão durante a rodada.
3. Observar os estados de leitura/prática/revisão disponíveis na conta; **Ciclos concluídos** não deve prometer domínio. Quando ocorrer erro recorrente e posterior acerto, conferir o indicador e a preservação do histórico.
4. No painel, distinguir domínio recente de acerto histórico, respeitar “Ainda não medido” e prontidão não medida; baseline não deve aparecer retroativamente como conteúdo novo. Conferir que XP, conquistas e avaliação independente continuam separados.
5. Registrar resultado/obstáculo de cada passo, aparelho e data; indicar explicitamente “aceito” ou “ajustes necessários”. Estados ainda indisponíveis ficam **não observados**, sem manipular datas ou apagar histórico. O aceite deve considerar esses limites; este documento não o concede.

Próxima ação editorial: revisão humana do MP-01, corrigindo eventuais ambiguidades; depois preparar a unidade seguinte já especificada, conforme decisão de escopo. Qualquer integração no catálogo exige etapa F, autorização de conteúdo/fase e testes aplicáveis ao código final.
