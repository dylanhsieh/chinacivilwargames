/* ===================== DARK YUAN — a Civil Slug souls-like ===================== */
let T=0,camX=0,S='kmt',EN='ccp',LV=-1,skyFlash=0,skyFX=0,state='title',shake=0,hs=0,fadeA=1;
let plats=[],scorch=[];const L={walls:[300,760,1380,4060,4620,5880,6460,7550,7960,8320],theme:'village',deep:null,weather:null};
const VIG=document.createElement('canvas');VIG.width=W;VIG.height=H;{const g=VIG.getContext('2d');const rg=g.createRadialGradient(W/2,H/2,H*.28,W/2,H/2,W*.6);rg.addColorStop(0,'rgba(0,0,0,0)');rg.addColorStop(1,'rgba(6,2,2,.75)');g.fillStyle=rg;g.fillRect(0,0,W,H);g.fillStyle='rgba(0,0,0,.08)';for(let y=0;y<H;y+=2)g.fillRect(0,y,W,1)}
const LC=document.createElement('canvas');LC.width=W;LC.height=H;const lx=LC.getContext('2d');
const SERIF=s=>`900 ${s}px "Noto Serif TC","Songti TC",Georgia,serif`;
function stxt(s,x,y,c,size,a=1,al='center'){ctx.font=SERIF(size);ctx.textAlign=al;ctx.textBaseline='middle';ctx.globalAlpha=a;ctx.fillStyle='#000';ctx.fillText(s,x+1,y+2);ctx.fillStyle=c;ctx.fillText(s,x,y);ctx.globalAlpha=1}
const lerp=(a,b,t)=>a+(b-a)*clamp(t,0,1);
const CANFILTER=typeof ctx.filter==='string';

/* ---------------- world ---------------- */
const WW=9200,PITS=[[880,930],[2300,2346],[2700,2800],[3050,3114],[4340,4392],[6130,6180],[7800,7870]];L.deep=[PITS[1],PITS[2],PITS[3]];
const isWater=x=>L.deep.some(d=>x>d[0]&&x<d[1]);
function groundAt(x){for(const p of PITS)if(x>p[0]&&x<p[1])return 1e4;return GY}
const PLATS=[{x:470,y:162,w:48},{x:536,y:140,w:60},{x:1230,y:158,w:72},{x:1600,y:162,w:60},{x:2500,y:162,w:36},{x:2550,y:138,w:72},{x:2735,y:172,w:30},{x:3072,y:168,w:24},{x:4200,y:160,w:50},{x:4760,y:150,w:56},{x:6300,y:156,w:60},{x:6600,y:160,w:40},{x:7822,y:170,w:26},{x:8100,y:160,w:60},{x:8440,y:158,w:56}];
plats=PLATS;
const ZONES=[{x:0,theme:'village',name:'VILLAGE OF THE ROPED',han:'繩村',weather:null,dark:.2},{x:2080,theme:'river',name:'THE BRIDGE NOBODY BLEW UP',han:'斷橋',weather:null,dark:.24},{x:3800,theme:'city',name:'THE MINT THAT NEVER SLEEPS',han:'印鈔廠',weather:'money',dark:.3},{x:5500,theme:'snow',name:'HUAIHAI, WHERE THE ARMY WENT',han:'淮海',weather:'snow',dark:.16},{x:7200,theme:'city',name:'DOCKS OF THE LAST FERRY',han:'末班渡口',weather:'rain',dark:.42}];
const FIRES=[{x:150,name:'THE CONSCRIPT PIT'},{x:1990,name:'VILLAGE SHRINE'},{x:3860,name:'MINT GATE'},{x:5560,name:'FROZEN TRENCH'},{x:7230,name:'FERRY ROAD'},{x:8680,name:'CUSTOMS HOUSE'}];
const ARENAS=[{k:'wei',a:1660,b:1960,title:'COMMISSAR WEI',sub:'SELF-CRITICISM ENFORCER',fell:'COMMISSAR FELLED',fsub:'HE WILL WRITE A REPORT ABOUT THIS',item:'notebook'},{k:'ma',a:3440,b:3770,title:'GENERAL MA',sub:'EXECUTIONER OF DESERTERS',fell:'WARLORD FELLED',item:'stamp'},{k:'zhao',a:5130,b:5460,title:'TREASURER ZHAO',sub:'KEEPER OF THE PRESSES',fell:'TREASURER FELLED',fsub:'INFLATION, HOWEVER, IS UNDEFEATED',item:'plate'},{k:'lu',a:6830,b:7160,title:'COLONEL LU',sub:'OF FLEXIBLE LOYALTY',fell:'COLONEL FELLED',fsub:'BOTH ARMIES CLAIM HE WAS THEIRS',item:'cap'},{k:'bros',a:8790,b:9130,fell:'UNITED FRONT DISSOLVED',item:'stamp2'}];
const SPAWNS=[['conscript',380,'ccp'],['pitch',560],['conscript',720,'kmt'],['pitch',1010],['conscript',1080,'ccp'],['rifle',1266,'kmt',158],['gren',1180,'ccp'],['conscript',1330,'kmt'],['pitch',1440],['conscript',1520,'ccp'],['rifle',1630,'ccp',162],
 ['conscript',2200,'kmt'],['rifle',2430,'ccp'],['conscript',2480,'ccp'],['rifle',2590,'kmt',138],['gren',2640,'kmt'],['conscript',2860,'ccp'],['pitch',2920],['shield',3000],['conscript',3180,'kmt'],['mimic',3310],['conscript',3380,'ccp'],
 ['shield',3990],['conscript',4080,'kmt'],['pitch',4150],['rifle',4225,'kmt',160],['conscript',4440,'kmt'],['gren',4520,'kmt'],['shield',4620],['pitch',4680],['rifle',4790,'kmt',150],['conscript',4880,'ccp'],['shield',4980],['conscript',5040,'kmt'],
 ['conscript',5700,'ccp'],['rifle',5820,'ccp'],['conscript',5900,'kmt'],['gren',6000,'ccp'],['pitch',6080],['conscript',6240,'ccp'],['rifle',6330,'ccp',156],['shield',6440],['commissar',6560,'ccp'],['conscript',6700,'kmt'],['gren',6760,'ccp'],
 ['shield',7400],['conscript',7500,'kmt'],['rifle',7630,'ccp'],['gren',7720,'kmt'],['shield',7960],['conscript',8030,'ccp'],['conscript',8080,'kmt'],['rifle',8220,'kmt'],['shield',8360],['gren',8468,'ccp',158],['conscript',8550,'ccp'],['pitch',8600]];
const ITEMS=[{id:'t1',x:566,y:140,k:'ticket'},{id:'y1',x:1150,y:GY,k:'yuan'},{id:'w1',x:2606,y:138,k:'whet'},{id:'g1',x:2960,y:GY,k:'gren'},{id:'y3',x:4560,y:GY,k:'yuan'},{id:'g2',x:4800,y:150,k:'gren'},{id:'t4',x:6620,y:160,k:'ticket'},{id:'t2',x:7835,y:170,k:'ticket'},{id:'v1',x:8130,y:160,k:'vest'},{id:'w2',x:8468,y:158,k:'whet'},{id:'y2',x:7390,y:GY,k:'yuan'}];
const IDESC={
 ticket:{n:'RATION TICKET',d:'+1 rice wine flask, refilled at every stove.',f:'Redeemable for one flask of rice wine, or one sip after the next price review.'},
 yuan:{n:'BRICK OF GOLD YUAN',d:'A great deal of money. For now.',f:'Worth a house in August. A bag of rice in October. Kindling by Christmas.'},
 whet:{n:'SHARPENING STONE',d:'+12% dadao damage.',f:'The dadao was sharp once. So was the officer who sold it to you.'},
 gren:{n:'STICK GRENADE POUCH',d:'+1 grenade carried.',f:'German design, local copy, fuse length a matter of faith. Throw quickly.'},
 vest:{n:'PADDED COTTON VEST',d:'+15% max morale.',f:'Ordered for winter 1947. Delivered summer 1948. Perfect for next winter, if there is one.'},
 stamp:{n:'THE GENERAL\'S STAMP',d:'Half of your discharge papers.',f:'Pressed on six thousand execution orders. Now on your discharge. Ink is ink.'},
 notebook:{n:'SELF-CRITICISM, 40 PAGES',d:'+1 grenade carried.',f:'The commissar\'s confession notebook. He ran out of paper long before he ran out of faults.'},
 plate:{n:'ONE-MILLION NOTE PLATE',d:'+12% dadao damage. The edges are sharp.',f:'The official plate. The counterfeiters\' plate is better. Nobody can tell the notes apart, including the bank.'},
 cap:{n:'REVERSIBLE CAP',d:'+15% max morale.',f:'Blue on one side, green on the other. Not standard issue. Very popular in 1949.'},
 stamp2:{n:'THE UNITED FRONT\'S STAMP',d:'The other half. Board the ferry.',f:'Two seals pressed side by side. They do not overlap. They never did.'}};
const MSGS=[
 {x:46,t:['J ATTACK · U HEAVY ATTACK. SPAM AT YOUR PERIL.','ATTACK · HEAVY. SPAM AT YOUR PERIL.']},
 {x:96,t:['K ROLL. INVINCIBLE MID-ROLL. ONLY MID-ROLL.','ROLL. INVINCIBLE MID-ROLL. ONLY MID-ROLL.']},
 {x:196,t:['W OR E: REST AT THE TEA STOVE. THE DEAD RETURN. SO DO PRICES.','USE: REST AT THE TEA STOVE. THE DEAD RETURN. SO DO PRICES.']},
 {x:270,t:['HOLD L TO GUARD. TAP L JUST AS A BLOW LANDS TO PARRY. THEN ATTACK.','HOLD GUARD TO BLOCK. TAP IT JUST AS A BLOW LANDS TO PARRY. THEN ATTACK.']},
 {x:330,t:['R: RICE WINE HEALS. IT TAKES TIME. HE WILL NOT WAIT.','WINE HEALS. IT TAKES TIME. HE WILL NOT WAIT.']},
 {x:430,t:['STRIKE FROM BEHIND TO BACKSTAB. S + ATTACK IN THE AIR TO PLUNGE.','STRIKE FROM BEHIND TO BACKSTAB. STICK DOWN + ATTACK IN THE AIR TO PLUNGE.']},
 {x:660,t:'TRY RETREATING'},{x:860,t:'HOLE AHEAD'},{x:1110,t:'IF ONLY I HAD A PAYCHECK...'},{x:1620,t:'AMAZING COMMISSAR AHEAD'},
 {x:2230,t:'BE WARY OF LEFT. AND RIGHT. IT IS A CIVIL WAR.'},{x:2460,t:'SNIPER AHEAD, THEREFORE ROLL'},{x:3260,t:'SUPPLIES AHEAD! (TRUST ME)'},{x:3420,t:'VISIONS OF A GENERAL...'},
 {x:3940,t:'BANK RUN AHEAD. THEREFORE RUN'},{x:4300,t:'HOLE. FULL OF OLD BANKNOTES.'},{x:4720,t:'TRY SAVING'},{x:5100,t:'VISIONS OF MONEY...'},
 {x:5640,t:'HALF A MILLION OF OURS WERE LOST HERE. YOU ARE ONE OF THEM. AGAIN.'},{x:5980,t:'COLD AHEAD. ALSO COLDER.'},{x:6480,t:'BE WARY OF FRIENDS'},{x:6800,t:'COLONEL AHEAD. WHICH SIDE? YES.'},
 {x:7300,t:'PRAISE THE PAYCHECK \\o/'},{x:7780,t:'HOLE. HOLE. HOLE.'},{x:8000,t:'LIAR AHEAD. ALSO POLICE.'},{x:8400,t:'DIDN\'T EXPECT INFLATION...'},{x:8770,t:'TWO BROTHERS AHEAD, THEREFORE FIGHT EACH OTHER?'}];
const NEWS=['Prices rose 15% while you rested. Your savings rested too, permanently.','Government assures the Gold Yuan is stable. Rice is now quoted per grain.','Shanghai bank run enters third week. The bank has not reopened to run from.','Official exchange rate unchanged. Unofficial exchange rate unavailable at press time.','New banknotes printed to fix the old banknotes. Prices +15%.','A wheelbarrow of Gold Yuan now buys a smaller wheelbarrow.'];
const TIPS=['Yuan you carry loses value at every rest. Spend it here, now.','Parry: tap guard the moment a blow lands, then attack to riposte.','A boss stunned by a parry or broken poise can be riposted. Get close, attack.','Rolling through an attack beats running from it.','Dropped yuan inflates away on the ground, 1% a second. Hurry.','Heavy attacks break shields and poise. They also leave you open.','Your grenades refill at every stove. Your dignity does not.'];

/* ---------------- progress ---------------- */
let G=null;
function newProgress(ng=0,keep={}){return Object.assign({vig:10,end:10,str:10,yuan:0,inf:1,fire:0,lit:[0],boss:{},taken:[],deaths:0,lost:0,flaskMax:4,grenMax:2,whet:0,vest:0,ng,time:0,kills:0,stain:null,seen:[]},keep)}
const SL=()=>G.vig+G.end+G.str-29;
const maxHP=()=>Math.round((60+G.vig*6)*(1+G.vest*.15)),maxST=()=>50+G.end*5,ATK=()=>(8+G.str*1.25)*(1+G.whet*.12);
const cost=()=>Math.round(450*Math.pow(1.12,SL()-1)*G.inf);
const NGH=()=>1+G.ng*.6,NGD=()=>1+G.ng*.35;
const SAVEK='darkyuan.v2';
function save(){store.set(SAVEK,G)}

