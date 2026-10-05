/* ===================== PAPER GENERALS 1949 — a Civil Slug turn-based tactics game ===================== */
let T=0,camX=0,S='kmt',EN='ccp',LV=0,skyFlash=0,skyFX=0,state='title';
let plats=[],scorch=[];const L={walls:[60,300],theme:'village',deep:null,weather:null};function groundAt(){return GY}
const VIG=document.createElement('canvas');VIG.width=W;VIG.height=H;{const g=VIG.getContext('2d');const rg=g.createRadialGradient(W/2,H/2,H*.4,W/2,H/2,W*.65);rg.addColorStop(0,'rgba(0,0,0,0)');rg.addColorStop(1,'rgba(6,2,2,.45)');g.fillStyle=rg;g.fillRect(0,0,W,H)}
/* ---------------- i18n core: 繁體中文 default, English optional (strings translated at draw time) ---------------- */
let LANG='zh';const LANG_KEY='papergenerals.lang';
const ZFAM='"Noto Sans TC","Noto Sans CJK TC","PingFang TC","Microsoft JhengHei","Heiti TC","Source Han Sans TC","WenQuanYi Micro Hei",sans-serif';
const CJK_RE=/[⺀-鿿豈-﫿＀-￯　-〿]/;
const LZ=(e,z)=>LANG==='zh'?z:e;
function zf(font){const m=/(\d+)px/.exec(font||F),p=m?+m[1]:8;return p>=16?`700 16px ${ZFAM}`:p<=6?`500 8px ${ZFAM}`:`500 11px ${ZFAM}`}
const MISS=new Set();
function tr(s){if(LANG!=='zh'||typeof s!=='string')return s;const z=ZT[s];if(z!=null)return z;for(const[re,f]of ZRX){const m=re.exec(s);if(m)return f(m)}if(/[A-Z]{2}/i.test(s)&&!CJK_RE.test(s))MISS.add(s);return s}
function wrapPx(s,maxW){const toks=String(s).match(/[A-Za-z0-9$%'’.,!?:\/+\-()]+|\s+|[\s\S]/gu)||[];const out=[];let line='';
 for(const tk of toks){const test=line+tk;if(line.trim()&&ctx.measureText(test.trimEnd()).width>maxW&&!/^[，。、！？：；）」』…—,.!?)\s]/.test(tk)){out.push(line.trim());line=/^\s+$/.test(tk)?'':tk}else line=test}
 if(line.trim())out.push(line.trim());return out}
const isDark=c=>{const m=/^#([0-9a-f]{6})/i.exec(c);if(!m)return false;const v=parseInt(m[1],16);return((v>>16)*.3+((v>>8)&255)*.59+(v&255)*.11)<70};
// ink on paper: no outline, CJK-aware
function ink(s,x,y,c='#120d0c',al='left',px=8){s=tr(String(s));const z=CJK_RE.test(s);ctx.font=z?`500 ${px+3}px ${ZFAM}`:px===8?F:`${px}px monospace`;ctx.textAlign=al;ctx.textBaseline=z?'middle':'top';ctx.fillStyle=c;ctx.fillText(s,x,z?y+px/2:y);ctx.textBaseline='top'}
const SERIF=s=>`900 ${s}px "Noto Serif TC","Songti TC",Georgia,${ZFAM}`;
function stxt(s,x,y,c,size,a=1,al='center'){s=tr(s);ctx.font=SERIF(size);ctx.textAlign=al;ctx.textBaseline='middle';ctx.globalAlpha=a;ctx.fillStyle='#000';ctx.fillText(s,x+1,y+2);ctx.fillStyle=c;ctx.fillText(s,x,y);ctx.globalAlpha=1}
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
  p:[['rifle',0,2],['rifle',0,4],['scout',1,3],['sup',0,5]],e:[['rifle',11,2],['rifle',11,5],['scout',10,3],['sup',11,4]],emor:4,
  brief:['The village has a well. The bandits have the well.','Take the well. Then tax the water.']},
 {name:'THE PADDY ROAD',theme:'paddy',goal:'rout',par:7,mus:'m2',
  map:[",,,,,,,,T,,,",",,T,,,,,#,,,","============",",,,,,,,,,,,,",",,,,,,,,,#,,","T,,,,,,,,,,,",",,,,,,,T,,#,",",,,,,,,,,,,T"],
  p:[['rifle',0,1],['rifle',0,3],['scout',1,2],['gren',0,5],['sup',1,6]],e:[['mg',9,4],['rifle',8,1],['rifle',10,6],['gren',11,2]],emor:6,
  brief:['A machine gun covers the only dry road.','Paddies are slow. So is the payroll.']},
 {name:'THE BRIDGE',theme:'river',goal:'hold',hold:8,par:8,mus:'m3',reinf:4,
  map:["..T...~~..T.",".#..#.~~....",".....#~~..T.","..#===bb====","..#===bb====",".....#~~....",".#..#.~~.T..","..T...~~...."],
  p:[['mg',2,3],['rifle',2,4],['rifle',1,1],['gren',1,6],['sup',0,4]],e:[['rifle',10,3],['rifle',10,4],['rifle',11,1],['scout',11,6]],emor:5,
  brief:['Hold the bridge for eight turns.','Headquarters promises reinforcements. Headquarters promises a lot.']},
 {name:'THE SNOW PASS',theme:'snow',goal:'reach',par:6,mus:'m4',
  map:["TTT..T...TTx","T....O.#...x","..T.....T..x","....#..O...x","..O....#...x","T....T.....x","T..#...O..Tx","TTT..T...TTx"],
  p:[['scout',0,2],['scout',0,4],['rifle',1,3],['rifle',1,5],['sup',0,3]],e:[['mg',7,4],['rifle',7,1],['rifle',9,2],['scout',9,6]],emor:5,
  brief:['Get one soldier through the pass. Any soldier.','The report will say it was a strategic withdrawal.']},
 {name:'THE LAST PLANE',theme:'airfield',goal:'hold',hold:7,par:7,mus:'m5',reinf:6,rpool:['rifle','rifle','scout','gren','mg'],
  map:["H..H....T..H","..#....#....","PP.....#..#.","PP==========","============","..#...#..#..","H.....T.....","H..H.......T"],
  p:[['mg',2,2],['rifle',2,4],['rifle',3,1],['gren',2,5],['sup',1,4],['scout',3,6]],e:[['rifle',10,1],['rifle',11,4],['scout',10,6],['gren',11,2]],emor:6,
  news:{2:'THE GOLD IS LOADED. HOLD ON.',3:'THE ARCHIVES ARE LOADED. HOLD ON.',4:'A PIANO IS BEING LOADED. HOLD ON.',5:'THE PIANO DOES NOT FIT. HOLD ON.',6:'THE PIANO FITS. THE PILOT DOES NOT.',7:'ENGINES RUNNING. NO SEATS LEFT. HOLD ON.'},
  brief:['The last transport plane is loading.','Cargo: the gold, the files, a piano.','Seats for soldiers: on the next plane.']},
 {name:'THE LAST FERRY',theme:'city',goal:'rout',par:10,mus:'final',reinf:3,rpool:['rifle','gren','scout','mg'],ferry:1,final:1,
  map:["H..H..H..H..","............","==#=====#===","............","H..#....#..H","............","============","~~~~~~~~~~~~"],
  p:[['rifle',0,1],['rifle',0,3],['mg',1,4],['gren',0,5],['sup',1,2],['scout',0,6]],e:[['tank',10,3],['rifle',11,1],['rifle',9,5],['mg',8,4],['sup',11,4],['rifle',9,0]],emor:4,
  news:{2:'THE FERRY HORN SOUNDS. THE GOLD HAS BOARDED.',3:'THE BAND HAS BOARDED. THEY ARE PLAYING.',4:'HQ HAS BOARDED. HQ SAYS HOLD THE DOCKS.',5:'THE PAYMASTER IS ON BOARD. HE WAVES.',6:'THE FERRY IS WARMING UP. SO IS THE ENEMY.',8:'LAST CALL. THE CAPTAIN IS COUNTING SEATS.'},
  brief:['FINAL BATTLE. The enemy holds the docks','with a tank they took from us. More are coming.','Clear the docks. The last ferry waits. Mostly.']}];
const RALLY_TXT={kmt:['PAID IN GOLD YUAN! SPEND IT FAST!','BONUS: ONE MILLION! (A BUN)','PAYDAY! IT IS ALREADY LESS!'],ccp:['STUDY SESSION! MORALE UP!','SELF-CRITICISM COMPLETE!','WE SING A SONG ABOUT MILLET!']};
const LEAF_TXT={kmt:['SURRENDER! WE HAVE RICE!','COME OVER! PAY IN GOLD YUAN!','AMERICA IS COMING! (SOON)'],ccp:['COME OVER! WE HAVE LAND!','YOUR MONEY IS TOILET PAPER!','WE HAVE MILLET AND FORMS!']};
/* ---------------- state ---------------- */
let MP=null,mi=0,U=[],turn=1,side='p',sel=null,mode=null,RCH=null,busy=0,hov=null,cur={x:0,y:0},kbd=false,fx=[],pops=[],shouts=[],shake=0,msg='',result=null,stats=null,reinfLeft=0,spawnN=0;
const SAVEK='papergenerals.v1';
const inG=(x,y)=>x>=0&&y>=0&&x<COLS&&y<ROWS;
const tileAt=(x,y)=>MP.map[y][x];
const passable=c=>c!=='~'&&c!=='O'&&c!=='P';
const tcost=c=>(c===','||c==='T'||c==='#')?2:1;
const unitAt=(x,y)=>U.find(u=>!u.dead&&u.x===x&&u.y===y);
const dst=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const alive=t=>U.filter(u=>!u.dead&&u.team===t);
const fac=t=>t==='p'?S:EN;
function log(s){msg=s}
let waits=[];function wait(n){return new Promise(res=>waits.push({n,res}))}
function mkUnit(c,x,y,team,mor){const k=CL[c],hp=k.hp+(team==='p'?2:0);return{cls:c,team,fac:fac(team),x,y,fx:BX+x*TW,fy:BY+y*TH,hp,max:hp,mor:c==='tank'?99:mor,moved:false,acted:false,gren:c==='gren'?2:0,face:team==='p'?1:-1,name:pick(['PVT.','PVT.','CPL.','SGT.'])+' '+pick(NAMES),muzz:0,flash:0,dead:false,dieT:0,surrT:0,walk:0}}
function startMission(i){mi=i;MP=MISSIONS[i];L.theme=THEMES[MP.theme]?MP.theme:'paddy';LV=i;U=[];turn=1;side='p';sel=null;mode=null;RCH=null;busy=0;fx=[];pops=[];shouts=[];result=null;reinfLeft=MP.reinf||0;spawnN=0;
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
function hitChance(u,from,t){let a=CL[u.cls].acc+(u.team==='p'?10:0);if(u.cls==='mg'&&(u.moved||from.x!==u.x||from.y!==u.y))a-=25;
 if(t.cls!=='tank')a-=COVER[tileAt(t.x,t.y)]||0;else a+=10;a-=Math.max(0,Math.round(dst(from,t))-3)*4;return clamp(a,5,95)}
const inRange=(from,t,rng)=>dst(from,t)<=rng+.25;
function targetsFrom(u,from){return U.filter(t=>!t.dead&&t.team!==u.team&&inRange(from,t,CL[u.cls].rng))}
function moraleHit(o,n){if(o.dead||o.cls==='tank')return;o.mor-=n;if(o.mor<=0)defect(o)}
function defect(o){const was=o.team;o.team=was==='p'?'e':'p';o.mor=5;o.moved=o.acted=true;o.surrT=60;o.face=-o.face;
 shout(o,pick(DEFECT));if(was==='p'){stats.lost++;stats.def=(stats.def||0)+1;log(o.name+' DEFECTED TO THE ENEMY.')}else{stats.turned++;log(o.name+' JOINS YOUR SQUAD.')}SFX.whistle()}
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
 if(MP.goal!=='hold'&&!alive('e').length&&reinfLeft<=0){finish('win');return true}if(MP.goal==='hold'&&!alive('e').length&&reinfLeft<=0){finish('win');return true}return false}
