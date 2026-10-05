/* ===================== BATTLE OF THE BANDS 1949 — a Civil Slug rhythm game ===================== */
let T=0,camX=0,S='kmt',EN='ccp',LV=0,skyFlash=0,skyFX=0,state='title';
let plats=[],scorch=[];const L={walls:[40,300],theme:'village',deep:null,weather:null};
function groundAt(){return GY}
const VIG=document.createElement('canvas');VIG.width=W;VIG.height=H;{const g=VIG.getContext('2d');const rg=g.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,W*.6);rg.addColorStop(0,'rgba(0,0,0,0)');rg.addColorStop(1,'rgba(6,2,2,.6)');g.fillStyle=rg;g.fillRect(0,0,W,H)}
const SERIF=s=>`900 ${s}px "Noto Serif TC","Songti TC",Georgia,serif`;
function stxt(s,x,y,c,size,a=1,al='center'){ctx.font=SERIF(size);ctx.textAlign=al;ctx.textBaseline='middle';ctx.globalAlpha=a;ctx.fillStyle='#000';ctx.fillText(s,x+1,y+2);ctx.fillStyle=c;ctx.fillText(s,x,y);ctx.globalAlpha=1}

/* ---------------- songs ---------------- */
const SONGS=[
 {k:'ending',name:'TEMPORARY, FOREVER',sub:'A slow ballad about a two-week retreat that lasted forty years.',theme:'river',loops:4,stars:1},
 {k:'m3',name:'THE COAT ARRIVES IN SPRING',sub:'A march for winter uniforms, delivered on schedule (wrong season).',theme:'snow',loops:2,stars:2},
 {k:'m2',name:'PADDY FIELD SHUFFLE',sub:'The landlord dances. The tenants count.',theme:'paddy',loops:2,stars:2},
 {k:'m1',name:'MARCH OF THE UNPAID',sub:'Funk for soldiers paid in Gold Yuan. Dance before it devalues.',theme:'village',loops:2,stars:3},
 {k:'m4',name:'SHANGHAI NIGHTS, GOLD YUAN LIGHTS',sub:'Swing for the bank run. Bring a wheelbarrow.',theme:'city',loops:2,stars:3},
 {k:'m5',name:'THE LAST FERRY',sub:'Rock for people with one ticket and four relatives.',theme:'river',loops:2,stars:4},
 {k:'boss',name:'TANK WITH SIX OWNERS',sub:'Every side has driven it. None have paid for fuel.',theme:'village',loops:3,stars:4},
 {k:'final',name:'HYPERINFLATION',sub:'The tempo rises with the prices. Good luck.',theme:'city',loops:3,stars:5}];
const DIFFS=['EASY','NORMAL','HARD'];
const LANEC=['#c8372d','#d9a441','#d9a441','#c8372d'];
const KEYL={KeyD:0,KeyF:1,KeyJ:2,KeyK:3,ArrowLeft:0,ArrowDown:1,ArrowUp:2,ArrowRight:3};

/* ---------------- chart from the music engine ---------------- */
function stepTime(tr,step,t0){const spb=60/tr.bpm/4;let t=t0+step*spb;if(tr.swing&&(step&15)%4===2)t+=spb*.33;return t}
function buildChart(song,diff){const tr=TRACKS[song.k],n=tr.song.length*16*song.loops,spb=60/tr.bpm/4;let lo=99,hi=0;for(const[,mel]of tr.song)for(const[,p]of mel){lo=Math.min(lo,p);hi=Math.max(hi,p)}
 const notes=[];let lastStep=-9,lastLane=-1;
 for(let st=0;st<n;st++){const bar=(st>>4)%tr.song.length,s=st&15,loop=Math.floor(st/(tr.song.length*16)),mel=tr.song[bar][1];
  if(loop===0&&bar<2&&diff===0)continue;
  for(const[q,p,len]of mel){if(q!==s)continue;if(diff===0&&(s%2||st-lastStep<3))continue;if(diff===1&&st-lastStep<2)continue;
   let lane=Math.min(3,Math.floor((p-lo)/(hi-lo+1)*4));if(lane===lastLane&&st-lastStep<=2&&diff<2)lane=(lane+(p%2?1:3))%4;
   const hold=len>=6&&diff>0?len:0;notes.push({st,lane,hold,t:stepTime(tr,st,0),te:hold?stepTime(tr,st+hold*.9,0):0});lastStep=st;lastLane=lane}
  if(diff===2&&(s===4||s===12)&&st-lastStep>=2&&bar%2===1){const lane=s===4?0:3;notes.push({st,lane,hold:0,t:stepTime(tr,st,0),te:0});lastStep=st}}
 return{notes,n,spb,tr}}
