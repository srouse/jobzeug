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

### [2026-09-22T18:24:07-05:00]

#### Summary

- Excluded `packages/design-system` from the root TypeScript project so Next/Vercel typecheck consumes published dist types only.

#### Changes

- Evidence / records:
- Skills / tooling: `tsconfig.json` exclude for design-system (fixes Lit decorator + missing agent-kit errors on `next build`)
- Other:

#### Decisions

- App TS project must not typecheck design-system source; dist remains the deploy contract

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

- Confirm Vercel `next build` passes after this exclude

### [2026-09-23T18:25:05-05:00]

#### Summary

- Polished the resume SPA fit surface: answer stage styling, stable cited-row sizing, toggle-to-deselect assistant answers, and tighter panel headers/typography; confirmed third-person advocate voice for the agent.

#### Changes

- Evidence / records: product doc `evidence/Jobzeug.md`; removed archived job-listing folder under evidence; Goal/README/sources index updates
- Skills / tooling:
- Other: answer stage + evidence connectors; job posting panel/API; cite highlight polish (no layout jump on cite); header equal padding and smaller overline/label type; Projects label alignment; chat dock toggle clear on re-click

#### Decisions

- Keep agent answers third-person (advocate about Scott, not first-person as Scott); stage reads as fit brief between resume and need
- Cited highlight must not change row box size (padding always on, cite only surface color)

#### Plans cached

- add_story_skill_2a282f5c.plan.md
- comp-make_skill_429bbef5.plan.md
- customers_evidence_log_51450833.plan.md
- evidence_contentful_compress_793daf55.plan.md
- evidence_mastra_workspace_4e07deca.plan.md
- finish_docked_toolbar_52ac2998.plan.md
- job_cite_chat-only_c7f1d253.plan.md
- jz-icon_phosphor_0589d485.plan.md
- jztext_jzicon_migration_23ae0664.plan.md
- montserrat_entry_css_f8261a2c.plan.md
- next.js_mastra_scaffold_718b8d31.plan.md
- resume_cite_highlights_ae4c6a1c.plan.md
- resume_floating_chat_c02c45c0.plan.md
- resume_spa_contentful_5d3d3333.plan.md
- rip_specs_restore_lit_8e08794a.plan.md
- session_checkpoint_skill_65575be3.plan.md
- session_job_posting_28aa6696.plan.md
- site_password_gate_c3c92081.plan.md
- specs_ds_import_3ed8c9e7.plan.md
- stories_to_projects_rename_34704978.plan.md
- vercel_ds_prebuilt_e09f8557.plan.md
- web_components_ds_b1737d33.plan.md
- wire_local_ds2_cli_cc2d5484.plan.md

#### Next

- Continue connector/stage visual polish; keep design-system package edits out of this app workspace

### [2026-09-23T18:50:36-05:00]

#### Summary

- Added citeable job-description paragraphs (`section: description`), richer structured NEED for chat (incl. compensation), readable multi-paragraph agent answers, and aligned job-panel horizontal spacing.

#### Changes

- Evidence / records: `evidence/Jobzeug.md` NEED / panel / answer-format notes
- Skills / tooling:
- Other: jobLine description section (schema + structurer + panel + formatJobPostingContext); agent response format (bold lead-ins, short paragraphs); job posting panel inset alignment; Vercel fixes earlier this session already on main

#### Decisions

- Hand agent structured NEED only (no fullText dump); description paragraphs reuse jobLine + citeEvidence.jobLines
- Answer readability via system prompt, not UI redesign

#### Plans cached

- add_story_skill_2a282f5c.plan.md
- comp-make_skill_429bbef5.plan.md
- customers_evidence_log_51450833.plan.md
- evidence_contentful_compress_793daf55.plan.md
- evidence_mastra_workspace_4e07deca.plan.md
- finish_docked_toolbar_52ac2998.plan.md
- full_job_post_context_e1b35bf3.plan.md
- job_cite_chat-only_c7f1d253.plan.md
- jz-icon_phosphor_0589d485.plan.md
- jztext_jzicon_migration_23ae0664.plan.md
- montserrat_entry_css_f8261a2c.plan.md
- next.js_mastra_scaffold_718b8d31.plan.md
- resume_cite_highlights_ae4c6a1c.plan.md
- resume_floating_chat_c02c45c0.plan.md
- resume_spa_contentful_5d3d3333.plan.md
- rip_specs_restore_lit_8e08794a.plan.md
- session_checkpoint_skill_65575be3.plan.md
- session_job_posting_28aa6696.plan.md
- site_password_gate_c3c92081.plan.md
- specs_ds_import_3ed8c9e7.plan.md
- stories_to_projects_rename_34704978.plan.md
- vercel_ds_prebuilt_e09f8557.plan.md
- web_components_ds_b1737d33.plan.md
- wire_local_ds2_cli_cc2d5484.plan.md