function finish(r){if(state!=='play')return;state='end';result=r;sel=null;mode=null;RCH=null;
 if(r==='win'){const sv=store.get(SAVEK,{})||{};const k=S+'max';sv[k]=Math.max(sv[k]||0,mi+1);const st=1+(stats.lost===0?1:0)+(turn<=MP.par?1:0);sv[S+mi]=Math.max(sv[S+mi]||0,st);stats.stars=st;const g=sv.tot||{kills:0,turned:0,lost:0};g.kills+=stats.kills;g.turned+=stats.turned;g.lost+=stats.lost;sv.tot=g;store.set(SAVEK,sv);SFX.fanfare();music('ending')}
 else{SFX.die();music('off')}}
async function endTurn(){if(busy||side!=='p'||state!=='play')return;busy=1;sel=null;mode=null;RCH=null;side='e';log('ENEMY TURN.');
 for(const u of U)if(u.team==='e'){u.moved=u.acted=false}
 if(reinfLeft>0&&(turn%2===0||!alive('e').length)){const rows=[0,1,2,3,4,5,6,7].filter(y=>!unitAt(11,y)&&passable(tileAt(11,y)));for(let k=0;k<2&&reinfLeft>0&&rows.length;k++){const y=rows.splice((rnd()*rows.length)|0,1)[0];const u=mkUnit(pick(MP.rpool||['rifle','rifle','scout','gren']),11,y,'e',MP.emor);u.acted=u.moved=true;U.push(u);reinfLeft--;pop(u,'REINFORCEMENT','#ff6a5a')}SFX.whistle();await wait(30)}
 await wait(20);for(const u of U.slice()){if(state!=='play')break;if(u.dead||u.team!=='e'||u.acted)continue;await aiAct(u);await wait(8)}
 if(state!=='play'){busy=0;return}
 turn++;if(MP.goal==='hold'&&turn>MP.hold){finish('win');busy=0;return}
 side='p';for(const u of U)if(u.team==='p'){u.moved=u.acted=false}log((MP.news&&MP.news[turn])||(MP.goal==='hold'?'HOLD ON. TURN '+turn+' OF '+MP.hold+'.':reinfLeft>0?'YOUR TURN. MORE ENEMIES ARE COMING.':'YOUR TURN.'));busy=0;autoSelect()}
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
 // advance: nearest foe by path, prefer cover (defenders in a hold battle stay dug in)
 if(u.team==='p'&&MP.goal==='hold'){u.acted=true;return}
 const F=fieldFrom(ot);let bi=-1,bv=1e9;for(const i of opts){const c=tileAt(i%COLS,(i/COLS)|0),fr={x:i%COLS,y:(i/COLS)|0};let v=F[i]-(COVER[c]||0)/40;if(v<bv){bv=v;bi=i}}
 if(bi>=0&&bi!==u.y*COLS+u.x)await moveUnit(u,pathTo(R,bi));u.acted=true}
/* ---------------- player input ---------------- */
function selectU(u){sel=u;mode=null;RCH=u.moved?null:reach(u);SFX.tally();if(u.x!==cur.x||u.y!==cur.y){cur.x=u.x;cur.y=u.y}}
function abilities(u){const a=[];if(!u||u.acted)return a;if(u.gren>0)a.push({k:'gren',s:LZ('G GRENADE x','G 手榴彈 x')+u.gren});if(u.cls==='sup'){a.push({k:'rally',s:'R RALLY'});a.push({k:'leaf',s:'L LEAFLETS'})}a.push({k:'wait',s:'W HOLD'});return a}
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
 airfield:{g:['#6e6a4c','#68644a'],sp:'#807a58',rd:'#5e5c58',rd2:'#4c4a47'},
 snow:{g:['#d8dde2','#cdd3da'],sp:'#ffffff',rd:'#b8b0a0',rd2:'#a8a090'},city:{g:['#6a6560','#625d58'],sp:'#757069',rd:'#4a4643',rd2:'#3e3a37'}};
const hsh=(x,y)=>((x*73856093)^(y*19349663))>>>0;
function drawFloor(x,y){const c=tileAt(x,y),px=BX+x*TW,py=BY+y*TH,P=THC[MP.theme],h=hsh(x,y);
 if(c==='~'){r(px,py,TW,TH,'#2a4a5e');for(let i=0;i<3;i++){const w=(T/8+i*7+x*3)%TW;r(px+w,py+4+i*7,5,1,'#4a7488')}return}
 if(c==='b'){r(px,py,TW,TH,'#2a4a5e');r(px,py+1,TW,TH-2,'#7a5a38');for(let i=0;i<TH;i+=4)r(px,py+i,TW,1,'#5a3e24');return}
 if(c===','){r(px,py,TW,TH,'#3e5a50');r(px,py,TW,1,'#5a6a3a');for(let i=0;i<6;i++){const sx=px+2+((h>>(i*3))%18),sy=py+3+i*3;r(sx,sy,1,3,'#8ab05a');r(sx+1,sy-1,1,2,'#a8c870')}return}
 r(px,py,TW,TH,P.g[(x+y)%2]);for(let i=0;i<3;i++)r(px+((h>>(i*5))%20),py+((h>>(i*4+2))%20),2,1,P.sp);
 if(c==='P'){r(px,py,TW,TH,P.rd);return}
 if(c==='='){r(px,py+2,TW,TH-4,P.rd);if(MP.theme==='airfield'&&y===3)r(px+4,py+TH-3,10,2,'#d8d0b8');r(px,py+2,TW,1,P.rd2);r(px+((h>>3)%18),py+8,3,1,P.rd2)}
 if(c==='x'){r(px+2,py+2,TW-4,TH-4,'rgba(217,164,65,.25)');if((T>>4)%2)txt('>',px+7,py+7,'#d9a441')}}
function drawProp(x,y){const c=tileAt(x,y),px=BX+x*TW,py=BY+y*TH,sn=MP.theme==='snow',cy=MP.theme==='city';
 if(c==='T'){if(sn){r(px+10,py+14,3,7,'#4a3020');for(let i=0;i<4;i++){r(px+5-i+2,py+2+i*4-6,12+i*2-4,4,'#2f4a3a');r(px+6-i+2,py+2+i*4-6,8+i*2-4,1,'#f4f6f8')}}
  else{for(const bx of[4,10,16]){r(px+bx,py-8+(bx%3),2,28,'#6a8a3a');r(px+bx,py-2,2,1,'#4a6a2a');r(px+bx,py+8,2,1,'#4a6a2a');r(px+bx-3,py-6+(bx%5),4,2,'#7aa04a');r(px+bx+2,py+2,4,2,'#5a8a3a')}}}
 else if(c==='H'){if(cy){r(px+1,py-10,20,30,'#6a4a3a');r(px+1,py-12,20,3,'#3a2a24');for(const[wx,wy]of[[4,-6],[13,-6],[4,4]])r(px+wx,py+wy,5,6,(hsh(x,y+wx)%3)?'#2a2220':'#d9a441');r(px+13,py+6,5,14,'#3a2a20')}
  else{r(px+2,py+2,18,18,'#b8a888');r(px+2,py+2,18,2,'#8a7a5a');r(px+8,py+10,6,10,'#4a3020');r(px,py-6,22,4,'#3a3a40');r(px+2,py-9,18,4,'#4a4a52');r(px+5,py-11,12,3,'#5a5a62');if(sn)r(px+1,py-11,20,3,'#f4f6f8')}}
 else if(c==='#'){const s=sn?'#e8ecef':'#9a8660',s2=sn?'#c8d0d8':'#7a6a48';for(let i=0;i<3;i++)r(px+i*7,py+12,8,6,i%2?s:s2);for(let i=0;i<2;i++)r(px+3+i*8,py+7,8,5,i%2?s2:s)}
 else if(c==='O'){if(MP.theme==='village'){r(px+3,py+6,16,14,'#7a7a72');r(px+3,py+6,16,2,'#9a9a90');r(px+5,py+8,12,4,'#1a2a30');r(px+2,py-6,2,14,WOOD);r(px+18,py-6,2,14,WOOD);r(px+2,py-7,18,2,WOODD)}
  else{r(px+2,py+5,18,15,sn?'#8a8a90':'#6a6a68');r(px+4,py+3,13,4,sn?'#f4f6f8':'#7a7a78');r(px+2,py+16,18,4,'#4a4a50')}}
 else if(c==='x'){r(px+16,py-6,1,22,'#5a4030');r(px+17,py-6,7,5,'#2f4f8a')}}
function drawPlane(){let ax=-1,ay=-1;for(let y=0;y<ROWS&&ax<0;y++)for(let x=0;x<COLS;x++)if(tileAt(x,y)==='P'){ax=x;ay=y;break}if(ax<0)return;
 const px=BX+ax*TW,py=BY+ay*TH,g='#9aa09a',d='#6a706a',late=MP.goal==='hold'&&turn>=6;
 r(px+2,py+34,3,4,'#222');r(px+30,py+34,5,5,'#222');r(px+31,py+28,2,7,'#444');
 r(px-1,py+2,7,14,g);r(px-1,py+2,7,1,d);emblem('kmt',px-1,py+6);r(px-4,py+16,12,2,d);
 r(px+2,py+16,42,11,g);r(px+2,py+16,42,1,'#c0c6c0');r(px+2,py+26,42,1,d);r(px+44,py+18,3,8,g);r(px+46,py+20,2,4,'#3a4a5a');
 for(let i=0;i<5;i++)r(px+12+i*5,py+19,3,3,'#2a3a4a');r(px+6,py+18,5,8,'#3a3030');
 r(px+18,py+26,22,3,d);r(px+28,py+22,9,7,'#5a5e5a');const sp=late||((T>>3)%5===0);r(px+37,py+(sp?17:20),1,sp?16:10,sp?'rgba(220,220,220,.5)':'#2a2a2a');
 enGold(px+4,py+38);if(turn<4)enGold(px+14,py+40)}
