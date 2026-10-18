import {readdir,lstat,mkdir,copyFile,readFile,mkdtemp,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname,join,relative,extname} from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const source=fileURLToPath(new URL('..',import.meta.url));
const scratch=await mkdtemp(join(tmpdir(),'cemre-export-'));
const stage=join(scratch,'Cemre-Hair-Beauty');await mkdir(stage);
const excluded=new Set(['node_modules','.next','.git','.claude','.codex','.agents','.wrangler','.vercel','.netlify','coverage']);
const skipFile=name=>name.startsWith('.env')||['AGENTS.md','CLAUDE.md','PROJECT.md','.npmrc','.DS_Store','Thumbs.db','desktop.ini','QA-CEMRE.md'].includes(name)||/\.(zip|log|tsbuildinfo|pem|key|p12|pfx)$/i.test(name);
const secrets=[/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,/\bgh[pousr]_[A-Za-z0-9]{30,}\b/,/\bgithub_pat_[A-Za-z0-9_]{35,}\b/,/\bsk-(?:proj-|svcacct-)[A-Za-z0-9_-]{25,}\b/,/\bAKIA[A-Z0-9]{16}\b/];
let count=0;
async function copyTree(folder){
 for(const entry of await readdir(folder,{withFileTypes:true})){
  if(excluded.has(entry.name)||skipFile(entry.name)||(folder===source&&entry.name==='qa'))continue;
  const path=join(folder,entry.name),rel=relative(source,path),target=join(stage,rel),details=await lstat(path);
  if(details.isSymbolicLink())continue;
  if(entry.isDirectory()){await mkdir(target,{recursive:true});await copyTree(path);continue;}
  if(!entry.isFile())continue;
  if(['.ts','.tsx','.js','.mjs','.json','.yml','.yaml','.toml','.md','.txt','.html','.css'].includes(extname(path))&&details.size<5*1024*1024){
   const data=await readFile(path,'utf8');if(secrets.some(pattern=>pattern.test(data)))throw new Error(`Potential secret in ${rel}; export stopped.`);
  }
  await mkdir(dirname(target),{recursive:true});await copyFile(path,target);count++;
 }
}
await copyTree(source);
const base=join(dirname(source),'Cemre-Hair-Beauty-2026-10-18');let zip=`${base}.zip`,version=2;
while(await stat(zip).then(()=>true,()=>false))zip=`${base}-${version++}.zip`;
const packed=spawnSync('tar.exe',['-a','-c','-f',zip,'-C',scratch,'Cemre-Hair-Beauty'],{encoding:'utf8',maxBuffer:16*1024*1024});
if(packed.status!==0)throw new Error(packed.stderr||'ZIP creation failed');
const listing=spawnSync('tar.exe',['-t','-f',zip],{encoding:'utf8',maxBuffer:16*1024*1024});
if(listing.status!==0)throw new Error('ZIP cannot be read');
const names=listing.stdout.split(/\r?\n/).filter(Boolean);
if(names.some(name=>name.includes('\\')||name.split('/').some(p=>excluded.has(p)||p.startsWith('.env'))))throw new Error('Unexpected ZIP path');
for(const name of ['package.json','package-lock.json','LEESMIJ-ZIP.md','src/components/cemre/HeroCarousel.tsx','public/images/cemre/facial-v1-1920.avif','out/index.html','out/en/index.html','out/images/cemre/hair-care-v1-portrait-960.avif']){
 const extracted=spawnSync('tar.exe',['-xOf',zip,`Cemre-Hair-Beauty/${name}`],{maxBuffer:16*1024*1024});
 if(extracted.status!==0||!(await readFile(join(stage,name))).equals(extracted.stdout))throw new Error(`ZIP integrity failed: ${name}`);
}
const bytes=await readFile(zip);
console.log(JSON.stringify({zip,files:count,sizeMB:+(bytes.length/1024/1024).toFixed(1),sha256:createHash('sha256').update(bytes).digest('hex'),verified:true},null,2));
