/* ===================== i18n: 繁體中文 (default) / English — Conscript's Descent only; shared data swapped in place at runtime, never edited ===================== */
var LANG='zh';
const LANG_KEY='descent.lang';
try{const v=localStorage.getItem(LANG_KEY);if(v==='en'||v==='zh')LANG=v}catch(e){}
const ZFAM='"Noto Sans TC","Noto Sans CJK TC","PingFang TC","Microsoft JhengHei","Heiti TC","Source Han Sans TC",sans-serif';
const CJK_RE=/[⺀-鿿豈-﫿＀-￯　-〿]/;
const isZ=s=>LANG==='zh'&&CJK_RE.test(String(s));
const LZ=(e,z)=>LANG==='zh'?z:e;
// HUD rows are 9px apart: Chinese uses a slightly smaller CJK size there
const F7='7px "Press Start 2P", monospace';
function HF(){return LANG==='zh'?F7:F}
// canvas CJK font for a pixel-font size: 16px -> bold 16, 8px -> 11px, 7px -> 10px
function zf(font){const m=/(\d+)px/.exec(font||F),p=m?+m[1]:8;return p>=16?`700 16px ${ZFAM}`:p<8?`500 10px ${ZFAM}`:`500 11px ${ZFAM}`}
// tiny world labels (item names on the floor, elite names, flying slogans)
function sfont(s,px){return isZ(s)?`500 ${px+3}px ${ZFAM}`:`${px}px "Press Start 2P",monospace`}
// text width: English keeps the fixed 8px/char metric so the original layout is unchanged
function tw(s,font=F){s=String(s);if(!isZ(s))return s.length*(/16px/.test(font)?16:8);ctx.font=zf(font);return Math.ceil(ctx.measureText(s).width)}
// wrap by measured width (current ctx.font); CJK breaks anywhere, latin words stay whole, no closing punctuation at a line start
function wrapPx(s,maxW){const toks=String(s).match(/[A-Za-z0-9¥$%'’.,!?:\/+\-–—()×]+|\s+|[\s\S]/gu)||[];const out=[];let line='';
 for(const tk of toks){const test=line+tk;
  if(line.trim()&&ctx.measureText(test.trimEnd()).width>maxW&&!/^[，。、！？：；）」』…—,.!?)\s]/.test(tk)){out.push(line.trim());line=/^\s+$/.test(tk)?'':tk}else line=test}
 if(line.trim())out.push(line.trim());return out}
// same line count as wrapPx, but the last line keeps at least 5 characters (cached; uses the current ctx.font)
const WB=new Map();
function wrapBal(s,maxW){const k=ctx.font+'|'+maxW+'|'+s;let L=WB.get(k);if(L)return L;L=wrapPx(s,maxW);
 for(let w=maxW-6;L.length>1&&L[L.length-1].length<5&&w>maxW*.6;w-=6){const L2=wrapPx(s,w);if(L2.length!==L.length)break;L=L2}
 if(WB.size>400)WB.clear();WB.set(k,L);return L}

/* ---- fixed UI strings (English source -> 繁體中文) ---- */
const ZH_UI={
 // radio
 "HQ: Our supply crates are labeled US AID. Do not open them. They are for sale.":"總部：我們的補給箱上寫著「美援」。不准打開。那是要拿去賣的。",
 "HQ: Destroy that tank. It was ours last week. America's before that. Japan's before that.":"總部：摧毀那輛戰車。它上禮拜還是我們的。再之前是美國的。再之前是日本的。",
 "HQ: Do not look directly at the face. Approval is pending.":"總部：不要直視那張臉。核准程序還在跑。",
 "HQ: Tank captured. Repaint scheduled. Again. Proceed to the sewers. Bring a nose clip.":"總部：戰車到手。重新烤漆已排程。又一次。前進下水道。記得帶鼻夾。",
 "HQ: Well done. Please board the last boat. Bring the gold. Leave the receipts.":"總部：幹得好。請登上最後一班船。黃金帶走，收據留下。",
 // pops & shouts
 'DEFECTED!':'投誠了！','LEGENDARY!':'傳說裝備！','LEVEL UP! FIELD PROMOTION':'升級！戰場升官','NEW SKILL: ':'新技能：',
 'CLANG! (THE POT)':'噹！（炒菜鍋）','OWNERSHIP TRANSFERRED':'所有權已轉移','NOT ENOUGH ZEAL':'熱忱不足',
 'HE SAID WHAT?!':'他剛剛說什麼？！','RETREAT! STRATEGICALLY!':'撤退！要有戰略地撤！','I WANT MY MOTHER':'我要找媽媽',
 'STRATEGIC WITHDRAWAL':'戰略轉進','LAND!':'土地！','RICE!':'白米！','DEFECT!':'投誠！','PEACE!':'和平！','EAT!':'吃飯！',
 'INFLATION NOVA':'通膨新星','AMERICAN AID INBOUND':'美援空投中',
 'RICE WINE (MEDICINAL)':'米酒（藥用）',"DOCTOR'S ORDERS":'醫生交代的','ONE FOR THE ROAD':'再乾一杯上路',
 'SHRINE OF INFLATION: GOLD ×2. VALUE ×0.5.':'通膨神壇：錢 ×2，價值 ×0.5。',
 'SHRINE OF SELF-CRITICISM: +50% DAMAGE, −15 ARMOR':'自我批評神壇：傷害 +50%，護甲 −15',
 'SHRINE OF STRATEGIC WITHDRAWAL: +40% SPEED':'戰略轉進神壇：速度 +40%',
 'SHRINE OF THE PARTY LINE: ZEAL REFILLS':'黨綱神壇：熱忱補滿',
 'US AID CRATE: CONTENTS PARTIALLY STOLEN':'美援物資箱：內容物已被偷走一部分',
 'RICE WINE +1':'米酒 +1','EQUIPPED (UPGRADE)':'已裝備（升級）','BAG FULL (REQUISITIONED BY YOUR OWN SIDE)':'背包滿了（被自己人徵收）',
 'CHARGE!':'衝啊！','SELF-CRITICISM AFTER THE BATTLE!':'打完仗要自我批評！','ADVANCE! I WILL SUPERVISE!':'前進！我在後面督戰！','NO RETREAT! (EXCEPT ME)':'不准後退！（我除外）',
 'CONTRACT EXPIRED':'合約到期','RE-DEFECTED. HOME.':'又投誠回去了。回家。','DEFECTED ONCE. RETIRED FOR GOOD.':'投誠過一次，永久退休。',
 'TANK CAPTURED. REPAINT SCHEDULED. AGAIN.':'戰車到手。重新烤漆已排程。又一次。',
 'IT WAS A MIRROR. IT WAS ALWAYS A MIRROR.':'原來是一面鏡子。一直都是鏡子。',
 'RAMMING SPEED (BORROWED)':'全速衝撞（借來的）','AID RECEIVED. INVOICE TO FOLLOW.':'美援已收到。帳單隨後寄到。','SLOGAN REFUTED':'口號已駁斥',
 // HUD
 'MORALE':'士氣','ZEAL':'熱忱','LMB':'左鍵','ROAR':'怒吼','GOLD×2':'錢×2','SELF-CRIT':'自我批評','SPEED':'加速',
 'THE TANK OF MANY OWNERS':'多主戰車','THE GREAT LEADER (FACE PENDING APPROVAL)':'偉大領袖（臉部待核准）',
 'YOUR CONSCRIPT HAS BEEN DEMOBILIZED':'你的壯丁已被「復員」了','PAUSED':'暫停','THE WAR WILL WAIT. IT ALWAYS DOES.':'戰爭會等你。它一向很有耐心。','L: LANGUAGE':'L：切換語言 ENGLISH',
 // bag, camp, end
 'Morale':'士氣','Zeal':'熱忱','Damage':'傷害','Armor':'護甲','Crit':'暴擊','Move speed':'移動速度','Attack speed':'攻擊速度','Gold found':'掉錢加成','Level':'等級',
 '— nothing —':'— 空 —','BAG':'背包','Tap an item to inspect it.':'點一下物品查看詳情。','EQUIP':'裝備','WRONG CLASS':'職業不符','SCRAP FOR GOLD':'拆了換錢',
 'SOLD':'已售出','QUARTERMASTER: Not enough. Inflation is not my fault. Mostly.':'軍需官：錢不夠。通膨不是我的錯。大部分不是。','Bag full.':'背包滿了。',
 'Nothing to sell. The quartermaster is disappointed in you.':'沒東西可賣。軍需官對你很失望。',
 'DRAFT ANOTHER CONSCRIPT':'再抓一個壯丁','DEMOBILIZED (PERMANENTLY)':'已復員（永久）','TITLE':'回標題',
 'Floor reached':'抵達樓層','Enemies dispatched':'擊倒敵軍','Legendaries found':'傳說裝備','Gold earned':'賺到的錢','Class':'職業','Value on arrival':'抵台價值','1 rice wine':'一壺米酒',
 'UNDEFEATED. EVACUATED.':'從未戰敗，照樣撤退。','COUNTERATTACK (NEXT YEAR)':'反攻大陸（明年）',
 // labels drawn by the shared art
 'APPROVAL':'待核准','TEMPORARY':'暫時','SND':'音效','MUTE':'靜音','HELP!':'救命！'};
const ZH_PREFIX=[['RICE: ¥','米價：¥'],['PROPERTY OF: ','所屬：']];
function tr(s){if(LANG!=='zh'||typeof s!=='string')return s;const z=ZH_UI[s];if(z!=null)return z;for(const[a,b]of ZH_PREFIX)if(s.startsWith(a))return b+s.slice(a.length);return s}

/* ---- data tables (zh-TW): shared writing + this game's own tables, swapped in place ---- */
const ZH={
 POW_LINES:["這禮拜兩邊都來抓我當兵。下禮拜我兩邊都不想去。","你是哪一邊的？……算了。這個拿去，牛留下。","他們牽走我的牛。另一邊抓走牛的替代品：我。","地主跑了。收稅的不知道為什麼還在。","謝謝！下次麻煩去解放別的村子。","我保持中立。結果兩邊都朝我開槍。","大兒子跟你們，小兒子跟他們。吃年夜飯很尷尬。","我已經被解放六次了。好累。","拿去。本來要留給打贏的那邊，先給你吧。","跟你們將軍說，我還在等1946年的軍餉。我是農夫欸。"],
 DEFECT:["我投降！我是來吃飯的","我要投誠！在哪裡簽名？","換邊！一樣打仗，飯比較好吃？","長官跑了，我也跑。","全連都要過來。我們投票表決過了。"],
 CRIES:{kmt:["去死吧！共匪！","去死吧！共匪！","去死吧！共匪！","吃子彈吧，赤匪！","為了我的薪餉！"]},
 TAUNTS:{ccp:["快跑啊，走狗！","你們的錢是衛生紙！","加入我們！我們有小米！","投降吧！我們有表格！"]},
 SLOGANS:{ccp:["土地改革！","投誠有飯吃！","我們有米","快投降！"]},
 TEXT:{kmt:{who:'總部',lives:'壯丁',
  kills:["+餉（又貶值了）","賺到薪水：一顆蛋","表哥？好像是","恕不退款","他有一塊田。曾經有。","發餉了！快點花掉"],
  over:["您的犧牲將由委員會永遠銘記。該委員會已遷往台灣。","已通知家屬。撫卹金以金圓券發放，剛好夠買一張郵票。"]}},
 PLATES:["美國陸軍","大日本帝國","國軍","共軍","某軍閥","沒人（暫時）"],
 SCENES:[
  {pre:{date:'1946年6月',place:'華中',fact:"日本投降了。美國特使居中調停，促成國共停戰。到了夏天，全面內戰還是爆發了。",joke:"雙方只在一件事上意見一致：先破壞停戰的是對方。"}},
  {},{},
  {pre:{date:'1948年8月',place:'上海',fact:"政府以三百萬比一，用新的金圓券取代舊法幣。不到一年就幾乎一文不值，大家提著整麻袋的鈔票去買菜。",joke:"經濟學家稱之為惡性通膨。上海人稱之為午餐。"}}],
 // ---- this game's tables (game.js) ----
 CLASSES:{
  brute:{name:'大刀隊',basic:'大刀砍',basicShort:'大刀',skills:[
   {name:'大刀迴旋斬',short:'迴旋',desc:'揮著大刀轉圈圈。按住時持續消耗熱忱。'},
   {name:'衝出戰壕',short:'衝鋒',desc:'跳向敵人狠狠砸下。會暈眩敵人。'},
   {name:'國罵怒吼',short:'國罵',desc:'大喊國家口號。傷害 +50%，敵人嚇得逃跑。'},
   {name:'集束餿主意',short:'集束',desc:'六顆手榴彈綁成一捆。轟很大。'}]},
  sharp:{name:'神槍手',basic:'步槍射擊',basicShort:'射擊',skills:[
   {name:'齊射',short:'齊射',desc:'扇形連發五槍。'},
   {name:'地雷',short:'地雷',desc:'埋一顆地雷。敵人會自願踩上去。'},
   {name:'戰略轉進',short:'轉進',desc:'撲倒翻滾逃開。翻滾時無敵。'},
   {name:'湯姆生彈幕',short:'彈幕',desc:'三秒鐘的美援火力。是借的。'}]},
  prop:{name:'宣傳員',basic:'撒傳單',basicShort:'傳單',skills:[
   {name:'口號轟炸',short:'口號',desc:'扇形噴出口號。會暈眩敵人，偶爾讓他們投誠。'},
   {name:'通膨新星',short:'通膨',desc:'鈔票向四周炸開。一文不值，但很利。'},
   {name:'招降納叛',short:'招降',desc:'兩名敵兵暫時換邊站。'},
   {name:'美援空投',short:'美援',desc:'一箱物資砸在敵人頭上。站在旁邊還能回血。'}]}},
 RAR:['普通','魔法','稀有','傳說'],
 SLOTN:{weapon:'武器',helm:'頭部',armor:'身體',boots:'腳',charm:'護身符'},
 BASES:{weapon:{brute:['生鏽大刀','大刀','劊子手大刀','二十九軍大刀'],sharp:['漢陽造步槍','中正式步槍','毛瑟槍（偷來的）','湯姆生（國產仿製）'],prop:['鐵皮大聲公','傳單背包','擴音器（有疑慮）','黃銅喇叭']},
  helm:['大盤帽','德式鋼盔（剩貨）','炒菜鍋','草帽（借來的）'],
  armor:['棉襖','軍服（前任主人已歿）','軍官大衣','麻布袋'],
  boots:['草鞋','綁腿','徵用軍靴','左腳一隻、右腳一隻'],
  charm:['幸運幣（金圓券）','糧票','黨證','某人妹妹的照片']},
 AFF:[
  {n:'通膨',s:'攻勢',f:v=>`傷害 +${v}%`},
  {n:'吃飽',s:'長冬',f:v=>`士氣上限 +${v}`},
  {n:'加固',s:'多主',f:v=>`護甲 +${v}`},
  {n:'租借',s:'好運',f:v=>`暴擊率 +${v}%`},
  {n:'靈活',s:'轉進',f:v=>`移動速度 +${v}%`},
  {n:'手癢',s:'趕工',f:v=>`攻擊速度 +${v}%`},
  {n:'貪污',s:'軍需',f:v=>`掉錢 +${v}%`},
  {n:'自省',s:'檢討',f:v=>`每秒回復士氣 +${v/10}`},
  {n:'狂熱',s:'黨綱',f:v=>`熱忱上限 +${v}`},
  {n:'餓鬼',s:'徵收',f:v=>`每殺一人回復士氣 +${v}`}],
 ITXT:{dmg:(a,b)=>`傷害 ${a}–${b}`,armor:a=>`護甲 ${a}`},
 UNIQ:[
  {name:'金圓券鎖子甲',desc:'身上每帶 40 塊錢，護甲 +1。',flav:'刀槍不入，只要你永遠不花它。'},
  {name:'戰略轉進之靴',desc:'背向敵人移動時，移動速度 +50%。',flav:'撤退時從未打過敗仗。'},
  {name:'家書',desc:'每殺一人回復 3% 士氣。',flav:'媽媽說要多吃一點。她沒看過軍糧。'},
  {name:'租借法案物資箱',desc:'技能消耗的熱忱減少 35%。',flav:'1950 年到期。利息好商量。'},
  {name:'那口炒菜鍋',desc:'25% 機率完全擋下子彈。',flav:'以前拿來煮飯。現在戰術升級。'},
  {name:'將軍的備用帽',desc:'傷害 +15%，士氣上限 +20%。',flav:'只戴過一次，為了拍照。'},
  {name:'多主大刀',desc:'傷害 +60%。殺敵時，偶爾讓附近的敵人投誠。',flav:'刀上刻了六個名字，劃掉了五個。'},
  {name:'軍需官的步槍',desc:'子彈可穿透。掉錢 +100%。',flav:'兩邊都賣過。各賣兩次。'},
  {name:'真理大聲公（待核准）',desc:'口號轟炸會讓 30% 的普通敵人投誠。',flav:'放大過的真理。內容隨時修訂。'},
  {name:'長冬棉襖',desc:'士氣上限 +40%。每秒回復 1%。',flav:'冬天訂的，春天到貨，穿一輩子。'}],
 RARE1:['寡婦製造','剋幹部','發餉日','最後通牒','二房','最後口糧','想家','雙面間諜','紙老虎','黑市'],
 RARE2:['之握','之吼','之袍','之步','之約','之收據','之傳家寶','之失誤'],
 PERKS:[
  {n:'加菜',d:'士氣上限 +20%。',f:'這次的口糧是真的。大概吧。'},
  {n:'美援子彈',d:'傷害 +15%。',f:'美國子彈。打出來的洞一樣，文件比較齊全。'},
  {n:'飛毛腿',d:'移動速度 +10%。',f:'進攻撤退兩相宜。'},
  {n:'黑市人脈',d:'掉錢 +50%。',f:'你表哥認識一個人。'},
  {n:'皮厚（字面上）',d:'護甲 +12。',f:'三個冬天的棉花墊出來的。'},
  {n:'續命',d:'米酒壺 +1，補充更快。',f:'藥用的。據說。'},
  {n:'戰場升官',d:'暴擊率 +8%，暴擊傷害 +25%。',f:'因為勇敢而升官，或者因為還活著。'},
  {n:'真信徒',d:'熱忱上限 +25，熱忱累積 +30%。',f:'你相信這個主義。這個主義叫薪水。'},
  {n:'高效官僚',d:'技能冷卻 −20%。',f:'史上頭一遭。'},
  {n:'徵收',d:'每次命中回復 2 士氣。',f:'拿東西也是一種技術。'},
  {n:'轉轉大師',d:'大刀迴旋斬範圍擴大 40%，傷害更高。',f:'要怎麼轉都隨你。'},
  {n:'大嗓門',d:'國罵怒吼持續時間加倍。',f:'鄰居已經投訴了。'},
  {n:'重落地',d:'衝出戰壕傷害加倍。',f:'地心引力站在我們這邊。'},
  {n:'多一根槍管',d:'齊射多發 3 槍。',f:'沒人敢問槍管是哪來的。'},
  {n:'跳彈',d:'步槍子彈多穿透一名敵人。',f:'物理學，已徵用。'},
  {n:'地雷田',d:'地雷傷害 +80%，一次埋兩顆。',f:'村裡的農地，改良過了。'},
  {n:'口號加大聲',d:'口號轟炸暈得更久、射得更遠。',f:'說一百遍就是真的。'},
  {n:'惡性通膨',d:'通膨新星傷害 +60%。',f:'物價上漲，碎片也跟著漲。'},
  {n:'集體投誠',d:'多招降一名敵兵，而且更能打。',f:'他們是為了白米來的。'}],
 FLOORS:[
  {name:'城郊',radio:"總部：肅清城郊。搜刮要有責任感。長官先搜。"},
  {name:'戰壕',radio:"總部：這些戰壕是兩邊一起挖的。挖到中間碰頭，還一起吃了午飯。"},
  {name:'村口廣場',radio:"總部：又是那輛戰車。它已經換到第七任車主了。讓它換第八任。"},
  {name:'上海下水道',radio:"總部：進下水道。下面的鈔票，跟上面的鈔票一樣值錢。意思你懂。"},
  {name:'金庫地道',radio:"總部：央行的黃金就是從這些地道運走的。官方說法是這批黃金從來不存在。跟著拖痕走。"},
  {name:'外灘',radio:"總部：外灘上有個巨大的東西，上面有一張臉。趁那張臉還沒核准，摧毀它。"}],
 EAFF_N:{FAST:'快腿','SELF-CRITICAL':'自我批評',EXPLOSIVE:'會爆炸',INFLATED:'通膨','LONG MARCH':'長征','DEFECTS WHEN HURT':'受傷就投誠',LOUD:'大嗓門'},
 RNAME1:['政治','鋼鐵','超熱血的','兩度受勳的','前國軍','審查中的','大嗓門','很餓的'],
 RNAME2:['王幹部','李班長','趙同志','孫排長','馬指導員','傅軍需'],
 QM_LINES:["軍需官：這些是我們的物資。這些是我的價錢。兩樣都不能改。","軍需官：全部打九折。價錢先漲了兩成。","軍需官：收金圓券。收米更好。銀元的話……小聲講。","軍需官：野戰醫院免費。繃帶另計。血自己出。"],
 CAUSES:{bullet:'被步槍兵打死',bayonet:'被刺刀捅死',boom:'被炸飛',slogan:'被一句口號打死',tank:'被一輛換過六個主人的戰車輾過',laser:'被一張未核准的臉用雷射燒死',stomp:'被一塊看板踩扁',cavalry:'被一匹被抓壯丁的馬踩死',other:'輸給了這場戰爭'},
 END_SEQ:[
  {date:'同一時間，1949年',place:'地面上',fact:"你連打六層勝仗，爬出地面。上面的政府已經丟了東北、南京和上海。",joke:"總部確認你是全年唯一打贏過任何東西的單位。請保密。這會破壞整體敘事。"},
  {date:'1949年12月',place:'最後一班船',fact:"政府宣布「暫時遷移」到台灣。非常暫時。國庫黃金好幾個月前就先開船了，坐頭等艙。",joke:"你拿全部戰利品換一張船票：{LOOT}。事務長收下了你的米酒。"},
  {date:'1950年元旦',place:'台北',fact:"總部承諾：「明年就反攻大陸。」你的行軍背包一直打包好，以防萬一。",joke:"1951年：「明年。」1952年：「明年。」1953年：「明年。」你的背包開始長香菇了。"}]
};
const isObj=v=>v!==null&&typeof v==='object';
function grab(tgt,src){if(Array.isArray(src))return src.some(isObj)?src.map((v,i)=>isObj(v)?grab(tgt[i],v):tgt[i]):tgt.slice();const o={};for(const k in src)o[k]=isObj(src[k])?grab(tgt[k],src[k]):tgt[k];return o}
function put(tgt,src){if(Array.isArray(src)){if(src.some(isObj))src.forEach((v,i)=>{if(isObj(v)&&isObj(tgt[i]))put(tgt[i],v)});else{tgt.length=0;tgt.push(...src)}return}
 for(const k in src){const v=src[k];if(isObj(v)&&isObj(tgt[k]))put(tgt[k],v);else tgt[k]=v}}
let REF=null,EN_DATA=null;const X_ZH=new Map(),X_EN=new Map();
function i18nInit(){if(REF)return;
 REF={POW_LINES,DEFECT,CRIES,TAUNTS,SLOGANS,TEXT,PLATES,SCENES,CLASSES,RAR,SLOTN,BASES,AFF,ITXT,UNIQ,RARE1,RARE2,PERKS,FLOORS,EAFF_N,RNAME1,RNAME2,QM_LINES,CAUSES,END_SEQ};
 EN_DATA={};for(const k in ZH)EN_DATA[k]=grab(REF[k],ZH[k]);
 (function pair(e,z){if(typeof e==='string'&&typeof z==='string'){if(e!==z){X_ZH.set(e,z);X_EN.set(z,e)}return}if(isObj(e)&&isObj(z))for(const k in z)pair(e[k],z[k])})(EN_DATA,ZH);
 for(const k in ZH_UI){X_ZH.set(k,ZH_UI[k]);X_EN.set(ZH_UI[k],k)}}
// lines already on screen (radio, shouts, prisoner bubbles, pops, flying slogans) switch language too
function relabel(){const m=LANG==='zh'?X_ZH:X_EN,f=s=>m.get(s)??s;
 if(radioCur)radioCur.s=f(radioCur.s);radioQ=radioQ.map(f);shoutTxt=f(shoutTxt);
 for(const e of ents.concat(allies))if(e.shoutTxt)e.shoutTxt=f(e.shoutTxt);
 for(const p of props)if(p.say)p.say=f(p.say);for(const n of nums)if(n.txt)n.s=f(n.s);
 for(const s of eshots)if(s.w)s.w=f(s.w);for(const p of fx)if(p.word)p.word=f(p.word)}

/* ---- canvas text: CJK-aware overrides of the shared helpers (English path is the untouched original) ---- */
const isDark=c=>{const m=/^#([0-9a-f]{6})/i.exec(c);if(!m)return false;const v=parseInt(m[1],16);return((v>>16)*.3+((v>>8)&255)*.59+(v&255)*.11)<70};
const _txt=txt,_drawShout=drawShout,_drawBubble=drawBubble,_drawSceneZ=drawScene,_sceneArtZ=sceneArt;
txt=function(s,x,y,c='#e9dcc2',al='left',font=F){if(LANG!=='zh')return _txt(s,x,y,c,al,font===F7?F:font);
 s=tr(String(s));if(!CJK_RE.test(s))return _txt(s,x,y,c,al,font===F7?F:font);
 const big=/16px/.test(font);ctx.font=zf(font);ctx.textAlign=al;ctx.textBaseline='middle';const yy=y+(big?8:4);ctx.fillStyle='#120d0c';
 if(!isDark(c))for(const[a,b]of[[1,1],[-1,0],[1,0],[0,-1],[0,1]])ctx.fillText(s,x+a,yy+b);ctx.fillStyle=c;ctx.fillText(s,x,yy);ctx.textBaseline='top'};
drawShout=function(s,x,y,hero){s=tr(s);if(!isZ(s))return _drawShout(s,x,y,hero);
 ctx.font=zf(F);const w=Math.ceil(ctx.measureText(s).width)+10,h=16,jig=hero&&T%6<3?1:0,bx=clamp(x-w/2,4,W-w-4),by=Math.max(26,y-h)+jig,bc=hero?'#c8372d':'#120d0c',fc=hero?'#fff4d0':'#d8ccb0';
 r(bx-1,by-1,w+2,h+2,bc);r(bx-3,by+4,2,3,bc);r(bx+w+1,by+8,2,3,bc);r(bx+8,by-3,3,2,bc);r(bx+w-12,by+h+1,3,2,bc);r(bx,by,w,h,fc);
 const tx=clamp(x-1,bx+3,bx+w-6);r(tx,by+h+1,3,3,fc);r(tx+1,by+h+4,2,2,fc);
 ctx.font=zf(F);ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillStyle=hero?'#c8372d':'#3a2a20';ctx.fillText(s,bx+5,by+h/2+1);ctx.textBaseline='top'};
drawBubble=function(s,x,y){if(!isZ(s))return _drawBubble(s,x,y);
 ctx.font=zf(F);const L=wrapPx(s,150),w=Math.ceil(Math.max(...L.map(l=>ctx.measureText(l).width)))+10,h=L.length*13+6;
 let bx=clamp(x-w/2,4,W-w-4),by=Math.max(28,y-h);r(bx,by,w,h,'#e9dcc2');ctx.strokeStyle='#120d0c';ctx.strokeRect(bx+.5,by+.5,w-1,h-1);
 r(clamp(x-2,bx+4,bx+w-8),by+h,4,3,'#e9dcc2');ctx.font=zf(F);ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillStyle='#120d0c';L.forEach((l,i)=>ctx.fillText(l,bx+5,by+3+i*13+7));ctx.textBaseline='top'};
drawScene=function(sc,t){if(!isZ(sc.fact+sc.joke))return _drawSceneZ(sc,t);
 ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);ctx.save();ctx.beginPath();ctx.rect(0,0,W,136);ctx.clip();sceneArt(sc.draw,t);ctx.restore();
 ctx.drawImage(VIG,0,0);r(0,136,W,H-136,'#120d0c');r(0,136,W,2,'#d9a441');
 txt(sc.date,8,141,'#d9a441');txt(sc.place,W-8,141,'#a8977c','right');
 let sz=12,LH=13,fl,jl;for(;;){ctx.font=`500 ${sz}px ${ZFAM}`;fl=wrapBal(sc.fact,W-16);jl=wrapBal(sc.joke,W-16);if((fl.length+jl.length)*LH+3<=H-153||sz<=10)break;sz--;LH--}
 const shown=Math.floor(t*.7);let n=0;ctx.textAlign='left';ctx.textBaseline='middle';
 fl.forEach((l,i)=>{const v=l.slice(0,Math.max(0,shown-n));n+=l.length;ctx.fillStyle='#e9dcc2';ctx.fillText(v,8,153+i*LH+LH/2)});
 jl.forEach((l,i)=>{const v=l.slice(0,Math.max(0,shown-n));n+=l.length;ctx.fillStyle='#ff9a6a';ctx.fillText(v,8,156+(fl.length+i)*LH+LH/2)});
 ctx.textBaseline='top';if(shown>n+10&&T%40<26)_txt('▶',W-16,H-12,'#d9a441');
 return shown>n};
// small paper props in the shared scene art: repaint them with Chinese words
function zLabel(s,x,y,w,h,px){r(x,y,w,h,'#e9dcc2');ctx.font=`700 ${px}px ${ZFAM}`;ctx.fillStyle='#120d0c';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s,x+w/2,y+h/2+.5);ctx.textAlign='left';ctx.textBaseline='top'}
sceneArt=function(name,t){_sceneArtZ(name,t);if(LANG!=='zh')return;
 if(name==='table'){zLabel('停',152,89,26,12,10);zLabel('戰',202,89,26,12,10)}};
