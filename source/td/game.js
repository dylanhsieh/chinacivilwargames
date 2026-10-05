/* ===================== GOLD RUN 1949 — a Civil Slug tower defense ===================== */
let T=0,camX=0,S='kmt',EN='ccp',LV=0,skyFlash=0,skyFX=0,state='title';
let plats=[],scorch=[];const L={walls:[],theme:'city',deep:null,weather:null};function groundAt(){return GY}
const VIG=document.createElement('canvas');VIG.width=W;VIG.height=H;{const g=VIG.getContext('2d');const rg=g.createRadialGradient(W/2,H/2,H*.4,W/2,H/2,W*.65);rg.addColorStop(0,'rgba(0,0,0,0)');rg.addColorStop(1,'rgba(6,2,2,.45)');g.fillStyle=rg;g.fillRect(0,0,W,H)}
const SERIF=s=>`900 ${s}px "Noto Serif TC","Songti TC",Georgia,serif`;
function stxt(s,x,y,c,size,a=1,al='center'){ctx.font=SERIF(size);ctx.textAlign=al;ctx.textBaseline='middle';ctx.globalAlpha=a;ctx.fillStyle='#000';ctx.fillText(s,x+1,y+2);ctx.fillStyle=c;ctx.fillText(s,x,y);ctx.globalAlpha=1}
const TS=16,GW=24,GH=12,OY=24;
const MAPS={bund:{name:'THE BUND',waves:20,mul:1,path:[[-1,2],[5,2],[5,8],[11,8],[11,3],[17,3],[17,9],[24,9]],water:[]},
 docks:{name:'THE DOCKS',waves:25,mul:1.3,path:[[-1,6],[3,6],[3,1],[8,1],[8,10],[13,10],[13,4],[19,4],[19,9],[24,9]],water:[[0,11,24,1]]}};
const ED={
 looter:{n:'LOOTER',hp:30,spd:.9,b:6,steal:1,k:'civ',hat:'none',cl:'#6a5040',from:1},
 deserter:{n:'DESERTER',hp:55,spd:.6,b:8,steal:1,k:'sol',fac:'kmt',from:2},
 cadre:{n:'CADRE',hp:70,spd:.55,b:9,steal:1,k:'sol',fac:'ccp',from:3},
 crowd:{n:'BANK RUN',hp:22,spd:.85,b:3,steal:1,k:'civ',hat:'fedora',cl:'#3a3a3a',from:4,grp:6},
 militia:{n:'MILITIA',hp:150,spd:.45,b:14,steal:1,armor:3,k:'sol',fac:'ccp',gun:'rifle',from:5},
 cart:{n:'HANDCART',hp:280,spd:.32,b:25,steal:3,k:'cart',from:6},
 officer:{n:'WARLORD',hp:130,spd:.6,b:20,steal:2,k:'sol',fac:'kmt',officer:1,aura:1,from:8},
 tank:{n:'TANK (SIX OWNERS)',hp:1500,spd:.24,b:150,steal:10,armor:8,k:'tank',boss:1}};
const TD={
 rifle:{n:'RIFLE SQUAD',c:60,lv:[{dmg:14,rate:40,range:3.2},{dmg:24,rate:34,range:3.6},{dmg:38,rate:28,range:4.1}],d:'Reliable. Paid monthly, in theory.'},
 mg:{n:'MG NEST',c:110,lv:[{dmg:4,rate:7,range:2.4},{dmg:6,rate:6,range:2.6},{dmg:9,rate:5,range:2.9}],d:'Fast, short range. Ammo is American, invoice pending.'},
 mortar:{n:'MORTAR',c:150,lv:[{dmg:45,rate:90,range:5.2,splash:1.3},{dmg:75,rate:80,range:5.6,splash:1.5},{dmg:120,rate:70,range:6,splash:1.8}],min:1.4,d:'Splash damage. Cannot hit anything close. Like policy.'},
 speaker:{n:'LOUDSPEAKER',c:90,lv:[{slow:.55,conv:.004,range:2.6},{slow:.45,conv:.007,range:3},{slow:.35,conv:.011,range:3.4}],d:'Slows enemies. Some defect and fight their friends.'},
 press:{n:'PRINTING PRESS',c:120,lv:[{inc:45},{inc:80},{inc:130}],d:'Prints money every wave. Also prints inflation.'}};
