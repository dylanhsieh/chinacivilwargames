/* ===================== LAST FERRY RUSH 1949 (末班渡輪) — a Civil Slug pseudo-3D racer =====================
   You drive a requisitioned Nationalist (KMT) army truck full of passengers to the last evacuation ferry.
   Six legs, a set piece at the end of each, story pages, continues and saves; the ferry goes to Taiwan. Temporarily. */
let T=0,camX=0,S='kmt',EN='ccp',LV=0,skyFlash=0,skyFX=0,state='title';
let plats=[],scorch=[];const L={walls:[],theme:'village',deep:null,weather:null};function groundAt(){return GY}
THEMES.harbor={sky:['#2a2440','#8a5a6a','#f0a870'],m1:'#3a2e3e',m2:'#2a2232',house:'#1a1822',ground:'#3a3640',top:'#5a5662',spk:'#2a2830',sun:'#ffcf80'};
const lerp=(a,b,t)=>a+(b-a)*t;
const VIG=document.createElement('canvas');VIG.width=W;VIG.height=H;{const g=VIG.getContext('2d');const rg=g.createRadialGradient(W/2,H/2,H*.4,W/2,H/2,W*.65);rg.addColorStop(0,'rgba(0,0,0,0)');rg.addColorStop(1,'rgba(6,2,2,.45)');g.fillStyle=rg;g.fillRect(0,0,W,H)}
/* ---------------- i18n core: 繁體中文 default, English optional (resolved at draw time) ---------------- */
let LANG='zh';const LANG_KEY='ferryrush.lang';
const ZFAM='"Noto Sans TC","Noto Sans CJK TC","PingFang TC","Microsoft JhengHei","Heiti TC","Source Han Sans TC","WenQuanYi Micro Hei",sans-serif';
const CJK_RE=/[⺀-鿿豈-﫿＀-￯　-〿]/;
const LZ=(e,z)=>LANG==='zh'?z:e;
const ZF=(px,w=500)=>`${w} ${px}px ${ZFAM}`;
const MISS=new Set();
function tr(s){if(LANG!=='zh'||typeof s!=='string')return s;const z=ZT[s];if(z!=null)return z;const m=/^RICE: (.+)$/.exec(s);if(m)return '米價：'+m[1];if(/[A-Z]{2}/i.test(s)&&!CJK_RE.test(s))MISS.add(s);return s}
const ZK=(o,k)=>LANG==='zh'&&o.zh&&o.zh[k]!=null?o.zh[k]:o[k];
const PV=v=>typeof v==='function'?v():tr(v);
function wrapPx(s,maxW){const toks=String(s).match(/[A-Za-z0-9¥$%'’.,!?:\/+\-–—()×]+|\s+|[\s\S]/gu)||[];const out=[];let line='';
 for(const tk of toks){const test=line+tk;if(line.trim()&&ctx.measureText(test.trimEnd()).width>maxW&&!/^[，。、！？：；）」』…—,.!?)\s]/.test(tk)){out.push(line.trim());line=/^\s+$/.test(tk)?'':tk}else line=test}
 if(line.trim())out.push(line.trim());return out}
function lines(s,maxW,px=11){s=PV(s);if(CJK_RE.test(s)){ctx.font=ZF(px);return wrapPx(s,maxW)}ctx.font=F;return wrap(s,Math.floor(maxW/8))}
const LH=()=>LANG==='zh'?13:10;
const isDark=c=>{const m=/^#([0-9a-f]{6})/i.exec(c);if(!m)return false;const v=parseInt(m[1],16);return((v>>16)*.3+((v>>8)&255)*.59+(v&255)*.11)<70};
const SERIF=s=>`900 ${s}px "Noto Serif TC","Noto Serif CJK TC","Songti TC",Georgia,${ZFAM}`;
function stxt(s,x,y,c,size,a=1,al='center'){s=tr(s);ctx.font=SERIF(size);ctx.textAlign=al;ctx.textBaseline='middle';ctx.globalAlpha=a;ctx.fillStyle='#000';ctx.fillText(s,x+1,y+2);ctx.fillStyle=c;ctx.fillText(s,x,y);ctx.globalAlpha=1;ctx.textBaseline='top'}
/* tiny 3x5 pixel font: font-independent HUD text (4px per char) */
const GLY={};{const G_='A010101111101101B110101110101110C011100100100011D110101101101110E111100110100111F111100110100100G011100101101011H101101111101101I111010010010111J001001001101010K101101110101101L100100100100111M101111111101101N110101101101101O010101101101010P110101110100100Q010101101110011R110101110101101S011100010001110T111010010010010U101101101101111V101101101101010W101101111111101X101101010101101Y101101010010010Z1110010101001110111101101101111101011001001011121100010101001113110001010001110410110111100100151111001100011106011100111101111711100101001001081111011111011119111101111001110¥101010111010010×000101010101000.000000000000010/001001010100100+000010111010000-000000111000000%101001010100101:000010000010000!010010010000010?110001010000010,000000000010100\'010010000000000(010100100100010)010001001001010≈000111000111000▶100110111110100·000000010000000"101101000000000→000001111001000';for(let i=0;i+16<=G_.length;i+=16)GLY[G_[i]]=G_.substr(i+1,15)}
function tinyPx(s,x,y,c='#e9dcc2',al='left',sh=1){s=String(s).toUpperCase();const ch=[...s],w=ch.length*4-1,x0=Math.round(al==='center'?x-w/2:al==='right'?x-w:x);
 for(const pass of sh?[0,1]:[1]){ctx.fillStyle=pass?c:'#120d0c';ch.forEach((k,i)=>{const g=GLY[k];if(!g)return;for(let b=0;b<15;b++)if(g[b]==='1')ctx.fillRect(x0+i*4+b%3+(pass?0:1),Math.round(y)+(b/3|0)+(pass?0:1),1,1)})}return w}
// tiny(): pixel font for English/numbers, Noto Sans TC (10px) for Chinese; same anchor (y = top of a 5px row)
function tiny(s,x,y,c='#e9dcc2',al='left',sh=1,px=10){s=tr(String(s));if(!CJK_RE.test(s))return tinyPx(s,x,y,c,al,sh);
 ctx.font=ZF(px);ctx.textAlign=al;ctx.textBaseline='middle';const yy=Math.round(y)+3;
 if(sh&&!isDark(c)){ctx.fillStyle='#120d0c';ctx.fillText(s,x+1,yy+1)}ctx.fillStyle=c;ctx.fillText(s,x,yy);ctx.textBaseline='top';return Math.ceil(ctx.measureText(s).width)}
/* CJK-aware overrides of the shared text helpers (English path untouched) */
const _txt=txt,_drawBubble=drawBubble;
txt=function(s,x,y,c='#e9dcc2',al='left',font=F){s=tr(String(s));if(!CJK_RE.test(s))return _txt(s,x,y,c,al,font);
 ctx.font=/16px/.test(font)?ZF(16,700):ZF(11);ctx.textAlign=al;ctx.textBaseline='middle';const yy=y+(/16px/.test(font)?8:4);
 if(!isDark(c)){ctx.fillStyle='#120d0c';ctx.fillText(s,x+1,yy+1)}ctx.fillStyle=c;ctx.fillText(s,x,yy);ctx.textBaseline='top'};
drawBubble=function(s,x,y){s=tr(s);if(!CJK_RE.test(s))return _drawBubble(s,x,y);
 ctx.font=ZF(11);const L_=wrapPx(s,150),w=Math.ceil(Math.max(...L_.map(l=>ctx.measureText(l).width)))+10,h=L_.length*13+6;
 let bx=clamp(x-w/2,4,W-w-4),by=Math.max(28,y-h);r(bx,by,w,h,'#e9dcc2');ctx.strokeStyle='#120d0c';ctx.strokeRect(bx+.5,by+.5,w-1,h-1);
 r(clamp(x-2,bx+4,bx+w-8),by+h,4,3,'#e9dcc2');ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillStyle='#120d0c';L_.forEach((l,i)=>ctx.fillText(l,bx+5,by+3+i*13+7));ctx.textBaseline='top'};
// a paper sign with a label (optional post)
function enSign(s,x,y,c='#e9dcc2',post=1){s=tr(s);const zh=CJK_RE.test(s);ctx.font=zh?ZF(10,700):F;const w=Math.ceil(ctx.measureText(s).width)+8,h=zh?14:12;
 r(x-w/2,y,w,h,c);if(post)r(x-1,y+h,2,10,'#5a3a20');ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#120d0c';ctx.fillText(s,x,y+h/2+(zh?0:1));ctx.textBaseline='top'}

/* ---------------- the campaign: six legs of the retreat ---------------- */
// boss kinds: ram (Chase-H.Q. style, bump it hp times) or survive (reach the end of the set piece)
const STAGES=[
 {theme:'village',weather:'embers',music:'m1',bmus:'boss',pal:'village',len:1100,checks:2,time:46,btime:38,curv:2.2,hills:1,rws:1,
  pool:{cart:3,refugee:3,donkey:1,bike:2,truckC:1,barrel:1},dens:1,scen:['house','burn','tree','poster','bags','house','tree'],
  boss:'acar',hp:5,
  name:'THE VILLAGE ROAD',date:'NOVEMBER 1948',place:'A VILLAGE NORTH OF THE HUAI RIVER',bossName:'ARMORED CAR "FORMERLY OURS"',angry:'IT IS ANGRY NOW. STILL OURS, TECHNICALLY.',
  bossHint:'RAM IT FROM BEHIND! DODGE THE BARRELS.',down:'ARMORED CAR DOWN! RETURNED TO SENDER.',goal:'TO THE COAST →',
  signs:['COAST 400 LI','LAST FERRY: SOON','BRIDGE OUT? MAYBE'],
  brief:['ORDERS: Drive the truck to the coast. The last ferry will wait for you.','The ferry has never waited for anyone. Drive fast.'],
  hint:'↑ GAS · ← → STEER · J HORN · CHECKPOINTS ADD TIME',thint:'THE TRUCK DRIVES ITSELF · ◀ ▶ STEER · HORN CLEARS CARTS',
  title:'THE REQUISITION',
  fact:'November 1948. The army requisitions a truck, a driver (you) and twelve passengers who were standing too close to the truck.',
  joke:'Fare to the coast: one sack of Gold Yuan. By the time they lift the sack onto the truck, it is two sacks.',
  zh:{name:'村口小路',date:'1948年11月',place:'淮河以北的一座村莊',bossName:'裝甲車「原本是我們的」',angry:'它生氣了。嚴格來說，它還是我們的。',
   bossHint:'從後面撞它！閃開油桶。',down:'裝甲車翻了！原物退回。',goal:'往海邊 →',signs:['海邊 400 里','末班船：快開了','前方斷橋？也許'],
   brief:['命令：把卡車開到海邊。最後一班渡輪會等你。','那班渡輪從來沒等過任何人。開快一點。'],
   hint:'↑ 油門 · ← → 轉彎 · J 喇叭 · 通過檢查站加時間',thint:'卡車自動前進 · ◀ ▶ 轉彎 · 喇叭可以趕走牛車',title:'徵用',
   fact:'1948年11月。軍方徵用了一輛卡車、一名司機（你），還有十二位站得離卡車太近的乘客。',
   joke:'到海邊的車資：一麻袋金圓券。等他們把麻袋扛上車，已經漲成兩麻袋了。'}},
 {theme:'snow',weather:'snow',music:'m3',bmus:'boss',pal:'snow',len:1250,checks:2,time:50,btime:55,curv:2.2,hills:2,rws:1,ice:1,
  pool:{truckC:2,refugee:2,cart:2,roadblock:1,barrel:1,donkey:1},dens:.95,scen:['pine','pine','rock','pine','bags'],
  boss:'ptruck',hp:5,
  name:'THE SNOW PASS',date:'JANUARY 1949',place:'MOUNTAINS NORTH OF BEIPING',bossName:'LOUDSPEAKER TRUCK "GOOD NEWS"',angry:'VOLUME: MAXIMUM',
  bossHint:'RAM THE LOUDSPEAKER TRUCK! DO NOT READ THE LEAFLETS.',down:'THE LOUDSPEAKER IS SILENT. YOUR PASSENGERS APPLAUD.',goal:'SOUTH →',
  signs:['WINTER TYRES: IN SPRING','PEACEFUL REORGANIZATION','ICE (ALSO OURS)'],
  brief:['The pass is icy. The truck has summer tyres. Winter tyres will be issued in spring.','Beware the loudspeaker truck. Its slogans are very persuasive. Two passengers already left.'],
  hint:'NEW: ICE. STEER EARLY, THE TRUCK SLIDES. ROADBLOCKS COST 2 PASSENGERS.',
  title:'PEACEFUL REORGANIZATION',
  fact:'January 1949. The northern garrison "reorganizes peacefully". The roadblocks reorganize with it, and now face the other way.',
  joke:'Your map is a week old, which makes it a historical document.',
  zh:{name:'雪中山口',date:'1949年1月',place:'北平以北的山區',bossName:'宣傳車「好消息」',angry:'音量：最大',
   bossHint:'撞那台宣傳車！不要看傳單。',down:'喇叭安靜了。乘客們鼓掌叫好。',goal:'往南 →',signs:['冬季胎：春天發','和平改編','結冰（也是我們的）'],
   brief:['山口結冰了，卡車用的是夏季輪胎。冬季輪胎預計春天發放。','小心那台宣傳車，它的口號很有說服力。已經有兩位乘客下車了。'],
   hint:'新路況：結冰。提早轉彎，卡車會滑。撞到路障會少兩位乘客。',title:'和平改編',
   fact:'1949年1月。華北守軍「和平改編」，路障也跟著一起改編了，現在朝向另一邊。',
   joke:'你的地圖是上禮拜印的，所以現在算是歷史文獻。'}},
 {theme:'paddy',weather:'fog',music:'m2',bmus:'boss',pal:'paddy',len:1150,checks:2,time:48,btime:30,curv:1.6,hills:0,rws:.72,mud:1,fog:1,
  pool:{buffalo:2,cart:2,refugee:3,bike:1,donkey:1},dens:.9,scen:['sprout','sprout','farmer','sprout','tree','sprout'],
  boss:'tank',blen:900,
  name:'THE PADDY DYKES',date:'MARCH 1949',place:'RICE COUNTRY, IN THE FOG',bossName:'TANK "SECOND OWNER"',angry:'IT HAS FOUND ITS RANGE',
  bossHint:'RED MARKS = INCOMING SHELLS. STEER AWAY!',down:'THE TANK SANK INTO THE PADDY. RICE 1, TANK 0.',goal:'OUT OF THE FOG →',
  signs:['ROAD SECURE','ROAD SECURE (PROBABLY)','MUD: NEUTRAL'],
  brief:['The road is a dyke between flooded paddies. It is one truck wide. Your truck is one truck wide.','Somewhere in the fog is a tank. It used to be ours. It still shoots like ours: often.'],
  hint:'NEW: NARROW DYKE AND FOG. OFF THE ROAD IS MUD.',
  title:'THE ROADS ARE SECURE',
  fact:'March 1949. HQ says the roads south are "completely secure". Nobody has told the fog.',
  joke:'A water buffalo blocks the dyke. It has no political views. It also has no hurry.',
  zh:{name:'霧中田埂',date:'1949年3月',place:'起霧的稻米之鄉',bossName:'戰車「二手車主」',angry:'它抓到射程了',
   bossHint:'紅色記號＝砲彈落點，快閃開！',down:'戰車陷進水田了。稻米 1，戰車 0。',goal:'衝出濃霧 →',signs:['道路安全','道路安全（大概）','爛泥：中立'],
   brief:['這條路是兩片水田中間的田埂，剛好一輛卡車寬。你的卡車也剛好一輛卡車寬。','霧裡有一輛戰車。它以前是我們的，開砲的習慣也跟我們一樣：很常開。'],
   hint:'新路況：田埂很窄又有霧，掉下去就是爛泥。',title:'道路絕對安全',
   fact:'1949年3月。總部說南下的道路「絕對安全」。沒有人通知這場霧。',
   joke:'一頭水牛擋在田埂上。牠沒有政治立場，也完全不趕時間。'}},
 {theme:'river',weather:null,music:'m5',bmus:'final',pal:'river',len:1200,checks:2,time:46,btime:28,curv:2,hills:1,rws:1,
  pool:{cart:2,refugee:2,truckC:2,rickshaw:1,barrel:1,roadblock:1},dens:1.1,scen:['tree','house','post','bags','tree'],
  boss:'bridge',blen:760,
  name:'THE LAST BRIDGE',date:'APRIL 1949',place:'A RIVER SOUTH OF THE YANGTZE',bossName:'DEMOLITION (AHEAD OF SCHEDULE)',angry:'EVEN MORE AHEAD OF SCHEDULE',
  bossHint:'OUTRUN THE EXPLOSIONS! HOLES IN THE DECK COST PASSENGERS.',down:'THE BRIDGE IS GONE. SO IS THE WAY BACK.',goal:'FAR BANK →',
  signs:['BRIDGE CLOSES SOON','BRIDGE CLOSES SOONER','IMPASSABLE BARRIER'],
  brief:['The engineers will blow up the bridge as soon as we have crossed.','They are paid by the hour, in Gold Yuan, so they would like to start now.'],
  hint:'THE BRIDGE IS AHEAD. STAY ON THE ROAD; THE ENGINEERS ARE IMPATIENT.',
  title:'THE IMPASSABLE BARRIER',
  fact:'April 1949. HQ calls the Yangtze an "impassable barrier". The enemy crosses it in one night, on wooden junks.',
  joke:'Plan B: blow up every bridge behind us. Plan C is also blowing up the bridges, but faster.',
  zh:{name:'最後一座橋',date:'1949年4月',place:'長江以南的一條河',bossName:'炸橋（進度超前）',angry:'進度又更超前了',
   bossHint:'跑贏爆破！橋面破洞會讓乘客掉下去。',down:'橋沒了。回去的路也沒了。',goal:'對岸 →',signs:['本橋即將關閉','本橋更快關閉','長江天險'],
   brief:['工兵等我們一過橋，就會把橋炸掉。','他們按時計酬，領的是金圓券，所以他們很想現在就開始。'],
   hint:'前方就是大橋。別開出路面，工兵們很沒耐心。',title:'長江天險',
   fact:'1949年4月。總部說長江是過不去的天險。共軍搭著木帆船，一個晚上就過來了。',
   joke:'B 計畫：把身後的橋全部炸掉。C 計畫也是炸橋，只是炸快一點。'}},
 {theme:'city',weather:'rain',music:'m4',bmus:'boss',pal:'city',len:1300,checks:3,time:48,btime:56,curv:2.4,hills:0,rws:1.15,night:1,
  pool:{rickshaw:3,bike:2,truckC:2,crowd:2,tram:2,barrel:1},dens:1.25,scen:['shop','lamp','bank','poster','shop','lamp'],
  boss:'btram',hp:6,
  name:'SHANGHAI STREETS',date:'MAY 1949',place:'THE BUND, AT NIGHT, IN THE RAIN',bossName:'TRAM "NEXT STOP: LIBERATION"',angry:'EXPRESS SERVICE: NO STOPS',
  bossHint:'RAM THE TRAM! IT CAN ONLY CHANGE TRACKS SO FAST.',down:'THE TRAM IS OUT OF SERVICE. PASSENGERS PLEASE ALIGHT.',goal:'DOCKS →',
  signs:['GOLD YUAN SOLD BY WEIGHT','SHANGHAI WILL HOLD!','BANK CLOSED (FOREVER)'],
  brief:['Shanghai will be held to the last man! (The last man is advised to hurry to the docks.)','Gold Yuan is now sold by weight. Blank paper is worth more.'],
  hint:'NEW: TRAMS AND BANK QUEUES. BANK QUEUES DO NOT MOVE FOR HORNS.',
  title:'SHANGHAI WILL HOLD',
  fact:'May 1949. The radio says Shanghai will hold. The gold reserves left for Taiwan months ago, quietly, at night.',
  joke:'There is a run on every bank. You are the only vehicle driving to the docks without gold in it.',
  zh:{name:'上海街頭',date:'1949年5月',place:'外灘，雨夜',bossName:'電車「下一站：解放」',angry:'直達車：中途不停',
   bossHint:'撞那輛電車！它換軌換不了那麼快。',down:'電車停駛了。請乘客下車。',goal:'碼頭 →',signs:['金圓券論斤賣','死守大上海！','銀行休息（永久）'],
   brief:['死守大上海，戰到最後一兵一卒！（最後那一兵請盡快前往碼頭。）','金圓券現在論斤秤重賣，白紙都比它值錢。'],
   hint:'新路況：電車和擠兌人潮。擠兌的人龍按喇叭也不會讓。',title:'死守大上海',
   fact:'1949年5月。廣播說要死守大上海。國庫的黃金幾個月前就趁夜悄悄運去台灣了。',
   joke:'每家銀行都在擠兌。全上海往碼頭開的車裡，只有你這輛沒有載黃金。'}},
 {theme:'harbor',weather:'gulls',music:'m1',bmus:'final',pal:'harbor',len:1250,checks:2,time:46,btime:50,curv:2.2,hills:0,rws:1.05,pier:1,
  pool:{crates:3,refugee:2,truckC:2,rickshaw:2,roadblock:1,cart:1},dens:1.2,scen:['crane','crates','bollard','ship','crates','bollard'],
  boss:'acar2',hp:8,
  name:'THE DOCKS',date:'DECEMBER 1949',place:'THE LAST PORT, AT DAWN',bossName:'ARMORED CAR "FORMERLY OURS II"',angry:'ALSO FORMERLY OURS',
  bossHint:'LAST ONE! RAM IT, THEN MAKE THE FERRY RAMP.',down:'ARMORED CAR DOWN! THE FERRY IS STILL THERE. JUST.',goal:'LAST FERRY · ALL ABOARD',
  signs:['LAST FERRY: DAWN','NO GOLD YUAN ACCEPTED','TEMPORARY RELOCATION'],
  brief:['This is it: the last ferry. It leaves at dawn. It is now dawn.','Tickets: no Gold Yuan. Silver, gold, or a very good reason.'],
  hint:'LAST LEG! THE FERRY IS AT THE END OF THE PIER.',
  title:'THE LAST FERRY',
  fact:'December 1949. The government announces it is moving to Taiwan. Temporarily. The last ferry leaves from the docks at dawn.',
  joke:'Your passengers ask how long the trip is. The officer says: "Short. We will be back next year."',
  zh:{name:'碼頭',date:'1949年12月',place:'最後一個港口，天亮',bossName:'裝甲車「原本是我們的 二號」',angry:'這台也原本是我們的',
   bossHint:'最後一個！撞翻它，然後衝上渡輪跳板。',down:'裝甲車翻了！渡輪還在。勉強還在。',goal:'末班渡輪 · 全員上船',signs:['末班渡輪：天亮開','不收金圓券','暫時撤退'],
   brief:['就是這班了：最後一班渡輪，天亮開船。現在天亮了。','船票：不收金圓券。收銀元、黃金，或是非常好的理由。'],
   hint:'最後一段！渡輪就在碼頭盡頭。',title:'最後一班渡輪',
   fact:'1949年12月。政府宣布遷往台灣，暫時的。最後一班渡輪天亮從碼頭出發。',
   joke:'乘客問這趟要多久。軍官說：「很快。明年就回來了。」'}}];
const RICE=[1.2e6,4e7,9e8,3e10,8e11,5e13];// price of one bag of rice per stage. It only goes one way.
const ZT={'PAUSED':'暫停','CHECKPOINT':'檢查站','KM/H':'公里','DOWN':'下'};
/* ground palettes */
const GP={
 village:{grass:['#3e3a2c','#38341f'],rumble:['#6a6260','#e9dcc2'],road:['#5e5654','#5a5250'],lane:'#e9dcc2'},
 snow:{grass:['#dfe6ee','#cfd8e4'],rumble:['#9fb0c4','#e9eef4'],road:['#8a94a4','#848e9e'],lane:'#ffffff'},
 paddy:{grass:['#4a6a66','#40605c'],rumble:['#6a5a3a','#5a4a2e'],road:['#7a6a48','#74644a'],lane:null},
 river:{grass:['#3e4a2c','#38441f'],rumble:['#5a4030','#d9cfb8'],road:['#5e5654','#5a5250'],lane:'#d9cfb8'},
 bridge:{grass:['#2c3c5a','#28374f'],rumble:['#3a3a40','#9a9aa0'],road:['#5a4030','#523a2a'],lane:'#d9cfb8',water:1},
 city:{grass:['#2a2830','#24222a'],rumble:['#c8372d','#e9dcc2'],road:['#3a3640','#36323c'],lane:'#e9dcc2',walk:1},
 harbor:{grass:['#1f3656','#1b304e'],rumble:['#3a2e24','#d9a441'],road:['#6a5440','#5e4a38'],lane:'#d9a441',water:1}};
/* per-kind collision half-width (in road-width units, player included), passengers lost, how it reacts */
const HW={cart:.4,refugee:.3,rickshaw:.34,bike:.27,truckC:.46,donkey:.33,buffalo:.42,barrel:.28,leaflets:.32,roadblock:.6,tram:.5,crowd:.52,hole:.3,crater:.32,crates:.38,shot:.26,acar:.46,acar2:.46,ptruck:.46,btram:.5};
const LOST={refugee:0,crowd:0,donkey:1,cart:1,rickshaw:1,bike:1,truckC:2,buffalo:1,barrel:1,leaflets:1,roadblock:2,tram:2,hole:1,crater:1,crates:1,shot:1,mark:2};
const SPEED={cart:.12,refugee:.05,rickshaw:.2,bike:.25,truckC:.45,donkey:.04,buffalo:.02,tram:.3,crowd:0,barrel:0,roadblock:0,crates:0,leaflets:0};
const STATIC=new Set(['barrel','leaflets','roadblock','crowd','hole','crater','crates','shot']);
const HORNABLE=new Set(['cart','refugee','rickshaw','bike']);

/* ---------------- save ---------------- */
const SKEY='lastferry49';
function loadSave(){const s=store.get(SKEY,null)||{};const best=Array.isArray(s.best)?s.best:[];
 return{un:clamp(s.un|0||1,1,STAGES.length),best:STAGES.map((_,i)=>typeof best[i]==='number'?best[i]:-1),won:!!s.won}}
let SAVE=loadSave();const saveNow=()=>store.set(SKEY,SAVE);

/* ---------------- track ---------------- */
const SEG=200,RW=800,CAMH=1000,DRAW=150,FOV=100,CAMD=1/Math.tan(FOV/2*Math.PI/180),HZ=Math.round(H*.42),PZ=830,VC=.5,CF=.62,MAXS=SEG*50,KC=7,KS=9;
let segs=[],trackLen=0,bossZ=0,loopA=0,loopB=0,finishZ=0,chk=[],RWS=1;
function addRoad(n,curve,hill,o={}){const start=segs.length?segs[segs.length-1].y2:0;for(let i=0;i<n;i++){const k=(i+1)/n,y=start+hill*(Math.sin((k-.5)*Math.PI)/2+.5)*SEG*8;
  segs.push({i:segs.length,curve:curve*Math.sin(i/n*Math.PI),y1:segs.length?segs[segs.length-1].y2:start,y2:y,pal:o.pal,k:o.k||'',sprites:[]})}}
function segAt(z){return segs[clamp(Math.floor(z/SEG),0,segs.length-1)]}
const pickW=(o,R_)=>{let t=0,k;for(k in o)t+=o[k];let q=R_()*t;for(k in o){q-=o[k];if(q<0)return k}return k};
function buildTrack(i){const s=STAGES[i],R_=seeded(1949+i*77);segs=[];RWS=s.rws;
 addRoad(40,0,0,{pal:s.pal});
 while(segs.length<s.len){const n=40+(R_()*60|0),c=(R_()*2-1)*s.curv,h=s.hills?(R_()*2-1)*s.hills:0;addRoad(n,R_()<.25?0:c,h,{pal:s.pal})}
 addRoad(60,0,0,{pal:s.pal});bossZ=segs.length*SEG;
 if(s.blen){const pk=s.boss==='bridge'?'bridge':s.pal,kk=s.boss==='bridge'?'bridge':'';addRoad(20,0,0,{pal:pk,k:kk});let n=20;while(n<s.blen){const m=50+(R_()*40|0);addRoad(m,s.boss==='bridge'?0:(R_()*2-1)*s.curv*.7,0,{pal:pk,k:kk});n+=m}loopA=loopB=0}
 else{loopA=segs.length;addRoad(160,0,0,{pal:s.pal});let n=0;while(n<500){const m=50+(R_()*40|0);addRoad(m,(R_()*2-1)*s.curv*.8,0,{pal:s.pal});n+=m}loopB=segs.length;loopA*=SEG;loopB*=SEG}
 const fin=segs.length+(s.blen?30:160);addRoad(fin-segs.length+40,0,0,{pal:s.pal,k:s.pier?'pier':''});finishZ=fin*SEG;addRoad(DRAW+20,0,0,{pal:s.pal,k:s.pier?'pier':''});
 trackLen=segs.length*SEG;
 // scenery
 for(const g of segs){const br=g.k==='bridge';
  if(br){if(g.i%4===0){g.sprites.push({k:'girder',x:-1.12},{k:'girder',x:1.12})}if(g.i%37===0)g.sprites.push({k:'junk',x:(R_()<.5?-1:1)*(2+R_()*2)});continue}
  const ev=s.boss==='btram'?5:7;if(g.i%ev===0&&R_()<.85){const side=R_()<.5?-1:1;g.sprites.push({k:s.scen[R_()*s.scen.length|0],x:side*(1.35+R_()*1.4)})}
  if(s.boss==='btram'&&g.i%ev===2)g.sprites.push({k:'lamp',x:(g.i%(ev*2)<ev?-1:1)*1.25});
  if(g.i%160===80)g.sprites.push({k:'sign',x:(g.i%320<160?-1:1)*1.5,s:(g.i/160|0)%3})}
 chk=[];for(let c=1;c<=s.checks;c++){const z=Math.round(s.len*c/(s.checks+1));chk.push({z:z*SEG,done:0});segs[z].sprites.push({k:'check',x:0})}
 segs[Math.floor(bossZ/SEG)].sprites.push({k:'check',x:0,boss:1});
 segs[fin].sprites.push({k:'finish',x:0});if(s.pier)segs[fin+34].sprites.push({k:'ferry',x:0});
 // traffic and pickups on the main course
 cars=[];items=[];let z=50;
 while(z<bossZ/SEG-30){z+=Math.round((10+R_()*22)/s.dens);const k=pickW(s.pool,R_);let x=R_()*1.5-.75;if(k==='roadblock')x=(R_()<.5?-1:1)*.5;if(k==='tram')x=(R_()<.5?-1:1)*.45;
  cars.push({z:z*SEG,x,k,spd:SPEED[k]||0})}
 for(let q=70;q<bossZ/SEG-20;q+=60+(R_()*60|0)){if(R_()<.5)items.push({z:q*SEG,x:(R_()<.5?-1:1)*.82,k:'hitch'});else items.push({z:q*SEG,x:R_()*1.2-.6,k:'cash'})}
 if(s.boss==='bridge'){for(let q=bossZ/SEG+40;q<bossZ/SEG+s.blen-20;q+=16+(R_()*14|0))cars.push({z:q*SEG,x:(R_()*1.3-.65),k:'hole',spd:0})}}

/* ---------------- state ---------------- */
let cars=[],items=[],fx=[],pops=[],pos=0,px=0,pvx=0,spd=0,timeLeft=0,pax=12,fareS=0,priceS=1,crashT=0,shake=0,hornCD=0,msg=null,banner=null,boss=null,clearT=0,flashW=0;
let st=0,stT=0,introT=0,tallyT=0,overT=0,overWhy='',continues=0,paused=false,btns=[],SS=null,TY=null,RUN={pax:0,fare:0,crash:0,hitch:0},leafT=0,hintT=0;
let heldK={};
function newGame(i){continues=0;RUN={pax:0,fare:0,crash:0,hitch:0};brief(i)}
function startStage(i){st=i;const s=STAGES[i];LV=i;L.theme=s.theme;L.weather=s.weather==='rain'||s.weather==='snow'?s.weather:null;camX=0;buildBG();buildTrack(i);
 pos=0;px=0;pvx=0;spd=0;timeLeft=s.time;pax=12;fareS=0;priceS=RICE[i];crashT=0;shake=0;hornCD=0;msg=null;banner=null;boss=null;clearT=0;fx=[];pops=[];leafT=0;flashW=0;paused=false;heldK={};
 SS={crash:0,lost:0,hitch:0,cash:0};state='intro';introT=0;hideOv();music(s.music)}
function beginStage(){state='play';stT=0;hintT=0;banner={s:()=>LZ('LEG '+(st+1)+' · ','第 '+(st+1)+' 段 · ')+ZK(STAGES[st],'name'),t:0};SFX.oneup()}
function enterTally(){state='tally';tallyT=0;const s=STAGES[st];TY={fare:fareS,price:priceS,grains:fareS/priceS*2e6,time:Math.max(0,timeLeft)};RUN.pax+=pax;RUN.fare+=fareS;music('off');SFX.fanfare();
 SAVE.un=Math.max(SAVE.un,Math.min(STAGES.length,st+2));SAVE.best[st]=Math.max(SAVE.best[st],pax);saveNow()}
function advance(){if(state==='intro'&&introT>30)beginStage();else if(state==='tally'&&tallyT>70){if(st<STAGES.length-1)brief(st+1);else ending()}}
function fail(why){if(state!=='play')return;state='over';overT=0;overWhy=why;heldK={};music('off');SFX.die()}
function continueGame(){continues++;state='play';timeLeft=Math.max(timeLeft,30);pax=Math.max(pax,8);crashT=90;msg={e:'NEW PASSENGERS CLIMB ABOARD. THEY ALSO PAY IN GOLD YUAN.',z:'新乘客爬上車了。他們一樣付金圓券。',t:0};music(boss&&!boss.dead?STAGES[st].bmus:STAGES[st].music)}
function restartStage(){startStage(st)}
function say(e,z,c){msg={e,z,c,t:0}}
function pop(x,y,e,z,c){pops.push({x,y,e,z,c,t:0})}

/* ---------------- update ---------------- */
function update(){T++;if(state==='pages'){pgT++;return}
 if(state==='intro'){introT++;camX+=.3;if(introT>720)beginStage();return}
 if(state==='tally'){tallyT++;return}
 if(state==='over'){overT++;if(overT>720)toTitle();return}
 if(state!=='play'||paused)return;
 stT++;hintT++;const dt=1/60,s=STAGES[st];const seg=segAt(pos+PZ),sp=spd/MAXS;
 let acc=false,brk=false,steer=0;
 if(clearT){clearT++;spd=Math.max(0,spd-MAXS*(st===5?1.1:.5)*dt);if(clearT>170){enterTally();return}}
 else{acc=touchUI?!heldK.d:!!heldK.u;brk=!!heldK.d;steer=(heldK.r?1:0)-(heldK.l?1:0)}
 if(crashT>0){crashT--;if(crashT>20&&!(boss&&boss.k==='bridge'&&!boss.dead))spd*=.96}
 if(!clearT){if(acc&&!brk)spd+=MAXS/4.5*dt;else if(brk)spd-=MAXS/1.5*dt;else spd-=MAXS/9*dt}
 // steering: grip is low on ice, the dyke is narrow, curves push you outward
 const grip=s.ice?.085:.3,tv=steer*2.3*Math.min(1,.25+sp*1.4)/RWS;pvx+=(tv-pvx)*grip;px+=pvx*dt;px-=dt*sp*sp*seg.curve*CF*(s.ice?1.15:1)/RWS;
 const edge=seg.k==='bridge'||s.pier?.93:0;
 if(edge){if(Math.abs(px)>edge){px=Math.sign(px)*edge;pvx*=-.3;if(spd>MAXS*.35)spd-=MAXS*.9*dt;if(T%5===0){shake=Math.max(shake,3);SFX.clang();sparks(px>0?1:-1)}}}
 else if(Math.abs(px)>1.02){const lim=s.mud?.3:.45;if(spd>MAXS*lim)spd-=MAXS*1.3*dt;if(T%6===0)shake=Math.max(shake,2)}
 px=clamp(px,-2,2);spd=clamp(spd,0,MAXS);pos+=spd*dt;camX+=seg.curve*sp*1.6;
 // horn
 if(hornCD>0)hornCD--;if(heldK.h){heldK.h=0;if(hornCD<=0&&!clearT)honk()}
 // checkpoints and the set piece
 for(const c of chk)if(!c.done&&pos+PZ>=c.z){c.done=1;timeLeft+=22;SFX.oneup();say('CHECKPOINT (STILL OURS)! +22 SEC · PAPERS: ACCEPTED (BRIBE: 1 LUNCH)','檢查站（還是我們的）！+22 秒 · 證件：通過（紅包：一個便當）','#8fe07a');pop(W/2,140,'+22 SEC','+22 秒','#8fe07a')}
 if(!boss&&pos+PZ>=bossZ)spawnBoss();
 if(boss&&!boss.dead)updBoss(dt);
 if(boss&&!boss.dead&&loopB&&pos>=loopB-PZ){const d=loopB-loopA;pos-=d;for(const c of cars)c.z-=d;for(const it of items)it.z-=d;boss.z-=d}
 // traffic
 const pz=pos+PZ;
 for(const c of cars){if(c.spd)c.z+=c.spd*MAXS*dt;if(c.dec){c.spd*=c.dec}if(c.tx!=null)c.x+=clamp(c.tx-c.x,-.025,.025);
  if(c.k==='mark'){c.t++;if(c.t>=c.te)explodeMark(c);continue}
  if(c.k==='boom'){if(++c.t>24){c.k=c.hole?'hole':'crater';c.spd=0}continue}
  if(c.hitT&&--c.hitT<=0)c.hit=0;
  if(c.k==='tram'&&!c.tx&&T%240===0&&rnd()<.3)c.tx=-Math.sign(c.x)*.45;
  const dz=c.z-pz;if(!c.hit&&crashT<=0&&!clearT&&dz>-140&&dz<130&&Math.abs(c.x-px)*RWS<HW[c.k])crash(c)}
 cars=cars.filter(c=>!c.gone&&c.z>pos-SEG*2&&c.z<pos+trackLen);
 for(const it of items){const dz=it.z-pz;if(!it.got&&dz>-150&&dz<150&&Math.abs(it.x-px)*RWS<.34)pickup(it)}items=items.filter(i=>!i.got&&i.z>pos-SEG*2);
 // fares: the number goes up, the value goes down
 fareS+=pax*sp*dt*RICE[st]*3.4e-5;priceS=RICE[st]*Math.pow(1.6,stT/600);
 if(!clearT){timeLeft-=dt;if(timeLeft<=0){timeLeft=0;fail('time');return}}
 if(!clearT&&(!boss||boss.dead)&&pos+PZ>=finishZ){clearT=1;heldK={};SFX.fanfare();banner={s:()=>st===5?LZ('YOU MADE THE LAST FERRY!','趕上最後一班渡輪了！'):LZ('LEG '+(st+1)+' COMPLETE','第 '+(st+1)+' 段完成'),t:0};music('off')}
 if(msg&&++msg.t>200)msg=null;if(banner&&++banner.t>160)banner=null;if(shake>0)shake*=.85;if(leafT>0)leafT--;if(flashW>0)flashW--;
 for(const f of fx){f.x+=f.vx;f.y+=f.vy;f.vy+=f.g||0;f.l--}fx=fx.filter(f=>f.l>0);for(const p of pops)p.t++;pops=pops.filter(p=>p.t<70)}
function sparks(side){for(let i=0;i<4;i++)fx.push({x:W/2+side*34,y:H-20,vx:-side*(1+rnd()*2),vy:-1-rnd()*2,g:.15,l:18,c:pick(['#ffe27a','#ff8a1a']),s:2})}
function debris(x,y,n=14,cols=['#7a5a3a','#5a4030','#ffd24a','#555']){for(let i=0;i<n;i++){const a=rnd()*6.28,v=1+rnd()*3;fx.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-2,g:.15,l:24+rnd()*16,c:pick(cols),s:2+(rnd()*2|0)})}}
const CRASH_E=['DEFECTED','WALKED OFF','FELL OFF','GOT A BETTER OFFER','WENT TO FIND A BOAT'],CRASH_Z=['投共了','自己用走的','掉下車了','找到更好的出路了','去找別的船了'];
function crash(c){const k=c.k,lost=LOST[k]??1;c.hit=1;SS.crash++;RUN.crash++;
 if(k==='refugee'||k==='crowd'){crashT=36;spd*=.45;shake=6;SFX.hit();if(k==='refugee'){c.tx=(c.x>px?1:-1)*1.2;c.hit=0;say('YOU SWERVED INTO A DITCH. THE REFUGEE IS FINE. THANKS FOR ASKING.','你急轉彎衝進水溝。難民沒事，謝謝關心。')}else{c.hit=0;say('THE BANK QUEUE DOES NOT MOVE. NOTHING MOVES IT.','擠兌的人龍不會讓路，什麼都不會讓它動。')}return}
 crashT=40;shake=10;spd*=k==='hole'?.55:.3;SFX.boom(lost>1);pax=Math.max(0,pax-lost);SS.lost+=lost;
 if(STATIC.has(k)&&k!=='roadblock'&&k!=='crowd'){c.gone=1;debris(W/2,H-40)}else{c.tx=null;c.x+=c.x>px?.45:-.45;c.hitT=72}
 const n=rnd()*CRASH_E.length|0;
 if(k==='donkey')say('THE DONKEY IS UNHARMED. THE DONKEY IS NEUTRAL. 1 PASSENGER STAYS WITH THE DONKEY.','驢子毫髮無傷，驢子保持中立。一位乘客決定跟驢子走。');
 else if(k==='buffalo')say('THE BUFFALO DID NOT MOVE. IT HAS SEEN WORSE. 1 PASSENGER FELL OFF.','水牛動也不動，牠見過更糟的場面。一位乘客摔下車了。');
 else if(k==='roadblock')say('ROADBLOCK! 2 PASSENGERS ARE "INVITED" TO STAY.','撞上路障！兩位乘客被「熱情挽留」了。');
 else if(k==='leaflets'){leafT=120;say('A PASSENGER READ A LEAFLET AND GOT OFF.','一位乘客看了傳單，就下車了。')}
 else if(k==='hole')say('A HOLE IN THE DECK! 1 PASSENGER BOUNCED OUT. HE SWIMS BACK. THE OTHER WAY.','橋面破洞！一位乘客被彈出車外，游回去了。往另一邊。');
 else if(k==='shot')say('HIT! 1 PASSENGER DECIDES TO WALK. HONESTLY, IT IS FASTER.','中彈！一位乘客決定用走的。說真的，走路比較快。');
 else if(k==='tram')say('YOU HIT A TRAM. THE TRAM HAS RIGHT OF WAY. 2 PASSENGERS TRANSFER.','撞上電車。電車有路權。兩位乘客轉乘了。');
 else say('CRASH! '+lost+' PASSENGER'+(lost>1?'S ':' ')+CRASH_E[n],'撞車！'+(lost>1?lost+' 位乘客':'一位乘客')+CRASH_Z[n]);
 pop(W/2,104,'-'+lost,'-'+lost,'#ff6a5a');if(pax<=0)fail('pax')}
function pickup(it){it.got=1;SFX.pick();
 if(it.k==='hitch'){pax=Math.min(16,pax+1);SS.hitch++;RUN.hitch++;pop(W/2,104,'+1 PASSENGER','+1 乘客','#8fe07a');const q=pick([['HITCHHIKER ABOARD! HE PAYS IN GOLD YUAN. A WHEELBARROW OF IT.','搭便車的上來了！他付金圓券，一整台推車。'],['A SCHOOLTEACHER CLIMBS ON. SHE BRINGS HER OWN CHAIR.','一位老師爬上車，還自備椅子。'],['A TAILOR CLIMBS ON. HE OFFERS TO HEM THE FLAG.','一位裁縫上車了，他說可以幫國旗收個邊。']]);say(q[0],q[1],'#8fe07a');return}
 const v=RICE[st]*.002;fareS+=v;SS.cash++;pop(W/2,104,'+¥'+fmtBig(v)+' (≈1 EGG)','+¥'+fmtBig(v)+'（約一顆蛋）','#d9a441')}
function honk(){hornCD=70;const t=now();tone(392,392,.22,'square',.05,t);tone(330,330,.3,'square',.05,t+.22);let neutral=0;
 for(const c of cars){const dz=c.z-(pos+PZ);if(dz<0||dz>SEG*40)continue;if(HORNABLE.has(c.k)){c.tx=(c.x>px?1:-1)*1.2}else if(c.k==='donkey'||c.k==='buffalo')neutral=c.k}
 if(neutral)say(neutral==='donkey'?'THE DONKEY IS NEUTRAL. IT DOES NOT MOVE FOR EITHER SIDE.':'THE BUFFALO HAS NO OPINION ON YOUR HORN.',neutral==='donkey'?'驢子保持中立，哪一邊按喇叭牠都不讓。':'水牛對你的喇叭沒有意見。')}
/* ---------------- bosses and set pieces ---------------- */
function spawnBoss(){const s=STAGES[st];timeLeft+=s.btime;SFX.alarm();music(s.bmus);
 banner={s:()=>LZ('WARNING: ','警告：')+ZK(s,'bossName'),t:0,warn:1};say(s.bossHint,s.zh.bossHint,'#ffd24a');
 boss={k:s.boss,t:0,ph:1,fl:0,x:0,tx:0,z:pos+PZ+SEG*30,spd:MAXS*.6,ram:!s.blen,hp:s.hp||s.blen,max:s.hp||s.blen};
 if(s.boss==='btram')boss.x=boss.tx=.45;
 if(s.boss==='bridge')boss.cz=pos-SEG*28;
 if(s.blen){boss.z0=bossZ;boss.z1=bossZ+s.blen*SEG}}
function updBoss(dt){const b=boss,s=STAGES[st];b.t++;if(b.fl>0)b.fl--;const p2=b.ph===2,pz=pos+PZ;
 if(b.ram){const lead=b.z-pz;let tsp=MAXS*(p2?.84:.8);if(lead>SEG*20)tsp=Math.min(tsp,Math.max(MAXS*.3,spd*.8));else if(lead<-SEG*2)tsp=spd+MAXS*.3;b.spd+=(tsp-b.spd)*.05;b.z+=b.spd*dt;
  if(b.k==='btram'){if(b.t%(p2?150:210)===0)b.tx=-Math.sign(b.tx||1)*.45}else if(b.t%(p2?90:140)===0)b.tx=(rnd()*2-1)*.55;
  b.x+=clamp(b.tx-b.x,-(b.k==='btram'?.008:.012),b.k==='btram'?.008:.012);
  const every=p2?95:135;
  if(b.t%every===0&&lead>SEG*7&&lead<SEG*60){const kind=b.k==='ptruck'?'leaflets':b.k==='btram'?'crates':'barrel';cars.push({z:b.z-SEG,x:clamp(b.x+(rnd()-.5)*.3,-.8,.8),k:kind,spd:b.spd/MAXS,dec:.975,tx:null})}
  if((b.k==='acar'||b.k==='acar2')&&b.t%(p2?125:175)===50&&lead>SEG*14&&lead<SEG*60){cars.push({z:b.z-SEG,x:b.x,k:'shot',spd:b.spd/MAXS*.55,tx:clamp(px,-.9,.9)});SFX.eshot();b.mz=8}
  if(b.k==='ptruck'&&b.t%200===100){const sl=[['SURRENDER! WE HAVE RICE!','投降吧！我們有米！'],['YOUR FARE IS WORTHLESS!','你的車資一文不值！'],['THE FERRY IS FULL!','渡輪客滿了！'],['TURN LEFT FOR LIBERATION!','左轉就是解放！']][(b.t/200|0)%4];pop(W/2,64,sl[0],sl[1],'#ff6a5a');SFX.radio()}
  if(b.mz)b.mz--;
  if(lead>-140&&lead<170&&Math.abs(b.x-px)*RWS<HW[b.k]&&spd>b.spd&&crashT<=0){b.hp--;b.fl=12;b.z=pz+SEG*6;spd=Math.min(spd,b.spd*.72);crashT=22;shake=12;SFX.boom();SFX.clang();debris(W/2,H-60,10,['#ffe27a','#ff8a1a','#555']);
   pop(W/2,104,b.hp>0?'RAM! '+b.hp+' TO GO':'RAM!',b.hp>0?'撞到了！還差 '+b.hp+' 下':'撞到了！','#ffd24a');
   if(b.hp<=0)bossDown();else if(b.ph===1&&b.hp<=b.max/2){b.ph=2;banner={s:()=>ZK(s,'angry'),t:0,warn:1};SFX.alarm()}}
  return}
 // survive: progress is distance through the set piece
 b.hp=Math.max(0,(b.z1-pz)/SEG);if(b.ph===1&&b.hp<b.max/2){b.ph=2;banner={s:()=>ZK(s,'angry'),t:0,warn:1};SFX.alarm()}
 if(b.k==='tank'){const every=p2?44:64;if(b.t%every===0&&b.hp>40){const te=p2?62:72,ahead=Math.max(spd,MAXS*.5)*te/60+SEG*(rnd()*6-2);
   const x=rnd()<.6?clamp(px+(rnd()-.5)*.35,-.8,.8):rnd()*1.5-.75;cars.push({z:pz+ahead,x,k:'mark',t:0,te,spd:0});if(b.t%(every*2)===0)SFX.whistle()}}
 if(b.k==='bridge'){const gap=(pos-b.cz)/SEG,csp=MAXS*(p2?.74:.66)*(gap>40?1.4:1);b.cz+=csp*dt;if(T%24===0){SFX.far();skyFlash=.6}
  if(b.cz>=pos){pax=Math.max(0,pax-2);SS.lost+=2;b.cz=pos-SEG*30;crashT=20;shake=14;SFX.boom(true);say('THE BRIDGE FELL UNDER YOU! 2 PASSENGERS SWIM FOR IT. THE WRONG BANK.','橋在你腳下塌了！兩位乘客游走了。游往錯的那一岸。','#ff6a5a');pop(W/2,104,'-2','-2','#ff6a5a');if(pax<=0){fail('pax');return}}
  if(b.t%(p2?80:110)===0&&b.hp>40){const ahead=Math.max(spd,MAXS*.5)*1.2+SEG*rnd()*4;cars.push({z:pz+ahead,x:rnd()*1.3-.65,k:'mark',t:0,te:72,spd:0,hole:1})}}
 if(pz>=b.z1)bossDown()}
function explodeMark(c){c.k='boom';c.t=0;SFX.boom(true);shake=Math.max(shake,8);const dz=c.z-(pos+PZ);
 if(Math.abs(dz)<SEG*1.3&&Math.abs(c.x-px)*RWS<.34&&crashT<=0&&!clearT){crashT=40;spd*=.35;pax=Math.max(0,pax-2);SS.lost+=2;SS.crash++;RUN.crash++;flashW=10;
  say(c.hole?'THE ENGINEERS BLEW THIS PART EARLY. 2 PASSENGERS GOT OFF EARLY TOO.':'SHELL HIT! 2 PASSENGERS DECIDE TO WALK. HONESTLY, IT IS FASTER.',c.hole?'工兵提早炸了這一段。兩位乘客也提早下車了。':'中彈！兩位乘客決定用走的。說真的，走路比較快。','#ff6a5a');pop(W/2,104,'-2','-2','#ff6a5a');if(pax<=0)fail('pax')}
}
function bossDown(){const b=boss,s=STAGES[st];b.dead=1;b.hp=0;SFX.boom(true);setTimeout(()=>SFX.oneup(),700);shake=16;flashW=14;
 banner={s:()=>ZK(s,'down'),t:0};music(s.music);
 if(b.ram){cars.push({z:b.z,x:b.x,k:'wreck',spd:0,bk:b.k,hit:1});timeLeft+=8}
 for(const c of cars)if(c.k==='mark'){c.k='crater'}
 if(b.k==='tank')say('THE TANK SANK INTO THE PADDY. IT WAS FUELLED WITH GOLD YUAN.','戰車陷進水田了。它加的油是用金圓券買的。','#8fe07a');
 if(b.k==='bridge')say('HQ CALLS IT A SUCCESSFUL DEMOLITION. IT WAS ALSO OUR ONLY BRIDGE.','總部說這是一次成功的爆破。那也是我們唯一的一座橋。','#8fe07a')}

/* ---------------- render: road ---------------- */
function project(wx,wy,wz,camY){const sc=CAMD/wz;return{x:Math.round(W/2+sc*wx*W/2),y:Math.round(HZ-sc*(wy-camY)*H/2),w:Math.round(sc*RW*RWS*W/2),sc}}
function poly(x1,y1,w1,x2,y2,w2,c){ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(x1-w1,y1);ctx.lineTo(x2-w2,y2);ctx.lineTo(x2+w2,y2);ctx.lineTo(x1+w1,y1);ctx.closePath();ctx.fill()}
function quad(x1,y1,a1,b1,x2,y2,a2,b2,c){ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(x1+a1,y1);ctx.lineTo(x2+a2,y2);ctx.lineTo(x2+b2,y2);ctx.lineTo(x1+b1,y1);ctx.closePath();ctx.fill()}
const FOGC='#a9b2ac';
function fogAt(n){return STAGES[st].fog?clamp((n-6)/40,0,.92):0}
function drawSky(){const s=STAGES[st];ctx.save();ctx.beginPath();ctx.rect(0,0,W,HZ+3);ctx.clip();ctx.translate(0,HZ-GY+6);drawBG();ctx.restore();
 if(s.fog){ctx.globalAlpha=.8;r(0,0,W,HZ+3,FOGC);ctx.globalAlpha=1}
 if(boss&&boss.k==='bridge'&&!boss.dead&&skyFlash>0){ctx.globalAlpha=skyFlash*.35;r(0,0,W,HZ+3,'#ff8a3a');ctx.globalAlpha=1;skyFlash*=.9}}
function renderRoad(){const s=STAGES[st];const base=clamp(Math.floor(pos/SEG),0,segs.length-1),pct=(pos%SEG)/SEG,bs=segs[base];const camY=CAMH+lerp(bs.y1,bs.y2,pct);
 let x=0,dx=-bs.curve*VC*pct*SEG,maxY=H;const vis=[];
 for(let n=0;n<DRAW;n++){const g=segs[base+n];if(!g)break;const z1=Math.max(1,n*SEG-pct*SEG),z2=n*SEG-pct*SEG+SEG;
  const p1=project(x-px*RW*RWS,g.y1,z1,camY),p2=project(x+dx-px*RW*RWS,g.y2,z2,camY);x+=dx;dx+=g.curve*VC*SEG;g.p1=p1;g.p2=p2;g.clip=maxY;g.n=n;
  if(p1.y<=p2.y||p2.y>=maxY){g.vis=0;continue}g.vis=1;vis.push(g);const P=GP[g.pal]||GP[s.pal],alt=(Math.floor((base+n)/3))%2;
  ctx.fillStyle=P.grass[alt];ctx.fillRect(0,p2.y,W,p1.y-p2.y);
  if(P.water&&alt&&n<60){ctx.fillStyle='#4a6a90';const o=((base+n)*37)%W;ctx.fillRect(o,p2.y,10,1);ctx.fillRect((o+150)%W,p2.y,6,1)}
  if(s.pal==='paddy'&&!P.water&&alt){ctx.fillStyle='#6a9a3a';for(let k=0;k<6;k++){const o=p1.x+(k-2.5)*p1.w*.9;if(Math.abs(o-p1.x)>p1.w*1.3)ctx.fillRect(o,p2.y,Math.max(1,p1.w*.04),Math.max(1,p1.y-p2.y))}}
  if(P.walk)poly(p1.x,p1.y,p1.w*1.5,p2.x,p2.y,p2.w*1.5,alt?'#4a4652':'#44404c');
  if(g.k==='pier'||(s.pier&&g.pal==='harbor'))poly(p1.x,p1.y,p1.w*1.25,p2.x,p2.y,p2.w*1.25,'#3a2e24');
  poly(p1.x,p1.y,p1.w*1.12,p2.x,p2.y,p2.w*1.12,P.rumble[alt]);poly(p1.x,p1.y,p1.w,p2.x,p2.y,p2.w,P.road[alt]);
  if(s.pal==='harbor'&&!alt)for(let k=-3;k<=3;k++)poly(p1.x+p1.w*k*.28,p1.y,Math.max(.5,p1.w*.006),p2.x+p2.w*k*.28,p2.y,Math.max(.5,p2.w*.006),'#4a3a2c');
  if(s.pal==='snow'&&alt){poly(p1.x-p1.w*.5,p1.y,p1.w*.08,p2.x-p2.w*.5,p2.y,p2.w*.08,'#c8d2de');poly(p1.x+p1.w*.45,p1.y,p1.w*.06,p2.x+p2.w*.45,p2.y,p2.w*.06,'#c8d2de')}
  if(s.boss==='btram'){for(const tx_ of[-.45,.45])for(const o of[-.1,.1])poly(p1.x+p1.w*(tx_+o),p1.y,Math.max(.5,p1.w*.012),p2.x+p2.w*(tx_+o),p2.y,Math.max(.5,p2.w*.012),'#7a7682')}
  if(P.lane&&alt)for(const o of(s.rws>=1.1?[-.33,.33]:[0]))poly(p1.x+p1.w*o,p1.y,p1.w*.025,p2.x+p2.w*o,p2.y,p2.w*.025,P.lane);
  const f=fogAt(n);if(f>0){ctx.globalAlpha=f;ctx.fillStyle=FOGC;ctx.fillRect(0,p2.y,W,p1.y-p2.y);ctx.globalAlpha=1}
  maxY=p1.y}
 // bucket moving things by segment, then draw back to front
 const bk={};const put=(o,kind)=>{const cz=o.z-pos;if(cz<SEG*2||cz>=DRAW*SEG)return;const n=Math.floor(cz/SEG);(bk[n]=bk[n]||[]).push([o,kind,cz])};
 for(const c of cars)put(c,'car');for(const it of items)put(it,'item');if(boss&&!boss.dead&&boss.ram)put(boss,'boss');
 for(let i=vis.length-1;i>=0;i--){const g=vis[i],n=g.n;if(n<2)continue;const f=fogAt(n);if(f>.9)continue;ctx.globalAlpha=1-f*.85;
  for(const sp of g.sprites)drawSpr(sp,g.p1.x+g.p1.w*sp.x,g.p1.y,g.p1.w/(RW*RWS)*KS,g.clip);
  const L_=bk[n];if(L_){L_.sort((a,b)=>b[2]-a[2]);for(const[o,kind,cz]of L_){const k=(cz%SEG)/SEG,p1=g.p1,p2=g.p2;const sx=lerp(p1.x,p2.x,k)+lerp(p1.w,p2.w,k)*o.x,sy=lerp(p1.y,p2.y,k),sc=lerp(p1.w,p2.w,k)/(RW*RWS)*KC,ww=lerp(p1.w,p2.w,k);
   if(kind==='item')drawItem(o,sx,sy,sc,g.clip);else if(kind==='boss')drawVeh(boss.k,sx,sy,sc*1.35,g.clip,boss);else if(o.k==='mark'||o.k==='hole'||o.k==='crater'||o.k==='boom')drawDecal(o,sx,sy,ww,g.clip);else drawVeh(o.k,sx,sy,sc,g.clip,o)}}
  ctx.globalAlpha=1}}
function stext(t,x,y,c){if(CJK_RE.test(t)){ctx.font=ZF(8,700);ctx.fillStyle=c;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(t,x,y);ctx.textBaseline='top'}else tinyPx(t,x,y-2,c,'center',0)}
function clipTo(y){ctx.save();ctx.beginPath();ctx.rect(0,0,W,y);ctx.clip()}
function drawDecal(o,x,y,w,clip){const hw=Math.max(2,w*.2),hh=Math.max(1,hw*.22);clipTo(clip);
 if(o.k==='mark'){const on=(o.t>>2)%2||o.te-o.t<20;ctx.globalAlpha*=.9;r(x-hw,y-hh,hw*2,hh*2,on?'rgba(200,40,30,.55)':'rgba(120,20,20,.35)');const t2=Math.max(1,hw*.15);for(let i=-4;i<=4;i++){r(x+i*hw/4-t2/2,y+i*hh/4-t2/2,t2,t2,'#ff3a2a');r(x+i*hw/4-t2/2,y-i*hh/4-t2/2,t2,t2,'#ff3a2a')}
  const sh=1-o.t/o.te;r(x-hw*.3*sh,y-hh*.3-hw*4*sh,Math.max(1,hw*.25),Math.max(1,hw*.4),'#2a2a26')}
 else if(o.k==='boom'){const k=o.t/24,rr=hw*(.6+k);ctx.globalAlpha*=(1-k);const ci=(cx,cy,rad,c)=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(cx,cy,Math.max(1,rad),0,7);ctx.fill()};ci(x,y-rr*1.4,rr*.9,'#555');ci(x,y-rr*.7,rr,'#ff8a1a');ci(x,y-rr*.6,rr*.55,'#ffe27a')}
 else{r(x-hw,y-hh,hw*2,hh*2,'#120d0c');r(x-hw*.8,y-hh*.6,hw*1.6,hh*1.2,o.k==='hole'?'#1f3656':'#2a2018')}
 ctx.restore()}