/* ---------------- audio extras ---------------- */
const X={
 swing:lim(()=>{noise(.12,.13,2200,'bandpass',0,SFXBUS,1.4);tone(520,180,.09,'sine',.025)}),
 heavy:lim(()=>{noise(.28,.22,800,'bandpass',0,SFXBUS,1);tone(220,70,.22,'sine',.09)}),
 flesh:lim(()=>{noise(.09,.32,1100,'lowpass');tone(170,55,.12,'square',.06);noise(.05,.12,3000,'bandpass')}),
 parry:()=>{tone(2700,2500,.3,'triangle',.09);tone(1850,1800,.35,'square',.035);noise(.06,.25,6500,'highpass');tone(900,880,.4,'sine',.05)},
 block:lim(()=>{tone(1300,800,.1,'square',.04);noise(.06,.2,4000,'highpass')}),
 roll:lim(()=>noise(.2,.12,500,'lowpass')),
 drink:()=>{const t=now();for(let i=0;i<3;i++)tone(330+i*30,180,.09,'sine',.1,t+i*.15)},
 heal:()=>{const t=now();[523,659,784].forEach((f,i)=>tone(f,f,.25,'sine',.04,t+i*.06))},
 died:()=>{const t=now();tone(98,40,2.6,'sawtooth',.07,t);tone(49,30,2.8,'sine',.35,t);noise(1.6,.18,260,'lowpass',t);[62,65,69].forEach(n=>tone(mf(n-12),mf(n-12),2.4,'triangle',.03,t+.3))},
 lit:()=>{const t=now();noise(.9,.25,600,'lowpass',t);tone(180,720,.7,'sine',.06,t);[62,69,74].forEach((n,i)=>tone(mf(n),mf(n),1.6,'triangle',.035,t+.25+i*.12))},
 fog:()=>{noise(.8,.12,2500,'bandpass',0,SFXBUS,.6);tone(400,90,.8,'sine',.04)},
 felled:()=>{const t=now();[50,57,62,65,69,74].forEach((n,i)=>{tone(mf(n),mf(n),3,'triangle',.035,t+i*.08);tone(mf(n)*1.005,mf(n)*1.005,3,'sawtooth',.012,t+i*.08)});noise(2,.1,400,'lowpass',t)},
 bite:()=>{tone(140,50,.25,'sawtooth',.12);noise(.2,.3,700)},
 step:lim(()=>noise(.03,.03,400)),
 alert:lim(()=>tone(900,1300,.08,'square',.025)),
 coin:lim(()=>{tone(1800,2400,.06,'square',.03)})};
TRACKS.duel={bpm:128,drums:'boss',bass:[0,null,0,null,0,null,1,null,0,null,0,null,-2,null,-1,null],stab:'boss',song:[
 ['Dm',[[0,74,4],[4,77,4],[8,76,2],[10,74,2],[12,73,4]]],['Bb',[[0,74,6],[6,72,2],[8,70,4],[12,69,4]]],['Gm',[[0,70,4],[4,74,4],[8,79,6],[14,77,2]]],['A',[[0,76,4],[4,73,4],[8,69,8]]],
 ['Dm',[[0,81,6],[6,79,2],[8,77,4],[12,76,4]]],['Bb',[[0,77,4],[4,74,4],[8,70,4],[12,74,4]]],['Gm',[[0,79,3],[3,77,1],[4,74,4],[8,70,4],[12,67,4]]],['A',[[0,73,4],[4,76,4],[8,81,6],[14,80,2]]]]};
let AMB=null;
function ambient(){if(!AC||AMB)return;const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain(),s2=AC.createBufferSource(),f2=AC.createBiquadFilter(),g2=AC.createGain();
 s.buffer=NB;s.loop=true;f.type='lowpass';f.frequency.value=320;g.gain.value=.05;s.connect(f).connect(g).connect(MASTER);s.start();
 s2.buffer=NB;s2.loop=true;f2.type='highpass';f2.frequency.value=3500;g2.gain.value=0;s2.connect(f2).connect(g2).connect(MASTER);s2.start();AMB={g,g2,f}}
function ambSet(){if(!AMB)return;const z=ZONES[LV]||ZONES[0],t=AC.currentTime;AMB.g2.gain.setTargetAtTime(z.weather==='rain'&&state==='play'?.04:0,t,.5);AMB.g.gain.setTargetAtTime(state==='play'?.05:.015,t,.5)}

/* ---------------- state ---------------- */
let PL=null,ents=[],bosses=[],projs=[],parts=[],pops=[],ghosts=[],banner=null,areaB=null,reading=null,itemBox=null,arena=null,near=null,buf=null,scene=null,dead=null,ending=false,lastAmb=0;
const KILLS={ccp:'DIE! CCP MTFK!',kmt:'DIE! ...KMT MTFK?',civ:'SORRY! MTFK!'};
function mkPlayer(x){return{x,y:GY,vx:0,vy:0,face:1,og:true,hp:maxHP(),hpD:maxHP(),st:maxST(),stD:0,state:'free',t:0,combo:0,inv:0,flask:G.flaskMax,gren:G.grenMax,guard:false,gT:99,pc:0,anim:0,hit:new Set(),safe:x,drop:0,shout:null,target:null,ang:.9,lastA:null}}
const EDEF={
 conscript:{hp:44,poise:14,spd:.75,yuan:90,reach:26,atks:[{w:28,a:8,r:26,dmg:16,lunge:2.4}]},
 pitch:{hp:32,poise:5,spd:1.05,yuan:70,reach:28,atks:[{w:18,a:6,r:24,dmg:12,lunge:1.8,n:2,w2:12}]},
 shield:{hp:80,poise:26,spd:.55,yuan:160,reach:22,shield:1,atks:[{w:36,a:8,r:30,dmg:24,lunge:1.4}]},
 rifle:{hp:34,poise:12,spd:.6,yuan:110,ranged:1,reach:24,atks:[{w:22,a:6,r:24,dmg:12,lunge:1.5}]},
 gren:{hp:30,poise:12,spd:.7,yuan:100,lob:1,reach:22,atks:[{w:20,a:6,r:24,dmg:12,lunge:1}]},
 commissar:{hp:320,poise:40,spd:.85,yuan:1600,reach:30,mini:1,s:1.35,atks:[{w:26,a:6,r:30,dmg:20,lunge:2.2,n:3,w2:14}],name:'COMMISSAR WEI\'S UNDERSTUDY'},
 mimic:{hp:150,poise:60,spd:1.3,yuan:700,reach:26,mimic:1,atks:[{w:16,a:10,r:30,dmg:30,lunge:3.2}]}};
function bounds(x,y){let a=10,b=WW-10;
 if(y<GY){const p=PLATS.find(p=>x>=p.x&&x<=p.x+p.w&&Math.abs(p.y-y)<2);if(p)return[p.x+4,p.x+p.w-4]}
 for(const p of PITS){if(p[1]<=x)a=Math.max(a,p[1]+6);if(p[0]>=x)b=Math.min(b,p[0]-6)}
 for(const f of FIRES){if(f.x<x)a=Math.max(a,f.x+50);else b=Math.min(b,f.x-50)}
 for(const A of ARENAS){if(A.b<=x)a=Math.max(a,A.b+8);if(A.a>=x)b=Math.min(b,A.a-50)}
 return[a,b]}
function spawnAll(){ents=SPAWNS.map(([k,x,fac,y])=>{const d=EDEF[k],yy=y||GY,[a,b]=bounds(x,yy);
 return{k,def:d,x,y:yy,hx:x,minX:a,maxX:b,face:-1,fac:fac||(k==='shield'?'civ':k==='pitch'?'civ':k==='commissar'?'ccp':'kmt'),hp:d.hp*NGH(),max:d.hp*NGH(),pz:0,state:d.mimic?'dorm':'idle',t:rnd()*60|0,cd:30,n:0,atk:d.atks[0],flash:0,dead:false,dt:0,anim:0,id:Math.random()}})
 .filter(e=>!(e.def.mimic&&G.taken.includes('mimic')))}

/* ---------------- zones & background ---------------- */
function setZone(i){if(i===LV)return;LV=i;const z=ZONES[i];L.theme=z.theme;L.weather=z.weather;buildBG();
 const H0=BGD.houses.slice();for(let k=1;k<4;k++)for(const h of H0)BGD.houses.push(Object.assign({},h,{x:h.x+k*2440}));
 const R=seeded(77+i*31);BGD.fg=[];let x=60;while(x<WW+200){const t=R();BGD.fg.push({x,t:L.theme==='city'?(t<.4?'lamp':t<.7?'bags':'rick'):L.theme==='snow'?(t<.6?'pine':'bags'):(t<.4?'bags':t<.65?'tree':t<.85?'cart':'pole')});x+=80+R()*140}
 BGD.fg=BGD.fg.filter(f=>!PITS.some(p=>f.x+30>p[0]&&f.x-10<p[1])&&!FIRES.some(F_=>Math.abs(F_.x-f.x)<40));
 ambSet();if(state==='play'&&!G.seen.includes(i)){G.seen.push(i);areaB={t:0,z}}}
function zoneAt(x){let i=0;ZONES.forEach((z,k)=>{if(x>=z.x)i=k});return i}

/* ---------------- effects ---------------- */
function blood(x,y,n,dir=0,c){for(let i=0;i<n;i++)parts.push({x,y,vx:(rnd()-.5)*3+dir*rnd()*2.5,vy:-rnd()*3,l:30+rnd()*30,c:c||(rnd()<.5?'#a8201a':'#6a1010'),s:rnd()<.3?2:1,g:.18})}
function spark(x,y,n,c='#ffe27a'){for(let i=0;i<n;i++){const a=rnd()*6.28,v=1+rnd()*3;parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:12+rnd()*14,c:rnd()<.5?c:'#fff',s:1,g:.05})}}
function dust(x,y,n){for(let i=0;i<n;i++)parts.push({x:x+(rnd()-.5)*20,y,vx:(rnd()-.5)*2,vy:-rnd()*1.2,l:20+rnd()*20,c:'rgba(150,130,110,.6)',s:2,g:-.01})}
function pop(x,y,s,c='#e9dcc2'){pops.push({x,y,s:String(s),c,t:0})}
function boomAt(x,y,o){SFX.boom();shake=Math.max(shake,8);skyFlash=.6;skyFX=x-camX;for(let i=0;i<24;i++){const a=rnd()*6.28,v=rnd()*3.5;parts.push({x,y:y-4,vx:Math.cos(a)*v,vy:Math.sin(a)*v-1.5,l:20+rnd()*25,c:pick(['#ffe27a','#ff8a1a','#ff5a1a','#555']),s:2+(rnd()*2|0),g:.06})}
 if(o==='e'){if(Math.abs(PL.x-x)<30&&Math.abs(PL.y-12-y)<34)hitPlayer(26*NGD(),x,{kb:3})}
 else for(const e of targets())if(Math.abs(e.x-x)<34&&Math.abs(e.y-14-y)<40)damage(e,e.boss?55:70,30,'boom',sgn(e.x-x))}

/* ---------------- player ---------------- */
const LCMB=[{a0:-2.1,a1:1.0,W:7,A:6,R:13,dm:1,st:15},{a0:1.3,a1:-1.5,W:6,A:6,R:13,dm:1,st:15},{a0:.1,a1:0,W:9,A:6,R:17,dm:1.35,st:18,thrust:1}],HV={a0:-2.6,a1:1.35,W:20,A:7,R:18,dm:1.9,st:28};
function held2(k){return held(k)}
function inputDir(){let m=(held('right')?1:0)-(held('left')?1:0);if(stickV.x)m=Math.abs(stickV.x)>.3?Math.sign(stickV.x):0;return m}
const downHeld=()=>held('down')||stickV.y>.55;
function useSt(n){PL.st-=n;PL.stD=34}
function startAtk(heavy){const p=PL;
 // riposte / backstab
 if(p.og){const tgt=targets().find(e=>{const dx=(e.x-p.x)*p.face,sc=e.s||1;if(dx<-2||dx>24+8*sc||Math.abs(e.y-p.y)>16)return false;
  if(e.state==='parried'||e.state==='down')return true;return !e.boss&&e.state!=='dorm'&&e.face===p.face&&!['act','wind'].includes(e.state)});
  if(tgt){p.state='crit';p.t=0;p.target=tgt;p.back=!(tgt.state==='parried'||tgt.state==='down');tgt.state='critd';tgt.t=0;p.vx=0;p.inv=50;useSt(10);return}}
 const c=heavy?HV:LCMB[p.combo];p.state='atk';p.t=0;p.cur=c;p.heavy=heavy;p.hit=new Set();useSt(c.st);p.vx*=.3}
