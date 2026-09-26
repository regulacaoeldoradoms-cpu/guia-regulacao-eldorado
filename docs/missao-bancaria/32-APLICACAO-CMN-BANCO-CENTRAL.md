# MISSÃO BANCÁRIA — APLICAÇÃO DE CMN E BANCO CENTRAL

Data: 26/09/2026. Fase 1, continuidade autorizada.
Branch: `feat/missao-bancaria-aplicacao-cmn-bcb`.
Base de código: `08f9b07f0e3cbc16a1eb40dc4c14195d73222f69` (aplicação introdutória da PR #503).

## Entrega delimitada

Seis atividades de explicação e aplicação, três após a aula do Conselho Monetário Nacional e três após a aula do Banco Central. Reutilizam o leitor e o painel formativo anteriores. Não são perguntas novas para inflar a avaliação pontuada: são situações para verificar o raciocínio após o material de ensino.

As explicações completas das aulas são preservadas. Nenhum conceito necessário é introduzido pela primeira vez no comentário de correção. O suporte de cada caso foi localizado nas seções já existentes antes da redação da atividade.

## CMN — três objetivos

| ID | O que verificar | Onde foi ensinado |
| --- | --- | --- |
| `apply.cmn.escala.v1` | Separar diretrizes para o sistema da aprovação de um contrato; não inferir ausência de regras para o banco. | `papel`, `diferencas`, `exemplo-orientacao` |
| `apply.cmn.composicao.v1` | Preservar partes verdadeiras de uma frase e corrigir a confusão entre participar e presidir. | `composicao`, `exemplo-composicao`, `glossario` |
| `apply.cmn.metas.v1` | Explicar por que metas do conselho e autonomia do Banco Central são compatíveis. | `diferencas`, `papel` |

## Banco Central — três objetivos

| ID | O que verificar | Onde foi ensinado |
| --- | --- | --- |
| `apply.bcb.nomes.v1` | Distinguir Banco do Brasil e Banco Central, serviço ao cliente e supervisão. | `nome`, `supervisao`, `exemplo-nomes` |
| `apply.bcb.precos.v1` | Não confundir um preço isolado com estabilidade geral nem inventar sucesso/fracasso a partir de um dado insuficiente. | `politicas` |
| `apply.bcb.escopo.v1` | Reconhecer que uma competência delimitada não prova exclusividade sobre toda atividade ligada a dinheiro. | `supervisao`, `exemplo-supervisao` |

Cada situação inclui comentário completo, três critérios para comparar o próprio raciocínio e links **Reler** para os trechos da mesma aula. São casos fictícios identificados, sem aconselhamento financeiro nem taxa atual. O caso sobre o campo de supervisão dispensa citar outros supervisores que só serão ensinados depois.

## Comportamento e limites

O painel continua opcional, sem nota, XP ou avaliação automática. Responder mentalmente é permitido. Escrever no rascunho e revelar o comentário não registra uma tentativa nem conclui a missão. O rascunho permanece apenas no DOM da missão aberta; não é transmitido ou salvo na conta. Consultar uma seção mantém a seleção das questões pontuadas.

Com esta entrega, há nove atividades formativas em três aulas: três da introdução e seis novas. Continuam **38 questões pontuadas**, com os mesmos IDs, alternativas, respostas, XP, ordem e regra do Chefe. As seis outras missões não recebem atividades sem planejamento próprio; seu material de ensino continua disponível.

## Integração

- `sfn-aplicacao-cmn-bcb-v1.js` define o conteúdo e sua validação.
- O manifesto anexa as atividades à seção `resumo` de cada uma das duas aulas.
- A versão do suplemento é 1; a versão do material de ensino continua 2 porque o texto das seções não foi alterado.
- O leitor já renderiza `applicationTasks` de qualquer missão. **Nenhum CSS, HTML, controlador de interface, endpoint ou tabela precisou mudar.**
- A aplicação do suplemento é idempotente: não duplica conteúdo se chamada novamente.
- Uma âncora ausente ou um suplemento conflitante não é apagado nem substituído silenciosamente; a validação detecta o conflito.
- O teste do catálogo compara o texto integral antes/depois para comprovar que a prática foi adicionada sem encurtar o ensino.

Não há novo acesso de usuário, publicação ampla, segredo, permissão, telemetria ou alteração de gate de deploy.

## Fontes consultadas nesta sessão

1. Ministério da Fazenda, apresentação e composição do CMN: https://www.gov.br/fazenda/pt-br/assuntos/cmn
2. Planalto, Lei Complementar nº 179/2021, arts. 1º, 2º e 6º: https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp179.htm
3. Portal do Investidor/CVM, estrutura do Sistema Financeiro Nacional: https://www.gov.br/investidor/pt-br/investir/como-investir/conheca-o-mercado-de-capitais/sistema-financeiro-nacional/

As três páginas foram abertas nesta sessão. Foram usados a divisão de funções, os objetivos/autonomia do Banco Central e a composição do conselho por cargos, não nomes de autoridades. As referências já existentes das aulas permanecem no catálogo; não foram carimbadas como novamente lidas páginas que retornaram apenas dependência de JavaScript.

## Validação e evidências

**Executado localmente:** sintaxe e sete testes Node com fixtures, todos aprovados. Cobrem estrutura dos seis casos, referências, preservação, idempotência, escopo, falta de ensino e colisão de suplemento. Não foi executado navegador local nesta rodada. O acesso direto ao GitHub pelo ambiente local falhou por DNS; a leitura/escrita no repositório foi feita pelo conector.

**Preparado no CI:** testes do catálogo real validam os nove casos, texto preservado, fontes e ausência de pontuação. A suíte do navegador mantém os 22 cenários anteriores e acrescenta cinco: CMN/Banco Central em claro/escuro com rascunhos e respostas preservados, mais troca de missão sem misturar atividades. Total previsto: 27 cenários. Resultado remoto deve ser lido antes de ser declarado aprovado.

Os testes negativos anteriores não foram removidos. A mudança na contagem esperada de missões com suplemento (de uma para três) é acompanhada de verificação exata dos IDs e do total de nove atividades; não é relaxamento para aceitar qualquer número.

## Situação das dependências nesta rodada

A repetição da auditoria geral da PR #502 concluiu com sucesso no job `108447920775`, run `36254703571`, no mesmo head já testado. Não foi alterado baseline, tolerância ou código para fazer a repetição passar.

A PR #502 foi incorporada à main no commit `517c42a7511c2c72d01c242690fd32257b237ec3`. A PR #503 foi redirecionada à main. Seu estado final e os builds são registrados nos comentários de integração; este documento não presume resultado ainda não observado.

Esta nova entrega depende do conteúdo/formato da #503. Não misturar merge, build, versão em produção e compreensão humana. A avaliação de Wellyton continua pendente para quando ele acessar, sem solicitar teste imediato.

## Próxima ação

Concluir os resultados das dependências e do novo CI; integrar as versões elegíveis e verificar a publicação separadamente. Depois desenvolver aplicação para Copom e CVM, em recortes com pré-requisitos claros, sem sacrificar as aulas. Não declarar a Fase 1 homologada apenas pelos testes.
