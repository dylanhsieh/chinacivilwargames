/* ===================== CIVIL FIGHTER 1949 — a Civil Slug versus fighting game ===================== */
const X={swing:lim(()=>{noise(.12,.13,2200,'bandpass',0,SFXBUS,1.4);tone(520,180,.09,'sine',.025)}),heavy:lim(()=>{noise(.28,.22,800,'bandpass',0,SFXBUS,1);tone(220,70,.22,'sine',.09)}),
 flesh:lim(()=>{noise(.09,.32,1100,'lowpass');tone(170,55,.12,'square',.06);noise(.05,.12,3000,'bandpass')}),block:lim(()=>{tone(1300,800,.1,'square',.04);noise(.06,.2,4000,'highpass')}),
 parry:()=>{tone(2700,2500,.3,'triangle',.09);tone(1850,1800,.35,'square',.035);noise(.06,.25,6500,'highpass')},roll:lim(()=>noise(.2,.12,500,'lowpass'))};
const SERIF=s=>`900 ${s}px "Noto Serif TC","Noto Serif CJK TC","Songti TC","PMingLiU",Georgia,serif`;
function stxt(s,x,y,c,size,a=1,al='center'){s=tr(String(s));if(isZ(s)&&size>22)size=Math.round(size*.8);ctx.font=SERIF(size);ctx.textAlign=al;ctx.textBaseline='middle';ctx.globalAlpha=a;ctx.fillStyle='#000';ctx.fillText(s,x+2,y+2);ctx.fillStyle=c;ctx.fillText(s,x,y);ctx.globalAlpha=1}
function groundAt(){return GY}
const FY=GY+5,SW=640;
PAL.uni={h:'#4a2a5a',hs:'#2a1a3a',s:'#d9a441',u:'#6a4a80',uh:'#8a6aa0',d:'#4a3a60',p:'#7a6a8a'};
const portrait=(fac,emo='normal')=>sprite('pt|'+fac+emo,40,28,g=>{R(g,0,0,40,28,SK);frontHead(g,fac==='uni'?'kmt':fac,emo);if(fac==='uni'){R(g,8,2,24,9,'#4a2a5a');R(g,17,3,6,6,'#d9a441')}}).n;

/* ---------------- roster ---------------- */
const ROSTER={
 wang:{name:'LAO WANG',han:'老王',fac:'kmt',hp:1000,spd:1.5,sc:2.6,dm:1,wpn:'dadao',stage:'village',
  sp:{proj:'yuan',aa:'rising',fwd:'rush',back:'withdraw',sup:'mtfk'},bio:'Conscript. Paid in Gold Yuan. Fights for back pay that will never arrive.',
  quotes:['Your army pays in rice? ...Can I see the menu?','I fought for my paycheck. It is now worth one egg.','DIE! CCP MTFK! ...Sorry. Reflex.'],
  ending:{draw:'boats',date:'DECEMBER 1949',place:'THE LAST FERRY',fact:'As the mainland fell, one to two million soldiers and civilians followed the Nationalist government across the strait.',joke:'Lao Wang won every round. On deck his back pay arrives: forty million Gold Yuan. A sailor trades him one boiled egg for the lot. Generous.'},
  taiwan:'Officially it is a temporary relocation. Very temporary. "We counterattack the mainland next year!" So Lao Wang unpacks one sock. Just one. No sense unpacking for a year.'},
 red:{name:'LITTLE RED',han:'小紅',fac:'ccp',hp:900,spd:1.85,sc:2.45,dm:.95,wpn:null,stage:'paddy',
  sp:{proj:'slogan',aa:'spin',fwd:'slide',back:'critique',sup:'megaphone'},bio:'Agitator. Megaphone in one hand, pamphlets in the other, opinions in both.',
  quotes:['I have prepared a pamphlet about your defeat.','Land to the tiller! Fist to the face!','You will now criticize yourself. Loudly.'],
  ending:{draw:'parade',date:'OCTOBER 1949',place:'BEIJING',fact:'On 1 October 1949 the People\'s Republic of China was proclaimed in Beijing.',joke:'Little Red wins. She is promoted to Deputy Assistant of Slogans, then asked to submit a self-criticism about winning too loudly.'}},
 ma:{name:'GENERAL MA',han:'馬將軍',fac:'kmt',officer:1,hp:1200,spd:1.1,sc:3.0,dm:1.2,wpn:'dadao',stage:'snow',
  sp:{proj:'grab',aa:'leap',fwd:'charge',back:'supervise',sup:'squad'},bio:'Battle supervisor. Executes deserters. Has never been asked how many.',
  quotes:['Retreat is treason. Advance is also suspicious.','I have a form for your execution. Sign here.','My dadao has six names engraved. Yours is next.'],
  ending:{draw:'goldship',date:'DECEMBER 1949',place:'THE LAST PIER',fact:'Before the end, the central bank\'s gold reserves were quietly shipped to Taiwan. The gold left first.',joke:'General Ma wins every bout and orders a glorious advance. Toward the boat. "It is not a retreat. The mainland is moving away."'},
  taiwan:'Officially a temporary relocation. Very temporary. General Ma schedules the counterattack for next year. Every year. The calendar is now his most decorated subordinate.'},
 wei:{name:'COMMISSAR WEI',han:'魏政委',fac:'ccp',officer:1,hp:1000,spd:1.5,sc:2.7,dm:1,wpn:null,stage:'river',
  sp:{proj:'bomb',aa:'rect',fwd:'line',back:'defect',sup:'reform'},bio:'Political commissar. Can defect to the winning side mid-sentence.',
  quotes:['Your errors have been noted. In triplicate.','I was always on the winning side. Check the records. I edited them.','Rectify THIS.'],
  ending:{draw:'flags',date:'1949',place:'EVERY VILLAGE',fact:'As the front lines moved, many villages changed hands, and flags, several times.',joke:'Commissar Wei wins and keeps both flags in his coat. Just in case.'}},
 printer:{name:'THE PRINTER',han:'印鈔機',fac:'uni',officer:1,hp:1700,spd:1.0,sc:3.5,dm:1.25,wpn:null,stage:'city',boss:1,
  sp:{proj:'bills',aa:'hammer',fwd:'hammer',back:'bills',sup:'devalue'},bio:'The central bank\'s printing press, in a suit. Paints a bigger number every year.',
  quotes:['I do not lose. I issue new currency.','Your health has been revalued at 1/1000th.','Inflation is not a bug. It is my fighting style.'],
  ending:{draw:'bankrun',date:'1949',place:'SHANGHAI',fact:'By 1949 the Gold Yuan, introduced in August 1948, had become close to worthless.',joke:'The Printer cannot be defeated, only replaced with a newer model.'}},
 million:{name:'MILLION-MAN ARMY',han:'百萬雄師',fac:'ccp',officer:1,hp:1900,spd:1.2,sc:3.6,dm:1.2,wpn:null,stage:'pier',boss:2,
  sp:{proj:'bomb',aa:'rect',fwd:'charge',back:'critique',sup:'reform'},bio:'Not one soldier. A statistic in a cap. Defeat him and only 999,999 remain.',
  quotes:['I am not one man. I am a rounding error of a million.','Beat me if you like. My cousins are queuing behind me.','The river was your line. We brought boats.'],
  ending:{draw:'parade',date:'1949',place:'THE FAR SHORE',fact:'By the end of 1949 the People\'s Liberation Army numbered in the millions.',joke:'He is promoted to One Million And One.'}}};
/* the arcade ladder: six stages, autumn 1948 to the last pier */
PAL.poster={h:'#3a2a18',hs:'#2a1a10',s:'#e0b070',u:'#c8a050',uh:'#e0c070',d:'#8a6a30',p:'#f0d890'};
const POSTERQ=['I have never lost a battle. I have never been in one.','I am you, but in a better font.','The Ministry says I win this. It is printed right here.'];
const posterOf=c=>Object.assign({},c,LANG==='zh'?{name:'海報'+c.name,han:'海報',mirror:1,quotes:['我從沒打過敗仗。因為我從沒打過仗。','我就是你，只是字體比較好看。','部裡說這場我會贏。這裡印得清清楚楚。']}:{name:'POSTER '+c.name.split(' ').pop(),han:'海報',mirror:1,quotes:POSTERQ});
function mkLadder(me){const riv=me==='wang'?'ma':'wang';return[{k:'red',stage:'snow',si:0},{k:'wei',stage:'village',si:1},{k:riv,stage:'river',si:2,riv},{k:me,mir:1,stage:'palace',si:3},{k:'printer',stage:'city',si:4},{k:'million',stage:'pier',si:5}]}
const STORY={en:[
 {draw:'snow',date:'SEPTEMBER 1948',place:'THE NORTHEAST',fact:'Autumn 1948. The war for the Northeast turns. Whole armies are surrounded; some simply change caps.',joke:'HQ issues {nm} a winter coat. On paper. The paper is quite warm if you burn it. A pamphleteer in a red armband blocks the road.'},
 {draw:'wreck',date:'NOVEMBER 1948',place:'HUAIHAI',fact:'The Huaihai campaign: hundreds of thousands of men on each side, across the central plains.',joke:'Orders: hold the village to the last man. The last man is {nm}. The village has already left. Only a commissar with two flags remains.'},
 {draw:'yangtze',date:'APRIL 1949',place:'THE YANGTZE',fact:'April 1949: the Communist armies cross the Yangtze. The river was supposed to be the line.',joke:'One seat left on the ferry. One other Nationalist wants it: {rn}. National unity begins with punching a colleague.'},
 {draw:'palace',date:'23 APRIL 1949',place:'NANJING',fact:'Nanjing, the capital, falls. The government has already moved to Guangzhou. And will move again.',joke:'In the empty Ministry of Victory, {nm} meets his own propaganda poster. It has never lost a battle. It has never been in one.'},
 {draw:'bankrun',date:'MAY 1949',place:'SHANGHAI',fact:'Shanghai falls. The Gold Yuan, launched in August 1948 to save the economy, is now worth less than the paper.',joke:'Rice costs a suitcase of money. The money costs nothing. Time to fight the only one on your side who is still winning: the printing press.'},
 {draw:'pier',date:'DECEMBER 1949',place:'THE LAST PIER',fact:'The People\'s Liberation Army now numbers in the millions. The boats number rather fewer.',joke:'Final opponent: the Million-Man Army. Beat him and only 999,999 remain. The last boat leaves at dawn either way.'}],
 zh:[
 {draw:'snow',date:'1948年9月',place:'東北',fact:'1948年秋，東北戰局逆轉。整支整支的部隊被包圍，有些乾脆換一頂帽子。',joke:'司令部發給{nm}一件冬衣。紙上的。那張紙燒起來倒是挺暖。一個戴紅臂章的宣傳員擋在路中間。'},
 {draw:'wreck',date:'1948年11月',place:'淮海',fact:'淮海戰役：雙方各數十萬大軍，在中原平原上正面對決。',joke:'命令：死守村子，戰到最後一人。最後一人就是{nm}。村子早就跑光了，只剩一位帶著兩面旗子的政委。'},
 {draw:'yangtze',date:'1949年4月',place:'長江',fact:'1949年4月，共軍渡過長江。長江本來應該是防線。',joke:'渡輪只剩一個位子。另一位國軍也想要：{rn}。團結全國，從揍同事開始。'},
 {draw:'palace',date:'1949年4月23日',place:'南京',fact:'首都南京失守。政府早就搬到廣州了。之後還會再搬。',joke:'在空無一人的「勝利部」裡，{nm}遇見了自己的宣傳海報。它從沒打過敗仗。因為它從沒打過仗。'},
 {draw:'bankrun',date:'1949年5月',place:'上海',fact:'上海失守。1948年8月為了拯救經濟而發行的金圓券，現在比印它的紙還不值錢。',joke:'一斗米要一皮箱鈔票，鈔票本身一文不值。該去對付我方唯一還在打勝仗的傢伙了：印鈔機。'},
 {draw:'pier',date:'1949年12月',place:'最後的碼頭',fact:'解放軍兵力已達數百萬。船的數量就少得多了。',joke:'最終對手：百萬雄師。打倒他，只剩999,999個。不管輸贏，最後一班船天一亮就開。'}]};
function storyOf(L_){const me=F1?F1.key:'wang',riv=me==='wang'?'ma':'wang',sc=STORY[LANG][L_.si||0];const f=x=>x.replace('{nm}',ROSTER[me].name).replace('{rn}',ROSTER[riv].name);return Object.assign({},sc,{fact:f(sc.fact),joke:f(sc.joke)})}
function curL(){if(typeof ladder[0]==='string')ladder=mkLadder(F1.key);return ladder[Math.min(ladderI,ladder.length-1)]}
const CAST=['wang','red','ma','wei'];
/* the player always fights for the Nationalists: player 1 may only pick KMT fighters (CCP fighters stay as CPU opponents / player 2) */
const P1OK=i=>ROSTER[CAST[i]].fac==='kmt';
const p1Locked=()=>mode!=='cpu'||selStep===0;
/* every arcade run ends the same way, true to history */
const FINALE={draw:'island',date:'DECEMBER 1949',place:'TAIWAN',fact:'The government retreats to Taiwan. You won every single round. You still lost the war.',joke:'Officially a temporary relocation. "We counterattack the mainland next year!" everyone agrees. Every year.'};
function endingFor(k){const c=ROSTER[k];return[c.ending,Object.assign({},FINALE,{joke:c.taiwan||FINALE.joke}),
 LANG==='zh'?{draw:'tally',date:'1950、1951、1952……',place:'還在船上',fact:'最終戰績：贏得回合 '+stats.rw+' · 輸掉回合 '+stats.rl+' · 打贏內戰 0',joke:'金圓券獎金：一文不值（不過很輕）。反攻大陸：預定明年。全劇終。（暫時的。）'}
 :{draw:'tally',date:'1950, 1951, 1952...',place:'THE BOAT, STILL',fact:'FINAL RECORD: ROUNDS WON '+stats.rw+' · ROUNDS LOST '+stats.rl+' · CIVIL WARS WON 0',joke:'Gold Yuan prize money: worthless (light, though). Counterattack: scheduled for next year. THE END. (Temporarily.)'}]}
