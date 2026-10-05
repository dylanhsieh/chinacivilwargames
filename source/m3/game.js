/* ===================== RATION CRUSH 1949 — a Civil Slug match-3 ===================== */
let T=0,camX=0,S='kmt',EN='ccp',LV=0,skyFlash=0,skyFX=0,state='title';
let plats=[],scorch=[];const L={walls:[60,300],theme:'village',deep:null,weather:null};function groundAt(){return GY}
const VIG=document.createElement('canvas');VIG.width=W;VIG.height=H;{const g=VIG.getContext('2d');const rg=g.createRadialGradient(W/2,H/2,H*.4,W/2,H/2,W*.65);rg.addColorStop(0,'rgba(0,0,0,0)');rg.addColorStop(1,'rgba(6,2,2,.5)');g.fillStyle=rg;g.fillRect(0,0,W,H)}
const SERIF=s=>`900 ${s}px "Noto Serif TC","Songti TC",Georgia,serif`;
function stxt(s,x,y,c,size,a=1,al='center'){ctx.font=SERIF(size);ctx.textAlign=al;ctx.textBaseline='middle';ctx.globalAlpha=a;ctx.fillStyle='#000';ctx.fillText(s,x+1,y+2);ctx.fillStyle=c;ctx.fillText(s,x,y);ctx.globalAlpha=1}
const N=8,TS=23,BX=14,BY=16;
function mk(w,h,fn){const c=document.createElement("canvas");c.width=w;c.height=h;const g=c.getContext("2d");g.imageSmoothingEnabled=false;fn(g);return c}
const R=(g,x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h)};
const KINDS=['rice','bun','tea','bullet','millet','yuan'];
const KNAME={rice:'RICE',bun:'BUNS',tea:'TEA',bullet:'BULLETS',millet:'MILLET',yuan:'GOLD YUAN'};
/* ---------------- tile art ---------------- */
const ICON={};
function mkIcon(k){return mk(20,20,g=>{const X_=(x,y,w,h,c)=>R(g,x,y,w,h,c);
 if(k==='rice'){X_(3,10,14,7,'#e9e4d8');X_(2,9,16,2,'#c8372d');X_(4,16,12,2,'#a8a090');X_(4,5,12,5,'#ffffff');X_(6,3,8,3,'#f4f0e6');X_(7,4,1,1,'#ccc');X_(11,5,1,1,'#ccc')}
 else if(k==='bun'){X_(3,7,14,10,'#f2e6d0');X_(5,5,10,3,'#f6ecda');X_(8,4,4,2,'#e8d8bc');X_(3,15,14,2,'#d8c8a8');X_(7,8,2,2,'#e0d0b0');X_(11,9,2,2,'#e0d0b0')}
 else if(k==='tea'){X_(4,7,12,10,'#3a7a5a');X_(3,8,14,8,'#3a7a5a');X_(16,9,3,2,'#2a5a42');X_(1,9,3,5,'#2a5a42');X_(7,5,6,2,'#2a5a42');X_(9,3,2,2,'#d9a441');X_(6,10,8,1,'#7ab090')}
 else if(k==='bullet'){for(let i=0;i<3;i++){X_(3+i*5,6,4,11,'#c9a040');X_(3+i*5,4,4,3,'#8a6a3a');X_(4+i*5,3,2,1,'#6a4a2a');X_(3+i*5,15,4,2,'#9a7a30')}}
 else if(k==='millet'){X_(4,6,12,12,'#c9a65a');X_(6,4,8,3,'#b8954a');X_(8,2,4,3,'#9c7c3c');for(let i=0;i<6;i++)X_(6+(i*3)%8,8+(i*5)%8,2,2,'#f1d27a')}
 else if(k==='yuan'){X_(2,5,16,11,'#8aa070');X_(2,5,16,1,'#b0c890');X_(4,7,12,7,'#6a8a5a');g.fillStyle='#d9a441';g.font='bold 10px monospace';g.textAlign='center';g.fillText('¥',10,14);X_(15,6,2,2,'#d9a441')}
 else if(k==='tape'){X_(0,8,20,4,'#c8372d');X_(8,0,4,20,'#c8372d');X_(7,7,6,6,'#d9a441')}})}
