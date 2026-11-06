import {bundle} from '@remotion/bundler';
import {renderMedia,selectComposition,openBrowser} from '@remotion/renderer';
import fs from 'node:fs';
const id=process.argv[2]||'Jardim25D',output=process.argv[3]||'../media/jardim-25d.mp4',scale=Number(process.argv[4]||1);
const frameRange=process.argv[5]?process.argv[5].split('-').map(Number):undefined;
const serveUrl=await bundle({entryPoint:'src/index.ts',publicDir:'public'});
const browser=await openBrowser('chrome',{chromiumOptions:{gl:'angle'},logLevel:'warn'});
const composition=await selectComposition({serveUrl,id,puppeteerInstance:browser});let last=-1;const errors=[];
await renderMedia({serveUrl,composition,...(frameRange?{frameRange}:{}),outputLocation:output,codec:'h264',crf:18,scale,concurrency:1,x264Preset:'fast',ffmpegOverride:({args})=>[...args.slice(0,-1),'-threads','2',args[args.length-1]],puppeteerInstance:browser,chromiumOptions:{gl:'angle'},timeoutInMilliseconds:90000,onProgress:p=>{const n=Math.floor(p.progress*100);if(n>=last+5){console.log(JSON.stringify({id,percent:n,rendered:p.renderedFrames}));last=n}},onBrowserLog:l=>{if(l.type==='error'){errors.push(l.text);console.log(l.text)}}});
await browser.close({silent:true});fs.writeFileSync(output+'.render.json',JSON.stringify({id,output,scale,duration:(frameRange?frameRange[1]-frameRange[0]+1:composition.durationInFrames)/composition.fps,frameRange:frameRange||null,errors},null,2));console.log('Rendered '+output);


