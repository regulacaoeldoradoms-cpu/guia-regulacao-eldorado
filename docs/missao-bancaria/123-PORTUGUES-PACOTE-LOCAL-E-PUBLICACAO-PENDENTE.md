# Português — pacote de revisão e publicação pendente

04/10/2026. Origem local4efb1b5b; envio autorizado na branch de revisão `preparation/missao-portugues-completo-draft`, draft contra main220f, sem ativação. Fecha o conjunto introdutório dos recortes já planejados, não o edital completo. [Mapa121](121-PORTUGUES-COBERTURA-INTRODUTORIA.md) mantém as lacunas explícitas. Inventário reproduzível offline: `node worker/scripts/studies-portuguese-package.mjs`.

| Bloco original | Lotes | Unidades | Questões | Justificativas | Ainda não enviados neste pacote |
| --- | --- | ---: | ---: | ---: | --- |
| portuguese.reading | LP | 5 | 44 | 176 | Nenhum; LP já no draft602 |
| portuguese.text | PT | 6 | 52 | 208 | Nenhum; PT já no draft602 |
| portuguese.spelling | OA/OL/HF | 16 | 140 | 560 | HF:5/44/176 |
| portuguese.syntax | CF/PU/CN/RG/CR | 25 | 220 | 880 | Todos:25/220/880 |
| portuguese.meaning-writing | SM/CP/RE | 15 | 132 | 528 | Todos:15/132/528 |
| Total Português | 13 lotes | 67 | 588 | 2352 | 45unidades/396questões/1584justificativas |

LP/PT/OA/OL:22unidades/192questões/768justificativas no [draft602](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/pull/602), headdbc272e983a4da0d75e60b564cd06d9280b14f4a,24/24Actions terminais anteriormente conferidas; não alterado. As45unidades adicionais entram no novo draft cumulativo, junto às22herdadas do#602; CI do novoSHA remoto deve concluir antes de integração. #602 permanece intacto, não somar suas22unidades novamente ao total67. HF/CF44bdbd26 separado permanece intacto, [108](108-HF-CF-PACOTE-RECONCILIADO.md). Totais não representam percentual de edital, produto ou domínio do aluno.

## Dependências e base

Motor linear existente: ativo1–50 → DP51–64 → LP65–69 → PT70–75 → OA76–81 → OL82–86 → HF87–91 → CF92–96 → PU97–101 → CN102–106 → RG107–111 → CR112–116 → SM117–121 → CP122–126 → RE127–131 → IS132–141. Cada lote começa após o Chefe anterior; sequência interna por conclusão anterior. ReleasesDP5,LP6 atéRE18,IS19. IDs/texto/XP dos anteriores preservados; IS recebeu somente ordem/pré-requisito/release.100XP/unidade,220XP/75%Chefe continuam propostas, com parametersApproved:false.

DP (14unidades/116questões/464justificativas) é dependência ainda draft, excluída dos totaisPortuguês. IS (10/84/336) é CAIXA histórico somente, vem depois, também fora dos totaisPortuguês. Cadeia simulada completa141unidades; isso não publica91drafts. Português comum mantém perfisBB2022/CAIXA2024 históricos/referenceOnly. Catálogo ativo permanece50missões/374questões/quatro de43blocos, prontidão não medida.

Base integrada conhecida220f30989ff6215dc539c1d51f72823bb90e7c77, ancestral confirmado desta branch. Não usar a ref localmain antigaff6ecbe como destino. O comando Git ls-remote falhou por helper remote-https indisponível; a leitura equivalente pelo conector GitHub confirmou main220f nesta etapa, sem novo avanço da base. A evidência do pai e dos pacotes102/108 foi reutilizada; não foi repetida auditoria Central. Antes de integração futura, conferir novamente apenas a ref necessária e reconciliar diferenças pertinentes caso haja avanço, preservando mudanças concorrentes.

## Gates restantes e próximo passo

Conteúdo possui pareceres independentes limitados registrados nos documentos102/103/105/109–122; último RE condicionado à precisão q12B já aplicada. Testes afetados e preservação em122; SM/CP119, CR116, RG115, PU/CN110/112 e pacote108 reutilizados nos escopos inalterados. Não declarar CI de novo SHA local, homologação real, aceite humano ou retenção. Detector/workflow/acesso/arquitetura não mudaram.

Autorizado especificamente o envio das45unidades e da nova ordem para revisão em draft; sem liberação no site. O draft cumulativo reutiliza#602 e incluiDP/IS desativados já herdados dele, sem alteraçõesCentral/contratos ou outros módulos. Pendente: confirmar envio ePR; reconfirmação da base antes de integração futura; CI requerida em SHA exato; decisão de ativação e integração dos PRs exatos, dependênciaDP incluída explicitamente, publicação deploy:safe e verificação protegida. Nenhuma ativação, transição para pronto, merge ou deploy autorizada nesta etapa. Aceite humano pedagógico da fase2 segue não observado e separado; fases3/4 não abertas. Sem produção/D1, gastos ou novos acessos.

Próxima ação de desenvolvimento proposta após encaminhar este pacote: ampliar `portuguese.syntax` com período composto introdutório (reconhecer duas orações e ligações de adição/oposição/causa em texto), lacuna já registrada em121/plano05 e pré-requisito para pontuação/relativas/reescrita complexa. Primeiro delimitar ensino/exemplo/prática/recuperação e fonte pontual; não iniciar automaticamente outro lote antes de fechar o encaminhamento deste.
