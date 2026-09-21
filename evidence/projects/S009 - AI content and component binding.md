# S009: AI content and component binding

Captured: September 21, 2026
Status: Working experimental capability; integration into Contentful for Figma pending safe metadata storage
Evidence: Scott's direct account; no code, metadata samples, evaluation results, or presentation artifacts inspected

## Resume connection

- Role record: [R001 — Senior Product Architect](../roles/R001-contentful-senior-product-architect.md). Scott places this work in his latest Contentful role; exact project dates pending.
- Employer: [C001 Contentful](../employers/C001-contentful.md)
- Parent / intended integration: [S008 Contentful for Figma widget](S008%20-%20Contentful%20for%20Figma%20widget.md). This is a bounded AI exploration supporting that product, not evidence that its AI capabilities are already shipped.
- Related presentation / prototype context: [S010 Berlin prototype exploration](S010%20-%20Berlin%20prototype%20exploration.md). Scott says he presented this binding work there; the broader Berlin project remains to be narrated.
- Customers / clients: None named. Contentful is the employer and platform; Figma is the design platform, not a newly established customer or client engagement.

## Account summary

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

- Scott: problem isolation, iterative investigation, metadata approach on both sides, binding and repair experiments, and presentation, as described in his account.
- Scott clarified that he did the entire research effort and prepared the presentation himself. Model/provider, code stack, prompts, schema, tools, and iteration count remain unspecified.
- Intended users: people connecting structured Contentful content to Figma components; actual user testing or adoption of this AI capability is not established.
- Delivery boundary: S008 is a public widget; S009 is an experimental capability not yet integrated into it.

## Outcomes, evidence, and limitations

- Scott reports highly consistent bindings after adding semantic context and near-correct agent-assisted repair. No numerical success rate, sample count, benchmark, or inspected artifact supports these observations yet.
- The account supports a learning about missing context and the value of examples; it does not establish the effectiveness of every proposed metadata field independently.
- Safe storage is unresolved: Scott says existing data-storage agreements restrict persistence to Figma or Contentful; he cannot introduce his own database. The agreements themselves have not been inspected. See the dated addition below.
- The broader AI-first metadata repository is a product direction Scott proposes, not an adopted Contentful roadmap commitment.

## Potential relevance to Figma role

Inferred relevance: diagnosing an AI failure as a context problem; connecting content semantics and design-system intent; using real examples to inform mappings and content sizing; exploring agent-assisted maintenance; and recognizing data stewardship as a constraint on shipping. These are candidate themes, not independently verified outcomes.

## Follow-up queue

- Exact project and Berlin dates; duration of the isolated exploration.
- Metadata sample, model/tool stack, and how generated metadata was checked; short-bio and case-study examples are captured below.
- Evaluation: number and diversity of types/components, remaining failure cases, and what counted as a correct mapping or repair.
- Where experimental metadata lived; feasibility of Figma storage versus native Contentful metadata; progress of the internal storage conversation.
- Available code, demo, screenshots, presentation, and permission to share them.

## Candidate uses

Potential technical portfolio case or interview account about making AI dependable through semantic context, connected to S008's shipped product but clearly labeled as unshipped exploration. Berlin can provide presentation context once its account and artifacts are captured. No polished application copy created.

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
