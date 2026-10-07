# China Civil War Games

A series of browser games set in the same world: the Chinese Civil War, 1948–49. Pixel and chibi art, synthesized chiptune music, and dark satire that roasts both sides evenly (and the Gold Yuan most of all).

Every game is a single self-contained HTML file. Open any `index.html` in a browser to play, on desktop (keyboard and mouse) or on a phone (touch controls).

**Want to make your own?** Read the [development guide (GUIDE.md)](GUIDE.md): pixel art, dark humour, synthesized music and BGM, game feel, bilingual text, testing and release.

## Background story

**China, 1946–1949.** Japan has surrendered and the Second World War is over, but the truce between the Nationalist government (Kuomintang, KMT, 國民黨) and the Communist Party (CCP, 共產黨) collapses within a year. Full civil war follows.

- **1946:** American mediation fails. Each side blames the other for breaking the ceasefire.
- **1948:** the government replaces the old currency with the **Gold Yuan (金圓券)**. Within months it is nearly worthless; prices double in days. Soldiers are paid in money that buys less by the time it arrives.
- **1948–49:** the great campaigns in Manchuria, Huaihai and Pingjin go to the Communists. They cross the Yangtze in April 1949; Nanjing and Shanghai fall.
- **October 1949:** the People's Republic of China is proclaimed in Beijing.
- **December 1949:** the Republic of China government relocates to **Taiwan**. The national gold reserves had been shipped ahead. Officially the move is temporary; for decades the slogan is *"counterattack the mainland" (反攻大陸)*, always next year.

**In the games**, you play the KMT side. You will win your battles. History will still put you on the boat: every full playthrough ends with the retreat to Taiwan, played as dark comedy. The stories follow ordinary people (conscripts, cooks, truck drivers, a village band) caught between two armies, with recurring characters like the Printer (inflation in person), General Ma, Commissar Wei and a very neutral donkey.

## Style guide

**Look**
- Pixel art on a 384×216 canvas, scaled up crisp (`image-rendering: pixelated`). 3D games use blocky low-poly models with pixel textures.
- Chibi soldiers: big heads, small bodies. **KMT:** blue-grey uniform, blue cap with the white sun badge. **CCP:** olive uniform, green cap with a red star. Civilians wear straw hats and faded blue.
- Palette: candle-dark ink backgrounds (`#0c0908`), paper cream text (`#e9dcc2`), seal red (`#b3261e`), gold (`#d9a441`), ember orange (`#ff8a3a`).
- Type: *Press Start 2P* for game text, *VT323* for body copy, *Noto Serif TC* (900) for titles and red seal stamps (e.g. 伙夫, 紙將), *Noto Sans TC* for Chinese game text.
- Story scenes: a pixel tableau on top, a dated caption bar below ("1949年12月 · 台北（暫時）").

**Sound**
- No voice acting. All music and effects are synthesized live with WebAudio: military brass, march drums, chiptune leads.

**Humour**
- Dark, deadpan satire. The jokes are about the absurdity of war, bureaucracy and inflation, not about people's suffering.
- Both sides get roasted: forms, meetings and slogans on one side; payroll, corruption and Gold Yuan on the other. The villagers are never the joke.
- Running gags: Gold Yuan losing value on screen, *"temporary"* relocation, *"next year"* counterattack, defections over rice, the donkey staying neutral.
- No real individual people are named; leaders are "Headquarters" or "the government".

**Play**
- The goal for every game: a complete campaign of 5–6 stages with a boss or climax, story scenes between stages and a funny ending.
- Desktop (keyboard and mouse) and phone (touch) controls in every game; a single self-contained HTML file per game that works offline.
- Bilingual: 繁體中文 (default) and English (★ games done; the rest in progress).

## Games

★ = complete release: full story, Metal Slug-style ending, 繁體中文 (default) and English.