#### Next

- Re-bind postings to extract description lines; confirm salary + description cite highlights in UI

### [2026-09-24T17:46:29-05:00]

#### Summary

- Built Design-tab session token overrides (brand URL/Firecrawl → knobs → full semantic CSS flood, curated Google Fonts, override highlights); simplified knobs by dropping tertiary/feedback; removed leftover employer logo-download pipeline.

#### Changes

- Evidence / records:
- Skills / tooling: `.agents/skills/compress-to-contentful/SKILL.md` (drop fetch-logos / LOGO_DEV docs)
- Other: `src/design/session-tokens/` + Design tab UI/API/agent; resume workspace / themed answer accordion work in tree; delete uncommitted `fetch-logos` plumbing; `.env.example` Firecrawl note for Design-tab branding

#### Decisions

- Session knobs stay isolated under `src/design/session-tokens/`; never edit `packages/design-system`
- Tertiary/error/success/warning stay on fixed frozen mids in CSS flood but are not agent/UI knobs
- Employer logos out of product — no logo.dev prefetch or Contentful Asset logo field in this app flow

#### Plans cached

- add_story_skill_2a282f5c.plan.md
- brand_url_design_knobs_cc92b6b9.plan.md
- comp-make_skill_429bbef5.plan.md
- customers_evidence_log_51450833.plan.md
- employer_logo_prefetch_02387199.plan.md
- evidence_contentful_compress_793daf55.plan.md
- evidence_mastra_workspace_4e07deca.plan.md
- finish_docked_toolbar_52ac2998.plan.md
- full_job_post_context_e1b35bf3.plan.md
- job_cite_chat-only_c7f1d253.plan.md
- jz-icon_phosphor_0589d485.plan.md
- jztext_jzicon_migration_23ae0664.plan.md
- montserrat_entry_css_f8261a2c.plan.md
- next.js_mastra_scaffold_718b8d31.plan.md
- persist_site_password_session_cc3eee20.plan.md
- resume_cite_highlights_ae4c6a1c.plan.md
- resume_floating_chat_c02c45c0.plan.md
- resume_spa_contentful_5d3d3333.plan.md
- rip_specs_restore_lit_8e08794a.plan.md
- session_checkpoint_skill_65575be3.plan.md
- session_design_tokens_20a67a82.plan.md
- session_job_posting_28aa6696.plan.md
- site_password_gate_c3c92081.plan.md
- specs_ds_import_3ed8c9e7.plan.md
- stories_to_projects_rename_34704978.plan.md
- themed_answer_accordion_32662583.plan.md
- vercel_ds_prebuilt_e09f8557.plan.md
- web_components_ds_b1737d33.plan.md
- wire_local_ds2_cli_cc2d5484.plan.md

#### Next

- Apply Contentful schema if Employer still has a logo field in the CMS; continue Design-tab polish without touching design-system package

### [2026-09-24T17:56:05-05:00]

#### Summary

- Cleared stale `.next` resume type stubs so local production build passes; silenced `pg` sslmode deprecation warnings by normalizing DATABASE_URL to `verify-full`.

#### Changes

- Evidence / records:
- Skills / tooling:
- Other: `src/mastra/storage.ts` sslmode normalize; `.env.example` note; ship staged `JzAccordion` dist exports already built for Vercel

#### Decisions

- Do not rewrite app accordion away from `JzAccordion` — consume published DS exports
- Pin `sslmode=verify-full` in code so hosted URLs with `require` keep current pg behavior without warnings

#### Plans cached

