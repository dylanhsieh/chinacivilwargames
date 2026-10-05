# China Civil War Games

A series of browser games set in the same world: the Chinese Civil War, 1948–49. Pixel and chibi art, synthesized chiptune music, and dark satire that roasts both sides evenly (and the Gold Yuan most of all).

Every game is a single self-contained HTML file. Open any `index.html` in a browser to play, on desktop (keyboard and mouse) or on a phone (touch controls).

## Games

| # | Game | Genre | About |
|---|------|-------|-------|
| 01 | [Civil Slug 1946](games/01-civil-slug/) | Run-and-gun | Five side-scrolling missions in the style of classic arcade run-and-guns, with vehicles to hijack and prisoners to free. |
| 02 | [Civil Slug: Village Siege](games/02-civil-slug-siege/) | First-person shooter (3D) | Defend, and then take, one village in first person. A tank with six owners, a conscript paid in Gold Yuan. |
| 03 | [Conscript's Descent](games/03-conscripts-descent/) | Action RPG / roguelike | Six floors, one life. Click-to-move looting through a burning village and the Shanghai sewers. |
| 04 | [Dark Yuan](games/04-dark-yuan/) | Souls-like (2D) | A hard 2D action game about undead conscripts. Rest, parry, roll, and watch your Gold Yuan inflate. |
| 05 | [Dark Yuan 3D](games/05-dark-yuan-3d/) | Souls-like (3D) | The 3D version of Dark Yuan, in blocky low-poly 3D: lock-on, rolls, parries and bosses on the way to the last ferry. |
| 06 | [Ming An: Expedition 48](games/06-ming-an-expedition-48/) | Turn-based RPG with real-time dodging | Explore Shanghai in 3D and fight turn-based battles with timed dodges and parries, in the spirit of Clair Obscur: Expedition 33. |
| 07 | [Civil Fighter 1949](games/07-civil-fighter-1949/) | Fighting game | Four fighters, best of three rounds, specials and supers. Arcade mode or two players on one keyboard. |
| 08 | [Battle of the Bands 1949](games/08-battle-of-the-bands-1949/) | Rhythm game | Two propaganda troupes, one village square, four lanes. Hit the notes to keep the crowd. |
| 09 | [Gold Run 1949](games/09-gold-run-1949/) | Tower defense | Guard the gold reserves on the Shanghai docks until the last boat sails. Tower prices rise every wave. |
| 10 | [Ration Crush 1949](games/10-ration-crush-1949/) | Match-3 puzzle | Ten weeks of cooking for whichever army occupies the village. Posters, grenades and Land Reform specials. |
| 11 | [Sky of Gold Yuan](games/11-sky-of-gold-yuan/) | Shoot 'em up | A vertical shooter in a borrowed biplane. Three stages, power-ups, money bombs and the Printer's airship. |
| 12 | [Last Ferry Rush](games/12-last-ferry-rush/) | Racing | A pseudo-3D arcade racer: drive a truck of passengers from the village to the docks before the last ferry leaves. |
| 13 | [Paper Generals 1949](games/13-paper-generals-1949/) | Turn-based tactics | Five grid battles for either army. Morale is a resource, and soldiers whose morale runs out switch sides. |

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
