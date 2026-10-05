/* ===================== DARK YUAN 3D — a Civil Slug third-person souls-like ===================== */
const RW=768,RH=432,TAU=Math.PI*2;
let glOK=true,shake=0,hs=0,fadeA=1;
const lerp=(a,b,t)=>a+(b-a)*clamp(t,0,1);
const angTo=(a,b)=>{let d=(b-a)%TAU;if(d>Math.PI)d-=TAU;if(d<-Math.PI)d+=TAU;return d};
const turn=(a,b,r)=>{const d=angTo(a,b);return a+clamp(d,-r,r)};
const SERIF=s=>`900 ${s}px "Noto Serif TC","Songti TC",Georgia,serif`;
function stxt(s,x,y,c,size,a=1,al='center'){ctx.font=SERIF(size);ctx.textAlign=al;ctx.textBaseline='middle';ctx.globalAlpha=a;ctx.fillStyle='#000';ctx.fillText(s,x+1,y+2);ctx.fillStyle=c;ctx.fillText(s,x,y);ctx.globalAlpha=1}

/* ---------------- map (1 cell = 1 m) ---------------- */
const MW=26,MH=132,grid=[];for(let z=0;z<MH;z++)grid.push(new Array(MW).fill('#'));
const carve=(x0,z0,x1,z1,c='.')=>{for(let z=z0;z<=z1;z++)for(let x=x0;x<=x1;x++)grid[z][x]=c};
carve(8,1,17,8);carve(10,9,15,30);carve(4,17,9,23);carve(5,31,20,42);
carve(0,43,25,56,'~');carve(11,43,14,56,'=');carve(10,57,15,62);
carve(11,63,14,63,'F');carve(5,64,20,79);carve(11,80,14,80,'G');
carve(9,81,16,85);carve(3,86,22,104);carve(3,86,4,104,'~');carve(21,86,22,99,'~');
carve(11,105,14,105,'F');carve(4,106,21,121);carve(11,122,14,122,'G');
carve(0,123,25,131,'~');carve(11,123,14,129,'=');
for(const[x0,z0,x1,z1]of[[5,64,20,79],[4,106,21,121]])for(let k=0;k<3;k++)for(let j=0;j<3-k;j++){grid[z0+k][x0+j]='#';grid[z0+k][x1-j]='#';grid[z1-k][x0+j]='#';grid[z1-k][x1-j]='#'}
for(const[x,z]of[[8,90],[9,90],[15,94],[16,94],[16,95],[7,99],[13,101],[18,36],[6,33],[14,27]])grid[z][x]='c';
const isWall=c=>c==='#'||c==='P'||c==='Q'||c==='W'||c==='c';
const openC=c=>c!==undefined&&!isWall(c);
for(let z=0;z<MH;z++)for(let x=0;x<MW;x++){if(grid[z][x]!=='#')continue;let adj=false;for(const[dx,dz]of[[1,0],[-1,0],[0,1],[0,-1]]){const c=(grid[z+dz]||[])[x+dx];if(openC(c)&&c!=='~')adj=true}
 if(!adj)continue;const h=((x*73856093)^(z*19349663))>>>0;if(z<43)grid[z][x]=h%7===0?'P':h%7===1?'Q':h%3===0?'W':'#';else if(z>85)grid[z][x]=h%3?'W':'#';}
const cell=(x,z)=>{const r_=grid[Math.floor(z)];return r_?r_[Math.floor(x)]:undefined};
const WALLH={'#':2.6,P:2.6,Q:2.6,W:2.2,c:.9};
const FIRES=[{x:12.5,z:3.5,name:'THE CONSCRIPT PIT'},{x:7,z:41,name:'VILLAGE SQUARE'},{x:12.5,z:83.5,name:'FERRY ROAD'},{x:19.5,z:102.5,name:'CUSTOMS HOUSE'}];
const ARENAS=[{k:'ma',fz:63,gz:80,z0:64,z1:79,cx:12.5,cz:72},{k:'bros',fz:105,gz:122,z0:106,z1:121,cx:12.5,cz:114}];
const ZONES=[{z:0,name:'VILLAGE OF THE ROPED',han:'繩村',fog:0x4a2a24},{z:43,name:'THE BRIDGE NOBODY BLEW UP',han:'斷橋',fog:0x3a2a34},{z:81,name:'DOCKS OF THE LAST FERRY',han:'末班渡口',fog:0x1a1c2c}];
const zoneAt=z=>z>=81?2:z>=43?1:0;
const SPAWNS=[['conscript',12,14,'ccp'],['pitch',13.5,18],['conscript',11,24,'kmt'],['rifle',13,29.5,'kmt'],['mimic',5.5,18.5],
 ['conscript',8,34,'ccp'],['pitch',17,33],['gren',18,40,'kmt'],['conscript',15,39,'kmt'],['commissar',12.5,37,'ccp'],
 ['conscript',12.5,54,'ccp'],['rifle',11.5,58.5,'ccp'],['rifle',14.5,60,'kmt'],['shield',12.5,61.5],
 ['shield',12,88],['pitch',17,90],['conscript',8,92,'kmt'],['rifle',18,93,'ccp'],['gren',6,97,'ccp'],['conscript',15,97,'ccp'],['shield',12,100],['conscript',9,103,'kmt']];
const ITEMS=[{id:'t1',x:6,z:22,k:'ticket'},{id:'y1',x:19,z:32,k:'yuan'},{id:'g1',x:6,z:40,k:'gren'},{id:'w1',x:13.5,z:49,k:'whet'},{id:'v1',x:19,z:87.5,k:'vest'},{id:'t2',x:20,z:98,k:'ticket'},{id:'w2',x:5.5,z:102,k:'whet'}];
const IDESC={
 ticket:{n:'RATION TICKET',d:'+1 rice wine flask, refilled at every stove.',f:'Redeemable for one flask of rice wine, or one sip after the next price review.'},
 yuan:{n:'BRICK OF GOLD YUAN',d:'A great deal of money. For now.',f:'Worth a house in August. A bag of rice in October. Kindling by Christmas.'},
 whet:{n:'SHARPENING STONE',d:'+12% dadao damage.',f:'The dadao was sharp once. So was the officer who sold it to you.'},
 gren:{n:'STICK GRENADE POUCH',d:'+1 grenade carried.',f:'German design, local copy, fuse length a matter of faith.'},
 vest:{n:'PADDED COTTON VEST',d:'+15% max morale.',f:'Ordered for winter 1947. Delivered summer 1948.'},
 stamp:{n:'THE GENERAL\'S STAMP',d:'Half of your discharge papers.',f:'Pressed on six thousand execution orders. Now on your discharge. Ink is ink.'},
 stamp2:{n:'THE UNITED FRONT\'S STAMP',d:'The other half. Board the ferry.',f:'Two seals side by side. They do not overlap. They never did.'}};
const MSGS=[
 {x:10,z:2.5,t:['WASD MOVE · MOUSE LOOKS (CLICK TO CAPTURE) · LEFT CLICK ATTACK · U HEAVY','STICK MOVES · DRAG RIGHT SIDE TO LOOK · ATTACK · HEAVY']},
 {x:15,z:2.5,t:['SPACE ROLLS. INVINCIBLE MID-ROLL. HOLD SPACE TO SPRINT.','ROLL: INVINCIBLE MID-ROLL. HOLD ROLL TO SPRINT.']},
 {x:11,z:6,t:['Q LOCKS ON. CIRCLE THEM. THEY TURN SLOWER THAN YOU.','LOCK ON. CIRCLE THEM. THEY TURN SLOWER THAN YOU.']},
 {x:14,z:6,t:['RIGHT CLICK GUARDS. TAP IT AS A BLOW LANDS TO PARRY, THEN ATTACK TO RIPOSTE.','HOLD GUARD TO BLOCK. TAP IT AS A BLOW LANDS TO PARRY, THEN ATTACK.']},
 {x:12.5,z:9.5,t:['E RESTS AT THE TEA STOVE. THE DEAD RETURN. SO DO PRICES. R DRINKS WINE.','USE: REST AT THE STOVE. THE DEAD RETURN. SO DO PRICES.']},
 {x:12,z:12,t:'STRIKE FROM BEHIND: BACKSTAB'},{x:7,z:20,t:'SUPPLIES AHEAD! (TRUST ME)'},{x:12.5,z:31.5,t:'AMAZING COMMISSAR AHEAD'},{x:12.5,z:43.5,t:'BE WARY OF LEFT. AND RIGHT. AND WATER.'},
 {x:12.5,z:62.3,t:'VISIONS OF A GENERAL...'},{x:12.5,z:86.5,t:'PRAISE THE PAYCHECK \\o/'},{x:5.5,z:95,t:'HOLE. ALSO WATER.'},{x:12.5,z:104.3,t:'TWO BROTHERS AHEAD, THEREFORE FIGHT EACH OTHER?'}];
const NEWS=['Prices rose 15% while you rested. Your savings rested too, permanently.','Government assures the Gold Yuan is stable. Rice is now quoted per grain.','New banknotes printed to fix the old banknotes. Prices +15%.','A wheelbarrow of Gold Yuan now buys a smaller wheelbarrow.'];
const TIPS=['Yuan you carry loses value at every rest. Spend it here, now.','Parry: tap guard the moment a blow lands, then attack to riposte.','Lock on and circle-strafe: most enemies turn slower than you.','Dropped yuan inflates away on the ground, 1% a second. Hurry.','Heavy attacks break shields and poise. They also leave you open.','Roll through attacks, not away from them.'];

/* ---------------- progress ---------------- */
let G=null;
function newProgress(ng=0,keep={}){return Object.assign({vig:10,end:10,str:10,yuan:0,inf:1,fire:0,lit:[0],boss:{},taken:[],deaths:0,lost:0,flaskMax:4,grenMax:2,whet:0,vest:0,ng,time:0,kills:0,stain:null,seen:[]},keep)}
const SL=()=>G.vig+G.end+G.str-29;
const maxHP=()=>Math.round((60+G.vig*6)*(1+G.vest*.15)),maxST=()=>50+G.end*5,ATK=()=>(8+G.str*1.25)*(1+G.whet*.12);
const cost=()=>Math.round(450*Math.pow(1.12,SL()-1)*G.inf);
const NGH=()=>1+G.ng*.6,NGD=()=>1+G.ng*.35;
const SAVEK='darkyuan3d.v1';function save(){store.set(SAVEK,G)}

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
 step:lim(()=>noise(.03,.03,400)),lock:()=>tone(1400,1800,.05,'square',.02),
 alert:lim(()=>tone(900,1300,.08,'square',.025)),coin:lim(()=>tone(1800,2400,.06,'square',.03))};
TRACKS.duel={bpm:128,drums:'boss',bass:[0,null,0,null,0,null,1,null,0,null,0,null,-2,null,-1,null],stab:'boss',song:[
 ['Dm',[[0,74,4],[4,77,4],[8,76,2],[10,74,2],[12,73,4]]],['Bb',[[0,74,6],[6,72,2],[8,70,4],[12,69,4]]],['Gm',[[0,70,4],[4,74,4],[8,79,6],[14,77,2]]],['A',[[0,76,4],[4,73,4],[8,69,8]]],
 ['Dm',[[0,81,6],[6,79,2],[8,77,4],[12,76,4]]],['Bb',[[0,77,4],[4,74,4],[8,70,4],[12,74,4]]],['Gm',[[0,79,3],[3,77,1],[4,74,4],[8,70,4],[12,67,4]]],['A',[[0,73,4],[4,76,4],[8,81,6],[14,80,2]]]]};
let AMB=null;
function ambient(){if(!AC||AMB)return;const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain(),s2=AC.createBufferSource(),f2=AC.createBiquadFilter(),g2=AC.createGain();
 s.buffer=NB;s.loop=true;f.type='lowpass';f.frequency.value=320;g.gain.value=.05;s.connect(f).connect(g).connect(MASTER);s.start();
 s2.buffer=NB;s2.loop=true;f2.type='highpass';f2.frequency.value=3500;g2.gain.value=0;s2.connect(f2).connect(g2).connect(MASTER);s2.start();AMB={g,g2}}
function ambSet(){if(!AMB)return;const t=AC.currentTime;AMB.g2.gain.setTargetAtTime(LV===2&&state==='play'?.04:0,t,.5);AMB.g.gain.setTargetAtTime(state==='play'?.05:.015,t,.5)}

/* ---------------- three.js scene ---------------- */
const GLC=$('#gl');let renderer,S3,camera,hemi,sunL,PTS={},waterTex,fogTex,fogMeshes=[],stoveObjs=[],itemSpr={},msgMesh=[],stainSpr,ringMeshes=[],laser,ferry;
const TXC=new Map();
function tex(cv,rep){let t=TXC.get(cv);if(!t){t=new THREE.CanvasTexture(cv);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping}TXC.set(cv,t)}return t}
const LM=(o)=>new THREE.MeshLambertMaterial(o);
const BOX=new THREE.BoxGeometry(1,1,1);
function initGL(){try{renderer=new THREE.WebGLRenderer({canvas:GLC,antialias:true,powerPreference:'high-performance'})}catch(e){glOK=false;return}
 renderer.setPixelRatio(1);glSize();renderer.setClearColor(0x1c1420);
 S3=new THREE.Scene();S3.background=new THREE.Color(0x1c1420);S3.fog=new THREE.Fog(0x4a2a24,7,30);
 camera=new THREE.PerspectiveCamera(60,RW/RH,.05,120);
 hemi=new THREE.HemisphereLight(0xffc8a0,0x3a2418,1.1);S3.add(hemi);
 sunL=new THREE.DirectionalLight(0xffa060,1.1);sunL.position.set(-6,12,-4);S3.add(sunL);S3.add(sunL.target);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;sunL.castShadow=true;const sm_=matchMedia('(pointer:coarse)').matches?1024:2048;sunL.shadow.mapSize.set(sm_,sm_);Object.assign(sunL.shadow.camera,{left:-12,right:12,top:12,bottom:-12,near:1,far:40});sunL.shadow.bias=-.0006;sunL.shadow.normalBias=.02;
 const skyCv=mk(1024,256,g=>{const gr=g.createLinearGradient(0,0,0,256);gr.addColorStop(0,'#1c1420');gr.addColorStop(.5,'#4a2a2c');gr.addColorStop(.74,'#a0533a');gr.addColorStop(.785,'#d07040');gr.addColorStop(.8,'#3a2630');gr.addColorStop(1,'#241a1c');g.fillStyle=gr;g.fillRect(0,0,1024,256);
  g.fillStyle='#ffc890';g.fillRect(612,168,22,22);const R_=seeded(46);let a=24,b=12;for(let x=0;x<1024;x+=2){a=clamp(a+(R_()-.5)*5,8,40);b=clamp(b+(R_()-.5)*4,4,22);R(g,x,201-a,2,a,'#3a2630');R(g,x,203-b,2,b,'#2a1c22')}
  for(let k=0;k<7;k++){const x=40+k*150;for(let i=0;i<14;i++){g.fillStyle=`rgba(30,22,24,${.5-i*.03})`;g.fillRect(x+Math.sin(i/2)*6+i*2,190-i*12,8+i,10)}}for(let i=0;i<60;i++)R(g,R_()*1024|0,R_()*90|0,1,1,'#e9dcc2')});
 const st=tex(skyCv);st.wrapS=THREE.RepeatWrapping;st.repeat.x=2;
 const sky=new THREE.Mesh(new THREE.CylinderGeometry(80,80,70,32,1,true),new THREE.MeshBasicMaterial({map:st,side:THREE.BackSide,fog:false,depthWrite:false}));sky.renderOrder=-1;sky.position.set(13,14,66);S3.add(sky);
 const mkPts=(n,size,opts)=>{const pos=new Float32Array(n*3),col=new Float32Array(n*3),g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('color',new THREE.BufferAttribute(col,3));
  const m=new THREE.PointsMaterial(Object.assign({size,vertexColors:true,sizeAttenuation:true},opts));const p=new THREE.Points(g,m);p.frustumCulled=false;S3.add(p);return{p,pos,col,n,g}};
 PTS.s=mkPts(1200,.07,{});PTS.f=mkPts(600,.16,{blending:THREE.AdditiveBlending,depthWrite:false,transparent:true});
 laser=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3()]),new THREE.LineBasicMaterial({color:0xff3a2a,transparent:true,opacity:.7}));laser.frustumCulled=false;laser.visible=false;S3.add(laser)}
