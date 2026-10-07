/* ===================== CIVIL SLUG: VILLAGE SIEGE — true 3D (Three.js), pixel-rendered ===================== */
/* ---------------- stages: six battles, one boat ---------------- */
const MAPS={village:[
"################################",
"#p..k...#.....r.....#WWWW#....r#",
"#.......#..........v#W..W#.....#",
"#..r....P....RRRRR..#W..W#..g..#",
"#.......#....R...R..##.##......#",
"#..v.....r...R.h.R.......L.....#",
"#.......#....RR.RR.............#",
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
"#..x.....r.......x....Y...L....#",
"#......zz___............T......#",
"#...v..zz___...................#",
"################################"],
railway:[
"################################",
"#p......_.......WWW.........k..#",
"#...h...._..r...WWW....r.......#",
"#..........._...........____...#",
"#__.__.______...n..L......v_...#",
"#.......r.....____..___...._...#",
"#..v.........._..........r.....#",
"#...WW...a...._..g...WW........#",
"#...WW....r...._.....WW...m....#",
"#.__.____...__.______.....____.#",
"#.......r.............r........#",
"#..k...L.....v...x.........n...#",
"#.____...____...____.r..___.__.#",
"#.....n.......r.........Y......#",
"#..x....g...b.....h.........v..#",
"#....r.............o...........#",
"###########...########...#######",
"#.....k.................x....r.#",
"#..............................#",
"#:::::::::::::::T::::::::::::::#",
"#........x.............x.......#",
"################################"],
mountain:[
"################################",
"#p....#.....r......#.....k.....#",
"#.h...#..........r.#...........#",
"#.....#....##.....n#....r..L...#",
"#..r.......##......#...........#",
"#..........##.....v....###.....#",
"####..L.......g........###..r..#",
"#......r.....#####.............#",
"#..k.........#####..a....r...x.#",
"#.....m.................___....#",
"#..v.....r......___.........o..#",
"#............................###",
"#___..__....r.....##..g.......##",
"#.........x.......##....h..v...#",
"#...b...............r..........#",
"#.....r.....o...........m......#",
"##########....##########....####",
"#.._.....k........x......_..r..#",
"#..............................#",
"#....._.......T.......k........#",
"#.....x..............._........#",
"################################"],
river:[
"################################",
"#p...WW......r.....WW....k.....#",
"#....WW..h.........WW..r....v..#",
"#..r.......___..L........___...#",
"#.......n..._............._....#",
"#..WWW......_...r..WWW.........#",
"#..WWW..v.........gWWW....m....#",
"#.........r....a...........r...#",
"#.___..____...........____.__..#",
"#.......L....WW..x.....r.......#",
"#..k.r.......WW.........b...o..#",
"#...........g.........h........#",
"#..____.r.....______.......r...#",
"#.x...........m........x....v..#",
"###########....#######....######",
"#.....k......._........_.....r.#",
"#..x.................k.........#",
"#zzzzzz..zzzzzz.zzzzzz..zzzzzz.#",
"#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
"#~~~~~~~~~~~~~~~T~~~~~~~~~~~~~~#",
"#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
"################################"],
shanghai:[
"################################",
"#p..RRRR.....r.....RRRR...k....#",
"#...RRRR..h........RRRR....r...#",
"#...PPPP.......L...QQQQ........#",
"#..r.........n.............v...#",
"#......x...RRRRRR.....r........#",
"#.v........RRRRRR..........m...#",
"#..........QQPPQQ...a....x.....#",
"#.RRR...r................RRR...#",
"#.RRR......g......L......RRR...#",
"#.PPP..........r.....o...QQQ.r.#",
"#.......k.......x..............#",
"#..r.....RRR........RRRR..b....#",
"#....h...RRR..v..n..RRRR....g..#",
"#..x.....PPP...r....QQQQ.......#",
"#............o...........x..v..#",
"#######....##########....#######",
"#..k......r..........r.....x.r.#",
"#..............................#",
"#....._................._......#",
"#...............T..............#",
"################################"],
pier:[
"################################",
"#p..###...k.....r.....###..x...#",
"#...###.h.............###......#",
"#...###......r..L.....###..r...#",
"#..........###..........v......#",
"#..r.......###...m.............#",
"#.....x....###......r.....kk...#",
"#.v.....................o.kk...#",
"#...kk...g......a...###........#",
"#...kk......r.......###...L....#",
"#.........###.......###....r...#",
"#..L......###..v.........x.....#",
"#....r....###.......h.....b....#",
"#..h............r.......###....#",
"#.....o....kk.....x.....###.v..#",
"#...g......kk..r........###....#",
"####....#########...######...###",
"#..._.....k............_.....r.#",
"#..............................#",
"#.........x......T......x......#",
"#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
"################################"]};
const MW=32,MH=22;
const CHH0={'#':1.15,P:1.15,Q:1.15,W:2.0,F:1.8,R:1.3,Y:2.6,_:.5,z:.25,'.':0,'~':0,':':0};
let CHH=CHH0;
const L0=TEXT.kmt.levels;
const SC3={
 nanjing:{date:'APRIL 23, 1949',place:'NANJING',draw:'flags',fact:"Three days after the crossing, the capital falls. The government moves south to Guangzhou. Then to Chongqing. Then to Chengdu.",joke:"HQ calls it a 'mobile capital'. It now has wheels, and a timetable."},
 shanghai:{date:'MAY 1949',place:'SHANGHAI',draw:'bankrun',fact:"The Gold Yuan launched last August at four to the US dollar. It now trades by the million. Workers are paid twice a day.",joke:"A sack of cash buys a sack of rice. The sack is the valuable part."},
 pier:{date:'DECEMBER 1949',place:'THE LAST PIER',draw:'table',fact:"The People's Republic was proclaimed in October. The government is 'temporarily relocating' across the strait. The last boats are loading.",joke:"HQ boarded first, to inspect the boat for you. The gold boarded before HQ."}};
const STAGES=[
 {key:'village',name:'VILLAGE SIEGE',sub:['FREE THE VILLAGERS · SILENCE THE SPEAKERS','WATCH THE ROOFTOPS. CAPTURE THE TANK.'],music:'m1',
  roof:[[13.5,3.5],[17.5,6.5],[25.5,7.5],[22.5,18.5],[9.5,9.5]],
  th:{sky:['#1c1420','#4a2a2c','#a0533a','#d07040'],gnd:['#3a2630','#241a1c'],sun:'#ffc890',sunY:168,hill:['#3a2630','#2a1c22'],smoke:7,stars:60,bg:0x1c1420,fog:0x4a2a24,fogF:24,hemi:[0xffb890,0x2a1812,1.05],sunL:[0xff9050,.6],dirt:['#4a382a','#3a2c20','#5a4632','#6e5640'],wx:'ember'},
  boss:{k:'tank',name:'THE TANK OF MANY OWNERS',short:'TANK',where:'SOUTH SQUARE',hp:170,spawn:[29.5,17.5],pop:'TANK CAPTURED. REPAINT SCHEDULED. AGAIN.'},
  pre:()=>SCENES[0].pre,post:()=>SCENES[0].post,
  tx:Object.assign({},L0[0],{t900:"HQ: Snipers on the rooftops. Look up. Yes, up. The sky is also our enemy now."})},
 {key:'railway',name:'THE RAILWAY',sub:['CROSS THE PADDIES · UNTIE THE FARMERS','STOP THE ARMORED TRAIN. IT IS ON TIME.'],music:'m2',
  roof:[[17.5,1.5],[4.5,7.5],[21.5,8.5],[24.5,13.5]],
  th:{sky:['#5a6670','#7d8a88','#a9b0a0','#c8c8b0'],gnd:['#4a5a48','#3a4a3a'],sun:'#f0ecd8',sunY:120,hill:['#55665a','#46564a'],smoke:2,stars:0,bg:0x7d8a88,fog:0x8a948a,fogF:26,hemi:[0xe8f0e0,0x3a4a30,1.15],sunL:[0xfff0d0,.55],dirt:['#5a6a3e','#4a5a32','#6a7a4a','#7a6a44'],wx:'rain'},
  boss:{k:'train',name:'THE ARMORED TRAIN (FIRST ON SCHEDULE SINCE 1937)',short:'TRAIN',where:'THE RAILWAY',hp:230,spawn:[29.5,17.5],pop:'TRAIN STOPPED. FIRST DELAY IN WEEKS.'},
  pre:()=>SCENES[1].pre,post:()=>SCENES[1].post,
  tx:Object.assign({},L0[1],{start2:"HQ: The farmers are tied to fence posts. Both armies say it was the other army. Untie them anyway.",drop:"HQ: Airdrop! One machine gun and a crate of anti-malaria pills. The pills expired in 1944.",truck:"HQ: Loudspeakers in the paddies! The frogs have already defected.",t900:"HQ: Snipers in the farmhouses. The farmers ask that you shoot around the furniture."})},
 {key:'mountain',name:'THE MOUNTAIN PASS',sub:['MANCHURIA · MINUS 30 · NO COATS','HOLD THE PASS. SHOOT DOWN THE BOMBER.'],music:'m3',
  hgt:{'#':2.2},tex:{'#':'rock'},
  roof:[[11.5,4.5],[15.5,7.5],[24.5,5.5],[18.5,12.5],[6.5,2.5]],
  th:{sky:['#4a5878','#7d93b0','#b8c8dc','#dfe6ee'],gnd:['#c8d2de','#aab6c4'],sun:'#ffffff',sunY:140,hill:['#e8eef5','#c0ccd8'],smoke:0,stars:0,bg:0x9aaac0,fog:0xc8d2e0,fogF:20,hemi:[0xe8f0ff,0x8090a8,1.25],sunL:[0xffffff,.5],dirt:['#dfe6ee','#c8d2de','#f4f8fc','#b0bccb'],wx:'snow',wallTint:0xe8eef4,top:0xf2f6fa},
  boss:{k:'bomber',name:'THE BOMBER (FUEL: MOSTLY WATER)',short:'BOMBER',where:'OVERHEAD',hp:160,spawn:[28.5,17.5],pop:'BOMBER DOWN. THE FUEL WAS INDEED WATER.'},
  pre:()=>SCENES[2].pre,post:()=>SCENES[2].post,
  tx:Object.assign({},L0[2],{start2:"HQ: Correction: the coats were sold. The receipt is warm, apparently. Keep moving.",drop:"HQ: Airdrop! A machine gun and an English manual. Burn the manual for heat.",truck:"HQ: Enemy loudspeakers in the snow. They are offering coats. Do NOT listen. Okay, listen a little.",t900:"HQ: Snipers on the cliffs. They are as cold as you are, but better motivated."})},
 {key:'river',name:'THE YANGTZE',sub:['APRIL 1949 · HOLD THE RIVERBANK','SINK THE GUNBOAT. CHECK ITS FLAG FIRST.'],music:'m5',trig:14.6,
  roof:[[5.5,1.5],[19.5,2.5],[4.5,5.5],[20.5,5.5],[13.5,9.5]],
  th:{sky:['#05070f','#0b1024','#1a2440','#2a3858'],gnd:['#0e1830','#0a1020'],sun:'#f0f0d0',sunY:60,hill:['#141c30','#0e1424'],smoke:3,stars:120,bg:0x0b1024,fog:0x18223a,fogF:22,hemi:[0x8098d0,0x1a1a28,1.0],sunL:[0xb0c4ff,.45],dirt:['#3a3428','#2e2a20','#4a4232','#544a38'],wx:'none',sea:0x1a2a48},
  boss:{k:'boat',name:'THE GUNBOAT OF FLEXIBLE LOYALTY',short:'GUNBOAT',where:'THE RIVER',hp:200,spawn:[29.5,15.5],pop:'GUNBOAT SUNK. ITS FLAG WAS STILL UNDECIDED.'},
  pre:()=>SCENES[4].pre,post:()=>SC3.nanjing,
  tx:Object.assign({},L0[4],{boss:"HQ: Gunboat! Its captain changed sides twice today. Check which flag he's flying. Then shoot it anyway.",truck:"HQ: Enemy loudspeakers on the bank. They are announcing the score. Do not look at the score.",start2:"HQ: Correction. The officers have reached the far bank. And the bank after that.",t900:"HQ: Snipers in the boathouses. Also mosquitoes. Only one of them takes bribes.",win:"HQ: Gunboat sunk! Excellent. Unfortunately, a million men crossed somewhere else."})},
 {key:'shanghai',name:'SHANGHAI',sub:['MAY 1949 · PRICES DOUBLE EVERY HOUR','RETAKE THE PRINTING PRESS.'],music:'m4',
  hgt:{R:2.4,P:2.4,Q:2.4},tex:{R:'stucco'},
  roof:[[5.5,1.5],[20.5,1.5],[13.5,5.5],[3.5,8.5],[26.5,8.5],[21.5,12.5]],
  th:{sky:['#120a1a','#2a1430','#4a2040','#8a3a4a'],gnd:['#2a1a28','#1a1220'],sun:'#ffd0a0',sunY:150,hill:['#2a2030','#201828'],smoke:4,stars:20,bg:0x1a1220,fog:0x3a2438,fogF:22,hemi:[0xffc0d0,0x2a1820,1.05],sunL:[0xff8aa0,.5],dirt:['#4a4448','#3a3438','#5a5458','#2a2428'],wx:'money'},
  boss:{k:'press',name:'THE PRINTING PRESS (ENEMY-HELD)',short:'PRESS',where:'THE MINT',hp:240,spawn:[29.5,17.5],pop:'PRESS SILENCED. INFLATION CONTINUES BY ITSELF.'},
  pre:()=>SC3.shanghai,post:()=>SCENES[3].post,
  tx:Object.assign({},L0[3],{start2:"HQ: Your pay has arrived. It has already lost value during this sentence.",drop:"HQ: Airdrop! A machine gun, wrapped in banknotes. The banknotes are the packing material.",t900:"HQ: Snipers on the shophouses. Rent up there is cheaper than rice.",win:"HQ: Press secured! We will now print our victory bonus. It will be worth nothing by dinner."})},
 {key:'pier',name:'THE LAST PIER',sub:['DECEMBER 1949 · THE LAST BOAT LEAVES TODAY','HOLD THE PIER. EVERYONE ELSE IS ALREADY ON IT.'],music:'m5',bossMusic:'final',
  hgt:{'#':2.0},tex:{'#':'ware'},
  roof:[[5.5,2.5],[23.5,1.5],[12.5,5.5],[21.5,9.5],[25.5,14.5]],
  ship:{x:16,y:26},
  th:{sky:['#3a4250','#5a6474','#8a909a','#c0b8a8'],gnd:['#3a4a5a','#2a3a4a'],sun:'#fff0d0',sunY:176,hill:['#4a5464','#3a4454'],smoke:3,stars:0,bg:0x5a6474,fog:0x7a8290,fogF:30,hemi:[0xe0e4f0,0x2a2a30,1.1],sunL:[0xfff0d8,.5],dirt:['#5a5650','#4a4640','#6a665e','#3a3632'],wx:'drizzle',sea:0x2a3a4e},
  boss:{k:'mech',name:'THE WALKING BILLBOARD (FACE PENDING APPROVAL)',short:'BILLBOARD',where:'THE PIER',hp:280,spawn:[29.5,17.5],pop:'BILLBOARD DOWN. THE BOAT LEAVES IN 5 MINUTES.'},
  pre:()=>SC3.pier,post:null,
  tx:{start:"HQ: Hold the pier until the last boat sails. HQ will supervise from the boat. The boat is very well supervised.",start2:"HQ: Reminder: one suitcase per soldier. Gold bars count as a suitcase. Officers' gold does not count.",drop:"HQ: A machine gun was found on the pier. It was in the gold's luggage allowance.",truck:"HQ: Loudspeakers are telling you to stay. We are telling you to leave. Nobody is telling you the truth.",mid:"HQ: Your final Gold Yuan pay packet has been issued. Use it as a ticket. It will not work.",t900:"HQ: Snipers on the warehouses. The warehouses are empty. We packed them.",boss:"HQ: Something enormous is coming down the pier. It has a face. Nobody has approved the face.",win:"HQ: Splendid. Victory! Now please board the boat. The war is over. We lost it somewhere else."}}];
const FW={pistol:{name:'C96 MAUSER',rate:13,dmg:2,spread:.012,sfx:'shot'},tommy:{name:'TOMMY GUN',rate:5,dmg:1.6,spread:.04,sfx:'hmg',ak:'tommy'},bazooka:{name:'BAZOOKA',rate:44,rocket:1,sfx:'rocket',ak:'bazooka'}};
const WORDER=['pistol','tommy','bazooka'];
const KT=TEXT.kmt;let SI=0,ST=STAGES[0],LT=ST.tx,MAP=MAPS.village,tot={kills:0,freed:0,speakers:0,defects:0,lost:0};
const FCRIES=["DIE! CCP MTFK!","DIE! CCP MTFK!","DIE! CCP MTFK!","EAT LEAD, RED BANDITS!","FOR MY PAYCHECK!"];
const EYE=.58;

