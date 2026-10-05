/* ---------------- draw helpers ---------------- */
function r(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h)}
function txt(s,x,y,c='#e9dcc2',al='left',font=F){ctx.font=font;ctx.textAlign=al;ctx.textBaseline='top';ctx.fillStyle='#120d0c';
 for(const[a,b]of[[1,1],[-1,0],[1,0],[0,-1],[0,1]])ctx.fillText(s,x+a,y+b);ctx.fillStyle=c;ctx.fillText(s,x,y)}
function wrap(s,n){const out=[];let line='';for(const w of s.split(' ')){if((line+' '+w).trim().length>n){out.push(line);line=w}else line=(line+' '+w).trim()}if(line)out.push(line);return out}
function fmtBig(n){n=Math.floor(n);if(n<1e4)return String(n);const u=['K','M','B','T','QA','QI','SX','SP','OC'];let i=-1;while(n>=1000&&i<u.length-1){n/=1000;i++}return(n<10?n.toFixed(1):Math.floor(n))+u[i]}
function seg(x1,y1,x2,y2,w,c){ctx.fillStyle=c;const n=Math.max(1,Math.ceil(Math.max(Math.abs(x2-x1),Math.abs(y2-y1))));for(let i=0;i<=n;i++)ctx.fillRect(Math.round(x1+(x2-x1)*i/n-w/2+.01),Math.round(y1+(y2-y1)*i/n-w/2+.01),w,w)}
function gR(ox,oy,ux,uy,a,b,l,t,c){const vx=-uy,vy=ux,x1=ox+ux*a+vx*b,y1=oy+uy*a+vy*b,x2=ox+ux*(a+l)+vx*(b+t),y2=oy+uy*(a+l)+vy*(b+t);ctx.fillStyle=c;ctx.fillRect(Math.round(Math.min(x1,x2)),Math.round(Math.min(y1,y2)),Math.round(Math.abs(x2-x1))||1,Math.round(Math.abs(y2-y1))||1)}
function emblem(fac,x,y){if(fac==='kmt'){r(x,y,8,8,'#2f4f8a');r(x+2,y+2,4,4,'#f2f2f2')}else{r(x,y,8,8,'#b8322a');r(x+3,y+1,2,6,'#f1d27a');r(x+1,y+3,6,2,'#f1d27a')}}
function hanV(s,x,y,c,size=10){ctx.font=`900 ${size}px "Noto Serif TC","Songti TC","PMingLiU",serif`;ctx.textAlign='center';ctx.textBaseline='top';ctx.fillStyle=c;[...s].forEach((ch,i)=>ctx.fillText(ch,x,y+i*(size+1)))}

/* ---------------- chibi characters ---------------- */
const PAL={
 kmt:{h:'#2f4166',hs:'#1b253d',s:'#f2f2f2',u:'#5a6d90',uh:'#7690b8',d:'#3a4866',p:'#8a90a0'},
 ccp:{h:'#5f6b3f',hs:'#3a4226',s:'#e0302a',u:'#77835a',uh:'#94a274',d:'#4f5838',p:'#a59c78'},
 civ:{h:'#3a3a3a',hs:'#222',s:'#888',u:'#4a4a52',uh:'#62626c',d:'#34343a',p:'#555'}};
const SK='#e3b184',SKS='#b8835a',BOOT='#2a1d14',BELT='#6b4a2a',GUN='#262626',GUNH='#555555',WOOD='#7a5230',WOODD='#5a3a20';
const GUNLEN={pistol:12,rifle:17,hmg:20,shotgun:14,rocket:20,flame:16};
function face(emo,blink){const K='#1a1110',MO='#5a0e0e';
 const eye=x=>{r(x,-21,2,3,K);r(x,-21,1,1,'#fff')};
 const browA=()=>{r(5,-24,2,1,K);r(7,-23,1,1,K);r(12,-23,1,1,K);r(13,-24,1,1,K)};
 switch(emo){
 case 'dead':for(const x of[5,11]){r(x,-22,1,1,K);r(x+2,-22,1,1,K);r(x+1,-21,1,1,K);r(x,-20,1,1,K);r(x+2,-20,1,1,K)}r(8,-17,5,1,K);r(10,-16,2,2,'#d0504a');break;
 case 'hurt':r(5,-22,1,1,K);r(6,-21,1,1,K);r(5,-20,1,1,K);r(13,-22,1,1,K);r(12,-21,1,1,K);r(13,-20,1,1,K);r(9,-18,3,2,MO);r(3,-24,1,2,'#9fd3ff');break;
 case 'scared':r(5,-23,3,3,'#fff');r(6,-22,1,1,K);r(11,-23,3,3,'#fff');r(12,-22,1,1,K);r(5,-25,2,1,K);r(12,-25,2,1,K);r(9,-18,1,1,MO);r(10,-17,2,1,MO);r(12,-18,1,1,MO);r(14,-25,1,2,'#9fd3ff');r(15,-23,1,2,'#9fd3ff');break;
 case 'happy':r(5,-20,1,1,K);r(6,-21,1,1,K);r(7,-20,1,1,K);r(11,-20,1,1,K);r(12,-21,1,1,K);r(13,-20,1,1,K);r(8,-18,5,2,MO);r(8,-18,5,1,'#fff');r(13,-19,1,1,'#e88a7a');r(4,-18,2,1,'#e88a7a');break;
 case 'cry':r(5,-21,2,1,K);r(11,-21,2,1,K);r(5,-23,2,1,K);r(12,-24,2,1,K);r(5,-20,1,3+(T>>3)%2,'#9fd3ff');r(12,-20,1,3+((T>>3)+1)%2,'#9fd3ff');r(8,-18,5,2,MO);r(9,-16,3,1,MO);break;
 case 'shout':browA();r(5,-22,2,2,K);r(11,-22,2,2,K);r(7,-20,7,6,MO);r(7,-20,7,1,'#fff');r(8,-15,5,1,'#d0504a');r(7,-14,7,1,SK);r(4,-19,2,1,'#e88a7a');break;
 case 'grit':browA();eye(5);eye(11);r(8,-18,5,2,'#fff');r(9,-18,1,2,'#9a9a9a');r(11,-18,1,2,'#9a9a9a');break;
 case 'sleep':r(5,-20,2,1,K);r(11,-20,2,1,K);r(9,-17,2,2,MO);break;
 case 'smug':r(5,-21,2,1,K);r(11,-21,2,1,K);r(5,-22,2,1,K);r(11,-22,2,1,K);r(8,-17,5,1,'#7a3a2a');r(12,-18,1,1,'#7a3a2a');break;
 case 'determined':browA();if(blink){r(5,-20,2,1,K);r(11,-20,2,1,K)}else{eye(5);eye(11)}r(9,-17,4,1,'#7a3a2a');break;
 default:r(5,-24,2,1,K);r(11,-24,2,1,K);if(blink){r(5,-20,2,1,K);r(11,-20,2,1,K)}else{eye(5);eye(11)}r(9,-17,3,1,'#7a3a2a')}
 r(14,-20,1,2,SK)}
function chibiHead(emo,blink){r(3,-27,10,13,SK);r(2,-26,12,11,SK);r(4,-15,8,1,SKS);r(2,-25,1,9,SKS);r(2,-24,2,5,'#1a1110');r(3,-21,2,3,SKS);r(3,-20,1,1,'#9a6a4a');face(emo,blink)}
function cap(fac){const pc=PAL[fac];
 if(fac==='kmt'){r(1,-31,14,4,pc.h);r(2,-32,12,1,pc.uh);r(2,-27,12,2,pc.hs);r(10,-26,6,2,'#111');r(10,-26,6,1,'#3a3a3a');r(8,-31,3,3,pc.s);r(9,-30,1,1,pc.hs)}
 else if(fac==='ccp'){r(2,-30,12,4,pc.h);r(3,-31,10,1,pc.uh);r(2,-26,12,1,pc.hs);r(11,-26,5,1,pc.hs);r(9,-30,1,3,pc.s);r(8,-29,3,1,pc.s);r(8,-27,1,1,pc.s);r(10,-27,1,1,pc.s)}
 else{r(0,-29,16,2,'#3a3a3a');r(3,-33,10,4,'#3a3a3a');r(3,-30,10,1,'#7a2a2a')}}
