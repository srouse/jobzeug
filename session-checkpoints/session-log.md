# Session log

Running log of Jobzeug session checkpoints. Entries are appended by the `session-checkpoint` skill.

### [2026-09-20T12:07:57-05:00]

#### Summary

- First Jobzeug session checkpoint: evidence model (projects/roles), add-project skill, and adapted session-checkpoint skill committed with plan cache.

#### Changes

- Evidence / records: stories→projects and experience→roles renames; employers/customers/clients/perspectives; S001–S008 projects; entity model in evidence/README.md
- Skills / tooling: add-project skill; session-checkpoint rewritten for Jobzeug (no SpecKit); session-checkpoints folder seeded
- Other: .gitignore for Next.js/env/Contentful backups

#### Decisions

- S00x kept as project IDs (historical prefix); R00x as roles; SpecKit and deck scopes dropped from checkpoint skill; plans cached by content match into session-checkpoints/plans/

#### Plans cached

- add_story_skill_2a282f5c.plan.md
- customers_evidence_log_51450833.plan.md
- session_checkpoint_skill_65575be3.plan.md
- stories_to_projects_rename_34704978.plan.md

#### Next

- Continue project capture; invoke session-checkpoint at end of sessions

### [2026-09-20T12:13:05-05:00]

#### Summary

- Redacted Greenhouse job-board ENV tokens in the saved HTML snapshot to clear the GitGuardian Rollbar false positive on HEAD.

#### Changes

- Evidence / records: Replaced Rollbar/geocode/Google/Dropbox/reCAPTCHA values with REDACTED in original.html; job posting body unchanged
- Skills / tooling:
- Other:

#### Decisions

- Keep the HTML provenance snapshot; redact only credential-shaped ENV values (Greenhouse public client keys, not Jobzeug secrets)

#### Plans cached

- none

#### Next

- Resolve GitGuardian incident as false positive / fixed on tip if desired; history still contains prior commit

### [2026-09-21T11:34:02-05:00]

#### Summary

- Moved project skills from `.cursor/skills/` to `.agents/skills/` and checkpointed the relocation.

#### Changes

- Evidence / records:
- Skills / tooling: add-project and session-checkpoint now under `.agents/skills/`; removed `.cursor/skills/` copies
- Other:

#### Decisions

- Use `.agents/skills/` as the canonical skill location for Jobzeug (session-checkpoint staging paths updated accordingly)

#### Plans cached

- none

#### Next

- Continue evidence capture; invoke session-checkpoint at end of sessions

### [2026-09-21T12:13:30-05:00]

#### Summary

- Scaffolded Next.js + Mastra with Postgres storage so the repo can be linked to Vercel and DATABASE_URL provisioned.

#### Changes

- Evidence / records: S009/S010 and related index/role/employer updates present in working tree
- Skills / tooling: Next.js App Router app; Mastra jobzeug-agent; @mastra/pg PostgresStore singleton; /chat smoke test; concurrent Studio scripts
- Other: .env.example (OPENAI_API_KEY, DATABASE_URL); README; next.config serverExternalPackages; .gitignore Mastra/Next merges

#### Decisions

- Single package (no monorepo); Studio local-only; Vercel Postgres via DATABASE_URL instead of LibSQL

#### Plans cached

- next.js_mastra_scaffold_718b8d31.plan.md

#### Next

- Create/link Vercel project; attach Marketplace Postgres; set DATABASE_URL + OPENAI_API_KEY; run dev:all

### [2026-09-21T12:54:18-05:00]

#### Summary

- Site password gate, evidence workspace on jobzeug-agent, drop Mastra observability noise, migrate middleware→proxy.

#### Changes

- Evidence / records:
- Skills / tooling: SITE_PASSWORD session via /login + src/proxy.ts; read-only evidence Workspace with BM25; removed @mastra/observability
- Other: .env.example SESSION_SECRET/SITE_PASSWORD; README updates

#### Decisions

- Hobby-friendly code password gate instead of Vercel Deployment Protection; evidence entire folder read-only BM25 markdown index; observability off to silence Studio PG feedback errors

#### Plans cached

- evidence_mastra_workspace_4e07deca.plan.md
- site_password_gate_c3c92081.plan.md

#### Next

- Redeploy with SITE_PASSWORD/SESSION_SECRET on Vercel; exercise agent against evidence in Studio/chat

### [2026-09-21T13:02:32-05:00]

#### Summary

- Enabled Observational Memory on jobzeug-agent with OpenAI gpt-4o-mini for long-thread compression.

#### Changes

- Evidence / records:
- Skills / tooling: Memory options now include observationalMemory model openai/gpt-4o-mini
- Other:

#### Decisions

- Use OpenAI mini for OM observer calls to keep cost down while compressing past ~30k tokens

#### Plans cached

- add_story_skill_2a282f5c.plan.md
- customers_evidence_log_51450833.plan.md
- evidence_mastra_workspace_4e07deca.plan.md
- next.js_mastra_scaffold_718b8d31.plan.md
- session_checkpoint_skill_65575be3.plan.md
- site_password_gate_c3c92081.plan.md
- stories_to_projects_rename_34704978.plan.md

#### Next

- Restart Studio/Next; verify OM engages on longer chats; ensure Vercel has SITE_PASSWORD/SESSION_SECRET

### [2026-09-22T17:23:20-05:00]

#### Summary

- Wired design-system consumption in the Next app (JzButton, tokens), dropped the JzFormSubmit wrapper, and locked agents out of editing `packages/design-system`.

#### Changes

- Evidence / records: LinkedIn additions (employers C010–C014, roles R018–R022, projects S011–S016), compress outputs under evidence/outputs/, Contentful schema/tags work
- Skills / tooling: session-checkpoint skill; compress-to-contentful skill; always-apply ignore-design-system Cursor rule + AGENTS.md boundary; app uses `@jobzeug/design-system` buttons/tokens; login form client boundary for JzButton submit
- Other: local DS2 CLI wiring plans; Specs rip / Lit restore / resume SPA / floating chat plans cached

#### Decisions

- Design system package is owned elsewhere — agents must never modify it (fonts/Montserrat/tokens included); app only consumes published exports
- Form submits use JzButton + requestSubmit at call sites instead of a shared submit abstraction

#### Plans cached

- add_story_skill_2a282f5c.plan.md
- comp-make_skill_429bbef5.plan.md
- customers_evidence_log_51450833.plan.md
- evidence_contentful_compress_793daf55.plan.md
- evidence_mastra_workspace_4e07deca.plan.md
- montserrat_entry_css_f8261a2c.plan.md
- next.js_mastra_scaffold_718b8d31.plan.md
- resume_cite_highlights_ae4c6a1c.plan.md
- resume_floating_chat_c02c45c0.plan.md
- resume_spa_contentful_5d3d3333.plan.md
- rip_specs_restore_lit_8e08794a.plan.md
- session_checkpoint_skill_65575be3.plan.md
- site_password_gate_c3c92081.plan.md
- specs_ds_import_3ed8c9e7.plan.md
- stories_to_projects_rename_34704978.plan.md
- web_components_ds_b1737d33.plan.md
- wire_local_ds2_cli_cc2d5484.plan.md

#### Next

- Keep design-system edits outside this repo’s agent context; verify Montserrat/tokens from DS package alone; continue resume/chat polish without touching packages/design-system

### [2026-09-22T18:21:38-05:00]

#### Summary

- Fixed Vercel install failure by shipping committed `@jobzeug/design-system` dist and skipping the local-only ds2 agent-kit rebuild on CI.

#### Changes

- Evidence / records:
- Skills / tooling: `scripts/vercel-install.mjs` strips file: kit + prepare then `npm install --ignore-scripts`; `vercel.json` install/build commands; root `build` is `next build` only
- Other: `.gitignore` exception for `packages/design-system/dist/**`; committed prebuilt dist; README note to rebuild and commit dist after local DS changes

#### Decisions

- Do not permanently edit design-system source for deploy; mutate the Vercel clone only at install time and consume prebuilt dist

#### Plans cached

- add_story_skill_2a282f5c.plan.md
- comp-make_skill_429bbef5.plan.md
- customers_evidence_log_51450833.plan.md
- evidence_contentful_compress_793daf55.plan.md
- evidence_mastra_workspace_4e07deca.plan.md
- montserrat_entry_css_f8261a2c.plan.md
- next.js_mastra_scaffold_718b8d31.plan.md
- resume_cite_highlights_ae4c6a1c.plan.md
- resume_floating_chat_c02c45c0.plan.md
- resume_spa_contentful_5d3d3333.plan.md
- rip_specs_restore_lit_8e08794a.plan.md
- session_checkpoint_skill_65575be3.plan.md
- site_password_gate_c3c92081.plan.md
- specs_ds_import_3ed8c9e7.plan.md
- stories_to_projects_rename_34704978.plan.md
- vercel_ds_prebuilt_e09f8557.plan.md
- web_components_ds_b1737d33.plan.md
- wire_local_ds2_cli_cc2d5484.plan.md

#### Next

- Confirm Vercel deploy passes with prebuilt dist; after DS changes locally run `npm run ds:build` and commit `packages/design-system/dist`