/* ---------------- render: roadside sprites ---------------- */
function drawSpr(sp,x,y,s,clip){const k=sp.k;if(s<.03||y>clip+60)return;clipTo(clip);ctx.translate(Math.round(x),Math.round(y));ctx.scale(s,s);const S_=STAGES[st];
 if(k==='house'){r(-20,-24,40,24,'#21171b');r(-24,-28,48,4,'#1a1216');r(-4,-16,8,8,'#d9843a')}
 else if(k==='burn'){r(-20,-24,40,24,'#21171b');r(-24,-28,48,4,'#1a1216');const f=(T>>2)%3;r(-14,-36-f,10,10+f,'#ff8a1a');r(2,-34+f,8,8,'#ffb04a');r(-10,-30,4,4,'#ffe27a')}
 else if(k==='tree'){r(-2,-40,4,40,'#2a1e18');r(-14,-50,28,14,S_.pal==='river'?'#3a5a2a':'#2f4a2a');r(-10,-56,20,8,'#3a5a32')}
 else if(k==='poster'){r(-24,-30,48,30,'#5b4636');r(-20,-27,18,24,'#2f4f8a');hanV('救國',-11,-25,'#f2f2f2',8);r(2,-27,18,24,'#b8322a');hanV('解放',11,-25,'#f1d27a',8)}
 else if(k==='bags'){for(let i=0;i<5;i++)r(-20+i*8,-6,8,6,'#8a7650');for(let i=0;i<4;i++)r(-16+i*8,-12,8,6,'#9a8660')}
 else if(k==='pine'){r(-2,-14,4,14,'#3a2a20');for(let i=0;i<4;i++){r(-16+i*3,-18-i*10,32-i*6,8,'#2f4a3a');r(-16+i*3,-18-i*10,32-i*6,2,'#ffffff')}}
 else if(k==='rock'){r(-18,-12,36,12,'#6a7280');r(-12,-20,22,8,'#7a828e');r(-12,-20,22,3,'#ffffff');r(-18,-12,10,2,'#ffffff')}
 else if(k==='sprout'){for(let i=0;i<5;i++)for(let j=0;j<2;j++)r(-24+i*10+j*5,-6-j*2,2,6,'#6a9a3a')}
 else if(k==='farmer'){r(-20,-2,40,2,'#3a5a5a');drawCivilian(-8,0,{face:1,hat:'straw',emo:(T>>6)%3?'normal':'smug',cl:'#55707e'})}
 else if(k==='post'){r(-2,-30,4,30,'#3a2818');r(-6,-30,12,3,'#3a2818')}
 else if(k==='girder'){r(-2,-44,4,44,'#4a4a52');r(-2,-44,4,2,'#7a7a82');seg(-1,-40,8*Math.sign(sp.x||1),-4,2,'#3a3a42');r(-8,-46,16,3,'#3a3a42')}
 else if(k==='junk'){r(-15,-4,30,5,'#5a3a24');r(-11,-6,22,2,'#7a5232');r(0,-30,1,24,'#3a2a20');r(-9,-28,9,20,'#c8a878');for(let i=0;i<4;i++)r(-9,-25+i*5,9,1,'#8a6a48');r(-7,-22,5,5,'#b8322a')}
 else if(k==='lamp'){r(-1,-56,3,56,'#2a2a30');r(-5,-60,10,4,'#3a3a40');r(-3,-56,6,3,'#ffe8a0');if(S_.night){ctx.globalAlpha*=.25;r(-10,-54,20,12,'#ffe8a0');ctx.globalAlpha=Math.min(1,ctx.globalAlpha*4)}}
 else if(k==='shop'){r(-22,-44,44,44,'#15131f');for(let i=0;i<3;i++)r(-18+i*13,-38,8,10,'#e0b050');r(-22,-16,44,3,'#c8372d');hanV('當',16,-42,'#d9a441',7)}
 else if(k==='bank'){r(-26,-54,52,54,'#5a5060');for(let i=0;i<4;i++)r(-22+i*13,-46,5,44,'#7a7080');r(-28,-58,56,4,'#4a4050');hanV('銀行',22,-52,'#d9a441',8);for(let i=0;i<4;i++)drawCivilian(-20+i*9,0,{face:-1,hat:i%2?'fedora':'none',emo:'scared',cl:i%2?'#4a4a52':'#55707e'})}
 else if(k==='crane'){r(-3,-90,6,90,'#5a3a2a');r(-3,-90,40,5,'#5a3a2a');r(-20,-90,17,4,'#4a2e20');r(30,-85,1,40,'#222');r(26,-46,10,8,'#7a5a2a');seg(-3,-60,20,-88,2,'#4a2e20')}
 else if(k==='crates'){r(-16,-14,14,14,'#7a5a2a');r(-16,-14,14,2,'#9a7a3a');r(0,-14,14,14,'#6a4a22');r(-8,-28,14,14,'#7a5a2a');r(-8,-28,14,2,'#9a7a3a');hanV('金',-1,-26,'#d9a441',8)}
 else if(k==='bollard'){r(-4,-8,8,8,'#2a2a2a');r(-5,-10,10,3,'#3a3a3a')}
 else if(k==='ship'){r(-60,-18,120,18,'#2a2222');r(-40,-34,70,16,'#d9cfb8');r(10,-50,10,16,'#3a3a40');r(-62,-20,124,3,'#3a3030');for(let i=0;i<5;i++)r(-34+i*12,-30,6,5,'#2a3a4a')}
 else if(k==='sign'){const t=ZK(S_,'signs')[sp.s|0];r(-1,-30,2,30,'#5a3a20');const zh=CJK_RE.test(t);ctx.font=ZF(9,700);const w=(zh?Math.ceil(ctx.measureText(t).width):t.length*4)+8;r(-w/2,-44,w,14,'#e9dcc2');r(-w/2,-44,w,2,'#a8977c');if(zh){ctx.fillStyle='#120d0c';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(t,0,-37);ctx.textBaseline='top'}else tinyPx(t,0,-39,'#120d0c','center',0)}
 else if(k==='check'){const bos=sp.boss;r(-70,-40,6,40,'#5a4030');r(64,-40,6,40,'#5a4030');r(-70,-48,140,10,bos?'#7a1a14':'#2f4166');const t=bos?LZ('DANGER · LAST CHECKPOINT','危險 · 最後一個檢查站'):LZ('CHECKPOINT (STILL OURS)','檢查站（還是我們的）');
  stext(t,0,-43,'#f1d27a');
  if(!bos){drawSoldier(-62,0,{fac:'kmt',face:1,emo:'smug',gun:'rifle'});drawSoldier(48,0,{fac:'kmt',face:-1,emo:(T>>5)%2?'happy':'smug',gun:null,item:'case'})}else{drawSoldier(-62,0,{fac:'kmt',face:1,emo:'scared',gun:'rifle'})}}
 else if(k==='finish'){r(-74,-52,6,52,'#5a4030');r(68,-52,6,52,'#5a4030');r(-74,-62,148,12,'#d9a441');stext(ZK(S_,'goal'),0,-56,'#120d0c');
  for(let i=0;i<10;i++)r(-74+i*15,-50,7,3,i%2?'#e9dcc2':'#120d0c')}
 else if(k==='ferry'){r(-120,-30,240,30,'#3a3030');r(-130,-36,22,8,'#3a3030');r(108,-36,22,8,'#3a3030');r(-90,-60,170,30,'#d9cfb8');r(-90,-60,170,3,'#a8977c');for(let i=0;i<10;i++)r(-82+i*16,-52,8,7,'#2a3a4a');
  r(30,-96,22,36,'#2f4f8a');r(30,-96,22,5,'#120d0c');r(37,-84,8,8,'#f2f2f2');r(-30,-14,60,14,'#5a4030');for(let i=0;i<9;i++){ctx.save();ctx.translate(-80+i*18,-62);ctx.scale(.6,.6);drawHead(0,0,i%3===1?'kmt':'civ',(T>>4)%2?'happy':'shout',1);ctx.restore()}
  for(let q=0;q<4;q++){const s2=(T*.4+q*12)%48;ctx.globalAlpha=Math.max(0,.6-s2/90);r(36-s2*.6,-104-s2*.5,6+q,4+q,'#5a5a64');ctx.globalAlpha=1}}
 ctx.restore()}
