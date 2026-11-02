// Run after npm run build. Validates generated routes against source research.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {load,esc}=require('../lib/atlas');
const data=load();
const site=path.resolve(__dirname,'../_site');
const html=fs.readFileSync(path.join(site,'map/index.html'),'utf8');
assert.equal(data.providers.length,data.record_count);
assert.equal(data.providers.filter(r=>r.map_status!=='directory_only').length,data.map_count);
assert.equal(new Set(data.providers.map(r=>r.id)).size,data.record_count);
assert.equal(data.areas.reduce((n,a)=>n+a.count,0),data.record_count);
assert.equal((html.match(/data-company=/g)||[]).length,data.record_count);
const client=JSON.parse(html.match(/id="atlas-data">([\s\S]*?)<\/script>/)[1]);
assert.equal(client.filter(r=>r.ai).length,data.providers.filter(r=>r.ai).length);
assert.equal(client.filter(r=>r.group).length,data.providers.filter(r=>r.ownership).length);
for(const r of data.providers){
 assert(r.intro.length>30,`Missing introduction: ${r.id}`);
 const page=fs.readFileSync(path.join(site,r.url,'index.html'),'utf8');
 assert(page.includes(`<h1>${esc(r.provider)}</h1>`),`Missing title: ${r.id}`);
 assert(page.includes(`https://trust.med${r.url}`),`Missing canonical: ${r.id}`);
 if(r.linkedin){
  assert(page.includes(`href="${esc(r.linkedin.url)}"`), `Missing LinkedIn link: ${r.id}`);
  assert(r.linkedin.source_urls.length, `Missing LinkedIn evidence: ${r.id}`);
 } else assert(!page.includes('class="atlas-button atlas-profile-linkedin"'), `Unconfirmed LinkedIn link: ${r.id}`);
 for(const source of r.source_urls)assert(page.includes(esc(source)),`Missing source: ${r.id}`);
 for(const cap of r.capabilities)assert(page.includes(esc(cap)),`Missing capability: ${r.id}`);
 if(r.ai){
  assert(r.ai.summary.length>50, `Missing AI summary: ${r.id}`);
  assert(r.ai.source_urls.length, `Missing AI sources: ${r.id}`);
  assert(page.includes(esc(r.ai.summary)), `AI summary not rendered: ${r.id}`);
  for(const source of r.ai.source_urls)assert(page.includes(esc(source)), `Missing AI source link: ${r.id}`);
  if(r.ai.review_notes)assert(!page.includes(esc(r.ai.review_notes)), `Internal AI review notes published: ${r.id}`);
 }
 if(r.map_status==='directory_only')assert(!page.includes('alt="'+esc(r.provider)+'"'),'Unresolved identity given a logo');
 else assert(fs.existsSync(path.join(site,r.logo.url)),`Missing logo: ${r.id}`);
}
for(const match of html.matchAll(/href="(\/assets\/map\/downloads\/[^\"]+)"/g))assert(fs.existsSync(path.join(site,match[1])),`Missing download: ${match[1]}`);
console.log(`Passed: ${data.record_count} source-linked profiles, ${data.map_count} logo records, editorial coverage, unique IDs, category totals, AI/group counts, canonical URLs and downloads.`);

const withheld=require('../industry-map/research/site-publication.json').internal_only;
for(const id of withheld){
 assert(!data.providers.some(r=>r.id===id),`Internal record published: ${id}`);
 assert(!fs.existsSync(path.join(site,'map/companies',id,'index.html')),`Stale internal profile: ${id}`);
}
const downloads=fs.readdirSync(path.join(site,'assets/map/downloads'));
assert.deepEqual(downloads.sort(),['Pharmatech_Map.pdf','Pharmatech_Map_2026.jpg'],'Only the clickable map PDF and its JPG preview should be public');
assert(html.includes('href="/assets/map/downloads/Pharmatech_Map.pdf"'), 'Map download must use the clickable PDF');
assert(!html.includes('atlas-export'),'CSV export remains public');
assert(html.includes('aria-labelledby="map-atlas-title"'));
assert(html.includes('href="/atlas/"'));
assert(!html.includes('<section class="atlas-method"><details>'));
assert(html.includes('href="/blog/pharmatech-industry-insights/"'));
console.log('Passed: public download allowlist, retired profile removal and Atlas research section.');
