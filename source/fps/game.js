/* ===================== CIVIL SLUG: VILLAGE SIEGE (first person) ===================== */
const MAP=[
"################################",
"#p..k...#.....r.....#WWWW#....r#",
"#.......#..........v#W..W#.....#",
"#..r....P....#####..#W..W#..g..#",
"#.......#....#...#..##.##......#",
"#..v.....r...#.h.#.......L.....#",
"#.......#....##.##.............#",
"###.#####.........a.....#QQ#...#",
"#.....s...........m.....#..#.n.#",
"#.L.....#PP#...........##..##..#",
"#.......#..#..n...o.......r....#",
"#..g....#..#.........#FF#......#",
"##.###########..b....#..#..v...#",
"#......r.....#.......#..#......#",
"#..k.........P....n..##.##.x...#",
"#....h.......#.................#",
"#####...########FF.##########..#",
"#...........................r..#",
"#..x.....r.......x........L....#",
"#.......................T......#",
"#...v..........................#",
"################################"];
const MW=MAP[0].length,MH=MAP.length;
const FW={pistol:{name:'C96 MAUSER',rate:13,dmg:2,spread:.014,sfx:'shot'},tommy:{name:'TOMMY GUN',rate:5,dmg:1.6,spread:.05,sfx:'hmg',ak:'tommy'},bazooka:{name:'BAZOOKA',rate:44,rocket:1,sfx:'rocket',ak:'bazooka'}};
const WORDER=['pistol','tommy','bazooka'];
const KT=TEXT.kmt,LT=KT.levels[0];
const FCRIES=["DIE! CCP MTFK!","DIE! CCP MTFK!","DIE! CCP MTFK!","EAT LEAD, RED BANDITS!","FOR MY PAYCHECK!"];

let grid=[],ents=[],props=[],pows=[],pickups=[],eproj=[],pproj=[],fx=[],wpops=[],scorchMap=new Map();
let px=1.5,py=1.5,pa=0,dirX=1,dirY=0,plX=0,plY=.66,hz=H/2;
let lives=2,score=0,kills=0,freed=0,speakers=0,radioQ=[],radioCur=null,boss=null,winT=0,checkpoint={x:1.5,y:1.5,a:0},shake=0,flashA=0,flashC='#fff',hitstop=0,stats={lost:0,defects:0};
let shoutTxt='',shoutT=0,cryCD=0,killTimes=[],scene=null,tally=null,msgs={},bobP=0,lookDX=0,mouseDown=false,stickV={x:0,y:0},nextLife=30000;
const zbuf=new Float32Array(W);
function setAngle(){dirX=Math.cos(pa);dirY=Math.sin(pa);plX=-dirY*.66;plY=dirX*.66}

/* ---------------- level ---------------- */
function loadStage(){grid=[];ents=[];props=[];pows=[];pickups=[];eproj=[];pproj=[];fx=[];wpops=[];scorchMap=new Map();boss=null;winT=0;radioQ=[];radioCur=null;
 kills=0;freed=0;speakers=0;stats={lost:0,defects:0,t0:0};T=0;msgs={};shoutT=0;cryCD=0;
 MAP.forEach((row,y)=>{const g=[];[...row].forEach((c,x)=>{const cx=x+.5,cy=y+.5;
  if('#PQWF'.includes(c)){g.push(c);return}g.push('.');
  if(c==='p'){px=cx;py=cy;pa=0;checkpoint={x:cx,y:cy,a:0}}
  else if('rngos'.includes(c))ents.push(mkEnemy({r:'rifle',n:'runner',g:'grenadier',o:'officer',s:'surrender'}[c],cx,cy));
  else if(c==='m')ents.push(mkEnemy('nest',cx,cy));
  else if(c==='v')pows.push({x:cx,y:cy,st:'tied',t:0});
  else if(c==='L')props.push({p:'pole',x:cx,y:cy,hp:8,rad:.28,block:true,cool:120+rnd()*120,flash:0});
  else if(c==='k')props.push({p:'crate',x:cx,y:cy,rad:.38,block:true});
  else if(c==='x')props.push({p:'barrel',x:cx,y:cy,hp:3,rad:.3,block:true,flash:0});
  else if(c==='T')boss={x:cx,y:cy,hp:170,max:170,flash:0,cool:120,mg:200,burst:0,plate:0,dead:false,dt:0,active:false,spawn:300,muzz:0};
  else if(c==='h')pickups.push({x:cx,y:cy,k:'rice'});else if(c==='a')pickups.push({x:cx,y:cy,k:'T'});else if(c==='b')pickups.push({x:cx,y:cy,k:'R'})});grid.push(g)});
 P={x:px,y:py,hp:100,wpn:'pistol',ammo:{tommy:0,bazooka:0},gren:4,cool:0,muzz:0,kick:0,slashT:0,throwT:0,hurtT:0,happyT:0,dead:0,inv:0,moving:false};setAngle()}
function mkEnemy(t,x,y){const hp={rifle:4,runner:3,grenadier:4,officer:6,nest:16,surrender:1}[t];
 if(t==='rifle'&&rnd()<.08)t='surrender';
 return{kind:'enemy',t,x,y,hp,max:hp,alert:false,cool:50+rnd()*90,aimT:0,atk:0,flash:0,anim:0,dead:false,dt:0,id:ents.length+1,shout:0,shoutTxt:'',los:false,strafe:rnd()<.5?1:-1,burst:0,muzzT:0,throwT:0}}
const solidAt=(x,y)=>{const r_=grid[y|0];if(!r_)return true;const c=r_[x|0];return c===undefined||c!=='.'};
function blocked(x,y,r,self){if(solidAt(x-r,y-r)||solidAt(x+r,y-r)||solidAt(x-r,y+r)||solidAt(x+r,y+r))return true;
 for(const p of props)if(p.block&&!p.dead&&p!==self&&Math.hypot(p.x-x,p.y-y)<r+p.rad)return true;
 if(boss&&!boss.dead&&self!==boss&&Math.hypot(boss.x-x,boss.y-y)<r+.7)return true;return false}
function moveE(e,dx,dy,r){if(!blocked(e.x+dx,e.y,r,e))e.x+=dx;if(!blocked(e.x,e.y+dy,r,e))e.y+=dy}
function los(x0,y0,x1,y1){const d=Math.hypot(x1-x0,y1-y0),n=Math.ceil(d/.15);for(let i=1;i<n;i++){const t=i/n;if(solidAt(x0+(x1-x0)*t,y0+(y1-y0)*t))return false}return true}
function rayDist(a){const cx=Math.cos(a),cy=Math.sin(a);let d=0;while(d<26){d+=.03;if(solidAt(px+cx*d,py+cy*d))return d-.03}return 26}

/* ---------------- messages ---------------- */
function radio(s){if(s)radioQ.push(s)}
function once(k,s){if(!msgs[k]){msgs[k]=1;radio(s)}}
function wpop(x,y,s,c='#ffd24a',life=100,z=.95){wpops.push({x,y,z,s,c,life})}
function addScore(n){score=Math.max(0,score+n);if(score>=nextLife){nextLife+=40000;lives++;SFX.oneup();radio('HQ: An extra conscript has been delivered. Do not ask from where.')}}
function cry(force){if(P.dead||(!force&&cryCD>0))return;shoutTxt=pick(FCRIES);shoutT=80;cryCD=300}

/* ---------------- combat ---------------- */
function spark(x,y,z,kind){const cols=kind==='blood'?['#8a1c14','#b02a1e','#5a120c']:kind==='wall'?['#8a7656','#c9b9a0','#ffe27a']:['#fff','#ffe27a','#ffb04a'];
 for(let i=0;i<(kind==='blood'?8:5);i++)fx.push({x,y,z,vx:(rnd()-.5)*.04,vy:(rnd()-.5)*.04,vz:.01+rnd()*.03,life:20+rnd()*15,c:pick(cols),s:.025,g:.0025})}
