// Public contact details only. Private form submitter details never enter this data.
function validateContacts(contacts, ids) {
 const url=value=>{try{return ['https:','http:'].includes(new URL(value).protocol);}catch{return false;}};
 for(const [id,c] of Object.entries(contacts)){
  if(!ids.has(id))throw new Error(`Unknown contact record: ${id}`);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(c.reviewed_date))throw new Error(`Missing contact review date: ${id}`);
  for(const field of ['email','phone','location'])if(c[field]&&!url(c[field].source_url))throw new Error(`Missing ${field} source: ${id}`);
  if(c.email&&!/^[\w.+-]+@[\w.-]+\.[a-z]{2,}$/i.test(c.email.value))throw new Error(`Invalid company email: ${id}`);
  if(c.phone&&!/^\+?[\d ().-]{7,35}$/.test(c.phone.value))throw new Error(`Invalid company phone: ${id}`);
  if(c.location&&(!c.location.display||!c.location.addressLocality||!c.location.addressCountry))throw new Error(`Incomplete business location: ${id}`);
  if(c.contact_url&&!url(c.contact_url))throw new Error(`Invalid contact link: ${id}`);
 }
 return contacts;
}
module.exports={validateContacts};
