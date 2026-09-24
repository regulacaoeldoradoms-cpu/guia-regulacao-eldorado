import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
const source=process.argv[2]||'test-results-dark-audit/results.json';
const result=JSON.parse(await readFile(source,'utf8'));
const rows=[];
const walk=async suites=>{for(const suite of suites||[]){for(const spec of suite.specs||[])for(const test of spec.tests||[])for(const run of test.results||[]){
  const states=[],comparisons=[]; let network=null;
  for(const attachment of run.attachments||[]){
    if(!attachment.name.endsWith('.json'))continue;
    const payload=attachment.body?Buffer.from(attachment.body,'base64'):attachment.path?await readFile(attachment.path):null;
    if(!payload)continue;
    const data=JSON.parse(payload);
    if(attachment.name==='network-coverage.json')network=data;
    else if(Array.isArray(data.snapshot))states.push({name:attachment.name,route:data.url,theme:data.theme,media:data.media,visibleElements:data.visibleElementCount,pseudoElements:data.visiblePseudoElementCount||0,syntheticNarrativeNodes:data.syntheticNarrativeNodes||0,bright:data.bright,allowed:data.allowed,contrast:data.contrast});
    else if(data.baseCommit&&Array.isArray(data.differences))comparisons.push({name:attachment.name,route:data.route,theme:data.theme,media:data.media,baseCommit:data.baseCommit,diffScope:data.diffScope,productChanges:data.productChanges,servedCurrentFiles:data.servedCurrentFiles,servedBaseFiles:data.servedBaseFiles,screenshotsIdentical:data.screenshotsIdentical,pixelComparison:data.pixelComparison,captureStability:data.captureStability,differences:data.differences.length,newErrors:data.newErrors,errorsCurrent:data.errorsCurrent,errorsBase:data.errorsBase});
  }
  rows.push({title:spec.title,project:test.projectName,status:run.status,states,comparisons,networkRecorded:Boolean(network),unexpected:network?.unexpected||[],errors:network?.errors||[],interceptedRequests:network?.calls?.length||0,explicitlyBlocked:network?.blocked?.length||0});
}await walk(suite.suites);}};
await walk(result.suites);
const pngs=[];
async function findPng(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())await findPng(file);else if(entry.name.endsWith('.png'))pngs.push(file);}}
await findPng(path.dirname(source));
const states=rows.flatMap(row=>row.states),comparisons=rows.flatMap(row=>row.comparisons);
const summary={stats:result.stats,metadata:result.config?.metadata,totals:{tests:rows.length,renderedStates:states.length,darkStates:states.filter(state=>state.theme==='dark'&&state.media==='screen').length,visibleElements:states.reduce((n,state)=>n+state.visibleElements,0),pseudoElements:states.reduce((n,state)=>n+state.pseudoElements,0),brightDarkSurfaces:states.filter(state=>state.theme==='dark'&&state.media==='screen').reduce((n,state)=>n+state.bright.length,0),baseComparisons:comparisons.length,comparisonsWithRootProvenance:comparisons.filter(item=>item.diffScope==='repository-root'&&Array.isArray(item.servedBaseFiles)).length,exactPngComparisons:comparisons.filter(item=>item.screenshotsIdentical).length,withinRasterTolerance:comparisons.filter(item=>item.pixelComparison?.accepted).length,screenshotFiles:pngs.length,inlineScreenshotAttachments:0,unexpectedEndpoints:rows.reduce((n,row)=>n+row.unexpected.length,0)},rows};
let inlineImages=0;
function countInline(suites){for(const suite of suites||[]){for(const spec of suite.specs||[])for(const test of spec.tests||[])for(const run of test.results||[])inlineImages+=(run.attachments||[]).filter(item=>item.contentType==='image/png'&&item.body).length;countInline(suite.suites);}}
countInline(result.suites);summary.totals.inlineScreenshotAttachments=inlineImages;
await writeFile(source.replace(/\.json$/,'.summary.json'),JSON.stringify(summary,null,2));
process.stdout.write(JSON.stringify({stats:summary.stats,totals:summary.totals},null,2)+'\n');
