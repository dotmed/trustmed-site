const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../industry-map');
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const areas = [
  {id:'capture', name:'Identify & Capture', short:'Give every product an identity.', text:'Packaging, codes, scanning and authentication.', color:'#ff6b35', icon:'01', samples:['acg','optel','cognex']},
  {id:'serialize', name:'Serialize & Trace', short:'Follow the product journey.', text:'Serial numbers, traceability and regulatory reporting.', color:'#4f7cff', icon:'02', samples:['tracelink','sap','systech']},
  {id:'exchange', name:'Integrate & Exchange', short:'Make the connections count.', text:'Data exchange, integration and product information.', color:'#16a34a', icon:'03', samples:['trust-med','cleo','ibm-sterling']},
  {id:'operate', name:'Verify & Operate', short:'Turn product data into action.', text:'Receiving, verification and serialized inventory.', color:'#7c3aed', icon:'04', samples:['epic','tecsys','spherity']},
  {id:'services', name:'Services, Advisory & Compliance', short:'Bring expertise to execution.', text:'Strategy, implementation, testing and packaging services.', color:'#6b7280', icon:'05', samples:['clarkston-consulting','nnit-includes-former-excellis','sharp']},
];
function load() {
  const source=read('deliverables/landscape.json');
  const edition=read('research/site-edition.json');
  if(!Number.isInteger(edition.year)||edition.year<2000||![1,2,3,4].includes(edition.quarter))throw new Error('Invalid Pharmatech Map edition');
  edition.label=`Q${edition.quarter} ${edition.year} edition`;
  const internal=new Set(read('research/site-publication.json').internal_only);
  const logos=read('assets/logo-manifest.json');
  const editorial=read('research/site-editorial.json');
  const aiEditorial=read('research/site-ai.json');
  const specialties=read('research/site-specialties.json');
  for(const category of source.editorial_rules.categories) if(!specialties[category.category]) throw new Error(`Missing specialty description: ${category.category}`);
  const websites=read('research/site-websites.json');
  const linkedin=read('research/site-linkedin.json');
  const contacts=require('./company-contacts').validateContacts(read('research/site-contacts.json'),new Set(source.providers.map(r=>r.id)));
  const priority=read('research/site-priority.json').ids;
  for(const id of priority) if(!source.providers.some(r=>r.id===id)) throw new Error(`Unknown priority record: ${id}`);
  const providers=source.providers.filter(r=>!internal.has(r.id)).map(r=>{
    const logo=logos.find(l=>l.id===r.id);
    const area=areas.find(a=>a.name===r.layer);
    if(!editorial[r.id] || !area) throw new Error(`Missing editorial content or area: ${r.id}`);
    const website=websites[r.id];
    if(!website) throw new Error(`Missing website review: ${r.id}`);
    if(website.url && (!['https:', 'http:'].includes(new URL(website.url).protocol) || !['company','product'].includes(website.kind))) throw new Error(`Invalid website: ${r.id}`);
    const social=linkedin[r.id];
    if(social?.url && !/^https:\/\/www\.linkedin\.com\/company\/[a-zA-Z0-9%._-]+\/$/.test(social.url)) throw new Error(`Invalid LinkedIn URL: ${r.id}`);
    return {...r, contact:contacts[r.id]||null, ai:(r.ai || aiEditorial[r.id]) ? {...r.ai,...aiEditorial[r.id],...(editorial[r.id].ai||{})} : null, linkedin:social?.url ? social : null, capabilities:r.capabilities.map(c=>c.replace(/\p{L}/u, letter=>letter.toLocaleUpperCase('en-US'))), specialtyDescription:specialties[r.primary_category], website:website.url ? {url:website.url, label:website.kind==='product'?'Visit product website':'Visit company website'} : null, priority:priority.includes(r.id)?priority.indexOf(r.id):priority.length, featured:priority.includes(r.id), intro:editorial[r.id].intro, area:area.id, areaColor:area.color, url:`/map/companies/${r.id}/`, logo:logo ? {url:`/assets/map/${logo.path}`,dark:!!logo.needs_dark_background}:null};
  }).sort((a,b)=>a.priority-b.priority||a.provider.localeCompare(b.provider));
  return {...source, edition, record_count:providers.length, map_count:providers.filter(r=>r.map_status!=='directory_only').length, verification_counts:providers.reduce((counts,r)=>{counts[r.verification_status]=(counts[r.verification_status]||0)+1;return counts;},{}), providers, areas:areas.map(a=>({...a,count:providers.filter(r=>r.area===a.id).length})), categories:source.editorial_rules.categories};
}
function logo(r) {return r.logo && r.map_status!=='directory_only' ? `<span class="atlas-logo${r.logo.dark?' atlas-logo--dark':''}"><img src="${esc(r.logo.url)}" alt="${esc(r.provider)}" loading="lazy" width="150" height="58"></span>` : '<span class="atlas-pending">Identity under review</span>';}
function aiBadge() {return '<span class="atlas-ai-badge" title="Documented AI offering" aria-label="Documented AI offering"><svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true"><path d="m8 4 1.8 4.2L14 10l-4.2 1.8L8 16l-1.8-4.2L2 10l4.2-1.8L8 4Z" fill="currentColor"/><path d="m16 1 .9 2.1L19 4l-2.1.9L16 7l-.9-2.1L13 4l2.1-.9L16 1Z" fill="currentColor" opacity=".5"/><circle cx="16" cy="15" r="1" fill="currentColor" opacity=".35"/></svg>AI</span>';}
function card(r) {return `<article class="atlas-company" data-company="${esc(r.id)}" data-area="${r.area}" style="--area:${r.areaColor}">
  <div class="atlas-company-top">${logo(r)}<div class="atlas-badges">${r.ai?(r.id==='trust-med'?'<span class="atlas-card-product" aria-label="Atlas Intelligence"><img src="/assets/img/atlas-globe.svg" width="25" height="25" alt=""><span>Atlas<small>Intelligence</small></span></span>':aiBadge()):''}${r.ownership?'<span class="atlas-group" title="Part of a documented corporate group"><svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="7" y="2" width="6" height="4" rx="1"/><path d="M10 6v4M4 13v-3h12v3"/><rect x="1.5" y="13" width="5" height="4" rx="1"/><rect x="13.5" y="13" width="5" height="4" rx="1"/></svg>Group</span>':''}</div></div>
  <p class="atlas-overline">${esc(r.primary_category)}</p><h3><a class="atlas-company-link" href="${r.url}">${esc(r.provider)}<span aria-hidden="true">↗</span></a></h3>
  <p class="atlas-company-intro">${esc(r.intro)}</p><div class="atlas-company-foot"><span>${esc(r.evidence_label || (r.verification_status==='verified'?'Source-backed profile':'Evidence under review'))}</span><span class="atlas-company-explore" aria-hidden="true">Explore profile <span>→</span></span></div></article>`;}
