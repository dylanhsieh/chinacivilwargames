/* ---------------- state ---------------- */
let state='title',selSide='kmt',S='kmt',EN='ccp',LV=0,L=LEVELS[0],T=0,camX=0,lockX=null,shake=0;
let flashA=0,flashC='#fff',rings=[],scorch=[],hitstop=0,skyFlash=0,skyFX=0,artT=240;
let P,lives=2,score=0,nextLife=30000,enemies=[],bullets=[],grenades=[],parts=[],pops=[],pickups=[],pows=[],boss=null,arenaI=0,si=0,ev=0,radioQ=[],radioCur=null,winT=0;
let plats=[],vehicles=[],crates=[],shouts=[],cryCD=0,killTimes=[],markers=[],raft=null,MS={},totals={kills:0,lost:0,freed:0,defects:0};
let scene=null,tally=null,credits=null;
const EMBERS=Array.from({length:34},()=>({x:rnd()*W,y:rnd()*H,v:.2+rnd()*.5,ph:rnd()*6,ash:rnd()<.55}));
const VIG=document.createElement('canvas');VIG.width=W;VIG.height=H;{const g=VIG.getContext('2d');const rg=g.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,W*.62);rg.addColorStop(0,'rgba(0,0,0,0)');rg.addColorStop(1,'rgba(10,4,2,.55)');g.fillStyle=rg;g.fillRect(0,0,W,H);g.fillStyle='rgba(0,0,0,.12)';for(let y=0;y<H;y+=2)g.fillRect(0,y,W,1)}
const LT=()=>TEXT[S].levels[LV]||{};
const M=()=>TEXT[S];

function groundAt(x){if(L.deep)for(const d of L.deep)if(x>=d[0]&&x<d[1])return 1e4;const g=L.ground;if(!g)return GY;
 if(x<=g[0][0])return g[0][1];for(let i=1;i<g.length;i++)if(x<g[i][0]){const[x0,y0]=g[i-1],[x1,y1]=g[i];return y0+(y1-y0)*(x-x0)/(x1-x0)}return g[g.length-1][1]}
const inShallow=x=>(L.shallow||[]).some(w=>x>=w[0]&&x<w[1]);

/* ---------------- mission setup ---------------- */
function loadLevel(i){LV=i;L=LEVELS[i];buildBG();T=0;camX=0;lockX=null;shake=0;winT=0;arenaI=0;si=0;ev=0;
 enemies=[];bullets=[];grenades=[];parts=[];pops=[];pickups=[];boss=null;radioQ=[];radioCur=null;rings=[];scorch=[];markers=[];shouts=[];cryCD=0;killTimes=[];flashA=0;hitstop=0;
 plats=L.plats.map(p=>({...p}));raft=null;
 if(L.auto){raft={x:16,y:GY-2,w:330,raft:1,vx:0,off:16};plats.push(raft)}
 vehicles=(L.vehicles||[]).map(([x,kind])=>({kind,x,y:groundAt(x+18),vx:0,vy:0,face:1,hp:kind==='tank'?10:7,max:kind==='tank'?10:7,ammo:20,rider:false,cool:0,flash:0,anim:0,w:kind==='tank'?40:36,on:true}));
 crates=(L.crates||[]).map(([x,item])=>({x,y:groundAt(x+7),item,hp:3,flash:0}));
 pows=L.pows.map(x=>({x,y:groundAt(x+8),st:'tied',t:0}));
 MS={kills:0,freed:0,lost:0,defects:0,t0:0};
 newPlayer(raft?120:60,raft?raft.y:groundAt(68));P.inv=0;music(L.track)}
function newPlayer(x,y){P={x,y,vx:0,vy:0,face:1,on:false,crouch:false,aim:0,wpn:'pistol',ammo:0,bombs:10,inv:150,dead:0,cool:0,anim:0,drop:0,muzz:0,slash:0,veh:null,vehCD:0,cryAt:0}}
function radio(s){if(s)radioQ.push(s)}
function pop(x,y,s,c='#e9dcc2',life=110){pops.push({x,y,s,c,life,max:life})}
function addScore(n){score=Math.max(0,score+n);if(score>=nextLife){nextLife+=40000;lives++;SFX.oneup();pop(camX+W/2,60,'1UP! ANOTHER CONSCRIPT ARRIVES','#9fe0a0',150)}}
function cry(force){if(!P||P.dead||(!force&&cryCD>0))return;const s=pick(CRIES[S]);shouts=shouts.filter(b=>b.ent!==P);shouts.push({ent:P,s,t:85,hero:1});cryCD=300}
function taunt(e){shouts.push({ent:e,s:pick(TAUNTS[EN]),t:85});e.shout=40}

/* ---------------- spawning ---------------- */
function spawn(t,x,y,from){
 if(t!=='para'&&t!=='boat'&&enemies.filter(e=>!e.dead&&!e.ally).length>11)return null;
 if(t==='rifle'&&rnd()<.07)t='surrender';
 const hp={runner:1,rifle:2,grenadier:2,surrender:1,mgnest:14,mortar:3,sniper:2,cavalry:4,para:2,officer:3,boat:8}[t]||2;
 const gx=from==='L'?camX-14:x;
 const e={t,x:gx,y:typeof y==='number'&&y>0?y:groundAt(gx+8),vx:0,vy:0,face:-1,hp,cool:50+rnd()*60,anim:0,dead:false,dt:0,ally:false,surr:t==='surrender',flash:0,fixed:typeof y==='number'&&y>0,shootT:0,shout:0,on:true};
 if(t==='mgnest'||t==='mortar')e.static=1;
 if(t==='sniper'){e.fixed=true;e.aimT=0;e.cool=60}
 if(t==='para'){e.x=camX+60+rnd()*(W-120);e.y=-30;e.para=1;e.on=false}
 if(t==='boat'){e.x=camX+W+20;e.y=WATERY;e.static=1;e.plat={x:e.x,y:WATERY-6,w:40,boat:1,vx:0};plats.push(e.plat);
  for(let i=0;i<2;i++){const r_=spawn('rifle',e.x+4+i*18,WATERY-6);if(r_){r_.fixed=true;r_.onBoat=e;r_.surr=false;r_.t='rifle'}}}
 enemies.push(e);return e}
function spawnBoss(kind){const bx=camX+W+20;let b={kind,x:bx,y:GY,flash:0,dead:false,dt:0,cool:90,spawn:220,t:0};
 const P1=(o)=>Object.assign({flash:0,req:1},o);
 if(kind==='truck')Object.assign(b,{tx:camX+270,parts:[P1({kind:'main',ox:0,oy:34,w:70,h:34,hp:50})]});
 else if(kind==='tank')Object.assign(b,{tx:camX+275,mg:200,burst:0,plate:0,parts:[P1({kind:'main',ox:0,oy:34,w:84,h:34,hp:160})]});
 else if(kind==='train')Object.assign(b,{tx:camX+130,mg:160,burst:0,parts:[P1({kind:'cannon',ox:0,oy:40,w:70,h:40,hp:45}),P1({kind:'mg',ox:74,oy:40,w:70,h:40,hp:45}),P1({kind:'troops',ox:148,oy:40,w:70,h:40,hp:35}),P1({kind:'engine',ox:222,oy:44,w:84,h:44,hp:70,armor:1})]});
 else if(kind==='bomber')Object.assign(b,{x:camX+W+80,y:46,face:-1,vx:-1.2,parts:[P1({kind:'main',ox:-46,oy:12,w:92,h:22,hp:150})],bay:0,salvo:0});
 else if(kind==='car')Object.assign(b,{tx:camX+250,ang:Math.PI,burst:0,mg:120,parts:[P1({kind:'main',ox:0,oy:36,w:60,h:36,hp:75})]});
 else if(kind==='press')Object.assign(b,{x:camX+254,printed:1e9,parts:[P1({kind:'roller',ox:-10,oy:100,w:18,h:30,hp:50}),P1({kind:'gold',ox:-8,oy:62,w:22,h:18,hp:50}),P1({kind:'core',ox:0,oy:38,w:32,h:32,hp:90,armor:1})]});
 else if(kind==='gunboat')Object.assign(b,{x:camX+W+10,tx:camX+250,mg:150,burst:0,parts:[P1({kind:'main',ox:0,oy:32,w:110,h:34,hp:130})]});
 else if(kind==='mech')Object.assign(b,{tx:camX+190,walk:0,stomp:0,eyeT:0,laser:0,laserY:0,phase:0,parts:[P1({kind:'face',ox:-5,oy:150,w:100,h:80,hp:220})]});
 b.max=b.parts.reduce((a,p)=>a+p.hp,0);b.hp=b.max;
 if(kind==='train')for(const p of b.parts){p.plat={x:0,y:GY-p.oy,w:p.w,vx:0};plats.push(p.plat)}
 boss=b}

