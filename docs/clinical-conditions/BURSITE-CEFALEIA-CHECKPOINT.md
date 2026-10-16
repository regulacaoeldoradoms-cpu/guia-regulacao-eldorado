# Bursite/Tendinite e Cefaleia - segundo lote

Base: `bc7b92692119df1aaa80db1f93c81b1eb0a6e83b` (PR #664). Branch `feat/piloto-bursite-cefaleia-20261016`, PR #665. Commit, push, novo PR, integração e publicação autorizados em 16/10/2026, às 22:08 UTC, condicionados à aprovação de todas as verificações obrigatórias. A candidata inicial de 22 arquivos foi conferida pelo manifesto local. O diff final tem 23 arquivos, incluindo a correção localizada do bootstrap de Fontes em `js/app.js`. A descrição do PR #664 permanece intacta.

Dois registros novos: `digsaude.ortopedia.bursite-tendinite` (7 unidades documentais em 9 itens estruturados) e `digsaude.neuropediatria.cefaleia` (17 unidades em 18 itens). Os três registros do PR #664 permanecem byte a byte idênticos. O conjunto passa a cinco registros e 69 itens na estrutura `rules`; cada pergunta recebe somente o recorte pertinente e integral. Não foram acrescentadas três novas exigências.

## Conferência documental

S2: Núcleo Telessaúde MS, versão 2.0 de 06/10/2025, 72 páginas, 710424 bytes. SHA-256 medido: `96445fc56ecf27e3b81a47389c923a0a4c837372eeab5e31c7fba054ad139315`. O PDF local foi lido, renderizado e as páginas físicas 36/37 e 46/47, impressas 30/31 e 40/41, foram abertas e inspecionadas. O hash identifica bytes; não certifica origem institucional, oferta, vigência ou aplicabilidade municipal. A mensagem original do provável grupo WhatsApp não foi verificada.

A pesquisa dirigida no Gmail foi concluída pela frente responsável: três consultas, 14 mensagens únicas, sem atualização clínica nova confirmada para estes motivos DigSaúde. Não se afirma pesquisa exaustiva de toda a caixa ou vigência externamente certificada. Pedidos de melhorias, esclarecimento etário SISREG/Campo Grande, agendamentos, judicialização e devolução individual não viram normas DigSaúde.

## Regras preservadas

- Bursite/Tendinite: adulto a partir de 18; ausência de resposta satisfatória ao tratamento **não farmacológico** (exercícios, acompanhamento fisioterápico) otimizado por **6 meses**; característica da dor, evolução, fatores desencadeantes/alívio, restrição de movimento **ou** prejuízo funcional, trauma. **RX da área afetada em AP e perfil E USG obrigatórios**. A RM anterior pertence a Cervicalgia/Lombalgia; não foi importada. Sem sessões, validade ou relatório fisioterápico inventados.
- Cefaleia: até **16 anos, 11 meses e 29 dias**; cinco critérios, incluindo mínimo de **2 meses** de profilaxia na APS no critério pertinente e os dois itens parcialmente repetidos de investigação RM/TC. A duplicação/ambiguidade permanece em nota, sem resolução ou elegibilidade automática. Cinco sinais de alerta preservados, sem criar urgência automática. Exame físico neurológico é **avaliação clínica obrigatória**; diário é **registro obrigatório**; TC/RM **se houver**; EEG não é exame obrigatório. Quadro clínico atual, documentos anexados **ou** descritos e familiar/responsável mantidos. Sem importar a seção seguinte de Convulsão/Epilepsia; sem preencher a lacuna de 17 anos ou inventar profilaxia, diário ou validade.
- Dor no Joelho fica fora; não há registros novos SISREG/CORE.

## Integração e evidência

Guia, Fontes técnicas, Recepção, impressão, contingência e Worker usam os mesmos JSONs completos. `registrosObrigatorios` mantém o diário fora de `examesObrigatorios`. A reconstrução canônica ignora texto clínico adulterado no cliente; a sondagem usa o endpoint autenticado existente, em lotes de no máximo três IDs, preservando suas barreiras.

A classificação específica de Bursite/Tendinite precede o termo anatômico ombro. Cefaleia substitui o contexto de crise quando é explicitamente perguntada. Mudança para diabetes/autismo/joelho e falha de um registro preservam o catálogo pertinente. A escolha curta conserva pergunta e idade. Um recorte não é usado como regra de outro sistema/faixa.

Revisão do PR #665 identificou seleção silenciosa do primeiro motivo em perguntas mistas. O cliente agora pede uma condição por vez, limpa o contexto anterior e conserva essa escolha pendente diante de respostas só com o sistema ou perguntas genéricas. A busca nas três rotas mostra a mesma orientação; o Worker também interrompe perguntas mistas antes de qualquer provedor, mesmo com lista incompleta de um cliente antigo. “Bursite no ombro” e “Bursite e tendinite” continuam um recorte; comparação entre os dois sistemas para Dor no Ombro permanece disponível. Dois testes novos reproduziram a falha antes da correção; 66 testes dirigidos e seis cenários Chromium afetados passaram depois. Fonte clínica, dados dos registros e impressão não foram alterados.

Outros dois achados reproduzidos no navegador foram corrigidos: `/protocolo/` usa o registro compartilhado dos cinco motivos para restaurar URLs de condição após recarregar/compartilhar; abrir um motivo pelo botão também limpa a escolha pendente da conversa. Dez cenários de navegação dos novos recortes e seis de links dos recortes anteriores passaram, além dos 66 testes dirigidos. Nas rotas sem launcher da IA, o estado pendente é exercitado pela API local compartilhada; o botão e o conteúdo são reais. Asserções e gates preservados.

Release clínico local `20261016-4`: somente os marcadores/URLs clínicas e contratos exatos correspondentes foram atualizados. Namespace global, marcador do Canal, autenticação, banco, permissões e outros módulos permanecem preservados. Nenhuma asserção ou gate foi removido. Uma busca com recorte-piloto deixa de exibir simultaneamente a mensagem legada de lista vazia.

Validação anterior preservada: 1086 testes do Worker; 103 dirigidos/cache/regressões; 14 cenários novos Chromium e 10 do PR #664. Após a revisão editorial, foram executados somente checks afetados: 49 testes clínicos, oito cenários de fluxo/geometria e seis de cache nativo com HTML `20261016-3`; build offline com os cinco registros atuais e projeção integral dos novos metadados. Sem rede de provedor ou pacientes.

Em 320 × 900 px e texto a 200%, a barra global ocupa os últimos 72–76 px e seus rótulos “Início/Ferramentas” se sobrepõem em cerca de 8 px. Isso também ocorre na captura anterior do PR #664. Foram testadas todas as linhas dos requisitos e as ações de impressão/fonte: ficam descobertas e acessíveis ao rolar, nas três rotas. A barra global não foi alterada. O conteúdo clínico não apresenta transbordamento horizontal. A medida é específica desse viewport; não certifica toda configuração de teclado ou dispositivo.

## Reconciliação e impressão após revisão da fonte

O PDF real foi relido antes de comparar os campos. A matriz independente tem 7 + 17 = 24 unidades documentais. Os 27 itens estruturados resultam dos três desdobramentos abaixo, também descritos em `editorialBreakdown` nos JSONs; não adicionam critério, exame ou documento:

| Item adicional na estrutura | S2 física / impressa | Trecho da mesma unidade da fonte |
| --- | --- | --- |
| Bursite `EVOLUCAO` | 47 / 41 | “tempo de evolução”, junto de “característica da dor” |
| Bursite `FATORES` | 47 / 41 | “fatores desencadeantes e fatores de alívio”, no mesmo item da dor |
| Cefaleia `APRESENTACAO` | 36 / 30 | “informações do quadro clínico atual, documentos anexados ou descritos” |

Todos os critérios, cinco alertas, números, alternativas e qualificadores foram conferidos. A duplicação parcial dos critérios de imagem não foi resolvida nem transformada em elegibilidade automática. Isso é revisão documental/editorial, sem substituir validação clínica/institucional.

As quatro páginas iniciais de Cefaleia tinham excesso de espaços/quebras. A versão final usa três páginas, mantendo fonte de 18 px, entrelinha, margens de página e todo o conteúdo. O hash do HTML fora dos estilos é idêntico. Bursite permanece em duas páginas, com notas iniciando juntas na segunda. Apenas a paginação dos dois novos registros mudou; o HTML de impressão dos três registros anteriores é idêntico. Todas as cinco páginas finais foram renderizadas e abertas.

Pendências: validação clínica/institucional e aplicabilidade atual; relação entre os critérios de imagem; faixa de 17 anos; definições ausentes que não viram requisitos. Próxima etapa autorizada: enviar este lote em novo PR, corrigir achados reais sem enfraquecer gates, integrar somente com todas as verificações aprovadas e conferir o deploy seguro e os arquivos servidos em produção. A autorização de publicação não certifica vigência, oferta, pactuação ou aprovação clínica institucional. Sem migração, mudança de banco, credenciais novas ou chamadas pagas.
