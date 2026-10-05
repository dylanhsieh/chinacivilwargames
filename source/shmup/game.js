/* ===================== SKY OF GOLD YUAN — a Civil Slug shoot 'em up ===================== */
let T=0,camX=0,S='kmt',EN='ccp',LV=0,skyFlash=0,skyFX=0,state='title';
let plats=[],scorch=[];const L={walls:[200,900,1600],theme:'village',deep:null,weather:null};function groundAt(){return GY}
const VIG=document.createElement('canvas');VIG.width=W;VIG.height=H;{const g=VIG.getContext('2d');const rg=g.createRadialGradient(W/2,H/2,H*.4,W/2,H/2,W*.65);rg.addColorStop(0,'rgba(0,0,0,0)');rg.addColorStop(1,'rgba(6,2,2,.45)');g.fillStyle=rg;g.fillRect(0,0,W,H)}
const SERIF=s=>`900 ${s}px "Noto Serif TC","Songti TC",Georgia,serif`;
function stxt(s,x,y,c,size,a=1,al='center'){ctx.font=SERIF(size);ctx.textAlign=al;ctx.textBaseline='middle';ctx.globalAlpha=a;ctx.fillStyle='#000';ctx.fillText(s,x+1,y+2);ctx.fillStyle=c;ctx.fillText(s,x,y);ctx.globalAlpha=1}
const STAGES=[{theme:'village',name:'STAGE 1 · THE BURNING VILLAGE',boss:'train',bossName:'ARMORED TRAIN "SIX OWNERS"',music:'m1'},
 {theme:'river',name:'STAGE 2 · THE YANGTZE',boss:'boat',bossName:'GUNBOAT "NEUTRAL PARTY"',music:'m5'},
 {theme:'city',name:'STAGE 3 · SHANGHAI',boss:'printer',bossName:'THE PRINTER\'S AIRSHIP',music:'boss'}];
let P=null,pb=[],eb=[],ens=[],items=[],fx=[],pops=[],boss=null,st=0,stT=0,score=0,lives=3,bombs=3,banner=null,flashW=0,shk=0,clearT=0;
function startGame(){score=0;lives=4;bombs=3;startStage(0);$('#title').hidden=true;$('#hud').hidden=false;if(touchUI)$('#touch').hidden=false}
function startStage(i){st=i;stT=0;const s=STAGES[i];L.theme=s.theme;L.weather=s.theme==='city'?'rain':null;L.deep=s.theme==='river'?[[-1e4,1e5]]:null;LV=i;buildBG();
 P={x:60,y:100,pw:P?P.pw:1,inv:120,cd:0,dead:0};pb=[];eb=[];ens=[];items=[];boss=null;clearT=0;state='play';banner={s:s.name,t:0};music(s.music)}
/* ---------------- spawns ---------------- */
function spawnWave(){const r_=rnd(),y0=30+rnd()*120,s=st;
 if(r_<.3)for(let i=0;i<5;i++)ens.push({k:'fighter',x:W+20+i*22,y:y0,hp:3+s,t:-i*8,amp:20+rnd()*20,ph:rnd()*6,sx:-1.6-s*.2});
 else if(r_<.5)for(let i=0;i<4;i++)ens.push({k:'diver',x:W+20,y:i%2?20:180,hp:2+s,t:-i*16,sx:-2.2});
 else if(r_<.65)ens.push({k:'transport',x:W+30,y:40+rnd()*60,hp:24+s*8,t:0,sx:-.6});
 else if(r_<.8)ens.push({k:'balloon',x:W+20,y:40+rnd()*80,hp:12+s*4,t:0,sx:-.5});
 else ens.push({k:'aa',x:W+20,y:s===1?GY+6:GY,hp:10+s*3,t:0,sx:-1.2,ground:1})}
function spawnBoss(){const s=STAGES[st];banner={s:'WARNING: '+s.bossName,t:0,warn:1};SFX.alarm();
 const hp=[600,850,1500][st];boss={k:s.boss,x:W+80,y:s.boss==='printer'?90:GY-10,hp,max:hp,t:0,ph:1,fl:0};music('boss')}
