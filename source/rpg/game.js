/* ===================== MING AN: EXPEDITION 48 — a Civil Slug turn-based RPG ===================== */
const ITEMS=[{id:'c1',x:6,z:22,k:'wine'},{id:'c2',x:19,z:32,k:'charm',c:'coupon'},{id:'c3',x:6,z:40,k:'balm'},{id:'c4',x:13.5,z:49,k:'charm',c:'watch'},{id:'c5',x:19,z:87.5,k:'charm',c:'pot'},{id:'c6',x:20,z:98,k:'wine'},{id:'c7',x:5.5,z:102,k:'charm',c:'card'}];
const CHARMS={coupon:{n:'RATION COUPON',d:'Party max HP +15%.',f:'Redeemable for rice. Rice not included.'},watch:{n:'LEND-LEASE WATCH',d:'Party speed +15%.',f:'American. Runs fast, like the currency.'},
 pot:{n:'THE COOKING POT',d:'Wider dodge and parry timing.',f:'Worn as a helmet. Previously used for rice. Tactical upgrade.'},card:{n:'PARTY MEMBERSHIP CARD',d:'Start every battle with +2 AP.',f:'Which party? Yes.'},
 lucky:{n:'LUCKY GOLD YUAN',d:'Double Gold Yuan from battles.',f:'Lucky because nobody wanted it.'}};
const IDESC={wine:{n:'RICE WINE',d:'+1 rice wine. Heals 50% in battle.',f:'Medicinal, according to the man who sold it.'},balm:{n:'TIGER BALM',d:'+1 tiger balm. Revives a fallen ally.',f:'Rub on wounds, bruises, and death.'},
 stamp:{n:'THE GENERAL\'S STAMP',d:'The road to the docks is open.',f:'Pressed on six thousand execution orders.'}};
const MSGS=[
 {x:10,z:2.5,t:['WASD WALK · CLICK TO CAPTURE MOUSE · SHIFT RUN · E USE','STICK WALKS · DRAG RIGHT SIDE TO LOOK · RUN · USE']},
 {x:15,z:2.5,t:['TOUCH AN ENEMY TO FIGHT. HIT J FIRST FOR AN AMBUSH.','TOUCH AN ENEMY TO FIGHT. PRESS STRIKE FIRST FOR AN AMBUSH.']},
 {x:11,z:6,t:'ENEMY TURN: PRESS DODGE THE MOMENT THE BLOW LANDS. THE RING SHOWS WHEN.'},
 {x:14,z:6,t:'PARRY IS TIGHTER THAN DODGE. PARRY EVERY HIT OF AN ATTACK TO COUNTER.'},
 {x:12.5,z:9.5,t:'SKILLS COST AP. ATTACK AND PARRY EARN AP. PRESS AT THE GOLD RING FOR A PERFECT.'},
 {x:7,z:20,t:'SUPPLIES AHEAD! (TRUST ME)'},{x:12.5,z:31.5,t:'AMAZING COMMISSAR AHEAD'},{x:12.5,z:43.5,t:'BE WARY OF LEFT. AND RIGHT. AND WATER.'},
 {x:12.5,z:62.3,t:'FOR THOSE WHO COME AFTER: BRING MORE MONEY'},{x:12.5,z:86.5,t:'SHOOT THE GLOWING WEAK POINT. IT IS ALWAYS THE WALLET.'},{x:12.5,z:104.3,t:'THE PRINTER AHEAD. THEREFORE, INFLATION'}];
const GROUPS=[
 {id:'g1',x:12.5,z:15,k:['conscript','pitch']},{id:'g3',x:6.5,z:21,k:['pitch','pitch','pitch']},{id:'mim',x:5.5,z:18.3,k:['mimic'],mimic:1},
 {id:'g2',x:12,z:26,k:['conscript','conscript','rifle']},{id:'g4',x:16.5,z:35,k:['shield','gren']},{id:'b1',x:12.5,z:38,boss:'commissar'},
 {id:'g5',x:12.5,z:51,k:['conscript','rifle','rifle']},{id:'g6',x:12.5,z:60,k:['shield','conscript','gren']},{id:'b2',x:12.5,z:73,boss:'ma'},
 {id:'g7',x:12,z:90,k:['shield','shield','rifle']},{id:'g8',x:9,z:97,k:['conscript','gren','pitch','conscript']},{id:'g9',x:15.5,z:100.5,k:['rifle','rifle','shield']},{id:'b3',x:12.5,z:115,boss:'printer'}];
const NEWS=['Prices rose 15% while you rested. The expedition\'s budget did not.','The Printer has painted a new number. It has more zeros than last time.','Government assures the Gold Yuan is stable. Rice now quoted per grain.','A wheelbarrow of Gold Yuan now buys a smaller wheelbarrow.'];

/* ---------------- party & enemies ---------------- */
const HEROES=[
 {id:'wang',name:'LAO WANG',role:'CONSCRIPT · DADAO',fac:'kmt',m:{fac:'kmt',wpn:'dadao',shield:'lid'},hp:150,atk:18,def:5,spd:9,melee:1,
  skills:[{id:'chop',n:'BIG SWORD CHOP',ap:2,lv:1,tg:'one',d:'One huge hit. Breaks guard.'},{id:'roar',n:'MTFK ROAR',ap:2,lv:1,tg:'none',d:'"DIE! CCP MTFK!" Party +30% damage, 2 turns.'},
   {id:'spin',n:'WHIRLWIND OF DEBT',ap:3,lv:3,tg:'all',d:'Hits every enemy twice.'},{id:'last',n:'LAST STAND',ap:4,lv:5,tg:'one',d:'Massive hit. Stronger the closer you are to death.'}]},
 {id:'hong',name:'LITTLE RED',role:'AGITATOR · MEGAPHONE',fac:'ccp',m:{fac:'ccp',wpn:null,shield:'mega'},hp:110,atk:14,def:3,spd:12,
  skills:[{id:'slogan',n:'SLOGAN BARRAGE',ap:2,lv:1,tg:'all',d:'Four slogans at random enemies.'},{id:'dress',n:'FIELD DRESSING',ap:2,lv:1,tg:'ally',d:'Heal one ally 45%.'},
   {id:'struggle',n:'STRUGGLE SESSION',ap:3,lv:2,tg:'all',d:'All enemies take +30% damage for 2 turns. May stun.'},{id:'rally',n:'RALLY THE MASSES',ap:4,lv:4,tg:'none',d:'Revive the fallen, heal everyone 35%.'}]},
 {id:'qian',name:'ACCOUNTANT QIAN',role:'BOOKKEEPER · RIFLE',fac:'civ',m:{fac:'civ',wpn:'rifle',civ:1,cl:0x5a4a3a,cl2:0x3a2e24},hp:100,atk:16,def:3,spd:11,
  skills:[{id:'aimed',n:'AIMED SHOT',ap:1,lv:1,tg:'one',d:'Always finds the weak point. +1 Inflation.'},{id:'audit',n:'AUDIT',ap:2,lv:1,tg:'one',d:'Mark an enemy: +30% damage taken, big break.'},
   {id:'press',n:'PRINTING PRESS',ap:1,lv:2,tg:'ally',d:'+2 Inflation. Give an ally 2 AP.'},{id:'hyper',n:'HYPERINFLATION',ap:3,lv:3,tg:'all',d:'Spend all Inflation. Damage grows with every stack.'}]}];
const EB={
 conscript:{name:'HOLLOW CONSCRIPT',hp:90,atk:14,def:2,spd:9,brk:60,xp:12,yuan:120,wpn:'rifle',bayo:1,moves:[{n:'BAYONET THRUST',hits:[34],m:1.1},{n:'DOUBLE JAB',hits:[32,16],m:.7}]},
 pitch:{name:'PITCHFORK MILITIA',hp:70,atk:12,def:1,spd:12,brk:40,xp:10,yuan:80,wpn:'fork',civ:1,fac:'straw',moves:[{n:'PITCHFORK FLURRY',hits:[28,11,11],m:.55}]},
 shield:{name:'POLICE WITH A DOOR',hp:150,atk:17,def:8,spd:6,brk:90,xp:18,yuan:160,wpn:'baton',sh:'door',fac:'civ',moves:[{n:'DOOR SLAM',hits:[56],m:1.5},{n:'BATON BEATING',hits:[30,20],m:.8}]},
 rifle:{name:'RIFLEMAN',hp:70,atk:15,def:2,spd:10,brk:50,xp:12,yuan:110,wpn:'rifle',ranged:1,moves:[{n:'AIMED SHOT',hits:[48],m:1.25},{n:'VOLLEY',hits:[32,12,12],m:.6}]},
 gren:{name:'GRENADIER',hp:60,atk:14,def:1,spd:8,brk:40,xp:12,yuan:100,wpn:null,ranged:1,moves:[{n:'STICK GRENADE',hits:[52],m:1.0,aoe:1}]},
 mimic:{name:'SUPPLY CRATE (HUNGRY)',hp:260,atk:19,def:6,spd:11,brk:80,xp:60,yuan:900,mimic:1,moves:[{n:'CHOMP CHOMP CHOMP',hits:[26,22,10],m:.8}]},
 commissar:{boss:1,name:'COMMISSAR WEI',sub:'SELF-CRITICISM ENFORCER',hp:620,atk:18,def:4,spd:10,brk:160,xp:120,yuan:2500,s:1.4,fac:'ccp',wpn:'sword',sh:'mega',officer:1,music:'duel',
  moves:[{n:'SELF-CRITICISM COMBO',hits:[30,14,44],m:.85},{n:'STRUGGLE SESSION',hits:[46],m:.9,aoe:1,word:1},{n:'RECTIFICATION',buff:1}]},
 ma:{boss:1,name:'GENERAL MA',sub:'EXECUTIONER OF DESERTERS',hp:1300,atk:24,def:6,spd:9,brk:220,xp:300,yuan:6000,s:1.9,fac:'kmt',wpn:'dadao',officer:1,music:'duel',
  moves:[{n:'EXECUTIONER COMBO',hits:[36,16,16,46],m:.75},{n:'LEAP SLAM',hits:[58],m:1.2,aoe:1},{n:'DESERTER CHARGE',hits:[30],m:1.9}],
  p2:[{n:'BURNING DADAO',hits:[30,10,10,10,34],m:.6},{n:'LEAP SLAM',hits:[50],m:1.3,aoe:1},{n:'EXECUTIONER COMBO',hits:[28,12,34,12],m:.85}]},
 printer:{boss:1,name:'THE PRINTER',sub:'PAINTER OF THE NUMBER',hp:2400,atk:26,def:8,spd:10,brk:300,xp:0,yuan:0,s:2.5,fac:'uni',wpn:'sack',sh:'mega',officer:1,music:'final',
  moves:[{n:'PRINT RUN',hits:[30,8,8,8,8,26],m:.45},{n:'DEVALUATION',hits:[54],aoe:1,pct:.42},{n:'PAINT THE NUMBER',paint:1}],
  p2:[{n:'PRINT RUN',hits:[26,7,7,7,7,7,7,22],m:.45},{n:'DEVALUATION',hits:[48],aoe:1,pct:.5},{n:'PAINT THE NUMBER',paint:1},{n:'MONEY HAMMER',hits:[40,40],m:1.1}]}};

