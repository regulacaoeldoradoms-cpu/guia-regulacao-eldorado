# Dois pilotos — checkpoint final local de 16/10/2026

Revisão técnica focada concluída frente à matriz documental recebida. O usuário autorizou criar PR, integrar e publicar este primeiro lote após todos os checks, mantendo as lacunas sinalizadas. A preparação da publicação está em andamento; nenhuma expansão foi iniciada.

Branch: feat/piloto-convulsao-epilepsia-20261016. Base original: 380a40b1a5e58c309151b066fef0b79ec9313489. Main b5a0bbfc5cf01b0fb964ad9c76e0ee47222923a3 incorporada pelo merge 0139ec1a7f78369b4486259fb56954078f9017d0, preservando PR663. O manifesto da revisão local foi preservado; os commits, a árvore final e os resultados da publicação são registrados no manifesto externo de publicação.

São duas condições editoriais e três registros: Convulsão/Epilepsia DigSaúde, Dor no Ombro DigSaúde e um quadro separado de seções relacionadas SISREG/Campo Grande. O terceiro não constitui protocolo específico de Dor no Ombro nem fonte CORE. A frente técnica conferiu fidelidade à matriz comunicada; não abriu os PDFs originais nem presume acesso a anexos de outras conversas.

## Fontes e alcance da conferência

| Fonte | Identidade e uso |
| --- | --- |
| S2 / TEL2 | Telessaúde MS 2.0, 06/10/2025, 72 páginas, 710424 bytes. SHA-256 comunicado pela frente documental: 96445fc56ecf27e3b81a47389c923a0a4c837372eeab5e31c7fba054ad139315. Convulsão: físicas 36–38/impressas 30–32. Ombro: físicas 46,48–49/impressas 40,42–43. |
| S1 / MAN1 | Manual Operacional Oficial V1, 31/07/2026, Regulação de Eldorado/MS. p. 4: relato versus avaliação profissional; p. 6: cirurgia prévia. Hash não vinculado nesta frente. |
| S3 / CG2024 | Campo Grande, versão 2023/Revisão, Resolução SESAU 785/2024, DIOGRANDE 7.397, Suplemento I. SHA-256 comunicado: e55027e9c928148dedf022584e164ea8ad6059e6a5698970c87e36b69c60673c. Referências pertinentes nas físicas/impressas 14–15,19–20,219–225; sem auditoria integral das 386 páginas. |
| S4 e S5 | Recorte DigSaúde de 2024 e resumo municipal DOCX identificados pela frente Gmail. Contexto histórico; não substituem automaticamente S2/S3. |

Atualização de proveniência: o setor relatou que S2 provavelmente veio do grupo WhatsApp DigSaúde do qual participa. É origem provável relatada, sem mensagem original verificada. A busca complementar no Gmail não confirmou atualização clínica posterior dos dois pilotos; a orientação CORE encontrada é operacional e fica fora deste lote. A ausência de atualização encontrada não cria requisito. Referências internas de anexos foram retiradas dos arquivos públicos; hashes, versões e páginas foram preservados.

Hashes identificam bytes; não comprovam origem institucional, vigência, oferta atual ou pactuação. As páginas do corpo foram distinguidas das páginas do sumário. Essas verificações institucionais permanecem notas de curadoria, sem virar requisitos adicionais de uma solicitação.

## Checklist — Convulsão/Epilepsia no DigSaúde

Registro: digsaude.neuropediatria.convulsao-epilepsia. Revisão: piloto-convulsao-20261016-3. Quinze regras em data/clinical-conditions/convulsao-epilepsia-20261016.json, mais contexto profissional e limites da seção.