function drawFerry(){const px=BX+3*TW,py=BY+7*TH,y=py+Math.round(Math.sin(T/20));
 r(px,y+12,92,7,'#3a3030');r(px-4,y+10,8,4,'#3a3030');r(px+88,y+10,8,4,'#3a3030');r(px,y+11,92,1,'#6a5a4a');
 r(px+14,y+4,58,8,'#d9cfb8');for(let i=0;i<6;i++)r(px+18+i*9,y+6,5,3,'#2a3a4a');r(px+52,y-6,9,10,'#2f4f8a');r(px+52,y-6,9,2,'#120d0c');
 for(let k=0;k<3;k++){const s=(T*.3+k*10)%30;ctx.globalAlpha=Math.max(0,.5-s/60);r(px+54-s*.5,y-10-s*.4,3+k,3,'#5a5a64');ctx.globalAlpha=1}
 const g=Math.max(0,4-Math.max(0,turn-1));for(let i=0;i<g;i++)enGold(px+16+i*12,y+4)}
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
 if(state==='ending'){renderEnding();ctx.drawImage(VIG,0,0);return}if(state==='missions'){renderMissions();return}
 ctx.save();if(shake){ctx.translate((rnd()-.5)*shake*.6,(rnd()-.5)*shake*.6)}
 for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)drawFloor(x,y);
 if(MP.theme==='airfield')drawPlane();if(MP.ferry)drawFerry();
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
 txt(LZ('M'+(mi+1)+' '+MP.name,'第'+(mi+1)+'戰 '+tr(MP.name)),4,4,'#ffd24a');txt(LZ('TURN '+turn,'第 '+turn+' 回合'),W/2+44,4,'#e9dcc2');
 renderPanel();
 ctx.globalAlpha=.9;r(0,BY+ROWS*TH,W,H-BY-ROWS*TH,'#0c0908');ctx.globalAlpha=1;msgLine(tr(msg),4,BY+ROWS*TH+1,side==='e'?'#ff8a7a':'#e9dcc2',W-8);
 if(state==='brief')renderBrief();if(state==='end')renderEnd();ctx.drawImage(VIG,0,0)}
function msgLine(s,x,y,c,maxW){if(!CJK_RE.test(s)){ctx.font=F;if(ctx.measureText(s).width<=maxW){txt(s,x,y,c);return}ctx.font='7px monospace';ctx.textAlign='left';ctx.textBaseline='top';ctx.fillStyle=c;ctx.fillText(s,x,y+1,maxW);return}
 let sz=11;ctx.font=`500 ${sz}px ${ZFAM}`;while(sz>8&&ctx.measureText(s).width>maxW){sz--;ctx.font=`500 ${sz}px ${ZFAM}`}ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillStyle=c;ctx.fillText(s,x,y+4,maxW);ctx.textBaseline='top'}
let pBtns=[];
function renderPanel(){const x0=PX;ctx.globalAlpha=.92;r(x0-2,BY-12,W-x0+2,ROWS*TH+12,'#120d0c');ctx.globalAlpha=1;pBtns=[];
 const u=sel||(hov&&unitAt(hov.x,hov.y));let y=BY-8;
 if(u){const nm=u.cls==='sup'?SUPN[u.fac]:CL[u.cls].n;txt(u.name,x0+2,y,u.team==='p'?'#ffd24a':'#ff8a7a');txt(nm,x0+2,y+10,'#a8977c');
  txt('HP',x0+2,y+22,'#a8977c');r(x0+22,y+22,82,6,'#2a0a08');r(x0+22,y+22,82*u.hp/u.max,6,'#9fe0a0');txt(u.hp+'',x0+104,y+30,'#e9dcc2','right');
  if(u.cls!=='tank'){txt('MOR',x0+2,y+40,'#a8977c');r(x0+30,y+40,74,6,'#2a1a08');r(x0+30,y+40,74*clamp(u.mor,0,10)/10,6,u.mor<=3?'#ff6a5a':'#d9a441')}else txt('NO MORALE.',x0+2,y+40,'#6e6050');
  txt(LZ('MV '+CL[u.cls].mv+' RNG '+CL[u.cls].rng,'移動 '+CL[u.cls].mv+'　射程 '+CL[u.cls].rng),x0+2,y+52,'#6e6050');
  if(u.team==='p'&&side==='p')txt(u.acted?'DONE':u.moved?'MOVED':'READY',x0+2,y+64,u.acted?'#6e6050':'#9fe0a0')}
 else{txt('NO ONE',x0+2,y,'#6e6050');txt('SELECTED',x0+2,y+10,'#6e6050')}
 y=BY+72;if(sel&&sel.team==='p'&&side==='p'&&state==='play')for(const a of abilities(sel)){const on=mode===a.k;r(x0+2,y,104,14,on?'#4a2a10':'#1e150c');ctx.strokeStyle=on?'#ff8a3a':'#6e5a3a';ctx.strokeRect(x0+2.5,y+.5,103,13);txt(a.s,x0+6,y+3,on?'#ff8a3a':'#e9dcc2');pBtns.push({x:x0+2,y,w:104,h:14,k:a.k});y+=17}
 const wl=Math.ceil(reinfLeft/2),hl=Math.max(0,MP.hold-turn+1);
 const ob=MP.goal==='rout'?(reinfLeft>0?LZ('WAVES LEFT '+wl,'還有 '+wl+' 波敵軍'):'ROUT THE ENEMY'):MP.goal==='hold'?LZ('HOLD '+hl+' MORE TURNS','再撐 '+hl+' 回合'):'REACH THE FLAG';txt(ob,x0+2,BY+ROWS*TH-41,'#a8977c');
 const ready=alive('p').filter(u=>!u.acted).length,pay=fmtBig(1e6*Math.pow(1.9,turn-1));txt(LZ('PAY '+pay+' GY','軍餉 '+pay+' 金圓'),x0+2,BY+ROWS*TH-54,'#6e6050');txt(LZ('READY ','待命 ')+ready+'/'+alive('p').length,x0+2,BY+ROWS*TH-28,'#6e6050');
 const can=side==='p'&&!busy&&state==='play';const by=BY+ROWS*TH-16;r(x0+2,by,104,14,can?'#3a1410':'#1a1210');ctx.strokeStyle=can?'#c8372d':'#3a2e26';ctx.strokeRect(x0+2.5,by+.5,103,13);txt(side==='p'?'E END TURN':'ENEMY TURN',x0+6,by+3,can?'#ffd0c0':'#6e6050');if(can)pBtns.push({x:x0+2,y:by,w:104,h:14,k:'end'})}
function renderBrief(){r(0,0,W,H,'rgba(8,6,5,.86)');stxt(MP.final?'FINAL BATTLE':LZ('BATTLE '+(mi+1)+' OF '+MISSIONS.length,'第 '+(mi+1)+' 戰（共 '+MISSIONS.length+' 戰）'),W/2,40,MP.final?'#ff8a3a':'#a8977c',12);stxt(MP.name,W/2,64,'#ffd24a',22);
 MP.brief.forEach((l,i)=>txt(l,W/2,LANG==='zh'?86+i*13:88+i*11,'#e9dcc2','center'));
 txt(LZ('OBJECTIVE: ','目標：')+tr(MP.goal==='rout'?(MP.reinf?'ROUT ALL ENEMY WAVES':'ROUT THE ENEMY'):MP.goal==='hold'?LZ('HOLD FOR '+MP.hold+' TURNS','死守 '+MP.hold+' 回合'):'GET ONE SOLDIER TO THE FLAG'),W/2,128,'#9fe0a0','center');
 txt(LZ('ENEMY MORALE: ','敵軍士氣：')+tr(MP.emor<=4?'SHAKY':MP.emor<=5?'TIRED':'STEADY'),W/2,142,'#a8977c','center');
 if((T>>5)%2)txt(touchUI?'TAP TO DEPLOY':'CLICK OR ENTER TO DEPLOY',W/2,172,'#6e6050','center')}
function renderEnd(){r(0,0,W,H,'rgba(8,6,5,.84)');const w=result==='win';stxt(w?'VICTORY':'DEFEAT',W/2,48,w?'#ffd24a':'#b3261e',26);
 const fin=w&&mi===MISSIONS.length-1;
 const lines=w?(fin?['You hold the docks. A decisive Nationalist victory!','Headquarters asks you to hold the ferry door, too.']:[pick2(['The battle report says: decisive. The soldiers say: lunch.','Headquarters sends congratulations, and no rice.','You are promoted. Your pay is now worth slightly less.'])]):[pick2(['Your squad has been reorganised. Into the enemy.','Headquarters calls it a tactical relocation.','The leaflets were more convincing than you.'])];
 lines.forEach((l,i)=>txt(l,W/2,76+i*12,'#e9dcc2','center'));if(w&&!fin&&mi===4)txt('The plane leaves on time. Without you.',W/2,88,'#ff9a6a','center');
 txt(LZ('TURNS '+turn+'   LOST '+stats.lost+'   KILLED '+stats.kills+'   TURNED '+stats.turned,'回合 '+turn+'　損失 '+stats.lost+'　擊斃 '+stats.kills+'　策反 '+stats.turned),W/2,112,'#a8977c','center');
 if(w){const st=stats.stars||1;for(let i=0;i<3;i++)stxt('★',W/2-24+i*24,138,i<st?'#ffd24a':'#3a2e26',18);txt(LZ('NO LOSSES / UNDER '+MP.par+' TURNS','零損失／'+MP.par+' 回合內獲勝'),W/2,154,'#6e6050','center')}
 if((T>>5)%2)txt(LANG==='zh'?(touchUI?'點一下':'點擊或按 Enter ')+(w?(fin?'觀看尾聲':'前往下一戰'):'撤退'):(touchUI?'TAP':'CLICK OR ENTER')+(w?(fin?' FOR THE EPILOGUE':' FOR THE NEXT BATTLE'):' TO RETREAT'),W/2,186,'#6e6050','center')}