function buildWorld(){buildTextures();buildHD();
 // walls: instanced per type
 const types={};for(let z=0;z<MH;z++)for(let x=0;x<MW;x++){const c=grid[z][x];if(!isWall(c))continue;let vis=false;for(const[dx,dz]of[[1,0],[-1,0],[0,1],[0,-1]])if(openC((grid[z+dz]||[])[x+dx]))vis=true;if(vis)(types[c]=types[c]||[]).push([x,z])}
 const topM=SM({color:0x2a1c18});
 for(const c in types){const h=WALLH[c],geo=new THREE.BoxGeometry(1,h,1),uv=geo.attributes.uv;for(let f=0;f<6;f++){if(f===2||f===3)continue;for(let i=0;i<4;i++){const k=f*4+i;uv.setY(k,uv.getY(k)*h/1.3)}}geo.translate(0,h/2,0);
  const m=SM({map:ltex(HT[c],true),roughness:.9});const mats=[m,m,c==='c'?m:topM,topM,m,m];
  const im=new THREE.InstancedMesh(geo,mats,types[c].length);im.castShadow=true;im.receiveShadow=true;const M=new THREE.Matrix4();types[c].forEach(([x,z],i)=>{M.makeTranslation(x+.5,0,z+.5);im.setMatrixAt(i,M)});S3.add(im)}
 // roof eaves
 const roofCv=mk(32,32,g=>{R(g,0,0,32,32,'#2e2a2c');for(let y=0;y<32;y+=6){R(g,0,y,32,1,'#1a1618');for(let x=(y/6%2)*4;x<32;x+=8)R(g,x,y+1,1,5,'#1a1618')}for(let x=0;x<32;x+=8)R(g,x+2,0,3,32,'rgba(255,255,255,.04)')});
 const eav=[];for(let z=0;z<MH;z++)for(let x=0;x<MW;x++){const c=grid[z][x];if(!isWall(c)||c==='c')continue;for(const[dx,dz]of[[1,0],[-1,0],[0,1],[0,-1]]){const n=(grid[z+dz]||[])[x+dx];if(openC(n)&&n!=='~'&&n!=='F'&&n!=='G')eav.push([x,z,dx,dz,WALLH[c]])}}
 const eg=new THREE.BoxGeometry(1.02,.07,.75);eg.translate(0,0,.3);const eim=new THREE.InstancedMesh(eg,SM({map:ltex(HT.roof,true),roughness:.7}),eav.length);eim.castShadow=true;eim.receiveShadow=true;const M2=new THREE.Matrix4(),Q=new THREE.Quaternion(),E=new THREE.Euler(),Sv=new THREE.Vector3(1,1,1),Pv=new THREE.Vector3();
 eav.forEach(([x,z,dx,dz,h],i)=>{E.set(.5,Math.atan2(dx,dz),0,'YXZ');Q.setFromEuler(E);Pv.set(x+.5+dx*.5,h+.05,z+.5+dz*.5);M2.compose(Pv,Q,Sv);eim.setMatrixAt(i,M2)});S3.add(eim);
 // ground tiles
 const dirt=mk(32,32,g=>{const R_=seeded(3);R(g,0,0,32,32,'#4a382a');for(let i=0;i<40;i++)R(g,R_()*32|0,R_()*32|0,2,1,R_()<.5?'#3a2c20':'#5a4634')});
 const cob=mk(32,32,g=>{R(g,0,0,32,32,'#3e3634');const R_=seeded(5);for(let y=0;y<32;y+=8)for(let x=(y/8%2)*4;x<32;x+=8)R(g,x+1,y+1,6,6,R_()<.5?'#5a5250':'#4e4644')});
 const plank=mk(32,32,g=>{for(let y=0;y<32;y+=8){R(g,0,y,32,8,y%16?'#6a4a30':'#5a3e28');R(g,0,y,32,1,'#2a1a10')}R(g,10,0,1,32,'#3a2818')});
 const tiles={dirt:[],cob:[],plank:[]};for(let z=0;z<MH;z++)for(let x=0;x<MW;x++){const c=grid[z][x];if(c==='~'||isWall(c)&&c!=='c')continue;
  const k=c==='='||z>=86&&z<=104?'plank':(z>=31&&z<=42)||(z>=64&&z<=79)||(z>=106&&z<=121)?'cob':'dirt';tiles[k].push([x,z])}
 const pg=new THREE.PlaneGeometry(1,1);pg.rotateX(-Math.PI/2);
 for(const k in tiles){const im=new THREE.InstancedMesh(pg,SM({map:ltex(HT[k],true),roughness:.95}),tiles[k].length);im.receiveShadow=true;const M=new THREE.Matrix4();tiles[k].forEach(([x,z],i)=>{M.makeTranslation(x+.5,0,z+.5);im.setMatrixAt(i,M)});S3.add(im)}
 // water
 const wcv=mk(32,32,g=>{R(g,0,0,32,32,'#24344e');const R_=seeded(9);for(let i=0;i<18;i++)R(g,R_()*32|0,R_()*32|0,6,1,R_()<.5?'#4a6a90':'#34507a')});waterTex=tex(wcv,true);waterTex.repeat.set(30,140);
 const wm=new THREE.Mesh(new THREE.PlaneGeometry(30,140),new THREE.MeshBasicMaterial({map:waterTex}));wm.rotation.x=-Math.PI/2;wm.position.set(13,-.45,66);S3.add(wm);
 // bridge posts
 for(const[z0,z1]of[[43,56],[123,129]])for(let z=z0;z<=z1;z+=3)for(const x of[11,15]){const m=new THREE.Mesh(BOX,LM({color:0x3a2818}));m.scale.set(.18,1.2,.18);m.position.set(x,-.2,z+.5);S3.add(m)}
 // fog walls
 const fcv=mk(32,64,g=>{const R_=seeded(12);for(let y=0;y<64;y++)for(let x=0;x<32;x+=2){const a=.25+R_()*.35;g.fillStyle=`rgba(240,236,228,${a})`;g.fillRect(x,y,2,1)}});fogTex=tex(fcv,true);
 for(const A of ARENAS)for(const [z,kind] of[[A.fz+.5,'F'],[A.gz+.5,'G']]){const m=new THREE.Mesh(new THREE.PlaneGeometry(4,2.6),new THREE.MeshBasicMaterial({map:fogTex,transparent:true,opacity:.75,depthWrite:false,side:THREE.DoubleSide}));m.position.set(12.5,1.3,z);m.userData={A,kind};S3.add(m);fogMeshes.push(m)}
 // stoves
 FIRES.forEach((f,i)=>{const g=new THREE.Group();g.position.set(f.x,0,f.z);const b=new THREE.Mesh(BOX,LM({color:0x6a4a3a}));b.scale.set(.7,.55,.7);b.position.y=.275;g.add(b);
  const mouth=new THREE.Mesh(BOX,LM({color:0x1a100c}));mouth.scale.set(.4,.25,.05);mouth.position.set(0,.2,.36);g.add(mouth);
  const k=new THREE.Mesh(BOX,LM({color:0x3a3a40}));k.scale.set(.36,.22,.36);k.position.y=.66;g.add(k);
  const rifle=new THREE.Mesh(BOX,LM({color:0x7a5230}));rifle.scale.set(.05,1,.07);rifle.position.set(.5,.45,0);rifle.rotation.z=.2;g.add(rifle);
  const fl=new THREE.Sprite(new THREE.SpriteMaterial({map:tex(flameCv[0]),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));fl.scale.set(.5,.6,1);fl.position.set(0,.3,.42);g.add(fl);
  const L_=new THREE.PointLight(0xff9040,0,9,2);L_.position.set(0,1,0.6);g.add(L_);S3.add(g);stoveObjs.push({g,fl,L:L_})});
 // messages
 const mcv=mk(32,16,g=>{g.fillStyle='rgba(255,154,58,.9)';for(let i=0;i<5;i++){g.fillRect(4+i*5,6+(i%2)*3,4,1);g.fillRect(5+i*5,5+(i%3),1,4)}g.fillRect(3,12,26,1)});
 for(const m of MSGS){const p=new THREE.Mesh(new THREE.PlaneGeometry(.8,.4),new THREE.MeshBasicMaterial({map:tex(mcv),transparent:true,depthWrite:false}));p.rotation.x=-Math.PI/2;p.position.set(m.x,.02,m.z);S3.add(p);msgMesh.push(p)}
 // items
 const icv=mk(16,16,g=>{const gr=g.createRadialGradient(8,8,0,8,8,8);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.3,'rgba(255,250,220,.7)');gr.addColorStop(1,'rgba(255,240,200,0)');g.fillStyle=gr;g.fillRect(0,0,16,16)});
 for(const it of ITEMS){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex(icv),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));s.scale.set(.5,.5,1);s.position.set(it.x,.35,it.z);S3.add(s);itemSpr[it.id]=s}
 const scv=mk(16,16,g=>{const gr=g.createRadialGradient(8,8,0,8,8,8);gr.addColorStop(0,'rgba(220,255,200,1)');gr.addColorStop(.4,'rgba(150,230,120,.6)');gr.addColorStop(1,'rgba(120,200,100,0)');g.fillStyle=gr;g.fillRect(0,0,16,16)});
 stainSpr=new THREE.Sprite(new THREE.SpriteMaterial({map:tex(scv),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));stainSpr.scale.set(.8,.8,1);stainSpr.visible=false;S3.add(stainSpr);
 // ferry
 ferry=new THREE.Group();const hull=new THREE.Mesh(BOX,LM({color:0x4a3220}));hull.scale.set(3,.6,2.2);hull.position.y=-.1;ferry.add(hull);const mast=new THREE.Mesh(BOX,LM({color:0x3a2a20}));mast.scale.set(.12,3,.12);mast.position.y=1.5;ferry.add(mast);
 const sail=new THREE.Mesh(BOX,LM({color:0xd9cfb8}));sail.scale.set(1.6,1.4,.04);sail.position.set(0,1.9,.1);ferry.add(sail);ferry.position.set(12.5,0,131.2);S3.add(ferry);
 // burning houses: flame sprites on some village wall tops
 const R_=seeded(77);for(let z=9;z<43;z++)for(let x=0;x<MW;x++){if(grid[z][x]!=='W'||R_()>.35)continue;const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex(flameCv[0]),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));s.scale.set(1,1.3,1);s.position.set(x+.5,2.8,z+.5);S3.add(s);flameSpr.push(s)}}
const flameCv=[0,1,2,3].map(k=>mk(16,20,g=>{const R_=seeded(30+k*11);for(let x=0;x<16;x+=2){const h=6+R_()*13|0;for(let y=20-h;y<20;y+=2){const t=(y-(20-h))/h;R(g,x,y,2,2,t<.3?'#ffe27a':t<.6?'#ffb04a':'#ff6a1a')}}}));
const flameSpr=[];

/* ---------------- chibi 3D characters ---------------- */
/* ===== HD textures (smooth, mipmapped) ===== */
function ltex(cv,rep){let t=TXC.get(cv);if(!t){t=new THREE.CanvasTexture(cv);t.anisotropy=4;if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping}TXC.set(cv,t)}return t}
const HR=seeded(2024);
function noiseFill(g,w,h,base,amt,n=w*h/6){g.fillStyle=base;g.fillRect(0,0,w,h);for(let i=0;i<n;i++){const v=(HR()-.5)*amt;g.fillStyle=v>0?`rgba(255,240,220,${v})`:`rgba(0,0,0,${-v})`;g.fillRect(HR()*w|0,HR()*h|0,1+HR()*2|0,1+HR()*2|0)}}
function hanT(g,s,x,y,c,size){g.fillStyle=c;g.font=`900 ${size}px "Noto Serif TC","Songti TC",serif`;g.textAlign='center';g.textBaseline='top';[...s].forEach((ch,i)=>g.fillText(ch,x,y+i*(size+2)))}
function brickHD(g,soot){noiseFill(g,128,128,'#3a2a22',.15);for(let row=0;row<11;row++){const y=row*12,off=row%2*16;for(let x=-16;x<128;x+=32){const v=HR();g.fillStyle=`hsl(${14+v*10},${32+v*14}%,${24+v*12}%)`;g.fillRect(x+off+1,y+1,30,10);g.fillStyle='rgba(255,220,180,.08)';g.fillRect(x+off+1,y+1,30,2);g.fillStyle='rgba(0,0,0,.18)';g.fillRect(x+off+1,y+9,30,2)}}
 for(let i=0;i<300;i++){g.fillStyle=`rgba(0,0,0,${HR()*.15})`;g.fillRect(HR()*128|0,HR()*128|0,2,2)}if(soot){const gr=g.createLinearGradient(0,0,0,50);gr.addColorStop(0,'rgba(10,6,4,.75)');gr.addColorStop(1,'rgba(10,6,4,0)');g.fillStyle=gr;g.fillRect(0,0,128,50)}
 const gr2=g.createLinearGradient(0,96,0,128);gr2.addColorStop(0,'rgba(0,0,0,0)');gr2.addColorStop(1,'rgba(20,12,8,.5)');g.fillStyle=gr2;g.fillRect(0,96,128,32)}
function poster(g,x,y,w,h,bg,fg,txt_){g.save();g.translate(x,y);g.rotate((HR()-.5)*.06);g.fillStyle='rgba(0,0,0,.35)';g.fillRect(2,3,w,h);g.fillStyle=bg;g.fillRect(0,0,w,h);g.fillStyle='rgba(255,255,255,.08)';g.fillRect(0,0,w,4);
 for(let i=0;i<40;i++){g.fillStyle=`rgba(0,0,0,${HR()*.2})`;g.fillRect(HR()*w|0,HR()*h|0,3,2)}hanT(g,txt_,w/2,6,fg,Math.min(26,(h-10)/txt_.length-2));g.fillStyle='#3a2a22';g.beginPath();g.moveTo(w,h);g.lineTo(w-8,h);g.lineTo(w,h-10);g.fill();g.restore()}
function woodHD(g){for(let x=0;x<128;x+=16){const v=HR();g.fillStyle=`hsl(${24+v*8},${30+v*10}%,${18+v*10}%)`;g.fillRect(x,0,16,128);for(let i=0;i<14;i++){g.fillStyle='rgba(0,0,0,.18)';g.fillRect(x+2+HR()*12|0,0,1,128)}g.fillStyle='rgba(0,0,0,.5)';g.fillRect(x,0,1,128)}
 g.fillStyle='#1a100a';g.fillRect(36,34,56,46);const gr=g.createRadialGradient(64,57,4,64,57,34);gr.addColorStop(0,'#ffcf80');gr.addColorStop(1,'#a0481a');g.fillStyle=gr;g.fillRect(40,38,48,38);g.fillStyle='#1a100a';g.fillRect(62,38,4,38);g.fillRect(40,55,48,4);g.fillStyle='#4a2e1a';g.fillRect(32,80,64,6)}
let HT=null;
function buildHD(){const b1=mk(128,128,g=>brickHD(g,true));
 HT={'#':b1,
  P:mk(128,128,g=>{brickHD(g,true);poster(g,12,26,40,70,'#2f4f8a','#f2f2f2','戡亂');poster(g,60,18,46,82,'#b8322a','#f1d27a','打倒')}),
  Q:mk(128,128,g=>{brickHD(g,true);poster(g,18,20,54,84,'#b8322a','#f1d27a','土改');poster(g,74,40,38,64,'#2f4f8a','#f2f2f2','救國')}),
  W:mk(128,128,woodHD),
  c:mk(64,64,g=>{noiseFill(g,64,64,'#7a5a35',.2);for(let y=0;y<64;y+=16){g.fillStyle='rgba(0,0,0,.35)';g.fillRect(0,y,64,2)}g.fillStyle='#4a321a';g.fillRect(0,0,64,5);g.fillRect(0,59,64,5);g.fillRect(0,0,5,64);g.fillRect(59,0,5,64);g.fillStyle='rgba(30,20,10,.75)';g.font='bold 13px monospace';g.textAlign='center';g.fillText('US AID',32,37)}),
  dirt:mk(128,128,g=>{noiseFill(g,128,128,'#4a3828',.25,4000);for(let i=0;i<60;i++){g.fillStyle=`rgba(${120+HR()*40|0},${100+HR()*30|0},80,.5)`;g.beginPath();g.arc(HR()*128,HR()*128,1+HR()*2,0,TAU);g.fill()}}),
  cob:mk(128,128,g=>{g.fillStyle='#2a2422';g.fillRect(0,0,128,128);for(let y=0;y<128;y+=16)for(let x=(y/16%2)*8;x<136;x+=16){const v=HR();g.fillStyle=`hsl(20,${6+v*8}%,${26+v*14}%)`;g.beginPath();g.ellipse(x,y+8,7,6.5,0,0,TAU);g.fill();g.fillStyle='rgba(255,255,255,.07)';g.beginPath();g.ellipse(x-1,y+6,5,3,0,0,TAU);g.fill()}}),
  plank:mk(128,128,g=>{for(let y=0;y<128;y+=16){const v=HR();g.fillStyle=`hsl(26,${28+v*10}%,${22+v*10}%)`;g.fillRect(0,y,128,16);for(let i=0;i<10;i++){g.fillStyle='rgba(0,0,0,.15)';g.fillRect(0,y+2+HR()*12|0,128,1)}g.fillStyle='rgba(0,0,0,.6)';g.fillRect(0,y,128,1);g.fillStyle='rgba(0,0,0,.4)';g.fillRect((y*7)%128,y,2,16)}}),
  roof:mk(128,128,g=>{g.fillStyle='#1c1a1c';g.fillRect(0,0,128,128);for(let y=0;y<128;y+=10)for(let x=(y/10%2)*8;x<136;x+=16){const v=HR();g.fillStyle=`hsl(240,4%,${16+v*9}%)`;g.beginPath();g.ellipse(x,y+6,8,6,0,0,Math.PI);g.fill()}})};
 return HT}
