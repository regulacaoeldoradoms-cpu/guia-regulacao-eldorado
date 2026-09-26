# MISSÃO BANCÁRIA — APLICAÇÃO DE OPERADORES E SEGUROS/PREVIDÊNCIA

Data: 26/09/2026. Fase ativa: Fase 1.
Branch: `feat/missao-bancaria-aplicacao-operadores-seguros`.
Base de integração: `6040f0372997ca60bbf11502a94bd68e0cbad919`, após o merge da #505; árvore igual à do head revisado `d8103934b122c5c1b1f662b0cd53ea33d4388a52`.

## Recorte entregue

Seis atividades formativas, três após Operadores e três após Seguros/Previdência, apoiadas em trechos já ensinados. Não foram criados mundos, novas questões pontuadas ou explicações abreviadas. Todo o texto de ensino, exemplos resolvidos e vocabulário das aulas é preservado.

### Operadores

- `apply.oper.canais.v1`: distinguir agências/aplicativos e carteiras; reconhecer que o número de canais não permite classificar uma instituição.
- `apply.oper.papel.v1`: distinguir a análise de documentos de um cliente da supervisão institucional do sistema.
- `apply.oper.natureza.v1`: explicar por que o mesmo supervisor não dá a todos os prestadores a mesma natureza jurídica e as mesmas operações permitidas.

### Seguros e previdência

- `apply.segprev.premio.v1`: explicar prêmio como pagamento pela contratação, não premiação; relacionar proteção a riscos e condições, sem prometer cobertura de qualquer evento.
- `apply.segprev.coletivo.v1`: comparar plano aberto coletivo e plano de entidade fechada; não deduzir a modalidade apenas do vínculo com o emprego.
- `apply.segprev.canal.v1`: separar canal de oferta, natureza do produto e supervisor; não tratar capitalização como poupança só porque foi oferecida em uma agência.

Os enunciados são fictícios e identificados. Cada caso possui comentário, três critérios de autoavaliação e referências por ID aos trechos da própria aula. O comentário não introduz matéria indispensável que ainda não tenha sido ensinada.

## Experiência preservada

O leitor já apresenta o painel **Aplique com suas palavras**, com rascunho opcional, comentário revelável e botões **Reler**. Não foi alterado seu controlador, HTML ou CSS nesta rodada.

As atividades não dão nota, XP, conclusão ou tentativa registrada. Não há avaliação automática de texto. Rascunhos continuam apenas na missão aberta, sem envio ou salvamento na conta; a interface avisa esse limite. Consultar a aula preserva respostas e alternativas na mesma sessão.

O conteúdo em desenvolvimento passa a ter **21 atividades formativas em sete aulas**, além das mesmas 38 questões pontuadas. Pagamentos/Consórcios e Chefe continuam com seu ensino/preparação, mas sem esse novo suplemento até o planejamento correspondente.

## Implementação

- `sfn-aplicacao-operadores-seguros-v1.js`: seis casos, uma fonte adicional, anexação imutável e validador.
- `manifest.js`: inclui o suplemento após as etapas editoriais existentes.
- As fontes originais permanecem. O Portal do Investidor já catalogado passa a ser referência também em Operadores; a FAQ oficial sobre prêmio é acrescentada a Seguros e ao catálogo global sem duplicação.
- `applicationVersion: 1`; texto-base permanece na versão 2, pois títulos e explicações não mudaram.
- IDs de missões, tópicos, seções, questões, alternativas e gabaritos, ordem, XP e regra do Chefe preservados.
- Sem endpoint, schema, D1, autenticação, permissão, telemetria, cronômetro ou gate de deploy alterado.

O validador verifica referências ao ensino e às fontes. A publicação de uma atividade não comprova que o aluno aprendeu; sua avaliação humana continua pendente.

## Fontes efetivamente abertas nesta sessão

1. Portal do Investidor/CVM — funções do SFN: https://www.gov.br/investidor/pt-br/investir/como-investir/conheca-o-mercado-de-capitais/sistema-financeiro-nacional/
2. Banco Central, página histórica sobre bancos múltiplos: https://www.bcb.gov.br/pre/composicao/bm.asp?frame=1
3. Lei nº 12.865/2013, arts. 6º e 9º: https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2013/lei/l12865.htm
4. Lei Complementar nº 109/2001, especialmente arts. 26, 31 e 36: https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp109.htm
5. SUSEP institucional: https://www.gov.br/susep/pt-br/acesso-a-informacao/institucional/sobre-a-susep
6. SUSEP, perguntas sobre seguros, item 3 (prêmio): https://www.gov.br/susep/pt-br/acesso-a-informacao/perguntas-frequentes/pasta-das-perguntas-frequentes/perguntas-mais-frequentes-sobre-seguros
7. PREVIC, participação em previdência fechada: https://www.gov.br/previc/pt-br/licenciamento-e-habilitacao/como-participar

Escopo limitado aos conceitos usados. Não se declara auditoria integral de toda informação contratual dessas páginas. A página histórica do BCB continua identificada como histórica; não foi transformada em consolidação normativa. A abertura da Resolução CMN 5.060 novamente retornou exigência de JavaScript. Esta entrega não altera a regra de carteiras nem cria caso dependente de novos requisitos de capital/autorização: trabalha a distinção de conceitos já ensinada. As limitações anteriores do documento 29 permanecem.

## Testes e estado inicial

Localmente foram executados **sete testes Node**, aprovados, e verificações de sintaxe do módulo e do novo arquivo de navegador. Cobrem preservação, referências, anexação idempotente e casos negativos de ausência de material/fonte e suplemento conflitante. O hash do módulo enviado ao GitHub foi comparado ao arquivo local testado.

Não foi executado navegador local ou suíte completa local: o ambiente não resolveu o DNS do GitHub para obter o repositório inteiro. Isso não indica indisponibilidade do portal. Não foram usados dados reais de Wellyton.

No CI, testes do catálogo real verificam as 21 atividades, os quinze casos anteriores e a preservação integral do ensino e das 38 questões. Novo arquivo de navegador acrescenta cinco cenários (Operadores/Seguros em claro/escuro e troca de missão), mantendo os 32 anteriores: **37 cenários previstos**. Configuração, limites e tolerâncias anteriores não foram relaxados. Consultar o resultado remoto após o push antes de declará-lo aprovado.

## Dependências integradas nesta rodada

- #504 incorporada em `7a302b6f98fbde9b3ff5bc1aeca01bb8dad63378`, após 24 workflows consultados com sucesso.
- #505 incorporada em `6040f0372997ca60bbf11502a94bd68e0cbad919`, após concluir a auditoria geral que ainda estava em andamento; mesmo head validado.

Esta entrega parte diretamente da main resultante, sem criar outra cadeia de PRs dependentes. Os resultados de build/publicação são registrados separadamente nos comentários finais das PRs. Não presumir tráfego produtivo ou uso autenticado a partir de merge.

## Continuidade

Concluir CI desta entrega, corrigir regressões e integrar quando elegível. Próximo recorte: aplicação de Pagamentos/Consórcios e planejamento da revisão cumulativa, sem antecipar matéria nova no desafio. A Fase 1 permanece sem homologação humana de aprendizagem; a autorização de Wellyton permite prosseguir sem exigir seu acesso imediato. As pendências de tempo, rodadas e sequência histórica exigem entregas próprias e não foram resolvidas por este material.
