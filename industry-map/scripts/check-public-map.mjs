import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {getDocument} from '../.tooling/pdf/node_modules/pdfjs-dist/legacy/build/pdf.mjs';
import {createCanvas} from '../.tooling/pdf/node_modules/@napi-rs/canvas/index.js';
const require=createRequire(import.meta.url),root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const data=require('../../lib/atlas').load();
const manifest=JSON.parse(fs.readFileSync(path.join(root,'deliverables/public-map-manifest.json')));
const doc=await getDocument({data:new Uint8Array(fs.readFileSync(path.join(root,'deliverables/Pharmaceutical_Logo_Map.pdf')))}).promise;
assert.equal(doc.numPages,1);const page=await doc.getPage(1),annotations=await page.getAnnotations(),items=(await page.getTextContent()).items;
const tiles=annotations.filter(a=>a.url?.includes('/map/companies/'));
assert(annotations.some(a=>a.url==='https://trust.med/map/'),'Missing full-map link');
assert(annotations.some(a=>a.url==='https://trust.med/atlas/'),'Missing Atlas link');
assert(!items.some(i=>/submit your company/i.test(i.str)),'Submission wording remains in footer');
assert.equal(tiles.length,data.map_count);assert.equal(new Set(tiles.map(a=>a.url)).size,data.map_count);
assert.equal(manifest.ai_count,data.providers.filter(r=>r.ai).length);
assert.equal(manifest.group_count,data.providers.filter(r=>r.ownership).length);
// One AI example in the legend replaces Trust.med's Atlas-branded tile badge.
assert.equal(items.filter(i=>i.str==='AI').length,manifest.ai_count);
assert.equal(items.filter(i=>i.str==='Group').length,manifest.group_count+1);
for(const r of data.providers){assert(tiles.some(a=>a.url==='https://trust.med'+r.url),r.id);const area=manifest.categories.find(a=>a.name===r.layer);assert(area.specialties.find(c=>c.name===r.primary_category)?.ids.includes(r.id),'Category mismatch: '+r.id);}
for(const a of tiles){assert.equal(Math.round(a.rect[3]-a.rect[1]),108);assert(a.rect[0]>=0&&a.rect[2]<=manifest.width&&a.rect[1]>=0&&a.rect[3]<=manifest.height);}
for(let i=0;i<tiles.length;i++)for(let j=i+1;j<tiles.length;j++){const a=tiles[i].rect,b=tiles[j].rect;assert(!(Math.max(a[0],b[0])<Math.min(a[2],b[2])&&Math.max(a[1],b[1])<Math.min(a[3],b[3])),'Overlapping tiles');}
for(const i of items)assert(i.transform[5]>=0&&i.transform[5]<=manifest.height,'Text outside page: '+i.str);
const view=page.getViewport({scale:.5}),canvas=createCanvas(Math.ceil(view.width),Math.ceil(view.height));await page.render({canvasContext:canvas.getContext('2d'),viewport:view}).promise;
fs.writeFileSync(path.join(root,'deliverables/Logo_Map_Preview.png'),canvas.toBuffer('image/png'));
console.log(`Passed: one-page poster, ${tiles.length} unique company tiles and profile links, all category placements, ${manifest.ai_count} AI offerings, ${manifest.group_count} Group badges, and no overlapping tiles.`);
