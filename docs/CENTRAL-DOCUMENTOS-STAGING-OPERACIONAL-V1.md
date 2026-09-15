# Central de Documentos — staging remoto operacional V1

Data: 14/09/2026  
Estado: Cloudflare Pages criado e validado; Access e domínio personalizado pendentes.

## Objetivo e escopo

Disponibilizar um ambiente remoto isolado para validar visualmente o PDF.js/editor sem publicar o Portal completo nem conectar dados institucionais.

A primeira versão nasceu como laboratório sintético do visualizador e evoluiu para validar também a superfície única do editor da 3C.1. A 3C.2 não foi iniciada.

## Controle de versão verificado

Antes da criação do ambiente, a `main` remota de `regulacaoeldoradoms-cpu/guia-regulacao-eldorado` foi confirmada duas vezes em:

```text
313101db4b6fb34ea503205e6cfa55a1c71864f8
```

O deployment inicial do projeto foi construído exatamente desse commit, conforme os metadados do Cloudflare Pages.

## Projeto Cloudflare Pages

- conta: ID `467be828c364ccf084240c34bb609b42`;
- projeto: `portal-regulacao-central-staging`;
- ID: `f9937ede-dc00-42a0-8207-581d39a04de9`;
- URL canônica: `https://portal-regulacao-central-staging.pages.dev/`;
- repositório: `regulacaoeldoradoms-cpu/guia-regulacao-eldorado`;
- branch de produção do projeto de staging: `main`;
- build command: `node scripts/build-central-docs-staging.mjs`;
- output directory: `dist-staging`;
- cache de build: habilitado;
- deployments de produção: habilitados;
- previews: todas as branches, com comentários em Pull Requests habilitados.

Deployment inicial:

- ID: `fbb103cb-e043-4c8a-9fa0-226dadc5a0c9`;
- URL imutável: `https://fbb103cb.portal-regulacao-central-staging.pages.dev/`;
- ambiente: `production` do projeto de staging;
- branch: `main`;
- commit: `313101db4b6fb34ea503205e6cfa55a1c71864f8`;
- etapas de fila, inicialização, clone, build e deploy: concluídas com sucesso.

## Bundle publicado

O bundle contém somente:

- harness do visualizador;
- PDF sintético de três páginas;
- CSS necessário;
- `document-viewer.js` e `document-editor.js`;
- PDF.js legacy 6.3.289, PDF-lib self-hosted e recursos locais necessários;
- `robots.txt`;
- `_headers` com noindex, no-store e CSP restritiva;
- manifesto declarando `syntheticOnly: true` e `productionApisIncluded: false`.

Ele **não contém** frontend autenticado do Portal, endpoint do Worker de produção, Google Drive, Google APIs, D1, tokens, secrets ou documentos reais.

## Isolamento de produção

Nos ambientes `production` e `preview` do projeto Pages:

- variáveis de ambiente e secrets: nenhum;
- bindings D1: nenhum;
- bindings KV: nenhum;
- bindings R2: nenhum;
- Service bindings: nenhum;
- Workers AI bindings: nenhum;
- Pages Functions: não utilizadas.

O Worker `yellow-wave-d0a1guia-regulacao-ia` e o D1 `portal-regulacao-users` são recursos de produção e permaneceram totalmente intocados. Não houve modificação, reinício, redeploy, cópia de bindings ou alteração de configuração desses recursos.

Não foi criado Worker nem D1 de staging, pois esta versão é integralmente estática.

## Cloudflare Access

Estado: **pendente; ambiente ainda público**.

Os endpoints específicos de Access retornaram `access.api.error.not_enabled`. A ativação exigiria inicializar Cloudflare Access no nível da conta e escolher:

- `auth_domain` único;
- nome da organização;
- provedor de identidade;
- pessoas, endereços ou domínios autorizados;
- duração da sessão;
- eventual requisito de MFA.

Essas são decisões humanas de identidade e política. Nenhuma foi presumida e nenhuma configuração Zero Trust/Access foi alterada. Como o staging contém apenas dados sintéticos e não possui backend institucional, ele permanece disponível para validação técnica, mas **não deve ser tratado como ambiente compartilhável protegido enquanto Access estiver pendente**.

## Domínio personalizado

Estado: **pendente**.

A conexão não possui zona Cloudflare acessível para `regulacaoeldoradoms.com.br`. Por isso, `staging.regulacaoeldoradoms.com.br` não foi criado e nenhum DNS externo foi tentado. Até a zona estar disponível, deve-se usar a URL `pages.dev`.

## Preview de branch comprovado

Foi criada a branch não destrutiva `codex/central-docs-staging-registro` diretamente do mesmo SHA confirmado da `main`. O push disparou um deployment de preview separado via integração GitHub, sem merge de alteração experimental e sem alterar a produção.

