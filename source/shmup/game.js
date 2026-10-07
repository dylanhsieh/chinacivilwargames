/* ===================== SKY OF GOLD YUAN 1949 (金圓長空) — a Civil Slug shoot 'em up =====================
   You fly a borrowed biplane for the Nationalist (KMT) air force on a Gold Yuan contract. Six stages, a boss each,
   a story page between stages, continues and saves; the campaign ends where history did: one way to Taiwan. */
let T=0,camX=0,S='kmt',EN='ccp',LV=0,skyFlash=0,skyFX=0,state='title';
let plats=[],scorch=[];const L={walls:[200,900,1600],theme:'paddy',deep:null,weather:null};function groundAt(){return GY}
THEMES.clouds={sky:['#1e1a40','#6a4a7a','#e0a060'],m1:'#000',m2:'#000',house:'#000',ground:'#000',top:'#000',spk:'#000',sun:null};
THEMES.sea={sky:['#070a18','#1c2444','#3a3a5a'],m1:'#000',m2:'#000',house:'#000',ground:'#000',top:'#000',spk:'#000',sun:null};
const VIG=document.createElement('canvas');VIG.width=W;VIG.height=H;{const g=VIG.getContext('2d');const rg=g.createRadialGradient(W/2,H/2,H*.4,W/2,H/2,W*.65);rg.addColorStop(0,'rgba(0,0,0,0)');rg.addColorStop(1,'rgba(6,2,2,.45)');g.fillStyle=rg;g.fillRect(0,0,W,H)}
/* ---------------- i18n core: 繁體中文 default, English optional (resolved at draw time) ---------------- */
let LANG='zh';const LANG_KEY='skygold.lang';
const ZFAM='"Noto Sans TC","Noto Sans CJK TC","PingFang TC","Microsoft JhengHei","Heiti TC","Source Han Sans TC","WenQuanYi Micro Hei",sans-serif';
const CJK_RE=/[⺀-鿿豈-﫿＀-￯　-〿]/;
const LZ=(e,z)=>LANG==='zh'?z:e;
const ZF=(px,w=500)=>`${w} ${px}px ${ZFAM}`;
const MISS=new Set();
function tr(s){if(LANG!=='zh'||typeof s!=='string')return s;const z=ZT[s];if(z!=null)return z;for(const[re,f]of ZRX){const m=re.exec(s);if(m)return f(m)}if(/[A-Z]{2}/i.test(s)&&!CJK_RE.test(s))MISS.add(s);return s}
const ZK=(o,k)=>LANG==='zh'&&o.zh&&o.zh[k]!=null?o.zh[k]:o[k];
const PV=v=>typeof v==='function'?v():tr(v);
function wrapPx(s,maxW){const toks=String(s).match(/[A-Za-z0-9¥$%'’.,!?:\/+\-–—()×]+|\s+|[\s\S]/gu)||[];const out=[];let line='';
 for(const tk of toks){const test=line+tk;if(line.trim()&&ctx.measureText(test.trimEnd()).width>maxW&&!/^[，。、！？：；）」』…—,.!?)\s]/.test(tk)){out.push(line.trim());line=/^\s+$/.test(tk)?'':tk}else line=test}
 if(line.trim())out.push(line.trim());return out}
// width-based wrap in either language; sets ctx.font to the font the lines must be drawn with
function lines(s,maxW,px=11){s=PV(s);if(CJK_RE.test(s)){ctx.font=ZF(px);return wrapPx(s,maxW)}ctx.font=F;return wrap(s,Math.floor(maxW/8))}
const LH=()=>LANG==='zh'?13:10;
const isDark=c=>{const m=/^#([0-9a-f]{6})/i.exec(c);if(!m)return false;const v=parseInt(m[1],16);return((v>>16)*.3+((v>>8)&255)*.59+(v&255)*.11)<70};
const SERIF=s=>`900 ${s}px "Noto Serif TC","Noto Serif CJK TC","Songti TC",Georgia,${ZFAM}`;
function stxt(s,x,y,c,size,a=1,al='center'){s=tr(s);ctx.font=SERIF(size);ctx.textAlign=al;ctx.textBaseline='middle';ctx.globalAlpha=a;ctx.fillStyle='#000';ctx.fillText(s,x+1,y+2);ctx.fillStyle=c;ctx.fillText(s,x,y);ctx.globalAlpha=1;ctx.textBaseline='top'}
/* tiny 3x5 pixel font: font-independent HUD text (4px per char) */
const GLY={};{const G_='A010101111101101B110101110101110C011100100100011D110101101101110E111100110100111F111100110100100G011100101101011H101101111101101I111010010010111J001001001101010K101101110101101L100100100100111M101111111101101N110101101101101O010101101101010P110101110100100Q010101101110011R110101110101101S011100010001110T111010010010010U101101101101111V101101101101010W101101111111101X101101010101101Y101101010010010Z1110010101001110111101101101111101011001001011121100010101001113110001010001110410110111100100151111001100011106011100111101111711100101001001081111011111011119111101111001110¥101010111010010×000101010101000.000000000000010/001001010100100+000010111010000-000000111000000%101001010100101:000010000010000!010010010000010?110001010000010,000000000010100\'010010000000000(010100100100010)010001001001010';for(let i=0;i+16<=G_.length;i+=16)GLY[G_[i]]=G_.substr(i+1,15)}
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

/* ---------------- the campaign ---------------- */
const STAGES=[
 {theme:'paddy',weather:'haze',music:'m1',bmus:'boss',boss:'train',hp:620,pts:20000,
  name:'THE NORTHERN PLAIN',date:'NOVEMBER 1948',place:'HUAIHAI COUNTRYSIDE',bossName:'ARMORED TRAIN "SIX OWNERS"',angry:'SEVENTH OWNER: UNDECIDED',
  pool:{fighter:4,diver:2,balloon:2,aa:3,transport:1},
  brief:['ORDERS: Stop the armored train. It has changed sides six times. Today it is theirs.','PAY: ¥1,000,000 an hour. A bag of rice costs ¥1,200,000. Fly faster.'],
  hint:'HOLD J OR SPACE TO FIRE · K = MONEY BOMB · GRAB P FOR MORE GUNS',thint:'DRAG TO FLY · GUNS FIRE ON THEIR OWN · BUTTON = MONEY BOMB',
  orders:'',title:'THE CONTRACT',
  fact:'November 1948. The Nationalist Air Force is short of pilots, planes and money. It has plenty of paper. You sign: one borrowed biplane, paid by the hour, in Gold Yuan.',
  joke:'The recruiter counts your advance in sacks. When he finishes, it buys one sack.',
  zh:{name:'淮海平原',date:'1948年11月',place:'淮海一帶的鄉間',bossName:'裝甲列車「六任東家」',angry:'第七任東家：未定',
   brief:['命令：擋下那列裝甲列車。它已經換過六次邊，今天輪到它們的。','待遇：每小時 100 萬金圓券。一袋米 120 萬。請飛快一點。'],
   hint:'按住 J 或空白鍵射擊 · K 丟金圓炸彈 · 吃 P 加火力',thint:'拖曳飛行 · 機槍自動射擊 · 右下按鈕丟金圓炸彈',title:'合約',
   fact:'1948年11月。國軍空軍缺飛行員、缺飛機、缺錢，唯一不缺的是紙。你簽下一份合約：雙翼機一架（借的），按時計酬，以金圓券支付。',
   joke:'募兵官用麻袋數你的預付款。等他數完，這些錢剛好夠買一麻袋。'}},
 {theme:'snow',weather:'snow',music:'m3',bmus:'boss',boss:'bomber',hp:760,pts:25000,
  name:'THE SNOW PASS',date:'JANUARY 1949',place:'MOUNTAINS NORTH OF BEIPING',bossName:'BOMBER "SECOND THOUGHTS"',angry:'RE-DEFECTING... REQUEST DENIED',
  pool:{fighter:3,diver:2,turncoat:3,aa:2,transport:1},
  brief:['The northern garrison has "reorganized peacefully". Their aircraft reorganized with them.','Beware of planes in our colours. The red paint is still wet.'],
  hint:'NEW: TURNCOATS ATTACK FROM BEHIND. WATCH YOUR TAIL.',
  orders:'ORDERS: Proceed to the snow pass. Winter clothing will be issued in spring.',title:'PEACEFUL REORGANIZATION',
  fact:'January 1949. The northern garrison "reorganizes peacefully". Its planes reorganize too, with fresh red paint.',
  joke:'HQ says: tell friend from foe by the paint. Paint is cheap. It is the only thing that is.',
  zh:{name:'雪中山口',date:'1949年1月',place:'北平以北的山區',bossName:'轟炸機「三心二意」',angry:'申請再投誠……駁回',
   brief:['華北守軍「和平改編」了，他們的飛機也跟著一起改編。','小心塗著我們顏色的飛機。上面的紅漆還沒乾。'],
   hint:'新敵人：倒戈的飛機會從後方偷襲，注意你的六點鐘。',orders:'命令：前往雪中山口。冬衣預計春天發放。',title:'和平改編',
   fact:'1949年1月。華北守軍「和平改編」，飛機也一起改編，順便刷上一層新的紅漆。',
   joke:'總部說：看漆的顏色分敵我。油漆很便宜，這年頭也只剩油漆便宜。'}},
 {theme:'river',music:'m5',bmus:'boss',boss:'boat',hp:900,pts:30000,
  name:'THE YANGTZE',date:'APRIL 1949',place:'THE GREAT RIVER',bossName:'GUNBOAT "NEW MANAGEMENT"',angry:'NEW BROOM, MORE GUNS',
  pool:{fighter:3,diver:2,junk:4,balloon:1,turncoat:1},
  brief:['The enemy is crossing the river on ten thousand wooden junks.','We are defending it with one biplane. Yours. Good luck.'],
  hint:'NEW: JUNKS FIRE FROM THE WATER. STAY HIGH OR STAY FAST.',
  orders:'ORDERS: Hold the Yangtze. It is a very long river. Hold all of it.',title:'THE IMPASSABLE BARRIER',
  fact:'April 1949. HQ calls the Yangtze an "impassable natural barrier". The enemy crosses it on ten thousand wooden junks.',
  joke:'Defending the river: the navy (some of it, some of the time), the army (somewhere else), and you.',
  zh:{name:'萬里長江',date:'1949年4月',place:'長江江面',bossName:'砲艇「新官上任」',angry:'新官上任三把火',
   brief:['敵軍搭著上萬艘木帆船渡江。','我方用一架雙翼機防守，就是你那架。祝好運。'],
   hint:'新敵人：木帆船會從江面開火。飛高一點，或飛快一點。',orders:'命令：守住長江。這條江很長，全部都要守。',title:'長江天險',
   fact:'1949年4月。總部說長江是「天險」，過不來的。共軍搭著上萬艘木帆船過來了。',
   joke:'防守長江的有：海軍（一部分，有時候）、陸軍（在別的地方），還有你。'}},
 {theme:'city',weather:'rain',music:'m4',bmus:'boss',boss:'tower',hp:1050,pts:40000,
  name:'SHANGHAI SKYLINE',date:'MAY 1949',place:'THE BUND, AT NIGHT',bossName:'FLAK TOWER "NIGHT SHIFT"',angry:'ALL LIGHTS ON',
  pool:{fighter:3,diver:2,light:3,balloon:2,turncoat:1},
  brief:['Shanghai will hold! (Please ignore the ships leaving the harbour with the gold.)','The flak tower on the Bund changed sides at lunch. It works nights now.'],
  hint:'NEW: SEARCHLIGHT FLAK. DO NOT FLY UP THE BEAM.',
  orders:'ORDERS: Defend Shanghai to the last banker. The bankers have already left.',title:'SHANGHAI WILL HOLD',
  fact:'May 1949. The radio says Shanghai will be held to the last man. The gold reserves left for Taiwan months ago, quietly, at night.',
  joke:'Your pay rises tenfold. Rice rises a hundredfold. You are getting poorer faster than ever, on salary.',
  zh:{name:'上海夜空',date:'1949年5月',place:'外灘，深夜',bossName:'高射砲塔「夜班」',angry:'全部開燈',
   brief:['上海一定守得住！（請忽略港口那幾艘載著黃金開走的船。）','外灘的高射砲塔中午換了邊，現在改上夜班。'],
   hint:'新敵人：探照燈高射砲。不要順著光柱往上飛。',orders:'命令：死守上海，守到最後一位銀行家。銀行家已經先走了。',title:'死守大上海',
   fact:'1949年5月。廣播說要死守大上海，戰到最後一兵一卒。國庫的黃金幾個月前就趁夜悄悄運去台灣了。',
   joke:'你的薪水漲了十倍，米價漲了一百倍。你正以史上最快的速度變窮，而且還是領薪水的那種。'}},
 {theme:'clouds',weather:'money',music:'m2',bmus:'final',boss:'printer',hp:1350,pts:60000,
  name:'ABOVE THE CLOUDS',date:'MAY 1949',place:'TEN THOUSAND FEET OVER SHANGHAI',bossName:'THE PRINTER\'S AIRSHIP',angry:'HYPERINFLATION',
  pool:{fighter:2,diver:1,notes:4,blimp:3,turncoat:1},
  brief:['The Printer\'s airship prints money faster than prices can rise. Almost.','Shoot it down before it buries the city in Gold Yuan.'],
  hint:'NEW: LIVE BANKNOTES. THEY CHASE YOU. THEY ARE WORTH NOTHING.',
  orders:'ORDERS: Go up. Shoot down the Printer. Do not pick up the money.',title:'THE PRINTER',
  fact:'Above the city floats the Printer: an airship that prints Gold Yuan faster than prices can rise. Almost.',
  joke:'Each note it prints is worth less than the one before. Shoot it down and you will have stopped inflation. Briefly. In the air.',
  zh:{name:'雲層之上',date:'1949年5月',place:'上海上空一萬英尺',bossName:'印鈔機飛艇',angry:'惡性通膨',
   brief:['印鈔機飛艇印鈔票的速度比物價上漲還快。差一點點。','在它把整座城市埋進金圓券之前，把它打下來。'],
   hint:'新敵人：會追人的鈔票。追得很緊，價值很低。',orders:'命令：往上飛，擊落印鈔機。不要撿錢。',title:'印鈔機',
   fact:'城市上空飄著印鈔機：一艘飛艇，印鈔速度比物價上漲還快。差一點點。',
   joke:'它印的每一張鈔票都比上一張更不值錢。把它打下來，你就終結了通貨膨脹。短暫地。在空中。'}},
 {theme:'sea',music:'m1',bmus:'final',boss:'cruiser',hp:1200,pts:80000,
  name:'THE LAST CONVOY',date:'DECEMBER 1949',place:'TAIWAN STRAIT',bossName:'CRUISER "FORMERLY OUR FLAGSHIP"',angry:'FULL BROADSIDE',
  pool:{fighter:2,diver:2,torp:4,turncoat:2,junk:1},
  brief:['ORDERS: Escort the convoy to Taiwan. One way. Fuel is paid in Gold Yuan; bring a wheelbarrow.','It is a temporary relocation. Very temporary. Protect the cargo.'],
  hint:'PROTECT THE CONVOY. TORPEDO BOATS WILL TRY TO RAM IT.',
  orders:'ORDERS: Fly to Taiwan. One way. Fuel paid in Gold Yuan.',title:'ONE WAY',
  fact:'The airship is down. Prices did not notice. December 1949: the government moves to Taiwan. Temporarily.',
  joke:'Escort the last convoy, then fly there. One way. Fuel is paid in Gold Yuan. The gold left first. It always does.',
  zh:{name:'最後的船團',date:'1949年12月',place:'台灣海峽',bossName:'巡洋艦「前任旗艦」',angry:'全舷齊射',
   brief:['命令：護送船團到台灣。單程。油錢付金圓券，請自備手推車。','這是暫時撤退。非常暫時。保護好貨物。'],
   hint:'保護船團！魚雷艇會直接撞上去。',orders:'命令：飛往台灣。單程。油錢以金圓券支付。',title:'單程票',
   fact:'飛艇被你打下來了，物價完全沒發現。政府「暫時」遷往台灣。命令：護送最後一支船團，然後自己飛過去。單程。',
   joke:'油錢以金圓券支付，請自備手推車。黃金搭更早的船先走了。黃金永遠最先走。'}}];
const RICE=[1.2e6,4e7,9e8,3e10,8e11,5e13];// price of one bag of rice per stage. It only goes one way.
const ZRX=[[/^RICE: (.+)$/,m=>'米價：'+m[1]]];
const ZT={'POWER UP':'火力提升','+1 MONEY BOMB':'金圓炸彈 +1','+¥500 (≈1 GRAIN)':'+¥500（約一粒米）','MONEY BOMB! (WORTHLESS, BUT HEAVY)':'金圓炸彈！（不值錢，但很重）',
 'NEW PILOT, SAME CONTRACT':'換個飛行員，合約照舊','CONTRACT TERMINATED':'合約終止','RAMMED!':'被撞了！','THE CARGO IS ON FIRE. THE GOLD LEFT EARLIER.':'貨物著火了。還好黃金早就先走了。',
 'FORMERLY OURS':'原本是我們的','HE OWES ME MONEY':'他還欠我錢','NEW EMPLOYER':'換老闆了','SAME PLANE, NEW PAINT':'同一架，新塗裝','I SWITCH! BETTER RICE?':'我換邊！那邊伙食比較好？',
 'NEW NOTES ISSUED':'新鈔發行','PRICES +300%':'物價 +300%','THE NUMBER GROWS':'數字又變大了','NOW IN 1,000,000s':'改以百萬為單位',
 'TEMP.':'暫時','EXTRA PILOT HIRED (PAID IN ¥)':'加聘一名飛行員（付金圓券）','SPUTTER':'噗噗噗','FUEL':'油量','PAID IN ¥':'付金圓券','TEMPORARY HQ':'臨時總部','MY FEE?':'我的酬勞呢？','COUNTERATTACK':'反攻','THE MAINLAND':'大陸','WHEN: NEXT YEAR':'時間：明年',
 'RECRUITING · PAY BY THE HOUR':'招募飛行員 · 按時計酬','PEACEFUL REORGANIZATION':'和平改編','IMPASSABLE BARRIER':'長江天險','SHANGHAI WILL HOLD!':'死守大上海！','ONE WAY':'單程',
 'HQ SITUATION MAP':'總部作戰地圖','ALL ACCORDING TO PLAN.':'一切按照計畫。','1ST CLASS':'頭等艙','GOLD':'黃金','PAUSED':'暫停','KILLS':'戰果'};

/* ---------------- save ---------------- */
const SKEY='skygoldyuan49';
function loadSave(){const s=store.get(SKEY,null)||{};const best=Array.isArray(s.best)?s.best:[];
 return{un:clamp(s.un|0||1,1,STAGES.length),best:STAGES.map((_,i)=>typeof best[i]==='number'?best[i]:-1),won:!!s.won}}
let SAVE=loadSave();const saveNow=()=>store.set(SKEY,SAVE);

/* ---------------- state ---------------- */
let P=null,pb=[],eb=[],ens=[],items=[],fx=[],pops=[],boss=null,st=0,stT=0,score=0,lives=3,bombs=3,banner=null,flashW=0,shk=0,clearT=0;
let SS=null,convoy=null,introT=0,tallyT=0,TY=null,overT=0,continues=0,CL=null,paused=false,btns=[],pw0=1,RUN={kills:0};
const WAVE_END=i=>2500+i*200;
function newGame(i){score=0;lives=4;bombs=3;continues=0;P=null;pw0=i?Math.min(3,1+Math.ceil(i/2)):1;RUN={kills:0};brief(i)}
function startStage(i){st=i;stT=0;const s=STAGES[i];L.theme=s.theme;L.weather=s.weather||null;L.deep=s.theme==='river'?[[-1e4,1e5]]:null;LV=i;camX=0;buildBG();buildClouds();
 P={x:60,y:100,pw:P?P.pw:pw0,inv:120,cd:0,dead:0};pb=[];eb=[];ens=[];items=[];fx=[];pops=[];boss=null;clearT=0;flashW=0;shk=0;paused=false;heldK={};touchD=null;
 SS={kills:0,shots:0,hits:0,lost:0,bombs:0,pts0:score};convoy=s.theme==='sea'?{hp:100,max:100,x:12}:null;
 state='intro';introT=0;banner=null;hideOv();music(s.music)}
function beginStage(){state='play';P.inv=120;banner={s:()=>LZ('STAGE '+(st+1)+' · ','第 '+(st+1)+' 關 · ')+ZK(STAGES[st],'name'),t:0}}
function enterTally(){state='tally';tallyT=0;const pay=(score-SS.pts0)*1000;TY={pay,grains:pay/RICE[st]*50,acc:SS.shots?Math.round(SS.hits/SS.shots*100):0};music('off');SFX.fanfare();
 SAVE.un=Math.max(SAVE.un,Math.min(STAGES.length,st+2));SAVE.best[st]=Math.max(SAVE.best[st],score-SS.pts0);saveNow()}
function advance(){if(state==='intro'&&introT>30)beginStage();else if(state==='tally'&&tallyT>70){if(st<STAGES.length-1)brief(st+1);else ending()}}
function continueGame(){continues++;lives=4;bombs=Math.max(bombs,3);P.dead=0;P.x=40;P.y=100;P.inv=180;state='play';music(boss?STAGES[st].bmus:STAGES[st].music);pop(P.x+30,P.y-14,'NEW PILOT, SAME CONTRACT','#ffd24a')}
function restartStage(){score=SS.pts0;lives=Math.max(lives,3);bombs=Math.max(bombs,3);startStage(st)}
const WY=()=>L.theme==='sea'?WATERY+2:WATERY;
/* ---------------- spawns ---------------- */
function spawnWave(){const pool=STAGES[st].pool;let tot=0,k;for(k in pool)tot+=pool[k];let q=rnd()*tot;for(k in pool){q-=pool[k];if(q<0)break}
 const y0=30+rnd()*120,d=st*.6;
 if(k==='fighter')for(let i=0;i<5;i++)ens.push({k,x:W+20+i*22,y:y0,hp:3+d,t:-i*8,amp:20+rnd()*20,ph:rnd()*6,sx:-1.6-st*.15});
 else if(k==='diver')for(let i=0;i<4;i++)ens.push({k,x:W+20,y:i%2?20:170,hp:2+d,t:-i*16,sx:-2.2});
 else if(k==='transport')ens.push({k,x:W+30,y:40+rnd()*60,hp:24+st*6,t:0,sx:-.6});
 else if(k==='balloon')ens.push({k,x:W+20,y:40+rnd()*80,hp:12+st*3,t:0,sx:-.5});
 else if(k==='aa')ens.push({k,x:W+20,y:GY,hp:10+st*3,t:0,sx:-1.2,ground:1});
 else if(k==='light')ens.push({k,x:W+20,y:GY,hp:16+st*2,t:0,sx:-1.3,ground:1,ang:-2});
 else if(k==='junk')for(let i=0;i<2;i++)ens.push({k,x:W+20+i*70,y:WY(),hp:14+st*2,t:-i*20,sx:-.9,ground:1});
 else if(k==='torp')for(let i=0;i<3;i++)ens.push({k,x:W+20+i*40,y:WY()-2,hp:4+st,t:-i*14,sx:-1.1,ground:1});
 else if(k==='turncoat')for(let i=0;i<3;i++)ens.push({k,x:-20-i*24,y:clamp(y0+i*8,20,170),hp:4+d,t:-i*6,sx:1.7,ph:rnd()*6});
 else if(k==='blimp')ens.push({k,x:W+30,y:30+rnd()*90,hp:30+st*4,t:0,sx:-.45});
 else if(k==='notes')for(let i=0;i<8;i++)ens.push({k:'note',x:W+10+i*12,y:y0+Math.sin(i)*14,hp:1,t:-i*4,sx:-1.8,ph:i})}
function spawnBoss(){const s=STAGES[st];banner={s:()=>LZ('WARNING: ','警告：')+ZK(s,'bossName'),t:0,warn:1};SFX.alarm();
 const y={train:GY-10,boat:WATERY-2,bomber:70,tower:GY,printer:90,cruiser:WATERY+2}[s.boss];
 boss={k:s.boss,x:W+90,y,hp:s.hp,max:s.hp,t:0,ph:1,fl:0};music(s.bmus)}
/* ---------------- bullets ---------------- */
function eShot(x,y,ang,sp,k='o'){if(x>W+4||x<-4)return;eb.push({x,y,vx:Math.cos(ang)*sp,vy:Math.sin(ang)*sp,k})}
function aimAt(x,y){return Math.atan2(P.y-y,P.x-x)}
function ring(x,y,n,sp,off=0){for(let i=0;i<n;i++)eShot(x,y,off+i*Math.PI*2/n,sp)}
const CVR=()=>({x1:convoy.x+4,x2:convoy.x+120,y1:GY-4});// convoy ship hit area
/* ---------------- update ---------------- */
let heldK={},touchD=null,dragUsed=false;
function update(){T++;if(state==='pages'){pgT++;return}
 if(state==='intro'){introT++;camX+=.6;if(introT>480)beginStage();return}
 if(state==='tally'){tallyT++;camX+=.3;return}
 if(state==='over'){overT++;if(overT>660)toTitle();return}
 if(state!=='play'||paused)return;stT++;camX+=st===3?1.4:st===4?1.6:1.2;if(banner&&++banner.t>150)banner=null;if(flashW>0)flashW--;if(shk>0)shk*=.88;
 const we=WAVE_END(st);if(!boss&&!clearT&&stT<we&&stT%70===0)spawnWave();if(!boss&&!clearT&&stT===we+100)spawnBoss();
 // player
 if(!P.dead){let mx=(heldK.r?1:0)-(heldK.l?1:0),my=(heldK.d?1:0)-(heldK.u?1:0);const sp=2.4;P.x=clamp(P.x+mx*sp,10,W-20);P.y=clamp(P.y+my*sp,18,GY-6);
  if(touchD){P.x=clamp(touchD.px+(touchD.x-touchD.x0)*1.3,10,W-20);P.y=clamp(touchD.py+(touchD.y-touchD.y0)*1.3,18,GY-6)}
  P.cd--;if((heldK.f||touchUI)&&P.cd<=0&&!clearT){P.cd=6;const n=P.pw,b0=pb.length;pb.push({x:P.x+12,y:P.y,vx:7,vy:0});if(n>=2){pb.push({x:P.x+10,y:P.y-3,vx:6.8,vy:-.9});pb.push({x:P.x+10,y:P.y+3,vx:6.8,vy:.9})}if(n>=3){pb.push({x:P.x+8,y:P.y,vx:6.5,vy:-1.9});pb.push({x:P.x+8,y:P.y,vx:6.5,vy:1.9})}if(n>=4&&T%12===0){pb.push({x:P.x,y:P.y,vx:4,vy:0,big:1})}SS.shots+=pb.length-b0;if(T%12===0)SFX.shot()}
  if(heldK.b){heldK.b=0;bomb()}if(P.inv>0)P.inv--}
 else{P.dead--;if(P.dead<=0){if(lives<=0){P.dead=1;state='over';overT=0;music('off');return}P.dead=0;P.x=40;P.y=100;P.inv=150}}
 for(const b of pb){b.x+=b.vx;b.y+=b.vy}pb=pb.filter(b=>b.x<W+10&&b.y>-10&&b.y<H+10);
 for(const b of eb){b.x+=b.vx;b.y+=b.vy;if(b.k==='bill'){b.vy+=Math.sin(T*.2+b.x)*.03}
  else if(b.k==='bomb'){b.vy+=.05;if(b.y>GY-8){const bx=b.x;b.x=-99;boomFx(bx,GY-8);for(let i=0;i<5;i++)eb.push({x:bx,y:GY-10,vx:Math.cos(-Math.PI/2+(i-2)*.4)*1.6,vy:Math.sin(-Math.PI/2+(i-2)*.4)*1.6,k:'o'})}}
  else if(b.k==='flak'&&--b.l<=0){b.x=-99;fx.push({x:b.px,y:b.py,vx:0,vy:0,l:10,c:'#ffd24a',s:6});for(let i=0;i<8;i++)eb.push({x:b.px,y:b.py,vx:Math.cos(i*.785)*1.5,vy:Math.sin(i*.785)*1.5,k:'o'})}
  if(b.k==='flak'){b.px=b.x;b.py=b.y}
  if(convoy&&b.x>-50){const c=CVR();if(b.x>c.x1&&b.x<c.x2&&b.y>c.y1){const dmg=b.k==='flak'?1.2:b.k==='shell'?1:.08;convoy.hp=Math.max(0,convoy.hp-dmg);fx.push({x:b.x,y:b.y,vx:0,vy:-.5,l:12,c:'#ff8a1a',s:3});b.x=-99;if(convoy.hp<=0&&!convoy.sunk){convoy.sunk=1;pop(150,140,'THE CARGO IS ON FIRE. THE GOLD LEFT EARLIER.','#ff6a5a')}}}}
 eb=eb.filter(b=>b.x>-10&&b.x<W+10&&b.y>-30&&b.y<H+10);
 // enemies
 for(const e of ens){e.t++;if(e.t<0)continue;e.x+=e.sx;updEnemy(e);const h=hbE(e);
  for(const b of pb)if(!b.hit&&Math.abs(b.x-e.x)<h[0]&&Math.abs(b.y-(e.y+h[2]))<h[1]){b.hit=1;SS.hits++;e.hp-=b.big?4:1;e.fl=3;if(e.hp<=0&&!e.dead)killE(e)}
  if(!P.dead&&!P.inv&&!e.dead&&Math.abs(P.x-e.x)<h[0]&&Math.abs(P.y-(e.y+h[2]))<h[1]){P.lh=e.k;hurt()}}
 pb=pb.filter(b=>!b.hit);ens=ens.filter(e=>!e.dead&&e.x>-90&&e.x<W+90);
 if(boss)updBoss();
 // bullets vs player
 if(!P.dead&&!P.inv)for(const b of eb){const rx=b.k==='bill'?5:b.k==='bomb'||b.k==='shell'?4:3;if(Math.abs(b.x-P.x-4)<rx&&Math.abs(b.y-P.y)<3){b.x=-99;P.lh=b.k;hurt();break}}
 // items
 for(const it of items){it.x-=.8;it.y+=Math.sin(T*.1+it.x)*.3;if(!P.dead&&Math.abs(it.x-P.x)<12&&Math.abs(it.y-P.y)<12){it.got=1;if(it.k==='P'){P.pw=Math.min(4,P.pw+1);pop(P.x,P.y-10,'POWER UP','#ffd24a')}else if(it.k==='B'){bombs=Math.min(5,bombs+1);pop(P.x,P.y-10,'+1 MONEY BOMB','#d9a441')}else{addScore(500);pop(P.x,P.y-10,'+¥500 (≈1 GRAIN)','#d9a441')}SFX.pick()}}items=items.filter(i=>!i.got&&i.x>-10);
 for(const f of fx){f.x+=f.vx;f.y+=f.vy;f.vy+=f.g||0;f.l--}fx=fx.filter(f=>f.l>0);for(const p of pops)p.t++;pops=pops.filter(p=>p.t<60);
 if(clearT){clearT++;if(clearT>200)enterTally()}}
function updEnemy(e){const k=e.k;
 if(k==='fighter'){e.y+=Math.cos(e.t*.06+e.ph)*e.amp*.05;if(e.t%90===40&&rnd()<.25+st*.08)eShot(e.x,e.y,aimAt(e.x,e.y),1.7+st*.18)}
 else if(k==='diver'){const a=aimAt(e.x,e.y);if(e.t<40){e.y+=Math.sin(a)*2}if(e.t===30)eShot(e.x,e.y,a,2.4)}
 else if(k==='transport'){if(e.t%50===25)for(let i=0;i<3;i++)eb.push({x:e.x,y:e.y+6,vx:-.6+i*.3,vy:1,k:'leaf'})}
 else if(k==='balloon'){e.y+=Math.sin(e.t*.04)*.3;if(e.t%120===60)ring(e.x,e.y,8,1.3)}
 else if(k==='aa'){if(e.t%100===50)for(let i=-1;i<=1;i++)eShot(e.x,e.y-8,aimAt(e.x,e.y-8)+i*.2,2.2)}
 else if(k==='light'){e.ang=-Math.PI/2-.5+Math.sin(e.t*.035)*.7;if(e.t%36===18)for(let i=0;i<2;i++)eShot(e.x,e.y-14,e.ang,2.2+i*.6)}
 else if(k==='junk'){e.y=WY()+Math.sin(e.t*.08)*1.2;if(e.t%110===55)for(let i=-1;i<=1;i++)eShot(e.x,e.y-16,-Math.PI/2-.5+i*.25,2)}
 else if(k==='torp'){if(convoy&&!convoy.sunk){if(e.t===35)eShot(e.x-8,e.y-4,Math.atan2(GY+6-e.y,CVR().x2-40-e.x),2,'shell');if(e.x<CVR().x2-6){e.dead=1;convoy.hp=Math.max(0,convoy.hp-2);boomFx(e.x,e.y-4);pop(e.x,e.y-20,'RAMMED!','#ff6a5a')}}
  else if(e.t%80===40)eShot(e.x,e.y-4,aimAt(e.x,e.y-4),2)}
 else if(k==='turncoat'){e.y+=Math.sin(e.t*.05+e.ph)*.6;if(e.t===12&&e.x>-60&&rnd()<.6)pop(clamp(e.x+30,40,W-40),e.y-12,pick(['FORMERLY OURS','HE OWES ME MONEY','NEW EMPLOYER','SAME PLANE, NEW PAINT']),'#9fd3ff');if(e.t%70===50)eShot(e.x,e.y,aimAt(e.x,e.y),2)}
 else if(k==='blimp'){e.y+=Math.sin(e.t*.03)*.25;if(e.t%100===60)for(let i=0;i<3;i++)ens.push({k:'note',x:e.x-14,y:e.y+(i-1)*8,hp:1,t:-i*6,sx:-1.6,ph:i})}
 else if(k==='note'){if(e.t<90&&!P.dead)e.y+=clamp(P.y-e.y,-.7,.7);e.y+=Math.sin(e.t*.2+e.ph)*.5}}
function hbE(e){// [half w, half h, y offset]
 return{transport:[18,8,0],blimp:[20,10,0],junk:[14,10,-12],torp:[12,12,-8],note:[6,5,0],light:[10,8,-6],aa:[10,8,-6]}[e.k]||[10,7,0]}
function pop(x,y,s,c){pops.push({x,y,s,c,t:0})}
function boomFx(x,y,big){SFX.boom(big);shk=Math.max(shk,big?10:4);for(let i=0;i<(big?40:14);i++){const a=rnd()*6.28,v=rnd()*(big?4:2.5);fx.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:20+rnd()*20,c:pick(['#ffe27a','#ff8a1a','#ff5a1a','#555']),s:2+(rnd()*2|0)})}}
function addScore(v){const a=score;score+=v;const X=[30000,80000,160000,280000];for(const x of X)if(a<x&&score>=x&&lives<6){lives++;SFX.oneup();pop(P.x+20,P.y-20,'EXTRA PILOT HIRED (PAID IN ¥)','#8fe07a')}}
function killE(e){e.dead=1;SS.kills++;RUN.kills++;const v={fighter:100,diver:80,transport:600,balloon:300,aa:200,light:300,junk:300,torp:150,turncoat:150,blimp:800,note:20}[e.k];addScore(v);boomFx(e.x,e.y+(hbE(e)[2]),e.k==='transport'||e.k==='blimp');
 if(e.k==='note'){if(rnd()<.05)items.push({k:'¥',x:e.x,y:e.y});return}
 if(e.k==='transport'||e.k==='blimp'||rnd()<.12)items.push({k:rnd()<.5&&P.pw<4?'P':rnd()<.4?'B':'¥',x:e.x,y:Math.min(e.y,GY-20)});else if(rnd()<.3)items.push({k:'¥',x:e.x,y:Math.min(e.y,GY-20)})}
