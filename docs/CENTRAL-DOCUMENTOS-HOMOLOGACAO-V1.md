# Central de Documentos — Homologação e testes de navegador V1

Data: 14/09/2026  
Fase relacionada: 3 — Editor PDF essencial  
Estado: laboratório local + CI + Cloudflare Pages operacionais; PR funcional em homologação, sem alteração em produção.

## Objetivo

Criar uma camada de validação que detecte regressões reais do visualizador/editor antes de qualquer merge na `main`, sem usar documentos clínicos reais e sem depender do usuário como executor manual de todos os testes.

A necessidade foi comprovada pelo reteste real da 3C.1e: os checks existentes ficaram verdes, mas o visualizador PDF.js ainda falhou em produção.

## Primeira camada implementada nesta branch

A branch adiciona um laboratório local determinístico para o visualizador PDF.js:

- `testing/central-docs/viewer-harness.html`: superfície mínima que usa o mesmo `js/document-viewer.js` e os mesmos assets PDF.js self-hosted do Portal;
- `testing/central-docs/fixture.js`: PDF sintético embutido em base64, sem dado real, com três páginas incluindo retrato, paisagem e rotação;
- `testing/browser/`: Playwright com Chromium desktop e perfil mobile;
- workflow `Validar Central de Documentos — navegador`;
- captura automática de trace, screenshot e vídeo quando houver falha.

## Critérios do teste de navegador

O teste falha se qualquer um destes pontos não for atendido:

1. PDF.js abre o PDF sintético;
2. página 1 renderiza em canvas com dimensões reais;
3. miniatura da página 1 renderiza;
4. o documento expõe exatamente três páginas;
5. callback de primeira página visível ocorre;
6. zoom responde;
7. Ajustar largura responde;
8. navegação pela segunda miniatura muda a página ativa;
9. não ocorre erro de console/pageerror.

## Segurança e privacidade

- nenhum PDF clínico é utilizado;
- fixture é explicitamente sintética;
- nenhum token, cookie, fileId ou nome de paciente entra no laboratório;
- nenhum acesso ao Google Drive é necessário nesta primeira camada;
- nenhum segredo é armazenado no GitHub;
- nenhum deploy em produção é feito por este workflow;
- artefatos de diagnóstico contêm apenas a fixture fictícia e a UI de laboratório.

## Staging remoto operacional

O ambiente remoto já existe no Cloudflare Pages como `portal-regulacao-central-staging`.

Estado atual:
- URL canônica: `https://portal-regulacao-central-staging.pages.dev/`;
- previews automáticos por branch/PR: operacionais;
- bundle: exclusivamente sintético, sem Google Drive, Worker/D1 de produção, secrets ou documentos clínicos;
- `noindex,nofollow,noarchive`, `no-store` e CSP restritiva: preservados;
- Cloudflare Access: pendente de decisão humana de identidade/política;
- domínio personalizado: pendente enquanto a zona não estiver acessível;
- Worker/D1 de staging: não necessários para a versão estática atual.

O staging público só pode continuar usando dados fictícios enquanto Access estiver pendente.

## Regra de promoção

O ambiente de homologação não substitui os critérios do Guia Mestre. Ele acrescenta uma barreira automática:

`branch -> testes unitários/estáticos -> Playwright -> preview/homologação -> PR -> main -> produção`

A 3C.2 continua bloqueada até a 3C.1 ser corrigida e validada.


## Resultado do primeiro ciclo automatizado — 14/09/2026

O laboratório já encontrou uma regressão que o CI anterior não detectava:

- o build moderno do PDF.js 6.3.289 falhou no Chromium automatizado com `getOrInsertComputed is not a function`;
- a falha é compatível com o erro observado pelo usuário em produção;
- a solução adotada foi usar o build **legacy oficial** da mesma versão 6.3.289, mantendo módulo e worker pareados;
- o build legacy foi self-hosted em `vendor/pdfjs-legacy/`;
- os recursos auxiliares da mesma versão permanecem em `vendor/pdfjs/`;
- não foi adicionado polyfill global ao Portal.

