import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
let sourcePromise;
export function syntheticProtocolSource() {
  if(!sourcePromise)sourcePromise=(async()=>{
    const source=await readFile(new URL('../../data/protocol-source.html',import.meta.url),'utf8');
    const literal=/const PROTOCOLOS\s*=\s*(\[[\s\S]*?\]);/.exec(source)?.[1];
    if(!literal)throw new Error('Protocol fixture structure not found');
    // Evaluate only the repository's data literal, never its scripts or HTML.
    const records=runInNewContext(`(${literal})`,Object.create(null),{timeout:1000});
    const clean=(value,key='',trail='')=>{
      if(Array.isArray(value))return value.map(item=>clean(item,key,trail));
      if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,clean(v,k,trail+'.'+k)]));
      if(typeof value!=='string')return value;
      if(['id','nome','categoria'].includes(key)||trail.includes('.sistemas.'))return value;
      const sentence=/exame|condicional/i.test(key)?'Exame fictício disponível somente para testar a interface. ':'Texto fictício de auditoria visual sem conteúdo assistencial. ';
      return sentence.repeat(Math.ceil(Math.max(sentence.length,value.length)/sentence.length)).slice(0,Math.max(sentence.length,value.length));
    };
    return '<!doctype html><meta charset="utf-8"><script>const PROTOCOLOS = '+JSON.stringify(clean(records))+';\nconst FOOTER_IMG = "";</script>';
  })();
  return sourcePromise;
}
