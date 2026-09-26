# Project header migration and discussion queue

Completed September 26, 2026 using [header schema 1.1](project-header-schema.md) and [vocabulary 1.0.0](vocabulary.yaml).

## Result

All 22 existing project records now have structured YAML headers. There are 43 claim records, each linked to a stable anchor in its preserved narrative. Seventeen project annotations are reviewed; five remain needs_review for material ambiguity. S004 remains an umbrella excluded from ranking, with no duplicated child evidence. No new project, role, employer, customer, or client IDs were created.

Review was performed by Codex against the existing records. Approved claims mean the structured statement and tags faithfully represent that source; they do not mean Scott reviewed this migration or that self-reported outcomes were independently verified. Public-source captures are labeled existing_material because their live artifacts were not rechecked during this pass. Reviewed projects can retain explicit unknowns and limitations.

Year handling: 14 estimates, three publication-based years, two representative years from Scott’s account, and three unresolved widget years. Estimates are not confirmed chronology, durations, or ranking bonuses. For published articles, production means published material, not production software; completed talks retain unknown software delivery stage.

No blanket public clearance was inferred. S002 and S018 remain restricted because of named customers/clients; other records remain needs_review for public disclosure. That disclosure state is separate from annotation quality and does not prevent internal evidence review.

## Project-by-project status

