# Career evidence workspace

## Workspace entry point

This folder is a self-contained Markdown knowledge workspace intended for a future Mastra agent. It preserves comprehensive career evidence so agents can build tailored resumes, portfolio selections, interactive webpages, cover letters, and interview materials for different opportunities. No Mastra runtime or webpage is implemented here. Read local records rather than relying on prior conversation history or files outside this folder.

## Evidence entity types

Keep these graphs distinct. **Projects** are the detailed work records (metadata + Scott’s account). Org and role files are hubs with research and links—do not duplicate project narratives into them.

| Kind | Folder / IDs | Meaning |
|---|---|---|
| Employer | [employers/](employers/INDEX.md) **C00x** | Org that employed Scott. C = employer (historical prefix). Retired C005 unused. |
| Role | [roles/](roles/INDEX.md) **R00x** | A job/title tenure at an employer. R = role. |
| Project | [projects/](projects/INDEX.md) **S00x** | Bounded body of work. S = project (historical prefix). |
| Customer | [customers/](customers/INDEX.md) **CU00x** | Product/platform buyer Scott sold, demoed, or adopted with. |
| Client | [clients/](clients/INDEX.md) **CL00x** | Org that hired Scott’s employer for service/delivery work. |
| Perspective | [perspectives/](perspectives/INDEX.md) **P00x** | Operating principles / viewpoints. |
| Prospect | *deferred* | Not-yet-closed pipeline — no folder or IDs yet; note on the project follow-up queue only. |

Prefer **customer** for sales/SE/product-adoption work; prefer **client** for “we were hired to build/deliver.” Ask once if ambiguous. Link project ↔ role ↔ employer and project ↔ customer/client bidirectionally.

[Employer index](employers/INDEX.md) groups related roles and projects. Keep canonical role and project files in their folders. Update employer links when adding records. LinkedIn-specific positions can coexist with explicitly labeled resume aggregates; never double-count them. [LinkedIn reconciliation](sources/linkedin-reconciliation.md) tracks source differences.

**Public disclosure:** Customer and client names default to **not cleared for public application copy**. Evidence may store real names; resume, portfolio, cover letter, and public web copy must not use them until Scott clears them.

**Org research contract** (employers, customers, and clients): category and short description from primary sources; research date and URLs; scale/credibility markers with dates; org context does **not** establish Scott’s contribution. Prefer official/investor/SEC sources over aggregators.

## Navigation and reading order

1. [Project matching specification](matching/engine.md): reusable categories, evidence matching, and posting-specific ranking.
2. [Jobzeug — the living application](Jobzeug.md): what this product is, how resume / chat / citations / stack work (for “how does this app work?” questions).
3. [Role index](roles/INDEX.md): employers, titles, dates, and linked projects.
4. [Employer index](employers/INDEX.md): employer orgs and linked roles/projects.
5. [Customer index](customers/INDEX.md) · [Client index](clients/INDEX.md): external engagement orgs.
6. [Project index](projects/INDEX.md): detailed project accounts and unresolved questions.
7. [Source index](sources/INDEX.md): local resume snapshots, portfolio research, and provenance.
8. [Perspectives](perspectives/INDEX.md): Scott’s viewpoints, working principles, and links to supporting projects.
9. [Question bank](Question%20bank.md): focused follow-ups when evidence is incomplete.

Start with the indexes, then read the relevant records and their supporting sources. Collect maximal detail; select and simplify only when generating a particular output.

**Job postings are not evidence.** Live listings are session-bound app data (bound in the resume UI / chat request). Never store full job postings under `evidence/`. Condensed application notes may live under [sources/job-posting-notes.md](sources/job-posting-notes.md) only.

## Application exclusions

Aha Notes is excluded from this Figma application at Scott’s explicit request (September 19, 2026). Do not surface it in discovery, questions, portfolio selection, or generated application materials. Historical source snapshots retain their original text for provenance. Retired IDs C005 and R008 must not be reused.

