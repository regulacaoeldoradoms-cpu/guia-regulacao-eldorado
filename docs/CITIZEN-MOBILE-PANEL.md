# Canal do Cidadão no celular

Base: main `7a2548fb4ea520940598a299da9d97d9aa381c85`, após o PR633. Escopo: apresentação e carregamento mobile de `/cidadao/`, além do cabeçalho compartilhado nas cinco áreas solicitadas. Sem alterações de permissões, backend, conteúdo clínico, rotas ou runtime dos mascotes.

O diagnóstico encontrou uma imagem nativa de 1.461.693 bytes usada em tamanho pequeno, consultas iniciais repetidas e uma espera sequencial pela segurança antes das listas. A página também colocava explicações secundárias antes da ação e usava cabeçalhos/cartões desproporcionais. O formulário tinha título fixo que ocupava quase toda a altura disponível com texto ampliado.

A apresentação usa o cabeçalho Portal da regulação/Conta, a imagem existente de 41.944 bytes, ação “Escrever ao Conselho”, abas “Meus envios” e “Avisos” e explicação de conta recolhível depois da lista. O formulário conserva campos, validações, consentimento, anexos, avisos de identificação e limites do canal; o título rola com os campos, e as ajudas se reorganizam conforme o espaço. Textos e posição nativa da explicação são restaurados em desktop/impressão. Cores e temas existentes permanecem, com rótulos e seleção explícita.

Depois da autorização nativa, segurança e listas são lidas em paralelo no celular. O apresentador de nível coalesce leituras simultâneas e remove dois timers iniciais redundantes. Retornos reais à área e pageshow continuam pedindo dados novos. Não amplia cache nem substitui validação de sessão. A imagem nativa de desktop é carregada quando esse cabeçalho passa a ser usado, preservando desktop/impressão sem custo antecipado no celular.

Validação funcional sintética: 12 cenários (320/360/390 px, claro/escuro, tamanho normal e texto a 200%), sem overflow horizontal; alvos de toque, rádio nativo, avisos essenciais, leitura de notificações uma vez, detalhe e preservação de formulário/privacidade/documento/controladores entre Perfil e Cidadão. Nenhuma manifestação enviada. Cabeçalho adicional: 48 cenários/288 estados; comparações de desktop e impressão mantêm limites de pixels e contratos nativos. CI completo e deploy do SHA integrado são requisitos de publicação.

## Medição comparável

Cinco pares alternados de entrada fria, Chromium local, largura 390 px, sessão cidadã sintética em cache e latência fixa de API de 180 ms. Observação até 1,5 s depois da primeira lista útil. Valores não representam rede móvel real, CDN ou experiência em aparelho. O tamanho contabiliza bytes de arquivos-fonte solicitados, incluindo repetições; não é transferência comprimida.

| Medida sintética | Antes | Depois |
|---|---:|---:|
| Mediana até lista útil | 604.4 ms | 475.5 ms |
| Mediana até ação autorizada | 212.4 ms | 214.3 ms |
| Bytes-fonte dos assets solicitados | 7,493,249 | 3,296,867 |
| GET segurança | 6 | 3 |
| GET conta atual | 5 | 2 |

A lista útil chegou 21.3% antes; a soma de bytes-fonte solicitados caiu 56.0%. Todas as dez amostras tiveram zero erros e zero APIs sem fixture.

## Referências visuais

As duas imagens solicitadas pela Biblioteca não foram vistas. `prepare_materialize` e o helper suportado foram executados para ambas; uma nova preparação e repetição autorizada também falharam com `library file transfer failed: download failed`. Não houve transferência alternativa. A revisão visual usa capturas de fixtures locais, sem dados reais de usuários/pacientes. Texto sintético a 200% não emula todos os modos de zoom de Android; falta aceitação em aparelho real.
