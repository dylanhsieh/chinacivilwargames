/* ===================== MING AN: EXPEDITION 48 — a Civil Slug turn-based RPG ===================== */
/* ---------------- six chapters, one long road: Shanghai → the countryside → the bridge → the Mint → Huaihai → the last pier ---------------- */
/* ---------------- i18n core: 繁體中文 default, English optional (strings resolved at draw time) ---------------- */
let LANG='zh';const LANG_KEY='mingan.lang';
try{const v=localStorage.getItem(LANG_KEY);if(v==='en'||v==='zh')LANG=v}catch(e){}
const ZFAM='"Noto Sans TC","Noto Sans CJK TC","PingFang TC","Microsoft JhengHei","Heiti TC","Source Han Sans TC","WenQuanYi Micro Hei",sans-serif';
const CJK_RE=/[⺀-鿿豈-﫿＀-￯　-〿]/;
const LZ=(e,z)=>LANG==='zh'?z:e;
const ZF=(px,w=500)=>`${w} ${px}px ${ZFAM}`;
const SERIF2=s=>`900 ${s}px "Noto Serif TC","Noto Serif CJK TC","Songti TC","PMingLiU",Georgia,${ZFAM}`;
const MISS=new Set();
function tr(s){if(LANG!=='zh'||typeof s!=='string')return s;const z=ZT[s];if(z!=null)return z;
 const m=/^RICE: (.+)$/.exec(s);if(m)return '米價：'+m[1];if(/[A-Z]{2}/i.test(s)&&!CJK_RE.test(s)&&!/^[A-Z]?\d|^[-+¥]|^LV /.test(s))MISS.add(s);return s}
