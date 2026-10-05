'use strict';
const W=384,H=216,GY=184,WATERY=GY+6;
const $=s=>document.querySelector(s);
const cv=$('#cv'),ctx=cv.getContext('2d');ctx.imageSmoothingEnabled=false;
const F='8px "Press Start 2P", monospace',F16='16px "Press Start 2P", monospace';
const rnd=Math.random,pick=a=>a[Math.floor(rnd()*a.length)],clamp=(v,a,b)=>v<a?a:v>b?b:v,sgn=v=>v<0?-1:1;
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
function seeded(s){return()=>{s=(s*16807)%2147483647;return(s-1)/2147483646}}
const store={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};

/* ---------------- audio ---------------- */
let AC=null,muted=false,NB=null,MASTER=null,SFXBUS=null,MUSBUS=null;
function initAudio(){if(AC){if(AC.state==='suspended')AC.resume();return}
 try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){return}
 const comp=AC.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=5;comp.attack.value=.003;comp.release.value=.2;
 MASTER=AC.createGain();MASTER.gain.value=muted?0:.9;SFXBUS=AC.createGain();MUSBUS=AC.createGain();MUSBUS.gain.value=.4;
 SFXBUS.connect(comp);MUSBUS.connect(comp);comp.connect(MASTER).connect(AC.destination);
 NB=AC.createBuffer(1,AC.sampleRate*2,AC.sampleRate);const a=NB.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1;
 if(pendingMusic)music(pendingMusic)}
