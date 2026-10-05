/* ===================== PAPER GENERALS 1949 — a Civil Slug turn-based tactics game ===================== */
let T=0,camX=0,S='kmt',EN='ccp',LV=0,skyFlash=0,skyFX=0,state='title';
let plats=[],scorch=[];const L={walls:[60,300],theme:'village',deep:null,weather:null};function groundAt(){return GY}
const VIG=document.createElement('canvas');VIG.width=W;VIG.height=H;{const g=VIG.getContext('2d');const rg=g.createRadialGradient(W/2,H/2,H*.4,W/2,H/2,W*.65);rg.addColorStop(0,'rgba(0,0,0,0)');rg.addColorStop(1,'rgba(6,2,2,.45)');g.fillStyle=rg;g.fillRect(0,0,W,H)}
const SERIF=s=>`900 ${s}px "Noto Serif TC","Songti TC",Georgia,serif`;
function stxt(s,x,y,c,size,a=1,al='center'){ctx.font=SERIF(size);ctx.textAlign=al;ctx.textBaseline='middle';ctx.globalAlpha=a;ctx.fillStyle='#000';ctx.fillText(s,x+1,y+2);ctx.fillStyle=c;ctx.fillText(s,x,y);ctx.globalAlpha=1}
const COLS=12,ROWS=8,TW=22,TH=22,BX=4,BY=30,PX=272;
const DIRS=[[1,0],[-1,0],[0,1],[0,-1]];
/* ---------------- data ---------------- */
const CL={
 rifle:{n:'RIFLEMAN',hp:8,mv:4,rng:5,dmg:3,acc:75,gun:'rifle'},
 mg:{n:'MACHINE GUN',hp:9,mv:3,rng:6,dmg:4,acc:65,gun:'hmg'},
 gren:{n:'GRENADIER',hp:7,mv:4,rng:4,dmg:2,acc:70,gun:'pistol'},
 scout:{n:'SCOUT',hp:6,mv:6,rng:3,dmg:3,acc:80,gun:'pistol'},
 sup:{n:'',hp:6,mv:4,rng:3,dmg:2,acc:65,gun:null},
 tank:{n:'TANK',hp:18,mv:3,rng:6,dmg:5,acc:70,gun:null}};
const SUPN={kmt:'PAYMASTER',ccp:'COMMISSAR'};
const COVER={T:20,H:35,'#':40};
const NAMES=['LI','WANG','ZHANG','LIU','CHEN','YANG','ZHAO','HUANG','ZHOU','WU','XU','SUN','MA','ZHU','HU','GUO','HE','LIN','LUO','GAO'];
const MISSIONS=[
 {name:'THE VILLAGE WELL',theme:'village',goal:'rout',par:6,mus:'m1',
  map:["..T....H..T.","....====....",".H.==..==.H.","...=..O..=..","T..=.....=.T",".H.==..==.H.","....====....","..T.....T..."],
  p:[['rifle',0,2],['rifle',0,4],['scout',1,3],['sup',0,5]],e:[['rifle',11,2],['rifle',11,5],['rifle',10,3],['sup',11,4]],emor:6,
  brief:{kmt:['The village has a well. The bandits have the well.','Take the well. Then tax the water.'],ccp:['The village has a well. The reactionaries have the well.','Liberate the well. Hold a meeting about it.']}},
 {name:'THE PADDY ROAD',theme:'paddy',goal:'rout',par:7,mus:'m2',
  map:[",,,,,,,,T,,,",",,T,,,,,#,,,","============",",,,,,,,,,,,,",",,,,,,,,,#,,","T,,,,,,,,,,,",",,,,,,,T,,#,",",,,,,,,,,,,T"],
  p:[['rifle',0,1],['rifle',0,3],['scout',1,2],['gren',0,5],['sup',1,6]],e:[['mg',9,4],['rifle',8,1],['rifle',10,6],['gren',11,2]],emor:6,
  brief:{kmt:['A machine gun covers the only dry road.','Paddies are slow. So is the payroll.'],ccp:['A machine gun covers the only dry road.','Paddies are slow. The peasants say hello.']}},
 {name:'THE BRIDGE',theme:'river',goal:'hold',hold:8,par:8,mus:'m3',reinf:4,
  map:["..T...~~..T.",".#....~~....","......~~..T.","..#===bb====","..#===bb====","......~~....",".#....~~.T..","..T...~~...."],
  p:[['mg',2,3],['rifle',2,4],['rifle',1,1],['gren',1,6],['sup',0,4]],e:[['rifle',10,3],['rifle',10,4],['rifle',11,1],['scout',11,6]],emor:6,
  brief:{kmt:['Hold the bridge for eight turns.','Headquarters promises reinforcements. Headquarters promises a lot.'],ccp:['Hold the bridge for eight turns.','The main column is coming. It is walking.']}},
 {name:'THE SNOW PASS',theme:'snow',goal:'reach',par:6,mus:'m4',
  map:["TTT..T...TTx","T....O.#...x","..T.....T..x","....#..O...x","..O....#...x","T....T.....x","T..#...O..Tx","TTT..T...TTx"],
  p:[['scout',0,2],['scout',0,4],['rifle',1,3],['rifle',1,5],['sup',0,3]],e:[['mg',7,4],['rifle',7,1],['rifle',9,2],['scout',9,6]],emor:5,
  brief:{kmt:['Get one soldier through the pass. Any soldier.','The report will say it was a strategic withdrawal.'],ccp:['Get one soldier through the pass. Any soldier.','The report will say it was a strategic advance.']}},
 {name:'THE LAST FERRY',theme:'city',goal:'rout',par:9,mus:'m5',
  map:["H..H..H..H..","............","==#=====#===","............","H..#....#..H","............","============","~~~~~~~~~~~~"],
  p:[['rifle',0,1],['rifle',0,3],['mg',1,4],['gren',0,5],['sup',1,2],['scout',0,6]],e:[['tank',10,3],['rifle',11,1],['rifle',9,5],['mg',8,4],['sup',11,4],['rifle',9,0]],emor:4,
  brief:{kmt:['The enemy holds the docks with a tank they took from us.','We would like it back. With interest. In Gold Yuan.'],ccp:['The enemy holds the docks with a tank.','American made. Shipped free. Thank you, America.']}}];
