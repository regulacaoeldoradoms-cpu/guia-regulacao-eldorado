'use strict';

const INSTITUTIONAL_IMAGE = 'https://i.ibb.co/fd23T1tv/logo-agenda.png';
const institutionalArray = (value) => Array.isArray(value) ? value : (value ? [value] : []);
const institutionalEscape = (value) => (value ?? '').toString().replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));

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