const pick2=a=>a[(mi*7+turn)%a.length];
let mBtns=[];
function renderMissions(){if(!BGD)buildBG();drawBG();ctx.globalAlpha=.78;r(0,0,W,H,'#0c0908');ctx.globalAlpha=1;stxt('NATIONALIST CAMPAIGN',W/2,16,'#e9dcc2',14);
 const sv=store.get(SAVEK,{})||{},mx=sv[S+'max']||0;mBtns=[];
 MISSIONS.forEach((m,i)=>{const x=6+i*63,y=36,open=i<=mx,on=hov&&hov.m===i;r(x,y,59,130,open?(on?'#3a2a1a':'#2a1d14'):'#141010');r(x,y,59,3,m.final?'#c8372d':'#2f4f8a');
  txt(LZ('NO.'+(i+1),'第'+(i+1)+'戰'),x+30,y+8,open?'#e9dcc2':'#4a3e34','center');
  if(open){const zn=tr(m.name),w=LANG==='zh'?(zn.match(/.{1,4}/gu)||[]):wrap(m.name.replace('THE ',''),7);w.forEach((l,k)=>txt(l,x+30,y+22+k*10,'#ffd24a','center'));ctx.save();ctx.translate(x+30,y+86);drawSoldier(-8,0,{fac:EN,face:-1,emo:'normal',gun:m.e[0][0]==='tank'?'rocket':'rifle'});ctx.restore();
   txt(m.goal.toUpperCase(),x+30,y+96,'#a8977c','center');const st=sv[S+i]||0;for(let k=0;k<3;k++)stxt('★',x+12+k*18,y+116,k<st?'#ffd24a':'#3a2e26',11);mBtns.push({x,y,w:59,h:130,i})}
  else{txt('LOCKED',x+30,y+60,'#4a3e34','center');if(m.final)txt('FINAL',x+30,y+76,'#5a2a24','center')}});
 const bw=Math.min(mx,MISSIONS.length)+'/'+MISSIONS.length;txt(LZ('BATTLES WON '+bw+' · PAID IN GOLD YUAN, LATE','勝場 '+bw+' · 軍餉以金圓券發放（照例遲發）'),W/2,H-40,'#a8977c','center');txt(touchUI?'TAP A BATTLE':'CLICK A BATTLE (OR PRESS 1-6)',W/2,H-26,'#6e6050','center');ctx.drawImage(VIG,0,0)}
/* ---------------- campaign story: the newspaper wins every week, the map does not ---------------- */
function paperArt(k,h1,h2,bun,say,emo){return t=>{r(0,0,W,136,'#4a3426');for(let y=5;y<136;y+=9)r(0,y,W,1,'#3e2a1e');for(let y=9;y<136;y+=23)r((y*37)%W,y,40,1,'#5a4030');
 const px=22,py=8;r(px+4,py+4,214,122,'rgba(0,0,0,.45)');r(px,py,214,122,'#e4d8bc');r(px,py,214,2,'#c8b890');r(px+213,py,1,122,'#c8b890');
 ink('THE CENTRAL DISPATCH',px+107,py+5,'#120d0c','center');r(px+6,py+15,202,1,'#120d0c');r(px+6,py+17,202,1,'#120d0c');
 const a=Math.min(1,t/20);stxt(h1,px+107,py+30,'#b8322a',15,a);stxt(h2,px+107,py+47,'#b8322a',15,a);
 ink(LZ('BUN PRICE: '+bun+' GY','包子價格：'+tr(bun)+' 金圓'),px+6,py+60,'#5a4a3a');
 for(let i=0;i<9;i++){r(px+6,py+74+i*5,116-((i*13)%30),2,'#a89a80')}r(px+6,py+118,60,1,'#a89a80');
 const mx=px+130,my=py+72,mw=76,mh=44,fy=[4,12,18,25,31,38][k];r(mx-1,my-1,mw+2,mh+2,'#120d0c');r(mx,my,mw,mh,'#2f4f8a');
 for(let i=0;i<19;i++){const hh=Math.min(mh,fy+((hsh(i,k)%5)-2));r(mx+i*4,my,4,Math.max(0,hh),'#b8322a')}
 const ay=my+Math.max(2,fy-6)+((T>>4)%2);seg(mx+60,ay-6,mx+60,ay+2,2,'#ffd24a');r(mx+58,ay+2,6,2,'#ffd24a');r(mx+59,ay+4,4,1,'#ffd24a');
 txt('OURS',mx+38,my+mh-9,'#e9dcc2','center');ink('MAP',mx+mw-1,my-10,'#5a4a3a','right');
 r(274,106,14,10,'#e9dcc2');r(276,108,10,2,'#7a5a3a');r(287,108,3,5,'#e9dcc2');
 drawSoldier(310,124,{fac:'kmt',face:-1,emo:emo||((t>>6)%2?'smug':'happy'),officer:1,gun:null,item:k%2?'case':null});
 if(t>36)drawBubble(say,318,92)}}
const STORY=[
 {date:'JAN 1949',place:'NATIONALIST HQ',art:paperArt(0,'WAR GOING WELL,','SAYS RADIO','40,000','WE ARE WINNING!'),
  fact:'The radio says the war is going well. The radio is ours. You get a squad, a map, and a suitcase of Gold Yuan.',
  joke:'The suitcase is one week of pay. By Friday it will buy the suitcase.'},
 {date:'MAR 1949',place:'THE PADDIES',art:paperArt(1,'VILLAGE WELL','SECURED!','300,000','TURNING POINT!'),
  fact:'The papers call the village well a turning point. The well was dry. Next: a road through the rice paddies.',
  joke:'Your pay doubles. The price of a bun triples. Morale is a bun.'},
 {date:'APR 1949',place:'THE RIVER',art:paperArt(2,'PADDY ROAD OPEN!','VICTORY NEAR!','5 MILLION','VERY NEAR!'),
  fact:'The enemy crosses the great river somewhere else. You are sent to hold a small bridge, to keep the map busy.',
  joke:'The bridge is not important. That is why they can spare you.'},
 {date:'MAY 1949',place:'THE MOUNTAINS',art:paperArt(3,'BRIDGE HELD!','ENEMY BAFFLED!','80 MILLION','THEY ARE BAFFLED.'),
  fact:'You held the bridge. The city behind it changed hands anyway. You are ordered to advance toward the rear.',
  joke:'The route is a snowy mountain pass. HQ calls it a shortcut. HQ is not walking it.'},
 {date:'OCT 1949',place:'THE AIRFIELD',art:paperArt(4,'WITHDRAWAL','A SUCCESS!','2 BILLION','A GREAT SUCCESS.','determined'),
  fact:'The last transport plane is loading the gold, the archives and a general\'s piano. You will guard it.',
  joke:'Seats for soldiers will be on the next plane. There is no next plane.'},
 {date:'DEC 1949',place:'THE DOCKS',art:paperArt(5,'PLANE DEPARTS','ON TIME!','???','THE GOLD IS SAFE!','determined'),
  fact:'The plane got away. You did not. One ferry is left, and an enemy tank sits between you and the gangway.',
  joke:'HQ radios: "Retake the docks. We will hold the ferry for you." HQ is on the ferry.'}];
/* ---------------- campaign ending: you won, the war did not ---------------- */
let endI=0,endT=0,endFull=false,PAGES=[],pgDone=null,pgCard=false;
function runPages(pages,done,card,mus){state='ending';PAGES=pages;pgDone=done;pgCard=card;endI=0;endT=0;endFull=false;music(mus);const tu=document.getElementById('touch');if(tu)tu.hidden=true}
function startEnding(){runPages(FINPAGES,endDone,true,'ending')}
function startStory(k){if(!STORY[k]){startMission(k);return}runPages([STORY[k]],()=>startMission(k),false,'m3')}
function endAdvance(){if(state!=='ending'||endT<20)return;const pg=PAGES[endI];if(!pg){if(endT>60)pgDone();return}
 if(!endFull){endT=9999;return}endI++;endT=0;endFull=false;SFX.tally&&SFX.tally();if(!PAGES[endI]&&!pgCard)pgDone()}
function enSky(a,b,h=136){const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,a);g.addColorStop(1,b);ctx.fillStyle=g;ctx.fillRect(0,0,W,h)}
function enSea(t,y,h=136){r(0,y,W,h-y,'#1f3656');r(0,y,W,1,'#4a6a90');for(let i=0;i<26;i++)r(((i*37+t*.6)%(W+24))-12,y+3+(i%6)*Math.max(2,(h-y-4)/6),8+(i%3)*3,1,'#4a6a90')}
function enIsland(x,y,flag){r(x,y-6,96,7,'#33503a');r(x+8,y-12,62,7,'#3e5e3a');r(x+22,y-17,30,6,'#4a6a3a');r(x+74,y-34,2,28,'#5a3a20');r(x+64,y-36,22,3,'#3a6a2a');r(x+68,y-39,14,3,'#4a7a3a');
 if(flag){r(x+56,y-42,1,30,'#3a2a20');r(x+57,y-42,15,10,'#b8322a');r(x+57,y-42,8,6,'#2f4f8a');r(x+60,y-40,2,2,'#f2f2f2')}}
function enShip(x,y,t){y=Math.round(y+Math.sin(t/14));r(x+4,y,112,4,'#2a2222');r(x,y-10,120,10,'#3a3030');r(x-6,y-14,12,6,'#3a3030');r(x+112,y-14,12,6,'#3a3030');r(x,y-11,120,1,'#6a5a4a');
 r(x+18,y-24,74,14,'#d9cfb8');r(x+18,y-24,74,2,'#a8977c');for(let i=0;i<6;i++)r(x+23+i*11,y-20,6,5,'#2a3a4a');r(x+72,y-40,12,16,'#2f4f8a');r(x+72,y-40,12,3,'#120d0c');r(x+76,y-34,4,4,'#f2f2f2');
 for(let k=0;k<4;k++){const s=(t*.4+k*12)%48;ctx.globalAlpha=Math.max(0,.6-s/90);r(x+74-s*.6,y-46-s*.5,4+k,3+k,'#5a5a64');ctx.globalAlpha=1}}
