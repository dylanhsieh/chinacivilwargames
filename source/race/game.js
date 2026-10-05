/* ===================== LAST FERRY RUSH — a Civil Slug pseudo-3D racer ===================== */
let T=0,camX=0,S='kmt',EN='ccp',LV=0,skyFlash=0,skyFX=0,state='title';
let plats=[],scorch=[];const L={walls:[],theme:'village',deep:null,weather:null};function groundAt(){return GY}
const VIG=document.createElement('canvas');VIG.width=W;VIG.height=H;{const g=VIG.getContext('2d');const rg=g.createRadialGradient(W/2,H/2,H*.4,W/2,H/2,W*.65);rg.addColorStop(0,'rgba(0,0,0,0)');rg.addColorStop(1,'rgba(6,2,2,.5)');g.fillStyle=rg;g.fillRect(0,0,W,H)}
const SERIF=s=>`900 ${s}px "Noto Serif TC","Songti TC",Georgia,serif`;
function stxt(s,x,y,c,size,a=1,al='center'){ctx.font=SERIF(size);ctx.textAlign=al;ctx.textBaseline='middle';ctx.globalAlpha=a;ctx.fillStyle='#000';ctx.fillText(s,x+1,y+2);ctx.fillStyle=c;ctx.fillText(s,x,y);ctx.globalAlpha=1}
/* ---------------- track ---------------- */
const SEG=200,RW=2000,CAMH=1000,DRAW=140,FOV=100,CAMD=1/Math.tan(FOV/2*Math.PI/180),HZ=H*.42;
let segs=[],trackLen=0;
const ZN=[{theme:'village',name:'VILLAGE ROAD',grass:['#3e3a2c','#38341f'],rumble:['#6a6260','#e9dcc2'],road:['#5e5654','#5a5250']},
 {theme:'river',name:'THE YANGTZE BRIDGE',grass:['#2c3c5a','#28374f'],rumble:['#5a4030','#d9cfb8'],road:['#5a4030','#523a2a']},
 {theme:'city',name:'SHANGHAI STREETS',grass:['#2a2830','#24222a'],rumble:['#c8372d','#e9dcc2'],road:['#3a3640','#36323c']}];
function addRoad(n,curve,hill,zone){const start=segs.length?segs[segs.length-1].y2:0;for(let i=0;i<n;i++){const k=i/n,y=start+hill*(Math.sin((k-.5)*Math.PI)/2+.5)*SEG*8;const s={i:segs.length,curve:curve*Math.sin(k*Math.PI),y1:segs.length?segs[segs.length-1].y2:0,y2:y,zone,sprites:[],cars:[]};segs.push(s)}}
function buildTrack(){segs=[];const plan=[[60,0,0],[80,2,1],[60,-3,-1],[100,0,2],[80,4,0],[60,-2,-2],[80,0,1],[60,-4,0],[100,3,1],[80,0,-1]];
 for(let z=0;z<3;z++)for(const[n,c,h]of plan)addRoad(n,c*(z===1?.5:1),z===1?0:h,z);
 trackLen=segs.length*SEG;const R_=seeded(1949);
 for(const s of segs){const z=s.zone;if(s.i%8===0&&R_()<.8){const side=R_()<.5?-1:1,k=z===0?pick2(['house','tree','poster','burn','bags'],R_):z===1?pick2(['post','post','boat','tree'],R_):pick2(['lamp','shop','poster','bank','lamp'],R_);s.sprites.push({k,x:side*(1.3+R_()*1.5)})}
  if(s.i%120===60)s.sprites.push({k:'check',x:0})}
 // traffic
 cars=[];for(let i=0;i<70;i++){const z=Math.floor(R_()*segs.length);if(z<40)continue;cars.push({z:z*SEG,x:(R_()*1.6-.8),k:pick2(['cart','refugee','rickshaw','truckK','truckC','bike','tank'],R_),spd:0})}
 for(const c of cars)c.spd={cart:30,refugee:15,rickshaw:50,truckK:90,truckC:90,bike:60,tank:25}[c.k]}