// hyperinflation can outrun the unit table (1e27+)
{const _fmtBig=fmtBig;fmtBig=function(n){return n>=1e27||!isFinite(n)?'999OC+':_fmtBig(n)}}

/* ---- HTML overlays ---- */
const ZH_HTML={
 h1:'壯丁深淵<span>CONSCRIPT\'S DESCENT · 國共內戰動作 RPG · 六層樓 · 一條命</span>',
 tag:'從燒毀的村莊一路殺進上海下水道、央行金庫地道，最後殺上外灘。見什麼搶什麼。你的薪水一直漲，你的身價一直跌。',
 bruteI:'大刀莽漢',bruteS:'刀很大，嘴更大。會轉、會跳，還會大吼國家口號。',bruteE:'近戰 · 耐打',
 sharpI:'轉進專家',sharpS:'一把步槍、幾顆地雷，加上戰略轉進的天分。',sharpE:'遠程 · 靈活',
 propI:'口號砲手',propS:'口號能把人喊暈，通膨會爆炸，投誠者隨叫隨到。',propE:'施法 · 召喚',
 keys:'<span class="kbd">滑鼠：左鍵移動與攻擊，右鍵放技能 1<br>鍵盤：1–4 放技能 · F 喝米酒 · I 背包 · W A S D 走路 · P 暫停 · L 切換語言<br></span>手機：左手拇指走路，「攻擊」和技能按鈕會自動瞄準最近的敵人。',
 fine:'諷刺作品。死了就沒了。軍需官收金圓券，收得很不情願。',
 rot:'請把手機轉成橫向：地下城橫著比較寬',
 tA:'攻擊',tP:'米酒',bBag:'背包',
 bagT:'行軍背包',eqH:'已裝備',stH:'壯丁',bagClose:'回到戰場',
 perkP:'選一個。剩下的給長官的姪子。',
 shopH:'軍需官（我們的物資，他的價錢）',sellH:'從背包賣出',campBag:'打開背包',campGo:'繼續往下'};
