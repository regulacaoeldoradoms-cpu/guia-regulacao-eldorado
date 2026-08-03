'use strict';

const INSTITUTIONAL_IMAGE = 'https://i.ibb.co/fd23T1tv/logo-agenda.png';
const institutionalArray = (value) => Array.isArray(value) ? value : (value ? [value] : []);
const institutionalEscape = (value) => (value ?? '').toString().replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const institutionalUnique = (value, limit = Infinity) => [...new Set(institutionalArray(value).filter(Boolean).map((item) => String(item).trim()).filter(Boolean))].slice(0, limit);

function institutionalList(items) {
  const values = institutionalArray(items);
  return values.length ? `<ul>${values.map((item) => `<li>${institutionalEscape(item)}</li>`).join('')}</ul>` : '';
}

function institutionalSection(title, items, className = '') {
  const values = institutionalArray(items);
  return values.length ? `<section class="institutional-section ${className}"><h2>${institutionalEscape(title)}</h2>${institutionalList(values)}</section>` : '';
}

function institutionalSubprotocols(protocol) {
  return institutionalArray(protocol.subprotocolos)
    .filter((subprotocol) => !String(subprotocol?.titulo || '').startsWith('Aplicação prática das devoluções'))
    .map((subprotocol) => {
      const content = [
        institutionalSection('Informações clínicas necessárias', subprotocol.obrigatorias),
        institutionalSection('Exames obrigatórios', subprotocol.examesObrigatorios),
        institutionalSection('Exames condicionais — somente quando aplicável', subprotocol.condicionais, 'conditional'),
        institutionalSection('Documentos e exames já realizados — se disponíveis', subprotocol.complementares, 'optional')
      ].join('');
      return content ? `<section class="institutional-subprotocol"><h2>${institutionalEscape(subprotocol.titulo || 'Condição específica')}</h2>${content}</section>` : '';
    }).join('');
}

function institutionalPracticalGuidance(protocol) {
  if (protocol?.practicalGuidance) return protocol.practicalGuidance;
  if (typeof window.getReferralPracticalGuidance === 'function') return window.getReferralPracticalGuidance(protocol);
  return null;
}

function institutionalPracticalSections(protocol) {
  const guidance = institutionalPracticalGuidance(protocol);
  if (!guidance) return '';
  return `<section class="institutional-practical-note">
      <h2>Pontos que frequentemente impedem a análise regulatória</h2>
      <p>Os itens abaixo foram observados em devoluções regulatórias reais e anonimizadas. Eles auxiliam a revisão do encaminhamento, mas não substituem nem ampliam automaticamente os requisitos do protocolo oficial.</p>
      ${institutionalList(institutionalUnique(guidance.returns, 6))}
    </section>
    <div class="institutional-source-grid">
      <section class="institutional-section patient-source"><h2>Informações que podem ser confirmadas com paciente ou responsável</h2>${institutionalList(institutionalUnique(guidance.patientReportable, 5))}</section>
      <section class="institutional-section professional-source"><h2>Informações que exigem avaliação profissional</h2>${institutionalList(institutionalUnique(guidance.professionalOnly, 5))}</section>
    </div>`;
}

