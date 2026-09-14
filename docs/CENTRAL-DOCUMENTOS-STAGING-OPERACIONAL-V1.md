# Central de Documentos — staging remoto operacional V1

Data: 14/09/2026  
Estado: código/CI preparados e mesclados (#175/#176); criação remota bloqueada nesta sessão pela ausência do MCP `cloudflare-api` exposto.

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

Essa evolução depende de acesso confirmado ao MCP oficial Cloudflare na sessão de execução. A autenticação relatada anteriormente não garante disponibilidade em todo chat. Segredos futuros de staging deverão ser próprios; não copiar os de produção.

## Conferência operacional — 14/09/2026

Main confirmada em `313101db4b6fb34ea503205e6cfa55a1c71864f8`. Build sintético local aprovado. Nenhuma ferramenta Cloudflare exposta nesta sessão; busca de integração retornou vazia. Inventário e configuração remotos não executados. Nenhuma URL de staging/preview foi obtida, nenhum recurso foi criado e produção permaneceu inalterada.

Antes de retomar, confirmar a integração e inventariar recursos existentes. Preservar a configuração de build acima. Não substituir por outro serviço nem assumir que um nome sugerido está disponível.

Access deve cobrir os endereços efetivamente acessíveis do projeto, incluindo staging, previews e domínio personalizado; validar acesso negado sem autenticação e permitido para identidade autorizada. A identidade autorizada (usuários/grupo/provedor) depende de política existente comprovada ou decisão do responsável. Não deduzir autorização pelo e-mail do autor de commits.

A validação remota deve observar cabeçalhos HTTP reais: presença de `_headers` no bundle e smoke test com servidor Python não comprovam aplicação desses cabeçalhos pela Cloudflare. Conferir também rede sem Worker/Drive institucional e ausência de persistência/cache/analytics documental.

Previews: criar ou reutilizar branch/PR não destrutiva somente depois da integração Pages estar pronta; registrar URL retornada pelo deploy e commit correspondente, sem fazer merge experimental. O Playwright atual usa servidor local fixo; a validação do endereço remoto e eventual credencial de serviço Access do CI precisam ser integradas/testadas antes de declarar o fluxo remoto automatizado concluído. Não colocar credenciais em URL, logs ou repositório.

A arquitetura futura permanece frontend + Worker + D1/bindings próprios de staging, com conta Drive fictícia e OAuth separado, apenas quando testes de backend exigirem. Nenhum desses recursos é necessário agora.