/* ===== painted faces ===== */
const FACEC=new Map();
function faceDecal(emo){let c=FACEC.get(emo);if(c)return c;c=mk(128,96,g=>{g.translate(64,46);g.scale(1.18,1.18);g.translate(-64,-46);paintFace(g,emo)});FACEC.set(emo,c);return c}
function paintFace(g,emo){const K='#2a1810',L=34,Rx=94,EY=44;
 const brow=(x,ang,y=EY-16)=>{g.save();g.translate(x,y);g.rotate(ang);g.fillStyle=K;g.beginPath();g.ellipse(0,0,11,3.2,0,0,TAU);g.fill();g.restore()};
 const eye=(x,o={})=>{const h=o.h||9;g.fillStyle='#fffaf0';g.beginPath();g.ellipse(x,EY,8,h,0,0,TAU);g.fill();g.fillStyle=o.iris||'#3a2416';g.beginPath();g.ellipse(x+(o.dx||0),EY+(o.dy||1),o.ir||5.5,Math.min(h,o.ir?o.ir:6.5),0,0,TAU);g.fill();
  g.fillStyle='#120a06';g.beginPath();g.arc(x+(o.dx||0),EY+(o.dy||1),o.pr||3,0,TAU);g.fill();g.fillStyle='#fff';g.beginPath();g.arc(x+(o.dx||0)-2,EY-2,1.8,0,TAU);g.fill();g.strokeStyle=K;g.lineWidth=2.4;g.beginPath();g.ellipse(x,EY,8,h,0,Math.PI*1.05,Math.PI*1.95);g.stroke()};
 const closed=(x,up)=>{g.strokeStyle=K;g.lineWidth=2.6;g.beginPath();if(up)g.arc(x,EY+4,7,Math.PI*1.15,Math.PI*1.85);else g.arc(x,EY-4,7,Math.PI*.15,Math.PI*.85);g.stroke()};
 const blush=(a=.25)=>{for(const x of[L-6,Rx+6]){const gr=g.createRadialGradient(x,EY+16,1,x,EY+16,10);gr.addColorStop(0,`rgba(230,110,90,${a})`);gr.addColorStop(1,'rgba(230,110,90,0)');g.fillStyle=gr;g.fillRect(x-12,EY+4,24,24)}};
 const nose=()=>{g.strokeStyle='rgba(120,60,40,.6)';g.lineWidth=2;g.beginPath();g.moveTo(64,EY+10);g.quadraticCurveTo(60,EY+19,65,EY+20);g.stroke()};
 const mouth=(w,h,teeth,tongue)=>{g.fillStyle='#5a1410';g.beginPath();g.ellipse(64,EY+33,w,h,0,0,TAU);g.fill();if(teeth){g.fillStyle='#fff';g.fillRect(64-w*.7,EY+33-h+1,w*1.4,Math.min(5,h*.5))}if(tongue){g.fillStyle='#d0504a';g.beginPath();g.ellipse(64,EY+33+h*.45,w*.6,h*.35,0,0,TAU);g.fill()}};
 const line=(w,curve=0)=>{g.strokeStyle='#6a2a1e';g.lineWidth=2.6;g.beginPath();g.moveTo(64-w,EY+32);g.quadraticCurveTo(64,EY+32+curve,64+w,EY+32);g.stroke()};
 nose();
 switch(emo){
 case 'dead':for(const x of[L,Rx]){g.strokeStyle=K;g.lineWidth=3;g.beginPath();g.moveTo(x-6,EY-6);g.lineTo(x+6,EY+6);g.moveTo(x+6,EY-6);g.lineTo(x-6,EY+6);g.stroke()}line(10,-4);g.fillStyle='#d0504a';g.beginPath();g.ellipse(70,EY+36,4,5,0,0,TAU);g.fill();break;
 case 'hurt':brow(L,.35);brow(Rx,-.35);for(const[x,s]of[[L,1],[Rx,-1]]){g.strokeStyle=K;g.lineWidth=3;g.beginPath();g.moveTo(x-6*s,EY-5);g.lineTo(x+5*s,EY);g.lineTo(x-6*s,EY+5);g.stroke()}mouth(9,7,1);g.fillStyle='#9fd3ff';g.beginPath();g.ellipse(Rx+14,EY-12,3,5,0,0,TAU);g.fill();break;
 case 'scared':brow(L,.3,EY-20);brow(Rx,-.3,EY-20);eye(L,{h:11,ir:3,pr:2});eye(Rx,{h:11,ir:3,pr:2});g.strokeStyle='#5a1410';g.lineWidth=2.6;g.beginPath();g.moveTo(52,EY+33);for(let i=0;i<6;i++)g.lineTo(54+i*4,EY+33+(i%2?3:-3));g.stroke();g.fillStyle='#9fd3ff';g.beginPath();g.ellipse(Rx+16,EY-6,3,6,0,0,TAU);g.fill();break;
 case 'happy':brow(L,-.1,EY-18);brow(Rx,.1,EY-18);closed(L,true);closed(Rx,true);mouth(11,8,1,1);blush(.45);break;
 case 'cry':brow(L,.35);brow(Rx,-.35);closed(L,false);closed(Rx,false);g.fillStyle='#9fd3ff';g.fillRect(L-2,EY,4,14+(T>>3)%6);g.fillRect(Rx-2,EY,4,14+((T>>3)+3)%6);mouth(9,6);break;
 case 'shout':brow(L,.45,EY-14);brow(Rx,-.45,EY-14);eye(L,{h:7,dy:2});eye(Rx,{h:7,dy:2});mouth(16,15,1,1);blush(.3);break;
 case 'grit':brow(L,.4,EY-14);brow(Rx,-.4,EY-14);eye(L,{h:6});eye(Rx,{h:6});g.fillStyle='#fff';g.fillRect(50,EY+28,28,9);g.strokeStyle='#888';g.lineWidth=1;for(let x=55;x<78;x+=5){g.beginPath();g.moveTo(x,EY+28);g.lineTo(x,EY+37);g.stroke()}g.beginPath();g.moveTo(50,EY+32.5);g.lineTo(78,EY+32.5);g.stroke();g.strokeStyle='#6a2a1e';g.lineWidth=2;g.strokeRect(50,EY+28,28,9);break;
 case 'determined':brow(L,.3,EY-15);brow(Rx,-.3,EY-15);eye(L,{h:7.5});eye(Rx,{h:7.5});line(8,2);break;
 case 'blink':case 'sleep':brow(L,0);brow(Rx,0);closed(L,false);closed(Rx,false);line(7,3);break;
 case 'smug':brow(L,-.05,EY-17);brow(Rx,.25,EY-14);eye(L,{h:5,dy:1});eye(Rx,{h:5,dy:1});g.strokeStyle='#6a2a1e';g.lineWidth=2.6;g.beginPath();g.moveTo(54,EY+33);g.quadraticCurveTo(66,EY+36,76,EY+28);g.stroke();break;
 default:brow(L,.05);brow(Rx,-.05);eye(L);eye(Rx);line(7,3)}}
/* ===== character builder ===== */
const GEO={};const geo=(k,f)=>GEO[k]||(GEO[k]=f());
const SPH=()=>geo('s',()=>new THREE.SphereGeometry(1,22,16));
const HEMI=()=>geo('h',()=>{const g=new THREE.SphereGeometry(1,22,12,0,TAU,0,Math.PI*.55);g.rotateX(-Math.PI/2.4);return g});
const CY=(t,b,n=18)=>geo('c'+t+'|'+b+'|'+n,()=>new THREE.CylinderGeometry(t,b,1,n));
const CYZ=(t,b,n=12)=>geo('z'+t+'|'+b+'|'+n,()=>{const g=new THREE.CylinderGeometry(t,b,1,n);g.rotateX(Math.PI/2);return g});
const CONE=(r,n=16)=>geo('k'+r+n,()=>new THREE.ConeGeometry(r,1,n));
const LIMB=(t,b,len)=>geo('l'+t+b+len,()=>{const g=new THREE.CylinderGeometry(t,b,len,14);g.translate(0,-len/2,0);return g});
const LATHE=(k,pts,n=22)=>geo(k,()=>new THREE.LatheGeometry(pts.map(([x,y])=>new THREE.Vector2(x,y)),n));
const TORSO=()=>LATHE('torso',[[0,0],[.13,0],[.15,.04],[.14,.14],[.165,.25],[.18,.33],[.16,.39],[.1,.43],[0,.44]]);
const HEM=()=>LATHE('hem',[[.15,.02],[.16,-.04],[.185,-.13]]);
const FACEP=()=>geo('facep',()=>new THREE.SphereGeometry(1.02,18,14,Math.PI/2-.82,1.64,Math.PI/2-.62,1.18));
const DADAO=()=>geo('dadao',()=>{const sh=new THREE.Shape();sh.moveTo(0,-.03);sh.lineTo(.42,-.05);sh.quadraticCurveTo(.6,-.075,.68,-.07);sh.lineTo(.7,.0);sh.quadraticCurveTo(.66,.045,.6,.05);sh.lineTo(0,.03);sh.lineTo(0,-.03);
 const g=new THREE.ExtrudeGeometry(sh,{depth:.012,bevelEnabled:true,bevelThickness:.006,bevelSize:.008,bevelSegments:2});g.translate(0,0,-.006);g.rotateY(-Math.PI/2);return g});