/* ---------------- progress ---------------- */
let G=null;const SAVEK='mingan48.v1';function save(){store.set(SAVEK,G)}
function newProgress(){return{lvl:1,xp:0,yuan:300,inf:1,items:{wine:3,balm:1},charms:[],taken:[],cleared:[],boss:{},fire:0,lit:[0],seen:[],time:0,battles:0,parries:0,wipes:0,hp:null}}
const has=c=>G.charms.includes(c);
const xpNeed=()=>Math.round(40*Math.pow(G.lvl,1.5));
function heroStat(h,k){const L=G.lvl-1;let v=h[k];if(k==='hp')v=v*(1+.13*L)*(has('coupon')?1.15:1);else if(k==='atk')v=v*(1+.11*L);else if(k==='def')v=v+L*.6;else if(k==='spd')v=v*(has('watch')?1.15:1);return k==='hp'?Math.round(v):v}

/* ---------------- state ---------------- */
let PL=null,PMS=[],trail=[],wanderers=[],pops=[],banner=null,areaB=null,reading=null,itemBox=null,near=null,scene=null,ending=false;
let cy=0,cp=.42,camD=4.6,arena=null;
let B=null; // battle
const BX=60,BZ=40;
function mkPlayerModels(){for(const m of PMS)killMesh(m);PMS=HEROES.map(h=>mkChar(h.m))}

/* ---------------- explore ---------------- */
function spawnWanderers(){for(const w of wanderers)killMesh(w.m);wanderers=GROUPS.filter(g=>!G.cleared.includes(g.id)&&!(g.boss&&G.boss[g.boss])).map(g=>{
 const k=g.boss||g.k[0],d=EB[k];const m=d.mimic?mkMimic():mkChar({fac:d.fac||(k==='conscript'||k==='rifle'?(g.x>12.5?'ccp':'kmt'):'kmt'),wpn:d.wpn,bayo:d.bayo,shield:d.sh,s:d.s||1,officer:d.officer,civ:d.civ});
 return{g,m,x:g.x,z:g.z,fa:Math.PI,t:rnd()*200|0,ph:0,moving:0,boss:!!g.boss,s:d.s||1}})}
function respawn(i,warp){G.fire=i;const f=FIRES[i];PL={x:f.x,z:f.z+1,fa:0,state:'free',t:0,moving:0,ph:0,sprint:false};trail=[];cy=0;arena=null;LV=-1;setZone(zoneAt(PL.z));spawnWanderers();state='play';fadeA=1;music('off');ambSet();GLC.style.filter='';
 for(const m of fogMeshes){m.visible=!G.boss[m.userData.A.k]}if(touchUI)$('#touch').hidden=false;$('#react').hidden=true}
function updExplore(){const p=PL;p.t++;const v=inputVec();p.moving=0;p.sprint=!!held('run');
 if(p.state==='free'){if(v){const sp=(p.sprint?.09:.058)*v[2];move(p,v[0]*sp,v[1]*sp,.28,true);p.fa=turn(p.fa,Math.atan2(v[0],v[1]),.3);p.moving=v[2];if(p.t%(p.sprint?12:18)===0)X.step()}
  if(pressed.use&&near)interact(near);
  if(pressed.atk){p.strike=14;X.swing();const w=wanderers.find(w=>!w.boss&&Math.hypot(w.x-p.x,w.z-p.z)<3);if(w){startBattle(w.g,'ambush');return}}}
 else if(p.state==='fogwalk'){p.z+=.06;p.fa=0;p.moving=1;if(p.t>=50){p.state='free';arena=p.arena}}
 if(p.strike>0)p.strike--;
 trail.unshift([p.x,p.z]);if(trail.length>80)trail.pop();
 if(cell(p.x,p.z)==='~'){p.x=FIRES[G.fire].x;p.z=FIRES[G.fire].z+1;SFX.splash();pop(p.x,1.8,p.z,'THE RIVER DECLINES YOU','#9fc0dc')}
 for(const w of wanderers){w.t++;if(!w.boss&&!w.g.mimic){const ang=w.t*.012+w.g.x,tx=w.g.x+Math.cos(ang)*1.2,tz=w.g.z+Math.sin(ang*1.3)*1.2;const dx=tx-w.x,dz=tz-w.z,d=Math.hypot(dx,dz);if(d>.05){w.x+=dx/d*.012;w.z+=dz/d*.012;w.fa=Math.atan2(dx,dz);w.moving=1}else w.moving=0}
  else w.fa=turn(w.fa,Math.atan2(p.x-w.x,p.z-w.z),.03);
  const d=Math.hypot(w.x-p.x,w.z-p.z);if(d<(w.boss?1.6*w.s:1.1)&&p.state==='free'){startBattle(w.g,'normal');return}}
 findNear();setZone(zoneAt(p.z));if(held('camL'))cy+=.04;if(held('camR'))cy-=.04;if(held('camU'))cp=clamp(cp+.02,-.15,1.1);if(held('camD'))cp=clamp(cp-.02,-.15,1.1);
 if(touchUI&&p.moving&&!camDrag)cy=cy+angTo(cy,p.fa)*.012}
function findNear(){const p=PL;near=null;if(p.state!=='free')return;const d2=(x,z)=>Math.hypot(p.x-x,p.z-z);
 FIRES.forEach((f,i)=>{if(d2(f.x,f.z)<1.3)near={k:'fire',i,label:G.lit.includes(i)?'REST AT THE STOVE':'LIGHT THE STOVE'}});if(near)return;
 for(const it of ITEMS)if(!G.taken.includes(it.id)&&d2(it.x,it.z)<1){near={k:'item',o:it,label:'PICK UP'};return}
 for(const A of ARENAS)if(!G.boss[A.k]&&!arena&&p.z>A.fz-1.2&&p.z<A.fz&&p.x>11&&p.x<14){near={k:'fog',o:A,label:'ENTER THE FOG'};return}
 for(const m of MSGS)if(d2(m.x,m.z)<.8){near={k:'msg',o:m,label:'READ MESSAGE'};return}}
function interact(n){const p=PL;
 if(n.k==='fire')return restAt(n.i);
 if(n.k==='msg'){reading={m:n.o,t:0};SFX.radio();return}
 if(n.k==='item'){const it=n.o;G.taken.push(it.id);if(itemSpr[it.id])itemSpr[it.id].visible=false;if(it.k==='charm'){G.charms.push(it.c);itemBox={d:CHARMS[it.c],t:0}}else{G.items[it.k]++;itemBox={d:IDESC[it.k],t:0}}SFX.weapon();save();return}
 if(n.k==='fog'){p.state='fogwalk';p.t=0;p.arena=n.o;p.x=clamp(p.x,11.4,13.6);X.fog();return}}
function restAt(i){const first=!G.lit.includes(i);G.fire=i;if(first){G.lit.push(i);banner={t:0,dur:150,text:'TEA STOVE LIT',col:'#ffb04a',size:24};X.lit()}
 G.inf*=1.15;G.hp=null;G.cleared=G.cleared.filter(id=>GROUPS.find(g=>g.id===id).boss||id==='mim');spawnWanderers();save();music('ending');
 setTimeout(()=>{if(state==='play')openRest()},first?1200:300)}
const restEl=$('#rest');
function openRest(){state='rest';restEl.hidden=false;$('#touch').hidden=true;$('#tU').hidden=true;if(document.pointerLockElement)document.exitPointerLock();$('#restH').textContent=FIRES[G.fire].name;$('#restN').textContent='Party restored. '+pick(NEWS);refreshRest();setTimeout(()=>$('#restGo').focus(),50)}
function priceOf(k){return Math.round((k==='wine'?220:600)*G.inf)}
function refreshRest(){$('#restP').innerHTML=HEROES.map(h=>`<div class="pc"><b>${h.name}</b><span>${h.role}</span><span>LV ${G.lvl} · HP ${heroStat(h,'hp')} · ATK ${Math.round(heroStat(h,'atk'))} · SPD ${Math.round(heroStat(h,'spd'))}</span><span>Skills: ${h.skills.filter(s=>s.lv<=G.lvl).map(s=>s.n.toLowerCase()).join(', ')}</span></div>`).join('')+
 `<div class="pc" style="grid-column:1/-1"><span>XP ${G.xp} / ${xpNeed()} · Charms: ${G.charms.length?G.charms.map(c=>CHARMS[c].n).join(', '):'none yet'}</span></div>`;
 $('#restY').textContent='¥ '+fmtBig(G.yuan);const sh=$('#shop');sh.innerHTML='';
 for(const k of['wine','balm']){const b=document.createElement('button');const pr=priceOf(k);b.innerHTML=`<span>BUY ${IDESC[k].n} (have ${G.items[k]})</span><span>¥ ${fmtBig(pr)}</span>`;b.disabled=G.yuan<pr;b.onclick=()=>{if(G.yuan<pr)return;G.yuan-=pr;G.items[k]++;SFX.pick();save();refreshRest()};sh.appendChild(b)}}
$('#restGo').onclick=()=>{restEl.hidden=true;state='play';if(touchUI)$('#touch').hidden=false;music('off');PL.state='free'};

/* ---------------- battle stage ---------------- */
let stage=null;
function buildStage(){stage=new THREE.Group();S3.add(stage);
 const gcv=mk(64,64,g=>{R(g,0,0,64,64,'#3e3634');const R_=seeded(15);for(let y=0;y<64;y+=8)for(let x=(y/8%2)*4;x<64;x+=8)R(g,x+1,y+1,6,6,R_()<.5?'#5a5250':'#4e4644');for(let i=0;i<30;i++)R(g,R_()*64|0,R_()*64|0,2,2,'#2a2220')});
 const gt=tex(gcv,true);gt.repeat.set(8,6);const gm=new THREE.Mesh(new THREE.PlaneGeometry(26,20),LM({map:gt}));gm.rotation.x=-Math.PI/2;gm.position.set(BX,0,BZ);stage.add(gm);
 const R_=seeded(99);for(let i=0;i<16;i++){const a=-1.5+i*.2,rr=11+R_()*2,x=BX+Math.cos(a)*rr,z=BZ+Math.sin(a)*rr;const k=pick(['#','P','Q','W']);const h=2+R_()*2.5;const m=new THREE.Mesh(BOX,LM({map:tex(TEX[k],true)}));m.scale.set(2.2,h,2.2);m.position.set(x,h/2,z);m.rotation.y=-a;stage.add(m);
  if(R_()<.6){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex(flameCv[0]),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));s.scale.set(2,2.6,1);s.position.set(x,h+1,z);stage.add(s);flameSpr.push(s)}}
 for(let i=0;i<6;i++){const a=2+i*.4,x=BX+Math.cos(a)*9,z=BZ+Math.sin(a)*8;const m=new THREE.Mesh(BOX,LM({map:tex(PROPS.crate().n)}));m.scale.set(.9,.9,.9);m.position.set(x,.45,z);stage.add(m)}
 const L_=new THREE.PointLight(0xff8040,1.3,22,2);L_.position.set(BX+2,4,BZ-6);stage.add(L_);stage.visible=false}

