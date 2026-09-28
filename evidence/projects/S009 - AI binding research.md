---
schema_version: "1.1"
project_id: S009
title: AI binding research
record_kind: project
project_origin: employment
ranking_eligible: true
exclusion_reason: null
parent_project_id: null
related_project_ids:
  - S008
  - S010
role_links:
  - id: R001
    relationship: delivery
    status: confirmed
    note: Preserved canonical association from the project account; role-source date caveats remain in
      the role record.
employer_links:
  - id: C001
    relationship: delivery
    status: confirmed
    note: Employer association recorded in the project account.
customer_ids: []
client_ids: []
year: 2026
year_basis: estimated
year_note: Estimated from R001 (February 2026–present as of September 2026); project-specific year
  was not supplied.
delivery_stage: prototype
annotation:
  status: reviewed
  vocabulary_version: "1.5.0"
  reviewed_by: Codex
  reviewed_at: "2026-09-26"
public_disclosure: needs_review
evidence:
  - id: S009-E001
    statement: Independently investigated content-to-component binding and developed richer semantic
      metadata for content properties and components.
    concept_ids:
      - local:semantic-metadata-design
      - local:systems-analysis
      - local:content-modeling
    ownership: sole
    scope: individual
    delivery_stage: prototype
    provenance: self_report
    sources:
      - ref: "#source-account"
        locator: Account summary
        supports: Independently investigated content-to-component binding and developed richer semantic
          metadata for content properties and components.
    limitations:
      - Metadata schema, storage, and automated derivation details remain unspecified.
      - The capability is not integrated into the public S008 widget.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Codex
      reviewed_at: "2026-09-26"
  - id: S009-E002
    statement: Iterated on AI binding and repair experiments, examining results and downstream effects
      when one side changed.
    concept_ids:
      - local:ai-workflow-engineering
      - local:ai-output-evaluation
      - local:critical-thinking
    ownership: sole
    scope: individual
    delivery_stage: prototype
    provenance: self_report
    sources:
      - ref: "#source-account"
        locator: Account summary
        supports: Iterated on AI binding and repair experiments, examining results and downstream effects
          when one side changed.
    limitations:
      - Consistent and near-correct results are qualitative self-assessments, not a formal benchmark.
      - Model/provider and repair boundaries remain unrecorded.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Codex
      reviewed_at: "2026-09-26"
  - id: S009-E003
    statement: Derived a natural content size from widget-populated component instances and Contentful
      entries, about 100 characters for a card, because names and field maximums were not enough for
      a predictable bio versus short-bio choice.
    concept_ids:
      - local:semantic-metadata-design
      - local:example-derived-content-fit
      - local:ai-workflow-engineering
      - local:ai-output-evaluation
      - local:figma
      - local:contentful
      - local:troubleshooting
    ownership: sole
    scope: individual
    delivery_stage: prototype
    provenance: self_report
    sources:
      - ref: "../sources/s009-ai-binding-walkthrough-2026-09-28.md"
        locator: "0:01:23 and 0:02:12"
        supports: He used populated instances and Contentful entries to estimate natural size, including
          about 100 characters for a card, after name-only binding failed.
    limitations:
      - About 100 characters and “nine times out of ten” are his walkthrough impressions, not a measured
        sample or success rate.
      - The metadata representation and which entries he sampled are not in the transcript.
    public_disclosure: needs_review
    review:
      status: proposed
      reviewed_by: null
      reviewed_at: null
  - id: S009-E004
    statement: Added intent on both sides so a case-study preview maps to challenge rather than outcome,
      matching the choice he made every time he populated those cards in the widget.
    concept_ids:
      - local:semantic-metadata-design
      - local:decision-making
      - local:ai-workflow-engineering
      - local:figma
    ownership: sole
    scope: individual
    delivery_stage: prototype
    provenance: self_report
    sources:
      - ref: "../sources/s009-ai-binding-walkthrough-2026-09-28.md"
        locator: "0:02:40"
        supports: Length could not separate challenge from outcome; he chose challenge for previews and
          asked the agent to describe what each field is for.
    limitations:
      - “Every time” is his recollection of his own Figma population, not an exported history.
      - Intent metadata is described in speech, not as a schema.
    public_disclosure: needs_review
    review:
      status: proposed
      reviewed_by: null
      reviewed_at: null
  - id: S009-E005
    statement: Had the agent read raw JSON on content entries and propose bindings from patterns it saw
      repeatedly, including telephone numbers stored in those fields.
    concept_ids:
      - local:ai-workflow-engineering
      - local:ai-output-evaluation
      - local:contentful
    ownership: sole
    scope: individual
    delivery_stage: prototype
    provenance: self_report
    sources:
      - ref: "../sources/s009-ai-binding-walkthrough-2026-09-28.md"
        locator: "0:03:49"
        supports: After intent was added, the agent inspected entry JSON and suggested bindings he had
          not asked for, such as telephone numbers.
    limitations:
      - No entry, field name, or count is given. Telephone numbers are his example of an unexpected
        suggestion, not a claim that this is a good content model.
      - “Very predictable” remains a qualitative self-assessment.
    public_disclosure: needs_review
    review:
      status: proposed
      reviewed_by: null
      reviewed_at: null
  - id: S009-E006
    statement: Diagnosed why name-to-title and bio-versus-short-bio stayed unpredictable. The names
      were too thin for the model to make a stable choice.
    concept_ids:
      - local:troubleshooting
      - local:critical-thinking
      - local:ai-system-fundamentals
      - local:ai-output-evaluation
    ownership: sole
    scope: individual
    delivery_stage: prototype
    provenance: self_report
    sources:
      - ref: "../sources/s009-ai-binding-walkthrough-2026-09-28.md"
        locator: "0:00:39 through 0:01:23"
        supports: He expected name and title, or bio and short bio, to be obvious, and the bindings
          stayed unreliable because the inputs were too thin.
    limitations:
      - The failure is his diagnosis from the walkthrough, not a logged evaluation.
    public_disclosure: needs_review
    review:
      status: proposed
      reviewed_by: null
      reviewed_at: null
  - id: S009-E009
    statement: Stated that a content entry and a component are separate structures whose names do not
      match, so the fields have to be mapped, such as a person's name onto a card title.
    concept_ids:
      - local:content-component-binding
      - local:headless-content-management
      - local:contentful
      - local:figma
      - local:systems-analysis
    ownership: sole
    scope: individual
    delivery_stage: prototype
    provenance: self_report
    sources:
      - ref: "../sources/s009-ai-binding-walkthrough-2026-09-28.md"
        locator: "0:00:15 through 0:00:38"
        supports: The widget needed a way to connect content to a component when the names differ,
          such as a person's name and a card title.
    limitations:
      - This states the mapping problem. It does not show the widget shipping that mapping.
    public_disclosure: needs_review
    review:
      status: proposed
      reviewed_by: null
      reviewed_at: null
  - id: S009-E010
    statement: Solved the binding approach himself. The research reached a working approach for mapping
      content onto components.
    concept_ids:
      - local:content-component-binding
      - local:troubleshooting
      - local:ai-workflow-engineering
      - local:critical-thinking
    ownership: sole
    scope: individual
    delivery_stage: prototype
    provenance: self_report
    sources:
      - ref: "../sources/s009-account-2026-09-28.md"
        locator: "yes, solve it"
        supports: He says one of the big things he did with this research was solve it.
    limitations:
      - Solved is his judgment. There is no benchmark, and the approach is not shipped.
    public_disclosure: needs_review
    review:
      status: proposed
      reviewed_by: null
      reviewed_at: null
  - id: S009-E011
    statement: Programmed the binding agent himself with Mastra, OpenAI, and LLMs.
    concept_ids:
      - local:programming
      - local:ai-workflow-engineering
      - local:mastra
      - local:openai
      - local:ai-system-fundamentals
    ownership: sole
    scope: individual
    delivery_stage: prototype
    provenance: self_report
    sources:
      - ref: "../sources/s009-account-2026-09-28.md"
        locator: "I use Mastra to do this, OpenAI, LLMs"
        supports: He says he used Mastra, OpenAI, and LLMs, and that the programming was his.
    limitations:
      - Model names beyond OpenAI, and the code, are not in a source file yet.
    public_disclosure: needs_review
    review:
      status: proposed
      reviewed_by: null
      reviewed_at: null
  - id: S009-E012
    statement: Shared the research inside the company many times. Other people took it and ran with it.
    concept_ids:
      - local:speaking
      - local:cross-functional-work
    ownership: sole
    scope: individual
    delivery_stage: prototype
    provenance: self_report
    sources:
      - ref: "../sources/s009-account-2026-09-28.md"
        locator: "shared that with many times other people"
        supports: He says he shared the research many times and other people inside the company took
          it and ran with it.
    limitations:
      - No names, dates, or artifacts of what those people shipped.
    public_disclosure: needs_review
    review:
      status: proposed
      reviewed_by: null
      reviewed_at: null
  - id: S009-E007
    statement: Could not ship the binding work because there was no acceptable place to store the
      metadata. The widget-only path was too narrow. He turned the research into actionable items for
      larger conversations about storing metadata, content types, and components, and still intends to
      bring it into the Contentful for Figma widget after that larger problem is solved.
    concept_ids:
      - local:semantic-metadata-design
      - local:binding-repair
      - local:systems-analysis
      - local:content-modeling
      - local:decision-making
    ownership: sole
    scope: individual
    delivery_stage: prototype
    provenance: self_report
    sources:
      - ref: "../sources/s009-account-2026-09-28.md"
        locator: "I didn't have any place to store that metadata"
        supports: He could not execute the work without a place to store the metadata, turned the
          research into items for larger conversations, and plans to bring it into the widget after
          that storage problem is solved.
    limitations:
      - Good and bad storage places are his judgment. The agreements are not inspected.
      - The widget integration is a plan, not a result.
      - Healing after either side changes stays the expected consequence from the walkthrough at
        0:04:23, not a logged repair.
    public_disclosure: needs_review
    review:
      status: proposed
      reviewed_by: null
      reviewed_at: null
  - id: S009-E008
    statement: The binding work remains an unshipped prototype.
    concept_ids:
      - local:prototyping
      - local:technical-prototype
    ownership: sole
    scope: individual
    delivery_stage: prototype
    provenance: self_report
    sources:
      - ref: "../sources/s009-account-2026-09-28.md"
        locator: "I am going to roll this into my contentful for Figma widget"
        supports: He has not executed the ship. Bringing it into the widget is still ahead of him.
    limitations:
      - Unshipped is his account of the current boundary, not a release record.
    public_disclosure: needs_review
    review:
      status: proposed
      reviewed_by: null
      reviewed_at: null
