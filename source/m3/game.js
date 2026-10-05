/* ===================== RATION CRUSH 1949 — a Civil Slug match-3 =====================
   You cook for a Nationalist (KMT) unit on the 1948-49 retreat. 6 chapters x (2 meals + 1 general). */
let T=0,camX=0,S='kmt',EN='ccp',LV=0,skyFlash=0,skyFX=0,state='title';
let plats=[],scorch=[];const L={walls:[60,300],theme:'village',deep:null,weather:null};function groundAt(){return GY}
const VIG=document.createElement('canvas');VIG.width=W;VIG.height=H;{const g=VIG.getContext('2d');const rg=g.createRadialGradient(W/2,H/2,H*.4,W/2,H/2,W*.65);rg.addColorStop(0,'rgba(0,0,0,0)');rg.addColorStop(1,'rgba(6,2,2,.5)');g.fillStyle=rg;g.fillRect(0,0,W,H)}
const SERIF=s=>`900 ${s}px "Noto Serif TC","Songti TC",Georgia,serif`;
const VT='11px VT323, ui-monospace, monospace';
function stxt(s,x,y,c,size,a=1,al='center'){s=tr(s);ctx.font=SERIF(size);ctx.textAlign=al;ctx.textBaseline='middle';ctx.globalAlpha=a;ctx.fillStyle='#000';ctx.fillText(s,x+1,y+2);ctx.fillStyle=c;ctx.fillText(s,x,y);ctx.globalAlpha=1}
/* ---------------- i18n: 繁體中文 (default) / English. Shared helpers are wrapped here, never edited ---------------- */
let LANG='zh';const LANG_KEY='rationcrush.lang';
const ZFAM='"Noto Sans TC","Noto Sans CJK TC","PingFang TC","Microsoft JhengHei","Heiti TC","Source Han Sans TC",sans-serif';
const CJK_RE=/[⺀-鿿豈-﫿＀-￯　-〿]/;
const Z=(en,zh)=>LANG==='zh'?zh:en;
const isZ=s=>CJK_RE.test(String(s));
function zf(font){const m=/(\d+)px/.exec(font||F),p=m?+m[1]:8;return p>=16?`700 16px ${ZFAM}`:`500 11px ${ZFAM}`}
const ZH_UI={
 'THE RETREAT ROUTE':'撤退路線','GENERAL':'將軍','NEW':'還沒開伙','LOCKED':'未解鎖','TAP A CHAPTER, THEN A MEAL':'先點章節，再點一餐','ARROWS PICK - ENTER COOKS':'方向鍵選擇 · ENTER 開伙',
 'MOVES':'步數','N':'北','S':'南',
 'POSTER!':'標語！','LAND REFORM!':'土地改革！','DELICIOUS!':'好吃！','THE ARMY IS PLEASED':'長官很滿意','EXTRA RATIONS!':'加菜！','NOBODY GETS SHOT TODAY':'今天沒人被槍斃',
 'NO MOVES. RESHUFFLING (BY ORDER)':'沒步了。奉命重新洗牌','WOK LOADED!':'炒鍋上船了！','SHELL HIT THE STOVE! -2 MOVES':'砲彈打中爐灶！-2 步','INCOMING!':'砲彈來了！','THE STOVE FREEZES!':'爐灶結冰了！',
 'THE GENERAL ARRIVES':'將軍駕到','THE GENERAL IS FED':'將軍吃飽了','THE UNIT IS FED':'部隊吃飽了','THE GENERAL IS DISPLEASED':'將軍很不高興','THE UNIT IS STILL HUNGRY':'部隊還在餓肚子',
 'THE LAST SHIP IS LOADED.':'最後一班船裝好了。','CONTINUE':'繼續','NEXT MEAL':'下一餐','MAP':'地圖','RETRY':'再煮一次','TAP A BUTTON':'請點按鈕',
 'THE END':'劇終','(TEMPORARILY)':'（暫時的）','TAP TO RETURN':'點一下返回','ENTER TO RETURN':'按 ENTER 返回',
 'TEMPORARY MENU':'暫時菜單','BEEF NOODLES (TEMP.)':'牛肉麵（暫時）','BUNS (TEMP.)':'饅頭（暫時）','TEA (TEMP.)':'熱茶（暫時）','HOMESICK (FREE)':'鄉愁（免費）',
 'CALENDAR':'日曆','COUNTERATTACK:':'反攻大陸：','NEXT YEAR!':'明年！','TEMPORARY HQ':'臨時指揮部','WOK':'炒鍋','FRAGILE':'易碎','TEMPORARY':'暫時',
 'DECEMBER 1949':'1949年12月','THE LAST DOCK':'最後的碼頭','TAIWAN STRAIT':'台灣海峽','THE TEMPORARY KITCHEN':'暫時的廚房','TAIWAN':'台灣','1950, 1951, 1952...':'1950、1951、1952……',
 'INFLATION: 2 PER MOVE':'通膨：每步 2 格','GET WOK TO BOTTOM':'把炒鍋送到最底排','INCOMING':'砲擊'};
