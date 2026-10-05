# generic builder: python3 buildgame.py <dir> <outname> [--test]  (2D games: core + data + gfx + sprites? + game.js)
import sys
d,out=sys.argv[1],sys.argv[2];test='--test' in sys.argv;spr='--sprites' in sys.argv
core=open('src/2-core.js').read();core=core[:core.index('/* ---------------- input')]
parts=[core,open('src/3-data.js').read(),open('src/4-gfx.js').read()]
if spr:parts.append(open('fps/sprites.js').read())
parts.append(open(d+'/game.js').read())
js='\n'.join(parts)
if test:js+="\nwindow.__g={get state(){return state},ev:s=>eval(s)};"
html=open(d+'/head.html').read()+'\n<script>\n(()=>{\n'+js+'\n})();\n</script>\n'
open((d+'-test.html') if test else out,'w').write(html)
open('_chk.js','w').write('(()=>{\n'+js+'\n})();')
print(len(html))