function drawItem(it,x,y,s,clip){if(s<.05)return;clipTo(clip);ctx.translate(Math.round(x),Math.round(y));ctx.scale(s,s);
 if(it.k==='hitch'){drawCivilian(-8,0,{face:it.x>0?-1:1,hat:['straw','fedora','none'][(it.z/SEG|0)%3],emo:'happy',arm:'wave',cl:['#55707e','#6a5040','#4a4a52'][(it.z/SEG|0)%3]});if(T%40<26){r(-3,-48,6,6,'#8fe07a');r(-1,-50,2,10,'#8fe07a');r(-5,-46,10,2,'#8fe07a')}}
 else{const b=Math.sin(T*.15)*2;r(-8,-12+b,16,10,'#7a5a2a');r(-8,-12+b,16,2,'#d9a441');r(-6,-16+b,4,4,'#8aa070');r(1,-15+b,5,3,'#b0a070');ctx.font='900 8px serif';ctx.fillStyle='#ffd24a';ctx.textAlign='center';ctx.fillText('¥',0,-10+b)}
 ctx.restore()}
/* ---------------- render: vehicles and road users ---------------- */
function donkeyArt(fl){const c=fl?'#fff':'#8a8078';r(-12,-18,22,9,c);r(8,-24,6,10,c);r(10,-30,2,6,c);r(13,-30,2,6,c);r(12,-20,2,2,'#120d0c');for(const lx of[-10,-4,2,7])r(lx,-9,2,9,'#5a524c');r(-14,-18,2,6,'#5a524c')}
function drawVeh(k,x,y,s,clip,o){if(s<.04||y>clip+80)return;clipTo(clip);ctx.translate(Math.round(x),Math.round(y));ctx.scale(s,s);const fl=o&&o.fl>0&&T%2;
 if(k==='cart'){donkeyArt();r(-30,-16,24,10,'#5a4030');r(-28,-26,20,10,'#a08a5a');r(-30,-6,6,6,'#2a1e18');r(-12,-6,6,6,'#2a1e18');drawCivilian(-28,-12,{face:1,hat:'straw',emo:'normal'})}
 else if(k==='donkey'){donkeyArt();if(T%120<40)stext(LZ('HEE-HAW','咿—啊'),0,-38,'#e9dcc2')}
 else if(k==='buffalo'){r(-20,-20,40,14,'#3a3a3a');r(16,-22,10,10,'#3a3a3a');r(14,-26,4,4,'#cfc8b8');r(24,-26,4,4,'#cfc8b8');for(const lx of[-18,-10,6,14])r(lx,-8,4,8,'#2a2a2a');r(22,-18,2,2,'#e9dcc2')}
 else if(k==='refugee'){drawCivilian(-8,0,{face:1,hat:'straw',emo:'scared',pose:'run',anim:T});r(-6,-26,12,8,'#a08a5a')}
 else if(k==='rickshaw'){r(-12,-20,24,14,'#7a2a2a');r(-14,-6,5,6,'#1a1410');r(9,-6,5,6,'#1a1410');drawCivilian(-8,-6,{face:1,hat:'fedora',emo:'smug'});drawCivilian(-24,0,{face:1,hat:'straw',emo:'normal',pose:'run',anim:T})}
 else if(k==='bike'){r(-8,-5,5,5,'#222');r(4,-5,5,5,'#222');r(-6,-8,14,2,'#444');drawCivilian(-8,-5,{face:1,hat:'cap',emo:'normal',pose:'run',anim:T})}
 else if(k==='barrel'){const sp=o&&o.dec&&o.spd>.02?(T>>2)%2:0;r(-7,-16,14,16,'#4a5a3a');r(-7,-12+sp,14,2,'#2a3a1a');r(-7,-5-sp,14,2,'#2a3a1a');r(-5,-15,4,2,'#6a7a52')}
 else if(k==='leaflets'){for(let i=0;i<3;i++){r(-12+i*3,-8-i*5,18,5,'#b8322a');r(-11+i*3,-8-i*5,16,1,'#e9dcc2')}if(T%10<5)r(-4,-24,6,4,'#e9dcc2')}
 else if(k==='crates'){r(-14,-14,14,14,'#7a5a2a');r(-14,-14,14,2,'#9a7a3a');r(0,-12,12,12,'#6a4a22');r(-8,-24,12,10,'#7a5a2a')}
 else if(k==='roadblock'){for(let i=0;i<6;i++)r(-30+i*10,-8,10,8,'#8a7650');for(let i=0;i<5;i++)r(-25+i*10,-15,10,7,'#9a8660');r(-30,-2,60,2,'#5a4a32');drawSoldier(-24,-15,{fac:'ccp',face:1,emo:'smug',gun:'rifle'});drawSoldier(8,-15,{fac:'ccp',face:-1,emo:'grit',gun:'rifle'});r(26,-44,1,30,'#3a2a20');r(27,-44,12,8,'#b8322a');r(28,-43,2,2,'#f1d27a')}
 else if(k==='crowd'){for(let i=0;i<6;i++)drawCivilian(-34+i*11,-(i%2)*3,{face:i%2?1:-1,hat:['fedora','none','straw'][i%3],emo:i%3?'scared':'shout',cl:['#4a4a52','#55707e','#6a5040'][i%3],arm:i%2?'up':null});r(-12,-46,24,10,'#e9dcc2');ctx.font='900 8px serif';ctx.fillStyle='#b8322a';ctx.textAlign='center';ctx.textBaseline='top';ctx.fillText('¥ ¥ ¥',0,-45)}
 else if(k==='tram'||k==='btram'){const big=k==='btram',c=fl?'#fff':big?'#5f6b3f':'#3a5a4a';r(-30,-50,60,46,c);r(-30,-50,60,4,'#2a3a2a');for(let i=0;i<4;i++)r(-26+i*14,-42,10,12,'#e0c070');r(-30,-18,60,3,'#c8372d');r(-26,-4,8,4,'#1a1a18');r(18,-4,8,4,'#1a1a18');r(-1,-64,2,14,'#333');r(-10,-66,20,2,'#333');
  if(big){r(-36,-29,72,10,'#b8322a');stext(LZ('NEXT: LIBERATION','下一站：解放'),0,-24,'#f1d27a');emblem('ccp',-4,-60+2);r(-30,-8,60,4,T%10<5?'#ff3a2a':'#7a1a14')}else hanV('電',0,-48,'#f1d27a',6)}
 else if(k==='truckC'){const c=fl?'#fff':'#5f6b3f';r(-22,-32,44,28,c);r(-22,-32,44,3,'#3a4226');r(-22,-6,10,6,'#1a1a18');r(12,-6,10,6,'#1a1a18');r(-18,-28,36,14,'#4f5838');emblem('ccp',-4,-24);r(-20,-10,6,3,'#b8322a');r(14,-10,6,3,'#b8322a')}
 else if(k==='ptruck'){const c=fl?'#fff':'#5f6b3f';r(-24,-34,48,30,c);r(-24,-34,48,3,'#3a4226');r(-24,-6,10,6,'#1a1a18');r(14,-6,10,6,'#1a1a18');r(-22,-26,44,10,'#b8322a');stext(LZ('GOOD NEWS!','好消息！'),0,-21,'#f1d27a');
  for(const sx of[-18,10]){r(sx,-46,8,8,'#3a3a3a');r(sx+2,-44,4,4,'#9a9aa0');r(sx+3,-38,2,4,'#333')}if(T%8<4)for(let i=0;i<3;i++)r(-26-i*4,-44-i*3,2,6-i,'#e9dcc2');r(-22,-10,6,3,'#ff3a2a');r(16,-10,6,3,'#ff3a2a')}
 else if(k==='acar'||k==='acar2'){const c=fl?'#fff':k==='acar'?'#5d6447':'#4f5838',d=fl?'#ddd':'#3a4226';r(-28,-30,56,24,c);r(-30,-14,60,8,d);r(-14,-42,28,12,d);r(-2,-38,4,4,'#120d0c');r(-26,-8,12,8,'#1a1a18');r(14,-8,12,8,'#1a1a18');for(let i=0;i<5;i++)r(-24+i*11,-27,6,2,'#2a2e1e');
  r(-6,-26,12,10,'#2f4f8a');r(-3,-23,6,4,'#f2f2f2');r(-2,-26,8,10,'#b8322a');r(0,-24,3,3,'#f1d27a');r(-24,-12,6,3,'#ff3a2a');r(18,-12,6,3,'#ff3a2a');if(o&&o.mz)r(-4,-52,8,10,'#ffe27a');if(k==='acar2'){r(-10,-50,1,8,'#333');r(-9,-50,8,5,'#b8322a')}}
 else if(k==='shot'){const g=T%4<2;r(-4,-14,8,8,g?'#ffe27a':'#ff8a1a');r(-2,-12,4,4,'#fff');ctx.globalAlpha*=.4;r(-7,-17,14,14,'#ff8a1a')}
 else if(k==='wreck'){r(-28,-18,56,14,'#2a2622');r(-14,-26,28,8,'#1a1612');r(-26,-6,12,6,'#120d0c');const f=(T>>2)%3;r(-8,-36-f,10,10+f,'#ff8a1a');r(4,-32+f,6,6,'#ffb04a');for(let q=0;q<3;q++){const s2=(T*.5+q*14)%42;ctx.globalAlpha=Math.max(0,.6-s2/70);r(-4-s2*.3,-44-s2,6+q*2,5+q,'#4a4a4a');ctx.globalAlpha=1}}
 ctx.restore()}