/* ---------------- battle ---------------- */
function mkUnit(o){return Object.assign({buff:{},ko:false,act:'idle',t:0,next:0,ph:0,brk:0,broken:0,flash:0,id:Math.random()},o)}
function startBattle(g,mode){if(B)return;const isBoss=!!g.boss;state='battle';if(document.pointerLockElement)document.exitPointerLock();$('#touch').hidden=true;$('#tU').hidden=true;
 const hs=HEROES.map((h,i)=>{const mx=heroStat(h,'hp'),hp=G.hp?Math.min(mx,G.hp[i]):mx;return mkUnit({side:'h',h,name:h.name,m:PMS[i],hp,max:mx,ko:hp<=0,atk:heroStat(h,'atk'),def:heroStat(h,'def'),spd:heroStat(h,'spd'),ap:2+(has('card')?2:0),infl:0,x:BX-3.4-(i===1?.6:0),z:BZ-2.4+i*2.4,fa:Math.PI/2,s:1})});
 hs.forEach(u=>{u.hx=u.x;u.hz=u.z;if(u.ko)u.hp=0});
 const ks=isBoss?[g.boss]:g.k;const es=ks.map((k,i)=>{const d=EB[k];const n=ks.length;const z=BZ+(i-(n-1)/2)*2.3;const lv=1+(G.lvl-1)*.06;
  const m=d.mimic?mkMimic():mkChar({fac:d.fac||(i%2?'ccp':'kmt'),wpn:d.wpn,bayo:d.bayo,shield:d.sh,s:d.s||1,officer:d.officer,civ:d.civ});
  return mkUnit({side:'e',k,d,name:d.name,m,hp:Math.round(d.hp*lv),max:Math.round(d.hp*lv),atk:d.atk*lv,def:d.def,spd:d.spd,brkMax:d.brk,x:BX+3.2+(isBoss?1:Math.abs(i-(n-1)/2)*.5),z:isBoss?BZ:z,fa:-Math.PI/2,s:d.s||1,phase:1})});
 es.forEach(u=>{u.hx=u.x;u.hz=u.z});
 B={g,hs,es,mode,isBoss,turn:null,task:null,wait:0,waitFn:null,menu:null,sel:0,tsel:0,react:null,qte:null,aim:null,over:null,t:0,cam:{p:new THREE.Vector3(BX-9,3.4,BZ+7),l:new THREE.Vector3(BX+1,1,BZ)},log:null};
 for(const u of hs)u.next=100/u.spd*(mode==='ambush'?.3:1)+rnd()*2;for(const u of es)u.next=100/u.spd*(mode==='ambush'?1.6:1)+rnd()*3;
 if(mode==='ambush')for(const e of es)e.hp=Math.round(e.hp*.85);
 for(const w of wanderers)w.m.root.visible=false;stage.visible=true;fadeA=1;camera.position.copy(B.cam.p);camera.userData.l=B.cam.l.clone();
 music(isBoss?EB[g.boss].music:'m1');X.fog();SFX.alarm&&SFX.radio();
 banner=isBoss?{t:0,dur:150,text:EB[g.boss].name,sub:EB[g.boss].sub,col:'#e9dcc2',size:26}:{t:0,dur:80,text:mode==='ambush'?'AMBUSH!':'BATTLE',col:mode==='ambush'?'#ffd24a':'#e9dcc2',size:24};
 runTask(battleIntro())}
function* battleIntro(){yield isBossB()?110:50;nextTurn()}
const isBossB=()=>B&&B.isBoss;
const alive=a=>a.filter(u=>!u.ko&&u.hp>0);
function runTask(gen){B.task=gen;B.wait=0;B.waitFn=null}
function stepTask(){if(!B||!B.task)return;if(B.wait>0){B.wait--;return}if(B.waitFn){if(!B.waitFn())return;B.waitFn=null}
 const cur=B.task,r=cur.next();if(!B)return;if(r.done){if(B.task===cur)B.task=null;return}if(B.task!==cur)return;const v=r.value;if(typeof v==='number')B.wait=v;else if(typeof v==='function')B.waitFn=v}
function turnOrder(n=8){const all=alive(B.hs).concat(alive(B.es)).map(u=>({u,t:u.next}));const out=[];for(let i=0;i<n&&all.length;i++){all.sort((a,b)=>a.t-b.t);out.push(all[0].u);all[0].t+=100/effSpd(all[0].u)}return out}
const effSpd=u=>u.spd*(u.buff.slow?.7:1);
function nextTurn(){if(checkEnd())return;const all=alive(B.hs).concat(alive(B.es));all.sort((a,b)=>a.next-b.next);const u=all[0];const base=u.next;for(const o of all)o.next-=base;u.next+=100/effSpd(u);B.turn=u;
 for(const k in u.buff){u.buff[k]--;if(u.buff[k]<=0)delete u.buff[k]}
 if(u.side==='h'){if(u.broken){u.broken=0}B.menu={lv:'main'};B.sel=0;camHero(u)}else runTask(enemyTurn(u))}
function checkEnd(){if(!alive(B.es).length){runTask(victory());return true}if(!alive(B.hs).length){runTask(defeat());return true}return false}
function endAction(){B.menu=null;B.aim=null;B.qte=null;B.react=null;$('#react').hidden=true;camOverview();runTask((function*(){yield 18;nextTurn()})())}
// camera helpers
function camOverview(){B.cam.p.set(BX-9,3.4,BZ+7);B.cam.l.set(BX+1,1,BZ)}
function camHero(u){B.cam.p.set(BX-8.5,3.1,u.z*.5+BZ*.5+5.5);B.cam.l.set(BX+1.5,1,u.z*.3+BZ*.7)}
function camOn(a,b){const mx=(a.x+b.x)/2,mz=(a.z+b.z)/2,k=Math.max(a.s||1,b.s||1);B.cam.p.set(mx-2,2.6+k*.6,mz+6+k*1.8);B.cam.l.set(mx,1+k*.25,mz)}
// movement
function* runTo(u,x,z,f=22){const sx=u.x,sz=u.z;u.fa=Math.atan2(x-sx,z-sz);for(let i=1;i<=f;i++){u.x=lerp(sx,x,i/f);u.z=lerp(sz,z,i/f);u.act='run';u.ph+=.35;yield 1}u.act='idle'}
function* runBack(u){yield* runTo(u,u.hx,u.hz,20);u.fa=u.side==='h'?Math.PI/2:-Math.PI/2}
// damage
function dmgCalc(a,t,mul){const raw=a.atk*mul*(a.buff.rage?1.3:1)*(a.buff.rally?1.15:1)*(t.buff.mark?1.3:1)*(t.broken?1.5:1)*(.92+rnd()*.16);return Math.max(1,Math.round(raw*100/(100+t.def*6)))}
function hitUnit(t,n,o={}){if(t.ko)return;t.hp=Math.max(0,t.hp-n);t.flash=8;X.flesh();blood(t.x,1*t.s,t.z,o.big?24:10);shake=Math.max(shake,o.big?8:3);hs=Math.max(hs,o.big?6:3);
 pop(t.x,1.6*t.s+.2,t.z,String(n),o.crit?'#ffd24a':t.side==='h'?'#ff6a5a':'#fff');
 if(t.side==='e'&&!t.broken&&o.brk){t.brk+=o.brk;if(t.brk>=t.brkMax){t.brk=0;t.broken=1;t.next+=100/t.spd;pop(t.x,2.1*t.s,t.z,'BROKEN!','#ffd24a');SFX.clang();if(t.k==='printer')for(const h of B.hs)h.paint=0}}
 if(t.side==='e'&&t.d.p2&&t.phase===1&&t.hp<t.max*.5&&t.hp>0){t.phase=2;t.spd*=1.15;banner={t:0,dur:120,text:t.k==='ma'?'THE GENERAL IS ANGRY':'HYPERINFLATION',sub:t.k==='ma'?'HIS DADAO IS ON FIRE. SO IS EVERYTHING ELSE.':'THE NUMBERS ARE GROWING',col:'#ff8a3a',size:22};music('final')}
 if(t.hp<=0){t.ko=true;t.act='ko';t.t=0;if(t.side==='e'){X.coin();blood(t.x,.8,t.z,30)}else{pop(t.x,2,t.z,'DOWN','#ff6a5a')}}}
function heal(t,n){if(t.ko)return;t.hp=Math.min(t.max,t.hp+n);pop(t.x,1.8,t.z,'+'+n,'#9fe0a0');for(let i=0;i<12;i++)fx.push({x:t.x+(rnd()-.5)*.6,y:rnd()*1.4,z:t.z+(rnd()-.5)*.6,vx:0,vy:.02,vz:0,l:30,c:'#9fe0a0',g:0,f:1})}
// QTE ring
function* qte(t,dur=44){B.qte={t:0,dur,u:t,res:null};while(B.qte.t<dur+10&&!B.qte.res){B.qte.t++;yield 1}const res=B.qte.res||'MISS';B.qte=null;
 pop(t.x,2.2*t.s,t.z,res==='PERFECT'?'PERFECT!':res==='GOOD'?'GOOD':'',res==='PERFECT'?'#ffd24a':'#e9dcc2');if(res==='PERFECT')X.parry();return res==='PERFECT'?1.5:res==='GOOD'?1.2:1}
