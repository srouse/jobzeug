---
name: One role per project
overview: "Enforce one canonical role link per project for Contentful/resume: fix S008, S015, and S016 (the only multi-role projects), update evidence indexes, then re-compress and push."
todos:
  - id: fix-s016
    content: S016 Resume connection + indexes → R002 only
    status: completed
  - id: fix-s015
    content: S015 Resume connection + indexes → R001 only
    status: completed
  - id: fix-s008
    content: S008 → R001 only; remove from R002; prose history without R002 id
    status: completed
  - id: compress-push
    content: Re-compress, verify single-role outputs, push to Contentful
    status: completed
isProject: false
---

# One role per project (Contentful blogs + widget)

## Rule

Each project has **exactly one** role in `## Resume connection` (and thus in compress/`roles[]`). Historical context may stay as prose **without** embedding a second `R###` id in that section (compress scrapes every `\bR\d{3,}\b`).

## Targets (only multi-role projects today)

| Project | Keep | Drop |
|---|---|---|
| [S016](evidence/projects/S016%20-%20Technical%20debt%20Contentful%20blog.md) Technical debt blog | **R002** | R001 |
| [S015](evidence/projects/S015%20-%20Understanding%20AI%20building%20blocks.md) Understanding AI series | **R001** | R002 |
| [S008](evidence/projects/S008%20-%20Contentful%20for%20Figma%20widget.md) Contentful for Figma widget | **R001** | R002 |

S014 stays R003-only (already correct).

## Evidence edits

1. **S016** — Resume connection: only link R002; rewrite the byline caveat so it does not contain `R001`.
2. **S015** — Resume connection: only link R001; drop/rephrase Feb transition notes that mention `R002` in that section (history can move to Account summary / Follow-up without role ids, or plain “Solution Specialist tenure” wording).
3. **S008** — Canonical role **R001** only. Keep a short note that v1 began during Solution Specialist work **without** linking or typing `R002` in Resume connection. Remove dual “spans roles” framing as the compress source of truth.
4. **Role records + indexes**
   - [R002](evidence/roles/R002-contentful-solution-specialist.md): remove S008 from Linked projects; keep S016.
   - [R001](evidence/roles/R001-contentful-senior-product-architect.md): keep S008 + S015; ensure S016 is not listed.
   - [evidence/roles/INDEX.md](evidence/roles/INDEX.md) and [evidence/projects/INDEX.md](evidence/projects/INDEX.md): S008 under R001 only; S015 → R001; S016 → R002.

## Contentful sync

1. `npm run contentful:compress` — verify outputs: S008/S015 → `["R001"]`, S016 → `["R002"]`; no project with `roles.length > 1`.
2. `npm run contentful:push` (apply only if schema drift; otherwise push is enough).

## Out of scope

- Changing blog narrative content beyond role linkage
- Schema/policy/tag changes
- Other projects (audit already showed only these three are multi-role)