function enGold(x,y){r(x,y-9,16,9,'#7a5a2a');r(x,y-9,16,2,'#d9a441');hanV('金',x+8,y-8,'#ffd24a',7)}
function enSign(s,x,y,c='#e9dcc2'){const w=s.length*8+6;r(x-w/2,y,w,12,c);r(x-1,y+12,2,10,'#5a3a20');ctx.font=F;ctx.textAlign='center';ctx.textBaseline='top';ctx.fillStyle='#120d0c';ctx.fillText(s,x,y+2)}
function renderEnding(){ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);const pg=PAGES[endI];if(!pg){if(pgCard)renderEndCard(endT);return}
 ctx.save();ctx.beginPath();ctx.rect(0,0,W,136);ctx.clip();pg.art(endT);ctx.restore();ctx.drawImage(VIG,0,0);
 r(0,136,W,H-136,'#120d0c');r(0,136,W,2,'#d9a441');txt(pg.date,8,141,'#d9a441');txt(pg.place,W-8,141,'#a8977c','right');
 if(LANG==='zh'){const fz=tr(pg.fact),jz=tr(pg.joke);let sz=12,LH=14,fl,jl;for(;;){ctx.font=`500 ${sz}px ${ZFAM}`;fl=wrapPx(fz,W-16);jl=wrapPx(jz,W-16);if((fl.length+jl.length)*LH+3<=H-153||sz<=10)break;sz--;LH--}
  const shown=Math.floor(endT*.7);let n=0;ctx.textAlign='left';ctx.textBaseline='middle';
  fl.forEach((l,i)=>{ctx.fillStyle='#e9dcc2';ctx.fillText(l.slice(0,Math.max(0,shown-n)),8,152+i*LH+LH/2);n+=l.length});
  jl.forEach((l,i)=>{ctx.fillStyle='#ff9a6a';ctx.fillText(l.slice(0,Math.max(0,shown-n)),8,155+(fl.length+i)*LH+LH/2);n+=l.length});
  ctx.textBaseline='top';endFull=shown>n}
 else{const shown=Math.floor(endT*1.4),fl=wrap(pg.fact,46),jl=wrap(pg.joke,46);let n=0;ctx.font=F;ctx.textAlign='left';ctx.textBaseline='top';
 fl.forEach((l,i)=>{ctx.fillStyle='#e9dcc2';ctx.fillText(l.slice(0,Math.max(0,shown-n)),8,153+i*10);n+=l.length+1});
 jl.forEach((l,i)=>{ctx.fillStyle='#ff9a6a';ctx.fillText(l.slice(0,Math.max(0,shown-n)),8,155+fl.length*10+i*10);n+=l.length+1});
 endFull=shown>n}if(endFull&&T%40<26)txt('▶',W-16,H-12,'#d9a441')}
function renderEndCard(t){enSky('#070a18','#1c2444',H);for(let i=0;i<40;i++)r((i*53+7)%W,(i*29)%120,1,1,i%3?'#5a5a7a':'#e9dcc2');
 r(0,158,64,14,'#14141c');r(0,150,36,8,'#14141c');r(40,154,14,4,'#14141c');enSea(t,170,H);enIsland(250,174,1);
 r(352,130,12,38,'#b8322a');hanV('反攻',358,132,'#f1d27a',9);r(352,150,12,1,'#7a1a14');hanV('大陸',358,152,'#f1d27a',7);
 drawSoldier(290,158,{fac:'kmt',face:-1,emo:(t>>6)%2?'determined':'smug',gun:null});r(278,140,10,2,'#8a7a5a');r(276,139,3,4,'#5a4a3a');
 stxt('THE END',W/2,22,'#ffd24a',22);txt('(TEMPORARY)',W/2,38,'#a8977c','center');
 const yr=1950+Math.min(76,Math.floor(t/12));r(W/2-112,52,224,44,'#e9dcc2');r(W/2-112,52,224,3,'#2f4f8a');ctx.strokeStyle='#120d0c';ctx.strokeRect(W/2-111.5,52.5,223,43);
 ink('COUNTERATTACK THE MAINLAND:',W/2,59,'#120d0c','center');ink('NEXT YEAR.',W/2,71,'#b8322a','center');ink(LZ('FORECAST ISSUED: '+yr,'預報發布：'+yr+' 年'),W/2,84,'#5a4a3a','center');
 FINCARD().forEach((l,i)=>txt(l,W/2,102+i*(LANG==='zh'?13:11),i?'#a8977c':'#d9a441','center'));
 if(t>60&&(T>>5)%2)txt(touchUI?'TAP TO RETURN':'ENTER TO RETURN',W/2,H-12,'#a8977c','center')}
const FINPAGES=[
 {date:'DEC 1949',place:'HEADQUARTERS',art:t=>{r(0,0,W,136,'#4a3a30');for(let x=0;x<W;x+=24)r(x,0,1,136,'#3e3028');r(0,104,W,32,'#3a2a22');
   r(150,10,150,84,'#c8b890');r(150,10,150,3,'#8a7a5a');ctx.strokeStyle='#120d0c';ctx.strokeRect(150.5,10.5,149,83);r(180,20,60,62,'#a89a70');r(240,30,30,50,'#b0a478');
   const k=Math.min(1,t/120);for(let i=0;i<3;i++){const x0=200+i*22,y0=16,y1=16+60*k;seg(x0,y0,x0+6,y1,3,'#c8372d');r(x0+3,y1,5,5,'#c8372d')}
   for(let i=0;i<6;i++)stxt('★',164+i*24,74+(i%2)*8,'#ffd24a',9);txt('YOUR VICTORIES',225,84,'#2f4f8a','center');
   drawSoldier(108,112,{fac:'kmt',face:1,emo:(t>>5)%2?'smug':'happy',officer:1,gun:null});seg(124,98,152,74,2,'#5a3a20');
   const cx=20+((t*.5)%90);drawSoldier(cx,120,{fac:'kmt',face:1,pose:'run',anim:t,emo:'scared',gun:null});r(cx+10,92,24,16,'#8a6a3a');if(LANG==='zh')ink('稍後歸檔',cx+22,97,'#120d0c','center',4);else{ink('FILE',cx+14,96,'#120d0c','left',5);ink('LATER',cx+12,102,'#120d0c','left',5)}
   r(320,96,40,12,'#7a5a2a');r(330,84,20,12,'#7a5a2a');enGold(320,96)},
  fact:'You won all six battles. Headquarters is delighted. Headquarters is also packing.',
  joke:'It turns out the war was being lost somewhere else. Everywhere else, mostly.'},
 {date:'DEC 1949',place:'THE FINAL REPORT',art:t=>{r(0,0,W,136,'#4a3426');for(let y=5;y<136;y+=9)r(0,y,W,1,'#3e2a1e');
   r(96,6,180,126,'rgba(0,0,0,.45)');r(92,2,180,126,'#e4d8bc');
   ink('CAMPAIGN REPORT',182,8,'#120d0c','center');r(98,18,168,1,'#120d0c');
   [['BATTLES FOUGHT','6'],['BATTLES WON','6'],['BATTLES LOST','0'],['WAR STATUS','']].forEach(([l,v],i)=>{ink(l,100,24+i*12);ink(v,252,24+i*12)});
   const stamp=(s,x,y,a,rot,c)=>{if(a<=0)return;s=tr(s);const z=CJK_RE.test(s);ctx.save();ctx.globalAlpha=Math.min(1,a);ctx.translate(x,y);ctx.rotate(rot);ctx.font=z?`700 13px ${ZFAM}`:F;const w=z?Math.ceil(ctx.measureText(s).width)+10:s.length*8+8;ctx.strokeStyle=c;ctx.lineWidth=2;ctx.strokeRect(-w/2,-8,w,16);ctx.fillStyle=c;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s,0,1);ctx.restore()};
   stamp('STRATEGIC',182,82,(t-30)/6,-.08,'#b8322a');stamp('RELOCATION',186,100,(t-36)/6,-.08,'#b8322a');
   stamp('TEMPORARY',150,120,(t-80)/6,.1,'#2f4f8a');stamp('VERY',236,64,(t-120)/6,.18,'#2f4f8a');
   if(t===30||t===80||t===120)SFX.hit();
   drawSoldier(318,124,{fac:'kmt',face:-1,emo:'smug',officer:1,gun:null});r(306,98,8,10,'#5a3a20');r(304,108,12,3,'#b8322a');
   drawSoldier(30,124,{fac:'kmt',face:1,emo:t>140?'cry':'normal',gun:'rifle'})},
  fact:'The official report calls the end of the war a "strategic relocation". A temporary relocation. A very temporary one.',
  joke:'The word "lost" does not appear anywhere. The paperwork, at least, is undefeated.'},
 {date:'DEC 1949',place:'THE LAST FERRY',art:t=>{enSky('#1a2238','#7a5a6a',96);enSea(t,96);r(0,104,140,32,'#4a4643');r(0,102,140,3,'#6a6560');
   enShip(196,116,t);for(let i=0;i<4;i++)enGold(222+i*18,92);r(134,100,66,3,'#8a6a42');
   for(let i=0;i<5;i++){const x=20+i*22+Math.min(60,t*.25);drawSoldier(x,104,{fac:'kmt',face:1,pose:'run',anim:t+i*6,emo:i===4?'cry':'determined',gun:'rifle',officer:i===0,item:i===0?'case':null})}},
  fact:'The government retreats to Taiwan. Your squad boards the last ferry, from the docks you just won.',
  joke:'The gold reserves went ahead first, with an escort. Your medals come with a receipt.'},
 {date:'DEC 1949',place:'ON THE FERRY',art:t=>{enSky('#2a3450','#a06a5a',80);enSea(t,80);r(0,74,70,6,'#3a3a3a');r(10,70,30,4,'#3a3a3a');
   r(0,100,W,36,'#6a4a2a');for(let x=0;x<W;x+=16)r(x,100,1,36,'#5a3a20');r(0,96,W,2,'#8a6a42');for(let x=4;x<W;x+=14)r(x,88,2,10,'#8a6a42');r(0,88,W,2,'#8a6a42');
   for(let i=0;i<2;i++){r(150+i*26,104,22,18,'#8a7a5a');r(150+i*26,104,22,3,'#6a5a3a');hanV('金圓',161+i*26,107,'#5a2a14',7)}
   drawSoldier(204,124,{fac:'kmt',face:-1,emo:'happy',officer:1,gun:null,item:'case'});
   for(let i=0;i<3;i++)drawSoldier(40+i*30,126,{fac:'kmt',face:1,pose:i===1?'sit':'idle',emo:['normal','sleep','scared'][i],gun:null});
   drawSoldier(260,126,{fac:'kmt',face:-1,emo:t>110?'cry':'normal',gun:null});
   for(let i=0;i<8;i++){const k=((t*.7+i*23)%140)/140,x=230+k*150+Math.sin(t/9+i)*6,y=110-k*80+Math.sin(t/7+i*2)*4;if(t>40)r(x,y,5,3,i%2?'#d8c890':'#c8d8a0')}
   const gx=330+Math.sin(t/20)*20,gy=24+Math.sin(t/13)*4;r(gx,gy,6,3,'#f2f2f2');r(gx-4,gy-2,4,2,'#d8d8d8');r(gx+6,gy-2,4,2,'#d8d8d8');
   if(t>20&&t<110)drawBubble('BACK PAY! A FULL YEAR!',200,84);if(t>=110)drawBubble('CAN I EAT IT?',262,84)},
  fact:'Payday on the ferry. The paymaster hands out a full year of back pay in Gold Yuan. It fills two sacks.',
  joke:'The squad offers both sacks to a seagull for one fish. The seagull declines.'},
 {date:'1950',place:'TAIWAN (TEMPORARY)',art:t=>{enSky('#4a6a90','#e0a070',90);enSea(t,90);enIsland(10,104,1);r(150,98,W-150,38,'#5a6a3a');r(150,96,W-150,3,'#6a7a4a');
   for(let i=0;i<4;i++)drawSoldier(170+i*24,128,{fac:'kmt',face:1,pose:'sit',emo:i===1?'sleep':'normal',gun:null});
   drawSoldier(290,124,{fac:'kmt',face:-1,emo:'happy',officer:1,item:'case',gun:null});r(310,60,58,40,'#e9dcc2');r(310,60,58,8,'#c8372d');txt('PLAN',339,61,'#e9dcc2','center');
   ink(String(1950+Math.min(9,(t/50)|0)),339,72,'#120d0c','center');ink('GO',339,84,'#b8322a','center');
   if(t>40)drawBubble('NEXT YEAR, LADS!',236,76)},
  fact:'The government settles in, temporarily. Very temporarily. The counterattack on the mainland is set for next year.',
  joke:'Every year, it stays scheduled for next year. So does your pay.'},
 {date:'NEXT YEAR',place:'CREDITS',art:t=>{enSky('#05070f','#141a30',136);for(let i=0;i<30;i++)r((i*61+11)%W,(i*23)%70,1,1,i%4?'#4a4a6a':'#c8c8d8');enSea(t,112);
   r(18,100,64,10,'#0a0a10');r(30,92,30,8,'#0a0a10');r(48,82,6,10,'#0a0a10');r(52,78,4,4,(T>>4)%2?'#ffd24a':'#5a4a20');
   const C=LANG==='zh'?CREDITS_ZH:CREDITS_EN,y0=118-t*.32;for(let i=0;i<C.length;i++){const y=y0+i*30;if(y<-24||y>112)continue;
    if(i===0){stxt(C[i][0],W/2+40,y+8,'#ffd24a',14)}else{txt(C[i][0],W/2+40,y,'#a8977c','center');txt(C[i][1],W/2+40,y+11,'#e9dcc2','center')}}
   ctx.globalAlpha=.85;r(0,0,W,8,'#05070f');ctx.globalAlpha=1},
  fact:'The credits were paid in Gold Yuan. Each name cost about one bun.',
  joke:'Thank you for playing. Please keep your ticket: the return trip is scheduled for next year.'}];