function updPlayer(){const p=PL;p.t++;p.anim++;if(p.inv>0)p.inv--;
 if(p.stD>0)p.stD--;else if(p.st<maxST())p.st=Math.min(maxST(),p.st+(p.guard?.45:p.state==='free'?1.3:.6));
 if(p.hpD>p.hp)p.hpD-=.6;else p.hpD=p.hp;
 for(const k of['atk','heavy','roll','wine','gren','jump'])if(pressed[k])buf={k,t:10};if(buf&&--buf.t<=0)buf=null;
 if(pressed.guard&&p.pc<=0){p.gT=0;p.pc=24}p.gT++;p.pc--;
 const m=inputDir(),grav=.28;
 const take=k=>{if(buf&&buf.k===k){buf=null;return true}return false};
 p.guard=false;
 switch(p.state){
 case 'free':{
  p.guard=!!held('guard')&&p.st>0;const sp=p.guard?.7:1.6;
  p.vx=m*sp;if(m&&!p.guard)p.face=m;else if(m&&p.guard&&!p.og)p.face=m;
  if(p.og&&m&&p.anim%16===0)X.step();
  if(buf&&p.st>0){
   if(buf.k==='jump'){if(p.og){buf=null;if(downHeld()&&p.onPlat){p.drop=12;p.og=false}else{p.vy=-4.9;p.og=false;SFX.jump();useSt(6)}}}
   else if(take('roll')){p.state='roll';p.t=0;if(m)p.face=m;useSt(18);X.roll();dust(p.x,p.y,4)}
   else if(take('atk')){if(!p.og&&downHeld()){p.state='plunge';p.t=0;p.vy=5.5;p.vx=0;p.hit=new Set();useSt(14);X.heavy()}else{p.combo=0;startAtk(false);X.swing()}}
   else if(take('heavy')){if(!p.og){p.state='plunge';p.t=0;p.vy=5.5;p.vx=0;p.hit=new Set();useSt(18);X.heavy()}else{startAtk(true)}}
   else if(take('wine')&&p.flask>0&&p.og){p.state='drink';p.t=0;X.drink()}
   else if(take('gren')&&p.gren>0){p.state='throw';p.t=0}}
  else if(buf&&buf.k==='wine'&&p.flask>0&&p.og){buf=null;p.state='drink';p.t=0;X.drink()}
  else if(buf&&buf.k==='wine'&&p.flask<=0){buf=null;pop(p.x,p.y-36,'NO WINE','#a8977c')}
  if(pressed.use&&near)interact(near);
  break}
 case 'atk':{const c=p.cur;if(p.t>=2&&p.t<=c.W+2&&p.og)p.vx=p.face*(c.thrust?1.8:1);else p.vx*=.7;
  if(p.t===c.W&&p.heavy)X.heavy();
  if(p.t>c.W&&p.t<=c.W+c.A){const reach=c.thrust?36:p.heavy?34:30;hitBox(p.face>0?p.x-2:p.x-reach,p.face>0?p.x+reach:p.x+2,p.y-30,p.y-2,ATK()*c.dm,p.heavy?28:10,p.heavy?'heavy':'light')}
  const tot=c.W+c.A+c.R;
  if(!p.heavy&&p.t>=c.W+c.A+4&&buf&&buf.k==='atk'&&p.st>0&&p.combo<2){buf=null;p.combo++;startAtk(false);X.swing();break}
  if(p.t>=c.W+c.A+6&&buf&&buf.k==='roll'&&p.st>0){buf=null;p.state='roll';p.t=0;const mm=inputDir();if(mm)p.face=mm;useSt(18);X.roll();break}
  if(p.t>=tot){p.state='free';p.t=0}
  break}
 case 'roll':{p.vx=p.face*(p.t<14?3.1:1.2);if(p.t>=20){p.state='free';p.t=0}break}
 case 'plunge':{p.vx=0;hitBox(p.x-12,p.x+12,p.y-14,p.y+6,ATK()*2.6,40,'plunge');if(p.og){p.state='land';p.t=0;shake=5;dust(p.x,p.y,10);SFX.land()}break}
 case 'land':{p.vx=0;if(p.t>=14){p.state='free';p.t=0}break}
 case 'drink':{p.vx=m*.4;if(p.t===30){p.flask--;const h=maxHP()*.45;p.hp=Math.min(maxHP(),p.hp+h);X.heal();for(let i=0;i<14;i++)parts.push({x:p.x+(rnd()-.5)*14,y:p.y-rnd()*26,vx:0,vy:-.6-rnd(),l:30,c:'#ffd24a',s:1,g:0})}if(p.t>=54){p.state='free';p.t=0}break}
 case 'throw':{p.vx=0;if(p.t===10){p.gren--;projs.push({k:'gren',x:p.x+p.face*6,y:p.y-22,vx:p.face*2.8,vy:-3.2,o:'p',life:200});SFX.throw()}if(p.t>=24){p.state='free';p.t=0}break}
 case 'hurt':{p.vx*=.85;if(p.t>=16){p.state='free';p.t=0}break}
 case 'gbreak':{p.vx*=.8;if(p.t>=44){p.state='free';p.t=0}break}
 case 'crit':{const e=p.target;p.vx=0;if(p.t<14&&e){p.x+=((e.x-p.face*(14+4*(e.s||1)))-p.x)*.25}
  if(p.t===8){p.shout={s:KILLS[e.fac]||KILLS.ccp,t:70}}
  if(p.t===16&&e){const mul=e.boss?(p.back?2.2:3.2):4;hs=10;shake=10;X.flesh();X.heavy();blood(e.x,e.y-16*(e.s||1),40,p.face);pop(e.x,e.y-34*(e.s||1),p.back?'BACKSTAB':'RIPOSTE','#ffd24a');damage(e,ATK()*mul,0,'crit',p.face,true)}
  if(p.t===30&&e&&!e.dead){e.state=e.boss?'down':'stag';e.t=e.boss?50:0}
  if(p.t>=40){p.state='free';p.t=0;p.target=null}break}
 case 'sit':{p.vx=0;break}
 case 'fogwalk':{p.vx=.9;p.face=1;if(p.t>=40){p.state='free';p.t=0;startBoss(p.arena)}break}
 case 'dead':{p.vx*=.9;break}
 case 'bitten':{p.vx=0;if(p.t>=60){p.state='hurt';p.t=0;p.vx=-3}break}
 }
 if(p.shout&&--p.shout.t<=0)p.shout=null;
 // physics
 const py=p.y;p.vy=Math.min(p.vy+grav,7);if(p.state==='plunge')p.vy=Math.max(p.vy,5.5);
 p.x+=p.vx;p.y+=p.vy;if(p.drop>0)p.drop--;
 const gy=Math.min(groundAt(p.x-4),groundAt(p.x+4));let landed=false;p.onPlat=false;
 if(p.vy>=0&&!p.drop)for(const q of PLATS){if(p.x>q.x-3&&p.x<q.x+q.w+3&&py<=q.y+.1&&p.y>=q.y){p.y=q.y;landed=true;p.onPlat=true;break}}
 if(!landed&&gy<1e3&&p.y>=gy&&py<=gy+6){p.y=gy;landed=true}
 if(landed){if(!p.og&&p.vy>3&&p.state!=='plunge'){SFX.land();dust(p.x,p.y,4)}p.vy=0;p.og=true;if(!p.onPlat&&!PITS.some(q=>p.x>q[0]-24&&p.x<q[1]+24))p.safe=p.x}else p.og=false;
 // bodies
 if(p.state!=='roll'&&p.state!=='dead')for(const e of targets()){if(e.state==='dorm'||e.state==='critd')continue;const w=7+5*(e.s||1);if(Math.abs(e.x-p.x)<w&&Math.abs(e.y-p.y)<20){p.x=e.x+(p.x<e.x?-w:w)}}
 // walls
 p.x=clamp(p.x,8,WW-8);
 if(arena)p.x=clamp(p.x,arena.a+10,arena.b-10);
 else for(const A of ARENAS)if(!G.boss[A.k]&&p.x>A.a-8&&p.x<A.b){if(p.state==='fogwalk'){}else p.x=Math.min(p.x,A.a-8)}
 if(p.y>H+40&&p.state!=='dead'){if(isWater(p.x))SFX.splash();die(true)}
 if(isWater(p.x)&&p.y>WATERY&&T%4===0)parts.push({x:p.x+(rnd()-.5)*10,y:WATERY,vx:(rnd()-.5)*2,vy:-2,l:20,c:'#9fc0dc',s:2,g:.15})}
function targets(){return ents.filter(e=>!e.dead).concat(bosses.filter(b=>!b.dead))}
function hitBox(x0,x1,y0,y1,dmg,poise,kind){const p=PL;
 for(const e of targets()){if(p.hit.has(e.id)||e.state==='critd')continue;const s=e.s||1,w=7*s*(e.wide||1);
  if(e.x+w<x0||e.x-w>x1||e.y<y0||e.y-28*s>y1)continue;p.hit.add(e.id);
  if(e.state==='dorm'){wakeMimic(e)}
  damage(e,dmg,poise,kind,p.face)}}
function damage(e,dmg,poise,kind,dir,crit){
 if(e.def&&e.def.shield&&!crit&&kind!=='heavy'&&kind!=='plunge'&&kind!=='boom'&&e.face===-dir&&e.state!=='stag'&&e.state!=='parried'){
  X.block();spark(e.x+e.face*8,e.y-16,8);pop(e.x,e.y-34,'BLOCKED','#a8977c');if(PL.state==='atk'){PL.state='hurt';PL.t=6;PL.vx=-dir*2}hs=4;return}
 if(e.state==='dorm')wakeMimic(e);const m=crit?1:(.9+rnd()*.2);dmg=Math.round(dmg*m);e.hp-=dmg;e.flash=6;
 if(!crit){X.flesh();blood(e.x,e.y-16*(e.s||1),kind==='heavy'?14:7,dir);hs=Math.max(hs,kind==='heavy'||kind==='plunge'?6:3);shake=Math.max(shake,kind==='heavy'?5:2)}
 pops.push({x:e.x+(rnd()-.5)*8,y:e.y-30*(e.s||1),s:String(dmg),c:crit?'#ffd24a':'#fff',t:0,n:1});
 if(e.hp<=0){kill(e,dir);return}
 if(e.state==='idle'&&!e.boss){e.state='chase'}
 e.pz+=poise;const lim_=e.boss?e.poiseMax:(e.def.poise);
 if(e.pz>=lim_&&!['critd','down','roar','intro','unite'].includes(e.state)){e.pz=0;if(e.boss){e.state='down';e.t=0;pop(e.x,e.y-50*e.s,'POISE BROKEN','#ffd24a');e.vx=0}else if((!e.def.mimic||kind!=='light')&&(e.state!=='act'||kind!=='light')){e.state='stag';e.t=0;e.x+=dir*3}}}
function kill(e,dir){e.dead=true;e.dt=0;e.hp=0;G.kills++;
 if(e.boss){bossDown(e);return}
 const y=Math.round(e.def.yuan*G.inf*(1+G.ng*.5));G.yuan+=y;pop(PL.x,PL.y-44,'+¥'+fmtBig(y),'#d9a441');X.coin();blood(e.x,e.y-14,18,dir);
 if(e.def.mimic){G.taken.push('mimic');itemGet('t3','ticket')}
 if(e.def.mini){banner={t:0,dur:200,text:'ENEMY FELLED',col:'#d9a441',size:24};X.felled();music('off')}}
function hitPlayer(dmg,sx,o={}){const p=PL;
 if(p.state==='dead'||p.state==='crit'||p.state==='bitten')return 'miss';
 if(p.inv>0||(p.state==='roll'&&p.t<14)||p.state==='fogwalk'){if(p.state==='roll'&&!p.dodged){p.dodged=1}return 'miss'}
 const front=Math.sign((sx-p.x)||p.face)===p.face;
 if(p.guard&&front&&!o.unblock){
  if(p.gT<10&&!o.noparry){X.parry();spark(p.x+p.face*10,p.y-18,22,'#ffd24a');hs=10;shake=4;pop(p.x+p.face*10,p.y-40,'PARRY!','#ffd24a');skyFlash=.3;skyFX=p.x-camX;p.st=Math.min(maxST(),p.st+10);return 'parry'}
  useSt(dmg*(o.heavy?1.8:1.15));X.block();spark(p.x+p.face*10,p.y-16,10);p.vx=-p.face*(o.kb||2);
  if(p.st<0){p.st=0;p.state='gbreak';p.t=0;pop(p.x,p.y-40,'GUARD BROKEN','#ff6a5a');SFX.hit()}return 'block'}
 dmg=Math.round(dmg);p.hp-=dmg;p.state='hurt';p.t=0;p.vx=-Math.sign((sx-p.x)||p.face)*(o.kb||2);p.vy=o.launch?-3:p.vy;p.inv=34;
 hs=Math.max(hs,5);shake=Math.max(shake,7);blood(p.x,p.y-16,14,-Math.sign(sx-p.x));SFX.hit();X.flesh();pop(p.x,p.y-36,'-'+dmg,'#ff6a5a');
 if(p.hp<=0){p.hp=0;die(false)}return 'hit'}
function die(fell){const p=PL;if(p.state==='dead')return;p.state='dead';p.t=0;p.vx=0;G.deaths++;music('off');X.died();
 if(G.stain){G.lost+=G.stain.val}
 G.stain=G.yuan>0?{x:fell?p.safe:p.x,y:fell?GY:p.y,val:G.yuan,orig:G.yuan}:null;G.yuan=0;
 dead={t:0};save()}
function respawn(i,warp){G.fire=i;const f=FIRES[i];PL=mkPlayer(f.x+16);arena=null;bosses=[];projs=[];spawnAll();dead=null;fadeA=1;setZone(zoneAt(PL.x));camX=clamp(PL.x-W/2,0,WW-W);state='play';music('off');ambSet();if(!warp)pop(PL.x,PL.y-40,'YOU ROSE AGAIN. NOBODY NOTICED.','#a8977c')}

/* ---------------- enemies ---------------- */
function enemyHit(e,x0,x1,y0,y1,dmg,o={}){if(e.hitDone)return;const p=PL;if(p.x+6<x0||p.x-6>x1||p.y<y0||p.y-26>y1)return;e.hitDone=true;
 const res=hitPlayer(dmg*NGD(),e.x,o);if(res==='parry'){if(e.boss){e.state='down';e.t=0;e.vx=0}else{e.state='parried';e.t=0}}
 else if(res==='hit'&&e.def&&e.def.mimic)X.bite();return res}
function wakeMimic(e){if(e.state!=='dorm')return;e.state='wind';e.t=10;e.atk=e.def.atks[0];e.n=0;X.bite();pop(e.x,e.y-30,'!!!','#ff6a5a');e.face=sgn(PL.x-e.x)}
function updEnemy(e){const d=e.def,dx=PL.x-e.x,adx=Math.abs(dx),dy=PL.y-e.y;e.t++;e.anim++;if(e.flash>0)e.flash--;if(e.pz>0)e.pz-=.05;
 if(e.dead){e.dt++;return}
 const alive=PL.state!=='dead',a=e.atk,s=e.s||(e.s=d.s||1);
 const go=v=>{const nx=clamp(e.x+v,e.minX,e.maxX);if(nx!==e.x&&e.og!==false&&e.anim%18===0&&adx<200)X.step();e.x=nx};
 switch(e.state){
 case 'dorm':return;
 case 'idle':{if(e.bar){e.bar=0;if(!arena)music('off')}if(e.hx!==undefined&&Math.abs(e.x-e.hx)>4)go(sgn(e.hx-e.x)*.5);if(alive&&adx<(d.mini?170:140)&&Math.abs(dy)<46){e.state='chase';e.t=0;e.cd=20+rnd()*30;X.alert();pop(e.x,e.y-38*s,'!','#ff6a5a');if(d.mini){music('duel');e.bar=1}}break}
 case 'chase':{if(!alive||adx>300||Math.abs(dy)>80){e.state='idle';break}e.face=sgn(dx);e.cd--;
  if(d.ranged&&adx>d.reach+4){if(adx<70)go(-e.face*d.spd);else if(adx>150)go(e.face*d.spd);if(e.cd<=0&&adx<210&&Math.abs(dy)<46){e.state='aim';e.t=0}break}
  if(d.lob&&adx>d.reach+4){if(adx<60)go(-e.face*d.spd);else if(adx>140)go(e.face*d.spd);if(e.cd<=0&&adx<190){e.state='throw';e.t=0}break}
  if(d.mini&&adx>64&&e.cd<=0&&rnd()<.03){e.state='word';e.t=0;break}
  if(adx>d.reach*s-2)go(e.face*d.spd*(d.mini&&adx>90?1.4:1));else if(e.cd<=0&&Math.abs(dy)<30){e.state='wind';e.t=0;e.n=0;e.atk=d.atks[0]}
  break}
 case 'wind':{const w=e.n?(a.w2||a.w):a.w;if(e.n===0&&e.t<6)e.face=sgn(dx);if(e.t>=w){e.state='act';e.t=0;e.hitDone=false;d.mimic?X.bite():X.swing()}break}
 case 'act':{go(e.face*a.lunge);const R=d.reach*s+8;enemyHit(e,e.face>0?e.x:e.x-R,e.face>0?e.x+R:e.x,e.y-30*s,e.y,a.dmg,{kb:2.5,heavy:d.shield});
  if(e.t>=a.a){e.n++;if(e.n<(a.n||1)){e.state='wind';e.t=0}else{e.state='rec';e.t=0}}break}
 case 'rec':{if(e.t>=(a.r||26)){e.state='chase';e.t=0;e.cd=24+rnd()*50}break}
 case 'aim':{e.face=sgn(dx);if(e.t===50){const my=e.y-10;projs.push({k:'bul',x:e.x+e.face*22,y:my,vx:e.face*4.2,vy:clamp((PL.y-14-my)/(adx/4.2||1),-1.2,1.2),o:'e',dmg:16,life:120});SFX.eshot();e.muzz=4}if(e.muzz)e.muzz--;if(e.t>=76){e.state='chase';e.t=0;e.cd=60+rnd()*50}break}
 case 'throw':{e.face=sgn(dx);if(e.t===20){const tt=48,vx=clamp(dx/tt,-3,3);projs.push({k:'gren',x:e.x,y:e.y-24,vx,vy:-3.4,o:'e',life:200});SFX.throw()}if(e.t>=44){e.state='chase';e.t=0;e.cd=110+rnd()*60}break}
 case 'word':{e.face=sgn(dx);if(e.t===30){projs.push({k:'word',x:e.x+e.face*16,y:e.y-30,vx:e.face*2.3,vy:0,o:'e',dmg:18,life:170,text:pick(['SELF-CRITICIZE!','STRUGGLE SESSION!','CONFESS!','RECTIFY!'])});SFX.word()}if(e.t>=56){e.state='chase';e.t=0;e.cd=30}break}
 case 'stag':{if(e.t>=(d.mini?40:30)){e.state='chase';e.t=0;e.cd=10}break}
 case 'parried':{if(e.t>=90){e.state='chase';e.t=0;e.cd=10}break}
 case 'critd':break}}