/* ---------------- bullets ---------------- */
function eShot(x,y,ang,sp,k='o'){eb.push({x,y,vx:Math.cos(ang)*sp,vy:Math.sin(ang)*sp,k})}
function aimAt(x,y){return Math.atan2(P.y-y,P.x-x)}
/* ---------------- update ---------------- */
let heldK={},touchD=null;
function update(){T++;if(state!=='play')return;stT++;camX+=st===2?1.4:1.2;if(banner&&++banner.t>150)banner=null;if(flashW>0)flashW--;if(shk>0)shk*=.88;
 if(!boss&&stT<3200&&stT%70===0)spawnWave();if(!boss&&stT===3300)spawnBoss();
 // player
 if(!P.dead){let mx=(heldK.r?1:0)-(heldK.l?1:0),my=(heldK.d?1:0)-(heldK.u?1:0);const sp=2.4;P.x=clamp(P.x+mx*sp,10,W-20);P.y=clamp(P.y+my*sp,18,GY-6);
  if(touchD){P.x=clamp(touchD.px+(touchD.x-touchD.x0)*1.3,10,W-20);P.y=clamp(touchD.py+(touchD.y-touchD.y0)*1.3,18,GY-6)}
  P.cd--;if((heldK.f||touchUI)&&P.cd<=0){P.cd=6;const n=P.pw;pb.push({x:P.x+12,y:P.y,vx:7,vy:0});if(n>=2){pb.push({x:P.x+10,y:P.y-3,vx:6.8,vy:-.9});pb.push({x:P.x+10,y:P.y+3,vx:6.8,vy:.9})}if(n>=3){pb.push({x:P.x+8,y:P.y,vx:6.5,vy:-1.9});pb.push({x:P.x+8,y:P.y,vx:6.5,vy:1.9})}if(n>=4&&T%12===0){pb.push({x:P.x,y:P.y,vx:4,vy:0,big:1})}if(T%12===0)SFX.shot()}
  if(heldK.b){heldK.b=0;bomb()}if(P.inv>0)P.inv--}
 else{P.dead--;if(P.dead<=0){if(lives<=0){state='over';music('off');return}P.dead=0;P.x=40;P.y=100;P.inv=150}}
 for(const b of pb){b.x+=b.vx;b.y+=b.vy}pb=pb.filter(b=>b.x<W+10&&b.y>-10&&b.y<H+10);
 for(const b of eb){b.x+=b.vx;b.y+=b.vy;if(b.k==='bill'){b.vy+=Math.sin(T*.2+b.x)*.03}}eb=eb.filter(b=>b.x>-10&&b.x<W+10&&b.y>-10&&b.y<H+10);
 // enemies
 for(const e of ens){e.t++;if(e.t<0)continue;e.x+=e.sx;
  if(e.k==='fighter'){e.y+=Math.cos(e.t*.06+e.ph)*e.amp*.05;if(e.t%90===40&&rnd()<.3+st*.15)eShot(e.x,e.y,aimAt(e.x,e.y),1.8+st*.3)}
  else if(e.k==='diver'){const a=aimAt(e.x,e.y);if(e.t<40){e.y+=Math.sin(a)*2}if(e.t===30)eShot(e.x,e.y,a,2.4)}
  else if(e.k==='transport'){if(e.t%50===25)for(let i=0;i<3;i++)eb.push({x:e.x,y:e.y+6,vx:-.6+i*.3,vy:1,k:'leaf'})}
  else if(e.k==='balloon'){e.y+=Math.sin(e.t*.04)*.3;if(e.t%120===60)for(let i=0;i<8;i++)eShot(e.x,e.y,i*Math.PI/4,1.3)}
  else if(e.k==='aa'){if(e.t%100===50)for(let i=-1;i<=1;i++)eShot(e.x,e.y-8,aimAt(e.x,e.y-8)+i*.2,2.2)}
  for(const b of pb)if(!b.hit&&Math.abs(b.x-e.x)<(e.k==='transport'?18:10)&&Math.abs(b.y-e.y)<(e.k==='transport'?8:7)){b.hit=1;e.hp-=b.big?4:1;e.fl=3;if(e.hp<=0)killE(e)}
  if(!P.dead&&!P.inv&&Math.abs(P.x-e.x)<10&&Math.abs(P.y-e.y)<7)hurt()}
 pb=pb.filter(b=>!b.hit);ens=ens.filter(e=>!e.dead&&e.x>-40);
 // boss
 if(boss)updBoss();
 // bullets vs player
 if(!P.dead&&!P.inv)for(const b of eb){if(Math.abs(b.x-P.x-4)<(b.k==='bill'?5:3)&&Math.abs(b.y-P.y)<3){b.x=-99;hurt();break}}
 // items
 for(const it of items){it.x-=.8;it.y+=Math.sin(T*.1+it.x)*.3;if(!P.dead&&Math.abs(it.x-P.x)<12&&Math.abs(it.y-P.y)<12){it.got=1;if(it.k==='P'){P.pw=Math.min(4,P.pw+1);pop(P.x,P.y-10,'POWER UP','#ffd24a')}else if(it.k==='B'){bombs=Math.min(5,bombs+1);pop(P.x,P.y-10,'+1 MONEY BOMB','#d9a441')}else{score+=500;pop(P.x,P.y-10,'+¥500 (≈1 GRAIN)','#d9a441')}SFX.pick()}}items=items.filter(i=>!i.got&&i.x>-10);
 for(const f of fx){f.x+=f.vx;f.y+=f.vy;f.vy+=f.g||0;f.l--}fx=fx.filter(f=>f.l>0);for(const p of pops)p.t++;pops=pops.filter(p=>p.t<60);
 if(clearT){clearT++;if(clearT>240){if(st<2)startStage(st+1);else{state='win';music('ending')}}}}