function setMute(m){muted=m;if(MASTER)MASTER.gain.setTargetAtTime(m?0:.9,AC.currentTime,.02)}
function tone(f1,f2,d,type='square',v=.05,at=0,bus=SFXBUS){if(!AC)return;const t=Math.max(AC.currentTime,at||0),o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f1,t);if(f2!==f1)o.frequency.exponentialRampToValueAtTime(Math.max(f2,1),t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(bus);o.start(t);o.stop(t+d+.03)}
function noise(d,v,fr,type='lowpass',at=0,bus=SFXBUS,q=.7){if(!AC)return;const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain(),t=Math.max(AC.currentTime,at||0);s.buffer=NB;f.type=type;f.frequency.value=fr;f.Q.value=q;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(f).connect(g).connect(bus);s.start(t,Math.random()*1.5);s.stop(t+d+.02)}
const now=()=>AC?AC.currentTime:0;
const mf=n=>440*Math.pow(2,(n-69)/12);
let sfxCount=0;setInterval(()=>sfxCount=0,50);
const lim=f=>(...a)=>{if(sfxCount++<14)f(...a)};
const SFX={
 shot:lim(()=>{tone(1100,180,.07,'square',.05);noise(.06,.12,3500,'highpass')}),
 hmg:lim(()=>{tone(220,60,.07,'sawtooth',.06);noise(.07,.18,1800,'bandpass',0,SFXBUS,1.2);noise(.03,.08,6000,'highpass')}),
 shotgun:lim(()=>{tone(160,40,.25,'sawtooth',.12);noise(.3,.45,1400);noise(.08,.3,5000,'highpass')}),
 rocket:lim(()=>{noise(.5,.2,900,'bandpass',0,SFXBUS,2);tone(300,900,.35,'sawtooth',.03)}),
 flame:lim(()=>noise(.18,.12,700,'bandpass',0,SFXBUS,.6)),
 knife:lim(()=>{noise(.08,.15,7000,'highpass');tone(2400,900,.06,'triangle',.03)}),
 eshot:lim(()=>{tone(380,110,.09,'square',.03);noise(.05,.05,1500,'bandpass')}),
 boom:lim((big)=>{const t=now();tone(140,28,big?.9:.55,'sine',.55,t);noise(big?1.4:.9,.55,big?380:520,'lowpass',t);noise(.18,.3,3000,'highpass',t);noise(.5,.12,900,'bandpass',t+.08)}),
 whistle:lim(()=>tone(1800,500,.9,'sine',.03)),
 hit:lim(()=>{tone(260,90,.05,'square',.05);noise(.04,.1,2200,'bandpass')}),
 clang:lim(()=>{tone(1400,900,.08,'square',.03);tone(2100,1700,.06,'triangle',.03)}),
 jump:lim(()=>tone(240,560,.09,'square',.03)),land:lim(()=>noise(.06,.08,500)),
 die:()=>{tone(620,40,.9,'sawtooth',.07);noise(.4,.15,800)},
 scream:lim(()=>tone(700+rnd()*200,300,.25,'sawtooth',.035)),
 bray:()=>{const t=now();tone(500,700,.15,'sawtooth',.05,t);tone(700,380,.25,'sawtooth',.05,t+.15);tone(480,650,.15,'sawtooth',.05,t+.42);tone(650,340,.3,'sawtooth',.05,t+.57)},
 horse:()=>{const t=now();for(let i=0;i<6;i++)tone(900-i*60,700-i*60,.06,'sawtooth',.03,t+i*.07)},
 pick:()=>{const t=now();[660,880,1320,1760].forEach((f,i)=>tone(f,f,.08,'square',.045,t+i*.06))},
 weapon:()=>{const t=now();[523,659,784,1047,1319].forEach((f,i)=>tone(f,f,.09,'square',.05,t+i*.055))},
 radio:()=>{const t=now();noise(.25,.06,2500,'bandpass',t,SFXBUS,3);tone(1200,1200,.05,'square',.03,t+.05);tone(1600,1600,.05,'square',.03,t+.13)},
 word:lim(()=>{tone(110,70,.18,'sawtooth',.05);noise(.15,.06,900,'bandpass',0,SFXBUS,4)}),
 shell:lim(()=>{const t=now();tone(2600,2400,.03,'triangle',.012,t+.18)}),
 throw:lim(()=>noise(.15,.05,1200,'bandpass',0,SFXBUS,2)),
 far:()=>{const t=now()+.5;tone(70,25,1.2,'sine',.18,t);noise(1.4,.12,180,'lowpass',t)},
 splash:lim(()=>{noise(.4,.25,1200,'bandpass',0,SFXBUS,.8);noise(.2,.1,4000,'highpass')}),
 alarm:()=>{const t=now();for(let i=0;i<3;i++){tone(880,660,.18,'square',.04,t+i*.36);tone(660,880,.18,'square',.04,t+i*.36+.18)}},
 type:lim(()=>tone(1800+rnd()*300,1800,.015,'square',.012)),
 fanfare:()=>{const t=now();[[62,0],[67,.15],[71,.3],[74,.45],[74,.75],[71,.9],[74,1.05]].forEach(([n,o],i)=>{tone(mf(n),mf(n),i>3?.35:.15,'square',.05,t+o);tone(mf(n-12),mf(n-12),i>3?.35:.15,'sawtooth',.03,t+o)})},
 tally:lim(()=>tone(1500,1500,.03,'square',.025)),
 oneup:()=>{const t=now();[784,988,1175,1568,1976].forEach((f,i)=>tone(f,f,.07,'square',.05,t+i*.07))},
 engine:lim(()=>tone(60,55,.12,'sawtooth',.03)),
 prop:lim(()=>noise(.1,.05,300,'bandpass',0,SFXBUS,4)),
 laser:lim(()=>{tone(1800,200,.5,'sawtooth',.05);tone(900,100,.5,'square',.03)}),
 stomp:lim(()=>{tone(80,20,.4,'sine',.6);noise(.4,.3,200)})
};

/* ---------------- music: original arcade tracks (no copying), one per mission + boss/final/ending ---------------- */
let ECHO=null,pendingMusic=null;
function musFX(){if(ECHO||!AC)return;const d=AC.createDelay(1);d.delayTime.value=.3;const fb=AC.createGain();fb.gain.value=.28;const wet=AC.createGain();wet.gain.value=.22;d.connect(fb).connect(d);d.connect(wet).connect(MUSBUS);ECHO=d}
function brass(n,t,d,v){const f=mf(n),g=AC.createGain(),fl=AC.createBiquadFilter();fl.type='lowpass';fl.Q.value=3;fl.frequency.setValueAtTime(500,t);fl.frequency.linearRampToValueAtTime(3400,t+.035);fl.frequency.exponentialRampToValueAtTime(1100,t+Math.max(.08,d));
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.012);g.gain.setValueAtTime(v*.75,t+d*.75);g.gain.exponentialRampToValueAtTime(.0001,t+d+.05);fl.connect(g).connect(MUSBUS);
 for(const det of[1,1.007,.994]){const o=AC.createOscillator();o.type='sawtooth';o.frequency.setValueAtTime(f*det,t);o.connect(fl);o.start(t);o.stop(t+d+.08)}}
