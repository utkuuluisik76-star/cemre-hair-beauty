// Lighthouse, 5-run median: npm run qa:lighthouse [-- <url>] [--desktop] [--runs=N]
// (--runs=1 for a quick before/after check while fixing; budgets are judged on 5.)
// Budget (studio blueprint): performance ≥ 90 mobile / ≥ 98 desktop; accessibility, best practices
// and SEO 100; LCP < 2.5 s (aim < 2.0 s), CLS < 0.05. Reports land in qa/lighthouse (not committed).
// Lab numbers move with the machine's load: close heavy programs and compare medians, not single runs.
import { spawn, execFile } from 'node:child_process';
import { mkdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { promisify } from 'node:util';
import { BROWSER, baseUrl, closeBrowser, root, sleep } from './browser.mjs';

const desktop = process.argv.includes('--desktop');
const runs = Number(process.argv.find((a) => a.startsWith('--runs='))?.split('=')[1] ?? 5);
const url = baseUrl() + (process.argv.find((a) => a.startsWith('/')) ?? '/');
const dir = join(root, 'qa', 'lighthouse');
await mkdir(dir, { recursive: true });
const run = promisify(execFile);

const reports = [];
for (let i = 1; i <= runs; i++) {
  const port = 9240 + i;
  const proc = spawn(BROWSER, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${join(tmpdir(), `lh-${Date.now()}-${i}`)}`, '--no-first-run', 'about:blank']);
  await sleep(3000);
  const file = join(dir, `${desktop ? 'desktop' : 'mobile'}-${i}.json`);
  const args = ['--yes', 'lighthouse@12', url, `--port=${port}`, '--quiet', '--output=json', `--output-path=${file}`, ...(desktop ? ['--preset=desktop'] : [])];
  await run(process.platform === 'win32' ? 'npx.cmd' : 'npx', args, { shell: process.platform === 'win32' }).catch((e) => console.error(`run ${i} failed: ${e.message.split('\n')[0]}`));
  await closeBrowser(port, proc);
  reports.push(await readFile(file, 'utf8').then(JSON.parse).catch(() => null));
  process.stdout.write(`run ${i} done\n`);
}

const ok = reports.filter(Boolean);
if (!ok.length) throw new Error('No Lighthouse run succeeded.');
const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
const audit = (key) => median(ok.map((r) => r.audits[key].numericValue));
const score = (key) => median(ok.map((r) => Math.round(r.categories[key].score * 100)));
console.log(`${url}  ${desktop ? 'desktop' : 'mobile'}, median of ${ok.length}`);
console.log(`  performance ${score('performance')}  accessibility ${score('accessibility')}  best practices ${score('best-practices')}  SEO ${score('seo')}`);
console.log(`  FCP ${Math.round(audit('first-contentful-paint'))} ms  LCP ${Math.round(audit('largest-contentful-paint'))} ms  TBT ${Math.round(audit('total-blocking-time'))} ms  CLS ${audit('cumulative-layout-shift').toFixed(3)}`);
// where the main-thread time goes (median run by performance score): the first place to look when TBT or LCP is high
const middle = [...ok].sort((a, b) => a.categories.performance.score - b.categories.performance.score)[Math.floor(ok.length / 2)];
const work = middle.audits['mainthread-work-breakdown']?.details?.items ?? [];
console.log(`  main thread: ${work.map((w) => `${w.groupLabel} ${Math.round(w.duration)} ms`).join(' · ')}`);
const lcp = middle.audits['largest-contentful-paint-element']?.details?.items?.[0]?.items?.[0]?.node?.nodeLabel;
if (lcp) console.log(`  LCP element: ${lcp.slice(0, 80)}`);