concept_proposals: []
---
# S009: AI binding research

Captured: September 21, 2026
Status: Working title as of September 27, 2026. Innovation prototype. Learnings are real; he calls it a successful research project. Not integrated into Contentful for Figma; safe metadata storage is still unresolved. September 28, 2026 walkthrough transcript adds natural size, intent, and entry inspection; it does not show code or a stored metadata sample.
Evidence: Scott's direct account, plus his spoken walkthrough transcript. No code, metadata samples, or evaluation results inspected.

## Resume connection

- Role record: [R001 — Senior Product Architect](../roles/R001-contentful-senior-product-architect.md). Scott places this work in his latest Contentful role; exact project dates pending.
- Employer: [C001 Contentful](../employers/C001-contentful.md)
- Parent / intended integration: [S008 Contentful for Figma widget](S008%20-%20Contentful%20for%20Figma%20widget.md). This is a bounded AI exploration supporting that product, not evidence that its AI capabilities are already shipped.
- Related presentation / prototype context: [S010 Berlin prototype exploration](S010%20-%20Berlin%20prototype%20exploration.md). Scott says he presented this binding work there; the broader Berlin project remains to be narrated.
- Walkthrough transcript, kept separate so this record stays the summary: [S009 walkthrough, September 28, 2026](../sources/s009-ai-binding-walkthrough-2026-09-28.md). Open it for the spoken detail. Do not treat it as the project account.
- September 28 account, kept separate: [S009 account, September 28, 2026](../sources/s009-account-2026-09-28.md). Open it for what he said about solving the approach, sharing it inside the company, the storage blocker, and building it with Mastra and OpenAI.
- Customers / clients: None named. Contentful is the employer and platform; Figma is the design platform, not a newly established customer or client engagement.