function drawHead(sx,y,fac,emo,face_){ctx.save();ctx.translate(Math.round(sx)+(face_<0?16:0),Math.round(y));if(face_<0)ctx.scale(-1,1);chibiHead(emo,0);cap(fac);ctx.restore()}
function drawGun(gun,ox,oy,ux,uy,o){
 if(gun==='pistol'){gR(ox,oy,ux,uy,5,-2,7,3,GUN);gR(ox,oy,ux,uy,5,-2,7,1,GUNH);gR(ox,oy,ux,uy,5,1,3,3,WOODD)}
 else if(gun==='rifle'){gR(ox,oy,ux,uy,-3,-1,8,3,WOOD);gR(ox,oy,ux,uy,5,-1,8,2,GUN);gR(ox,oy,ux,uy,5,1,6,1,WOOD);gR(ox,oy,ux,uy,13,-1,4,1,GUN);if(o.bayo)gR(ox,oy,ux,uy,17,-1,5,1,'#d8d8d8')}
 else if(gun==='shotgun'){gR(ox,oy,ux,uy,-3,-1,7,4,WOOD);gR(ox,oy,ux,uy,4,-2,10,2,GUN);gR(ox,oy,ux,uy,4,0,10,2,'#3a3a3a');gR(ox,oy,ux,uy,6,2,4,1,WOOD)}
 else if(gun==='rocket'){gR(ox,oy,ux,uy,-6,-3,24,5,'#4a5a3a');gR(ox,oy,ux,uy,-6,-3,24,1,'#6a7a52');gR(ox,oy,ux,uy,16,-4,3,7,'#3a4a2a');gR(ox,oy,ux,uy,4,2,3,3,WOODD)}
 else if(gun==='flame'){gR(ox,oy,ux,uy,0,-1,14,3,'#5a5a5a');gR(ox,oy,ux,uy,12,-2,3,5,'#3a3a3a');gR(ox,oy,ux,uy,3,2,3,3,WOODD);if(T%6<3)gR(ox,oy,ux,uy,15,0,2,1,'#5ab0ff')}
 else{gR(ox,oy,ux,uy,-3,-1,5,3,WOOD);gR(ox,oy,ux,uy,2,-2,12,4,GUN);gR(ox,oy,ux,uy,2,-2,12,1,GUNH);gR(ox,oy,ux,uy,6,-5,4,3,GUN);gR(ox,oy,ux,uy,14,-1,6,2,GUN);gR(ox,oy,ux,uy,17,-2,1,4,GUNH)}}
// o: fac, pose(idle|run|jump|crouch|sit), face, anim, aim, gun, muzz, ally, hero, emo, blink, surr, throwT, bayo, item, slash
function drawSoldier(sx,y,o){
 const pc=PAL[o.fac];ctx.save();ctx.translate(Math.round(sx)+(o.face<0?16:0),Math.round(y));if(o.face<0)ctx.scale(-1,1);
 const cr=o.pose==='crouch',run=o.pose==='run',p=(o.anim||0)*.3;
 if(o.pose==='sit'){r(3,-6,11,4,pc.u);r(11,-4,3,4,pc.u);r(10,-1,6,2,BOOT)}
 else if(cr){r(2,-5,12,4,pc.u);r(2,-5,12,1,pc.d);r(0,-2,5,2,BOOT);r(11,-2,6,2,BOOT);r(2,-3,3,1,pc.p);r(12,-3,3,1,pc.p)}
 else{let f1=10,f2=5,l1=0,l2=0;
  if(run){f1=8+Math.sin(p)*4;f2=8-Math.sin(p)*4;l1=Math.max(0,Math.cos(p))*3;l2=Math.max(0,-Math.cos(p))*3}
  else if(o.pose==='jump'){f1=11;f2=4;l1=3;l2=1}
  const lg=(fx,l,c)=>{seg(fx<8?6:10,-5,fx,-3-l,4,c);r(fx-2,-4-l,4,1,pc.p);r(fx-2,-2-l,5,2,BOOT);r(fx+3,-1-l,1,1,'#120d0c')};
  lg(f2,l2,pc.d);lg(f1,l1,pc.u)}
 const dy=cr?7:o.pose==='sit'?2:(run?-Math.round(Math.abs(Math.sin(p))):0);ctx.translate(0,dy);
 const shx=9,shy=-10,gun=o.gun,A=GUNLEN[gun]||0,rec=o.muzz?-1:0,ux=o.aim?0:1,uy=o.aim||0;
 if(o.surr){seg(shx-3,shy,shx-9,-18,3,pc.d);seg(shx-9,-18,shx-9,-28,3,pc.d);r(shx-10,-31,3,3,SK)}
 else if(o.slash){seg(shx-2,shy,shx-6,shy+3,3,pc.d)}
 else if(gun){const gx=shx+ux*(10+rec)-uy,gy=shy+uy*(10+rec)+ux*2;seg(shx-2,shy,gx,gy,3,pc.d);r(gx-1,gy-1,3,3,SKS)}
 else{seg(shx-2,shy,shx+2,shy+5,3,pc.d);if(o.item==='case'){r(shx-2,shy+5,8,6,'#6a4a2a');r(shx,shy+4,4,1,'#3a2a1a');r(shx+1,shy+7,2,1,'#d9a441')}else if(o.item==='board'){r(shx,shy+2,6,8,'#c8b890');r(shx+1,shy+1,4,1,'#555');r(shx+1,shy+4,4,1,'#777');r(shx+1,shy+6,3,1,'#777')}}
 if(gun==='flame'&&!o.surr){r(-2,-14,4,9,'#7a3a2a');r(-2,-14,4,1,'#a85a3a')}else r(-1,-12,3,7,'#8a7a5a'),r(-1,-10,3,1,'#5a4a32');
 r(3,-13,10,9,pc.u);r(2,-12,12,7,pc.u);r(1,-11,14,5,pc.u);r(1,-11,1,5,pc.d);r(14,-11,1,5,pc.uh);r(10,-12,2,5,pc.uh);r(5,-13,6,1,pc.d);
 r(1,-6,14,1,BELT);r(8,-6,2,1,'#d9a441');r(12,-9,2,2,BELT);
 if(o.officer){r(3,-13,2,1,'#d9a441');r(11,-13,2,1,'#d9a441');r(6,-11,1,1,'#d9a441');r(6,-9,1,1,'#d9a441')}
 if(o.hero){const w=(T>>2)%2;r(3,-14,10,2,'#d9a441');r(-1,-13+w,4,1,'#d9a441');r(-4,-12-w,3,1,'#b07a22')}
 chibiHead(o.emo||'normal',o.blink);cap(o.fac);
 if(o.surr){seg(shx+1,shy,shx+8,-17,3,pc.u);seg(shx+8,-17,shx+8,-29,3,pc.u);r(shx+7,-32,3,3,SK);r(shx+9,-40,1,9,WOOD);r(shx+10,-40,7,5,'#f4f4f4');r(shx+10,-36,6,1,'#cfc8b8')}
 else if(o.slash){const k=o.slash;seg(shx+1,shy,shx+8,shy-4+k,3,pc.u);r(shx+7,shy-5+k,3,3,SK);r(shx+9,shy-8+k,2,7,'#e8e8e8');
  ctx.globalAlpha=.8;for(let i=0;i<6;i++)r(shx+6+i*2,shy-10+i*3-k,3,2,'#ffffff');ctx.globalAlpha=1}
 else if(o.throwT!=null){const th=o.throwT,ang=th>0?(-2.6+(1-th/14)*3):1.1,hx2=shx+Math.cos(ang)*7,hy2=shy+Math.sin(ang)*7;
  seg(shx,shy,hx2,hy2,3,pc.u);r(hx2-1,hy2-1,3,3,SK);if(!(th>0&&th<7)){r(hx2,hy2-5,2,5,WOOD);r(hx2-1,hy2-9,4,4,'#3a4030')}}
 else if(gun){const ox=shx+ux*rec,oy=shy+uy*rec;drawGun(gun,ox,oy,ux,uy,o);
  const gx=ox+ux*5-uy*2,gy=oy+uy*5+ux*2;seg(shx+1,shy,gx,gy,3,pc.u);r(gx-1,gy-1,3,3,SK);
  if(o.ally)r(shx-1,shy+1,3,1,'#f4f4f4');
  if(o.muzz&&gun!=='flame'){const mx=shx+ux*A,my=shy+uy*A,big=gun==='shotgun'||gun==='rocket';r(mx-2,my-2,big?7:5,big?7:5,'#fff');gR(mx,my,ux,uy,2,0,big?10:6,1,'#ffe27a');gR(mx,my,ux,uy,1,-4,1,9,'#ffb04a')}}
 else if(!o.surr){seg(shx+1,shy,shx+4,shy+4,3,pc.u);r(shx+3,shy+3,3,3,SK)}
 ctx.restore()}