function hurt(){if(P.dead||P.inv||clearT)return;lives--;SS.lost++;P.dead=90;P.pw=Math.max(1,P.pw-1);boomFx(P.x,P.y,true);SFX.die();pop(P.x,P.y-12,lives>0?'NEW PILOT, SAME CONTRACT':'CONTRACT TERMINATED','#ff6a5a')}
function bomb(){if(bombs<=0||P.dead||clearT)return;bombs--;SS.bombs++;flashW=20;SFX.boom(true);shk=12;for(const b of eb)b.x=-99;for(const e of ens){e.hp-=12;if(e.hp<=0&&!e.dead)killE(e)}if(boss){boss.hp-=40;boss.fl=6}
 for(let i=0;i<60;i++)fx.push({x:rnd()*W,y:-10-rnd()*40,vx:(rnd()-.5)*.6,vy:1+rnd()*2,l:90,c:rnd()<.5?'#8aa070':'#b0a070',s:3,bill:1});pop(W/2,60,'MONEY BOMB! (WORTHLESS, BUT HEAVY)','#d9a441')}
function bossBox(b){return{train:[60,18,-14],boat:[50,18,-14],bomber:[54,12,0],tower:[22,44,-52],printer:[56,26,0],cruiser:[70,20,-22]}[b.k]}
function updBoss(){const b=boss;b.t++;if(b.fl>0)b.fl--;const tx={printer:W-80,bomber:W-90,tower:W-70,cruiser:W-110}[b.k]||W-90;if(b.x>tx)b.x-=1;else b.entered=1;
 if(b.k==='printer')b.y=90+Math.sin(b.t*.02)*30;if(b.k==='bomber')b.y=72+Math.sin(b.t*.016)*38;if(b.k==='cruiser'||b.k==='boat')b.y=(b.k==='boat'?WATERY-2:WATERY+2)+Math.sin(b.t*.05);
 if(b.entered){const f=b.ph===2?1.5:1,E=n=>b.t%Math.round(n/f)===0;
  if(b.k==='train'){if(E(50))for(let i=-2;i<=2;i++)eShot(b.x-20,b.y-24,aimAt(b.x-20,b.y-24)+i*.15,2.2);if(E(80))for(let i=0;i<5;i++)eShot(b.x+i*12,b.y-16,-Math.PI/2-.6+rnd()*.2-i*.15,2.4)}
  else if(b.k==='boat'){if(E(90))ring(b.x,b.y-30,10,1.5,b.t*.01);if(E(50))eShot(b.x-30,b.y-20,aimAt(b.x-30,b.y-20),2.6)}
  else if(b.k==='bomber'){if(E(70))for(let i=0;i<3;i++)eb.push({x:b.x-20+i*20,y:b.y+8,vx:-.7,vy:.3,k:'bomb'});
   if(b.t%110<36&&b.t%6===0)eShot(b.x+44,b.y-4,aimAt(b.x+44,b.y-4)+(rnd()-.5)*.2,2.6);if(b.ph===2&&E(120))ring(b.x,b.y,14,1.5,b.t*.02)}
  else if(b.k==='tower'){const ty=b.y-96;b.a1=-Math.PI/2-.7+Math.sin(b.t*.02)*.6;b.a2=-Math.PI+.45+Math.sin(b.t*.027+1)*.45;
   if(E(34)){eShot(b.x-8,ty,b.a1,2);eShot(b.x-8,ty,b.a2,2)}if(E(110))flak(b.x-16,ty+6,P.x+(rnd()-.5)*30,P.y+(rnd()-.5)*20,60);if(b.ph===2&&E(130))ring(b.x-8,ty,10,1.3,b.t*.03)}
  else if(b.k==='printer'){if(b.t%5===0)eb.push({x:b.x-30,y:b.y,vx:Math.cos(b.t*.13)*1.8-1.2,vy:Math.sin(b.t*.13)*1.8,k:'bill'});if(E(110))for(let i=-3;i<=3;i++)eShot(b.x-40,b.y+10,Math.PI+i*.2,2.4);
   if(b.ph===2&&b.t%150===0){pop(b.x-40,b.y-40,pick(['NEW NOTES ISSUED','PRICES +300%','THE NUMBER GROWS','NOW IN 1,000,000s']),'#ff8a3a');for(let i=0;i<5;i++)ens.push({k:'note',x:b.x-50,y:b.y-20+i*10,hp:1,t:-i*5,sx:-1.7,ph:i})}}
  else if(b.k==='cruiser'){const t1=[b.x-48,b.y-30],t2=[b.x+24,b.y-30];const pe=Math.round(80/f),ph=b.t%pe;for(const[tt,o]of[[t1,0],[t2,pe>>1]])if(ph===o)for(let i=-1;i<=1;i++)eShot(tt[0],tt[1],aimAt(tt[0],tt[1])+i*.24,2);
   if(E(150)&&convoy&&!convoy.sunk)flak(b.x-20,b.y-34,CVR().x1+40+rnd()*60,GY+2,80,'shell');if(b.ph===2&&E(100))flak(b.x,b.y-40,P.x,P.y,55)}}
 const bx=bossBox(b);
 for(const p of pb)if(!p.hit&&Math.abs(p.x-b.x)<bx[0]&&Math.abs(p.y-(b.y+bx[2]))<bx[1]){p.hit=1;SS.hits++;b.hp-=p.big?4:1;b.fl=3;if(T%3===0)fx.push({x:p.x,y:p.y,vx:-1,vy:(rnd()-.5)*2,l:8,c:'#fff',s:2})}
 if(b.ph===1&&b.hp<b.max*.5){b.ph=2;banner={s:()=>ZK(STAGES[st],'angry'),t:0,warn:1};SFX.alarm()}
 if(b.hp<=0){const bxx=b.x,byy=b.y+bx[2];for(let i=0;i<6;i++)setTimeout(()=>boomFx(bxx+(rnd()-.5)*80,byy+(rnd()-.5)*30,true),i*150);addScore(STAGES[st].pts);SS.kills++;RUN.kills++;boss=null;eb=[];clearT=1;music('off');setTimeout(()=>SFX.oneup(),900);
  const paid=fmtBig((score-SS.pts0)*1000);banner={s:()=>LZ('STAGE CLEAR · CONTRACT PAID: ¥'+paid,'過關 · 酬勞入帳：¥'+paid),t:0}}}