function drawTruck(){const S_=STAGES[st],steer=(heldK.r?1:0)-(heldK.l?1:0),x=W/2+Math.round(clamp(pvx*4,-4,4)),y=H-14+(crashT>20?Math.round(Math.sin(T)*2):0),b=spd>10&&T%4<2?1:0;
 if(S_.night||S_.fog){ctx.globalAlpha=S_.fog?.18:.14;ctx.fillStyle='#ffe8a0';ctx.beginPath();ctx.moveTo(x-24,y-14);ctx.lineTo(x-90,y-90);ctx.lineTo(x+90,y-90);ctx.lineTo(x+24,y-14);ctx.fill();ctx.globalAlpha=1}
 ctx.save();ctx.translate(x,y);r(-36,-4,72,4,'rgba(0,0,0,.4)');
 r(-34,-36+b,68,32,'#4a5a78');r(-34,-36+b,68,4,'#2a3450');r(-30,-44+b,60,8,'#5a6d90');r(-34,-20+b,68,2,'#3a4866');emblem('kmt',-4,-30+b);
 const n=Math.min(pax,12);for(let i=0;i<n;i++){const row=i<7?0:1,col=row?i-7:i;ctx.save();ctx.translate(-30+col*(row?11:8.4)+(row?4:0),-41+b-row*5+(col%2?-1:0)+(spd>0&&(T+i*7)%20<3?-2:0));ctx.scale(.42,.42);drawHead(0,0,i%4===2?'kmt':'civ',crashT>20?'scared':leafT>0?'cry':spd>MAXS*.8?'shout':'happy',1);ctx.restore()}
 if(pax>12)tinyPx('+'+(pax-12),30,-52+b,'#8fe07a','right');
 r(-36,-8,16,8,'#1a1a18');r(20,-8,16,8,'#1a1a18');r(-30,-16,8,4,heldK.d?'#ff3a2a':'#8a2a20');r(22,-16,8,4,heldK.d?'#ff3a2a':'#8a2a20');r(-9,-14,18,6,'#2a2a2a');tinyPx('48',0,-13,'#e9dcc2','center',0);
 if(steer)r(steer>0?30:-34,-12,4,3,T%10<5?'#ffb04a':'#7a4a1a');
 if(spd>MAXS*.3&&T%3===0)for(let i=0;i<2;i++)fx.push({x:x-24+rnd()*48,y:y-2,vx:(rnd()-.5)*.5,vy:.6,l:12,c:S_.pal==='snow'?'rgba(255,255,255,.8)':S_.pal==='paddy'?'rgba(120,100,70,.7)':'rgba(160,140,120,.6)',s:3});
 ctx.restore()}
