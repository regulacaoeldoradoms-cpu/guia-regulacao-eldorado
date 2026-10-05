# Agenda / WhatsApp — diagnóstico e patch LOCAL

Base: main pública confirmada via GitHub em 05/10/2026, SHA 220f30989ff6215dc539c1d51f72823bb90e7c77.
Branch: fix/agenda-whatsapp-patient-contact. Cópia Git independente em task-3/agenda-whatsapp; checkouts concorrentes preservados.

Estado: homologação estrutural do diálogo/campo concluída; patch em preparação para PR draft autorizado. Não comprovada a origem exata do número do incidente anterior. Merge e deploy não autorizados.

## Falhas confirmadas e limites

Fluxo: userscript DigSaúde → ponte postMessage → API protegida → Firestore do módulo → record.phone → href. D1 não armazena o telefone da Agenda.

Falhas confirmadas na base:
- phoneFromRoot varria a consulta inteira e inputs genéricos; phoneCandidate removia letras e extraía substrings numéricas. Um identificador sintético com formato numérico de telefone foi aceito em HTML de teste no Edge headless.
- navigateContactWindow conferia apenas origem e readyState. Podia devolver o Document da ficha anterior durante a navegação e associar o contato ao sourceId seguinte.
- contact-state considerava qualquer telefone salvo como conhecido, sem expiração/proveniência. A coleta ignorava esse sourceId e sync preservava o número anterior quando não recebia outro.
- Normalização/href apenas formatam o valor recebido; acrescentar nono dígito não recupera a fonte oficial nem corrige associação.

Os screenshots não identificam qual campo/consulta produziu o telefone do incidente. Não houve leitura de valores pessoais, bancos reais, cookies, tokens, senhas, prontuários ou outra ficha; nenhuma mensagem/link WhatsApp foi aberto.

## Homologação estrutural autorizada

Foi usada a ferramenta suportada cua_repl/Chrome por extensão, somente leitura DOM direcionada. Sem mouse/teclado globais, navegação, novo login ou alteração de cadastro.

A primeira aba observada estava em Pacientes, sem diálogo pertinente. Depois o operador abriu Dados do Paciente em outra consulta e autorizou a inspeção estrutural. A rota já aberta tinha o formato `/Núcleo de Telessaúde - SES-Fiocruz/consultas/{ID_REMOVIDO}/view`; nenhuma identidade/ID real foi copiada.

Confirmado no DOM:
- título H2.fi-modal-heading com texto fixo Dados do Paciente;
- contêiner externo DIV.fi-modal.fi-modal-open, role=dialog;
- contêiner interno DIV.fi-modal-window visível, contendo o mesmo título;
- INPUT de texto desabilitado, id e wire:model `mountedActionsData.0.telefonecel`, name vazio;
- LABEL.fi-fo-field-wrp-label com texto Telefone e for ligado a esse input;
- wrapper DIV.fi-fo-field-wrp, com descendentes fi-input-wrp e fi-input-wrp-input.

O patch inicial contava os contêineres externo/interno como dois diálogos. A inspeção retornou 2 contêineres candidatos. O ajuste usa o contêiner mais interno de cada hierarquia: 1 diálogo independente, 1 campo explícito de telefone e relação label-for confirmada. Dois diálogos independentes continuam recusados. Título deve ser exato.

O valor do telefone real não foi lido. A fixture foi construída diretamente como projeção sanitizada das tags/ancestrais/classes fi-* pertinentes; o value e a identidade de ficha são sintéticos. Não inclui outros campos pessoais, wire:snapshot, x-data, tokens ou ID de consulta real. A fixture adiciona um telefone profissional sintético fora do diálogo para testar isolamento.

Arquivos: AGENDA-CONTATO-ESTRUTURA-OBSERVADA.json e worker/tests/fixtures/agenda-patient-dialog.html.

## Patch

Coleta aguarda origem + pathname exato + Document diferente; abre a ação do paciente e exige diálogo único. Não varre grids/inputs genéricos, IDs arbitrários, placeholders, aria-labels ou substrings. Telefones conflitantes não geram destino.

Normalização valida campo inteiro, DDD e formato nacional, mantém os dígitos e não inventa nono dígito. Aceita fixo válido sem presumir registro no WhatsApp. Corrige número nacional com DDD 55.

Metadados v2 vinculam contato à consulta e ao paciente/data de solicitação do espelho, com validade de 24h. Legados não saem na API nem contam como conhecidos até nova coleta. Tentativa vazia/falha revoga destino anterior; associação alterada/expirada não produz href. Um snapshot sem tentativa só preserva contato verificado vigente da mesma associação. Metadados garantem o fluxo da aplicação autenticada; não são assinatura do sistema estadual.