function muzzleOf(e,gun,aim,cr){const A=GUNLEN[gun]||12,shy=e.y+(cr?-3:-10),shx=e.x+8,ux=aim?0:e.face,uy=aim||0;return[shx+ux*A,shy+uy*A,ux,uy]}
function drawCivilian(sx,y,o){// peasants and townsfolk: o.hat 'straw'|'cap'|'none', o.cl, emo, pose
 ctx.save();ctx.translate(Math.round(sx)+(o.face<0?16:0),Math.round(y));if(o.face<0)ctx.scale(-1,1);
 const cl=o.cl||'#55707e',cl2=o.cl2||'#3d525d',p=(o.anim||0)*.3,run=o.pose==='run';
 const f1=run?8+Math.sin(p)*4:10,f2=run?8-Math.sin(p)*4:5;
 for(const[fx,l]of[[f2,run?Math.max(0,-Math.cos(p))*3:0],[f1,run?Math.max(0,Math.cos(p))*3:0]]){seg(fx<8?6:10,-5,fx,-3-l,4,cl2);r(fx-2,-2-l,5,2,o.shoe||SKS)}
 r(3,-13,10,9,cl);r(2,-12,12,7,cl);r(1,-11,14,5,cl);r(1,-7,14,1,o.sash||'#a07a42');
 chibiHead(o.emo||'normal',0);
 if(o.hat==='straw'){r(5,-35,6,1,'#9c7c3c');r(3,-34,10,1,'#c9a65a');r(1,-33,14,1,'#c9a65a');r(-2,-32,20,2,'#c9a65a');r(-2,-30,20,1,'#9c7c3c')}
 else if(o.hat==='fedora'){r(0,-29,17,2,'#2a2a2a');r(3,-34,11,5,'#2a2a2a');r(3,-30,11,1,'#7a2a2a')}
 else if(o.hat==='cap')cap('civ');
 else{r(2,-28,12,3,'#1a1110');r(3,-29,10,1,'#1a1110')}
 if(o.arm==='wave'&&(T>>3)%2){seg(11,-10,14,-20,3,cl);r(13,-23,3,3,SK)}else if(o.arm==='up'){seg(11,-10,13,-22,3,cl);r(12,-25,3,3,SK)}else{seg(11,-10,13,-4,3,cl);r(12,-4,3,3,SK)}
 ctx.restore()}
function drawPeasant(w){const x0=Math.round(w.x-camX),y=w.y;
 if(w.st==='tied'){ctx.save();ctx.translate(x0,y);r(14,-34,3,34,'#5a4030');r(13,-35,5,2,'#4a3020');
  r(1,-4,14,4,'#3d525d');r(2,-11,12,7,'#55707e');r(1,-10,14,5,'#55707e');
  ctx.save();ctx.translate((T>>4)%2,6);chibiHead('cry',0);r(5,-35,6,1,'#9c7c3c');r(3,-34,10,1,'#c9a65a');r(1,-33,14,1,'#c9a65a');r(-2,-32,20,2,'#c9a65a');r(-2,-30,20,1,'#9c7c3c');ctx.restore();
  for(const ry of[-9,-6,-3])r(0,ry,17,1,'#a07a42');ctx.restore();if((T>>5)%3===0)txt('HELP!',x0-4,y-40,'#e9dcc2');return}
 const run=w.t>150;drawCivilian(x0,y,{face:run?-1:1,pose:run?'run':'idle',anim:T,hat:'straw',emo:run?'scared':'happy',arm:run?'':'wave'})}
function drawBubble(s,x,y){const L=wrap(s,24),w=Math.max(...L.map(l=>l.length))*8+8,h=L.length*10+6;
 let bx=clamp(x-w/2,4,W-w-4),by=Math.max(28,y-h);r(bx,by,w,h,'#e9dcc2');ctx.strokeStyle='#120d0c';ctx.strokeRect(bx+.5,by+.5,w-1,h-1);
 r(clamp(x-2,bx+4,bx+w-8),by+h,4,3,'#e9dcc2');ctx.font=F;ctx.textAlign='left';ctx.textBaseline='top';ctx.fillStyle='#120d0c';L.forEach((l,i)=>ctx.fillText(l,bx+4,by+4+i*10))}
function drawShout(s,x,y,hero){const w=s.length*8+10,h=16,jig=hero&&T%6<3?1:0,bx=clamp(x-w/2,4,W-w-4),by=Math.max(26,y-h)+jig,bc=hero?'#c8372d':'#120d0c',fc=hero?'#fff4d0':'#d8ccb0';
 r(bx-1,by-1,w+2,h+2,bc);r(bx-3,by+4,2,3,bc);r(bx+w+1,by+8,2,3,bc);r(bx+8,by-3,3,2,bc);r(bx+w-12,by+h+1,3,2,bc);r(bx,by,w,h,fc);
 const tx=clamp(x-1,bx+3,bx+w-6);r(tx,by+h+1,3,3,fc);r(tx+1,by+h+4,2,2,fc);
 ctx.font=F;ctx.textAlign='left';ctx.textBaseline='top';ctx.fillStyle=hero?'#c8372d':'#3a2a20';ctx.fillText(s,bx+5,by+4)}

/* ---------------- special enemies ---------------- */
function drawHorse(x,y,face,anim,col='#7a5232'){ctx.save();ctx.translate(Math.round(x)+(face<0?32:0),Math.round(y));if(face<0)ctx.scale(-1,1);
 const p=anim*.35,dk='#4a3220';
 for(const[lx,ph]of[[6,0],[10,Math.PI],[22,Math.PI/2],[26,Math.PI*1.5]]){const s=Math.sin(p+ph)*3;seg(lx,-10,lx+s,-2,3,ph>2?dk:col);r(lx+s-1,-2,3,2,'#1a1410')}
 r(3,-20,26,11,col);r(2,-18,28,7,col);r(4,-11,24,2,dk);r(26,-28,6,10,col);r(28,-32,7,7,col);r(33,-30,3,4,col);r(31,-30,1,1,'#111');r(28,-34,2,3,col);r(25,-30,3,10,'#2a1a10');
 r(0,-19,3,1,'#2a1a10');r(-2,-18+(T>>3)%2,3,7,'#2a1a10');r(10,-22,10,3,'#7a2a2a');ctx.restore()}
function drawParachute(x,y){ctx.fillStyle='#d9cfb8';for(let i=0;i<9;i++){const h=Math.round(Math.sin(i/8*Math.PI)*8);ctx.fillRect(x-18+i*4,y-46-h,4,h+4)}
 r(x-18,y-42,36,1,'#a89c84');ctx.strokeStyle='#d9cfb8';ctx.beginPath();ctx.moveTo(x-17,y-41);ctx.lineTo(x-4,y-18);ctx.moveTo(x+17,y-41);ctx.lineTo(x+4,y-18);ctx.stroke()}
function drawNest(e){const x=Math.round(e.x-camX),y=Math.round(e.y),fl=e.flash>0&&T%2;
 drawHead(x+10,y-6,EN,e.flash>0?'hurt':e.shootT>0?'grit':'normal',-1);
 const sb=fl?'#fff':'#9a8660',sb2=fl?'#ddd':'#7a6a48';for(let i=0;i<5;i++)r(x+i*7,y-6,8,6,i%2?sb:sb2);for(let i=0;i<4;i++)r(x+3+i*7,y-11,8,5,i%2?sb2:sb);r(x+8,y-15,16,4,sb);
 r(x-6,y-16,16,3,'#262626');r(x-8,y-17,3,5,'#3a3a3a');if(e.shootT>0&&T%4<2)r(x-14,y-18,6,6,'#ffe27a')}
function drawMortarCrew(e){const x=e.x-camX;seg(x+e.face*-2+(e.face<0?16:0)+(e.face<0?-6:6),e.y-2,x+(e.face<0?16:0)+(e.face<0?-12:12),e.y-14,3,'#3a3a3a');
 drawSoldier(x,e.y,{fac:EN,pose:'crouch',face:-e.face,emo:e.flash>0?'hurt':e.shootT>0?'grit':'normal',gun:null})}
