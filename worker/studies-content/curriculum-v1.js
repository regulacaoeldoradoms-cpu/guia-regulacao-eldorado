'use strict';

import { MP_MISSIONS } from './banking-markets-policy-v1.js';
import { PC_MISSIONS } from './banking-products-credit-v1.js';
import { CE_MISSIONS } from './banking-capital-exchange-v1.js';
import { DP_MISSIONS } from './banking-digital-payments-v1.js';
import { OA_MISSIONS } from './portuguese-accentuation-v1.js';
import { PT_MISSIONS } from './portuguese-text-v1.js';
import { LP_MISSIONS } from './portuguese-reading-v1.js';
import { IS_MISSIONS } from './banking-institution-specific-v1.js';
import { publishedCatalog } from './publication-registry.js';

const freezeList = (items) => Object.freeze(items.map((item) => Object.freeze(item)));
const block = (id, title, examIds, missionIds = []) => Object.freeze({
  id, title,
  examIds: Object.freeze(examIds),
  missionIds: Object.freeze(missionIds)
});
const area = (id, title, examIds, blocks) => Object.freeze({
  id, title,
  examIds: Object.freeze(examIds),
  blocks: Object.freeze(blocks)
});

export const CURRICULUM_VERSION = 1;

export const EXAM_PROFILES = freezeList([
  {
    id: 'bb.agente-comercial.2022-001',
    institution: 'Banco do Brasil',
    role: 'Escriturário — Agente Comercial',
    sourceId: 'edital.bb.2022-001',
    referenceOnly: true,
    verifiedAt: '2026-09-27',
    totalObjectiveQuestions: 70,
    totalObjectivePoints: 100,
    essay: true,
    disciplines: Object.freeze([
      Object.freeze({ areaId: 'portuguese', questions: 10, points: 15 }),
      Object.freeze({ areaId: 'english', questions: 5, points: 5 }),
      Object.freeze({ areaId: 'math', questions: 5, points: 7.5 }),
      Object.freeze({ areaId: 'financial-current', questions: 5, points: 5 }),
      Object.freeze({ areaId: 'financial-math', questions: 5, points: 7.5 }),
      Object.freeze({ areaId: 'banking', questions: 10, points: 15 }),
      Object.freeze({ areaId: 'informatics', questions: 15, points: 22.5 }),
      Object.freeze({ areaId: 'sales-service', questions: 15, points: 22.5 })
    ])
  },
  {
    id: 'caixa.tbn.2024-nm',
    institution: 'CAIXA',
    role: 'Técnico Bancário Novo',
    sourceId: 'edital.caixa.2024-nm',
    referenceOnly: true,
    verifiedAt: '2026-09-27',
    totalObjectiveQuestions: 60,
    totalObjectivePoints: 60,
    essay: true,
    disciplines: Object.freeze([
      Object.freeze({ areaId: 'portuguese', questions: 5, points: 5 }),
      Object.freeze({ areaId: 'english', questions: 5, points: 5 }),
      Object.freeze({ areaId: 'financial-math', questions: 5, points: 5 }),
      Object.freeze({ areaId: 'statistics', questions: 5, points: 5 }),
      Object.freeze({ areaId: 'ethics-compliance', questions: 5, points: 5 }),
      Object.freeze({ areaId: 'banking', questions: 15, points: 15 }),
      Object.freeze({ areaId: 'informatics', questions: 5, points: 5 }),
      Object.freeze({ areaId: 'digital-behavior', questions: 5, points: 5 }),
      Object.freeze({ areaId: 'sales-service', questions: 10, points: 10 })
    ])
  }
]);

const SFN_MISSIONS = Object.freeze([
  'banking.sfn.introducao',
  'banking.sfn.cmn',
  'banking.sfn.bacen',
  'banking.sfn.copom',
  'banking.sfn.cvm',
  'banking.sfn.operadores',
  'banking.sfn.seguros-previdencia',
  'banking.sfn.pagamentos-consorcios',
  'banking.sfn.boss'
]);

