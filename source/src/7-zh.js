/* ---------------- i18n: English / 繁體中文 (Civil Slug only — shared data is swapped in place, never edited) ---------------- */
var LANG='en';
const LANG_KEY='civilslug.lang';
const ZFAM='"Noto Sans TC","Noto Sans CJK TC","PingFang TC","Microsoft JhengHei","Heiti TC","Source Han Sans TC",sans-serif';
const CJK_RE=/[⺀-鿿豈-﫿＀-￯　-〿]/;
const isZ=s=>LANG==='zh'&&CJK_RE.test(String(s));
// canvas CJK font for a given pixel-font size (8px pixel text -> 11px CJK, 16px -> bold 16px)
function zf(font){const m=/(\d+)px/.exec(font||F),p=m?+m[1]:8;return p>=16?`700 16px ${ZFAM}`:p<=6?`500 8px ${ZFAM}`:`500 11px ${ZFAM}`}
function fontFor(s,font=F){return isZ(s)?zf(font):font}
// text width: English keeps the original fixed 8px/char metric so layout is unchanged
function tw(s,font=F){s=String(s);if(!isZ(s))return s.length*(/16px/.test(font)?16:8);ctx.font=zf(font);return Math.ceil(ctx.measureText(s).width)}
// wrap by measured width (uses the current ctx.font); CJK breaks anywhere, latin words stay whole, no closing punctuation at line start
function wrapPx(s,maxW){const toks=String(s).match(/[A-Za-z0-9¥$%'’.,!?:\/+\-–—()]+|\s+|[\s\S]/gu)||[];const out=[];let line='';
 for(const tk of toks){const test=line+tk;
  if(line.trim()&&ctx.measureText(test.trimEnd()).width>maxW&&!/^[，。、！？：；）」』…—,.!?)\s]/.test(tk)){out.push(line.trim());line=/^\s+$/.test(tk)?'':tk}else line=test}
 if(line.trim())out.push(line.trim());return out}

/* ---- UI strings (English source -> 繁體中文) ---- */
const ZH_UI={
 '1UP! ANOTHER CONSCRIPT ARRIVES':'1UP！又抓來一個壯丁',
 'THE HORSE WAS ALSO CONSCRIPTED':'這匹馬也是被抓來的',
 '-500. EVEN THIS WAR HAS PAPERWORK':'-500。打仗也是要寫報告的',
 'CHUTE CUT':'傘繩斷了',
 'DEFECTED ONCE. RETIRED FOR GOOD.':'投誠一次，永久退休。',
 'ARMORED':'有裝甲',
 'OWNERSHIP TRANSFERRED':'所有權已轉移',
 'ARMOR GONE! HIT THE CORE!':'裝甲沒了！打核心！',
 'HEE-HAW (UNION GRIEVANCE)':'咿──啊（向工會申訴）',
 "DROWNED. THE RIVER DOESN'T TAKE SIDES":'淹死了。江水不選邊站',
 'THE DONKEY HAS FILED FOR RETIREMENT':'驢子已提出退休申請',
 'SV-46 RETURNED TO ITS SEVENTH OWNER':'SV-46 回到第七任車主手上',
 'OUT OF SHELLS':'砲彈打完了',
 'DONKEY SLUG! (UNDER PROTEST)':'驢子戰車！（驢子抗議中）',
 'SV-46! (7TH OWNER)':'SV-46！（第七任車主）',
 'TIP: GET UNDER IT. HOLD ↑ TO AIM UP':'提示：鑽到它底下，按住 ↑ 朝上射擊',
 'TIP: HOLD ↑ TO AIM UP':'提示：按住 ↑ 朝上射擊',
 'IT WAS A MIRROR. IT WAS ALWAYS A MIRROR.':'那是一面鏡子。從頭到尾都是鏡子。',
 'TRUCK SILENCED. SLOGANS CONTINUE ELSEWHERE':'廣播車閉嘴了。口號在別處繼續喊',
 'PEACE TALKS HAVE BROKEN DOWN. ALSO THE CAR.':'和談破裂了。車子也破了。',
 'GUNBOAT SUNK. CAPTAIN DEFECTS, AS PROMISED.':'砲艇擊沉。艦長依約投誠。',
 'CLEARED':'清除完畢',
 'SLOGAN REFUTED':'口號已駁斥',
 'KILLED BY A SLOGAN':'被口號打死了',
 'CRUSHED BY INFLATION':'被通膨壓垮了',
 'SHELLS +10':'砲彈 +10',
 'GRENADES +8':'手榴彈 +8',
 '+3000 GOLD (CONFISCATED)':'+3000 黃金（充公）',
 '▼ RIDE':'▼ 搭乘',
 'SHELLS':'砲彈','DONKEY':'驢子','PISTOL':'手槍','BOMB':'手榴彈',
 'WARNING':'警告','MISSION COMPLETE!':'任務完成！','PAUSED':'暫停',
 'THE WAR WILL WAIT. IT ALWAYS DOES.':'戰爭會等你。它一向很有耐心。',
 // tally
 'ENEMIES DISPATCHED':'擊倒敵軍','VILLAGERS UNTIED':'解救村民','DEFECTORS RECRUITED':'招降投誠','BONUS':'獎勵','RANK: ':'評價：','▶ CONTINUE':'▶ 繼續',
 'HERO OF THE (CORRECT) PEOPLE':'（正確的）人民英雄','DECORATED (TIN MEDAL)':'獲頒勳章（錫做的）','ADEQUATE CANNON FODDER':'合格砲灰','STATISTIC':'統計數字',
 // end / menus
 "YOU WON. THE WAR DIDN'T.":'你贏了。但戰爭輸了。',
 'Five missions won. One civil war lost. Report to the island for temporary duty. The counterattack is scheduled for next year. It always will be.':'五場任務全勝，一場內戰全敗。請到島上報到，執行「暫時性」勤務。反攻大陸預定明年發動。永遠都是明年。',
 'Reached':'抵達','Enemies dispatched':'擊倒敵軍','Conscripts spent':'消耗壯丁','Defectors gained':'招降投誠','Villagers untied':'解救村民','Pay':'薪餉',
 'PLAY AGAIN':'再玩一次','DRAFT 3 MORE':'再抓三個壯丁','MISSIONS':'任務選單','TITLE':'回標題',
 '3 MORE DRAFTED. THEIR VILLAGE IS NOW EMPTY':'又抓了三個壯丁。他們村子空了',
 'NATIONALIST CAMPAIGN':'國軍戰役','LOCKED':'未解鎖','CHOOSE A MISSION':'選擇任務',
 'SND':'音效','MUTE':'靜音',
 // KMT ending art
 'FRONT':'前線','MISSIONS: 5/5':'任務：5/5','WAR: 0/1':'戰爭：0/1','GOLD →':'黃金 →','TICKET':'船票','ONE CHINA!':'一個中國！',
 // labels drawn by the shared scene art (translated at draw time)
 'HELP!':'救命！','APPROVAL':'待核准','COATS':'冬衣','APR':'四月','MANUAL':'說明書','FLAGS · 旗':'各式旗幟','TEMPORARY':'暫時','FORM 1':'表格一'
};
const ZH_PREFIX=[['RICE: ¥','米價：¥'],['NOTES PRINTED: ','已印鈔票：'],['PROPERTY OF: ','所屬：']];
function tr(s){if(LANG!=='zh')return s;const z=ZH_UI[s];if(z!=null)return z;for(const[a,b]of ZH_PREFIX)if(typeof s==='string'&&s.startsWith(a))return b+s.slice(a.length);return s}

/* ---- data tables: zh-TW versions of the shared tables (swapped in place on language change) ---- */
const ZH={
 POW_LINES:["這禮拜兩邊都來抓我當兵。下禮拜我兩邊都不想去。","你是哪一邊的？……算了。這個拿去，牛留下。","他們牽走我的牛。另一邊抓走牛的替代品：我。","地主跑了。收稅的不知道為什麼還在。","謝謝！下次麻煩去解放別的村子。","我保持中立。結果兩邊都朝我開槍。","大兒子跟你們，小兒子跟他們。吃年夜飯很尷尬。","我已經被解放六次了。好累。","拿去。本來要留給打贏的那邊，先給你吧。","跟你們將軍說，我還在等1946年的軍餉。我是農夫欸。"],
 DEFECT:["我投降！我是來吃飯的","我要投誠！在哪裡簽名？","換邊！一樣打仗，飯比較好吃？","長官跑了，我也跑。","全連都要過來。我們投票表決過了。"],
 CRIES:{kmt:["去死吧！共匪！","去死吧！共匪！","去死吧！共匪！","吃子彈吧，赤匪！","為了我的薪餉！"],ccp:["打倒國民黨走狗！","打倒國民黨走狗！","為了集體！","粉碎反動派！"]},
 TAUNTS:{kmt:["去死吧，赤匪！","你的人頭值金圓券！","我們有美國槍！","我長官就在我後面！……應該吧"],ccp:["快跑啊，走狗！","你們的錢是衛生紙！","加入我們！我們有小米！","投降吧！我們有表格！"]},
 SLOGANS:{ccp:["土地改革！","投誠有飯吃！","我們有米","快投降！"],kmt:["通膨沒問題","美國要來了","黃金很安全","共匪壞壞！"]},
 WEAPONS:{H:{name:'重機槍'},S:{name:'霰彈槍'},R:{name:'巴祖卡（美援）'},F:{name:'火焰噴射器'}},
 TEXT:{kmt:{who:'總部',lives:'壯丁',
  respawn:["新壯丁到。繩子還綁著上一個","下一位！他一小時前還在買麵","補充兵送達。帳單已寄回他的村子"],
  kills:["+餉（又貶值了）","賺到薪水：一顆蛋","表哥？好像是","恕不退款","他有一塊田。曾經有。","發餉了！快點花掉"],
  noammo:"彈藥被軍需官賣掉了",food:"黑市白米",officer:"手提箱：黃金三公斤＋赴台船票一張",
  over:["您的犧牲將由委員會永遠銘記。該委員會已遷往台灣。","已通知家屬。撫卹金以金圓券發放，剛好夠買一張郵票。"],
  levels:[
   {start:"總部：不惜一切代價守住這條路。援軍已在路上。",start2:"總部：更正。援軍被賣掉了。錢安全存在上海。",drop:"總部：美援到了！內容：四百條香菸和一挺機槍。兩樣都不准分。",truck:"總部：敵軍廣播車！不准聽。第三連已經有一半聽進去了。",mid:"總部：你的薪餉已依通膨調整。請匯款給我們。",boss:"總部：摧毀那輛戰車。它上禮拜還是我們的。再之前是美國的。再之前是日本的。",win:"總部會把這場勝利報告成「戰略性撤退」，以策安全。"},
   {start:"總部：穿越稻田前進。別踩壞莊稼，已經賣給三個買家了。",vehicle:"總部：我們徵用了一頭驢，在牠背上綁了一門砲。驢子沒同意。你也沒有。",mid:"總部：農民一直叫我們「另一群土匪」。請多微笑。",boss:"總部：裝甲列車！1937年以來第一班準點的火車。照樣給我炸了。",win:"總部：幹得好。車上載的是我們自己的軍餉。反正也不值錢了。"},
   {start:"總部：守住山口。冬衣已經訂了。預計到貨：明年冬天。",mid:"總部：傘兵來了！我們的、他們的……這種高度誰分得出來？",boss:"總部：敵機來襲！別擔心，油是我們賣給他們的。大部分是水。",win:"總部：山口確保！我們現在可以有秩序地從這裡撤退了。"},
   {start:"總部：保衛大上海！市面平靜。物價從早餐到現在才漲了三倍。",vehicle:"總部：開走那輛戰車。文件上寫「我方所有」。車組員說「已經不是了」。",truck:"總部：前方裝甲車！還有銀行擠兌。只准對其中一個開槍。",mid:"總部：記住，一袋金圓券拿來擋子彈，比拿去買米好用。",boss:"總部：印鈔機落入敵手！沒有它，我們要怎麼印一文不值的錢？",win:"總部：上海守住了一整個下午。個人最佳紀錄。"},
   {start:"總部：死守長江防線！長官們會在對岸督戰。然後在更遠的地方督戰。",drop:"總部：空投！一支巴祖卡，外加一封措辭強烈的信。",truck:"總部：砲艇！艦長今天已經換邊兩次。看清楚他掛哪面旗。",mid:"總部：前方是陸地。不知道是誰的地。文件審核中。",boss:"總部：有個巨大的東西正在登陸。情報說它有一張臉。那張臉還沒人核准。",win:"總部：幹得好。請登上最後一班船。黃金帶走，收據留下。"}]}},
 BOSSNAME:{truck:()=>'人民之聲',tank:()=>'多主戰車',train:()=>'準點特快車',bomber:()=>EN==='kmt'?'美援轟炸機':'鹵獲轟炸機（說明書是英文）',
  car:()=>'裝甲車「和談號」',press:()=>EN==='kmt'?'中央銀行印鈔機':'人民印刷廠',gunboat:()=>'砲艇「忠誠號」（旗子可翻面）',mech:()=>'偉大領袖（臉部待核准）'},
 PLATES:["美國陸軍","大日本帝國","國軍","共軍","某軍閥","沒人（暫時）"],
 LEVELS:[{name:'死守公路',sub:'這個村子今年已經易手四次'},{name:'稻田突擊',sub:'每一粒米都有主了。還有兩個。'},{name:'冰封山口',sub:'冬衣：已訂購。到貨：春天。'},{name:'上海 1949',sub:'一條麵包現在要一推車的鈔票'},{name:'長江防線',sub:'江面寬一哩。和談的鴻溝更寬。'}],
 SCENES:[
  {pre:{date:'1946年6月',place:'華中',fact:"日本投降了。美國特使居中調停，促成國共停戰。到了夏天，全面內戰還是爆發了。",joke:"雙方只在一件事上意見一致：先破壞停戰的是對方。"},
   post:{date:'同一週稍晚',place:'同一個村子',fact:"前線的村莊一再易手。家家戶戶學會在家裡同時準備兩面旗子。",joke:"全省唯一發財的，是做旗子的。"}},
  {pre:{date:'1947年',place:'華北農村',fact:"土地改革席捲農村。兩軍都需要數百萬兵員和成噸糧食，於是徵兵（不一定很客氣），也徵收收成。",joke:"農民終於有了自己的地。然後兩邊軍隊都來借他的兒子。"},
   post:{date:'那年秋天',place:'鐵路沿線',fact:"鐵路一再被炸斷又修復，整條路線一年易主好幾次。",joke:"鐵路工人投票決定改用驢子。驢子投了棄權票。"}},
  {pre:{date:'1948年9月',place:'東北',fact:"遼瀋戰役在冰天雪地的東北展開。不到兩個月，國軍丟了整個東北，和將近五十萬兵力。",joke:"冬衣準時送到了──剛好趕上春天。"},
   post:{date:'1948年11月',place:'山中營地',fact:"鹵獲的美式裝備整列車整列車地換邊，很多還附著沒人看得懂的說明書。",joke:"英文說明書成了全東北最保暖的東西。"}},
  {pre:{date:'1948年8月',place:'上海',fact:"政府以三百萬比一，用新的金圓券取代舊法幣。不到一年就幾乎一文不值，大家提著整麻袋的鈔票去買菜。",joke:"經濟學家稱之為惡性通膨。上海人稱之為午餐。"},
   post:{date:'1949年5月',place:'上海',fact:"上海易手。進城的士兵出了名地露宿街頭，不進民宅。",joke:"鈔票也睡在人行道上。沒人想撿。"}},
  {pre:{date:'1949年4月20日',place:'長江',fact:"和談破裂。當晚，數十萬大軍乘著木船渡過長江。三天後，南京失守。",joke:"大家都記得渡江。沒人記得是誰在划船。"},post:null}],
 ENDING:{last:"接下來七十五年，海峽兩岸只在一件事上意見一致：只有一個中國。至於是哪一個，到現在還喬不攏。"},
 KMT_ENDING:[
  {date:'1949年4月－11月',place:'其他所有地方',fact:"你的五場任務全勝。同一時間，其他部隊丟了南京、上海、廣州，還有地圖上大部分的地方。",joke:"總部頒給你一枚勳章，因為你打贏了。外加一張船票，理由一樣。"},
  {date:'1949年12月',place:'最後一班船',fact:"政府「暫時遷移」到台灣。國庫黃金好幾個月前就悄悄搶先上船了。",joke:"船票要一袋金圓券。你剛好有一袋。等到登船時，變成要兩袋。"},
  {date:'1949年12月 →',place:'台北（暫時）',fact:"早在十月，中華人民共和國就在北京宣布成立。總部稱之為「暫時性的挫折」。非常暫時。",joke:"「明年就反攻大陸！」1950年這麼說。1951年也是。1952年。1953年。還有……"},
  {date:'後來',place:'台灣海峽',fact:"接下來七十五年，海峽兩岸只在一件事上意見一致：只有一個中國。至於是哪一個，到現在還喬不攏。",joke:"順帶一提，那頭驢子始終保持中立。"}],
 KMT_CREDITS:["國共大戰 1946–1949","","任務勝場：5／5","內戰勝場：0／1","","領銜主演","數百萬壯丁（無薪）","一頭驢（非自願）","一輛換過六個主人的戰車","國庫黃金（提早離場）","一袋金圓券（一文不值）","","本戰爭製作期間","未曾徵詢任何村民意見","","反攻大陸：","預定明年","（每年都是）","","感謝遊玩"]
};
const REF={POW_LINES,DEFECT,CRIES,TAUNTS,SLOGANS,WEAPONS,TEXT,BOSSNAME,PLATES,LEVELS,SCENES,ENDING,KMT_ENDING,KMT_CREDITS};
const isObj=v=>v!==null&&typeof v==='object';
function grab(tgt,src){if(Array.isArray(src))return src.some(isObj)?src.map((v,i)=>isObj(v)?grab(tgt[i],v):tgt[i]):tgt.slice();const o={};for(const k in src)o[k]=isObj(src[k])?grab(tgt[k],src[k]):tgt[k];return o}
function put(tgt,src){if(Array.isArray(src)){if(src.some(isObj))src.forEach((v,i)=>{if(isObj(v)&&isObj(tgt[i]))put(tgt[i],v)});else{tgt.length=0;tgt.push(...src)}return}
 for(const k in src){const v=src[k];if(isObj(v)&&isObj(tgt[k]))put(tgt[k],v);else tgt[k]=v}}
const EN_DATA={};for(const k in ZH)EN_DATA[k]=grab(REF[k],ZH[k]);
// bidirectional string map so lines already on screen (radio, shouts, pops, villager bubbles) switch language too
const X_ZH=new Map(),X_EN=new Map();
(function pair(e,z){if(typeof e==='string'&&typeof z==='string'){X_ZH.set(e,z);X_EN.set(z,e);return}if(isObj(e)&&isObj(z))for(const k in z)pair(e[k],z[k])})(EN_DATA,ZH);
for(const k in ZH_UI){X_ZH.set(k,ZH_UI[k]);X_EN.set(ZH_UI[k],k)}
function relabel(){const m=LANG==='zh'?X_ZH:X_EN,f=s=>m.get(s)??s;
 if(radioCur)radioCur.s=f(radioCur.s);radioQ=radioQ.map(f);for(const b of shouts)b.s=f(b.s);for(const p of pops)p.s=f(p.s);for(const w of pows)if(w.say)w.say=f(w.say)}

// dark ink on paper props: an outline would turn CJK strokes into a blob
const isDark=c=>{const m=/^#([0-9a-f]{6})/i.exec(c);if(!m)return false;const v=parseInt(m[1],16);return((v>>16)*.3+((v>>8)&255)*.59+(v&255)*.11)<70};
/* ---- canvas text: CJK-aware overrides of the shared helpers (English path is the untouched original) ---- */
const _txt=txt,_drawShout=drawShout,_drawBubble=drawBubble,_drawSceneZ=drawScene,_sceneArtZ=sceneArt,_drawCar=drawCar;
txt=function(s,x,y,c='#e9dcc2',al='left',font=F){if(LANG!=='zh'){if(!isDark(c))return _txt(s,x,y,c,al,font);ctx.font=font;ctx.textAlign=al;ctx.textBaseline='top';ctx.fillStyle=c;ctx.fillText(s,x,y);return}s=tr(String(s));if(!CJK_RE.test(s))return _txt(s,x,y,c,al,font);
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
 let sz=12,LH=13,fl,jl;for(;;){ctx.font=`500 ${sz}px ${ZFAM}`;fl=wrapPx(sc.fact,W-16);jl=wrapPx(sc.joke,W-16);if((fl.length+jl.length)*LH+3<=H-153||sz<=10)break;sz--;LH--}
 const shown=Math.floor(t*.7);let n=0;ctx.textAlign='left';ctx.textBaseline='middle';
 fl.forEach((l,i)=>{const v=l.slice(0,Math.max(0,shown-n));n+=l.length;ctx.fillStyle='#e9dcc2';ctx.fillText(v,8,153+i*LH+LH/2)});
 jl.forEach((l,i)=>{const v=l.slice(0,Math.max(0,shown-n));n+=l.length;ctx.fillStyle='#ff9a6a';ctx.fillText(v,8,156+(fl.length+i)*LH+LH/2)});
 ctx.textBaseline='top';if(shown>n+10&&T%40<26)_txt('▶',W-16,H-12,'#d9a441');
 return shown>n};
// small paper props drawn by the shared art: repaint them with Chinese words
function zLabel(s,x,y,w,h,px){r(x,y,w,h,'#e9dcc2');ctx.font=`700 ${px}px ${ZFAM}`;ctx.fillStyle='#120d0c';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s,x+w/2,y+h/2+.5);ctx.textAlign='left';ctx.textBaseline='top'}
sceneArt=function(name,t){_sceneArtZ(name,t);if(LANG!=='zh')return;
 if(name==='table'){zLabel('停',152,89,26,12,10);zLabel('戰',202,89,26,12,10)}
 else if(name==='paddy')zLabel('地契',182,80,20,13,9)};
drawCar=function(b){_drawCar(b);if(LANG==='zh'){const x=Math.round(b.x-camX);zLabel('和平',x+44,b.y-21,16,9,7)}};

/* ---- HTML overlays ---- */
const ZH_HTML={
 h1:'國共大戰<span>CIVIL SLUG · 1946 – 1949 · 五場任務</span>',
 tag:'一款橫向射擊遊戲，講一場敵人往往是誰家表哥的戰爭。',
 nat:'國民革命軍',
 natd:'薪餉用金圓券發。每天發，因為明天就不值錢了。每一仗都打贏，然後看看結果如何。',
 enlist:'▶ 從軍去',
 keys:'<span class="kbd">按鍵：← → 移動 · ↑ 朝上瞄準 · ↓ 蹲下 · J 開火（近身用刀）· K 跳躍 · L 手榴彈／砲彈 · ↓+K 下車 · P 暫停<br></span>手機：左手搖桿，右手按鈕。點一下畫面可跳過劇情。',
 fine:'諷刺作品。兩邊軍隊一樣被挖苦。村民不管誰贏都是輸家。劇透：你也是。',
 back:'返回',rot:'把手機轉橫，戰爭更大場',tfire:'開火',tjump:'跳',tbomb:'手榴彈'};
const EN_HTML={};document.querySelectorAll('[data-t]').forEach(el=>EN_HTML[el.dataset.t]=el.innerHTML);
const ARIA={cv:['Civil Slug game screen','國共大戰遊戲畫面'],bPause:['Pause','暫停'],bSnd:['Toggle sound','切換音效']};
function applyLang(l,save){LANG=l==='zh'?'zh':'en';const zh=LANG==='zh';
 if(save)try{localStorage.setItem(LANG_KEY,LANG)}catch(e){}
 for(const k in ZH)put(REF[k],zh?ZH[k]:EN_DATA[k]);relabel();
 document.documentElement.lang=zh?'zh-Hant':'en';document.title=zh?'國共大戰 Civil Slug 1946':'Civil Slug 1946';
 document.querySelectorAll('[data-t]').forEach(el=>{const k=el.dataset.t;el.innerHTML=zh&&ZH_HTML[k]!=null?ZH_HTML[k]:EN_HTML[k]});
 for(const id in ARIA)$('#'+id).setAttribute('aria-label',ARIA[id][zh?1:0]);
 document.querySelectorAll('.lang button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.l===LANG)));
 const bl=$('#bLang');bl.textContent=zh?'EN':'中文';bl.lang=zh?'en':'zh-Hant';
 $('#mH').textContent=tr('CHOOSE A MISSION');sndLabel();
 if(!$('#missions').hidden)openMissions('kmt');
 if(!$('#end').hidden){showEnd.keep=true;showEnd.nofocus=true;showEnd(endMode)}
 if(zh&&document.fonts)document.fonts.load(zf(F),'國軍').catch(()=>{})}
document.querySelectorAll('.lang button').forEach(b=>b.addEventListener('click',()=>applyLang(b.dataset.l,true)));
$('#bLang').addEventListener('click',e=>{applyLang(LANG==='zh'?'en':'zh',true);e.currentTarget.blur()});
applyLang((()=>{try{const v=localStorage.getItem(LANG_KEY);if(v==='en'||v==='zh')return v}catch(e){}return 'zh'})(),false);
// hyperinflation can outrun the unit table (1e27+): keep the number on screen instead of printing 1.2e+30OC
{const _fmtBig=fmtBig;fmtBig=function(n){return n>=1e27||!isFinite(n)?'999OC+':_fmtBig(n)}}