- add_story_skill_2a282f5c.plan.md
- brand_url_design_knobs_cc92b6b9.plan.md
- comp-make_skill_429bbef5.plan.md
- customers_evidence_log_51450833.plan.md
- employer_logo_prefetch_02387199.plan.md
- evidence_contentful_compress_793daf55.plan.md
- evidence_mastra_workspace_4e07deca.plan.md
- finish_docked_toolbar_52ac2998.plan.md
- full_job_post_context_e1b35bf3.plan.md
- job_cite_chat-only_c7f1d253.plan.md
- jz-icon_phosphor_0589d485.plan.md
- jztext_jzicon_migration_23ae0664.plan.md
- montserrat_entry_css_f8261a2c.plan.md
- next.js_mastra_scaffold_718b8d31.plan.md
- persist_site_password_session_cc3eee20.plan.md
- resume_cite_highlights_ae4c6a1c.plan.md
- resume_floating_chat_c02c45c0.plan.md
- resume_spa_contentful_5d3d3333.plan.md
- rip_specs_restore_lit_8e08794a.plan.md
- session_checkpoint_skill_65575be3.plan.md
- session_design_tokens_20a67a82.plan.md
- session_job_posting_28aa6696.plan.md
- site_password_gate_c3c92081.plan.md
- specs_ds_import_3ed8c9e7.plan.md
- stories_to_projects_rename_34704978.plan.md
- themed_answer_accordion_32662583.plan.md
- vercel_ds_prebuilt_e09f8557.plan.md
- web_components_ds_b1737d33.plan.md
- wire_local_ds2_cli_cc2d5484.plan.md

#### Next

- Confirm Vercel deploy with JzAccordion dist on main; leave design-system source edits to DS ownership

### [2026-09-25T17:08:00-0500]

#### Summary

- Resume workspace UX: shared page headers, JzHighlight stage answers, prompt-stage attach checkboxes in the left gutter, idle scrollbars, and optimistic clear.

#### Changes

- Evidence / records:
- Skills / tooling:
- Other: EvidencePageHeader; stage AnswerHighlights (JzHighlight) replacing accordion; theme outline/writer prompts for shorter pronoun-led copy + title/highlight fields; AttachGutterRow checkboxes on resume/job during prompt stage; idle scrollbar on stage/resume/job bodies; clearSession kicks UI immediately while DELETE runs in background

#### Decisions

- Attach state shown via checkbox instead of full-row brand wash during prompt stage; checkboxes hidden once an answer is active
- Consume JzHighlight via safe custom-element loader to survive HMR double-register

#### Plans cached

- add_story_skill_2a282f5c.plan.md
- brand_url_design_knobs_cc92b6b9.plan.md
- comp-make_skill_429bbef5.plan.md
- customers_evidence_log_51450833.plan.md
- employer_logo_prefetch_02387199.plan.md
- evidence_contentful_compress_793daf55.plan.md
- evidence_mastra_workspace_4e07deca.plan.md
- finish_docked_toolbar_52ac2998.plan.md
- full_job_post_context_e1b35bf3.plan.md
- job_cite_chat-only_c7f1d253.plan.md
- jz-icon_phosphor_0589d485.plan.md
- jztext_jzicon_migration_23ae0664.plan.md
- montserrat_entry_css_f8261a2c.plan.md
- next.js_mastra_scaffold_718b8d31.plan.md
- one_role_per_project_ea3747a0.plan.md
- persist_site_password_session_cc3eee20.plan.md
- resume_cite_highlights_ae4c6a1c.plan.md
- resume_floating_chat_c02c45c0.plan.md
- resume_spa_contentful_5d3d3333.plan.md
- rip_specs_restore_lit_8e08794a.plan.md
- session_checkpoint_skill_65575be3.plan.md
- session_design_tokens_20a67a82.plan.md
- session_job_posting_28aa6696.plan.md
- site_password_gate_c3c92081.plan.md
- specs_ds_import_3ed8c9e7.plan.md
- stories_to_projects_rename_34704978.plan.md
- themed_answer_accordion_32662583.plan.md
- vercel_ds_prebuilt_e09f8557.plan.md
- web_components_ds_b1737d33.plan.md
- wire_local_ds2_cli_cc2d5484.plan.md

#### Next

- Visual polish on attach gutter / highlight mapping if needed after fresh asks


### [2026-09-26T10:48:42-0500]

#### Summary

- Added annotate-project skill, matching catalog/scoring services (AI map at ingest, deterministic score API), S023 ListenAssist evidence, and a stage Match debug button; compress/push published matching metadata.

