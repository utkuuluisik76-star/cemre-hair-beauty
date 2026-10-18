import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { launch, sleep, MOBILE_UA } from './browser.mjs';
const base = 'http://localhost:4181';
const browser = await launch();
const errors = [], failures = [], results = [];
browser.on(m => {
  if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.text + ': ' + (m.params.exceptionDetails.exception?.description || ''));
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push(m.params.args.map(a => a.value || a.description).join(' '));
  if (m.method === 'Network.responseReceived' && m.params.response.status >= 400) failures.push(m.params.response.url);
});
await mkdir('qa/cemre', { recursive: true });
await browser.send('Page.enable'); await browser.send('Runtime.enable'); await browser.send('Network.enable');
const desktopUA = (await browser.send('Browser.getVersion')).userAgent;
const check = async (name, expression) => { const value = await browser.evaluate(expression); results.push({ name, value }); console.log(name, JSON.stringify(value)); return value; };
const shot = async (name, full = false) => {
  const { width, height } = await browser.evaluate(`({width:innerWidth,height:${full ? 'document.documentElement.scrollHeight' : 'innerHeight'}})`);
  const result = await browser.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: full, ...(full ? {clip:{ x:0,y:0,width,height,scale:1 }} : {}) });
  await writeFile(`qa/cemre/${name}.png`, Buffer.from(result.data, 'base64'));
  if (full) await sharp(Buffer.from(result.data, 'base64')).resize({ width: 600 }).jpeg({ quality: 80 }).toFile(`qa/cemre/${name}-overview.jpg`);
};
try {
  for (const locale of ['tr', 'en']) {
    for (const width of [390, 768, 1440]) {
      await browser.send('Emulation.setDeviceMetricsOverride', { width, height: width === 390 ? 844 : 900, deviceScaleFactor: 1, mobile: width === 390 });
      await browser.send('Emulation.setUserAgentOverride', { userAgent: width === 390 ? MOBILE_UA : desktopUA });
      await browser.send('Page.navigate', { url: base + (locale === 'tr' ? '/' : '/en/') }); await sleep(2500);
      await browser.evaluate('document.fonts.ready');
      await check(`${locale}-${width}`, `({h1:document.querySelectorAll('h1').length,overflow:document.documentElement.scrollWidth-innerWidth,missingImages:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),title:document.title,fields:document.querySelectorAll('.booking-panel input').length})`);
      await check(`refinements-${locale}-${width}`, `(() => {const photos=[...document.querySelectorAll('.split-hero__images picture')].map(e=>e.getBoundingClientRect());const h=document.querySelector('.split-hero').getBoundingClientRect(),copy=document.querySelector('.split-hero__copy').getBoundingClientRect(),w=document.querySelector('.floating-whatsapp').getBoundingClientRect(),bar=document.querySelector('.mobile-cta').getBoundingClientRect(),tag=getComputedStyle(document.querySelector('.compare-tag'));return {equalHalves:Math.abs(photos[0].width-photos[1].width)<1,heroCopyFits:copy.bottom<=h.bottom&&copy.top>=h.top,floatInViewport:w.right<=innerWidth&&w.bottom<=innerHeight,clearOfMobileBar:innerWidth>700||w.bottom<bar.top,tagColor:tag.color,tagBackground:tag.backgroundColor,tagRadius:tag.borderRadius};})()`);
      if (locale === 'tr') { await shot(`home-${width}`); await shot(`full-${width}`, true); }
    }
  }
  // Back to TR. Real events exercise service shortcuts, native validation and step navigation.
  await browser.send('Page.navigate', {url:base}); await sleep(1500);
  await browser.evaluate(`document.querySelector('[data-care="0"]').click()`); await sleep(200);
  await check('service-shortcut', `document.querySelector('input[name=service]:checked').value === '0'`);
  await browser.evaluate(`document.querySelector('.booking-panel form').requestSubmit()`); await sleep(100);
  await check('step-2', `document.querySelector('[aria-current=step]').textContent.includes('Uzman')`);
  await browser.evaluate(`document.querySelector('.booking-panel form').requestSubmit()`); await sleep(100);
  await check('step-3', `document.querySelector('[aria-current=step]').textContent.includes('iletişim')`);
  await check('empty-invalid', `!document.querySelector('.booking-panel form').checkValidity()`);
  await browser.evaluate(`(() => { const f=document.querySelector('.booking-panel form');for(const [key,value] of Object.entries({date:'2026-12-20',time:'14:30',name:'Demo Ziyaretçi',phone:'+90 000 000 00 00',note:'Örnek randevu talebi'})){f.elements.namedItem(key).value=value;} f.querySelector('input[type=checkbox]').checked=true;})()`);
  await check('valid-demo', `document.querySelector('.booking-panel form').checkValidity()`);
  await check('invalid-phone-blocked', `(() => {const field=document.querySelector('[name=phone]');const previous=field.value;field.value='abcdefghi';const invalid=!field.checkValidity();field.value=previous;return invalid;})()`);
  await browser.evaluate(`document.querySelector('.booking-panel form').requestSubmit()`); await sleep(200);
  await check('preview', `({visible:!!document.querySelector('.message-preview'),message:document.querySelector('.message-preview textarea')?.value,externalSendLinks:document.querySelectorAll('a[href*="wa.me"]').length})`);
  await browser.evaluate(`document.querySelector('.message-preview .back-button')?.click()`); await sleep(100);
  await check('edit-preserves-data', `document.querySelector('[name=name]').value === 'Demo Ziyaretçi'`);
  await browser.evaluate(`document.querySelector('.comparison-stage input').focus()`);
  await browser.send('Input.dispatchKeyEvent', { type:'keyDown', key:'ArrowRight', code:'ArrowRight', windowsVirtualKeyCode:39 });
  await browser.send('Input.dispatchKeyEvent', { type:'keyUp', key:'ArrowRight', code:'ArrowRight', windowsVirtualKeyCode:39 }); await sleep(100);
  await check('range-keyboard', `({value:document.querySelector('.comparison-stage input').value,reveal:document.querySelector('.comparison-stage').style.getPropertyValue('--reveal')})`);
  await browser.send('Emulation.setEmulatedMedia', {features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await check('reduced-motion', `({scroll:getComputedStyle(document.documentElement).scrollBehavior,transition:getComputedStyle(document.querySelector('.button')).transitionDuration})`);
  await browser.send('Emulation.setScriptExecutionDisabled', {value:true});
  await browser.send('Page.navigate', {url:base}); await sleep(1500);
  await check('no-js', `({h1:document.querySelector('h1').textContent,explanation:!!document.querySelector('noscript'),submitDisabled:document.querySelector('.booking-panel button[type=submit]').disabled,overflow:document.documentElement.scrollWidth-innerWidth})`);
  await shot('no-js');
  console.log('errors',errors,'failed requests',failures);
  await writeFile('qa/cemre/report.json',JSON.stringify({results,errors,failures},null,2));
} finally { await browser.close(); }
