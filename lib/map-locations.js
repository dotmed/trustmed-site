const names=new Intl.DisplayNames(['en'],{type:'region'});
const aliases={USA:'US','United States':'US',Switzerland:'CH',Germany:'DE','United Kingdom':'GB'};
function countryCode(record){const raw=record.contact?.location?.addressCountry;return aliases[raw]||raw||'';}
function locations(records){
 const counts=new Map();
 for(const record of records){const code=countryCode(record);if(code)counts.set(code,(counts.get(code)||0)+1);}
 return [...counts].map(([code,count])=>({code,name:names.of(code),count})).sort((a,b)=>a.name.localeCompare(b.name));
}
module.exports={countryCode,locations};