const TKEYS=['rifle','mg','mortar','speaker','press'];

/* ---------------- state ---------------- */
let M=null,mapK='bund',pathTiles=new Set(),deco=new Map(),pathPts=[],pathLen=0,towers=[],ens=[],allies=[],shots=[],fxs=[],pops=[],G=null,selT=null,tsel=null,hover=null,fast=1,spawnQ=[],waveOn=false,msg=null;
function start(k){mapK=k;M=MAPS[k];pathTiles=new Set();deco=new Map();pathPts=M.path.map(([x,y])=>[x*TS+8,OY+y*TS+8]);
 for(let i=0;i<M.path.length-1;i++){const[a,b]=[M.path[i],M.path[i+1]];const dx=Math.sign(b[0]-a[0]),dy=Math.sign(b[1]-a[1]);let x=a[0],y=a[1];while(true){pathTiles.add(x+','+y);if(x===b[0]&&y===b[1])break;x+=dx;y+=dy}}
 pathLen=0;for(let i=0;i<pathPts.length-1;i++)pathLen+=Math.hypot(pathPts[i+1][0]-pathPts[i][0],pathPts[i+1][1]-pathPts[i][1]);
 const R_=seeded(k==='bund'?48:49);for(let y=0;y<GH;y++)for(let x=0;x<GW;x++){if(pathTiles.has(x+','+y))continue;if(M.water.some(([wx,wy,ww,wh])=>x>=wx&&x<wx+ww&&y>=wy&&y<wy+wh)){deco.set(x+','+y,'water');continue}const v=R_();if(v<.09)deco.set(x+','+y,'house');else if(v<.12)deco.set(x+','+y,'tree')}
 deco.set('23,8','vault');deco.set('22,8','vault2');
 G={crates:20,yuan:260,inf:1,wave:0,kills:0,defected:0,printed:0};towers=[];ens=[];allies=[];shots=[];fxs=[];pops=[];spawnQ=[];waveOn=false;selT=null;tsel=null;fast=1;
 state='play';$('#title').hidden=true;$('#hud').hidden=false;msg={s:'THE LAST BOAT SAILS AFTER WAVE '+M.waves,t:0};music('m3')}
const price=k=>Math.round(TD[k].c*G.inf);
const upPrice=t=>Math.round(TD[t.k].c*.9*(t.lv+1)*G.inf);
const isFree=(x,y)=>x>=0&&y>=0&&x<GW&&y<GH&&!pathTiles.has(x+','+y)&&!deco.has(x+','+y)&&!towers.some(t=>t.x===x&&t.y===y);
function posAt(d){let acc=0;for(let i=0;i<pathPts.length-1;i++){const[a,b]=[pathPts[i],pathPts[i+1]],l=Math.hypot(b[0]-a[0],b[1]-a[1]);if(acc+l>=d){const k=(d-acc)/l;return[a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k,Math.sign(b[0]-a[0])||1]}acc+=l}const e=pathPts[pathPts.length-1];return[e[0],e[1],1]}
function nextWave(){if(waveOn||G.wave>=M.waves)return;G.wave++;const w=G.wave;waveOn=true;
 // printing presses pay out and inflate
 let inc=0,np=0;for(const t of towers)if(t.k==='press'){inc+=TD.press.lv[t.lv].inc;np++}
 if(inc){const pay=Math.round(inc*G.inf);G.yuan+=pay;G.printed+=pay;pops.push({x:W/2,y:60,s:'PRESSES PRINTED ¥'+fmtBig(pay),c:'#d9a441',t:0})}
 if(w>1){G.inf*=1.08+np*.03;msg={s:'PRICES +'+Math.round((1.08+np*.03-1)*100)+'%',t:0}}
 const budget=(40+w*30)*M.mul;let b=0;const types=Object.keys(ED).filter(k=>!ED[k].boss&&ED[k].from<=w);
 spawnQ=[];let gap=0;if(w%5===0)spawnQ.push({k:'tank',at:0});
 while(b<budget){const k=pick2(types);const d=ED[k];const n=d.grp||1;for(let i=0;i<n;i++){spawnQ.push({k,at:gap});gap+=d.grp?10:Math.max(14,40-w)}b+=d.hp/10*n;gap+=10}
 X.horn()}
