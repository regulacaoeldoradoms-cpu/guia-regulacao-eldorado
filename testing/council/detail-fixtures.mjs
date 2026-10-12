import {createHash} from 'node:crypto';import {openVisual} from './visual-fixtures.mjs';
export async function openDetails(root,options={}){
 const scene=await openVisual(root,{count:253,slow:false,...options}),reads=[],pending=new Map(),views=[];let failure=null,version=0,transferred=0;
 const role=options.role||'presidente',capability=options.capability!==false,throughput=options.throughput||Infinity,rtt=options.rtt||0;
 const snapshot=protocol=>{
  const source=scene.items.find(item=>item.protocol===protocol);if(!source)return null;
  const manifestation={...source};if(options.longMessages)manifestation.description='Relato inteiramente fictício para medir somente a transferência. '.repeat(50);
  const payload={manifestation,messages:Array.from({length:options.longMessages?50:3},(_,index)=>({senderType:'citizen',senderLabel:'Pessoa fictícia',body:'Mensagem inteiramente sintética. '.repeat(options.longMessages?80:2),createdAt:manifestation.createdAt,id:'m'+index})),events:[{type:'created',detail:'Criação inteiramente sintética.',createdAt:manifestation.createdAt}],internalNotes:[{id:'n1',body:'Nota interna sintética '+version,authorLabel:'Responsável fictício'}],attachments:[{id:'a1',displayName:'Documento fictício.pdf'}]};
  if(role==='membro'){manifestation.privacyMode='anonima';delete manifestation.authorIdentity;delete manifestation.authorUsername;manifestation.authorLabel='Manifestante anônimo';payload.internalNotes=[];payload.attachments=[];payload.accessPolicy={readOnly:true,canInteract:false,canIdentifyAuthor:false,canViewAttachments:false,canViewInternalNotes:false};}
  return payload;
 };
 await scene.context.route('**/api/council/**',async route=>{
  const url=new URL(route.request().url());if(url.pathname==='/api/council/config')return route.fulfill({json:{detailPrefetch:capability}});
  const match=url.pathname.match(/^\/api\/council\/manifestations\/(CMS-\d{4}-\d{6})(?:\/prefetch)?$/);if(!match||route.request().method()!=='GET')return route.fallback();
  const protocol=match[1],prefetch=url.pathname.endsWith('/prefetch'),started=Date.now();
  const record={protocol,prefetch,query:url.search,started,bytes:0};reads.push(record);if(!prefetch)views.push(protocol);
  const hold=pending.get(protocol);if(hold)await hold.promise;
  if(failure&&(failure.mode==='all'||failure.mode===(prefetch?'prefetch':'open')))return route.fulfill({status:failure.status,json:{error:'Falha inteiramente sintética.'}});
  const payload=snapshot(protocol);if(!payload)return route.fulfill({status:404,json:{error:'Caso sintético não encontrado.'}});
  const detailRevision=createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  const data=url.searchParams.get('cacheRevision')===detailRevision?{notModified:true,detailRevision,protocol}:{...payload,detailRevision};const body=JSON.stringify(data);
  record.bytes=Buffer.byteLength(body);await new Promise(resolve=>setTimeout(resolve,rtt+record.bytes/throughput*1000));record.finished=Date.now();transferred+=record.bytes;
  try{await route.fulfill({contentType:'application/json',body});}catch(error){if(!route.request().failure()&&!scene.context.isClosed?.())throw error;}
 });
 return {...scene,reads,views,snapshot,change(){version++;},fail(mode,status=503){failure={mode,status};},recover(){failure=null;},hold(protocol){let release;const promise=new Promise(resolve=>release=resolve);pending.set(protocol,{promise});return()=>{pending.delete(protocol);release();};},get transferred(){return transferred;}};
}
