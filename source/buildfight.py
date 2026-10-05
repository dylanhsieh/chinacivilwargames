import sys
core=open('src/2-core.js').read();core=core[:core.index('/* ---------------- input')]
js='\n'.join([core,open('src/3-data.js').read(),open('src/4-gfx.js').read(),open('fps/sprites.js').read(),open('fight/game.js').read()])
test='--test' in sys.argv
if test:
    js=js.replace("let last=performance.now(),acc=0;","""window.__f={st:()=>({state,rState,round,timer,p1:F1&&{k:F1.key,hp:F1.hp,st:F1.st,m:F1.meter,w:F1.wins},p2:F2&&{k:F2.key,hp:F2.hp,st:F2.st,m:F2.meter,w:F2.wins},ladderI}),
cpu:(a,b,lv)=>{mode='cpu';startMatch(a,b,true);cpuLv=lv||2},both:()=>{F1.cpu=true},meter:()=>{F1.meter=100},hurt:n=>{F2.hp=n},arcade:k=>{mode='arcade';const me=k;ladder=CAST.filter(x=>x!==me).concat(['printer']);ladderI=0;F1=mkFighter(me,0,false);state='vs';vsT=0},lad:i=>{ladderI=i}};
let last=performance.now(),acc=0;""")
out=open('fight/head.html').read()+'\n<script>\n(()=>{\n'+js+'\n})();\n</script>\n'
open('fight-test.html' if test else 'civil-fighter-1949.html','w').write(out)
open('cf.js','w').write('(()=>{\n'+js+'\n})();')
print(len(out))
