# Central de Documentos — Homologação e testes de navegador V1

Data: 14/09/2026  
Fase relacionada: 3 — Editor PDF essencial  
Estado: infraestrutura-base preparada em branch isolada; sem alteração em produção.

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

## Próxima camada — depende do Cloudflare/Work

Quando o Work/Codex voltar a estar disponível, usar o MCP oficial `cloudflare-api` já autenticado para criar o ambiente remoto de homologação:

- frontend de staging/preview separado da produção;
- Worker de staging separado;
- D1/bindings de staging separados quando necessários;
- origem e CSP próprias;
- proteção por Cloudflare Access;
- `noindex,nofollow,noarchive`;
- dados exclusivamente fictícios;
- previews por branch/PR;
- jamais compartilhar Google Drive institucional com staging.

A configuração remota deve ser registrada no status antes de qualquer promoção.

## Regra de promoção

O ambiente de homologação não substitui os critérios do Guia Mestre. Ele acrescenta uma barreira automática:

`branch -> testes unitários/estáticos -> Playwright -> preview/homologação -> PR -> main -> produção`

A 3C.2 continua bloqueada até a 3C.1 ser corrigida e validada.