const CREDITS_EN=[['PAPER GENERALS 1949'],['STRATEGY','HEADQUARTERS (ON THE FERRY)'],['PAYROLL','GOLD YUAN (VALUE MAY VARY)'],['LEAFLETS','THE OTHER SIDE'],['AIR SUPPORT','ONE PIANO'],['MORALE','ONE BUN (SHARED)'],['FINANCIAL ADVICE','A SEAGULL'],['GENERALS HARMED','NONE. THEY LEFT EARLY.'],['THE SQUAD','YOU'],['RETURN TRIP','NEXT YEAR']];
const CREDITS_ZH=[['紙上將軍 1949'],['戰略指導','總部（已登船）'],['軍餉','金圓券（幣值僅供參考）'],['傳單','對面那邊'],['空中支援','一架鋼琴'],['士氣','包子一顆（大家分）'],['理財顧問','一隻海鷗'],['受傷的將軍','零。他們提早離開了。'],['小隊','你'],['回程','明年']];
function FINCARD(){const sv=store.get(SAVEK,{})||{};let st=0;for(let i=0;i<MISSIONS.length;i++)st+=sv[S+i]||0;const g=sv.tot||{kills:0,turned:0,lost:0},n=MISSIONS.length;
 return[LZ('BATTLES WON: '+n+' OF '+n+' · WARS WON: 0 OF 1','勝場：'+n+'／'+n+' · 打贏的戰爭：0／1'),LZ('ENEMIES DOWN '+g.kills+' · TURNED '+g.turned+' · LOST '+g.lost,'擊斃 '+g.kills+' · 策反 '+g.turned+' · 損失 '+g.lost),LZ('STARS '+st+'/'+n*3+' · REDEEMABLE ON THE MAINLAND','星星 '+st+'／'+n*3+' · 限大陸兌換')]}