const pick2=(a,R_)=>a[Math.floor(R_()*a.length)];
let cars=[],pos=0,px=0,spd=0,timeLeft=0,pax=12,fare=0,inf=1,lastCheck=-1,msg=null,crashT=0,lap=0,shake=0,heldK={},zoneShown=-1,dist=0;
const MAXS=SEG*60/1.2;
function startRace(){buildTrack();pos=0;px=0;spd=0;timeLeft=75;pax=12;fare=0;inf=1;lastCheck=-1;crashT=0;dist=0;zoneShown=-1;state='play';$('#title').hidden=true;$('#hud').hidden=false;if(touchUI)$('#touch').hidden=false;music('m5')}
/* ---------------- update ---------------- */
function update(){T++;if(state!=='play')return;const dt=1/60;const seg=segs[Math.floor(pos/SEG)%segs.length],sp=spd/MAXS;
 const acc=touchUI?!heldK.d:heldK.u,brk=heldK.d;
 if(crashT>0){crashT--;spd*=.92}else if(acc)spd+=MAXS/5*dt;else if(brk)spd-=MAXS/2*dt;else spd-=MAXS/8*dt;
 const steer=(heldK.l?-1:0)+(heldK.r?1:0);px+=steer*dt*2.2*sp;px-=dt*2*sp*sp*seg.curve*.35;
 if(Math.abs(px)>1.05){spd*=.985;if(spd>MAXS/4)spd-=MAXS/2*dt;if(T%6===0)shake=2}
 px=clamp(px,-2.2,2.2);spd=clamp(spd,0,MAXS);pos+=spd*dt;dist+=spd*dt;if(pos>=trackLen){finish(true);return}
 // checkpoints
 for(let i=0;i<4;i++){const s=segs[(Math.floor(pos/SEG)+i)%segs.length];for(const sp_ of s.sprites)if(sp_.k==='check'&&s.i!==lastCheck&&i===0){lastCheck=s.i;timeLeft+=30;msg={s:'CHECKPOINT! +30s · PAPERS: ACCEPTED (BRIBE: 3 PASSENGERS\' LUNCH)',t:0};SFX.oneup()}}
 // traffic
 for(const c of cars){c.z+=c.spd*SEG/60*dt*4;if(c.z>=trackLen)c.z-=trackLen;const dz=c.z-pos;if(dz>0&&dz<SEG*1.2&&Math.abs(c.x-px)<(c.k==='tank'?.6:.4)&&crashT<=0){crash(c)}}
 fare+=sp*dt*8*inf;inf*=1.0008;timeLeft-=dt;if(timeLeft<=0){finish(false);return}
 const z=seg.zone;if(z!==zoneShown){zoneShown=z;L.theme=ZN[z].theme;L.weather=z===2?'rain':null;LV=z;buildBG();msg={s:ZN[z].name,t:0,big:1}}
 if(msg&&++msg.t>150)msg=null;if(shake>0)shake*=.8;camX+=seg.curve*sp*2.5}
function crash(c){crashT=40;shake=10;spd*=.3;SFX.boom();const lost=c.k==='tank'?3:c.k==='refugee'?0:1;pax=Math.max(0,pax-lost);c.x+=c.x>px?.5:-.5;
 msg={s:c.k==='refugee'?'YOU SWERVED INTO THE DITCH. THE REFUGEE IS FINE. THANKS FOR ASKING.':c.k==='tank'?'YOU HIT A TANK. THE TANK DID NOT NOTICE. '+lost+' PASSENGERS LEFT':'CRASH! '+lost+' PASSENGER '+pick(['DEFECTED','WALKED','FELL OFF','GOT A BETTER OFFER']),t:0};if(pax<=0)finish(false)}