export const COURSE_AREAS = Object.freeze([
  area('banking', 'Conhecimentos Bancários', ['bb.agente-comercial.2022-001', 'caixa.tbn.2024-nm'], [
    block('banking.sfn-foundation', 'SFN, supervisores, operadores e infraestrutura básica', ['bb.agente-comercial.2022-001', 'caixa.tbn.2024-nm'], SFN_MISSIONS),
    block('banking.markets-policy', 'Mercados, moeda, política monetária, juros e dívida pública', ['bb.agente-comercial.2022-001', 'caixa.tbn.2024-nm'], publishedCatalog(MP_MISSIONS).map(mission => mission.id)),
    block('banking.products-credit', 'Produtos bancários, crédito, contas e garantias', ['bb.agente-comercial.2022-001', 'caixa.tbn.2024-nm'], publishedCatalog(PC_MISSIONS).map(mission => mission.id)),
    block('banking.capital-exchange', 'Mercado de capitais, investimentos e câmbio', ['bb.agente-comercial.2022-001', 'caixa.tbn.2024-nm'], publishedCatalog(CE_MISSIONS).map(mission => mission.id)),
    block('banking.digital-payments', 'Pagamentos, bancos digitais, fintechs e transformação financeira', ['bb.agente-comercial.2022-001', 'caixa.tbn.2024-nm'], publishedCatalog(DP_MISSIONS).map(mission => mission.id)),
    block('banking.institution-specific', 'Tópicos institucionais e programas específicos do edital', ['caixa.tbn.2024-nm'], publishedCatalog(IS_MISSIONS).map(mission => mission.id))
  ]),
  area('portuguese', 'Língua Portuguesa', ['bb.agente-comercial.2022-001', 'caixa.tbn.2024-nm'], [
    block('portuguese.reading', 'Compreensão, interpretação e argumentação', ['bb.agente-comercial.2022-001', 'caixa.tbn.2024-nm'], publishedCatalog(LP_MISSIONS).map(mission => mission.id)),
    block('portuguese.text', 'Organização, tipologia, coesão e coerência', ['bb.agente-comercial.2022-001', 'caixa.tbn.2024-nm'], publishedCatalog(PT_MISSIONS).map(mission => mission.id)),
    block('portuguese.spelling', 'Ortografia, acentuação e acordo ortográfico', ['bb.agente-comercial.2022-001', 'caixa.tbn.2024-nm'], publishedCatalog(OA_MISSIONS).map(mission => mission.id)),
    block('portuguese.syntax', 'Sintaxe, pontuação, concordância, regência e crase', ['bb.agente-comercial.2022-001', 'caixa.tbn.2024-nm']),
    block('portuguese.meaning-writing', 'Semântica, colocação pronominal e escrita formal', ['bb.agente-comercial.2022-001', 'caixa.tbn.2024-nm'])
  ]),
  area('english', 'Língua Inglesa', ['bb.agente-comercial.2022-001', 'caixa.tbn.2024-nm'], [
    block('english.reading', 'Vocabulário contextual e compreensão de textos', ['bb.agente-comercial.2022-001', 'caixa.tbn.2024-nm']),
    block('english.grammar-inference', 'Estruturas gramaticais, conectores e inferência para leitura', ['bb.agente-comercial.2022-001', 'caixa.tbn.2024-nm'])
  ]),
  area('math', 'Matemática', ['bb.agente-comercial.2022-001'], [
    block('math.numbers-proportion', 'Números, medidas, contagem, razão, proporção e porcentagem', ['bb.agente-comercial.2022-001']),
    block('math.logic-sets', 'Lógica proposicional e conjuntos', ['bb.agente-comercial.2022-001']),
    block('math.functions', 'Relações e funções polinomiais, exponenciais e logarítmicas', ['bb.agente-comercial.2022-001']),
    block('math.linear-sequences', 'Matrizes, determinantes, sistemas, sequências, PA e PG', ['bb.agente-comercial.2022-001'])
  ]),
  area('financial-math', 'Matemática Financeira', ['bb.agente-comercial.2022-001', 'caixa.tbn.2024-nm'], [
    block('financial-math.basics', 'Valor do dinheiro no tempo, capital, juros e fluxos', ['bb.agente-comercial.2022-001', 'caixa.tbn.2024-nm']),
    block('financial-math.interest', 'Juros simples e compostos', ['bb.agente-comercial.2022-001', 'caixa.tbn.2024-nm']),
    block('financial-math.equivalence', 'Taxas, equivalência de capitais, VP/VF e séries', ['bb.agente-comercial.2022-001', 'caixa.tbn.2024-nm']),
    block('financial-math.amortization', 'SAC, Price, descontos e problemas integrados', ['bb.agente-comercial.2022-001', 'caixa.tbn.2024-nm'])
  ]),
  area('statistics', 'Probabilidade e Estatística', ['caixa.tbn.2024-nm'], [
    block('statistics.data', 'Variáveis, população, amostra, frequências, tabelas e gráficos', ['caixa.tbn.2024-nm']),
    block('statistics.descriptive', 'Tendência central, posição e dispersão', ['caixa.tbn.2024-nm']),
    block('statistics.probability', 'Probabilidade, condicional, independência e binomial', ['caixa.tbn.2024-nm']),
    block('statistics.correlation-inference', 'Correlação, estimação, testes e inferência', ['caixa.tbn.2024-nm'])
  ]),
  area('informatics', 'Informática e TIC', ['bb.agente-comercial.2022-001', 'caixa.tbn.2024-nm'], [
    block('informatics.systems-files', 'Sistemas, arquivos, aplicativos e produtividade', ['bb.agente-comercial.2022-001', 'caixa.tbn.2024-nm']),
    block('informatics.office-collaboration', 'Ferramentas de escritório e colaboração', ['bb.agente-comercial.2022-001', 'caixa.tbn.2024-nm']),
    block('informatics.internet-network', 'Internet, redes, navegação e serviços digitais', ['bb.agente-comercial.2022-001', 'caixa.tbn.2024-nm']),
    block('informatics.security-data', 'Segurança, dados, nuvem e proteção da informação', ['bb.agente-comercial.2022-001', 'caixa.tbn.2024-nm'])
  ]),
  area('sales-service', 'Vendas, Negociação e Atendimento', ['bb.agente-comercial.2022-001', 'caixa.tbn.2024-nm'], [
    block('sales-service.customer', 'Cliente, experiência, qualidade e comunicação', ['bb.agente-comercial.2022-001', 'caixa.tbn.2024-nm']),
    block('sales-service.sales', 'Processo de vendas, marketing e pós-venda', ['bb.agente-comercial.2022-001', 'caixa.tbn.2024-nm']),
    block('sales-service.negotiation', 'Negociação, comportamento do consumidor e relacionamento', ['bb.agente-comercial.2022-001', 'caixa.tbn.2024-nm']),
    block('sales-service.rules', 'Direitos, inclusão, ouvidoria e normas de relacionamento', ['bb.agente-comercial.2022-001', 'caixa.tbn.2024-nm'])
  ]),
  area('digital-behavior', 'Conhecimentos e Comportamentos Digitais', ['caixa.tbn.2024-nm'], [
    block('digital-behavior.agility', 'Mentalidade de crescimento, inovação, design e agilidade', ['caixa.tbn.2024-nm']),
    block('digital-behavior.data-business', 'Dados, pensamento computacional e análise de negócios', ['caixa.tbn.2024-nm']),
    block('digital-behavior.people', 'Liderança, colaboração, produtividade e aprendizagem contínua', ['caixa.tbn.2024-nm'])
  ]),
  area('financial-current', 'Atualidades do Mercado Financeiro', ['bb.agente-comercial.2022-001'], [
    block('financial-current.digital', 'Bancos digitais, fintechs, open finance e novos modelos', ['bb.agente-comercial.2022-001']),
    block('financial-current.money-payments', 'Moeda digital, blockchain, pagamentos e transformação financeira', ['bb.agente-comercial.2022-001'])
  ]),
  area('ethics-compliance', 'Ética e Compliance', ['caixa.tbn.2024-nm'], [
    block('ethics-compliance.integrity', 'Ética, integridade, administração pública e governança', ['caixa.tbn.2024-nm']),
    block('ethics-compliance.privacy-security', 'Sigilo, LGPD, segurança cibernética e proteção da informação', ['caixa.tbn.2024-nm']),
    block('ethics-compliance.aml-anticorruption', 'Lavagem de dinheiro, anticorrupção e responsabilidade socioambiental', ['caixa.tbn.2024-nm'])
  ]),
  area('writing-integration', 'Redação e Integração de Prova', ['bb.agente-comercial.2022-001', 'caixa.tbn.2024-nm'], [
    block('writing-integration.essay', 'Planejamento, escrita e revisão da redação', ['bb.agente-comercial.2022-001', 'caixa.tbn.2024-nm']),
    block('writing-integration.mock', 'Simulados completos, tempo e plano de correção', ['bb.agente-comercial.2022-001', 'caixa.tbn.2024-nm'])
  ])
]);

