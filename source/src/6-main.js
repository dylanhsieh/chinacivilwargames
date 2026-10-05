/* ---------------- flow: scenes → mission → tally → scene → next ---------------- */
function progress(){return store.get('civslug-progress',{kmt:1,ccp:1})}
function unlock(i){const p=progress();p[S]=Math.max(p[S]||1,i+1);store.set('civslug-progress',p)}
function showScene(sc,done){$('#hud').hidden=true;state='scene';scene={sc,t:0,done};music('ending')}
function beginMission(i){LV=i;L=LEVELS[i];buildBG();const pre=SCENES[i].pre;if(pre)showScene(pre,()=>startPlay(i));else startPlay(i)}
function startPlay(i){loadLevel(i);state='play';$('#hud').hidden=false}
function missionComplete(){$('#hud').hidden=true;state='tally';music('off');SFX.fanfare();
 const bonusP=MS.freed*1000,bonusK=MS.kills*50,bonusN=MS.lost===0?10000:0;
 tally={t:0,rows:[['ENEMIES DISPATCHED',MS.kills,bonusK],['VILLAGERS UNTIED',MS.freed,bonusP],['DEFECTORS RECRUITED',MS.defects,MS.defects*300],['$LIVES SPENT',MS.lost,bonusN]],total:bonusK+bonusP+MS.defects*300+bonusN,
  rank:MS.lost===0?'HERO OF THE (CORRECT) PEOPLE':MS.lost<3?'DECORATED (TIN MEDAL)':MS.lost<6?'ADEQUATE CANNON FODDER':'STATISTIC'};
 addScore(tally.total);unlock(LV+1)}
function afterTally(){const post=SCENES[LV].post;const next=()=>{if(LV+1<LEVELS.length)beginMission(LV+1);else ending()};if(post)showScene(post,next);else next()}
// KMT-only epilogue: you win every battle, and still end up on the boat.
const KMT_ENDING=[
 {date:'APRIL - NOVEMBER 1949',place:'EVERYWHERE ELSE',draw:'medals',
  fact:"You won all five of your missions. Meanwhile the rest of the army lost Nanjing, Shanghai, Guangzhou and most of the map.",
  joke:"Headquarters awards you a medal for winning. And a boat ticket, for the same reason."},
 {date:'DECEMBER 1949',place:'THE LAST BOAT',draw:'dock',
  fact:"The government 'temporarily relocates' to Taiwan. The national gold reserves sailed months ago, quietly, ahead of everyone.",
  joke:"Your ticket costs one sack of Gold Yuan. You have one sack. By boarding time it costs two."},
 {date:'DECEMBER 1949 →',place:'TAIPEI (TEMPORARILY)',draw:'island',
  fact:"Back in October, the People's Republic was proclaimed in Beijing. Headquarters calls it 'a temporary setback'. Very temporary.",
  joke:"'We counterattack the mainland next year!' Said in 1950. And 1951. And 1952. And 1953. And..."},
 {date:'AND THEN',place:'THE TAIWAN STRAIT',draw:'strait',fact:ENDING.last,joke:"The donkey, for the record, stayed neutral."}];
const KMT_CREDITS=["CIVIL SLUG 1946–1949","","MISSIONS WON: 5 OF 5","CIVIL WARS WON: 0 OF 1","","STARRING","MILLIONS OF CONSCRIPTS (UNPAID)","ONE DONKEY (UNWILLING)","A TANK WITH SIX OWNERS","THE GOLD RESERVES (LEFT EARLY)","A SACK OF GOLD YUAN (WORTHLESS)","","NO VILLAGERS WERE CONSULTED","DURING THE MAKING OF THIS WAR","","COUNTERATTACK ON THE MAINLAND:","SCHEDULED FOR NEXT YEAR","(EVERY YEAR)","","THANK YOU FOR PLAYING"];
function ending(){store.set('civslug-cleared-kmt',true);
 const run=i=>{if(i<KMT_ENDING.length)showScene(KMT_ENDING[i],()=>run(i+1));else{state='credits';credits={t:0};music('ending')}};run(0)}