const RALLY_TXT={kmt:['PAID IN GOLD YUAN! SPEND IT FAST!','BONUS: ONE MILLION! (A BUN)','PAYDAY! IT IS ALREADY LESS!'],ccp:['STUDY SESSION! MORALE UP!','SELF-CRITICISM COMPLETE!','WE SING A SONG ABOUT MILLET!']};
const LEAF_TXT={kmt:['SURRENDER! WE HAVE RICE!','COME OVER! PAY IN GOLD YUAN!','AMERICA IS COMING! (SOON)'],ccp:['COME OVER! WE HAVE LAND!','YOUR MONEY IS TOILET PAPER!','WE HAVE MILLET AND FORMS!']};
/* ---------------- state ---------------- */
let MP=null,mi=0,U=[],turn=1,side='p',sel=null,mode=null,RCH=null,busy=0,hov=null,cur={x:0,y:0},kbd=false,fx=[],pops=[],shouts=[],shake=0,msg='',result=null,stats=null,reinfLeft=0,spawnN=0;
const SAVEK='papergenerals.v1';
const inG=(x,y)=>x>=0&&y>=0&&x<COLS&&y<ROWS;
const tileAt=(x,y)=>MP.map[y][x];
const passable=c=>c!=='~'&&c!=='O';
const tcost=c=>(c===','||c==='T'||c==='#')?2:1;
const unitAt=(x,y)=>U.find(u=>!u.dead&&u.x===x&&u.y===y);
const dst=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const alive=t=>U.filter(u=>!u.dead&&u.team===t);
const fac=t=>t==='p'?S:EN;
function log(s){msg=s}
let waits=[];function wait(n){return new Promise(res=>waits.push({n,res}))}
function mkUnit(c,x,y,team,mor){const k=CL[c];return{cls:c,team,fac:fac(team),x,y,fx:BX+x*TW,fy:BY+y*TH,hp:k.hp,max:k.hp,mor:c==='tank'?99:mor,moved:false,acted:false,gren:c==='gren'?2:0,face:team==='p'?1:-1,name:pick(['PVT.','PVT.','CPL.','SGT.'])+' '+pick(NAMES),muzz:0,flash:0,dead:false,dieT:0,surrT:0,walk:0}}
function startMission(i){mi=i;MP=MISSIONS[i];L.theme=MP.theme;LV=i;U=[];turn=1;side='p';sel=null;mode=null;RCH=null;busy=0;fx=[];pops=[];shouts=[];result=null;reinfLeft=MP.reinf||0;spawnN=0;
 for(const[c,x,y]of MP.p)U.push(mkUnit(c,x,y,'p',7));for(const[c,x,y]of MP.e)U.push(mkUnit(c,x,y,'e',MP.emor));
 stats={lost:0,kills:0,turned:0,lostTurn:0};state='brief';music(MP.mus);
 log(i===0?'CLICK A SOLDIER. BLUE TILES = MOVE. MARKED ENEMY = FIRE.':'YOUR TURN.')}
/* ---------------- rules ---------------- */
function reach(u){const N=COLS*ROWS,dist=new Array(N).fill(99),prev=new Array(N).fill(-1),s=u.y*COLS+u.x;dist[s]=0;const q=[s],mv=CL[u.cls].mv;
 while(q.length){q.sort((a,b)=>dist[a]-dist[b]);const c=q.shift(),cx=c%COLS,cy=(c/COLS)|0;
  for(const[dx,dy]of DIRS){const nx=cx+dx,ny=cy+dy;if(!inG(nx,ny))continue;const ch=tileAt(nx,ny);if(!passable(ch))continue;const o=unitAt(nx,ny);if(o&&o.team!==u.team)continue;
   const ni=ny*COLS+nx,nd=dist[c]+tcost(ch);if(nd>mv||nd>=dist[ni])continue;dist[ni]=nd;prev[ni]=c;q.push(ni)}}
 const tiles=[];for(let i=0;i<N;i++)if(dist[i]<99&&i!==s&&!unitAt(i%COLS,(i/COLS)|0))tiles.push(i);return{dist,prev,tiles}}
function pathTo(R,i){const p=[];while(i!==-1&&R.dist[i]>0){p.unshift(i);i=R.prev[i]}return p}
function hitChance(u,from,t){let a=CL[u.cls].acc;if(u.cls==='mg'&&(u.moved||from.x!==u.x||from.y!==u.y))a-=25;
 if(t.cls!=='tank')a-=COVER[tileAt(t.x,t.y)]||0;else a+=10;a-=Math.max(0,Math.round(dst(from,t))-3)*4;return clamp(a,5,95)}
const inRange=(from,t,rng)=>dst(from,t)<=rng+.25;
function targetsFrom(u,from){return U.filter(t=>!t.dead&&t.team!==u.team&&inRange(from,t,CL[u.cls].rng))}
function moraleHit(o,n){if(o.dead||o.cls==='tank')return;o.mor-=n;if(o.mor<=0)defect(o)}
function defect(o){const was=o.team;o.team=was==='p'?'e':'p';o.mor=5;o.moved=o.acted=true;o.surrT=60;o.face=-o.face;
 shout(o,pick(DEFECT));if(was==='p'){stats.lost++;log(o.name+' DEFECTED TO THE ENEMY.')}else{stats.turned++;log(o.name+' JOINS YOUR SQUAD.')}SFX.whistle()}
function hurt(t,n,src){if(t.dead)return;t.hp-=n;t.flash=14;pop(t,'-'+n,'#ff6a5a');SFX.hit();if(t.hp<=0)kill(t,src);else moraleHit(t,1)}
function kill(t,src){t.dead=true;t.dieT=0;t.hp=0;SFX.die();
 if(t.team==='p'){stats.lost++;log(t.name+' IS DOWN.')}else{stats.kills++;log(t.cls==='tank'?'THE TANK IS DONE.':t.name+' IS DOWN.')}
 for(const o of U)if(!o.dead&&o.team===t.team&&o!==t&&dst(o,t)<=3)moraleHit(o,t.cls==='tank'?3:2);
 if(src&&!src.dead&&src.cls!=='tank')src.mor=Math.min(10,src.mor+1)}
function pop(u,s,c){pops.push({x:u.fx+11,y:u.fy-14,s,c,t:0})}
function shout(u,s){shouts.push({s,u,t:0})}
/* ---------------- actions (async, animated) ---------------- */
async function moveUnit(u,path){u.moved=true;u.walk=1;
 for(const i of path){const nx=i%COLS,ny=(i/COLS)|0;if(nx!==u.x)u.face=nx>u.x?1:-1;const ox=u.fx,oy=u.fy,tx=BX+nx*TW,ty=BY+ny*TH;
  for(let f=1;f<=6;f++){u.fx=ox+(tx-ox)*f/6;u.fy=oy+(ty-oy)*f/6;await wait(1)}u.x=nx;u.y=ny;if(T%2)SFX.stomp&&0}
 u.walk=0;u.fx=BX+u.x*TW;u.fy=BY+u.y*TH;checkReach()}