/* sequencer step (mirrors the core music engine, but scheduled by the game so the chart is exact) */
function playStep(tr,step,t){const spb=60/tr.bpm/4,song=tr.song,bar=(step>>4)%song.length,s=step&15,[cn,mel]=song[bar],[root,tri]=CH[cn],dk=tr.drums;
 if(tr.swing&&s%4===2)t+=spb*.33;
 if(s===0&&bar%4===0&&dk!=='soft'&&dk!=='swing')DR.c(t);
 if(dk==='funk'){if(s===0||s===6||s===8||s===11)DR.k(t);if(s===4||s===12)DR.s(t);if(s%2===0)DR.h(t,s===14);if(bar%4===3&&s>=12){DR.s(t,.5+(s-12)*.15);DR.tom(t,260-(s-12)*40)}if(s===9&&bar%2)DR.s(t,.3)}
 else if(dk==='shuffle'){if(s===0||s===8||s===10)DR.k(t);if(s===4||s===12)DR.s(t,.8);DR.h(t,false,s%2?.6:1)}
 else if(dk==='march'){if(s===0||s===8)DR.k(t);if(s===4||s===12)DR.s(t);if(s===14||s===15||s===13&&bar%2)DR.s(t,.35);if(s%2===0)DR.h(t,false,.6)}
 else if(dk==='swing'){if(s===0||s===8)DR.k(t,.6);if(s%4===0||s%4===2)DR.ride(t);if(s===4||s===12)DR.s(t,.35)}
 else if(dk==='rock'){if(s===0||s===4||s===8||s===10)DR.k(t);if(s===4||s===12)DR.s(t,1.1);if(s%2===0)DR.h(t,s===6||s===14);if(bar%2===1&&s>=12)DR.tom(t,240-(s-12)*35)}
 else if(dk==='boss'){if(s%4===0||s===14||s===10)DR.k(t);if(s===4||s===12)DR.s(t);DR.h(t,s%4===2)}
 else if(dk==='soft'){if(s===0)DR.k(t,.5);if(s===8)DR.s(t,.2)}
 if(tr.bass==='walk'){if(s%4===0){const w=[0,4,7,10][s/4|0];bass(root+w,t,spb*3.5,.28)}}else{const bp=tr.bass[s];if(bp!=null)bass(root+bp,t,spb*(dk==='soft'?3:.9),.3)}
 const st=tr.stab;
 if(st==='funk'){if(s===0)tri.forEach(n=>brass(n-12,t,spb*3,.05));if(s===6||s===10)tri.forEach(n=>brass(n-12,t,spb*.8,.045))}
 else if(st==='boss'){if(s===0||s===3||s===6)tri.forEach(n=>brass(n-12,t,spb*1.2,.05))}
 else if(st==='long'){if(s===0)tri.forEach(n=>brass(n-12,t,spb*14,.03))}
 else if(st==='jazz'){if(s===2||s===10)tri.forEach(n=>brass(n,t,spb*1.2,.03))}
 for(const[q,n,len]of mel)if(q===s)lead(n,t,spb*len*.92,.06,tr.wave)}