function smokeAt(x,y,z,n,big){for(let i=0;i<n;i++)fx.push({x:x+(rnd()-.5)*.3,y:y+(rnd()-.5)*.3,z,vx:(rnd()-.5)*.004,vy:(rnd()-.5)*.004,vz:.004+rnd()*.004,life:60+rnd()*50,max:110,c:'smoke',s:big?.12:.06,g:0,grow:.0012})}
function explode(x,y,r,dmg,friendly,big){SFX.boom(big);shake=Math.max(shake,big?12:8);flashA=Math.max(flashA,.5);flashC='#fff4d0';if(big)hitstop=4;
 for(let i=0;i<(big?50:34);i++){const a=rnd()*6.28,s=rnd()*.06;fx.push({x,y,z:.15+rnd()*.3,vx:Math.cos(a)*s,vy:Math.sin(a)*s,vz:.01+rnd()*.05,life:16+rnd()*24,c:pick(['#fff','#fff3b0','#ffd24a','#ff8a1a','#ff5a1a','#c8372d']),s:.05+rnd()*.06,g:.002,fire:1})}
 for(let i=0;i<10;i++)fx.push({x,y,z:.2,vx:(rnd()-.5)*.08,vy:(rnd()-.5)*.08,vz:.03+rnd()*.05,life:50,c:pick(['#3a2c20','#5a4632','#2a2420']),s:.03,g:.003});
 smokeAt(x,y,.3,big?14:9,true);scorchMap.set((y|0)*64+(x|0),1);
 const lit=[];for(const e of ents){if(e.dead)continue;const d=Math.hypot(e.x-x,e.y-y);if(d<r&&(friendly||true))hurtEnemy(e,Math.ceil(dmg*(1-d/r))+2,true)}
 for(const p of props)if(!p.dead&&p.hp&&Math.hypot(p.x-x,p.y-y)<r)lit.push(p);
 for(const p of lit)hitProp(p,5);
 if(boss&&boss.active&&!boss.dead&&Math.hypot(boss.x-x,boss.y-y)<r+.7&&friendly)hitBoss(dmg);
 const pd=Math.hypot(P.x-x,P.y-y);if(pd<r)hurtP(Math.ceil((friendly?.45:1)*dmg*2.6*(1-pd/r))+(friendly?0:6),'boom')}
function hurtEnemy(e,d,boom){if(e.dead)return;e.alert=true;
 if(e.t==='surrender'&&!e.ally){killE(e,'penalty');return}if(e.ally)return;
 e.hp-=d;e.flash=6;SFX.hit();spark(e.x,e.y,.45,'blood');if(e.hp<=0)killE(e,boom?'boom':'')}
function killE(e,why){e.dead=true;e.dt=0;e.boom=why==='boom';
 if(why==='penalty'){addScore(-500);wpop(e.x,e.y,'-500. EVEN THIS WAR HAS PAPERWORK','#ff6a5a');return}
 kills++;const pts={runner:150,grenadier:200,officer:1000,nest:800}[e.t]||100;addScore(pts);SFX.scream();
 killTimes.push(T);killTimes=killTimes.filter(t=>T-t<150);if(killTimes.length>=3){cry();killTimes=[]}
 for(let i=0;i<10;i++)fx.push({x:e.x,y:e.y,z:.45,vx:(rnd()-.5)*.05,vy:(rnd()-.5)*.05,vz:.02+rnd()*.03,life:30,c:pick(['#8a1c14','#b02a1e','#5a120c']),s:.03,g:.003});
 fx.push({x:e.x,y:e.y,z:.75,vx:(e.x-P.x)*.01,vy:(e.y-P.y)*.01,vz:.05,life:90,c:PAL.ccp.h,s:.09,g:.003,hat:1});
 if(e.t==='nest')explode(e.x,e.y,1.2,6,true);
 if(e.t==='officer'){pickups.push({x:e.x,y:e.y,k:'gold'});wpop(e.x,e.y,KT.officer,'#ffd24a',150)}
 else if(rnd()<.45)wpop(e.x,e.y,pick(KT.kills));
 if(kills===12)radio(LT.mid)}
function hitProp(p,d){if(p.dead||!p.hp)return;p.hp-=d;p.flash=6;SFX.clang();if(p.hp<=0){p.dead=true;
 if(p.p==='barrel'){setTimeout(()=>{if(state==='play'||state==='pause')explode(p.x,p.y,1.9,14,true,true)},80)}
 else if(p.p==='pole'){speakers++;addScore(500);explode(p.x,p.y,.8,3,true);wpop(p.x,p.y,'SPEAKER SILENCED. SLOGANS CONTINUE ELSEWHERE','#9fe0a0',150,1.3)}}}
function hitBoss(d){if(!boss||boss.dead||!boss.active)return;boss.hp-=d;boss.flash=4;if(T%3===0)SFX.clang();
 const ph=Math.min(PLATES.length-1,Math.floor((1-boss.hp/boss.max)*4)+1);if(boss.hp>0&&ph!==boss.plate){boss.plate=ph;wpop(boss.x,boss.y,'OWNERSHIP TRANSFERRED','#ffd24a',140,1.4)}
 if(boss.hp<=0){boss.dead=true;boss.dt=0;hitstop=12;flashA=1;music('off');addScore(10000)}}
function hurtP(d,why){if(P.dead||P.inv>0||winT)return;P.hp-=d;P.hurtT=30;flashA=Math.max(flashA,.4);flashC='#c8372d';shake=Math.max(shake,5);SFX.hit();
 if(P.hp<=0){P.hp=0;P.dead=1;SFX.die();stats.lost++;radio(pick(['HQ: Conscript down. Notify next of kin. Bill them for the uniform.','HQ: We have lost a conscript. Check his pockets for our ammunition.']))}}
function targets(){const out=[];for(const e of ents)if(!e.dead&&!e.ally)out.push({o:e,rad:e.t==='nest'?.45:.32,hit:d=>hurtEnemy(e,d)});
 for(const p of props)if(!p.dead&&p.hp)out.push({o:p,rad:p.rad,hit:d=>hitProp(p,d)});
 if(boss&&boss.active&&!boss.dead)out.push({o:boss,rad:.85,hit:d=>hitBoss(d)});
 for(const w of eproj)if(w.k==='word')out.push({o:w,rad:.4,hit:()=>{if(--w.hp<=0){w.dead=1;spark(w.x,w.y,w.z,'metal');wpop(w.x,w.y,'SLOGAN REFUTED','#9fe0a0',60,.6)}}});
 for(const v of pows)if(v.st==='tied')out.push({o:v,rad:.25,hit:()=>freePow(v)});
 return out}
function shoot(ang,dmg){const cx=Math.cos(ang),cy=Math.sin(ang),wd=rayDist(ang);let best=null,bd=wd;
 for(const t of targets()){const rx=t.o.x-px,ry=t.o.y-py,al=rx*cx+ry*cy;if(al<=.1||al>=bd)continue;const pp=Math.abs(-rx*cy+ry*cx);if(pp<t.rad+.05+al*.006){best=t;bd=al}}
 const hx=px+cx*bd,hy=py+cy*bd;if(best){best.hit(dmg);if(best.o.kind!=='enemy')spark(hx,hy,.45,'metal')}else spark(hx-cx*.06,hy-cy*.06,.25+rnd()*.4,'wall')}
function nearestFoe(maxD,cone){let best=null,bd=maxD;for(const e of ents){if(e.dead||e.ally||e.t==='nest')continue;const rx=e.x-px,ry=e.y-py,d=Math.hypot(rx,ry);if(d>bd)continue;
 const a=Math.atan2(ry,rx)-pa,da=Math.abs(((a+Math.PI*3)%(Math.PI*2))-Math.PI);if(da<cone){best=e;bd=d}}return best}
function alertNear(r){for(const e of ents)if(!e.dead&&!e.alert){const d=Math.hypot(e.x-px,e.y-py);if(d<r&&(d<4||los(e.x,e.y,px,py)))alertE(e)}}
function alertE(e){e.alert=true;if(rnd()<.5&&e.t!=='nest'){e.shout=90;e.shoutTxt=pick(TAUNTS.ccp)}}
function fire(){const k=nearestFoe(1.15,.45);
 if(k){P.slashT=14;P.cool=18;SFX.knife();hurtEnemy(k,7);return}
 const w=FW[P.wpn];if(w.ak&&P.ammo[w.ak]<=0){P.wpn='pistol';return}
 if(w.ak)P.ammo[w.ak]--;P.cool=w.rate;P.muzz=4;P.kick=w.rocket?12:P.wpn==='tommy'?3:6;flashA=Math.max(flashA,.1);flashC='#ffd890';SFX[w.sfx]();if(!w.rocket)SFX.shell();alertNear(8);
 if(w.rocket){pproj.push({k:'rocket',x:px+dirX*.4,y:py+dirY*.4,z:.42,vx:dirX*.16,vy:dirY*.16,life:220});shake=4}
 else shoot(pa+(rnd()-.5)*w.spread*(P.moving?1.8:1),w.dmg);
 if(w.ak&&P.ammo[w.ak]<=0){P.wpn='pistol';wpop(px+dirX,py+dirY,KT.noammo,'#ff9a6a',90,.7)}}