Userscript 1.2.5 e cache URLs atualizados localmente. Worker/userscript precisam ser entregues juntos em etapa futura. Contatos antigos ficam indisponíveis até nova coleta.

## Evidências reutilizadas e novas

Etapa anterior: 59/59 testes aprovados em `node --test worker/tests/agenda.test.mjs worker/tests/agenda-capacity.test.mjs scripts/agenda/recuperar-firebase-agenda.test.mjs`. Inclui duas fichas sintéticas no fluxo coleta → enriquecimento → sync mockado → API → href, ausência/ambiguidade/invalidade, contatos profissionais/IDs, rota/Document anterior, legado, expiração, alteração de associação e revogação.

Após o ajuste estrutural, somente 3 testes afetados foram repetidos e 2 novos adicionados: 5/5 aprovados. Comando: `node --test --test-name-pattern='coleta fica|fichas sintéticas|falha de coleta|Filament homologado|homologação do diálogo' worker/tests/agenda.test.mjs`. Os demais resultados permanecem reutilizados; não houve nova execução integral. Nesta etapa a suíte passou a conter 61 testes.

DOM real: validação dos seletores estruturais somente, sem value. Fixture em Edge headless, rede bloqueada: diálogo aninhado escolhido corretamente; input desabilitado sintético lido; telefone profissional externo ignorado; vazio/conflito/título incorreto/dois diálogos rejeitados; duplicata oculta ignorada. Script local de replay em task-3/verify-homologated-contact-dom.cjs.

Sintaxe do userscript afetado e git diff --check aprovados. A CI da Agenda passa a observar alterações da fixture.

## Limites e próxima etapa

Homologado: estrutura e seletor do diálogo/campo da tela autorizada. Não homologado ao vivo: abertura automática da ação, navegação serial completa com o userscript, persistência/número real por ficha, causa específica do incidente anterior. A abertura do diálogo foi feita pelo operador e nenhum fluxo real completo foi executado.

Conferência humana oferecida é complementar; não substitui testes, seletor ou associação correta e não constitui autorização de publicar. Próxima decisão: revisão do patch local e escopo explícito de eventual validação operacional coordenada. Posteriormente o usuário autorizou o envio deste patch em PR draft; merge/deploy continuam fora do escopo.

## Fechamento de lacunas do fluxo automático sintético

Os novos testes reproduziram, antes da correção adicional, três falhas: janela fechada após clicar ainda entregava telefone; troca de Document durante a coleta entregava o telefone de outro documento; fetch antigo, concluído após pausa/reativação, ainda enviava snapshot.

Correção: coleta fixa a referência da janela e do Document validado; verifica fechamento/troca/geração a cada etapa; pausa/reativação invalidam operações anteriores; espera da ponte é rejeitada ao pausar; snapshot não é enviado com sincronização desativada; resultado/erro de geração antiga não limpa o envio da geração atual.

8/8 testes novos aprovados com DOM modelado a partir da fixture homologada e sem navegador real: diálogo atrasado, fechado, ausente/ambíguo; cache só na mesma associação; fechamento inclusive com cache; troca de Document; fetch/erro antigo após pausa; cancelamento durante espera da ponte; resposta antiga; repetição pelo userscript e deduplicação executando o código real da ponte; backend com armazenamento mockado até href. Três testes afetados de navegação/coleta anteriores também foram reexecutados e aprovados. A suíte contém agora 69 testes, sem nova execução integral local.

O fluxo completo foi exercitado apenas em ambiente sintético. Mantêm-se pendentes homologação operacional ao vivo e causa individual do incidente. A aba real não foi operada nesta etapa e segue liberada ao usuário.

## Contrato de compatibilidade autorizado

O PR inclui agora capacidade v2 explícita no Worker e verificação em frontend/ponte/coletor. Backend antigo, rollback, marcador ausente/inválido e erro deixam consumidores atualizados sem destino; a perda de capacidade limpa cache e cancela a sessão. O botão revalida o registro antes de atribuir URL a uma janela inicialmente inerte. O gate de deploy e seu rollback não foram modificados.

7 testes focados novos e 49 testes afetados de Agenda/contrato/capacidade aprovados. Evidência anterior de recuperação Firebase permanece reutilizada; suíte CI passa a ter 76 testes. Homologação integrada local com páginas/scripts completos e Worker com armazenamento sintético: 12 verificações, 51 chamadas API, zero erros JavaScript, sem navegação externa ou mensagens. Clientes antigos precisam ser fechados/atualizados antes da retomada; somente clientes atualizados entendem esse contrato.

Publicação coordenada posteriormente autorizada, condicionada às checagens e ao plano de transição. Nenhuma publicação foi realizada durante estes testes. Não se exige reproduzir indefinidamente o incidente original como pré-condição para o piloto controlado. A conferência operacional restrita continua pendente após a entrega confirmada.