let grid=[],ents=[],props=[],pows=[],pickups=[],eproj=[],pproj=[],fx=[],wpops=[];
let px=1.5,py=1.5,pa=0,pitch=0,hz=H/2;
let nV=0,nL=0,lives=2,score=0,kills=0,freed=0,speakers=0,radioQ=[],radioCur=null,boss=null,winT=0,checkpoint={x:1.5,y:1.5,a:0},shake=0,flashA=0,flashC='#fff',hitstop=0,stats={lost:0,defects:0};
let shoutTxt='',shoutT=0,cryCD=0,killTimes=[],scene=null,tally=null,msgs={},bobP=0,lookDX=0,lookDY=0,mouseDown=false,stickV={x:0,y:0},nextLife=30000,glOK=true;

/* ---------------- three.js setup ---------------- */
const GL=$('#gl');let renderer,S3,camera,hemi,sunL,muzzleL,boomL,fireLs=[],sky,PTS={},spritesRoot;
const TXC=new Map();
function tex(cv,rep){let t=TXC.get(cv);if(!t){t=new THREE.CanvasTexture(cv);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping}TXC.set(cv,t)}return t}
function initGL(){try{renderer=new THREE.WebGLRenderer({canvas:GL,antialias:false,powerPreference:'high-performance'})}catch(e){glOK=false;return}
 renderer.setPixelRatio(1);renderer.setSize(W,H,false);renderer.setClearColor(0x1c1420);
 S3=new THREE.Scene();S3.background=new THREE.Color(0x1c1420);S3.fog=new THREE.Fog(0x4a2a24,4,24);
 camera=new THREE.PerspectiveCamera(72,W/H,.04,90);camera.rotation.order='YXZ';
 hemi=new THREE.HemisphereLight(0xffb890,0x2a1812,1.05);S3.add(hemi);
 sunL=new THREE.DirectionalLight(0xff9050,.6);sunL.position.set(-12,6,-4);S3.add(sunL);
 muzzleL=new THREE.PointLight(0xffd890,0,7,2);S3.add(muzzleL);boomL=new THREE.PointLight(0xffa050,0,10,2);S3.add(boomL);
 // sky cylinder (texture set per stage in applyTheme)
 sky=new THREE.Mesh(new THREE.CylinderGeometry(60,60,60,32,1,true),new THREE.MeshBasicMaterial({side:THREE.BackSide,fog:false,depthWrite:false}));sky.renderOrder=-1;S3.add(sky);
 // particles: sparks/blood, fire (additive), smoke
 const mkPts=(n,size,opts)=>{const pos=new Float32Array(n*3),col=new Float32Array(n*3),g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('color',new THREE.BufferAttribute(col,3));
  const m=new THREE.PointsMaterial(Object.assign({size,vertexColors:true,sizeAttenuation:true},opts));const p=new THREE.Points(g,m);p.frustumCulled=false;S3.add(p);return{p,pos,col,n,g}};
 PTS.s=mkPts(900,.05,{});PTS.f=mkPts(600,.13,{blending:THREE.AdditiveBlending,depthWrite:false,transparent:true});PTS.k=mkPts(400,.4,{transparent:true,opacity:.42,depthWrite:false})}
function skyCanvas(th){return mk(1024,256,g=>{const gr=g.createLinearGradient(0,0,0,256);gr.addColorStop(0,th.sky[0]);gr.addColorStop(.5,th.sky[1]);gr.addColorStop(.74,th.sky[2]);gr.addColorStop(.785,th.sky[3]);gr.addColorStop(.8,th.gnd[0]);gr.addColorStop(1,th.gnd[1]);g.fillStyle=gr;g.fillRect(0,0,1024,256);
  const sy=th.sunY;g.fillStyle=th.sun;g.fillRect(612,sy,22,22);g.fillRect(608,sy+4,30,14);
  const R_=seeded(46+SI);let a=24,b=12;for(let x=0;x<1024;x+=2){a=clamp(a+(R_()-.5)*5,8,SI===2?70:40);b=clamp(b+(R_()-.5)*4,4,22);R(g,x,201-a,2,a,th.hill[0]);R(g,x,203-b,2,b,th.hill[1])}
  for(let k=0;k<th.smoke;k++){const x=40+k*150;for(let i=0;i<14;i++){g.fillStyle=`rgba(30,22,24,${.5-i*.03})`;g.fillRect(x+Math.sin(i/2)*6+i*2,190-i*12,8+i,10)}}
  for(let i=0;i<th.stars;i++)R(g,R_()*1024|0,R_()*90|0,1,1,'#e9dcc2')})}
let skyTex=null,seaMesh=null;
function applyTheme(){if(!glOK)return;const th=ST.th;
 if(skyTex)skyTex.dispose();skyTex=new THREE.CanvasTexture(skyCanvas(th));skyTex.magFilter=skyTex.minFilter=THREE.NearestFilter;skyTex.generateMipmaps=false;skyTex.wrapS=THREE.RepeatWrapping;sky.material.map=skyTex;sky.material.needsUpdate=true;
 renderer.setClearColor(th.bg);S3.background=new THREE.Color(th.bg);S3.fog.color.setHex(th.fog);S3.fog.far=th.fogF;
 hemi.color.setHex(th.hemi[0]);hemi.groundColor.setHex(th.hemi[1]);hemi.intensity=th.hemi[2];sunL.color.setHex(th.sunL[0]);sunL.intensity=th.sunL[1];
 if(seaMesh){S3.remove(seaMesh);seaMesh=null}
 if(th.sea){seaMesh=new THREE.Mesh(new THREE.PlaneGeometry(160,160),new THREE.MeshLambertMaterial({color:th.sea}));seaMesh.rotation.x=-Math.PI/2;seaMesh.position.set(MW/2,-.03,MH/2);S3.add(seaMesh)}}
const TEX2={};
function wallTex(k){if(TEX2[k])return TEX2[k];let c;
 if(k==='rock')c=mk(64,64,g=>{const rr=seeded(77);R(g,0,0,64,64,'#7a808a');for(let i=0;i<40;i++){const w=6+rr()*14|0,h=4+rr()*8|0;R(g,rr()*60|0,rr()*60|0,w,h,rr()<.5?'#6a707a':'#8a909a')}for(let i=0;i<30;i++)R(g,rr()*64|0,rr()*64|0,2,1,'#4a505a');R(g,0,0,64,7,'#eef2f8');for(let x=0;x<64;x+=4)R(g,x,7,4,(x*7)%5+1,'#dfe6ee')});
 else if(k==='stucco')c=lcan(64,64,g=>{const rr=seeded(81);R(g,0,0,64,64,'#b8a88c');for(let i=0;i<50;i++)R(g,rr()*64|0,rr()*64|0,2,2,rr()<.5?'#a8987c':'#c8b89c');for(const x of[6,26,46]){R(g,x,10,12,16,'#2a2030');R(g,x+1,11,10,14,(x*3)%2?'#e8c070':'#3a3448');R(g,x+5,11,1,14,'#2a2030');R(g,x,40,12,16,'#2a2030');R(g,x+1,41,10,14,'#3a3448')}if(LANG==='zh'){R(g,0,29,64,9,'#8a3a2a');signText(g,'','銀行 米行 金號',32,33.5,62,8,'#f1d27a')}else{R(g,0,30,64,6,'#8a3a2a');g.fillStyle='#f1d27a';g.font='bold 6px monospace';g.fillText('BANK  RICE  GOLD',2,35)}});
 else c=lcan(64,64,g=>{for(let x=0;x<64;x+=4){R(g,x,0,4,64,x%8?'#5a6470':'#4a5460');R(g,x,0,1,64,'#3a4450')}for(let i=0;i<8;i++)R(g,(i*23)%60,40+(i*7)%20,3,6,'#7a4a2a');R(g,8,24,48,10,'#3a3a3a');if(LANG==='zh')signText(g,'','九號倉',32,29.5,46,9,'#e9dcc2');else{g.fillStyle='#e9dcc2';g.font='bold 7px monospace';g.fillText('GODOWN 9',12,32)}});
 return TEX2[k]=c}
const LAMB=new Map();function lamb(key,o){let m=LAMB.get(key);if(!m){m=new THREE.MeshLambertMaterial(o);LAMB.set(key,m)}return m}
function boxGeo(h,stretch){const g=new THREE.BoxGeometry(1,h,1),uv=g.attributes.uv;for(let f=0;f<6;f++){if(f===2||f===3)continue;for(let i=0;i<4;i++){const k=f*4+i;uv.setY(k,uv.getY(k)*(stretch?1:h/1.4))}}g.translate(0,h/2,0);return g}
function roofGeo(){const w=.62,d=.62,rh=.42,v=[],uv=[];const q=(a,b,c,dd,ua)=>{v.push(...a,...b,...c,...a,...c,...dd);uv.push(...ua)};
 q([-w,0,-d],[w,0,-d],[w,rh,0],[-w,rh,0],[0,0,1,0,1,1,0,0,1,1,0,1]);q([w,0,d],[-w,0,d],[-w,rh,0],[w,rh,0],[0,0,1,0,1,1,0,0,1,1,0,1]);
 v.push(-w,0,d,-w,0,-d,-w,rh,0, w,0,-d,w,0,d,w,rh,0);uv.push(0,0,1,0,.5,.5,0,0,1,0,.5,.5);
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.computeVertexNormals();return g}
let fireMat=null,flameFrames=[],fireSprites=[],decals=[];
function buildWorld(){if(!glOK)return;
 // clear old dynamic world
 if(spritesRoot)S3.remove(spritesRoot);spritesRoot=new THREE.Group();S3.add(spritesRoot);for(const l of fireLs)S3.remove(l);fireLs=[];fireSprites=[];decals=[];
 applyTheme();const groups={};for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const c=grid[y][x];if(c==='.')continue;(groups[c]=groups[c]||[]).push([x,y])}
 const th=ST.th,K=SI+'',top=lamb('top'+K,{color:th.top||0x3a2a22}),plank=tex(mk(64,64,g=>{for(let y=0;y<64;y+=8){R(g,0,y,64,8,y%16?'#7a5a3c':'#6a4a30');R(g,0,y,64,1,'#3e2e22')}}),true);
 for(const c in groups){const h=CHH[c],list=groups[c];
  if(c==='~'||c===':'){buildFlat(c,list);continue}
  const ov=ST.tex&&ST.tex[c],tint=th.wallTint||0xffffff;
  let side;if(c==='F'){fireMat=new THREE.MeshLambertMaterial({map:tex(TEX.F[0],true),emissive:0x3a1a08});side=fireMat}
  else if(ov)side=lamb('ov'+ov,{map:tex(wallTex(ov),true)});
  else if(c==='_'||c==='z')side=lamb('plank',{map:plank});
  else if(c==='R'||c==='Y')side=lamb('brickR'+K,{map:tex(TEX['#'],true),color:new THREE.Color(0xd8c8b8).multiply(new THREE.Color(tint))});
  else side=lamb('w'+c+K,{map:tex(TEX[c],true),color:tint});
  const topM=(c==='_'||c==='z')?lamb('plank',{map:plank}):top;
  const im=new THREE.InstancedMesh(boxGeo(h,c==='P'||c==='Q'),[side,side,topM,topM,side,side],list.length);const m4=new THREE.Matrix4();
  list.forEach(([x,y],i)=>{m4.makeTranslation(x+.5,0,y+.5);im.setMatrixAt(i,m4)});spritesRoot.add(im);
  if(c==='W'||c==='F'){const rt=tex(mk(32,32,g=>{R(g,0,0,32,32,c==='F'?'#2a1a14':'#3a3036');for(let y=0;y<32;y+=4){R(g,0,y,32,1,c==='F'?'#1a100c':'#26202a');for(let x=(y%8)?2:0;x<32;x+=4)R(g,x,y+1,1,3,c==='F'?'#3a2416':'#4a4048')}}),true);
   const rm=new THREE.InstancedMesh(roofGeo(),lamb('roof'+c,{map:rt,side:THREE.DoubleSide}),list.length);list.forEach(([x,y],i)=>{m4.makeTranslation(x+.5,h,y+.5);rm.setMatrixAt(i,m4)});spritesRoot.add(rm);
   // upturned eave tips on block ends
   for(const[x,y]of list){if(grid[y][x-1]!==c){const t=new THREE.Mesh(new THREE.BoxGeometry(.08,.14,.08),lamb('eave',{color:0x2a2228}));t.position.set(x-.12,h+.08,y-.12+.0);spritesRoot.add(t);const t2=t.clone();t2.position.z=y+1.12;spritesRoot.add(t2)}if(grid[y][x+1]!==c){const t=new THREE.Mesh(new THREE.BoxGeometry(.08,.14,.08),lamb('eave',{color:0x2a2228}));t.position.set(x+1.12,h+.08,y-.12);spritesRoot.add(t);const t2=t.clone();t2.position.z=y+1.12;spritesRoot.add(t2)}}}
  if(c==='F')for(const[x,y]of list){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex(flameFrames[0]),blending:THREE.AdditiveBlending,depthWrite:false,transparent:true}));sp.center.set(.5,0);sp.scale.set(1.1,1.1,1);sp.position.set(x+.5,h+.1,y+.5);spritesRoot.add(sp);fireSprites.push(sp)}
  if(c==='Y'){for(const[x,y]of list){const rf=new THREE.Mesh(new THREE.ConeGeometry(.85,.55,4),lamb('roofY',{color:0x3a3036}));rf.rotation.y=Math.PI/4;rf.position.set(x+.5,h+1.15,y+.5);spritesRoot.add(rf);for(const[dx,dz]of[[-.4,-.4],[.4,-.4],[-.4,.4],[.4,.4]]){const pst=new THREE.Mesh(new THREE.BoxGeometry(.06,.9,.06),lamb('post',{color:0x4a3220}));pst.position.set(x+.5+dx,h+.45,y+.5+dz);spritesRoot.add(pst)}}}}
 for(const[x,y]of(groups.F||[]).slice(0,99).filter((_,i)=>i%2===0)){const l=new THREE.PointLight(0xff7a2a,1.3,5,2);l.position.set(x+.5,2.2,y+.5);S3.add(l);fireLs.push(l)}
 // ground
 const dc=th.dirt,dirt=tex(sprite('dirt'+K,32,32,g=>{const R_=seeded(9);R(g,0,0,32,32,dc[0]);for(let i=0;i<60;i++)R(g,R_()*32|0,R_()*32|0,1+(R_()*2|0),1,R_()<.5?dc[1]:dc[2]);for(let i=0;i<5;i++)R(g,R_()*30|0,R_()*30|0,2,2,dc[3]);if(SI===4)for(let y=0;y<32;y+=16)R(g,0,y,32,1,dc[3]);if(SI===5)for(let y=0;y<32;y+=8)R(g,0,y,32,1,dc[3])}).n,true);dirt.repeat.set(MW,MH);
 const ground=new THREE.Mesh(new THREE.PlaneGeometry(MW,MH),lamb('ground'+K,{map:dirt}));ground.rotation.x=-Math.PI/2;ground.position.set(MW/2,0,MH/2);spritesRoot.add(ground);
 // props
 for(const p of props){const g=new THREE.Group();g.position.set(p.x,0,p.y);p.mesh=g;spritesRoot.add(g);p.mats=[];
  const M=(o)=>{const m=new THREE.MeshLambertMaterial(o);p.mats.push(m);return m};
  if(p.p==='crate'){const b=new THREE.Mesh(new THREE.BoxGeometry(.62,.62,.62),M({map:tex(PROPS.crate().n)}));b.position.y=.31;b.rotation.y=.3;g.add(b)}
  else if(p.p==='barrel'){const b=new THREE.Mesh(new THREE.CylinderGeometry(.24,.24,.62,10),M({map:tex(PROPS.barrel().n)}));b.position.y=.31;g.add(b)}
  else if(p.p==='pole'){const pole=new THREE.Mesh(new THREE.CylinderGeometry(.04,.05,1.75,6),M({color:0x4a3a2a}));pole.position.y=.87;g.add(pole);p.horns=new THREE.Group();p.horns.position.y=1.6;g.add(p.horns);
   for(const s of[-1,1]){const h=new THREE.Mesh(new THREE.CylinderGeometry(.13,.05,.32,8,1,true),M({color:0xb0b0b0,side:THREE.DoubleSide}));h.rotation.z=s*Math.PI/2.4;h.position.x=s*.16;p.horns.add(h)}
   const ban=new THREE.Mesh(new THREE.PlaneGeometry(.34,.62),M({map:tex(mk(16,30,gg=>{R(gg,0,0,16,30,'#b8322a');gg.fillStyle='#f1d27a';gg.font='900 9px serif';gg.textAlign='center';gg.fillText('解',8,12);gg.fillText('放',8,25)})),side:THREE.DoubleSide}));ban.position.set(0,1.05,.06);p.banner=ban;g.add(ban)}
  }
 for(const v of pows){const post=new THREE.Mesh(new THREE.CylinderGeometry(.05,.06,1,6),lamb('post',{color:0x4a3220}));post.position.set(v.x,.5,v.y+.12);spritesRoot.add(post);v.post=post}
 if(ST.ship)buildShip(ST.ship.x,ST.ship.y);
 if(boss)buildBoss()}
