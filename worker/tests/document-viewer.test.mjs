import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../../js/document-viewer.js', import.meta.url), 'utf8');
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
function harness() {
  const observers = [], errors = [], busy = new Set();
  let rendered = 0;
  class Element {
    constructor() {
      this.children = []; this.dataset = {}; this.style = { setProperty() {} };
      this.classList = { add() {}, remove() {}, toggle() {} }; this.clientWidth = 800;
      this.width = 0; this.height = 0;
    }
    append(...children) { this.children.push(...children); }
    appendChild(child) { this.append(child); }
    replaceChildren(...children) { this.children = children; }
    setAttribute() {} removeAttribute() {} addEventListener() {} removeEventListener() {}
    getBoundingClientRect() { return {width:600,height:800,top:0,left:0,right:600,bottom:800}; }
  }
  class Observer {
    constructor(callback, options) { this.callback=callback;this.options=options;this.targets=[];observers.push(this); }
    observe(target) { this.targets.push(target); }
    disconnect() { this.targets=[]; }
    fire() { this.callback(this.targets.map(target=>({target,isIntersecting:true,intersectionRatio:1}))); }
  }
  const pdfjs = {
    GlobalWorkerOptions: {},
    getDocument({ data }) {
      const document = {
        numPages: data[0],
        async getPage() {
          await pause(8);
          return {
            getViewport: ({scale}) => ({width:595*scale,height:842*scale}),
            render({canvas}) {
              if (busy.has(canvas)) {errors.push('concurrent canvas');throw Error('concurrent canvas');}
              busy.add(canvas);
              let cancelled = false;
              const promise = pause(8).then(()=>{busy.delete(canvas);if(cancelled){const e=Error();e.name='RenderingCancelledException';throw e;}rendered++;});
              return {promise,cancel(){cancelled=true;}};
            }
          };
        }
      };
      return {promise:Promise.resolve(document),destroy:async()=>{}};
    }
  };
  const window = { devicePixelRatio:1,innerWidth:1200,innerHeight:900,setTimeout };
  const context = vm.createContext({window,document:{createElement:()=>new Element(),documentElement:{}},Blob,Uint8Array,ArrayBuffer,Promise,setTimeout,clearTimeout,IntersectionObserver:Observer,requestAnimationFrame:callback=>setTimeout(callback,0),pdfjs});
  vm.runInContext(source.replace('import(PDFJS_MODULE_URL)', 'Promise.resolve(pdfjs)'),context);
  const options = {root:new Element(),scrollRoot:new Element(),pagesRoot:new Element(),thumbnailsRoot:new Element(),pageCountLabel:new Element(),onError:()=>errors.push('viewer error')};
  return {viewer:window.PortalPdfViewer,options,observers,errors,get rendered(){return rendered;}};
}
function slowBlob(count) {
  const blob=new Blob([new Uint8Array([count])]);
  const read=blob.arrayBuffer.bind(blob);
  blob.arrayBuffer=async()=>{await pause(40);return read();};
  return blob;
}
test('late source resolution cannot replace a newer PDF',async()=>{
  const h=harness();
  const first=h.viewer.open(slowBlob(6),h.options);
  await pause(1);
  const second=h.viewer.open(new Uint8Array([2]),h.options);
  const [old,current]=await Promise.all([first,second]);
  assert.equal(old,null);assert.equal(current.pageCount,2);
  assert.equal(h.options.pagesRoot.children.length,2);h.viewer.close();
});
test('close invalidates an opening even before a session exists',async()=>{
  const h=harness();const pending=h.viewer.open(slowBlob(6),h.options);
  h.viewer.close();assert.equal(await pending,null);
  assert.equal(h.options.pagesRoot.children.length,0);
});
test('observers during getPage and rapid zoom serialize canvas ownership',async()=>{
  const h=harness();await h.viewer.open(new Uint8Array([3]),h.options);
  const observer=h.observers.find(o=>o.options?.rootMargin==='1200px 0px');
  observer.fire();observer.fire();
  await Promise.all([h.viewer.zoomIn(),h.viewer.zoomIn(),h.viewer.zoomOut(),h.viewer.fitWidth()]);
  await pause(100);
  assert.deepEqual(h.errors,[]);assert.ok(h.rendered>=3);
  assert.ok(h.options.pagesRoot.children[0].children[1].width>0);h.viewer.close();
});
test('duplicate thumbnail callbacks cannot render the same canvas concurrently',async()=>{
  const h=harness();await h.viewer.open(new Uint8Array([3]),h.options);
  const observer=h.observers.find(o=>o.options?.rootMargin==='360px 0px');
  observer.fire();observer.fire();await pause(100);
  assert.deepEqual(h.errors,[]);h.viewer.close();
});