const EN_HTML={};
const ARIA={cv:["Conscript's Descent game screen",'壯丁深淵 遊戲畫面'],bPause:['Pause','暫停'],bBag:['Open bag','打開背包'],bSnd:['Toggle sound','切換音效'],bLang:['切換為中文','Switch to English']};
function sndLabel(){const b=$('#bSnd');if(b)b.textContent=tr(muted?'MUTE':'SND')}
function applyLang(l,save){i18nInit();LANG=l==='en'?'en':'zh';const zh=LANG==='zh';
 if(save)try{localStorage.setItem(LANG_KEY,LANG)}catch(e){}
 for(const k in ZH)put(REF[k],zh?ZH[k]:EN_DATA[k]);relabel();
 document.documentElement.lang=zh?'zh-Hant':'en';document.title=zh?"壯丁深淵 Conscript's Descent":"Conscript's Descent 壯丁深淵";
 document.querySelectorAll('[data-t]').forEach(el=>{const k=el.dataset.t;if(EN_HTML[k]==null)EN_HTML[k]=el.innerHTML;el.innerHTML=zh&&ZH_HTML[k]!=null?ZH_HTML[k]:EN_HTML[k]});
 for(const id in ARIA){const el=$('#'+id);if(el)el.setAttribute('aria-label',ARIA[id][zh?1:0])}
 document.querySelectorAll('.lang button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.l===LANG)));
 const bl=$('#bLang');if(bl){bl.textContent=zh?'EN':'中文';bl.lang=zh?'en':'zh-Hant'}
 sndLabel();
 // re-render whatever overlay is open
 if(PL){if(!$('#bag').hidden)renderBag();
  if(!$('#camp').hidden){campHead();$('#campG').textContent='';renderCamp()}
  if(!$('#perk').hidden){$('#perkH').textContent=LZ(`FIELD PROMOTION · LEVEL ${PL.lvl}`,`戰場升官 · 第 ${PL.lvl} 級`);$('#perks').querySelectorAll('button').forEach((b,i)=>{const p=perkCh[i];if(p)b.innerHTML=`<b>${p.n}</b><span>${p.d}</span><small>${p.f}</small>`})}
  if(!$('#end').hidden)fillEnd()}
 if(zh&&document.fonts)document.fonts.load(zf(F),'國軍').catch(()=>{})}
document.querySelectorAll('.lang button').forEach(b=>b.addEventListener('click',e=>{applyLang(b.dataset.l,true);e.currentTarget.blur()}));
$('#bLang').addEventListener('click',e=>{applyLang(LANG==='zh'?'en':'zh',true);e.currentTarget.blur()});
applyLang(LANG,false);
