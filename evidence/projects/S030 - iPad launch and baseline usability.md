---
schema_version: "1.1"
project_id: S030
title: iPad launch and baseline usability
record_kind: project
project_origin: employment
ranking_eligible: true
exclusion_reason: null
parent_project_id: null
related_project_ids: []
role_links:
  - id: R012
    relationship: delivery
    status: confirmed
    note: Resume aggregate for the whole StudyBlue tenure. This project is that entire experience.
      R016 and R017 are its two phases, not extra jobs.
  - id: R017
    relationship: delivery
    status: confirmed
    note: He started as an iOS developer. Source dates September 2011–April 2012.
  - id: R016
    relationship: delivery
    status: confirmed
    note: Usability work and a more prominent voice. Source dates April 2012–November 2012.
employer_links:
  - id: C009
    relationship: delivery
    status: confirmed
    note: StudyBlue employed him. No external customer or client is named.
customer_ids: []
client_ids: []
year: 2012
year_basis: estimated
year_note: The account does not date the work. 2012 sits inside the R012 tenure (September 2011–November
  2012). The role record’s July 2012 iPad launch is a LinkedIn claim, not a date he stated here.
delivery_stage: production
annotation:
  status: reviewed
  vocabulary_version: "1.1.0"
  reviewed_by: Scott
  reviewed_at: "2026-09-27"
public_disclosure: needs_review
evidence:
  - id: S030-E001
    statement: Learned Objective-C on the job and rewrote the card flipper as a fully custom control
      because Apple’s default components could not do that interaction. It shipped in the iPad app
      and he says people used it heavily.
    concept_ids:
      - local:programming
      - local:front-end-development
      - local:interaction-design
      - local:production-release
      - local:product-adoption
      - local:ios
    ownership: lead
    scope: external_audience
    delivery_stage: production
    provenance: self_report
    sources:
      - ref: "#source-account"
        locator: Account summary — iPad and the card flipper
        supports: Custom rewrite, ship, and heavy use. He had not written Objective-C before this job.
    limitations:
      - “Used the hell out of it” is his characterization, not a measured usage figure.
      - “Some 5 million users” conflicts with the role record’s “nearly two million.” Neither is measured.
      - He was instrumental in the iPad release. Sole ownership of the whole app is not claimed.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Scott
      reviewed_at: "2026-09-27"
  - id: S030-E002
    statement: Raised a usability floor with practical checks that did not require formal tests,
      including buttons that did not look like buttons, and got designers and developers talking,
      which he ties to some code efficiencies.
    concept_ids:
      - local:interaction-design
      - local:visual-interface-design
      - local:persuasion
      - local:coordination
      - local:cross-functional-work
      - local:accessibility-principles
    ownership: lead
    scope: organization
    delivery_stage: production
    provenance: self_report
    sources:
      - ref: "#source-account"
        locator: Account summary — baseline usability
        supports: Baseline affordance checks, the button example, designer–developer communication,
          and a more prominent voice. He says raising that floor was a huge improvement.
    limitations:
      - These checks are not usability testing. No tasks, participants, or observations are described.
      - Accessibility here is his point that people were not thinking about it, plus recognizable
        controls. No audit or standard is claimed.
      - “I hadn’t influenced on everything” is ambiguous and is not read as ownership of every change.
      - Code efficiencies are unnamed.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Scott
      reviewed_at: "2026-09-27"
concept_proposals: []
---
# S030: iPad launch and baseline usability

Captured: September 27, 2026
Status: Catch-all for the whole StudyBlue experience. Same-day addition: the custom card flipper shipped and was heavily used; baseline checks were practical floor-raising fixes; the company later failed financially.
Evidence: Scott's direct account, not yet supported by inspected artifacts

## Resume connection

- Role record: [R012 — Head of Usability/Mobile Developer](../roles/R012-studyblue-usability-mobile.md). Source dates: September 2011–November 2012. Scott said this project should capture the entire StudyBlue experience.
- Phases, same employment: [R017 — Mobile Developer](../roles/R017-studyblue-mobile-developer.md) (September 2011–April 2012) and [R016 — Head of Usability](../roles/R016-studyblue-head-of-usability.md) (April 2012–November 2012). Do not count these as separate jobs.
- Employer: [C009 StudyBlue](../employers/C009-studyblue.md).
- Customers / clients: none named.

## Resume summary

Joined StudyBlue as an iOS developer without prior Objective-C, learned it quickly, and shipped a fully custom card flipper because Apple’s default components could not do that interaction. He also raised a usability floor — buttons that did not look like buttons — and got designers and developers talking.

## Account summary

<a id="source-account"></a>

Summary of Scott’s September 27, 2026 account (not a transcript). He asked for one project that captures the entire StudyBlue experience.

**How he got in.** He **started as an iOS developer**. He had **not ever written any Objective-C** before that. He had shown he could **learn very quickly**, at a time when **mobile developers were very high in demand**. He could **prove that he could learn quickly**, and he did. He was **off and running very, very quickly**.

