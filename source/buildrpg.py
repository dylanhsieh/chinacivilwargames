import sys,re
src=open('souls3d/game.js').read()
def cut(a,b):i=src.index(a);j=src.index(b,i);return src[i:j]
def fn(prefix):
    lines=src.split('\n');out=[];grab=False
    for ln in lines:
        if ln.startswith(prefix):grab=True;out.append(ln);continue
        if grab:
            if re.match(r'^(function |const |let |/\*)',ln):break
            out.append(ln)
    assert out,prefix
    return '\n'.join(out)
shared='\n'.join([src[:src.index('const SPAWNS')],cut('/* ---------------- audio extras','/* ---------------- state'),
 fn('const fwd='),fn('function inputVec('),fn('function move('),fn('function blocked('),fn('function setZone('),fn('function mkMimic('),
 'let fx=[];',fn('function blood('),fn('function spark('),fn('function dust('),fn('function pop(')])
core=open('src/2-core.js').read();core=core[:core.index('/* ---------------- input')]
js='\n'.join([core,open('src/3-data.js').read(),open('src/4-gfx.js').read(),open('fps/sprites.js').read(),shared,open('rpg/game.js').read()])
test='--test' in sys.argv
if test:
    js=js.replace("/* ---------------- loop ---------------- */","""window.__d={st:()=>({state,x:PL&&+PL.x.toFixed(2),z:PL&&+PL.z.toFixed(2),lvl:G&&G.lvl,yuan:G&&G.yuan,near:near&&near.label,battle:B&&{turn:B.turn&&B.turn.name,menu:B.menu&&B.menu.lv,task:!!B.task,hs:B.hs.map(h=>h.hp+'/'+h.ap),es:B.es.map(e=>e.name+':'+e.hp),react:!!B.react,qte:!!B.qte,aim:!!B.aim}}),
new:()=>newGame(false),skip:()=>{if(scene){const d=scene.done;scene=null;d()}},tp:(x,z,a)=>{PL.x=x;PL.z=z;if(a!=null){PL.fa=a;cy=a}},fight:id=>startBattle(GROUPS.find(g=>g.id===id),'normal'),
press:k=>{pressed[k]=1},god:()=>{if(B)for(const h of B.hs){h.hp=h.max;h.ko=false}},kill:()=>{if(B)for(const e of B.es){e.hp=1}},ap:()=>{if(B)for(const h of B.hs)h.ap=9},lvl:n=>{G.lvl=n}};setInterval(()=>{if(window.GOD)window.__d.god()},200);
/* ---------------- loop ---------------- */""")
three=open('node_modules/three/build/three.min.js').read()
out=open('rpg/head.html').read()+'\n<script>'+three+'</script>\n<script>\n(()=>{\n'+js+'\n})();\n</script>\n'
open('rpg-test.html' if test else 'ming-an-expedition-48.html','w').write(out)
open('r48.js','w').write('(()=>{\n'+js+'\n})();')
print(len(out))
