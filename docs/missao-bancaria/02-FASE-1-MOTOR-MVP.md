# MISSÃO BANCÁRIA — FASE 1
## Motor MVP e primeira experiência jogável

### Objetivo
Entregar a primeira versão realmente utilizável da Missão Bancária, com **conteúdo real de estudo desde o primeiro release jogável**.

A Fase 1 não precisa entregar o curso inteiro. Ela precisa entregar um ciclo pequeno, completo e confiável que Wellyton já possa usar para estudar.

### Entregas
- entrada exclusiva para Wellyton;
- rota `/estudos/`;
- dashboard básico;
- persistência de progresso;
- XP e nível;
- cronômetro de sessão;
- mapa de campanha;
- próximo passo recomendado;
- modo foco;
- API protegida;
- tratamento de carregamento, vazio, erro e acesso negado.

### Dashboard mínimo
- progresso geral;
- XP/nível;
- horas líquidas;
- questões;
- acertos;
- sequência;
- próxima missão;
- percentual do conteúdo planejado já disponível;
- progresso de Wellyton dentro do conteúdo disponível.

### Conteúdo nesta fase

A experiência real deve estrear com um recorte pequeno de **Conhecimentos Bancários**, preferencialmente o início de Sistema Financeiro Nacional.

Exemplo de primeiro recorte:
- Introdução ao SFN;
- CMN;
- Banco Central;
- COPOM;
- primeira minibatalha;
- primeiro bloco de questões;
- primeira revisão.

Esse conteúdo deve ser:
- baseado em fonte oficial adequada;
- escrito pedagogicamente para leitura;
- revisado;
- acompanhado de questões e explicações;
- persistente;
- tratado como parte definitiva da campanha.

Conteúdo fictício fica restrito a testes técnicos.

### Continuidade do estudo

Ao publicar novas missões:
- o progresso antigo permanece;
- XP permanece;
- domínio permanece;
- revisões anteriores permanecem;
- apenas novos conteúdos aparecem como disponíveis.

A Fase 1 já deve provar esse comportamento com pelo menos uma expansão de conteúdo em ambiente de teste/homologação.

### Critério de aceite
Wellyton consegue:
1. entrar;
2. iniciar uma missão;
3. concluir etapas;
4. sair;
5. voltar;
6. ver o progresso preservado;
7. confirmar que outra conta não acessa o módulo;
8. estudar pelo menos uma missão real ponta a ponta;
9. receber uma nova missão publicada sem perder o progresso anterior;
10. enxergar separadamente "campanha disponível" e "meu progresso".