function endDone(){state='missions';music('m3')}
/* ---------------- zh-TW strings (English source -> 繁體中文) ---------------- */
const ZT={
 RIFLEMAN:'步槍兵','MACHINE GUN':'機槍手',GRENADIER:'擲彈兵',SCOUT:'斥候',PAYMASTER:'軍需官',TANK:'戰車',
 'THE VILLAGE WELL':'村口水井','THE PADDY ROAD':'稻田小路','THE BRIDGE':'那座橋','THE SNOW PASS':'雪中山口','THE LAST PLANE':'最後一班飛機','THE LAST FERRY':'最後一班渡輪',
 'The village has a well. The bandits have the well.':'村子裡有一口井。井在土匪手上。','Take the well. Then tax the water.':'搶下水井。然後開徵水稅。',
 'A machine gun covers the only dry road.':'唯一一條乾的路，被一挺機槍盯著。','Paddies are slow. So is the payroll.':'稻田很難走。發餉也是。',
 'Hold the bridge for eight turns.':'守住橋，撐八個回合。','Headquarters promises reinforcements. Headquarters promises a lot.':'總部保證會派援軍。總部保證過很多事。',
 'Get one soldier through the pass. Any soldier.':'讓一個人穿過山口就好。誰都行。','The report will say it was a strategic withdrawal.':'報告上會寫：戰略性撤退。',
 'The last transport plane is loading.':'最後一班運輸機正在裝貨。','Cargo: the gold, the files, a piano.':'貨物：黃金、檔案、一架鋼琴。','Seats for soldiers: on the next plane.':'士兵座位：請搭下一班。',
 'FINAL BATTLE. The enemy holds the docks':'最終決戰。共軍佔領了碼頭，','with a tank they took from us. More are coming.':'開的還是從我們這搶走的戰車。後面還有援軍。','Clear the docks. The last ferry waits. Mostly.':'肅清碼頭。最後一班渡輪會等你。大概吧。',
 'THE GOLD IS LOADED. HOLD ON.':'黃金已經上機。撐住。','THE ARCHIVES ARE LOADED. HOLD ON.':'檔案已經上機。撐住。','A PIANO IS BEING LOADED. HOLD ON.':'鋼琴正在上機。撐住。','THE PIANO DOES NOT FIT. HOLD ON.':'鋼琴塞不進去。撐住。','THE PIANO FITS. THE PILOT DOES NOT.':'鋼琴塞進去了。飛行員塞不進去。','ENGINES RUNNING. NO SEATS LEFT. HOLD ON.':'引擎發動了。沒位子了。撐住。',
 'THE FERRY HORN SOUNDS. THE GOLD HAS BOARDED.':'渡輪鳴笛。黃金已經登船。','THE BAND HAS BOARDED. THEY ARE PLAYING.':'軍樂隊已登船，正在演奏。','HQ HAS BOARDED. HQ SAYS HOLD THE DOCKS.':'總部已登船。總部說：守住碼頭。','THE PAYMASTER IS ON BOARD. HE WAVES.':'軍需官在船上了。他在揮手。','THE FERRY IS WARMING UP. SO IS THE ENEMY.':'渡輪在熱機。共軍也是。','LAST CALL. THE CAPTAIN IS COUNTING SEATS.':'最後登船廣播。船長在數座位。',
 'CLICK A SOLDIER. BLUE TILES = MOVE. MARKED ENEMY = FIRE.':'點選士兵。藍格＝移動，框起來的敵人＝開火。','YOUR TURN.':'輪到你了。','ENEMY TURN.':'共軍回合。','YOUR TURN. MORE ENEMIES ARE COMING.':'輪到你了。更多共軍正在趕來。','THE TANK IS DONE.':'戰車解決了。','OUT OF RANGE. MOVE CLOSER.':'射程不夠，再靠近一點。',
 MISS:'沒中','MORALE -3':'士氣 -3','IGNORED':'不理你','MORALE +1':'士氣 +1','MORALE +3':'士氣 +3','REINFORCEMENT':'增援',
 'PAID IN GOLD YUAN! SPEND IT FAST!':'發餉了！金圓券！快花掉！','BONUS: ONE MILLION! (A BUN)':'獎金一百萬！（一顆包子）','PAYDAY! IT IS ALREADY LESS!':'發薪日！已經又貶值了！',
 'STUDY SESSION! MORALE UP!':'開學習會！士氣上升！','SELF-CRITICISM COMPLETE!':'自我批評完畢！','WE SING A SONG ABOUT MILLET!':'來唱一首小米之歌！',
 'SURRENDER! WE HAVE RICE!':'投降吧！我們有米！','COME OVER! PAY IN GOLD YUAN!':'過來吧！薪水發金圓券！','AMERICA IS COMING! (SOON)':'美國要來了！（快了）',
 'COME OVER! WE HAVE LAND!':'過來吧！我們分田地！','YOUR MONEY IS TOILET PAPER!':'你們的錢是衛生紙！','WE HAVE MILLET AND FORMS!':'我們有小米，還有表格！',
 'I SURRENDER! I CAME FOR THE FOOD':'我投降！我是來吃飯的','DEFECTING! WHERE DO I SIGN?':'我要投誠！在哪裡簽名？','I SWITCH! SAME WAR, BETTER RICE?':'換邊！一樣打仗，飯比較好吃？','MY OFFICER LEFT. SO DO I.':'長官跑了，我也跑。','MY WHOLE UNIT IS COMING. WE VOTED.':'全連都要過來。我們投票表決過了。',
 HP:'體力',MOR:'士氣','NO MORALE.':'沒有士氣。',DONE:'已行動',MOVED:'已移動',READY:'待命','NO ONE':'尚未選取',SELECTED:'士兵',
 'R RALLY':'R 發餉打氣','L LEAFLETS':'L 撒傳單','W HOLD':'W 原地待命','E END TURN':'E 結束回合','ENEMY TURN':'共軍回合','ROUT THE ENEMY':'擊潰敵軍','REACH THE FLAG':'抵達旗子',
 'FINAL BATTLE':'最終決戰','ROUT ALL ENEMY WAVES':'擊潰所有共軍梯隊','GET ONE SOLDIER TO THE FLAG':'讓一名士兵抵達旗子',SHAKY:'動搖',TIRED:'疲憊',STEADY:'穩定',
 'TAP TO DEPLOY':'點一下出擊','CLICK OR ENTER TO DEPLOY':'點擊或按 Enter 出擊',VICTORY:'勝利',DEFEAT:'敗北',
 'You hold the docks. A decisive Nationalist victory!':'碼頭拿下了。國軍決定性的勝利！','Headquarters asks you to hold the ferry door, too.':'總部請你順便幫忙扶住渡輪的門。',
 'The battle report says: decisive. The soldiers say: lunch.':'戰報說：決定性勝利。士兵說：吃飯了沒。','Headquarters sends congratulations, and no rice.':'總部發來賀電。沒發米。','You are promoted. Your pay is now worth slightly less.':'你升官了。薪水又更不值錢了一點。',
 'Your squad has been reorganised. Into the enemy.':'你的小隊被整編了。編進共軍。','Headquarters calls it a tactical relocation.':'總部稱之為「戰術性轉進」。','The leaflets were more convincing than you.':'傳單比你更有說服力。','The plane leaves on time. Without you.':'飛機準時起飛。沒載你。',
 'NATIONALIST CAMPAIGN':'國軍戰役',LOCKED:'未解鎖',FINAL:'決戰',ROUT:'殲敵',HOLD:'死守',REACH:'突圍','TAP A BATTLE':'點選一場戰役','CLICK A BATTLE (OR PRESS 1-6)':'點選戰役（或按 1-6）',
 'JAN 1949':'1949年1月','MAR 1949':'1949年3月','APR 1949':'1949年4月','MAY 1949':'1949年5月','OCT 1949':'1949年10月','DEC 1949':'1949年12月','1950':'1950年',
 'NATIONALIST HQ':'國軍總部','THE PADDIES':'稻田','THE RIVER':'江邊','THE MOUNTAINS':'山區','THE AIRFIELD':'機場','THE DOCKS':'碼頭','HEADQUARTERS':'總部','THE FINAL REPORT':'最終報告','ON THE FERRY':'渡輪上','TAIWAN (TEMPORARY)':'台灣（暫時）',
 'THE CENTRAL DISPATCH':'中 央 快 報',OURS:'我方',MAP:'地圖',
 'WAR GOING WELL,':'戰況良好，','SAYS RADIO':'電台表示','VILLAGE WELL':'村口水井','SECURED!':'成功確保！','PADDY ROAD OPEN!':'稻田公路打通！','VICTORY NEAR!':'勝利在望！','BRIDGE HELD!':'大橋守住了！','ENEMY BAFFLED!':'共軍一頭霧水！','WITHDRAWAL':'轉進行動','A SUCCESS!':'圓滿成功！','PLANE DEPARTS':'專機準時','ON TIME!':'起飛！',
 '40,000':'四萬','300,000':'三十萬','5 MILLION':'五百萬','80 MILLION':'八千萬','2 BILLION':'二十億','???':'？？？',
 'WE ARE WINNING!':'我們贏定了！','TURNING POINT!':'轉捩點！','VERY NEAR!':'非常近了！','THEY ARE BAFFLED.':'他們一頭霧水。','A GREAT SUCCESS.':'非常成功。','THE GOLD IS SAFE!':'黃金很安全！',
 'The radio says the war is going well. The radio is ours. You get a squad, a map, and a suitcase of Gold Yuan.':'電台說戰況良好。電台是我們的。你領到一個小隊、一張地圖，和一皮箱金圓券。',
 'The suitcase is one week of pay. By Friday it will buy the suitcase.':'那一皮箱是一個禮拜的薪餉。到了禮拜五，剛好夠買那個皮箱。',
 'The papers call the village well a turning point. The well was dry. Next: a road through the rice paddies.':'報紙說村口水井是戰局的轉捩點。那口井是乾的。下一站：穿越稻田的小路。',
 'Your pay doubles. The price of a bun triples. Morale is a bun.':'你的薪水加倍了。包子漲了三倍。士氣就是包子。',
 'The enemy crosses the great river somewhere else. You are sent to hold a small bridge, to keep the map busy.':'共軍從別的地方渡江了。你被派去守一座小橋，讓地圖看起來熱鬧一點。',
 'The bridge is not important. That is why they can spare you.':'那座橋一點都不重要。所以才派得出你。',
 'You held the bridge. The city behind it changed hands anyway. You are ordered to advance toward the rear.':'你守住了橋。橋後面的城市還是易手了。上級命令你「向後方前進」。',
 'The route is a snowy mountain pass. HQ calls it a shortcut. HQ is not walking it.':'路線是一條積雪的山口。總部說這是捷徑。總部又不用走。',
 'The last transport plane is loading the gold, the archives and a general\'s piano. You will guard it.':'最後一班運輸機正在裝黃金、檔案，還有某位將軍的鋼琴。由你負責守衛。',
 'Seats for soldiers will be on the next plane. There is no next plane.':'士兵的座位在下一班飛機上。沒有下一班飛機。',
 'The plane got away. You did not. One ferry is left, and an enemy tank sits between you and the gangway.':'飛機飛走了，你沒有。只剩最後一班渡輪，而共軍戰車就停在你和登船梯之間。',
 'HQ radios: "Retake the docks. We will hold the ferry for you." HQ is on the ferry.':'總部來電：「奪回碼頭，渡輪我們幫你們留著。」總部人在渡輪上。',
 'You won all six battles. Headquarters is delighted. Headquarters is also packing.':'你六場戰役全勝。總部非常高興。總部也在打包。',
 'It turns out the war was being lost somewhere else. Everywhere else, mostly.':'原來仗是在別的地方輸掉的。主要是「其他所有地方」。',
 'The official report calls the end of the war a "strategic relocation". A temporary relocation. A very temporary one.':'官方報告把戰爭的結局稱為「戰略轉進」。暫時性的轉進。非常暫時。',
 'The word "lost" does not appear anywhere. The paperwork, at least, is undefeated.':'整份報告找不到一個「輸」字。至少文書作業是不敗的。',
 'The government retreats to Taiwan. Your squad boards the last ferry, from the docks you just won.':'政府撤退到台灣。你的小隊從剛剛打贏的碼頭，登上最後一班渡輪。',
 'The gold reserves went ahead first, with an escort. Your medals come with a receipt.':'國庫黃金早就在護送下先走了。你的勳章附收據一張。',
 'Payday on the ferry. The paymaster hands out a full year of back pay in Gold Yuan. It fills two sacks.':'渡輪上發餉。軍需官一口氣補發一整年的欠餉，全是金圓券，裝滿兩麻袋。',
 'The squad offers both sacks to a seagull for one fish. The seagull declines.':'弟兄們想拿兩袋錢跟海鷗換一條魚。海鷗拒絕了。',
 'The government settles in, temporarily. Very temporarily. The counterattack on the mainland is set for next year.':'政府暫時安頓下來。暫時。非常暫時。反攻大陸預定明年發動。',
 'Every year, it stays scheduled for next year. So does your pay.':'每一年，都是預定明年。你的薪水也是。',
 'YOUR VICTORIES':'你的戰果','CAMPAIGN REPORT':'戰 役 報 告','BATTLES FOUGHT':'參戰場次','BATTLES WON':'勝場','BATTLES LOST':'敗場','WAR STATUS':'戰爭結果',
 STRATEGIC:'戰略',RELOCATION:'轉進',TEMPORARY:'暫時',VERY:'非常','BACK PAY! A FULL YEAR!':'補發欠餉！整整一年！','CAN I EAT IT?':'這個能吃嗎？',PLAN:'計畫',GO:'出發','NEXT YEAR, LADS!':'弟兄們，明年就回去！',
 'THE END':'劇終','NEXT YEAR':'明年',CREDITS:'工作人員名單','The credits were paid in Gold Yuan. Each name cost about one bun.':'片尾名單一律以金圓券支付，每個名字大約值一顆包子。','Thank you for playing. Please keep your ticket: the return trip is scheduled for next year.':'感謝遊玩。請收好船票：回程預定明年出發。','(TEMPORARY)':'（暫時）','COUNTERATTACK THE MAINLAND:':'反攻大陸：','NEXT YEAR.':'明年。','TAP TO RETURN':'點一下返回','ENTER TO RETURN':'按 Enter 返回'};
const ZRANK={'PVT.':'二兵','CPL.':'下士','SGT.':'中士'},ZSUR={LI:'李',WANG:'王',ZHANG:'張',LIU:'劉',CHEN:'陳',YANG:'楊',ZHAO:'趙',HUANG:'黃',ZHOU:'周',WU:'吳',XU:'徐',SUN:'孫',MA:'馬',ZHU:'朱',HU:'胡',GUO:'郭',HE:'何',LIN:'林',LUO:'羅',GAO:'高'};
const ZRX=[[/^(PVT\.|CPL\.|SGT\.) ([A-Z]+)$/,m=>ZRANK[m[1]]+' '+(ZSUR[m[2]]||m[2])],[/^(.+) IS DOWN\.$/,m=>tr(m[1])+' 倒下了。'],[/^(.+) DEFECTED TO THE ENEMY\.$/,m=>tr(m[1])+' 投共了。'],
 [/^(.+) JOINS YOUR SQUAD\.$/,m=>tr(m[1])+' 投誠，加入你的小隊。'],[/^(.+) HAS ALREADY ACTED\.$/,m=>tr(m[1])+' 已經行動過了。'],[/^HOLD ON\. TURN (\d+) OF (\d+)\.$/,m=>'撐住。第 '+m[1]+'／'+m[2]+' 回合。'],[/^MORALE \+(\d+)$/,m=>'士氣 +'+m[1]]];
/* CJK-aware overrides of the shared text helpers (English path untouched) */
const _txt=txt,_drawShout=drawShout,_drawBubble=drawBubble;
txt=function(s,x,y,c='#e9dcc2',al='left',font=F){s=tr(String(s));if(!CJK_RE.test(s))return _txt(s,x,y,c,al,font);
 ctx.font=zf(font);ctx.textAlign=al;ctx.textBaseline='middle';const yy=y+(/16px/.test(font)?8:4);
 if(!isDark(c)){ctx.fillStyle='#120d0c';for(const[a,b]of[[1,1],[-1,0],[1,0],[0,-1],[0,1]])ctx.fillText(s,x+a,yy+b)}ctx.fillStyle=c;ctx.fillText(s,x,yy);ctx.textBaseline='top'};