/* ---------------- geometry ---------------- */
const hb=e=>({x:e.x+2,y:e.y-(e.crouch?21:28),w:12,h:e.crouch?21:28});
function hbOf(e){if(e.t==='mgnest')return{x:e.x,y:e.y-18,w:34,h:18};if(e.t==='cavalry')return{x:e.x+2,y:e.y-44,w:30,h:44};if(e.t==='boat')return{x:e.x,y:WATERY-8,w:40,h:12};return hb(e)}
const ov=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
const inR=(x,y,r)=>x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h;
const partBox=(b,p)=>({x:b.x+p.ox,y:b.y-p.oy,w:p.w,h:p.h});
const vBox=v=>({x:v.x+2,y:v.y-30,w:v.w-4,h:30});
function phys(e,w=16){e.vy=Math.min(e.vy+.22,5);const py=e.y,wasOn=e.on,pp=e.plat;let nx=e.x+e.vx;
 if(pp&&wasOn&&pp.vx)nx+=pp.vx;
 if(wasOn&&!pp){const g2=groundAt(nx+w/2);if(g2<e.y-7)nx=e.x}
 e.x=nx;e.y+=e.vy;e.on=false;e.plat=null;
 if(e.vy>=0){if(!(e.drop>0))for(const p of plats){if(e.x+w-4>p.x&&e.x+4<p.x+p.w&&py<=p.y+2&&e.y>=p.y){e.y=p.y;e.vy=0;e.on=true;e.plat=p}}
  if(!e.on){const g=groundAt(e.x+w/2);if(g<1e3&&(e.y>=g||(wasOn&&!pp&&e.y>=g-5))){e.y=g;e.vy=0;e.on=true}}}
 if(e.drop>0)e.drop--}

/* ---------------- combat ---------------- */
function muzzle(){return muzzleOf(P,P.wpn,P.aim,P.crouch)}
function casing(){parts.push({x:P.x+8,y:P.y-14,vx:-P.face*(.6+rnd()*.8),vy:-1.6-rnd(),life:45,c:'#e0b04a',s:1,g:.18,casing:1})}
function hostiles(){return enemies.filter(e=>!e.dead&&!e.ally&&!e.surr)}
function pShoot(){
 const near=!P.aim&&enemies.find(e=>!e.dead&&!e.ally&&!e.surr&&e.t!=='boat'&&e.t!=='mgnest'&&Math.abs((e.x+8)-(P.x+8+P.face*9))<15&&Math.abs(e.y-P.y)<22);
 if(near){P.slash=12;SFX.knife();hitEnemy(near,6,P.x);P.cool=16;sparks(near.x+8,near.y-14,8);return}
 const[mx,my,dx,dy]=muzzle();P.muzz=3;
 const w=P.wpn;
 if(w==='hmg'){const sp=(rnd()-.5)*.6;bullets.push({x:mx,y:my,vx:dx*7+(dy?sp:0),vy:dy*7+(dx?sp:0),f:1,dmg:1,big:1});SFX.hmg();P.cool=4;shake=Math.max(shake,1.5);casing()}
 else if(w==='shotgun'){for(let i=-3;i<=3;i++){const a=Math.atan2(dy,dx)+i*.11;bullets.push({x:mx,y:my,vx:Math.cos(a)*6.5,vy:Math.sin(a)*6.5,f:1,dmg:2,life:14,pellet:1})}
  for(let i=0;i<14;i++){const a=Math.atan2(dy,dx)+(rnd()-.5)*.8,s=2+rnd()*3;parts.push({x:mx,y:my,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:10+rnd()*8,c:pick(['#fff','#ffe27a','#ffb04a']),s:2,g:0,fire:1})}
  SFX.shotgun();P.cool=24;shake=Math.max(shake,4);smoke(mx,my,4)}
 else if(w==='rocket'){bullets.push({x:mx,y:my,vx:dx*2,vy:dy*2,dx,dy,f:1,dmg:6,rocket:1,life:140});SFX.rocket();P.cool=20;shake=Math.max(shake,2)}
 else if(w==='flame'){bullets.push({x:mx,y:my,vx:dx*4.6+P.vx*.5,vy:dy*4.6,f:1,dmg:2,flame:1,life:24,hit:new Set()});if(T%3===0)SFX.flame();P.cool=5}
 else{bullets.push({x:mx,y:my,vx:dx*6,vy:dy*6,f:1,dmg:1});SFX.shot();SFX.shell();P.cool=10;casing()}
 if(w!=='pistol'&&--P.ammo<=0){P.wpn='pistol';pop(P.x+8,P.y-46,M().noammo,'#ff9a6a')}}
function eShoot(e,friendly,spd){e.shootT=12;const cr=e.t==='rifle'||e.t==='sniper';const[mx,my]=e.t==='officer'?muzzleOf(e,'pistol',0,false):muzzleOf(e,'rifle',0,cr&&!e.onBoat);let tx,ty;
 if(friendly){const t=e.target;tx=t.x+8;ty=t.y-12}else{tx=P.x+8;ty=P.y-(P.veh?14:P.crouch?9:15)}
 const dx=tx-mx,dy=ty-my,d=Math.hypot(dx,dy)||1,v=spd||(friendly?4:2.2);bullets.push({x:mx,y:my,vx:dx/d*v,vy:dy/d*v,f:friendly?1:0,dmg:1});if(!friendly)SFX.eshot();else SFX.shot()}
function throwG(x,y,vx,vy,f,kind){grenades.push({x,y,vx,vy,f,kind})}
function puff(x,y,n,cols,sp=1.5,sz=2){for(let i=0;i<n;i++)parts.push({x,y,vx:(rnd()-.5)*sp*2,vy:(rnd()-.8)*sp*2,life:20+rnd()*25,c:pick(cols),s:sz+rnd()*2|0,g:.08})}
function smoke(x,y,n,big){for(let i=0;i<n;i++)parts.push({x:x+(rnd()-.5)*10,y:y+(rnd()-.5)*6,vx:(rnd()-.5)*.6,vy:-.2-rnd()*.5,life:50+rnd()*50,max:100,s:(big?6:3)+rnd()*4,g:-.004,smoke:1})}
function sparks(x,y,n,c=['#fff','#ffe27a','#ffb04a']){for(let i=0;i<n;i++){const a=rnd()*6.28,s=1+rnd()*2.5;parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-.5,life:8+rnd()*10,c:pick(c),s:1,g:.12,spark:1})}}
function blood(x,y,n,dir){for(let i=0;i<n;i++)parts.push({x,y,vx:dir*(.5+rnd()*1.8),vy:-1-rnd()*1.8,life:24+rnd()*20,c:pick(['#8a1c14','#b02a1e','#5a120c']),s:1+(rnd()*2|0),g:.15})}
function explode(x,y,r,f,big){
 SFX.boom(big);shake=Math.max(shake,big?12:8);flashA=Math.max(flashA,big?.7:.35);flashC='#fff4d0';if(big)hitstop=Math.max(hitstop,4);
 rings.push({x,y,r:4,max:r*(big?2.2:1.6),life:1});
 const g=groundAt(x);if(g<1e3&&y>g-14&&scorch.length<40)scorch.push({x:x-14,w:28+rnd()*10|0});
 if(g>1e3&&y>WATERY-10){SFX.splash();for(let i=0;i<20;i++)parts.push({x,y:WATERY,vx:(rnd()-.5)*3,vy:-2-rnd()*4,life:30,c:pick(['#9fc0e0','#ffffff','#6a8ab0']),s:2,g:.18})}
 for(let i=0;i<(big?44:30);i++){const a=rnd()*6.28,s=rnd()*(big?3.6:2.8);parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-1.2,life:18+rnd()*28,c:pick(['#ffffff','#fff3b0','#ffd24a','#ff8a1a','#ff5a1a','#c8372d']),s:3+rnd()*5|0,g:.02,fire:1})}
 for(let i=0;i<(big?14:8);i++)parts.push({x,y,vx:(rnd()-.5)*5,vy:-2-rnd()*3.5,life:40+rnd()*30,c:pick(['#3a2c20','#5a4632','#2a2420','#7a6a5a']),s:2+rnd()*2|0,g:.16,debris:1});
 smoke(x,y-6,big?14:8,big);sparks(x,y,12);
 if(f){for(const e of enemies)if(!e.dead&&!e.ally){const bx=hbOf(e);const cx=clamp(x,bx.x,bx.x+bx.w),cy=clamp(y,bx.y,bx.y+bx.h);if(Math.hypot(cx-x,cy-y)<r)hitEnemy(e,4,x)}
  if(boss&&!boss.dead)for(const p of boss.parts)if(p.hp>0){const bx=partBox(boss,p);const cx=clamp(x,bx.x,bx.x+bx.w),cy=clamp(y,bx.y,bx.y+bx.h);if(Math.hypot(cx-x,cy-y)<r)hitPart(p,7)}
  for(const c of crates)if(c.hp>0&&Math.abs(c.x+7-x)<r+6&&Math.abs(c.y-6-y)<r+6)hitCrate(c,3)}
 else{if(!P.dead&&Math.hypot(P.x+8-x,P.y-12-y)<r)killPlayer();
  for(const e of enemies)if(e.ally&&!e.dead&&Math.hypot(e.x+8-x,e.y-12-y)<r)killAlly(e)}}
function killEnemy(e,dir,big){e.dead=true;e.vy=big?-4.2:-2.6;e.vx=dir*(big?2.2:1.1);MS.kills++;totals.kills++;
 killTimes.push(T);killTimes=killTimes.filter(t=>T-t<150);if(killTimes.length>=3){cry();killTimes=[]}
 const pts={grenadier:200,runner:150,mgnest:800,mortar:400,sniper:400,cavalry:600,para:200,officer:1000,boat:600}[e.t]||100;addScore(pts);
 if(e.t==='mgnest'||e.t==='boat'){explode(e.x+17,e.y-8,22,true);e.dt=60;if(e.t==='boat'){e.plat.dead=1;plats=plats.filter(p=>p!==e.plat);for(const o of enemies)if(o.onBoat===e){o.fixed=false;o.onBoat=null}}return}
 blood(e.x+8,e.y-16,8,dir);parts.push({x:e.x+8,y:e.y-26,vx:dir*.8,vy:-2.8,life:80,c:PAL[EN].h,s:4,g:.12,hat:1});
 puff(e.x+8,e.y-12,6,['#7a6a5a','#4a3a33']);if(rnd()<.45)SFX.scream();
 if(e.t==='officer'){pickups.push({x:e.x+8,y:e.y-10,vy:-2,t:'gold'});pop(e.x+8,e.y-44,M().officer,'#ffd24a',140)}
 else if(e.t==='cavalry'){pop(e.x+16,e.y-50,'THE HORSE WAS ALSO CONSCRIPTED','#c9b9a0');SFX.horse()}
 else if(rnd()<.35)pop(e.x+8,e.y-44,pick(M().kills),'#ffd24a')}
