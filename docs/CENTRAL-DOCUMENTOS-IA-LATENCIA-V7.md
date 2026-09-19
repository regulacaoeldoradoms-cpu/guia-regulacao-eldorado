# Central de Documentos — IA documental V7 — Estratégia de baixa latência

Data: 19/09/2026.

## Motivo

O reteste V6 melhorou a precisão, mas o operador ainda considera o tempo de extração incompatível com o fluxo real. A nova meta é **reduzir o tempo de extração em pelo menos 50%**, preservando a precisão e todas as barreiras de segurança da Fase 5E.

Aceite da V7:
- mesma matriz sintética da 5E com **10/10**;
- `duracao_extracao_ms` da V7 <= 50% da V6 na mesma máquina/rede, comparando uma execução limpa de cada runtime;
- nenhum modelo pago;
- nenhuma escrita no Google Drive;
- nenhuma ativação produtiva automática;
- literalidade, isolamento por página, `nao_consta` x `ilegivel` e proveniência preservados.

## Estratégia escolhida

### 1. Fast path visual com Moondream 3.1

A primeira tentativa visual passa a poder usar `@cf/moondream/moondream3.1-9B-A2B` **somente quando o gate de fast path estiver explicitamente habilitado**.

Razões:
- modelo de visão dedicado a OCR e saída estruturada;
- arquitetura 9B total / 2B ativos;
- Cloudflare o descreve como modelo de baixa latência para uso inline e cita extração de campos de documentos como caso de uso;
- a documentação pública da Cloudflare reporta aproximadamente 770 ms de p50 para `query` em imagem simples; isso não é SLO do Portal e deve ser medido com nossas páginas;
- não aparece na lista atual de modelos que exigem Workers Paid; continua sujeito à franquia diária gratuita da conta.

Contrato nativo usado:
- `task=query`;
- imagem por data URI;
- `reasoning=false`;
- temperatura zero;
- resposta JSON solicitada pelo prompt.

### 2. Gemma/Qwen continuam como rede de segurança

A mudança não remove os providers já homologados:
- Gemma 4 continua como primeiro fallback e como modelo de chat textual;
- Qwen 3.8 continua como fallback final e revisor focal quando realmente necessário;
- erro de limite gratuito ou exigência de plano pago continua fail-closed.

Assim a V7 reduz o caminho normal sem trocar precisão por ausência de fallback.

### 3. Eliminar segunda inferência quando o fast path já reconheceu `ilegivel`

Na V6, uma página médica explicitamente marcada como `ilegivel` podia disparar uma revisão Qwen sequencial. Isso é correto, porém faz a página mais lenta definir o tempo de toda a onda concorrente.

Na V7:
- se Moondream retornar `ilegivel` de forma estruturalmente válida, o estado é aceito e a página termina em uma inferência;
- o revisor continua sendo chamado se houver o caso suspeito `cid=nao_consta` com `descricao_cid=encontrado`;
- se o fast path falhar e Gemma assumir a página, o comportamento conservador de revisão da V6 permanece.

Essa regra é reversível e será aceita somente se a página adversarial de CID ilegível continuar correta.

### 4. Concorrência de seis páginas permanece

O cliente já processa até seis páginas independentes em paralelo. Isso deve ser preservado. Trocar para Batch API assíncrona **não é a primeira opção** porque a própria Cloudflare a define como fila/polling para workloads duráveis, não como caminho interativo de menor latência.

## Alternativas avaliadas e descartadas nesta rodada

### Batch API assíncrona
Descartada para o fast path porque adiciona fila + polling e é orientada a trabalhos que podem esperar. Pode ser útil para preparação em segundo plano na Fase 6, não para o clique interativo de extração.

### Markdown Conversion como OCR
Não escolhida como caminho principal. Para imagens, a documentação da Cloudflare descreve uma etapa de detecção de objetos e depois Gemma 4 para image-to-text. Isso adicionaria trabalho e continuaria dependendo de Gemma para a visão.

### Reduzir resolução/qualidade da página agora
Adiado. A V6 acabou de corrigir um caso de ilegibilidade aumentando fidelidade. Primeiro substituímos o modelo por um fast path dedicado mantendo a imagem atual; só comprimiremos mais se a medição mostrar que upload/renderização ainda é gargalo e a matriz continuar 10/10.

### Modelos pagos / AI Gateway com créditos
Proibidos pelo requisito permanente de custo R$0. O fast path não usa Unified Billing, prepaid ou pay-as-you-go.

## Segunda etapa se Moondream não atingir 2x

Implementar um caminho híbrido no PDF real:

1. tentar `PDF.js getTextContent()` localmente por página;
2. quando houver camada textual suficiente e rótulos autorizados, extrair o texto sem visão;
3. usar parser determinístico para campos simples e modelo textual pequeno somente quando necessário;
4. enviar imagem ao fast path visual apenas para páginas escaneadas, sem text layer ou com campos ambíguos;
5. nunca registrar o texto extraído no PostHog.

Esse desenho pode tornar PDFs digitais quase instantâneos, mas não é necessário para provar primeiro o ganho do Moondream na matriz visual.

## Segurança e rollout

- Produção mantém `DOCUMENTS_AI_ENABLED=false` e `DOCUMENTS_AI_PROCESSING_ENABLED=false`.
- Produção mantém `DOCUMENTS_AI_FAST_VISION_ENABLED=false`.
- O preparo 5E é o único ambiente que liga `DOCUMENTS_AI_FAST_VISION_ENABLED=true`.
- Nenhum documento clínico real é usado na homologação.
- O runtime V7 só será considerado aprovado depois de precisão 10/10 + ganho >= 2x + encerramento fail-closed.

## Referências técnicas consultadas

- Cloudflare Workers AI — Moondream 3.1 model page e changelog de 08/07/2026.
- Cloudflare Workers AI — Pricing / Free allocation.
- Cloudflare Workers AI — Reject busy requests.
- Cloudflare Workers AI — Asynchronous Batch API.
- Cloudflare Workers AI — Markdown Conversion / How it works.


## Revisão de contrato Moondream — 19/09/2026

A documentação oficial do modelo registra `stream=true` como padrão para a tarefa `query`. Como o Titon precisa validar o JSON completo antes de aceitar qualquer página, o runtime V7 deve solicitar explicitamente `stream=false`. Sem isso, o fast path pode receber resposta incremental em vez do objeto final esperado pelo parser, causando fallback desnecessário ou falha de contrato.

Também foi endurecido o parser para um caso frequente em VLMs rápidos: se a resposta contiver um único objeto JSON válido envolvido por uma frase curta, o backend extrai apenas o objeto delimitado e aplica imediatamente o mesmo schema estrito. Isso não afrouxa campos, estados ou proveniência; apenas evita cair para Gemma por embalagem textual superficial.

Essas duas mudanças são consideradas correção de contrato/desempenho, não mudança de escopo funcional. A V7 anterior não deve ser homologada antes desta correção ser integrada e as referências congeladas serem renovadas.