function drawGate(gx,b,flagRed){r(gx-10,b-6,200,6,'#5a5450');r(gx,b-66,180,60,'#8a8478');for(let x=gx+6;x<gx+180;x+=18)r(x,b-66,2,60,'#7a746a');
 r(gx+20,b-42,30,36,'#1a1820');r(gx+75,b-50,30,44,'#1a1820');r(gx+130,b-42,30,36,'#1a1820');r(gx+20,b-44,30,2,'#5a5450');r(gx+75,b-52,30,2,'#5a5450');r(gx+130,b-44,30,2,'#5a5450');
 r(gx-6,b-74,192,8,'#5a5450');r(gx+2,b-78,176,4,'#4a4440');r(gx+10,b-63,160,10,'#120d0c');txt('MINISTRY OF VICTORY',gx+90,b-62,'#d9a441','center');
 r(gx+70,b-41,40,11,'#e9dcc2');txt('MOVED',gx+90,b-39,'#120d0c','center');
 r(gx+89,b-110,2,32,'#3a2a20');const wv=Math.sin(T/9)*1.5;if(flagRed){r(gx+91,b-108+wv,24,14,'#b8322a');r(gx+94,b-106+wv,4,4,'#f1d27a')}else{r(gx+91,b-108+wv,24,14,'#2f4f8a');r(gx+99,b-104+wv,6,6,'#f2f2f2')}}
function drawShip(sx,b,t){r(sx-90,b-22,210,22,'#2a2a30');r(sx-96,b-26,222,4,'#3a3a44');r(sx-40,b-46,90,20,'#3a3a44');for(let i=0;i<6;i++)r(sx-34+i*14,b-40,6,5,(i+(t>>5))%3?'#e0b050':'#5a5040');
 r(sx+10,b-72,14,26,'#2a2a30');r(sx+10,b-72,14,3,'#b8322a');for(let k=0;k<5;k++){const py=b-80-((t*.4+k*12)%60);r(sx+12+Math.sin((t+k*30)/20)*4+k,py,6+k,5+k,'rgba(40,40,50,.6)')}
 r(sx-80,b-20,74,9,'#e9dcc2');txt('LAST BOAT',sx-43,b-19,'#120d0c','center');for(let i=0;i<4;i++){r(sx+60+i*12,b-34,10,8,'#c8a040');r(sx+60+i*12,b-34,10,1,'#ffe27a')}}
const FART={yangtze(t){const g=ctx.createLinearGradient(0,0,0,136);g.addColorStop(0,'#2a1e3a');g.addColorStop(1,'#e8a060');ctx.fillStyle=g;ctx.fillRect(0,0,W,136);
  r(0,78,W,58,'#34445f');for(let i=0;i<22;i++)r((i*37+t*.5)%W,84+(i%6)*8,10,1,'#6a8ab0');r(0,112,150,24,'#7a6448');r(0,112,150,2,'#a08860');
  const bob=Math.round(Math.sin(t/20)*1.5);r(190,96+bob,120,12,'#5a4030');r(196,92+bob,108,4,'#7a5a38');r(240,80+bob,20,12,'#d9cfb8');txt('SEAT 1/1',250,70+bob,'#ffd24a','center');
  const pull=Math.sin(t/7)*3;drawSoldier(88-pull,124,{fac:'kmt',face:1,emo:'grit',gun:null});drawSoldier(126+pull,124,{fac:'kmt',face:-1,emo:'grit',gun:null,officer:1});
  r(100,104,10,3,SK);r(114,104,10,3,SK);txt('MINE!',70,92,'#e9dcc2','center');txt('MINE!',146,92,'#e9dcc2','center')},
 palace(t){const g=ctx.createLinearGradient(0,0,0,136);g.addColorStop(0,'#2a2a34');g.addColorStop(1,'#8a8a96');ctx.fillStyle=g;ctx.fillRect(0,0,W,136);r(0,124,W,12,'#6a645c');
  drawGate(170,126,(t>>6)%2);r(36,30,56,84,'#e0c070');r(38,32,52,80,'#c8a050');drawSoldier(56,104,{fac:'kmt',face:1,emo:'smug',gun:'rifle'});txt('HERO',64,36,'#5a3a10','center');
  drawSoldier(118,128,{fac:'kmt',face:-1,emo:(t>>5)%2?'scared':'grit',gun:null});for(let i=0;i<50;i++)r((i*37+t*1.2)%W,(i*23+t*6)%136,1,5,'rgba(170,190,210,.5)')},
 pier(t){const g=ctx.createLinearGradient(0,0,0,136);g.addColorStop(0,'#05060f');g.addColorStop(1,'#3a2a4a');ctx.fillStyle=g;ctx.fillRect(0,0,W,136);for(let i=0;i<24;i++)r((i*53)%W,(i*29)%50,1,1,'#e9dcc2');
  r(0,70,W,6,'#10142a');for(let i=0;i<60;i++)r((i*7+t*.15)%W,66+(i%3),2,4,i%2?'#3a5a32':'#2f4a2a');r(0,76,W,60,'#1a2440');for(let i=0;i<16;i++)r((i*29+t*.5)%W,84+(i%5)*6,12,1,'#3a4a70');
  drawShip(250,112,t);r(0,108,170,10,'#4a3220');for(let x=6;x<170;x+=24)r(x,118,4,18,'#3a2618');seg(150,110,170,94,2,'#7a5230');
  for(let i=0;i<5;i++){const x=(i*30+t*.35)%170;drawSoldier(x,108,{fac:'kmt',face:1,pose:'run',anim:t*.3+i*5,emo:i%2?'scared':'cry',gun:null,item:i%2?'case':null})}
  r(14,14,150,14,'#120d0c');txt('THE ARMY OF 1,000,000',89,17,'#ff8a7a','center')},
 tally(t){ctx.fillStyle='#0c1424';ctx.fillRect(0,0,W,136);r(0,96,W,40,'#1a2a48');for(let i=0;i<20;i++)r((i*31+t*.3)%W,100+(i%6)*6,10,1,'#3a5a80');
  const yr=1950+Math.min(76,t/30|0);r(40,18,96,72,'#e9dcc2');r(40,18,96,16,'#b8322a');txt('CALENDAR',88,22,'#f1d27a','center');stxt(String(yr),88,52,'#120d0c',22);txt('COUNTERATTACK:',88,68,'#120d0c','center');txt('NEXT YEAR',88,80,'#b8322a','center');
  r(200,92,46,8,'#6a4a2a');drawSoldier(212,92,{fac:'kmt',face:1,emo:(t>>6)%2?'sleep':'smug',gun:null,item:'case'});r(260,70,90,16,'#120d0c');txt('¥ 0.00',305,74,'#d9a441','center')},
 goldship(t){const g=ctx.createLinearGradient(0,0,0,136);g.addColorStop(0,'#05060f');g.addColorStop(1,'#26203a');ctx.fillStyle=g;ctx.fillRect(0,0,W,136);
  for(let i=0;i<24;i++)r((i*53)%W,(i*29)%60,1,1,'#e9dcc2');r(0,104,W,32,'#1a2440');for(let i=0;i<16;i++)r((i*29+t*.5)%W,108+(i%5)*5,12,1,'#3a4a70');
  r(0,98,150,8,'#4a3220');for(let x=6;x<150;x+=24)r(x,106,4,30,'#3a2618');
  const bob=Math.round(Math.sin(t/30)*1.5);r(190,82+bob,190,22,'#2a2a30');r(196,74+bob,170,8,'#3a3a44');r(300,46+bob,40,28,'#4a4a52');r(312,30+bob,10,16,'#2a2a30');
  for(let i=0;i<5;i++){r(206+i*18,62+bob,15,12,'#c8a040');r(206+i*18,62+bob,15,2,'#ffe27a');txt('金',209+i*18,64+bob,'#5a3a10')}
  r(200,86+bob,96,10,'#e9dcc2');txt('GOLD: ALREADY GONE',203,87+bob,'#120d0c');seg(150,100,196,84+bob,2,'#7a5230');
  const x=Math.min(150,10+t*.3);drawSoldier(x,98,{fac:'kmt',face:1,officer:1,pose:x<150?'run':'idle',anim:t*.3,emo:'smug',gun:null});
  for(let i=0;i<10;i++){const bx=(i*31+t*.7)%170,by=(i*17+t*.6)%120;r(bx,by,6,3,'#b0a070')}
  r(20,18,96,16,'#120d0c');txt('ADVANCE →',26,22,'#9fb6e6')}};
function endScene(sc,t){ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);ctx.save();ctx.beginPath();ctx.rect(0,0,W,136);ctx.clip();if(FART[sc.draw])FART[sc.draw](t);else sceneArt(sc.draw,t);ctx.restore();ctx.drawImage(VIG,0,0);
 r(0,136,W,H-136,'#120d0c');r(0,136,W,2,'#d9a441');txt(sc.date,8,141,'#d9a441');txt(sc.place,W-8,141,'#a8977c','right');
 const zh=isZ(sc.fact+sc.joke);let fl,jl,LH=10,gap=2,shown=Math.floor(t*1.4),n=0;
 if(zh){let sz=12;for(;;){ctx.font=`500 ${sz}px ${ZFAM}`;fl=wrapPx(sc.fact,W-16);jl=wrapPx(sc.joke,W-16);LH=sz+1;if((fl.length+jl.length)*LH+3<=H-153||sz<=10)break;sz--}shown=Math.floor(t*.7);gap=3}
 else{fl=wrap(sc.fact,47);jl=wrap(sc.joke,47);ctx.font=F;if(fl.length+jl.length>6){LH=9;gap=1}}
 ctx.textAlign='left';ctx.textBaseline=zh?'middle':'top';const off=zh?LH/2:0,adv=zh?0:1;
 fl.forEach((l,i)=>{const v=l.slice(0,Math.max(0,shown-n));n+=l.length+adv;ctx.fillStyle='#e9dcc2';ctx.fillText(v,8,153+i*LH+off)});
 jl.forEach((l,i)=>{const v=l.slice(0,Math.max(0,shown-n));n+=l.length+adv;ctx.fillStyle='#ff9a6a';ctx.fillText(v,8,153+gap+(fl.length+i)*LH+off)});
 ctx.textBaseline='top';if(shown>n+10&&T%40<26)_txt0('▶',W-16,H-12,'#d9a441');return shown>n}
const STAGES={village:{theme:'village',name:'BURNING VILLAGE',weather:null},paddy:{theme:'paddy',name:'THE CONTESTED PADDY',weather:null},snow:{theme:'snow',name:'NORTHEAST FRONT',weather:'snow'},river:{theme:'river',name:'YANGTZE FERRY',weather:null},city:{theme:'city',name:'SHANGHAI MINT',weather:'money'},
 palace:{theme:'palace',name:'NANJING · MINISTRY OF VICTORY',weather:'rain',bare:1},pier:{theme:'pier',name:'THE LAST PIER',weather:null,bare:1}};
THEMES.palace={sky:['#24242e','#44444f','#7e7e8a'],m1:'#3a3a46',m2:'#30303c',house:'#26222a',ground:'#6a645c',top:'#8a847a',spk:'#4a463e',sun:null};
THEMES.pier={sky:['#05060f','#141a34','#3a2a4a'],m1:'#141830',m2:'#10142a',house:'#0e0e18',ground:'#4a3626',top:'#7a5a3a',spk:'#2e2016',sun:'#e8e0c0'};
/* extra set dressing for the two new stages, drawn over the shared parallax background */
const STAGEFX={palace(){const o=camX*.5;drawGate(256-o-90,176,F1&&F2&&F1.hp/F1.max<F2.hp/F2.max);
  for(const wx of[60,250,440,600]){const x=wx-camX;if(x<-20||x>W+10)continue;r(x+4,GY-50,2,50,'#2a2a30');r(x,GY-54,10,4,'#3a3a40');r(x+2,GY-50,6,3,'#ffe8a0')}
  for(const wx of[150,380]){const x=wx-camX;if(x<-60||x>W+10)continue;r(x,GY-44,36,44,'#c8a050');r(x+2,GY-42,32,40,'#e0c070');txt('HERO',x+18,GY-40,'#5a3a10','center');drawSoldier(x+10,GY-6,{fac:'kmt',face:1,emo:'smug',gun:'rifle'})}},
 pier(){const o=camX*.5;r(0,138,W,6,'#10142a');for(let i=0;i<80;i++){const x=((i*9-o*.4-T*.1)%(W+20)+W+20)%(W+20)-10;r(x,134+(i%3),2,4,i%2?'#3a5a32':'#2f4a2a')}
  r(0,144,W,GY-144,'#1a2440');for(let i=0;i<24;i++)r(((i*37-camX*.6)%W+W)%W,150+(i%8)*4,8,1,'#3a4a70');drawShip(300-o,176,T);
  for(let sx=-(camX%18);sx<W;sx+=18)r(sx,GY+2,1,H-GY,'#2e2016');for(const wx of[40,220,400,600]){const x=wx-camX;if(x<-10||x>W)continue;r(x,GY-8,8,8,'#2a2a30');r(x-1,GY-9,10,2,'#3a3a44')}}};

