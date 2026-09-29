# MISSÃO BANCÁRIA — AVALIAÇÃO INDEPENDENTE — INTERFACE V1

Data: 29/09/2026.  
Fase ativa: Fase 1.  
Branch: `feat/missao-bancaria-avaliacao-independente-ui`.  
Dependência: backend do documento 47.

## Objetivo

Permitir que a avaliação independente seja executada de ponta a ponta sem reutilizar a interface de treino e sem revelar correção antes do fechamento.

## Dashboard

Novo painel **Avaliação independente — evidência de aplicação**.

Estados:
- bloqueada enquanto pré-requisitos não estiverem completos;
- Forma A disponível;
- Forma A em andamento;
- aguardando intervalo da Forma B;
- Forma B disponível;
- formas concluídas nesta versão.

O painel também mostra o histórico resumido das formas concluídas com score e data.

## Modo de avaliação

Ao iniciar ou retomar uma forma:
- o dashboard fica oculto;
- o modo de aula permanece oculto;
- não existe botão para consultar o material durante a rodada;
- os 16 itens aparecem em uma interface própria;
- cada resposta é registrada individualmente;
- a interface confirma apenas que a resposta foi salva;
- nenhum feedback de certo/errado aparece antes do fechamento.

Uma forma parcialmente respondida pode ser abandonada e retomada depois pela mesma rodada ativa.

## Correção

O botão **Encerrar e corrigir** só é habilitado quando os 16 itens estiverem registrados.

Após o fechamento:
- score bruto;
- quantidade correta;
- diagnóstico por competência/aula;
- indicação de aulas a revisar;
- correção item a item;
- explicação pós-rodada.

A tela explicita que o resultado é evidência de aplicação, não aprovação, domínio total ou prontidão de prova.

## Segurança de interface

Os itens são renderizados com criação de nós DOM e `textContent`, não por interpolação de HTML do servidor.

Durante a rodada:
- o retorno do endpoint individual não é usado para mostrar correção;
- respostas retomadas ficam bloqueadas para evitar reenvio acidental;
- o painel de aula não é exibido.

## Navegador sintético

A suíte Chromium passa a cobrir:
1. Forma A disponível no painel;
2. abertura da avaliação sem exibir a aula;
3. 16 itens presentes;
4. resposta individual com mensagem neutra;
5. saída e retomada da mesma forma;
6. questão já registrada continua bloqueada após retomada;
7. botão de fechamento só habilita após 16 respostas;
8. correção/explicação só aparece depois do fechamento;
9. histórico do painel é atualizado.

## Isolamento durante forma ativa

A interface não pode virar uma rota indireta de consulta enquanto uma forma independente está em andamento.

Por isso:
- o estado da avaliação é carregado antes de liberar a grade de missões;
- quando existe Forma A/B ativa, todos os cartões de aula/revisão ficam indisponíveis para abertura;
- o botão principal do dashboard passa a priorizar **Retomar avaliação: Forma X**;
- `openMission` possui um segundo gate no cliente antes de renderizar o texto da aula;
- o backend continua sendo a autoridade final e também recusa sessão comum enquanto a avaliação estiver ativa;
- se o endpoint de estado da avaliação não puder ser confirmado, a grade fica temporariamente bloqueada em vez de liberar a leitura por suposição.

Isso evita tanto a janela em que o usuário poderia sair da forma, abrir uma aula para consultar o conteúdo e voltar à mesma avaliação sem encerrá-la quanto um fail-open durante falha de rede do endpoint de avaliação.

## Preservação

A UI não:
- concede XP;
- altera cobertura;
- calcula prontidão;
- envia gabarito antes do fechamento;
- publica banco não iniciado;
- mistura dados institucionais.

## Limites

- a Forma B continua condicionada ao intervalo real de sete dias;
- revisão factual/editorial dos 32 itens continua obrigatória;
- a interface permanece em branch draft até backend/dependências e CI completos;
- homologação humana da Fase 1 continua pendente.