/* ---------------- bosses ---------------- */
const BOSSDEF={
 ma:{name:'GENERAL MA, EXECUTIONER OF DESERTERS',hp:720,s:2,fac:'kmt',poise:110,moves1:['combo','combo','leap','charge'],moves2:['combo','leap','charge','spin','spin'],yuan:9000},
 red:{name:'BROTHER RED, THE SWIFT',hp:430,s:1.6,fac:'ccp',poise:70,moves1:['lunge','lunge','jab','hop'],yuan:6000},
 blue:{name:'BROTHER BLUE, THE STOUT',hp:560,s:2.2,wide:1.3,fac:'kmt',poise:120,moves1:['slam','sweep','belly'],yuan:6000},
 wei:{name:'COMMISSAR WEI, SELF-CRITICISM ENFORCER',lk:'ma',officer:1,hp:520,s:1.7,fac:'ccp',poise:80,moves1:['combo','word','charge','word'],moves2:['combo','word','word','leap','spin'],yuan:4000,shout:'CRITICIZE YOURSELF!',roar:'CONFESS! MTFK!'},
 zhao:{name:'TREASURER ZHAO, KEEPER OF THE PRESSES',lk:'blue',hp:780,s:2.3,wide:1.4,fac:'kmt',poise:130,moves1:['slam','sweep','print','belly'],moves2:['print','slam','print','sweep','belly'],yuan:12000,roar:'PRINT MORE! MTFK!'},
 lu:{name:'COLONEL LU, OF FLEXIBLE LOYALTY',lk:'red',officer:1,hp:640,s:1.8,fac:'kmt',poise:90,moves1:['lunge','jab','hop','lunge'],moves2:['lunge','lunge','jab','hop','charge'],yuan:10000,shout:'FOR THE REPUBLIC!',shout2:'FOR THE PEOPLE!',roar:'I WAS ALWAYS RED!',defect:1}};
function mkBoss(k,x,face){const d=BOSSDEF[k];return{boss:1,k,lk:d.lk||k,def:d,name:d.name,x,y:GY,face,hp:d.hp*NGH(),max:d.hp*NGH(),s:d.s,wide:d.wide||1,fac:d.fac,state:'intro',t:0,cd:40,pz:0,poiseMax:d.poise,phase:1,moves:d.moves1.slice(),n:0,sub:0,vx:0,vy:0,hitDone:false,flash:0,dead:false,dt:0,anim:0,id:Math.random(),f:1,ang:.8}}
function startBoss(A){arena=A;fadeA=.6;if(A.k!=='bros'){bosses=[mkBoss(A.k,A.b-70,-1)];music('duel')}else{bosses=[mkBoss('red',A.b-60,-1),mkBoss('blue',A.b-110,-1)];music('final')}
 banner={t:0,dur:150,text:A.title||'THE BROTHERS',sub:A.sub||'WHO AGREE ON ONE THING',col:'#e9dcc2',size:26}}
function bossDown(b){blood(b.x,b.y-30,50,0);shake=14;hs=16;
 const rest=bosses.filter(o=>!o.dead);
 if(rest.length){const o=rest[0];o.state='unite';o.t=0;o.vx=0;return}
 const k=arena.k;G.boss[k]=1;const y=Math.round(b.def.yuan*G.inf*(1+G.ng*.5))*(k==='bros'?2:1);G.yuan+=y;pop(PL.x,PL.y-44,'+¥'+fmtBig(y),'#d9a441');
 const A=arena;banner={t:0,dur:260,text:A.fell,sub:A.fsub,col:'#d9a441',size:24,delay:50};
 setTimeout(()=>X.felled(),400);music('off');arena=null;itemGet(A.item,A.item,120);save()}
function bHit(b,x0,x1,y0,y1,dmg,o){return enemyHit(b,x0,x1,y0,y1,dmg,o)}
function updBoss(b){const dx=PL.x-b.x,adx=Math.abs(dx),s=b.s,f=b.f;b.t++;b.anim++;if(b.flash>0)b.flash--;if(b.pz>0)b.pz-=.12;
 if(b.dead){b.dt++;return}
 const A=arena,walk=v=>{b.x=clamp(b.x+v,A.a+6*s,A.b-6*s)};
 b.y=Math.min(GY,b.y);
 if(b.def.moves2&&b.phase===1&&b.hp<b.max*.5&&!['critd','down','leapair'].includes(b.state)&&b.state!=='roar'){b.state='roar';b.t=0}
 const melee=(R,dmg,o)=>bHit(b,b.face>0?b.x-6:b.x-R,b.face>0?b.x+R:b.x+6,b.y-34*s,b.y,dmg,o||{});
 switch(b.state){
 case 'intro':b.face=sgn(dx);if(b.t>=70){b.state='idle';b.t=0}break;
 case 'idle':{b.face=sgn(dx);const sp=b.lk==='blue'?.55:b.lk==='red'?1.2:1;if(adx>40*s/2+26)walk(b.face*sp*(b.phase>1?1.3:1));b.cd--;
  if(b.cd<=0&&PL.state!=='dead'){let mv=pick(b.moves);
   if(['combo','jab','sweep','slam'].includes(mv)&&adx>70+20*s)mv=pick(b.moves.filter(m=>!['combo','jab','sweep','slam'].includes(m)))||mv;
   if(['charge','lunge','leap','belly'].includes(mv)&&adx<40&&rnd()<.6)mv=b.moves.includes('combo')?'combo':b.moves.includes('jab')?'jab':b.moves.includes('sweep')?'sweep':mv;
   b.state=mv;b.t=0;b.n=0;b.sub=0;b.hitDone=false;b.vx=0;if(mv==='combo')b.third=14+rnd()*34|0;if(mv==='charge'||mv==='lunge')b.shout={s:(b.phase>1&&b.def.shout2)||b.def.shout||(b.k==='ma'?'DIE, DESERTER!':'FOR THE PEOPLE!'),t:60}}
  break}
 // --- General Ma
 case 'combo':{const W0=b.n===0?34*f:b.n===2?b.third*f:15*f;
  if(b.sub===0){if(b.t<8)b.face=sgn(dx);if(b.t>=W0){b.sub=1;b.t=0;b.hitDone=false;X.heavy()}}
  else{walk(b.face*2.6);melee(58,26,{kb:3});if(b.t>=8){b.n++;b.sub=0;b.t=0;if(b.n>=3){b.state='rec';b.rec=46}}}
  break}
 case 'leap':{if(b.sub===0){b.face=sgn(dx);if(b.t>=28*f){b.sub=1;b.t=0;const tx=clamp(PL.x,A.a+30,A.b-30);b.vx=(tx-b.x)/40;b.vy=-6;SFX.jump()}}
  else if(b.sub===1){walk(b.vx);b.vy+=.3;b.y+=b.vy;if(b.y>=GY&&b.t>4){b.y=GY;b.sub=2;b.t=0;slamFX(b,46*s/2+20,32)}}
  else if(b.t>=2){b.state='rec';b.rec=40}
  break}
 case 'charge':{if(b.sub===0){b.face=sgn(dx);if(b.t>=26*f){b.sub=1;b.t=0;b.hitDone=false}}
  else{walk(b.face*(b.lk==='blue'?2.4:3.4));if(b.anim%6===0)dust(b.x,b.y,2);bHit(b,b.x-12*s,b.x+12*s,b.y-30*s,b.y,24,{kb:4,launch:1});
   const past=(PL.x-b.x)*b.face<-50;if(b.t>=90||past||b.x<=A.a+7*s||b.x>=A.b-7*s){b.state='rec';b.rec=44;b.t=0}}
  break}
 case 'spin':{if(b.sub===0){if(b.t>=30*f){b.sub=1;b.t=0}}
  else{walk(sgn(dx)*1.5);if(b.t%18===0){b.hitDone=false;X.swing()}bHit(b,b.x-44,b.x+44,b.y-50,b.y,16,{kb:3});if(b.t>=100){b.state='rec';b.rec=60}}
  break}
 case 'roar':{b.vx=0;if(b.t===20){b.phase=2;b.f=.75;b.moves=b.def.moves2.slice();shake=16;skyFlash=1;skyFX=b.x-camX;b.shout={s:b.def.roar||'DIE, DESERTER! MTFK!',t:90};SFX.alarm();
   if(b.def.defect){b.fac='ccp';b.name='COLONEL LU (DEFECTED)';banner={t:0,dur:170,text:'COLONEL LU HAS DEFECTED',sub:'HE KEEPS THE SAME SPEAR',col:'#7ac06a',size:20}}
   if(adx<110&&PL.state!=='dead'){PL.vx=sgn(dx)*4;PL.vy=-2;if(PL.state==='free'||PL.state==='atk'){PL.state='hurt';PL.t=0}}music('final')}
  if(b.t>=70){b.state='idle';b.cd=20;b.t=0}break}
 case 'word':{if(b.sub===0){b.face=sgn(dx);if(b.t>=24*f){b.sub=1;b.t=0}}
  else{const n=b.phase>1?3:2;if(b.t%14===1&&b.t<n*14){projs.push({k:'word',x:b.x+b.face*20,y:b.y-(b.t%28<14?12:22),vx:b.face*2.6,vy:0,o:'e',dmg:20,life:170,text:pick(['SELF-CRITICIZE!','STRUGGLE SESSION!','CONFESS!','RECTIFY!','WRITE IT DOWN!'])});SFX.word()}if(b.t>=n*14+10){b.state='rec';b.rec=30}}
  break}
 case 'print':{if(b.sub===0){b.face=sgn(dx);if(b.t>=30*f){b.sub=1;b.t=0;X.coin()}}
  else{const n=b.phase>1?5:3;if(b.t%12===1&&b.t<n*12){projs.push({k:'word',x:b.x+b.face*24,y:b.y-(b.t%24<12?10:24),vx:b.face*(2.4+rnd()*.8),vy:0,o:'e',dmg:18,life:180,text:pick(['¥1,000,000','¥5,000,000','NEW ISSUE!','STILL VALID!','¥10,000,000']),note:1});X.coin()}if(b.t>=n*12+12){b.state='rec';b.rec=40}}
  break}
 // --- Brother Red
 case 'lunge':{if(b.sub===0){b.face=sgn(dx);if(b.t>=30*f){b.sub=1;b.t=0;b.hitDone=false;b.sx=b.x;X.swing()}}
  else{walk(b.face*6.2);melee(52,22,{kb:3});if(Math.abs(b.x-b.sx)>150||b.t>=26||b.x<=A.a+7*s||b.x>=A.b-7*s){b.state='rec';b.rec=36;b.t=0}}
  break}
 case 'jab':{const W0=b.n===0?20*f:9*f;if(b.sub===0){if(b.t<6)b.face=sgn(dx);if(b.t>=W0){b.sub=1;b.t=0;b.hitDone=false;X.swing()}}
  else{walk(b.face*1.4);melee(50,14,{kb:2});if(b.t>=5){b.n++;b.sub=0;b.t=0;if(b.n>=3){b.state='rec';b.rec=34}}}
  break}
 case 'hop':{if(b.t===1){b.vy=-4;b.vx=-b.face*3.4}walk(b.vx);b.vy+=.3;b.y+=b.vy;if(b.y>=GY&&b.t>3){b.y=GY;b.state='idle';b.cd=rnd()<.6?1:20;b.t=0;if(b.cd===1)b.moves.includes('lunge')&&(b.state='lunge',b.sub=0,b.t=0)}break}
 // --- Brother Blue
 case 'slam':{if(b.sub===0){if(b.t<10)b.face=sgn(dx);if(b.t>=44*f){b.sub=1;b.t=0;b.hitDone=false}}
  else{if(b.t===2){slamFX(b,0,0);const R=60;bHit(b,b.face>0?b.x:b.x-R,b.face>0?b.x+R:b.x,b.y-60,b.y,34,{kb:4,noparry:1,launch:1});for(const v of[-1,1])projs.push({k:'coin',x:b.x+b.face*44,y:GY,vx:v*2.8,vy:0,o:'e',dmg:18,life:80})}
   if(b.t>=8){b.state='rec';b.rec=50}}
  break}
 case 'sweep':{if(b.sub===0){if(b.t<10)b.face=sgn(dx);if(b.t>=34*f){b.sub=1;b.t=0;b.hitDone=false;X.heavy()}}
  else{melee(70,26,{kb:4});if(b.t>=10){b.state='rec';b.rec=40}}
  break}
 case 'belly':{if(b.sub===0){b.face=sgn(dx);if(b.t>=30*f){b.sub=1;b.t=0;const tx=clamp(PL.x,A.a+34,A.b-34);b.vx=(tx-b.x)/50;b.vy=-7;SFX.jump()}}
  else if(b.sub===1){walk(b.vx);b.vy+=.28;b.y+=b.vy;if(b.y>=GY&&b.t>4){b.y=GY;b.sub=2;b.t=0;slamFX(b,56,36)}}
  else if(b.t>=2){b.state='rec';b.rec=60}
  break}
 case 'unite':{b.vx=0;const o=bosses.find(q=>q.dead);if(b.t%3===0&&o)parts.push({x:o.x+(rnd()-.5)*20,y:o.y-rnd()*40,vx:(b.x-o.x)/40,vy:-.5,l:40,c:'#c08aff',s:2,g:0});
  if(b.t===60){b.hp=b.max;b.s*=1.15;b.uni=1;b.fac='uni';b.f=.8;b.poiseMax*=1.3;b.name='THE UNITED FRONT (TEMPORARY)';b.moves=['lunge','jab','hop','slam','sweep','belly','lunge'];shake=14;skyFlash=1;skyFX=b.x-camX;SFX.alarm();
   banner={t:0,dur:180,text:'THE BROTHERS HAVE UNITED',sub:'AGAINST YOU, SPECIFICALLY',col:'#c08aff',size:20}}
  if(b.t>=100){b.state='idle';b.t=0;b.cd=10}break}
 case 'rec':{if(b.t>=b.rec*(b.phase>1?.8:1)){b.state='idle';b.t=0;b.cd=(14+rnd()*30)*f}break}
 case 'down':{b.vx=0;b.y=GY;if(b.t>=100){b.state='idle';b.t=0;b.cd=10}break}
 case 'critd':break}
 if(b.shout&&--b.shout.t<=0)b.shout=null;
 if(b.k==='ma'&&b.phase>1&&T%2===0&&!b.dead){const a=b.ang,ux=Math.cos(a)*b.face,uy=Math.sin(a),k=rnd()*18*s;parts.push({x:b.x+b.face*2*s+ux*(6*s+k),y:b.y-10*s+uy*(6*s+k),vx:(rnd()-.5)*.4,vy:-.8-rnd(),l:16,c:pick(['#ff8a1a','#ffd24a','#ff5a1a']),s:2,g:-.02})}
 for(const o of bosses)if(o!==b&&!o.dead&&Math.abs(o.x-b.x)<18){b.x+=b.x<o.x?-.6:.6}
 if(b.y>=GY-1&&!['charge','lunge','critd'].includes(b.state)&&PL.state!=='dead'){const md=8+8*s*(b.wide||1),d=PL.x-b.x;if(Math.abs(d)<md){b.x=clamp(PL.x-(d>=0?1:-1)*md,A?A.a+6*s:b.x,A?A.b-6*s:b.x)}}}