function hitEnemy(e,d,fromX){if(e.dead)return;
 if(e.surr){e.dead=true;e.vy=-2.4;e.vx=sgn(e.x-(fromX??P.x));addScore(-500);pop(e.x+8,e.y-46,'-500. EVEN THIS WAR HAS PAPERWORK','#ff6a5a');return}
 e.hp-=d;e.flash=6;SFX.hit();sparks(e.x+8,e.y-14,4,['#fff','#ffb04a','#a8261c']);
 if(e.para&&e.hp>0){e.para=0;pop(e.x+8,e.y-40,'CHUTE CUT','#e9dcc2',60)}
 if(e.hp<=0)killEnemy(e,sgn(e.x-(fromX??P.x)),d>=3)}
function killAlly(e){e.dead=true;e.vy=-2.4;e.vx=-1;pop(e.x+8,e.y-44,'DEFECTED ONCE. RETIRED FOR GOOD.','#c9b9a0')}
function hitPart(p,d){const b=boss;if(!b||b.dead||p.hp<=0)return;
 if(p.armor){if(T%6===0){SFX.clang();sparks(b.x+p.ox+p.w/2,b.y-p.oy+p.h/2,3,['#aaa','#fff'])}if(T%40===0)pop(b.x+p.ox+p.w/2,b.y-p.oy-6,'ARMORED','#aaa',40);return}
 p.hp-=d;p.flash=4;b.flash=3;if(T%3===0)SFX.clang();
 if(b.kind==='tank'){const ph=Math.min(PLATES.length-1,Math.floor((1-p.hp/160)*4)+1);if(p.hp>0&&ph!==b.plate){b.plate=ph;pop(b.x+40,b.y-70,'OWNERSHIP TRANSFERRED','#ffd24a',140)}}
 if(b.kind==='press')b.printed*=1.5;
 if(p.hp<=0){p.hp=0;const bx=partBox(b,p);explode(bx.x+bx.w/2,bx.y+bx.h/2,24,true,true);addScore(1500);
  if(p.plat){p.plat.dead=1;plats=plats.filter(q=>q!==p.plat)}
  const alive=b.parts.filter(q=>q.hp>0);if(alive.length===1&&alive[0].armor){alive[0].armor=0;pop(camX+W/2,64,'ARMOR GONE! HIT THE CORE!','#ff9a6a',120)}}
 b.hp=b.parts.reduce((a,q)=>a+q.hp,0);
 if(b.parts.every(q=>q.hp<=0||!q.req)&&!b.dead){b.dead=true;b.dt=0;hitstop=12;flashA=1;music('off');addScore({truck:3000,tank:10000,train:12000,bomber:15000,car:5000,press:20000,gunboat:8000,mech:50000}[b.kind]||5000)}}
function hitCrate(c,d){c.hp-=d;c.flash=4;SFX.hit();if(c.hp<=0){puff(c.x+7,c.y-6,10,['#7a5a35','#9c7a4c','#5a4025'],2,2);pickups.push({x:c.x+7,y:c.y-8,vy:-2.5,t:c.item});SFX.clang()}}
function killPlayer(cause){if(P.dead)return;
 if(P.veh){const v=P.veh;if(P.inv>0)return;v.hp--;v.flash=8;P.inv=30;SFX.clang();sparks(v.x+v.w/2,v.y-16,8);if(v.kind==='donkey'&&v.hp>0&&rnd()<.4){SFX.bray();pop(v.x+18,v.y-48,'HEE-HAW (UNION GRIEVANCE)','#e9dcc2',70)}
  if(v.hp<=0)ejectVehicle(true);return}
 if(P.inv>0&&cause!=='drown')return;
 P.dead=1;P.vy=-3.6;P.vx=-P.face*1.2;SFX.die();shake=8;MS.lost++;totals.lost++;flashA=.6;flashC='#c8372d';hitstop=8;
 if(cause==='drown'){P.vy=0;SFX.splash();pop(P.x+8,WATERY-30,"DROWNED. THE RIVER DOESN'T TAKE SIDES",'#9fc0e0',150)}
 else{blood(P.x+8,P.y-16,14,-P.face);parts.push({x:P.x+8,y:P.y-26,vx:-P.face,vy:-3.4,life:120,c:PAL[S].h,s:4,g:.12,hat:1})}}
function ejectVehicle(destroyed){const v=P.veh;if(!v)return;v.rider=false;P.veh=null;P.vehCD=60;P.x=v.x+v.w/2-8;P.y=v.y-24;P.vy=-4.5;P.on=false;P.inv=destroyed?100:20;
 if(destroyed){v.dead=1;explode(v.x+v.w/2,v.y-14,26,true,true);pop(v.x+v.w/2,v.y-50,v.kind==='donkey'?'THE DONKEY HAS FILED FOR RETIREMENT':'SV-46 RETURNED TO ITS SEVENTH OWNER','#e9dcc2',140);if(v.kind==='donkey')SFX.bray()}}
function freePow(w){if(w.st!=='tied')return;w.st='free';w.t=0;w.say=POW_LINES[(totals.freed+LV*3)%POW_LINES.length];MS.freed++;totals.freed++;addScore(500);SFX.pick();
 const t=['B','food',pick(['H','S','R','F']),'food','B'][(MS.freed-1)%5];pickups.push({x:w.x+16,y:w.y-10,vy:-2,t})}

/* ---------------- update ---------------- */
function ambient(){
 if(flashA>0)flashA=Math.max(0,flashA-.08);if(skyFlash>0)skyFlash-=.04;
 if(--artT<=0){artT=180+rnd()*260|0;skyFlash=.9;skyFX=rnd()*W;if(state==='play')SFX.far()}
 for(const e of EMBERS){e.x-=e.v*(e.ash?.6:1)+.15;e.y+=Math.sin((T+e.ph*60)/50)*.25+(e.ash?.25:-.35);if(e.x<-4||e.y<-4||e.y>H){e.x=W+rnd()*20;e.y=rnd()*H}}
 for(const g of rings){g.r+=(g.max-g.r)*.25;g.life-=.07}rings=rings.filter(g=>g.life>0)}
function update(){
 ambient();
 if(hitstop>0){hitstop--;return}
 T++;if(shake>0)shake-=.5;
 if(cryCD>0)cryCD--;for(const b of shouts)b.t--;shouts=shouts.filter(b=>b.t>0&&!b.ent.dead&&!b.ent.gone);
 if(T===60||(P.cryAt&&P.cryAt===T))cry(true);
 if(T%30===0&&rnd()<.14&&shouts.length<2){const c=hostiles().filter(e=>e.t!=='boat'&&e.t!=='mgnest'&&e.x>camX+20&&e.x<camX+W-30);if(c.length)taunt(pick(c))}
 if(held('fire')&&rnd()<.0025)cry();
 // events & spawns
 while(ev<L.events.length&&camX>=L.events[ev][0]){const[x,k,a]=L.events[ev++];radio(LT()[k]);
  if(k==='drop')pickups.push({x:camX+W*.72,y:-14,vy:0,t:a||'H',para:1});
  if(a==='paras'||k==='paras')for(let i=0;i<3;i++)setTimeout(()=>{if(state==='play')spawn('para')},i*700)}
 while(si<L.spawns.length&&camX+W+30>=L.spawns[si][0]){const[x,t,a]=L.spawns[si++];if(x<camX-10&&a!=='L')continue;spawn(t,x,typeof a==='number'?a:0,a)}
 const A=L.arenas[arenaI];
 if(A&&!boss&&camX>=A.x){camX=lockX=A.x;spawnBoss(A.boss);radio(LT()[A.msg]);SFX.alarm();if(A.boss==='bomber'||A.boss==='mech')pop(camX+W/2,150,A.boss==='mech'?'TIP: GET UNDER IT. HOLD ↑ TO AIM UP':'TIP: HOLD ↑ TO AIM UP','#9fe0a0',240);music(A.boss==='mech'?'final':'boss');cry(true)}
 if(radioCur){if(--radioCur.t<=0)radioCur=null}else if(radioQ.length){const s=radioQ.shift();radioCur={s,t:120+s.length*3.2|0};radioCur.max=radioCur.t;SFX.radio()}
 // autoscroll + raft
 const pcam=camX;
 if(L.auto&&lockX==null&&camX<L.auto.to){camX=Math.min(L.auto.to,camX+L.auto.speed)}
 if(raft){const nx=L.auto&&camX<=L.auto.to?camX+raft.off:raft.x;raft.vx=nx-raft.x;raft.x=nx}
 updPlayer();
 for(const k in pressed)delete pressed[k];
 // camera follow
 if(lockX==null&&!P.dead&&!(L.auto&&camX<L.auto.to)){const t=P.x-150,cap=A?A.x:camX;if(t>camX)camX=Math.min(t,Math.max(cap,camX))}
 updVehicles();updEnemies();if(boss)updBoss();updBullets();updGrenades();updMisc();
 if(winT>0&&++winT>240)missionComplete()}

