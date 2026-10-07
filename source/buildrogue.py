import sys
core=open('src/2-core.js').read();core=core[:core.index('/* ---------------- input')]
js='\n'.join([core,open('src/3-data.js').read(),open('src/4-gfx.js').read(),open('rogue/game.js').read(),open('rogue/zh.js').read()])
test='--test' in sys.argv
if test:
    js=js.replace("/* ---------------- loop ---------------- */","window.__r={st:()=>({state,FL,lvl:PL&&PL.lvl,hp:PL&&Math.round(PL.hp),x:PL&&PL.x|0,y:PL&&PL.y|0,ents:ents.filter(e=>!e.dead).length,boss:boss&&{hp:boss.hp|0,d:boss.dead,a:boss.awake},kills:runStats.kills,bag:PL&&PL.bag.length,gold:PL&&PL.gold,perkQ,stairs:!!stairs}),start:c=>startRun(c),skip:()=>{if(scene){const d=scene.done;scene=null;d()}},god:()=>{if(PL){PL.hp=PL.st.maxHp;PL.zeal=PL.st.maxZeal}},perk:()=>{const b=document.querySelector('#perks button');if(b)b.click()},tp:(x,y)=>{PL.x=x;PL.y=y},stairs:()=>stairs&&{x:stairs.x,y:stairs.y},near:()=>{const e=ents.find(e=>!e.dead);return e&&{x:e.x,y:e.y}},bossPos:()=>boss&&{x:boss.x,y:boss.y},kb:()=>{if(boss)boss.hp=1},bd:()=>boss&&{dt:boss.dt,dead:boss.dead,st:state},camp:()=>{$('#campGo').click()},floor:f=>{FL=f;startFloor()}};setInterval(()=>{if(window.GOD)window.__r.god()},30);\n/* ---------------- loop ---------------- */")
out=open('rogue/head.html').read()+'\n<script>\n(()=>{\n'+js+'\n})();\n</script>\n'
open('rogue-test.html' if test else 'conscripts-descent.html','w').write(out)
open('r.js','w').write('(()=>{\n'+js+'\n})();')
print(len(out))
