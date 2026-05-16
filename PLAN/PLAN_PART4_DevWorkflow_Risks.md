# JOHAR GANDHI – Master Implementation Plan
## Part 4: Development Workflow, Timeline & Critical Risks

---

# Section 7: Development Workflow

## Phase 0 — Foundation Setup (Day 1-2)

| Step | Action | Output |
|---|---|---|
| 0.1 | Create GitHub repository `johar-gandhi` | Empty repo with README |
| 0.2 | Set up folder structure per Section 1.1 | All directories created |
| 0.3 | Copy and optimize brand assets from source paths | `images/brand/` populated |
| 0.4 | Create `global.css` with design tokens (Section 4.1-4.2) | Design system ready |
| 0.5 | Create `brand.css` with logo hierarchy rules (Section 5.1) | Brand system ready |
| 0.6 | Build `index.html` landing page (static, no episode data yet) | Landing page live |
| 0.7 | Enable GitHub Pages on `main` branch | Site accessible at URL |

**Estimated time: 2 days**

## Phase 1 — Book-to-Slide Breakdown (Day 3-12)

| Step | Action | Output |
|---|---|---|
| 1.1 | Read full book text file (already extracted to `book_text.txt`) | Complete understanding |
| 1.2 | Divide content into 20 episodes per the map in Section 5A | Episode outlines |
| 1.3 | For each episode, write slide-by-slide breakdown (like Section 5B) | 20 breakdown documents |
| 1.4 | For each slide, write: exact book text, visual description, animation, emotion | ~1600 slide specs |
| 1.5 | Convert each episode breakdown into JSON format (`episode{NN}.json`) | 20 JSON files |
| 1.6 | Review all text for accuracy against original book | Verified JSON data |

**Estimated time: 10 days** (most labor-intensive intellectual phase)

### JSON Schema per Episode

```json
{
  "series": 1,
  "episode": 1,
  "title": "The Land of 36 Forts",
  "duration": "~40 min",
  "slideCount": 75,
  "slides": [
    {
      "id": "s1e01-001",
      "type": "title|content|visual|quote|brand",
      "image": "images/series1/ep01/slide-001.webp",
      "text": "Exact text from book or empty for visual-only slides",
      "textHindi": "Hindi text if applicable",
      "animation": {
        "type": "zoomIn",
        "duration": 12,
        "scaleFrom": 1.0,
        "scaleTo": 1.25,
        "translateFrom": "0% 0%",
        "translateTo": "0% 0%"
      },
      "emotion": "awe",
      "visualDescription": "Description for image generation prompt",
      "visualMetaphor": "optional metaphor description"
    }
  ]
}
```

## Phase 2 — Image Generation (Day 8-30, overlaps with Phase 1)

| Step | Action | Output |
|---|---|---|
| 2.1 | Generate 10 "style anchor" images for Series 1 | Style reference set |
| 2.2 | Test Ken Burns animation on anchor images | Validate resolution/crop |
| 2.3 | Batch generate S1 images (~800) using Gemini with prompt template | S1 images complete |
| 2.4 | Generate 10 "style anchor" images for Series 2 | S2 style reference |
| 2.5 | Batch generate S2 images (~800) using Gemini | S2 images complete |
| 2.6 | Quality review: reject/regenerate low-quality images | Final image set |
| 2.7 | Optimize all images: resize to 2560x1440, convert to WebP 85% | Optimized files |
| 2.8 | Organize into `images/series{N}/ep{NN}/slide-{NNN}.webp` | Files in place |

**Estimated time: 22 days** (can overlap with Phase 1 from Day 8)

### Image Optimization Pipeline

```
Source (Gemini PNG) → Resize to 2560x1440 → Convert to WebP (quality 85)
→ Verify < 300KB → Place in correct folder → Update JSON path
```

Tool: Use browser-based canvas resize or `sharp` CLI if Node available locally.

## Phase 3 — Core Engine Development (Day 13-20)

| Step | Action | Output |
|---|---|---|
| 3.1 | Build `slide-renderer.js`: loads JSON, creates DOM slides | Slides render from data |
| 3.2 | Build `scroll-engine.js`: auto-scroll + manual override + snap | Scroll behavior working |
| 3.3 | Build `ken-burns.js`: applies CSS animations per slide data | Images animate |
| 3.4 | Build `speech.js`: SpeechSynthesis wrapper with Read Aloud button | TTS working |
| 3.5 | Build `app.js`: mode toggle, URL routing, state management | Modes toggle correctly |
| 3.6 | Build `player.html`: the universal episode viewer page | Player page complete |
| 3.7 | Build `series.html`: series/episode selection page | Navigation complete |
| 3.8 | Integrate all modules, test with S1E01 data + placeholder images | Full prototype working |

**Estimated time: 8 days**

## Phase 4 — Brand Integration & Polish (Day 21-25)

