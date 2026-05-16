# JOHAR GANDHI – Master Implementation Plan
## Part 1: Site Architecture, User Flow & Technical Stack

---

# Section 1: Site Architecture

## 1.1 Folder Structure (GitHub Pages)

```
johar-gandhi/
├── index.html
├── manifest.json
├── favicon.ico
├── css/
│   ├── global.css
│   ├── landing.css
│   ├── player.css
│   ├── brand.css
│   └── animations.css
├── js/
│   ├── app.js
│   ├── scroll-engine.js
│   ├── speech.js
│   ├── slide-renderer.js
│   ├── ken-burns.js
│   ├── brand-engine.js
│   └── download.js
├── data/
│   ├── series1/
│   │   ├── episode01.json … episode10.json
│   └── series2/
│       ├── episode01.json … episode10.json
├── images/
│   ├── brand/
│   │   ├── johar-gandhi-logo.png
│   │   ├── johar-gandhi-logo-light.png
│   │   ├── meer-foundation-logo.png
│   │   ├── meer-foundation-horiz.png
│   │   ├── meer-leaf.png
│   │   └── watermark.png
│   ├── series1/ep01/ … ep10/
│   │   └── slide-001.webp … slide-100.webp
│   └── series2/ep01/ … ep10/
├── pages/
│   ├── series.html
│   └── player.html
└── og/
    ├── og-default.png
    ├── og-series1.png
    └── og-series2.png
```

## 1.2 File Naming

| Asset | Pattern | Example |
|---|---|---|
| Episode data | `episode{NN}.json` | `episode01.json` |
| Slide images | `slide-{NNN}.webp` | `slide-042.webp` |
| Brand logos | descriptive kebab-case | `johar-gandhi-logo.png` |

## 1.3 Two-Mode Toggle (No Duplication)

Single JSON per episode. Each slide object holds both `image` and `text`. CSS class on `<body>` toggles visibility:

- `.mode-visual` → hides text overlay, full-bleed image
- `.mode-read` → shows text panel over image (bottom 30%, dark semi-transparent)

---

# Section 2: User Flow

## 2.1 Navigation

```
Landing → Series Selection → Episode Selection → Episode Player
```

- **Landing**: Cinematic hero, JG logo center, MF logo bottom-right, two series entry cards
- **Series Page**: Two panels (MOHANDAS 1920 / THE MAHATMA 1933), each listing 10 episodes
- **Player**: `player.html?s=1&e=1` — full 100vh slide viewer, minimal HUD

## 2.2 Mode Toggle

- Fixed pill button, top-right: 🎬 Visual Story | 📖 Read Along
- Default: Visual Story (silent film)
- 0.4s crossfade transition
- Preference persists in localStorage

## 2.3 Auto-Scroll + Override

- **Auto-scroll ON** by default: 12 seconds per slide
- Progress bar (thin gold line, bottom)
- Play/Pause button bottom-left
- Speed: 0.5x / 1x / 1.5x / 2x
- **Mouse wheel immediately pauses** auto-scroll, user scrolls freely
- CSS `scroll-snap-type: y mandatory` for slide snapping
- After 5s inactivity, auto-scroll resumes
- Keyboard: Space=play/pause, Arrows=prev/next

## 2.4 Read Aloud Button

- Visible only in Read Along mode
- Position: inside text panel, top-right
- Click → `SpeechSynthesis.speak(currentSlideText)`
- Stop icon while speaking
- Scroll to next slide stops current speech
- Hindi voice preferred, fallback English, rate 0.9
- Never auto-plays

---

# Section 3: Technical Stack

## 3.1 Core (All GitHub Pages Compatible)

| Tool | Purpose |
|---|---|
| HTML5 | Structure |
| Vanilla CSS3 | Styling, Ken Burns animations |
| Vanilla JS (ES6+) | Logic, scroll engine, SpeechSynthesis |
| JSON files | Episode/slide data |

## 3.2 Image Generation

| Tool | Purpose |
|---|---|
| Gemini (image gen) | Generate ~1500-2000 illustrations |
| Whisk | Style consistency/transfer |

## 3.3 Effects (No Libraries)

| API | Purpose |
|---|---|
| CSS `transform` + `transition` | Ken Burns zoom/pan |
| CSS `scroll-snap` | Slide snapping |
| `IntersectionObserver` | Active slide detection |
| Canvas API | Branded download generation |

## 3.4 Audio

`window.speechSynthesis` API — free, unlimited, no server, works on GitHub Pages.

## 3.5 NOT Needed

Three.js, Node.js runtime, audio files, CMS, React/Vue/Vite — all unnecessary for this static slide architecture.