function throwGren(){if(P.gren<=0)return;P.gren--;P.throwT=18;SFX.throw();pproj.push({k:'gren',x:px+dirX*.3,y:py+dirY*.3,z:.55,vx:dirX*.085,vy:dirY*.085,vz:.05,fuse:80,f:1});if(rnd()<.4)cry()}
function freePow(v){if(v.st!=='tied')return;v.st='free';v.t=0;v.say=POW_LINES[freed%POW_LINES.length];freed++;addScore(500);SFX.pick();P.happyT=60;
 pickups.push({x:v.x,y:v.y,k:['G','rice','T','R'][(freed-1)%4]})}

/* ---------------- update ---------------- */
function update(){
 if(hitstop>0){hitstop--;return}
 T++;if(shake>0)shake-=.5;if(flashA>0)flashA=Math.max(0,flashA-.06);if(cryCD>0)cryCD--;if(shoutT>0)shoutT--;
 if(T===50)cry(true);if(T===2)radio(LT.start);if(T===480)radio(LT.start2);
 if(radioCur){if(--radioCur.t<=0)radioCur=null}else if(radioQ.length){const s=radioQ.shift();radioCur={s,t:120+s.length*3|0};radioCur.max=radioCur.t;SFX.radio()}
 updPlayer();for(const k in pressed)delete pressed[k];
 for(const e of ents)updEnemy(e);ents=ents.filter(e=>!e.gone&&!(e.dead&&e.dt>900));
 updProps();updBoss();updProj();updFx();
 if(winT>0&&++winT>220){startTally()}}
function updPlayer(){
 if(P.inv>0)P.inv--;if(P.hurtT>0)P.hurtT--;if(P.happyT>0)P.happyT--;if(P.slashT>0)P.slashT--;if(P.throwT>0)P.throwT--;if(P.muzz>0)P.muzz--;if(P.kick>0)P.kick*=.7;
 if(P.dead){P.dead++;if(P.dead>130){if(--lives<0){gameOver();return}px=checkpoint.x;py=checkpoint.y;pa=checkpoint.a;setAngle();Object.assign(P,{x:px,y:py,hp:100,dead:0,inv:150,gren:Math.max(P.gren,3)});wpop(px+dirX*1.5,py+dirY*1.5,pick(KT.respawn),'#ffd24a',150,.8);P.cryAt=T+60}return}
 if(P.cryAt===T)cry(true);
 let fwd=(held('fwd')?1:0)-(held('back')?1:0)-stickV.y,str=(held('sr')?1:0)-(held('sl')?1:0)+stickV.x;fwd=clamp(fwd,-1,1);str=clamp(str,-1,1);
 pa+=((held('tr')?1:0)-(held('tl')?1:0))*.045+lookDX;lookDX=0;setAngle();
 const sp=.055,mx=(dirX*fwd-dirY*str*.85)*sp,my=(dirY*fwd+dirX*str*.85)*sp;P.x=px;P.y=py;moveE(P,mx,my,.22);px=P.x;py=P.y;
 P.moving=Math.abs(fwd)+Math.abs(str)>.15;if(P.moving){bobP+=.18;if(Math.floor(bobP/Math.PI)!==Math.floor((bobP-.18)/Math.PI))noise(.05,.05,400)}
 if(P.cool>0)P.cool--;if((held('fire')||mouseDown)&&P.cool<=0)fire();
 if(pressed.gren)throwGren();
 if(pressed.swap){let i=WORDER.indexOf(P.wpn);for(let k=0;k<3;k++){i=(i+1)%3;const w=WORDER[i];if(w==='pistol'||P.ammo[FW[w].ak]>0){P.wpn=w;break}}SFX.clang()}
 for(const [k,w] of [['w1','pistol'],['w2','tommy'],['w3','bazooka']])if(pressed[k]&&(w==='pistol'||P.ammo[FW[w].ak]>0))P.wpn=w;
 for(const p of pickups)if(!p.dead&&Math.hypot(p.x-px,p.y-py)<.55){p.dead=1;P.happyT=50;
  if(p.k==='rice'){P.hp=Math.min(100,P.hp+35);wpop(p.x,p.y,KT.food+' +35',"#9fe0a0");SFX.pick()}
  else if(p.k==='gold'){addScore(3000);wpop(p.x,p.y,'+3000 GOLD (CONFISCATED)');SFX.pick()}
  else if(p.k==='G'){P.gren+=4;wpop(p.x,p.y,'GRENADES +4');SFX.pick()}
  else{const w=p.k==='T'?'tommy':'bazooka';P.ammo[w]+=p.k==='T'?120:6;P.wpn=w;wpop(p.x,p.y,FW[w].name+'!');SFX.weapon();if(p.k==='T')once('drop',LT.drop)}}
 pickups=pickups.filter(p=>!p.dead);
 for(const v of pows)if(v.st==='tied'&&Math.hypot(v.x-px,v.y-py)<.8)freePow(v);
 if(py>16.6&&checkpoint.y<16){checkpoint={x:px,y:py,a:pa};if(boss&&!boss.active){boss.active=true;radio(LT.boss);SFX.alarm();music('boss');cry(true);wpop(boss.x,boss.y,'THE TANK OF MANY OWNERS','#ff6a5a',200,1.5)}}}
function updEnemy(e){
 if(e.dead){e.dt++;return}
 if(e.flash>0)e.flash--;if(e.shout>0)e.shout--;if(e.muzzT>0)e.muzzT--;if(e.throwT>0)e.throwT--;if(e.atk>0)e.atk--;
 const dx=px-e.x,dy=py-e.y,d=Math.hypot(dx,dy)||1,ux=dx/d,uy=dy/d;
 if((T+e.id)%8===0)e.los=d<15&&los(e.x,e.y,px,py);
 if(e.ally){e.fade=(e.fade||0)+1;moveE(e,-ux*.02,-uy*.02,.24);e.anim++;if(e.fade>140)e.gone=true;return}
 if(!e.alert){if(e.los&&d<9)alertE(e);return}
 if(P.dead)return;
 let mv=0,sx=0;
 switch(e.t){
 case 'rifle':if(!e.los||d>6)mv=1;else if(d<2.6)mv=-.7;sx=e.los?e.strafe*.5:0;
  if(e.aimT>0){mv=0;sx=0;if(--e.aimT===0)eShoot(e,.1,9)}else if(--e.cool<=0&&e.los&&d<12){e.aimT=24;e.cool=110+rnd()*90}break;
 case 'runner':mv=2.2;if(d<.8&&e.atk<=0){hurtP(15);e.atk=55;SFX.knife();e.shout=40;e.shoutTxt='BANZ— I MEAN, CHARGE!'}break;
 case 'grenadier':if(!e.los||d>7)mv=1;else if(d<4)mv=-.6;if(--e.cool<=0&&e.los&&d<9){e.throwT=20;setTimeout(()=>{if(!e.dead)throwE(e)},150);e.cool=180+rnd()*80}break;
 case 'officer':if(!e.los||d>8)mv=.8;else if(d<6)mv=-.6;if(e.aimT>0){mv=0;if(--e.aimT===0)eShoot(e,.085,7)}else if(--e.cool<=0&&e.los&&d<13){e.aimT=18;e.cool=120+rnd()*60}break;
 case 'nest':if(e.burst>0){if(T%8===0){e.burst--;eShoot(e,.12,6,.09)}}else if(--e.cool<=0&&e.los&&d<12){e.burst=5;e.cool=140}break;
 case 'surrender':mv=d>.8?.6:0;if(d<.95){e.ally=true;stats.defects++;addScore(300);wpop(e.x,e.y,pick(DEFECT),'#fff',120,1)}break}
 if(rnd()<.008)e.strafe*=-1;
 const sp=.016;const vx=(ux*mv-uy*sx)*sp,vy=(uy*mv+ux*sx)*sp;
 if(e.t!=='nest'&&(vx||vy)){const ox=e.x,oy=e.y;moveE(e,vx,vy,.24);for(const o of ents)if(o!==e&&!o.dead&&Math.hypot(o.x-e.x,o.y-e.y)<.45){e.x+=(e.x-o.x)*.04;e.y+=(e.y-o.y)*.04}
  if(Math.hypot(e.x-ox,e.y-oy)>.003)e.anim++}}