/* ---------------- render: weather and HUD ---------------- */
let EMB=null;
function drawWeather2(){const w=STAGES[st].weather;if(!EMB){EMB=[];for(let i=0;i<40;i++)EMB.push({x:rnd()*W,y:rnd()*H,v:.4+rnd(),ph:rnd()*6})}
 if(w==='embers')for(const p of EMB){p.y-=.5*p.v;p.x+=Math.sin((T+p.ph*50)/30)*.4;if(p.y<0){p.y=H;p.x=rnd()*W}r(p.x,p.y,1,1,p.v>1?'#ffb04a':'#ff6a1a')}
 if(w==='gulls')for(let i=0;i<5;i++){const gx=((i*97+T*.4*(1+i%2))%(W+40))-20,gy=20+i*9+Math.sin((T+i*30)/20)*4,f=(T>>3)%2;r(gx,gy,3,1,'#e9dcc2');r(gx+3,gy-f,3,1,'#e9dcc2');r(gx-2,gy+f-1,2,1,'#e9dcc2')}
 if(st===4)for(let i=0;i<10;i++){const p=EMB[i];p.y+=.3*p.v;if(p.y>H)p.y=0;const f=Math.sin((T+p.ph*40)/10);r((p.x+Math.sin((T+p.ph*60)/30)*8+W)%W,p.y,5,Math.max(1,Math.abs(f)*3)|0,i%2?'#8aa070':'#b0a070')}
 if(leafT>0){ctx.globalAlpha=Math.min(1,leafT/40);for(let i=0;i<26;i++){const lx=(i*53+T*(1+i%3)*.7)%(W+20)-10,ly=(i*37+T*(.6+i%4*.3))%(H-30)+10,f=Math.sin(T*.2+i);r(lx,ly,14,Math.max(2,Math.abs(f)*9)|0,'#e9dcc2');r(lx+2,ly+1,8,1,'#b8322a')}ctx.globalAlpha=1}}