function gameOver(){state='over';music('off');showEnd('over');if(AC){const t=now();[62,61,60,55].forEach((n,i)=>tone(mf(n),mf(n),.35,'square',.05,t+i*.3))}}
let endMode='over';
function showEnd(mode){endMode=mode;const m=M();$('#end').hidden=false;$('#hud').hidden=true;
 if(!showEnd.keep)endOverI=rnd()*m.over.length|0;showEnd.keep=false;const zh=LANG==='zh',money=fmtBig(Math.max(0,score)*Math.pow(1.6,(LV*3000+T)/600)),eggs=Math.max(0,score/60|0);
 const pay=zh?`金圓券 ¥${money}（≈ ${eggs} 顆蛋）`:`¥${money} Gold Yuan (≈ ${eggs} eggs)`;
 $('#endH').textContent=mode==='win'?tr("YOU WON. THE WAR DIDN'T."):zh?'壯丁用完了':`OUT OF ${m.lives}`;
 $('#endP').textContent=mode==='win'?tr("Five missions won. One civil war lost. Report to the island for temporary duty. The counterattack is scheduled for next year. It always will be."):m.over[endOverI%m.over.length];
 const row=(k,v)=>`<dt>${tr(k)}</dt><dd>${v}</dd>`;
 $('#endS').innerHTML=row('Reached',zh?`任務 ${LV+1}：${LEVELS[LV].name}`:`Mission ${LV+1}: ${LEVELS[LV].name}`)+row('Enemies dispatched',totals.kills)+row('Conscripts spent',totals.lost)+row('Defectors gained',totals.defects)+row('Villagers untied',totals.freed)+row('Pay',pay);
 $('#e1').textContent=tr(mode==='win'?'PLAY AGAIN':'DRAFT 3 MORE');$('#e2').textContent=tr('MISSIONS');$('#e3').textContent=tr('TITLE');if(!showEnd.nofocus)setTimeout(()=>$('#e1').focus(),50);showEnd.nofocus=false}
let endOverI=0;
$('#e1').addEventListener('click',()=>{$('#end').hidden=true;if(endMode==='win'){startCampaign(S,0);return}
 lives=2;state='play';$('#hud').hidden=false;music(boss?(boss.kind==='mech'?'final':'boss'):L.track);let x=clamp(P.x,camX+20,camX+W-40);if(groundAt(x+8)>1e3)x=raft?raft.x+raft.w/2-8:camX+60;newPlayer(x,-10);pop(x+8,60,tr('3 MORE DRAFTED. THEIR VILLAGE IS NOW EMPTY'),'#ffd24a',160)});
$('#e2').addEventListener('click',()=>{$('#end').hidden=true;openMissions('kmt')});
$('#e3').addEventListener('click',()=>{$('#end').hidden=true;toTitle()});
function toTitle(){state='title';$('#title').hidden=false;$('#hud').hidden=true;$('#missions').hidden=true;music('off');LV=0;L=LEVELS[0];buildBG();loadLevel(0);music('off')}
function startCampaign(side,i){initAudio();S='kmt';EN='ccp';/* KMT-only: the side argument is ignored */score=0;lives=2;nextLife=30000;totals={kills:0,lost:0,freed:0,defects:0};
 $('#title').hidden=true;$('#missions').hidden=true;$('#end').hidden=true;fit();beginMission(i)}
function openMissions(side){side='kmt';selSide=side;const p=progress(),un=p[side]||1;
 if(un<=1){startCampaign(side,0);return}
 $('#title').hidden=true;$('#missions').hidden=false;$('#mH').textContent=tr('NATIONALIST CAMPAIGN');
 const ml=$('#mlist');ml.innerHTML='';LEVELS.forEach((lv,i)=>{const b=document.createElement('button');b.className='mbtn';b.disabled=i>=un;
  b.innerHTML=`<b>M${i+1}</b><span>${lv.name}</span><small>${i<un?SCENES[i].pre.date:tr('LOCKED')}</small>`;b.addEventListener('click',()=>startCampaign(side,i));ml.appendChild(b)});
 setTimeout(()=>ml.querySelector('button:not(:disabled)')?.focus(),30)}
$('#mBack').addEventListener('click',()=>{$('#missions').hidden=true;$('#title').hidden=false});
function markSel(){document.querySelectorAll('.side').forEach(b=>b.classList.toggle('sel',b.dataset.side===selSide))}
document.querySelectorAll('.side').forEach(b=>{b.addEventListener('click',()=>{initAudio();openMissions('kmt')})});
function togglePause(){if(state==='play'){state='pause';music('off')}else if(state==='pause'){state='play';music(boss?(boss.kind==='mech'?'final':'boss'):L.track)}}
$('#bPause').addEventListener('click',e=>{togglePause();e.currentTarget.blur()});
$('#bSnd').addEventListener('click',e=>{initAudio();setMute(!muted);sndLabel();e.currentTarget.blur()});
function sndLabel(){const b=$('#bSnd');b.textContent=tr(muted?'MUTE':'SND');b.setAttribute('aria-pressed',String(!muted))}
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='play')togglePause()});
addEventListener('keydown',e=>{
 const ae=document.activeElement,onBtn=ae&&ae.tagName==='BUTTON'&&ae.closest('.ov');
 if(onBtn&&(e.code==='Enter'||e.code==='Space'||e.code==='NumpadEnter'))return;
 if(state==='title'){if($('#missions').hidden&&e.code==='Enter'){openMissions('kmt');e.preventDefault()}return}
 if(state==='over')return;
 if(e.code==='KeyP'||e.code==='Escape'){togglePause();return}
 const k=KEYMAP[e.code];if(!k)return;if(document.activeElement&&document.activeElement.tagName==='BUTTON'&&!$('#end').hidden)return;e.preventDefault();if(!e.repeat&&!kb[k])pressed[k]=1;kb[k]=1;initAudio()});
