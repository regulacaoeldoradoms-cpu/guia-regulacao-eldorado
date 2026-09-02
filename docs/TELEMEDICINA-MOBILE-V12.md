# Telemedicina Mobile V12

## Objetivo

A V12 corrige a regressão visual do botão `Solicitado` observada após a centralização da V11 e reforça a identidade visual da Telemedicina no celular sem alterar o desktop.

## Decisões permanentes

- o botão `Solicitado` deve usar o próprio texto do botão e nunca depender de pseudo-elemento para existir visualmente;
- o botão deve permanecer horizontal, legível, com largura estável e área de toque confortável em Lista e Grade 2x2;
- a tela mobile não deve parecer uma única folha branca: workspace, filtros, cards, blocos clínico-operacionais e ações devem ter separação visual clara;
- a identidade deve continuar coerente com o azul e o verde/teal do Portal da Regulação, usando cores suaves e institucionais;
- `Solicitar agora`, `Atrasados`, `Em aguardo`, `Sem programação` e `Data operacional` podem usar fundos tonalizados diferentes para facilitar leitura rápida;
- os cards de pacientes devem manter fundo claro, bordas e sombras discretas, com blocos internos diferenciados para paciente, especialidade/status, retorno/avisos e ações;
- os formulários sanfonados permanecem funcionais e visualmente separados, sem voltar ao modelo de modal no mobile;
- o desktop permanece inalterado.

## Correção do botão

A V6 escondia o texto real do botão com `color: transparent` e `text-indent: -9999px`, substituindo-o por `::before`. Depois da V11, esse mecanismo passou a colapsar visualmente em alguns cards da Grade 2x2. A V12 neutraliza explicitamente esse pseudo-elemento e restaura o texto real, a orientação horizontal e a largura correta do botão.

## Escopo

Arquivos principais:

- `css/telemedicina-mobile-v12.css`
- `telemedicina/index.html`
- `.github/workflows/validate-telemedicine-mobile-v12.yml`

Nenhuma regra de negócio, dado de paciente, API, autenticação ou comportamento desktop é alterado pela V12.