const DISC=(r)=>geo('d'+r,()=>new THREE.CircleGeometry(r,24));
function part(par,g,mat,sx,sy,sz,x,y,z){const m=new THREE.Mesh(g,mat);m.scale.set(sx,sy,sz);m.position.set(x,y,z);m.castShadow=true;par.add(m);return m}
const starCv=mk(32,32,g=>{g.fillStyle='#e0302a';g.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?6:14;g.lineTo(16+Math.cos(a)*rr,16+Math.sin(a)*rr)}g.fill()});
const sunCv=mk(32,32,g=>{g.fillStyle='#2f4f8a';g.beginPath();g.arc(16,16,15,0,TAU);g.fill();g.fillStyle='#f2f2f2';g.beginPath();for(let i=0;i<24;i++){const a=i*Math.PI/12,rr=i%2?6:11;g.lineTo(16+Math.cos(a)*rr,16+Math.sin(a)*rr)}g.fill();g.fillStyle='#2f4f8a';g.beginPath();g.arc(16,16,5,0,TAU);g.fill();g.fillStyle='#f2f2f2';g.beginPath();g.arc(16,16,3.6,0,TAU);g.fill()});
const yenCv=mk(32,32,g=>{g.fillStyle='#d9a441';g.font='bold 26px serif';g.textAlign='center';g.fillText('¥',16,26)});
const shadowCv=mk(64,64,g=>{const gr=g.createRadialGradient(32,32,3,32,32,32);gr.addColorStop(0,'rgba(0,0,0,.45)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,64,64)});
const clothCv=mk(64,64,g=>{g.fillStyle='#fff';g.fillRect(0,0,64,64);const R_=seeded(8);for(let i=0;i<900;i++){g.fillStyle=`rgba(0,0,0,${R_()*.08})`;g.fillRect(R_()*64|0,R_()*64|0,1,R_()*4|0)}for(let y=0;y<64;y+=2){g.fillStyle='rgba(0,0,0,.03)';g.fillRect(0,y,64,1)}});
const SM=(p)=>new THREE.MeshStandardMaterial(Object.assign({roughness:.85,metalness:0},p));
function mkChar(o){const s=o.s||1,fac=o.fac,pc=PAL[fac]||PAL.civ,mats=[];const M_=(p)=>{const m=SM(p);mats.push(m);return m};
 const cloth=ltex(clothCv,true);
 const root=new THREE.Group(),spin=new THREE.Group(),rig=new THREE.Group();spin.position.y=.75;rig.position.y=-.75;root.add(spin);spin.add(rig);
 const sh=new THREE.Mesh(DISC(.45),new THREE.MeshBasicMaterial({map:ltex(shadowCv),transparent:true,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.position.y=.015;root.add(sh);
 const body=o.civ?(o.cl||0x6a5a40):new THREE.Color(pc.u).getHex(),dark=o.civ?(o.cl2||0x4a3e2c):new THREE.Color(pc.d).getHex(),pant=o.civ?dark:new THREE.Color(pc.p).getHex();
 const mBody=M_({color:body,map:cloth}),mDark=M_({color:dark,map:cloth}),mPant=M_({color:pant,map:cloth}),mSkin=M_({color:SK,roughness:.6}),mBoot=M_({color:0x2a1d14,roughness:.5}),mBelt=M_({color:o.civ?0xa07a42:0x4a2e18,roughness:.5}),mGold=M_({color:0xd9a441,metalness:.6,roughness:.35}),mPutt=M_({color:o.civ?new THREE.Color(SK).getHex():0x8a7a5a,map:cloth});
 const hips=new THREE.Group();hips.position.y=.52;rig.add(hips);
 // legs: thigh + knee + shin + boot
 const legs=[],knees=[];for(const sx of[-1,1]){const g=new THREE.Group();g.position.set(sx*.085,0,0);hips.add(g);
  part(g,LIMB(.075,.06,.26),mPant,1,1,1,0,0,0);const k=new THREE.Group();k.position.y=-.25;g.add(k);part(k,SPH(),mPant,.062,.062,.062,0,0,0);
  part(k,LIMB(.058,.05,.22),mPutt,1,1,1,0,0,0);part(k,SPH(),mBoot,.062,.05,.115,0,-.235,.035);legs.push(g);knees.push(k)}
 const upper=new THREE.Group();upper.position.y=.52;rig.add(upper);
 part(upper,TORSO(),mBody,1,1,.78,0,-.02,0);if(!o.civ||o.cl)part(upper,HEM(),mBody,1,1,.82,0,-.02,0);
 part(upper,CY(1,1,22),mBelt,.152,.04,.122,0,.02,0);part(upper,BOX,mGold,.05,.035,.015,0,.02,.123);
 if(!o.civ){for(const y of[.12,.2,.28])part(upper,SPH(),mGold,.011,.011,.008,0,y,.128+(y-.12)*.12);for(const sx of[-1,1]){const pk=part(upper,BOX,mDark,.07,.055,.014,sx*.075,.27,.13);pk.rotation.x=-.12}}
 else part(upper,BOX,mDark,.025,.32,.015,.04,.2,.12);
 part(upper,CY(1,1.1),mDark,.075,.05,.07,0,.43,0);
 if(o.officer){for(const sx of[-1,1])part(upper,BOX,mGold,.07,.015,.06,sx*.16,.39,0);const sa=part(upper,BOX,M_({color:0xb8322a,map:cloth}),.035,.42,.015,0,.2,.135);sa.rotation.z=.6}
 // head
 const headG=new THREE.Group();headG.position.y=.44;upper.add(headG);
 part(headG,CY(1,1),mSkin,.05,.07,.05,0,.03,0);
 const hd=part(headG,SPH(),mSkin,.19,.205,.19,0,.17,0);
 part(headG,HEMI(),M_({color:0x2a1a12,roughness:.9}),.196,.21,.196,0,.17,-.005);
 for(const sx of[-1,1])part(headG,SPH(),mSkin,.028,.045,.025,sx*.185,.15,-.01);
 const fm=new THREE.MeshStandardMaterial({map:ltex(faceDecal('normal')),transparent:true,alphaTest:.3,depthWrite:false,roughness:.7});mats.push(fm);
 const face=new THREE.Mesh(FACEP(),fm);face.scale.set(.19,.205,.19);face.position.set(0,.17,0);headG.add(face);
 part(headG,SPH(),M_({color:0xd89a78,roughness:.6}),.022,.02,.02,0,.135,.185);
 const capHex=fac==='civ'?'#262630':fac==='uni'?'#5a3a6a':pc.h,mCap=M_({color:capHex,map:cloth}),mBrim=M_({color:0x141414,roughness:.4});
 if(fac==='kmt'||fac==='uni'){part(headG,CY(1,.92,24),mCap,.19,.09,.19,0,.32,0);part(headG,CY(1.3,1,24),mCap,.2,.05,.2,0,.385,0);part(headG,CY(1,1,24),M_({color:0x111111}),.195,.03,.195,0,.29,0);
  part(headG,SPH(),mBrim,.13,.012,.09,0,.29,.15);const em=new THREE.Mesh(DISC(1),new THREE.MeshBasicMaterial({map:ltex(sunCv),transparent:true,alphaTest:.4}));em.scale.set(.04,.04,1);em.position.set(0,.345,.197);em.rotation.x=-.1;headG.add(em)}
 else if(fac==='ccp'){part(headG,CY(.95,1,24),mCap,.19,.11,.19,0,.33,0);part(headG,SPH(),mCap,.19,.035,.19,0,.385,0);part(headG,SPH(),M_({color:new THREE.Color(pc.hs).getHex()}),.12,.012,.08,0,.285,.155);
  const st=new THREE.Mesh(DISC(1),new THREE.MeshBasicMaterial({map:ltex(starCv),transparent:true,alphaTest:.4}));st.scale.set(.045,.045,1);st.position.set(0,.34,.19);headG.add(st)}
 else if(fac==='civ'){part(headG,CY(1.12,1,24),mCap,.195,.09,.195,0,.33,0);part(headG,CY(1,1,24),M_({color:0xd9d0c0}),.192,.022,.192,0,.3,0);part(headG,SPH(),mBrim,.13,.012,.09,0,.285,.15);part(headG,SPH(),mGold,.02,.02,.008,0,.34,.2)}
 else if(fac==='straw'){part(headG,CY(1,1,30),M_({color:0xc9a65a,roughness:.95}),.42,.018,.42,0,.33,0);part(headG,CONE(1,24),M_({color:0xb8954a,roughness:.95}),.2,.17,.2,0,.42,0)}
 // arms: shoulder + upper arm + elbow + forearm + hand
 const arms=[],elbows=[];for(const sx of[-1,1]){const g=new THREE.Group();g.position.set(sx*.2,.37,0);upper.add(g);
  part(g,SPH(),mBody,.065,.065,.065,0,0,0);part(g,LIMB(.055,.048,.22),mBody,1,1,1,0,0,0);const e=new THREE.Group();e.position.y=-.21;g.add(e);
  part(e,SPH(),mBody,.048,.048,.048,0,0,0);part(e,LIMB(.047,.042,.19),sx<0?mBody:mBody,1,1,1,0,0,0);part(e,CY(1,1),mDark,.046,.03,.046,0,-.17,0);part(e,SPH(),mSkin,.045,.05,.045,0,-.22,0);arms.push(g);elbows.push(e)}
 const hand=new THREE.Group();hand.position.y=-.22;elbows[0].add(hand);const off=new THREE.Group();off.position.y=-.22;elbows[1].add(off);
 let blade=null;const w=o.wpn,mSteel=new THREE.MeshStandardMaterial({color:0xd8d8e0,metalness:.45,roughness:.28,emissive:0x111111}),mWood=M_({color:0x7a5230,roughness:.7});mats.push(mSteel);
 if(w==='dadao'||w==='sword'){const k=w==='sword'?.8:1;part(hand,CYZ(1,1),M_({color:0x3a2010}),.022,.022,.2*k,0,0,.03);for(const z of[-.03,.02,.07])part(hand,CYZ(1,1),M_({color:0xb8322a}),.025,.025,.01,0,0,z);
  part(hand,CYZ(1,1,20),mGold,.06,.06,.014,0,0,.14*k);const rib=part(hand,CYZ(1,1),M_({color:0xc8372d}),.008,.008,.12,0,-.03,-.1);rib.rotation.x=.4;blade=part(hand,DADAO(),mSteel,k,k*1.1,k,0,.01,.15*k)}
 else if(w==='rifle'){part(hand,BOX,mWood,.045,.075,.3,0,-.03,-.06);part(hand,BOX,M_({color:0x262626,roughness:.4,metalness:.4}),.04,.055,.13,0,.01,.15);part(hand,CYZ(1,1),M_({color:0x262626,metalness:.5,roughness:.4}),.014,.014,.6,0,.02,.5);part(hand,BOX,mWood,.04,.032,.38,0,-.01,.36);
  if(o.bayo)blade=part(hand,CYZ(.0,1,6),mSteel,.016,.016,.28,0,.03,.94)}
 else if(w==='fork'){part(hand,CYZ(1,1),mWood,.02,.02,1.3,0,0,.3);part(hand,BOX,M_({color:0x7a7a7a,metalness:.4}),.15,.018,.018,0,0,.94);for(const t of[-.065,0,.065])part(hand,CYZ(.0,1,6),M_({color:0x9a9a9a,metalness:.4}),.011,.011,.22,t,0,1.05)}
 else if(w==='baton'){blade=part(hand,CYZ(1,.8),M_({color:0x2a2a2a,roughness:.5}),.03,.03,.48,0,0,.24)}
 else if(w==='spear'){part(hand,CYZ(1,1),mWood,.02,.02,2.0,0,0,.45);blade=part(hand,CYZ(0,1,10),mSteel,.045,.045,.3,0,0,1.6);part(hand,CYZ(.4,1,10),M_({color:0xe0302a}),.075,.075,.16,0,-.02,1.38)}
 else if(w==='sack'){const ym=M_({color:0xa08a5a,map:cloth});blade=part(hand,SPH(),ym,.3,.28,.26,0,-.08,.3);part(hand,CONE(1,10),ym,.09,.15,.09,0,.25,.3);part(hand,CY(1,1),M_({color:0x5a3a1e}),.065,.03,.065,0,.18,.3);
  const yd=new THREE.Mesh(DISC(1),new THREE.MeshBasicMaterial({map:ltex(yenCv),transparent:true,alphaTest:.4}));yd.scale.set(.12,.12,1);yd.position.set(0,-.06,.565);hand.add(yd)}
 if(o.shield==='lid'){const l=part(off,CY(1,1,24),M_({color:0x5a5a62,metalness:.5,roughness:.4}),.2,.03,.2,.06,0,.05);l.rotation.z=Math.PI/2;part(off,SPH(),M_({color:0x2a2a30}),.035,.035,.035,.1,0,.05)}
 else if(o.shield==='door'){const d=part(off,BOX,M_({color:0x6a4a2a,map:cloth}),.07,.8,.55,.09,.15,.15);d.rotation.y=Math.PI/2;part(off,SPH(),mGold,.03,.03,.03,.14,.15,.3)}
 else if(o.shield==='mega'){const c=new THREE.Mesh(CONE(1,16),M_({color:0xc8372d,metalness:.3,roughness:.5}));c.scale.set(.11,.3,.11);c.rotation.x=-Math.PI/2;c.position.z=.15;off.add(c)}
 root.scale.set(s*(o.wide||1),s,s);S3.add(root);
 return{root,spin,rig,upper,headG,legs,knees,arms,elbows,hand,fm,fac,mats,emo:'normal',blade,flashOn:false}}
function setEmo(c,emo){if(c.emo===emo)return;c.emo=emo;c.fm.map=ltex(faceDecal(emo));c.fm.needsUpdate=true}
function flash(c,on){if(c.flashOn===on)return;c.flashOn=on;for(const m of c.mats)if(m.emissive&&m!==c.fm)m.emissive.setHex(on?0x999999:(c.blade&&m===c.blade.material?0x222222:0))}
function ghostC(c,on){if(c.ghost===on)return;c.ghost=on;for(const m of c.mats){if(m===c.fm)continue;m.transparent=on;m.opacity=on?.3:1;m.needsUpdate=true}c.fm.opacity=on?.3:1}
function killMesh(c){if(c&&c.root.parent)S3.remove(c.root)}
// pose: walk phase/amount, arm angles, lean, crouch, roll
function pose(c,p){const a=p.walk||0,ph=p.ph||0,cr=p.crouch||0;
 for(let i=0;i<2;i++){const q=ph+i*Math.PI,sw=Math.sin(q)*.65*a;c.legs[i].rotation.x=(i?-1:1)*0+sw-cr*1.3;c.knees[i].rotation.x=a*(.15+.85*Math.max(0,Math.sin(q+Math.PI/2)))+cr*2.4}
 c.arms[0].rotation.set(p.aR!=null?p.aR:-Math.sin(ph)*.5*a,p.yR||0,p.zR||0);c.arms[1].rotation.set(p.aL!=null?p.aL:Math.sin(ph)*.5*a,0,p.zL||0);
 c.elbows[0].rotation.x=p.eR!=null?p.eR:p.aR!=null?-.15:-.35-a*.2;c.elbows[1].rotation.x=p.eL!=null?p.eL:p.aL!=null?-.2:-.35-a*.2;
 c.upper.rotation.set((p.lean||0)+a*.08,p.twist||0,0);c.spin.rotation.set(p.roll||0,0,p.tilt||0);
 c.rig.position.y=-.75-cr*.42+(a?Math.abs(Math.cos(ph))*.035:Math.sin(T*.05)*.006);c.headG.rotation.x=p.nod||0}

/* ---------------- state ---------------- */
let PL=null,PM=null,ents=[],bosses=[],projs=[],pops=[],banner=null,areaB=null,reading=null,itemBox=null,arena=null,near=null,buf=null,scene=null,dead=null,ending=false;
let cy=0,cp=.42,camD=4.6,lockT=null,lockAuto=0;
const KILLS={ccp:'DIE! CCP MTFK!',kmt:'DIE! ...KMT MTFK?',civ:'SORRY! MTFK!',straw:'SORRY! MTFK!',uni:'DIE! BOTH MTFK!'};
function mkPlayer(x,z){if(PM)killMesh(PM);PM=mkChar({fac:'kmt',wpn:'dadao',shield:'lid'});
 return{x,z,fa:0,y:0,vy:0,hp:maxHP(),hpD:maxHP(),st:maxST(),stD:0,state:'free',t:0,combo:0,inv:0,flask:G.flaskMax,gren:G.grenMax,guard:false,gT:99,pc:0,anim:0,hit:new Set(),shout:null,target:null,ph:0,moving:0,sprint:false,rollHeld:0,dx:0,dz:0}}
const EDEF={
 conscript:{hp:44,poise:14,spd:.032,yuan:90,reach:1.5,turn:.07,atks:[{w:28,a:8,r:26,dmg:16,lunge:.06,arc:.5}],wpn:'rifle',bayo:1},
 pitch:{hp:32,poise:8,spd:.042,yuan:70,reach:1.7,turn:.09,atks:[{w:18,a:6,r:24,dmg:12,lunge:.05,n:2,w2:12,arc:.6}],wpn:'fork',civ:1,fac:'straw'},
 shield:{hp:80,poise:26,spd:.024,yuan:160,reach:1.3,turn:.05,shield:1,atks:[{w:36,a:8,r:30,dmg:24,lunge:.04,arc:.3}],wpn:'baton',sh:'door',fac:'civ'},
 rifle:{hp:34,poise:12,spd:.026,yuan:110,ranged:1,reach:1.4,turn:.08,atks:[{w:22,a:6,r:24,dmg:12,lunge:.04,arc:.5}],wpn:'rifle'},
 gren:{hp:30,poise:12,spd:.03,yuan:100,lob:1,reach:1.2,turn:.08,atks:[{w:20,a:6,r:24,dmg:12,lunge:.03,arc:.5}],wpn:null},
 commissar:{hp:320,poise:40,spd:.036,yuan:1600,reach:1.9,mini:1,s:1.4,turn:.06,atks:[{w:26,a:6,r:30,dmg:20,lunge:.06,n:3,w2:14,arc:.3}],wpn:'sword',sh:'mega',officer:1,name:'COMMISSAR WEI, SELF-CRITICISM ENFORCER'},
 mimic:{hp:150,poise:60,spd:.05,yuan:700,reach:1.5,mimic:1,turn:.1,atks:[{w:16,a:10,r:30,dmg:30,lunge:.08,arc:.3}]}};
function spawnAll(){for(const e of ents)killMesh(e.m);ents=SPAWNS.filter(([k])=>!(k==='mimic'&&G.taken.includes('mimic'))).map(([k,x,z,fac])=>{const d=EDEF[k];
 const e={k,def:d,x,z,hx:x,hz:z,fa:Math.PI,fac:fac||d.fac||'kmt',hp:d.hp*NGH(),max:d.hp*NGH(),pz:0,state:d.mimic?'dorm':'idle',t:rnd()*60|0,cd:30,n:0,atk:d.atks[0],flash:0,dead:false,dt:0,anim:0,id:Math.random(),s:d.s||1,rad:.35*(d.s||1),ph:0};
 e.m=d.mimic?mkMimic():mkChar({fac:e.fac,wpn:d.wpn,bayo:d.bayo,shield:d.sh,s:e.s,officer:d.officer,civ:d.civ});return e})}
function mkMimic(){const root=new THREE.Group(),mats=[];const m=SM({map:ltex(HT.c)});mats.push(m);
 const base=new THREE.Mesh(BOX,m);base.scale.set(.8,.5,.6);base.position.y=.25;root.add(base);const lidG=new THREE.Group();lidG.position.set(0,.5,-.3);root.add(lidG);
 const lid=new THREE.Mesh(BOX,m);lid.scale.set(.8,.12,.6);lid.position.set(0,.06,.3);lidG.add(lid);
 const tm=LM({color:0xf4f4f4});mats.push(tm);for(let i=0;i<5;i++){const t=new THREE.Mesh(BOX,tm);t.scale.set(.08,.08,.04);t.position.set(-.3+i*.15,-.03,.58);lidG.add(t);const t2=t.clone();t2.position.set(-.3+i*.15,.53,.28);root.add(t2)}
 const tg=LM({color:0xd0504a});mats.push(tg);const tongue=new THREE.Mesh(BOX,tg);tongue.scale.set(.3,.04,.3);tongue.position.set(0,.5,.2);root.add(tongue);
 const legs=[];for(const sx of[-1,1]){const l=new THREE.Mesh(BOX,LM({color:new THREE.Color(SK).getHex()}));l.scale.set(.1,.3,.1);l.position.set(sx*.25,-.1,0);root.add(l);legs.push(l)}
 S3.add(root);return{root,lidG,legs,mats,mimic:1,flashOn:false}}

/* ---------------- effects ---------------- */
let fx=[];
function blood(x,y,z,n,c){for(let i=0;i<n;i++)fx.push({x,y,z,vx:(rnd()-.5)*.08,vy:rnd()*.08,vz:(rnd()-.5)*.08,l:30+rnd()*30,c:c||(rnd()<.5?'#a8201a':'#6a1010'),g:.004})}
function spark(x,y,z,n,c='#ffe27a'){for(let i=0;i<n;i++)fx.push({x,y,z,vx:(rnd()-.5)*.12,vy:(rnd()-.3)*.1,vz:(rnd()-.5)*.12,l:12+rnd()*14,c:rnd()<.5?c:'#fff',g:.002,f:1})}
function dust(x,z,n){for(let i=0;i<n;i++)fx.push({x:x+(rnd()-.5)*.6,y:.05,z:z+(rnd()-.5)*.6,vx:(rnd()-.5)*.03,vy:.01+rnd()*.02,vz:(rnd()-.5)*.03,l:20+rnd()*20,c:'#8a7a68',g:0})}
function pop(x,y,z,s,c='#e9dcc2'){pops.push({x,y,z,s:String(s),c,t:0})}
function boomAt(x,y,z,o){SFX.boom();shake=Math.max(shake,8);for(let i=0;i<40;i++){const a=rnd()*TAU,v=rnd()*.12;fx.push({x,y:y+.2,z,vx:Math.cos(a)*v,vy:rnd()*.12,vz:Math.sin(a)*v,l:20+rnd()*25,c:pick(['#ffe27a','#ff8a1a','#ff5a1a','#555']),g:.003,f:1})}
 if(o==='e'){if(Math.hypot(PL.x-x,PL.z-z)<1.8)hitPlayer(26*NGD(),x,z,{kb:.12,noparry:1})}
 else for(const e of targets())if(Math.hypot(e.x-x,e.z-z)<1.8+e.rad)damage(e,e.boss?55:70,30,'boom',x,z)}

/* ---------------- player ---------------- */
const LCMB=[{W:7,A:6,R:13,dm:1,st:15,range:1.6,arc:.2},{W:6,A:6,R:13,dm:1,st:15,range:1.6,arc:.2},{W:9,A:6,R:17,dm:1.35,st:18,range:1.9,arc:.6,thrust:1}],HV={W:20,A:7,R:18,dm:1.9,st:28,range:1.8,arc:-.1};
const fwd=a=>[Math.sin(a),Math.cos(a)];
function inputVec(){let ix=(held('right')?1:0)-(held('left')?1:0),iz=(held('up')?1:0)-(held('down')?1:0);if(stickV.x||stickV.y){ix=stickV.x;iz=-stickV.y}
 const m=Math.hypot(ix,iz);if(m<.2)return null;const k=Math.min(1,m)/m;ix*=k;iz*=k;const fx_=Math.sin(cy),fz=Math.cos(cy);return[fx_*iz-Math.cos(cy)*ix,fz*iz+Math.sin(cy)*ix,Math.min(1,m)]}
function useSt(n){PL.st-=n;PL.stD=34}
function targets(){return ents.filter(e=>!e.dead).concat(bosses.filter(b=>!b.dead))}
function faceLockOrInput(){const p=PL;if(lockT&&!lockT.dead){p.fa=Math.atan2(lockT.x-p.x,lockT.z-p.z);return}const v=inputVec();if(v)p.fa=Math.atan2(v[0],v[1])}
function startAtk(heavy){const p=PL;faceLockOrInput();const[fx_,fz]=fwd(p.fa);
 const tgt=targets().find(e=>{if(e.state==='dorm')return false;const dx=e.x-p.x,dz=e.z-p.z,d=Math.hypot(dx,dz);if(d>1.4+e.rad)return false;const fr=(dx*fx_+dz*fz)/d;if(fr<.5)return false;
  if(e.state==='parried'||e.state==='down')return true;const[ex,ez]=fwd(e.fa);return !['act','wind','critd','intro','unite','roar'].includes(e.state)&&(-(dx*ex+dz*ez)/d)<-.5&&(!e.boss||e.state==='rec'||e.state==='idle')});
 if(tgt){p.state='crit';p.t=0;p.target=tgt;p.back=!(tgt.state==='parried'||tgt.state==='down');tgt.state='critd';tgt.t=0;p.inv=50;useSt(10);p.fa=Math.atan2(tgt.x-p.x,tgt.z-p.z);return}
 const c=heavy?HV:LCMB[p.combo];p.state='atk';p.t=0;p.cur=c;p.heavy=heavy;p.hit=new Set();useSt(c.st);X.swing()}
function move(o,dx,dz,r,isP){const nx=o.x+dx,nz=o.z+dz;if(!blocked(nx,o.z,r,isP))o.x=nx;if(!blocked(o.x,nz,r,isP))o.z=nz}
function blocked(x,z,r,isP){for(const[cx,cz]of[[x-r,z-r],[x+r,z-r],[x-r,z+r],[x+r,z+r]]){const c=cell(cx,cz);if(c===undefined||isWall(c))return true;
 if(c==='F'||c==='G'){const A=ARENAS.find(a=>Math.floor(cz)===a.fz||Math.floor(cz)===a.gz);if(!A||!G.boss[A.k])if(!(isP&&PL&&PL.state==='fogwalk'&&c==='F'))return true}
 if(!isP&&c==='~')return true}return false}
function updPlayer(){const p=PL;p.t++;p.anim++;if(p.inv>0)p.inv--;
 if(p.stD>0)p.stD--;else if(p.st<maxST())p.st=Math.min(maxST(),p.st+(p.guard?.45:p.state==='free'&&!p.sprint?1.3:.6));
 if(p.hpD>p.hp)p.hpD-=.6;else p.hpD=p.hp;
 for(const k of['atk','heavy','wine','gren'])if(pressed[k])buf={k,t:10};if(buf&&--buf.t<=0)buf=null;
 if(held('roll'))p.rollHeld++;else{if(p.rollHeld>0&&p.rollHeld<14)buf={k:'roll',t:10};p.rollHeld=0}
 if(pressed.guard&&p.pc<=0){p.gT=0;p.pc=24}p.gT++;p.pc--;
 if(pressed.lock)toggleLock();
 const take=k=>{if(buf&&buf.k===k){buf=null;return true}return false};const v=inputVec();
 p.guard=false;p.sprint=false;p.moving=0;let mvx=0,mvz=0;
 switch(p.state){
 case 'free':{p.guard=!!held('guard')&&p.st>0;p.sprint=p.rollHeld>=14&&p.st>0&&v&&!p.guard;
  if(v){const sp=(p.guard?.026:p.sprint?.085:.055)*v[2];mvx=v[0]*sp;mvz=v[1]*sp;p.moving=v[2];if(p.sprint){p.st-=.55;p.stD=20}
   if(lockT&&!p.sprint)p.fa=turn(p.fa,Math.atan2(lockT.x-p.x,lockT.z-p.z),.3);else p.fa=turn(p.fa,Math.atan2(v[0],v[1]),.3)}
  else if(lockT)p.fa=turn(p.fa,Math.atan2(lockT.x-p.x,lockT.z-p.z),.3);
  if(p.moving&&p.anim%(p.sprint?12:18)===0)X.step();
  if(buf&&p.st>0){
   if(take('roll')){p.state='roll';p.t=0;const d=v||null;p.rdir=d?Math.atan2(d[0],d[1]):p.fa;p.fa=p.rdir;useSt(18);X.roll();dust(p.x,p.z,4)}
   else if(take('atk')){p.combo=0;startAtk(false)}
   else if(take('heavy'))startAtk(true);
   else if(take('wine')&&p.flask>0){p.state='drink';p.t=0;X.drink()}
   else if(take('gren')&&p.gren>0){p.state='throw';p.t=0}}
  else if(buf&&buf.k==='wine'&&p.flask<=0){buf=null;pop(p.x,1.6,p.z,'NO WINE','#a8977c')}
  if(pressed.use&&near)interact(near);break}
 case 'atk':{const c=p.cur;if(p.t<=c.W&&lockT)p.fa=turn(p.fa,Math.atan2(lockT.x-p.x,lockT.z-p.z),.15);
  if(p.t>=2&&p.t<=c.W+2){const[fx_,fz]=fwd(p.fa);const sp=c.thrust?.05:.03;mvx=fx_*sp;mvz=fz*sp}
  if(p.t===c.W&&p.heavy)X.heavy();
  if(p.t>c.W&&p.t<=c.W+c.A){swingHit(c.range,c.arc,ATK()*c.dm,p.heavy?28:10,p.heavy?'heavy':'light');if(p.t===c.W+1)slashFX(p,c)}
  const tot=c.W+c.A+c.R;
  if(!p.heavy&&p.t>=c.W+c.A+4&&buf&&buf.k==='atk'&&p.st>0&&p.combo<2){buf=null;p.combo++;startAtk(false);break}
  if(p.t>=c.W+c.A+6&&buf&&buf.k==='roll'&&p.st>0){buf=null;p.state='roll';p.t=0;p.rdir=v?Math.atan2(v[0],v[1]):p.fa;p.fa=p.rdir;useSt(18);X.roll();break}
  if(p.t>=tot){p.state='free';p.t=0}break}
 case 'roll':{const[fx_,fz]=fwd(p.rdir),sp=p.t<14?.095:.03;mvx=fx_*sp;mvz=fz*sp;if(p.t>=22){p.state='free';p.t=0}break}
 case 'drink':{if(v){mvx=v[0]*.015;mvz=v[1]*.015}if(p.t===30){p.flask--;p.hp=Math.min(maxHP(),p.hp+maxHP()*.45);X.heal();for(let i=0;i<16;i++)fx.push({x:p.x+(rnd()-.5)*.5,y:rnd()*1.2,z:p.z+(rnd()-.5)*.5,vx:0,vy:.02,vz:0,l:30,c:'#ffd24a',g:0,f:1})}if(p.t>=54){p.state='free';p.t=0}break}
 case 'throw':{if(p.t===10){p.gren--;let tx,tz;if(lockT){tx=lockT.x;tz=lockT.z}else{const[fx_,fz]=fwd(p.fa);tx=p.x+fx_*6;tz=p.z+fz*6}const T_=40;projs.push({k:'gren',x:p.x,y:1.2,z:p.z,vx:(tx-p.x)/T_,vy:.11,vz:(tz-p.z)/T_,o:'p',life:200});SFX.throw()}if(p.t>=24){p.state='free';p.t=0}break}
 case 'hurt':{mvx=p.kx;mvz=p.kz;p.kx*=.85;p.kz*=.85;if(p.t>=16){p.state='free';p.t=0}break}
 case 'gbreak':{if(p.t>=44){p.state='free';p.t=0}break}
 case 'crit':{const e=p.target;if(p.t<14&&e){const d=1+.3*(e.s||1),tx=e.x-Math.sin(p.fa)*d,tz=e.z-Math.cos(p.fa)*d;p.x+=(tx-p.x)*.25;p.z+=(tz-p.z)*.25}
  if(p.t===8)p.shout={s:KILLS[e.fac]||KILLS.ccp,t:70};
  if(p.t===16&&e){const mul=e.boss?(p.back?2.2:3.2):4;hs=10;shake=10;X.flesh();X.heavy();blood(e.x,.8*e.s,e.z,40);pop(e.x,1.6*e.s,e.z,p.back?'BACKSTAB':'RIPOSTE','#ffd24a');damage(e,ATK()*mul,0,'crit',p.x,p.z,true)}
  if(p.t===30&&e&&!e.dead){e.state=e.boss?'down':'stag';e.t=e.boss?50:0}
  if(p.t>=40){p.state='free';p.t=0;p.target=null}break}
 case 'fogwalk':{mvz=.06;if(p.t>=50){p.state='free';p.t=0;startBoss(p.arena)}break}
 case 'bitten':{if(p.t>=60){p.state='hurt';p.t=0;const[fx_,fz]=fwd(p.fa);p.kx=-fx_*.08;p.kz=-fz*.08}break}
 case 'fall':{p.y-=.04;if(p.t>30)die(true);break}
 }
 if(p.shout&&--p.shout.t<=0)p.shout=null;
 if(mvx||mvz){if(p.state==='fogwalk'){p.z+=mvz}else move(p,mvx,mvz,.28,true)}
 // body push
 if(p.state!=='roll'&&p.state!=='dead'&&p.state!=='crit')for(const e of targets()){if(e.state==='dorm')continue;const dx=p.x-e.x,dz=p.z-e.z,d=Math.hypot(dx,dz)||.01,md=.3+e.rad;if(d<md){move(p,dx/d*(md-d),dz/d*(md-d),.28,true)}}
 if(arena){p.z=clamp(p.z,arena.z0+.35,arena.z1+.65)}
 if(cell(p.x,p.z)==='~'&&p.state!=='fall'&&p.state!=='dead'){p.state='fall';p.t=0;SFX.splash();for(let i=0;i<20;i++)fx.push({x:p.x,y:0,z:p.z,vx:(rnd()-.5)*.1,vy:.06+rnd()*.06,vz:(rnd()-.5)*.1,l:30,c:'#9fc0dc',g:.005})}
 if(p.state==='free'&&cell(p.x,p.z)!=='~')p.safe=[p.x,p.z]}
function toggleLock(){if(lockT){lockT=null;X.lock();return}let best=null,bd=14;const[cfx,cfz]=[Math.sin(cy),Math.cos(cy)];
 for(const e of targets()){if(e.state==='dorm')continue;const dx=e.x-PL.x,dz=e.z-PL.z,d=Math.hypot(dx,dz);if(d>14)continue;const front=(dx*cfx+dz*cfz)/d;const sc=d-front*4;if(sc<bd){bd=sc;best=e}}
 if(best){lockT=best;X.lock()}else{cy=PL.fa}}
function swingHit(range,arc,dmg,poise,kind){const p=PL,[fx_,fz]=fwd(p.fa);
 for(const e of targets()){if(p.hit.has(e.id)||e.state==='critd')continue;const dx=e.x-p.x,dz=e.z-p.z,d=Math.hypot(dx,dz)||.01;if(d>range+e.rad)continue;if((dx*fx_+dz*fz)/d<arc&&d>e.rad+.2)continue;
  p.hit.add(e.id);if(e.state==='dorm')wakeMimic(e);damage(e,dmg,poise,kind,p.x,p.z)}}
function damage(e,dmg,poise,kind,sx,sz,crit){
 const dx=sx-e.x,dz=sz-e.z,d=Math.hypot(dx,dz)||1,[ex,ez]=fwd(e.fa),front=(dx*ex+dz*ez)/d>.2;
 if(e.def&&e.def.shield&&!crit&&kind!=='heavy'&&kind!=='boom'&&front&&e.state!=='stag'&&e.state!=='parried'){
  X.block();spark(e.x,1,e.z,10);pop(e.x,1.5,e.z,'BLOCKED','#a8977c');if(PL.state==='atk'){PL.state='hurt';PL.t=6;PL.kx=-dx/d*-.05;PL.kz=-dz/d*-.05}hs=4;return}
 if(e.state==='dorm')wakeMimic(e);const m=crit?1:(.9+rnd()*.2);dmg=Math.round(dmg*m);e.hp-=dmg;e.flash=6;
 if(!crit){X.flesh();blood(e.x,.8*e.s,e.z,kind==='heavy'?16:8);hs=Math.max(hs,kind==='heavy'?6:3);shake=Math.max(shake,kind==='heavy'?5:2)}
 pops.push({x:e.x+(rnd()-.5)*.3,y:1.4*e.s,z:e.z,s:String(dmg),c:crit?'#ffd24a':'#fff',t:0});
 if(e.hp<=0){kill(e);return}
 if(e.state==='idle')e.state='chase';
 e.pz+=poise;const lim_=e.boss?e.poiseMax:e.def.poise;
 if(e.pz>=lim_&&!['critd','down','roar','intro','unite'].includes(e.state)){e.pz=0;if(e.boss){e.state='down';e.t=0;pop(e.x,2*e.s,e.z,'POISE BROKEN','#ffd24a')}else if(e.state!=='act'||kind!=='light'){e.state='stag';e.t=0}}}
function kill(e){e.dead=true;e.dt=0;e.hp=0;G.kills++;if(lockT===e){lockT=null;lockAuto=20}
 if(e.boss){bossDown(e);return}
 const y=Math.round(e.def.yuan*G.inf*(1+G.ng*.5));G.yuan+=y;pop(PL.x,1.9,PL.z,'+¥'+fmtBig(y),'#d9a441');X.coin();blood(e.x,.6,e.z,24);
 if(e.def.mimic){G.taken.push('mimic');itemGet('t3','ticket')}
 if(e.def.mini){banner={t:0,dur:200,text:'ENEMY FELLED',col:'#d9a441',size:24};X.felled();music('off')}}
function hitPlayer(dmg,sx,sz,o={}){const p=PL;
 if(['dead','crit','bitten','fall'].includes(p.state))return 'miss';
 if(p.inv>0||(p.state==='roll'&&p.t>=1&&p.t<15)||p.state==='fogwalk')return 'miss';
 const dx=sx-p.x,dz=sz-p.z,d=Math.hypot(dx,dz)||.01,[fx_,fz]=fwd(p.fa),front=(dx*fx_+dz*fz)/d>.15;
 if(p.guard&&front&&!o.unblock){
  if(p.gT<10&&!o.noparry){X.parry();spark(p.x+fx_*.5,1,p.z+fz*.5,24,'#ffd24a');hs=10;shake=4;pop(p.x,1.8,p.z,'PARRY!','#ffd24a');p.st=Math.min(maxST(),p.st+10);return 'parry'}
  useSt(dmg*(o.heavy?1.8:1.15));X.block();spark(p.x+fx_*.5,1,p.z+fz*.5,12);move(p,-dx/d*.15,-dz/d*.15,.28,true);
  if(p.st<0){p.st=0;p.state='gbreak';p.t=0;pop(p.x,1.8,p.z,'GUARD BROKEN','#ff6a5a');SFX.hit()}return 'block'}
 dmg=Math.round(dmg);p.hp-=dmg;p.state='hurt';p.t=0;const kb=o.kb||.08;p.kx=-dx/d*kb;p.kz=-dz/d*kb;p.inv=34;
 hs=Math.max(hs,5);shake=Math.max(shake,7);blood(p.x,.8,p.z,16);SFX.hit();X.flesh();pop(p.x,1.6,p.z,'-'+dmg,'#ff6a5a');
 if(p.hp<=0){p.hp=0;die(false)}return 'hit'}
function die(fell){const p=PL;if(p.state==='dead')return;p.state='dead';p.t=0;G.deaths++;music('off');X.died();lockT=null;
 if(G.stain)G.lost+=G.stain.val;const sp=fell?(p.safe||[p.x,p.z]):[p.x,p.z];
 G.stain=G.yuan>0?{x:sp[0],z:sp[1],val:G.yuan,orig:G.yuan}:null;G.yuan=0;dead={t:0};save()}
function respawn(i,warp){G.fire=i;const f=FIRES[i];PL=mkPlayer(f.x,f.z+1);PL.fa=0;cy=0;arena=null;for(const b of bosses)killMesh(b.m);bosses=[];for(const q of projs)if(q.mesh)S3.remove(q.mesh);projs=[];spawnAll();dead=null;lockT=null;fadeA=1;LV=-1;setZone(zoneAt(PL.z));state='play';music('off');ambSet();GLC.style.filter='';
 if(!warp)pop(PL.x,1.8,PL.z,'YOU ROSE AGAIN. NOBODY NOTICED.','#a8977c');for(const m of fogMeshes){const A=m.userData.A;m.visible=!G.boss[A.k]}}
function setZone(i){if(i===LV)return;LV=i;const z=ZONES[i];if(S3){S3.fog.color.setHex(z.fog);S3.background.setHex(i===2?0x0c0e1a:0x1c1420);hemi.intensity=i===2?.75:1.1;sunL.intensity=i===2?.45:1.1}
 ambSet();if(state==='play'&&G&&!G.seen.includes(i)){G.seen.push(i);areaB={t:0,z}}}

/* ---------------- enemies ---------------- */
function enemyHit(e,range,arc,dmg,o={}){if(e.hitDone)return;const p=PL,dx=p.x-e.x,dz=p.z-e.z,d=Math.hypot(dx,dz)||.01,[ex,ez]=fwd(e.fa);
 if(d>range+.3)return;if((dx*ex+dz*ez)/d<arc&&d>e.rad+.35)return;e.hitDone=true;
 const res=hitPlayer(dmg*NGD(),e.x,e.z,o);if(res==='parry'){if(e.boss){e.state='down';e.t=0}else{e.state='parried';e.t=0}}else if(res==='hit'&&e.def&&e.def.mimic)X.bite();return res}
function aoeHit(e,x,z,R_,dmg,o={}){if(Math.hypot(PL.x-x,PL.z-z)<R_+.3)return hitPlayer(dmg*NGD(),x,z,Object.assign({noparry:1},o))}
function wakeMimic(e){if(e.state!=='dorm')return;e.state='wind';e.t=10;e.n=0;X.bite();pop(e.x,1.2,e.z,'!!!','#ff6a5a')}
function emove(e,dx,dz){const ox=e.x,oz=e.z;move(e,dx,dz,e.rad*.8,false);if(Math.hypot(e.x-e.hx,e.z-e.hz)>12&&!e.boss){e.x=ox;e.z=oz}}
function updEnemy(e){const d=e.def,dx=PL.x-e.x,dz=PL.z-e.z,dist=Math.hypot(dx,dz),ang=Math.atan2(dx,dz),a=e.atk;e.t++;e.anim++;if(e.flash>0)e.flash--;if(e.pz>0)e.pz-=.05;
 if(e.dead){e.dt++;return}const alive=!['dead','fall'].includes(PL.state);e.moving=0;
 const go=(sp)=>{const[fx_,fz]=fwd(e.fa);emove(e,fx_*sp,fz*sp);e.moving=1};
 switch(e.state){
 case 'dorm':return;
 case 'idle':{if(e.bar){e.bar=0;if(!arena)music('off')}const hd=Math.hypot(e.hx-e.x,e.hz-e.z);if(hd>.3){e.fa=turn(e.fa,Math.atan2(e.hx-e.x,e.hz-e.z),.1);go(d.spd*.6)}
  if(alive&&dist<(d.mini?9:7.5)&&Math.abs(PL.z-e.z)<10){e.state='chase';e.t=0;e.cd=20+rnd()*30;X.alert();pop(e.x,1.6*e.s,e.z,'!','#ff6a5a');if(d.mini){music('duel');e.bar=1}}break}
 case 'chase':{if(!alive||dist>14||Math.hypot(e.x-e.hx,e.z-e.hz)>11.5){e.state='idle';break}e.fa=turn(e.fa,ang,d.turn);e.cd--;
  const facing=Math.abs(angTo(e.fa,ang))<.5;
  if(d.ranged&&dist>d.reach+.3){if(dist<4)go(-d.spd);else if(dist>8)go(d.spd);if(e.cd<=0&&dist<11&&facing){e.state='aim';e.t=0}break}
  if(d.lob&&dist>d.reach+.3){if(dist<3.5)go(-d.spd);else if(dist>7)go(d.spd);if(e.cd<=0&&dist<9){e.state='throw';e.t=0}break}
  if(d.mini&&dist>3.5&&e.cd<=0&&rnd()<.03&&facing){e.state='word';e.t=0;break}
  if(dist>d.reach*e.s+.1)go(d.spd*(d.mini&&dist>5?1.4:1));else if(e.cd<=0&&facing){e.state='wind';e.t=0;e.n=0}
  break}
 case 'wind':{const w=e.n?(a.w2||a.w):a.w;if(e.t<w*.6)e.fa=turn(e.fa,ang,d.turn*.8);if(e.t>=w){e.state='act';e.t=0;e.hitDone=false;d.mimic?X.bite():X.swing()}break}
 case 'act':{go(a.lunge);enemyHit(e,d.reach*e.s+.4,a.arc,a.dmg,{kb:.1,heavy:d.shield});if(e.t>=a.a){e.n++;if(e.n<(a.n||1)){e.state='wind';e.t=0}else{e.state='rec';e.t=0}}break}
 case 'rec':{if(e.t>=(a.r||26)){e.state='chase';e.t=0;e.cd=24+rnd()*50}break}
 case 'aim':{e.fa=turn(e.fa,ang,.06);if(e.t===50){const sy=1.25,ty=1.05,T_=dist/.22;projs.push({k:'bul',x:e.x+Math.sin(e.fa)*.6,y:sy,z:e.z+Math.cos(e.fa)*.6,vx:dx/T_,vy:(ty-sy)/T_,vz:dz/T_,o:'e',dmg:16,life:120});SFX.eshot();e.muzz=4}if(e.muzz)e.muzz--;if(e.t>=76){e.state='chase';e.t=0;e.cd=60+rnd()*50}break}
 case 'throw':{e.fa=turn(e.fa,ang,.1);if(e.t===20){const T_=45;projs.push({k:'gren',x:e.x,y:1.2,z:e.z,vx:dx/T_,vy:.11,vz:dz/T_,o:'e',life:200});SFX.throw()}if(e.t>=44){e.state='chase';e.t=0;e.cd=110+rnd()*60}break}
 case 'word':{e.fa=turn(e.fa,ang,.1);if(e.t===30){const T_=dist/.09;const txt_=pick(['SELF-CRITICIZE!','STRUGGLE SESSION!','CONFESS!','RECTIFY!']);const c=wordSprite(txt_).n;const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex(c),depthWrite:false}));sp.scale.set(c.width/c.height*.35,.35,1);S3.add(sp);
   projs.push({k:'word',x:e.x,y:1.4,z:e.z,vx:dx/T_,vy:-.4/T_,vz:dz/T_,o:'e',dmg:18,life:200,mesh:sp});SFX.word()}if(e.t>=56){e.state='chase';e.t=0;e.cd=30}break}
 case 'stag':{if(e.t>=(d.mini?40:30)){e.state='chase';e.t=0;e.cd=10}break}
 case 'parried':{if(e.t>=90){e.state='chase';e.t=0;e.cd=10}break}
 case 'critd':break}
 for(const o of ents)if(o!==e&&!o.dead&&o.state!=='dorm'){const ddx=e.x-o.x,ddz=e.z-o.z,dd=Math.hypot(ddx,ddz)||.01;if(dd<e.rad+o.rad)emove(e,ddx/dd*.02,ddz/dd*.02)}}

/* ---------------- bosses ---------------- */
const BOSSDEF={
 ma:{name:'GENERAL MA, EXECUTIONER OF DESERTERS',hp:720,s:2,fac:'kmt',poise:110,wpn:'dadao',moves1:['combo','combo','leap','charge'],moves2:['combo','leap','charge','spin','spin'],yuan:9000,spd:.04},
 red:{name:'BROTHER RED, THE SWIFT',hp:430,s:1.55,fac:'ccp',poise:70,wpn:'spear',moves1:['lunge','lunge','jab','hop'],yuan:6000,spd:.05},
 blue:{name:'BROTHER BLUE, THE STOUT',hp:560,s:2.1,wide:1.3,fac:'kmt',poise:120,wpn:'sack',moves1:['slam','sweep','belly'],yuan:6000,spd:.026}};
function mkBoss(k,x,z){const d=BOSSDEF[k];const b={boss:1,k,def:d,name:d.name,x,z,y:0,fa:Math.PI,hp:d.hp*NGH(),max:d.hp*NGH(),s:d.s,rad:.38*d.s*(d.wide||1),fac:d.fac,state:'intro',t:0,cd:40,pz:0,poiseMax:d.poise,phase:1,moves:d.moves1.slice(),n:0,sub:0,vy:0,hitDone:false,flash:0,dead:false,dt:0,anim:0,id:Math.random(),f:1};
 b.m=mkChar({fac:d.fac,wpn:d.wpn,s:d.s,wide:d.wide,officer:k==='ma'});return b}
function startBoss(A){arena=A;fadeA=.5;lockT=null;areaB=null;if(A.k==='ma'){bosses=[mkBoss('ma',A.cx,A.cz+4)];music('duel')}else{bosses=[mkBoss('red',A.cx+2.5,A.cz+4),mkBoss('blue',A.cx-2.5,A.cz+5)];music('final')}
 lockT=bosses[0];banner={t:0,dur:150,text:A.k==='ma'?'GENERAL MA':'THE BROTHERS',sub:A.k==='ma'?'EXECUTIONER OF DESERTERS':'WHO AGREE ON ONE THING',col:'#e9dcc2',size:26}}
function bossDown(b){blood(b.x,1.2,b.z,60);shake=14;hs=16;const rest=bosses.filter(o=>!o.dead);
 if(rest.length){const o=rest[0];o.state='unite';o.t=0;lockT=o;return}
 const k=arena.k;G.boss[k]=1;const y=Math.round(b.def.yuan*G.inf*(1+G.ng*.5))*(k==='bros'?2:1);G.yuan+=y;pop(PL.x,1.9,PL.z,'+¥'+fmtBig(y),'#d9a441');
 banner={t:0,dur:260,text:k==='ma'?'WARLORD FELLED':'UNITED FRONT DISSOLVED',col:'#d9a441',size:24,delay:50};setTimeout(()=>X.felled(),400);music('off');arena=null;
 for(const m of fogMeshes)if(m.userData.A.k===k)m.visible=false;itemGet(k==='ma'?'stamp':'stamp2',k==='ma'?'stamp':'stamp2',120);save()}
function ring(x,z,dmg,v=.09,c=0xe9dcc2){const m=new THREE.Mesh(new THREE.RingGeometry(.9,1,40),new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.8,side:THREE.DoubleSide,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(x,.08,z);S3.add(m);projs.push({k:'ring',x,z,y:0,r:.5,v,dmg,life:80,mesh:m,o:'e'})}
function slam(b,R_,dmg){shake=12;SFX.stomp();dust(b.x,b.z,24);if(dmg)aoeHit(b,b.x,b.z,R_,dmg,{kb:.16});ring(b.x,b.z,18)}
function updBoss(b){const dx=PL.x-b.x,dz=PL.z-b.z,dist=Math.hypot(dx,dz),ang=Math.atan2(dx,dz),f=b.f,d=b.def;b.t++;b.anim++;if(b.flash>0)b.flash--;if(b.pz>0)b.pz-=.12;b.moving=0;
 if(b.dead){b.dt++;return}const A=arena;
 const walk=(sp,a=b.fa)=>{const nx=b.x+Math.sin(a)*sp,nz=b.z+Math.cos(a)*sp;if(A){b.x=clamp(nx,5.6+b.rad,20.4-b.rad);b.z=clamp(nz,A.z0+.6+b.rad,A.z1+.4-b.rad)}b.moving=1};
 if(b.k==='ma'&&b.phase===1&&b.hp<b.max*.5&&!['critd','down','leap','roar'].includes(b.state)){b.state='roar';b.t=0}
 const melee=(R_,arc,dmg,o)=>enemyHit(b,R_,arc,dmg,o||{});const tr=(r)=>{b.fa=turn(b.fa,ang,r*(b.phase>1?1.4:1))};
 switch(b.state){
 case 'intro':tr(.05);if(b.t>=70){b.state='idle';b.t=0}break;
 case 'idle':{tr(.06);if(dist>1.2*b.s+.6)walk(d.spd*(b.phase>1?1.3:1));b.cd--;
  if(b.cd<=0&&PL.state!=='dead'){let mv=pick(b.moves);const close=['combo','jab','sweep','slam'],far=['charge','lunge','leap','belly'];
   if(close.includes(mv)&&dist>2.2*b.s/2+2.2)mv=pick(b.moves.filter(m=>!close.includes(m)))||mv;
   if(far.includes(mv)&&dist<2&&rnd()<.6)mv=b.moves.find(m=>close.includes(m))||mv;
   b.state=mv;b.t=0;b.n=0;b.sub=0;b.hitDone=false;if(mv==='combo')b.third=14+rnd()*34|0;if(mv==='charge'||mv==='lunge')b.shout={s:b.k==='ma'?'DIE, DESERTER!':'FOR THE PEOPLE!',t:60}}
  break}
 case 'combo':{const W0=b.n===0?34*f:b.n===2?b.third*f:15*f;
  if(b.sub===0){if(b.t<W0*.7)tr(.05);if(b.t>=W0){b.sub=1;b.t=0;b.hitDone=false;X.heavy()}}
  else{walk(.06);melee(2.6,.1,26,{kb:.14});if(b.t>=8){b.n++;b.sub=0;b.t=0;if(b.n>=3){b.state='rec';b.rec=46}}}break}
 case 'leap':{if(b.sub===0){tr(.08);if(b.t>=28*f){b.sub=1;b.t=0;b.tx=PL.x;b.tz=PL.z;b.sx=b.x;b.sz=b.z;b.vy=.16;SFX.jump()}}
  else if(b.sub===1){const k=Math.min(1,b.t/40);b.x=lerp(b.sx,b.tx,k);b.z=lerp(b.sz,b.tz,k);b.y=Math.max(0,Math.sin(k*Math.PI)*3);if(b.t>=40){b.y=0;b.sub=2;b.t=0;slam(b,2.4,32)}}
  else if(b.t>=2){b.state='rec';b.rec=40}break}
 case 'charge':{if(b.sub===0){tr(.08);if(b.t>=26*f){b.sub=1;b.t=0;b.hitDone=false}}
  else{walk(.15);if(b.anim%5===0)dust(b.x,b.z,3);if(dist<1.2*b.s/2+.5&&!b.hitDone){b.hitDone=true;hitPlayer(24*NGD(),b.x,b.z,{kb:.2})}
   const past=(dx*Math.sin(b.fa)+dz*Math.cos(b.fa))<-2.5;if(b.t>=70||past){b.state='rec';b.rec=44;b.t=0}}break}
 case 'spin':{if(b.sub===0){if(b.t>=30*f){b.sub=1;b.t=0}}else{b.fa+=.45;walk(.035,ang);if(b.t%18===0){b.hitDone=false;X.swing()}if(!b.hitDone&&dist<2.4){b.hitDone=true;hitPlayer(16*NGD(),b.x,b.z,{kb:.12})}if(b.t>=100){b.state='rec';b.rec=60}}break}
 case 'roar':{if(b.t===20){b.phase=2;b.f=.75;b.moves=BOSSDEF.ma.moves2.slice();shake=16;b.shout={s:'DIE, DESERTER! MTFK!',t:90};SFX.alarm();ring(b.x,b.z,0,.15,0xffb04a);
   if(dist<4&&PL.state!=='dead'&&PL.state!=='roll'){PL.state='hurt';PL.t=0;PL.kx=dx/dist*.18;PL.kz=dz/dist*.18}music('final')}
  if(b.t>=70){b.state='idle';b.cd=20;b.t=0}break}
 case 'lunge':{if(b.sub===0){tr(.07);if(b.t>=30*f){b.sub=1;b.t=0;b.hitDone=false;b.sx=b.x;b.sz=b.z;X.swing()}}
  else{walk(.22);melee(1.6*b.s/1.55+.6,.3,22,{kb:.14});if(Math.hypot(b.x-b.sx,b.z-b.sz)>6||b.t>=28){b.state='rec';b.rec=36;b.t=0}}break}
 case 'jab':{const W0=b.n===0?20*f:9*f;if(b.sub===0){if(b.t<W0*.7)tr(.08);if(b.t>=W0){b.sub=1;b.t=0;b.hitDone=false;X.swing()}}
  else{walk(.03);melee(2.6,.6,14,{kb:.08});if(b.t>=5){b.n++;b.sub=0;b.t=0;if(b.n>=3){b.state='rec';b.rec=34}}}break}
 case 'hop':{if(b.t===1){b.vy=.12}b.y=Math.max(0,b.y+b.vy);b.vy-=.012;walk(-.07);if(b.t>18){b.y=0;b.state=rnd()<.6&&b.moves.includes('lunge')?'lunge':'idle';b.sub=0;b.t=0;b.cd=10}break}
 case 'slam':{if(b.sub===0){if(b.t<20)tr(.05);if(b.t>=44*f){b.sub=1;b.t=0;b.hitDone=false}}
  else{if(b.t===2){const fx_=Math.sin(b.fa)*1.8,fz=Math.cos(b.fa)*1.8;shake=12;SFX.stomp();dust(b.x+fx_,b.z+fz,24);aoeHit(b,b.x+fx_,b.z+fz,1.6,34,{kb:.16});ring(b.x+fx_,b.z+fz,18,.08,0xd9a441)}if(b.t>=8){b.state='rec';b.rec=50}}break}
 case 'sweep':{if(b.sub===0){if(b.t<20)tr(.06);if(b.t>=34*f){b.sub=1;b.t=0;b.hitDone=false;X.heavy()}}else{melee(3,-.3,26,{kb:.16});if(b.t>=10){b.state='rec';b.rec=40}}break}
 case 'belly':{if(b.sub===0){tr(.08);if(b.t>=30*f){b.sub=1;b.t=0;b.tx=PL.x;b.tz=PL.z;b.sx=b.x;b.sz=b.z;SFX.jump()}}
  else if(b.sub===1){const k=Math.min(1,b.t/50);b.x=lerp(b.sx,b.tx,k);b.z=lerp(b.sz,b.tz,k);b.y=Math.sin(k*Math.PI)*3.5;if(b.t>=50){b.y=0;b.sub=2;b.t=0;slam(b,2.6,36)}}
  else if(b.t>=2){b.state='rec';b.rec=60}break}
 case 'unite':{const o=bosses.find(q=>q.dead);if(b.t%3===0&&o)fx.push({x:o.x+(rnd()-.5),y:rnd()*2,z:o.z+(rnd()-.5),vx:(b.x-o.x)/40,vy:.01,vz:(b.z-o.z)/40,l:40,c:'#c08aff',g:0,f:1});
  if(b.t===60){b.hp=b.max;b.s*=1.15;b.m.root.scale.multiplyScalar(1.15);b.rad*=1.15;b.uni=1;b.f=.8;b.poiseMax*=1.3;b.name='THE UNITED FRONT (TEMPORARY)';b.moves=['lunge','jab','hop','slam','sweep','belly','lunge'];shake=14;SFX.alarm();
   b.m.fac='uni';b.m.emo='';setEmo(b.m,'shout');banner={t:0,dur:180,text:'THE BROTHERS HAVE UNITED',sub:'AGAINST YOU, SPECIFICALLY',col:'#c08aff',size:20}}
  if(b.t>=100){b.state='idle';b.t=0;b.cd=10}break}
 case 'rec':{if(b.t>=b.rec*(b.phase>1?.8:1)){b.state='idle';b.t=0;b.cd=(14+rnd()*30)*f}break}
 case 'down':{if(b.t>=100){b.state='idle';b.t=0;b.cd=10}break}
 case 'critd':break}
 if(b.shout&&--b.shout.t<=0)b.shout=null;
 if(b.k==='ma'&&b.phase>1&&T%2===0){const p_=new THREE.Vector3();if(b.m.blade){b.m.blade.getWorldPosition(p_);fx.push({x:p_.x+(rnd()-.5)*.3,y:p_.y+(rnd()-.5)*.3,z:p_.z+(rnd()-.5)*.3,vx:0,vy:.02,vz:0,l:16,c:pick(['#ff8a1a','#ffd24a']),g:-.001,f:1})}}
 if(b.y<.05&&!['charge','lunge','critd'].includes(b.state)&&PL.state!=='dead'){const md=b.rad+.32;if(dist<md&&dist>0){b.x-=dx/dist*(md-dist);b.z-=dz/dist*(md-dist)}}
 for(const o of bosses)if(o!==b&&!o.dead){const ddx=b.x-o.x,ddz=b.z-o.z,dd=Math.hypot(ddx,ddz)||.01;if(dd<b.rad+o.rad){b.x+=ddx/dd*.03;b.z+=ddz/dd*.03}}}

/* ---------------- projectiles & world ---------------- */
function updProjs(){for(const q of projs){q.life--;
 if(q.k==='slash'){q.mesh.material.opacity=q.life*.055;continue}
 if(q.k==='ring'){q.r+=q.v;q.mesh.scale.set(q.r,q.r,1);q.mesh.material.opacity=Math.max(0,.8-q.r/9);const d=Math.hypot(PL.x-q.x,PL.z-q.z);if(q.dmg&&!q.done&&Math.abs(d-q.r)<.35){const res=hitPlayer(q.dmg*NGD(),q.x,q.z,{noparry:1,kb:.1});if(res!=='miss')q.done=1}if(q.r>8)q.life=0;continue}
 q.x+=q.vx;q.y+=q.vy;q.z+=q.vz;
 if(q.k==='gren'){q.vy-=.0055;let hit=q.y<=0;if(q.o==='p')for(const e of targets())if(e.state!=='dorm'&&Math.hypot(e.x-q.x,e.z-q.z)<e.rad+.2&&q.y<1.2*e.s)hit=true;if(isWall(cell(q.x,q.z)||'#')&&q.y<2.6){hit=true}
  if(T%3===0)fx.push({x:q.x,y:q.y,z:q.z,vx:0,vy:0,vz:0,l:10,c:'#ffb04a',g:0,f:1});if(hit||q.life<=0){q.life=0;boomAt(q.x,Math.max(0,q.y),q.z,q.o)}continue}
 if(q.mesh)q.mesh.position.set(q.x,q.y,q.z);
 if(isWall(cell(q.x,q.z)||'#')||q.y<0){q.life=0;spark(q.x,q.y,q.z,4);continue}
 if(q.o==='e'){if(Math.hypot(PL.x-q.x,PL.z-q.z)<.4&&q.y<1.65){const res=hitPlayer(q.dmg*NGD(),q.x-q.vx*4,q.z-q.vz*4,{kb:.06});
   if(res==='parry'){q.o='p';q.vx*=-1.4;q.vz*=-1.4;q.vy=0;q.dmg*=2.5;pop(q.x,1.8,q.z,'RETURN TO SENDER','#ffd24a')}else if(res!=='miss')q.life=0}}
 else for(const e of targets())if(e.state!=='dorm'&&Math.hypot(e.x-q.x,e.z-q.z)<e.rad+.2&&q.y<1.4*e.s){damage(e,q.dmg,20,'light',q.x-q.vx*3,q.z-q.vz*3);q.life=0;break}}
 for(const q of projs)if(q.life<=0&&q.mesh){S3.remove(q.mesh);q.mesh=null}projs=projs.filter(q=>q.life>0)}
function itemGet(id,k,delay=0){if(!G.taken.includes(id))G.taken.push(id);if(itemSpr[id])itemSpr[id].visible=false;
 if(k==='ticket'){G.flaskMax++;PL.flask++}else if(k==='whet')G.whet++;else if(k==='gren'){G.grenMax++;PL.gren++}else if(k==='vest'){G.vest++;PL.hp+=maxHP()-Math.round(maxHP()/1.15)}else if(k==='yuan')G.yuan+=Math.round(2500*G.inf);
 setTimeout(()=>{itemBox={k,t:0};SFX.weapon()},delay*16);save()}
function interact(n){const p=PL;
 if(n.k==='fire'){restAt(n.i);return}
 if(n.k==='msg'){reading={m:n.o,t:0};SFX.radio();return}
 if(n.k==='item'){itemGet(n.o.id,n.o.k);spark(n.o.x,.4,n.o.z,14,'#fff');return}
 if(n.k==='fog'){p.state='fogwalk';p.t=0;p.arena=n.o;p.x=clamp(p.x,11.4,13.6);p.fa=0;X.fog();return}
 if(n.k==='mimic'){const e=n.o;wakeMimic(e);e.state='act';e.t=0;e.hitDone=true;p.state='bitten';p.t=0;const dd=Math.round(45*NGD());p.hp-=dd;p.inv=70;blood(p.x,.8,p.z,30);X.bite();shake=10;pop(p.x,1.6,p.z,'-'+dd,'#ff6a5a');if(p.hp<=0){p.hp=0;die(false)}return}
 if(n.k==='ferry'){finish();return}}
function findNear(){const p=PL;near=null;if(p.state!=='free')return;const d2=(x,z)=>Math.hypot(p.x-x,p.z-z);
 FIRES.forEach((f,i)=>{if(d2(f.x,f.z)<1.3)near={k:'fire',i,label:G.lit.includes(i)?'REST':'LIGHT THE STOVE'}});if(near)return;
 for(const it of ITEMS)if(!G.taken.includes(it.id)&&d2(it.x,it.z)<1){near={k:'item',o:it,label:'PICK UP'};return}
 for(const e of ents)if(e.state==='dorm'&&d2(e.x,e.z)<1.3){near={k:'mimic',o:e,label:'OPEN THE CRATE'};return}
 for(const A of ARENAS)if(!G.boss[A.k]&&!arena&&p.z>A.fz-1.2&&p.z<A.fz&&p.x>11&&p.x<14){near={k:'fog',o:A,label:'ENTER THE FOG'};return}
 if(G.boss.bros&&p.z>128.5){near={k:'ferry',label:'BOARD THE LAST FERRY'};return}
 for(const m of MSGS)if(d2(m.x,m.z)<.8){near={k:'msg',o:m,label:'READ MESSAGE'};return}}
function restAt(i){const p=PL,first=!G.lit.includes(i);p.state='sit';p.t=0;G.fire=i;lockT=null;
 if(first){G.lit.push(i);banner={t:0,dur:170,text:'TEA STOVE LIT',col:'#ffb04a',size:24};X.lit()}
 G.inf*=1.15;p.hp=maxHP();p.flask=G.flaskMax;p.gren=G.grenMax;p.st=maxST();spawnAll();for(const q of projs)if(q.mesh)S3.remove(q.mesh);projs=[];save();
 music('ending');setTimeout(()=>{if(state==='play'&&PL.state==='sit')openFire()},first?1500:500)}
const fireEl=$('#fire');
function openFire(){state='fire';fireEl.hidden=false;$('#tU').hidden=true;$('#touch').hidden=true;if(document.pointerLockElement)document.exitPointerLock();$('#fireH').textContent=FIRES[G.fire].name;$('#fireN').textContent=pick(NEWS);$('#fTip').textContent='Tip: '+pick(TIPS);refreshFire();setTimeout(()=>$('#fireGo').focus(),50)}
function refreshFire(){const c=cost();$('#fY').textContent='¥ '+fmtBig(G.yuan);$('#fC').textContent='¥ '+fmtBig(c);$('#sV').textContent=G.vig;$('#sE').textContent=G.end;$('#sS').textContent=G.str;$('#fL').textContent=SL()+(G.ng?'  (NG+'+G.ng+')':'');
 $('#fD').textContent=maxHP()+' · '+maxST()+' · '+Math.round(ATK());$('#fF').textContent=G.flaskMax+' · '+G.grenMax;
 fireEl.querySelectorAll('.stat button').forEach(b=>b.disabled=G.yuan<c||G[b.dataset.s]>=60);
 const w=$('#warp');w.innerHTML='';G.lit.slice().sort((a,b)=>a-b).forEach(i=>{const b=document.createElement('button');b.textContent=(i===G.fire?'▶ ':'')+FIRES[i].name;if(i===G.fire)b.className='here';b.onclick=()=>{if(i===G.fire)return;closeFire();respawn(i,true);G.fire=i;save();X.fog()};w.appendChild(b)})}
fireEl.querySelectorAll('.stat button').forEach(b=>b.onclick=()=>{const c=cost();if(G.yuan<c)return;G.yuan-=c;G[b.dataset.s]++;SFX.oneup();PL.hp=maxHP();PL.st=maxST();save();refreshFire()});
function closeFire(){fireEl.hidden=true;state='play';if(touchUI)$('#touch').hidden=false;music('off')}
$('#fireGo').onclick=()=>{closeFire();PL.state='free';PL.t=0};

/* ---------------- syncing meshes ---------------- */
function charPose(o,c,isP){const st=o.state,t=o.t;c.root.position.set(o.x,(o.y||0),o.z);c.root.rotation.y=o.fa;
 o.ph=(o.ph||0)+(o.moving?(o.sprint?.32:.22):0);const P_={walk:o.moving?1:0,ph:o.ph};
 if(isP){const cur=o.cur;
  if(st==='atk'){const c_=cur,k=t<=c_.W?t/c_.W:t<=c_.W+c_.A?(t-c_.W)/c_.A:1,ph=t<=c_.W?0:t<=c_.W+c_.A?1:2;
   if(o.heavy){P_.aR=ph===0?lerp(0,-3,k):ph===1?lerp(-3,.5,k):.5;P_.lean=ph===1?.3:0}
   else if(c_.thrust){P_.aR=ph===0?lerp(0,-.6,k):-1.5;P_.lean=ph>0?.25:-.1;P_.twist=ph===0?.4:0}
   else if(o.combo===1){P_.aR=-1.4;P_.zR=ph===0?lerp(0,1.3,k):ph===1?lerp(1.3,-1.2,k):-1.2;P_.twist=ph===0?.6:ph===1?lerp(.6,-.7,k):-.7}
   else{P_.aR=ph===0?lerp(0,-2.8,k):ph===1?lerp(-2.8,.4,k):.4;P_.lean=ph===1?.2:0}
   P_.walk=0}
  else if(st==='roll')P_.roll=Math.min(1,t/18)*TAU,P_.crouch=.15;
  else if(st==='drink'){P_.aL=-2.6;P_.nod=-.4}else if(st==='throw')P_.aR=t<10?-2.8:-.6;
  else if(st==='crit'){P_.aR=t<12?-.4:t<22?-1.5:-1;P_.lean=t>=14&&t<24?.35:0}
  else if(st==='sit'){P_.crouch=.25;P_.aR=-.4;P_.aL=-.4}
  else if(st==='hurt'||st==='bitten'||st==='gbreak')P_.lean=-.3;
  else if(o.guard){P_.aL=-1.4;P_.aR=-.8}
  else if(!o.moving)P_.aR=-.3;
  if(st==='dead'||st==='fall'){P_.tilt=0;c.root.rotation.x=0;P_.roll=-Math.min(1,t/24)*Math.PI/2;P_.crouch=Math.min(1,t/24)*.3}
 }
 pose(c,P_)}
function enemyPose(e){const c=e.m;if(c.mimic){c.root.position.set(e.x,e.state==='dorm'?0:.25,e.z);c.root.rotation.y=e.fa;const open=e.state==='dorm'?0:e.state==='act'?1.1:e.state==='wind'?(e.t%10<5?.8:.3):.3;c.lidG.rotation.x=-open;
  c.legs.forEach((l,i)=>{l.visible=e.state!=='dorm';l.rotation.x=e.moving?Math.sin(e.anim*.4+i*3)*.6:0});if(e.dead){c.root.position.y=-Math.min(1,e.dt/80)*.8}flash(c,e.flash>0&&T%3<2);return}
 c.root.position.set(e.x,e.y||0,e.z);c.root.rotation.y=e.fa;e.ph=(e.ph||0)+(e.moving?.2:0);const P_={walk:e.moving?1:0,ph:e.ph},st=e.state,t=e.t,a=e.atk||{},w=e.k;
 const wind=st==='wind'||e.sub===0&&['combo','jab','lunge','slam','sweep','charge'].includes(st);
 if(e.boss){const b=e;
  if(st==='combo'){const odd=b.n%2;P_.aR=b.sub===0?lerp(0,-2.8,b.t/12):lerp(-2.8,.4,b.t/6);if(odd){P_.aR=-1.4;P_.zR=b.sub===0?1.3:lerp(1.3,-1.2,b.t/6)}P_.walk=0}
  else if(st==='leap'||st==='belly'){P_.aR=-2.8;P_.crouch=b.sub===0?.2:0;P_.walk=0}
  else if(st==='charge'){P_.aR=-1.2;P_.walk=b.sub?1:0;P_.ph=e.ph+=.3;P_.lean=.3}
  else if(st==='spin'){P_.aR=-1.5;P_.zR=1.5;P_.walk=0}
  else if(st==='roar'||st==='unite'){P_.aR=-2.6;P_.aL=-2.6;P_.lean=-.2}
  else if(st==='lunge'){P_.aR=-1.5;P_.lean=b.sub?.35:-.1;P_.walk=b.sub?1:0;if(b.sub)P_.ph=e.ph+=.4}
  else if(st==='jab'){P_.aR=-1.5;P_.lean=b.sub?.3:0;P_.walk=0}
  else if(st==='slam'){P_.aR=b.sub?.2:lerp(0,-3,b.t/30);P_.lean=b.sub?.4:-.2;P_.walk=0}
  else if(st==='sweep'){P_.aR=-1.4;P_.zR=b.sub?-1.2:1.3;P_.twist=b.sub?-.7:.6;P_.walk=0}
  else if(st==='down'||st==='critd'){P_.crouch=.25;P_.lean=.5;P_.aR=.2}
  else if(st==='hop')P_.walk=0;
  else P_.aR=b.k==='blue'?-.5:-.3;
  if(b.dead){P_.roll=-Math.min(1,b.dt/30)*Math.PI/2;P_.crouch=.3}
  setEmo(c,b.dead?'dead':st==='down'||st==='critd'?'hurt':st==='roar'||b.shout?'shout':wind?'grit':st==='unite'?'cry':st==='rec'?'determined':'smug');
  if(b.k==='ma'&&c.blade)c.blade.material.emissive.setHex(b.phase>1?(T%6<3?0xff6a1a:0xcc4400):0x222222)}
 else{if(st==='wind'){P_.aR=w==='shield'?lerp(0,-2.8,t/20):w==='commissar'?lerp(0,-2.8,t/12):-1.4;P_.lean=-.15;P_.walk=0}
  else if(st==='act'){P_.aR=w==='shield'||w==='commissar'?lerp(-2.8,.3,t/5):-1.55;P_.lean=.3;P_.walk=1;P_.ph=e.ph+=.3}
  else if(st==='aim'){P_.aR=-1.55;P_.aL=-1.5;P_.walk=0}else if(st==='throw'){P_.aR=t<20?-2.8:-.4;P_.walk=0}else if(st==='word'){P_.aL=-1.6;P_.walk=0}
  else if(st==='stag'||st==='parried'||st==='critd'){P_.lean=-.35;P_.crouch=st==='parried'||st==='critd'?.2:0;P_.walk=0}
  else if(w==='rifle'||w==='conscript')P_.aR=-1.2;else if(w==='shield'){P_.aL=-1.2}
  if(w==='shield'&&st!=='stag'&&st!=='parried')P_.aL=-1.3;
  if(e.dead){P_.roll=-Math.min(1,e.dt/20)*Math.PI/2;P_.crouch=Math.min(1,e.dt/20)*.3;if(e.dt>80)c.root.position.y=-(e.dt-80)/60}
  setEmo(c,e.dead?'dead':st==='stag'||st==='parried'||st==='critd'?'hurt':st==='wind'||st==='aim'?'grit':st==='act'||st==='word'?'shout':st==='chase'?'determined':((T+e.id*400|0)%240<6)?'blink':'normal')}
 pose(c,P_);flash(c,e.flash>0&&T%3<2);c.root.visible=!(e.dead&&e.dt>200);if(e.dead&&e.dt>90)c.root.position.y=-(e.dt-90)/80}
const v3=new THREE.Vector3();
function sync(){const p=PL;
 sunL.position.set(p.x-6,12,p.z-4);sunL.target.position.set(p.x,0,p.z);
 // camera
 if(lockT&&!lockT.dead){const ta=Math.atan2(lockT.x-p.x,lockT.z-p.z);cy=cy+angTo(cy,ta)*.12;cp=lerp(cp,.36+clamp(2.5-Math.hypot(lockT.x-p.x,lockT.z-p.z),0,2)*.15*(lockT.s||1),.05)}else if(lockAuto>0)lockAuto--;
 if(touchUI&&!lockT&&p.moving&&!camDrag)cy=cy+angTo(cy,p.fa)*.01;
 const tx=p.x,ty=1.5+(p.y||0),tz=p.z;let dd=camD;const ox=-Math.sin(cy)*Math.cos(cp),oy=Math.sin(cp),oz=-Math.cos(cy)*Math.cos(cp);
 for(let s=.2;s<=camD;s+=.1){const x=tx+ox*s,y=ty+oy*s,z=tz+oz*s,c=cell(x,z);if(c===undefined||isWall(c)&&y<WALLH[c]+.1){dd=Math.max(.6,s-.25);break}}
 const sh=shake>0&&!RM?shake*.006:0;camera.position.set(tx+ox*dd+(rnd()-.5)*sh,ty+oy*dd+(rnd()-.5)*sh,tz+oz*dd);camera.lookAt(tx,ty+.25,tz);
 // player & others
 charPose(p,PM,true);flash(PM,false);PM.root.visible=!(p.inv>0&&!['roll','crit','fogwalk','dead','bitten','sit','fall'].includes(p.state)&&(T>>1)%2);
 setEmo(PM,heroEmo());
 for(const e of ents)enemyPose(e);for(const b of bosses)enemyPose(b);
 // stoves, items, stain, fog
 stoveObjs.forEach((s,i)=>{const lit=G.lit.includes(i);s.fl.visible=lit;s.L.intensity=lit?1.4+Math.sin(T*.3+i)*.2+rnd()*.15:0;if(lit&&T%6===0){s.fl.material.map=tex(flameCv[(T/6|0)%4]);s.fl.material.needsUpdate=true}});
 if(T%6===0)for(const f of flameSpr){f.material.map=tex(flameCv[((T/6|0)+(f.position.x|0))%4]);f.material.needsUpdate=true}
 for(const it of ITEMS)if(itemSpr[it.id]){itemSpr[it.id].visible=!G.taken.includes(it.id);itemSpr[it.id].position.y=.35+Math.sin(T/10+it.x)*.06}
 stainSpr.visible=!!G.stain;if(G.stain){stainSpr.position.set(G.stain.x,.4+Math.sin(T/8)*.05,G.stain.z);const s=.7+Math.sin(T/8)*.1;stainSpr.scale.set(s,s,1)}
 fogTex.offset.y=(T*.004)%1;waterTex.offset.y=(T*.0015)%1;ferry.position.y=Math.sin(T/40)*.06;
 for(const m of fogMeshes){const A=m.userData.A;m.visible=!G.boss[A.k]&&!(arena&&arena===A)}
 for(const o of targets()){if(!o.m||o.m.mimic)continue;const dd=Math.hypot(camera.position.x-o.x,camera.position.z-o.z);ghostC(o.m,dd<o.rad+.7&&camera.position.y<1.4*o.s+.3)}
 // laser for aiming riflemen
 const ai=ents.find(e=>!e.dead&&e.state==='aim'&&e.t<50);if(ai){laser.visible=T%4<3;const g=laser.geometry.attributes.position;g.setXYZ(0,ai.x+Math.sin(ai.fa)*.6,1,ai.z+Math.cos(ai.fa)*.6);g.setXYZ(1,p.x,.85,p.z);g.needsUpdate=true;laser.material.color.setHex(ai.t>36?0xffffff:0xff3a2a)}else laser.visible=false;
 // particles
 const fill=(P_,list)=>{let n=0;const c=new THREE.Color();for(const q of list){if(n>=P_.n)break;P_.pos[n*3]=q.x;P_.pos[n*3+1]=q.y;P_.pos[n*3+2]=q.z;c.set(q.c);P_.col[n*3]=c.r;P_.col[n*3+1]=c.g;P_.col[n*3+2]=c.b;n++}P_.g.setDrawRange(0,n);P_.g.attributes.position.needsUpdate=true;P_.g.attributes.color.needsUpdate=true};
 const S_=[],F_=[];for(const q of fx)(q.f?F_:S_).push(q);
 for(const q of projs){if(q.k==='bul'){F_.push({x:q.x,y:q.y,z:q.z,c:q.o==='p'?'#ffd24a':'#ff6a3d'},{x:q.x-q.vx,y:q.y-q.vy,z:q.z-q.vz,c:'#a03a1a'})}else if(q.k==='gren')S_.push({x:q.x,y:q.y,z:q.z,c:'#3a4030'},{x:q.x,y:q.y+.06,z:q.z,c:'#7a5230'})}
 if(LV===2)for(let i=0;i<60;i++){const k=(i*97+T*7)%300;S_.push({x:p.x+((i*37)%20-10),y:6-(k%60)/10,z:p.z+((i*53)%20-10),c:'#8a9ab0'})}
 fill(PTS.s,S_);fill(PTS.f,F_)}
function slashFX(p,c){const m=new THREE.Mesh(new THREE.RingGeometry(.7,1.5,16,1,0,Math.PI*(c.thrust?.3:.9)),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.55,side:THREE.DoubleSide,depthWrite:false}));
 m.position.set(p.x,.9,p.z);if(p.combo===1&&!p.heavy)m.rotation.set(-Math.PI/2,0,p.fa-Math.PI*.95,'YXZ');else m.rotation.set(0,p.fa+Math.PI/2,Math.PI/2+(c.thrust?.6:0),'YXZ');
 S3.add(m);projs.push({k:'slash',x:p.x,y:.9,z:p.z,life:10,mesh:m,vx:0,vy:0,vz:0,o:'fx'})}
function heroEmo(){const p=PL,st=p.state;if(st==='dead'||st==='fall')return'dead';if(st==='hurt'||st==='bitten')return'hurt';if(st==='gbreak')return'scared';if(st==='drink')return p.t>30?'happy':'normal';if(st==='sit')return p.t>60?'blink':'happy';
 if(st==='crit'||p.shout)return'shout';if(st==='atk')return p.heavy?'shout':'grit';if(p.guard)return'grit';if(p.hp<maxHP()*.25)return'scared';return(T%180)<6?'blink':'determined'}

/* ---------------- HUD (2D overlay) ---------------- */
function proj(x,y,z){v3.set(x,y,z).project(camera);if(v3.z>1)return null;return{sx:(v3.x+1)/2*W,sy:(1-v3.y)/2*H}}
function bar(x,y,w,h,v,max,c,d,dv){r(x-1,y-1,w+2,h+2,'#120d0c');r(x,y,w,h,'#2a1a18');if(dv)r(x,y,w*clamp(dv/max,0,1),h,d);r(x,y,w*clamp(v/max,0,1),h,c);r(x,y,w*clamp(v/max,0,1),1,'rgba(255,255,255,.25)')}
function hud(){const p=PL;
 for(const q of pops){const pr=proj(q.x,q.y+q.t*.01,q.z);if(!pr)continue;ctx.globalAlpha=q.t<40?1:Math.max(0,1-(q.t-40)/20);txt(q.s,pr.sx,pr.sy,q.c,'center');ctx.globalAlpha=1}
 for(const o of [p,...bosses])if(o.shout&&!o.dead){const pr=proj(o.x,(o.boss?1.75*o.s:1.75)+.25,o.z);if(pr)drawShout(o.shout.s,pr.sx,pr.sy,o===p)}
 if(lockT&&!lockT.dead){const pr=proj(lockT.x,1.0*(lockT.s||1),lockT.z);if(pr){r(pr.sx-2,pr.sy-2,4,4,'#fff');r(pr.sx-1,pr.sy-1,2,2,'#c8372d')}}
 for(const e of ents)if(!e.dead&&!e.def.mini&&e.hp<e.max&&e.state!=='dorm'){const pr=proj(e.x,1.85*e.s,e.z);if(pr){r(pr.sx-10,pr.sy,20,2,'#2a0a0a');r(pr.sx-10,pr.sy,20*e.hp/e.max,2,'#c8372d')}}
 bar(8,8,Math.round(maxHP()*.85),4,p.hp,maxHP(),'#b3261e','#e9dcc2',p.hpD);bar(8,15,Math.round(maxST()*.85),3,Math.max(0,p.st),maxST(),'#4f8a3a');
 txt('¥ '+fmtBig(G.yuan),8,22,'#d9a441');if(G.stain)txt('DROPPED ¥'+fmtBig(G.stain.val)+' ▼',8,32,'#b9e0a0');
 r(8,H-26,16,18,'#120d0c');r(9,H-25,14,16,'#2a1e18');r(13,H-23,6,10,p.flask?'#c9b08a':'#5a4a3a');r(14,H-25,4,2,'#7a5a3a');txt(String(p.flask),24,H-14,'#e9dcc2');
 r(36,H-26,16,18,'#120d0c');r(37,H-25,14,16,'#2a1e18');r(43,H-22,2,8,WOOD);r(42,H-25,4,4,'#3a4030');txt(String(p.gren),52,H-14,'#e9dcc2');
 const bb=bosses.length?bosses.filter(b=>!b.dead||b.dt<30):ents.filter(e=>e.def.mini&&e.bar&&!e.dead&&e.state!=='idle');
 bb.forEach((b,i)=>{const w=220,x=W/2-w/2,y=36+i*18;stxt(b.name||b.def.name,x,y-6,'#e9dcc2',9,1,'left');bar(x,y,w,3,b.hp,b.max,'#9a1a14')});
 const tu=$('#tU');if(near&&state==='play'&&!reading){if(touchUI){if(tu.hidden||tu.textContent!==near.label){tu.textContent=near.label;tu.hidden=false}}else{const s='E  '+near.label;txt(s,W/2,H-58,'#ffd24a','center')}}else if(!tu.hidden)tu.hidden=true;
 if(reading){const m=reading.m,s=Array.isArray(m.t)?m.t[touchUI?1:0]:m.t,ls=wrap('"'+s+'"',40),h=ls.length*10+22;r(40,16,W-80,h,'rgba(10,6,4,.88)');r(40,16,W-80,1,'#ff9a3a');ls.forEach((l,i)=>txt(l,W/2,24+i*10,'#ffc07a','center'));txt('APPRAISED '+((m.z*137|0)%9000+400).toLocaleString('en-US')+' TIMES',W/2,24+ls.length*10+2,'#6e6050','center')}
 if(itemBox&&!banner){const d=IDESC[itemBox.k];ctx.globalAlpha=Math.min(1,itemBox.t/10);const fl=wrap(d.f,44),h=40+fl.length*9,y0=H/2-h/2-20;r(30,y0,W-60,h,'rgba(10,6,4,.92)');r(30,y0,W-60,1,'#d9a441');txt(d.n,W/2,y0+6,'#ffd24a','center');txt(d.d,W/2,y0+18,'#e9dcc2','center');fl.forEach((l,i)=>txt(l,W/2,y0+32+i*9,'#a8977c','center'));ctx.globalAlpha=1}
 if(areaB&&!banner&&!itemBox){const k=areaB.t,a=k<30?k/30:k>150?Math.max(0,(190-k)/40):1;stxt(areaB.z.name,W/2,62,'#e9dcc2',17,a);ctx.globalAlpha=a*.6;r(W/2-110,74,220,1,'#e9dcc2');ctx.globalAlpha=1;stxt(areaB.z.han,W/2,86,'#a8977c',11,a)}
 if(banner&&!(banner.delay>banner.t)){const k=banner.t-(banner.delay||0),a=k<20?k/20:k>banner.dur-40?Math.max(0,(banner.dur-k)/40):1;ctx.globalAlpha=a*.7;r(0,H/2-26,W,48,'#000');ctx.globalAlpha=1;stxt(banner.text,W/2,H/2-4,banner.col,banner.size||24,a);if(banner.sub)stxt(banner.sub,W/2,H/2+15,'#a8977c',9,a)}
 if(dead&&dead.t>50){const k=dead.t,a=Math.min(1,(k-50)/50);ctx.globalAlpha=a*.85;r(0,H/2-30,W,56,'#000');ctx.globalAlpha=1;stxt('YOU DIED',W/2,H/2-6,'#b3261e',34,a);if(k>110)stxt('陣亡 · YOUR GOLD YUAN IS INFLATING WHERE YOU FELL',W/2,H/2+17,'#a8977c',8,Math.min(1,(k-110)/30))}
 if(!touchUI&&state==='play'&&!document.pointerLockElement&&T%90<60)txt('CLICK TO CAPTURE MOUSE',W-8,H-12,'#6e6050','right')}
function render(){
 if(state==='scene'&&scene){scene.complete=soulScene(scene.sc,scene.t);return}
 if(state==='title'){attract();return}
 if(!PL||!G||state==='end')return;
 if(!glOK){ctx.fillStyle='#120d0c';ctx.fillRect(0,0,W,H);txt('THIS BROWSER BLOCKED 3D GRAPHICS',W/2,96,'#ff6a5a','center');txt('TRY ANOTHER BROWSER',W/2,112,'#e9dcc2','center');return}
 sync();renderer.render(S3,camera);ctx.clearRect(0,0,W,H);ctx.drawImage(VIG,0,0);
 if(PL.hp<maxHP()*.25&&!dead){ctx.globalAlpha=.12+Math.sin(T/8)*.06;r(0,0,W,H,'#c8372d');ctx.globalAlpha=1}
 hud();if(fadeA>0){ctx.globalAlpha=fadeA;r(0,0,W,H,'#000');ctx.globalAlpha=1}
 if(state==='pause'){r(0,0,W,H,'rgba(0,0,0,.6)');stxt('PAUSED',W/2,H/2-8,'#e9dcc2',24);txt('P / ESC TO RESUME',W/2,H/2+12,'#a8977c','center')}}

/* ---------------- update ---------------- */
function update(){T++;G.time++;
 if(hs>0){hs--;return}
 if(fadeA>0)fadeA=Math.max(0,fadeA-.03);if(shake>0)shake*=.85;if(shake<.5)shake=0;
 if(reading){reading.t++;if(reading.t>20&&(pressed.use||pressed.atk||PL.moving))reading=null}
 if(itemBox&&!banner){itemBox.t++;if(itemBox.t>40&&(pressed.use||pressed.atk)||itemBox.t>260)itemBox=null}
 if(areaB&&!banner&&!itemBox&&++areaB.t>190)areaB=null;if(banner&&++banner.t>banner.dur+(banner.delay||0))banner=null;
 updPlayer();for(const e of ents)updEnemy(e);for(const b of bosses)updBoss(b);updProjs();
 if(lockT&&(lockT.dead||Math.hypot(lockT.x-PL.x,lockT.z-PL.z)>16))lockT=null;
 for(const q of fx){q.x+=q.vx;q.y+=q.vy;q.z+=q.vz;q.vy-=q.g;q.l--;if(q.y<.02&&q.g>0){q.y=.02;q.vx*=.5;q.vz*=.5;q.vy=0}}fx=fx.filter(q=>q.l>0);if(fx.length>1100)fx.splice(0,fx.length-1100);
 for(const q of pops)q.t++;pops=pops.filter(q=>q.t<60);
 if(G.stain){const s=G.stain;if(T%60===0)s.val=Math.max(Math.round(s.orig*.2),Math.round(s.val*.99));if(Math.hypot(PL.x-s.x,PL.z-s.z)<.7&&PL.state!=='dead'){G.yuan+=s.val;pop(PL.x,1.9,PL.z,'+¥'+fmtBig(s.val)+' (NOW WORTH LESS)','#b9e0a0');spark(s.x,.4,s.z,20,'#b9e0a0');SFX.pick();G.stain=null}}
 if(T%300===0&&rnd()<.6)SFX.far();
 findNear();setZone(zoneAt(PL.z));
 if(held('camL'))cy+=.04;if(held('camR'))cy-=.04;if(held('camU'))cp=clamp(cp+.02,-.15,1.1);if(held('camD'))cp=clamp(cp-.02,-.15,1.1);
 if(dead){dead.t++;GLC.style.filter=`grayscale(${Math.min(.8,dead.t/80)})`;if(dead.t>=230)respawn(G.fire)}
 for(const k in pressed)delete pressed[k]}

/* ---------------- scenes & flow ---------------- */
function myArt(name,t){if(name!=='pit')return false;const K='#120d0c';const g=ctx.createLinearGradient(0,0,0,136);g.addColorStop(0,'#3a3440');g.addColorStop(1,'#8a6a5a');ctx.fillStyle=g;ctx.fillRect(0,0,W,136);r(0,108,W,28,'#4a382a');r(0,108,W,2,'#6e5640');
 for(let i=0;i<8;i++){if(i===4)continue;const f=i%2?1:-1;ctx.save();ctx.translate(26+i*44,108+(i%3)*5);ctx.rotate(-f*Math.PI/2);drawSoldier(-8,0,{fac:i%3?'kmt':'civ',face:f,emo:'dead',gun:null});ctx.restore()}
 seg(0,96,W,100,1,'#9c7c3c');for(let i=0;i<4;i++){const cx=(t*.8+i*110)%(W+40)-20,cy_=30+i*9+Math.sin(t/10+i)*3;r(cx,cy_,6,2,K)}
 const up=Math.min(1,t/90);ctx.save();ctx.translate(196,114);ctx.rotate(-Math.PI/2*(1-up));drawSoldier(-8,0,{fac:'kmt',face:1,emo:up<1?'sleep':'scared',gun:null});ctx.restore();return true}
function playScene(sc,done){scene={sc,t:0,done};state='scene';$('#touch').hidden=true;if(document.pointerLockElement)document.exitPointerLock()}
function soulScene(sc,t){ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);ctx.save();ctx.beginPath();ctx.rect(0,0,W,136);ctx.clip();if(!myArt(sc.draw,t))sceneArt(sc.draw,t);ctx.restore();
 ctx.drawImage(VIG,0,0);r(0,136,W,H-136,'#120d0c');r(0,136,W,2,'#d9a441');txt(sc.date,8,141,'#d9a441');txt(sc.place,W-8,141,'#a8977c','right');
 const shown=Math.floor(t*1.4),fl=wrap(sc.fact,47),jl=wrap(sc.joke,47);let n=0;ctx.font=F;ctx.textAlign='left';ctx.textBaseline='top';
 fl.forEach((l,i)=>{ctx.fillStyle='#e9dcc2';ctx.fillText(l.slice(0,Math.max(0,shown-n)),8,151+i*10);n+=l.length+1});
 jl.forEach((l,i)=>{ctx.fillStyle='#ff9a6a';ctx.fillText(l.slice(0,Math.max(0,shown-n)),8,153+fl.length*10+i*10);n+=l.length+1});
 if(shown>n+10&&T%40<26)txt('▶',W-16,H-12,'#d9a441');return shown>n}
const SC_INTRO={draw:'pit',date:'AUTUMN 1948',place:'NORTH OF THE YANGTZE',fact:'Nationalist press gangs seized farmers off roads and fields and marched them roped together. Vast numbers died or deserted before ever reaching the front.',joke:'You died in the column. Then you got up. The sergeant still marked you present. Find the last ferry. Get discharged.'};
const SC_END=[{draw:'boats',date:'1949',place:'THE LAST FERRY',fact:'As the mainland fell, the Nationalist government retreated to Taiwan with somewhere between one and two million soldiers and civilians. Many conscripts never saw home again.',joke:'The ferryman reads your papers. Both stamps. Very official. He nods, and drafts you into the navy.'},
 {draw:'island',date:'1949 – ???',place:'TAIWAN STRAIT',fact:'The "temporary" retreat lasted decades. The Gold Yuan, launched in August 1948 to save the economy, was close to worthless within a year.',joke:'You are finally discharged in 1987. Your back pay arrives in Gold Yuan. It buys one egg. A small egg.'}];
let built=false;
function newGame(cont){initAudio();ambient();$('#title').hidden=true;$('#end').hidden=true;$('#hud').hidden=false;
 if(!built){initGL();if(glOK)buildWorld();built=true}
 const sv=cont&&store.get(SAVEK,null);G=sv||newProgress();ending=false;
 const go=()=>{respawn(G.fire,true);if(touchUI)$('#touch').hidden=false;if(!G.seen.includes(LV)){G.seen.push(LV);areaB={t:0,z:ZONES[LV]}}};
 if(sv)go();else playScene(SC_INTRO,go)}
function finish(){if(ending)return;ending=true;music('ending');G.done=1;save();
 playScene(SC_END[0],()=>playScene(SC_END[1],()=>{state='end';$('#hud').hidden=true;$('#touch').hidden=true;$('#end').hidden=false;
  $('#endP').textContent=G.inf<1.01?'You reached the ferry with both stamps and never once rested. Inflation is impressed.':'You reached the ferry with both stamps. Prices on the mainland rose '+fmtBig((G.inf-1)*100)+'% while you rested. The war was not consulted.';
  const tm=G.time/60|0;$('#endS').innerHTML=`<dt>Time</dt><dd>${tm/60|0}m ${tm%60}s</dd><dt>Deaths</dt><dd>${G.deaths}</dd><dt>Enemies felled</dt><dd>${G.kills}</dd><dt>Gold Yuan lost to inflation</dt><dd>¥ ${fmtBig(G.lost)}</dd><dt>Soul level</dt><dd>${SL()}</dd><dt>Cycle</dt><dd>${G.ng?'NG+'+G.ng:'First war'}</dd>`;setTimeout(()=>$('#e1').focus(),50)}))}
$('#bNew').onclick=()=>newGame(false);$('#bCont').onclick=()=>newGame(true);
$('#e1').onclick=()=>{const o=G;G=newProgress(o.ng+1,{vig:o.vig,end:o.end,str:o.str,whet:Math.min(o.whet,2),vest:Math.min(o.vest,1),flaskMax:o.flaskMax,grenMax:o.grenMax,deaths:o.deaths,lost:o.lost});save();newGame(true)};
$('#e2').onclick=()=>{$('#end').hidden=true;$('#title').hidden=false;state='title';music('off');showCont()};
function showCont(){const s=store.get(SAVEK,null);$('#bCont').hidden=!(s&&!s.done)}showCont();
function togglePause(){if(state==='play'){state='pause';ambSet()}else if(state==='pause'){state='play';ambSet()}}
$('#bPause').onclick=e=>{togglePause();e.currentTarget.blur()};
$('#bSnd').onclick=e=>{initAudio();setMute(!muted);e.currentTarget.textContent=muted?'MUTE':'SND';e.currentTarget.blur()};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='play')togglePause()});

