# Configuração do Assistente Gemini

O site contém a interface do assistente e um backend preparado para Cloudflare Workers. A interface funciona imediatamente em modo de consulta local. Para ativar respostas do Gemini, faça a configuração abaixo.

## 1. Criar uma chave gratuita do Gemini

1. Acesse o Google AI Studio.
2. Crie uma chave da API Gemini em um projeto destinado ao guia.
3. Não cole a chave no GitHub, no `index.html` ou em qualquer arquivo JavaScript público.

O nível gratuito possui limites de requisições e o conteúdo enviado pode ser usado pelo Google para melhorar os produtos. Por esse motivo, o assistente bloqueia CPF, CNS, telefone, e-mail e outros identificadores. Os médicos devem usar somente perguntas gerais ou casos anonimizados.

## 2. Publicar o Cloudflare Worker

### Pelo terminal

```bash
cd worker
npx wrangler login
npx wrangler secret put GEMINI_API_KEY
npx wrangler deploy
```

Quando solicitado, informe a chave criada no Google AI Studio. Ela será armazenada como segredo e não aparecerá no repositório.

O deploy retornará um endereço semelhante a:

```text
https://guia-regulacao-ia.seu-subdominio.workers.dev
```

A rota do chat será:

```text
https://guia-regulacao-ia.seu-subdominio.workers.dev/api/ia
```

### Pelo painel da Cloudflare

Também é possível criar um Worker pelo painel, copiar o conteúdo de `worker/gemini-assistant.js`, cadastrar a variável secreta `GEMINI_API_KEY` e as variáveis comuns:

- `GEMINI_MODEL`: `gemini-3.5-flash-lite`
- `ALLOWED_ORIGINS`: `https://regulacaoeldoradoms.com.br,https://www.regulacaoeldoradoms.com.br`

## 3. Conectar o site ao Worker

Abra `js/ai-config.js` e informe a URL completa:

```javascript
window.REGULATION_AI_CONFIG = Object.freeze({
  endpoint: 'https://guia-regulacao-ia.seu-subdominio.workers.dev/api/ia',
  provider: 'Gemini',
  maxQuestionLength: 800,
  maxHistoryMessages: 6
});
```

Depois publique a alteração na branch `main`.

## Comportamento de segurança

O assistente:

- responde somente com os protocolos enviados pelo próprio site;
- informa quando a resposta não consta na base;
- diferencia exames obrigatórios, condicionais e recomendados;
- não realiza diagnóstico, prescrição ou classificação definitiva de risco;
- bloqueia identificadores pessoais comuns;
- não mantém histórico após a página ser fechada;
- utiliza os ajustes operacionais atuais do site, como a indisponibilidade temporária da Dermatologia no teleatendimento.

## Modo de consulta local

Enquanto o campo `endpoint` estiver vazio, o botão permanece utilizável. As respostas são montadas diretamente com os dados estruturados dos protocolos, sem enviar informações a serviços externos. A janela mostra o indicador `Consulta local`.

Quando o Worker estiver configurado, o indicador muda para `Gemini conectado`.
