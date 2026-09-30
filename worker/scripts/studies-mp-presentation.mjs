// Conversão de apresentação em tempo de preparo; não interpreta Markdown no navegador.
// Aceita somente os formatos efetivamente presentes no pacote revisado e falha nos demais.
export function compilePresentation(text, resolveLesson) {
  const blocks = [];
  const parts = String(text).split(/(```mermaid\n[\s\S]*?\n```)/g);
  for (const part of parts) {
    if (part.startsWith('```mermaid\n')) {
      blocks.push(diagram(part.slice(11, -4)));
      continue;
    }
    if (part.includes('```')) throw new Error('Formato de código não previsto na apresentação MP');
    for (const paragraph of part.split(/\n\s*\n/).filter(value => value.trim())) {
      if (paragraph.startsWith('|')) {
        const rows = paragraph.trim().split('\n').map(line => line.trim().slice(1, -1).split('|').map(cell => cell.trim()));
        const [headers, separator, ...values] = rows;
        if (!separator?.every(cell => /^:?-+:?$/.test(cell)) || !values.length || rows.some(row => row.length !== headers.length)) {
          throw new Error('Tabela MP inválida');
        }
        blocks.push({ type: 'table', headers, rows: values });
      } else {
        const runs = [];
        let cursor = 0;
        for (const match of paragraph.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)) {
          if (match.index > cursor) runs.push({ text: paragraph.slice(cursor, match.index) });
          const target = resolveLesson(match[2]);
          if (!target) throw new Error(`Link de aula não resolvido: ${match[2]}`);
          runs.push({ text: match[1], ...target });
          cursor = match.index + match[0].length;
        }
        if (cursor < paragraph.length) runs.push({ text: paragraph.slice(cursor) });
        blocks.push({ type: 'paragraph', runs });
      }
    }
  }
  // Nas três curvas revisadas, o gráfico e a tabela devem continuar equivalentes.
  for (const chart of blocks.filter(block => block.type === 'line-chart')) {
    const table = blocks.find(block => block.type === 'table');
    if (!table || JSON.stringify(table.rows.map(row => row.map(Number))) !== JSON.stringify(chart.x.map((x, i) => [x, chart.y[i]]))) {
      throw new Error('Curva e tabela MP divergentes');
    }
  }
  return blocks;
}

function diagram(source) {
  const lines = source.trim().split('\n').map(line => line.trim());
  if (lines[0] === 'xychart-beta') {
    const title = lines[1]?.match(/^title "([^"]+)"$/);
    const x = lines[2]?.match(/^x-axis "([^"]+)" \[([\d., ]+)\]$/);
    const y = lines[3]?.match(/^y-axis "([^"]+)" (\d+) --> (\d+)$/);
    const values = lines[4]?.match(/^line \[([\d., ]+)\]$/);
    if (lines.length !== 5 || !title || !x || !y || !values) throw new Error('Curva MP não suportada');
    const chart = { type: 'line-chart', title: title[1], xLabel: x[1], yLabel: y[1],
      x: x[2].split(',').map(Number), y: values[1].split(',').map(Number), yMin: Number(y[2]), yMax: Number(y[3]) };
    if (chart.x.length < 2 || chart.x.length !== chart.y.length || chart.yMin >= chart.yMax
      || chart.x.some((value, i) => !Number.isFinite(value) || (i > 0 && value <= chart.x[i - 1]))
      || chart.y.some(value => !Number.isFinite(value) || value < chart.yMin || value > chart.yMax)) throw new Error('Coordenadas MP inválidas');
    return chart;
  }
  if (lines[0] === 'flowchart LR') {
    const nodes = new Map();
    const edges = lines.slice(1).map(line => {
      const match = line.match(/^([A-Z])(?:\["([^"]+)"\])? -->\|"([^"]+)"\| ([A-Z])(?:\["([^"]+)"\])?$/);
      if (!match) throw new Error('Fluxo MP não suportado');
      if (match[2]) nodes.set(match[1], match[2]);
      if (match[5]) nodes.set(match[4], match[5]);
      return { from: match[1], to: match[4], label: match[3] };
    });
    if (!edges.length || edges.some(edge => !nodes.has(edge.from) || !nodes.has(edge.to))) throw new Error('Participante MP ausente');
    return { type: 'flow', edges: edges.map(edge => ({ from: nodes.get(edge.from), to: nodes.get(edge.to), label: edge.label })) };
  }
  throw new Error('Diagrama MP não suportado');
}