const ZH_PREFIX=[['RICE: ¥','米價：¥']];
function tr(s){if(LANG!=='zh')return s;s=String(s);const z=ZH_UI[s];if(z!=null)return z;for(const[a,b]of ZH_PREFIX)if(s.startsWith(a))return b+s.slice(a.length);return s}
function wrapPx(s,maxW){const toks=String(s).match(/[A-Za-z0-9¥$%'’.,!?:\/+\-–—()]+|\s+|[\s\S]/gu)||[];const out=[];let line='';
 for(const tk of toks){const test=line+tk;
  if(line.trim()&&ctx.measureText(test.trimEnd()).width>maxW&&!/^[，。、！？：；）」』…—,.!?)\s]/.test(tk)){out.push(line.trim());line=/^\s+$/.test(tk)?'':tk}else line=test}
 if(line.trim())out.push(line.trim());return out}
function tw(s,font=F){s=tr(String(s));if(!isZ(s))return s.length*(/16px/.test(font)?16:8);ctx.font=zf(font);return Math.ceil(ctx.measureText(s).width)}
function wrapT(s,maxW,font=F){s=tr(s);if(!isZ(s))return wrap(s,Math.max(1,Math.floor(maxW/(/16px/.test(font)?16:8))));ctx.font=zf(font);return wrapPx(s,maxW)}
const isDark=c=>{const m=/^#([0-9a-f]{6})/i.exec(c);if(!m)return false;const v=parseInt(m[1],16);return((v>>16)*.3+((v>>8)&255)*.59+(v&255)*.11)<70};
const _txt=txt;
txt=function(s,x,y,c='#e9dcc2',al='left',font=F){s=tr(String(s));if(!isZ(s)){if(!isDark(c))return _txt(s,x,y,c,al,font);ctx.font=font;ctx.textAlign=al;ctx.textBaseline='top';ctx.fillStyle=c;ctx.fillText(s,x,y);return}
 const big=/16px/.test(font);ctx.font=zf(font);ctx.textAlign=al;ctx.textBaseline='middle';const yy=y+(big?8:4);ctx.fillStyle='#120d0c';
 if(!isDark(c))for(const[a,b]of[[1,1],[-1,0],[1,0],[0,-1],[0,1]])ctx.fillText(s,x+a,yy+b);ctx.fillStyle=c;ctx.fillText(s,x,yy);ctx.textBaseline='top'};
function vtxt(s,x,y,c){s=tr(s);ctx.font=isZ(s)?`500 10px ${ZFAM}`:VT;ctx.textAlign='left';ctx.textBaseline='top';ctx.fillStyle='#000';ctx.fillText(s,x+1,y+1);ctx.fillStyle=c;ctx.fillText(s,x,y)}
const N=8,TS=23,BX=14,BY=16;
function mk(w,h,fn){const c=document.createElement("canvas");c.width=w;c.height=h;const g=c.getContext("2d");g.imageSmoothingEnabled=false;fn(g);return c}
const R=(g,x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h)};
const KINDS=['rice','bun','tea','bullet','millet','yuan'];
const KNAME={rice:'RICE',bun:'BUNS',tea:'TEA',bullet:'BULLETS',millet:'MILLET',yuan:'GOLD YUAN',wok:'THE WOK',crave:'CRAVING'};
/* ---------------- tile art ---------------- */
const ICON={};
function mkIcon(k){return mk(20,20,g=>{const X_=(x,y,w,h,c)=>R(g,x,y,w,h,c);
 if(k==='rice'){X_(3,10,14,7,'#e9e4d8');X_(2,9,16,2,'#c8372d');X_(4,16,12,2,'#a8a090');X_(4,5,12,5,'#ffffff');X_(6,3,8,3,'#f4f0e6');X_(7,4,1,1,'#ccc');X_(11,5,1,1,'#ccc')}
 else if(k==='bun'){X_(3,7,14,10,'#f2e6d0');X_(5,5,10,3,'#f6ecda');X_(8,4,4,2,'#e8d8bc');X_(3,15,14,2,'#d8c8a8');X_(7,8,2,2,'#e0d0b0');X_(11,9,2,2,'#e0d0b0')}
 else if(k==='tea'){X_(4,7,12,10,'#3a7a5a');X_(3,8,14,8,'#3a7a5a');X_(16,9,3,2,'#2a5a42');X_(1,9,3,5,'#2a5a42');X_(7,5,6,2,'#2a5a42');X_(9,3,2,2,'#d9a441');X_(6,10,8,1,'#7ab090')}
 else if(k==='bullet'){for(let i=0;i<3;i++){X_(3+i*5,6,4,11,'#c9a040');X_(3+i*5,4,4,3,'#8a6a3a');X_(4+i*5,3,2,1,'#6a4a2a');X_(3+i*5,15,4,2,'#9a7a30')}}
 else if(k==='millet'){X_(4,6,12,12,'#c9a65a');X_(6,4,8,3,'#b8954a');X_(8,2,4,3,'#9c7c3c');for(let i=0;i<6;i++)X_(6+(i*3)%8,8+(i*5)%8,2,2,'#f1d27a')}
 else if(k==='yuan'){X_(2,5,16,11,'#8aa070');X_(2,5,16,1,'#b0c890');X_(4,7,12,7,'#6a8a5a');g.fillStyle='#d9a441';g.font='bold 10px monospace';g.textAlign='center';g.fillText('¥',10,14);X_(15,6,2,2,'#d9a441')}
 else if(k==='wok'){X_(1,9,18,1,'#6a6a6a');X_(2,10,16,3,'#2a2a2a');X_(3,13,14,2,'#242424');X_(5,15,10,1,'#1a1a1a');X_(17,7,3,2,'#7a5230');X_(0,8,2,2,'#7a5230');X_(4,10,3,1,'#555');
  X_(7,3,2,4,'#e8e8e8');X_(11,2,2,5,'#e8e8e8');X_(8,1,1,2,'#e8e8e8');X_(5,17,10,2,'#d9a441');X_(7,17,6,1,'#ffd24a')}
 else if(k==='ice'){g.globalAlpha=.78;X_(0,0,20,20,'#bfe4ff');g.globalAlpha=1;X_(0,0,20,1,'#ffffff');X_(0,0,1,20,'#ffffff');X_(3,3,6,1,'#ffffff');X_(3,3,1,6,'#ffffff');X_(13,12,4,1,'#ffffff');X_(16,9,1,4,'#ffffff');X_(0,19,20,1,'#7fb0d8');X_(19,0,1,20,'#7fb0d8')}
 else if(k==='tape'){X_(0,8,20,4,'#c8372d');X_(8,0,4,20,'#c8372d');X_(7,7,6,6,'#d9a441')}})}
for(const k of KINDS.concat(['tape','ice','wok']))ICON[k]=mkIcon(k);
/* ---------------- the retreat: 6 chapters, each 2 meals + 1 general ---------------- */
const CHAPTERS=[
 {name:'THE VILLAGE',short:'VILLAGE',theme:'village',date:'AUTUMN 1948',place:'A VILLAGE UP NORTH',music:'m1',
  intro:{fact:'Autumn 1948. The Nationalist army holds the north, mostly on paper. Your unit holds one village, one stove and one very good wok.',joke:'You are the cook. Orders: feed everyone who outranks you. That is everyone.'},
  outro:{fact:'The northern cities fall one after another. The order comes down: withdraw south to the rice country. Temporarily.',joke:'The tax general paid for dinner in Gold Yuan. You used it to light the stove. It burned for almost a second.'}},
 {name:'THE PADDY',short:'PADDY',theme:'paddy',date:'WINTER 1948',place:'THE RICE PADDIES',music:'m2',
  intro:{fact:'Winter 1948. Huge battles on the central plains go badly. Whole armies are surrounded; the lucky ones walk south through the mud.',joke:'The paddies are full of rice. The rice belongs to a farmer. The farmer is holding a hoe and an opinion.'},
  outro:{fact:'The plains are lost. The army falls back to the great river, which it promises to hold forever.',joke:'"Forever" will be defined later, by a committee, after lunch.'}},
 {name:'THE RIVER CROSSING',short:'RIVER',theme:'river',date:'APRIL 1949',place:'THE GREAT RIVER',music:'m4',
  intro:{fact:'April 1949. The Reds cross the Yangtze on a great fleet of junks in a matter of days. The impregnable river line turns out to be a river.',joke:'Your unit crosses too, in the other direction. You row with a ladle.'},
  outro:{fact:'The capital falls. The retreat heads for the hills, and the hills head uphill.',joke:'The bridgehead general reports a "strategic repositioning of lunch."'}},
 {name:'THE SNOWY PASS',short:'PASS',theme:'snow',date:'APRIL 1949',place:'THE MOUNTAIN PASS',music:'m3',
  intro:{fact:'The column takes the mountain road. Nobody packed winter coats, because it is spring.',joke:'It is snowing in April. Even the weather has defected.'},
  outro:{fact:'Over the pass, the road leads to the biggest city in China, the biggest port and the biggest pile of worthless money.',joke:'The quartermaster thaws your tea with a signed order. Paperwork is still the warmest thing in the army.'}},
 {name:'SHANGHAI',short:'SHANGHAI',theme:'city',date:'MAY 1949',place:'SHANGHAI',music:'m5',
  intro:{fact:'May 1949. The garrison swears to hold Shanghai to the last man. The Gold Yuan, launched less than a year ago, is now worth almost nothing.',joke:'A sack of rice costs a sack of banknotes. The banknotes taste worse. You have tried.'},
  outro:{fact:'Shanghai falls in late May, after a defence that was eternal for about two weeks. The road ends at the sea.',joke:'The eternal defender leaves by boat, eternally.'}},
 {name:'THE LAST SHIP',short:'LAST SHIP',theme:'river',date:'AUTUMN 1949',place:'THE LAST PORT',music:'m1',
  intro:{fact:'Autumn 1949. The mainland is lost province by province. The government announces a temporary relocation across the strait, to Taiwan.',joke:'Very temporary. Pack light. Except the wok. The wok is government policy.'},
  outro:{fact:'',joke:''}}];
const BOSSDESC={tax:'EVERY 4 MOVES HE TAXES 3 OF EACH RATION YOU HAVE.',crave:'HE ONLY EATS WHAT HE CRAVES. IT CHANGES EVERY 3 MOVES.',
 shell:'SHELLS LAND. MATCH THEM BEFORE THE FUSE ENDS OR LOSE 2 MOVES.',ice:'EVERY 3 MOVES THINGS FREEZE. MATCH NEXT TO ICE TO THAW IT.',
 yuan:'HYPERINFLATION: 2 ITEMS BECOME GOLD YUAN EVERY MOVE.',wok:'GET THE WOK TO THE BOTTOM ROW 3 TIMES. SHELLS INCOMING.'};
const MEALS=[
 // 1 village
 {name:'A RIFLE PLATOON',moves:20,goal:{rice:18},kinds:5,line:'Rice, please. Our pay is late, and it is in Gold Yuan, so it is also small.'},
 {name:'THE SIGNAL CORPS',moves:20,goal:{millet:20,tea:10},kinds:5,line:'Millet and tea. The radio says we are winning. The radio is ours.'},
 {name:'THE GRAIN-TAX GENERAL',moves:24,goal:{rice:22,bun:18},kinds:5,boss:{rule:'tax',every:4,amt:3,
  win:'Fed and fully taxed. He hands you a receipt worth less than the paper it is on.',lose:'He taxed the soup until only the bowl was left. Then he taxed the bowl.'},
  line:'Excellent rice. I will tax it, then eat it, then tax the eating.'},
 // 2 paddy
 {name:'A WARLORD\'S ESCORT',moves:22,goal:{bun:24,bullet:12},kinds:6,line:'Buns for the men. Bullets for the buns. Do not ask whose side the warlord is on.'},
 {name:'THE ARMY BAND',moves:22,goal:{tea:20,rice:20},kinds:6,tape:6,line:'We play for our supper. The red tape is from our own quartermaster.'},
 {name:'THE FICKLE GENERAL',moves:24,goal:{crave:26},kinds:6,boss:{rule:'crave',every:3,
  win:'He is satisfied. Then he wants something else. Then the Reds arrive and the menu is settled.',lose:'He wanted something you did not make. You will never know what. Neither will he.'},
  line:'I want rice. No, tea. No, rice. Why is this tea? Who approved tea?'},
 // 3 river
 {name:'THE FERRY GUARDS',moves:22,goal:{score:5000},kinds:6,tape:6,line:'We guard the ferry. The ferry is on the other bank. With the Reds.'},
 {name:'A RETREATING BATTALION',moves:24,goal:{bullet:28,millet:18},kinds:6,tape:8,line:'We are not retreating. We are advancing backwards. The Reds are right behind us.'},
 {name:'GENERAL UNDER FIRE',moves:28,goal:{rice:20,tea:20},kinds:6,boss:{rule:'shell',every:3,n:1,fuse:6,
  win:'Served under fire. He eats one bun, then advances. Backwards. Very fast.',lose:'A shell landed in the soup. The soup is now classified.'},
  line:'Dinner at the bridgehead. The shells are seasoning. Serve it hot and serve it fast.'},
 // 4 snowy pass
 {name:'THE MULE TRAIN',moves:22,goal:{millet:24,tea:14},kinds:6,ice:8,line:'The mules want millet. The men want tea. The mules outrank the men.'},
 {name:'THE POLITICAL OFFICER',moves:22,goal:{tea:22,bullet:22,millet:12},kinds:6,tape:10,line:'Your cooking lacks morale. More salt. Also, the Reds are over the pass.'},
 {name:'THE FROZEN GENERAL',moves:26,goal:{tea:24,bun:16},kinds:6,ice:4,boss:{rule:'ice',every:3,n:3,
  win:'Hot tea at minus twenty. He awards you a medal. It freezes to your coat.',lose:'The tea froze in the cup. He eats it like candy and files a complaint.'},
  line:'Tea! Hot tea! Before my moustache freezes to my orders!'},
 // 5 shanghai
 {name:'THE EXCHANGE GUARDS',moves:22,goal:{yuan:22,score:5000},kinds:6,line:'We guard the Gold Yuan. Nobody is trying to steal it. That worries us.'},
 {name:'THE GENERAL\'S MESS',moves:22,goal:{rice:28,bun:28},kinds:6,tape:10,line:'Feed the staff or the general writes your name on a form.'},
 {name:'THE ETERNAL DEFENDER',moves:26,goal:{yuan:36,rice:22},kinds:6,boss:{rule:'yuan',n:2,
  win:'He holds Shanghai through dessert. Then he holds a boat ticket.',lose:'The Gold Yuan took over the kitchen. One bun now costs the entire board.'},
  line:'Shanghai will be held forever! Pack my dinner to go.'},
 // 6 last ship
 {name:'THE LAST GARRISON',moves:25,goal:{score:11000},kinds:6,tape:12,line:'Cook everything. The Reds are at the city gate. The boat leaves at dawn.'},
 {name:'THE WHOLE ARMY',moves:28,goal:{rice:36,bun:36,millet:24},kinds:6,tape:12,line:'Everyone is hungry. Everyone is leaving. Nobody is in charge of the soy sauce.'},
 {name:'THE LAST ADMIRAL',moves:38,goal:{wok:3,score:5000},kinds:6,boss:{rule:'wok',every:5,n:1,fuse:6,
  win:'The wok is aboard. The army is aboard. The general is aboard. The mainland is not.',lose:'The ship sailed without the wok. The ship turned around. Nobody leaves without the wok.'},
  line:'No wok, no departure. I am a sailor, not a cook. Load it, and do not drop it in the sea.'}];
MEALS.forEach((Lv,i)=>{Lv.ch=(i/3)|0;Lv.who='kmt'});
const WEEKS=MEALS;// legacy alias
const ZH_K={rice:'白米',bun:'饅頭',tea:'熱茶',bullet:'子彈',millet:'小米',yuan:'金圓券',wok:'炒鍋',crave:'想吃的'};
const kname=k=>Z(KNAME[k],ZH_K[k]);
const ZH_BOSSDESC={tax:'每 4 步，他就對你收集的每樣口糧各課 3 份稅。',crave:'他只吃他想吃的。口味每 3 步換一次。',
 shell:'砲彈落下！引信燒完前把它消掉，否則 -2 步。',ice:'每 3 步就有東西結冰。在冰旁邊消除可以解凍。',
 yuan:'惡性通膨：每走一步，就有 2 格變成金圓券。',wok:'把炒鍋送到最底排 3 次。小心砲擊。'};
const ZH_CH=[
 {name:'北方的村莊',short:'村莊',date:'1948年秋',place:'北方某村',
  intro:{fact:'1948年秋。國軍控制著華北——至少在紙上是這樣。你的部隊控制著一個村子、一座爐灶，和一口非常好的炒鍋。',joke:'你是伙夫。命令：餵飽每個官階比你高的人。也就是所有人。'},
  outro:{fact:'華北的城市一座接一座失守。上面傳來命令：向南撤到魚米之鄉。暫時的。',joke:'課稅將軍用金圓券付了飯錢。你拿來生火，燒了將近一秒鐘。'}},
 {name:'稻田',short:'稻田',date:'1948年冬',place:'稻田之間',
  intro:{fact:'1948年冬。中原的幾場大會戰打得一塌糊塗。整個兵團被包圍；運氣好的，踩著爛泥往南走。',joke:'稻田裡滿滿都是米。米是農民的。農民手上拿著鋤頭，還有意見。'},
  outro:{fact:'中原丟了。部隊退到長江邊，誓言永遠守住這條江。',joke:'「永遠」的定義，將由一個委員會在午飯後決定。'}},
 {name:'渡江',short:'渡江',date:'1949年4月',place:'長江邊',
  intro:{fact:'1949年4月。共軍乘著大批木帆船，短短幾天就渡過長江。號稱固若金湯的長江防線，原來就只是一條江。',joke:'你的部隊也渡江了，往反方向。你用湯勺划船。'},
  outro:{fact:'首都失守。撤退部隊往山區走，山路一路往上。',joke:'砲火下的將軍呈報：「午餐已完成戰略性轉進。」'}},
 {name:'雪山隘口',short:'隘口',date:'1949年4月',place:'山間隘口',
  intro:{fact:'部隊改走山路。沒人帶冬衣，因為現在是春天。',joke:'四月下雪。連天氣都投共了。'},
  outro:{fact:'翻過隘口，路通往全中國最大的城市、最大的港口，和最大一堆不值錢的鈔票。',joke:'軍需官拿一份蓋了章的公文幫你解凍熱茶。公文依然是全軍最保暖的東西。'}},
 {name:'上海',short:'上海',date:'1949年5月',place:'上海',
  intro:{fact:'1949年5月。守軍發誓死守上海到最後一兵一卒。不到一年前才發行的金圓券，現在幾乎一文不值。',joke:'一袋米要一袋鈔票。鈔票比較難吃。你試過了。'},
  outro:{fact:'上海在五月底失守，那場「永恆」的保衛戰大約打了兩個星期。路走到了海邊。',joke:'永恆的守護者搭船離開了，永恆地。'}},
 {name:'最後一班船',short:'最後的船',date:'1949年秋',place:'最後的港口',
  intro:{fact:'1949年秋。大陸一省接一省失守。政府宣布「暫時」遷往海峽對岸的台灣。',joke:'非常暫時。行李輕便就好。炒鍋除外。炒鍋是國家政策。'},outro:{fact:'',joke:''}}];
const ZH_LV=[
 ['步兵排','請給我們白飯。薪餉遲發了，發的又是金圓券，所以也很少。'],
 ['通信連','小米跟熱茶。收音機說我們打贏了。收音機是我們的。'],
 ['課稅將軍','好米！我先課稅，再吃掉，然後對吃這件事再課一次稅。','吃飽了，稅也課完了。他開給你一張收據，價值比紙還低。','他把湯課稅課到只剩碗。然後連碗也課了。'],
 ['軍閥的衛隊','饅頭給弟兄們，子彈給饅頭。別問軍閥站哪一邊。'],
 ['軍樂隊','我們演奏換晚餐。這些繁文縟節是我們自己的軍需官搞的。'],
 ['善變將軍','我要白飯。不，要茶。不，白飯。怎麼是茶？誰批准的茶？','他滿意了。接著又想吃別的。然後共軍到了，菜單就定案了。','他想吃的你沒做。你永遠不會知道是什麼。他也不知道。'],
 ['渡口守衛','我們負責守渡口。渡船在對岸。跟共軍在一起。'],
 ['撤退的營','我們沒有撤退，我們是向後前進。共軍就在後面。'],
 ['砲火下的將軍','在灘頭吃晚餐。砲彈就當調味料。趁熱上菜，上快一點。','冒著砲火上菜。他吃了一個饅頭，然後前進——向後，非常快。','一發砲彈掉進湯裡。這碗湯現在列為機密。'],
 ['騾隊','騾子要小米，弟兄要熱茶。騾子官階比較高。'],
 ['政工官','你的菜缺乏士氣。多放點鹽。還有，共軍已經翻過隘口了。'],
 ['冰凍將軍','熱茶！快上熱茶！趁我的鬍子還沒凍在命令上！','零下二十度的熱茶。他頒給你一枚勳章。勳章凍在你的大衣上。','茶在杯子裡結冰了。他當冰棒吃，然後寫了一份申訴。'],
 ['兌換所衛兵','我們看守金圓券。沒有人想偷。這讓我們很擔心。'],
 ['將軍的伙房','把參謀們餵飽，不然將軍會把你的名字寫進表格裡。'],
 ['永恆的守護者','上海要永遠守住！把我的晚餐打包帶走。','他守住上海直到吃完甜點。然後守住一張船票。','金圓券佔領了整個廚房。一個饅頭現在要整個盤面。'],
 ['最後的守軍','什麼都煮。共軍到城門了。船天亮就開。'],
 ['全軍','每個人都餓。每個人都要走。沒人負責醬油。'],
 ['最後的艦長','沒有炒鍋，不開船。我是水兵，不是廚子。把鍋搬上來，別掉進海裡。','炒鍋上船了。部隊上船了。將軍上船了。大陸沒上船。','船沒帶炒鍋就開走了。船又掉頭回來。沒有炒鍋，誰也別想走。']];
const lvName=i=>Z(MEALS[i].name,ZH_LV[i][0]),lvLine=i=>Z(MEALS[i].line,ZH_LV[i][1]);
const bossMsg=(i,w)=>Z(w?MEALS[i].boss.win:MEALS[i].boss.lose,ZH_LV[i][w?2:3]);
const chT=(c,k)=>LANG==='zh'?ZH_CH[c][k]:CHAPTERS[c][k];
const chName=c=>Z('CHAPTER '+(c+1)+': '+CHAPTERS[c].name,'第'+(c+1)+'章：'+ZH_CH[c].name);
/* ---------------- state ---------------- */
let B=[],lvl=0,moves=0,score=0,got={},yuanVal=100,sel=null,drag=null,anim=[],busy=0,fx=[],pops=[],combo=0,emo='normal',result=null,G=null,hint=null,idle=0;
let mv=0,tickedAt=0,crave=null,lvT=0;
const SAVEK='rationcrush.v2';
const getSv=()=>{const s=store.get(SAVEK,{});return s&&typeof s==='object'?s:{}};
const bossOf=()=>MEALS[lvl].boss;
const hasRule=k=>{const b=bossOf();return!!b&&(b.rule===k||(k==='shell'&&b.rule==='wok'))};
function startLevel(i){lvl=i;const Lv=MEALS[i],C=CHAPTERS[Lv.ch];moves=Lv.moves;score=0;got={};yuanVal=100;combo=0;result=null;sel=null;fx=[];pops=[];mv=0;tickedAt=0;lvT=0;busy=0;banner=null;
 L.theme=C.theme;LV=i;BGD=null;buildBG();
 do{B=[];for(let y=0;y<N;y++){B.push([]);for(let x=0;x<N;x++){let k;do{k=KINDS[(rnd()*Lv.kinds)|0]}while((x>1&&B[y][x-1].k===k&&B[y][x-2].k===k)||(y>1&&B[y-1][x].k===k&&B[y-2][x].k===k));B[y].push({k,sp:null,oy:-(N-y)*TS-20,ox:0,tape:0})}}
  for(const[cnt,kind]of[[Lv.tape||0,1],[Lv.ice||0,2]]){let n=cnt;while(n>0){const x=(rnd()*N)|0,y=3+((rnd()*(N-3))|0);if(!B[y][x].tape){B[y][x].tape=kind;n--}}}}while(!anyMove());
 if(Lv.goal.wok){const x=(rnd()*N)|0;B[2][x].k='wok';B[2][x].sp=null;B[2][x].tape=0}
 if(hasRule('crave'))newCrave();else crave=null;
 state='play';$('#title').hidden=true;$('#hud').hidden=false;$('#bPause').hidden=false;
 music(Lv.boss?(i===MEALS.length-1?'final':'boss'):C.music);emo='normal'}
function newCrave(){const ks=KINDS.slice(0,MEALS[lvl].kinds).filter(k=>k!==crave);crave=ks[(rnd()*ks.length)|0]}
const inB=(x,y)=>x>=0&&y>=0&&x<N&&y<N;
function findMatches(){const m=new Set(),runs=[];
 for(let y=0;y<N;y++){let x=0;while(x<N){let e=x;while(e+1<N&&B[y][e+1].k===B[y][x].k)e++;if(e-x>=2&&B[y][x].k!=='wok'){runs.push({cells:[...Array(e-x+1)].map((_,i)=>[x+i,y]),dir:'h'});for(let i=x;i<=e;i++)m.add(i+','+y)}x=e+1}}
 for(let x=0;x<N;x++){let y=0;while(y<N){let e=y;while(e+1<N&&B[e+1][x].k===B[y][x].k)e++;if(e-y>=2&&B[y][x].k!=='wok'){runs.push({cells:[...Array(e-y+1)].map((_,i)=>[x,y+i]),dir:'v'});for(let i=y;i<=e;i++)m.add(x+','+i)}y=e+1}}
 return{m,runs}}
function anyMove(){for(let y=0;y<N;y++)for(let x=0;x<N;x++)for(const[dx,dy]of[[1,0],[0,1]]){const x2=x+dx,y2=y+dy;if(!inB(x2,y2)||B[y][x].tape||B[y2][x2].tape)continue;swapRaw(x,y,x2,y2);const ok=findMatches().m.size>0;swapRaw(x,y,x2,y2);if(ok){hint=[x,y,x2,y2];return true}}return false}
function swapRaw(x1,y1,x2,y2){const t=B[y1][x1];B[y1][x1]=B[y2][x2];B[y2][x2]=t}
function trySwap(x1,y1,x2,y2){if(busy||state!=='play'||!inB(x2,y2)||Math.abs(x1-x2)+Math.abs(y1-y2)!==1)return;const a=B[y1][x1],b=B[y2][x2];if(a.tape||b.tape){SFX.clang();return}
 idle=0;// special combos
 if((a.sp==='reform'&&b.k!=='wok')||(b.sp==='reform'&&a.k!=='wok')){const o=a.sp==='reform'?b:a,me=a.sp==='reform'?a:b;swapRaw(x1,y1,x2,y2);useMove();combo=0;busy=1;const kill=new Set();for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(B[y][x].k===o.k||B[y][x]===me)kill.add(x+','+y);bannerS('LAND REFORM!');clearSet(kill);return}
 swapRaw(x1,y1,x2,y2);const m=findMatches();if(!m.m.size){swapRaw(x1,y1,x2,y2);a.ox=(x2-x1)*TS*.4;a.oy=(y2-y1)*TS*.4;b.ox=(x1-x2)*TS*.4;b.oy=(y1-y2)*TS*.4;X.bad();return}
 a.ox=(x1-x2)*TS;a.oy=(y1-y2)*TS;b.ox=(x2-x1)*TS;b.oy=(y2-y1)*TS;useMove();combo=0;busy=1;resolve([x2,y2],[x1,y1])}
function useMove(){moves--;mv++;yuanVal=Math.max(5,Math.round(yuanVal*.9))}
function resolve(p1,p2){setTimeout(()=>{const{m,runs}=findMatches();if(!m.size){busy=0;afterSettle();return}combo++;
 const keep=new Map();// specials: 5 = reform, L/T = grenade, 4 = poster
 const cellRuns={};for(const r_ of runs)for(const[x,y]of r_.cells)(cellRuns[x+','+y]=cellRuns[x+','+y]||[]).push(r_);
 const made=new Set();
 for(const r_ of runs){const len=r_.cells.length;let at=r_.cells.find(([x,y])=>(p1&&x===p1[0]&&y===p1[1])||(p2&&x===p2[0]&&y===p2[1]))||r_.cells[len>>1];const key=at.join(',');if(made.has(key))continue;
  const cross=r_.cells.find(([x,y])=>cellRuns[x+','+y].length>1);
  if(len>=5){keep.set(key,'reform');made.add(key)}else if(cross&&!made.has(cross.join(','))){keep.set(cross.join(','),'grenade');made.add(cross.join(','))}else if(len===4){keep.set(key,r_.dir==='h'?'posterV':'posterH');made.add(key)}}
 const kill=new Set(m);for(const k of keep.keys())kill.delete(k);
 for(const[k,sp]of keep){const[x,y]=k.split(',').map(Number);B[y][x].sp=sp;B[y][x].flash=20}
 clearSet(kill,true)},140)}
function clearSet(kill,chain){let pts=0;const queue=[...kill];const done=new Set();
 while(queue.length){const k=queue.pop();if(done.has(k))continue;done.add(k);const[x,y]=k.split(',').map(Number);const c=B[y][x];if(!c)continue;
  if(c.sp==='posterH'){for(let i=0;i<N;i++)queue.push(i+','+y);bannerS('POSTER!')}if(c.sp==='posterV'){for(let i=0;i<N;i++)queue.push(x+','+i);bannerS('POSTER!')}
  if(c.sp==='grenade'){for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(inB(x+dx,y+dy))queue.push((x+dx)+','+(y+dy));SFX.boom();shakeT=8}}
 for(const k of done){const[x,y]=k.split(',').map(Number);const c=B[y][x];if(!c)continue;
  // red tape / ice: adjacent clears unlock
  for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const n=inB(x+dx,y+dy)&&B[y+dy][x+dx];if(n&&n.tape&&!done.has((x+dx)+','+(y+dy))){burst(x+dx,y+dy,n.tape===2?'#bfe4ff':'#c8372d');n.tape=0;pts+=40}}
  if(c.tape){burst(x,y,c.tape===2?'#bfe4ff':'#c8372d');c.tape=0;continue}
  if(c.k==='wok')continue;// the wok is indestructible. it is the only thing in the army that is.
  if(c.fuse){pts+=100;burst(x,y,'#ff8a3a')}
  const v=c.k==='yuan'?Math.round(60*yuanVal/100):60;pts+=v;got[c.k]=(got[c.k]||0)+1;if(crave&&c.k===crave)got.crave=(got.crave||0)+1;burst(x,y,c.k==='yuan'?'#8aa070':'#ffe27a');B[y][x]=null}
 pts=Math.round(pts*(1+combo*.25));score+=pts;if(pts){const c=[...done][0].split(',').map(Number);pops.push({x:BX+c[0]*TS+11,y:BY+c[1]*TS,s:'+'+pts,t:0})}
 X.pop(combo);if(combo>=3){emo='happy';bannerS(pick(['DELICIOUS!','THE ARMY IS PLEASED','EXTRA RATIONS!','NOBODY GETS SHOT TODAY']))}
 gravity();setTimeout(()=>resolve(null,null),260)}