function slamFX(b,R,dmg){shake=12;SFX.stomp();dust(b.x,b.y,18);if(dmg&&PL.og&&Math.abs(PL.x-b.x)<R)bHit(b,b.x-R,b.x+R,b.y-20,b.y,dmg,{kb:4,noparry:1,launch:1});
 if(b.lk!=='blue'||dmg)for(const v of[-1,1])projs.push({k:'shock',x:b.x+v*14,y:GY,vx:v*3,vy:0,o:'e',dmg:18,life:70})}

/* ---------------- projectiles & world ---------------- */
function updProjs(){for(const q of projs){q.life--;q.x+=q.vx;q.y+=q.vy;
 if(q.k==='gren'){q.vy+=.18;const g=groundAt(q.x);let hit=q.y>=g;for(const p of PLATS)if(q.vy>0&&q.x>p.x&&q.x<p.x+p.w&&q.y>=p.y&&q.y-q.vy<=p.y)hit=true;
  if(q.o==='p')for(const e of targets())if(Math.abs(e.x-q.x)<8*(e.s||1)&&q.y>e.y-30*(e.s||1)&&q.y<e.y)hit=true;
  if(hit||q.life<=0){q.life=0;if(q.y<H+10)boomAt(q.x,Math.min(q.y,GY),q.o)}continue}
 if(q.k==='shock'||q.k==='coin'){if(q.life%4===0)dust(q.x,q.y,1);if(Math.abs(PL.x-q.x)<9&&PL.y>GY-14&&!q.done){const res=hitPlayer(q.dmg*NGD(),q.x-q.vx*5,{kb:2,noparry:1});if(res!=='miss')q.done=1}continue}
 if(q.o==='e'){if(Math.abs(PL.x-q.x)<7&&q.y>PL.y-28&&q.y<PL.y){const res=hitPlayer(q.dmg*NGD(),q.x-q.vx*3,{kb:1.5});
   if(res==='parry'){q.o='p';q.vx=-q.vx*1.4;q.vy=0;q.dmg*=2.5;pop(q.x,q.y-10,'RETURN TO SENDER','#ffd24a')}else if(res!=='miss')q.life=0}}
 else for(const e of targets())if(e.state!=='dorm'&&Math.abs(e.x-q.x)<8*(e.s||1)&&q.y>e.y-30*(e.s||1)&&q.y<e.y){damage(e,q.dmg,20,'light',sgn(q.vx));q.life=0;break}
 if(groundAt(q.x)<q.y)q.life=0}
 projs=projs.filter(q=>q.life>0&&q.x>camX-60&&q.x<camX+W+60)}
function itemGet(id,k0,delay=0){if(!G.taken.includes(id))G.taken.push(id);const k=({notebook:'gren',plate:'whet',cap:'vest'})[k0]||k0;
 if(k==='ticket')G.flaskMax++;else if(k==='whet')G.whet++;else if(k==='gren')G.grenMax++;else if(k==='vest'){G.vest++;PL.hp+=maxHP()-Math.round(maxHP()/1.15)}else if(k==='yuan'){const y=Math.round(2500*G.inf);G.yuan+=y}
 if(k==='ticket')PL.flask++;if(k==='gren')PL.gren++;
 setTimeout(()=>{itemBox={k:k0,t:0};SFX.weapon()},delay*16);save()}
function interact(n){const p=PL;
 if(n.k==='fire'){restAt(n.i);return}
 if(n.k==='msg'){reading={m:n.o,t:0};SFX.radio();return}
 if(n.k==='item'){itemGet(n.o.id,n.o.k);spark(n.o.x,n.o.y-6,14,'#fff');return}
 if(n.k==='fog'){p.state='fogwalk';p.t=0;p.arena=n.o;X.fog();return}
 if(n.k==='mimic'){wakeMimic(n.o);n.o.state='act';n.o.t=0;n.o.hitDone=true;p.state='bitten';p.t=0;p.x=n.o.x-n.o.face*14;const d=Math.round(45*NGD());p.hp-=d;p.inv=70;blood(p.x,p.y-16,30,0);X.bite();shake=10;pop(p.x,p.y-36,'-'+d,'#ff6a5a');if(p.hp<=0){p.hp=0;die(false)}return}
 if(n.k==='ferry'){finish();return}}
function findNear(){const p=PL;near=null;if(p.state!=='free'||!p.og)return;
 FIRES.forEach((f,i)=>{if(Math.abs(p.x-f.x)<20&&p.y===GY)near={k:'fire',i,label:G.lit.includes(i)?'REST':'LIGHT THE STOVE'}});if(near)return;
 for(const it of ITEMS)if(!G.taken.includes(it.id)&&Math.abs(p.x-it.x)<12&&Math.abs(p.y-it.y)<4){near={k:'item',o:it,label:'PICK UP'};return}
 for(const e of ents)if(e.state==='dorm'&&Math.abs(p.x-e.x)<20){near={k:'mimic',o:e,label:'OPEN THE CRATE'};return}
 for(const A of ARENAS)if(!G.boss[A.k]&&!arena&&p.x>A.a-28&&p.x<=A.a){near={k:'fog',o:A,label:'ENTER THE FOG'};return}
 if(G.boss.bros&&p.x>WW-70){near={k:'ferry',label:'BOARD THE LAST FERRY'};return}
 for(const m of MSGS)if(Math.abs(p.x-m.x)<12&&p.y===GY){near={k:'msg',o:m,label:'READ MESSAGE'};return}}
function restAt(i){const p=PL,first=!G.lit.includes(i);p.state='sit';p.t=0;p.vx=0;G.fire=i;
 if(first){G.lit.push(i);banner={t:0,dur:170,text:'TEA STOVE LIT',col:'#ffb04a',size:24};X.lit()}
 G.inf*=1.15;p.hp=maxHP();p.flask=G.flaskMax;p.gren=G.grenMax;p.st=maxST();spawnAll();projs=[];save();
 music('ending');setTimeout(()=>{if(state==='play'&&PL.state==='sit')openFire()},first?1500:500)}

/* ---------------- tea stove menu ---------------- */
const fireEl=$('#fire');
function openFire(){state='fire';fireEl.hidden=false;$('#tU').hidden=true;$('#touch').hidden=true;$('#fireH').textContent=FIRES[G.fire].name;$('#fireN').textContent=pick(NEWS).replace('15%','15%');$('#fTip').textContent='Tip: '+pick(TIPS);refreshFire();setTimeout(()=>$('#fireGo').focus(),50)}
function refreshFire(){const c=cost();$('#fY').textContent='¥ '+fmtBig(G.yuan);$('#fC').textContent='¥ '+fmtBig(c);$('#sV').textContent=G.vig;$('#sE').textContent=G.end;$('#sS').textContent=G.str;$('#fL').textContent=SL()+(G.ng?'  (NG+'+G.ng+')':'');
 $('#fD').textContent=maxHP()+' · '+maxST()+' · '+Math.round(ATK());$('#fF').textContent=G.flaskMax+' · '+G.grenMax;
 fireEl.querySelectorAll('.stat button').forEach(b=>b.disabled=G.yuan<c||G[b.dataset.s]>=60);
 const w=$('#warp');w.innerHTML='';G.lit.slice().sort((a,b)=>a-b).forEach(i=>{const b=document.createElement('button');b.textContent=(i===G.fire?'▶ ':'')+FIRES[i].name;if(i===G.fire)b.className='here';b.onclick=()=>{if(i===G.fire)return;closeFire();respawn(i,true);PL.state='free';G.fire=i;save();X.fog()};w.appendChild(b)})}
fireEl.querySelectorAll('.stat button').forEach(b=>b.onclick=()=>{const c=cost();if(G.yuan<c)return;G.yuan-=c;G[b.dataset.s]++;SFX.oneup();PL.hp=maxHP();PL.st=maxST();save();refreshFire()});
function closeFire(){fireEl.hidden=true;state='play';if(touchUI)$('#touch').hidden=false;music('off')}
$('#fireGo').onclick=()=>{closeFire();PL.state='free';PL.t=0};

/* ---------------- render ---------------- */
function drawBlade(ox,oy,a,fc,ext,len,col,edge,w=3){const ux=Math.cos(a)*fc,uy=Math.sin(a),hx=ox+ux*ext,hy=oy+uy*ext;
 seg(hx-ux*2,hy-uy*2,hx+ux*3,hy+uy*3,2,'#4a2a18');const gx=hx+ux*3,gy=hy+uy*3;r(gx-uy*2-1,gy+ux*2-1,2,2,'#d9a441');r(gx+uy*2-1,gy-ux*2-1,2,2,'#d9a441');
 seg(gx+ux,gy+uy,gx+ux*len,gy+uy*len,w,col);seg(gx+ux*2-uy,gy+uy*2+ux*.0-ux,gx+ux*(len-1)-uy,gy+uy*(len-1)-ux,1,edge);r(gx+ux*(len+1)-1,gy+uy*(len+1)-1,2,2,col);return[hx,hy]}
function arm(ox,oy,hx,hy,c){seg(ox,oy,hx,hy,3,c);r(hx-1,hy-1,3,3,SK)}
function lid(x,y,front){if(front){r(x-2,y-7,4,15,'#4a4a52');r(x-1,y-8,2,17,'#5a5a64');r(x-2,y-1,4,1,'#7a7a84');r(x,y-1,1,1,'#2a2a30')}else{r(x-2,y-5,4,10,'#3a3a42');r(x-1,y-6,2,12,'#4a4a52')}}
function swordPose(p){const st=p.state;
 if(st==='atk'){const c=p.cur,t=p.t;if(t<=c.W)return[lerp(.5,c.a0,t/c.W),c.thrust?4:5,0];if(t<=c.W+c.A){const k=(t-c.W)/c.A;return[lerp(c.a0,c.a1,k),c.thrust?4+k*7:5,1,c.a0]}return[c.a1,c.thrust?9:5,0]}
 if(st==='plunge'||st==='land')return[1.45,5,st==='plunge'?1:0,1.2];
 if(st==='crit'){const t=p.t;return t<12?[-.4,3,0]:t<22?[0,12,1,-.2]:[.4,6,0]}
 if(st==='drink'||st==='throw')return[.6,4,0];if(p.guard)return[-.5,5,0];if(st==='sit')return[1.5,2,0];
 return[.5+Math.sin(p.anim/20)*.05,5,0]}
function drawPlayer(){const p=PL,x=Math.round(p.x-camX),y=Math.round(p.y),fc=p.face,st=p.state;
 if(p.inv>0&&!['roll','crit','fogwalk','dead','bitten','sit'].includes(st)&&(T>>1)%2)return;
 if(st==='roll'){ctx.save();ctx.translate(x,y-7);ctx.rotate(fc*Math.min(1,p.t/18)*Math.PI*2);drawSoldier(-8,7,{fac:S,face:fc,pose:'crouch',emo:'grit',gun:null});ctx.restore();return}
 if(st==='dead'){ctx.save();ctx.translate(x,y-Math.min(1,p.t/24)*5);ctx.rotate(-fc*Math.min(1,p.t/24)*Math.PI/2);drawSoldier(-8,0,{fac:S,face:fc,emo:'dead',gun:null});ctx.restore();return}
 let pose='idle';if(!p.og)pose='jump';else if(Math.abs(p.vx)>.3&&(st==='free'||st==='fogwalk'||st==='drink'))pose='run';if(st==='sit')pose='sit';if(st==='land'||st==='gbreak'&&p.t<30)pose='crouch';
 const lo=p.hp<maxHP()*.25;
 const emo=st==='hurt'||st==='bitten'?'hurt':st==='gbreak'?'scared':st==='drink'?(p.t>30?'happy':'normal'):st==='sit'?(p.t>60?'sleep':'happy'):st==='crit'?'shout':p.shout?'shout':st==='atk'?(p.heavy?'shout':'grit'):st==='plunge'?'shout':p.guard?'grit':lo?'scared':'determined';
 if(!p.guard)lid(x-fc*7,y-12+(pose==='crouch'?6:pose==='sit'?4:0),false);
 drawSoldier(x-8,y,{fac:S,face:fc,pose,anim:p.anim,emo,blink:(T%180)<6,gun:null});
 const dy=pose==='crouch'?7:pose==='sit'?4:0,ox=x+fc*2,oy=y-10+dy;const[a,ext,act,a0]=swordPose(p);p.ang=a;
 if(act&&a0!=null){ctx.globalAlpha=.35;const n=8;for(let i=0;i<=n;i++){const aa=lerp(a0,a,i/n),ux=Math.cos(aa)*fc,uy=Math.sin(aa);seg(ox+ux*(ext+8),oy+uy*(ext+8),ox+ux*(ext+19),oy+uy*(ext+19),2,i>n-3?'#fff':'#e9dcc2')}ctx.globalAlpha=1}
 const[hx,hy]=[ox+Math.cos(a)*fc*ext,oy+Math.sin(a)*ext];
 if(st==='drink'){const bx=x+fc*7,by=y-22+(p.t>8&&p.t<44?-2:6);seg(x+fc*3,y-10,bx,by,3,PAL.kmt.u);r(bx-2,by-6,4,7,'#c9b08a');r(bx-1,by-8,2,2,'#7a5a3a')}
 if(st==='throw'&&p.t<10){r(x-fc*6,y-24,2,6,WOOD);r(x-fc*6-1,y-28,4,4,'#3a4030')}
 if(p.heavy&&st==='atk'&&p.t<=p.cur.W&&p.t%4<2){ctx.globalAlpha=.5;r(hx-3,hy-3,6,6,'#ffe27a');ctx.globalAlpha=1}
 drawBlade(ox,oy,a,fc,ext,15,'#c4c4c8','#f4f4f4',3);arm(ox,oy,hx,hy,PAL.kmt.u);
 if(p.guard)lid(x+fc*10,y-14,true);
 if(p.shout)drawShout(p.shout.s,x,y-40,true)}