/* ---------------- input ---------------- */
const kb={},tch={},pressed={};let stickV={x:0,y:0},camDrag=false;
const KM={KeyW:'up',KeyS:'down',KeyA:'left',KeyD:'right',ArrowLeft:'camL',ArrowRight:'camR',ArrowUp:'camU',ArrowDown:'camD',KeyE:'use',KeyF:'use',Space:'roll',KeyK:'roll',ShiftLeft:'roll',KeyJ:'atk',Enter:'atk',KeyU:'heavy',KeyL:'guard',KeyQ:'lock',Tab:'lock',KeyI:'lock',KeyR:'wine',KeyG:'gren'};
const held=k=>kb[k]||tch[k];
addEventListener('keydown',e=>{if(e.code==='Escape'||e.code==='KeyP'){if(state==='fire'){$('#fireGo').click();return}if(e.code==='KeyP'||!document.pointerLockElement)togglePause();return}
 if(state==='scene'&&(e.code==='Space'||e.code==='Enter'||e.code==='KeyJ'||e.code==='KeyE')){pressed.atk=1;e.preventDefault();return}
 if(state!=='play'&&state!=='pause')return;const k=KM[e.code];if(!k)return;e.preventDefault();if(!e.repeat&&!kb[k])pressed[k]=1;kb[k]=1;initAudio()});