function woksOnBoard(){let n=0;for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(B[y][x]&&B[y][x].k==='wok')n++;return n}
function gravity(){const Lv=MEALS[lvl];const fresh=[];for(let x=0;x<N;x++){let w=N-1;for(let y=N-1;y>=0;y--){const c=B[y][x];if(c){if(w!==y){B[w][x]=c;B[y][x]=null;c.oy=(y-w)*TS}w--}}
 if(w>=0)fresh.push(x);for(let y=w;y>=0;y--)B[y][x]={k:KINDS[(rnd()*Lv.kinds)|0],sp:null,oy:-(w+2)*TS,ox:0,tape:0}}
 if(Lv.goal.wok&&fresh.length&&woksOnBoard()===0&&(got.wok||0)<Lv.goal.wok){const x=fresh[(rnd()*fresh.length)|0];B[0][x].k='wok'}}
function afterSettle(){const Lv=MEALS[lvl];if(state!=='play')return;
 // the wok reaches the bottom row: loaded onto the ship
 for(let x=0;x<N;x++){const c=B[N-1][x];if(c&&c.k==='wok'){B[N-1][x]=null;got.wok=(got.wok||0)+1;score+=500;burst(x,N-1,'#ffd24a');burst(x,N-1,'#ffffff');bannerS('WOK LOADED!');SFX.oneup();busy=1;gravity();resolve(null,null);return}}
 if(goalMet()){win();return}if(moves<=0){lose();return}
 if(ruleTick())return;
 if(moves<=0){lose();return}
 if(!anyMove()){bannerS('NO MOVES. RESHUFFLING (BY ORDER)');shuffle()}emo=moves<5?'scared':'determined'}
