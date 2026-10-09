'use strict';
import {PetApi} from './pets-api.js';
import {PetRuntime} from './pets-runtime.js';
let current=null,running=null,epoch=0;
function clear(){epoch++;running?.api.close();running=null;current?.runtime.close();current?.api.close();current=null;window.PortalPets=null;}
async function mount(){
 const auth=window.RegulationAuth;if(!auth?.getToken?.())return;
 if(current?.api.valid())return current;
 if(running&&running.token!==auth.getToken())clear();
 if(running)return running.promise;
 const generation=epoch;
 const pending={token:auth.getToken(),api:new PetApi(auth),promise:null};
 pending.promise=(async()=>{
  const api=pending.api;
  try{
   const [payload,catalog]=await Promise.all([api.get('me'),api.get('catalog')]);
   if(generation!==epoch||!api.valid()){api.close();return;}
   if(!payload?.state||!Array.isArray(catalog?.types)||!Array.isArray(catalog?.items)){api.close();return;}
   if(!document.getElementById('petsStyles')){const css=document.createElement('link');css.id='petsStyles';css.rel='stylesheet';css.href='/css/pets.css?v=pets-v2';document.head.append(css);}
   const runtime=new PetRuntime(api,payload.state,s=>window.dispatchEvent(new CustomEvent('portal:pets-updated',{detail:{state:s}})));
   current={api,runtime,catalog};window.PortalPets=current;return current;
  }catch{api.close();}
 })().finally(()=>{if(running===pending)running=null;});
 running=pending;
 return pending.promise;
}
window.addEventListener('portal:session-cleared',clear);
window.addEventListener('portal:session-ready',()=>{if(current&&!current.api.valid())clear();mount();});
export async function petSession(){await mount();return current;}
mount();
