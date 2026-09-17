# Central de Documentos — continuidade 4D de 17/09/2026, tarde

Fase 4D ainda sem aceite. PR #201 sem merge. Este registro complementa o status e não transforma testes locais em homologação real.

## Bloqueio atual — execução do operador em 17/09/2026, aproximadamente 14:37 local

O operador executou `liberar-escrita-preview-4d.mjs`. Resultado: `OPERACAO_INTERROMPIDA`, etapa `CONFERIR_PREVIEW_E_PRODUCAO`, código `VERSAO_DE_PRODUCAO_DIVERGENTE`. A saída informou explicitamente que nenhum comando de envio foi executado. Não há confirmação de liberação de escrita nesta tentativa.

O script original foi inspecionado localmente, preservando seu SHA-256 `53b6cc137149b69ea3fb6a650e6a6c9e40918b68f2ef5154cdcc5814fbc212d5`. A função `productionSnapshot` exige a versão fixa `239cca88-9b19-400c-9cd1-82612f942ed0` com percentual numérico igual a 100. A divergência ocorreu nessa primeira consulta, antes de consultar o controle D1 ou executar upload. Isso não diagnostica uma falha do PDF/autosync nem identifica, sozinho, qual implantação passou a atender a produção.

Estado GitHub consultado depois da interrupção:
- `main` está em `3dc193c34d5f0f02c0a50b2f51ba2e29e022f77f`, commit de 17/09/2026 18:26:09 UTC que registra o merge do PR #203, encerrando a documentação da abertura pós-login; seu histórico registra o PR #202 mesclado em `f28a1d4d88bb16dd71bf61231ceb6830580c058d`.
- PR #201 permanece aberto e sem merge; a consulta retornou `mergeable:false`. Não resolver automaticamente contra a main durante o diagnóstico operacional.
- A atualização da main é um fato. Que ela explique o novo ID de produção na Cloudflare é uma hipótese a conferir com `deployments status` e a lista de versões; não atribuir o deployment a um PR sem essa evidência.

Decisão: preservar as atualizações legítimas de produção e manter o envio bloqueado. Não fazer rollback, promover o wrapper, remover a comparação de produção nem trocar apenas o UUID no script. Há outras verificações dependentes do estado anterior: `local.productionBefore`, última versão criada e herança dos segredos. Todas precisam ser revisadas conjuntamente, sem extrair valores de segredos.

Próxima ação exata: consultar novamente `wrangler deployments status --name yellow-wave-d0a1guia-regulacao-ia --json` e `wrangler versions list --name yellow-wave-d0a1guia-regulacao-ia`; receber somente metadados de deployment/versões. Depois conferir a configuração necessária e preparar uma referência atualizada explicitamente revisada, mantendo comparação antes/depois, restrição de preview, mesmo usuário/PDF e prazo do D1. A autorização vence em 17/09/2026 20:10:01 UTC e não deve ser ampliada automaticamente. Nenhum teste de edição real deve começar com base nesta tentativa interrompida.

## Evidências recebidas do operador antes do bloqueio

- O relatório do script local informou upload não produtivo da versão `a17473ce-ad9a-480c-8e53-901f2fcc3c92`, release `2fee19e69e06ecd128be2b103354fc6c2fb4e431`, com `DOCUMENTS_DRIVE_WRITE_ENABLED=false` e deployment produtivo inalterado na versão `239cca88-9b19-400c-9cd1-82612f942ed0` (100%) naquele momento.
- Foi criada uma nova autorização no D1, sem reaproveitar o identificador vencido. A consulta copia somente o usuário e a lista de um PDF descartável já autorizados. O resultado mostrado pelo operador registrou `enabled=1`, vencendo em 17/09/2026 20:10:01 UTC.
- Screenshot do operador, aproximadamente 14:17 em Eldorado/MS: página `/homologacao/documentos/` lista somente um PDF com nome sintético; visualizador reconhece três páginas e exibe a primeira página e miniaturas. Isso confirma leitura, não autosync ou gravação com a nova versão.

## Plano de liberação — suspenso até conferir o deployment atual

Preparar o mesmo preview para teste de escrita, preservando a autorização existente, o usuário e o PDF, sem estender o prazo. Usar somente `wrangler versions upload`, nunca promover o wrapper restrito para produção. A nova operação precisa conferir configuração, versão-base, prazo/escopo no D1 e produção antes/depois. Consentimento local explícito antes do envio. Sessões pendentes, outra janela ativa, outra versão recém-enviada ou prazo insuficiente interrompem a operação.

Script local preparado: `liberar-escrita-preview-4d.mjs`, com 15 testes Node e validação SQLite em memória. A execução autenticada do operador parou na primeira conferência de produção conforme registrado acima. Sua função é publicar uma versão com gate true para esta janela, sem acessar PDF nem alterar linhas D1. A ativação e a matriz real continuam pendentes; não repetir o script inalterado esperando resultado diferente.

Depois de liberação efetivamente confirmada: conferir acesso atualizado na página e testar autosync consecutivo, edição durante envio, retry, proteção ao fechar, conflito externo, reabertura e revisão recuperável. Encerrar revogando o controle e desligando gate no preview. Não considerar o diagnóstico somente leitura ou testes sintéticos como aceite final.

## Limites preservados

D1 e OAuth são recursos compartilhados com o Portal; isolamento vem do entrypoint restrito, host/origem, usuário, arquivo, controle revogável e sessões. Não publicar IDs de arquivos, usuários, credenciais ou conteúdo documental. Não reiniciar consentimento OAuth nem trocar tokens de Builds. Código local preparado vem do commit exato `2fee19e`; não alterar a main para cumprir prazo.