## Resume summary

I built an agent that maps Contentful fields onto Figma components when the names don’t match, using real entries to judge size and intent. A name-only pass failed, and it still isn’t in the widget.

## Account summary

<a id="source-account"></a>

On September 27, 2026 he set the working title to **AI binding research**. He calls it an **innovation prototype**: the learnings are real, and he treats it as a successful research project. It remains a prototype, not an integration into the shipped widget.

Faithful summary of Scott's September 21 account, not a quotation:

Scott wanted Contentful for Figma to be AI first: an LLM should connect a Contentful content type to a visual component. For example, a person's name could map to a card's title and their role to its subtitle. Although such mappings can look obvious to a person, his initial attempts revealed that the model lacked enough context to infer them reliably.

He isolated the binding problem into its own project and iterated repeatedly until he found a consistent approach. The important discovery was the need for semantic metadata on both sides. In the content models he was working with, property names and data types did not provide sufficient descriptions of what each property meant or was intended for. This describes the context available in his experiments; it is not an independently verified claim that Contentful cannot support descriptions.

He loaded many content entries and used their examples to derive metadata about individual properties and the content type as a whole: meaning, intent, relationships to other types, and its place in the system. Much of that context could be inferred from actual entries. How the inference was automated, reviewed, and stored is still to clarify.