export function validateCurriculum(publishedMissions = []) {
  const errors = [];
  const examIds = new Set(EXAM_PROFILES.map((profile) => profile.id));
  const areaIds = new Set(COURSE_AREAS.map((item) => item.id));
  const publishedIds = new Set(publishedMissions.map((mission) => mission.id));
  const blockIds = new Set();
  for (const profile of EXAM_PROFILES) {
    const questions = profile.disciplines.reduce((sum, item) => sum + item.questions, 0);
    const points = profile.disciplines.reduce((sum, item) => sum + item.points, 0);
    if (questions !== profile.totalObjectiveQuestions) errors.push(`${profile.id}:question-total`);
    if (Math.abs(points - profile.totalObjectivePoints) > 0.001) errors.push(`${profile.id}:point-total`);
    for (const discipline of profile.disciplines) if (!areaIds.has(discipline.areaId)) errors.push(`${profile.id}:unknown-area:${discipline.areaId}`);
  }
  for (const areaItem of COURSE_AREAS) {
    for (const examId of areaItem.examIds) if (!examIds.has(examId)) errors.push(`${areaItem.id}:unknown-exam:${examId}`);
    for (const item of areaItem.blocks) {
      if (blockIds.has(item.id)) errors.push(`${item.id}:duplicate-block`);
      blockIds.add(item.id);
      for (const examId of item.examIds) if (!examIds.has(examId)) errors.push(`${item.id}:unknown-exam:${examId}`);
      for (const missionId of item.missionIds) if (!publishedIds.has(missionId)) errors.push(`${item.id}:missing-mission:${missionId}`);
    }
  }
  return errors;
}

