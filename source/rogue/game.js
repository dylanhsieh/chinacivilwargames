/* ===================== CONSCRIPT'S DESCENT — a Civil Slug action RPG ===================== */
let T=0,camX=0,camY=0,S='kmt',EN='ccp',LV=0,skyFlash=0,skyFX=0,state='title';
let parts=[],plats=[],scorch=[],P=null,L={walls:[],theme:'village'};
const VIG=document.createElement('canvas');VIG.width=W;VIG.height=H;{const g=VIG.getContext('2d');const rg=g.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,W*.62);rg.addColorStop(0,'rgba(0,0,0,0)');rg.addColorStop(1,'rgba(10,4,2,.5)');g.fillStyle=rg;g.fillRect(0,0,W,H);g.fillStyle='rgba(0,0,0,.08)';for(let y=0;y<H;y+=2)g.fillRect(0,y,W,1)}
const KT=TEXT.kmt,TS=16,WH=10,MW=56,MH=40;
function mk(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.imageSmoothingEnabled=false;fn(g);return c}
const R2=(g,x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h)};

/* ---------------- classes & skills ---------------- */
const CLASSES={
 brute:{name:'BAYONET BRUTE',hp:130,zeal:100,armor:10,spd:1.15,rate:26,range:30,basic:'DADAO SLASH',skills:[
  {id:'spin',name:'BIG SWORD SPIN',cost:0,cd:0,chan:1,lvl:1,desc:'Spin with the dadao. Costs zeal while held.'},
  {id:'leap',name:'OVER THE TOP',cost:25,cd:200,lvl:2,desc:'Leap at the enemy and crash down. Stuns.'},
  {id:'roar',name:'MTFK ROAR',cost:0,cd:720,lvl:3,desc:'Shout the national slogan. +50% damage, enemies flee.'},
  {id:'bundle',name:'BUNDLE OF BAD IDEAS',cost:40,cd:420,lvl:5,desc:'Six grenades tied together. Big boom.'}]},
 sharp:{name:'SHARPSHOOTER',hp:95,zeal:100,armor:6,spd:1.3,rate:22,range:200,basic:'RIFLE SHOT',skills:[
  {id:'volley',name:'VOLLEY',cost:18,cd:0,lvl:1,desc:'Five shots in a fan.'},
  {id:'mine',name:'LANDMINE',cost:22,cd:120,lvl:2,desc:'Plant a mine. Enemies volunteer to step on it.'},
  {id:'roll',name:'STRATEGIC WITHDRAWAL',cost:0,cd:150,lvl:3,desc:'Dive away. Invulnerable while rolling.'},
  {id:'barrage',name:'TOMMY BARRAGE',cost:45,cd:600,lvl:5,desc:'Three seconds of borrowed American firepower.'}]},
 prop:{name:'PROPAGANDIST',hp:85,zeal:120,armor:4,spd:1.2,rate:26,range:190,basic:'PAMPHLET',skills:[
  {id:'blast',name:'SLOGAN BLAST',cost:22,cd:40,lvl:1,desc:'A cone of slogans. Stuns. Sometimes they defect.'},
  {id:'nova',name:'INFLATION NOVA',cost:30,cd:90,lvl:2,desc:'Banknotes explode outward. Worthless, but sharp.'},
  {id:'recruit',name:'RECRUIT DEFECTORS',cost:40,cd:900,lvl:3,desc:'Two enemy soldiers switch sides for a while.'},
  {id:'airdrop',name:'AMERICAN AID',cost:55,cd:1200,lvl:5,desc:'A crate falls on enemies. Heals you if you stand near it.'}]}};
/* ---------------- items ---------------- */
const RAR=['COMMON','MAGIC','RARE','LEGENDARY'],RCOL=['#e9dcc2','#6a9aff','#ffd24a','#ff8a3a'];
const BASES={
 weapon:{brute:['RUSTY DADAO','DADAO','EXECUTIONER\'S DADAO','BIG SWORD OF THE 29TH'],sharp:['HANYANG 88 RIFLE','TYPE 24 RIFLE','MAUSER (STOLEN)','THOMPSON (CHINESE COPY)'],prop:['TIN MEGAPHONE','PAMPHLET SATCHEL','LOUDSPEAKER (QUESTIONABLE)','BRASS BULLHORN']},
 helm:['PEAKED CAP','GERMAN HELMET (SURPLUS)','COOKING POT','STRAW HAT (BORROWED)'],
 armor:['COTTON PADDED COAT','UNIFORM (PREVIOUS OWNER DECEASED)','OFFICER\'S GREATCOAT','BURLAP SACK'],
 boots:['STRAW SANDALS','PUTTEES','REQUISITIONED BOOTS','ONE LEFT BOOT, ONE RIGHT BOOT'],
 charm:['LUCKY COIN (GOLD YUAN)','RATION COUPON','PARTY MEMBERSHIP CARD','PHOTO OF SOMEONE\'S SISTER']};
const AFF=[
 {k:'dmg',n:'INFLATED',s:'of the Offensive',f:v=>`+${v}% damage`,r:[6,14]},
 {k:'hp',n:'WELL-FED',s:'of the Long Winter',f:v=>`+${v} morale (max)`,r:[10,26]},
 {k:'armor',n:'REINFORCED',s:'of Many Owners',f:v=>`+${v} armor`,r:[4,10]},
 {k:'crit',n:'LEND-LEASE',s:'of Lucky Shots',f:v=>`+${v}% crit chance`,r:[3,7]},
 {k:'spd',n:'NIMBLE',s:'of Strategic Withdrawal',f:v=>`+${v}% move speed`,r:[4,9]},
 {k:'aspd',n:'TRIGGER-HAPPY',s:'of Haste',f:v=>`+${v}% attack speed`,r:[5,12]},
 {k:'gold',n:'CORRUPT',s:'of the Quartermaster',f:v=>`+${v}% gold found`,r:[20,50]},
 {k:'regen',n:'SELF-CRITICAL',s:'of Self-Criticism',f:v=>`+${v/10} morale per second`,r:[5,15]},
 {k:'zeal',n:'ZEALOUS',s:'of the Party Line',f:v=>`+${v} max zeal`,r:[8,20]},
 {k:'loh',n:'RAVENOUS',s:'of Requisition',f:v=>`+${v} morale per kill`,r:[2,6]}];
const UNIQ=[
 {name:'GOLD YUAN BRIGANDINE',slot:'armor',pow:'goldArmor',desc:'Armor +1 for every 40 gold carried.',flav:'Bulletproof, as long as you never spend it.'},
 {name:'BOOTS OF STRATEGIC WITHDRAWAL',slot:'boots',pow:'retreat',desc:'+50% move speed while moving away from enemies.',flav:'Undefeated in retreat.'},
 {name:'LETTER FROM HOME',slot:'charm',pow:'letter',desc:'Heal 3% morale per kill.',flav:'Your mother says eat more. She has not seen the rations.'},
 {name:'LEND-LEASE CRATE',slot:'charm',pow:'lendlease',desc:'Skills cost 35% less zeal.',flav:'Payment due 1950. Interest negotiable.'},
 {name:'THE COOKING POT',slot:'helm',pow:'pot',desc:'25% chance to block bullets entirely.',flav:'Previously used for rice. Tactical upgrade.'},
 {name:'A GENERAL\'S SPARE CAP',slot:'helm',pow:'cap',desc:'+15% damage and +20% max morale.',flav:'Worn once, for a photograph.'},
 {name:'DADAO OF MANY OWNERS',slot:'weapon',cls:'brute',pow:'owners',desc:'+60% damage. Kills sometimes make nearby enemies defect.',flav:'Engraved with six names. Five crossed out.'},
 {name:'THE QUARTERMASTER\'S RIFLE',slot:'weapon',cls:'sharp',pow:'pierce',desc:'Shots pierce. +100% gold found.',flav:'Sold to both sides. Twice.'},
 {name:'MEGAPHONE OF TRUTH (PENDING APPROVAL)',slot:'weapon',cls:'prop',pow:'truth',desc:'Slogan Blast converts 30% of normal enemies.',flav:'The truth, amplified. Subject to revision.'},
 {name:'PADDED COAT OF THE LONG WINTER',slot:'armor',pow:'coat',desc:'+40% max morale. Regenerate 1% per second.',flav:'Ordered in winter. Delivered in spring. Worn forever.'}];
const SLOTS=['weapon','helm','armor','boots','charm'],SLOTN={weapon:'WEAPON',helm:'HEAD',armor:'BODY',boots:'FEET',charm:'CHARM'};
const RARE1=['WIDOWMAKER','CADRE-BANE','PAYDAY','FINAL NOTICE','SECOND WIFE','LAST RATION','HOMESICK','DOUBLE AGENT','PAPER TIGER','BLACK MARKET'],RARE2=['GRIP','HOLLER','DRAPE','STEP','PROMISE','RECEIPT','HEIRLOOM','MISTAKE'];
const ITXT={dmg:(a,b)=>`${a}–${b} damage`,armor:a=>`${a} armor`};
// item names are built at display time so they follow the language switch
function iname(it){if(it.u!=null)return UNIQ[it.u].name;const base=ibase(it);
 if(it.rar===1){const a=AFF.find(x=>x.k===it.pa),b=AFF.find(x=>x.k===it.sa);return LANG==='zh'?(a?a.n:'')+base+(b?'·'+b.s:''):(a?a.n+' ':'')+base+(b?' '+b.s.toUpperCase():'')}
 if(it.rar===2&&it.rn)return RARE1[it.rn[0]]+(LANG==='zh'?'':' ')+RARE2[it.rn[1]];return base}
function ibase(it){if(it.bi==null)return '';return it.slot==='weapon'?BASES.weapon[it.cls][it.bi]:BASES[it.slot][it.bi]}
let itemId=1;
function genItem(fl,force,slotForce){const rr=rnd();let rar=force!=null?force:rr<.03+fl*.008?3:rr<.16+fl*.02?2:rr<.48?1:0;
 const slot=slotForce||(rnd()<.35?'weapon':pick(SLOTS.slice(1)));const cls=slot==='weapon'?(rnd()<.85?PL.cls:pick(['brute','sharp','prop'])):null;
 const it={id:itemId++,slot,cls,rar,lvl:fl+1,aff:{},pow:null};
 if(rar===3){const pool=UNIQ.filter(u=>(!slotForce||u.slot===slot)&&(!u.cls||u.cls===PL.cls));const u=pick(pool.length?pool:UNIQ);it.slot=u.slot;it.cls=u.cls||it.cls||(u.slot==='weapon'?PL.cls:null);it.u=UNIQ.indexOf(u);it.pow=u.pow}
 const tier=fl+1;
 if(it.slot==='weapon'){const b=(5+tier*4)*(1+rar*.12)*(.85+rnd()*.3);it.dmin=Math.round(b*.75);it.dmax=Math.round(b*1.3);if(it.u==null){const L_=BASES.weapon[it.cls];it.bi=Math.min(L_.length-1,Math.floor(rnd()*(1+tier*.6)))}}
 else{it.armor=Math.round((2+tier*2.2)*(it.slot==='armor'?1.6:1)*(.8+rnd()*.4)*(1+rar*.1));if(it.u==null)it.bi=rnd()*BASES[it.slot].length|0}
 const nA=[0,1+(rnd()<.5?1:0),3+(rnd()<.4?1:0),3][rar];const keys=AFF.slice().sort(()=>rnd()-.5).slice(0,nA);
 for(const a of keys){it.aff[a.k]=Math.round((a.r[0]+rnd()*(a.r[1]-a.r[0]))*(1+tier*.18))}
 if(it.u==null){if(rar===1){it.pa=keys[0]&&keys[0].k;it.sa=keys[1]&&keys[1].k}
  else if(rar===2){it.rn=[rnd()*RARE1.length|0,rnd()*RARE2.length|0];it.sub=1}}
 it.value=Math.round((8+tier*6)*(1+rar*rar*1.5));return it}
function itemLines(it){const out=[];if(it.slot==='weapon')out.push(ITXT.dmg(it.dmin,it.dmax));else out.push(ITXT.armor(it.armor));
 for(const a of AFF)if(it.aff[a.k])out.push(a.f(it.aff[a.k]));if(it.u!=null)out.push('★ '+UNIQ[it.u].desc);return out}
/* ---------------- perks (level-up cards) ---------------- */
const PERKS=[
 {id:'hp',n:'EXTRA RATIONS',d:'+20% max morale.',f:'The rations were real this time. Probably.'},
 {id:'dmg',n:'LEND-LEASE AMMO',d:'+15% damage.',f:'American bullets. Same holes, better paperwork.'},
 {id:'spd',n:'FAST FEET',d:'+10% move speed.',f:'Useful in both directions.'},
 {id:'gold',n:'BLACK MARKET CONTACTS',d:'+50% gold found.',f:'Your cousin knows a guy.'},
 {id:'armor',n:'THICK SKIN (LITERAL)',d:'+12 armor.',f:'Three winters of padding.'},
 {id:'pot',n:'SECOND WIND',d:'+1 rice wine flask, flasks refill faster.',f:'Medicinal. Allegedly.'},
 {id:'crit',n:'FIELD PROMOTION',d:'+8% crit chance, +25% crit damage.',f:'Promoted for bravery, or for surviving.'},
 {id:'zeal',n:'TRUE BELIEVER',d:'+25 max zeal, +30% zeal generation.',f:'You believe in the cause. The cause is pay.'},
 {id:'cdr',n:'EFFICIENT BUREAUCRACY',d:'Skill cooldowns -20%.',f:'A first, historically.'},
 {id:'lifesteal',n:'REQUISITION',d:'Heal 2 morale per hit.',f:'Taking things is a skill, too.'},
 {id:'brute1',cls:'brute',n:'SPIN DOCTOR',d:'Big Sword Spin hits 40% wider and harder.',f:'Spin it however you like.'},
 {id:'brute2',cls:'brute',n:'LOUD MOUTH',d:'MTFK Roar lasts twice as long.',f:'Neighbors have complained.'},
 {id:'brute3',cls:'brute',n:'BIG LANDING',d:'Over the Top deals double damage.',f:'Gravity is on our side.'},
 {id:'sharp1',cls:'sharp',n:'EXTRA BARREL',d:'Volley fires 3 more shots.',f:'Nobody asked where the barrel came from.'},
 {id:'sharp2',cls:'sharp',n:'RICOCHET',d:'Rifle shots pierce one extra enemy.',f:'Physics, requisitioned.'},
 {id:'sharp3',cls:'sharp',n:'MINEFIELD',d:'Landmines deal +80% damage and plant two.',f:'Village farmland, improved.'},
 {id:'prop1',cls:'prop',n:'LOUDER SLOGANS',d:'Slogan Blast stuns longer and reaches further.',f:'Repetition is persuasion.'},
 {id:'prop2',cls:'prop',n:'HYPERINFLATION',d:'Inflation Nova deals +60% damage.',f:'Prices rise. So does the shrapnel.'},
 {id:'prop3',cls:'prop',n:'MASS DEFECTION',d:'Recruit one extra defector. They hit harder.',f:'They came for the rice.'}];
/* ---------------- floors ---------------- */
const FLOORS=[
 {name:'THE OUTSKIRTS',th:'village',music:'m3',radio:"HQ: Clear the outskirts. Loot responsibly. Officers loot first."},
 {name:'THE TRENCHES',th:'trench',music:'m3',radio:"HQ: Both sides dug these trenches. They met in the middle and had lunch."},
 {name:'THE VILLAGE SQUARE',th:'village',music:'boss',boss:'tank',radio:"HQ: That tank again. It's on its seventh owner. Make it eight."},
 {name:'SHANGHAI SEWERS',th:'sewer',music:'m4',radio:"HQ: Enter the sewers. The money down there is worth exactly as much as the money up here."},
 {name:'THE VAULT TUNNELS',th:'vault',music:'m4',radio:"HQ: The central bank's gold went through these tunnels. Officially it never existed. Follow the drag marks."},
 {name:'THE BUND',th:'bund',music:'final',boss:'mech',radio:"HQ: Something enormous with a face is on the waterfront. Destroy it before the face is approved."}];
const THM={
 village:{f:['#4a382a','#433224','#4e3c2c'],sp:'#5a4632',top:'#2e221c',face:'#5b4636',mortar:'#3e2e24',poster:1,amb:.82},
 trench:{f:['#3e3426','#372e22','#42382a'],sp:'#2a3036',top:'#6a5a3a',face:'#8a7650',mortar:'#6a5a3a',bags:1,amb:.84},
 sewer:{f:['#2e3436','#2a3032','#323a3a'],sp:'#3a5a4a',top:'#1e2426',face:'#3e4648',mortar:'#2a3032',amb:.88,water:1},
 vault:{f:['#3a3430','#352f2a','#3e3832'],sp:'#8a7040',top:'#241e1a',face:'#4a3e36',mortar:'#33291f',gold:1,amb:.88},
 bund:{f:['#38343e','#332f38','#3c3842'],sp:'#4a4652',top:'#1e1c24',face:'#4a4652',mortar:'#2e2c36',poster:1,amb:.8}};