for(const k of KINDS.concat(['tape']))ICON[k]=mkIcon(k);
/* ---------------- levels ---------------- */
const WEEKS=[
 {who:'kmt',name:'A KMT PATROL',moves:20,goal:{rice:18},kinds:5,line:'Rice for the patrol. Our pay is late, so is your bill.'},
 {who:'ccp',name:'A CCP WORK TEAM',moves:20,goal:{millet:20,tea:10},kinds:5,line:'Millet and tea. We have forms for gratitude.'},
 {who:'kmt',name:'A WARLORD\'S ESCORT',moves:22,goal:{bun:24,bullet:12},kinds:6,line:'Buns for the men. Bullets for the buns.'},
 {who:'ccp',name:'A PROPAGANDA TROUPE',moves:22,goal:{tea:20,rice:20},kinds:6,tape:6,line:'We sing for our supper. The red tape is for your own good.'},
 {who:'kmt',name:'THE TAX COLLECTOR',moves:18,goal:{score:4000},kinds:6,line:'Pay in Gold Yuan. Actually, pay in rice. Gold Yuan is for you.'},
 {who:'ccp',name:'A RETREATING BATTALION',moves:24,goal:{bullet:30,millet:20},kinds:6,tape:8,line:'We are not retreating. We are advancing backwards.'},
 {who:'kmt',name:'GENERAL MA',moves:22,goal:{rice:30,bun:30},kinds:6,tape:10,line:'Feed my men or I write your name on a form.'},
 {who:'ccp',name:'COMMISSAR WEI',moves:20,goal:{tea:25,bullet:25,millet:15},kinds:6,tape:12,line:'Your cooking requires self-criticism. More salt.'},
 {who:'kmt',name:'THE LAST GARRISON',moves:25,goal:{score:12000},kinds:6,tape:12,line:'Cook everything. The boat leaves at dawn.'},
 {who:'ccp',name:'BOTH ARMIES AT ONCE',moves:28,goal:{rice:40,bun:40,millet:30},kinds:6,tape:16,line:'They are both in the kitchen. They are both hungry. Good luck.'}];
/* ---------------- state ---------------- */
let B=[],lvl=0,moves=0,score=0,got={},yuanVal=100,sel=null,drag=null,anim=[],busy=0,fx=[],pops=[],combo=0,emo='normal',result=null,G=null,hint=null,idle=0;
const SAVEK='rationcrush.v1';
function startLevel(i){lvl=i;const Lv=WEEKS[i];moves=Lv.moves;score=0;got={};yuanVal=100;combo=0;result=null;sel=null;fx=[];pops=[];L.theme=['village','paddy','snow','river','city'][i%5];LV=i;buildBG();
 do{B=[];for(let y=0;y<N;y++){B.push([]);for(let x=0;x<N;x++){let k;do{k=KINDS[(rnd()*Lv.kinds)|0]}while((x>1&&B[y][x-1].k===k&&B[y][x-2].k===k)||(y>1&&B[y-1][x].k===k&&B[y-2][x].k===k));B[y].push({k,sp:null,oy:-(N-y)*TS-20,ox:0,tape:0})}}
  let n=Lv.tape||0;while(n>0){const x=(rnd()*N)|0,y=3+((rnd()*(N-3))|0);if(!B[y][x].tape){B[y][x].tape=1;n--}}}while(!anyMove());
 state='play';$('#title').hidden=true;$('#hud').hidden=false;music(['m2','m3','m1'][i%3]);emo='normal'}
