---
tags:
  - projet
---

# brainstorming

**Version:** 0.1 (Draft) **Date:** September 7, 2026 **Author:** [Your name]

---

## 1. Overview

Solfa Scanner is a web application that lets a user photograph or upload an image of a page written in **tonic sol-fa notation** (d, r, m, f, s, l, t — doh, re, mi, fa, so, la, ti) and have the app automatically recognize the notation, reconstruct the melody (and optionally the harmony), and **play the song back as audio**.

Tonic sol-fa is widely used for hymns, choral works, and traditional songs — especially in Madagascar and other communities with strong choral traditions — but very few tools exist that can go from a _photo of the page_ to _sound_, the way apps like PhotoMath go from photo to solved equation. This project fills that gap.

### 1.1 Core value proposition

- Point a camera at a solfa sheet (printed hymn book, choir handout, etc.)
- Get an accurate digital transcription of the notation
- Hear it played back immediately — melody alone, or full 4-part harmony
- Optionally edit/correct the transcription before playback
- Optionally export (MIDI, audio file, or shareable link)

### 1.2 Why this is hard (and worth speccing carefully)

Solfa notation is **not** just text. Unlike standard OCR (reading words), a solfa page encodes:

- **Pitch** via letters (d r m f s l t) with octave marks (e.g. `d'` = doh up an octave, `d,` = doh down an octave)
- **Rhythm** via spacing, colons (`:`), and bar lines (`|`) rather than explicit note shapes
- **Key/tonic** via a header line (e.g. "Key D♭" or "Do = C") that all pitches are relative to — sol-fa is a _movable-doh_ system
- **Time signature** and **tempo**, often stated in the header
- **Lyrics**, typically aligned underneath each note or note-group
- Often **4 vocal parts stacked** on the same line or in a block (Soprano/Alto/Tenor/Bass), which is standard for hymn arrangements

This means the recognition pipeline is really: **image → specialized OCR → grammar-aware parser → structured musical data → audio synthesis.**

---

## 2. Goals & Non-Goals

### 2.1 Goals (MVP)

- Web app, camera or file-upload input
- User selects scan mode at upload time: **Single line (melody only)** or **Full arrangement (up to 4 parts)**
- Recognize solfa pitch letters, octave marks, rhythm marks, bar lines, key/time signature header, and lyrics
- Present an **editable transcription** (never trust OCR blindly — user confirms/corrects before playback)
- Convert confirmed transcription into a structured song format
- Play back with a synthesized instrument voice (and optionally separate synth voices per part in 4-part mode)
- Visual playback: highlight the current note/beat as it plays (karaoke-style)
- Basic export: download as MIDI

### 2.2 Non-goals (for MVP — future roadmap)

- Handwritten solfa recognition (start with printed/typed sheets only)
- Realistic human singing voice / lyrics-to-speech synthesis
- Real-time audio-to-solfa (singing into the mic to generate notation) — this is the _reverse_ problem, not in scope now
- Full staff-notation (5-line) OCR — out of scope; this is sol-fa specific
- Native mobile apps (web app is the MVP platform, per your choice)

---

## 3. User Stories

1. _As a choir member_, I want to scan a hymn page from our songbook so I can hear how my vocal part sounds before rehearsal.
2. _As a music teacher_, I want to scan a simple melody-only exercise and have it played back so students can check their sight-reading.
3. _As a choir director_, I want to scan a 4-part arrangement and play back all parts together, or solo just the tenor line, to teach a specific voice part.
4. _As a user_, if the app misreads a note, I want to quickly correct it in a simple editor rather than rescanning the whole page.
5. _As a user_, I want to slow down playback tempo to learn a difficult passage.
6. _As a user_, I want to download the result as a MIDI file to use elsewhere.

---

## 4. Functional Requirements

### 4.1 Input

- FR1: User can upload an image (JPG/PNG) or use device camera (via browser `getUserMedia`/file input `capture` attribute) to photograph a solfa sheet.
- FR2: User selects scan mode before/after capture: **Single melody line** or **Full arrangement (multi-part)**.
- FR3: App provides basic image pre-processing feedback (e.g., "image too dark", "please flatten the page") before committing to full recognition, to save wasted processing.

### 4.2 Recognition Pipeline

- FR4: App detects and extracts the **header metadata**: key/tonic (Do = ), time signature, tempo/title if present.
- FR5: App segments the page into lines, and within multi-part mode, into stacked voice parts per system.
- FR6: App recognizes solfa syllables (d r m f s l t and their raised/lowered/chromatic variants — e.g. `de`, `ta`, `fe`) plus octave marks (`'`, `,`) and rhythm-indicating punctuation (`:`, `|`, `.`).
- FR7: App attempts to align lyric text under each note/note-group (single-line mode primarily; 4-part mode may only show lyrics under one reference part, typically soprano).
- FR8: Recognition output is converted into an internal **Song Data Model** (see §6).

