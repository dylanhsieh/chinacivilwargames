/* ===================== GOLD RUN 1949 — a Civil Slug tower defense =====================
   You are the Nationalist (KMT) gold garrison. Six stages along the gold's route out of Shanghai,
   each ending in a boss wave; progress is saved; the campaign ends where history did. */
let T=0,camX=0,S='kmt',EN='ccp',LV=0,skyFlash=0,skyFX=0,state='title';
let plats=[],scorch=[];const L={walls:[],theme:'city',deep:null,weather:null};function groundAt(){return GY}
const VIG=document.createElement('canvas');VIG.width=W;VIG.height=H;{const g=VIG.getContext('2d');const rg=g.createRadialGradient(W/2,H/2,H*.4,W/2,H/2,W*.65);rg.addColorStop(0,'rgba(0,0,0,0)');rg.addColorStop(1,'rgba(6,2,2,.45)');g.fillStyle=rg;g.fillRect(0,0,W,H)}
/* ---------------- i18n core: 繁體中文 default, English optional (resolved at draw time) ---------------- */
let LANG='zh';const LANG_KEY='goldrun.lang';
const ZFAM='"Noto Sans TC","Noto Sans CJK TC","PingFang TC","Microsoft JhengHei","Heiti TC","Source Han Sans TC","WenQuanYi Micro Hei",sans-serif';
const CJK_RE=/[\u2e80-\u9fff\uf900-\ufaff\uff00-\uffef\u3000-\u303f]/;
const LZ=(e,z)=>LANG==='zh'?z:e;
const ZF=(px,w=500)=>`${w} ${px}px ${ZFAM}`;
const MISS=new Set();
function tr(s){if(LANG!=='zh'||typeof s!=='string')return s;const z=ZT[s];if(z!=null)return z;for(const[re,f]of ZRX){const m=re.exec(s);if(m)return f(m)}if(/[A-Z]{2}/i.test(s)&&!CJK_RE.test(s))MISS.add(s);return s}
// field lookup: obj.zh[key] when Chinese, else obj[key]
const ZK=(o,k)=>LANG==='zh'&&o.zh&&o.zh[k]!=null?o.zh[k]:o[k];
function wrapPx(s,maxW){const toks=String(s).match(/[A-Za-z0-9¥$%'’.,!?:\/+\-–—()×]+|\s+|[\s\S]/gu)||[];const out=[];let line='';
 for(const tk of toks){const test=line+tk;if(line.trim()&&ctx.measureText(test.trimEnd()).width>maxW&&!/^[，。、！？：；）」』…—,.!?)\s]/.test(tk)){out.push(line.trim());line=/^\s+$/.test(tk)?'':tk}else line=test}
 if(line.trim())out.push(line.trim());return out}
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
const tinyW=(s,px=10)=>{s=tr(String(s));if(!CJK_RE.test(s))return s.length*4-1;ctx.font=ZF(px);return Math.ceil(ctx.measureText(s).width)};
/* CJK-aware override of the shared txt() (English path untouched) */
const _txt=txt;
txt=function(s,x,y,c='#e9dcc2',al='left',font=F){s=tr(String(s));if(!CJK_RE.test(s))return _txt(s,x,y,c,al,font);
 ctx.font=/16px/.test(font)?ZF(16,700):ZF(11);ctx.textAlign=al;ctx.textBaseline='middle';const yy=y+(/16px/.test(font)?8:4);
 if(!isDark(c)){ctx.fillStyle='#120d0c';ctx.fillText(s,x+1,yy+1)}ctx.fillStyle=c;ctx.fillText(s,x,yy);ctx.textBaseline='top'};
const TS=16,GW=24,GH=12,OY=24;

/* ---------------- the campaign: six stops on the gold's way out ---------------- */
const STAGES=[
 {id:'vault',name:'THE BANK VAULT',han:'金庫',date:'DECEMBER 1948',place:'THE BUND · BANK VAULT',waves:8,mul:.85,off:0,cash:230,mus:'m1',boss:'insider',
  paths:[[[-1,2],[4,2],[4,9],[9,9],[9,4],[14,4],[14,9],[19,9],[19,5],[24,5]]],water:[],gold:[22,7],fixed:[['vaultdoor',22,3]],deco:[['pillar',.08],['desk',.05],['safe',.02]],
  roster:{looter:1,clerk:2,crowd:3,deserter:5},
  fact:'The government is quietly moving the gold reserves out of Shanghai, by night. Officially, nothing is happening.',
  joke:'Your orders: guard the vault. Nothing is happening. Nothing is very heavy.',
  wfact:'From December 1948 the gold reserves left the Bund for Taiwan in secret shipments, loaded at night by dock workers.',
  wjoke:'A newspaper noticed. It was told the crates were nothing. Nothing filled a ship.'},
 {id:'bund',name:'THE BUND',han:'外灘',date:'DECEMBER 1948',place:'THE BUND · GOLD RUSH',waves:10,mul:.9,off:1,cash:260,mus:'m2',boss:'bmtruck',
  paths:[[[-1,8],[3,8],[3,3],[8,3],[8,10],[13,10],[13,4],[17,4],[17,8],[24,8]]],water:[[0,0,24,1]],gold:[22,10],fixed:[],deco:[['house',.08],['tree',.04],['lamp',.03]],
  roster:{looter:1,clerk:1,crowd:2,deserter:3,speculator:4,officer:7},newT:'press',
  fact:'In August, citizens were ordered to trade their gold for Gold Yuan notes. The notes are now worthless. They want the gold back.',
  joke:'Your orders: protect the gold from its previous owners.',
  wfact:'In December 1948 crowds rushed the Shanghai banks to swap Gold Yuan for gold. People died in the crush. The currency kept falling.',
  wjoke:'Your pay is in Gold Yuan. Technically you are now a volunteer.'},
 {id:'rail',name:'THE RAIL YARD',han:'車站',date:'JANUARY 1949',place:'NORTH STATION · RAIL YARD',waves:10,mul:1.1,off:3,cash:320,mus:'m3',boss:'handcar',
  paths:[[[-1,1],[6,1],[6,6],[2,6],[2,10],[11,10],[11,3],[16,3],[16,9],[24,9]]],water:[],gold:[21,11],fixed:[],rails:[5,0],deco:[['coal',.04],['crate',.04],['signal',.02]],
  roster:{deserter:1,looter:1,cadre:2,officer:4,cart:5,cavalry:7},newT:'mortar',
  fact:'The Huaihai campaign is lost. Trains from the north arrive packed with soldiers, refugees, and soldiers dressed as refugees.',
  joke:'Guard the gold train. It is the only thing in China still running on time.',
  wfact:'The defeat at Huaihai in January 1949 cost the Nationalists hundreds of thousands of men. Many simply changed sides.',
  wjoke:'Several of your recruits came back. Wearing different caps.'},
 {id:'docks',name:'THE RIVER DOCKS',han:'碼頭',date:'APRIL 1949',place:'THE RIVER DOCKS',waves:12,mul:1.35,off:5,cash:440,mus:'m4',boss:'turncoat',
  paths:[[[-1,2],[6,2],[6,6],[12,6],[12,3],[18,3],[18,7],[24,7]],[[4,12],[4,8],[9,8],[9,6],[12,6],[12,3],[18,3],[18,7],[24,7]]],water:[[0,10,24,2]],gold:[22,9],fixed:[['crane',15,9]],deco:[['crate',.07],['bollard',.04]],
  roster:{cadre:1,deserter:1,militia:2,looter:3,sapper:5,officer:6,cart:8},newT:'speaker',
  fact:'Peace talks failed. The Communist armies crossed the Yangtze on a broad front in a few nights. Nanjing fell days later.',
  joke:'HQ calls the river an impassable natural barrier. Nobody told the boats.',
  wfact:'The river line collapsed in April 1949. Whole units, and a large part of the river fleet, went over to the other side.',
  wjoke:'The general you just stopped is already a general again. On the other side.'},
 {id:'air',name:'THE AIRFIELD',han:'機場',date:'MAY 1949',place:'THE AIRFIELD',waves:12,mul:1.42,off:7,cash:480,mus:'m5',boss:'tank',
  paths:[[[-1,10],[4,10],[4,1],[9,1],[9,8],[14,8],[14,2],[20,2],[20,6],[24,6]]],water:[],gold:[22,8],fixed:[['plane',16,10]],runway:[4,5],deco:[['drum',.04],['sandbag',.05]],
  roster:{cadre:1,militia:1,cavalry:2,sapper:3,crowd:4,officer:5,cart:7},
  fact:'Shanghai is encircled. The last planes out carry officials, files, relatives, furniture and gold. In that order.',
  joke:'Your seat on the plane is reserved. It is reserved for a piano.',
  wfact:'In May 1949 Shanghai fell. In the last days officials, archives and fortunes left by air and by sea.',
  wjoke:'The plane leaves with the gold and the piano. You wave. The piano does not wave back.'},
 {id:'ship',name:'THE LAST SHIP',han:'末船',date:'MAY 1949',place:'THE SHANGHAI PIER',waves:14,mul:2.1,off:9,cash:520,mus:'m3',boss:'tank7',final:1,
  paths:[[[-1,3],[7,3],[7,8],[13,8],[13,5],[24,5]],[[-1,10],[5,10],[5,8],[7,8],[13,8],[13,5],[24,5]]],water:[[19,0,5,12],[15,0,4,2],[16,10,3,2]],gold:[22,7],fixed:[['ship',20,2]],deco:[['crate',.06],['bollard',.04],['house',.03]],
  roster:{looter:1,crowd:1,deserter:2,cadre:2,militia:3,cavalry:4,sapper:5,speculator:6,officer:7,cart:8},
  fact:'The last crates are going aboard. Hold the pier until the ship sails. After that, the war is somebody else\'s department.',
  joke:'The crates have cabins. You have a ticket: standing room, a later boat.',
  wfact:'You held the pier. The ship sailed with the gold. The city changed hands soon after.',
  wjoke:'Good news: you did your job perfectly. Bad news: please turn the page.'}];
const ED={
 looter:{n:'LOOTER',hp:30,spd:.9,b:6,steal:1,k:'civ',hat:'none',cl:'#6a5040'},
 clerk:{n:'BANK CLERK',hp:24,spd:1.1,b:6,steal:2,k:'civ',hat:'none',cl:'#c8c0b0',cl2:'#3a3a3a'},
 deserter:{n:'DESERTER',hp:55,spd:.6,b:8,steal:1,k:'sol',fac:'kmt'},
 cadre:{n:'CADRE',hp:70,spd:.55,b:9,steal:1,k:'sol',fac:'ccp'},
 crowd:{n:'BANK RUN',hp:22,spd:.85,b:3,steal:1,k:'civ',hat:'fedora',cl:'#3a3a3a',grp:6},
 speculator:{n:'SPECULATOR',hp:48,spd:1,b:11,steal:2,k:'civ',hat:'fedora',cl:'#2a2a3a',cl2:'#1a1a22',sack:1},
 militia:{n:'MILITIA',hp:150,spd:.45,b:14,steal:1,armor:3,k:'sol',fac:'ccp',gun:'rifle'},
 cart:{n:'HANDCART',hp:280,spd:.32,b:25,steal:3,k:'cart'},
 cavalry:{n:'CAVALRY',hp:120,spd:1.05,b:16,steal:1,k:'horse',fac:'ccp'},
 sapper:{n:'SAPPER',hp:210,spd:.48,b:18,steal:1,armor:6,k:'sol',fac:'ccp',gun:'rocket'},
 officer:{n:'WARLORD',hp:130,spd:.6,b:20,steal:2,k:'sol',fac:'kmt',officer:1,aura:1},
 insider:{n:'THE INSIDE MAN',hp:1000,spd:.3,b:120,steal:6,armor:2,k:'bigciv',boss:1},
 bmtruck:{n:'BLACK-MARKET TRUCK',hp:1700,spd:.28,b:150,steal:8,armor:4,k:'truck',boss:1},
 handcar:{n:'ARMORED HANDCAR',hp:2300,spd:.3,b:180,steal:8,armor:6,k:'handcar',boss:1},
 turncoat:{n:'THE GENERAL WHO SWITCHED SIDES',hp:2500,spd:.42,b:200,steal:10,armor:5,k:'turncoat',boss:1,aura:1},
 tank:{n:'TANK (SIX PREVIOUS OWNERS)',hp:3300,spd:.24,b:250,steal:10,armor:8,k:'tank',boss:1},
 tank7:{n:'THE SAME TANK (NOW SEVEN OWNERS)',hp:4600,spd:.24,b:300,steal:20,armor:9,k:'tank',flag:1,boss:1}};
const TD={
 rifle:{n:'RIFLE SQUAD',c:60,lv:[{dmg:14,rate:40,range:3.2},{dmg:24,rate:34,range:3.6},{dmg:38,rate:28,range:4.1}],d:'Reliable. Paid monthly, in theory.'},
 mg:{n:'MG NEST',c:110,lv:[{dmg:4,rate:7,range:2.4},{dmg:6,rate:6,range:2.6},{dmg:9,rate:5,range:2.9}],d:'Fast, short range. Ammo is American, invoice pending.'},
 mortar:{n:'MORTAR',c:150,lv:[{dmg:45,rate:90,range:5.2,splash:1.3},{dmg:75,rate:80,range:5.6,splash:1.5},{dmg:120,rate:70,range:6,splash:1.8}],min:1.4,d:'Splash damage. Cannot hit anything close. Like policy.'},
 speaker:{n:'LOUDSPEAKER',c:90,lv:[{slow:.55,conv:.004,range:2.6},{slow:.45,conv:.007,range:3},{slow:.35,conv:.011,range:3.4}],d:'Slows enemies. Some defect and fight their friends.'},
 press:{n:'PRINTING PRESS',c:120,lv:[{inc:45},{inc:80},{inc:130}],d:'Prints money every wave. Also prints inflation.'}};
const STAGE_ZH=[
 {name:'銀行金庫',date:'1948年12月',place:'外灘 · 銀行金庫',
  fact:'政府正趁著夜色，把黃金儲備悄悄運出上海。官方說法：什麼事也沒發生。',
  joke:'你的命令：守住金庫。什麼事也沒發生，而且「什麼事」非常重。',
  wfact:'1948年12月起，黃金儲備分批從外灘秘密運往台灣，由碼頭工人趁夜搬上船。',
  wjoke:'有報社發現了。官方回應：箱子裡什麼都沒有。「什麼都沒有」裝滿了一整艘船。'},
 {name:'外灘',date:'1948年12月',place:'外灘 · 擠兌潮',
  fact:'八月時，政府要民眾把黃金換成金圓券。現在金圓券一文不值，大家想把黃金換回來。',
  joke:'你的命令：保護黃金，別讓它的前任主人拿回去。',
  wfact:'1948年12月，上海民眾湧進銀行想用金圓券兌換黃金，擠兌中有人被活活踩死。金圓券繼續狂跌。',
  wjoke:'你的薪水是用金圓券發的。嚴格來說，你現在是志工。'},
 {name:'鐵路貨場',date:'1949年1月',place:'北站 · 鐵路貨場',
  fact:'徐蚌會戰打輸了。北方開來的火車擠滿了士兵、難民，還有打扮成難民的士兵。',
  joke:'守住運金列車。這是全中國唯一還準時的東西。',
  wfact:'1949年1月徐蚌會戰失利，國軍損失數十萬人。其中很多人只是換了一邊站。',
  wjoke:'你有幾個新兵回來了。帽子換了顏色。'},
 {name:'江邊碼頭',date:'1949年4月',place:'江邊碼頭',
  fact:'和談破裂。共軍只花幾個晚上就全線渡過長江，幾天後南京失守。',
  joke:'總部說長江是天險。沒人通知那些船。',
  wfact:'1949年4月長江防線崩潰。整支部隊，連同大半江防艦隊，一起投向了對岸。',
  wjoke:'你剛擋下的那位將軍，已經又當上將軍了。在對面。'},
 {name:'機場',date:'1949年5月',place:'機場',
  fact:'上海被包圍了。最後幾班飛機載走官員、檔案、親戚、家具和黃金。依照這個順序。',
  joke:'你在飛機上有保留座位。保留給一架鋼琴。',
  wfact:'1949年5月上海失守。最後幾天，官員、檔案和家產從空中和海上撤離。',
  wjoke:'飛機載著黃金和鋼琴起飛。你揮手道別。鋼琴沒有揮手。'},
 {name:'最後一艘船',date:'1949年5月',place:'上海碼頭',
  fact:'最後幾箱黃金正在上船。守住碼頭直到船開。之後這場仗，就是別的部門的事了。',
  joke:'金條有自己的船艙。你也有票：站票，下一班船。',
  wfact:'你守住了碼頭，船載著黃金開走了。不久之後，這座城市換了主人。',
  wjoke:'好消息：你的任務完美達成。壞消息：請翻下一頁。'}];
STAGES.forEach((s,i)=>s.zh=STAGE_ZH[i]);
const ED_ZH={looter:'趁火打劫的',clerk:'銀行職員',deserter:'逃兵',cadre:'共軍幹部',crowd:'擠兌人潮',speculator:'投機客',militia:'民兵',cart:'手推車隊',cavalry:'騎兵',sapper:'工兵',officer:'軍閥',
 insider:'內鬼',bmtruck:'黑市卡車',handcar:'裝甲軌道車',turncoat:'陣前起義的將軍',tank:'戰車（前任車主六位）',tank7:'同一輛戰車（車主第七位）'};
for(const k in ED_ZH)ED[k].zh={n:ED_ZH[k]};
const TD_ZH={rifle:['步槍班','步槍','可靠。每月發餉，理論上。'],mg:['機槍巢','機槍','射得快，射程短。彈藥是美援，帳單還沒付。'],mortar:['迫擊砲','迫砲','範圍傷害。打不到太近的東西，跟政策一樣。'],
 speaker:['擴音器','喊話','讓敵人減速。有些人會投誠，回頭打自己人。'],press:['印鈔機','印鈔','每波印一次錢。也順便印出通膨。']};
for(const k in TD_ZH)TD[k].zh={n:TD_ZH[k][0],s:TD_ZH[k][1],d:TD_ZH[k][2]};
const TKEYS=['rifle','mg','mortar','speaker','press'],TSHORT={rifle:'RIFLE',mg:'MG',mortar:'MORTAR',speaker:'SPEAKER',press:'PRESS'};
const TUN={rifle:0,mg:0,press:1,mortar:2,speaker:3};
const tOK=k=>TUN[k]<=LV;

/* ---------------- save ---------------- */
const SKEY='goldrun49';
function loadSave(){const s=store.get(SKEY,null)||{};const best=Array.isArray(s.best)?s.best:[];
 return{un:clamp(s.un|0||1,1,STAGES.length),best:STAGES.map((_,i)=>typeof best[i]==='number'?best[i]:-1),won:!!s.won,tot:Object.assign({k:0,p:0,d:0},s.tot||{})}}
let SAVE=loadSave();const saveNow=()=>store.set(SKEY,SAVE);
const starsOf=c=>c<0?0:c>=20?3:c>=14?2:1;

/* ---------------- state ---------------- */
let pend=null,M=null,PP=[],PL=[],pathTiles=new Set(),deco=new Map(),towers=[],ens=[],allies=[],shots=[],fxs=[],pops=[],G=null,selT=null,tsel=null,hover=null,fast=1,spawnQ=[],waveOn=false,msg=null,paused=false,spawnN=0,bossE=null,resBtns=[];
function start(i){LV=i;M=STAGES[i];pathTiles=new Set();deco=new Map();
 PP=M.paths.map(p=>p.map(([x,y])=>[x*TS+8,OY+y*TS+8]));PL=PP.map(pts=>{let l=0;for(let i=0;i<pts.length-1;i++)l+=Math.hypot(pts[i+1][0]-pts[i][0],pts[i+1][1]-pts[i][1]);return l});
 for(const P of M.paths)for(let i=0;i<P.length-1;i++){const[a,b]=[P[i],P[i+1]];const dx=Math.sign(b[0]-a[0]),dy=Math.sign(b[1]-a[1]);let x=a[0],y=a[1];while(true){pathTiles.add(x+','+y);if(x===b[0]&&y===b[1])break;x+=dx;y+=dy}}
 const inW=(x,y)=>M.water.some(([wx,wy,ww,wh])=>x>=wx&&x<wx+ww&&y>=wy&&y<wy+wh);
 const[gx,gy]=M.gold;deco.set(gx+','+gy,'gold');deco.set(gx+','+(gy-1),'gold2');for(const[dx,dy]of[[-1,0],[1,0],[-1,-1],[1,-1]]){const kk=(gx+dx)+','+(gy+dy);if(!pathTiles.has(kk))deco.set(kk,'occ')}
 for(const[k,x,y]of M.fixed){deco.set(x+','+y,k);const span={vaultdoor:[[0,1],[1,0],[1,1],[-1,0],[-1,1]],crane:[[1,0],[0,-1]],plane:[[1,0],[2,0],[3,0],[1,1],[2,1],[-1,0]],ship:[]}[k]||[];for(const[dx,dy]of span)deco.set((x+dx)+','+(y+dy),'occ')}
 const R_=seeded(1949+i*77);for(let y=0;y<GH;y++)for(let x=0;x<GW;x++){const kk=x+','+y;if(pathTiles.has(kk)||deco.has(kk))continue;
  if(inW(x,y)){deco.set(kk,'water');continue}if(M.rails&&M.rails.includes(y)){deco.set(kk,'rail');continue}
  let v=R_();for(const[d,p]of M.deco){if(v<p){deco.set(kk,d);break}v-=p}}
 G={crates:20,yuan:M.cash,inf:1,wave:0,kills:0,defected:0,printed:0};towers=[];ens=[];allies=[];shots=[];fxs=[];pops=[];spawnQ=[];waveOn=false;selT=null;tsel=null;fast=1;paused=false;spawnN=0;bossE=null;
 state='play';hideOv();msg={s:()=>LZ(M.name+' · '+M.waves+' WAVES',ZK(M,'name')+' · 共 '+M.waves+' 波'),t:0};if(M.newT)pops.push({x:W/2,y:OY+64,s:()=>LZ('NEW TOWER: '+TD[M.newT].n,'新單位：'+ZK(TD[M.newT],'n')),c:'#ffd24a',t:-60,big:1});music(M.mus)}
const price=k=>Math.round(TD[k].c*G.inf);
const upPrice=t=>Math.round(TD[t.k].c*.9*(t.lv+1)*G.inf);
const isFree=(x,y)=>x>=0&&y>=0&&x<GW&&y<GH&&!pathTiles.has(x+','+y)&&!deco.has(x+','+y)&&!towers.some(t=>t.x===x&&t.y===y);
function posAt(d,pi=0){const pts=PP[pi]||PP[0];let acc=0;for(let i=0;i<pts.length-1;i++){const[a,b]=[pts[i],pts[i+1]],l=Math.hypot(b[0]-a[0],b[1]-a[1]);if(acc+l>=d){const k=(d-acc)/l;return[a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k,Math.sign(b[0]-a[0])]}acc+=l}const e=pts[pts.length-1];return[e[0],e[1],1]}
const ePos=e=>posAt(e.dist,e.pi);
const left=e=>PL[e.pi]-e.dist;
function nextWave(){if(state!=='play'||paused||waveOn||G.wave>=M.waves)return;G.wave++;const w=G.wave,ew=w+M.off;waveOn=true;
 // printing presses pay out and inflate
 let inc=0,np=0;for(const t of towers)if(t.k==='press'){inc+=TD.press.lv[t.lv].inc;np++}
 if(inc){const pay=Math.round(inc*G.inf);G.yuan+=pay;G.printed+=pay;pops.push({x:W/2,y:60,s:()=>LZ('PRESSES PRINTED ¥','印鈔機印了 ¥')+fmtBig(pay),c:'#d9a441',t:0})}
 if(w>1){G.inf*=1.08+np*.03;pops.push({x:W/2,y:72,s:()=>LZ('PRICES +','物價 +')+Math.round((1.08+np*.03-1)*100)+'%',c:'#ff6a5a',t:-10})}
 const boss=w===M.waves;let budget=(45+w*30+M.off*3)*rampMul()*(boss?.6:1),b=0;const types=Object.keys(M.roster).filter(k=>M.roster[k]<=w);
 spawnQ=[];let gap=0;const np_=PP.length;
 while(b<budget){const k=pick2(types);const d=ED[k];const n=d.grp||1,pi=spawnN++%np_;for(let i=0;i<n;i++){spawnQ.push({k,at:gap,pi});gap+=d.grp?10:Math.max(14,40-ew)}b+=d.hp/10*n;gap+=10}
 if(boss){spawnQ.push({k:M.boss,at:Math.min(gap,240),pi:0});if(M.final)spawnQ.push({k:'militia',at:Math.min(gap,240)+30,pi:1},{k:'militia',at:Math.min(gap,240)+50,pi:1});
  msg={s:()=>LZ('BOSS: '+ED[M.boss].n,'魔王：'+ZK(ED[M.boss],'n')),t:0,boss:1};music(M.final?'final':'boss');SFX.alarm()}
 else msg={s:()=>LZ('WAVE '+w,'第 '+w+' 波'),t:60};
 X.horn()}
const rampMul=()=>M.mul<=1?M.mul:1+(M.mul-1)*Math.min(1,G.wave/6);// later maps start gentle and ramp up
const pick2=a=>a[Math.floor(rnd()*a.length)];
function spawn(q){const d=ED[q.k],ew=G.wave+M.off,hp=d.boss?d.hp*M.mul:d.hp*(1+G.wave*.085+M.off*.03)*rampMul();const e={k:q.k,d,hp,max:hp,dist:0,pi:q.pi||0,slow:1,fl:0,id:rnd(),anim:rnd()*20|0,face:1};ens.push(e);if(d.boss)bossE=e}

/* ---------------- update ---------------- */
function step(){T++;if(state==='ending')endT++;if(state!=='play'||paused){if(state==='win'||state==='lose')for(const f of fxs){f.x+=f.vx;f.y+=f.vy;f.l--};return}
 if(msg&&++msg.t>150)msg=null;for(const p of pops)p.t++;pops=pops.filter(p=>p.t<70);
 if(waveOn){for(const q of spawnQ)q.at--;const go=spawnQ.filter(q=>q.at<=0);spawnQ=spawnQ.filter(q=>q.at>0);for(const q of go)spawn(q);
  if(!spawnQ.length&&!ens.length){waveOn=false;const bon=Math.round(20*G.inf);G.yuan+=bon;if(G.wave>=M.waves)return win();if(G.wave===M.waves-1){msg={s:'NEXT: BOSS WAVE',t:0};}}}
 // enemies
 for(const e of ens){let sp=e.d.spd;const[ex]=ePos(e);const off=ens.find(o=>o.d.aura&&o!==e&&Math.abs(ePos(o)[0]-ex)<40&&Math.abs(o.dist-e.dist)<60);if(off)sp*=1.3;
  e.dist+=sp*e.slow;e.slow=Math.min(1,e.slow+.02);e.anim++;if(e.fl>0)e.fl--;const dir=ePos(e)[2];if(dir)e.face=dir;
  if(e.dist>=PL[e.pi]){e.dead=1;G.crates=Math.max(0,G.crates-e.d.steal);const[gx,gy]=M.gold;pops.push({x:gx*TS+8,y:OY+gy*TS-14,s:()=>'-'+e.d.steal+LZ(' CRATE'+(e.d.steal>1?'S':''),' 箱'),c:'#ff6a5a',t:0});SFX.alarm();if(e===bossE)bossE=null;if(G.crates<=0)return lose()}}
 // allies (defectors) walk back
 for(const a of allies){a.dist-=.7;a.anim++;const[ax,ay]=ePos(a);for(const e of ens){if(e.dead)continue;const[x,y]=ePos(e);if(Math.abs(x-ax)<8&&Math.abs(y-ay)<8){e.hp-=1.2;a.hp-=1;e.fl=2;if(e.hp<=0)killE(e)}}if(a.hp<=0||a.dist<=0)a.dead=1}
 // towers
 for(const t of towers){const st=TD[t.k].lv[t.lv],cx=t.x*TS+8,cy=OY+t.y*TS+8;t.cd--;
  const inR=e=>{const[x,y]=ePos(e);const d=Math.hypot(x-cx,y-cy)/TS;return d<=st.range&&(!TD[t.k].min||d>=TD[t.k].min)};
  if(t.k==='speaker'){for(const e of ens)if(!e.dead&&inR(e)){e.slow=Math.min(e.slow,st.slow);if(!e.d.boss&&e.d.k!=='cart'&&rnd()<st.conv){e.dead=1;allies.push({k:e.k,d:e.d,dist:e.dist,pi:e.pi,hp:e.hp*1.5,anim:0,face:-e.face});G.defected++;const[x,y]=ePos(e);pops.push({x,y:y-20,s:pick2(['I DEFECT!','SAME WAR, BETTER RICE?','WHERE DO I SIGN?','WHICH SIDE IS THIS?']),c:'#9fe0a0',t:0})}}if((T+t.x*37+t.y*11)%150===0)t.talk=pick2(['SURRENDER!','WE HAVE RICE!','GOLD IS SAFE!','GO HOME!','PAY DAY SOON!']);continue}
  if(t.k==='press'){if(T%30===0)fxs.push({x:cx+(rnd()-.5)*6,y:cy-6,vx:(rnd()-.5)*.6,vy:-.8,l:40,c:'#8aa070',bill:1});continue}
  if(t.cd>0)continue;let tgt=null;for(const e of ens)if(!e.dead&&inR(e)&&(!tgt||left(e)<left(tgt)))tgt=e;if(!tgt)continue;
  t.cd=st.rate;const[ex,ey]=ePos(tgt);t.face=ex>cx?1:-1;t.muz=4;
  if(t.k==='mortar'){shots.push({x0:cx,y0:cy-6,x1:ex,y1:ey,t:0,dur:34,dmg:st.dmg,splash:st.splash});tone(200,90,.15,'sine',.08)}
  else{hitE(tgt,st.dmg);shots.push({line:1,x0:cx+t.face*6,y0:cy-6,x1:ex,y1:ey-6,t:0,dur:4});t.k==='mg'?SFX.hmg():SFX.shot()}}
 for(const s of shots){s.t++;if(!s.line&&s.t===s.dur){SFX.boom();for(let i=0;i<14;i++)fxs.push({x:s.x1,y:s.y1,vx:(rnd()-.5)*3,vy:-rnd()*3,l:20,c:pick2(['#ffe27a','#ff8a1a','#555'])});for(const e of ens){if(e.dead)continue;const[x,y]=ePos(e);if(Math.hypot(x-s.x1,y-s.y1)<=s.splash*TS)hitE(e,s.dmg)}}}
 shots=shots.filter(s=>s.t<s.dur);
 for(const f of fxs){f.x+=f.vx;f.y+=f.vy;f.vy+=f.bill?0:.15;f.l--}fxs=fxs.filter(f=>f.l>0);
 ens=ens.filter(e=>!e.dead);allies=allies.filter(a=>!a.dead)}
function hitE(e,dmg){if(e.dead)return;const d=Math.max(1,dmg-(e.d.armor||0));e.hp-=d;e.fl=4;if(e.hp<=0)killE(e)}
function killE(e){if(e.dead)return;e.dead=1;G.kills++;const b=Math.round(e.d.b*Math.sqrt(G.inf));G.yuan+=b;const[x,y]=ePos(e);pops.push({x,y:y-14,s:'+¥'+fmtBig(b),c:'#d9a441',t:0});
 if(e.d.boss){SFX.boom(true);bossE=null;msg={s:pick2(['BOSS DOWN','THREAT REDISTRIBUTED','GOLD STILL SAFE (FOR NOW)']),t:0};music(M.mus);for(let i=0;i<30;i++)fxs.push({x,y:y-8,vx:(rnd()-.5)*4,vy:-rnd()*4,l:30,c:pick2(['#ffe27a','#ff8a1a','#555','#d9a441'])})}
 for(let i=0;i<6;i++)fxs.push({x,y:y-6,vx:(rnd()-.5)*2,vy:-rnd()*2,l:16,c:'#a8201a'})}
function win(){state='win';msg=null;tsel=null;selT=null;const prev=SAVE.best[LV];SAVE.best[LV]=Math.max(prev,G.crates);G.record=G.crates>prev&&prev>=0;SAVE.un=Math.max(SAVE.un,Math.min(STAGES.length,LV+2));
 SAVE.tot.k+=G.kills;SAVE.tot.p+=G.printed;SAVE.tot.d+=G.defected;if(M.final)SAVE.won=true;saveNow();music('ending');SFX.fanfare&&SFX.fanfare();
 for(let i=0;i<40;i++)fxs.push({x:rnd()*W,y:-rnd()*60,vx:(rnd()-.5)*.6,vy:.6+rnd(),l:300,c:pick2(['#d9a441','#ffd24a','#8aa070'])})}
function lose(){state='lose';tsel=null;selT=null;music('off');SFX.die()}
const X={horn:()=>{const t=AC?AC.currentTime:0;[62,67,71].forEach((n,i)=>tone(mf(n),mf(n),.3,'sawtooth',.04,t+i*.12))}};

/* ---------------- render: map ---------------- */
const tileXY=(x,y)=>[x*TS,OY+y*TS];
const GROUND={vault:['#4a4552','#433e4b'],bund:['#3e3a2c','#38341f'],rail:['#4a4038','#443a32'],docks:['#4a3e32','#443828'],air:['#3d4a2c','#37432a'],ship:['#4e4236','#463a2e']};
function drawPathTile(px,py,v,x,y){const id=M.id,over=M.water.some(([wx,wy,ww,wh])=>x>=wx&&x<wx+ww&&y>=wy&&y<wy+wh);
 if(over||id==='docks'||id==='ship'){if(over){r(px,py,TS,TS,'#2c3c5a')}r(px+1,py,14,TS,'#7a5a3a');for(let i=0;i<4;i++)r(px+1,py+i*4,14,1,'#5a4028');if(over){r(px,py,1,TS,'#3a2a1a');r(px+15,py,1,TS,'#3a2a1a')}return}
 if(id==='vault'){r(px,py,TS,TS,'#6a2626');r(px+2,py+2,12,12,v<2?'#7a2e2c':'#742a28');if(v===1)r(px+6,py+6,4,4,'#9a5a30');return}
 if(id==='rail'){r(px,py,TS,TS,v<2?'#6a5a48':'#625240');r(px+3,py+4,3,2,'#7a6a56');r(px+10,py+10,3,2,'#544636');return}
 if(id==='air'){r(px,py,TS,TS,v<2?'#77736a':'#6f6b62');r(px,py+15,TS,1,'#5a574f');return}
 r(px,py,TS,TS,v<2?'#6a6260':'#5e5654');r(px+2,py+3,5,4,'#77706c');r(px+9,py+9,5,4,'#77706c')}
function drawDeco(d,x,y){const[px,py]=tileXY(x,y);
 switch(d){
 case 'water':r(px,py,TS,TS,'#2c3c5a');r(px+((T>>3)+x*5)%14,py+6+(y%2)*4,4,1,'#6a8ab0');break;
 case 'house':r(px+1,py+4,14,12,'#5b4636');r(px,py+2,16,3,'#1a1216');r(px+6,py+8,4,5,'#d9843a');if((x+y)%3===0&&M.id!=='ship'){const fl=(T>>2)%3;r(px+3,py-2-fl,4,4,'#ff8a1a')}break;
 case 'tree':r(px+7,py+6,2,10,'#2a1e18');r(px+3,py+1,10,7,'#2f4a2a');break;
 case 'lamp':r(px+7,py+2,2,14,'#2a2a2a');r(px+5,py,6,3,'#ffd88a');ctx.globalAlpha=.12;r(px,py-2,16,10,'#ffd88a');ctx.globalAlpha=1;break;
 case 'pillar':r(px+3,py+13,10,3,'#8a8494');r(px+5,py-4,6,17,'#b8b0c0');r(px+6,py-4,1,17,'#d8d0e0');r(px+3,py-6,10,3,'#d8d0e0');break;
 case 'desk':r(px,py+5,16,2,'#7a5230');r(px+1,py+7,14,7,'#5a3a20');r(px+11,py+1,3,4,'#3a7a4a');r(px+12,py+5,1,1,'#ccc');r(px+2,py+4,6,1,'#e9dcc2');break;
 case 'safe':r(px+3,py+4,10,11,'#3a3a42');r(px+3,py+4,10,1,'#5a5a64');r(px+7,py+8,3,3,'#9a9a9a');break;
 case 'rail':r(px,py+4,TS,9,'#3e342c');for(let i=0;i<4;i++)r(px+i*4+1,py+4,2,9,'#4a3020');r(px,py+5,TS,1,'#9a9aa2');r(px,py+11,TS,1,'#9a9aa2');
  if(y===0&&(x+((T/40)|0))%9<3){r(px,py+1,TS,10,'#5a2a20');r(px,py+1,TS,2,'#3a1a14');r(px+2,py+11,3,3,'#1a1a1a');r(px+11,py+11,3,3,'#1a1a1a')}break;
 case 'coal':r(px+2,py+9,12,6,'#1a1a1a');r(px+4,py+6,8,4,'#222');r(px+6,py+5,2,1,'#444');break;
 case 'crate':r(px+3,py+5,10,9,'#8a6a3a');r(px+3,py+5,10,1,'#aa8a5a');r(px+3,py+9,10,1,'#5a4020');r(px+7,py+5,1,9,'#5a4020');break;
 case 'signal':r(px+7,py+1,2,15,'#2a2a2a');r(px+5,py,6,5,'#1a1a1a');r(px+6,py+1,2,2,(T>>5)%2?'#e0302a':'#3a1a14');break;
 case 'bollard':r(px+5,py+8,6,7,'#2a2a2a');r(px+4,py+7,8,2,'#3a3a3a');break;
 case 'drum':r(px+2,py+6,5,9,'#5a6a3a');r(px+8,py+5,5,10,'#4a5a30');r(px+2,py+9,5,1,'#3a4a24');r(px+8,py+9,5,1,'#3a4a24');break;
 case 'sandbag':for(let i=0;i<3;i++)r(px+1+i*5,py+10,5,4,'#9a8660');for(let i=0;i<2;i++)r(px+3+i*5,py+7,5,4,'#8a7650');break;
 case 'vaultdoor':{const cx=px+8,cy=py+10;r(px-14,py-6,44,32,'#5a5260');r(px-14,py-6,44,2,'#7a7080');ctx.fillStyle='#9a92a4';ctx.beginPath();ctx.arc(cx,cy,12,0,6.29);ctx.fill();ctx.fillStyle='#6a6274';ctx.beginPath();ctx.arc(cx,cy,9,0,6.29);ctx.fill();
  const a=T/90;for(let i=0;i<3;i++){const an=a+i*2.09;seg(cx,cy,cx+Math.cos(an)*8,cy+Math.sin(an)*8,2,'#c8c0d0')}r(cx-2,cy-2,4,4,'#d9a441');hanV('金庫',px+26,py-4,'#d9a441',8);break}
 case 'crane':r(px+6,py-26,4,42,'#5a4a3a');r(px-10,py-28,36,3,'#6a5a4a');seg(px-8,py-25,px-8,py-8+Math.sin(T/40)*3,1,'#222');r(px-11,py-8+Math.sin(T/40)*3,6,4,'#d9a441');break;
 case 'plane':{const x0=px-16,y0=py+4;r(x0,y0,70,10,'#7a8070');r(x0+60,y0-2,12,8,'#6a7060');r(x0-4,y0+2,6,6,'#5a6050');r(x0+2,y0+2,4,3,'#9fc3d6');r(x0+20,y0-6,24,4,'#6a7060');r(x0+22,y0+10,20,3,'#6a7060');r(x0+64,y0-10,6,10,'#6a7060');
  emblem('kmt',x0+46,y0+1);r(x0+28,y0+14,3,4,'#1a1a1a');const pr=(T>>1)%2;r(x0-6,y0+(pr?0:6),2,6,'#aaa');r(x0+30,y0+1,10,8,'#3a3a3a');tiny('PIANO',x0+35,y0-14,'#e9dcc2','center');seg(x0+35,y0-8,x0+35,y0+1,1,'#e9dcc2');break}
 case 'ship':{const x0=px-4,y0=py,bob=Math.round(Math.sin(T/30));r(x0,y0+bob,68,150,'#3a3e46');r(x0,y0+bob,68,3,'#6a6e76');r(x0+6,y0+bob+12,56,40,'#d8d0bc');for(let i=0;i<4;i++)r(x0+10+i*13,y0+bob+18,7,5,'#4a5a70');r(x0+28,y0+bob-10,12,24,'#2a2a2a');r(x0+28,y0+bob-10,12,3,'#2f4f8a');
  for(let k=0;k<4;k++){const a=((T*.3+k*16)%60);ctx.globalAlpha=.5-a/120;r(x0+30-a*.4,y0-14-a*.6,5+k,5+k,'#6a6a6a');ctx.globalAlpha=1}
  r(x0+48,y0+bob+60,1,24,'#222');r(x0+49,y0+bob+60,12,8,'#b8322a');r(x0+49,y0+bob+60,6,4,'#2f4f8a');r(x0+51,y0+bob+61,2,2,'#f2f2f2');for(let i=0;i<7;i++)r(x0+6+i*9,y0+bob+140,3,3,'#1e2026');break}
 }}
function drawGold(){const[gx,gy]=M.gold,[px,py]=tileXY(gx,gy);for(let i=0;i<G.crates;i++)r(px+(i%5)*6-7,py+11-(i/5|0)*5,5,4,i%2?'#d9a441':'#b8862a');if(G.crates&&T%90<6)r(px-7+((T>>1)%30),py+11-((G.crates-1)/5|0)*5,2,2,'#fff8d0')}
function drawMap(){for(let y=0;y<GH;y++)for(let x=0;x<GW;x++){const[px,py]=tileXY(x,y),k=x+','+y,v=((x*7+y*13)%5);
 if(pathTiles.has(k))drawPathTile(px,py,v,x,y);
 else{const g=GROUND[M.id];r(px,py,TS,TS,v<2?g[0]:g[1]);if(M.id==='vault'){r(px,py,TS,1,'#55505e');r(px,py,1,TS,'#55505e')}else if(v===3)r(px+5,py+6,2,2,'#2a2418');
  if(M.runway&&M.runway.includes(y)){r(px,py,TS,TS,'#5a5850');if(y===M.runway[0])r(px+2,py+15,8,2,'#d8d0bc')}}}
 const late=[];for(const[k,d]of deco){if(d==='occ'||d==='gold'||d==='gold2')continue;const[x,y]=k.split(',').map(Number);if(d==='ship'||d==='plane'||d==='vaultdoor'||d==='crane')late.push([d,x,y]);else drawDeco(d,x,y)}
 for(const[d,x,y]of late)drawDeco(d,x,y);drawGold()}

/* ---------------- render: units ---------------- */
function drawEnemy(e,ally){const[x,y]=ePos(e),d=e.d;const fc=e.face||1;ctx.save();ctx.translate(Math.round(x),Math.round(y)+6);const fl=e.fl>0&&T%2;
 if(d.k==='tank'){const s=1.1;r(-17,-14,34,10,fl?'#fff':'#5d6447');r(-11,-20,20,7,fl?'#ddd':'#434833');r(fc>0?7:-22,-18,15,2,'#2a2a26');r(-17,-5,34,5,'#262622');for(let i=-15;i<17;i+=6)r(i,-4,3,3,'#555');
  for(let i=0;i<(d.flag?7:6);i++)r(-15+i*4,-12,2,2,i===6?'#e0302a':'#e9dcc2');if(d.flag){r(-2,-34,1,14,'#222');r(-1,-34,10,6,'#b8322a');r(1,-33,2,2,'#f1d27a')}}
 else if(d.k==='truck'){ctx.scale(fc,1);r(-18,-6,36,4,'#1a1612');r(-18,-18,24,13,fl?'#fff':'#4a4a40');r(6,-15,12,10,fl?'#ddd':'#6a5a3a');r(10,-13,6,4,'#6d8a96');for(const wx of[-14,8]){r(wx,-4,7,6,'#151210');r(wx+2,-2,3,2,'#555')}
  for(let i=0;i<4;i++)r(-16+i*5,-22,4,4,i%2?'#d9a441':'#8aa070');r(-16,-18,22,1,'#2a2a22');ctx.scale(fc,1);tiny('RICE?',0,-30,'#e9dcc2','center')}
 else if(d.k==='handcar'){ctx.scale(fc,1);r(-14,-6,28,4,fl?'#fff':'#3a3a42');r(-12,-2,5,4,'#151210');r(7,-2,5,4,'#151210');r(10,-20,6,14,fl?'#ddd':'#5a5a62');r(11,-17,2,3,'#1a1a1a');
  const pm=Math.sin(e.anim/6)*4;seg(-2,-14,-2-pm,-20,2,'#7a5230');seg(-2,-14,-2+pm,-8,2,'#7a5230');ctx.save();ctx.scale(.5,.5);drawSoldier(-22,-12,{fac:'ccp',face:1,emo:'grit',gun:null});drawSoldier(-2,-12,{fac:'ccp',face:-1,emo:'shout',gun:null});ctx.restore()}
 else if(d.k==='horse'||d.k==='turncoat'){const big=d.k==='turncoat';ctx.scale(big?.8:.58,big?.8:.58);if(ally)ctx.globalAlpha=.85;drawHorse(-16,0,fc,e.anim,big?'#e9dcc2':'#7a5232');
  const fac=big?((T>>5)%2?'kmt':'ccp'):d.fac;drawSoldier(fc>0?-10:-6,-16,{fac,face:fc,emo:ally?'happy':fl?'hurt':big?'smug':'shout',gun:big?null:'rifle',officer:big?1:0});if(big&&fl){}}
 else if(d.k==='cart'){r(-10,-10,20,6,'#5a4030');r(-8,-16,16,6,'#d9a441');r(-8,-4,4,4,'#2a1e18');r(4,-4,4,4,'#2a1e18');ctx.scale(.55,.55);drawCivilian(fc>0?-34:18,0,{face:fc,pose:'run',anim:e.anim,hat:'straw',emo:'smug'})}
 else if(d.k==='bigciv'){ctx.scale(.9,.9);drawCivilian(-8,0,{face:fc,pose:'run',anim:e.anim*.6,hat:'fedora',cl:'#2a2a3a',cl2:'#1a1a22',sash:'#d9a441',emo:fl?'hurt':'smug',shoe:'#111'});r(fc>0?-14:6,-26,10,14,'#b8862a');r(fc>0?-13:7,-28,8,3,'#8a6420');tiny('¥',fc>0?-9:11,-22,'#ffd24a','center',0)}
 else{ctx.scale(.58,.58);if(ally)ctx.globalAlpha=.85;
  if(d.k==='civ'){drawCivilian(-8,0,{face:fc,pose:'run',anim:e.anim,hat:d.hat,cl:d.cl,cl2:d.cl2,emo:ally?'happy':fl?'hurt':'smug'});if(d.sack)r(fc>0?-12:8,-22,7,9,'#b8862a')}
  else drawSoldier(-8,0,{fac:d.fac,face:fc,pose:'run',anim:e.anim,emo:ally?'happy':fl?'hurt':d.officer?'smug':'determined',gun:d.gun||null,officer:d.officer});
  if(ally){r(-4,-46,8,6,'#f4f4f4')}}
 ctx.restore();if(!ally&&e.hp<e.max&&!d.boss){r(x-8,y-14,16,2,'#2a0a0a');r(x-8,y-14,16*e.hp/e.max,2,'#c8372d')}}
function drawTower(t){const[px,py]=tileXY(t.x,t.y),cx=px+8,cy=py+8;
 if(t.k==='press'){r(px+1,py+3,14,12,'#4a4450');r(px+3,py+1,10,3,'#2a2830');r(px+3,py+8,10,2,'#8aa070');tiny('¥',cx,py+4,'#d9a441','center',0)}
 else if(t.k==='speaker'){r(cx-1,py,2,16,'#4a3a2a');r(cx-5,py-1,4,4,'#9a9a9a');r(cx+1,py-1,4,4,'#9a9a9a');if(t.talk&&(T+t.x*37+t.y*11)%150<60){const hw=tinyW(t.talk,9)/2+2;tiny(t.talk,clamp(cx,hw,W-hw),py-9,'#ffd24a','center',1,9)}}
 else{for(let i=0;i<4;i++)r(px+i*4,py+11,4,4,i%2?'#9a8660':'#8a7650');
  if(t.k==='mortar'){r(cx-2,py+3,4,9,'#3a3a3a');r(cx-3,py+2,6,2,'#555')}
  else{ctx.save();ctx.translate(px+8,py+12);ctx.scale(.5,.5);drawSoldier(-8,0,{fac:'kmt',face:t.face||1,pose:'crouch',gun:t.k==='mg'?'hmg':'rifle',muzz:t.muz>0,emo:t.muz>0?'grit':'determined'});ctx.restore();if(t.muz>0)t.muz--}}
 for(let i=0;i<t.lv;i++)r(px+1+i*4,py+1,3,3,'#ffd24a')}
function tIcon(k,x,y){switch(k){
 case 'rifle':r(x,y+3,12,2,'#262626');r(x+7,y+3,5,3,'#7a5230');break;
 case 'mg':r(x,y+2,12,3,'#262626');r(x+3,y+5,1,3,'#555');r(x+8,y+5,1,3,'#555');break;
 case 'mortar':r(x+5,y,3,7,'#3a3a3a');r(x+2,y+7,9,1,'#555');break;
 case 'speaker':r(x+5,y+2,2,6,'#4a3a2a');r(x+1,y,4,3,'#9a9a9a');r(x+7,y,4,3,'#9a9a9a');break;
 case 'press':r(x+1,y+1,10,7,'#4a4450');r(x+3,y+4,6,1,'#8aa070');break}}
let btns=[];
function hud(){r(0,0,W,OY,'#120d0c');r(0,OY-1,W,1,'#3a2e26');btns=[];const zh=LANG==='zh';
 r(3,3,6,5,'#d9a441');r(3,3,6,1,'#ffd24a');txt(String(G.crates),12,2,G.crates<8?'#ff6a5a':'#d9a441');txt('¥'+fmtBig(G.yuan),3,13,'#e9dcc2');
 if(zh){tiny('波次',46,2,'#a8977c');tinyPx(G.wave+'/'+M.waves,68,3,G.wave===M.waves?'#ff8a3a':'#e9dcc2');tiny('物價',46,13,'#a8977c');tinyPx('×'+G.inf.toFixed(2),68,14,G.inf>2?'#ff6a5a':'#e9dcc2')}
 else{tiny('WAVE',46,3,'#a8977c');tiny(G.wave+'/'+M.waves,66,3,G.wave===M.waves?'#ff8a3a':'#e9dcc2');tiny('PRICE',46,9,'#a8977c');tiny('×'+G.inf.toFixed(2),46,15,G.inf>2?'#ff6a5a':'#e9dcc2')}
 TKEYS.forEach((k,i)=>{const x=94+i*35,on=tsel===k,ok=tOK(k),afford=ok&&G.yuan>=price(k);r(x,2,33,20,on?'#3a2a12':'#1d1513');r(x,2,33,1,on?'#ffd24a':'#3a2e26');
  if(!ok){if(!zh)tinyPx(String(i+1),x+2,4,'#4a3e34');tiny(LZ('LOCKED','未解鎖'),x+17,zh?8:9,'#4a3e34','center',1,9);return}
  if(zh){tIcon(k,x+20,4);tiny(ZK(TD[k],'s'),x+2,4,afford?'#e9dcc2':'#6e6050','left',1,9);tinyPx('¥'+fmtBig(price(k)),x+17,15,afford?'#d9a441':'#6e6050','center')}
  else{tinyPx(String(i+1),x+2,4,'#6e6050');tIcon(k,x+18,3);tinyPx(TSHORT[k],x+17,12,afford?'#e9dcc2':'#6e6050','center');tinyPx('¥'+fmtBig(price(k)),x+17,17,afford?'#d9a441':'#6e6050','center')}
  btns.push({x,y:0,w:33,h:23,f:()=>{tsel=tsel===k?null:k;selT=null;pend=null}})});
 const can=!waveOn&&G.wave<M.waves,bx=270,bw=G.wave===M.waves-1;r(bx,2,40,20,can?(bw?'#4a1410':'#3a1a12'):'#1d1513');if(can&&T%50<25)r(bx,2,40,1,'#ffd24a');
 if(zh){if(can){tiny('下一波',bx+20,4,'#ffd24a','center',1,10);if(bw)tiny('魔王',bx+20,13,'#ff8a3a','center',1,9);else for(let k=0;k<2;k++)for(let j=0;j<3;j++)r(bx+15+k*5+j,15+j,1,5-j*2,'#ffd24a')}else tiny('進攻中',bx+20,8,'#6e6050','center',1,9)}
 else{tinyPx(can?'NEXT':'WAVE',bx+20,6,can?'#ffd24a':'#6e6050','center');tinyPx(can?(bw?'BOSS':'WAVE'):'...',bx+20,13,can?(bw?'#ff8a3a':'#ffd24a'):'#6e6050','center')}
 btns.push({x:bx,y:0,w:40,h:23,f:nextWave});
 const sb=(x,on,f,draw)=>{r(x,2,22,20,on?'#3a2a12':'#1d1513');draw(x);btns.push({x,y:0,w:22,h:23,f})};
 sb(313,fast>1,()=>{fast=fast>1?1:3},x=>tinyPx(fast>1?'×3':'×1',x+11,10,fast>1?'#ffd24a':'#a8977c','center'));
 sb(337,paused,()=>{paused=!paused},x=>{r(x+8,7,2,10,'#e9dcc2');r(x+12,7,2,10,'#e9dcc2')});
 sb(361,false,toggleMute,x=>{r(x+5,9,3,6,'#e9dcc2');r(x+8,7,2,10,'#e9dcc2');if(muted){seg(x+12,8,x+17,15,1,'#ff6a5a');seg(x+17,8,x+12,15,1,'#ff6a5a')}else{r(x+12,9,1,6,'#e9dcc2');r(x+15,7,1,10,'#e9dcc2')}});
 if(tsel&&!paused){const s=pend?LZ('TAP THE TILE AGAIN TO BUILD · TAP ELSEWHERE TO MOVE','再點一次同一格確認建造 · 點別格改位置'):ZK(TD[tsel],'n')+LZ(': ','：')+ZK(TD[tsel],'d');r(0,H-12,W,12,'rgba(12,9,8,.88)');tiny(s,W/2,H-9,pend?'#ffd24a':'#e9dcc2','center')}
 else if(!G.wave&&!waveOn&&!towers.length&&!selT&&!paused&&T%80<60){r(0,H-12,W,12,'rgba(12,9,8,.7)');tiny(LZ('PICK A UNIT IN THE TOP BAR, THEN AN EMPTY TILE','先點上方的單位，再點空地建造'),W/2,H-9,'#ffd24a','center')}
 if(selT){const t=selT,[px,py]=tileXY(t.x,t.y),bw2=78,bx2=clamp(px+8-bw2/2,2,W-bw2-2),by=py>OY+40?py-26:py+19;r(bx2-1,by-1,bw2+2,26,'#120d0c');
  tiny(ZK(TD[t.k],'n')+' Lv'+(t.lv+1),bx2+bw2/2,by-9,'#ffd24a','center',1,9);
  const cell=(x,lab,val,col,f)=>{r(x,by,38,24,'#1e150c');r(x,by,38,1,col);tiny(lab,x+19,by+3,col,'center',1,10);tinyPx(val,x+19,by+15,col,'center');btns.push({x,y:by,w:38,h:24,f})};
  if(t.lv<2){const c=upPrice(t);cell(bx2,LZ('UPGRADE','升級'),'¥'+fmtBig(c),G.yuan>=c?'#ffd24a':'#6e6050',()=>{if(G.yuan>=c){G.yuan-=c;t.paid+=c;t.lv++;SFX.oneup()}else SFX.clang()})}
  else cell(bx2,LZ('MAX','滿級'),'LV3','#6e6050',()=>{});
  const sv=Math.round(t.paid*.5);cell(bx2+40,LZ('SELL','賣掉'),'¥'+fmtBig(sv),'#e9dcc2',()=>{G.yuan+=sv;towers=towers.filter(o=>o!==t);selT=null;SFX.pick()})}
 if(bossE&&!bossE.dead){const w=150,x=W/2-w/2,y=OY+3;r(x-1,y-1,w+2,5,'#120d0c');r(x,y,w,3,'#3a1714');r(x,y,w*Math.max(0,bossE.hp/bossE.max),3,'#e0302a');tiny(ZK(bossE.d,'n'),W/2,y+5,'#ffd24a','center',1,9)}}
function obtn(label,x,y,w,f,hot){const on=hot&&T%50<30;r(x,y,w,18,'#1e150c');r(x,y,w,1,'#d9a441');r(x,y+17,w,1,'#6e6050');tiny(label,x+w/2,y+7,on?'#ffd24a':'#d9a441','center');btns.push({x,y,w,h:18,f})}
function render(){if(state==='ending'){drawEnding();return}if(state!=='play'&&state!=='win'&&state!=='lose'){camX=(T*.3)%300;if(!BGD)buildBG();drawBG();ctx.drawImage(VIG,0,0);return}
 ctx.fillStyle='#120d0c';ctx.fillRect(0,0,W,H);drawMap();
 const list=ens.map(e=>[e,false]).concat(allies.map(a=>[a,true])).sort((a,b)=>ePos(a[0])[1]-ePos(b[0])[1]);
 for(const t of towers)drawTower(t);for(const[e,a]of list)drawEnemy(e,a);
 for(const s of shots){if(s.line){r(s.x1-1,s.y1-1,3,3,'#ffe27a');ctx.strokeStyle='rgba(255,226,122,.7)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(s.x0,s.y0);ctx.lineTo(s.x1,s.y1);ctx.stroke()}else{const k=s.t/s.dur,x=lerp2(s.x0,s.x1,k),y=lerp2(s.y0,s.y1,k)-Math.sin(k*Math.PI)*40;r(x-1,y-1,3,3,'#2a2a2a')}}
 for(const f of fxs)f.bill?(r(f.x-2,f.y,5,2,'#8aa070')):r(f.x,f.y,2,2,f.c);
 if(hover&&tsel&&state==='play'){const[x,y]=hover,ok=isFree(x,y),[px,py]=tileXY(x,y);ctx.globalAlpha=.35;r(px,py,TS,TS,ok?'#9fe0a0':'#ff6a5a');ctx.globalAlpha=1;const st=TD[tsel].lv[0];if(st.range){ctx.strokeStyle='rgba(255,255,255,.4)';ctx.beginPath();ctx.arc(px+8,py+8,st.range*TS,0,6.28);ctx.stroke()}}
 if(selT){const st=TD[selT.k].lv[selT.lv],[px,py]=tileXY(selT.x,selT.y);if(st.range){ctx.strokeStyle='rgba(255,210,74,.5)';ctx.beginPath();ctx.arc(px+8,py+8,st.range*TS,0,6.28);ctx.stroke()}}
 for(const p of pops){if(p.t<0)continue;ctx.globalAlpha=1-p.t/70;const s=typeof p.s==='function'?p.s():p.s,w=tinyW(s)/2+2;tiny(s,clamp(p.x,w,W-w),p.y-p.t*.3,p.c,'center');ctx.globalAlpha=1}
 hud();if(msg)stxt(typeof msg.s==='function'?msg.s():msg.s,W/2,OY+40,msg.boss?'#ff8a3a':'#e9dcc2',msg.boss?12:14,msg.t<20?msg.t/20:msg.t>120?(150-msg.t)/30:1);
 if(paused&&state==='play'){r(0,OY,W,H-OY,'rgba(8,6,5,.8)');btns=btns.filter(b=>b.y<OY);stxt('PAUSED',W/2,62,'#ffd24a',22);tiny(LZ(M.name+' · WAVE '+G.wave+'/'+M.waves,ZK(M,'name')+' · 第 '+G.wave+'/'+M.waves+' 波'),W/2,80,'#a8977c','center');
  obtn('RESUME',W/2-55,96,110,()=>{paused=false},1);obtn('RESTART STAGE',W/2-55,118,110,()=>start(LV));obtn('STAGE SELECT',W/2-55,140,110,openStages);obtn(LZ('LANGUAGE: 中文','語言：ENGLISH'),W/2-55,162,110,()=>applyLang(LANG==='zh'?'en':'zh',true))}
 if(state==='win'||state==='lose')drawResult();
 ctx.drawImage(VIG,0,0)}
function drawResult(){const w=state==='win',zh=LANG==='zh';r(0,0,W,H,'rgba(8,6,5,.86)');btns=[];if(w)for(const f of fxs)if(f.l>200||f.vy>.5)r(f.x,f.y,2,3,f.c);
 stxt(w?(M.final?'THE LAST SHIP SAILS':'STAGE CLEAR'):'THE GOLD HAS BEEN REDISTRIBUTED',W/2,22,w?'#ffd24a':'#b3261e',w?20:15);
 tiny((LV+1)+' · '+ZK(M,'name'),W/2,36,'#a8977c','center');
 if(w){const s=starsOf(G.crates);for(let i=0;i<3;i++){const x=W/2-24+i*18,on=i<s;r(x+3,48,6,10,on?'#ffd24a':'#3a2e26');r(x,51,12,4,on?'#ffd24a':'#3a2e26');r(x+1,56,3,3,on?'#d9a441':'#3a2e26');r(x+8,56,3,3,on?'#d9a441':'#3a2e26')}}
 const fact=w?ZK(M,'wfact'):LZ('Bank runs and gold riots hit Shanghai as the Gold Yuan collapsed. The crowd took the gold.','金圓券崩盤，上海爆發擠兌和搶金風潮。群眾把黃金拿走了。'),
  joke=w?ZK(M,'wjoke'):LZ('By morning the city had the gold and you had Gold Yuan. Try again: the gold still needs you.','到了早上，市民拿到了黃金，你拿到了金圓券。再試一次：黃金還需要你。');
 let y=w?66:54;
 if(zh){ctx.font=ZF(11);const fl=wrapPx(fact,W-48),jl=wrapPx(joke,W-48);fl.forEach(l=>{txt(l,W/2,y,'#e9dcc2','center');y+=14});y+=2;jl.forEach(l=>{txt(l,W/2,y,'#ff9a6a','center');y+=14})}
 else{wrap(fact,46).forEach(l=>{txt(l,W/2,y,'#e9dcc2','center');y+=10});y+=3;wrap(joke,46).forEach(l=>{txt(l,W/2,y,'#ff9a6a','center');y+=10})}
 tiny(LZ('CRATES SAVED '+G.crates+'/20'+(w&&G.record?' (NEW BEST)':'')+' · STOPPED '+G.kills+' · DEFECTED '+G.defected+' · PRINTED ¥'+fmtBig(G.printed),
  '保住黃金 '+G.crates+'/20 箱'+(w&&G.record?'（新紀錄）':'')+' · 擋下 '+G.kills+' · 投誠 '+G.defected+' · 印鈔 ¥'+fmtBig(G.printed)),W/2,y+6,'#a8977c','center');
 const by=H-26;if(w){obtn(M.final?'SAIL (ENDING)':'NEXT STAGE',W/2-112,by,108,afterWin,1);obtn('STAGE SELECT',W/2+4,by,108,openStages)}
 else{obtn('RETRY',W/2-112,by,108,()=>start(LV),1);obtn('STAGE SELECT',W/2+4,by,108,openStages)}}
const lerp2=(a,b,k)=>a+(b-a)*k;
function afterWin(){if(M.final)sail();else brief(LV+1)}

/* ---------------- story pages (briefings + the ending) ---------------- */
let endPages=[],endPg=0,endT=0,endFull=false,endExit=null,endSkip=null;
function startEnding(pages,exit,skip){endPages=pages;endPg=0;endT=0;endFull=false;endExit=exit;endSkip=skip||null;state='ending';hideOv()}
function endNext(){if(state!=='ending')return;if(!endFull){endT=9999;return}endPg++;endT=0;endFull=false;SFX.tally();if(endPg>=endPages.length){const f=endExit;endExit=null;f&&f()}}
function endSky(a,b){const g=ctx.createLinearGradient(0,0,0,136);g.addColorStop(0,a);g.addColorStop(1,b);ctx.fillStyle=g;ctx.fillRect(0,0,W,136)}
function endSea(t,y0,c1='#2a4a70',c2='#6a8ab0'){r(0,y0,W,136-y0,c1);for(let i=0;i<26;i++)r((i*37+i*i*3+t*.3)%(W+20)-10,y0+3+(i%7)*Math.max(2,(136-y0-4)/7),6+(i%3)*4,1,c2)}
function endShip(x,y,t){y+=Math.round(Math.sin(t/20)*1.5);
 for(let k=0;k<5;k++){const a=((t*.4+k*14)%70);ctx.globalAlpha=.55-a/140;r(x+60-a*.6,y-50-a*.5,6+k,5+k,'#6a6a6a');ctx.globalAlpha=1}
 r(x+30,y-30,50,16,'#d8d0bc');r(x+30,y-30,50,2,'#f0e8d4');for(let i=0;i<5;i++)r(x+34+i*9,y-26,5,4,'#4a5a70');r(x+58,y-46,10,16,'#2a2a2a');r(x+58,y-46,10,3,'#2f4f8a');
 r(x+104,y-48,1,34,'#222');r(x+105,y-48,14,9,'#b8322a');r(x+105,y-48,7,5,'#2f4f8a');r(x+107,y-47,3,3,'#f2f2f2');
 r(x,y-14,120,14,'#3a3e46');r(x+4,y,112,4,'#2a2d33');r(x-6,y-18,10,6,'#3a3e46');r(x+116,y-18,10,6,'#3a3e46');r(x,y-15,120,1,'#6a6e76');
 for(let i=0;i<8;i++)r(x+8+i*14,y-9,3,3,'#1e2026');return y-15}
function bankFront(x,t){r(x,10,170,126,'#5a5060');r(x,10,170,4,'#7a7080');for(let i=0;i<5;i++)r(x+8+i*32,30,10,90,'#7a7080');hanV('銀行',x+150,16,'#d9a441',12);r(x+60,92,40,44,'#1a1416')}
const PV=v=>typeof v==='function'?v():tr(v);
const CREDITS_EN=[['GOLD RUN 1949'],['THE GOLD','THE RESERVES (NOW ABROAD)'],['STRATEGY','HEADQUARTERS (ALREADY ON BOARD)'],['PAYROLL','GOLD YUAN (DECORATIVE)'],['PRINTING','ONE PRESS, WORKING OVERTIME'],['AIR SUPPORT','ONE PIANO'],['FINANCIAL ADVICE','A SEAGULL'],['NEUTRAL OBSERVER','A DONKEY'],['GARRISON','YOU'],['RETURN TRIP','NEXT YEAR']];
const CREDITS_ZH=[['黃金大轉進 1949'],['黃金','國庫儲備（現居海外）'],['戰略指導','總部（已登船）'],['軍餉','金圓券（僅供裝飾）'],['印刷','印鈔機一台（日夜加班）'],['空中支援','一架鋼琴'],['理財顧問','一隻海鷗'],['中立觀察員','一頭驢子'],['守備部隊','你'],['回程','明年']];
function drawCredits(t){endSky('#05060f','#141a34');for(let i=0;i<40;i++)r((i*97)%W,(i*53)%90,1,1,i%3?'#6a6a8a':'#e9dcc2');endSea(t,150,'#0e1428','#2a3a60');
 ctx.save();ctx.translate(Math.round(W-60-t*.25),0);ctx.scale(.5,.5);endShip(0,312,t);ctx.restore();ctx.drawImage(VIG,0,0);
 const C=LANG==='zh'?CREDITS_ZH:CREDITS_EN,zh=LANG==='zh',sp=zh?30:26,stop=96-(C.length-1)*sp,y0=Math.max(H+8-t*.45,stop);endFull=y0<=stop;
 for(let i=0;i<C.length;i++){const y=y0+i*sp;if(y<-20||y>H+10)continue;const[a,b]=C[i];
  if(b==null)stxt(a,W/2,y,'#ffd24a',zh?18:16);else{tiny(a,W/2,y-(zh?13:9),'#a8977c','center');txt(b,W/2,y,'#e9dcc2','center')}}
 if(endFull&&T%40<26)for(let i=0;i<5;i++)r(W-16+i,H-14+i,1,10-2*i,'#d9a441')}
function drawEnding(){const p=endPages[endPg];if(!p)return;const t=endT,zh=LANG==='zh';ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
 if(p.credits){drawCredits(t);return}
 if(p.card){endSky('#05060f','#1a1f3a');endSea(t,96,'#121a30','#3a4a70');const sx=((t*.35)%(W+180))-150;ctx.save();ctx.translate(Math.round(sx),0);ctx.scale(.6,.6);endShip(0,200,t);ctx.restore();
  r(0,128,W,H-128,'#120d0c');r(0,128,W,2,'#d9a441');
  const a=Math.min(1,t/40),card=PV(p.card),LH=zh?12:9;stxt(PV(p.big),W/2,34,'#ffd24a',28,a);stxt(PV(p.small),W/2,62,'#e9dcc2',12,a);
  card.forEach((l,i)=>{if(t>40+i*30)tiny(l,W/2,134+i*LH,i===card.length-1?'#ff9a6a':i===0?'#ffd24a':'#e9dcc2','center')});
  endFull=t>40+card.length*30;if(endFull&&T%40<26)tiny(touchUI?LZ('TAP TO RETURN','點一下返回'):LZ('ENTER TO RETURN','按 Enter 返回'),W/2,H-9,'#6e6050','center');ctx.drawImage(VIG,0,0);return}
 ctx.save();ctx.beginPath();ctx.rect(0,0,W,136);ctx.clip();p.art(t);ctx.restore();ctx.drawImage(VIG,0,0);
 if(p.title){r(0,0,W,22,'rgba(8,6,5,.7)');stxt(PV(p.title),W/2,11,'#ffd24a',13)}
 r(0,136,W,H-136,'#120d0c');r(0,136,W,2,'#d9a441');txt(PV(p.date),8,zh?140:141,'#d9a441');tiny(PV(p.place),W-8,zh?141:143,'#a8977c','right');
 const shown=Math.floor(t*(zh?.7:1.4)),fz=PV(p.fact),jz=PV(p.joke);let n=0,fl,jl,LH=10,y0=153;
 if(zh){let sz=12;LH=15;for(;;){ctx.font=ZF(sz);fl=wrapPx(fz,W-16);jl=wrapPx(jz,W-16);if((fl.length+jl.length)*LH+2<=H-152||sz<=10)break;sz--;LH--}}
 else{ctx.font=F;fl=wrap(fz,47);jl=wrap(jz,47)}
 ctx.textAlign='left';ctx.textBaseline='top';
 const line=(l,y,c)=>{const v=[...l].slice(0,Math.max(0,shown-n)).join('');n+=[...l].length+1;ctx.fillStyle=c;ctx.fillText(v,8,y)};
 fl.forEach((l,i)=>line(l,y0+i*LH,'#e9dcc2'));jl.forEach((l,i)=>line(l,y0+2+fl.length*LH+i*LH,'#ff9a6a'));
 endFull=shown>n;if(endFull&&T%40<26)for(let i=0;i<5;i++)r(W-16+i,H-14+i,1,10-2*i,'#d9a441')}
/* briefing art, one per stage */
const BRIEF_ART=[
 t=>{endSky('#05060f','#1a1f3a');r(330,18,10,10,'#e9dcc2');bankFront(214,t);r(0,120,W,16,'#2a2630');
  for(let i=0;i<5;i++){const x=((t*.5+i*44)%240);drawCivilian(260-x,128,{face:-1,pose:'run',anim:t*.3+i*3,hat:'straw',emo:'determined'});r(260-x-2,104,14,8,'#b8862a');r(260-x-2,104,14,1,'#ffd24a')}
  r(10,96,46,26,'#3a3e46');r(54,104,14,18,'#2a2d33');r(14,120,8,8,'#111');r(44,120,8,8,'#111');drawSoldier(80,128,{fac:'kmt',face:1,emo:'grit',gun:'rifle'});
  r(80,40,104,14,'#e9dcc2');tiny('NOTHING TO SEE HERE',132,45,'#120d0c','center',0)},
 t=>sceneArt('bankrun',t),
 t=>{endSky('#4a4a50','#9a8a7a');r(0,112,W,24,'#4a4038');for(let x=0;x<W;x+=8)r(x,116,3,6,'#4a3020');r(0,117,W,1,'#9a9aa2');r(0,121,W,1,'#9a9aa2');
  const x0=Math.round(W-((t*.4)%(W+260)));for(let c=0;c<3;c++){const x=x0+60+c*62;r(x,78,58,34,c?'#5a2a20':'#3a3a42');r(x,78,58,3,'#2a1a14');r(x+4,112,8,6,'#111');r(x+44,112,8,6,'#111');
   for(let k=0;k<4;k++)drawCivilian(x+4+k*13,78,{face:-1,hat:k%2?'straw':'cap',cl:k%2?'#6a5040':'#5a6d90',emo:k===2?'scared':'determined'})}
  r(x0,84,60,28,'#2a2a30');r(x0+8,70,12,14,'#1a1a1a');r(x0+44,76,16,10,'#3a3a42');for(let k=0;k<4;k++){const a=(t*.6+k*12)%50;ctx.globalAlpha=.6-a/90;r(x0+10-a*.2+a*.5,62-a,8+k,7+k,'#7a7a7a');ctx.globalAlpha=1}
  drawSoldier(30,128,{fac:'kmt',face:1,emo:'scared',gun:'rifle'});drawSoldier(52,128,{fac:'kmt',face:1,emo:'grit',gun:'rifle'})},
 t=>{sceneArt('boats',t);drawSoldier(20,96,{fac:'kmt',face:1,emo:'scared',gun:'rifle'});r(4,96,60,40,'#3a2e22');r(40,40,96,14,'#e9dcc2');tiny('IMPASSABLE BARRIER',88,45,'#120d0c','center',0)},
 t=>{endSky('#3a3a4a','#b08a6a');r(0,104,W,32,'#3d4a2c');r(0,110,W,10,'#5a5850');for(let x=0;x<W;x+=24)r(x,114,10,2,'#d8d0bc');
  const x0=150;r(x0,82,150,18,'#7a8070');r(x0+136,74,20,14,'#6a7060');r(x0-8,86,10,10,'#5a6050');r(x0+40,72,60,6,'#6a7060');r(x0+30,100,80,4,'#6a7060');emblem('kmt',x0+110,86);for(let i=0;i<6;i++)r(x0+10+i*14,86,6,5,'#9fc3d6');
  r(x0+110,96,24,8,'#3a3a3a');seg(x0+118,104,x0+100,120,4,'#8a7650');r(x0+70,108,40,14,'#2a2a2a');r(x0+72,108,6,10,'#e9dcc2');for(let i=0;i<5;i++)r(x0+79+i*5,110,3,6,i%2?'#111':'#e9dcc2');tiny('PIANO',x0+90,126,'#ffd24a','center');
  drawSoldier(40,128,{fac:'kmt',face:1,emo:'cry',gun:null,item:'case'});drawCivilian(76,128,{face:1,hat:'fedora',cl:'#2a2a3a',emo:'smug'});r(96,112,14,10,'#6a4a2a');r(98,112,10,1,'#d9a441')},
 t=>{endSky('#0b0e20','#2a3050');endSea(t,96,'#1a2440','#3a5a80');r(0,92,170,8,'#5a4632');for(let x=0;x<170;x+=10)r(x,92,1,8,'#3a2e22');for(let i=0;i<4;i++)r(20+i*40,100,4,36,'#3a2e22');
  const d=endShip(210,112,t);for(let i=0;i<14;i++)r(222+(i%7)*11,d-5-(i/7|0)*5,9,5,i%2?'#d9a441':'#b8862a');seg(160,92,214,d,3,'#7a5a3a');
  for(let i=0;i<4;i++)drawSoldier(20+i*30,92,{fac:'kmt',face:1,emo:i===3?'scared':'determined',gun:'rifle'});
  const a=Math.sin(t/40);ctx.globalAlpha=.15;ctx.fillStyle='#fff8d0';ctx.beginPath();ctx.moveTo(0,10);ctx.lineTo(120+a*60,136);ctx.lineTo(180+a*60,136);ctx.fill();ctx.globalAlpha=1}];
function brief(i){const s=STAGES[i];LV=i;music(s.mus);startEnding([{date:()=>ZK(s,'date'),place:()=>ZK(s,'place'),title:()=>(i+1)+' · '+ZK(s,'name'),art:BRIEF_ART[i],fact:()=>ZK(s,'fact'),
 joke:()=>ZK(s,'joke')+(s.newT?LZ(' NEW UNIT: '+TD[s.newT].n+'.','新單位：'+ZK(TD[s.newT],'n')+'。'):'')}],()=>start(i),()=>start(i))}
/* the ending: the retreat to Taiwan, December 1949 (temporary) */
function sail(){music('ending');startEnding(goldEnding(),()=>{openStages()},null)}
function counterArt(t){endSky('#5a7aa0','#f0c890');endSea(t,84);r(0,108,W,28,'#c8b088');for(let x=0;x<W;x+=7)r(x,108,4,1,'#e0c8a0');
 const yr=1950+Math.min(76,(t/45)|0),flip=t%45;r(250,14,110,62,'#e9dcc2');r(250,14,110,8,'#b3261e');r(258,12,4,6,'#555');r(348,12,4,6,'#555');stxt(String(yr),305,42,'#120d0c',20);
 if(flip<8){r(250,22,110,(8-flip)*6,'#d8ccb2')}if(LANG==='zh'){tiny('PLAN: COUNTERATTACK',305,57,'#b3261e','center',0);tiny('NEXT YEAR',305,68,'#b3261e','center',0)}else{tiny('PLAN: COUNTERATTACK',305,62,'#b3261e','center',0);tiny('NEXT YEAR',305,68,'#b3261e','center',0)}
 r(20,20,26,92,'#b3261e');hanV('反攻大陸',33,24,'#f1d27a',18);
 for(let i=0;i<5;i++){const x=70+i*30;drawSoldier(x,118,{fac:'kmt',face:-1,emo:i===2?'sleep':(t>>5)%2?'grit':'determined',gun:'rifle',pose:(t>>4)%2&&i!==2?'crouch':'idle'});r(x+2,120,10,6,'#6a4a2a');r(x+4,119,6,1,'#3a2a1a')}
 txt('SAME PLAN.',140,36,'#120d0c','center')}
function goldEnding(){const c=SAVE.best.reduce((a,b)=>a+Math.max(0,b),0),k=SAVE.tot.k,pr=SAVE.tot.p;return[
 {date:()=>LZ('MAY 1949','1949年5月'),place:()=>LZ('THE SHANGHAI DOCKS','上海碼頭'),title:()=>LZ('MISSION ACCOMPLISHED','任務達成'),art:t=>{endSky('#0b0e20','#2a3050');endSea(t,96,'#1a2440','#3a5a80');r(0,92,170,8,'#5a4632');for(let x=0;x<170;x+=10)r(x,92,1,8,'#3a2e22');for(let i=0;i<4;i++)r(20+i*40,100,4,36,'#3a2e22');
   const d=endShip(210,112,t);for(let i=0;i<20;i++)r(222+(i%8)*11,d-5-(i>>3)*5,9,5,i%2?'#d9a441':'#b8862a');
   seg(160,92,214,d,3,'#7a5a3a');const cx=160+((t*.6)%54),cy=92+((t*.6)%54)/54*(d-92);r(cx-3,cy-6,9,5,'#ffd24a');
   for(let i=0;i<3;i++)drawSoldier(40+i*30,92,{fac:'kmt',face:1,emo:i===1?'cry':'determined',gun:'rifle'});
   const a=Math.sin(t/40);ctx.globalAlpha=.15;ctx.fillStyle='#fff8d0';ctx.beginPath();ctx.moveTo(0,10);ctx.lineTo(120+a*60,136);ctx.lineTo(180+a*60,136);ctx.fill();ctx.globalAlpha=1},
  fact:()=>LZ('Across six maps you saved '+c+' of 120 crates. The reserves sail for Taiwan, at night, with a large escort and a small receipt.','六張地圖下來，你保住了 '+c+'／120 箱。黃金儲備趁夜開往台灣，護航陣仗很大，收據很小一張。'),
  joke:()=>LZ('The receipt says TEMPORARY RELOCATION. Very temporary. It still says that.','收據上寫著：暫時遷移。非常暫時。到現在還是這樣寫。')},
 {date:()=>LZ('MAY 1949','1949年5月'),place:()=>LZ('SHANGHAI','上海'),art:t=>sceneArt('sidewalk',t),
  fact:()=>LZ('Shanghai changes hands. The new arrivals sleep on the sidewalks. The Gold Yuan finally reaches its true value.','上海換了主人。新來的部隊睡在騎樓下的人行道上。金圓券終於回到它真正的價值。'),
  joke:()=>LZ('Zero. Shopkeepers paper their walls with it. Cheaper than wallpaper.','零。店家拿它來糊牆，比壁紙便宜。')},
 {date:()=>LZ('DECEMBER 1949','1949年12月'),place:()=>LZ('TAIWAN STRAIT','台灣海峽'),art:t=>{endSky('#3a5a80','#f0b070');r(60,36,22,22,'#ffd88a');endSea(t,92);const d=endShip(130,114,t);
   r(162,d-11,46,9,'#4a3a2a');for(let i=0;i<5;i++)r(164+i*9,d-9,7,6,i%2?'#d9a441':'#ffd24a');tiny('1ST CLASS',185,d-24,'#ffd24a','center');
   drawSoldier(132,d,{fac:'kmt',face:1,emo:'smug',gun:null});drawSoldier(212,d,{fac:'kmt',face:-1,emo:'cry',gun:null});drawSoldier(148,d,{fac:'kmt',face:1,pose:'sit',emo:'sleep',gun:null});
   const f=Math.round(Math.sin(t/5)*2);r(146,d-22+f,8,5,'#8aa070');r(148,d-21+f,4,3,'#6a8a5a');
   const bx=((t*.5)%(W+60))-60;r(bx,118,34,6,'#6a4a2a');drawSoldier(bx+10,118,{fac:'kmt',face:1,emo:'determined',gun:null,item:'case'})},
  fact:()=>LZ('The gold left first. In December the government followed it to Taiwan. You guarded the gold perfectly, so it got a first-class cabin. You followed eventually, on a later boat.','黃金先走了。十二月，政府跟著黃金撤到台灣。你把黃金守得完美無缺，所以它分到頭等艙。你後來也跟上了，搭的是下一班船。'),
  joke:()=>LZ('Your back pay arrives on board, in Gold Yuan. You use it as a fan. Best use it ever had.','積欠的軍餉在船上補發了，用金圓券。你拿來搧風。這是它這輩子最好的用途。')},
 {date:()=>LZ('DECEMBER 1949','1949年12月'),place:()=>LZ('TAIPEI · TEMPORARY CAPITAL','台北 · 臨時首都'),art:t=>sceneArt('island',t),
  fact:()=>LZ('The capital moves to Taipei, temporarily. The gold goes into a vault, temporarily. You go into a barracks, temporarily.','首都遷到台北，暫時的。黃金進了金庫，暫時的。你進了營房，暫時的。'),
  joke:()=>LZ('TEMPORARY turns out to be a very long word.','後來才發現，「暫時」是一個非常長的詞。')},
 {date:()=>LZ('1950, 1951, 1952...','1950、1951、1952……'),place:()=>LZ('THE BEACH, EVERY NEW YEAR','海邊，每年元旦'),art:counterArt,
  fact:()=>LZ('Every New Year the order is the same: we counterattack the mainland next year. Keep your bags packed.','每年元旦，命令都一樣：明年就反攻大陸。行李不要拆。'),
  joke:()=>LZ('You pack in 1950. And 1951. And 1952. Next year is very patient. So is the gold.','1950年你打包好了。1951年也是。1952年也是。明年非常有耐心，黃金也是。')},
 {credits:1},
 {card:()=>LANG==='zh'?['黃金：安全。大陸：放錯地方了。','保住黃金 '+c+'／120 箱 · 擋下 '+k+' 人 · 守住地圖 6／6','印出鈔票 ¥'+fmtBig(pr)+'（上船後價值 ¥0）','打贏的內戰：0／1','遷移：暫時。非常暫時。','反攻：明年。（每年都是明年）']
  :['THE GOLD: SAFE. THE MAINLAND: MISPLACED.','CRATES SAVED: '+c+'/120 · STOPPED: '+k+' · MAPS HELD: 6/6','MONEY PRINTED: ¥'+fmtBig(pr)+' (WORTH ¥0 ON THE BOAT)','CIVIL WARS WON: 0/1','RELOCATION: TEMPORARY. VERY TEMPORARY.','COUNTERATTACK: NEXT YEAR. (EVERY YEAR.)'],
  big:()=>LZ('THE END','劇終'),small:()=>LZ('(TEMPORARILY)','（暫時）')}]}

/* ---------------- overlays: title + stage select ---------------- */
function hideOv(){$('#title').hidden=true;$('#stages').hidden=true}
function toTitle(){state='title';paused=false;$('#stages').hidden=true;$('#title').hidden=false;music('off');applyLang(LANG,false);$('#bPlay').focus()}
function openStages(){state='stages';paused=false;tsel=null;selT=null;pend=null;$('#title').hidden=true;music('off');const box=$('#stageList');box.innerHTML='';const zh=LANG==='zh';
 STAGES.forEach((s,i)=>{const b=document.createElement('button'),lock=i>=SAVE.un,st=starsOf(SAVE.best[i]);
  b.innerHTML=lock?`<span>${i+1} · ???</span><span class="lk">${zh?'尚未解鎖':'LOCKED'}</span>`:`<span>${i+1} · ${ZK(s,'name')}</span><span class="dt">${ZK(s,'date')} · ${ZK(s,'place')}</span><span class="st">${'★'.repeat(st)}${'☆'.repeat(3-st)}${SAVE.best[i]>=0?(zh?' 保住 '+SAVE.best[i]+'/20 箱':' '+SAVE.best[i]+'/20 CRATES'):''}</span>`;
  b.disabled=lock;if(!lock&&i===Math.min(SAVE.un-1,STAGES.length-1)&&!(SAVE.best[i]>=0))b.className='here';b.onclick=()=>{initAudio();brief(i)};box.appendChild(b)});
 $('#bEnd').hidden=!SAVE.won;const tot=SAVE.best.reduce((a,b)=>a+Math.max(0,b),0);
 $('#stTot').textContent=zh?'保住黃金：'+tot+'／120 箱'+(SAVE.won?' · 黃金已抵達台灣':''):'CRATES SAVED: '+tot+' / 120'+(SAVE.won?' · THE GOLD REACHED TAIWAN':'');
 resetArm=false;$('#bReset').textContent=zh?'清除存檔':'RESET SAVE';$('#stages').hidden=false;const f=box.querySelector('.here')||box.querySelector('button:not(:disabled)');f&&f.focus()}
function toggleMute(){initAudio();setMute(!muted);store.set(SKEY+'-mute',muted)}
let resetArm=false;
/* HTML text + language switch */
const ZH_HTML={h1:'黃金大轉進<span>1949 · 塔防 · 六張地圖</span>',rot:'把手機轉橫，黃金比較放得下',play:'守護黃金',cont:'繼續護金',sth:'黃金的撤退路線',back:'標題',end:'觀看結局',
 tag:'上海，1948–49年。國府的黃金儲備正趁著夜色悄悄運往台灣。全城的人都想留點紀念品：趁火打劫的、投機客、逃兵，最後還有共軍。你是護金部隊，從銀行金庫一路守到最後一艘船。至於戰爭打得怎樣，那是別的部門的事。',
 keys:'點上方的單位，再點空地建造。點已建好的單位可以升級或賣掉。<br>鍵盤：1–5 選單位 · 空白鍵 下一波 · F 加速 · P 暫停 · L 切換語言 · Esc 取消',
 fine:'諷刺作品。每一波物價都會上漲，你的印鈔機會讓它漲更快。這是笑話，也是歷史。進度自動存檔。'};
const EN_HTML={};document.querySelectorAll('[data-t]').forEach(el=>EN_HTML[el.dataset.t]=el.innerHTML);EN_HTML.cont='CONTINUE THE RUN';
function applyLang(l,save){LANG=l==='en'?'en':'zh';const zh=LANG==='zh';if(save)try{localStorage.setItem(LANG_KEY,LANG)}catch(e){}
 document.documentElement.lang=zh?'zh-Hant':'en';document.title=zh?'黃金大轉進 1949 Gold Run':'Gold Run 1949';
 document.querySelectorAll('[data-t]').forEach(el=>{const k=el.dataset.t;el.innerHTML=zh&&ZH_HTML[k]!=null?ZH_HTML[k]:EN_HTML[k]});
 const any=SAVE.best.some(b=>b>=0);$('#bPlay').innerHTML=any?(zh?ZH_HTML.cont:EN_HTML.cont):(zh?ZH_HTML.play:EN_HTML.play);
 if(touchUI)$('[data-t=keys]').innerHTML=zh?'點上方的單位，再點空地兩下建造。點已建好的單位可以升級或賣掉。<br>右上角：加速、暫停（可切換語言）、音效。':'Tap a unit in the top bar, then tap an empty tile twice to build. Tap a built unit to upgrade or sell it.<br>Top right: fast forward, pause (language switch inside), sound.';
 document.querySelectorAll('.lang button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.l===LANG)));
 const b=$('#bLang');b.textContent=zh?'EN':'中文';b.lang=zh?'en':'zh-Hant';b.setAttribute('aria-label',zh?'Switch to English':'切換為中文');
 cv.setAttribute('aria-label',zh?'黃金大轉進遊戲畫面':'Gold Run game screen');
 if(state==='stages')openStages();
 if(zh&&document.fonts)document.fonts.load(ZF(10),'國軍').catch(()=>{})}
/* ---------------- input ---------------- */
let touchUI=matchMedia('(pointer:coarse)').matches;
function toXY(e){const rc=cv.getBoundingClientRect();return[(e.clientX-rc.left)/rc.width*W,(e.clientY-rc.top)/rc.height*H]}
function build(tx,ty){const c=price(tsel);if(G.yuan>=c){G.yuan-=c;towers.push({k:tsel,x:tx,y:ty,lv:0,cd:0,paid:c,face:1});SFX.pick();for(let i=0;i<8;i++)fxs.push({x:tx*TS+8,y:OY+ty*TS+12,vx:(rnd()-.5)*2,vy:-rnd()*1.5,l:16,c:'#a8977c'});return true}
 pops.push({x:tx*TS+8,y:OY+ty*TS,s:()=>LZ('NOT ENOUGH ¥ (PRICES ROSE)','錢不夠（又漲價了）'),c:'#ff6a5a',t:0});SFX.clang();return false}
cv.addEventListener('pointerdown',e=>{initAudio();if(e.pointerType==='touch')touchUI=true;else if(e.pointerType==='mouse')touchUI=false;const[x,y]=toXY(e);if(state==='ending'){endNext();return}
 if(state!=='play'&&state!=='win'&&state!=='lose')return;
 for(const b of btns)if(x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h){b.f();return}
 if(state!=='play'||paused||y<OY)return;const tx=Math.floor(x/TS),ty=Math.floor((y-OY)/TS);const t=towers.find(o=>o.x===tx&&o.y===ty);
 if(t){selT=selT===t?null:t;tsel=null;pend=null;return}selT=null;
 if(tsel&&isFree(tx,ty)){
  // touch: first tap previews (ghost + range), second tap on the same tile builds
  if(e.pointerType==='touch'&&!(pend&&pend[0]===tx&&pend[1]===ty)){pend=[tx,ty];hover=[tx,ty];SFX.tally();return}
  if(build(tx,ty)){pend=null;if(e.pointerType==='touch'){tsel=null;hover=null}}}
 else if(tsel){pend=null}});
cv.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const[x,y]=toXY(e);hover=y>OY?[Math.floor(x/TS),Math.floor((y-OY)/TS)]:null});
addEventListener('keydown',e=>{if(e.code==='KeyL'&&state!=='title'&&state!=='stages'){applyLang(LANG==='zh'?'en':'zh',true);return}
 if(state==='stages'){const i=+e.key-1;if(i>=0&&i<STAGES.length&&i<SAVE.un){initAudio();brief(i)}else if(e.code==='Escape')toTitle();return}
 if(state==='ending'){if(e.code==='Enter'||e.code==='Space'){e.preventDefault();endNext()}else if(e.code==='Escape'){if(endSkip){const f=endSkip;endSkip=null;endExit=null;f()}else{endPg=endPages.length-1;endT=9999}}return}
 if(state==='win'||state==='lose'){if(e.code==='Enter'||e.code==='Space'){e.preventDefault();state==='win'?afterWin():start(LV)}else if(e.code==='Escape')openStages();return}
 if(state!=='play')return;initAudio();
 if(e.code==='KeyP'||(e.code==='Escape'&&!tsel&&!selT)){paused=!paused;return}if(e.code==='KeyM'){toggleMute();return}
 if(paused){if(e.code==='Enter'||e.code==='Space'){e.preventDefault();paused=false}return}
 const i='12345'.indexOf(e.key);if(i>=0&&tOK(TKEYS[i])){tsel=tsel===TKEYS[i]?null:TKEYS[i];selT=null;pend=null}if(e.code==='Space'){e.preventDefault();nextWave()}if(e.code==='KeyF')fast=fast>1?1:3;if(e.code==='Escape'){tsel=null;selT=null;pend=null}});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='play')paused=true});
