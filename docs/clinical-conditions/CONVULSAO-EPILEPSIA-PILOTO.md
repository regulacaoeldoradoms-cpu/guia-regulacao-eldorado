# Checkpoint local - Convulsão / Epilepsia

Atualização do lote 2: ver [checkpoint dos dois pilotos](DOIS-PILOTOS-CHECKPOINT.md) para o estado atual, build e testes focados. As verificações do lote 1 abaixo permanecem como evidência histórica.

Data: 16/10/2026. Estado: implementado e verificado localmente, em revisão documental e operacional. Não publicado.

Branch isolada: `feat/piloto-convulsao-epilepsia-20261016`.
Base: `380a40b1a5e58c309151b066fef0b79ec9313489` (main consultada na abertura do lote, após PR 662).
Revisão do registro: `piloto-convulsao-20261016-2`.
As mudanças permanecem sem commit, push, PR, merge ou deploy. O diff e seu manifesto ficam no diretório de trabalho separado.

## Limite da validação

Este lote implementa a proposta visual aprovada. Os testes verificam fidelidade à matriz dessa proposta e consistência entre consumidores; não certificam validade clínica, institucional ou municipal.

As referências e o conteúdo foram comunicados pela frente documental. Esta frente técnica não acessou os PDFs originais nem anexos de outras conversas. O hash dos bytes de S2 foi confirmado pela frente documental e vinculado ao registro: `96445fc56ecf27e3b81a47389c923a0a4c837372eeab5e31c7fba054ad139315`. Origem institucional e vigência atual continuam pendentes; o hash não as comprova. O hash de S1 ainda não foi vinculado. A correspondência de 2024/2025 não foi promovida a nova norma.

Continuam pendentes, de forma explícita na tela, impressão e contexto da IA:

- Oferta operacional atual de Neuropediatria no DigSaúde MS.
- Origem institucional e cadeia documental do PDF de 72 páginas.
- Aplicabilidade municipal ao fluxo de Eldorado/MS.
- Fluxo para 17 anos; o piloto não escolhe outro destino nem transfere automaticamente ao SISREG.

## Percurso implementado

Pesquisa de `convulsão infantil`, `epilepsia`, `convulsão febril simples` ou `17 anos` -> escolha explícita de DigSaúde MS -> Neuropediatria -> Convulsão / Epilepsia -> resposta prática.

A resposta apresenta critérios e exclusão, o que descrever, avaliação clínica obrigatória separada de exames/documentos opcionais, alternativas de apresentação, familiar/responsável, fonte e pendências. O termo `17 anos` produz aviso contextual antes e depois da seleção. O campo etário é opcional, não persiste dados e não decide elegibilidade.

O motivo também pode ser aberto pela ficha geral de Neuropediatria. Na área médica há URL com `protocolo=neuropediatria` e `condicao=digsaude.neuropediatria.convulsao-epilepsia`, restaurada ao recarregar. A ficha de fontes também restaura a condição no recarregamento desde o lote 2. A recepção usa seleção local.

Uma busca explícita por adulto, SISREG ou CORE não oferece esse recorte pediátrico. Trocar a busca para outro motivo retira a condição selecionada nas duas telas do guia. A recepção mantém a seleção até escolher outra ficha, conforme sua interação já existente.

## Registro e consumidores