function updPlayer(){
 if(P.vehCD>0)P.vehCD--;if(P.slash>0)P.slash--;
 if(P.dead){P.dead++;P.vy+=.2;P.y+=P.vy;P.x+=P.vx;const g=groundAt(P.x+8);if(g<1e3&&P.y>g){P.y=g;P.vy=0;P.vx*=.7}if(g>1e3&&P.y>WATERY+10){P.vy=.3;P.vx=0}
  if(P.dead>90){if(--lives<0){gameOver();return}let x=clamp(P.x,camX+20,camX+W-40);if(groundAt(x+8)>1e3)x=raft?raft.x+raft.w/2-8:camX+60;newPlayer(x,-10);P.cryAt=T+70;pop(x+8,60,pick(M().respawn),'#ffd24a',150)}return}
 const L_=held('left'),R_=held('right');const mv=(R_?1:0)-(L_?1:0);
 if(P.veh){const v=P.veh;if(mv)v.face=mv;v.vx=mv*(v.kind==='tank'?1:1.25);v.aimUp=!!held('up');v.moving=!!mv;if(mv)v.anim++;
  if(pressed.jump){if(held('down')){ejectVehicle(false);return}if(v.on){v.vy=-3.9;SFX.jump()}}
  if(v.cool>0)v.cool--;
  if(held('fire')&&v.cool<=0){const up=v.aimUp,mx=v.x+v.w/2+(up?2*v.face:v.face*22),my=v.y-(up?44:22);bullets.push({x:mx,y:my,vx:up?(rnd()-.5)*.6:v.face*7.5,vy:up?-7.5:(rnd()-.5)*.5,f:1,dmg:1,big:1});SFX.hmg();v.cool=4;P.muzz=3;casing()}
  if(pressed.bomb){if(v.ammo>0){v.ammo--;const up=v.aimUp;throwG(v.x+v.w/2+v.face*16,v.y-26,up?v.face*1:v.face*3.4+v.vx,up?-5:-2.2,1,'cannon');SFX.boom();shake=4;smoke(v.x+v.w/2+v.face*20,v.y-26,4);if(v.kind==='donkey'&&rnd()<.3)SFX.bray()}else pop(v.x+v.w/2,v.y-46,'OUT OF SHELLS','#ff9a6a',50)}
  phys(v,v.w);v.x=clamp(v.x,camX+2,camX+W-v.w-2);if(boss&&!boss.dead&&boss.kind!=='bomber'){const bx=boss.x+(boss.parts[0].ox||0);if(v.x+v.w>bx+6&&boss.kind!=='train'&&boss.kind!=='mech')v.x=bx+6-v.w}
  P.x=v.x+v.w/2-8;P.y=v.y-18;P.face=v.face;P.vx=v.vx;P.on=v.on;if(P.inv>0)P.inv--;if(P.muzz>0)P.muzz--;return}
 P.crouch=!!held('down')&&P.on;if(mv)P.face=mv;const wade=inShallow(P.x+8)&&P.on;P.vx=mv*(P.crouch?.55:wade?.75:1.25);
 P.aim=held('up')?-1:(held('down')&&!P.on?1:0);
 if(pressed.jump&&P.on){if(held('down')&&P.plat&&!P.plat.raft){P.drop=12;P.y+=1}else{P.vy=-4.3;SFX.jump();if(wade)SFX.splash()}}
 if(P.cool>0)P.cool--;if(held('fire')&&P.cool<=0)pShoot();
 if(pressed.bomb&&P.bombs>0){P.bombs--;throwG(P.x+8,P.y-22,P.face*2.3+P.vx*.4,-3.1,1);SFX.throw();if(rnd()<.4)cry()}
 const wasOn=P.on,fallV=P.vy;phys(P);if(mv&&P.on)P.anim++;
 if(P.on&&!wasOn&&fallV>2){SFX.land();puff(P.x+8,P.y,6,['#8a7656','#6e5a40'],1,1)}
 if(P.on&&mv&&P.anim%12===0)parts.push({x:P.x+8-mv*4,y:P.y-1,vx:-mv*.3,vy:-.3,life:18,max:18,s:2,g:-.005,smoke:1});
 if(P.inv>0)P.inv--;if(P.muzz>0)P.muzz--;
 P.x=clamp(P.x,camX+2,camX+W-18);if(raft&&L.auto&&camX<L.auto.to)P.x=clamp(P.x,raft.x,raft.x+raft.w-16);
 if(boss&&!boss.dead){const k=boss.kind;let bx=null;if(k==='truck'||k==='tank'||k==='car')bx=boss.x;else if(k==='press')bx=boss.x-4;else if(k==='train'&&P.y>GY-38)bx=boss.x;if(bx!=null&&P.x+13>bx+6)P.x=bx-7}
 if(groundAt(P.x+8)>1e3&&P.y>WATERY+4&&!P.on)killPlayer('drown');
 if(P.vehCD<=0)for(const v of vehicles)if(!v.rider&&!v.dead&&ov(hb(P),vBox(v))&&(held('down')||(P.vy>0&&!P.on))){P.veh=v;v.rider=true;v.face=P.face;SFX.weapon();if(v.kind==='donkey')SFX.bray();pop(v.x+v.w/2,v.y-50,v.kind==='donkey'?'DONKEY SLUG! (UNDER PROTEST)':'SV-46! (7TH OWNER)','#ffd24a',100);break}}

function updVehicles(){for(const v of vehicles){if(v.dead)continue;if(v.flash>0)v.flash--;if(!v.rider){v.vx=0;phys(v,v.w)}}
 vehicles=vehicles.filter(v=>!v.dead&&v.x>camX-80)}

function updEnemies(){
 for(const e of enemies){
  if(e.dead){e.dt++;if(e.t==='mgnest'||e.t==='boat'){continue}e.vy+=.2;e.x+=e.vx;e.y+=e.vy;const g=groundAt(e.x+8);if(g<1e3&&e.y>g){e.y=g;e.vx*=.6;e.vy=0}if(g>1e3&&e.y>WATERY+20){e.gone=true}continue}
  if(e.flash>0)e.flash--;if(e.shootT>0)e.shootT--;if(e.shout>0)e.shout--;
  const on=e.x>camX-4&&e.x<camX+W-6;
  if(e.t==='boat'){e.x-=.55;e.plat.x=e.x;e.plat.vx=-.55;if(e.x<camX-60)e.gone=true;continue}
  if(e.t==='mgnest'){e.face=-1;if(on&&!P.dead){if(--e.cool<=0){e.burst=5;e.cool=150}if(e.burst>0&&T%7===0){e.burst--;e.shootT=6;const mx=e.x-10,my=e.y-15,dx=P.x+8-mx,dy=P.y-14-my,d=Math.hypot(dx,dy);bullets.push({x:mx,y:my,vx:dx/d*2.6,vy:dy/d*2.6,f:0,dmg:1});SFX.eshot()}}continue}
  if(e.t==='mortar'){e.face=P.x<e.x?-1:1;if(on&&!P.dead&&--e.cool<=0){const tx=P.x+8+P.vx*45,ft=61,sx=e.x+8;throwG(sx,e.y-14,(tx-sx)/ft,-5.5,0,'mortar');markers.push({x:tx,t:62});e.shootT=14;e.cool=170+rnd()*60;SFX.whistle()}if(e.shootT>0)e.shootT--;continue}
  let tx=P.x;e.target=null;
  if(e.ally){let best=230;for(const o of enemies)if(!o.dead&&!o.ally&&!o.surr&&o.t!=='boat'){const d=Math.abs(o.x-e.x);if(d<best){best=d;e.target=o}}tx=e.target?e.target.x:P.x-26*P.face}
  const dx=tx-e.x,ad=Math.abs(dx),s=sgn(dx);e.face=s;let mv=0;
  if(e.para){e.vx=Math.sin(T/30+e.x)*.3;e.vy=.55;e.x+=e.vx;e.y+=e.vy;const g=groundAt(e.x+8);let land=false;for(const p of plats)if(e.x+12>p.x&&e.x+4<p.x+p.w&&Math.abs(e.y-p.y)<2){land=true;e.y=p.y}
   if(g<1e3&&e.y>=g){e.y=g;land=true}if(g>1e3&&e.y>WATERY+4&&!land){e.dead=true;e.gone=true;SFX.splash();continue}if(land){e.para=0;e.t='rifle';e.on=true}continue}
  if(e.surr){mv=ad>20?s*.45:0;if(!P.dead&&ad<26){e.surr=false;e.ally=true;e.t='rifle';e.hp=2;e.fixed=false;MS.defects++;totals.defects++;addScore(300);pop(e.x+8,e.y-46,pick(DEFECT),'#ffffff',130)}}
  else if(e.ally){if(e.target){if(ad>120)mv=s*.7;else if(ad<50)mv=-s*.5;if(--e.cool<=0){eShoot(e,true);e.cool=35+rnd()*30}}else if(ad>14)mv=s*1.15}
  else if(e.t==='rifle'){if(!e.fixed){if(ad>130)mv=s*.6;else if(ad<70)mv=-s*.4}if(--e.cool<=0&&on&&!P.dead){eShoot(e,false);e.cool=80+rnd()*70}}
  else if(e.t==='officer'){if(ad>170)mv=s*.5;else if(ad<120)mv=-s*.4;if(--e.cool<=0&&on&&!P.dead){eShoot(e,false,1.8);e.cool=110+rnd()*40}}
  else if(e.t==='grenadier'){if(!e.fixed){if(ad>150)mv=s*.6;else if(ad<100)mv=-s*.5}if(--e.cool<=0&&on&&!P.dead){throwG(e.x+8,e.y-24,clamp(dx/60,-2.6,2.6),-3.3,0);e.shootT=14;e.cool=130+rnd()*70}}
  else if(e.t==='runner'){mv=s*1.45;if(!P.dead&&ov(P.veh?vBox(P.veh):hb(P),hb(e))){if(P.veh){killPlayer();hitEnemy(e,9,P.x)}else killPlayer()}}
  else if(e.t==='cavalry'){if(e.dir==null)e.dir=s;mv=e.dir*2.3;e.face=e.dir;if((e.dir>0&&e.x>camX+W+20)||(e.dir<0&&e.x<camX-40))e.dir*=-1;if(T%20===0&&on)SFX.horse();
   if(!P.dead&&ov(P.veh?vBox(P.veh):hb(P),hbOf(e)))killPlayer()}
  else if(e.t==='sniper'){if(on&&!P.dead){if(e.aimT>0){e.aimT--;if(e.aimT===0){eShoot(e,false,5);e.cool=150}}else if(--e.cool<=0)e.aimT=70}}
  e.vx=e.fixed?0:mv;if(mv)e.anim++;phys(e,e.t==='cavalry'?32:16);
  if(groundAt(e.x+8)>1e3&&e.y>WATERY+4&&!e.on){e.dead=true;e.gone=true;SFX.splash();for(let i=0;i<8;i++)parts.push({x:e.x+8,y:WATERY,vx:(rnd()-.5)*2,vy:-1-rnd()*2,life:25,c:'#9fc0e0',s:2,g:.15});addScore(100);MS.kills++;totals.kills++}
  if(e.ally)e.x=clamp(e.x,camX-6,camX+W-10);
  if(e.t!=='cavalry'&&(e.x<camX-80||e.x>camX+W+160))e.gone=true;if(e.t==='cavalry'&&(e.x<camX-200||e.x>camX+W+300))e.gone=true}
 enemies=enemies.filter(e=>!e.gone&&!(e.dead&&e.dt>70))}