Após a correção, o Playwright passou em desktop e mobile para:
- Blob local;
- URL sintética;
- página 1;
- miniatura;
- zoom;
- Ajustar largura;
- navegação por miniatura;
- callback de primeira página visível.

Esse ciclo criou o baseline automatizado que posteriormente passou a ser publicado também no staging Cloudflare.


## Cobertura atual da 3C.1 — superfície única do editor

No head funcional `b02f2addf6eba16f383cc8ff7804c6eaee0b7879` do PR #179:

- **24/24 workflows** do GitHub concluíram com sucesso;
- o workflow de navegador executou **16/16 testes aprovados** em Chromium desktop e perfil Pixel 7;
- o editor permanece dentro da mesma superfície PDF.js;
- não existe lista textual paralela como editor principal;
- não existe `iframe`, `embed` ou `object` para o PDF;
- mover, excluir, undo/redo, adicionar imagem e unir PDF atualizam a mesma superfície;
- página ativa e zoom são preservados após **Atualizar PDF** e após rebuild de edição;
- corrida A → B → C de aberturas concorrentes é coberta deterministicamente;
- PDF-lib e PDF.js são self-hosted; o CSP da Central não depende mais de jsDelivr;
- o editor continua local e **não escreve no Google Drive** nesta fase;
- a permissão de editar continua explícita (`can_edit`) e não é herdada automaticamente do papel Regulador(a).

O deployment imutável correspondente foi publicado com sucesso em:

`https://cd41605e.portal-regulacao-central-staging.pages.dev/`

O alias estável da branch é:

`https://codex-central-docs-editor-su.portal-regulacao-central-staging.pages.dev/`

A matriz 14/14 é executada pelo GitHub Actions contra o bundle sintético construído no CI. A validação visual do deployment remoto continua sendo uma barreira separada antes do merge; não confundir CI de navegador com teste institucional em produção.

## Roteiro obrigatório de promoção para produção

Após aceite visual do preview e revisão final do PR:

1. mesclar somente com todos os checks obrigatórios verdes;
2. aguardar o deploy de produção;
3. usuário autorizado abrir `/documentos/` e um PDF institucional permitido;
4. confirmar canvas + miniaturas do PDF.js próprio e ausência de visualizador nativo;
5. navegar para uma página diferente e alterar o zoom;
6. entrar em **Editar PDF** e confirmar que permanece na mesma superfície;
7. executar **Atualizar PDF** e confirmar preservação de página/zoom;
8. mover e excluir página; validar undo/redo;
9. adicionar imagem e validar a nova página;
10. unir um segundo PDF autorizado;
11. sair do editor e confirmar retorno ao PDF original em somente leitura;
12. abrir rapidamente outro PDF e confirmar que o documento anterior não reassume a superfície;
13. confirmar que nenhuma operação escreveu no Drive e que não houve telemetria sensível;
14. registrar o aceite real no status.

Somente depois desse aceite a 3C.1 pode ser encerrada e a 3C.2 liberada.


### Reorganização por arraste e rotação

Após o aceite humano rejeitar as setas ↑/↓ como interação final, a reorganização da Fase 3 foi ajustada para drag-and-drop.

Validação no head `ec518dc024ec79ea5ab52012082bcc68cdb99d36`:
- arrastar miniatura altera a posição exata no plano do PDF;
- feedback visual mostra inserção antes/depois;
- desktop usa Pointer Events diretamente sobre a miniatura;
- touch usa grip ⠿ com Pointer Events;
- setas ↑/↓ foram removidas da interface;
- ↻ gira a página 90° para a direita;
- rotação e reordenação integram Desfazer/Refazer;
- o PDF reconstruído pelo PDF-lib conserva as alterações;
- Playwright final: **16/16**, desktop + mobile;
- deployment imutável: `https://7c94b5a6.portal-regulacao-central-staging.pages.dev/`.

Essa homologação continua sintética. O merge depende do novo aceite visual humano.