function eShoot(e,spd,dmg,spread=.05){const a=Math.atan2(py-e.y,px-e.x)+(rnd()-.5)*spread;eproj.push({k:'bullet',x:e.x+Math.cos(a)*.35,y:e.y+Math.sin(a)*.35,z:.4,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,dmg,life:220});e.muzzT=6;SFX.eshot()}
function throwE(e){const d=Math.hypot(px-e.x,py-e.y),t=Math.max(20,d/.06),g=.0035;eproj.push({k:'gren',x:e.x,y:e.y,z:.6,vx:(px-e.x)/t,vy:(py-e.y)/t,vz:g*t/2-.6/t,fuse:t+25});SFX.throw()}
function updProps(){for(const p of props){if(p.flash>0)p.flash--;if(p.p==='pole'&&!p.dead){const d=Math.hypot(p.x-px,p.y-py);if(d<11&&--p.cool<=0&&los(p.x,p.y,px,py)){p.cool=200+rnd()*80;const a=Math.atan2(py-p.y,px-p.x);eproj.push({k:'word',t:pick(SLOGANS.ccp),x:p.x,y:p.y,z:.9,vx:Math.cos(a)*.04,vy:Math.sin(a)*.04,hp:2,dmg:8,life:400});SFX.word();once('truck',LT.truck)}}}}
function updBoss(){const b=boss;if(!b||!b.active)return;if(b.flash>0)b.flash--;if(b.muzz>0)b.muzz--;
 if(b.dead){b.dt++;if(b.dt%8===0&&b.dt<100)explode(b.x+(rnd()-.5)*1.2,b.y+(rnd()-.5)*.6,.6,0,true,b.dt%24===0);if(b.dt===104){explode(b.x,b.y,1.8,0,true,true);flashA=1;radio(LT.win);SFX.fanfare();winT=1;wpop(b.x,b.y,'TANK CAPTURED. REPAINT SCHEDULED. AGAIN.','#ffd24a',240,1.5)}return}
 if(P.dead)return;const tx=clamp(px,4,27),dx=tx-b.x;if(Math.abs(dx)>.6){const nx=b.x+Math.sign(dx)*.012;if(!blocked(nx,b.y,.7,b))b.x=nx;if(T%14===0)SFX.engine()}
 const seen=los(b.x,b.y,px,py);
 if(--b.cool<=0&&seen){const a=Math.atan2(py-b.y,px-b.x);eproj.push({k:'shell',x:b.x+Math.cos(a)*.8,y:b.y+Math.sin(a)*.8,z:.5,vx:Math.cos(a)*.07,vy:Math.sin(a)*.07,life:300});b.cool=150-(b.hp<b.max/2?40:0);b.muzz=8;SFX.boom();shake=5}
 if(--b.mg<=0){b.burst=6;b.mg=190}if(b.burst>0&&T%7===0&&seen){b.burst--;eShoot(b,.12,6,.1)}
 if(b.hp<b.max*.55&&--b.spawn<=0&&ents.filter(e=>!e.dead).length<6){const e=mkEnemy('runner',29.5,17.5);e.alert=true;ents.push(e);b.spawn=320}}
function updProj(){
 for(const b of eproj){if(b.dead)continue;b.x+=b.vx;b.y+=b.vy;if(--b.life<=0){b.dead=1;continue}
  if(b.k==='gren'){b.vz-=.0035;b.z+=b.vz;if(b.z<0){b.z=0;b.vz*=-.3;b.vx*=.5;b.vy*=.5}if(solidAt(b.x,b.y)){b.x-=b.vx;b.y-=b.vy;b.vx*=-.5;b.vy*=-.5}if(--b.fuse<=0){b.dead=1;explode(b.x,b.y,1.6,12,false)}continue}
  if(b.k==='word'){const a=Math.atan2(py-b.y,px-b.x);b.vx+=Math.cos(a)*.002;b.vy+=Math.sin(a)*.002;const s=Math.hypot(b.vx,b.vy);if(s>.045){b.vx*=.045/s;b.vy*=.045/s}}
  if(solidAt(b.x,b.y)){b.dead=1;if(b.k==='shell')explode(b.x-b.vx,b.y-b.vy,1.5,12,false,true);else spark(b.x-b.vx,b.y-b.vy,b.z,'wall');continue}
  if(!P.dead&&Math.hypot(b.x-px,b.y-py)<(b.k==='shell'?.45:.3)){b.dead=1;if(b.k==='shell')explode(b.x,b.y,1.5,12,false,true);else{hurtP(b.dmg);if(b.k==='word')wpop(px+dirX,py+dirY,'HIT BY A SLOGAN','#ff6a5a',60,.6)}}}
 eproj=eproj.filter(b=>!b.dead);
 for(const b of pproj){if(b.dead)continue;b.x+=b.vx;b.y+=b.vy;
  if(b.k==='gren'){b.vz-=.0035;b.z+=b.vz;if(b.z<0){b.z=0;b.vz*=-.3;b.vx*=.6;b.vy*=.6}if(solidAt(b.x,b.y)){b.x-=b.vx;b.y-=b.vy;b.vx*=-.5;b.vy*=-.5}
   let hit=false;for(const e of ents)if(!e.dead&&!e.ally&&Math.hypot(e.x-b.x,e.y-b.y)<.35&&b.z<.8)hit=true;if(--b.fuse<=0||hit){b.dead=1;explode(b.x,b.y,1.8,12,true)}continue}
  if(T%2===0)smokeAt(b.x,b.y,b.z,1,false);b.vx*=1.02;b.vy*=1.02;
  let hit=solidAt(b.x,b.y)||--b.life<=0;for(const e of ents)if(!e.dead&&!e.ally&&Math.hypot(e.x-b.x,e.y-b.y)<.4)hit=true;for(const p of props)if(!p.dead&&p.block&&Math.hypot(p.x-b.x,p.y-b.y)<p.rad+.1)hit=true;
  if(boss&&boss.active&&!boss.dead&&Math.hypot(boss.x-b.x,boss.y-b.y)<.85)hit=true;
  if(hit){b.dead=1;explode(b.x-b.vx,b.y-b.vy,1.6,12,true,true)}}
 pproj=pproj.filter(b=>!b.dead)}
function updFx(){for(const p of fx){p.x+=p.vx;p.y+=p.vy;p.z+=p.vz;p.vz-=p.g;p.life--;if(p.grow)p.s+=p.grow;if(p.z<0){p.z=0;p.vz*=-.3;p.vx*=.5;p.vy*=.5}}fx=fx.filter(p=>p.life>0);if(fx.length>700)fx.splice(0,fx.length-700);
 for(const p of wpops){p.life--;p.z+=.004}wpops=wpops.filter(p=>p.life>0);
 for(const v of pows)if(v.st==='free'){v.t++;if(v.t>140){const a=Math.atan2(v.y-py,v.x-px);const o={x:v.x,y:v.y};moveE(o,Math.cos(a)*.03,Math.sin(a)*.03,.2);v.x=o.x;v.y=o.y}if(v.t>320)v.st='gone'}}

