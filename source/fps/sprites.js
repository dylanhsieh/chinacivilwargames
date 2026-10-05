/* ===== stubs the shared art code expects ===== */
let T=0,camX=0,S='kmt',EN='ccp',LV=0,skyFlash=0,skyFX=0,state='title';
let parts=[],plats=[],scorch=[],P=null,L={walls:[],theme:'village'};
const VIG=document.createElement('canvas');VIG.width=W;VIG.height=H;{const g=VIG.getContext('2d');const rg=g.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,W*.62);rg.addColorStop(0,'rgba(0,0,0,0)');rg.addColorStop(1,'rgba(10,4,2,.6)');g.fillStyle=rg;g.fillRect(0,0,W,H);g.fillStyle='rgba(0,0,0,.1)';for(let y=0;y<H;y+=2)g.fillRect(0,y,W,1)}

/* ===== sprite factory: front-facing chibis, cached, with a white "hit flash" twin ===== */
const SPC=new Map();
function mk(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.imageSmoothingEnabled=false;fn(g);return c}
function sprite(key,w,h,fn){let s=SPC.get(key);if(!s){const n=mk(w,h,fn);s={n,f:mk(w,h,g=>{g.drawImage(n,0,0);g.globalCompositeOperation='source-atop';g.fillStyle='rgba(255,255,255,.85)';g.fillRect(0,0,w,h)})};SPC.set(key,s)}return s}
const R=(g,x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h)};
function frontFace(g,emo,ox=0,oy=0){const K='#1a1110',MO='#5a0e0e',X=(x,y,w,h,c)=>R(g,ox+x,oy+y,w,h,c);
 const eye=x=>{X(x,15,3,4,K);X(x,15,1,1,'#fff')};
 const angry=()=>{X(12,12,3,1,K);X(15,13,2,1,K);X(25,12,3,1,K);X(23,13,2,1,K)};
 switch(emo){
 case 'dead':for(const x of[13,23]){X(x,15,1,1,K);X(x+2,15,1,1,K);X(x+1,16,1,1,K);X(x,17,1,1,K);X(x+2,17,1,1,K)}X(17,21,6,1,K);X(19,22,2,2,'#d0504a');break;
 case 'hurt':X(13,15,1,1,K);X(14,16,1,1,K);X(13,17,1,1,K);X(26,15,1,1,K);X(25,16,1,1,K);X(26,17,1,1,K);X(18,20,4,3,MO);X(10,12,1,3,'#9fd3ff');break;
 case 'scared':X(12,14,5,5,'#fff');X(14,16,2,2,K);X(23,14,5,5,'#fff');X(24,16,2,2,K);X(12,12,3,1,K);X(25,12,3,1,K);X(17,21,2,1,MO);X(19,22,2,1,MO);X(21,21,2,1,MO);X(30,10,1,3,'#9fd3ff');X(29,15,1,2,'#9fd3ff');break;
 case 'happy':X(12,17,1,1,K);X(13,16,2,1,K);X(15,17,1,1,K);X(24,17,1,1,K);X(25,16,2,1,K);X(27,17,1,1,K);X(16,20,8,3,MO);X(16,20,8,1,'#fff');X(10,19,3,1,'#e88a7a');X(27,19,3,1,'#e88a7a');break;
 case 'cry':X(13,16,3,1,K);X(24,16,3,1,K);X(12,14,3,1,K);X(25,13,3,1,K);X(13,17,1,5,'#9fd3ff');X(26,17,1,4,'#9fd3ff');X(17,20,6,3,MO);X(18,23,4,1,MO);break;
 case 'shout':angry();X(13,15,3,2,K);X(24,15,3,2,K);X(15,18,10,7,MO);X(15,18,10,1,'#fff');X(16,23,8,1,'#d0504a');X(10,18,3,1,'#e88a7a');X(27,18,3,1,'#e88a7a');break;
 case 'grit':angry();eye(13);eye(24);X(15,20,10,3,'#fff');X(17,20,1,3,'#999');X(20,20,1,3,'#999');X(23,20,1,3,'#999');break;
 case 'determined':angry();eye(13);eye(24);X(17,21,6,1,'#7a3a2a');break;
 case 'blink':angry();X(13,17,3,1,K);X(24,17,3,1,K);X(17,21,6,1,'#7a3a2a');break;
 case 'lookL':angry();X(12,15,3,4,K);X(23,15,3,4,K);X(12,15,1,1,'#fff');X(23,15,1,1,'#fff');X(17,21,6,1,'#7a3a2a');break;
 case 'lookR':angry();X(14,15,3,4,K);X(25,15,3,4,K);X(14,15,1,1,'#fff');X(25,15,1,1,'#fff');X(17,21,6,1,'#7a3a2a');break;
 case 'smug':X(13,16,3,1,K);X(24,16,3,1,K);X(13,15,3,1,K);X(24,15,3,1,K);X(17,21,6,1,'#7a3a2a');X(23,20,1,1,'#7a3a2a');break;
 default:X(12,13,3,1,K);X(25,13,3,1,K);eye(13);eye(24);X(18,21,4,1,'#7a3a2a')}}