$('#bPlay').onclick=()=>{initAudio();if(!SAVE.best.some(b=>b>=0))brief(0);else openStages()};
$('#bBack').onclick=toTitle;$('#bEnd').onclick=()=>{initAudio();sail()};
$('#bReset').onclick=e=>{const b=e.currentTarget,zh=LANG==='zh';if(!resetArm){resetArm=true;b.textContent=zh?'確定？再點一次':'SURE? TAP AGAIN';return}store.set(SKEY,{});SAVE=loadSave();openStages()};
document.querySelectorAll('.lang button').forEach(b=>b.addEventListener('click',()=>applyLang(b.dataset.l,true)));
$('#bLang').addEventListener('click',e=>{applyLang(LANG==='zh'?'en':'zh',true);e.currentTarget.blur()});
muted=!!store.get(SKEY+'-mute',false);
applyLang((()=>{try{const v=localStorage.getItem(LANG_KEY);if(v==='en'||v==='zh')return v}catch(e){}return 'zh'})(),false);
function fit(){const vw=innerWidth,vh=innerHeight,s=Math.min(vw/W,vh/H);cv.style.width=Math.floor(W*s)+'px';cv.style.height=Math.floor(H*s)+'px'}
addEventListener('resize',fit);fit();cv.style.touchAction='none';
let last=performance.now(),acc=0,hudShown=null;
function loop(nt){acc+=Math.min(100,nt-last);last=nt;while(acc>=16.67){acc-=16.67;for(let i=0;i<(state==='play'&&!paused?fast:1);i++)step()}render();
 const hs=state==='ending'||state==='win'||state==='lose';if(hs!==hudShown){hudShown=hs;$('#hud').hidden=!hs}requestAnimationFrame(loop)}
