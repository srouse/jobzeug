---
schema_version: "1.1"
project_id: S025
title: Experience Orchestration Research
record_kind: project
project_origin: employment
ranking_eligible: true
exclusion_reason: null
parent_project_id: null
related_project_ids:
  - S001
role_links:
  - id: R001
    relationship: delivery
    status: confirmed
    note: Scott placed this on his current Contentful role, Senior Product Architect (the latest
      role, listed first on the role index).
employer_links:
  - id: C001
    relationship: delivery
    status: confirmed
    note: Contentful is building the product. Scott's account is research, feedback, and prototyping
      to guide it, not ownership of the product build.
customer_ids: []
client_ids: []
year: 2026
year_basis: estimated
year_note: Project calendar was not supplied. Estimated inside R001 (February 2026–present as of
  September 2026).
delivery_stage: prototype
annotation:
  status: reviewed
  vocabulary_version: "1.10.0"
  reviewed_by: Scott
  reviewed_at: "2026-09-27"
public_disclosure: needs_review
evidence:
  - id: S025-E001
    statement: Researches and gives feedback, on his own, to guide how Contentful's Experience
      Orchestration matures. Contentful is building the product, including Data Assemblies. He says
      both Data Assemblies and a design-system assembly are required to compose a page or a
      drag-and-drop UI, and he gives a lot of feedback so the design-system side can align with
      other teams' design systems.
    concept_ids:
      - local:systems-analysis
      - local:headless-content-management
      - local:developer-and-designer-tools
      - local:senior-product-architect
    ownership: sole
    scope: organization
    delivery_stage: concept
    provenance: self_report
    sources:
      - ref: "#evidence-e001"
        locator: Account summary — guiding role and the two parts
        supports: The guiding work is just him, Contentful is creating the product, both parts are
          required to execute a page, and feedback is concentrated on aligning the design-system
          assembly with other design systems.
    limitations:
      - He does not claim the product implementation. Contentful is adding Data Assemblies.
      - No product decision is recorded, so product-direction-influence is not tagged.
      - Next.js is his example of how developers usually put API output into a UI, not a stack he
        claims for these prototypes.
      - Design-system feedback is in this claim. design-system-development is not tagged, because
        this is feedback rather than authorship of the product's design system.
      - Everyone's design systems is the alignment requirement he states, not a counted set of teams.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Scott
      reviewed_at: "2026-09-27"
  - id: S025-E002
    statement: Prototyped a visualizer for data assemblies, and plans to spin that visualizer out as
      its own project later.
    concept_ids:
      - local:prototyping
      - local:technical-prototype
      - local:headless-content-management
      - local:senior-product-architect
    ownership: sole
    scope: individual
    delivery_stage: prototype
    provenance: self_report
    sources:
      - ref: "#evidence-e002"
        locator: Account summary — data-assembly visualizer
        supports: He prototyped a visualizer for data assemblies and said he would spin it out later.
    limitations:
      - The visualizer is not attached or inspected. Fidelity is not described.
      - It stays on this record until he opens a separate project.
      - Content-to-UI assembly is proposed, not an approved concept. Headless content management is
        the closest approved knowledge tag.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Scott
      reviewed_at: "2026-09-27"
  - id: S025-E003
    statement: Prototyped several interfaces to explain the design-system side of Experience
      Orchestration.
    concept_ids:
      - local:prototyping
      - local:technical-prototype
      - local:design-system-development
      - local:senior-product-architect
    ownership: sole
    scope: unknown
    delivery_stage: prototype
    provenance: self_report
    sources:
      - ref: "#evidence-e003"
        locator: Account summary — design-system prototypes
        supports: Several prototypes were made to explain or talk about the UI and design-system part.
    limitations:
      - Count, fidelity, and audience are not given.
      - These explain the design-system assembly. They are not claimed as the product UI.
      - Design-side versus code-side contribution is not separated.
      - The account does not say whether these are the same objects as the earlier from-scratch builds.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Scott
      reviewed_at: "2026-09-27"
  - id: S025-E004
    statement: Built the system from scratch several times before ExO, meaning the data-assembly and
      design-system sides he describes for this product.
    concept_ids:
      - local:design-system-development
      - local:headless-content-management
      - local:senior-product-architect
    ownership: sole
    scope: unknown
    delivery_stage: prototype
    provenance: self_report
    sources:
      - ref: "#evidence-e004"
        locator: Account summary — builds before ExO
        supports: He says he built the system from scratch several times even before ExO.
    limitations:
      - Those builds are not named. They may already be claimed on S001 or other records. This claim
        does not identify them.
      - Several is uncounted, and the dates before ExO are not given.
      - Shipping is not claimed. Fidelity is not described, so technical-prototype is not tagged.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Scott
      reviewed_at: "2026-09-27"
  - id: S025-E005
    statement: Reproduced what Contentful's API does and built an entirely different interface on top
      of it to show how to use stateful components.
    concept_ids:
      - local:api-integration
      - local:contentful
      - local:prototyping
      - local:technical-prototype
      - local:front-end-development
      - local:interaction-design
      - local:senior-product-architect
    ownership: sole
    scope: individual
    delivery_stage: prototype
    provenance: self_report
    sources:
      - ref: "#evidence-e005"
        locator: Account summary — API reproduction and stateful components
        supports: He reproduced their API and put a different interface on it that shows stateful
          components, which he calls one of his big themes.
    limitations:
      - He reproduced API behavior in his own prototype. He does not claim he authored Contentful's API.
      - Language and framework were not named.
      - Specific states and flows are not itemized. Stateful components is his theme, and that
        narrower meaning is only a concept proposal.
      - The interface is not attached or inspected.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Scott
      reviewed_at: "2026-09-27"
  - id: S025-E006
    statement: Made a series of PDFs, during the large prototypes, that visualize staple components
      and repeat why design properties are not a thing.
    concept_ids:
      - local:technical-writing
      - local:technical-article
      - local:senior-product-architect
    ownership: sole
    scope: unknown
    delivery_stage: prototype
    provenance: self_report
    sources:
      - ref: "#evidence-e006"
        locator: Account summary — staple-component PDFs
        supports: PDFs in the middle of the prototypes visualize staple components and argue that
          design properties are not a thing.
    limitations:
      - The PDFs are not attached. Public release is not claimed.
      - How many PDFs is not given.
      - The design-properties argument is his thesis in those PDFs, not a measured outcome.
      - design-system-development is not tagged. The PDFs argue about staple components and usage
        rules; they are not claimed as authorship of a design system.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Scott
      reviewed_at: "2026-09-27"
  - id: S025-E007
    statement: Wrote many additional documents along the way. Count, titles, and topics are not
      recorded.
    concept_ids:
      - local:technical-writing
      - local:technical-article
      - local:senior-product-architect
    ownership: sole
    scope: unknown
    delivery_stage: prototype
    provenance: self_report
    sources:
      - ref: "#evidence-e007"
        locator: Account summary — write-ups
        supports: He says he created an innumerable amount of write-ups and documents along the way.
    limitations:
      - Innumerable is his wording, not a count.
      - Topics are not stated, so this does not establish a particular technical subject.
      - Files are not attached.
      - He listed these separately from the PDFs. Overlap between the two sets is not ruled out.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Scott
      reviewed_at: "2026-09-27"
  - id: S025-E008
    statement: Used a Berlin event to socialize this research and work with people on it, including a
      presentation to about two dozen people in a hackathon-like setting.
    concept_ids:
      - local:speaking
      - local:senior-product-architect
    ownership: sole
    scope: unknown
    delivery_stage: unknown
    provenance: self_report
    sources:
      - ref: "#berlin"
        locator: Berlin — socializing the research
        supports: September 28, 2026 he placed Berlin inside this project as communicating the
          research and working with people. The September 21 account is the event detail.
    limitations:
      - Event name and dates are still unknown.
      - Reception is his recollection, not an independent assessment.
      - The September 21 account says the talk presented the separate S009 binding research.
      - He will round out the rest of the Berlin story later.
    public_disclosure: needs_review
    review:
      status: proposed
      reviewed_by: null
      reviewed_at: null