function frontHead(g,fac,emo,ox=0,oy=0){const pc=PAL[fac]||PAL.civ,X=(x,y,w,h,c)=>R(g,ox+x,oy+y,w,h,c);
 X(11,7,18,19,SK);X(9,9,22,15,SK);X(10,24,20,1,SKS);X(8,14,2,5,SKS);X(30,14,2,5,SKS);X(12,25,16,1,SKS);
 frontFace(g,emo,ox,oy);
 if(fac==='kmt'){X(8,3,24,7,pc.h);X(9,2,22,1,pc.uh);X(9,9,22,2,pc.hs);X(11,11,18,2,'#111');X(18,4,4,4,pc.s);X(19,5,2,2,pc.hs)}
 else if(fac==='ccp'){X(9,4,22,7,pc.h);X(11,3,18,1,pc.uh);X(9,10,22,1,pc.hs);X(12,11,16,1,pc.hs);X(19,4,2,6,pc.s);X(17,6,6,2,pc.s);X(17,8,2,2,pc.s);X(21,8,2,2,pc.s)}
 else if(fac==='straw'){X(14,0,12,2,'#9c7c3c');X(10,2,20,2,'#c9a65a');X(5,4,30,2,'#c9a65a');X(1,6,38,3,'#c9a65a');X(1,9,38,1,'#9c7c3c')}}
