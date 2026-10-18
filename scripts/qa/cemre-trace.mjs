import { writeFile } from 'node:fs/promises';
import { launch, sleep } from './browser.mjs';
const b = await launch(), events = [];
let complete;
const ended = new Promise(r => complete = r);
b.on(m => { if(m.method === 'Tracing.dataCollected') events.push(...m.params.value); if(m.method === 'Tracing.tracingComplete') complete(); });
try {
  await b.send('Page.enable');
  await b.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await b.send('Page.navigate',{url:'http://localhost:4181/'}); await sleep(4000);
  await b.evaluate(`document.documentElement.style.scrollBehavior='auto';document.fonts.ready`);
  await b.send('Tracing.start',{categories:'devtools.timeline,blink,cc',transferMode:'ReportEvents'});
  await b.evaluate(`new Promise(resolve=>{let y=0;function tick(){scrollTo(0,y);y+=16;if(y<document.documentElement.scrollHeight-innerHeight)requestAnimationFrame(tick);else resolve()}requestAnimationFrame(tick)})`);
  await b.send('Tracing.end'); await ended;
  await writeFile('qa/cemre/desktop-trace.json',JSON.stringify({traceEvents:events}));
  const relevant=events.filter(e=>['RunTask','Layout','Paint','UpdateLayoutTree','FunctionCall'].includes(e.name)&&e.dur).sort((a,b)=>b.dur-a.dur).slice(0,15).map(e=>({name:e.name,ms:+(e.dur/1000).toFixed(2),tid:e.tid}));
  console.log(JSON.stringify(relevant));
  await writeFile('qa/cemre/trace-summary.json',JSON.stringify(relevant,null,2));
} finally {await b.close()}