async function fire(u,t){u.acted=u.moved=true;if(t.x!==u.x)u.face=t.x>u.x?1:-1;const hc=hitChance(u,u,t),hit=rnd()*100<hc;
 const n=u.cls==='mg'?3:1;for(let k=0;k<n;k++){(u.cls==='mg'?SFX.hmg:u.cls==='tank'?SFX.boom:SFX.shot)();u.muzz=5;
  const x1=u.fx+11+u.face*12,y1=u.fy+(u.cls==='tank'?10:9),x2=t.fx+11+(hit?0:(rnd()-.5)*20),y2=t.fy+(hit?8:-4+rnd()*20);fx.push({k:'tr',x1,y1,x2,y2,l:5,c:u.cls==='tank'?'#ffb04a':'#ffe27a'});await wait(u.cls==='mg'?5:8)}
 if(u.cls==='tank'){boomAt(t.fx+11,t.fy+14,10);shake=8}
 await wait(6);if(hit)hurt(t,CL[u.cls].dmg,u);else{pop(t,'MISS','#a8977c');moraleHit(t,0)}await wait(24);checkEnd()}
async function throwG(u,gx,gy){u.gren--;u.acted=u.moved=true;if(gx!==u.x)u.face=gx>u.x?1:-1;SFX.throw();
 const g={k:'gr',x0:u.fx+11,y0:u.fy,x1:BX+gx*TW+11,y1:BY+gy*TH+14,t:0,l:26};fx.push(g);await wait(26);SFX.boom();shake=10;boomAt(g.x1,g.y1,24);
 const hit=[[0,0],...DIRS].map(([dx,dy])=>unitAt(gx+dx,gy+dy)).filter(Boolean);for(const t of hit)hurt(t,t.cls==='tank'?6:3,u);await wait(30);checkEnd()}
async function leaflet(u,t){u.acted=u.moved=true;if(t.x!==u.x)u.face=t.x>u.x?1:-1;shout(u,pick(LEAF_TXT[u.fac]));SFX.type();
 for(let i=0;i<10;i++)fx.push({k:'lf',x:u.fx+11,y:u.fy-4,tx:t.fx+11+(rnd()-.5)*14,ty:t.fy+(rnd()-.5)*10,t:-i*2,l:30});await wait(40);
 if(rnd()<.8){pop(t,'MORALE -3','#d9a441');moraleHit(t,3)}else pop(t,'IGNORED','#a8977c');await wait(24);checkEnd()}
async function rally(u){u.acted=u.moved=true;shout(u,pick(RALLY_TXT[u.fac]));SFX.oneup();
 for(const o of U)if(!o.dead&&o.team===u.team&&o.cls!=='tank'&&Math.max(Math.abs(o.x-u.x),Math.abs(o.y-u.y))<=1){const g=o===u?1:3;o.mor=Math.min(10,o.mor+g);pop(o,'MORALE +'+g,'#9fe0a0')}await wait(40)}
function boomAt(x,y,n){for(let i=0;i<n;i++){const a=rnd()*6.28,s=.5+rnd()*2.5;fx.push({k:'p',x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-1,l:16+rnd()*14,c:pick(['#ffe27a','#ffb04a','#ff6a2a','#555','#333'])})}}
/* ---------------- turn flow ---------------- */
function checkReach(){if(MP.goal==='reach'&&alive('p').some(u=>tileAt(u.x,u.y)==='x'))finish('win')}
function checkEnd(){if(state!=='play')return true;if(!alive('p').length){finish('lose');return true}
 if(MP.goal!=='hold'&&!alive('e').length){finish('win');return true}if(MP.goal==='hold'&&!alive('e').length&&reinfLeft<=0){finish('win');return true}return false}
function finish(r){if(state!=='play')return;state='end';result=r;sel=null;mode=null;RCH=null;
 if(r==='win'){const sv=store.get(SAVEK,{})||{};const k=S+'max';sv[k]=Math.max(sv[k]||0,mi+1);const st=1+(stats.lost===0?1:0)+(turn<=MP.par?1:0);sv[S+mi]=Math.max(sv[S+mi]||0,st);stats.stars=st;store.set(SAVEK,sv);SFX.fanfare();music('ending')}
 else{SFX.die();music('off')}}
async function endTurn(){if(busy||side!=='p'||state!=='play')return;busy=1;sel=null;mode=null;RCH=null;side='e';log('ENEMY TURN.');
 for(const u of U)if(u.team==='e'){u.moved=u.acted=false}
 if(MP.goal==='hold'&&reinfLeft>0&&turn%2===0){const rows=[0,1,2,3,4,5,6,7].filter(y=>!unitAt(11,y)&&passable(tileAt(11,y)));for(let k=0;k<2&&reinfLeft>0&&rows.length;k++){const y=rows.splice((rnd()*rows.length)|0,1)[0];const u=mkUnit(pick(['rifle','rifle','scout','gren']),11,y,'e',MP.emor);u.acted=u.moved=true;U.push(u);reinfLeft--;pop(u,'REINFORCEMENT','#ff6a5a')}SFX.whistle();await wait(30)}
 await wait(20);for(const u of U.slice()){if(state!=='play')break;if(u.dead||u.team!=='e'||u.acted)continue;await aiAct(u);await wait(8)}
 if(state!=='play'){busy=0;return}
 turn++;if(MP.goal==='hold'&&turn>MP.hold){finish('win');busy=0;return}
 side='p';for(const u of U)if(u.team==='p'){u.moved=u.acted=false}log(MP.goal==='hold'?'HOLD ON. TURN '+turn+' OF '+MP.hold+'.':'YOUR TURN.');busy=0;autoSelect()}
function autoSelect(){const r=alive('p').find(u=>!u.acted);if(r&&!kbd)return;if(r){selectU(r)}}
function allDone(){return alive('p').every(u=>u.acted)}
/* ---------------- enemy AI ---------------- */
function fieldFrom(team){const N=COLS*ROWS,d=new Array(N).fill(999),q=[];for(const u of alive(team)){const i=u.y*COLS+u.x;d[i]=0;q.push(i)}
 while(q.length){q.sort((a,b)=>d[a]-d[b]);const c=q.shift(),cx=c%COLS,cy=(c/COLS)|0;for(const[dx,dy]of DIRS){const nx=cx+dx,ny=cy+dy;if(!inG(nx,ny)||!passable(tileAt(nx,ny)))continue;const ni=ny*COLS+nx,nd=d[c]+tcost(tileAt(nx,ny));if(nd<d[ni]){d[ni]=nd;q.push(ni)}}}return d}