const inB=(x,y)=>x>=0&&y>=0&&x<N&&y<N;
function findMatches(){const m=new Set(),runs=[];
 for(let y=0;y<N;y++){let x=0;while(x<N){let e=x;while(e+1<N&&B[y][e+1].k===B[y][x].k)e++;if(e-x>=2){runs.push({cells:[...Array(e-x+1)].map((_,i)=>[x+i,y]),dir:'h'});for(let i=x;i<=e;i++)m.add(i+','+y)}x=e+1}}
 for(let x=0;x<N;x++){let y=0;while(y<N){let e=y;while(e+1<N&&B[e+1][x].k===B[y][x].k)e++;if(e-y>=2){runs.push({cells:[...Array(e-y+1)].map((_,i)=>[x,y+i]),dir:'v'});for(let i=y;i<=e;i++)m.add(x+','+i)}y=e+1}}
 return{m,runs}}
function anyMove(){for(let y=0;y<N;y++)for(let x=0;x<N;x++)for(const[dx,dy]of[[1,0],[0,1]]){const x2=x+dx,y2=y+dy;if(!inB(x2,y2)||B[y][x].tape||B[y2][x2].tape)continue;swapRaw(x,y,x2,y2);const ok=findMatches().m.size>0;swapRaw(x,y,x2,y2);if(ok){hint=[x,y,x2,y2];return true}}return false}
function swapRaw(x1,y1,x2,y2){const t=B[y1][x1];B[y1][x1]=B[y2][x2];B[y2][x2]=t}
function trySwap(x1,y1,x2,y2){if(busy||state!=='play'||!inB(x2,y2)||Math.abs(x1-x2)+Math.abs(y1-y2)!==1)return;const a=B[y1][x1],b=B[y2][x2];if(a.tape||b.tape){SFX.clang();return}
 idle=0;// special combos
 if(a.sp==='reform'||b.sp==='reform'){const o=a.sp==='reform'?b:a,me=a.sp==='reform'?a:b;swapRaw(x1,y1,x2,y2);useMove();const kill=new Set();for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(B[y][x].k===o.k||B[y][x]===me)kill.add(x+','+y);bannerS('LAND REFORM!');clearSet(kill);return}
 swapRaw(x1,y1,x2,y2);const m=findMatches();if(!m.m.size){swapRaw(x1,y1,x2,y2);a.ox=(x2-x1)*TS*.4;a.oy=(y2-y1)*TS*.4;b.ox=(x1-x2)*TS*.4;b.oy=(y1-y2)*TS*.4;X.bad();return}
 a.ox=(x1-x2)*TS;a.oy=(y1-y2)*TS;b.ox=(x2-x1)*TS;b.oy=(y2-y1)*TS;useMove();combo=0;busy=1;resolve([x2,y2],[x1,y1])}
function useMove(){moves--;yuanVal=Math.max(5,Math.round(yuanVal*.9))}
function resolve(p1,p2){setTimeout(()=>{const{m,runs}=findMatches();if(!m.size){busy=0;afterSettle();return}combo++;
 const keep=new Map();// specials: 5 = reform, L/T = grenade, 4 = poster
 const cellRuns={};for(const r_ of runs)for(const[x,y]of r_.cells)(cellRuns[x+','+y]=cellRuns[x+','+y]||[]).push(r_);
 const made=new Set();
 for(const r_ of runs){const len=r_.cells.length;let at=r_.cells.find(([x,y])=>(p1&&x===p1[0]&&y===p1[1])||(p2&&x===p2[0]&&y===p2[1]))||r_.cells[len>>1];const key=at.join(',');if(made.has(key))continue;
  const cross=r_.cells.find(([x,y])=>cellRuns[x+','+y].length>1);
  if(len>=5){keep.set(key,'reform');made.add(key)}else if(cross&&!made.has(cross.join(','))){keep.set(cross.join(','),'grenade');made.add(cross.join(','))}else if(len===4){keep.set(key,r_.dir==='h'?'posterV':'posterH');made.add(key)}}
 const kill=new Set(m);for(const k of keep.keys())kill.delete(k);
 for(const[k,sp]of keep){const[x,y]=k.split(',').map(Number);B[y][x].sp=sp;B[y][x].flash=20}
 clearSet(kill,true)},140)}