function updBoss(){const b=boss;b.t++;
 if(b.flash>0)b.flash--;for(const p of b.parts)if(p.flash>0)p.flash--;
 if(b.dead){b.dt++;const bx=b.x+(b.parts[0].ox||0);if(b.kind==='bomber'){b.x+=b.face*1.5;b.y+=1.2}
  smoke(bx+rnd()*120,b.y-30,1,true);if(b.dt%7===0&&b.dt<90)explode(bx+rnd()*100,b.y-rnd()*40,1,true,b.dt%21===0);
  if(b.dt===92){explode(bx+50,b.kind==='bomber'?GY-10:b.y-20,40,true,true);flashA=1;hitstop=10}
  if(b.kind==='mech'&&b.dt===100){pop(camX+W/2,60,'IT WAS A MIRROR. IT WAS ALWAYS A MIRROR.','#ffd24a',260)}
  if(b.dt===(b.kind==='mech'?200:95)){for(const p of b.parts)if(p.plat)plats=plats.filter(q=>q!==p.plat);
   const A=L.arenas[arenaI];arenaI++;boss=null;lockX=null;
   if(A&&A.final){radio(LT().win);winT=1;SFX.fanfare()}else{music(L.track);pop(camX+W/2,70,{truck:'TRUCK SILENCED. SLOGANS CONTINUE ELSEWHERE',car:'PEACE TALKS HAVE BROKEN DOWN. ALSO THE CAR.',gunboat:'GUNBOAT SUNK. CAPTAIN DEFECTS, AS PROMISED.'}[b.kind]||'CLEARED','#ffd24a',180)}}
  return}
 const near=(t)=>{if(Math.abs(b.x-b.tx)>1)b.x+=sgn(b.tx-b.x)*(t||.6);else b.tx=camX+(b.kind==='truck'?230+rnd()*80:b.kind==='car'?200+rnd()*110:255+rnd()*45)};
 const alive=k=>b.parts.find(p=>p.kind===k&&p.hp>0);
 if(b.kind==='truck'){near();
  if(--b.cool<=0&&b.x<camX+W-40){const t=pick(SLOGANS[EN]),w=t.length*8;bullets.push({txt:t,x:b.x-w+20,y:GY-28,vx:-1.4,vy:0,f:0,w,hp:3});SFX.word();b.cool=95+rnd()*30}
  if(--b.spawn<=0){spawn('rifle',b.x+62,0);b.spawn=230}}
 else if(b.kind==='tank'){near();
  if(--b.cool<=0&&b.x<camX+W-50){const dx=(P.x+8)-(b.x-6);throwG(b.x-6,b.y-29,clamp(dx/58,-4,-.6),-3.4,0,'shell');puff(b.x-8,b.y-29,8,['#fff3b0','#ffd24a','#777'],1.2,2);SFX.boom();b.cool=120+rnd()*50}
  if(--b.mg<=0){b.burst=6;b.mg=210}if(b.burst>0&&T%7===0){bullets.push({x:b.x+2,y:GY-7,vx:-2.6,vy:0,f:0,dmg:1});SFX.eshot();b.burst--}
  if(b.hp<b.max*.4&&--b.spawn<=0){spawn('runner',camX+W+10,0);b.spawn=260}}
 else if(b.kind==='train'){if(Math.abs(b.x-b.tx)>1){b.x+=sgn(b.tx-b.x)*1.2;if(T%10===0)SFX.engine()}
  for(const p of b.parts)if(p.plat){p.plat.x=b.x+p.ox;p.plat.vx=0}
  if(alive('cannon')&&--b.cool<=0){const sx=b.x+0,dx=(P.x+8)-sx;throwG(sx-10,b.y-54,clamp(dx/60,-4,-.4),-3.6,0,'shell');SFX.boom();puff(sx-12,b.y-54,6,['#fff3b0','#777']);b.cool=130+rnd()*40}
  if(alive('mg')&&--b.mg<=0){b.burst=6;b.mg=170}if(alive('mg')&&b.burst>0&&T%8===0){const mx=b.x+70,my=b.y-30,dx=P.x+8-mx,dy=P.y-14-my,d=Math.hypot(dx,dy);bullets.push({x:mx,y:my,vx:dx/d*2.6,vy:dy/d*2.6,f:0,dmg:1});SFX.eshot();b.burst--}
  if(alive('troops')&&--b.spawn<=0){const e=spawn(pick(['rifle','runner']),b.x+160,0);if(e){e.y=GY-40;e.on=false;e.vy=-2}b.spawn=200}
  const eng=alive('engine');if(eng&&!eng.armor&&T%90===0){throwG(b.x+230,b.y-50,-1.5-rnd()*1.5,-3.5,0,'coal')}}
 else if(b.kind==='bomber'){b.x+=b.vx;b.y=56+Math.sin(b.t/40)*18;if(b.x<camX-90){b.vx=1.4;b.face=1}if(b.x>camX+W+90){b.vx=-1.4;b.face=-1}if(T%8===0)SFX.prop();
  if(Math.abs(b.x-(P.x+8))<60&&b.salvo<=0&&b.cool<=0){b.salvo=4;b.cool=160}b.cool--;
  if(b.salvo>0&&T%10===0){b.salvo--;b.bay=10;throwG(b.x,b.y+8,b.vx*.4,.5,0,'bomb');SFX.whistle()}if(b.bay>0)b.bay--;
  if(T%100===0&&b.x>camX&&b.x<camX+W){for(let i=0;i<3;i++){const mx=b.x+b.face*44,my=b.y,dx=P.x+8-mx,dy=P.y-14-my,d=Math.hypot(dx,dy);bullets.push({x:mx,y:my,vx:dx/d*2.4+(i-1)*.3,vy:dy/d*2.4,f:0,dmg:1})}SFX.eshot()}
  if(b.hp<b.max*.5&&--b.spawn<=0){spawn('para');b.spawn=280}}
 else if(b.kind==='car'){near(1);const ta=Math.atan2(P.y-14-(b.y-31),P.x+8-(b.x+26));b.ang+=clamp(((ta-b.ang+Math.PI*3)%(Math.PI*2))-Math.PI,-.05,.05);
  if(--b.mg<=0){b.burst=5;b.mg=110}if(b.burst>0&&T%6===0){b.burst--;bullets.push({x:b.x+26+Math.cos(b.ang)*14,y:b.y-31+Math.sin(b.ang)*14,vx:Math.cos(b.ang)*2.8,vy:Math.sin(b.ang)*2.8,f:0,dmg:1});SFX.eshot()}
  if(--b.spawn<=0){spawn('officer',camX+W+10,0);b.spawn=320}}
 else if(b.kind==='press'){b.printed*=1.004;
  if(alive('roller')&&T%46===0){for(let i=0;i<3;i++)bullets.push({note:1,x:b.x-10,y:b.y-84+i*6,vx:-1-rnd()*.8,vy:-.6+rnd()*.6,f:0,hp:1,w:8,ph:rnd()*6})}
  if(alive('gold')&&--b.cool<=0){const dx=(P.x+8)-(b.x-10);throwG(b.x-10,b.y-56,clamp(dx/55,-4,-.4),-3.6,0,'gold');SFX.boom();b.cool=110+rnd()*40}
  const core=alive('core');if(core&&!core.armor&&T%70===0){for(let i=0;i<8;i++){const a=Math.PI*(.6+i*.1);bullets.push({note:1,x:b.x+60,y:b.y-60,vx:Math.cos(a)*1.6,vy:Math.sin(a)*1.6-.5,f:0,hp:1,w:8,ph:rnd()*6})}}
  if(--b.spawn<=0){spawn(pick(['officer','runner']),camX+W+10,0);b.spawn=260}}
 else if(b.kind==='gunboat'){near(.6);
  if(--b.cool<=0){const dx=(P.x+8)-(b.x-6);throwG(b.x-6,WATERY-26,clamp(dx/58,-4,-.4),-3.8,0,'shell');SFX.boom();puff(b.x-8,WATERY-26,6,['#fff3b0','#777']);b.cool=120+rnd()*40}
  if(--b.mg<=0){b.burst=6;b.mg=150}if(b.burst>0&&T%7===0){b.burst--;const mx=b.x+80,my=WATERY-20,dx=P.x+8-mx,dy=P.y-14-my,d=Math.hypot(dx,dy);bullets.push({x:mx,y:my,vx:dx/d*2.6,vy:dy/d*2.6,f:0,dmg:1});SFX.eshot()}
  if(--b.spawn<=0){spawn('para');b.spawn=300}}
 else if(b.kind==='mech'){if(Math.abs(b.x-b.tx)>1){b.x+=sgn(b.tx-b.x)*.5;b.walk+=.08;if(T%40===0){SFX.stomp();shake=5}}
  const f=b.parts[0];b.phase=f.hp<146?(f.hp<73?2:1):0;const sp=1+b.phase*.35;
  if(--b.stomp<=0){b.stomp=200/sp;SFX.stomp();shake=10;bullets.push({wave:1,x:b.x,y:GY-4,vx:-2.6,vy:0,f:0,w:14});bullets.push({wave:1,x:b.x+76,y:GY-4,vx:2.6,vy:0,f:0,w:14})}
  if(b.laser>0){b.laser--;b.eyeT=b.laser;if(b.laser<=40&&b.laser>0&&!P.dead){const hb_=P.veh?vBox(P.veh):hb(P);if(hb_.y<b.laserY+4&&hb_.y+hb_.h>b.laserY-4&&hb_.x<b.x)killPlayer()}if(b.laser===40)SFX.laser()}
  else if(T%Math.floor(260/sp)===0){b.laser=90;b.laserY=rnd()<.5?GY-6:GY-24}
  if(T%Math.floor(120/sp)===0){const t=pick(SLOGANS[EN]),w=t.length*8;bullets.push({txt:t,x:b.x-w,y:GY-28,vx:-1.6,vy:0,f:0,w,hp:3});SFX.word()}
  if(b.phase>0&&T%Math.floor(150/sp)===0){bullets.push({homing:1,x:b.x+10,y:b.y-150,vx:-1,vy:-1,f:0,hp:2,w:8,life:300});SFX.rocket()}}}