function printInstitutionalOrientation(protocol) {
  const printArea = document.getElementById('printArea');
  if (!printArea || !protocol) return;

  const issueDate = new Date().toLocaleDateString('pt-BR');
  const route = typeof accessRoute === 'function' ? accessRoute(protocol) : 'Conforme sistema de regulação';
  const mandatoryInformation = institutionalArray(protocol.informacoesObrigatorias);
  const mandatoryExams = institutionalArray(protocol.examesObrigatorios);
  const conditionalExams = institutionalArray(protocol.examesCondicionais);
  const availableDocuments = institutionalArray(protocol.complementares);
  const alerts = institutionalArray(protocol.alertas);
  const practicalGuidance = institutionalPracticalGuidance(protocol);
  const protocolSources = institutionalArray(protocol.fontes).filter((source) => {
    const value = String(source).toLowerCase();
    return !value.includes('camada prática') && !value.includes('estudo operacional anonimizado');
  });

  printArea.innerHTML = `<article class="institutional-document">
      <header class="institutional-header">
        <div class="institutional-government">PREFEITURA MUNICIPAL DE ELDORADO — MS</div>
        <div class="institutional-department">SECRETARIA MUNICIPAL DE SAÚDE · SETOR DE REGULAÇÃO DE SAÚDE</div>
        <h1>ORIENTAÇÃO PARA COMPLEMENTAÇÃO DE SOLICITAÇÃO</h1>
        <p>Documento para apresentação ao médico da unidade de saúde</p>
      </header>

      <section class="institutional-identification">
        <div class="institutional-field wide"><strong>Paciente:</strong><span></span></div>
        <div class="institutional-field"><strong>Data de nascimento:</strong><span></span></div>
        <div class="institutional-field"><strong>Cartão SUS:</strong><span></span></div>
        <div class="institutional-field wide"><strong>Especialidade ou exame:</strong><span class="filled">${institutionalEscape(protocol.nome)}</span></div>
        <div class="institutional-field"><strong>Via de acesso:</strong><span class="filled">${institutionalEscape(route)}</span></div>
        <div class="institutional-field"><strong>Data de emissão:</strong><span class="filled">${institutionalEscape(issueDate)}</span></div>
      </section>

      <section class="institutional-introduction">
        <p><strong>À equipe médica da unidade de saúde,</strong></p>
        <p>Para dar continuidade à solicitação acima, é necessário revisar o encaminhamento e complementar as informações clínicas, exames ou documentos indicados neste impresso, conforme o protocolo vigente.</p>
        <p>O encaminhamento deve ser atualizado de forma individualizada, de acordo com a história clínica, o exame físico, os tratamentos realizados e a necessidade atual do paciente.</p>
      </section>

      ${institutionalSection('Informações clínicas que devem constar no encaminhamento', mandatoryInformation, 'required')}
      ${institutionalSection('Exames obrigatórios para continuidade da solicitação', mandatoryExams, 'required')}
      ${institutionalSection('Exames condicionais — realizar ou informar somente quando a condição se aplicar', conditionalExams, 'conditional')}
      ${institutionalSection('Laudos, imagens e documentos já realizados — apresentar se disponíveis', availableDocuments, 'optional')}
      ${institutionalSubprotocols(protocol)}
      ${institutionalPracticalSections(protocol)}
      ${alerts.length ? `<section class="institutional-section warning"><h2>Atenção clínica</h2><p>As situações abaixo não devem aguardar a fila ambulatorial:</p>${institutionalList(alerts)}</section>` : ''}

      <section class="institutional-return-guidance">
        <h2>Orientação ao paciente</h2>
        <p>Apresente este documento ao médico. Após a avaliação, retorne ao Setor de Regulação somente quando precisar entregar encaminhamento atualizado, exames, laudos, imagens ou outra documentação necessária para continuar a solicitação.</p>
      </section>

      <footer class="institutional-footer">
        <img src="${INSTITUTIONAL_IMAGE}" alt="Identificação institucional do Município de Eldorado/MS">
        <div class="institutional-validation">
          <strong>Setor de Regulação de Saúde — Eldorado/MS</strong>
          <span>Documento institucional de orientação para complementação de solicitação.</span>
          <span>Fonte protocolar: ${institutionalEscape(protocolSources.join(' · ') || 'protocolo vigente')} · Última conferência: ${institutionalEscape(protocol.ultimaConferencia || '28/07/2026')}</span>
          ${practicalGuidance ? `<span>Camada prática anonimizada: versão 1.0 · atualização ${institutionalEscape(practicalGuidance.updatedAt || '03/08/2026')}</span>` : ''}
        </div>
      </footer>
    </article>`;

  const image = printArea.querySelector('.institutional-footer img');
  let printed = false;
  const triggerPrint = () => { if (!printed) { printed = true; window.setTimeout(() => window.print(), 120); } };
  if (image && !image.complete) {
    image.addEventListener('load', triggerPrint, { once: true });
    image.addEventListener('error', triggerPrint, { once: true });
    window.setTimeout(triggerPrint, 1800);
  } else triggerPrint();
}

document.addEventListener('click', (event) => {
  const button = event.target.closest('#printGuidanceButton');
  if (!button) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  const protocol = typeof state !== 'undefined' ? state.selected : null;
  printInstitutionalOrientation(protocol);
}, true);

window.printProtocol = printInstitutionalOrientation;