async function aiAct(u){const R=reach(u),opts=[u.y*COLS+u.x,...R.tiles];let best={v:-1e9};
 const ot=u.team==='p'?'e':'p',foes=alive(ot),allies=alive(u.team);
 for(const i of opts){const fr={x:i%COLS,y:(i/COLS)|0},moved=i!==u.y*COLS+u.x;const cov=(COVER[tileAt(fr.x,fr.y)]||0)/40;
  const threat=foes.filter(p=>inRange(p,fr,CL[p.cls].rng)).length*.25;
  for(const t of foes){if(!inRange(fr,t,CL[u.cls].rng))continue;const hc=hitChance(u,fr,t)/100,d=CL[u.cls].dmg;let v=hc*d+(d>=t.hp?4*hc:0)+cov-threat-(moved?.05:0);if(v>best.v)best={v,i,a:'fire',t}
   if(u.cls==='sup'&&t.cls!=='tank'&&inRange(fr,t,4)){const lv=.8*(t.mor<=3?6:1.5)+cov-threat;if(lv>best.v)best={v:lv,i,a:'leaf',t}}}
  if(u.cls==='sup'){let g=0;for(const o of allies)if(o.cls!=='tank'&&o!==u&&Math.max(Math.abs(o.x-fr.x),Math.abs(o.y-fr.y))<=1&&o.mor<=4)g+=Math.min(3,10-o.mor);if(g){const v=g*.7+cov-threat;if(v>best.v)best={v,i,a:'rally'}}}
  if(u.gren>0){for(let gy=0;gy<ROWS;gy++)for(let gx=0;gx<COLS;gx++){if(Math.hypot(gx-fr.x,gy-fr.y)>4.25)continue;let v=0,hits=0;for(const[dx,dy]of[[0,0],...DIRS]){const o=unitAt(gx+dx,gy+dy);if(!o||o===u)continue;if(o.team!==u.team){v+=3+(o.hp<=3?4:0);hits++}else v-=5}
   if(hits&&Math.abs(gx-fr.x)+Math.abs(gy-fr.y)<=1)v-=5;if(hits>=1){v=v*.8+cov-threat+(hits>1?2:0);if(v>best.v)best={v,i,a:'gren',gx,gy}}}}}
 if(best.a){if(best.i!==u.y*COLS+u.x){await moveUnit(u,pathTo(R,best.i));await wait(6)}
  if(best.a==='fire'&&!best.t.dead&&best.t.team!==u.team)await fire(u,best.t);else if(best.a==='leaf'&&!best.t.dead)await leaflet(u,best.t);else if(best.a==='rally')await rally(u);else if(best.a==='gren')await throwG(u,best.gx,best.gy);u.acted=true;return}
 // advance: nearest player by path, prefer cover
 const F=fieldFrom(ot);let bi=-1,bv=1e9;for(const i of opts){const c=tileAt(i%COLS,(i/COLS)|0);const v=F[i]-(COVER[c]||0)/40;if(v<bv){bv=v;bi=i}}
 if(bi>=0&&bi!==u.y*COLS+u.x)await moveUnit(u,pathTo(R,bi));u.acted=true}
/* ---------------- player input ---------------- */
function selectU(u){sel=u;mode=null;RCH=u.moved?null:reach(u);SFX.tally();if(u.x!==cur.x||u.y!==cur.y){cur.x=u.x;cur.y=u.y}}
function abilities(u){const a=[];if(!u||u.acted)return a;if(u.gren>0)a.push({k:'gren',s:'G GRENADE x'+u.gren});if(u.cls==='sup'){a.push({k:'rally',s:'R RALLY'});a.push({k:'leaf',s:'L LEAFLETS'})}a.push({k:'wait',s:'W HOLD'});return a}
async function doAbility(k){if(!sel||busy||side!=='p'||sel.acted)return;const u=sel;
 if(k==='wait'){u.acted=u.moved=true;sel=null;mode=null;RCH=null;SFX.tally();afterAct();return}
 if(k==='rally'){busy=1;sel=null;RCH=null;await rally(u);busy=0;afterAct();return}
 mode=mode===k?null:k;SFX.tally()}
function afterAct(){if(state==='play'&&allDone())setTimeout(()=>endTurn(),350);else if(kbd){const r=alive('p').find(u=>!u.acted);if(r)selectU(r)}}
async function clickTile(x,y){if(busy||state!=='play'||side!=='p'||!inG(x,y))return;const o=unitAt(x,y);
 if(sel&&!sel.acted&&mode==='gren'){if(Math.hypot(x-sel.x,y-sel.y)<=4.25){const u=sel;busy=1;sel=null;mode=null;RCH=null;await throwG(u,x,y);busy=0;afterAct()}else{mode=null}return}
 if(sel&&!sel.acted&&mode==='leaf'){if(o&&o.team==='e'&&o.cls!=='tank'&&dst(sel,o)<=4.25){const u=sel;busy=1;sel=null;mode=null;RCH=null;await leaflet(u,o);busy=0;afterAct()}else mode=null;return}
 if(o&&o.team==='p'){if(o.acted){log(o.name+' HAS ALREADY ACTED.');return}selectU(o);return}
 if(sel&&o&&o.team==='e'&&!sel.acted){if(inRange(sel,o,CL[sel.cls].rng)){const u=sel;busy=1;sel=null;RCH=null;await fire(u,o);busy=0;afterAct()}else log('OUT OF RANGE. MOVE CLOSER.');return}
 if(sel&&RCH&&!sel.moved){const i=y*COLS+x;if(RCH.tiles.includes(i)){const u=sel;busy=1;RCH=null;await moveUnit(u,pathTo(reach(u),i));busy=0;if(state==='play'){if(!targetsFrom(u,u).length&&!abilities(u).some(a=>a.k!=='wait')){}selectU(u)}return}}
 sel=null;mode=null;RCH=null}
/* ---------------- render ---------------- */
const THC={village:{g:['#5d6b3a','#56633a'],sp:'#71804a',rd:'#9a8257',rd2:'#8a7449'},paddy:{g:['#5a6e3a','#526636'],sp:'#7a8a4a',rd:'#a08a5c',rd2:'#8e7a50'},river:{g:['#55693a','#4f6236'],sp:'#6c7f46',rd:'#9a8257',rd2:'#8a7449'},
 snow:{g:['#d8dde2','#cdd3da'],sp:'#ffffff',rd:'#b8b0a0',rd2:'#a8a090'},city:{g:['#6a6560','#625d58'],sp:'#757069',rd:'#4a4643',rd2:'#3e3a37'}};
const hsh=(x,y)=>((x*73856093)^(y*19349663))>>>0;
function drawFloor(x,y){const c=tileAt(x,y),px=BX+x*TW,py=BY+y*TH,P=THC[MP.theme],h=hsh(x,y);
 if(c==='~'){r(px,py,TW,TH,'#2a4a5e');for(let i=0;i<3;i++){const w=(T/8+i*7+x*3)%TW;r(px+w,py+4+i*7,5,1,'#4a7488')}return}
 if(c==='b'){r(px,py,TW,TH,'#2a4a5e');r(px,py+1,TW,TH-2,'#7a5a38');for(let i=0;i<TH;i+=4)r(px,py+i,TW,1,'#5a3e24');return}
 if(c===','){r(px,py,TW,TH,'#3e5a50');r(px,py,TW,1,'#5a6a3a');for(let i=0;i<6;i++){const sx=px+2+((h>>(i*3))%18),sy=py+3+i*3;r(sx,sy,1,3,'#8ab05a');r(sx+1,sy-1,1,2,'#a8c870')}return}
 r(px,py,TW,TH,P.g[(x+y)%2]);for(let i=0;i<3;i++)r(px+((h>>(i*5))%20),py+((h>>(i*4+2))%20),2,1,P.sp);
 if(c==='='){r(px,py+2,TW,TH-4,P.rd);r(px,py+2,TW,1,P.rd2);r(px+((h>>3)%18),py+8,3,1,P.rd2)}
 if(c==='x'){r(px+2,py+2,TW-4,TH-4,'rgba(217,164,65,.25)');if((T>>4)%2)txt('>',px+7,py+7,'#d9a441')}}