let waterMat=null;
function buildFlat(c,list){const m4=new THREE.Matrix4();
 if(c==='~'){if(!waterMat)waterMat=new THREE.MeshLambertMaterial({map:tex(mk(32,32,g=>{R(g,0,0,32,32,'#2a4a6a');for(let i=0;i<10;i++)R(g,(i*13)%28,(i*7)%30,6,1,'#4a6a8a');for(let i=0;i<6;i++)R(g,(i*19)%28,(i*11)%30,3,1,'#6a8aaa')}),true)});
  const pg=new THREE.PlaneGeometry(1,1);pg.rotateX(-Math.PI/2);const im=new THREE.InstancedMesh(pg,waterMat,list.length);list.forEach(([x,y],i)=>{m4.makeTranslation(x+.5,.015,y+.5);im.setMatrixAt(i,m4)});spritesRoot.add(im)}
 else{const tie=new THREE.BoxGeometry(.18,.06,.9),rail=new THREE.BoxGeometry(1,.07,.06);const im=new THREE.InstancedMesh(tie,lamb('tie',{color:0x4a3220}),list.length*2),ir=new THREE.InstancedMesh(rail,lamb('rail',{color:0x6a6a70}),list.length*2);
  list.forEach(([x,y],i)=>{m4.makeTranslation(x+.25,.03,y+.5);im.setMatrixAt(i*2,m4);m4.makeTranslation(x+.75,.03,y+.5);im.setMatrixAt(i*2+1,m4);m4.makeTranslation(x+.5,.08,y+.22);ir.setMatrixAt(i*2,m4);m4.makeTranslation(x+.5,.08,y+.78);ir.setMatrixAt(i*2+1,m4)});spritesRoot.add(im);spritesRoot.add(ir)}}
function buildShip(x,y){const g=new THREE.Group();g.position.set(x,0,y);const L=(c)=>lamb('ship'+c,{color:c});
 const hull=new THREE.Mesh(new THREE.BoxGeometry(14,2,3.4),L(0x2a2a30));hull.position.y=.6;g.add(hull);const red=new THREE.Mesh(new THREE.BoxGeometry(14.05,.4,3.45),L(0x8a2a22));red.position.y=-.2;g.add(red);
 const sup=new THREE.Mesh(new THREE.BoxGeometry(5,1.6,2.6),L(0xd8d0c0));sup.position.set(1,2.4,0);g.add(sup);const sup2=new THREE.Mesh(new THREE.BoxGeometry(3,1,2.2),L(0xc8c0b0));sup2.position.set(1.4,3.7,0);g.add(sup2);
 const fun=new THREE.Mesh(new THREE.CylinderGeometry(.5,.55,2.2,10),L(0x2f4f8a));fun.position.set(-2.4,3.4,0);g.add(fun);g.userData.funnel=[x-2.4,y,4.6];
 const ban=new THREE.Mesh(new THREE.PlaneGeometry(11,.9),new THREE.MeshBasicMaterial({map:tex(lcan(220,18,gg=>{R(gg,0,0,220,18,'#e9dcc2');signText(gg,'TEMPORARY RELOCATION · BACK NEXT YEAR','暫時遷移 · 明年就回來',110,9.5,214,LANG==='zh'?14:11,'#b8322a')})),fog:true}));ban.position.set(0,2.0,-1.72);ban.rotation.y=Math.PI;g.add(ban);
 const gb=new THREE.Mesh(new THREE.PlaneGeometry(4.6,.5),new THREE.MeshBasicMaterial({map:tex(lcan(120,13,gg=>{R(gg,0,0,120,13,'#d9a441');signText(gg,'GOLD: BOARDED LAST WEEK','黃金：上週已登船',60,7,116,LANG==='zh'?11:8,'#120d0c')})),fog:true}));gb.position.set(1.4,3.7,-1.11);gb.rotation.y=Math.PI;g.add(gb);
 g.position.y=.5;spritesRoot.add(g);shipFunnel=g.userData.funnel;shipFunnel[2]+=.5}
let shipFunnel=null;
function bossM(c){const m=new THREE.MeshLambertMaterial({color:c});boss.mats.push(m);return m}
function bossHead(parent,x,y,z,sc){boss.head=new THREE.Sprite(new THREE.SpriteMaterial({map:tex(sprite('hudccp|grit',40,28,gg=>frontHead(gg,'ccp','grit')).n),fog:true,alphaTest:.5}));boss.head.center.set(.5,0);boss.head.scale.set(.42*sc,.3*sc,1);boss.head.position.set(x,y,z);parent.add(boss.head)}
function wheelRow(g,n,x0,dx,z,r,col){for(let i=0;i<n;i++){const w=new THREE.Mesh(new THREE.CylinderGeometry(r,r,.12,10),bossM(col));w.rotation.x=Math.PI/2;w.position.set(x0+i*dx,r,z);g.add(w)}}
function signPlane(w,h,en,zh,bg,fg){const cw=Math.max(64,en.length*6+8);return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex(lcan(cw,14,gg=>{R(gg,0,0,cw,14,bg);if(LANG==='zh')signText(gg,en,zh,cw/2,7.5,cw-6,12,fg);else{gg.fillStyle=fg;gg.font='bold 9px monospace';gg.textAlign='center';gg.fillText(en,cw/2,11);gg.textAlign='left'}})),fog:true,side:THREE.DoubleSide}))}
function buildBoss(){const g=new THREE.Group();g.position.set(boss.x,0,boss.y);boss.mesh=g;boss.mats=[];const M=bossM,k=boss.k;
 if(k==='tank'){
  const body=M(0x5d6447),dk=M(0x434833),tr=M(0x262622);
  for(const s of[-1,1]){const t=new THREE.Mesh(new THREE.BoxGeometry(1.7,.38,.3),tr);t.position.set(0,.19,s*.56);g.add(t);for(let i=0;i<6;i++){const w=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,.32,8),M(0x4a4a44));w.rotation.x=Math.PI/2;w.position.set(-.7+i*.28,.16,s*.56);g.add(w)}}
  const hull=new THREE.Mesh(new THREE.BoxGeometry(1.6,.36,.9),body);hull.position.y=.52;g.add(hull);const slope=new THREE.Mesh(new THREE.BoxGeometry(.3,.2,.9),dk);slope.position.set(.85,.48,0);g.add(slope);
  const tur=new THREE.Group();tur.position.y=.7;g.add(tur);boss.turret=tur;const tb=new THREE.Mesh(new THREE.BoxGeometry(.8,.3,.7),body);tb.position.y=.15;tur.add(tb);const hatch=new THREE.Mesh(new THREE.CylinderGeometry(.16,.16,.06,10),dk);hatch.position.set(-.1,.32,0);tur.add(hatch);
  const bar=new THREE.Mesh(new THREE.CylinderGeometry(.05,.06,1,8),M(0x2a2a26));bar.rotation.z=-Math.PI/2;bar.position.set(.85,.17,0);tur.add(bar);
  const pc=mk(192,32,()=>{});boss.plateCv=pc;boss.plateTex=tex(pc);const plate=new THREE.Mesh(new THREE.PlaneGeometry(.9,.15),new THREE.MeshBasicMaterial({map:boss.plateTex,fog:true}));plate.rotation.y=Math.PI/2;plate.position.set(.81,.5,0);g.add(plate);drawPlate();
  bossHead(tur,-.1,.36,0,1)}
 else if(k==='train'){const body=M(0x4a5040),dk=M(0x2a2e26),rust=M(0x6a4a32);
  for(const[ox,len]of[[-1.9,1.75],[0,1.75],[1.9,1.75]]){const c=new THREE.Mesh(new THREE.BoxGeometry(len,.75,.95),ox===0?rust:body);c.position.set(ox,.62,0);g.add(c);const rf=new THREE.Mesh(new THREE.BoxGeometry(len-.1,.12,.8),dk);rf.position.set(ox,1.05,0);g.add(rf);wheelRow(g,3,ox-.6,.6,.46,.16,0x2a2a2a);wheelRow(g,3,ox-.6,.6,-.46,.16,0x2a2a2a);
   for(let i=0;i<3;i++){const sl=new THREE.Mesh(new THREE.BoxGeometry(.2,.06,.02),M(0x111111));sl.position.set(ox-.5+i*.5,.75,.48);g.add(sl);const s2=sl.clone();s2.position.z=-.48;g.add(s2)}}
  boss.turrets=[];for(const ox of[-1.9,1.9]){const tur=new THREE.Group();tur.position.set(ox,1.11,0);g.add(tur);const tb=new THREE.Mesh(new THREE.CylinderGeometry(.32,.36,.28,10),dk);tb.position.y=.14;tur.add(tb);const bar=new THREE.Mesh(new THREE.CylinderGeometry(.045,.05,.8,8),M(0x222222));bar.rotation.z=-Math.PI/2;bar.position.set(.5,.16,0);tur.add(bar);boss.turrets.push(tur)}
  const st=new THREE.Mesh(new THREE.CylinderGeometry(.12,.16,.5,8),dk);st.position.set(.5,1.3,0);g.add(st);
  const sg=signPlane(1.6,.2,'ON SCHEDULE SINCE 1937','1937年來首度準點','#e9dcc2','#120d0c');sg.position.set(0,.7,.48);g.add(sg);const sg2=sg.clone();sg2.position.z=-.48;sg2.rotation.y=Math.PI;g.add(sg2);
  bossHead(g,0,1.1,0,1)}
 else if(k==='bomber'){const body=M(0x5a6450),dk=M(0x3a4232);const p=new THREE.Group();g.add(p);boss.plane=p;
  const fus=new THREE.Mesh(new THREE.CylinderGeometry(.22,.14,2.6,10),body);fus.rotation.z=Math.PI/2;p.add(fus);const nose=new THREE.Mesh(new THREE.ConeGeometry(.22,.4,10),M(0x8a9aa8));nose.rotation.z=-Math.PI/2;nose.position.x=1.5;p.add(nose);
  const wing=new THREE.Mesh(new THREE.BoxGeometry(.6,.06,3.6),body);wing.position.x=.2;p.add(wing);const tail=new THREE.Mesh(new THREE.BoxGeometry(.35,.05,1.2),body);tail.position.x=-1.2;p.add(tail);const fin=new THREE.Mesh(new THREE.BoxGeometry(.35,.5,.05),dk);fin.position.set(-1.2,.25,0);p.add(fin);
  for(const z of[-1.6,1.6]){const st=new THREE.Mesh(new THREE.BoxGeometry(.6,.07,.25),M(0xb8322a));st.position.set(.2,.01,z);p.add(st)}
  boss.props=[];for(const z of[-.9,.9]){const eng=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,.5,8),dk);eng.rotation.z=Math.PI/2;eng.position.set(.5,-.05,z);p.add(eng);const pr=new THREE.Mesh(new THREE.BoxGeometry(.03,.6,.08),M(0x222222));pr.position.set(.77,-.05,z);p.add(pr);boss.props.push(pr)}
  bossHead(p,.85,.12,0,.8)}
 else if(k==='boat'){const body=M(0x5a6060),dk=M(0x3a3e40);const hull=new THREE.Mesh(new THREE.BoxGeometry(3.6,.5,1.1),body);hull.position.y=.2;g.add(hull);const bow=new THREE.Mesh(new THREE.ConeGeometry(.55,.9,4),body);bow.rotation.z=-Math.PI/2;bow.rotation.x=Math.PI/4;bow.position.set(2.2,.2,0);g.add(bow);
  const cab=new THREE.Mesh(new THREE.BoxGeometry(1.2,.6,.8),M(0xc8c0b0));cab.position.set(-.4,.75,0);g.add(cab);const win=new THREE.Mesh(new THREE.BoxGeometry(1.22,.12,.82),dk);win.position.set(-.4,.88,0);g.add(win);
  const mast=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,1.4,6),dk);mast.position.set(-.4,1.6,0);g.add(mast);
  boss.flagCvs=mk(24,16,()=>{});boss.flagTex=tex(boss.flagCvs);const fl=new THREE.Mesh(new THREE.PlaneGeometry(.5,.32),new THREE.MeshBasicMaterial({map:boss.flagTex,side:THREE.DoubleSide,fog:true}));fl.position.set(-.15,2.1,0);g.add(fl);boss.flag=fl;drawFlag();
  boss.turret=new THREE.Group();boss.turret.position.set(1.1,.5,0);g.add(boss.turret);const tb=new THREE.Mesh(new THREE.CylinderGeometry(.26,.3,.24,10),dk);tb.position.y=.12;boss.turret.add(tb);const bar=new THREE.Mesh(new THREE.CylinderGeometry(.045,.05,.8,8),M(0x222222));bar.rotation.z=-Math.PI/2;bar.position.set(.45,.14,0);boss.turret.add(bar);
  bossHead(g,-.4,1.05,0,1)}
 else if(k==='press'){const body=M(0x3a3a40),dk=M(0x222226),brass=M(0xb8902a);const base=new THREE.Mesh(new THREE.BoxGeometry(3,.5,1.3),dk);base.position.y=.25;g.add(base);
  for(const ox of[-1.3,1.3]){const s=new THREE.Mesh(new THREE.BoxGeometry(.3,1.6,1.2),body);s.position.set(ox,1.05,0);g.add(s)}
  boss.rollers=[];for(const[y,r]of[[.75,.28],[1.3,.24],[1.7,.2]]){const ro=new THREE.Mesh(new THREE.CylinderGeometry(r,r,2.3,12),y===1.3?brass:M(0x5a5a60));ro.rotation.z=Math.PI/2;ro.position.y=y;g.add(ro);boss.rollers.push(ro)}
  const top=new THREE.Mesh(new THREE.BoxGeometry(3,.2,1.3),body);top.position.y=1.95;g.add(top);
  const sg=signPlane(2.6,.32,'CENTRAL MINT · NOW HIRING','中央造幣廠 · 誠徵印鈔員','#b8322a','#f1d27a');sg.position.set(0,2.25,-.66);sg.rotation.y=Math.PI;g.add(sg);
  const sheet=new THREE.Mesh(new THREE.PlaneGeometry(2,.6),new THREE.MeshBasicMaterial({map:tex(mk(64,20,gg=>{R(gg,0,0,64,20,'#8aa070');for(let i=0;i<4;i++){R(gg,2+i*16,2,13,16,'#6a8050');gg.fillStyle='#e9dcc2';gg.font='6px monospace';gg.fillText('¥1M',3+i*16,12)}})),side:THREE.DoubleSide,fog:true}));sheet.rotation.x=-Math.PI/3;sheet.position.set(0,.6,-.8);g.add(sheet);
  bossHead(g,0,2.05,0,1.3)}
 else{// mech: the walking billboard
  const body=M(0x6a5a48),dk=M(0x3a3028),red=M(0xb8322a);boss.legs=[];
  for(const s of[-1,1]){const leg=new THREE.Group();leg.position.set(0,1.1,s*.4);g.add(leg);const th=new THREE.Mesh(new THREE.BoxGeometry(.22,1.1,.22),dk);th.position.y=-.55;leg.add(th);const ft=new THREE.Mesh(new THREE.BoxGeometry(.6,.14,.36),dk);ft.position.set(.1,-1.05,0);leg.add(ft);boss.legs.push(leg)}
  const torso=new THREE.Mesh(new THREE.BoxGeometry(.8,.7,1.1),body);torso.position.y=1.4;g.add(torso);
  const bb=new THREE.Mesh(new THREE.BoxGeometry(.1,1.3,2.2),red);bb.position.set(0,2.4,0);g.add(bb);
  for(const s of[-1,1]){const h=new THREE.Mesh(new THREE.CylinderGeometry(.22,.06,.5,8,1,true),M(0xb0b0b0));h.material.side=THREE.DoubleSide;h.rotation.z=-Math.PI/2;h.position.set(.35,1.6,s*.75);g.add(h)}
  const cn=new THREE.Mesh(new THREE.CylinderGeometry(.08,.09,.7,8),M(0x222222));cn.rotation.z=-Math.PI/2;cn.position.set(.6,1.3,0);g.add(cn);
  const sg=signPlane(2,.26,'FACE PENDING APPROVAL','臉部待核准','#f1d27a','#b8322a');sg.position.set(.06,1.85,0);sg.rotation.y=Math.PI/2;g.add(sg);
  bossHead(g,.08,2.0,0,3.4);boss.head.position.x=.1}
 spritesRoot.add(g)}
