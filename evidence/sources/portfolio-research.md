# Figma portfolio research

Reviewed September 17–18, 2026. Research notes, not published website changes. Portfolio statements below are self-reported source claims, not independently verified outcomes. Browser export was unavailable, so this is a structured content cache rather than an HTML archive.

## Sources reviewed

- Portfolio index: https://scottrouse.design/work?code=srouseaccess&next=%2Fwork
- https://scottrouse.design/work/contentful-for-figma
- https://scottrouse.design/work/ctf-ai-demos
- https://scottrouse.design/work/state-farm
- https://scottrouse.design/work/summit-credit-union
- https://scottrouse.design/work/writing-articles
- Linked token article opened: https://www.contentful.com/blog/design-token-system/
- Linked AI article opened: https://www.contentful.com/blog/understanding-ai-building-blocks-anatomy-prompt/
- Linked Figma Community widget could not be retrieved by web tool: https://www.figma.com/community/widget/1644421339192517412

## Existing portfolio content and evidence gaps

### Contentful for Figma

Scott's initiative and project leadership. Customer problem: content approved in Figma drifts from production; copying and reconstructing content creates rework. Public widget binds Contentful entries to Figma instances. Maps text, images, rich text, nested references, and string templates to layers. Search includes content types, filters, and statuses. Collections and nested bindings support larger layouts. Page explicitly distinguishes shipped functionality from future page orchestration and AI-assisted binding.

Develop: personally written code, architecture, authentication, API limitations, mapping persistence, nesting problems, testing, releases, customer discovery and feedback. Confirm widget-specific usage; 50,000 installs in application notes refers to multiple widgets combined. Avoid claiming future AI features as shipped.

### Contentful AI Demos

Problem: SEs spent hours or days assembling inconsistent prospect demos. DemAI is a Contentful app coordinating models, entries, assets, and AI workflows inside each space. Specialized content-modeling agents derive relationships from prospect websites. AI UX Workbench provides entity-specific agent interactions and visibility into multistep processes. Crawling extracts website structure and visual patterns, converts components into reusable web components, and pairs them with generated content. Design System Agent Kit is described as an agent framework generating systems aligned with Figma and code. Page claims 68% faster demo creation, more faithful demos, and broader internal AI adoption.

Develop: exact tools/languages/models, orchestration, MCP if used, schema validation, retries, evals, human review, deployment, user adoption, concrete SE engagement. Establish baseline, sample, scope and method behind 68%; don't repeat as independently validated. Distinguish prototype, internal production tool and customer production code.

### State Farm Design System Remake

Problem: diverse frontend frameworks, copied HTML and brittle CSS, slow updates, low adoption, design/engineering silos. Executive presentations connected inconsistent journeys to missing shared design primitives. Tokens and portable web components provided a cross-framework foundation. A Figma plugin let designers edit/preview tokens and commit updates to code. Cross-team workflows supported contribution and adoption. Page reports active adoption and faster changes without numerical supporting detail.

Develop: actual frameworks, technical constraints, personal implementation scope, adopted components, team counts, governance, versioning and migration. Token plugin could become a separate case if it has distinct architecture, workflow and outcomes. Ask about repository provider, authentication, review/PR process, token validation, transformations, CI, permissions and release path; do not assume these existed.

### Summit Credit Union Design System & Website Redesign

Problem: third-party systems limited experience control, UI complexity consumed development effort, and Drupal migration created risk. Built web-component design system and tokens, prototyped applications including a member loan visualizer, migrated to Contentful structured content. Rates Central is identified as a Contentful app Scott built to manage financial rates. Resume adds StencilJS, Lit and AWS CI/CD. Page reports improved performance and maintainability without measurements. Introduction says costly full rebuild avoided while body describes a full Drupal rebuild; clarify which system was rebuilt versus retained.

Develop: production delivery, APIs, migration stages, pipeline, constrained integration, rate validation and ownership, performance before/after, legacy systems retained, scope of personal work. Rates Central is a backup sixth case if it has a distinct engineering story.

### Articles

Design-token article explains primitive, semantic and component layers, distributing tokens into implementation formats and Figma, and encoding design rules. AI article explains prompt/context behavior and includes an interactive learning application. Portfolio claims sustained top-ten performance and occasional number-one ranking; earlier resumes use top-five language. Confirm analytics and date range before using rankings. Keep writing as supporting evidence of enablement and communication; investigate interactive app if it has substantial engineering depth.

## Proposed six project slots, provisional

1. Contentful for Figma: customer pain translated into a shipped Figma integration.
2. DemAI: reusable agent workflows supporting SEs and prospect-specific environments.
3. Design System Agent Kit: dedicated deep dive if distinct implementation and validation support it.
4. State Farm modernization: enterprise adoption across framework and organizational constraints.
5. State Farm Figma token plugin: dedicated design-to-code workflow if distinct enough from modernization.
6. Summit platform modernization: production migration, components, structured content and CI/CD.

Move Articles to a supporting writing section. If either split would duplicate another case, replace it with a specific customer engagement or Rates Central. Six is the target, not a reason to inflate scope.

## Rewrite structure

For each case: concrete problem and constraints; Scott's role and collaborators; architecture and personally implemented code; difficult failure or tradeoff; shipped/adopted outcome; reusable tool, pattern or learning. Add dates, stack and delivery status near the top. Use an architecture visual, real artifact and defensible outcome where available. Replace broad claims with examples and distinguish demos from customer production work.

## Next discovery exercise

Start with the Design System Agent Kit. What went in, what came out in Figma and code, what did Scott build, how was correctness checked, who used it, and what is its current delivery status? Then investigate token plugin, DemAI customer example and 68% measurement, widget architecture, State Farm adoption, Summit production migration.

## Current status

All five linked portfolio case studies read. Both external articles opened. No website repository or CMS editing access established in this workspace. No live changes made. Final six and publishable copy depend on Scott's experience details.
