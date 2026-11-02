const {load,esc}=require('../lib/atlas');
module.exports=class {
 data(){return {permalink:'/sitemap.xml',eleventyExcludeFromCollections:true};}
 render({collections}){
  const skip=/^\/(?:404(?:\.html|\/)|map\/(?:update-profile|submit-company)\/)/;
  const urls=new Set(['/', '/map/', ...load().providers.map(r=>r.url)]);
  for(const item of collections.all){
   const url=item.data.seo?.canonical||item.url;
   if(url?.startsWith('/')&&url.endsWith('/')&&!skip.test(url)&&!item.data.noindex)urls.add(url);
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...urls].sort().map(u=>`  <url><loc>https://trust.med${esc(u)}</loc></url>`).join('\n')}\n</urlset>`;
 }
};
