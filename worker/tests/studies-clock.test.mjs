import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../../js/studies-clock.js', import.meta.url), 'utf8');
const scope = { window: {} };
vm.runInNewContext(source, scope);
const { createAccumulator, create } = scope.window.StudyClock;
const settle = () => new Promise(resolve => setImmediate(resolve));
function harness(send = async (id, seconds) => ({ sessionId: id, durationSeconds: seconds, checkpointed: true, timeProtocol: 1, finished: false })) {
  let milliseconds = 0;
  const nodes = Object.fromEntries(['studyTimer','studyTimerStatus','studyTimeSync','pauseStudy'].map(id => [id, {
    textContent: '', disabled: false, attributes: {}, callbacks: {},
    setAttribute(key, value) { this.attributes[key] = value; },
    addEventListener(key, callback) { this.callbacks[key] = callback; }
  }]));
  const doc = { hidden: false, callbacks: {}, addEventListener(key, callback) { this.callbacks[key] = callback; } };
  let number = 0; const intervals = new Map();
  const win = { callbacks: {}, addEventListener(key, callback) { this.callbacks[key] = callback; },
    setInterval(fn) { const id = ++number; intervals.set(id, fn); return id; },
    clearInterval(id) { intervals.delete(id); }, setTimeout, clearTimeout };
  doc.defaultView = win;
  const root = { ownerDocument: doc, querySelector: id => nodes[id.slice(1)] };
  const controller = create({ root, send, now: () => milliseconds });
  const tick = (amount = 1000) => { milliseconds += amount; for (const fn of intervals.values()) fn(); };
  return { nodes, doc, win, controller, tick, intervals,
    hidden(value) { doc.hidden = value; doc.callbacks.visibilitychange(); } };
}

test('acumulador conta apenas os intervalos habilitados', () => {
  let time = 0; const timer = createAccumulator(() => time);
  time += 1000; assert.equal(timer.sample(),0);
  timer.setRunning(true); time += 2000; assert.equal(timer.sample(),2);
  timer.setRunning(false); time += 60000; assert.equal(timer.sample(),2);
  timer.setRunning(true); time += 1000; assert.equal(timer.stop(),3);
  time += 1000; timer.setRunning(true); assert.equal(timer.sample(),3);
});

test('suspensão longa e relógio retrocedendo não inventam minutos', () => {
  let now=0;const clock=createAccumulator(()=>now);clock.setRunning(true);
  now=2000;assert.equal(clock.sample(),2);
  now=362000;assert.equal(clock.sample(),2);
  now=361000;assert.equal(clock.sample(),2);
  now=362000;assert.equal(clock.sample(),3);
});

test('milissegundos parciais se acumulam sem arredondar para cima', () => {
  let now=0;const clock=createAccumulator(()=>now);clock.setRunning(true);
  now=600;assert.equal(clock.sample(),0);clock.setRunning(false);
  now=800;clock.setRunning(true);now=1200;assert.equal(clock.sample(),1);
});

test('teto de seis horas não exige interação nem cria recompensa', () => {
  let now=0;const clock=createAccumulator(()=>now);clock.setRunning(true);
  for(let i=0;i<21610;i++){now+=1000;clock.sample();}
  assert.equal(clock.stop(),21600);
  assert.doesNotMatch(source,/localStorage|sessionStorage|sendBeacon|study_xp|study_attempts|\/complete/);
});

test('página antiga ou módulo sem dependências tem fallback nulo', () => {
  assert.equal(create(),null);
  assert.equal(create({ root: { ownerDocument: {}, querySelector: () => null }, send(){} }),null);
});

test('checkpoint aos 30 s preserva sessão aberta e transmite só ID e total', async () => {
  const sent=[];const h=harness(async(id,seconds)=>{sent.push([id,seconds]);return {sessionId:id,durationSeconds:seconds,checkpointed:true,timeProtocol:1};});
  h.controller.start('one',true);
  for(let i=0;i<29;i++)h.tick(); await settle();assert.equal(sent.length,0);
  h.tick();await settle();assert.deepEqual(sent,[['one',30]]);
  assert.equal(h.controller.snapshot().savedSeconds,30);assert.equal(h.intervals.size,1);
  h.controller.stop();assert.equal(h.intervals.size,0);
});