function drawProp(x,y){const c=tileAt(x,y),px=BX+x*TW,py=BY+y*TH,sn=MP.theme==='snow',cy=MP.theme==='city';
 if(c==='T'){if(sn){r(px+10,py+14,3,7,'#4a3020');for(let i=0;i<4;i++){r(px+5-i+2,py+2+i*4-6,12+i*2-4,4,'#2f4a3a');r(px+6-i+2,py+2+i*4-6,8+i*2-4,1,'#f4f6f8')}}
  else{for(const bx of[4,10,16]){r(px+bx,py-8+(bx%3),2,28,'#6a8a3a');r(px+bx,py-2,2,1,'#4a6a2a');r(px+bx,py+8,2,1,'#4a6a2a');r(px+bx-3,py-6+(bx%5),4,2,'#7aa04a');r(px+bx+2,py+2,4,2,'#5a8a3a')}}}
 else if(c==='H'){if(cy){r(px+1,py-10,20,30,'#6a4a3a');r(px+1,py-12,20,3,'#3a2a24');for(const[wx,wy]of[[4,-6],[13,-6],[4,4]])r(px+wx,py+wy,5,6,(hsh(x,y+wx)%3)?'#2a2220':'#d9a441');r(px+13,py+6,5,14,'#3a2a20')}
  else{r(px+2,py+2,18,18,'#b8a888');r(px+2,py+2,18,2,'#8a7a5a');r(px+8,py+10,6,10,'#4a3020');r(px,py-6,22,4,'#3a3a40');r(px+2,py-9,18,4,'#4a4a52');r(px+5,py-11,12,3,'#5a5a62');if(sn)r(px+1,py-11,20,3,'#f4f6f8')}}
 else if(c==='#'){const s=sn?'#e8ecef':'#9a8660',s2=sn?'#c8d0d8':'#7a6a48';for(let i=0;i<3;i++)r(px+i*7,py+12,8,6,i%2?s:s2);for(let i=0;i<2;i++)r(px+3+i*8,py+7,8,5,i%2?s2:s)}
 else if(c==='O'){if(MP.theme==='village'){r(px+3,py+6,16,14,'#7a7a72');r(px+3,py+6,16,2,'#9a9a90');r(px+5,py+8,12,4,'#1a2a30');r(px+2,py-6,2,14,WOOD);r(px+18,py-6,2,14,WOOD);r(px+2,py-7,18,2,WOODD)}
  else{r(px+2,py+5,18,15,sn?'#8a8a90':'#6a6a68');r(px+4,py+3,13,4,sn?'#f4f6f8':'#7a7a78');r(px+2,py+16,18,4,'#4a4a50')}}
 else if(c==='x'){r(px+16,py-6,1,22,'#5a4030');r(px+17,py-6,7,5,S==='kmt'?'#2f4f8a':'#b8322a')}}
function drawUnit(u){const px=Math.round(u.fx),py=Math.round(u.fy);if(u.dead){if(u.dieT<40){ctx.globalAlpha=1-u.dieT/40;ctx.save();ctx.translate(px+11,py+18);ctx.rotate(Math.min(1.5,u.dieT/10)*u.face*-1);drawSoldier(-8,0,{fac:u.fac,face:u.face,emo:'hurt',gun:CL[u.cls].gun});ctx.restore();ctx.globalAlpha=1}else{r(px+7,py+16,8,3,PAL[u.fac].h);r(px+6,py+18,10,1,PAL[u.fac].hs)}return}
 const team=u.team==='p'?'#d9a441':'#c8372d';ctx.globalAlpha=.55;r(px+3,py+17,16,3,team);r(px+5,py+16,12,1,team);ctx.globalAlpha=1;
 if(side==='p'&&u.team==='p'&&u.acted&&state==='play')ctx.globalAlpha=.6;
 const fl=u.flash>0&&T%4<2;
 if(u.cls==='tank'){const b=u.fac==='kmt'?'#5d6447':'#5f6b3f',dk='#3a3e2c';r(px-1,py+12,24,7,'#262622');for(let i=0;i<4;i++)r(px+1+i*6,py+14,4,4,'#4a4a44');r(px,py+7,22,6,fl?'#fff':b);r(px,py+7,22,1,dk);r(px+6,py+2,10,6,fl?'#fff':b);r(px+6,py+2,10,1,dk);
  const bx=u.face>0?px+15:px-6;r(bx,py+4,13,2,'#262626');emblem(u.fac,px+8,py+8);if(u.muzz>0)r(u.face>0?px+27:px-10,py+2,6,6,'#fff')}
 else{const k=CL[u.cls];let emo=u.hp<=2?'hurt':u.mor<=3?'scared':u.team==='p'?'determined':'normal';if(u.surrT>0)emo='scared';
  if(fl)ctx.filter='brightness(3)';drawSoldier(px+3,py+19,{fac:u.fac,face:u.face,pose:u.walk?'run':'idle',anim:T,gun:u.surrT>0?null:k.gun,muzz:u.muzz>0,emo,surr:u.surrT>0,officer:u.cls==='sup',item:u.cls==='sup'?(u.fac==='kmt'?'case':'board'):null});ctx.filter='none'}
 ctx.globalAlpha=1}
function drawBars(u){if(u.dead)return;const px=Math.round(u.fx),py=Math.round(u.fy);r(px+3,py+20,16,2,'#2a0a08');r(px+3,py+20,Math.ceil(16*u.hp/u.max),2,u.team==='p'?'#9fe0a0':'#ff6a5a');
 if(u.cls!=='tank'){for(let i=0;i<5;i++)r(px+3+i*3+(i>0?0:0),py-19,2,2,u.mor>i*2?'#d9a441':'rgba(0,0,0,.4)')}}
