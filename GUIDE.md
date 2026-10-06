# How to Make a Pixel Game Like These

This is the development guide for the China Civil War Games series. It covers how each game looks, sounds, jokes and plays, and how it is built, tested and shipped. It is written so you can make a new game in the same world, or use the same recipe for a pixel game of your own.

這是本系列的開發指南：怎麼畫、怎麼寫笑話、怎麼做音樂、怎麼讓它好玩，以及怎麼建置、測試、發布。

---

## 1. The recipe in one page

1. **One idea, one twist.** Take a genre people already know (Metal Slug, Street Fighter, Candy Crush, tower defense) and give it one strong twist from the setting. Example: match-3, but you are the army cook and Gold Yuan tiles lose value every move.
2. **A complete arc.** 5–6 stages, a boss or climax in each, a story page between stages, and an ending people remember.
3. **The ending is the punchline.** You win every battle; history still puts you on the boat to Taiwan. The whole game builds toward that joke.
4. **Small canvas, big pixels.** 384×216, scaled up crisp.
5. **Every sound is synthesized.** No audio files: WebAudio oscillators and noise, so the game stays one small file.
6. **One HTML file.** No install, no build step for players, works offline, works on phones.
7. **Bilingual from day one.** 繁體中文 by default, English on a button.
8. **Test with bots.** A script plays the whole game end to end in a headless browser before every release.

---

## 2. Pixel art

### Canvas and scaling
- Draw everything on a **384×216** canvas (16:9, one fifth of 1920×1080).
- Scale it up with CSS to the largest size that fits the window, and keep pixels sharp:
  ```css
  #cv { image-rendering: pixelated; image-rendering: crisp-edges; }
  ```
  ```js
  const s = Math.min(innerWidth / 384, innerHeight / 216);
  cv.style.width = Math.floor(384 * s) + 'px';
  cv.style.height = Math.floor(216 * s) + 'px';
  ```
- Draw with `fillRect` at integer coordinates only (`Math.round`). Half-pixel positions blur.
- No sprite sheets needed: characters are drawn from rectangles in code, so they can change expression, pose, uniform and weapon freely.

### Chibi characters (the series look)
- **Big head, small body.** The head is about 10×13 px; the body is about 14×9 px. The head is roughly as tall as the body and legs together.
- **Faces carry the comedy.** Eyes are 2×3 px with a 1-px white highlight. A whole set of expressions (normal, happy, scared, determined, smug, hurt, crying) is just a few pixels moved around the mouth and eyes.
- **Read the side from the hat.** KMT: blue-grey uniform, blue cap with the white sun badge. CCP: olive uniform, green cap with a red star. Civilians: straw hats, faded blue. A player should know who is who from across the screen.
- **Animate with 2–4 frames.** Legs swap, the body bobs 1 px, a muzzle flash lasts 2–3 frames. Pixel games feel alive from small, fast motion, not from many frames.
- **Reuse one drawing function** (`drawSoldier(x, y, options)`) with options for faction, pose, weapon, expression and props. Every game in the series uses the same soldiers.

### Palette
| Use | Colour |
|---|---|
| Background ink | `#0c0908` |
| Paper / text | `#e9dcc2` |
| Seal red | `#b3261e` |
| Gold / highlights | `#d9a441` |
| Ember / warnings | `#ff8a3a` |
| KMT blue | `#2f4166` / `#5a6d90` |
| CCP olive | `#5f6b3f` / `#77835a` |

Keep backgrounds darker and less saturated than characters, so the characters pop.

### Backgrounds and atmosphere
- **Parallax layers:** sky gradient, far hills, near houses, foreground. Each scrolls at a different speed.
- **Weather is cheap and does a lot:** rain is 1×4 px streaks, snow is 1×1 dots falling slowly, embers are orange dots drifting up, falling banknotes are tiny rectangles.
- **A vignette** (a radial gradient that darkens the edges) makes every scene look finished.
- **Screen shake** on explosions: shift the canvas a few random pixels for 6–10 frames.

### Text
- Game text uses the pixel font **Press Start 2P** at 8 px (16 px for headings).
- Chinese text needs a CJK font, because pixel fonts have no Chinese characters. Use **Noto Sans TC** at 11–12 px, with fallbacks `"PingFang TC", "Microsoft JhengHei", sans-serif` for offline play.
- Story titles and seal stamps use **Noto Serif TC 900**, the red stamp look: 伙夫, 紙將, 撤退.
- Always draw a 1-px dark shadow under light text so it reads on any background.

---

## 3. Dark humour that stays fun

### The rules
- **Punch up, not down.** The jokes are about armies, governments, bureaucracy and inflation, never about people's suffering. The villagers are never the joke.
- **Roast both sides.** The KMT gets payroll, corruption and Gold Yuan; the CCP gets forms, meetings and slogans. Players from either background should laugh at the same time.
- **No real individual people named.** Leaders are "Headquarters", "the government", "the General".
- **Deadpan delivery.** State absurd things as plain fact: "Your ticket costs one sack of Gold Yuan. You have one sack. By boarding time it costs two."
- **History is the setup, the game is the punchline.** Keep the real events accurate (dates, places, the retreat to Taiwan in December 1949); the comedy comes from how characters react to them.