/* ---------------- state ---------------- */
let side='kmt',sel=0,diff=1,G=null,run=null,offset=0,scroll=150;
const SAVEK='botb49.v1';function loadSave(){G=store.get(SAVEK,null)||{best:{},offset:0};offset=G.offset||0}
function save(){G.offset=offset;store.set(SAVEK,G)}
const JUDGE=[['PERFECT',.045,1000,'#ffd24a'],['GREAT',.09,600,'#9fe0a0'],['OK',.135,250,'#9fd3ff']];
function startSong(i){initAudio();const song=SONGS[i];const ch=buildChart(song,diff);setTheme(song.theme);
 const t0=AC.currentTime+2.2;run={song,i,ch,t0,step:0,next:t0,notes:ch.notes.map(n=>Object.assign({},n,{t:n.t+t0,te:n.te?n.te+t0:0,hit:0,miss:0,held:0,holding:0})),score:0,combo:0,maxc:0,cnt:{PERFECT:0,GREAT:0,OK:0,MISS:0},loyal:60,fx:[],judg:null,lanesOn:[0,0,0,0],shout:null,end:stepTime(ch.tr,ch.n,t0)+1.2,failed:false,beatLast:-1};
 music('off');state='play';$('#hud').hidden=false}
function setTheme(th){L.theme=th;L.weather=th==='snow'?'snow':th==='city'?'money':null;LV=SONGS.findIndex(s=>s.theme===th)+3;buildBG()}
function gnow(){return AC?AC.currentTime-offset/1000:0}
function laneDown(l){if(state!=='play'||!run||run.failed)return;run.lanesOn[l]=1;const t=gnow();
 let best=null,bd=.2;for(const n of run.notes){if(n.hit||n.miss||n.lane!==l)continue;const d=Math.abs(n.t-t);if(d<bd){bd=d;best=n}if(n.t-t>.3)break}
 if(!best){X.tap(l);return}const j=JUDGE.find(([,w])=>bd<=w);if(!j){return}
 best.hit=1;if(best.hold){best.holding=1}judge(j,l,best);X.tap(l)}
function laneUp(l){if(!run)return;run.lanesOn[l]=0;const t=gnow();for(const n of run.notes)if(n.holding&&n.lane===l){n.holding=0;if(t<n.te-.12){n.miss=1;run.combo=0;run.judg={s:'DROPPED',c:'#ff6a5a',t:0};loyal(-4)}else{n.held=1;run.score+=300;fxBurst(l,'#ffd24a')}}}
function judge(j,l,n){const[name,,pts,col]=j;run.cnt[name]++;run.combo++;run.maxc=Math.max(run.maxc,run.combo);run.score+=Math.round(pts*(1+Math.min(run.combo,100)/100));run.judg={s:name,c:col,t:0};
 loyal(name==='PERFECT'?1.2:name==='GREAT'?.8:.3);fxBurst(l,col);
 if(run.combo>0&&run.combo%50===0){run.shout={s:side==='kmt'?'DIE! CCP MTFK! ...THE MUSIC, I MEAN':'SERVE THE PEOPLE! (THE RHYTHM)',t:90};SFX.fanfare&&SFX.oneup()}}
function loyal(d){run.loyal=clamp(run.loyal+d,0,100);if(run.loyal<=0&&!run.failed){run.failed=true;run.failT=0;music('off');X.fail()}}
function fxBurst(l,c){const x=laneX(l)+18;for(let i=0;i<10;i++)run.fx.push({x,y:JY,vx:(rnd()-.5)*3,vy:-rnd()*3,l:18,c})}
const HX=W/2-80,LW=40,JY=188;const laneX=l=>HX+l*LW;
const X={tap:(l)=>tone(1200+l*120,900,.03,'square',.012),fail:()=>{const t0_=AC.currentTime;tone(300,80,1.2,'sawtooth',.06,t0_);noise(1,.1,400,'lowpass',t0_)}};

