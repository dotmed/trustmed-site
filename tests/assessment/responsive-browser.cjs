const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  const page=await browser.newPage();
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  for(const width of [320,375,390,550,768,800,801,1024,1100,1101,1200,1201,1280,1440,1920]){
   await page.setViewportSize({width,height:900});
   await page.goto((process.env.TEST_ORIGIN||'http://localhost:8080')+'/resources/product-authentication-assessment/');
   await page.evaluate(()=>document.fonts.ready);
   await page.waitForTimeout(100);
   const layout=await page.evaluate(()=>{
    const figure=document.querySelector('.connection-visual').getBoundingClientRect();
    const record=document.querySelector('.connection-record').getBoundingClientRect();
    const clipped=[...document.querySelectorAll('.product-connection h3,.connection-flow-source>div,.connection-package-label,.connection-partner-node')].filter(e=>e.scrollWidth>e.clientWidth+2).map(e=>e.innerText.slice(0,60));
    const cards=[...document.querySelectorAll('.connection-flow-source')].map(card=>{
     const image=card.querySelector('figure').getBoundingClientRect(),copy=card.querySelector(':scope>div').getBoundingClientRect();
     return image.right<=copy.left+1;
    });
    return {overflow:document.documentElement.scrollWidth>innerWidth,clipped,contained:record.bottom<figure.bottom,cards};
   });
   assert.equal(layout.overflow,false,'page overflow at '+width);
   assert.deepEqual(layout.clipped,[],'clipped text at '+width);
   assert(layout.contained,'record outside illustration at '+width);
   assert(layout.cards.every(Boolean),'carrier must remain left of copy at '+width);
  }
  assert.deepEqual(errors,[],'browser errors');
  console.log('PASS: 15 widths, 320–1920px; no page overflow or clipped card text; illustration contained; carrier/text layout intact.');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exit(1)});