const pick2=a=>a[Math.floor(rnd()*a.length)];
function spawn(k){const d=ED[k],hp=d.hp*(1+G.wave*.09)*M.mul;ens.push({k,d,hp,max:hp,dist:0,slow:1,fl:0,id:rnd(),anim:rnd()*20|0})}

/* ---------------- update ---------------- */
function step(){T++;if(state!=='play')return;
 if(msg&&++msg.t>150)msg=null;for(const p of pops)p.t++;pops=pops.filter(p=>p.t<70);
 if(waveOn){for(const q of spawnQ)q.at--;const go=spawnQ.filter(q=>q.at<=0);spawnQ=spawnQ.filter(q=>q.at>0);for(const q of go)spawn(q.k);if(!spawnQ.length&&!ens.length){waveOn=false;G.yuan+=Math.round(20*G.inf);if(G.wave>=M.waves)return win()}}
 // enemies
 for(const e of ens){let sp=e.d.spd;const off=ens.find(o=>o.d.aura&&o!==e&&Math.abs(o.dist-e.dist)<40);if(off)sp*=1.3;e.dist+=sp*e.slow;e.slow=Math.min(1,e.slow+.02);e.anim++;if(e.fl>0)e.fl--;
  if(e.dist>=pathLen){e.dead=1;G.crates=Math.max(0,G.crates-e.d.steal);pops.push({x:W-30,y:OY+8*TS,s:'-'+e.d.steal+' CRATE',c:'#ff6a5a',t:0});SFX.alarm();if(G.crates<=0)return lose()}}
 // allies (defectors) walk back
 for(const a of allies){a.dist-=.7;a.anim++;for(const e of ens){if(!e.dead&&Math.abs(e.dist-a.dist)<8){e.hp-=1.2;a.hp-=1;e.fl=2;if(e.hp<=0)killE(e)}}if(a.hp<=0||a.dist<=0)a.dead=1}
 // towers
 for(const t of towers){const st=TD[t.k].lv[t.lv],cx=t.x*TS+8,cy=OY+t.y*TS+8;t.cd--;
  const inR=e=>{const[x,y]=posAt(e.dist);const d=Math.hypot(x-cx,y-cy)/TS;return d<=st.range&&(!TD[t.k].min||d>=TD[t.k].min)};
  if(t.k==='speaker'){for(const e of ens)if(!e.dead&&inR(e)){e.slow=Math.min(e.slow,st.slow);if(!e.d.boss&&e.d.k!=='cart'&&rnd()<st.conv){e.dead=1;allies.push({k:e.k,d:e.d,dist:e.dist,hp:e.hp*1.5,anim:0});G.defected++;pops.push({x:posAt(e.dist)[0],y:posAt(e.dist)[1]-20,s:pick2(['I DEFECT!','SAME WAR, BETTER RICE?','WHERE DO I SIGN?']),c:'#9fe0a0',t:0})}}if(T%40===0)t.talk=pick2(['SURRENDER!','WE HAVE RICE!','GOLD IS SAFE!','GO HOME!']);continue}
  if(t.k==='press'){if(T%30===0)fxs.push({x:cx+(rnd()-.5)*6,y:cy-6,vx:(rnd()-.5)*.6,vy:-.8,l:40,c:'#8aa070',bill:1});continue}
  if(t.cd>0)continue;let tgt=null;for(const e of ens)if(!e.dead&&inR(e)&&(!tgt||e.dist>tgt.dist))tgt=e;if(!tgt)continue;
  t.cd=st.rate;const[ex,ey]=posAt(tgt.dist);t.face=ex>cx?1:-1;t.muz=4;
  if(t.k==='mortar'){shots.push({x0:cx,y0:cy-6,x1:ex,y1:ey,t:0,dur:34,dmg:st.dmg,splash:st.splash});SFX.far&&tone(200,90,.15,'sine',.08)}
  else{hitE(tgt,st.dmg);shots.push({line:1,x0:cx+t.face*6,y0:cy-6,x1:ex,y1:ey-6,t:0,dur:4});t.k==='mg'?SFX.hmg():SFX.shot()}}
 for(const s of shots){s.t++;if(!s.line&&s.t===s.dur){SFX.boom();for(let i=0;i<14;i++)fxs.push({x:s.x1,y:s.y1,vx:(rnd()-.5)*3,vy:-rnd()*3,l:20,c:pick2(['#ffe27a','#ff8a1a','#555'])});for(const e of ens){if(e.dead)continue;const[x,y]=posAt(e.dist);if(Math.hypot(x-s.x1,y-s.y1)<=s.splash*TS)hitE(e,s.dmg)}}}
 shots=shots.filter(s=>s.t<s.dur);
 for(const f of fxs){f.x+=f.vx;f.y+=f.vy;f.vy+=f.bill?0:.15;f.l--}fxs=fxs.filter(f=>f.l>0);
 ens=ens.filter(e=>!e.dead);allies=allies.filter(a=>!a.dead)}