function qtePress(){const q=B.qte;if(!q||q.res)return;const d=Math.abs(q.dur-q.t);q.res=d<=4?'PERFECT':d<=10?'GOOD':'MISS'}
// hero actions
function heroAct(u,kind,sk,tg){B.menu=null;runTask(heroActGen(u,kind,sk,tg))}
function* heroActGen(u,kind,sk,tg){
 if(kind==='attack'){const t=tg;camOn(u,t);if(u.h.melee||u.h.id==='hong'&&false){yield* runTo(u,t.x-1.1-.4*t.s,t.z);u.act='swing';u.t=0;X.swing();yield 8;hitUnit(t,dmgCalc(u,t,1),{brk:10});yield 16;yield* runBack(u)}
  else if(u.h.id==='hong'){u.act='shout';u.t=0;yield 10;yield* wordFly(u,t,pick(['DOWN WITH LANDLORDS!','READ A PAMPHLET!','LONG LIVE MILLET!']));hitUnit(t,dmgCalc(u,t,1),{brk:10});yield 16}
  else{u.act='aim';u.t=0;yield 14;yield* shot(u,t);hitUnit(t,dmgCalc(u,t,1),{brk:10});yield 16}
  u.ap=Math.min(9,u.ap+1);u.act='idle';return endAction()}
 if(kind==='item'){const it=sk;G.items[it]--;u.act='cast';yield 16;if(it==='wine'){heal(tg,Math.round(tg.max*.5));X.heal()}else{tg.ko=false;tg.hp=Math.round(tg.max*.35);tg.act='idle';heal(tg,0);X.heal();pop(tg.x,2.1,tg.z,'REVIVED','#9fe0a0')}yield 20;u.act='idle';return endAction()}
 if(kind==='shoot'){u.ap-=1;const t=tg;camOn(u,t);u.act='aim';B.aim={t:0,u:t,res:null};while(!B.aim.res&&B.aim.t<240){B.aim.t++;yield 1}const res=B.aim.res||'MISS';B.aim=null;yield* shot(u,t);
  if(res==='WEAK'){hitUnit(t,dmgCalc(u,t,2.6),{brk:35,crit:1,big:1});pop(t.x,2.4*t.s,t.z,'WEAK POINT!','#ffd24a')}else hitUnit(t,dmgCalc(u,t,.8),{brk:5});yield 20;u.act='idle';return endAction()}
 // skills
 u.ap-=sk.ap;banner={t:0,dur:70,text:sk.n,col:'#ffd24a',size:16,small:1};const t=tg;
 switch(sk.id){
 case 'chop':{camOn(u,t);yield* runTo(u,t.x-1.1-.4*t.s,t.z);u.act='raise';const q=yield* qte(t);u.act='swing';u.t=0;X.heavy();yield 6;hitUnit(t,dmgCalc(u,t,2.2*q),{brk:40,big:1,crit:q>1.4});yield 18;yield* runBack(u);break}
 case 'roar':{u.act='roar';u.shout={s:'DIE! CCP MTFK!',t:80};shake=10;SFX.alarm();for(const h of alive(B.hs))h.buff.rage=3;yield 60;break}
 case 'spin':{camOverview();yield* runTo(u,BX+1.2,BZ);u.act='raise';const q=yield* qte(alive(B.es)[0]||u);for(let k=0;k<2;k++){u.act='spin';X.swing();yield 10;for(const e of alive(B.es))hitUnit(e,dmgCalc(u,e,.9*q),{brk:15})}yield 16;yield* runBack(u);break}
 case 'last':{camOn(u,t);yield* runTo(u,t.x-1.1-.4*t.s,t.z);u.act='raise';u.shout={s:'FOR MY BACK PAY!',t:70};const q=yield* qte(t,40);u.act='swing';X.heavy();yield 6;hitUnit(t,dmgCalc(u,t,(3+(1-u.hp/u.max)*3)*q),{brk:70,big:1,crit:q>1.4});yield 20;yield* runBack(u);break}
 case 'slogan':{u.act='shout';const q=yield* qte(alive(B.es)[0]||u,36);for(let k=0;k<4;k++){const e=pick(alive(B.es));if(!e)break;yield* wordFly(u,e,pick(['LAND TO THE TILLER!','DOWN WITH INFLATION!','SURRENDER, WE HAVE FORMS!','SERVE THE PEOPLE!']),14);hitUnit(e,dmgCalc(u,e,.6*q),{brk:12})}break}
 case 'dress':{u.act='cast';yield 20;heal(t,Math.round(t.max*.45));X.heal();delete t.buff.slow;yield 20;break}
 case 'struggle':{u.act='shout';u.shout={s:'CONFESS YOUR CRIMES!',t:70};yield 24;for(const e of alive(B.es)){e.buff.mark=3;hitUnit(e,dmgCalc(u,e,.4),{brk:10});if(!e.d.boss&&rnd()<.35){e.next+=100/e.spd;pop(e.x,2.2*e.s,e.z,'STUNNED','#ffd24a')}}yield 24;break}
 case 'rally':{u.act='roar';u.shout={s:'RISE, COMRADES! ALL OF YOU!',t:80};yield 24;for(const h of B.hs){if(h.ko){h.ko=false;h.hp=1;h.act='idle'}heal(h,Math.round(h.max*.35));h.buff.rally=2}X.heal();yield 30;break}
 case 'aimed':{camOn(u,t);u.act='aim';const q=yield* qte(t,40);yield* shot(u,t);hitUnit(t,dmgCalc(u,t,1.7*q),{brk:22,crit:q>1.4});u.infl++;yield 16;break}
 case 'audit':{u.act='cast';yield 20;t.buff.mark=4;t.brk=Math.min(t.brkMax-1,t.brk+45);pop(t.x,2.2*t.s,t.z,'AUDITED','#ffd24a');SFX.radio();yield 24;break}
 case 'press':{u.act='cast';u.infl+=2;yield 20;t.ap=Math.min(9,t.ap+2);pop(t.x,2,t.z,'+2 AP','#ffd24a');pop(u.x,2.2,u.z,'INFLATION +2','#d9a441');yield 20;break}
 case 'hyper':{camOverview();u.act='aim';u.shout={s:'SPEND IT BEFORE IT ROTS!',t:70};const q=yield* qte(alive(B.es)[0]||u,40);const st=u.infl;u.infl=0;for(let i=0;i<20;i++)fx.push({x:BX+(rnd()-.5)*8,y:4+rnd()*2,z:BZ+(rnd()-.5)*8,vx:0,vy:-.05,vz:0,l:70,c:pick(['#b0a070','#8aa070','#d9a441']),g:0});
  yield 30;for(const e of alive(B.es))hitUnit(e,dmgCalc(u,e,(.5+.45*Math.pow(st,1.25))*q),{brk:10+st*4,big:st>3});yield 20;break}}
 u.act='idle';endAction()}
function* shot(u,t){u.act='fire';SFX.shot();for(let i=0;i<10;i++)fx.push({x:u.x+.6,y:1,z:u.z,vx:(t.x-u.x)/12,vy:0,vz:(t.z-u.z)/12,l:12,c:'#ffe27a',g:0,f:1});yield 10;u.act='aim'}
function* wordFly(u,t,txt_,f=22){const c=wordSprite(txt_).n;const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex(c),depthWrite:false}));sp.scale.set(c.width/c.height*.4,.4,1);S3.add(sp);SFX.word();
 for(let i=0;i<=f;i++){const k=i/f;sp.position.set(lerp(u.x,t.x,k),1.4+Math.sin(k*Math.PI)*.8,lerp(u.z,t.z,k));yield 1}S3.remove(sp)}
// enemy turn
function* enemyTurn(e){yield 10;
 if(e.broken){e.broken=0;pop(e.x,2.2*e.s,e.z,'RECOVERING','#a8977c');yield 30;return endAction()}
 if(e.k==='printer'){for(const h of alive(B.hs))if(h.paint>0){h.paint--;if(h.paint===0){camOn(e,h);banner={t:0,dur:90,text:'ERASED',sub:h.name+' WAS WORTH LESS THAN THE NUMBER',col:'#e9dcc2',size:24};yield 30;
   for(let i=0;i<40;i++)fx.push({x:h.x+(rnd()-.5)*.6,y:rnd()*1.6,z:h.z+(rnd()-.5)*.6,vx:(rnd()-.5)*.02,vy:.03,vz:(rnd()-.5)*.02,l:60,c:'#e9dcc2',g:0});h.hp=0;h.ko=true;h.act='ko';yield 50;if(checkEnd())return}}
  if(e.phase===2){e.atk*=1.06;pop(e.x,2.8*e.s,e.z,'ATK +6%','#ff8a3a')}}
 const moves=e.phase===2&&e.d.p2?e.d.p2:e.d.moves;let mv=pick(moves);if(mv.paint&&alive(B.hs).filter(h=>!h.paint).length===0)mv=moves[0];if(mv.buff&&e.buff.rect)mv=moves[0];
 B.log={n:mv.n,t:0};
 if(mv.buff){e.act='roar';e.shout={s:'I CRITICIZE MYSELF... AND FEEL STRONGER!',t:80};yield 40;e.buff.rect=3;e.atk*=1.2;heal(e,Math.round(e.max*.1));yield 30;e.act='idle';return endAction()}
 if(mv.paint){const h=pick(alive(B.hs).filter(h=>!h.paint));camOn(e,h);e.act='roar';e.shout={s:'YOUR NUMBER IS 48.',t:80};yield 40;h.paint=3;pop(h.x,2.4,h.z,'PAINTED: 48','#e9dcc2');SFX.radio();yield 40;e.act='idle';return endAction()}
 const tgs=mv.aoe?alive(B.hs):[pickTarget()];const t=tgs[0];
 if(mv.aoe)camOverview();else camOn(e,t);
 const melee=!e.d.ranged&&!mv.aoe&&!mv.word;
 if(melee)yield* runTo(e,t.x+1.1+.4*e.s,t.z,24);else e.fa=Math.atan2(t.x-e.x,t.z-e.z);
 e.act='wind';e.t=0;yield 10;
 let parries=0;
 for(let i=0;i<mv.hits.length;i++){const res=yield* reactHit(e,tgs,mv.hits[i],mv,i===mv.hits.length-1);if(res==='parry')parries++;if(!alive(B.hs).length)break}
 e.act='idle';yield 14;if(melee)yield* runBack(e);
 if(!mv.aoe&&parries===mv.hits.length&&!t.ko){B.log={n:'COUNTER!',t:0};camOn(t,e);yield* runTo(t,e.x-1.1-.4*e.s,e.z,16);t.act='swing';X.heavy();yield 6;hitUnit(e,dmgCalc(t,e,1.6),{brk:30,big:1});yield 16;yield* runBack(t);t.act='idle'}
 endAction()}
function pickTarget(){const a=alive(B.hs);return rnd()<.4?a.reduce((m,h)=>h.hp/h.max<m.hp/m.max?h:m,a[0]):pick(a)}
function* reactHit(e,tgs,lead,mv,last){const rr={t:0,lead,press:null,tgs,aoe:!!mv.aoe};B.react=rr;$('#react').hidden=false;
 while(rr.t<lead){rr.t++;if(rr.t===lead-8)e.act='strike';yield 1}
 if(mv.aoe&&!mv.word){boomFx(BX-3.6,BZ);}if(mv.word){for(const h of tgs)spark(h.x,1.2,h.z,10,'#ff6a5a')}
 const pw=6+(has('pot')?3:0),dw=13+(has('pot')?4:0);let res='hit';
 if(rr.press){const diff=lead-rr.press.t;if(rr.press.k==='parry'&&diff>=-1&&diff<=pw)res='parry';else if(rr.press.k==='dodge'&&diff>=-1&&diff<=dw)res='dodge'}
 for(const h of tgs){if(h.ko)continue;
  if(res==='parry'){X.parry();spark(h.x+.4,1.1,h.z,20,'#ffd24a');pop(h.x,2,h.z,'PARRY!','#ffd24a');h.ap=Math.min(9,h.ap+1);G.parries++;hs=Math.max(hs,5);h.act='parry';h.t=0}
  else if(res==='dodge'){X.roll();pop(h.x,2,h.z,'DODGE','#9fd3ff');h.act='dodge';h.t=0}
  else{const n=mv.pct?Math.round(h.max*mv.pct):dmgCalc(e,h,mv.m);hitUnit(h,n,{big:mv.hits.length===1});h.act=h.ko?'ko':'hurt';h.t=0}}
 B.react=null;if(last)$('#react').hidden=true;yield 6;return res}