function drawBoat(b){const x=Math.round(b.x-camX),y=WATERY+Math.sin(T/12+b.x)*1.5,fl=b.flash>0&&T%2;
 r(x,y-6,40,6,fl?'#fff':'#6a4a2a');r(x+2,y,36,3,fl?'#ddd':'#4a3220');r(x-3,y-8,6,4,'#6a4a2a');r(x+37,y-8,6,3,'#6a4a2a');r(x,y-7,40,1,'#8a6a42');emblem(EN,x+16,y-5)}

/* ---------------- vehicles ---------------- */
function drawDonkey(v){const x=Math.round(v.x-camX),y=Math.round(v.y),f=v.face,fl=v.flash>0&&T%2;
 ctx.save();ctx.translate(x+(f<0?36:0),y);if(f<0)ctx.scale(-1,1);
 const col=fl?'#fff':'#8a8078',dk='#5a524c',p=(v.anim||0)*.35;
 for(const[lx,ph]of[[7,0],[11,Math.PI],[24,Math.PI/2],[28,Math.PI*1.5]]){const s=v.moving?Math.sin(p+ph)*3:0;seg(lx,-9,lx+s,-2,3,ph>2?dk:col);r(lx+s-1,-2,3,2,'#2a2420')}
 r(4,-20,28,11,col);r(3,-18,30,7,col);r(6,-10,24,2,dk);r(28,-26,7,9,col);r(30,-32,9,8,col);r(37,-28,4,5,'#b8aaa0');r(34,-29,2,1,'#111');r(33,-30,3,1,'#111');
 r(29,-40,3,9,col);r(33,-41,3,10,col);r(30,-38,1,6,'#d8b8b0');r(34,-39,1,7,'#d8b8b0');r(1,-19,3,1,dk);r(-1,-18+(T>>3)%2,3,6,'#3a3430');
 r(8,-22,16,3,'#7a2a2a');r(10,-24,12,2,'#a07a42');
 // cannon on the back
 const ca=v.aimUp?-1.2:-.2;seg(18,-24,18+Math.cos(ca)*16,-24+Math.sin(ca)*16,4,'#3a3a3a');r(14,-27,8,5,'#555');
 ctx.restore();
 if(v.rider)drawSoldier(x+10*(f<0?-1:1)+ (f<0?14:0)-(f<0?14:0)+4,y-18,{fac:S,pose:'sit',face:f,aim:v.aimUp?-1:0,gun:'hmg',muzz:P.muzz>0,hero:1,emo:v.riderEmo||'determined',blink:T%200<6});
 if(v.hp<v.max&&!v.rider){const hw=20;r(x+8,y-46,hw,2,'#3a1714');r(x+8,y-46,hw*v.hp/v.max,2,'#9fe0a0')}}
function drawSV(v){const x=Math.round(v.x-camX),y=Math.round(v.y),f=v.face,fl=v.flash>0&&T%2;
 ctx.save();ctx.translate(x+(f<0?40:0),y);if(f<0)ctx.scale(-1,1);
 const body=fl?'#fff':'#6a7050',dk='#4a5038';
 r(0,-10,40,10,'#262622');for(let i=0;i<5;i++){r(3+i*8,-8,6,6,'#4a4a44');r(5+i*8,-6,2,2,'#262622')}for(let i=0;i<8;i++)r(((i*6+(v.moving?T:0))%40),-10,2,1,'#5a5a52');
 r(2,-19,36,9,body);r(2,-19,36,2,dk);r(10,-28,20,9,body);r(10,-28,20,2,dk);
 const ca=v.aimUp?-1.2:0;seg(28,-24,28+Math.cos(ca)*16,-24+Math.sin(ca)*16,3,'#2a2a26');
 r(14,-17,12,5,'#e9dcc2');ctx.font='6px monospace';ctx.fillStyle='#120d0c';ctx.textAlign='left';ctx.textBaseline='top';ctx.fillText('SV-46',14,-17);
 ctx.restore();
 if(v.rider){ctx.save();ctx.translate(x+(f<0?40:0),y);if(f<0)ctx.scale(-1,1);ctx.translate(12,-22);chibiHead(v.riderEmo||'determined',T%200<6);cap(S);ctx.restore()}}

/* ---------------- bosses ---------------- */
function bossBar(b){const w=120,x=W/2-w/2,y=30;r(x-1,y-1,w+2,6,'#120d0c');r(x,y,w,4,'#3a1714');r(x,y,w*Math.max(0,b.hp/b.max),4,'#e0302a');txt(BOSSNAME[b.kind](),W/2,y+7,'#e9dcc2','center')}
function drawTruck(b){const x=Math.round(b.x-camX),y=b.y,fl=b.flash>0&&T%2,P_=PAL[EN];const U=fl?'#fff':P_.u,D=fl?'#ddd':P_.d;
 r(x,y-13,70,5,'#2a2420');r(x,y-27,22,14,U);r(x+3,y-25,9,6,'#6d8a96');r(x,y-15,4,2,'#ffd24a');
 r(x+22,y-31,48,18,D);for(let i=0;i<5;i++)r(x+24+i*9,y-31,1,18,'#00000033');emblem(EN,x+42,y-27);
 r(x+33,y-39,2,8,'#555');r(x+25,y-43,10,6,'#9a9a9a');r(x+23,y-44,3,8,'#c0c0c0');r(x+38,y-43,10,6,'#9a9a9a');r(x+47,y-44,3,8,'#c0c0c0');
 if(b.cool<12&&!b.dead){r(x+19,y-48,2,2,'#e9dcc2');r(x+16,y-52,2,2,'#e9dcc2')}
 for(const wx of[x+6,x+46]){r(wx,y-9,12,9,'#151210');r(wx+4,y-6,4,3,'#555')}
 drawHead(x+3,y-14,EN,b.flash>0?'hurt':'shout',-1)}
function drawTank(b){const x=Math.round(b.x-camX),y=b.y,fl=b.flash>0&&T%2,body=fl?'#fff':'#5d6447',dk=fl?'#ddd':'#434833';
 r(x,y-12,84,12,'#262622');for(let i=0;i<7;i++){r(x+4+i*11,y-10,8,8,'#4a4a44');r(x+7+i*11,y-7,2,2,'#262622')}
 for(let i=0;i<14;i++)r(x+((i*6+T)%84),y-12,2,1,'#5a5a52');
 r(x+3,y-22,78,10,body);r(x+3,y-22,78,2,dk);r(x+26,y-33,36,11,body);r(x+26,y-33,36,2,dk);
 drawHead(x+38,y-46,EN,b.flash>0?'hurt':b.hp<b.max*.3?'scared':'grit',-1);r(x+36,y-36,20,3,dk);
 r(x-8,y-30,36,3,dk);r(x-10,y-31,4,5,'#2a2a26');r(x+50,y-20,28,6,'#e9dcc2');r(x+52,y-18,24,2,'#999');
 {const s='PROPERTY OF: '+PLATES[b.plate],w=s.length*8;txt(s,clamp(x+42,w/2+4,W-w/2-4),y-62,'#e9dcc2','center')}}
