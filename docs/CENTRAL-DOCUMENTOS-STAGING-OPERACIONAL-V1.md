# Central de Documentos — staging remoto operacional V1

Data: 14/09/2026  
Estado: Cloudflare Pages criado e validado; Access e domínio personalizado pendentes.

## Objetivo e escopo

Disponibilizar um ambiente remoto isolado para validar visualmente o PDF.js/editor sem publicar o Portal completo nem conectar dados institucionais.

A primeira versão publica **somente o laboratório sintético** já validado pelo Playwright. A pendência funcional da integração visual do editor continua separada e a 3C.2 não foi iniciada.

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
- `document-viewer.js`;
- PDF.js legacy 6.3.289 e recursos locais necessários;
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
4. O ambiente valida o laboratório do visualizador; não resolve nem inicia a integração visual do editor ou a 3C.2.

## Próximo passo exato

1. revisar e mesclar a PR documental da branch `codex/central-docs-staging-registro`;
2. um responsável humano definir `auth_domain`, IdP, público autorizado, sessão e MFA;
3. habilitar Cloudflare Access e repetir a validação autenticada antes de compartilhar o staging;
4. quando a zona estiver acessível, associar `staging.regulacaoeldoradoms.com.br` e validar DNS, TLS e cabeçalhos;
5. manter a integração visual do editor e a 3C.2 fora desta tarefa.

## Evolução futura

Somente quando for necessário testar autenticação, Drive ou backend:

- criar Worker **staging** separado;
- criar D1 e bindings de staging separados;
- usar contas e documentos estritamente fictícios;
- nunca reutilizar OAuth ou Drive institucional de produção;
- nunca copiar secrets de produção sem necessidade técnica e aprovação;
- manter produção e staging com nomes, domínios e bindings inequivocamente distintos.