let TILES=null;
function buildTiles(th){const t=THM[th],R_=seeded(th.length*97);
 const floor=t.f.map((c,i)=>mk(16,16,g=>{R2(g,0,0,16,16,c);for(let k=0;k<6;k++)R2(g,R_()*16|0,R_()*16|0,1+(R_()*2|0),1,t.sp);if(th==='sewer'||th==='vault'||th==='bund'){R2(g,0,0,16,1,'#00000030');R2(g,0,0,1,16,'#00000030')}if(i===2&&t.water){R2(g,0,6,16,4,'#2a4a3e');R2(g,2,7,4,1,'#4a7a5e')}if(i===2&&t.gold){R2(g,5,8,4,2,'#d9a441')}}));
 const face=[0,1,2].map(k=>mk(16,WH,g=>{R2(g,0,0,16,WH,t.face);if(t.bags){for(let y=0;y<WH;y+=5)for(let x=(y/5%2)*4;x<16;x+=8){R2(g,x,y,7,4,'#9a8660');R2(g,x,y+3,7,1,'#6a5a3a')}}else{for(let y=0;y<WH;y+=4){R2(g,0,y,16,1,t.mortar);for(let x=(y/4%2)*4;x<16;x+=8)R2(g,x,y,1,4,t.mortar)}}
  if(k===1&&t.poster){R2(g,3,1,10,8,R_()<.5?'#2f4f8a':'#b8322a');R2(g,6,3,4,4,'#e9dcc2')}if(k===2&&t.gold)R2(g,4,4,6,2,'#d9a441');R2(g,0,WH-1,16,1,'#00000050')}));
 const top=mk(16,16,g=>{R2(g,0,0,16,16,t.top);R2(g,0,0,16,1,'#ffffff12');for(let k=0;k<4;k++)R2(g,R_()*15|0,R_()*15|0,2,1,'#00000030')});
 TILES={floor,face,top,th:t}}

/* ---------------- run state ---------------- */
let PL=null,FL=0,map=null,seen=null,ents=[],allies=[],shots=[],eshots=[],booms=[],fx=[],nums=[],loot=[],props=[],tele=[],boss=null,stairs=null,radioQ=[],radioCur=null,shake=0,flashA=0,flashC='#fff',hitstop=0,shoutT=0,shoutTxt='',killTimes=[],flow=null,mouse={x:0,y:0,wx:0,wy:0,l:false,r:false},scene=null,perkQ=0,runStats={kills:0,legend:0,gold:0,cause:''};
const inflation=()=>3000*Math.pow(2.2,FL)*(1+T/20000);
const fmtGY=g=>'¥'+fmtBig(g*inflation())+(LANG==='zh'?' 金圓券':' GY');
function newHero(cls){const c=CLASSES[cls];PL={cls,c,x:0,y:0,lvl:1,xp:0,hp:c.hp,zeal:c.zeal*.5,gold:0,face:1,anim:0,moving:false,cd:{},atkCd:0,pot:3,potMax:3,potCd:0,buf:{},perks:{},eq:{},bag:[],path:null,target:null,invuln:0,hurtT:0,happyT:0,slashT:0,chan:false,roll:0,leap:null,barrage:0,dead:0,muzz:0,stun:0};
 PL.eq.weapon=genItem(0,0,'weapon');PL.eq.weapon.cls=cls;PL.eq.weapon.bi=0;PL.eq.weapon.dmin=5;PL.eq.weapon.dmax=9;
 PL.eq.armor=genItem(0,0,'armor');recalc();PL.hp=PL.st.maxHp;PL.zeal=PL.st.maxZeal*.5}
function recalc(){const c=PL.c,s={maxHp:c.hp+14*(PL.lvl-1),maxZeal:c.zeal,armor:c.armor,dmgPct:0,crit:5,critDmg:75,spd:0,aspd:0,gold:0,regen:0,loh:0,cdr:0,zealGen:0,lifesteal:0,pow:{}};
 for(const sl of SLOTS){const it=PL.eq[sl];if(!it)continue;if(it.armor)s.armor+=it.armor;const a=it.aff;s.dmgPct+=a.dmg||0;s.maxHp+=a.hp||0;s.armor+=a.armor||0;s.crit+=a.crit||0;s.spd+=a.spd||0;s.aspd+=a.aspd||0;s.gold+=a.gold||0;s.regen+=(a.regen||0)/10;s.maxZeal+=a.zeal||0;s.loh+=a.loh||0;if(it.pow)s.pow[it.pow]=1}
 const pk=PL.perks;s.maxHp*=1+.2*(pk.hp||0);s.dmgPct+=15*(pk.dmg||0);s.spd+=10*(pk.spd||0);s.gold+=50*(pk.gold||0);s.armor+=12*(pk.armor||0);s.crit+=8*(pk.crit||0);s.critDmg+=25*(pk.crit||0);s.maxZeal+=25*(pk.zeal||0);s.zealGen=30*(pk.zeal||0);s.cdr=Math.min(60,20*(pk.cdr||0));s.lifesteal=2*(pk.lifesteal||0);
 if(s.pow.cap){s.dmgPct+=15;s.maxHp*=1.2}if(s.pow.coat){s.maxHp*=1.4;s.regen+=s.maxHp*.01}if(s.pow.owners)s.dmgPct+=60;if(s.pow.pierce)s.gold+=100;
 const w=PL.eq.weapon;s.dmin=w?w.dmin:2;s.dmax=w?w.dmax:4;s.maxHp=Math.round(s.maxHp);PL.potMax=3+(pk.pot||0);PL.st=s;if(PL.hp>s.maxHp)PL.hp=s.maxHp}
function armorNow(){let a=PL.st.armor;if(PL.st.pow.goldArmor)a+=Math.floor(PL.gold/40);if(PL.buf.selfcrit)a=Math.max(0,a-15);return a}
function rollDmg(pct){const s=PL.st;let d=(s.dmin+rnd()*(s.dmax-s.dmin))*pct*(1+s.dmgPct/100);if(PL.buf.roar)d*=1.5;if(PL.buf.selfcrit)d*=1.5;const crit=rnd()*100<s.crit;if(crit)d*=1+s.critDmg/100;return{d:Math.max(1,Math.round(d)),crit}}

/* ---------------- dungeon generation ---------------- */
function solid(tx,ty){return!map||tx<0||ty<0||tx>=MW||ty>=MH||map[ty][tx]===1}
const solidAt=(x,y)=>solid(Math.floor(x/TS),Math.floor(y/TS));
function genFloor(){const f=FLOORS[FL];buildTiles(f.th);map=Array.from({length:MH},()=>new Array(MW).fill(1));seen=Array.from({length:MH},()=>new Array(MW).fill(0));
 const carve=(x,y,w,h)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(i>0&&j>0&&i<MW-1&&j<MH-1)map[j][i]=0};
 const rooms=[];
 if(f.boss){rooms.push({x:4,y:16,w:8,h:7});rooms.push({x:20,y:8,w:30,h:24});carve(4,16,8,7);carve(20,8,30,24);carve(11,18,10,3);
  // pillars in the arena for cover
  for(const[px_,py_]of[[26,13],[42,13],[26,26],[42,26]]){map[py_][px_]=1;map[py_][px_+1]=1;map[py_+1][px_]=1;map[py_+1][px_+1]=1}}
 else{let tries=0;while(rooms.length<11&&tries++<400){const w=6+(rnd()*9|0),h=5+(rnd()*6|0),x=2+(rnd()*(MW-w-4)|0),y=2+(rnd()*(MH-h-4)|0);if(rooms.some(r=>x<r.x+r.w+2&&x+w+2>r.x&&y<r.y+r.h+2&&y+h+2>r.y))continue;rooms.push({x,y,w,h});carve(x,y,w,h)}
  rooms.sort((a,b)=>a.x+a.y*.3-(b.x+b.y*.3));
  const cx=r=>r.x+(r.w>>1),cy=r=>r.y+(r.h>>1);
  const corr=(a,b)=>{let x=cx(a),y=cy(a);const tx=cx(b),ty=cy(b);const hf=rnd()<.5;const goX=()=>{while(x!==tx){carve(x,y,2,2);x+=Math.sign(tx-x)}},goY=()=>{while(y!==ty){carve(x,y,2,2);y+=Math.sign(ty-y)}};if(hf){goX();goY()}else{goY();goX()}carve(x,y,2,2)};
  for(let i=1;i<rooms.length;i++)corr(rooms[i-1],rooms[i]);for(let k=0;k<3;k++){const a=pick(rooms),b=pick(rooms);if(a!==b)corr(a,b)}}
 const start=rooms[0];PL.x=(start.x+start.w/2)*TS;PL.y=(start.y+start.h/2)*TS;PL.path=null;PL.target=null;
 // stairs: farthest room by BFS
 flowFrom(PL.x,PL.y);let far=rooms[rooms.length-1],fd=-1;for(const r of rooms.slice(1)){const d=flow[(r.y+(r.h>>1))*MW+r.x+(r.w>>1)];if(d>fd&&d<1e8){fd=d;far=r}}
 stairs=f.boss?null:{x:(far.x+far.w/2)*TS,y:(far.y+far.h/2)*TS};
 ents=[];allies=[];shots=[];eshots=[];booms=[];fx=[];nums=[];loot=[];props=[];tele=[];boss=null;
 // decor & interactables
 for(const r of rooms){const n=1+(rnd()*3|0);for(let i=0;i<n;i++){const x=(r.x+1+rnd()*(r.w-2))*TS,y=(r.y+1+rnd()*(r.h-2))*TS;if(Math.hypot(x-PL.x,y-PL.y)<60)continue;const t=rnd();props.push({t:t<.3?'barrel':t<.55?'crate':t<.75?'fire':t<.9?'sandbag':'corpse',x,y,hp:t<.3?3:t<.55?2:0})}}
 for(let y=1;y<MH-1;y++)for(let x=1;x<MW-1;x++)if(map[y][x]===1&&map[y+1][x]===0&&rnd()<.05)props.push({t:'torch',x:x*TS+8,y:(y+1)*TS-2});
 const mid=rooms.slice(1);
 if(!f.boss){for(const r of mid.slice(0,3).sort(()=>rnd()-.5)){const k=pick(['shrine','chest','pow']);props.push({t:k,x:(r.x+r.w/2)*TS+(rnd()-.5)*30,y:(r.y+r.h/2)*TS+(rnd()-.5)*20,kind:k==='shrine'?pick(['inflation','selfcrit','withdrawal','zeal']):null,used:false})}
  // monsters
  const packs=mid.length;mid.forEach((r,i)=>{if(r===far&&rnd()<.5)return;const n=2+(rnd()*(3+FL)|0);const elite=i===2||i===5||(i===packs-1);const cx_=(r.x+r.w/2)*TS,cy_=(r.y+r.h/2)*TS;
   if(elite&&rnd()<.5){const lead=spawnE(pick(['rifle','runner','grenadier','commissar']),cx_,cy_,'rare');for(let k=0;k<3;k++)spawnE(pick(['rifle','runner']),cx_+(rnd()-.5)*50,cy_+(rnd()-.5)*40,null,lead)}
   else if(elite){const t=pick(['rifle','runner','grenadier']),af=pick(EAFF);for(let k=0;k<3;k++)spawnE(t,cx_+(rnd()-.5)*50,cy_+(rnd()-.5)*40,'champ',null,af)}
   else for(let k=0;k<n;k++){const ty=rnd();spawnE(ty<.35?'rifle':ty<.6?'runner':ty<.72?'grenadier':ty<.8?'commissar':ty<.88&&FL>0?'sniper':ty<.94&&FL>1?'cavalry':'mortar',cx_+(rnd()-.5)*r.w*12,cy_+(rnd()-.5)*r.h*12)}
   if(rnd()<.25)spawnE('speaker',(r.x+1.5)*TS,(r.y+1.5)*TS)})}
 else spawnBoss(f.boss);
 for(const p of props)if(p.t==='barrel'||p.t==='crate'||p.t==='sandbag')p.block=1;
 radioQ=[];radio(f.radio);if(FL===0)setTimeout(()=>radio(tr("HQ: Our supply crates are labeled US AID. Do not open them. They are for sale.")),9000);
 music(f.music);reveal()}
function reveal(){const tx=Math.floor(PL.x/TS),ty=Math.floor(PL.y/TS);for(let y=ty-9;y<=ty+9;y++)for(let x=tx-12;x<=tx+12;x++)if(y>=0&&x>=0&&y<MH&&x<MW&&(x-tx)**2*.6+(y-ty)**2<80)seen[y][x]=1}
function flowFrom(x,y){flow=new Float32Array(MW*MH).fill(1e9);const q=[];const sx=Math.floor(x/TS),sy=Math.floor(y/TS);if(solid(sx,sy))return;flow[sy*MW+sx]=0;q.push(sx,sy);let h=0;
 while(h<q.length){const cx=q[h++],cy=q[h++],d=flow[cy*MW+cx];if(d>60)continue;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=cx+dx,ny=cy+dy;if(solid(nx,ny))continue;const k=ny*MW+nx;if(flow[k]>d+1){flow[k]=d+1;q.push(nx,ny)}}}}
function pathTo(sx,sy,tx,ty){// BFS on tiles, returns waypoints
 const s=[Math.floor(sx/TS),Math.floor(sy/TS)],t=[Math.floor(tx/TS),Math.floor(ty/TS)];if(solid(t[0],t[1]))return null;const prev=new Int32Array(MW*MH).fill(-1);const q=[s[0],s[1]];prev[s[1]*MW+s[0]]=s[1]*MW+s[0];let h=0,found=false;
 while(h<q.length){const cx=q[h++],cy=q[h++];if(cx===t[0]&&cy===t[1]){found=true;break}for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]){const nx=cx+dx,ny=cy+dy;if(solid(nx,ny)||(dx&&dy&&(solid(cx+dx,cy)||solid(cx,cy+dy))))continue;const k=ny*MW+nx;if(prev[k]<0){prev[k]=cy*MW+cx;q.push(nx,ny)}}}
 if(!found)return null;const pts=[];let k=t[1]*MW+t[0];while(k!==prev[k]){pts.push({x:(k%MW)*TS+8,y:Math.floor(k/MW)*TS+8});k=prev[k]}pts.reverse();if(pts.length)pts[pts.length-1]={x:tx,y:ty};return pts}
function los(x0,y0,x1,y1){const d=Math.hypot(x1-x0,y1-y0),n=Math.ceil(d/6);for(let i=1;i<n;i++){const t=i/n;if(solidAt(x0+(x1-x0)*t,y0+(y1-y0)*t))return false}return true}
function blockedAt(x,y,r,self){if(solidAt(x-r,y-r)||solidAt(x+r,y-r)||solidAt(x-r,y+r)||solidAt(x+r,y+r))return true;for(const p of props)if(p.block&&!p.dead&&Math.hypot(p.x-x,p.y-y)<r+6)return true;if(boss&&self!==boss&&!boss.dead&&Math.hypot(boss.x-x,boss.y-(y))<r+boss.r)return true;return false}
function move(e,dx,dy,r){if(!blockedAt(e.x+dx,e.y,r,e))e.x+=dx;if(!blockedAt(e.x,e.y+dy,r,e))e.y+=dy}

/* ---------------- monsters ---------------- */
const EDEF={rifle:{hp:28,dmg:8,spd:.75,xp:8,rng:110},runner:{hp:24,dmg:11,spd:1.45,xp:8,rng:16},grenadier:{hp:32,dmg:16,spd:.7,xp:10,rng:120},commissar:{hp:55,dmg:7,spd:.7,xp:16,rng:100},
 mortar:{hp:40,dmg:18,spd:0,xp:12,rng:200},sniper:{hp:26,dmg:22,spd:.6,xp:12,rng:220},cavalry:{hp:70,dmg:20,spd:1.1,xp:20,rng:20},speaker:{hp:60,dmg:9,spd:0,xp:15,rng:170},ally:{hp:60,dmg:10,spd:1.2,xp:0,rng:100}};
const EAFF=['FAST','SELF-CRITICAL','EXPLOSIVE','INFLATED','LONG MARCH','DEFECTS WHEN HURT','LOUD'];
const EAFF_N={};for(const a of EAFF)EAFF_N[a]=a; // display names (logic keeps the English keys)
const RNAME1=['POLITICAL','IRON','VERY ENTHUSIASTIC','TWICE-DECORATED','FORMERLY NATIONALIST','UNDER REVIEW','LOUD','HUNGRY'],RNAME2=['CADRE WANG','SQUAD LEADER LI','COMRADE ZHAO','PLATOON CHIEF SUN','INSTRUCTOR MA','QUARTERMASTER FU'];
let eid=1;
function spawnE(t,x,y,tier,lead,affix){if(solidAt(x,y)){const tx=Math.floor(x/TS),ty=Math.floor(y/TS);let ok=false;for(let r=1;r<4&&!ok;r++)for(let dy=-r;dy<=r&&!ok;dy++)for(let dx=-r;dx<=r&&!ok;dx++)if(!solid(tx+dx,ty+dy)){x=(tx+dx)*TS+8;y=(ty+dy)*TS+8;ok=true}if(!ok)return null}
 const d=EDEF[t],sc=Math.pow(1.38,FL),e={id:eid++,t,x,y,hp:d.hp*sc,max:d.hp*sc,dmg:d.dmg*Math.pow(1.22,FL),spd:d.spd,rng:d.rng,xp:Math.round(d.xp*Math.pow(1.3,FL)),face:-1,anim:0,cd:40+rnd()*60,aim:0,stun:0,fear:0,flash:0,alert:false,tier,aff:[],dead:false,dt:0,shout:0,shoutTxt:'',lead,r:6};
 if(tier==='champ'){e.hp=e.max*=2.6;e.aff=[affix||pick(EAFF)];e.xp*=3}
 if(tier==='rare'){e.hp=e.max*=4.5;e.aff=[pick(EAFF),pick(EAFF)].filter((v,i,a)=>a.indexOf(v)===i);e.xp*=5;e.rn=[rnd()*RNAME1.length|0,rnd()*RNAME2.length|0]}
 if(e.aff.includes('INFLATED')){e.hp=e.max*=1.5;e.big=1}if(e.aff.includes('FAST'))e.spd*=1.5;
 if(t==='speaker'){e.r=8}
 ents.push(e);return e}