function boomFx(x,z){SFX.boom();shake=10;for(let i=0;i<50;i++){const a=rnd()*TAU,v=rnd()*.14;fx.push({x:x+(rnd()-.5)*2,y:.3,z:z+(rnd()-.5)*4,vx:Math.cos(a)*v,vy:rnd()*.14,vz:Math.sin(a)*v,l:20+rnd()*25,c:pick(['#ffe27a','#ff8a1a','#ff5a1a','#555']),g:.004,f:1})}}
function reactPress(k){const rr=B&&B.react;const btn=k==='dodge'?$('#bDodge'):$('#bParry');btn.classList.add('on');setTimeout(()=>btn.classList.remove('on'),120);if(!rr||rr.press)return;rr.press={k,t:rr.t}}
function* victory(){B.over='win';yield 40;const xp=B.es.reduce((s,e)=>s+(e.d.xp||0),0),yu=Math.round(B.es.reduce((s,e)=>s+(e.d.yuan||0),0)*G.inf*(has('lucky')?2:1));
 G.xp+=xp;G.yuan+=yu;G.battles++;let lv=0;while(G.xp>=xpNeed()){G.xp-=xpNeed();G.lvl++;lv++}
 banner={t:0,dur:150,text:B.isBoss?(B.g.boss==='printer'?'THE PRINTER IS BROKEN':'BOSS DEFEATED'):'VICTORY',sub:`+${xp} XP · +¥${fmtBig(yu)}`+(lv?` · LEVEL UP! LV ${G.lvl}`:''),col:'#d9a441',size:24};
 X.felled();music('off');for(const h of B.hs){h.act=h.ko?'ko':'cheer';h.emo='happy'}yield 160;
 const g=B.g;if(g.boss)G.boss[g.boss==='ma'?'ma':g.boss==='printer'?'bros':g.boss]=1;G.cleared.push(g.id);
 if(g.mimic&&!G.charms.includes('lucky')){G.charms.push('lucky');itemBox={d:CHARMS.lucky,t:0}}
 if(g.boss==='ma')itemBox={d:IDESC.stamp,t:0};
 G.hp=B.hs.map(h=>h.ko?1:h.hp);save();const fin=g.boss==='printer';endBattle();if(fin)finish()}
function* defeat(){B.over='lose';yield 30;banner={t:0,dur:200,text:'EXPEDITION 48 HAS FALLEN',sub:'FOR THOSE WHO COME AFTER: BRING MORE MONEY',col:'#b3261e',size:20};X.died();music('off');GLC.style.filter='grayscale(.8)';yield 220;
 G.wipes++;G.yuan=Math.round(G.yuan/2);G.hp=null;endBattle();respawn(G.fire,true);pop(PL.x,1.8,PL.z,'YOUR SAVINGS WERE DEVALUED 50%','#a8977c');save()}
function endBattle(){for(const e of B.es)killMesh(e.m);stage.visible=false;$('#react').hidden=true;
 B.hs.forEach(h=>{h.m.root.rotation.set(0,0,0)});B=null;state='play';fadeA=1;spawnWanderers();if(touchUI)$('#touch').hidden=false}

/* ---------------- battle input & menus ---------------- */
function menuItems(u){const lv=B.menu.lv;
 if(lv==='main')return[{l:'ATTACK',s:'+1 AP',f:()=>pickTarget2('enemy',t=>heroAct(u,'attack',null,t))},{l:'SKILLS',s:'',f:()=>{B.menu={lv:'skills'};B.sel=0}},{l:'SHOOT',s:'1 AP · AIM',dis:u.ap<1,f:()=>pickTarget2('enemy',t=>heroAct(u,'shoot',null,t))},{l:'ITEMS',s:'',f:()=>{B.menu={lv:'items'};B.sel=0}}];
 if(lv==='skills')return u.h.skills.filter(s=>s.lv<=G.lvl).map(s=>({l:s.n,s:s.ap+' AP',d:s.d,dis:u.ap<s.ap,f:()=>{if(s.tg==='one')pickTarget2('enemy',t=>heroAct(u,'skill',s,t));else if(s.tg==='ally')pickTarget2(s.id==='press'?'allyOther':'ally',t=>heroAct(u,'skill',s,t));else heroAct(u,'skill',s,null)}}));
 if(lv==='items')return[{l:'RICE WINE ×'+G.items.wine,s:'HEAL 50%',dis:!G.items.wine,f:()=>pickTarget2('ally',t=>heroAct(u,'item','wine',t))},{l:'TIGER BALM ×'+G.items.balm,s:'REVIVE',dis:!G.items.balm||!B.hs.some(h=>h.ko),f:()=>pickTarget2('dead',t=>heroAct(u,'item','balm',t))}];
 if(lv==='target')return[];return[]}
function pickTarget2(kind,cb){const u=B.turn;let list=kind==='enemy'?alive(B.es):kind==='dead'?B.hs.filter(h=>h.ko):kind==='allyOther'?alive(B.hs).filter(h=>h!==u):alive(B.hs);if(!list.length)return;B.menu={lv:'target',list,cb,prev:B.menu.lv};B.tsel=0;SFX.tally()}
function menuNav(k){if(!B||!B.menu||B.task)return;const u=B.turn;
 if(B.menu.lv==='target'){const L_=B.menu.list;if(k==='up'||k==='left')B.tsel=(B.tsel+L_.length-1)%L_.length;else if(k==='down'||k==='right')B.tsel=(B.tsel+1)%L_.length;else if(k==='ok'){const cb=B.menu.cb,t=L_[B.tsel];SFX.pick();cb(t)}else if(k==='back'){B.menu={lv:B.menu.prev};B.sel=0}SFX.tally();return}
 const it=menuItems(u);if(k==='up')B.sel=(B.sel+it.length-1)%it.length;else if(k==='down')B.sel=(B.sel+1)%it.length;else if(k==='ok'){const m=it[B.sel];if(m&&!m.dis){SFX.pick();m.f()}else SFX.clang()}else if(k==='back'&&B.menu.lv!=='main'){B.menu={lv:'main'};B.sel=0}SFX.tally()}

/* ---------------- syncing meshes ---------------- */
function heroEmoU(u){if(u.ko)return'dead';if(u.flash>0||u.act==='hurt')return'hurt';if(u.act==='cheer')return'happy';if(u.shout||u.act==='roar'||u.act==='swing')return'shout';if(u.act==='raise'||u.act==='aim'||u.act==='wind'||u.act==='strike')return'grit';if(u.paint)return'scared';if(u.hp<u.max*.25)return'scared';return(T+(u.id*500|0))%200<6?'blink':'determined'}
function poseUnit(u){const c=u.m;if(!c)return;u.t++;if(u.flash>0)u.flash--;
 if(c.mimic){c.root.position.set(u.x,u.ko?-Math.min(.8,u.t/60):.25,u.z);c.root.rotation.y=u.fa;c.lidG.rotation.x=u.act==='strike'||u.act==='wind'?-1:-.3;c.legs.forEach((l,i)=>{l.visible=true;l.rotation.x=u.act==='run'?Math.sin(T*.4+i*3)*.6:0});flash(c,u.flash>0&&T%3<2);return}
 c.root.position.set(u.x,0,u.z);c.root.rotation.y=u.fa;c.root.visible=!(u.side==='e'&&u.ko&&u.t>90);
 const a=u.act,t=u.t,P_={walk:a==='run'?1:0,ph:u.ph};
 if(a==='swing'){P_.aR=lerp(-2.8,.4,t/6);P_.lean=.3}else if(a==='raise'){P_.aR=-2.9;P_.lean=-.15}else if(a==='spin'){P_.aR=-1.5;P_.zR=1.4;c.root.rotation.y=u.fa+t*.6}
 else if(a==='roar'||a==='cheer'){P_.aR=-2.7;P_.aL=-2.7;P_.lean=-.2;if(a==='cheer')c.root.position.y=Math.abs(Math.sin(T*.15))*.25}else if(a==='shout'){P_.aL=-1.6;P_.lean=.1}else if(a==='cast'){P_.aR=-1.8;P_.aL=-1.8}
 else if(a==='aim'||a==='fire'){P_.aR=-1.55;P_.aL=-1.45;if(a==='fire')P_.lean=-.1}else if(a==='wind'){P_.aR=-2.6;P_.lean=-.2}else if(a==='strike'){P_.aR=.3;P_.lean=.35}
 else if(a==='hurt'){P_.lean=-.4;if(t>20)u.act='idle'}else if(a==='dodge'){c.root.position.x-=Math.sin(Math.min(1,t/12)*Math.PI)*(u.side==='h'?.9:-.9);P_.crouch=.15;P_.lean=-.2;if(t>16)u.act='idle'}
 else if(a==='parry'){P_.aR=-1.2;P_.aL=-1.6;P_.lean=.1;if(t>18)u.act='idle'}
 else if(a==='ko'){P_.roll=-Math.min(1,t/20)*Math.PI/2;P_.crouch=.3}
 else if(B&&B.turn===u&&!B.task)P_.aR=-1;
 pose(c,P_);flash(c,u.flash>0&&T%3<2);
 if(u.side==='h')setEmo(c,heroEmoU(u));else setEmo(c,u.ko?'dead':u.act==='wind'||u.act==='strike'?'shout':u.broken?'hurt':u.flash>0?'hurt':u.buff.rect?'smug':'grit');
 if(u.shout&&--u.shout.t<=0)u.shout=null;
 if(u.d&&u.k==='ma'&&u.phase===2&&c.blade)c.blade.material.emissive.setHex(T%6<3?0xff6a1a:0xcc4400)}