function hitE(e,dmg){if(e.dead)return;const d=Math.max(1,dmg-(e.d.armor||0));e.hp-=d;e.fl=4;if(e.hp<=0)killE(e)}
function killE(e){if(e.dead)return;e.dead=1;G.kills++;const b=Math.round(e.d.b*Math.sqrt(G.inf));G.yuan+=b;const[x,y]=posAt(e.dist);pops.push({x,y:y-14,s:'+¥'+b,c:'#d9a441',t:0});if(e.d.boss){SFX.boom(true)}for(let i=0;i<6;i++)fxs.push({x,y:y-6,vx:(rnd()-.5)*2,vy:-rnd()*2,l:16,c:'#a8201a'})}
function win(){state='win';music('ending')}
function lose(){state='lose';music('off');SFX.die()}
const X={horn:()=>{const t=AC?AC.currentTime:0;[62,67,71].forEach((n,i)=>tone(mf(n),mf(n),.3,'sawtooth',.04,t+i*.12))}};

/* ---------------- render ---------------- */
const tileXY=(x,y)=>[x*TS,OY+y*TS];
function drawMap(){for(let y=0;y<GH;y++)for(let x=0;x<GW;x++){const[px,py]=tileXY(x,y),k=x+','+y,v=((x*7+y*13)%5);
 if(pathTiles.has(k)){r(px,py,TS,TS,v<2?'#6a6260':'#5e5654');r(px+2,py+3,5,4,'#77706c');r(px+9,py+9,5,4,'#77706c')}
 else{r(px,py,TS,TS,mapK==='docks'?(v<2?'#4a3e32':'#443828'):(v<2?'#3e3a2c':'#38341f'));if(v===3)r(px+5,py+6,2,2,'#2a2418')}}
 for(const[k,d]of deco){const[x,y]=k.split(',').map(Number),[px,py]=tileXY(x,y);
  if(d==='water'){r(px,py,TS,TS,'#2c3c5a');r(px+((T>>3)+x*5)%14,py+6,4,1,'#6a8ab0')}
  else if(d==='house'){r(px+1,py+4,14,12,'#5b4636');r(px,py+2,16,3,'#1a1216');r(px+6,py+8,4,5,'#d9843a');if((x+y)%3===0){const fl=(T>>2)%3;r(px+3,py-2-fl,4,4,'#ff8a1a')}}
  else if(d==='tree'){r(px+7,py+6,2,10,'#2a1e18');r(px+3,py+1,10,7,'#2f4a2a')}
  else if(d==='vault'){r(px-14,py-18,30,34,'#7a7080');r(px-14,py-20,30,3,'#4a4450');for(let i=0;i<4;i++)r(px-11+i*7,py-14,3,26,'#9a90a0');hanV('銀行',px+12,py-16,'#d9a441',7)}}
 // gold crates stack
 const[vx,vy]=tileXY(22,9);for(let i=0;i<G.crates;i++)r(vx+(i%5)*6-4,vy+12-(i/5|0)*5,5,4,i%2?'#d9a441':'#b8862a');
 if(mapK==='docks'){const bx=W-40+Math.sin(T/30)*2;r(bx,OY+GH*TS-12,40,8,'#4a3220');r(bx+16,OY+GH*TS-30,2,18,'#3a2a20');r(bx+18,OY+GH*TS-28,12,10,'#d9cfb8')}}
