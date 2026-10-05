/* ---------------- flow: scenes → mission → tally → scene → next ---------------- */
function progress(){return store.get('civslug-progress',{kmt:1,ccp:1})}
function unlock(i){const p=progress();p[S]=Math.max(p[S]||1,i+1);store.set('civslug-progress',p)}
function showScene(sc,done){$('#hud').hidden=true;state='scene';scene={sc,t:0,done};music('ending')}
function beginMission(i){LV=i;L=LEVELS[i];buildBG();const pre=SCENES[i].pre;if(pre)showScene(pre,()=>startPlay(i));else startPlay(i)}
function startPlay(i){loadLevel(i);state='play';$('#hud').hidden=false}
function missionComplete(){$('#hud').hidden=true;state='tally';music('off');SFX.fanfare();
 const bonusP=MS.freed*1000,bonusK=MS.kills*50,bonusN=MS.lost===0?10000:0;
 tally={t:0,rows:[['ENEMIES DISPATCHED',MS.kills,bonusK],['VILLAGERS UNTIED',MS.freed,bonusP],['DEFECTORS RECRUITED',MS.defects,MS.defects*300],[`${M().lives} SPENT`,MS.lost,bonusN]],total:bonusK+bonusP+MS.defects*300+bonusN,
  rank:MS.lost===0?'HERO OF THE (CORRECT) PEOPLE':MS.lost<3?'DECORATED (TIN MEDAL)':MS.lost<6?'ADEQUATE CANNON FODDER':'STATISTIC'};
 addScore(tally.total);unlock(LV+1)}
function afterTally(){const post=SCENES[LV].post;const next=()=>{if(LV+1<LEVELS.length)beginMission(LV+1);else ending()};if(post)showScene(post,next);else next()}
function ending(){const e=ENDING,side=e[S];store.set('civslug-cleared-'+S,true);
 showScene({date:e.date,place:e.place,fact:e.fact,joke:side.joke,draw:side.draw},()=>showScene({date:'AND THEN',place:'THE TAIWAN STRAIT',fact:e.last,joke:"The donkey, for the record, stayed neutral.",draw:'strait'},()=>{state='credits';credits={t:0};music('ending')}))}
function gameOver(){state='over';music('off');showEnd('over');if(AC){const t=now();[62,61,60,55].forEach((n,i)=>tone(mf(n),mf(n),.35,'square',.05,t+i*.3))}}
let endMode='over';
function showEnd(mode){endMode=mode;const m=M();$('#end').hidden=false;$('#hud').hidden=true;
 const pay=S==='kmt'?`¥${fmtBig(Math.max(0,score)*Math.pow(1.6,(LV*3000+T)/600))} Gold Yuan (≈ ${Math.max(0,score/60|0)} eggs)`:`${score} merit (your share: 0)`;
 $('#endH').textContent=mode==='win'?'THE WAR IS OVER (OFFICIALLY)':`OUT OF ${m.lives}`;
 $('#endP').textContent=mode==='win'?(S==='kmt'?"You've cleared the Nationalist campaign. Now try it from the other side of the river.":"You've cleared the Communist campaign. Now try it from the other side of the strait."):pick(m.over);
 $('#endS').innerHTML=`<dt>Reached</dt><dd>Mission ${LV+1}: ${LEVELS[LV].name}</dd><dt>Enemies dispatched</dt><dd>${totals.kills}</dd><dt>${m.lives==='CONSCRIPTS'?'Conscripts':'Comrades'} spent</dt><dd>${totals.lost}</dd><dt>Defectors gained</dt><dd>${totals.defects}</dd><dt>Villagers untied</dt><dd>${totals.freed}</dd><dt>${S==='kmt'?'Pay':'Merit'}</dt><dd>${pay}</dd>`;
 $('#e1').textContent=mode==='win'?'PLAY AGAIN':'DRAFT 3 MORE';$('#e2').textContent=mode==='win'?'PLAY THE OTHER SIDE':'DEFECT (SWITCH SIDES)';setTimeout(()=>$('#e1').focus(),50)}
