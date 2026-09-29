# MISSÃO BANCÁRIA — ROTEIRO DE HOMOLOGAÇÃO HUMANA DA FASE 1

Data: 29/09/2026.  
Estado: roteiro de aceite; não altera produto, progresso ou dados.  
Aplicar somente depois de as entregas técnicas da Fase 1 estarem integradas e publicadas.

## 1. Objetivo

Fechar a diferença entre **testes técnicos aprovados** e **experiência realmente utilizável**.

A Fase 1 não deve ser declarada concluída apenas porque CI, Worker e navegador sintético passaram. O aceite humano precisa confirmar que a experiência está clara, preserva progresso e ensina antes de cobrar.

## 2. Regras da homologação

- Não criar dados fictícios na conta real.
- Não alterar datas de revisão ou sequência no banco produtivo apenas para acelerar o teste.
- Não usar dados de pacientes, documentos, CORE ou outros módulos institucionais.
- Não apagar progresso existente para repetir cenário.
- Quando um cenário depender de tempo real (revisão/seqüência), ele pode ficar pendente até ocorrer naturalmente.
- Uma falha relevante reabre a Fase 1; não deve ser escondida por ajuste de percentual ou XP.

## 3. Acesso e isolamento

### H1 — conta autorizada

Confirmar:
- entrada da Missão Bancária aparece para a conta autorizada;
- `/estudos/` abre sem erro;
- dashboard carrega progresso.

Resultado: ☐ aprovado ☐ pendente ☐ reprovado

### H2 — conta não autorizada

Em conta sem autorização:
- entrada da ferramenta não deve aparecer;
- acesso direto à rota/API não deve liberar dados de estudo.

Resultado: ☐ aprovado ☐ pendente ☐ reprovado

## 4. Clareza do dashboard

### H3 — bloco não parece curso completo

Confirmar visualmente:
- “Bloco atual publicado” é distinguível de “Cobertura curricular”;
- 9/9, quando ocorrer, não é apresentado como curso completo;
- mapa-base mostra áreas/blocos planejados;
- “Prontidão de prova” permanece “Ainda não medida” enquanto os critérios não existirem.

Resultado: ☐ aprovado ☐ pendente ☐ reprovado

### H4 — métricas compreensíveis

Confirmar:
- XP e nível parecem progressão do jogo, não previsão de aprovação;
- acerto nas tentativas aparece separado de retenção;
- tempo é apresentado como “Tempo registrado”, sem prometer atenção contínua;
- sequência e revisões pendentes são compreensíveis.

Resultado: ☐ aprovado ☐ pendente ☐ reprovado

## 5. Ensino antes da prática

### H5 — aula utilizável por iniciante

Escolher uma missão ainda útil para revisão e confirmar:
- nomes/siglas são explicados antes da cobrança;
- há explicação suficiente dentro do portal;
- exemplos ajudam a entender, em vez de apenas repetir definições;
- questão não depende de conceito que aparece pela primeira vez no gabarito.

Resultado: ☐ aprovado ☐ pendente ☐ reprovado

### H6 — leitor e prática

Confirmar:
- navegação entre partes da aula é clara;
- “Testar minha compreensão” leva à prática;
- é possível voltar à aula;
- feedback das questões indica por que a alternativa está correta/incorreta.

Resultado: ☐ aprovado ☐ pendente ☐ reprovado

## 6. Persistência e retomada

### H7 — recarregar durante uma rodada

Durante uma sessão ativa:
1. responder pelo menos uma questão;
2. aguardar um checkpoint de tempo confirmado, quando possível;
3. recarregar a página;
4. voltar ao dashboard.

Confirmar:
- botão principal oferece **Retomar**;
- a mesma missão volta;
- respostas já registradas não precisam ser reenviadas;
- os demais cartões não permitem abrir nova rodada paralela;
- tempo já confirmado não volta a zero.

Resultado: ☐ aprovado ☐ pendente ☐ reprovado

### H8 — sair normalmente

Ao usar “Sair da aula”:
- sessão deve encerrar;
- dashboard deve reaparecer;
- ao recarregar, a sessão encerrada não deve ser oferecida para retomada;
- respostas/progresso já registrados permanecem.

Resultado: ☐ aprovado ☐ pendente ☐ reprovado

## 7. Conclusão, progresso e conquista

### H9 — concluir missão

Quando houver missão elegível:
- responder todas as questões;
- concluir;
- confirmar atualização do progresso;
- confirmar XP somente uma vez.

Resultado: ☐ aprovado ☐ pendente ☐ reprovado

### H10 — primeira conquista

Se a conquista já foi obtida, apenas confirmar que permanece em `/conquistas/`.

Se ainda não foi obtida, ao concluir a primeira missão:
- “Primeira missão” deve aparecer;
- repetir/reabrir a missão não deve conceder a mesma conquista novamente;
- Bronze/Prata/Ouro da segurança permanecem separados.

Resultado: ☐ aprovado ☐ pendente ☐ reprovado

## 8. Revisão e retenção

### H11 — revisão naturalmente disponível

Quando uma revisão vencer:
- painel deve mostrar a revisão;
- a rodada deve exigir nova tentativa;
- conclusão deve atualizar a evidência de retenção;
- retenção não deve ser apresentada como “domínio” ou “prontidão”.

Não alterar a data produtiva para forçar o cenário.

Resultado: ☐ aprovado ☐ pendente ☐ reprovado

## 9. Sequência histórica

### H12 — sequência por dia

Ao estudar em dias diferentes:
- múltiplas atividades no mesmo dia contam como um dia;
- sequência atual deve refletir dias consecutivos;
- melhor sequência não deve diminuir por aumento do número de questões.

A parte histórica acima de 500 eventos é coberta por teste automatizado; a homologação humana não precisa gerar centenas de eventos.

Resultado: ☐ aprovado ☐ pendente ☐ reprovado

## 10. Desktop e celular

### H13 — desktop

Confirmar leitura, botões, mapa curricular, missão e modo foco sem sobreposição crítica.

Resultado: ☐ aprovado ☐ pendente ☐ reprovado

### H14 — celular

Confirmar:
- texto legível;
- navegação por partes;
- prática utilizável;
- botões de sair/pausar/retomar acessíveis;
- cards e progresso não ultrapassam a tela.

Resultado: ☐ aprovado ☐ pendente ☐ reprovado

## 11. Critério de aceite da Fase 1

A Fase 1 pode receber aceite humano quando:
- H1–H10 e H13–H14 estiverem aprovados;
- H11/H12 estiverem aprovados ou explicitamente pendentes apenas por dependência temporal natural, com nenhuma evidência de falha;
- nenhum problema impedir estudar uma missão real ponta a ponta;
- as pendências restantes pertencerem claramente a fases futuras, não a falhas do MVP.

O aceite deve ser registrado no STATUS com data e observações.

## 12. Registro

Data da homologação: ____________________

Dispositivo/navegador principal: ____________________

Resultado geral:
- ☐ APROVADA
- ☐ APROVADA COM PENDÊNCIA TEMPORAL DOCUMENTADA
- ☐ REPROVADA / NECESSITA CORREÇÃO

Observações:

____________________________________________________________________

____________________________________________________________________