const ZK=(o,k)=>LANG==='zh'&&o.zh&&o.zh[k]!=null?o.zh[k]:o[k];
function wrapPx(s,maxW){const toks=String(s).match(/[A-Za-z0-9¥$%'’.,!?:\/+\-–—()×]+|\s+|[\s\S]/gu)||[];const out=[];let line='';
 for(const tk of toks){const test=line+tk;if(line.trim()&&ctx.measureText(test.trimEnd()).width>maxW&&!/^[，。、！？：；）」』…—,.!?)\s]/.test(tk)){out.push(line.trim());line=/^\s+$/.test(tk)?'':tk}else line=test}
 if(line.trim())out.push(line.trim());return out}
// wrap translated text to a pixel width: CJK by measured width, English by the 8px pixel-font grid
function lines(s,maxW,px=11){s=tr(String(s));if(CJK_RE.test(s)){ctx.font=ZF(px);return wrapPx(s,maxW)}return wrap(s,Math.max(4,Math.floor(maxW/8)))}
const LH=()=>LANG==='zh'?13:10;
const isDark=c=>{const m=/^#([0-9a-f]{6})/i.exec(c);if(!m)return false;const v=parseInt(m[1],16);return((v>>16)*.3+((v>>8)&255)*.59+(v&255)*.11)<70};
const ZNUM=['一','二','三','四','五','六'];
const chapLabel=i=>LZ('CHAPTER '+ROMAN[i],'第'+ZNUM[i]+'章');
/* CJK-aware overrides of the shared text helpers (the English path is the untouched original) */
const _txt=txt,_drawShout=drawShout,_wordSprite=wordSprite;
txt=function(s,x,y,c='#e9dcc2',al='left',font=F){s=tr(String(s));if(!CJK_RE.test(s))return _txt(s,x,y,c,al,font);
 const big=/16px/.test(font);ctx.font=big?ZF(16,700):ZF(11);ctx.textAlign=al;ctx.textBaseline='middle';const yy=y+(big?8:4);
 if(!isDark(c)){ctx.fillStyle='#120d0c';for(const[a,b]of[[1,1],[-1,0],[1,0],[0,-1],[0,1]])ctx.fillText(s,x+a,yy+b)}ctx.fillStyle=c;ctx.fillText(s,x,yy);ctx.textBaseline='top'};
stxt=function(s,x,y,c,size,a=1,al='center'){s=tr(String(s));const zh=CJK_RE.test(s);ctx.font=zh&&size<12?ZF(11,700):zh?SERIF2(size):SERIF(size);
 if(zh&&size>=12){let sz=size;while(sz>12&&ctx.measureText(s).width>W-16){sz--;ctx.font=SERIF2(sz)}}
 ctx.textAlign=al;ctx.textBaseline='middle';ctx.globalAlpha=a;ctx.fillStyle='#000';ctx.fillText(s,x+1,y+2);ctx.fillStyle=c;ctx.fillText(s,x,y);ctx.globalAlpha=1;ctx.textBaseline='top'};
drawShout=function(s,x,y,hero){s=tr(String(s));if(!CJK_RE.test(s))return _drawShout(s,x,y,hero);
 ctx.font=ZF(11,700);const w=Math.ceil(ctx.measureText(s).width)+10,h=16,jig=hero&&T%6<3?1:0,bx=clamp(x-w/2,4,W-w-4),by=Math.max(26,y-h)+jig,bc=hero?'#c8372d':'#120d0c',fc=hero?'#fff4d0':'#d8ccb0';
 r(bx-1,by-1,w+2,h+2,bc);r(bx-3,by+4,2,3,bc);r(bx+w+1,by+8,2,3,bc);r(bx+8,by-3,3,2,bc);r(bx+w-12,by+h+1,3,2,bc);r(bx,by,w,h,fc);
 const tx=clamp(x-1,bx+3,bx+w-6);r(tx,by+h+1,3,3,fc);r(tx+1,by+h+4,2,2,fc);
 ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillStyle=hero?'#c8372d':'#3a2a20';ctx.fillText(s,bx+5,by+h/2+1);ctx.textBaseline='top'};
wordSprite=function(t){t=tr(String(t));if(!CJK_RE.test(t))return _wordSprite(t);
 const g0=document.createElement('canvas').getContext('2d');g0.font=ZF(22,700);const w=Math.ceil(g0.measureText(t).width)+12;
 return sprite('wz|'+t,w,30,g=>{R(g,0,0,w,30,'#120d0cdd');g.fillStyle='#ff7d6e';g.font=ZF(22,700);g.textBaseline='middle';g.fillText(t,6,16)})};
/* ---------------- 繁體中文 table (English source → Taiwanese Mandarin) ---------------- */
const ZT={
 // places & chapters
 'THE BUND, SHANGHAI':'上海外灘','VILLAGE OF THE ROPED':'繩村','THE BRIDGEHEAD':'橋頭堡','MINT GATE':'印鈔廠大門','FROZEN TRENCH':'結凍的戰壕','FERRY ROAD':'渡口路',
 'CH. I · THE BUND, SHANGHAI':'第一章 · 上海外灘','CH. II · VILLAGE OF THE ROPED':'第二章 · 繩村','CH. III · THE BRIDGE NOBODY BLEW UP':'第三章 · 沒人炸的那座橋',
 'CH. IV · THE MINT THAT NEVER SLEEPS':'第四章 · 不打烊的印鈔廠','CH. V · HUAIHAI, WHERE THE ARMY WENT':'第五章 · 淮海，大軍去哪了','CH. VI · DOCKS OF THE LAST FERRY':'第六章 · 末班渡口',
 'Shanghai · Gold Yuan':'上海 · 金圓券','Conscription country':'抓壯丁的鄉下','The bridge':'那座橋','The Central Mint':'中央印製廠','The Huaihai front':'淮海前線','The last pier':'最後的碼頭',
 // charms
 'RATION COUPON':'配給券','Party max HP +15%.':'全隊最大生命 +15%。','Redeemable for rice. Rice not included.':'可兌換白米。白米不附。',
 'LEND-LEASE WATCH':'美援手錶','Party speed +15%.':'全隊速度 +15%。','American. Runs fast, like the currency.':'美國貨。走得很快，跟物價一樣快。',
 'THE COOKING POT':'炒菜鍋','Wider dodge and parry timing.':'閃避與格擋的時機放寬。','Worn as a helmet. Previously used for rice. Tactical upgrade.':'當鋼盔戴。以前拿來煮飯。戰術升級。',
 'KUOMINTANG MEMBERSHIP CARD':'國民黨黨證','Start every battle with +2 AP.':'每場戰鬥開始時 AP +2。','Valid until further notice. Notice pending.':'有效期限：另行通知。通知尚未發出。',
 'LUCKY GOLD YUAN':'幸運金圓券','Double Gold Yuan from battles.':'戰鬥獲得的金圓券加倍。','Lucky because nobody wanted it.':'它之所以幸運，是因為沒人要。',
 'ACCOUNTANT\'S ABACUS':'會計的算盤','Qian starts every battle with 3 Inflation.':'老錢每場戰鬥一開始就有 3 層通膨。','Twelve rows of beads. The top row is reserved for zeros.':'十二排算珠。最上面一排專門用來打零。',
 'VICTORY BOND, MATURES 1950':'勝利公債（1950年到期）','+30% XP from battles.':'戰鬥經驗值 +30%。','Guaranteed by the full faith and credit of a government. Which one is not specified.':'由政府以全部信用擔保。哪一個政府，未註明。',
 'M1 HELMET (SURPLUS)':'M1 鋼盔（美軍剩餘物資）','Party defense +4.':'全隊防禦 +4。','Fell off an American truck. The truck also fell off an American truck.':'從美軍卡車上掉下來的。那輛卡車也是從美軍卡車上掉下來的。',
 // items
 'RICE WINE':'米酒','+1 rice wine. Heals 50% in battle.':'米酒 +1。戰鬥中回復 50% 生命。','Medicinal, according to the man who sold it.':'賣酒的人說有療效。',
 'TIGER BALM':'萬金油','+1 tiger balm. Revives a fallen ally.':'萬金油 +1。可以讓倒下的隊友復活。','Rub on wounds, bruises, and death.':'擦傷口、擦瘀青、擦死亡，都有效。',
 'AMERICAN AID TIN':'美援罐頭','+1 aid tin. Heals the whole party 35% in battle.':'美援罐頭 +1。戰鬥中全隊回復 35%。','Powdered milk, Spam and a pamphlet titled "Democracy". Two of the three are edible.':'奶粉、午餐肉，和一本叫《民主》的小冊子。三樣裡面有兩樣能吃。',
 'THE HOARDER\'S LEDGER':'囤積大王的帳本','Chapter I complete. The road leaves Shanghai.':'第一章完成。道路離開上海。','Everyone who bought gold before the reform. Several of them wrote the reform.':'幣制改革前偷偷搶購黃金的人都在上面。其中好幾位就是寫改革方案的人。',
 'SELF-CRITICISM, 40 PAGES':'自我批評書，四十頁','Chapter II complete. The bridge lies ahead.':'第二章完成。前方就是那座橋。','The commissar\'s confession notebook. He ran out of paper long before he ran out of faults.':'政委的檢討本。紙早就寫完了，缺點還沒寫完。',
 'THE GENERAL\'S STAMP':'將軍的大印','Chapter III complete. The Mint lies ahead.':'第三章完成。前方就是印鈔廠。','Pressed on six thousand execution orders. Now on your travel pass. Ink is ink.':'蓋過六千張槍決令，現在蓋在你的通行證上。印泥就是印泥。',
 'ONE-MILLION NOTE PLATE':'百萬元大鈔印版','Chapter IV complete. The front lies ahead.':'第四章完成。前方就是前線。','The official plate. The counterfeit plate is better. Nobody can tell the notes apart, including the bank.':'這是官方印版。假鈔的印版做得比較好。沒人分得出真假，連銀行也分不出來。',
 'REVERSIBLE CAP':'雙面軍帽','Chapter V complete. The last pier lies ahead.':'第五章完成。前方就是最後的碼頭。','Blue on one side, green on the other. Lao Wang wears it blue side out. Firmly. Mostly.':'一面藍，一面綠。老王戴藍色那面朝外。非常堅定。大致上啦。',
 // floor messages
 'WASD WALK · CLICK TO CAPTURE MOUSE · SHIFT RUN · E USE':'WASD 移動 · 點畫面鎖定滑鼠 · Shift 跑步 · E 使用','STICK WALKS · DRAG RIGHT SIDE TO LOOK · RUN · USE':'左邊搖桿走路 · 右半邊拖曳轉視角 · 跑步 · 使用',
 'TOUCH AN ENEMY TO FIGHT. HIT J FIRST FOR AN AMBUSH.':'碰到敵人就開打。先按 J 砍下去可以偷襲。','TOUCH AN ENEMY TO FIGHT. PRESS STRIKE FIRST FOR AN AMBUSH.':'碰到敵人就開打。先按「出手」可以偷襲。',
 'ENEMY TURN: PRESS DODGE THE MOMENT THE BLOW LANDS. THE RING SHOWS WHEN.':'敵人回合：在攻擊打中的那一瞬間按閃避。看圓圈收合就知道時機。',
 'PARRY IS TIGHTER THAN DODGE. PARRY EVERY HIT OF AN ATTACK TO COUNTER.':'格擋的時機比閃避更緊。一招的每一下都擋住，就能反擊。',
 'SKILLS COST AP. ATTACK AND PARRY EARN AP. PRESS AT THE GOLD RING FOR A PERFECT.':'技能要花 AP。普通攻擊和格擋可以賺 AP。白圈縮到金圈時按下，打出完美。',
 'SUPPLIES AHEAD! (TRUST ME)':'前方有補給！（相信我）','EXCHANGE YOUR GOLD FOR GOLD YUAN. IT HAS GOLD IN THE NAME':'快把黃金換成金圓券。名字裡就有「金」字啊','HOARDER AHEAD. THEREFORE, RICE':'前有囤積商，故有米',
 'LIBERATED TWICE, CONSCRIPTED THRICE':'被解放兩次，被抓壯丁三次','AMAZING COMMISSAR AHEAD':'前方有了不起的政委','TRY SELF-CRITICISM':'試試自我批評',
 'BE WARY OF LEFT. AND RIGHT. AND WATER.':'小心左邊。還有右邊。還有水。','THE DEMOLITION BUDGET WAS PAID IN GOLD YUAN':'炸橋預算是用金圓券付的','GENERAL AHEAD. WRONG DIRECTION, THEREFORE DESERTER':'前有將軍。走錯方向，故為逃兵',
 'BANK RUN AHEAD. THEREFORE RUN':'前有擠兌，故快跑','TRY SAVING':'試試存錢','VISIONS OF MONEY...':'錢的幻影……',
 'HALF A MILLION OF OURS WENT THIS WAY. THE OTHER WAY.':'我軍五十萬人走過這條路。往另一邊走的。','BE WARY OF FRIENDS':'小心自己人','COLONEL AHEAD. WHICH SIDE? YES.':'前有上校。哪一邊的？是的。',
 'PRAISE THE PAYCHECK \\o/':'讚美軍餉 \\o/','SHOOT THE GLOWING WEAK POINT. IT IS ALWAYS THE WALLET.':'射擊發光的弱點。弱點永遠是錢包。','THE PRINTER AHEAD. THEREFORE, INFLATION':'前有印鈔機，故通膨',
 // tea-stove news
 'Prices rose 15% while you rested. The expedition\'s budget did not.':'你休息的時候，物價漲了 15%。遠征隊的預算沒漲。','The Printer has painted a new number. It has more zeros than last time.':'印鈔機又畫了一個新數字。零比上次更多。',
 'Government assures the Gold Yuan is stable. Rice now quoted per grain.':'政府保證金圓券幣值穩定。米價現在按粒計算。','A wheelbarrow of Gold Yuan now buys a smaller wheelbarrow.':'一推車的金圓券，現在可以買一台比較小的推車。',
 'Front line "adjusted for strategic reasons". The strategy is distance.':'前線「因戰略需要調整」。戰略就是距離。','New banknote issued: ¥ 5,000,000. Collectors advised to buy two; one for the wallet, one for the stove.':'新鈔發行：¥5,000,000。建議收藏家買兩張：一張放錢包，一張拿去生火。',
 // heroes & skills
 'LAO WANG':'老王','CONSCRIPT · DADAO':'壯丁 · 大刀','WANG':'老王','LITTLE BLUE':'小藍','PROPAGANDIST · MEGAPHONE':'宣傳員 · 大聲公','BLUE':'小藍','ACCOUNTANT QIAN':'會計老錢','BOOKKEEPER · RIFLE':'記帳員 · 步槍','QIAN':'老錢',
 'BIG SWORD CHOP':'大刀劈砍','One huge hit. Breaks guard.':'一記重擊，破防效果大。','CURSE ROAR':'幹譙怒吼','"DIE, REDS!" Party +30% damage, 2 turns.':'「共匪納命來！」全隊傷害 +30%，持續 2 回合。',
 'WHIRLWIND OF DEBT':'債務旋風','Hits every enemy twice.':'每個敵人各砍兩刀。','LAST STAND':'背水一戰','Massive hit. Stronger the closer you are to death.':'超大一擊。越接近死亡越強。',
 'BACK PAY BLITZ':'欠餉連斬','Five hits, one for every month unpaid. Press at each ring.':'五連斬，每欠一個月餉砍一刀。每個圓圈都要按。',
 'GOOD NEWS BARRAGE':'捷報轟炸','Four official good-news bulletins at random enemies.':'四則官方捷報，隨機砸向敵人。','FIELD DRESSING':'戰地包紮','Heal one ally 45%.':'治療一名隊友 45%。',
 'LOYALTY QUESTIONNAIRE':'忠誠調查表','All enemies take +30% damage for 2 turns. May stun. 40 pages.':'所有敵人受到的傷害 +30%，持續 2 回合，可能暈眩。共四十頁。',
 'NEW LIFE MOVEMENT':'新生活運動','Revive the fallen, heal everyone 35%. Also: tuck in your shirt.':'復活倒下的隊友，全員回復 35%。另外：衣服紮好。',
 'VICTORY NEWSREEL':'勝利新聞片','Footage of a great victory (1938). Heavy damage to all enemies, slows them 2 turns.':'偉大勝利的影片（1938年拍的）。重創全體敵人，並減速 2 回合。',
 'AIMED SHOT':'瞄準射擊','Always finds the weak point. +1 Inflation.':'總能找到弱點。通膨 +1。','AUDIT':'查帳','Mark an enemy: +30% damage taken, big break.':'標記一名敵人：受到傷害 +30%，大幅削減架勢。',
 'PRINTING PRESS':'開動印鈔','+2 Inflation. Give an ally 2 AP.':'通膨 +2。給一名隊友 2 AP。','HYPERINFLATION':'惡性通膨','Spend all Inflation. Damage grows with every stack.':'花光所有通膨層數。層數越多，傷害越高。',
 'CURRENCY REFORM':'幣制改革','Strike off three zeros: removes 30% of an enemy\'s current HP (10% on bosses). +2 Inflation.':'劃掉三個零：削去敵人目前生命的 30%（頭目 10%）。通膨 +2。',
 // enemies
 'BLACK MARKET TOUT':'黑市黃牛','HARD SELL':'強迫推銷','SILVER DOLLAR TO THE EAR':'銀元貼耳聽響','PICKPOCKET':'扒手','LIGHT FINGERS':'三隻手','ELBOW, ELBOW':'拐子，再一拐子',
 'POLICE WITH A DOOR':'扛門板的警察','DOOR SLAM':'門板拍擊','BATON BEATING':'警棍伺候','RICE HOARDER':'囤米商','SACK OF RICE':'一麻袋米','PRICE HIKE':'哄抬物價',
 'HOLLOW CONSCRIPT':'空心壯丁','BAYONET THRUST':'刺刀突刺','DOUBLE JAB':'連刺兩下','PITCHFORK MILITIA':'草叉民兵','PITCHFORK FLURRY':'草叉亂舞',
 'UNDERGROUND AGITATOR':'地下煽動員','LAND REFORM SLOGAN':'土改口號','LEAFLET STORM':'傳單風暴','RIFLEMAN':'步槍兵','VOLLEY':'齊射','GRENADIER':'擲彈兵','STICK GRENADE':'木柄手榴彈',
 'MILITARY POLICE':'憲兵','DESERTER CHECK':'查逃兵','PAPERS, PLEASE':'證件拿出來','MINT CLERK':'印鈔廠職員','RUBBER STAMP':'橡皮圖章','OVERTIME':'加班',
 'WALKING STACK OF NOTES':'會走路的鈔票堆','PAPER CUTS':'紙割傷','AVALANCHE OF ZEROS':'零的雪崩','HUMAN WAVE':'人海戰術','CHARGE!':'衝啊！','BAYONET RUSH':'刺刀衝鋒',
 'MORTAR TEAM':'迫擊砲班','MORTAR BARRAGE':'迫擊砲彈幕','SPOTTING ROUND':'試射','CUSTOMS INSPECTOR':'海關稽查員','EXPORT TARIFF':'出口關稅','FULL INSPECTION':'全面檢查',
 'STEVEDORE':'碼頭苦力','CARGO HOOK':'貨鉤','HEAVE HO':'嘿咻','SUPPLY CRATE (HUNGRY)':'補給箱（餓了）','CHOMP CHOMP CHOMP':'咬咬咬','BANK VAULT (HUNGRY)':'銀行金庫（餓了）','COMPOUND INTEREST':'利滾利','WITHDRAWAL':'提款',
 // bosses
 'THE HOARDER KING':'囤積大王','BLACK MARKET, WHITE GLOVES':'黑市生意，白手套','HOARDER DEFEATED':'囤積大王 落網','HE WILL BE RELEASED ON BAIL. BAIL IS PAID IN GOLD.':'他會交保出來。保釋金用黃金付。',
 'PRICE GOUGE':'漫天要價','RICE AVALANCHE':'白米大崩落','BUY THE POLICE':'收買警察','OFFICER, THIS IS FOR YOUR TROUBLE.':'長官辛苦了，一點小意思。',
 'COMMISSAR WEI':'魏政委','SELF-CRITICISM ENFORCER':'自我批評督導員','COMMISSAR DEFEATED':'政委 敗退','HE WILL WRITE A REPORT ABOUT THIS':'他會為此寫一份報告',
 'SELF-CRITICISM COMBO':'自我批評連段','STRUGGLE SESSION':'批鬥大會','RECTIFICATION':'整風','I CRITICIZE MYSELF... AND FEEL STRONGER!':'我批評我自己……感覺更強了！',
 'THE IRON GENERAL':'鐵將軍','KEEPER OF THE LOCKED BRIDGE':'把守上鎖的橋','GENERAL DEFEATED':'將軍 敗退','HE IS PROMOTED FOR HOLDING THE BRIDGE SO LONG':'他因為守橋守這麼久，升官了',
 'THE GENERAL IS ANGRY':'將軍生氣了','HIS DADAO IS ON FIRE. SO IS EVERYTHING ELSE.':'他的大刀著火了。其他東西也著火了。','EXECUTIONER COMBO':'劊子手連斬','LEAP SLAM':'飛身重劈','DESERTER CHARGE':'抓逃兵衝鋒','BURNING DADAO':'火焰大刀',
 'TREASURER ZHAO':'趙司庫','KEEPER OF THE PRESSES':'印鈔機看守人','TREASURER DEFEATED':'司庫 敗退','INFLATION, HOWEVER, IS UNDEFEATED':'不過，通膨依然不敗','EMERGENCY ISSUE':'緊急發行',
 'HE IS PRINTING FASTER THAN YOU CAN HIT HIM':'他印鈔的速度比你打他還快','COUNTING MACHINE':'點鈔機','NEW SERIES NOTES':'新版鈔票','FREEZE YOUR ACCOUNTS':'凍結帳戶','MONEY HAMMER':'鈔票大鎚','BAILOUT':'紓困','THE TREASURY LENDS ITSELF MONEY!':'國庫向自己借錢！',
 'COLONEL LU':'盧上校','OF FLEXIBLE LOYALTY':'忠誠度可以商量','COLONEL DEFEATED':'上校 敗退','BOTH ARMIES CLAIM HE WAS THE OTHER SIDE\'S':'兩邊都說他是對方的人','COLONEL LU HAS DEFECTED':'盧上校陣前起義了',
 'HIS CAP IS NOW GREEN. HIS SWORD IS THE SAME.':'帽子換成綠的了。刀還是同一把。','LOYAL SALUTE':'效忠敬禮','ARTILLERY "SUPPORT"':'砲兵「支援」','SECRET LETTER':'密函','I AM WRITING TO BOTH HEADQUARTERS.':'我同時寫信給兩邊的司令部。','TURNCOAT COMBO':'倒戈連斬','SIDE SWITCH':'換邊站',
 'THE PRINTER':'印鈔機','PAINTER OF THE NUMBER':'畫數字的人','THE PRINTER IS BROKEN':'印鈔機 停擺了','THE NUMBER STOPS GROWING':'數字不再變大','THE NUMBERS ARE GROWING':'數字正在變大','PRINT RUN':'開印','DEVALUATION':'貶值','PAINT THE NUMBER':'畫上數字',
 // battle & HUD
 'AMBUSH!':'偷襲！','BATTLE':'開戰','TURN ORDER':'行動順序','ATTACK':'攻擊','SKILLS':'技能','SHOOT':'射擊','ITEMS':'道具','1 AP · AIM':'1 AP · 瞄準','HEAL 50%':'回復 50%','REVIVE':'復活','PARTY 35%':'全隊 35%',
 'BACK':'返回','A/D CHOOSE · J CONFIRM · K BACK':'A/D 選擇 · J 確認 · K 返回','TAP A TARGET':'點選目標','BROKEN!':'破防！','BROKEN':'破防','MARK':'標記','RECOVERING':'重整中','PERFECT!':'完美！','GOOD':'不錯',
 'DOWN':'倒下','REVIVED':'復活了','WEAK POINT!':'命中弱點！','STUNNED':'暈眩','AUDITED':'已查帳','INFLATION +2':'通膨 +2','PARRY!':'格擋！','DODGE':'閃避','PARRY':'格擋','COUNTER!':'反擊！','ERASED':'被抹除了',
 'PAINTED: 48':'被畫上：48','ERASED IN 4 TURNS · DODGE OR PARRY A BLOW TO SMUDGE IT':'四回合後抹除 · 閃避或格擋一次攻擊就能把數字弄糊','OR BREAK THE PRINTER':'或是讓印鈔機破防','YOUR NUMBER IS 48.':'你的數字是 48。','ATK +6%':'攻擊 +6%','ACCOUNT FROZEN -2 AP':'帳戶凍結 -2 AP','I FEEL STRONGER!':'我覺得變強了！','SMUDGED!':'數字糊掉了！',
 'TAP!':'點！','J!':'按 J！','TAP TO FIRE ON THE WALLET':'點擊開火，瞄準錢包','J TO FIRE · AIM FOR THE GLOWING WALLET':'按 J 開火 · 瞄準發光的錢包',
 'DODGE AS THE RING CLOSES · PARRY IS TIGHTER':'圓圈收合時按閃避 · 格擋時機更緊','SPACE DODGE · SHIFT PARRY — WHEN THE RING CLOSES':'空白鍵閃避 · Shift 格擋 · 在圓圈收合時按',
 'TRUST THE GOLD YUAN!':'相信金圓券！','BUY GOVERNMENT BONDS!':'請購買政府公債！','STAY CALM AND QUEUE!':'保持冷靜，排好隊！','DIE, REDS!':'共匪納命來！','FOR MY BACK PAY!':'還我欠餉！',
 'JANUARY! FEBRUARY! MARCH!...':'一月！二月！三月！……','NOW SHOWING: VICTORY!':'本片放映：勝利！','GLORIOUS VICTORY!':'光榮勝利！','ENEMY ROUTED!':'敵軍潰敗！','TOTALLY RECENT FOOTAGE!':'絕對是最新畫面！',
 'STRIKE OFF THREE ZEROS!':'劃掉三個零！','THE SITUATION IS EXCELLENT!':'形勢一片大好！','PRICES ARE FROZEN!':'物價已經凍結！','VICTORY BY CHRISTMAS!':'聖誕節前就勝利！','AMERICAN AID IS COMING!':'美援快到了！',
 'FILL THIS OUT IN TRIPLICATE!':'一式三份填好！','BUTTON YOUR COLLARS AND RISE!':'扣好風紀扣，站起來！','SPEND IT BEFORE IT ROTS!':'趁它還沒爛快花掉！',
 'VICTORY':'勝利','EXPEDITION 48 HAS RETREATED':'第四十八遠征隊 轉進了','FOR THOSE WHO COME AFTER: BRING MORE MONEY':'給後來的人：多帶點錢','YOUR SAVINGS WERE DEVALUED 50%':'你的積蓄貶值了 50%',
 'THE RIVER DECLINES YOU':'河流婉拒了你','TEA STOVE LIT':'茶爐點燃了','REST AT THE STOVE':'在茶爐邊休息','LIGHT THE STOVE':'點燃茶爐','PICK UP':'撿起來','ENTER THE FOG':'走進迷霧','READ MESSAGE':'閱讀留言',
 'CLICK TO CAPTURE MOUSE':'點擊畫面鎖定滑鼠','PAUSED':'暫停','P / ESC TO RESUME':'按 P／Esc 繼續','TAP II TO RESUME':'點右上角 II 繼續','L LANGUAGE · M SOUND':'L 切換語言 · M 音效','THIS BROWSER BLOCKED 3D GRAPHICS':'這個瀏覽器封鎖了 3D 繪圖',
 'STRIKE':'出手','AID TIN':'美援罐頭','RUN':'跑','USE':'使用',
 // scene art
 'GOV. BOND':'政府公債','UNSOLD':'滯銷','COST TO PRINT ONE NOTE':'印一張鈔票的成本','COUNTER-':'反攻','ATTACK:':'大陸：','NEXT YEAR':'明年','GOLD: ALREADY GONE':'黃金：早就走了',
 'COATS':'大衣','APR':'四月','TEMPORARY':'暫時','HELP!':'救命！','THE END':'劇終','(TEMPORARILY)':'（暫時）'};
const CHL=56,NCH=6,ROMAN=['I','II','III','IV','V','VI'];
const chapAt=z=>clamp(Math.floor(z/CHL),0,NCH-1);
{grid.length=0;for(let z=0;z<NCH*CHL+8;z++)grid.push(new Array(MW).fill('#'));
 const pts=(c,l)=>{for(const[x,z]of l)grid[z][x]=c};
 for(let ch=0;ch<NCH;ch++){const b=ch*CHL;
  carve(8,b+1,17,b+7);
  if(ch===0){carve(6,b+8,19,b+35);carve(1,b+14,5,b+20);carve(20,b+22,24,b+28);
   for(let x=7;x<=11;x++)grid[b+18][x]='c';for(let x=14;x<=19;x++)grid[b+27][x]='c';pts('#',[[8,b+31],[9,b+31],[16,b+31],[17,b+31],[8,b+12],[17,b+12]])}
  if(ch===1){carve(10,b+8,15,b+35);carve(4,b+12,9,b+18);carve(16,b+20,21,b+26);carve(5,b+28,20,b+35);pts('c',[[14,b+15],[6,b+30],[18,b+32],[19,b+32],[8,b+13]])}
  if(ch===2){carve(0,b+8,25,b+35,'~');carve(11,b+8,14,b+35,'=');carve(7,b+18,18,b+25);carve(3,b+21,6,b+22,'=');carve(2,b+21,2,b+22);pts('c',[[8,b+18],[17,b+25],[9,b+25]])}
  if(ch===3){carve(4,b+8,21,b+35);carve(22,b+15,24,b+19);for(const z of[b+12,b+20,b+28])for(const x of[7,8,17,18]){grid[z][x]='#';grid[z+1][x]='#'}
   pts('c',[[10,b+16],[11,b+16],[14,b+24],[15,b+24],[10,b+32],[11,b+32],[5,b+9],[20,b+9]])}
  if(ch===4){carve(3,b+8,22,b+35);for(let x=3;x<=9;x++)grid[b+13][x]='c';for(let x=16;x<=22;x++)grid[b+13][x]='c';for(let x=8;x<=17;x++)grid[b+20][x]='c';
   for(let x=3;x<=10;x++)grid[b+27][x]='c';for(let x=15;x<=22;x++)grid[b+27][x]='c';pts('#',[[5,b+16],[6,b+16],[19,b+23],[20,b+23],[14,b+31]])}
  if(ch===5){carve(3,b+8,22,b+35,'=');carve(3,b+8,4,b+30,'~');carve(21,b+12,22,b+35,'~');
   pts('c',[[8,b+14],[9,b+14],[15,b+18],[16,b+18],[16,b+19],[7,b+23],[13,b+25],[18,b+29],[9,b+31],[10,b+31]])}
  carve(11,b+36,14,b+36,'F');carve(5,b+37,20,b+52);carve(11,b+53,14,b+53,'G');
  for(let k=0;k<3;k++)for(let j=0;j<3-k;j++){grid[b+37+k][5+j]='#';grid[b+37+k][20-j]='#';grid[b+52-k][5+j]='#';grid[b+52-k][20-j]='#'}
  if(ch<NCH-1)carve(10,b+54,15,b+56)}
 const e=(NCH-1)*CHL;carve(0,e+55,25,e+63,'~');carve(11,e+54,14,e+61,'=');
 for(let z=0;z<grid.length;z++)for(let x=0;x<MW;x++){if(grid[z][x]!=='#')continue;let adj=false;for(const[dx,dz]of[[1,0],[-1,0],[0,1],[0,-1]]){const c=(grid[z+dz]||[])[x+dx];if(openC(c)&&c!=='~')adj=true}
  if(!adj)continue;const h=((x*73856093)^(z*19349663))>>>0,ch=chapAt(z);
  if(ch===0)grid[z][x]=h%5===0?'P':h%5===1?'Q':h%3===0?'W':'#';else if(ch===1)grid[z][x]=h%7===0?'P':h%7===1?'Q':h%3===0?'W':'#';else if(ch===2)grid[z][x]=h%4===0?'W':'#';else if(ch===5)grid[z][x]=h%3?'W':'#'}
 const CB=b=>b*CHL;
 FIRES.splice(0,FIRES.length,{x:12.5,z:3.5,name:'THE BUND, SHANGHAI'},{x:12.5,z:CB(1)+3.5,name:'VILLAGE OF THE ROPED'},{x:12.5,z:CB(2)+3.5,name:'THE BRIDGEHEAD'},{x:12.5,z:CB(3)+3.5,name:'MINT GATE'},{x:12.5,z:CB(4)+3.5,name:'FROZEN TRENCH'},{x:12.5,z:CB(5)+3.5,name:'FERRY ROAD'});
 ARENAS.splice(0,ARENAS.length,...['king','commissar','ma','zhao','lu','printer'].map((k,i)=>({k,fz:CB(i)+36,gz:CB(i)+53,z0:CB(i)+37,z1:CB(i)+52,cx:12.5,cz:CB(i)+44.5})));
 ZONES.splice(0,ZONES.length,
  {z:0,name:'CH. I · THE BUND, SHANGHAI',han:'外灘 · 金圓券',fog:0x3a2e34,bg:0x161220,hemi:1,sun:.6,hc:0xffc8a0,fx:'notes'},
  {z:CB(1),name:'CH. II · VILLAGE OF THE ROPED',han:'繩村',fog:0x4a2a24,bg:0x1c1420,hemi:1,sun:.65,fx:'ember'},
  {z:CB(2),name:'CH. III · THE BRIDGE NOBODY BLEW UP',han:'斷橋',fog:0x3a2a34,bg:0x1c1420,hemi:1,sun:.65},
  {z:CB(3),name:'CH. IV · THE MINT THAT NEVER SLEEPS',han:'印鈔廠',fog:0x1a2418,bg:0x0e120c,hemi:.8,sun:.35,sky:false,hc:0xd8f0c0,fx:'money'},
  {z:CB(4),name:'CH. V · HUAIHAI, WHERE THE ARMY WENT',han:'淮海',fog:0xc4ccd8,bg:0xb0bccc,hemi:1.25,sun:.8,sky:false,hc:0xe8f0ff,fx:'snow'},
  {z:CB(5),name:'CH. VI · DOCKS OF THE LAST FERRY',han:'末班渡口',fog:0x1a1c2c,bg:0x0c0e1a,hemi:.7,sun:.3,rain:true,fx:'rain'})}
const zb=(ch,dz)=>ch*CHL+dz;
const ITEMS=[
 {id:'c1',x:2.5,z:15,k:'wine'},{id:'c2',x:23.5,z:27.5,k:'charm',c:'coupon'},{id:'c3',x:18.5,z:34.5,k:'balm'},
 {id:'v1',x:5,z:zb(1,17.5),k:'wine'},{id:'v2',x:20.5,z:zb(1,25.5),k:'charm',c:'watch'},{id:'v3',x:6,z:zb(1,34.5),k:'aid'},
 {id:'r1',x:2.5,z:zb(2,21.5),k:'charm',c:'pot'},{id:'r2',x:17.5,z:zb(2,19),k:'wine'},{id:'r3',x:7.5,z:zb(2,24.5),k:'balm'},
 {id:'m1',x:5,z:zb(3,24.5),k:'charm',c:'abacus'},{id:'m2',x:20,z:zb(3,34.5),k:'aid'},{id:'m3',x:13,z:zb(3,20.5),k:'wine'},
 {id:'h1',x:21.5,z:zb(4,9.5),k:'charm',c:'helmet'},{id:'h2',x:3.5,z:zb(4,24.5),k:'wine'},{id:'h3',x:21.5,z:zb(4,34.5),k:'balm'},
 {id:'d1',x:19,z:zb(5,9.5),k:'charm',c:'card'},{id:'d2',x:6,z:zb(5,33.5),k:'aid'},{id:'d3',x:14,z:zb(5,21.5),k:'wine'}];
const CHARMS={coupon:{n:'RATION COUPON',d:'Party max HP +15%.',f:'Redeemable for rice. Rice not included.'},watch:{n:'LEND-LEASE WATCH',d:'Party speed +15%.',f:'American. Runs fast, like the currency.'},
 pot:{n:'THE COOKING POT',d:'Wider dodge and parry timing.',f:'Worn as a helmet. Previously used for rice. Tactical upgrade.'},card:{n:'KUOMINTANG MEMBERSHIP CARD',d:'Start every battle with +2 AP.',f:'Valid until further notice. Notice pending.'},
 lucky:{n:'LUCKY GOLD YUAN',d:'Double Gold Yuan from battles.',f:'Lucky because nobody wanted it.'},
 abacus:{n:'ACCOUNTANT\'S ABACUS',d:'Qian starts every battle with 3 Inflation.',f:'Twelve rows of beads. The top row is reserved for zeros.'},
 bond:{n:'VICTORY BOND, MATURES 1950',d:'+30% XP from battles.',f:'Guaranteed by the full faith and credit of a government. Which one is not specified.'},
 helmet:{n:'M1 HELMET (SURPLUS)',d:'Party defense +4.',f:'Fell off an American truck. The truck also fell off an American truck.'}};
const IDESC={wine:{n:'RICE WINE',d:'+1 rice wine. Heals 50% in battle.',f:'Medicinal, according to the man who sold it.'},balm:{n:'TIGER BALM',d:'+1 tiger balm. Revives a fallen ally.',f:'Rub on wounds, bruises, and death.'},
 aid:{n:'AMERICAN AID TIN',d:'+1 aid tin. Heals the whole party 35% in battle.',f:'Powdered milk, Spam and a pamphlet titled "Democracy". Two of the three are edible.'},
 ledger:{n:'THE HOARDER\'S LEDGER',d:'Chapter I complete. The road leaves Shanghai.',f:'Everyone who bought gold before the reform. Several of them wrote the reform.'},
 notebook:{n:'SELF-CRITICISM, 40 PAGES',d:'Chapter II complete. The bridge lies ahead.',f:'The commissar\'s confession notebook. He ran out of paper long before he ran out of faults.'},
 stamp:{n:'THE GENERAL\'S STAMP',d:'Chapter III complete. The Mint lies ahead.',f:'Pressed on six thousand execution orders. Now on your travel pass. Ink is ink.'},
 plate:{n:'ONE-MILLION NOTE PLATE',d:'Chapter IV complete. The front lies ahead.',f:'The official plate. The counterfeit plate is better. Nobody can tell the notes apart, including the bank.'},
 cap:{n:'REVERSIBLE CAP',d:'Chapter V complete. The last pier lies ahead.',f:'Blue on one side, green on the other. Lao Wang wears it blue side out. Firmly. Mostly.'}};
const MSGS=[
 {x:10,z:2.5,t:['WASD WALK · CLICK TO CAPTURE MOUSE · SHIFT RUN · E USE','STICK WALKS · DRAG RIGHT SIDE TO LOOK · RUN · USE']},
 {x:15,z:2.5,t:['TOUCH AN ENEMY TO FIGHT. HIT J FIRST FOR AN AMBUSH.','TOUCH AN ENEMY TO FIGHT. PRESS STRIKE FIRST FOR AN AMBUSH.']},
 {x:11,z:6,t:'ENEMY TURN: PRESS DODGE THE MOMENT THE BLOW LANDS. THE RING SHOWS WHEN.'},
 {x:14,z:6,t:'PARRY IS TIGHTER THAN DODGE. PARRY EVERY HIT OF AN ATTACK TO COUNTER.'},
 {x:12.5,z:9.5,t:'SKILLS COST AP. ATTACK AND PARRY EARN AP. PRESS AT THE GOLD RING FOR A PERFECT.'},
 {x:3,z:19.5,t:'SUPPLIES AHEAD! (TRUST ME)'},{x:12.5,z:24,t:'EXCHANGE YOUR GOLD FOR GOLD YUAN. IT HAS GOLD IN THE NAME'},{x:12.5,z:34,t:'HOARDER AHEAD. THEREFORE, RICE'},
 {x:12.5,z:zb(1,9.5),t:'LIBERATED TWICE, CONSCRIPTED THRICE'},{x:12.5,z:zb(1,27),t:'AMAZING COMMISSAR AHEAD'},{x:12.5,z:zb(1,35),t:'TRY SELF-CRITICISM'},
 {x:12.5,z:zb(2,7),t:'BE WARY OF LEFT. AND RIGHT. AND WATER.'},{x:12.5,z:zb(2,22),t:'THE DEMOLITION BUDGET WAS PAID IN GOLD YUAN'},{x:12.5,z:zb(2,35),t:'GENERAL AHEAD. WRONG DIRECTION, THEREFORE DESERTER'},
 {x:12.5,z:zb(3,9.5),t:'BANK RUN AHEAD. THEREFORE RUN'},{x:12,z:zb(3,18),t:'TRY SAVING'},{x:12.5,z:zb(3,35),t:'VISIONS OF MONEY...'},
 {x:12.5,z:zb(4,9.5),t:'HALF A MILLION OF OURS WENT THIS WAY. THE OTHER WAY.'},{x:12.5,z:zb(4,22),t:'BE WARY OF FRIENDS'},{x:12.5,z:zb(4,35),t:'COLONEL AHEAD. WHICH SIDE? YES.'},
 {x:12.5,z:zb(5,9.5),t:'PRAISE THE PAYCHECK \\o/'},{x:12.5,z:zb(5,35),t:'SHOOT THE GLOWING WEAK POINT. IT IS ALWAYS THE WALLET.'},{x:14,z:zb(5,30),t:'THE PRINTER AHEAD. THEREFORE, INFLATION'}];
const GROUPS=[
 {id:'a1',x:12.5,z:14,k:['tout','pickpocket']},{id:'a2',x:3,z:17,k:['pickpocket','pickpocket','tout']},{id:'am',x:2.5,z:19.6,k:['mimic'],mimic:1,charm:'lucky'},
 {id:'a3',x:12,z:22,k:['police','tout']},{id:'a4',x:22,z:25,k:['hoarder','tout']},{id:'a5',x:12.5,z:30,k:['hoarder','police','pickpocket']},{id:'A',x:12.5,z:47,boss:'king'},
 {id:'v1',x:12.5,z:zb(1,11),k:['conscript','pitch']},{id:'v2',x:6.5,z:zb(1,15),k:['pitch','pitch','pitch']},{id:'v3',x:12,z:zb(1,21),k:['conscript','conscript','rifle']},
 {id:'v4',x:19,z:zb(1,23),k:['agitator','rifle']},{id:'v5',x:9,z:zb(1,31),k:['gren','conscript','agitator']},{id:'v6',x:16,z:zb(1,33),k:['rifle','rifle','pitch']},{id:'V',x:12.5,z:zb(1,47),boss:'commissar'},
 {id:'r1',x:12.5,z:zb(2,12),k:['mp','rifle']},{id:'r2',x:10,z:zb(2,21),k:['mp','mp','gren']},{id:'r3',x:16,z:zb(2,23),k:['rifle','rifle','police']},{id:'r4',x:12.5,z:zb(2,30),k:['police','mp','gren']},{id:'R',x:12.5,z:zb(2,47),boss:'ma'},
 {id:'m1',x:12.5,z:zb(3,11),k:['clerk','clerk']},{id:'m2',x:6,z:zb(3,16),k:['notes','clerk']},{id:'m3',x:19.5,z:zb(3,22),k:['notes','notes']},{id:'m4',x:12.5,z:zb(3,27),k:['clerk','notes','police']},
 {id:'m5',x:6,z:zb(3,33),k:['notes','clerk','clerk']},{id:'mm',x:23.5,z:zb(3,17),k:['vault'],mimic:1,charm:'bond'},{id:'M',x:12.5,z:zb(3,47),boss:'zhao'},
 {id:'h1',x:12.5,z:zb(4,10.5),k:['wave','wave','wave']},{id:'h2',x:5,z:zb(4,17),k:['wave','mortar','wave']},{id:'h3',x:19,z:zb(4,17.5),k:['rifle','rifle','wave']},{id:'h4',x:12.5,z:zb(4,24),k:['mortar','agitator','mortar']},
 {id:'h5',x:7,z:zb(4,31),k:['wave','wave','wave','wave']},{id:'h6',x:18,z:zb(4,32),k:['agitator','mortar','rifle']},{id:'H',x:12.5,z:zb(4,47),boss:'lu'},
 {id:'d1',x:12.5,z:zb(5,11),k:['customs','stevedore']},{id:'d2',x:7,z:zb(5,17),k:['mp','mp','rifle']},{id:'d3',x:18,z:zb(5,22),k:['customs','customs','gren']},
 {id:'d4',x:11,z:zb(5,28),k:['stevedore','stevedore','mp','rifle']},{id:'d5',x:16,z:zb(5,33),k:['police','customs','rifle']},{id:'D',x:12.5,z:zb(5,47),boss:'printer'}];
const NEWS=['Prices rose 15% while you rested. The expedition\'s budget did not.','The Printer has painted a new number. It has more zeros than last time.','Government assures the Gold Yuan is stable. Rice now quoted per grain.','A wheelbarrow of Gold Yuan now buys a smaller wheelbarrow.',
 'Front line "adjusted for strategic reasons". The strategy is distance.','New banknote issued: ¥ 5,000,000. Collectors advised to buy two; one for the wallet, one for the stove.'];

/* ---------------- party & enemies ---------------- */
const HEROES=[
 {id:'wang',name:'LAO WANG',short:'WANG',role:'CONSCRIPT · DADAO',fac:'kmt',m:{fac:'kmt',wpn:'dadao',shield:'lid'},hp:150,atk:18,def:5,spd:9,melee:1,
  skills:[{id:'chop',n:'BIG SWORD CHOP',ap:2,lv:1,tg:'one',d:'One huge hit. Breaks guard.'},{id:'roar',n:'CURSE ROAR',ap:2,lv:1,tg:'none',d:'"DIE, REDS!" Party +30% damage, 2 turns.'},
   {id:'spin',n:'WHIRLWIND OF DEBT',ap:3,lv:3,tg:'all',d:'Hits every enemy twice.'},{id:'last',n:'LAST STAND',ap:4,lv:5,tg:'one',d:'Massive hit. Stronger the closer you are to death.'},
   {id:'blitz',n:'BACK PAY BLITZ',ap:5,lv:8,tg:'one',d:'Five hits, one for every month unpaid. Press at each ring.'}]},
 {id:'hong',name:'LITTLE BLUE',short:'BLUE',role:'PROPAGANDIST · MEGAPHONE',fac:'kmt',m:{fac:'kmt',wpn:null,shield:'mega'},hp:110,atk:14,def:3,spd:12,
  skills:[{id:'slogan',n:'GOOD NEWS BARRAGE',ap:2,lv:1,tg:'all',d:'Four official good-news bulletins at random enemies.'},{id:'dress',n:'FIELD DRESSING',ap:2,lv:1,tg:'ally',d:'Heal one ally 45%.'},
   {id:'struggle',n:'LOYALTY QUESTIONNAIRE',ap:3,lv:2,tg:'all',d:'All enemies take +30% damage for 2 turns. May stun. 40 pages.'},{id:'rally',n:'NEW LIFE MOVEMENT',ap:4,lv:4,tg:'none',d:'Revive the fallen, heal everyone 35%. Also: tuck in your shirt.'},
   {id:'reel',n:'VICTORY NEWSREEL',ap:4,lv:7,tg:'all',d:'Footage of a great victory (1938). Heavy damage to all enemies, slows them 2 turns.'}]},
 {id:'qian',name:'ACCOUNTANT QIAN',short:'QIAN',role:'BOOKKEEPER · RIFLE',fac:'civ',m:{fac:'civ',wpn:'rifle',civ:1,cl:0x5a4a3a,cl2:0x3a2e24},hp:100,atk:16,def:3,spd:11,
  skills:[{id:'aimed',n:'AIMED SHOT',ap:1,lv:1,tg:'one',d:'Always finds the weak point. +1 Inflation.'},{id:'audit',n:'AUDIT',ap:2,lv:1,tg:'one',d:'Mark an enemy: +30% damage taken, big break.'},
   {id:'press',n:'PRINTING PRESS',ap:1,lv:2,tg:'ally',d:'+2 Inflation. Give an ally 2 AP.'},{id:'hyper',n:'HYPERINFLATION',ap:3,lv:3,tg:'all',d:'Spend all Inflation. Damage grows with every stack.'},
   {id:'reform',n:'CURRENCY REFORM',ap:3,lv:6,tg:'one',d:'Strike off three zeros: removes 30% of an enemy\'s current HP (10% on bosses). +2 Inflation.'}]}];
const EB={
 tout:{name:'BLACK MARKET TOUT',hp:60,atk:11,def:1,spd:13,brk:40,xp:10,yuan:90,civ:1,fac:'civ',cl:0x6a4a3a,cl2:0x3a2a20,moves:[{n:'HARD SELL',hits:[24,10,10],m:.55},{n:'SILVER DOLLAR TO THE EAR',hits:[36],m:1.05}]},
 pickpocket:{name:'PICKPOCKET',hp:55,atk:10,def:1,spd:15,brk:35,xp:10,yuan:60,civ:1,fac:'civ',cl:0x44443a,cl2:0x2a2a24,moves:[{n:'LIGHT FINGERS',hits:[26],m:.8,steal:1},{n:'ELBOW, ELBOW',hits:[22,14],m:.6}]},
 police:{name:'POLICE WITH A DOOR',hp:150,atk:16,def:8,spd:6,brk:90,xp:18,yuan:160,wpn:'baton',sh:'door',fac:'civ',civ:1,cl:0x2a3040,cl2:0x1a2030,moves:[{n:'DOOR SLAM',hits:[56],m:1.5},{n:'BATON BEATING',hits:[30,20],m:.8}]},
 hoarder:{name:'RICE HOARDER',hp:130,atk:15,def:5,spd:7,brk:80,xp:16,yuan:260,wpn:'sack',civ:1,fac:'civ',cl:0x7a5a30,cl2:0x4a3418,wide:1.25,moves:[{n:'SACK OF RICE',hits:[44],m:1.3},{n:'PRICE HIKE',hits:[20,20,20],m:.55}]},
 conscript:{name:'HOLLOW CONSCRIPT',hp:90,atk:14,def:2,spd:9,brk:60,xp:12,yuan:120,wpn:'rifle',bayo:1,moves:[{n:'BAYONET THRUST',hits:[34],m:1.1},{n:'DOUBLE JAB',hits:[32,16],m:.7}]},
 pitch:{name:'PITCHFORK MILITIA',hp:70,atk:12,def:1,spd:12,brk:40,xp:10,yuan:80,wpn:'fork',civ:1,fac:'straw',moves:[{n:'PITCHFORK FLURRY',hits:[28,11,11],m:.55}]},
 agitator:{name:'UNDERGROUND AGITATOR',hp:80,atk:14,def:2,spd:11,brk:50,xp:14,yuan:100,wpn:null,sh:'mega',ranged:1,moves:[{n:'LAND REFORM SLOGAN',hits:[40],m:1.0,word:1},{n:'LEAFLET STORM',hits:[46],m:.75,aoe:1,word:1}]},
 rifle:{name:'RIFLEMAN',hp:70,atk:15,def:2,spd:10,brk:50,xp:12,yuan:110,wpn:'rifle',ranged:1,moves:[{n:'AIMED SHOT',hits:[48],m:1.25},{n:'VOLLEY',hits:[32,12,12],m:.6}]},
 gren:{name:'GRENADIER',hp:60,atk:14,def:1,spd:8,brk:40,xp:12,yuan:100,wpn:null,ranged:1,moves:[{n:'STICK GRENADE',hits:[52],m:1.0,aoe:1}]},
 mp:{name:'MILITARY POLICE',hp:110,atk:16,def:5,spd:10,brk:70,xp:15,yuan:140,wpn:'baton',fac:'kmt',moves:[{n:'DESERTER CHECK',hits:[30,30],m:.8},{n:'PAPERS, PLEASE',hits:[50],m:1.3}]},
 clerk:{name:'MINT CLERK',hp:80,atk:13,def:3,spd:12,brk:50,xp:13,yuan:400,civ:1,fac:'civ',cl:0x3a5040,cl2:0x24342a,moves:[{n:'RUBBER STAMP',hits:[22,22,22],m:.5},{n:'OVERTIME',hits:[44],m:1.1}]},
 notes:{name:'WALKING STACK OF NOTES',hp:170,atk:15,def:7,spd:7,brk:100,xp:20,yuan:2000,civ:1,fac:'civ',cl:0x8aa070,cl2:0x5a6a3a,wpn:'sack',wide:1.3,moves:[{n:'PAPER CUTS',hits:[22,8,8,8,8],m:.42},{n:'AVALANCHE OF ZEROS',hits:[54],m:.95,aoe:1}]},
 wave:{name:'HUMAN WAVE',hp:55,atk:13,def:1,spd:11,brk:30,xp:9,yuan:40,wpn:'rifle',bayo:1,moves:[{n:'CHARGE!',hits:[30],m:1.1},{n:'BAYONET RUSH',hits:[26,10],m:.7}]},
 mortar:{name:'MORTAR TEAM',hp:70,atk:15,def:2,spd:7,brk:45,xp:14,yuan:90,wpn:null,ranged:1,moves:[{n:'MORTAR BARRAGE',hits:[60],m:.95,aoe:1},{n:'SPOTTING ROUND',hits:[48],m:1.2}]},
 customs:{name:'CUSTOMS INSPECTOR',hp:120,atk:16,def:5,spd:10,brk:70,xp:16,yuan:600,civ:1,fac:'civ',cl:0x2a2a30,cl2:0x1a1a20,wpn:'baton',moves:[{n:'EXPORT TARIFF',hits:[40],m:1.1,steal:1},{n:'FULL INSPECTION',hits:[24,16,16,24],m:.5}]},
 stevedore:{name:'STEVEDORE',hp:140,atk:17,def:4,spd:8,brk:80,xp:16,yuan:120,civ:1,fac:'straw',wpn:'fork',wide:1.15,moves:[{n:'CARGO HOOK',hits:[48],m:1.35},{n:'HEAVE HO',hits:[30,30],m:.75}]},
 mimic:{name:'SUPPLY CRATE (HUNGRY)',hp:260,atk:19,def:6,spd:11,brk:80,xp:60,yuan:900,mimic:1,moves:[{n:'CHOMP CHOMP CHOMP',hits:[26,22,10],m:.8}]},
 vault:{name:'BANK VAULT (HUNGRY)',hp:420,atk:22,def:8,spd:10,brk:120,xp:160,yuan:20000,mimic:1,moves:[{n:'COMPOUND INTEREST',hits:[22,18,14,10,30],m:.55},{n:'WITHDRAWAL',hits:[60],m:1.4}]}};
Object.assign(EB,{
 king:{boss:1,name:'THE HOARDER KING',sub:'BLACK MARKET, WHITE GLOVES',hp:620,atk:15,def:4,spd:10,brk:150,xp:150,yuan:3000,s:1.6,fac:'civ',civ:1,cl:0x5a2a2a,cl2:0x2a1414,wpn:'sack',officer:1,wide:1.3,music:'duel',
  fell:'HOARDER DEFEATED',fsub:'HE WILL BE RELEASED ON BAIL. BAIL IS PAID IN GOLD.',item:'ledger',
  moves:[{n:'PRICE GOUGE',hits:[24,10,10,30],m:.6},{n:'RICE AVALANCHE',hits:[48],m:.85,aoe:1},{n:'BUY THE POLICE',buff:1,shout:'OFFICER, THIS IS FOR YOUR TROUBLE.'}]},
 commissar:{boss:1,name:'COMMISSAR WEI',sub:'SELF-CRITICISM ENFORCER',hp:1000,atk:19,def:5,spd:10,brk:180,xp:260,yuan:4000,s:1.4,fac:'ccp',wpn:'sword',sh:'mega',officer:1,music:'duel',
  fell:'COMMISSAR DEFEATED',fsub:'HE WILL WRITE A REPORT ABOUT THIS',item:'notebook',
  moves:[{n:'SELF-CRITICISM COMBO',hits:[30,14,44],m:.85},{n:'STRUGGLE SESSION',hits:[46],m:.9,aoe:1,word:1},{n:'RECTIFICATION',buff:1,shout:'I CRITICIZE MYSELF... AND FEEL STRONGER!'}]},
 ma:{boss:1,name:'THE IRON GENERAL',sub:'KEEPER OF THE LOCKED BRIDGE',hp:1500,atk:23,def:6,spd:9,brk:230,xp:420,yuan:7000,s:1.9,fac:'kmt',wpn:'dadao',officer:1,music:'duel',
  fell:'GENERAL DEFEATED',fsub:'HE IS PROMOTED FOR HOLDING THE BRIDGE SO LONG',item:'stamp',p2t:'THE GENERAL IS ANGRY',p2s:'HIS DADAO IS ON FIRE. SO IS EVERYTHING ELSE.',
  moves:[{n:'EXECUTIONER COMBO',hits:[36,16,16,46],m:.75},{n:'LEAP SLAM',hits:[58],m:1.2,aoe:1},{n:'DESERTER CHARGE',hits:[30],m:1.9}],
  p2:[{n:'BURNING DADAO',hits:[30,10,10,10,34],m:.6},{n:'LEAP SLAM',hits:[50],m:1.3,aoe:1},{n:'EXECUTIONER COMBO',hits:[28,12,34,12],m:.85}]},
 zhao:{boss:1,name:'TREASURER ZHAO',sub:'KEEPER OF THE PRESSES',hp:2100,atk:27,def:7,spd:10,brk:260,xp:560,yuan:90000,s:1.8,fac:'civ',civ:1,cl:0x3a5a3a,cl2:0x1a2a1a,wpn:'sack',officer:1,wide:1.2,music:'duel',
  fell:'TREASURER DEFEATED',fsub:'INFLATION, HOWEVER, IS UNDEFEATED',item:'plate',p2t:'EMERGENCY ISSUE',p2s:'HE IS PRINTING FASTER THAN YOU CAN HIT HIM',
  moves:[{n:'COUNTING MACHINE',hits:[26,9,9,9,9,30],m:.45},{n:'NEW SERIES NOTES',hits:[50],m:.9,aoe:1},{n:'FREEZE YOUR ACCOUNTS',hits:[40],m:.6,aoe:1,drain:1}],
  p2:[{n:'COUNTING MACHINE',hits:[24,8,8,8,8,8,8,26],m:.45},{n:'FREEZE YOUR ACCOUNTS',hits:[40],m:.6,aoe:1,drain:1},{n:'MONEY HAMMER',hits:[40,40],m:1.1},{n:'BAILOUT',buff:1,shout:'THE TREASURY LENDS ITSELF MONEY!'}]},
 lu:{boss:1,name:'COLONEL LU',sub:'OF FLEXIBLE LOYALTY',hp:1950,atk:27,def:8,spd:11,brk:280,xp:700,yuan:30000,s:1.8,fac:'kmt',wpn:'sword',officer:1,music:'duel',turn:1,
  fell:'COLONEL DEFEATED',fsub:'BOTH ARMIES CLAIM HE WAS THE OTHER SIDE\'S',item:'cap',p2t:'COLONEL LU HAS DEFECTED',p2s:'HIS CAP IS NOW GREEN. HIS SWORD IS THE SAME.',
  moves:[{n:'LOYAL SALUTE',hits:[30,14,40],m:.8},{n:'ARTILLERY "SUPPORT"',hits:[56],m:.9,aoe:1},{n:'SECRET LETTER',buff:1,shout:'I AM WRITING TO BOTH HEADQUARTERS.'}],
  p2:[{n:'TURNCOAT COMBO',hits:[34,12,12,12,38],m:.6},{n:'HUMAN WAVE',hits:[30,30,30],m:.6,aoe:1},{n:'SIDE SWITCH',hits:[30],m:1.9}]},
 printer:{boss:1,name:'THE PRINTER',sub:'PAINTER OF THE NUMBER',hp:2300,atk:28,def:9,spd:10,brk:320,xp:0,yuan:0,s:2.5,fac:'uni',wpn:'sack',sh:'mega',officer:1,music:'final',
  fell:'THE PRINTER IS BROKEN',fsub:'THE NUMBER STOPS GROWING',p2t:'HYPERINFLATION',p2s:'THE NUMBERS ARE GROWING',
  moves:[{n:'PRINT RUN',hits:[30,8,8,8,8,26],m:.45},{n:'DEVALUATION',hits:[54],aoe:1,pct:.4},{n:'PAINT THE NUMBER',paint:1}],
  p2:[{n:'PRINT RUN',hits:[26,7,7,7,7,7,7,22],m:.45},{n:'DEVALUATION',hits:[48],aoe:1,pct:.5},{n:'PAINT THE NUMBER',paint:1},{n:'MONEY HAMMER',hits:[40,40],m:1.1}]}});

/* ---------------- progress ---------------- */
let G=null;const SAVEK='mingan48.v2';function save(){store.set(SAVEK,G)}
function newProgress(){return{lvl:1,xp:0,yuan:300,inf:1,items:{wine:3,balm:1,aid:0},charms:[],taken:[],cleared:[],boss:{},fire:0,lit:[0],seen:[],time:0,battles:0,parries:0,wipes:0,hp:null}}
const has=c=>G.charms.includes(c);
const xpNeed=()=>Math.round(40*Math.pow(G.lvl,1.5));
function heroStat(h,k){const L=G.lvl-1;let v=h[k];if(k==='hp')v=v*(1+.13*L)*(has('coupon')?1.15:1);else if(k==='atk')v=v*(1+.11*L);else if(k==='def')v=v+L*.6+(has('helmet')?4:0);else if(k==='spd')v=v*(has('watch')?1.15:1);return k==='hp'?Math.round(v):v}

/* ---------------- state ---------------- */
let PL=null,PMS=[],trail=[],wanderers=[],pops=[],banner=null,areaB=null,reading=null,itemBox=null,near=null,scene=null,ending=false;
let cy=0,cp=.42,camD=4.6,arena=null;
let B=null; // battle
const BX=60,BZ=40;
function mkPlayerModels(){for(const m of PMS)killMesh(m);PMS=HEROES.map(h=>mkChar(h.m))}

/* ---------------- explore ---------------- */
function mkEnemyModel(d){return d.mimic?mkMimic():mkChar({fac:d.fac||'ccp',wpn:d.wpn,bayo:d.bayo,shield:d.sh,s:d.s||1,officer:d.officer,civ:d.civ,cl:d.cl,cl2:d.cl2,wide:d.wide})}
function spawnWanderers(){for(const w of wanderers)killMesh(w.m);wanderers=GROUPS.filter(g=>!G.cleared.includes(g.id)&&!(g.boss&&G.boss[g.boss])).map(g=>{
 const k=g.boss||g.k[0],d=EB[k];const m=mkEnemyModel(d);
 return{g,m,x:g.x,z:g.z,fa:Math.PI,t:rnd()*200|0,ph:0,moving:0,boss:!!g.boss,s:d.s||1}})}
function respawn(i,warp){G.fire=i;const f=FIRES[i];PL={x:f.x,z:f.z+1,fa:0,state:'free',t:0,moving:0,ph:0,sprint:false};trail=[];cy=0;arena=null;LV=-1;setZoneR(chapAt(PL.z));spawnWanderers();state='play';fadeA=1;music('off');ambSet();GLC.style.filter='';
 for(const m of fogMeshes){m.visible=!G.boss[m.userData.A.k]}if(touchUI)$('#touch').hidden=false;$('#react').hidden=true}
function updExplore(){const p=PL;p.t++;const v=inputVec();p.moving=0;p.sprint=!!held('run');
 if(p.state==='free'){if(v){const sp=(p.sprint?.09:.058)*v[2];move(p,v[0]*sp,v[1]*sp,.28,true);p.fa=turn(p.fa,Math.atan2(v[0],v[1]),.3);p.moving=v[2];if(p.t%(p.sprint?12:18)===0)X.step()}
  if(pressed.use&&near)interact(near);
  if(pressed.atk){p.strike=14;X.swing();const w=wanderers.find(w=>!w.boss&&Math.hypot(w.x-p.x,w.z-p.z)<3);if(w){startBattle(w.g,'ambush');return}}}
 else if(p.state==='fogwalk'){p.z+=.06;p.fa=0;p.moving=1;if(p.t>=50){p.state='free';arena=p.arena}}
 if(p.strike>0)p.strike--;
 trail.unshift([p.x,p.z]);if(trail.length>80)trail.pop();
 if(cell(p.x,p.z)==='~'){p.x=FIRES[G.fire].x;p.z=FIRES[G.fire].z+1;SFX.splash();pop(p.x,1.8,p.z,'THE RIVER DECLINES YOU','#9fc0dc')}
 for(const w of wanderers){w.t++;if(!w.boss&&!w.g.mimic){const ang=w.t*.012+w.g.x,tx=w.g.x+Math.cos(ang)*1.2,tz=w.g.z+Math.sin(ang*1.3)*1.2;const dx=tx-w.x,dz=tz-w.z,d=Math.hypot(dx,dz);if(d>.05){w.x+=dx/d*.012;w.z+=dz/d*.012;w.fa=Math.atan2(dx,dz);w.moving=1}else w.moving=0}
  else w.fa=turn(w.fa,Math.atan2(p.x-w.x,p.z-w.z),.03);
  const d=Math.hypot(w.x-p.x,w.z-p.z);if(d<(w.boss?1.6*w.s:1.1)&&p.state==='free'){startBattle(w.g,'normal');return}}
 findNear();setZoneR(chapAt(p.z));if(held('camL'))cy+=.04;if(held('camR'))cy-=.04;if(held('camU'))cp=clamp(cp+.02,-.15,1.1);if(held('camD'))cp=clamp(cp-.02,-.15,1.1);
 if(touchUI&&p.moving&&!camDrag)cy=cy+angTo(cy,p.fa)*.012}
function findNear(){const p=PL;near=null;if(p.state!=='free')return;const d2=(x,z)=>Math.hypot(p.x-x,p.z-z);
 FIRES.forEach((f,i)=>{if(d2(f.x,f.z)<1.3)near={k:'fire',i,label:G.lit.includes(i)?'REST AT THE STOVE':'LIGHT THE STOVE'}});if(near)return;
 for(const it of ITEMS)if(!G.taken.includes(it.id)&&d2(it.x,it.z)<1){near={k:'item',o:it,label:'PICK UP'};return}
 for(const A of ARENAS)if(!G.boss[A.k]&&!arena&&p.z>A.fz-1.2&&p.z<A.fz&&p.x>11&&p.x<14){near={k:'fog',o:A,label:'ENTER THE FOG'};return}
 for(const m of MSGS)if(d2(m.x,m.z)<.8){near={k:'msg',o:m,label:'READ MESSAGE'};return}}
function interact(n){const p=PL;
 if(n.k==='fire')return restAt(n.i);
 if(n.k==='msg'){reading={m:n.o,t:0};SFX.radio();return}
 if(n.k==='item'){const it=n.o;G.taken.push(it.id);if(itemSpr[it.id])itemSpr[it.id].visible=false;if(it.k==='charm'){G.charms.push(it.c);itemBox={d:CHARMS[it.c],t:0}}else{G.items[it.k]=(G.items[it.k]||0)+1;itemBox={d:IDESC[it.k],t:0}}SFX.weapon();save();return}
 if(n.k==='fog'){p.state='fogwalk';p.t=0;p.arena=n.o;p.x=clamp(p.x,11.4,13.6);X.fog();return}}
function restAt(i){const first=!G.lit.includes(i);G.fire=i;if(first){G.lit.push(i);banner={t:0,dur:150,text:'TEA STOVE LIT',col:'#ffb04a',size:24};X.lit()}
 G.inf*=1.15;G.hp=null;G.cleared=G.cleared.filter(id=>{const g=GROUPS.find(g=>g.id===id);return g&&(g.boss||g.mimic)});spawnWanderers();save();music('ending');
 setTimeout(()=>{if(state==='play')openRest()},first?1200:300)}
const restEl=$('#rest');
let restNews=null;
function openRest(){state='rest';restEl.hidden=false;$('#touch').hidden=true;$('#tU').hidden=true;if(document.pointerLockElement)document.exitPointerLock();restNews=pick(NEWS);refreshRest();setTimeout(()=>{$('#restGo').focus({preventScroll:true});restEl.scrollTop=0},50)}
function priceOf(k){return Math.round(({wine:220,balm:600,aid:450})[k]*G.inf)}
function refreshRest(){const zh=LANG==='zh';$('#restH').textContent=tr(FIRES[G.fire].name);$('#restN').textContent=LZ('Party restored. ','全隊已恢復。')+tr(restNews||NEWS[0]);
 const sep=zh?'、':', ';$('#restP').innerHTML=HEROES.map(h=>`<div class="pc"><b>${tr(h.name)}</b><span>${tr(h.role)}</span><span>LV ${G.lvl} · ${zh?'生命':'HP'} ${heroStat(h,'hp')} · ${zh?'攻擊':'ATK'} ${Math.round(heroStat(h,'atk'))} · ${zh?'速度':'SPD'} ${Math.round(heroStat(h,'spd'))}</span><span>${zh?'技能：':'Skills: '}${h.skills.filter(s=>s.lv<=G.lvl).map(s=>zh?tr(s.n):s.n.toLowerCase()).join(sep)}</span></div>`).join('')+
 `<div class="pc" style="grid-column:1/-1"><span>${chapLabel(chapAt(FIRES[G.fire].z))} · ${zh?'經驗':'XP'} ${G.xp} / ${xpNeed()} · ${zh?'護身符：':'Charms: '}${G.charms.length?G.charms.map(c=>tr(CHARMS[c].n)).join(sep):(zh?'還沒有':'none yet')}</span></div>`;
 $('#restY').textContent='¥ '+fmtBig(G.yuan);const sh=$('#shop');sh.innerHTML='';
 for(const k of['wine','balm','aid']){const b=document.createElement('button');const pr=priceOf(k);b.innerHTML=`<span>${zh?'購買'+tr(IDESC[k].n)+'（持有 '+G.items[k]+'）':'BUY '+IDESC[k].n+' (have '+G.items[k]+')'}</span><span>¥ ${fmtBig(pr)}</span>`;b.disabled=G.yuan<pr;b.onclick=()=>{if(G.yuan<pr)return;G.yuan-=pr;G.items[k]=(G.items[k]||0)+1;SFX.pick();save();refreshRest()};sh.appendChild(b)}
 const wp=$('#warp');wp.innerHTML='';FIRES.forEach((f,i)=>{if(!G.lit.includes(i))return;const b=document.createElement('button');b.textContent=(zh?chapLabel(chapAt(f.z)):ROMAN[chapAt(f.z)])+' · '+tr(f.name)+(i===G.fire?(zh?'（目前位置）':'  (HERE)'):'');if(i===G.fire)b.className='here';
  b.onclick=()=>{if(i===G.fire)return;SFX.pick();restEl.hidden=true;respawn(i,true);save()};wp.appendChild(b)})}
$('#restGo').onclick=()=>{restEl.hidden=true;state='play';if(touchUI)$('#touch').hidden=false;music('off');PL.state='free'};

/* ---------------- world: per-chapter textures ---------------- */
let CTX_={},skyM=null,stageWalls=[],stageGround=null;
function hanT(g,s,x,y,c,size=13){g.fillStyle=c;g.font=`900 ${size}px "Noto Serif TC","Songti TC",serif`;g.textAlign='center';g.textBaseline='top';[...s].forEach((ch,i)=>g.fillText(ch,x,y+i*(size+1)))}
function chTextures(){if(CTX_.ok)return CTX_;const o=CTX_;o.ok=1;
 o.bund=mk(64,64,g=>{R(g,0,0,64,64,'#8a8070');for(let y=0;y<64;y+=16)R(g,0,y,64,1,'#6a6050');for(let x=0;x<64;x+=32)R(g,x,0,1,64,'#6a6050');R(g,0,0,64,6,'#5a5048');R(g,8,18,14,24,'#2a2a30');R(g,9,19,12,1,'#4a4a54');R(g,40,18,14,24,'#ffb860');R(g,46,18,1,24,'#5a4030');R(g,40,29,14,1,'#5a4030');R(g,0,56,64,8,'#6a6050')});
 o.shop=mk(64,64,g=>{R(g,0,0,64,64,'#4a3a30');R(g,4,4,16,52,'#8a1c14');hanT(g,'金號',12,8,'#f1d27a',13);for(let y=14;y<60;y+=4)R(g,24,y,36,3,y%8?'#5a5a62':'#4a4a52');R(g,24,10,36,4,'#2a2a30');R(g,30,30,22,14,'#e9dcc2');R(g,31,33,20,1,'#120d0c');R(g,31,36,14,1,'#120d0c');R(g,31,39,18,1,'#b3261e')});
 o.bank=mk(64,64,g=>{R(g,0,0,64,64,'#b0a890');for(const x of[6,26,46])R(g,x,10,10,54,'#c8c0a8'),R(g,x+8,10,2,54,'#8a8270');R(g,0,0,64,10,'#8a8270');g.fillStyle='#3a3020';g.font='7px "Press Start 2P",monospace';g.textAlign='center';g.fillText('BANK',32,8)});
 const bills=(g,base)=>{R(g,0,0,64,64,base);const rr=seeded(21);for(let i=0;i<26;i++){const x=rr()*56|0,y=rr()*58|0,c=rr()<.5?'#8aa070':rr()<.5?'#b0a070':'#c9b98a';R(g,x,y,14,7,c);R(g,x+1,y+1,12,1,'#5a6a3a');R(g,x+5,y+2,4,3,'#6a5a30')}};
 o.mint=mk(64,64,g=>{bills(g,'#2a2a22');R(g,0,0,64,4,'#1a1a14')});
 o.mintC=mk(32,32,g=>{R(g,0,0,32,32,'#7a6a42');for(let y=0;y<32;y+=6){R(g,0,y,32,5,y%12?'#8aa070':'#b0a070');R(g,0,y+5,32,1,'#3a3020');R(g,13,y,6,5,'#d9cfb8')}});
 o.snow=mk(64,64,g=>{R(g,0,0,64,64,'#6a6a72');const rr=seeded(23);for(let y=0;y<64;y+=8){const off=(y/8)%2*8;for(let x=-8;x<64;x+=16)R(g,x+off+1,y+1,14,6,rr()<.3?'#5a5a62':'#76767e')}R(g,0,0,64,8,'#f4f6fa');for(let x=0;x<64;x+=6)R(g,x,8,3,2+(x%4),'#e8ecf2')});
 o.sand=mk(32,32,g=>{R(g,0,0,32,32,'#8a7a5a');for(let y=0;y<32;y+=8)for(let x=(y/8)%2*8-8;x<32;x+=16){R(g,x+1,y+1,14,6,'#a08a62');R(g,x+1,y+6,14,1,'#5a4a32')}R(g,0,0,32,5,'#f4f6fa')});
 o.ware=mk(64,64,g=>{for(let x=0;x<64;x+=4)R(g,x,0,4,64,x%8?'#5a5a62':'#4a4a52');const rr=seeded(41);for(let i=0;i<12;i++)R(g,rr()*60|0,rr()*60|0,4,3,'#7a4a2a');R(g,0,0,64,4,'#2a2a30');R(g,14,22,36,14,'#2a2a30');g.fillStyle='#d9a441';g.font='6px "Press Start 2P",monospace';g.textAlign='center';g.fillText('BOND',32,31)});
 o.snowG=mk(32,32,g=>{R(g,0,0,32,32,'#e4e9f0');const rr=seeded(29);for(let i=0;i<30;i++)R(g,rr()*32|0,rr()*32|0,2,1,rr()<.5?'#cfd6e0':'#ffffff');for(let i=0;i<4;i++)R(g,rr()*30|0,rr()*30|0,3,2,'#8a96a6')});
 o.mintG=mk(32,32,g=>{R(g,0,0,32,32,'#2e3230');for(let y=0;y<32;y+=16)for(let x=0;x<32;x+=16)R(g,x+1,y+1,14,14,(x+y)%32?'#3a403a':'#343834');const rr=seeded(31);for(let i=0;i<5;i++){const x=rr()*26|0,y=rr()*28|0;R(g,x,y,7,4,rr()<.5?'#8aa070':'#b0a070')}});
 o.dirt=mk(32,32,g=>{const R_=seeded(3);R(g,0,0,32,32,'#4a382a');for(let i=0;i<40;i++)R(g,R_()*32|0,R_()*32|0,2,1,R_()<.5?'#3a2c20':'#5a4634')});
 o.cob=mk(32,32,g=>{R(g,0,0,32,32,'#3e3634');const R_=seeded(5);for(let y=0;y<32;y+=8)for(let x=(y/8%2)*4;x<32;x+=8)R(g,x+1,y+1,6,6,R_()<.5?'#5a5250':'#4e4644')});
 o.plank=mk(32,32,g=>{for(let y=0;y<32;y+=8){R(g,0,y,32,8,y%16?'#6a4a30':'#5a3e28');R(g,0,y,32,1,'#2a1a10')}R(g,10,0,1,32,'#3a2818')});
 return o}
function wallTex(c,ch){const o=chTextures();
 if(c==='c')return ch===3?o.mintC:ch===4?o.sand:PROPS.crate().n;
 if(ch===0)return c==='Q'?o.shop:c==='W'?o.bank:c==='P'?TEX.P:o.bund;
 if(ch===3)return o.mint;if(ch===4)return o.snow;if(ch===5)return c==='W'?TEX.W:o.ware;return TEX[c]||TEX['#']}
function groundKey(c,z){const ch=chapAt(z),dz=z-ch*CHL;if(c==='=')return'plank';if(ch===3)return'mintG';if(ch===4)return'snowG';
 if(dz>=37&&dz<=52)return'cob';return['cob','dirt','dirt','mintG','snowG','plank'][ch]}
function buildWorldR(){buildTextures();const o=chTextures(),NZ=grid.length;
 const types={};for(let z=0;z<NZ;z++)for(let x=0;x<MW;x++){const c=grid[z][x];if(!isWall(c))continue;let vis=false;for(const[dx,dz]of[[1,0],[-1,0],[0,1],[0,-1]])if(openC((grid[z+dz]||[])[x+dx]))vis=true;if(vis){const k=c+chapAt(z);(types[k]=types[k]||[]).push([x,z])}}
 const topM=LM({color:0x2a1c18}),snowTop=LM({color:0xeef2f8});
 for(const ck in types){const c=ck[0],ch=+ck.slice(1),h=WALLH[c],geo=new THREE.BoxGeometry(1,h,1),uv=geo.attributes.uv;for(let f=0;f<6;f++){if(f===2||f===3)continue;for(let i=0;i<4;i++){const k=f*4+i;uv.setY(k,uv.getY(k)*h/1.3)}}geo.translate(0,h/2,0);
  const m=LM({map:tex(wallTex(c,ch),true)});const tm_=ch===4?snowTop:topM;const mats=[m,m,c==='c'?m:tm_,tm_,m,m];
  const im=new THREE.InstancedMesh(geo,mats,types[ck].length);const M=new THREE.Matrix4();types[ck].forEach(([x,z],i)=>{M.makeTranslation(x+.5,0,z+.5);im.setMatrixAt(i,M)});S3.add(im)}
 const tiles={};for(let z=0;z<NZ;z++)for(let x=0;x<MW;x++){const c=grid[z][x];if(c==='~'||isWall(c)&&c!=='c')continue;const k=groundKey(c,z);(tiles[k]=tiles[k]||[]).push([x,z])}
 const pg=new THREE.PlaneGeometry(1,1);pg.rotateX(-Math.PI/2);
 for(const k in tiles){const im=new THREE.InstancedMesh(pg,LM({map:tex(o[k])}),tiles[k].length);const M=new THREE.Matrix4();tiles[k].forEach(([x,z],i)=>{M.makeTranslation(x+.5,0,z+.5);im.setMatrixAt(i,M)});S3.add(im)}
 const wcv=mk(32,32,g=>{R(g,0,0,32,32,'#24344e');const R_=seeded(9);for(let i=0;i<18;i++)R(g,R_()*32|0,R_()*32|0,6,1,R_()<.5?'#4a6a90':'#34507a')});waterTex=tex(wcv,true);waterTex.repeat.set(30,NZ+10);
 const wm=new THREE.Mesh(new THREE.PlaneGeometry(30,NZ+10),new THREE.MeshBasicMaterial({map:waterTex}));wm.rotation.x=-Math.PI/2;wm.position.set(13,-.45,NZ/2);S3.add(wm);
 for(let z=0;z<NZ;z+=3)for(const x of[11,15]){const ok=x===11?grid[z][11]==='='&&grid[z][10]==='~':grid[z][14]==='='&&grid[z][15]==='~';if(ok){const m=new THREE.Mesh(BOX,LM({color:0x3a2818}));m.scale.set(.18,1.2,.18);m.position.set(x,-.2,z+.5);S3.add(m)}}
 const fcv=mk(32,64,g=>{const R_=seeded(12);for(let y=0;y<64;y++)for(let x=0;x<32;x+=2){const a=.25+R_()*.35;g.fillStyle=`rgba(240,236,228,${a})`;g.fillRect(x,y,2,1)}});fogTex=tex(fcv,true);
 for(const A of ARENAS)for(const [z,kind] of[[A.fz+.5,'F'],[A.gz+.5,'G']]){const m=new THREE.Mesh(new THREE.PlaneGeometry(4,2.6),new THREE.MeshBasicMaterial({map:fogTex,transparent:true,opacity:.75,depthWrite:false,side:THREE.DoubleSide}));m.position.set(12.5,1.3,z);m.userData={A,kind};S3.add(m);fogMeshes.push(m)}
 FIRES.forEach((f,i)=>{const g=new THREE.Group();g.position.set(f.x,0,f.z);const b=new THREE.Mesh(BOX,LM({color:0x6a4a3a}));b.scale.set(.7,.55,.7);b.position.y=.275;g.add(b);
  const mouth=new THREE.Mesh(BOX,LM({color:0x1a100c}));mouth.scale.set(.4,.25,.05);mouth.position.set(0,.2,.36);g.add(mouth);
  const k=new THREE.Mesh(BOX,LM({color:0x3a3a40}));k.scale.set(.36,.22,.36);k.position.y=.66;g.add(k);
  const rifle=new THREE.Mesh(BOX,LM({color:0x7a5230}));rifle.scale.set(.05,1,.07);rifle.position.set(.5,.45,0);rifle.rotation.z=.2;g.add(rifle);
  const fl=new THREE.Sprite(new THREE.SpriteMaterial({map:tex(flameCv[0]),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));fl.scale.set(.5,.6,1);fl.position.set(0,.3,.42);g.add(fl);
  const L_=new THREE.PointLight(0xff9040,0,9,2);L_.position.set(0,1,0.6);g.add(L_);S3.add(g);stoveObjs.push({g,fl,L:L_})});
 const mcv=mk(32,16,g=>{g.fillStyle='rgba(255,154,58,.9)';for(let i=0;i<5;i++){g.fillRect(4+i*5,6+(i%2)*3,4,1);g.fillRect(5+i*5,5+(i%3),1,4)}g.fillRect(3,12,26,1)});
 for(const m of MSGS){const p=new THREE.Mesh(new THREE.PlaneGeometry(.8,.4),new THREE.MeshBasicMaterial({map:tex(mcv),transparent:true,depthWrite:false}));p.rotation.x=-Math.PI/2;p.position.set(m.x,.02,m.z);S3.add(p);msgMesh.push(p)}
 const icv=mk(16,16,g=>{const gr=g.createRadialGradient(8,8,0,8,8,8);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.3,'rgba(255,250,220,.7)');gr.addColorStop(1,'rgba(255,240,200,0)');g.fillStyle=gr;g.fillRect(0,0,16,16)});
 for(const it of ITEMS){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex(icv),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));s.scale.set(.5,.5,1);s.position.set(it.x,.35,it.z);S3.add(s);itemSpr[it.id]=s}
 stainSpr=new THREE.Sprite(new THREE.SpriteMaterial({map:tex(icv),transparent:true}));stainSpr.visible=false;S3.add(stainSpr);
 // the last ferry, waiting at the end of the last pier
 ferry=new THREE.Group();const hull=new THREE.Mesh(BOX,LM({color:0x4a3220}));hull.scale.set(3,.6,2.2);hull.position.y=-.1;ferry.add(hull);const mast=new THREE.Mesh(BOX,LM({color:0x3a2a20}));mast.scale.set(.12,3,.12);mast.position.y=1.5;ferry.add(mast);
 const sail=new THREE.Mesh(BOX,LM({color:0xd9cfb8}));sail.scale.set(1.6,1.4,.04);sail.position.set(0,1.9,.1);ferry.add(sail);ferry.position.set(12.5,0,(NCH-1)*CHL+62.6);S3.add(ferry);
 // chapter dressing: burning village, Bund street poles, Shanghai flags
 const R_=seeded(77);for(let z=CHL;z<2*CHL;z++)for(let x=0;x<MW;x++){if(grid[z][x]!=='W'||R_()>.35)continue;const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex(flameCv[0]),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));s.scale.set(1,1.3,1);s.position.set(x+.5,2.8,z+.5);S3.add(s);flameSpr.push(s)}
 const pole=PROPS.pole().n;for(const[x,z]of[[6.4,10],[18.6,10],[6.4,24],[18.6,30],[6.4,33]]){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex(pole),transparent:true}));s.scale.set(1.3,2.9,1);s.position.set(x,1.45,z);S3.add(s)}
 const flag=mk(24,16,g=>{R(g,0,0,24,16,'#c8372d');R(g,0,0,12,8,'#2f4f8a');g.fillStyle='#f2f2f2';g.beginPath();g.arc(6,4,2.2,0,TAU);g.fill()});
 for(const[x,z]of[[8.5,1.6],[16.5,1.6],[8.5,CHL*2+1.6],[16.5,CHL*2+1.6],[8.5,CHL*5+1.6],[16.5,CHL*5+1.6]]){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex(flag)}));s.scale.set(1.2,.8,1);s.position.set(x,2.6,z);S3.add(s)}
 skyM=S3.children.find(o=>o.geometry&&o.geometry.type==='CylinderGeometry')||null}