function spawnBoss(kind){const ax=35*TS,ay=20*TS;if(kind==='tank'){boss={kind,x:ax,y:ay,r:30,hp:2600,max:2600,plate:0,cd:120,mg:200,burst:0,phase:0,flash:0,dead:false,dt:0,face:-1,spawn:600,charge:0}}
 else boss={kind,x:ax+80,y:ay+20,r:34,hp:6200,max:6200,cd:150,stomp:160,laser:0,lang:0,walk:0,eyeT:0,phase:0,flash:0,dead:false,dt:0,spawn:500,laserY:0};
 const sc=Math.pow(1.38,FL)/Math.pow(1.38,kind==='tank'?2:5);boss.hp=boss.max*=sc}

/* ---------------- messages ---------------- */
function radio(s){if(s)radioQ.push(s)}
function pop(x,y,s,c='#ffd24a',life=100){let k=0;for(const n of nums)if(n.txt&&Math.abs(n.x-x)<90&&Math.abs(n.y-y)<10+k*10&&n.life>20)k++;nums.push({x,y:y-k*11,s,c,life,txt:1})}
function dmgNum(x,y,v,crit,col){nums.push({x:x+(rnd()-.5)*8,y,s:String(v),c:col||(crit?'#ffd24a':'#ffffff'),life:45,crit})}
function cry(force){if(!force&&shoutT>0)return;shoutTxt=pick(CRIES.kmt);shoutT=90}

/* ---------------- combat ---------------- */
function addFx(o){fx.push(o)}
function blood(x,y,n){for(let i=0;i<n;i++)addFx({x,y,z:10,vx:(rnd()-.5)*2.4,vy:(rnd()-.5)*1.4,vz:1+rnd()*1.6,life:26+rnd()*15,c:pick(['#8a1c14','#b02a1e','#5a120c']),s:2})}
function sparks(x,y,n,cols=['#fff','#ffe27a','#ffb04a']){for(let i=0;i<n;i++)addFx({x,y,z:8,vx:(rnd()-.5)*3,vy:(rnd()-.5)*2,vz:rnd()*2,life:12+rnd()*10,c:pick(cols),s:1})}
function smoke(x,y,n){for(let i=0;i<n;i++)addFx({x:x+(rnd()-.5)*10,y:y+(rnd()-.5)*6,z:6,vx:(rnd()-.5)*.3,vy:(rnd()-.5)*.3,vz:.4+rnd()*.4,life:50+rnd()*40,c:'smoke',s:4,g:0})}
function explode(x,y,r,dmg,friendly,big){SFX.boom(big);shake=Math.max(shake,big?10:6);flashA=Math.max(flashA,big?.35:.2);flashC='#fff4d0';booms.push({x,y,r,t:0});
 for(let i=0;i<(big?40:26);i++){const a=rnd()*6.28,s=rnd()*3;addFx({x,y,z:6,vx:Math.cos(a)*s,vy:Math.sin(a)*s*.6,vz:1+rnd()*2.5,life:18+rnd()*20,c:pick(['#fff3b0','#ffd24a','#ff8a1a','#ff5a1a','#c8372d']),s:3,fire:1})}smoke(x,y,big?10:6);
 if(friendly){for(const e of ents)if(!e.dead&&!e.ally&&Math.hypot(e.x-x,e.y-y)<r+e.r)hurtE(e,dmg,false,x,y);if(boss&&!boss.dead&&Math.hypot(boss.x-x,boss.y-y)<r+boss.r)hurtBoss(dmg);for(const p of props)if(p.hp&&!p.dead&&Math.hypot(p.x-x,p.y-y)<r)hitProp(p)}
 else if(Math.hypot(PL.x-x,PL.y-y)<r+6)hurtH(dmg,'boom')}
function hurtE(e,v,crit,fx_,fy_){if(e.dead||e.ally)return;if(e.t!=='speaker'&&rnd()<.0)return;e.hp-=v;e.flash=6;e.alert=true;dmgNum(e.x,e.y-26,v,crit);if(crit){shake=Math.max(shake,2)}SFX.hit();blood(e.x,e.y-10,crit?6:3);
 if(PL.st.lifesteal)healH(PL.st.lifesteal);
 if(fx_!=null&&!e.aff.includes('LONG MARCH')&&e.t!=='speaker'&&e.t!=='mortar'){const a=Math.atan2(e.y-fy_,e.x-fx_);move(e,Math.cos(a)*(crit?5:2),Math.sin(a)*(crit?5:2),5)}
 if(e.aff.includes('DEFECTS WHEN HURT')&&e.hp<e.max*.3&&!e.convertTried){e.convertTried=1;convert(e);return}
 if(e.hp<=0)killE(e)}
function convert(e){e.ally=true;e.alert=false;e.allyT=900;e.shout=80;e.shoutTxt=pick(DEFECT);ents=ents.filter(o=>o!==e);allies.push(e);SFX.pick();pop(e.x,e.y-40,tr('DEFECTED!'),'#9fe0a0',80)}
function killE(e){e.dead=true;e.dt=0;runStats.kills++;SFX.scream();blood(e.x,e.y-10,10);addFx({x:e.x,y:e.y,z:22,vx:(rnd()-.5)*2,vy:-.5,vz:2.5,life:80,c:PAL.ccp.h,s:4,hat:1});
 gainXp(e.xp);if(PL.st.loh)healH(PL.st.loh);if(PL.st.pow.letter)healH(PL.st.maxHp*.03);
 killTimes.push(T);killTimes=killTimes.filter(t=>T-t<120);if(killTimes.length>=4){cry();killTimes=[]}
 if(PL.st.pow.owners&&rnd()<.12){for(const o of ents)if(!o.dead&&!o.ally&&!o.tier&&Math.hypot(o.x-e.x,o.y-e.y)<70){convert(o);break}}
 if(rnd()<.35)pop(e.x,e.y-34,pick(KT.kills),'#ffd24a',90);
 if(e.aff.includes('EXPLOSIVE'))setTimeout(()=>{if(state==='play')explode(e.x,e.y,36,e.dmg*1.6,false,true)},300);
 // loot
 const gm=(1+PL.st.gold/100)*(e.aff.includes('INFLATED')?5:1);if(rnd()<.5)dropGold(e.x,e.y,Math.round((3+FL*3)*(.6+rnd())*gm*(e.tier?3:1)));
 if(rnd()<.06)loot.push({x:e.x+6,y:e.y,k:'pot'});
 const ic=e.tier==='rare'?1.6:e.tier==='champ'?.55:.07;let n=Math.floor(ic)+(rnd()<ic%1?1:0);for(let i=0;i<n;i++)dropItem(e.x+(rnd()-.5)*20,e.y+(rnd()-.5)*10,genItem(FL,e.tier==='rare'&&rnd()<.3?2:null))}
function dropGold(x,y,v){loot.push({x:x+(rnd()-.5)*10,y:y+(rnd()-.5)*6,k:'gold',v,vy:-2,z:0})}
function dropItem(x,y,it){loot.push({x,y,k:'item',it,z:0,vz:2.5});if(it.rar>=2)SFX.weapon();if(it.rar===3){runStats.legend++;pop(x,y-30,tr('LEGENDARY!'),'#ff8a3a',120)}}
function gainXp(v){PL.xp+=v;const need=()=>Math.round(40*Math.pow(PL.lvl,1.6));while(PL.xp>=need()){PL.xp-=need();PL.lvl++;perkQ++;recalc();PL.hp=PL.st.maxHp;PL.zeal=PL.st.maxZeal;SFX.oneup();pop(PL.x,PL.y-40,tr('LEVEL UP! FIELD PROMOTION'),'#9fe0a0',120);flashA=.3;flashC='#ffd24a';
 const un=PL.c.skills.find(s=>s.lvl===PL.lvl);if(un)pop(PL.x,PL.y-52,tr('NEW SKILL: ')+un.name,'#ffd24a',160)}}
function healH(v){PL.hp=Math.min(PL.st.maxHp,PL.hp+v)}
function hurtH(v,why){if(PL.dead||PL.invuln>0||PL.roll>0||state!=='play')return;if(why==='bullet'&&PL.st.pow.pot&&rnd()<.25){pop(PL.x,PL.y-34,tr('CLANG! (THE POT)'),'#c9b9a0',40);SFX.clang();return}
 const a=armorNow(),red=a/(a+60+FL*15);v=Math.max(1,Math.round(v*(1-red)));PL.hp-=v;PL.hurtT=20;shake=Math.max(shake,3);flashA=Math.max(flashA,.25);flashC='#c8372d';dmgNum(PL.x,PL.y-30,v,false,'#ff4a3a');SFX.hit();
 if(PL.hp<=0){PL.hp=0;PL.dead=1;runStats.cause=why;SFX.die();music('off')}}
function hitProp(p){if(!p.hp||p.dead)return;p.hp--;p.flash=6;SFX.clang();if(p.hp<=0){p.dead=1;if(p.t==='barrel')setTimeout(()=>{if(state==='play')explode(p.x,p.y,40,40+FL*25,true,true)},60);else{sparks(p.x,p.y-6,10,['#7a5a35','#9c7a4c']);if(rnd()<.4)dropGold(p.x,p.y,4+FL*4);if(rnd()<.12)loot.push({x:p.x,y:p.y,k:'pot'})}}}
function hurtBoss(v,crit){const b=boss;if(!b||b.dead)return;b.hp-=v;b.flash=4;dmgNum(b.x,b.y-60,v,crit);if(T%3===0)SFX.clang();
 if(b.kind==='tank'){const ph=Math.min(PLATES.length-1,Math.floor((1-b.hp/b.max)*4)+1);if(b.hp>0&&ph!==b.plate){b.plate=ph;pop(b.x,b.y-70,tr('OWNERSHIP TRANSFERRED'),'#ffd24a',120)}}
 if(b.hp<=0){b.dead=true;b.dt=0;hitstop=14;flashA=1;music('off');gainXp(b.kind==='tank'?400:1500);runStats.kills++}}
function targetsIn(x,y,r){const out=ents.filter(e=>!e.dead&&!e.ally&&Math.hypot(e.x-x,e.y-y)<r+e.r);return out}
function nearestFoe(r,fromX=PL.x,fromY=PL.y){let best=null,bd=r;for(const e of ents){if(e.dead||e.ally)continue;const d=Math.hypot(e.x-fromX,e.y-fromY);if(d<bd&&los(fromX,fromY-8,e.x,e.y-8)){bd=d;best=e}}if(boss&&!boss.dead&&Math.hypot(boss.x-fromX,boss.y-fromY)<r+boss.r)best=best&&bd<Math.hypot(boss.x-fromX,boss.y-fromY)-boss.r?best:boss;return best}
function aimPoint(){if(touchUI||kbAim){const t=nearestFoe(220);if(t)return{x:t.x,y:t.y-(t===boss?20:8)};return{x:PL.x+PL.face*40,y:PL.y-8}}return{x:mouse.wx,y:mouse.wy}}
function basic(ax,ay){const c=PL.c,a=Math.atan2(ay-(PL.y-8),ax-PL.x);PL.face=Math.cos(a)<0?-1:1;PL.atkCd=Math.round(c.rate/(1+PL.st.aspd/100));PL.zeal=Math.min(PL.st.maxZeal,PL.zeal+(7)*(1+PL.st.zealGen/100));
 if(PL.cls==='brute'){PL.slashT=12;SFX.knife();const pts=targetsIn(PL.x,PL.y,34);for(const e of pts){const ea=Math.atan2(e.y-PL.y,e.x-PL.x),da=Math.abs(((ea-a+Math.PI*3)%(Math.PI*2))-Math.PI);if(da<1.15){const r_=rollDmg(1);hurtE(e,r_.d,r_.crit,PL.x,PL.y)}}
  if(boss&&!boss.dead&&Math.hypot(boss.x-PL.x,boss.y-PL.y)<34+boss.r){const r_=rollDmg(1);hurtBoss(r_.d,r_.crit)}for(const p of props)if(p.hp&&!p.dead&&Math.hypot(p.x-PL.x,p.y-PL.y)<30)hitProp(p);
  for(let i=0;i<8;i++){const aa=a-1+i*.28;addFx({x:PL.x+Math.cos(aa)*22,y:PL.y+Math.sin(aa)*14,z:10,vx:0,vy:0,vz:0,life:8,c:'#ffffff',s:2})}}
 else{PL.muzz=4;const sp=PL.cls==='sharp'?5.5:3.2;shots.push({x:PL.x+Math.cos(a)*10,y:PL.y-8+Math.sin(a)*8,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,k:PL.cls==='sharp'?'bullet':'paper',pct:1,life:PL.cls==='sharp'?60:70,pierce:(PL.st.pow.pierce?2:0)+(PL.perks.sharp2||0),hit:new Set()});if(PL.cls==='sharp')SFX.shot();else SFX.throw()}}