function drawTrain(b){const x0=Math.round(b.x-camX),y=b.y;
 for(const p of b.parts){const x=x0+p.ox,fl=p.flash>0&&T%2,dead=p.hp<=0;const c=dead?'#2a2622':fl?'#fff':p.kind==='engine'?'#3a3a42':'#4a4e3a',dk=dead?'#1a1612':'#2e3226';
  r(x,y-p.h,p.w,p.h-6,c);r(x,y-p.h,p.w,3,dk);r(x+2,y-8,p.w-4,3,dk);for(let i=0;i<p.w;i+=14){r(x+i+3,y-6,8,6,'#1a1a1a');r(x+i+6,y-4,2,2,'#555')}
  for(let i=6;i<p.w-6;i+=8)r(x+i,y-p.h+6,1,p.h-14,'#00000030');
  if(dead){if(T%8<4)r(x+p.w/2-3,y-p.h-6,6,6,'#ff8a1a');continue}
  if(p.kind==='cannon'){r(x+10,y-p.h-10,26,10,c);seg(x+12,y-p.h-6,x-12,y-p.h-14,4,'#2a2a26');}
  else if(p.kind==='mg'){r(x+8,y-p.h-4,16,4,c);r(x-6,y-p.h+8,10,3,'#262626');for(let i=0;i<3;i++)drawHead(x+6+i*16,y-p.h+4,EN,p.flash>0?'hurt':'grit',-1)}
  else if(p.kind==='troops'){for(let i=0;i<3;i++){r(x+6+i*16,y-p.h+8,12,10,'#120d0c');if((T>>5)%3===i)drawHead(x+4+i*16,y-p.h+30,EN,'shout',-1)}}
  else if(p.kind==='engine'){r(x+p.w-14,y-p.h-14,8,14,'#2a2a2a');r(x+4,y-p.h+6,14,10,'#ffd24a40');r(x-4,y-14,6,8,'#5a5a5a');emblem(EN,x+30,y-p.h+8);
   if(T%6<3)r(x+p.w-14,y-p.h-20-(T%12),8,6,'#4a4048')}}
}
function drawBomber(b){const x=Math.round(b.x-camX),y=Math.round(b.y),fl=b.flash>0&&T%2,c=fl?'#fff':'#6a7058',dk=fl?'#ddd':'#4a5040',f=b.face;
 ctx.save();ctx.translate(x,y);if(f>0)ctx.scale(-1,1);
 r(-40,-8,80,14,c);r(-44,-6,6,10,c);r(-46,-4,4,6,'#9fc3d6');r(-40,-8,80,3,dk);r(-10,-2,60,4,dk);
 r(-20,-2,60,4,c);r(-30,0,90,4,c);r(-30,0,90,1,dk);r(30,-18,10,12,c);r(32,-20,12,4,dk);r(28,2,16,3,c);
 for(const ex of[-12,22]){r(ex,-2,10,8,'#3a3a3a');const sp=T%4<2;r(ex-2,sp?-8:2,2,sp?10:8,'#aaa')}
 r(-36,-12,10,5,'#9fc3d6');drawHead(-36,4,EN,b.flash>0?'hurt':'grit',-1);
 emblem(EN,8,-4);if(b.bay>0){r(-6,6,14,3,'#111')}
 ctx.restore();if(b.hp<b.max*.5&&T%3===0)parts.push({x:b.x+(f>0?30:-30),y:b.y,vx:0,vy:-.3,life:40,max:40,s:4,g:-.01,smoke:1})}
function drawCar(b){const x=Math.round(b.x-camX),y=b.y,fl=b.flash>0&&T%2,c=fl?'#fff':'#5a5a48',dk=fl?'#ddd':'#3a3a2e';
 r(x,y-22,60,14,c);r(x+4,y-26,52,4,dk);r(x+6,y-21,8,4,'#2a3540');r(x,y-12,60,4,dk);
 for(const wx of[x+6,x+40]){r(wx,y-10,14,10,'#151210');r(wx+5,y-6,4,3,'#555')}
 r(x+20,y-36,24,10,c);r(x+20,y-36,24,2,dk);const ax=Math.cos(b.ang)*14,ay=Math.sin(b.ang)*14;seg(x+26,y-31,x+26+ax,y-31+ay,3,'#262626');
 drawHead(x+26,y-38,EN,b.flash>0?'hurt':'grit',-1);r(x+46,y-20,12,6,'#e9dcc2');ctx.font='6px monospace';ctx.fillStyle='#111';ctx.textAlign='left';ctx.textBaseline='top';ctx.fillText('PEACE',x+46,y-20)}
function drawPress(b){const x0=Math.round(b.x-camX),y=b.y;
 r(x0,y-110,120,110,'#2a2430');r(x0,y-110,120,4,'#4a4250');r(x0+6,y-98,108,2,'#4a4250');
 ctx.font='900 12px "Noto Serif TC",serif';ctx.fillStyle='#d9a441';ctx.textAlign='center';ctx.textBaseline='top';ctx.fillText(EN==='kmt'?'中央銀行':'人民銀行',x0+60,y-108);
 for(const p of b.parts){const x=x0+p.ox,py=y-p.oy,fl=p.flash>0&&T%2,dead=p.hp<=0,c=dead?'#1a1612':fl?'#fff':'#5a5060';
  if(p.kind==='roller'){r(x,py,p.w,p.h,c);if(!dead){const sp=(T*2)%8;for(let i=0;i<p.h;i+=8)r(x+2,py+((i+sp)%p.h),p.w-4,2,'#8a7a90')}r(x-16,py+p.h/2-3,16,6,'#3a3440');if(!dead&&T%10<5)r(x-22,py+p.h/2-4,8,8,'#7ab07a')}
  else if(p.kind==='gold'){r(x,py,p.w,p.h,c);seg(x+4,py+6,x-14,py-4,6,dead?'#1a1612':'#3a3a3a');if(!dead)r(x+6,py+4,10,6,'#d9a441')}
  else if(p.kind==='core'){r(x,py,p.w,p.h,c);if(!dead){r(x+4,py+4,p.w-8,p.h-8,T%20<10?'#ff6a3d':'#d9a441');txt('¥',x+p.w/2-4,py+p.h/2-4,'#120d0c')}}
  if(dead&&T%10<5)r(x+p.w/2-3,py-6,6,6,'#ff8a1a')}
 r(x0+86,y-140,14,30,'#3a3440');if(T%5<3)parts.push({x:b.x+93,y:y-142,vx:-.2,vy:-.6,life:50,max:50,s:5,g:-.004,smoke:1});
 txt('NOTES PRINTED: '+fmtBig(b.printed),x0+60,y-124,'#7ab07a','center')}
function drawGunboat(b){const x=Math.round(b.x-camX),y=WATERY+Math.sin(T/15)*2,fl=b.flash>0&&T%2,c=fl?'#fff':'#5a6068',dk='#3a4048';
 r(x,y-14,110,14,c);r(x-8,y-14,10,8,c);r(x+4,y,100,4,dk);r(x,y-16,110,2,dk);r(x+40,y-32,40,18,c);r(x+44,y-28,8,6,'#9fc3d6');r(x+56,y-28,8,6,'#9fc3d6');r(x+66,y-48,4,16,'#3a3a3a');
 r(x+70,y-48,14,9,(T>>5)%2?'#2f4f8a':'#b8322a');r(x+74,y-46,5,5,(T>>5)%2?'#f2f2f2':'#f1d27a');
 r(x+10,y-22,18,8,dk);seg(x+12,y-20,x-6,y-26,3,'#262626');drawHead(x+14,y-22,EN,b.flash>0?'hurt':'grit',-1);
 r(x+86,y-22,16,8,dk);r(x+78,y-20,8,2,'#262626')}
function drawMech(b){const x=Math.round(b.x-camX),y=b.y,fl=b.flash>0&&T%2,st=b.stomp;
 const lg=(lx,ph)=>{const lift=Math.max(0,Math.sin(b.walk+ph))*8;r(x+lx,y-60,10,40-lift,'#4a4a52');r(x+lx-4,y-22-lift,18,8,'#3a3a42');r(x+lx-6,y-8-lift,22,8,'#2a2a32')};
 lg(10,0);lg(66,Math.PI);
 r(x,y-70,90,14,'#3a3a42');r(x+4,y-64,82,4,'#55555e');
 const bx=x-5,by=y-150;r(bx,by,100,80,fl?'#fff':'#c8b890');r(bx+3,by+3,94,74,'#e9dcc2');r(bx,by,100,3,'#8a7a5a');
 // the face, pending approval
 const ph=b.phase;r(bx+30,by+12,40,48,SK);r(bx+30,by+12,40,8,'#1a1110');
 if(b.eyeT>0){r(bx+36,by+28,10,6,'#fff');r(bx+54,by+28,10,6,'#fff');r(bx+40,by+29,3,4,'#e0302a');r(bx+58,by+29,3,4,'#e0302a')}
 else{txt('?',bx+46,by+30,'#1a1110')}
 r(bx+42,by+48,16,ph>1?6:2,'#5a0e0e');
 txt('APPROVAL',bx+50,by+64,'#8a7a5a','center');ctx.fillStyle='#8a7a5a';r(bx+8,by+20,14,24,'#d0c4a8');r(bx+78,by+20,14,24,'#d0c4a8');
 r(bx-14,by+20,14,10,'#555');r(bx-20,by+18,8,14,'#888');r(bx+100,by+20,14,10,'#555');
 if(b.laser>0){const ly=b.laserY;ctx.globalAlpha=b.laser>40?.35:1;r(0,ly-(b.laser>40?1:4),bx+40,b.laser>40?2:8,'#ff3a2a');r(0,ly-1,bx+40,2,'#fff');ctx.globalAlpha=1}}