### Running gags (use them in every game)
- **Gold Yuan (金圓券) inflation:** scores, prices and pay visibly lose value as you play.
- **"Temporary" relocation:** 暫時撤退, 非常暫時.
- **"We counterattack the mainland next year!":** 明年就反攻大陸！ Said every year, with a calendar that keeps ticking.
- **Defection over food:** "I SWITCH! SAME WAR, BETTER RICE?"
- **The neutral donkey.**
- **The Printer:** inflation as a villain.

### Where jokes go
- **Mechanics:** the funniest jokes are rules. Your Gold Yuan loses value every time you rest; soldiers with no morale switch sides; tower prices rise every wave.
- **Names:** "Commissar Wei, Self-Criticism Enforcer"; "Colonel Lu, of Flexible Loyalty".
- **Shouts and bubbles:** short, all caps, one beat: "MY OFFICER LEFT. SO DO I."
- **Death and fail screens:** "YOU RETREATED" instead of "YOU DIED".
- **Credits:** "Financial advice: a seagull."

### The ending formula
1. **You won.** Show the player's perfect record: "MISSIONS WON 5/5".
2. **Meanwhile.** Everything else was lost (a map covered in red arrows).
3. **The boat.** Pay in Gold Yuan that buys nothing; the gold reserves left first.
4. **Taiwan, "temporarily".** 反攻大陸 next year, every year.
5. **The tally.** "CIVIL WARS WON 0/1", then THE END (TEMPORARILY).

---

## 4. Music and sound (all synthesized)

### Why synthesize
- No audio files to load or license, so the game stays one small file and works offline.
- The soundtrack can react to the game: speed up in a boss fight, go quiet in a story scene, change instruments per stage.

### Sound effects
Two building blocks make almost every sound:
```js
// a pitched tone that slides from f1 to f2 Hz over d seconds
tone(f1, f2, d, type = 'square', volume = .05);
// filtered white noise for d seconds
noise(d, volume, filterFreq, filterType = 'lowpass');
```
| Sound | Recipe |
|---|---|
| Gunshot | short noise burst (0.08 s) plus a quick downward square tone |
| Explosion | long low-passed noise (0.6 s) plus a low sine thump |
| Jump | square tone sliding up (200 → 600 Hz, 0.1 s) |
| Coin / pickup | two quick high square notes, the second higher |
| Hit | very short noise plus a low triangle tone |
| UI click | 1 ms high square blip |

Keep effects short (under 0.3 s for anything that repeats) and quiet. Route effects and music to separate gain nodes so they can be balanced, and add a master gain for mute.

### Background music (BGM)
- **A step sequencer.** Each track is data: tempo, a 16-step bass line, a drum pattern, and a melody written as chord sections of `[step, MIDI note, length]`:
  ```js
  m1: { bpm: 150, drums: 'funk',
        bass: [0, null, 0, 12, null, 0, null, 10, ...],
        song: [ ['Em', [[0,76,3], [3,74,1], [4,71,2], ...]], ... ] }
  ```
- **Schedule ahead.** Every few milliseconds, schedule notes up to ~0.1 s in the future using `AudioContext.currentTime`, not `setTimeout`. That keeps the beat steady even when the game is busy.
- **Instruments:**
  - **Brass:** sawtooth through a low-pass filter whose cutoff opens at the start of each note. This is the military-band sound.
  - **Lead:** square wave with gentle vibrato (an LFO on pitch).
  - **Bass:** sawtooth plus square an octave apart, low-passed.
  - **Drums:** kick = sine dropping 150 → 40 Hz; snare = noise plus a short tone; hat = very short high-passed noise.
- **Mood per stage:** march (brass, snare rolls) for war scenes, funk or swing for towns, slow minor key for story scenes, faster and louder for bosses, a "victory" fanfare that sounds slightly hollow for the ending.
- **A limiter on the master bus** (a `DynamicsCompressor`) stops loud moments from clipping.
- **Browsers block audio until the first tap or key.** Create or resume the `AudioContext` inside the first input handler.

### No voice acting
Speech is shown as pixel speech bubbles and shouts. It keeps the file tiny and translates easily.

---

## 5. Making it playable and fun

### Feel ("juice")
- **Respond within one frame** to every input.
- **Hit pause:** freeze the game 2–4 frames when a big hit lands.
- **Flash** the hit sprite white for 2 frames.
- **Numbers pop up** and float away: damage, score, "+30 SEC".
- **Particles** on every hit, pickup and explosion.
- **Shake** the screen on explosions, but not on every shot.

### Structure
- **5–6 stages**, each with a new place, a new enemy type or rule, and a boss or climax.
- **A story page between stages** (a pixel tableau plus two lines of text and a date caption) gives the player a breather and a reason to continue.
- **Teach in play:** the first stage introduces one mechanic at a time with a one-line hint.
- **Difficulty that rises in steps**, plus checkpoints, continues or retries, so players see the ending.
- **Save progress** (stage reached, best scores) in `localStorage`, wrapped in try/catch because private browsing can block it.

