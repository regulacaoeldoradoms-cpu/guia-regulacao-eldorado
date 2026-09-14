# Central de Documentos — staging remoto operacional V1

Data: 14/09/2026  
Estado: preparação de código; criação dos recursos Cloudflare depende do Work/Codex com `cloudflare-api`.

## Objetivo imediato

Disponibilizar um ambiente remoto seguro para validar visualmente o PDF.js/editor sem publicar o Portal completo nem conectar dados institucionais.

A primeira versão do staging remoto é deliberadamente pequena: publica **somente o laboratório sintético** já validado pelo Playwright.

## Bundle de staging

Comando de build:

```bash
node scripts/build-central-docs-staging.mjs
```

Diretório de saída:

```text
dist-staging
```

O bundle contém somente:

- harness do visualizador;
- PDF sintético;
- CSS necessário;
- `document-viewer.js`;
- PDF.js legacy 6.3.289 e recursos locais necessários;
- `robots.txt`;
- `_headers` com noindex, no-store e CSP restritiva;
- manifesto declarando `syntheticOnly: true`.

Ele **não contém** o frontend autenticado do Portal, endpoint do Worker de produção, Google Drive, D1, tokens ou documentos reais.

## Configuração Cloudflare Pages a executar no Work/Codex

Criar um projeto Pages separado, sugerido:

`portal-regulacao-central-staging`

Configuração:

- repositório: `regulacaoeldoradoms-cpu/guia-regulacao-eldorado`;
- branch de produção do projeto de staging: `main`;
- build command: `node scripts/build-central-docs-staging.mjs`;
- output directory: `dist-staging`;
- previews de Pull Request/branches: habilitados;
- domínio sugerido: `staging.regulacaoeldoradoms.com.br`;
- Cloudflare Access: obrigatório antes de uso compartilhado;
- indexação: bloqueada também por `robots.txt`, `X-Robots-Tag` e meta robots;
- nenhum secret é necessário para esta primeira versão.

## Validação após criação

1. abrir o domínio protegido;
2. confirmar o selo **DADOS FICTÍCIOS**;
3. confirmar renderização das três páginas;
4. testar miniaturas, zoom e Ajustar largura;
5. testar preview de uma branch/PR;
6. confirmar que não existem requisições para o Worker de produção;
7. confirmar cabeçalhos de segurança;
8. registrar IDs/nomes dos recursos Cloudflare no status sem registrar credenciais.

## Evolução futura

Somente quando for necessário testar autenticação/Drive/backend:

- criar Worker **staging** separado;
- criar D1/bindings staging separados;
- usar contas e documentos estritamente fictícios;
- nunca reutilizar o OAuth/Drive institucional de produção;
- nunca copiar segredos de produção sem necessidade técnica e aprovação;
- manter produção e staging com nomes, domínios e bindings inequivocamente distintos.

Essa evolução será feita no Work/Codex porque o MCP oficial Cloudflare já está autenticado naquela superfície.
