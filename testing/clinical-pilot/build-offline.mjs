// Use the esbuild version pinned by the already-installed official Wrangler.
// No Wrangler CLI, dotenv, credentials, remote bindings, or network calls.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const root = fileURLToPath(new URL('../../', import.meta.url));
const installed = process.env.CLINICAL_PILOT_WRANGLER;
if (!installed) throw new Error('Informe CLINICAL_PILOT_WRANGLER com o pacote oficial já instalado.');
const packageJson = JSON.parse(fs.readFileSync(path.join(installed, 'package.json'), 'utf8'));
assert.equal(packageJson.name, 'wrangler'); assert.equal(packageJson.version, '4.135.0');
const modules = path.dirname(installed), esbuildSource = path.join(modules, 'esbuild'), binarySource = path.join(modules, '@esbuild/win32-x64');
const esbuildJson = JSON.parse(fs.readFileSync(path.join(esbuildSource, 'package.json'), 'utf8'));
assert.equal(esbuildJson.version, packageJson.dependencies.esbuild);
const localModules = path.join(root, '.local/clinical-build-deps/node_modules');
for (const [from, to] of [[esbuildSource, path.join(localModules, 'esbuild')], [binarySource, path.join(localModules, '@esbuild/win32-x64')]]) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.cpSync(from, to, { recursive: true, force: true });
}
const require = createRequire(import.meta.url), esbuild = require(path.join(localModules, 'esbuild'));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const dir = path.join(root, '.local/clinical-pilots-build'); fs.mkdirSync(dir, { recursive: true });
const report = { wranglerVersion: packageJson.version, esbuildVersion: esbuild.version, dependencySource: installed, sourceWorktreeWrites: false, networkCalls: 0, credentialsRead: false, builds: [] };
// Native Go directory traversal reaches sandbox-protected ancestors on Windows.
// Supply only the checked-out module graph through Node's allowed file reads.
const graph = { name: 'workspace-only-graph', setup(build) {
  build.onResolve({ filter: /.*/ }, args => {
    if (/^(cloudflare:|node:)/.test(args.path)) return { path: args.path, external: true };
    if (args.kind !== 'entry-point' && !args.path.startsWith('.')) throw new Error('Dependência externa inesperada: ' + args.path);
    const file = path.resolve(args.importer ? path.dirname(args.importer) : root, args.path);
    if (!file.startsWith(path.resolve(root) + path.sep)) throw new Error('Importação fora do checkout: ' + args.path);
    return { path: file, namespace: 'workspace-only' };
  });
  build.onLoad({ filter: /.*/, namespace: 'workspace-only' }, args => ({ contents: fs.readFileSync(args.path, 'utf8'), loader: args.path.endsWith('.json') ? 'json' : 'js' }));
} };
for (const name of ['index', 'gemini-assistant']) {
  const output = path.join(dir, name + '.mjs');
  const result = await esbuild.build({ absWorkingDir: root, entryPoints: ['worker/' + name + '.js'], outfile: output, bundle: true, write: false, metafile: true, platform: 'browser', format: 'esm', target: 'es2022', external: ['cloudflare:*', 'node:*'], plugins: [graph], tsconfigRaw: {}, logLevel: 'silent' });
  fs.writeFileSync(output, result.outputFiles[0].contents);
  const records = Object.keys(result.metafile.inputs).filter(p => p.replaceAll('\\', '/').includes('/data/clinical-conditions/'));
  assert.equal(records.length, 3);
  report.builds.push({ entry: 'worker/' + name + '.js', bytes: result.outputFiles[0].contents.length, sha256: sha(result.outputFiles[0].contents), records, imports: Object.values(result.metafile.outputs).flatMap(value => value.imports) });
}
const { default: bundledAi } = await import(pathToFileURL(path.join(dir, 'gemini-assistant.mjs')).href);
const record = JSON.parse(fs.readFileSync(path.join(root, 'data/clinical-conditions/dor-no-ombro-20261016.json'), 'utf8'));
let prompt = '', calls = 0;
const request = new Request('https://local.invalid/api/ia', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: 'Quais exames para dor no ombro?', protocols: [{ id: record.id, clinicalConditionId: record.id, clinicalConditionRecord: { revision: record.revision }, clinicalAge: null }] }) });
const response = await bundledAi.fetch(request, { AI_PROVIDER: 'cloudflare', CLOUDFLARE_AI_FALLBACK_ENABLED: 'true', AI: { run: async (model, input) => { calls++; prompt = input.messages[1].content; return { response: 'Provedor estritamente simulado.' }; } } });
assert.equal(response.status, 200); assert.equal(calls, 1);
const hydrated = JSON.parse(prompt.split('PROTOCOLOS MAIS RELEVANTES:\n')[1].split('\n\nCATÁLOGO OPERACIONAL RESUMIDO:')[0]);
assert.deepEqual(hydrated[0].clinicalConditionRecord, record);
report.bundledApiSimulation = { status: 200, mockCalls: calls, completeCanonicalRecord: true };
const canonical = fs.readdirSync(path.join(root, 'data/clinical-conditions')).filter(name => name.endsWith('.json')).map(name => JSON.parse(fs.readFileSync(path.join(root, 'data/clinical-conditions', name), 'utf8')));
const probe = await bundledAi.fetch(new Request('https://local.invalid/api/ia', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ clinicalConditionProbe: canonical.map(record => record.id) }) }), {});
assert.equal(probe.status, 200); assert.deepEqual((await probe.json()).records, canonical); assert.equal(calls, 1);
report.bundledCompatibilityProbe = { status: 200, records: canonical.length, providerCalls: 0, allCanonicalRecordsEqual: true };
report.passed = true;
const destination = path.resolve(process.argv[2] || path.join(dir, 'build-verification.json'));
fs.mkdirSync(path.dirname(destination), { recursive: true }); fs.writeFileSync(destination, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report));
