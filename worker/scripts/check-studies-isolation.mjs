// Detector textual: conserva os padrões/arquivos da CI; não substitui testes de autorização.
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const PC_FILE = 'worker/studies-content/banking-products-credit-v1.js';
export const FIXED_FILES = [
  'worker/studies.js', 'worker/study-rounds.js', 'worker/study-assessments.js',
  'js/studies.js', 'js/studies-reader.js', 'js/studies-clock.js', 'estudos/index.html'
];
const CONTENT_DIRS = ['worker/studies-content', 'worker/studies-assessment-content'];
// Mesmo conjunto de termos. Limites ASCII são conservadores junto a letras Unicode.
const CLINICAL = /\b(CNS|CPF|prontu[aá]rio|paciente|patient|diagn[oó]stico|encaminhamento|CORE)\b/giu;
const INSTITUTIONAL = /firebase|firestore|google_drive|document_drive|telemedicina/giu;

// Somente seis campos editoriais revisados (#565, 4deec466). Hash do texto completo,
// caminho semântico e ocorrência única: uma edição/duplicação não herda a autorização.
export const REVIEWED_FIELDS = [
  ['banking.pc.pessoas', 'perguntas', 'body', '01555f0a7d53734cdf1dde6de9fe6cab21073aaec4e570dd7cb8be10d2650ae6'],
  ['banking.pc.pessoas', 'excecoes', 'body', '202c6bb0c289d0b85afbf6b31b6a2ee181191ae77e6815b14a12cacdb41dfde7'],
  ['banking.pc.pessoas', 'resumo', 'body', '96e4e771efa60e120dcaa2ab43a1c34ae57eb4afd40c77c58d059aa65b7b66e9'],
  ['banking.pc.acompanhamento', 'glossario', 'body', '3d0ff03492bc903589d41d155bd98906fef9e3bf6e173827845cd30da649a3ed'],
  ['banking.pc.boss', 'recuperacao', 'heading', '8f09d81b4985d9611760ecff9d9f1db6b8d1d06ad4bcba4a3e7f285d44674196'],
  ['banking.pc.boss', null, 2, '104f0bfbd270123cb3ea87ec84a3678a30395289e22afcefbff9766dc5d3144e']
];

function reviewedRanges(file, text) {
  if (file !== PC_FILE) return [];
  // Aceita apenas o módulo de dados JSON gerado, sem importar/executar seu código.
  const parts = text.match(/^\/\/[^\n]*\n\/\/[^\n]*\nexport const PC_MISSIONS = Object\.freeze\(([\s\S]*?)\);\nexport const PC_SOURCES = Object\.freeze\(([\s\S]*?)\);\n?$/);
  if (!parts) return [];
  let missions;
  try {
    missions = JSON.parse(parts[1]);
    JSON.parse(parts[2]);
    if (!Array.isArray(missions) || JSON.stringify(missions, null, 2) !== parts[1]) return [];
  } catch { return []; }
  const ranges = [];
  for (const [missionId, sectionId, field, hash] of REVIEWED_FIELDS) {
    const selected = missions.filter(m => m?.id === missionId);
    if (selected.length !== 1) continue;
    const mission = selected[0];
    const sections = Array.isArray(mission.sections) ? mission.sections.filter(s => s?.id === sectionId) : [];
    const value = sectionId === null ? mission.recall?.[field]
      : sections?.length === 1 ? sections[0][field] : null;
    if (typeof value !== 'string' || createHash('sha256').update(value).digest('hex') !== hash) continue;
    const encoded = JSON.stringify(value);
    const start = text.indexOf(encoded);
    if (start < 0 || text.indexOf(encoded, start + 1) !== -1) continue;
    ranges.push([start, start + encoded.length]);
  }
  return ranges;
}

export function scanStudiesIsolation(files) {
  const issues = [];
  for (const [file, raw] of files) {
    const text = raw.replace(/\r\n/g, '\n');
    const allowed = reviewedRanges(file, text);
    for (const [rule, pattern] of [['clinical-term', CLINICAL], ['institutional-dependency', INSTITUTIONAL]]) {
      if (rule === 'institutional-dependency' && !file.startsWith('worker/')) continue;
      for (const match of text.matchAll(pattern)) {
        if (rule === 'clinical-term' && allowed.some(([start, end]) => match.index >= start && match.index + match[0].length <= end)) continue;
        issues.push({ file, rule, term: match[0], line: text.slice(0, match.index).split('\n').length });
      }
    }
  }
  return issues;
}

export function collectStudyFiles(root) {
  const files = [...FIXED_FILES];
  for (const dir of CONTENT_DIRS) {
    const names = readdirSync(resolve(root, dir)).filter(name => name.endsWith('.js')).sort();
    if (!names.length) throw new Error('Diretório de conteúdo vazio: ' + dir);
    files.push(...names.map(name => dir + '/' + name));
  }
  return files.map(file => [file, readFileSync(resolve(root, file), 'utf8')]);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const issues = scanStudiesIsolation(collectStudyFiles(process.cwd()));
  for (const issue of issues) console.error(issue.file + ':' + issue.line + ' ' + issue.rule + ': ' + issue.term);
  if (issues.length) process.exitCode = 1;
  else console.log('Isolamento textual: aprovado.');
}
