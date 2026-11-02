// Render the downloadable poster from exactly the same publication data as the site.
const fs=require('node:fs');
const path=require('node:path');
const PDFDocument=require('../.tooling/pdf/node_modules/pdfkit/js/pdfkit.js');
const {createCanvas,loadImage}=require('../.tooling/pdf/node_modules/@napi-rs/canvas');
const root=path.resolve(__dirname,'..');
const data=require('../../lib/atlas').load();
const manifest=new Map(JSON.parse(fs.readFileSync(path.join(root,'assets/logo-manifest.json'))).map(x=>[x.id,x]));
const W=3400,M=52,gap=22,cw=(W-M*2-gap*3)/4,tileGap=10,pad=16,rowH=108,headerH=48;
const tileW=(cw-pad*2-tileGap*5)/6;
const ink='#25212b',muted='#786d80';
const groups=data.areas.map(area=>({...area,categories:data.categories.filter(c=>c.layer===area.name).map(c=>({...c,rows:data.providers.filter(r=>r.area===area.id&&r.primary_category===c.category&&r.map_status!=='directory_only')})).filter(c=>c.rows.length)}));
const ph=(rows,cols)=>headerH+pad+Math.ceil(rows.length/cols)*(rowH+tileGap);
const coreH=Math.max(...groups.slice(0,4).map(g=>g.categories.reduce((h,c)=>h+ph(c.rows,6)+16,0)));
const service=groups[4],serviceH=Math.max(...service.categories.map(c=>ph(c.rows,6)));
const top=315,serviceY=top+90+coreH+30,H=serviceY+90+serviceH+200;
const out=path.join(root,'deliverables/Pharmaceutical_Logo_Map.pdf');
(async()=>{
 const globeImage=await loadImage(path.resolve(root,'../src/assets/img/atlas-globe.svg'));
 const canvas=createCanvas(240,240);canvas.getContext('2d').drawImage(globeImage,0,0,240,240);const globe=canvas.toBuffer('image/png');
 const doc=new PDFDocument({autoFirstPage:false,info:{Title:'Pharmatech Map',Author:'Trust.med · Atlas',Subject:'Pharmaceutical supply chain companies and technologies · Updated November 2, 2026'}});
 doc.registerFont('Regular',path.join(root,'assets/fonts/DejaVuSans.ttf'));doc.registerFont('Bold',path.join(root,'assets/fonts/DejaVuSans-Bold.ttf'));
 const stream=fs.createWriteStream(out);doc.pipe(stream);doc.addPage({size:[W,H],margin:0});
 const text=(s,x,y,w,size=12,bold=false,color=ink,opts={})=>doc.font(bold?'Bold':'Regular').fontSize(size).fillColor(color).text(s,x,y,{width:w,lineBreak:false,...opts});
 const box=(x,y,w,h,r,fill,stroke)=>{doc.roundedRect(x,y,w,h,r).lineWidth(1);if(stroke)doc.fillAndStroke(fill,stroke);else doc.fill(fill);};
 function star(x,y,size,color){doc.save().translate(x,y).scale(size/10).path('M0 -5 L1.5 -1.5 L5 0 L1.5 1.5 L0 5 L-1.5 1.5 L-5 0 L-1.5 -1.5 Z').fill(color).restore();}
 function groupIcon(x,y){doc.save().strokeColor('#6b8677').lineWidth(1).roundedRect(x+4,y,6,4,1).stroke().moveTo(x+7,y+4).lineTo(x+7,y+8).moveTo(x+2,y+11).lineTo(x+2,y+8).lineTo(x+12,y+8).lineTo(x+12,y+11).stroke().roundedRect(x,y+11,4,4,1).stroke().roundedRect(x+10,y+11,4,4,1).stroke().restore();}
 function badge(kind,x,y){if(kind==='ai'){box(x,y,38,21,5,'#f0e8f7','#d5c2e5');star(x+9,y+10,10,'#7950a0');text('AI',x+18,y+4,18,10,true,'#45255d');}else{box(x,y,57,21,5,'#f0f4f2','#d5ddd9');groupIcon(x+5,y+3);text('Group',x+23,y+5,31,8.5,true,'#43594d');}}
 doc.rect(0,0,W,H).fill('#faf8fc');
 // A spacious editorial masthead, with a quiet Atlas orbital detail.
 doc.save().rect(0,0,W,285).clip();
 doc.rect(0,0,W,285).fill(doc.linearGradient(0,0,W,180).stop(0,'#ffffff').stop(.55,'#ffffff').stop(1,'#f0e8f8'));
 doc.strokeColor('#dacbe8').lineWidth(1.2);
 doc.moveTo(1670,180).bezierCurveTo(2000,8,2430,8,2835,105).stroke();
 doc.moveTo(1810,203).bezierCurveTo(2200,80,2540,76,2810,118).stroke();
 doc.moveTo(2210,-25).bezierCurveTo(2360,50,2570,148,2850,176).stroke();
 star(2435,43,17,'#a27abf');star(2787,113,10,'#baa0ce');star(2090,151,7,'#d0bedf');
 doc.restore();
 box(M,40,34,4,2,'#9870b8');
 text('THE PHARMACEUTICAL TECHNOLOGY LANDSCAPE',M+48,34,1600,13,true,muted,{characterSpacing:2});
 text('Pharmatech Map',M,68,2000,78,true);
 text('Find the companies and tools to power your supply chain.',M+3,169,2000,23,false,muted);
 const brandX=W-M-400;
 text('Mapped with',brandX,68,155,17,false,muted);
 doc.image(globe,brandX+148,37,{width:80,height:80});
 text('Atlas',brandX+229,43,173,51,true);
 text('Intelligence',brandX+232,102,170,13,false,'#9673b0',{characterSpacing:1});
 doc.moveTo(brandX,142).lineTo(W-M,142).lineWidth(1).strokeColor('#d7c9e2').stroke();
 text('Updated November 2, 2026',brandX,158,400,14,false,muted,{align:'right'});
 const ai=data.providers.filter(r=>r.ai).length,owned=data.providers.filter(r=>r.ownership).length;
 const metrics=[[String(data.providers.length),'companies & technologies',M,445],[String(groups.length),'technology areas',M+465,320],[String(groups.reduce((n,g)=>n+g.categories.length,0)),'specialties represented',M+805,390]];
 for(const [value,label,x,w] of metrics){text(value,x,237,80,29,true);const offset=value.length>2?82:51;text(label,x+offset,249,w-offset,14,false,muted);}
 badge('ai',W-M-605,244);text(`${ai} documented offerings`,W-M-554,247,245,13,false,muted);badge('group',W-M-285,244);text(`${owned} corporate relationships`,W-M-215,247,220,13,false,muted);
 doc.moveTo(M,285).lineTo(W-M,285).lineWidth(1).strokeColor('#e4dce9').stroke();
 function areaHeader(g,x,y,w,index){
  const tints=['#fff0e8','#edf2ff','#edf7f1','#f3edfc','#eff1f3'];
  box(x,y,w,74,12,tints[index], '#e5dfe9');
  text(String(index+1).padStart(2,'0'),x+17,y+14,65,32,true,g.color);
  text(g.name,x+85,y+14,w-170,21,true,ink);text(g.short,x+85,y+45,w-110,12,false,muted);
  text(String(g.count),x+w-65,y+20,45,22,true,g.color,{align:'right'});
 }
 function tile(r,x,y){
  box(x,y+3,tileW,rowH,9,'#ece7f0');box(x,y,tileW,rowH,9,'#ffffff','#ded7e5');
  const a=manifest.get(r.id);if(!a)throw Error('Missing logo: '+r.id);
  if(r.ownership)badge('group',x+6,y+6);
  if(r.ai){if(r.id==='trust-med'){doc.image(globe,x+tileW-55,y+5,{width:23,height:23});text('Atlas',x+tileW-32,y+11,30,8,true);}else badge('ai',x+tileW-44,y+6);}
  const bx=x+9,by=y+36,bw=tileW-18,bh=42;
  if(a.needs_dark_background)box(bx,by,bw,bh,4,'#243b35');
  const scale=a.display_scale||1;
  doc.save().rect(bx,by,bw,bh).clip();doc.image(path.join(root,a.path),bx+4-(bw-8)*(scale-1)/2,by+4-(bh-8)*(scale-1)/2,{fit:[(bw-8)*scale,(bh-8)*scale],align:'center',valign:'center'});doc.restore();
  const name=r.provider.replace('NNIT (includes former Excellis)','NNIT / Excellis').replace('S.C. Argon Solutions S.R.L','Argon Solutions');
  let size=10;doc.font('Regular').fontSize(size);while(doc.widthOfString(name)>tileW-12&&size>6.5){size-=.25;doc.fontSize(size);}
  text(name,x+6,y+rowH-20,tileW-12,size,false,'#65586e',{align:'center'});doc.link(x,y,tileW,rowH,'https://trust.med'+r.url);
 }
 function panel(c,x,y,w,color){
  const h=ph(c.rows,6);box(x,y,w,h,12,'#ffffff','#e4dde9');
  doc.save().roundedRect(x,y,w,h,12).clip().rect(x,y,w,headerH).fill('#f4f0f7').restore();
  box(x+16,y+16,4,16,2,color);text(c.category,x+29,y+16,w-75,13,true);text(String(c.rows.length),x+w-39,y+17,23,11,false,muted,{align:'right'});
  c.rows.forEach((r,i)=>tile(r,x+pad+(i%6)*(tileW+tileGap),y+headerH+Math.floor(i/6)*(rowH+tileGap)));
  return h;
 }
 groups.slice(0,4).forEach((g,i)=>{const x=M+i*(cw+gap);areaHeader(g,x,top,cw,i);let y=top+90;g.categories.forEach(c=>{y+=panel(c,x,y,cw,g.color)+16;});});
 areaHeader(service,M,serviceY,W-M*2,4);
 service.categories.forEach((c,i)=>panel(c,M+i*(cw+gap),serviceY+90,cw,service.color));
 const fy=H-159;
 box(M,fy,W-2*M,122,16,'#292230');
 doc.save().roundedRect(M,fy,W-2*M,122,16).clip();
 doc.rect(M,fy,W-2*M,122).fill(doc.linearGradient(M,fy,W-M,fy+122).stop(0,'#292230').stop(.65,'#33263f').stop(1,'#48315b'));
 doc.moveTo(W-1050,fy+145).bezierCurveTo(W-800,fy-70,W-300,fy-45,W-80,fy+20).strokeColor('#80618e').lineWidth(1).stroke();
 star(W-865,fy+44,12,'#b99bce');doc.restore();
 text('Your next connection starts here.',M+30,fy+22,1900,29,true,'#faf6fe');
 text('Click any company to explore its profile, capabilities, and website.',M+30,fy+70,1900,17,false,'#d5c5e0');
 const bx=W-M-480;
 box(bx,fy+26,448,65,10,'#e9dcf4');
 text('Explore the full map',bx+24,fy+42,345,22,true,'#382544');
 text('↗',bx+383,fy+39,40,29,false,'#7950a0');
 doc.link(bx,fy+26,448,65,'https://trust.med/map/');
 text('trust.med/map',bx,fy+100,448,11,false,'#cbb6db',{align:'center'});
 doc.link(brandX,37,400,90,'https://trust.med/atlas/');
 text('Primary placement is a navigation aid. Companies may span several specialties. AI applies to documented offerings; Group identifies a sourced corporate relationship.',M,H-23,W-2*M,10,false,muted,{align:'center'});
 doc.end();await new Promise((resolve,reject)=>{stream.on('finish',resolve);stream.on('error',reject)});
 fs.writeFileSync(path.join(root,'deliverables/public-map-manifest.json'),JSON.stringify({updated:'2026-11-02',width:W,height:H,records:data.providers.length,ai_count:ai,group_count:owned,categories:groups.map(g=>({name:g.name,count:g.count,specialties:g.categories.map(c=>({name:c.category,ids:c.rows.map(r=>r.id)}))})),profiles:data.providers.map(r=>({id:r.id,url:'https://trust.med'+r.url,ai:!!r.ai,group:!!r.ownership}))},null,2)+'\n');
 console.log(JSON.stringify({out,width:W,height:H,records:data.providers.length,ai,groups:owned}));
})().catch(e=>{console.error(e);process.exit(1)});
