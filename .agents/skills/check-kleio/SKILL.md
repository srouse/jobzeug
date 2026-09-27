---
name: check-kleio
description: Compare evidence projects and the local KLEIO image archive against the KLEIO image index. Use when the user invokes check-kleio, or asks what is new or missing in KLEIO images.
disable-model-invocation: true
---

# Check KLEIO

Report images and projects the local index does not cover yet. Read only. Do not copy, move, rename, or delete anything under the KLEIO root. Do not edit `src/lib/kleio/catalog.ts` unless the user confirms a specific change.

The index is local only. Vercel sets `VERCEL`, and `/kleio` plus `/api/kleio` 404 when that is set. This skill runs on the machine that has the archive. If the audit says the index is off or the root is missing, stop and say that.

## Run

From the repo root:

```bash
npx tsx scripts/kleio/audit.ts
```

That script reads `evidence/projects/INDEX.md`, `src/lib/kleio/catalog.ts`, and the KLEIO folder. It writes nothing.

## Report

Show the script output as three lists:

- **New projects** — an `S00x` row in the evidence index that is not in the catalog, including empty gaps
- **New folders** — a top-level KLEIO folder that contains png/jpg/gif/webp and is neither a catalog source nor in `skippedKleioFolders`
- **Stale catalog rows** — a catalog path that is missing or matches no images

`TODO/` is one covered folder because Summit and Rates Central exports live inside it. A brand-new top-level folder is what shows up as new. Folders with zero images are ignored.

For each new folder, suggest a project id when the name is obvious (DemAI, ExO, Rates Central, Blueprints, and so on). Otherwise suggest Unassigned. Say which earlier cut it replaces when it is clearly a later version of a folder already in the catalog.

Wait for the user to say which suggestions to apply. Then edit only `src/lib/kleio/catalog.ts`.

## Name notes

Contentful View Creator is the raw early name for experiments that belong on **S025 Experience Orchestration (ExO)**. Scott does not narrate those frames as ExO. They predate the name.

- Include `2023-09-16-CTFL-WEBC-UI/_final` files whose names contain `View Creator`.
- Skip the earlier `_export` cut and the copy under `2024-09-28-visuals-examples`.
- Later folders named ExO belong on S025, not S001 Blueprints. `2026-04-14-blueprints-docs` stays on S001.
- `2025-11-17 - ExO v1 & 2` stays skipped; v3 replaced it.

`workProjects` (`/Users/scottrouse/SYNC/SynologyDrive/workProjects`) is a second archive. Do not walk code (`src`, `node_modules`, `dist`, and the rest of the skip list). Only png, jpg, gif, webp, and pdf count. Employer folders in `skippedWorkFolders` stay out. A new top-level folder there shows up as `workProjects/<name>`.
