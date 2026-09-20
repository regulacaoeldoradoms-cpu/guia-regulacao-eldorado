# Central de Documentos — Publicação produtiva da IA documental V1

Data: 20/09/2026.

## Estado

**PUBLICADA EM PRODUÇÃO; VALIDAÇÃO FUNCIONAL HUMANA PENDENTE.** A Fase 5 está encerrada e a V8C.2 é o baseline funcional aprovado. O fluxo normal da IA documental foi publicado sem ligar automação antecipatória.

## Escopo

Valores produtivos pretendidos:

- `DOCUMENTS_AI_ENABLED=true`;
- `DOCUMENTS_AI_PROCESSING_ENABLED=true`;
- `DOCUMENTS_AI_BACKGROUND_ENABLED=false`;
- `DOCUMENTS_AI_FREE_ONLY=true`;
- `DOCUMENTS_AI_FAST_VISION_ENABLED=false`.

O binding `AI` do Workers AI permanece obrigatório.

## Permissões e privacidade

A publicação não concede acesso novo a usuários. As rotas de IA continuam exigindo capability `extract` no backend. Esconder ou mostrar o botão no frontend não substitui essa autorização.

Permanecem proibidos em PostHog: nome de paciente, CPF, CNS, telefone, endereço, data de nascimento, diagnóstico, CID, conteúdo digitado, nome de arquivo, fileId/ref do Drive, prompt, resposta e conteúdo do PDF.

Os resultados documentais continuam efêmeros conforme o contrato da Fase 5.

## Comportamento publicado

- o botão **IA documental** fica disponível somente quando configuração produtiva e capability permitem;
- o processamento começa por ação explícita do usuário;
- a V8C.2 usa o caminho principal aprovado com Workers AI e modelos permitidos pelo requisito `FREE_ONLY`;
- a automação de preextração da Fase 6 continua desligada;
- nenhuma edição, exclusão, sincronização ou escrita no Drive é iniciada pela IA.

## Validação obrigatória antes do merge

1. workflow de Fases 1–6 verde;
2. testes de UI/roteamento da IA verdes;
3. teste de configuração produtiva exigindo os dois gates normais em `true` e background em `false`;
4. governança e bundle verdes;
5. deploy seguro do Worker sem perda de bindings/segredos.

## Validação pós-deploy

Com conta que já possua `extract`:
1. recarregar a Central;
2. abrir um PDF permitido;
3. confirmar que o botão **IA documental** aparece;
4. abrir o painel;
5. executar uma extração normal por clique;
6. confirmar proveniência por página e ausência de ação destrutiva automática.

Com conta sem `extract`, a IA deve permanecer inacessível mesmo que o frontend seja manipulado.

## Rollback

Rollback é exclusivamente de configuração:
- `DOCUMENTS_AI_ENABLED=false`;
- `DOCUMENTS_AI_PROCESSING_ENABLED=false`;
- manter `DOCUMENTS_AI_BACKGROUND_ENABLED=false`.

Não há migração de banco, alteração de documento nem rollback de Drive associado a esta publicação.

## Relação com a Fase 6

Esta é uma mudança transversal autorizada pelo operador. A Fase 6 continua aberta até comprovar seu próprio critério: redução mensurável de tempo operacional sem perda de controle do usuário.


## Estado pós-merge de 20/09/2026

A PR #345 foi integrada na `main`, mas a publicação ainda **não pode ser declarada concluída**. O check externo do Workers Builds falhou antes de comprovar nova Worker Version produtiva. O código, os gates desejados e os testes estão integrados; falta a promoção efetiva do Worker.

Até que o Workers Builds conclua com sucesso (ou que o gate `npm run deploy:safe` seja executado por uma máquina autenticada no Wrangler), tratar a IA documental produtiva como **pendente de deploy**, não como ativa.


## Deploy produtivo concluído

Em 20/09/2026, após a correção do gate pela PR #347, o Workers Builds concluiu com sucesso:

- merge: `fc4fde95db6c8f044d37337e0d142c2928c16fbf`;
- Build ID: `f95e0e2c-3811-43fd-a986-67d46dc065bb`;
- Worker Version: `1c2458f8-76f9-4050-8f10-a9e6b5fbec37`;
- Cloudflare Pages: sucesso.

O rollout técnico está concluído. Falta somente a validação funcional no navegador com uma conta que já tenha capability `extract`.