function canCast(s){const lv=PL.c.skills.indexOf(s);return PL.lvl>=s.lvl}
function cast(i,ax,ay){const s=PL.c.skills[i];if(!s||PL.lvl<s.lvl||PL.dead||PL.stun>0)return;if((PL.cd[s.id]||0)>0)return;let cost=s.cost*(PL.st.pow.lendlease?.65:1);if(PL.zeal<cost){if(T%30===0)pop(PL.x,PL.y-40,tr('NOT ENOUGH ZEAL'),'#6a9aff',40);return}
 const a=Math.atan2(ay-(PL.y-8),ax-PL.x);PL.face=Math.cos(a)<0?-1:1;const cdm=1-PL.st.cdr/100;
 switch(s.id){
 case 'spin':PL.chan=true;return;
 case 'leap':{const d=Math.min(110,Math.hypot(ax-PL.x,ay-PL.y));const tx=PL.x+Math.cos(a)*d,ty=PL.y+Math.sin(a)*d;if(solidAt(tx,ty))return;PL.leap={sx:PL.x,sy:PL.y,tx,ty,t:0};PL.invuln=24;SFX.jump();break}
 case 'roar':PL.buf.roar=360*(1+(PL.perks.brute2||0));cry(true);shake=6;SFX.alarm();for(const e of ents)if(!e.dead&&!e.ally&&Math.hypot(e.x-PL.x,e.y-PL.y)<90&&!e.aff.includes('LONG MARCH')){e.fear=150;e.shout=60;e.shoutTxt=tr(pick(['HE SAID WHAT?!','RETREAT! STRATEGICALLY!','I WANT MY MOTHER']))}break;
 case 'bundle':shots.push({k:'bundle',x:PL.x,y:PL.y-8,tx:ax,ty:ay+8,t:0,dur:Math.max(20,Math.hypot(ax-PL.x,ay-PL.y)/4),sx:PL.x,sy:PL.y});SFX.throw();break;
 case 'volley':{const n=5+3*(PL.perks.sharp1||0);for(let k=0;k<n;k++){const aa=a+(k-(n-1)/2)*.12;shots.push({x:PL.x,y:PL.y-8,vx:Math.cos(aa)*5.5,vy:Math.sin(aa)*5.5,k:'bullet',pct:.75,life:50,pierce:PL.st.pow.pierce?1:0,hit:new Set()})}PL.muzz=5;SFX.shotgun();shake=3;break}
 case 'mine':{const n=1+(PL.perks.sharp3?1:0);for(let k=0;k<n;k++)props.push({t:'mine',x:PL.x+(k?14:0)*PL.face,y:PL.y+4,arm:30,dmgPct:2.4*(1+(PL.perks.sharp3?.8:0))});SFX.clang();break}
 case 'roll':{const d=72;let tx=PL.x-Math.cos(a)*d,ty=PL.y-Math.sin(a)*d;if(held('left')||held('right')||held('up')||held('down')||stickV.x||stickV.y){const mx=(held('right')?1:0)-(held('left')?1:0)+stickV.x,my=(held('down')?1:0)-(held('up')?1:0)+stickV.y,m=Math.hypot(mx,my)||1;tx=PL.x+mx/m*d;ty=PL.y+my/m*d}PL.roll=16;PL.rollV={x:(tx-PL.x)/16,y:(ty-PL.y)/16};SFX.jump();pop(PL.x,PL.y-34,tr('STRATEGIC WITHDRAWAL'),'#c9b9a0',40);break}
 case 'barrage':PL.barrage=180;break;
 case 'blast':{const rng=110*(PL.perks.prop1?1.3:1),st=70*(1+(PL.perks.prop1||0)*.6);for(const e of ents){if(e.dead||e.ally)continue;const d=Math.hypot(e.x-PL.x,e.y-PL.y),ea=Math.atan2(e.y-PL.y,e.x-PL.x),da=Math.abs(((ea-a+Math.PI*3)%(Math.PI*2))-Math.PI);if(d<rng&&da<.6){const r_=rollDmg(1.4);hurtE(e,r_.d,r_.crit,PL.x,PL.y);if(!e.dead){if(!e.aff.includes('LONG MARCH'))e.stun=st;if(!e.tier&&e.t!=='speaker'&&rnd()<(PL.st.pow.truth?.3:.12))convert(e)}}}
  if(boss&&!boss.dead&&Math.hypot(boss.x-PL.x,boss.y-PL.y)<rng+boss.r){const r_=rollDmg(1.4);hurtBoss(r_.d,r_.crit)}
  for(let k=0;k<10;k++){const aa=a+(rnd()-.5)*1.1,sp=2+rnd()*2;addFx({x:PL.x,y:PL.y-10,z:10,vx:Math.cos(aa)*sp,vy:Math.sin(aa)*sp*.7,vz:0,life:25,c:pick(['#ff7d6e','#e9dcc2']),s:3,g:0,word:tr(pick(['LAND!','RICE!','DEFECT!','PEACE!','EAT!']))})}SFX.word();shake=3;break}
 case 'nova':{const pct=2.5*(1+(PL.perks.prop2?.6:0));for(const e of targetsIn(PL.x,PL.y,75)){const r_=rollDmg(pct);hurtE(e,r_.d,r_.crit,PL.x,PL.y)}if(boss&&!boss.dead&&Math.hypot(boss.x-PL.x,boss.y-PL.y)<75+boss.r){const r_=rollDmg(pct);hurtBoss(r_.d,r_.crit)}
  for(let k=0;k<40;k++){const aa=k/40*6.28,sp=2.5+rnd();addFx({x:PL.x,y:PL.y-6,z:6,vx:Math.cos(aa)*sp,vy:Math.sin(aa)*sp*.6,vz:.5,life:30,c:pick(['#8aa070','#b0a070','#d9a441']),s:3,g:.02,note:1})}booms.push({x:PL.x,y:PL.y,r:75,t:0,ring:1});SFX.boom();shake=5;pop(PL.x,PL.y-40,tr('INFLATION NOVA'),'#8aa070',50);break}
 case 'recruit':{const n=2+(PL.perks.prop3||0);for(let k=0;k<n;k++){const e={id:eid++,t:'ally',x:PL.x+(rnd()-.5)*30,y:PL.y+(rnd()-.5)*20,hp:60+FL*30,max:60+FL*30,dmg:(8+FL*6)*(PL.perks.prop3?1.5:1),spd:1.2,rng:100,face:1,anim:0,cd:30,ally:true,allyT:1200,aff:[],r:6,flash:0,shout:60,shoutTxt:pick(DEFECT),summoned:1};allies.push(e)}SFX.pick();break}
 case 'airdrop':shots.push({k:'crate',x:ax,y:ay,t:0});SFX.whistle();pop(ax,ay-40,tr('AMERICAN AID INBOUND'),'#ffd24a',60);break}
 PL.zeal-=cost;PL.cd[s.id]=Math.round(s.cd*cdm)}
function usePot(){if(PL.pot<=0||PL.potCd>0||PL.hp>=PL.st.maxHp)return;PL.pot--;PL.potCd=60;healH(PL.st.maxHp*.45);PL.happyT=40;SFX.pick();pop(PL.x,PL.y-36,tr(pick(['RICE WINE (MEDICINAL)','DOCTOR\'S ORDERS','ONE FOR THE ROAD'])),'#9fe0a0',60)}

/* ---------------- update ---------------- */
let flowT=0,kbAim=false;
function update(){if(hitstop>0){hitstop--;return}T++;if(shake>0)shake-=.5;if(flashA>0)flashA=Math.max(0,flashA-.05);if(shoutT>0)shoutT--;
 if(radioCur){if(--radioCur.t<=0)radioCur=null}else if(radioQ.length){const s=radioQ.shift();radioCur={s,t:140+s.length*(isZ(s)?7:3)|0};radioCur.max=radioCur.t;SFX.radio()}
 if(--flowT<=0){flowFrom(PL.x,PL.y);flowT=18}
 updHero();for(const k in pressed)delete pressed[k];
 for(const e of ents)updE(e);for(const a of allies)updAlly(a);
 ents=ents.filter(e=>!(e.dead&&e.dt>600));allies=allies.filter(a=>!a.gone);
 updBoss();updShots();updMisc();
 if(perkQ>0&&state==='play'&&!PL.dead)openPerks();
 if(PL.dead&&++PL.dead>140)endRun()}
function updHero(){const h=PL;for(const k in h.cd)if(h.cd[k]>0)h.cd[k]--;if(h.atkCd>0)h.atkCd--;if(h.potCd>0)h.potCd--;if(h.invuln>0)h.invuln--;if(h.hurtT>0)h.hurtT--;if(h.happyT>0)h.happyT--;if(h.slashT>0)h.slashT--;if(h.muzz>0)h.muzz--;
 for(const k in h.buf)if(h.buf[k]>0)h.buf[k]--;
 if(h.dead)return;h.hp=Math.min(h.st.maxHp,h.hp+h.st.regen/60+(h.cls==='brute'?0:0));if(h.cls!=='brute')h.zeal=Math.min(h.st.maxZeal,h.zeal+.06);
 if(T%1200===0&&h.pot<h.potMax)h.pot++;
 if(h.leap){const L_=h.leap;L_.t++;const k=L_.t/24;h.x=L_.sx+(L_.tx-L_.sx)*k;h.y=L_.sy+(L_.ty-L_.sy)*k;h.z=Math.sin(k*Math.PI)*30;if(L_.t>=24){h.leap=null;h.z=0;const pct=1.8*(PL.perks.brute3?2:1);explode(h.x,h.y,0,0,true);for(const e of targetsIn(h.x,h.y,44)){const r_=rollDmg(pct);hurtE(e,r_.d,r_.crit,h.x,h.y);if(!e.aff.includes('LONG MARCH'))e.stun=60}if(boss&&!boss.dead&&Math.hypot(boss.x-h.x,boss.y-h.y)<44+boss.r){const r_=rollDmg(pct);hurtBoss(r_.d,r_.crit)}SFX.stomp();shake=8;booms.push({x:h.x,y:h.y,r:44,t:0,ring:1})}reveal();return}
 if(h.roll>0){h.roll--;move(h,h.rollV.x,h.rollV.y,5);h.anim+=2;reveal();return}
 if(h.stun>0){h.stun--;return}
 // input movement
 let mx=(held('right')?1:0)-(held('left')?1:0)+stickV.x,my=(held('down')?1:0)-(held('up')?1:0)+stickV.y;const manual=Math.hypot(mx,my)>.15;
 const ap=aimPoint();
 // channel spin
 const spinHeld=h.cls==='brute'&&(held('s1')||mouse.r)&&h.lvl>=1;
 if(spinHeld&&h.zeal>0){h.chan=true;h.zeal-=.32*(h.st.pow.lendlease?.65:1);if(T%8===0){const rr=34*(PL.perks.brute1?1.4:1);for(const e of targetsIn(h.x,h.y,rr)){const r_=rollDmg(.55*(PL.perks.brute1?1.3:1));hurtE(e,r_.d,r_.crit,h.x,h.y)}if(boss&&!boss.dead&&Math.hypot(boss.x-h.x,boss.y-h.y)<rr+boss.r){const r_=rollDmg(.55);hurtBoss(r_.d,r_.crit)}for(const p of props)if(p.hp&&!p.dead&&Math.hypot(p.x-h.x,p.y-h.y)<rr)hitProp(p);SFX.knife()}
  for(let i=0;i<3;i++){const aa=T*.5+i*2.1;addFx({x:h.x+Math.cos(aa)*26,y:h.y+Math.sin(aa)*14,z:10,vx:0,vy:0,vz:0,life:6,c:'#ffffff',s:2})}}else h.chan=false;
 // barrage
 if(h.barrage>0){h.barrage--;if(T%5===0){const a=Math.atan2(ap.y-(h.y-8),ap.x-h.x)+(rnd()-.5)*.15;shots.push({x:h.x,y:h.y-8,vx:Math.cos(a)*6,vy:Math.sin(a)*6,k:'bullet',pct:.45,life:50,pierce:0,hit:new Set()});SFX.hmg();h.muzz=3;h.face=Math.cos(a)<0?-1:1}}
 // skills & potion
 for(let i=0;i<4;i++)if(pressed['s'+(i+1)]||(i===0&&mouse.rPress))cast(i,ap.x,ap.y);mouse.rPress=false;
 if(pressed.pot)usePot();if(pressed.bag)openBag();
 // attack / move
 let wantAtk=held('atk')||pressed.atk;
 if(mouse.l&&!touchUI){const e=enemyAt(mouse.wx,mouse.wy);if(e){h.target=e;h.path=null}else if(!manual){if(!h.target||h.target.dead||!mouse.lPress0){h.target=null;if(T%8===0||mouse.lPress){h.path=pathTo(h.x,h.y,mouse.wx,mouse.wy+4)}}}mouse.lPress=false}
 if(wantAtk){const t=nearestFoe(touchUI?150:h.c.range+10);if(t){h.target=t;h.path=null}else if(h.atkCd<=0&&!h.chan)basic(h.x+h.face*30,h.y-8)}
 const spd=h.c.spd*(1+h.st.spd/100)*(h.chan?.7:1)*(h.buf.withdrawal?1.4:1);
 if(manual){h.path=null;if(!wantAtk)h.target=null;const m=Math.hypot(mx,my);mx/=Math.max(1,m);my/=Math.max(1,m);let sp=spd;if(h.st.pow.retreat){const t=nearestFoe(120);if(t&&(t.x-h.x)*mx+(t.y-h.y)*my<0)sp*=1.5}move(h,mx*sp,my*sp,5);h.face=mx<-.1?-1:mx>.1?1:h.face;h.moving=true;h.anim++}
 else h.moving=false;
 const tg=h.target;if(tg&&(tg.dead||(tg!==boss&&tg.ally))){h.target=null}
 else if(tg){const tx=tg.x,ty=tg.y,d=Math.hypot(tx-h.x,ty-h.y)-(tg.r||6);const rng=h.c.range;if(d<=rng&&los(h.x,h.y-8,tx,ty-8)){if(h.atkCd<=0&&!h.chan)basic(tx,ty-(tg===boss?20:8));if(!wantAtk&&!mouse.l&&!touchUI&&tg.dead)h.target=null}
  else if(!manual){if(!h.path||T%15===0)h.path=pathTo(h.x,h.y,tx,ty)}}
 if(h.path&&h.path.length&&!manual){const p=h.path[0],dx=p.x-h.x,dy=p.y-h.y,d=Math.hypot(dx,dy);if(d<3){h.path.shift()}else{move(h,dx/d*spd,dy/d*spd,5);h.face=dx<-.1?-1:dx>.1?1:h.face;h.moving=true;h.anim++}if(!h.path.length)h.path=null}
 if(h.moving&&T%16===0)noise(.04,.04,400);
 reveal();
 // interactables
 for(const p of props){if(p.dead)continue;const d=Math.hypot(p.x-h.x,p.y-h.y);
  if(p.t==='shrine'&&!p.used&&d<16){p.used=1;const k=p.kind;h.buf[k]=1800;SFX.oneup();const msg={inflation:'SHRINE OF INFLATION: GOLD ×2. VALUE ×0.5.',selfcrit:'SHRINE OF SELF-CRITICISM: +50% DAMAGE, −15 ARMOR',withdrawal:'SHRINE OF STRATEGIC WITHDRAWAL: +40% SPEED',zeal:'SHRINE OF THE PARTY LINE: ZEAL REFILLS'}[k];pop(p.x,p.y-30,tr(msg),'#9fe0a0',160);if(k==='zeal')h.zeal=h.st.maxZeal}
  if(p.t==='chest'&&!p.used&&d<16){p.used=1;SFX.clang();pop(p.x,p.y-30,tr('US AID CRATE: CONTENTS PARTIALLY STOLEN'),'#ffd24a',120);for(let i=0;i<1+(rnd()<.5?1:0);i++)dropItem(p.x+(rnd()-.5)*24,p.y+6,genItem(FL,rnd()<.25?2:null));dropGold(p.x,p.y,15+FL*15)}
  if(p.t==='pow'&&!p.used&&d<16){p.used=1;p.t2=0;p.say=pick(POW_LINES);SFX.pick();h.happyT=60;loot.push({x:p.x+10,y:p.y,k:'pot'});if(rnd()<.6)dropItem(p.x-10,p.y,genItem(FL))}
  if(p.t==='mine'){if(p.arm>0)p.arm--;else for(const e of ents)if(!e.dead&&!e.ally&&Math.hypot(e.x-p.x,e.y-p.y)<18){p.dead=1;const r_=rollDmg(p.dmgPct);explode(p.x,p.y,46,r_.d,true,true);break}}}
 if(stairs&&Math.hypot(stairs.x-h.x,stairs.y-h.y)<14)descend();
 for(const l of loot){if(l.dead)continue;const ld=Math.hypot(l.x-h.x,l.y-h.y);if((l.k==='gold'||l.k==='pot')&&ld<56&&ld>4){l.x+=(h.x-l.x)/ld*2.2;l.y+=(h.y-l.y)/ld*2.2}if(ld<16&&(l.z||0)<=1){if(l.k==='gold'){l.dead=1;const v=Math.round(l.v*(h.buf.inflation?2:1));h.gold+=v;runStats.gold+=v;SFX.tally()}else if(l.k==='pot'){if(h.pot<h.potMax){l.dead=1;h.pot++;SFX.pick();pop(l.x,l.y-20,tr('RICE WINE +1'),'#9fe0a0',50)}}else if(l.k==='item'){if(h.bag.length<20){l.dead=1;h.bag.push(l.it);SFX.pick();pop(l.x,l.y-20,iname(l.it),RCOL[l.it.rar],70);if(autoEquip(l.it))pop(l.x,l.y-30,tr('EQUIPPED (UPGRADE)'),'#9fe0a0',70)}else if(T%60===0)pop(h.x,h.y-40,tr('BAG FULL (REQUISITIONED BY YOUR OWN SIDE)'),'#ff9a6a',60)}}}
 loot=loot.filter(l=>!l.dead)}
