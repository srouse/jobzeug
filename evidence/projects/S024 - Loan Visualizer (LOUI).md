---
schema_version: "1.1"
project_id: S024
title: Loan Visualizer (LOUI)
record_kind: project
project_origin: employment
ranking_eligible: true
exclusion_reason: null
parent_project_id: null
related_project_ids:
  - S021
role_links:
  - id: R007
    relationship: delivery
    status: confirmed
    note: Scott placed this on the Summit design-innovation role (UX Designer & Web/Mobile Developer -
      Design Innovation), not the later Experience Designer tenure.
employer_links:
  - id: C003
    relationship: delivery
    status: confirmed
    note: Summit Credit Union employment. Members are users of the credit union, not a separate
      customer or client record.
customer_ids: []
client_ids: []
year: 2019
year_basis: estimated
year_note: Project calendar was not supplied. Estimated inside R007 (Aug 2018–Nov 2019); 2019 is a
  representative year within that tenure, not a reported start or end.
delivery_stage: prototype
annotation:
  status: reviewed
  vocabulary_version: "1.1.0"
  reviewed_by: Scott
  reviewed_at: "2026-09-27"
public_disclosure: needs_review
evidence:
  - id: S024-E001
    statement: Led the client-side work and built the entire React and D3 interface of custom, mostly
      canvas-rendered charts for comparing fixed-rate and ARM mortgages. The interface did not ship.
    concept_ids:
      - local:front-end-development
      - local:react
      - local:javascript
      - local:prototyping
      - local:technical-prototype
      - local:interaction-design
      - local:visual-interface-design
      - local:financial-services
    ownership: lead
    scope: single_team
    delivery_stage: prototype
    provenance: self_report
    sources:
      - ref: "#evidence-e001"
        locator: Account summary — interface
        supports: Scott built the whole interface in React with custom D3 charts for mortgage comparisons
          and says it did not ship.
    limitations:
      - A backend developer, not Scott, supplied the interest-rate calculations the interface consumed.
      - D3.js is not in vocabulary 1.0.0; JavaScript is the closest approved tool tag.
      - Screenshots exist but were not inspected for this annotation.
      - No production release is claimed.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Scott
      reviewed_at: "2026-09-27"
  - id: S024-E002
    statement: Made a one-page paper sheet a loan officer could walk with a member through one mortgage
      or a side-by-side comparison of two or three, covering payments, overall cost, and interest.
    concept_ids:
      - local:interaction-design
      - local:visual-interface-design
      - local:prototyping
      - local:financial-services
    ownership: lead
    scope: external_audience
    delivery_stage: prototype
    provenance: self_report
    sources:
      - ref: "#evidence-e002"
        locator: Account summary — one-page sheet
        supports: The sheet fits on one page, captures major mortgage themes, and was meant for a loan
          officer sitting with a member, including side-by-side comparisons.
    limitations:
      - Intended use by loan officers and members; ongoing use after the prototype is not claimed.
      - Auto loans and other payment products were out of scope.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Scott
      reviewed_at: "2026-09-27"
  - id: S024-E003
    statement: Tested the prototypes with real people alongside a UX tester and reported surprise at
      interest totals, the effect of small decisions, and differences in risk aversion versus risk-taking.
    concept_ids:
      - local:usability-testing
      - local:financial-services
    ownership: lead
    scope: external_audience
    delivery_stage: prototype
    provenance: self_report
    sources:
      - ref: "#evidence-e003"
        locator: Account summary — testing with real people
        supports: Testing with real people, a UX tester's involvement, and qualitative findings about
          surprise, small decisions, and risk posture.
    limitations:
      - Tasks, participant count, and the UX tester's method are not recorded.
      - Incredible results is Scott's characterization, not a measured outcome.
      - User-research was not tagged; a systematic research method is not described.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Scott
      reviewed_at: "2026-09-27"
  - id: S024-E004
    statement: Learned how fixed-rate and ARM mortgages work, including conversations with many mortgage
      VPs, as his first financial-services project at Summit.
    concept_ids:
      - local:technical-discovery
      - local:financial-services
    ownership: lead
    scope: organization
    delivery_stage: prototype
    provenance: self_report
    sources:
      - ref: "#evidence-e004"
        locator: Account summary — learning loans and mortgage VPs
        supports: He studied how loans work without a finance background and talked with many mortgage
          VPs; scope stayed on fixed-rate and ARM mortgages.
    limitations:
      - Which VPs, and what each conversation changed, are not recorded.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Scott
      reviewed_at: "2026-09-27"
  - id: S024-E005
    statement: Presented LOUI himself in many situations.
    concept_ids:
      - local:speaking
    ownership: lead
    scope: unknown
    delivery_stage: prototype
    provenance: self_report
    sources:
      - ref: "#evidence-e005"
        locator: Account summary — presenting
        supports: Scott presented the work himself in a lot of situations; other people also presented
          sometimes.
    limitations:
      - Audiences and reception are not itemized.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Scott
      reviewed_at: "2026-09-27"
  - id: S024-E006
    statement: The work surfaced a tradeoff about showing total interest payments, which staff found
      useful for members and also frightening, even when taking the mortgage was justified.
    concept_ids:
      - local:decision-making
      - local:financial-services
    ownership: lead
    scope: organization
    delivery_stage: prototype
    provenance: self_report
    sources:
      - ref: "#evidence-e006"
        locator: Account summary — what they chose to show
        supports: Internal discomfort with showing overall interest, and the argument that the house can
          still be worth those payments.
    limitations:
      - Discussions are described; a recorded decision to hide or show the figure is not.
      - Stakeholder-alignment was not tagged because agreement or adoption is not established.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Scott
      reviewed_at: "2026-09-27"
  - id: S024-E007
    statement: Scott says this mortgage learning was the basis for later innovation-team work and for
      Rates Central, which he does not think he could have done without it.
    concept_ids:
      - local:product-direction-influence
      - local:financial-services
    ownership: lead
    scope: organization
    delivery_stage: prototype
    provenance: self_report
    sources:
      - ref: "#evidence-e007"
        locator: Account summary — later work
        supports: His judgment that LOUI underpinned later innovation-team insight and S021 Rates Central.
    limitations:
      - The causal link is his account, not a decision record.
      - Rates Central is a separate project; this claim does not describe that build.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Scott
      reviewed_at: "2026-09-27"
  - id: S024-E008
    statement: Led a small cross-functional group in which a backend developer calculated interest so
      the interface matched Summit's rates, with a PM and a UX tester also involved.
    concept_ids:
      - local:cross-functional-work
      - local:coordination
    ownership: lead
    scope: single_team
    delivery_stage: prototype
    provenance: self_report
    sources:
      - ref: "#evidence-e008"
        locator: Resume connection — collaborators
        supports: Named roles of backend developer, PM, and UX tester, and that Scott led the client side
          while calculations aligned the interface to Summit interest rates.
    limitations:
      - Names are not given. The PM's scope is not described.
      - Scott did not author the rate calculations.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Scott
      reviewed_at: "2026-09-27"