function lead(n,t,d,v,wave='square'){const f=mf(n),o=AC.createOscillator(),g=AC.createGain(),lfo=AC.createOscillator(),lg=AC.createGain(),fl=AC.createBiquadFilter();o.type=wave;o.frequency.setValueAtTime(f*.97,t);o.frequency.exponentialRampToValueAtTime(f,t+.03);
 lfo.frequency.value=6.2;lg.gain.setValueAtTime(0,t);lg.gain.linearRampToValueAtTime(f*.014,t+Math.min(d,.25));lfo.connect(lg).connect(o.frequency);
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.01);g.gain.setValueAtTime(v*.85,t+d*.8);g.gain.exponentialRampToValueAtTime(.0001,t+d+.04);
 fl.type='lowpass';fl.frequency.value=3600;o.connect(fl).connect(g);g.connect(MUSBUS);if(ECHO)g.connect(ECHO);o.start(t);o.stop(t+d+.06);lfo.start(t);lfo.stop(t+d+.06)}
function bass(n,t,d,v){const o=AC.createOscillator(),o2=AC.createOscillator(),g=AC.createGain(),fl=AC.createBiquadFilter();o.type='sawtooth';o2.type='square';o.frequency.value=mf(n);o2.frequency.value=mf(n)*.5;
 fl.type='lowpass';fl.Q.value=6;fl.frequency.setValueAtTime(1800,t);fl.frequency.exponentialRampToValueAtTime(260,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d+.03);
 o.connect(fl);o2.connect(fl);fl.connect(g).connect(MUSBUS);o.start(t);o2.start(t);o.stop(t+d+.05);o2.stop(t+d+.05)}
const DR={k:(t,v=1)=>{tone(170,42,.2,'sine',.75*v,t,MUSBUS);noise(.015,.25*v,3000,'highpass',t,MUSBUS)},
 s:(t,v=1)=>{noise(.16,.38*v,1900,'bandpass',t,MUSBUS,.8);tone(200,150,.08,'triangle',.22*v,t,MUSBUS);noise(.09,.18*v,6000,'highpass',t,MUSBUS)},
 h:(t,o,v=1)=>noise(o?.18:.035,(o?.09:.07)*v,8500,'highpass',t,MUSBUS),
 ride:t=>{noise(.25,.05,7000,'highpass',t,MUSBUS);tone(5200,5000,.2,'triangle',.008,t,MUSBUS)},
 c:t=>noise(1.3,.16,4500,'highpass',t,MUSBUS),
 tom:(t,f)=>tone(f,f*.5,.18,'sine',.45,t,MUSBUS)};
const CH={Em:[40,[64,67,71]],C:[36,[60,64,67]],D:[38,[62,66,69]],Am:[45,[60,64,69]],F:[41,[60,65,69]],G:[43,[62,67,71]],Bb:[46,[62,65,70]],Dm:[38,[62,65,69]],A:[45,[61,64,69]],B:[35,[63,66,71]],
 Gm:[43,[62,67,70]],C7:[36,[64,70,72]],D7:[38,[62,66,72]],F6:[41,[62,65,69]]};