function drawEnemy(e,ally){const[x,y,dir]=posAt(e.dist),d=e.d;const fc=ally?-dir:dir;ctx.save();ctx.translate(Math.round(x),Math.round(y)+6);
 if(d.k==='tank'){const fl=e.fl>0&&T%2;r(-16,-14,32,10,fl?'#fff':'#5d6447');r(-10,-20,18,7,fl?'#ddd':'#434833');r(fc>0?6:-20,-18,14,2,'#2a2a26');r(-16,-5,32,5,'#262622');for(let i=-14;i<16;i+=6)r(i,-4,3,3,'#555')}
 else if(d.k==='cart'){r(-10,-10,20,6,'#5a4030');r(-8,-16,16,6,'#d9a441');r(-8,-4,4,4,'#2a1e18');r(4,-4,4,4,'#2a1e18');ctx.scale(.55,.55);drawCivilian(fc>0?-34:18,0,{face:fc,pose:'run',anim:e.anim,hat:'straw',emo:'smug'})}
 else{ctx.scale(.58,.58);if(ally)ctx.globalAlpha=.85;if(d.k==='civ')drawCivilian(-8,0,{face:fc,pose:'run',anim:e.anim,hat:d.hat,cl:d.cl,emo:ally?'happy':e.fl>0?'hurt':'smug'});
  else drawSoldier(-8,0,{fac:d.fac,face:fc,pose:'run',anim:e.anim,emo:ally?'happy':e.fl>0?'hurt':d.officer?'smug':'determined',gun:d.gun||null,officer:d.officer});
  if(ally){r(-4,-46,8,6,'#f4f4f4')}}
 ctx.restore();if(!ally&&e.hp<e.max){r(x-8,y-14,16,2,'#2a0a0a');r(x-8,y-14,16*e.hp/e.max,2,d.boss?'#ff8a3a':'#c8372d')}}
function drawTower(t){const[px,py]=tileXY(t.x,t.y),cx=px+8,cy=py+8;
 if(t.k==='press'){r(px+1,py+3,14,12,'#4a4450');r(px+3,py+1,10,3,'#2a2830');r(px+3,py+8,10,2,'#8aa070');txt('¥',cx,py+4,'#d9a441','center');return}
 if(t.k==='speaker'){r(cx-1,py,2,16,'#4a3a2a');r(cx-5,py-1,4,4,'#9a9a9a');r(cx+1,py-1,4,4,'#9a9a9a');if(t.talk&&T%40<30){ctx.font='6px monospace';ctx.fillStyle='#ffd24a';ctx.textAlign='center';ctx.fillText(t.talk,cx,py-3)}return}
 for(let i=0;i<4;i++)r(px+i*4,py+11,4,4,i%2?'#9a8660':'#8a7650');
 if(t.k==='mortar'){r(cx-2,py+3,4,9,'#3a3a3a');r(cx-3,py+2,6,2,'#555');return}
 ctx.save();ctx.translate(px+8,py+12);ctx.scale(.5,.5);drawSoldier(-8,0,{fac:'kmt',face:t.face||1,pose:'crouch',gun:t.k==='mg'?'hmg':'rifle',muzz:t.muz>0,emo:t.muz>0?'grit':'determined'});ctx.restore();if(t.muz>0)t.muz--;
 for(let i=0;i<t.lv;i++)r(px+1+i*4,py+1,3,3,'#ffd24a')}
