const assert=require('node:assert/strict');
const fs=require('node:fs');
const {load,esc}=require('../lib/atlas');
const {schema}=require('../lib/profile-schema');
const {validateContacts}=require('../lib/company-contacts');
const {providers}=load();
const sitemap=fs.readFileSync('_site/sitemap.xml','utf8');
let complete=0;
for(const r of providers){
 const html=fs.readFileSync(`_site${r.url}index.html`,'utf8');
 const blocks=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
 const graph=blocks.find(b=>b['@graph'])?.['@graph'];
 assert.ok(graph,`${r.id}: missing graph`);
 const page=graph.find(n=>n['@type']==='WebPage');
 const entity=graph.find(n=>n['@id']===page.mainEntity['@id']);
 assert.equal(page.url,'https://trust.med'+r.url);
 assert.equal(entity.name,r.provider);
 assert.equal(entity.url,r.website.url);
 assert.equal(entity['@type'],r.record_kind==='Product'?'SoftwareApplication':'Organization');
 assert.equal(graph.find(n=>n['@type']==='BreadcrumbList').itemListElement.at(-1).item,page.url);
 assert.ok(html.includes(`<link rel="canonical" href="${page.url}">`));
 assert.ok(sitemap.includes(`<loc>${page.url}</loc>`),`${r.id}: sitemap missing`);
 const subject=r.record_kind==='Product'?entity.provider:entity;
 const c=r.contact;
 for(const [field,property] of [['email','email'],['phone','telephone']]){
  assert.equal(subject?.[property],c?.[field]?.value);
  if(c?.[field])assert.ok(html.includes(esc(c[field].value)),`${r.id}: ${field} not visible`);
 }
 if(c?.location){assert.equal(subject.address.addressLocality,c.location.addressLocality);assert.ok(html.includes(esc(c.location.display)));}
 const map=html.match(/<iframe src="([^"]+)" title="Map of /);
 assert.equal(!!map,!!c?.location,`${r.id}: map coverage`);
 if(map){
  const url=new URL(map[1].replaceAll('&amp;','&').replaceAll('&#39;',"'"));
  assert.equal(url.searchParams.get('output'),'embed');
  assert.equal(url.searchParams.get('z'),c.location.streetAddress?'15':'11');
  assert.ok(url.searchParams.get('q').includes(c.location.addressLocality));
 }
 if(r.linkedin&&r.record_kind!=='Product')assert.ok(entity.sameAs.includes(r.linkedin.url));
 if(['email','phone','location'].every(k=>c?.[k]))complete++;
}
assert.ok(!sitemap.includes('/thank-you/'));
assert.ok(!sitemap.includes('/update-profile/'));
assert.ok(!sitemap.includes('/submit-company/'));
assert.ok(!sitemap.includes('/404'));
assert.equal([...sitemap.matchAll(/<loc>/g)].length,new Set([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1])).size);
assert.ok(fs.readFileSync('_site/robots.txt','utf8').includes('Sitemap: https://trust.med/sitemap.xml'));
const unsafe=schema({...providers[0],provider:'</script><script>alert(1)</script>'});
assert.equal((unsafe.match(/<script/g)||[]).length,1);
assert.throws(()=>validateContacts({test:{reviewed_date:'2026-11-02',email:{value:'fake@example.com'}}},new Set(['test'])));
for(const path of ['submit-company','update-profile']){
 const html=fs.readFileSync(`_site/map/${path}/index.html`,'utf8');
 assert.ok(html.includes('content="noindex, follow"'));
 for(const name of ['public_company_email','public_company_phone','public_company_location'])assert.ok(html.includes(`name="${name}"`));
}
console.log(`${providers.length} profile graphs, visible contacts, canonical URLs, sitemap and submission fields passed. ${complete} complete contact records.`);