function pop(x,y,s,c){pops.push({x,y,s,c,t:0})}
function boomFx(x,y,big){SFX.boom(big);shk=Math.max(shk,big?10:4);for(let i=0;i<(big?40:14);i++){const a=rnd()*6.28,v=rnd()*(big?4:2.5);fx.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:20+rnd()*20,c:pick(['#ffe27a','#ff8a1a','#ff5a1a','#555']),s:2+(rnd()*2|0)})}}
function killE(e){e.dead=1;const v={fighter:100,diver:80,transport:600,balloon:300,aa:200}[e.k];score+=v;boomFx(e.x,e.y,e.k==='transport');
 if(e.k==='transport'||rnd()<.12)items.push({k:rnd()<.5&&P.pw<4?'P':rnd()<.4?'B':'¥',x:e.x,y:e.y});else if(rnd()<.3)items.push({k:'¥',x:e.x,y:e.y})}
function hurt(){if(P.dead||P.inv)return;lives--;P.dead=90;P.pw=Math.max(1,P.pw-1);boomFx(P.x,P.y,true);SFX.die();pop(P.x,P.y-12,lives>0?'NEW PILOT, SAME CONTRACT':'CONTRACT TERMINATED','#ff6a5a')}
function bomb(){if(bombs<=0||P.dead)return;bombs--;flashW=20;SFX.boom(true);shk=12;for(const b of eb)b.x=-99;for(const e of ens){e.hp-=12;if(e.hp<=0)killE(e)}if(boss){boss.hp-=40;boss.fl=6}
 for(let i=0;i<60;i++)fx.push({x:rnd()*W,y:-10-rnd()*40,vx:(rnd()-.5)*.6,vy:1+rnd()*2,l:90,c:rnd()<.5?'#8aa070':'#b0a070',s:3,bill:1});pop(W/2,60,'MONEY BOMB! (WORTHLESS, BUT HEAVY)','#d9a441')}