function flak(x,y,tx,ty,l,k='flak'){const n=Math.max(20,l);eb.push({x,y,vx:(tx-x)/n,vy:(ty-y)/n,k,l:n,px:x,py:y})}
/* ---------------- render: craft ---------------- */
function plane(x,y,fl){x=Math.round(x);y=Math.round(y);const c=fl?'#fff':'#7a8a5a',d=fl?'#ddd':'#5a6a3a';r(x-10,y-2,22,5,c);r(x-6,y-6,10,2,d);r(x-6,y+4,10,2,d);r(x-4,y-5,1,10,'#3a2a20');r(x+12,y-1,2,3,'#3a3a3a');const pr=(T>>1)%2;r(x+14,y-5+pr*3,1,7-pr*3,'#cfcfcf');r(x-12,y-4,3,4,d);r(x-1,y-5,5,4,SK);r(x-1,y-6,5,2,'#2f4166');r(x+1,y-4,1,1,'#120d0c');r(x+5,y-2,3,3,'#2f4f8a');r(x+6,y-1,1,1,'#f2f2f2')}
function miniPlane(x,y){r(x-4,y,9,2,'#9fb07a');r(x-2,y-2,4,1,'#7a8a5a');r(x-2,y+3,4,1,'#7a8a5a');r(x+5,y-1,1,4,'#cfcfcf');r(x,y,2,2,'#2f4f8a')}
function enemyPlane(e){const x=Math.round(e.x),y=Math.round(e.y),f=e.fl>0&&T%2;e.fl&&e.fl--;const c=f?'#fff':'#6a6a72',d=f?'#ddd':'#4a4a52';
 if(e.k==='transport'){r(x-20,y-5,40,10,c);r(x-6,y-12,12,24,d);r(x+16,y-8,6,4,d);r(x-22,y-2,3,4,'#cfcfcf');r(x-14,y-3,3,2,'#ffd24a');r(x-8,y-3,3,2,'#ffd24a');r(x+4,y-2,4,4,'#b8322a');r(x+5,y-1,2,2,'#f1d27a');return}
 if(e.k==='balloon'){r(x-12,y-8,24,14,c);r(x-14,y-5,28,8,c);r(x-3,y+6,6,4,d);r(x,y+10,1,30,'#555');hanV('解',x,y-6,'#f1d27a',9);return}
 if(e.k==='aa'){r(x-8,y-6,16,6,f?'#fff':L.theme==='snow'?'#e8eef4':'#5d6447');r(x-10,y-2,20,4,'#434833');seg(x,y-6,x-8,y-14,2,'#262622');r(x-2,y-5,4,3,'#b8322a');return}
 if(e.k==='light'){ctx.globalAlpha=.13;ctx.fillStyle='#fff4c0';ctx.beginPath();ctx.moveTo(x,y-14);ctx.lineTo(x+Math.cos(e.ang-.08)*300,y-14+Math.sin(e.ang-.08)*300);ctx.lineTo(x+Math.cos(e.ang+.08)*300,y-14+Math.sin(e.ang+.08)*300);ctx.fill();ctx.globalAlpha=1;
  r(x-10,y-8,20,8,f?'#fff':'#2a2830');r(x-12,y-2,24,2,'#4a4652');r(x-4,y-17,8,9,f?'#fff':'#5a5662');r(x-3,y-16,6,5,'#fff4c0');r(x+6,y-7,4,3,'#b8322a');return}
 if(e.k==='junk'){r(x-15,y-4,30,5,f?'#fff':'#5a3a24');r(x-11,y-6,22,2,'#7a5232');r(x+12,y-9,5,5,'#5a3a24');r(x,y-30,1,24,'#3a2a20');r(x-9,y-28,9,20,f?'#fff':'#c8a878');for(let i=0;i<4;i++)r(x-9,y-25+i*5,9,1,'#8a6a48');r(x-7,y-22,5,5,'#b8322a');r(x-6,y-21,3,3,'#f1d27a');
  drawHead(x+2,y-1,'ccp','grit',-1);return}
 if(e.k==='torp'){if(T%4<2)r(x+12,y-1,10,1,'#9fc0e0');r(x-12,y-4,26,4,f?'#fff':'#5a6068');r(x-14,y-2,4,2,'#5a6068');r(x-4,y-8,10,4,f?'#fff':'#3a4048');r(x+4,y-14,1,6,'#262626');r(x+5,y-14,6,4,'#b8322a');return}
 if(e.k==='note'){const fl=Math.abs(Math.sin(e.t*.25+e.ph));const h=Math.max(1,Math.round(fl*5));r(x-5,y-h/2,10,h,f?'#fff':'#8aa070');if(h>2){r(x-1,y-1,2,2,'#d9a441');r(x-5,y-h/2,10,1,'#5a7050')}return}
 if(e.k==='blimp'){r(x-20,y-9,40,16,f?'#fff':'#6a4a80');r(x-23,y-5,46,8,f?'#fff':'#6a4a80');r(x+18,y-12,6,22,'#4a3a60');r(x-6,y+7,12,5,'#3a2a40');hanV('鈔',x-2,y-7,'#d9a441',9);if(e.t%100>80)r(x-10,y+12,6,3,'#8aa070');return}
 if(e.k==='turncoat'){const kc=f?'#fff':'#7a8a5a',kd=f?'#ddd':'#5a6a3a';r(x-8,y-2,16,4,kc);r(x-3,y-7,6,14,kd);r(x-10,y-4,4,3,kd);r(x+8,y-3,2,6,'#cfcfcf');r(x+1,y-3,3,2,'#9fd3ff');r(x-4,y-1,4,4,'#2f4f8a');r(x-2,y-1,2,4,'#b8322a');r(x-3,y,1,1,'#f2f2f2');if(T%20<10)r(x-5,y-7,1,2,'#b8322a');return}
 r(x-8,y-2,16,4,c);r(x-3,y-7,6,14,d);r(x+6,y-4,4,3,d);r(x-10,y-3,2,6,'#cfcfcf');r(x-4,y-3,3,2,'#9fd3ff');r(x+2,y-1,3,3,'#b8322a');r(x+3,y,1,1,'#f1d27a')}