/* ---------------- render: sky + floor (pixel buffer), walls, sprites ---------------- */
const img=ctx.createImageData(W,H),buf=new Uint32Array(img.data.buffer);
const rgb=(r,g,b)=>0xff000000|(b<<16)|(g<<8)|r;
const hex=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const mix=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
const SKYC=[hex('#1c1420'),hex('#4a2a2c'),hex('#a0533a'),hex('#d07040')];
const skyRow=new Uint32Array(H);
const M1=new Uint8Array(1024),M2=new Uint8Array(1024);{const R_=seeded(46);let a=30,b=18;for(let i=0;i<1024;i++){a=clamp(a+(R_()-.5)*5,12,48);b=clamp(b+(R_()-.5)*4,6,26);M1[i]=a;M2[i]=b}}
const FOGC=hex('#1a1210'),FLOOR=[hex('#4a382a'),hex('#3a2c20'),hex('#6e5640'),hex('#1e1612'),hex('#5a4632')];
const floorPal=[];for(let f=0;f<16;f++){floorPal.push(FLOOR.map(c=>{const m=mix(c,FOGC,Math.min(.85,f/16));return rgb(...m)}))}
const m1c=rgb(...hex('#3a2630')),m2c=rgb(...hex('#2a1c22')),glow=hex('#ff8a3a');
function renderWorld(){
 hz=Math.round(H/2+(P&&P.moving&&!P.dead?Math.abs(Math.sin(bobP))*2:0)+(P&&P.dead?Math.min(40,P.dead/2):0));
 for(let y=0;y<H;y++){const t=clamp(y/hz,0,1);const c=t<.5?mix(SKYC[0],SKYC[1],t*2):t<.85?mix(SKYC[1],SKYC[2],(t-.5)/.35):mix(SKYC[2],SKYC[3],(t-.85)/.15);skyRow[y]=rgb(...c)}
 const rdx0=dirX-plX,rdy0=dirY-plY,rdx1=dirX+plX,rdy1=dirY+plY;
 for(let x=0;x<W;x++){const cxr=2*x/W-1,rdx=dirX+plX*cxr,rdy=dirY+plY*cxr,ang=Math.atan2(rdy,rdx);const i1=((ang/(Math.PI*2)+1)*512|0)&1023,i2=((ang/(Math.PI*2)+1)*1024|0)&1023,h1=M1[i1],h2=M2[i2];
  for(let y=0;y<hz;y++){buf[y*W+x]=y>=hz-h2?m2c:y>=hz-h1?m1c:skyRow[y]}}
 for(let y=hz;y<H;y++){const p=y-hz+.5,rowD=(H*.5)/p,stX=rowD*(rdx1-rdx0)/W,stY=rowD*(rdy1-rdy0)/W;let fxp=px+rowD*rdx0,fyp=py+rowD*rdy0;const fog=Math.min(15,rowD*1.6|0),pal=floorPal[fog];
  for(let x=0;x<W;x++){const cx=fxp|0,cy=fyp|0,tx=((fxp-cx)*16)|0,ty=((fyp-cy)*16)|0,h=((cx*73856093)^(cy*19349663)^(tx*83492791)^(ty*2654435761))>>>0;
   let v=h%23===0?1:h%37===0?2:h%61===0?4:0;if(scorchMap.has(cy*64+cx)){const dx_=fxp-cx-.5,dy_=fyp-cy-.5;if(dx_*dx_+dy_*dy_<.2)v=3}
   buf[y*W+x]=pal[v];fxp+=stX;fyp+=stY}}
 ctx.putImageData(img,0,0);
 // walls
 for(let x=0;x<W;x++){const cxr=2*x/W-1,rdx=dirX+plX*cxr,rdy=dirY+plY*cxr;let mx=px|0,my=py|0;const ddx=Math.abs(1/rdx),ddy=Math.abs(1/rdy);let stx,sty,sdx,sdy,side=0,ch='#';
  if(rdx<0){stx=-1;sdx=(px-mx)*ddx}else{stx=1;sdx=(mx+1-px)*ddx}if(rdy<0){sty=-1;sdy=(py-my)*ddy}else{sty=1;sdy=(my+1-py)*ddy}
  for(let k=0;k<64;k++){if(sdx<sdy){sdx+=ddx;mx+=stx;side=0}else{sdy+=ddy;my+=sty;side=1}const rr=grid[my];ch=rr?rr[mx]:'#';if(ch===undefined)ch='#';if(ch!=='.')break}
  const perp=side===0?sdx-ddx:sdy-ddy,lh=H/perp,top=hz-lh/2;let wx=side===0?py+perp*rdy:px+perp*rdx;wx-=Math.floor(wx);let tx=(wx*64)|0;if((side===0&&rdx>0)||(side===1&&rdy<0))tx=63-tx;
  const tex=ch==='F'?TEX.F[(T>>3)%4]:TEX[ch]||TEX['#'];ctx.drawImage(tex,tx,0,1,64,x,top,1,lh);
  const a=Math.min(.82,perp/11)+(side?.12:0);if(ch!=='F'&&a>.02){ctx.fillStyle=`rgba(20,10,8,${a})`;ctx.fillRect(x,top,1,lh)}
  zbuf[x]=perp}}
function project(x,y,z){const rx=x-px,ry=y-py,inv=1/(plX*dirY-dirX*plY),tx=inv*(dirY*rx-dirX*ry),ty=inv*(-plY*rx+plX*ry);if(ty<=.12)return null;const sc=H/ty;return{sx:(W/2)*(1+tx/ty),sy:hz+sc*(.5-z),sc,ty}}
function billboard(x,y,cv_,wH,z=0){const pr=project(x,y,z);if(!pr)return null;const sh=pr.sc*wH,sw=sh*cv_.width/cv_.height,top=pr.sy-sh,left=pr.sx-sw/2;
 const x0=Math.max(0,Math.floor(left)),x1=Math.min(W,Math.ceil(left+sw));let run=-1;
 for(let c=x0;c<=x1;c++){const vis=c<x1&&pr.ty<zbuf[c];if(vis&&run<0)run=c;if((!vis||c===x1)&&run>=0){const s0=(run-left)/sw*cv_.width,s1=(c-left)/sw*cv_.width;ctx.drawImage(cv_,s0,0,Math.max(.01,s1-s0),cv_.height,run,top,c-run,sh);run=-1}}
 return{...pr,top,sh}}
function renderSprites(){const list=[];
 const dist=(o)=>(o.x-px)**2+(o.y-py)**2;
 for(const e of ents)list.push({o:e,d:dist(e),f:()=>drawEnemyS(e)});
 for(const p of props)if(!(p.dead&&p.p!=='pole'))list.push({o:p,d:dist(p),f:()=>{const fl=p.flash>0&&T%2;const s=p.p==='pole'?PROPS.pole():p.p==='crate'?PROPS.crate():PROPS.barrel();if(p.dead){const b=billboard(p.x,p.y,s.n,.45);return}billboard(p.x,p.y,fl?s.f:s.n,p.p==='pole'?1.35:p.p==='crate'?.55:.5)}});
 for(const v of pows)if(v.st!=='gone')list.push({o:v,d:dist(v),f:()=>{const s=v.st==='tied'?peasantSprite(true,'cry',0):peasantSprite(false,v.t>140?'scared':'happy',(T>>3)%2);const b=billboard(v.x,v.y,s.n,.8);if(b&&v.st==='free'&&v.t<140)drawBubble(v.say,b.sx,b.top-4);else if(b&&v.st==='tied'&&(T>>5)%3===0&&b.ty<9)txt('HELP!',b.sx-18,b.top-12,'#e9dcc2')}});
 for(const p of pickups)list.push({o:p,d:dist(p),f:()=>billboard(p.x,p.y,PROPS.pickup(p.k).n,.28,.02+Math.abs(Math.sin(T/20))*.04)});
 if(boss)list.push({o:boss,d:dist(boss),f:()=>drawBossS()});
 for(const b of eproj.concat(pproj))list.push({o:b,d:dist(b),f:()=>drawProj(b)});
 list.sort((a,b)=>b.d-a.d);for(const it of list)it.f();
 for(const p of fx){const pr=project(p.x,p.y,p.z);if(!pr||pr.ty<.35)continue;const c=pr.sx|0;if(c<0||c>=W||pr.ty>=zbuf[c])continue;const s=clamp(p.s*pr.sc*.5,1,p.c==='smoke'?26:9);
  if(p.c==='smoke'){ctx.fillStyle=`rgba(58,48,46,${Math.max(0,p.life/(p.max||100))*.5})`;ctx.fillRect(pr.sx-s/2|0,pr.sy-s/2|0,s|0||1,s|0||1)}
  else if(p.hat){r(pr.sx-s,pr.sy-s/3,s*2,s*.7,p.c);r(pr.sx-s*1.3,pr.sy+s*.3,s*2.6,Math.max(1,s*.25),'#111')}
  else r(pr.sx-s/2,pr.sy-s/2,s,s,p.fire&&p.life<10?'#4a3a33':p.c)}
 ctx.save();ctx.globalCompositeOperation='lighter';for(const p of fx)if(p.fire&&p.life>8){const pr=project(p.x,p.y,p.z);if(!pr||pr.ty>=zbuf[clamp(pr.sx|0,0,W-1)])continue;const s=Math.min(30,p.s*pr.sc*1.6);ctx.fillStyle='rgba(255,140,40,.15)';ctx.fillRect(pr.sx-s/2,pr.sy-s/2,s,s)}ctx.restore();
 for(const p of wpops){const pr=project(p.x,p.y,p.z);if(!pr||pr.ty>12)continue;const c=clamp(pr.sx|0,0,W-1);if(pr.ty>zbuf[c]+.5)continue;if(p.life<20&&T%4<2)continue;const w=p.s.length*8;txt(p.s,clamp(pr.sx,w/2+4,W-w/2-4),pr.sy,p.c,'center')}
 for(const e of ents)if(e.shout>0&&!e.dead){const pr=project(e.x,e.y,1);if(pr&&pr.ty<10&&pr.ty<zbuf[clamp(pr.sx|0,0,W-1)])drawShout(e.shoutTxt,pr.sx,pr.sy-4,false)}}
