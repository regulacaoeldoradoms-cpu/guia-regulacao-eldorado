# MISSÃO BANCÁRIA — APLICAÇÃO GUIADA DEPOIS DA LEITURA

Data: 26/09/2026.
Fase ativa: Fase 1, continuidade autorizada sem exigir acesso imediato de Wellyton.
Base desta entrega: PR #502, head `1c902d5606429fc8700a349086b31df7aa84f6eb`.
Branch: `feat/missao-bancaria-aplicacao-guiada`.
Estado inicial: implementação em branch dependente do leitor; CI/merge/publicação serão registrados separadamente.

## Objetivo delimitado

Primeiro recorte da melhoria da avaliação: verificar explicação e aplicação, além do reconhecimento de uma alternativa. Não alterar as 38 questões pontuadas, seus gabaritos ou histórico para introduzir essa experiência.

Esta rodada adiciona **três atividades formativas à introdução do SFN**, depois do material de ensino. As outras aulas continuam com suas explicações completas; não foram declaradas dotadas dessa nova atividade. A ampliação da aplicação para os demais assuntos será feita em recortes posteriores.

## As três situações

1. Separar prestação de serviço, supervisão e orientação geral em três situações fictícias, justificando a classificação sem inventar nomes de instituições.
2. Corrigir a conclusão de que editar uma norma transforma o Banco Central no Conselho Monetário Nacional. O aluno precisa explicar por que uma palavra isolada não basta.
3. Explicar a intermediação financeira em contexto diferente do exemplo resolvido e reconhecer o limite da analogia, sem afirmar que um depósito específico foi entregue a uma pessoa determinada.

Cada caso possui enunciado, explicação possível, critérios para comparar o raciocínio e IDs dos trechos da aula que ensinam o conteúdo.

## Experiência

Na parte de prática da introdução, antes das questões pontuadas, aparece **Aplique com suas palavras**.

- O aluno pode explicar mentalmente ou usar um campo de texto opcional.
- **Comparar com uma explicação possível** revela comentário e critérios de autoavaliação, não uma nota automática.
- Botões **Reler** levam ao trecho correspondente da mesma aula.
- Voltar à prática preserva o rascunho, as alternativas selecionadas e as respostas pontuadas já enviadas enquanto a missão está aberta.
- Navegar, escrever e revelar o comentário não geram tentativas, XP, conclusão ou sessões adicionais.
- O campo informa que é temporário: não é enviado nem salvo na conta; recarregar ou abrir outra missão o apaga.

A atividade é opcional e não impede o acesso às questões. Ela não usa IA, não corrige texto automaticamente nem certifica domínio ou retenção. Seu propósito é permitir comparar ideias e identificar o que reler. A revelação é acessível mesmo sem digitar, pois o aluno pode responder mentalmente.

Na revisão da mesma aula, o suplemento continua sendo apenas material opcional de estudo. Não satisfaz a exigência de responder novamente às questões da revisão. O Chefe não recebe o suplemento e suas regras não mudam.

## Integração

- `worker/studies-content/sfn-aplicacao-v1.js`: casos autorais e vínculo ao material.
- O manifesto anexa os casos à seção `autoavaliacao` da introdução, com `applicationVersion: 1`.
- A API já transmite as seções da aula: não foi necessário criar endpoint, tabela ou modificar autenticação.
- `js/studies-reader.js`: painel formativo e navegação por ID de seção; texto renderizado com `textContent`.
- CSS restrito ao leitor; URLs do script/estilo atualizadas para evitar cache antigo.
- Bootstrap antigo sem o suplemento continua funcionando; o painel fica oculto.

O comentário de autoavaliação é material de ensino enviado com a aula, como um exemplo resolvido. Não é gabarito das questões pontuadas. O contrato público dessas 38 questões continua transmitindo somente ID, enunciado e alternativas antes da resposta.

## Preservação

Mantidos:
- textos e títulos das oito aulas, fontes, IDs e ordem das nove missões;
- 38 questões, respostas, XP, regra de conclusão, revisões e Chefe;
- acesso exclusivo de `wellyton`;
- dados no D1, sem migração ou exclusão;
- separação das conquistas de estudo e segurança;
- ausência de telemetria pedagógica externa;
- gates de publicação e todos os testes existentes.

A versão da aula permanece 2: este é um suplemento com versão própria, sem alteração do texto ou da avaliação pontuada. Não aumentar artificialmente a contagem de questões ou a barra de domínio por mostrar uma resposta-modelo.

## Fontes conferidas nesta rodada

As situações são fictícias e o texto é original. Os conceitos utilizados já foram ensinados na introdução e foram cotejados com:

- Portal do Investidor — estrutura do SFN, funções normativas, supervisoras e operacionais: https://www.gov.br/investidor/pt-br/investir/como-investir/conheca-o-mercado-de-capitais/sistema-financeiro-nacional/
- Ministério da Fazenda — função do CMN: https://www.gov.br/fazenda/pt-br/assuntos/cmn

Ambas as páginas foram abertas e lidas nesta sessão. O uso é conceitual; não há taxa atual, nome de dirigente ou nova regra de contratação. Os identificadores de fontes já existem no catálogo, sem duplicação.

## Testes

Executados localmente:
- sintaxe do novo módulo de conteúdo e do leitor;
- **cinco testes Node aprovados** com fixtures: material/referências, preservação dos objetos, escopo restrito, alvos ausentes e fonte ausente;
- **seis cenários Chromium sintéticos aprovados**, em 320/390/1280 pixels e claro/escuro: rascunho preservado ao consultar, revelação, navegação por ID, alternativa selecionada intacta, contador sem alteração e fonte ampliada sem rolagem horizontal;
- captura sintética de 390 pixels inspecionada.

Limite local: DOM e estilos-base simplificados para exercitar o novo controlador, não navegação autenticada no portal nem certificação de todo o CSS global.

Adicionados ao CI:
- dois testes que executam o catálogo real e conferem vínculo, fontes e preservação das 38 questões;
- oito testes de navegador com HTML/CSS do repositório e conteúdo real do catálogo, mas autenticação/API simuladas. Os 14 testes do leitor permanecem: total previsto da suíte específica, **22**;
- cenários verificam que o rascunho não aparece no corpo de chamadas, consulta não cria sessão nem concede pontos e bootstrap antigo continua funcional.

Resultados remotos devem ser lidos após o push; não são presumidos nesta versão do documento.

## Pendência da PR #502

Na auditoria geral anterior, 215 de 216 testes passaram. O único erro foi comparação de pixels na impressão escura de `/cidadao/`, fora dos arquivos alterados pelo leitor. Estilos calculados e erros JavaScript dessa comparação não apontaram diferença; isso não permite, sozinho, declarar a falha irrelevante.

Foi solicitada repetição do job `108439212958`, no run `36254703571`, SEM alterar código, tolerância, baseline ou teste. A nova tentativa usa job `108447920775`; estava em execução na última consulta antes deste registro. Não alegar auditoria aprovada enquanto o resultado não for lido. Esta entrega é empilhada para não reiniciar a validação do leitor.

## Próximo recorte

Após validar e integrar o leitor e este suplemento, desenvolver aplicação para CMN/Banco Central em unidades pequenas, mantendo ensino anterior, critérios claros e sem introduzir uma nota automática fictícia. Avaliação humana de clareza fica pendente para quando Wellyton acessar, sem solicitar teste imediato.
