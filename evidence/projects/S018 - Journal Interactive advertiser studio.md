---
schema_version: "1.1"
project_id: S018
title: Journal Interactive advertiser studio
record_kind: project
project_origin: employment
ranking_eligible: true
exclusion_reason: null
parent_project_id: null
related_project_ids:
  - S017
role_links:
  - id: R022
    relationship: delivery
    status: confirmed
    note: Preserved canonical association from the project account; role-source date caveats remain in
      the role record.
employer_links:
  - id: C014
    relationship: delivery
    status: confirmed
    note: Employer association recorded in the project account.
customer_ids: []
client_ids:
  - CL001
  - CL002
year: 2001
year_basis: estimated
year_note: Estimated as 2001 within R022 (2001–2002); a representative year, not a confirmed delivery date.
delivery_stage: unknown
annotation:
  status: reviewed
  vocabulary_version: 1.0.0
  reviewed_by: Codex
  reviewed_at: "2026-09-26"
public_disclosure: restricted
evidence:
  - id: S018-E001
    statement: Designed and built an interactive Flash restaurant map for the Water Street district.
    concept_ids:
      - local:front-end-development
      - local:interaction-design
      - local:visual-interface-design
      - local:flash
    ownership: contributor
    scope: external_audience
    delivery_stage: unknown
    provenance: self_report
    sources:
      - ref: "#source-account"
        locator: Account summary
        supports: Designed and built an interactive Flash restaurant map for the Water Street district.
    limitations:
      - Sponsoring organization and release artifacts are not established.
    public_disclosure: restricted
    review:
      status: approved
      reviewed_by: Codex
      reviewed_at: "2026-09-26"
  - id: S018-E002
    statement: Worked directly with advertiser clients on studio web projects and contributed
      implementation and design-process input to the Art Museum site.
    concept_ids:
      - local:customer-facing-work
      - local:front-end-development
      - local:cross-functional-work
    ownership: contributor
    scope: external_audience
    delivery_stage: unknown
    provenance: self_report
    sources:
      - ref: "#source-account"
        locator: Account summary
        supports: Worked directly with advertiser clients on studio web projects and contributed
          implementation and design-process input to the Art Museum site.
    limitations:
      - Scott explicitly did not design the Art Museum site.
      - Named client disclosure is not cleared.
      - The modern Trostel website is not the historical deliverable.
    public_disclosure: restricted
    review:
      status: approved
      reviewed_by: Codex
      reviewed_at: "2026-09-26"
concept_proposals: []
---
# S018: Journal Interactive advertiser studio

Captured: September 25, 2026
Status: Expanded Scott account (Art Museum ownership + Trostel Square identified)
Evidence: Scott's direct account; org research on linked clients is separate from contribution claims

## Resume connection