function drawEnemyS(e){
 if(e.dead){if(e.t==='nest'){const s=PROPS.nest('dead');billboard(e.x,e.y,s.n,.55);return}if(e.dt>800&&T%4<2)return;const s=soldierSprite({fac:'ccp',emo:'dead',gun:e.t==='grenadier'?'grenade':e.t==='officer'?'pistol':'rifle',officer:e.t==='officer',dead:1});billboard(e.x,e.y,s.n,.55);return}
 const fl=e.flash>0&&T%3===0;
 if(e.t==='nest'){const s=PROPS.nest(e.flash>0?'hurt':e.burst>0?'shout':e.alert?'grit':'normal');billboard(e.x,e.y,fl?s.f:s.n,.6);if(e.muzzT>0){const pr=project(e.x,e.y,.35);if(pr)r(pr.sx-pr.sc*.06,pr.sy-pr.sc*.06,pr.sc*.12,pr.sc*.12,'#ffe27a')}return}
 const moving=e.anim%60!==0&&e.alert&&!e.aimT;
 const emo=e.flash>0?'hurt':e.t==='surrender'&&!e.ally?'scared':e.ally?'happy':(e.shout>0||e.t==='runner'&&e.alert)?'shout':(e.aimT>0||e.throwT>0)?'grit':((T+e.id*40)%240<6)?'blink':'normal';
 const s=soldierSprite({fac:'ccp',pose:moving?'run':'idle',frame:(e.anim>>3)%2,emo,gun:e.t==='surrender'?null:e.t==='grenadier'?'grenade':e.t==='officer'?'pistol':'rifle',surr:e.t==='surrender'&&!e.ally,officer:e.t==='officer',item:e.t==='officer'?'board':null,throwing:e.throwT>0,bayo:e.t==='runner',muzz:e.muzzT>2,ally:e.ally});
 billboard(e.x,e.y,fl?s.f:s.n,.8)}
function drawBossS(){const b=boss;if(b.dead&&b.dt>104){const s=PROPS.tank('dead',1);billboard(b.x,b.y,s.n,1.05);return}
 const emo=b.flash>0?'hurt':!b.active?'smug':b.hp<b.max*.35?'scared':b.muzz>0?'shout':'grit';const s=PROPS.tank(emo,b.hp<b.max*.5?1:0);const bb=billboard(b.x,b.y,b.flash>0&&T%2?s.f:s.n,1.05);
 if(bb&&b.muzz>0){r(bb.sx-bb.sh*.12,bb.top+bb.sh*.38,bb.sh*.24,bb.sh*.2,'#ffe27a')}
 if(b.hp<b.max*.5&&T%4===0)smokeAt(b.x,b.y,.9,1,true)}
function drawProj(b){const pr=project(b.x,b.y,b.z);if(!pr)return;const c=clamp(pr.sx|0,0,W-1);if(pr.ty>=zbuf[c])return;const s=pr.sc;
 if(b.k==='bullet'){ctx.save();ctx.globalCompositeOperation='lighter';r(pr.sx-s*.05,pr.sy-s*.05,Math.max(2,s*.1),Math.max(2,s*.1),'#ff6a3d');ctx.fillStyle='rgba(255,120,60,.35)';ctx.fillRect(pr.sx-s*.1,pr.sy-s*.1,s*.2,s*.2);ctx.restore()}
 else if(b.k==='word'){billboard(b.x,b.y,wordSprite(b.t).n,.14,b.z-.07)}
 else if(b.k==='shell'){r(pr.sx-s*.08,pr.sy-s*.08,s*.16,s*.16,'#2a2a26');r(pr.sx-s*.04,pr.sy-s*.04,s*.08,s*.08,'#ff8a1a')}
 else if(b.k==='rocket'){r(pr.sx-s*.05,pr.sy-s*.05,s*.1,s*.1,'#4a5a3a');r(pr.sx-s*.03,pr.sy-s*.03,s*.06,s*.06,'#ffe27a')}
 else if(b.k==='gren'){r(pr.sx-s*.035,pr.sy-s*.06,s*.07,s*.08,'#3a4030');r(pr.sx-s*.015,pr.sy-s*.12,s*.03,s*.06,WOOD)}}

/* ---------------- first-person weapon + HUD ---------------- */
function drawViewmodel(){if(P.dead)return;const bx=Math.sin(bobP)*(P.moving?5:1),by=Math.abs(Math.cos(bobP))*(P.moving?4:1)+P.kick,u=PAL.kmt.u,d=PAL.kmt.d,cx=W/2;
 if(P.slashT>0){const k=1-P.slashT/14,hx=cx+70-k*130,hy=150-Math.sin(k*Math.PI)*30;r(hx+20,hy+20,50,60,u);r(hx,hy,26,22,SK);r(hx+4,hy-30,4,32,'#ddd');r(hx+5,hy-30,2,30,'#fff');ctx.globalAlpha=.6;for(let i=0;i<8;i++)r(hx+10+i*8,hy-40+i*2,6,3,'#fff');ctx.globalAlpha=1;return}
 if(P.throwT>0){const k=P.throwT/18;r(cx-120,110+k*40,26,22,SK);r(cx-114,96+k*40,4,16,WOOD);r(cx-118,90+k*40,12,8,'#3a4030');r(cx-140,128+k*40,40,70,u)}
 const w=P.wpn;
 if(w==='pistol'){const x=cx+24+bx,y=118+by;
  r(x+10,y+56,52,50,u);r(x+8,y+52,56,7,d);r(x+16,y+62,4,40,PAL.kmt.uh);
  r(x+2,y+14,26,18,'#2a2a2a');r(x-3,y+24,11,11,'#2a2a2a');r(x,y+27,5,5,'#120d0c');r(x+2,y+1,14,14,'#333');r(x+4,y+3,10,1,'#555');
  r(x+6,y-30,16,46,'#2f2f2f');r(x+8,y-30,3,46,'#5a5a5a');r(x+19,y-30,2,46,'#1c1c1c');r(x+9,y-36,10,7,'#111');r(x+11,y-34,6,3,'#000');r(x+12,y-40,4,4,'#666');r(x+10,y+12,8,3,'#555');
  r(x,y+30,36,28,SK);r(x+2,y+28,30,2,SK);for(let i=0;i<3;i++)r(x+1,y+37+i*7,22,1,SKS);r(x+22,y+20,12,16,SK);r(x+24,y+21,7,5,'#f0c8a0');r(x+33,y+32,3,24,SKS);
  if(P.muzz>0){r(x+1,y-56,26,22,'#ffe27a');r(x+7,y-50,14,10,'#fff');r(x+13,y-68,2,14,'#ffb04a');r(x-8,y-45,44,2,'#ffb04a')}}
 else if(w==='tommy'){const x=cx-10+bx,y=112+by;r(x-70,y+60,44,60,u);r(x-38,y+30,20,18,SK);r(x-30,y+14,10,18,WOOD);r(x+8,y+56,24,40,WOOD);
  r(x-4,y-4,26,62,'#2a2a2a');r(x-2,y-4,3,62,'#4a4a4a');for(let i=0;i<5;i++)r(x-8+i,y+26+i*2,36-i*2,2,'#333');r(x-12,y+22,40,26,'#333');r(x-10,y+24,36,2,'#4a4a4a');
  r(x+2,y-38,12,36,'#3a3a3a');for(let i=0;i<6;i++)r(x+1,y-34+i*5,14,2,'#222');r(x+3,y-42,10,5,'#111');r(x+20,y+44,22,18,SK);r(x+30,y+58,40,60,u);
  if(P.muzz>0){r(x-4,y-62,24,22,'#ffe27a');r(x+2,y-56,12,10,'#fff');r(x+7,y-74,2,14,'#ffb04a')}}
 else{const x=cx+18+bx,y=96+by;r(x-40,y+80,30,20,SK);r(x-60,y+92,44,40,u);r(x-2,y-28,34,140,'#4a5a3a');r(x,y-28,4,140,'#6a7a52');r(x-6,y+90,46,10,'#3a4a2a');r(x-6,y-34,46,8,'#3a4a2a');r(x+4,y-32,24,4,'#1a2014');
  if(P.ammo.bazooka>0&&P.cool<20)r(x+10,y-32,12,4,'#c8372d');r(x-14,y+20,12,16,'#2a2a2a');r(x-12,y+14,4,8,'#555');
  if(P.muzz>0){r(x-6,y-60,46,30,'#ffe27a');r(x+4,y-52,26,16,'#fff')}}}
function heroEmo(){if(P.dead)return'dead';if(P.hurtT>0)return'hurt';if(shoutT>0)return'shout';if(P.happyT>0)return'happy';if((held('fire')||mouseDown)&&P.wpn!=='pistol')return'grit';if(P.hp<30)return'scared';const c=(T>>6)%8;return T%180<6?'blink':c===3?'lookL':c===6?'lookR':'determined'}
function drawMinimap(){const s=2,ox=W-MW*s-6,oy=30;ctx.globalAlpha=.75;r(ox-2,oy-2,MW*s+4,MH*s+4,'#120d0c');
 for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const c=grid[y][x];if(c!=='.')r(ox+x*s,oy+y*s,s,s,c==='F'?'#ff8a1a':c==='W'?'#6a4a30':'#5b4636')}
 for(const v of pows)if(v.st==='tied')r(ox+v.x*s-1,oy+v.y*s-1,3,3,T%30<15?'#9fe0a0':'#3a6a3a');
 for(const p of props)if(p.p==='pole'&&!p.dead)r(ox+p.x*s-1,oy+p.y*s-1,3,3,'#ff6a5a');
 if(boss&&!boss.dead)r(ox+boss.x*s-2,oy+boss.y*s-1,4,3,'#ffd24a');
 r(ox+px*s-1,oy+py*s-1,3,3,'#fff');seg(ox+px*s,oy+py*s,ox+(px+dirX*2)*s,oy+(py+dirY*2)*s,1,'#fff');ctx.globalAlpha=1}