function render(){camX=(T*.15)%300;ctx.fillStyle='#0c0908';ctx.fillRect(0,0,W,H);
 if(state==='title'){if(!BGD)buildBG();drawBG();ctx.drawImage(VIG,0,0);return}
 if(state==='side'){renderSide();return}if(state==='missions'){renderMissions();return}
 ctx.save();if(shake){ctx.translate((rnd()-.5)*shake*.6,(rnd()-.5)*shake*.6)}
 for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)drawFloor(x,y);
 // overlays
 if(sel&&RCH&&state==='play'){for(const i of RCH.tiles){const x=i%COLS,y=(i/COLS)|0;ctx.globalAlpha=.45+.1*Math.sin(T/10);r(BX+x*TW+1,BY+y*TH+1,TW-2,TH-2,'#3a8ae8');ctx.globalAlpha=1}}
 if(sel&&mode==='gren')for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)if(Math.hypot(x-sel.x,y-sel.y)<=4.25){ctx.globalAlpha=.18;r(BX+x*TW+1,BY+y*TH+1,TW-2,TH-2,'#ff8a3a');ctx.globalAlpha=1}
 if(sel&&mode==='gren'&&hov&&Math.hypot(hov.x-sel.x,hov.y-sel.y)<=4.25)for(const[dx,dy]of[[0,0],...DIRS])if(inG(hov.x+dx,hov.y+dy)){ctx.globalAlpha=.45;r(BX+(hov.x+dx)*TW+1,BY+(hov.y+dy)*TH+1,TW-2,TH-2,'#ff4a2a');ctx.globalAlpha=1}
 if(sel){ctx.strokeStyle='#ffd24a';ctx.lineWidth=1;ctx.strokeRect(BX+sel.x*TW+.5,BY+sel.y*TH+.5,TW-1,TH-1)}
 if(hov&&inG(hov.x,hov.y)&&state==='play'){ctx.strokeStyle='rgba(255,255,255,.5)';ctx.strokeRect(BX+hov.x*TW+.5,BY+hov.y*TH+.5,TW-1,TH-1)}
 for(const u of U)if(u.dead)drawUnit(u);
 for(let y=0;y<ROWS;y++){for(let x=0;x<COLS;x++)drawProp(x,y);for(const u of U)if(!u.dead&&Math.round((u.fy-BY)/TH)===y)drawUnit(u)}
 for(const u of U)drawBars(u);
 // target markers
 if(sel&&!sel.acted&&state==='play'&&side==='p'){const lf=mode==='leaf';for(const t of U){if(t.dead||t.team!=='e')continue;const ok=lf?(t.cls!=='tank'&&dst(sel,t)<=4.25):(!mode&&inRange(sel,t,CL[sel.cls].rng));if(!ok)continue;
  const px=Math.round(t.fx),py=Math.round(t.fy);ctx.strokeStyle=lf?'#d9a441':'#ff4a3a';ctx.strokeRect(px+.5,py+.5,TW-1,TH-1);if(!lf){const hc=hitChance(sel,sel,t);r(px+1,py-30,22,9,'rgba(12,9,8,.85)');txt(hc+'%',px+12,py-29,hc>=60?'#9fe0a0':hc>=35?'#ffd24a':'#ff6a5a','center')}}}
 for(const f of fx){if(f.k==='tr'){ctx.strokeStyle=f.c;ctx.globalAlpha=f.l/5;ctx.beginPath();ctx.moveTo(f.x1,f.y1);ctx.lineTo(f.x2,f.y2);ctx.stroke();ctx.globalAlpha=1}
  else if(f.k==='p')r(f.x,f.y,2,2,f.c);
  else if(f.k==='gr'){const k=f.t/f.l,x=f.x0+(f.x1-f.x0)*k,y=f.y0+(f.y1-f.y0)*k-Math.sin(k*Math.PI)*30;r(x-2,y-2,4,4,'#3a4030');r(x-1,y-4,2,2,WOOD)}
  else if(f.k==='lf'&&f.t>=0){const k=Math.min(1,f.t/24),x=f.x+(f.tx-f.x)*k,y=f.y+(f.ty-f.y)*k-Math.sin(k*Math.PI)*16;r(x,y,4,3,'#f4efe0');r(x,y,4,1,f.t%6<3?'#c8372d':'#2f4f8a')}}
 for(const p of pops){ctx.globalAlpha=Math.min(1,2-p.t/30);txt(p.s,p.x,p.y-p.t*.4,p.c,'center');ctx.globalAlpha=1}
 for(const s of shouts)if(!s.u.dead||s.t<30)drawShout(s.s,s.u.fx+11,s.u.fy-20,s.u.team==='p');
 ctx.restore();
 // HUD
 ctx.globalAlpha=.9;r(0,0,W,BY-14,'#0c0908');ctx.globalAlpha=1;
 txt('M'+(mi+1)+' '+MP.name,4,4,'#ffd24a');txt('TURN '+turn,W/2+44,4,'#e9dcc2');
 renderPanel();
 ctx.globalAlpha=.9;r(0,BY+ROWS*TH,W,H-BY-ROWS*TH,'#0c0908');ctx.globalAlpha=1;txt(msg.slice(0,47),4,BY+ROWS*TH+1,side==='e'?'#ff8a7a':'#e9dcc2');
 if(state==='brief')renderBrief();if(state==='end')renderEnd();ctx.drawImage(VIG,0,0)}
let pBtns=[];
function renderPanel(){const x0=PX;ctx.globalAlpha=.92;r(x0-2,BY-12,W-x0+2,ROWS*TH+12,'#120d0c');ctx.globalAlpha=1;pBtns=[];
 const u=sel||(hov&&unitAt(hov.x,hov.y));let y=BY-8;
 if(u){const nm=u.cls==='sup'?SUPN[u.fac]:CL[u.cls].n;txt(u.name,x0+2,y,u.team==='p'?'#ffd24a':'#ff8a7a');txt(nm,x0+2,y+10,'#a8977c');
  txt('HP',x0+2,y+22,'#a8977c');r(x0+22,y+22,82,6,'#2a0a08');r(x0+22,y+22,82*u.hp/u.max,6,'#9fe0a0');txt(u.hp+'',x0+104,y+30,'#e9dcc2','right');
  if(u.cls!=='tank'){txt('MOR',x0+2,y+40,'#a8977c');r(x0+30,y+40,74,6,'#2a1a08');r(x0+30,y+40,74*clamp(u.mor,0,10)/10,6,u.mor<=3?'#ff6a5a':'#d9a441')}else txt('NO MORALE.',x0+2,y+40,'#6e6050');
  txt('MV '+CL[u.cls].mv+' RNG '+CL[u.cls].rng,x0+2,y+52,'#6e6050');
  if(u.team==='p'&&side==='p')txt(u.acted?'DONE':u.moved?'MOVED':'READY',x0+2,y+64,u.acted?'#6e6050':'#9fe0a0')}
 else{txt('NO ONE',x0+2,y,'#6e6050');txt('SELECTED',x0+2,y+10,'#6e6050')}
 y=BY+72;if(sel&&sel.team==='p'&&side==='p'&&state==='play')for(const a of abilities(sel)){const on=mode===a.k;r(x0+2,y,104,14,on?'#4a2a10':'#1e150c');ctx.strokeStyle=on?'#ff8a3a':'#6e5a3a';ctx.strokeRect(x0+2.5,y+.5,103,13);txt(a.s,x0+6,y+3,on?'#ff8a3a':'#e9dcc2');pBtns.push({x:x0+2,y,w:104,h:14,k:a.k});y+=17}
 const ob=MP.goal==='rout'?'ROUT THE ENEMY':MP.goal==='hold'?'HOLD '+Math.max(0,MP.hold-turn+1)+' MORE TURNS':'REACH THE FLAG';txt(ob,x0+2,BY+ROWS*TH-38,'#a8977c');
 const ready=alive('p').filter(u=>!u.acted).length;txt(S==='kmt'?'PAY '+fmtBig(1e6*Math.pow(1.9,turn-1))+' GY':'MEETINGS '+(turn*3-2),x0+2,BY+ROWS*TH-48,'#6e6050');txt('READY '+ready+'/'+alive('p').length,x0+2,BY+ROWS*TH-28,'#6e6050');
 const can=side==='p'&&!busy&&state==='play';const by=BY+ROWS*TH-16;r(x0+2,by,104,14,can?'#3a1410':'#1a1210');ctx.strokeStyle=can?'#c8372d':'#3a2e26';ctx.strokeRect(x0+2.5,by+.5,103,13);txt(side==='p'?'E END TURN':'ENEMY TURN',x0+6,by+3,can?'#ffd0c0':'#6e6050');if(can)pBtns.push({x:x0+2,y:by,w:104,h:14,k:'end'})}