function drawFlag(){if(!boss||!boss.flagCvs)return;const g=boss.flagCvs.getContext('2d'),ph=boss.plate%3;if(ph===0){R(g,0,0,24,16,'#c8322a');R(g,0,0,12,8,'#2f4f8a');R(g,4,2,4,4,'#f2f2f2')}else if(ph===1){R(g,0,0,24,16,'#c8322a');R(g,3,3,4,4,'#f1d27a')}else R(g,0,0,24,16,'#f2f2f2');boss.flagTex.needsUpdate=true}
function drawPlate(){if(!boss||!boss.plateCv)return;const g=boss.plateCv.getContext('2d');R(g,0,0,192,32,'#e9dcc2');signText(g,'PROPERTY OF:','所屬',96,8,184,LANG==='zh'?12:14,'#120d0c');signText(g,PLATES[boss.plate],PLATES[boss.plate],96,23,184,LANG==='zh'?15:14,'#120d0c');boss.plateTex.needsUpdate=true}
function mkFlames(){flameFrames=[0,1,2,3].map(k=>mk(16,20,g=>{const R_=seeded(30+k*11);for(let x=0;x<16;x+=2){const h=6+R_()*13|0;for(let y=20-h;y<20;y+=2){const t=(y-(20-h))/h;R(g,x,y,2,2,t<.3?'#ffe27a':t<.6?'#ffb04a':'#ff5a1a')}}}))}
function newSprite(cv,sx,sy){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex(cv),fog:true,color:0xe8dcd0,alphaTest:.5}));sp.center.set(.5,0);sp.scale.set(sx,sy,1);spritesRoot.add(sp);return sp}
function setSpr(sp,cv,sx,sy){const t=tex(cv);if(sp.material.map!==t){sp.material.map=t;sp.material.needsUpdate=true}if(sx)sp.scale.set(sx,sy,1)}

/* ---------------- level ---------------- */
const cellH=(x,y)=>{const r_=grid[y|0];if(!r_)return 9;const c=r_[x|0];return c===undefined?9:CHH[c]??0};
function loadStage(i){if(i!=null)SI=i;ST=STAGES[SI];LT=ST.tx;MAP=MAPS[ST.key];CHH=Object.assign({},CHH0,ST.hgt||{});shipFunnel=null;grid=[];ents=[];props=[];pows=[];pickups=[];eproj=[];pproj=[];fx=[];wpops=[];boss=null;winT=0;radioQ=[];radioCur=null;
 kills=0;freed=0;speakers=0;stats={lost:0,defects:0};T=0;msgs={};shoutT=0;cryCD=0;
 MAP.forEach((row,y)=>{const g=[];[...row].forEach((c,x)=>{const cx=x+.5,cy=y+.5;
  if('#PQWFRY_z~:'.includes(c)){g.push(c);return}g.push('.');
  if(c==='p'){px=cx;py=cy;pa=0;checkpoint={x:cx,y:cy,a:0}}
  else if('rngos'.includes(c))ents.push(mkEnemy({r:'rifle',n:'runner',g:'grenadier',o:'officer',s:'surrender'}[c],cx,cy,0));
  else if(c==='m')ents.push(mkEnemy('nest',cx,cy,0));
  else if(c==='v')pows.push({x:cx,y:cy,st:'tied',t:0});
  else if(c==='L')props.push({p:'pole',x:cx,y:cy,hp:8,rad:.28,h:1.8,block:true,cool:120+rnd()*120,flash:0});
  else if(c==='k')props.push({p:'crate',x:cx,y:cy,rad:.4,h:.62,block:true});
  else if(c==='x')props.push({p:'barrel',x:cx,y:cy,hp:3,rad:.3,h:.62,block:true,flash:0});
  else if(c==='T'){const B=ST.boss;boss={k:B.k,x:cx,y:cy,x0:cx,y0:cy,z:B.k==='bomber'?3.4:0,hp:B.hp,max:B.hp,flash:0,cool:120,mg:200,burst:0,plate:0,dead:false,dt:0,active:false,spawn:300,muzz:0,yaw:Math.PI,t:0,face:0,vx:0,vy:0,wcool:200,stomp:0};if(B.k==='press'){boss.y=cy-.2}if(B.k==='boat')g[g.length-1]='~'}
  else if(c==='h')pickups.push({x:cx,y:cy,k:'rice'});else if(c==='a')pickups.push({x:cx,y:cy,k:'T'});else if(c==='b')pickups.push({x:cx,y:cy,k:'R'})});grid.push(g)});
 nV=pows.length;nL=props.filter(p=>p.p==='pole').length;
 for(const[x,y]of ST.roof){const e=mkEnemy('sniper',x,y,cellH(x,y));e.fixed=true;ents.push(e)}
 P={x:px,y:py,fy:0,vy:0,onG:true,hp:100,wpn:'pistol',ammo:{tommy:0,bazooka:0},gren:4,cool:0,muzz:0,kick:0,slashT:0,throwT:0,hurtT:0,happyT:0,dead:0,inv:0,moving:false};pitch=0;
 buildWorld();
 if(glOK){for(const e of ents)e.spr=newSprite(soldierSprite({fac:'ccp',emo:'normal',gun:'rifle'}).n,.67,.8);for(const v of pows)v.spr=newSprite(peasantSprite(true,'cry',0).n,.7,.84);for(const p of pickups)p.spr=newSprite(PROPS.pickup(p.k).n,.3,.3)}}
function mkEnemy(t,x,y,h){const hp={rifle:4,runner:3,grenadier:4,officer:6,nest:16,surrender:1,sniper:3}[t];
 if(t==='rifle'&&rnd()<.08)t='surrender';
 return{kind:'enemy',t,x,y,h,hp,max:hp,alert:false,cool:50+rnd()*90,aimT:0,atk:0,flash:0,anim:0,dead:false,dt:0,id:ents.length+1,shout:0,shoutTxt:'',los:false,strafe:rnd()<.5?1:-1,burst:0,muzzT:0,throwT:0,fallV:0}}
function blocked(x,y,r,feet,self){for(const[cx,cy]of[[x-r,y-r],[x+r,y-r],[x-r,y+r],[x+r,y+r]])if(cellH(cx,cy)>feet+.33)return true;
 for(const p of props)if(p.block&&!p.dead&&p!==self&&Math.hypot(p.x-x,p.y-y)<r+p.rad&&feet<p.h-.05)return true;
 if(self!==boss)for(const[cx,cy]of[[x-r,y-r],[x+r,y-r],[x-r,y+r],[x+r,y+r]]){const gr=grid[cy|0];if(gr&&gr[cx|0]==='~')return true}
 if(boss&&self!==boss&&boss.k!=='bomber')for(const q of bossParts())if(q.b<.5&&Math.hypot(q.x-x,q.y-y)<r+q.rad*.88&&feet<q.b+q.h-.1)return true;return false}
function bossParts(){const b=boss;if(!b)return[];const k=b.k;
 if(k==='tank')return[{x:b.x,y:b.y,b:0,h:1.15,rad:.85}];
 if(k==='train')return[-1.9,0,1.9].map(o=>({x:b.x+o,y:b.y,b:0,h:1.35,rad:.88}));
 if(k==='boat')return[-1.2,0,1.2].map(o=>({x:b.x+o,y:b.y,b:0,h:1.3,rad:.72}));
 if(k==='press')return[-1,0,1].map(o=>({x:b.x+o,y:b.y,b:0,h:2.2,rad:.75}));
 if(k==='bomber')return[{x:b.x,y:b.y,b:b.z-.35,h:.75,rad:1.35}];
 return[{x:b.x,y:b.y,b:0,h:3,rad:.8}]}
function moveE(e,dx,dy,r,feet){if(!blocked(e.x+dx,e.y,r,feet,e))e.x+=dx;if(!blocked(e.x,e.y+dy,r,feet,e))e.y+=dy}
function los3(x0,y0,z0,x1,y1,z1){const d=Math.hypot(x1-x0,y1-y0,z1-z0),n=Math.ceil(d/.12);for(let i=1;i<n;i++){const t=i/n,yy=y0+(y1-y0)*t;if(cellH(x0+(x1-x0)*t,z0+(z1-z0)*t)>yy)return false}return true}
const eyeY=()=>P.fy+EYE;
const eHead=e=>e.h+(e.t==='nest'?.35:.55);
function seesP(e){return los3(e.x,eHead(e),e.y,px,eyeY(),py)}
function wallDist3(ox,oy,oz,dx,dy,dz){let d=0;while(d<28){d+=.035;const x=ox+dx*d,y=oy+dy*d,z=oz+dz*d;if(y<=0||cellH(x,z)>y)return d-.035}return 28}
function aimDir(){const cp=Math.cos(pitch);return[Math.cos(pa)*cp,Math.sin(pitch),Math.sin(pa)*cp]}

/* ---------------- messages ---------------- */
function radio(s){if(s)radioQ.push(tr(s))}
function once(k,s){if(!msgs[k]){msgs[k]=1;radio(s)}}
function wpop(x,y,s,c='#ffd24a',life=100,z=1){wpops.push({x,y,z,s,c,life})}
function addScore(n){score=Math.max(0,score+n);if(score>=nextLife){nextLife+=40000;lives++;SFX.oneup();radio('HQ: An extra conscript has been delivered. Do not ask from where.')}}
function cry(force){if(P.dead||(!force&&cryCD>0))return;shoutTxt=pick(FCRIES);shoutT=80;cryCD=300}

/* ---------------- combat ---------------- */
function addFx(o){fx.push(o)}
function spark(x,y,z,kind){const cols=kind==='blood'?['#8a1c14','#b02a1e','#5a120c']:kind==='wall'?['#8a7656','#c9b9a0','#ffe27a']:['#fff','#ffe27a','#ffb04a'];
 for(let i=0;i<(kind==='blood'?9:6);i++)addFx({x,y,z,vx:(rnd()-.5)*.04,vy:(rnd()-.5)*.04,vz:.01+rnd()*.03,life:20+rnd()*15,c:pick(cols),g:.0025,t:'s'})}
function smokeAt(x,y,z,n){for(let i=0;i<n;i++)addFx({x:x+(rnd()-.5)*.3,y:y+(rnd()-.5)*.3,z,vx:(rnd()-.5)*.004,vy:(rnd()-.5)*.004,vz:.005+rnd()*.005,life:60+rnd()*60,c:pick(['#3a302e','#4a3e3a','#2e2624']),g:0,t:'k'})}
function explode(x,y,z,r,dmg,friendly,big){SFX.boom(big);shake=Math.max(shake,big?12:8);flashA=Math.max(flashA,.45);flashC='#fff4d0';if(big)hitstop=4;if(boomL){boomL.position.set(x,z+.5,y);boomL.intensity=4}
 for(let i=0;i<(big?60:40);i++){const a=rnd()*6.28,s=rnd()*.06;addFx({x,y,z:z+.1+rnd()*.3,vx:Math.cos(a)*s,vy:Math.sin(a)*s,vz:.01+rnd()*.05,life:16+rnd()*24,c:pick(['#fff3b0','#ffd24a','#ff8a1a','#ff5a1a','#c8372d']),g:.002,t:'f'})}
 for(let i=0;i<12;i++)addFx({x,y,z:z+.2,vx:(rnd()-.5)*.08,vy:(rnd()-.5)*.08,vz:.03+rnd()*.05,life:50,c:pick(['#3a2c20','#5a4632','#2a2420']),g:.003,t:'s'});
 smokeAt(x,y,z+.3,big?16:10);addDecal(x,y,z);
 for(const e of ents){if(e.dead)continue;const d=Math.hypot(e.x-x,e.y-y,eHead(e)-.3-z);if(d<r)hurtEnemy(e,Math.ceil(dmg*(1-d/r))+2,true)}
 for(const p of props)if(!p.dead&&p.hp&&Math.hypot(p.x-x,p.y-y)<r)hitProp(p,5);
 if(boss&&boss.active&&!boss.dead&&friendly&&bossParts().some(q=>Math.hypot(q.x-x,q.y-y)<r+q.rad*.8&&z>q.b-r&&z<q.b+q.h+r))hitBoss(dmg);
 const pd=Math.hypot(px-x,py-y,P.fy+.4-z);if(pd<r)hurtP(Math.ceil((friendly?.45:1)*dmg*2.6*(1-pd/r))+(friendly?0:6))}
function addDecal(x,y,z){if(!glOK||decals.length>40)return;const dc=sprite('scorch',32,32,g=>{for(let i=0;i<16;i++){g.fillStyle=`rgba(15,8,6,${.06+i*.035})`;const s=32-i*2;g.fillRect(16-s/2+(i%3),16-s/2+(i%2),s,s)}});
 const m=new THREE.Mesh(new THREE.PlaneGeometry(1.2,1.2),new THREE.MeshBasicMaterial({map:tex(dc.n),transparent:true,depthWrite:false,fog:true}));m.rotation.x=-Math.PI/2;m.position.set(x,Math.max(0,cellH(x,y)<1?cellH(x,y):0)+.012,y);spritesRoot.add(m);decals.push(m)}
function hurtEnemy(e,d,boom){if(e.dead)return;e.alert=true;
 if(e.t==='surrender'&&!e.ally){killE(e,'penalty');return}if(e.ally)return;
 e.hp-=d;e.flash=6;SFX.hit();spark(e.x,e.y,eHead(e)-.1,'blood');if(e.hp<=0)killE(e,boom?'boom':'')}
function killE(e,why){e.dead=true;e.dt=0;
 if(why==='penalty'){addScore(-500);wpop(e.x,e.y,'-500. EVEN THIS WAR HAS PAPERWORK','#ff6a5a');return}
 kills++;addScore({runner:150,grenadier:200,officer:1000,nest:800,sniper:600}[e.t]||100);SFX.scream();
 killTimes.push(T);killTimes=killTimes.filter(t=>T-t<150);if(killTimes.length>=3){cry();killTimes=[]}
 for(let i=0;i<12;i++)addFx({x:e.x,y:e.y,z:eHead(e)-.1,vx:(rnd()-.5)*.05,vy:(rnd()-.5)*.05,vz:.02+rnd()*.03,life:30,c:pick(['#8a1c14','#b02a1e','#5a120c']),g:.003,t:'s'});
 if(e.t==='sniper'){e.fallV=.04;wpop(e.x,e.y,'HE HAD THE HIGH GROUND. BRIEFLY.','#ffd24a',140,e.h+1)}
 if(e.t==='nest')explode(e.x,e.y,.2,1.2,6,true);
 if(e.t==='officer'){const pk={x:e.x,y:e.y,k:'gold'};pickups.push(pk);if(glOK)pk.spr=newSprite(PROPS.pickup('gold').n,.3,.3);wpop(e.x,e.y,KT.officer,'#ffd24a',150)}
 else if(rnd()<.45&&e.t!=='sniper')wpop(e.x,e.y,pick(KT.kills));
 if(kills===12)radio(LT.mid)}
function hitProp(p,d){if(p.dead||!p.hp)return;p.hp-=d;p.flash=6;SFX.clang();if(p.hp<=0){p.dead=true;
 if(p.p==='barrel'){if(p.mesh)p.mesh.visible=false;setTimeout(()=>{if(state==='play'||state==='pause')explode(p.x,p.y,.3,1.9,14,true,true)},80)}
 else if(p.p==='pole'){speakers++;addScore(500);explode(p.x,p.y,1.6,.8,3,true);if(p.horns){p.horns.visible=false;p.banner.rotation.z=.6;p.banner.position.y=.5}wpop(p.x,p.y,'SPEAKER SILENCED. SLOGANS CONTINUE ELSEWHERE','#9fe0a0',150,2)}}}
function hitBoss(d){if(!boss||boss.dead||!boss.active)return;boss.hp-=d;boss.flash=4;if(T%3===0)SFX.clang();
 const ph=Math.min(PLATES.length-1,Math.floor((1-boss.hp/boss.max)*4)+1);if(boss.hp>0&&ph!==boss.plate){boss.plate=ph;if(boss.k==='tank'){drawPlate();wpop(boss.x,boss.y,'OWNERSHIP TRANSFERRED','#ffd24a',140,1.6)}else if(boss.k==='boat'){drawFlag();wpop(boss.x,boss.y,'FLAG CHANGED. LOYALTY UNDER REVIEW','#ffd24a',140,2)}else if(boss.k==='press'){wpop(boss.x,boss.y,'PRINTING FASTER. MONEY WORTH LESS','#ffd24a',140,2.4)}else if(boss.k==='mech'){wpop(boss.x,boss.y,'FACE REVISED. STILL NOT APPROVED','#ffd24a',140,3.2)}}
 if(boss.hp<=0){boss.dead=true;boss.dt=0;hitstop=12;flashA=1;music('off');addScore(10000)}}
function hurtP(d){if(P.dead||P.inv>0||winT)return;P.hp-=d;P.hurtT=30;flashA=Math.max(flashA,.4);flashC='#c8372d';shake=Math.max(shake,5);SFX.hit();
 if(P.hp<=0){P.hp=0;P.dead=1;SFX.die();stats.lost++;radio(pick(['HQ: Conscript down. Notify next of kin. Bill them for the uniform.','HQ: We have lost a conscript. Check his pockets for our ammunition.']))}}
