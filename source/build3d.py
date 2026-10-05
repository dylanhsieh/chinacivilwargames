import sys
core=open('src/2-core.js').read();core=core[:core.index('/* ---------------- input')]
js='\n'.join([core,open('src/3-data.js').read(),open('src/4-gfx.js').read(),open('fps/sprites.js').read(),open('fps3/game3d.js').read()])
test='--test' in sys.argv
if test:
    js=js.replace("/* ---------------- loop ---------------- */","window.__f={st:()=>({state,px,py,pa,pitch,fy:P.fy,hp:P.hp,kills,freed,speakers,boss:boss&&{a:boss.active,hp:boss.hp,d:boss.dead},lives,ents:ents.filter(e=>!e.dead).length,gl:glOK}),skip:()=>{if(scene){const d=scene.done;scene=null;d()}else if(tally){tally=null;showScene(SCENES[0].post,finish)}},tp:(x,y,a,p)=>{px=x;py=y;pa=a;pitch=p||0;P.x=x;P.y=y},god:()=>{P.hp=100;P.inv=5},kb:()=>{if(boss)boss.hp=1},aim:()=>{if(boss){pa=Math.atan2(boss.y-py,boss.x-px);pitch=Math.atan2(.5-eyeY(),Math.hypot(boss.x-px,boss.y-py))}},aimAt:(x,y,z)=>{pa=Math.atan2(y-py,x-px);pitch=Math.atan2(z-eyeY(),Math.hypot(x-px,y-py))}};setInterval(()=>{if(window.GOD&&P)window.__f.god()},30);\n/* ---------------- loop ---------------- */")
    three='<script>'+open('node_modules/three/build/three.min.js').read()+'</script>'
else:
    three='<script>'+open('node_modules/three/build/three.min.js').read()+'</script>'
out=open('fps3/head.html').read()+'\n'+three+'\n<script>\n(()=>{\n'+js+'\n})();\n</script>\n'
open('fps3d-test.html' if test else 'civil-slug-siege.html','w').write(out)
open('f3.js','w').write('(()=>{\n'+js+'\n})();')
print(len(out))