addEventListener('keyup',e=>{const k=KM[e.code];if(k)kb[k]=0});
cv.addEventListener('contextmenu',e=>e.preventDefault());
cv.addEventListener('mousedown',e=>{initAudio();if(touchUI)return;if(state==='scene'){pressed.atk=1;return}if(state!=='play')return;
 if(!document.pointerLockElement){try{const p_=cv.requestPointerLock();if(p_&&p_.catch)p_.catch(()=>{})}catch(_){}return}
 if(e.button===2){kb.guard=1;pressed.guard=1}else if(e.button===1){pressed.lock=1;e.preventDefault()}else pressed.atk=1});
addEventListener('mouseup',e=>{if(e.button===2)kb.guard=0});
addEventListener('mousemove',e=>{if(document.pointerLockElement===cv&&state==='play'){cy-=e.movementX*.0035;cp=clamp(cp+e.movementY*.0025,-.15,1.1)}});
let touchUI=false;const tpad=$('#touch'),sBase=$('#stickBase'),sKnob=$('#stickKnob');let stickId=null,camId=null,sx0=0,sy0=0,cx0=0,cy0=0;const btnT={};
if(matchMedia('(pointer:coarse)').matches)touchUI=true;
addEventListener('touchstart',()=>{if(!touchUI){touchUI=true;if(state==='play')tpad.hidden=false}},{passive:true});
tpad.addEventListener('touchstart',e=>{e.preventDefault();initAudio();for(const t of e.changedTouches){const b=t.target.closest&&t.target.closest('.tb');
 if(b){const k=b.dataset.k;btnT[t.identifier]=k;tch[k]=true;pressed[k]=1;b.classList.add('on');continue}
 if(t.clientX<innerWidth*.45&&stickId==null){stickId=t.identifier;sx0=t.clientX;sy0=t.clientY;sBase.hidden=false;sBase.style.left=sx0+'px';sBase.style.top=sy0+'px';sKnob.style.transform=''}
 else if(camId==null){camId=t.identifier;cx0=t.clientX;cy0=t.clientY;camDrag=true}}},{passive:false});