/* ---------------- update ---------------- */
function update(){T++;if(state!=='play'||!run)return;const t=gnow();
 if(!run.failed)while(run.next<AC.currentTime+.2&&run.step<run.ch.n){playStep(run.ch.tr,run.step,run.next);run.step++;run.next=run.t0+run.step*run.ch.spb}
 for(const n of run.notes){if(!n.hit&&!n.miss&&t-n.t>.135){n.miss=1;run.cnt.MISS++;run.combo=0;run.judg={s:'MISS',c:'#ff6a5a',t:0};loyal(-5);if(n.hold)n.te=0}
  if(n.holding&&t>=n.te){n.holding=0;n.held=1;run.score+=300;fxBurst(n.lane,'#ffd24a')}
  if(n.holding&&T%6===0)run.score+=10}
 if(run.judg)run.judg.t++;if(run.shout&&--run.shout.t<=0)run.shout=null;
 for(const p of run.fx){p.x+=p.vx;p.y+=p.vy;p.vy+=.15;p.l--}run.fx=run.fx.filter(p=>p.l>0);
 if(run.failed){run.failT++;if(run.failT>180)finishSong()}else if(t>run.end)finishSong()}
function finishSong(){const r_=run;const tot=r_.notes.length||1,acc=(r_.cnt.PERFECT+r_.cnt.GREAT*.7+r_.cnt.OK*.35)/tot;r_.acc=acc;
 r_.grade=r_.failed?'F':acc>.95?'S':acc>.88?'A':acc>.75?'B':acc>.6?'C':'D';const key=r_.song.k+diff;const b=G.best[key];if(!r_.failed&&(!b||r_.score>b.score))G.best[key]={score:r_.score,grade:r_.grade};save();state='result';music('ending')}
const COMMENTS={S:'Flawless. Both armies are now trying to draft your band.',A:'The crowd loved it. Several soldiers deserted to join your rhythm section.',B:'Respectable. The village applauds, cautiously, in case the other side wins.',C:'The crowd stayed out of politeness. And fear.',D:'Half the square went home. The other half went to the other stage.',F:'YOUR AUDIENCE DEFECTED. They took the chairs.'};

/* ---------------- render ---------------- */
function troupe(x,y,fac,beat,mine,mood){for(let i=0;i<3;i++){const bx=x+i*24,bob=(beat+i)%2?-3:0,emo=mood>0?'happy':mood<0?'scared':'determined';
 if(fac==='kmt'){drawSoldier(bx,y+bob,{fac:'kmt',face:mine?1:-1,pose:(beat+i)%4===0?'jump':'idle',emo,gun:null});const hx=mine?bx+14:bx-4;r(hx,y+bob-12,7,3,'#d9a441');r(hx+(mine?6:-2),y+bob-14,3,7,'#ffd24a')}
 else{drawCivilian(bx,y+bob,{face:mine?1:-1,hat:'none',cl:'#b8322a',cl2:'#7a1c14',sash:'#ffd24a',emo,arm:(beat+i)%2?'up':'wave'});if((beat+i)%2){r(bx+(mine?14:-6),y+bob-26,8,8,'#ff4a3a');r(bx+(mine?16:-4),y+bob-24,4,4,'#ffd24a')}}}}
function drawCrowd(beat){const n=12,mineN=Math.round(run.loyal/100*n);for(let i=0;i<n;i++){const mine=i<mineN;const x=mine?6+i*9:W-14-(n-1-i)*9;const y=206+((beat+i)%2?-1:0);
 drawCivilian(x-8,y,{face:mine?-1:1,hat:i%3?'straw':'none',cl:'#55707e',emo:mine?'happy':'normal',arm:mine&&(beat+i)%2?'wave':null})}}
