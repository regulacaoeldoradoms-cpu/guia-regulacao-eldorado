# MISSÃO BANCÁRIA — APLICAÇÃO DE COPOM E CVM

Data: 26/09/2026. Fase ativa: Fase 1.
Branch: `feat/missao-bancaria-aplicacao-copom-cvm`.
Base de conteúdo: `5f3f2ba44f6acce2c29f3d081e944be519003a9e` (PR #504).
Estado inicial: implementação em branch; não presumir CI remoto, merge ou publicação antes da consulta.

## Escopo da rodada

Seis atividades formativas, três após o ensino do Comitê de Política Monetária (Copom) e três após a aula da Comissão de Valores Mobiliários (CVM). Complementam as nove atividades das três primeiras aulas. Não substituem material de ensino nem aumentam artificialmente as 38 questões pontuadas.

Todas as atividades pedem explicação, distinção entre conceitos ou análise dos limites de uma conclusão. O comentário não é o primeiro contato com o assunto: cada caso se vincula a seções já ensinadas na própria aula, com exemplos e vocabulário. As aulas completas e seus exemplos resolvidos permanecem integralmente preservados.

## Copom — três verificações

| ID | O que o aluno deve explicar | Seções de apoio |
| --- | --- | --- |
| `apply.copom.contrato.v1` | Por que a meta Selic não determina taxa e prazo idênticos para todos os empréstimos. | `meta`, `exemplo-meta`, `resumo` |
| `apply.copom.tres-sentidos.v1` | A diferença entre sistema, taxa apurada e meta, apesar do uso do nome Selic. | `selic`, `meta`, `glossario` |
| `apply.copom.efeito.v1` | Por que dois preços estáveis no dia seguinte não provam sucesso ou fracasso de toda a política monetária. | `juros`, `relacao`, `meta` |

Os casos não dependem da taxa vigente, de previsão de reunião ou de nomes de dirigentes. Não há aconselhamento financeiro.

## CVM — três verificações

| ID | O que o aluno deve explicar | Seções de apoio |
| --- | --- | --- |
| `apply.cvm.destino.v1` | Quem recebe recursos na emissão de ações novas e numa venda posterior entre investidores; não presumir lucro sem preços. | `acoes`, `mercado`, `exemplo-oferta` |
| `apply.cvm.participacao-divida.v1` | Por que ação e debênture não criam automaticamente a mesma relação, embora ambas pertençam ao mercado de valores mobiliários. | `nome`, `acoes`, `resumo` |
| `apply.cvm.fiscalizacao-risco.v1` | Separar investidor, intermediário e supervisor, sem confundir fiscalização com lucro garantido. | `participantes`, `supervisao`, `exemplo-fraude` |

As situações são fictícias e identificadas. Cada uma tem comentário, três critérios de comparação do raciocínio e links **Reler**. Repetir palavras do comentário não é a finalidade: o aluno deve compreender a relação e os limites da informação disponível.

## Integração e preservação

- Novo `worker/studies-content/sfn-aplicacao-copom-cvm-v1.js` define os seis casos, anexação e validação.
- O manifesto anexa os casos à seção `resumo` das duas aulas, usando o formato já aceito pelo leitor.
- `applicationVersion: 1`; os textos de ensino permanecem na versão 2 e não são alterados.
- Nenhuma alteração de HTML, CSS, controlador de leitura, API, D1, login, autorização, cronômetro, pontuação, telemetria ou gate de deploy.
- Mesmos IDs de missão/tópico, ordem, questões, alternativas, gabaritos, XP e regras de conclusão/revisão/Chefe.
- Reanexar não duplica; conteúdo conflitante não é sobrescrito silenciosamente; alvos e fontes ausentes são detectados nos testes.

Total implementado nesta branch: **15 atividades formativas em cinco aulas**, além das mesmas 38 questões pontuadas. As quatro missões restantes mantêm o ensino, mas ainda não recebem este suplemento antes do planejamento específico.

Os rascunhos continuam opcionais e temporários, sem envio ou salvamento na conta. Revelar um comentário ou reler não gera nota, XP, tentativa ou sessão. Não existe correção automática nem certificação de retenção. Suplementos não dispensam as questões obrigatórias da missão ou da revisão.

## Fontes e alcance da conferência

Fontes primárias abertas nesta sessão:
- LC nº 179/2021, arts. 1º e 2º, objetivos e política monetária: https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp179.htm
- Lei nº 6.385/1976, valores mobiliários e competências: https://www.planalto.gov.br/ccivil_03/leis/l6385.htm
- Lei nº 6.404/1976, participação societária e instrumentos de dívida: https://www.planalto.gov.br/ccivil_03/leis/l6404consol.htm
- CVM, mandato legal: https://www.gov.br/cvm/pt-br/acesso-a-informacao-cvm/institucional/competencia
- Portal do Investidor, ações, participação e ofertas primárias/secundárias: https://www.gov.br/investidor/pt-br/investir/tipos-de-investimentos/acoes

O uso das páginas educacionais se restringe aos conceitos empregados nos casos; não foi feita auditoria de toda informação tributária ou de produtos ali publicada. Não se copiou seu texto para a aula.

A busca recuperou descrição oficial indexada do BCB sobre taxa Selic e sua influência nas demais taxas. A abertura direta das páginas atuais de Selic/Copom e da Resolução BCB nº 61 continuou retornando dependência de JavaScript. Não tratar isso como leitura integral da consolidação normativa. Esta entrega aplica conceitos já presentes na aula; não altera composição, taxa vigente, calendário ou regulamento. As referências e carimbos existentes não foram atualizados artificialmente.

## Testes efetivamente executados e preparados

**Local:** sintaxe e sete testes Node com fixtures, todos aprovados. Cobrem os seis casos, referências, preservação, idempotência, escopo, ausência de ensino/fonte e colisão. Não houve execução local de navegador nem da suíte completa do repositório: o ambiente não resolveu DNS do GitHub.

**Preparado para CI:** testes de catálogo real conferem 15 IDs únicos, preservam as nove atividades anteriores e os objetos das 38 questões; comparam os textos das quatro aulas suplementadas com a revisão original. A suíte de navegador mantém os 27 cenários anteriores e acrescenta cinco: Copom e CVM em claro/escuro, consulta à seção correta sem perder rascunho/seleção, ausência de envio/pontuação e troca de aula sem misturar casos. Total previsto: **32 cenários**. Não registrar como aprovados antes de ler o resultado remoto.

Nenhum teste foi removido, nenhum baseline ou tolerância foi enfraquecido. A mudança da contagem de aulas com suplemento é acompanhada da verificação dos cinco IDs exatos e da manutenção das quatro missões fora do recorte.

## Dependências e autorização

A PR #503 foi incorporada nesta rodada após todas as 24 execuções de GitHub Actions consultadas passarem, incluindo a auditoria geral. Merge: `c6c6dbfdd1e069053767bbec70ce2ce03b592dc3`. A PR #504 foi redirecionada à main; sua auditoria geral ainda estava em andamento na última consulta anterior a este registro. O comentário final de cada PR deve registrar o resultado posterior, sem presumir aprovação ou publicação.

Wellyton reiterou autorização de desenvolvimento e implementação. Não há necessidade de acesso imediato ou nova confirmação por etapa, mas não inventar homologação humana nem ignorar regressões. Esta entrega é construída sobre a #504 e só deve entrar na main quando suas dependências e seus testes estiverem elegíveis.

## Próximo recorte

Concluir as integrações e registrar builds separadamente do tráfego produtivo. Depois preparar aplicação de Operadores e Seguros/Previdência, preservando exemplos, leitura e critérios claros. Tratar pendências de tempo, rodadas e recorde de sequência em entregas próprias; este suplemento não as resolve. A Fase 1 permanece sem homologação humana de aprendizagem.