function renderBrief(){r(0,0,W,H,'rgba(8,6,5,.86)');stxt('BATTLE '+(mi+1),W/2,40,'#a8977c',12);stxt(MP.name,W/2,64,'#ffd24a',22);
 MP.brief[S].forEach((l,i)=>txt(l,W/2,92+i*12,'#e9dcc2','center'));
 txt('OBJECTIVE: '+(MP.goal==='rout'?'ROUT THE ENEMY':MP.goal==='hold'?'HOLD FOR '+MP.hold+' TURNS':'GET ONE SOLDIER TO THE FLAG'),W/2,128,'#9fe0a0','center');
 txt('ENEMY MORALE: '+(MP.emor<=4?'SHAKY':MP.emor<=5?'TIRED':'STEADY'),W/2,142,'#a8977c','center');
 if((T>>5)%2)txt(touchUI?'TAP TO DEPLOY':'CLICK OR ENTER TO DEPLOY',W/2,172,'#6e6050','center')}
function renderEnd(){r(0,0,W,H,'rgba(8,6,5,.84)');const w=result==='win';stxt(w?'VICTORY':'DEFEAT',W/2,48,w?'#ffd24a':'#b3261e',26);
 const fin=w&&mi===MISSIONS.length-1;
 const lines=w?(fin?['The ferry leaves. Both sides file a report saying they won.','Both reports are stamped. One is in Gold Yuan.']:[pick2(['The battle report says: decisive. The soldiers say: lunch.','Headquarters sends congratulations, and no rice.','You are promoted. Your pay is now worth slightly less.'])]):[pick2(['Your squad has been reorganised. Into the enemy.','Headquarters calls it a tactical relocation.','The leaflets were more convincing than you.'])];
 lines.forEach((l,i)=>txt(l,W/2,76+i*12,'#e9dcc2','center'));
 txt('TURNS '+turn+'   LOST '+stats.lost+'   KILLED '+stats.kills+'   TURNED '+stats.turned,W/2,112,'#a8977c','center');
 if(w){const st=stats.stars||1;for(let i=0;i<3;i++)stxt('★',W/2-24+i*24,138,i<st?'#ffd24a':'#3a2e26',18);txt('NO LOSSES / UNDER '+MP.par+' TURNS',W/2,154,'#6e6050','center')}
 if((T>>5)%2)txt(touchUI?'TAP TO CONTINUE':'CLICK OR ENTER TO CONTINUE',W/2,186,'#6e6050','center')}
const pick2=a=>a[(mi*7+turn)%a.length];
let sBtns=[];
function renderSide(){if(!BGD)buildBG();drawBG();ctx.globalAlpha=.75;r(0,0,W,H,'#0c0908');ctx.globalAlpha=1;stxt('CHOOSE YOUR ARMY',W/2,18,'#e9dcc2',16);sBtns=[];
 const sv=store.get(SAVEK,{})||{};
 [['kmt','NATIONALIST ARMY','PAID IN GOLD YUAN.','THE YUAN IS PAID IN','INFLATION.'],['ccp','PEOPLE\'S ARMY','PAID IN MILLET AND','MEETINGS. THE MEETINGS','ARE MANDATORY.']].forEach(([f,n,a,b,c],i)=>{const x=24+i*176,y=36,on=hov&&hov.side===f;
  r(x,y,160,150,on?'#2a1d14':'#1a130f');r(x,y,160,3,f==='kmt'?'#2f4f8a':'#b8322a');ctx.strokeStyle=on?'#d9a441':'#3a2e26';ctx.strokeRect(x+.5,y+.5,159,149);
  ctx.save();ctx.translate(x+40,y+70);ctx.scale(1.6,1.6);drawSoldier(-8,0,{fac:f,face:1,emo:'determined',gun:'rifle'});ctx.restore();ctx.save();ctx.translate(x+100,y+70);ctx.scale(1.6,1.6);drawSoldier(-8,0,{fac:f,face:-1,emo:'happy',gun:null,officer:true,item:f==='kmt'?'case':'board'});ctx.restore();
  txt(n,x+80,y+84,'#ffd24a','center');txt(a,x+80,y+100,'#a8977c','center');txt(b,x+80,y+110,'#a8977c','center');txt(c,x+80,y+120,'#a8977c','center');txt('BATTLES WON '+(sv[f+'max']||0)+'/5',x+80,y+136,'#6e6050','center');sBtns.push({x,y,w:160,h:150,f})});
 txt(touchUI?'TAP AN ARMY':'CLICK AN ARMY (OR PRESS 1 / 2)',W/2,H-14,'#6e6050','center');ctx.drawImage(VIG,0,0)}