function hud(){const S_=STAGES[st],zh=LANG==='zh';r(0,0,W,20,'rgba(12,9,8,.72)');
 const tl=Math.ceil(timeLeft);_txt(String(tl),6,2,tl<=10&&T%20<10?'#ff5a3a':'#ffd24a','left',F16);tiny(LZ('TIME','時間'),58,6,'#a8977c');
 tiny(LZ('PASSENGERS ','乘客 ')+pax,96,3,pax<=4?'#ff6a5a':'#a8977c');for(let i=0;i<Math.min(pax,16);i++)r(96+i*4,12,3,5,pax<=4?'#ff6a5a':i<12?'#e3b184':'#8fe07a');
 tiny(LZ('LEG '+(st+1)+'/6 · ','第 '+(st+1)+'／6 段 · ')+ZK(S_,'name'),228,3,'#a8977c','center');
 const goal=boss&&!boss.dead?Math.min(1,(pos+PZ)/finishZ):Math.min(1,(pos+PZ)/finishZ);r(168,12,120,3,'#2a2018');r(168,12,Math.round(120*goal),3,'#d9a441');r(168+Math.round(120*bossZ/finishZ),11,1,5,'#b8322a');r(290,10,6,5,'#e9dcc2');r(291,8,2,2,'#e9dcc2');
 // bottom: speedometer and fare meter
 const kmh=Math.round(spd/MAXS*88);tinyPx(kmh+' KM/H',W/2-44,H-17,'#e9dcc2','right');r(W/2-104,H-9,60,3,'#2a2018');r(W/2-104,H-9,Math.round(60*spd/MAXS),3,spd>MAXS*.9?'#ff8a3a':'#8fe07a');
 tinyPx('¥'+fmtBig(fareS),W/2+44,H-17,'#d9a441');const gr=fareS/priceS*2e6;tiny(LZ('≈ '+fmtBig(gr)+' GRAINS OF RICE','≈ '+fmtBig(gr)+' 粒米'),W/2+44,H-10,'#a8977c');
 if(hornCD>0){r(W/2+44,H-22,Math.round(30*(1-hornCD/70)),2,'#d9a441')}
 if(boss&&!boss.dead){const b=boss,w=150,bx=W/2-w/2,by=24,fr=b.dead?0:b.ram?b.hp/b.max:b.hp/b.max;r(bx-1,by-1,w+2,6,'#120d0c');r(bx,by,w,4,'#2a0a0a');r(bx,by,Math.round(w*fr),4,b.ram?'#c8372d':'#d9a441');tiny(b.ram?ZK(S_,'bossName'):LZ('DISTANCE TO SAFETY · ','離安全還有 · ')+Math.ceil(b.hp)+(zh?' 段':''),W/2,by+7,'#e9dcc2','center');
  if(!b.ram&&!b.dead)mirror()}}
function mirror(){const x=W/2-34,y=44,w=68,h=18;r(x-2,y-2,w+4,h+4,'#2a2a2a');ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();const S_=STAGES[st];
 r(x,y,w,h,S_.fog?'#8a928c':'#6a7a90');r(x,y+h-6,w,6,S_.pal==='paddy'?'#7a6a48':'#5a4030');
 if(boss.k==='tank'){const k=(T%160)/160;r(x+24,y+6,22,8,'#4a5038');r(x+29,y+3,12,4,'#3a4028');r(x+40,y+4,8,2,'#2a2e1e');if(boss.t%64<6)r(x+46,y+2,5,5,'#ffe27a')}
 else{const near=clamp(1-(pos-boss.cz)/(SEG*28),0,1);const fw=8+near*50;r(x+w/2-fw/2,y+h-6-near*10,fw,6+near*10,T%6<3?'#ff8a1a':'#ffe27a');r(x+w/2-fw/3,y+h-10-near*12,fw*.66,4,'#555')}
 ctx.restore();tiny(LZ('REAR VIEW','後照鏡'),W/2,y+h+3,'#6e6050','center')}
/* ---------------- render ---------------- */
function obtn(label,x,y,w,f,hi){const h=17;r(x,y,w,h,hi?'#3a2a12':'#1a1310');r(x,y,w,1,hi?'#ffd24a':'#6e6050');r(x,y+h-1,w,1,hi?'#ffd24a':'#6e6050');r(x,y,1,h,hi?'#ffd24a':'#6e6050');r(x+w-1,y,1,h,hi?'#ffd24a':'#6e6050');
 tiny(label,x+w/2,y+6,hi?'#ffd24a':'#e9dcc2','center');btns.push({x,y,w,h,f})}
function render(){btns=[];if(state==='pages'){drawPages();return}
 if(state==='title'||state==='stages'){camX+=.4;if(!BGD)buildBG();drawBG();drawWeather();ctx.drawImage(VIG,0,0);return}
 ctx.save();if(shake>0&&!RM)ctx.translate(Math.round((rnd()-.5)*shake),Math.round((rnd()-.5)*shake));
 drawSky();renderRoad();drawWeather();drawWeather2();if(state!=='intro')drawTruck();
 for(const f of fx)r(f.x,f.y,f.s||2,f.s||2,f.c);
 ctx.restore();if(flashW){ctx.globalAlpha=flashW/14*.5;r(0,0,W,H,'#fff4d0');ctx.globalAlpha=1}
 if(state==='intro'){drawTruck();renderIntro();ctx.drawImage(VIG,0,0);return}
 hud();
 for(const p of pops){ctx.globalAlpha=Math.max(0,1-p.t/70);const s=LANG==='zh'?p.z:p.e;tiny(s,p.x,p.y-p.t*.4,p.c,'center');ctx.globalAlpha=1}
 const s=STAGES[st];
 if(state==='play'&&hintT<420&&!boss){const h=touchUI&&s.thint?ZK(s,'thint'):ZK(s,'hint');ctx.globalAlpha=Math.min(1,(420-hintT)/60);band(22,h,'#ffd24a');ctx.globalAlpha=1}
 if(msg&&state==='play'){ctx.globalAlpha=msg.t>170?(200-msg.t)/30:1;band(boss?(boss.ram||boss.dead?40:72):(hintT<420?38:22),LANG==='zh'&&msg.z?msg.z:msg.e,msg.c||'#ffd24a');ctx.globalAlpha=1}
 if(banner){const t=PV(banner.s),sz=banner.warn?14:13;ctx.font=SERIF(sz);const k=Math.min(1,(W-16)/ctx.measureText(t).width);stxt(t,W/2,boss&&!boss.dead&&!boss.ram?100:76,banner.warn?(T%10<5?'#ff5a3a':'#ffd24a'):'#ffd24a',Math.floor(sz*k),banner.t<20?banner.t/20:banner.t>130?(160-banner.t)/30:1)}
 if(state==='tally')renderTally();
 if(state==='over')renderOver();
 if(paused&&state==='play')renderPause();
 ctx.drawImage(VIG,0,0)}
// a dark band with one or two centred lines of text, measured to fit
function band(y,s,c){const zh=CJK_RE.test(tr(s));const ls=lines(s,W-20,10);const lh=zh?12:9,h=ls.length*lh+4;r(0,y,W,h,'rgba(8,6,5,.72)');ls.forEach((l,i)=>tiny(l,W/2,y+3+i*lh+(zh?1:0),c,'center'))}
function panel(y0,h){ctx.globalAlpha=.86;r(0,y0,W,h,'#0c0908');ctx.globalAlpha=1;r(0,y0,W,1,'#d9a441');r(0,y0+h-1,W,1,'#d9a441')}
function renderIntro(){const s=STAGES[st],t=introT,zh=LANG==='zh';panel(26,140);
 const a=Math.min(1,t/20);stxt(LZ('LEG '+(st+1)+' OF 6','第 '+(st+1)+' 段（共 6 段）'),W/2,40,'#d9a441',13,a);stxt(ZK(s,'name'),W/2,61,'#e9dcc2',20,a);
 tiny(ZK(s,'date')+' · '+ZK(s,'place'),W/2,78,'#a8977c','center');let y=zh?93:95;const lh=LH();
 ZK(s,'brief').forEach((b,j)=>{const ls=lines(b,W-44);ls.forEach(l=>{if(t>30+j*40)txt(l,W/2,y,j?'#ff9a6a':'#e9dcc2','center');y+=lh});y+=4});
 if(t>40&&T%40<26)tiny(touchUI?LZ('TAP TO START THE ENGINE','點一下發動引擎'):LZ('ENTER TO START THE ENGINE','按 Enter 發動引擎'),W/2,Math.max(y+2,154),'#d9a441','center')}
function renderTally(){const t=tallyT,s=STAGES[st],zh=LANG==='zh';panel(16,184);stxt(LZ('LEG '+(st+1)+' COMPLETE','第 '+(st+1)+' 段完成'),W/2,31,'#ffd24a',16);tiny(ZK(s,'down'),W/2,zh?41:43,'#a8977c','center');
 const rows=[[LZ('TIME LEFT','剩餘時間'),Math.ceil(TY.time)+LZ(' SEC',' 秒')],[LZ('PASSENGERS ABOARD','車上乘客'),pax+LZ('',' 位')],[LZ('HITCHHIKERS PICKED UP','沿路載到'),SS.hitch+LZ('',' 位')],[LZ('PASSENGERS LOST','途中失去'),SS.lost+LZ('',' 位')+(SS.lost?LZ(' (THEY WALKED)','（自己走了）'):'')],[LZ('CRASHES','擦撞'),SS.crash+LZ('',' 次')],
  [LZ('FARES THIS LEG','本段車資'),'¥'+fmtBig(TY.fare)],[LZ('RICE PRICE ON ARRIVAL','抵達時米價'),'¥'+fmtBig(TY.price)+LZ('/BAG','／袋')],[LZ('YOUR FARES BUY','車資可以買到'),TY.grains>=1?fmtBig(Math.floor(TY.grains))+LZ(' GRAINS OF RICE',' 粒米'):LZ('1 GRAIN (ROUNDED UP)','一粒米（無條件進位）')]];
 const rh=zh?12:10;rows.forEach((rw,i)=>{if(t>20+i*12){tiny(rw[0],60,54+i*rh,'#a8977c');tiny(rw[1],W-60,54+i*rh,i>=rows.length-1?'#ff9a6a':'#e9dcc2','right');if(t===21+i*12)SFX.tally()}});
 const last=st>=STAGES.length-1,ny=54+rows.length*rh+6;
 const nx=last?[LZ('NEXT: TAIWAN. TEMPORARILY.','下一站：台灣。暫時的。'),LZ('Please keep your Gold Yuan. You will need it for the return trip next year.','請保管好你的金圓券，明年回程的時候會用到。')]:[LZ('NEXT: ','下一段：')+ZK(STAGES[st+1],'name'),ZK(STAGES[st+1],'date')+' · '+ZK(STAGES[st+1],'place')];
 if(t>20+rows.length*12){tiny(nx[0],W/2,ny,'#d9a441','center');lines(nx[1],W-40,10).forEach((l,i)=>tiny(l,W/2,ny+(zh?12:9)+i*(zh?12:8),'#ff9a6a','center'))}
 if(t>70&&T%40<26)tiny(touchUI?LZ('TAP ▶','點一下 ▶'):LZ('ENTER ▶','按 Enter ▶'),W-12,H-24,'#d9a441','right')}
function renderOver(){r(0,0,W,H,'rgba(8,6,5,.84)');const tm=overWhy==='time';stxt(tm?LZ('TOO LATE','來不及了'):LZ('NO PASSENGERS LEFT','乘客全跑光了'),W/2,40,'#b3261e',20);
 const lh=LH();lines(tm?LZ('The road ahead closes for lunch. It reopens for a small fee, payable in Gold Yuan. The fee is a wheelbarrow.','前面的路休息吃午飯去了。付一點小費就會重新開放，可以付金圓券。小費是一整台推車。'):LZ('Your passengers walked ahead. They are doing quite well. New ones are waiting at the roadside, also with Gold Yuan.','你的乘客自己走到前面去了，走得還不錯。路邊有新的乘客在等，一樣帶著金圓券。'),W-70).forEach((l,i)=>txt(l,W/2,60+i*lh,'#e9dcc2','center'));
 tiny(LZ('LEG '+(st+1)+' · ','第 '+(st+1)+' 段 · ')+ZK(STAGES[st],'name'),W/2,100,'#a8977c','center');
 if(overT>40){const n=Math.max(0,10-Math.floor(overT/66));obtn(LZ('PAY AND CONTINUE  ','付錢接關  ')+n,W/2-90,114,180,continueGame,1);obtn(LZ('RESTART THIS LEG','重跑這一段'),W/2-90,135,180,restartStage);obtn(LZ('GIVE UP','放棄'),W/2-90,156,180,toTitle)}
 tiny(LZ('CONTINUES SO FAR: ','目前接關次數：')+continues,W/2,H-16,'#6e6050','center')}
function renderPause(){r(0,0,W,H,'rgba(8,6,5,.8)');stxt(LZ('PAUSED','暫停'),W/2,38,'#ffd24a',22);tiny(LZ('LEG '+(st+1)+' · ','第 '+(st+1)+' 段 · ')+ZK(STAGES[st],'name'),W/2,56,'#a8977c','center');
 obtn(LZ('RESUME','繼續'),W/2-60,70,120,()=>{paused=false},1);obtn(LZ('RESTART LEG','重跑這一段'),W/2-60,91,120,restartStage);obtn(LZ('STAGE SELECT','選擇路段'),W/2-60,112,120,openStages);
 obtn(LZ('LANGUAGE: 中文','語言：ENGLISH'),W/2-60,133,120,()=>applyLang(LANG==='zh'?'en':'zh',true));obtn(LZ('QUIT TO TITLE','回到標題'),W/2-60,154,120,toTitle)}

/* ---------------- pages: story briefings and the ending ---------------- */
let pages=[],pg=0,pgT=0,pgFull=false,pgExit=null,pgSkip=null;
function startPages(list,exit,skip){pages=list;pg=0;pgT=0;pgFull=false;pgExit=exit;pgSkip=skip||exit;state='pages';paused=false;hideOv()}
function pageNext(){if(state!=='pages')return;if(!pgFull){pgT=9999;return}pg++;pgT=0;pgFull=false;SFX.tally();if(pg>=pages.length){const f=pgExit;pgExit=null;f&&f()}}
function pageSkip(){if(state!=='pages')return;if(pgSkip==='last'){if(pg<pages.length-1){pg=pages.length-1;pgT=0;pgFull=false}return}const f=pgSkip;pgSkip=null;pgExit=null;f&&f()}
function enSky(a,b,h=136){const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,a);g.addColorStop(1,b);ctx.fillStyle=g;ctx.fillRect(0,0,W,h)}
function enSea(t,y,h=136){r(0,y,W,h-y,'#1f3656');r(0,y,W,1,'#4a6a90');for(let i=0;i<26;i++)r(((i*37+t*.6)%(W+24))-12,y+3+(i%6)*Math.max(2,(h-y-4)/6),8+(i%3)*3,1,'#4a6a90')}
function enIsland(x,y,flag){r(x,y-6,96,7,'#33503a');r(x+8,y-12,62,7,'#3e5e3a');r(x+22,y-17,30,6,'#4a6a3a');r(x+74,y-34,2,28,'#5a3a20');r(x+64,y-36,22,3,'#3a6a2a');r(x+68,y-39,14,3,'#4a7a3a');
 if(flag){r(x+56,y-42,1,30,'#3a2a20');r(x+57,y-42,15,10,'#b8322a');r(x+57,y-42,8,6,'#2f4f8a');r(x+60,y-40,2,2,'#f2f2f2')}}
function enShip(x,y,t){y=Math.round(y+Math.sin(t/14));r(x+4,y,112,4,'#2a2222');r(x,y-10,120,10,'#3a3030');r(x-6,y-14,12,6,'#3a3030');r(x+112,y-14,12,6,'#3a3030');r(x,y-11,120,1,'#6a5a4a');
 r(x+18,y-24,74,14,'#d9cfb8');r(x+18,y-24,74,2,'#a8977c');for(let i=0;i<6;i++)r(x+23+i*11,y-20,6,5,'#2a3a4a');r(x+72,y-40,12,16,'#2f4f8a');r(x+72,y-40,12,3,'#120d0c');r(x+76,y-34,4,4,'#f2f2f2');
 for(let k=0;k<4;k++){const s=(t*.4+k*12)%48;ctx.globalAlpha=Math.max(0,.6-s/90);r(x+74-s*.6,y-46-s*.5,4+k,3+k,'#5a5a64');ctx.globalAlpha=1}}
function enGold(x,y){r(x,y-9,16,9,'#7a5a2a');r(x,y-9,16,2,'#d9a441');hanV('金',x+8,y-8,'#ffd24a',7)}
function enTruck(x,y,t=0,n=8,emo='happy'){r(x,y-22,44,16,'#4a5a78');r(x,y-22,44,2,'#2a3450');r(x+44,y-18,16,12,'#5a6d90');r(x+48,y-16,8,5,'#9fc3d6');r(x,y-8,60,3,'#2a2a2a');for(const wx of[x+6,x+44]){r(wx,y-6,10,6,'#151210');r(wx+3,y-4,4,2,'#555')}emblem('kmt',x+18,y-18);
 for(let i=0;i<n;i++){ctx.save();ctx.translate(x+1+i*5,y-13+((t>>3)+i)%2);ctx.scale(.42,.42);drawHead(0,0,i%4===2?'kmt':'civ',emo,1);ctx.restore()}}