$('#e1').addEventListener('click',()=>{$('#end').hidden=true;if(endMode==='win'){startCampaign(S,0);return}
 lives=2;state='play';$('#hud').hidden=false;music(boss?(boss.kind==='mech'?'final':'boss'):L.track);let x=clamp(P.x,camX+20,camX+W-40);if(groundAt(x+8)>1e3)x=raft?raft.x+raft.w/2-8:camX+60;newPlayer(x,-10);pop(x+8,60,'3 MORE DRAFTED. THEIR VILLAGE IS NOW EMPTY','#ffd24a',160)});
$('#e2').addEventListener('click',()=>{$('#end').hidden=true;openMissions(S==='kmt'?'ccp':'kmt')});
$('#e3').addEventListener('click',()=>{$('#end').hidden=true;toTitle()});
function toTitle(){state='title';$('#title').hidden=false;$('#hud').hidden=true;$('#missions').hidden=true;music('off');LV=0;L=LEVELS[0];buildBG();loadLevel(0);music('off')}
function startCampaign(side,i){initAudio();S=side;EN=side==='kmt'?'ccp':'kmt';score=0;lives=2;nextLife=30000;totals={kills:0,lost:0,freed:0,defects:0};
 $('#title').hidden=true;$('#missions').hidden=true;$('#end').hidden=true;fit();beginMission(i)}
function openMissions(side){selSide=side;const p=progress(),un=p[side]||1;
 if(un<=1){startCampaign(side,0);return}
 $('#title').hidden=true;$('#missions').hidden=false;$('#mH').textContent=(side==='kmt'?'NATIONALIST':'COMMUNIST')+' CAMPAIGN';
 const ml=$('#mlist');ml.innerHTML='';LEVELS.forEach((lv,i)=>{const b=document.createElement('button');b.className='mbtn';b.disabled=i>=un;
  b.innerHTML=`<b>M${i+1}</b><span>${lv.name}</span><small>${i<un?SCENES[i].pre.date:'LOCKED'}</small>`;b.addEventListener('click',()=>startCampaign(side,i));ml.appendChild(b)});
 setTimeout(()=>ml.querySelector('button:not(:disabled)')?.focus(),30)}
$('#mBack').addEventListener('click',()=>{$('#missions').hidden=true;$('#title').hidden=false});
function markSel(){document.querySelectorAll('.side').forEach(b=>b.classList.toggle('sel',b.dataset.side===selSide))}
document.querySelectorAll('.side').forEach(b=>{b.addEventListener('click',()=>{initAudio();openMissions(b.dataset.side)});b.addEventListener('mouseenter',()=>{selSide=b.dataset.side;markSel()})});
function togglePause(){if(state==='play'){state='pause';music('off')}else if(state==='pause'){state='play';music(boss?(boss.kind==='mech'?'final':'boss'):L.track)}}
$('#bPause').addEventListener('click',e=>{togglePause();e.currentTarget.blur()});
$('#bSnd').addEventListener('click',e=>{initAudio();setMute(!muted);e.currentTarget.textContent=muted?'MUTE':'SND';e.currentTarget.blur()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='play')togglePause()});
addEventListener('keydown',e=>{
 if(state==='title'&&$('#missions').hidden){if(e.code==='ArrowLeft'||e.code==='ArrowRight'){selSide=selSide==='kmt'?'ccp':'kmt';markSel();e.preventDefault()}else if(e.code==='Enter'){openMissions(selSide);e.preventDefault()}return}
 if(e.code==='KeyP'||e.code==='Escape'){togglePause();return}
 const k=KEYMAP[e.code];if(!k)return;if(document.activeElement&&document.activeElement.tagName==='BUTTON'&&!$('#end').hidden)return;e.preventDefault();if(!e.repeat&&!kb[k])pressed[k]=1;kb[k]=1;initAudio()});
addEventListener('keyup',e=>{const k=KEYMAP[e.code];if(k)kb[k]=0});

/* ---------------- non-play screens ---------------- */
function updScene(){scene.t++;T++;const adv=pressed.fire||pressed.jump||pressed.bomb;for(const k in pressed)delete pressed[k];
 if(scene.t%3===0&&scene.t<500)SFX.type();
 if(adv){if(!scene.complete)scene.t=9999;else{const d=scene.done;scene=null;d()}}}