concept_proposals:
  - label: D3.js
    category: tool
    definition: The D3.js library for custom data-driven charts, including canvas rendering.
    reason: Scott confirmed the mortgage charts were custom D3, mostly canvas-rendered. Vocabulary
      1.0.0 has React and JavaScript but no D3 concept, so E001 can only tag JavaScript.
---
# S024: Loan Visualizer (LOUI)

Captured: September 27, 2026
Status: Expanded same day; screenshots exist, video planned; interface charts confirmed as D3.js
Evidence: Scott's direct account, not yet supported by inspected artifacts

## Resume connection

- Role record: [R007 — UX Designer & Web/Mobile Developer - Design Innovation](../roles/R007-summit-design-innovation.md). Scott named this role explicitly (design innovation), not the later Experience Designer tenure. Source dates for the role are Aug 2018–Nov 2019. Project-specific months were not given. He says this was the **first thing he put together at Summit** and his **first time working in financial services**.
- Employer: [C003 Summit Credit Union](../employers/C003-summit-credit-union.md)
- Scope limit: **mortgages only** — fixed-rate and ARMs. Auto loans and other payment products were not part of this work.
- Users: credit-union **members** and **loan officers** who would sit with a member and walk the sheet. No separate customer or client org.
- Collaborators: Scott **led**. He **created most of the solutions on the client side** and **built the whole interface**. A **backend developer** (not named) helped with **calculations** so those numbers lined up with **how interest rates worked at Summit**. A **PM** was involved (role not further described). A **UX tester** worked with him (name not given). He **presented it himself in a lot of situations**; other people also helped present in some. He **talked with many mortgage VPs** to figure the subject out.