let btns=[];
function hud(){r(0,0,W,OY,'#120d0c');r(0,OY-1,W,1,'#3a2e26');btns=[];
 txt('CRATES '+G.crates,4,3,'#d9a441');txt('¥'+fmtBig(G.yuan),4,13,'#e9dcc2');txt('PRICE ×'+G.inf.toFixed(2),64,13,G.inf>2?'#ff6a5a':'#a8977c');txt('WAVE '+G.wave+'/'+M.waves,64,3,'#e9dcc2');
 TKEYS.forEach((k,i)=>{const x=140+i*34,on=tsel===k,afford=G.yuan>=price(k);r(x,2,32,20,on?'#3a2a12':'#1d1513');r(x,2,32,1,on?'#ffd24a':'#3a2e26');txt(String(i+1),x+2,4,'#6e6050');
  txt(TD[k].n.split(' ')[0].slice(0,6),x+16,4,afford?'#e9dcc2':'#6e6050','center');txt('¥'+fmtBig(price(k)),x+16,13,afford?'#d9a441':'#6e6050','center');btns.push({x,y:2,w:32,h:20,f:()=>{tsel=tsel===k?null:k;selT=null}})});
 const bx=W-100;r(bx,2,40,20,waveOn?'#1d1513':'#3a1a12');txt(waveOn?'WAVE...':'NEXT',bx+20,4,waveOn?'#6e6050':'#ffd24a','center');txt(waveOn?'':'WAVE',bx+20,13,'#ffd24a','center');btns.push({x:bx,y:2,w:40,h:20,f:nextWave});
 r(W-58,2,16,20,fast>1?'#3a2a12':'#1d1513');txt('»',W-50,7,fast>1?'#ffd24a':'#a8977c','center');btns.push({x:W-58,y:2,w:16,h:20,f:()=>{fast=fast>1?1:3}});
 if(tsel){txt(TD[tsel].n+': '+TD[tsel].d,W/2,H-10,'#e9dcc2','center')}
 if(selT){const t=selT,[px,py]=tileXY(t.x,t.y),bx2=clamp(px-24,2,W-66),by=py>OY+40?py-26:py+18;r(bx2,by,64,22,'rgba(12,9,8,.92)');r(bx2,by,64,1,'#d9a441');
  if(t.lv<2){const c=upPrice(t);txt('UP ¥'+fmtBig(c),bx2+3,by+3,G.yuan>=c?'#ffd24a':'#6e6050');btns.push({x:bx2,y:by,w:64,h:11,f:()=>{if(G.yuan>=c){G.yuan-=c;t.paid+=c;t.lv++;SFX.oneup()}}})}else txt('MAX LEVEL',bx2+3,by+3,'#6e6050');
  const sv=Math.round(t.paid*.5);txt('SELL ¥'+fmtBig(sv),bx2+3,by+12,'#e9dcc2');btns.push({x:bx2,y:by+11,w:64,h:11,f:()=>{G.yuan+=sv;towers=towers.filter(o=>o!==t);selT=null;SFX.pick()}})}}