drawShout=function(s,x,y,hero){s=tr(s);if(!CJK_RE.test(s))return _drawShout(s,x,y,hero);
 ctx.font=zf(F);const w=Math.ceil(ctx.measureText(s).width)+10,h=16,jig=hero&&T%6<3?1:0,bx=clamp(x-w/2,4,W-w-4),by=Math.max(26,y-h)+jig,bc=hero?'#c8372d':'#120d0c',fc=hero?'#fff4d0':'#d8ccb0';
 r(bx-1,by-1,w+2,h+2,bc);r(bx,by,w,h,fc);const tx=clamp(x-1,bx+3,bx+w-6);r(tx,by+h+1,3,3,fc);
 ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillStyle=hero?'#c8372d':'#3a2a20';ctx.fillText(s,bx+5,by+h/2+1);ctx.textBaseline='top'};
drawBubble=function(s,x,y){s=tr(s);if(!CJK_RE.test(s))return _drawBubble(s,x,y);
 ctx.font=zf(F);const L=wrapPx(s,150),w=Math.ceil(Math.max(...L.map(l=>ctx.measureText(l).width)))+10,h=L.length*13+6;
 let bx=clamp(x-w/2,4,W-w-4),by=Math.max(28,y-h);r(bx,by,w,h,'#e9dcc2');ctx.strokeStyle='#120d0c';ctx.strokeRect(bx+.5,by+.5,w-1,h-1);
 r(clamp(x-2,bx+4,bx+w-8),by+h,4,3,'#e9dcc2');ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillStyle='#120d0c';L.forEach((l,i)=>ctx.fillText(l,bx+5,by+3+i*13+7));ctx.textBaseline='top'};
/* HTML overlay + buttons */
const ZH_HTML={h1:'紙上將軍<span>1949 · 回合制戰棋 · 六場戰役</span>',rot:'把手機轉橫，戰場會大一點',cont:'繼續作戰',
 tag:'1949年，率領一支國軍小隊打完六場仗：從村口水井，一路打到最後一班渡輪。你發的餉是金圓券，共軍發的是傳單。士氣歸零的士兵會換邊站，你的也一樣。每一仗都打贏，然後看看有什麼用。',
 play:'接掌指揮',keys:'點選士兵，點藍色格子移動，點框起來的敵人開火。手榴彈、發餉打氣、撒傳單在右側面板。<br>鍵盤：方向鍵＋Enter，Tab 換下一位，G R L W 使用技能，E 結束回合，Esc 取消。',
 fine:'諷刺作品。士氣是一種資源。嚴格來說，敵人也是。進度自動存檔。'};
const EN_HTML={};document.querySelectorAll('[data-t]').forEach(el=>EN_HTML[el.dataset.t]=el.innerHTML);EN_HTML.cont='CONTINUE THE WAR';
const hasSave=()=>((store.get(SAVEK,{})||{})[S+'max']||0)>0;
function sndLabel(){const b=$('#bSnd');b.textContent=LANG==='zh'?(muted?'靜音':'音效'):(muted?'MUTE':'SND')}
function applyLang(l,save){LANG=l==='en'?'en':'zh';const zh=LANG==='zh';if(save)try{localStorage.setItem(LANG_KEY,LANG)}catch(e){}
 document.documentElement.lang=zh?'zh-Hant':'en';document.title=zh?'紙上將軍 1949 Paper Generals':'Paper Generals 1949';
 document.querySelectorAll('[data-t]').forEach(el=>{const k=el.dataset.t;el.innerHTML=zh&&ZH_HTML[k]!=null?ZH_HTML[k]:EN_HTML[k]});
 if(hasSave())$('#bPlay').innerHTML=zh?ZH_HTML.cont:EN_HTML.cont;
 if(touchUI)$('[data-t=keys]').innerHTML=zh?'點選士兵，點藍色格子移動，點框起來的敵人開火。<br>手榴彈、發餉打氣、撒傳單和「結束回合」都在右側面板。':'Tap a soldier, tap a blue tile to move, tap a marked enemy to fire.<br>Grenades, Rally, Leaflets and END TURN are in the side panel.';
 document.querySelectorAll('.lang button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.l===LANG)));
 for(const id of['bLang','bLangT']){const b=$('#'+id);if(b){b.textContent=zh?'EN':'中文';b.lang=zh?'en':'zh-Hant';b.setAttribute('aria-label',zh?'Switch to English':'切換為中文')}}
 cv.setAttribute('aria-label',zh?'紙上將軍遊戲畫面':'Paper Generals game screen');
 $('#bPause').textContent=zh?'地圖':'MAP';$('#bPause').setAttribute('aria-label',zh?'回到戰役地圖':'Back to battle map');
 sndLabel();$('#bSnd').setAttribute('aria-label',zh?'切換音效':'Toggle sound');
 if(zh&&document.fonts)document.fonts.load(zf(F),'國軍').catch(()=>{})}
/* ---------------- update ---------------- */
function update(){T++;if(state==='ending')endT++;if(shake>0)shake--;
 for(const w of waits.slice()){if(--w.n<=0){waits.splice(waits.indexOf(w),1);w.res()}}
 for(const u of U){if(u.muzz>0)u.muzz--;if(u.flash>0)u.flash--;if(u.surrT>0)u.surrT--;if(u.dead)u.dieT++}
 for(const f of fx){f.l--;if(f.k==='p'){f.x+=f.vx;f.y+=f.vy;f.vy+=.12}if(f.k==='gr'||f.k==='lf')f.t++}fx=fx.filter(f=>f.l>0&&(f.k!=='gr'||f.t<f.l));
 for(const p of pops)p.t++;pops=pops.filter(p=>p.t<60);for(const s of shouts)s.t++;shouts=shouts.filter(s=>s.t<90)}
/* ---------------- input ---------------- */
let touchUI=matchMedia('(pointer:coarse)').matches;
function pt(e){const rc=cv.getBoundingClientRect();const x=(e.clientX-rc.left)/rc.width*W,y=(e.clientY-rc.top)/rc.height*H;return{x,y,tx:Math.floor((x-BX)/TW),ty:Math.floor((y-BY)/TH)}}
const inB=(b,p)=>p.x>=b.x&&p.x<=b.x+b.w&&p.y>=b.y&&p.y<=b.y+b.h;
function proceed(){if(state==='brief'){state='play';SFX.whistle();if(kbd)autoSelect();return true}if(state==='end'){if(result==='win'&&mi===MISSIONS.length-1){startEnding();return true}if(result==='win'){startStory(mi+1);return true}state='missions';music('m3');return true}return false}
function pressAt(p){initAudio();
 if(state==='ending'){endAdvance();return}
 if(state==='missions'){for(const b of mBtns)if(inB(b,p)){startMission(b.i);return}return}
 if(proceed())return;if(state!=='play')return;
 for(const b of pBtns)if(inB({x:b.x-2,y:b.y-1,w:b.w+4,h:b.h+2},p)){if(b.k==='end')endTurn();else doAbility(b.k);return}
 if(inG(p.tx,p.ty)){cur.x=p.tx;cur.y=p.ty;clickTile(p.tx,p.ty)}}
cv.addEventListener('pointerdown',e=>{kbd=false;if(e.pointerType==='touch')touchUI=true;else if(e.pointerType==='mouse')touchUI=false;pressAt(pt(e))});
cv.addEventListener('pointermove',e=>{const p=pt(e);if(state==='missions'){const b=mBtns.find(b=>inB(b,p));hov=b?{m:b.i}:null;return}hov=inG(p.tx,p.ty)?{x:p.tx,y:p.ty}:null});
addEventListener('keydown',e=>{if(state==='title')return;initAudio();const k=e.code;
 if(state==='ending'){if((k==='Enter'||k==='Space')&&!e.repeat){e.preventDefault();endAdvance()}return}
 if(state==='missions'){const sv=store.get(SAVEK,{})||{};if(/^Digit[1-6]$/.test(k)){const i=+k.slice(5)-1;if(i<=(sv[S+'max']||0))startMission(i)}if(k==='Escape'){state='title';applyLang(LANG,false);$('#title').hidden=false;$('#hud').hidden=true;music('off')}if(k==='Enter')startMission(Math.min(MISSIONS.length-1,sv[S+'max']||0));return}
 if((k==='Enter'||k==='Space')&&proceed()){e.preventDefault();return}if(state!=='play')return;kbd=true;
 const mv={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[k];if(mv){e.preventDefault();cur.x=clamp(cur.x+mv[0],0,COLS-1);cur.y=clamp(cur.y+mv[1],0,ROWS-1);hov={x:cur.x,y:cur.y};return}
 if(k==='Enter'||k==='Space'){e.preventDefault();clickTile(cur.x,cur.y);return}
 if(k==='Tab'){e.preventDefault();const r_=alive('p').filter(u=>!u.acted);if(r_.length){const i=(r_.indexOf(sel)+1)%r_.length;selectU(r_[i]);hov={x:cur.x,y:cur.y}}return}
 if(k==='KeyE')endTurn();if(k==='KeyG')doAbility('gren');if(k==='KeyR')doAbility('rally');if(k==='KeyL')doAbility('leaf');if(k==='KeyW')doAbility('wait');
 if(k==='Escape'){if(mode)mode=null;else{sel=null;RCH=null}}});
$('#bPlay').onclick=()=>{initAudio();$('#title').hidden=true;$('#hud').hidden=false;BGD=null;const sv=store.get(SAVEK,{})||{};if(!(sv[S+'max']>0)){startStory(0);return}state='missions';music('m3')};
$('#bPause').onclick=e=>{e.currentTarget.blur();if((state==='play'&&!busy)||state==='brief'||state==='end'||state==='ending'){state='missions';hov=null;music('m3')}};
$('#bSnd').onclick=e=>{initAudio();setMute(!muted);sndLabel();e.currentTarget.blur()};
document.querySelectorAll('.lang button').forEach(b=>b.addEventListener('click',()=>applyLang(b.dataset.l,true)));
$('#bLang').addEventListener('click',e=>{applyLang(LANG==='zh'?'en':'zh',true);e.currentTarget.blur()});
applyLang((()=>{try{const v=localStorage.getItem(LANG_KEY);if(v==='en'||v==='zh')return v}catch(e){}return 'zh'})(),false);
function fit(){const vw=innerWidth,vh=innerHeight,s=Math.min(vw/W,vh/H);cv.style.width=Math.floor(W*s)+'px';cv.style.height=Math.floor(H*s)+'px'}
addEventListener('resize',fit);fit();cv.style.touchAction='none';
let last=performance.now(),acc=0;
function loop(nt){acc+=Math.min(100,nt-last);last=nt;while(acc>=16.67){acc-=16.67;update()}render();requestAnimationFrame(loop)}
(document.fonts?Promise.all([document.fonts.load(F),document.fonts.load(SERIF(20)),document.fonts.load(zf(F),'國軍'),document.fonts.load(zf(F16),'國軍')]):Promise.resolve()).catch(()=>{}).finally(()=>requestAnimationFrame(loop));