// vertical-cylinder hit volumes: everything you can shoot
function targets(){const out=[];for(const e of ents)if(!e.dead&&!e.ally)out.push({x:e.x,y:e.y,b:e.h,h:e.t==='nest'?.62:.8,rad:e.t==='nest'?.45:.3,hit:d=>hurtEnemy(e,d),en:1});
 for(const p of props)if(!p.dead&&p.hp)out.push({x:p.x,y:p.y,b:p.p==='pole'?1.3:0,h:p.p==='pole'?.55:.62,rad:p.p==='pole'?.34:p.rad,hit:d=>hitProp(p,d)});
 if(boss&&boss.active&&!boss.dead)for(const q of bossParts())out.push({x:q.x,y:q.y,b:q.b,h:q.h,rad:q.rad,hit:d=>hitBoss(d)});
 for(const w of eproj)if(w.k==='word')out.push({x:w.x,y:w.y,b:w.z-.15,h:.3,rad:.42,hit:()=>{if(--w.hp<=0){w.dead=1;spark(w.x,w.y,w.z,'metal');wpop(w.x,w.y,'SLOGAN REFUTED','#9fe0a0',60,w.z)}}});
 for(const v of pows)if(v.st==='tied')out.push({x:v.x,y:v.y,b:0,h:.85,rad:.25,hit:()=>freePow(v)});
 return out}
function castAt(dx,dy,dz,dmg,apply=true){const ox=px,oy=eyeY(),oz=py,wd=wallDist3(ox,oy,oz,dx,dy,dz);let best=null,bd=wd;const slack=touchUI?.25:.06;
 const l2=dx*dx+dz*dz;if(l2>1e-6)for(const t of targets()){const tt=((t.x-ox)*dx+(t.y-oz)*dz)/l2;if(tt<=.1||tt>=bd)continue;const qx=ox+dx*tt-t.x,qz=oz+dz*tt-t.y;if(qx*qx+qz*qz>t.rad*t.rad)continue;const yy=oy+dy*tt;if(yy<t.b-slack||yy>t.b+t.h+slack)continue;best=t;bd=tt}
 if(!apply)return best;const hx=ox+dx*bd,hy=oy+dy*bd,hzz=oz+dz*bd;if(best){best.hit(dmg);if(!best.en)spark(hx,hzz,hy,'metal')}else spark(hx-dx*.06,hzz-dz*.06,hy,'wall');return best}
function nearestFoe(maxD,cone){let best=null,bd=maxD;for(const e of ents){if(e.dead||e.ally||e.t==='nest'||e.t==='sniper')continue;const rx=e.x-px,ry=e.y-py,d=Math.hypot(rx,ry);if(d>bd||Math.abs(e.h-P.fy)>.4)continue;
 const a=Math.atan2(ry,rx)-pa,da=Math.abs(((a+Math.PI*3)%(Math.PI*2))-Math.PI);if(da<cone){best=e;bd=d}}return best}
function alertNear(r){for(const e of ents)if(!e.dead&&!e.alert){const d=Math.hypot(e.x-px,e.y-py);if(d<r&&(d<4||seesP(e)))alertE(e)}}
function alertE(e){e.alert=true;if(rnd()<.5&&e.t!=='nest'){e.shout=90;e.shoutTxt=pick(TAUNTS.ccp)}}
function fire(){const k=nearestFoe(1.15,.45);
 if(k&&pitch>-.5&&pitch<.5){P.slashT=14;P.cool=18;SFX.knife();hurtEnemy(k,7);return}
 const w=FW[P.wpn];if(w.ak&&P.ammo[w.ak]<=0){P.wpn='pistol';return}
 if(w.ak)P.ammo[w.ak]--;P.cool=w.rate;P.muzz=4;P.kick=w.rocket?12:P.wpn==='tommy'?3:6;flashA=Math.max(flashA,.08);flashC='#ffd890';SFX[w.sfx]();if(!w.rocket)SFX.shell();alertNear(8);if(muzzleL)muzzleL.intensity=2.4;
 const[dx,dy,dz]=aimDir();
 if(w.rocket){pproj.push({k:'rocket',x:px+dx*.4,y:py+dz*.4,z:eyeY()-.1+dy*.4,vx:dx*.16,vy:dz*.16,vz:dy*.16,life:220});shake=4}
 else{const sp=w.spread*(P.moving?1.8:1),a=pa+(rnd()-.5)*sp,pt=pitch+(rnd()-.5)*sp*.7,cp=Math.cos(pt);castAt(Math.cos(a)*cp,Math.sin(pt),Math.sin(a)*cp,w.dmg)}
 if(w.ak&&P.ammo[w.ak]<=0){P.wpn='pistol';wpop(px+dx,py+dz,KT.noammo,'#ff9a6a',90,.9)}}
function throwGren(){if(P.gren<=0)return;P.gren--;P.throwT=18;SFX.throw();const[dx,dy,dz]=aimDir();pproj.push({k:'gren',x:px+dx*.3,y:py+dz*.3,z:eyeY()-.1,vx:dx*.09,vy:dz*.09,vz:.04+dy*.08,fuse:80});if(rnd()<.4)cry()}
function freePow(v){if(v.st!=='tied')return;v.st='free';v.t=0;v.say=POW_LINES[freed%POW_LINES.length];freed++;addScore(500);SFX.pick();P.happyT=60;if(v.post)v.post.visible=false;
 const pk={x:v.x,y:v.y,k:['G','rice','T','R'][(freed-1)%4]};pickups.push(pk);if(glOK)pk.spr=newSprite(PROPS.pickup(pk.k).n,.3,.3)}

/* ---------------- update ---------------- */
function update(){
 if(hitstop>0){hitstop--;return}
 T++;if(shake>0)shake-=.5;if(flashA>0)flashA=Math.max(0,flashA-.06);if(cryCD>0)cryCD--;if(shoutT>0)shoutT--;
 if(T===50)cry(true);if(T===2)radio(LT.start);if(T===480)radio(LT.start2);if(T===900)radio(LT.t900);
 if(radioCur){if(--radioCur.t<=0)radioCur=null}else if(radioQ.length){const s=radioQ.shift();radioCur={s,t:120+s.length*3|0};radioCur.max=radioCur.t;SFX.radio()}
 updPlayer();for(const k in pressed)delete pressed[k];
 for(const e of ents)updEnemy(e);
 updProps();updBoss();updProj();updFx();
 if(winT>0&&++winT>220)startTally()}
function updPlayer(){
 if(P.inv>0)P.inv--;if(P.hurtT>0)P.hurtT--;if(P.happyT>0)P.happyT--;if(P.slashT>0)P.slashT--;if(P.throwT>0)P.throwT--;if(P.muzz>0)P.muzz--;if(P.kick>0)P.kick*=.7;
 if(P.dead){P.dead++;if(P.dead>130){if(--lives<0){gameOver();return}px=checkpoint.x;py=checkpoint.y;pa=checkpoint.a;pitch=0;Object.assign(P,{x:px,y:py,fy:cellH(px,py),vy:0,hp:100,dead:0,inv:150,gren:Math.max(P.gren,3)});wpop(px+Math.cos(pa)*1.5,py+Math.sin(pa)*1.5,pick(KT.respawn),'#ffd24a',150,.9);P.cryAt=T+60}return}
 if(P.cryAt===T)cry(true);
 let fwd=(held('fwd')?1:0)-(held('back')?1:0)-stickV.y,str=(held('sr')?1:0)-(held('sl')?1:0)+stickV.x;fwd=clamp(fwd,-1,1);str=clamp(str,-1,1);
 pa+=((held('tr')?1:0)-(held('tl')?1:0))*.045+lookDX;pitch=clamp(pitch+((held('lu')?1:0)-(held('ld')?1:0))*.03-lookDY,-1.25,1.25);lookDX=0;lookDY=0;
 const dX=Math.cos(pa),dY=Math.sin(pa),sp=.055,mx=(dX*fwd-dY*str*.85)*sp,my=(dY*fwd+dX*str*.85)*sp;P.x=px;P.y=py;moveE(P,mx,my,.22,P.fy);px=P.x;py=P.y;
 const g=Math.min(cellH(px,py),P.fy+.33);
 if(pressed.jump&&P.onG){P.vy=.11;P.onG=false;SFX.jump()}
 if(!P.onG||P.fy>g){P.vy-=.009;P.fy+=P.vy;P.onG=false;if(P.fy<=g){P.fy=g;if(P.vy<-.08){SFX.land();shake=2}P.vy=0;P.onG=true}}else{P.fy=g;P.vy=0}
 P.moving=Math.abs(fwd)+Math.abs(str)>.15&&P.onG;if(P.moving){bobP+=.18;if(Math.floor(bobP/Math.PI)!==Math.floor((bobP-.18)/Math.PI))noise(.05,.05,400)}
 if(P.cool>0)P.cool--;if((held('fire')||mouseDown)&&P.cool<=0)fire();
 if(pressed.gren)throwGren();
 if(pressed.swap){let i=WORDER.indexOf(P.wpn);for(let k=0;k<3;k++){i=(i+1)%3;const w=WORDER[i];if(w==='pistol'||P.ammo[FW[w].ak]>0){P.wpn=w;break}}SFX.clang()}
 for(const[k,w]of[['w1','pistol'],['w2','tommy'],['w3','bazooka']])if(pressed[k]&&(w==='pistol'||P.ammo[FW[w].ak]>0))P.wpn=w;
 for(const p of pickups)if(!p.dead&&Math.hypot(p.x-px,p.y-py)<.55){p.dead=1;P.happyT=50;if(p.spr)p.spr.visible=false;
  if(p.k==='rice'){P.hp=Math.min(100,P.hp+35);wpop(p.x,p.y,KT.food+' +35','#9fe0a0');SFX.pick()}
  else if(p.k==='gold'){addScore(3000);wpop(p.x,p.y,'+3000 GOLD (CONFISCATED)');SFX.pick()}
  else if(p.k==='G'){P.gren+=4;wpop(p.x,p.y,'GRENADES +4');SFX.pick()}
  else{const w=p.k==='T'?'tommy':'bazooka';P.ammo[w]+=p.k==='T'?120:6;P.wpn=w;wpop(p.x,p.y,FW[w].name+'!');SFX.weapon();if(p.k==='T')once('drop',LT.drop)}}
 for(const v of pows)if(v.st==='tied'&&Math.hypot(v.x-px,v.y-py)<.8)freePow(v);
 const tg=ST.trig||16.6;if(py>tg&&checkpoint.y<tg-.6){checkpoint={x:px,y:py,a:pa};if(boss&&!boss.active){boss.active=true;boss.cool=Math.min(boss.cool,90);radio(LT.boss);SFX.alarm();music(bossTrack());cry(true);wpop(boss.x,boss.y,ST.boss.name,'#ff6a5a',220,boss.k==='bomber'?boss.z+.6:boss.k==='mech'?3.4:1.8)}}}
const bossTrack=()=>ST.bossMusic||'boss';
const playTrack=()=>boss&&boss.active&&!boss.dead?bossTrack():ST.music;
function updEnemy(e){
 if(e.dead){e.dt++;return}
 if(e.flash>0)e.flash--;if(e.shout>0)e.shout--;if(e.muzzT>0)e.muzzT--;if(e.throwT>0)e.throwT--;if(e.atk>0)e.atk--;
 const dx=px-e.x,dy=py-e.y,d=Math.hypot(dx,dy)||1,ux=dx/d,uy=dy/d;
 if((T+e.id)%8===0)e.los=d<16&&seesP(e);
 if(e.ally){e.fade=(e.fade||0)+1;moveE(e,-ux*.02,-uy*.02,.24,e.h);e.anim++;if(e.fade>140)e.gone=true;return}
 if(!e.alert){if(e.los&&d<(e.t==='sniper'?13:9))alertE(e);return}
 if(P.dead)return;
 let mv=0,sx=0;
 switch(e.t){
 case 'rifle':if(!e.los||d>6)mv=1;else if(d<2.6)mv=-.7;sx=e.los?e.strafe*.5:0;
  if(e.aimT>0){mv=0;sx=0;if(--e.aimT===0)eShoot(e,.1,9)}else if(--e.cool<=0&&e.los&&d<12){e.aimT=24;e.cool=110+rnd()*90}break;
 case 'runner':mv=2.2;if(d<.8&&e.atk<=0&&Math.abs(P.fy-e.h)<.4){hurtP(15);e.atk=55;SFX.knife();e.shout=40;e.shoutTxt='CHARGE! (ONE RIFLE PER THREE MEN!)'}break;
 case 'grenadier':if(!e.los||d>7)mv=1;else if(d<4)mv=-.6;if(--e.cool<=0&&e.los&&d<9){e.throwT=20;setTimeout(()=>{if(!e.dead)throwE(e)},150);e.cool=180+rnd()*80}break;
 case 'officer':if(!e.los||d>8)mv=.8;else if(d<6)mv=-.6;if(e.aimT>0){mv=0;if(--e.aimT===0)eShoot(e,.085,7)}else if(--e.cool<=0&&e.los&&d<13){e.aimT=18;e.cool=120+rnd()*60}break;
 case 'sniper':if(e.aimT>0){if(--e.aimT===0){eShoot(e,.22,13,.01);SFX.shotgun()}}else if(--e.cool<=0&&e.los&&d<15){e.aimT=60;e.cool=150+rnd()*60;if(e.aimT)SFX.clang()}break;
 case 'nest':if(e.burst>0){if(T%8===0){e.burst--;eShoot(e,.12,6,.09)}}else if(--e.cool<=0&&e.los&&d<12){e.burst=5;e.cool=140}break;
 case 'surrender':mv=d>.8?.6:0;if(d<.95){e.ally=true;stats.defects++;addScore(300);wpop(e.x,e.y,pick(DEFECT),'#fff',120,1.1)}break}
 if(rnd()<.008)e.strafe*=-1;
 const sp=.016,vx=(ux*mv-uy*sx)*sp,vy=(uy*mv+ux*sx)*sp;
 if(!e.fixed&&e.t!=='nest'&&(vx||vy)){const ox=e.x,oy=e.y;moveE(e,vx,vy,.24,e.h);e.h=Math.min(cellH(e.x,e.y),e.h+.33);
  for(const o of ents)if(o!==e&&!o.dead&&Math.hypot(o.x-e.x,o.y-e.y)<.45&&!o.fixed){e.x+=(e.x-o.x)*.04;e.y+=(e.y-o.y)*.04}
  if(Math.hypot(e.x-ox,e.y-oy)>.003)e.anim++}}
function eShoot(e,spd,dmg,spread=.05){const sx=e.x,sy=e.y,sz=eHead(e)-.15,tx=px,ty=py,tz=eyeY()-.18,d=Math.hypot(tx-sx,ty-sy,tz-sz)||1;
 const vx=(tx-sx)/d+(rnd()-.5)*spread,vy=(ty-sy)/d+(rnd()-.5)*spread,vz=(tz-sz)/d+(rnd()-.5)*spread*.5;
 eproj.push({k:'bullet',x:sx+vx*.35,y:sy+vy*.35,z:sz+vz*.35,vx:vx*spd,vy:vy*spd,vz:vz*spd,dmg,life:260});e.muzzT=6;SFX.eshot()}
function throwE(e){const d=Math.hypot(px-e.x,py-e.y),t=Math.max(20,d/.06),g=.0035,z0=eHead(e);eproj.push({k:'gren',x:e.x,y:e.y,z:z0,vx:(px-e.x)/t,vy:(py-e.y)/t,vz:g*t/2-(z0-P.fy)/t,fuse:t+25});SFX.throw()}
function updProps(){for(const p of props){if(p.flash>0)p.flash--;if(p.mats)for(const m of p.mats)m.emissive.setHex(p.flash>0&&T%2?0x888888:0);
 if(p.p==='pole'&&!p.dead){if(p.horns)p.horns.rotation.y=Math.atan2(-(py-p.y),px-p.x);const d=Math.hypot(p.x-px,p.y-py);if(d<11&&--p.cool<=0&&los3(p.x,1.6,p.y,px,eyeY(),py)){p.cool=200+rnd()*80;const a=Math.atan2(py-p.y,px-p.x);eproj.push({k:'word',t:pick(SLOGANS.ccp),x:p.x,y:p.y,z:1.55,vx:Math.cos(a)*.04,vy:Math.sin(a)*.04,vz:0,hp:2,dmg:8,life:400});SFX.word();once('truck',LT.truck)}}}}
