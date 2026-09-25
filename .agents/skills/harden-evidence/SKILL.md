---
name: harden-evidence
description: >-
  Harden evidence indexes for agent routing—add theme/capability signals,
  repair C↔R↔S links, keep INDEX rows scannable without inventing claims.
  Use when the user invokes harden-evidence, asks to harden or mature
  evidence indexes, improve index routing for chat/outline agents, or
  sync roles/employers/projects INDEX tables after evidence edits.
disable-model-invocation: true
---

# Harden evidence

Strengthen the Markdown evidence graph so outline/chat agents can **decide what to open** from indexes alone. Prefer routing signal over narrative. Evidence files remain the source of truth; indexes stay scannable hubs.

This is **not** compress-to-contentful (no Contentful). This is **not** add-project (no new S/C/R records unless fixing an obvious broken link that already exists on disk).

## Immediate context load

Before editing, read (paths from repo root):

1. `evidence/README.md` — entity types, linking contract, disclosure rules
2. `evidence/roles/INDEX.md`
3. `evidence/employers/INDEX.md`
4. `evidence/projects/INDEX.md`
5. Skim 1–2 role files and 1–2 project files if themes are unclear

Then reply with a short ready-state:

- Counts: employers / roles / projects on index
- Gaps: missing theme columns, thin employer rows, link drift
- Scope prompt: full harden vs one folder (roles | employers | projects)

## Goal

Make indexes enough for an agent to:

1. Skip irrelevant tenures/orgs from the index row alone
2. Open the right C/R/S files when themes match the question
3. Trust linked IDs (no dangling or one-way links)

## What “routing signal” means

| Index | Add / keep |
|---|---|
| **Roles** | Short **Themes** cell (3–8 comma-separated capabilities) drawn only from that role file + its linked projects’ index themes. Keep title, dates, linked projects. |
| **Employers** | Short **Themes** (or reuse role/project rollup) + role IDs; optional one-line org descriptor **only if already on the employer file**. |
| **Projects** | Already has **Relevant themes** — do not dilute; fix stale role links, evidence status, or theme wording only when the project file supports it. |

Themes are **labels for retrieval**, not new claims. Prefer nouns/phrases already present in the record (e.g. `design systems`, `Figma`, `Lit`, `customer SE`, `tokens`). Do not invent metrics, AI involvement, or employers.

## Workflow

1. **Scope** — Default: roles + employers. Touch projects INDEX only for link/status/theme drift. Ask if Scott wants customers/clients/perspectives too (usually skip).
2. **Audit links** — For each role: linked projects exist and list the role (or are marked provisional). For each project: role/employer IDs resolve. For each employer: role list matches role files. Fix INDEX + hub sections in the same turn when drift is clear.
3. **Add themes** — Roles first (biggest routing gap). Derive from role body + linked project INDEX themes. Employers: union of their roles’ themes, capped and de-duplicated.
4. **Keep tables tight** — One themes cell; no pasted summaries. No duplicate project narratives in employer/role files.
5. **Report** — What changed (files + counts), any provisional/uncertain links left alone, IDs skipped (retired C005 / R008, Aha Notes).

### Example role INDEX theme cell

Before: only title / dates / linked projects.  
After: `design systems, Figma, tokens, Lit, design↔eng bridge` for R004 — only if those appear in R004 / S004–S007 material.

## Hard rules

- Stay inside `evidence/`
- Never invent metrics, dates, titles, AI/Figma retrofit, or uncleared customer names for public copy
- Distinguish source claims vs Scott’s account; themes must be grounded in existing text
- Do not reuse C005 or R008; do not surface Aha Notes
- Do not polish application copy; do not run Contentful compress/push
- Do not create employers, roles, or projects (use add-project for new S00x)
- Prefer relative links; preserve stable C/R/S IDs

## Out of scope

- Contentful schema, compress, or push
- Capturing new projects (add-project)
- Rewriting project narratives or Goal.md skill framework
- Auto-invoking from ambient chat without this skill
