#!/usr/bin/env node
// Requires sharp installed in a clean editorial environment: npm install --no-save sharp
// Approved originals live in editorial/photo-inbox; only reviewed records are published.
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const root=process.cwd(),manifestPath=path.join(root,'assets/data/photo-review-manifest.json');
const manifest=JSON.parse(await readFile(manifestPath,'utf8'));
const required=['sourceUrl','creator','licenseName','licenseUrl','commercialUseAllowed','attributionText','culturalContextReviewer','altText','reviewedBy','reviewedAt'];
const widths=manifest.imageRules?.responsiveWidths||[480,768,1200,1600],errors=[];
await mkdir(path.join(root,'assets/images/holidays'),{recursive:true});
for(const item of manifest.items||[]){
 if(item.status!=='approved')continue;
 const missing=required.filter(k=>item[k]===undefined||item[k]===null||item[k]==='');
 if(missing.length){errors.push(item.id+': missing '+missing.join(', '));continue;}
 if(item.commercialUseAllowed!==true){errors.push(item.id+': commercial use not cleared');continue;}
 if(!item.culturalContextReviewer||!item.altText.trim()){errors.push(item.id+': reviewer and alt text required');continue;}
 const source=path.join(root,'editorial/photo-inbox',item.originalFile||'');
 try{
  const meta=await sharp(source,{failOn:'error'}).metadata();if(!meta.width||!meta.height)throw Error('invalid dimensions');
  const dir=path.join(root,'assets/images/holidays',item.id);await mkdir(dir,{recursive:true});
  const variants={avif:[],webp:[],jpg:[]};
  for(const width of widths){if(width>meta.width)continue;
   for(const format of ['avif','webp','jpg']){
    const name=width+'.'+(format==='jpg'?'jpg':format),dest=path.join(dir,name);
    let p=sharp(source).rotate().resize({width,withoutEnlargement:true});
    if(format==='avif')await p.avif({quality:54,effort:5}).toFile(dest);
    else if(format==='webp')await p.webp({quality:78,effort:5}).toFile(dest);
    else await p.jpeg({quality:82,mozjpeg:true}).toFile(dest);
    variants[format].push({width,file:'assets/images/holidays/'+item.id+'/'+name,bytes:(await stat(dest)).size});
   }
  }
  item.originalWidth=meta.width;item.originalHeight=meta.height;item.optimizedFormats=['avif','webp','jpg'];
  item.files=Object.fromEntries(Object.entries(variants).map(([f,v])=>[f,v.at(-1)?.file||'']));
  item.responsiveFiles=variants;item.displayWidth=Math.min(1600,meta.width);item.displayHeight=Math.round(meta.height*item.displayWidth/meta.width);
  console.log('Optimized '+item.id+' '+meta.width+'x'+meta.height);
 }catch(e){errors.push(item.id+': '+e.message);}
}
if(errors.length){console.error('Photo pipeline blocked:\n- '+errors.join('\n- '));process.exitCode=1;}
else{await writeFile(manifestPath,JSON.stringify(manifest,null,2)+'\n');console.log('Review file sizes and visually inspect every crop before publication.');}