addEventListener('keyup',e=>{const k=KEYMAP[e.code];if(k)kb[k]=0});

/* ---------------- non-play screens ---------------- */
function updScene(){scene.t++;T++;const adv=pressed.fire||pressed.jump||pressed.bomb;for(const k in pressed)delete pressed[k];
 if(scene.t%3===0&&scene.t<500)SFX.type();
 if(adv){if(!scene.complete)scene.t=Math.max(scene.t,600);else{const d=scene.done;scene=null;d()}}}
function updTally(){tally.t++;T++;const adv=pressed.fire||pressed.jump;for(const k in pressed)delete pressed[k];if(tally.t%4===0&&tally.t<120)SFX.tally();if(adv&&tally.t>60){if(tally.t<150)tally.t=150;else{tally=null;afterTally()}}}
function drawTally(){r(0,0,W,H,'#120d0c');ctx.globalAlpha=.25;sceneArt(SCENES[LV].pre.draw,T);ctx.globalAlpha=1;r(0,0,W,H,'#120d0cc0');
 txt(LANG==='zh'?`任務 ${LV+1} 完成`:`MISSION ${LV+1} COMPLETE`,W/2,18,'#ffd24a','center',F16);txt(L.name,W/2,40,'#a8977c','center');
 tally.rows.forEach((row,i)=>{if(tally.t<20+i*25)return;const y=64+i*18,cnt=Math.min(row[1],Math.floor((tally.t-20-i*25)/2));txt(row[0]==='$LIVES SPENT'?(LANG==='zh'?'消耗壯丁':`${M().lives} SPENT`):tr(row[0]),30,y,'#e9dcc2');txt(String(cnt),250,y,'#e9dcc2','right');txt('+'+row[2],W-30,y,'#9fe0a0','right')});
 if(tally.t>130){txt(tr('BONUS'),30,142,'#ffd24a');txt('+'+tally.total,W-30,142,'#ffd24a','right');txt(tr('RANK: ')+tr(tally.rank),W/2,166,'#ff9a6a','center')}
 if(tally.t>150&&T%40<26)txt(tr('▶ CONTINUE'),W/2,194,'#d9a441','center')}
function drawCredits(){r(0,0,W,H,'#0b0808');for(let i=0;i<40;i++)r((i*53)%W,(i*37+credits.t*.2)%H,1,1,'#3a2a2a');
 KMT_CREDITS.forEach((l,i)=>{const y=H+10+i*16-credits.t*.5;if(y>-10&&y<H+10)txt(l,W/2,y,i===0?'#ffd24a':'#e9dcc2','center')});
 const adv=pressed.fire||pressed.jump;for(const k in pressed)delete pressed[k];
 if(credits.t>KMT_CREDITS.length*32+H*2||(adv&&credits.t>60)){credits=null;state='over';showEnd('win')}}
