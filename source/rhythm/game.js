/* ===================== BATTLE OF THE BANDS 1949 — a Civil Slug rhythm game ===================== */
let T=0,camX=0,S='kmt',EN='ccp',LV=0,skyFlash=0,skyFX=0,state='title';
let plats=[],scorch=[];const L={walls:[40,300],theme:'village',deep:null,weather:null};
function groundAt(){return GY}
const VIG=document.createElement('canvas');VIG.width=W;VIG.height=H;{const g=VIG.getContext('2d');const rg=g.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,W*.6);rg.addColorStop(0,'rgba(0,0,0,0)');rg.addColorStop(1,'rgba(6,2,2,.6)');g.fillStyle=rg;g.fillRect(0,0,W,H)}

/* ---------------- i18n core: 繁體中文 default, English optional (strings translated at draw time) ---------------- */
let LANG='zh';const LANG_KEY='bands.lang';
const ZFAM='"Noto Sans TC","Noto Sans CJK TC","PingFang TC","Microsoft JhengHei","Heiti TC","Source Han Sans TC","WenQuanYi Micro Hei",sans-serif';
const CJK_RE=/[⺀-鿿豈-﫿＀-￯　-〿]/;
const LZ=(e,z)=>LANG==='zh'?z:e;
const ZH=o=>LANG==='zh'&&o.zh?o.zh:o; // data objects carry their own zh block
function zf(font){const m=/(\d+)px/.exec(font||F),p=m?+m[1]:8;return p>=16?`700 16px ${ZFAM}`:p<=6?`500 8px ${ZFAM}`:`500 11px ${ZFAM}`}
const MISS=new Set();
function tr(s){if(LANG!=='zh'||typeof s!=='string')return s;const z=ZT[s];if(z!=null)return z;for(const[re,f]of ZRX){const m=re.exec(s);if(m)return f(m)}if(/[A-Z]{2}/.test(s)&&!CJK_RE.test(s))MISS.add(s);return s}
function wrapPx(s,maxW){const toks=String(s).match(/[A-Za-z0-9$%'’"“”.,!?:;\/+\-()*]+|\s+|[\s\S]/gu)||[];const out=[];let line='';
 for(const tk of toks){const test=line+tk;if(line.trim()&&ctx.measureText(test.trimEnd()).width>maxW&&!/^[，。、！？：；）」』…—,.!?)\s]/.test(tk)){out.push(line.trim());line=/^\s+$/.test(tk)?'':tk}else line=test}
 if(line.trim())out.push(line.trim());return out}
const isDark=c=>{const m=/^#([0-9a-f]{6})/i.exec(c);if(!m)return false;const v=parseInt(m[1],16);return((v>>16)*.3+((v>>8)&255)*.59+(v&255)*.11)<70};
const SERIF=s=>`900 ${s}px "Noto Serif TC","Noto Serif CJK TC","Songti TC",Georgia,${ZFAM}`;
function stxt(s,x,y,c,size,a=1,al='center',maxW=W-12){s=tr(String(s));ctx.font=SERIF(size);while(size>8&&ctx.measureText(s).width>maxW){size--;ctx.font=SERIF(size)}
 ctx.textAlign=al;ctx.textBaseline='middle';ctx.globalAlpha=a;ctx.fillStyle='#000';ctx.fillText(s,x+1,y+2);ctx.fillStyle=c;ctx.fillText(s,x,y);ctx.globalAlpha=1}
const fmtY=n=>Math.floor(n).toLocaleString('en-US');
function zhBig(n){n=Math.floor(n);const u=[[1e12,'兆'],[1e8,'億'],[1e4,'萬']];for(const[v,s]of u)if(n>=v){const q=n/v;return(q<100?+q.toFixed(1):Math.floor(q).toLocaleString('en-US'))+s}return String(n)}
const bigY=n=>LANG==='zh'?zhBig(n):fmtBig(n);

/* ---------------- new melodies for this game (the shared TRACKS live in core; these are added here) ---------------- */
TRACKS.polka={bpm:126,drums:'polka',bass:[0,null,null,null,null,null,null,null,7,null,null,null,null,null,null,null],stab:'polka',song:[
 ['C',[[0,72,2],[2,76,2],[4,79,2],[6,76,2],[8,84,4],[12,79,4]]],['G',[[0,83,2],[2,79,2],[4,74,2],[6,79,2],[8,83,4],[12,81,4]]],
 ['C',[[0,79,2],[2,76,2],[4,72,2],[6,76,2],[8,79,2],[10,81,2],[12,79,4]]],['G',[[0,77,2],[2,76,2],[4,74,4],[8,71,4],[12,67,4]]],
 ['F',[[0,77,3],[3,77,1],[4,81,2],[6,77,2],[8,72,4],[12,77,4]]],['C',[[0,76,3],[3,76,1],[4,79,2],[6,76,2],[8,72,4],[12,76,4]]],
 ['G',[[0,74,2],[2,76,2],[4,77,2],[6,79,2],[8,81,2],[10,83,2],[12,84,2],[14,83,2]]],['C',[[0,84,8],[8,79,4],[12,72,4]]]]};
TRACKS.ferry={bpm:176,drums:'boss',bass:[0,12,0,12,1,13,1,13,0,12,0,12,3,15,1,13],stab:'boss',song:[
 ['Dm',[[0,74,2],[2,75,2],[4,74,2],[6,72,2],[8,69,8]]],['Bb',[[0,70,2],[2,72,2],[4,74,2],[6,77,2],[8,75,8]]],
 ['Dm',[[0,81,4],[4,80,4],[8,81,2],[10,84,2],[12,86,4]]],['A',[[0,85,4],[4,81,4],[8,76,4],[12,73,4]]],
 ['Gm',[[0,79,2],[2,82,2],[4,86,2],[6,82,2],[8,79,2],[10,74,2],[12,79,4]]],['Dm',[[0,77,2],[2,81,2],[4,86,2],[6,81,2],[8,77,2],[10,74,2],[12,69,4]]],
 ['Bb',[[0,74,1],[1,77,1],[2,82,2],[4,81,1],[5,77,1],[6,74,2],[8,77,2],[10,79,2],[12,81,4]]],['A',[[0,85,6],[6,81,2],[8,76,2],[10,73,2],[12,69,4]]]]};

/* ---------------- songs (one name per track, shared by the tour and free play) ---------------- */
const SONGINFO={
 polka:{name:'OPENING NIGHT POLKA',sub:'Oom-pah for a village that did not ask.',zh:{name:'開幕之夜波卡舞曲',sub:'嗯吧、嗯吧，獻給一個沒人要求開演唱會的村子。'}},
 m2:{name:'PADDY FIELD SHUFFLE',sub:'The landlord dances. The tenants count.',zh:{name:'稻田搖擺舞',sub:'地主在跳舞，佃農在數拍子。'}},
 m1:{name:'MARCH OF THE UNPAID',sub:'Funk paid in Gold Yuan. Dance before it drops.',zh:{name:'欠餉進行曲',sub:'獻給領金圓券的士兵的放克。趁它貶值前快跳。'}},
 m3:{name:'THE COAT ARRIVES IN SPRING',sub:'A march for winter coats. Arriving in spring.',zh:{name:'冬衣春天到',sub:'獻給冬季制服的進行曲。準時送達（季節不對）。'}},
 m4:{name:'SHANGHAI NIGHTS (GOLD YUAN)',sub:'Swing for the bank run. Bring a wheelbarrow.',zh:{name:'夜上海，金圓券',sub:'擠兌專用搖擺樂。請自備推車。'}},
 ferry:{name:'HYPERINFLATION (FERRY MIX)',sub:'Tempo rises with prices. Last song ashore.',zh:{name:'惡性通膨（渡輪混音版）',sub:'節奏跟著物價一起漲。上船前的最後一首。'}},
 ending:{name:'TEMPORARY, FOREVER',sub:'A ballad for a retreat. Still temporary.',zh:{name:'暫時，永遠',sub:'一首慢歌，獻給一場暫時的撤退。至今仍然暫時。'}},
 m5:{name:'THE LAST FERRY',sub:'Rock for one ticket and four relatives.',zh:{name:'最後一班渡輪',sub:'獻給一張船票、四個親戚的搖滾樂。'}},
 boss:{name:'TANK WITH SIX OWNERS',sub:'Every side drove it. Nobody paid for fuel.',zh:{name:'換過六個主人的戰車',sub:'每一邊都開過它，沒有一邊付過油錢。'}},
 final:{name:'HYPERINFLATION',sub:'The original mix. Prices not included.',zh:{name:'惡性通膨',sub:'原始版本。物價另計。'}}};
const songName=k=>ZH(SONGINFO[k]).name;
const SONGS=[
 {k:'polka',theme:'village',loops:3,stars:1},{k:'m2',theme:'paddy',loops:3,stars:2},{k:'m1',theme:'river',loops:3,stars:2},
 {k:'m3',theme:'snow',loops:3,stars:3},{k:'m4',theme:'city',loops:3,stars:3},{k:'ferry',theme:'river',loops:3,stars:4},
 {k:'ending',theme:'river',loops:4,stars:1},{k:'m5',theme:'river',loops:2,stars:4},{k:'boss',theme:'village',loops:3,stars:4},{k:'final',theme:'city',loops:3,stars:5}];
const DIFFS=['EASY','NORMAL','HARD'];
const LANEC=['#c8372d','#d9a441','#d9a441','#c8372d'];
const KEYL={KeyD:0,KeyF:1,KeyJ:2,KeyK:3,ArrowLeft:0,ArrowDown:1,ArrowUp:2,ArrowRight:3};

/* ---------------- chart from the music engine ---------------- */
function stepTime(tr_,step,t0){const spb=60/tr_.bpm/4;let t=t0+step*spb;if(tr_.swing&&(step&15)%4===2)t+=spb*.33;return t}
function buildChart(song,diff){const tk=TRACKS[song.k],n=tk.song.length*16*song.loops,spb=60/tk.bpm/4;let lo=99,hi=0;for(const[,mel]of tk.song)for(const[,p]of mel){lo=Math.min(lo,p);hi=Math.max(hi,p)}
 const notes=[];let lastStep=-9,lastLane=-1;
 for(let st=0;st<n;st++){const bar=(st>>4)%tk.song.length,s=st&15,loop=Math.floor(st/(tk.song.length*16)),mel=tk.song[bar][1];
  if(loop===0&&bar<2&&diff===0)continue;
  for(const[q,p,len]of mel){if(q!==s)continue;if(diff===0&&(s%2||st-lastStep<3))continue;if(diff===1&&st-lastStep<2)continue;
   let lane=Math.min(3,Math.floor((p-lo)/(hi-lo+1)*4));if(lane===lastLane&&st-lastStep<=2&&diff<2)lane=(lane+(p%2?1:3))%4;
   const hold=len>=6&&diff>0?len:0;notes.push({st,lane,hold,t:stepTime(tk,st,0),te:hold?stepTime(tk,st+hold*.9,0):0});lastStep=st;lastLane=lane}
  if(diff===2&&(s===4||s===12)&&st-lastStep>=2&&bar%2===1){const lane=s===4?0:3;notes.push({st,lane,hold:0,t:stepTime(tk,st,0),te:0});lastStep=st}}
 return{notes,n,spb,tr:tk}}
/* sequencer step (mirrors the core music engine, but scheduled by the game so the chart is exact) */
function playStep(tk,step,t){const spb=60/tk.bpm/4,song=tk.song,bar=(step>>4)%song.length,s=step&15,[cn,mel]=song[bar],[root,tri]=CH[cn],dk=tk.drums;
 if(tk.swing&&s%4===2)t+=spb*.33;
 if(s===0&&bar%4===0&&dk!=='soft'&&dk!=='swing'&&dk!=='polka')DR.c(t);
 if(dk==='funk'){if(s===0||s===6||s===8||s===11)DR.k(t);if(s===4||s===12)DR.s(t);if(s%2===0)DR.h(t,s===14);if(bar%4===3&&s>=12){DR.s(t,.5+(s-12)*.15);DR.tom(t,260-(s-12)*40)}if(s===9&&bar%2)DR.s(t,.3)}
 else if(dk==='shuffle'){if(s===0||s===8||s===10)DR.k(t);if(s===4||s===12)DR.s(t,.8);DR.h(t,false,s%2?.6:1)}
 else if(dk==='march'){if(s===0||s===8)DR.k(t);if(s===4||s===12)DR.s(t);if(s===14||s===15||s===13&&bar%2)DR.s(t,.35);if(s%2===0)DR.h(t,false,.6)}
 else if(dk==='polka'){if(s===0||s===8)DR.k(t,.9);if(s===4||s===12)DR.s(t,.55);if(bar%8===7&&s>=12&&s%2===0)DR.s(t,.4);if(s===0&&bar===0)DR.c(t)}
 else if(dk==='swing'){if(s===0||s===8)DR.k(t,.6);if(s%4===0||s%4===2)DR.ride(t);if(s===4||s===12)DR.s(t,.35)}
 else if(dk==='rock'){if(s===0||s===4||s===8||s===10)DR.k(t);if(s===4||s===12)DR.s(t,1.1);if(s%2===0)DR.h(t,s===6||s===14);if(bar%2===1&&s>=12)DR.tom(t,240-(s-12)*35)}
 else if(dk==='boss'){if(s%4===0||s===14||s===10)DR.k(t);if(s===4||s===12)DR.s(t);DR.h(t,s%4===2)}
 else if(dk==='soft'){if(s===0)DR.k(t,.5);if(s===8)DR.s(t,.2)}
 if(tk.bass==='walk'){if(s%4===0){const w=[0,4,7,10][s/4|0];bass(root+w,t,spb*3.5,.28)}}else{const bp=tk.bass[s];if(bp!=null)bass(root+bp,t,spb*(dk==='soft'?3:dk==='polka'?2:.9),.3)}
 const st=tk.stab;
 if(st==='funk'){if(s===0)tri.forEach(n=>brass(n-12,t,spb*3,.05));if(s===6||s===10)tri.forEach(n=>brass(n-12,t,spb*.8,.045))}
 else if(st==='boss'){if(s===0||s===3||s===6)tri.forEach(n=>brass(n-12,t,spb*1.2,.05))}
 else if(st==='long'){if(s===0)tri.forEach(n=>brass(n-12,t,spb*14,.03))}
 else if(st==='jazz'){if(s===2||s===10)tri.forEach(n=>brass(n,t,spb*1.2,.03))}
 else if(st==='polka'){if(s===4||s===12)tri.forEach(n=>brass(n-12,t,spb*1.3,.045))}
 for(const[q,n,len]of mel)if(q===s)lead(n,t,spb*len*.92,.06,tk.wave)}

/* ---------------- the 1949 tour: six gigs, six rival troupes ---------------- */
const PROLOGUE={date:'LATE 1948',place:'HEADQUARTERS',
 fact:'The war is going badly. Headquarters has a plan: if the army cannot win the country, the band will win the crowd.',
 joke:'Your platoon trades its rifles for trumpets. Pay: Gold Yuan, by the sack. Morale: by the note.',
 zh:{date:'1948年底',place:'總部',fact:'戰況不妙。總部想出一個辦法：軍隊打不贏天下，就讓樂隊贏回民心。',joke:'你的排把步槍換成小號。軍餉：金圓券，論麻袋發。士氣：論音符算。'}};
const STAGES=[
 {k:'polka',place:'THE VILLAGE SQUARE',date:'JANUARY 1949',theme:'village',rival:'THE VILLAGE YANGGE TROUPE',style:'yangge',rn:3,d:0,need:40,drain:.6,loops:3,
  fee:5e5,buys:'ONE CHICKEN (THIN)',
  fact:'Tour stop one. One square, one well, two stages facing each other. Across the square: the Village Yangge Troupe, all waist drums and red silk.',
  joke:'Orders: "restore public confidence". Nobody said how. You assume: louder.',
  taunts:['OUR DRUMS ARE BIGGER!','LAND TO THE TILLER! AND TO THE DRUMMER!','NICE HORN. GOLD-PLATED, LIKE YOUR MONEY?'],
  news:'MEANWHILE: a northern city changes hands without a shot. Its brass band keeps its job. Different song list.',
  lose:'The crowd drifted across the square, toward the louder drums. Try again before they learn the words.',
  zh:{place:'村口廣場',date:'1949年1月',rival:'本村秧歌隊',buys:'一隻雞（瘦的）',
   fact:'巡演第一站。一座廣場、一口井，兩座舞台面對面。廣場對面是本村秧歌隊：腰鼓、紅綢，一應俱全。',
   joke:'上級命令：「恢復民眾信心」。沒說怎麼恢復。你判斷：大聲一點。',
   taunts:['我們的鼓比較大！','耕者有其田！鼓手也有！','喇叭不錯嘛，跟你們的錢一樣是鍍金的？'],
   news:'同一時間：北方某大城一槍未發就換了主人。城裡的軍樂隊保住了飯碗，只是歌單換了。',
   lose:'觀眾慢慢飄到廣場對面，往鼓聲大的那邊去。趁他們還沒學會歌詞，再來一次。'}},
 {k:'m2',place:'THE PADDY FAIR',date:'FEBRUARY 1949',theme:'paddy',rival:'THE LAND REFORM WAIST-DRUM CORPS',style:'drum',rn:3,d:0,need:50,drain:.8,loops:4,
  fee:8e6,buys:'ONE EGG',
  fact:'The spring fair: buffaloes, seedlings, and a rival troupe that hands out land deeds between songs. You hand out commemorative Gold Yuan.',
  joke:'The farmers use your notes to wrap seedlings. Surprisingly waterproof.',
  taunts:['ONE DEED PER CHORUS!','YOUR LANDLORD CALLED. HE IS PACKING.','WE TAKE REQUESTS. AND FIELDS.'],
  news:'MEANWHILE: peace talks begin. Both sides agree on exactly one thing: the venue.',
  lose:'The farmers liked your tune. They liked the land deeds more.',
  zh:{place:'稻田市集',date:'1949年2月',rival:'土改腰鼓隊',buys:'一顆蛋',
   fact:'春季市集：水牛、秧苗，還有一支每唱完一首就發一張地契的對手。你只能發紀念版金圓券。',
   joke:'農民拿你的鈔票包秧苗。意外地很防水。',
   taunts:['每段副歌送一張地契！','你家地主來電，他在打包了。','我們接受點歌，也接受分田。'],
   news:'同一時間：和談開始了。雙方只在一件事上有共識：開會地點。',
   lose:'農民喜歡你的曲子。他們更喜歡地契。'}},
 {k:'m1',place:'THE RIVER DOCK',date:'MARCH 1949',theme:'river',rival:"THE DOCKWORKERS' AGITPROP CHOIR",style:'choir',rn:4,d:1,need:52,drain:1,loops:4,
  fee:2e8,buys:'A BOWL OF RICE (SMALL)',unlock:'NEW: A DRUMMER. CONSCRIPTED, BUT HAS RHYTHM.',
  fact:'A river port. Crates stamped URGENT go south; nothing comes north. The dockworkers have a choir: one song, several demands.',
  joke:'Your pay arrives by boat: one crate of Gold Yuan. The porter charges two crates to carry it.',
  taunts:['EIGHT-HOUR DAY! FOUR-FOUR TIME!','THE CRATES ARE LEAVING. SO ARE YOU.','SING IT, COMRADES! IN UNISON!'],
  news:'MEANWHILE: the peace talks end. Somebody keeps the venue. Guess who.',
  lose:'The dockworkers sang along. To the other song.',
  zh:{place:'江邊碼頭',date:'1949年3月',rival:'碼頭工人宣傳合唱團',buys:'一碗飯（小碗）',unlock:'新團員：鼓手一名。抓兵抓來的，但節奏感很好。',
   fact:'江邊港口。蓋著「急件」的木箱一路往南運，沒有東西往北。碼頭工人組了合唱團：一首歌，很多訴求。',
   joke:'你的薪水坐船送到：一箱金圓券。挑夫說，搬一箱要收兩箱。',
   taunts:['八小時工作制！四四拍！','箱子都在走了，你們也快了。','同志們，齊唱！'],
   news:'同一時間：和談破裂。開會地點有人留下來了。猜猜是誰。',
   lose:'碼頭工人跟著唱了。唱的是另一首。'}},
 {k:'m3',place:'THE SNOWY CAMP',date:'APRIL 1949',theme:'snow',rival:'THE NORTHERN FRONT SONG & DANCE TROUPE',style:'army',rn:4,d:1,need:55,drain:1.2,loops:4,
  fee:6e9,buys:'ONE MATCHSTICK',
  fact:'A camp up north, where April is still winter. The coats ordered in October will arrive in spring. Your trumpet freezes to your lips.',
  joke:'The rival troupe has fur hats and a pot of stew. Half your crowd is just standing near the stew.',
  taunts:['WE HAVE STEW. YOU HAVE A MARCH.','NICE COAT. OH WAIT.','COME OVER! IT IS WARMER! LITERALLY!'],
  news:'MEANWHILE: the Yangtze is crossed. Your winter coats finally arrive. At the wrong river.',
  lose:'The stew won. The stew always wins.',
  zh:{place:'雪地營區',date:'1949年4月',rival:'北方前線文工團',buys:'一根火柴',
   fact:'北方營區，四月還是冬天。十月訂的冬衣，預計春天送到。你的小號凍在嘴唇上了。',
   joke:'對手有毛帽，還有一鍋燉肉。你一半的觀眾其實只是站在燉肉旁邊。',
   taunts:['我們有燉肉，你們有進行曲。','大衣不錯嘛。喔，你沒有。','過來這邊！比較暖！真的！'],
   news:'同一時間：共軍渡過長江。你們的冬衣終於送到了，送到另一條江。',
   lose:'燉肉贏了。燉肉永遠會贏。'}},
 {k:'m4',place:'THE SHANGHAI BALLROOM',date:'MAY 1949',theme:'city',rival:'THE UNDERGROUND JAZZ CELL',style:'jazz',rn:4,d:2,need:58,drain:1.4,loops:5,
  fee:3e11,buys:'HALF A MATCHSTICK',unlock:'NEW: A TUBA. THE TUBA OUTRANKS YOU.',
  fact:'Shanghai: chandeliers, champagne, and a bank run outside. The house band wears white jackets and prints leaflets on the back of the sheet music.',
  joke:'Cover charge: one wheelbarrow of Gold Yuan. Champagne: two. Tips: stop counting.',
  taunts:['SWING IS FOR THE MASSES, BABY.','WE PRINT LEAFLETS ON THE B-SIDE.','THE BANK CLOSED. WE DID NOT.'],
  news:'MEANWHILE: Shanghai changes hands. The ballroom keeps its house band. It already knew the new songs.',
  lose:'The jazz cell swung harder. Half your band asked for their address.',
  zh:{place:'上海舞廳',date:'1949年5月',rival:'地下爵士小組',buys:'半根火柴',unlock:'新團員：低音號一支。低音號官階比你高。',
   fact:'上海：水晶燈、香檳，舞廳外面是擠兌的人潮。駐場樂隊穿白西裝，在樂譜背面印傳單。',
   joke:'低消：一推車金圓券。香檳：兩推車。小費：別算了。',
   taunts:['搖擺樂屬於人民群眾，寶貝。','B面我們拿來印傳單。','銀行關門了，我們沒有。'],
   news:'同一時間：上海易手。舞廳的駐場樂隊照常上班，新歌他們早就會了。',
   lose:'爵士小組搖得更兇。你一半的團員跑去跟他們要地址。'}},
 {k:'ferry',place:'THE LAST FERRY PIER',date:'DECEMBER 1949',theme:'river',rival:"THE PEOPLE'S MASSED ORCHESTRA",style:'massed',rn:5,d:2,need:62,drain:1.7,loops:5,
  fee:9e13,buys:'NOTHING. THE BANK HAS ALSO BOARDED.',
  fact:'The last ferry: one gangplank, ten thousand passengers. Across the pier: brass, gongs, drums, and an army for a fan club.',
  joke:'The tempo rises with the prices. Win this and you win the Battle of the Bands. The war is a separate matter.',
  taunts:['WE BROUGHT A WHOLE ARMY OF FANS!','LAST FERRY! LAST SONG!','PLAY ON. WE ARE GOOD AT WAITING.','THAT BOAT IS NOT COMING BACK.'],
  news:'',
  lose:'The orchestra drowned you out. The ferry horn drowned out everybody.',
  zh:{place:'最後一班渡輪碼頭',date:'1949年12月',rival:'人民大聯合樂團',buys:'什麼都買不到。銀行也上船了。',
   fact:'最後一班渡輪：一條跳板，一萬名乘客。碼頭對面是史上最大的對手：銅管、鑼、鼓，外加一整支軍隊當後援會。',
   joke:'節奏跟物價一起往上衝。贏了，你就贏得樂隊大對決。戰爭是另一回事。',
   taunts:['我們帶了一整支軍隊的粉絲！','最後一班船！最後一首歌！','你們慢慢演，我們很會等。','那艘船不會回來了喔。'],
   news:'',lose:'大聯合樂團蓋過了你。渡輪的汽笛又蓋過了所有人。'}}];
const BANDLINES=[['THE GOLD YUAN IS STABLE!*','金圓券很穩定！*'],['*THIS IS NOT A PROMISE','*本承諾不具效力'],['MORE BRASS! LESS INFLATION!','銅管加量，通膨減量！'],['HOLD THE LINE! THE MELODY LINE!','守住防線！旋律線！'],['ENCORE! (PAID IN GOLD YUAN)','安可！（以金圓券支付）']];
const FREETAUNTS=[['OUR DRUMS ARE BIGGER!','YOUR CROWD IS LEAVING!','LAND TO THE TILLER!'],['我們的鼓比較大！','你的觀眾要走了！','耕者有其田！']];
const COMMENTS={S:['Flawless. Both armies are now trying to draft your band.','完美無瑕。現在兩邊的軍隊都想把你的樂隊抓去當兵。'],
 A:['The crowd loved it. Several soldiers deserted to join your rhythm section.','觀眾超愛。好幾個士兵逃兵，跑來加入你的節奏組。'],
 B:['Respectable. The village applauds, cautiously, in case the other side wins.','還算體面。村民小心翼翼地鼓掌，以防另一邊贏。'],
 C:['The crowd stayed out of politeness. And fear.','觀眾是出於禮貌才留下來的。還有恐懼。'],
 D:['Half the square went home. The other half went to the other stage.','一半的人回家了，另一半去了對面的舞台。'],
 F:['Your audience defected. They took the chairs.','你的觀眾投共了。椅子也一起搬走了。']};
const cm=g=>LZ(...COMMENTS[g]);

/* ---------------- state + saves ---------------- */
let sel=0,diff=1,G=null,run=null,offset=0,scroll=150,tsel=0;
const SAVEK='botb49.v1';
function loadSave(){G=store.get(SAVEK,null)||{};G.best=G.best||{};G.stage=G.stage||{};G.cleared=G.cleared||0;G.yuan=G.yuan||0;if(G.cdiff==null)G.cdiff=1;offset=G.offset||0;tsel=Math.min(G.cleared,STAGES.length-1)}
function save(){G.offset=offset;store.set(SAVEK,G)}
const roster=()=>['horn','horn','horn'].concat(G&&G.cleared>=3?['drum']:[]).concat(G&&G.cleared>=5?['tuba']:[]);
/* free-play unlocks: a tour song opens once its gig is reached; bonus tracks open when the tour is won */
function songStage(k){return STAGES.findIndex(s=>s.k===k)}
function songOpen(s){const i=songStage(s.k);return i>=0?i<=G.cleared:G.cleared>=STAGES.length}
const JUDGE=[['PERFECT',.045,1000,'#ffd24a'],['GREAT',.09,600,'#9fe0a0'],['OK',.135,250,'#9fd3ff']];
function startSong(i){if(!songOpen(SONGS[i])){SFX.hit();return}const s=SONGS[i];
 beginRun({k:s.k,theme:s.theme,loops:s.loops},diff,{label:()=>[LZ('FREE PLAY','自由演奏'),DIFFS[diff]],scroll:150,i,seed:i})}
function startStage(i){const st=STAGES[i],cd=G.cdiff,dn=clamp(st.d+cd-1,0,2);
 beginRun({k:st.k,theme:st.theme,loops:st.loops},dn,{label:()=>[LZ('GIG ','第 ')+(i+1)+LZ('/6',' / 6 場'),DIFFS[cd]],scroll:132+i*6+cd*14,stage:i,need:st.need,drain:st.drain*[.7,1,1.3][cd],seed:i})}
function beginRun(song,dn,o){initAudio();const ch=buildChart(song,dn);setTheme(song.theme,o.seed);const t0=AC.currentTime+2.6,ros=roster();scroll=o.scroll;
 run={song,i:o.i,dn,label:o.label,stage:o.stage,need:o.need||0,drain:o.drain||0,missP:o.stage!=null?3+o.stage*.3:4,ros,gain:1+.1*(ros.length-3),missM:ros.length>=5?.85:1,
  ch,t0,step:0,next:t0,notes:ch.notes.map(n=>Object.assign({},n,{t:n.t+t0,te:n.te?n.te+t0:0,hit:0,miss:0,held:0,holding:0})),score:0,combo:0,maxc:0,cnt:{PERFECT:0,GREAT:0,OK:0,MISS:0},
  loyal:60,fx:[],judg:null,lanesOn:[0,0,0,0],shout:null,taunt:null,tauntT:300,show:0,end:stepTime(ch.tr,ch.n,t0)+1.2,failed:false,paused:false};
 run.showAt=run.t0+(run.end-run.t0)*.7;music('off');state='play';$('#hud').hidden=false;hudLabels()}
function setTheme(th,seed=0){L.theme=th;L.weather=th==='snow'?'snow':th==='city'?'money':null;LV=seed+3;buildBG()}
function gnow(){return AC?AC.currentTime-offset/1000:0}
function laneDown(l){if(state!=='play'||!run||run.failed||run.paused)return;run.lanesOn[l]=1;const t=gnow();
 let best=null,bd=.2;for(const n of run.notes){if(n.hit||n.miss||n.lane!==l)continue;const d=Math.abs(n.t-t);if(d<bd){bd=d;best=n}if(n.t-t>.3)break}
 if(!best){X.tap(l);return}const j=JUDGE.find(([,w])=>bd<=w);if(!j){return}
 best.hit=1;if(best.hold){best.holding=1}judge(j,l,best);X.tap(l)}
function laneUp(l){if(!run)return;run.lanesOn[l]=0;if(run.paused)return;const t=gnow();for(const n of run.notes)if(n.holding&&n.lane===l){n.holding=0;if(t<n.te-.12){n.miss=1;run.combo=0;run.judg={s:'DROPPED',c:'#ff6a5a',t:0};loyal(-(run.missP-1)*run.missM)}else{n.held=1;run.score+=300;fxBurst(l,'#ffd24a')}}}
function judge(j,l,n){const[name,,pts,col]=j;run.cnt[name]++;run.combo++;run.maxc=Math.max(run.maxc,run.combo);run.score+=Math.round(pts*(1+Math.min(run.combo,100)/100));run.judg={s:name,c:col,t:0};
 loyal((name==='PERFECT'?1.3:name==='GREAT'?.9:.4)*run.gain);fxBurst(l,col);
 if(run.combo%25===0){run.shout={s:BANDLINES[(run.combo/25-1)%BANDLINES.length],t:110};SFX.oneup()}}
function loyal(d){run.loyal=clamp(run.loyal+d,0,100);if(run.loyal<=0&&!run.failed){run.failed=true;run.failT=0;music('off');X.fail()}}
function fxBurst(l,c){const x=laneX(l)+18;for(let i=0;i<10;i++)run.fx.push({x,y:JY,vx:(rnd()-.5)*3,vy:-rnd()*3,l:18,c})}
const HX=W/2-80,LW=40,JY=188;const laneX=l=>HX+l*LW;
const X={tap:(l)=>tone(1200+l*120,900,.03,'square',.012),fail:()=>{const t0_=AC.currentTime;tone(300,80,1.2,'sawtooth',.06,t0_);noise(1,.1,400,'lowpass',t0_)},
 gong:()=>{const t=AC.currentTime;tone(180,150,1.6,'sine',.25,t);tone(271,240,1.4,'triangle',.08,t);noise(.6,.12,1200,'bandpass',t)}};
/* pause = suspend the audio clock, so the chart and the music freeze together */
function pauseGame(){if(state!=='play'||!run||run.failed||run.paused)return;for(let l=0;l<4;l++)run.lanesOn[l]=0;for(const k in ptrLane)delete ptrLane[k];run.paused=true;try{AC.suspend()}catch(e){}hudLabels()}
function resumeGame(){if(!run||!run.paused)return;run.paused=false;try{AC.resume()}catch(e){}hudLabels()}
function quitSong(){const st=run&&run.stage!=null;if(run)run.paused=false;try{AC.resume()}catch(e){}run=null;state=st?'tour':'select';music('m3');hudLabels()}

/* ---------------- update ---------------- */
function update(){T++;if(state==='ending')endT++;if(state!=='play'||!run||run.paused)return;const t=gnow();
 if(!run.failed)while(run.next<AC.currentTime+.2&&run.step<run.ch.n){playStep(run.ch.tr,run.step,run.next);run.step++;run.next=run.t0+run.step*run.ch.spb}
 for(const n of run.notes){if(!n.hit&&!n.miss&&t-n.t>.135){n.miss=1;run.cnt.MISS++;run.combo=0;run.judg={s:'MISS',c:'#ff6a5a',t:0};loyal(-run.missP*run.missM);if(n.hold)n.te=0}
  if(n.holding&&t>=n.te){n.holding=0;n.held=1;run.score+=300;fxBurst(n.lane,'#ffd24a')}
  if(n.holding&&T%6===0)run.score+=10}
 if(run.judg)run.judg.t++;if(run.shout&&--run.shout.t<=0)run.shout=null;if(run.taunt&&--run.taunt.t<=0)run.taunt=null;
 // the rival troupe: taunts all song, then a showdown in the last stretch that pulls the crowd across the square
 if(!run.failed&&t>run.t0){if(--run.tauntT<=0){const st=run.stage!=null?STAGES[run.stage]:null;run.taunt={s:st?[st.taunts,st.zh.taunts]:FREETAUNTS,i:Math.floor(rnd()*99),t:130};run.tauntT=run.show?280:440}
  if(run.stage!=null&&!run.show&&t>run.showAt){run.show=1;run.showT=0;run.taunt={s:[['SHOWDOWN!'],['正面對決！']],i:0,t:100};X.gong()}
  if(run.show){run.showT++;if(t<run.end-1.2)loyal(-run.drain/60)}}
 for(const p of run.fx){p.x+=p.vx;p.y+=p.vy;p.vy+=.15;p.l--}run.fx=run.fx.filter(p=>p.l>0);
 if(run.failed){run.failT++;if(run.failT>180)finishSong()}else if(t>run.end)finishSong()}
function tauntText(tt){if(!tt)return'';const L_=LANG==='zh'?tt.s[1]:tt.s[0];return L_[tt.i%L_.length]}
function finishSong(){const r_=run;const tot=r_.notes.length||1,acc=(r_.cnt.PERFECT+r_.cnt.GREAT*.7+r_.cnt.OK*.35)/tot;r_.acc=acc;
 r_.grade=r_.failed?'F':acc>.95?'S':acc>.88?'A':acc>.75?'B':acc>.6?'C':'D';
 if(r_.stage!=null){const i=r_.stage,st=STAGES[i];r_.won=!r_.failed&&r_.loyal>=r_.need;
  if(r_.won){r_.firstWin=G.cleared<=i;G.cleared=Math.max(G.cleared,i+1);G.yuan+=st.fee;const b=G.stage[i];if(!b||r_.score>b.score)G.stage[i]={score:r_.score,grade:r_.grade};tsel=Math.min(G.cleared,STAGES.length-1)}}
 else{const key=r_.song.k+diff;const b=G.best[key];if(!r_.failed&&(!b||r_.score>b.score))G.best[key]={score:r_.score,grade:r_.grade}}
 save();state='result';rsel=0;music(r_.stage!=null&&r_.won?'m2':'ending');hudLabels()}

/* ---------------- render: band, rivals, venues ---------------- */
function horn(x,y,f){r(x+(f>0?12:-2),y-14,7,3,'#d9a441');r(x+(f>0?18:-4),y-16,3,7,'#ffd24a')}
function bandMember(kind,bx,y,f,pose,emo){drawSoldier(bx,y,{fac:'kmt',face:f,pose,emo,gun:null});
 if(kind==='horn')horn(bx,y,f);
 else if(kind==='drum'){const dx=bx+(f>0?6:0);r(dx,y-15,11,9,'#e9dcc2');r(dx,y-15,11,2,'#2f4f8a');r(dx,y-8,11,2,'#2f4f8a');r(dx+(T>>3)%2*6,y-19,2,5,'#a07a42')}
 else{const tx=bx+(f>0?8:-6);r(tx+2,y-16,6,12,'#d9a441');r(tx,y-28,12,4,'#ffd24a');r(tx+2,y-24,8,8,'#d9a441');r(tx+4,y-22,4,3,'#7a5a20')}}
function drawBand(x,y,beat,mood,ros){ros=ros||roster();const sp=ros.length>4?18:ros.length>3?22:24,emo=mood>0?'happy':mood<0?'scared':'determined';
 ros.forEach((k,i)=>{const bob=(beat+i)%2?-3:0;bandMember(k,x+i*sp,y+bob,1,(beat+i)%4===0?'jump':'idle',emo)})}
function rivalMember(style,i,bx,y,beat,emo,f){const up=(beat+i)%2,sty=style==='massed'?(i%2?'yangge':'army'):style;
 if(sty==='army'){drawSoldier(bx,y,{fac:'ccp',face:f,pose:'idle',emo,gun:null});if(i%2){const dx=bx+(f>0?6:-2);r(dx,y-15,12,9,'#b8322a');r(dx,y-15,12,2,'#ffd24a');r(dx+up*7,y-20,2,5,'#a07a42')}else{const gx=bx+(f>0?12:-10);r(gx+4,y-34,1,8,'#3a2a20');r(gx,y-27,10,10,'#c99a3a');r(gx+2,y-25,6,6,'#e8c060')}return}
 if(sty==='jazz'){drawCivilian(bx,y,{face:f,hat:'fedora',cl:'#e9dcc2',cl2:'#2a2a2a',sash:'#b8322a',emo,arm:up?'up':null});const sx=bx+(f>0?10:-2);r(sx+2,y-18,3,12,'#d9a441');r(sx,y-8,6,3,'#ffd24a');return}
 if(sty==='drum'){drawCivilian(bx,y,{face:f,hat:'cap',cl:'#4a6a4a',cl2:'#2e4a2e',sash:'#b8322a',emo,arm:up?'up':'wave'});r(bx+2,y-11,12,6,'#c8372d');r(bx+2,y-11,12,1,'#e9dcc2');r(bx+2,y-6,12,1,'#e9dcc2');return}
 if(sty==='choir'){drawCivilian(bx,y,{face:f,hat:i%2?'straw':'cap',cl:'#4a5a6a',cl2:'#2e3a46',sash:'#b8322a',emo:'happy',arm:up?'up':null});if(i===0){r(bx+(f>0?-2:14),y-46,1,40,'#3a2a20');r(bx+(f>0?-14:15),y-46,12,8,'#b8322a')}return}
 drawCivilian(bx,y,{face:f,hat:'none',cl:'#b8322a',cl2:'#7a1c14',sash:'#ffd24a',emo,arm:up?'up':'wave'});if(up){r(bx+(f>0?14:-6),y-26,8,8,'#ff4a3a');r(bx+(f>0?16:-4),y-24,4,4,'#ffd24a')}}
function drawRival(xr,y,beat,mood,stage,fwd){const st=stage!=null?STAGES[stage]:null,n=st?st.rn:3,style=st?st.style:'yangge',sp=n>4?18:n>3?22:24,emo=mood>0?'happy':mood<0?'scared':'determined';
 for(let i=0;i<n;i++){const bob=(beat+i)%2?-3:0;rivalMember(style,i,xr-16-(n-1-i)*sp-(fwd||0),y+bob,beat,emo,-1)}}
/* small per-venue set dressing, drawn right after the background */
function gigDeco(stage,t){const st=STAGES[stage];if(!st)return;
 if(stage===0){for(let x=4;x<W;x+=22){const y=40+Math.round(Math.sin(x/60)*6);r(x,y-6,1,6,'#3a2a20');r(x-3,y,8,9,'#c8372d');r(x-2,y+2,6,1,'#ffd24a');if((t>>4)%2&&x%44===4){ctx.globalAlpha=.2;r(x-6,y-3,14,15,'#ff8a3a');ctx.globalAlpha=1}}r(0,34,W,1,'#3a2a20')}
 else if(stage===1){r(0,30,W,1,'#3a3424');for(let x=0;x<W;x+=12){const c=['#c8372d','#2f4f8a','#d9a441'][(x/12|0)%3];for(let k=0;k<4;k++)r(x+2+k,31+k,8-k*2,1,c)}}
 else if(stage===3){r(300,150,22,10,'#2a2a2a');r(298,148,26,3,'#3a3a3a');for(let k=0;k<3;k++){const a=(t*.5+k*20)%40;ctx.globalAlpha=.5-a/80;r(306+k*4,140-a,4,4,'#e9e9e9');ctx.globalAlpha=1}r(304,160,14,4,'#ff8a1a')}
 else if(stage===4){for(const cx of[70,192,314]){r(cx,0,1,22,'#3a3440');r(cx-14,22,29,3,'#d9a441');for(let k=0;k<5;k++)r(cx-12+k*6,25,2,4+((k+(t>>4))%2)*2,'#ffe8a0');ctx.globalAlpha=.08;r(cx-30,18,61,40,'#ffe8a0');ctx.globalAlpha=1}}
 else if(stage===5){ctx.save();ctx.translate(250,0);const d=endShip(0,172,t);ctx.restore();for(let i=0;i<7;i++){const x=258+i*14;drawCivilian(x,d+1,{face:-1,hat:i%2?'fedora':'none',cl:'#4a4a52',emo:'scared'})}}
 else{for(let i=0;i<5;i++){const x=150+i*24-(i>2?60:0),y=i>2?160:172;r(x,y,20,12,'#7a5a35');r(x,y,20,2,'#9c7a4c');r(x+5,y+4,10,4,'#5a3a20');r(x+9,y+3,2,6,'#c8372d')}}}
function drawCrowd(beat){const n=12,mineN=Math.round(run.loyal/100*n);for(let i=0;i<n;i++){const mine=i<mineN;const x=mine?6+i*9:W-14-(n-1-i)*9;const y=206+((beat+i)%2?-1:0);
 drawCivilian(x-8,y,{face:mine?-1:1,hat:i%3?'straw':'none',cl:'#55707e',emo:mine?'happy':'normal',arm:mine&&(beat+i)%2?'wave':null})}}
/* speech bubbles that live beside the note highway, never on top of it */
function sideBubble(s,zl,zr,yb,hero){s=tr(String(s));if(!s)return;const z=CJK_RE.test(s);ctx.font=z?`500 11px ${ZFAM}`:F;const Ls=wrapPx(s,zr-zl-10),LH=z?13:10;
 const w=Math.ceil(Math.max(...Ls.map(l=>ctx.measureText(l).width)))+10,h=Ls.length*LH+6,bx=Math.round(clamp((zl+zr)/2-w/2,zl,zr-w)),by=Math.round(yb-h)+(hero&&T%6<3?1:0);
 const bc=hero?'#2f4f8a':'#b8322a',fc=hero?'#fff4d0':'#f2e2d0';r(bx-1,by-1,w+2,h+2,bc);r(bx,by,w,h,fc);const tx=hero?bx+12:bx+w-16;r(tx,by+h+1,4,3,fc);r(tx+(hero?-2:4),by+h+4,3,2,fc);
 ctx.textAlign='left';ctx.textBaseline=z?'middle':'top';ctx.fillStyle=hero?'#1e2e5a':'#7a1a14';Ls.forEach((l,i)=>ctx.fillText(l,bx+5,z?by+3+i*LH+LH/2:by+4+i*LH));ctx.textBaseline='top'}

/* ---------------- render: play ---------------- */
function render(){
 if(state==='title'){attract();return}
 if(state==='select'){renderSelect();return}
 if(state==='tour'){renderTour();return}
 if(state==='result'){renderResult();return}
 if(state==='ending'){drawEnding();return}
 if(!run)return;const t=gnow(),beat=Math.floor((t-run.t0)/(run.ch.spb*4));
 camX=(T*.2)%200;drawBG();if(run.stage!=null)gigDeco(run.stage,T);drawWeather();ctx.globalAlpha=.35;r(0,0,W,H,'#000');ctx.globalAlpha=1;
 const mood=run.judg&&run.judg.t<20?(run.judg.s==='MISS'||run.judg.s==='DROPPED'?-1:1):0,b0=Math.max(0,beat),fwd=run.show?Math.min(10,run.showT/6):0;
 drawBand(4,150,b0,mood,run.ros);drawRival(W-4,150,run.show?b0*2:b0+1,-mood,run.stage,fwd);drawCrowd(b0);
 // highway
 ctx.globalAlpha=.78;r(HX-4,0,LW*4+8,H,'#0c0908');ctx.globalAlpha=1;for(let l=0;l<=4;l++)r(HX+l*LW,0,1,H,'#3a2e26');
 if(run.show){ctx.globalAlpha=.12+.08*Math.sin(T/6);r(HX-4,0,3,H,'#c8372d');r(HX+LW*4+1,0,3,H,'#c8372d');ctx.globalAlpha=1}
 for(let k=0;k<12;k++){const bt=run.t0+(beat+k)*run.ch.spb*4,y=JY-(bt-t)*scroll;if(y>0&&y<JY)r(HX,y,LW*4,1,'rgba(233,220,194,.12)')}
 for(let l=0;l<4;l++){if(run.lanesOn[l]){ctx.globalAlpha=.18;r(laneX(l),0,LW,JY,LANEC[l]);ctx.globalAlpha=1}}
 r(HX,JY-1,LW*4,3,'#e9dcc2');for(let l=0;l<4;l++){r(laneX(l)+4,JY-4,LW-8,8,run.lanesOn[l]?LANEC[l]:'#2a2018');if(!touchUI)_txt('DFJK'[l],laneX(l)+LW/2,JY+8,'#6e6050','center')}
 for(const n of run.notes){if(n.miss&&!n.hold||n.hit&&!n.hold)continue;const y=JY-(n.t-t)*scroll;if(y<-20&&!n.hold)break;const x=laneX(n.lane)+3;
  if(n.hold){const ye=JY-(n.te-t)*scroll;if(ye>JY||y<-200)continue;const top=Math.max(-10,ye),bot=n.holding?JY:Math.min(y,H);if(!n.miss&&!n.held){ctx.globalAlpha=n.holding?.9:.55;r(x+8,top,LW-22,bot-top,LANEC[n.lane]);ctx.globalAlpha=1}if(n.hit||n.miss)continue}
  if(y>H+10)continue;r(x,y-4,LW-6,8,LANEC[n.lane]);r(x,y-4,LW-6,2,'#fff4d0');r(x+2,y+2,LW-10,2,'rgba(0,0,0,.3)')}
 for(const p of run.fx)r(p.x,p.y,2,2,p.c);
 // hud: left zone = crowd, right zone = score; the highway stays clear
 const zh=LANG==='zh',danger=run.loyal<25||run.need&&run.loyal<run.need&&run.show;
 r(5,5,98,8,'#120d0c');r(6,6,96*run.loyal/100,6,danger?(T%10<5?'#ff5a3a':'#c8372d'):'#4a6aa3');
 if(run.need){const nx=6+Math.round(96*run.need/100);r(nx,3,1,12,'#ffd24a');txt(LZ('CROWD ','觀眾 ')+Math.floor(run.loyal)+'%',6,16,run.loyal>=run.need?'#9fe0a0':'#ff9a6a');txt(LZ('NEED ','需要 ')+run.need+'%',6,zh?29:26,'#a8977c')}
 else txt(LZ('CROWD ','觀眾 ')+Math.floor(run.loyal)+'%',6,16,'#a8977c');
 _txt(String(run.score).padStart(6,'0'),W-5,22,'#e9dcc2','right',F16);const lb=run.label();txt(lb[0],W-6,41,'#a8977c','right');txt(lb[1],W-6,zh?54:52,'#6e6050','right');
 if(run.combo>1){stxt(String(run.combo),W/2,70,'#e9dcc2',22,.9);txt('COMBO',W/2,84,'#a8977c','center')}
 if(run.judg&&run.judg.t<30)stxt(run.judg.s,W/2,110-run.judg.t*.3,run.judg.c,16,1-run.judg.t/30);
 if(run.shout)sideBubble(LZ(run.shout.s[0],run.shout.s[1]),2,HX-6,116,true);if(run.taunt)sideBubble(tauntText(run.taunt),HX+LW*4+6,W-2,116,false);
 if(run.show&&run.showT<120&&!run.failed){const a=Math.min(1,run.showT/10)*(run.showT>90?(120-run.showT)/30:1);ctx.globalAlpha=.7*a;r(HX,14,LW*4,zh?40:36,'#0c0908');ctx.globalAlpha=1;stxt('SHOWDOWN',W/2,27,'#ff5a3a',22,a,'center',LW*4-6);ctx.globalAlpha=a;txt(LZ('THE RIVAL PUSHES!','對手全力反撲！'),W/2,40,'#e9dcc2','center');ctx.globalAlpha=1}
 if(t<run.t0&&!run.paused){const zl=zh?13:11;ctx.globalAlpha=.6;r(HX-4,26,LW*4+8,140,'#0c0908');ctx.globalAlpha=1;
  if(run.stage!=null){const st=STAGES[run.stage],z=ZH(st);stxt(z.place,W/2,40,'#e9dcc2',14,1,'center',LW*4);txt(LZ('VS','對手'),W/2,52,'#a8977c','center');ctx.font=zh?`500 11px ${ZFAM}`:F;wrapPx(z.rival,LW*4).slice(0,2).forEach((l,k)=>txt(l,W/2,52+zl*(k+1),'#ff9a6a','center'));
   txt(LZ('KEEP '+run.need+'% OF THE CROWD','留住 '+run.need+'% 的觀眾'),W/2,126,'#ffd24a','center');txt(LZ('THE RIVAL PUSHES LATE','對手會在最後反撲'),W/2,126+zl,'#a8977c','center')}
  else{stxt(songName(run.song.k),W/2,44,'#e9dcc2',14,1,'center',LW*4)}
  stxt(String(Math.ceil(run.t0-t)),W/2,98,'#ffd24a',30)}
 const prog=clamp((t-run.t0)/(run.end-run.t0),0,1);r(HX,H-3,LW*4*prog,2,'#d9a441');if(run.stage!=null)r(HX+Math.round(LW*4*.7),H-5,1,5,'#c8372d');
 if(run.failed){ctx.globalAlpha=Math.min(.8,run.failT/40);r(0,0,W,H,'#000');ctx.globalAlpha=1;stxt('YOUR AUDIENCE DEFECTED',W/2,H/2-8,'#b3261e',20);txt('THEY TOOK THE CHAIRS',W/2,H/2+12,'#a8977c','center')}
 ctx.drawImage(VIG,0,0);if(run.paused)renderPause()}
function renderPause(){ctx.globalAlpha=.78;r(0,0,W,H,'#0c0908');ctx.globalAlpha=1;btns=[];stxt('PAUSED',W/2,70,'#ffd24a',24);
 txt(LZ('THE BAND HOLDS ITS BREATH. SO DOES THE WAR.','樂隊屏住呼吸。戰爭也是。'),W/2,94,'#a8977c','center');
 button(W/2-104,120,98,LZ('RESUME','繼續演奏'),psel===0,resumeGame);button(W/2+6,120,98,LZ('QUIT SONG','放棄這首'),psel===1,quitSong);
 if(!touchUI)txt(LZ('ENTER RESUME · ESC RESUME · Q QUIT','Enter／Esc 繼續 · Q 放棄'),W/2,150,'#6e6050','center')}
let psel=0,rsel=0;
function hit(b,x,y){return x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h}
function button(x,y,w,label,on,f){r(x,y,w,13,on?'#d9a441':'#2a2018');if(!on){r(x,y,w,1,'#4a3a2a')}txt(label,x+w/2,y+3,on?'#120d0c':'#e9dcc2','center');btns.push({x:x-2,y:y-3,w:w+4,h:19,f})}

/* ---------------- render: menus ---------------- */
function renderSelect(){camX=(T*.2)%200;drawBG();ctx.globalAlpha=.72;r(0,0,W,H,'#0c0908');ctx.globalAlpha=1;btns=[];
 stxt('FREE PLAY',W/2,11,'#e9dcc2',14);txt(LZ('KMT BRASS BAND VS THE OTHER SIDE','國軍軍樂隊 對決 對面那邊'),W/2,21,'#9fb6e6','center');
 SONGS.forEach((s,i)=>{const y=33+i*12,on=i===sel,op=songOpen(s);r(24,y,W-48,11,on?'rgba(217,164,65,.3)':'rgba(20,14,12,.7)');if(on)r(24,y,2,11,'#d9a441');
  txt(op?songName(s.k):LZ('? ? ?  (LOCKED)','？？？（未解鎖）'),30,y+2,op?'#e9dcc2':'#6e6050');for(let k=0;k<s.stars;k++){const sx=W-124+k*7;r(sx+2,y+2,2,7,'#d9a441');r(sx,y+4,6,3,'#d9a441')}
  const b=G.best[s.k+diff];txt(b?b.grade+' '+b.score:'—',W-28,y+2,b?'#9fe0a0':'#6e6050','right');btns.push({x:24,y,w:W-48,h:11,f:()=>{if(sel===i)startSong(i);else{sel=i;SFX.tally()}}})});
 const s=SONGS[sel],tk=TRACKS[s.k],si=songStage(s.k);
 if(songOpen(s)){txt(ZH(SONGINFO[s.k]).sub,W/2,157,'#a8977c','center');txt(tk.bpm+' BPM',W/2,LANG==='zh'?170:168,'#6e6050','center')}
 else txt(si>=0?LZ('REACH GIG '+(si+1)+' ON THE 1949 TOUR TO UNLOCK','在 1949 巡迴演出中打到第 '+(si+1)+' 場即可解鎖'):LZ('BONUS TRACK: WIN THE WHOLE 1949 TOUR','隱藏曲目：贏下整趟 1949 巡演即可解鎖'),W/2,160,'#ff9a6a','center');
 const by=181;button(10,by,52,LZ('◀ BACK','◀ 返回'),false,toTitle);
 DIFFS.forEach((d,i)=>button(84+i*58,by,54,d,i===diff,()=>{diff=i;SFX.tally()}));button(266,by,104,LZ('PLAY ▶','開始演奏 ▶'),false,()=>startSong(sel));
 txt(touchUI?LZ('TAP A SONG, THEN PLAY','點選歌曲，再按開始演奏'):LZ('W/S SONG · A/D LEVEL · ENTER · [ ] '+offset+'MS','W/S 選歌 · A/D 難度 · Enter 開始 · [ ] 延遲 '+offset+'ms'),W/2,203,'#6e6050','center');ctx.drawImage(VIG,0,0)}
function renderTour(){camX=(T*.2)%200;drawBG();ctx.globalAlpha=.74;r(0,0,W,H,'#0c0908');ctx.globalAlpha=1;btns=[];const zh=LANG==='zh';
 stxt('THE 1949 TOUR',W/2,11,'#e9dcc2',14);txt(LZ('BAND FUND: '+bigY(G.yuan)+' GOLD YUAN (≈ NOTHING)','樂隊基金：'+bigY(G.yuan)+' 金圓券（≈ 零）'),W/2,21,'#d9a441','center');
 STAGES.forEach((st,i)=>{const y=33+i*16,on=i===tsel,open=i<=G.cleared,done=G.stage[i],z=ZH(st);
  r(16,y,W-32,14,on?'rgba(217,164,65,.3)':'rgba(20,14,12,.75)');if(on)r(16,y,2,14,'#d9a441');
  _txt(String(i+1),26,y+3,open?'#d9a441':'#6e6050','center');
  txt(open?z.place+' · '+z.date:LZ('? ? ?  (WIN GIG '+i+' FIRST)','？？？（先贏下第 '+i+' 場）'),36,y+3,open?'#e9dcc2':'#6e6050');
  txt(done?done.grade:open?LZ('NEW','新'):'',W-24,y+3,done?'#9fe0a0':'#ff9a6a','right');
  btns.push({x:16,y,w:W-32,h:14,f:()=>{if(!open){SFX.hit();return}if(tsel===i)startGig(i);else{tsel=i;SFX.tally()}}})});
 const st=STAGES[tsel],z=ZH(st),ly=zh?13:11;
 txt(LZ('VS ','對手：')+z.rival,W/2,132,'#ff9a6a','center');
 txt(LZ('','曲目：')+songName(st.k)+' · '+TRACKS[st.k].bpm+' BPM',W/2,132+ly,'#a8977c','center');
 txt(LZ('KEEP '+st.need+'% OF THE CROWD · BAND OF '+roster().length,'留住 '+st.need+'% 觀眾 · 樂隊 '+roster().length+' 人'),W/2,132+ly*2,'#9fb6e6','center');
 const by=181;button(8,by,46,LZ('◀ BACK','◀ 返回'),false,toTitle);
 DIFFS.forEach((d,i)=>button(60+i*52,by,48,d,i===G.cdiff,()=>{G.cdiff=i;save();SFX.tally()}));
 button(220,by,G.ended?84:156,LZ('PLAY GIG ▶','開演 ▶'),false,()=>startGig(tsel));
 if(G.ended)button(310,by,66,LZ('ENDING','結局'),false,()=>startEnding(bandEnding(),()=>{state='tour';music('m3')}));
 txt(touchUI?LZ('TAP A GIG, THEN PLAY GIG','點選場次，再按開演'):LZ('W/S GIG · A/D LEVEL · ENTER PLAY · ESC BACK','W/S 選場次 · A/D 難度 · Enter 開演 · Esc 返回'),W/2,203,'#6e6050','center');ctx.drawImage(VIG,0,0)}
function resultActions(){const r_=run;if(r_.stage==null)return[[LZ('RETRY','再來一次'),()=>startSong(r_.i)],[LZ('SONG LIST','歌單'),()=>{state='select';music('m3')}]];
 const toTour=()=>{state='tour';music('m3')};
 if(r_.won)return r_.stage===STAGES.length-1?[[LZ('ENCORE ▶','安可 ▶'),()=>{G.ended=(G.ended||0)+1;save();startEnding(bandEnding(),toTour)}]]:[[LZ('NEXT GIG ▶','下一場 ▶'),()=>startGig(r_.stage+1)],[LZ('TOUR MAP','巡演地圖'),toTour]];
 return[[LZ('RETRY','再來一次'),()=>startStage(r_.stage)],[LZ('TOUR MAP','巡演地圖'),toTour]]}
function renderResult(){const r_=run,zh=LANG==='zh',ly=zh?13:11;camX=(T*.2)%200;drawBG();ctx.globalAlpha=.8;r(0,0,W,H,'#0c0908');ctx.globalAlpha=1;btns=[];
 const gc=r_.grade==='S'?'#ffd24a':r_.grade==='F'?'#b3261e':'#e9dcc2';
 const stats=[LZ('PERFECT ','完美 ')+r_.cnt.PERFECT+LZ('  GREAT ','　很好 ')+r_.cnt.GREAT+LZ('  OK ','　還行 ')+r_.cnt.OK,LZ('MISS ','漏拍 ')+r_.cnt.MISS+LZ('  MAX COMBO ','　最高連擊 ')+r_.maxc,LZ('SCORE ','分數 ')+r_.score];
 if(r_.stage==null){stxt(songName(r_.song.k),W/2,16,'#e9dcc2',14);stxt(r_.grade,64,62,gc,40);stats.forEach((l,i)=>txt(l,112,44+i*ly,'#e9dcc2'));
  const f=zh?`500 11px ${ZFAM}`:F;ctx.font=f;wrapPx(cm(r_.grade),W-40).slice(0,3).forEach((l,i)=>txt(l,W/2,104+i*ly,'#ff9a6a','center'))}
 else{const st=STAGES[r_.stage],z=ZH(st);stxt(z.place,W/2,11,'#a8977c',11);
  stxt(r_.won?'GIG WON':'GIG LOST',W/2,30,r_.won?'#ffd24a':'#b3261e',22);
  txt(r_.won?LZ('THE CROWD STAYED WITH YOU: '+Math.floor(r_.loyal)+'%','觀眾留在你這邊：'+Math.floor(r_.loyal)+'%'):r_.failed?LZ('THE WHOLE CROWD WENT TO THE OTHER STAGE','全部觀眾都跑去對面舞台了'):LZ('CROWD '+Math.floor(r_.loyal)+'% · YOU NEEDED '+r_.need+'%','觀眾 '+Math.floor(r_.loyal)+'%・需要 '+r_.need+'%'),W/2,44,'#e9dcc2','center');
  stxt(r_.grade,58,84,gc,34);stats.forEach((l,i)=>txt(l,104,64+i*ly,'#e9dcc2'));
  let y=zh?110:104;ctx.font=zh?`500 11px ${ZFAM}`:F;
  if(r_.won){txt(LZ('FEE: '+fmtY(st.fee)+' GOLD YUAN','演出費：'+fmtY(st.fee)+' 金圓券'),W/2,y,'#d9a441','center');txt(LZ('BUYS: ','可以買：')+z.buys,W/2,y+ly,'#a8977c','center');y+=ly*2+4;
   if(z.news){const nl=wrapPx(z.news,W-24).slice(0,zh?2:3);nl.forEach((l,i)=>txt(l,W/2,y+i*ly,'#ff9a6a','center'));y+=nl.length*ly+3}
   if(z.unlock&&r_.firstWin&&T%50<38)txt(z.unlock,W/2,y,'#9fe0a0','center');
   else if(r_.firstWin&&r_.stage<STAGES.length-1&&T%50<38)txt(LZ('UNLOCKED: GIG '+(r_.stage+2)+' + A FREE PLAY SONG','解鎖：第 '+(r_.stage+2)+' 場＋一首自由演奏曲目'),W/2,y,'#9fe0a0','center');
   else if(r_.stage===STAGES.length-1&&T%50<38)txt(LZ('THE BATTLE OF THE BANDS IS YOURS. THE WAR...','樂隊大對決是你的了。至於戰爭嘛……'),W/2,y,'#ffd24a','center')}
  else wrapPx(r_.failed?cm('F'):z.lose,W-30).slice(0,3).forEach((l,i)=>txt(l,W/2,y+6+i*ly,'#ff9a6a','center'))}
 const acts=resultActions(),bw=110,x0=W/2-(acts.length*bw+(acts.length-1)*10)/2;acts.forEach(([l,f],i)=>button(x0+i*(bw+10),184,bw,l,i===rsel,f));
 if(!touchUI)txt(acts.length>1?LZ('ENTER: ','Enter：')+acts[rsel][0].replace(' ▶','')+LZ(' · ←/→ CHOOSE',' · ←/→ 選擇'):LZ('ENTER TO CONTINUE','按 Enter 繼續'),W/2,204,'#6e6050','center');ctx.drawImage(VIG,0,0)}
function attract(){camX=(T*.3)%300;if(!BGD){L.theme='village';buildBG()}drawBG();const b=(T>>4);drawBand(40,170,b,1);drawRival(W-30,170,b+1,1,null,0);ctx.drawImage(VIG,0,0)}
let btns=[];
/* story page before each gig (plus a prologue before the first), then straight into the song */
function startGig(i){if(i>G.cleared)return;const st=STAGES[i];setTheme(st.theme,i);
 const pages=[];if(i===0&&!G.seenIntro){pages.push(Object.assign({art:t=>prologueArt(t)},PROLOGUE));G.seenIntro=1;save()}
 pages.push({date:st.date,place:st.place,fact:st.fact,joke:st.joke,zh:st.zh,art:t=>gigArt(i,t)});
 startEnding(pages,()=>startStage(i),'m3',true)}
function gigArt(i,t){const st=STAGES[i],z=ZH(st),zh=LANG==='zh';ctx.save();ctx.translate(0,-50);camX=t*.25;drawBG();gigDeco(i,t);const b=t>>4;drawBand(30,180,b,0);drawRival(W-20,180,b+1,0,i,0);ctx.restore();drawWeather();
 r(0,0,W,zh?28:22,'rgba(12,9,8,.78)');txt(LZ('GIG '+(i+1)+' OF 6 · ','第 '+(i+1)+' / 6 場 · ')+songName(st.k),6,3,'#d9a441');txt(LZ('RIVAL: ','對手：')+z.rival,6,zh?16:12,'#ff9a6a')}
function prologueArt(t){r(0,0,W,136,'#4a3a30');for(let x=0;x<W;x+=24)r(x,0,1,136,'#3e3028');r(0,104,W,32,'#3a2a22');
 r(150,10,150,70,'#c8b890');r(150,10,150,3,'#8a7a5a');ctx.strokeStyle='#120d0c';ctx.strokeRect(150.5,10.5,149,69);txt(LZ('NEW STRATEGY','新戰略'),225,16,'#2f4f8a','center');
 for(let k=0;k<5;k++)r(160,32+k*6,130,1,'#5a4a3a');const nx=[170,188,206,224,242,260,278];nx.forEach((x,k)=>{const y=34+((k*3)%5)*5;r(x,y,5,4,'#120d0c');r(x+4,y-10,1,10,'#120d0c')});
 seg(178,66,270,66,2,'#c8372d');seg(262,60,270,66,2,'#c8372d');seg(262,72,270,66,2,'#c8372d');
 drawSoldier(116,112,{fac:'kmt',face:1,emo:(t>>5)%2?'smug':'happy',officer:1,gun:null});seg(132,96,160,74,2,'#5a3a20');
 r(300,98,40,14,'#7a5a2a');r(300,98,40,2,'#9c7a4c');for(let k=0;k<3;k++){r(304+k*12,92,8,3,'#d9a441');r(310+k*12,89,3,7,'#ffd24a')}
 for(let i=0;i<3;i++){const x=30+i*26,b=((t>>4)+i)%2?-2:0;drawSoldier(x,124+b,{fac:'kmt',face:1,emo:i===2?'scared':'determined',gun:null});horn(x,124+b,1)}}

/* ---------------- story pages + ending: the retreat to Taiwan, December 1949 (temporary) ---------------- */
let endPages=[],endPg=0,endT=0,endFull=false,endExit=null,endStory=false;
function startEnding(pages,exit,mus='ending',story=false){endPages=pages;endPg=0;endT=0;endFull=false;endExit=exit;endStory=story;state='ending';music(mus);hudLabels()}
function endNext(){if(state!=='ending')return;if(!endFull){endT=9999;return}endPg++;endT=0;endFull=false;SFX.tally();if(endPg>=endPages.length){const f=endExit;endExit=null;f&&f()}}
function endSkip(){if(state!=='ending')return;if(endStory){endPg=endPages.length;const f=endExit;endExit=null;f&&f();return}if(endPg<endPages.length-1){endPg=endPages.length-1;endT=0;endFull=false}else endNext()}
function endSky(a,b){const g=ctx.createLinearGradient(0,0,0,136);g.addColorStop(0,a);g.addColorStop(1,b);ctx.fillStyle=g;ctx.fillRect(0,0,W,136)}
function endSea(t,y0,c1='#2a4a70',c2='#6a8ab0',y1=136){r(0,y0,W,y1-y0,c1);for(let i=0;i<26;i++)r((i*37+i*i*3+t*.3)%(W+20)-10,y0+3+(i%7)*Math.max(2,(y1-y0-4)/7),6+(i%3)*4,1,c2)}
function endShip(x,y,t){y+=Math.round(Math.sin(t/20)*1.5);
 for(let k=0;k<5;k++){const a=((t*.4+k*14)%70);ctx.globalAlpha=.55-a/140;r(x+60-a*.6,y-50-a*.5,6+k,5+k,'#6a6a6a');ctx.globalAlpha=1}
 r(x+30,y-30,50,16,'#d8d0bc');r(x+30,y-30,50,2,'#f0e8d4');for(let i=0;i<5;i++)r(x+34+i*9,y-26,5,4,'#4a5a70');r(x+58,y-46,10,16,'#2a2a2a');r(x+58,y-46,10,3,'#2f4f8a');
 r(x+104,y-48,1,34,'#222');r(x+105,y-48,14,9,'#b8322a');r(x+105,y-48,7,5,'#2f4f8a');r(x+107,y-47,3,3,'#f2f2f2');
 r(x,y-14,120,14,'#3a3e46');r(x+4,y,112,4,'#2a2d33');r(x-6,y-18,10,6,'#3a3e46');r(x+116,y-18,10,6,'#3a3e46');r(x,y-15,120,1,'#6a6e76');
 for(let i=0;i<8;i++)r(x+8+i*14,y-9,3,3,'#1e2026');return y-15}
function notes_(x,y,t){for(let k=0;k<4;k++){const a=(t*.6+k*25)%100;ctx.globalAlpha=Math.max(0,1-a/100);const nx=Math.round(x+k*22+Math.sin((t+k*40)/12)*4),ny=Math.round(y-a*.5);r(nx,ny,1,7,'#ffd24a');r(nx-3,ny+5,4,3,'#ffd24a');r(nx+1,ny,3,2,'#ffd24a');ctx.globalAlpha=1}}
function drawEnding(){const p=endPages[endPg];if(!p)return;const t=endT;ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
 if(p.card){renderEndCard(t);return}
 ctx.save();ctx.beginPath();ctx.rect(0,0,W,136);ctx.clip();p.art(t);ctx.restore();ctx.drawImage(VIG,0,0);
 const z=ZH(p),fact=typeof z.fact==='function'?z.fact():z.fact;
 r(0,136,W,H-136,'#120d0c');r(0,136,W,2,'#d9a441');txt(z.date,8,141,'#d9a441');txt(z.place,W-8,141,'#a8977c','right');
 if(LANG==='zh'){let sz=12,LH=15,fl,jl;for(;;){ctx.font=`500 ${sz}px ${ZFAM}`;fl=wrapPx(fact,W-16);jl=wrapPx(z.joke,W-16);if((fl.length+jl.length)*LH+3<=H-154||sz<=10)break;sz--;LH--}
  const shown=Math.floor(t*.8);let n=0;ctx.textAlign='left';ctx.textBaseline='middle';
  fl.forEach((l,i)=>{ctx.fillStyle='#e9dcc2';ctx.fillText(l.slice(0,Math.max(0,shown-n)),8,154+i*LH+LH/2);n+=l.length});
  jl.forEach((l,i)=>{ctx.fillStyle='#ff9a6a';ctx.fillText(l.slice(0,Math.max(0,shown-n)),8,157+(fl.length+i)*LH+LH/2);n+=l.length});
  ctx.textBaseline='top';endFull=shown>n}
 else{const shown=Math.floor(t*1.6),fl=wrap(fact,46),jl=wrap(z.joke,46);let n=0;ctx.font=F;ctx.textAlign='left';ctx.textBaseline='top';
  fl.forEach((l,i)=>{ctx.fillStyle='#e9dcc2';ctx.fillText(l.slice(0,Math.max(0,shown-n)),8,153+i*10);n+=l.length+1});
  jl.forEach((l,i)=>{ctx.fillStyle='#ff9a6a';ctx.fillText(l.slice(0,Math.max(0,shown-n)),8,156+fl.length*10+i*10);n+=l.length+1});
  endFull=shown>n}
 if(endFull&&T%40<26)for(let i=0;i<5;i++)r(W-14+i,H-13+i,1,10-2*i,'#d9a441')}
function tourScore(){let sc=0;for(const k in G.stage)sc+=G.stage[k].score;return sc}
function renderEndCard(t){const zh=LANG==='zh';const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#05060f');g.addColorStop(1,'#1a1f3a');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 for(let i=0;i<40;i++)r((i*53+7)%W,(i*29)%110,1,1,i%3?'#5a5a7a':'#e9dcc2');endSea(t,170,'#121a30','#3a4a70',H);
 r(300,164,84,7,'#14141c');r(320,157,40,8,'#14141c');r(342,146,3,12,'#14141c');
 const sx=((t*.3+90)%(W+120))-100;ctx.save();ctx.translate(Math.round(sx),0);ctx.scale(.7,.7);const d=endShip(0,268,t);for(let i=0;i<3;i++){drawSoldier(10+i*26,d,{fac:'kmt',face:1,emo:'happy',gun:null});horn(10+i*26,d,1)}notes_(30,d-24,t);ctx.restore();
 stxt('THE END',W/2,18,'#ffd24a',22);txt('(TEMPORARILY)',W/2,30,'#a8977c','center');
 const yr=1950+Math.min(76,Math.floor(t/14));const bh=zh?46:42;r(W/2-118,42,236,bh,'#e9dcc2');r(W/2-118,42,236,3,'#2f4f8a');ctx.strokeStyle='#120d0c';ctx.strokeRect(W/2-117.5,42.5,235,bh-1);
 ink(LZ('COUNTERATTACK THE MAINLAND:','反攻大陸：'),W/2,48);ink(LZ('NEXT YEAR.','明年。'),W/2,zh?61:59,'#b8322a');ink(LZ('FORECAST ISSUED: '+yr,'預報發布：'+yr+' 年'),W/2,zh?74:71,'#5a4a3a');
 const gr=STAGES.map((s,i)=>G.stage[i]?G.stage[i].grade:'-').join(' '),ly=zh?13:11;
 [LZ('GIGS WON: 6 OF 6 · WARS WON: 0 OF 1','演出勝場：6／6・打贏的戰爭：0／1'),LZ('TOUR SCORE '+tourScore()+' · GRADES '+gr,'巡演總分 '+tourScore()+'・評等 '+gr),
  LZ('FEES: '+bigY(G.yuan)+' GOLD YUAN (≈ 0)','演出費：'+bigY(G.yuan)+' 金圓券（≈ 0）'),LZ('THE BAND PLAYS ON. ON A BOAT.','樂隊繼續演奏。在船上。')].forEach((l,i)=>{if(t>20+i*20)txt(l,W/2,94+i*ly,i===3?'#ff9a6a':i?'#a8977c':'#d9a441','center')});
 endFull=t>100;if(endFull&&(T>>5)%2)txt(touchUI?'TAP TO RETURN':'ENTER TO RETURN',W/2,H-12,'#e9dcc2','center');ctx.drawImage(VIG,0,0)}
function ink(s,x,y,c='#120d0c'){s=tr(String(s));const z=CJK_RE.test(s);ctx.font=z?`700 12px ${ZFAM}`:F;ctx.textAlign='center';ctx.textBaseline=z?'middle':'top';ctx.fillStyle=c;ctx.fillText(s,x,z?y+4:y);ctx.textBaseline='top'}
const CREDITS_EN=[['BATTLE OF THE BANDS 1949'],['BANDLEADER','YOU'],['BRASS','THREE HORNS, ONE TUBA'],['TUBA','OUTRANKS YOU'],['PERCUSSION','ONE CONSCRIPT, GOOD RHYTHM'],['PAYROLL','GOLD YUAN (BY WEIGHT)'],['RIVAL TROUPES','THE OTHER SIDE (ALL OF IT)'],['CATERING','THE STEW (UNDEFEATED)'],['TRANSPORT','ONE FERRY, ONE WAY'],['RETURN TOUR','NEXT YEAR']];
const CREDITS_ZH=[['軍樂大對決 1949'],['樂隊指揮','你'],['銅管','小號三支、低音號一支'],['低音號','官階比你高'],['打擊樂','抓兵抓來、節奏感很好的那位'],['薪資','金圓券（論斤計價）'],['對手樂團','對面那邊（全部）'],['餐飲','那鍋燉肉（未嘗敗績）'],['交通','渡輪一艘，單程'],['回鄉巡演','明年']];
function bandEnding(){return[
 {date:'DECEMBER 1949',place:'THE LAST FERRY PIER',art:t=>{endSky('#6a4a5a','#d08a4a');r(0,100,W,36,'#5a4636');for(let x=0;x<W;x+=12)r(x,100,1,36,'#4a382b');
   for(let i=0;i<9;i++){const x=W+20-((t*.5+i*34)%(W+120));ctx.save();ctx.translate(Math.round(x),98);ctx.scale(.55,.55);drawSoldier(0,0,{fac:'ccp',face:-1,pose:'run',anim:t+i*5,emo:'determined',gun:'rifle'});ctx.restore();if(i%3===0){r(x+2,72,1,22,'#3a2a20');r(x+3,72,12,7,'#b8322a')}}
   r(16,112,190,8,'#6a4a2a');r(16,120,190,4,'#4a3220');r(12,44,200,16,'#2f4f8a');txt('WINNERS: KMT BRASS BAND',112,48,'#ffd24a','center');
   for(let i=0;i<4;i++){const b=((t>>3)+i)%2?-3:0;drawSoldier(28+i*34,112+b,{fac:'kmt',face:1,pose:((t>>3)+i)%4===0?'jump':'idle',emo:'happy',gun:null});horn(28+i*34,112+b,1)}
   r(176,96,12,9,'#ffd24a');r(174,97,2,5,'#ffd24a');r(188,97,2,5,'#ffd24a');r(180,105,4,4,'#d9a441');r(176,109,12,3,'#b8862a')},
  fact:'Six gigs, six rival troupes, six standing ovations. You win the Battle of the Bands. The crowd carries the tuba around the pier.',
  joke:"Behind the pier, the other band's army marches past. And keeps marching. South.",
  zh:{date:'1949年12月',place:'最後一班渡輪碼頭',fact:'六場演出、六支對手樂團、六次起立鼓掌。你贏得了樂隊大對決。群眾扛著低音號繞碼頭遊行。',joke:'碼頭後方，對面樂隊的軍隊正行軍經過。一直走，一直走。往南走。'}},
 {date:'MEANWHILE, ALL OF 1949',place:'THE YANGTZE',art:t=>sceneArt('boats',t),
  fact:'While you toured, the other side crossed the Yangtze. Nanjing fell, then Shanghai, then most of the map.',
  joke:'You were asked to play something to slow them down. You chose a march. They marched to it. Faster.',
  zh:{date:'同一時間，1949 整年',place:'長江',fact:'你在巡演的時候，對面渡過了長江。南京失守，接著是上海，接著是地圖上大部分的地方。',joke:'上級要你演奏點什麼拖慢他們。你選了進行曲。他們跟著節拍走，走得更快了。'}},
 {date:'DECEMBER 1949',place:'TAIWAN STRAIT',art:t=>{endSky('#3a5a80','#f0b070');r(300,40,22,22,'#ffd88a');endSea(t,92);const d=endShip(120,114,t);
   for(let i=0;i<3;i++){const b=((t>>3)+i)%2?-2:0;drawSoldier(124+i*24,d+b,{fac:'kmt',face:1,emo:i===1?'cry':'happy',gun:null});horn(124+i*24,d+b,1)}
   notes_(150,d-30,t);r(12,20,112,30,'#e9dcc2');r(12,20,112,3,'#b8322a');ink(LZ('RELOCATION','轉進'),68,26);ink(LZ('(TEMPORARY)','（暫時）'),68,37,'#b8322a')},
  fact:'The government retreats to Taiwan. A temporary relocation. Very temporary. The band sails with its instruments.',
  joke:'On deck they play TEMPORARY, FOREVER. The bridge asks for something less accurate.',
  zh:{date:'1949年12月',place:'台灣海峽',fact:'政府撤退到台灣。暫時轉進。非常暫時。樂隊帶著樂器一起上船。',joke:'他們在甲板上演奏〈暫時，永遠〉。艦橋請他們換一首沒那麼準的。'}},
 {date:'1950',place:'THE EXCHANGE COUNTER',art:t=>sceneArt('bankrun',t),
  fact:()=>'Tour earnings: '+fmtBig(G.yuan)+' Gold Yuan. The clerk does not count them. He weighs them. As paper.',
  joke:'Exchange rate: one whole tour = one clarinet reed, used. Worth it, for the art.',
  zh:{date:'1950年',place:'兌換櫃台',fact:()=>'巡演收入：'+zhBig(G.yuan)+' 金圓券。櫃員沒有數，直接秤重。以廢紙計價。',joke:'匯率：整趟巡演 = 一片豎笛簧片，二手的。為了藝術，值得。'}},
 {date:'1950, 1951, 1952...',place:'TAIWAN',art:t=>sceneArt('island',t),
  fact:'Official plan: counterattack the mainland next year. Every year. The band rehearses the victory march, just in case.',
  joke:'It becomes the most rehearsed song in history. It has never been played live.',
  zh:{date:'1950、1951、1952……',place:'台灣',fact:'官方計畫：明年反攻大陸。每一年都是明年。樂隊天天排練凱旋進行曲，以防萬一。',joke:'它成了史上排練次數最多的一首歌，從來沒有現場演出過。'}},
 {date:'NEXT YEAR',place:'CREDITS',art:t=>{endSky('#05070f','#141a30');for(let i=0;i<30;i++)r((i*61+11)%W,(i*23)%70,1,1,i%4?'#4a4a6a':'#c8c8d8');endSea(t,112,'#121a30','#3a4a70');
   const d=endShip(8,124,t);for(let i=0;i<2;i++){drawSoldier(14+i*22,d,{fac:'kmt',face:1,emo:'happy',gun:null});horn(14+i*22,d,1)}notes_(30,d-24,t);
   const C=LANG==='zh'?CREDITS_ZH:CREDITS_EN,y0=118-t*.32;for(let i=0;i<C.length;i++){const y=y0+i*30;if(y<-24||y>108)continue;
    if(i===0)stxt(C[i][0],W/2+56,y+8,'#ffd24a',14,1,'center',230);else{txt(C[i][0],W/2+56,y,'#a8977c','center');txt(C[i][1],W/2+56,y+(LANG==='zh'?13:11),'#e9dcc2','center')}}
   ctx.globalAlpha=.85;r(0,0,W,8,'#05070f');ctx.globalAlpha=1},
  fact:'The credits were paid in Gold Yuan. Each name cost about one bun.',
  joke:'Thank you for playing. Keep your ticket: the return tour is scheduled for next year.',
  zh:{date:'明年',place:'工作人員名單',fact:'片尾名單一律以金圓券支付，每個名字大約值一顆包子。',joke:'感謝遊玩。請收好船票：回鄉巡演預定明年出發。'}},
 {card:1}]}

/* ---------------- zh-TW strings for UI text (English source -> 繁體中文) ---------------- */
const ZT={EASY:'簡單',NORMAL:'普通',HARD:'困難',COMBO:'連擊',PERFECT:'完美',GREAT:'很好',OK:'還行',MISS:'漏拍',DROPPED:'斷音',
 SHOWDOWN:'正面對決','YOUR AUDIENCE DEFECTED':'你的觀眾投共了','THEY TOOK THE CHAIRS':'椅子也一起搬走了',PAUSED:'暫停',
 'FREE PLAY':'自由演奏','THE 1949 TOUR':'1949 巡迴演出','GIG WON':'演出勝利','GIG LOST':'演出失敗',
 'THE END':'劇終','(TEMPORARILY)':'（暫時）','TAP TO RETURN':'點一下返回','ENTER TO RETURN':'按 Enter 返回',
 'WINNERS: KMT BRASS BAND':'冠軍：國軍軍樂隊',TEMPORARY:'暫時','NEW STRATEGY':'新戰略',
 S:'S',A:'A',B:'B',C:'C',D:'D',F:'F'};
const ZRX=[[/^RICE: ¥(.+)$/,m=>'米價：¥'+m[1].replace(/K$/,'千').replace(/M$/,'百萬').replace(/B$/,'十億').replace(/T$/,'兆')],[/^(\d+) BPM$/,m=>m[1]+' BPM']];
/* CJK-aware overrides of the shared text helper (English path untouched) */
const _txt=txt;
txt=function(s,x,y,c='#e9dcc2',al='left',font=F){s=tr(String(s));if(!CJK_RE.test(s)){if(!isDark(c))return _txt(s,x,y,c,al,font);ctx.font=font;ctx.textAlign=al;ctx.textBaseline='top';ctx.fillStyle=c;ctx.fillText(s,x,y);return}
 ctx.font=zf(font);ctx.textAlign=al;ctx.textBaseline='middle';const yy=y+(/16px/.test(font)?8:4),mw=W-8;
 if(!isDark(c)){ctx.fillStyle='#120d0c';for(const[a,b]of[[1,1],[-1,0],[1,0],[0,-1],[0,1]])ctx.fillText(s,x+a,yy+b,mw)}ctx.fillStyle=c;ctx.fillText(s,x,yy,mw);ctx.textBaseline='top'};
/* HTML overlay + buttons */
const ZH_HTML={seal:'軍樂',h1:'軍樂大對決<span>1949 · 國軍軍樂隊告別巡演（不是告別）</span>',rot:'把手機轉橫，舞台會大一點',
 tag:'你是國軍軍樂隊：三把小號、滿腔理想，薪水領金圓券。每個城鎮都有一座廣場，每座廣場對面都站著一支共軍文工團，帶著腰鼓、紅綢和氣勢。六場演出、六支對手樂團。打中音符、留住觀眾；漏拍的話，觀眾就會走到對面舞台去。',
 tour:'1949 巡迴演出',cont:'繼續巡演',free:'自由演奏',
 keys:'鍵盤：D F J K（或 ← ↓ ↑ →）・長音請按住・W/S 選擇・A/D 難度・Enter 開始・Esc 暫停／返回・[ ] 調整音訊延遲<br>手機：點四條音軌（畫面左右兩側也可以點）。',
 fine:'請打開聲音，這款幾乎全靠聲音。贏下全部六場，看看戰爭怎麼結束。（劇透：在船上。）進度自動存檔。'};
const EN_HTML={};document.querySelectorAll('[data-t]').forEach(el=>EN_HTML[el.dataset.t]=el.innerHTML);EN_HTML.cont='CONTINUE THE TOUR';
function hudLabels(){const zh=LANG==='zh',b=$('#bPause'),play=state==='play'&&run&&!run.failed;b.hidden=!play;b.textContent=run&&run.paused?(zh?'繼續':'▶'):(zh?'暫停':'II');b.setAttribute('aria-label',zh?(run&&run.paused?'繼續':'暫停'):(run&&run.paused?'Resume':'Pause'));
 $('#bSnd').textContent=zh?(muted?'靜音':'音效'):(muted?'MUTE':'SND');$('#bSnd').setAttribute('aria-label',zh?'切換音效':'Toggle sound')}
function applyLang(l,sv){LANG=l==='en'?'en':'zh';const zh=LANG==='zh';if(sv)try{localStorage.setItem(LANG_KEY,LANG)}catch(e){}
 document.documentElement.lang=zh?'zh-Hant':'en';document.title=zh?'軍樂大對決 1949 Battle of the Bands':'Battle of the Bands 1949';
 document.querySelectorAll('[data-t]').forEach(el=>{const k=el.dataset.t;el.innerHTML=zh&&ZH_HTML[k]!=null?ZH_HTML[k]:EN_HTML[k]});
 if(G&&G.cleared>0)$('#sK').innerHTML=zh?ZH_HTML.cont:EN_HTML.cont;
 if(touchUI)$('[data-t=keys]').innerHTML=zh?'點畫面上的四條音軌打擊音符，長音請按住。<br>畫面左半邊＝左兩軌，右半邊＝右兩軌。右上角可以暫停、切換語言和音效。':'Tap the four lanes to hit notes; hold for long notes.<br>Left side of the screen = left two lanes, right side = right two. Pause, language and sound are top right.';
 document.querySelectorAll('.lang button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.l===LANG)));
 const b=$('#bLang');b.textContent=zh?'EN':'中文';b.lang=zh?'en':'zh-Hant';b.setAttribute('aria-label',zh?'Switch to English':'切換為中文');
 cv.setAttribute('aria-label',zh?'軍樂大對決遊戲畫面':'Battle of the Bands game screen');hudLabels();
 if(zh&&document.fonts)document.fonts.load(zf(F),'國軍').catch(()=>{})}

/* ---------------- input ---------------- */
let touchUI=matchMedia('(pointer:coarse)').matches;
function toTitle(){state='title';run=null;applyLang(LANG,false);$('#title').hidden=false;$('#hud').hidden=true;music('off')}
addEventListener('keydown',e=>{if(e.repeat)return;const c=e.code,ok=c==='Enter'||c==='Space'||c==='KeyJ'&&state!=='play',up=c==='KeyW'||c==='ArrowUp',dn=c==='KeyS'||c==='ArrowDown',lf=c==='KeyA'||c==='ArrowLeft',rt=c==='KeyD'||c==='ArrowRight';
 if(state==='title'){if(c==='Enter'&&document.activeElement===document.body){e.preventDefault();enter('tour')}return}
 initAudio();
 if(state==='play'){if(run.paused){if(c==='Enter'||c==='Space'||c==='Escape'){e.preventDefault();resumeGame()}else if(c==='KeyQ')quitSong();return}
  const l=KEYL[c];if(l!=null){e.preventDefault();laneDown(l);return}if(c==='Escape'||c==='KeyP'){pauseGame();return}if(c==='BracketLeft')offset-=10;if(c==='BracketRight')offset+=10;return}
 if(state==='select'){if(up)sel=(sel+SONGS.length-1)%SONGS.length;else if(dn)sel=(sel+1)%SONGS.length;else if(lf)diff=Math.max(0,diff-1);else if(rt)diff=Math.min(2,diff+1);
  else if(ok){e.preventDefault();startSong(sel);return}else if(c==='Escape'){toTitle();return}else if(c==='BracketLeft')offset-=10;else if(c==='BracketRight')offset+=10;else return;e.preventDefault();SFX.tally();save();return}
 if(state==='tour'){const mx=Math.min(G.cleared,STAGES.length-1);if(up)tsel=Math.max(0,tsel-1);else if(dn)tsel=Math.min(mx,tsel+1);else if(lf)G.cdiff=Math.max(0,G.cdiff-1);else if(rt)G.cdiff=Math.min(2,G.cdiff+1);
  else if(ok){e.preventDefault();startGig(tsel);return}else if(c==='Escape'){toTitle();return}else if(c==='BracketLeft')offset-=10;else if(c==='BracketRight')offset+=10;else return;e.preventDefault();SFX.tally();save();return}
 if(state==='result'){const a=resultActions();if(lf||rt){rsel=(rsel+1)%a.length;SFX.tally()}else if(ok){e.preventDefault();a[Math.min(rsel,a.length-1)][1]()}else if(c==='Escape')(a[1]||a[0])[1]();return}
 if(state==='ending'){if(ok){e.preventDefault();endNext()}else if(c==='Escape')endSkip()}});
addEventListener('keyup',e=>{if(state==='play'){const l=KEYL[e.code];if(l!=null)laneUp(l)}});
const ptrLane={};
function ptLane(x){if(x<HX)return x<HX/2?0:1;if(x>HX+LW*4)return x>HX+LW*4+(W-HX-LW*4)/2?3:2;return clamp(Math.floor((x-HX)/LW),0,3)}
/* the whole screen (letterbox included) is the touch surface: sides map to the outer/inner lanes */
$('#app').addEventListener('pointerdown',e=>{initAudio();e.preventDefault();if(e.pointerType==='touch')touchUI=true;else if(e.pointerType==='mouse')touchUI=false;
 const rc=cv.getBoundingClientRect(),x=(e.clientX-rc.left)/rc.width*W,y=(e.clientY-rc.top)/rc.height*H;
 if(state==='play'&&!run.paused){const l=ptLane(x);ptrLane[e.pointerId]=l;try{$('#app').setPointerCapture(e.pointerId)}catch(_){}laneDown(l);return}
 if(state==='select'||state==='tour'||state==='result'||state==='play'){for(const b of btns)if(hit(b,x,y)){b.f();return}return}
 if(state==='ending'){endNext()}});
const pUp=e=>{const l=ptrLane[e.pointerId];if(l!=null){delete ptrLane[e.pointerId];if(!Object.values(ptrLane).includes(l))laneUp(l)}};
$('#app').addEventListener('pointerup',pUp);$('#app').addEventListener('pointercancel',pUp);
/* the player is always the KMT Brass Band; the CCP troupes are always across the square */
function enter(to){initAudio();$('#title').hidden=true;$('#hud').hidden=false;loadSave();if(!BGD)buildBG();state=to;music('m3');hudLabels();
 if(to==='tour'&&G.cleared===0&&!G.stage[0])startGig(0)}
$('#sK').onclick=()=>enter('tour');
$('#sF').onclick=()=>enter('select');
$('#bPause').onclick=e=>{e.currentTarget.blur();if(state!=='play'||!run)return;if(run.paused)resumeGame();else pauseGame()};
$('#bSnd').onclick=e=>{initAudio();setMute(!muted);hudLabels();e.currentTarget.blur()};
document.querySelectorAll('.lang button').forEach(b=>b.addEventListener('click',()=>applyLang(b.dataset.l,true)));
$('#bLang').addEventListener('click',e=>{applyLang(LANG==='zh'?'en':'zh',true);e.currentTarget.blur()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseGame()});
addEventListener('blur',()=>pauseGame());
function fit(){const vw=innerWidth,vh=innerHeight,s=Math.min(vw/W,vh/H);cv.style.width=Math.floor(W*s)+'px';cv.style.height=Math.floor(H*s)+'px'}
addEventListener('resize',fit);fit();loadSave();
applyLang((()=>{try{const v=localStorage.getItem(LANG_KEY);if(v==='en'||v==='zh')return v}catch(e){}return 'zh'})(),false);
function loop(){update();render();requestAnimationFrame(loop)}
(document.fonts?Promise.all([document.fonts.load(F),document.fonts.load(SERIF(20)),document.fonts.load(zf(F),'國軍'),document.fonts.load(zf(F16),'國軍')]):Promise.resolve()).catch(()=>{}).finally(()=>requestAnimationFrame(loop));