He applied the same approach to the component side, which he says worked even better. Examples available through use of the widget exposed intended use and typical content sizes, alongside extremes and maximum sizes. A useful distinction was the normal or comfortable amount of content a design should accommodate versus its outer limits. His design judgment was to handle extremes while encouraging ordinary content lengths, avoiding unnecessary overdesign of components. The exact representation of size metadata is not yet specified.

With richer context on both sides, Scott reports highly consistent binding results. He also explored repair after one side changed: inspect downstream effects and results, then have an agent clean up affected bindings or related state. He describes the repair as getting very close to correct, not perfect. The change types, repair boundaries, review steps, and evaluation method remain unrecorded.

The exploration raised a broader product question: this semantic metadata could be valuable as durable information in an AI-first content repository, rather than only as temporary context for a binding task. Scott believes Contentful itself should have a place for it. The work stalled at integration because he has not resolved an appropriate, safe place to store the information. He intends to include it in a future Contentful for Figma iteration after solving that problem; this is a plan, not a shipped result.

Scott presented this work successfully, in his assessment, during the Berlin event. Presentation reception and the separate end-of-week presentation are recorded in S010 so the technical experiment and event account remain distinct.

## Useful original wording

> “the LLM has no idea how to do this without having more context”

> “I had isolated the project onto its own and I just kept iterating and iterating until I figured out how it could do it consistently”

> “its meaning and intent within the system”

> “You don't want to over design your components.”

> “there should just be a place”

## Workflow as described

1. Attempt AI mappings from structured content fields to visual component inputs.
2. Isolate the problem and investigate inconsistent results through repeated iterations.
3. Load content entries and derive property-level and content-type-level semantic context.
4. Derive equivalent component context from examples, including intent and typical content sizes.
5. Supply context from both sides to support more consistent binding.
6. Explore the consequences of changes and agent-assisted repair.
7. Demonstrate the work in Berlin.
8. Pause product integration pending a safe metadata persistence approach.

## Ownership and scope

- Scott: problem isolation, iterative investigation, metadata approach on both sides, binding and repair experiments, the programming, and presentation, as described in his accounts.
- Scott clarified that he did the entire research effort and prepared the presentation himself. On September 28, 2026 he said he programmed the agent with Mastra, OpenAI, and LLMs. Prompts, schema, and the code are not in a source file yet.
- Intended users: people connecting structured Contentful content to Figma components; actual user testing or adoption of this AI capability is not established.
- Delivery boundary: S008 is a public widget; S009 is an experimental capability not yet integrated into it.

## Outcomes, evidence, and limitations

- Scott reports highly consistent bindings after adding semantic context and near-correct agent-assisted repair. No numerical success rate, sample count, benchmark, or inspected artifact supports these observations yet.
- The account supports a learning about missing context and the value of examples; it does not establish the effectiveness of every proposed metadata field independently.
- Safe storage is unresolved: Scott says existing data-storage agreements restrict persistence to Figma or Contentful; he cannot introduce his own database. The agreements themselves have not been inspected. See the dated addition below.
- The broader metadata repository is a direction he is arguing for inside the company, not an adopted Contentful roadmap commitment.

## Follow-up queue

- Exact project and Berlin dates; duration of the isolated exploration.
- Metadata sample and how generated metadata was checked. Mastra and OpenAI are named; prompts and code are not saved. Short-bio and case-study examples are captured below.
- Evaluation: number and diversity of types/components, remaining failure cases, and what counted as a correct mapping or repair.
- Where experimental metadata lived; feasibility of Figma storage versus native Contentful metadata; progress of the internal storage conversation.
- Available code and a metadata sample. The September 28, 2026 walkthrough transcript is stored; the final video is the S009 presentation asset. Permission to share the video beyond this workspace is still his call.

## Candidate uses

Potential technical portfolio case or interview account about making binding dependable, connected to S008's shipped product but clearly labeled as unshipped exploration. Berlin can provide presentation context once its account and artifacts are captured. No polished application copy created.

## Addition — September 21, 2026: progressive context, storage, and ownership

Faithful summary of Scott's follow-up account:

### Two mapping examples