function printerShip(x,y,f){r(x-56,y-20,112,40,f?'#fff':'#6a4a80');r(x-62,y-12,124,24,f?'#fff':'#6a4a80');r(x-50,y-20,100,3,'#8a6aa0');r(x+52,y-26,10,52,'#4a3a60');r(x-14,y+20,28,10,'#3a2a40');
 ctx.font=SERIF(14);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#000';ctx.fillText('印鈔',x+1,y+2);ctx.fillStyle='#d9a441';ctx.fillText('印鈔',x,y);ctx.textBaseline='top';
 r(x-20,y+28,40,3,'#8aa070');if(T%10<5)r(x-18+(T%40),y+31,6,4,'#8aa070')}
function drawBoss(b){const x=Math.round(b.x),y=Math.round(b.y),f=b.fl>0&&T%2;
 if(b.k==='train'){for(let i=0;i<3;i++){r(x-60+i*42,y-18,38,18,f?'#fff':'#4a4e3a');r(x-60+i*42,y-20,38,3,'#2a2c22');for(let k=0;k<4;k++)r(x-56+i*42+k*9,y-2,6,6,'#1a1a18')}r(x-70,y-28,14,26,f?'#fff':'#3a3c30');r(x-74,y-16,6,4,'#262622');hanV('六主',x-18,y-17,'#e9dcc2',7);r(x+48,y-26,8,6,'#b8322a');r(x+49,y-25,2,2,'#f1d27a');if(T%6<3)r(x-66,y-34,6,6,'#555')}
 else if(b.k==='boat'){r(x-56,y-14,112,14,f?'#fff':'#5a6068');r(x-48,y-28,56,14,f?'#ddd':'#3a4048');r(x-20,y-44,14,16,'#3a4048');r(x-40,y-34,26,3,'#262626');r(x+30,y-40,1,26,'#262626');r(x+31,y-40,12,8,'#b8322a');r(x+32,y-39,3,3,'#f1d27a');r(x+8,y-12,24,8,'#2f4f8a');r(x+14,y-12,20,8,'#b8322a');hanV('新',x+24,y-12,'#f1d27a',8);for(let i=0;i<6;i++)r(x-56+i*20,y,10,2,'#6a8ab0')}
 else if(b.k==='bomber'){const c=f?'#fff':'#7a8a5a',d=f?'#ddd':'#5a6a3a';r(x-48,y-5,96,11,c);r(x-56,y-3,8,8,c);r(x-58,y-2,4,5,'#9fd3ff');r(x+40,y-20,10,16,d);r(x+36,y-8,16,3,d);r(x+46,y-3,6,5,'#9fd3ff');
  r(x-28,y+2,48,4,d);for(const ex of[-24,4]){r(x+ex,y-1,8,7,'#4a4a42');const pr=(T>>1)%2;r(x+ex-2,y-4+pr*3,1,12-pr*5,'#cfcfcf')}
  r(x+12,y-4,9,9,'#2f4f8a');r(x+15,y-4,6,9,'#b8322a');r(x+16,y-2,3,3,'#f1d27a');for(let i=0;i<5;i++)r(x-40+i*7,y-2,3,2,'#3a4a2a');if(b.t%110<36&&T%4<2)r(x+52,y-5,4,3,'#ffe27a')}
 else if(b.k==='tower'){const ty=y-96;r(x-18,ty+6,36,90,f?'#fff':'#3a3a44');for(let k=0;k<6;k++)r(x-14,ty+14+k*13,28,2,'#2a2a32');for(let k=0;k<5;k++){r(x-10,ty+18+k*13,4,5,T%60<30?'#e0b050':'#7a6030');r(x+6,ty+18+k*13,4,5,'#e0b050')}
  r(x-28,ty,56,8,f?'#fff':'#4a4a54');for(const a of[b.a1||-2,b.a2||-2.6]){ctx.globalAlpha=.14;ctx.fillStyle='#fff4c0';ctx.beginPath();ctx.moveTo(x-8,ty);ctx.lineTo(x-8+Math.cos(a-.07)*420,ty+Math.sin(a-.07)*420);ctx.lineTo(x-8+Math.cos(a+.07)*420,ty+Math.sin(a+.07)*420);ctx.fill();ctx.globalAlpha=1}
  r(x-14,ty-7,10,8,'#5a5662');r(x-12,ty-6,6,5,'#fff4c0');r(x+4,ty-6,12,6,'#3a3a44');seg(x+8,ty-6,x-2,ty-16,2,'#262622');seg(x+12,ty-6,x+4,ty-16,2,'#262622');r(x+20,ty-14,1,14,'#262626');r(x+21,ty-14,10,7,'#b8322a');r(x+22,ty-13,3,3,'#f1d27a')}
 else if(b.k==='cruiser'){const c=f?'#fff':'#5a6068',d=f?'#ddd':'#3a4048';r(x-84,y-14,168,14,c);r(x-92,y-18,14,6,c);r(x-70,y-24,130,10,d);r(x-24,y-46,22,22,d);r(x-20,y-58,10,12,'#2a3038');r(x+10,y-40,10,16,'#2a3038');for(const tx of[-48,24]){r(x+tx-8,y-32,16,8,'#4a5058');seg(x+tx-6,y-30,x+tx-20,y-36,2,'#262626')}
  r(x+70,y-52,1,30,'#262626');r(x+71,y-52,14,9,'#b8322a');r(x+72,y-51,3,3,'#f1d27a');r(x-60,y-12,40,8,'#2f4f8a');r(x-46,y-12,26,8,'#b8322a');ctx.font=SERIF(7);ctx.textAlign='center';ctx.textBaseline='top';ctx.fillStyle='#f1d27a';ctx.fillText('旗艦',x-40,y-12);for(let i=0;i<8;i++)r(x-84+i*22,y,12,2,'#6a8ab0')}
 else printerShip(x,y,f)}