function updBoss(){const b=boss;b.t++;if(b.fl>0)b.fl--;const tx=b.k==='printer'?W-80:W-90;if(b.x>tx)b.x-=1;else b.entered=1;
 if(b.k==='printer')b.y=90+Math.sin(b.t*.02)*30;
 if(b.entered){const f=b.ph===2?1.5:1;
  if(b.k==='train'){if(b.t%Math.round(50/f)===0)for(let i=-2;i<=2;i++)eShot(b.x-20,b.y-24,aimAt(b.x-20,b.y-24)+i*.15,2.2);if(b.t%Math.round(80/f)===0)for(let i=0;i<5;i++)eShot(b.x+i*12,b.y-16,-Math.PI/2-.6+rnd()*.2-i*.15,2.4)}
  else if(b.k==='boat'){if(b.t%Math.round(70/f)===0)for(let i=0;i<12;i++)eShot(b.x,b.y-30,i*Math.PI/6+b.t*.01,1.6);if(b.t%Math.round(40/f)===0)eShot(b.x-30,b.y-20,aimAt(b.x-30,b.y-20),3)}
  else{if(b.t%4===0)eb.push({x:b.x-30,y:b.y,vx:Math.cos(b.t*.13)*1.8-1.2,vy:Math.sin(b.t*.13)*1.8,k:'bill'});if(b.t%Math.round(90/f)===0)for(let i=-3;i<=3;i++)eShot(b.x-40,b.y+10,Math.PI+i*.18,2.6);if(b.ph===2&&b.t%150===0)pop(b.x-40,b.y-40,pick(['NEW NOTES ISSUED','PRICES +300%','THE NUMBER GROWS']),'#ff8a3a')}}
 const bw=b.k==='printer'?56:b.k==='boat'?50:60,bh=b.k==='printer'?26:18;
 for(const p of pb)if(!p.hit&&Math.abs(p.x-b.x)<bw&&Math.abs(p.y-(b.y-(b.k==='printer'?0:14)))<bh){p.hit=1;b.hp-=p.big?4:1;b.fl=3;if(T%3===0)fx.push({x:p.x,y:p.y,vx:-1,vy:(rnd()-.5)*2,l:8,c:'#fff',s:2})}
 if(b.ph===1&&b.hp<b.max*.5){b.ph=2;banner={s:b.k==='printer'?'HYPERINFLATION':'IT\'S ANGRY',t:0,warn:1};SFX.alarm()}
 if(b.hp<=0){for(let i=0;i<6;i++)setTimeout(()=>boomFx(b.x+(rnd()-.5)*80,b.y+(rnd()-.5)*30,true),i*150);score+=[20000,30000,60000][st];boss=null;eb=[];clearT=1;music('off');setTimeout(()=>SFX.fanfare&&SFX.oneup(),900);
  banner={s:'STAGE CLEAR · CONTRACT PAID: ¥'+fmtBig(score*1000),t:0}}}
/* ---------------- render ---------------- */
function plane(x,y,fl){x=Math.round(x);y=Math.round(y);const c=fl?'#fff':'#7a8a5a',d=fl?'#ddd':'#5a6a3a';r(x-10,y-2,22,5,c);r(x-6,y-6,10,2,d);r(x-6,y+4,10,2,d);r(x-4,y-5,1,10,'#3a2a20');r(x+12,y-1,2,3,'#3a3a3a');const pr=(T>>1)%2;r(x+14,y-5+pr*3,1,7-pr*3,'#cfcfcf');r(x-12,y-4,3,4,d);r(x-1,y-5,5,4,SK);r(x-1,y-6,5,2,'#2f4166');r(x+1,y-4,1,1,'#120d0c')}
function enemyPlane(e){const x=Math.round(e.x),y=Math.round(e.y),f=e.fl>0&&T%2;e.fl&&e.fl--;const c=f?'#fff':'#6a6a72',d=f?'#ddd':'#4a4a52';
 if(e.k==='transport'){r(x-20,y-5,40,10,c);r(x-6,y-12,12,24,d);r(x+16,y-8,6,4,d);r(x-22,y-2,3,4,'#cfcfcf');r(x-14,y-3,3,2,'#ffd24a');r(x-8,y-3,3,2,'#ffd24a');return}
 if(e.k==='balloon'){r(x-12,y-8,24,14,c);r(x-14,y-5,28,8,c);r(x-3,y+6,6,4,d);r(x,y+10,1,30,'#555');txt('撤',x,y-5,'#e9dcc2','center');return}
 if(e.k==='aa'){r(x-8,y-6,16,6,'#5d6447');r(x-10,y-2,20,4,'#434833');seg(x,y-6,x-8,y-14,2,'#262622');return}
 r(x-8,y-2,16,4,c);r(x-3,y-7,6,14,d);r(x+6,y-4,4,3,d);r(x-10,y-3,2,6,'#cfcfcf');r(x-4,y-3,3,2,'#9fd3ff')}