/* boss rules: run once per player move, after the board settles */
function ruleTick(){const b=bossOf();if(!b||tickedAt===mv||mv===0)return false;tickedAt=mv;const due=b.every&&mv%b.every===0;let changed=false;
 if(hasRule('shell')){for(let y=0;y<N;y++)for(let x=0;x<N;x++){const c=B[y][x];if(c&&c.fuse>0&&--c.fuse===0){moves=Math.max(0,moves-2);for(let i=0;i<3;i++)burst(x,y,'#ff8a1a');shakeT=12;SFX.boom();emo='scared';bannerS('SHELL HIT THE STOVE! -2 MOVES')}}
  if(due){const cand=[];for(let y=0;y<N;y++)for(let x=0;x<N;x++){const c=B[y][x];if(!c.tape&&!c.fuse&&c.k!=='wok')cand.push(c)}for(let i=0;i<(b.n||1)&&cand.length;i++){const c=cand.splice((rnd()*cand.length)|0,1)[0];c.fuse=b.fuse||5;c.flash=16}SFX.whistle&&SFX.whistle();if(!banner)bannerS('INCOMING!')}}
 if(b.rule==='tax'&&due){let any=false;for(const k in MEALS[lvl].goal)if(KINDS.includes(k)&&got[k]){got[k]=Math.max(0,got[k]-b.amt);any=true}if(any){bannerS(Z('TAXED! -'+b.amt+' EACH','課稅！每樣 -'+b.amt));emo='smug';SFX.clang()}}
 if(b.rule==='crave'&&due){newCrave();bannerS(Z('NOW HE WANTS '+KNAME[crave]+'!','他現在想吃'+ZH_K[crave]+'！'))}
 if(b.rule==='ice'&&due){const cand=[];for(let y=0;y<N;y++)for(let x=0;x<N;x++){const c=B[y][x];if(!c.tape&&c.k!=='wok')cand.push(c)}
  for(let i=0;i<b.n&&cand.length;i++)cand.splice((rnd()*cand.length)|0,1)[0].tape=2;if(!anyMove()){for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(B[y][x].tape===2)B[y][x].tape=0}bannerS('THE STOVE FREEZES!');SFX.clang()}
 if(b.rule==='yuan'){const cand=[];for(let y=0;y<N;y++)for(let x=0;x<N;x++){const c=B[y][x];if(!c.tape&&!c.sp&&c.k!=='yuan'&&c.k!=='wok')cand.push(c)}
  for(let i=0;i<b.n&&cand.length;i++){const c=cand.splice((rnd()*cand.length)|0,1)[0];c.k='yuan';c.flash=12}changed=true}
 if(changed&&findMatches().m.size){busy=1;combo=0;resolve(null,null);return true}
 return false}
function shuffle(){const all=[];for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(!B[y][x].tape)all.push(B[y][x]);let tries=0;do{all.sort(()=>rnd()-.5);let i=0;for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(!B[y][x].tape)B[y][x]=all[i++];if(++tries>60){for(let y=0;y<N;y++)for(let x=0;x<N;x++)B[y][x].tape=0}}while(findMatches().m.size||!anyMove())}
function goalMet(){const g=MEALS[lvl].goal;for(const k in g){if(k==='score'){if(score<g.score)return false}else if((got[k]||0)<g[k])return false}return true}
function win(){result='win';state='end';const sv=getSv();sv.max=Math.max(sv.max||0,lvl+1);sv['s'+lvl]=Math.max(sv['s'+lvl]||0,score);store.set(SAVEK,sv);X.win();emo='happy';music('ending')}
function lose(){result='lose';state='end';emo='smug';X.bad();music('off')}
let banner=null,shakeT=0;function bannerS(s){banner={s,t:0}}
function burst(x,y,c){for(let i=0;i<8;i++)fx.push({x:BX+x*TS+11,y:BY+y*TS+11,vx:(rnd()-.5)*3,vy:(rnd()-.5)*3,l:18,c})}
const X={pop:(c)=>{const t=AC?AC.currentTime:0;tone(500+c*120,700+c*120,.08,'square',.04,t);tone(900+c*150,900+c*150,.06,'triangle',.03,t+.05)},bad:()=>tone(200,120,.15,'square',.04),win:()=>SFX.oneup()};
/* ---------------- update & render ---------------- */
function update(){T++;lvT++;if(state==='ending')endT++;if(banner&&++banner.t>70)banner=null;if(shakeT>0)shakeT--;
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){const c=B[y]&&B[y][x];if(!c)continue;c.ox*=.7;if(Math.abs(c.ox)<.3)c.ox=0;if(c.oy<0||c.oy>0){c.oy+=c.oy<0?Math.max(2.4,-c.oy*.2):-Math.max(2.4,c.oy*.2);if(Math.abs(c.oy)<2.5)c.oy=0}if(c.flash)c.flash--}
 for(const f of fx){f.x+=f.vx;f.y+=f.vy;f.vy+=.1;f.l--}fx=fx.filter(f=>f.l>0);for(const p of pops)p.t++;pops=pops.filter(p=>p.t<40);if(state==='play'&&!busy)idle++}