concept_proposals:
  - label: Content-to-UI assembly
    category: skill
    definition: Shaping structured content into the fields a UI component needs, in a layer between
      the CMS API and the rendered interface.
    reason: Data Assemblies and the visualizer are this middle step. content-modeling is defining
      types, and api-integration is connecting. Neither is the transformation. E001 and E002 describe
      it without an approved id.
  - label: Stateful component interfaces
    category: knowledge
    definition: Components whose behavior depends on retained interface state, and how to use that
      state in a UI.
    reason: E005 is an alternate interface made to show stateful components. interaction-design
      covers states only in general, and web-component-architecture was not claimed.
  - label: Product guidance
    category: work_activity
    definition: Research, feedback, and prototypes meant to steer a product while someone else builds
      it, without a recorded product decision.
    reason: product-direction-influence requires an affected decision. E001 is Scott's guiding role,
      not a recorded Contentful decision.
---
# S025: Experience Orchestration Research

Captured: September 27, 2026
Status: Account expanded September 27, 2026; Studio and the data-assembly visualizer are still not separate projects
Evidence: Scott's direct account, not yet supported by inspected artifacts

## Resume connection

- Role record: [R001 — Senior Product Architect](../roles/R001-contentful-senior-product-architect.md). Scott said to put this on the role he has right now, the one at the top of the role list. Source dates: February 2026–present. Project-specific months were not given.
- Employer: [C001 Contentful](../employers/C001-contentful.md)
- Earlier notes on [S001 Blueprints AI Design System](S001%20-%20Blueprints.md) and [S008](S008%20-%20Contentful%20for%20Figma%20widget.md) already use **Experience Orchestration**. That is the technical name. Acronym **ExO** (the X is generally not capitalized). A first telling said “Orchestrator”; this correction supersedes that. Do not copy the Blueprints "centerpiece" claim into this file.
- **Studio** is a title only. He says ExO is ultimately the second generation of a product called Studio, which he also gave feedback on, and that Studio is a much larger project not yet in this workspace. Do not open a Studio project from this account.
- Customers / clients: none named.
- Berlin is one part of this story, not its own project. The account is [below](#berlin). Retired project id S010. Do not reuse that id.

## Resume summary

I researched and prototyped Contentful's Experience Orchestration so a page can be composed from Data Assemblies and a design-system assembly. The prototypes include a data-assembly visualizer, design-system UI, and a stateful interface on the API.

## Account summary

<a id="source-account"></a>

Summary of Scott’s September 27, 2026 account (not a transcript). The technical name is **Experience Orchestration (ExO)**. He says the X in **ExO** is generally not capitalized. A first telling said “Orchestrator”; that wording is corrected here.

<a id="evidence-e001"></a>

Contentful is creating the product. His part is **research and feedback** on that development, and **prototyping in order to guide how the product matures and can work**. He describes that research and prototyping as **just him**. He is not claiming the product engineering effort as his build.

He says it will be the **second generation of a product called Studio**. He also helped give feedback on Studio. Studio is not captured here.

**Why the middle exists.** Contentful is a **headless CMS**: it controls the content. People manipulate that content, and a developer has to take the **API** output and put it into a **UI**, generally through something like **Next.js**.

Two big pieces of product functionality, in his account. A later clarification the same day names them as the “two parts,” and says you need both to create a drag-and-drop UI or to execute a page:

1. **Data Assemblies.** Contentful is adding this. A middle section that takes the content and forms it for any kind of UI to render. Example: a **person** content type becomes what a **card** needs, such as **title** and **description**. The assembly makes the changes in the middle so the UI component can display it.
2. **Design-system assembly** (also called component configuration, and earlier “configurable UI”). The power to create that UI in a configurable way so it can **align with everyone's design systems**, which he says has to be funneled through there. He is giving a lot of feedback on this piece. He prefers “design system assembly” as the name for this second part.

**Prototypes he says he has made** (still on this record; not split into new projects):

- <a id="evidence-e002"></a>A **visualizer for data assemblies**. He had already called this a really big thing he would spin out later. Do not open that project until he does.
- <a id="evidence-e003"></a>**Several prototypes** made to explain the UI / design-system part.
- <a id="evidence-e004"></a>**Before ExO**, he says he built “the system” from scratch several times. Which earlier records those map to is not stated here.
- <a id="evidence-e005"></a>He **reproduced exactly what their API does** (Contentful’s, in this account) and put an **entirely different interface** on top of it that shows how to use **stateful components**. He calls stateful components one of his really big themes.
- <a id="evidence-e006"></a>In the middle of those large prototypes, a **series of PDFs** that visualize and tell the story of **staple components**, and repeat why **design properties are not a thing**.
- <a id="evidence-e007"></a>An **innumerable** amount of write-ups and documents along the way. None of these files are attached on this record.

## Useful original wording

> “the acronym is EXO, and generally the X is not capitalized”

> “providing research and feedback to the development of projects… Contentful is creating”

> “the second generation of a product called Studio, which I also helped give feedback on… Studio isn't in there yet, so we'll just reference it as a title”

> “a middle section called Data Assemblies… taking a person content type and changing it into what a card would need such as title and description”

> “creating that UI in a configurable way… align with everyone's design systems… the thing that has to be funneled through there”

> “building something in order to visualize data assemblies… spin that out into its own project”

> “just me doing the research and doing prototyping in order to guide the way that the product matures”

> “data assemblies they're adding and then essentially the component configuration… You need both of those in order to actually create a drag and drop UI or… execute… a page”

> “one is data assemblies and one is the design system assembly”

> “prototyped a visualizer for data assemblies… prototyped several prototypes for… the UI part… the design system part”

> “built the system from scratch several times even before XO… reproduced exactly what their API does… an entirely different interface on top of it that actually shows how to use stateful components”

> “a series of PDFs… staple components and the reason why design properties are not a thing… an innumerable amount of write-ups and documents”

## Ownership and scope

- Contentful: creating Experience Orchestration / the product, including adding Data Assemblies.
- Scott: research, feedback, and prototyping to guide how it matures. He says that guiding work is just him. Feedback is especially on the design-system assembly so it can meet other design systems.
- Prototypes he claims: a data-assembly visualizer; several prototypes for explaining the design-system side; from-scratch builds of the system several times before ExO; a reproduction of Contentful’s API with a different interface that demonstrates stateful components; PDFs on staple components and why design properties are not a thing; many write-ups. Artifacts are not in this file.
- Not claimed: that he is building Data Assemblies or the design-system assembly as the product implementation. The visualizer stays on this record until he spins it out.
- Studio: prior product he gave feedback on; title only in this file.

## Follow-up queue

- Which earlier from-scratch builds (before ExO) belong on which existing records, if any.
- Where the PDFs, write-ups, visualizer, and design-system prototypes live, when he wants them attached.
- Studio as its own project, if he wants that feedback captured.
- The data-assembly visualizer as its own project, when he spins it out.

## Candidate uses

Interview account of guiding a headless-CMS product that needs both a content-to-UI assembly layer and a design-system assembly before a page can be composed. Do not claim he shipped ExO or Studio. The visualizer, PDFs, and API-reproduction interface are his prototypes on this record, not separate projects and not attached files.

## Berlin — socializing the research

<a id="berlin"></a>

September 28, 2026: Scott placed the Berlin trip inside this project. It was a big part of communicating this research and working with people. The rest of that telling will be rounded out later. This section keeps the September 21 account so that earlier detail is not dropped. Do not open a separate Berlin project. Retired id S010.

Faithful summary of Scott's September 21 account, not a quotation:

Scott describes a Berlin trip involving a prototype in a hackathon-like environment. The broader prototype, event name, participants, dates, and deliverables have not yet been narrated.

He says he presented the AI binding exploration documented in [S009](S009%20-%20AI%20binding%20research.md) at the beginning of the week, with a successful reception in his assessment. Someone else presented their version at the end of the event. Scott considered that version incomplete and says his earlier presentation was not acknowledged. This is his account of the sequence and attribution concern; the other person's identity, intent, independent contribution, and relationship to Scott's implementation are not established. Do not infer copying or intent.

He considers the event an important part of his exploration across AI, design systems, and Contentful. The technical binding outcome stays on S009. Do not count that outcome twice.

Useful original wording:

> “essentially a prototype within a hackathon type of environment”

> “a really important part of my story and exploration of AI, design systems, and Contentful”

Sequence he described:

1. He presents the AI binding work at the beginning of the Berlin week.
2. Prototype work takes place in a hackathon-like setting; details pending.
3. Another participant presents their version at the end, according to him.

He says he conducted the research behind the scenes and prepared the entire presentation himself. He describes an audience of **a couple dozen people**. Audience members told him that **two or three other people were thinking about this problem**, but had not solved it or reached the point he had. This is his recollection of qualitative audience feedback, not an independently verified comparison.

> “I did all of this research behind the scenes”

> “I did everything.”

<a id="evidence-e008"></a>

The September 28 framing is the claim: Berlin is him socializing this research and working with people. Event name, dates, and the rest of the story are still open.
