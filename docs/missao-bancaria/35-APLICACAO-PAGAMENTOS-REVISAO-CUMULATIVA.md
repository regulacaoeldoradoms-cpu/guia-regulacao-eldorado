# MISSÃO BANCÁRIA — APLICAÇÃO DE PAGAMENTOS E REVISÃO CUMULATIVA

Data: 26/09/2026. Fase ativa: Fase 1.
Branch: `feat/missao-bancaria-aplicacao-pagamentos-revisao`.
Base: `614991af8d01def824e85b1b71f06fbd22b01d4a`, merge da PR #506 nesta rodada.
Estado inicial: implementado para validação; CI, merge e publicação devem ser consultados e registrados separadamente.

## Objetivo da entrega

Completar o recorte planejado de aplicação do primeiro bloco de Sistema Financeiro Nacional, sem substituir as aulas completas por perguntas. São três situações formativas após Pagamentos/Consórcios e três situações de revisão cumulativa antes das questões do Chefe.

Resultado nesta branch: **24 atividades nas oito aulas de ensino + três atividades cumulativas na preparação do Chefe = 27 atividades opcionais**. Permanecem as mesmas 38 questões pontuadas. Isso não encerra o curso, o edital ou a Fase 1 e não demonstra aprendizagem humana por si só.

## Pagamentos/Consórcios — aplicação do material já ensinado

| Atividade | Raciocínio solicitado | Trechos de ensino |
| --- | --- | --- |
| `apply.pag.arranjo.v1` | Distinguir arranjo, prestador e infraestrutura em um pagamento explicitamente liquidado pelo SPI, sem generalizar o caminho a todos os fluxos. | `arranjo`, `spi`, `exemplo-pix` |
| `apply.pag.aplicativo.v1` | Não deduzir a pessoa jurídica responsável nem a regularidade de uma oferta apenas pela aparência do aplicativo. | `instituicao`, `glossario` |
| `apply.pag.consorcio.v1` | Separar autofinanciamento, remuneração da administradora e supervisão, sem prometer custo zero ou contemplação imediata. | `consorcio`, `exemplo-consorcio` |

Cada atividade contém situação fictícia identificada, comentário desenvolvido, três critérios de autoavaliação e botões para reler os trechos da mesma aula. Não depende de taxa atual, nome de dirigente ou nova regra de contratação.

## Preparação cumulativa do Chefe

Três situações combinam conceitos das aulas anteriores:

1. `apply.boss.funcoes.v1`: uma operação de crédito a uma loja não é a mesma decisão que diretrizes gerais, condução de política monetária ou meta Selic.
2. `apply.boss.segmentos.v1`: um canal de informação não elimina as diferenças entre valores mobiliários, previdência aberta e entidades fechadas.
3. `apply.boss.pagamento-grupo.v1`: pagar a contribuição de um consórcio por Pix não transforma a infraestrutura de pagamento em administradora nem o grupo em banco.

O comentário apenas recombina conceitos já ensinados. Não há assunto novo que só apareça na resposta. O conjunto de `originRefs` identifica trechos reais das **oito aulas anteriores**; o validador recusa origens ausentes, posteriores ou da mesma ordem do desafio.

**Limite de navegação:** `originRefs` é metadado editorial de rastreabilidade. Os botões **Reler** usam `sectionIds` e abrem as sínteses da preparação atual, preservando a sessão. Esta entrega não implementa links que abrem outra missão automaticamente. As aulas completas permanecem acessíveis pelo mapa.

A pontuação do Chefe não muda: 12 questões, mínimo de 75%, 220 XP concedidos conforme a regra existente. Escrever ou revelar esses comentários não vence o Chefe nem satisfaz uma revisão pendente.

## Implementação e preservação

- Novo `worker/studies-content/sfn-aplicacao-pagamentos-revisao-v1.js`.
- O manifesto anexa as atividades às seções `resumo` de Pagamentos e Chefe, usando o formato já aceito pelo leitor.
- `applicationVersion: 1`; texto de ensino na versão 2, sem alteração de corpo, título, tipo ou ID das seções.
- Anexação imutável e idempotente. Conteúdo conflitante não é apagado para simular conformidade.
- Fontes originais preservadas; referências já existentes no catálogo são acrescentadas às missões quando necessário. Nenhuma fonte recebe carimbo artificial de nova conferência.
- Sem modificação de HTML, CSS, controlador de leitura, backend de autenticação, endpoints, D1, migrações, cronômetro, gabaritos, XP, conquistas ou gate de deploy.
- As 21 atividades anteriores permanecem com os mesmos objetos e IDs.
- Rascunhos opcionais continuam temporários, sem envio ou armazenamento na conta; limite informado pela interface existente.