/* ---------------- poses ---------------- */
const PO={
 idle:{fT:.35,fS:-.35,bT:-.3,bS:.15,fU:1.0,fF:1.3,bU:.7,bF:1.5,lean:1,dy:0},
 idle2:{fT:.35,fS:-.4,bT:-.3,bS:.1,fU:.95,fF:1.35,bU:.65,bF:1.55,lean:1,dy:.6},
 walk1:{fT:.7,fS:-.6,bT:-.45,bS:.4,fU:1.0,fF:1.3,bU:.6,bF:1.5,lean:1.5,dy:0},walk2:{fT:.05,fS:-.05,bT:.1,bS:-.4,fU:1.0,fF:1.3,bU:.6,bF:1.5,lean:1.5,dy:-.5},
 crouch:{fT:1.3,fS:-2.1,bT:.6,bS:-1.9,fU:1.1,fF:1.3,bU:.7,bF:1.4,lean:2,dy:4.5},
 jump:{fT:1.1,fS:-1.9,bT:.7,bS:-1.7,fU:1.9,fF:.9,bU:1.3,bF:1.0,lean:1,dy:0},
 lp1:{fT:.4,fS:-.35,bT:-.35,bS:.15,fU:1.1,fF:1.5,bU:.6,bF:1.6,lean:1.5,dy:0},lp2:{fT:.45,fS:-.35,bT:-.4,bS:.15,fU:1.57,fF:.05,bU:.6,bF:1.6,lean:3,dy:0},
 hp1:{fT:.2,fS:-.2,bT:-.4,bS:.2,fU:-.5,fF:1.6,bU:1.2,bF:1.2,lean:-1,dy:0},hp2:{fT:.6,fS:-.4,bT:-.7,bS:.3,fU:1.62,fF:.0,bU:-.5,bF:.8,lean:4.5,dy:0},
 cl:{fT:1.55,fS:0,bT:.6,bS:-1.9,fU:1.1,fF:1.3,bU:.7,bF:1.4,lean:1,dy:4.5},
 sweep:{fT:1.57,fS:0,bT:1.0,bS:-2.2,fU:.4,fF:.4,bU:-.6,bF:.5,lean:3.5,dy:5.5},
 jl:{fT:1.25,fS:-.35,bT:.7,bS:-1.7,fU:1.6,fF:.9,bU:1.3,bF:1.0,lean:2,dy:0},
 jh1:{fT:1.1,fS:-1.9,bT:.7,bS:-1.7,fU:2.8,fF:.7,bU:2.6,bF:.7,lean:-1,dy:0},jh2:{fT:1.0,fS:-1.6,bT:.6,bS:-1.5,fU:1.2,fF:.2,bU:1.3,bF:.2,lean:3,dy:0},
 block:{fT:.3,fS:-.3,bT:-.4,bS:.2,fU:2.1,fF:1.7,bU:1.9,bF:1.8,lean:-1,dy:0},cblock:{fT:1.3,fS:-2.1,bT:.6,bS:-1.9,fU:2.1,fF:1.7,bU:1.9,bF:1.8,lean:0,dy:4.5},
 hurt:{fT:.5,fS:-.2,bT:-.5,bS:.3,fU:-.7,fF:.6,bU:-.9,bF:.5,lean:-3.5,dy:0},hurtL:{fT:1.2,fS:-2,bT:.6,bS:-1.9,fU:-.4,fF:.6,bU:-.6,bF:.5,lean:-2,dy:4.5},
 throw:{fT:.5,fS:-.4,bT:-.5,bS:.2,fU:1.4,fF:.7,bU:1.5,bF:.6,lean:3,dy:0},
 pw:{fT:.5,fS:-.5,bT:-.5,bS:.2,fU:-1.3,fF:1.1,bU:-1.1,bF:1.2,lean:-1.5,dy:1},pr:{fT:.7,fS:-.4,bT:-.6,bS:.3,fU:1.57,fF:0,bU:1.5,bF:.1,lean:4,dy:1},
 up1:{fT:1.1,fS:-1.8,bT:.5,bS:-1.7,fU:.6,fF:1.6,bU:.6,bF:1.5,lean:2,dy:4},up2:{fT:.3,fS:-.5,bT:-.5,bS:-.6,fU:3.05,fF:.05,bU:.6,bF:1.4,lean:1,dy:-1},
 rush:{fT:1.1,fS:-.5,bT:-.9,bS:.4,fU:1.57,fF:0,bU:-.6,bF:.8,lean:5,dy:1},
 spin:{fT:.8,fS:-.6,bT:-.8,bS:.3,fU:1.6,fF:0,bU:-1.6,bF:0,lean:0,dy:0},
 counter:{fT:.6,fS:-.8,bT:-.6,bS:.2,fU:2.5,fF:1.2,bU:1.0,bF:1.6,lean:-2,dy:2},
 win:{fT:.2,fS:-.2,bT:-.2,bS:.1,fU:2.9,fF:.3,bU:2.9,bF:.3,lean:0,dy:0},
 shout:{fT:.4,fS:-.3,bT:-.4,bS:.2,fU:2.6,fF:.6,bU:.4,bF:1.4,lean:-1,dy:0}};

/* ---------------- moves ---------------- */
// frame: [dur,pose,hit?,ev?]   hit: {x,y,w,h,dmg,lvl,hs,bs,kb,kd,launch}
const N={
 sL:{f:[[3,'lp1'],[3,'lp2',{x:5,y:-20,w:11,h:5,dmg:35,hs:14,bs:9,kb:2}],[7,'lp1']],light:1},
 sH:{f:[[7,'hp1'],[4,'hp2',{x:5,y:-22,w:15,h:7,dmg:85,hs:20,bs:14,kb:4}],[16,'hp2']],heavy:1},
 cL:{f:[[4,'crouch'],[3,'cl',{x:4,y:-6,w:13,h:5,dmg:30,lvl:'l',hs:13,bs:8,kb:2}],[8,'crouch']],light:1,crouch:1},
 cH:{f:[[8,'crouch'],[4,'sweep',{x:3,y:-5,w:17,h:5,dmg:80,lvl:'l',kd:1,hs:20,bs:14,kb:2}],[22,'sweep']],heavy:1,crouch:1},
 jL:{f:[[3,'jump'],[40,'jl',{x:2,y:-9,w:11,h:9,dmg:45,lvl:'o',hs:15,bs:9,kb:2}]],air:1,light:1},
 jH:{f:[[6,'jh1'],[40,'jh2',{x:1,y:-16,w:15,h:14,dmg:80,lvl:'o',hs:18,bs:12,kb:3}]],air:1,heavy:1},
 throw:{f:[[3,'throw'],[3,'throw',{x:4,y:-22,w:8,h:20,grab:'throw'}],[18,'throw']]}};
function special(k,f){const c=f.c,dm=c.dm;
 switch(k){
 case 'yuan':return{f:[[10,'pw'],[4,'pr',null,o=>spawnProj(o,{k:'yuan',vx:3.2,dmg:70*dm,hs:16,bs:12,w:10,h:8,y:-21})],[20,'pr']],special:1};
 case 'slogan':return{f:[[8,'pw'],[4,'pr',null,o=>spawnProj(o,{k:'slogan',vx:4.6,dmg:55*dm,hs:14,bs:10,w:16,h:7,y:-22,txt:pick(['LAND REFORM!','SERVE THE PEOPLE!','DOWN WITH YOU!','READ THIS!'])})],[16,'pr']],special:1};
 case 'bomb':return{f:[[10,'pw'],[4,'pr',null,o=>spawnProj(o,{k:'bomb',vx:2.6,vy:-4.2,g:.2,dmg:85*dm,hs:18,bs:12,w:10,h:10,y:-24,kd:1})],[22,'pr']],special:1};
 case 'bills':return{f:[[10,'pw'],[4,'pr',null,o=>{for(let i=0;i<3;i++)spawnProj(o,{k:'bill',vx:2.6+i*.5,vy:-1+i*.6,dmg:40*dm,hs:12,bs:8,w:9,h:6,y:-24-i*6,multi:1})}],[20,'pr']],special:1};
 case 'grab':return{f:[[6,'throw'],[3,'throw',{x:4,y:-24,w:12,h:22,grab:'cmd'}],[26,'throw']],special:1};
 case 'rising':return{f:[[3,'up1',null,o=>{o.inv=8}],[12,'up2',{x:2,y:-36,w:12,h:30,dmg:120*dm,hs:30,bs:16,kd:1,launch:1},o=>{o.vy=-6.2;o.vx=o.dir*1;o.air=1;X.heavy()}],[30,'up2']],special:1,blade:1};
 case 'rect':return{f:[[3,'up1',null,o=>{o.inv=7}],[12,'up2',{x:2,y:-36,w:12,h:30,dmg:105*dm,hs:28,bs:16,kd:1,launch:1},o=>{o.vy=-5.8;o.vx=o.dir*.6;o.air=1;X.heavy()}],[28,'up2']],special:1};
 case 'spin':return{f:[[3,'up1',null,o=>{o.inv=6}],[8,'spin',{x:-8,y:-30,w:22,h:28,dmg:38*dm,hs:12,bs:8},o=>{o.vy=-4.6;o.vx=o.dir*1.4;o.air=1}],[8,'spin',{x:-8,y:-30,w:22,h:28,dmg:38*dm,hs:12,bs:8,re:1}],[8,'spin',{x:-8,y:-30,w:22,h:28,dmg:44*dm,hs:24,bs:8,kd:1,re:1}],[24,'jump']],special:1,spin:1};
 case 'leap':return{f:[[6,'up1'],[26,'jh1',{x:-4,y:-34,w:20,h:24,dmg:60*dm,hs:18,bs:10,kd:1},o=>{o.vy=-6;o.vx=o.dir*2.4;o.air=1;X.jump()}],[30,'jh2',null,o=>{}]],special:1,land:o=>{shake=10;SFX.stomp();dustAt(o.x,FY,14);hitArea(o,{x:-24,y:-10,w:48,h:12,dmg:90*o.c.dm,hs:22,bs:14,kd:1,lvl:'l'})}};
 case 'hammer':return{f:[[16,'jh1'],[5,'hp2',{x:4,y:-26,w:22,h:26,dmg:130*dm,hs:26,bs:18,kd:1,kb:5},o=>{shake=12;SFX.stomp()}],[26,'hp2']],special:1,armor:1};
 case 'rush':return{f:[[6,'pw'],[14,'rush',{x:4,y:-24,w:16,h:14,dmg:90*dm,hs:20,bs:14,kb:4},o=>{o.vx=o.dir*4.6;X.swing()}],[18,'rush',null,o=>{o.vx=0}]],special:1,blade:1};
 case 'slide':return{f:[[5,'crouch'],[16,'sweep',{x:2,y:-6,w:16,h:6,dmg:65*dm,lvl:'l',hs:18,bs:10,kb:2},o=>{o.vx=o.dir*4.2;X.roll()}],[16,'sweep',null,o=>{o.vx=0}]],special:1};
 case 'charge':return{f:[[8,'pw'],[18,'rush',{x:4,y:-28,w:14,h:24,dmg:110*dm,hs:22,bs:14,kb:6},o=>{o.vx=o.dir*4;o.armor=1;SFX.engine()}],[20,'rush',null,o=>{o.vx=0;o.armor=0}]],special:1};
 case 'line':return{f:[[6,'pw'],[14,'rush',{x:4,y:-24,w:14,h:12,dmg:95*dm,hs:20,bs:14,kb:4},o=>{o.vx=o.dir*4.4;o.armor=1}],[16,'rush',null,o=>{o.vx=0;o.armor=0}]],special:1};
 case 'withdraw':return{f:[[18,'jump',null,o=>{o.inv=16;o.vx=-o.dir*4.2;o.vy=-2.6;o.air=1;o.say('STRATEGIC WITHDRAWAL!');o.meter=Math.min(100,o.meter+8)}],[10,'idle']],special:1};
 case 'critique':return{f:[[26,'counter',null,o=>{o.counter={dmg:110*dm,line:'SELF-CRITICIZE!'}}],[14,'idle',null,o=>{o.counter=null}]],special:1};
 case 'supervise':return{f:[[26,'counter',null,o=>{o.counter={dmg:150*dm,line:'DESERTER!'}}],[16,'idle',null,o=>{o.counter=null}]],special:1};
 case 'defect':return{f:[[10,'shout',null,o=>{o.inv=18;o.say('DEFECTED!');puff(o.x,FY-60)}],[4,'idle',null,o=>{const t=o.opp;o.x=clamp(t.x-t.dir*32,camX+16,camX+W-16);o.dir=t.x>o.x?1:-1;puff(o.x,FY-60)}],[16,'idle']],special:1};
 }}
function superMove(f){const k=f.c.sp.sup,dm=f.c.dm;
 switch(k){
 case 'mtfk':return{f:[[4,'shout',null,o=>{o.inv=20;o.say('DIE! CCP MTFK!',1)}],[22,'rush',{x:4,y:-26,w:18,h:22,dmg:60*dm,hs:40,bs:16,sup:'flurry'},o=>{o.vx=o.dir*5.2}],[24,'rush',null,o=>{o.vx=0}]],special:1,blade:1,sup:1};
 case 'megaphone':return{f:[[18,'shout',null,o=>{o.say('THE PEOPLE HAVE SPOKEN!',1)}],[4,'pr',null,o=>{spawnProj(o,{k:'beam',vx:5.5,dmg:70*dm,hs:14,bs:10,w:40,h:22,y:-30,hits:5,sup:1})}],[30,'pr']],special:1,sup:1};
 case 'squad':return{f:[[6,'shout',null,o=>{o.say('FIRING SQUAD!',1)}],[4,'throw',{x:4,y:-26,w:20,h:24,grab:'squad'}],[30,'throw']],special:1,sup:1};
 case 'reform':return{f:[[16,'shout',null,o=>{o.say('LAND REFORM!',1)}],[4,'jh2',null,o=>{for(let i=0;i<5;i++)spawnProj(o,{k:'erupt',vx:0,x0:o.x+o.dir*(30+i*32),delay:i*8,dmg:62*dm,hs:16,bs:10,w:20,h:40,y:-40,life:40+i*8,sup:1})}],[34,'jh2']],special:1,sup:1};
 case 'devalue':return{f:[[8,'shout',null,o=>{o.say('YOUR VALUE: HALVED.',1)}],[4,'throw',{x:4,y:-28,w:22,h:28,grab:'devalue'}],[30,'throw']],special:1,sup:1};
 }}

/* ---------------- fighters ---------------- */
let F1=null,F2=null,projs=[],sparks=[],texts=[],hitstop=0,shake=0,slowmo=0,superFlash=null,mode='arcade',ladder=[],ladderI=0,round=1,timer=99,tTick=0,rState='',rT=0,crowd=[],cpuLv=1,cont=0,stats={wins:0,rw:0,rl:0};
function mkFighter(key,side,cpu,mir){const c=mir?posterOf(ROSTER[key]):ROSTER[key];return{key,c,side,cpu,x:side?SW/2+70:SW/2-70,y:FY,vx:0,vy:0,air:0,dir:side?-1:1,hp:c.hp,hpD:c.hp,max:c.hp,meter:0,wins:0,st:'stand',t:0,fi:0,ft:0,m:null,hitIds:new Set(),contact:0,inv:0,armor:0,counter:null,combo:0,comboDmg:0,emo:'normal',say(s,big){this.bubble={s,t:big?90:60,big}},bubble:null,inp:mkInput(),ai:{t:0,act:null},anim:0,opp:null,juggle:0,down:0}}
function mkInput(){return{h:{},p:{},hist:[]}}
const neutral=f=>['stand','walk','crouch'].includes(f.st);
function hurtbox(f){const s=f.c.sc;if(f.st==='down'||f.st==='ko')return null;const cr=f.st==='crouch'||f.st==='cblock'||(f.m&&f.m.crouch)||f.cr;const h=(cr?22:31)*s,w=7*s;return{x:f.x-w,y:f.y-h,w:w*2,h}}
function boxW(f,b){const s=f.c.sc;const x=f.dir>0?f.x+b.x*s:f.x-(b.x+b.w)*s;return{x,y:f.y+b.y*s,w:b.w*s,h:b.h*s}}
const ov=(a,b)=>a&&b&&a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
function startMove(f,m,name){f.m=m;f.mn=name;f.st='move';f.fi=0;f.ft=0;f.hitIds=new Set();f.contact=0;f.cr=m.crouch;if(m.f[0][3])m.f[0][3](f);if(m.special){f.meter=Math.min(100,f.meter+(m.sup?0:3))}if(!m.air)f.vx=0}
function spawnProj(o,p){if(p.k!=='erupt'&&p.k!=='bill'&&projs.some(q=>q.o===o&&!q.dead&&!q.multi&&!q.sup))return;projs.push(Object.assign({o,x:p.x0!=null?p.x0:o.x+o.dir*16*o.c.sc*.4,y:o.y+(p.y||-20)*o.c.sc*.9,vx:(p.vx||0)*o.dir,vy:p.vy||0,g:p.g||0,life:p.life||220,dead:false,hits:p.hits||1,hitT:0,t:0},p,{vx:(p.vx||0)*o.dir}));SFX.throw()}
function say(f,s){f.say(s)}
function puff(x,y){for(let i=0;i<16;i++)sparks.push({x,y:y+rnd()*40,vx:(rnd()-.5)*2,vy:(rnd()-.5)*2,l:20,c:'#c08aff',s:3})}
function dustAt(x,y,n){for(let i=0;i<n;i++)sparks.push({x:x+(rnd()-.5)*30,y:y-rnd()*4,vx:(rnd()-.5)*2,vy:-rnd()*1.5,l:20+rnd()*20,c:'rgba(160,140,120,.7)',s:3})}
function burst(x,y,big,col){const n=big?26:12;for(let i=0;i<n;i++){const a=rnd()*6.28,v=1+rnd()*(big?5:3);sparks.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:10+rnd()*12,c:rnd()<.5?(col||'#ffe27a'):'#fff',s:big?3:2})}
 sparks.push({ring:1,x,y,r:4,l:12,c:col||'#ffe27a'})}
