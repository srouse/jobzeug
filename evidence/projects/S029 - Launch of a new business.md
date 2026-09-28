---
schema_version: "1.1"
project_id: S029
title: Launch of a new business
record_kind: project
project_origin: employment
ranking_eligible: true
exclusion_reason: null
parent_project_id: null
related_project_ids:
  - S028
role_links:
  - id: R010
    relationship: delivery
    status: confirmed
    note: Scott placed this under OpenHomes. One catch-all for the launch. Do not split the pitch,
      prototype, website, agency setup, or hardware exploration unless he asks.
employer_links:
  - id: C007
    relationship: delivery
    status: confirmed
    note: OpenHomes is the company he helped start. The incubator is gener8tor on the employer
      record; he called it Generator. It is not a customer or client.
customer_ids: []
client_ids: []
year: 2013
year_basis: estimated
year_note: The account does not date the work. 2013 is the gener8tor summer cohort year already on
  C007, inside the R010 tenure (June 2013–August 2014).
delivery_stage: mixed
annotation:
  status: reviewed
  vocabulary_version: "1.5.0"
  reviewed_by: Scott
  reviewed_at: "2026-09-27"
public_disclosure: needs_review
evidence:
  - id: S029-E001
    statement: Took part in the incubator pitch and figured out how OpenHomes could operate as a
      regulated real estate agency, including how listing information got into the product.
    concept_ids:
      - local:product-strategy
      - local:persuasion
      - local:technical-discovery
      - local:real-estate
    ownership: contributor
    scope: organization
    delivery_stage: production
    provenance: self_report
    sources:
      - ref: "#source-account"
        locator: Account summary — starting the company and the idea
        supports: He was in the pitch, and he says he figured out the regulated agency path and how
          to get listing information in. They were a functioning agency the whole time.
    limitations:
      - He does not want other people on the company recorded, so sole-founder ownership is not claimed.
      - 3% versus 6% is his account, not a measured commission result.
      - Funding amount is not in this account. A separate employer citation of $180,000 is not this claim.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Scott
      reviewed_at: "2026-09-27"
  - id: S029-E002
    statement: Designed and built a live home-search application, including an iOS feel-prototype
      and a working site with weighted search and location search.
    concept_ids:
      - local:programming
      - local:interaction-design
      - local:visual-interface-design
      - local:prototyping
      - local:production-release
      - local:ios
      - local:real-estate
    ownership: lead
    scope: external_audience
    delivery_stage: production
    provenance: self_report
    sources:
      - ref: "#source-account"
        locator: Account summary — what he built
        supports: iOS prototype, live search website, weighted search, location search, and his
          statement that everything was live and working. Design responsibility was fully his.
    limitations:
      - “Live video” remains his unclear wording and is not a separate product claim.
      - Weighted and location search have no approved concept. This is not semantic search.
      - Artifacts exist and were deferred to presentation. They were not inspected.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Scott
      reviewed_at: "2026-09-27"
  - id: S029-E003
    statement: Designed a simpler version of door-opening hardware. That work stalled because the
      resources to build the hardware never arrived.
    concept_ids:
      - local:hardware-product-design
    ownership: contributor
    scope: organization
    delivery_stage: concept
    provenance: self_report
    sources:
      - ref: "#source-account"
        locator: Account summary — hardware
        supports: He tried to design a simpler version. It did not ship.
    limitations:
      - The simpler version is not described as built or shipped.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Scott
      reviewed_at: "2026-09-27"
concept_proposals: []
---
# S029: Launch of a new business

Captured: September 27, 2026
Status: Catch-all account; he does not want this talked through deeply. Same-day addition: the product and the agency were live; hardware stalled; artifacts wait for presentation.
Evidence: Scott's direct account, not yet supported by inspected artifacts

## Resume connection

- Role record: [R010 — CTO, Designer & Web/Mobile Developer](../roles/R010-openhomes-cto.md). Source dates: June 2013–August 2014. Scott said to put this underneath OpenHomes.
- Employer: [C007 OpenHomes](../employers/C007-openhomes.md).
- Customers / clients: none. He named Generator, a local entrepreneurial incubator. The employer record already identifies that program as **gener8tor** (summer 2013 cohort). It is not a buyer or a hired client, so no CU/CL record.
- Related: [S028 Startup design consulting](S028%20-%20Startup%20design%20consulting.md) is the Earthling catch-all he places just after OpenHomes. Separate employment. Do not merge them.

## Resume summary

I helped pitch and start OpenHomes inside a local incubator, then owned an iOS prototype, a home-search site, and a lower-commission agency. I also designed a simpler door-hardware version, which stalled for lack of resources.

## Account summary

<a id="source-account"></a>

Summary of Scott’s September 27, 2026 account (not a transcript). He asked for a catch-all. He does not want to talk too deeply about this one. Title he asked for: **the launch of a new business**.