function frontSoldier(g,o){const pc=PAL[o.fac],X=(x,y,w,h,c)=>R(g,x,y,w,h,c),f=o.frame||0;
 const l1=o.pose==='run'&&f%2===0?3:0,l2=o.pose==='run'&&f%2===1?3:0;
 X(13,39-l1,5,6,pc.d);X(13,41-l1,5,1,pc.p);X(12,44-l1,7,3,BOOT);X(22,39-l2,5,6,pc.u);X(22,41-l2,5,1,pc.p);X(21,44-l2,7,3,BOOT);
 X(11,25,18,15,pc.u);X(9,27,22,11,pc.u);X(9,27,2,11,pc.d);X(29,27,2,9,pc.uh);X(15,25,10,2,pc.d);X(9,36,22,2,BELT);X(19,36,2,2,'#d9a441');X(20,29,1,1,'#d9a441');X(20,32,1,1,'#d9a441');X(11,33,3,3,BELT);X(26,33,3,3,BELT);
 if(o.officer){X(9,26,5,2,'#d9a441');X(26,26,5,2,'#d9a441')}
 frontHead(g,o.fac,o.emo||'normal');
 if(o.officer)X(9,9,22,2,'#d9a441');
 if(o.surr){X(4,8,4,20,pc.u);X(32,8,4,20,pc.u);X(3,5,5,4,SK);X(32,5,5,4,SK);X(35,0,1,10,WOOD);X(36,0,4,4,'#f4f4f4')}
 else if(o.throwing){X(30,10,4,16,pc.u);X(30,7,5,4,SK);X(31,1,2,7,WOOD);X(30,0,4,3,'#3a4030');X(8,28,4,8,pc.d);X(8,35,4,3,SK)}
 else if(o.gun==='pistol'){X(9,28,4,8,pc.d);X(9,35,4,3,SK);X(27,28,4,6,pc.u);X(22,31,7,4,pc.u);X(18,30,5,5,SK);X(18,27,4,3,'#222');X(19,28,2,1,'#000');if(o.item==='board'){X(3,30,8,10,'#c8b890');X(4,32,6,1,'#777');X(4,34,6,1,'#777');X(4,36,4,1,'#c8372d')}}
 else if(o.gun==='grenade'){X(9,28,4,8,pc.d);X(9,35,4,3,SK);X(27,28,4,8,pc.u);X(27,35,4,3,SK);X(28,32,2,6,WOOD);X(27,30,4,3,'#3a4030')}
 else if(o.gun){X(25,33,8,4,WOOD);X(22,31,6,4,WOOD);X(17,27,7,7,'#2a2a2a');X(18,28,5,5,'#111');X(19,29,3,3,'#000');
  X(9,29,9,4,pc.d);X(14,30,4,4,SK);X(27,30,5,6,pc.u);X(25,34,4,3,SK);if(o.bayo){X(19,17,2,11,'#d8d8d8');X(19,16,2,1,'#fff')}}
 if(o.ally)X(27,30,5,2,'#f4f4f4');
 if(o.muzz){X(12,22,16,16,'#ffe27a');X(16,26,8,8,'#fff');X(6,29,28,2,'#ffb04a');X(19,16,2,28,'#ffb04a')}}
function soldierSprite(o){const key='s|'+[o.fac,o.pose,o.emo,o.gun,o.frame,o.surr,o.officer,o.throwing,o.bayo,o.muzz,o.ally,o.item].join('|');
 if(o.dead)return sprite(key+'|dead',48,48,g=>{g.translate(0,48);g.rotate(-Math.PI/2);frontSoldier(g,o)});
 return sprite(key,40,48,g=>frontSoldier(g,o))}
function peasantSprite(tied,emo,wave){return sprite('pz|'+tied+emo+wave,40,48,g=>{const X=(x,y,w,h,c)=>R(g,x,y,w,h,c),cl='#55707e',cl2='#3d525d';
 if(tied){X(18,0,5,48,'#5a4030');X(12,41,16,6,cl2);X(10,29,20,13,cl);for(const y of[31,35,39])X(7,y,26,2,'#a07a42');frontHead(g,'straw',emo,0,6)}
 else{X(13,39,5,6,cl2);X(22,39,5,6,cl2);X(12,44,7,3,SKS);X(21,44,7,3,SKS);X(11,25,18,15,cl);X(9,27,22,11,cl);X(9,35,22,2,'#a07a42');frontHead(g,'straw',emo);
  if(wave){X(30,10,4,16,cl);X(30,7,5,4,SK)}else{X(30,27,4,10,cl);X(30,36,4,3,SK)}X(6,27,4,10,cl);X(6,36,4,3,SK)}})}