function glint(x,y){if(T%4<2){r(x-3,y,7,1,'#fff');r(x,y-3,1,7,'#fff');r(x-1,y-1,3,3,'#ffd24a')}}
function drawEnemy(e){const d=e.def,x=Math.round(e.x-camX),y=Math.round(e.y),s=e.s||1;if(x<-60||x>W+60)return;
 if(e.dead&&e.dt>80)return;ctx.save();if(e.dead){ctx.globalAlpha=Math.max(0,1-e.dt/80);ctx.translate(x,y-Math.min(1,e.dt/15)*5);ctx.rotate(-e.face*Math.min(1,e.dt/15)*Math.PI/2);ctx.translate(-x,-y)}
 if(e.flash>0&&CANFILTER)ctx.filter='brightness(2.6)';
 const st=e.state,wind=st==='wind',act=st==='act',fc=e.face,off=wind?-fc*Math.min(3,e.t/6):act?fc*2:0;
 const emo=e.dead?'dead':st==='stag'||st==='parried'||st==='critd'?'hurt':wind||st==='aim'?'grit':act||st==='word'?'shout':st==='chase'?'determined':'normal';
 const pose=st==='parried'||st==='critd'?'crouch':(st==='chase'&&Math.abs(PL.x-e.x)>d.reach*s)?'run':'idle';
 const tel=wind&&e.t>(e.n?(e.atk.w2||e.atk.w):e.atk.w)-12;
 if(d.mimic){drawMimic(e,x,y);ctx.restore();return}
 if(s!==1){ctx.translate(x,y);ctx.scale(s,s);ctx.translate(-x,-y)}
 const X0=x-8+off;
 if(e.k==='pitch'){drawCivilian(X0,y,{face:fc,hat:'straw',emo,pose,anim:e.anim,cl:'#6a5a40',cl2:'#4a3e2c'});const sx=x+off+fc*2,sy=y-9,tx=sx+fc*(act?28:22),ty=sy-(wind?6:2);seg(sx-fc*6,sy+2,tx,ty,2,WOOD);for(let k=-1;k<=1;k++)seg(tx,ty+k*2,tx+fc*5,ty+k*2,1,'#9a9a9a');if(tel)glint(tx+fc*5,ty)}
 else if(e.k==='shield'){drawSoldier(X0,y,{fac:'civ',face:fc,pose,anim:e.anim,emo,gun:null});const up=st!=='stag'&&st!=='parried';
  if(wind||act){const a=wind?-2.2:act?lerp(-2.2,1,e.t/6):1;const ox=x+off+fc,oy=y-11,ux=Math.cos(a)*fc,uy=Math.sin(a);seg(ox,oy,ox+ux*16,oy+uy*16,3,'#2a2a2a');if(tel)glint(ox+ux*16,oy+uy*16)}
  const sx=x+off+(up?fc*9:fc*4)-(fc<0?10:0)+(fc<0?0:-2);r(sx,y-(up?28:18),10,up?26:16,'#6a4a2a');r(sx,y-(up?28:18),10,1,'#8a6a42');for(let k=0;k<3;k++)r(sx+1+k*3,y-(up?27:17),1,up?24:14,'#5a3a20');r(sx+(fc>0?7:2),y-15,2,2,'#d9a441')}
 else if(e.k==='commissar'){drawSoldier(X0,y,{fac:'ccp',face:fc,pose,anim:e.anim,emo,officer:1,gun:null});const ox=x+off+fc*2,oy=y-10;
  const a=wind?lerp(.9,-2.1,e.t/10):act?lerp(-2.1,1,e.t/6):st==='word'?-.3:.9;const[hx,hy]=drawBlade(ox,oy,a,fc,5,13,'#b8b8bc','#ececec',2);arm(ox,oy,hx,hy,PAL.ccp.u);
  r(x-fc*8-2,y-14,5,4,'#c8372d');r(x-fc*8-(fc>0?5:-3),y-15,3,6,'#e0302a');if(tel)glint(hx+Math.cos(a)*fc*14,hy+Math.sin(a)*14)}
 else{const gun='rifle';const aim=st==='aim',th=st==='throw'?Math.max(0,14-e.t*.7):null;
  drawSoldier(X0,y,{fac:e.fac,face:fc,pose,anim:e.anim,emo,gun:e.k==='gren'&&th!=null?null:gun,bayo:e.k==='conscript'||e.k==='rifle',muzz:e.muzz>0,throwT:th});
  if(e.k==='conscript'&&tel)glint(x+off+fc*24,y-10);
  if(aim&&e.t<50){const tx=PL.x-camX,ty=PL.y-14,mx=x+fc*22,my=y-10;ctx.globalAlpha=e.t>36?.9:.35;for(let k=0;k<1;k+=.06){const px=mx+(tx-mx)*k,py=my+(ty-my)*k;r(px,py,1,1,e.t>36&&T%4<2?'#fff':'#ff3a2a')}ctx.globalAlpha=1;if(e.t>36)glint(mx,my)}}
 ctx.filter='none';ctx.restore();
 if(!e.dead&&!d.mini&&e.hp<e.max&&e.state!=='dorm'){const w=20;r(x-w/2,y-36*s,w,2,'#2a0a0a');r(x-w/2,y-36*s,w*e.hp/e.max,2,'#c8372d')}
 if(st==='parried'||st==='stag'&&d.mini)if(T%20<12)r(x-1,y-44*s,2,2,'#ffd24a')}
function drawMimic(e,x,y){const dorm=e.state==='dorm',open=!dorm&&(e.state==='act'||e.state==='wind'&&e.t%10<5)?8:dorm?0:3;
 if(!dorm){const p=e.anim*.4;for(const[fx,ph]of[[x-6,0],[x+4,3]]){const l=Math.max(0,Math.sin(p+ph))*3;seg(fx,y-6,fx+(Math.cos(p+ph)*2),y-l,3,SK);r(fx-2,y-1-l,5,2,BOOT)}}
 const by=dorm?y:y-6;r(x-11,by-14,22,14,'#7a5a35');r(x-11,by-14,22,2,'#9c7a4c');r(x-11,by-8,22,1,'#5a3a20');txt('AID',x-11,by-12,'#e9dcc2');
 ctx.save();ctx.translate(x-11,by-14);ctx.rotate(-open*.08);r(0,-4,22,4,'#8a6a42');r(0,-4,22,1,'#a88a5a');ctx.restore();
 if(open){r(x-10,by-15-open,20,open,'#3a0a0a');for(let i=0;i<5;i++){r(x-9+i*4,by-15-open,2,2,'#f4f4f4');r(x-9+i*4,by-16,2,2,'#f4f4f4')}r(x-3,by-14,8,2,'#d0504a');
  r(x-6,by-21-open,3,3,'#fff');r(x+3,by-21-open,3,3,'#fff');r(x-5+(e.face>0?1:0),by-20-open,1,1,'#120d0c');r(x+4+(e.face>0?1:0),by-20-open,1,1,'#120d0c')}}
function drawBoss(b){const x=Math.round(b.x-camX),y=Math.round(b.y),s=b.s,fc=b.face,st=b.state;
 if(b.dead&&b.dt>120)return;ctx.save();if(b.dead){ctx.globalAlpha=Math.max(0,1-b.dt/120);if(b.dt%3===0)parts.push({x:b.x+(rnd()-.5)*20*s/2,y:b.y-rnd()*30*s,vx:0,vy:-.6,l:40,c:'#e9dcc2',s:1,g:-.01})}
 if(b.flash>0&&CANFILTER)ctx.filter='brightness(2.4)';
 ctx.translate(x,y);ctx.scale(s*(b.wide||1),s);
 const wind=b.sub===0&&['combo','leap','charge','spin','lunge','jab','slam','sweep','belly','word','print'].includes(st),air=b.y<GY-1;
 const emo=b.dead?'dead':st==='down'||st==='critd'?'hurt':st==='roar'||b.shout?'shout':wind?'grit':st==='rec'?'determined':st==='unite'?'cry':'smug';
 const pose=b.dead||st==='down'||st==='critd'||(st==='leap'||st==='belly')&&b.sub===0?'crouch':air?'jump':st==='idle'&&Math.abs(PL.x-b.x)>50?'run':'idle';
 if(b.uni){PAL.uni=PAL.uni||{h:'#4a2a5a',hs:'#2a1a3a',s:'#d9a441',u:'#7a5a90',uh:'#9a7ab0',d:'#4a3a60',p:'#8a7a9a'}}
 drawSoldier(-8,0,{fac:b.fac,face:fc,pose,anim:b.anim,emo,officer:!!b.def.officer||b.k==='ma',gun:null,hero:b.uni});
 const dy=pose==='crouch'?7:0,ox=fc*2,oy=-10+dy;let a=.35;const t=b.t;
 if(b.lk==='ma'){if(st==='combo'){const odd=b.n%2;a=b.sub===0?lerp(.35,odd?.9:-2.3,t/12):lerp(odd?.9:-2.3,odd?-1.4:.8,t/6)}else if(st==='leap'||st==='belly')a=-2.4;else if(st==='charge')a=b.sub?0:-.6;else if(st==='spin')a=b.sub?t*.7:-.8;else if(st==='roar')a=-1.6;else if(st==='down'||st==='critd'||b.dead)a=.6;
  b.ang=a;const[hx,hy]=drawBlade(ox,oy,a,fc,5,18,b.phase>1&&b.k==='ma'?'#e8b070':'#c4c4c8','#fff',4);arm(ox,oy,hx,hy,(PAL[b.fac]||PAL.kmt).u);if(wind&&t>8&&st!=='spin')glint(hx+Math.cos(a)*fc*18,hy+Math.sin(a)*18)}
 if(b.lk==='red'||b.uni){if(st==='lunge')a=0;else if(st==='jab')a=b.sub?0:.15;else if(st==='down')a=1.2;else a=.35;const ext=st==='jab'&&b.sub?10:st==='lunge'&&b.sub?8:wind?1:5;
  const ux=Math.cos(a)*fc,uy=Math.sin(a),hx=ox+ux*ext,hy=oy+uy*ext;seg(hx-ux*14,hy-uy*14,hx+ux*22,hy+uy*22,2,WOOD);seg(hx+ux*22,hy+uy*22,hx+ux*28,hy+uy*28,2,'#d8d8d8');r(hx+ux*21-1,hy+uy*21,3,3,'#c8372d');r(hx+ux*20-uy*2,hy+uy*20+3,2,4,'#e0302a');arm(ox,oy,hx,hy,(PAL[b.fac]||PAL.ccp).u);if(wind&&t>10)glint(hx+ux*28,hy+uy*28)}
 if(b.lk==='blue'||b.uni){let sx=-fc*8,sy=-22;if(st==='slam'){const k=b.sub?1:t/(44*b.f);sx=lerp(-fc*6,fc*20,b.sub?1:0)-(b.sub?0:fc*k*4);sy=b.sub?-6:lerp(-22,-34,k)}else if(st==='sweep'){sx=b.sub?fc*18:-fc*12;sy=b.sub?-12:-20}else if(st==='belly')sy=-30;else if(st==='print'){sx=fc*10;sy=b.sub?-16:-26}
  arm(ox,oy,sx+(fc>0?0:0),sy+6,(PAL[b.fac]||PAL.kmt).u);r(sx-7,sy-6,14,13,'#a08a5a');r(sx-6,sy-7,12,1,'#b8a06a');r(sx-2,sy-9,4,3,'#7a6a42');txt('¥',sx-3,sy-3,'#d9a441');if(wind&&t>14)glint(sx,sy-8)}
 ctx.filter='none';ctx.restore();
 if(b.shout&&!b.dead)drawShout(b.shout.s,x,y-36*s-4,false)}
function drawProj(q){const x=q.x-camX,y=q.y;
 if(q.k==='bul'){r(x-3,y,6,1,q.o==='p'?'#ffd24a':'#ffe27a');r(x-1,y-1,2,3,'#fff')}
 else if(q.k==='gren'){r(x-1,y-4,2,5,WOOD);r(x-2,y-7,4,4,'#3a4030');if(T%4<2)r(x,y+1,1,1,'#ffb04a')}
 else if(q.k==='word'){ctx.font=F;const w=ctx.measureText(q.text).width+6;r(x-w/2,y-6,w,12,q.o==='p'?'#2f4f8a':q.note?'#5a6a3a':'#b8322a');r(x-w/2,y-6,w,1,'#f1d27a');txt(q.text,x,y-4,'#f1d27a','center')}
 else if(q.k==='shock'){const h=10+Math.sin(T/2)*2;ctx.globalAlpha=.75;r(x-3,y-h,6,h,'#e9dcc2');r(x-5,y-h/2,10,h/2,'#a8977c');ctx.globalAlpha=1}
 else if(q.k==='coin'){for(let i=0;i<4;i++)r(x-4+i*2,y-4-((T+i*5)%8),3,2,i%2?'#d9a441':'#b0a070')}}
