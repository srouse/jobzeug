---
name: add-project
description: Capture a new project in evidence/projects, linked to an existing employer and role record, and to customers or clients when named. Use when the user invokes add-project, or asks to add a project or record a work account in the Figma Role / evidence workspace.
disable-model-invocation: true
---

# Add project

Capture a new project (`S00x`) in the Figma Role workspace under `evidence/projects/`. Link it to an existing employer (`C00x`) and role (`R00x`). When Scott names external orgs, classify and link **customers** (`CU00x`) or **clients** (`CL00x`). Do not create employers or roles. Do not create prospects (deferred).

## Immediate context load

Before asking questions or writing files, read (paths from repo root):

1. `evidence/README.md` — evidence rules, entity types, exclusions, linking contract
2. `evidence/projects/INDEX.md` — next project ID
3. `evidence/employers/INDEX.md` — employer graph
4. `evidence/customers/INDEX.md` — customer graph
5. `evidence/clients/INDEX.md` — client graph (may be empty)
6. `evidence/roles/INDEX.md` — roles and current project links
7. `evidence/projects/S001 - Blueprints.md` — format template

Then reply with a short ready-state:

- Next project ID (highest existing `S00x` + 1)
- Employers on file (from employer index; skip retired C005)
- Customers / clients counts from their indexes
- Exclusions: Aha Notes; never reuse C005 or R008; prospects deferred
- Prompt: tell the project in your own words

Do not interview first. Capture, then organize.

## Org classification

| Kind | IDs | Use when |
|---|---|---|
| Employer | `C00x` in `employers/` | Org that employed Scott (already on file; do not invent) |
| Role | `R00x` in `roles/` | Job/title tenure (already on file; do not invent) |
| Customer | `CU00x` in `customers/` | Product/platform buyer Scott sold, demoed, or adopted with |
| Client | `CL00x` in `clients/` | Org that hired Scott’s employer for service/delivery work |
| Prospect | none yet | Not closed — note on project follow-up queue only |

Ask once if customer vs client is unclear.

## Workflow

1. **Listen** — Scott narrates freely. Preserve useful original phrasing. Label paraphrases as summaries.
2. **Resolve employer and role** — Match to an existing `C00x` and `R00x`. If several roles fit, keep the association **provisional**. If missing, ask which record to use; do not invent one.
3. **Resolve customers/clients** — If Scott names external orgs, match existing CU/CL or create the next ID. New CU/CL records require the **research pass** (below) before finishing. Default **Public disclosure: not cleared for public application copy**.
4. **Write the project file** — `evidence/projects/S00X - Short Title.md` (same spacing as S001). Follow the S001 section shape, and list linked CU/CL under resume connection when present. Prefer **role record** wording (not “experience record”).
5. **Update links in the same turn**
   - Add a row to `evidence/projects/INDEX.md`
   - Add the project under **Linked projects** on the role record
   - Add the project under **Projects** on the employer record
   - Add the project on each linked customer/client record and update those indexes / scale rollups
   - Use relative links within `evidence/`; do not duplicate the narrative into org files
6. **Ask 2–4 follow-ups** — Choose from `evidence/Question bank.md` for gaps in this account. Do not run the full questionnaire.

## Research pass (new CU or CL only)

Match employer-record discipline:

- Category + short description from primary/official sources
- Timeframe and limits (org context ≠ Scott’s contribution)
- Research date + cited URLs
- Scale/credibility markers table with dates
- Suggested descriptor; update the kind’s `Scale and credibility.md` rollup
- Prefer official/investor/SEC sources; omit unverified aggregator metrics

## Hard rules

- Stay inside `evidence/`
- Do not surface Aha Notes; never reuse C005 or R008
- Distinguish **source claims**, **Scott's accounts**, **artifact-supported details**, and **inferred relevance**
- Do not overwrite evidence with polished application copy; keep outputs separate when they exist
- Project IDs (`S001`…) are not Goal.md skill IDs (`S1`–`S6`)
- One project can span roles; mark uncertain links provisional
- Preserve uncertainty; never invent metrics, dates, or AI involvement
- Do not retrofit AI or Figma into older work
- Do not put uncleared customer/client names into polished application copy

## Out of scope

- Creating employers or roles
- Creating prospects
- Generating resume/portfolio/cover-letter copy
- Auto-invoking from ambient chat without this skill