function render(){
 if(state==='title'){attract();return}
 if(state==='select'){renderSelect();return}
 if(state==='result'){renderResult();return}
 if(!run)return;const t=gnow(),beat=Math.floor((t-run.t0)/(run.ch.spb*4));
 camX=(T*.2)%200;drawBG();ctx.globalAlpha=.35;r(0,0,W,H,'#000');ctx.globalAlpha=1;
 const mood=run.judg&&run.judg.t<20?(run.judg.s==='MISS'||run.judg.s==='DROPPED'?-1:1):0;
 troupe(6,150,side,Math.max(0,beat),true,mood);troupe(W-74,150,side==='kmt'?'ccp':'kmt',Math.max(0,beat)+1,false,-mood);drawCrowd(Math.max(0,beat));
 // highway
 ctx.globalAlpha=.78;r(HX-4,0,LW*4+8,H,'#0c0908');ctx.globalAlpha=1;for(let l=0;l<=4;l++)r(HX+l*LW,0,1,H,'#3a2e26');
 for(let k=0;k<12;k++){const bt=run.t0+(beat+k)*run.ch.spb*4,y=JY-(bt-t)*scroll;if(y>0&&y<JY)r(HX,y,LW*4,1,'rgba(233,220,194,.12)')}
 for(let l=0;l<4;l++){if(run.lanesOn[l]){ctx.globalAlpha=.18;r(laneX(l),0,LW,JY,LANEC[l]);ctx.globalAlpha=1}}
 r(HX,JY-1,LW*4,3,'#e9dcc2');for(let l=0;l<4;l++){r(laneX(l)+4,JY-4,LW-8,8,run.lanesOn[l]?LANEC[l]:'#2a2018');txt(touchUI?'':'DFJK'[l],laneX(l)+LW/2,JY+8,'#6e6050','center')}
 for(const n of run.notes){if(n.miss&&!n.hold||n.hit&&!n.hold)continue;const y=JY-(n.t-t)*scroll;if(y<-20&&!n.hold)break;const x=laneX(n.lane)+3;
  if(n.hold){const ye=JY-(n.te-t)*scroll;if(ye>JY||y<-200)continue;const top=Math.max(-10,ye),bot=n.holding?JY:Math.min(y,H);if(!n.miss&&!n.held){ctx.globalAlpha=n.holding?.9:.55;r(x+8,top,LW-22,bot-top,LANEC[n.lane]);ctx.globalAlpha=1}if(n.hit||n.miss)continue}
  if(y>H+10)continue;r(x,y-4,LW-6,8,LANEC[n.lane]);r(x,y-4,LW-6,2,'#fff4d0');r(x+2,y+2,LW-10,2,'rgba(0,0,0,.3)')}
 for(const p of run.fx)r(p.x,p.y,2,2,p.c);
 // hud
 r(6,6,104,8,'#120d0c');r(7,7,102*run.loyal/100,6,run.loyal<25?(T%10<5?'#ff5a3a':'#c8372d'):side==='kmt'?'#4a6aa3':'#c8372d');txt('CROWD LOYALTY',8,16,'#a8977c');
 txt(String(run.score).padStart(7,'0'),W-8,6,'#e9dcc2','right',F16);txt(run.song.name,W-8,24,'#a8977c','right');txt(DIFFS[diff],W-8,34,'#6e6050','right');
 if(run.combo>1)stxt(String(run.combo),W/2,70,'#e9dcc2',22,.9);if(run.combo>1)txt('COMBO',W/2,84,'#a8977c','center');
 if(run.judg&&run.judg.t<30)stxt(run.judg.s,W/2,110-run.judg.t*.3,run.judg.c,16,1-run.judg.t/30);
 if(run.shout)drawShout(run.shout.s,60,130,true);
 if(t<run.t0)stxt(String(Math.ceil(run.t0-t)),W/2,H/2,'#ffd24a',30);
 const prog=clamp((t-run.t0)/(run.end-run.t0),0,1);r(HX,H-3,LW*4*prog,2,'#d9a441');
 if(run.failed){ctx.globalAlpha=Math.min(.8,run.failT/40);r(0,0,W,H,'#000');ctx.globalAlpha=1;stxt('YOUR AUDIENCE DEFECTED',W/2,H/2-8,'#b3261e',20);txt('THEY TOOK THE CHAIRS',W/2,H/2+12,'#a8977c','center')}
 ctx.drawImage(VIG,0,0)}