function bossHitTest(x,y){if(!boss||boss.dead)return null;for(const p of boss.parts)if(p.hp>0&&inR(x,y,partBox(boss,p)))return p;return null}
function updBullets(){
 for(const b of bullets){if(b.dead)continue;
  if(b.life!=null&&--b.life<=0){b.dead=1;if(b.rocket)explode(b.x,b.y,22,true);continue}
  if(b.rocket){const sp=Math.hypot(b.vx,b.vy);if(sp<7){b.vx+=b.dx*.25;b.vy+=b.dy*.25}let tg=null,bd=150;for(const e of hostiles()){const ex=hbOf(e);const d=Math.hypot(ex.x+ex.w/2-b.x,ex.y+ex.h/2-b.y);if(d<bd&&(ex.x-b.x)*sgn(b.vx||1)>-10){bd=d;tg=ex}}
   if(tg){b.vy+=clamp((tg.y+tg.h/2-b.y)*.01,-.25,.25)}if(T%2===0)parts.push({x:b.x,y:b.y,vx:-b.vx*.1,vy:-.2,life:25,max:25,s:3,g:-.004,smoke:1})}
  if(b.flame){b.vx*=.96;b.vy-=.03;if(T%2===0)parts.push({x:b.x,y:b.y,vx:b.vx*.3,vy:-.4,life:12,c:pick(['#ffd24a','#ff8a1a','#ff5a1a']),s:3,g:-.02,fire:1})}
  if(b.note){b.ph+=.15;b.vy=Math.sin(b.ph)*.6+.25}
  if(b.homing){const dx=P.x+8-b.x,dy=P.y-14-b.y,d=Math.hypot(dx,dy)||1;b.vx+=dx/d*.06;b.vy+=dy/d*.06;const s=Math.hypot(b.vx,b.vy);if(s>1.8){b.vx*=1.8/s;b.vy*=1.8/s}if(T%3===0)parts.push({x:b.x,y:b.y,vx:0,vy:0,life:20,max:20,s:2,g:0,smoke:1})}
  for(let st=0;st<2&&!b.dead;st++){b.x+=b.vx/2;b.y+=b.vy/2;
   if(b.f){
    for(const e of enemies){if(e.dead||e.ally||e.surr)continue;if(inR(b.x,b.y,hbOf(e))){if(b.flame){if(b.hit.has(e))continue;b.hit.add(e);hitEnemy(e,b.dmg,b.x-b.vx);continue}b.dead=1;if(b.rocket)explode(b.x,b.y,22,true);else hitEnemy(e,b.dmg,b.x-b.vx);puff(b.x,b.y,3,['#ffd24a','#fff'],1,1);break}}
    if(!b.dead){const p=bossHitTest(b.x,b.y);if(p){if(b.flame){if(!b.hit.has(p)){b.hit.add(p);hitPart(p,b.dmg)}}else{b.dead=1;if(b.rocket)explode(b.x,b.y,22,true);else hitPart(p,b.dmg);puff(b.x,b.y,3,['#ffd24a','#fff'],1,1)}}}
    if(!b.dead)for(const w of pows)if(w.st==='tied'&&inR(b.x,b.y,{x:w.x,y:w.y-30,w:16,h:30})){b.dead=1;freePow(w)}
    if(!b.dead)for(const c of crates)if(c.hp>0&&inR(b.x,b.y,{x:c.x,y:c.y-12,w:14,h:12})){b.dead=!b.flame;hitCrate(c,b.flame?.2:1)}
    if(!b.dead)for(const s of bullets)if((s.txt||s.note||s.homing)&&!s.dead&&inR(b.x,b.y,{x:s.x-(s.note?4:0),y:s.y-5,w:s.w,h:10})){b.dead=!b.flame;if(--s.hp<=0){s.dead=1;puff(s.x+s.w/2,s.y,10,['#e9dcc2','#c8372d','#8aa070'],1.6,2);if(s.txt)pop(s.x+s.w/2,s.y-8,'SLOGAN REFUTED','#9fe0a0',70);if(s.homing)explode(s.x,s.y,12,true)}}
    if(!b.dead&&!b.flame){const g=groundAt(b.x);if(b.y>g+1){b.dead=1;puff(b.x,g,3,['#8a7656','#6e5a40'],1,1);if(b.rocket)explode(b.x,g-4,22,true)}}}
   else if(b.txt||b.wave){const box=b.wave?{x:b.x,y:b.y-6,w:b.w,h:8}:{x:b.x,y:b.y-4,w:b.w,h:8};if(!P.dead&&ov(P.veh?vBox(P.veh):hb(P),box)){b.dead=1;killPlayer();if(b.txt&&!P.veh)pop(P.x+8,P.y-46,'KILLED BY A SLOGAN','#ff6a5a')}
    if(b.wave&&T%3===0)puff(b.x+7,GY,2,['#8a7656','#6e5a40'],1,2)}
   else{if(!b.note&&!b.homing&&b.y>groundAt(b.x)+2){b.dead=1;break}
    const pb=P.veh?vBox(P.veh):hb(P);if(!P.dead&&P.inv<=0&&inR(b.x,b.y,pb)){b.dead=1;if(b.homing)explode(b.x,b.y,16,false);else killPlayer();if(b.note&&!P.dead&&!P.veh)pop(P.x+8,P.y-46,'CRUSHED BY INFLATION','#8aa070')}
    else for(const e of enemies)if(e.ally&&!e.dead&&inR(b.x,b.y,hb(e))){b.dead=1;if(--e.hp<=0)killAlly(e);break}}}
  if(b.x<camX-200||b.x>camX+W+60||b.y<-60||b.y>H+10)b.dead=1}
 bullets=bullets.filter(b=>!b.dead)}
function updGrenades(){
 for(const g of grenades){g.vy+=g.kind==='bomb'?.12:.18;g.x+=g.vx;g.y+=g.vy;
  const gy=groundAt(g.x);let boom=gy<1e3?g.y>=gy-2:g.y>=WATERY;
  for(const p of plats)if(!p.raft&&g.vy>0&&g.x>p.x&&g.x<p.x+p.w&&Math.abs(g.y-p.y)<3)boom=true;
  if(raft&&g.vy>0&&g.x>raft.x&&g.x<raft.x+raft.w&&Math.abs(g.y-raft.y)<4)boom=true;
  if(g.f&&!boom){for(const e of enemies)if(!e.dead&&!e.ally&&inR(g.x,g.y,hbOf(e)))boom=true;if(bossHitTest(g.x,g.y))boom=true}
  if(!g.f&&!boom&&!P.dead&&P.inv<=0&&inR(g.x,g.y,P.veh?vBox(P.veh):hb(P)))boom=true;
  if(T%3===0)parts.push({x:g.x,y:g.y,vx:0,vy:-.1,life:20,max:20,s:2,g:0,smoke:1});
  if(boom){g.dead=1;const big=g.kind==='cannon'||g.kind==='bomb'||g.kind==='shell';explode(g.x,Math.min(g.y,(gy<1e3?gy:WATERY)-4),g.kind==='cannon'?30:big?28:24,g.f,big)}}
 grenades=grenades.filter(g=>!g.dead)}
