---
schema_version: "1.1"
project_id: S031
title: Knowledge Management System (KMS)
record_kind: project
project_origin: employment
ranking_eligible: true
exclusion_reason: null
parent_project_id: null
related_project_ids: []
role_links:
  - id: R001
    relationship: delivery
    status: confirmed
    note: He said this belongs on his latest job. That record is Senior Product Architect,
      February 2026–present.
employer_links:
  - id: C001
    relationship: delivery
    status: confirmed
    note: The demo is built in Contentful, during the Contentful tenure.
customer_ids: []
client_ids: []
year: 2026
year_basis: estimated
year_note: Estimated from R001 (February 2026–present as of September 2026). He did not give a
  project date.
delivery_stage: prototype
annotation:
  status: draft
  vocabulary_version: "1.10.0"
  reviewed_by: null
  reviewed_at: null
public_disclosure: needs_review
evidence:
  - id: S031-E001
    statement: Built the knowledge-management proof of concept himself. Firecrawl lands raw material
      in Contentful as markdown, a Mastra agent structures it and holds back a weak result, and React
      drives the site and apps that answer from that content with semantic search.
    concept_ids:
      - local:firecrawl
      - local:contentful
      - local:mastra
      - local:react
      - local:ai-workflow-engineering
      - local:ai-output-evaluation
      - local:content-modeling
      - local:semantic-search-integration
      - local:headless-content-management
      - local:prototyping
      - local:technical-prototype
      - local:senior-product-architect
    ownership: sole
    scope: individual
    delivery_stage: prototype
    provenance: self_report
    sources:
      - ref: "../sources/s031-account-handoff-2026-09-28.md"
        locator: "I built it all"
        supports: He built the proof of concept. React drives it. He thinks it is probably a Next.js
          app, with a website, Contentful apps, and other endpoints.
      - ref: "../sources/s031-kms-walkthrough-2026-09-28.md"
        locator: "0:00:16 and 0:07:26"
        supports: The walkthrough has three parts. One import is processed into structured entries.
          A question then uses semantic search and returns an FAQ and a procedure.
      - ref: "../sources/s031-kms-walkthrough-2026-09-28.md"
        locator: "0:05:06"
        supports: He planted a bad FAQ so the assessment would fail and the workflow would pause for
          a person. Passing entries continue into translation without that stop.
    limitations:
      - Next.js is his "probably." No repository is in the workspace.
      - The walkthrough does not say Mastra or React. Those names are his account.
      - An unnamed Contentful partner was expected to build the agents out with clients. He will not
        name them. They did not build this demo.
      - The content model in the recording is intentionally small. Sample files are not a customer's
        corpus.
      - The failing FAQ was planted so the pause would show. That is not a measured benchmark.
    public_disclosure: needs_review
    review:
      status: proposed
      reviewed_by: null
      reviewed_at: null
  - id: S031-E002
    statement: The demo is the handoff. He has shown it to prospects and to other partners as a
      working picture of a knowledge-management system on Contentful.
    concept_ids:
      - local:customer-demonstration
      - local:customer-facing-work
      - local:senior-product-architect
    ownership: sole
    scope: external_audience
    delivery_stage: prototype
    provenance: self_report
    sources:
      - ref: "../sources/s031-account-handoff-2026-09-28.md"
        locator: "The demo is the hand off"
        supports: He says it has been used with prospects and other partners, and that it has
          clarified how Contentful can run this kind of system.
    limitations:
      - No prospect or partner is named. No count of meetings.
      - His judgment that it is one of the best current examples, and that it influenced a lot of
        thought. No decision record is in the file.
      - He says it can still be built further. The client build belongs to the unnamed partner, not
        to this demo.
    public_disclosure: needs_review
    review:
      status: proposed
      reviewed_by: null
      reviewed_at: null
concept_proposals:
  - label: Knowledge-management system
    category: knowledge
    definition: Knowledge of collecting a large body of source material, structuring it, and making
      it usable. A data lake of raw material that is operationalized, as distinct from rebuilding a
      website.
    reason: S031 is that system. Approved concepts cover Firecrawl, Mastra, Contentful, and the
      prototype. None of them is the knowledge-management subject he says the project is for.
---
# S031: Knowledge Management System (KMS)

Captured: September 28, 2026
Status: Scott’s account, the walkthrough, and his September 28 account of the handoff. Claims are proposed.
Evidence: His accounts and the spoken walkthrough. No code or app listing is in the workspace.

## Resume connection