#### Changes

- Evidence / records: S023 AmFam ListenAssist; project YAML matching headers; vocabulary outputs; compress updates including S023
- Skills / tooling: annotate-project; compress/add-project cross-links; job-posting requirement mapper; matching-score + `/api/job-posting/match`; stage Match console button
- Other: Contentful matching schema fields on jobLine/jobPosting; matching tests

#### Decisions

- Forward-only posting mapping (no legacy backfill); AI produces requirement material once, scoring stays deterministic without LLM; Match UI deferred to console debug only

#### Plans cached

- add_story_skill_2a282f5c.plan.md
- brand_url_design_knobs_cc92b6b9.plan.md
- comp-make_skill_429bbef5.plan.md
- customers_evidence_log_51450833.plan.md
- employer_logo_prefetch_02387199.plan.md
- evidence_contentful_compress_793daf55.plan.md
- evidence_mastra_workspace_4e07deca.plan.md
- finish_docked_toolbar_52ac2998.plan.md
- full_job_post_context_e1b35bf3.plan.md
- job_cite_chat-only_c7f1d253.plan.md
- job_matching_services_910e861f.plan.md
- jz-icon_phosphor_0589d485.plan.md
- jztext_jzicon_migration_23ae0664.plan.md
- montserrat_entry_css_f8261a2c.plan.md
- next.js_mastra_scaffold_718b8d31.plan.md
- one_role_per_project_ea3747a0.plan.md
- persist_site_password_session_cc3eee20.plan.md
- resume_cite_highlights_ae4c6a1c.plan.md
- resume_floating_chat_c02c45c0.plan.md
- resume_spa_contentful_5d3d3333.plan.md
- rip_specs_restore_lit_8e08794a.plan.md
- session_checkpoint_skill_65575be3.plan.md
- session_design_tokens_20a67a82.plan.md
- session_job_posting_28aa6696.plan.md
- site_password_gate_c3c92081.plan.md
- specs_ds_import_3ed8c9e7.plan.md
- stories_to_projects_rename_34704978.plan.md
- themed_answer_accordion_32662583.plan.md
- vercel_ds_prebuilt_e09f8557.plan.md
- web_components_ds_b1737d33.plan.md
- wire_local_ds2_cli_cc2d5484.plan.md

#### Next

- Improve requirement mapper so project-scoped lines get concept_ids (current Match runs show all-unmapped zeros); optional match UI after mapping quality is good


### [2026-09-26T18:10:50-0500]

#### Summary

- Relationship scoring now adds integer points for real concept and axis hits, and the match result includes job post fit, resume fit, and job relevancy. Blank optional fields from the job structurer no longer abort ingest.

#### Changes

- Evidence / records: matching engine notes for additive points, the two fit scores, job relevancy, and ignored placeholder axes
- Skills / tooling: compress-to-contentful skill touch; matching code moved under src/lib/matching
- Other: fit.ts and debug match-concepts page; unknown/null/blank axes do not score; structurer schema omits empty optional strings; session plan cache

#### Decisions

- Job post fit caps at one project that covers every posting box; boxes only other projects cover count at half
- Resume fit stacks claim concepts so more work in the same tags raises the score
- Job relevancy is posting-only: each project-scoped line is full at three concepts, and empty lines stay in the ceiling
- unknown, null, and blank ownership, scope, and stage are missing data, not matches
- Empty structurer strings are omitted fields, not validation failures

#### Plans cached

