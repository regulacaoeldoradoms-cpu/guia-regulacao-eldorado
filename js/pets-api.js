'use strict';
export class PetApi{
 constructor(auth){this.auth=auth;this.token=auth.getToken();this.closed=false;this.controller=new AbortController();}
 close(){this.closed=true;this.controller.abort();}
 valid(){return !this.closed&&this.token===this.auth.getToken();}
 async get(path){if(!this.valid())throw new Error('Sessão alterada.');const payload=await this.auth.api('/api/pets/'+path,{signal:this.controller.signal});if(!this.valid())throw new Error('Sessão alterada.');return payload;}
 async command(kind,input,options={}){
  const body=JSON.stringify({...input,operationId:crypto.randomUUID()});
  for(let attempt=0;attempt<2;attempt++){
   if(!this.valid())throw new Error('Sessão alterada.');
   try{
    const payload=await this.auth.api('/api/pets/'+kind,{method:'POST',body,...options,signal:this.controller.signal});
    if(!this.valid())throw new Error('Sessão alterada.');
    return payload;
   }catch(e){
    if(!this.valid()||attempt||e.status&&e.status<500)throw e;
    // Reuse the identical operation id on uncertain network/server failures.
   }
  }
 }
}