function enPax(x,y,n,t,emo){for(let i=0;i<n;i++){ctx.save();ctx.translate(x+i*8,y+((t>>3)+i)%2);ctx.scale(.5,.5);drawHead(0,0,i%3===1?'kmt':'civ',emo,1);ctx.restore()}}
function stars(n,h){for(let i=0;i<n;i++)r((i*53+7)%W,(i*29)%h,1,1,i%3?'#5a5a7a':'#e9dcc2')}
/* story page art, one per leg */
const STORY_ART=[
 t=>{enSky('#1c1420','#a0533a');for(let i=0;i<6;i++){const hx=i*66-10;r(hx,70,50,30,'#21171b');r(hx-4,66,58,5,'#1a1216');if(i%2){const f=(t>>3)%3;r(hx+10,56-f,12,14+f,'#ff8a1a');r(hx+14,60,6,8,'#ffe27a')}}
  r(0,98,W,38,'#3e3a2c');r(0,108,W,10,'#5e5654');enTruck(150,118,t,Math.min(12,(t/14|0)),'scared');
  drawSoldier(236,118,{fac:'kmt',face:-1,emo:'smug',officer:1,gun:null,item:'board'});
  for(let i=0;i<3;i++)drawCivilian(110-i*20+Math.min(0,-30+t*.4),118,{face:1,pose:'run',anim:t+i*5,hat:i%2?'straw':'none',emo:'scared'});
  for(let i=0;i<Math.min(3,(t/40|0));i++){r(214+i*6,100-i*6,12,8,'#8a7a5a');r(218+i*6,103-i*6,4,2,'#d9a441')}
  enSign('REQUISITIONED',190,22,'#e9dcc2',0)},
 t=>{enSky('#7d93b0','#dfe6ee');for(let i=0;i<8;i++){const mx=i*56-20;r(mx,60-((i*13)%20),60,46,'#c9d4e2');r(mx,60-((i*13)%20),60,3,'#ffffff')}r(0,100,W,36,'#dfe6ee');r(0,104,W,10,'#9aa4b2');
  for(let i=0;i<6;i++)r(140+i*10,92,10,8,'#8a7650');const turn=Math.min(1,t/120);drawSoldier(152,92,{fac:t>140?'ccp':'kmt',face:turn>.5?-1:1,emo:'smug',gun:'rifle'});
  enTruck(40,114,t,10,'normal');drawSoldier(260,114,{fac:'kmt',face:-1,emo:(t>>5)%2?'scared':'normal',gun:null});if(t>60)drawBubble('PEACEFUL REORGANIZATION',268,82);
  for(let i=0;i<40;i++)r((i*37+t*.3)%W,(i*23+t*.6)%136,1,1,'#ffffff')},
 t=>{enSky('#56605c','#8a8f7a');r(0,90,W,46,'#5d7a78');for(let x=0;x<W;x+=9)for(let k=0;k<3;k++)r(x+(k*4)%9,96+k*12+(x%27)/3,1,5,'#6a9a3a');ctx.globalAlpha=.55;r(0,0,W,136,'#a9b2ac');ctx.globalAlpha=1;r(0,108,W,10,'#7a6a48');enTruck(60+Math.min(80,t*.3),114,t,9,'normal');
  r(250,96,36,14,'#3a3a3a');r(282,94,10,10,'#3a3a3a');r(280,90,4,4,'#cfc8b8');r(290,90,4,4,'#cfc8b8');for(const lx of[252,260,276,284])r(lx,110,4,6,'#2a2a2a');
  enSign('ROAD SECURE',330,58,'#e9dcc2',1);ctx.globalAlpha=.35+.2*Math.sin(t/30);r(0,0,W,136,'#a9b2ac');ctx.globalAlpha=1},
 t=>{enSky('#2a1e3a','#e8a060');r(0,86,W,50,'#2c3c5a');for(let i=0;i<20;i++)r((i*41+t*.3)%W,90+(i%5)*9,10,1,'#4a6a90');r(0,74,W,6,'#5a4030');for(let i=0;i<W;i+=24){r(i,62,3,14,'#4a4a52');r(i,62,24,2,'#4a4a52')}
  enTruck(100+Math.min(90,t*.35),74,t,10,'scared');for(let i=0;i<8;i++){const x=(i*47-t*.2+W*3)%(W+40)-20;r(x,110+(i%3)*8,18,4,'#4a3220');r(x+6,100+(i%3)*8,2,10,'#3a2a20');r(x+8,102+(i%3)*8,8,7,'#c8a878')}
  drawSoldier(20,74,{fac:'kmt',face:1,emo:'smug',gun:null});r(36,64,8,10,'#5a3a20');r(39,58,2,6,'#3a3a3a');r(36,58,8,2,'#3a3a3a');if(t>50)drawBubble('NOW?',40,46);enSign('IMPASSABLE BARRIER',300,20,'#e9dcc2',0)},
 t=>{sceneArt('bankrun',Math.min(t,420));enSign('SHANGHAI WILL HOLD!',96,60,'#e9dcc2',0);enTruck(W-((t*.7)%(W+80)),132,t,10,'shout')},
 t=>{enSky('#2a2440','#d08a5a',96);enSea(t,96);r(0,104,170,32,'#5a4030');for(let i=0;i<170;i+=10)r(i,104,1,32,'#3e2a1e');r(0,102,170,3,'#7a5a3a');
  enShip(196,116,t);enPax(222,99,8,t,'happy');r(160,100,40,3,'#8a6a42');enTruck(30+Math.min(60,t*.25),104,t,12,'shout');enSign('NO GOLD YUAN ACCEPTED',250,40,'#e9dcc2',0)}];
function brief(i){const s=STAGES[i];LV=i;st=i;music('ending');
 startPages([{date:()=>ZK(s,'date'),place:()=>ZK(s,'place'),title:()=>LZ('LEG '+(i+1)+' · ','第 '+(i+1)+' 段 · ')+ZK(s,'title'),art:STORY_ART[i],fact:()=>ZK(s,'fact'),joke:()=>ZK(s,'joke')}],()=>startStage(i))}
/* the ending: you made the ferry; the ferry goes to Taiwan (temporarily) */
function dockArt(t){enSky('#2a2440','#d08a5a',96);enSea(t,96);r(0,104,170,32,'#5a4030');for(let i=0;i<170;i+=10)r(i,104,1,32,'#3e2a1e');r(0,102,170,3,'#7a5a3a');
 enShip(196,116,t);r(160,100,40,3,'#8a6a42');const k=Math.min(1,t/160),tx=20+k*190,ty=104-Math.sin(k*Math.PI)*24-(k>=1?9:0);enTruck(tx,Math.round(k>=1?95:ty),t,12,k>=1?'happy':'shout');
 if(k>=1){drawBubble('ALL ABOARD!',250,60)}
 for(let i=0;i<3;i++)drawCivilian(40+i*17-((t*.3)%17),104,{face:1,pose:'run',anim:t+i*5,hat:i%2?'straw':'fedora',emo:i%2?'scared':'happy'})}
function mapArt(t){r(0,0,W,136,'#3a3024');r(0,104,W,32,'#2a2018');r(56,6,272,124,'#d8ccb0');r(56,6,272,2,'#a8977c');
 const RW_=[[14,24],[10,27],[4,28],[2,27],[1,26],[2,25],[3,25],[5,24],[7,24],[8,23],[9,22],[11,21],[13,20],[15,18]],x0=72,y0=14,k=t/18;
 RW_.forEach(([a,b],row)=>{for(let c=a;c<=b;c++){const red=row+(28-c)*.12<k;r(x0+c*8,y0+row*8,8,8,red?'#b8322a':'#8a9a6a');if(!red&&(c+row)%2)r(x0+c*8+3,y0+row*8+3,2,2,'#7a8a5a')}});
 r(x0+23*8,y0+11*8+2,5,12,'#2f4f8a');r(x0+23*8+1,y0+11*8+4,2,2,'#f2f2f2');
 const tk=Math.min(1,t/200);for(let i=0;i<6;i++){const a=i/5;if(a<=tk)r(x0+(4+a*18)*8,y0+(2+a*8)*8,3,3,'#2f4f8a')}
 if(k>2)for(let i=0;i<3;i++){const ax=x0+60+i*50,ay=y0+10+i*6,L_=Math.min(40,(k-2)*14);seg(ax,ay,ax+L_*.6,ay+L_,3,'#7a1a14');if(L_>=40){r(ax+L_*.6-4,ay+L_-2,8,4,'#7a1a14')}}
 enSign('HQ SITUATION MAP',192,112,'#e9dcc2',0);drawSoldier(14,128,{fac:'kmt',face:1,emo:'smug',officer:1,gun:null});seg(30,108,70,70,1,'#8a6a3a');if(t>90)drawBubble('ALL ACCORDING TO PLAN.',40,70)}
function straitArt(t){enSky('#5a7aa0','#c8b090',84);enSea(t,84);enShip(130,116,t);enPax(152,99,9,t,(t>>5)%2?'normal':'cry');
 for(let i=0;i<7;i++){const x=(i*61+t*.25)%W,y=100+(i%3)*10;r(x,y,8,2,'#b0a070');r(x+2,y-3,4,3,'#8aa070')}
 r(232,90,14,2,'#e9dcc2');r(235,84,8,6,'#e9dcc2');r(243,85,2,3,'#e9dcc2');r(236,85,6,2,'#8a5a2a');if(t%40<20)r(238,79,1,3,'#cfcfcf');if(t>60)drawBubble('ONE CUP OF TEA',238,74)}
function taiwanArt(t){enSky('#4a6a90','#e8b070',90);enSea(t,90);r(150,96,W-150,40,'#5a6a3a');r(150,94,W-150,3,'#6a7a4a');r(160,66,3,30,'#5a3a20');r(148,62,28,4,'#3a6a2a');
 enShip(10,120,t);for(let i=0;i<5;i++)drawCivilian(176+i*20,122,{face:-1,hat:i%2?'straw':'none',emo:i===2?'cry':'normal',cl:i%2?'#6a5040':'#55707e'});
 drawSoldier(282,122,{fac:'kmt',face:-1,emo:'smug',officer:1,gun:null});enSign('NEXT YEAR',344,92);
 if(t>30)drawBubble('WHEN DO WE GO BACK?',206,82);if(t>110)drawBubble('NEXT YEAR.',300,70)}
function nextYearArt(t){r(0,0,W,136,'#3a3024');r(0,104,W,32,'#2a2018');for(let i=0;i<W;i+=32)r(i,104,1,32,'#1e1812');
 r(60,14,200,74,'#26342a');r(56,10,208,4,'#5a3a20');r(56,88,208,4,'#5a3a20');
 txt(LZ('COUNTERATTACK','反攻大陸'),160,24,'#e9e4d0','center');txt(LZ('THE MAINLAND','時間表'),160,38,'#e9e4d0','center');txt(LZ('WHEN: NEXT YEAR','時間：明年'),160,56,'#ffd24a','center');
 const yr=1950+Math.min(76,Math.floor(t/45));r(288,20,60,50,'#e9dcc2');r(288,20,60,10,'#b8322a');stxt(String(yr),318,48,'#120d0c',14);if(t%45<6)r(288,30+(t%45)*6,60,4,'#c8b890');
 enTruck(150,128,t,6,(t>>6)%2?'normal':'sleep');r(206,120,10,8,'#7a5a2a');tiny(LZ('FUEL','油'),211,113,'#d9a441','center');
 for(let i=0;i<3;i++)drawCivilian(30+i*22,128,{face:1,hat:i%2?'straw':'none',emo:(t>>6)%2?'normal':'sleep',cl:i%2?'#6a5040':'#55707e'});if(t>80&&(t>>7)%2)drawBubble('NEXT YEAR?',60,96)}
const CREDITS_EN=[['LAST FERRY RUSH 1949'],['DRIVER','YOU (REQUISITIONED)'],['VEHICLE','ONE TRUCK (ALSO REQUISITIONED)'],['PASSENGERS','12, GIVE OR TAKE A FEW'],['FARES','GOLD YUAN (DECORATIVE)'],['ROUTE PLANNING','HQ (ADDRESS CHANGES WEEKLY)'],['BRIDGE DEMOLITION','AHEAD OF SCHEDULE'],['TYRES','SUMMER (WINTER ONES IN SPRING)'],['NEUTRAL OBSERVER','A DONKEY'],['FINANCIAL ADVICE','A SEAGULL'],['FIRST TO LEAVE','THE GOLD'],['RETURN TRIP','NEXT YEAR']];
const CREDITS_ZH=[['末班渡輪 1949'],['司機','你（被徵用）'],['車輛','卡車一輛（也是徵用的）'],['乘客','12 位，上下差幾位'],['車資','金圓券（僅供裝飾）'],['路線規劃','總部（地址每週更新）'],['炸橋','進度超前'],['輪胎','夏季胎（冬季胎春天發）'],['中立觀察員','一頭驢子'],['理財顧問','一隻海鷗'],['最先撤離','黃金'],['回程','明年']];
function drawCredits(t){enSky('#05060f','#141a34',H);stars(40,90);enSea(t,170,H);enShip(W-60-((t*.3)%(W+120)),168,t);ctx.drawImage(VIG,0,0);
 const C=LANG==='zh'?CREDITS_ZH:CREDITS_EN,zh=LANG==='zh',sp=zh?28:24,stop=100-(C.length-1)*sp,y0=Math.max(H+8-t*.45,stop);pgFull=y0<=stop;
 for(let i=0;i<C.length;i++){const y=y0+i*sp;if(y<-20||y>H+10)continue;const[a,b]=C[i];
  if(b==null)stxt(a,W/2,y,'#ffd24a',zh?18:15);else{tiny(a,W/2,y-(zh?12:9),'#a8977c','center');txt(b,W/2,y,'#e9dcc2','center')}}
 if(pgFull&&T%40<26)for(let i=0;i<5;i++)r(W-16+i,H-14+i,1,10-2*i,'#d9a441')}
function drawCard(p,t){const zh=LANG==='zh';enSky('#070a18','#1c2444',H);stars(40,120);
 r(0,158,64,14,'#14141c');r(0,150,36,8,'#14141c');r(40,154,14,4,'#14141c');enSea(t,170,H);enIsland(262,174,1);
 r(250,138,12,38,'#b8322a');hanV('反攻',256,140,'#f1d27a',9);r(250,158,12,1,'#7a1a14');hanV('大陸',256,160,'#f1d27a',7);
 drawSoldier(296,158,{fac:'kmt',face:-1,emo:(t>>6)%2?'determined':'smug',gun:null});r(284,140,10,2,'#8a7a5a');r(282,139,3,4,'#5a4a3a');
 const a=Math.min(1,t/40);stxt(PV(p.big),W/2,18,'#ffd24a',24,a);stxt(PV(p.small),W/2,36,'#a8977c',11,a);
 const card=PV(p.card),LH_=zh?12:10;card.forEach((l,i)=>{if(t>40+i*24)tiny(l,W/2,48+i*LH_,i===card.length-1?'#ff9a6a':i===0?'#ffd24a':'#e9dcc2','center')});
 const yr=1950+Math.min(76,Math.floor(t/12));if(t>40+card.length*24)tiny(LZ('COUNTERATTACK FORECAST: NEXT YEAR (ISSUED '+yr+')','反攻預定：明年（發布於 '+yr+' 年）'),W/2,52+card.length*LH_,'#a8977c','center');
 pgFull=t>40+card.length*24;if(pgFull&&T%40<26)tiny(touchUI?LZ('TAP TO RETURN','點一下返回'):LZ('ENTER TO RETURN','按 Enter 返回'),W/2,H-9,'#6e6050','center');ctx.drawImage(VIG,0,0)}