function poseOf(f){if(f.st==='move'){const fr=f.m.f[f.fi];return PO[fr[1]]||PO.idle}
 switch(f.st){case 'walk':return(f.anim>>3)%2?PO.walk1:PO.walk2;case 'crouch':return PO.crouch;case 'jump':return PO.jump;case 'block':return PO.block;case 'cblock':return PO.cblock;case 'hit':return f.hl?PO.hurtL:PO.hurt;
 case 'fall':case 'down':case 'ko':return PO.hurt;case 'thrown':return PO.hurt;case 'win':return PO.win;case 'intro':return PO.shout;default:return(f.anim>>4)%2?PO.idle2:PO.idle}}
/* ---------------- drawing ---------------- */
function rot(a,l){return[Math.sin(a)*l,Math.cos(a)*l]}
function drawFighter(f){const c=f.c,s=c.sc,pc=(c.mirror?PAL.poster:PAL[c.fac])||PAL.civ,p=poseOf(f);const x=Math.round(f.x-camX),y=Math.round(f.y);
 ctx.save();ctx.translate(x,y);if(f.st==='down'||f.st==='ko'&&!f.air){ctx.translate(0,-2);ctx.rotate(-f.dir*Math.PI/2);ctx.translate(0,-6*s)}else if(f.st==='fall'||f.st==='ko'){ctx.rotate(-f.dir*clamp(f.t/12,0,1)*1.2)}else if(f.m&&f.m.spin&&f.fi>0&&f.fi<4)ctx.scale(Math.cos(f.ft*.8)>0?1:-1,1);
 ctx.scale(f.dir*s,s);
 const flash=f.flash>0&&T%2;const U=flash?'#fff':pc.u,D=flash?'#ddd':pc.d,Pn=flash?'#eee':pc.p;
 const hip=[0,-8+p.dy],sh=[p.lean,-16+p.dy];
 const leg=(T_,S_,col,off)=>{const k=[hip[0]+off+rot(T_,4.2)[0],hip[1]+rot(T_,4.2)[1]],ft=[k[0]+rot(T_+S_,4.2)[0],k[1]+rot(T_+S_,4.2)[1]];seg(hip[0]+off,hip[1],k[0],k[1],3.2,col);seg(k[0],k[1],ft[0],ft[1],3,col);r(ft[0]-1.5,ft[1]-1.4,4,2,BOOT);r(k[0]-1.5,k[1]-.5,3,1,pc.p)};
 const arm=(U_,F_,col,off)=>{const s0=[sh[0]+off,sh[1]+1],e=[s0[0]+rot(U_,3.8)[0],s0[1]+rot(U_,3.8)[1]],h=[e[0]+rot(U_+F_,3.6)[0],e[1]+rot(U_+F_,3.6)[1]];seg(s0[0],s0[1],e[0],e[1],2.8,col);seg(e[0],e[1],h[0],h[1],2.6,col);r(h[0]-1.5,h[1]-1.5,3,3,SK);return[h,U_+F_]};
 leg(p.bT,p.bS,D,-1.5);arm(p.bU,p.bF,D,-1.5);
 // back items
 if(c.key==='printer'||f.key==='printer'){r(-9+p.lean*.5,-22+p.dy,7,9,'#a08a5a');r(-8+p.lean*.5,-23+p.dy,5,1,'#7a6a42')}
 leg(p.fT,p.fS,U,1.5);
 seg(hip[0],hip[1]-1,sh[0],sh[1]+2,10,U);seg(hip[0],hip[1]-1,sh[0],sh[1]+2,1,D);r(hip[0]-5,hip[1]-2,10,1.6,BELT);r(hip[0]-1,hip[1]-2,2,1.6,'#d9a441');
 if(f.key==='million'){r(sh[0]-1,sh[1]+4,3,3,'#ffd24a');r(sh[0]-6,sh[1]+3,3,4,'#c8372d')}
 if(c.officer){r(sh[0]-5,sh[1]-1,3,1.2,'#d9a441');r(sh[0]+2,sh[1]-1,3,1.2,'#d9a441')}
 // head
 ctx.save();ctx.translate(sh[0]-8,sh[1]+13+(f.st==='hit'?1:0));chibiHead(f.emo,(T+f.side*90)%200<6);cap(c.fac==='uni'?'civ':c.fac);if(c.fac==='uni'){r(1,-31,14,4,'#4a2a5a');r(3,-32,10,1,'#6a4a80');r(7,-30,3,2,'#d9a441')}ctx.restore();
 const[hand,ang]=arm(p.fU,p.fF,U,1.5);
 if(c.wpn==='dadao'){const bl=f.m&&f.m.blade?11:8,[dx,dy]=rot(ang,1);seg(hand[0],hand[1],hand[0]+dx*2,hand[1]+dy*2,1.5,'#4a2a18');seg(hand[0]+dx*2,hand[1]+dy*2,hand[0]+dx*bl,hand[1]+dy*bl,2.2,f.key==='ma'&&f.hp<f.max*.3&&T%4<2?'#ffb04a':'#d8d8d8')}
 if(f.key==='red'&&!(f.m&&f.m.f[f.fi][1]==='pr')){const b=[sh[0]-2,sh[1]+6];r(b[0]-1,b[1],5,3,'#c8372d');r(b[0]+3,b[1]-1,2,5,'#e0302a')}
 if(f.counter){ctx.globalAlpha=.4+Math.sin(T*.5)*.2;r(-10,-34+p.dy,22,34,'#ffd24a');ctx.globalAlpha=1}
 ctx.restore();
 if(f.armor&&T%4<2){ctx.globalAlpha=.3;r(x-10*s,y-30*s,20*s,30*s,'#ff8a3a');ctx.globalAlpha=1}}
function drawProj(q){const x=q.x-camX,y=q.y;
 if(q.k==='yuan'){for(let i=0;i<3;i++){const fl=Math.sin(q.t*.5+i)*3;r(x-10+i*2,y-6+i*3+fl,18,6,i%2?'#b0a070':'#8aa070');r(x-9+i*2,y-5+i*3+fl,4,4,'#d9a441')}txt('¥',x-1,y-5,'#d9a441','center')}
 else if(q.k==='slogan'){const sl=tr(q.txt);ctx.font=fontFor(sl);const w=ctx.measureText(sl).width+8;r(x-w/2,y-7,w,14,'#b8322a');r(x-w/2,y-7,w,2,'#f1d27a');txt(sl,x,y-4,'#f1d27a','center')}
 else if(q.k==='bomb'){r(x-2,y-6,4,7,WOOD);r(x-4,y-11,8,6,'#3a4030');if(T%4<2)r(x,y+2,2,2,'#ffb04a')}
 else if(q.k==='bill'){const fl=Math.abs(Math.sin(q.t*.4))*6+1;r(x-7,y-fl/2,14,fl,'#8aa070');r(x-2,y-1,4,2,'#d9a441')}
 else if(q.k==='beam'){ctx.globalAlpha=.85;r(x-30,y-16,60,32,'#b8322a');r(x-30,y-16,60,3,'#f1d27a');ctx.globalAlpha=1;stxt('人民!',x,y,'#f1d27a',18)}
 else if(q.k==='erupt'){if(q.t<q.delay)return;const h=Math.min(70,(q.t-q.delay)*8);for(let i=0;i<8;i++)r(x-10+i*2.5,FY-h+(i%3)*6,3,h,i%2?'#ff8a1a':'#ffd24a');txt('土改',x,FY-h-12,'#f1d27a','center')}}

/* ---------------- input ---------------- */
const kb={},tch={};let stickV={x:0,y:0};
const K1={KeyA:'l',KeyD:'r',KeyW:'u',KeyS:'d',KeyJ:'L',KeyK:'H',KeyL:'S',KeyI:'X',KeyU:'X',Space:'u'};
const K2={ArrowLeft:'l',ArrowRight:'r',ArrowUp:'u',ArrowDown:'d',Numpad1:'L',Numpad2:'H',Numpad3:'S',Numpad0:'X',Comma:'L',Period:'H',Slash:'S',Semicolon:'X'};
const K1alt={ArrowLeft:'l',ArrowRight:'r',ArrowUp:'u',ArrowDown:'d',KeyZ:'L',KeyX:'H',KeyC:'S',KeyV:'X'};
const keysP={1:{},2:{}},latch={1:{},2:{}};
function readHuman(f,n){const src=keysP[n],lt=latch[n],h={};for(const k of['l','r','u','d','L','H','S','X']){h[k]=!!(src[k]||lt[k]);lt[k]=0}
 if(n===1&&(stickV.x||stickV.y)){h.l=h.l||stickV.x<-.35;h.r=h.r||stickV.x>.35;h.u=h.u||stickV.y<-.5;h.d=h.d||stickV.y>.45}
 if(n===1)for(const k of['L','H','S','X'])h[k]=h[k]||!!tch[k];return h}
function updInput(f,h){const i=f.inp;i.p={};for(const k in h)if(h[k]&&!i.h[k])i.p[k]=1;i.h=h;const fw=f.dir>0?h.r:h.l,bk=f.dir>0?h.l:h.r;const d=5+(h.u?3:0)-(h.d?3:0)+(fw?1:0)-(bk?1:0);i.dirn=d;i.hist.push(d);if(i.hist.length>24)i.hist.shift()}
function motion(f,seq,win=16){const h=f.inp.hist.slice(-win);let j=0;for(const d of h){if(d===seq[j])j++;if(j===seq.length)return true}return false}

/* ---------------- CPU ---------------- */
function cpuInput(f){const o=f.opp,a=f.ai,h={};const d=Math.abs(o.x-f.x),fw=f.dir>0?'r':'l',bk=f.dir>0?'l':'r';a.t--;const lv=cpuLv;
 const react=Math.max(4,16-lv*3);
 if(o.st==='move'&&o.m&&!o.m.special&&d<90&&neutral(f)&&rnd()<.18+lv*.12){a.act={k:'block',t:react+12,low:o.m.crouch}}
 if(o.st==='move'&&o.m&&o.m.special&&d<120&&neutral(f)&&rnd()<.1+lv*.1)a.act={k:'block',t:20,low:o.m.f.some(fr=>fr[2]&&fr[2].lvl==='l')};
 if(projs.some(q=>q.o===o&&!q.dead&&Math.abs(q.x-f.x)<90&&Math.sign(q.vx)===Math.sign(f.x-q.x))&&neutral(f)&&rnd()<.12+lv*.06)a.act=rnd()<.5?{k:'block',t:24}:{k:'jumpf',t:4};
 if(o.air&&o.vy>-2&&d<70&&neutral(f)&&rnd()<.04+lv*.05)a.act={k:'aa',t:3};
 if(a.t<=0&&(!a.act||a.act.t<=0)){a.t=react+rnd()*20|0;
  const r_=rnd();
  if(f.meter>=100&&d<110&&r_<.25)a.act={k:'super',t:3};
  else if(d>150){a.act=r_<.35&&f.c.sp.proj!=='grab'?{k:'proj',t:3}:r_<.5?{k:'jumpf',t:4}:{k:'walk',t:30}}
  else if(d<44){a.act=r_<.28?{k:'L',t:3}:r_<.48?{k:'H',t:3}:r_<.6?{k:'cH',t:3}:r_<.7?{k:'throw',t:3}:r_<.78&&f.c.sp.proj==='grab'?{k:'proj',t:3}:r_<.86?{k:'jumpb',t:4}:{k:'block',t:20}}
  else{a.act=r_<.4?{k:'walk',t:20}:r_<.55?{k:'fwd',t:3}:r_<.7?{k:'jumpf',t:4}:r_<.8&&f.c.sp.proj!=='grab'?{k:'proj',t:3}:{k:'back',t:16}}}
 const A=a.act;if(A){A.t--;
  switch(A.k){case 'block':h[bk]=1;if(A.low)h.d=1;break;case 'walk':h[fw]=1;break;case 'back':h[bk]=1;break;case 'jumpf':h.u=1;h[fw]=1;break;case 'jumpb':h.u=1;h[bk]=1;break;
   case 'L':h.L=1;break;case 'H':h.H=1;break;case 'cH':h.d=1;h.H=A.t<2;break;case 'throw':h[fw]=1;h.H=1;break;case 'proj':h.S=1;break;case 'fwd':h[fw]=1;h.S=1;break;case 'aa':h.d=1;h.S=1;break;case 'super':h.X=1;break}
  if(A.t<=0)a.act=null}
 if(f.air&&d<60&&f.y<FY-30&&rnd()<.2)h.H=1;
 if(f.contact&&f.st==='move'&&f.m&&f.m.light&&rnd()<.3+lv*.15)h.H=1;
 if(f.contact&&f.st==='move'&&f.m&&f.m.heavy&&rnd()<.15+lv*.12){h.S=1;h[fw]=rnd()<.5}
 return h}

