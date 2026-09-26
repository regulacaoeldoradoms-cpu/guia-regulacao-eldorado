# MISSÃO BANCÁRIA — REVISÃO DOS FUNDAMENTOS — LOTE A

Data: 26/09/2026. Fase 1 aberta.
PR: #501, branch `fix/missao-bancaria-ensino-do-zero`.
Estado: material e integração editorial implementados; CI do novo commit e publicação devem ser verificados separadamente.

## Recorte desta rodada

Etapas C/D do plano de produção: revisão de exemplos, precisão e encadeamento das quatro primeiras unidades já redigidas. Não foram criados mundos, questões ou recompensas.

1. Introdução ao SFN: corrige a pressuposição de que guardar dinheiro sempre envolve um banco; desenvolve a intermediação e explica risco de crédito; evita usar somente o verbo do enunciado como critério de classificação.
2. CMN: diferencia diretriz geral e contrato individual; explica a relação com um Banco Central autônomo, sem sugerir subordinação hierárquica.
3. Banco Central: explica autarquia especial, autonomia, objetivos e condução da política monetária; inclui contraexemplo de frase parcialmente correta.
4. Copom: ensina poder de compra, títulos públicos, custódia e liquidação antes da referência à Selic; distingue sistema, taxa apurada, meta Selic e juros do contrato. Não utiliza taxas atuais nem promete efeitos automáticos sobre preços.

Não se trata de quatro aulas novas. São **13 trechos revisados** dentro das aulas existentes, conservando os demais textos. As outras quatro aulas de ensino e a preparação do Chefe continuam na redação V2, com revisão final pendente.

## Conferência das questões iniciais

As 12 questões das quatro primeiras missões foram comparadas ao material anterior à prática:
- SFN: funções normativas/supervisoras/operacionais nas seções `cmn`, `bcb`, `operadores`, `intermediacao` e exemplos.
- CMN: função e composição nas seções `papel`, `diferencas`, `composicao` e exemplos.
- Banco Central: supervisão, execução e banco dos bancos nas seções `supervisao`, `politicas` e `banco-dos-bancos`.
- Copom: localização, composição e meta Selic nas seções `nome`, `composicao`, `selic` e `meta`.

Não houve alteração de gabaritos. Estes itens ainda são exercícios iniciais de reconhecimento, não uma prova suficiente de aplicação a situações novas ou retenção duradoura. A melhoria da avaliação é uma etapa posterior; não foi simulada nesta entrega.

## Fontes realmente consultadas

### Lei Complementar nº 179/2021
https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp179.htm

Página integral acessada nesta sessão. Conferidos arts. 1º (objetivos), 2º (metas/condução da política monetária) e 6º (natureza especial/autonomia). Fonte adicionada ao catálogo para CMN, Banco Central e Copom. A aula contém explicação própria; a leitura da lei não é exigência para aprender.

### Ministério da Fazenda — CMN
https://www.gov.br/fazenda/pt-br/assuntos/cmn

Conferidas função e composição por cargos. Não foram usados nomes dos ocupantes. A composição registrada no curso permanece compatível com os cargos apresentados na página.

### Portal do Investidor — estrutura do SFN
https://www.gov.br/investidor/pt-br/investir/como-investir/conheca-o-mercado-de-capitais/sistema-financeiro-nacional/

Reaberta a página. Uso conceitual da separação entre normativos, supervisores e operadores; não usar a composição ministerial histórica dessa página como lista de ocupantes atual.

### BCB — Resolução nº 61/2021
https://www.bcb.gov.br/estabilidadefinanceira/exibenormativo?numero=61&tipo=Resolu%C3%A7%C3%A3o+BCB

A busca recuperou texto oficial indexado: anexo, arts. 1º e 2º, com competência, composição e distinção entre taxa e meta Selic. A abertura direta continuou retornando exigência de JavaScript. Registrar a diferença: essa consulta sustenta os pontos lidos, mas não comprova integralmente uma versão consolidada nem a ausência de alterações posteriores. Não alterado o carimbo antigo dessa fonte para simular conferência integral.

### Pendência mantida para Operadores

A Resolução CMN nº 5.060/2023 ainda não foi lida integralmente em fonte primária acessível nesta sessão. A regra já existente de carteiras não foi alterada nem declarada reconferida. Próximo recorte: revisar CVM e Operadores e resolver essa referência antes de promover o conjunto da PR.

## Integração e proteção do histórico

- `sfn-fundamentos-revisados.js`: revisão por IDs de missão e seção.
- `manifest.js`: aplica os textos ao mesmo catálogo consumido por missão, tópico e questão; inclui fonte legal e marcador editorial, sem marcar homologação humana.
- `studies-fundamentals.test.mjs`: verifica aplicação real, referências, imutabilidade e preservação das questões/recompensas. Inclui cenários de revisão desconectada e seção ausente.
- `studies-teaching.test.mjs`: reconhece também o domínio oficial exato `www.planalto.gov.br`; demais exigências mantidas.

Continuam os mesmos IDs de missão/tópico/seção, ordem, questões, XP e regra do Chefe. `contentVersion` continua 2 porque esse material ainda está em revisão na mesma PR não publicada. Sem D1, autenticação, CSS, frontend, telemetria ou gate de deploy alterados.

## Próxima ação concreta

Revisar as unidades CVM e Operadores, especialmente os termos de mercado e a norma sobre carteiras; depois Seguros/Previdência e Pagamentos/Consórcios. Em seguida concluir a revisão cumulativa do Chefe e verificar CI/publicação. Não transformar essa lista em autorização para comprimir o ensino numa entrega única. A Fase 1 continua sem aceite pedagógico humano.