| Componente | Local e comportamento |
| --- | --- |
| Registro integral versionado | `data/clinical-conditions/convulsao-epilepsia-20261016.json`: 15 regras, vínculos de fonte, alternativas, exceção e quatro pendências. Separado do espelho histórico. |
| Busca, apresentação e projeções | `js/clinical-condition-pilot.js`: carregamento limitado a quatro segundos, validação estrutural, seleção de sistema, idade, tela, impressão e resposta local. |
| Guia médico | `js/medical-app.js:310`: desvia apenas a condição selecionada para o registro. Os demais motivos mantêm a ficha existente. |
| Fontes técnicas | `js/app.js:270`: o mesmo componente e o mesmo registro em `/protocolo/`. |
| Recepção | `js/reception-app.js:136`: as mesmas regras, com três marcações locais de presença da informação. Não avalia conteúdo clínico nem converte exame opcional em pendência impeditiva. Marcar não muda a impressão. |
| Sobreposição prática | `js/referral-workbench.js:255`: não injeta exigências gerais ou prática observada no artigo da condição. Continua enriquecendo os registros antigos pelo caminho anterior. |
| Assistente da página | `js/ai-assistant.js:205`: com a condição aberta, envia o registro inteiro e usa contingência específica. Pedido explícito adulto/SISREG/CORE sai desse contexto. Registro indisponível impede chamada remota para o piloto. |
| Ponte de IA | `js/pre-regulation-bridge.js:142`: conserva `clinicalConditionRecord` inteiro, em vez de aplicar os cortes dos registros antigos. Marca `clinical_condition_integral_v1`. |
| Worker | `worker/clinical-condition-pilot.js:9`: reconstitui o registro canônico empacotado, ignorando texto clínico alterado pelo cliente; rejeita revisão incompatível e idade estruturada inválida. |
| Prompt | `worker/gemini-assistant.js:119` e `:177`: usa registro integral; acima do limite recusa com 413, sem cortar regras silenciosamente. Não importa exigências de TEA e mantém pendências de oferta/vigência. |
| Impressão | `js/clinical-condition-pilot.js:117`: todas as 15 regras, idade contextual, alternativas, fonte e pendências. Três páginas A4 no teste. |
| Cache | `portal-sw.js:722`: somente HTML antigo de `/medico/`, `/protocolo/` e `/recepcao/` recebe atualização delimitada antes de reutilização. Offline mantém fallback existente. Scripts alterados ganham versão nas três páginas. |
| Sincronização e CI | O workflow antigo de sincronização do espelho não foi alterado e não escreve em `data/clinical-conditions/`. Novo `validate-clinical-pilot.yml` apenas lê o repositório e executa os 24 testes locais pertinentes. |

O espelho histórico `data/protocol-source.html` permanece igual à base após normalização de quebras de linha do Git. Blob histórico: `00c317755b164827cc5be4c83edeae8052405dae`. SHA-256 do conteúdo LF: `19d10b176c7ab5c9a960ca1bda3d0d117de3b26440a222497a6f89914d6e2b77`.

## Checkpoint das regras

Referências comunicadas: TEL2 = Telessaúde MS 2.0, 06/10/2025, físicas 36-38 / impressas 30-32; MAN1 = Manual Operacional V1, p. 4; BRIEF = limite editorial aprovado, sem valor normativo autônomo.

| ID | Conteúdo/classificação preservados | Referência |
| --- | --- | --- |
| IDADE | Até 16 anos, 11 meses e 29 dias; 17 anos permanece lacuna contextual. | TEL2 |
| CRISE | Um ou mais episódios sugestivos de crise convulsiva; vínculo explícito com FEBRIL. | TEL2 |
| MONO | Epilepsia prévia sem controle apesar de monoterapia otimizada em dose plena, descartada má adesão. | TEL2 |
| EFEITOS | Epilepsia prévia com efeitos adversos intoleráveis da medicação. | TEL2 |
| DIFICIL | Difícil controle apesar de duas ou mais medicações anticrise otimizadas, em dose plena, descartada má adesão. | TEL2 |
| FEBRIL | Exclusão de convulsão febril simples vinculada ao critério de episódios sugestivos; não vira proibição universal ou rota inferida. | TEL2 |
| QUADRO | Descrever o quadro clínico atual que sustenta o enquadramento. | TEL2 |
| TRATAMENTO | Descrever o tratamento que sustenta o critério pertinente. | TEL2 |
| NEURO | Avaliação clínica obrigatória, realizada e registrada por profissional habilitado. | TEL2 física 38/impressa 32 e MAN1 p. 4 |
| EEG | Se houver; opcional para instrução documental. | TEL2 |
| TC | Se houver; opcional para instrução documental. | TEL2 |
| RM | Se houver; opcional para instrução documental. | TEL2 |
| APRESENTACAO | Anexados **ou** descritos. | TEL2 |
| RESPONSAVEL | Presença necessária de familiar ou responsável no teleatendimento. | TEL2 |
| INDICACAO | Ausência de requisito documental obrigatório não dispensa exame clinicamente indicado. | BRIEF |

As 15 regras são as mesmas na tela, contexto integral da IA e impressão. A contingência responde à pergunta e pode mostrar um subconjunto pertinente, com a exceção e as pendências quando aplicáveis; não substitui o registro integral enviado à IA.

## Evidência técnica