/* ---------------- fighter update ---------------- */
function act(f){const i=f.inp,p=i.p,h=i.h,o=f.opp;
 const can=neutral(f)||(f.st==='move'&&f.contact&&f.m&&!f.m.special&&f.fi>=1);
 const sup=p.X||(p.S&&p.H&&h.S&&h.H);
 if(sup&&f.meter>=100&&(neutral(f)||can)){f.meter=0;startMove(f,superMove(f),'super');superFlash={f,t:0};SFX.alarm();return true}
 const close=Math.abs(o.x-f.x)<26*f.c.sc/2.6+8&&!o.air&&o.st!=='down';
 if(p.L||p.H){if(motion(f,[2,3,6])&&(neutral(f)||can)){startMove(f,special(f.c.sp.proj,f),'proj');return true}
  if(motion(f,[6,2,3])&&(neutral(f)||can)){startMove(f,special(f.c.sp.aa,f),'aa');return true}
  if(motion(f,[2,1,4])&&(neutral(f)||can)){startMove(f,special(f.c.sp.back,f),'back');return true}}
 if(p.S&&(neutral(f)||can)){const d=i.dirn,k=d<=3?'aa':d===6||d===9?'fwd':d===4||d===7?'back':'proj';startMove(f,special(f.c.sp[k],f),k);return true}
 if(!neutral(f)){if(f.st==='move'&&f.contact&&f.m.light&&p.H&&!f.m.air){startMove(f,f.m.crouch?N.cH:N.sH,'chain');return true}return false}
 if(p.H&&close&&(i.dirn===6||i.dirn===4)){startMove(f,N.throw,'throw');f.throwBack=i.dirn===4;return true}
 if(p.L){startMove(f,h.d?N.cL:N.sL,'L');X.swing();return true}
 if(p.H){startMove(f,h.d?N.cH:N.sH,'H');X.heavy();return true}
 return false}
function updFighter(f){const o=f.opp,i=f.inp,h=i.h;f.anim++;f.t++;if(f.inv>0)f.inv--;if(f.flash>0)f.flash--;if(f.bubble&&--f.bubble.t<=0)f.bubble=null;if(f.hpD>f.hp)f.hpD-=3;else f.hpD=f.hp;
 if(!f.air&&neutral(f))f.dir=o.x>f.x?1:-1;
 const fw=f.dir>0?h.r:h.l,bk=f.dir>0?h.l:h.r;f.blocking=false;
 switch(f.st){
 case 'stand':case 'walk':case 'crouch':{if(rState!=='fight')break;if(act(f))break;
  if(h.u){f.st='jump';f.air=1;f.vy=-6.3;f.vx=(fw?1:bk?-1:0)*f.dir*2.3*(f.c.spd/1.5);SFX.jump();break}
  if(h.d){f.st='crouch';f.vx=0;f.blocking=bk}else if(fw||bk){f.st='walk';f.vx=(fw?1:-.75)*f.dir*f.c.spd;f.blocking=bk}else{f.st='stand';f.vx=0}break}
 case 'jump':{if(rState==='fight'&&!f.jAtk&&(i.p.L||i.p.H)){f.jAtk=1;const m=i.p.H?N.jH:N.jL;const vx=f.vx,vy=f.vy;startMove(f,m,'j');f.vx=vx;f.vy=vy;f.air=1}break}
 case 'move':{const m=f.m,fr=m.f[f.fi];
  if(fr[2]){const hb=fr[2];if(hb.re&&f.ft===0)f.hitIds=new Set();if(!f.hitIds.has(o.id)){const b=boxW(f,hb);if(hb.grab){if(ov(b,hurtbox(o))&&!o.air&&o.st!=='hit'&&o.st!=='block'&&!o.inv&&o.st!=='down')doGrab(f,o,hb.grab)}else if(ov(b,hurtbox(o)))doHit(f,o,hb,false)}}
  if(f.st!=='move')break;f.ft++;
  if(m.air&&!f.air){f.st='stand';f.m=null;f.jAtk=0;break}
  if(f.ft>=fr[0]){f.fi++;f.ft=0;if(f.fi>=m.f.length){f.m=null;f.st=f.air?'jump':'stand';f.cr=0;f.armor=0;f.counter=null;break}const nf=m.f[f.fi];if(nf[3])nf[3](f)}
  act(f);break}
 case 'hit':case 'block':case 'cblock':{f.vx*=.85;if(f.t>=f.stun){f.st=f.air?'fall':'stand';f.combo=f.st==='stand'?0:f.combo}break}
 case 'fall':{if(!f.air){f.st='down';f.t=0;SFX.land();dustAt(f.x,FY,8);shake=Math.max(shake,4)}break}
 case 'down':{f.vx=0;if(f.t>=(f.hp<=0?9999:46)){f.st='stand';f.inv=10;f.combo=0;f.juggle=0}break}
 case 'thrown':break;
 case 'ko':if(!f.air)f.vx*=.88;break;
 case 'win':case 'intro':break}
 // physics
 if(f.st!=='thrown'){f.x+=f.vx;if(f.air){f.y+=f.vy;f.vy+=.32;if(f.y>=FY){f.y=FY;f.air=0;f.vy=0;f.jAtk=0;if(f.st==='jump'){f.st='stand';SFX.land()}if(f.st==='move'&&f.m&&f.m.land){const L_=f.m.land;f.m.land=null;L_(f)}if(f.st==='move'&&f.m&&!f.m.air&&f.fi<f.m.f.length-1&&(f.m.f[f.fi][1]==='up2'||f.m.f[f.fi][1]==='spin'||f.m.f[f.fi][1]==='jh2'||f.m.f[f.fi][1]==='jump')){f.fi=f.m.f.length-1;f.ft=0}if(f.st!=='move'&&f.st!=='fall'&&f.st!=='ko')f.vx=0}}}
 f.x=clamp(f.x,Math.max(12,camX+12),Math.min(SW-12,camX+W-12))}
function blockOK(f,lvl){const h=f.inp.h,bk=f.dir>0?h.l:h.r;if(!bk||f.air)return false;if(!(neutral(f)||f.st==='block'||f.st==='cblock'))return false;if(lvl==='l'&&!h.d)return false;if(lvl==='o'&&h.d)return false;return true}
function hitArea(o,hb){const d=o.opp;if(ov(boxW(o,hb),hurtbox(d))&&!d.air)doHit(o,d,hb,false)}
function doHit(a,d,hb,proj){if(d.inv>0||d.st==='down'||d.st==='ko'||d.st==='thrown')return false;a.hitIds.add(d.id);
 if(d.counter&&!proj){const c=d.counter;d.counter=null;d.say(c.line);d.fi=d.m.f.length-1;d.ft=0;X.parry();burst(d.x,d.y-60,true,'#ffd24a');applyDmg(d,a,c.dmg,{hs:30,kd:1,kb:5},true);return true}
 const lvl=hb.lvl||'m';
 if(blockOK(d,lvl)){d.st=d.inp.h.d?'cblock':'block';d.t=0;d.stun=hb.bs||10;d.vx=-d.dir*(hb.kb||2)*.8;const chip=(a.m&&a.m.special)||proj?Math.round(hb.dmg*.18):0;d.hp=Math.max(1,d.hp-chip);a.meter=Math.min(100,a.meter+3);d.meter=Math.min(100,d.meter+4);
  X.block();burst((a.x+d.x)/2,d.y-20*d.c.sc,false,'#9fd3ff');hitstop=6;a.contact=1;return true}
 if(d.armor&&!proj){d.armor=0;d.flash=6;applyDmgRaw(d,Math.round(hb.dmg*.5));X.clang();hitstop=6;a.contact=1;return true}
 applyDmg(a,d,hb.dmg,hb,false);a.contact=1;
 if(hb.sup==='flurry'){runFlurry(a,d)}return true}
function applyDmgRaw(d,n){d.hp=Math.max(0,d.hp-n);if(d.hp<=0)ko(d)}
function applyDmg(a,d,dmg,hb,crit){const scale=Math.max(.35,1-d.combo*.1),ch=d.st==='move'&&d.ft<4&&d.fi<2;let n=Math.round(dmg*scale*(ch?1.2:1));
 d.combo++;d.comboDmg=(d.combo===1?0:d.comboDmg)+n;d.hp=Math.max(0,d.hp-n);d.flash=8;d.m=null;d.counter=null;d.armor=0;d.cr=0;
 a.meter=Math.min(100,a.meter+(a.m&&a.m.sup?0:6));d.meter=Math.min(100,d.meter+5);
 const big=n>=80;burst((a.x*.3+d.x*.7),d.y-20*d.c.sc,big);X.flesh();(big?SFX.hit:X.swing)();hitstop=big?11:7;shake=Math.max(shake,big?8:3);
 if(ch&&d.combo===1)texts.push({s:'COUNTER',x:d.x,y:d.y-110,t:0,c:'#ff8a3a'});
 if(d.combo>=2)d.comboShow={n:d.combo,t:90,side:d.side};
 for(const c_ of crowd)c_.cheer=30;
 if(d.air||hb.kd||hb.launch||d.hp<=0){d.st='fall';d.air=1;d.vy=hb.launch?-6:-3.6;d.vx=-d.dir*(hb.kb||2.5)*.9;d.t=0;d.juggle++}
 else{d.st='hit';d.t=0;d.stun=hb.hs||14;d.vx=-d.dir*(hb.kb||2);d.hl=hb.lvl==='l'}
 if(d.hp<=0)ko(d)}
function doGrab(a,d,kind){a.hitIds.add(d.id);d.m=null;const dm={throw:110,cmd:200,squad:380,devalue:0}[kind]*a.c.dm;
 a.fi=a.m.f.length-1;a.ft=0;d.st='thrown';d.t=0;a.grabbing={d,kind,t:0,dm};
 if(kind==='squad'||kind==='devalue'){superFlash={f:a,t:0}}SFX.hit()}
function updGrab(a){const g=a.grabbing;if(!g)return;g.t++;const d=g.d;
 if(g.kind==='squad'){d.x=a.x+a.dir*30;if(g.t%10===0&&g.t<60){SFX.shot();burst(d.x,d.y-40-rnd()*30,false)}if(g.t===70){a.grabbing=null;d.combo=0;applyDmg(a,d,g.dm,{kd:1,kb:4},false)}return}
 if(g.kind==='devalue'){d.x=a.x+a.dir*34;if(g.t===40){a.grabbing=null;const n=Math.round(d.hp*.5);d.hp-=n;texts.push({s:'-50% VALUE',x:d.x,y:d.y-120,t:0,c:'#d9a441'});for(let i=0;i<30;i++)sparks.push({x:d.x+(rnd()-.5)*40,y:d.y-rnd()*90,vx:(rnd()-.5)*2,vy:-rnd()*2,l:40,c:'#8aa070',s:3});d.st='fall';d.air=1;d.vy=-4;d.vx=-d.dir*2;d.t=0;if(d.hp<=0)ko(d)}return}
 const k=Math.min(1,g.t/14);const back=a.throwBack&&g.kind==='throw';d.x=a.x+a.dir*(back?-1:1)*lerpN(20,40,k);d.y=FY-Math.sin(k*Math.PI)*40;
 if(g.t===16){a.grabbing=null;d.y=FY;d.combo=0;applyDmg(a,d,g.dm,{kd:1,kb:3},false);shake=10;SFX.stomp();if(back)a.dir*=-1}}
const lerpN=(a,b,t)=>a+(b-a)*t;
function runFlurry(a,d){a.flurry={d,t:0};a.vx=0}
function updFlurry(a){const fl=a.flurry;if(!fl)return;fl.t++;const d=fl.d;d.st='hit';d.t=0;d.stun=99;d.x=a.x+a.dir*34;a.vx=0;
 if(fl.t%6===0&&fl.t<48){applyDmgSilent(a,d,32*a.c.dm);X.swing()}if(fl.t===52){a.flurry=null;d.combo=0;applyDmg(a,d,90*a.c.dm,{kd:1,kb:5,launch:1},false);a.say('...SORRY. REFLEX.')}}
function applyDmgSilent(a,d,n){n=Math.round(n);d.hp=Math.max(1,d.hp-n);d.flash=4;d.combo++;d.comboShow={n:d.combo,t:90,side:d.side};burst(d.x,d.y-60-rnd()*30,false);hitstop=3;shake=Math.max(shake,4)}
function ko(d){if(rState!=='fight')return;rState='ko';rT=0;slowmo=60;d.st='ko';d.air=1;d.vy=-5;d.vx=-d.dir*3;const w=d.opp;texts.push({s:'',x:0,y:0,t:0});SFX.die();music('off')}
function updProjs(){for(const q of projs){if(q.dead)continue;q.t++;q.life--;if(q.k==='erupt'){if(q.t<q.delay)continue;if(q.t===q.delay)SFX.boom();}else{q.x+=q.vx;q.y+=q.vy;q.vy+=q.g}
 if(q.k==='bomb'&&q.y>=FY-6){q.dead=true;SFX.boom();burst(q.x,FY-10,true,'#ff8a1a');shake=8;const d=q.o.opp;if(Math.abs(d.x-q.x)<36&&!d.air)hitByProj(q,d);continue}
 if(q.life<=0||q.x<camX-40||q.x>camX+W+40){q.dead=true;continue}
 const d=q.o.opp,b=q.k==='erupt'?{x:q.x-10,y:FY-70,w:20,h:70}:{x:q.x-q.w*1.2,y:q.y-q.h*1.2,w:q.w*2.4,h:q.h*2.4};
 for(const o of projs)if(o!==q&&!o.dead&&o.o!==q.o&&o.k!=='erupt'&&q.k!=='erupt'&&Math.abs(o.x-q.x)<16&&Math.abs(o.y-q.y)<20){o.dead=true;q.hits--;burst(q.x,q.y,false,'#fff');if(q.hits<=0)q.dead=true}
 if(q.dead)continue;
 if(q.hitT>0){q.hitT--;continue}
 if(ov(b,hurtbox(d)))hitByProj(q,d)}
 projs=projs.filter(q=>!q.dead)}
function hitByProj(q,d){const a=q.o;const fake={hitIds:new Set(),m:{special:1}};if(d.inv>0||d.st==='down')return;
 const hb={dmg:q.dmg,hs:q.hs,bs:q.bs,kb:2.5,kd:q.kd,lvl:q.lvl};
 if(blockOK(d,hb.lvl)){d.st=d.inp.h.d?'cblock':'block';d.t=0;d.stun=q.bs;d.vx=-d.dir*1.6;d.hp=Math.max(1,d.hp-Math.round(q.dmg*.18));X.block();burst(q.x,q.y,false,'#9fd3ff');hitstop=5}
 else{const m=a.m;a.m=m||null;applyDmg(a,d,q.dmg,hb,false)}
 q.hits--;q.hitT=8;if(q.hits<=0)q.dead=true}