function autoEquip(it){if(it.slot==='weapon'&&it.cls!==PL.cls)return false;const cur=PL.eq[it.slot];if(!cur||score(it)>score(cur)*1.15){equip(it);return true}return false}
function score(it){let s=it.slot==='weapon'?(it.dmin+it.dmax)*2:it.armor*1.5;for(const k in it.aff)s+=it.aff[k];if(it.pow)s+=60;return s}
function equip(it){const i=PL.bag.indexOf(it);if(i>=0)PL.bag.splice(i,1);const cur=PL.eq[it.slot];if(cur)PL.bag.push(cur);PL.eq[it.slot]=it;recalc()}
function enemyAt(x,y){let best=null,bd=16;for(const e of ents){if(e.dead||e.ally)continue;const d=Math.hypot(e.x-x,e.y-10-y);if(d<bd){bd=d;best=e}}if(boss&&!boss.dead&&Math.hypot(boss.x-x,boss.y-20-y)<boss.r+10)return boss;return best}
function updE(e){if(e.dead){e.dt++;return}if(e.flash>0)e.flash--;if(e.shout>0)e.shout--;if(e.cd>0)e.cd--;
 const dx=PL.x-e.x,dy=PL.y-e.y,d=Math.hypot(dx,dy);
 if(e.aff.includes('SELF-CRITICAL'))e.hp=Math.min(e.max,e.hp+e.max*.0015);
 if(!e.alert){if(d<150&&T%10===e.id%10&&los(e.x,e.y-8,PL.x,PL.y-8)){e.alert=true;for(const o of ents)if(!o.alert&&Math.hypot(o.x-e.x,o.y-e.y)<80)o.alert=true;if(rnd()<.4){e.shout=80;e.shoutTxt=pick(TAUNTS.ccp)}}if(e.t!=='mortar'&&e.t!=='speaker'&&T%120===e.id%120)e.wander={x:(rnd()-.5)*.5,y:(rnd()-.5)*.5};if(e.wander&&e.spd){move(e,e.wander.x,e.wander.y,5);e.anim++}return}
 if(PL.dead)return;if(e.stun>0){e.stun--;return}
 let buff=1;for(const o of ents)if(o.t==='commissar'&&!o.dead&&o!==e&&Math.hypot(o.x-e.x,o.y-e.y)<90)buff=1.3;if(e.aff.includes('LOUD'))buff*=1.2;
 const spd=e.spd*buff,see=d<260&&(T+e.id)%6===0?los(e.x,e.y-8,PL.x,PL.y-8):e.see;e.see=see;e.face=dx<0?-1:1;
 const goFlow=(s)=>{const tx=Math.floor(e.x/TS),ty=Math.floor(e.y/TS);let bx=0,by=0,bd=flow[ty*MW+tx];for(const[ox,oy]of[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]]){const k=(ty+oy)*MW+tx+ox,v=flow[k];if(v<bd&&!solid(tx+ox,ty+oy)&&!(ox&&oy&&(solid(tx+ox,ty)||solid(tx,ty+oy)))){bd=v;bx=ox;by=oy}}
  let vx,vy;if(see&&d<60||(!bx&&!by)){vx=dx/d;vy=dy/d}else{const cx=(tx+bx)*TS+8-e.x,cy=(ty+by)*TS+8-e.y,cd=Math.hypot(cx,cy)||1;vx=cx/cd;vy=cy/cd}move(e,vx*s,vy*s,5);e.anim++};
 if(e.fear>0){e.fear--;move(e,-dx/d*spd*1.2,-dy/d*spd*1.2,5);e.anim++;return}
 for(const o of ents)if(o!==e&&!o.dead&&Math.abs(o.x-e.x)<10&&Math.abs(o.y-e.y)<8){e.x+=(e.x-o.x||1)*.08;e.y+=(e.y-o.y)*.08}
 const atkRange=e.rng;
 switch(e.t){
 case 'runner':case 'cavalry':
  if(e.t==='cavalry'&&e.charge>0){e.charge--;move(e,e.cv.x,e.cv.y,6);e.anim+=2;if(d<16&&e.cd<=0){hurtH(e.dmg*buff,'cavalry');e.cd=40}if(e.charge===0)e.cd=90;break}
  if(e.t==='cavalry'&&see&&d<140&&d>40&&e.cd<=0){e.charge=40;e.cv={x:dx/d*3.2,y:dy/d*3.2};e.shout=40;e.shoutTxt=tr('CHARGE!');SFX.horse();break}
  if(d>14)goFlow(spd);if(d<18&&e.cd<=0){e.wind=(e.wind||0)+1;if(e.wind>10){hurtH(e.dmg*buff,'bayonet');e.cd=50;e.wind=0;SFX.knife()}}break;
 case 'rifle':case 'commissar':case 'sniper':case 'speaker':{
  if(e.spd&&(!see||d>atkRange))goFlow(spd);else if(e.spd&&d<50)move(e,-dx/d*spd*.7,-dy/d*spd*.7,5);
  if(e.aim>0){if(--e.aim===0){const sp=e.t==='sniper'?6:e.t==='speaker'?1.6:2.6,a=Math.atan2(PL.y-8-(e.y-12),PL.x-e.x)+(rnd()-.5)*(e.t==='sniper'?.02:.12);eshots.push({x:e.x,y:e.y-12,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,dmg:e.dmg*buff,life:140,k:e.t==='speaker'?'word':'bullet',w:e.t==='speaker'?pick(SLOGANS.ccp):null,hp:2});e.muzz=5;if(e.t==='speaker')SFX.word();else SFX.eshot()}}
  else if(e.cd<=0&&see&&d<atkRange+20){e.aim=e.t==='sniper'?50:e.t==='speaker'?20:22;e.cd=(e.t==='sniper'?150:e.t==='speaker'?110:100)+rnd()*60;if(e.t==='commissar'&&rnd()<.5){e.shout=70;e.shoutTxt=tr(pick(['SELF-CRITICISM AFTER THE BATTLE!','ADVANCE! I WILL SUPERVISE!','NO RETREAT! (EXCEPT ME)']))}}break}
 case 'grenadier':case 'mortar':
  if(e.spd&&(!see||d>atkRange))goFlow(spd);else if(e.spd&&d<60)move(e,-dx/d*spd*.6,-dy/d*spd*.6,5);
  if(e.cd<=0&&see&&d<atkRange+40){const tx=PL.x+(PL.moving?(rnd()-.5)*30:0),ty=PL.y;tele.push({x:tx,y:ty,r:e.t==='mortar'?32:26,t:0,dur:e.t==='mortar'?70:55,dmg:e.dmg*buff,k:e.t});if(e.t==='mortar')SFX.whistle();else{shots.push({k:'egren',x:e.x,y:e.y-14,sx:e.x,sy:e.y,tx,ty,t:0,dur:55})}e.cd=e.t==='mortar'?150:160;e.throwT=14}if(e.throwT>0)e.throwT--;break}}
function updAlly(a){if(a.flash>0)a.flash--;if(a.shout>0)a.shout--;if(a.cd>0)a.cd--;if(--a.allyT<=0){a.gone=true;pop(a.x,a.y-30,tr(a.summoned?'CONTRACT EXPIRED':'RE-DEFECTED. HOME.'),'#c9b9a0',60);return}
 let t=null,bd=150;for(const e of ents){if(e.dead||e.ally)continue;const d=Math.hypot(e.x-a.x,e.y-a.y);if(d<bd){bd=d;t=e}}if(!t&&boss&&!boss.dead&&Math.hypot(boss.x-a.x,boss.y-a.y)<200)t=boss;
 if(t){const d=Math.hypot(t.x-a.x,t.y-a.y);a.face=t.x<a.x?-1:1;if(d>80){move(a,(t.x-a.x)/d*a.spd,(t.y-a.y)/d*a.spd,5);a.anim++}else if(a.cd<=0){const ang=Math.atan2(t.y-8-(a.y-12),t.x-a.x);shots.push({x:a.x,y:a.y-12,vx:Math.cos(ang)*4,vy:Math.sin(ang)*4,k:'abullet',dmg:a.dmg,life:50,hit:new Set()});a.cd=45;a.muzz=4;SFX.shot()}}
 else{const d=Math.hypot(PL.x-a.x,PL.y-a.y);if(d>40){move(a,(PL.x-a.x)/d*a.spd,(PL.y-a.y)/d*a.spd,5);a.anim++;a.face=PL.x<a.x?-1:1}}
 for(const s of eshots)if(!s.dead&&Math.hypot(s.x-a.x,s.y-(a.y-10))<8){s.dead=1;a.hp-=s.dmg;a.flash=5;if(a.hp<=0){a.gone=true;pop(a.x,a.y-30,tr('DEFECTED ONCE. RETIRED FOR GOOD.'),'#c9b9a0',70)}}}
function updBoss(){const b=boss;if(!b)return;if(b.flash>0)b.flash--;
 if(b.dead){b.dt++;if(b.dt%7===0&&b.dt<100)explode(b.x+(rnd()-.5)*60,b.y-rnd()*40,0,0,true,b.dt%21===0);if(b.dt===104){explode(b.x,b.y-20,0,0,true,true);flashA=1;SFX.fanfare();
  for(let i=0;i<4;i++)dropItem(b.x+(i-1.5)*34,b.y+20+(i%2)*18,genItem(FL,i===0?3:2));dropGold(b.x,b.y+30,200+FL*100);dropGold(b.x+20,b.y+30,200+FL*100);
  if(b.kind==='tank'){radio(tr("HQ: Tank captured. Repaint scheduled. Again. Proceed to the sewers. Bring a nose clip."));pop(b.x,b.y-60,tr('TANK CAPTURED. REPAINT SCHEDULED. AGAIN.'),'#ffd24a',220);stairs={x:b.x,y:b.y+50}}
  else{pop(b.x,b.y-80,tr('IT WAS A MIRROR. IT WAS ALWAYS A MIRROR.'),'#ffd24a',300);radio(tr("HQ: Well done. Please board the last boat. Bring the gold. Leave the receipts."))}}if(b.kind==='mech'&&b.dt===460)winRun();return}
 const dx=PL.x-b.x,dy=PL.y-b.y,d=Math.hypot(dx,dy);if(PL.dead)return;
 if(!b.awake){if(d<220){b.awake=1;SFX.alarm();cry(true);radio(tr(b.kind==='tank'?"HQ: Destroy that tank. It was ours last week. America's before that. Japan's before that.":"HQ: Do not look directly at the face. Approval is pending."))}else return}
 b.t=(b.t||0)+1;const ph=b.hp<b.max*.5?1:0;
 if(b.kind==='tank'){b.face=dx<0?-1:1;
  if(b.charge>0){b.charge--;move(b,b.cv.x,b.cv.y,20);if(T%6===0)SFX.engine();if(d<b.r+6){hurtH(30+FL*8,'tank');PL.stun=20}}
  else if(d>90&&b.t%300===150){b.charge=60;b.cv={x:dx/d*2.2,y:dy/d*2.2};pop(b.x,b.y-60,tr('RAMMING SPEED (BORROWED)'),'#ff6a5a',60)}
  else if(d>50)move(b,dx/d*.35,dy/d*.35,20);
  if(--b.cd<=0){for(let k=0;k<3+ph*2;k++){const tx=PL.x+(rnd()-.5)*90*(k?1:0),ty=PL.y+(rnd()-.5)*60*(k?1:0);tele.push({x:tx,y:ty,r:30,t:0,dur:60+k*8,dmg:28+FL*8,k:'shell'})}SFX.boom();b.cd=170-ph*40;b.muzz=10}
  if(--b.mg<=0){b.burst=10;b.mg=220}if(b.burst>0&&T%5===0){b.burst--;const a=Math.atan2(dy,dx)+(b.burst-5)*.08;eshots.push({x:b.x+b.face*30,y:b.y-16,vx:Math.cos(a)*2.8,vy:Math.sin(a)*2.8,dmg:9+FL*3,life:140,k:'bullet'});SFX.eshot()}
  if(ph&&--b.spawn<=0){for(let k=0;k<3;k++){const e=spawnE('runner',b.x+(rnd()-.5)*80,b.y+40);if(e)e.alert=true}b.spawn=480}}
 else{// the Great Leader
  if(d>120)move(b,dx/d*.3,dy/d*.3,30);b.walk+=.05;
  if(--b.stomp<=0){b.stomp=170-ph*40;SFX.stomp();shake=10;booms.push({x:b.x,y:b.y,r:0,t:0,wave:1,max:220,dmg:22+FL*6,hitDone:false})}
  if(b.laser>0){b.laser--;if(b.laser===50){SFX.laser()}if(b.laser<50){b.lang+=.025*b.ldir;const lx=Math.cos(b.lang),ly=Math.sin(b.lang);const px_=PL.x-b.x,py_=PL.y-(b.y-60);const along=px_*lx+py_*ly;if(along>0&&Math.abs(-px_*ly+py_*lx)<10)hurtH(2+FL,'laser')}}
  else if(b.t%260===100){b.laser=110;b.lang=Math.atan2(PL.y-(b.y-60),PL.x-b.x)-.6;b.ldir=1;if(rnd()<.5){b.lang+=1.2;b.ldir=-1}}
  if(b.t%140===40){for(let k=0;k<10+ph*6;k++){const a=k/(10+ph*6)*6.28;eshots.push({x:b.x,y:b.y-60,vx:Math.cos(a)*1.4,vy:Math.sin(a)*1.4,dmg:12+FL*3,life:260,k:'word',w:pick(SLOGANS.ccp),hp:2})}SFX.word()}
  if(--b.spawn<=0){for(let k=0;k<4;k++){const e=spawnE(pick(['runner','rifle','commissar']),b.x+(rnd()-.5)*140,b.y+(rnd()-.5)*80);if(e)e.alert=true}b.spawn=520-ph*150}}}
function updShots(){
 for(const s of shots){if(s.dead)continue;
  if(s.k==='bundle'||s.k==='egren'){s.t++;const k=s.t/s.dur;s.x=s.sx+(s.tx-s.sx)*k;s.y=s.sy+(s.ty-s.sy)*k;s.z=Math.sin(k*Math.PI)*40;if(s.t>=s.dur){s.dead=1;if(s.k==='bundle'){const r_=rollDmg(3);explode(s.tx,s.ty,56,r_.d,true,true)}}continue}
  if(s.k==='crate'){s.t++;if(s.t===60){s.dead=1;const r_=rollDmg(4);explode(s.x,s.y,62,r_.d,true,true);if(Math.hypot(PL.x-s.x,PL.y-s.y)<70){healH(PL.st.maxHp*.35*(PL.perks.prop3?1.3:1));pop(PL.x,PL.y-40,tr('AID RECEIVED. INVOICE TO FOLLOW.'),'#9fe0a0',100)}loot.push({x:s.x,y:s.y,k:'pot'})}continue}
  s.x+=s.vx;s.y+=s.vy;if(--s.life<=0||solidAt(s.x,s.y+8)){s.dead=1;sparks(s.x,s.y,3);continue}
  if(s.k==='paper'){const t=nearestFoe(80,s.x,s.y+8);if(t){const a=Math.atan2(t.y-8-s.y,t.x-s.x),sp=Math.hypot(s.vx,s.vy);s.vx+=Math.cos(a)*.15;s.vy+=Math.sin(a)*.15;const n=Math.hypot(s.vx,s.vy);s.vx*=sp/n;s.vy*=sp/n}}
  const hitR=s.k==='abullet'?7:8;
  for(const e of ents){if(e.dead||e.ally||s.hit.has(e))continue;if(Math.hypot(e.x-s.x,e.y-12-s.y)<hitR+e.r*.6){s.hit.add(e);if(s.k==='abullet')hurtE(e,s.dmg,false,s.x-s.vx,s.y-s.vy);else{const r_=rollDmg(s.pct);hurtE(e,r_.d,r_.crit,s.x-s.vx,s.y-s.vy)}if(s.pierce>0)s.pierce--;else{s.dead=1;break}}}
  if(!s.dead&&boss&&!boss.dead&&Math.hypot(boss.x-s.x,boss.y-20-s.y)<boss.r){s.dead=1;if(s.k==='abullet')hurtBoss(s.dmg);else{const r_=rollDmg(s.pct);hurtBoss(r_.d,r_.crit)}}
  if(!s.dead)for(const p of props)if(p.hp&&!p.dead&&Math.hypot(p.x-s.x,p.y-6-s.y)<8){s.dead=1;hitProp(p);break}
  if(!s.dead)for(const w of eshots)if(w.k==='word'&&!w.dead&&Math.hypot(w.x-s.x,w.y-s.y)<10){s.dead=1;if(--w.hp<=0){w.dead=1;pop(w.x,w.y-10,tr('SLOGAN REFUTED'),'#9fe0a0',50)}}}
 shots=shots.filter(s=>!s.dead);
 for(const s of eshots){if(s.dead)continue;s.x+=s.vx;s.y+=s.vy;if(--s.life<=0||solidAt(s.x,s.y+8)){s.dead=1;continue}if(Math.hypot(PL.x-s.x,PL.y-12-s.y)<8&&!PL.leap){s.dead=1;hurtH(s.dmg,s.k==='word'?'slogan':'bullet')}}
 eshots=eshots.filter(s=>!s.dead);
 for(const t of tele){t.t++;if(t.t>=t.dur){t.dead=1;explode(t.x,t.y,t.r,t.dmg,false,t.k==='shell')}}tele=tele.filter(t=>!t.dead);
 for(const b of booms){b.t++;if(b.wave){b.r+=2.4;const dd=Math.hypot(PL.x-b.x,PL.y-b.y);if(!b.hitDone&&Math.abs(dd-b.r)<7&&!PL.leap&&PL.roll<=0){b.hitDone=true;hurtH(b.dmg,'stomp')}if(b.r>b.max)b.dead=1}else if(b.t>16)b.dead=1}booms=booms.filter(b=>!b.dead)}
function updMisc(){for(const p of fx){p.x+=p.vx;p.y+=p.vy;p.z+=p.vz;p.vz-=p.g!=null?p.g:.15;p.life--;if(p.c==='smoke')p.s+=.05;if(p.z<0){p.z=0;p.vz*=-.3;p.vx*=.5;p.vy*=.5}}fx=fx.filter(p=>p.life>0);if(fx.length>700)fx.splice(0,fx.length-700);
 for(const n of nums){n.life--;n.y-=n.txt?.25:.5}nums=nums.filter(n=>n.life>0);
 for(const l of loot){if(l.vz!=null){l.z+=l.vz;l.vz-=.2;if(l.z<=0){l.z=0;l.vz=null}}}
 for(const p of props){if(p.flash>0)p.flash--;if(p.t==='pow'&&p.used){p.t2++;if(p.t2>150)p.x-=1;if(p.t2>260)p.dead=1}}}