### Controls
- **Keyboard:** arrows/WASD to move, J/K/L for actions, P to pause. Show the keys on the title screen.
- **Mouse** where it fits (strategy, puzzles).
- **Touch:** a virtual thumb-stick on the left and big round buttons on the right, or tap/drag for puzzle and strategy games. Buttons at least 44 px. Hide touch controls during story scenes, where a tap anywhere advances.
- **Phone layout:** landscape is the target; in portrait, show a "turn your phone sideways" hint.

### Game loop
Run game logic at a **fixed 60 updates per second**, separate from drawing:
```js
let last = performance.now(), acc = 0;
function loop(now) {
  acc += Math.min(100, now - last); last = now;
  while (acc >= 16.67) { acc -= 16.67; update(); }   // fixed-step logic
  render();                                          // draw once per frame
  requestAnimationFrame(loop);
}
```
This keeps speed identical on 60 Hz and 120 Hz screens and makes bots and tests repeatable.

---

## 6. Bilingual (繁體中文 + English)

- **Chinese is the default**; English is one button away (title screen and in-game). Save the choice in `localStorage`.
- **Keep all text in tables**, not scattered in code. Each game has an English table and a Chinese table with the same keys, and a `tr()` helper for small UI strings.
- **Switch instantly:** swapping language updates the title screen, menus, the canvas and anything already on screen.
- **Translate the joke, not the words.** Adapt each line so it lands in Taiwanese Mandarin: 金圓券, 國軍/共軍, 反攻大陸, 暫時轉進.
- **Wrap by measured width.** English wraps at spaces; Chinese can break between any characters, but never put closing punctuation (，。！) at the start of a line.
- **Check every screen in both languages.** Chinese glyphs are wider than 8 px pixel letters, so panels and buttons often need more room.
- Set `<html lang="zh-Hant">` and a Chinese page title.

---

## 7. Code structure (how this repo is built)

```
source/
  src/2-core.js    engine: canvas, input, storage, WebAudio synth, music tracks
  src/3-data.js    shared writing: shouts, slogans, scenes, endings
  src/4-gfx.js     shared drawing: soldiers, civilians, vehicles, backgrounds, weather, text
  src/5-game.js, src/6-main.js, src/7-zh.js   Civil Slug's own game, menus and Chinese text
  <game>/head.html  each game's page: CSS, title overlay, buttons
  <game>/game.js    each game's own logic
  build*.py         concatenate the shared files + one game into a single HTML file
```

- **Shared engine, separate games.** Every game reuses the same soldiers, sounds and music, which is why the series looks and sounds consistent and new games are fast to make.
- **The build is concatenation.** Python glues the files into one `<script>` inside the game's HTML. The 3D games also inline Three.js so they work offline.
- **Watch for name clashes** when concatenating: two files defining `pick` or `LEVELS` breaks the build. Each game keeps its own names (`WEEKS`, `MEALS`, `tsel`).
- **Test hook:** building with `--test` adds `window.__g = { state, ev: s => eval(s) }`, so test scripts can read and change game state.

---

## 8. Testing with bots

Every release is played through by a script in headless Chromium (Playwright):
- **Smoke test:** load the page, collect page errors, press start, play a few seconds with real key presses.
- **Bot playthrough:** a simple bot plays each stage (shoots the nearest enemy, hits the next note, picks the best swap). If the bot can't finish a stage, a human probably finds it unfair.
- **Jump ahead with test hooks** to reach bosses and the ending quickly.
- **Screenshots of every screen in both languages, on desktop (1152×648) and phone (844×390, touch).** Then actually look at them: text overflow, overlapping buttons and blurry labels only show up in pictures.
- **Offline check:** block the network and open the file from disk; fonts must fall back and the game must still run.

---

## 9. Release checklist

- [ ] Title screen explains the premise and the controls in one screen
- [ ] 5–6 stages, each with a boss or climax and a story page
- [ ] Ending sequence and credits (the punchline lands)
- [ ] 繁體中文 default + English, every screen checked in both
- [ ] Keyboard, mouse and touch all work; portrait shows a rotate hint
- [ ] Pause, mute, retry/continue and saves work
- [ ] `<!doctype html>`, charset, viewport, description, theme-color, favicon
- [ ] Works from `file://` and offline
- [ ] Bot playthrough with zero page errors
- [ ] Screenshots reviewed
- [ ] README in the game's folder: premise, stages, ending, controls, in Chinese and English

---

## 10. Start a new game in this world

1. Pick a genre and one twist from 1948–49 (inflation, conscription, defection, the retreat).
2. Write the six stage names and the ending joke first.
3. Copy a small game folder (`m3/` or `tac/`) as a template: `head.html` + `game.js`.
4. Reuse `drawSoldier`, `drawBG`, `SFX` and `music()` from the shared files.
5. Build with `python3 buildgame.py <folder> <name>.html`, test with `--test` and a Playwright bot.
6. Add the Chinese table, check every screen, write the README, ship.