(document.fonts?Promise.all([document.fonts.load(F),document.fonts.load(SERIF(20)),document.fonts.load(ZF(10),'國軍'),document.fonts.load(ZF(11),'國軍')]):Promise.resolve()).catch(()=>{}).finally(()=>requestAnimationFrame(loop));
const ZRX=[[/^RICE: (.+)$/,m=>'米價：'+m[1]]];
/* ---------------- Chinese for fixed canvas strings (looked up by tr() at draw time) ---------------- */
const ZT={
 'I DEFECT!':'我投誠！','SAME WAR, BETTER RICE?':'同一場仗，伙食比較好？','WHERE DO I SIGN?':'在哪裡簽名？','WHICH SIDE IS THIS?':'這邊是哪邊？',
 'SURRENDER!':'投降吧！','WE HAVE RICE!':'我們有米！','GOLD IS SAFE!':'黃金很安全！','GO HOME!':'回家吧！','PAY DAY SOON!':'快發餉了！',
 'BOSS DOWN':'魔王倒下','THREAT REDISTRIBUTED':'威脅已重新分配','GOLD STILL SAFE (FOR NOW)':'黃金還安全（暫時）','NEXT: BOSS WAVE':'下一波：魔王',
 'PIANO':'鋼琴','RICE?':'米？','NOTHING TO SEE HERE':'這裡沒事','IMPASSABLE BARRIER':'長江天險','PLAN: COUNTERATTACK':'計畫：反攻','NEXT YEAR':'明年','SAME PLAN.':'同一個計畫。','1ST CLASS':'頭等艙',
 'PAUSED':'暫停','RESUME':'繼續','RESTART STAGE':'重新開始','STAGE SELECT':'選擇地圖',
 'THE LAST SHIP SAILS':'最後一艘船開走了','STAGE CLEAR':'黃金守住了','THE GOLD HAS BEEN REDISTRIBUTED':'黃金已被重新分配',
 'TEMPORARY':'暫時','SAIL (ENDING)':'開船（結局）','NEXT STAGE':'下一張地圖','RETRY':'再守一次'};