function render(){if(state==='title'){camX=(T*.3)%300;if(!BGD)buildBG();drawBG();ctx.drawImage(VIG,0,0);return}
 ctx.fillStyle='#120d0c';ctx.fillRect(0,0,W,H);drawMap();
 const list=ens.map(e=>[e,false]).concat(allies.map(a=>[a,true])).sort((a,b)=>posAt(a[0].dist)[1]-posAt(b[0].dist)[1]);
 for(const t of towers)drawTower(t);for(const[e,a]of list)drawEnemy(e,a);
 for(const s of shots){if(s.line){r(s.x1-1,s.y1-1,3,3,'#ffe27a');ctx.strokeStyle='rgba(255,226,122,.7)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(s.x0,s.y0);ctx.lineTo(s.x1,s.y1);ctx.stroke()}else{const k=s.t/s.dur,x=lerp2(s.x0,s.x1,k),y=lerp2(s.y0,s.y1,k)-Math.sin(k*Math.PI)*40;r(x-1,y-1,3,3,'#2a2a2a')}}
 for(const f of fxs)f.bill?(r(f.x-2,f.y,5,2,'#8aa070')):r(f.x,f.y,2,2,f.c);
 if(hover&&tsel){const[x,y]=hover,ok=isFree(x,y),[px,py]=tileXY(x,y);ctx.globalAlpha=.35;r(px,py,TS,TS,ok?'#9fe0a0':'#ff6a5a');ctx.globalAlpha=1;const st=TD[tsel].lv[0];if(st.range){ctx.strokeStyle='rgba(255,255,255,.4)';ctx.beginPath();ctx.arc(px+8,py+8,st.range*TS,0,6.28);ctx.stroke()}}
 if(selT){const st=TD[selT.k].lv[selT.lv],[px,py]=tileXY(selT.x,selT.y);if(st.range){ctx.strokeStyle='rgba(255,210,74,.5)';ctx.beginPath();ctx.arc(px+8,py+8,st.range*TS,0,6.28);ctx.stroke()}}
 for(const p of pops){ctx.globalAlpha=1-p.t/70;txt(p.s,p.x,p.y-p.t*.3,p.c,'center');ctx.globalAlpha=1}
 hud();if(msg)stxt(msg.s,W/2,OY+40,'#e9dcc2',14,msg.t<20?msg.t/20:msg.t>120?(150-msg.t)/30:1);
 if(state==='win'||state==='lose'){r(0,0,W,H,'rgba(8,6,5,.82)');const w=state==='win';stxt(w?'THE LAST BOAT SAILS':'THE GOLD HAS BEEN REDISTRIBUTED',W/2,50,w?'#ffd24a':'#b3261e',w?22:16);
  const fact=w?'In 1948–49 the Nationalist government shipped most of China\'s gold reserves from Shanghai to Taiwan.':'Bank runs and gold riots hit Shanghai as the Gold Yuan collapsed in late 1948.';const joke=w?'You saved '+G.crates+' crates. The receipt says "temporarily relocated." It still says that.':'The crowd took the gold. By morning, it bought less than it did yesterday.';
  wrap(fact,46).forEach((l,i)=>txt(l,W/2,80+i*10,'#e9dcc2','center'));wrap(joke,46).forEach((l,i)=>txt(l,W/2,116+i*10,'#ff9a6a','center'));
  txt('WAVES '+G.wave+' · LOOTERS STOPPED '+G.kills+' · DEFECTORS '+G.defected+' · MONEY PRINTED ¥'+fmtBig(G.printed),W/2,152,'#a8977c','center');txt(touchUI?'TAP TO RETURN':'ENTER TO RETURN',W/2,H-16,'#6e6050','center')}
 ctx.drawImage(VIG,0,0)}
const lerp2=(a,b,k)=>a+(b-a)*k;

/* ---------------- input ---------------- */
let touchUI=matchMedia('(pointer:coarse)').matches;
function toXY(e){const rc=cv.getBoundingClientRect();return[(e.clientX-rc.left)/rc.width*W,(e.clientY-rc.top)/rc.height*H]}
cv.addEventListener('pointerdown',e=>{initAudio();const[x,y]=toXY(e);if(state==='win'||state==='lose'){toTitle();return}if(state!=='play')return;
 for(const b of btns)if(x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h){b.f();return}
 if(y<OY)return;const tx=Math.floor(x/TS),ty=Math.floor((y-OY)/TS);const t=towers.find(o=>o.x===tx&&o.y===ty);
 if(t){selT=selT===t?null:t;tsel=null;return}selT=null;
 if(tsel&&isFree(tx,ty)){const c=price(tsel);if(G.yuan>=c){G.yuan-=c;towers.push({k:tsel,x:tx,y:ty,lv:0,cd:0,paid:c,face:1});SFX.pick();for(let i=0;i<8;i++)fxs.push({x:tx*TS+8,y:OY+ty*TS+12,vx:(rnd()-.5)*2,vy:-rnd()*1.5,l:16,c:'#a8977c'});if(touchUI)tsel=null}else{pops.push({x,y,s:'NOT ENOUGH ¥ (PRICES ROSE)',c:'#ff6a5a',t:0});SFX.clang()}}});
cv.addEventListener('pointermove',e=>{const[x,y]=toXY(e);hover=y>OY?[Math.floor(x/TS),Math.floor((y-OY)/TS)]:null});
addEventListener('keydown',e=>{if(state==='win'||state==='lose'){if(e.code==='Enter'||e.code==='Space')toTitle();return}if(state!=='play')return;initAudio();
 const i='12345'.indexOf(e.key);if(i>=0){tsel=tsel===TKEYS[i]?null:TKEYS[i];selT=null}if(e.code==='Space'){e.preventDefault();nextWave()}if(e.code==='KeyF')fast=fast>1?1:3;if(e.code==='Escape'){tsel=null;selT=null}});
function toTitle(){state='title';$('#title').hidden=false;$('#hud').hidden=true;music('off')}
$('#bBund').onclick=()=>{initAudio();start('bund')};$('#bDocks').onclick=()=>{initAudio();start('docks')};
$('#bPause').hidden=true;$('#bSnd').onclick=e=>{initAudio();setMute(!muted);e.currentTarget.textContent=muted?'MUTE':'SND';e.currentTarget.blur()};
function fit(){const vw=innerWidth,vh=innerHeight,s=Math.min(vw/W,vh/H);cv.style.width=Math.floor(W*s)+'px';cv.style.height=Math.floor(H*s)+'px'}
addEventListener('resize',fit);fit();cv.style.touchAction='none';
let last=performance.now(),acc=0;
function loop(nt){acc+=Math.min(100,nt-last);last=nt;while(acc>=16.67){acc-=16.67;for(let i=0;i<(state==='play'?fast:1);i++)step()}render();requestAnimationFrame(loop)}
(document.fonts?Promise.all([document.fonts.load(F),document.fonts.load(SERIF(20))]):Promise.resolve()).catch(()=>{}).finally(()=>requestAnimationFrame(loop));