function clearSet(kill,chain){let pts=0;const queue=[...kill];const done=new Set();
 while(queue.length){const k=queue.pop();if(done.has(k))continue;done.add(k);const[x,y]=k.split(',').map(Number);const c=B[y][x];if(!c)continue;
  if(c.sp==='posterH'){for(let i=0;i<N;i++)queue.push(i+','+y);bannerS('POSTER!')}if(c.sp==='posterV'){for(let i=0;i<N;i++)queue.push(x+','+i);bannerS('POSTER!')}
  if(c.sp==='grenade'){for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(inB(x+dx,y+dy))queue.push((x+dx)+','+(y+dy));SFX.boom();shakeT=8}}
 for(const k of done){const[x,y]=k.split(',').map(Number);const c=B[y][x];if(!c)continue;
  // red tape: adjacent clears unlock
  for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const n=inB(x+dx,y+dy)&&B[y+dy][x+dx];if(n&&n.tape&&!done.has((x+dx)+','+(y+dy))){n.tape=0;burst(x+dx,y+dy,'#c8372d');pts+=40}}
  if(c.tape){c.tape=0;burst(x,y,'#c8372d');continue}
  const v=c.k==='yuan'?Math.round(60*yuanVal/100):60;pts+=v;got[c.k]=(got[c.k]||0)+1;burst(x,y,c.k==='yuan'?'#8aa070':'#ffe27a');B[y][x]=null}
 pts=Math.round(pts*(1+combo*.25));score+=pts;if(pts){const c=[...done][0].split(',').map(Number);pops.push({x:BX+c[0]*TS+11,y:BY+c[1]*TS,s:'+'+pts,t:0})}
 X.pop(combo);if(combo>=3){emo='happy';bannerS(pick(['DELICIOUS!','THE ARMY IS PLEASED','EXTRA RATIONS!','NOBODY GETS SHOT TODAY']))}
 gravity();setTimeout(()=>resolve(null,null),260)}
function gravity(){const Lv=WEEKS[lvl];for(let x=0;x<N;x++){let w=N-1;for(let y=N-1;y>=0;y--){const c=B[y][x];if(c){if(w!==y){B[w][x]=c;B[y][x]=null;c.oy=(y-w)*TS}w--}}
 for(let y=w;y>=0;y--)B[y][x]={k:KINDS[(rnd()*Lv.kinds)|0],sp:null,oy:-(w+2)*TS,ox:0,tape:0}}}