### 4.3 Review & Correction

- FR9: User is shown a side-by-side view: original scanned image (zoomable) + editable transcription in a simplified sol-fa text editor.
- FR10: User can correct individual notes, rhythm, key, or lyrics inline before confirming.
- FR11: App highlights notes it recognized with low confidence, prompting review.

### 4.4 Playback

- FR12: User can play back the confirmed song. In single-line mode: melody only. In 4-part mode: all parts together, or toggle individual parts on/off (mute/solo per voice).
- FR13: Visual playhead highlights the currently sounding note/lyric syllable in sync with audio.
- FR14: User can control playback tempo (e.g., 50%–150% of detected/default tempo) and loop a selected passage.
- FR15: User can pick a synth voice/timbre (e.g., piano, choir "ooh", organ) for playback per part.

### 4.5 Export & Sharing

- FR16: User can export confirmed song as a MIDI file.
- FR17 (stretch): User can export as an audio file (WAV/MP3) or get a shareable link to replay in-browser.

### 4.6 Account/Storage (MVP-light)

- FR18: Anonymous/local usage is supported without login (session-based).
- FR19 (stretch): Optional account to save a personal library of scanned songs.

---

## 5. Non-Functional Requirements

- **NFR1 — Accuracy expectation:** Recognition won't be perfect on day one; the correction UI (FR9-11) is a first-class feature, not an afterthought.
- **NFR2 — Performance:** Recognition of a single page should complete in under ~15 seconds on a typical mobile browser connection (assuming cloud-assisted OCR).
- **NFR3 — Device support:** Must work on mobile browsers (majority of users will scan via phone camera in browser) as well as desktop.
- **NFR4 — Offline resilience:** Core playback of an already-transcribed song should work without a network connection once loaded (client-side audio synthesis).
- **NFR5 — Privacy:** Uploaded images processed for recognition only; not retained longer than necessary unless the user opts into saving to a library.
- **NFR6 — Accessibility:** Editable transcription view should be usable with keyboard navigation, not just touch/mouse.

---

## 6. Data Model — "Song Data Model" (SDM)

A structured, JSON-like internal representation that everything (parser output, editor, playback engine, MIDI export) reads and writes.

```json
{
  "title": "Ny Fitiavan'Andriamanitra",
  "key": { "tonicSolfaLetter": "d", "concretePitch": "Bb" },
  "timeSignature": "4/4",
  "tempoBpm": 88,
  "parts": [
    {
      "voice": "soprano",
      "measures": [
        {
          "beats": [
            {
              "solfa": "d",
              "octaveShift": 0,
              "duration": "quarter",
              "lyric": "Ny"
            },
            {
              "solfa": "r",
              "octaveShift": 0,
              "duration": "quarter",
              "lyric": "fi"
            },
            {
              "solfa": "m",
              "octaveShift": 1,
              "duration": "half",
              "lyric": "tia"
            }
          ]
        }
      ]
    },
    { "voice": "alto", "measures": ["..."] },
    { "voice": "tenor", "measures": ["..."] },
    { "voice": "bass", "measures": ["..."] }
  ]
}
```

- **tonicSolfaLetter + concretePitch**: since sol-fa is movable-doh, we resolve `d` to an actual pitch (e.g. Bb) once, then every other letter in the piece is computed relative to it using the diatonic scale degree mapping (d=1, r=2, m=3, f=4, s=5, l=6, t=7) plus chromatic alterations if present (de, ma, fe, se, le, ta, etc. for raised/lowered degrees).
- **octaveShift**: integer, from octave marks (`'` = +1, `,` = -1, stacked marks = ±2, etc.)
- **duration**: derived from spacing/colon/bar rules of tonic sol-fa rhythm notation
- Single-line mode = SDM with exactly one entry in `parts`.

---

## 7. System Architecture

```
┌─────────────┐     ┌───────────────────┐     ┌────────────────────┐
│   Browser    │────▶│  Image Preprocess  │────▶│  Recognition Engine │
│ (camera/     │     │  (client or edge:  │     │  (OCR + sol-fa      │
│  upload)     │     │  deskew, contrast, │     │  grammar parser,    │
└─────────────┘     │  crop)             │     │  cloud service)     │
                     └───────────────────┘     └──────────┬──────────┘
                                                            ▼
                                                 ┌────────────────────┐
                                                 │  Song Data Model    │
                                                 │  (JSON)             │
                                                 └──────────┬──────────┘
                                                            ▼
                     ┌───────────────────┐      ┌────────────────────┐
                     │  Correction Editor │◀────▶│   App State/Store   │
                     │  (React UI)        │      └──────────┬──────────┘
                     └───────────────────┘                  ▼
                                                 ┌────────────────────┐
                                                 │  Playback Engine    │
                                                 │  (Web Audio /       │
                                                 │  Tone.js synth)     │
                                                 └────────────────────┘
```

### 7.1 Recommended tech stack (web)

