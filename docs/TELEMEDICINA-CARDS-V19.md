# Telemedicina Cards V19

## Decisão permanente

Em 05/09/2026, os cards de acompanhamento de pacientes receberam uma nova linguagem visual institucional compartilhada entre desktop e mobile. O objetivo é reforçar hierarquia, leitura operacional e reconhecimento dos estados sem transformar a tela em um dashboard genérico e sem alterar qualquer regra de negócio.

## Estrutura visual

Cada card permanece dividido em quatro zonas:

1. identificação do paciente e conduta;
2. especialidade, data da última consulta e selo de estado;
3. retorno e três avisos úteis;
4. ações disponíveis para aquele acompanhamento.

O nome do paciente é o primeiro nível de leitura. Conduta, especialidade e retorno usam superfícies internas discretas, sem branco puro dominante. Os avisos calculados aparecem como três chips numerados e continuam mostrando as datas completas.

## Estados

O estado define uma atmosfera sutil em todo o card, além do selo textual:

- `EM AGUARDO`: verde-azulado;
- `SOLICITAR`: âmbar;
- `ATRASADO`: vermelho-salmão;
- `SEM PROGRAMAÇÃO`: cinza-azulado;
- `SOLICITADO`: azul institucional;
- `CONCLUÍDO`: verde sóbrio para compatibilidade com registros encerrados.

Cor não é o único identificador. Cada selo preserva o texto do estado, possui contraste próprio e usa um ícone vetorial coerente: ampulheta, relógio, alerta, calendário sem programação ou confirmação em círculo.

## Ícones e interação

- `Programar` usa calendário com adição;
- `Solicitado` usa confirmação em círculo;
- `Histórico` usa relógio com retorno;
- edição usa lápis de traço;
- Lista e Grade usam vetores próprios, sem caracteres pictográficos ou emojis.

Cards e botões respondem a foco e passagem do ponteiro com borda, sombra e elevação discretas. O foco por teclado é explícito. Com `prefers-reduced-motion: reduce`, deslocamentos e transições são removidos, mantendo os demais sinais visuais.

## Responsividade preservada

- mobile: Lista ou Grade 2 × 2, tipografia V15, cabeçalho de uma linha e formulários sanfonados V9;
- desktop: Lista ou Grade 3 × 3, preferência independente e ações simétricas com 48 px de altura;
- nenhuma visualização limita a quantidade de pacientes.

## Implementação

- `css/telemedicina-cards-v19.css` é carregado depois das camadas V15 e V16 e contém apenas apresentação;
- `js/telemedicina.js` e `js/telemedicina-mobile-v9.js` produzem a mesma marcação visual para estado, zonas e chips de aviso;
- `js/telemedicina-mobile-v7.js` mantém os rótulos de Lista e Grade em texto e deixa os ícones para a camada vetorial;
- `js/telemedicina-edit.js` usa o lápis vetorial de traço;
- `data-followup-cards="v19"` identifica a versão ativa e permite isolar a cascata.

## Proteções contra regressão

A validação deve confirmar:

- presença dos cinco estados operacionais e de `prefers-reduced-motion` na camada V19;
- paridade de marcação entre o carregamento inicial e os cards recriados após salvamentos mobile;
- manutenção de `data-action="schedule"`, `data-action="requested"` e `data-action="patient"`;
- ausência de emojis e de símbolos tipográficos usados como ícones na interface;
- preservação dos seletores de edição, filtros, Lista/Grade e painéis inline;
- nenhuma alteração nos arquivos de backend, autorização ou regras de retorno para esta evolução visual.