function drawHUD(){
 // crosshair
 const tgt=nearestFoe(14,.06);const cc=tgt?'#ff4a3a':'#e9dcc2';r(W/2-1,hz-7,2,4,cc);r(W/2-1,hz+3,2,4,cc);r(W/2-7,hz-1,4,2,cc);r(W/2+3,hz-1,4,2,cc);
 r(0,0,W,24,'#120d0cb0');
 const infl=Math.pow(1.6,T/600);txt(`PAY ¥${fmtBig(score*infl)} ≈${score/60|0} EGGS`,4,4,'#ffd24a');
 txt(`${KT.lives} x${Math.max(0,lives)}`,4,14,'#e9dcc2');
 txt(`VILLAGERS ${freed}/4  SPEAKERS ${speakers}/3`,W-4,4,'#9fe0a0','right');
 txt(boss&&boss.dead?'TANK: CAPTURED':boss&&boss.active?'TANK: ENGAGED':'TANK: SOUTH SQUARE',W-4,14,boss&&boss.active?'#ff6a5a':'#a8977c','right');
 drawMinimap();
 // bottom bar
 r(0,H-30,W,30,'#120d0c');r(0,H-30,W,2,'#5b4636');
 const hpC=P.hp>60?'#9fe0a0':P.hp>30?'#ffd24a':'#ff4a3a';txt('MORALE',8,H-26,'#a8977c');txt(`${Math.max(0,Math.ceil(P.hp))}%`,8,H-16,hpC,'left',F16);
 const em=heroEmo(),fs=sprite('hud|'+em,40,28,g=>frontHead(g,'kmt',em));r(W/2-22,H-32,44,32,'#2a1e18');r(W/2-22,H-32,44,1,'#5b4636');ctx.drawImage(fs.n,W/2-20,H-30);
 const w=FW[P.wpn];txt(w.name,W-8,H-26,'#e9dcc2','right');txt(w.ak?String(P.ammo[w.ak]):'∞',W-8,H-16,'#ffd24a','right',F16);txt(`BOMB ${P.gren}`,W-110,H-16,'#ff9a6a','right');
 if(shoutT>0)drawShout(shoutTxt,W/2,H-40,true);
 if(boss&&boss.active&&!boss.dead){const bw=120,bx=W/2-bw/2;r(bx-1,27,bw+2,6,'#120d0c');r(bx,28,bw,4,'#3a1714');r(bx,28,bw*Math.max(0,boss.hp/boss.max),4,'#e0302a');txt('PROPERTY OF: '+PLATES[boss.plate],W/2,35,'#e9dcc2','center')}
 if(radioCur){const Lr=wrap(radioCur.s,36).slice(0,4),h=Lr.length*10+10,x=20,y=boss&&boss.active?46:28,ww=W-40-MW*2-10;
  r(x,y,ww,h,'#120d0ccc');ctx.strokeStyle='#4a6aa3';ctx.lineWidth=1;ctx.strokeRect(x+.5,y+.5,ww-1,h-1);
  const hs=sprite('hud|'+((T>>3)%2?'shout':'determined'),40,28,g=>frontHead(g,'kmt',(T>>3)%2?'shout':'determined'));ctx.drawImage(hs.n,10,0,22,28,x+3,y+3,18,23);
  ctx.font=F;ctx.textAlign='left';ctx.textBaseline='top';const shown=Math.min(radioCur.s.length,(radioCur.max-radioCur.t)*2);let cnt=0;Lr.forEach((l,i)=>{ctx.fillStyle='#e9dcc2';ctx.fillText(l.slice(0,Math.max(0,shown-cnt)),x+24,y+6+i*10);cnt+=l.length+1})}
 if(T<200&&state==='play'){txt('VILLAGE SIEGE',W/2,70,'#ffd24a','center',F16);txt('FREE THE VILLAGERS · SILENCE THE SPEAKERS',W/2,92,'#e9dcc2','center');txt('CAPTURE THE TANK IN THE SOUTH SQUARE',W/2,104,'#a8977c','center')}
 if(winT>30)txt('MISSION COMPLETE!',W/2,80,'#ffd24a','center',F16);
 if(P.dead)txt('YOU HAVE BEEN DEMOBILIZED',W/2,80,'#ff6a5a','center');
 if(state==='pause'){r(0,0,W,H,'#0008');txt('PAUSED',W/2,92,'#ffd24a','center',F16);txt('THE WAR WILL WAIT. IT ALWAYS DOES.',W/2,116,'#e9dcc2','center')}}
const EMB=Array.from({length:30},()=>({x:rnd()*W,y:rnd()*H,v:.2+rnd()*.5,ph:rnd()*6,ash:rnd()<.5}));
function render(){ctx.save();if(shake>0&&!RM)ctx.translate((rnd()-.5)*shake|0,(rnd()-.5)*shake|0);
 renderWorld();renderSprites();
 for(const e of EMB){e.x-=e.v+.1+lookDX*30;e.y+=Math.sin((T+e.ph*60)/50)*.25+(e.ash?.25:-.35);if(e.x<-4||e.y<-4||e.y>H){e.x=W+rnd()*20;e.y=rnd()*H}if(e.x>W+30)e.x=-4;r(e.x,e.y,1,1,e.ash?'rgba(200,190,180,.4)':((T+e.ph*10|0)%20<10?'#ffaa46':'#ff6e28'))}
 if(state!=='title')drawViewmodel();ctx.restore();
 ctx.drawImage(VIG,0,0);if(flashA>0){ctx.globalAlpha=Math.min(1,flashA)*(RM?.3:1);ctx.fillStyle=flashC;ctx.fillRect(0,0,W,H);ctx.globalAlpha=1}
 if(P&&P.hp<30&&!P.dead&&state==='play'){ctx.globalAlpha=.15+Math.sin(T/8)*.08;ctx.fillStyle='#c8372d';ctx.fillRect(0,0,W,H);ctx.globalAlpha=1}
 if(state!=='title')drawHUD()}

/* ---------------- flow ---------------- */
function showScene(sc,done){state='scene';scene={sc,t:0,done};music('ending');$('#touch').hidden=true;$('#hud').hidden=true}
function startGame(){initAudio();lives=2;score=0;nextLife=30000;$('#title').hidden=true;$('#end').hidden=true;loadStage();showScene(SCENES[0].pre,beginPlay)}
function beginPlay(){state='play';T=0;music('m1');$('#hud').hidden=false;if(touchUI)$('#touch').hidden=false;fit()}
function startTally(){state='tally';music('off');SFX.fanfare();$('#touch').hidden=true;$('#hud').hidden=true;try{document.exitPointerLock&&document.exitPointerLock()}catch(e){}
 const bk=kills*50,bp=freed*1000,bs=speakers*800,bn=stats.lost===0?10000:0;
 tally={t:0,rows:[['ENEMIES DISPATCHED',kills,bk],['VILLAGERS UNTIED',freed,bp],['SPEAKERS SILENCED',speakers,bs],['CONSCRIPTS SPENT',stats.lost,bn]],total:bk+bp+bs+bn,rank:stats.lost===0?'HERO OF THE (CORRECT) PEOPLE':stats.lost<2?'DECORATED (TIN MEDAL)':stats.lost<4?'ADEQUATE CANNON FODDER':'STATISTIC'};addScore(tally.total)}
function drawTally(){r(0,0,W,H,'#120d0c');txt('MISSION COMPLETE',W/2,18,'#ffd24a','center',F16);txt('VILLAGE SIEGE',W/2,40,'#a8977c','center');
 tally.rows.forEach((row,i)=>{if(tally.t<20+i*25)return;const y=64+i*18;txt(row[0],30,y,'#e9dcc2');txt(String(Math.min(row[1],(tally.t-20-i*25)>>1)),250,y,'#e9dcc2','right');txt('+'+row[2],W-30,y,'#9fe0a0','right')});
 if(tally.t>130){txt('BONUS',30,142,'#ffd24a');txt('+'+tally.total,W-30,142,'#ffd24a','right');txt('RANK: '+tally.rank,W/2,166,'#ff9a6a','center')}
 if(tally.t>150&&T%40<26)txt('▶ CONTINUE',W/2,194,'#d9a441','center')}