function updMisc(){
 for(const m of markers)m.t--;markers=markers.filter(m=>m.t>0);
 for(const w of pows){if(w.st==='tied'){if(!P.dead&&ov(hb(P),{x:w.x,y:w.y-30,w:16,h:30}))freePow(w)}else if(w.st==='free'){w.t++;if(w.t>150)w.x-=1.4;if(w.x<camX-40)w.st='gone'}}
 for(const c of crates)if(c.flash>0)c.flash--;crates=crates.filter(c=>c.hp>0&&c.x>camX-40);
 for(const p of pickups){p.vy=Math.min(p.vy+.15,p.para?.55:4);p.y+=p.vy;const g=groundAt(p.x);
  if(raft&&p.x>raft.x&&p.x<raft.x+raft.w&&p.y>=raft.y&&p.y<raft.y+6){p.y=raft.y;p.vy=0;p.para=0;p.x+=raft.vx}else if(g<1e3&&p.y>=g){p.y=g;p.vy=0;p.para=0}else if(g>1e3&&p.y>WATERY+6)p.dead=1;
  if(!P.dead&&ov(P.veh?vBox(P.veh):hb(P),{x:p.x-6,y:p.y-10,w:12,h:10})){p.dead=1;
   if(WPN_OF[p.t]){if(P.veh){P.veh.ammo+=10;pop(p.x,p.y-20,'SHELLS +10','#ffd24a')}else{const nw=WPN_OF[p.t];P.ammo=P.wpn===nw?P.ammo+WEAPONS[p.t].ammo:WEAPONS[p.t].ammo;P.wpn=nw;pop(p.x,p.y-20,WEAPONS[p.t].name+'!','#ffd24a')}SFX.weapon()}
   else if(p.t==='B'){P.bombs+=8;if(P.veh)P.veh.ammo+=8;pop(p.x,p.y-20,'GRENADES +8','#ffd24a');SFX.pick()}
   else if(p.t==='gold'){addScore(3000);pop(p.x,p.y-20,'+3000 GOLD (CONFISCATED)','#ffd24a');SFX.pick()}
   else{addScore(800);pop(p.x,p.y-20,M().food,'#ffd24a');SFX.pick()}}}
 pickups=pickups.filter(p=>!p.dead&&p.x>camX-40);
 for(const p of parts){p.x+=p.vx;p.y+=p.vy;p.vy+=p.g;p.life--;if(p.smoke){p.s+=.06;p.vx*=.98}
  const g=groundAt(p.x);if(!p.smoke&&!p.fire&&g<1e3&&p.y>g+2){p.y=g+2;p.vy*=-.35;p.vx*=.6;if(p.casing&&Math.abs(p.vy)<.3)p.vx=0}}
 parts=parts.filter(p=>p.life>0);if(parts.length>600)parts.splice(0,parts.length-600);
 for(const p of pops){p.life--;p.y-=.3}pops=pops.filter(p=>p.life>0)}

/* ---------------- render ---------------- */
function drawPickup(p){const x=Math.round(p.x-camX),y=Math.round(p.y);
 if(p.para){ctx.fillStyle='#d9cfb8';ctx.beginPath();ctx.moveTo(x-12,y-22);ctx.lineTo(x,y-30);ctx.lineTo(x+12,y-22);ctx.fill();ctx.strokeStyle='#d9cfb8';ctx.beginPath();ctx.moveTo(x-11,y-22);ctx.lineTo(x-4,y-10);ctx.moveTo(x+11,y-22);ctx.lineTo(x+4,y-10);ctx.stroke()}
 if(p.t==='food'){r(x-6,y-6,12,5,'#2f4f8a');r(x-5,y-9,10,3,'#f2efe6');r(x-3,y-10,6,1,'#f2efe6')}
 else if(p.t==='gold'){r(x-6,y-6,12,6,'#d9a441');r(x-4,y-9,8,3,'#f0c860');r(x-6,y-6,12,1,'#fff0a0')}
 else{r(x-7,y-12,14,12,'#7a5a35');r(x-7,y-12,14,1,'#9c7a4c');r(x-7,y-6,14,1,'#5a4025');txt(p.t,x-3,y-10,p.t==='B'?'#ff7d6e':'#ffd24a')}
 if(T%30<15)r(x-1,y-17,2,2,'#fff')}
function drawEnemy(e){const sx=e.x-camX;
 if(e.t==='boat'){if(!e.dead)drawBoat(e);return}
 if(e.t==='mgnest'){if(!e.dead)drawNest(e);else if(e.dt<60){r(sx,e.y-4,34,4,'#4a3a2a')}return}
 if(e.dead){if(e.dt>50&&T%4<2)return;ctx.save();ctx.translate(sx+8,e.y-8);ctx.rotate(e.vx>0?Math.PI/2:-Math.PI/2);drawSoldier(-8,0,{fac:EN,pose:'idle',face:1,emo:'dead',ally:e.ally});ctx.restore();return}
 if(e.flash>0&&T%4<1)return;
 if(e.t==='mortar'){drawMortarCrew(e);return}
 if(e.t==='cavalry'){drawHorse(sx-8,e.y,e.face,T,e.flash>0?'#fff':'#7a5232');drawSoldier(sx+(e.face>0?2:6),e.y-16,{fac:EN,pose:'sit',face:e.face,emo:'shout',gun:'rifle',bayo:1});return}
 const pose=e.para?'jump':!e.on?'jump':((e.shootT>0&&(e.t==='rifle'||e.t==='sniper')&&!e.onBoat)||e.t==='sniper')?'crouch':e.vx?'run':'idle';
 const emo=e.flash>0?'hurt':e.surr?'scared':e.ally?'happy':(e.shout>0||e.t==='runner')?'shout':e.shootT>0?'grit':e.para?'scared':'normal';
 if(e.para)drawParachute(sx+8,e.y);
 drawSoldier(sx,e.y,{fac:EN,pose,face:e.face,anim:e.anim,aim:0,gun:(e.surr||e.t==='grenadier')?null:e.t==='officer'?'pistol':'rifle',bayo:e.t==='runner',muzz:e.shootT>8&&e.t!=='grenadier',ally:e.ally,surr:e.surr,throwT:e.t==='grenadier'?e.shootT:null,emo,blink:((T+(e.x|0))%190)<6,officer:e.t==='officer'});
 if(e.t==='sniper'&&e.aimT>0){const[mx,my]=muzzleOf(e,'rifle',0,true);if(T%8<4)r(mx-camX-1,my-1,3,3,'#fff');if(e.aimT<25){ctx.globalAlpha=.5;seg(mx-camX,my,P.x+8-camX,P.y-14,1,'#ff3a2a');ctx.globalAlpha=1}}
 if(e.ally&&T%60<30)txt('↓',sx+4,e.y-48,'#9fe0a0')}
