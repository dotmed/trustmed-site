const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {load} = require('../lib/atlas');
const root = path.resolve(__dirname, '../_site');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'assets/social/manifest.json')));
function checkImage(url) {
  assert(url.startsWith('https://trust.med/assets/social/'));
  const buffer = fs.readFileSync(path.join(root, new URL(url).pathname));
  assert.equal(buffer.subarray(1,4).toString(), 'PNG');
  assert.equal(buffer.readUInt32BE(16), 1200);
  assert.equal(buffer.readUInt32BE(20), 630);
}
for (const card of Object.values(manifest)) checkImage(card.url);
let pages = 0;
function walk(dir) {
  for (const entry of fs.readdirSync(dir, {withFileTypes:true})) {
    const file = path.join(dir,entry.name);
    if(entry.isDirectory()) walk(file);
    else if(entry.name.endsWith('.html')) {
      const html = fs.readFileSync(file,'utf8');
      if(!html.includes('property="og:image"')) continue;
      const meta = name => html.match(new RegExp('<meta (?:property|name)="' + name + '" content="([^"]*)"'))?.[1];
      checkImage(meta('og:image'));
      assert.equal(meta('twitter:image'),meta('og:image'));
      assert.equal(meta('og:image:width'),'1200');
      assert.equal(meta('og:image:height'),'630');
      assert(meta('og:image:alt'),file);
      pages++;
    }
  }
}
walk(root);
const companies = load().providers;
const urls = companies.map(p => {
  assert(manifest[p.url], p.url);
  assert(manifest[p.url].alt.includes(p.provider), p.provider);
  return manifest[p.url].url;
});
assert.equal(new Set(urls).size,companies.length);
assert(pages >= companies.length);
console.log('Passed: '+Object.keys(manifest).length+' images, '+pages+' pages, '+companies.length+' distinct company previews.');