| Matriz | Resultado da revisão | Vínculo |
| --- | --- | --- |
| NP-01 | Até 16 anos, 11 meses e 29 dias. Aos 17, aviso da lacuna, sem destino automático. | IDADE; IDADE17 |
| NP-02 | Um ou mais episódios sugestivos de crise convulsiva, com a exclusão vinculada ao critério. | CRISE; exceptionRefs |
| NP-03 | Epilepsia prévia com controle inadequado apesar de monoterapia otimizada em dose plena, descartada má adesão. | MONO |
| NP-04 | Epilepsia prévia com efeitos adversos intoleráveis da medicação. | EFEITOS |
| NP-05 | Epilepsia prévia com controle inadequado apesar de duas ou mais medicações anticrise em dose plena, descartada má adesão; difícil controle. | DIFICIL |
| NP-06 | Descrever quadro clínico atual e tratamento que sustenta o critério pertinente. Documentos anexados OU descritos; sem criar documento adicional. | QUADRO; TRATAMENTO; APRESENTACAO |
| NP-07 | Exame neurológico obrigatório como avaliação profissional, separado dos complementares. S2 física 38/impressa 32 e distinção profissional em S1 p. 4. | NEURO |
| NP-08 | EEG, TC e RM de crânio se houver: opcionais para instrução documental desse recorte. Não é dispensa de exame clinicamente indicado. | EEG; TC; RM; INDICACAO |
| NP-09 | Familiar/responsável necessário no teleatendimento. | RESPONSAVEL |
| NP-10 | Convulsão febril simples excluída do critério de episódios sugestivos. A exclusão não virou proibição universal nem criou outra rota. | FEBRIL |
| NP-11 | Início/evolução/frequência e medicação/dose/adesão/resposta podem ser relato. Exame, interpretação, hipótese, tratamento e risco dependem de profissional. Não virou checklist documental adicional. | professionalBoundary; nota clínica |
| NP-12 | A seção não define prazo máximo de espera, validade de EEG/TC/RM, CRM/especialidade do solicitante, alternativa sem exame ou roteiro próprio de urgência convulsiva. Não inferir dispensa nem inexistência de outra norma. Limite preservado em detalhes, resposta contextual, impressão e IA. | sourceLimits |

Guia, fontes, Recepção, impressão, contingência e IA preservam o registro da condição. A Recepção confere presença da informação, sem realizar ou interpretar exame neurológico. Relatório escolar, BERA, M-CHAT e SNAP não foram importados como requisitos desta condição.

## Checklist — Dor no Ombro no DigSaúde

Registro: digsaude.ortopedia.dor-no-ombro. Revisão: piloto-ombro-20261016-2. Dezesseis regras em data/clinical-conditions/dor-no-ombro-20261016.json.

| Matriz | Resultado da revisão | Vínculo |
| --- | --- | --- |
| OM-01 | A partir de 18 anos. O limite superior do SISREG não foi transportado. Menor idade gera aviso, sem escolher outra rota. | IDADE |
| OM-02 | Ruptura total de tendão do manguito rotador evidenciada em imagem. | TOTAL |
| OM-03 | Ruptura parcial em progressão OU com dor refratária ao tratamento clínico otimizado. Sem prazo universal de seis meses. | PARCIAL; anyOf |
| OM-04 | Dor no ombro refratária ao tratamento clínico otimizado por seis meses. | DOR6 |
| OM-05 | Osteoartrite com potencial indicação cirúrgica: dor refratária ao tratamento otimizado por seis meses OU importante prejuízo às atividades de vida diária. A segunda alternativa não ganhou prazo de seis meses. | OA; anyOf |
| OM-06 | Luxação recorrente APÓS avaliação em serviço de emergência. | LUXACAO; prerequisite |
| OM-07 | Descrever restrição de movimento/prejuízo funcional, presença de luxação, trauma prévio e tratamento atual/prévios da dor. | MOVIMENTO; PRESENCA_LUXACAO; TRAUMA_PREVIO; TRATAMENTOS |
| OM-08 | RX AP + P + axilar e USG obrigatórios no recorte S2. A seção não descreve dispensa quando indisponíveis; essa ausência não criou nova exigência. | RX; views; USG |
| OM-09 | RM do ombro se houver. | RM; availability |
| OM-10 | TC apenas com história de instabilidade/luxação recidivante E se houver o exame. Ambos os qualificadores preservados. | TC; applicability; availability |
| OM-11 | Exame físico, indicação cirúrgica, hipótese e interpretação de imagem dependem de profissional. Histórico pode ser relato. Não criou exame físico obrigatório universal ou exame complementar adicional. | AVALIACAO |
| OM-12 | Se houve cirurgia, confirmar local, data aproximada, alta, seguimento e urgência. Data desconhecida continua incerta. | CIRURGIA |
| OM-13 | Não inferir validade dos exames, prazo máximo de espera, regime/dose de tratamento otimizado, documentos administrativos ou dispensa de RX/USG. São lacunas da seção, sem decisão adicional obrigatória agora. | uncertainties; availabilityNote |

A Recepção tem seis marcações de presença: quatro informações e dois exames. As notas de fonte não têm checkbox. As marcações não modificam a impressão, nem decidem elegibilidade, urgência ou bloqueio.