| Project | Year | Annotation | Claims | Remaining boundary |
|---|---|---|---:|---|
| [S001: Blueprints](../projects/S001%20-%20Blueprints.md) | 2026 (estimate) | reviewed | 3 | Production/release state and customer adoption still unknown; React was agent-generated. |
| [S002: Bulk Editor](../projects/S002%20-%20Bulk%20Editor.md) | 2025 (estimate) | reviewed | 4 | Role title provisional; code-handoff boundary and ARR attribution unresolved; customer names restricted. |
| [S003: DemAI](../projects/S003%20-%20DemAI.md) | 2025 | reviewed | 2 | R002 title provisional; production status, agent/code boundaries, and 68% speed claim unresolved. |
| [S004: State Farm design system refresh (umbrella)](../roles/R004-state-farm-design-systems.md#state-farm-design-system-context) | 2023 (estimate) | reviewed | 0 | Umbrella excluded from ranking; child claims remain on S005–S007. |
| [S005: State Farm tokens persuasion](../projects/S005%20-%20State%20Farm%20tokens%20persuasion.md) | 2023 (estimate) | reviewed | 1 | Persuasion is documented; downstream rollout and shared outcome metrics are not. |
| [S006: State Farm Figma design system](../projects/S006%20-%20State%20Farm%20Figma%20design%20system.md) | 2023 (estimate) | reviewed | 2 | Plugin/widget type, release stage, and collaborator boundaries remain open. |
| [S007: State Farm Lit engineering bridge](../projects/S007%20-%20State%20Farm%20Lit%20engineering%20bridge.md) | 2023 (estimate) | reviewed | 1 | Coaching is documented; personal Lit implementation is not established. |
| [S008: Contentful for Figma widget](../projects/S008%20-%20Contentful%20for%20Figma%20widget.md) | 2026 (estimate) | reviewed | 3 | Public release is self-reported; low usage preserved; exact security tasks unspecified. |
| [S009: AI content and component binding](../projects/S009%20-%20AI%20content%20and%20component%20binding.md) | 2026 (estimate) | reviewed | 2 | Sole research ownership explicit; experiment remains unshipped and evaluation qualitative. |
| [S010: Berlin prototype exploration](../projects/S010%20-%20Berlin%20prototype%20exploration.md) | 2026 (estimate) | needs_review | 1 | Event year/role and independent prototype scope need discussion. |
| [S011: Figma Design System widget (personal)](../projects/S011%20-%20Figma%20Design%20System%20widget.md) | Unknown | needs_review | 2 | Personal-work attribution clear; year conflicts with provisional R007 calendar placement. |
| [S012: Presentation Deck widget (personal)](../projects/S012%20-%20Presentation%20Deck%20widget.md) | Unknown | needs_review | 2 | Personal-work attribution clear; year conflicts with provisional R007 calendar placement. |
| [S013: Contentful Content Type widget (personal)](../projects/S013%20-%20Contentful%20Content%20Type%20widget.md) | Unknown | needs_review | 2 | Personal-work attribution clear; year conflicts with provisional R007 calendar placement. |
| [S014: Design tokens explained (Contentful blog)](../projects/S014%20-%20Design%20tokens%20Contentful%20blog.md) | 2024 | reviewed | 1 | Published authorship captured; top-five/top-ten and search-rank claims not promoted. |
| [S015: Understanding AI by its building blocks (Contentful series)](../projects/S015%20-%20Understanding%20AI%20building%20blocks.md) | 2026 | needs_review | 2 | Writing authorship clear; interactive-module implementation ownership unresolved. |
| [S016: Hidden cost of technical debt (Contentful blog)](../projects/S016%20-%20Technical%20debt%20Contentful%20blog.md) | 2025 | reviewed | 1 | Published authorship captured; customer anecdotes are not implementation evidence. |
| [S017: JSOnline ad system installation](../projects/S017%20-%20JSOnline%20ad%20system%20installation.md) | 2001 (estimate) | reviewed | 2 | Installation and delivery supported by account; vendor/PHP details not inferred. |
| [S018: Journal Interactive advertiser studio](../projects/S018%20-%20Journal%20Interactive%20advertiser%20studio.md) | 2001 (estimate) | reviewed | 2 | Map design/build distinct from Art Museum implementation; client names restricted. |
| [S019: Summit application design system](../projects/S019%20-%20Summit%20application%20design%20system.md) | 2022 (estimate) | reviewed | 3 | Initial system and migration supported; team size and port timing remain open. |
| [S020: Summit marketing website rebuild](../projects/S020%20-%20Summit%20marketing%20website%20rebuild.md) | 2022 (estimate) | reviewed | 3 | Scott’s implementation separated from visual-design lead; performance qualitative. |
| [S021: Rates Central](../projects/S021%20-%20Rates%20Central.md) | 2022 (estimate) | reviewed | 3 | Contentful app supported; team boundary and measurement/validation details open. |
| [S022: 2024 Partnership Tour - AI design systems](../projects/S022%20-%202024%20Partnership%20Tour%20AI%20design%20systems.md) | 2024 | reviewed | 1 | Tour year explicit; exploratory talk does not establish a shipped AI product. |

## Questions to discuss first

These questions affect attribution or the useful shape of a project. Exact months are not requested; reasonable year estimates are already in place elsewhere.

### Personal widgets — S011, S012, S013

**Question:** Roughly what year belongs to each personal widget? Was the Summit calendar association the first tenure (2018–2019) or the later tenure (2020–2023), or should it be removed?

The records provisionally attach them to R007, but captured public version history is in 2022–2023. Version dates do not establish initial build dates, and the existing role link is not firm enough to resolve the difference. All three years remain null, with provisional calendar_anchor links. Their personal origin and separation from employer delivery remain explicit. Do not reassign them automatically to R005 or Contentful.

### Berlin exploration — S010

**Question:** What did the Berlin prototype itself do beyond the binding research already captured in S009, and roughly which year/role was this?

A tentative 2026 estimate follows provisional R001, not an established event date. The header records only Scott’s preparation and delivery of the presentation. It does not repeat S009’s research as a second technical accomplishment or assign another participant’s work to Scott. Event name and scope are more useful than exact dates.

### Interactive AI series — S015

**Question:** Did you personally implement the interactive modules, co-build them, or author the article while another person built the application?

Article authorship and 2026 publication dates are recorded. The module claim uses unknown ownership and delivery stage because implementation responsibility and the captured deployment errors remain unresolved. Resolving this could add engineering evidence; the current header supports educational authorship and AI knowledge only.

## Useful follow-ups after those decisions

| Projects | Question | Current treatment |
|---|---|---|
| S001 | Did Blueprints/Design System Squared reach a release or real customer use? | Build and mentoring claims retained; stage unknown and adoption unassigned. |
| S002 | Which parts of the final app were yours versus the ecosystem team’s, and what can substantiate the sales/ARR connection? | Contributor ownership; production and closed-sales association remain self-report; ARR/popularity omitted from approved claims. |
| S003 | What actually ran in operational use, and which steps were agents versus deterministic code? Is the 68% figure usable? | Mixed stage; guided workflow and reported adoption retained; no formal speed result. |
| S002, S003 | Is Solution Specialist the right canonical title for the SE/SC work? | R002 remains provisional; a year estimate or reported span is already sufficient. |
| S006 | Was the extension a plugin or widget, and what shipped? | Broad Figma-extension concept; unknown stage; collaborator contribution not resolved into sole ownership. |
| S007 | Did you also implement Lit components, or primarily coach the team? | Coaching and knowledge evidence only; no programming credit from this account. |
| S019, S021 | Was implementation primarily yours or shared, and what evidence supports adoption or time savings? | Contributor ownership; outcomes preserved as self-report with limitations. |
| S014, S020 | Are there analytics or before/after artifacts supporting the performance claims? | Article-rank claims withheld; website improvement kept qualitative and approximate. |
| S018 | What historical deliverable can be described for Trostel, and who sponsored the Water Street map? | No invented client or modern-site attribution; existing implementation boundaries preserved. |

Customer/client public-name clearance and internal-artifact sharing can be handled when preparing public application material. They do not block internal categorization. Scott’s earlier requests to skip exact dates, unnamed Summit plugin specifics, and a deep dive into S022’s universal-component idea remain in force.

## Vocabulary decisions

No new concepts were needed in this pass. All assigned concept IDs exist in vocabulary 1.0.0. The vocabulary’s project leads were treated as discovery pointers rather than automatic assignments. In particular:

- No user-research or usability-testing tags were inferred from informal customer conversations or AI experiments.
- No hand-written React proficiency was inferred from S001’s generated components.
- No TypeScript/JavaScript proficiency was inferred merely from S011 export formats.
- No API-integration claim was inferred from S017’s unnamed ad-system integration mechanism.
- No Lit coding claim was inferred from S007’s coaching.
- No adoption claim was inferred from Community user counters or public release alone.
- No measured AI evaluation was inferred from S009’s qualitative iteration.
- No product-direction causation was inferred from S022’s soft precursor account.

## Compatibility and validation

The current Mastra evidence reader returns raw text, so it can expose the headers without an application change. Its search indexes Markdown records; the vocabulary YAML can be read explicitly. The existing Contentful compressor still reads the narrative headings and legacy policy tags; these local concept IDs do not become Contentful tags automatically.

Validation checks cover every required header and claim field, enums, unique IDs, vocabulary references, entity links, parent/related relationships, source anchors, year consistency, and the umbrella/personal-work rules. Original narrative text is preserved byte-for-byte after removing the added anchors and header. Existing compressor title, role/employer connection, and resume-summary extraction are checked against the pre-migration files.

No Contentful compression, push, publish, or application deployment was performed. Existing source-hash approvals, if any, may become stale because the project files changed; review them through their normal workflow before future publishing.

## Contentful follow-up

The subsequent [Contentful integration](../../contentful/matching.md) adds structured header compression, versioned vocabulary storage, and a validated Delivery API loader. The no-publish statement above records the original header-migration pass, not this later integration. Concept IDs remain claim data, separate from Contentful tags.

## S004 retirement

S004 is now retired from the active project catalog. All original narrative and metadata were preserved in the State Farm role context. S005–S007 have null parent IDs and retain their peer relationships. The current catalog contains 21 projects; counts and umbrella checks above describe the original migration.