<a id="evidence-e008"></a>
- Customers / clients: none named.
- Later use: he says this knowledge was the basis for [S021 Rates Central](S021%20-%20Rates%20Central.md) in the later Experience Designer role, and that he does not think he could have done Rates Central without it.

## Resume summary

Led Loan Visualizer (LOUI), Summit’s mortgage visualizer: a React interface of custom charts plus a one-page sheet a loan officer could walk with a member. Tested with people, did not ship, and became the loan intuition behind later Summit work, including Rates Central.

## Account summary

<a id="source-account"></a>

Summary of Scott’s September 27, 2026 account (not a transcript). Formal name: **Loan Visualizer (LOUI)**. The letters **LOUI** expand to **Loan Object UI**. An earlier recollection that the letters might be LOUIU is superseded.

The innovation team did not start with a specific product goal or a required takeaway. The question was what would happen if **members** could understand a **loan** more quickly. Visualization was the shortcut for getting something dense into someone’s head. The subject was **mortgages** — **fixed-rate and ARMs** — not auto loans or other payment types.

Scott **led** it. He **created most of the solutions on the client side** and **built the whole interface**.

<a id="evidence-e004"></a>
<a id="evidence-e005"></a>

A **backend developer** helped with the **calculations** needed so the interface **aligned with how interest rates worked at the credit union**. A **PM** was on it; what that person owned is not described. A **UX tester** worked with him; that person is not named. Scott **presented it himself in a lot of situations**; other people also helped present in some. He talked with **many mortgage VPs** while figuring the domain out. It was his **first project at Summit** and his **first time in financial services**. A large part of the iteration was learning **how loans work**, because he did not have a finance background, and then finding how to visualize that structure.

<a id="evidence-e002"></a>

He landed on a **single sheet of paper** that **fits on one page** and **captures the major themes of a mortgage**. There was also an **interface**. The aim of the physical piece was that a **loan officer** could sit with a **member** and go through one loan, or maybe two or three. Visuals **compared loans side by side**: **monthly payments**, **overall** cost, **interest**, and related payment figures.

**Interface (Scott’s account):**

