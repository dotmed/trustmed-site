const origin=process.env.TEST_ORIGIN||'http://localhost:8080';
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
(async()=>{
 const b=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  const p=await b.newPage();const errors=[];
  p.on('pageerror',e=>errors.push(e.message));
  await p.route('**/*',r=>r.request().url().startsWith(origin)?r.continue():r.abort());
  for(const route of ['/resources/product-authentication-assessment/','/map/companies/itrace-technologies/']){
   await p.goto(origin+route);
   const scene=p.locator('[data-device-scene]');
   assert.equal(await scene.locator('[data-device=stapler],.device-controls').count(),0);
   assert.match(await scene.innerText(),/SN26041700842/);
   for(const width of [1440,1024,768,390,320]){
    await p.setViewportSize({width,height:1100});
    assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow '+width);
    if(route.startsWith('/map')){
     const fits=await scene.locator('.itrace-banner-auth').evaluate(el=>{
      const frame=el.querySelector('div').getBoundingClientRect(),img=el.querySelector('img').getBoundingClientRect();
      return Math.hypot(img.width,img.height)<frame.width-4;
     });
     assert(fits,'code corners outside circle at '+width);
    }
   }
  }
  assert.deepEqual(errors,[]);
  console.log('PASS: scalpel-only scenes, no rotation controls, five widths, 2DMI contained inside circle, no browser errors.');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)});