function bossHP(b){const w=160;r(W/2-w/2-1,H-11,w+2,6,'#120d0c');r(W/2-w/2,H-10,w,4,'#2a0a0a');r(W/2-w/2,H-10,w*Math.max(0,b.hp/b.max),4,'#c8372d');txt(ZK(STAGES[st],'bossName'),W/2,H-22,'#e9dcc2','center')}
/* ---------------- render: backgrounds ---------------- */
function buildClouds(){const R=seeded(77+st*13);CL={far:[],mid:[],near:[]};for(let i=0;i<14;i++)CL.far.push({x:R()*900,y:150+R()*30,w:60+R()*90});for(let i=0;i<9;i++)CL.mid.push({x:R()*1100,y:40+R()*110,w:40+R()*60});for(let i=0;i<8;i++)CL.near.push({x:R()*1400,y:170+R()*30,w:80+R()*80});
 const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#1e1a40');g.addColorStop(.55,'#7a5a8a');g.addColorStop(1,'#f0b070');CL.sky=g;
 const n=ctx.createLinearGradient(0,0,0,130);n.addColorStop(0,'#05070f');n.addColorStop(1,'#1c2444');CL.night=n;const d=ctx.createLinearGradient(0,0,0,130);d.addColorStop(0,'#3a4a7a');d.addColorStop(.6,'#c07a6a');d.addColorStop(1,'#f0c080');CL.dawn=d}
function cloud(x,y,w,c,hi){r(x,y,w,9,c);r(x+w*.12,y-5,w*.5,6,c);r(x+w*.42,y-10,w*.34,11,c);r(x+w*.12,y-5,w*.5,1,hi);r(x+w*.42,y-10,w*.34,1,hi)}
function bgClouds(){ctx.fillStyle=CL.sky;ctx.fillRect(0,0,W,H);r(300-(camX*.02|0),120,18,18,'#ffe0a0');r(297-(camX*.02|0),123,24,12,'#ffe0a0');
 for(const c of CL.far){const x=((c.x-camX*.15)%1000+1000)%1000-100;cloud(x,c.y,c.w,'#b07a8a','#e0a8a0')}
 r(0,186,W,30,'#c08a8a');
 for(const c of CL.mid){const x=((c.x-camX*.45)%1200+1200)%1200-120;cloud(x,c.y,c.w,'#d8b0b0','#fff0e0')}
 for(const c of CL.near){const x=((c.x-camX*1.1)%1500+1500)%1500-150;cloud(x,c.y,c.w,'#e8c8c0','#fff8f0')}}
function bgSea(){const p=state==='play'||state==='tally'?Math.min(1,stT/(WAVE_END(5)+600)):0;ctx.fillStyle=CL.night;ctx.fillRect(0,0,W,130);ctx.globalAlpha=p;ctx.fillStyle=CL.dawn;ctx.fillRect(0,0,W,130);ctx.globalAlpha=1;
 if(p<.8)for(let i=0;i<40;i++){ctx.globalAlpha=1-p;r((i*53+7)%W,(i*29)%100,1,1,i%3?'#5a5a7a':'#e9dcc2')}ctx.globalAlpha=1;
 if(p<.6)r(60,24,10,10,'#e9e0c0');else{const sy=130-(p-.6)*120;r(W-90,sy,16,16,'#ffc070');r(W-93,sy+3,22,10,'#ffc070')}
 const ix=W+40-p*140;r(ix,120,160,10,'#2a3a3a');r(ix+20,114,90,6,'#2a3a3a');r(ix+44,108,40,6,'#2a3a3a');
 r(0,128,W,H-128,p<.5?'#16243e':'#1f3656');r(0,128,W,1,'#4a6a90');
 for(let k=0;k<6;k++){const yy=132+k*k*2.6,sp=.2+k*.25;for(let i=0;i<14;i++)r(((i*61+k*17-camX*sp)%(W+30)+W+30)%(W+30)-15,yy,6+k*2,1,k>3?'#6a8ab0':'#3a5a80')}}
function drawStageBG(){if(L.theme==='clouds')bgClouds();else if(L.theme==='sea')bgSea();else drawBG();
 if(L.weather==='haze'){for(let i=0;i<5;i++){ctx.globalAlpha=.07;r(((i*130-camX*.7)%(W+200)+W+200)%(W+200)-200,60+i*24,200,14,'#e9dcc2')}ctx.globalAlpha=1}
 drawWeather();if(convoy)drawConvoy()}
function drawConvoy(){const c=convoy,x=c.x,y=GY+20;enShip(x,y,T);enSign('TEMP.',x+47,y-60,'#e9dcc2',0);
 if(c.hp<60&&T%3===0&&state==='play'&&!paused)fx.push({x:x+30+rnd()*60,y:y-20,vx:-.3,vy:-.6,l:30,c:'#3a3030',s:3});
 r(x+10,y-70,100,4,'#2a0a0a');r(x+10,y-70,100*c.hp/c.max,4,c.hp>40?'#8aa070':'#c8372d')}
/* ---------------- render ---------------- */
function obtn(label,x,y,w,f,hi){const h=17;r(x,y,w,h,hi?'#3a2a12':'#1a1310');r(x,y,w,1,hi?'#ffd24a':'#6e6050');r(x,y+h-1,w,1,hi?'#ffd24a':'#6e6050');r(x,y,1,h,hi?'#ffd24a':'#6e6050');r(x+w-1,y,1,h,hi?'#ffd24a':'#6e6050');
 tiny(label,x+w/2,y+6,hi?'#ffd24a':'#e9dcc2','center');btns.push({x,y,w,h,f})}
