import sys
core=open('src/2-core.js').read();core=core[:core.index('/* ---------------- input')]
js='\n'.join([core,open('src/3-data.js').read(),open('src/4-gfx.js').read(),open('fps/sprites.js').read(),open('souls3d/game.js').read()])
test='--test' in sys.argv
if test:
    js=js.replace("/* ---------------- loop ---------------- */","""window.__d={st:()=>({state,x:PL&&+PL.x.toFixed(2),z:PL&&+PL.z.toFixed(2),hp:PL&&Math.round(PL.hp),ps:PL&&PL.state,yuan:G&&G.yuan,deaths:G&&G.deaths,ents:ents.filter(e=>!e.dead).length,bosses:bosses.map(b=>({k:b.k,hp:Math.round(b.hp),st:b.state,d:b.dead})),arena:arena&&arena.k,near:near&&near.label,lock:!!lockT,gl:glOK}),
new:()=>newGame(false),skip:()=>{if(scene){const d=scene.done;scene=null;d()}},god:()=>{if(PL){PL.hp=maxHP();PL.st=maxST()}},tp:(x,z,a)=>{PL.x=x;PL.z=z;if(a!=null){PL.fa=a;cy=a}},use:()=>{if(near)interact(near)},kill:()=>{const b=bosses.find(b=>!b.dead);if(b){b.hp=0;kill(b)}},hurt:n=>{PL.hp=n},cam:(a,p)=>{cy=a;cp=p},fire:()=>{$('#fireGo').click()},finish:()=>finish(),bh:f=>{const b=bosses.find(b=>!b.dead);if(b){b.hp=b.max*f;b.state="idle";b.cd=1}}};setInterval(()=>{if(window.GOD)window.__d.god()},30);
/* ---------------- loop ---------------- */""")
three=open('node_modules/three/build/three.min.js').read()
out=open('souls3d/head.html').read()+'\n<script>'+three+'</script>\n<script>\n(()=>{\n'+js+'\n})();\n</script>\n'
open('souls3d-test.html' if test else 'dark-yuan-3d.html','w').write(out)
open('s3.js','w').write('(()=>{\n'+js+'\n})();')
print(len(out))
