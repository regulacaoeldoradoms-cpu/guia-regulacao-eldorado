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

A documentação oficial atual do modelo registra `stream=true` como padrão para `query`. O Titon mantém `stream=false` explicitamente para congelar o contrato e não depender de default do provedor. Isso preserva resposta completa e validável e protege contra futura mudança de default.

Também foi endurecido o parser para um caso frequente em VLMs rápidos: se a resposta contiver um único objeto JSON válido envolvido por uma frase curta, o backend extrai apenas o objeto delimitado e aplica imediatamente o mesmo schema estrito. Isso não afrouxa campos, estados ou proveniência; apenas evita cair para Gemma por embalagem textual superficial.

Essas duas mudanças são consideradas correção de contrato/desempenho, não mudança de escopo funcional. A V7 anterior não deve ser homologada antes desta correção ser integrada e as referências congeladas serem renovadas.


## Revisão final antes da homologação V7 — 19/09/2026

Revisão cruzada com a documentação atual do Cloudflare Workers AI:

- Moondream 3.1 é Image-to-Text, 9B totais / 2B ativos, com OCR e structured output como casos de uso; o changelog publica p50 aproximado de 770 ms para `query` em imagem simples, mas isso não é SLO para nossos documentos.
- `query` usa `stream=true` por padrão; o Titon agora fixa `stream=false`, porque precisa do JSON completo antes de validar a página.
- `rejectIfBusy=true` está no lugar correto: terceiro argumento de `env.AI.run()`. Assim não esperamos em fila de capacidade; erro 3040 cai para o fallback gratuito.
- O limite padrão atual de Image-to-Text é 720 req/min por conta, muito acima da concorrência de 6 páginas do Titon. Isso não elimina indisponibilidade de capacidade, mas afasta rate limit como razão para reduzir a concorrência preventivamente.
- Workers Free mantém 10.000 Neurons/dia sem cobrança; ao esgotar, retorna 3036. Moondream não consta na lista atual de modelos que exigem Workers Paid. A política do Titon continua: sem AI Gateway/prepaid/unified billing.
- Prompt caching não é assumido para Moondream. A documentação diz que cache de prefixo só existe em modelos selecionados e depende de compatibilidade/modelo; não há benefício comprovado aqui que justifique acoplar session affinity antes da medição.
- Smart Placement também não entra nesta rodada: o gargalo candidato é a própria inferência no binding Workers AI, não um backend externo single-homed.
- Batch API permanece descartada para o clique interativo: a Cloudflare a descreve como fila assíncrona com polling para workloads sem interação humana.
- Markdown Conversion em imagens adiciona object detection + Gemma 4; portanto não é um atalho para esta visão. Em PDF digital, a extração textual sem visão pode ser útil no futuro, mas precisa ser validada contra literalidade e permissões antes de substituir qualquer resultado visual.

### Regra de decisão após o próximo teste

O próximo teste não deve gerar nova rodada de mudanças especulativas. Usar o resumo seguro para localizar o gargalo:

1. Se `provider_ms` dominar e Moondream resolver a maioria das páginas em 1 tentativa, manter a arquitetura e medir se o objetivo 2x foi cumprido.
2. Se `provider_ms` dominar, mas houver muitas tentativas/fallbacks, ajustar apenas a causa observada: prompt fast-path, concorrência ou regra de fallback.
3. Se `overhead_ms` dominar, otimizar preparação/transporte da imagem; só então experimentar edge menor/compressão, preservando a página ilegível como teste de regressão.
4. Se mesmo com Moondream 1-shot a meta 2x não for alcançada, avançar para V8 híbrida: text-layer do PDF.js para detectar páginas digitais e caminho visual apenas para escaneadas/ambíguas. A saída final não deve ser aceita localmente sem respeitar a capability `extract` no backend.
5. Não alterar resolução, prompt e modelo simultaneamente. Medir uma variável por vez.

Decisão: **nenhuma outra mudança funcional será empilhada antes da homologação V7 stream-safe**. Isso evita transformar a fase em polimento infinito e preserva um experimento comparável.

## Veredito arquitetural após nova revisão — 19/09/2026

