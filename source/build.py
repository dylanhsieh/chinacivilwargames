import sys
head=open('src/1-head.html').read()
js=''.join(open(f'src/{f}').read()+'\n' for f in ['2-core.js','3-data.js','4-gfx.js','5-game.js','6-main.js'])
test='--test' in sys.argv
if test:
    js=js.replace("/* ---------------- loop ---------------- */","window.__g={st:()=>({state,LV,camX,boss:boss&&boss.kind,hp:boss&&boss.hp,lives,score,winT,ents:enemies.length,px:P&&P.x,py:P&&P.y,pv:P&&!!P.veh,bx:boss&&boss.x,aim:P&&P.aim,nb:bullets.filter(b=>b.f).length}),go:i=>{startCampaign(window.SIDE||'kmt',i)},skip:()=>{if(scene){const d=scene.done;scene=null;d()}else if(tally){tally=null;afterTally()}},warp:x=>{camX=x;P.x=x+60;P.y=GY-40;si=L.spawns.findIndex(s=>s[0]>x+W);if(si<0)si=L.spawns.length;while(arenaI<L.arenas.length&&L.arenas[arenaI].x<x)arenaI++;if(raft){plats=plats.filter(p=>p!==raft);raft=null}},kb:()=>{if(boss)boss.parts.forEach(p=>{p.armor=0;p.hp=1})},god:()=>{if(P){P.inv=Math.max(P.inv,5);if(P.veh)P.veh.hp=P.veh.max}}};setInterval(()=>{if(window.GOD)window.__g.god()},16);\n/* ---------------- loop ---------------- */")
out=head+'\n<script>\n(()=>{\n'+js+'\n})();\n</script>\n'
open('test.html' if test else 'civil-slug.html','w').write(out)
open('g.js','w').write('(()=>{\n'+js+'\n})();')
print(len(out))
