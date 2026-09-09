# AGENTS.md — Solfa Scanner

You are an AI coding agent (opencode) working in this repository. This file is
your contract. Read it fully before doing anything. If any instruction here
conflicts with something the user says in chat, the user's live instruction
wins — but if you're unsure whether it conflicts, ASK, don't assume.

The human you work for reviews everything. Your job is to produce small,
predictable, correct changes — not to be clever, not to be fast, not to
"finish the feature" in one giant leap.

---

## 0. The Golden Rules (read this section twice)

1. **Never write code before presenting a plan and getting explicit approval.**
   No exceptions, even for changes that seem tiny or obvious to you.
2. **Never commit unless the human explicitly says to commit.** Not "looks
   good," not "continue," not "next step." Only an explicit commit
   instruction (see §4).
3. **One logical change per commit. One feature per branch.** Never bundle
   unrelated changes together, even if it's convenient.
4. **Never invent architecture, libraries, or file structure not described in
   this document or explicitly approved in the current plan.** If you think
   something new is needed, propose it and stop — do not add it silently.
5. **If anything is ambiguous, stop and ask a specific question.** Do not
   guess and proceed. A wrong guess costs more of the human's time than a
   question does.
6. **Never touch, delete, or refactor files outside the scope of the current
   approved plan**, even if you notice something that "looks wrong" nearby.
   Flag it in your plan output instead.
7. **Small diffs over big diffs, always.** If a plan step would touch more
   than ~5 files or ~200 lines, break it into smaller steps and propose the
   breakdown instead of doing it all at once.

If you are ever unsure whether an action is "safe," treat it as unsafe and
ask first. Being over-cautious costs a question; being under-cautious costs
trust.

---

## 1. Project Overview

Solfa Scanner is a web app: a user photographs/uploads a page of tonic
sol-fa notation (d r m f s l t), the app recognizes it, lets the user correct
any misreads, and plays it back as audio (and exports MIDI).

Pipeline: **image → OCR → rule-based grammar parser → Song Data Model (SDM,
JSON) → editable UI → Web Audio/Tone.js playback → MIDI export.**

No ML in the MVP. The parser is rule-based, and it is the project's core IP —
treat changes to it with extra care and extra test coverage.

---

## 2. Repository Structure (do not deviate from this without approval)

```
solfa-scanner/
  apps/
    web/          # React + Vite frontend
    api/          # Node backend (Express/Fastify)
  packages/
    sdm/          # Shared Song Data Model types + zod validation. ZERO framework deps.
    parser/       # Rule-based sol-fa grammar parser. Imported only by apps/api.
```

### Backend (`apps/api`) — ports & adapters

```
apps/api/src/
  core/
    pipeline/      # recognizePipeline.ts — pure orchestration, depends only on ports/
    ports/         # interfaces: OcrProvider, ConfidenceScorer, etc.
  adapters/
    ocr/           # googleVisionProvider.ts implements OcrProvider — concrete only, no logic leaks upward
    grammar/       # wraps packages/parser behind a port
  routes/          # HTTP only — parses requests, calls core/pipeline, formats responses
```

**Hard rule:** `core/` must never import from `adapters/` or any vendor SDK
(Google Vision, Express, etc.) directly. `core/` only depends on `ports/`
(interfaces). `adapters/` implement those interfaces. `routes/` wires a
concrete adapter into the pipeline — that wiring is the ONLY place adapter
and core logic ever meet.

If you're adding a new external service (OCR provider, storage, anything),
it becomes a new file in `adapters/`, implementing an existing or new port —
never a new import inside `core/`.

### Frontend (`apps/web`) — three-layer features

```
apps/web/src/features/<feature-name>/
  api/           # plain functions calling the backend. NO React in this folder.
  state/         # hooks/reducers. Can use React state, but no JSX.
  components/    # pure presentational components: props in, JSX out.
                 # NEVER call fetch/useRecognize/etc. inside a component file.
  <Feature>Screen.tsx   # the ONLY file allowed to wire api + state + components together
```

**Hard rule:** a file in `components/` must be understandable and testable
with props alone — no hidden data fetching, no hidden global state access.
If you find yourself wanting to fetch data inside a component, that logic
belongs in `state/` or `api/`, and the component receives it as a prop
instead.

### `packages/sdm` — hard constraint

Zero runtime dependencies on React, Express, Tone.js, or any vendor SDK.
Types + `zod` validation only. If a change to this package would require
importing anything framework-specific, stop and flag it — that's a sign the
change belongs elsewhere.

### The one-sentence rule to apply everywhere

**Inner/pure code (core pipeline, SDM types, presentational components) never
imports outer/volatile code (HTTP clients, vendor SDKs, Tone.js). Volatile
code depends inward, never the reverse.** Before adding any import, check
which direction it points. If you're not sure which side of this line a file
is on, ask.

---

## 3. Planning Protocol — REQUIRED before any code change

For every task, before writing or editing a single line of code, output a
plan in this exact shape:

```
## Plan: <short task name>


**Scope:** <one sentence — what this change does and does not do>


**Files to touch:**
- path/to/file.ts (new | edit | delete) — <why>
- ...


**Approach:**
<2-6 bullet points, plain language, describing the implementation approach>


**Out of scope / not touching:**
- <anything adjacent you noticed but are deliberately NOT changing>


**Open questions (if any):**
- <anything ambiguous that blocks starting>


**Estimated size:** <small (~1-2 files) | medium (~3-5 files) | large (flag: should this be split?)>
```

Then **stop and wait for approval.** Do not start implementing in the same
turn you present the plan. If the human says "go" or "yes" or similar, only
then proceed to implementation.

If a task is genuinely trivial (typo fix, one-line config change), you may
say so explicitly and ask "this is trivial, want me to just do it, or should
I still write a plan?" — but default to planning even for small things until
the human tells you otherwise.

---

## 4. Git Workflow

### Branches

- One feature/fix = one branch. Never work directly on `main`.
- Branch naming: `feat/<short-kebab-name>`, `fix/<short-kebab-name>`,
  `refactor/<short-kebab-name>`, `chore/<short-kebab-name>`.
  Examples: `feat/recognize-endpoint`, `fix/octave-mark-parsing`,
  `chore/setup-workspaces`.
- Create the branch as the first step after a plan is approved, before
  writing any code.

### Commits — only when explicitly told

- **Never commit on your own initiative.** Implementing a plan does not mean
  committing it. Wait for an explicit instruction such as "commit this,"
  "commit," or "that's good, commit it."
- When told to commit, commit **only the files relevant to the current
  approved plan.** If your working tree has unrelated changes (it shouldn't,
  if you've been scoping correctly), stop and ask before committing.
- Each commit should represent **one atomic, logical change** — something
  that could be reverted on its own without breaking the build. If the
  approved plan naturally has multiple logical steps, propose splitting it
  into multiple commits rather than one big one, and ask before commit #2
  onward if it wasn't already agreed in the plan.

### Commit message format — Conventional Commits, strictly

```
<type>(<scope>): <short imperative summary, lowercase, no trailing period>


<optional body — why, not what, if it's not obvious from the diff>
```

**Types:** `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `perf`

**Scope:** the package/app/feature touched — e.g. `parser`, `api`, `editor`,
`sdm`, `playback`, `web`.

Examples:

```
feat(api): add /recognize endpoint with OcrProvider port
feat(parser): add octave mark resolution for stacked apostrophes
fix(editor): correct note duration not updating on inline edit
refactor(playback): extract Tone.Transport sync into usePlaybackEngine
test(parser): add fixtures for 4/4 beat-count mismatch detection
chore(repo): set up pnpm workspaces
docs(agents): clarify commit protocol
```

Never write vague messages like `update stuff`, `fix bug`, `wip`, or
`changes`. If you can't summarize the change in one imperative line, the
change is probably not atomic enough — say so instead of forcing a vague
message.

---

## 5. Definition of Done (check before saying a task is finished)

Before telling the human a plan step is complete, confirm:

- [ ] Code matches the approved plan — no unapproved extra changes
- [ ] No new dependency was added without it being called out in the plan
- [ ] Lint/typecheck passes (`pnpm lint`, `pnpm typecheck` or equivalent —
      ask if these scripts don't exist yet rather than skipping silently)
- [ ] Relevant tests pass; new logic (especially in `packages/parser`) has a
      test with a fixture, not just a manual "it seems to work"
- [ ] No file outside the plan's declared scope was modified
- [ ] You have NOT committed unless explicitly told to

Report back concisely: what you did, which files changed, what you
deliberately did not do, and any open question — then stop and wait.

---

## 6. Things You Must Never Do

- Never commit without an explicit instruction to commit.
- Never push to a remote unless explicitly told to.
- Never install a new dependency without naming it in a plan first and
  getting approval.
- Never delete a file, directory, or piece of code without it being an
  explicit line item in the approved plan.
- Never change the architecture described in §2 (e.g. don't put fetch calls
  in a component, don't import a vendor SDK into `core/`) even if it would
  "just be easier right now." If the architecture is genuinely blocking you,
  stop and explain why, and propose a change — don't route around it
  silently.
- Never fabricate data, API responses, or test fixtures to make something
  "look like it works." If you don't have real sample data, say so and ask
  for it or use clearly-labeled placeholder fixtures.
- Never mark a task as done if tests were skipped, failing, or not run.
- Never expand scope mid-task ("while I was in there I also...") — note it
  as a suggestion for a future plan instead.
- Never make assumptions about the sol-fa notation convention (spacing
  rules, octave marks, chromatic syllables) that aren't already established
  in `packages/parser`'s existing rules or test fixtures — ask rather than
  guess at notation semantics, since a wrong assumption here silently
  corrupts musical output.

---

## 7. How to Ask Questions

When you hit ambiguity, ask directly and specifically — don't bury a
question inside a wall of implementation text. Format:

```
**Question before I continue:**
<the specific thing you're unsure about, with the 2-3 options if relevant>
```

Prefer asking one sharp question over listing five vague concerns. If you
have a reasonable default guess, state it, but still wait for confirmation
rather than proceeding on your own guess for anything touching architecture,
notation rules, or scope.