function updTally(){tally.t++;T++;const adv=pressed.fire||pressed.jump;for(const k in pressed)delete pressed[k];if(tally.t%4===0&&tally.t<120)SFX.tally();if(adv&&tally.t>60){if(tally.t<150)tally.t=150;else{tally=null;afterTally()}}}
function drawTally(){r(0,0,W,H,'#120d0c');ctx.globalAlpha=.25;sceneArt(SCENES[LV].pre.draw,T);ctx.globalAlpha=1;r(0,0,W,H,'#120d0cc0');
 txt(`MISSION ${LV+1} COMPLETE`,W/2,18,'#ffd24a','center',F16);txt(L.name,W/2,40,'#a8977c','center');
 tally.rows.forEach((row,i)=>{if(tally.t<20+i*25)return;const y=64+i*18,cnt=Math.min(row[1],Math.floor((tally.t-20-i*25)/2));txt(row[0],30,y,'#e9dcc2');txt(String(cnt),250,y,'#e9dcc2','right');txt('+'+row[2],W-30,y,'#9fe0a0','right')});
 if(tally.t>130){txt('BONUS',30,142,'#ffd24a');txt('+'+tally.total,W-30,142,'#ffd24a','right');txt('RANK: '+tally.rank,W/2,166,'#ff9a6a','center')}
 if(tally.t>150&&T%40<26)txt('▶ CONTINUE',W/2,194,'#d9a441','center')}
function drawCredits(){credits.t++;T++;r(0,0,W,H,'#0b0808');for(let i=0;i<40;i++)r((i*53)%W,(i*37+credits.t*.2)%H,1,1,'#3a2a2a');
 CREDITS.forEach((l,i)=>{const y=H+10+i*16-credits.t*.5;if(y>-10&&y<H+10)txt(l,W/2,y,i===0?'#ffd24a':'#e9dcc2','center')});
 const adv=pressed.fire||pressed.jump;for(const k in pressed)delete pressed[k];
 if(credits.t>CREDITS.length*32+H*2||(adv&&credits.t>60)){credits=null;state='over';showEnd('win')}}
// extra scene art for the epilogue
const _sceneArt=sceneArt;sceneArt=function(name,t){if(name!=='strait')return _sceneArt(name,t);
 const g=ctx.createLinearGradient(0,0,0,136);g.addColorStop(0,'#2a3a5a');g.addColorStop(1,'#d08a5a');ctx.fillStyle=g;ctx.fillRect(0,0,W,136);
 r(0,96,W,40,'#2a4a70');for(let i=0;i<24;i++)r((i*31+t*.3)%W,100+(i%6)*5,10,1,'#6a8ab0');
 r(0,84,90,16,'#4a5a3a');r(300,84,84,16,'#3a5a3a');
 drawSoldier(30,88,{fac:'ccp',face:1,emo:(t>>5)%2?'shout':'determined',gun:null});drawSoldier(330,88,{fac:'kmt',face:-1,emo:(t>>5)%2?'determined':'shout',gun:null});
 r(50,70,10,6,'#888');r(326,70,10,6,'#888');
 if((t>>5)%2){drawShout('ONE CHINA!',100,60,false)}else drawShout('ONE CHINA!',280,60,false);
 drawDonkey({x:camX+170,y:100,face:1,hp:1,max:1,anim:0});r(150,100,80,6,'#6a4a2a')};
const _drawScene=drawScene;

/* ---------------- loop ---------------- */
loadLevel(0);music('off');fit();
let last=performance.now(),acc=0;
function loop(nowT){acc+=Math.min(100,nowT-last);last=nowT;
 while(acc>=16.67){acc-=16.67;
  if(state==='play')update();
  else if(state==='title'){T++;ambient();camX=(camX+.4)%2400}
  else if(state==='scene')updScene();
  else if(state==='tally')updTally();
  else if(state==='pause'||state==='over'){for(const k in pressed)delete pressed[k]}}
 if(state==='scene'&&scene)scene.complete=drawScene(scene.sc,scene.t);
 else if(state==='tally'&&tally)drawTally();
 else if(state==='credits'&&credits)drawCredits();
 else render();
 requestAnimationFrame(loop)}
(document.fonts?document.fonts.load(F):Promise.resolve()).catch(()=>{}).finally(()=>requestAnimationFrame(loop));