function finish(){state='over';music('ending');const pay=`¥${fmtBig(score*Math.pow(1.6,T/600))} Gold Yuan (≈ ${score/60|0} eggs)`;
 $('#endH').textContent='VILLAGE HELD (FOR NOW)';$('#endP').textContent=LT.win+' The village has changed hands for the fifth time this year. The villagers request a break.';
 $('#endS').innerHTML=`<dt>Enemies dispatched</dt><dd>${kills}</dd><dt>Villagers untied</dt><dd>${freed}/4</dd><dt>Speakers silenced</dt><dd>${speakers}/3</dd><dt>Defectors</dt><dd>${stats.defects}</dd><dt>Conscripts spent</dt><dd>${stats.lost}</dd><dt>Pay</dt><dd>${pay}</dd>`;
 $('#e1').textContent='FIGHT AGAIN';$('#e2').textContent='TITLE';$('#end').hidden=false;$('#hud').hidden=true;endMode='win'}
let endMode='over';
function gameOver(){state='over';music('off');$('#touch').hidden=true;$('#hud').hidden=true;try{document.exitPointerLock&&document.exitPointerLock()}catch(e){}
 $('#endH').textContent='OUT OF CONSCRIPTS';$('#endP').textContent=pick(KT.over);$('#endS').innerHTML=`<dt>Enemies dispatched</dt><dd>${kills}</dd><dt>Villagers untied</dt><dd>${freed}/4</dd><dt>Speakers silenced</dt><dd>${speakers}/3</dd>`;
 $('#e1').textContent='DRAFT 3 MORE';$('#e2').textContent='RESTART';$('#end').hidden=false;endMode='over';if(AC){const t=now();[62,61,60,55].forEach((n,i)=>tone(mf(n),mf(n),.35,'square',.05,t+i*.3))}}
$('#e1').addEventListener('click',()=>{$('#end').hidden=true;if(endMode==='win'){startGame();return}lives=2;state='play';P.dead=0;P.hp=100;P.inv=150;px=checkpoint.x;py=checkpoint.y;pa=checkpoint.a;setAngle();P.x=px;P.y=py;music(boss&&boss.active?'boss':'m1');$('#hud').hidden=false;if(touchUI)$('#touch').hidden=false;wpop(px+dirX*1.5,py+dirY*1.5,'3 MORE DRAFTED. THEIR VILLAGE IS NOW EMPTY','#ffd24a',160,.8)});
$('#e2').addEventListener('click',()=>{$('#end').hidden=true;if(endMode==='win'){toTitle();return}startGame()});
function toTitle(){state='title';$('#title').hidden=false;loadStage();music('off')}
$('#go').addEventListener('click',startGame);
function togglePause(){if(state==='play'){state='pause';music('off')}else if(state==='pause'){state='play';music(boss&&boss.active?'boss':'m1')}}
$('#bPause').addEventListener('click',e=>{togglePause();e.currentTarget.blur()});
$('#bSnd').addEventListener('click',e=>{initAudio();setMute(!muted);e.currentTarget.textContent=muted?'MUTE':'SND';e.currentTarget.blur()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='play')togglePause()});

/* ---------------- input ---------------- */
const kb={},tch={},pressed={};
const KM={KeyW:'fwd',ArrowUp:'fwd',KeyS:'back',ArrowDown:'back',KeyA:'sl',KeyD:'sr',ArrowLeft:'tl',ArrowRight:'tr',KeyJ:'fire',Space:'fire',Enter:'fire',KeyG:'gren',KeyL:'gren',KeyQ:'swap',KeyE:'swap',Digit1:'w1',Digit2:'w2',Digit3:'w3'};
const held=k=>kb[k]||tch[k];
addEventListener('keydown',e=>{if(state==='title'){if(e.code==='Enter'){startGame();e.preventDefault()}return}
 if(e.code==='KeyP'||e.code==='Escape'){if(e.code==='KeyP'||state==='pause')togglePause();return}
 const k=KM[e.code];if(!k)return;if(!$('#end').hidden)return;e.preventDefault();if(!e.repeat&&!kb[k])pressed[k]=1;kb[k]=1;initAudio()});
addEventListener('keyup',e=>{const k=KM[e.code];if(k)kb[k]=0});
cv.addEventListener('mousedown',e=>{initAudio();if(state==='play'){mouseDown=true;try{const p=cv.requestPointerLock&&cv.requestPointerLock();if(p&&p.catch)p.catch(()=>{})}catch(err){}}else pressed.fire=1});
addEventListener('mouseup',()=>mouseDown=false);
addEventListener('mousemove',e=>{if(state!=='play')return;if(document.pointerLockElement===cv)lookDX+=e.movementX*.0032;else if(mouseDown)lookDX+=e.movementX*.006});
let touchUI=false;const tpad=$('#touch'),sBase=$('#stickBase'),sKnob=$('#stickKnob');let stickId=null,sx0=0,sy0=0,lookId=null,lookX=0;const btnT={};
function showTouchUI(){if(touchUI)return;touchUI=true;if(state==='play')tpad.hidden=false;fit()}
if(matchMedia('(pointer:coarse)').matches)touchUI=true;
addEventListener('touchstart',()=>{if(!touchUI)showTouchUI()},{passive:true});
tpad.addEventListener('touchstart',e=>{e.preventDefault();initAudio();for(const t of e.changedTouches){const b=t.target.closest&&t.target.closest('.tb');
 if(b){const k=b.dataset.k;btnT[t.identifier]=k;tch[k]=true;if(k!=='fire')pressed[k]=1;b.classList.add('on');continue}
 if(t.clientX<innerWidth*.45&&stickId==null){stickId=t.identifier;sx0=t.clientX;sy0=t.clientY;sBase.hidden=false;sBase.style.left=sx0+'px';sBase.style.top=sy0+'px';sKnob.style.transform=''}
 else if(lookId==null){lookId=t.identifier;lookX=t.clientX}}},{passive:false});
tpad.addEventListener('touchmove',e=>{e.preventDefault();for(const t of e.changedTouches){if(t.identifier===stickId){const dx=clamp(t.clientX-sx0,-50,50),dy=clamp(t.clientY-sy0,-50,50);stickV={x:Math.abs(dx)<8?0:dx/50,y:Math.abs(dy)<8?0:dy/50};sKnob.style.transform=`translate(${dx}px,${dy}px)`}
 else if(t.identifier===lookId){lookDX+=(t.clientX-lookX)*.009;lookX=t.clientX}}},{passive:false});
function tEnd(e){e.preventDefault();for(const t of e.changedTouches){if(t.identifier===stickId){stickId=null;stickV={x:0,y:0};sBase.hidden=true}else if(t.identifier===lookId)lookId=null;
 const k=btnT[t.identifier];if(k){tch[k]=false;delete btnT[t.identifier];document.querySelector(`.tb[data-k=${k}]`).classList.remove('on')}}}
tpad.addEventListener('touchend',tEnd,{passive:false});tpad.addEventListener('touchcancel',tEnd,{passive:false});
cv.addEventListener('touchstart',()=>{pressed.fire=1},{passive:true});
function fit(){const vw=innerWidth,vh=innerHeight;const s=Math.min(vw/W,vh/H);cv.style.width=Math.floor(W*s)+'px';cv.style.height=Math.floor(H*s)+'px';$('#tHint').textContent=vh>vw?'TURN YOUR PHONE SIDEWAYS':'LEFT THUMB: WALK · RIGHT THUMB: DRAG TO LOOK'}
addEventListener('resize',fit);

/* ---------------- loop ---------------- */
buildTextures();loadStage();fit();
let last=performance.now(),acc=0;
function loop(nt){acc+=Math.min(100,nt-last);last=nt;
 while(acc>=16.67){acc-=16.67;
  if(state==='play')update();
  else if(state==='title'){T++;pa+=.003;setAngle()}
  else if(state==='scene'){scene.t++;T++;if(scene.t%3===0&&scene.t<500)SFX.type();const adv=pressed.fire||pressed.gren||pressed.swap;for(const k in pressed)delete pressed[k];if(adv){if(!scene.complete)scene.t=9999;else{const d=scene.done;scene=null;d()}}}
  else if(state==='tally'){tally.t++;T++;if(tally.t%4===0&&tally.t<120)SFX.tally();const adv=pressed.fire;for(const k in pressed)delete pressed[k];if(adv&&tally.t>60){if(tally.t<150)tally.t=150;else{tally=null;const post=SCENES[0].post;showScene(post,finish)}}}
  else for(const k in pressed)delete pressed[k]}
 if(state==='scene'&&scene)scene.complete=drawScene(scene.sc,scene.t);
 else if(state==='tally'&&tally)drawTally();
 else render();
 requestAnimationFrame(loop)}
(document.fonts?document.fonts.load(F):Promise.resolve()).catch(()=>{}).finally(()=>requestAnimationFrame(loop));