- add_story_skill_2a282f5c.plan.md
- brand_url_design_knobs_cc92b6b9.plan.md
- comp-make_skill_429bbef5.plan.md
- cumulative_relationship_scoring_d08863de.plan.md
- customers_evidence_log_51450833.plan.md
- employer_logo_prefetch_02387199.plan.md
- evidence_contentful_compress_793daf55.plan.md
- evidence_mastra_workspace_4e07deca.plan.md
- finish_docked_toolbar_52ac2998.plan.md
- full_job_post_context_e1b35bf3.plan.md
- job_cite_chat-only_c7f1d253.plan.md
- job_matching_services_910e861f.plan.md
- job_relevancy_score_e9cdd39b.plan.md
- jz-icon_phosphor_0589d485.plan.md
- jztext_jzicon_migration_23ae0664.plan.md
- montserrat_entry_css_f8261a2c.plan.md
- next.js_mastra_scaffold_718b8d31.plan.md
- one_role_per_project_ea3747a0.plan.md
- persist_site_password_session_cc3eee20.plan.md
- resume_cite_highlights_ae4c6a1c.plan.md
- resume_fit_score_4eb3f154.plan.md
- resume_floating_chat_c02c45c0.plan.md
- resume_spa_contentful_5d3d3333.plan.md
- rip_specs_restore_lit_8e08794a.plan.md
- robust_parallel_line_mapper_50922044.plan.md
- session_checkpoint_skill_65575be3.plan.md
- session_design_tokens_20a67a82.plan.md
- session_job_posting_28aa6696.plan.md
- site_password_gate_c3c92081.plan.md
- specs_ds_import_3ed8c9e7.plan.md
- stories_to_projects_rename_34704978.plan.md
- themed_answer_accordion_32662583.plan.md
- vercel_ds_prebuilt_e09f8557.plan.md
- web_components_ds_b1737d33.plan.md
- wire_local_ds2_cli_cc2d5484.plan.md

#### Next

- Re-run the job posting that failed structure validation
- Review job relevancy on a posting that barely maps into the vocabulary

### [2026-09-27T11:46:02-0500]

#### Summary

- The stage now keeps one focus at a time, and match edges are saved on the job posting when it is ingested. The closed eye hides unlinked projects and job lines.

#### Changes

- Evidence / records: Blueprints presentation draft published; project files and matching outputs updated in the working tree
- Skills / tooling: stub-project-presentation drafts a first pass and publishes that one entry
- Other: connection hub above the AI stage; top four scores stay blue and the rest use the subtle border; View more and Contentful links moved into the hub; eyeball hides unlinked rows

#### Decisions

- A project, a job line, or an AI result is the only line driver at a time
- Lines still meet the stage card edge
- The four highest scores are blue; lower scores are gray
- Unlinked rows stay visible until a focus exists and the eye is closed

#### Plans cached

- add_story_skill_2a282f5c.plan.md
- brand_url_design_knobs_cc92b6b9.plan.md
- comp-make_skill_429bbef5.plan.md
- cumulative_relationship_scoring_d08863de.plan.md
- customers_evidence_log_51450833.plan.md
- employer_logo_prefetch_02387199.plan.md
- evidence_contentful_compress_793daf55.plan.md
- evidence_mastra_workspace_4e07deca.plan.md
- finish_docked_toolbar_52ac2998.plan.md
- full_job_post_context_e1b35bf3.plan.md
- job_cite_chat-only_c7f1d253.plan.md
- job_matching_services_910e861f.plan.md
- job_relevancy_score_e9cdd39b.plan.md
- jz-icon_phosphor_0589d485.plan.md
- jztext_jzicon_migration_23ae0664.plan.md
- kleio_image_index_628384b0.plan.md
- montserrat_entry_css_f8261a2c.plan.md
- next.js_mastra_scaffold_718b8d31.plan.md
- one_role_per_project_ea3747a0.plan.md
- persist_site_password_session_cc3eee20.plan.md
- project_presentation_modal_5405980f.plan.md
- resume_cite_highlights_ae4c6a1c.plan.md
- resume_fit_score_4eb3f154.plan.md
- resume_floating_chat_c02c45c0.plan.md
- resume_spa_contentful_5d3d3333.plan.md
- rip_specs_restore_lit_8e08794a.plan.md
- robust_parallel_line_mapper_50922044.plan.md
- session_checkpoint_skill_65575be3.plan.md
- session_design_tokens_20a67a82.plan.md
- session_job_posting_28aa6696.plan.md
- site_password_gate_c3c92081.plan.md
- specs_ds_import_3ed8c9e7.plan.md
- stage_connection_split_d1e8d824.plan.md
- stories_to_projects_rename_34704978.plan.md
- themed_answer_accordion_32662583.plan.md
- vercel_ds_prebuilt_e09f8557.plan.md
- web_components_ds_b1737d33.plan.md
- wire_local_ds2_cli_cc2d5484.plan.md

#### Next

- Reprocess a saved posting so matchGraph is stored and the hub lines use those edges

### [2026-09-27T19:38:18-0500]

#### Summary

