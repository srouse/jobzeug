---
name: JzText JzIcon migration
overview: Migrate app UI copy to `JzText` and replace Phosphor (and CSS) icons with `JzIcon`, stripping hand-rolled type/icon CSS so layout modules only handle spacing/structure.
todos:
  - id: icons-jzicon
    content: Replace Phosphor + CSS spinners with JzIcon; remove @phosphor-icons/react
    status: completed
  - id: text-resume-job
    content: JzText on resume-document + job-posting-panel; strip type CSS
    status: completed
  - id: text-toolbar-chat
    content: JzText on play toolbar + chat dock (incl. markdown wrappers)
    status: completed
  - id: text-pages
    content: JzText on resume/home/login/chat pages; strip leftover type CSS
    status: completed
isProject: false
---

# Migrate to JzText and JzIcon

Consume published React wrappers from `@jobzeug/design-system/react` only. Do **not** touch `packages/design-system`.

## APIs (from DS AGENTS)

- **`JzText`**: light-DOM children; props `variant` (`display-large` | `display` | `title` | `heading` | `subtitle` | `body-default` | `body-regular` | `body-strong` | `label` | `label-sm` | `caption` | `overline`), optional `weight` (`400`–`700`), `color` (`default` | `muted` | `primary` | `secondary` | `tertiary` | `inverse` | `error` | `success` | `warning`). Keep semantic tags around it (`<h1><JzText …>`).
- **`JzIcon`**: props `icon` (Phosphor name string), `size` (`small` | `medium` | `large`), `color` (`default` | `inverse` | `primary`), `weight` (`regular` | `fill` only — no `bold`).

## Icons (small, do first)

| Current | Replacement |
|---------|-------------|
| `BookmarkSimple` in [`resume-document.tsx`](src/components/resume-document.tsx) | `<JzIcon icon="BookmarkSimple" weight="fill" color="primary" size="small" aria-hidden />` |
| `CircleNotch` in [`resume-chat-dock.tsx`](src/components/resume-chat-dock.tsx) | `<JzIcon icon="CircleNotch" weight="regular" size="small" aria-hidden className={styles.spin} />` |
| CSS border spinners in job panel + play toolbar | Same `JzIcon` + spin class for one spinner pattern |

Then remove `@phosphor-icons/react` from root [`package.json`](package.json) and drop obsolete `.citedIcon` / border-spinner rules.

## Text (full `src/` UI)

Wrap visible copy in `JzText` and delete font-size/weight/line-height/color/uppercase/letter-spacing from the matching CSS modules (keep flex/gap/padding/borders).

**Variant map (resume / job first, then rest):**

| UI | variant | color |
|----|---------|-------|
| Resume name, job title | `heading` | `default` |
| Employer name, processing title | `title` | `default` |
| Role title, dock title, company | `label` | `default` / company `secondary` |
| Body / summary / lede | `body-default` or `body-regular` | `default` / `muted` |
| Dates, project names, meta, bubbles, hints | `caption` | `muted` or `default` |
| “Experience”, “Projects”, eyebrows, section/role labels | `overline` | `muted` |
| Errors | `caption` or `label` | `error` |
| Home/login brand | `display` | `inverse` |

**Files (in order):**

1. [`src/components/resume-document.tsx`](src/components/resume-document.tsx) + CSS  
2. [`src/components/job-posting/job-posting-panel.tsx`](src/components/job-posting/job-posting-panel.tsx) + CSS  
3. [`src/components/resume-play-toolbar.tsx`](src/components/resume-play-toolbar.tsx) + [`resume-play-toolbar.css.ts`](src/components/resume-play-toolbar.css.ts)  
4. [`src/components/resume-chat-dock.tsx`](src/components/resume-chat-dock.tsx) + CSS — including `markdownComponents` (`p`/`strong`/`h*`/`a` → `JzText` wrappers; keep `code`/`pre` as-is)  
5. [`src/app/resume/page.tsx`](src/app/resume/page.tsx) + CSS (loading/error)  
6. [`src/app/page.tsx`](src/app/page.tsx), login, [`src/app/chat/page.tsx`](src/app/chat/page.tsx) + their CSS  

`JzButton` labels stay on the button (already DS). Native `<input>` placeholders stay native.

## Constraints

- Client wrappers are fine imported into existing client pages; home/login can import `JzText` as a client child boundary.
- Do not reintroduce custom type scale or `text-transform` in CSS once on `JzText` (overline recipe owns that look).
- Cited titles: keep bookmark via `JzIcon`; cite color via `JzText color="primary"` when active instead of `.cited` color CSS where possible.