A estrutura atual é a melhor **próxima arquitetura experimental** para a Fase 5E, mas não deve ser tratada como arquitetura final irrevogável.

### Por que manter V7 agora

1. **Uma inferência integrada por página** continua superior ao desenho antigo `classify -> extract -> reclassify`: reduz chamadas e elimina divergência de classificação.
2. **Moondream como fast path** é adequado ao caso: é Image-to-Text dedicado, 9B/2B ativos, com OCR e structured output; Gemma e Qwen permanecem como rede de segurança de maior capacidade.
3. **Seis páginas concorrentes** estão muito abaixo do limite padrão atual de Image-to-Text de 720 req/min. O gargalo precisa ser medido antes de reduzir concorrência.
4. **`rejectIfBusy=true`** está corretamente no terceiro argumento de `env.AI.run`, portanto capacidade indisponível falha rápido e permite fallback sem esperar fila.
5. **Produção fail-closed** permanece separada do preview: fast path e IA documental continuam desligados em produção.
6. **A medição agora é suficiente para decidir**: o laboratório separa provider, overhead, tentativas e modelo por página.

### Melhor arquitetura de longo prazo se V7 não entregar 2x

O caminho preferencial é **híbrido por página**, não outro VLM em cascata:

- PDF.js `getTextContent()` para detectar e extrair camada textual de PDFs digitais;
- roteador local classifica a página como digital-confiável, escaneada ou ambígua;
- em página digital-confiável, evitar renderização de canvas e visão;
- parser determinístico por rótulos/layout para campos óbvios; modelo textual apenas para ambiguidade;
- Moondream para páginas escaneadas/sem text layer;
- Gemma/Qwen somente para fallback/revisão;
- proveniência continua ancorada pelo número técnico da página;
- nenhum texto/documento entra no PostHog; cache de conteúdo permanece apenas em memória da sessão.

O `env.AI.toMarkdown()` foi reavaliado e **não é preferido** para esta fronteira: em PDFs ele pode extrair texto/StructTree sem visão, mas a API pública retorna o documento convertido como uma única saída e não oferece, no contrato consultado, a mesma proveniência explícita por página exigida pela Central. PDF.js já possui a página isolada e expõe `getTextContent()`, portanto preserva melhor a arquitetura atual.

### Ajustes que não devem ser feitos antes da medição V7

- hedged requests (Moondream + Gemma em paralelo): desperdiçam franquia e a inferência perdedora não é cancelável;
- Batch API: fila assíncrona/polling pior para ação interativa;
- AI Gateway/prepaid: viola o requisito R$0 e adiciona outra camada;
- reduzir 1800 px/PNG sem evidência: pode regredir o caso de ilegibilidade;
- OCR WASM/Tesseract no navegador: adiciona peso e CPU local sem evidência de ganho;
- Smart Placement/prompt cache: não atacam o gargalo visual comprovado e não há benefício documentado para Moondream neste fluxo;
- mudar modelo, resolução e prompt na mesma rodada: impede atribuir causa ao ganho ou regressão.

### Observação de UX

Depois da medição de latência, a UI pode renderizar blocos aprovados progressivamente conforme cada página termina. Isso melhora tempo percebido, mas deve ser medido separadamente do ganho real de inferência para não mascarar o objetivo de 2x.


## Última revisão de instrumentação — 19/09/2026

Foi encontrado um detalhe no laboratório que poderia prejudicar o diagnóstico sem alterar o tempo real da matriz: a métrica por página começava **depois** de converter o canvas em PNG. Assim, o antigo `overhead_ms` não incluía toda a preparação local da imagem.

O laboratório passou a registrar, por página:
- `pagina_ms`: tempo total da página desde o início da preparação;
- `preparo_ms`: conversão canvas → Blob;
- `provider_ms`: soma das tentativas medidas no Worker;
- `transporte_backend_ms`: diferença entre duração da requisição e tempo efetivo de provider;
- `tentativas`;
- `revisado`;
- `modelos`: cadeia técnica de modelos usados.

Essas métricas são estritamente técnicas e não incluem conteúdo, identidade ou valores extraídos. O objetivo é evitar novo ciclo de otimização às cegas: a próxima mudança só deve atacar o componente que dominar a latência.