function finish(ok){state=ok?'win':'lose';music(ok?'ending':'off');if(!ok)SFX.die()}
/* ---------------- render ---------------- */
function project(wx,wy,wz,cx,cy,cz){const tx=wx-cx,ty=wy-cy,tz=wz-cz;const sc=CAMD/tz;return{x:Math.round(W/2+sc*tx*W/2),y:Math.round(HZ-sc*ty*H/2),w:Math.round(sc*RW*W/2),sc}}
function poly(x1,y1,w1,x2,y2,w2,c){ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(x1-w1,y1);ctx.lineTo(x2-w2,y2);ctx.lineTo(x2+w2,y2);ctx.lineTo(x1+w1,y1);ctx.closePath();ctx.fill()}
function render(){if(state==='title'){camX+=.4;if(!BGD)buildBG();drawBG();ctx.drawImage(VIG,0,0);return}
 ctx.save();if(shake>0&&!RM)ctx.translate((rnd()-.5)*shake,(rnd()-.5)*shake);
 // sky/background (parallax using the shared backdrop, clipped above horizon)
 ctx.save();ctx.beginPath();ctx.rect(0,0,W,HZ+2);ctx.clip();ctx.translate(0,HZ-GY+4);drawBG();ctx.restore();
 const base=Math.floor(pos/SEG),bs=segs[base%segs.length],pct=(pos%SEG)/SEG;const camY=CAMH+lerp(bs.y1,bs.y2,pct);
 let x=0,dx=-bs.curve*pct,maxY=H;const proj=[];
 for(let n=0;n<DRAW;n++){const s=segs[(base+n)%segs.length],loop=base+n>=segs.length?trackLen:0;const z1=n*SEG-pct*SEG+1,z2=z1+SEG;
  const p1=project(px*RW-x,s.y1,z1,0,camY,0),p2=project(px*RW-x-dx,s.y2,z2,0,camY,0);x+=dx;dx+=s.curve;s.p1=p1;s.p2=p2;s.clip=maxY;
  if(p1.y<=p2.y||p2.y>=maxY){s.vis=0;continue}s.vis=1;const zn=ZN[s.zone],alt=(Math.floor((base+n)/3))%2;
  ctx.fillStyle=zn.grass[alt];ctx.fillRect(0,p2.y,W,p1.y-p2.y);
  poly(p1.x,p1.y,p1.w*1.15,p2.x,p2.y,p2.w*1.15,zn.rumble[alt]);poly(p1.x,p1.y,p1.w,p2.x,p2.y,p2.w,zn.road[alt]);
  if(alt)poly(p1.x,p1.y,p1.w*.03,p2.x,p2.y,p2.w*.03,'#e9dcc2');
  if(s.zone===1){poly(p1.x-p1.w*1.25,p1.y,p1.w*.05,p2.x-p2.w*1.25,p2.y,p2.w*.05,'#3a2818');poly(p1.x+p1.w*1.25,p1.y,p1.w*.05,p2.x+p2.w*1.25,p2.y,p2.w*.05,'#3a2818')}
  maxY=p1.y}
 // sprites back to front
 for(let n=DRAW-1;n>0;n--){const s=segs[(base+n)%segs.length];if(!s.vis)continue;const p=s.p1;
  if(n<2)continue;for(const sp of s.sprites)drawRoadSprite(sp.k,p.x+p.w*sp.x,p.y,p.w/RW,s.clip);
  for(const c of cars){const cz=((c.z-pos)%trackLen+trackLen)%trackLen;if(Math.floor(cz/SEG)!==n)continue;const k=(cz%SEG)/SEG,pp=s.p1,pq=s.p2||pp;const cx=lerp(pp.x,pq.x,k)+lerp(pp.w,pq.w,k)*c.x,cy=lerp(pp.y,pq.y,k);drawCar(c.k,cx,cy,lerp(pp.w,pq.w,k)/RW,s.clip)}}
 drawPlayer();ctx.restore();hud();ctx.drawImage(VIG,0,0)}
function drawRoadSprite(k,x,y,sc,clip){const s=sc*34;if(s<.04||y>clip+40)return;ctx.save();ctx.beginPath();ctx.rect(0,0,W,clip);ctx.clip();ctx.translate(Math.round(x),Math.round(y));ctx.scale(s,s);
 if(k==='house'){r(-20,-24,40,24,'#21171b');r(-24,-28,48,4,'#1a1216');r(-4,-16,8,8,'#d9843a')}
 else if(k==='burn'){r(-20,-24,40,24,'#21171b');r(-24,-28,48,4,'#1a1216');const f=(T>>2)%3;r(-14,-36-f,10,10+f,'#ff8a1a');r(2,-34+f,8,8,'#ffb04a')}
 else if(k==='tree'){r(-2,-40,4,40,'#2a1e18');r(-14,-48,28,14,'#2f4a2a')}
 else if(k==='poster'){r(-24,-30,48,30,'#5b4636');r(-20,-27,18,24,'#2f4f8a');hanV('救國',-11,-25,'#f2f2f2',8);r(2,-27,18,24,'#b8322a');hanV('解放',11,-25,'#f1d27a',8)}
 else if(k==='bags'){for(let i=0;i<5;i++)r(-20+i*8,-6,8,6,'#8a7650');for(let i=0;i<4;i++)r(-16+i*8,-12,8,6,'#9a8660')}
 else if(k==='post'){r(-2,-30,4,30,'#3a2818');r(-6,-30,12,3,'#3a2818')}
 else if(k==='boat'){r(-24,-8,48,8,'#4a3220');r(-2,-30,3,22,'#3a2a20');r(1,-28,14,12,'#d9cfb8')}
 else if(k==='lamp'){r(-1,-50,3,50,'#2a2a30');r(-5,-54,10,4,'#3a3a40');r(-3,-50,6,3,'#ffe8a0')}
 else if(k==='shop'){r(-22,-40,44,40,'#15131f');for(let i=0;i<3;i++)r(-18+i*13,-34,8,10,'#e0b050');r(-22,-14,44,3,'#c8372d')}
 else if(k==='bank'){r(-26,-50,52,50,'#5a5060');for(let i=0;i<4;i++)r(-22+i*13,-42,5,40,'#7a7080');hanV('銀行',22,-48,'#d9a441',8)}
 else if(k==='check'){r(-60,-36,6,36,'#5a4030');r(54,-36,6,36,'#5a4030');r(-60,-40,120,8,'#c8372d');txt('CHECKPOINT · 檢查站',0,-39,'#f1d27a','center');drawSoldier(-50,0,{fac:'kmt',face:1,emo:'smug',gun:'rifle'});drawSoldier(36,0,{fac:'ccp',face:-1,emo:'smug',gun:'rifle'})}
 ctx.restore()}
