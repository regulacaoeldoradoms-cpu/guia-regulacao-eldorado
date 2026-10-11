# Primeiro quadro e ação principal do cidadão

Base publicada `65b8f7f0c5ed2b61af6f8f196bf99b843b2f97ae`. Escopo exclusivo: `/cidadao/` no celular, com os demais fluxos preservados.

A reprodução usou sessão cidadã sintética, JS com atraso fixo de 350 ms e CSS de 150 ms. O código anterior carregava a apresentação após outras dependências. O primeiro quadro tinha título de 37 px e CTA de 189 px de altura; só depois mudava para título de 24 px e CTA de aproximadamente 102 px. Na primeira entrada pelo shell, a área era exposta antes de ativar a apresentação. A recarga também podia mostrar o cabeçalho nativo grande. Essas causas foram observadas sem depender de cache antigo.

O CSS mobile da página passa a estar no HTML inicial. Um bootstrap de apresentação usa apenas o estado cidadão já em cache para selecionar a cópia mobile durante a leitura do HTML, sem mudar autorização. As classes iniciais persistem até os widgets nativos e o cabeçalho compartilhado estarem prontos. O shell prepara exclusivamente essa superfície depois do gate nativo e antes de expô-la. Não esconde a página, não adiciona spinner artificial, não aumenta cache de dados e não muda rotas, permissões, consentimento, campos ou controladores de mascotes. As leituras de segurança e listas continuam frescas e paralelas. A cópia nativa continua disponível para desktop/impressão.

O CTA escuro recebe azul-petróleo (`#1c7a91`), texto branco, borda clara e estados explícitos de hover, pressionado, foco e desabilitado. O teste mede as cores computadas dos textos e do foco em Chromium; não estima contraste de pixels antialiasados. Critério para texto normal: pelo menos 4,5:1, conforme [WCAG 2.2 / contraste mínimo](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). A mudança de cor permanece isolada ao CTA mobile escuro.

Texto: normal **4,95:1**, hover **4,64:1**, pressionado **8,56:1**, foco **4,95:1** e desabilitado **5,71:1**. Anel de foco: **3,51:1** em relação ao preenchimento do botão, 3 px com afastamento de 3 px. O estado desabilitado usa preenchimento desaturado, texto cinza e cursor nativo sem ação.

Validação: filmstrip e amostras dos quadros visíveis em 320/360/390 px, claro/escuro, entrada fria, recarga com assets reaproveitados, retorno pelo shell e primeira entrada pelo shell. A fixture de recarga reaproveita assets localmente; não simula todos os comportamentos de cache HTTP/Service Worker de aparelhos reais. APIs permanecem novas. O gate exige título/cópia e tipografia corretos em todos os quadros visíveis, cabeçalho até 58 px e ausência de overflow. Passaram **24 cenários**, com **zero quadros** de geometria/cópia antiga ou overflow. Uma verificação adicional em 390 px mediu os cinco estados do CTA após estabilização das transições e repetiu os quatro caminhos nos dois temas.

Passaram 12 cenários funcionais incluindo texto 200%, oito comparações focadas de desktop/impressão e 16 testes de contrato social. Os gates gerais de CI, incluindo preservação completa e mascotes, continuam obrigatórios antes da publicação. Nenhuma captura contém informações retiradas do print ou consultas a pacientes/usuários reais.

## Velocidade comparável

Cinco pares alternados de entradas frias locais, largura 390 px, sessão cidadã sintética e API com atraso de 180 ms, comparando a base publicada e a alteração. Bytes são soma dos arquivos-fonte solicitados, sem representar compressão/CDN. Primeiro conteúdo visível (mediana): **204 → 184 ms**; primeira lista útil: **433.3 → 390.6 ms**; ação autorizada: **206.7 → 191.2 ms**. GET segurança permanece **3**, GET conta permanece **2**. Bytes-fonte solicitados: **3,296,867 → 3,303,235** (aproximadamente 6,4 KB adicionais, sem imagem pesada nova). Todas as dez amostras tiveram zero erros e zero APIs sem fixture. São medidas sintéticas locais, não resultados em rede móvel real.

## Limites

O JPEG da Biblioteca não foi visto: duas tentativas suportadas de materialização falharam no download. Foram inspecionados os pixels das capturas sintéticas antes/depois. Falta aceitação em aparelho real; publicação técnica não equivale a essa aceitação.
