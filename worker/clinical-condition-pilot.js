import pilot from '../data/clinical-conditions/convulsao-epilepsia-20261016.json' with { type: 'json' };
import shoulder from '../data/clinical-conditions/dor-no-ombro-20261016.json' with { type: 'json' };
import related from '../data/clinical-conditions/ombro-referencias-sisreg-cg-20261016.json' with { type: 'json' };

import tendon from '../data/clinical-conditions/bursite-tendinite-20261016.json' with { type: 'json' };
import headache from '../data/clinical-conditions/cefaleia-neuropediatria-20261016.json' with { type: 'json' };

const copy = value => JSON.parse(JSON.stringify(value));
const records = new Map([pilot, shoulder, related, tendon, headache].map(record => [record.id, record]));
function failure(message, status) { return Object.assign(new Error(message), { status }); }

export function hydrateClinicalPilot(protocol) {
  if (!protocol?.clinicalConditionId) return null;
  const record = records.get(protocol.clinicalConditionId);
  if (!record || protocol.id !== record.id) throw failure('Condição-piloto não reconhecida.', 400);
  if (protocol.clinicalConditionRecord?.revision !== record.revision) throw failure('A revisão do piloto mudou. Recarregue o guia antes de consultar.', 409);
  const age = protocol.clinicalAge;
  if (age !== null && age !== undefined && (!Number.isInteger(age.years) || age.years < 0 || age.years > 150 || !Number.isInteger(age.months) || age.months < 0 || age.months > 11 || !Number.isInteger(age.days) || age.days < 0 || age.days > 31)) throw failure('Faixa etária do piloto inválida.', 400);
  const eligibility = record.rules.find(rule => rule.id === 'IDADE');
  const compare = (a, b) => a.years - b.years || a.months - b.months || a.days - b.days;
  const texts = group => record.rules.filter(rule => rule.group === group).map(rule => rule.text);
  const docs = requirement => record.rules.filter(rule => rule.group === 'documents' && rule.requirement === requirement).map(rule => rule.text);
  let notice = null;
  const exact = record.contextualAlerts?.find(alert => alert.trigger.ageYears === age?.years);
  if (exact) notice = copy(exact);
  else if (age && ((eligibility.ageMinimum && compare(age, eligibility.ageMinimum) < 0) || (eligibility.ageMaximum && compare(age, eligibility.ageMaximum) > 0) || (eligibility.ageMaximumYears !== undefined && age.years > eligibility.ageMaximumYears))) notice = { id: 'FORA_FAIXA', title: 'Idade fora da faixa descrita neste recorte', text: eligibility.text + ' Confirme o fluxo com a Regulação; o piloto não define uma rota alternativa.' };
  // Reconstruct from the bundled record, never from client-supplied clinical text.
  return {
    id: record.id, nome: record.specialty + ' - ' + record.condition, categoria: record.category,
    faixaEtaria: texts('eligibility').join(' '), viaAcesso: record.system,
    situacaoTeleconsulta: 'Piloto em revisão; oferta, vigência e aplicabilidade municipal não confirmadas.',
    resumo: record.condition, fluxoLocal: texts('appointment').concat(texts('documentPresentation'), texts('scope')).join(' '),
    criteriosParaEncaminhar: texts('referral'), informacoesClinicasObrigatorias: texts('description').concat(record.rules.filter(rule => rule.group === 'clinicalAssessment' && rule.requirement === 'obrigatorio').map(rule => rule.text)),
    ...(texts('clinicalRecord').length ? { registrosObrigatorios: texts('clinicalRecord') } : {}), examesObrigatorios: docs('obrigatorio'), examesCondicionais: docs('condicional_se_houver'), recomendadosQuandoDisponiveis: docs('opcional_documental'),
    elementosPriorizacao: [], alertas: texts('exclusion').concat(texts('editorialSafeguard'), texts('alert'), record.systemBoundary ? [record.systemBoundary] : [], notice ? [notice.text] : []),
    subprotocolos: [], praticaRegulatoria: null,
    fontes: record.sources.map(source => source.title + (source.version ? ' ' + source.version : '')),
    ultimaConferencia: ['tendon', 'headache'].includes(record.searchKind) ? 'PDF e páginas conferidos diretamente em 16/10/2026; confirmação institucional pendente.' : 'Matriz e conferência visual comunicadas pela frente documental em 16/10/2026; confirmação institucional pendente.',
    clinicalConditionId: record.id, clinicalConditionRecord: copy(record), clinicalAge: age ? copy(age) : null,
    clinicalContextualAlerts: notice ? [notice] : []
  };
}

export const clinicalPilotRecord = (id = pilot.id) => records.has(id) ? copy(records.get(id)) : null;