test('aba oculta pausa e voltar não soma tempo escondido', async () => {
  const h=harness();h.controller.start('one',true);h.tick();h.tick();
  h.hidden(true);await settle();h.tick(60000);
  assert.equal(h.controller.snapshot().durationSeconds,2);
  h.hidden(false);h.tick();assert.equal(h.controller.snapshot().durationSeconds,3);
  h.controller.stop();
});

test('pausa manual permanece ao esconder e reabrir a aula', async () => {
  const h=harness();h.controller.start('one',true);h.tick();h.controller.pause(true);
  await settle();h.hidden(true);h.tick(60000);h.hidden(false);h.tick();
  assert.equal(h.controller.snapshot().durationSeconds,1);
  assert.equal(h.nodes.pauseStudy.attributes['aria-pressed'],'true');
  h.controller.pause(false);h.tick();assert.equal(h.controller.stop().durationSeconds,2);
});

test('pagehide/pageshow não conta o intervalo e não encerra a rodada', async () => {
  const h=harness();h.controller.start('one',true);h.tick();
  h.win.callbacks.pagehide();await settle();h.tick(60000);
  h.win.callbacks.pageshow();h.tick();assert.equal(h.controller.stop().durationSeconds,2);
});

test('falha de rede não é apresentada como salvamento, depois recupera cumulativamente', async () => {
  let fail=true;const sent=[];const h=harness(async(id,seconds)=>{
    sent.push(seconds);if(fail)throw new Error('offline');
    return {sessionId:id,durationSeconds:seconds,checkpointed:true,timeProtocol:1};
  });
  h.controller.start('one',true);h.tick();h.controller.pause(true);await settle();
  assert.equal(h.controller.snapshot().savedSeconds,0);
  assert.match(h.nodes.studyTimeSync.textContent,/não confirmado/);
  fail=false;h.win.callbacks.online();await settle();assert.equal(h.controller.snapshot().savedSeconds,1);
  assert.deepEqual(sent,[1,1]);h.controller.stop();
});

test('resposta antiga de checkpoint não modifica a próxima sessão', async () => {
  let resolve;const h=harness(()=>new Promise(done=>{resolve=done;}));
  h.controller.start('old',true);h.tick();h.controller.pause(true);await settle();
  h.controller.stop();h.controller.start('new',true);
  resolve({sessionId:'old',durationSeconds:1,checkpointed:true,timeProtocol:1});await settle();
  assert.equal(h.controller.snapshot().sessionId,'new');assert.equal(h.controller.snapshot().savedSeconds,0);
  assert.equal(h.nodes.studyTimer.textContent,'00:00');h.controller.stop();
});

test('requisição em voo coalesce total mais recente, sem somar incrementos', async () => {
  let release;const sent=[];const h=harness((id,seconds)=>{
    sent.push(seconds);if(sent.length===1)return new Promise(resolve=>{release=()=>resolve({sessionId:id,durationSeconds:seconds,checkpointed:true,timeProtocol:1});});
    return Promise.resolve({sessionId:id,durationSeconds:seconds,checkpointed:true,timeProtocol:1});
  });
  h.controller.start('one',true);h.tick();h.controller.flush();await settle();
  h.tick();h.controller.flush();await settle();assert.deepEqual(sent,[1]);
  release();await settle();await settle();assert.deepEqual(sent,[1,2]);
  assert.equal(h.controller.snapshot().savedSeconds,2);h.controller.stop();
});

test('servidor antigo e resposta sem protocolo não geram falsa confirmação', async () => {
  let calls=0;const h=harness(async()=>{calls++;return {finished:true};});
  h.controller.start('old-server',false);for(let i=0;i<31;i++)h.tick();await settle();
  assert.equal(calls,0);assert.match(h.nodes.studyTimeSync.textContent,/indisponível/);
  h.controller.start('new-server',true);h.tick();await h.controller.flush();
  assert.equal(h.controller.snapshot().savedSeconds,0);assert.match(h.nodes.studyTimeSync.textContent,/não confirmado/);
  h.controller.stop();
});