<a id="evidence-e001"></a> **React** and **[D3.js](https://d3js.org/)**. He first recalled the name as “J3,” then confirmed **D3**. The charts were **mostly canvas-rendered**, **idiosyncratic**, and **designed for these mortgage comparisons** — **all custom**, not a stock chart kit.

<a id="evidence-e003"></a>

They **tested with real people**. Scott describes **incredible results** and **stories**: surprise at how much interest they would pay or what the loan would cost, and how **small decisions** changed the outcome. No counts or study write-up were captured. He also used the interactions to **characterize** **risk aversion versus risk-taking**. The intent was guidance: if someone was taking too much risk, a loan might still be available, but the visual should show what **a little less risk** would mean. That is a purpose of the work, not a shipped risk model.

It **did not see the light of day**. Shipping was not the point. He calls it a **really big success** and **wide-ranging**. The knowledge was the first deep financial understanding he had at Summit, and the **basis for a lot of what the innovation team did later**: insights, and the team getting used to working together.

<a id="evidence-e006"></a>

**What they chose to show.** The work was used to decide **how to make products** and **what to show and not show**. He says people **inside the financial institution quickly became uncomfortable showing overall interest payments**. The figures are useful for the member and also **scare them** in a way that may not match the risk: in many or most situations there is a reason to take the house and pay a lot of interest, because the value is **immediate and necessary**. Those discussions are part of the outcome.

<a id="evidence-e007"></a>

**Later work.** He says he used this knowledge for [Rates Central](S021%20-%20Rates%20Central.md) in the later role, and that he does not think he would have been able to do that project without this one.

**What he will show.** The public-facing piece he plans to make a **video** of is the **interface and the sheet**. He **has screenshots** of both.

## Useful original wording

> “what would be the side effect of members… how would they benefit from being able to understand and get their head around a loan quicker?”

> “visualizations are one shortcut into getting something very dense into people's minds quickly”

> “I iterated many many times trying to one understand how loans work… and then two, what are the best ways to visualize this”

> “It was entirely my project… I led the project. I mostly created the solutions and I entirely did the interface.”

> “I created the solutions mostly the client side. I built the whole interface… a UX tester… also a PM… I also presented this myself in a lot of situations… a backend developer who helped do some of the calculations… alignment with the way that interface works. The interest rates worked at the financial as well.”

> “React and a bunch of visualization tools… I think it was J3… mostly Canvas rendered idiosyncratic charts… all custom.”

> “The short name was LOUI. Loan Object UI.”

> “the first thing that I put together working for Summit and the first time working for a financial.”

> “everyone within the financial got a little uncomfortable with showing the overall interest payments.”

> “not as risky as it seems… there's a reason why you want to have a house and pay a lot of interest payments because the value is so immediate and necessary.”

> “the basis for a lot of what the innovation team did later”

> “the basis for me doing the Rates Central project… I wouldn't have been able to do that without doing this, I think.”

> “This is all about mortgages, so fixed-rate and ARMs.”

> “The sheet does fit on a single page and captures all the major themes within a mortgage.”

> “I'm going to make a video about… the actual interface and the sheet. I have screenshots of those.”

## Ownership and scope

- Scott: lead; most of the client-side solutions; the entire interface (React and the D3 charts); presented it himself in many situations; the one-sheet direction; side-by-side mortgage comparisons; conversations with mortgage VPs; reading risk posture from how people used it.
- Backend developer: calculations so the interface matched how Summit interest rates worked. Not described as owning the interface.
- PM: involved. Scope of that role not described.
- UX tester: worked with Scott. Not described as owning the solution or the interface.
- Others: helped present in some situations.
- Loan officers: intended users of the sheet with members, not authors of the artifact.
- Not claimed: production release, auto or non-mortgage loans, or a named test metric.

## Follow-up queue

- UX tester’s name, only if it should be on the record.
- Screenshots and the planned video, when he wants them attached.

## Candidate uses

Interview and portfolio piece for leading a mortgage-understanding prototype: custom React charts, a one-page loan-officer sheet, member testing, and the organizational argument about showing total interest. Do not claim a shipped product or quantified test results. The thing he plans to show is the interface and the sheet. Connect forward to Rates Central as prior domain learning, not as the same project.

## Addition — September 27, 2026 (later the same day)

Scott corrected the short name to **LOUI / Loan Object UI**, said he **led** and **entirely owned the interface**, limited the subject to **fixed-rate and ARM mortgages**, named mortgage-VP conversations and a UX tester, described internal discomfort with showing total interest, tied **Rates Central** to this learning, and said screenshots of the sheet and interface exist for a video he will make. He confirmed the chart library is **D3.js**.

## Addition — September 27, 2026 (roles)

Scott clarified the split: he created **most of the solutions on the client side** and **built the whole interface**; he **presented it himself in a lot of situations**. A **backend developer** did calculations so the interface aligned with **how interest rates worked at Summit**. A **PM** and a **UX tester** were involved. Names were not given.