export function curriculumSnapshot(publishedMissions = [], progress = {}) {
  const published = new Map(publishedMissions.map((mission) => [mission.id, mission]));
  const allBlocks = COURSE_AREAS.flatMap((item) => item.blocks.map((entry) => ({ area: item, block: entry })));
  const blockState = ({ area: parent, block: item }) => {
    const available = item.missionIds.length > 0 && item.missionIds.every((id) => published.has(id));
    const completed = available && item.missionIds.every((id) => {
      const mission = published.get(id);
      return Number(progress?.[mission.topicId]?.coverageState || 0) >= 3;
    });
    return {
      id: item.id,
      title: item.title,
      areaId: parent.id,
      available,
      completed,
      publishedMissions: item.missionIds.filter((id) => published.has(id)).length,
      plannedMissions: item.missionIds.length
    };
  };
  const blocks = allBlocks.map(blockState);
  const byArea = new Map(blocks.map((item) => [item.id, item]));
  const areas = COURSE_AREAS.map((item) => {
    const states = item.blocks.map((entry) => byArea.get(entry.id));
    const publishedBlocks = states.filter((entry) => entry.available).length;
    const completedBlocks = states.filter((entry) => entry.completed).length;
    return {
      id: item.id,
      title: item.title,
      started: publishedBlocks > 0,
      completed: states.length > 0 && completedBlocks === states.length,
      publishedBlocks,
      completedBlocks,
      totalBlocks: states.length
    };
  });
  const round = (value) => Math.round(value * 1000) / 10;
  const totalBlocks = blocks.length || 1;
  const publishedBlocks = blocks.filter((item) => item.available).length;
  const completedBlocks = blocks.filter((item) => item.completed).length;
  return {
    version: CURRICULUM_VERSION,
    basis: 'Editais-base históricos BB 2022/001 e CAIXA 2024/NM; atualizar quando houver novo edital adotado.',
    totalAreas: areas.length,
    startedAreas: areas.filter((item) => item.started).length,
    completedAreas: areas.filter((item) => item.completed).length,
    totalBlocks,
    publishedBlocks,
    completedBlocks,
    availabilityPercent: round(publishedBlocks / totalBlocks),
    progressPercent: round(completedBlocks / totalBlocks),
    readiness: Object.freeze({
      status: 'not_measured',
      label: 'Ainda não medida',
      explanation: 'Prontidão exige cobertura curricular, retenção em revisões e simulados representativos; XP e conclusão de aula não bastam.'
    }),
    areas
  };
}