## Ombro — quadro separado SISREG/Campo Grande

Registro: sisreg-campo-grande.ortopedia.referencias-ombro. Revisão: referencias-ombro-cg-20261016-2. Onze regras em data/clinical-conditions/ombro-referencias-sisreg-cg-20261016.json.

| Vínculo | Regra e limite preservados |
| --- | --- |
| IDADE | Adulto 18–130 no texto. A sobreposição com pediatria aos 18 permanece sinalizada, sem escolha automática de especialidade. |
| GERAL | Informar história, evolução, exames, tratamentos e medicações; incompletude é tratada conforme a seção. |
| APS | Dor articular/tendinite: abordagem inicial obrigatória na APS. É seção relacionada, sem convertê-la em protocolo específico de Dor no Ombro. |
| IMAGEM_APS | “Deverão ser informados” RX AP/perfil e USG da área; não substituir a redação por pacote DigSaúde ou dispensa. |
| ESPECIALISTA | Avaliação de indicação cirúrgica encaminhada por ortopedista geral. Não generalizar a todo pedido de ortopedia. |
| IMAGEM_CIRURGIA | Informar imagem da área; não deduzir pacote próprio da cirurgia de ombro. |
| CIRURGIA_OMBRO | Lista preservada, inclusive cotovelo/túnel cubital; sem corrigir ou ampliar o escopo por inferência. |
| AGUDOS | Fraturas, luxações, trauma e osteomielite agudos seguem urgência/emergência em S3 p. 220. Não aplicar espera eletiva de seis meses. |
| GUIA | Observação suficiente, carimbo e assinatura no fluxo SISREG. O detalhe de espelho/manuscrito não foi inventado nem transportado ao DigSaúde. |
| POS_TELE | Encaminhamento SISREG após telemedicina pelo médico assistente da APS, com contato com Regulação quando a unidade não tem acesso. |
| PACTUACAO | Aplicabilidade concreta de Eldorado por procedimento/destino não comprovada. Não constitui fonte CORE. |

## Diagnóstico e correções de consultas sem sistema

A busca genérica podia abrir a especialidade geral antes da escolha do recorte. O assistente sem condição ativa podia retornar ao catálogo legado, e uma resposta curta de sistema podia perder o assunto. Esses caminhos foram corrigidos localmente.

- Busca “dor no ombro” nas três áreas: mostra escolhas DigSaúde e SISREG/Campo Grande, sem lista normativa antes da escolha. A camada prática não sobrepõe o artigo de escolha.
- Pergunta sem sistema nem recorte escolhido: pede escolha e faz zero chamadas ao provedor; catálogo geral e listas de outras regiões não entram.
- “Quais exames para dor no ombro?” → “DigSaúde”: conserva a pergunta original, envia somente o registro DigSaúde integral e responde aos exames. “E a TC?” mantém esse recorte.
- Pergunta que apenas menciona os dois sistemas pede escolha. Comparação explícita leva os dois registros completos, apresentados separadamente. “Diferença entre TC e RM no SISREG” continua sendo uma pergunta de um só sistema.
- “Convulsão infantil aos 17 anos: quais exames?” → “DigSaúde MS”: conserva a idade, informa a lacuna e responde também aos exames se houver. Não inventa destino.
- CORE recebe limite de fonte, sem substituir requisitos de outro sistema. Falha de carregamento do registro não usa lista geral como contingência.
- Notas institucionais, lacunas de fonte e limites de escopo ficam identificados separadamente, sem virar exigências confirmadas. Ausência de definição de tratamento otimizado ou de dispensa de RX/USG não cria dispensa, bloqueio automático ou obrigação de obter decisão agora.

## Contexto integral da IA e locais principais

Os três JSONs são a base canônica do piloto, independentemente da síntese visível. Antes de chamar o provedor, o cliente faz uma sondagem técnica no mesmo POST autenticado e compara os registros integrais retornados pelo Worker. Worker antigo ou registro diferente mantém a resposta local, sem chamada ao provedor. A sondagem não altera permissões e não é transformada em pergunta clínica pela ponte. O cliente envia o registro integral; a ponte o preserva e reduz primeiro histórico/catálogo. O Worker reconstrói a versão canônica pelo identificador/revisão, sem aceitar omissão ou adulteração de regras no cliente. Revisão incompatível produz 409; idade inválida, 400. Prompt integral acima do limite produz 413, sem corte silencioso.