**iPad and the card flipper.** There was **difficulty getting the iPad version into the market**. He was **instrumental in getting that to happen**, **even going so far as to rewrite from scratch the card flipper**. That flipper was **very unique** for them and **very important**, because **cards were central** to what they did. He later said what was wrong: they were **using too many of the default components that Apple shipped**, and those **weren’t designed for card flippers**, so they had to **make something completely custom**. **It did ship**, and **people used the hell out of it**. He said the product **was in the middle of it**; the repeated phrasing is unclear beyond the custom flipper sitting in the middle of that use.

**What the company was.** StudyBlue was **in education** and **allowed students to create study cards and research**. The **cards were really kind of central**. That company description is his. Do not import the employer record’s later Chegg acquisition as part of this account. He later said they had **some 5 million users at the time** and were **hugely successful until the market itself ultimately didn’t work out financially**. The role record still says **nearly two million** users. Both numbers are source claims. Do not pick one, and do not treat either as measured.

**The shift he describes next.** The spoken transition is unclear and is kept as wording: “What we did. Conversation started, which is the biggest problem. And then two figured out…” Read “two figured out” as likely “to figure out,” not a second person. Do not invent a meeting or a named collaborator from it.

**Baseline usability.** He figured out **really simple ways to measure the usability of pages**, based on **very simple concepts**. They **didn’t even have to test**. The measure was the **baseline affordance of buttons** and things like that. He says that at the time it was **pretty hard to think about**, or **very common for people not to think about accessibility** or even those simple things. He **brought all of that back into the mix** and got them to **some sort of baseline usability**. That forced him to **assess all the different pages** and come up with **really objective and persuasive ways** to **change and move the needle**. He also **became a much more prominent voice within the company** doing that.

He later called the checks **very melding, practical solutions**. Keep “melding” as spoken; the concrete example is what settles the meaning. **Buttons that didn’t look like buttons at all.** **Raising that floor** was a **huge improvement**. There were also **code efficiencies**, because he could **get the communication to happen between developers and designers**. He said **“I hadn’t influenced on everything.”** That can be heard as “I had an influence on everything” or as “I had not influenced everything.” Do not settle it. Either way, he does not claim he decided every change.

**LinkedIn difference, not merged.** R016 says he was the primary iOS developer, spearheaded an iPhone-to-iPad migration that launched in July 2012, was promoted to Head of Usability during that process, and implemented a user-driven loop of wireframing, prototyping, hallway testing, analytics, and interviews. This account agrees he started in iOS and was instrumental in the iPad release, and that he rewrote the card flipper. It does not date the launch, and it describes usability as **baseline affordance checks that did not require tests**, not as a testing-and-analytics loop. Keep both. Do not treat the LinkedIn process or the July 2012 date as confirmed by this account.

## Useful original wording

> “capture the entire experience”

> “I started out as an iOS developer. I had actually not ever written any kind of Objective-C before that”

> “mobile developers were very high in demand. And I could just prove that I could learn quickly. And I did. I was off and running very, very quickly.”

> “there's some difficulty in getting the iPad version of our application into the market. And I was instrumental in getting that to happen.”

> “rewriting from scratch, the card flipper that we had, which was very unique for us and very important”

> “the cards were really kind of central to the game. What we did.”

> “Conversation started, which is the biggest problem. And then two figured out really simple ways to kind of measure the usability of pages”

> “we didn't even have to test really, just what is the baseline kind of affordance of buttons”

> “it was actually very common for people not to think about accessibility”

> “really objective and persuasive ways to kind of change and move the needle”

> “I also became a much more prominent voice within the company doing that”

> “we were using too many of the default components that Apple shipped and they weren't designed for doing card flippers… we had to make something completely custom”

> “yes, it did ship and yes, people used the hell out of it”

> “We had some 5 million users at the time”

> “this product was in the middle of it”

> “they're just very melding, practical solutions”

> “some code efficiencies that were built in because I could get the communication to happen between developers and designers”

> “there's buttons. That didn't look like buttons at all… raising that floor up was a huge improvement”

> “I hadn't influenced on everything, and we were hugely successful until… the market itself just ultimately didn't work out financially”

## Ownership and scope

- Scott: learned Objective-C on the job; instrumental in the iPad release; a completely custom card flipper, because Apple’s default components could not do that interaction; it shipped and he says people used it heavily; practical baseline fixes such as buttons that did not look like buttons; getting designers and developers to communicate, which he ties to some code efficiencies; a more prominent voice.
- His user figure is **some 5 million**. The role record says **nearly two million**. Neither is measured here.
- Not claimed: he was the only iOS developer, a dated launch, a counted usage metric for the flipper, or that he decided every change.
- Company context he stated: an education product whose center was student study cards. He says it was hugely successful until the market failed financially.

## Follow-up queue

None.

## Candidate uses

Interview account of learning Objective-C under demand and replacing Apple’s default controls with a custom card flipper that shipped and was heavily used. Also an early usability story: raise the floor when buttons do not look like buttons, and get designers and developers talking. Do not cite a July 2012 launch, a testing-and-analytics loop, or either user count (5 million here, nearly 2 million on the role record) as a verified figure. Do not split the mobile start from the usability work unless he asks. Do not retrofit Figma or AI; this is 2011–2012 work.