- Debug scoring ranks by a mix of average tag strength and how many lines or projects are hit, and the project table lists every catalog project, including zeros. Home uses that same mix for the top three.

#### Changes

- Evidence / records: matching engine notes still describe an axis bonus; the scoring constant is 0
- Skills / tooling: none
- Other: debug tables (tags, average, lines, final), directional job-post and resume percents, rescore-and-save, home top three by the final mix, row hover outline, focus brief

#### Decisions

- Ownership, scope, and delivery stage add 0 points so tags lead
- Final is 60% average against the best average on the posting plus 40% coverage against the most lines or projects
- Job post percent is how well the resume attends to each project-scoped line, with the best hit capped at a full line of 30
- The first column includes every catalog project, including score 0

#### Plans cached

- focus_brief_paragraph_0a636a69.plan.md

#### Next

- Rescore and save so the home page reads a stored graph that matches the debug ranking
- Job post percent still ignores how many projects hit a line

### [2026-09-28T14:21:00-05:00]

#### Summary

- Published vocabulary 1.5.0 with the Contentful for Figma update, then moved the presentation link onto the project and put public URLs in the S014 and S008 summaries.

#### Changes

- Evidence / records: S008 security and help claims, vocabulary 1.5.0 pin, resume summaries with markdown links for the design-tokens article and the Figma widget help pages
- Skills / tooling: compress keeps resume-summary links; stub presentation sets the project reference; presentations push before projects
- Other: job-line focus reads as projects over the resume total; summary links use primary text; Next typecheck excludes Node test files

#### Decisions

- The project entry references its presentation; the presentation does not point back
- A complete resume summary is copied with its markdown links, and those links render in the hub
- Summary links use the primary text color
- `*.test.ts` stays out of the Next build so Node `.ts` imports do not fail typecheck

#### Plans cached

- brief_voice_no_person_f8372480.plan.md
- employer_resume_summaries_3ddbe84e.plan.md
- project_presentation_reference_daee5218.plan.md
- s009_evidence_tags_6e42c862.plan.md

#### Next

- Remap a posting so security-constrained integration and the knowledge tags can score
- The S031 knowledge-management proposal still does not score

### [2026-09-28T19:02:47-05:00]

#### Summary

- Resume titles are title case, Berlin is part of Experience Orchestration Research, and the technical-debt article is off the resume. The resume stays covered until a job posting is loaded.

#### Changes

- Evidence / records: project titles retitled and published; S010 folded into S025 and archived; S016 archived; Bulk Edit walkthrough and Contentful Bulk Edit App title; AI Component Binding and Knowledge Management System (KMS) names
- Skills / tooling: resume-summary voice models are S014 and S015
- Other: resume cover, video-camera mark on projects with a presentation, paused focus brief, top job items center the matching line

#### Decisions

- Berlin is one part of Experience Orchestration Research, and S010 is not reused
- The technical-debt article is retired, and S016 is not reused
- Display names come from the project heading; filenames stay so existing links keep working
- The Details button stays the video control

#### Plans cached

- jobs_list_and_analytics_4c50e070.plan.md
- merge_berlin_into_exo_a760592d.plan.md

#### Next

- Round out the Berlin account on Experience Orchestration Research; S025-E008 is still proposed
- The S031 knowledge-management proposal still does not score
- The focus brief stays paused

### [2026-09-29T11:06:09-05:00]

#### Summary

- Mapped every Contentful call to Delivery or Management and listed the published reads that can move to Delivery. Those reads are not switched yet.

#### Changes

- Evidence / records: none
- Skills / tooling: none
- Other: CDA versus CMA assessment and game plan; timeline scroll window, home coverage, and hub updates included in this check-in

#### Decisions

- Published posting reads can use one Delivery request with include=2
- Writes, and the read immediately after a bind, stay on the Management API
- The design-system package and Contentful import error logs stay unstaged

#### Plans cached

- cda_versus_cma_5d934ffc.plan.md

#### Next

- Add the Delivery posting loader and point the published reads at it
- Round out the Berlin account on Experience Orchestration Research; S025-E008 is still proposed
- The S031 knowledge-management proposal still does not score
- The focus brief stays paused

### [2026-10-02T17:20:33-05:00]

#### Summary

- Project Details opens the walkthrough in the stage instead of a modal, and the address ends in `/details`. The same stage eases open and closed.

#### Changes