// extra scene art for the epilogue
const _sceneArt=sceneArt;sceneArt=function(name,t){
 if(name==='medals'){const g=ctx.createLinearGradient(0,0,0,136);g.addColorStop(0,'#2a2a3a');g.addColorStop(1,'#5a4a4a');ctx.fillStyle=g;ctx.fillRect(0,0,W,136);
  // war map behind: red arrows everywhere, one tiny blue checkmark
  r(180,10,190,96,'#c8b48a');r(180,10,190,3,'#8a7450');for(let i=0;i<7;i++){const ax=196+i*24,ay=24+(i%3)*22;seg(ax,ay,ax+14,ay+18,3,'#b8322a');r(ax+12,ay+16,5,5,'#b8322a')}
  txt(tr('FRONT'),186,94,'#120d0c');
  r(40,112,110,24,'#6a4a2a');r(40,112,110,3,'#8a6a3a');
  drawSoldier(86,112,{fac:'kmt',face:1,emo:(t>>5)%2?'happy':'smug',gun:null,officer:0});
  for(let i=0;i<5;i++){r(89+i*2,100,1,2,'#c8372d');r(89+i*2,102,2,2,'#ffd24a')}
  drawSoldier(130,112,{fac:'kmt',face:-1,emo:'smug',officer:1,gun:null});
  r(8,30,150,26,'#120d0c');txt(tr('MISSIONS: 5/5'),14,34,'#9fe0a0');txt(tr('WAR: 0/1'),14,46,(t>>4)%2?'#ff6a5a':'#a8977c');
  if(t>60){r(114,98,12,7,'#e9dcc2');r(114,98,12,2,'#2f4f8a')}return}
 if(name==='dock'){const g=ctx.createLinearGradient(0,0,0,136);g.addColorStop(0,'#3a3a50');g.addColorStop(1,'#9a7a6a');ctx.fillStyle=g;ctx.fillRect(0,0,W,136);
  r(0,80,W,56,'#2a3a58');for(let i=0;i<22;i++)r((i*31+t*.3)%W,84+(i%6)*8,10,1,'#5a7aa0');
  // the gold ship, long gone over the horizon
  r(338,74,22,5,'#2a2a30');r(346,68,4,6,'#2a2a30');for(let k=0;k<3;k++)r(348+k*4+((t>>3)%2),60-k*5,3,3,'rgba(80,80,90,.7)');
  r(300,52,80,11,'#120d0c');txt(tr('GOLD →'),306,54,'#ffd24a');
  // overloaded boat
  r(160,92,130,16,'#4a3a30');r(160,92,130,3,'#6a5a48');r(166,108,118,4,'#3a2a22');r(250,62,12,30,'#3a3a3a');r(250,62,12,4,'#b8322a');
  for(let i=0;i<5;i++)drawSoldier(168+i*16,92,{fac:'kmt',face:1,emo:i%2?'cry':'scared',gun:null});
  for(let k=0;k<3;k++)r(254+k*3,52-k*7-((t>>2)%7),4,4,'rgba(60,60,60,.6)');
  // pier
  r(0,108,150,6,'#6a4a2a');for(let x=10;x<150;x+=30)r(x,114,4,22,'#4a3220');
  drawSoldier(118,108,{fac:'kmt',face:1,emo:'grit',gun:null});r(100,90,18,16,'#c8b48a');r(104,86,10,4,'#a89470');txt('¥',105,94,'#120d0c');
  r(14,40,96,30,'#e9dcc2');r(14,40,96,2,'#b8322a');txt(tr('TICKET'),22,44,'#120d0c');txt('¥'+fmtBig(5e6*Math.pow(1.12,Math.min(t,400)/5)),22,56,'#b8322a');return}
 if(name!=='strait')return _sceneArt(name,t);
 const g=ctx.createLinearGradient(0,0,0,136);g.addColorStop(0,'#2a3a5a');g.addColorStop(1,'#d08a5a');ctx.fillStyle=g;ctx.fillRect(0,0,W,136);
 r(0,96,W,40,'#2a4a70');for(let i=0;i<24;i++)r((i*31+t*.3)%W,100+(i%6)*5,10,1,'#6a8ab0');
 r(0,84,90,16,'#4a5a3a');r(300,84,84,16,'#3a5a3a');
 drawSoldier(30,88,{fac:'ccp',face:1,emo:(t>>5)%2?'shout':'determined',gun:null});drawSoldier(330,88,{fac:'kmt',face:-1,emo:(t>>5)%2?'determined':'shout',gun:null});
 r(50,70,10,6,'#888');r(326,70,10,6,'#888');
 if((t>>5)%2){drawShout(tr('ONE CHINA!'),100,60,false)}else drawShout(tr('ONE CHINA!'),280,60,false);
 drawDonkey({x:camX+170,y:100,face:1,hp:1,max:1,anim:0});r(150,100,80,6,'#6a4a2a')};
const _drawScene=drawScene;

// touch pads only during play/pause: story scenes, tallies and credits keep their text clear, and a tap anywhere advances them
let lastSt='';function syncStateClass(){if(state!==lastSt){lastSt=state;document.body.classList.toggle('noplay',state!=='play'&&state!=='pause')}}
addEventListener('pointerdown',e=>{if((state==='scene'||state==='tally'||state==='credits')&&!e.target.closest('button')){pressed.fire=1;initAudio()}});
/* ---------------- loop ---------------- */
loadLevel(0);music('off');fit();
let last=performance.now(),acc=0;
function loop(nowT){acc+=Math.min(100,nowT-last);last=nowT;syncStateClass();
 while(acc>=16.67){acc-=16.67;
  if(state==='play')update();
  else if(state==='title'){T++;ambient();camX=(camX+.4)%2400}
  else if(state==='scene')updScene();
  else if(state==='tally')updTally();
  else if(state==='credits'&&credits){credits.t++;T++}
  else if(state==='pause'||state==='over'){for(const k in pressed)delete pressed[k]}}
 if(state==='scene'&&scene)scene.complete=drawScene(scene.sc,scene.t);
 else if(state==='tally'&&tally)drawTally();
 else if(state==='credits'&&credits)drawCredits();
 else render();
 requestAnimationFrame(loop)}
(document.fonts?document.fonts.load(F):Promise.resolve()).catch(()=>{}).finally(()=>requestAnimationFrame(loop));