function afterSettle(){const Lv=WEEKS[lvl];if(goalMet()){win();return}if(moves<=0){lose();return}if(!anyMove()){bannerS('NO MOVES. RESHUFFLING (BY ORDER)');shuffle()}emo=moves<5?'scared':'determined'}
function shuffle(){const all=[];for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(!B[y][x].tape)all.push(B[y][x]);do{all.sort(()=>rnd()-.5);let i=0;for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(!B[y][x].tape)B[y][x]=all[i++]}while(findMatches().m.size||!anyMove())}
function goalMet(){const g=WEEKS[lvl].goal;for(const k in g){if(k==='score'){if(score<g.score)return false}else if((got[k]||0)<g[k])return false}return true}
function win(){result='win';state='end';const sv=store.get(SAVEK,{})||{};sv.max=Math.max(sv.max||0,lvl+1);sv['s'+lvl]=Math.max(sv['s'+lvl]||0,score);store.set(SAVEK,sv);X.win();emo='happy';music('ending')}
function lose(){result='lose';state='end';emo='smug';X.bad();music('off')}
let banner=null,shakeT=0;function bannerS(s){banner={s,t:0}}
function burst(x,y,c){for(let i=0;i<8;i++)fx.push({x:BX+x*TS+11,y:BY+y*TS+11,vx:(rnd()-.5)*3,vy:(rnd()-.5)*3,l:18,c})}
const X={pop:(c)=>{const t=AC?AC.currentTime:0;tone(500+c*120,700+c*120,.08,'square',.04,t);tone(900+c*150,900+c*150,.06,'triangle',.03,t+.05)},bad:()=>tone(200,120,.15,'square',.04),win:()=>SFX.oneup()};
/* ---------------- update & render ---------------- */
function update(){T++;if(banner&&++banner.t>70)banner=null;if(shakeT>0)shakeT--;
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){const c=B[y]&&B[y][x];if(!c)continue;c.ox*=.7;if(Math.abs(c.ox)<.3)c.ox=0;if(c.oy<0||c.oy>0){c.oy+=c.oy<0?Math.max(2.4,-c.oy*.2):-Math.max(2.4,c.oy*.2);if(Math.abs(c.oy)<2.5)c.oy=0}if(c.flash)c.flash--}
 for(const f of fx){f.x+=f.vx;f.y+=f.vy;f.vy+=.1;f.l--}fx=fx.filter(f=>f.l>0);for(const p of pops)p.t++;pops=pops.filter(p=>p.t<40);if(state==='play'&&!busy)idle++}
function drawTile(c,px,py){if(c.tape){ctx.drawImage(ICON[c.k],px+1,py+1);ctx.globalAlpha=.8;ctx.drawImage(ICON.tape,px+1,py+1);ctx.globalAlpha=1;return}
 ctx.drawImage(ICON[c.k],px+1,py+1);
 if(c.k==='yuan'&&state==='play'){ctx.globalAlpha=1-yuanVal/100*.9;r(px+3,py+6,16,10,'#3a3a2a');ctx.globalAlpha=1}
 if(c.sp){const k=(T>>3)%2;if(c.sp==='posterH'||c.sp==='posterV'){r(px+2,py+2,18,18,'rgba(200,55,45,.35)');if(c.sp==='posterH')r(px+1,py+10,20,2,'#ffd24a');else r(px+10,py+1,2,20,'#ffd24a');hanV('',0,0,'#fff')}
  else if(c.sp==='grenade'){r(px+14,py+2,5,7,'#3a4030');r(px+16,py+0,2,3,WOOD);if(k)r(px+16,py,2,1,'#ffb04a')}
  else if(c.sp==='reform'){ctx.globalAlpha=.5+k*.3;r(px,py,22,22,'#ffd24a');ctx.globalAlpha=1;ctx.drawImage(ICON[c.k],px+1,py+1);stxt('改',px+11,py+12,'#c8372d',12)}}
 if(c.flash&&c.flash%4<2){ctx.globalAlpha=.5;r(px,py,22,22,'#fff');ctx.globalAlpha=1}}