| # | Game | Genre | About |
|---|------|-------|-------|
| 01 | [國共大戰 Civil Slug 1946](games/01-civil-slug/) ★ | Run-and-gun | The flagship. Five Metal Slug-style missions, KMT side, Taiwan ending. 繁體中文 / English. |
| 02 | [國共大戰：圍村 Civil Slug: Village Siege](games/02-civil-slug-siege/) ★ | First-person shooter (3D) | Six stages in first person, from the village to the last pier, each with a boss (tank, armored train, bomber, gunboat, printing press, walking billboard). 繁體中文 / English. |
| 03 | [Conscript's Descent](games/03-conscripts-descent/) | Action RPG / roguelike | Six floors, one life. Click-to-move looting through a burning village and the Shanghai sewers. |
| 04 | [Dark Yuan](games/04-dark-yuan/) | Souls-like (2D) | A hard 2D action game about an undead KMT conscript. Five areas, five bosses, ending in YOU RETREATED. |
| 05 | [Dark Yuan 3D](games/05-dark-yuan-3d/) | Souls-like (3D) | The blocky low-poly 3D version of Dark Yuan: five areas, five bosses, lock-on, rolls and parries on the way to the last ferry. |
| 06 | [明暗：第四十八遠征隊 Ming An: Expedition 48](games/06-ming-an-expedition-48/) ★ | Turn-based RPG with real-time dodging | A KMT expedition across six chapters of 1948 China to stop the Printer, then the boat. 3D. 繁體中文 / English. |
| 07 | [國共快打 Civil Fighter 1949](games/07-civil-fighter-1949/) ★ | Fighting | Six-stage KMT arcade ladder, final boss the Million-Man Army, Taiwan ending. 繁體中文 / English. |
| 08 | [軍樂大對決 Battle of the Bands 1949](games/08-battle-of-the-bands-1949/) ★ | Rhythm game | The KMT brass band's six-gig tour against rival troupes, from the village square to the last ferry pier. 繁體中文 / English. |
| 09 | [黃金大轉進 Gold Run 1949](games/09-gold-run-1949/) ★ | Tower defense | Guard the KMT gold reserves across six maps, from the bank vault to the last ship; the gold leaves first. 繁體中文 / English. |
| 10 | [軍糧消消樂 Ration Crush 1949](games/10-ration-crush-1949/) ★ | Match-3 puzzle | Cook for a retreating KMT unit: 6 chapters, 18 levels, a boss general per chapter, Taiwan ending. 繁體中文 / English. |
| 11 | [金圓長空 Sky of Gold Yuan 1949](games/11-sky-of-gold-yuan/) ★ | Shoot 'em up | A contract pilot for the KMT air force: six side-scrolling stages and bosses, then one way to Taiwan on Gold Yuan fuel. 繁體中文 / English. |
| 12 | [末班渡輪 Last Ferry Rush 1949](games/12-last-ferry-rush/) ★ | Racing | Drive a KMT truck of passengers through six legs of the retreat, boss chases included, to the last ferry. 繁體中文 / English. |
| 13 | [紙上將軍 Paper Generals 1949](games/13-paper-generals-1949/) ★ | Turn-based tactics | Six KMT battles where morale is a resource and broken soldiers defect; win all six, then the last ferry. 繁體中文 / English. |

## Running locally

```
git clone <this repo>
open games/01-civil-slug/index.html
```

Or serve the folder with any static server (`python3 -m http.server`) and browse to it. The 3D games include Three.js inline, so they also work from a plain file.

## Source

`source/` holds the unbundled code the games are built from: shared engine, audio and sprite code in `source/src/`, one folder per game, and the Python build scripts that concatenate them into the single-file games. For example:

```
cd source
python3 buildgame.py tac paper-generals-1949.html
```

## A note on tone

These are satire. The war was real and the people in it suffered. Every army, government and central bank in these games gets made fun of; the villagers are the only ones who never deserve it.
