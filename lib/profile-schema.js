const {esc}=require('./atlas');
const origin='https://trust.med';
const jsonScript=value=>`<script type="application/ld+json">${JSON.stringify(value).replace(/</g,'\\u003c')}</script>`;
function address(location){
 if(!location)return undefined;
 const fields=['streetAddress','addressLocality','addressRegion','postalCode','addressCountry'];
 return {'@type':'PostalAddress',...Object.fromEntries(fields.filter(k=>location[k]).map(k=>[k,location[k]]))};
}
function schema(r){
 const url=origin+r.url,entityId=r.id==='trust-med'?origin+'/#organization':url+'#entity';
 const product=r.record_kind==='Product',contact=r.contact||{};
 const organizationContact={...(contact.email?{email:contact.email.value}:{}),...(contact.phone?{telephone:contact.phone.value}:{}),...(contact.location?{address:address(contact.location)}:{})};
 const entity={'@type':product?'SoftwareApplication':'Organization','@id':entityId,name:r.provider,description:r.intro,url:r.website?.url||url,mainEntityOfPage:{'@id':url+'#webpage'}};
 if(r.logo){entity[product?'image':'logo']=origin+r.logo.url;}
 if(!product){Object.assign(entity,organizationContact);if(r.linkedin)entity.sameAs=[r.linkedin.url];}
 else if(contact.organization){entity.provider={'@type':'Organization',name:contact.organization,...organizationContact};}
 const breadcrumb={'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:[{'@type':'ListItem',position:1,name:'Pharmatech Map',item:origin+'/map/'},{'@type':'ListItem',position:2,name:r.layer,item:origin+'/map/?area='+r.area+'#explore'},{'@type':'ListItem',position:3,name:r.provider,item:url}]};
 const page={'@type':'WebPage','@id':url+'#webpage',url,name:`${r.provider} | Pharmatech Map`,description:r.intro,inLanguage:'en',mainEntity:{'@id':entityId},breadcrumb:{'@id':url+'#breadcrumb'},isPartOf:{'@type':'CollectionPage','@id':origin+'/map/#webpage',url:origin+'/map/',name:'Pharmatech Map'},publisher:{'@id':origin+'/#organization'}};
 return jsonScript({'@context':'https://schema.org','@graph':[page,entity,breadcrumb]});
}
const contactIcons={
 email:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>',
 phone:'<path d="m8 3 3 5-3 3a15 15 0 0 0 5 5l3-3 5 3c0 3-2 5-5 5C9 21 3 15 3 8c0-3 2-5 5-5Z"/>',
 location:'<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/>'
};
const contactIcon=kind=>`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${contactIcons[kind]}</svg>`;
function locationMap(r){
 const loc=r.contact?.location;if(!loc)return '';
 // Search only the sourced address; city-only records must not imply a precise office pin.
 const query=[loc.streetAddress,loc.addressLocality,loc.addressRegion,loc.postalCode,loc.addressCountry].filter(Boolean).join(', ');
 const mapsURL='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(query);
 const embedURL='https://maps.google.com/maps?q='+encodeURIComponent(query)+'&z='+(loc.streetAddress?'15':'11')+'&output=embed';
 const {countryCode}=require('./map-locations');const code=countryCode(r).toLowerCase();
 return `<div class="atlas-contact-map"><div class="atlas-contact-map-heading"><div><span>${loc.streetAddress?'BUSINESS LOCATION':'CITY VIEW'}</span><strong>${esc(loc.addressLocality)}</strong></div><img src="/assets/img/flags/${esc(code)}.svg" width="28" height="21" alt="${esc(new Intl.DisplayNames(['en'],{type:'region'}).of(code.toUpperCase()))}"></div><iframe src="${esc(embedURL)}" title="${esc(loc.streetAddress?'Map of '+(r.contact.organization||r.provider)+' business address':'Map of '+loc.addressLocality+' (city view)')}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe><a class="atlas-contact-map-link" href="${esc(mapsURL)}" target="_blank" rel="noopener noreferrer">Open in Google Maps <span aria-hidden="true">↗</span></a></div>`;
}
function contactCard(r){
 const c=r.contact;if(!c)return '';
 const rows=[];
 function row(kind,label,content){return `<div class="atlas-contact-method"><dt><span class="atlas-contact-icon">${contactIcon(kind)}</span>${esc(label)}</dt><dd>${content}</dd></div>`;}
 if(c.email)rows.push(row('email',c.email.label||'Email',`<a href="mailto:${esc(c.email.value)}">${esc(c.email.value)} <span aria-hidden="true">↗</span></a>`));
 if(c.phone)rows.push(row('phone',c.phone.label||'Phone',`<a href="tel:${esc(c.phone.value.replace(/\(0\)/g,'').replace(/[^+\d]/g,''))}">${esc(c.phone.value)} <span aria-hidden="true">↗</span></a>`));
 if(c.location)rows.push(row('location',c.location.label||(c.location.streetAddress?'Business address':'Business location'),esc(c.location.display)));
 if(!rows.length&&!c.contact_url)return '';
 const sources=[...new Set([c.email?.source_url,c.phone?.source_url,c.location?.source_url].filter(Boolean))];
 return `<section class="atlas-profile-contact${c.location?' atlas-profile-contact--mapped':''}" id="profile-contact"><header class="atlas-contact-header"><p class="atlas-eyebrow"><span aria-hidden="true"></span>GET IN TOUCH</p><h2>Connect with ${esc(c.organization||r.provider)}.</h2></header><div class="atlas-contact-layout"><div class="atlas-contact-information"><dl>${rows.join('')}</dl>${c.contact_url?`<a class="atlas-contact-cta" href="${esc(c.contact_url)}" target="_blank" rel="noopener noreferrer">Visit the contact page <span aria-hidden="true">↗</span></a>`:''}</div>${locationMap(r)}</div>${sources.length?`<details><summary>Contact sources · Reviewed ${esc(c.reviewed_date)}</summary><ul class="atlas-sources">${sources.map(u=>`<li><a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(u)}</a></li>`).join('')}</ul></details>`:''}</section>`;
}
module.exports={schema,contactCard,address,locationMap};