const v3=new THREE.Vector3();
let camDrag=false;
function syncExplore(){const p=PL;
 const tx=p.x,ty=1.35,tz=p.z;let dd=camD;const ox=-Math.sin(cy)*Math.cos(cp),oy=Math.sin(cp),oz=-Math.cos(cy)*Math.cos(cp);
 for(let s=.2;s<=camD;s+=.1){const x=tx+ox*s,y=ty+oy*s,z=tz+oz*s,c=cell(x,z);if(c===undefined||isWall(c)&&y<WALLH[c]+.1){dd=Math.max(.6,s-.25);break}}
 camera.position.set(tx+ox*dd,ty+oy*dd,tz+oz*dd);camera.lookAt(tx,ty+.25,tz);
 // party
 const spots=[[p.x,p.z],trail[26]||[p.x-.5,p.z-1],trail[52]||[p.x+.5,p.z-1.8]];
 PMS.forEach((c,i)=>{const[x,z]=spots[i];const o=c._o||(c._o={x,z,fa:0,ph:0});const dx=x-o.x,dz=z-o.z,d=Math.hypot(dx,dz);if(i===0){o.x=x;o.z=z;o.fa=p.fa}else{o.x=x;o.z=z;if(d>.001)o.fa=Math.atan2(dx,dz)}
  const mv=i===0?p.moving:d>.005;o.ph+=mv?(p.sprint?.32:.22):0;c.root.position.set(o.x,0,o.z);c.root.rotation.set(0,o.fa,0);c.root.visible=true;
  pose(c,{walk:mv?1:0,ph:o.ph,aR:i===0&&p.strike>0?lerp(.4,-2.6,p.strike/14):undefined});setEmo(c,i===0&&p.strike>0?'shout':(T+i*70)%200<6?'blink':'determined')});
 for(const w of wanderers){const c=w.m;if(c.mimic){c.root.position.set(w.x,0,w.z);c.root.rotation.y=w.fa;c.root.visible=true;continue}w.ph+=w.moving?.18:0;c.root.position.set(w.x,0,w.z);c.root.rotation.y=w.fa;c.root.visible=true;pose(c,{walk:w.moving?1:0,ph:w.ph,aR:-1.2});
  const dd_=Math.hypot(w.x-p.x,w.z-p.z);setEmo(c,dd_<4?'grit':w.boss?'smug':'normal')}
 commonSync()}
function commonSync(){stoveObjs.forEach((s,i)=>{const lit=G.lit.includes(i);s.fl.visible=lit;s.L.intensity=lit?1.4+Math.sin(T*.3+i)*.2+rnd()*.15:0;if(lit&&T%6===0){s.fl.material.map=tex(flameCv[(T/6|0)%4]);s.fl.material.needsUpdate=true}});
 if(T%6===0)for(const f of flameSpr){f.material.map=tex(flameCv[((T/6|0)+(f.position.x|0))%4]);f.material.needsUpdate=true}
 for(const it of ITEMS)if(itemSpr[it.id]){itemSpr[it.id].visible=!G.taken.includes(it.id);itemSpr[it.id].position.y=.35+Math.sin(T/10+it.x)*.06}
 fogTex.offset.y=(T*.004)%1;waterTex.offset.y=(T*.0015)%1;for(const m of fogMeshes)m.visible=!G.boss[m.userData.A.k];stainSpr.visible=false;
 const fill=(P_,list)=>{let n=0;const c=new THREE.Color();for(const q of list){if(n>=P_.n)break;P_.pos[n*3]=q.x;P_.pos[n*3+1]=q.y;P_.pos[n*3+2]=q.z;c.set(q.c);P_.col[n*3]=c.r;P_.col[n*3+1]=c.g;P_.col[n*3+2]=c.b;n++}P_.g.setDrawRange(0,n);P_.g.attributes.position.needsUpdate=true;P_.g.attributes.color.needsUpdate=true};
 const S_=[],F_=[];for(const q of fx)(q.f?F_:S_).push(q);if(LV===2&&!B)for(let i=0;i<60;i++){const k=(i*97+T*7)%300;S_.push({x:PL.x+((i*37)%20-10),y:6-(k%60)/10,z:PL.z+((i*53)%20-10),c:'#8a9ab0'})}fill(PTS.s,S_);fill(PTS.f,F_)}
function syncBattle(){for(const u of B.hs.concat(B.es))poseUnit(u);
 camera.position.lerp(B.cam.p,.07);const l=camera.userData.l||(camera.userData.l=B.cam.l.clone());l.lerp(B.cam.l,.07);const sh=shake>0&&!RM?shake*.006:0;camera.position.x+=(rnd()-.5)*sh;camera.position.y+=(rnd()-.5)*sh;camera.lookAt(l);commonSync()}

/* ---------------- HUD ---------------- */
function proj(x,y,z){v3.set(x,y,z).project(camera);if(v3.z>1)return null;return{sx:(v3.x+1)/2*W,sy:(1-v3.y)/2*H}}
function bar(x,y,w,h,v,max,c,d,dv){r(x-1,y-1,w+2,h+2,'#120d0c');r(x,y,w,h,'#2a1a18');if(dv)r(x,y,w*clamp(dv/max,0,1),h,d);r(x,y,w*clamp(v/max,0,1),h,c);r(x,y,w*clamp(v/max,0,1),1,'rgba(255,255,255,.25)')}
let btns=[];
function button(x,y,w,h,f){btns.push({x,y,w,h,f})}
function faceIcon(fac,x,y,emo='normal',w=20){ctx.drawImage(faceCv(fac,emo),x,y,w,w*.7)}
function hudCommon(){for(const q of pops){const pr=proj(q.x,q.y+q.t*.01,q.z);if(!pr||!q.s)continue;ctx.globalAlpha=q.t<40?1:Math.max(0,1-(q.t-40)/20);txt(q.s,pr.sx,pr.sy,q.c,'center');ctx.globalAlpha=1}
 if(itemBox){const d=itemBox.d;ctx.globalAlpha=Math.min(1,itemBox.t/10);const fl=wrap(d.f,44),h=40+fl.length*9,y0=H/2-h/2-20;r(30,y0,W-60,h,'rgba(10,6,4,.92)');r(30,y0,W-60,1,'#d9a441');txt(d.n,W/2,y0+6,'#ffd24a','center');txt(d.d,W/2,y0+18,'#e9dcc2','center');fl.forEach((l,i)=>txt(l,W/2,y0+32+i*9,'#a8977c','center'));ctx.globalAlpha=1}
 if(banner&&!(banner.delay>banner.t)){const k=banner.t,a=k<16?k/16:k>banner.dur-30?Math.max(0,(banner.dur-k)/30):1;if(banner.small){ctx.globalAlpha=a*.75;r(0,26,W,22,'#000');ctx.globalAlpha=1;stxt(banner.text,W/2,37,banner.col,banner.size,a)}else{ctx.globalAlpha=a*.7;r(0,H/2-26,W,48,'#000');ctx.globalAlpha=1;stxt(banner.text,W/2,H/2-4,banner.col,banner.size||24,a);if(banner.sub)stxt(banner.sub,W/2,H/2+15,'#a8977c',9,a)}}}
function hudExplore(){const p=PL;
 HEROES.forEach((h,i)=>{const mx=heroStat(h,'hp'),hp=G.hp?Math.max(0,G.hp[i]):mx;faceIcon(h.fac,8,8+i*16,'normal',18);bar(30,13+i*16,60,3,hp,mx,'#b3261e')});
 txt('LV '+G.lvl,8,58,'#e9dcc2');txt('¥ '+fmtBig(G.yuan),8,68,'#d9a441');txt('WINE '+G.items.wine+' · BALM '+G.items.balm,8,78,'#a8977c');
 const tu=$('#tU');if(near&&!reading){if(touchUI){if(tu.hidden||tu.textContent!==near.label){tu.textContent=near.label;tu.hidden=false}}else txt('E  '+near.label,W/2,H-58,'#ffd24a','center')}else if(!tu.hidden)tu.hidden=true;
 if(!touchUI){const w=wanderers.find(w=>Math.hypot(w.x-p.x,w.z-p.z)<3);if(w&&!w.boss)txt('J  AMBUSH!',W/2,H-46,'#ff8a3a','center')}
 if(reading){const m=reading.m,s=Array.isArray(m.t)?m.t[touchUI?1:0]:m.t,ls=wrap('"'+s+'"',40),h=ls.length*10+22;r(40,16,W-80,h,'rgba(10,6,4,.88)');r(40,16,W-80,1,'#ff9a3a');ls.forEach((l,i)=>txt(l,W/2,24+i*10,'#ffc07a','center'));txt('LEFT BY EXPEDITION '+(40+(m.z|0)%8),W/2,24+ls.length*10+2,'#6e6050','center')}
 if(areaB&&!banner){const k=areaB.t,a=k<30?k/30:k>150?Math.max(0,(190-k)/40):1;stxt(areaB.z.name,W/2,62,'#e9dcc2',17,a);ctx.globalAlpha=a*.6;r(W/2-110,74,220,1,'#e9dcc2');ctx.globalAlpha=1;stxt(areaB.z.han,W/2,86,'#a8977c',11,a)}
 if(!touchUI&&!document.pointerLockElement&&T%90<60)txt('CLICK TO CAPTURE MOUSE',W-8,H-12,'#6e6050','right')}