| Step | Action | Output |
|---|---|---|
| 4.1 | Build `brand-engine.js`: logo placement, watermarks | Brand system active |
| 4.2 | Build `download.js`: Canvas-based share card generation | Downloads work |
| 4.3 | Create episode intro/outro branded animations (CSS) | Cinematic transitions |
| 4.4 | Build responsive logo system (desktop/tablet/mobile) | Logos adapt |
| 4.5 | Create OG share images for each series | `og/` folder populated |
| 4.6 | Add SEO meta tags, structured data, accessibility labels | SEO complete |
| 4.7 | Performance optimization: lazy loading, image preloading strategy | Fast load times |

**Estimated time: 5 days**

## Phase 5 — Assembly & Testing (Day 26-32)

| Step | Action | Output |
|---|---|---|
| 5.1 | Load all 20 episode JSONs with real image paths | Full data connected |
| 5.2 | Test each episode end-to-end in both modes | All episodes verified |
| 5.3 | Test on Chrome, Firefox, Safari, Edge | Cross-browser verified |
| 5.4 | Test on mobile (iOS Safari, Android Chrome) | Mobile verified |
| 5.5 | Test SpeechSynthesis across browsers | TTS quality documented |
| 5.6 | Performance test: measure scroll FPS with all slides loaded | Performance baseline |
| 5.7 | Fix any issues found during testing | Bugs resolved |

**Estimated time: 7 days**

## Phase 6 — Deployment (Day 33-35)

| Step | Action | Output |
|---|---|---|
| 6.1 | Final commit to `main` branch | Code deployed |
| 6.2 | Verify GitHub Pages deployment | Site live |
| 6.3 | Test live URL on multiple devices | Live verification |
| 6.4 | Submit to Google Search Console | Indexing requested |
| 6.5 | Share preview links with author for review | Author approval |
| 6.6 | Create project documentation in README | Docs complete |

**Estimated time: 3 days**

---

## Total Timeline Summary

| Phase | Duration | Overlap | Calendar Days |
|---|---|---|---|
| Phase 0: Foundation | 2 days | — | Day 1-2 |
| Phase 1: Slide Breakdown | 10 days | — | Day 3-12 |
| Phase 2: Image Generation | 22 days | Starts Day 8 | Day 8-30 |
| Phase 3: Core Engine | 8 days | Starts Day 13 | Day 13-20 |
| Phase 4: Brand & Polish | 5 days | After Phase 3 | Day 21-25 |
| Phase 5: Assembly & Test | 7 days | After Phase 2+4 | Day 26-32 |
| Phase 6: Deployment | 3 days | After Phase 5 | Day 33-35 |
| **Total** | | | **~35 working days (7 weeks)** |

> **Critical path**: Image generation (22 days) is the longest phase and determines the minimum timeline.

---

# Section 8: Critical Risks and Mitigations

## Risk 1: SpeechSynthesis Voice Quality

| Aspect | Detail |
|---|---|
| **Risk** | Browser TTS voices sound robotic, especially for Hindi text. Quality varies wildly across OS/browser combinations. |
| **Impact** | Read Along mode feels cheap, undermining the premium experience. |
| **Probability** | HIGH — Chrome has decent Hindi voices, but Safari/Firefox are poor. |
| **Mitigation 1** | Design Read Along mode to work WITHOUT audio as the primary experience. Text is always readable. Audio is a bonus. |
| **Mitigation 2** | Detect available voices on page load. If no Hindi voice, offer English with a note. Show voice quality indicator. |
| **Mitigation 3** | Add a voice selection dropdown so users can pick their preferred installed voice. |
| **Mitigation 4** | Future upgrade path: replace SpeechSynthesis with pre-recorded audio files for key episodes (Phase 2 enhancement). |

## Risk 2: GitHub Pages File Size Limits

| Aspect | Detail |
|---|---|
| **Risk** | GitHub Pages repos have a soft limit of 1GB. With ~1600 images at 300KB each = ~480MB. Manageable but tight. |
| **Impact** | Repo becomes slow to clone; Pages may throttle bandwidth. |
| **Probability** | MEDIUM — we're under 1GB but pushing it. |
| **Mitigation 1** | Aggressive WebP compression. Target 150-200KB per image instead of 300KB. |
| **Mitigation 2** | Use Git LFS for images if repo size exceeds 500MB. |
| **Mitigation 3** | Lazy-load episodes: only fetch JSON + images for the episode being viewed. Never preload all 20 episodes. |
| **Mitigation 4** | If limits are hit, move images to a CDN (Cloudflare R2 free tier, or Imgur) and reference by URL. |
| **Mitigation 5** | Alternative: Split into multiple repos (one per series) with a shared landing page. |

## Risk 3: Scroll Performance with 1500+ Slides