- Evidence / records: vocabulary and project outputs already in the working tree, including MV-1.6.0 and MV-1.7.0
- Skills / tooling: none
- Other: stage video layout and route; job posting fills the narrow column; analytics page, jobs list, and recency scoring included in this check-in

#### Decisions

- The video stays on the same stage. Closing it returns to the project text; the header X does that first, then closes the project
- Top and bottom stay flush. At the mid-size breakpoint the stage stays flush right, and the card keeps filling the stage through the close
- Below 900px the video stays in the Answer tab and does not cover the screen
- The design-system package and Contentful import error logs stay unstaged

#### Plans cached

- analytics_design_alignment_f1802b5b.plan.md
- cda_versus_cma_5d934ffc.plan.md
- delete_job_postings_bb53a413.plan.md
- project_age_decay_fef60e42.plan.md
- resume_role_tags_7617b9e9.plan.md

#### Next

- None pending from this session

### [2026-10-05T19:12:01-05:00]

#### Summary

- Resume 2 is a wide page at `/resume-2`: job posting on the left, every project in order in the middle, and the stage on the right. The top three projects for the selected job line are open cards; the rest are 6px bars.

#### Changes

- Evidence / records: none
- Skills / tooling: none
- Other: `src/app/resume-2` layout, fixed-height rows, and connector lines

#### Decisions

- Closed rows stay in resume order between the open cards, with the same 4px gap
- Card height is fixed and titles ellipsize, so connector ends are computed instead of measured mid-animation
- The three curves stay top, middle, and bottom. The job-line end jumps; the card ends slide
- The walkthrough covers the header. The design-system package stays unstaged

#### Plans cached

- none

#### Next

- None pending from this session

### [2026-10-06T12:28:46-05:00]

#### Summary

- Resume 2 collapses the project list when no job line is selected, and the address stores the posting, job line, and selected project on the same page. Vocabulary 1.10.0 records new S001 and S002 sources.

#### Changes

- Evidence / records: vocabulary 1.8.0–1.10.0 (Storybook, Experience Orchestration, internal recognition, marketplace popularity); October 6 sources for S001 and S002 and an October 5 script for S009; local presentation output files removed
- Skills / tooling: compress-to-contentful, stub-project-presentation, and update-project
- Other: Resume 2 compact and matched list, connector timing, watched checks, and `history.pushState` for the job line and project

#### Decisions

- One page. Extra path segments are stored state. Selection changes use `history.pushState`, and a refresh is the only time the server reads the path
- Job line comes first, then project. Binding a different posting clears both. An answer focus is not a path segment
- Connector curves appear only when the posting is fully open and a job line is selected. Closing the posting drops them immediately
- The design-system package, Contentful import error logs, debug logs, and the German amount-words PDF stay unstaged

#### Plans cached

- leave_presentations_in_contentful_f95cddc0.plan.md
- stop_pushing_videos_25045958.plan.md
- watched_video_checkmarks_ae9d4527.plan.md

#### Next

- None pending from this session

### [2026-10-06T18:08:54-05:00]

#### Summary

- Resume 2 can edit a project presentation in place: the blurb, both metrics, and the video. Matching then failed because published S001 cites vocabulary 1.10.0, which was not in Contentful; that vocabulary is now published.

#### Changes

- Evidence / records: published `jz-MV-1.10.0` to Contentful (already approved in the repo; no evidence file edits)
- Skills / tooling: none
- Other: Contentful OAuth and presentation write API; presentation editor; metric Symbol cap of 256; video create-or-replace; proxy body limit 90MB; editor border aligned with the project title

#### Decisions

- Metric value and label keep the Contentful Symbol maximum of 256 characters. The old 16 and 32 caps were dropped
- If the presentation already links a video asset, the upload replaces that file. Otherwise it creates an asset and links it
- Next's proxy was keeping only the first 10MB, which broke multipart parsing. The limit is 90MB so an 80MB video plus the form wrapper fits
- The editor border sits on the text edge. Extra inline room lets the shadow paint past that edge
- S001 was the only published project on 1.10.0, and its concepts are approved in that vocabulary. Published the vocabulary entry only; other projects stay on 1.9.0
- The design-system package, debug logs, Contentful import error logs, and the German amount-words PDF stay unstaged

#### Plans cached

- none

#### Next

- None pending from this session