function drawCar(k,x,y,sc,clip){const s=sc*24;if(s<.04||y>clip+40)return;ctx.save();ctx.beginPath();ctx.rect(0,0,W,clip);ctx.clip();ctx.translate(Math.round(x),Math.round(y));ctx.scale(s,s);
 if(k==='cart'){r(-14,-14,28,10,'#5a4030');r(-12,-22,24,8,'#a08a5a');r(-14,-6,6,6,'#2a1e18');r(8,-6,6,6,'#2a1e18');drawDonkeyish()}
 else if(k==='refugee'){drawCivilian(-8,0,{face:1,hat:'straw',emo:'scared',pose:'run',anim:T});r(-6,-26,12,8,'#a08a5a')}
 else if(k==='rickshaw'){r(-10,-18,20,12,'#7a2a2a');r(-12,-6,4,6,'#1a1410');r(8,-6,4,6,'#1a1410');drawCivilian(-8,-4,{face:1,hat:'fedora',emo:'smug'})}
 else if(k==='bike'){r(-8,-4,4,4,'#222');r(4,-4,4,4,'#222');drawCivilian(-8,-4,{face:1,hat:'cap',emo:'normal',pose:'run',anim:T})}
 else if(k==='tank'){r(-26,-22,52,16,'#5d6447');r(-16,-32,32,10,'#434833');r(-28,-8,56,8,'#262622');r(-3,-36,6,6,'#2a2a26')}
 else{const kmt=k==='truckK',c=kmt?'#4a5a3a':'#5a6a3a';r(-22,-30,44,26,c);r(-22,-30,44,3,'#2a3a1a');r(-22,-6,10,6,'#1a1a18');r(12,-6,10,6,'#1a1a18');r(-6,-26,12,6,'#ffd24a');emblem(kmt?'kmt':'ccp',-4,-20)}
 ctx.restore()}
function drawDonkeyish(){r(-6,-30,12,8,'#7a6a5a');r(4,-34,4,6,'#7a6a5a')}
function drawPlayer(){const x=W/2,y=H-16+(crashT>0?Math.sin(T)*2:0),tilt=(heldK.l?-1:0)+(heldK.r?1:0),b=spd>10&&T%4<2?1:0;ctx.save();ctx.translate(x,y);
 r(-34,-34+b,68,30,'#4a5a3a');r(-34,-34+b,68,4,'#2a3a1a');r(-30,-42+b,60,8,'#6a7a4a');
 for(let i=0;i<Math.min(pax,10);i++){ctx.save();ctx.translate(-30+i*6.2,-38+b+(i%2?-1:0)+(spd>0&&(T+i*7)%20<3?-2:0));ctx.scale(.42,.42);drawHead(0,0,i%3?'civ':i%2?'kmt':'ccp',crashT>0?'scared':spd>MAXS*.8?'shout':'happy',1);ctx.restore()}
 r(-36,-6,16,8,'#1a1a18');r(20,-6,16,8,'#1a1a18');r(-30,-14,8,4,'#c8372d');r(22,-14,8,4,'#c8372d');r(-8,-12,16,6,'#2a2a2a');txt('48',0,-12,'#e9dcc2','center');
 if(spd>MAXS*.3&&T%3===0)for(let i=0;i<2;i++)r(-24+rnd()*48,-2+rnd()*4,3,3,'rgba(160,140,120,.6)');ctx.restore()}
