# Telemedicina Mobile V7

## Decisão permanente

No mobile, a Telemedicina oferece duas visualizações para os acompanhamentos:

- **Lista** — padrão de leitura confortável, com um card por linha, tipografia maior e todas as informações operacionais visíveis.
- **Grade 2×2** — modo alternativo com dois cards por linha e formato mais quadrado, destinado a quem prefere maior densidade visual.

A preferência mobile é local ao navegador e restaurada nas visitas seguintes. O mesmo seletor responsivo também atende o desktop V16, porém com armazenamento separado e o rótulo **Grade 3×3**.

## Regras visuais

- As folhas de estilo desta V7 continuam restritas ao mobile; a camada desktop fica em `telemedicina-desktop-v16.css`.
- Os quatro cards de resumo permanecem em grade 2×2 no celular e usam proporção equilibrada, com números e rótulos maiores.
- O modo Grade não substitui nem remove o modo Lista; é uma opção consciente do usuário.
- No modo Grade, permanecem visíveis: paciente, conduta resumida, especialidade, situação, data de retorno, avisos e ações disponíveis.
- Nenhum dado relevante é removido apenas para o card caber; quando necessário, usa-se quebra de linha e organização vertical das ações.
- O desktop usa três cartões por linha, enquanto o celular permanece com dois cartões por linha.
- A visualização não altera regras de negócio, estados, lembretes, permissões ou dados armazenados.

## Privacidade e escopo

Esta é uma alteração exclusivamente de interface. Nenhum dado de paciente deve ser incluído em arquivos versionados, logs de teste ou documentação.