**Starting the company.** They got into **Generator**, which he describes as a local entrepreneurial incubator and a very big deal. They **pitched and created the company within a week or two**. He was **involved in the pitch**. Getting into the incubator was **the main goal**. After that they **got some funding** and were **off and running**. He does not state an amount. The employer record separately cites 2014 regional coverage of $180,000 in seed financing; that figure is not part of this account.

**The idea.** Take care of the **middle layer**, the **back and forth**, so people could **go directly into homes that were for sale**, using **technology to open the door** and **the application**. Also **be a real estate agency** that **charged much less**: **3% versus the usual 6%**. It was **heavily regulated**. They had to **play ball with that** and **be an actual real estate agency**. He says he **figured all of that out**, including **how to get the information in**.

**What he built.** He made a **prototype in iOS** that gave people the feel for what OpenHomes was supposed to be. He made what he called a **“live video”** and a **website that allowed you to search for homes**. Treat that phrase as his wording; it is unclear whether “live video” is its own piece or a description of a live site. He **played around a lot with weighted searches**: if two bedrooms is really important, you could search based on that weight. He figured out **location-based searching**. The website had to **connect to the sources of this information**.

**Design.** This was the **first time** he took **a hundred percent of the responsibility of designing**. He calls that great and super fun.

**Hardware.** He was **involved in some hardware exploration** as well. They **did not have quite enough runway** to make it into the **larger idea**. On the same day he added that the hardware **stalled** because they **did not get the resources needed to make the hardware**. His part was **trying to design it and make a simpler version of it**. That simpler version is not described as shipped.

**What it became.** It **turned into just another real estate agency**, for a lot of reasons. He says startups are difficult. What he counts as success: he was **firsthand in a difficult real estate agency domain and startup**, he **made the actual application**, and they **figured out how to validate this and get it to move forward**. He later said **everything was live, everything was working**, and they were **a functioning real estate agent the whole time**. Read that as the application and the agency, not the hardware.

**LinkedIn difference.** The R010 LinkedIn description says a marketplace that connects buyers and sellers **without an agent**, and that he owned every technical and design aspect **except the logo**. This account says they had to **be** a real estate agency at a lower commission, and that they **were a functioning real estate agent the whole time**. Prefer this account for how the company operated. The LinkedIn sentence stays a source claim; this account does not rewrite that profile text. Design responsibility here is fully his; the LinkedIn “except the logo” line is not restated in this account.

## Useful original wording

> “a bit of a catch-all because I don't want to talk too deeply about this one”

> “title this the launch of a new business”

> “we got into Generator, which is a local… entrepreneurial incubator, which is a very big deal”

> “we actually pitched and created the company within a week or two. I was involved in the pitch”

> “a prototype in iOS that gave people the feel for what open homes was supposed to be”

> “take care of all that middle layer, all that back and forth so that people could actually go directly into homes that were for sale, using some technology to open the door”

> “a real estate agency that also charged much less… 3% versus the usual 6%”

> “heavily regulated so we had to actually play ball with that and we had to be an actual real estate agency and I kind of did all of that”

> “I made a live video. Website that actually allowed you to search for homes.”

> “weighted searches so if two bedrooms is really important to you you could actually search based on that weight”

> “the first time I kind of took a hundred percent of the responsibility of designing”

> “we got some funding after that as well”

> “ultimately it turned into just another real estate agency”

> “I succeeded in that I made the actual application. We actually figured out how to validate this”

> “involved in some hardware exploration… we ultimately just didn't have quite enough runway to make it into the larger idea”

> “Don't worry about who else was in there. We're not going to go into those details.”

> “Yes, everything was live. Everything was working. And we were a functioning real estate agent the whole time.”

> “The hardware just kind of stalled because we didn't quite get the resources we needed to make the hardware. But I was involved in just trying to design it and make a simpler version of it.”

> “yes, I have artifacts and we'll deal with that when it gets to the presentation stage.”

## Ownership and scope

- Scott: in the pitch; iOS prototype; figuring out regulated listing information and how to operate as an agency; home-search website, including weighted search and location search; design, which he says was fully his for the first time; designing a simpler version of the hardware, which stalled.
- He says the application and the agency were live and working the whole time. He does not want other people on the company recorded.
- Not claimed: he founded it alone, he closed the funding, a measured commission result, or that the door-opening hardware shipped.
- The larger idea did not get the resources. He says the company became another real estate agency.

## Follow-up queue

None. On September 27, 2026 he said not to record who else was involved. Artifacts exist; attach them at presentation time, not in this capture.

## Candidate uses

Interview account of starting a regulated marketplace: incubator pitch, first full design ownership, a live home-search application with weighted and location search, and a functioning real estate agency. Hardware was a simpler design that stalled for lack of resources. Do not cite 3% versus 6% or the funding as verified outcomes. Do not use the LinkedIn “without an agent” line against this account. Do not split this into separate projects unless he asks. Artifacts wait for the presentation. Do not retrofit Figma or AI; this is 2013–2014 work.