| Layer                 | Recommendation                                                                                             | Notes                                                                                                                                   |
| --------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Frontend framework    | React (Vite)                                                                                               | Fast iteration, wide component ecosystem                                                                                                |
| Camera capture        | `<input capture>` + `getUserMedia` fallback                                                                | Works across mobile/desktop browsers                                                                                                    |
| Image preprocessing   | client-side (Canvas API / OpenCV.js) for crop/deskew/contrast                                              | Reduces upload size, improves OCR accuracy                                                                                              |
| OCR base layer        | Cloud OCR (e.g. Google Cloud Vision text detection) as a raw character/word detector                       | Off-the-shelf OCR won't understand sol-fa _grammar_, only raw glyphs — that's layer 2's job                                             |
| Sol-fa grammar parser | Custom-built (your core IP) — rule-based parser first, ML-assisted later                                   | Converts raw OCR tokens + their (x,y) positions into the Song Data Model, using rules for octave marks, bar lines, stacked-voice layout |
| Audio playback        | Tone.js (built on Web Audio API)                                                                           | Handles synths, scheduling, tempo, multi-track mixing in-browser                                                                        |
| MIDI export           | `midi-writer-js` or similar                                                                                | Straightforward once SDM exists                                                                                                         |
| Backend (if needed)   | Lightweight API (Node/Express or serverless functions) to proxy OCR calls, keep cloud API keys server-side | Keep client-heavy where possible for NFR4 (offline playback)                                                                            |
| Storage (stretch)     | e.g. Postgres + object storage for saved images/songs                                                      | Only needed once accounts/library (FR19) are built                                                                                      |

### 7.2 Why a two-layer recognition approach

Off-the-shelf OCR is trained on natural language, not music notation grammar — it will find "d r m f s" as isolated glyphs, but has no idea that spacing patterns encode rhythm or that a colon after a letter means something musical. So:

1. **Layer 1 (generic OCR):** Get raw glyphs + their pixel positions/bounding boxes on the page.
2. **Layer 2 (your custom parser):** Apply tonic sol-fa grammar rules to those positioned glyphs — this is where the real product value and technical differentiation lives, and where most of the engineering effort should go.

This also means Layer 2 can start as **rule-based logic** (fast to build, testable, debuggable) rather than requiring you to train a custom ML model on day one. A custom ML/vision model becomes a good v2 investment once you have real scanned samples and error data from the rule-based version.

---

## 8. MVP Scope & Roadmap

### Phase 1 — MVP (Single-line mode, core loop)

- Upload/capture image → single-melody recognition → correction editor → playback (one synth voice) → MIDI export
- Goal: prove the full pipeline works end-to-end on clean, printed single-line solfa

### Phase 2 — Multi-part mode

- Add stacked 4-part layout detection
- Per-part mute/solo playback
- Per-part synth voice selection

### Phase 3 — Quality & UX polish

- Confidence highlighting in the editor
- Tempo control, loop/practice mode
- Lyric-syllable-synced highlighting during playback

### Phase 4 — Stretch goals

- Personal library / accounts
- Shareable playback links
- Audio file export (not just MIDI)
- Handwritten solfa support
- Community-corrected samples feeding a custom-trained recognition model

---

## 9. Key Risks & Open Questions

| Risk                                                                              | Mitigation                                                                                                     |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| OCR accuracy on real-world photos (skew, shadows, curled pages, worn hymn books)  | Strong client-side image preprocessing; always show correction UI; collect failure examples early              |
| Ambiguous/inconsistent notation conventions across different songbooks or regions | Start with one well-defined notation convention (define it precisely in an internal style guide), expand later |
| Rhythm inference from spacing is inherently fuzzy                                 | Make rhythm the most editable/correctable part of the UI; consider a "tap to confirm beat" fallback            |
| 4-part layout detection complexity (parts stacked per system, not per full page)  | Treat as Phase 2, not MVP; validate approach on a handful of real sample pages first                           |
| Cost of cloud OCR calls at scale                                                  | Cache results per uploaded image; consider a self-hosted OCR (Tesseract) fallback for cost control             |
|                                                                                   |                                                                                                                |

**Open questions for you to decide before development starts:**

1. Do you have (or can you collect) a set of real sample solfa sheets to test against early? This matters a lot for tuning the parser.
2. Is there one dominant regional/publisher notation convention you want to target first (e.g., a specific Malagasy hymn book style), or should it be generic?
3. For 4-part mode, are the parts always stacked in a fixed order (Soprano/Alto/Tenor/Bass), or does that vary across the sheets you've seen?

---

## 10. Next Steps

1. Collect 10–15 real sample images (mix of single-line and 4-part) to define the exact notation conventions you're targeting.
2. Build Phase 1 MVP pipeline end-to-end with a small hardcoded rule set, tested against those samples.
3. Iterate the rule-based parser against real recognition failures before considering any ML model investment.