function renderSelect(){camX=(T*.2)%200;drawBG();ctx.globalAlpha=.7;r(0,0,W,H,'#0c0908');ctx.globalAlpha=1;
 stxt('SET LIST',W/2,16,'#e9dcc2',16);txt('PLAYING FOR: '+(side==='kmt'?'KMT BRASS BAND':'CCP YANGGE TROUPE'),W/2,28,side==='kmt'?'#9fb6e6':'#ff8a7a','center');
 btns=[];SONGS.forEach((s,i)=>{const y=40+i*15,on=i===sel;r(24,y,W-48,13,on?'rgba(217,164,65,.3)':'rgba(20,14,12,.7)');txt((on?'▶ ':'  ')+s.name,28,y+3,'#e9dcc2');txt('★'.repeat(s.stars),W-120,y+3,'#d9a441');
  const b=G.best[s.k+diff];txt(b?b.grade+' '+b.score:'—',W-28,y+3,b?'#9fe0a0':'#6e6050','right');btns.push({x:24,y,w:W-48,h:13,f:()=>{if(sel===i)startSong(i);else{sel=i;SFX.tally()}}})});
 const s=SONGS[sel],tr=TRACKS[s.k];txt(s.sub,W/2,H-46,'#a8977c','center');txt(tr.bpm+' BPM',W/2,H-36,'#6e6050','center');
 const dy=H-24;DIFFS.forEach((d,i)=>{const x=W/2-90+i*60;r(x,dy,56,13,i===diff?'#d9a441':'#2a2018');txt(d,x+28,dy+3,i===diff?'#120d0c':'#e9dcc2','center');btns.push({x,y:dy,w:56,h:13,f:()=>{diff=i;SFX.tally()}})});
 txt(touchUI?'TAP A SONG TWICE TO PLAY':'W/S SONG · A/D DIFFICULTY · ENTER PLAY · [ ] OFFSET '+offset+'MS',W/2,H-8,'#6e6050','center');ctx.drawImage(VIG,0,0)}
function renderResult(){const r_=run;camX=(T*.2)%200;drawBG();ctx.globalAlpha=.75;r(0,0,W,H,'#0c0908');ctx.globalAlpha=1;
 stxt(r_.song.name,W/2,22,'#e9dcc2',14);stxt(r_.grade,W/2,64,r_.grade==='S'?'#ffd24a':r_.grade==='F'?'#b3261e':'#e9dcc2',44);
 const L_=['PERFECT '+r_.cnt.PERFECT,'GREAT '+r_.cnt.GREAT,'OK '+r_.cnt.OK,'MISS '+r_.cnt.MISS,'MAX COMBO '+r_.maxc,'SCORE '+r_.score];L_.forEach((l,i)=>txt(l,W/2,96+i*11,'#e9dcc2','center'));
 const ls=wrap(COMMENTS[r_.grade],44);ls.forEach((l,i)=>txt(l,W/2,170+i*10,'#ff9a6a','center'));txt(touchUI?'TAP TO CONTINUE':'ENTER TO CONTINUE',W/2,H-10,'#6e6050','center');ctx.drawImage(VIG,0,0)}
function attract(){camX=(T*.3)%300;if(!BGD){L.theme='village';buildBG()}drawBG();const b=(T>>4);troupe(40,170,'kmt',b,true,1);troupe(W-110,170,'ccp',b+1,false,1);ctx.drawImage(VIG,0,0)}
let btns=[];