tpad.addEventListener('touchmove',e=>{e.preventDefault();for(const t of e.changedTouches){if(t.identifier===stickId){const dx=clamp(t.clientX-sx0,-50,50),dy=clamp(t.clientY-sy0,-50,50);stickV={x:Math.abs(dx)<8?0:dx/50,y:Math.abs(dy)<8?0:dy/50};sKnob.style.transform=`translate(${dx}px,${dy}px)`}
 else if(t.identifier===camId){cy-=(t.clientX-cx0)*.008;cp=clamp(cp+(t.clientY-cy0)*.005,-.15,1.1);cx0=t.clientX;cy0=t.clientY}}},{passive:false});
function tEnd(e){e.preventDefault();for(const t of e.changedTouches){if(t.identifier===stickId){stickId=null;stickV={x:0,y:0};sBase.hidden=true}if(t.identifier===camId){camId=null;camDrag=false}const k=btnT[t.identifier];if(k){tch[k]=false;delete btnT[t.identifier];const el=document.querySelector(`.tb[data-k=${k}]`);if(el)el.classList.remove('on')}}}
tpad.addEventListener('touchend',tEnd,{passive:false});tpad.addEventListener('touchcancel',tEnd,{passive:false});
cv.addEventListener('touchstart',()=>{if(state==='scene')pressed.atk=1},{passive:true});
function glSize(){if(!renderer)return;const st=$('#stage'),dpr=Math.min(devicePixelRatio||1,2),w=Math.min(1920,st.clientWidth*dpr|0)||RW;renderer.setSize(w,Math.round(w*H/W),false)}
function fit(){const vw=innerWidth,vh=innerHeight,s=Math.min(vw/W,vh/H);const st=$('#stage');st.style.width=Math.floor(W*s)+'px';st.style.height=Math.floor(H*s)+'px';glSize()}
addEventListener('resize',fit);