function setZoneR(i){if(i===LV)return;LV=i;const z=ZONES[i];if(S3){S3.fog.color.setHex(z.fog);S3.background.setHex(z.bg);hemi.intensity=z.hemi;hemi.color.setHex(z.hc||0xffb890);sunL.intensity=z.sun;if(skyM)skyM.visible=z.sky!==false}
 ambSet();if(state==='play'&&G&&!G.seen.includes(i)){G.seen.push(i);save();if(CH_SC[i])chapterScene(i);else areaB={t:0,z}}}
function chapterScene(i){playScene(CH_SC[i],()=>{state='play';fadeA=1;if(touchUI)$('#touch').hidden=false;areaB={t:0,z:ZONES[i]};music('off')});music('ending')}
function stageTheme(ch){if(!stage)return;for(const w of stageWalls){w.material.map=tex(wallTex(w.userData.k,ch),true);w.material.needsUpdate=true}
 const o=chTextures(),gk=['cob','dirt','plank','mintG','snowG','plank'][ch];let t=stageGround.userData[gk];if(!t){const cv=mk(32,32,g=>g.drawImage(o[gk],0,0));t=tex(cv,true);t.repeat.set(16,12);stageGround.userData[gk]=t}stageGround.material.map=t;stageGround.material.needsUpdate=true}