function render(){camX=(T*.15)%300;if(!BGD)buildBG();drawBG();if(state==='title'){ctx.drawImage(VIG,0,0);return}
 if(state==='levels'){renderLevels();return}
 const Lv=WEEKS[lvl];ctx.save();if(shakeT)ctx.translate((rnd()-.5)*4,(rnd()-.5)*4);
 ctx.globalAlpha=.85;r(BX-4,BY-4,N*TS+8,N*TS+8,'#120d0c');ctx.globalAlpha=1;
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){r(BX+x*TS,BY+y*TS,TS-1,TS-1,(x+y)%2?'#2a201a':'#241a16')}
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){const c=B[y][x];if(!c)continue;const py=BY+y*TS+c.oy;if(py<BY-TS+4)continue;drawTile(c,BX+x*TS+c.ox,py)}
 if(sel){ctx.strokeStyle='#ffd24a';ctx.lineWidth=2;ctx.strokeRect(BX+sel[0]*TS,BY+sel[1]*TS,TS-1,TS-1)}
 if(hint&&idle>420&&state==='play'&&T%40<20){ctx.strokeStyle='rgba(255,255,255,.6)';ctx.strokeRect(BX+hint[0]*TS,BY+hint[1]*TS,TS-1,TS-1);ctx.strokeRect(BX+hint[2]*TS,BY+hint[3]*TS,TS-1,TS-1)}
 for(const f of fx)r(f.x,f.y,2,2,f.c);for(const p of pops){ctx.globalAlpha=1-p.t/40;txt(p.s,p.x,p.y-p.t*.4,'#ffd24a','center');ctx.globalAlpha=1}ctx.restore();
 // side panel
 const px=BX+N*TS+12;ctx.globalAlpha=.85;r(px-4,6,W-px,H-12,'#120d0c');ctx.globalAlpha=1;
 txt('WEEK '+(lvl+1)+': '+Lv.name,px,10,'#ffd24a');txt('MOVES',px,24,'#a8977c');txt(String(moves),px+60,22,moves<5?'#ff6a5a':'#e9dcc2','left',F16);txt('SCORE '+score,px,42,'#e9dcc2');
 let gy=56;for(const k in Lv.goal){if(k==='score'){txt('QUOTA: SCORE '+Lv.goal.score,px,gy,score>=Lv.goal.score?'#9fe0a0':'#e9dcc2');gy+=14;continue}ctx.drawImage(ICON[k],px,gy-4,14,14);const v=Math.min(got[k]||0,Lv.goal[k]);txt(KNAME[k]+' '+v+'/'+Lv.goal[k],px+18,gy,v>=Lv.goal[k]?'#9fe0a0':'#e9dcc2');gy+=14}
 txt('GOLD YUAN VALUE '+yuanVal+'%',px,gy+2,yuanVal<40?'#ff6a5a':'#8aa070');
 ctx.save();ctx.translate(px+30,H-14);ctx.scale(1.4,1.4);drawSoldier(-8,0,{fac:Lv.who,face:-1,emo,gun:Lv.who==='kmt'?'rifle':null,officer:lvl>=6});ctx.restore();
 const ls=wrap(Lv.line,20);ls.forEach((l,i)=>txt(l,px+58,H-62+i*9,'#a8977c'));
 if(banner)stxt(banner.s,BX+N*TS/2,BY+N*TS/2,'#ffd24a',14,banner.t<10?banner.t/10:banner.t>55?(70-banner.t)/15:1);
 if(state==='end'){r(0,0,W,H,'rgba(8,6,5,.8)');const w=result==='win';stxt(w?'THE ARMY IS FED':'THE ARMY IS STILL HUNGRY',W/2,70,w?'#ffd24a':'#b3261e',20);
  txt(w?pick2(['They leave without burning anything. A good week.','They thank you and take the cooking pot.','They leave a receipt in Gold Yuan. It is now worth less.']):pick2(['They eat the furniture. Then they look at you.','They requisition the kitchen. And the cook.']),W/2,96,'#e9dcc2','center');
  txt('SCORE '+score,W/2,116,'#a8977c','center');txt(touchUI?'TAP TO CONTINUE':'CLICK OR ENTER TO CONTINUE',W/2,150,'#6e6050','center')}
 ctx.drawImage(VIG,0,0)}
