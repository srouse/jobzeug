# DS2 token checklist (AI-only)

**Ops order:** `ds2 tokens validate` → exit **0** → optional **`ds2 tokens analyze --json`** (`summary`, `coverage.primitive.color.families`, paths) → run checks below. Does **not** replace **`ERR_*`**, **`WARN_*`**, **`ERR_STD_*`**.

**Where:** Same folder as `ds2.tokens.create|update|analyze` (`.cursor/commands/` or `.claude/commands/`).

**When:** Narrow task → skip full **primitive** audit. Full DS / starter / production tokens → run all relevant rows.

**Strict / `ds2`:** Engine expects color steps **50–100–…–950**; this doc’s plain pattern is **100–950** (often no **50**). With **`standardsProfile: "ds2"`** or **`validate --strict`**, **`STD_PRIMITIVE_COLOR_SCALE`** still wins—either add **50** + match engine or accept findings; checklist tone on missing rungs stays **soft** unless user wants strict compliance.

**Soft vs hard:** **Hard** = direction bugs (e.g. **primitive** color: lower step **lighter** than higher when the ladder should darken toward **low** indices—**hex intuition**: **#000000** → **#FFFFFF**). **Soft** = sparse ladders (100→300 gap), thin space/radius/type ramps—mention only; **never** block “done” or pretend **`validate`** failed. **Soft** ≠ substitute for **`ERR_*`**.

## Tiers

| Tier | Role |
|------|------|
| **Primitive** | **Wide stepped spectrums** (numeric ladders) inside the brand—room for non-obvious values; segments = measure & palette, **not** UI roles (`text`, `surface`, …). **Collection: single mode** (e.g. **`base`**) only. |
| **Semantic** | **Clamps** product UI: intents + **`ref`** → **primitive** steps you ship. Use **separate** **`collections[]` rows** for **color** vs **typography**—each with its own **`modes`** (see below). Avoid duplicate color literals unless user asked. |
| **Component** | Prefer **`semantic.*`** **`ref`**; **`primitive`** only if no good **semantic**. |

## Primitive baseline + stepping

**Spectrum rule:** **Primitive** exposes a **useful multi-step spectrum** (especially **space**, also color/radius/type-size)—on-brand runway; **semantic** **narrows** what shipping UI uses (**`ref`** / clamp), not the other way around.

| Area | Pattern | Gaps |
|------|---------|------|
| **Color** | Steps **100–950** when multi-step; **same luminance direction** across steps and hues (**typical, hex intuition: lower # = darker, higher # = lighter**—like **#000000** vs **#FFFFFF**); neutrals same. **White and black** belong on purpose: **primitive** (or clear **`ref`**s) for **near-black** at the **dark** end and **white** at the **light** end of neutrals—not only mid-grays—so **canvas**, **inverse**, borders, and **on-background** / **on-color** have explicit ink/paper (step **names** depend on your scale; **values** must match the roles). | Missing middles **OK** (soft). |
| **Space** | **Numeric steps only** on **`primitive.space.*`**. Prefer **small integers** (**`1`**, **`2`**, **`3`**, **`4`**, …) that read as **multiples** of a base grid (values carry the real **`px`**/`rem`)—**not** color-style hundreds (**`200`**, **`300`**). **Multiple steps** (spectrum), not one catch-all; **semantic** maps intents to a subset; **`md`/`lg` → semantic + `ref`**. | Missing rungs **OK** (soft); **one primitive space step** in a full DS → soft nudge toward more steps. |
| **Radius** | **Numeric** **`primitive.radius.*`**; monotonic; **multiple steps** when UI needs range; define **`0`** / max = none / full pill. | **OK** (soft). |
| **Type size** | **Numeric** **`primitive.font.size.*`**; **multi-step scale** at **primitive**; **semantic** picks roles + **`ref`**. | **OK** (soft). |
| **Motion / elevation** | Optional **primitive** if scope needs it. | — |

**Hygiene:** **`primitive.*`** = palette/scale/family vocabulary only.

## Validate (deterministic) — do not duplicate here

**`ref` → `primitive.*`** for **semantic** tier, valid targets, and tier rules are enforced by **`ds2 tokens validate`** (**`ERR_TIER`**, **`ERR_BAD_REF`**, etc.). This checklist does **not** replace those gates.

## Semantic baseline (coverage — soft for “full DS”)

Skip rows if scope is narrow. Expect **`ref`** → **`primitive.*`** where **`validate`** requires it (already covered above).

**Foreground vs background:** **Text** + **icon** = **foreground** (same contrast story). **Background** rows are **`type: color`** only—**`ref`** → **`primitive.color.{family}.{step}`** (or your neutral/brand family) chosen for the role, e.g. **text.primary** → an appropriate **primitive** brand/neutral step, not a random literal on **semantic** color rows.

### Semantic collections + **`modes`** (recommendations)

- **Color** **semantic** collection: **separate** from typography; **`modes`** should include **`light`** and **`dark`** at minimum for product UI (each mode cell **`ref`**s the right **primitive** anchor for that theme).
- **Typography** **semantic** collection: **its own** **`collections[]`** row; **`modes`** should include at least **`base`** + **`condensed`** (names may vary—keep typography **`modes`** separate from color’s **`light`**/**`dark`**). **Per-mode** cells **`ref`** **`primitive.font.*`** sizes/weights/line-height that **scale sensibly** (**condensed** = tighter steps, not copy-paste of **`base`** unless intentional).

### Contrast & numbers (AI-only, soft)

- **`light`** / **`dark`**: sanity-check **foreground** (**text** + **icon**) **`ref`** targets vs **background** **`ref`** targets—pairings should be plausible for readability (WCAG tooling is separate; **`standards`** may surface **`wcag.contrast`** as **note** only).
- **`condensed`** vs **`base`** typography: numeric **`ref`** choices should **make sense** relative to each other (smaller/tighter **primitive** steps **`ref`**d per mode).

| Area | Expect (intent + **`ref`** → **primitive**) |
|------|-----------------------------------------------|
| **Text (foreground)** | **primary**, body, muted, inverse, on-background—**`type: color`**, each **`ref`** → fitting **`primitive.color.*`** for that role + mode. |
| **Icon (foreground)** | Align with **text** foreground choices (default/muted/on-background)—**`ref`** **`primitive.color.*`** so icon + text don’t fight the same **background** picks. |
| **Background** | **Color only:** canvas/page, overlay—**`ref`** **`primitive.color.*`** appropriate per **light**/**dark**. |
| **Border** | Default, subtle, strong; focus-adjacent if needed—**`ref`** **`primitive.color.*`** (and dimension if modeled separately). |
| **Radius** | Intent path → **`primitive.radius.*`** (not numeric step names as **semantic** vocabulary). |
| **Space / inset** | Stack / gap intents → **`primitive.space.*`**. |
| **Focus** | Ring / outline → color + dimension **primitive**s as needed. |
| **State / feedback** | Error, warning, success, info (fg/bg/border)—**`ref`** matching **primitive** palette. |
| **Elevation / shadow** | If used: **semantic** slots **`ref`**ing **primitive**-backed values. |
| **Boolean / visibility** | Mode-specific layout toggles (**`type: "boolean"`**): e.g. **`isLightMode`** with **`true`**/**`false`** per **`light`**/**`dark`**. Consume in CSS per **`ds2.tokens.boolean.md`**. |
| **Typography roles** | Heading, body, caption—**separate typography collection**; **`ref`** **`primitive.font.*`** per **mode** (**`base`** + **`condensed`**). |

## Semantic robust vs **primitive** (soft)

- Large **primitive** spectrum → **enough** **semantic** intents to **clamp** real UI (**semantic** **`ref`**s a **subset** of steps—not every step needs its own **semantic** name).
- **Multi-mode:** **Color** collection: **light**/**dark** cells per row where relevant. **Typography** collection: **`base`**/**`condensed`** (etc.)—same discipline. **`validate`** checks shape—**AI** flags thin coverage (e.g. collection lists two modes but a row missing a cell).
- **Gaps (soft):** **Primitive** color families but weak **semantic** text/background/border story; **primitive** space ladder but a single **semantic** spacing token when user claimed a **full DS**.
- **Paths:** **semantic** = meaning, **primitive** = measurement, **component** = slot/part. User asked **“complete system”** → flag missing **semantic**/**component** for **primitive** you see—even if **`validate`** passes.

## Scale vs intent

**Primitive:** numeric **spectra** (many steps). **Semantic:** fewer intent tokens + **`ref`** subset = **clamp**. No **`md`/`lg`** as **primitive** segment names.

## Non-goals

**`analyze --json`** / **`coverage`** are hints only. Not a second validator; incomplete ladders ≠ checklist failure.

## Slash hooks

- **create / update:** After **`validate`**, skim **`ds2.tokens.checklist.md`** before “done.”
- **analyze:** After JSON, skim for **semantic** / naming gaps the JSON omits.
