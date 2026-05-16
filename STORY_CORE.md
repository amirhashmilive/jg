# STORY_CORE.md
# Johar Gandhi — Core Story Architecture

> **Author:** Amir Hashmi  
> **Project:** Johar Gandhi Web Series  
> **Live Site:** https://amirhashmilive.github.io/jg/

---

## The Book

*Johar Gandhi* by Amir Hashmi tells the untold story of Mahatma Gandhi's two visits to Chhattisgarh — a chapter of the Indian freedom struggle that history largely overlooked. The book weaves Gandhi's personal journey into the wider tapestry of Chhattisgarh's own fight for dignity, rights, and identity: its tribal revolts, its women heroes, its pioneer reformers, and its eventual emergence as a state.

---

## The Two-Visit Structure

The entire 20-episode web series is divided into two series, each anchored by one of Gandhi's visits.

### Series 1 — MOHANDAS (Episodes 01–10)
**The First Visit: December 20–22, 1920**

Gandhi arrives in Chhattisgarh as *Mohandas* — the lawyer-turned-activist who has just emerged from South Africa, still finding his identity as a mass leader. He comes to support the **Kandel Canal Satyagraha**, a local peasant uprising over irrigation rights. This series contextualises that moment by tracing the deep roots of resistance in the region:

| Episode | Theme |
|---------|-------|
| 01 | The Land of 36 Forts — Chhattisgarh's geography and identity |
| 02 | The 1857 Rebellion — Veer Narayan Singh and the first flame |
| 03 | Tribal Revolts — Gaind Singh, Gundadhur, and the forests that resisted |
| 04 | The Pioneers — Pt. Sundarlal Sharma and early social reform |
| 05 | The Kandel Satyagraha — The canal, the peasants, the call |
| 06 | Mohandas Arrives — December 20, 1920 |
| 07 | The Rally at Raipur — The crowd, the words, the movement |
| 08 | The Women Who Led — Dr. Radhabai, Rohini Bai, unnamed heroes |
| 09 | Departure and Echo — What his visit ignited |
| 10 | Between the Visits — The decade of quiet struggle |

---

### Series 2 — THE MAHATMA (Episodes 01–10)
**The Second Visit: November 22–28, 1933**

Gandhi returns — now as *The Mahatma*, a global icon — specifically to fight **untouchability** through his Harijan tour. This series traces both the transformation of Gandhi and the transformation of Chhattisgarh's freedom movement in the thirteen years between his visits.

| Episode | Theme |
|---------|-------|
| 01 | A Changed Land — Chhattisgarh in 1933 |
| 02 | The Harijan Mission — Gandhi's campaign against untouchability |
| 03 | Babu Chhotelal Srivastava — The organiser behind the scenes |
| 04 | The Mahatma Speaks — The rallies, the villages, the temples |
| 05 | Caste, Land, and Labour — The social conditions he encountered |
| 06 | Women of the Second Wave — New voices in the movement |
| 07 | The Press and the People — How the visit was documented |
| 08 | Dissent and Debate — Those who questioned, those who resisted |
| 09 | The Final Day — November 28, 1933, farewell |
| 10 | The Road to Statehood — From freedom struggle to Chhattisgarh state |

---

## The Fundamental Rule: Only the Book

> **Every word in every slide comes directly from the source book.**

This is not a creative retelling. This is not a paraphrase. The agent's role in this project is exclusively:

1. **Parse** — Break the book's prose into logical narrative units.
2. **Segment** — Assign each unit to the appropriate episode and slide position.
3. **Present** — Display the original text faithfully, maintaining emotional arc.

Nothing is invented. Nothing is added. Nothing is removed.  
If a passage is not in the book, it does not appear in the series.

---

## The `visualDescription` Field

Every slide in the episode JSON files contains a `visualDescription` field:

```json
{
  "id": "s1e01-001",
  "type": "content",
  "image": "images/series1/ep01/slide-001.webp",
  "text": "The actual book text goes here...",
  "visualDescription": "A description of the cinematic image to be generated here"
}
```

**Purpose:** This field is a prompt written for a future image generation pipeline. It describes — in cinematic, visual language — what historical illustration should accompany the slide's text.

**Current state:** All `visualDescription` fields contain placeholder prompts. The images in `/images/` are placeholder WebP files. When the real image generation pipeline runs, it will:

1. Read `visualDescription` from each slide's JSON
2. Generate a high-resolution historical illustration
3. Save it to the corresponding `images/seriesX/epXX/slide-YYY.webp` path
4. The player renders it automatically — no other code changes needed

The `visualDescription` field is the **contract** between the story layer and the image layer.

---

## Technical Notes

- **JSON path:** `data/series1/episodeXX.json` and `data/series2/episodeXX.json`
- **Image path:** `images/series1/epXX/slide-YYY.webp` and `images/series2/epXX/slide-YYY.webp`
- **Slides per episode:** 85 (approximate, may vary by episode)
- **Total slides:** ~1,700 across both series
- **Source text:** `book_text.txt` in project root (original book, UTF-8 encoded)

---

## Series Titles & Visual Identity

| Series | Code Name | Years Covered | Tone |
|--------|-----------|---------------|------|
| 1 | **MOHANDAS** | 1857–1920 | Emergence, uprising, arrival |
| 2 | **THE MAHATMA** | 1920–1947+ | Return, reform, reckoning |

The visual language shifts between the two series: Series 1 uses darker, rougher imagery evoking colonial-era resistance; Series 2 uses warmer, more documentary-style compositions reflecting a maturing movement.

---

*Document created: 2026-05-17*  
*Maintainer: Project build system*  
*Do not edit episode titles without updating corresponding JSON metadata.*
