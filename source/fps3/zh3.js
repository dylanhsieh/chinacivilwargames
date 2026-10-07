/* ===================== i18n: 繁體中文 (default) / English — Village Siege only; shared data swapped in place, never edited ===================== */
var LANG='zh';
const LANG_KEY='siege.lang';
try{const v=localStorage.getItem(LANG_KEY);if(v==='en'||v==='zh')LANG=v}catch(e){}
const ZFAM='"Noto Sans TC","Noto Sans CJK TC","PingFang TC","Microsoft JhengHei","Heiti TC","Source Han Sans TC",sans-serif';
const CJK_RE=/[⺀-鿿豈-﫿＀-￯　-〿]/;
const isZ=s=>LANG==='zh'&&CJK_RE.test(String(s));
const LZ=(e,z)=>LANG==='zh'?z:e;
const ZN=['〇','一','二','三','四','五','六','七','八','九','十'];
// small pixel-font text in English, slightly smaller CJK in Chinese (HUD rows are 10px apart)
const F7='7px "Press Start 2P", monospace';
const HF=()=>LANG==='zh'?F7:F;
// canvas CJK font for a pixel-font size: 16px -> bold 16, 8px -> 11px, 7px -> 10px
function zf(font){const m=/(\d+)px/.exec(font||F),p=m?+m[1]:8;return p>=16?`700 16px ${ZFAM}`:p<8?`500 10px ${ZFAM}`:`500 11px ${ZFAM}`}
// text width: English keeps the fixed 8px/char metric so the original layout is unchanged
function tw(s,font=F){s=String(s);if(!isZ(s))return s.length*(/16px/.test(font)?16:8);ctx.font=zf(font);return Math.ceil(ctx.measureText(s).width)}
// wrap by measured width (current ctx.font); CJK breaks anywhere, latin words stay whole, no closing punctuation at a line start
function wrapPx(s,maxW){const toks=String(s).match(/[A-Za-z0-9¥$%'’.,!?:\/+\-–—()]+|\s+|[\s\S]/gu)||[];const out=[];let line='';
 for(const tk of toks){const test=line+tk;
  if(line.trim()&&ctx.measureText(test.trimEnd()).width>maxW&&!/^[，。、！？：；）」』…—,.!?)\s]/.test(tk)){out.push(line.trim());line=/^\s+$/.test(tk)?'':tk}else line=test}
 if(line.trim())out.push(line.trim());return out}
// wrap without orphans: same line count as wrapPx, but the last line keeps at least 5 characters (cached; uses the current ctx.font)
const WB=new Map();
function wrapBal(s,maxW){const k=ctx.font+'|'+maxW+'|'+s;let L=WB.get(k);if(L)return L;L=wrapPx(s,maxW);
 for(let w=maxW-6;L.length>1&&L[L.length-1].length<5&&w>maxW*.6;w-=6){const L2=wrapPx(s,w);if(L2.length!==L.length)break;L=L2}
 if(WB.size>400)WB.clear();WB.set(k,L);return L}
/* ---- fixed UI strings (English source -> 繁體中文) ---- */
const ZH_UI={
 'HELP!':'救命！','PAUSED':'暫停','THE WAR WILL WAIT. IT ALWAYS DOES.':'戰爭會等你。它一向很有耐心。',
 'THIS BROWSER BLOCKED 3D GRAPHICS':'這個瀏覽器封鎖了 3D 繪圖','TRY ANOTHER BROWSER OR DEVICE':'請換個瀏覽器或裝置再試一次',
 'C96 MAUSER':'駁殼槍','TOMMY GUN':'湯姆生衝鋒槍','BAZOOKA':'巴祖卡火箭筒',
 'C96 MAUSER!':'駁殼槍！','TOMMY GUN!':'湯姆生衝鋒槍！','BAZOOKA!':'巴祖卡火箭筒！',
 '-500. EVEN THIS WAR HAS PAPERWORK':'-500。打仗也是要寫報告的',
 'HE HAD THE HIGH GROUND. BRIEFLY.':'他佔了制高點。短暫地。',
 'SPEAKER SILENCED. SLOGANS CONTINUE ELSEWHERE':'喇叭閉嘴了。口號在別處繼續喊',
 'OWNERSHIP TRANSFERRED':'所有權已轉移','FLAG CHANGED. LOYALTY UNDER REVIEW':'旗子換了。忠誠度審核中',
 'PRINTING FASTER. MONEY WORTH LESS':'越印越快。錢越來越不值','FACE REVISED. STILL NOT APPROVED':'臉改過了。還是沒核准',
 'SLOGAN REFUTED':'口號已駁斥','HIT BY A SLOGAN':'被口號打中','STEPPED ON BY A BILLBOARD':'被看板踩到了',
 '+3000 GOLD (CONFISCATED)':'+3000 黃金（充公）','GRENADES +4':'手榴彈 +4',
 'CHARGE! (ONE RIFLE PER THREE MEN!)':'衝啊！（三個人一把槍！）',
 '3 MORE DRAFTED. THEIR VILLAGE IS NOW EMPTY':'又抓了三個壯丁。他們村子空了',
 'HQ: An extra conscript has been delivered. Do not ask from where.':'總部：多送來一個壯丁。不要問是從哪裡來的。',
 'HQ: Conscript down. Notify next of kin. Bill them for the uniform.':'總部：壯丁陣亡。通知家屬。軍服錢跟他們收。',
 'HQ: We have lost a conscript. Check his pockets for our ammunition.':'總部：損失一名壯丁。翻翻他的口袋，子彈是我們的。',
 'HQ: It is dropping bombs. Ours. We sold them those too.':'總部：它在丟炸彈。我們的炸彈。那些也是我們賣給他們的。',
 'STAGE COMPLETE!':'過關！','PIER HELD! BOAT LEAVING!':'碼頭守住了！船要開了！','YOU HAVE BEEN DEMOBILIZED':'你已經被「復員」了',
 'MORALE':'士氣','DONE':'已解決','ENGAGED':'交戰中',
 // tally
 'ENEMIES DISPATCHED':'擊倒敵軍','VILLAGERS UNTIED':'解救村民','SPEAKERS SILENCED':'擊毀喇叭','CONSCRIPTS SPENT':'消耗壯丁','BONUS':'獎勵','RANK: ':'評價：','▶ CONTINUE':'▶ 繼續',
 'HERO OF THE (CORRECT) PEOPLE':'（正確的）人民英雄','DECORATED (TIN MEDAL)':'獲頒勳章（錫做的）','ADEQUATE CANNON FODDER':'合格砲灰','STATISTIC':'統計數字',
 // labels drawn by the shared scene art
 'APPROVAL':'待核准','COATS':'冬衣','APR':'四月','MANUAL':'說明書','FLAGS · 旗':'各式旗幟','TEMPORARY':'暫時','FORM 1':'表格一',
 'SND':'音效','MUTE':'靜音'};
const ZH_PREFIX=[['RICE: ¥','米價：¥'],['PROPERTY OF: ','所屬：']];
function tr(s){if(LANG!=='zh'||typeof s!=='string')return s;const z=ZH_UI[s];if(z!=null)return z;for(const[a,b]of ZH_PREFIX)if(s.startsWith(a))return b+s.slice(a.length);return s}

/* ---- data tables (zh-TW) for the shared writing and this game's stages ---- */
const L0Z=[
 {start:"總部：不惜一切代價守住這條路。援軍已在路上。",start2:"總部：更正。援軍被賣掉了。錢安全存在上海。",drop:"總部：美援到了！內容：四百條香菸和一挺機槍。兩樣都不准分。",truck:"總部：敵軍廣播車！不准聽。第三連已經有一半聽進去了。",mid:"總部：你的薪餉已依通膨調整。請匯款給我們。",boss:"總部：摧毀那輛戰車。它上禮拜還是我們的。再之前是美國的。再之前是日本的。",win:"總部會把這場勝利報告成「戰略性撤退」，以策安全。"},
 {start:"總部：穿越稻田前進。別踩壞莊稼，已經賣給三個買家了。",vehicle:"總部：我們徵用了一頭驢，在牠背上綁了一門砲。驢子沒同意。你也沒有。",mid:"總部：農民一直叫我們「另一群土匪」。請多微笑。",boss:"總部：裝甲列車！1937年以來第一班準點的火車。照樣給我炸了。",win:"總部：幹得好。車上載的是我們自己的軍餉。反正也不值錢了。"},
 {start:"總部：守住山口。冬衣已經訂了。預計到貨：明年冬天。",mid:"總部：傘兵來了！我們的、他們的……這種高度誰分得出來？",boss:"總部：敵機來襲！別擔心，油是我們賣給他們的。大部分是水。",win:"總部：山口確保！我們現在可以有秩序地從這裡撤退了。"},
 {start:"總部：保衛大上海！市面平靜。物價從早餐到現在才漲了三倍。",vehicle:"總部：開走那輛戰車。文件上寫「我方所有」。車組員說「已經不是了」。",truck:"總部：前方裝甲車！還有銀行擠兌。只准對其中一個開槍。",mid:"總部：記住，一袋金圓券拿來擋子彈，比拿去買米好用。",boss:"總部：印鈔機落入敵手！沒有它，我們要怎麼印一文不值的錢？",win:"總部：上海守住了一整個下午。個人最佳紀錄。"},
 {start:"總部：死守長江防線！長官們會在對岸督戰。然後在更遠的地方督戰。",drop:"總部：空投！一支巴祖卡，外加一封措辭強烈的信。",truck:"總部：砲艇！艦長今天已經換邊兩次。看清楚他掛哪面旗。",mid:"總部：前方是陸地。不知道是誰的地。文件審核中。",boss:"總部：有個巨大的東西正在登陸。情報說它有一張臉。那張臉還沒人核准。",win:"總部：幹得好。請登上最後一班船。黃金帶走，收據留下。"}];
const ZH={
 POW_LINES:["這禮拜兩邊都來抓我當兵。下禮拜我兩邊都不想去。","你是哪一邊的？……算了。這個拿去，牛留下。","他們牽走我的牛。另一邊抓走牛的替代品：我。","地主跑了。收稅的不知道為什麼還在。","謝謝！下次麻煩去解放別的村子。","我保持中立。結果兩邊都朝我開槍。","大兒子跟你們，小兒子跟他們。吃年夜飯很尷尬。","我已經被解放六次了。好累。","拿去。本來要留給打贏的那邊，先給你吧。","跟你們將軍說，我還在等1946年的軍餉。我是農夫欸。"],
 DEFECT:["我投降！我是來吃飯的","我要投誠！在哪裡簽名？","換邊！一樣打仗，飯比較好吃？","長官跑了，我也跑。","全連都要過來。我們投票表決過了。"],
 TAUNTS:{ccp:["快跑啊，走狗！","你們的錢是衛生紙！","加入我們！我們有小米！","投降吧！我們有表格！"]},
 SLOGANS:{ccp:["土地改革！","投誠有飯吃！","我們有米","快投降！"]},
 TEXT:{kmt:{who:'總部',lives:'壯丁',
  respawn:["新壯丁到。繩子還綁著上一個","下一位！他一小時前還在買麵","補充兵送達。帳單已寄回他的村子"],
  kills:["+餉（又貶值了）","賺到薪水：一顆蛋","表哥？好像是","恕不退款","他有一塊田。曾經有。","發餉了！快點花掉"],
  noammo:"彈藥被軍需官賣掉了",food:"黑市白米",officer:"手提箱：黃金三公斤＋赴台船票一張",
  over:["您的犧牲將由委員會永遠銘記。該委員會已遷往台灣。","已通知家屬。撫卹金以金圓券發放，剛好夠買一張郵票。"]}},
 PLATES:["美國陸軍","大日本帝國","國軍","共軍","某軍閥","沒人（暫時）"],
 SCENES:[
  {pre:{date:'1946年6月',place:'華中',fact:"日本投降了。美國特使居中調停，促成國共停戰。到了夏天，全面內戰還是爆發了。",joke:"雙方只在一件事上意見一致：先破壞停戰的是對方。"},
   post:{date:'同一週稍晚',place:'同一個村子',fact:"前線的村莊一再易手。家家戶戶學會在家裡同時準備兩面旗子。",joke:"全省唯一發財的，是做旗子的。"}},
  {pre:{date:'1947年',place:'華北農村',fact:"土地改革席捲農村。兩軍都需要數百萬兵員和成噸糧食，於是徵兵（不一定很客氣），也徵收收成。",joke:"農民終於有了自己的地。然後兩邊軍隊都來借他的兒子。"},
   post:{date:'那年秋天',place:'鐵路沿線',fact:"鐵路一再被炸斷又修復，整條路線一年易主好幾次。",joke:"鐵路工人投票決定改用驢子。驢子投了棄權票。"}},
  {pre:{date:'1948年9月',place:'東北',fact:"遼瀋戰役在冰天雪地的東北展開。不到兩個月，國軍丟了整個東北，和將近五十萬兵力。",joke:"冬衣準時送到了──剛好趕上春天。"},
   post:{date:'1948年11月',place:'山中營地',fact:"鹵獲的美式裝備整列車整列車地換邊，很多還附著沒人看得懂的說明書。",joke:"英文說明書成了全東北最保暖的東西。"}},
  {pre:{date:'1948年8月',place:'上海',fact:"政府以三百萬比一，用新的金圓券取代舊法幣。不到一年就幾乎一文不值，大家提著整麻袋的鈔票去買菜。",joke:"經濟學家稱之為惡性通膨。上海人稱之為午餐。"},
   post:{date:'1949年5月',place:'上海',fact:"上海易手。進城的士兵出了名地露宿街頭，不進民宅。",joke:"鈔票也睡在人行道上。沒人想撿。"}},
  {pre:{date:'1949年4月20日',place:'長江',fact:"和談破裂。當晚，數十萬大軍乘著木船渡過長江。三天後，南京失守。",joke:"大家都記得渡江。沒人記得是誰在划船。"}}],
 // this game's own tables (resolved lazily: they live in game3d.js)
 FCRIES:["去死吧！共匪！","去死吧！共匪！","去死吧！共匪！","吃子彈吧，赤匪！","為了我的薪餉！"],
 MONEY:['¥1,000,000','¥5,000,000','¥10,000,000','金圓券！','新鈔！','¥50,000,000'],
 SC3:{
  nanjing:{date:'1949年4月23日',place:'南京',fact:"渡江三天後，首都失守。政府南遷廣州。然後遷重慶。然後遷成都。",joke:"總部稱之為「機動首都」。現在它有輪子，還有時刻表。"},
  shanghai:{date:'1949年5月',place:'上海',fact:"金圓券去年八月發行時，四元兌一美元。現在以百萬為單位交易。工人一天領兩次薪水。",joke:"一麻袋鈔票換一麻袋米。值錢的是麻袋。"},
  pier:{date:'1949年12月',place:'最後的碼頭',fact:"中華人民共和國已在十月宣布成立。政府正「暫時遷移」到海峽對岸。最後幾班船正在裝貨。",joke:"總部先上船，替你檢查船況。黃金又比總部更早上船。"}},
 END_SCENES:[
  {date:'同一時間，1949年',place:'其他所有地方',fact:"你打的六場仗全贏了。其他的仗，政府全輸了。其他的仗非常、非常多。",joke:"總部稱讚你的戰績是全戰爭最佳，然後蓋上「絕對機密」。免得破壞氣氛。"},
  {date:'1949年12月',place:'最後一班船',fact:"政府宣布「暫時遷移」到台灣。非常暫時。國庫黃金好幾個月前就先開船了，坐頭等艙。",joke:"你的金圓券薪餉只買得到站位。你的勳章買到站位的一個角落。戰車留在岸上，等第七任車主。"},
  {date:'1950年元旦',place:'台北',fact:"總部承諾：「明年就反攻大陸。」全軍歡呼。船上的行李卸下來了。大部分啦。",joke:"1951年元旦：「明年。」1952年：「明年。」講稿現在都提前印好，節省油墨。"}],
 STAGES:[
  {name:'圍村之戰',sub:['解救村民 · 讓喇叭閉嘴','小心屋頂。奪下那輛戰車。'],
   boss:{name:'多主戰車',short:'戰車',where:'南邊廣場',pop:'戰車到手。重新烤漆已排程。又一次。'},
   tx:Object.assign({},L0Z[0],{t900:"總部：屋頂有狙擊手。往上看。對，上面。現在連天空都是敵人了。"})},
  {name:'鐵路線',sub:['穿越稻田 · 幫農民鬆綁','攔下裝甲列車。它居然準點。'],
   boss:{name:'裝甲列車（1937年來首度準點）',short:'列車',where:'鐵路',pop:'列車攔下了。這幾週來第一次誤點。'},
   tx:Object.assign({},L0Z[1],{start2:"總部：農民被綁在籬笆樁上。兩邊都說是對方綁的。總之先鬆綁。",drop:"總部：空投！一挺機槍，外加一箱瘧疾藥。藥在1944年就過期了。",truck:"總部：稻田裡有擴音喇叭！青蛙已經投誠了。",t900:"總部：農舍裡有狙擊手。農民拜託你開槍時避開家具。"})},
  {name:'冰封山口',sub:['東北 · 零下三十度 · 沒有冬衣','守住山口。打下轟炸機。'],
   boss:{name:'轟炸機（燃料：大部分是水）',short:'轟炸機',where:'頭頂上',pop:'轟炸機墜毀。燃料果然是水。'},
   tx:Object.assign({},L0Z[2],{start2:"總部：更正：冬衣賣掉了。聽說收據很保暖。繼續前進。",drop:"總部：空投！一挺機槍和一本英文說明書。說明書拿去燒來取暖。",truck:"總部：雪地裡有敵軍喇叭。他們說有發冬衣。不准聽。好啦，聽一下下就好。",t900:"總部：懸崖上有狙擊手。他們跟你一樣冷，但比你有幹勁。"})},
  {name:'長江防線',sub:['1949年4月 · 死守江岸','擊沉砲艇。先看清楚它掛哪面旗。'],
   boss:{name:'忠誠度可調砲艇',short:'砲艇',where:'江面上',pop:'砲艇擊沉。它的旗子到最後都還沒決定。'},
   tx:Object.assign({},L0Z[4],{boss:"總部：砲艇！艦長今天已經換邊兩次。看清楚他掛哪面旗。然後照樣開火。",truck:"總部：岸上有敵軍喇叭在報比數。不准看比數。",start2:"總部：更正。長官們已經抵達對岸了。還有對岸的對岸。",t900:"總部：船屋裡有狙擊手。還有蚊子。其中只有一種收紅包。",win:"總部：砲艇擊沉！太好了。可惜，一百萬大軍從別的地方渡江了。"})},
  {name:'上海',sub:['1949年5月 · 物價每小時翻倍','奪回印鈔機。'],
   boss:{name:'印鈔機（落入敵手）',short:'印鈔機',where:'造幣廠',pop:'印鈔機停了。通膨自己會繼續。'},
   tx:Object.assign({},L0Z[3],{start2:"總部：你的薪餉到了。在講這句話的同時，它已經貶值了。",drop:"總部：空投！一挺機槍，用鈔票包著。鈔票是緩衝材。",t900:"總部：騎樓上有狙擊手。上面的房租比米還便宜。",win:"總部：印鈔機到手！現在來印勝利獎金。晚餐前就會變廢紙。"})},
  {name:'最後的碼頭',sub:['1949年12月 · 最後一班船今天開','守住碼頭。其他人都已經上船了。'],
   boss:{name:'會走路的看板（臉部待核准）',short:'看板',where:'碼頭',pop:'看板倒了。船五分鐘後開。'},
   tx:{start:"總部：守住碼頭，直到最後一班船開走。總部會在船上督戰。這艘船被督得非常好。",start2:"總部：提醒：每人限帶一只皮箱。金條算一只皮箱。長官的金條不算。",drop:"總部：碼頭上撿到一挺機槍。它原本算在黃金的行李額度裡。",truck:"總部：喇叭叫你留下。我們叫你走。沒有人跟你說實話。",mid:"總部：最後一包金圓券薪餉已發放。請拿去當船票。不會成功的。",t900:"總部：倉庫上有狙擊手。倉庫是空的。我們打包帶走了。",boss:"總部：有個巨大的東西沿著碼頭走過來。它有一張臉。那張臉還沒人核准。",win:"總部：漂亮。勝利！現在請上船。戰爭結束了。我們在別的地方輸掉了。"}}]
};
const isObj=v=>v!==null&&typeof v==='object';
function grab(tgt,src){if(Array.isArray(src))return src.some(isObj)?src.map((v,i)=>isObj(v)?grab(tgt[i],v):tgt[i]):tgt.slice();const o={};for(const k in src)o[k]=isObj(src[k])?grab(tgt[k],src[k]):tgt[k];return o}
function put(tgt,src){if(Array.isArray(src)){if(src.some(isObj))src.forEach((v,i)=>{if(isObj(v)&&isObj(tgt[i]))put(tgt[i],v)});else{tgt.length=0;tgt.push(...src)}return}
 for(const k in src){const v=src[k];if(isObj(v)&&isObj(tgt[k]))put(tgt[k],v);else tgt[k]=v}}
let REF=null,EN_DATA=null;const X_ZH=new Map(),X_EN=new Map();
function i18nInit(){if(REF)return;
 REF={POW_LINES,DEFECT,TAUNTS,SLOGANS,TEXT,PLATES,SCENES,FCRIES,MONEY,SC3,END_SCENES,STAGES};
 EN_DATA={};for(const k in ZH)EN_DATA[k]=grab(REF[k],ZH[k]);
 (function pair(e,z){if(typeof e==='string'&&typeof z==='string'){if(e!==z){X_ZH.set(e,z);X_EN.set(z,e)}return}if(isObj(e)&&isObj(z))for(const k in z)pair(e[k],z[k])})(EN_DATA,ZH);
 for(const k in ZH_UI){X_ZH.set(k,ZH_UI[k]);X_EN.set(ZH_UI[k],k)}}
// lines already on screen (radio, shouts, villager bubbles, pops) switch language too
function relabel(){const m=LANG==='zh'?X_ZH:X_EN,f=s=>m.get(s)??s;
 if(radioCur)radioCur.s=f(radioCur.s);radioQ=radioQ.map(f);shoutTxt=f(shoutTxt);for(const e of ents)if(e.shoutTxt)e.shoutTxt=f(e.shoutTxt);
 for(const v of pows)if(v.say)v.say=f(v.say);for(const p of wpops)p.s=f(p.s)}

/* ---- language-aware canvases in the 3D world (signs, banners, plates): redrawn in place on switch ---- */
const LSIGNS=[];
function lcan(w,h,f){const c=mk(w,h,f);LSIGNS.push({c,f});return c}
function redrawSigns(){for(const s of LSIGNS){const g=s.c.getContext('2d');g.clearRect(0,0,s.c.width,s.c.height);s.f(g);const t=TXC.get(s.c);if(t)t.needsUpdate=true}}
// centred one-line label that shrinks to fit: CJK in Chinese, the given pixel/mono font in English
function signText(g,en,zh,cx,cy,maxW,px,col,enFont){g.fillStyle=col;g.textAlign='center';g.textBaseline='middle';const s=LANG==='zh'?zh:en;
 g.font=LANG==='zh'?`900 ${px}px ${ZFAM}`:(enFont||`bold ${px}px monospace`);const w=g.measureText(s).width;
 if(w>maxW){g.save();g.translate(cx,cy);g.scale(maxW/w,1);g.fillText(s,0,0);g.restore()}else g.fillText(s,cx,cy);g.textAlign='left';g.textBaseline='alphabetic'}

/* ---- canvas text: CJK-aware overrides of the shared helpers (English path is the untouched original) ---- */
const isDark=c=>{const m=/^#([0-9a-f]{6})/i.exec(c);if(!m)return false;const v=parseInt(m[1],16);return((v>>16)*.3+((v>>8)&255)*.59+(v&255)*.11)<70};
const _txt=txt,_drawShout=drawShout,_drawBubble=drawBubble,_drawSceneZ=drawScene,_sceneArtZ=sceneArt,_wordSprite=wordSprite;
txt=function(s,x,y,c='#e9dcc2',al='left',font=F){if(LANG!=='zh'){if(!isDark(c))return _txt(s,x,y,c,al,font);ctx.font=font;ctx.textAlign=al;ctx.textBaseline='top';ctx.fillStyle=c;ctx.fillText(s,x,y);return}
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
 if(name==='table'){zLabel('停',152,89,26,12,10);zLabel('戰',202,89,26,12,10)}
 else if(name==='paddy')zLabel('地契',182,80,20,13,9)};
// flying slogans / banknotes: size the plate to the measured text
{const mkW=t=>{const g0=ctx;g0.font=`700 11px ${ZFAM}`;const w=Math.ceil(g0.measureText(t).width)+8;
  return{n:mk(w,15,g=>{R(g,0,0,w,15,'#120d0cdd');g.fillStyle='#ff7d6e';g.font=`700 11px ${ZFAM}`;g.textBaseline='middle';g.fillText(t,4,8)})}};
 wordSprite=function(t){if(!CJK_RE.test(t))return _wordSprite(t);const k='wz|'+t;let s=SPC.get(k);if(!s){s=mkW(t);SPC.set(k,s)}return s}}
// the US AID crate (shared sprite): one language-aware canvas shared by every crate
{let CR=null;const drawCrate=g=>{R(g,1,4,30,28,'#7a5a35');R(g,1,4,30,2,'#9c7a4c');for(let y=10;y<32;y+=7)R(g,1,y,30,1,'#5a4025');R(g,1,4,3,28,'#5a4025');R(g,28,4,3,28,'#5a4025');
  if(LANG==='zh'){g.fillStyle='#3a2a1a';g.font=`900 11px ${ZFAM}`;g.textAlign='center';g.textBaseline='middle';g.fillText('美援',16,19);g.textAlign='left';g.textBaseline='alphabetic'}else{g.fillStyle='#3a2a1a';g.font='bold 9px monospace';g.fillText('US AID',5,20)}};
 PROPS.crate=()=>{if(!CR){const c=lcan(32,32,drawCrate);CR={n:c,f:c}}return CR}}
// hyperinflation can outrun the unit table (1e27+)
{const _fmtBig=fmtBig;fmtBig=function(n){return n>=1e27||!isFinite(n)?'999OC+':_fmtBig(n)}}

/* ---- HTML overlays ---- */
const ZH_HTML={
 h1:'國共大戰：圍村<span>CIVIL SLUG: VILLAGE SIEGE · 六關 · 第一人稱 3D</span>',
 tag:'從村口一路打到最後一個碼頭，六場仗，六個頭目，包括一輛換過六個主人的戰車。主角只有一個壯丁，薪餉用金圓券發。',
 natI:'國民革命軍 · 壯丁',
 natS:'你的薪餉每十秒依通膨調整一次。往下調。',
 enlist:'▶ 從軍去',
 keys:'<span class="kbd">按鍵：W A S D 移動 · 滑鼠瞄準（先點一下遊戲畫面）· 左鍵或 J 開火，貼身自動用刀 · 空白鍵 跳 · G 手榴彈 · Q 換槍 · 方向鍵也能瞄準 · P 暫停<br></span>手機：左手拇指走路，右手拇指拖曳往任何方向瞄準。點一下畫面可跳過劇情。',
 fine:'諷刺作品。這場戰爭裡沒有一方是好人。村民的地主尤其不是。',
 rot:'請把手機轉橫：這場仗要橫著打',
 tfire:'開火',tgren:'手榴彈',tswap:'換槍',tjump:'跳'};
const EN_HTML={};
const ARIA={cv:['Civil Slug: Village Siege game screen','國共大戰：圍村 遊戲畫面'],gl:['Civil Slug: Village Siege 3D view','國共大戰：圍村 3D 畫面'],bPause:['Pause','暫停'],bSnd:['Toggle sound','切換音效'],bLang:['切換為中文','Switch to English']};
function sndLabel(){const b=$('#bSnd');if(b)b.textContent=tr(muted?'MUTE':'SND')}
function applyLang(l,save){i18nInit();LANG=l==='en'?'en':'zh';const zh=LANG==='zh';
 if(save)try{localStorage.setItem(LANG_KEY,LANG)}catch(e){}
 for(const k in ZH)put(REF[k],zh?ZH[k]:EN_DATA[k]);relabel();
 document.documentElement.lang=zh?'zh-Hant':'en';document.documentElement.classList.remove('boot');document.title=zh?'國共大戰：圍村 Civil Slug: Village Siege':'Civil Slug: Village Siege 國共大戰：圍村';
 document.querySelectorAll('[data-t]').forEach(el=>{const k=el.dataset.t;if(EN_HTML[k]==null)EN_HTML[k]=el.innerHTML;el.innerHTML=zh&&ZH_HTML[k]!=null?ZH_HTML[k]:EN_HTML[k]});
 for(const id in ARIA){const el=$('#'+id);if(el)el.setAttribute('aria-label',ARIA[id][zh?1:0])}
 document.querySelectorAll('.lang button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.l===LANG)));
 const bl=$('#bLang');if(bl){bl.textContent=zh?'EN':'中文';bl.lang=zh?'en':'zh-Hant'}
 sndLabel();redrawSigns();if(typeof boss!=='undefined'&&boss&&boss.plateCv)drawPlate();
 showCont();fit();if(!$('#end').hidden)fillEnd();
 if(zh&&document.fonts)document.fonts.load(zf(F),'國軍').then(()=>{redrawSigns();SPC.forEach((v,k)=>{if(k.startsWith('wz|'))SPC.delete(k)})}).catch(()=>{})}