const MONEY=['¥1,000,000','¥5,000,000','¥10,000,000','GOLD YUAN!','NEW MONEY','¥50,000,000'];
function bShell(sx,sy,sz,spd){const d=Math.hypot(px-sx,py-sy)||1,a=Math.atan2(py-sy,px-sx),vz=(eyeY()-.3-sz)/(d/spd);eproj.push({k:'shell',x:sx+Math.cos(a)*.5,y:sy+Math.sin(a)*.5,z:sz,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,vz:vz*spd,life:300});SFX.boom();shake=Math.max(shake,5);boss.muzz=8}
function bWords(n,list,spd){const a0=Math.atan2(py-boss.y,px-boss.x);for(let i=0;i<n;i++){const a=a0+(i-(n-1)/2)*.28;eproj.push({k:'word',t:pick(list),x:boss.x+Math.cos(a)*.8,y:boss.y+Math.sin(a)*.8,z:boss.k==='mech'?2.2:1.4,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,vz:0,hp:2,dmg:9,life:420})}SFX.word()}
function bossDeathFx(){const b=boss,ps=bossParts();if(b.k==='bomber'){b.z=Math.max(0,b.z-.035);b.x+=Math.cos(b.yaw)*.03;b.y-=Math.sin(b.yaw)*.03;if(b.plane){b.plane.rotation.x+=.05;b.plane.rotation.z=-.4}if(T%3===0)smokeAt(b.x,b.y,b.z,2);if(b.z<=.05&&!b.crashed){b.crashed=1;explode(b.x,b.y,.3,2,0,true,true);if(b.mesh)b.mesh.visible=false}return}
 if(b.dt%8===0&&b.dt<100){const q=pick(ps);explode(q.x+(rnd()-.5)*1.2,q.y+(rnd()-.5)*.6,.5+rnd()*.5,.6,0,true,b.dt%24===0)}
 if(b.k==='tank'&&b.turret&&b.dt>60){b.turret.position.y+=.02;b.turret.rotation.z+=.03}
 if(b.k==='boat'&&b.mesh&&b.dt>40){b.mesh.position.y-=.008;b.mesh.rotation.z=Math.min(.3,b.mesh.rotation.z+.003)}
 if(b.k==='train'&&b.mesh&&b.dt>50)b.mesh.rotation.x=Math.min(.18,b.mesh.rotation.x+.004);
 if(b.k==='press'&&b.dt%3===0)for(let i=0;i<3;i++)addFx({x:b.x+(rnd()-.5)*2,y:b.y+(rnd()-.5),z:2+rnd(),vx:(rnd()-.5)*.04,vy:(rnd()-.5)*.04,vz:.02+rnd()*.03,life:90,c:pick(['#8aa070','#6a8050','#c8d8a0']),g:.0012,t:'s'});
 if(b.k==='mech'&&b.mesh&&b.dt>40)b.mesh.rotation.z=Math.max(-1.45,b.mesh.rotation.z-.025)}
function updBoss(){const b=boss;if(!b)return;if(b.mats)for(const m of b.mats)m.emissive.setHex(b.flash>0&&T%2?0x777777:0);
 if(b.k==='bomber'&&!b.dead){b.t++;const sp=b.active?(b.hp<b.max/2?.0085:.0065):.004,ang=b.t*sp,cx=15.5,cy=15.2;b.x=cx+Math.cos(ang)*10;b.y=cy+Math.sin(ang)*4;b.yaw=Math.atan2(-(b.y-(cy+Math.sin(ang-.01)*4)),b.x-(cx+Math.cos(ang-.01)*10));if(T%30===0&&b.active)SFX.engine()}
 if(!b.active)return;if(b.flash>0)b.flash--;if(b.muzz>0)b.muzz--;
 if(b.dead){b.dt++;bossDeathFx();
  if(b.dt===104){const q=b.k==='bomber'?{x:b.x,y:b.y}:b;explode(q.x,q.y,.6,1.8,0,true,true);flashA=1;radio(LT.win);SFX.fanfare();winT=1;wpop(q.x,q.y,ST.boss.pop,'#ffd24a',240,1.8)}return}
 if(P.dead)return;const k=b.k,d=Math.hypot(px-b.x,py-b.y),half=b.hp<b.max/2;b.t++;
 if(k==='tank'||k==='train'||k==='boat'){const lo=k==='train'?6:4,hi=k==='train'?25:27,spd=k==='train'?.022:k==='boat'?.016:.012;const tx=clamp(px,lo,hi),dx=tx-b.x;if(Math.abs(dx)>.6){const nx=b.x+Math.sign(dx)*spd;if(k==='boat'||!blocked(nx,b.y,.7,0,b))b.x=nx;if(T%14===0)SFX.engine()}}
 const want=Math.atan2(-(py-b.y),px-b.x);b.yaw+=clamp(((want-b.yaw+Math.PI*3)%(Math.PI*2))-Math.PI,-.03,.03);
 if(k==='mech'){b.face=want;const dd=d-3.2;if(Math.abs(dd)>.3){const nx=clamp(b.x+Math.cos(-want)*Math.sign(dd)*.014,3,28),ny=clamp(b.y-Math.sin(want)*Math.sign(dd)*.014,17.3,19.6);b.x=nx;b.y=ny;b.walk=(b.walk||0)+1;if(b.walk%30===0){SFX.boom();shake=Math.max(shake,3)}}}
 const seen=k==='bomber'?d<9:los3(b.x,k==='mech'?2:.9,b.y,px,eyeY(),py);
 if(k==='tank'||k==='train'||k==='boat'||k==='mech'){if(--b.cool<=0&&seen){let sx=b.x,sy=b.y,sz=.87;if(k==='train'){const o=(b.t>>6)%2?1.9:-1.9;sx=b.x+o;sz=1.25}if(k==='boat'){sx=b.x+1.1;sz=.7}if(k==='mech'){sz=1.3}bShell(sx,sy,sz,k==='mech'?.075:.07);b.cool=(k==='train'?95:k==='boat'?120:k==='mech'?110:150)-(half?40:0)}}
 if(k!=='press'){if(--b.mg<=0){b.burst=6;b.mg=k==='bomber'?150:190}if(b.burst>0&&T%7===0&&(seen||k==='bomber')){b.burst--;eShoot({x:b.x,y:b.y,h:k==='bomber'?b.z-.8:k==='mech'?1.2:.4,t:'tank'},.12,6,.1)}}
 if(k==='bomber'&&--b.cool<=0&&Math.hypot(px-b.x,py-b.y)<3.2){b.cool=half?55:75;for(let i=0;i<3;i++)setTimeout(()=>{if(boss&&!boss.dead&&state==='play')eproj.push({k:'shell',x:boss.x,y:boss.y,z:boss.z-.4,vx:Math.cos(boss.yaw)*.02,vy:-Math.sin(boss.yaw)*.02,vz:-.04,life:200})},i*180);SFX.throw();once('bomb','HQ: It is dropping bombs. Ours. We sold them those too.')}
 if(k==='press'){if(--b.wcool<=0){bWords(half?7:5,MONEY,.035);b.wcool=half?110:150;b.muzz=8;flashA=Math.max(flashA,.1);flashC='#c8e0a0'}if(T%5===0)addFx({x:b.x+(rnd()-.5)*2,y:b.y-.6,z:.8,vx:(rnd()-.5)*.03,vy:-.02-rnd()*.02,vz:.02,life:70,c:pick(['#8aa070','#6a8050','#c8d8a0']),g:.001,t:'s'});if(--b.cool<=0&&seen){eShoot({x:b.x,y:b.y,h:1.4,t:'tank'},.1,7,.12);b.cool=40}}
 if(k==='mech'){if(--b.wcool<=0){bWords(half?5:3,SLOGANS.ccp,.04);b.wcool=half?150:200}if(d<1.7&&--b.stomp<=0){b.stomp=90;hurtP(16);explode(b.x+Math.cos(-b.face)*.6,b.y-Math.sin(b.face)*.6,.1,.4,0,true,false);wpop(px+Math.cos(pa),py+Math.sin(pa),'STEPPED ON BY A BILLBOARD','#ff6a5a',90,.9)}}
 if(b.hp<b.max*.55&&--b.spawn<=0&&ents.filter(e=>!e.dead).length<8){const[sx,sy]=ST.boss.spawn;const e=mkEnemy('runner',sx,sy,0);e.alert=true;if(glOK)e.spr=newSprite(soldierSprite({fac:'ccp',emo:'shout',gun:'rifle',bayo:1}).n,.67,.8);ents.push(e);b.spawn=320}}
function floorAt(x,y,z){const h=cellH(x,y);return h<=z+.05?h:0}
function updProj(){
 for(const b of eproj){if(b.dead)continue;b.x+=b.vx;b.y+=b.vy;b.z+=b.vz;if(--b.life<=0){b.dead=1;continue}
  if(b.k==='gren'){b.vz-=.0035;const fl=floorAt(b.x,b.y,b.z);if(b.z<fl){b.z=fl;b.vz*=-.3;b.vx*=.5;b.vy*=.5}if(cellH(b.x,b.y)>b.z+.05){b.x-=b.vx;b.y-=b.vy;b.vx*=-.5;b.vy*=-.5}if(--b.fuse<=0){b.dead=1;explode(b.x,b.y,b.z,1.6,12,false)}continue}
  if(b.k==='word'){const a=Math.atan2(py-b.y,px-b.x);b.vx+=Math.cos(a)*.002;b.vy+=Math.sin(a)*.002;b.vz+=(eyeY()-.1-b.z)*.0006;const s=Math.hypot(b.vx,b.vy);if(s>.045){b.vx*=.045/s;b.vy*=.045/s}}
  if(b.z<=0||cellH(b.x,b.y)>b.z){b.dead=1;if(b.k==='shell')explode(b.x-b.vx,b.y-b.vy,Math.max(.1,b.z),1.5,12,false,true);else spark(b.x-b.vx,b.y-b.vy,Math.max(.05,b.z),'wall');continue}
  if(!P.dead&&Math.hypot(b.x-px,b.y-py)<(b.k==='shell'?.45:.3)&&b.z>P.fy-.1&&b.z<P.fy+EYE+.2){b.dead=1;if(b.k==='shell')explode(b.x,b.y,b.z,1.5,12,false,true);else{hurtP(b.dmg);if(b.k==='word')wpop(px+Math.cos(pa),py+Math.sin(pa),'HIT BY A SLOGAN','#ff6a5a',60,.9)}}}
 eproj=eproj.filter(b=>!b.dead);
 for(const b of pproj){if(b.dead)continue;b.x+=b.vx;b.y+=b.vy;b.z+=b.vz;
  if(b.k==='gren'){b.vz-=.0035;const fl=floorAt(b.x,b.y,b.z);if(b.z<fl){b.z=fl;b.vz*=-.3;b.vx*=.6;b.vy*=.6}if(cellH(b.x,b.y)>b.z+.05){b.x-=b.vx;b.y-=b.vy;b.vx*=-.5;b.vy*=-.5}
   let hit=false;for(const e of ents)if(!e.dead&&!e.ally&&Math.hypot(e.x-b.x,e.y-b.y)<.35&&b.z>e.h-.1&&b.z<e.h+.9)hit=true;if(--b.fuse<=0||hit){b.dead=1;explode(b.x,b.y,b.z,1.8,12,true)}continue}
  if(T%2===0)smokeAt(b.x,b.y,b.z,1);b.vx*=1.02;b.vy*=1.02;b.vz*=1.02;
  let hit=b.z<=0||cellH(b.x,b.y)>b.z||--b.life<=0;for(const e of ents)if(!e.dead&&!e.ally&&Math.hypot(e.x-b.x,e.y-b.y)<.4&&b.z>e.h-.1&&b.z<e.h+.95)hit=true;for(const p of props)if(!p.dead&&p.block&&Math.hypot(p.x-b.x,p.y-b.y)<p.rad+.1&&b.z<p.h+.1)hit=true;
  if(boss&&boss.active&&!boss.dead&&bossParts().some(q=>Math.hypot(q.x-b.x,q.y-b.y)<q.rad&&b.z>q.b-.1&&b.z<q.b+q.h+.1))hit=true;
  if(hit){b.dead=1;explode(b.x-b.vx,b.y-b.vy,Math.max(.1,b.z),1.6,12,true,true)}}
 pproj=pproj.filter(b=>!b.dead)}
function updFx(){for(const p of fx){p.x+=p.vx;p.y+=p.vy;p.z+=p.vz;p.vz-=p.g;p.life--;if(p.t==='k'){p.vx*=.99;p.vy*=.99}const fl=floorAt(p.x,p.y,p.z);if(p.z<fl){p.z=fl;p.vz*=-.3;p.vx*=.5;p.vy*=.5}}fx=fx.filter(p=>p.life>0);if(fx.length>1500)fx.splice(0,fx.length-1500);
 for(const p of wpops){p.life--;p.z+=.004}wpops=wpops.filter(p=>p.life>0);
 for(const v of pows)if(v.st==='free'){v.t++;if(v.t>140){const a=Math.atan2(v.y-py,v.x-px);const o={x:v.x,y:v.y};moveE(o,Math.cos(a)*.03,Math.sin(a)*.03,.2,0);v.x=o.x;v.y=o.y}if(v.t>320){v.st='gone';if(v.spr)v.spr.visible=false}}
 if(T%6===0)for(const f of fireSprites)if(rnd()<.5)addFx({x:f.position.x+(rnd()-.5)*.6,y:f.position.z+(rnd()-.5)*.6,z:f.position.y+.4,vx:0,vy:0,vz:.006,life:90,c:pick(['#2e2624','#3a302e']),g:0,t:'k'})}

