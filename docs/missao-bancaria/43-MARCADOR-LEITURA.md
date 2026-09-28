# MISSÃO BANCÁRIA — MARCADOR DE LEITURA DA SESSÃO

Data: 28/09/2026.  
Fase ativa: Fase 1.  
Branch: `feat/missao-bancaria-marcador-leitura`, empilhada sobre a recuperação controlada da sessão.

## Problema

A recuperação da rodada preserva o mesmo `sessionId`, respostas e tempo confirmado, mas ainda reabria a leitura na primeira parte da aula. Em aulas longas isso obriga o estudante a procurar manualmente onde estava.

O marcador desta entrega resolve apenas **continuidade de navegação**. Ele não representa conclusão, domínio, leitura comprovada ou tempo estudado.

## O que é persistido

Nova tabela aditiva: `study_session_markers`.

Para cada sessão:
- `session_id`;
- usuário;
- missão;
- versão do conteúdo;
- visão atual: `lesson` ou `practice`;
- `section_id` da parte de leitura;
- se a opção “aula inteira” estava ativa;
- timestamp da última atualização.

Há no máximo um marcador por sessão.

## Protocolo

O bootstrap e a criação de sessão anunciam `markerProtocol: 1`.

Endpoint:
`POST /api/studies/sessions/:sessionId/marker`

Payload:
- `view`: `lesson` ou `practice`;
- `sectionId`: ID estável da parte da aula;
- `allSections`: booleano.

O servidor aceita atualização somente se:
1. a sessão pertence ao usuário autenticado;
2. sessão e rodada continuam ativas;
3. a missão ainda existe;
4. a versão da rodada coincide com a versão atual;
5. a seção pertence à missão atual.

## Comportamento da interface

O leitor emite o marcador quando o estudante:
- troca entre leitura e prática;
- avança ou volta uma parte;
- escolhe uma parte no seletor;
- abre/fecha “aula inteira”;
- usa um atalho de releitura vindo de atividade formativa.

As mudanças são agrupadas por um pequeno debounce para evitar gravações redundantes.

Ao abrir uma sessão nova, assim que o servidor confirma o `sessionId`, a posição corrente é registrada. Isso cobre o caso em que o estudante navega pela leitura enquanto a abertura da rodada ainda está sendo confirmada.

Antes de sair do modo foco, o último marcador pendente é enviado antes do fechamento da sessão.

## Retomada

Quando a sessão ativa é recuperada, o bootstrap inclui o marcador válido.

O leitor então restaura:
- a parte correspondente por `sectionId`;
- leitura ou prática;
- estado de “aula inteira”.

Se a seção deixou de existir ou a versão do conteúdo mudou, o marcador não é aplicado silenciosamente. A proteção de versão da recuperação continua prevalecendo.

## Neutralidade pedagógica

Salvar ou restaurar o marcador:
- não cria tentativa;
- não aumenta `coverage_state`;
- não altera `mastery_score`;
- não concede XP;
- não agenda revisão;
- não libera conquista;
- não é usado como prova de que o texto foi lido.

Ele responde somente: **“onde a interface estava?”**

## Testes

O roteador real + SQLite verifica:
- gravação e atualização idempotente de um único marcador;
- marcador reaparecendo no bootstrap da sessão ativa;
- ausência de XP/tentativas por salvar posição;
- seção inexistente recusada;
- sessão encerrada recusando novas atualizações.

O navegador sintético verifica:
- navegação de parte gerando marcador;
- troca para prática registrando a visão correta;
- nenhuma escrita de tentativa/conclusão por navegação;
- retomada restaurando a visão salva.

## Preservação

- acesso continua exclusivo a `wellyton`;
- tabela é aditiva;
- nenhum registro anterior é alterado;
- nenhuma regra de conteúdo, resposta, XP ou conquista é modificada;
- navegadores/servidores anteriores continuam funcionais porque o frontend só envia quando `markerProtocol === 1`.

## Continuidade

Com sessão, respostas, tempo e posição recuperáveis, o próximo débito técnico da Fase 1 é remover o limite de 500 eventos usado no cálculo da sequência histórica sem transformar a consulta em leitura ilimitada.

A Fase 1 continua aberta para validação humana e aceite formal.
