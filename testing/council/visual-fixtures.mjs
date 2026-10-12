import {open} from './mobile-fixtures.mjs';
export function records(count){
 const types=['sugestao','reclamacao','elogio','denuncia'],statuses=['recebida','em_analise','aguardando_cidadao','encaminhada','aguardando_retorno','respondida','concluida','arquivada'];
 return Array.from({length:count},(_,i)=>({protocol:`CMS-2026-${String(i+1).padStart(6,'0')}`,subject:i%7===0?'Sugestão fictícia para organizar os horários e as informações do atendimento ao público de forma acessível e fácil de consultar':`Manifestação fictícia ${i+1} sobre informações ao público`,description:'Este relato é inteiramente sintético e não descreve pessoas, pacientes ou fatos reais. '.repeat(i%7===0?25:3),service:i%5===0?'Serviço municipal fictício de informações e orientação ao público':'Serviço municipal fictício',type:types[i%4],status:statuses[i%8],privacyMode:'anonima',authorLabel:'Identidade protegida',createdAt:new Date(Date.UTC(2026,9,12,12)-i*60000).toISOString(),updatedAt:new Date(Date.UTC(2026,9,12,13)-i*60000).toISOString()}));
}
export async function openVisual(root,{width=390,theme='light',count=253,slow=false,role='presidente',developer=false,seedOnce=false}={}){
 const scene=await open(root,width,theme,slow,role,{seedOnce,user:developer?{username:'desenvolvedor',role:'admin'}:{}}),items=records(count),messages=new Map(),notes=new Map();
 const requests=[],detailRequests=[],mutations=[];let tick=0,failNextList=false;
 await scene.context.route('**/api/council/**',async route=>{
  const request=route.request(),url=new URL(request.url()),method=request.method();requests.push({path:url.pathname,query:url.search,method,at:Date.now()});
  if(slow)await new Promise(resolve=>setTimeout(resolve,450));
  let data={},status=200;
  if(url.pathname==='/api/council/all'){
   if(failNextList){failNextList=false;return route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'Falha sintética de atualização.'})});}
   const offset=Number(url.searchParams.get('pageToken')||0);data={manifestations:items.slice(offset,offset+100),nextPageToken:offset+100<items.length?String(offset+100):''};
  }else if(url.pathname==='/api/council/my')data={manifestations:[]};
  else if(url.pathname==='/api/council/notifications')data={notifications:[]};
  else if(url.pathname==='/api/council/manifestations/delete'){
   const body=JSON.parse(request.postData());mutations.push({path:url.pathname,body});for(const protocol of body.protocols){const index=items.findIndex(item=>item.protocol===protocol);if(index>=0)items.splice(index,1);}data={deleted:body.protocols};
  }else{
   const match=url.pathname.match(/\/manifestations\/(CMS-\d{4}-\d{6})(?:\/(messages|internal-notes))?$/),protocol=match?.[1],item=items.find(item=>item.protocol===protocol);
   if(!item){status=404;data={error:'Manifestação sintética não encontrada.'};}
   else if(method==='GET'){detailRequests.push(protocol);data={manifestation:{...item},messages:messages.get(protocol)||[],internalNotes:notes.get(protocol)||[],events:[{type:'created',detail:'Criação inteiramente fictícia.',createdAt:item.createdAt}],attachments:[]};}
   else{const body=JSON.parse(request.postData());mutations.push({path:url.pathname,method,body});item.updatedAt=new Date(Date.UTC(2026,9,12,14)+ ++tick*1000).toISOString();
    if(method==='PATCH')item.status=body.status;
    else if(match[2]==='messages'){const list=messages.get(protocol)||[];list.push({senderType:'council',senderLabel:'Conselho fictício',body:body.body,createdAt:item.updatedAt});messages.set(protocol,list);}
    else{const list=notes.get(protocol)||[];list.push({authorLabel:'Responsável fictício',body:body.body,createdAt:item.updatedAt});notes.set(protocol,list);}
    data={ok:true,manifestation:{...item}};
   }
  }
  return route.fulfill({status,contentType:'application/json',body:JSON.stringify(data)});
 });
 return {...scene,items,requests,detailRequests,mutations,failList(){failNextList=true;}};
}
