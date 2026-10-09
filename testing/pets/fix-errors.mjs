import fs from 'node:fs';
const file=new URL('../../worker/pets.js',import.meta.url);let s=fs.readFileSync(file,'utf8');s=s.replace("return json(result,result.receipt.ok?200:result.receipt.status||409);","return json({...result,...(!result.receipt.ok?{code:result.receipt.code,error:result.receipt.error}: {})},result.receipt.ok?200:result.receipt.status||409);");fs.writeFileSync(file,s);
