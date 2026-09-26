# MISSÃO BANCÁRIA — STATUS

Atualizado em 26/09/2026 — continuidade do leitor e aplicação em CMN/Banco Central.

## Estado e autorização

**Fase ativa: Fase 1. Ensino por leitura antes da avaliação.**

Wellyton autorizou continuar desenvolvimento, testes e integrações sem acesso imediato nem novas confirmações por etapa. A autorização não comprova compreensão, retenção ou homologação humana. Seguir os documentos 24 e 26: subdividir o trabalho, nunca reduzir o ensino para caber na entrega.

Fonte oficial: `regulacaoeldoradoms-cpu/guia-regulacao-eldorado`.

## Regras preservadas

`/estudos/`, `/api/studies/*`, conta `wellyton` autorizada no backend. Conteúdo no GitHub e dados em `study_*` no D1 `AUTH_DB`. Nenhum novo cargo, dado assistencial, segredo ou telemetria pedagógica externa. IDs, questões, gabaritos, XP e conquistas preservados; Bronze/Prata/Ouro continuam segurança da conta. Rollback não apaga dados.

## Já incorporado

- #488: documentação; Fase 0 aprovada em 25/09/2026, plano `15-FASE-0-PLANO-TECNICO.md`.
- #490: motor inicial, `22257bca768cfc440578e0b8e11da62f15abc08f`.
- #495: expansão/revisões, `97cc6ab382d624841da46d6d9a9ff7f26a1a18ca`.
- #498: primeiro bloco/Chefe, `20487883c948dffbeb4b6849baa3c39e9c577d9f`.
- #499: retomada/Conquistas, `c5ebf3a0bb93bf303851835446ec32ff5decb0cd`.
- #500: sequência, `ac9128c7e807be8eff0ee5bc1579f792aa249a3d`.
- #501: ensino desenvolvido, `f6ae4c598156656e2c630372d6e2122259ffb1c2`.
- **#502: leitor integrado nesta retomada, `517c42a7511c2c72d01c242690fd32257b237ec3`.**

Nove missões e 38 questões representam apenas o primeiro bloco de SFN, não o curso/edital inteiro. Oito aulas com explicações, vocabulário e exemplos; Chefe com preparação cumulativa. Os documentos 23–29 registram a revisão de ensino e limites das fontes.

## Leitor — PR #502

Documento 30. Head `1c902d5606429fc8700a349086b31df7aa84f6eb` incorporado sem mudanças após a validação. A auditoria geral repetida concluiu com sucesso: run `36254703571`, job `108447920775`. O CI específico e 14 cenários de navegador já tinham passado. Nenhum baseline, tolerância ou teste foi enfraquecido.

Leitura por partes/inteira, índice, tamanho da fonte, consulta sem perder respostas, barra de questões a partir de zero. Não altera conteúdo, gabaritos ou dados. O merge é confirmado; publicação e tráfego produtivo devem ser verificados separadamente.

## Aplicação introdutória — PR #503

Documento 31. Head observado `08f9b07f0e3cbc16a1eb40dc4c14195d73222f69`.

Três casos de explicação própria após a introdução, comentários reveláveis e links para reler. Rascunho opcional temporário, sem envio ou salvamento. Sem nota, XP ou alteração das 38 questões pontuadas.

Após o merge da #502, a #503 foi redirecionada à main. Na consulta anterior, 23 workflows estavam aprovados e a auditoria geral ainda executava. Conferir resultados finais antes de registrar integração. Os comentários finais de cada PR preservam os eventos posteriores a este registro.

## Rodada atual — aplicação em CMN e Banco Central

Documento: `32-APLICACAO-CMN-BANCO-CENTRAL.md`.
Branch: `feat/missao-bancaria-aplicacao-cmn-bcb`.
Base de conteúdo: head da #503 indicado acima.

Seis atividades adicionais, três em cada aula:
- CMN: diretriz geral versus contrato, participante versus presidente do colegiado, metas versus autonomia.
- Banco Central: nomes/funções, preço isolado versus estabilidade geral, competência delimitada versus exclusividade sobre tudo.

São atividades formativas apoiadas em ensino existente. O conteúdo anterior permanece integral; o suplemento utiliza o leitor já construído, sem novos componentes ou endpoints. Total nesta branch: nove atividades em três aulas e as mesmas 38 questões pontuadas. Nenhum novo mundo foi criado.

Fontes oficiais abertas nesta sessão: CMN no Ministério da Fazenda, LC 179 no Planalto e estrutura do SFN no Portal do Investidor. Não foram usados nomes de dirigentes ou taxas atuais.

**Local:** sete testes Node com fixtures passaram; não houve navegador local nesta rodada. **CI preparado:** validação do catálogo real e cinco novos cenários de navegador, mantendo os 22 anteriores (27 no total). Não presumir sucesso, merge ou publicação antes de observar os resultados.

## Próximas ações autorizadas

Concluir resultados da #503 e desta nova entrega; resolver conflitos reais se houver, sem refazer branches desnecessariamente; integrar versões elegíveis e registrar build/produção separadamente. Depois preparar aplicação para Copom e CVM, com pré-requisitos ensinados e critérios de autoavaliação. Não solicitar acesso imediato do usuário.

## Histórico de publicação e pendências mantidas

A PR #501 teve sucesso nos checks do merge: Worker `108435911331` (versão informada `edbfb205-76f6-4417-bae9-8afb4e3b7161`), Pages `108435851677` e `108435880048`. Não são evidência de publicação das entregas mais novas.

Falha histórica de preview do Worker nas branches: não foi ocultada nem tratada como sucesso. Verificar o resultado do build da main sem relaxar gates. Falha local de DNS ao acessar GitHub nesta rodada não demonstra indisponibilidade do portal.

Pendências anteriores: melhor sequência limitada aos 500 eventos; cronômetro/interrupções; isolamento/retomada de rodadas; persistência real; retenção pedagógica. Rascunhos de autoavaliação não são progresso salvo, conforme aviso na interface.

A Fase 1 continua sem homologação humana de aprendizagem. Não confundir autorização para prosseguir com um teste humano já realizado.