function drawTile(c,px,py){if(c.tape){ctx.drawImage(ICON[c.k],px+1,py+1);if(c.tape===2)ctx.drawImage(ICON.ice,px+1,py+1);else{ctx.globalAlpha=.8;ctx.drawImage(ICON.tape,px+1,py+1);ctx.globalAlpha=1}return}
 if(c.k==='wok'){ctx.globalAlpha=.3+.15*Math.sin(T/8);r(px,py,22,22,'#ffd24a');ctx.globalAlpha=1}
 ctx.drawImage(ICON[c.k],px+1,py+1);
 if(c.k==='yuan'&&state==='play'){ctx.globalAlpha=1-yuanVal/100*.9;r(px+3,py+6,16,10,'#3a3a2a');ctx.globalAlpha=1}
 if(c.sp){const k=(T>>3)%2;if(c.sp==='posterH'||c.sp==='posterV'){r(px+2,py+2,18,18,'rgba(200,55,45,.35)');if(c.sp==='posterH')r(px+1,py+10,20,2,'#ffd24a');else r(px+10,py+1,2,20,'#ffd24a')}
  else if(c.sp==='grenade'){r(px+14,py+2,5,7,'#3a4030');r(px+16,py+0,2,3,WOOD);if(k)r(px+16,py,2,1,'#ffb04a')}
  else if(c.sp==='reform'){ctx.globalAlpha=.5+k*.3;r(px,py,22,22,'#ffd24a');ctx.globalAlpha=1;ctx.drawImage(ICON[c.k],px+1,py+1);stxt('改',px+11,py+12,'#c8372d',12)}}
 if(c.fuse){const hot=c.fuse<=2&&T%16<8;ctx.strokeStyle=hot?'#ffd24a':'#ff4a2a';ctx.lineWidth=2;ctx.strokeRect(px+1,py+1,20,20);r(px+12,py,10,10,hot?'#ff4a2a':'#2a2420');r(px+16,py-2,2,3,'#ffb04a');txt(String(c.fuse),px+13,py+1,'#ffd24a')}
 if(c.flash&&c.flash%4<2){ctx.globalAlpha=.5;r(px,py,22,22,'#fff');ctx.globalAlpha=1}}
function ruleStatus(){const b=bossOf();if(!b)return[];const n=b.every?b.every-(mv%b.every):0,mv_=n===1?' MOVE':' MOVES';
 const zz=LANG==='zh';switch(b.rule){case 'tax':return[zz?n+' 步後課稅':'TAX IN '+n+mv_];case 'crave':return[zz?n+' 步後換口味':'NEW CRAVING IN '+n];case 'shell':return[zz?n+' 步後砲擊':'SHELLS IN '+n+mv_];case 'ice':return[zz?n+' 步後結冰':'FREEZE IN '+n+mv_];
  case 'yuan':return['INFLATION: 2 PER MOVE'];case 'wok':return['GET WOK TO BOTTOM',zz?n+' 步後砲擊':'SHELLS IN '+n+mv_]}return[]}
function render(){if(state==='ending'){drawEnding();return}camX=(T*.15)%300;if(!BGD)buildBG();drawBG();if(state==='title'){ctx.drawImage(VIG,0,0);return}
 if(state==='levels'){renderLevels();return}
 const Lv=MEALS[lvl],C=CHAPTERS[Lv.ch],b=Lv.boss;ctx.save();if(shakeT)ctx.translate((rnd()-.5)*4,(rnd()-.5)*4);
 ctx.globalAlpha=.85;r(BX-4,BY-4,N*TS+8,N*TS+8,b?'#2a0d0c':'#120d0c');ctx.globalAlpha=1;
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){r(BX+x*TS,BY+y*TS,TS-1,TS-1,(x+y)%2?'#2a201a':'#241a16')}
 if(Lv.goal.wok){r(BX,BY+N*TS,N*TS,3,T%30<15?'#ffd24a':'#d9a441');for(let x=0;x<N;x++)r(BX+x*TS+9,BY+(N-1)*TS+19,4,2,'rgba(255,210,74,.5)')}
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){const c=B[y][x];if(!c)continue;const py=BY+y*TS+c.oy;if(py<BY-TS+4)continue;drawTile(c,BX+x*TS+c.ox,py)}
 if(sel){ctx.strokeStyle='#ffd24a';ctx.lineWidth=2;ctx.strokeRect(BX+sel[0]*TS,BY+sel[1]*TS,TS-1,TS-1)}
 if(hint&&idle>420&&state==='play'&&T%40<20){ctx.strokeStyle='rgba(255,255,255,.6)';ctx.lineWidth=1;ctx.strokeRect(BX+hint[0]*TS,BY+hint[1]*TS,TS-1,TS-1);ctx.strokeRect(BX+hint[2]*TS,BY+hint[3]*TS,TS-1,TS-1)}
 for(const f of fx)r(f.x,f.y,2,2,f.c);for(const p of pops){ctx.globalAlpha=1-p.t/40;txt(p.s,p.x,p.y-p.t*.4,'#ffd24a','center');ctx.globalAlpha=1}ctx.restore();
 // side panel
 const px=BX+N*TS+12,pw=W-px-4;ctx.globalAlpha=.85;r(px-4,4,W-px,H-8,'#120d0c');ctx.globalAlpha=1;if(b)r(px-4,4,W-px,2,'#b3261e');
 {const hd=Z('CH'+(Lv.ch+1)+' '+C.short+' - '+(b?'BOSS':'MEAL '+(lvl%3+1)),'第'+(Lv.ch+1)+'章 '+ZH_CH[Lv.ch].short+' · '+(b?'將軍':'第'+(lvl%3+1)+'餐')),hs=Math.min(1,(pw-52)/tw(hd));ctx.save();ctx.translate(px,8);ctx.scale(hs,1);txt(hd,0,0,b?'#ff6a5a':'#a8977c');ctx.restore()}
 {const nm=lvName(lvl),sx=Math.min(1,pw/tw(nm));ctx.save();ctx.translate(px,19);ctx.scale(sx,1);txt(nm,0,0,'#ffd24a');ctx.restore()}
 txt('MOVES',px,34,'#a8977c');txt(String(moves),px+(LANG==='zh'?32:50),31,moves<5?'#ff6a5a':'#e9dcc2','left',F16);txt(Z('SCORE ','分數 ')+score,px,51,'#e9dcc2');
 let gy=64;for(const k in Lv.goal){if(k==='score'){txt(Z('QUOTA: SCORE ','配額：分數 ')+Lv.goal.score,px,gy,score>=Lv.goal.score?'#9fe0a0':'#e9dcc2');gy+=13;continue}
  const ik=k==='crave'?crave:k;ctx.drawImage(ICON[ik],px,gy-3,13,13);const v=Math.min(got[k]||0,Lv.goal[k]);txt((k==='crave'?Z('CRAVES ','想吃')+kname(crave):kname(k))+' '+v+'/'+Lv.goal[k],px+17,gy,v>=Lv.goal[k]?'#9fe0a0':k==='crave'?'#ffd24a':'#e9dcc2');gy+=13}
 txt(Z('GOLD YUAN ','金圓券幣值 ')+yuanVal+'%',px,gy+1,yuanVal<40?'#ff6a5a':'#8aa070');gy+=13;
 for(const s of ruleStatus()){txt(s,px,gy+1,T%60<45||!b?'#ff8a6a':'#b3261e');gy+=11}
 const sc=b?1.6:1.4;ctx.save();ctx.translate(px+12,H-8);ctx.scale(sc,sc);drawSoldier(-8,0,{fac:'kmt',face:1,emo:b&&state==='play'&&emo!=='scared'&&emo!=='happy'?(T%240<120?'smug':'shout'):emo,gun:b?'pistol':lvl%3===1?null:'rifle',officer:b||Lv.ch>=3?1:0});ctx.restore();
 const zl=LANG==='zh';ctx.font=zl?`500 10px ${ZFAM}`:VT;const ls=wrapPx(zl?'「'+lvLine(lvl)+'」':'"'+Lv.line+'"',W-px-48),lh=zl?12:10,ly=Math.max(gy+2,H-10-ls.length*lh);ls.forEach((l,i)=>vtxt(l,px+38,ly+i*lh,'#c8b89c'));
 if(banner)stxt(banner.s,BX+N*TS/2,BY+N*TS/2,'#ffd24a',14,banner.t<10?banner.t/10:banner.t>55?(70-banner.t)/15:1);
 if(b&&state==='play'&&lvT<200){const a=Math.min(1,lvT/12,(200-lvT)/20);ctx.globalAlpha=a*.9;r(BX-4,BY+52,N*TS+8,80,'#140606');ctx.globalAlpha=a;r(BX-4,BY+52,N*TS+8,2,'#b3261e');r(BX-4,BY+130,N*TS+8,2,'#b3261e');ctx.globalAlpha=1;
  stxt('THE GENERAL ARRIVES',BX+N*TS/2,BY+66,'#ff6a5a',14,a);ctx.globalAlpha=a;(LANG==='zh'?wrapT(ZH_BOSSDESC[b.rule],N*TS-8):wrap(BOSSDESC[b.rule],22)).forEach((l,i)=>txt(l,BX+N*TS/2,BY+80+i*11,'#e9dcc2','center'));ctx.globalAlpha=1}
 if(state==='end')drawEndPanel(Lv);
 ctx.drawImage(VIG,0,0)}
const pick2=a=>a[(lvl*7+score)%a.length];
const WIN_L=['The unit eats, then retreats. Well fed. Still retreating.','Compliments to the cook. Paid in Gold Yuan. Already worth less.','They salute the wok. The wok outranks two of them.','Morale restored for almost an hour. A new record.'];
const LOSE_L=['The men eat their boots. The retreat slows down.','The quartermaster sold the rice. To the Reds. At a discount.','Dinner is cancelled. The Reds have dinner instead.'];
const ZH_WIN=['部隊吃飽了，繼續撤退。吃得很飽，退得很快。','長官誇獎伙夫。賞金用金圓券發，已經貶值了。','大家向炒鍋敬禮。這口鍋的官階比其中兩個人還高。','士氣恢復了將近一小時。創下新紀錄。'];
const ZH_LOSE=['弟兄們開始啃軍靴。撤退速度變慢了。','軍需官把米賣了。賣給共軍。還打折。','晚餐取消。共軍替你把晚餐吃了。'];
let endBtns=[];
function drawEndPanel(Lv){const w=result==='win',b=Lv.boss;r(0,0,W,H,'rgba(8,6,5,.82)');
 stxt(w?(b?'THE GENERAL IS FED':'THE UNIT IS FED'):(b?'THE GENERAL IS DISPLEASED':'THE UNIT IS STILL HUNGRY'),W/2,52,w?'#ffd24a':'#b3261e',19);
 const msg=w?(b?bossMsg(lvl,1):pick2(Z(WIN_L,ZH_WIN))):(b?bossMsg(lvl,0):pick2(Z(LOSE_L,ZH_LOSE)));wrapT(msg,W-32).forEach((l,i)=>txt(l,W/2,76+i*11,'#e9dcc2','center'));
 const sv=getSv();txt(Z('SCORE ','分數 ')+score+(w&&sv['s'+lvl]===score?Z('  (BEST)','（最佳）'):''),W/2,108,'#a8977c','center');
 if(w&&lvl===MEALS.length-1)txt('THE LAST SHIP IS LOADED.',W/2,121,'#ffd24a','center');
 endBtns=w?(b?[{s:'CONTINUE',a:'next'}]:[{s:'NEXT MEAL',a:'next'},{s:'MAP',a:'map'}]):[{s:'RETRY',a:'retry'},{s:'MAP',a:'map'}];
 const bw=104,gap=12,x0=W/2-(endBtns.length*bw+(endBtns.length-1)*gap)/2;
 endBtns.forEach((e,i)=>{e.x=x0+i*(bw+gap);e.y=138;e.w=bw;e.h=24;r(e.x,e.y,e.w,e.h,i?'#17110f':'#1e150c');ctx.strokeStyle=i?'#6e6050':'#d9a441';ctx.lineWidth=2;ctx.strokeRect(e.x+1,e.y+1,e.w-2,e.h-2);txt(e.s,e.x+e.w/2,e.y+8,i?'#e9dcc2':'#d9a441','center')});
 txt(touchUI?'TAP A BUTTON':'ENTER = '+tr(endBtns[0].s)+(endBtns[1]?Z('   ESC = MAP','   ESC = 地圖'):''),W/2,174,'#6e6050','center')}
