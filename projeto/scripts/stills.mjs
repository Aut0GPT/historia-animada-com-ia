import {bundle} from '@remotion/bundler';
import {renderStill,selectComposition,openBrowser} from '@remotion/renderer';
import fs from 'node:fs';
const frames=(process.argv[2]||'55,240,400,540,660,780,990,1320,1530').split(',').map(Number);
const id=process.argv[3]||'Jardim25D';const out=process.argv[4]||'qa/concept';fs.mkdirSync(out,{recursive:true});
const serveUrl=await bundle({entryPoint:'src/index.ts',publicDir:'public'});
const browser=await openBrowser('chrome',{chromiumOptions:{gl:'angle'},logLevel:'warn'});
const composition=await selectComposition({serveUrl,id,puppeteerInstance:browser});
for(const frame of frames){const start=Date.now();await renderStill({serveUrl,composition,frame,output:`${out}/${id}-${frame}.png`,scale:.5,puppeteerInstance:browser,chromiumOptions:{gl:'angle'},timeoutInMilliseconds:90000});console.log(JSON.stringify({frame,seconds:(Date.now()-start)/1000}));}
await browser.close({silent:true});