/* ---------------- rounds & flow ---------------- */
let selCur=[0,1],selDone=[false,false],selStep=0,vsT=0,endT=0,result=null,scene=null;
let stageK='village';function setStage(k){const st=STAGES[k];stageK=k;L.theme=st.theme;L.weather=st.weather;L.walls=st.bare?[]:[90,330,520];LV=Object.keys(STAGES).indexOf(k);buildBG();if(st.bare)BGD.fg=[];crowd=[];const R_=seeded(7+LV);for(let i=0;i<14;i++)crowd.push({x:30+i*45+R_()*20,k:R_()<.5?'civ':R_()<.5?'kmt':'ccp',ph:R_()*6,cheer:0,hat:pick(['straw','cap','none'])})}
function startMatch(p1,p2,cpu2,stage,mir){F1=mkFighter(p1,0,false);F2=mkFighter(p2,1,cpu2,mir);F1.id=1;F2.id=2;F1.opp=F2;F2.opp=F1;F1.wins=0;F2.wins=0;round=1;setStage(stage||ROSTER[p2].stage);startRound();state='fight';$('#hud').hidden=false;if(touchUI)$('#touch').hidden=false}
function startRound(){for(const f of[F1,F2]){f.x=f.side?SW/2+70:SW/2-70;f.y=FY;f.vx=f.vy=0;f.air=0;f.hp=f.max;f.hpD=f.max;f.st='intro';f.m=null;f.combo=0;f.dir=f.side?-1:1;f.inv=0;f.armor=0;f.counter=null;f.grabbing=null;f.flurry=null;f.t=0}
 camX=SW/2-W/2;projs=[];sparks=[];timer=99;tTick=0;rState='intro';rT=0;slowmo=0;music(F2.c.boss===2?'final':F2.c.boss?'boss':pick(['m5','m1','m2']));
 if(round===1){F1.say(pick(F1.c.quotes));setTimeout(()=>{if(F2)F2.say(pick(F2.c.quotes))},900)}}
function updRound(){rT++;
 if(rState==='intro'){if(rT===100){rState='fight';for(const f of[F1,F2])f.st='stand';SFX.alarm()}return}
 if(rState==='fight'){if(++tTick>=50){tTick=0;timer--;if(timer<=0){rState='time';rT=0;music('off')}}return}
 if(rState==='ko'||rState==='time'){if(rT===100){const w=F1.hp===F2.hp?null:F1.hp>F2.hp?F1:F2;if(w){w.wins++;w.st='win';w.say(pick(w.c.quotes))}if(mode==='arcade'){if(w===F1)stats.rw++;else if(w===F2)stats.rl++}result=w;if(rState==='ko'&&w&&w.hp===w.max)texts.push({s:'PERFECT',x:-1,y:0,t:0,c:'#ffd24a'})}
  if(rT===220){if(F1.wins>=2||F2.wins>=2)return endMatch();round++;startRound()}}}
function endMatch(){const p1won=F1.wins>=2;if(mode==='arcade'){if(p1won){ladderI++;stats.wins++;if(ladderI>=ladder.length){state='ending';endT=0;const q=endingFor(F1.key);scene={sc:q.shift(),t:0,q};music('ending');return}toStory();return}state='continue';endT=0;music('off');return}
 state='result';endT=0}
function nextArcade(){const L_=curL();startMatch(F1.key,L_.k,true,L_.stage,L_.mir);cpuLv=Math.min(4,1+ladderI*.6)}
function toStory(){state='story';camX=0;scene={sc:storyOf(curL()),t:0};music('m3')}
function update(){T++;
 if(state==='select'){updSelect();return}
 if(state==='story'){scene.t++;if(scene.t%3===0&&scene.t<400&&!scene.done)SFX.type();if(scene.t>40&&anyPress()){if(!scene.done){scene.t=9999;scene.done=1}else{state='vs';vsT=0}}return}
 if(state==='vs'){vsT++;if(vsT>160||(vsT>40&&anyPress()))nextArcade();return}
 if(state==='continue'){endT++;if(endT>40&&anyPress(true)){cont++;nextArcade()}if(endT>600)toTitle();return}
 if(state==='result'){endT++;if(endT>60&&anyPress())openSelect(mode);return}
 if(state==='ending'){scene.t++;if(scene.t%3===0&&scene.t<500)SFX.type();if(scene.t>60&&anyPress()){if(!scene.done){scene.t=9999;scene.done=1}else if(scene.q&&scene.q.length)scene={sc:scene.q.shift(),t:0,q:scene.q};else toTitle()}return}
 if(state!=='fight')return;
 if(superFlash){superFlash.t++;if(superFlash.t>40)superFlash=null;else return}
 if(hitstop>0){hitstop--;return}
 if(slowmo>0){slowmo--;if(slowmo%3)return}
 updRound();
 for(const f of[F1,F2])updInput(f,f.cpu?cpuInput(f):readHuman(f,f===F1?1:2));
 for(const f of[F1,F2])if(!f.grabbing&&!f.flurry)updFighter(f);for(const f of[F1,F2]){updGrab(f);updFlurry(f)}
 // push apart
 const dx=F2.x-F1.x,md=(F1.c.sc+F2.c.sc)*7;if(Math.abs(dx)<md&&Math.abs(F1.y-F2.y)<50&&F1.st!=='thrown'&&F2.st!=='thrown'&&!F1.grabbing&&!F2.grabbing){const push=(md-Math.abs(dx))/2,s=dx>=0?1:-1;F1.x-=push*s;F2.x+=push*s}
 for(const f of[F1,F2])f.x=clamp(f.x,12,SW-12);
 updProjs();
 const tx=(F1.x+F2.x)/2-W/2;camX+=(clamp(tx,0,SW-W)-camX)*.15;
 for(const s of sparks){if(s.ring){s.r+=3;s.l--;continue}s.x+=s.vx;s.y+=s.vy;s.vy+=.12;s.l--}sparks=sparks.filter(s=>s.l>0);
 for(const t of texts)t.t++;texts=texts.filter(t=>t.t<70);
 if(shake>0)shake*=.85;if(shake<.4)shake=0;
 for(const f of[F1,F2]){f.emo=f.st==='ko'||f.st==='down'&&f.hp<=0?'dead':f.st==='hit'||f.st==='fall'||f.st==='thrown'?'hurt':f.st==='block'||f.st==='cblock'?'grit':f.st==='win'?'happy':f.bubble||f.st==='move'&&f.m&&f.m.heavy||f.st==='move'&&f.m&&f.m.special?'shout':f.st==='move'?'grit':f.hp<f.max*.25?'scared':'determined';if(f.comboShow&&--f.comboShow.t<=0)f.comboShow=null}}
function anyPress(cont_){const h1=readHuman(F1||{},1);const any=h1.L||h1.H||h1.S||h1.u||kb.Enter||kb.Space;const r_=any&&!anyPress.prev;anyPress.prev=any;return r_}
function toTitle(){state='title';F1=F2=null;$('#title').hidden=false;$('#hud').hidden=true;$('#touch').hidden=true;music('off')}

/* ---------------- select screen ---------------- */
function openSelect(m){mode=m;state='select';selStep=0;selCur=[0,1];selDone=[false,false];$('#title').hidden=true;$('#hud').hidden=false;if(touchUI)$('#touch').hidden=false;music('m3');selPrev={}}
let selPrev={};
function edge(n,k,v){const id=n+k;const r_=v&&!selPrev[id];selPrev[id]=v;return r_}
function updSelect(){const h1=readHuman({},1),h2=readHuman({},2);
 const mv=(n,h)=>{const lk=n===0&&p1Locked();const step=d=>{let c=selCur[n];do c=(c+d+4)%4;while(lk&&!P1OK(c));selCur[n]=c;SFX.tally()};if(edge(n,'l',h.l))step(-1);if(edge(n,'r',h.r))step(1)};
 if(p1Locked()&&!P1OK(selCur[0]))selCur[0]=CAST.findIndex(k=>ROSTER[k].fac==='kmt');
 if(mode==='2p'){if(!selDone[0])mv(0,h1);if(!selDone[1])mv(1,h2);if(edge(0,'L',h1.L||h1.H)&&!selDone[0]&&P1OK(selCur[0])){selDone[0]=true;SFX.pick()}if(edge(1,'L',h2.L||h2.H)&&!selDone[1]){selDone[1]=true;SFX.pick()}
  if(selDone[0]&&selDone[1]){mode='2p';startMatch(CAST[selCur[0]],CAST[selCur[1]],false)}return}
 const n=selStep;mv(0,h1);if(edge(0,'L',h1.L||h1.H||h1.S)&&(!p1Locked()||P1OK(selCur[0]))){SFX.pick();
  if(mode==='arcade'){const me=CAST[selCur[0]];ladder=mkLadder(me);ladderI=0;stats={wins:0,rw:0,rl:0};cont=0;F1=mkFighter(me,0,false);toStory();return}
  if(selStep===0){selDone[0]=CAST[selCur[0]];selStep=1;selCur[0]=CAST.findIndex(k=>ROSTER[k].fac!=='kmt');return}
  startMatch(selDone[0],CAST[selCur[0]],true);cpuLv=2.5}}
function selTap(x,y){if(state!=='select')return;const i=Math.floor((x-32)/80);if(y>40&&y<150&&i>=0&&i<4){if(p1Locked()&&!P1OK(i)){selNo=90;X.block();return}if(selCur[0]===i){latch[1].L=1}else{selCur[0]=i;SFX.tally()}}}
let selNo=0;

/* ---------------- render ---------------- */
function drawCrowd(){for(const c of crowd){const x=c.x-camX*.85;if(x<-20||x>W+20)continue;const y=GY-1+(c.cheer>0?-Math.abs(Math.sin(T*.4+c.ph))*4:Math.sin(T*.05+c.ph));if(c.cheer>0)c.cheer--;
 ctx.save();ctx.translate(x,y);ctx.scale(.75,.75);if(c.k==='civ')drawCivilian(-8,0,{face:1,hat:c.hat,emo:c.cheer>0?'happy':'normal',arm:c.cheer>0?'up':null});else drawSoldier(-8,0,{fac:c.k,face:-1,emo:c.cheer>0?'shout':'normal',gun:null,surr:c.cheer>0});ctx.restore()}}
function hudFight(){const bw=150;
 for(const [f,side] of[[F1,0],[F2,1]]){const x=side?W-8-bw:8,y=10;r(x-1,y-1,bw+2,9,'#120d0c');r(x,y,bw,7,'#3a1714');const fr=f.hp/f.max,frd=f.hpD/f.max;
  if(side){r(x,y,bw*frd,7,'#e9dcc2');r(x,y,bw*fr,7,fr<.25&&T%10<5?'#ff5a3a':'#d9a441')}else{r(x+bw*(1-frd),y,bw*frd,7,'#e9dcc2');r(x+bw*(1-fr),y,bw*fr,7,fr<.25&&T%10<5?'#ff5a3a':'#d9a441')}
  ctx.drawImage(portrait(f.c.fac,f.emo),side?W-8-28:8,y+10,28,20);txt(f.c.name,side?W-40:40,y+12,'#e9dcc2',side?'right':'left');
  for(let k=0;k<2;k++)r(side?W-44-k*9:36+k*9,y+24,6,6,k<f.wins?'#ffd24a':'#3a2e26');
  const mx=side?W-8-80:8,my=H-14;r(mx-1,my-1,82,7,'#120d0c');r(mx,my,80,5,'#2a1a3a');r(side?mx+80-f.meter*.8:mx,my,f.meter*.8,5,f.meter>=100?(T%8<4?'#ffd24a':'#c08aff'):'#8a5ac0');txt(f.meter>=100?'SUPER!':'SUPER',side?mx:mx+82,my-10,f.meter>=100?'#ffd24a':'#6e6050',side?'left':'left');
  if(f.comboShow&&f.comboShow.n>1){const cx=f.side?40:W-40;stxt(Lg(f.comboShow.n+' HITS',f.comboShow.n+' 連擊'),cx,70,'#ffd24a',16);txt(String(f.comboDmg),cx,82,'#e9dcc2','center')}}
 r(W/2-14,6,28,20,'#120d0c');txt(String(Math.max(0,timer)).padStart(2,'0'),W/2,10,timer<=10?'#ff5a3a':'#e9dcc2','center',F16);
 if(rState==='intro'){if(rT<60)stxt(Lg('ROUND '+round,'第 '+round+' 回合'),W/2,H/2-20,'#e9dcc2',30,Math.min(1,rT/10));if(rT>=40&&rT<60)stxt('FIGHT FOR YOUR BACK PAY',W/2,H/2+8,'#a8977c',10);if(rT>=60)stxt('FIGHT!',W/2,H/2-14,'#ffd24a',36,Math.min(1,(rT-60)/6))}
 if(rState==='ko'&&rT<100){stxt('K.O.',W/2,H/2-20,'#b3261e',44,Math.min(1,rT/6));if(rT>30)stxt('BACK PAY CANCELLED',W/2,H/2+12,'#a8977c',10)}
 if(rState==='time'&&rT<100){stxt('TIME',W/2,H/2-20,'#e9dcc2',36);stxt('BOTH SIDES CLAIM VICTORY',W/2,H/2+12,'#a8977c',10)}
 if((rState==='ko'||rState==='time')&&rT>=100){const w=result;stxt(w?Lg(w.c.name+' WINS',w.c.name+' 獲勝'):'DRAW',W/2,46,'#ffd24a',20);if(w===F1&&F2.key==='million')txt('ONLY 999,999 TO GO',W/2,62,'#ff8a7a','center')}
 for(const t of texts){if(!t.s)continue;if(t.x===-1){stxt(t.s,W/2,H/2+36,t.c,24,1-t.t/70)}else{ctx.globalAlpha=1-t.t/70;txt(t.s,t.x-camX,t.y-t.t*.4,t.c,'center');ctx.globalAlpha=1}}}
