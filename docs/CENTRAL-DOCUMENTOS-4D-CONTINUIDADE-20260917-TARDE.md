# Central de Documentos — continuidade 4D de 17/09/2026, tarde

Fase 4D ainda sem aceite. PR #201 sem merge. Este registro complementa o status e não transforma testes locais em homologação real.

## Evidências recebidas do operador

- O relatório do script local informou upload não produtivo da versão `a17473ce-ad9a-480c-8e53-901f2fcc3c92`, release `2fee19e69e06ecd128be2b103354fc6c2fb4e431`, com `DOCUMENTS_DRIVE_WRITE_ENABLED=false` e deployment produtivo inalterado na versão `239cca88-9b19-400c-9cd1-82612f942ed0` (100%).
- Foi criada uma nova autorização no D1, sem reaproveitar o identificador vencido. A consulta copia somente o usuário e a lista de um PDF descartável já autorizados. O resultado mostrado pelo operador registrou `enabled=1`, vencendo em 17/09/2026 20:10:01 UTC.
- Screenshot do operador, aproximadamente 14:17 em Eldorado/MS: página `/homologacao/documentos/` lista somente um PDF com nome sintético; visualizador reconhece três páginas e exibe a primeira página e miniaturas. Isso confirma leitura, não autosync ou gravação com a nova versão.

## Decisão e próxima ação exata

Preparar o mesmo preview para teste de escrita, preservando a autorização existente, o usuário e o PDF, sem estender o prazo. Usar somente `wrangler versions upload`, nunca promover o wrapper restrito para produção. A nova operação precisa conferir configuração, versão-base, prazo/escopo no D1 e produção antes/depois. Consentimento local explícito antes do envio. Sessões pendentes, outra janela ativa, outra versão recém-enviada ou prazo insuficiente interrompem a operação.

Script local preparado: `liberar-escrita-preview-4d.mjs`, com 15 testes Node e validação SQLite em memória. Não executado contra a conta Cloudflare pelo assistente. Sua função é publicar uma versão com gate true para esta janela, sem acessar PDF nem alterar linhas D1. A ativação e a matriz real continuam pendentes de execução do operador.

Depois: conferir acesso atualizado na página e testar autosync consecutivo, edição durante envio, retry, proteção ao fechar, conflito externo, reabertura e revisão recuperável. Encerrar revogando o controle e desligando gate no preview. Não considerar o diagnóstico somente leitura ou testes sintéticos como aceite final.

## Limites preservados

D1 e OAuth são recursos compartilhados com o Portal; isolamento vem do entrypoint restrito, host/origem, usuário, arquivo, controle revogável e sessões. Não publicar IDs de arquivos, usuários, credenciais ou conteúdo documental. Não reiniciar consentimento OAuth nem trocar tokens de Builds. Código local preparado vem do commit exato `2fee19e`; não alterar a main para cumprir prazo.
