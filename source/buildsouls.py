import sys
core=open('src/2-core.js').read();core=core[:core.index('/* ---------------- input')]
js='\n'.join([core,open('src/3-data.js').read(),open('src/4-gfx.js').read(),open('souls/game.js').read()])
test='--test' in sys.argv
if test:
    js=js.replace("/* ---------------- loop ---------------- */","""window.__d={st:()=>({state,x:PL&&Math.round(PL.x),y:PL&&Math.round(PL.y),hp:PL&&Math.round(PL.hp),ps:PL&&PL.state,yuan:G&&G.yuan,inf:G&&G.inf,deaths:G&&G.deaths,ents:ents.filter(e=>!e.dead).length,bosses:bosses.map(b=>({k:b.k,hp:Math.round(b.hp),st:b.state,d:b.dead})),arena:arena&&arena.k,near:near&&near.label,stain:G&&G.stain,boss:G&&G.boss,LV}),
new:()=>newGame(false),skip:()=>{if(scene){const d=scene.done;scene=null;d()}},god:()=>{if(PL){PL.hp=maxHP();PL.st=maxST()}},tp:x=>{PL.x=x;PL.y=GY;camX=clamp(x-W/2,0,WW-W)},use:()=>{if(near)interact(near)},kill:()=>{const b=bosses.find(b=>!b.dead);if(b){b.hp=0;kill(b,1)}},hurt:n=>{PL.hp=n},G:()=>G,fire:()=>{$('#fireGo').click()},
near:()=>{const e=ents.find(e=>!e.dead&&Math.abs(e.x-PL.x)<200);return e&&{k:e.k,x:e.x,st:e.state}},finish:()=>finish(),bh:f=>{const b=bosses.find(b=>!b.dead);if(b){b.hp=b.max*f;b.state="idle";b.cd=1}}};setInterval(()=>{if(window.GOD)window.__d.god()},30);
/* ---------------- loop ---------------- */""")
out=open('souls/head.html').read()+'\n<script>\n(()=>{\n'+js+'\n})();\n</script>\n'
open('souls-test.html' if test else 'dark-yuan.html','w').write(out)
open('s.js','w').write('(()=>{\n'+js+'\n})();')
print(len(out))