function drawWorld(){
 for(const p of PITS){if(isWater((p[0]+p[1])/2))continue;const x1=p[0]-camX,w=p[1]-p[0];if(x1>W||x1+w<0)continue;r(x1,GY,w,H-GY,'#070505');for(let i=4;i<w-2;i+=6){r(x1+i,H-14,1,10,'#5a4030');r(x1+i,H-15,1,1,'#cfcfcf')}}
 FIRES.forEach((f,i)=>drawStove(f,i));
 for(const m of MSGS){const x=m.x-camX;if(x<-20||x>W+20)continue;ctx.globalAlpha=.55+Math.sin(T/20+m.x)*.3;r(x-7,GY-1,14,1,'#ff9a3a');r(x-5,GY-2,3,1,'#ffc07a');r(x,GY-2,4,1,'#ffc07a');ctx.globalAlpha=1}
 for(const it of ITEMS){if(G.taken.includes(it.id))continue;const x=it.x-camX;if(x<-20||x>W+20)continue;const pl=Math.sin(T/10)*1.5;ctx.globalAlpha=.25;r(x-4,it.y-9+pl,8,8,'#fff');ctx.globalAlpha=1;r(x-1,it.y-6+pl,3,3,'#fff');if(T%30<10)r(x+((T>>2)%5)-2,it.y-12-(T%10),1,1,'#fff');r(x-5,it.y-2,10,2,'#5a5a4a')}
 if(G.stain){const s=G.stain,x=s.x-camX;if(x>-20&&x<W+20){const pl=Math.sin(T/8);ctx.globalAlpha=.3+pl*.15;r(x-6,s.y-12,12,12,'#b9e0a0');ctx.globalAlpha=1;r(x-3,s.y-5,7,4,'#8aa070');r(x-2,s.y-6,7,4,'#b0a070');r(x,s.y-9-pl,2,2,'#e8ffd8')}}
 for(const A of ARENAS){if(G.boss[A.k])continue;for(const fx of[A.a,A.b]){const x=fx-camX;if(x<-20||x>W+20)continue;for(let yy=GY-70;yy<GY;yy+=2){const w=3+Math.sin(yy/7+T/9)*2;ctx.globalAlpha=.18+Math.sin(yy/11+T/13)*.1;r(x-w,yy,w*2,2,'#f4f0e8')}ctx.globalAlpha=1}}
 const ex=WW-60-camX;if(ex<W+40){r(ex,GY-4,80,4,'#5a4030');for(let i=0;i<80;i+=10)r(ex+i,GY,3,30,'#3a2a20');r(ex+20,GY-40,2,36,'#3a2a20');r(ex+4,GY-46,34,10,'#e9dcc2');txt('FERRY',ex+6,GY-45,'#120d0c');
  const bx=ex+50+Math.sin(T/30)*2;r(bx,GY+8,40,6,'#4a3220');r(bx+16,GY-14,2,22,'#3a2a20');r(bx+18,GY-12,12,10,'#d9cfb8')}}
function drawStove(f,i){const x=Math.round(f.x-camX),y=GY;if(x<-40||x>W+40)return;const lit=G.lit.includes(i);
 seg(x+14,y,x+17,y-24,2,WOOD);r(x+13,y-1,2,3,'#cfcfcf');
 r(x-9,y-14,18,14,'#6a4a3a');r(x-10,y-15,20,3,'#8a6450');r(x-6,y-10,12,8,'#1a100c');r(x-9,y-14,1,14,'#4a3228');
 r(x-5,y-21,10,6,'#3a3a40');r(x-3,y-23,6,2,'#4a4a52');r(x+5,y-19,4,1,'#3a3a40');r(x-1,y-24,2,1,'#5a5a62');
 if(lit){const fl=(T>>2)%3;r(x-5,y-9+fl,4,7-fl,'#ff8a1a');r(x-1,y-8-fl%2,4,6,'#ffd24a');r(x+2,y-9+fl%2,3,6,'#ff6a1a');
  if(T%40<20){const k=(T%40)/2;r(x+6+k*.4,y-26-k,2,2,'rgba(233,220,194,.4)')}for(let k=0;k<2;k++){const py=y-12-((T*.8+k*30)%40);r(x-3+Math.sin((T+k*20)/8)*4,py,1,1,'#ffb04a')}}
 else r(x-5,y-6,10,3,'#3a3a3a')}
function lights(){const z=ZONES[LV]||ZONES[0];let dk=z.dark;if(arena)dk+=.08;lx.globalCompositeOperation='source-over';lx.clearRect(0,0,W,H);lx.fillStyle=`rgba(8,4,10,${dk})`;lx.fillRect(0,0,W,H);lx.globalCompositeOperation='destination-out';
 const hole=(x,y,rr,a)=>{const g=lx.createRadialGradient(x,y,2,x,y,rr);g.addColorStop(0,`rgba(0,0,0,${a})`);g.addColorStop(1,'rgba(0,0,0,0)');lx.fillStyle=g;lx.fillRect(x-rr,y-rr,rr*2,rr*2)};
 hole(PL.x-camX,PL.y-14,70,.7);FIRES.forEach((f,i)=>{if(G.lit.includes(i))hole(f.x-camX,GY-10,90+Math.sin(T/6)*4,1)});for(const p of parts)if(p.c[0]==='#'&&p.c[1]==='f'&&p.s>1)hole(p.x-camX,p.y,14,.5);
 ctx.drawImage(LC,0,0);
 FIRES.forEach((f,i)=>{if(!G.lit.includes(i))return;const x=f.x-camX;if(x<-100||x>W+100)return;ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,GY-10,2,x,GY-10,60);g.addColorStop(0,'rgba(255,140,50,.22)');g.addColorStop(1,'rgba(255,100,30,0)');ctx.fillStyle=g;ctx.fillRect(x-60,GY-70,120,120);ctx.globalCompositeOperation='source-over'})}
function bar(x,y,w,h,v,max,c,d,dv){r(x-1,y-1,w+2,h+2,'#120d0c');r(x,y,w,h,'#2a1a18');if(dv)r(x,y,w*clamp(dv/max,0,1),h,d);r(x,y,w*clamp(v/max,0,1),h,c);r(x,y,w*clamp(v/max,0,1),1,'rgba(255,255,255,.25)')}
function hud(){const p=PL;bar(8,8,Math.round(maxHP()*.85),4,p.hp,maxHP(),'#b3261e','#e9dcc2',p.hpD);bar(8,15,Math.round(maxST()*.85),3,Math.max(0,p.st),maxST(),'#4f8a3a');
 // flask & grenades
 r(8,H-26,16,18,'#120d0c');r(9,H-25,14,16,'#2a1e18');r(13,H-23,6,10,p.flask?'#c9b08a':'#5a4a3a');r(14,H-25,4,2,'#7a5a3a');txt(String(p.flask),24,H-14,'#e9dcc2');
 r(36,H-26,16,18,'#120d0c');r(37,H-25,14,16,'#2a1e18');r(43,H-22,2,8,WOOD);r(42,H-25,4,4,'#3a4030');txt(String(p.gren),52,H-14,'#e9dcc2');
 // yuan
 const ys='¥ '+fmtBig(G.yuan);txt(ys,8,22,'#d9a441');
 if(G.stain)txt('DROPPED ¥'+fmtBig(G.stain.val)+' ▼',8,32,'#b9e0a0');
 // boss bars
 const bb=bosses.length?bosses.filter(b=>!b.dead||b.dt<30):ents.filter(e=>e.def.mini&&e.bar&&!e.dead&&e.state!=='idle'&&Math.abs(e.x-PL.x)<300);
 bb.forEach((b,i)=>{const w=220,x=W/2-w/2,y=36+i*18;ctx.font=F;stxt(b.name||b.def.name,x,y-6,'#e9dcc2',9,1,'left');bar(x,y,w,3,b.hp,b.max,'#9a1a14')});
 // prompt
 const tu=$('#tU');if(near&&state==='play'&&!reading){const lbl=near.label;if(touchUI){if(tu.hidden||tu.textContent!==lbl){tu.textContent=lbl;tu.hidden=false}}else{{ctx.font=F;const tw=ctx.measureText('▲ '+lbl).width/2+4;txt('▲ '+lbl,clamp(p.x-camX,tw,W-tw),p.y-50,'#ffd24a','center')}}}else if(!tu.hidden)tu.hidden=true;
 if(reading){const m=reading.m,s=Array.isArray(m.t)?m.t[touchUI?1:0]:m.t,ls=wrap('"'+s+'"',40),h=ls.length*10+22;r(40,16,W-80,h,'rgba(10,6,4,.88)');r(40,16,W-80,1,'#ff9a3a');ls.forEach((l,i)=>txt(l,W/2,24+i*10,'#ffc07a','center'));txt('APPRAISED '+((m.x*37)%9000+400).toLocaleString('en-US')+' TIMES',W/2,24+ls.length*10+2,'#6e6050','center')}
 if(itemBox){const d=IDESC[itemBox.k],a=Math.min(1,itemBox.t/10);ctx.globalAlpha=a;const fl=wrap(d.f,44);const h=40+fl.length*9;r(30,H/2-h/2-20,W-60,h,'rgba(10,6,4,.92)');r(30,H/2-h/2-20,W-60,1,'#d9a441');
  txt(d.n,W/2,H/2-h/2-14,'#ffd24a','center');txt(d.d,W/2,H/2-h/2-2,'#e9dcc2','center');fl.forEach((l,i)=>txt(l,W/2,H/2-h/2+12+i*9,'#a8977c','center'));ctx.globalAlpha=1}
 if(areaB){const k=areaB.t,a=k<30?k/30:k>150?Math.max(0,(190-k)/40):1;stxt(areaB.z.name,W/2,62,'#e9dcc2',17,a);ctx.globalAlpha=a*.6;r(W/2-110,74,220,1,'#e9dcc2');ctx.globalAlpha=1;stxt(areaB.z.han,W/2,86,'#a8977c',11,a)}
 if(banner&&!(banner.delay>banner.t)){const k=banner.t-(banner.delay||0),a=k<20?k/20:k>banner.dur-40?Math.max(0,(banner.dur-k)/40):1;ctx.globalAlpha=a*.7;r(0,H/2-26,W,48,'#000');ctx.globalAlpha=1;stxt(banner.text,W/2,H/2-4,banner.col,banner.size||24,a);if(banner.sub)stxt(banner.sub,W/2,H/2+15,'#a8977c',9,a)}}
function drawDeath(){const k=dead.t;if(k<50)return;const a=Math.min(1,(k-50)/50);
 ctx.globalAlpha=a*.85;r(0,H/2-30,W,56,'#000');ctx.globalAlpha=1;stxt('YOU DIED',W/2,H/2-6,'#b3261e',34,a);
 if(k>110)stxt('陣亡 · YOUR GOLD YUAN IS INFLATING WHERE YOU FELL',W/2,H/2+17,'#a8977c',8,Math.min(1,(k-110)/30))}
function render(){ctx.fillStyle='#070505';ctx.fillRect(0,0,W,H);
 ctx.save();if(shake>0&&!RM)ctx.translate(((rnd()-.5)*shake)|0,((rnd()-.5)*shake)|0);
 drawBG();drawWorld();
 for(const g of ghosts){const x=g.x-camX;ctx.globalAlpha=.16*Math.min(1,Math.min(g.t,120-g.t)/20);drawSoldier(x-8,GY,{fac:g.fac,face:g.f,pose:'run',anim:g.t,emo:'normal',gun:'rifle'});ctx.globalAlpha=1}
 for(const e of ents)if(e.dead)drawEnemy(e);for(const e of ents)if(!e.dead)drawEnemy(e);
 for(const b of bosses)drawBoss(b);
 if(PL)drawPlayer();
 for(const q of projs)drawProj(q);
 for(const p of parts)r(p.x-camX,p.y,p.s,p.s,p.c);
 for(const p of pops){const a=p.t<40?1:Math.max(0,1-(p.t-40)/20);ctx.globalAlpha=a;txt(p.s,p.x-camX,p.y-p.t*.4,p.c,'center');ctx.globalAlpha=1}
 ctx.restore();
 lights();drawWeather();ctx.drawImage(VIG,0,0);
 if(dead){const a=Math.min(.7,dead.t/80);ctx.globalCompositeOperation='saturation';ctx.globalAlpha=a;r(0,0,W,H,'#808080');ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1}
 hud();if(dead)drawDeath();
 if(fadeA>0){ctx.globalAlpha=fadeA;r(0,0,W,H,'#000');ctx.globalAlpha=1}
 if(state==='pause'){r(0,0,W,H,'rgba(0,0,0,.6)');stxt('PAUSED',W/2,H/2-8,'#e9dcc2',24);txt('P / ESC TO RESUME',W/2,H/2+12,'#a8977c','center')}}

/* ---------------- update ---------------- */
function update(){T++;G.time++;
 if(hs>0){hs--;return}
 if(fadeA>0)fadeA=Math.max(0,fadeA-.03);if(shake>0)shake*=.85;if(shake<.5)shake=0;if(skyFlash>0)skyFlash-=.04;
 if(reading){reading.t++;if(reading.t>20&&(pressed.use||pressed.atk||pressed.jump||pressed.roll||Math.abs(PL.vx)>.5))reading=null}
 if(itemBox){itemBox.t++;if(itemBox.t>40&&(pressed.use||pressed.atk||pressed.jump)||itemBox.t>260)itemBox=null}
 if(areaB&&++areaB.t>190)areaB=null;if(banner&&++banner.t>banner.dur+(banner.delay||0))banner=null;
 updPlayer();for(const e of ents)updEnemy(e);for(const b of bosses)updBoss(b);updProjs();
 for(const p of parts){p.x+=p.vx;p.y+=p.vy;p.vy+=p.g;p.l--;if(p.g>.1&&p.y>GY&&groundAt(p.x)<1e3){p.y=GY;p.vx*=.5;p.vy=0}}parts=parts.filter(p=>p.l>0);if(parts.length>500)parts.splice(0,parts.length-500);
 for(const p of pops)p.t++;pops=pops.filter(p=>p.t<60);
 // stain
 if(G.stain){const s=G.stain;if(T%60===0)s.val=Math.max(Math.round(s.orig*.2),Math.round(s.val*.99));if(Math.abs(PL.x-s.x)<10&&Math.abs(PL.y-s.y)<20&&PL.state!=='dead'){G.yuan+=s.val;pop(PL.x,PL.y-44,'+¥'+fmtBig(s.val)+' (NOW WORTH LESS)','#b9e0a0');spark(s.x,s.y-6,20,'#b9e0a0');SFX.pick();G.stain=null}}
 // ghosts
 if(T%420===0&&rnd()<.7&&!arena){const f=rnd()<.5?1:-1;ghosts.push({x:PL.x-f*(60+rnd()*60),f,t:0,fac:rnd()<.5?'kmt':'ccp'})}for(const g of ghosts){g.t++;g.x+=g.f*.9}ghosts=ghosts.filter(g=>g.t<120);
 // ambience
 if(T%300===0&&rnd()<.6)SFX.far();
 findNear();setZone(zoneAt(PL.x));
 // camera
 let tx=PL.x-W/2+PL.face*24;if(arena)tx=(arena.a+arena.b)/2-W/2;camX+=(clamp(tx,0,WW-W)-camX)*.1;
 if(dead){dead.t++;if(dead.t>=230){respawn(G.fire)}}
 for(const k in pressed)delete pressed[k]}