| Local | Responsabilidade |
| --- | --- |
| js/clinical-condition-pilot.js | Carregamento/validação, escolha de sistema, continuidade da pergunta, idade, projeção integral, tela, contingência e impressão. |
| js/medical-app.js; js/app.js; js/reception-app.js | Encaixe dos registros nas três áreas. |
| js/ai-assistant.js | Impede retorno ao catálogo legado durante esclarecimento; leva a pergunta resolvida após resposta curta. |
| js/pre-regulation-bridge.js | Transporte integral dos registros, inclusive comparação em envelope grande. |
| js/referral-workbench.js | Preserva artigos de piloto e de escolha de sistema das sobreposições antigas. |
| worker/clinical-condition-pilot.js; worker/gemini-assistant.js | Reconstrução canônica, separação dos sistemas, contexto e prompt completos. |
| portal-sw.js; HTML das três áreas | Assets/marcador clínico 20261016-3; atualização restrita às rotas clínicas. |
| worker/tests/clinical-condition-final-review.test.mjs | Confronto dos 42 itens, lacunas, escopo, pergunta curta e transporte integral. |
| testing/clinical-pilot/verify-final-review-browser.mjs | Percursos reais no Chromium, com rede externa bloqueada e provedor simulado. |

O espelho histórico e seu workflow foram preservados. Os outros motivos mantêm os caminhos anteriores; não se afirma auditoria integral dos consumidores administrativos. O diff clínico é comparado à main b5a0bbfc incorporada. A frente separada de integração mobile do Canal não foi tocada.

## Verificações finais e evidências

- Preparação de publicação: 1066/1066 testes do Worker e sintaxe passaram após incorporar a main. Inclui 27 testes clínicos focados, os 42 itens da matriz e a conferência de compatibilidade sem provedor.
- Os contratos de ordem de scripts/cache foram atualizados para as URLs versionadas do lote, mantendo as asserções. A fixture SQL local foi normalizada para LF para executar o teste de rollout no Windows; nenhum conteúdo de migração mudou no Git e nenhuma migração foi aplicada.
- Oito cenários do Chromium passaram em um lote completo após a atualização de proveniência e a sondagem de compatibilidade, sem erro JavaScript ou HTTP externo. Três sondagens conferiram os registros antes das chamadas estritamente simuladas.
- Mobile de 390/320 px, temas claro/escuro e texto clínico ampliado foram conferidos sem transbordamento horizontal do conteúdo. Isso não certifica toda a navegação global do portal.
- Três impressões A4, três páginas cada, renderizadas com Poppler e inspecionadas. Todos os textos de regra foram encontrados; rótulos e grupos permaneceram juntos. A nota NP-12 foi acrescentada à impressão e o documento afetado foi rechecado.
- Build offline com esbuild 0.28.1/Wrangler 4.135.0 passou. Os três JSONs entraram nos bundles; o módulo empacotado da IA foi exercitado com provedor estritamente simulado e registro canônico completo. Sem instalação, credenciais, rede, produção ou escrita em outra worktree.
- Evidências anteriores intactas foram preservadas. Não foram repetidas as comparações completas dos 89 registros legados e dos seis pares de pixels do primeiro lote.

Entregas externas: evidencias-revisao-final/, resultado-revisao-final-testes-v4.txt, resultado-revisao-final-contratos.txt, DIFF-REVISAO-FINAL-DOIS-PILOTOS-20261016.patch, DIFF-INCREMENTAL-REVISAO-FINAL-20261016.patch e MANIFESTO-REVISAO-FINAL-20261016.json. O manifesto vincula os bytes finais, as evidências e a preservação dos snapshots anteriores.

## Lacunas registradas e próximo passo

A revisão técnica está fechada no escopo da matriz recebida. Origem institucional, vigência, oferta operacional, aplicabilidade municipal e pactuação permanecem sem confirmação independente nesta frente. Hash não resolve essas questões.

As lacunas de 17/18 anos, definição de tratamento otimizado, validade/espera e ausência de dispensa de exames permanecem literais, sem criar novo fluxo ou exigência. Não são decisões adicionais obrigatórias para encerrar esta revisão.

Próximo passo autorizado: incorporar a main atual preservando PR663 e alterações posteriores, abrir PR, exigir os checks e confirmar a publicação do cliente e do Worker canônico. Sem pacientes, chamadas pagas, novas chaves, SQL, migrações ou mudanças de permissão. O resultado de CI e produção deve ser registrado com PR/SHA; autorização não equivale a publicação concluída.