function render(){btns=[];if(state==='pages'){drawPages();return}
 if(state==='title'||state==='stages'){camX+=.4;if(!BGD)buildBG();if(!CL)buildClouds();drawStageBG();plane(W/2+Math.sin(T*.03)*40,80+Math.sin(T*.05)*10);ctx.drawImage(VIG,0,0);return}
 ctx.save();if(shk>0&&!RM)ctx.translate((rnd()-.5)*shk,(rnd()-.5)*shk);drawStageBG();
 if(state==='intro'){ctx.restore();plane(60+Math.min(0,introT-60)*1.2+Math.sin(T*.05)*3,100+Math.sin(T*.04)*6);renderIntro();ctx.drawImage(VIG,0,0);return}
 for(const e of ens)if(e.t>=0)enemyPlane(e);if(boss)drawBoss(boss);
 for(const it of items){r(it.x-5,it.y-5,10,10,it.k==='P'?'#c8372d':it.k==='B'?'#d9a441':'#8aa070');r(it.x-5,it.y-5,10,1,'#fff4d0');tinyPx(it.k,it.x,it.y-2,'#fff','center')}
 for(const b of pb)b.big?r(b.x-3,b.y-2,6,4,'#ffd24a'):r(b.x-3,b.y,6,1,'#ffe27a');
 for(const b of eb){if(b.k==='bill'){r(b.x-4,b.y-2,8,4,'#8aa070');r(b.x-1,b.y-1,2,2,'#d9a441')}else if(b.k==='leaf'){r(b.x-3,b.y-2,6,4,'#e9dcc2');r(b.x-2,b.y-1,4,1,'#b8322a')}
  else if(b.k==='bomb'){r(b.x-2,b.y-3,4,7,'#262626');r(b.x-3,b.y-4,6,2,'#4a4a42')}else if(b.k==='flak'||b.k==='shell'){r(b.x-2,b.y-2,5,5,'#1a1a18');r(b.x-1,b.y-1,2,2,T%6<3?'#ff6a3a':'#ffd24a')}
  else{r(b.x-2,b.y-2,4,4,'#ff6a3a');r(b.x-1,b.y-1,2,2,'#fff')}}
 if(!P.dead&&!(P.inv&&T%4<2))plane(P.x,P.y);
 for(const f of fx)f.bill?(r(f.x,f.y,6,3,f.c)):r(f.x,f.y,f.s||2,f.s||2,f.c);
 for(const p of pops){ctx.globalAlpha=1-p.t/60;const s=PV(p.s);ctx.font=CJK_RE.test(s)?ZF(11):F;const w=ctx.measureText(s).width/2;txt(s,clamp(p.x,w+4,W-w-4),p.y-p.t*.3,p.c,'center');ctx.globalAlpha=1}
 ctx.restore();if(flashW){ctx.globalAlpha=flashW/20*.6;r(0,0,W,H,'#fff4d0');ctx.globalAlpha=1}
 // HUD (top right is left free for the page buttons)
 tinyPx('¥'+String(Math.floor(score)).padStart(9,'0'),8,6,'#d9a441');for(let i=0;i<Math.max(0,lives);i++)miniPlane(12+i*12,16);
 for(let i=0;i<bombs;i++){r(8+i*9,23,7,4,'#8aa070');r(10+i*9,24,2,2,'#d9a441')}tinyPx('P'+P.pw,8,31,'#ff9a6a');
 if(state!=='tally'){tiny(LZ('STAGE '+(st+1)+'/6','第 '+(st+1)+'／6 關'),W/2,5,'#a8977c','center');
 if(convoy)tiny(LZ('CONVOY '+Math.ceil(convoy.hp)+'%','船團 '+Math.ceil(convoy.hp)+'%'),W/2,16,convoy.hp>40?'#8aa070':'#ff6a5a','center')}
 if(boss)bossHP(boss);
 if(state==='play'&&stT<480&&!boss){const s=STAGES[st],h=touchUI&&s.thint?ZK(s,'thint'):ZK(s,'hint');ctx.globalAlpha=Math.min(1,(480-stT)/60);r(0,H-15,W,13,'rgba(12,9,8,.75)');tiny(h,W/2,H-11,'#ffd24a','center');ctx.globalAlpha=1}
 if(banner){const s=PV(banner.s),sz=banner.warn?14:12;ctx.font=SERIF(sz);const k=Math.min(1,(W-16)/ctx.measureText(s).width);stxt(s,W/2,H/2-30,banner.warn?(T%10<5?'#ff5a3a':'#ffd24a'):'#e9dcc2',Math.floor(sz*k),banner.t<20?banner.t/20:banner.t>120?(150-banner.t)/30:1)}
 if(state==='tally')renderTally();
 if(state==='over')renderOver();
 if(paused&&state==='play')renderPause();
 ctx.drawImage(VIG,0,0)}
function panel(y0,h){ctx.globalAlpha=.86;r(0,y0,W,h,'#0c0908');ctx.globalAlpha=1;r(0,y0,W,1,'#d9a441');r(0,y0+h-1,W,1,'#d9a441')}
function renderIntro(){const s=STAGES[st],t=introT,zh=LANG==='zh';panel(28,156);
 const a=Math.min(1,t/20);stxt(LZ('STAGE '+(st+1),'第 '+(st+1)+' 關'),W/2,44,'#d9a441',13,a);stxt(ZK(s,'name'),W/2,66,'#e9dcc2',20,a);
 tiny(ZK(s,'date')+' · '+ZK(s,'place'),W/2,84,'#a8977c','center');let y=zh?100:102;const lh=LH();
 ZK(s,'brief').forEach((b,j)=>{const ls=lines(b,W-44);ls.forEach(l=>{if(t>30+j*40)txt(l,W/2,y,j?'#ff9a6a':'#e9dcc2','center');y+=lh});y+=4});
 if(t>40&&T%40<26)tiny(touchUI?LZ('TAP TO TAKE OFF','點一下起飛'):LZ('ENTER TO TAKE OFF','按 Enter 起飛'),W/2,Math.max(y+2,166),'#d9a441','center')}
function renderTally(){const t=tallyT,s=STAGES[st],zh=LANG==='zh';panel(20,176);stxt(LZ('STAGE '+(st+1)+' COMPLETE','第 '+(st+1)+' 關完成'),W/2,36,'#ffd24a',16);txt(LZ(s.bossName+' DESTROYED',ZK(s,'bossName')+' 已擊毀'),W/2,zh?46:47,'#a8977c','center');
 const rows=[[LZ('ENEMIES DOWNED','擊落敵機'),String(SS.kills)],[LZ('ACCURACY','命中率'),TY.acc+'%'],[LZ('PILOTS LOST','損失飛行員'),String(SS.lost)+(SS.lost?LZ(' (REPLACED)','（已補上）'):'')],[LZ('MONEY BOMBS DROPPED','投下金圓炸彈'),String(SS.bombs)],
  [LZ('PAY THIS STAGE','本關酬勞'),'¥'+fmtBig(TY.pay)],[LZ('RICE PRICE ON LANDING','落地時米價'),'¥'+fmtBig(RICE[st])+LZ('/BAG','／袋')],[LZ('YOUR PAY BUYS','可以買到'),TY.grains>=1?fmtBig(Math.floor(TY.grains))+LZ(' GRAINS',' 粒米'):LZ('1 GRAIN (ROUNDED UP)','一粒米（無條件進位）')]];
 if(convoy)rows.splice(4,0,[LZ('CARGO DELIVERED','貨物送達'),Math.ceil(convoy.hp)+'%'+(convoy.hp<=0?LZ(' (OF NOTHING)','（空的）'):'')]);
 const rh=zh?11:10;rows.forEach((rw,i)=>{if(t>20+i*14){tiny(rw[0],64,62+i*rh,'#a8977c');tiny(rw[1],W-64,62+i*rh,i>=rows.length-1?'#ff9a6a':'#e9dcc2','right');if(t===21+i*14)SFX.tally()}});
 const last=st>=STAGES.length-1,ny=62+rows.length*rh+6;
 const nx=last?[LZ('ORDERS: NONE. THE WAR IS OVER. FOR US.','命令：無。戰爭結束了，對我們來說。'),LZ('Please proceed to the temporary capital. Temporarily.','請前往臨時首都。暫時地。')]:[LZ('NEXT: ','下一關：')+ZK(STAGES[st+1],'name'),ZK(STAGES[st+1],'orders')];
 if(t>20+rows.length*14){tiny(nx[0],W/2,ny,'#d9a441','center');lines(nx[1],W-40,10).forEach((l,i)=>tiny(l,W/2,ny+(zh?12:9)+i*(zh?12:8),'#ff9a6a','center'))}
 if(t>70&&T%40<26)tiny(touchUI?LZ('TAP ▶','點一下 ▶'):LZ('ENTER ▶','按 Enter ▶'),W-12,H-30,'#d9a441','right')}
function renderOver(){r(0,0,W,H,'rgba(8,6,5,.84)');stxt(LZ('CONTRACT TERMINATED','合約終止'),W/2,44,'#b3261e',20);
 const lh=LH();lines(LZ('Your replacement is already in the cockpit. He was promised the same pay. It is worth less already.','你的替補已經坐進駕駛艙了。他拿到同樣的待遇承諾，而那份薪水已經貶值了。'),W-70).forEach((l,i)=>txt(l,W/2,64+i*lh,'#e9dcc2','center'));
 tiny(LZ('STAGE '+(st+1)+' · ','第 '+(st+1)+' 關 · ')+ZK(STAGES[st],'name'),W/2,100,'#a8977c','center');
 if(overT>40){const n=Math.max(0,10-Math.floor(overT/66));obtn(LZ('SIGN A NEW CONTRACT  ','簽新合約（接關）  ')+n,W/2-90,116,180,continueGame,1);obtn(LZ('RETIRE','退休'),W/2-90,140,180,toTitle)}
 tiny(LZ('CONTRACTS SIGNED SO FAR: ','目前已簽合約：')+(continues+1),W/2,H-18,'#6e6050','center')}
function renderPause(){r(0,0,W,H,'rgba(8,6,5,.8)');stxt(LZ('PAUSED','暫停'),W/2,40,'#ffd24a',22);tiny(LZ('STAGE '+(st+1)+' · ','第 '+(st+1)+' 關 · ')+ZK(STAGES[st],'name'),W/2,58,'#a8977c','center');
 obtn(LZ('RESUME','繼續'),W/2-60,72,120,()=>{paused=false},1);obtn(LZ('RESTART STAGE','重打本關'),W/2-60,93,120,restartStage);obtn(LZ('STAGE SELECT','選擇關卡'),W/2-60,114,120,openStages);
 obtn(LZ('LANGUAGE: 中文','語言：ENGLISH'),W/2-60,135,120,()=>applyLang(LANG==='zh'?'en':'zh',true));obtn(LZ('QUIT TO TITLE','回到標題'),W/2-60,156,120,toTitle)}
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
function bigPlane(x,y,s){ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(s,s);plane(0,0);ctx.restore()}
function stars(n,h){for(let i=0;i<n;i++)r((i*53+7)%W,(i*29)%h,1,1,i%3?'#5a5a7a':'#e9dcc2')}
function cityline(t,c='#15131f',lit=1){for(let i=0;i<20;i++){const h=20+((i*37)%5)*9,x=i*20-((t*.1)%20);r(x,136-h,18,h,c);if(lit)for(let k=0;k<3;k++)if((i+k)%3)r(x+4+k*4,140-h+6+((i*k)%3)*5,2,2,'#e0b050')}}
/* story page art, one per stage */
const STORY_ART=[
 t=>{enSky('#2e3640','#8a8f7a');r(0,96,W,40,'#4f4632');r(0,96,W,2,'#6b7a3a');r(0,110,W,12,'#5a5650');for(let x=0;x<W;x+=24)r(x,115,12,2,'#d8d0bc');
  r(262,46,112,52,'#3a3a34');r(256,42,124,6,'#2a2a24');r(282,62,72,36,'#1a1a18');emblem('kmt',314,50);
  bigPlane(170,96,2);drawSoldier(214,110,{fac:'kmt',face:-1,emo:(t>>5)%2?'grit':'determined',gun:null});
  drawSoldier(36,110,{fac:'kmt',face:1,emo:'smug',officer:1,gun:null,item:'case'});
  const n=Math.min(8,(t/18|0));for(let i=0;i<n;i++){const x=62+(i%4)*12,y=102-(i>>2)*8;r(x,y,11,8,'#8a7a5a');r(x+3,y-2,5,2,'#6a5a3a');r(x+4,y+3,3,2,'#d9a441')}
  enSign('RECRUITING · PAY BY THE HOUR',120,18)},
 t=>{enSky('#7d93b0','#dfe6ee');r(0,100,W,36,'#dfe6ee');r(0,100,W,2,'#ffffff');r(250,40,124,60,'#4a5a6a');r(244,36,136,6,'#3a4a5a');r(270,56,84,44,'#2a3440');
  bigPlane(180,90,2);const p=Math.min(1,t/140);if(p>.3){r(190,86,6,6,'#b8322a');r(192,88,2,2,'#f1d27a')}r(160-2,88,Math.round(30*p),2,'#b8322a');
  drawSoldier(214,114,{fac:'ccp',face:-1,emo:'smug',gun:null});seg(214,98,198+Math.sin(t/6)*3,90,2,'#7a5232');r(232,106,8,8,'#b8322a');r(232,106,8,2,'#7a1a14');
  drawSoldier(112,114,{fac:'kmt',face:1,emo:(t>>5)%2?'scared':'normal',gun:null});if(t>60)drawBubble('SAME PLANE, NEW PAINT',120,80);
  for(let i=0;i<40;i++)r((i*37+t*.3)%W,(i*23+t*.6)%136,1,1,'#ffffff');enSign('PEACEFUL REORGANIZATION',196,26,'#e9dcc2',0)},
 t=>{sceneArt('boats',t);plane(40+((t*.8)%340),26+Math.sin(t/20)*4);enSign('IMPASSABLE BARRIER',90,46,'#e9dcc2',1)},
 t=>{sceneArt('bankrun',Math.min(t,420));enSign('SHANGHAI WILL HOLD!',96,60,'#e9dcc2',0);plane(((t*.9)%(W+60))-30,8+Math.sin(t/15)*2)},
 t=>{enSky('#0b0e20','#3a2a4a');stars(40,80);cityline(t);const ax=236+Math.sin(t/40)*6,ay=48;
  for(let i=0;i<34;i++){const x=ax-60+((i*29)%120)+Math.sin((t+i*20)/12)*4,y=ay+30+((t*.7+i*17)%100);r(x,y,6,Math.max(1,Math.abs(Math.sin((t+i*9)/8))*3|0),i%2?'#8aa070':'#b0a070')}
  printerShip(ax,ay,0);plane(30+((t*.6)%140),96+Math.sin(t/18)*5)},
 t=>{enSky('#070a18','#3a4a7a');stars(30,70);enSea(t,92);const gx=320-((t*.25)%40);r(gx-4,88,40,6,'#2a2222');r(gx,82,30,6,'#3a3030');for(let i=0;i<3;i++)enGold(gx+i*10-2,86);enSign('1ST CLASS',gx+14,64,'#ffd24a',0);
  enShip(110,122,t);plane(70+Math.sin(t/30)*20,48+Math.sin(t/20)*4);r(20,108,14,18,'#b8322a');r(23,104,8,4,'#7a1a14');tinyPx('¥',27,114,'#ffd24a','center');enSign('ONE WAY',40,22,'#e9dcc2',0)}];
