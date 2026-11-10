// Builds a local contact sheet for reviewing the generated social images.
const fs = require('node:fs');
const path = require('node:path');
const {Resvg} = require('@resvg/resvg-js');
const root = path.resolve(__dirname,'..');
const manifest = JSON.parse(fs.readFileSync(path.join(root,'_site/assets/social/manifest.json')));
const routes = ['/', '/atlas/', '/map/', '/map/companies/altiushub/', '/resources/product-authentication-assessment/', '/blog/pharmatech-industry-insights/'];
const images = routes.map((route,i) => {
  const file = path.join(root,'_site',new URL(manifest[route].url).pathname);
  return '<image href="data:image/png;base64,'+fs.readFileSync(file).toString('base64')+'" x="'+(10+i%2*620)+'" y="'+(10+Math.floor(i/2)*335)+'" width="600" height="315"/>';
});
const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1240" height="1005"><rect width="1240" height="1005" fill="#d5d2cf"/>'+images.join('')+'</svg>';
fs.mkdirSync(path.join(root,'output'),{recursive:true});
fs.writeFileSync(path.join(root,'output/social-preview.png'), new Resvg(svg).render().asPng());
console.log('output/social-preview.png');
