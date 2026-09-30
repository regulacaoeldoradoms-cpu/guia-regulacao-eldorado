// Desafio editorial exposto, fora do catálogo. Sem IDs produtivos ou pontuação configurada.
import { SOURCES as S01 } from './mp-01-v1.mjs';
import { SOURCES as S02 } from './mp-02-v1.mjs';
import { SOURCES as S03 } from './mp-03-v1.mjs';
import { SOURCES as S04 } from './mp-04-v1.mjs';
import { SOURCES as S05 } from './mp-05-v1.mjs';
import { SOURCES as S06 } from './mp-06-v1.mjs';
import { SOURCES as S07 } from './mp-07-v1.mjs';
import { SOURCES as S08 } from './mp-08-v1.mjs';
import { SOURCES as S09 } from './mp-09-v1.mjs';
export const SOURCES = [...new Map([...S01, ...S02, ...S03, ...S04, ...S05, ...S06, ...S07, ...S08, ...S09].map(s => [s.id, s])).values()];
const section = (id, type, heading, body) => ({ id, type, heading, body, sourceIds: [] });
const origin = (unit, ...sections) => sections.map(sectionId => ({ unit, sectionId }));
const question = (number, groupId, prompt, options, answer, explanation, optionRationales, recoverySectionIds, originRefs, objectiveIds) => ({
  id: `mpchefe.q${String(number).padStart(2, '0')}`, topicId: 'draft.mpchefe', groupId,
  prompt, options, answer, explanation, optionRationales, recoverySectionIds, originRefs, objectiveIds
});
const sections = [
  section('preparacao', 'explanation', '1. Ensino e acesso antes do Chefe',
    'Este desafio depende de [MP-01](mp-01-v1.md), [MP-02](mp-02-v1.md), [MP-03](mp-03-v1.md), [MP-04](mp-04-v1.md), [MP-05](mp-05-v1.md), [MP-06](mp-06-v1.md), [MP-07](mp-07-v1.md), [MP-08](mp-08-v1.md) e [MP-09](mp-09-v1.md) ensinadas e acessíveis. A [MP-R](mp-r-v1.md) permite preparar a revisão antes da tentativa. Hoje todos esses materiais são rascunhos fora do aplicativo. Não use o Chefe para substituir as aulas nem para cobrar um conceito antes de ler a origem indicada.'),
  section('roteiro', 'explanation', '2. Um roteiro para os seis agrupamentos',
    'Nos itens 1–2, identifique participantes, obrigação e quem atua apenas distribuindo. Nos 3–4, separe recursos próprios, crédito, datas e poder de compra. Nos 5–6, distinga objetivo, decisão, observação e atribuição causal. Nos 7–8, siga as duas pontas e as condições de cada instrumento. Nos 9–10, diferencie emissão, resgate, negociação e preço. Nos 11–12, leia prazo, unidade e base de capitalização. Os cenários e valores a seguir foram criados para esta prática; não representam ofertas ou taxas atuais.'),
  section('exemplo-metodo', 'worked-example', '3. Exemplo resolvido de preparação: a ordem das perguntas',
    'Uma nota fictícia diz somente: “Uma instituição recebeu recursos ontem e fará um pagamento amanhã”. Passo 1: há duas datas, mas não sabemos se o pagamento é devolução desses mesmos recursos. Passo 2: faltam contraparte e obrigação, então não podemos concluir que houve compulsório, empréstimo ou compra de título. Passo 3: pedir esses dados é a conclusão adequada; o nome da instituição não completa o relato. O exemplo demonstra como evitar uma classificação inventada. Os itens do Chefe fornecem as hipóteses necessárias para uma resposta única.'),
  section('glossario', 'glossary', '4. Consulta antes de responder',
    'Credor/devedor: participantes de um direito e de uma obrigação de pagamento. Distribuidor: quem participa da colocação do título; distribuição, por si, não transfere para ele a obrigação da emissora. Estoque/fluxo: posição numa data e movimento num intervalo. Preço de negociação: quantia paga numa troca, distinta do pagamento contratual no vencimento. Fator de crescimento: 1 mais a taxa decimal do período. Ponto percentual: unidade de diferença entre taxas. Consulte as explicações completas nas aulas vinculadas, se algum termo ainda não estiver claro.'),
  section('recuperacao', 'summary', '5. Depois de um erro ou acerto com dúvida',
    'Tente justificar sua resposta antes de abrir o comentário. Depois, compare também os distratores. Ao errar, retome o trecho de origem, marque o dado confundido e refaça as contas ou setas. As doze questões são novas em relação aos enunciados das aulas, mas ficam expostas nesta prévia: não são itens reservados para avaliação independente. Acertar o Chefe, especialmente depois de consultar respostas, não comprova retenção, prontidão ou aprovação. Nenhuma regra de XP, revisão adaptativa ou liberação foi implantada por este rascunho.')
];
const questions = [
  question(1, 'G1',
    'Dois contratos fictícios e independentes: o banco Sol fornece 70 ao banco Lua; o banco Lua concede 14 de crédito à Oficina Norte. Quem deve pagar ao Sol no primeiro contrato e ao Lua no segundo, respectivamente?',
    ['Oficina Norte; banco Sol.', 'Banco Lua; banco Sol.', 'Banco Lua; Oficina Norte.', 'Oficina Norte; banco Lua.'], 2,
    'No primeiro contrato, Lua é tomador de Sol. No segundo, a oficina é tomadora de Lua. O caso não transfere a obrigação do banco para a oficina nem informa vinculação individual entre os dois financiamentos.',
    ['A oficina não é tomadora de Sol; Sol não recebeu crédito no segundo contrato.', 'Acerta o primeiro tomador, mas inverte o segundo contrato.', 'Identifica o devedor de cada relação sem misturar contratos.', 'Troca o tomador do primeiro e coloca o credor do segundo como seu próprio devedor.'],
    ['roteiro', 'glossario'], [...origin('mp08', 'interbancario', 'exemplo-varejo'), ...origin('mp01', 'credito')], ['O1']),
  question(2, 'G1',
    'A companhia fictícia Mirante emite títulos de dívida. A instituição Horizonte faz apenas a distribuição, sem assumir garantia ou obrigação adicional, e Talita compra um título. Quem é o devedor dos pagamentos previstos nesse título?',
    ['Mirante, conforme as condições do título.', 'Horizonte, somente porque o distribuiu.', 'Talita, somente porque o comprou.', 'Horizonte e Talita, em lugar da emissora.'], 0,
    'A emissora Mirante é a devedora no título. A atuação de Horizonte como distribuidora, por si, não a torna responsável pelo pagamento da dívida da emissora aos investidores; o caso exclui obrigação adicional.',
    ['Preserva a obrigação da emissora e as condições do instrumento.', 'Confunde distribuir o título com assumir o pagamento da dívida.', 'Talita adquire um direito pelo título; não assume a obrigação de sua emissora.', 'Transfere a dívida para participantes que não a assumiram no caso.'],
    ['roteiro', 'glossario'], origin('mp01', 'capitais', 'exemplo-capitais'), ['O1']),
  question(3, 'G2',
    'No modelo fictício de uma conta, há R$ 46 de saldo próprio disponível hoje, limite de crédito ainda não utilizado de R$ 34 e recebimento previsto de R$ 20 amanhã. Um pagamento hoje deve usar exclusivamente recursos próprios já disponíveis, sem tarifas, outras saídas, contratação de crédito ou novas entradas. Qual valor máximo atende a essa condição?',
    ['R$ 100, somando os três valores.', 'R$ 80, juntando saldo e limite.', 'R$ 66, antecipando o recebimento.', 'R$ 46, considerando apenas o saldo próprio de hoje.'], 3,
    'O limite é possibilidade de crédito, não saldo próprio; o recebimento de amanhã não está disponível hoje. Pelas hipóteses expressas, só os R$ 46 atendem simultaneamente à origem e à data requeridas.',
    ['Soma crédito não utilizado e entrada futura como se fossem recursos próprios atuais.', 'Inclui um limite que o enunciado não permite contratar.', 'Trata o recebimento futuro como dinheiro disponível no momento do pagamento.', 'Respeita tanto a origem própria quanto a disponibilidade atual.'],
    ['roteiro', 'recuperacao'], origin('mp02', 'instrumento', 'datas', 'limites'), ['O2']),
  question(4, 'G2',
    'Num único período fictício, uma quantia cresce 12% e a cesta de preços de referência encarece 8%. Sem custos, tributos, aportes ou retiradas, qual é o ganho real no modelo ensinado, arredondado a duas casas percentuais?',
    ['4,00%, usando a diferença como resultado exato.', '3,70%, calculando (1,12 / 1,08 − 1) × 100.', '12,00%, usando apenas o crescimento da quantia.', '−3,57%, calculando (1,08 / 1,12 − 1) × 100.'], 1,
    'O fator do dinheiro é dividido pelo fator dos preços: 1,12 / 1,08 − 1 = aproximadamente 0,037037. Em porcentagem, cerca de 3,70%. A subtração simples fornece aproximação, não a igualdade exata pedida.',
    ['Usa a aproximação de quatro pontos como se fosse a taxa real exata.', 'Compara os fatores na ordem e no período corretos, arredondando no final.', 'Ignora o encarecimento da cesta.', 'Inverte a razão entre o fator do dinheiro e o dos preços.'],
    ['roteiro', 'glossario'], origin('mp03', 'real', 'exemplo-real', 'limites'), ['O2']),
  question(5, 'G3',
    'Relatório fictício: (I) buscar estabilidade de preços; (II) o Copom altera a meta Selic; (III) calcula-se a taxa média efetivamente praticada nas compromissadas federais de um dia útil. Qual classificação mantém as três informações distintas?',
    ['I: objetivo; II: decisão de política; III: taxa apurada nas operações.', 'I: taxa apurada; II: objetivo; III: decisão do Copom.', 'I: objetivo; II: inflação já medida; III: preço fixado para todo empréstimo.', 'I: decisão sobre a Selic; II: taxa de cada contrato; III: objetivo legal.'], 0,
    'A finalidade, a decisão sobre a meta e a taxa observada têm funções diferentes. A terceira informação é sobre as operações especificadas; não é a inflação nem a taxa de todos os contratos.',
    ['Separa finalidade, decisão e observação operacional.', 'Troca as três categorias apresentadas.', 'Confunde juros e inflação e universaliza a taxa observada.', 'Atribui à finalidade e aos dados sentidos que eles não têm.'],
    ['roteiro', 'recuperacao'], origin('mp04', 'objetivos', 'selic', 'exemplo-rotulos'), ['O3']),
  question(6, 'G3',
    'Uma fábrica fictícia adia uma expansão. No mesmo mês, seu financiamento ficou mais caro e as encomendas de clientes externos diminuíram. Um analista atribui integralmente o adiamento à mudança dos juros. Qual avaliação usa apenas as evidências dadas?',
    ['A conclusão está provada, pois eventos no mesmo mês têm uma única causa.', 'A queda das encomendas prova que juros nunca afetam investimento.', 'Os dois fatores necessariamente explicam metade do efeito cada um.', 'O encarecimento pode influenciar o investimento, mas não foi isolado do efeito das encomendas.'], 3,
    'O encarecimento do financiamento pode influenciar a decisão de investir, mas existe outra mudança relevante. Sem separar influências, não se pode atribuir todo o resultado a um fator nem dividir percentuais de participação.',
    ['Coincidência temporal não identifica uma causa exclusiva.', 'Reconhecer outra influência não elimina o mecanismo monetário.', 'Inventa uma repartição numérica sem dados.', 'Reconhece mecanismo plausível e a limitação da atribuição causal.'],
    ['roteiro', 'recuperacao'], origin('mp04', 'transmissao', 'exemplo-credito', 'tempo'), ['O3']),
  question(7, 'G4',
    'Num modelo fictício, hoje um banco entrega 250 ao BCB e recebe um título. Ficou combinado que, amanhã, o banco devolverá esse título ao BCB e receberá 253. Pela perspectiva do BCB, qual descrição é correta?',
    ['Compra com revenda: o BCB fornece 250 na ida e recebe 253 na volta.', 'Venda com recompra: o BCB recebe 250 na ida e paga 253 na volta.', 'Venda definitiva: o BCB recebe 250 e não há operação inversa prevista.', 'Depósito compulsório: o banco entrega 250 sem receber título ou pactuar retorno.'], 1,
    'As setas descritas mostram venda inicial pelo BCB e recompra combinada. A ponta inicial absorve 250 da disponibilidade do banco no modelo; a de retorno entrega 253, diferença de 3. Os valores não representam taxa ou leilão real.',
    ['Inverte os fluxos de recursos dados no enunciado.', 'Preserva participante, direção inicial e compromisso de retorno.', 'Ignora o acordo explícito para amanhã.', 'Troca a compra de título com retorno por uma obrigação de recolhimento não informada.'],
    ['roteiro', 'glossario'], origin('mp05', 'compromissada', 'exemplo-absorcao', 'comparacao'), ['O3']),
  question(8, 'G4',
    'Três fichas fictícias: X — uma instituição financeira escolhe depósito remunerado no banco central, sob condições aplicáveis; Y — o banco central compra um título com compromisso de revendê-lo no prazo combinado; Z — em outro país, um programa compra ativos com reservas do banco central buscando influenciar juros mais longos, como no conceito estudado. Qual sequência classifica X, Y e Z?',
    ['Compulsório; compra definitiva; empréstimo pessoal.', 'QE; depósito voluntário; recolhimento obrigatório.', 'Depósito voluntário; compromissada; programa de QE no contexto descrito.', 'Compromissada; compulsório; depósito voluntário.'], 2,
    'X se distingue pela escolha de depositar; Y inclui uma operação inversa pactuada; Z descreve o programa de compras apresentado no ensino de QE. A comparação não transporta a política estrangeira ao Brasil nem equipara todos os instrumentos.',
    ['Apaga a escolha de X, o retorno de Y e a compra de ativos de Z.', 'Troca os mecanismos e atribui obrigatoriedade não descrita.', 'Identifica o direito, a condição e a finalidade de cada ficha.', 'Desconsidera as características decisivas das três operações.'],
    ['roteiro', 'recuperacao'], [...origin('mp05', 'compromissada'), ...origin('mp06', 'qe', 'comparar', 'depositos')], ['O3']),
  question(9, 'G5',
    'Dois planos fictícios partem do mesmo estoque de dívida de 600, sem juros, indexação ou outros ajustes. Ambos resgatam 80 de principal. O plano A emite 80; o plano B emite 110, usando os 30 adicionais para outros pagamentos. Quais são os estoques finais, A e B, respectivamente?',
    ['520 e 520.', '680 e 710.', '600 e 600.', '600 e 630.'], 3,
    'Plano A: 600 − 80 + 80 = 600. Plano B: 600 − 80 + 110 = 630. Emitir exatamente o principal resgatado recompõe o financiamento; a emissão adicional de B aumenta o estoque no modelo. O uso dos recursos não elimina a obrigação emitida.',
    ['Considera os resgates e ignora ambas as emissões.', 'Considera as emissões e ignora os resgates.', 'Trata a emissão adicional de B como se não criasse obrigação.', 'Considera estoque inicial, resgate e emissão em cada plano.'],
    ['roteiro', 'glossario'], origin('mp07', 'fluxo-estoque', 'exemplo-fluxo', 'exemplo-estoque'), ['O4']),
  question(10, 'G5',
    'Título fictício com pagamento único de 150 no vencimento: Dora comprou-o na emissão por 144, sem cupons ou outros pagamentos. Antes do vencimento, aceita vendê-lo a Enzo por 141. Desconsidere custos e tributos. Qual leitura descreve essa segunda negociação?',
    ['O emissor capta mais 141 e Dora continua titular do mesmo título.', 'Dora recebe 141 e realiza diferença bruta de −3 em relação à compra; Enzo passa a deter o direito do título.', 'Enzo recebe imediatamente 150 do emissor e Dora ganha 6 pela revenda.', 'Dora recebe obrigatoriamente 150 na revenda porque esse é o pagamento previsto no vencimento.'], 1,
    'Enzo paga os 141 à vendedora Dora; 141 − 144 = −3. A troca de titular não é automaticamente nova captação do emissor. O pagamento contratual de 150 no vencimento não fixa o preço de venda antecipada.',
    ['Confunde revenda com emissão e ignora a transferência do título.', 'Segue o destinatário do pagamento, o resultado bruto da venda e a mudança de titular.', 'Antecipa pagamento do emissor que não ocorreu e troca o preço efetivo da venda.', 'Confunde pagamento no vencimento com preço negociado antes dele.'],
    ['roteiro', 'glossario'], origin('mp07', 'emissao-negociacao', 'exemplo-secundario', 'remuneracao', 'exemplo-preco'), ['O4']),
  question(11, 'G6',
    'O gráfico e a tabela mostram a mesma fotografia inteiramente fictícia: mesma data, moeda, convenção de taxa anual e instrumentos comparáveis por hipótese. Qual leitura respeita os pontos e os limites da informação?\n\n| Prazo remanescente (anos) | Taxa (% a.a.) |\n| --- | --- |\n| 1 | 8 |\n| 2 | 6 |\n| 3 | 7 |\n\n```mermaid\nxychart-beta\n  title "Chefe: fotografia fictícia, não previsão"\n  x-axis "Prazo remanescente (anos)" [1, 2, 3]\n  y-axis "Taxa (% a.a.)" 5 --> 9\n  line [8, 6, 7]\n```',
    ['As taxas aumentam continuamente de um a três anos.', 'A taxa de dois anos garante que a Selic será 6% no segundo ano.', 'A taxa de três anos supera a de dois em 1 ponto percentual, mas está abaixo da de um ano.', 'O investimento de três anos renderá exatamente 7% acumulados em todo o prazo.'], 2,
    'Os pontos mostram 8%, 6% e 7% a.a. por prazo na mesma data. De dois para três anos a diferença é 7 − 6 = 1 ponto percentual; a taxa de três anos continua abaixo de 8%. O desenho não é uma sequência de decisões futuras nem informa retorno acumulado de 7%.',
    ['Ignora a queda de 8% para 6% entre os dois primeiros prazos.', 'Transforma uma taxa por prazo em garantia de política futura.', 'Compara corretamente dois pares de pontos e suas unidades.', 'Confunde taxa anual indicada com retorno de todo o período.'],
    ['roteiro', 'glossario'], origin('mp09', 'eixos', 'formas', 'exemplo-futuro', 'exemplo-comparar'), ['O5']),
  question(12, 'G6',
    'Modelo fictício de capitalização composta: 300 aplicados por três anos completos a 6% efetivos ao ano, taxa fixa, com reinvestimento integral, sem custos, tributos, aportes ou retiradas. Multiplique pela nova base a cada ano e arredonde somente o montante final a duas casas. Qual resultado e leitura são corretos?',
    ['357,30: 300 × 1,06 × 1,06 × 1,06; os 6% são anuais, não o ganho de todo o prazo.', '354,00: acrescentar 18% à base inicial reproduz exatamente o modelo composto.', '318,00: aplicar o fator 1,06 uma vez basta para os três anos.', '360,00: todo prazo de três anos transforma 6% anuais em 20% acumulados.'], 0,
    'Ano 1: 318. Ano 2: 337,08. Ano 3: 357,3048, arredondado para 357,30. Reinvestimento faz o fator atuar sobre a nova base. Não se pressupõe essa convenção em um produto real; ela está expressa no modelo.',
    ['Aplica os três fatores e arredonda apenas o montante final.', 'Usa acréscimo simples de 18%, diferente da composição especificada.', 'Ignora dois períodos de crescimento.', 'Inventa uma conversão para 20% sem relação com os fatores dados.'],
    ['roteiro', 'glossario'], origin('mp09', 'acumulado', 'exemplo-acumulado'), ['O5'])
];
export const MPCHEFE_DRAFT = {
  id: 'draft.mpchefe', topicId: 'draft.mpchefe', editorialKey: 'MP-CHEFE', candidateBlockId: 'banking.markets-policy',
  title: 'Chefe — conectar mercados, instrumentos e dívida', contentVersion: 1, kind: 'boss', publication: { status: 'draft' },
  objective: 'Aplicar as distinções ensinadas em MP-01–09 a doze casos próprios, justificando a resposta e retomando o ensino de origem após erro.',
  sourceIds: SOURCES.map(s => s.id), sections, questions,
  recall: ['Antes da tentativa, indique a origem de um conceito que ainda precise retomar.', 'Depois de responder, explique qual dado torna sua alternativa a única correta no caso.', 'Ao recuperar um erro, altere um participante, valor ou prazo e refaça o raciocínio sem consultar o gabarito.'],
  teaching: { contractVersion: 1, editorialPass: 'mpchefe-autoria-r1', reviewStatus: 'human-review-pending',
    questionCoverage: Object.fromEntries(questions.map(q => [q.id, [
      ...q.recoverySectionIds.map(sectionId => ({ missionId: 'draft.mpchefe', sectionId })),
      ...q.originRefs.map(ref => ({ missionId: `draft.${ref.unit}`, sectionId: ref.sectionId }))
    ]])) }
};
export const EDITORIAL = {
  stage: 'Doze itens e apoio de recuperação redigidos; conferência do autor; revisão independente do Chefe e aceite de publicação pendentes; integração não iniciada',
  referenceOnlyProfiles: [{ id: 'bb.agente-comercial.2022-001', item: 'Recortes de 2/3/4/12/13/14', status: 'histórico; sem cobertura integral' }, { id: 'caixa.tbn.2024-nm', item: 'Recortes de 3/16/17/18/26/27/278 (posição 28)', status: 'histórico; sem cobertura integral' }],
  recovery: { objectiveId: 'O6', instruction: 'Retomar a aula/trecho, explicar o distrator e refazer o raciocínio; sem alterar agendamento ou diagnóstico do aplicativo.' },
  groups: [
    { id: 'G1', title: 'Participantes e relações', units: ['mp01','mp08'] },
    { id: 'G2', title: 'Recursos e poder de compra', units: ['mp02','mp03'] },
    { id: 'G3', title: 'Política e transmissão', units: ['mp04'] },
    { id: 'G4', title: 'Operações e contexto', units: ['mp05','mp06'] },
    { id: 'G5', title: 'Fiscal e títulos', units: ['mp07'] },
    { id: 'G6', title: 'Prazos e conclusão limitada', units: ['mp09'] }
  ],
  limits: ['Fontes e fatos já verificados nas aulas de origem, reaproveitados sem nova auditoria normativa.', 'Cenários, valores e gráfico são fictícios; condições de cálculo explícitas, sem taxa atual ou recomendação.', 'Os doze itens são próprios deste Chefe, mas expostos em documentação: não compõem nova forma de avaliação independente.', 'Ensino e acesso às aulas anteriores são dependências antes de qualquer liberação. Revisão independente do ensino não valida automaticamente estes novos itens.', 'Sem IDs produtivos, XP, limiar de domínio, liberação, migração ou mudança de progresso. A/B e fases do projeto permanecem separadas.']
};
const arithmetic = (label, operation, left, right, expected) => ({ label, operation, values: [left, right], expected });
export const ARITHMETIC = [
  arithmetic('q03: saldo mais crédito (distrator)', 'add',46,34,80),
  arithmetic('q03: saldo mais recebimento futuro (distrator)', 'add',46,20,66),
  arithmetic('q03: soma indiscriminada (distrator)', 'add',80,20,100),
  arithmetic('q04: razão de fatores', 'divide',1.12,1.08,1.037037037037037),
  arithmetic('q04: taxa real decimal', 'subtract',1.037037037037037,1,0.037037037037037),
  arithmetic('q04: percentual antes de arredondar', 'multiply',0.037037037037037,100,3.7037037037037),
  arithmetic('q04: razão invertida (distrator)', 'divide',1.08,1.12,0.9642857142857143),
  arithmetic('q07: diferença da volta', 'subtract',253,250,3),
  arithmetic('q09: após resgate nos dois planos', 'subtract',600,80,520),
  arithmetic('q09: plano A', 'add',520,80,600),
  arithmetic('q09: plano B', 'add',520,110,630),
  arithmetic('q10: resultado da revenda', 'subtract',141,144,-3),
  arithmetic('q11: três anos menos dois', 'subtract',7,6,1),
  arithmetic('q11: três anos menos um', 'subtract',7,8,-1),
  arithmetic('q12: primeiro ano', 'multiply',300,1.06,318),
  arithmetic('q12: segundo ano', 'multiply',318,1.06,337.08),
  arithmetic('q12: terceiro ano', 'multiply',337.08,1.06,357.3048),
  arithmetic('q12: fator simples indevido (distrator)', 'multiply',300,1.18,354)
];