O comentário formativo é material de estudo, não resposta protegida das 38 questões pontuadas. A projeção pública dessas questões continua sem gabarito. Não existe avaliação automática do texto livre nem certificação de retenção.

## Fontes e alcance da verificação desta rodada

Fontes primárias abertas e lidas nos trechos usados:

- Lei nº 12.865/2013, arts. 6º e 9º, conceitos de arranjos/instituições de pagamento e competências: https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2013/lei/l12865.htm
- Lei nº 11.795/2008, arts. 2º, 5º a 7º, 22 e 23, grupo, administradora, supervisão e contemplação: https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2008/lei/l11795.htm
- LC nº 179/2021, arts. 1º, 2º e 6º, objetivos e atribuições da política monetária: https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp179.htm
- CVM, Mandato Legal, fiscalização e proteção dos investidores: https://www.gov.br/cvm/pt-br/acesso-a-informacao-cvm/institucional/competencia
- SUSEP, campo de atuação: https://www.gov.br/susep/pt-br/acesso-a-informacao/institucional/sobre-a-susep
- Lei nº 12.154/2009, arts. 1º e 2º, fiscalização das entidades fechadas pela PREVIC: https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2009/lei/l12154.htm

A Lei 12.154 foi apoio adicional à revisão, sem substituir silenciosamente fontes já catalogadas. A página de missão da PREVIC retornou erro de acesso; isso não foi descrito como leitura integral. A página de participação em planos fechados foi aberta para conferir vínculo, sem usá-la sozinha como base das competências supervisoras.

A busca recuperou descrições oficiais indexadas do BCB sobre SPI, participantes do Pix e definição da meta Selic pelo Copom. A abertura direta de páginas atuais do BCB continuou dependente de JavaScript. Essa distinção permanece explícita: não alegar acesso ao inteiro teor de toda regulamentação a partir de um resultado indexado. URLs principais de referência:
- https://www.bcb.gov.br/estabilidadefinanceira/sistemapagamentosinstantaneos
- https://www.bcb.gov.br/estabilidadefinanceira/participantespix
- https://www.bcb.gov.br/controleinflacao/taxaselic

Nenhuma alteração de norma, taxa vigente, composição por nomes ou calendário é introduzida neste suplemento. Não é aconselhamento financeiro nem revisão jurídica integral dessas leis.

## Testes e evidência inicial

**Executados localmente:** nove testes Node com fixtures, todos aprovados, mais verificação de sintaxe do teste de navegador. Conferido o hash do módulo testado: `a5c599f5bef58af8a930ebfd618a6fe7265b3e59`. Os testes cobrem conteúdo, imutabilidade, fontes, preservação, idempotência, colisões, ensino ausente e origens inexistentes/futuras.

Não foi executado navegador local nem suíte completa local nesta rodada; o ambiente não resolveu DNS do GitHub para obter o repositório inteiro. Não houve acesso à conta pessoal do usuário.

**Preparado no CI:** catálogo real com 27 IDs únicos, manutenção das 21 atividades anteriores e comparação do texto integral com as revisões; novo arquivo de navegador acrescenta oito cenários, mantendo os 37 existentes, total previsto de **45**. Verifica consulta, rascunho, ausência de envio, fonte ampliada, troca de missão, versão anterior sem suplemento e, especificamente, que autoavaliação/histórico não habilitam automaticamente a conclusão do Chefe ou da revisão.

Os testes de navegador usam HTML/CSS e catálogo reais do repositório com autenticação/API simuladas. Eles não comprovam o isolamento real de rodadas no banco de dados. Nenhum teste, tolerância ou baseline anterior foi reduzido. Conferir o resultado remoto antes de declarar aprovação.

## Integração anterior e continuidade

A PR #506 foi incorporada nesta rodada no commit `614991af8d01def824e85b1b71f06fbd22b01d4a`, após as 24 execuções de GitHub Actions do head concluírem com sucesso, incluindo a auditoria geral. Resultados de publicação do merge são registrados separadamente no comentário final daquela PR.

Próximo recorte após a validação e integração desta entrega: revisar a confiabilidade de sessões/rodadas e do cronômetro com testes comportamentais. Não ampliar o curso indefinidamente com perguntas antes de resolver as pendências que afetam a confiança no progresso. Persistem as limitações de sequência histórica, interrupções e comprovação de aprendizagem.

Wellyton autorizou continuidade sem acesso imediato. Não pedir nova autorização por pequena etapa, não encerrar formalmente a Fase 1 nem inventar homologação humana.
