import {mkdir,writeFile} from 'node:fs/promises';
import {launch,sleep,MOBILE_UA} from './browser.mjs';
const b=await launch(),errors=[],results=[];
b.on(m=>{if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.exception?.description||m.params.exceptionDetails.text);if(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error')errors.push(m.params.args.map(a=>a.value||a.description).join(' '));if(m.method==='Network.responseReceived'&&m.params.response.status>=400)errors.push(m.params.response.url)});
await mkdir('qa/carousel',{recursive:true});
const check=async(name,code)=>{const value=await b.evaluate(code);results.push({name,value});console.log(name,JSON.stringify(value));};
const next=async()=>{await b.evaluate(`document.querySelector('[data-active=true] [data-direction="1"]').click()`);for(let n=0;n<60;n++){await sleep(100);if(await b.evaluate(`document.querySelector('.hero-carousel').getAttribute('aria-busy')==='false'`))break;}await sleep(450)};
try{
await b.send('Runtime.enable');await b.send('Network.enable');await b.send('Page.enable');
for(const width of [390,768,1440]){
await b.send('Emulation.setDeviceMetricsOverride',{width,height:width<700?844:900,deviceScaleFactor:1,mobile:width<700});
if(width<700)await b.send('Emulation.setUserAgentOverride',{userAgent:MOBILE_UA});
await b.send('Page.navigate',{url:'http://localhost:4181/'});await sleep(1600);await b.evaluate('document.fonts.ready');
for(let slide=0;slide<3;slide++){
if(slide)await next();
await check(`${width}-slide-${slide+1}`,`(()=>{const a=document.querySelector('[data-active=true]'),button=a.querySelector('.split-hero__copy .button').getBoundingClientRect(),controls=a.querySelector('.hero-controls').getBoundingClientRect(),preview=document.querySelector('.hero-comparison').getBoundingClientRect();return {active:a.getAttribute('aria-label'),oneActive:document.querySelectorAll('[data-active=true]').length===1,overflow:document.documentElement.scrollWidth-innerWidth,h1:document.querySelectorAll('h1').length,brokenVisible:[...a.querySelectorAll('img')].filter(i=>!i.complete||!i.naturalWidth).length,controlBelowCTA:controls.top>=button.bottom,previewClear:!preview.height||preview.top>=controls.bottom,focus:document.activeElement?.getAttribute('data-direction'),heroHeight:document.querySelector('.hero-carousel').offsetHeight}})()`);
const shot=await b.send('Page.captureScreenshot',{format:'png'});await writeFile(`qa/carousel/${width}-${slide+1}.png`,Buffer.from(shot.data,'base64'));
}
await next();await check(`${width}-wrap`, `document.querySelector('[data-active=true]').getAttribute('aria-label').startsWith('1 /')`);
}
await b.evaluate(`document.querySelector('.hero-carousel').dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}))`);await sleep(650);
await check('keyboard-next', `document.querySelector('[data-active=true]').getAttribute('aria-label').startsWith('2 /')`);
await b.evaluate(`document.querySelector('[data-active=true] .button[data-care]').click()`);await sleep(650);
await check('facial-booking-selects-skin', `document.querySelector('[name=service]:checked').value==='0'`);
await b.send('Page.navigate',{url:'http://localhost:4181/'});await sleep(1000);
await b.evaluate(`(()=>{const h=document.querySelector('.hero-carousel');h.dispatchEvent(new PointerEvent('pointerdown',{pointerType:'touch',clientX:280,clientY:350,bubbles:true}));h.dispatchEvent(new PointerEvent('pointerup',{pointerType:'touch',clientX:100,clientY:355,bubbles:true}));})()`);await sleep(650);
await check('swipe-next',`document.querySelector('[data-active=true]').getAttribute('aria-label').startsWith('2 /')`);
await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await next();
await check('reduced-motion',`document.querySelector('[data-active=true]').getAnimations().length===0`);
await b.send('Emulation.setScriptExecutionDisabled',{value:true});await b.send('Page.navigate',{url:'http://localhost:4181/'});await sleep(1000);
await check('no-js',`({firstVisible:!document.querySelector('.hero-carousel__slide').hidden,controlsDisabled:[...document.querySelectorAll('.hero-controls button')].every(b=>b.disabled),previewLink:document.querySelector('.hero-comparison').getAttribute('href')})`);
console.log('errors',errors);await writeFile('qa/carousel/report.json',JSON.stringify({results,errors},null,2));
}finally{await b.close()}