function endAction(a){if(state!=='end')return;SFX.tally();const Lv=MEALS[lvl];
 if(a==='retry'){startLevel(lvl);return}
 if(a==='map'){toMap(lvl);return}
 // next
 if(result!=='win')return;
 if(lvl===MEALS.length-1){const sv=getSv();sv.ended=(sv.ended||0)+1;store.set(SAVEK,sv);startEnding(cookEnding(),()=>toMap(lvl));return}
 if(Lv.boss){startEnding([storyPage(Lv.ch,'outro')],()=>toMap(lvl+1));return}
 playLevel(lvl+1)}
/* ---------------- the chapter map ---------------- */
let mapSel=0,mapCh=0,mapBtns=[],nodeBtns=[];
const NODE=i=>({x:36+i*62,y:i%2?76:54});
function toMap(i){const sv=getSv(),mx=Math.min(sv.max||0,MEALS.length-1);mapSel=Math.max(0,Math.min(i==null?mx:i,mx));mapCh=(mapSel/3)|0;state='levels';$('#title').hidden=true;$('#hud').hidden=false;$('#bPause').hidden=true;music('m3')}
function playLevel(i){const c=MEALS[i].ch,sv=getSv();sv.seen=sv.seen||[];if(i%3===0&&!sv.seen[c]){sv.seen[c]=1;store.set(SAVEK,sv);startEnding([storyPage(c,'intro')],()=>startLevel(i));return}startLevel(i)}
function nodeIcon(i,x,y,open){const c=open?null:'#3a3028',k=(a)=>c||a;
 if(i===0){r(x-7,y-1,14,7,k('#6a4a32'));r(x-9,y-4,18,3,k('#3a2a20'));r(x-2,y+2,3,4,k('#1a1210'))}
 else if(i===1){r(x-8,y+2,16,4,k('#4a7a78'));for(let j=0;j<4;j++)r(x-7+j*4,y-4+(j%2),1,6,k('#7ab04a'))}
 else if(i===2){for(let j=0;j<3;j++)r(x-8,y-3+j*4,16,1,k('#6a8ab0'));r(x-3,y-6,1,6,k('#2a1e18'));r(x-2,y-6,5,4,k('#b8322a'))}
 else if(i===3){for(let j=0;j<7;j++)r(x-7+j*2,y+5-Math.min(j,6-j)*3,2,Math.min(j,6-j)*3+1,k('#9fb0c4'));r(x-1,y-4,2,2,k('#ffffff'))}
 else if(i===4){r(x-8,y-2,4,8,k('#5a5662'));r(x-3,y-6,5,12,k('#5a5662'));r(x+3,y-1,5,7,k('#5a5662'));r(x-2,y-4,1,1,k('#e0b050'));r(x+4,y+1,1,1,k('#e0b050'))}
 else{r(x-8,y+1,16,4,k('#3a3e46'));r(x-4,y-3,8,4,k('#d8d0bc'));r(x-1,y-7,3,4,k('#2a2a2a'));r(x+5,y-8,1,9,k('#222'));r(x+6,y-8,4,3,k('#2f4f8a'))}}
function renderLevels(){ctx.globalAlpha=.8;r(0,0,W,H,'#0c0908');ctx.globalAlpha=1;stxt('THE RETREAT ROUTE',W/2,12,'#e9dcc2',14);
 const sv=getSv(),mx=sv.max||0;
 r(8,24,W-16,84,'#241a12');r(8,24,W-16,1,'#5a4632');r(8,107,W-16,1,'#5a4632');
 for(let i=0;i<12;i++)r(250+(i*23)%60,96+(i*7)%9,7,1,'#3a5a7a');
 for(let i=0;i<5;i++){const a=NODE(i),b2=NODE(i+1),done=mx>(i+1)*3-1;for(let k=0;k<=1;k+=.07)r(a.x+(b2.x-a.x)*k-1,a.y+(b2.y-a.y)*k-1,2,2,done?'#d9a441':'#4a3a2a')}
 nodeBtns=[];
 CHAPTERS.forEach((C,i)=>{const n=NODE(i),open=i*3<=mx,cleared=mx>i*3+2,sl=i===mapCh;
  if(sl){r(n.x-13,n.y-13,26,26,T%40<20?'#ff8a3a':'#d9a441')}
  r(n.x-11,n.y-11,22,22,open?'#3a2a1c':'#16110e');nodeIcon(i,n.x,n.y,open);
  txt(chT(i,'short'),n.x,i%2?n.y+15:n.y-23,open?(sl?'#ffd24a':'#e9dcc2'):'#4a3e34','center');
  if(cleared){ctx.save();ctx.translate(n.x+9,n.y+7);ctx.rotate(-.2);r(-5,-5,11,11,'#b3261e');r(-4,-4,9,9,'#120d0c');ctx.restore();stxt('撤',n.x+9,n.y+8,'#e0302a',8)}
  if(open)nodeBtns.push({x:n.x-15,y:n.y-15,w:30,h:30,i})});
 {const n=NODE(Math.min(5,(Math.min(mx,17)/3)|0));ctx.save();ctx.translate(n.x-17,n.y+10);ctx.scale(.55,.55);drawSoldier(-8,0,{fac:'kmt',face:1,emo:'determined',gun:null});ctx.restore();endWok(n.x-23,n.y-9)}
 const C=CHAPTERS[mapCh];stxt(chName(mapCh),W/2,118,'#ffd24a',12);txt(chT(mapCh,'date')+Z(' - ',' · ')+chT(mapCh,'place'),W/2,128,'#a8977c','center');
 mapBtns=[];
 for(let j=0;j<3;j++){const i=mapCh*3+j,Lv=MEALS[i],x=12+j*124,y=140,w=112,h=62,open=i<=mx,sl=i===mapSel,best=sv['s'+i];
  r(x,y,w,h,open?'#2a1d14':'#141010');r(x,y,w,2,Lv.boss?'#b3261e':'#2f4f8a');
  if(sl&&open){ctx.strokeStyle=T%40<20?'#ff8a3a':'#d9a441';ctx.lineWidth=2;ctx.strokeRect(x-1,y-1,w+2,h+2)}
  txt(Lv.boss?'GENERAL':Z('MEAL '+(j+1),'第'+(j+1)+'餐'),x+5,y+6,open?(Lv.boss?'#ff6a5a':'#a8977c'):'#4a3e34');
  if(open){wrapT(lvName(i),w-28).forEach((l,k)=>txt(l,x+5,y+19+k*(LANG==='zh'?13:10),'#e9dcc2'));txt(best?Z('BEST ','最佳 ')+best:'NEW',x+5,y+h-12,best?'#9fe0a0':'#d9a441');
   ctx.save();ctx.translate(x+w-14,y+h-4);ctx.scale(.8,.8);drawSoldier(-8,0,{fac:'kmt',face:-1,emo:best?'happy':Lv.boss?'smug':'normal',gun:null,officer:Lv.boss?1:0});ctx.restore();mapBtns.push({x,y,w,h,i})}
  else txt('LOCKED',x+5,y+h-12,'#4a3e34')}
 txt(touchUI?'TAP A CHAPTER, THEN A MEAL':'ARROWS PICK - ENTER COOKS',W/2,206,'#6e6050','center');ctx.drawImage(VIG,0,0)}
function mapMove(d){const mx=Math.min(getSv().max||0,MEALS.length-1);mapSel=Math.max(0,Math.min(mx,mapSel+d));mapCh=(mapSel/3)|0;SFX.tally()}
/* ---------------- story pages & the ending: the retreat to Taiwan, December 1949 (temporary) ---------------- */
let endPages=[],endPg=0,endT=0,endFull=false,endExit=null,endPrev='title';
function startEnding(pages,exit){endPages=pages;endPg=0;endT=0;endFull=false;endExit=exit;endPrev=state;state='ending';$('#bPause').hidden=true;music('ending')}
function endNext(){if(state!=='ending')return;if(!endFull){endT=9999;return}endPg++;endT=0;endFull=false;SFX.tally();if(endPg>=endPages.length){const f=endExit;endExit=null;f&&f()}}
function endSky(a,b){const g=ctx.createLinearGradient(0,0,0,136);g.addColorStop(0,a);g.addColorStop(1,b);ctx.fillStyle=g;ctx.fillRect(0,0,W,136)}
function endSea(t,y0,c1='#2a4a70',c2='#6a8ab0'){r(0,y0,W,136-y0,c1);for(let i=0;i<26;i++)r((i*37+i*i*3+t*.3)%(W+20)-10,y0+3+(i%7)*Math.max(2,(136-y0-4)/7),6+(i%3)*4,1,c2)}
function endShip(x,y,t){y+=Math.round(Math.sin(t/20)*1.5);
 for(let k=0;k<5;k++){const a=((t*.4+k*14)%70);ctx.globalAlpha=.55-a/140;r(x+60-a*.6,y-50-a*.5,6+k,5+k,'#6a6a6a');ctx.globalAlpha=1}
 r(x+30,y-30,50,16,'#d8d0bc');r(x+30,y-30,50,2,'#f0e8d4');for(let i=0;i<5;i++)r(x+34+i*9,y-26,5,4,'#4a5a70');r(x+58,y-46,10,16,'#2a2a2a');r(x+58,y-46,10,3,'#2f4f8a');
 r(x+104,y-48,1,34,'#222');r(x+105,y-48,14,9,'#b8322a');r(x+105,y-48,7,5,'#2f4f8a');r(x+107,y-47,3,3,'#f2f2f2');
 r(x,y-14,120,14,'#3a3e46');r(x+4,y,112,4,'#2a2d33');r(x-6,y-18,10,6,'#3a3e46');r(x+116,y-18,10,6,'#3a3e46');r(x,y-15,120,1,'#6a6e76');
 for(let i=0;i<8;i++)r(x+8+i*14,y-9,3,3,'#1e2026');return y-15}