/* ---------------- backgrounds ---------------- */
const THEMES={
 village:{sky:['#1c1420','#4a2a2c','#a0533a'],m1:'#3a2630',m2:'#2e1f27',house:'#21171b',ground:'#4a382a',top:'#6e5640',spk:'#3a2c20',sun:'#e9a56a'},
 paddy:{sky:['#2e3640','#56605c','#8a8f7a'],m1:'#4a5a50',m2:'#3a4840',house:'#2a302a',ground:'#4f4632',top:'#6b7a3a',spk:'#3a3424',sun:null},
 snow:{sky:['#7d93b0','#aebdd0','#dfe6ee'],m1:'#c9d4e2',m2:'#9fb0c4',house:'#2f4a3a',ground:'#dfe6ee',top:'#ffffff',spk:'#b8c4d2',sun:'#f4f4f0'},
 city:{sky:['#0b0e20','#1a1f40','#3a2a4a'],m1:'#1a1830',m2:'#231f38',house:'#15131f',ground:'#38343e',top:'#5a5662',spk:'#2a2830',sun:'#e8e0c0'},
 river:{sky:['#2a1e3a','#8a4a64','#e8a060'],m1:'#3a2a3a',m2:'#2c2030',house:'#21171b',ground:'#7a6448',top:'#a08860',spk:'#5a4a34',sun:'#ffcf80'}};
let BGD=null;
function buildBG(){const R=seeded(1946+LV*101),th=THEMES[L.theme];
 const m1=[],m2=[];{let h=40,g=30;for(let i=0;i<700;i++){h=clamp(h+(R()-.5)*7,18,72);g=clamp(g+(R()-.5)*5,10,44);m1.push(h);m2.push(g)}}
 const houses=[];{let x=-40;while(x<2400){const w=24+R()*30|0,h=12+R()*(L.theme==='city'?60:16)|0;houses.push({x,w,h,burn:R()<.3,win:R()<.6,sign:R()<.35});x+=w+(L.theme==='city'?4:12)+R()*(L.theme==='city'?16:50)}}
 const fg=[];{let x=80;while(x<3400){const t=R();fg.push({x,t:L.theme==='city'?(t<.4?'lamp':t<.7?'bags':'rick'):L.theme==='snow'?(t<.6?'pine':'bags'):L.theme==='paddy'?(t<.5?'sprout':t<.75?'tree':'bags'):(t<.4?'bags':t<.65?'tree':t<.85?'cart':'pole')});x+=70+R()*130}}
 const wx=[];for(let i=0;i<60;i++)wx.push({x:R()*W,y:R()*H,v:.5+R(),ph:R()*6});
 BGD={th,m1,m2,houses,fg,wx};
 const g=ctx.createLinearGradient(0,0,0,GY);th.sky.forEach((c,i)=>g.addColorStop(i/(th.sky.length-1),c));BGD.sky=g}