/* ---------------- render ---------------- */
const tmpV=new THREE.Vector3();
function proj2(x,y,z){tmpV.set(x,z,y).project(camera);if(tmpV.z>1||tmpV.z<-1)return null;const d=Math.hypot(x-px,y-py);return{sx:(tmpV.x+1)/2*W,sy:(1-tmpV.y)/2*H,d}}
function syncScene(){
 // camera
 const bob=P.moving?Math.abs(Math.sin(bobP))*.025:0,dead=P.dead?Math.min(.45,P.dead/120):0;
 camera.position.set(px+(shake>0&&!RM?(rnd()-.5)*shake*.004:0),P.fy+EYE+bob-dead,py+(shake>0&&!RM?(rnd()-.5)*shake*.004:0));
 camera.rotation.y=-pa-Math.PI/2;camera.rotation.x=pitch+(shake>0&&!RM?(rnd()-.5)*shake*.003:0);camera.rotation.z=P.dead?Math.min(.5,P.dead/150):(P.moving?Math.sin(bobP)*.006:0);
 sky.position.set(px,P.fy+EYE+16.9,py);
 muzzleL.position.set(px+Math.cos(pa)*.5,eyeY(),py+Math.sin(pa)*.5);muzzleL.intensity*=.6;boomL.intensity*=.88;
 for(const l of fireLs)l.intensity=1.1+Math.sin(T*.3+l.position.x)*.25+rnd()*.25;
 if(fireMat&&T%8===0){fireMat.map=tex(TEX.F[(T>>3)%4],true);fireMat.needsUpdate=true}
 for(const f of fireSprites){setSpr(f,flameFrames[((T>>2)+(f.position.x|0))%4])}
 // characters
 for(const e of ents){if(!e.spr)continue;
  if(e.gone){e.spr.visible=false;continue}
  let fall=0;if(e.dead&&e.t==='sniper'&&e.fallV){e.dropZ=(e.dropZ||0)+e.fallV;e.fallV+=.004;const tgt=e.h;if(e.dropZ>tgt){e.dropZ=tgt;e.fallV=0}fall=e.dropZ||0}
  else fall=e.dropZ||0;
  if(e.dead){if(e.t==='nest'){setSpr(e.spr,PROPS.nest('dead').n,.85,.66)}else setSpr(e.spr,soldierSprite({fac:'ccp',emo:'dead',gun:e.t==='grenadier'?'grenade':e.t==='officer'?'pistol':'rifle',officer:e.t==='officer',dead:1}).n,.6,.6);
   e.spr.position.set(e.x+(e.t==='sniper'?.5:0)*Math.min(1,fall),e.h-fall,e.y);continue}
  const fl=e.flash>0&&T%3===0;
  if(e.t==='nest'){const s=PROPS.nest(e.flash>0?'hurt':e.burst>0?'shout':e.alert?'grit':'normal');setSpr(e.spr,fl?s.f:s.n,.85,.66);e.spr.position.set(e.x,e.h,e.y);continue}
  const moving=e.anim%60!==0&&e.alert&&!e.aimT&&!e.fixed;
  const emo=e.flash>0?'hurt':e.t==='surrender'&&!e.ally?'scared':e.ally?'happy':(e.shout>0||e.t==='runner'&&e.alert)?'shout':(e.aimT>0||e.throwT>0)?'grit':((T+e.id*40)%240<6)?'blink':'normal';
  const s=soldierSprite({fac:'ccp',pose:moving?'run':'idle',frame:(e.anim>>3)%2,emo,gun:e.t==='surrender'?null:e.t==='grenadier'?'grenade':e.t==='officer'?'pistol':'rifle',surr:e.t==='surrender'&&!e.ally,officer:e.t==='officer',item:e.t==='officer'?'board':null,throwing:e.throwT>0,bayo:e.t==='runner',muzz:e.muzzT>2,ally:e.ally});
  setSpr(e.spr,fl?s.f:s.n,.67,.8);e.spr.position.set(e.x,e.h,e.y);e.spr.material.opacity=e.ally&&e.fade>100?1-(e.fade-100)/40:1;e.spr.material.transparent=!!e.ally}
 for(const v of pows){if(!v.spr||v.st==='gone')continue;setSpr(v.spr,v.st==='tied'?peasantSprite(true,'cry',0).n:peasantSprite(false,v.t>140?'scared':'happy',(T>>3)%2).n,.7,.84);v.spr.position.set(v.x,0,v.y)}
 for(const p of pickups)if(p.spr&&!p.dead)p.spr.position.set(p.x,.04+Math.abs(Math.sin(T/20+p.x))*.06,p.y);
 if(boss&&boss.mesh){const b=boss,k=b.k;
  if(k==='boat'){if(!b.dead){b.mesh.position.set(b.x,Math.sin(T/20)*.04,b.y);b.mesh.rotation.x=Math.sin(T/27)*.03}else b.mesh.position.x=b.x}
  else b.mesh.position.set(b.x,k==='bomber'?b.z:0,b.y);
  if(k==='bomber'){b.mesh.rotation.y=b.yaw;for(const pr of b.props)pr.rotation.x+=.6;if(!b.dead)b.plane.rotation.x=Math.sin(T/40)*.12}
  if(k==='mech'&&!b.dead){b.mesh.rotation.y=b.face;const w=(b.walk||0)*.1;b.legs[0].rotation.z=Math.sin(w)*.45;b.legs[1].rotation.z=-Math.sin(w)*.45;b.mesh.position.y=Math.abs(Math.sin(w))*.06}
  if(b.turret&&!b.dead)b.turret.rotation.y=b.yaw;if(b.turrets&&!b.dead)for(const t of b.turrets)t.rotation.y=b.yaw;
  if(b.rollers&&!b.dead&&b.active)for(const ro of b.rollers)ro.rotation.x+=.12;
  if(b.flag&&T%6===0)b.flag.rotation.y=Math.sin(T/9)*.25;
  if(k==='train'&&T%5===0)smokeAt(b.x+.5,b.y,1.6,1);
  const emo=b.flash>0?'hurt':!b.active?'smug':b.hp<b.max*.35?'scared':b.muzz>0?'shout':'grit';if(b.head)setSpr(b.head,sprite('hudccp|'+emo,40,28,gg=>frontHead(gg,'ccp',emo)).n);
  if(b.active&&!b.dead&&b.hp<b.max*.5&&T%4===0)smokeAt(b.x,b.y,k==='bomber'?b.z:1,1);if(b.muzz>4&&k!=='press')for(let i=0;i<3;i++)addFx({x:b.x+Math.cos(b.yaw)*1.1,y:b.y-Math.sin(b.yaw)*1.1,z:k==='mech'?1.3:k==='bomber'?b.z:.87,vx:(rnd()-.5)*.02,vy:(rnd()-.5)*.02,vz:(rnd()-.5)*.02,life:6,c:'#ffe27a',g:0,t:'f'})}
 if(shipFunnel&&T%4===0)smokeAt(shipFunnel[0]+(rnd()-.5)*.4,shipFunnel[1],shipFunnel[2],1);
 if(waterMat&&waterMat.map)waterMat.map.offset.x=(T*.0015)%1;
 // words (slogans) as sprites
 for(const w of eproj)if(w.k==='word'){if(!w.spr){const c=wordSprite(w.t).n;w.spr=newSprite(c,c.width/c.height*.16,.16);w.spr.center.set(.5,.5)}w.spr.position.set(w.x,w.z,w.y);w.spr.visible=!w.dead}
 for(const w of eproj.concat(pproj))if(w.dead&&w.spr){spritesRoot.remove(w.spr);w.spr=null}
 // particles + projectiles into point buffers
 const fill=(P_,list)=>{let n=0;const c=new THREE.Color();for(const q of list){if(n>=P_.n)break;P_.pos[n*3]=q.x;P_.pos[n*3+1]=q.z;P_.pos[n*3+2]=q.y;c.set(q.c);P_.col[n*3]=c.r;P_.col[n*3+1]=c.g;P_.col[n*3+2]=c.b;n++}P_.g.setDrawRange(0,n);P_.g.attributes.position.needsUpdate=true;P_.g.attributes.color.needsUpdate=true};
 const S_=[],F_=[],K_=[];for(const p of fx)(p.t==='f'?F_:p.t==='k'?K_:S_).push(p);
 for(const b of eproj){if(b.k==='bullet'){F_.push({x:b.x,y:b.y,z:b.z,c:'#ff6a3d'});F_.push({x:b.x-b.vx,y:b.y-b.vy,z:b.z-b.vz,c:'#a03a1a'})}else if(b.k==='shell'){S_.push({x:b.x,y:b.y,z:b.z,c:'#1a1a1a'});F_.push({x:b.x,y:b.y,z:b.z,c:'#ff8a1a'})}else if(b.k==='gren')S_.push({x:b.x,y:b.y,z:b.z,c:'#3a4030'},{x:b.x,y:b.y,z:b.z+.05,c:'#7a5230'})}
 for(const b of pproj){if(b.k==='rocket'){S_.push({x:b.x,y:b.y,z:b.z,c:'#4a5a3a'});F_.push({x:b.x-b.vx,y:b.y-b.vy,z:b.z-b.vz,c:'#ffe27a'})}else S_.push({x:b.x,y:b.y,z:b.z,c:'#3a4030'},{x:b.x,y:b.y,z:b.z+.05,c:'#7a5230'})}
 for(const e of ents)if(e.t==='sniper'&&!e.dead&&e.aimT>0&&T%8<5)F_.push({x:e.x,y:e.y,z:e.h+.5,c:'#ffffff'},{x:e.x,y:e.y,z:e.h+.5,c:'#ffffff'});
 fill(PTS.s,S_);fill(PTS.f,F_);fill(PTS.k,K_)}
function render(){
 if(glOK&&state!=='scene'&&state!=='tally'){syncScene();renderer.render(S3,camera)}
 ctx.clearRect(0,0,W,H);
 if(!glOK){r(0,0,W,H,'#120d0c');txt('THIS BROWSER BLOCKED 3D GRAPHICS',W/2,96,'#ff6a5a','center');txt('TRY ANOTHER BROWSER OR DEVICE',W/2,112,'#e9dcc2','center');return}
 // world-anchored text
 for(const p of wpops){const pr=proj2(p.x,p.y,p.z);if(!pr||pr.d>12)continue;if(p.life<20&&T%4<2)continue;const w=tw(tr(p.s));txt(p.s,clamp(pr.sx,w/2+4,W-w/2-4),pr.sy,p.c,'center')}
 for(const e of ents)if(e.shout>0&&!e.dead){const pr=proj2(e.x,e.y,e.h+1.05);if(pr&&pr.d<10)drawShout(e.shoutTxt,pr.sx,pr.sy,false)}
 for(const v of pows){if(v.st==='free'&&v.t<140){const pr=proj2(v.x,v.y,1.05);if(pr&&pr.d<8)drawBubble(v.say,pr.sx,pr.sy)}else if(v.st==='tied'&&(T>>5)%3===0){const pr=proj2(v.x,v.y,1.0);if(pr&&pr.d<9)txt('HELP!',pr.sx-18,pr.sy,'#e9dcc2')}}
 const wx=ST.th.wx;if(wx==='ember'){for(const e of EMB){e.x-=e.v+.1+lookDXv*30;e.y+=Math.sin((T+e.ph*60)/50)*.25+(e.ash?.25:-.35)+lookDYv*30;if(e.x<-4||e.y<-4||e.y>H){e.x=W+rnd()*20;e.y=rnd()*H}if(e.x>W+30)e.x=-4;r(e.x,e.y,1,1,e.ash?'rgba(200,190,180,.4)':((T+e.ph*10|0)%20<10?'#ffaa46':'#ff6e28'))}}
 else if(wx!=='none')for(const e of EMB){const rain=wx==='rain'||wx==='drizzle';e.y+=rain?(wx==='rain'?5:3.5)+e.v*2:wx==='snow'?.5+e.v:.35+e.v*.4;e.x+=-lookDXv*30+(rain?-1:Math.sin((T+e.ph*60)/30)*.4);if(e.y>H){e.y=-4;e.x=rnd()*W}if(e.x<-4)e.x=W;if(e.x>W+4)e.x=0;
  if(rain){ctx.globalAlpha=wx==='rain'?.35:.22;seg(e.x,e.y,e.x+2,e.y-7,1,'#b8c8e0');ctx.globalAlpha=1}else if(wx==='snow')r(e.x,e.y,e.ash?2:1,e.ash?2:1,'#f4f8ff');else{const fl=(T+e.ph*40|0)%24<12;r(e.x,e.y,fl?4:3,fl?2:3,e.ash?'#8aa070':'#c8d8a0')}}
 if(state!=='title')drawViewmodel();
 ctx.drawImage(VIG,0,0);if(flashA>0){ctx.globalAlpha=Math.min(1,flashA)*(RM?.3:1)*.8;ctx.fillStyle=flashC;ctx.fillRect(0,0,W,H);ctx.globalAlpha=1}
 if(P&&P.hp<30&&!P.dead&&state==='play'){ctx.globalAlpha=.15+Math.sin(T/8)*.08;ctx.fillStyle='#c8372d';ctx.fillRect(0,0,W,H);ctx.globalAlpha=1}
 if(state!=='title')drawHUD()}
let lookDXv=0,lookDYv=0;
const EMB=Array.from({length:30},()=>({x:rnd()*W,y:rnd()*H,v:.2+rnd()*.5,ph:rnd()*6,ash:rnd()<.5}));

/* ---------------- first-person weapon + HUD (2D overlay) ---------------- */
function drawViewmodel(){if(P.dead)return;const bx=Math.sin(bobP)*(P.moving?5:1),by=Math.abs(Math.cos(bobP))*(P.moving?4:1)+P.kick+(P.onG?0:-6),u=PAL.kmt.u,d=PAL.kmt.d,cx=W/2;
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
 for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const c=grid[y][x];if(c!=='.')r(ox+x*s,oy+y*s,s,s,c==='F'?'#ff8a1a':c==='W'?'#6a4a30':c==='~'?'#2a4a7a':c===':'?'#4a4a50':c==='_'||c==='z'?'#8a6a42':c==='R'||c==='Y'?'#7a6656':'#5b4636')}
 for(const v of pows)if(v.st==='tied')r(ox+v.x*s-1,oy+v.y*s-1,3,3,T%30<15?'#9fe0a0':'#3a6a3a');
 for(const p of props)if(p.p==='pole'&&!p.dead)r(ox+p.x*s-1,oy+p.y*s-1,3,3,'#ff6a5a');
 for(const e of ents)if(e.t==='sniper'&&!e.dead&&e.alert)r(ox+e.x*s-1,oy+e.y*s-1,2,2,'#fff');
 if(boss&&!boss.dead)r(ox+boss.x*s-(boss.k==='train'?6:2),oy+boss.y*s-1,boss.k==='train'?12:4,3,'#ffd24a');
 r(ox+px*s-1,oy+py*s-1,3,3,'#fff');seg(ox+px*s,oy+py*s,ox+(px+Math.cos(pa)*2)*s,oy+(py+Math.sin(pa)*2)*s,1,'#fff');ctx.globalAlpha=1}
function drawHUD(){
 const[dx,dy,dz]=aimDir(),tgt=castAt(dx,dy,dz,0,false),cc=tgt&&tgt.en?'#ff4a3a':'#e9dcc2',cy=H/2;r(W/2-1,cy-7,2,4,cc);r(W/2-1,cy+3,2,4,cc);r(W/2-7,cy-1,4,2,cc);r(W/2+3,cy-1,4,2,cc);
 r(0,0,W,24,'#120d0cb0');
 const infl=Math.pow(1.6,T/600);txt(LZ(`PAY ¥${fmtBig(score*infl)} ≈${score/60|0} EGGS`,`薪餉 ¥${fmtBig(score*infl)} ≈${score/60|0} 顆蛋`),4,4,'#ffd24a','left',HF());
 txt(`${KT.lives} x${Math.max(0,lives)}`,4,14,'#e9dcc2','left',HF());
 txt(LZ(`VILLAGERS ${freed}/${nV}  SPEAKERS ${speakers}/${nL}`,`村民 ${freed}/${nV}　喇叭 ${speakers}/${nL}`),W-4,4,'#9fe0a0','right',HF());
 txt(LZ(`STAGE ${SI+1}/${STAGES.length} · `,`第${SI+1}/${STAGES.length}關 · `)+ST.boss.short+LZ(': ','：')+(boss&&boss.dead?tr('DONE'):boss&&boss.active?tr('ENGAGED'):ST.boss.where),W-4,14,boss&&boss.active?'#ff6a5a':'#a8977c','right',HF());
 drawMinimap();
 r(0,H-30,W,30,'#120d0c');r(0,H-30,W,2,'#5b4636');
 const hpC=P.hp>60?'#9fe0a0':P.hp>30?'#ffd24a':'#ff4a3a';txt('MORALE',8,H-26,'#a8977c');txt(`${Math.max(0,Math.ceil(P.hp))}%`,8,H-16,hpC,'left',F16);
 const em=heroEmo(),fs=sprite('hud|'+em,40,28,g=>frontHead(g,'kmt',em));r(W/2-22,H-32,44,32,'#2a1e18');r(W/2-22,H-32,44,1,'#5b4636');ctx.drawImage(fs.n,W/2-20,H-30);
 const w=FW[P.wpn],bomb=LZ(`BOMB ${P.gren}`,`手榴彈 ${P.gren}`);
 // phone: the right thumb's buttons cover the bottom-right corner, so weapon + grenades sit just right of the face
 if(touchUI){const x=W/2+28;txt(w.name,x,H-27,'#e9dcc2','left',HF());txt(w.ak?String(P.ammo[w.ak]):'∞',x,H-16,'#ffd24a','left',F16);txt(bomb,x+58,H-14,'#ff9a6a','left',HF())}
 else{txt(w.name,W-8,H-26,'#e9dcc2','right');txt(w.ak?String(P.ammo[w.ak]):'∞',W-8,H-16,'#ffd24a','right',F16);txt(bomb,W-110,H-16,'#ff9a6a','right')}
 if(Math.abs(pitch)>.15){const pv=clamp(-pitch*24,-30,30);r(W/2+40,cy-1+pv,4,2,'#a8977c')}
 if(shoutT>0)drawShout(shoutTxt,W/2,H-40,true);
 if(boss&&boss.active&&!boss.dead){const bw=120,bx=W/2-bw/2;r(bx-1,27,bw+2,6,'#120d0c');r(bx,28,bw,4,'#3a1714');r(bx,28,bw*Math.max(0,boss.hp/boss.max),4,'#e0302a');txt(boss.k==='tank'?LZ('PROPERTY OF: ','所屬：')+PLATES[boss.plate]:boss.k==='boat'?LZ('FLAG: ','旗子：')+LZ(['NATIONALIST','PEOPLE\'S','WHITE (UNDECIDED)'],['青天白日','紅旗','白旗（未決定）'])[boss.plate%3]:ST.boss.name,W/2,35,'#e9dcc2','center')}
 if(radioCur){const zh=isZ(radioCur.s),lh=zh?13:10,x=20,y=boss&&boss.active?46:28,ww=W-40-MW*2-10;if(zh)ctx.font=zf(F);const Lr=(zh?wrapBal(radioCur.s,ww-30):wrap(radioCur.s,36)).slice(0,4),h=Lr.length*lh+(zh?8:10);
  r(x,y,ww,h,'#120d0ccc');ctx.strokeStyle='#4a6aa3';ctx.lineWidth=1;ctx.strokeRect(x+.5,y+.5,ww-1,h-1);
  const hs=sprite('hud|'+((T>>3)%2?'shout':'determined'),40,28,g=>frontHead(g,'kmt',(T>>3)%2?'shout':'determined'));ctx.drawImage(hs.n,10,0,22,28,x+3,y+3,18,23);
  ctx.font=zh?zf(F):F;ctx.textAlign='left';ctx.textBaseline='top';const shown=Math.min(radioCur.s.length,(radioCur.max-radioCur.t)*(zh?1:2));let cnt=0;Lr.forEach((l,i)=>{ctx.fillStyle='#e9dcc2';ctx.fillText(l.slice(0,Math.max(0,shown-cnt)),x+24,y+(zh?5:6)+i*lh);cnt+=l.length+(zh?0:1)})}
 if(T<200&&state==='play'){txt(LZ('STAGE '+(SI+1)+' · '+ST.name,'第'+ZN[SI+1]+'關 · '+ST.name),W/2,70,'#ffd24a','center',F16);txt(ST.sub[0],W/2,92,'#e9dcc2','center');txt(ST.sub[1],W/2,LANG==='zh'?107:104,'#a8977c','center')}
 if(winT>30)txt(SI===STAGES.length-1?'PIER HELD! BOAT LEAVING!':'STAGE COMPLETE!',W/2,80,'#ffd24a','center',F16);
 if(P.dead)txt('YOU HAVE BEEN DEMOBILIZED',W/2,80,'#ff6a5a','center');
 if(state==='pause'){r(0,0,W,H,'#0008');txt('PAUSED',W/2,92,'#ffd24a','center',F16);txt('THE WAR WILL WAIT. IT ALWAYS DOES.',W/2,116,'#e9dcc2','center')}}

