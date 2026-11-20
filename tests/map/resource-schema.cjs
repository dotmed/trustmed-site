const assert=require('node:assert/strict');
const {load}=require('../../lib/atlas');
const {schema}=require('../../lib/profile-schema');
const providers=load().providers;
function graph(provider){return JSON.parse(schema(provider).replace(/^<script[^>]*>/,'').replace(/<\/script>$/,''))['@graph'];}
for(const id of ['optel','trackvision-ai']){
 const provider=providers.find(p=>p.id===id),nodes=graph(provider);
 const docs=nodes.filter(n=>n['@type']==='DigitalDocument');
 assert.equal(docs.length,1);
 const doc=docs[0],resource=provider.resources[0];
 const page=nodes.find(n=>n['@type']==='WebPage'),entity=nodes.find(n=>n['@type']==='Organization');
 assert.equal(doc.name,resource.title);
 assert.equal(doc.description,resource.description);
 assert.equal(doc.inLanguage,'en');
 assert.equal(doc.encoding.contentUrl,'https://trust.med'+resource.file);
 assert.equal(doc.encoding.encodingFormat,'application/pdf');
 assert.equal(doc.encoding.contentSize,resource.size);
 assert.equal(doc.image,'https://trust.med'+resource.cover);
 assert.equal(doc.about['@id'],entity['@id']);
 assert.equal(doc.provider['@id'],entity['@id']);
 assert.equal(page.mentions[0]['@id'],doc['@id']);
 assert.equal(entity.subjectOf[0]['@id'],doc['@id']);
 assert.equal(doc.author,undefined);
 assert.equal(doc.datePublished,undefined);
}
const empty=graph(providers.find(p=>p.id==='altiushub'));
assert.equal(empty.length,3);
assert.equal(empty[0].mentions,undefined);
const malicious={...providers.find(p=>p.id==='optel')};
malicious.resources=[{...malicious.resources[0],title:'</script><script>alert(1)</script>'}];
assert.equal((schema(malicious).match(/<script/g)||[]).length,1);
assert.equal(graph(malicious).find(n=>n['@type']==='DigitalDocument').name,malicious.resources[0].title);
console.log('PASS: document metadata, graph references, optional resources, attribution and safe JSON-LD serialization.');