- Role record: [R022 — Web Developer/Designer](../roles/R022-journal-sentinel-web-developer.md) at [C014 Milwaukee Journal Sentinel](../employers/C014-milwaukee-journal-sentinel.md). Journal Interactive / **2001–2002** (year-only on LinkedIn).
- Employer: [C014 Milwaukee Journal Sentinel](../employers/C014-milwaukee-journal-sentinel.md) — in-house web studio serving **JSOnline advertisers** (lightweight sites and interactive pieces for people who advertised on the paper’s digital property).
- Collaborators: Department/studio teammates not named. Scott: heavy **design** involvement; **client contact from day one**.
- Clients (delivery for Advertiser / Milwaukee businesses — **CL**, not CU):
  - [CL001 Milwaukee Art Museum](../clients/CL001-milwaukee-art-museum.md) — **implementation team** + **influenced design process**; **did not design** the site
  - [CL002 Trostel Square](../clients/CL002-trostel-square.md) — [liveattrostel.com](https://www.liveattrostel.com/) (earlier “truffle square” mishear); current site ≠ 2001–2002 artifact
  - **Water Street** — designed and built an **interactive Flash map** of restaurants in the district (confirm sponsoring org / BID when known)
  - **Multiple real estate agencies** — names not yet listed
  - Other “prominent Milwaukee businesses” — unnamed in this pass
- Related: [S017](S017%20-%20JSOnline%20ad%20system%20installation.md) is **internal** JSOnline ad-platform install — different project. Interactive **games within ads** still a third, uncaptured project.

## Resume summary

I designed and built interactive client sites and pieces for Journal Interactive advertisers, including early client contact and Flash map work for Milwaukee businesses.

## Account summary

<a id="source-account"></a>

Scott worked in a Journal Interactive **department that built websites for advertisers on JSOnline** — effectively a **consulting / client studio** inside the newspaper: relatively **lightweight** sites, but for **interesting local clients**.

Examples he named:

- **Water Street:** designed and made an **interactive Flash-based map** showing restaurants in that Milwaukee district.
- **Trostel Square** ([liveattrostel.com](https://www.liveattrostel.com/)): client among the advertiser/real-estate-adjacent work (earlier speech-to-text “truffle square”). **Do not** treat the modern marketing site as the 2001–2002 deliverable.
- **Real estate agencies** and other prominent Milwaukee businesses (some still unnamed).
- **Milwaukee Art Museum:** part of the **implementation team**; **influenced the design process**; **did not design** the site.

Through-line he emphasizes: **client contact from day one**, plus substantial **design** involvement on studio work generally — Art Museum specifically is implement + design influence, not design ownership. Self-taught early career (see S017 framing) applies as context for initiative; do not invent stack or metrics.

## Useful original wording

> “I actually worked in a department that created websites for people that wanted to advertise on JS Online.”

> “essentially was kind of a consulting shop that just made relatively lightweight websites”

> “I did it for a number of really interesting clients such as Water Street. I made an interactive flash-based map that showed all the various different restaurants there. Designed and made that”

> “as well as truffle square, I'll have to look that up”

> “as well as a number of real estate agencies and things like that”

> “from day one I've had client contact”

> “I was also involved in the Milwaukee Art Museum redesign”

> “A lot of very prominent Milwaukee businesses. I was very heavily involved in doing a lot of design work.”

> “Milwaukee art museum. I was part of the team that implemented it and also influenced the design process, but I didn't actually design it.”

> URL for Trostel Square: https://www.liveattrostel.com/

## Workflow as described

1. Advertisers on JSOnline engage Journal Interactive for lightweight web presence / interactive pieces.
2. Scott designs and builds client work (Flash map for Water Street restaurants; other sites).
3. Ongoing client-facing contact while delivering.
4. Milwaukee Art Museum: **implement** with the team; **influence** design process; **not** the designer of record.

## Ownership and scope

- Scott: design + build on named examples (Water Street map explicitly designed and made); broad design involvement across the studio; client contact.
- Art Museum: **implementation team member** + **design-process influence**; **not** the visual/design owner.
- Trostel Square: named via current URL; historical deliverable details TBD.
- Studio/department owned the advertiser offering; Scott was inside that shop.

## Potential relevance to Figma role

- Early **client-facing** delivery (consulting muscle before SE/CIA eras).
- Design ownership on interactive web (Flash map) — transferable craft, not Figma.
- Civic / prominent local brands (museum, district, multifamily) as portfolio texture when disclosure allows.
- Honest ownership language (implement + influence vs design) — model for citation discipline.
- Do not retrofit AI or Figma.

## Follow-up queue

- Water Street sponsoring org.
- Remaining real estate agency names (disclosure).
- Art Museum: any artifacts; ship timing vs Calatrava pavilion.
- Trostel: what shipped in 2001–2002 vs today’s site.

## Open questions / next detail needed

1. Water Street client/org identity.
2. Which client names are cleared for public copy (default: **not cleared**).

[Project index](INDEX.md) · [Role index](../roles/INDEX.md) · [Client index](../clients/INDEX.md) · [Workspace guide](../README.md)