/* ---------------- render ---------------- */
const LC=document.createElement('canvas');LC.width=W;LC.height=H;const lg=LC.getContext('2d');
function light(x,y,rad,a=1){const g=lg.createRadialGradient(x,y,0,x,y,rad);g.addColorStop(0,`rgba(0,0,0,${a})`);g.addColorStop(.6,`rgba(0,0,0,${a*.6})`);g.addColorStop(1,'rgba(0,0,0,0)');lg.fillStyle=g;lg.fillRect(x-rad,y-rad,rad*2,rad*2)}
function drawEntity(o){const sx=o.x-camX,sy=o.y-camY;
 if(o.kind==='hero'){const h=PL;if(h.invuln>0&&!h.leap&&T%4<2)return;r(sx-8,sy-3,16,5,'#00000060');const z=h.z||0;
  const pose=h.leap?'jump':h.moving?'run':'idle',emo=h.dead?'dead':h.hurtT>0?'hurt':shoutT>40||h.buf.roar>300?'shout':h.happyT>0?'happy':h.chan||h.barrage>0?'grit':h.hp<h.st.maxHp*.3?'scared':T%200<6?'blink':'determined';
  ctx.save();ctx.translate(0,-camY-z);
  if(h.dead){ctx.translate(sx,o.y-6);ctx.rotate(-h.face*Math.PI/2);drawSoldier(-8,0,{fac:'kmt',face:1,emo:'dead',hero:1});ctx.restore();return}
  if(h.roll>0){ctx.translate(sx,o.y-10);ctx.rotate(h.roll*.4*h.face);drawSoldier(-8,10,{fac:'kmt',face:h.face,pose:'crouch',emo:'scared',hero:1});ctx.restore();return}
  const gun=h.cls==='sharp'?(h.barrage>0?'hmg':'rifle'):null;
  drawSoldier(sx-8,o.y,{fac:'kmt',pose,face:h.face,anim:h.anim,gun,muzz:h.muzz>0,hero:1,emo,blink:false,slash:h.cls==='brute'&&(h.slashT>0||h.chan)?((T*3)%12):0});
  if(h.cls==='brute'&&!h.slashT&&!h.chan){const f=h.face;seg(sx-f*2,o.y-14,sx-f*10,o.y-30,2,'#c8c8c8');r(sx-f*3-1,o.y-14,3,3,'#7a5230')}
  if(h.cls==='prop'){const f=h.face;r(sx+f*7-(f<0?6:0),o.y-14,6,4,'#b0b0b0');r(sx+f*12-(f<0?4:0),o.y-16,4,8,'#d0d0d0')}
  if(h.chan){ctx.globalAlpha=.5;ctx.strokeStyle='#ffffff';ctx.beginPath();ctx.ellipse(sx,o.y-8,30,16,0,0,6.28);ctx.stroke();ctx.globalAlpha=1}
  ctx.restore();return}
 if(o.kind==='ally'||o.kind==='enemy'){const e=o.e;if(e.dead){if(e.dt>520&&T%4<2)return;ctx.save();ctx.translate(sx,o.y-6-camY);ctx.rotate(e.face>0?Math.PI/2:-Math.PI/2);drawSoldier(-8,0,{fac:'ccp',face:1,emo:'dead'});ctx.restore();return}
  if(e.flash>0&&T%3===0)return;const ally=o.kind==='ally';
  ctx.globalAlpha=1;r(sx-8*(e.big?1.3:1),sy-3,16*(e.big?1.3:1),5,'#00000060');
  if(e.tier||ally){ctx.strokeStyle=ally?'#9fe0a0':e.tier==='rare'?'#ffd24a':'#6a9aff';ctx.globalAlpha=.6+Math.sin(T/8)*.2;ctx.beginPath();ctx.ellipse(sx,sy,11,5,0,0,6.28);ctx.stroke();ctx.globalAlpha=1}
  ctx.save();ctx.translate(0,-camY);if(e.big){ctx.translate(sx,o.y);ctx.scale(1.3,1.3);ctx.translate(-sx,-o.y)}
  if(e.t==='cavalry'){drawHorse(sx-16,o.y,e.face,e.anim,'#7a5232');drawSoldier(sx-8+(e.face>0?-6:-2),o.y-16,{fac:'ccp',pose:'sit',face:e.face,emo:'shout',gun:'rifle',bayo:1});ctx.restore();return}
  if(e.t==='speaker'){r(sx-1,o.y-34,3,34,'#4a3a2a');r(sx-12,o.y-40,10,7,'#9a9a9a');r(sx+3,o.y-40,10,7,'#9a9a9a');r(sx-5,o.y-28,10,14,'#b8322a');if(e.aim>0&&T%4<2)r(sx-14,o.y-42,4,4,'#fff');ctx.restore();return}
  if(e.t==='mortar'){seg(sx+e.face*4,o.y-2,sx+e.face*10,o.y-16,3,'#3a3a3a');drawSoldier(sx-8,o.y,{fac:'ccp',pose:'crouch',face:-e.face,emo:e.throwT>0?'grit':'normal'});ctx.restore();return}
  const moving=e.anim%40!==0&&e.alert,emo=ally?'happy':e.stun>0?'hurt':e.fear>0?'scared':e.shout>0||e.t==='runner'||e.charge?'shout':e.aim>0?'grit':'normal';
  const gun=e.t==='grenadier'?null:e.t==='commissar'?'pistol':'rifle';
  drawSoldier(sx-8,o.y,{fac:ally?'ccp':'ccp',pose:e.aim>0&&e.t!=='commissar'?'crouch':moving?'run':'idle',face:e.face,anim:e.anim,gun,bayo:e.t==='runner',muzz:(e.muzz||0)>0,emo,ally,officer:e.t==='commissar',throwT:e.t==='grenadier'?(e.throwT||0):null,item:e.t==='commissar'?'board':null});
  if(e.muzz>0)e.muzz--;
  if(e.t==='sniper'&&e.aim>0){ctx.globalAlpha=.5;seg(sx,o.y-12,PL.x-camX,PL.y-12,1,'#ff3a2a');ctx.globalAlpha=1;if(T%6<3)r(sx+e.face*14-1,o.y-14,3,3,'#fff')}
  ctx.restore();
  if(e.stun>0)txt('★',sx-4,sy-40,'#ffd24a');
  if(e.hp<e.max||e.tier){const w=e.tier?24:16;r(sx-w/2,sy-36,w,2,'#3a1714');r(sx-w/2,sy-36,w*Math.max(0,e.hp/e.max),2,ally?'#9fe0a0':'#e0302a')}
  return}
 if(o.kind==='prop'){const p=o.p;const fl=p.flash>0&&T%2;
  if(p.t==='barrel'){if(p.dead)return;r(sx-5,sy-12,10,12,fl?'#fff':'#a8322a');r(sx-5,sy-9,10,2,'#5a1a14');r(sx-5,sy-4,10,2,'#5a1a14');r(sx-4,sy-12,2,12,'#c8524a')}
  else if(p.t==='crate'){if(p.dead){r(sx-6,sy-2,12,2,'#5a4025');return}r(sx-7,sy-12,14,12,fl?'#fff':'#7a5a35');r(sx-7,sy-12,14,2,'#9c7a4c');r(sx-7,sy-6,14,1,'#5a4025');r(sx-1,sy-12,2,12,'#5a4025')}
  else if(p.t==='sandbag'){for(let i=0;i<3;i++)r(sx-12+i*8,sy-5,8,5,'#9a8660');for(let i=0;i<2;i++)r(sx-8+i*8,sy-9,8,4,'#8a7650')}
  else if(p.t==='corpse'){ctx.save();ctx.translate(sx,sy-4);ctx.rotate(Math.PI/2);drawSoldier(-8,0,{fac:pick?((p.x|0)%2?'ccp':'kmt'):'ccp',face:1,emo:'dead'});ctx.restore()}
  else if(p.t==='fire'){const f=(T>>2)%3;r(sx-6,sy-2,12,3,'#3a2a20');r(sx-4,sy-8-f,4,7+f,'#ff8a1a');r(sx+1,sy-10+f,4,9-f,'#ffb04a');r(sx-1,sy-12,3,5,'#ffe27a')}
  else if(p.t==='torch'){r(sx-1,sy-14,2,6,'#5a3a20');const f=(T>>2)%2;r(sx-2,sy-19-f,4,5+f,'#ffb04a');r(sx-1,sy-20,2,3,'#ffe27a')}
  else if(p.t==='shrine'){r(sx-8,sy-4,16,4,'#4a4048');r(sx-6,sy-22,12,18,p.used?'#3a3036':'#6a5a62');r(sx-8,sy-24,16,3,'#2a2228');if(!p.used){const c={inflation:'#8aa070',selfcrit:'#c8372d',withdrawal:'#6a9aff',zeal:'#ffd24a'}[p.kind];r(sx-3,sy-18,6,8,c);ctx.globalAlpha=.3+Math.sin(T/10)*.2;r(sx-10,sy-30,20,30,c);ctx.globalAlpha=1}}
  else if(p.t==='chest'){r(sx-9,sy-11,18,11,p.used?'#4a3a25':'#7a5a35');r(sx-9,sy-11,18,2,'#9c7a4c');if(LANG==='zh'){ctx.font=`700 8px ${ZFAM}`;ctx.fillStyle='#e9dcc2';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('美援',sx,sy-5);ctx.textAlign='left';ctx.textBaseline='alphabetic'}else{ctx.font='5px monospace';ctx.fillStyle='#e9dcc2';ctx.fillText('US AID',sx-8,sy-4)}}
  else if(p.t==='pow'){if(p.used&&p.t2>150)drawCivilian(sx-8,sy,{face:-1,pose:'run',anim:T,hat:'straw',emo:'scared'});else if(p.used)drawCivilian(sx-8,sy,{face:1,hat:'straw',emo:'happy',arm:'wave'});else{ctx.save();ctx.translate(0,0);drawPeasant({x:p.x-8+camX-camX,y:sy,st:'tied',t:0});ctx.restore()}}
  else if(p.t==='mine'){if(p.dead)return;r(sx-4,sy-2,8,3,'#3a3a2a');r(sx-1,sy-3,2,1,p.arm>0||T%20<10?'#c8372d':'#ffd24a')}
  return}
 if(o.kind==='boss'){const b=boss;ctx.save();ctx.translate(0,-camY);
  if(b.kind==='tank'){const old=camX;const tb={x:b.x-42,y:b.y,flash:b.flash,plate:b.plate,hp:b.hp,max:b.max,dead:b.dead};drawTank(tb);if(b.muzz>0){r(b.x-camX-52,b.y-34,8,8,'#ffe27a');b.muzz--}}
  else{if(b.dead&&b.dt>95){r(sx-30,o.y-90,60,48,'#c9d4e2');r(sx-28,o.y-88,56,44,'#e8eef5');ctx.save();ctx.translate(sx-16,o.y-50);ctx.scale(2,2);chibiHead('scared',0);cap('kmt');ctx.restore()}
   else{ctx.translate(sx,o.y);ctx.scale(.55,.55);const old=camX;camX=b.x;const mb={x:b.x-45,y:0,flash:b.flash,walk:b.walk,eyeT:b.laser>0?b.laser:0,laser:0,laserY:0,phase:b.hp<b.max*.5?2:b.hp<b.max*.75?1:0};drawMech(mb);camX=old}}
  ctx.restore();return}}
function render(){ctx.save();if(shake>0&&!RM)ctx.translate((rnd()-.5)*shake|0,(rnd()-.5)*shake|0);
 r(-10,-10,W+20,H+20,'#0a0706');
 const tx0=Math.floor(camX/TS)-1,ty0=Math.floor(camY/TS)-1,tx1=tx0+W/TS+3,ty1=ty0+H/TS+4;
 // floor
 for(let y=ty0;y<=ty1;y++)for(let x=tx0;x<=tx1;x++){if(y<0||x<0||y>=MH||x>=MW||!seen[y][x]||map[y][x])continue;const v=((x*7+y*13)%11===0)?2:((x+y)%3===0?1:0);ctx.drawImage(TILES.floor[v],x*TS-camX,y*TS-camY)}
 if(stairs){const sx=stairs.x-camX,sy=stairs.y-camY;r(sx-10,sy-7,20,14,'#120d0c');for(let i=0;i<3;i++)r(sx-8+i*2,sy-5+i*3,16-i*4,2,'#3a2a20');if(T%40<26)txt('▼',sx-4,sy-20,'#ffd24a')}
 for(const t of tele){const k=t.t/t.dur;ctx.strokeStyle='#ff3a2a';ctx.globalAlpha=.5+k*.4;ctx.beginPath();ctx.ellipse(t.x-camX,t.y-camY,t.r,t.r*.55,0,0,6.28);ctx.stroke();ctx.fillStyle='rgba(255,60,40,.18)';ctx.beginPath();ctx.ellipse(t.x-camX,t.y-camY,t.r*k,t.r*.55*k,0,0,6.28);ctx.fill();ctx.globalAlpha=1}
 const lbl=[];for(const l of loot){const sx=l.x-camX,sy=l.y-camY-(l.z||0);if(l.k==='gold'){r(sx-3,sy-3,6,4,'#d9a441');r(sx-2,sy-4,4,1,'#f0c860')}else if(l.k==='pot'){r(sx-2,sy-8,4,8,'#c9b9a0');r(sx-1,sy-10,2,2,'#7a5230')}else{const c=RCOL[l.it.rar];if(l.it.rar>=2){ctx.globalAlpha=.25+Math.sin(T/10)*.1;r(sx-2,sy-60,4,60,c);ctx.globalAlpha=1}r(sx-5,sy-5,10,6,c);r(sx-4,sy-4,8,4,'#120d0c');r(sx-3,sy-3,6,2,c);const nm0=iname(l.it),zl=isZ(nm0),mx_=zl?10:18,nm=nm0.length>mx_?nm0.slice(0,mx_-1)+'…':nm0;ctx.font=sfont(nm,6);const w=ctx.measureText(nm).width;let ly=sy-16;for(let g=0;g<6;g++){if(lbl.some(q=>sx-w/2-2<q.x+q.w&&sx+w/2+2>q.x&&ly<q.y+10&&ly+10>q.y))ly-=10;else break}lbl.push({x:sx-w/2-2,y:ly,w:w+4});if(ly<sy-17)r(sx,ly+9,1,sy-16-ly-9+6,c);r(sx-w/2-2,ly,w+4,9,'#120d0cd0');ctx.fillStyle=c;ctx.textAlign='center';ctx.textBaseline=zl?'middle':'top';ctx.fillText(nm,sx,zl?ly+5:ly+1);ctx.textBaseline='top'}}
 for(const p of props)if(p.t==='mine')drawEntity({kind:'prop',p,x:p.x,y:p.y});
 // rows: walls + entities sorted
 const list=[{kind:'hero',x:PL.x,y:PL.y}];for(const e of ents)list.push({kind:'enemy',e,x:e.x,y:e.y});for(const a of allies)list.push({kind:'ally',e:a,x:a.x,y:a.y});for(const p of props)if(p.t!=='mine'&&!(p.dead&&p.t!=='crate'))list.push({kind:'prop',p,x:p.x,y:p.y});if(boss)list.push({kind:'boss',x:boss.x,y:boss.y});
 list.sort((a,b)=>a.y-b.y);let li=0;
 for(let y=ty0;y<=ty1;y++){const rowBottom=(y+1)*TS;while(li<list.length&&list[li].y<y*TS+WH){drawEntity(list[li++])}
  for(let x=tx0;x<=tx1;x++){if(y<0||x<0||y>=MH||x>=MW||!map[y][x])continue;const vis=seen[y][x]||(y+1<MH&&seen[y+1][x]);if(!vis)continue;const sx=x*TS-camX,sy=y*TS-camY;ctx.drawImage(TILES.top,sx,sy-WH);if(y+1<MH&&!map[y+1][x])ctx.drawImage(TILES.face[((x*31+y*17)%9===0)?1:((x*13+y*7)%11===0?2:0)],sx,sy+TS-WH)}}
 while(li<list.length)drawEntity(list[li++]);
 // shots
 for(const s of shots){const sx=s.x-camX,sy=s.y-camY;if(s.k==='bundle'||s.k==='egren'){r(sx-2,sy-(s.z||0)-3,s.k==='bundle'?6:4,5,'#3a4030');r(sx,sy-(s.z||0)-6,1,3,'#7a5230');r(sx-3,sy+6,6,2,'#00000050')}
  else if(s.k==='crate'){const k=s.t/60,yy=sy-(1-k)*160;r(sx-7,yy-12,14,12,'#7a5a35');r(sx-12,yy-26,24,8,'#d9cfb8');ctx.globalAlpha=.4;ctx.strokeStyle='#ff3a2a';ctx.beginPath();ctx.ellipse(sx,sy,62,34,0,0,6.28);ctx.stroke();ctx.globalAlpha=1}
  else if(s.k==='paper'){r(sx-3,sy-2,6,4,'#e9dcc2');r(sx-2,sy-1,4,1,'#c8372d')}else r(sx-1,sy-1,3,2,s.k==='abullet'?'#9fe0a0':'#fff2a8')}
 for(const s of eshots){const sx=s.x-camX,sy=s.y-camY;if(s.k==='word'){const zw=isZ(s.w);ctx.font=sfont(s.w,6);const w=ctx.measureText(s.w).width;r(sx-w/2-1,sy-(zw?6:4),w+2,zw?12:8,'#120d0cc0');ctx.fillStyle='#ff7d6e';ctx.textAlign='center';ctx.textBaseline=zw?'middle':'top';ctx.fillText(s.w,sx,zw?sy:sy-3);ctx.textBaseline='top'}else{r(sx-1,sy-1,3,3,'#ff6a3d')}}
 // boss laser
 if(boss&&boss.kind==='mech'&&boss.laser>0&&!boss.dead){const bx=boss.x-camX,by=boss.y-60-camY,lx=Math.cos(boss.lang),ly=Math.sin(boss.lang);ctx.globalAlpha=boss.laser>50?.35:1;seg(bx,by,bx+lx*400,by+ly*400,boss.laser>50?1:5,'#ff3a2a');if(boss.laser<=50)seg(bx,by,bx+lx*400,by+ly*400,1,'#fff');ctx.globalAlpha=1}
 for(const b of booms){if(b.wave){ctx.strokeStyle='#ffb04a';ctx.lineWidth=3;ctx.globalAlpha=.8;ctx.beginPath();ctx.ellipse(b.x-camX,b.y-camY,b.r,b.r*.55,0,0,6.28);ctx.stroke();ctx.lineWidth=1;ctx.globalAlpha=1;continue}const k=b.t/16;ctx.globalAlpha=1-k;ctx.strokeStyle=b.ring?'#9fe0a0':'#ffe8b0';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(b.x-camX,b.y-camY,b.r*(.4+k*.8),b.r*.55*(.4+k*.8),0,0,6.28);ctx.stroke();ctx.lineWidth=1;ctx.globalAlpha=1}
 for(const p of fx){const sx=p.x-camX,sy=p.y-camY-p.z;if(p.c==='smoke'){ctx.fillStyle=`rgba(50,42,40,${p.life/90*.5})`;ctx.fillRect(sx-p.s/2|0,sy-p.s/2|0,p.s|0,p.s|0);continue}if(p.hat){r(sx-2,sy-1,5,2,p.c);r(sx-3,sy+1,7,1,'#111');continue}if(p.word){ctx.font=sfont(p.word,5);ctx.fillStyle=p.c;ctx.textAlign='center';ctx.fillText(p.word,sx,sy);continue}r(sx,sy,p.s,p.note?2:p.s,p.fire&&p.life<8?'#4a3a33':p.c)}
 // lighting
 const th=TILES.th;lg.globalCompositeOperation='source-over';lg.clearRect(0,0,W,H);lg.fillStyle=`rgba(8,4,6,${th.amb})`;lg.fillRect(0,0,W,H);lg.globalCompositeOperation='destination-out';
 light(PL.x-camX,PL.y-camY-10,120+Math.sin(T/20)*3);for(const p of props)if((p.t==='fire'||p.t==='torch')&&!p.dead)light(p.x-camX,p.y-camY-10,(p.t==='fire'?70:50)+rnd()*6,.9);
 for(const s of shots)light(s.x-camX,s.y-camY,22,.6);for(const s of eshots)light(s.x-camX,s.y-camY,14,.5);for(const b of booms)light(b.x-camX,b.y-camY,b.wave?40:b.r*2,.9);for(const p of fx)if(p.fire&&p.life>12)light(p.x-camX,p.y-camY-p.z,18,.4);
 for(const t of tele)light(t.x-camX,t.y-camY,t.r+10,.5);for(const l of loot)if(l.k==='item'&&l.it.rar>=2)light(l.x-camX,l.y-camY,30,.6);if(stairs)light(stairs.x-camX,stairs.y-camY,40,.7);
 if(boss&&!boss.dead)light(boss.x-camX,boss.y-camY-30,90,.8);for(const e of ents)if(e.tier&&!e.dead)light(e.x-camX,e.y-camY-10,30,.5);
 ctx.drawImage(LC,0,0);
 ctx.save();ctx.globalCompositeOperation='lighter';for(const p of props)if((p.t==='fire'||p.t==='torch')&&!p.dead){const g=ctx.createRadialGradient(p.x-camX,p.y-camY-8,0,p.x-camX,p.y-camY-8,40);g.addColorStop(0,'rgba(255,120,40,.18)');g.addColorStop(1,'rgba(255,90,20,0)');ctx.fillStyle=g;ctx.fillRect(p.x-camX-40,p.y-camY-48,80,80)}ctx.restore();
 // overlays in world space
 for(const n of nums){const sx=n.x-camX,sy=n.y-camY;if(n.life<12&&T%4<2)continue;if(n.txt){const w=tw(n.s);txt(n.s,clamp(sx,w/2+4,W-w/2-4),sy,n.c,'center')}else txt(n.s,sx,sy,n.c,'center',n.crit?'12px "Press Start 2P", monospace':F)}
 for(const e of ents.concat(allies))if(e.shout>0&&!e.dead)drawShout(e.shoutTxt,e.x-camX,e.y-camY-36,false);
 for(const e of ents)if(e.tier&&!e.dead){const nm=e.rn?RNAME1[e.rn[0]]+(LANG==='zh'?'':' ')+RNAME2[e.rn[1]]:e.aff.map(a=>EAFF_N[a]||a).join(' · ');ctx.font=sfont(nm,6);ctx.fillStyle=e.tier==='rare'?'#ffd24a':'#6a9aff';ctx.textAlign='center';ctx.textBaseline='top';ctx.fillText(nm,e.x-camX,e.y-camY-46)}
 for(const p of props)if(p.t==='pow'&&p.used&&p.t2<150)drawBubble(p.say,p.x-camX,p.y-camY-40);
 if(shoutT>0)drawShout(shoutTxt,PL.x-camX,PL.y-camY-40,true);
 ctx.restore();ctx.drawImage(VIG,0,0);if(flashA>0){ctx.globalAlpha=Math.min(1,flashA)*(RM?.3:1);ctx.fillStyle=flashC;ctx.fillRect(0,0,W,H);ctx.globalAlpha=1}
 if(PL.hp<PL.st.maxHp*.25&&!PL.dead){ctx.globalAlpha=.12+Math.sin(T/8)*.06;ctx.fillStyle='#c8372d';ctx.fillRect(0,0,W,H);ctx.globalAlpha=1}
 drawHUD()}
