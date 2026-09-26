# MISSÃO BANCÁRIA — LEITURA NO CELULAR E TRANSIÇÃO À PRÁTICA

Data: 26/09/2026.
Fase ativa: Fase 1, dentro da continuidade autorizada por Wellyton.
Base: `a2ed4e74695001cfcd87ec166eb6b060dc57d060`.
Estado inicial: implementado e testado localmente; CI, merge e publicação devem ser registrados separadamente na PR desta entrega.

## Objetivo

A PR #501 desenvolveu o material de ensino. Esta entrega torna esse mesmo texto mais fácil de percorrer no celular e separa explicitamente a leitura da verificação de compreensão. Não troca explicações completas por resumos nem produz novas perguntas para compensar falta de ensino.

## Experiência implementada

- A missão abre em **1. Ler a aula**, exibindo inicialmente a primeira parte.
- **Partes da aula** permite escolher qualquer seção pelo título; **Anterior** e **Próxima parte** percorrem a ordem do texto.
- **Aula inteira** exibe todas as seções para consulta contínua e busca no navegador.
- Controles **A− / A+** ajustam o texto em quatro tamanhos, de 1,125 a 1,5 rem. A preferência vale enquanto a página estiver aberta; não foi criado armazenamento de preferência no servidor.
- **2. Praticar** e **Testar minha compreensão** mostram recordação e as questões existentes.
- **Consultar a aula** volta ao mesmo trecho de leitura, mantendo alternativas selecionadas, respostas já enviadas e feedback.
- A troca de painel não reabre a missão, não cria outra sessão, não chama o backend e não reinicia o cronômetro.
- As fontes permanecem disponíveis em uma seção expansível.

Não há tempo mínimo de leitura, bloqueio por quantidade de cliques ou concessão de XP por mudar de seção. O usuário decide quando tentar a prática. Parte visitada não é parte comprovadamente aprendida.

## Progresso com significado explícito

A barra de questões deixava 35% preenchidos ao abrir uma missão sem respostas. Agora começa em zero e representa apenas a quantidade de questões respondidas, identificada em texto e por atributos acessíveis. A posição na leitura aparece separada como **Parte N de M**, sem inferir retenção.

O cartão de cada missão passa a chamar o valor existente de **Acerto nas tentativas**, em lugar de **Domínio atual**. O cálculo do backend não foi alterado; a nova legenda evita chamar desempenho imediato de domínio duradouro.

## Leitura e navegação acessíveis

- Texto com espaçamento entre linhas e largura adaptável.
- Botões novos com área mínima de 44 por 44 pixels CSS.
- Navegação por botões e seletor nativos, com nomes e estados acessíveis.
- Foco reposicionado no título do trecho/prática; retorno ao dashboard após sair.
- Cabeçalho e corpo rolável em layout flexível, sem depender das antigas alturas fixas de 76/134 pixels para posicionar barras.
- Elementos marcados `hidden` realmente ficam ocultos mesmo quando o CSS define `display:flex/grid`.
- Cabeçalho do portal ao fundo fica `inert` durante o modo foco.
- Não se desativa zoom do navegador nem se usa vídeo obrigatório.

Referências técnicas consultadas nesta rodada:
- W3C, Reflow: https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
- W3C, Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
- MDN, atributo hidden e precedência de display: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/hidden

São referências de implementação, não declaração de certificação WCAG integral. Não foi realizada auditoria com todas as tecnologias assistivas.

## Compatibilidade e segurança

Novo controlador `js/studies-reader.js`, sem rede, APIs de armazenamento, notas ou recompensas. O cliente existente o monta após preencher a missão. O HTML permanece linear e estudável quando esse script não carrega: não oculta todo o ensino/prática por depender da melhoria visual.

As explicações são renderizadas com `textContent`, não interpretadas como HTML. O texto original, incluindo conceitos e exemplos, permanece integralmente disponível. O DOM das questões não é reconstruído ao alternar painéis.

Não alterados:
- `worker/studies.js`, autenticação, namespace de API ou regra exclusiva de `wellyton`;
- conteúdos em `worker/studies-content/`, IDs, gabaritos e regras do Chefe;
- D1, tabelas, migrações, XP, conquistas ou histórico;
- contrato de respostas, conclusão e revisões;
- CSS e JavaScript globais do portal;
- gate produtivo, secrets, bindings e política de telemetria.

Mantidas as regras atuais: aulas normais podem reconhecer perguntas anteriores; revisões e Chefe começam sem reaproveitar histórico na interface. A nova navegação não certifica isolamento completo de rodadas no backend: essa pendência anterior continua registrada.

## Testes desta entrega

### Locais executados

- Sintaxe dos dois scripts e configuração de testes.
- **5 testes Node aprovados**: limites de navegação, progresso real das questões, fallback, ausência de chamadas de escrita pelo leitor e dependências/painéis.
- **12 cenários Chromium sintéticos aprovados**: 320×568, 390×844, 768×1024 e 1280×800, em claro/escuro; mais retomada de aula, revisão, Chefe e ausência do controlador.
- Verificados texto preservado, aumento de fonte, ausência de rolagem horizontal no corpo do leitor, seleção/respostas preservadas e ausência de sessões/recompensas extras ao consultar a aula.
- Capturas locais de 390 e 1280 pixels foram inspecionadas.

Limite da execução local: o Chromium do ambiente recusou navegação por URL, inclusive localhost. O teste usou documento offline com DOM/JS/CSS do módulo, autenticação sintética e estilo global simplificado. A CSP/links externos foram removidos SOMENTE da fixture local para injeção dos scripts; a CSP do produto não foi relaxada. Não houve uso de sessão real.

### CI incluído

- `worker/tests/studies-reader.test.mjs` na suíte normal.
- `testing/browser/studies-reader.config.mjs` e `studies-reader.spec.mjs`: **14 cenários**, acrescentando teclado, texto tratado como texto e outra conta.
- Job específico no workflow da Missão Bancária com o Playwright já fixado em `testing/browser/package.json`.
- O teste de CI usa o HTML e CSS reais do repositório e intercepta recursos e autenticação; não acessa a API produtiva.
- Nenhum teste anterior é retirado nem relaxado. Consultar o resultado do novo head antes de marcar CI como aprovado.

## Limites e próxima etapa

Esta entrega melhora a leitura e a transição para a prática; não afirma ter ampliado a avaliação de aplicação ou criado novos itens. A próxima unidade de desenvolvimento é preparar verificações de compreensão/aplicação apoiadas no ensino existente, em recortes pequenos, sem reaproveitar a mesma frase como única prova de aprendizado.

A posição da seção é preservada ao consultar a aula dentro da missão aberta, não prometida como marcador sincronizado após fechar/recarregar a página. Persistência dos dados de estudo continua responsabilidade dos fluxos existentes.

Não solicitar acesso imediato a Wellyton. A autorização de continuidade permite revisão e integração tecnicamente elegíveis; a avaliação humana de clareza fica para uso posterior. Não encerrar a Fase 1 por testes de interface.