- deployment ID: `d4b0ac1e-dae2-43b1-b5cc-7975082af17f`;
- URL imutável: `https://d4b0ac1e.portal-regulacao-central-staging.pages.dev/`;
- alias estável da branch: `https://codex-central-docs-staging-r.portal-regulacao-central-staging.pages.dev/`;
- origem do gatilho: `github:push`;
- ambiente: `preview`;
- clone, build e deploy: concluídos com sucesso.

O alias respondeu HTTP `200`, exibiu **DADOS FICTÍCIOS** e preservou `X-Robots-Tag`, `Cache-Control` e CSP.

## Validação executada

URL testada: `https://portal-regulacao-central-staging.pages.dev/`

Resultados funcionais:

- página principal respondeu HTTP `200`;
- selo **DADOS FICTÍCIOS** visível;
- estado pronto no PDF.js 6.3.289;
- PDF sintético com exatamente três páginas;
- página principal renderizada em canvas;
- três miniaturas renderizadas;
- zoom validado em desktop, de `182%` para `197%`;
- zoom validado em mobile, de `57%` para `72%`;
- **Ajustar largura** validado em desktop (`182%`) e mobile (`57%`);
- navegação pela miniatura da página 2 validada;
- layout desktop validado em `1440 x 1000`;
- layout mobile validado em `412 x 915`;
- nenhum erro de console ou de página.

Resultados de segurança e indexação:

- `robots.txt`: `User-agent: *` e `Disallow: /`;
- `X-Robots-Tag: noindex, nofollow, noarchive`;
- `Cache-Control: no-store`;
- `Referrer-Policy: no-referrer`;
- `X-Content-Type-Options: nosniff`;
- `X-Frame-Options: DENY`;
- CSP confirmada com `default-src 'self'`, `connect-src 'self'`, `object-src 'none'`, `base-uri 'none'`, `form-action 'none'` e `frame-ancestors 'none'`.

Resultados da captura de rede:

- seis requisições GET no carregamento validado;
- todas as requisições destinadas a `portal-regulacao-central-staging.pages.dev`;
- nenhuma requisição para `yellow-wave-d0a1guia-regulacao-ia.regulacaoeldoradoms.workers.dev`;
- nenhuma requisição para Google APIs ou Google Drive;
- nenhuma requisição para rota `/api/`;
- nenhum acesso a D1 ou dados institucionais, coerente com a ausência de Functions e bindings.

## Riscos e limitações conhecidos

1. O ambiente está público enquanto Access não for habilitado. A mitigação atual é o conteúdo exclusivamente sintético, sem backend ou dados institucionais.
2. O domínio personalizado depende de acesso futuro à zona/DNS.
3. `staging-manifest.json` registra `sourceSha: null`, pois o builder lê `GITHUB_SHA` e o Pages fornece metadados próprios. A proveniência do deployment continua confirmada pela API do Pages no SHA exato.
4. O ambiente valida visualizador e editor da 3C.1 com dados sintéticos; ele não substitui o reteste institucional pós-deploy e não inicia a 3C.2.

## Próximo passo exato

1. concluir o aceite humano do preview da 3C.1 no alias da branch;
2. obter a revisão final do PR #179 quando o serviço de code review estiver disponível;
3. manter o PR sem merge enquanto houver P1/P2 pendente, check vermelho ou ausência de aceite humano;
4. após merge/deploy, executar o smoke test institucional descrito em `CENTRAL-DOCUMENTOS-HOMOLOGACAO-V1.md`;
5. tratar Cloudflare Access e domínio personalizado em tarefa de infraestrutura separada antes de qualquer staging com dados/integrações reais;
6. manter a 3C.2 bloqueada até o aceite explícito da 3C.1.

## Evolução futura

Somente quando for necessário testar autenticação, Drive ou backend:

- criar Worker **staging** separado;
- criar D1 e bindings de staging separados;
- usar contas e documentos estritamente fictícios;
- nunca reutilizar OAuth ou Drive institucional de produção;
- nunca copiar secrets de produção sem necessidade técnica e aprovação;
- manter produção e staging com nomes, domínios e bindings inequivocamente distintos.


## Evolução — preview da superfície única do editor

PR funcional: **#179 — Central de Documentos: unificar visualizador e editor PDF**.

Evidência do head funcional `b02f2addf6eba16f383cc8ff7804c6eaee0b7879`:
- deployment Cloudflare Pages: sucesso;
- URL imutável: `https://cd41605e.portal-regulacao-central-staging.pages.dev/`;
- alias da branch: `https://codex-central-docs-editor-su.portal-regulacao-central-staging.pages.dev/`;
- GitHub Actions: **24/24 verdes**;
- Playwright do bundle sintético: **14/14 verdes**, desktop + mobile;
- cobertura: entrada/saída do editor na mesma superfície, mover/excluir, undo/redo, imagem, união, zoom, preservação de página/zoom e corrida de abertura;
- nenhuma integração de produção foi adicionada.

Access e domínio personalizado continuam pendências de infraestrutura e não bloqueiam esta homologação porque o conteúdo publicado é exclusivamente fictício.