/* ---------------- battle stage ---------------- */
let stage=null;
function buildStage(){stage=new THREE.Group();S3.add(stage);
 const gcv=mk(64,64,g=>{R(g,0,0,64,64,'#3e3634');const R_=seeded(15);for(let y=0;y<64;y+=8)for(let x=(y/8%2)*4;x<64;x+=8)R(g,x+1,y+1,6,6,R_()<.5?'#5a5250':'#4e4644');for(let i=0;i<30;i++)R(g,R_()*64|0,R_()*64|0,2,2,'#2a2220')});
 const gt=tex(gcv,true);gt.repeat.set(8,6);const gm=new THREE.Mesh(new THREE.PlaneGeometry(26,20),LM({map:gt}));gm.rotation.x=-Math.PI/2;gm.position.set(BX,0,BZ);stage.add(gm);stageGround=gm;gm.userData={};
 const R_=seeded(99);for(let i=0;i<16;i++){const a=-1.5+i*.2,rr=11+R_()*2,x=BX+Math.cos(a)*rr,z=BZ+Math.sin(a)*rr;const k=pick(['#','P','Q','W']);const h=2+R_()*2.5;const m=new THREE.Mesh(BOX,LM({map:tex(TEX[k],true)}));m.userData.k=k;stageWalls.push(m);m.scale.set(2.2,h,2.2);m.position.set(x,h/2,z);m.rotation.y=-a;stage.add(m);
  if(R_()<.6){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex(flameCv[0]),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));s.scale.set(2,2.6,1);s.position.set(x,h+1,z);stage.add(s);flameSpr.push(s)}}
 for(let i=0;i<6;i++){const a=2+i*.4,x=BX+Math.cos(a)*9,z=BZ+Math.sin(a)*8;const m=new THREE.Mesh(BOX,LM({map:tex(PROPS.crate().n)}));m.scale.set(.9,.9,.9);m.position.set(x,.45,z);stage.add(m)}
 const L_=new THREE.PointLight(0xff8040,1.3,22,2);L_.position.set(BX+2,4,BZ-6);stage.add(L_);stage.visible=false}

/* ---------------- battle ---------------- */
function mkUnit(o){return Object.assign({buff:{},ko:false,act:'idle',t:0,next:0,ph:0,brk:0,broken:0,flash:0,id:Math.random()},o)}
function startBattle(g,mode){if(B)return;const isBoss=!!g.boss;state='battle';if(document.pointerLockElement)document.exitPointerLock();$('#touch').hidden=true;$('#tU').hidden=true;
 const hs=HEROES.map((h,i)=>{const mx=heroStat(h,'hp'),hp=G.hp?Math.min(mx,G.hp[i]):mx;return mkUnit({side:'h',h,name:h.name,m:PMS[i],hp,max:mx,ko:hp<=0,atk:heroStat(h,'atk'),def:heroStat(h,'def'),spd:heroStat(h,'spd'),ap:2+(has('card')?2:0),infl:h.id==='qian'&&has('abacus')?3:0,x:BX-3.4-(i===1?.6:0),z:BZ-2.4+i*2.4,fa:Math.PI/2,s:1})});
 hs.forEach(u=>{u.hx=u.x;u.hz=u.z;if(u.ko)u.hp=0});
 const ch=chapAt(g.z);stageTheme(ch);const ks=isBoss?[g.boss]:g.k;const es=ks.map((k,i)=>{const d=EB[k];const n=ks.length;const z=BZ+(i-(n-1)/2)*2.3;const hm=d.boss?1:1+ch*.34,am=d.boss?1:1+ch*.2;
  const m=mkEnemyModel(d);
  return mkUnit({side:'e',k,d,name:d.name,m,hp:Math.round(d.hp*hm),max:Math.round(d.hp*hm),atk:d.atk*am,def:d.def,spd:d.spd,brkMax:d.brk,x:BX+3.2+(isBoss?1:Math.abs(i-(n-1)/2)*.5),z:isBoss?BZ:z,fa:-Math.PI/2,s:d.s||1,phase:1})});
 es.forEach(u=>{u.hx=u.x;u.hz=u.z});
 B={g,ch,hs,es,mode,isBoss,turn:null,task:null,wait:0,waitFn:null,menu:null,sel:0,tsel:0,react:null,qte:null,aim:null,over:null,t:0,cam:{p:new THREE.Vector3(BX-9,3.4,BZ+7),l:new THREE.Vector3(BX+1,1,BZ)},log:null};
 for(const u of hs)u.next=100/u.spd*(mode==='ambush'?.3:1)+rnd()*2;for(const u of es)u.next=100/u.spd*(mode==='ambush'?1.6:1)+rnd()*3;
 if(mode==='ambush')for(const e of es)e.hp=Math.round(e.hp*.85);
 for(const w of wanderers)w.m.root.visible=false;stage.visible=true;fadeA=1;camera.position.copy(B.cam.p);camera.userData.l=B.cam.l.clone();
 music(isBoss?EB[g.boss].music:['m1','m2','m3','m4','m5','m1'][ch]);X.fog();SFX.alarm&&SFX.radio();
 banner=isBoss?{t:0,dur:150,text:EB[g.boss].name,sub:EB[g.boss].sub,col:'#e9dcc2',size:26}:{t:0,dur:80,text:mode==='ambush'?'AMBUSH!':'BATTLE',col:mode==='ambush'?'#ffd24a':'#e9dcc2',size:24};
 runTask(battleIntro())}