function brief(i){const s=STAGES[i];LV=i;st=i;music('ending');
 startPages([{date:()=>ZK(s,'date'),place:()=>ZK(s,'place'),title:()=>LZ('STAGE '+(i+1)+' · ','第 '+(i+1)+' 關 · ')+ZK(s,'title'),art:STORY_ART[i],fact:()=>ZK(s,'fact'),joke:()=>ZK(s,'joke')}],()=>startStage(i))}
/* the ending: you won the sky; history sends you to Taiwan (temporarily) */
function mapArt(t){r(0,0,W,136,'#3a3024');r(0,104,W,32,'#2a2018');r(56,6,272,124,'#d8ccb0');r(56,6,272,2,'#a8977c');
 const RW=[[14,24],[10,27],[4,28],[2,27],[1,26],[2,25],[3,25],[5,24],[7,24],[8,23],[9,22],[11,21],[13,20],[15,18]],x0=72,y0=14,k=t/18;
 RW.forEach(([a,b],row)=>{for(let c=a;c<=b;c++){const red=row+(28-c)*.12<k;r(x0+c*8,y0+row*8,8,8,red?'#b8322a':'#8a9a6a');if(!red&&(c+row)%2)r(x0+c*8+3,y0+row*8+3,2,2,'#7a8a5a')}});
 r(x0+23*8,y0+11*8+2,5,12,'#2f4f8a');r(x0+23*8+1,y0+11*8+4,2,2,'#f2f2f2');
 if(k>2)for(let i=0;i<3;i++){const ax=x0+60+i*50,ay=y0+10+i*6,L_=Math.min(40,(k-2)*14);seg(ax,ay,ax+L_*.6,ay+L_,3,'#7a1a14');if(L_>=40){r(ax+L_*.6-4,ay+L_-2,8,4,'#7a1a14')}}
 enSign('HQ SITUATION MAP',192,112,'#e9dcc2',0);drawSoldier(14,128,{fac:'kmt',face:1,emo:'smug',officer:1,gun:null});seg(30,108,70,70,1,'#8a6a3a');if(t>90)drawBubble('ALL ACCORDING TO PLAN.',40,70)}
function flightArt(t){enSky('#3a4a7a','#f0c080',90);enSea(t,90);enIsland(300-Math.min(60,t*.15),96,1);for(let i=0;i<3;i++)enGold(316+i*17-Math.min(60,t*.15),90);
 const tt=Math.min(t,520),gl=Math.min(1,tt/260),px=50+tt*.35,py=34+gl*44;plane(px,py+Math.sin(t/25)*2);if(T%30<15&&t>60)tiny('SPUTTER',px-14,py-16,'#ff9a6a','center');
 r(8,26,84,14,'#120d0c');tiny('FUEL',12,30,'#a8977c');r(54,29,34,7,'#3a1410');r(55,30,Math.max(1,32-t/8),5,T%30<15?'#ff5a3a':'#ffd24a');if(t>200)tiny('PAID IN ¥',10,45,'#ff9a6a')}
function taipeiArt(t){enSky('#4a6a90','#e0a070',96);enSea(t,96);r(0,98,W,38,'#4a5a3a');r(0,112,W,10,'#5a5650');for(let i=0;i<W;i+=24)r(i,116,12,2,'#e9dcc2');
 plane(110,104);r(210,72,70,40,'#8a7a5a');r(206,68,78,6,'#5a3a2a');enSign('TEMPORARY HQ',245,48);
 for(let i=0;i<3;i++)enGold(290+i*17,112);drawSoldier(310,98,{fac:'kmt',face:-1,emo:'smug',officer:1,item:'case',gun:null});
 drawSoldier(150,112,{fac:'kmt',face:1,emo:(t>>5)%2?'cry':'normal',gun:null});if(t>40)drawBubble('MY FEE?',158,74);
 if(t>80){const f=Math.min(1,(t-80)/60);r(52,112-8*f,10,8*f,'#5a3a2a');for(let i=0;i<3;i++)r(53+i*3,104-8*f-((t+i*7)%12),2,2,i%2?'#ff8a1a':'#8aa070')}}
function briefingArt(t){r(0,0,W,136,'#3a3024');r(0,104,W,32,'#2a2018');for(let i=0;i<W;i+=32)r(i,104,1,32,'#1e1812');
 r(70,14,200,74,'#26342a');r(66,10,208,4,'#5a3a20');r(66,88,208,4,'#5a3a20');
 txt('COUNTERATTACK',170,20,'#e9e4d0','center');txt('THE MAINLAND',170,33,'#e9e4d0','center');txt('WHEN: NEXT YEAR',170,52,'#ffd24a','center');seg(110,74,230,66,2,'#e9e4d0');r(226,62,8,8,'#e9e4d0');
 const yr=1950+Math.min(76,Math.floor(t/45));r(292,20,56,50,'#e9dcc2');r(292,20,56,10,'#b8322a');stxt(String(yr),320,46,'#120d0c',14);if(t%45<6)r(292,30+(t%45)*6,56,4,'#c8b890');
 drawSoldier(40,104,{fac:'kmt',face:1,emo:'determined',officer:1,gun:null});seg(56,84,96,60,1,'#8a6a3a');
 for(let i=0;i<4;i++)drawHead(110+i*44,128,'kmt',(t>>6)%2&&i===2?'sleep':'normal',1)}
function victoryArt(t){enSky('#2a3a6a','#e0a070');for(let i=0;i<6;i++)cloud(((i*90-t*.6)%(W+120)+W+120)%(W+120)-80,100+(i%3)*10,70,'#e8c8c0','#fff8f0');
 const y=60+Math.sin(t/30)*6;bigPlane(170,y,3);const n=Math.min(6,(t/26|0));for(let i=0;i<n;i++){r(137+i*7,y+12,5,5,'#b8322a');r(138+i*7,y+13,3,3,'#f1d27a')}
 if(n===6&&t>170)tiny(LZ('6/6','6／6'),158,y+22,'#ffd24a','center')}