- Role record: [R001 — Senior Product Architect](../roles/R001-contentful-senior-product-architect.md) at [C001 Contentful](../employers/C001-contentful.md). He said this goes on his latest job. That is the present role.
- Employer: [C001 Contentful](../employers/C001-contentful.md)
- Customers / clients: None named. Prospects and other partners saw the demo. He will not name the Contentful partner. The plant-technician and outage-management files in the walkthrough are sample documents, not customers.
- Not [S003 AI Driven Demos - DemAI](S003%20-%20DemAI.md). DemAI reproduces a website inside Contentful. This one is a knowledge-management workflow.
- September 28 account, kept separate: [S031 account](../sources/s031-account-2026-09-28.md).
- Handoff account, kept separate: [S031 handoff](../sources/s031-account-handoff-2026-09-28.md).
- Walkthrough transcript, kept separate: [S031 walkthrough](../sources/s031-kms-walkthrough-2026-09-28.md). Caption errors stay in that file. It hears Firecrawl as “Firecall,” Contentful as “Contempla,” and the sample as “Plat technician.”

## Resume summary

I built a proof of concept for running a knowledge-management system on Contentful: a data lake of raw material, processed into structured content a team can use. The recording is that path, from one import to an answer a person can still stop.

## Account summary

<a id="source-account"></a>

Faithful summary of his [first account](../sources/s031-account-2026-09-28.md), the [handoff account](../sources/s031-account-handoff-2026-09-28.md), and the [walkthrough](../sources/s031-kms-walkthrough-2026-09-28.md). The source files keep his words.

This is a knowledge-management system. A large body of material can land in Contentful and be operationalized there. He calls that a data lake. The walkthrough is the workflow, in three parts. His account names the stack.

He built all of it. An unnamed Contentful partner was in the work with a different job: that partner would build the agents out with clients. This demo is the handoff, not that client build. He will not name the partner.

The walkthrough:

1. **Aggregation.** A Firecrawl Contentful app pulls material in. He can upload a file or give a URL, including a large site. Contentful stores the upload and can hand Firecrawl an asset URL. The raw result lands as a Firecrawl import: markdown, plus a summary. Sample files in the recording are a plant technician document and outage management. He does not run the crawl live.
2. **Structured content.** A second Contentful app, the KMS demo app, sits on the import and starts a Master Studio agent. That agent writes questions, then answers, fills content types that already exist, and assesses the results. The types he names are an operating or operational procedure, troubleshooting, the Firecrawl import, and an FAQ. The model is intentionally small so the processed content is visible. He planted a bad FAQ so the assessment would fail. Passing FAQs trigger a translation workflow and continue without a person. The weak one pauses for someone to review, edit, or send the agent back in. He says the run is real time, and that one imported file produces the set.
3. **Use.** A simple chatbot asks “What is HFC equipment?” Semantic search returns an FAQ and a procedure entry. The agent also writes a short answer. The structured entries are the layer he cares about, because the shape is predictable and the same content can be shown in more than one place.

React drives the whole thing. He thinks it is probably a Next.js app. There is a website, Contentful apps, and other endpoints. He calls it a complex proof of concept that tells the story from beginning to end.

He has shown it to prospects and to other partners. Knowledge-management systems are a live question for how Contentful fits, and this demo has been in those rooms. He says it has clarified the idea and influenced a lot of thinking, and that if they used the current version it is one of the best examples of how this can work now. He also says it can still be made more powerful. Those judgments are his. No meeting list is in the file.

DemAI is a different project. That one takes a website and reproduces it in Contentful. This one reproduces a knowledge-management workflow.

## Useful original wording

Scott (September 28 account):

> this is a demo of a knowledge management system that is designed with FireCrawl pulling in content into Contentful.

> I take an agent using Mastra, process that into structured content within Contentful.

Scott (handoff):

> I built it all.

> The demo is the hand off.

> This is about enabling a knowledge management system with contentful.

Walkthrough:

> I'm going to show three particular parts to this.

> I have very intentionally made some bad FAQs.

> we're actually doing a semantic search now.

## Ownership and scope

- He built the demo: the Contentful apps, the agent workflow, and the React proof of concept.
- An unnamed Contentful partner would build the agents out with clients. This recording is the handoff.
- Shown to prospects and other partners. Not a shipped client system. No names.
- Not DemAI.

## Presentation

Blurb: I built a proof of concept for a knowledge-management system on Contentful, from a data lake of raw material to structured content. The recording is that path, including an answer a person can still stop.

- value: Three parts
  label: In, structure, then use
- value: One import
  label: Becomes structured content

## Follow-up queue

- He will not name the Contentful partner.
- Next.js is his “probably.”
- No prospect or partner names, and no record of a decision that changed a roadmap.

## Candidate uses

- Portfolio: the recording is the knowledge-management path.
- Resume: the summary above.
- Interview: the review stop on a weak FAQ, and why this is not a website rebuild.

[Project index](INDEX.md) · [Role index](../roles/INDEX.md) · [Workspace guide](../README.md)