function* battleIntro(){yield isBossB()?110:50;nextTurn()}
const isBossB=()=>B&&B.isBoss;
const alive=a=>a.filter(u=>!u.ko&&u.hp>0);
function runTask(gen){B.task=gen;B.wait=0;B.waitFn=null}
function stepTask(){if(!B||!B.task)return;if(B.wait>0){B.wait--;return}if(B.waitFn){if(!B.waitFn())return;B.waitFn=null}
 const cur=B.task,r=cur.next();if(!B)return;if(r.done){if(B.task===cur)B.task=null;return}if(B.task!==cur)return;const v=r.value;if(typeof v==='number')B.wait=v;else if(typeof v==='function')B.waitFn=v}
function turnOrder(n=8){const all=alive(B.hs).concat(alive(B.es)).map(u=>({u,t:u.next}));const out=[];for(let i=0;i<n&&all.length;i++){all.sort((a,b)=>a.t-b.t);out.push(all[0].u);all[0].t+=100/effSpd(all[0].u)}return out}
const effSpd=u=>u.spd*(u.buff.slow?.7:1);
function nextTurn(){if(checkEnd())return;const all=alive(B.hs).concat(alive(B.es));all.sort((a,b)=>a.next-b.next);const u=all[0];const base=u.next;for(const o of all)o.next-=base;u.next+=100/effSpd(u);B.turn=u;
 for(const k in u.buff){u.buff[k]--;if(u.buff[k]<=0)delete u.buff[k]}
 if(u.side==='h'){if(u.broken){u.broken=0}B.menu={lv:'main'};B.sel=0;camHero(u)}else runTask(enemyTurn(u))}
function checkEnd(){if(!alive(B.es).length){runTask(victory());return true}if(!alive(B.hs).length){runTask(defeat());return true}return false}
function endAction(){B.menu=null;B.aim=null;B.qte=null;B.react=null;$('#react').hidden=true;camOverview();runTask((function*(){yield 18;nextTurn()})())}
// camera helpers
function camOverview(){B.cam.p.set(BX-9,3.4,BZ+7);B.cam.l.set(BX+1,1,BZ)}
function camHero(u){B.cam.p.set(BX-8.5,3.1,u.z*.5+BZ*.5+5.5);B.cam.l.set(BX+1.5,1,u.z*.3+BZ*.7)}
function camOn(a,b){const mx=(a.x+b.x)/2,mz=(a.z+b.z)/2,k=Math.max(a.s||1,b.s||1);B.cam.p.set(mx-2,2.6+k*.6,mz+6+k*1.8);B.cam.l.set(mx,1+k*.25,mz)}
// movement
function* runTo(u,x,z,f=22){const sx=u.x,sz=u.z;u.fa=Math.atan2(x-sx,z-sz);for(let i=1;i<=f;i++){u.x=lerp(sx,x,i/f);u.z=lerp(sz,z,i/f);u.act='run';u.ph+=.35;yield 1}u.act='idle'}
function* runBack(u){yield* runTo(u,u.hx,u.hz,20);u.fa=u.side==='h'?Math.PI/2:-Math.PI/2}
// damage
function dmgCalc(a,t,mul){const raw=a.atk*mul*(a.buff.rage?1.3:1)*(a.buff.rally?1.15:1)*(t.buff.mark?1.3:1)*(t.broken?1.5:1)*(.92+rnd()*.16);return Math.max(1,Math.round(raw*100/(100+t.def*6)))}
function hitUnit(t,n,o={}){if(t.ko)return;t.hp=Math.max(0,t.hp-n);t.flash=8;X.flesh();blood(t.x,1*t.s,t.z,o.big?24:10);shake=Math.max(shake,o.big?8:3);hs=Math.max(hs,o.big?6:3);
 pop(t.x,1.6*t.s+.2,t.z,String(n),o.crit?'#ffd24a':t.side==='h'?'#ff6a5a':'#fff');
 if(t.side==='e'&&!t.broken&&o.brk){t.brk+=o.brk;if(t.brk>=t.brkMax){t.brk=0;t.broken=1;t.next+=100/t.spd;pop(t.x,2.1*t.s,t.z,'BROKEN!','#ffd24a');SFX.clang();if(t.k==='printer')for(const h of B.hs)h.paint=0}}
 if(t.side==='e'&&t.d.p2&&t.phase===1&&t.hp<t.max*.5&&t.hp>0){t.phase=2;t.spd*=1.15;banner={t:0,dur:120,text:t.d.p2t||'ENRAGED',sub:t.d.p2s||'',col:'#ff8a3a',size:22};music('final');
  if(t.d.turn){killMesh(t.m);t.m=mkChar({fac:'ccp',wpn:t.d.wpn,s:t.d.s,officer:1});t.fac2='ccp';for(let i=0;i<30;i++)fx.push({x:t.x+(rnd()-.5),y:rnd()*2.5,z:t.z+(rnd()-.5),vx:0,vy:.03,vz:0,l:40,c:pick(['#5f6b3f','#2f4166']),g:0})}}
 if(t.hp<=0){t.ko=true;t.act='ko';t.t=0;if(t.side==='e'){X.coin();blood(t.x,.8,t.z,30)}else{pop(t.x,2,t.z,'DOWN','#ff6a5a')}}}
function heal(t,n){if(t.ko)return;t.hp=Math.min(t.max,t.hp+n);pop(t.x,1.8,t.z,'+'+n,'#9fe0a0');for(let i=0;i<12;i++)fx.push({x:t.x+(rnd()-.5)*.6,y:rnd()*1.4,z:t.z+(rnd()-.5)*.6,vx:0,vy:.02,vz:0,l:30,c:'#9fe0a0',g:0,f:1})}
// QTE ring
function* qte(t,dur=44){B.qte={t:0,dur,u:t,res:null};while(B.qte.t<dur+10&&!B.qte.res){B.qte.t++;yield 1}const res=B.qte.res||'MISS';B.qte=null;
 pop(t.x,2.2*t.s,t.z,res==='PERFECT'?'PERFECT!':res==='GOOD'?'GOOD':'',res==='PERFECT'?'#ffd24a':'#e9dcc2');if(res==='PERFECT')X.parry();return res==='PERFECT'?1.5:res==='GOOD'?1.2:1}
function qtePress(){const q=B.qte;if(!q||q.res)return;const d=Math.abs(q.dur-q.t);q.res=d<=4?'PERFECT':d<=10?'GOOD':'MISS'}
// hero actions
function heroAct(u,kind,sk,tg){B.menu=null;runTask(heroActGen(u,kind,sk,tg))}
function* heroActGen(u,kind,sk,tg){
 if(kind==='attack'){const t=tg;camOn(u,t);if(u.h.melee||u.h.id==='hong'&&false){yield* runTo(u,t.x-1.1-.4*t.s,t.z);u.act='swing';u.t=0;X.swing();yield 8;hitUnit(t,dmgCalc(u,t,1),{brk:10});yield 16;yield* runBack(u)}
  else if(u.h.id==='hong'){u.act='shout';u.t=0;yield 10;yield* wordFly(u,t,pick(['TRUST THE GOLD YUAN!','BUY GOVERNMENT BONDS!','STAY CALM AND QUEUE!']));hitUnit(t,dmgCalc(u,t,1),{brk:10});yield 16}
  else{u.act='aim';u.t=0;yield 14;yield* shot(u,t);hitUnit(t,dmgCalc(u,t,1),{brk:10});yield 16}
  u.ap=Math.min(9,u.ap+1);u.act='idle';return endAction()}
 if(kind==='item'){const it=sk;G.items[it]--;u.act='cast';yield 16;if(it==='wine'){heal(tg,Math.round(tg.max*.5));X.heal()}else if(it==='aid'){for(const h of alive(B.hs))heal(h,Math.round(h.max*.35));X.heal()}else{tg.ko=false;tg.hp=Math.round(tg.max*.35);tg.act='idle';heal(tg,0);X.heal();pop(tg.x,2.1,tg.z,'REVIVED','#9fe0a0')}yield 20;u.act='idle';return endAction()}
 if(kind==='shoot'){u.ap-=1;const t=tg;camOn(u,t);u.act='aim';B.aim={t:0,u:t,res:null};while(!B.aim.res&&B.aim.t<240){B.aim.t++;yield 1}const res=B.aim.res||'MISS';B.aim=null;yield* shot(u,t);
  if(res==='WEAK'){hitUnit(t,dmgCalc(u,t,2.6),{brk:35,crit:1,big:1});pop(t.x,2.4*t.s,t.z,'WEAK POINT!','#ffd24a')}else hitUnit(t,dmgCalc(u,t,.8),{brk:5});yield 20;u.act='idle';return endAction()}
 // skills
 u.ap-=sk.ap;banner={t:0,dur:70,text:sk.n,col:'#ffd24a',size:16,small:1};const t=tg;
 switch(sk.id){
 case 'chop':{camOn(u,t);yield* runTo(u,t.x-1.1-.4*t.s,t.z);u.act='raise';const q=yield* qte(t);u.act='swing';u.t=0;X.heavy();yield 6;hitUnit(t,dmgCalc(u,t,2.2*q),{brk:40,big:1,crit:q>1.4});yield 18;yield* runBack(u);break}
 case 'roar':{u.act='roar';u.shout={s:'DIE, REDS!',t:80};shake=10;SFX.alarm();for(const h of alive(B.hs))h.buff.rage=3;yield 60;break}
 case 'spin':{camOverview();yield* runTo(u,BX+1.2,BZ);u.act='raise';const q=yield* qte(alive(B.es)[0]||u);for(let k=0;k<2;k++){u.act='spin';X.swing();yield 10;for(const e of alive(B.es))hitUnit(e,dmgCalc(u,e,.9*q),{brk:15})}yield 16;yield* runBack(u);break}
 case 'last':{camOn(u,t);yield* runTo(u,t.x-1.1-.4*t.s,t.z);u.act='raise';u.shout={s:'FOR MY BACK PAY!',t:70};const q=yield* qte(t,40);u.act='swing';X.heavy();yield 6;hitUnit(t,dmgCalc(u,t,(3+(1-u.hp/u.max)*3)*q),{brk:70,big:1,crit:q>1.4});yield 20;yield* runBack(u);break}
 case 'blitz':{camOn(u,t);yield* runTo(u,t.x-1.1-.4*t.s,t.z);u.shout={s:'JANUARY! FEBRUARY! MARCH!...',t:90};for(let k=0;k<5&&!t.ko;k++){u.act='raise';const q=yield* qte(t,k?26:40);u.act='swing';u.t=0;X.heavy();yield 5;hitUnit(t,dmgCalc(u,t,.95*q),{brk:16,crit:q>1.4,big:k===4})}yield 16;yield* runBack(u);break}
 case 'reel':{u.act='shout';u.shout={s:'NOW SHOWING: VICTORY!',t:80};const q=yield* qte(alive(B.es)[0]||u,36);for(const e of alive(B.es)){yield* wordFly(u,e,pick(['GLORIOUS VICTORY!','ENEMY ROUTED!','TOTALLY RECENT FOOTAGE!']),12);hitUnit(e,dmgCalc(u,e,1.3*q),{brk:20});e.buff.slow=3}break}
 case 'reform':{camOn(u,t);u.act='cast';u.shout={s:'STRIKE OFF THREE ZEROS!',t:70};yield 24;const n=Math.max(1,Math.round(t.hp*(t.d.boss?.1:.3)));hitUnit(t,n,{brk:30,big:1});pop(t.x,2.5*t.s,t.z,'-000','#d9a441');u.infl+=2;yield 24;break}
 case 'slogan':{u.act='shout';const q=yield* qte(alive(B.es)[0]||u,36);for(let k=0;k<4;k++){const e=pick(alive(B.es));if(!e)break;yield* wordFly(u,e,pick(['THE SITUATION IS EXCELLENT!','PRICES ARE FROZEN!','VICTORY BY CHRISTMAS!','AMERICAN AID IS COMING!']),14);hitUnit(e,dmgCalc(u,e,.6*q),{brk:12})}break}
 case 'dress':{u.act='cast';yield 20;heal(t,Math.round(t.max*.45));X.heal();delete t.buff.slow;yield 20;break}
 case 'struggle':{u.act='shout';u.shout={s:'FILL THIS OUT IN TRIPLICATE!',t:70};yield 24;for(const e of alive(B.es)){e.buff.mark=3;hitUnit(e,dmgCalc(u,e,.4),{brk:10});if(!e.d.boss&&rnd()<.35){e.next+=100/e.spd;pop(e.x,2.2*e.s,e.z,'STUNNED','#ffd24a')}}yield 24;break}
 case 'rally':{u.act='roar';u.shout={s:'BUTTON YOUR COLLARS AND RISE!',t:80};yield 24;for(const h of B.hs){if(h.ko){h.ko=false;h.hp=1;h.act='idle'}heal(h,Math.round(h.max*.35));h.buff.rally=2}X.heal();yield 30;break}
 case 'aimed':{camOn(u,t);u.act='aim';const q=yield* qte(t,40);yield* shot(u,t);hitUnit(t,dmgCalc(u,t,1.7*q),{brk:22,crit:q>1.4});u.infl++;yield 16;break}
 case 'audit':{u.act='cast';yield 20;t.buff.mark=4;t.brk=Math.min(t.brkMax-1,t.brk+45);pop(t.x,2.2*t.s,t.z,'AUDITED','#ffd24a');SFX.radio();yield 24;break}
 case 'press':{u.act='cast';u.infl+=2;yield 20;t.ap=Math.min(9,t.ap+2);pop(t.x,2,t.z,'+2 AP','#ffd24a');pop(u.x,2.2,u.z,'INFLATION +2','#d9a441');yield 20;break}
 case 'hyper':{camOverview();u.act='aim';u.shout={s:'SPEND IT BEFORE IT ROTS!',t:70};const q=yield* qte(alive(B.es)[0]||u,40);const st=u.infl;u.infl=0;for(let i=0;i<20;i++)fx.push({x:BX+(rnd()-.5)*8,y:4+rnd()*2,z:BZ+(rnd()-.5)*8,vx:0,vy:-.05,vz:0,l:70,c:pick(['#b0a070','#8aa070','#d9a441']),g:0});
  yield 30;for(const e of alive(B.es))hitUnit(e,dmgCalc(u,e,(.5+.45*Math.pow(st,1.25))*q),{brk:10+st*4,big:st>3});yield 20;break}}
 u.act='idle';endAction()}
function* shot(u,t){u.act='fire';SFX.shot();for(let i=0;i<10;i++)fx.push({x:u.x+.6,y:1,z:u.z,vx:(t.x-u.x)/12,vy:0,vz:(t.z-u.z)/12,l:12,c:'#ffe27a',g:0,f:1});yield 10;u.act='aim'}
function* wordFly(u,t,txt_,f=22){const c=wordSprite(txt_).n;const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex(c),depthWrite:false}));sp.scale.set(c.width/c.height*.4,.4,1);S3.add(sp);SFX.word();
 for(let i=0;i<=f;i++){const k=i/f;sp.position.set(lerp(u.x,t.x,k),1.4+Math.sin(k*Math.PI)*.8,lerp(u.z,t.z,k));yield 1}S3.remove(sp)}
// enemy turn
function* enemyTurn(e){yield 10;
 if(e.broken){e.broken=0;pop(e.x,2.2*e.s,e.z,'RECOVERING','#a8977c');yield 30;return endAction()}
 if(e.k==='printer'){for(const h of alive(B.hs))if(h.paint>0){h.paint--;if(h.paint===0){camOn(e,h);banner={t:0,dur:90,text:'ERASED',sub:()=>LZ(h.name+' WAS WORTH LESS THAN THE NUMBER',tr(h.name)+'的價值，比數字還低'),col:'#e9dcc2',size:24};yield 30;
   for(let i=0;i<40;i++)fx.push({x:h.x+(rnd()-.5)*.6,y:rnd()*1.6,z:h.z+(rnd()-.5)*.6,vx:(rnd()-.5)*.02,vy:.03,vz:(rnd()-.5)*.02,l:60,c:'#e9dcc2',g:0});if(window.__d&&window.__d.bot)window.__d.bot.log.push('ERASED>'+h.h.short+':'+h.hp);h.hp=0;h.ko=true;h.act='ko';yield 50;if(checkEnd())return}}
  if(e.phase===2&&(e.nup=(e.nup||0)+1)<=8){e.atk*=1.06;pop(e.x,2.8*e.s,e.z,'ATK +6%','#ff8a3a')}}
 const moves=e.phase===2&&e.d.p2?e.d.p2:e.d.moves;let mv=pick(moves);e.tn=(e.tn||0)+1;if(mv.paint&&(B.hs.some(h=>h.paint>0&&!h.ko)||e.tn-(e.pt||-9)<4))mv=moves[0];if(mv.paint)e.pt=e.tn;if(mv.buff&&(e.buff.rect||(e.nbuff||0)>=2))mv=moves[0];
 B.log={n:mv.n,t:0};
 if(mv.buff){e.nbuff=(e.nbuff||0)+1;e.act='roar';e.shout={s:mv.shout||'I FEEL STRONGER!',t:80};yield 40;e.buff.rect=3;e.atk*=1.2;heal(e,Math.round(e.max*.1));yield 30;e.act='idle';return endAction()}
 if(mv.paint){const h=pick(alive(B.hs).filter(h=>!h.paint));camOn(e,h);e.act='roar';e.shout={s:'YOUR NUMBER IS 48.',t:80};yield 40;h.paint=4;pop(h.x,2.4,h.z,'PAINTED: 48','#e9dcc2');if(!B.painted){B.painted=1;banner={t:0,dur:150,text:'PAINTED: 48',sub:'ERASED IN 4 TURNS · DODGE OR PARRY A BLOW TO SMUDGE IT',sub2:'OR BREAK THE PRINTER',col:'#e9dcc2',size:20}}SFX.radio();yield 40;e.act='idle';return endAction()}
 const pd=e.k==='printer'&&alive(B.hs).find(h=>h.paint>0);const tgs=mv.aoe?alive(B.hs):[pd&&rnd()<.75?pd:pickTarget()];const t=tgs[0];
 if(mv.aoe)camOverview();else camOn(e,t);
 const melee=!e.d.ranged&&!mv.aoe&&!mv.word;
 if(melee)yield* runTo(e,t.x+1.1+.4*e.s,t.z,24);else e.fa=Math.atan2(t.x-e.x,t.z-e.z);
 e.act='wind';e.t=0;yield 10;
 let parries=0;
 for(let i=0;i<mv.hits.length;i++){const res=yield* reactHit(e,tgs,mv.hits[i],mv,i===mv.hits.length-1);if(res==='parry')parries++;if(!alive(B.hs).length)break}
 if(mv.steal&&G.yuan>0){const n=Math.max(1,Math.round(G.yuan*.08));G.yuan-=n;pop(t.x,2.4,t.z,'-¥'+fmtBig(n),'#d9a441');X.coin()}
 if(mv.drain){for(const h of alive(B.hs)){h.ap=Math.max(0,h.ap-2);pop(h.x,2.4,h.z,'ACCOUNT FROZEN -2 AP','#9fd3ff')}yield 20}
 e.act='idle';yield 14;if(melee)yield* runBack(e);
 if(!mv.aoe&&parries===mv.hits.length&&!t.ko){B.log={n:'COUNTER!',t:0};camOn(t,e);yield* runTo(t,e.x-1.1-.4*e.s,e.z,16);t.act='swing';X.heavy();yield 6;hitUnit(e,dmgCalc(t,e,1.6),{brk:30,big:1});yield 16;yield* runBack(t);t.act='idle'}
 endAction()}
function pickTarget(){const a=alive(B.hs);return rnd()<.4?a.reduce((m,h)=>h.hp/h.max<m.hp/m.max?h:m,a[0]):pick(a)}
function* reactHit(e,tgs,lead,mv,last){const rr={t:0,lead,press:null,tgs,aoe:!!mv.aoe};B.react=rr;$('#react').hidden=false;
 while(rr.t<lead){rr.t++;if(rr.t===lead-8)e.act='strike';yield 1}
 if(mv.aoe&&!mv.word){boomFx(BX-3.6,BZ);}if(mv.word){for(const h of tgs)spark(h.x,1.2,h.z,10,'#ff6a5a')}
 const pw=6+(has('pot')?3:0),dw=13+(has('pot')?4:0);let res='hit';
 if(rr.press){const diff=lead-rr.press.t;if(rr.press.k==='parry'&&diff>=-1&&diff<=pw)res='parry';else if(rr.press.k==='dodge'&&diff>=-1&&diff<=dw)res='dodge'}
 for(const h of tgs){if(h.ko)continue;
  if((res==='parry'||res==='dodge')&&h.paint){h.paint=0;pop(h.x,2.5,h.z,'SMUDGED!','#e9dcc2')}
  if(res==='parry'){X.parry();spark(h.x+.4,1.1,h.z,20,'#ffd24a');pop(h.x,2,h.z,'PARRY!','#ffd24a');h.ap=Math.min(9,h.ap+1);G.parries++;hs=Math.max(hs,5);h.act='parry';h.t=0}
  else if(res==='dodge'){X.roll();pop(h.x,2,h.z,'DODGE','#9fd3ff');h.act='dodge';h.t=0}
  else{const n=mv.pct?Math.max(1,Math.round(h.hp*mv.pct)):dmgCalc(e,h,mv.m);hitUnit(h,n,{big:mv.hits.length===1});h.act=h.ko?'ko':'hurt';h.t=0}}
 B.react=null;if(last)$('#react').hidden=true;yield 6;return res}