function cta() {return `<section class="atlas-profile-invitation" aria-labelledby="profile-atlas-title"><div class="atlas-profile-invitation-copy"><h2 id="profile-atlas-title">More opportunity.<br>Less friction.</h2><p>Work with Trust.med to put Atlas behind your next launch, data initiative, or supply chain challenge.</p><a class="atlas-button" href="/atlas/">Discover Atlas <span aria-hidden="true">↗</span></a></div><div class="atlas-profile-invitation-art"><svg class="atlas-invitation-orbits" viewBox="0 0 400 240" fill="none" aria-hidden="true"><ellipse cx="200" cy="120" rx="175" ry="86" transform="rotate(-18 200 120)"/><ellipse cx="200" cy="120" rx="145" ry="106" transform="rotate(18 200 120)"/><path d="M28 166C80 242 318 207 374 94"/><path d="m350 74 2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6Z" fill="#c6a0ee" stroke="none"/></svg><div class="atlas-profile-banner-lockup"><img src="/assets/img/atlas-globe-light.svg" width="67" height="67" alt=""><span>Atlas<small>Intelligence</small></span></div><div class="atlas-profile-banner-capabilities"><span>Grow</span><span>Understand</span><span>Resolve</span></div></div></section>`;}
module.exports={load,esc,logo,card,cta,aiBadge};