| Verificação | Resultado |
| --- | --- |
| Testes Node | 24 passaram, zero falhas: matriz, projeções, falhas de carregamento, idade, cliente alterado, limites, API com provedor simulado, cache, subprotocolos existentes, Psicologia/TEA e timeout de IA. |
| Navegador | Nove cenários passaram; Chromium 151, Playwright 1.62.1, autenticação sintética e endpoints externos interceptados. Sem erro JavaScript. |
| Apresentação | Três áreas, desktop 1365 claro e celular 390 escuro; tela de 320 com texto a 200%, sem largura excedente após estabilização. Capturas e impressão inspecionadas localmente. |
| Falhas | JSON ausente/truncado/pendente não vira lista geral do piloto; falha simulada 503 da IA produz resposta local com as regras corretas; sem chamada de IA quando o registro não carrega. |
| Preservação de dados | 88 registros do espelho + um extra; 89 resultados idênticos em cada aplicativo, 89 contextos de IA idênticos em cada aplicativo e 89 payloads/prompts idênticos por caminho. |
| Preservação visual | Cardiologia e Endocrinologia em `/medico/`, `/protocolo/` e `/recepcao/`: seis comparações de DOM e pixels idênticas. Aguardar estabilização dos observadores evita comparar estados intermediários. |
| Sintaxe | `node --check` em 12 arquivos de código passou. `git diff --check` passou. |

Evidência externa ao checkout: `evidencias-implementacao-piloto/browser-verification.json`, `baseline-comparison.json`, capturas, PDF e três páginas renderizadas com Poppler. Saídas dos testes: `resultado-testes-piloto.txt`. Diff e manifesto: `DIFF-PILOTO-CONVULSAO-20261016.patch` e `MANIFESTO-IMPLEMENTACAO-PILOTO.json`, no diretório de trabalho pai.

Reprodução sem rede, sem instalar dependências ou chamar provedor:

```powershell
node --test worker/tests/clinical-condition-pilot.test.mjs worker/tests/subprotocol-requirements.test.mjs worker/tests/psychology-autism-rule.test.mjs worker/tests/gemini-timeout.test.mjs
node testing/clinical-pilot/compare-baseline.mjs
# Apontar CLINICAL_PILOT_PLAYWRIGHT para uma instalação já disponível, se necessário.
node testing/clinical-pilot/verify-browser.mjs
```

O navegador de teste abre servidores exclusivamente em `127.0.0.1`, em portas livres, e os encerra ao terminar. As respostas de autenticação e de IA são artificiais. Nenhum teste usa paciente real.

## Limitações e próximo lote

Não houve login real, chamada a provedor pago, alteração de autorização, credenciais, SQL, migração, consulta a conteúdo clínico pessoal, upload, uso adicional da Library ou execução de workflow remoto. Atualização do lote 2: o Worker principal e a IA foram empacotados offline com esbuild 0.28.1 da instalação oficial existente de Wrangler 4.135.0. Não foi executado o CLI de publicação ou acesso a conta/bindings. O ciclo completo de atualização de Service Worker em um navegador com cache de produção foi simulado em VM, não em conta real.

O ganho de contexto integral vale para esta condição selecionada. Os outros motivos, o assistente sem essa seleção e os consumidores administrativos que não usam essa seleção continuam nos caminhos antigos e nos limites de compactação já inventariados. Isso não é uma auditoria completa desses caminhos.

O relatório técnico inicial, separado deste checkout, continua sendo a referência de inventário das bases, caches, sobreposições, áreas administrativas e divergências observadas. Suas conclusões não foram convertidas em erro de protocolo sem fonte.

O segundo lote de Ortopedia / Dor no Ombro já foi integrado com a matriz documental recebida, mantendo o recorte DigSaúde separado das referências relacionadas do SISREG/Campo Grande. Ver checklist e pendências no checkpoint dos dois pilotos.

Antes de uma publicação futura, resolver as quatro pendências acima, validar editorialmente o recorte contra os arquivos institucionais e seus hashes, testar o build no ambiente autorizado, reconciliar main sem interferir no trabalho concorrente e obter autorização específica para publicação. Frontend e Worker precisam usar a mesma revisão do registro. Este checkpoint não autoriza publicação.

O trabalho paralelo de ajuda em `/cidadao/` permanece fora deste lote. Não se presume acesso ao conteúdo do trabalho cloud ou aos anexos das outras frentes. A criação deste checkout ocorreu em um clone próprio, sem reset, descarte, checkout ou alteração nos repositórios de trabalho anteriores.