function boomFx(x,z){SFX.boom();shake=10;for(let i=0;i<50;i++){const a=rnd()*TAU,v=rnd()*.14;fx.push({x:x+(rnd()-.5)*2,y:.3,z:z+(rnd()-.5)*4,vx:Math.cos(a)*v,vy:rnd()*.14,vz:Math.sin(a)*v,l:20+rnd()*25,c:pick(['#ffe27a','#ff8a1a','#ff5a1a','#555']),g:.004,f:1})}}
function reactPress(k){const rr=B&&B.react;const btn=k==='dodge'?$('#bDodge'):$('#bParry');btn.classList.add('on');setTimeout(()=>btn.classList.remove('on'),120);if(!rr||rr.press)return;rr.press={k,t:rr.t}}
function* victory(){B.over='win';yield 40;const cm=B.isBoss?1:1+B.ch*.8,xp=Math.round(B.es.reduce((s,e)=>s+(e.d.xp||0),0)*cm*(has('bond')?1.3:1)),yu=Math.round(B.es.reduce((s,e)=>s+(e.d.yuan||0),0)*cm*G.inf*(has('lucky')?2:1));
 G.xp+=xp;G.yuan+=yu;G.battles++;let lv=0;while(G.xp>=xpNeed()){G.xp-=xpNeed();G.lvl++;lv++}
 banner={t:0,dur:150,text:B.isBoss?EB[B.g.boss].fell:'VICTORY',sub:B.isBoss&&EB[B.g.boss].fsub||'',sub2:()=>LZ(`+${xp} XP · +¥${fmtBig(yu)}`+(lv?` · LEVEL UP! LV ${G.lvl}`:''),`經驗 +${xp} · 金圓券 +¥${fmtBig(yu)}`+(lv?` · 升級！LV ${G.lvl}`:'')),col:'#d9a441',size:24};
 X.felled();music('off');for(const h of B.hs){h.act=h.ko?'ko':'cheer';h.emo='happy'}yield 160;
 const g=B.g;if(g.boss)G.boss[g.boss]=1;G.cleared.push(g.id);
 if(g.mimic&&g.charm&&!G.charms.includes(g.charm)){G.charms.push(g.charm);itemBox={d:CHARMS[g.charm],t:0}}
 if(g.boss&&EB[g.boss].item)itemBox={d:IDESC[EB[g.boss].item],t:0};
 G.hp=B.hs.map(h=>h.ko?1:h.hp);save();const fin=g.boss==='printer';endBattle();if(fin)finish()}
function* defeat(){B.over='lose';yield 30;banner={t:0,dur:200,text:'EXPEDITION 48 HAS RETREATED',sub:'FOR THOSE WHO COME AFTER: BRING MORE MONEY',col:'#b3261e',size:20};X.died();music('off');GLC.style.filter='grayscale(.8)';yield 220;
 G.wipes++;G.yuan=Math.round(G.yuan/2);G.hp=null;endBattle();respawn(G.fire,true);pop(PL.x,1.8,PL.z,'YOUR SAVINGS WERE DEVALUED 50%','#a8977c');save()}
function endBattle(){for(const e of B.es)killMesh(e.m);stage.visible=false;$('#react').hidden=true;
 B.hs.forEach(h=>{h.m.root.rotation.set(0,0,0)});B=null;state='play';fadeA=1;spawnWanderers();if(touchUI)$('#touch').hidden=false}

/* ---------------- battle input & menus ---------------- */
function menuItems(u){const lv=B.menu.lv;
 if(lv==='main')return[{l:'ATTACK',s:'+1 AP',f:()=>pickTarget2('enemy',t=>heroAct(u,'attack',null,t))},{l:'SKILLS',s:'',f:()=>{B.menu={lv:'skills'};B.sel=0}},{l:'SHOOT',s:'1 AP · AIM',dis:u.ap<1,f:()=>pickTarget2('enemy',t=>heroAct(u,'shoot',null,t))},{l:'ITEMS',s:'',f:()=>{B.menu={lv:'items'};B.sel=0}}];
 if(lv==='skills')return u.h.skills.filter(s=>s.lv<=G.lvl).map(s=>({l:s.n,s:s.ap+' AP',d:s.d,dis:u.ap<s.ap,f:()=>{if(s.tg==='one')pickTarget2('enemy',t=>heroAct(u,'skill',s,t));else if(s.tg==='ally')pickTarget2(s.id==='press'?'allyOther':'ally',t=>heroAct(u,'skill',s,t));else heroAct(u,'skill',s,null)}}));
 if(lv==='items')return[{l:'RICE WINE',n:G.items.wine,s:'HEAL 50%',dis:!G.items.wine,f:()=>pickTarget2('ally',t=>heroAct(u,'item','wine',t))},{l:'TIGER BALM',n:G.items.balm,s:'REVIVE',dis:!G.items.balm||!B.hs.some(h=>h.ko),f:()=>pickTarget2('dead',t=>heroAct(u,'item','balm',t))},{l:'AID TIN',n:G.items.aid||0,s:'PARTY 35%',dis:!G.items.aid,f:()=>heroAct(u,'item','aid',u)}];
 if(lv==='target')return[];return[]}
function pickTarget2(kind,cb){const u=B.turn;let list=kind==='enemy'?alive(B.es):kind==='dead'?B.hs.filter(h=>h.ko):kind==='allyOther'?alive(B.hs).filter(h=>h!==u):alive(B.hs);if(!list.length)return;B.menu={lv:'target',list,cb,prev:B.menu.lv};B.tsel=0;SFX.tally()}
function menuNav(k){if(!B||!B.menu||B.task)return;const u=B.turn;
 if(B.menu.lv==='target'){const L_=B.menu.list;if(k==='up'||k==='left')B.tsel=(B.tsel+L_.length-1)%L_.length;else if(k==='down'||k==='right')B.tsel=(B.tsel+1)%L_.length;else if(k==='ok'){const cb=B.menu.cb,t=L_[B.tsel];SFX.pick();cb(t)}else if(k==='back'){B.menu={lv:B.menu.prev};B.sel=0}SFX.tally();return}
 const it=menuItems(u);if(k==='up')B.sel=(B.sel+it.length-1)%it.length;else if(k==='down')B.sel=(B.sel+1)%it.length;else if(k==='ok'){const m=it[B.sel];if(m&&!m.dis){SFX.pick();m.f()}else SFX.clang()}else if(k==='back'&&B.menu.lv!=='main'){B.menu={lv:'main'};B.sel=0}SFX.tally()}

/* ---------------- syncing meshes ---------------- */
function heroEmoU(u){if(u.ko)return'dead';if(u.flash>0||u.act==='hurt')return'hurt';if(u.act==='cheer')return'happy';if(u.shout||u.act==='roar'||u.act==='swing')return'shout';if(u.act==='raise'||u.act==='aim'||u.act==='wind'||u.act==='strike')return'grit';if(u.paint)return'scared';if(u.hp<u.max*.25)return'scared';return(T+(u.id*500|0))%200<6?'blink':'determined'}
function poseUnit(u){const c=u.m;if(!c)return;u.t++;if(u.flash>0)u.flash--;
 if(c.mimic){c.root.position.set(u.x,u.ko?-Math.min(.8,u.t/60):.25,u.z);c.root.rotation.y=u.fa;c.lidG.rotation.x=u.act==='strike'||u.act==='wind'?-1:-.3;c.legs.forEach((l,i)=>{l.visible=true;l.rotation.x=u.act==='run'?Math.sin(T*.4+i*3)*.6:0});flash(c,u.flash>0&&T%3<2);return}
 c.root.position.set(u.x,0,u.z);c.root.rotation.y=u.fa;c.root.visible=!(u.side==='e'&&u.ko&&u.t>90);
 const a=u.act,t=u.t,P_={walk:a==='run'?1:0,ph:u.ph};
 if(a==='swing'){P_.aR=lerp(-2.8,.4,t/6);P_.lean=.3}else if(a==='raise'){P_.aR=-2.9;P_.lean=-.15}else if(a==='spin'){P_.aR=-1.5;P_.zR=1.4;c.root.rotation.y=u.fa+t*.6}
 else if(a==='roar'||a==='cheer'){P_.aR=-2.7;P_.aL=-2.7;P_.lean=-.2;if(a==='cheer')c.root.position.y=Math.abs(Math.sin(T*.15))*.25}else if(a==='shout'){P_.aL=-1.6;P_.lean=.1}else if(a==='cast'){P_.aR=-1.8;P_.aL=-1.8}
 else if(a==='aim'||a==='fire'){P_.aR=-1.55;P_.aL=-1.45;if(a==='fire')P_.lean=-.1}else if(a==='wind'){P_.aR=-2.6;P_.lean=-.2}else if(a==='strike'){P_.aR=.3;P_.lean=.35}
 else if(a==='hurt'){P_.lean=-.4;if(t>20)u.act='idle'}else if(a==='dodge'){c.root.position.x-=Math.sin(Math.min(1,t/12)*Math.PI)*(u.side==='h'?.9:-.9);P_.crouch=.15;P_.lean=-.2;if(t>16)u.act='idle'}
 else if(a==='parry'){P_.aR=-1.2;P_.aL=-1.6;P_.lean=.1;if(t>18)u.act='idle'}
 else if(a==='ko'){P_.roll=-Math.min(1,t/20)*Math.PI/2;P_.crouch=.3}
 else if(B&&B.turn===u&&!B.task)P_.aR=-1;
 pose(c,P_);flash(c,u.flash>0&&T%3<2);
 if(u.side==='h')setEmo(c,heroEmoU(u));else setEmo(c,u.ko?'dead':u.act==='wind'||u.act==='strike'?'shout':u.broken?'hurt':u.flash>0?'hurt':u.buff.rect?'smug':'grit');
 if(u.shout&&--u.shout.t<=0)u.shout=null;
 if(u.d&&u.k==='ma'&&u.phase===2&&c.blade)c.blade.material.emissive.setHex(T%6<3?0xff6a1a:0xcc4400)}
const v3=new THREE.Vector3();
let camDrag=false;
function syncExplore(){const p=PL;
 const tx=p.x,ty=1.35,tz=p.z;let dd=camD;const ox=-Math.sin(cy)*Math.cos(cp),oy=Math.sin(cp),oz=-Math.cos(cy)*Math.cos(cp);
 for(let s=.2;s<=camD;s+=.1){const x=tx+ox*s,y=ty+oy*s,z=tz+oz*s,c=cell(x,z);if(c===undefined||isWall(c)&&y<WALLH[c]+.1){dd=Math.max(.6,s-.25);break}}
 camera.position.set(tx+ox*dd,ty+oy*dd,tz+oz*dd);camera.lookAt(tx,ty+.25,tz);
 // party
 const spots=[[p.x,p.z],trail[26]||[p.x-.5,p.z-1],trail[52]||[p.x+.5,p.z-1.8]];
 PMS.forEach((c,i)=>{const[x,z]=spots[i];const o=c._o||(c._o={x,z,fa:0,ph:0});const dx=x-o.x,dz=z-o.z,d=Math.hypot(dx,dz);if(i===0){o.x=x;o.z=z;o.fa=p.fa}else{o.x=x;o.z=z;if(d>.001)o.fa=Math.atan2(dx,dz)}
  const mv=i===0?p.moving:d>.005;o.ph+=mv?(p.sprint?.32:.22):0;c.root.position.set(o.x,0,o.z);c.root.rotation.set(0,o.fa,0);c.root.visible=true;
  pose(c,{walk:mv?1:0,ph:o.ph,aR:i===0&&p.strike>0?lerp(.4,-2.6,p.strike/14):undefined});setEmo(c,i===0&&p.strike>0?'shout':(T+i*70)%200<6?'blink':'determined')});
 for(const w of wanderers){const c=w.m;if(c.mimic){c.root.position.set(w.x,0,w.z);c.root.rotation.y=w.fa;c.root.visible=true;continue}w.ph+=w.moving?.18:0;c.root.position.set(w.x,0,w.z);c.root.rotation.y=w.fa;c.root.visible=true;pose(c,{walk:w.moving?1:0,ph:w.ph,aR:-1.2});
  const dd_=Math.hypot(w.x-p.x,w.z-p.z);setEmo(c,dd_<4?'grit':w.boss?'smug':'normal')}
 commonSync()}
function commonSync(){stoveObjs.forEach((s,i)=>{const lit=G.lit.includes(i);s.fl.visible=lit;s.L.intensity=lit?1.4+Math.sin(T*.3+i)*.2+rnd()*.15:0;if(lit&&T%6===0){s.fl.material.map=tex(flameCv[(T/6|0)%4]);s.fl.material.needsUpdate=true}});
 if(T%6===0)for(const f of flameSpr){f.material.map=tex(flameCv[((T/6|0)+(f.position.x|0))%4]);f.material.needsUpdate=true}
 for(const it of ITEMS)if(itemSpr[it.id]){itemSpr[it.id].visible=!G.taken.includes(it.id);itemSpr[it.id].position.y=.35+Math.sin(T/10+it.x)*.06}
 fogTex.offset.y=(T*.004)%1;waterTex.offset.y=(T*.0015)%1;for(const m of fogMeshes)m.visible=!G.boss[m.userData.A.k];stainSpr.visible=false;
 const fill=(P_,list)=>{let n=0;const c=new THREE.Color();for(const q of list){if(n>=P_.n)break;P_.pos[n*3]=q.x;P_.pos[n*3+1]=q.y;P_.pos[n*3+2]=q.z;c.set(q.c);P_.col[n*3]=c.r;P_.col[n*3+1]=c.g;P_.col[n*3+2]=c.b;n++}P_.g.setDrawRange(0,n);P_.g.attributes.position.needsUpdate=true;P_.g.attributes.color.needsUpdate=true};
 const S_=[],F_=[];for(const q of fx)(q.f?F_:S_).push(q);const zf=ZONES[LV]&&ZONES[LV].fx,cx=B?BX:PL.x,cz=B?BZ:PL.z;
 if(zf==='rain')for(let i=0;i<70;i++){const k=(i*97+T*7)%300;S_.push({x:cx+((i*37)%20-10),y:6-(k%60)/10,z:cz+((i*53)%20-10),c:'#8a9ab0'})}
 else if(zf==='snow')for(let i=0;i<90;i++){const k=(i*131+T)%420;S_.push({x:cx+((i*37)%22-11)+Math.sin(T*.02+i)*.5,y:6-(k%140)/23,z:cz+((i*53)%22-11),c:'#ffffff'})}
 else if(zf==='money'||zf==='notes')for(let i=0;i<(zf==='money'?70:24);i++){const k=(i*71+T*2)%600;S_.push({x:cx+((i*37)%20-10)+Math.sin(T*.03+i)*.4,y:6-(k%200)/33,z:cz+((i*53)%20-10),c:i%3?'#8aa070':'#d9c98a'})}
 else if(zf==='ember')for(let i=0;i<30;i++){const k=(i*61+T*2)%400;F_.push({x:cx+((i*37)%20-10)+Math.sin(T*.02+i)*.6,y:(k%130)/22,z:cz+((i*53)%20-10),c:i%2?'#ff8a1a':'#ffd24a'})}
 if(skyM){if(B)skyM.position.set(BX,14,BZ);else skyM.position.set(13,14,PL.z)}
 fill(PTS.s,S_);fill(PTS.f,F_)}
function syncBattle(){for(const u of B.hs.concat(B.es))poseUnit(u);
 camera.position.lerp(B.cam.p,.07);const l=camera.userData.l||(camera.userData.l=B.cam.l.clone());l.lerp(B.cam.l,.07);const sh=shake>0&&!RM?shake*.006:0;camera.position.x+=(rnd()-.5)*sh;camera.position.y+=(rnd()-.5)*sh;camera.lookAt(l);commonSync()}

/* ---------------- HUD ---------------- */
function proj(x,y,z){v3.set(x,y,z).project(camera);if(v3.z>1)return null;return{sx:(v3.x+1)/2*W,sy:(1-v3.y)/2*H}}
function bar(x,y,w,h,v,max,c,d,dv){r(x-1,y-1,w+2,h+2,'#120d0c');r(x,y,w,h,'#2a1a18');if(dv)r(x,y,w*clamp(dv/max,0,1),h,d);r(x,y,w*clamp(v/max,0,1),h,c);r(x,y,w*clamp(v/max,0,1),1,'rgba(255,255,255,.25)')}
let btns=[];
function button(x,y,w,h,f){btns.push({x,y,w,h,f})}
function faceIcon(fac,x,y,emo='normal',w=20){ctx.drawImage(faceCv(fac,emo),x,y,w,w*.7)}
function hudCommon(){for(const q of pops){const pr=proj(q.x,q.y+q.t*.01,q.z);if(!pr||!q.s)continue;ctx.globalAlpha=q.t<40?1:Math.max(0,1-(q.t-40)/20);txt(q.s,pr.sx,pr.sy,q.c,'center');ctx.globalAlpha=1}
 if(itemBox){const d=itemBox.d,zh=LANG==='zh',lh=zh?13:9,dl=lines(d.d,W-72),fl=lines(d.f,W-72);ctx.globalAlpha=Math.min(1,itemBox.t/10);const h=24+(dl.length+fl.length)*lh+(zh?4:6),y0=H/2-h/2-20;r(30,y0,W-60,h,'rgba(10,6,4,.92)');r(30,y0,W-60,1,'#d9a441');txt(d.n,W/2,y0+6,'#ffd24a','center');
  dl.forEach((l,i)=>txt(l,W/2,y0+19+i*lh,'#e9dcc2','center'));fl.forEach((l,i)=>txt(l,W/2,y0+23+(dl.length+i)*lh,'#a8977c','center'));ctx.globalAlpha=1}
 if(banner&&!(banner.delay>banner.t)){const k=banner.t,a=k<16?k/16:k>banner.dur-30?Math.max(0,(banner.dur-k)/30):1;if(banner.small){ctx.globalAlpha=a*.75;r(0,26,W,22,'#000');ctx.globalAlpha=1;stxt(banner.text,W/2,37,banner.col,banner.size,a)}else{ctx.globalAlpha=a*.7;r(0,H/2-26,W,banner.sub2?62:48,'#000');ctx.globalAlpha=1;stxt(banner.text,W/2,H/2-4,banner.col,banner.size||24,a);const sb=typeof banner.sub==='function'?banner.sub():banner.sub,s2=typeof banner.sub2==='function'?banner.sub2():banner.sub2;let yy=H/2+15;if(sb){stxt(sb,W/2,yy,'#a8977c',9,a);yy+=LANG==='zh'?14:11}if(s2)stxt(s2,W/2,yy,'#d9a441',9,a)}}}
function hudExplore(){const p=PL;
 HEROES.forEach((h,i)=>{const mx=heroStat(h,'hp'),hp=G.hp?Math.max(0,G.hp[i]):mx;faceIcon(h.fac,8,8+i*16,'normal',18);bar(30,13+i*16,60,3,hp,mx,'#b3261e')});
 const zh=LANG==='zh',lh=zh?12:10;txt('LV '+G.lvl,8,58,'#e9dcc2');txt('¥ '+fmtBig(G.yuan),8,58+lh,'#d9a441');txt(LZ('WINE '+G.items.wine+' · BALM '+G.items.balm+' · AID '+(G.items.aid||0),'米酒 '+G.items.wine+' · 萬金油 '+G.items.balm+' · 罐頭 '+(G.items.aid||0)),8,58+lh*2,'#a8977c');txt(LZ('CHAPTER '+ROMAN[LV<0?0:LV]+' / VI','第'+ZNUM[LV<0?0:LV]+'章／共六章'),8,58+lh*3,'#6e6050');
 const tu=$('#tU');if(near&&!reading){if(touchUI){const lb=tr(near.label);if(tu.hidden||tu.textContent!==lb){tu.textContent=lb;tu.hidden=false}}else txt('E  '+tr(near.label),W/2,H-58,'#ffd24a','center')}else if(!tu.hidden)tu.hidden=true;
 if(!touchUI){const w=wanderers.find(w=>Math.hypot(w.x-p.x,w.z-p.z)<3);if(w&&!w.boss)txt('J  '+tr('AMBUSH!'),W/2,H-44,'#ff8a3a','center')}
 if(reading){const m=reading.m,s=tr(Array.isArray(m.t)?m.t[touchUI?1:0]:m.t),ls=lines(zh?'「'+s+'」':'"'+s+'"',W-96),h=ls.length*lh+22;r(40,16,W-80,h,'rgba(10,6,4,.88)');r(40,16,W-80,1,'#ff9a3a');ls.forEach((l,i)=>txt(l,W/2,24+i*lh,'#ffc07a','center'));const ex=40+(m.z|0)%8;txt(LZ('LEFT BY EXPEDITION '+ex,'第'+ex+'遠征隊 留'),W/2,24+ls.length*lh+2,'#6e6050','center')}
 if(areaB&&!banner&&!reading&&!itemBox){const k=areaB.t,a=k<30?k/30:k>150?Math.max(0,(190-k)/40):1;stxt(areaB.z.name,W/2,62,'#e9dcc2',17,a);ctx.globalAlpha=a*.6;r(W/2-110,74,220,1,'#e9dcc2');ctx.globalAlpha=1;stxt(areaB.z.han,W/2,86,'#a8977c',11,a)}
 if(!touchUI&&!document.pointerLockElement&&T%90<60)txt('CLICK TO CAPTURE MOUSE',W-8,H-12,'#6e6050','right')}
