/* ===================== i18n: 繁體中文 (default) / English — shared by Dark Yuan (2D) and Dark Yuan 3D =====================
   Game data stays English in the sources; text is translated where it is drawn (zt), by exact English key. */
var LANG='zh';
const LANG_KEY='darkyuan.lang',DY3=typeof THREE!=='undefined';
try{const v=localStorage.getItem(LANG_KEY);if(v==='en'||v==='zh')LANG=v}catch(e){}
const ZFAM='"Noto Sans TC","Noto Sans CJK TC","PingFang TC","Microsoft JhengHei","Heiti TC","Source Han Sans TC",sans-serif';
const ZSERIF='"Noto Serif TC","Noto Serif CJK TC","Songti TC","PMingLiU",serif';
const CJK_RE=/[⺀-鿿豈-﫿＀-￯　-〿]/;
const isZ=s=>LANG==='zh'&&CJK_RE.test(String(s));
const LZ=(e,z)=>LANG==='zh'?z:e;
// canvas CJK font for a pixel-font size: 16px -> bold 16, 8px -> 11px
function zf(font){const m=/(\d+)px/.exec(font||F),p=m?+m[1]:8;return p>=16?`700 16px ${ZFAM}`:p<8?`500 10px ${ZFAM}`:`500 11px ${ZFAM}`}
// line height for wrapped canvas text: CJK glyphs need ~3px more than the 8px pixel font
function zLH(n){return LANG==='zh'?n+4:n}
// wrap by measured width (current ctx.font); CJK breaks anywhere, latin words stay whole, no closing punctuation at a line start
function wrapPx(s,maxW){const toks=String(s).match(/[A-Za-z0-9¥$%'’.,!?:\/+\-–—()×]+|\s+|[\s\S]/gu)||[];const out=[];let line='';
 for(const tk of toks){const test=line+tk;
  if(line.trim()&&ctx.measureText(test.trimEnd()).width>maxW&&!/^[，。、！？：；）」』…—,.!?)\s]/.test(tk)){out.push(line.trim());line=/^\s+$/.test(tk)?'':tk}else line=test}
 if(line.trim())out.push(line.trim());return out}
const WB=new Map();
function wrapBal(s,maxW){const k=ctx.font+'|'+maxW+'|'+s;let L=WB.get(k);if(L)return L;L=wrapPx(s,maxW);
 for(let w=maxW-6;L.length>1&&L[L.length-1].length<5&&w>maxW*.6;w-=6){const L2=wrapPx(s,w);if(L2.length!==L.length)break;L=L2}
 if(WB.size>400)WB.clear();WB.set(k,L);return L}
// wrap a line of game text into n pixel-font characters (translated first); English path is the original wrap()
function zwrap(s,n){if(LANG!=='zh')return wrap(s,n);s=zt(s);if(!CJK_RE.test(s))return wrap(s,n);ctx.font=zf(F);return wrapBal(s,n*8)}
// a message on the ground, in quotes
function zq(s){return LANG==='zh'&&CJK_RE.test(zt(s))?'「'+zt(s)+'」':'"'+s+'"'}
// width of a string as txt() draws it
function zw(s){s=zt(String(s));if(LANG==='zh'&&CJK_RE.test(s)){ctx.font=zf(F);return Math.ceil(ctx.measureText(s).width)}ctx.font=F;return ctx.measureText(s).width}

/* ---- every player-visible English string in both games -> 繁體中文 ---- */
const ZH={
 // areas
 'VILLAGE OF THE ROPED':'綁繩之村','THE BRIDGE NOBODY BLEW UP':'沒人炸掉的橋','THE MINT THAT NEVER SLEEPS':'不眠的印鈔廠','HUAIHAI, WHERE THE ARMY WENT':'淮海：大軍一去不回','DOCKS OF THE LAST FERRY':'末班渡輪碼頭',
 // tea stoves
 'THE CONSCRIPT PIT':'壯丁坑','VILLAGE SHRINE':'村口土地廟','VILLAGE SQUARE':'村口廣場','MINT GATE':'印鈔廠大門','FROZEN TRENCH':'冰封戰壕','FERRY ROAD':'渡口大路','CUSTOMS HOUSE':'海關大樓',
 // bosses: titles, subtitles, full names, defeat banners
 'COMMISSAR WEI':'魏政委','SELF-CRITICISM ENFORCER':'自我批評督導員','COMMISSAR FELLED':'政委倒下了','HE WILL WRITE A REPORT ABOUT THIS':'他會為此寫一份檢討報告',
 'GENERAL MA':'馬將軍','EXECUTIONER OF DESERTERS':'逃兵處決者','WARLORD FELLED':'軍閥倒下了',
 'TREASURER ZHAO':'趙司庫','KEEPER OF THE PRESSES':'印鈔機的守護者','TREASURER FELLED':'司庫倒下了','INFLATION, HOWEVER, IS UNDEFEATED':'不過，通膨依然無敵',
 'COLONEL LU':'盧上校','OF FLEXIBLE LOYALTY':'忠誠非常有彈性','COLONEL FELLED':'上校倒下了','BOTH ARMIES CLAIM HE WAS THEIRS':'兩邊都說他是自己人',
 'THE BROTHERS':'兄弟倆','WHO AGREE ON ONE THING':'只在一件事上意見一致','UNITED FRONT DISSOLVED':'統一戰線瓦解了',
 'GENERAL MA, EXECUTIONER OF DESERTERS':'逃兵處決者 · 馬將軍','BROTHER RED, THE SWIFT':'迅捷的紅老弟','BROTHER BLUE, THE STOUT':'壯碩的藍大哥',
 'COMMISSAR WEI, SELF-CRITICISM ENFORCER':'自我批評督導員 · 魏政委','TREASURER ZHAO, KEEPER OF THE PRESSES':'印鈔機的守護者 · 趙司庫','COLONEL LU, OF FLEXIBLE LOYALTY':'忠誠很有彈性的 · 盧上校',
 'COLONEL LU (DEFECTED)':'盧上校（已投共）','COLONEL LU HAS DEFECTED':'盧上校投共了','HE KEEPS THE SAME SPEAR':'長槍倒是沒換',
 'THE UNITED FRONT (TEMPORARY)':'統一戰線（暫時性）','THE BROTHERS HAVE UNITED':'兄弟倆聯手了','AGAINST YOU, SPECIFICALLY':'專門對付你一個',
 "COMMISSAR WEI'S UNDERSTUDY":'魏政委的替身','ENEMY FELLED':'強敵倒下了',
 // shouts
 'DIE! CCP MTFK!':'去死吧！共匪王八蛋！','DIE! ...KMT MTFK?':'去死吧！……國軍王八蛋？','SORRY! MTFK!':'對不起！王八蛋！','DIE! BOTH MTFK!':'兩邊都去死！王八蛋！',
 'CRITICIZE YOURSELF!':'自我批評！','CONFESS! MTFK!':'坦白從寬！王八蛋！','PRINT MORE! MTFK!':'再印！王八蛋！','FOR THE REPUBLIC!':'為了民國！','FOR THE PEOPLE!':'為人民服務！',
 'I WAS ALWAYS RED!':'我一直都是紅的！','DIE, DESERTER!':'逃兵，去死！','DIE, DESERTER! MTFK!':'逃兵去死！王八蛋！',
 'SELF-CRITICIZE!':'自我批評！','STRUGGLE SESSION!':'批鬥大會！','CONFESS!':'坦白從寬！','RECTIFY!':'整風！','WRITE IT DOWN!':'寫下來！','NEW ISSUE!':'新鈔發行！','STILL VALID!':'仍然有效！',
 // pops & prompts
 'BACKSTAB':'背刺','RIPOSTE':'處決','BLOCKED':'被擋下','PARRY!':'彈反！','GUARD BROKEN':'防禦崩潰','POISE BROKEN':'架勢崩潰','NO WINE':'沒酒了','RETURN TO SENDER':'原件退回',
 'YOU ROSE AGAIN. NOBODY NOTICED.':'你又爬起來了。沒人注意到。','TEA STOVE LIT':'茶爐已點燃',
 'REST':'休息','LIGHT THE STOVE':'點燃茶爐','PICK UP':'撿起','OPEN THE CRATE':'打開箱子','ENTER THE FOG':'走入白霧','BOARD THE LAST FERRY':'登上最後一班渡輪','READ MESSAGE':'閱讀留言',
 'PAUSED':'暫停','P / ESC TO RESUME':'按 P 或 ESC 繼續','CLICK TO CAPTURE MOUSE':'點一下畫面鎖定滑鼠','THIS BROWSER BLOCKED 3D GRAPHICS':'這個瀏覽器封鎖了 3D 繪圖','TRY ANOTHER BROWSER':'請換一個瀏覽器試試',
 'YOU DIED':'你死了','陣亡 · YOUR GOLD YUAN IS INFLATING WHERE YOU FELL':'陣亡 · 你的金圓券正在倒下的地方繼續貶值',
 'YOU RETREATED':'你轉進了','撤退 · TEMPORARILY · VERY TEMPORARILY':'撤退 · 暫時的 · 非常暫時的',
 'FERRY':'渡口','AID':'美援','TEMPORARY':'暫時',
 // items
 'RATION TICKET':'配給券','+1 rice wine flask, refilled at every stove.':'米酒壺 +1，每座茶爐都會幫你補滿。','Redeemable for one flask of rice wine, or one sip after the next price review.':'可兌換一壺米酒。下次物價調整後，可兌換一口。',
 'BRICK OF GOLD YUAN':'一整磚金圓券','A great deal of money. For now.':'一大筆錢。暫時是。','Worth a house in August. A bag of rice in October. Kindling by Christmas.':'八月能買一棟房子。十月能買一袋米。到了聖誕節只能拿來生火。',
 'SHARPENING STONE':'磨刀石','+12% dadao damage.':'大刀傷害 +12%。','The dadao was sharp once. So was the officer who sold it to you.':'這把大刀以前很利。把它賣給你的那位長官，腦筋也很利。',
 'STICK GRENADE POUCH':'木柄手榴彈袋','+1 grenade carried.':'手榴彈攜帶量 +1。','German design, local copy, fuse length a matter of faith. Throw quickly.':'德國設計，本地仿製，引信長度全憑信仰。快丟。','German design, local copy, fuse length a matter of faith.':'德國設計，本地仿製，引信長度全憑信仰。',
 'PADDED COTTON VEST':'棉背心','+15% max morale.':'士氣上限 +15%。','Ordered for winter 1947. Delivered summer 1948. Perfect for next winter, if there is one.':'1947 年冬天訂的，1948 年夏天到貨。明年冬天穿剛好，如果還有明年冬天的話。','Ordered for winter 1947. Delivered summer 1948.':'1947 年冬天訂的，1948 年夏天到貨。',
 "THE GENERAL'S STAMP":'將軍的印章','Half of your discharge papers.':'你退伍令的一半。','Pressed on six thousand execution orders. Now on your discharge. Ink is ink.':'蓋過六千張槍決令，現在蓋在你的退伍令上。印泥就是印泥。',
 'SELF-CRITICISM, 40 PAGES':'自我批評書，四十頁',"The commissar's confession notebook. He ran out of paper long before he ran out of faults.":'政委的檢討筆記本。他的錯還沒寫完，紙就先用完了。',
 'ONE-MILLION NOTE PLATE':'百萬元大鈔印版','+12% dadao damage. The edges are sharp.':'大刀傷害 +12%。邊緣很利。',"The official plate. The counterfeiters' plate is better. Nobody can tell the notes apart, including the bank.":'官方印版。偽鈔集團的印版比較好。兩種鈔票沒人分得出來，銀行也分不出來。','The official plate. The counterfeit plate is better. Nobody can tell the notes apart, including the bank.':'官方印版。偽鈔的印版比較好。兩種鈔票沒人分得出來，銀行也分不出來。',
 'REVERSIBLE CAP':'雙面軍帽','Blue on one side, green on the other. Not standard issue. Very popular in 1949.':'一面藍，一面綠。不是制式配發。1949 年非常搶手。',
 "THE UNITED FRONT'S STAMP":'統一戰線的印章','The other half. Board the ferry.':'另一半。上船吧。','Two seals pressed side by side. They do not overlap. They never did.':'兩個印並排蓋著，彼此沒有重疊。從來沒有過。','Two seals side by side. They do not overlap. They never did.':'兩個印並排，彼此沒有重疊。從來沒有過。',
 // messages on the ground (2D)
 'J ATTACK · U HEAVY ATTACK. SPAM AT YOUR PERIL.':'J 攻擊 · U 重擊。亂按後果自負。','ATTACK · HEAVY. SPAM AT YOUR PERIL.':'攻擊 · 重擊。亂按後果自負。',
 'K ROLL. INVINCIBLE MID-ROLL. ONLY MID-ROLL.':'K 翻滾。翻滾途中無敵。只有途中。','ROLL. INVINCIBLE MID-ROLL. ONLY MID-ROLL.':'翻滾。翻滾途中無敵。只有途中。',
 'W OR E: REST AT THE TEA STOVE. THE DEAD RETURN. SO DO PRICES.':'W 或 E：在茶爐休息。死人會回來，物價也會。','USE: REST AT THE TEA STOVE. THE DEAD RETURN. SO DO PRICES.':'使用：在茶爐休息。死人會回來，物價也會。',
 'HOLD L TO GUARD. TAP L JUST AS A BLOW LANDS TO PARRY. THEN ATTACK.':'按住 L 防禦。攻擊落下的瞬間輕點 L 就是彈反。然後砍他。','HOLD GUARD TO BLOCK. TAP IT JUST AS A BLOW LANDS TO PARRY. THEN ATTACK.':'按住防禦來格擋。攻擊落下的瞬間輕點就是彈反。然後砍他。',
 'R: RICE WINE HEALS. IT TAKES TIME. HE WILL NOT WAIT.':'R：米酒能回血。喝要花時間。他不會等你。','WINE HEALS. IT TAKES TIME. HE WILL NOT WAIT.':'米酒能回血。喝要花時間。他不會等你。',
 'STRIKE FROM BEHIND TO BACKSTAB. S + ATTACK IN THE AIR TO PLUNGE.':'從背後出手就是背刺。空中按 S＋攻擊可以下劈。','STRIKE FROM BEHIND TO BACKSTAB. STICK DOWN + ATTACK IN THE AIR TO PLUNGE.':'從背後出手就是背刺。空中搖桿往下＋攻擊可以下劈。',
 'TRY RETREATING':'試試轉進','HOLE AHEAD':'前有洞','IF ONLY I HAD A PAYCHECK...':'要是有薪餉就好了……','AMAZING COMMISSAR AHEAD':'前有很棒的政委',
 'BE WARY OF LEFT. AND RIGHT. IT IS A CIVIL WAR.':'小心左派。還有右派。這是內戰。','SNIPER AHEAD, THEREFORE ROLL':'前有狙擊手，所以翻滾吧','SUPPLIES AHEAD! (TRUST ME)':'前有補給！（相信我）','VISIONS OF A GENERAL...':'看見了將軍的幻影……',
 'BANK RUN AHEAD. THEREFORE RUN':'前有擠兌，所以快跑','HOLE. FULL OF OLD BANKNOTES.':'洞。裡面全是舊鈔。','TRY SAVING':'試試存錢','VISIONS OF MONEY...':'看見了錢的幻影……',
 'HALF A MILLION OF OURS WERE LOST HERE. YOU ARE ONE OF THEM. AGAIN.':'我軍五十萬人折在這裡。你是其中一個。又一次。','COLD AHEAD. ALSO COLDER.':'前方寒冷。而且更冷。','BE WARY OF FRIENDS':'小心自己人','COLONEL AHEAD. WHICH SIDE? YES.':'前有上校。哪一邊的？是的。',
 'PRAISE THE PAYCHECK \\o/':'讚美薪餉 \\o/','HOLE. HOLE. HOLE.':'洞。洞。洞。','LIAR AHEAD. ALSO POLICE.':'前有騙子。還有警察。',"DIDN'T EXPECT INFLATION...":'沒想到會通膨……','TWO BROTHERS AHEAD, THEREFORE FIGHT EACH OTHER?':'前有兩兄弟，所以自相殘殺？',
 // messages on the ground (3D)
 'WASD MOVE · MOUSE LOOKS (CLICK TO CAPTURE) · LEFT CLICK ATTACK · U HEAVY':'WASD 移動 · 滑鼠看四周（先點畫面鎖定）· 左鍵攻擊 · U 重擊','STICK MOVES · DRAG RIGHT SIDE TO LOOK · ATTACK · HEAVY':'搖桿移動 · 拖曳右半邊看四周 · 攻擊 · 重擊',
 'SPACE ROLLS. INVINCIBLE MID-ROLL. HOLD SPACE TO SPRINT.':'空白鍵翻滾。翻滾途中無敵。按住空白鍵衝刺。','ROLL: INVINCIBLE MID-ROLL. HOLD ROLL TO SPRINT.':'翻滾：途中無敵。按住翻滾可以衝刺。',
 'Q LOCKS ON. CIRCLE THEM. THEY TURN SLOWER THAN YOU.':'Q 鎖定。繞著他打。他轉身比你慢。','LOCK ON. CIRCLE THEM. THEY TURN SLOWER THAN YOU.':'鎖定。繞著他打。他轉身比你慢。',
 'RIGHT CLICK GUARDS. TAP IT AS A BLOW LANDS TO PARRY, THEN ATTACK TO RIPOSTE.':'右鍵防禦。攻擊落下的瞬間輕點就是彈反，再攻擊就是處決。','HOLD GUARD TO BLOCK. TAP IT AS A BLOW LANDS TO PARRY, THEN ATTACK.':'按住防禦來格擋。攻擊落下的瞬間輕點就是彈反。然後砍他。',
 'E RESTS AT THE TEA STOVE. THE DEAD RETURN. SO DO PRICES. R DRINKS WINE.':'E 在茶爐休息。死人會回來，物價也會。R 喝米酒。','USE: REST AT THE STOVE. THE DEAD RETURN. SO DO PRICES.':'使用：在茶爐休息。死人會回來，物價也會。',
 'STRIKE FROM BEHIND: BACKSTAB':'從背後出手：背刺','CONFESSION AHEAD':'前有坦白','BE WARY OF LEFT. AND RIGHT. AND WATER.':'小心左派。還有右派。還有水。','HOLE. ALSO WATER.':'洞。而且有水。',
 // stove news & tips
 'Prices rose 15% while you rested. Your savings rested too, permanently.':'你休息的時候，物價漲了 15%。你的存款也休息了，永遠地。',
 'Government assures the Gold Yuan is stable. Rice is now quoted per grain.':'政府保證金圓券幣值穩定。米價即日起改為按粒計價。',
 'Shanghai bank run enters third week. The bank has not reopened to run from.':'上海擠兌進入第三週。銀行一直沒開門，想擠也沒得擠。',
 'Official exchange rate unchanged. Unofficial exchange rate unavailable at press time.':'官方匯率維持不變。黑市匯率截稿前無法取得。',
 'New banknotes printed to fix the old banknotes. Prices +15%.':'加印新鈔來拯救舊鈔。物價 +15%。',
 'A wheelbarrow of Gold Yuan now buys a smaller wheelbarrow.':'一推車的金圓券，現在可以買一台比較小的推車。',
 'Yuan you carry loses value at every rest. Spend it here, now.':'身上的金圓券每休息一次就貶值一次。現在、就在這裡花掉。',
 'Parry: tap guard the moment a blow lands, then attack to riposte.':'彈反：攻擊落下的瞬間輕點防禦，接著攻擊就是處決。',
 'A boss stunned by a parry or broken poise can be riposted. Get close, attack.':'頭目被彈反或架勢崩潰時可以處決。靠過去，攻擊。',
 'Rolling through an attack beats running from it.':'穿過攻擊翻滾，比轉身逃跑有用。',
 'Dropped yuan inflates away on the ground, 1% a second. Hurry.':'掉在地上的金圓券每秒貶值 1%。快去撿。',
 'Heavy attacks break shields and poise. They also leave you open.':'重擊能破盾、破架勢。也會讓你門戶大開。',
 'Your grenades refill at every stove. Your dignity does not.':'手榴彈在每座茶爐都會補滿。你的尊嚴不會。',
 'Lock on and circle-strafe: most enemies turn slower than you.':'鎖定之後繞圈走位：大多數敵人轉身比你慢。',
 'Roll through attacks, not away from them.':'往攻擊裡面滾，不要往外面滾。',
 // story cards
 'AUTUMN 1948':'1948 年秋','NORTH OF THE YANGTZE':'長江以北','DECEMBER 1949':'1949 年 12 月','THE LAST FERRY':'最後一班渡輪','TAIWAN STRAIT':'台灣海峽','TAIWAN':'台灣',
 'Nationalist press gangs seized farmers off roads and fields and marched them roped together. Vast numbers died or deserted before ever reaching the front.':'國軍的抓兵隊從路上、從田裡把農民抓走，用繩子綁成一串押著走。大批壯丁還沒走到前線，就已經死了或逃了。',
 'You died in the column, a Nationalist conscript. Then you got up. The sergeant marked you present. Find the last ferry. Get discharged.':'你是國軍壯丁，死在押送的隊伍裡。然後你又爬了起來。班長在點名簿上替你打了勾。去找最後一班渡輪，拿到退伍令。',
 'The Communists have taken the mainland. The Nationalist government relocates to Taiwan. The gold reserves left first, by ship.':'共軍拿下了大陸。國民政府遷往台灣。國庫黃金搭船先走了。',
 'The ferry is the final bonfire. Your Gold Yuan cannot buy a seat. The ferryman takes the stamps instead.':'渡輪就是最後一座營火。你的金圓券買不到座位。船夫改收那兩顆印章。',
 'Up to two million soldiers and civilians crossed. Officially it was a temporary relocation. Very temporary.':'多達兩百萬軍民渡過海峽。官方說法是暫時遷移。非常暫時。',
 'Your back pay is a suitcase of Gold Yuan. It buys one tangerine. The tangerine is overvalued.':'你的欠餉是一皮箱金圓券，可以買一顆橘子。那顆橘子還被高估了。',
 '"We counterattack the mainland next year!" was announced every year. The Gold Yuan stayed worthless every year too.':'「明年反攻大陸！」每年都宣布一次。金圓券也每年都一樣不值錢。',
 'You are discharged in 1987. You still have not unpacked. Next year, surely. NEW GAME+ is the counterattack.':'你在 1987 年退伍。行李到現在都還沒拆。明年，一定。二周目就是反攻大陸。',
 // HUD buttons
 'SND':'音效','MUTE':'靜音'};
// dynamic strings
const ZH_RX=[[/^DROPPED ¥(.+) ▼$/,'遺落 ¥$1 ▼'],[/^APPRAISED (.+) TIMES$/,'獲得 $1 次好評'],[/^\+¥(.+) \(NOW WORTH LESS\)$/,'+¥$1（已經縮水）']];
function zt(s){if(LANG!=='zh'||typeof s!=='string')return s;const z=ZH[s];if(z!=null)return z;for(const[a,b]of ZH_RX)if(a.test(s))return s.replace(a,b);return s}

/* ---- canvas text: CJK-aware overrides (English path is the untouched original) ---- */
const isDark=c=>{const m=/^#([0-9a-f]{6})/i.exec(c);if(!m)return false;const v=parseInt(m[1],16);return((v>>16)*.3+((v>>8)&255)*.59+(v&255)*.11)<70};
const _txt=txt,_stxt=stxt,_drawShout=drawShout,_soulScene=soulScene;
txt=function(s,x,y,c='#e9dcc2',al='left',font=F){if(LANG!=='zh')return _txt(s,x,y,c,al,font);
 s=zt(String(s));if(!CJK_RE.test(s))return _txt(s,x,y,c,al,font);
 const big=/16px/.test(font);ctx.font=zf(font);ctx.textAlign=al;ctx.textBaseline='middle';const yy=y+(big?8:4);ctx.fillStyle='#120d0c';
 if(!isDark(c))for(const[a,b]of[[1,1],[-1,0],[1,0],[0,-1],[0,1]])ctx.fillText(s,x+a,yy+b);ctx.fillStyle=c;ctx.fillText(s,x,yy);ctx.textBaseline='top'};
// serif banners (YOU DIED, area names, boss names): small sizes switch to the sans CJK face so they stay legible
stxt=function(s,x,y,c,size,a=1,al='center',raw){if(LANG!=='zh'||raw)return _stxt(s,x,y,c,size,a,al);s=zt(String(s));if(!CJK_RE.test(s))return _stxt(s,x,y,c,size,a,al);
 ctx.font=size<12?`700 ${size+2}px ${ZFAM}`:`900 ${size}px ${ZSERIF}`;let w=ctx.measureText(s).width;if(w>W-12){ctx.font=size<12?`700 ${Math.max(9,(size+2)*(W-12)/w|0)}px ${ZFAM}`:`900 ${Math.max(12,size*(W-12)/w|0)}px ${ZSERIF}`}
 ctx.textAlign=al;ctx.textBaseline='middle';ctx.globalAlpha=a;ctx.fillStyle='#000';ctx.fillText(s,x+1,y+2);ctx.fillStyle=c;ctx.fillText(s,x,y);ctx.globalAlpha=1};
drawShout=function(s,x,y,hero){s=zt(s);if(!isZ(s))return _drawShout(s,x,y,hero);
 ctx.font=zf(F);const w=Math.ceil(ctx.measureText(s).width)+10,h=16,jig=hero&&T%6<3?1:0,bx=clamp(x-w/2,4,W-w-4),by=Math.max(26,y-h)+jig,bc=hero?'#c8372d':'#120d0c',fc=hero?'#fff4d0':'#d8ccb0';
 r(bx-1,by-1,w+2,h+2,bc);r(bx-3,by+4,2,3,bc);r(bx+w+1,by+8,2,3,bc);r(bx+8,by-3,3,2,bc);r(bx+w-12,by+h+1,3,2,bc);r(bx,by,w,h,fc);
 const tx=clamp(x-1,bx+3,bx+w-6);r(tx,by+h+1,3,3,fc);r(tx+1,by+h+4,2,2,fc);
 ctx.font=zf(F);ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillStyle=hero?'#c8372d':'#3a2a20';ctx.fillText(s,bx+5,by+h/2+1);ctx.textBaseline='top'};
// story cards: measured wrapping, typed out character by character
soulScene=function(sc,t){const fact=zt(sc.fact),joke=zt(sc.joke);if(!isZ(fact+joke))return _soulScene(sc,t);
 ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);ctx.save();ctx.beginPath();ctx.rect(0,0,W,136);ctx.clip();{const at=Math.min(t,2400);if(!myArt(sc.draw,at))sceneArt(sc.draw,at)};ctx.restore();
 ctx.drawImage(VIG,0,0);r(0,136,W,H-136,'#120d0c');r(0,136,W,2,'#d9a441');txt(sc.date,8,141,'#d9a441');txt(sc.place,W-8,141,'#a8977c','right');
 let sz=12,LH=13,fl,jl;for(;;){ctx.font=`500 ${sz}px ${ZFAM}`;fl=wrapBal(fact,W-16);jl=wrapBal(joke,W-16);if((fl.length+jl.length)*LH+3<=H-153||sz<=10)break;sz--;LH--}
 const shown=Math.floor(t*.7);let n=0;ctx.textAlign='left';ctx.textBaseline='middle';
 fl.forEach((l,i)=>{ctx.fillStyle='#e9dcc2';ctx.fillText(l.slice(0,Math.max(0,shown-n)),8,153+i*LH+LH/2);n+=l.length});
 jl.forEach((l,i)=>{ctx.fillStyle='#ff9a6a';ctx.fillText(l.slice(0,Math.max(0,shown-n)),8,156+(fl.length+i)*LH+LH/2);n+=l.length});
 ctx.textBaseline='top';if(shown>n+10&&T%40<26)_txt('▶',W-16,H-12,'#d9a441');return shown>n};
// 3D only: flying slogans/banknotes are sprites, and the US AID crate is a texture
if(DY3){const _wordSprite=wordSprite,ZW=new Map();
 wordSprite=function(t){const z=zt(t);if(!isZ(z))return _wordSprite(t);let s=ZW.get(z);if(!s){ctx.font=`700 11px ${ZFAM}`;const w=Math.ceil(ctx.measureText(z).width)+8;
  s={n:mk(w,15,g=>{R(g,0,0,w,15,'#120d0cdd');g.fillStyle='#ff7d6e';g.font=`700 11px ${ZFAM}`;g.textBaseline='middle';g.fillText(z,4,8)})};ZW.set(z,s)}return s};
 let CR=null;const drawCrate=g=>{g.clearRect(0,0,32,32);R(g,1,4,30,28,'#7a5a35');R(g,1,4,30,2,'#9c7a4c');for(let y=10;y<32;y+=7)R(g,1,y,30,1,'#5a4025');R(g,1,4,3,28,'#5a4025');R(g,28,4,3,28,'#5a4025');
  g.fillStyle='#3a2a1a';if(LANG==='zh'){g.font=`900 11px ${ZFAM}`;g.textAlign='center';g.textBaseline='middle';g.fillText('美援',16,19);g.textAlign='left';g.textBaseline='alphabetic'}else{g.font='bold 9px monospace';g.fillText('US AID',5,20)}};
 PROPS.crate=()=>{if(!CR){const c=mk(32,32,drawCrate);CR={n:c,f:c}}return CR};
 var redrawCrate=()=>{if(!CR)return;drawCrate(CR.n.getContext('2d'));const t=TXC.get(CR.n);if(t)t.needsUpdate=true}}
// hyperinflation can outrun the unit table (1e27+)
{const _fmtBig=fmtBig;fmtBig=function(n){return n>=1e27||!isFinite(n)?'999OC+':_fmtBig(n)}}

/* ---- tea stove & ending (HTML) ---- */
let zFN='',zFT='';
function zFireText(){if(!G)return;$('#fireH').textContent=zt(FIRES[G.fire].name);$('#fireN').textContent=zt(zFN);$('#fTip').textContent=LZ('Tip: ','提示：')+zt(zFT)}
function fillEnd(){const zh=LANG==='zh',tm=G.time/60|0,pct=fmtBig((G.inf-1)*100);
 $('#endP').textContent=zh?(G.inf<1.01?'你帶著兩顆印章抵達渡口，而且一次都沒休息過。通膨對你刮目相看。':`你帶著兩顆印章抵達渡口。你休息的這段期間，大陸物價漲了 ${pct}%。`)+'仗打輸了。政府暫時遷到台灣。反攻大陸排在明年。還有後年。'
  :(G.inf<1.01?'You reached the ferry with both stamps and never once rested. Inflation is impressed. ':'You reached the ferry with both stamps. Prices on the mainland rose '+pct+'% while you rested. ')+'The war is lost. The government has relocated to Taiwan, temporarily. Counterattack scheduled for next year. And the year after that.';
 $('#endS').innerHTML=zh?`<dt>時間</dt><dd>${tm/60|0} 分 ${tm%60} 秒</dd><dt>死亡次數</dt><dd>${G.deaths}</dd><dt>擊倒敵人</dt><dd>${G.kills}</dd><dt>被通膨吃掉的金圓券</dt><dd>¥ ${fmtBig(G.lost)}</dd><dt>靈魂等級</dt><dd>${SL()}</dd><dt>周目</dt><dd>${G.ng?'NG+'+G.ng:'第一場戰爭'}</dd>`
  :`<dt>Time</dt><dd>${tm/60|0}m ${tm%60}s</dd><dt>Deaths</dt><dd>${G.deaths}</dd><dt>Enemies felled</dt><dd>${G.kills}</dd><dt>Gold Yuan lost to inflation</dt><dd>¥ ${fmtBig(G.lost)}</dd><dt>Soul level</dt><dd>${SL()}</dd><dt>Cycle</dt><dd>${G.ng?'NG+'+G.ng:'First war'}</dd>`}

/* ---- HTML overlays ---- */
const ZH_HTML={
 h1:'黑暗金圓<span>DARK YUAN · 準備好貶值吧</span>',h13:'黑暗金圓 3D<span>DARK YUAN 3D · 準備好貶值吧</span>',
 tag:'1948 年，中國。沒拿到退伍令就戰死的兵，會爬起來繼續打。你是一名國軍壯丁，死在用繩子綁成一串的押送隊伍裡。沒人讓你退伍。共軍要你死，自己的長官要你歸隊。去趕最後一班渡輪。',
 bNew:'新遊戲',bCont:'繼續',
 keys:'A D 移動 · 空白鍵 跳 · J 攻擊 · U 重擊 · K 翻滾 · L 防禦（輕點彈反）· R 米酒 · G 手榴彈 · W / E 使用 · P 暫停<br>滑鼠：左鍵攻擊，右鍵防禦 · 手機：左手拇指移動，右邊按鈕負責其他',
 keys3:'W A S D 移動 · 滑鼠看四周（點一下畫面鎖定滑鼠）· 左鍵 / J 攻擊 · U 重擊 · 右鍵 / L 防禦（輕點彈反）· 空白鍵 翻滾（按住衝刺）· Q / 滑鼠中鍵 鎖定 · R 米酒 · G 手榴彈 · E 使用 · 方向鍵 轉鏡頭 · P 暫停<br>手機：左手拇指移動，拖曳右半邊轉鏡頭，其他用按鈕',
 fine:'諷刺作品。非常難。你身上的金圓券每休息一次就貶值一次。死掉的話，它會躺在地上繼續貶值。',
 rot:'請把手機轉成橫向：這場仗要橫著打',
 lvH:'升級 · 以金圓券支付',fYk:'持有金圓券',fCk:'下一級花費',
 sVk:'生命力<small>士氣（生命）上限提高</small>',sEk:'耐力<small>精力上限提高</small>',sSk:'力量<small>大刀傷害提高</small>',
 fLk:'靈魂等級',fDk:'生命 · 精力 · 傷害',fFk:'米酒 · 手榴彈',warpH:'在茶爐之間移動',fireGo:'離開茶爐',
 endH:'你轉進了',e1:'反攻大陸（NG+）',e2:'回到標題',
 tA:'攻擊',tH:'重擊',tR:'翻滾',tJ:'跳',tL:'鎖定',tG:'防禦<br>彈反',tW:'米酒',tN:'手雷'};
const EN_HTML={};
const GN=DY3?['Dark Yuan 3D','黑暗金圓 3D']:['Dark Yuan','黑暗金圓'];
const ARIA={cv:[GN[0]+' game screen',GN[1]+' 遊戲畫面'],gl:[GN[0]+' 3D view',GN[1]+' 3D 畫面'],bPause:['Pause','暫停'],bSnd:['Toggle sound','切換音效'],bLang:['切換為中文','Switch to English']};
function sndLabel(){const b=$('#bSnd');if(b)b.textContent=zt(muted?'MUTE':'SND')}
function applyLang(l,save){LANG=l==='en'?'en':'zh';const zh=LANG==='zh';
 if(save)try{localStorage.setItem(LANG_KEY,LANG)}catch(e){}
 document.documentElement.lang=zh?'zh-Hant':'en';document.title=zh?GN[1]+' '+GN[0]:GN[0]+' '+GN[1];
 document.querySelectorAll('[data-t]').forEach(el=>{const k=el.dataset.t;if(EN_HTML[k]==null)EN_HTML[k]=el.innerHTML;el.innerHTML=zh&&ZH_HTML[k]!=null?ZH_HTML[k]:EN_HTML[k]});
 for(const id in ARIA){const el=$('#'+id);if(el)el.setAttribute('aria-label',ARIA[id][zh?1:0])}
 document.querySelectorAll('.lang button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.l===LANG)));
 const bl=$('#bLang');if(bl){bl.textContent=zh?'EN':'中文';bl.lang=zh?'en':'zh-Hant'}
 sndLabel();WB.clear();if(DY3)redrawCrate();
 const tu=$('#tU');if(tu&&!tu.hidden&&near)tu.textContent=zt(near.label);
 if(G&&!$('#fire').hidden){zFireText();refreshFire()}
 if(G&&!$('#end').hidden)fillEnd();
 if(zh&&document.fonts)Promise.all([document.fonts.load(zf(F),'國軍'),document.fonts.load(`900 24px ${ZSERIF}`,'你死了')]).catch(()=>{})}
document.querySelectorAll('.lang button').forEach(b=>b.addEventListener('click',e=>{applyLang(b.dataset.l,true);e.currentTarget.blur()}));
$('#bLang').addEventListener('click',e=>{applyLang(LANG==='zh'?'en':'zh',true);e.currentTarget.blur()});
addEventListener('keydown',e=>{if(e.code==='KeyL'&&(state==='title'||state==='end'))applyLang(LANG==='zh'?'en':'zh',true)});
// test builds: list any drawn English string that has no Chinese yet
if(window.__d)window.__d.zmiss=()=>{const out=[],chk=s=>{if(typeof s==='string'&&/[A-Za-z]{3}/.test(s)&&!(s in ZH))out.push(s)};
 MSGS.forEach(m=>[].concat(m.t).forEach(chk));for(const k in IDESC)['n','d','f'].forEach(f=>chk(IDESC[k][f]));NEWS.forEach(chk);TIPS.forEach(chk);
 ZONES.forEach(z=>chk(z.name));FIRES.forEach(f=>chk(f.name));ARENAS.forEach(a=>['title','sub','fell','fsub'].forEach(f=>a[f]&&chk(a[f])));
 for(const k in BOSSDEF)['name','shout','shout2','roar'].forEach(f=>BOSSDEF[k][f]&&chk(BOSSDEF[k][f]));for(const k in EDEF)EDEF[k].name&&chk(EDEF[k].name);
 for(const k in KILLS)chk(KILLS[k]);[SC_INTRO,...SC_END].forEach(s=>['date','place','fact','joke'].forEach(f=>chk(s[f])));return out};
applyLang(LANG,false);