/* ---------------- input ---------------- */
let touchUI=matchMedia('(pointer:coarse)').matches;
addEventListener('keydown',e=>{if(e.repeat)return;
 if(state==='play'){const l=KEYL[e.code];if(l!=null){e.preventDefault();laneDown(l);return}if(e.code==='Escape'){run.failed=true;run.failT=170;return}if(e.code==='BracketLeft')offset-=10;if(e.code==='BracketRight')offset+=10;return}
 if(state==='select'){if(e.code==='KeyW'||e.code==='ArrowUp')sel=(sel+SONGS.length-1)%SONGS.length;else if(e.code==='KeyS'||e.code==='ArrowDown')sel=(sel+1)%SONGS.length;else if(e.code==='KeyA'||e.code==='ArrowLeft')diff=Math.max(0,diff-1);else if(e.code==='KeyD'||e.code==='ArrowRight')diff=Math.min(2,diff+1);
  else if(e.code==='Enter'||e.code==='KeyJ'||e.code==='Space'){e.preventDefault();startSong(sel);return}else if(e.code==='Escape'){state='title';$('#title').hidden=false;$('#hud').hidden=true;music('off');return}else if(e.code==='BracketLeft')offset-=10;else if(e.code==='BracketRight')offset+=10;else return;SFX.tally();save();return}
 if(state==='result'&&(e.code==='Enter'||e.code==='Space'||e.code==='KeyJ'||e.code==='Escape')){e.preventDefault();state='select';music('m3')}});
addEventListener('keyup',e=>{if(state==='play'){const l=KEYL[e.code];if(l!=null)laneUp(l)}});
const ptrLane={};
cv.addEventListener('pointerdown',e=>{initAudio();e.preventDefault();const rc=cv.getBoundingClientRect(),x=(e.clientX-rc.left)/rc.width*W,y=(e.clientY-rc.top)/rc.height*H;
 if(state==='play'){let l=Math.floor((x-HX)/LW);if(x<HX)l=x<HX/2?0:1;if(x>HX+LW*4)l=x>HX+LW*4+(W-HX-LW*4)/2?3:2;l=clamp(l,0,3);ptrLane[e.pointerId]=l;laneDown(l);return}
 if(state==='select'){for(const b of btns)if(x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h){b.f();return}return}
 if(state==='result'){state='select';music('m3')}});
const pUp=e=>{const l=ptrLane[e.pointerId];if(l!=null){laneUp(l);delete ptrLane[e.pointerId]}};
cv.addEventListener('pointerup',pUp);cv.addEventListener('pointercancel',pUp);cv.style.touchAction='none';
function chooseSide(s){initAudio();side=s;S=s;EN=s==='kmt'?'ccp':'kmt';$('#title').hidden=true;$('#hud').hidden=false;state='select';loadSave();music('m3')}
$('#sK').onclick=()=>chooseSide('kmt');$('#sC').onclick=()=>chooseSide('ccp');
$('#bPause').onclick=e=>{e.currentTarget.blur()};$('#bPause').hidden=true;
$('#bSnd').onclick=e=>{initAudio();setMute(!muted);e.currentTarget.textContent=muted?'MUTE':'SND';e.currentTarget.blur()};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='play'&&run&&!run.failed){run.failed=true;run.failT=170}});
function fit(){const vw=innerWidth,vh=innerHeight,s=Math.min(vw/W,vh/H);cv.style.width=Math.floor(W*s)+'px';cv.style.height=Math.floor(H*s)+'px'}
addEventListener('resize',fit);fit();loadSave();
function loop(){update();render();requestAnimationFrame(loop)}
(document.fonts?Promise.all([document.fonts.load(F),document.fonts.load(SERIF(20))]):Promise.resolve()).catch(()=>{}).finally(()=>requestAnimationFrame(loop));
