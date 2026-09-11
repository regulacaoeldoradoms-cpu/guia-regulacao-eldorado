# Central de Documentos — Status

Última atualização: 11/09/2026

## Fase atual

**Fase 1 — Navegação do Google Drive**

Subfase atual: implementar a superfície read-only da Central, capabilities documentais e integração OAuth/Drive sem escrita.

## Estado de entrada

- Branch `main` verificada em `6f1169f38fce94da43ec51031226de74142de827`.
- A main já contém a observabilidade segura do PostHog para o Portal.
- Não existe integração Google Drive da Central no código atual.
- Não existia este arquivo de status antes desta fase.
- Há PR antigo de Telemedicina aberto (#107), sem relação com a Central; não deve ser misturado a este trabalho.
- PR #133 da Fase 0 foi validado com 21 workflows sem falhas e mesclado na main em `686b5774dfd51916b21b63d66fd8b4ff7a822795`.
- A arquitetura da Fase 0 está encerrada; a Central ainda não possui rota funcional, frontend, capabilities ou endpoints Drive.

## Branch / PR

Branch atual: `feat/central-docs-phase-1-drive-readonly`

PR atual: ainda não criado para a Fase 1.

## Entregas concluídas nesta unidade

- Fase 0 encerrada com PR #133 mesclado;
- 21 workflows do PR #133 concluídos com sucesso;
- branch da Fase 1 criada diretamente da main pós-merge;
- leitura do Guia Mestre V1.1 e aplicação do protocolo de continuidade;
- inspeção da main, arquitetura, autenticação, catálogo de ferramentas e política de observabilidade;
- confirmação de que a Central de Documentos ainda não foi implementada;
- pesquisa das regras atuais do Google Drive API/OAuth em documentação oficial;
- criação de `docs/CENTRAL-DOCUMENTOS-ARQUITETURA-V1.md`;
- criação deste arquivo de estado.

## Decisões tomadas

1. Google Drive continua sendo a fonte institucional; PDFs não serão copiados para D1/Firebase como repositório paralelo.
2. Integração usa Google Drive API v3 através do Cloudflare Worker.
3. A conta institucional é autorizada uma vez; usuários do Portal usam sessão/capabilities do próprio Portal.
4. Escopo previsto: `https://www.googleapis.com/auth/drive`, pois o requisito é navegar pelo Meu Drive completo e editar em fases posteriores.
5. Refresh token será armazenado criptografado no backend; navegador nunca recebe token permanente.
6. Capabilities documentais serão independentes dos cargos: `documents_view`, `documents_extract`, `documents_edit`, `documents_manage`.
7. Conteúdo documental terá `no-store` e cache somente efêmero em memória da sessão nesta versão.
8. Conflitos futuros serão detectados com a `version` do Drive antes da escrita.
9. Substituição futura só será considerada salva após confirmação real do Google Drive e preservará revisão recuperável.
10. A IA documental será separada da pré-regulação atual e não reutilizará automaticamente o endpoint existente.

## Justificativas

- O escopo `drive.file` não satisfaz o acesso a todo o acervo preexistente.
- Service account exigiria compartilhamento/migração do acervo e não representa o Meu Drive integral atual.
- Persistir PDFs localmente aumentaria risco de divergência e exposição.
- Capabilities independentes evitam conceder acesso documental apenas por associação a um cargo.
- Worker mantém tokens e regras de autorização fora do navegador.
- Cache efêmero reduz risco de persistência de documentos clínicos no dispositivo.

## Alternativas descartadas

- `drive.file` como escopo principal.
- service account + compartilhamento manual de todo o acervo.
- cópia do acervo para banco/Firebase.
- PostHog SDK/autocapture em páginas documentais.
- cache persistente de PDFs no navegador.

## Ações externas concluídas

- PostHog seguro já implantado e validado no Portal antes do início desta fase.
- `POSTHOG_PROJECT_TOKEN` já configurado externamente e eventos técnicos validados.

## Pendências e bloqueios

- Google Cloud/OAuth da Central ainda não configurado.
- Consentimento da conta institucional ainda não executado.
- Produção com escopo `drive` exige tratar o status de escopo restrito e requisitos de verificação aplicáveis.
- Nenhum bloqueio impede concluir a documentação da Fase 0.
- Fase 1 não poderá conectar dados reais até os passos OAuth externos estarem prontos.

## Riscos conhecidos

- refresh token de OAuth externo em status Testing expira em prazo curto segundo Google; não usar Testing como solução de produção;
- escopo `drive` é restrito e exige processo de conformidade apropriado;
- nomes de arquivos podem conter dados identificáveis, portanto não entram em PostHog/logs;
- cache persistente ou service worker mal configurado poderia reter documento clínico; explicitamente proibido;
- escrita concorrente futura pode sobrescrever versão externa se a comparação de `version` for omitida.

## Métricas / observabilidade

A observabilidade-base já está operacional. Eventos reservados para a Central existem na allowlist, mas ainda não devem aparecer porque o módulo documental não existe.

Nenhum conteúdo de Drive foi enviado ao PostHog.

## Próximo passo

1. implementar backend read-only `/api/documents/*` com sessão/capability;
2. implementar rota `/documentos/` e navegador de pastas/pesquisa;
3. implementar OAuth web-server sem expor tokens;
4. adicionar testes de autorização, privacidade e respostas do Drive;
5. abrir PR da Fase 1 e validar checks;
6. quando o código estiver pronto para conexão real, configurar o Google Cloud/OAuth externo e executar o consentimento institucional.

## Arquivos e fontes principais

- `docs/CENTRAL-DOCUMENTOS-ARQUITETURA-V1.md`
- `docs/CENTRAL-DOCUMENTOS-STATUS.md`
- `PORTAL-ARQUITETURA.md`
- `docs/PORTAL-OBSERVABILIDADE-POSTHOG-V1.md`
- `js/tools-catalog.js`
- `worker/auth-management-flex.js`
- `worker/index.js`
- `worker/wrangler.toml`
- Guia Mestre — Central de Documentos V1.1

## Handoff para o próximo chat

**Fase atual:** Fase 1 — Navegação do Google Drive.  
**Subfase / objetivo atual:** construir navegação read-only, capabilities e OAuth backend.  
**Última ação concluída:** Fase 0 validada e mesclada pelo PR #133; branch da Fase 1 criada da main pós-merge.  
**Branch atual:** `feat/central-docs-phase-1-drive-readonly`.  
**PR atual:** nenhum para a Fase 1 neste registro.  
**Último commit relevante:** `686b577` — merge da arquitetura e segurança da Fase 0.  
**Checks e testes:** PR #133 teve 21 workflows concluídos com sucesso; testes da Fase 1 ainda não existem.  
**Decisões tomadas:** Drive API v3 via Worker; escopo `drive`; token criptografado no backend; capabilities independentes; cache documental somente efêmero; IA documental separada.  
**Justificativas:** acesso integral ao Meu Drive, menor exposição de credenciais/dados e preservação das regras atuais do Portal.  
**Alternativas descartadas:** `drive.file`, service account com acervo compartilhado, banco como espelho de PDFs, PostHog direto, cache persistente.  
**Ações externas concluídas:** PostHog seguro já operacional.  
**Pendências:** OAuth Google ainda não configurado; verificar requisitos de produção para restricted scope.  
**Riscos conhecidos:** expiração de refresh token em Testing, restrição OAuth, cache clínico, conflito de versões.  
**Métricas / observabilidade:** base PostHog validada; nenhum evento documental ainda.  
**Próxima ação exata:** implementar primeiro o controle de acesso e o router read-only da Central antes de conectar a conta Google.  
**Arquivos e fontes principais:** arquitetura V1, este status, PORTAL-ARQUITETURA, política PostHog, Worker/auth.