## Evidence and maintenance contract

For the proposed project-to-job matching system, read the [engine specification](matching/engine.md), [project YAML header schema](matching/project-header-schema.md), and [controlled vocabulary](matching/vocabulary.yaml). All 21 current project records have schema 1.1 headers with source-linked evidence claims. See the [migration report and discussion queue](matching/project-header-migration.md) for review status, estimated years, and unresolved decisions. Annotation review means source fidelity, not independent verification or public clearance. The [Contentful storage pipeline and validated delivery loader](../contentful/matching.md) are implemented; ranking/scoring is not yet implemented.

- Role records describe employment context; **projects** hold detailed accounts. Link them in both directions instead of duplicating narratives.
- Distinguish **source claims**, **Scott's accounts**, **artifact-supported details**, and **inferred relevance**. State what an artifact actually supports; its existence does not validate every outcome.
- Preserve conflicting dates, uncertain ownership, prototypes versus production, and planned versus shipped features. Never infer missing metrics or silently resolve conflicting sources.
- Keep stable role IDs (R001 onward), project IDs (S001 onward), employer IDs (C001 onward), customer IDs (CU001 onward), and client IDs (CL001 onward); use relative links within this workspace.
- On each substantive addition, update the record, its index, and affected cross-links. Preserve prior uncertainty or corrections with context; append dated additions to projects.
- Preserve source snapshots and provenance. Historical paths are labels only, not required external dependencies. Sources may describe provisional recommendations that later records supersede.
- Keep generated application copy separate from evidence records, in an `outputs` folder when output generation begins. Do not overwrite evidence with polished claims.
- Do not discard useful work because it is older or not selected for this application. Education and awards remain in the source resumes.
- Check that new relative links resolve within the workspace. All preparation changes stay in this folder; Mastra integration, publishing, and new-task creation are separate later work.

## Purpose

Maintain a reusable, evidence-based record of Scott’s projects across his career. Connect each project to the appropriate employer, dates, and resume role while preserving personal-work and provisional associations. Match projects to each incoming posting using the controlled vocabulary and evidence rules in the matching specification. Select application materials for the current opportunity; no employer, role, or portfolio count defines the collection.

## Task context and direction

- This workspace began with a Figma application. Its evidence collection and matching policy now serve multiple opportunities; historical source notes retain their original context.
- Scott will return periodically and narrate work in any order, sometimes covering several projects in one account. Capture first; organize and follow up without requiring a formal interview each time.
- The intended future deliverable includes a deeply interactive webpage demonstrating the work and its AI dimensions. Its format, implementation, and publishing approach remain open. Gather material now; build it in a later phase.
- The resume, website, and eventual cover letter should reinforce the same evidence while serving different purposes: quick fit, technical proof, and motivation respectively.
- The unrelated German discussion is excluded from this task's context and records.
- Read this file and the project index when resuming project collection. Save substantive new accounts into individual project files and update the index in the same turn.

## Accessible project records

- [Project matching specification](matching/engine.md): controlled vocabulary, requirement weighting, and evidence-based project ranking.
- [Project index](projects/INDEX.md): entry point for captured projects, resume connections, themes, and outstanding details.
- [Follow-up question bank](Question bank.md): prompts for later refinement, not a questionnaire Scott must complete before speaking.
- Use stable project IDs such as S001 and descriptive filenames. Record capture dates and later additions. Link related projects rather than assuming they are one effort or duplicating their outcomes.
- Label evidence as Scott's account, existing-material claim, artifact-supported detail, or open question. Capture uncertainty in dates and ownership instead of resolving it by guesswork.
- Keep raw account excerpts or faithful narrative summaries alongside polished versions. Do not present a paraphrase as a quotation.

## Working method