/* ---------------- flow ---------------- */
function showScene(sc,done){state='scene';scene={sc,t:0,done};music('ending');$('#touch').hidden=true;$('#hud').hidden=true;try{document.exitPointerLock&&document.exitPointerLock()}catch(e){}}
function startGame(i){i=i|0;endSeen=false;initAudio();lives=2;score=0;nextLife=30000;tot={kills:0,freed:0,speakers:0,defects:0,lost:0};$('#title').hidden=true;$('#end').hidden=true;loadStage(i);showScene(ST.pre(),beginPlay)}
function beginPlay(){state='play';T=0;music(ST.music);$('#hud').hidden=false;if(touchUI)$('#touch').hidden=false;fit();saveProg();const h=$('#tHint');h.classList.remove('fade');void h.offsetWidth;h.classList.add('fade')}
function saveProg(){try{const v=+localStorage.getItem('csSiegeStage')||0;if(SI>v)localStorage.setItem('csSiegeStage',SI)}catch(e){}}
function loadProg(){try{return Math.min(STAGES.length-1,+localStorage.getItem('csSiegeStage')||0)}catch(e){return 0}}
function nextStage(){loadStage(SI+1);showScene(ST.pre(),beginPlay)}
function startTally(){state='tally';music('off');SFX.fanfare();$('#touch').hidden=true;$('#hud').hidden=true;try{document.exitPointerLock&&document.exitPointerLock()}catch(e){}
 const bk=kills*50,bp=freed*1000,bs=speakers*800,bn=stats.lost===0?10000:0;tot.kills+=kills;tot.freed+=freed;tot.speakers+=speakers;tot.defects+=stats.defects;tot.lost+=stats.lost;
 tally={t:0,rows:[['ENEMIES DISPATCHED',kills,bk],['VILLAGERS UNTIED',freed,bp],['SPEAKERS SILENCED',speakers,bs],['CONSCRIPTS SPENT',stats.lost,bn]],total:bk+bp+bs+bn,rank:stats.lost===0?'HERO OF THE (CORRECT) PEOPLE':stats.lost<2?'DECORATED (TIN MEDAL)':stats.lost<4?'ADEQUATE CANNON FODDER':'STATISTIC'};addScore(tally.total)}
function drawTally(){r(0,0,W,H,'#120d0c');txt(LZ('STAGE '+(SI+1)+' COMPLETE','第'+ZN[SI+1]+'關 完成'),W/2,18,'#ffd24a','center',F16);txt(ST.name,W/2,40,'#a8977c','center');
 tally.rows.forEach((row,i)=>{if(tally.t<20+i*25)return;const y=64+i*18;txt(row[0],30,y,'#e9dcc2');txt(String(Math.min(row[1],(tally.t-20-i*25)>>1)),250,y,'#e9dcc2','right');txt('+'+row[2],W-30,y,'#9fe0a0','right')});
 if(tally.t>130){txt('BONUS',30,142,'#ffd24a');txt('+'+tally.total,W-30,142,'#ffd24a','right');txt(tr('RANK: ')+tr(tally.rank),W/2,166,'#ff9a6a','center')}
 if(tally.t>150&&T%40<26)txt('▶ CONTINUE',W/2,194,'#d9a441','center')}
let endMode='over';
const END_SCENES=[
 {date:'MEANWHILE, 1949',place:'EVERYWHERE ELSE',draw:'wreck',fact:"You won all six of your battles. The government lost all the other ones. There were a great many other ones.",joke:"HQ calls your record the finest of the war and stamps it TOP SECRET. It spoils the mood."},
 {date:'DECEMBER 1949',place:'THE LAST BOAT',draw:'boats',fact:"The government announces a 'temporary relocation' to Taiwan. Very temporary. The gold reserves sailed ahead months ago, first class.",joke:"Your Gold Yuan pay buys standing room. Your medal buys a corner of it. The tank stays behind with owner number seven."},
 {date:'NEW YEAR, 1950',place:'TAIPEI',draw:'island',fact:"Headquarters promises: 'We will counterattack the mainland next year.' The troops cheer. The boat is unpacked. Mostly.",joke:"New Year 1951: 'Next year.' 1952: 'Next year.' The speech is now printed in advance to save on ink."}];
function playScenes(list,done){if(!list.length){done();return}showScene(list[0],()=>playScenes(list.slice(1),done))}
let endSeen=false,endPay=null,endOverI=0;
function finish(){if(SI<STAGES.length-1){nextStage();return}try{localStorage.setItem('csSiegeStage','0')}catch(e){}
 if(!endSeen){endSeen=true;playScenes(END_SCENES,finish);return}state='over';music('ending');endPay={y:score*Math.pow(1.6,T/600),eggs:score/60|0};
 endMode='win';fillEnd();$('#end').hidden=false;$('#hud').hidden=true}
function gameOver(){state='over';music('off');$('#touch').hidden=true;$('#hud').hidden=true;try{document.exitPointerLock&&document.exitPointerLock()}catch(e){}
 endOverI=Math.floor(rnd()*KT.over.length);endMode='over';fillEnd();$('#end').hidden=false;if(AC){const t=now();[62,61,60,55].forEach((n,i)=>tone(mf(n),mf(n),.35,'square',.05,t+i*.3))}}
function fillEnd(){const row=(e,z,v)=>`<dt>${LZ(e,z)}</dt><dd>${v}</dd>`;
 if(endMode==='win'){const y=fmtBig(endPay?endPay.y:0),eg=endPay?endPay.eggs:0;
  $('#endH').textContent=LZ('YOU WON. WE LOST. SEE YOU IN TAIWAN.','你贏了。我們輸了。台灣見。');
  $('#endP').textContent=LZ('Six battles. Six victories. One tank, one train, one bomber, one gunboat, one printing press and one billboard. The government lost the war anyway and relocated to Taiwan, temporarily. Your victories have been filed under "next year", with the counterattack.','六場仗，六場勝利。一輛戰車、一列火車、一架轟炸機、一艘砲艇、一台印鈔機，外加一塊看板。政府還是輸掉了戰爭，「暫時」遷到台灣。你的戰功已歸檔在「明年」，跟反攻大陸放在一起。');
  $('#endS').innerHTML=row('Battles won','戰役勝場','6 / 6')+row('War won','戰爭勝場','0 / 1')+row('Enemies dispatched','擊倒敵軍',tot.kills)+row('Villagers untied','解救村民',tot.freed)+row('Speakers silenced','擊毀喇叭',tot.speakers)+row('Defectors','招降投誠',tot.defects)+row('Conscripts spent','消耗壯丁',tot.lost)+row('Pay','薪餉',LZ(`¥${y} Gold Yuan (≈ ${eg} eggs)`,`金圓券 ¥${y}（≈ ${eg} 顆蛋）`));
  $('#e1').textContent=LZ('COUNTERATTACK (NEXT YEAR)','反攻大陸（明年）');$('#e2').textContent=LZ('TITLE','回標題')}
 else{$('#endH').textContent=LZ('OUT OF CONSCRIPTS','壯丁用完了');$('#endP').textContent=KT.over[endOverI]||KT.over[0];
  $('#endS').innerHTML=row('Stage','關卡',LZ(`${SI+1}: ${ST.name}`,`第${ZN[SI+1]}關：${ST.name}`))+row('Enemies dispatched','擊倒敵軍',kills)+row('Villagers untied','解救村民',`${freed}/${nV}`)+row('Speakers silenced','擊毀喇叭',`${speakers}/${nL}`);
  $('#e1').textContent=LZ('DRAFT 3 MORE','再抓三個壯丁');$('#e2').textContent=LZ('RESTART STAGE','重打這一關')}}
$('#e1').addEventListener('click',()=>{$('#end').hidden=true;if(endMode==='win'){startGame();return}lives=2;state='play';px=checkpoint.x;py=checkpoint.y;pa=checkpoint.a;pitch=0;Object.assign(P,{x:px,y:py,fy:cellH(px,py),dead:0,hp:100,inv:150});music(playTrack());$('#hud').hidden=false;if(touchUI)$('#touch').hidden=false;wpop(px+Math.cos(pa)*1.5,py+Math.sin(pa)*1.5,'3 MORE DRAFTED. THEIR VILLAGE IS NOW EMPTY','#ffd24a',160,.9)});
$('#e2').addEventListener('click',()=>{$('#end').hidden=true;if(endMode==='win'){toTitle();return}startGame(SI)});
function toTitle(){state='title';$('#title').hidden=false;loadStage(0);music('off');showCont()}
function showCont(){const c=$('#cont'),v=loadProg();if(!c)return;c.hidden=!(v>0);c.textContent=LZ('▶ CONTINUE · STAGE '+(v+1)+': '+STAGES[v].name,'▶ 繼續 · 第'+ZN[v+1]+'關：'+STAGES[v].name)}
$('#go').addEventListener('click',()=>startGame(0));if($('#cont'))$('#cont').addEventListener('click',()=>startGame(loadProg()));showCont();
function togglePause(){if(state==='play'){state='pause';music('off')}else if(state==='pause'){state='play';music(playTrack())}}
$('#bPause').addEventListener('click',e=>{togglePause();e.currentTarget.blur()});
$('#bSnd').addEventListener('click',e=>{initAudio();setMute(!muted);sndLabel();e.currentTarget.blur()});
$('#bLang').addEventListener('click',e=>{applyLang(LANG==='zh'?'en':'zh',true);e.currentTarget.blur()});
document.querySelectorAll('.lang button').forEach(b=>b.addEventListener('click',()=>applyLang(b.dataset.l,true)));
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='play')togglePause()});

/* ---------------- input ---------------- */
const kb={},tch={},pressed={};
const KM={KeyW:'fwd',KeyS:'back',KeyA:'sl',KeyD:'sr',ArrowLeft:'tl',ArrowRight:'tr',ArrowUp:'lu',ArrowDown:'ld',KeyJ:'fire',Enter:'fire',Space:'jump',KeyK:'jump',KeyG:'gren',KeyL:'gren',KeyQ:'swap',KeyE:'swap',Digit1:'w1',Digit2:'w2',Digit3:'w3'};
const held=k=>kb[k]||tch[k];
addEventListener('keydown',e=>{if(state==='title'){if(e.code==='Enter'){startGame(0);e.preventDefault()}return}
 if(e.code==='KeyP'||e.code==='Escape'){if(e.code==='KeyP'||state==='pause')togglePause();return}
 const k=KM[e.code];if(!k)return;if(!$('#end').hidden)return;e.preventDefault();if(!e.repeat&&!kb[k])pressed[k]=1;if(state==='scene'&&k==='jump')pressed.fire=1;kb[k]=1;initAudio()});
addEventListener('keyup',e=>{const k=KM[e.code];if(k)kb[k]=0});
cv.addEventListener('mousedown',e=>{initAudio();if(state==='play'){mouseDown=true;try{const p=cv.requestPointerLock&&cv.requestPointerLock();if(p&&p.catch)p.catch(()=>{})}catch(err){}}else pressed.fire=1});
addEventListener('mouseup',()=>mouseDown=false);
addEventListener('mousemove',e=>{if(state!=='play')return;const lock=document.pointerLockElement===cv;if(lock||mouseDown){const k=lock?.0028:.005;lookDX+=e.movementX*k;lookDY+=e.movementY*k;lookDXv=e.movementX*k;lookDYv=e.movementY*k*0}});
let touchUI=false;const tpad=$('#touch'),sBase=$('#stickBase'),sKnob=$('#stickKnob');let stickId=null,sx0=0,sy0=0,lookId=null,lookX=0,lookY=0;const btnT={};
function showTouchUI(){if(touchUI)return;touchUI=true;if(state==='play')tpad.hidden=false;fit()}
if(matchMedia('(pointer:coarse)').matches)touchUI=true;
addEventListener('touchstart',()=>{if(!touchUI)showTouchUI()},{passive:true});
tpad.addEventListener('touchstart',e=>{e.preventDefault();initAudio();for(const t of e.changedTouches){const b=t.target.closest&&t.target.closest('.tb');
 if(b){const k=b.dataset.k;btnT[t.identifier]=k;tch[k]=true;if(k!=='fire')pressed[k]=1;b.classList.add('on');continue}
 if(t.clientX<innerWidth*.45&&stickId==null){stickId=t.identifier;sx0=t.clientX;sy0=t.clientY;sBase.hidden=false;sBase.style.left=sx0+'px';sBase.style.top=sy0+'px';sKnob.style.transform=''}
 else if(lookId==null){lookId=t.identifier;lookX=t.clientX;lookY=t.clientY}}},{passive:false});
tpad.addEventListener('touchmove',e=>{e.preventDefault();for(const t of e.changedTouches){if(t.identifier===stickId){const dx=clamp(t.clientX-sx0,-50,50),dy=clamp(t.clientY-sy0,-50,50);stickV={x:Math.abs(dx)<8?0:dx/50,y:Math.abs(dy)<8?0:dy/50};sKnob.style.transform=`translate(${dx}px,${dy}px)`}
 else if(t.identifier===lookId){lookDX+=(t.clientX-lookX)*.008;lookDY+=(t.clientY-lookY)*.008;lookX=t.clientX;lookY=t.clientY}}},{passive:false});
function tEnd(e){e.preventDefault();for(const t of e.changedTouches){if(t.identifier===stickId){stickId=null;stickV={x:0,y:0};sBase.hidden=true}else if(t.identifier===lookId)lookId=null;
 const k=btnT[t.identifier];if(k){tch[k]=false;delete btnT[t.identifier];document.querySelector(`.tb[data-k=${k}]`).classList.remove('on')}}}
tpad.addEventListener('touchend',tEnd,{passive:false});tpad.addEventListener('touchcancel',tEnd,{passive:false});
cv.addEventListener('touchstart',()=>{pressed.fire=1},{passive:true});
function fit(){const vw=innerWidth,vh=innerHeight;const s=Math.min(vw/W,vh/H);const st=$('#stage');st.style.width=Math.floor(W*s)+'px';st.style.height=Math.floor(H*s)+'px';$('#tHint').textContent=vh>vw?LZ('TURN YOUR PHONE SIDEWAYS','請把手機轉橫'):LZ('LEFT THUMB: WALK · RIGHT THUMB: DRAG TO AIM','左手拇指：走路 · 右手拇指：拖曳瞄準')}
addEventListener('resize',fit);

/* ---------------- loop ---------------- */
buildTextures();mkFlames();initGL();applyLang(LANG,false);loadStage();fit();
let last=performance.now(),acc=0;
function loop(nt){acc+=Math.min(100,nt-last);last=nt;
 while(acc>=16.67){acc-=16.67;
  if(state==='play')update();
  else if(state==='title'){T++;pa+=.003;pitch=Math.sin(T/200)*.15}
  else if(state==='scene'){scene.t++;T++;if(scene.t%3===0&&scene.t<500)SFX.type();const adv=pressed.fire||pressed.gren||pressed.swap||pressed.jump;for(const k in pressed)delete pressed[k];if(adv){if(!scene.complete)scene.t=9999;else{const d=scene.done;scene=null;d()}}}
  else if(state==='tally'){tally.t++;T++;if(tally.t%4===0&&tally.t<120)SFX.tally();const adv=pressed.fire||pressed.jump;for(const k in pressed)delete pressed[k];if(adv&&tally.t>60){if(tally.t<150)tally.t=150;else{tally=null;const po=ST.post&&ST.post();if(po)showScene(po,finish);else finish()}}}
  else for(const k in pressed)delete pressed[k]}
 lookDXv*=.8;
 if(state==='scene'&&scene){ctx.clearRect(0,0,W,H);scene.complete=drawScene(scene.sc,scene.t)}
 else if(state==='tally'&&tally){ctx.clearRect(0,0,W,H);drawTally()}
 else render();
 requestAnimationFrame(loop)}
(document.fonts?document.fonts.load(F):Promise.resolve()).catch(()=>{}).finally(()=>requestAnimationFrame(loop));
if(window.__f)Object.assign(window.__f,{over:()=>gameOver(),lang:l=>applyLang(l,true),stage:i=>{$('#title').hidden=true;$('#end').hidden=true;initAudio();lives=2;loadStage(i);beginPlay()},si:()=>SI,bossPos:()=>boss&&{x:boss.x,y:boss.y,z:boss.z,k:boss.k,a:boss.active,d:boss.dead,hp:boss.hp}});
