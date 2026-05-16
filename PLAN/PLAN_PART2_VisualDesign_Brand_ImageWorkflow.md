# JOHAR GANDHI – Master Implementation Plan
## Part 2: Visual Design System, Brand Integration & Image Workflow

---

# Section 4: Visual Design System

## 4.1 Color Palette

**Philosophy**: Dramatic, cinematic, NOT academic. Like a prestige graphic novel.

| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#0A0A0A` | Deep black backgrounds |
| `--bg-secondary` | `#141414` | Card/panel backgrounds |
| `--text-primary` | `#F5F0E8` | Warm ivory text (not pure white) |
| `--text-secondary` | `#A09882` | Muted gold-grey for captions |
| `--accent-gold` | `#C8A85C` | Progress bars, borders, highlights |
| `--accent-saffron` | `#D4772C` | Episode markers, Indian accent |
| `--accent-green` | `#2D5A3D` | Meer Foundation leaf, subtle use |
| `--overlay-dark` | `rgba(10,10,10,0.75)` | Text panel overlay |
| `--overlay-vignette` | Radial gradient to transparent | Image edge vignette |

**Color accents**: YES — warm gold and saffron sparingly. The palette is 90% monochrome with gold/saffron punctuation.

## 4.2 Typography

| Role | Font | Weight | Size |
|---|---|---|---|
| Series titles | **Playfair Display** | 900 | 4-6rem |
| Episode titles | **Outfit** | 700 | 2.5-3rem |
| Slide body text | **Inter** | 400 | 1.2-1.4rem |
| Captions/UI | **Inter** | 300 | 0.85rem |
| Hindi text | **Tiro Devanagari Hindi** | 400 | 1.3rem |
| Dramatic quotes | **Playfair Display** italic | 600 | 2rem |

**Style**: Large, bold, generous letter-spacing for titles. Body text uses comfortable line-height (1.8). Text appears with subtle fade-in animation.

## 4.3 Ken Burns Effect Specifications

Each slide image receives one of these animations (specified in JSON):

| Animation | CSS Transform | Duration |
|---|---|---|
| `zoomIn` | `scale(1.0) → scale(1.25)` | 12-15s |
| `zoomOut` | `scale(1.25) → scale(1.0)` | 12-15s |
| `panLeft` | `translateX(0) → translateX(-8%)` | 12-15s |
| `panRight` | `translateX(-8%) → translateX(0)` | 12-15s |
| `panUp` | `translateY(0) → translateY(-6%)` | 12-15s |
| `zoomInPanLeft` | `scale(1.0) translateX(0) → scale(1.2) translateX(-5%)` | 12-15s |
| `zoomInPanRight` | `scale(1.0) translateX(-5%) → scale(1.2) translateX(0)` | 12-15s |

**Implementation**: CSS `@keyframes` per type. Image container has `overflow: hidden`. Image itself animates. `animation-play-state` paused when slide is not active.

## 4.4 Gemini Image Prompt Template

```
STYLE: Dramatic black-and-white ink illustration, high contrast,
hand-drawn feel with crosshatching and bold linework. Cinematic
composition with dramatic lighting (strong rim light, deep shadows).
Style inspired by graphic novels and Japanese manga historical
dramas. NOT a photograph. NOT cartoon. Elegant and emotional.

RESOLUTION: 2560x1440 (16:9), crop-safe with 15% bleed on all edges
for Ken Burns animation.

SCENE: [Specific scene description from the book]

MOOD: [Emotional beat: awe / tension / sorrow / triumph / reverence]

VISUAL METAPHOR (if any): [e.g., "chains dissolving into birds" or
"light rays breaking through prison bars"]

IMPORTANT: No text in the image. No logos. No modern elements.
Period-accurate clothing and architecture (1920s-1930s India).
Chhattisgarh landscape elements where appropriate (dense forests,
rivers, village huts, colonial buildings).
```

---

# Section 5: Brand Identity Integration

## 5.1 Logo Hierarchy

| Context | Primary Logo | Secondary Logo | Placement |
|---|---|---|---|
| Landing page | Johar Gandhi (center, large) | Meer Foundation (bottom-right, small) | Fixed |
| Episode player HUD | JG monogram (top-left, 40px) | MF leaf (top-right, 30px) | Fixed, fades on inactivity |
| Episode intro slide | JG full logo (center) | MF horizontal (below, 60% opacity) | Animated fade-in |
| Episode outro slide | JG + MF side by side | — | Centered |
| Downloaded share cards | JG logo (top-left) | MF logo (bottom-right) | Canvas-rendered |
| Social OG images | JG logo (prominent) | MF logo (subtle) | Pre-generated |

