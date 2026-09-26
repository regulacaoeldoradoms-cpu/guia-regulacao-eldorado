# MISSÃO BANCÁRIA — REVISÃO DOS SEGMENTOS E AUTORIZAÇÃO DE CONTINUIDADE

Data: 26/09/2026. Fase 1 em desenvolvimento e revisão.
PR: #501 — `fix/missao-bancaria-ensino-do-zero`.

## Autorização humana mais recente

Wellyton informou: **“Pode dar avanço ao desenvolvimento, não vou acessar agora, autorizo o q tiver de autorizar”.**

Isso autoriza continuar as entregas planejadas, sua revisão, testes e integração/publicação quando tecnicamente elegíveis, sem exigir uma nova confirmação a cada rodada nem bloquear todo o desenvolvimento à espera de acesso imediato do usuário.

Não equivale a afirmar que ele já estudou, compreendeu ou homologou o conteúdo. Não autoriza ignorar falhas técnicas, ampliar permissões, apagar progresso ou misturar dados institucionais. A avaliação humana fica pendente para uso posterior; não criar automação nem prometer execução em segundo plano sem solicitação específica.

## Recorte implementado

Revisados **25 trechos** nas quatro aulas restantes e na preparação do Chefe, complementando os 13 trechos do lote A:

- **CVM:** participação societária versus dívida; recursos em emissão versus negociação de ações existentes; companhia aberta não é sinônimo de estatal; papéis de emissor, investidor, intermediário e supervisor.
- **Operadores:** sentido de depósito e carteira; duas condições simultâneas para banco múltiplo, com casos contrastantes; carteira de investimento não se confunde com crédito, financiamento e investimento; instituições supervisionadas não possuem todas a mesma natureza jurídica.
- **Seguros e previdência:** planos abertos podem ser coletivos; uma oferta ligada ao emprego, sozinha, não classifica o plano como fechado; produto, entidade e supervisor precisam ser identificados.
- **Pagamentos e consórcios:** separação entre aplicativo, prestador e serviço; Pix, infraestrutura de liquidação e caso ilustrativo; grupo, administradora, custos e supervisão sem prometer contemplação imediata.
- **Chefe:** revisão coerente com as aulas anteriores, sem matéria inédita e sem chamar a nota de uma rodada de domínio duradouro ou aprovação no concurso.

Nenhuma pergunta, alternativa, gabarito, pontuação ou condição de conquista foi alterada. Os 38 itens continuam sendo prática inicial; ainda não são uma avaliação abrangente de transferência e retenção.

## Fontes e alcance da conferência

Fontes primárias efetivamente abertas nesta rodada:

1. Lei nº 6.385/1976, arts. 2º, 4º e 8º — valores mobiliários e CVM: https://www.planalto.gov.br/ccivil_03/leis/l6385.htm
2. Lei nº 6.404/1976, art. 4º — companhia aberta/fechada: https://www.planalto.gov.br/ccivil_03/leis/l6404consol.htm
3. Lei Complementar nº 109/2001, especialmente arts. 26, 31 e 36 — planos abertos coletivos e entidades fechadas/abertas: https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp109.htm
4. Lei nº 12.865/2013, arts. 6º e 9º — arranjos e instituições de pagamento: https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2013/lei/l12865.htm
5. Lei nº 11.795/2008, arts. 2º, 5º a 7º — consórcios: https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2008/lei/l11795.htm
6. SUSEP institucional: https://www.gov.br/susep/pt-br/acesso-a-informacao/institucional/sobre-a-susep
7. PREVIC, acesso a planos fechados: https://www.gov.br/previc/pt-br/licenciamento-e-habilitacao/como-participar

### Pendência específica de bancos múltiplos — não ocultar

Foi possível ler a explicação oficial do Banco Central em:
https://www.bcb.gov.br/pre/composicao/bm.asp?frame=1

Ela apresenta a classificação de duas carteiras, incluindo comercial ou de investimento, e a relação da carteira comercial com depósitos à vista. Porém, é uma **página histórica que cita a Resolução nº 2.099/1994**, não o texto consolidado da Resolução CMN nº 5.060/2023.

O catálogo identifica essa fonte como histórica. A referência 5.060 existente permanece preservada, sem novo carimbo de conferência integral. A busca pelo texto primário consolidado da norma não foi resolvida nesta rodada. Índices do Diário Oficial, minutas/votos e páginas secundárias não foram tratados como equivalente de uma consolidação vigente.

A melhoria de explicação não remove essa pendência de precisão normativa. Antes de declarar todo o lote pronto para publicação definitiva, resolver a conferência do trecho normativo utilizado ou separar explicitamente o recorte que ainda depende dela. Autorização do usuário não substitui essa verificação.

### SPI

Foi recuperada a descrição oficial indexada do Banco Central para o SPI. A abertura da página atual depende de JavaScript. O exemplo foi delimitado a uma operação liquidada por essa infraestrutura, sem afirmar que todo Pix percorre obrigatoriamente o mesmo caminho. Não foi alegada leitura integral da regulamentação de todas as modalidades de participação.

## Implementação e testes

- Novo `sfn-segmentos-revisados.js`, aplicado pelo `manifest.js` após a revisão dos fundamentos.
- Todas as nove missões possuem material V2 e uma passagem editorial identificada. O campo de homologação permanece `human-review-pending`.
- Novo `studies-segments.test.mjs` verifica aplicação dos 25 trechos, fontes, referências de ensino, imutabilidade, preservação de perguntas/recompensas e cenários negativos de alvo ausente.
- Teste dos fundamentos atualizado apenas para reconhecer a passagem editorial dos segmentos; as verificações anteriores permanecem.
- Sem alterações em D1, login, regras de acesso, CSS, roteamento, telemetria ou segurança de deploy.

CI deve ser consultado no novo head depois do push. Este documento não presume resultado nem publicação.

## Continuidade

Não solicitar teste imediato ao usuário. Prosseguir com verificações editoriais/técnicas disponíveis e registrar o que impedir publicação com precisão. Material escrito, CI aprovado, merge, build e tráfego produtivo são estados distintos. A avaliação de clareza e aprendizagem fica para quando Wellyton acessar, sem transformar sua ausência atual em abandono da qualidade do ensino.
