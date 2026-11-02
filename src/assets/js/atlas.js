(() => {
 'use strict';
 const payload=document.getElementById('atlas-data');if(!payload)return;
 const records=JSON.parse(payload.textContent);
 const $=id=>document.getElementById(`atlas-${id}`);
 const cards=[...document.querySelectorAll('[data-company]')];
 const validCountries=new Set(records.map(r=>r.country).filter(Boolean));
 const validAreas=new Set(records.map(r=>r.area)),validCategories=new Set(records.map(r=>r.category));
 let limit=12, filtered=records;
 const fields=['search','area','category','country','sort','ai','group'];
 const allCategories=[...$('category').options].map(o=>({value:o.value,text:o.textContent,area:o.dataset.layer}));
 function readURL(){const p=new URLSearchParams(location.search);$('search').value=p.get('q')||'';$('country').value=validCountries.has(p.get('country'))?p.get('country'):'';$('area').value=validAreas.has(p.get('area'))?p.get('area'):'';const cat=validCategories.has(p.get('category'))?p.get('category'):'';categories(cat);$('sort').value=['az','za'].includes(p.get('sort'))?p.get('sort'):'featured';$('ai').checked=p.get('ai')==='1';$('group').checked=p.get('group')==='1';limit=12;render();}
 function categories(selected=$('category').value){const area=$('area').value;$('category').replaceChildren(...allCategories.filter(c=>!c.value||!area||c.area===area).map(c=>new Option(c.text,c.value)));$('category').value=[...$('category').options].some(o=>o.value===selected)?selected:'';}
 function save(mode='push'){const url=new URL(location.href);for(const key of ['q','area','category','country','sort','ai','group'])url.searchParams.delete(key);if($('search').value.trim())url.searchParams.set('q',$('search').value.trim());for(const key of ['area','category','country'])if($(key).value)url.searchParams.set(key,$(key).value);if($('sort').value!=='featured')url.searchParams.set('sort',$('sort').value);for(const key of ['ai','group'])if($(key).checked)url.searchParams.set(key,'1');if(url.href!==location.href)history[mode==='replace'?'replaceState':'pushState']({},'',url);}
 function render(){syncCountries();const query=$('search').value.trim().toLowerCase();filtered=records.filter(r=>(!query||r.search.includes(query))&&(!$('area').value||r.area===$('area').value)&&(!$('category').value||r.category===$('category').value)&&(!$('country').value||r.country===$('country').value)&&(!$('ai').checked||r.ai)&&(!$('group').checked||r.group)).sort((a,b)=>($('sort').value==='featured'?a.priority-b.priority:0)||a.name.localeCompare(b.name)*($('sort').value==='za'?-1:1));const visible=new Set(filtered.slice(0,limit).map(r=>r.id));for(const card of cards)card.hidden=!visible.has(card.dataset.company);for(const r of filtered)$('results').append(cards.find(c=>c.dataset.company===r.id));$('count').textContent=`${filtered.length} ${filtered.length===1?'profile':'profiles'}${filtered.length!==records.length?` of ${records.length}`:''} · ${Math.min(limit,filtered.length)} shown`;$('empty').hidden=filtered.length>0;$('more').hidden=limit>=filtered.length;$('more').textContent=`Show more companies (${filtered.length-Math.min(limit,filtered.length)} remaining) ↓`;document.querySelectorAll('[data-area-link]').forEach(a=>{const active=a.dataset.areaLink===$('area').value;a.classList.toggle('is-selected',active);if(active)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});}
 function reset(){for(const key of fields){if(['ai','group'].includes(key))$(key).checked=false;else $(key).value=key==='sort'?'featured':'';}categories('');limit=12;save();render();}
 for(const key of fields)$(key).addEventListener(key==='search'?'input':'change',()=>{if(key==='area')categories('');limit=12;save(key==='search'?'replace':'push');render();});
 document.querySelectorAll('[data-area-link],[data-preset]').forEach(a=>a.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();const country=$('country').value;for(const key of fields){if(['ai','group'].includes(key))$(key).checked=false;else $(key).value=key==='sort'?'featured':'';}$('country').value=country;if(a.dataset.areaLink)$('area').value=a.dataset.areaLink;else $(a.dataset.preset).checked=true;categories('');limit=12;save();render();document.getElementById('explore').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});$('search').focus({preventScroll:true});}));
 $('reset').onclick=reset;$('empty-reset').onclick=reset;$('more').onclick=()=>{const previous=limit;limit+=12;render();const next=cards.find(c=>c.dataset.company===filtered[previous]?.id);next?.querySelector('h3 a').focus({preventScroll:true});};
 document.querySelector('.atlas-controls').hidden=false;
 if(matchMedia('(max-width: 700px)').matches)document.querySelector('.atlas-filters').open=false;
 const banner=document.querySelector('.atlas-editorial-banner');
 if(banner && 'IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){banner.classList.add('is-visible');observer.disconnect();}},{threshold:.25});observer.observe(banner);}
 const countryLinks=[...document.querySelectorAll('[data-country]')];
 function syncCountries(){
  const selected=$('country').value;
  for(const link of countryLinks){const active=link.dataset.country===selected;link.classList.toggle('is-selected',active);if(active)link.setAttribute('aria-current','true');else link.removeAttribute('aria-current');}
  $('country-clear').hidden=!selected;
  $('country-clear').textContent=selected?`Business location: ${$('country').selectedOptions[0].textContent.replace(/ \(\d+\)$/,'')} ×`:'';
  $('country-clear').setAttribute('aria-label','Clear business location filter');
 }
 function setCountry(code,scroll){$('country').value=code;limit=12;save();render();if(scroll){document.getElementById('explore').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});$('search').focus({preventScroll:true});}}
 countryLinks.forEach(link=>link.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();setCountry(link.dataset.country===$('country').value?'':link.dataset.country,true);}));
 $('country-clear').addEventListener('click',()=>{setCountry('',false);$('search').focus({preventScroll:true});});
 const countryScroll=document.querySelector('.map-country-scroll');
 const countrySteps=[...document.querySelectorAll('[data-country-step]')];
 const track=countryScroll.querySelector('.map-country-track');
 const ribbon=document.querySelector('.map-country-ribbon');
 const motionButton=document.querySelector('.map-country-motion');
 const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
 let paused=false,hovered=false,touching=false,inView=false,lastFrame=0,remainder=0,resumeAt=0;
 // Recycle only off-screen flags. One set of real links keeps keyboard navigation unique.
 function rebalance(){
  if(countryScroll.scrollWidth<=countryScroll.clientWidth)return;
  let first=track.firstElementChild;
  while(countryScroll.scrollLeft>first.offsetLeft+first.offsetWidth+24){
   const distance=first.nextElementSibling.offsetLeft-first.offsetLeft;
   track.append(first);countryScroll.scrollLeft-=distance;first=track.firstElementChild;
  }
  if(countryScroll.scrollLeft<24){
   const last=track.lastElementChild;
   const distance=last.offsetWidth+parseFloat(getComputedStyle(track).columnGap);
   track.prepend(last);countryScroll.scrollLeft+=distance;
  }
 }
 function updateSteps(){const scrollable=countryScroll.scrollWidth>countryScroll.clientWidth;for(const button of countrySteps){button.hidden=!scrollable;button.disabled=false;}}
 function centerAmerica(){
  updateSteps();
  const flag=track.querySelector('[data-country="US"]');
  if(flag)countryScroll.scrollLeft=flag.offsetLeft+flag.offsetWidth/2-countryScroll.clientWidth/2;
 }
 countrySteps.forEach(button=>button.addEventListener('click',()=>{
  resumeAt=performance.now()+4000;
  // Immediate positioning keeps manual arrows predictable alongside the seamless loop.
  if(Number(button.dataset.countryStep)<0){
   const count=Math.ceil(countryScroll.clientWidth/64);
   for(let i=0;i<count;i++){const last=track.lastElementChild;const distance=last.offsetWidth+parseFloat(getComputedStyle(track).columnGap);track.prepend(last);countryScroll.scrollLeft+=distance;}
  }
  countryScroll.scrollLeft+=Number(button.dataset.countryStep)*countryScroll.clientWidth*.65;rebalance();
 }));
 ribbon.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')hovered=true;});
 ribbon.addEventListener('pointerleave',()=>{hovered=false;});
 ribbon.addEventListener('pointerdown',()=>{touching=true;});
 window.addEventListener('pointerup',()=>{if(touching)resumeAt=performance.now()+4000;touching=false;});
 window.addEventListener('pointercancel',()=>{touching=false;resumeAt=performance.now()+4000;});
 countryScroll.addEventListener('wheel',()=>{resumeAt=performance.now()+4000;},{passive:true});
 function updateMotion(){motionButton.hidden=reducedMotion.matches;motionButton.setAttribute('aria-pressed',String(paused));motionButton.setAttribute('aria-label',paused?'Resume flag scrolling':'Pause flag scrolling');motionButton.firstElementChild.textContent=paused?'▷':'Ⅱ';}
 motionButton.addEventListener('click',()=>{paused=!paused;updateMotion();});
 reducedMotion.addEventListener('change',updateMotion);updateMotion();
 new IntersectionObserver(entries=>{inView=entries.some(e=>e.isIntersecting);},{threshold:.1}).observe(ribbon);
 function animate(now){
  const elapsed=Math.min(now-lastFrame,50);lastFrame=now;
  if(inView&&!document.hidden&&!paused&&!reducedMotion.matches&&!hovered&&!touching&&!ribbon.contains(document.activeElement)&&now>resumeAt){
   rebalance();remainder+=elapsed*.012;
   if(remainder>=1){const pixels=Math.floor(remainder);countryScroll.scrollLeft+=pixels;remainder-=pixels;}
  }
  requestAnimationFrame(animate);
 }
 window.addEventListener('resize',updateSteps);centerAmerica();requestAnimationFrame(animate);
 window.addEventListener('popstate',readURL);readURL();
})();