let mBtns=[];
function renderMissions(){if(!BGD)buildBG();drawBG();ctx.globalAlpha=.78;r(0,0,W,H,'#0c0908');ctx.globalAlpha=1;stxt(S==='kmt'?'NATIONALIST CAMPAIGN':'PEOPLE\'S CAMPAIGN',W/2,16,'#e9dcc2',14);
 const sv=store.get(SAVEK,{})||{},mx=sv[S+'max']||0;mBtns=[];
 MISSIONS.forEach((m,i)=>{const x=10+i*74,y=36,open=i<=mx,on=hov&&hov.m===i;r(x,y,68,130,open?(on?'#3a2a1a':'#2a1d14'):'#141010');r(x,y,68,3,S==='kmt'?'#2f4f8a':'#b8322a');
  txt('BATTLE '+(i+1),x+34,y+8,open?'#e9dcc2':'#4a3e34','center');
  if(open){const w=wrap(m.name.replace('THE ',''),8);w.forEach((l,k)=>txt(l,x+34,y+22+k*10,'#ffd24a','center'));ctx.save();ctx.translate(x+34,y+86);drawSoldier(-8,0,{fac:EN,face:-1,emo:'normal',gun:m.e[0][0]==='tank'?'rocket':'rifle'});ctx.restore();
   txt(m.goal.toUpperCase(),x+34,y+96,'#a8977c','center');const st=sv[S+i]||0;for(let k=0;k<3;k++)stxt('★',x+16+k*18,y+116,k<st?'#ffd24a':'#3a2e26',11);mBtns.push({x,y,w:68,h:130,i})}
  else txt('LOCKED',x+34,y+60,'#4a3e34','center')});
 r(W/2-60,H-34,120,16,'#1e150c');ctx.strokeStyle='#6e5a3a';ctx.strokeRect(W/2-59.5,H-33.5,119,15);txt('CHANGE ARMY',W/2,H-30,'#e9dcc2','center');mBtns.push({x:W/2-60,y:H-34,w:120,h:16,i:-1});ctx.drawImage(VIG,0,0)}
/* ---------------- update ---------------- */
function update(){T++;if(shake>0)shake--;
 for(const w of waits.slice()){if(--w.n<=0){waits.splice(waits.indexOf(w),1);w.res()}}
 for(const u of U){if(u.muzz>0)u.muzz--;if(u.flash>0)u.flash--;if(u.surrT>0)u.surrT--;if(u.dead)u.dieT++}
 for(const f of fx){f.l--;if(f.k==='p'){f.x+=f.vx;f.y+=f.vy;f.vy+=.12}if(f.k==='gr'||f.k==='lf')f.t++}fx=fx.filter(f=>f.l>0&&(f.k!=='gr'||f.t<f.l));
 for(const p of pops)p.t++;pops=pops.filter(p=>p.t<60);for(const s of shouts)s.t++;shouts=shouts.filter(s=>s.t<90)}
/* ---------------- input ---------------- */
let touchUI=matchMedia('(pointer:coarse)').matches;
function pt(e){const rc=cv.getBoundingClientRect();const x=(e.clientX-rc.left)/rc.width*W,y=(e.clientY-rc.top)/rc.height*H;return{x,y,tx:Math.floor((x-BX)/TW),ty:Math.floor((y-BY)/TH)}}
const inB=(b,p)=>p.x>=b.x&&p.x<=b.x+b.w&&p.y>=b.y&&p.y<=b.y+b.h;
function proceed(){if(state==='brief'){state='play';SFX.whistle();if(kbd)autoSelect();return true}if(state==='end'){state='missions';music('m3');return true}return false}
function pressAt(p){initAudio();
 if(state==='side'){for(const b of sBtns)if(inB(b,p)){chooseSide(b.f);return}return}
 if(state==='missions'){for(const b of mBtns)if(inB(b,p)){if(b.i<0){state='side';SFX.tally()}else startMission(b.i);return}return}
 if(proceed())return;if(state!=='play')return;
 for(const b of pBtns)if(inB(b,p)){if(b.k==='end')endTurn();else doAbility(b.k);return}
 if(inG(p.tx,p.ty)){cur.x=p.tx;cur.y=p.ty;clickTile(p.tx,p.ty)}}
function chooseSide(f){S=f;EN=f==='kmt'?'ccp':'kmt';state='missions';SFX.tally();BGD=null}
cv.addEventListener('pointerdown',e=>{kbd=false;pressAt(pt(e))});
cv.addEventListener('pointermove',e=>{const p=pt(e);if(state==='side'){const b=sBtns.find(b=>inB(b,p));hov=b?{side:b.f}:null;return}if(state==='missions'){const b=mBtns.find(b=>inB(b,p));hov=b?{m:b.i}:null;return}hov=inG(p.tx,p.ty)?{x:p.tx,y:p.ty}:null});
addEventListener('keydown',e=>{if(state==='title')return;initAudio();const k=e.code;
 if(state==='side'){if(k==='Digit1'||k==='ArrowLeft')chooseSide('kmt');if(k==='Digit2'||k==='ArrowRight')chooseSide('ccp');return}
 if(state==='missions'){const sv=store.get(SAVEK,{})||{};if(/^Digit[1-5]$/.test(k)){const i=+k.slice(5)-1;if(i<=(sv[S+'max']||0))startMission(i)}if(k==='Escape')state='side';if(k==='Enter')startMission(Math.min(4,sv[S+'max']||0));return}
 if((k==='Enter'||k==='Space')&&proceed()){e.preventDefault();return}if(state!=='play')return;kbd=true;
 const mv={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[k];if(mv){e.preventDefault();cur.x=clamp(cur.x+mv[0],0,COLS-1);cur.y=clamp(cur.y+mv[1],0,ROWS-1);hov={x:cur.x,y:cur.y};return}
 if(k==='Enter'||k==='Space'){e.preventDefault();clickTile(cur.x,cur.y);return}
 if(k==='Tab'){e.preventDefault();const r_=alive('p').filter(u=>!u.acted);if(r_.length){const i=(r_.indexOf(sel)+1)%r_.length;selectU(r_[i]);hov={x:cur.x,y:cur.y}}return}
 if(k==='KeyE')endTurn();if(k==='KeyG')doAbility('gren');if(k==='KeyR')doAbility('rally');if(k==='KeyL')doAbility('leaf');if(k==='KeyW')doAbility('wait');
 if(k==='Escape'){if(mode)mode=null;else{sel=null;RCH=null}}});
$('#bPlay').onclick=()=>{initAudio();$('#title').hidden=true;$('#hud').hidden=false;state='side';music('m3')};
$('#bPause').onclick=()=>{if(state==='play'&&!busy){state='missions';music('m3')}};$('#bPause').textContent='MAP';$('#bPause').setAttribute('aria-label','Back to battle map');
$('#bSnd').onclick=e=>{initAudio();setMute(!muted);e.currentTarget.textContent=muted?'MUTE':'SND';e.currentTarget.blur()};
function fit(){const vw=innerWidth,vh=innerHeight,s=Math.min(vw/W,vh/H);cv.style.width=Math.floor(W*s)+'px';cv.style.height=Math.floor(H*s)+'px'}
addEventListener('resize',fit);fit();cv.style.touchAction='none';
let last=performance.now(),acc=0;
function loop(nt){acc+=Math.min(100,nt-last);last=nt;while(acc>=16.67){acc-=16.67;update()}render();requestAnimationFrame(loop)}
(document.fonts?Promise.all([document.fonts.load(F),document.fonts.load(SERIF(20))]):Promise.resolve()).catch(()=>{}).finally(()=>requestAnimationFrame(loop));