const CREDITS_EN=[['SKY OF GOLD YUAN 1949'],['PILOT','YOU (CONTRACT RENEWED YEARLY)'],['AIRCRAFT','ONE BIPLANE (BORROWED)'],['PAYROLL','GOLD YUAN (DECORATIVE)'],['FUEL','ALSO GOLD YUAN (FLAMMABLE)'],['STRATEGY','HQ (ADDRESS CHANGES WEEKLY)'],['VILLAIN','THE PRINTER (STILL RUNNING)'],['FINANCIAL ADVICE','A SEAGULL'],['NEUTRAL OBSERVER','A DONKEY'],['FIRST TO LEAVE','THE GOLD'],['RETURN FLIGHT','NEXT YEAR']];
const CREDITS_ZH=[['金圓長空 1949'],['飛行員','你（合約每年續簽）'],['飛機','雙翼機一架（借的）'],['薪水','金圓券（僅供裝飾）'],['燃料','也是金圓券（易燃）'],['戰略指導','總部（地址每週更新）'],['反派','印鈔機（仍在運轉）'],['理財顧問','一隻海鷗'],['中立觀察員','一頭驢子'],['最先撤離','黃金'],['回程班機','明年']];
function drawCredits(t){enSky('#05060f','#141a34',H);stars(40,90);enSea(t,170,H);plane(W-40-((t*.3)%(W+40)),150+Math.sin(t/20)*3);ctx.drawImage(VIG,0,0);
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
function endingPages(){const c=continues+1,k=RUN.kills;return[
 {date:()=>LZ('DECEMBER 1949','1949年12月'),place:()=>LZ('ABOVE THE TAIWAN STRAIT','台灣海峽上空'),title:()=>LZ('SIX FOR SIX','六戰六勝'),art:victoryArt,
  fact:()=>LZ('Train, bomber, gunboat, flak tower, the Printer\'s airship, the cruiser: six for six. Your record in the air is perfect.','裝甲列車、轟炸機、砲艇、高射砲塔、印鈔機飛艇、巡洋艦：六戰六勝。你在天上的戰績完美無缺。'),
  joke:()=>LZ('HQ sends congratulations by telegram, collect. From Canton. No, Chongqing. No, Chengdu. Hold on.','總部發來賀電，收件人付費。發自廣州。不對，重慶。不對，成都。等一下。')},
 {date:()=>LZ('1949','1949年'),place:()=>LZ('MEANWHILE, ON THE GROUND','同一時間，地面上'),title:()=>LZ('MEANWHILE','與此同時'),art:mapArt,
  fact:()=>LZ('Meanwhile, on the ground, everything else was lost. HQ calls it a "strategic transfer". The map calls it red.','同一時間，地面上其他的一切都輸光了。總部稱之為「戰略轉進」，地圖則稱之為紅色。'),
  joke:()=>LZ('Every arrow on the map points south-east. Even the ones we drew.','地圖上每一支箭頭都指向東南方，連我們自己畫的也是。')},
 {date:()=>LZ('DECEMBER 1949','1949年12月'),place:()=>LZ('TAIWAN STRAIT','台灣海峽'),title:()=>LZ('ONE WAY','單程'),art:flightArt,
  fact:()=>LZ('The cruiser sinks. The convoy docks. Now fly to Taiwan. One way. Fuel paid in Gold Yuan.','巡洋艦沉了，船團靠岸了。最後一道命令：飛往台灣。單程。油錢以金圓券支付。'),
  joke:()=>LZ('The rate changed twice while they filled the tank. Half a tank. You glide the last ten miles. The gold is on the runway. It got there first.','加油加到一半，匯率變了兩次，所以你只加到半桶。最後十英里你用滑翔的。黃金已經在跑道上等你了，它先到了。它永遠先到。')},
 {date:()=>LZ('DECEMBER 1949','1949年12月'),place:()=>LZ('TAIPEI · TEMPORARY CAPITAL','台北 · 臨時首都'),title:()=>LZ('TEMPORARY','暫時'),art:taipeiArt,
  fact:()=>LZ('The government relocates to Taipei. It is a temporary relocation. Very temporary. Extremely temporary.','政府遷到台北。這是暫時撤退。非常暫時。極度暫時。'),
  joke:()=>LZ('Your fee is paid in full, in Gold Yuan. The airfield gladly accepts it as fuel. For the stove.','你的酬勞全額付清，用金圓券。機場很樂意收下當燃料：燒爐子用的。')},
 {date:()=>LZ('1950, 1951, 1952...','1950、1951、1952……'),place:()=>LZ('THE BRIEFING ROOM, EVERY YEAR','簡報室，每年'),title:()=>LZ('NEXT YEAR','明年'),art:briefingArt,
  fact:()=>LZ('Every year there is a briefing. Every year the plan is the same: we counterattack the mainland next year.','每年都有一場簡報，每年計畫都一樣：明年就反攻大陸。'),
  joke:()=>LZ('The plan is always on schedule. The schedule is "next year". Your biplane is kept fuelled and ready. With Gold Yuan.','計畫永遠準時，時程永遠是「明年」。你的雙翼機隨時加滿油待命。用金圓券加的。')},
 {credits:1},
 {card:()=>LANG==='zh'?['天空：贏了。大陸：放錯地方了。','過關 6／6 · 擊落魔王 6／6 · 擊落 '+k+' 架','最終分數 ¥'+fmtBig(score)+'（實際價值：一顆蛋）','簽過的合約：'+c+' 份（每年續約）','打贏的內戰：0／1','撤退：暫時。非常暫時。']
  :['THE SKY: WON. THE MAINLAND: MISPLACED.','STAGES 6/6 · BOSSES 6/6 · KILLS '+k,'FINAL SCORE ¥'+fmtBig(score)+' (REAL VALUE: ONE EGG)','CONTRACTS SIGNED: '+c+' (RENEWED YEARLY)','CIVIL WARS WON: 0/1','RELOCATION: TEMPORARY. VERY TEMPORARY.'],
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

/* ---------------- overlays: title + stage select ---------------- */
function hideOv(){$('#title').hidden=true;$('#stages').hidden=true}
function toTitle(){state='title';paused=false;heldK={};touchD=null;$('#stages').hidden=true;$('#title').hidden=false;music('off');L.theme='paddy';L.weather='haze';L.deep=null;LV=0;st=0;BGD=null;CL=null;convoy=null;applyLang(LANG,false);$('#bPlay').focus()}
function openStages(){state='stages';paused=false;heldK={};touchD=null;$('#title').hidden=true;music('off');const box=$('#stageList');box.innerHTML='';const zh=LANG==='zh';
 STAGES.forEach((s,i)=>{const b=document.createElement('button'),lock=i>=SAVE.un,bs=SAVE.best[i];
  b.innerHTML=lock?`<span>${i+1} · ???</span><span class="lk">${zh?'尚未解鎖':'LOCKED'}</span>`:`<span>${i+1} · ${ZK(s,'name')}</span><span class="dt">${ZK(s,'date')} · ${ZK(s,'place')}</span><span class="st">${bs>=0?(zh?'最佳：¥'+fmtBig(bs)+'（已擊落'+ZK(s,'bossName')+'）':'BEST ¥'+fmtBig(bs)+' · BOSS DOWN'):(zh?'尚未完成':'NOT YET FLOWN')}</span>`;
  b.disabled=lock;if(!lock&&i===Math.min(SAVE.un-1,STAGES.length-1)&&!(bs>=0))b.className='here';b.onclick=()=>{initAudio();newGame(i)};box.appendChild(b)});
 $('#bEnd').hidden=!SAVE.won;const done=SAVE.best.filter(b=>b>=0).length;
 $('#stTot').textContent=zh?'完成關卡：'+done+'／6'+(SAVE.won?' · 你已飛抵台灣（暫時）':''):'STAGES CLEARED: '+done+' / 6'+(SAVE.won?' · YOU REACHED TAIWAN (TEMPORARILY)':'');
 resetArm=false;$('#bReset').textContent=zh?'清除存檔':'RESET SAVE';$('#stages').hidden=false;const f=box.querySelector('.here')||box.querySelector('button:not(:disabled)');f&&f.focus()}
function toggleMute(){initAudio();setMute(!muted);store.set(SKEY+'-mute',muted);$('#bSnd').textContent=muted?(LANG==='zh'?'靜音':'MUTE'):(LANG==='zh'?'音效':'SND')}
let resetArm=false;
const ZH_HTML={h1:'金圓長空<span>1949 · 空戰射擊 · 六個關卡</span>',rot:'把手機轉橫，天空比較寬',play:'起飛',cont:'繼續飛行',sth:'飛行日誌',back:'標題',end:'觀看結局',
tb:'金圓<br>炸彈',
 tag:'1948–49年。你開著一架借來的雙翼機替國軍空軍賣命，合約按時計酬，以金圓券支付。共軍在地面上節節勝利，不知怎麼的，連天上也是。六個關卡，從淮海平原一路飛到台灣海峽；上海上空某處，還飄著印鈔機的飛艇，正用鈔票把整個國家埋起來。',
 keys:'WASD／方向鍵 飛行 · J 或空白鍵 射擊（按住）· K 金圓炸彈<br>P 暫停 · L 切換語言 · M 音效',
 fine:'諷刺作品。吃 P 加火力，B 加金圓炸彈，¥ 加分數。分數以金圓券計算，所以主要是裝飾用的。進度自動存檔。'};
const EN_HTML={};document.querySelectorAll('[data-t]').forEach(el=>EN_HTML[el.dataset.t]=el.innerHTML);EN_HTML.cont='CONTINUE';
const KEYS_TOUCH={en:'Phone: drag anywhere to fly (it moves like a trackpad) · guns fire on their own · the round button drops a money bomb<br>Top right: language, pause, sound',
 zh:'手機：在畫面任何地方拖曳來飛行（像觸控板一樣相對移動）· 機槍自動射擊 · 圓形按鈕丟金圓炸彈<br>右上角：語言、暫停、音效'};
function applyLang(l,save){LANG=l==='en'?'en':'zh';const zh=LANG==='zh';if(save)try{localStorage.setItem(LANG_KEY,LANG)}catch(e){}
 document.documentElement.lang=zh?'zh-Hant':'en';document.title=zh?'金圓長空 1949 Sky of Gold Yuan':'Sky of Gold Yuan 1949';
 document.querySelectorAll('[data-t]').forEach(el=>{const k=el.dataset.t;el.innerHTML=zh&&ZH_HTML[k]!=null?ZH_HTML[k]:EN_HTML[k]});
 const any=SAVE.best.some(b=>b>=0);$('#bPlay').innerHTML=any?(zh?ZH_HTML.cont:EN_HTML.cont):(zh?ZH_HTML.play:EN_HTML.play);
 if(touchUI)$('[data-t=keys]').innerHTML=KEYS_TOUCH[LANG];
 document.querySelectorAll('.lang button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.l===LANG)));
 const b=$('#bLang');b.textContent=zh?'EN':'中文';b.lang=zh?'en':'zh-Hant';b.setAttribute('aria-label',zh?'Switch to English':'切換為中文');
 $('#bPause').setAttribute('aria-label',zh?'暫停':'Pause');$('#bSnd').textContent=muted?(zh?'靜音':'MUTE'):(zh?'音效':'SND');$('#bSnd').setAttribute('aria-label',zh?'音效開關':'Toggle sound');
 cv.setAttribute('aria-label',zh?'金圓長空遊戲畫面':'Sky of Gold Yuan game screen');
 if(state==='stages')openStages();
 if(zh&&document.fonts)document.fonts.load(ZF(10),'國軍').catch(()=>{})}
/* ---------------- input ---------------- */
let touchUI=matchMedia('(pointer:coarse)').matches;
const KM={KeyW:'u',ArrowUp:'u',KeyS:'d',ArrowDown:'d',KeyA:'l',ArrowLeft:'l',KeyD:'r',ArrowRight:'r',KeyJ:'f',Space:'f',KeyZ:'f',KeyK:'b',KeyX:'b'};
const ADV=['Enter','Space','KeyJ','KeyZ'];
function toXY(e){const rc=cv.getBoundingClientRect();return[(e.clientX-rc.left)/rc.width*W,(e.clientY-rc.top)/rc.height*H]}
addEventListener('keydown',e=>{if(e.code==='KeyL'&&state!=='title'&&state!=='stages'){applyLang(LANG==='zh'?'en':'zh',true);return}
 if(e.code==='KeyM'&&state!=='title'&&state!=='stages'){toggleMute();return}
 if(state==='stages'){const i=+e.key-1;if(i>=0&&i<STAGES.length&&i<SAVE.un){initAudio();newGame(i)}else if(e.code==='Escape')toTitle();return}
 if(state==='pages'){if(ADV.includes(e.code)&&!e.repeat){e.preventDefault();pageNext()}else if(e.code==='Escape')pageSkip();return}
 if(state==='over'){if(overT>40&&!e.repeat){if(e.code==='Enter'||e.code==='Space'){e.preventDefault();continueGame()}else if(e.code==='Escape'||e.code==='Backspace')toTitle()}return}
 if((state==='intro'||state==='tally')&&!e.repeat&&ADV.includes(e.code)){e.preventDefault();advance();return}
 if(state==='play'&&(e.code==='KeyP'||e.code==='Escape')&&!e.repeat){paused=!paused;heldK={};return}
 if(state==='play'&&paused){if((e.code==='Enter'||e.code==='Space')&&!e.repeat){e.preventDefault();paused=false}return}
 const k=KM[e.code];if(!k||state==='title')return;e.preventDefault();initAudio();if(k==='b'){if(!e.repeat&&state==='play')heldK.b=1}else heldK[k]=1});
addEventListener('keyup',e=>{const k=KM[e.code];if(k&&k!=='b')heldK[k]=0});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='play'){paused=true;heldK={};touchD=null}});
cv.addEventListener('pointerdown',e=>{initAudio();if(e.pointerType==='touch')touchUI=true;else if(e.pointerType==='mouse')touchUI=false;const[x,y]=toXY(e);
 for(const b of btns)if(x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h){b.f();return}
 if(state==='pages'){pageNext();return}if(state==='intro'||state==='tally'){advance();return}});
const tp=$('#touch'),tB=$('#tB');
tp.addEventListener('pointerdown',e=>{initAudio();touchUI=true;if(state!=='play'||paused||!P)return;if(e.target.closest('.tb')){heldK.b=1;tB.classList.add('on');setTimeout(()=>tB.classList.remove('on'),150);return}
 if(touchD)return;touchD={x0:e.clientX,y0:e.clientY,x:e.clientX,y:e.clientY,px:P.x,py:P.y,id:e.pointerId,sc:W/cv.getBoundingClientRect().width};});
tp.addEventListener('pointermove',e=>{if(touchD&&e.pointerId===touchD.id){touchD.x=touchD.x0+(e.clientX-touchD.x0)*touchD.sc;touchD.y=touchD.y0+(e.clientY-touchD.y0)*touchD.sc;
 // keep the finger anchor in sync when the plane hits the screen edge, so reversing direction responds at once
 const nx=touchD.px+(touchD.x-touchD.x0)*1.3,ny=touchD.py+(touchD.y-touchD.y0)*1.3;if(nx!==clamp(nx,10,W-20)){touchD.px=clamp(nx,10,W-20);touchD.x0=touchD.x}if(ny!==clamp(ny,18,GY-6)){touchD.py=clamp(ny,18,GY-6);touchD.y0=touchD.y}}});
const tpUp=e=>{if(touchD&&e.pointerId===touchD.id)touchD=null};tp.addEventListener('pointerup',tpUp);tp.addEventListener('pointercancel',tpUp);
$('#bPlay').onclick=()=>{initAudio();if(!SAVE.best.some(b=>b>=0))newGame(0);else openStages()};
$('#bBack').onclick=toTitle;$('#bEnd').onclick=()=>{initAudio();RUN={kills:RUN.kills||0};ending()};
$('#bReset').onclick=e=>{const b=e.currentTarget,zh=LANG==='zh';if(!resetArm){resetArm=true;b.textContent=zh?'確定？再點一次':'SURE? TAP AGAIN';return}store.set(SKEY,{});SAVE=loadSave();applyLang(LANG,false);openStages()};
document.querySelectorAll('.lang button').forEach(b=>b.addEventListener('click',()=>applyLang(b.dataset.l,true)));
$('#bLang').addEventListener('click',e=>{applyLang(LANG==='zh'?'en':'zh',true);e.currentTarget.blur()});
$('#bPause').addEventListener('click',e=>{initAudio();if(state==='play'){paused=!paused;heldK={};touchD=null}e.currentTarget.blur()});
$('#bSnd').addEventListener('click',e=>{toggleMute();e.currentTarget.blur()});
muted=!!store.get(SKEY+'-mute',false);
applyLang((()=>{try{const v=localStorage.getItem(LANG_KEY);if(v==='en'||v==='zh')return v}catch(e){}return 'zh'})(),false);
function fit(){const vw=innerWidth,vh=innerHeight,s=Math.min(vw/W,vh/H);cv.style.width=Math.floor(W*s)+'px';cv.style.height=Math.floor(H*s)+'px'}
addEventListener('resize',fit);fit();
let last=performance.now(),acc=0,uiKey='';
function loop(nt){acc+=Math.min(100,nt-last);last=nt;while(acc>=16.67){acc-=16.67;update()}render();
 const hud=state!=='title'&&state!=='stages',tch=touchUI&&state==='play'&&!paused,pz=state==='play',k=hud+'|'+tch+'|'+pz;
 if(k!==uiKey){uiKey=k;$('#hud').hidden=!hud;$('#touch').hidden=!tch;$('#bPause').hidden=!pz;if(!tch)touchD=null}requestAnimationFrame(loop)}
(document.fonts?Promise.all([document.fonts.load(F),document.fonts.load(SERIF(20)),document.fonts.load(ZF(10),'國軍'),document.fonts.load(ZF(11),'國軍')]):Promise.resolve()).catch(()=>{}).finally(()=>requestAnimationFrame(loop));
