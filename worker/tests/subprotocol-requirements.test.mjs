import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const repositoryRoot = new URL('../../', import.meta.url);

function read(path) {
  return fs.readFileSync(new URL(path, repositoryRoot), 'utf8');
}

function protocolArray(source) {
  const start = source.indexOf('const PROTOCOLOS');
  assert.notEqual(start, -1, 'base de protocolos não localizada');
  const arrayStart = source.indexOf('[', start);
  const endings = ['];\n  const FOOTER_IMG', '];\r\n  const FOOTER_IMG', '];\nconst FOOTER_IMG', '];\r\nconst FOOTER_IMG'];
  const positions = endings.map((ending) => source.indexOf(ending, arrayStart)).filter((position) => position >= 0);
  assert.ok(positions.length, 'fim da base de protocolos não localizado');
  return JSON.parse(source.slice(arrayStart, Math.min(...positions) + 1));
}

const fieldMappings = [
  ['quandoSolicitar', 'quando'],
  ['informacoesObrigatorias', 'obrigatorias'],
  ['examesObrigatorios', 'examesObrigatorios'],
  ['examesCondicionais', 'condicionais'],
  ['complementares', 'complementares']
];

test('audita todos os protocolos com requisitos distribuídos em subprotocolos', () => {
  const protocols = protocolArray(read('data/protocol-source.html'));
  const affected = protocols.filter((protocol) => Array.isArray(protocol.subprotocolos) && protocol.subprotocolos.length)
    .filter((protocol) => fieldMappings.some(([parentField, childField]) => {
      const parentEmpty = !Array.isArray(protocol[parentField]) || protocol[parentField].length === 0;
      const childHasContent = protocol.subprotocolos.some((subprotocol) => Array.isArray(subprotocol?.[childField]) && subprotocol[childField].length > 0);
      return parentEmpty && childHasContent;
    }));

  assert.ok(affected.some((protocol) => protocol.nome === 'Endocrinologia Adulto'));
  assert.ok(affected.length >= 1);
  console.log(`Protocolos com requisitos no subprotocolo e campo geral vazio (${affected.length}): ${affected.map((protocol) => protocol.nome).join(' | ')}`);
});

test('interface remove somente o card geral vazio quando o conteúdo existe nos subprotocolos', () => {
  const source = read('js/referral-workbench.js');
  assert.match(source, /function removeRedundantParentBlocks/);
  assert.match(source, /\['protocolMandatoryExams', 'examesObrigatorios', 'examesObrigatorios'\]/);
  assert.match(source, /\['protocolConditionalExams', 'examesCondicionais', 'condicionais'\]/);
  assert.match(source, /if \(arr\(protocol\?\.\[parentField\]\)\.length\) return;/);
  assert.match(source, /officialSubprotocols\.some\(\(subprotocol\) => arr\(subprotocol\?\.\[childField\]\)\.length\)/);
});

test('ponte da IA não interpreta campo geral vazio como ausência de exames', async () => {
  let captured = null;
  const endpoint = 'https://example.test/api/ia';
  const context = {
    TextEncoder,
    JSON,
    String,
    Array,
    Object,
    window: {
      REGULATION_AI_CONFIG: { endpoint },
      fetch: async (_input, init) => {
        captured = JSON.parse(init.body);
        return { ok: true };
      }
    }
  };
  vm.createContext(context);
  vm.runInContext(read('js/pre-regulation-bridge.js'), context, { filename: 'js/pre-regulation-bridge.js' });

  const request = {
    question: 'quais exames são necessários para endocrinologia?',
    originalQuestion: 'quais exames são necessários para endocrinologia?',
    protocols: [{
      id: 'endocrinologia',
      nome: 'Endocrinologia Adulto',
      examesObrigatorios: [],
      examesCondicionais: [],
      subprotocolos: [
        {
          titulo: 'Diabetes Mellitus',
          criterios: ['Diabetes de difícil controle'],
          informacoesObrigatorias: [],
          examesObrigatorios: ['Creatinina sérica', 'Glicemia de jejum', 'HbA1c'],
          examesCondicionais: ['Potássio se hipertensão'],
          recomendadosQuandoDisponiveis: []
        },
        {
          titulo: 'Tireoidopatias',
          criterios: ['Hipertireoidismo clínico ou subclínico'],
          informacoesObrigatorias: [],
          examesObrigatorios: ['TSH', 'T4 livre'],
          examesCondicionais: ['TRAB na suspeita de hipertireoidismo'],
          recomendadosQuandoDisponiveis: []
        }
      ],
      praticaRegulatoria: null,
      fontes: ['Protocolo de Acesso aos Serviços de Teleatendimentos do Núcleo de Telessaúde MS — 2025']
    }],
    catalog: [],
    history: []
  };

  await context.window.fetch(endpoint, { method: 'POST', body: JSON.stringify(request) });

  assert.ok(captured);
  assert.equal(captured.contextCompression, 'pre_regulation_compact_v3');
  assert.match(captured.question, /campo geral vazio não significa ausência de requisitos/i);
  assert.match(captured.protocols[0].examesObrigatorios[0], /há exames obrigatórios definidos por condição clínica/i);
  assert.equal(captured.protocols[0].subprotocolos[0].titulo, 'Diabetes Mellitus');
  assert.deepEqual(captured.protocols[0].subprotocolos[0].examesObrigatorios, ['Creatinina sérica', 'Glicemia de jejum', 'HbA1c']);
});
