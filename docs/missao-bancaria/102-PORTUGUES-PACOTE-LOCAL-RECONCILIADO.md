# Português — pacote local reconciliado para draft

04/10/2026. Salvamento remoto autorizado: **[#602 draft](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/pull/602)**, pacote 4bea4009 confirmado remoto. Sem transição, merge remoto, ativação ou deploy. Preservadas as branches publicadas e o checkout original de autoria.

## Árvores e escopo

- Main confirmada via conector GitHub: **6c4fcd86198103ad6e1e8adc07901219c7957c92**, objeto já disponível localmente. Git HTTPS do runtime não conseguiu fazer fetch; não houve alteração de acesso/credencial. Confirmação pelo conector evitou tratar uma ref antiga como atual.
- Base isolada preparation/missao-portugues-base-main, commit **7dcb2b2558e9bfce10154b3e20ce6deb4c1e157f**: main + dependência IS #600 **709901d7cca28684e7b2b5cac9292e3c667dfb31** (inclui DP #572) + contratos existentes #598 **2e6005177d04844322a2f1760291e8ec06e60f15**. Todos os ancestrais preservados por merges locais; contratos copiados sem alteração semântica, não integrados na main/remoto.
- Pacote preparation/missao-portugues-draft-local, árvore testada **56862b18a72384dd18361e75f9677ded650a438a**, incorpora autoria original **f3d884bb760e252ca067a1de0bdb3cde47294d06** com todo seu histórico. Somente conflitos mecânicos de checkpoint/documentos e adições de listas no catálogo/validador/configuração; nenhum conflito de autorização, persistência ou comportamento funcional. Documentos IS 88–90 mantiveram versões remotas mais atuais de #600. Conteúdo/gabaritos/IDs/recuperações e quatro artefatos Português idênticos aos da autoria validada.
- Quatro **lotes introdutórios**, em três blocos curriculares: LP 5 unidades/44 questões, PT 6/52, OA 6/52, OL 5/44: **22 unidades/192 questões/768 justificativas**. OA/OL compartilham portuguese.spelling; não são dois blocos completos. Acertar itens/revisões não mede prontidão global ou retenção. Hífen e demais recortes permanecem pendentes.

Todos parâmetros/desbloqueios apenas propostos, publication.status:draft e parametersApproved:false. OL ligado por filtro de publicação no manifesto/mapa, sem mudança da UI ou do roteador real. Nenhum novo usuário autorizado. O diff sobre a base separada era 80 arquivos de Português/checkpoint antes desta atualização documental; não contém workflow, fixture global, IA clínica ou código da Central. Contratos #598 e dependências DP/IS ficam na base, não no diff Português. Não renomeados Worker/bindings nem reaberto preview.

## Verificações executadas na árvore reconciliada

- **Nove testes direcionados**: exclusão draft e preservação de artefato em LP/PT/OA/OL, mais seis cenários de roteador OL encapsulados em um teste. Comando: node --test --test-name-pattern="draft|artefato preserva|OL: seis cenários" worker/tests/studies-{lp,pt,oa,ol}-candidate.test.mjs, passando os quatro caminhos explicitamente.
- **Seis Chromium OL, 6/6 em 9,7 s**, somente studies-ol.spec.mjs com studies-reader.config.mjs; API totalmente interceptada. Consulta ampliada em 320/390 px, claro/escuro; falha/repetição/interrupção/retomada e exclusividade wellyton. Uma passagem na base de autoria e outra na árvore reconciliada, justificada pela mudança de base.
- Serialização de missões, fontes, planejamento e mapa ativos idêntica à base anterior: **50 missões/374 questões/quatro blocos publicados**, prontidão não medida. Controle de fontes/missões anterior ao preparo OA também idêntico. Progresso real não acessado.
- Quatro --check-generated, ancestralidade de main/#600/#598/autoria e escopo de diff conferidos. Cinco arquivos de contratos #598 têm os mesmos blobs do commit original; os corpos editoriais e artefatos Português eram os mesmos da autoria na árvore reconciliada. Sintaxe/diff/referências pertinentes conferidos após documentos.

Reutilizados pareceres pedagógicos e demais testes LP/PT/OA/DP/IS inalterados; não executada suíte geral nem novo diagnóstico de gates. Fixtures não substituem CI obrigatória futura, homologação autenticada ou aceite humano fase 2.

## Correção dirigida da CI

A CI de 4bea4009 passou 776/777 testes Worker; o único erro foi o detector rejeitar “diagnóstico de prontidão” no resumo de recuperação PT-Chefe. Substituído por “avaliação de prontidão” no Markdown, fonte estruturada e artefato gerado, mantendo significado, IDs, gabaritos, progresso e política de prontidão. Nenhuma alteração no detector, workflow ou permissões. Validação afetada: sincronia editorial/geração PT, um teste de preservação PT e os 13 testes de isolamento aprovados; diff sem erros. CI obrigatória será acompanhada no head atualizado.

## Bloqueios e próxima ação

Envio dos quatro lotes e abertura de draft PR **explicitamente autorizados e executados** em #602. A base composta é local: #572/#600/#598 não estão integrados na main. Não foi criada base remota adicional. O draft tem base main e declara explicitamente a inclusão das dependências/contratos existentes em PRs separados. Comparado diretamente à main, o pacote inclui essas dependências; não alegar diff apenas Português nessa comparação. A base separada torna esse limite explícito.

Ativação/publicação não autorizadas; dependência CAIXA IS→Português comum BB/CAIXA requer decisão antes de liberar acesso. Aceite humano pedagógico fase 2 não observado. Próxima ação: acompanhar CI do draft no head final, corrigindo apenas falhas pertinentes; autoria de hífen já prevista segue localmente em branch separada, sem integrar esse conteúdo ao PR.