function drawBoss(b){const x=Math.round(b.x),y=Math.round(b.y),f=b.fl>0&&T%2;
 if(b.k==='train'){for(let i=0;i<3;i++){r(x-60+i*42,y-18,38,18,f?'#fff':'#4a4e3a');r(x-60+i*42,y-20,38,3,'#2a2c22');for(let k=0;k<4;k++)r(x-56+i*42+k*9,y-2,6,6,'#1a1a18')}r(x-70,y-28,14,26,f?'#fff':'#3a3c30');r(x-74,y-16,6,4,'#262622');hanV('六主',x-18,y-17,'#e9dcc2',7);if(T%6<3)r(x-66,y-34,6,6,'#555')}
 else if(b.k==='boat'){r(x-56,y-14,112,14,f?'#fff':'#5a6068');r(x-48,y-28,56,14,f?'#ddd':'#3a4048');r(x-20,y-44,14,16,'#3a4048');r(x-40,y-34,26,3,'#262626');txt('中立',x+20,y-10,'#e9dcc2','center');for(let i=0;i<6;i++)r(x-56+i*20,y,10,2,'#6a8ab0')}
 else{r(x-56,y-20,112,40,f?'#fff':'#6a4a80');r(x-62,y-12,124,24,f?'#fff':'#6a4a80');r(x-50,y-20,100,3,'#8a6aa0');r(x+52,y-26,10,52,'#4a3a60');r(x-14,y+20,28,10,'#3a2a40');stxt('印鈔',x,y,'#d9a441',14);r(x-20,y+28,40,3,'#8aa070');if(T%10<5)r(x-18+(T%40),y+31,6,4,'#8aa070')}
 const w=160;r(W/2-w/2,H-10,w,4,'#2a0a0a');r(W/2-w/2,H-10,w*Math.max(0,b.hp/b.max),4,'#c8372d')}
function render(){if(state==='title'){camX+=.4;if(!BGD)buildBG();drawBG();plane(W/2+Math.sin(T*.03)*40,80+Math.sin(T*.05)*10);ctx.drawImage(VIG,0,0);return}
 ctx.save();if(shk>0&&!RM)ctx.translate((rnd()-.5)*shk,(rnd()-.5)*shk);drawBG();drawWeather();
 for(const e of ens)if(e.t>=0)enemyPlane(e);if(boss)drawBoss(boss);
 for(const it of items){r(it.x-5,it.y-5,10,10,it.k==='P'?'#c8372d':it.k==='B'?'#d9a441':'#8aa070');txt(it.k,it.x,it.y-4,'#fff','center')}
 for(const b of pb)b.big?r(b.x-3,b.y-2,6,4,'#ffd24a'):r(b.x-3,b.y,6,1,'#ffe27a');
 for(const b of eb){if(b.k==='bill'){r(b.x-4,b.y-2,8,4,'#8aa070');r(b.x-1,b.y-1,2,2,'#d9a441')}else if(b.k==='leaf'){r(b.x-3,b.y-2,6,4,'#e9dcc2');r(b.x-2,b.y-1,4,1,'#b8322a')}else{r(b.x-2,b.y-2,4,4,'#ff6a3a');r(b.x-1,b.y-1,2,2,'#fff')}}
 if(!P.dead&&!(P.inv&&T%4<2))plane(P.x,P.y);
 for(const f of fx)f.bill?(r(f.x,f.y,6,3,f.c)):r(f.x,f.y,f.s||2,f.s||2,f.c);
 for(const p of pops){ctx.globalAlpha=1-p.t/60;txt(p.s,p.x,p.y-p.t*.3,p.c,'center');ctx.globalAlpha=1}
 ctx.restore();if(flashW){ctx.globalAlpha=flashW/20*.6;r(0,0,W,H,'#fff4d0');ctx.globalAlpha=1}
 txt('¥'+String(score).padStart(8,'0'),8,6,'#d9a441');txt('PILOTS '+'✈'.repeat(Math.max(0,lives)),8,16,'#e9dcc2');txt('BOMBS '+'■'.repeat(bombs),8,26,'#d9a441');txt('GUNS '+P.pw,W-50,6,'#a8977c');
 if(banner)stxt(banner.s,W/2,H/2-30,banner.warn?(T%10<5?'#ff5a3a':'#ffd24a'):'#e9dcc2',banner.warn?14:12,banner.t<20?banner.t/20:banner.t>120?(150-banner.t)/30:1);
 if(state==='over'||state==='win'){r(0,0,W,H,'rgba(8,6,5,.82)');const w=state==='win';stxt(w?'THE PRINTER HAS FALLEN':'CONTRACT TERMINATED',W/2,60,w?'#ffd24a':'#b3261e',20);
  const ls=wrap(w?'You shot down the Printer\'s airship. The next morning the bank prints a bigger one. Your fee is paid in its notes.':'Your replacement is already in the cockpit. He was promised the same pay.',44);ls.forEach((l,i)=>txt(l,W/2,90+i*10,'#e9dcc2','center'));
  txt('FINAL SCORE ¥'+fmtBig(score)+' (REAL VALUE: ONE EGG)',W/2,130,'#d9a441','center');txt(touchUI?'TAP TO RETURN':'ENTER TO RETURN',W/2,H-20,'#6e6050','center')}
 ctx.drawImage(VIG,0,0)}