| Aspect | Detail |
|---|---|
| **Risk** | Loading 75-100 slide DOM elements per episode may cause scroll jank, especially on mobile. |
| **Impact** | Stuttery animations, poor user experience, battery drain on mobile. |
| **Probability** | LOW-MEDIUM — each episode is loaded separately (75-100 slides, not 1500 at once). |
| **Mitigation 1** | Each episode is a separate page load. Maximum ~100 slides in DOM at once. |
| **Mitigation 2** | Virtual scrolling: only render 5 slides in DOM (current ± 2). Recycle DOM elements as user scrolls. |
| **Mitigation 3** | Use `will-change: transform` and `contain: layout` CSS hints for GPU acceleration. |
| **Mitigation 4** | Lazy-load images: only load current slide + next 2. Use placeholder color until image loads. |
| **Mitigation 5** | Pause Ken Burns animation on non-visible slides using IntersectionObserver. |

## Risk 4: Image Generation Consistency

| Aspect | Detail |
|---|---|
| **Risk** | Gemini generates inconsistent styles across 1600 images. Gandhi may look different in each image. Architectural styles may vary. |
| **Impact** | Visual experience feels disjointed, unprofessional. |
| **Probability** | HIGH — AI image generation has inherent variability. |
| **Mitigation 1** | Establish 10 "style anchor" images first. Use these as style references in every subsequent prompt. |
| **Mitigation 2** | Use Whisk for style transfer to enforce consistency on outlier images. |
| **Mitigation 3** | Apply a consistent CSS filter to all images: `filter: contrast(1.1) saturate(0) sepia(0.1)` — unifies the look. |
| **Mitigation 4** | Budget 30% regeneration rate. If generating 1600 images, prepare prompts for 2100. |
| **Mitigation 5** | Batch by episode, not randomly. Each episode's images are generated in one session for internal consistency. |

## Risk 5: Browser Compatibility

| Aspect | Detail |
|---|---|
| **Risk** | `scroll-snap`, `IntersectionObserver`, and `SpeechSynthesis` have varying support, especially on older mobile browsers. |
| **Impact** | Broken experience on some devices. |
| **Probability** | LOW — all three APIs have 95%+ global support (caniuse.com). |
| **Mitigation 1** | Feature detection with graceful fallback. No scroll-snap → simple scroll. No SpeechSynthesis → hide Read Aloud button. |
| **Mitigation 2** | Test on: Chrome 90+, Firefox 90+, Safari 15+, Edge 90+, iOS Safari 15+, Samsung Internet. |
| **Mitigation 3** | CSS scroll-snap has excellent support. IntersectionObserver has a tiny polyfill if needed. |

## Risk 6: Content Accuracy

| Aspect | Detail |
|---|---|
| **Risk** | Text extracted from DOCX may have encoding artifacts, missing characters, or formatting errors. |
| **Impact** | Incorrect text displayed on slides — violates the "nothing is fictional" constraint. |
| **Probability** | MEDIUM — we already see some encoding issues (â€™ instead of apostrophes). |
| **Mitigation 1** | Manual review of every slide's text against the original DOCX in Word. |
| **Mitigation 2** | Fix encoding: replace `â€™` → `'`, `â€œ` → `"`, `â€` → `"`, `Â` → `` in bulk. |
| **Mitigation 3** | Author (Amir Hashmi) reviews all 20 episode JSONs before images are generated. |

## Risk 7: Emotional Engagement for Young Audiences

| Aspect | Detail |
|---|---|
| **Risk** | Despite dramatic styling, the content is dense historical text. Young audiences may disengage. |
| **Impact** | Fails the "Entertained" emotion target. |
| **Probability** | MEDIUM — depends on image quality and pacing. |
| **Mitigation 1** | Visual-only slides (no text) at emotional peaks create breathing room. |
| **Mitigation 2** | Visual metaphors (chains breaking, birds flying, trees growing) add symbolic drama. |
| **Mitigation 3** | Keep text per slide SHORT — max 2-3 sentences. Split long passages across multiple slides. |
| **Mitigation 4** | Vary animation patterns — don't repeat the same zoom 10 times in a row. |
| **Mitigation 5** | Episode structure follows dramatic arcs: setup → tension → climax → resolution. |

---

# Section 9: Quick Reference — Key Decisions Summary

| Decision | Choice | Rationale |
|---|---|---|
| Image source | Gemini 2D + CSS animation | No 3D needed; Ken Burns achievable with CSS |
| Scroll | Hybrid auto+manual | Best of both worlds; comfortable reading pace |
| Audio | SpeechSynthesis API | Free, unlimited, no server, GitHub Pages compatible |
| Modes | Visual Story + Read Along toggle | Single JSON, CSS class swap, no duplication |
| Visual style | Dramatic B&W ink, graphic novel feel | "Entertained" target; young audience appeal |
| Color accents | Yes — gold + saffron sparingly | 90% monochrome with warm punctuation |
| Framework | Vanilla HTML/CSS/JS | No build step; direct GitHub Pages deployment |
| Episode loading | One episode per page load | Performance: max ~100 slides in DOM |
| Brand integration | JG primary, MF secondary | Logo hierarchy, cinematic overlays, downloadable cards |
| Hindi text | Tiro Devanagari Hindi font | Native rendering, no transliteration |

---

*End of Master Implementation Plan. Awaiting author approval before any code is written.*