## 5.2 Source Asset Mapping

| Brand Asset Source | Destination in Repo | Usage |
|---|---|---|
| `LOGO Johar Gandhi.png` | `images/brand/johar-gandhi-logo.png` | Primary logo |
| `B&W 5mb.png` | `images/brand/meer-foundation-bw.png` | Monochrome contexts |
| `LOGO - MEER FOUNDATION 1x1.png` | `images/brand/meer-foundation-logo.png` | Square contexts |
| `LOGO - MEER FOUNDATION horizontal logo.png` | `images/brand/meer-foundation-horiz.png` | Wide placements |
| `Meer Foundation Leaf.png` | `images/brand/meer-leaf.png` | Decorative motif, watermarks |
| `green leaf HD.png` | `images/brand/meer-leaf-color.png` | Color accent where needed |

## 5.3 Responsive Logo Behavior

| Viewport | JG Logo | MF Logo |
|---|---|---|
| Desktop (>1200px) | Full wordmark | Horizontal logo |
| Tablet (768-1200px) | Full wordmark (smaller) | Square 1x1 logo |
| Mobile (<768px) | Monogram/icon only | Leaf icon only |

## 5.4 Cinematic Overlay System

- **Episode intro**: 3-second branded title card — dark bg, JG logo fades in with gold accent line, then episode title types in
- **Episode outro**: "Johar Gandhi" + "A Meer Foundation Initiative" with leaf motif, fade to black
- **Chapter transitions**: Subtle watermark (JG monogram, 5% opacity) in bottom-right during slides
- **Dark/Light**: Logo variants swap via CSS `prefers-color-scheme` or manual toggle

## 5.5 Downloadable Asset Branding

When user downloads a slide/quote/scene via the share feature:

1. Canvas API renders the slide image
2. Adds semi-transparent gradient overlay at bottom
3. Stamps JG logo (top-left, white, 8% of width)
4. Stamps MF logo (bottom-right, white, 6% of width)
5. Adds elegant thin gold border (2px)
6. Adds slide text (if quote card)
7. Exports as PNG (1080x1080 for social, 1920x1080 for landscape)

**Aesthetic**: Museum-quality, collectible feel. Not a social media template.

## 5.6 Brand Automation for Future AI Systems

The `brand-engine.js` module will expose:

- `applyBranding(canvas, options)` — stamps logos on any canvas
- `generateShareCard(slideData)` → PNG blob
- `generateStoryPoster(episodeData)` → PNG blob
- `getBrandColors()` → palette object
- `getLogoForContext(context, theme)` → appropriate logo path

This API enables future integration with marketing automation, AI agents, and multilingual publishing systems.

---

# Section 6: Image Generation Workflow

## 6.1 Process

1. **Extract text** from book (already done — `book_text.txt`)
2. **Break each episode** into ~75-100 slides with visual descriptions
3. **Write Gemini prompts** using the template from Section 4.4
4. **Generate images** in batches of 20-30 per session
5. **Review** for historical accuracy and emotional tone
6. **Regenerate** any that fail quality check
7. **Export** at 2560x1440 WebP, quality 85
8. **Organize** into `images/series{N}/ep{NN}/slide-{NNN}.webp`

## 6.2 Resolution Requirements

| Requirement | Value | Reason |
|---|---|---|
| Minimum resolution | 2560x1440 | Ken Burns needs headroom for zoom |
| Aspect ratio | 16:9 | Viewport fill |
| Crop-safe zone | Inner 85% | 15% bleed for pan/zoom |
| Format | WebP | Best size/quality ratio |
| Quality | 85% | Balance of clarity and file size |
| Max file size | 300KB per image | GitHub Pages / bandwidth |

## 6.3 Batch Strategy

| Phase | Episodes | Images | Est. Time |
|---|---|---|---|
| Batch 1 | S1E01-E03 | ~250 images | 3-4 days |
| Batch 2 | S1E04-E07 | ~300 images | 4-5 days |
| Batch 3 | S1E08-E10 | ~250 images | 3-4 days |
| Batch 4 | S2E01-E05 | ~400 images | 5-6 days |
| Batch 5 | S2E06-E10 | ~400 images | 5-6 days |
| **Total** | **20 episodes** | **~1600 images** | **~22 working days** |

## 6.4 Style Consistency

- Use Whisk or Gemini "style reference" to maintain consistent look across all images
- First 10 images serve as the **style anchor** — all subsequent prompts reference these
- Character consistency: Gandhi should look consistent (bald head, round glasses, dhoti, walking stick)
- Environment consistency: Chhattisgarhi architecture (mud huts, dense sal forests, colonial bungalows)