function drawBG(){const th=BGD.th;ctx.fillStyle=BGD.sky;ctx.fillRect(-8,-8,W+16,GY+8);
 if(skyFlash>0){const g=ctx.createRadialGradient(skyFX,150,4,skyFX,150,170);g.addColorStop(0,`rgba(255,200,120,${skyFlash*.7})`);g.addColorStop(1,'rgba(255,120,60,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,GY)}
 if(th.sun){const sx=300-(camX*.02|0);r(sx,40,14,14,th.sun);r(sx-2,42,18,10,th.sun)}
 if(L.theme==='city')for(let i=0;i<30;i++)r((i*53+7)%W,(i*29)%70,1,1,'#e9dcc2');
 let o=camX*.12;for(let sx=-4;sx<W+4;sx+=2){const h=BGD.m1[((sx+o)/2|0)%700]*(L.theme==='city'?.5:1);r(sx,150-h,2,h+40,th.m1);if(L.theme==='snow')r(sx,150-h,2,3,'#ffffff')}
 o=camX*.25;for(let sx=-4;sx<W+4;sx+=2){const h=BGD.m2[((sx+o)/2|0)%700];r(sx,166-h,2,h+40,th.m2);if(L.theme==='snow')r(sx,166-h,2,2,'#eef2f8')}
 if(L.theme==='river'){r(0,166,W,30,'#3a3a5a');}
 o=camX*.5;for(const h of BGD.houses){const x=h.x-o;if(x<-60||x>W+20)continue;const top=176-h.h;
  if(L.theme==='city'){r(x,top,h.w,h.h,th.house);for(let wy=top+4;wy<172;wy+=7)for(let wx=x+3;wx<x+h.w-3;wx+=6)if(((wx*7+wy*3)|0)%5<2)r(wx,wy,2,3,'#e0b050');
   if(h.sign){r(x+2,top+6,6,20,(T>>4)%2?'#ff4a6a':'#ff7a8a');hanV('銀行',x+5,top+7,'#fff',8)}continue}
  if(L.theme==='snow'){r(x+h.w/2-1,170-h.h,2,h.h,'#2a1e18');for(let k=0;k<4;k++)r(x+h.w/2-3-k*2,170-h.h+k*5,6+k*4,5,th.house);r(x+h.w/2-3,170-h.h,6,1,'#fff');continue}
  if(h.burn&&L.theme!=='paddy'){for(let k=0;k<9;k++){const py=top-8-((T*.35+k*15)%130),px=x+h.w/2+Math.sin((T+k*40)/40)*5+k*1.4,s=3+k*.8;ctx.fillStyle=`rgba(30,22,24,${.55-k*.04})`;ctx.fillRect(px|0,py|0,s|0,s|0)}}
  r(x,top,h.w,h.h,th.house);r(x-4,top-3,h.w+8,3,L.theme==='paddy'?'#7a6a3a':'#1a1216');r(x-1,top-6,h.w+2,3,L.theme==='paddy'?'#8a7a48':'#1a1216');
  if(h.win)r(x+h.w/2-1,top+5,3,4,L.theme==='paddy'?'#3a3a2a':'#d9843a');
  if(h.burn&&L.theme!=='paddy'){const fl=(T>>2)%3;r(x+4,top-8-fl,4,4+fl,'#ff8a1a');r(x+h.w-10,top-10+fl,5,6-fl,'#ffb04a')}}
 if(L.theme==='river'){// water band in the distance
  for(let y=170;y<GY+4;y+=3)r(0,y,W,3,y%2?'#3a4a6a':'#34445f');for(let i=0;i<20;i++)r(((i*37-camX*.6)%W+W)%W,172+(i%5)*3,8,1,'#6a8ab0')}
 // walls with posters
 for(const wx of L.walls){const x=wx-camX;if(x<-70||x>W+10)continue;const gy=groundAt(wx+30);if(gy>1e3)continue;
  r(x,gy-42,60,42,'#5b4636');for(let yy=0;yy<42;yy+=6)r(x,gy-42+yy,60,1,'#4a382b');
  const pS=TEXT[S].posters,pE=TEXT[EN].posters,i=(wx/10|0)%2*2,pc=f=>f==='kmt'?['#2f4f8a','#f2f2f2']:['#b8322a','#f1d27a'];
  let[bg,fg]=pc(S);r(x+6,gy-38,20,28,bg);hanV(pS[i],x+16,gy-35,fg);
  [bg,fg]=pc(EN);r(x+20,gy-40,22,30,bg);r(x+20,gy-40,4,4,'#5b4636');hanV(pE[i+1]||pE[0],x+31,gy-37,fg);
  r(x+44,gy-30,12,14,'#d8ccb0');r(x+45,gy-27,10,1,'#6a5a48');r(x+45,gy-24,8,1,'#6a5a48')}
 for(const f of BGD.fg){const x=f.x-camX;if(x<-40||x>W+10)continue;const gy=groundAt(f.x+10);if(gy>1e3)continue;
  if(f.t==='bags'){for(let i=0;i<4;i++)r(x+i*9,gy-5,9,5,'#8a7650');for(let i=0;i<3;i++)r(x+4+i*9,gy-10,9,5,'#9a8660')}
  else if(f.t==='tree'){r(x+4,gy-34,3,34,'#2a1e18');r(x-2,gy-28,8,2,'#2a1e18');r(x+6,gy-22,9,2,'#2a1e18');if(L.theme==='paddy'){r(x-6,gy-44,22,12,'#3a5a32');r(x-2,gy-50,14,8,'#4a6a3a')}}
  else if(f.t==='cart'){r(x,gy-10,26,4,'#5a4030');r(x+3,gy-8,8,8,'#2a1e18')}
  else if(f.t==='pine'){r(x+6,gy-12,3,12,'#3a2a20');for(let k=0;k<4;k++){r(x+7-3-k*2,gy-40+k*7,6+k*4,7,'#2f4a3a');r(x+7-3-k*2,gy-40+k*7,6+k*4,1,'#fff')}}
  else if(f.t==='sprout'){for(let i=0;i<6;i++)r(x+i*5,gy-4-(i%2),1,4,'#6a9a3a')}
  else if(f.t==='lamp'){r(x+4,gy-50,2,50,'#2a2a30');r(x,gy-54,10,4,'#3a3a40');r(x+2,gy-50,6,3,'#ffe8a0');ctx.globalAlpha=.12;r(x-10,gy-48,30,48,'#ffe8a0');ctx.globalAlpha=1}
  else if(f.t==='rick'){seg(x,gy-8,x+24,gy-14,2,'#5a3a2a');r(x+14,gy-22,12,10,'#7a2a2a');r(x+16,gy-10,8,8,'#1a1410');r(x+18,gy-7,4,2,'#555')}
  else{r(x+5,gy-60,2,60,'#3a2a20');r(x,gy-58,12,2,'#3a2a20')}}
 // platforms
 for(const p of plats){const x=p.x-camX;if(x<-p.w-10||x>W)continue;
  if(p.raft){for(let i=0;i<p.w;i+=6)r(x+i,p.y,5,5,i%12?'#8a6a42':'#7a5a38');r(x,p.y+5,p.w,2,'#4a3220');r(x+p.w/2,p.y-30,2,30,'#5a4030');r(x+p.w/2-14,p.y-30,14,10,'#d9cfb8');continue}
  if(p.boat)continue;
  const gy=Math.min(GY,groundAt(p.x+p.w/2));r(x+4,p.y,3,gy-p.y,'#3e2e22');r(x+p.w-7,p.y,3,gy-p.y,'#3e2e22');
  if(L.theme==='city'){r(x,p.y,p.w,3,'#6a6070');r(x,p.y+3,p.w,1,'#2a2630');for(let i=2;i<p.w;i+=5)r(x+i,p.y-6,1,6,'#6a6070');r(x,p.y-6,p.w,1,'#6a6070')}
  else if(L.theme==='snow'){r(x,p.y,p.w,4,'#8a96a6');r(x,p.y,p.w,2,'#fff')}
  else{r(x+8,p.y+6,p.w-16,gy-p.y-6,'#4a3a2e');r(x,p.y,p.w,3,'#7a5a3c');r(x,p.y+3,p.w,1,'#3e2e22')}}
 // ground with slopes
 for(let sx=0;sx<W;sx+=2){const g=groundAt(camX+sx);if(g>1e3)continue;r(sx,g,2,H-g,th.ground);r(sx,g,2,2,th.top);const wx=camX+sx|0;if(((wx*2654435761)>>>0)%9<2)r(sx,g+5+(wx%11),2,1,th.spk)}
 if(L.theme==='city')for(let sx=-(camX%16);sx<W;sx+=16)r(sx,GY+8,8,1,'#2a2830');
 if(L.theme==='river'||L.deep)drawWater();
 for(const s of scorch){const x=s.x-camX;if(x<-50||x>W)continue;const g=groundAt(s.x+14);if(g>1e3)continue;r(x+3,g,s.w-6,2,'#1e1612');r(x,g+2,s.w,2,'#2a1e18')}}
function drawWater(){if(!L.deep)return;for(const d of L.deep){const x1=Math.max(0,d[0]-camX),x2=Math.min(W,d[1]-camX);if(x2<=x1)continue;
 r(x1,WATERY,x2-x1,H-WATERY,'#2c3c5a');for(let sx=x1;sx<x2;sx+=4){const wv=Math.sin((sx+camX)/14+T/10)*1.5;r(sx,WATERY+wv-1,4,2,'#6a8ab0')}for(let i=0;i<12;i++)r(x1+((i*41+T)%(x2-x1||1)),WATERY+6+(i%4)*5,6,1,'#4a6a90')}}
function drawShallow(){for(const w of L.shallow||[]){const x1=Math.max(0,w[0]-camX),x2=Math.min(W,w[1]-camX);if(x2<=x1)continue;
 ctx.globalAlpha=.55;r(x1,GY-4,x2-x1,H-GY+4,'#5d7a78');ctx.globalAlpha=1;for(let sx=x1;sx<x2;sx+=3)r(sx,GY-4+Math.sin((sx+camX)/8+T/12),3,1,'#9fc0bc');
 for(let sx=x1+4;sx<x2;sx+=11)r(sx,GY-8,1,5,'#6a9a3a')}}
function drawWeather(){const w=L.weather;if(!w)return;
 for(const p of BGD.wx){if(w==='rain'){p.x-=2;p.y+=7*p.v;if(p.y>H){p.y=-10;p.x=rnd()*(W+60)}if(p.x<-10)p.x+=W+20;r(p.x,p.y,1,6,'rgba(170,190,210,.5)')}
  else if(w==='snow'){p.x+=Math.sin((T+p.ph*60)/40)*.4-.3;p.y+=.6*p.v;if(p.y>H){p.y=-4;p.x=rnd()*W}if(p.x<-4)p.x+=W+8;r(p.x,p.y,p.v>1?2:1,p.v>1?2:1,'#ffffff')}
  else if(w==='money'){p.x+=Math.sin((T+p.ph*60)/30)*.6;p.y+=.4*p.v;if(p.y>H){p.y=-6;p.x=rnd()*W}const fl=Math.sin((T+p.ph*40)/10);r(p.x,p.y,6,Math.max(1,Math.abs(fl)*4)|0,p.ph>3?'#8aa070':'#b0a070')}}
 if(w==='rain'&&T%200<3){ctx.globalAlpha=.15;r(0,0,W,H,'#fff');ctx.globalAlpha=1}}

/* ---------------- story scenes ---------------- */
function sceneArt(name,t){const K='#120d0c';
 const sky=(a,b)=>{const g=ctx.createLinearGradient(0,0,0,136);g.addColorStop(0,a);g.addColorStop(1,b);ctx.fillStyle=g;ctx.fillRect(0,0,W,136)};
 switch(name){
 case 'table':{r(0,0,W,136,'#4a3a30');for(let x=0;x<W;x+=24)r(x,0,1,136,'#3e3028');r(140,14,104,50,'#2a1e28');
  const fl=(t>>4)%4;if(fl<2){r(160+fl*30,30,18,18,'#ff8a1a');r(164+fl*30,34,10,10,'#ffe27a')}r(190,14,2,50,'#5a4a3a');r(140,38,104,2,'#5a4a3a');
  r(40,98,304,8,'#6a4a2a');r(40,106,304,4,'#4a3220');r(60,110,4,26,'#4a3220');r(320,110,4,26,'#4a3220');
  drawSoldier(80,104,{fac:'kmt',face:1,emo:(t>>5)%2?'smug':'grit',officer:1,gun:null});drawSoldier(288,104,{fac:'ccp',face:-1,emo:(t>>5)%2?'grit':'smug',officer:1,gun:null});
  drawCivilian(184,104,{face:1,hat:'fedora',cl:'#3a3a3a',cl2:'#2a2a2a',sash:'#7a2a2a',emo:'scared',shoe:'#111'});
  r(150,92,30,8,'#e9dcc2');r(200,92,30,8,'#e9dcc2');ctx.font=F;ctx.fillStyle=K;ctx.textAlign='left';ctx.fillText('TRU',151,93);ctx.fillText('CE',203,93);
  r(70,86,4,6,'#3a4030');r(71,82,2,4,WOOD);r(306,86,4,6,'#3a4030');r(307,82,2,4,WOOD);break}
 case 'flags':{sky('#3a2a3a','#a0603a');r(0,96,W,40,'#5a4636');for(let x=0;x<W;x+=12)r(x,96,1,40,'#4a382b');r(0,128,W,8,'#4a382a');
  seg(220,128,236,60,3,'#7a5a3a');seg(240,128,256,60,3,'#7a5a3a');for(let y=70;y<128;y+=12)r(222+(128-y)/4,y,20,2,'#7a5a3a');
  const flip=(t>>6)%2;r(200,40,2,50,'#3a2a20');if(flip){r(202,42,30,20,'#b8322a');r(205,44,6,6,'#f1d27a')}else{r(202,42,30,20,'#2f4f8a');r(214,48,8,8,'#f2f2f2')}
  drawCivilian(234,82,{face:-1,hat:'straw',emo:'smug',arm:'up'});
  for(let i=0;i<5;i++){r(70+i*6,118-i*4,30,6,i%2?'#b8322a':'#2f4f8a')}drawCivilian(120,128,{face:1,hat:'cap',cl:'#6a5a3a',emo:'happy',arm:'wave'});
  txt('FLAGS · 旗',110,100,'#d9a441','center');break}
 case 'paddy':{sky('#56605c','#8a8f7a');r(0,90,W,46,'#5d7a78');for(let x=0;x<W;x+=9)r(x,96+(x%27)/3,1,6,'#6a9a3a');
  const pull=Math.sin(t/8)*3;drawSoldier(130-pull,120,{fac:'kmt',face:1,emo:'grit',gun:null});drawSoldier(238+pull,120,{fac:'ccp',face:-1,emo:'grit',gun:null});
  drawCivilian(184,120,{face:1,hat:'straw',emo:'cry'});r(150,108,34,3,SK);r(198,108,34,3,SK);r(186,82,12,10,'#e9dcc2');ctx.font='6px monospace';ctx.fillStyle=K;ctx.fillText('DEED',187,86);break}
 case 'wreck':{sky('#4a4a50','#9a8a7a');r(0,110,W,26,'#4f4632');for(let x=0;x<W;x+=8)r(x,108,6,2,'#5a4a3a');r(0,106,W,2,'#777');
  ctx.save();ctx.translate(110,100);ctx.rotate(-.25);r(0,-30,90,30,'#3a3a42');r(0,-30,90,4,'#2a2a30');ctx.restore();ctx.save();ctx.translate(200,112);ctx.rotate(.3);r(0,-28,80,28,'#4a4e3a');ctx.restore();
  for(let k=0;k<6;k++){const py=60-((t*.5+k*14)%70);r(150+Math.sin((t+k*30)/20)*6,py,6+k,6+k,'rgba(60,50,50,.6)')}
  drawDonkey({x:camX+250,y:112,face:-1,hp:1,max:1,anim:0,rider:null});break}
 case 'snow':{sky('#7d93b0','#dfe6ee');r(0,110,W,26,'#eef2f8');for(let i=0;i<5;i++)drawSoldier(30+i*42+((t/2)%42),120,{fac:i%2?'kmt':'ccp',face:1,pose:'run',anim:t+i*5,emo:'cry',gun:'rifle'});
  r(270,96,50,26,'#7a5a35');r(270,96,50,3,'#9c7a4c');txt('COATS',276,104,'#e9dcc2');r(330,70,36,40,'#e9dcc2');r(330,70,36,8,'#c8372d');txt('APR',333,86,'#120d0c');
  for(let i=0;i<40;i++)r((i*37+t)%W,(i*23+t*.7)%136,1,1,'#fff');break}
 case 'campfire':{sky('#0b0e20','#2a2440');r(0,110,W,26,'#dfe6ee');const fl=(t>>2)%3;ctx.globalAlpha=.25;r(130,60,124,76,'#ff8a3a');ctx.globalAlpha=1;
  r(184,104,16,6,'#5a3a20');r(186,92-fl,6,12+fl,'#ff8a1a');r(192,94+fl,5,10-fl,'#ffd24a');
  drawSoldier(140,118,{fac:S,face:1,pose:'sit',emo:'happy',gun:null});drawSoldier(228,118,{fac:EN,face:-1,pose:'sit',emo:'happy',gun:null});
  r(170,96,12,8,'#e9dcc2');if(t%20<10)r(178+(t%10),84-(t%10),4,3,'#e9dcc2');txt('MANUAL',176,76,'#e9dcc2','center');break}
 case 'bankrun':{sky('#2a2430','#4a3a4a');r(220,10,150,126,'#5a5060');for(let i=0;i<5;i++)r(228+i*28,30,10,90,'#7a7080');hanV('銀行',300,12,'#d9a441',12);
  const price=fmtBig(3e6*Math.pow(1.15,t/6));r(20,20,150,30,K);txt('RICE: ¥'+price,30,30,'#ff6a5a');
  for(let i=0;i<4;i++){const x=20+i*48;drawCivilian(x,128,{face:1,pose:'run',anim:t*.3+i*4,hat:i%2?'fedora':'none',cl:i%2?'#4a4a52':'#6a5040',emo:'scared'});r(x+16,112,18,10,'#5a3a2a');for(let k=0;k<4;k++)r(x+18+k*4,106-k%2*2,4,6,'#8aa070')}break}
 case 'sidewalk':{sky('#0b0e20','#1a1f40');r(0,104,W,32,'#38343e');r(0,104,W,4,'#5a5662');for(let i=0;i<6;i++){ctx.save();ctx.translate(30+i*58,118);ctx.rotate(-Math.PI/2);drawSoldier(-8,0,{fac:'ccp',face:1,emo:'sleep',gun:null});ctx.restore();if((t>>4)%3===i%3)txt('z',50+i*58,86-(t%16)/2,'#e9dcc2')}
  for(let i=0;i<20;i++){const x=(i*41+t*1.2)%W,y=60+(i*13)%40+Math.sin((t+i*10)/10)*6;r(x,y,6,3,'#b0a070')}break}
 case 'boats':{sky('#05060f','#1a1f3a');r(0,80,W,56,'#1a2440');for(let i=0;i<30;i++){const x=(i*29-t*.4+W*4)%(W+40)-20,y=86+(i%5)*9;r(x,y,18,4,'#4a3220');r(x+4,y-6,3,6,'#120d0c');r(x+10,y-6,3,6,'#120d0c')}
  const a=Math.sin(t/40);ctx.globalAlpha=.18;ctx.fillStyle='#fff8d0';ctx.beginPath();ctx.moveTo(360,40);ctx.lineTo(160+a*80,136);ctx.lineTo(220+a*80,136);ctx.fill();ctx.globalAlpha=1;
  if(t%50<4){r(300+t%40,50,6,6,'#ff8a1a')}r(330,36,40,8,'#120d0c');break}
 case 'island':{sky('#3a5a80','#f0b070');r(0,90,W,46,'#2a4a70');for(let i=0;i<20;i++)r((i*31+t*.3)%W,94+(i%6)*6,10,1,'#6a8ab0');
  r(280,74,90,18,'#3a5a3a');r(300,64,40,12,'#4a6a3a');r(318,44,3,24,'#5a3a20');r(306,42,28,4,'#3a6a2a');
  const bx=40+((t*.4)%150);r(bx,96,46,8,'#6a4a2a');drawSoldier(bx+6,96,{fac:'kmt',face:1,emo:'smug',item:'case',gun:null});
  r(250,58,70,14,'#e9dcc2');txt('TEMPORARY',255,61,'#120d0c');txt(String(1949+Math.min(77,t/4|0)),340,40,'#ffd24a');break}
 case 'parade':{sky('#4a1a1a','#a04a3a');for(let i=0;i<12;i++){r(i*34,30+(i%2)*6,2,60,'#3a2a20');r(i*34+2,30+(i%2)*6,18,12,'#b8322a');r(i*34+5,32+(i%2)*6,3,3,'#f1d27a')}
  for(let i=0;i<10;i++)drawSoldier(10+i*30,120,{fac:'ccp',face:1,emo:'happy',gun:null,pose:(t>>3)%2?'idle':'run',anim:t});
  r(290,96,80,6,'#6a4a2a');r(300,86,40,10,'#e9dcc2');txt('FORM 1',302,88,'#120d0c');drawSoldier(330,120,{fac:'ccp',face:-1,emo:'scared',gun:null,item:'board'});break}
 }}
function drawScene(sc,t){ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
 ctx.save();ctx.beginPath();ctx.rect(0,0,W,136);ctx.clip();sceneArt(sc.draw,t);ctx.restore();
 ctx.drawImage(VIG,0,0);
 r(0,136,W,H-136,'#120d0c');r(0,136,W,2,'#d9a441');
 txt(sc.date,8,141,'#d9a441');txt(sc.place,W-8,141,'#a8977c','right');
 const shown=Math.floor(t*1.4),fl=wrap(sc.fact,47),jl=wrap(sc.joke,47);let n=0;
 ctx.font=F;ctx.textAlign='left';ctx.textBaseline='top';
 fl.forEach((l,i)=>{const v=l.slice(0,Math.max(0,shown-n));n+=l.length+1;ctx.fillStyle='#e9dcc2';ctx.fillText(v,8,153+i*10)});
 jl.forEach((l,i)=>{const v=l.slice(0,Math.max(0,shown-n));n+=l.length+1;ctx.fillStyle='#ff9a6a';ctx.fillText(v,8,155+fl.length*10+i*10)});
 if(shown>n+10&&T%40<26)txt('▶',W-16,H-12,'#d9a441');
 return shown>n}