function hudBattle(){
 // turn order
 const ord=turnOrder(7);ord.forEach((u,i)=>{const x=8+i*24,y=8;r(x-1,y-1,22,17,u.side==='h'?'#2f4f8a':'#8a1c14');faceIcon(u.side==='h'?u.h.fac:(u.d.fac||(u.k==='pitch'?'straw':'kmt')),x,y,i===0?'grit':'normal',20)});txt('TURN ORDER',8,27,'#6e6050');
 // party panels
 B.hs.forEach((u,i)=>{const x=6,y=H-52+i*16,act=B.turn===u;r(x,y,128,15,act?'rgba(217,164,65,.25)':'rgba(10,6,4,.7)');faceIcon(u.h.fac,x+2,y+1,u.ko?'dead':'normal',18);txt(u.h.name.split(' ').pop(),x+22,y+1,u.ko?'#6e6050':'#e9dcc2');
  bar(x+22,y+10,60,3,u.hp,u.max,'#b3261e');txt(String(u.hp),x+86,y+7,'#a8977c');for(let k=0;k<9;k++)r(x+104+(k%5)*5,y+2+(k/5|0)*5,4,4,k<u.ap?'#ffd24a':'#3a2e26');
  if(u.infl)txt('¥'+u.infl,x+132,y+3,'#d9a441');if(u.paint)txt('48:'+u.paint,x+132,y+3,'#e9dcc2');if(u.buff.rage)r(x+124,y+12,4,2,'#ff6a5a')});
 // enemy bars
 for(const e of B.es){if(e.ko)continue;const pr=proj(e.x,1.65*e.s+.15,e.z);if(!pr)continue;const w=e.d.boss?70:34;bar(pr.sx-w/2,pr.sy,w,3,e.hp,e.max,'#c8372d');bar(pr.sx-w/2,pr.sy+5,w,2,e.brk,e.brkMax,e.broken?'#ffd24a':'#d9a441');
  if(e.d.boss)txt(e.name,pr.sx,pr.sy-10,'#e9dcc2','center');if(e.buff.mark)txt('MARK',pr.sx+w/2+3,pr.sy-1,'#ff8a3a');if(e.broken)txt('BROKEN',pr.sx,pr.sy-10,'#ffd24a','center')}
 for(const u of B.hs.concat(B.es))if(u.shout&&!u.ko){const pr=proj(u.x,1.7*u.s+.4,u.z);if(pr)drawShout(u.shout.s,pr.sx,pr.sy,u.side==='h')}
 for(const h of B.hs)if(h.paint&&!h.ko){const pr=proj(h.x,2.2,h.z);if(pr){stxt('48',pr.sx,pr.sy,'#e9dcc2',16);txt(h.paint+' TURNS',pr.sx,pr.sy+8,'#a8977c','center')}}
 if(B.log){B.log.t++;if(B.log.t<90&&!banner){ctx.globalAlpha=.75;r(W/2-90,30,180,14,'#000');ctx.globalAlpha=1;txt(B.log.n,W/2,33,'#ff8a3a','center')}}
 // reaction ring
 const rr=B.react;if(rr){for(const h of rr.tgs){if(h.ko)continue;const pr=proj(h.x,1,h.z);if(!pr)continue;const k=Math.max(0,(rr.lead-rr.t)/rr.lead),rad=8+k*40;ctx.strokeStyle=k<.18?'#ffd24a':'rgba(255,106,90,.85)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(pr.sx,pr.sy,rad,0,TAU);ctx.stroke();ctx.strokeStyle='rgba(233,220,194,.6)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(pr.sx,pr.sy,8,0,TAU);ctx.stroke();if(rr.aoe)break}
  if(G.battles<3)txt(touchUI?'DODGE AS THE RING CLOSES · PARRY IS TIGHTER':'SPACE DODGE · SHIFT PARRY — WHEN THE RING CLOSES',W/2,H-64,'#e9dcc2','center')}
 // qte
 const q=B.qte;if(q){const pr=proj(q.u.x,1*q.u.s,q.u.z);if(pr){const k=Math.max(0,(q.dur-q.t)/q.dur),rad=10+k*44;ctx.strokeStyle='#ffd24a';ctx.lineWidth=3;ctx.beginPath();ctx.arc(pr.sx,pr.sy,10,0,TAU);ctx.stroke();ctx.strokeStyle='rgba(255,255,255,.8)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(pr.sx,pr.sy,rad,0,TAU);ctx.stroke();txt(touchUI?'TAP!':'J!',pr.sx,pr.sy-rad-12,'#ffd24a','center')}}
 // free aim
 const am=B.aim;if(am){const t=am.u,wp=proj(t.x,(t.m.mimic?.5:1.05)*t.s,t.z),c=proj(t.x,1*t.s,t.z);if(wp&&c){const cx=c.sx+Math.sin(am.t*.09)*44*Math.min(1.6,t.s),cy_=c.sy+Math.cos(am.t*.13)*16;
   ctx.globalAlpha=.6+Math.sin(T*.3)*.3;r(wp.sx-3,wp.sy-3,6,6,'#ffd24a');ctx.globalAlpha=1;ctx.strokeStyle='#ffd24a';ctx.lineWidth=1;ctx.strokeRect(wp.sx-6,wp.sy-6,12,12);
   r(cx-8,cy_,6,1,'#fff');r(cx+3,cy_,6,1,'#fff');r(cx,cy_-8,1,6,'#fff');r(cx,cy_+3,1,6,'#fff');am.cx=cx;am.cy=cy_;am.wx=wp.sx;am.wy=wp.sy;txt(touchUI?'TAP TO FIRE ON THE WALLET':'J TO FIRE · AIM FOR THE GLOWING WALLET',W/2,H-64,'#e9dcc2','center')}}
 // menu
 const u=B.turn;btns=[];
 if(B.menu&&!B.task&&u&&u.side==='h'){
  if(B.menu.lv==='target'){const t=B.menu.list[B.tsel];const pr=proj(t.x,(t.side==='h'?2:1.9*t.s)+.2,t.z);if(pr){const b=Math.sin(T*.2)*2;r(pr.sx-4,pr.sy-10+b,9,3,'#ffd24a');r(pr.sx-2,pr.sy-7+b,5,3,'#ffd24a');r(pr.sx,pr.sy-4+b,1,2,'#ffd24a');txt(t.name,pr.sx,pr.sy-22,'#ffd24a','center')}
   B.menu.list.forEach((t2,i)=>{const p2=proj(t2.x,1*t2.s,t2.z);if(p2)button(p2.sx-16,p2.sy-26*t2.s,32,40*t2.s,()=>{if(B.tsel===i){menuNav('ok')}else{B.tsel=i;menuNav('ok')}})});
   txt(touchUI?'TAP A TARGET · BACK':'A/D CHOOSE · J CONFIRM · K BACK',W-8,H-12,'#a8977c','right');const bx=W-60,by=H-30;r(bx,by,52,14,'rgba(10,6,4,.8)');txt('BACK',bx+26,by+3,'#e9dcc2','center');button(bx,by,52,14,()=>menuNav('back'));return}
  const it=menuItems(u),w=150,x=W-w-8,y0=H-12-it.length*14;txt(u.h.name+(B.menu.lv==='main'?'':' · '+B.menu.lv.toUpperCase()),x,y0-12,'#ffd24a');
  it.forEach((m,i)=>{const y=y0+i*14,sel=i===B.sel;r(x,y,w,13,sel?'rgba(217,164,65,.35)':'rgba(10,6,4,.78)');txt((sel?'▶ ':'  ')+m.l,x+3,y+3,m.dis?'#6e6050':'#e9dcc2');txt(m.s||'',x+w-3,y+3,m.dis?'#6e6050':'#d9a441','right');button(x,y,w,13,()=>{if(B.sel===i)menuNav('ok');else{B.sel=i;menuNav('ok')}})});
  const cur=it[B.sel];if(cur&&cur.d){const ls=wrap(cur.d,30);const dy=y0-28-ls.length*10;r(x,dy,w,ls.length*10+6,'rgba(10,6,4,.85)');ls.forEach((l,i)=>txt(l,x+4,dy+3+i*10,'#e9dcc2'))}
  if(B.menu.lv!=='main'){const bx=x,by=y0-12-(cur&&cur.d?wrap(cur.d,30).length*10+20:0)-14;r(bx+w-40,by,40,12,'rgba(10,6,4,.8)');txt('BACK',bx+w-20,by+2,'#e9dcc2','center');button(bx+w-40,by,40,12,()=>menuNav('back'))}}}
function render(){
 if(state==='scene'&&scene){scene.complete=soulScene(scene.sc,scene.t);return}
 if(state==='title'){attract();return}
 if(!PL||!G||state==='end')return;
 if(!glOK){ctx.fillStyle='#120d0c';ctx.fillRect(0,0,W,H);txt('THIS BROWSER BLOCKED 3D GRAPHICS',W/2,96,'#ff6a5a','center');return}
 if(B)syncBattle();else syncExplore();renderer.render(S3,camera);ctx.clearRect(0,0,W,H);ctx.drawImage(VIG,0,0);
 btns=[];if(B)hudBattle();else hudExplore();hudCommon();
 if(fadeA>0){ctx.globalAlpha=fadeA;r(0,0,W,H,'#000');ctx.globalAlpha=1}
 if(state==='pause'){r(0,0,W,H,'rgba(0,0,0,.6)');stxt('PAUSED',W/2,H/2-8,'#e9dcc2',24);txt('P / ESC TO RESUME',W/2,H/2+12,'#a8977c','center')}}

/* ---------------- update ---------------- */
function update(){T++;G.time++;
 if(fadeA>0)fadeA=Math.max(0,fadeA-.03);if(shake>0)shake*=.85;if(shake<.5)shake=0;
 if(reading){reading.t++;if(reading.t>20&&(pressed.use||pressed.atk||PL.moving))reading=null}
 if(itemBox){itemBox.t++;if(itemBox.t>40&&(pressed.use||pressed.atk||pressed.ok)||itemBox.t>260)itemBox=null}
 if(banner&&++banner.t>banner.dur+(banner.delay||0))banner=null;if(areaB&&!banner&&++areaB.t>190)areaB=null;
 for(const q of fx){q.x+=q.vx;q.y+=q.vy;q.z+=q.vz;q.vy-=q.g;q.l--;if(q.y<.02&&q.g>0){q.y=.02;q.vx*=.5;q.vz*=.5;q.vy=0}}fx=fx.filter(q=>q.l>0);if(fx.length>1100)fx.splice(0,fx.length-1100);
 for(const q of pops)q.t++;pops=pops.filter(q=>q.t<60);
 if(state==='battle'&&B){if(hs>0){hs--}else{B.t++;stepTask();if(B){
   if(B.qte&&(pressed.ok||pressed.atk))qtePress();
   if(B.aim&&(pressed.ok||pressed.atk)&&B.aim.cx!=null){const d=Math.hypot(B.aim.cx-B.aim.wx,B.aim.cy-B.aim.wy);B.aim.res=d<8?'WEAK':'MISS'}
   if(B.react){if(pressed.dodge)reactPress('dodge');if(pressed.parry)reactPress('parry')}
   if(B.menu&&!B.task){for(const k of['up','down','left','right','ok','back'])if(pressed[k])menuNav(k)}}}}
 else if(state==='play')updExplore();
 for(const k in pressed)delete pressed[k]}

/* ---------------- scenes & flow ---------------- */
function playScene(sc,done){scene={sc,t:0,done};state='scene';$('#touch').hidden=true;$('#react').hidden=true;if(document.pointerLockElement)document.exitPointerLock()}
function soulScene(sc,t){ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);ctx.save();ctx.beginPath();ctx.rect(0,0,W,136);ctx.clip();sceneArt(sc.draw,t);ctx.restore();
 ctx.drawImage(VIG,0,0);r(0,136,W,H-136,'#120d0c');r(0,136,W,2,'#d9a441');txt(sc.date,8,141,'#d9a441');txt(sc.place,W-8,141,'#a8977c','right');
 const shown=Math.floor(t*1.4),fl=wrap(sc.fact,47),jl=wrap(sc.joke,47);let n=0;ctx.font=F;ctx.textAlign='left';ctx.textBaseline='top';
 fl.forEach((l,i)=>{ctx.fillStyle='#e9dcc2';ctx.fillText(l.slice(0,Math.max(0,shown-n)),8,151+i*10);n+=l.length+1});
 jl.forEach((l,i)=>{ctx.fillStyle='#ff9a6a';ctx.fillText(l.slice(0,Math.max(0,shown-n)),8,153+fl.length*10+i*10);n+=l.length+1});
 if(shown>n+10&&T%40<26)txt('▶',W-16,H-12,'#d9a441');return shown>n}
const SC_INTRO=[{draw:'bankrun',date:'AUGUST 1948',place:'SHANGHAI',fact:'To stop runaway inflation, the Nationalist government replaced its currency with the Gold Yuan. Within months, prices had risen many thousands of times over.',joke:'Every year the Printer paints a bigger number on the banknote. Those whose savings are worth less than the number are erased.'},
 {draw:'campfire',date:'AUTUMN 1948',place:'A VILLAGE ON FIRE',fact:'Expedition 48 is the forty-eighth attempt to reach the Printer and stop it. Nobody remembers what happened to the first forty-seven.',joke:'The expedition: one conscript, one agitator from the other side, and an accountant. It is the only thing both armies agreed to fund.'}];
const SC_END=[{draw:'boats',date:'1949',place:'THE DOCKS',fact:'In 1949 the Nationalist government retreated to Taiwan. The Gold Yuan, barely a year old, had become close to worthless.',joke:'The Printer lies broken. The number stops growing. Expedition 48 celebrates for one whole night.'},
 {draw:'island',date:'THE NEXT MORNING',place:'EVERYWHERE',fact:'Both governments that followed would print new currencies of their own.',joke:'The next morning, they buy a new Printer. Expedition 49 is already recruiting. Bring more money.'}];
let built=false;
function newGame(cont){initAudio();ambient();$('#title').hidden=true;$('#end').hidden=true;$('#hud').hidden=false;
 if(!built){initGL();if(glOK){buildWorld();buildStage();mkPlayerModels()}built=true}
 const sv=cont&&store.get(SAVEK,null);G=sv||newProgress();ending=false;B=null;
 const go=()=>{respawn(G.fire,true);if(!G.seen.includes(LV)){G.seen.push(LV);areaB={t:0,z:ZONES[LV]}}};
 if(sv)go();else playScene(SC_INTRO[0],()=>playScene(SC_INTRO[1],go))}
function finish(){if(ending)return;ending=true;music('ending');G.done=1;save();
 playScene(SC_END[0],()=>playScene(SC_END[1],()=>{state='end';$('#hud').hidden=true;$('#touch').hidden=true;$('#end').hidden=false;
  $('#endP').textContent='Expedition 48 broke the Printer. Prices rose '+fmtBig((G.inf-1)*100)+'% during the expedition anyway.';
  const tm=G.time/60|0;$('#endS').innerHTML=`<dt>Time</dt><dd>${tm/60|0}m ${tm%60}s</dd><dt>Battles</dt><dd>${G.battles}</dd><dt>Perfect parries</dt><dd>${G.parries}</dd><dt>Party wipes</dt><dd>${G.wipes}</dd><dt>Level</dt><dd>${G.lvl}</dd><dt>Gold Yuan</dt><dd>¥ ${fmtBig(G.yuan)} (worthless)</dd>`;setTimeout(()=>$('#e1').focus(),50)}))}
$('#bNew').onclick=()=>newGame(false);$('#bCont').onclick=()=>newGame(true);
$('#e1').onclick=()=>{store.set(SAVEK,null);newGame(false)};
$('#e2').onclick=()=>{$('#end').hidden=true;$('#title').hidden=false;state='title';music('off');showCont()};
function showCont(){const s=store.get(SAVEK,null);$('#bCont').hidden=!(s&&!s.done)}showCont();
let prevState='play';
function togglePause(){if(state==='play'||state==='battle'){prevState=state;state='pause';ambSet()}else if(state==='pause'){state=prevState;ambSet()}}
$('#bPause').onclick=e=>{togglePause();e.currentTarget.blur()};
$('#bSnd').onclick=e=>{initAudio();setMute(!muted);e.currentTarget.textContent=muted?'MUTE':'SND';e.currentTarget.blur()};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&(state==='play'||state==='battle'))togglePause()});