function hud(){r(0,0,W,22,'rgba(12,9,8,.7)');txt('TIME',8,3,'#a8977c');txt(String(Math.ceil(timeLeft)),48,3,timeLeft<10&&T%20<10?'#ff5a3a':'#ffd24a','left',F16);
 txt(Math.round(spd/MAXS*88)+' KM/H',W/2,3,'#e9dcc2','center');txt('PASSENGERS '+pax,W/2,12,'#a8977c','center');txt('FARE ¥'+fmtBig(fare*1000),W-8,3,'#d9a441','right');txt('REAL VALUE: '+(['A HOUSE','A COW','A BAG OF RICE','A BOWL OF RICE','ONE EGG','HALF AN EGG'][Math.min(5,Math.floor(Math.log(inf)/.4))]),W-8,12,'#a8977c','right');
 const pr=pos/trackLen;r(80,H-6,W-160,3,'#2a2018');r(80,H-6,(W-160)*pr,3,'#d9a441');txt('⛴',W-78,H-12,'#e9dcc2');
 if(msg){if(msg.big)stxt(msg.s,W/2,50,'#e9dcc2',16,msg.t<20?msg.t/20:msg.t>120?(150-msg.t)/30:1);else{ctx.globalAlpha=msg.t>120?(150-msg.t)/30:1;r(0,30,W,12,'rgba(0,0,0,.6)');txt(msg.s,W/2,33,'#ffd24a','center');ctx.globalAlpha=1}}
 if(state==='win'||state==='lose'){r(0,0,W,H,'rgba(8,6,5,.82)');const w=state==='win';stxt(w?'YOU MADE THE LAST FERRY':pax<=0?'NO PASSENGERS LEFT':'THE FERRY HAS SAILED',W/2,56,w?'#ffd24a':'#b3261e',18);
  const ls=wrap(w?pax+' passengers board the last ferry. The ferryman charges them all a fare. In silver. Your Gold Yuan is accepted as kindling.':'You watch the ferry leave from the dock. Your passengers start walking. Some of them are walking faster than you drove.',44);ls.forEach((l,i)=>txt(l,W/2,84+i*10,'#e9dcc2','center'));
  txt('FARE EARNED ¥'+fmtBig(fare*1000),W/2,130,'#d9a441','center');txt(touchUI?'TAP TO RETURN':'ENTER TO RETURN',W/2,H-20,'#6e6050','center')}}
/* ---------------- input ---------------- */
let touchUI=matchMedia('(pointer:coarse)').matches;
const KM={KeyW:'u',ArrowUp:'u',KeyS:'d',ArrowDown:'d',KeyA:'l',ArrowLeft:'l',KeyD:'r',ArrowRight:'r'};
addEventListener('keydown',e=>{if(state==='win'||state==='lose'){if(e.code==='Enter'||e.code==='Space')toTitle();return}const k=KM[e.code];if(!k||state!=='play')return;e.preventDefault();initAudio();heldK[k]=1});
addEventListener('keyup',e=>{const k=KM[e.code];if(k)heldK[k]=0});
function toTitle(){state='title';$('#title').hidden=false;$('#hud').hidden=true;$('#touch').hidden=true;music('off')}
for(const el of document.querySelectorAll('#touch .tb')){const k=el.dataset.k;el.addEventListener('pointerdown',e=>{e.preventDefault();initAudio();heldK[k]=1;el.classList.add('on')});const up=()=>{heldK[k]=0;el.classList.remove('on')};el.addEventListener('pointerup',up);el.addEventListener('pointerleave',up);el.addEventListener('pointercancel',up)}
$('#touch').addEventListener('pointerdown',e=>{if(state==='win'||state==='lose')toTitle()});cv.addEventListener('pointerdown',()=>{if(state==='win'||state==='lose')toTitle()});
$('#bGo').onclick=()=>{initAudio();startRace()};$('#bPause').hidden=true;$('#bSnd').onclick=e=>{initAudio();setMute(!muted);e.currentTarget.textContent=muted?'MUTE':'SND';e.currentTarget.blur()};
function fit(){const vw=innerWidth,vh=innerHeight,s=Math.min(vw/W,vh/H);cv.style.width=Math.floor(W*s)+'px';cv.style.height=Math.floor(H*s)+'px'}
addEventListener('resize',fit);fit();
const lerp=(a,b,t)=>a+(b-a)*t;
let last=performance.now(),acc=0;
function loop(nt){acc+=Math.min(100,nt-last);last=nt;while(acc>=16.67){acc-=16.67;update()}render();requestAnimationFrame(loop)}
(document.fonts?Promise.all([document.fonts.load(F),document.fonts.load(SERIF(20))]):Promise.resolve()).catch(()=>{}).finally(()=>requestAnimationFrame(loop));