function render(){
 ctx.save();if(shake>0&&!RM)ctx.translate((rnd()-.5)*shake|0,(rnd()-.5)*shake|0);
 drawBG();
 for(const c of crates){const x=c.x-camX;if(x<-20||x>W)continue;const fl=c.flash>0&&T%2;r(x,c.y-12,14,12,fl?'#fff':'#7a5a35');r(x,c.y-12,14,1,'#9c7a4c');r(x+1,c.y-7,12,1,'#5a4025');r(x+6,c.y-12,2,12,'#5a4025')}
 for(const m of markers){const x=m.x-camX,g=groundAt(m.x);if(g>1e3)continue;if(T%8<5){seg(x-4,g-4,x+4,g+2,1,'#ff3a2a');seg(x+4,g-4,x-4,g+2,1,'#ff3a2a')}}
 for(const p of pickups)drawPickup(p);
 for(const w of pows)if(w.st!=='gone')drawPeasant(w);
 if(boss){const k=boss.kind;if(k==='truck')drawTruck(boss);else if(k==='tank')drawTank(boss);else if(k==='train')drawTrain(boss);else if(k==='car')drawCar(boss);else if(k==='press')drawPress(boss);else if(k==='gunboat')drawGunboat(boss);else if(k==='mech'){if(boss.dead&&boss.dt>95)drawMirror(boss);else drawMech(boss)}}
 for(const v of vehicles){if(v.rider&&!P.dead)continue;if(v.kind==='donkey')drawDonkey(v);else drawSV(v);if(!v.rider&&Math.abs(v.x+v.w/2-P.x-8)<50&&T%40<26)txt('▼ RIDE',v.x-camX+v.w/2-20,v.y-58,'#9fe0a0')}
 for(const e of enemies)drawEnemy(e);
 if(P.veh&&!P.dead){P.veh.riderEmo=shouts.some(b=>b.ent===P&&b.t>15)?'shout':held('fire')?'grit':'determined';if(P.veh.kind==='donkey')drawDonkey(P.veh);else drawSV(P.veh)}
 else if(!(P.inv>0&&!P.dead&&T%6<3)){const sx=P.x-camX;
  if(P.dead){if(!(groundAt(P.x+8)>1e3&&P.y>WATERY)){ctx.save();ctx.translate(sx+8,P.y-8);ctx.rotate(-P.face*Math.PI/2);drawSoldier(-8,0,{fac:S,pose:'idle',face:1,emo:'dead',hero:1});ctx.restore()}}
  else{const pose=!P.on?'jump':P.crouch?'crouch':P.vx?'run':'idle';
   const emo=shouts.some(b=>b.ent===P&&b.t>15)?'shout':P.slash>0?'shout':(P.wpn!=='pistol'&&held('fire'))?'grit':'determined';
   drawSoldier(sx,P.y,{fac:S,pose,face:P.face,anim:P.anim,aim:P.aim,gun:P.wpn,muzz:P.muzz>0,hero:1,emo,blink:T%200<6,slash:P.slash>0?12-P.slash:0});
   if(P.y<0)txt('▼',sx+4,4,'#ffd24a')}}
 if(boss&&boss.kind==='bomber')drawBomber(boss);
 drawShallow();
 for(const b of bullets){const x=b.x-camX;
  if(b.txt){ctx.font=F;ctx.textAlign='left';ctx.textBaseline='middle';r(x-2,b.y-6,b.w+4,12,'#120d0ccc');ctx.fillStyle=b.hp<3&&T%2?'#fff':'#ff7d6e';ctx.fillText(b.txt,x,b.y+1);ctx.textBaseline='top';continue}
  if(b.note){const fl=Math.abs(Math.sin(b.ph*2));r(x-4,b.y-2,8,Math.max(1,fl*5|0),'#8aa070');r(x-2,b.y-1,2,1,'#3a5a2a');continue}
  if(b.wave){r(x,b.y-6,b.w,6,'#8a7656');r(x+2,b.y-9,b.w-4,3,'#a89060');continue}
  if(b.homing){r(x-3,b.y-2,7,4,'#e9dcc2');r(x-1,b.y-3,3,6,'#c8372d');continue}
  if(b.rocket){r(x-4,b.y-1,8,3,'#4a5a3a');r(x+(b.vx>0?3:-4),b.y-1,2,3,'#c8372d');r(x-(b.vx>0?6:-4),b.y,3,1,T%2?'#ffe27a':'#ff8a1a');continue}
  if(b.flame){const s=4+(24-b.life)/2|0;r(x-s/2,b.y-s/2,s,s,b.life>14?'#ffe27a':b.life>7?'#ff8a1a':'#c8372d');continue}
  if(b.f){if(b.pellet)r(x-1,b.y-1,2,2,'#ffe27a');else if(b.big)r(x-2,b.y-1,b.vy?2:5,b.vy?5:2,'#ffd24a');else r(x-1,b.y,b.vy?1:3,b.vy?3:1,'#fff2a8')}
  else r(x-1,b.y-1,3,3,'#ff6a3d')}
 for(const g of grenades){const x=g.x-camX;if(g.kind==='gold'){r(x-4,g.y-2,8,4,'#d9a441');r(x-4,g.y-2,8,1,'#fff0a0')}else if(g.kind==='coal')r(x-2,g.y-2,5,5,'#1a1a1a');else if(g.kind==='bomb'){r(x-2,g.y-4,5,8,'#3a3a3a');r(x-3,g.y-6,7,2,'#555')}else if(g.kind){r(x-2,g.y-2,5,4,'#2a2a26');r(x-1,g.y-1,2,2,'#ffb04a')}else{r(x-2,g.y-2,4,5,'#3a4030');r(x-1,g.y-4,2,2,'#7a6a5a')}}
 for(const p of parts){const x=p.x-camX;
  if(p.smoke){const a=Math.max(0,p.life/(p.max||100))*.5;ctx.fillStyle=`rgba(58,48,46,${a})`;const s=p.s|0;ctx.fillRect(x-s/2|0,p.y-s/2|0,s,s);continue}
  if(p.hat){r(x-2,p.y-2,5,2,p.c);r(x-3,p.y,7,1,'#111');continue}
  const s=p.fire?Math.max(1,p.s*(p.life/40)+1|0):p.s;r(x-s/2,p.y-s/2,s,s,p.fire&&p.life<12?'#4a3a33':p.c)}
 ctx.save();ctx.globalCompositeOperation='lighter';
 for(const g of rings){ctx.strokeStyle=`rgba(255,220,150,${g.life*.8})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(g.x-camX,g.y,g.r,0,6.283);ctx.stroke();
  const gr=ctx.createRadialGradient(g.x-camX,g.y,0,g.x-camX,g.y,g.max*.9);gr.addColorStop(0,`rgba(255,170,60,${g.life*.55})`);gr.addColorStop(1,'rgba(255,90,20,0)');ctx.fillStyle=gr;ctx.fillRect(g.x-camX-g.max,g.y-g.max,g.max*2,g.max*2)}
 if(P.muzz>0&&!P.dead&&!P.veh){const[mx,my]=muzzle();const gr=ctx.createRadialGradient(mx-camX,my,0,mx-camX,my,26);gr.addColorStop(0,'rgba(255,220,120,.5)');gr.addColorStop(1,'rgba(255,160,60,0)');ctx.fillStyle=gr;ctx.fillRect(mx-camX-26,my-26,52,52)}
 for(const p of parts)if(p.fire&&p.life>10){ctx.fillStyle='rgba(255,140,40,.12)';const s=p.s*3;ctx.fillRect(p.x-camX-s/2,p.y-s/2,s,s)}
 if(L.theme!=='snow')for(const e of EMBERS)if(!e.ash){ctx.fillStyle=(T+e.ph*10|0)%20<10?'rgba(255,170,70,.9)':'rgba(255,110,40,.7)';ctx.fillRect(e.x|0,e.y|0,1,1)}
 ctx.restore();
 drawWeather();
 for(const w of pows)if(w.st==='free'&&w.t<150)drawBubble(w.say,w.x-camX+7,w.y-44);
 for(const p of pops){const w=p.s.length*8,x=clamp(p.x-camX,w/2+4,W-w/2-4);if(p.life<20&&T%4<2)continue;txt(p.s,x,p.y,p.c,'center')}
 for(const b of shouts){const e=b.ent;if(e.dead)continue;drawShout(b.s,e.x-camX+8,e.y-(e===P&&P.veh?60:42),b.hero)}
 ctx.restore();
 ctx.drawImage(VIG,0,0);
 if(flashA>0){ctx.globalAlpha=Math.min(1,flashA)*(RM?.3:1);ctx.fillStyle=flashC;ctx.fillRect(0,0,W,H);ctx.globalAlpha=1}
 drawHUD()}
function drawMirror(b){const x=Math.round(b.x-camX),y=b.y;for(const lx of[10,66]){r(x+lx,y-60,10,52,'#4a4a52');r(x+lx-6,y-8,22,8,'#2a2a32')}r(x,y-70,90,14,'#3a3a42');
 r(x-5,y-150,100,80,'#c9d4e2');r(x-2,y-147,94,74,'#e8eef5');for(let i=0;i<5;i++)r(x+4+i*16,y-145+i*12,26,2,'#ffffff');
 ctx.save();ctx.beginPath();ctx.rect(x-2,y-147,94,74);ctx.clip();ctx.translate(x+29,y-76);ctx.scale(2,2);chibiHead('scared',0);cap(S);ctx.restore()}
function drawHUD(){
 r(0,0,W,24,'#120d0cb0');
 txt(`${M().lives} x${Math.max(0,lives)}`,4,4,'#e9dcc2');
 if(P.veh){txt(`SHELLS ${P.veh.ammo}`,W-4,4,'#ffd24a','right');const hw=50;r(W-hw-4,15,hw,5,'#3a1714');r(W-hw-4,15,hw*P.veh.hp/P.veh.max,5,'#9fe0a0');txt(P.veh.kind==='donkey'?'DONKEY':'SV-46',W-hw-10,14,'#9fe0a0','right')}
 else{const wn={pistol:'PISTOL',hmg:'H',shotgun:'S',rocket:'R',flame:'F'}[P.wpn];txt(P.wpn==='pistol'?'PISTOL':`${wn} ${P.ammo}`,W-4,4,P.wpn==='pistol'?'#e9dcc2':'#ffd24a','right');txt(`BOMB ${P.bombs}`,W-4,14,'#ff9a6a','right')}
 if(S==='kmt'){const infl=Math.pow(1.6,(LV*3000+T)/600);txt(`PAY ¥${fmtBig(Math.max(0,score)*infl)} ≈${Math.max(0,score/60|0)} EGGS`,4,14,'#ffd24a')}
 else txt(`MERIT ${score} · YOURS 0`,4,14,'#ff9a6a');
 txt(`M${LV+1}`,W/2,4,'#a8977c','center');
 if(boss&&!boss.dead)bossBar(boss);
 if(radioCur){const Lr=wrap(radioCur.s,34).slice(0,4),h=Lr.length*10+10,x=24,y=boss?52:28,w=W-48;
  r(x,y,w,h,boss?'#120d0c88':'#120d0cdd');ctx.strokeStyle=S==='kmt'?'#4a6aa3':'#c8372d';ctx.lineWidth=1;ctx.strokeRect(x+.5,y+.5,w-1,h-1);
  ctx.save();ctx.translate(x+3,y+31);ctx.beginPath();ctx.rect(0,-29,20,22);ctx.clip();ctx.translate(2,0);chibiHead((T>>3)%2?'shout':'determined',0);cap(S);ctx.restore();
  ctx.font=F;ctx.textAlign='left';ctx.textBaseline='top';const shown=Math.min(radioCur.s.length,(radioCur.max-radioCur.t)*2);let cnt=0;
  Lr.forEach((l,i)=>{const vis=l.slice(0,Math.max(0,shown-cnt));cnt+=l.length+1;ctx.fillStyle='#e9dcc2';ctx.fillText(vis,x+28,y+6+i*10)})}
 if(T<200&&state==='play'){txt(`MISSION ${LV+1}`,W/2,80,'#ffd24a','center',F16);txt(L.name,W/2,102,'#e9dcc2','center');txt(L.sub,W/2,116,'#a8977c','center')}
 if(lockX!=null&&boss&&!boss.dead&&boss.t<120&&T%40<26)txt('WARNING',W/2,100,'#ff6a5a','center',F16);
 if(winT>30){txt('MISSION COMPLETE!',W/2,90,'#ffd24a','center',F16)}
 if(state==='pause'){r(0,0,W,H,'#0008');txt('PAUSED',W/2,92,'#ffd24a','center',F16);txt('THE WAR WILL WAIT. IT ALWAYS DOES.',W/2,116,'#e9dcc2','center')}}