| Example | Missing context | Metadata that improves the choice | Intended mapping |
|---|---|---|---|
| Person content type → card | Minimum/maximum field limits do not establish a comfortable everyday content length. A full biography can make a card excessively large. | Typical or average content size suitable for the component: its “good running speed.” No particular statistical calculation was specified. | Choose **short bio** rather than **bio** for the card. |
| Case study → card | **Challenge** and **outcome** may have similar amounts of text, so length alone cannot distinguish them. | The card's purpose: introduce the case study and invite exploration without revealing the answer prematurely. | Choose **challenge** rather than **outcome** for this card's purpose. |

Scott describes these as examples of progressively improving predictability and mapping quality as more information becomes available. The first adds typical size; the second adds intent when size cannot resolve the choice. These are purpose-specific examples, not universal rules that every card must hide outcomes. No per-example success rates or test artifacts have been supplied.

### Storage boundary and product conversation

Scott says strong existing agreements about safe data storage mean he can persist this information only in **Figma or Contentful**, not in a separate database of his own. The integration decision is therefore between storing it in Figma and gaining support for native metadata storage in Contentful. This clarifies the earlier unspecified storage blocker; it does not establish the exact agreement language or an approved implementation.

He is contributing to a conversation about enabling this metadata, and reports that others have independently encountered the same need. His desired direction is durable metadata alongside the Contentful content type. In the spoken account he also names Figma while describing this native-storage idea; the precise platform proposal should be clarified before turning it into a specific product recommendation. “Contemple” in the transcript is interpreted as Contentful from context.

### Personal ownership

Scott explicitly states that he did the research behind the scenes, developed the solution described here, and put together the presentation himself: “I did the whole thing.” Audience size and reported feedback are captured in [S010](S010%20-%20Berlin%20prototype%20exploration.md). This clarification supersedes the earlier uncertainty about who owned the research and presentation, without assigning ownership of other participants' work to Scott.

## Presentation

Blurb: I isolated AI binding into its own prototype and added semantic metadata on content and components so mappings stay consistent, including repair when one side changes. It is not in the shipped widget.

Video: 765cv4GCgMRSzVd8QCmUHW

- value: Prototype
  label: Not in the widget
- value: Both sides
  label: Content and components

## Addition — September 28, 2026: walkthrough transcript

Faithful summary of the spoken walkthrough. The full transcript, with timestamps, is [stored separately](../sources/s009-ai-binding-walkthrough-2026-09-28.md).

<a id="source-walkthrough"></a>

He frames the work as an AI binding agent for the Contentful for Figma widget: map a person entry onto a card when the names differ, such as name to title. A first pass that trusted those names failed. Results were unreliable even for name and title, and the model could not choose bio or short bio for a description, because the inputs were too thin.

He then gave the agent examples already sitting in the widget, plus Contentful entries. Field maximums were not the same as natural size, and Figma components had no maximums. He concluded that about 100 characters fit a card, and roughly the same length on the person. After that, short bio versus bio and the description mapping started to make sense to the agent. “Nine times out of ten” is his impression in the recording, not a counted result.

A case study broke the size rule. Challenge and outcome can be a similar length. For a preview card he wants the challenge, not the outcome, and he says that is what he chose every time he populated those cards in Figma. He asked the agent what each side thinks its fields are for. With that intent, he says the results became predictable. The agent also read raw JSON on entries and suggested bindings he had not been seeking, including telephone numbers stored in those fields. He does not treat that storage as a good model; he treats the suggestion as evidence the agent was reading real entries.

The open problem in the walkthrough is where the metadata lives. Recomputing it on every binding is too slow. Once it is stored, binding is straightforward, and the same agent can heal mappings after either side changes. That healing is a consequence he expects, not a demonstrated repair log.

## Addition — September 28, 2026: solved approach, company sharing, and the build

Faithful summary of his [September 28 account](../sources/s009-account-2026-09-28.md). The source file keeps his words.

He says he solved the binding approach. That is his judgment. It is not a benchmark, and it is not shipped.

He shared the research many times inside the company. Other people took it and ran with it. He does not name them, date the conversations, or record what they shipped.

He could not execute the ship because there was no acceptable place to store the metadata. Some places were good and some were bad, in his judgment. The widget-only path was too narrow. The storage problem needed a larger solution. He turned the research into actionable items that contributed to larger conversations about storing metadata, content types, and components. He still intends to bring the work into the Contentful for Figma widget after that larger metadata problem is solved.

He did the programming himself, using Mastra, OpenAI, and LLMs. The code is not in a source file yet.
