# MISSÃO BANCÁRIA — STATUS

Atualizado em 26/09/2026 — leitura no celular e transição à prática.

## Estado e autorização

**Fase ativa: Fase 1. Ensino por leitura antes das questões.**

Wellyton autorizou continuar desenvolvimento, revisões, testes e integrações sem acessar imediatamente nem reconfirmar cada etapa. Sua compreensão e homologação prática continuam pendentes; não alegar que ocorreram. Preservar `24-CONTRATO-PEDAGOGICO-GLOBAL.md` e `26-PRODUCAO-PEDAGOGICA-EM-ETAPAS.md`: se o recorte crescer, dividir o trabalho sem reduzir o ensino.

## Fonte e decisões preservadas

Repositório oficial: `regulacaoeldoradoms-cpu/guia-regulacao-eldorado`.

`/estudos/` e `/api/studies/*`, acesso exclusivo de `wellyton` no backend, nenhum cargo novo. Conteúdo no GitHub; dados em `study_*` no D1 `AUTH_DB`. IDs e histórico estáveis, sem zerar XP/conquistas. Bronze/Prata/Ouro permanecem segurança da conta, separados do estudo. Sem telemetria pedagógica externa; rollback não apaga dados.

## Entregas já incorporadas antes desta rodada

- #488: documentação; Fase 0 aprovada em 25/09/2026, plano `15-FASE-0-PLANO-TECNICO.md`.
- #490: motor inicial, `22257bca768cfc440578e0b8e11da62f15abc08f`.
- #495: expansão/revisões, `97cc6ab382d624841da46d6d9a9ff7f26a1a18ca`.
- #498: primeiro bloco/Chefe, `20487883c948dffbeb4b6849baa3c39e9c577d9f`.
- #499: retomada/Conquistas, `c5ebf3a0bb93bf303851835446ec32ff5decb0cd`.
- #500: sequência, `ac9128c7e807be8eff0ee5bc1579f792aa249a3d`.
- #501: ensino desenvolvido para oito aulas e preparação do Chefe, `f6ae4c598156656e2c630372d6e2122259ffb1c2`.

**9/9 e 38 questões referem-se somente ao primeiro bloco de SFN, não a curso ou edital completo.** A PR #501 contém conceitos, exemplos resolvidos, vocabulário e referências das questões ao ensino. Documentos 23–29 preservam a revisão e suas limitações de fontes. Acerto em questões iniciais não é comprovação de domínio duradouro.

## Publicação histórica da PR #501

Integração confirmada na main. O comentário final da PR registra sucesso dos checks do merge: Workers Builds `108435911331` (versão informada `edbfb205-76f6-4417-bae9-8afb4e3b7161`), Cloudflare Pages `108435851677` e GitHub Pages `108435880048`. São registros do merge anterior, não certificação de 100% do tráfego produtivo nem evidência desta nova entrega. Não foi realizado acesso autenticado real por Wellyton nesta sessão.

## Rodada atual — leitor e prática

Documento: `30-LEITURA-MOBILE-E-PRATICA.md`.
Base observada: `a2ed4e74695001cfcd87ec166eb6b060dc57d060`.
Branch planejada: `feat/missao-bancaria-leitura-mobile`.

Implementado:
- aula primeiro, por partes, com navegação anterior/próxima, índice e modo de texto inteiro;
- ajuste do tamanho da letra sem cortar o material;
- transição explícita para prática e consulta de volta à aula sem recriar questões ou sessão;
- painel rolável adaptável ao celular, sem offsets fixos do cabeçalho;
- barra das questões parte de zero, baseada em respostas, sem 35% fictícios por abrir a missão;
- legenda **Acerto nas tentativas**, sem recalcular a métrica do backend;
- fallback linear se o controlador novo não carregar;
- nenhum conteúdo didático, questão, gabarito, D1 ou regra de acesso modificado.

Validações locais: 5 testes Node e 12 cenários Chromium sintéticos aprovados; capturas inspecionadas. Limites do ambiente offline e do estilo global simplificado estão no documento 30. CI adiciona 14 cenários com HTML/CSS reais do repositório e autenticação simulada. **Aguardar e registrar resultados do novo head; não presumir CI, merge ou deploy no momento deste registro.**

## Continuidade autorizada

Concluir CI do leitor, corrigir regressões caso existam, integrar e registrar a publicação realmente verificada. Depois preparar, em recortes menores, a avaliação de compreensão e aplicação após o ensino, preservando perguntas existentes e o histórico. Não abrir novos mundos para compensar aula insuficiente e não impor teste imediato ao usuário.

## Pendências anteriores mantidas

- Melhor sequência limitada aos 500 eventos recentes, ainda não recorde histórico irrestrito.
- Cronômetro, interrupções e recuperação no celular.
- Isolamento/retomada de rodadas e comprovação real de persistência.
- Avaliação de retenção e aplicação em situações novas; nenhuma questão nova é criada nesta rodada.

A nova navegação mantém a posição durante a alternância aula/prática; não implementa marcador sincronizado de leitura após fechar a página.

Histórico técnico: erro inicial “Rota não encontrada”, correções #492/#494 no commit `90cc6d8e16039bb7ed1482bec3f75feadb860816`; #493 fechada sem merge e #491/#496/#497 substituídas. Não reintroduzir versões abandonadas nem relaxar gates.

Avaliação humana posterior: clareza do ensino, explicação com palavras próprias, aplicação, retorno com progresso/XP salvo, conquistas sem duplicação, revisão e Chefe. Não encerrar formalmente a Fase 1 nem declarar aprendizado comprovado só porque a interface passou nos testes.