function orb(x,y,rad,frac,col,dark,label,val){ctx.fillStyle='#120d0c';ctx.beginPath();ctx.arc(x,y,rad+2,0,6.28);ctx.fill();ctx.fillStyle=dark;ctx.beginPath();ctx.arc(x,y,rad,0,6.28);ctx.fill();ctx.save();ctx.beginPath();ctx.arc(x,y,rad,0,6.28);ctx.clip();const top=y+rad-frac*rad*2;ctx.fillStyle=col;ctx.fillRect(x-rad,top,rad*2,rad*2);ctx.fillStyle='rgba(255,255,255,.18)';ctx.fillRect(x-rad,top,rad*2,2);ctx.restore();ctx.fillStyle='rgba(255,255,255,.25)';ctx.fillRect(x-rad/2,y-rad*.7,4,4);
 txt(val,x,y-4,'#fff','center');txt(label,x,y+rad-(isZ(label)?11:2),'#a8977c','center')}
function drawHUD(){const h=PL;
 r(0,0,W,22,'#120d0cb0');txt(LZ(`F${FL+1} · ${FLOORS[FL].name}`,`第${FL+1}層 · ${FLOORS[FL].name}`),4,3,'#ffd24a','left',HF());txt(LZ(`LV ${h.lvl} ${h.c.name}`,`${h.lvl}級 ${h.c.name}`),4,12,'#e9dcc2','left',HF());
 txt(fmtGY(h.gold),W-74,3,'#ffd24a','right',HF());txt(LZ(`≈${h.gold} EGGS`,`≈${h.gold} 顆蛋`),W-74,12,'#a8977c','right',HF());
 // minimap
 const ms=1.2,ox=W-MW*ms-4,oy=3;ctx.globalAlpha=.8;r(ox-1,oy-1,MW*ms+2,MH*ms+2,'#120d0c');for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)if(seen[y][x]&&!map[y][x])r(ox+x*ms,oy+y*ms,ms+.3,ms+.3,'#5b4636');
 if(stairs)r(ox+stairs.x/TS*ms-1,oy+stairs.y/TS*ms-1,3,3,'#ffd24a');if(boss&&!boss.dead&&boss.awake)r(ox+boss.x/TS*ms-1,oy+boss.y/TS*ms-1,3,3,'#ff3a2a');r(ox+h.x/TS*ms-1,oy+h.y/TS*ms-1,3,3,'#fff');ctx.globalAlpha=1;
 // bottom bar
 const by=H-24;r(56,by,W-112,24,'#120d0ce0');r(56,by,W-112,1,'#5b4636');
 const need=Math.round(40*Math.pow(h.lvl,1.6));r(60,by+2,W-120,2,'#2a1e18');r(60,by+2,(W-120)*h.xp/need,2,'#d9a441');
 orb(28,H-26,22,h.hp/h.st.maxHp,'#b02a1e','#3a1210',tr('MORALE'),String(Math.ceil(h.hp)));orb(touchUI?28:W-28,touchUI?H-76:H-26,touchUI?20:22,h.zeal/h.st.maxZeal,'#c88a2a','#3a2410',tr('ZEAL'),String(Math.floor(h.zeal)));
 // skill slots
 const sk=[{name:h.c.basic,short:h.c.basicShort,key:touchUI?'':'LMB'}].concat(h.c.skills.map((s,i)=>({...s,key:String(i+1)})));const sw=34,sx0=W/2-(sk.length*sw)/2+(-14);
 sk.forEach((s,i)=>{const x=sx0+i*sw,y=by+6;const locked=s.lvl&&h.lvl<s.lvl;r(x,y,sw-3,16,locked?'#1a1311':'#2a1e18');r(x,y,sw-3,1,'#5b4636');ctx.font='5px "Press Start 2P",monospace';ctx.textAlign='center';ctx.textBaseline='top';ctx.fillStyle=locked?'#5a4a3a':'#e9dcc2';
  if(LANG==='zh'){const nm=s.short||s.name,k=nm.length>3?Math.ceil(nm.length/2):nm.length,L2=[nm.slice(0,k),nm.slice(k)].filter(Boolean);ctx.font=`500 8px ${ZFAM}`;ctx.textBaseline='middle';L2.forEach((l,j)=>ctx.fillText(l,x+(sw-3)/2,y+(L2.length>1?4.5+j*7.5:8.5)));ctx.textBaseline='top';ctx.font='5px "Press Start 2P",monospace'}
  else{const words=s.name.split(' ');ctx.fillText(words[0].slice(0,6),x+(sw-3)/2,y+3);ctx.fillText((words[1]||'').slice(0,6),x+(sw-3)/2,y+9)}
  ctx.fillStyle='#d9a441';ctx.fillText(locked?'LV'+s.lvl:s.key,x+(sw-3)/2,y-6);
  if(s.id&&h.cd[s.id]>0){ctx.globalAlpha=.7;r(x,y,(sw-3)*h.cd[s.id]/s.cd,16,'#000');ctx.globalAlpha=1}if(s.cost&&h.zeal<s.cost)r(x,y+14,sw-3,2,'#6a9aff')});
 const px_=sx0+sk.length*sw+2;r(px_,by+6,22,16,'#2a1e18');r(px_+8,by+8,6,9,'#c9b9a0');r(px_+9,by+7,4,2,'#7a5230');txt(String(h.pot),px_+16,by+12,'#9fe0a0');ctx.font='5px "Press Start 2P",monospace';ctx.fillStyle='#d9a441';ctx.textAlign='center';ctx.fillText('F',px_+11,by);
 if(h.potCd>0){ctx.globalAlpha=.6;r(px_,by+6,22,16*h.potCd/60,'#000');ctx.globalAlpha=1}
 // buffs
 let bx=60;for(const[k,c,n0]of[['roar','#c8372d','ROAR'],['inflation','#8aa070','GOLD×2'],['selfcrit','#c8372d','SELF-CRIT'],['withdrawal','#6a9aff','SPEED']]){if(h.buf[k]>0){const n=tr(n0);txt(n,bx,by-10,c);bx+=tw(n)+8}}
 // boss bar
 if(boss&&boss.awake&&!boss.dead){const w=160,x=W/2-w/2;r(x-1,25,w+2,6,'#120d0c');r(x,26,w,4,'#3a1714');r(x,26,w*Math.max(0,boss.hp/boss.max),4,'#e0302a');txt(boss.kind==='tank'?tr('THE TANK OF MANY OWNERS')+' · '+PLATES[boss.plate]:tr('THE GREAT LEADER (FACE PENDING APPROVAL)'),W/2,33,'#e9dcc2','center')}
 if(radioCur){const zr=isZ(radioCur.s),ww=W-48-MW*ms;ctx.font=zr?zf(F):F;const Lr=(zr?wrapBal(radioCur.s,ww-32):wrap(radioCur.s,36)).slice(0,4),lh=zr?13:10,hh=Lr.length*lh+10,x=24,y=boss&&boss.awake?44:26;r(x,y,ww,hh,'#120d0ccc');ctx.strokeStyle='#4a6aa3';ctx.strokeRect(x+.5,y+.5,ww-1,hh-1);
  ctx.save();ctx.translate(x+3,y+31);ctx.beginPath();ctx.rect(0,-29,20,22);ctx.clip();ctx.translate(2,0);chibiHead((T>>3)%2?'shout':'determined',0);cap('kmt');ctx.restore();
  ctx.font=zr?zf(F):F;ctx.textAlign='left';ctx.textBaseline=zr?'middle':'top';const shown=Math.min(radioCur.s.length,(radioCur.max-radioCur.t)*(zr?1:2));let cnt=0;Lr.forEach((l,i)=>{ctx.fillStyle='#e9dcc2';ctx.fillText(l.slice(0,Math.max(0,shown-cnt)),x+26,zr?y+5+i*lh+lh/2:y+6+i*10);cnt+=l.length+(zr?0:1)});ctx.textBaseline='top'}
 if(T<160&&state==='play'){txt(LZ(`FLOOR ${FL+1}`,`第 ${FL+1} 層`),W/2,70,'#ffd24a','center',F16);txt(FLOORS[FL].name,W/2,92,'#e9dcc2','center')}
 if(PL.dead)txt(tr('YOUR CONSCRIPT HAS BEEN DEMOBILIZED'),W/2,90,'#ff6a5a','center');
 if(state==='pause'){r(0,0,W,H,'#0008');txt(tr('PAUSED'),W/2,92,'#ffd24a','center',F16);txt(tr('THE WAR WILL WAIT. IT ALWAYS DOES.'),W/2,116,'#e9dcc2','center');if(!touchUI)txt(tr('L: LANGUAGE'),W/2,134,'#a8977c','center')}}

/* ---------------- overlays: bag, perks, camp, end ---------------- */
let selItem=null;
function statRows(){const s=PL.st;return[[tr('Morale'),`${Math.ceil(PL.hp)}/${s.maxHp}`],[tr('Zeal'),`${Math.floor(PL.zeal)}/${s.maxZeal}`],[tr('Damage'),`${s.dmin}–${s.dmax} (+${s.dmgPct}%)`],[tr('Armor'),String(armorNow())],[tr('Crit'),`${s.crit}% ×${(1+s.critDmg/100).toFixed(2)}`],[tr('Move speed'),`+${s.spd}%`],[tr('Attack speed'),`+${s.aspd}%`],[tr('Gold found'),`+${s.gold}%`],[tr('Level'),`${PL.lvl}`]]}
function itemHTML(it,cmp){const lines=itemLines(it).map(l=>`<div>${l}</div>`).join('');let delta='';if(cmp&&cmp!==it){const d=score(it)-score(cmp);const v=(d>=0?'+':'')+Math.round(d);delta=`<div class="${d>=0?'up':'down'}">${LANG==='zh'?(d>=0?'▲ 比目前裝備好':'▼ 比目前裝備差')+`（${v}）`:(d>=0?'▲ BETTER':'▼ WORSE')+` THAN EQUIPPED (${v})`}</div>`}
 const zh=LANG==='zh',fl=it.u!=null?UNIQ[it.u].flav:null;
 return`<div class="nm r${it.rar}">${iname(it)}</div><div class="tag">${RAR[it.rar]}${zh?'':' '}${SLOTN[it.slot]}${it.cls?' · '+CLASSES[it.cls].name:''}${it.sub?' · '+ibase(it):''}</div>${lines}${fl?`<div class="flav">${zh?'「'+fl+'」':'"'+fl+'"'}</div>`:''}${delta}`}