function render(){
 if(state==='title'){attract();return}
 if(state==='select'){renderSelect();return}
 if(state==='vs'){renderVS();return}
 if(state==='ending'||state==='story'){scene.done=endScene(scene.sc,scene.t)||scene.done;if(scene.t>200&&scene.done)txt('PRESS ANY BUTTON',W-8,124,'#a8977c','right');if(state==='story')txt(Lg('STAGE '+(ladderI+1)+' / '+ladder.length,'第 '+(ladderI+1)+' / '+ladder.length+' 關'),8,6,'#ffd24a');return}
 if(!F1||!F2)return;
 ctx.save();if(shake>0&&!RM)ctx.translate(((rnd()-.5)*shake)|0,((rnd()-.5)*shake)|0);
 drawBG();if(STAGEFX[stageK])STAGEFX[stageK]();drawCrowd();
 if(superFlash){ctx.globalAlpha=.7;r(0,0,W,H,'#0a0510');ctx.globalAlpha=1}
 const order=[F1,F2].sort((a,b)=>(a.st==='move')-(b.st==='move'));for(const f of order)drawFighter(f);
 for(const q of projs)drawProj(q);
 for(const s of sparks){if(s.ring){ctx.strokeStyle=s.c;ctx.globalAlpha=s.l/12;ctx.lineWidth=2;ctx.beginPath();ctx.arc(s.x-camX,s.y,s.r,0,6.28);ctx.stroke();ctx.globalAlpha=1}else r(s.x-camX,s.y,s.s,s.s,s.c)}
 for(const f of[F1,F2])if(f.bubble)drawShout(f.bubble.s,f.x-camX,f.y-36*f.c.sc-4,f.bubble.big);
 drawWeather();ctx.restore();
 if(superFlash&&superFlash.t<34){const f=superFlash.f,k=Math.min(1,superFlash.t/8);ctx.globalAlpha=.85;r(0,H/2-34,W,68,'#120d0c');ctx.globalAlpha=1;r(0,H/2-34,W,2,'#ffd24a');r(0,H/2+32,W,2,'#ffd24a');
  const px=f.side?W-(k*140):-120+k*140;ctx.drawImage(portrait(f.c.fac,'shout'),px,H/2-30,96,64);stxt(SUPERN[f.c.sp.sup],f.side?120:W-120,H/2,'#ffd24a',18)}
 ctx.drawImage(VIG,0,0);hudFight();
 if(state==='continue'){r(0,0,W,H,'rgba(0,0,0,.7)');stxt('CONTINUE?',W/2,H/2-20,'#e9dcc2',28);txt('THE STATE WILL CONSCRIPT ANOTHER YOU',W/2,H/2+4,'#a8977c','center');txt(String(Math.max(0,10-(endT/60|0))),W/2,H/2+20,'#ffd24a','center',F16);txt('PRESS ANY BUTTON',W/2,H/2+44,'#6e6050','center')}
 if(state==='result'){r(0,0,W,H,'rgba(0,0,0,.6)');const w=F1.wins>=2?F1:F2;stxt(Lg(w.c.name+' WINS THE MATCH',w.c.name+' 贏得比賽'),W/2,H/2-30,'#ffd24a',20);txt(w.c.fac==='kmt'?'THE WAR, HOWEVER, IS STILL BEING LOST.':'THE WAR CONTINUES REGARDLESS.',W/2,H/2+14,'#a8977c','center');txt(Qt(pick2(w.c.quotes,w.key)),W/2,H/2,'#e9dcc2','center');txt('PRESS ANY BUTTON',W/2,H/2+30,'#6e6050','center')}
 if(state==='pause'){r(0,0,W,H,'rgba(0,0,0,.6)');stxt('PAUSED',W/2,H/2,'#e9dcc2',24)}}
const SUPERN={mtfk:'DIE! CCP MTFK!',megaphone:'THE PEOPLE HAVE SPOKEN',squad:'FIRING SQUAD',reform:'LAND REFORM',devalue:'DEVALUATION'};
const pick2=(a,k)=>a[(k.length+(F1?F1.wins:0))%a.length];
function drawBigFighter(key,x,y,sc,dir,emo='determined',pose,mir){const f=mkFighter(key,dir<0?1:0,false,mir);f.x=x+camX;f.y=y;f.dir=dir;f.c=Object.assign({},f.c,{sc});f.emo=emo;f.anim=T;f.st=pose||'stand';drawFighter(f)}
function renderSelect(){camX=0;ctx.fillStyle='#120d0c';ctx.fillRect(0,0,W,H);const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#2a1c18');g.addColorStop(1,'#0c0908');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 stxt(mode==='arcade'?'CHOOSE YOUR NATIONALIST':mode==='2p'?'PLAYER 1 (NATIONALIST) · PLAYER 2':selStep?'CHOOSE THE OPPONENT':'CHOOSE YOUR NATIONALIST',W/2,20,'#e9dcc2',14);
 CAST.forEach((k,i)=>{const c=ROSTER[k],x=32+i*80,y=40,s1=selCur[0]===i,s2=mode==='2p'&&selCur[1]===i;r(x,y,72,96,s1||s2?'#3a2a20':'#1a1310');r(x,y,72,2,c.fac==='kmt'?'#2f4f8a':'#b8322a');
  ctx.drawImage(portrait(c.fac,s1||s2?'shout':'normal'),x+6,y+6,60,42);stxt(c.han,x+36,y+62,c.fac==='kmt'?'#9fb6e6':'#ff8a7a',13);txt(LANG==='zh'?c.en||c.name:c.name,x+36,y+76,'#e9dcc2','center');
  if(p1Locked()&&c.fac!=='kmt'&&!s2){r(x,y+2,72,94,'rgba(12,9,8,.55)');r(x+4,y+30,64,11,'#120d0c');txt(mode==='2p'?'P2 ONLY':'OPPONENT',x+36,y+32,'#ff6a5a','center')}
  if(s1){ctx.strokeStyle=selDone[0]===true?'#888':'#ffd24a';ctx.lineWidth=2;ctx.strokeRect(x-1,y-1,74,98);txt('P1',x+4,y+86,'#ffd24a')}if(s2){ctx.strokeStyle=selDone[1]?'#888':'#ff6a5a';ctx.lineWidth=2;ctx.strokeRect(x+1,y+1,70,94);txt('P2',x+52,y+86,'#ff6a5a')}});
 const c=ROSTER[CAST[selCur[0]]];const ls=wrapT(c.bio,44);ls.forEach((l,i)=>txt(l,W/2,146+i*(LANG==='zh'?12:10),'#a8977c','center'));
 txt(Lg('HP ','血量 ')+c.hp+Lg(' · SPEED ',' · 速度 ')+'■'.repeat(Math.round(c.spd*2))+Lg(' · POWER ',' · 力量 ')+'■'.repeat(Math.round(c.dm*4)),W/2,LANG==='zh'?174:172,'#e9dcc2','center');
 if(selNo>0){selNo--;txt('YOU FIGHT FOR THE NATIONALISTS. THE REDS ARE THE CPU.',W/2,H-26,'#ff6a5a','center')}
 txt(touchUI?'TAP TO CHOOSE · TAP AGAIN TO CONFIRM':tr('A/D CHOOSE · J CONFIRM')+(mode==='2p'?Lg(' · P2: ←/→ AND 1',' · P2：←/→ 和 1'):''),W/2,H-14,'#6e6050','center');ctx.drawImage(VIG,0,0)}
function renderVS(){camX=0;const L_=curL(),opp=L_.mir?posterOf(ROSTER[L_.k]):ROSTER[L_.k],me=F1.c;ctx.fillStyle='#0c0908';ctx.fillRect(0,0,W,H);r(0,0,W/2,H,'#14182a');r(W/2,0,W/2,H,'#2a1210');
 const k=Math.min(1,vsT/20);drawBigFighter(F1.key,-60+k*150,H-30,4.2,1,'shout');drawBigFighter(L_.k,W+60-k*150,H-30,Math.min(4.6,opp.sc*1.5),-1,'smug',null,L_.mir);
 stxt('VS',W/2,H/2-10,'#ffd24a',44,k);stxt(me.name,90,26,'#9fb6e6',14);stxt(opp.name,W-90,26,opp.mirror?'#e0c070':'#ff8a7a',opp.name.length>12?11:14);txt(Lg('STAGE '+(ladderI+1)+' / '+ladder.length,'第 '+(ladderI+1)+' / '+ladder.length+' 關'),W/2,H/2+20,'#a8977c','center');txt(STAGES[L_.stage].name,W/2,H/2+(LANG==='zh'?33:30),'#d9a441','center');if(ladderI===ladder.length-1)stxt('FINAL BATTLE',W/2,H/2+46,'#ff5a3a',12);
 const q=Qt(opp.quotes[ladderI%opp.quotes.length]),ls=wrapT(q,LANG==='zh'?24:30);ls.forEach((l,i)=>txt(l,W-110,44+i*(LANG==='zh'?13:10),'#e9dcc2','center'));ctx.drawImage(VIG,0,0)}
function attract(){camX=(T*.3)%(SW-W);if(!BGD){L.theme='village';LV=0;buildBG()}drawBG();drawCrowd();
 const a=Math.sin(T*.03);drawBigFighter('wang',W/2-60+a*6,FY,2.6,1,'shout');drawBigFighter('wei',W/2+60-a*6,FY,2.7,-1,'grit');ctx.drawImage(VIG,0,0)}

/* ---------------- DOM, input wiring ---------------- */
$('#mArcade').onclick=()=>{initAudio();openSelect('arcade')};$('#mCpu').onclick=()=>{initAudio();openSelect('cpu')};$('#m2p').onclick=()=>{initAudio();openSelect('2p')};
function togglePause(){if(state==='fight')state='pause';else if(state==='pause')state='fight'}
$('#bPause').onclick=e=>{togglePause();e.currentTarget.blur()};$('#bSnd').onclick=e=>{initAudio();setMute(!muted);sndLabel();e.currentTarget.blur()};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='fight')togglePause()});
addEventListener('keydown',e=>{if(e.code==='KeyP'||e.code==='Escape'){if(state==='fight'||state==='pause'){togglePause();return}if(state==='select'||state==='result'){toTitle();return}}
 if(state==='title')return;initAudio();kb[e.code]=1;const a=K1[e.code]||(mode!=='2p'?K1alt[e.code]:null),b=mode==='2p'?K2[e.code]:null;if(a){keysP[1][a]=1;latch[1][a]=1}if(b){keysP[2][b]=1;latch[2][b]=1}if(a||b||e.code==='Space')e.preventDefault()});
addEventListener('keyup',e=>{kb[e.code]=0;const a=K1[e.code]||K1alt[e.code],b=K2[e.code];if(a)keysP[1][a]=0;if(b)keysP[2][b]=0});
cv.addEventListener('pointerdown',e=>{initAudio();const rc=cv.getBoundingClientRect();const x=(e.clientX-rc.left)/rc.width*W,y=(e.clientY-rc.top)/rc.height*H;if(state==='select')selTap(x,y);else if(['story','vs','result','ending','continue'].includes(state)){latch[1].L=1}});
let touchUI=false;const tpad=$('#touch'),sBase=$('#stickBase'),sKnob=$('#stickKnob');let stickId=null,sx0=0,sy0=0;const btnT={};
if(matchMedia('(pointer:coarse)').matches)touchUI=true;
addEventListener('touchstart',()=>{if(!touchUI){touchUI=true;if(state!=='title')tpad.hidden=false}},{passive:true});
tpad.addEventListener('touchstart',e=>{e.preventDefault();initAudio();for(const t of e.changedTouches){const b=t.target.closest&&t.target.closest('.tb');
 if(b){const k=b.dataset.k;btnT[t.identifier]=k;tch[k]=true;b.classList.add('on');continue}
 if(t.clientX<innerWidth*.5&&stickId==null){stickId=t.identifier;sx0=t.clientX;sy0=t.clientY;sBase.hidden=false;sBase.style.left=sx0+'px';sBase.style.top=sy0+'px';sKnob.style.transform=''}
 else if(state!=='fight'){const rc=cv.getBoundingClientRect();const x=(t.clientX-rc.left)/rc.width*W,y=(t.clientY-rc.top)/rc.height*H;if(state==='select')selTap(x,y);else{latch[1].L=1}}}},{passive:false});
