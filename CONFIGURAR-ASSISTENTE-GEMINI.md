# Configuração da IA multiprovedor do Portal

Atualizado em 18/09/2026.

O Portal usa uma camada de pré-regulação com proteção de dados identificáveis e contingência entre provedores. O Worker oficial é `yellow-wave-d0a1guia-regulacao-ia` e o deploy produtivo deve passar pelo gate seguro documentado em `docs/WORKER-SAFE-DEPLOY.md`.

## Provedores

### Gemini

Quando `GEMINI_API_KEY` está configurada como secret do Worker, o Portal tenta primeiro o Gemini.

Configuração versionada atual:

- `GEMINI_MODEL=gemini-3.5-flash-lite`;
- `GEMINI_FALLBACK_MODELS=gemini-3.6-flash`;
- `GEMINI_REQUEST_TIMEOUT_MS=5000`;
- `GEMINI_TOTAL_TIMEOUT_MS=11000`.

A chave nunca deve ser gravada no GitHub, no frontend, em documentação pública ou no chat.

### Cloudflare Workers AI

O binding `AI` é a contingência independente do Portal. A configuração atual usa:

- `CLOUDFLARE_AI_FALLBACK_ENABLED=true`;
- modelo primário `@cf/meta/llama-3.1-8b-instruct-fast`;
- modelo alternativo `@cf/zai-org/glm-4.7-flash`;
- timeout por tentativa de 16 segundos;
- orçamento total de 30 segundos.

Se `GEMINI_API_KEY` estiver ausente, a pré-regulação não deve gastar tentativas inúteis no Gemini: o Worker segue diretamente para Workers AI. Se o Gemini estiver configurado e falhar de forma transitória, o fluxo tenta os modelos Gemini previstos e depois aciona Workers AI.

A resposta da API informa qual provedor e modelo efetivamente responderam.

## Deploy

Não usar `wrangler deploy` diretamente em produção.

O comando oficial do Workers Builds é:

```text
npm run deploy:safe
```

O gate envia uma candidata sem tráfego, valida bindings e secrets em relação à produção, promove somente depois da validação e testa a Agenda após a promoção.

`GEMINI_API_KEY` não é requisito fixo do gate de deploy. Se existir na produção, é preservada obrigatoriamente como qualquer outro secret produtivo. Se já estiver ausente da baseline, essa ausência não bloqueia o deploy porque Workers AI mantém uma rota de contingência independente.

## Diagnóstico

O diagnóstico técnico deve distinguir:

- **Gemini primário disponível**: `GEMINI_API_KEY` presente;
- **Gemini ausente, IA operacional por contingência**: Workers AI íntegro e fallback habilitado;
- **IA indisponível**: nem Gemini utilizável nem Workers AI operacional.

A ausência da chave Gemini é um alerta de capacidade do provedor primário, não deve ser confundida automaticamente com indisponibilidade total da IA.

## Segurança

O assistente:

- exige autenticação e papéis autorizados quando `AUTH_ENFORCE_AI=true`;
- responde com base nos protocolos e fatos operacionais fornecidos pelo Portal;
- bloqueia CPF, CNS, telefone, e-mail e outros identificadores antes de consultar qualquer provedor;
- não deve receber dados de pacientes identificáveis;
- não substitui avaliação clínica nem decisão do médico regulador;
- mantém logs técnicos sem conteúdo clínico integral.

## Restauração do Gemini

Se a instituição decidir restaurar o Gemini como provedor primário, criar ou validar uma chave no serviço oficial do Google e cadastrá-la apenas como secret `GEMINI_API_KEY` no runtime do Worker. Depois, executar um deploy seguro normal. Não versionar nem transmitir a chave em texto.