function openBag(){if(state!=='play'&&state!=='camp')return;const was=state;if(state==='play')state='bag';bagFrom=was;$('#bag').hidden=false;renderBag()}
let bagFrom='play';
function renderBag(){const eq=$('#eq');eq.innerHTML='';for(const sl of SLOTS){const it=PL.eq[sl];const b=document.createElement('button');b.className='slot'+(selItem===it&&it?' sel':'');b.innerHTML=`<span>${SLOTN[sl]}</span><span class="nm ${it?'r'+it.rar:''}">${it?iname(it):tr('— nothing —')}</span>`;if(it)b.onclick=()=>{selItem=it;renderBag()};eq.appendChild(b)}
 $('#st').innerHTML=statRows().map(([k,v])=>`<span>${k}</span><b>${v}</b>`).join('');
 $('#bagH').textContent=`${tr('BAG')} ${PL.bag.length}/20`;const bg=$('#bg');bg.innerHTML='';PL.bag.forEach(it=>{const b=document.createElement('button');b.className='it'+(selItem===it?' sel':'');b.innerHTML=`<span class="nm r${it.rar}">${iname(it)}</span>`;b.onclick=()=>{selItem=it;renderBag()};bg.appendChild(b)});
 const dt=$('#dt'),dtb=$('#dtb');dtb.innerHTML='';if(!selItem){dt.innerHTML=`<p class="tag">${tr('Tap an item to inspect it.')}</p>`;return}
 const inBag=PL.bag.includes(selItem);dt.innerHTML=itemHTML(selItem,inBag?PL.eq[selItem.slot]:null);
 if(inBag){const ok=selItem.slot!=='weapon'||selItem.cls===PL.cls;const e=document.createElement('button');e.className='btn';e.textContent=tr(ok?'EQUIP':'WRONG CLASS');e.disabled=!ok;e.onclick=()=>{equip(selItem);SFX.weapon();renderBag()};dtb.appendChild(e);
  const d=document.createElement('button');d.className='btn alt';d.textContent=bagFrom==='camp'||state==='camp'?LZ(`SELL (${fmtGY(selItem.value)})`,`賣掉（${fmtGY(selItem.value)}）`):tr('SCRAP FOR GOLD');d.onclick=()=>{const v=bagFrom==='camp'||state==='camp'?selItem.value:Math.round(selItem.value*.4);PL.gold+=v;PL.bag.splice(PL.bag.indexOf(selItem),1);selItem=null;SFX.tally();renderBag();if(state==='camp')renderCamp()};dtb.appendChild(d)}}
$('#bagClose').onclick=()=>{$('#bag').hidden=true;selItem=null;if(state==='bag')state='play'};
function openPerks(){state='perk';const pool=PERKS.filter(p=>!p.cls||p.cls===PL.cls);const ch=pool.sort(()=>rnd()-.5).slice(0,3);perkCh=ch;$('#perkH').textContent=LZ(`FIELD PROMOTION · LEVEL ${PL.lvl}`,`戰場升官 · 第 ${PL.lvl} 級`);const box=$('#perks');box.innerHTML='';
 for(const p of ch){const b=document.createElement('button');b.className='perk';b.innerHTML=`<b>${p.n}</b><span>${p.d}</span><small>${p.f}</small>`;b.onclick=()=>{if(state!=='perk')return;PL.perks[p.id]=(PL.perks[p.id]||0)+1;if(p.id==='pot'){PL.pot++}recalc();perkQ--;$('#perk').hidden=true;state='play';SFX.weapon()};box.appendChild(b)}
 $('#perk').hidden=false;setTimeout(()=>box.querySelector('button')?.focus(),30)}
let shopStock=[],perkCh=[],qmLine=0,endInfo=null;
const QM_LINES=["QUARTERMASTER: These are our supplies. These are my prices. Both are final.","QUARTERMASTER: Everything is ten percent off. The prices went up twenty.","QUARTERMASTER: Gold Yuan accepted. Rice preferred. Silver whispered.","QUARTERMASTER: Field hospital is free. Bandages are extra. Blood is your own."];
const CAUSES={bullet:'shot by a rifleman',bayonet:'bayoneted',boom:'blown up',slogan:'killed by a slogan',tank:'run over by a tank with six owners',laser:'lasered by an unapproved face',stomp:'stepped on by a billboard',cavalry:'trampled by a conscripted horse',other:'lost to the war'};
const END_SEQ=[
 {date:'MEANWHILE, 1949',place:'ABOVE GROUND',draw:'wreck',fact:"You climb out after six floors of unbroken victories. Upstairs, the government has lost Manchuria, Nanjing and Shanghai.",joke:"HQ confirms you are the only unit that won anything all year. Please keep it quiet. It ruins the narrative."},
 {date:'DECEMBER 1949',place:'THE LAST BOAT',draw:'boats',fact:"The government announces a 'temporary relocation' to Taiwan. Very temporary. The gold reserves sailed ahead months ago, first class.",joke:"You offer your loot for a ticket: {LOOT}. The purser takes your rice wine instead."},
 {date:'NEW YEAR, 1950',place:'TAIPEI',draw:'island',fact:"Headquarters promises: 'We will counterattack the mainland next year.' Your kit bag stays packed, just in case.",joke:"1951: 'Next year.' 1952: 'Next year.' 1953: 'Next year.' Your kit bag has started to grow mushrooms."}];
function descend(){if(boss&&!boss.dead)return;stairs=null;state='camp';music('ending');$('#hud').hidden=true;$('#touch').hidden=true;
 PL.hp=PL.st.maxHp;PL.pot=PL.potMax;shopStock=[0,1,2,3].map(i=>{const it=genItem(FL+1,i===3?2:i===2?1:null);it.price=it.value*3;return it});
 if(FL===2){showScene(SCENES[3].pre,()=>{state='camp';showCamp()});return}showCamp()}
function showCamp(){$('#camp').hidden=false;qmLine=rnd()*QM_LINES.length|0;campHead();renderCamp()}
function campHead(){$('#campH').textContent=LZ(`FIELD CAMP · BEFORE FLOOR ${FL+2}`,`野戰營地 · 下到第 ${FL+2} 層之前`);$('#campP').textContent=QM_LINES[qmLine]}
function renderCamp(){const sh=$('#shop');sh.innerHTML='';for(const it of shopStock){const b=document.createElement('button');b.className='slot';b.disabled=it.sold;b.innerHTML=`<span>${fmtGY(it.price)}</span><span class="nm r${it.rar}">${it.sold?tr('SOLD'):iname(it)}</span>`;b.onclick=()=>{if(it.sold)return;if(PL.gold<it.price){$('#campG').textContent=tr('QUARTERMASTER: Not enough. Inflation is not my fault. Mostly.');return}if(PL.bag.length>=20){$('#campG').textContent=tr('Bag full.');return}PL.gold-=it.price;it.sold=1;PL.bag.push(it);autoEquip(it);SFX.pick();renderCamp()};
  b.onmouseenter=()=>{$('#campG').innerHTML=itemHTML(it,PL.eq[it.slot])};b.onfocus=b.onmouseenter;sh.appendChild(b)}
 const se=$('#sell');se.innerHTML='';if(!PL.bag.length)se.innerHTML=`<p class="tag">${tr('Nothing to sell. The quartermaster is disappointed in you.')}</p>`;for(const it of PL.bag){const b=document.createElement('button');b.className='slot';b.innerHTML=`<span>${fmtGY(it.value)}</span><span class="nm r${it.rar}">${iname(it)}</span>`;b.onclick=()=>{PL.gold+=it.value;PL.bag.splice(PL.bag.indexOf(it),1);SFX.tally();renderCamp()};se.appendChild(b)}
 if(!$('#campG').innerHTML)$('#campG').textContent=LZ(`You have ${fmtGY(PL.gold)} (≈ ${PL.gold} eggs). Morale restored. Rice wine refilled.`,`你有 ${fmtGY(PL.gold)}（≈ ${PL.gold} 顆蛋）。士氣已回滿，米酒已補滿。`)}
$('#campBag').onclick=()=>{bagFrom='camp';$('#bag').hidden=false;renderBag()};
$('#campGo').onclick=()=>{$('#camp').hidden=true;$('#campG').textContent='';FL++;startFloor()};
function startFloor(){state='play';genFloor();camX=PL.x-W/2;camY=PL.y-H/2;$('#hud').hidden=false;if(touchUI)$('#touch').hidden=false;T=0}
function endRun(){state='over';music('off');$('#hud').hidden=true;$('#touch').hidden=true;endInfo={win:false,cause:CAUSES[runStats.cause]?runStats.cause:'other',over:rnd()*KT.over.length|0};fillEnd();$('#end').hidden=false}
function fillEnd(){if(!endInfo||!PL)return;const zh=LANG==='zh',g=fmtGY(runStats.gold),row=(k,v)=>`<dt>${tr(k)}</dt><dd>${v}</dd>`,eggs=zh?`（≈ ${runStats.gold} 顆蛋）`:` (≈ ${runStats.gold} eggs)`;
 if(!endInfo.win){const cause=CAUSES[endInfo.cause],ov=KT.over[endInfo.over%KT.over.length];
  $('#e1').textContent=tr('DRAFT ANOTHER CONSCRIPT');$('#endH').textContent=tr('DEMOBILIZED (PERMANENTLY)');$('#endP').textContent=zh?`你的壯丁（${PL.c.name}）在第 ${FL+1} 層${cause}。${ov}`:`Your ${PL.c.name.toLowerCase()} was ${cause} on floor ${FL+1}. ${ov}`;
  $('#endS').innerHTML=row('Floor reached',zh?`第 ${FL+1} 層：${FLOORS[FL].name}`:`${FL+1}: ${FLOORS[FL].name}`)+row('Level',PL.lvl)+row('Enemies dispatched',runStats.kills)+row('Legendaries found',runStats.legend)+row('Gold earned',g+eggs)}
 else{const k=runStats.kills;$('#endH').textContent=tr('UNDEFEATED. EVACUATED.');
  $('#endP').textContent=zh?`六層樓、${k} 名敵軍、零敗績，你還是上了船。政府已經「暫時」遷往台灣。反攻大陸排定在明年。每一年都是明年。`:`Six floors, ${k} ${k===1?"enemy":"enemies"}, zero defeats, and you still ended up on the boat. The government has relocated to Taiwan "temporarily". The counterattack is scheduled for next year. Every year.`;
  $('#endS').innerHTML=row('Class',PL.c.name)+row('Level',PL.lvl)+row('Enemies dispatched',k)+row('Legendaries found',runStats.legend)+row('Gold earned',endInfo.loot()+eggs)+row('Value on arrival',tr('1 rice wine'));
  $('#e1').textContent=tr('COUNTERATTACK (NEXT YEAR)')}
 $('#e2').textContent=tr('TITLE')}
function winRun(){const lootN='¥'+fmtBig(runStats.gold*inflation()),loot=()=>lootN+(LANG==='zh'?' 金圓券':' GY');
 const seq=END_SEQ.map((_,i)=>({get date(){return END_SEQ[i].date},get place(){return END_SEQ[i].place},draw:END_SEQ[i].draw,get fact(){return END_SEQ[i].fact},get joke(){return END_SEQ[i].joke.replace('{LOOT}',loot())}}));
 const run=k=>{if(k<seq.length){showScene(seq[k],()=>run(k+1));return}
  state='over';endInfo={win:true,loot};fillEnd();$('#end').hidden=false};
 run(0)}
$('#e1').onclick=()=>{$('#end').hidden=true;$('#title').hidden=false;state='title'};
$('#e2').onclick=()=>{$('#end').hidden=true;$('#title').hidden=false;state='title'};
function showScene(sc,done){state='scene';scene={sc,t:0,done};music('ending');$('#touch').hidden=true;$('#hud').hidden=true}
function startRun(cls){initAudio();$('#title').hidden=true;FL=0;runStats={kills:0,legend:0,gold:0,cause:''};perkQ=0;newHero(cls);showScene(SCENES[0].pre,startFloor)}
document.querySelectorAll('.cls').forEach(b=>b.onclick=()=>startRun(b.dataset.c));
function togglePause(){if(state==='play'){state='pause';music('off')}else if(state==='pause'){state='play';music(FLOORS[FL].music)}}
$('#bPause').onclick=e=>{togglePause();e.currentTarget.blur()};$('#bBag').onclick=e=>{openBag();e.currentTarget.blur()};
$('#bSnd').onclick=e=>{initAudio();setMute(!muted);sndLabel();e.currentTarget.blur()};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='play')togglePause()});

/* ---------------- input ---------------- */
const kb={},tch={},pressed={};let stickV={x:0,y:0};
const KM={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',Space:'atk',KeyJ:'atk',Digit1:'s1',Digit2:'s2',Digit3:'s3',Digit4:'s4',KeyF:'pot',KeyQ:'pot',KeyI:'bag',KeyB:'bag',Enter:'atk'};
const held=k=>kb[k]||tch[k];
addEventListener('keydown',e=>{if(e.code==='Escape'){if(!$('#bag').hidden){$('#bagClose').click();return}if(state==='play'||state==='pause')togglePause();return}if(e.code==='KeyP'){togglePause();return}if(e.code==='KeyL'&&!e.repeat&&!e.ctrlKey&&!e.metaKey&&!e.altKey){applyLang(LANG==='zh'?'en':'zh',true);return}
 if(state==='title'||!$('#end').hidden||!$('#perk').hidden||!$('#camp').hidden)return;if(e.code==='KeyI'&&!$('#bag').hidden){$('#bagClose').click();return}
 const k=KM[e.code];if(!k)return;e.preventDefault();if(!e.repeat&&!kb[k])pressed[k]=1;kb[k]=1;if(k==='atk'||k.startsWith('s'))kbAim=true;initAudio()});
addEventListener('keyup',e=>{const k=KM[e.code];if(k)kb[k]=0});
function toWorld(ev){const rc=cv.getBoundingClientRect();mouse.x=(ev.clientX-rc.left)/rc.width*W;mouse.y=(ev.clientY-rc.top)/rc.height*H}
cv.addEventListener('contextmenu',e=>e.preventDefault());
cv.addEventListener('mousedown',e=>{initAudio();toWorld(e);kbAim=false;if(state==='scene'||state==='tally'){pressed.atk=1;return}if(e.button===2){mouse.r=true;mouse.rPress=true}else{mouse.l=true;mouse.lPress=true;mouse.lPress0=!!enemyAt(mouse.x+camX,mouse.y+camY)}});
addEventListener('mouseup',e=>{if(e.button===2)mouse.r=false;else mouse.l=false});
cv.addEventListener('mousemove',e=>{toWorld(e)});
let touchUI=false;const tpad=$('#touch'),sBase=$('#stickBase'),sKnob=$('#stickKnob');let stickId=null,sx0=0,sy0=0;const btnT={};
if(matchMedia('(pointer:coarse)').matches)touchUI=true;
addEventListener('touchstart',()=>{if(!touchUI){touchUI=true;if(state==='play')tpad.hidden=false}},{passive:true});
tpad.addEventListener('touchstart',e=>{e.preventDefault();initAudio();for(const t of e.changedTouches){const b=t.target.closest&&t.target.closest('.tb');
 if(b){const k=b.dataset.k;btnT[t.identifier]=k;tch[k]=true;pressed[k]=1;b.classList.add('on');continue}
 if(t.clientX<innerWidth*.5&&stickId==null){stickId=t.identifier;sx0=t.clientX;sy0=t.clientY;sBase.hidden=false;sBase.style.left=sx0+'px';sBase.style.top=sy0+'px';sKnob.style.transform=''}}},{passive:false});
tpad.addEventListener('touchmove',e=>{e.preventDefault();for(const t of e.changedTouches)if(t.identifier===stickId){const dx=clamp(t.clientX-sx0,-50,50),dy=clamp(t.clientY-sy0,-50,50);stickV={x:Math.abs(dx)<6?0:dx/50,y:Math.abs(dy)<6?0:dy/50};sKnob.style.transform=`translate(${dx}px,${dy}px)`}},{passive:false});
function tEnd(e){e.preventDefault();for(const t of e.changedTouches){if(t.identifier===stickId){stickId=null;stickV={x:0,y:0};sBase.hidden=true}const k=btnT[t.identifier];if(k){tch[k]=false;delete btnT[t.identifier];document.querySelector(`.tb[data-k=${k}]`).classList.remove('on')}}}
tpad.addEventListener('touchend',tEnd,{passive:false});tpad.addEventListener('touchcancel',tEnd,{passive:false});
cv.addEventListener('touchstart',()=>{pressed.atk=1},{passive:true});
function fit(){const vw=innerWidth,vh=innerHeight;const s=Math.min(vw/W,vh/H);cv.style.width=Math.floor(W*s)+'px';cv.style.height=Math.floor(H*s)+'px'}
addEventListener('resize',fit);

/* ---------------- loop ---------------- */
fit();
let last=performance.now(),acc=0;
function attract(){ctx.fillStyle='#0a0706';ctx.fillRect(0,0,W,H);sceneArt('table',T);ctx.drawImage(VIG,0,0)}
function loop(nt){acc+=Math.min(100,nt-last);last=nt;
 while(acc>=16.67){acc-=16.67;
  if(state==='play'){update();if(PL){const tx=PL.x-W/2,ty=PL.y-H/2-10;camX+=(tx-camX)*.12;camY+=(ty-camY)*.12;mouse.wx=mouse.x+camX;mouse.wy=mouse.y+camY}}
  else if(state==='scene'){scene.t++;T++;if(scene.t%3===0&&scene.t<500)SFX.type();const adv=pressed.atk||pressed.s1||pressed.pot;for(const k in pressed)delete pressed[k];if(adv){if(!scene.complete)scene.t=9999;else{const d=scene.done;scene=null;d()}}}
  else{T++;for(const k in pressed)delete pressed[k]}}
 if(state==='scene'&&scene)scene.complete=drawScene(scene.sc,scene.t);
 else if(state==='title')attract();
 else if(PL&&map&&state!=='over')render();
 requestAnimationFrame(loop)}
(document.fonts?document.fonts.load(F):Promise.resolve()).catch(()=>{}).finally(()=>requestAnimationFrame(loop));