/* ---------------- input ---------------- */
const kb={},tch={},pressed={};let stickV={x:0,y:0};
const KM={KeyW:'up',KeyS:'down',KeyA:'left',KeyD:'right',ArrowLeft:'camL',ArrowRight:'camR',ArrowUp:'camU',ArrowDown:'camD',KeyE:'use',KeyF:'use',ShiftLeft:'run',ShiftRight:'run',KeyJ:'atk',Enter:'atk'};
const BKM={KeyW:'up',ArrowUp:'up',KeyS:'down',ArrowDown:'down',KeyA:'left',ArrowLeft:'left',KeyD:'right',ArrowRight:'right',KeyJ:'ok',Enter:'ok',KeyE:'ok',KeyK:'back',Escape:'back',Backspace:'back',KeyQ:'back'};
const held=k=>kb[k]||tch[k];
addEventListener('keydown',e=>{if(state==='rest'){if(e.code==='Escape')$('#restGo').click();return}
 if(e.code==='KeyP'||(e.code==='Escape'&&state!=='battle'&&!document.pointerLockElement)){togglePause();return}
 if(state==='scene'){if(['Space','Enter','KeyJ','KeyE'].includes(e.code)){pressed.atk=1;e.preventDefault()}return}
 initAudio();
 if(state==='battle'){e.preventDefault();if(e.repeat)return;if(B&&B.react){if(e.code==='Space'||e.code==='KeyK')pressed.dodge=1;if(e.code==='ShiftLeft'||e.code==='ShiftRight'||e.code==='KeyL')pressed.parry=1;return}
  if((B&&(B.qte||B.aim))&&(e.code==='Space'||e.code==='KeyJ'||e.code==='Enter'))pressed.ok=1;const k=BKM[e.code];if(k)pressed[k]=1;return}
 if(state!=='play'&&state!=='pause')return;const k=KM[e.code];if(!k)return;e.preventDefault();if(!e.repeat&&!kb[k])pressed[k]=1;kb[k]=1});
addEventListener('keyup',e=>{const k=KM[e.code];if(k)kb[k]=0});
cv.addEventListener('contextmenu',e=>e.preventDefault());
function cvXY(e){const rc=cv.getBoundingClientRect();return[(e.clientX-rc.left)/rc.width*W,(e.clientY-rc.top)/rc.height*H]}
cv.addEventListener('pointerdown',e=>{initAudio();if(state==='scene'){pressed.atk=1;return}
 if(state==='battle'){const[x,y]=cvXY(e);if(B&&(B.qte||B.aim)){pressed.ok=1;return}for(const b of btns)if(x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h){b.f();return}return}
 if(state==='play'&&!touchUI){if(!document.pointerLockElement){try{const p_=cv.requestPointerLock();if(p_&&p_.catch)p_.catch(()=>{})}catch(_){}return}pressed.atk=1}});
addEventListener('mousemove',e=>{if(document.pointerLockElement===cv&&state==='play'){cy-=e.movementX*.0035;cp=clamp(cp+e.movementY*.0025,-.15,1.1)}});
for(const id of['bDodge','bParry']){const b=$('#'+id);const f=e=>{e.preventDefault();initAudio();pressed[b.dataset.k]=1};b.addEventListener('pointerdown',f)}
let touchUI=false;const tpad=$('#touch'),sBase=$('#stickBase'),sKnob=$('#stickKnob');let stickId=null,camId=null,sx0=0,sy0=0,cx0=0,cy0=0;const btnT={};
if(matchMedia('(pointer:coarse)').matches)touchUI=true;
if(touchUI){$('#kD').textContent='';$('#kP').textContent=''}
addEventListener('touchstart',()=>{if(!touchUI){touchUI=true;$('#kD').textContent='';$('#kP').textContent='';if(state==='play')tpad.hidden=false}},{passive:true});
tpad.addEventListener('touchstart',e=>{e.preventDefault();initAudio();for(const t of e.changedTouches){const b=t.target.closest&&t.target.closest('.tb');
 if(b){const k=b.dataset.k;btnT[t.identifier]=k;tch[k]=true;pressed[k]=1;b.classList.add('on');continue}
 if(t.clientX<innerWidth*.45&&stickId==null){stickId=t.identifier;sx0=t.clientX;sy0=t.clientY;sBase.hidden=false;sBase.style.left=sx0+'px';sBase.style.top=sy0+'px';sKnob.style.transform=''}
 else if(camId==null){camId=t.identifier;cx0=t.clientX;cy0=t.clientY;camDrag=true}}},{passive:false});
tpad.addEventListener('touchmove',e=>{e.preventDefault();for(const t of e.changedTouches){if(t.identifier===stickId){const dx=clamp(t.clientX-sx0,-50,50),dy=clamp(t.clientY-sy0,-50,50);stickV={x:Math.abs(dx)<8?0:dx/50,y:Math.abs(dy)<8?0:dy/50};sKnob.style.transform=`translate(${dx}px,${dy}px)`}
 else if(t.identifier===camId){cy-=(t.clientX-cx0)*.008;cp=clamp(cp+(t.clientY-cy0)*.005,-.15,1.1);cx0=t.clientX;cy0=t.clientY}}},{passive:false});
function tEnd(e){e.preventDefault();for(const t of e.changedTouches){if(t.identifier===stickId){stickId=null;stickV={x:0,y:0};sBase.hidden=true}if(t.identifier===camId){camId=null;camDrag=false}const k=btnT[t.identifier];if(k){tch[k]=false;delete btnT[t.identifier];const el=document.querySelector(`.tb[data-k=${k}]`);if(el)el.classList.remove('on')}}}
tpad.addEventListener('touchend',tEnd,{passive:false});tpad.addEventListener('touchcancel',tEnd,{passive:false});
function fit(){const vw=innerWidth,vh=innerHeight,s=Math.min(vw/W,vh/H);const st=$('#stage');st.style.width=Math.floor(W*s)+'px';st.style.height=Math.floor(H*s)+'px'}
addEventListener('resize',fit);

/* ---------------- loop ---------------- */
fit();
let last=performance.now(),acc=0;
function attract(){ctx.fillStyle='#070505';ctx.fillRect(0,0,W,H);const x=W/2,y=150;r(0,y,W,H-y,'#1a1210');
 const g=ctx.createRadialGradient(x,y-10,2,x,y-10,120);g.addColorStop(0,'rgba(255,140,50,.35)');g.addColorStop(1,'rgba(255,100,30,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 const fl=(T>>2)%3;r(x-9,y-14,18,14,'#6a4a3a');r(x-10,y-15,20,3,'#8a6450');r(x-5,y-9+fl,4,7-fl,'#ff8a1a');r(x-1,y-8-fl%2,4,6,'#ffd24a');
 drawSoldier(x-52,y,{fac:'kmt',face:1,pose:'sit',emo:'sleep',gun:null});drawSoldier(x+36,y,{fac:'ccp',face:-1,pose:'sit',emo:(T%240)<200?'sleep':'normal',gun:null});drawCivilian(x-8,y-30,{face:1,hat:'cap',cl:'#5a4a3a',emo:'scared',pose:'idle'});ctx.drawImage(VIG,0,0)}
function loop(nt){acc+=Math.min(100,nt-last);last=nt;
 while(acc>=16.67){acc-=16.67;
  if(state==='play'||state==='battle')update();
  else if(state==='scene'&&scene){scene.t++;T++;if(scene.t%3===0&&scene.t<500)SFX.type();const adv=pressed.atk||pressed.use;for(const k in pressed)delete pressed[k];if(adv&&scene.t>10){if(!scene.complete)scene.t=9999;else{const d=scene.done;scene=null;d()}}}
  else{T++;for(const k in pressed)delete pressed[k]}}
 render();requestAnimationFrame(loop)}
(document.fonts?Promise.all([document.fonts.load(F),document.fonts.load(SERIF(20))]):Promise.resolve()).catch(()=>{}).finally(()=>requestAnimationFrame(loop));