function endWok(x,y){r(x,y,16,3,'#2a2a2a');r(x+2,y+3,12,2,'#2a2a2a');r(x+4,y+5,8,1,'#1a1a1a');r(x+16,y,6,2,'#5a3a20')}
function marchers(t,y,n,lim=W){for(let i=0;i<n;i++){const x=((i*44+t*.6)%(lim+60))-40;drawSoldier(x,y,{fac:'kmt',face:1,pose:'run',anim:t+i*5,emo:i%2?'scared':'grit',gun:'rifle'})}
 const cx=((n*44+t*.6)%(lim+60))-40;drawSoldier(cx,y,{fac:'kmt',face:1,pose:'run',anim:t,emo:'determined',gun:null});endWok(cx-5,y-31)}
{const _fmtBig=fmtBig;fmtBig=function(n){return n>=1e27||!isFinite(n)?'999OC+':_fmtBig(n)}}
function chArt(c,t){const C=CHAPTERS[c],th=THEMES[C.theme];
 if(c===4){sceneArt('bankrun',t);return}
 endSky(th.sky[0],th.sky[2]);if(th.sun&&c!==3)r(300,28,18,18,th.sun);
 for(let x=0;x<W;x+=4){const h=24+Math.sin(x*.025+c*2)*10+Math.sin(x*.09+c)*4;r(x,96-h,4,h+4,th.m1);if(C.theme==='snow')r(x,96-h,4,2,'#ffffff')}
 if(c===0)for(let i=0;i<5;i++){const x=14+i*78,h=16+(i*7)%10;r(x,98-h,34,h,th.house);r(x-3,98-h-3,40,3,'#1a1216');r(x+14,98-h+5,3,4,'#d9843a');
  if(i%2)for(let k=0;k<6;k++){const py=98-h-8-((t*.35+k*12)%60);ctx.globalAlpha=.45-k*.06;r(x+16+Math.sin((t+k*30)/30)*4,py,4+k,4+k,'#1e1618');ctx.globalAlpha=1}}
 r(0,96,W,40,th.ground);r(0,96,W,2,th.top);
 if(c===1){r(0,104,W,22,'#5d7a78');for(let x=0;x<W;x+=9)r(x,106+(x%27)/3,1,5,'#6a9a3a');r(0,124,W,12,th.ground)}
 if(c===2||c===5){r(0,96,W,26,'#2a4a70');for(let i=0;i<16;i++)r((i*29+t*.3)%W,100+(i%5)*4,8,1,'#6a8ab0');
  if(c===2)for(let i=0;i<7;i++){const x=(i*64-t*.25+W*3)%(W+40)-20;r(x,100,16,3,'#4a3220');r(x+7,86,1,14,'#2a1e18');r(x+8,87,6,8,'#b8322a');r(x+10,89,2,2,'#f1d27a')}
  else endShip(230,116,t);
  r(0,120,W,16,th.ground);r(0,120,W,1,th.top)}
 if(c===3)for(let i=0;i<50;i++)r((i*37+t*.6)%W,(i*23+t*.8)%136,1,1,'#fff');
 marchers(t,130,c===5?3:4,c===5?230:W)}
function storyPage(c,which){return{get date(){return chT(c,'date')},get place(){return which==='intro'?Z('CHAPTER '+(c+1)+': '+CHAPTERS[c].short,'第'+(c+1)+'章：'+ZH_CH[c].short):Z(CHAPTERS[c].short+' - CLEARED',ZH_CH[c].short+' · 撤離完畢')},art:t=>chArt(c,t),get fact(){return chT(c,which).fact},get joke(){return chT(c,which).joke}}}
const pv=v=>typeof v==='function'?v():v;
function drawEnding(){const p=endPages[endPg];if(!p)return;const t=endT;ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
 if(p.card){endSky('#05060f','#1a1f3a');endSea(t,96,'#121a30','#3a4a70');const sx=((t*.35)%(W+180))-150;ctx.save();ctx.translate(Math.round(sx),0);ctx.scale(.6,.6);endShip(0,200,t);ctx.restore();
  r(0,136,W,H-136,'#120d0c');r(0,136,W,2,'#d9a441');
  const a=Math.min(1,t/40),card=pv(p.card);stxt(p.big,W/2,34,'#ffd24a',28,a);stxt(p.small,W/2,62,'#e9dcc2',12,a);
  card.forEach((l,i)=>{if(t>40+i*30)txt(l,W/2,144+i*(LANG==='zh'?14:11),i===card.length-1?'#ff9a6a':'#e9dcc2','center')});
  endFull=t>40+card.length*30;if(endFull&&T%40<26)txt(touchUI?'TAP TO RETURN':'ENTER TO RETURN',W/2,H-12,'#6e6050','center');ctx.drawImage(VIG,0,0);return}
 ctx.save();ctx.beginPath();ctx.rect(0,0,W,136);ctx.clip();p.art(t);ctx.restore();ctx.drawImage(VIG,0,0);
 r(0,136,W,H-136,'#120d0c');r(0,136,W,2,'#d9a441');txt(p.date,8,141,'#d9a441');txt(p.place,W-8,141,'#a8977c','right');const fact=pv(p.fact),joke=pv(p.joke);
 if(isZ(fact+joke)){let sz=12,LH=14,fl,jl;for(;;){ctx.font=`500 ${sz}px ${ZFAM}`;fl=wrapPx(fact,W-16);jl=wrapPx(joke,W-16);if((fl.length+jl.length)*LH+4<=H-152||sz<=10)break;sz--;LH--}
  const shown=Math.floor(t*.7);let n=0;ctx.textAlign='left';ctx.textBaseline='middle';
  fl.forEach((l,i)=>{const v=l.slice(0,Math.max(0,shown-n));n+=l.length;ctx.fillStyle='#e9dcc2';ctx.fillText(v,8,152+i*LH+LH/2)});
  jl.forEach((l,i)=>{const v=l.slice(0,Math.max(0,shown-n));n+=l.length;ctx.fillStyle='#ff9a6a';ctx.fillText(v,8,156+(fl.length+i)*LH+LH/2)});
  ctx.textBaseline='top';endFull=shown>n;if(endFull&&T%40<26)for(let i=0;i<5;i++)r(W-16+i,H-14+i,1,10-2*i,'#d9a441');return}
 const shown=Math.floor(t*1.4),fl=wrap(fact,47),jl=wrap(joke,47);let n=0;ctx.font=F;ctx.textAlign='left';ctx.textBaseline='top';
 fl.forEach((l,i)=>{const v=l.slice(0,Math.max(0,shown-n));n+=l.length+1;ctx.fillStyle='#e9dcc2';ctx.fillText(v,8,153+i*10)});
 jl.forEach((l,i)=>{const v=l.slice(0,Math.max(0,shown-n));n+=l.length+1;ctx.fillStyle='#ff9a6a';ctx.fillText(v,8,155+fl.length*10+i*10)});
 endFull=shown>n;if(endFull&&T%40<26)for(let i=0;i<5;i++)r(W-16+i,H-14+i,1,10-2*i,'#d9a441')}
/* shared last page: the island, where next year is always next year */
const END_ISLAND=(fact,joke)=>({date:'1950, 1951, 1952...',place:'TAIWAN',art:t=>sceneArt('island',t),fact,joke});
function isFinale(){return result==='win'&&lvl===MEALS.length-1}
function kitchenArt(t){r(0,0,W,136,'#4a3a30');for(let x=0;x<W;x+=24)r(x,0,1,100,'#3e3028');
 // the temporary menu
 r(212,10,160,80,'#5a3a20');r(216,14,152,72,'#1e2a22');txt('TEMPORARY MENU',292,18,'#e9dcc2','center');r(224,28,136,1,'#6a7a6a');
 ['BEEF NOODLES (TEMP.)','BUNS (TEMP.)','TEA (TEMP.)','HOMESICK (FREE)'].forEach((s,i)=>txt(s,222,34+i*12,i===3?'#ff9a6a':'#c8d8c0'));
 // the calendar: counterattack next year, every year
 const yr=1950+Math.min(40,(t/45)|0);r(18,10,104,62,'#e9dcc2');r(18,10,104,12,'#b3261e');txt('CALENDAR',70,13,'#f2f2f2','center');stxt(String(yr),70,38,'#120d0c',18);txt('COUNTERATTACK:',70,LANG==='zh'?48:51,'#120d0c','center');txt('NEXT YEAR!',70,LANG==='zh'?61:61,'#b3261e','center');
 if(t%45>38){ctx.globalAlpha=.6;r(18,22,104,50,'#ffffff');ctx.globalAlpha=1}
 // counter, stove, wok (unpacked, temporarily)
 r(0,100,W,36,'#2a1e18');r(0,100,W,3,'#6a4a2a');r(130,84,90,16,'#3a3a3a');r(140,80,24,4,'#1a1a1a');const fl=(t>>2)%3;r(146,94-fl,6,6+fl,'#ff8a1a');
 endWok(138,74);for(let k=0;k<3;k++){const a=(t*.5+k*15)%40;ctx.globalAlpha=.6-a/70;r(146+k*4+Math.sin((t+k*20)/8)*2,70-a,3,3,'#f2f2f2');ctx.globalAlpha=1}
 drawSoldier(176,100,{fac:'kmt',face:-1,emo:'happy',gun:null});r(178,86,12,7,'#f2f2f2');
 // the table, levelled with a wad of Gold Yuan
 r(40,112,70,4,'#7a5230');r(44,116,3,14,'#5a3a20');r(102,116,3,12,'#5a3a20');r(99,128,10,4,'#8aa070');r(100,129,3,1,'#d9a441');
 for(let i=0;i<2;i++)drawSoldier(52+i*30,128,{fac:'kmt',face:1,pose:'sit',emo:i?'cry':'happy',gun:null});
 r(240,104,120,14,'#e9dcc2');txt('TEMPORARY HQ',300,107,'#120d0c','center')}