/* ---------------- scenes & flow ---------------- */
function retreatArt(t){const g=ctx.createLinearGradient(0,0,0,136);g.addColorStop(0,'#05060f');g.addColorStop(1,'#1c2440');ctx.fillStyle=g;ctx.fillRect(0,0,W,136);
 for(let i=0;i<24;i++)r((i*53)%W,(i*37)%60,1,1,'#8a8aa0');r(0,96,W,40,'#14203a');for(let i=0;i<22;i++)r((i*41+t*.5)%(W+20)-10,100+(i%5)*7,12,1,'#3a5a80');
 r(0,84,60,14,'#0a0a10');r(0,78,34,8,'#0a0a10');for(let i=0;i<5;i++)if((t>>4)%5!==i)r(6+i*10,88,2,2,'#ff8a1a');
 const bx=Math.min(W-90,90+t*.35),by=100+Math.sin(t/18)*1.5;r(bx,by,64,8,'#4a3220');r(bx+4,by+8,56,3,'#2a1a10');r(bx+30,by-38,2,38,'#3a2a20');r(bx+12,by-34,18,24,'#d9cfb8');
 drawSoldier(bx+44,by+1,{fac:'kmt',face:1,pose:'sit',emo:'happy',gun:null});r(bx+6,by-6,10,6,'#d9a441');r(bx+7,by-5,8,1,'#120d0c');
 const a=Math.max(0,Math.min(1,(t-40)/50));ctx.globalAlpha=a*.85;r(0,24,W,46,'#000');ctx.globalAlpha=1;stxt('YOU RETREATED',W/2,42,'#d9a441',30,a);
 if(t>100)stxt('撤退 · TEMPORARILY · VERY TEMPORARILY',W/2,62,'#a8977c',8,Math.min(1,(t-100)/30));return true}
function myArt(name,t){if(name==='retreat')return retreatArt(t);const K='#120d0c';
 if(name==='pit'){const g=ctx.createLinearGradient(0,0,0,136);g.addColorStop(0,'#3a3440');g.addColorStop(1,'#8a6a5a');ctx.fillStyle=g;ctx.fillRect(0,0,W,136);r(0,108,W,28,'#4a382a');r(0,108,W,2,'#6e5640');
  for(let i=0;i<8;i++){if(i===4)continue;const f=i%2?1:-1;ctx.save();ctx.translate(26+i*44,108+(i%3)*5);ctx.rotate(-f*Math.PI/2);drawSoldier(-8,0,{fac:i%3?'kmt':'civ',face:f,emo:'dead',gun:null});ctx.restore()}
  seg(0,96,W,100,1,'#9c7c3c');for(let i=0;i<4;i++){const cx=(t*.8+i*110)%(W+40)-20,cy=30+i*9+Math.sin(t/10+i)*3;r(cx,cy,6,2,K);r(cx+2,cy-1+((t>>3)%2)*2,2,1,K)}
  const up=Math.min(1,t/90);ctx.save();ctx.translate(196,114);ctx.rotate(-Math.PI/2*(1-up));drawSoldier(-8,0,{fac:'kmt',face:1,emo:up<1?'sleep':'scared',gun:null});ctx.restore();return true}
 return false}
function playScene(sc,done){scene={sc,t:0,done};state='scene';$('#touch').hidden=true}
function soulScene(sc,t){ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);ctx.save();ctx.beginPath();ctx.rect(0,0,W,136);ctx.clip();{const at=Math.min(t,2400);if(!myArt(sc.draw,at))sceneArt(sc.draw,at)};ctx.restore();
 ctx.drawImage(VIG,0,0);r(0,136,W,H-136,'#120d0c');r(0,136,W,2,'#d9a441');txt(sc.date,8,141,'#d9a441');txt(sc.place,W-8,141,'#a8977c','right');
 const shown=Math.floor(t*1.4),fl=wrap(sc.fact,47),jl=wrap(sc.joke,47);let n=0;ctx.font=F;ctx.textAlign='left';ctx.textBaseline='top';
 fl.forEach((l,i)=>{ctx.fillStyle='#e9dcc2';ctx.fillText(l.slice(0,Math.max(0,shown-n)),8,151+i*10);n+=l.length+1});
 jl.forEach((l,i)=>{ctx.fillStyle='#ff9a6a';ctx.fillText(l.slice(0,Math.max(0,shown-n)),8,153+fl.length*10+i*10);n+=l.length+1});
 if(shown>n+10&&T%40<26)txt('▶',W-16,H-12,'#d9a441');return shown>n}
const SC_INTRO={draw:'pit',date:'AUTUMN 1948',place:'NORTH OF THE YANGTZE',fact:'Nationalist press gangs seized farmers off roads and fields and marched them roped together. Vast numbers died or deserted before ever reaching the front.',joke:'You died in the column, a Nationalist conscript. Then you got up. The sergeant marked you present. Find the last ferry. Get discharged.'};
const SC_END=[{draw:'boats',date:'DECEMBER 1949',place:'THE LAST FERRY',fact:'The Communists have taken the mainland. The Nationalist government relocates to Taiwan. The gold reserves left first, by ship.',joke:'The ferry is the final bonfire. Your Gold Yuan cannot buy a seat. The ferryman takes the stamps instead.'},
 {draw:'retreat',date:'DECEMBER 1949',place:'TAIWAN STRAIT',fact:'Up to two million soldiers and civilians crossed. Officially it was a temporary relocation. Very temporary.',joke:'Your back pay is a suitcase of Gold Yuan. It buys one tangerine. The tangerine is overvalued.'},
 {draw:'island',date:'1950 · 1951 · 1952 · ...',place:'TAIWAN',fact:'"We counterattack the mainland next year!" was announced every year. The Gold Yuan stayed worthless every year too.',joke:'You are discharged in 1987. You still have not unpacked. Next year, surely. NEW GAME+ is the counterattack.'}];
function newGame(cont){initAudio();ambient();$('#title').hidden=true;$('#end').hidden=true;$('#hud').hidden=false;
 const sv=cont&&store.get(SAVEK,null);G=sv||newProgress();LV=-1;ending=false;
 const go=()=>{respawn(G.fire,true);if(touchUI)$('#touch').hidden=false;fadeA=1;if(!G.seen.includes(LV)){G.seen.push(LV);areaB={t:0,z:ZONES[LV]}}};
 if(sv)go();else playScene(SC_INTRO,go)}
function finish(){if(ending)return;ending=true;state='scene';music('ending');G.done=1;save();
 playScene(SC_END[0],()=>playScene(SC_END[1],()=>playScene(SC_END[2],()=>{state='end';$('#hud').hidden=true;$('#touch').hidden=true;$('#end').hidden=false;
  $('#endP').textContent=(G.inf<1.01?'You reached the ferry with both stamps and never once rested. Inflation is impressed. ':'You reached the ferry with both stamps. Prices on the mainland rose '+fmtBig((G.inf-1)*100)+'% while you rested. ')+'The war is lost. The government has relocated to Taiwan, temporarily. Counterattack scheduled for next year. And the year after that.';
  const tm=G.time/60|0;$('#endS').innerHTML=`<dt>Time</dt><dd>${tm/60|0}m ${tm%60}s</dd><dt>Deaths</dt><dd>${G.deaths}</dd><dt>Enemies felled</dt><dd>${G.kills}</dd><dt>Gold Yuan lost to inflation</dt><dd>¥ ${fmtBig(G.lost)}</dd><dt>Soul level</dt><dd>${SL()}</dd><dt>Cycle</dt><dd>${G.ng?'NG+'+G.ng:'First war'}</dd>`;
  setTimeout(()=>$('#e1').focus(),50)})))}
$('#bNew').onclick=()=>newGame(false);$('#bCont').onclick=()=>newGame(true);
$('#e1').onclick=()=>{const o=G;G=newProgress(o.ng+1,{vig:o.vig,end:o.end,str:o.str,whet:Math.min(o.whet,2),vest:Math.min(o.vest,1),flaskMax:o.flaskMax,grenMax:o.grenMax,deaths:o.deaths,lost:o.lost});save();newGame(true)};
$('#e2').onclick=()=>{$('#end').hidden=true;$('#title').hidden=false;state='title';music('off');showCont()};
function showCont(){const s=store.get(SAVEK,null);$('#bCont').hidden=!(s&&!s.done)}showCont();
function togglePause(){if(state==='play'){state='pause';ambSet()}else if(state==='pause'){state='play';ambSet()}}
$('#bPause').onclick=e=>{togglePause();e.currentTarget.blur()};
$('#bSnd').onclick=e=>{initAudio();setMute(!muted);e.currentTarget.textContent=muted?'MUTE':'SND';e.currentTarget.blur()};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='play')togglePause()});

/* ---------------- input ---------------- */
const kb={},tch={},pressed={};let stickV={x:0,y:0};
const KM={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowDown:'down',KeyS:'down',ArrowUp:'use',KeyW:'use',KeyE:'use',Space:'jump',KeyJ:'atk',KeyZ:'atk',Enter:'atk',KeyU:'heavy',KeyX:'heavy',KeyK:'roll',ShiftLeft:'roll',ShiftRight:'roll',KeyC:'roll',KeyL:'guard',KeyV:'guard',KeyR:'wine',KeyQ:'wine',KeyG:'gren',KeyF:'gren'};
const held=k=>kb[k]||tch[k];
addEventListener('keydown',e=>{if(e.code==='Escape'||e.code==='KeyP'){if(state==='fire'){$('#fireGo').click();return}togglePause();return}
 if(state==='title'||state==='end'||state==='fire')return;const k=KM[e.code];if(!k)return;e.preventDefault();if(!e.repeat&&!kb[k])pressed[k]=1;kb[k]=1;initAudio()});
addEventListener('keyup',e=>{const k=KM[e.code];if(k)kb[k]=0});
cv.addEventListener('contextmenu',e=>e.preventDefault());
cv.addEventListener('mousedown',e=>{initAudio();if(touchUI)return;if(e.button===2){kb.guard=1;pressed.guard=1}else pressed.atk=1});
addEventListener('mouseup',e=>{if(e.button===2)kb.guard=0});
let touchUI=false;const tpad=$('#touch'),sBase=$('#stickBase'),sKnob=$('#stickKnob');let stickId=null,sx0=0,sy0=0;const btnT={};
if(matchMedia('(pointer:coarse)').matches)touchUI=true;
addEventListener('touchstart',()=>{if(!touchUI){touchUI=true;if(state==='play')tpad.hidden=false}},{passive:true});
tpad.addEventListener('touchstart',e=>{e.preventDefault();initAudio();for(const t of e.changedTouches){const b=t.target.closest&&t.target.closest('.tb');
 if(b){const k=b.dataset.k;btnT[t.identifier]=k;tch[k]=true;pressed[k]=1;b.classList.add('on');continue}
 if(t.clientX<innerWidth*.5&&stickId==null){stickId=t.identifier;sx0=t.clientX;sy0=t.clientY;sBase.hidden=false;sBase.style.left=sx0+'px';sBase.style.top=sy0+'px';sKnob.style.transform=''}}},{passive:false});
tpad.addEventListener('touchmove',e=>{e.preventDefault();for(const t of e.changedTouches)if(t.identifier===stickId){const dx=clamp(t.clientX-sx0,-50,50),dy=clamp(t.clientY-sy0,-50,50);stickV={x:Math.abs(dx)<8?0:dx/50,y:Math.abs(dy)<8?0:dy/50};sKnob.style.transform=`translate(${dx}px,${dy}px)`}},{passive:false});
function tEnd(e){e.preventDefault();for(const t of e.changedTouches){if(t.identifier===stickId){stickId=null;stickV={x:0,y:0};sBase.hidden=true}const k=btnT[t.identifier];if(k){tch[k]=false;delete btnT[t.identifier];const el=document.querySelector(`.tb[data-k=${k}]`);if(el)el.classList.remove('on')}}}
tpad.addEventListener('touchend',tEnd,{passive:false});tpad.addEventListener('touchcancel',tEnd,{passive:false});
cv.addEventListener('touchstart',()=>{if(state==='scene')pressed.atk=1},{passive:true});
function fit(){const vw=innerWidth,vh=innerHeight;const s=Math.min(vw/W,vh/H);cv.style.width=Math.floor(W*s)+'px';cv.style.height=Math.floor(H*s)+'px'}
addEventListener('resize',fit);

/* ---------------- loop ---------------- */
fit();
let last=performance.now(),acc=0;
function attract(){T++;ctx.fillStyle='#070505';ctx.fillRect(0,0,W,H);const x=W/2,y=150;r(0,y,W,H-y,'#1a1210');
 const g=ctx.createRadialGradient(x,y-10,2,x,y-10,120);g.addColorStop(0,'rgba(255,140,50,.35)');g.addColorStop(1,'rgba(255,100,30,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 const fl=(T>>2)%3;r(x-9,y-14,18,14,'#6a4a3a');r(x-10,y-15,20,3,'#8a6450');r(x-6,y-10,12,8,'#1a100c');r(x-5,y-9+fl,4,7-fl,'#ff8a1a');r(x-1,y-8-fl%2,4,6,'#ffd24a');r(x-5,y-21,10,6,'#3a3a40');
 drawSoldier(x-40,y,{fac:'kmt',face:1,pose:'sit',emo:(T%240)<200?'sleep':'normal',gun:null});drawSoldier(x+24,y,{fac:'ccp',face:-1,pose:'sit',emo:'sleep',gun:null});ctx.drawImage(VIG,0,0)}
function loop(nt){acc+=Math.min(100,nt-last);last=nt;
 while(acc>=16.67){acc-=16.67;
  if(state==='play')update();
  else if(state==='scene'&&scene){scene.t++;T++;if(scene.t%3===0&&scene.t<500)SFX.type();const adv=pressed.atk||pressed.use||pressed.jump;for(const k in pressed)delete pressed[k];if(adv&&scene.t>10){if(!scene.complete)scene.t=9999;else{const d=scene.done;scene=null;d()}}}
  else{T++;for(const k in pressed)delete pressed[k]}}
 if(state==='scene'&&scene)scene.complete=soulScene(scene.sc,scene.t);
 else if(state==='title')attract();
 else if(PL&&G&&state!=='end')render();
 requestAnimationFrame(loop)}
(document.fonts?Promise.all([document.fonts.load(F),document.fonts.load(SERIF(20))]):Promise.resolve()).catch(()=>{}).finally(()=>requestAnimationFrame(loop));