function hudBattle(){
 // turn order
 const ord=turnOrder(7);ord.forEach((u,i)=>{const x=8+i*24,y=8;r(x-1,y-1,22,17,u.side==='h'?'#2f4f8a':'#8a1c14');faceIcon(u.side==='h'?u.h.fac:(u.fac2||u.d.fac||'ccp'),x,y,i===0?'grit':'normal',20)});txt('TURN ORDER',8,27,'#6e6050');
 // party panels
 B.hs.forEach((u,i)=>{const x=6,y=H-52+i*16,act=B.turn===u;r(x,y,128,15,act?'rgba(217,164,65,.25)':'rgba(10,6,4,.7)');faceIcon(u.h.fac,x+2,y+1,u.ko?'dead':'normal',18);txt(u.h.short,x+22,y+1,u.ko?'#6e6050':'#e9dcc2');
  bar(x+22,y+10,60,3,u.hp,u.max,'#b3261e');txt(String(u.hp),x+86,y+7,'#a8977c');for(let k=0;k<9;k++)r(x+104+(k%5)*5,y+2+(k/5|0)*5,4,4,k<u.ap?'#ffd24a':'#3a2e26');
  if(u.infl)txt('¥'+u.infl,x+132,y+3,'#d9a441');if(u.paint)txt('48:'+u.paint,x+132,y+3,'#e9dcc2');if(u.buff.rage)r(x+124,y+12,4,2,'#ff6a5a')});
 // enemy bars
 for(const e of B.es){if(e.ko)continue;const pr=proj(e.x,1.65*e.s+.15,e.z);if(!pr)continue;const w=e.d.boss?70:34;bar(pr.sx-w/2,pr.sy,w,3,e.hp,e.max,'#c8372d');bar(pr.sx-w/2,pr.sy+5,w,2,e.brk,e.brkMax,e.broken?'#ffd24a':'#d9a441');
  if(e.d.boss)txt(e.name,pr.sx,pr.sy-10,'#e9dcc2','center');if(e.buff.mark)txt('MARK',pr.sx+w/2+3,pr.sy-1,'#ff8a3a');if(e.broken)txt('BROKEN',pr.sx,pr.sy-10,'#ffd24a','center')}
 for(const u of B.hs.concat(B.es))if(u.shout&&!u.ko){const pr=proj(u.x,1.7*u.s+.4,u.z);if(pr)drawShout(u.shout.s,pr.sx,pr.sy,u.side==='h')}
 for(const h of B.hs)if(h.paint&&!h.ko){const pr=proj(h.x,2.2,h.z);if(pr){stxt('48',pr.sx,pr.sy,'#e9dcc2',16);txt(LZ(h.paint+' TURNS','剩 '+h.paint+' 回合'),pr.sx,pr.sy+8,'#a8977c','center')}}
 if(B.log){B.log.t++;if(B.log.t<90&&!banner){ctx.globalAlpha=.75;r(W/2-90,30,180,15,'#000');ctx.globalAlpha=1;txt(B.log.n,W/2,33,'#ff8a3a','center')}}
 // reaction ring
 const rr=B.react;if(rr){for(const h of rr.tgs){if(h.ko)continue;const pr=proj(h.x,1,h.z);if(!pr)continue;const k=Math.max(0,(rr.lead-rr.t)/rr.lead),rad=8+k*40;ctx.strokeStyle=k<.18?'#ffd24a':'rgba(255,106,90,.85)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(pr.sx,pr.sy,rad,0,TAU);ctx.stroke();ctx.strokeStyle='rgba(233,220,194,.6)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(pr.sx,pr.sy,8,0,TAU);ctx.stroke();if(rr.aoe)break}
  if(G.battles<3)txt(touchUI?'DODGE AS THE RING CLOSES · PARRY IS TIGHTER':'SPACE DODGE · SHIFT PARRY — WHEN THE RING CLOSES',touchUI?W/2-60:W/2,H-66,'#e9dcc2','center')}
 // qte
 const q=B.qte;if(q){const pr=proj(q.u.x,1*q.u.s,q.u.z);if(pr){const k=Math.max(0,(q.dur-q.t)/q.dur),rad=10+k*44;ctx.strokeStyle='#ffd24a';ctx.lineWidth=3;ctx.beginPath();ctx.arc(pr.sx,pr.sy,10,0,TAU);ctx.stroke();ctx.strokeStyle='rgba(255,255,255,.8)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(pr.sx,pr.sy,rad,0,TAU);ctx.stroke();txt(touchUI?'TAP!':'J!',pr.sx,pr.sy-rad-12,'#ffd24a','center')}}
 // free aim
 const am=B.aim;if(am){const t=am.u,wp=proj(t.x,(t.m.mimic?.5:1.05)*t.s,t.z),c=proj(t.x,1*t.s,t.z);if(wp&&c){const cx=c.sx+Math.sin(am.t*.09)*44*Math.min(1.6,t.s),cy_=c.sy+Math.cos(am.t*.13)*16;
   ctx.globalAlpha=.6+Math.sin(T*.3)*.3;r(wp.sx-3,wp.sy-3,6,6,'#ffd24a');ctx.globalAlpha=1;ctx.strokeStyle='#ffd24a';ctx.lineWidth=1;ctx.strokeRect(wp.sx-6,wp.sy-6,12,12);
   r(cx-8,cy_,6,1,'#fff');r(cx+3,cy_,6,1,'#fff');r(cx,cy_-8,1,6,'#fff');r(cx,cy_+3,1,6,'#fff');am.cx=cx;am.cy=cy_;am.wx=wp.sx;am.wy=wp.sy;txt(touchUI?'TAP TO FIRE ON THE WALLET':'J TO FIRE · AIM FOR THE GLOWING WALLET',W/2,H-66,'#e9dcc2','center')}}
 // menu
 const u=B.turn;btns=[];
 if(B.menu&&!B.task&&u&&u.side==='h'){
  if(B.menu.lv==='target'){const t=B.menu.list[B.tsel];const pr=proj(t.x,(t.side==='h'?2:1.9*t.s)+.2,t.z);if(pr){const b=Math.sin(T*.2)*2;r(pr.sx-4,pr.sy-10+b,9,3,'#ffd24a');r(pr.sx-2,pr.sy-7+b,5,3,'#ffd24a');r(pr.sx,pr.sy-4+b,1,2,'#ffd24a');txt(t.name,clamp(pr.sx,60,W-60),pr.sy-22,'#ffd24a','center')}
   B.menu.list.forEach((t2,i)=>{const p2=proj(t2.x,1*t2.s,t2.z);if(p2)button(p2.sx-16,p2.sy-26*t2.s,32,40*t2.s,()=>{if(B.tsel===i){menuNav('ok')}else{B.tsel=i;menuNav('ok')}})});
   txt(touchUI?'TAP A TARGET':'A/D CHOOSE · J CONFIRM · K BACK',W-8,H-12,'#a8977c','right');const bh=touchUI?20:14,bx=W-64,by=H-24-bh;r(bx,by,56,bh,'rgba(10,6,4,.85)');r(bx,by,56,1,'#a8977c');txt('BACK',bx+28,by+bh/2-4,'#e9dcc2','center');button(bx,by,56,bh,()=>menuNav('back'));return}
  const it=menuItems(u),zh=LANG==='zh',rh=touchUI?17:14,w=zh?160:150,x=W-w-8,y0=H-8-it.length*rh;txt(tr(u.h.name)+(B.menu.lv==='main'?'':' · '+tr(B.menu.lv.toUpperCase())),x,y0-12,'#ffd24a');
  it.forEach((m,i)=>{const y=y0+i*rh,sel=i===B.sel;r(x,y,w,rh-1,sel?'rgba(217,164,65,.35)':'rgba(10,6,4,.78)');const ty=y+(rh-1)/2-4;txt((sel?'▶ ':'  ')+tr(m.l)+(m.n!=null?' ×'+m.n:''),x+3,ty,m.dis?'#6e6050':'#e9dcc2');txt(tr(m.s||''),x+w-3,ty,m.dis?'#6e6050':'#d9a441','right');button(x,y,w,rh-1,()=>{if(B.sel===i)menuNav('ok');else{B.sel=i;menuNav('ok')}})});
  const cur=it[B.sel],lh=zh?13:10;let dh=0;if(cur&&cur.d){const ls=lines(cur.d,w-8);dh=ls.length*lh+6;const dy=y0-16-dh;r(x,dy,w,dh,'rgba(10,6,4,.85)');ls.forEach((l,i)=>txt(l,x+4,dy+3+i*lh,'#e9dcc2'))}
  if(B.menu.lv!=='main'){const bh=touchUI?18:12,by=y0-16-(dh?dh+4:0)-bh;r(x+w-48,by,48,bh,'rgba(10,6,4,.85)');r(x+w-48,by,48,1,'#a8977c');txt('BACK',x+w-24,by+bh/2-4,'#e9dcc2','center');button(x+w-48,by,48,bh,()=>menuNav('back'))}}}
function render(){
 if(state==='scene'&&scene){scene.complete=soulScene(scene.sc,scene.t);return}
 if(state==='title'){attract();return}
 if(!PL||!G||state==='end')return;
 if(!glOK){ctx.fillStyle='#120d0c';ctx.fillRect(0,0,W,H);txt('THIS BROWSER BLOCKED 3D GRAPHICS',W/2,96,'#ff6a5a','center');return}
 if(B)syncBattle();else syncExplore();renderer.render(S3,camera);ctx.clearRect(0,0,W,H);ctx.drawImage(VIG,0,0);
 btns=[];if(B)hudBattle();else hudExplore();hudCommon();
 if(fadeA>0){ctx.globalAlpha=fadeA;r(0,0,W,H,'#000');ctx.globalAlpha=1}
 if(state==='pause'){r(0,0,W,H,'rgba(0,0,0,.6)');stxt('PAUSED',W/2,H/2-8,'#e9dcc2',24);txt(touchUI?'TAP II TO RESUME':'P / ESC TO RESUME',W/2,H/2+12,'#a8977c','center');if(!touchUI)txt('L LANGUAGE · M SOUND',W/2,H/2+28,'#6e6050','center')}}

/* ---------------- update ---------------- */
function update(){T++;G.time++;
 if(fadeA>0)fadeA=Math.max(0,fadeA-.03);if(shake>0)shake*=.85;if(shake<.5)shake=0;
 if(reading){reading.t++;if(reading.t>20&&(pressed.use||pressed.atk||PL.moving))reading=null}
 if(itemBox){itemBox.t++;if(itemBox.t>40&&(pressed.use||pressed.atk||pressed.ok)||itemBox.t>260)itemBox=null}
 if(banner&&++banner.t>banner.dur+(banner.delay||0))banner=null;if(areaB&&!banner&&++areaB.t>190)areaB=null;
 for(const q of fx){q.x+=q.vx;q.y+=q.vy;q.z+=q.vz;q.vy-=q.g;q.l--;if(q.y<.02&&q.g>0){q.y=.02;q.vx*=.5;q.vz*=.5;q.vy=0}}fx=fx.filter(q=>q.l>0);if(fx.length>1100)fx.splice(0,fx.length-1100);
 for(const q of pops)q.t++;pops=pops.filter(q=>q.t<60);
 if(state==='battle'&&B){if(hs>0){hs--}else{B.t++;stepTask();if(B){
   if(B.qte&&(pressed.ok||pressed.atk))qtePress();
   if(B.aim&&(pressed.ok||pressed.atk)&&B.aim.cx!=null){const d=Math.hypot(B.aim.cx-B.aim.wx,B.aim.cy-B.aim.wy);B.aim.res=d<8?'WEAK':'MISS'}
   if(B.react){if(pressed.dodge)reactPress('dodge');if(pressed.parry)reactPress('parry')}
   if(B.menu&&!B.task){for(const k of['up','down','left','right','ok','back'])if(pressed[k])menuNav(k)}}}}
 else if(state==='play')updExplore();
 for(const k in pressed)delete pressed[k]}

/* ---------------- scenes & flow ---------------- */
function playScene(sc,done){scene={sc,t:0,done};state='scene';$('#touch').hidden=true;$('#react').hidden=true;if(document.pointerLockElement)document.exitPointerLock()}
function soulScene(sc,t){ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);if(sc.credits)return drawCredits(t);const zh=LANG==='zh';
 ctx.save();ctx.beginPath();ctx.rect(0,0,W,136);ctx.clip();if(RART[sc.draw])RART[sc.draw](t);else sceneArt(sc.draw,t);ctx.restore();ctx.drawImage(VIG,0,0);
 const ti=ZK(sc,'title');if(ti){r(0,0,W,20,'rgba(8,6,5,.72)');stxt(ti,W/2,10,'#ffd24a',13)}
 r(0,136,W,H-136,'#120d0c');r(0,136,W,2,'#d9a441');txt(ZK(sc,'date'),8,140,'#d9a441');txt(ZK(sc,'place'),W-8,140,'#a8977c','right');
 const shown=Math.floor(t*(zh?.7:1.4)),fz=ZK(sc,'fact'),jz=ZK(sc,'joke');let n=0,fl,jl,lh=10,y0=152;
 if(zh){let sz=12;lh=15;for(;;){ctx.font=ZF(sz);fl=wrapPx(fz,W-16);jl=wrapPx(jz,W-16);if((fl.length+jl.length)*lh+2<=H-151||sz<=10)break;sz--;lh--}}
 else{ctx.font=F;fl=wrap(fz,46);jl=wrap(jz,46);const nl=fl.length+jl.length;lh=nl<=6?10:nl===7?9:8;y0=150}
 ctx.textAlign='left';ctx.textBaseline='top';
 const line=(l,y,c)=>{const v=[...l].slice(0,Math.max(0,shown-n)).join('');n+=[...l].length+1;ctx.fillStyle=c;ctx.fillText(v,8,y)};
 fl.forEach((l,i)=>line(l,y0+i*lh,'#e9dcc2'));jl.forEach((l,i)=>line(l,y0+2+fl.length*lh+i*lh,'#ff9a6a'));
 if(shown>n+10&&T%40<26)txt('▶',W-16,H-12,'#d9a441');return shown>n}
function drawCredits(t){const zh=LANG==='zh',C=zh?CREDITS_ZH:CREDITS_EN,sp=zh?30:26,stop=96-(C.length-1)*sp,y0=Math.max(H+8-t*.5,stop);
 for(let i=0;i<70;i++)r((i*53)%W,(i*37+t*.2)%H,1,1,i%3?'#3a3040':'#6e6050');
 C.forEach((c,i)=>{const y=y0+i*sp;if(y<-20||y>H+20)return;if(c.length===1){stxt(c[0],W/2,y,'#ffd24a',zh?18:15)}else{txt(c[0],W/2,y-8,'#a8977c','center');txt(c[1],W/2,y+(zh?6:4),'#e9dcc2','center')}});
 const done=y0<=stop;if(done&&T%40<26)txt('▶',W-16,H-12,'#d9a441');return done}
const SC_INTRO=[{draw:'bankrun',title:'THE GOLD YUAN',date:'AUGUST 1948',place:'SHANGHAI',fact:'To stop runaway inflation, the Nationalist government replaces the old currency with the Gold Yuan, three million to one, and orders citizens to hand in their gold.',joke:'Every year the Printer paints a bigger number on the banknote. Those whose savings are worth less than the number are erased.',
  zh:{title:'金圓券',date:'1948年8月',place:'上海',fact:'為了遏止失控的通貨膨脹，國民政府發行金圓券，三百萬元法幣換一元，並命令民眾把黃金交出來。',joke:'每一年，印鈔機都會在鈔票上畫一個更大的數字。積蓄比那個數字還不值錢的人，就會被抹除。'}},
 {draw:'camp48',title:'EXPEDITION 48',date:'AUGUST 1948',place:'THE BUND, SHANGHAI',fact:'Expedition 48 is the government\'s forty-eighth attempt to reach the Printer and stop it. Nobody remembers what happened to the first forty-seven.',joke:'One conscript, one propaganda officer with a megaphone, one accountant. Funded by government bonds. Nobody bought the bonds.',
  zh:{title:'第四十八遠征隊',date:'1948年8月',place:'上海外灘',fact:'第四十八遠征隊，是政府第四十八次派人去找印鈔機、讓它停下來。前面四十七隊後來怎麼了，沒有人記得。',joke:'一個壯丁、一個拿大聲公的宣傳員、一個會計。經費來自政府公債。公債沒有人買。'}}];
const CH_SC=[null,
 {draw:'paddy',title:'CHAPTER II',date:'OCTOBER 1948',place:'CH. II · THE COUNTRYSIDE',fact:'The Hoarder King is in jail and Shanghai prices are frozen by decree. The rice simply leaves Shanghai. The Expedition follows the Printer\'s trail inland, toward the war.',joke:'The villagers have been liberated twice this year and conscripted three times. They greet the Expedition with pitchforks, out of habit.',
  zh:{title:'第二章',date:'1948年10月',place:'第二章 · 鄉下',fact:'囤積大王進了監獄，上海物價也被一紙命令凍結了。於是米就自己離開了上海。遠征隊循著印鈔機的足跡往內陸走，走向戰場。',joke:'村民們今年被解放了兩次，被抓壯丁三次。他們拿著草叉迎接遠征隊，純粹是習慣了。'}},
 {draw:'wreck',title:'CHAPTER III',date:'NOVEMBER 1948',place:'CH. III · THE RIVER',fact:'The price freeze collapses. In a single week the cost of living in Shanghai multiplies many times over. The bridge ahead was supposed to be blown up to slow the enemy.',joke:'The demolition budget was paid in Gold Yuan. It bought half a stick of dynamite. The Iron General holds the bridge and shoots anyone crossing it in either direction, for fairness.',
  zh:{title:'第三章',date:'1948年11月',place:'第三章 · 河邊',fact:'限價政策崩潰。短短一週，上海的生活費翻了好幾倍。前面那座橋，本來應該要炸掉來拖延敵軍的。',joke:'炸橋預算是用金圓券付的，只買到半根炸藥。鐵將軍把守著橋，不管往哪個方向過橋的人他都開槍，以示公平。'}},
 {draw:'mint',title:'CHAPTER IV',date:'DECEMBER 1948',place:'CH. IV · THE CENTRAL MINT',fact:'The presses run day and night. Banknotes are printed abroad and flown in by the planeload, because the Mint cannot keep up with the Mint.',joke:'It now costs more to print a note than the note is worth. The presses run faster to make up the difference.',
  zh:{title:'第四章',date:'1948年12月',place:'第四章 · 中央印製廠',fact:'印鈔機日夜不停。鈔票還要委託國外印好，一架一架飛機運進來，因為印鈔廠的速度跟不上印鈔廠。',joke:'現在印一張鈔票的成本，已經比鈔票本身還值錢。為了把差額補回來，印鈔機只好印得更快。'}},
 {draw:'snow',title:'CHAPTER V',date:'JANUARY 1949',place:'CH. V · HUAIHAI',fact:'On the frozen plains of Huaihai the Nationalist armies are encircled and destroyed. Whole divisions surrender, and several change sides without changing trenches.',joke:'The Expedition arrives just in time to be too late. Colonel Lu holds the last trench, and both sides believe he is theirs.',
  zh:{title:'第五章',date:'1949年1月',place:'第五章 · 淮海',fact:'在結冰的淮海平原上，國軍主力被包圍殲滅。整師整師地投降，還有好幾個師連戰壕都沒換就換了邊。',joke:'遠征隊準時抵達，剛好來不及。盧上校守著最後一條戰壕，兩邊都相信他是自己人。'}},
 {draw:'boats',title:'CHAPTER VI',date:'1949',place:'CH. VI · THE LAST PIER',fact:'The government moves south, then further south. The gold reserves of the central bank are quietly shipped across the strait, in crates marked "documents".',joke:'The Printer has retreated to the Customs House on the last pier. Of course it has. Everyone is at the pier.',
  zh:{title:'第六章',date:'1949年',place:'第六章 · 最後的碼頭',fact:'政府往南搬，再往更南邊搬。中央銀行的黃金儲備，裝在標著「文件」的木箱裡，悄悄運過了海峽。',joke:'印鈔機撤退到最後一個碼頭的海關大樓裡。那當然。大家都在碼頭。'}}];
const SC_END=[{draw:'goldship',title:'THE PRINTER IS BROKEN',date:'DECEMBER 1949',place:'THE LAST PIER',fact:'The Printer lies broken. The number stops growing. Expedition 48 has saved the currency. Then the front line arrives, right on schedule.',joke:'Expedition 48 boards the boat anyway. The gold reserves left months ago, first class. Gold Yuan not accepted as fare. It is accepted as ballast.',
  zh:{title:'印鈔機停擺了',date:'1949年12月',place:'最後的碼頭',fact:'印鈔機倒下了，數字不再變大。第四十八遠征隊拯救了貨幣。然後，前線準時抵達。',joke:'遠征隊還是上了船。黃金儲備好幾個月前就走了，坐頭等艙。船票不收金圓券，但金圓券可以拿來壓艙。'}},
 {draw:'island',title:'TEMPORARY RELOCATION',date:'DECEMBER 1949',place:'TAIWAN',fact:'The Nationalist government retreats to Taiwan. Officially, this is a temporary relocation.',joke:'Very temporary. Lao Wang does not unpack. Little Blue announces a glorious strategic victory over the sea.',
  zh:{title:'暫時撤退',date:'1949年12月',place:'台灣',fact:'國民政府撤退到台灣。官方說法：這只是暫時轉進。',joke:'非常暫時。老王連行李都沒拆。小藍用大聲公宣布：我軍在海上取得光榮的戰略勝利。'}},
 {draw:'nextyear',title:'NEXT YEAR',date:'1950 · 1951 · 1952 · ...',place:'STILL TAIWAN',fact:'"We will counterattack the mainland next year," everyone agrees. Next year, they agree again. And the year after that.',joke:'Accountant Qian frames the last Gold Yuan note. It is the only investment of the expedition that never lost value. It started at zero.',
  zh:{title:'明年',date:'1950、1951、1952……',place:'還在台灣',fact:'「明年就反攻大陸！」大家都同意。到了明年，大家又同意了一次。後年也是。',joke:'會計老錢把最後一張金圓券裱框掛起來。這是遠征隊唯一一筆從來沒有貶值的投資，因為它一開始就是零。'}},
 {credits:1}];
const CREDITS_EN=[['MING AN: EXPEDITION 48'],['EXPEDITION 48','A conscript, a megaphone, an accountant'],['EXPEDITIONS 1–47','Whereabouts unknown'],['FUNDING','Government bonds (unsold)'],['CURRENCY','Gold Yuan (decorative)'],['VILLAIN','The Printer (retired)'],['GOLD RESERVES','Left first, in "documents"'],['FARE TO TAIWAN','Not payable in Gold Yuan'],['NEUTRAL OBSERVER','A donkey'],['FINANCIAL ADVICE','A seagull'],['COUNTERATTACK','Scheduled for next year'],['THANK YOU FOR PLAYING','See you on the mainland. Next year.']];
const CREDITS_ZH=[['明暗：第四十八遠征隊'],['第四十八遠征隊','一個壯丁、一支大聲公、一位會計'],['第一至四十七遠征隊','下落不明'],['經費來源','政府公債（滯銷）'],['貨幣','金圓券（僅供裝飾）'],['反派','印鈔機（已退休）'],['黃金儲備','最先撤離，裝在「文件」箱裡'],['去台灣的船票','不收金圓券'],['中立觀察員','一頭驢子'],['理財顧問','一隻海鷗'],['反攻大陸','預定明年'],['感謝遊玩','大陸見。明年。']];
/* custom scene art for this game (falls back to the shared sceneArt) */
const RART={
 camp48(t){const fl=(t>>2)%3;const g=ctx.createLinearGradient(0,0,0,136);g.addColorStop(0,'#0b0e20');g.addColorStop(1,'#2a2440');ctx.fillStyle=g;ctx.fillRect(0,0,W,136);
  r(0,110,W,26,'#3a2e26');ctx.globalAlpha=.25;r(130,60,124,76,'#ff8a3a');ctx.globalAlpha=1;r(184,104,16,6,'#5a3a20');r(186,92-fl,6,12+fl,'#ff8a1a');r(192,94+fl,5,10-fl,'#ffd24a');
  drawSoldier(116,118,{fac:'kmt',face:1,pose:'sit',emo:'happy',gun:null});drawSoldier(240,118,{fac:'kmt',face:-1,pose:'sit',emo:(t>>5)%2?'shout':'happy',gun:null});
  drawCivilian(150,124,{face:1,hat:'fedora',cl:'#5a4a3a',cl2:'#3a2e24',emo:'scared',pose:'idle'});
  r(28,40,96,40,'#e9dcc2');r(28,40,96,7,'#2f4f8a');txt('GOV. BOND',33,49,'#120d0c');txt('¥ 1,000,000',33,59,'#120d0c');txt('UNSOLD',40,69,'#b3261e')},
 mint(t){const g=ctx.createLinearGradient(0,0,0,136);g.addColorStop(0,'#0a100a');g.addColorStop(1,'#1e2a1e');ctx.fillStyle=g;ctx.fillRect(0,0,W,136);r(0,112,W,24,'#2e3230');
  for(let i=0;i<4;i++){const x=20+i*92,j=(t>>2)%2;r(x,60,64,52,'#3a403a');r(x+4,64,56,10,'#1a1e1a');r(x+8,74+j,48,4,'#8a8a90');r(x+56,40,6,24,'#5a5a62');for(let k=0;k<3;k++)r(x+10+k*16,96,12,16,'#8aa070')}
  for(let i=0;i<30;i++){const x=(i*47+t*1.3)%W,y=(i*29+t*.8)%110;r(x,y,8,4,i%3?'#8aa070':'#d9c98a');r(x+1,y+1,6,1,'#5a6a3a')}
  r(86,24,212,32,'#120d0c');txt('COST TO PRINT ONE NOTE',192,27,'#a8977c','center');const cst='¥ '+fmtBig(1e5*Math.pow(1.03,t));txt(LZ(cst+'  >  FACE VALUE ¥ 100,000',cst+' ＞ 面額 ¥100,000'),192,41,'#ff6a5a','center')},
 nextyear(t){const g=ctx.createLinearGradient(0,0,0,136);g.addColorStop(0,'#3a6a9a');g.addColorStop(.7,'#f0b070');g.addColorStop(1,'#d07040');ctx.fillStyle=g;ctx.fillRect(0,0,W,136);
  r(250,58,20,20,'#ffe2a0');r(0,86,W,24,'#2a4a70');for(let i=0;i<18;i++)r((i*41+t*.4)%W,90+(i%4)*5,10,1,'#6a9ac0');r(0,108,W,28,'#d8c090');
  r(40,50,4,60,'#6a4a2a');for(let i=0;i<5;i++)seg(42,50,42+Math.cos(i*1.2+.4)*22,50+Math.sin(i*1.2+.4)*10+6,3,'#3a6a2a');
  const yr=1950+Math.min(40,Math.floor(t/45));r(70,40,64,58,'#e9dcc2');r(70,40,64,10,'#b3261e');txt(String(yr),102,42,'#e9dcc2','center');txt('COUNTER-',102,58,'#120d0c','center');txt('ATTACK:',102,68,'#120d0c','center');txt('NEXT YEAR',102,82,'#b3261e','center');
  drawSoldier(170,122,{fac:'kmt',face:-1,pose:'sit',emo:'happy',gun:null,item:'case'});drawSoldier(210,122,{fac:'kmt',face:1,pose:'sit',emo:(t>>5)%2?'shout':'determined',gun:null});drawCivilian(250,126,{face:1,hat:'fedora',cl:'#5a4a3a',cl2:'#3a2e24',emo:'sleep',pose:'idle'});
  r(300,96,40,10,'#e9dcc2');txt('¥0',320,98,'#b3261e','center');if(t>60)stxt(LZ('反攻大陸 · NEXT YEAR (EVERY YEAR)','反攻大陸：明年（每年都是明年）'),W/2,30,'#ffe2a0',9,Math.min(1,(t-60)/40))},
 goldship(t){const g=ctx.createLinearGradient(0,0,0,136);g.addColorStop(0,'#05060f');g.addColorStop(1,'#26203a');ctx.fillStyle=g;ctx.fillRect(0,0,W,136);
  for(let i=0;i<24;i++)r((i*53)%W,(i*29)%60,1,1,'#e9dcc2');r(0,104,W,32,'#1a2440');for(let i=0;i<16;i++)r((i*29+t*.5)%W,108+(i%5)*5,12,1,'#3a4a70');
  r(0,98,150,8,'#4a3220');for(let x=6;x<150;x+=24)r(x,106,4,30,'#3a2618');
  const bob=Math.round(Math.sin(t/30)*1.5);r(190,82+bob,190,22,'#2a2a30');r(196,74+bob,170,8,'#3a3a44');r(300,46+bob,40,28,'#4a4a52');r(312,30+bob,10,16,'#2a2a30');
  for(let i=0;i<5;i++){r(206+i*18,62+bob,15,12,'#c8a040');r(206+i*18,62+bob,15,2,'#ffe27a');txt('金',209+i*18,64+bob,'#5a3a10')}
  r(200,85+bob,100,12,'#e9dcc2');txt('GOLD: ALREADY GONE',203,87+bob,'#120d0c');
  seg(150,100,196,84+bob,2,'#7a5230');
  const q=t*.25;for(let i=0;i<3;i++){const x=Math.min(150-i*24,20+q-i*24);if(i===2)drawCivilian(x,98,{face:1,pose:'run',anim:t*.3,hat:'fedora',cl:'#5a4a3a',cl2:'#3a2e24',emo:'scared'});
   else drawSoldier(x,98,{fac:'kmt',face:1,pose:'run',anim:t*.3+i*4,emo:i?'shout':'scared',gun:null,item:i?null:'case'})}
  for(let i=0;i<12;i++){const x=(i*31+t*.7)%170,y=(i*17+t*.6)%120;r(x,y,6,3,'#b0a070')}
  r(20,26,140,16,'#120d0c');txt(LZ('FARE: ¥ ','船票：¥ ')+fmtBig(5e6*Math.pow(1.2,t/8)),24,30,'#ff6a5a')}};
let built=false;
function newGame(cont){initAudio();ambient();$('#title').hidden=true;$('#end').hidden=true;$('#hud').hidden=false;$('#bPause').hidden=false;
 if(!built){initGL();if(glOK){buildWorldR();buildStage();mkPlayerModels()}built=true}
 const sv=cont&&store.get(SAVEK,null);G=sv||newProgress();ending=false;B=null;
 const go=()=>{respawn(G.fire,true);if(!G.seen.includes(LV)){G.seen.push(LV);areaB={t:0,z:ZONES[LV]}}};
 if(sv)go();else playScene(SC_INTRO[0],()=>playScene(SC_INTRO[1],go))}
function finish(){if(ending)return;ending=true;music('ending');G.done=1;save();
 const chain=i=>i<SC_END.length?playScene(SC_END[i],()=>chain(i+1)):showEnd();chain(0)}
function showEnd(){state='end';ctx.fillStyle='#070505';ctx.fillRect(0,0,W,H);$('#hud').hidden=false;$('#bPause').hidden=true;$('#touch').hidden=true;$('#end').hidden=false;fillEnd();setTimeout(()=>{$('#e1').focus({preventScroll:true});$('#end').scrollTop=0},50)}
function fillEnd(){if(!G)return;const zh=LANG==='zh',pr=fmtBig((G.inf-1)*100),tm=G.time/60|0;
 $('#endP').textContent=zh?'第四十八遠征隊打倒了囤積大王、政委、鐵將軍、司庫、一位兩邊都效忠的上校，還有印鈔機本尊，結果還是輸了這場戰爭。遠征期間物價照樣漲了 '+pr+'%。撤退到台灣是暫時的，非常暫時。反攻大陸預定明年，永遠都是明年。'
  :'Expedition 48 beat a hoarder, a commissar, a general, a treasurer, a colonel of both sides and the Printer itself, and still lost the war. Prices rose '+pr+'% during the expedition anyway. The relocation to Taiwan is temporary. Very temporary. The counterattack on the mainland is scheduled for next year. It always will be.';
 const rows=zh?[['遊玩時間',(tm/60|0)+' 分 '+tm%60+' 秒'],['戰鬥',G.battles+' 場'],['完美格擋',G.parries+' 次'],['全隊轉進',G.wipes+' 次'],['等級','LV '+G.lvl],['金圓券','¥ '+fmtBig(G.yuan)+'（現在拿來壓艙）'],['章節','6／6'],['頭目','6／6'],['打贏的內戰','0／1'],['反攻大陸','明年']]
  :[['Time',(tm/60|0)+'m '+tm%60+'s'],['Battles',G.battles],['Perfect parries',G.parries],['Party retreats',G.wipes],['Level','LV '+G.lvl],['Gold Yuan','¥ '+fmtBig(G.yuan)+' (now boat ballast)'],['Chapters','6 / 6'],['Bosses','6 / 6'],['Civil wars won','0 / 1'],['Counterattack','next year']];
 $('#endS').innerHTML=rows.map(([k,v])=>`<dt>${k}</dt><dd>${v}</dd>`).join('')}
$('#bNew').onclick=()=>newGame(false);$('#bCont').onclick=()=>newGame(true);
$('#e1').onclick=()=>{store.set(SAVEK,null);newGame(false)};
$('#e2').onclick=()=>{$('#end').hidden=true;$('#title').hidden=false;$('#hud').hidden=true;state='title';music('off');showCont()};
function showCont(){const s=store.get(SAVEK,null);$('#bCont').hidden=!(s&&!s.done)}showCont();
let prevState='play';
function togglePause(){if(state==='play'||state==='battle'){prevState=state;state='pause';ambSet()}else if(state==='pause'){state=prevState;ambSet()}}
$('#bPause').onclick=e=>{togglePause();e.currentTarget.blur()};
function toggleMute(){initAudio();setMute(!muted);store.set('mingan.mute',muted);sndLabel()}
function sndLabel(){$('#bSnd').textContent=muted?LZ('MUTE','靜音'):LZ('SND','音效')}
$('#bSnd').onclick=e=>{toggleMute();e.currentTarget.blur()};
$('#bLang').onclick=e=>{applyLang(LANG==='zh'?'en':'zh',true);e.currentTarget.blur()};
document.querySelectorAll('.lang button').forEach(b=>b.addEventListener('click',()=>applyLang(b.dataset.l,true)));
const ZH_HTML={h1:'明暗<span>第四十八遠征隊 · 內戰小兵 RPG</span>',new:'新的遠征',cont:'繼續遠征',rot:'請把手機轉成橫向：遠征隊只走橫的',
 tag:'1948年，上海。印鈔機每年都在鈔票上畫一個更大的數字，積蓄比那個數字還不值錢的人，就會被抹除。局勢完全在掌控之中的國民政府，派出第四十八遠征隊去阻止它：從外灘到最後的碼頭，一共六章。第四十七遠征隊留下了一張紙條：<i>多帶點錢</i>。',
 keys:'探索：W A S D 移動 · 滑鼠轉視角（先點一下畫面）· Shift 跑步 · E 使用 · J 或點擊先出手偷襲<br>戰鬥：W S 選擇 · J／Enter 確認 · K 返回 · 白圈縮到金圈時按 J，技能加成<br>敵人回合：攻擊打中的瞬間按空白鍵閃避 · Shift 格擋（時機更緊）· 一招全部擋下就能反擊<br>P 暫停 · L 切換語言 · M 音效',
 fine:'諷刺作品。你只能扮演國軍（國民黨）這一方。回合制戰鬥加即時閃避。兩邊都被酸，中央銀行也是。在每個茶爐和每場戰鬥後自動存檔。',
 shopH:'軍需官（價格每小時調整）',gy:'金圓券',warpH:'搭茶爐傳送（目前免費，暫時）',restGo:'繼續遠征',endH:'劇終（暫時）',e1:'新的遠征',e2:'回標題',tA:'出手',tR:'跑',dodge:'閃避',parry:'格擋'};
const EN_HTML={};document.querySelectorAll('[data-t]').forEach(el=>EN_HTML[el.dataset.t]=el.innerHTML);
const KEYS_TOUCH={en:'Phone (landscape): left thumb-stick walks · drag the right side to look · STRIKE first to ambush · USE at stoves, items and notes<br>Battle: tap a menu row, then tap a target · tap anywhere at the gold ring · DODGE / PARRY buttons on the enemy turn<br>Top right: language, pause, sound',
 zh:'手機（橫向）：左邊搖桿走路 · 右半邊拖曳轉視角 · 先按「出手」可以偷襲 · 在茶爐、道具、留言旁按「使用」<br>戰鬥：點選單，再點目標 · 圓圈對齊時點畫面任何地方 · 敵人回合按「閃避」／「格擋」<br>右上角：語言、暫停、音效'};
function applyLang(l,sv){LANG=l==='en'?'en':'zh';const zh=LANG==='zh';if(sv)try{localStorage.setItem(LANG_KEY,LANG)}catch(e){}
 document.documentElement.lang=zh?'zh-Hant':'en';document.title=zh?'明暗：第四十八遠征隊 Ming An: Expedition 48':'Ming An: Expedition 48';
 document.querySelectorAll('[data-t]').forEach(el=>{const k=el.dataset.t;el.innerHTML=zh&&ZH_HTML[k]!=null?ZH_HTML[k]:EN_HTML[k]});
 if(touchUI)$('[data-t=keys]').innerHTML=KEYS_TOUCH[LANG];
 document.querySelectorAll('.lang button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.l===LANG)));
 const b=$('#bLang');b.textContent=zh?'EN':'中文';b.lang=zh?'en':'zh-Hant';b.setAttribute('aria-label',zh?'Switch to English':'切換為中文');
 $('#bPause').setAttribute('aria-label',zh?'暫停':'Pause');sndLabel();$('#bSnd').setAttribute('aria-label',zh?'音效開關':'Toggle sound');
 GLC.setAttribute('aria-label',zh?'明暗 3D 畫面':'Ming An 3D view');cv.setAttribute('aria-label',zh?'明暗遊戲畫面':'Ming An game screen');
 if(state==='rest'&&G)refreshRest();if(state==='end')fillEnd();const tu=$('#tU');if(!tu.hidden&&near)tu.textContent=tr(near.label);
 if(zh&&document.fonts)document.fonts.load(ZF(11),'國軍').catch(()=>{})}
document.addEventListener('visibilitychange',()=>{if(document.hidden&&(state==='play'||state==='battle'))togglePause()});

/* ---------------- input ---------------- */
const kb={},tch={},pressed={};let stickV={x:0,y:0};
const KM={KeyW:'up',KeyS:'down',KeyA:'left',KeyD:'right',ArrowLeft:'camL',ArrowRight:'camR',ArrowUp:'camU',ArrowDown:'camD',KeyE:'use',KeyF:'use',ShiftLeft:'run',ShiftRight:'run',KeyJ:'atk',Enter:'atk'};
const BKM={KeyW:'up',ArrowUp:'up',KeyS:'down',ArrowDown:'down',KeyA:'left',ArrowLeft:'left',KeyD:'right',ArrowRight:'right',KeyJ:'ok',Enter:'ok',KeyE:'ok',KeyK:'back',Escape:'back',Backspace:'back',KeyQ:'back'};
const held=k=>kb[k]||tch[k];
addEventListener('keydown',e=>{if(e.code==='KeyL'&&!e.repeat){applyLang(LANG==='zh'?'en':'zh',true);return}if(e.code==='KeyM'&&!e.repeat&&state!=='title'){toggleMute();return}
 if(state==='rest'){if(e.code==='Escape')$('#restGo').click();return}
 if(e.code==='KeyP'||(e.code==='Escape'&&state!=='battle'&&!document.pointerLockElement)){togglePause();return}
 if(state==='scene'){if(['Space','Enter','KeyJ','KeyE'].includes(e.code)){pressed.atk=1;e.preventDefault()}return}
 initAudio();
 if(state==='battle'){e.preventDefault();if(e.repeat)return;if(B&&B.react){if(e.code==='Space'||e.code==='KeyK')pressed.dodge=1;if(e.code==='ShiftLeft'||e.code==='ShiftRight'||e.code==='KeyL')pressed.parry=1;return}
  if((B&&(B.qte||B.aim))&&(e.code==='Space'||e.code==='KeyJ'||e.code==='Enter'))pressed.ok=1;const k=BKM[e.code];if(k)pressed[k]=1;return}
 if(state!=='play'&&state!=='pause')return;const k=KM[e.code];if(!k)return;e.preventDefault();if(!e.repeat&&!kb[k])pressed[k]=1;kb[k]=1});
addEventListener('keyup',e=>{const k=KM[e.code];if(k)kb[k]=0});
cv.addEventListener('contextmenu',e=>e.preventDefault());
function cvXY(e){const rc=cv.getBoundingClientRect();return[(e.clientX-rc.left)/rc.width*W,(e.clientY-rc.top)/rc.height*H]}
cv.addEventListener('pointerdown',e=>{initAudio();if(state==='scene'){pressed.atk=1;return}
 if(state==='battle'){const[x,y]=cvXY(e);if(B&&(B.qte||B.aim)){pressed.ok=1;return}for(const b of btns)if(x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h){b.f();return}return}
 if(state==='play'&&!touchUI){if(!document.pointerLockElement){try{const p_=cv.requestPointerLock();if(p_&&p_.catch)p_.catch(()=>{})}catch(_){}return}pressed.atk=1}});
addEventListener('mousemove',e=>{if(document.pointerLockElement===cv&&state==='play'){cy-=e.movementX*.0035;cp=clamp(cp+e.movementY*.0025,-.15,1.1)}});
for(const id of['bDodge','bParry']){const b=$('#'+id);const f=e=>{e.preventDefault();initAudio();pressed[b.dataset.k]=1};b.addEventListener('pointerdown',f)}
let touchUI=false;const tpad=$('#touch'),sBase=$('#stickBase'),sKnob=$('#stickKnob');let stickId=null,camId=null,sx0=0,sy0=0,cx0=0,cy0=0;const btnT={};
if(matchMedia('(pointer:coarse)').matches)touchUI=true;
if(touchUI){$('#kD').textContent='';$('#kP').textContent=''}
addEventListener('touchstart',()=>{if(!touchUI){touchUI=true;$('#kD').textContent='';$('#kP').textContent='';if(state==='play')tpad.hidden=false;applyLang(LANG,false)}},{passive:true});
tpad.addEventListener('touchstart',e=>{e.preventDefault();initAudio();for(const t of e.changedTouches){const b=t.target.closest&&t.target.closest('.tb');
 if(b){const k=b.dataset.k;btnT[t.identifier]=k;tch[k]=true;pressed[k]=1;b.classList.add('on');continue}
 if(t.clientX<innerWidth*.45&&stickId==null){stickId=t.identifier;sx0=t.clientX;sy0=t.clientY;sBase.hidden=false;sBase.style.left=sx0+'px';sBase.style.top=sy0+'px';sKnob.style.transform=''}
 else if(camId==null){camId=t.identifier;cx0=t.clientX;cy0=t.clientY;camDrag=true}}},{passive:false});
tpad.addEventListener('touchmove',e=>{e.preventDefault();for(const t of e.changedTouches){if(t.identifier===stickId){const dx=clamp(t.clientX-sx0,-50,50),dy=clamp(t.clientY-sy0,-50,50);stickV={x:Math.abs(dx)<8?0:dx/50,y:Math.abs(dy)<8?0:dy/50};sKnob.style.transform=`translate(${dx}px,${dy}px)`}
 else if(t.identifier===camId){cy-=(t.clientX-cx0)*.008;cp=clamp(cp+(t.clientY-cy0)*.005,-.15,1.1);cx0=t.clientX;cy0=t.clientY}}},{passive:false});
function tEnd(e){e.preventDefault();for(const t of e.changedTouches){if(t.identifier===stickId){stickId=null;stickV={x:0,y:0};sBase.hidden=true}if(t.identifier===camId){camId=null;camDrag=false}const k=btnT[t.identifier];if(k){tch[k]=false;delete btnT[t.identifier];const el=document.querySelector(`.tb[data-k=${k}]`);if(el)el.classList.remove('on')}}}
tpad.addEventListener('touchend',tEnd,{passive:false});tpad.addEventListener('touchcancel',tEnd,{passive:false});
function fit(){const vw=innerWidth,vh=innerHeight,s=Math.min(vw/W,vh/H);const st=$('#stage');st.style.width=Math.floor(W*s)+'px';st.style.height=Math.floor(H*s)+'px'}
addEventListener('resize',fit);

/* ---------------- loop ---------------- */
muted=!!store.get('mingan.mute',false);applyLang(LANG,false);
fit();
let last=performance.now(),acc=0;
function attract(){ctx.fillStyle='#070505';ctx.fillRect(0,0,W,H);const x=W/2,y=150;r(0,y,W,H-y,'#1a1210');
 const g=ctx.createRadialGradient(x,y-10,2,x,y-10,120);g.addColorStop(0,'rgba(255,140,50,.35)');g.addColorStop(1,'rgba(255,100,30,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 const fl=(T>>2)%3;r(x-9,y-14,18,14,'#6a4a3a');r(x-10,y-15,20,3,'#8a6450');r(x-5,y-9+fl,4,7-fl,'#ff8a1a');r(x-1,y-8-fl%2,4,6,'#ffd24a');
 drawSoldier(x-52,y,{fac:'kmt',face:1,pose:'sit',emo:'sleep',gun:null});drawSoldier(x+36,y,{fac:'kmt',face:-1,pose:'sit',emo:(T%240)<200?'sleep':'normal',gun:null});drawCivilian(x-8,y-30,{face:1,hat:'cap',cl:'#5a4a3a',emo:'scared',pose:'idle'});ctx.drawImage(VIG,0,0)}
function tick(){if(window.__bot)window.__bot();
 if(state==='play'||state==='battle')update();
 else if(state==='scene'&&scene){scene.t++;T++;if(scene.t%3===0&&scene.t<500)SFX.type();const adv=pressed.atk||pressed.use;for(const k in pressed)delete pressed[k];if(adv&&scene.t>10){if(!scene.complete)scene.t=9999;else{const d=scene.done;scene=null;d()}}}
 else{T++;for(const k in pressed)delete pressed[k]}}
function loop(nt){acc+=Math.min(100,nt-last);last=nt;const SPD=window.__d&&window.__d.fast||1;
 while(acc>=16.67){acc-=16.67;for(let k=0;k<SPD;k++)tick()}
 render();requestAnimationFrame(loop)}
(document.fonts?Promise.all([document.fonts.load(F),document.fonts.load(SERIF(20)),document.fonts.load(ZF(11),'國軍'),document.fonts.load(SERIF2(20),'明暗')]):Promise.resolve()).catch(()=>{}).finally(()=>requestAnimationFrame(loop));
if(window.__d){// test-only autoplayer: basic attacks + human-ish dodges (skill = chance a dodge is timed right)
 const BOT={on:0,skill:.75,items:0,log:[]};window.__d.bot=BOT;
 window.__bot=()=>{if(!BOT.on||state!=='battle'||!B||hs>0)return;
  if(B.react){const rr=B.react;if(rr.botT==null)rr.botT=rnd()<BOT.skill?rr.lead-4-(rnd()*7|0):rnd()<.5?rr.lead-22-(rnd()*12|0):rr.lead+3;if(!rr.press&&rr.t>=rr.botT)reactPress('dodge');return}
  if(B.qte){if(B.qte.t>=B.qte.dur-2)qtePress();return}
  if(B.aim){B.aim.res='MISS';return}
  if(B.menu&&!B.task&&B.turn&&B.turn.side==='h'){const u=B.turn;
   if(B.menu.lv==='target'){const L_=B.menu.list;let bi=0;L_.forEach((t,i)=>{if(t.hp<L_[bi].hp)bi=i});B.tsel=bi;menuNav('ok');return}
   if(BOT.items){const low=alive(B.hs).find(h=>h.hp<h.max*.3);if(B.hs.some(h=>h.ko)&&G.items.balm){B.menu={lv:'items'};B.sel=1;menuNav('ok');return}if(low&&G.items.wine){B.menu={lv:'items'};B.sel=0;menuNav('ok');if(B.menu&&B.menu.lv==='target'){B.tsel=B.menu.list.indexOf(low);if(B.tsel<0)B.tsel=0;menuNav('ok')}return}}
   B.menu={lv:'main'};B.sel=0;menuNav('ok')}};
 const _hu=hitUnit;hitUnit=function(t,n,o){if(t.side==='h'&&BOT.on)BOT.log.push((B&&B.log?B.log.n:'?')+'>'+t.h.short+':'+n+(t.hp-n<=0?':KO':''));return _hu(t,n,o)};
 window.__d.rest=()=>{G.hp=null;G.inf*=1.15};window.__d.miss=()=>[...MISS];window.__d.lang=l=>applyLang(l,false);window.__d.G=()=>G;window.__d.finish2=()=>finish();
 window.__d.hpPct=()=>G.hp?Math.min(...HEROES.map((h,i)=>G.hp[i]/heroStat(h,'hp'))):1}
if(window.__d)Object.assign(window.__d,{map:()=>({grid:grid.map(r=>r.join('')),G:GROUPS,I:ITEMS,M:MSGS,F:FIRES}),g:()=>G,tpz:(x,z)=>{PL.x=x;PL.z=z},finish:()=>finish(),fightB:k=>startBattle(GROUPS.find(g=>g.boss===k),'normal')});