const PROPS={
 crate:()=>sprite('crate',32,32,g=>{R(g,1,4,30,28,'#7a5a35');R(g,1,4,30,2,'#9c7a4c');for(let y=10;y<32;y+=7)R(g,1,y,30,1,'#5a4025');R(g,1,4,3,28,'#5a4025');R(g,28,4,3,28,'#5a4025');g.fillStyle='#3a2a1a';g.font='bold 9px monospace';g.fillText('US AID',5,20)}),
 barrel:()=>sprite('barrel',24,32,g=>{R(g,2,2,20,30,'#a8322a');R(g,1,6,22,3,'#5a1a14');R(g,1,24,22,3,'#5a1a14');R(g,4,2,3,30,'#c8524a');R(g,2,0,20,3,'#7a2a22');g.fillStyle='#f1d27a';g.font='900 10px "Noto Serif TC",serif';g.textAlign='center';g.fillText('火',12,20)}),
 pole:(fl)=>sprite('pole',36,80,g=>{R(g,16,12,4,68,'#4a3a2a');R(g,14,76,8,4,'#2a1e18');R(g,2,4,14,10,'#9a9a9a');R(g,0,1,4,16,'#c0c0c0');R(g,20,4,14,10,'#9a9a9a');R(g,32,1,4,16,'#c0c0c0');R(g,14,8,8,4,'#555');
  R(g,9,22,18,30,'#b8322a');g.fillStyle='#f1d27a';g.font='900 11px "Noto Serif TC",serif';g.textAlign='center';g.fillText('解',18,35);g.fillText('放',18,48)}),
 nest:(emo)=>sprite('nest|'+emo,56,44,g=>{frontHead(g,EN,emo,8,0);R(g,23,20,10,10,'#2a2a2a');R(g,25,22,6,6,'#000');for(let i=0;i<6;i++)R(g,i*9+1,30,10,7,i%2?'#9a8660':'#8a7650');for(let i=0;i<5;i++)R(g,i*10+4,37,10,7,i%2?'#8a7650':'#7a6a48')}),
 tank:(emo,hurt)=>sprite('tank|'+emo+hurt,112,84,g=>{const body='#5d6447',dk='#434833';
  frontHead(g,EN,emo,36,0);R(g,32,22,48,6,dk);
  R(g,0,40,24,42,'#262622');R(g,88,40,24,42,'#262622');for(let y=44;y<80;y+=7){R(g,4,y,16,4,'#4a4a44');R(g,92,y,16,4,'#4a4a44')}
  R(g,18,44,76,30,body);R(g,18,44,76,4,dk);R(g,22,40,68,6,dk);R(g,30,26,52,22,body);R(g,30,26,52,3,dk);
  R(g,48,32,16,14,'#2a2a26');R(g,51,35,10,8,'#111');R(g,53,37,6,4,'#000');R(g,36,62,40,8,'#e9dcc2');R(g,38,64,36,1,'#999');R(g,38,67,28,1,'#999');
  R(g,24,52,6,6,'#ffd24a');R(g,82,52,6,6,'#ffd24a');if(hurt){for(let i=0;i<6;i++)R(g,20+i*13,46+(i%3)*8,4,4,'#1a1a1a')}}),
 pickup:(k)=>sprite('pk|'+k,24,24,g=>{if(k==='rice'){R(g,2,12,20,10,'#2f4f8a');R(g,3,14,18,2,'#f2f2f2');R(g,4,6,16,7,'#f2efe6');R(g,7,4,10,3,'#f2efe6');R(g,10,1,1,4,'#8a6a42');R(g,13,1,1,4,'#8a6a42')}
  else if(k==='gold'){R(g,2,12,20,10,'#d9a441');R(g,5,6,14,7,'#f0c860');R(g,2,12,20,1,'#fff0a0');R(g,5,6,14,1,'#fff6c0')}
  else{R(g,1,6,22,17,'#7a5a35');R(g,1,6,22,2,'#9c7a4c');R(g,1,14,22,1,'#5a4025');g.fillStyle=k==='G'?'#ff7d6e':'#ffd24a';g.font='bold 10px "Press Start 2P",monospace';g.textAlign='center';g.fillText(k,12,20)}})};
function wordSprite(t){return sprite('w|'+t,t.length*8+6,14,g=>{R(g,0,0,t.length*8+6,14,'#120d0cdd');g.fillStyle='#ff7d6e';g.font='8px "Press Start 2P",monospace';g.textBaseline='top';g.fillText(t,3,3)})}