function endingPages(){const c=continues,n=RUN.pax,f=fmtBig(RUN.fare),k=RUN.crash;return[
 {date:()=>LZ('DECEMBER 1949','1949年12月'),place:()=>LZ('THE DOCKS, AT DAWN','碼頭，天亮'),title:()=>LZ('ALL ABOARD','全員上船'),art:dockArt,
  fact:()=>LZ('Six legs, every checkpoint, two armored cars, a tram, a tank and a bridge that is no longer there. You made the last ferry.','六段路、每一個檢查站、兩輛裝甲車、一輛電車、一輛戰車，還有一座已經不存在的橋。你趕上最後一班渡輪了。'),
  joke:()=>LZ('It also takes your truck, two pianos, a filing cabinet and an officer\'s goldfish. The goldfish has its own cabin.','船上還載了你的卡車、兩架鋼琴、一個檔案櫃，和某位長官的金魚。金魚有自己的船艙。')},
 {date:()=>LZ('1949','1949年'),place:()=>LZ('MEANWHILE, EVERYWHERE ELSE','同一時間，其他地方'),title:()=>LZ('MEANWHILE','與此同時'),art:mapArt,
  fact:()=>LZ('You won every leg. Meanwhile, everything else was lost. HQ calls it a "strategic transfer". The map calls it red.','你每一段路都跑贏了。同一時間，其他的一切都輸光了。總部稱之為「戰略轉進」，地圖則稱之為紅色。'),
  joke:()=>LZ('The little blue dots on the map are you. It is the only route on it that went according to plan.','地圖上那排藍色小點就是你，那是整張圖上唯一照計畫走完的路線。')},
 {date:()=>LZ('DECEMBER 1949','1949年12月'),place:()=>LZ('TAIWAN STRAIT','台灣海峽'),title:()=>LZ('THE FARE','車資'),art:straitArt,
  fact:()=>LZ('Halfway across, the purser collects the fares. Your passengers hand over ¥'+f+' in Gold Yuan. It buys one cup of tea. Not the cup. Just the tea.','船開到一半，事務長來收船錢。乘客們交出金圓券共 ¥'+f+'，剛好買一杯茶。杯子不算，只有茶。'),
  joke:()=>LZ('The rest becomes paper boats. The gold reserves crossed months ago, in first class.','剩下的鈔票拿來摺紙船。國庫的黃金幾個月前就先過去了，坐頭等艙。')},
 {date:()=>LZ('DECEMBER 1949','1949年12月'),place:()=>LZ('TAIWAN (TEMPORARY)','台灣（暫時）'),title:()=>LZ('TEMPORARY','暫時'),art:taiwanArt,
  fact:()=>LZ('The government moves to Taiwan. It is a temporary relocation. Very temporary. Your passengers look back across the water.','政府遷到台灣。這是暫時撤退，非常暫時。乘客們回頭望著海的另一邊。'),
  joke:()=>LZ('"When do we go back?" "Next year," says the officer. He is very sure. He is sure every year.','「我們什麼時候回去？」「明年。」軍官說得非常肯定。他每一年都說得非常肯定。')},
 {date:()=>LZ('1950, 1951, 1952...','1950、1951、1952……'),place:()=>LZ('THE BRIEFING ROOM, EVERY YEAR','簡報室，每一年'),title:()=>LZ('NEXT YEAR','明年'),art:nextYearArt,
  fact:()=>LZ('Every year there is a briefing: we counterattack the mainland next year. Your truck is kept fuelled and ready, in case.','每年都有一場簡報：明年就反攻大陸。你的卡車一直加滿油待命，以防萬一。'),
  joke:()=>LZ('After a few decades your passengers stop asking. At New Year\'s dinner they just say it to each other: "Next year."','過了幾十年，乘客們不再問了。吃年夜飯的時候，大家只是互相說一句：「明年。」')},
 {credits:1},
 {card:()=>LANG==='zh'?['比賽：贏了。大陸：放錯地方了。','路段 6／6 · 關底大戰 6／6 · 載到乘客 '+n+' 位','車資 ¥'+f+'（實際價值：一杯茶）','接關 '+c+' 次 · 擦撞 '+k+' 次','回程票：明年有效（每年都是）','打贏的內戰：0／1']
  :['THE RACE: WON. THE MAINLAND: MISPLACED.','LEGS 6/6 · SET PIECES 6/6 · PASSENGERS '+n,'FARES ¥'+f+' (REAL VALUE: ONE CUP OF TEA)','CONTINUES '+c+' · CRASHES '+k,'RETURN TICKETS: VALID NEXT YEAR (EVERY YEAR)','CIVIL WARS WON: 0/1'],
  big:()=>LZ('THE END','劇終'),small:()=>LZ('(TEMPORARILY)','（暫時）')}]}
function ending(){SAVE.won=true;saveNow();music('ending');startPages(endingPages(),()=>openStages(),'last')}
function drawPages(){const p=pages[pg];if(!p)return;const t=pgT,zh=LANG==='zh';ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
 if(p.credits){drawCredits(t);return}
 if(p.card){drawCard(p,t);return}
 ctx.save();ctx.beginPath();ctx.rect(0,0,W,136);ctx.clip();p.art(t);ctx.restore();ctx.drawImage(VIG,0,0);
 if(p.title){const s=PV(p.title);r(0,0,W,20,'rgba(8,6,5,.72)');stxt(s,W/2,10,'#ffd24a',13)}
 r(0,136,W,H-136,'#120d0c');r(0,136,W,2,'#d9a441');tiny(PV(p.date),8,141,'#d9a441');tiny(PV(p.place),W-8,141,'#a8977c','right');
 const shown=Math.floor(t*(zh?.7:1.4)),fz=PV(p.fact),jz=PV(p.joke);let n=0,fl,jl,lh=10,y0=153;
 if(zh){let sz=12;lh=15;for(;;){ctx.font=ZF(sz);fl=wrapPx(fz,W-16);jl=wrapPx(jz,W-16);if((fl.length+jl.length)*lh+2<=H-152||sz<=10)break;sz--;lh--}}
 else{ctx.font=F;fl=wrap(fz,45);jl=wrap(jz,45);if((fl.length+jl.length)*10+2>H-152)lh=9}
 ctx.textAlign='left';ctx.textBaseline='top';
 const line=(l,y,c)=>{const v=[...l].slice(0,Math.max(0,shown-n)).join('');n+=[...l].length+1;ctx.fillStyle=c;ctx.fillText(v,8,y)};
 fl.forEach((l,i)=>line(l,y0+i*lh,'#e9dcc2'));jl.forEach((l,i)=>line(l,y0+2+fl.length*lh+i*lh,'#ff9a6a'));
 pgFull=shown>n;if(pgFull&&T%40<26)for(let i=0;i<5;i++)r(W-14+i,H-12+i,1,10-2*i,'#d9a441')}
const ZT2={'REQUISITIONED':'徵用','PEACEFUL REORGANIZATION':'和平改編','ROAD SECURE':'道路安全','IMPASSABLE BARRIER':'長江天險','NOW?':'現在炸？','SHANGHAI WILL HOLD!':'死守大上海！','NO GOLD YUAN ACCEPTED':'不收金圓券',
 'ALL ABOARD!':'全員上船！','HQ SITUATION MAP':'總部作戰地圖','ALL ACCORDING TO PLAN.':'一切按照計畫。','ONE CUP OF TEA':'一杯茶','NEXT YEAR':'明年','WHEN DO WE GO BACK?':'我們什麼時候回去？','NEXT YEAR.':'明年。','NEXT YEAR?':'明年？'};Object.assign(ZT,ZT2);

/* ---------------- overlays: title + stage select ---------------- */
function hideOv(){$('#title').hidden=true;$('#stages').hidden=true}
function toTitle(){state='title';paused=false;heldK={};$('#stages').hidden=true;$('#title').hidden=false;music('off');L.theme='village';L.weather=null;LV=0;st=0;BGD=null;boss=null;applyLang(LANG,false);$('#bPlay').focus()}
function openStages(){state='stages';paused=false;heldK={};$('#title').hidden=true;music('off');const box=$('#stageList');box.innerHTML='';const zh=LANG==='zh';
 STAGES.forEach((s,i)=>{const b=document.createElement('button'),lock=i>=SAVE.un,bs=SAVE.best[i];
  b.innerHTML=lock?`<span>${i+1} · ???</span><span class="lk">${zh?'尚未解鎖':'LOCKED'}</span>`:`<span>${i+1} · ${ZK(s,'name')}</span><span class="dt">${ZK(s,'date')} · ${ZK(s,'place')}</span><span class="st">${bs>=0?(zh?'最佳：載到 '+bs+' 位乘客':'BEST: '+bs+' PASSENGERS DELIVERED'):(zh?'尚未跑過':'NOT YET DRIVEN')}</span>`;
  b.disabled=lock;if(!lock&&i===Math.min(SAVE.un-1,STAGES.length-1)&&!(bs>=0))b.className='here';b.onclick=()=>{initAudio();newGame(i)};box.appendChild(b)});
 $('#bEnd').hidden=!SAVE.won;const done=SAVE.best.filter(b=>b>=0).length;
 $('#stTot').textContent=zh?'完成路段：'+done+'／6'+(SAVE.won?' · 你已抵達台灣（暫時）':''):'LEGS COMPLETED: '+done+' / 6'+(SAVE.won?' · YOU REACHED TAIWAN (TEMPORARILY)':'');
 resetArm=false;$('#bReset').textContent=zh?'清除存檔':'RESET SAVE';$('#stages').hidden=false;const f=box.querySelector('.here')||box.querySelector('button:not(:disabled)');f&&f.focus()}
function toggleMute(){initAudio();setMute(!muted);store.set(SKEY+'-mute',muted);$('#bSnd').textContent=muted?(LANG==='zh'?'靜音':'MUTE'):(LANG==='zh'?'音效':'SND')}
let resetArm=false;
const ZH_HTML={h1:'末班渡輪<span>1949 · 賽車 · 六段路趕上最後一班船</span>',rot:'把手機轉橫，路比較寬',play:'發動引擎',cont:'繼續上路',sth:'路線日誌',back:'標題',end:'觀看結局',tbr:'煞車',thn:'喇叭',
 tag:'1948–49年。你開著一輛徵用來的國軍卡車，載滿乘客，趕搭最後一班撤退渡輪。政府說這只是暫時撤退。六段路，從起火的村莊一路開到碼頭；路障、橋梁，還有越來越大片的地圖，都在共軍手上。',
 keys:'↑／W 油門 · ↓／S 煞車 · ←→／A D 轉彎 · J 或空白鍵 按喇叭<br>P 暫停 · L 切換語言 · M 音效',
 fine:'諷刺作品。通過檢查站加時間，撞車會掉乘客，路邊招手的人可以載上車。車資以金圓券計價：跳錶很準，錢不准。進度自動存檔。'};
const EN_HTML={};document.querySelectorAll('[data-t]').forEach(el=>EN_HTML[el.dataset.t]=el.innerHTML);EN_HTML.cont='KEEP DRIVING';
const KEYS_TOUCH={en:'Phone: the truck accelerates on its own · ◀ ▶ steer · BRAKE slows down · HORN clears carts and rickshaws (not the donkey)<br>Top right: language, pause, sound',
 zh:'手機：卡車自動前進 · ◀ ▶ 轉彎 · 煞車減速 · 喇叭可以趕走牛車和黃包車（驢子不理你）<br>右上角：語言、暫停、音效'};
function applyLang(l,save){LANG=l==='en'?'en':'zh';const zh=LANG==='zh';if(save)try{localStorage.setItem(LANG_KEY,LANG)}catch(e){}
 document.documentElement.lang=zh?'zh-Hant':'en';document.title=zh?'末班渡輪 1949 Last Ferry Rush':'Last Ferry Rush 1949';
 document.querySelectorAll('[data-t]').forEach(el=>{const k=el.dataset.t;el.innerHTML=zh&&ZH_HTML[k]!=null?ZH_HTML[k]:EN_HTML[k]});
 const any=SAVE.best.some(b=>b>=0);$('#bPlay').innerHTML=any?(zh?ZH_HTML.cont:EN_HTML.cont):(zh?ZH_HTML.play:EN_HTML.play);
 if(touchUI)$('[data-t=keys]').innerHTML=KEYS_TOUCH[LANG];
 document.querySelectorAll('.lang button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.l===LANG)));
 const b=$('#bLang');b.textContent=zh?'EN':'中文';b.lang=zh?'en':'zh-Hant';b.setAttribute('aria-label',zh?'Switch to English':'切換為中文');
 $('#bPause').setAttribute('aria-label',zh?'暫停':'Pause');$('#bSnd').textContent=muted?(zh?'靜音':'MUTE'):(zh?'音效':'SND');$('#bSnd').setAttribute('aria-label',zh?'音效開關':'Toggle sound');
 cv.setAttribute('aria-label',zh?'末班渡輪遊戲畫面':'Last Ferry Rush game screen');
 if(state==='stages')openStages();
 if(zh&&document.fonts)document.fonts.load(ZF(10),'國軍').catch(()=>{})}
/* ---------------- input ---------------- */
let touchUI=matchMedia('(pointer:coarse)').matches;
const KM={KeyW:'u',ArrowUp:'u',KeyS:'d',ArrowDown:'d',KeyA:'l',ArrowLeft:'l',KeyD:'r',ArrowRight:'r',KeyJ:'h',Space:'h',KeyZ:'h',KeyH:'h'};
const ADV=['Enter','Space','KeyJ','KeyZ'];
function toXY(e){const rc=cv.getBoundingClientRect();return[(e.clientX-rc.left)/rc.width*W,(e.clientY-rc.top)/rc.height*H]}
addEventListener('keydown',e=>{if(e.code==='KeyL'&&state!=='title'&&state!=='stages'){applyLang(LANG==='zh'?'en':'zh',true);return}
 if(e.code==='KeyM'&&state!=='title'&&state!=='stages'){toggleMute();return}
 if(state==='stages'){const i=+e.key-1;if(i>=0&&i<STAGES.length&&i<SAVE.un){initAudio();newGame(i)}else if(e.code==='Escape')toTitle();return}
 if(state==='pages'){if(ADV.includes(e.code)&&!e.repeat){e.preventDefault();pageNext()}else if(e.code==='Escape')pageSkip();return}
 if(state==='over'){if(overT>40&&!e.repeat){if(e.code==='Enter'||e.code==='Space'){e.preventDefault();continueGame()}else if(e.code==='KeyR')restartStage();else if(e.code==='Escape'||e.code==='Backspace')toTitle()}return}
 if((state==='intro'||state==='tally')&&!e.repeat&&ADV.includes(e.code)){e.preventDefault();initAudio();advance();return}
 if(state==='play'&&(e.code==='KeyP'||e.code==='Escape')&&!e.repeat){paused=!paused;heldK={};return}
 if(state==='play'&&paused){if((e.code==='Enter'||e.code==='Space')&&!e.repeat){e.preventDefault();paused=false}return}
 const k=KM[e.code];if(!k||state==='title')return;e.preventDefault();initAudio();if(k==='h'){if(!e.repeat&&state==='play')heldK.h=1}else heldK[k]=1});
addEventListener('keyup',e=>{const k=KM[e.code];if(k&&k!=='h')heldK[k]=0});
addEventListener('blur',()=>{heldK={}});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='play'){paused=true;heldK={}}});
cv.addEventListener('pointerdown',e=>{initAudio();if(e.pointerType==='touch')touchUI=true;else if(e.pointerType==='mouse')touchUI=false;const[x,y]=toXY(e);
 for(const b of btns)if(x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h){b.f();return}
 if(state==='pages'){pageNext();return}if(state==='intro'||state==='tally'){advance();return}});
for(const el of document.querySelectorAll('#touch .tb')){const k=el.dataset.k;
 el.addEventListener('pointerdown',e=>{e.preventDefault();initAudio();touchUI=true;try{el.setPointerCapture(e.pointerId)}catch(_){}if(state!=='play'||paused)return;heldK[k]=1;el.classList.add('on')});
 const up=()=>{if(k!=='h')heldK[k]=0;el.classList.remove('on')};el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);el.addEventListener('lostpointercapture',up)}
$('#bPlay').onclick=()=>{initAudio();if(!SAVE.best.some(b=>b>=0))newGame(0);else openStages()};
$('#bBack').onclick=toTitle;$('#bEnd').onclick=()=>{initAudio();ending()};
$('#bReset').onclick=e=>{const b=e.currentTarget,zh=LANG==='zh';if(!resetArm){resetArm=true;b.textContent=zh?'確定？再點一次':'SURE? TAP AGAIN';return}store.set(SKEY,{});SAVE=loadSave();applyLang(LANG,false);openStages()};
document.querySelectorAll('.lang button').forEach(b=>b.addEventListener('click',()=>applyLang(b.dataset.l,true)));
$('#bLang').addEventListener('click',e=>{applyLang(LANG==='zh'?'en':'zh',true);e.currentTarget.blur()});
$('#bPause').addEventListener('click',e=>{initAudio();if(state==='play'){paused=!paused;heldK={}}e.currentTarget.blur()});
$('#bSnd').addEventListener('click',e=>{toggleMute();e.currentTarget.blur()});
muted=!!store.get(SKEY+'-mute',false);
applyLang((()=>{try{const v=localStorage.getItem(LANG_KEY);if(v==='en'||v==='zh')return v}catch(e){}return 'zh'})(),false);
function fit(){const vw=innerWidth,vh=innerHeight,s=Math.min(vw/W,vh/H);cv.style.width=Math.floor(W*s)+'px';cv.style.height=Math.floor(H*s)+'px'}
addEventListener('resize',fit);fit();
let last=performance.now(),acc=0,uiKey='';
function loop(nt){acc+=Math.min(100,nt-last);last=nt;while(acc>=16.67){acc-=16.67;update()}render();
 const hud_=state!=='title'&&state!=='stages',tch=touchUI&&state==='play'&&!paused&&!clearT,pz=state==='play',k=hud_+'|'+tch+'|'+pz;
 if(k!==uiKey){uiKey=k;$('#hud').hidden=!hud_;$('#touch').hidden=!tch;$('#bPause').hidden=!pz;if(!tch){for(const el of document.querySelectorAll('#touch .tb'))el.classList.remove('on');if(state!=='play')heldK={}}}requestAnimationFrame(loop)}
(document.fonts?Promise.all([document.fonts.load(F),document.fonts.load(SERIF(20)),document.fonts.load(ZF(10),'國軍'),document.fonts.load(ZF(11),'國軍')]):Promise.resolve()).catch(()=>{}).finally(()=>requestAnimationFrame(loop));