/* ---------------- loop ---------------- */
fit();
let last=performance.now(),acc=0;
function attract(){ctx.fillStyle='#070505';ctx.fillRect(0,0,W,H);const x=W/2,y=150;r(0,y,W,H-y,'#1a1210');
 const g=ctx.createRadialGradient(x,y-10,2,x,y-10,120);g.addColorStop(0,'rgba(255,140,50,.35)');g.addColorStop(1,'rgba(255,100,30,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 const fl=(T>>2)%3;r(x-9,y-14,18,14,'#6a4a3a');r(x-10,y-15,20,3,'#8a6450');r(x-6,y-10,12,8,'#1a100c');r(x-5,y-9+fl,4,7-fl,'#ff8a1a');r(x-1,y-8-fl%2,4,6,'#ffd24a');r(x-5,y-21,10,6,'#3a3a40');
 drawSoldier(x-40,y,{fac:'kmt',face:1,pose:'sit',emo:(T%240)<200?'sleep':'normal',gun:null});drawSoldier(x+24,y,{fac:'ccp',face:-1,pose:'sit',emo:'sleep',gun:null});ctx.drawImage(VIG,0,0)}
function loop(nt){acc+=Math.min(100,nt-last);last=nt;
 while(acc>=16.67){acc-=16.67;
  if(state==='play')update();
  else if(state==='scene'&&scene){scene.t++;T++;if(scene.t%3===0&&scene.t<500)SFX.type();const adv=pressed.atk||pressed.use;for(const k in pressed)delete pressed[k];if(adv&&scene.t>10){if(!scene.complete)scene.t=9999;else{const d=scene.done;scene=null;d()}}}
  else{T++;for(const k in pressed)delete pressed[k]}}
 render();requestAnimationFrame(loop)}
(document.fonts?Promise.all([document.fonts.load(F),document.fonts.load(SERIF(20))]):Promise.resolve()).catch(()=>{}).finally(()=>requestAnimationFrame(loop));