/* ===== wall textures (64×64) ===== */
const TEX={};
function buildTextures(){
 const brick=(g,soot)=>{const rr=seeded(7);R(g,0,0,64,64,'#5b4636');for(let y=0;y<64;y+=8){const off=(y/8)%2*8;for(let x=-8;x<64;x+=16){const v=rr();R(g,x+off+1,y+1,14,6,v<.2?'#4e3b2d':v<.35?'#665040':'#5b4636')}R(g,0,y,64,1,'#3e2e24')}
  for(let y=0;y<64;y+=8)for(let x=((y/8)%2)*8;x<64;x+=16)R(g,x,y,1,8,'#3e2e24');if(soot){const gr=g.createLinearGradient(0,0,0,20);gr.addColorStop(0,'rgba(15,8,6,.7)');gr.addColorStop(1,'rgba(15,8,6,0)');g.fillStyle=gr;g.fillRect(0,0,64,20)}
  for(let i=0;i<5;i++)R(g,rr()*60|0,30+rr()*30|0,2,2,'#3a2a20')};
 const han=(g,s,x,y,c,size=13)=>{g.fillStyle=c;g.font=`900 ${size}px "Noto Serif TC","Songti TC",serif`;g.textAlign='center';g.textBaseline='top';[...s].forEach((ch,i)=>g.fillText(ch,x,y+i*(size+1)))};
 TEX['#']=mk(64,64,g=>brick(g,true));
 TEX.P=mk(64,64,g=>{brick(g,true);R(g,5,12,22,38,'#2f4f8a');R(g,7,14,18,34,'#3a5a96');han(g,'戡亂',16,16,'#f2f2f2');R(g,24,9,26,44,'#b8322a');R(g,24,9,6,6,'#5b4636');R(g,26,15,2,2,'#5b4636');han(g,'打倒',37,14,'#f1d27a');R(g,52,22,10,14,'#d8ccb0');for(let i=0;i<4;i++)R(g,53,25+i*3,8,1,'#6a5a48');R(g,30,48,14,5,'#b8322a')});
 TEX.Q=mk(64,64,g=>{brick(g,true);R(g,10,8,40,48,'#b8322a');han(g,'土改',22,12,'#f1d27a',14);R(g,32,24,22,30,'#2f4f8a');R(g,48,24,6,6,'#5b4636');han(g,'救國',43,26,'#f2f2f2',11)});
 TEX.W=mk(64,64,g=>{for(let x=0;x<64;x+=8){R(g,x,0,8,64,x%16?'#6a4a30':'#5a3e28');R(g,x,0,1,64,'#3e2a1a')}R(g,0,0,64,5,'#2a1a10');R(g,18,20,28,22,'#2a1a10');R(g,20,22,24,18,'#d9843a');R(g,20,22,24,18,'#e8a050');R(g,31,22,2,18,'#2a1a10');R(g,20,30,24,2,'#2a1a10');R(g,20,22,24,3,'#f4c070');R(g,0,58,64,6,'#3e2a1a')});
 TEX.F=[0,1,2,3].map(k=>mk(64,64,g=>{const rr=seeded(11+k*7);for(let x=0;x<64;x+=8)R(g,x,0,8,64,x%16?'#2a1a14':'#221410');for(let i=0;i<14;i++)R(g,rr()*60|0,rr()*60|0,3,2,'#ff6a1a');
  for(let x=0;x<64;x+=4){const h=20+rr()*36|0;for(let y=64-h;y<64;y+=2){const t=(y-(64-h))/h;R(g,x,y,4,2,t<.25?'#ffe27a':t<.5?'#ffb04a':t<.8?'#ff7a1a':'#c8372d')}}}));
}
const MIN_TEX_KEYS='#PQWF';