tpad.addEventListener('touchmove',e=>{e.preventDefault();for(const t of e.changedTouches)if(t.identifier===stickId){const dx=clamp(t.clientX-sx0,-50,50),dy=clamp(t.clientY-sy0,-50,50);stickV={x:Math.abs(dx)<10?0:dx/50,y:Math.abs(dy)<10?0:dy/50};sKnob.style.transform=`translate(${dx}px,${dy}px)`}},{passive:false});
function tEnd(e){e.preventDefault();for(const t of e.changedTouches){if(t.identifier===stickId){stickId=null;stickV={x:0,y:0};sBase.hidden=true}const k=btnT[t.identifier];if(k){tch[k]=false;delete btnT[t.identifier];const el=document.querySelector(`.tb[data-k=${k}]`);if(el)el.classList.remove('on')}}}
tpad.addEventListener('touchend',tEnd,{passive:false});tpad.addEventListener('touchcancel',tEnd,{passive:false});
function fit(){const vw=innerWidth,vh=innerHeight,s=Math.min(vw/W,vh/H);cv.style.width=Math.floor(W*s)+'px';cv.style.height=Math.floor(H*s)+'px'}
addEventListener('resize',fit);fit();
/* ---------------- i18n: 繁體中文 (default) / English — shared data swapped in place, shared files untouched ---------------- */
var LANG='zh';
const LANG_KEY='civilfighter.lang';
const ZFAM='"Noto Sans TC","Noto Sans CJK TC","PingFang TC","Microsoft JhengHei","Heiti TC","Source Han Sans TC",sans-serif';
const CJK_RE=/[⺀-鿿豈-﫿＀-￯　-〿]/;
const isZ=s=>LANG==='zh'&&CJK_RE.test(String(s));
const Lg=(en,zh)=>LANG==='zh'?zh:en;
const Qt=s=>LANG==='zh'?'「'+s+'」':'"'+s+'"';
function zf(font){const m=/(\d+)px/.exec(font||F),p=m?+m[1]:8;return p>=16?`700 16px ${ZFAM}`:p<=6?`500 8px ${ZFAM}`:`500 11px ${ZFAM}`}
function fontFor(s,font=F){return isZ(s)?zf(font):font}
function wrapPx(s,maxW){const toks=String(s).match(/[A-Za-z0-9¥$%'’.,!?:\/+\-–—()]+|\s+|[\s\S]/gu)||[];const out=[];let line='';
 for(const tk of toks){const test=line+tk;
  if(line.trim()&&ctx.measureText(test.trimEnd()).width>maxW&&!/^[，。、！？：；）」』…—,.!?)\s]/.test(tk)){out.push(line.trim());line=/^\s+$/.test(tk)?'':tk}else line=test}
 if(line.trim())out.push(line.trim());return out}
function wrapT(s,n){if(!isZ(s))return wrap(s,n);ctx.font=zf(F);return wrapPx(s,n*8)}
const ZH_UI={
 'ADVANCE →':'前進 →','BACK PAY CANCELLED':'欠餉一筆勾銷','BOTH SIDES CLAIM VICTORY':'雙方都宣稱勝利','CALENDAR':'月曆','CHOOSE THE OPPONENT':'選擇對手',
 'CHOOSE YOUR NATIONALIST':'選擇你的國軍','CONTINUE?':'接關？','COUNTER':'反擊','COUNTERATTACK:':'反攻大陸：','DRAW':'平手','FIGHT FOR YOUR BACK PAY':'為了欠餉而戰',
 'FIGHT!':'開打！','FINAL BATTLE':'最終決戰','GOLD: ALREADY GONE':'黃金：早就走了','HERO':'英雄','LAST BOAT':'最後一班船','MINE!':'我的！','MINISTRY OF VICTORY':'勝　利　部',
 'MOVED':'已搬遷','NEXT YEAR':'明年','ONLY 999,999 TO GO':'只剩 999,999 個','OPPONENT':'對手','P2 ONLY':'限玩家2','PAUSED':'暫停','PERFECT':'完美勝利',
 'PLAYER 1 (NATIONALIST) · PLAYER 2':'玩家1（國軍）· 玩家2','PRESS ANY BUTTON':'按任意鍵','SEAT 1/1':'座位 1/1','SUPER!':'超必殺！','SUPER':'超必殺',
 'TAP TO CHOOSE · TAP AGAIN TO CONFIRM':'點選角色 · 再點一次確認','A/D CHOOSE · J CONFIRM':'A/D 選擇 · J 確認','THE ARMY OF 1,000,000':'百萬大軍',
 'THE STATE WILL CONSCRIPT ANOTHER YOU':'國家會再抓一個你來當兵','THE WAR CONTINUES REGARDLESS.':'戰爭照打不誤。','THE WAR, HOWEVER, IS STILL BEING LOST.':'不過，戰爭還是在輸。',
 'TIME':'時間到','YOU FIGHT FOR THE NATIONALISTS. THE REDS ARE THE CPU.':'你是國軍。共軍由電腦操控。','-50% VALUE':'價值 -50%','COUNTER ':'反擊',
 'DIE! CCP MTFK!':'殺！共匪混蛋！','THE PEOPLE HAVE SPOKEN!':'人民已經發聲了！','FIRING SQUAD!':'行刑隊！','LAND REFORM!':'土地改革！','YOUR VALUE: HALVED.':'你的價值：減半。',
 'STRATEGIC WITHDRAWAL!':'戰略性轉進！','SELF-CRITICIZE!':'自我批評！','DESERTER!':'逃兵！','DEFECTED!':'投誠了！','...SORRY. REFLEX.':'……抱歉，反射動作。',
 'SERVE THE PEOPLE!':'為人民服務！','DOWN WITH YOU!':'打倒你！','READ THIS!':'看傳單！',
 'COATS':'冬衣','APR':'四月','TEMPORARY':'暫時','FORM 1':'表格一','SND':'音效','MUTE':'靜音','VS':'VS'};
const ZH_PREFIX=[['RICE: ¥','米價：¥']];
function tr(s){if(LANG!=='zh')return s;const z=ZH_UI[s];if(z!=null)return z;for(const[a,b]of ZH_PREFIX)if(typeof s==='string'&&s.startsWith(a))return b+s.slice(a.length);return s}
/* zh-TW data, merged over the English roster/stages on language change */
const ZH_R={
 wang:{name:'老王',bio:'壯丁一名。薪餉發金圓券。為了永遠領不到的欠餉而戰。',quotes:['你們那邊發米？……菜單可以借我看一下嗎？','我為薪水而戰。現在那份薪水值一顆蛋。','殺！共匪混蛋！……抱歉，反射動作。'],
  ending:{date:'1949年12月',place:'最後一班渡輪',fact:'大陸淪陷之際，一兩百萬軍民跟著國民政府渡過了海峽。',joke:'老王每一回合都贏了。上了甲板，欠餉終於發下來：四千萬金圓券。一位水手好心用一顆水煮蛋跟他換全部。水手真是大方。'},
  taiwan:'官方說法：這只是暫時撤退。非常暫時。「明年就反攻大陸！」所以老王只拆開一隻襪子。就一隻。反正只待一年，何必全拆。'},
 red:{name:'小紅',bio:'宣傳員。一手大聲公，一手傳單，兩手都是意見。',quotes:['我已經準備好一份關於你戰敗的傳單。','耕者有其田！拳者有其臉！','你現在要做自我批評。大聲一點。'],
  ending:{date:'1949年10月',place:'北京',fact:'1949年10月1日，中華人民共和國在北京宣告成立。',joke:'小紅贏了。她升任口號副助理，接著被要求針對「贏得太大聲」寫一份自我檢討。'}},
 ma:{name:'馬將軍',bio:'督戰官。專斃逃兵。從來沒人敢問斃了幾個。',quotes:['撤退是叛國。前進也很可疑。','你的槍決單我已經填好了。這裡簽名。','我的大刀上刻了六個名字。下一個是你。'],
  ending:{date:'1949年12月',place:'最後的碼頭',fact:'在最後關頭之前，中央銀行的黃金儲備已經悄悄運往台灣。黃金先走一步。',joke:'馬將軍每場都贏，下令光榮進軍。朝著船的方向。「這不是撤退，是大陸自己漂走了。」'},
  taiwan:'官方說法：這只是暫時撤退。非常暫時。馬將軍把反攻排在明年。然後改期。年年改期。月曆成了他麾下戰功最彪炳的部屬。'},
 wei:{name:'魏政委',bio:'政治委員。一句話講到一半，就能投靠勝利的一方。',quotes:['你的錯誤已經記錄在案。一式三份。','我一直站在勝利的一方。不信查檔案。檔案我改過了。','整風這一下！'],
  ending:{date:'1949年',place:'每一個村子',fact:'戰線來回推移，許多村子易手好幾次，旗子也是。',joke:'魏政委贏了。兩面旗子都收在大衣裡。以防萬一。'}},
 printer:{name:'印鈔機',bio:'中央銀行的印鈔機，穿著西裝。每年都畫一個更大的數字。',quotes:['我不會輸。我只會發行新鈔。','你的血量已重新估值為千分之一。','通膨不是bug，是我的武術流派。'],
  ending:{date:'1949年',place:'上海',fact:'1948年8月發行的金圓券，到了1949年已經幾乎一文不值。',joke:'印鈔機無法被擊敗，只能被新型號取代。'}},
 million:{name:'百萬雄師',bio:'不是一個兵，是一個戴帽子的統計數字。打倒他，只剩999,999個。',quotes:['我不是一個人。我是一百萬的四捨五入誤差。','要打就打。我的表兄弟在後面排隊。','長江是你們的防線。我們帶了船。'],
  ending:{date:'1949年',place:'對岸',fact:'到1949年底，解放軍兵力已達數百萬。',joke:'他升官為一百萬零一。'}}};
const ZH_ST={village:'燃燒的村莊',paddy:'爭奪中的稻田',snow:'東北前線',river:'長江渡口',city:'上海造幣廠',palace:'南京 · 勝利部',pier:'最後的碼頭'};
const ZH_SUP={mtfk:'殺！共匪混蛋！',megaphone:'人民已經發聲',squad:'行刑隊',reform:'土地改革',devalue:'貨幣貶值'};
const ZH_FIN={date:'1949年12月',place:'台灣',fact:'1949年12月：國民政府撤退到台灣。你每一回合都贏了。你還是輸了這場戰爭。',joke:'官方說法：暫時撤退。「明年就反攻大陸！」大家都同意。年年都同意。'};
const EN_R={},EN_ST={},EN_SUP=Object.assign({},SUPERN),EN_FIN=Object.assign({},FINALE);
for(const k in ZH_R){const c=ROSTER[k];EN_R[k]={name:c.name,bio:c.bio,quotes:c.quotes.slice(),ending:Object.assign({},c.ending),taiwan:c.taiwan};c.en=c.name}
for(const k in STAGES)EN_ST[k]=STAGES[k].name;
const isDark=c=>{const m=/^#([0-9a-f]{6})/i.exec(c);if(!m)return false;const v=parseInt(m[1],16);return((v>>16)*.3+((v>>8)&255)*.59+(v&255)*.11)<70};
const _txt0=txt,_shout0=drawShout;
txt=function(s,x,y,c='#e9dcc2',al='left',font=F){if(LANG==='zh')s=tr(String(s));if(LANG!=='zh'||!CJK_RE.test(s)){if(!isDark(c))return _txt0(s,x,y,c,al,font);ctx.font=font;ctx.textAlign=al;ctx.textBaseline='top';ctx.fillStyle=c;ctx.fillText(s,x,y);return}
 const big=/16px/.test(font);ctx.font=zf(font);ctx.textAlign=al;ctx.textBaseline='middle';const yy=y+(big?8:4);ctx.fillStyle='#120d0c';
 if(!isDark(c))for(const[a,b]of[[1,1],[-1,0],[1,0],[0,-1],[0,1]])ctx.fillText(s,x+a,yy+b);ctx.fillStyle=c;ctx.fillText(s,x,yy);ctx.textBaseline='top'};
drawShout=function(s,x,y,hero){s=tr(s);if(!isZ(s))return _shout0(s,x,y,hero);
 ctx.font=zf(F);const w=Math.ceil(ctx.measureText(s).width)+10,h=16,jig=hero&&T%6<3?1:0,bx=clamp(x-w/2,4,W-w-4),by=Math.max(26,y-h)+jig,bc=hero?'#c8372d':'#120d0c',fc=hero?'#fff4d0':'#d8ccb0';
 r(bx-1,by-1,w+2,h+2,bc);r(bx,by,w,h,fc);const tx=clamp(x-1,bx+3,bx+w-6);r(tx,by+h+1,3,3,fc);r(tx+1,by+h+4,2,2,fc);
 ctx.font=zf(F);ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillStyle=hero?'#c8372d':'#3a2a20';ctx.fillText(s,bx+5,by+h/2+1);ctx.textBaseline='top'};
/* HTML overlays */
const ZH_HTML={
 h1:'國共快打<span>CIVIL FIGHTER 1949 · 兄弟對打</span>',
 tag:'你是國軍（藍帽子）。街機模式共六關：從冰天雪地的東北一路打到最後的碼頭，對手有共軍、自家同袍、你自己的宣傳海報、印鈔機，還有一支百萬大軍。三戰兩勝。每一場都打贏。看看有沒有用。',
 arc:'街機模式',cpu:'對戰電腦',p2:'雙人對戰（同一鍵盤）',
 keys:'玩家1：A D 移動 · W 跳 · S 蹲 · 按住後退防禦 · J 輕攻擊 · K 重攻擊 · L 必殺技 · I 超必殺<br>必殺技＋方向：不按＝飛行道具 · 前＝突進 · 下＝對空 · 後＝反擊。經典指令也行（↓↘→＋攻擊、→↓↘＋攻擊）。<br>玩家2：方向鍵 · 數字鍵 1 2 3 0 或 , . / ;<br>手機：左手拇指移動，按鈕在右邊。P 或 Esc 暫停。',
 fine:'諷刺作品。內戰沒有贏家，反正你每一回合都會贏。街機與對戰電腦：你操作國軍，共軍是對手。雙人對戰：玩家1是國軍，玩家2隨便選。',
 tL:'輕',tH:'重',tS:'必殺',tX:'超必殺',rot:'把手機轉成橫向，戰爭比較大場'};
const EN_HTML={};document.querySelectorAll('[data-t]').forEach(el=>EN_HTML[el.dataset.t]=el.innerHTML);
const ARIA={cv:['Civil Fighter 1949 game screen','國共快打 1949 遊戲畫面'],bPause:['Pause','暫停'],bSnd:['Toggle sound','切換音效'],bLang:['Switch to Chinese','切換成英文']};
function sndLabel(){$('#bSnd').textContent=tr(muted?'MUTE':'SND')}
function applyLang(l,save){LANG=l==='zh'?'zh':'en';const zh=LANG==='zh';
 if(save)try{localStorage.setItem(LANG_KEY,LANG)}catch(e){}
 for(const k in ZH_R){const c=ROSTER[k],e=EN_R[k],z=ZH_R[k];Object.assign(c,zh?{name:z.name,bio:z.bio,quotes:z.quotes,taiwan:z.taiwan||e.taiwan,ending:Object.assign({},e.ending,z.ending)}:{name:e.name,bio:e.bio,quotes:e.quotes,taiwan:e.taiwan,ending:Object.assign({},e.ending)})}
 for(const k in STAGES)STAGES[k].name=zh&&ZH_ST[k]?ZH_ST[k]:EN_ST[k];Object.assign(SUPERN,zh?ZH_SUP:EN_SUP);Object.assign(FINALE,zh?ZH_FIN:EN_FIN);
 for(const f of[F1,F2])if(f&&f.c.mirror)f.c=Object.assign(posterOf(ROSTER[f.key]),{sc:f.c.sc});
 if(scene&&state==='story')scene.sc=storyOf(curL());
 document.documentElement.lang=zh?'zh-Hant':'en';document.title=zh?'國共快打 Civil Fighter 1949':'Civil Fighter 1949';
 document.querySelectorAll('[data-t]').forEach(el=>{const k=el.dataset.t;el.innerHTML=zh&&ZH_HTML[k]!=null?ZH_HTML[k]:EN_HTML[k]});
 for(const id in ARIA){const el=$('#'+id);if(el)el.setAttribute('aria-label',ARIA[id][zh?1:0])}
 document.querySelectorAll('.lang button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.l===LANG)));
 const bl=$('#bLang');bl.textContent=zh?'EN':'中文';bl.lang=zh?'en':'zh-Hant';sndLabel();
 if(zh&&document.fonts)document.fonts.load(zf(F),'國軍').catch(()=>{})}
document.querySelectorAll('.lang button').forEach(b=>b.addEventListener('click',()=>applyLang(b.dataset.l,true)));
$('#bLang').addEventListener('click',e=>{applyLang(LANG==='zh'?'en':'zh',true);e.currentTarget.blur()});
addEventListener('keydown',e=>{if(e.code==='KeyT'&&state!=='fight')applyLang(LANG==='zh'?'en':'zh',true)});
applyLang((()=>{try{const v=localStorage.getItem(LANG_KEY);if(v==='en'||v==='zh')return v}catch(e){}return 'zh'})(),false);
let last=performance.now(),acc=0;
function loop(nt){acc+=Math.min(100,nt-last);last=nt;while(acc>=16.67){acc-=16.67;if(state!=='title'&&state!=='pause')update();else T++}render();requestAnimationFrame(loop)}
(document.fonts?Promise.all([document.fonts.load(F),document.fonts.load(SERIF(20))]):Promise.resolve()).catch(()=>{}).finally(()=>requestAnimationFrame(loop));