/* ---------------- input ---------------- */
let touchUI=matchMedia('(pointer:coarse)').matches;
const KM={KeyW:'u',ArrowUp:'u',KeyS:'d',ArrowDown:'d',KeyA:'l',ArrowLeft:'l',KeyD:'r',ArrowRight:'r',KeyJ:'f',Space:'f',KeyZ:'f',KeyK:'b',KeyX:'b'};
addEventListener('keydown',e=>{if(state==='over'||state==='win'){if(e.code==='Enter'||e.code==='Space')toTitle();return}const k=KM[e.code];if(!k||state!=='play')return;e.preventDefault();initAudio();if(k==='b'){if(!e.repeat)heldK.b=1}else heldK[k]=1});
addEventListener('keyup',e=>{const k=KM[e.code];if(k&&k!=='b')heldK[k]=0});
function toTitle(){state='title';$('#title').hidden=false;$('#hud').hidden=true;$('#touch').hidden=true;music('off')}
const tp=$('#touch');
tp.addEventListener('pointerdown',e=>{initAudio();if(e.target.closest('.tb')){heldK.b=1;return}if(state==='over'||state==='win'){toTitle();return}touchD={x0:e.clientX,y0:e.clientY,x:e.clientX,y:e.clientY,px:P.x,py:P.y,id:e.pointerId,sc:W/cv.getBoundingClientRect().width}});
tp.addEventListener('pointermove',e=>{if(touchD&&e.pointerId===touchD.id){touchD.x=touchD.x0+(e.clientX-touchD.x0)*touchD.sc;touchD.y=touchD.y0+(e.clientY-touchD.y0)*touchD.sc}});
const tpUp=e=>{if(touchD&&e.pointerId===touchD.id)touchD=null};tp.addEventListener('pointerup',tpUp);tp.addEventListener('pointercancel',tpUp);
cv.addEventListener('pointerdown',()=>{if(state==='over'||state==='win')toTitle()});
$('#bGo').onclick=()=>{initAudio();startGame()};$('#bPause').hidden=true;$('#bSnd').onclick=e=>{initAudio();setMute(!muted);e.currentTarget.textContent=muted?'MUTE':'SND';e.currentTarget.blur()};
function fit(){const vw=innerWidth,vh=innerHeight,s=Math.min(vw/W,vh/H);cv.style.width=Math.floor(W*s)+'px';cv.style.height=Math.floor(H*s)+'px'}
addEventListener('resize',fit);fit();
let last=performance.now(),acc=0;
function loop(nt){acc+=Math.min(100,nt-last);last=nt;while(acc>=16.67){acc-=16.67;update()}render();requestAnimationFrame(loop)}
(document.fonts?Promise.all([document.fonts.load(F),document.fonts.load(SERIF(20))]):Promise.resolve()).catch(()=>{}).finally(()=>requestAnimationFrame(loop));