const TRACKS={
 m1:{bpm:150,drums:'funk',bass:[0,null,0,12,null,0,null,10,0,null,12,0,null,7,10,null],stab:'funk',song:[
 ['Em',[[0,76,3],[3,74,1],[4,71,2],[6,74,2],[8,76,4],[12,79,2],[14,76,2]]],['C',[[0,79,3],[3,76,1],[4,74,2],[6,72,2],[8,71,6],[14,72,2]]],
 ['D',[[0,74,3],[3,72,1],[4,71,2],[6,69,2],[8,74,4],[12,78,2],[14,74,2]]],['Em',[[0,76,8],[8,71,2],[10,74,2],[12,76,4]]],
 ['Am',[[0,81,4],[4,79,2],[6,76,2],[8,72,4],[12,76,4]]],['Em',[[0,79,4],[4,76,2],[6,71,2],[8,74,6],[14,76,2]]],
 ['C',[[0,72,2],[2,74,2],[4,76,2],[6,79,2],[8,84,6],[14,83,2]]],['D',[[0,81,2],[2,78,2],[4,74,4],[8,78,2],[10,81,2],[12,83,4]]]]},
 m2:{bpm:140,drums:'shuffle',bass:[0,null,7,null,12,null,7,null,0,null,7,null,12,null,10,null],stab:'off',song:[
 ['G',[[0,71,2],[2,74,2],[4,76,2],[6,74,2],[8,71,4],[12,67,4]]],['C',[[0,72,2],[2,76,2],[4,79,4],[8,76,2],[10,74,2],[12,72,4]]],
 ['D',[[0,74,2],[2,78,2],[4,81,4],[8,78,2],[10,76,2],[12,74,4]]],['G',[[0,79,6],[6,76,2],[8,74,4],[12,71,4]]],
 ['Em',[[0,76,3],[3,74,1],[4,71,4],[8,67,2],[10,71,2],[12,74,4]]],['C',[[0,72,3],[3,74,1],[4,76,4],[8,79,2],[10,76,2],[12,74,4]]],
 ['D',[[0,78,2],[2,76,2],[4,74,2],[6,72,2],[8,71,2],[10,69,2],[12,66,4]]],['G',[[0,67,8],[8,71,2],[10,74,2],[12,79,4]]]]},
 m3:{bpm:132,drums:'march',bass:[0,null,null,null,0,null,12,null,0,null,null,null,7,null,12,null],stab:'long',song:[
 ['Dm',[[0,74,6],[6,72,2],[8,69,4],[12,72,4]]],['Bb',[[0,70,6],[6,72,2],[8,74,4],[12,77,4]]],['C',[[0,76,6],[6,74,2],[8,72,4],[12,67,4]]],['Dm',[[0,69,8],[8,74,4],[12,81,4]]],
 ['F',[[0,81,4],[4,79,2],[6,77,2],[8,76,4],[12,72,4]]],['C',[[0,79,4],[4,77,2],[6,76,2],[8,74,4],[12,72,4]]],['Bb',[[0,74,4],[4,72,2],[6,70,2],[8,69,4],[12,70,4]]],['A',[[0,73,8],[8,76,4],[12,69,4]]]]},
 m4:{bpm:160,drums:'swing',swing:1,bass:'walk',stab:'jazz',wave:'triangle',song:[
 ['F6',[[0,72,2],[2,74,1],[3,77,3],[6,81,2],[8,79,4],[12,77,4]]],['Dm',[[0,74,2],[2,77,1],[3,81,3],[6,79,2],[8,77,4],[12,74,4]]],
 ['Gm',[[0,70,2],[2,74,1],[3,77,3],[6,79,2],[8,77,2],[10,74,2],[12,70,4]]],['C7',[[0,76,2],[2,79,1],[3,82,3],[6,81,2],[8,79,2],[10,76,2],[12,72,4]]],
 ['F6',[[0,81,4],[4,79,2],[6,77,2],[8,72,8]]],['D7',[[0,78,4],[4,81,2],[6,84,2],[8,81,8]]],
 ['Gm',[[0,82,3],[3,81,1],[4,79,2],[6,77,2],[8,74,4],[12,70,4]]],['C7',[[0,79,2],[2,77,2],[4,76,2],[6,74,2],[8,72,2],[10,70,2],[12,69,4]]]]},
 m5:{bpm:162,drums:'rock',bass:[0,0,12,0,0,0,12,0,0,0,12,0,0,12,10,7],stab:'funk',song:[
 ['Em',[[0,71,2],[2,71,1],[3,74,1],[4,76,4],[8,79,2],[10,78,2],[12,76,4]]],['C',[[0,72,2],[2,72,1],[3,76,1],[4,79,4],[8,84,2],[10,83,2],[12,79,4]]],
 ['D',[[0,74,2],[2,74,1],[3,78,1],[4,81,4],[8,83,2],[10,81,2],[12,78,4]]],['B',[[0,75,4],[4,78,4],[8,83,4],[12,81,2],[14,78,2]]],
 ['Em',[[0,76,4],[4,79,4],[8,83,6],[14,81,2]]],['C',[[0,79,4],[4,76,4],[8,72,6],[14,74,2]]],['Am',[[0,76,4],[4,72,4],[8,69,4],[12,72,4]]],['B',[[0,71,8],[8,75,4],[12,78,4]]]]},
 boss:{bpm:168,drums:'boss',bass:[0,0,12,0,1,0,12,0,0,0,12,0,3,1,0,-1],stab:'boss',song:[
 ['Em',[[0,64,2],[3,65,2],[6,64,2],[8,71,4],[12,70,4]]],['F',[[0,65,2],[3,64,2],[6,65,2],[8,72,6],[14,71,2]]],['Em',[[0,76,2],[2,74,2],[4,71,2],[6,70,2],[8,71,8]]],['D',[[0,74,3],[3,72,3],[6,71,2],[8,70,2],[10,67,2],[12,65,2],[14,64,2]]]]},
 final:{bpm:184,drums:'boss',bass:[0,12,0,12,1,13,1,13,0,12,0,12,3,15,1,13],stab:'boss',song:[
 ['Dm',[[0,74,2],[2,75,2],[4,74,2],[6,72,2],[8,69,8]]],['Bb',[[0,70,2],[2,72,2],[4,74,2],[6,77,2],[8,75,8]]],['Dm',[[0,81,4],[4,80,4],[8,81,2],[10,84,2],[12,86,4]]],['A',[[0,85,4],[4,81,4],[8,76,4],[12,73,4]]]]},
 ending:{bpm:96,drums:'soft',bass:[0,null,null,null,7,null,null,null,12,null,null,null,7,null,null,null],stab:'long',song:[
 ['Dm',[[0,74,6],[6,72,2],[8,69,8]]],['Bb',[[0,70,6],[6,72,2],[8,74,8]]],['F',[[0,77,6],[6,76,2],[8,72,8]]],['A',[[0,73,8],[8,76,8]]]]}
};
let musStep=0,musNext=0,musTimer=null,musMode='off';
function musicTick(){if(!AC)return;
 while(musNext<AC.currentTime+.18){const tr=TRACKS[musMode],spb=tr?60/tr.bpm/4:.1;let t=musNext;
  if(tr){const song=tr.song,bar=(musStep>>4)%song.length,s=musStep&15,[cn,mel]=song[bar],[root,tri]=CH[cn],dk=tr.drums;
   if(tr.swing&&s%4===2)t+=spb*.33;
   if(s===0&&bar%4===0&&dk!=='soft'&&dk!=='swing')DR.c(t);
   if(dk==='funk'){if(s===0||s===6||s===8||s===11)DR.k(t);if(s===4||s===12)DR.s(t);if(s%2===0)DR.h(t,s===14);if(bar%4===3&&s>=12){DR.s(t,.5+(s-12)*.15);DR.tom(t,260-(s-12)*40)}if(s===9&&bar%2)DR.s(t,.3)}
   else if(dk==='shuffle'){if(s===0||s===8||s===10)DR.k(t);if(s===4||s===12)DR.s(t,.8);DR.h(t,false,s%2?.6:1)}
   else if(dk==='march'){if(s===0||s===8)DR.k(t);if(s===4||s===12)DR.s(t);if(s===14||s===15||s===13&&bar%2)DR.s(t,.35);if(s%2===0)DR.h(t,false,.6)}
   else if(dk==='swing'){if(s===0||s===8)DR.k(t,.6);if(s%4===0||s%4===2)DR.ride(t);if(s===4||s===12)DR.s(t,.35)}
   else if(dk==='rock'){if(s===0||s===4||s===8||s===10)DR.k(t);if(s===4||s===12)DR.s(t,1.1);if(s%2===0)DR.h(t,s===6||s===14);if(bar%2===1&&s>=12)DR.tom(t,240-(s-12)*35)}
   else if(dk==='boss'){if(s%4===0||s===14||s===10)DR.k(t);if(s===4||s===12)DR.s(t);DR.h(t,s%4===2)}
   else if(dk==='soft'){if(s===0)DR.k(t,.5);if(s===8)DR.s(t,.2)}
   if(tr.bass==='walk'){if(s%4===0){const w=[0,4,7,10][s/4|0];bass(root+w,t,spb*3.5,.28)}}
   else{const bp=tr.bass[s];if(bp!=null)bass(root+bp,t,spb*(dk==='soft'?3:.9),.3)}
   const st=tr.stab;
   if(st==='funk'){if(s===0)tri.forEach(n=>brass(n-12,t,spb*3,.05));if(s===6||s===10)tri.forEach(n=>brass(n-12,t,spb*.8,.045))}
   else if(st==='boss'){if(s===0||s===3||s===6)tri.forEach(n=>brass(n-12,t,spb*1.2,.05))}
   else if(st==='long'){if(s===0)tri.forEach(n=>brass(n-12,t,spb*14,.03))}
   else if(st==='jazz'){if(s===2||s===10)tri.forEach(n=>brass(n,t,spb*1.2,.03))}
   for(const[q,n,len]of mel)if(q===s)lead(n,t,spb*len*.92,.055,tr.wave)}
  musStep++;musNext+=spb}}
