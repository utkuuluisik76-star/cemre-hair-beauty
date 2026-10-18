import {mkdir,writeFile} from 'node:fs/promises';
import {launch,sleep,MOBILE_UA} from './browser.mjs';
const b=await launch();const errors=[];
b.on(m=>{if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text);if(m.method==='Network.responseReceived'&&m.params.response.status>=400)errors.push(m.params.response.url)});
await mkdir('qa/header-preview',{recursive:true});
try{
await b.send('Page.enable');await b.send('Runtime.enable');await b.send('Network.enable');
for(const width of [320,390,768,1440]){
await b.send('Emulation.setDeviceMetricsOverride',{width,height:width<700?844:900,deviceScaleFactor:1,mobile:width<700});
await b.send('Emulation.setUserAgentOverride',{userAgent:width<700?MOBILE_UA:'Mozilla/5.0 Chrome/150.0.0.0 Safari/537.36'});
await b.send('Page.navigate',{url:'http://localhost:4181/'});await sleep(1400);await b.evaluate('document.fonts.ready');
console.log(width,await b.evaluate(`(()=>{const c=document.querySelector('.hero-comparison').getBoundingClientRect(),w=document.querySelector('.floating-whatsapp').getBoundingClientRect(),a=document.querySelector('.split-hero__copy .button').getBoundingClientRect(),bar=document.querySelector('.mobile-cta').getBoundingClientRect();const overlap=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;return {overflow:document.documentElement.scrollWidth-innerWidth,thumbnails:[...document.querySelectorAll('.hero-comparison img')].every(i=>i.complete&&i.naturalWidth),href:document.querySelector('.hero-comparison').getAttribute('href'),clearOfWhatsApp:!overlap(c,w),clearOfCTA:!overlap(c,a),clearOfBottomBar:innerWidth>700||!overlap(c,bar),width:c.width,height:c.height}})()`));
const shot=await b.send('Page.captureScreenshot',{format:'png'});await writeFile(`qa/header-preview/${width}.png`,Buffer.from(shot.data,'base64'));
await b.evaluate(`document.querySelector('.hero-comparison').click()`);await sleep(1000);
console.log('anchor',await b.evaluate(`({hash:location.hash,sectionTop:Math.round(document.querySelector('#donusum').getBoundingClientRect().top)})`));
}
console.log('errors',errors);
}finally{await b.close()}