function cookEnding(){const sv=getSv();let tot=0;for(let i=0;i<MEALS.length;i++)tot+=sv['s'+i]||0;return[
 {date:'DECEMBER 1949',place:'THE LAST DOCK',art:t=>{endSky('#4a3a50','#c07a4a');for(let i=0;i<5;i++){r(i*80+10,70-(i%2)*10,90,30,'#4a4040')}for(let i=0;i<4;i++){const x=40+i*90;r(x,52-(i%2)*10,1,16,'#2a2020');r(x+1,52-(i%2)*10,8,5,'#b8322a')}
   endSea(t,96,'#2a3a58','#5a7aa0');r(0,92,W,10,'#5a4632');for(let x=0;x<W;x+=10)r(x,92,1,10,'#3a2e22');
   r(150,74,46,18,'#7a5a35');r(150,74,46,3,'#9c7a4c');txt('WOK',173,80,'#e9dcc2','center');r(196,62,40,10,'#e9dcc2');txt('FRAGILE',216,63,'#c8372d','center');
   const lift=Math.max(0,20-(t%120)/3);endWok(160,62-lift);drawSoldier(120,92,{fac:'kmt',face:1,emo:'determined',gun:null});r(122,78,12,8,'#f2f2f2');
   for(let i=0;i<3;i++)drawSoldier(260+i*26,92,{fac:'kmt',face:-1,pose:'run',anim:t+i*7,emo:'scared',gun:'rifle'})},
  fact:()=>Z('Six chapters, eighteen meals, six generals, zero mutinies over lunch. Sadly, the war was not decided by lunch. The mainland is lost.','六章、十八餐、六位將軍，午餐時間零兵變。可惜戰爭不是靠午餐決定的。大陸失守了。'),
  joke:()=>Z('The government announces a temporary relocation to Taiwan. Very temporary. The cook packs the wok first. Then the general.','政府宣布暫時遷往台灣。非常暫時。伙夫先打包炒鍋，再打包將軍。')},
 {date:'DECEMBER 1949',place:'TAIWAN STRAIT',art:t=>{endSky('#3a5a80','#f0b070');r(300,36,22,22,'#ffd88a');endSea(t,92);const d=endShip(110,114,t);
   endWok(124,d-8);drawSoldier(110,d,{fac:'kmt',face:1,emo:'happy',gun:null});r(112,d-14,12,7,'#f2f2f2');
   for(let k=0;k<3;k++){const a=(t*.5+k*15)%45;ctx.globalAlpha=.6-a/80;r(128+k*4+Math.sin((t+k*20)/8)*2,d-12-a,3,3,'#f2f2f2');ctx.globalAlpha=1}
   for(let i=0;i<4;i++)drawSoldier(150+i*20+(i>1?40:0),d,{fac:'kmt',face:-1,emo:i%2?'cry':'happy',gun:null})},
  fact:()=>Z('The government retreats across the strait to Taiwan. Soldiers, clerks and cooks cross with whatever they can carry.','政府撤退到海峽對岸的台灣。士兵、文書、伙夫，能帶什麼就帶什麼過海。'),
  joke:()=>Z('Lunch on board: four million Gold Yuan, or one bun. Everyone pays in buns. The Gold Yuan goes overboard and floats. Finally, it holds its value.','船上的午餐：四百萬金圓券，或一個饅頭。大家都用饅頭付。金圓券被丟進海裡，居然浮起來了——它終於保值了。')},
 {date:'1950',place:'THE TEMPORARY KITCHEN',art:kitchenArt,
  fact:()=>Z('The government settles in Taipei, temporarily. The kitchen is temporary. The menu is temporary. The chairs are bolted down, temporarily.','政府在台北落腳，暫時的。廚房是暫時的，菜單是暫時的，椅子也暫時用螺絲鎖在地上。'),
  joke:()=>Z('The last Gold Yuan note finally finds a job: it holds up the short leg of the mess table. Best investment of the war.','最後一張金圓券終於找到工作：墊在餐桌短掉的那隻腳下面。整場戰爭最好的投資。')},
 END_ISLAND(()=>Z('Official plan: counterattack the mainland next year. Every year it is announced again, with total confidence, for next year.','官方計畫：明年反攻大陸。每年都會重新宣布一次，信心滿滿，目標永遠是：明年。'),
  ()=>Z('The cook keeps the wok packed, just in case. He unpacks it only once, to invent beef noodle soup. Strictly temporary.','伙夫把炒鍋一直打包著，以防萬一。他只拆開過一次，發明了牛肉麵。純屬暫時。')),
 {card:()=>Z(['SIX CHAPTERS. EIGHTEEN MEALS. ONE WOK.','THE ARMY: FED. THE WAR: LOST.','TOTAL SCORE '+tot+' (IN GOLD YUAN: 0)','COUNTERATTACK: NEXT YEAR. (EVERY YEAR.)'],['六章。十八餐。一口炒鍋。','部隊：吃飽了。戰爭：輸了。','總分 '+tot+'（換成金圓券：0）','反攻大陸：明年。（每年都是明年。）']),big:'THE END',small:'(TEMPORARILY)'}]}
/* ---------------- input ---------------- */
let touchUI=matchMedia('(pointer:coarse)').matches;addEventListener('touchstart',()=>{touchUI=true},{passive:true});
const hit=(b,p)=>p.x>=b.x&&p.x<=b.x+b.w&&p.y>=b.y&&p.y<=b.y+b.h;
function cellAt(e){const rc=cv.getBoundingClientRect(),x=(e.clientX-rc.left)/rc.width*W,y=(e.clientY-rc.top)/rc.height*H;return{x,y,cx:Math.floor((x-BX)/TS),cy:Math.floor((y-BY)/TS)}}
cv.addEventListener('pointerdown',e=>{initAudio();const p=cellAt(e);
 if(state==='levels'){for(const b of mapBtns)if(hit(b,p)){if(mapSel===b.i||touchUI||e.pointerType!=='keyboard'){mapSel=b.i;playLevel(b.i)}return}
  for(const b of nodeBtns)if(hit(b,p)){const mx=Math.min(getSv().max||0,MEALS.length-1);mapCh=b.i;mapSel=Math.min(mx,b.i*3+2);SFX.tally();return}return}
 if(state==='ending'){endNext();return}
 if(state==='end'){for(const b of endBtns)if(hit(b,p)){endAction(b.a);return}return}
 if(state!=='play'||busy)return;if(!inB(p.cx,p.cy))return;
 if(sel&&Math.abs(sel[0]-p.cx)+Math.abs(sel[1]-p.cy)===1){trySwap(sel[0],sel[1],p.cx,p.cy);sel=null;return}
 sel=[p.cx,p.cy];drag={x:p.x,y:p.y,cx:p.cx,cy:p.cy};SFX.tally()});
cv.addEventListener('pointermove',e=>{if(!drag)return;const p=cellAt(e);const dx=p.x-drag.x,dy=p.y-drag.y;if(Math.hypot(dx,dy)>TS*.45){const sx=Math.abs(dx)>Math.abs(dy)?Math.sign(dx):0,sy=sx?0:Math.sign(dy);trySwap(drag.cx,drag.cy,drag.cx+sx,drag.cy+sy);drag=null;sel=null}});
addEventListener('pointerup',()=>{drag=null});
addEventListener('keydown',e=>{const k=e.code;
 if(state==='ending'){if(k==='Enter'||k==='Space'){e.preventDefault();endNext()}else if(k==='Escape'){endPg=endPages.length-1;endT=9999}return}
 if(state==='levels'){if(k==='ArrowLeft'||k==='KeyA'){mapMove(-1);e.preventDefault()}else if(k==='ArrowRight'||k==='KeyD'){mapMove(1);e.preventDefault()}
  else if(k==='ArrowUp'||k==='KeyW'){mapMove(-3);e.preventDefault()}else if(k==='ArrowDown'||k==='KeyS'){mapMove(3);e.preventDefault()}
  else if(k==='Enter'||k==='Space'){e.preventDefault();playLevel(mapSel)}return}
 if(state==='end'){if(k==='Enter'||k==='Space'){e.preventDefault();endAction(endBtns[0]?endBtns[0].a:'map')}else if(k==='Escape'||k==='KeyM')endAction('map');return}
 if(k==='Escape'&&state==='play'&&!busy)toMap(lvl)});
$('#bPlay').onclick=()=>{initAudio();toMap()};
$('#bPause').hidden=true;$('#bPause').onclick=e=>{e.currentTarget.blur();if(state==='play'&&!busy)toMap(lvl)};
const sndLabel=()=>{$('#bSnd').textContent=Z(muted?'MUTE':'SND',muted?'靜音':'音效')};
$('#bSnd').onclick=e=>{initAudio();setMute(!muted);sndLabel();e.currentTarget.blur()};
/* language switch: title overlay text, HUD labels, canvas text (read live through tr()/Z()) */
const ZH_HTML={h1:'軍糧消消樂<span>RATION CRUSH 1949 · 三消 · 六章 · 六位將軍</span>',
 tag:'1948至1949年，你是國軍某部隊的伙夫。部隊正在向南撤退，英勇而且迅速：從北方的村莊、穿過稻田、渡過長江、翻越雪山隘口、經過上海，一路到最後一班船。每支部隊、每位將軍都要吃飯。共軍就在幾天路程之後，越追越近。',
 play:'開伙',cont:'繼續撤退',
 keys:'交換相鄰的兩樣東西，連成三個以上就能消除。可以拖曳，或先點一個再點另一個。<br>四個一排做出「標語」（清除一整行）。L 或 T 形做出「手榴彈」。五個一排做出「土地改革」（清除同一種的全部）。',
 fine:'諷刺作品。金圓券每走一步就更不值錢。這不是 bug。進度自動存檔。'};
const EN_HTML={};document.querySelectorAll('[data-t]').forEach(el=>EN_HTML[el.dataset.t]=el.innerHTML);EN_HTML.cont='CONTINUE THE RETREAT';
function applyLang(l,save){LANG=l==='en'?'en':'zh';const zh=LANG==='zh';
 if(save)try{localStorage.setItem(LANG_KEY,LANG)}catch(e){}
 document.documentElement.lang=zh?'zh-Hant':'en';document.title=zh?'軍糧消消樂 Ration Crush 1949':'Ration Crush 1949';
 document.querySelectorAll('[data-t]').forEach(el=>{const k=el.dataset.t;el.innerHTML=zh&&ZH_HTML[k]!=null?ZH_HTML[k]:EN_HTML[k]});
 if((getSv().max||0)>0)$('#bPlay').innerHTML=zh?ZH_HTML.cont:EN_HTML.cont;
 document.querySelectorAll('.lang button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.l===LANG)));
 const bl=$('#bLang');bl.textContent=zh?'EN':'中文';bl.lang=zh?'en':'zh-Hant';bl.setAttribute('aria-label',zh?'Switch to English':'切換成中文');
 $('#bPause').textContent=zh?'地圖':'MAP';$('#bPause').setAttribute('aria-label',zh?'回到地圖':'Back to map');$('#bSnd').setAttribute('aria-label',zh?'切換音效':'Toggle sound');
 $('#cv').setAttribute('aria-label',zh?'軍糧消消樂遊戲畫面':'Ration Crush game screen');sndLabel();
 if(zh&&document.fonts)document.fonts.load(zf(F),'國軍伙夫').catch(()=>{})}
document.querySelectorAll('.lang button').forEach(b=>b.addEventListener('click',()=>applyLang(b.dataset.l,true)));
$('#bLang').addEventListener('click',e=>{applyLang(LANG==='zh'?'en':'zh',true);e.currentTarget.blur()});
applyLang((()=>{try{const v=localStorage.getItem(LANG_KEY);if(v==='en'||v==='zh')return v}catch(e){}return 'zh'})(),false);
function fit(){const vw=innerWidth,vh=innerHeight,s=Math.min(vw/W,vh/H);cv.style.width=Math.floor(W*s)+'px';cv.style.height=Math.floor(H*s)+'px'}
addEventListener('resize',fit);fit();cv.style.touchAction='none';
let last=performance.now(),acc=0;
function loop(nt){acc+=Math.min(100,nt-last);last=nt;while(acc>=16.67){acc-=16.67;update()}render();requestAnimationFrame(loop)}
(document.fonts?Promise.all([document.fonts.load(F),document.fonts.load(SERIF(20)),document.fonts.load(VT),document.fonts.load(zf(F),'國軍')]):Promise.resolve()).catch(()=>{}).finally(()=>requestAnimationFrame(loop));
