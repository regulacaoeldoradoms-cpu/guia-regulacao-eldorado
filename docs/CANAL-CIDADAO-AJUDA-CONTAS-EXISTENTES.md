# Ajuda do Canal para contas existentes — correção local

Base remota conferida em 14/10/2026: `740a12d70a8c49130729e53031cd5dd3927d4232`, merge da PR656. Branch isolada `fix/citizen-help-entry-20261014`. Checkouts anteriores preservados. Este trabalho permanece local: sem push, novo PR, merge, publicação, consulta autenticada produtiva, migração ou alteração de flag.

## Diagnóstico verificado

- Não há filtro de criação/idade da conta na entrada do tutorial. Conta sintética criada em 2025, sem primeiro acesso pendente, abriu o tutorial tanto por `/cidadao/` quanto pelo shell móvel. Papéis cidadão e médico foram exercitados sem alterar autorização.
- No código integrado, o acionador tem somente um ícone: seu `textContent` é vazio, não há texto visível “Ajuda”. Reproduzido em 390px direto/shell e 1280px direto.
- A entrada só é montada após concluir as consultas iniciais. Ao manter `/api/council/my` pendente em mock local, o formulário nativo está disponível, mas a ajuda continua ausente. Falha do módulo opcional é silenciosa.
- Esses são problemas reproduzidos no código. A causa exata na sessão produtiva do usuário não foi homologada: o print `libfile_f71dc30f719c8191b8e23feac8d9476b` retornou metadados/ponteiro, sem pixels renderizados; a materialização pelo helper atual falhou. Não se afirma ter visto o print. O acesso HTTP público foi bloqueado pelo proxy deste ambiente na etapa anterior.

## Plano e resultado

1. Tornar a entrada identificável sem redesenhar formulário/home: rótulo “Ajuda”, nome acessível e alvo de pelo menos 44px, fora do fluxo nativo.
2. Criar a entrada antes das consultas iniciais; carregar o tutorial separadamente e oferecer retry com erro visível, Fechar ajuda/Escape e retorno de foco. O botão continua disponível durante uma consulta pendente; iniciar a demonstração aguarda a segurança/operações do Canal. A opção de privacidade é lida do estado atualizado, não de uma cópia anterior à resposta.
3. Reutilizar a mesma entrada ao montar o controlador; versão de launcher permite substituir o módulo antigo, sem duplicar entrada. Versão do progresso e etapas continuam `1`: nenhum progresso por usuário é apagado.
4. Renovar referências compartilhadas para `20261014-citizen-help-1` e marcador HTML/SW `20261014-7`, conforme o contrato existente. Sem limpar caches globais, forçar reload ou alterar UI da home. Uma aba que já executou o controlador anterior ainda precisa receber o novo documento; não é recarregada automaticamente, preservando rascunhos/anexos.

O adaptador demonstrativo, barreiras de rede, rota autenticada de conclusão, autorização, sigilo versus anonimato, migração e mecanismo de conquista permanecem intactos. Pausar, pular e refazer não gravam conquista. Nenhuma migração/flag foi reaplicada: a coordenação informou que já havia realizado a ativação produtiva, que não é reexecutada ou tratada como uma verificação deste patch.

## Validação local afetada

- Sintaxe e diff sem erros; **78 testes focados** de conclusão autenticada, segurança da transição/primeiro acesso, interações, performance e cache passaram. **51 testes** de cache/performance/UI social também passaram; há sobreposição, os totais não são somados.
- **12 cenários de entrada**: 320/390/1280px, claro/escuro, texto 100/200%; texto/iconografia sem sobrepor conteúdo nativo, retângulos nativos idênticos com/sem ajuda, fechamento, teclado e foco.
- **10 cenários de contas existentes/carga**: cidadão 320/390/1280 direto, cidadão 390 shell, médico 390/1280 direto, consulta de manifestações pendente, segurança pendente, módulo 503/retry e módulo antigo em memória. Preservam nós/rascunho/File e retomada na etapa 3, refazer na etapa 1; zero chamadas mutantes do Conselho ou de conclusão nesses casos. No caso de falha, o retry por Enter mantém foco no botão que inicia o tutorial. O caso de segurança pendente conserva “sigilosa” após a resposta real do mock, mesmo com `emailVerified` falso no cache anterior.
- **8 percursos integrais**: 320/1280px, claro/escuro, texto 100/200%; zero APIs durante demonstração, Enter/submit nativo/eventos duplicados protegidos, anexos/rascunho preservados. A única gravação de conquista ocorre no mock local após todas as etapas.
- **4 cenários de ciclo de vida**: mobile/desktop com teclado/foco, cancelamento de preparação, resize, alvos ausentes, troca de conta/logout, Back/Forward, progresso corrompido, opção Bronze, falha de helper e PDFs nativos. Impressão desktop antes/depois é idêntica; nenhuma conquista nas interrupções.
- **12 comparações visuais afetadas** contra o SHA base passaram: Cidadão com detalhe aberto, Canal e Conquistas em claro/tela e escuro/impressão, desktop/mobile. **12 PNGs exatamente idênticos**, com zero pixels diferentes após a projeção validada somente da ajuda solicitada. O helper reconhece ajuda/conquista já existentes no baseline, valida os contratos e mantém os gates de geometria, estilos e pixels. A conquista já integrada é comparada intacta.

Capturas são renderizações reais do Chromium isolado com dados e nomes inventados. Foram revisadas a entrada móvel 390px, 320px com texto 200%, menu desktop escuro e estado de falha/retry. JSONs, PNGs e PDFs locais registram os resultados. Leitor de tela humano, Safari/iOS e teclado físico/virtual de aparelho não foram homologados; viewport reduzida e árvore acessível são ensaios sintéticos. Evidência histórica dos demais módulos permanece válida, sem repetir sua auditoria integral.

O workflow de tutorial passa a executar a regressão de contas existentes e incluir sua evidência no artefato existente. A comparação contra main foi corrigida para um baseline que já contém a PR656; nenhuma tolerância ou proteção foi enfraquecida. Sem push, CI remoto não foi disparado nem declarado verde para este patch. Próxima ação: revisão deste patch local e decisão explícita da coordenação antes de publicar novas correções.