function music(mode){pendingMusic=mode;if(!AC){musMode=mode;return}musFX();if(mode!==musMode)musStep=0;musMode=mode;if(!musTimer){musNext=AC.currentTime+.1;musTimer=setInterval(musicTick,40)}}

/* ---------------- input ---------------- */
const kb={},tk={},pressed={};
const KEYMAP={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',KeyJ:'fire',KeyZ:'fire',KeyK:'jump',KeyX:'jump',Space:'jump',KeyL:'bomb',KeyC:'bomb',Enter:'fire'};
const held=k=>kb[k]||tk[k];
let touchUI=false;
function showTouch(){if(touchUI)return;touchUI=true;$('#touch').hidden=false;fit()}
if(matchMedia('(pointer:coarse)').matches)setTimeout(showTouch,0);
const stick=$('#stick'),knob=$('#knob'),tpad=$('#touch');
function onTouch(e){e.preventDefault();initAudio();
 const r=stick.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let sx=0,sy=0,stk=false;const btn={};
 for(const t of e.touches){
  if(stick.contains(t.target)){sx=t.clientX-cx;sy=t.clientY-cy;stk=true;continue}
  const el=document.elementFromPoint(t.clientX,t.clientY),b=el&&el.closest&&el.closest('[data-k]');if(b)btn[b.dataset.k]=1}
 tk.left=stk&&sx<-14;tk.right=stk&&sx>14;tk.up=stk&&sy<-24;tk.down=stk&&sy>24;
 knob.style.transform=stk?`translate(${clamp(sx,-40,40)}px,${clamp(sy,-40,40)}px)`:'';
 for(const k of ['fire','jump','bomb']){const v=!!btn[k];if(v&&!tk[k])pressed[k]=1;tk[k]=v;document.querySelector(`.tb[data-k=${k}]`).classList.toggle('on',v)}}
for(const ev of ['touchstart','touchmove','touchend','touchcancel'])tpad.addEventListener(ev,onTouch,{passive:false});
addEventListener('touchstart',()=>showTouch(),{passive:true});
cv.addEventListener('pointerdown',()=>{pressed.fire=1;initAudio()});
function fit(){const vw=innerWidth,vh=innerHeight,pt=touchUI&&vh>vw;document.body.classList.toggle('pt',pt);
 const ah=pt?Math.max(160,vh-260):vh;const s=Math.min(vw/W,ah/H);cv.style.width=Math.floor(W*s)+'px';cv.style.height=Math.floor(H*s)+'px'}
addEventListener('resize',fit);
