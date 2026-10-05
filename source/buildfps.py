import sys,re
core=open('src/2-core.js').read();core=core[:core.index('/* ---------------- input')]
parts=[core,open('src/3-data.js').read(),open('src/4-gfx.js').read(),open('fps/sprites.js').read(),open('fps/game.js').read()]
js='\n'.join(parts)
test='--test' in sys.argv
if test:
    js=js.replace("/* ---------------- loop ---------------- */","window.__f={st:()=>({state,px,py,pa,hp:P.hp,kills,freed,speakers,boss:boss&&{a:boss.active,hp:boss.hp,d:boss.dead},lives,ents:ents.filter(e=>!e.dead).length}),skip:()=>{if(scene){const d=scene.done;scene=null;d()}else if(tally){tally=null;showScene(SCENES[0].post,finish)}},tp:(x,y,a)=>{px=x;py=y;pa=a;setAngle();P.x=x;P.y=y},god:()=>{P.hp=100;P.inv=5},kb:()=>{if(boss)boss.hp=1},aim:()=>{if(boss){pa=Math.atan2(boss.y-py,boss.x-px);setAngle()}}};setInterval(()=>{if(window.GOD&&P)window.__f.god()},30);\n/* ---------------- loop ---------------- */")
out=open('fps/head.html').read()+'\n<script>\n(()=>{\n'+js+'\n})();\n</script>\n'
open('fps-test.html' if test else 'civil-slug-siege.html','w').write(out)
open('f.js','w').write('(()=>{\n'+js+'\n})();')
print(len(out))
