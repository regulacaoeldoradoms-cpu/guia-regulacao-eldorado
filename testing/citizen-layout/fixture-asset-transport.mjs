// Real local TCP resets, real browser styles and the same fetch used by Pets.
import assert from 'node:assert/strict';import http from 'node:http';
import {chromium} from '../browser/node_modules/playwright/index.mjs';
import {fetchFixtureAsset} from './fixture-asset-fetch.mjs';
const requests=new Map(),errors=[];
const server=http.createServer((req,res)=>{const p=new URL(req.url,'http://localhost').pathname;requests.set(p,(requests.get(p)||0)+1);
 if(p==='/temporary.css'&&requests.get(p)===1||p==='/persistent.css'){req.socket.destroy();return;}
 if(p==='/http.css'){res.writeHead(503,{'Content-Type':'text/css'});res.end('Unavailable');return;}
 if(p.endsWith('.css')){res.writeHead(200,{'Content-Type':'text/css'});res.end('body { color: rgb(17, 34, 51); }');return;}
 res.writeHead(200,{'Content-Type':'text/html'});res.end('<!doctype html><link rel="stylesheet" href="/'+p.slice(1)+'.css"><p>Transport fixture</p>');
});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium'}),context=await browser.newContext(),page=await context.newPage();
try{
 await context.route('**/*.css',async route=>{try{const r=await fetchFixtureAsset(route);await route.fulfill({response:r});}catch(e){errors.push({path:new URL(route.request().url()).pathname,message:e.message});await route.abort();}});
 const origin='http://127.0.0.1:'+server.address().port;
 await page.goto(origin+'/temporary');assert.equal(await page.locator('body').evaluate(n=>getComputedStyle(n).color),'rgb(17, 34, 51)');assert.equal(requests.get('/temporary.css'),2);assert.deepEqual(errors,[]);
 await page.goto(origin+'/persistent');assert.equal(requests.get('/persistent.css'),2);assert.equal(errors.length,1);assert.match(errors[0].message,/ECONNRESET|socket hang up/);
 await page.goto(origin+'/http');assert.equal(requests.get('/http.css'),1);assert.equal(errors.length,1);
 console.log(JSON.stringify({temporaryResetRealStyles:true,persistentResetStillFails:true,httpErrorNotRetried:true,passed:true}));
}finally{await browser.close();await new Promise(r=>server.close(r));}