- Scott can talk through any number of projects in his own words; organize them into connected project records afterward.
- Capture his account and preserve useful original phrasing. Label paraphrases as summaries rather than quotations.
- Ask a small number of focused follow-ups, guided by what remains unclear.
- Distinguish Scott's contributions from team contributions, prototypes from production, and intentions from observed results.
- Existing resume and portfolio claims are leads, not independently verified facts. Do not invent metrics or fill factual gaps.
- Preserve uncertainty, corrections, and unresolved questions. Flag sensitive customer and client details before using them in public copy; respect the disclosure field on CU/CL records.
- After each substantive exchange, update the project record and index. Keep application prose separate from evidence notes.
- Choose complementary portfolio examples after discovery according to the current application; there is no fixed required count.

## Project record fields

1. Project, organization, dates, and role
2. Scott's account and useful wording
3. Users, customer relationships, and collaborators
4. Starting problem, stakes, and constraints
5. Personal ownership versus team work
6. Architecture, stack, integrations, and artifacts
7. Difficult decisions, failures, debugging, and tradeoffs
8. Delivery status, deployment, testing, and maintenance
9. Outcomes, evidence, measurement method, and limitations
10. Reuse, adoption, enablement, and product feedback
11. Open questions and public-disclosure considerations
12. Potential uses: portfolio, resume, cover letter, interview

## Discovery queue

These are provisional leads from existing materials. Dates and scope require confirmation.

| Candidate | Organization | Current source | Discovery status |
|---|---|---|---|
| Contentful for Figma | Contentful | Resume and [S008](projects/S008%20-%20Contentful%20for%20Figma%20widget.md) | Initial account; public widget; adoption still low per Scott |
| DemAI / AI demo platform | Contentful | Portfolio and [S003](projects/S003%20-%20DemAI.md) | Initial account captured; outcomes pending |
| Design System Agent Kit | Contentful | Section of AI Demos case study | Not interviewed; standalone scope unconfirmed |
| Customer-specific technical engagements | Contentful | Resume mentions SE partnerships | Specific examples needed |
| Internal adoption tools and implementation practices | Contentful | Current-role resume description | Specific examples needed |
| Enterprise design-system modernization | State Farm | [S004](roles/R004-state-farm-design-systems.md#state-farm-design-system-context) role context + [S005](projects/S005%20-%20State%20Farm%20tokens%20persuasion.md)–[S007](projects/S007%20-%20State%20Farm%20Lit%20engineering%20bridge.md) | Three independent projects; overarching narrative preserved in role context |
| Figma token plugin | State Farm | [S006](projects/S006%20-%20State%20Farm%20Figma%20design%20system.md) | Captured with components, tokens, Google expert, designer mentoring |
| Design system and content-platform migration | Summit Credit Union | Portfolio and resume | Not interviewed |
| Rates Central | Summit Credit Union | Portfolio and resume | Not interviewed |
| Member loan visualizer and banking prototypes | Summit Credit Union | Portfolio and resume | Not interviewed |
| Cross-brand design system | American Family Insurance | Resume | Not interviewed |
| Natural-language AI / knowledge-management exploration | American Family Insurance | Resume | Not interviewed |
| Client web/mobile projects | Earthling Interactive | Resume | Specific examples needed |
| Technical articles and interactive AI explainer | Contentful | Portfolio and linked articles | Not interviewed |

Older work can be added when it contributes stronger evidence: OpenHomes, Propeller Health, StudyBlue, or projects absent from current materials.

## Selection criteria

Assess concrete personal engineering ownership, direct customer collaboration, technical difficulty, production delivery, design-to-code relevance, agent-workflow depth, adoption, reusable outcomes, and available artifacts. Evaluate the portfolio as a set so each selected case contributes distinct evidence.

## Related research

- [Figma portfolio research](sources/portfolio-research.md)
- [Figma posting notes](sources/job-posting-notes.md)

## Project discovery prompt

Across the last five to ten years, which project best represents how Scott works when a difficult problem lands with him? Begin with what was happening, why he became involved, and what he did. Project choice remains open to Scott.