const pick2=a=>a[(lvl*7+score)%a.length];
let lvBtns=[];
function renderLevels(){ctx.globalAlpha=.75;r(0,0,W,H,'#0c0908');ctx.globalAlpha=1;stxt('THE KITCHEN CALENDAR',W/2,16,'#e9dcc2',16);const sv=store.get(SAVEK,{})||{},mx=sv.max||0;lvBtns=[];
 WEEKS.forEach((Lv,i)=>{const x=24+(i%5)*70,y=40+Math.floor(i/5)*80,open=i<=mx;r(x,y,62,70,open?'#2a1d14':'#141010');r(x,y,62,2,Lv.who==='kmt'?'#2f4f8a':'#b8322a');
  if(open){ctx.save();ctx.translate(x+31,y+44);drawSoldier(-8,0,{fac:Lv.who,face:1,emo:sv['s'+i]?'happy':'normal',gun:null,officer:i>=6});ctx.restore()}
  txt('WEEK '+(i+1),x+31,y+50,open?'#e9dcc2':'#4a3e34','center');txt(sv['s'+i]?String(sv['s'+i]):open?'NEW':'LOCKED',x+31,y+60,sv['s'+i]?'#9fe0a0':'#6e6050','center');if(open)lvBtns.push({x,y,w:62,h:70,i})});
 txt(touchUI?'TAP A WEEK':'CLICK A WEEK',W/2,H-12,'#6e6050','center');ctx.drawImage(VIG,0,0)}
/* ---------------- input ---------------- */
let touchUI=matchMedia('(pointer:coarse)').matches;
function cellAt(e){const rc=cv.getBoundingClientRect(),x=(e.clientX-rc.left)/rc.width*W,y=(e.clientY-rc.top)/rc.height*H;return{x,y,cx:Math.floor((x-BX)/TS),cy:Math.floor((y-BY)/TS)}}
cv.addEventListener('pointerdown',e=>{initAudio();const p=cellAt(e);
 if(state==='levels'){for(const b of lvBtns)if(p.x>=b.x&&p.x<=b.x+b.w&&p.y>=b.y&&p.y<=b.y+b.h){startLevel(b.i);return}return}
 if(state==='end'){state='levels';music('m3');return}
 if(state!=='play'||busy)return;if(!inB(p.cx,p.cy))return;
 if(sel&&Math.abs(sel[0]-p.cx)+Math.abs(sel[1]-p.cy)===1){trySwap(sel[0],sel[1],p.cx,p.cy);sel=null;return}
 sel=[p.cx,p.cy];drag={x:p.x,y:p.y,cx:p.cx,cy:p.cy};SFX.tally()});
cv.addEventListener('pointermove',e=>{if(!drag)return;const p=cellAt(e);const dx=p.x-drag.x,dy=p.y-drag.y;if(Math.hypot(dx,dy)>TS*.45){const sx=Math.abs(dx)>Math.abs(dy)?Math.sign(dx):0,sy=sx?0:Math.sign(dy);trySwap(drag.cx,drag.cy,drag.cx+sx,drag.cy+sy);drag=null;sel=null}});
addEventListener('pointerup',()=>{drag=null});
addEventListener('keydown',e=>{if(state==='end'&&(e.code==='Enter'||e.code==='Space')){state='levels';music('m3')}if(e.code==='Escape'&&state==='play'){state='levels';music('m3')}});
$('#bPlay').onclick=()=>{initAudio();$('#title').hidden=true;$('#hud').hidden=false;state='levels';music('m3')};
$('#bPause').hidden=true;$('#bSnd').onclick=e=>{initAudio();setMute(!muted);e.currentTarget.textContent=muted?'MUTE':'SND';e.currentTarget.blur()};
function fit(){const vw=innerWidth,vh=innerHeight,s=Math.min(vw/W,vh/H);cv.style.width=Math.floor(W*s)+'px';cv.style.height=Math.floor(H*s)+'px'}
addEventListener('resize',fit);fit();cv.style.touchAction='none';
let last=performance.now(),acc=0;
function loop(nt){acc+=Math.min(100,nt-last);last=nt;while(acc>=16.67){acc-=16.67;update()}render();requestAnimationFrame(loop)}
(document.fonts?Promise.all([document.fonts.load(F),document.fonts.load(SERIF(20))]):Promise.resolve()).catch(()=>{}).finally(()=>requestAnimationFrame(loop));
