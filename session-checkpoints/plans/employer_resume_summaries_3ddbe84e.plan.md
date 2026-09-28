---
name: Employer resume summaries
overview: Rewrite project resume summaries so an employer understands the work and wants to open the video, and lock that job into the project skills so the next capture writes the line itself.
todos:
  - id: skills
    content: Add the employer-facing resume-summary contract to add-project, annotate-project, and compress-to-contentful.
    status: completed
  - id: s009
    content: Replace the S009 Resume summary with the two-sentence agent line.
    status: completed
  - id: others
    content: Rewrite other Resume summary sections that are labels, caveats, or third person; leave the article-voice ones that already fit.
    status: completed
  - id: publish
    content: Compress and push so the Contentful project summaries match.
    status: completed
isProject: false
---

# Employer-facing resume summaries

The line under **Resume summary** is what an employer reads. Compress copies the first paragraph into the Contentful project `summary` ([scripts/contentful/compress.mjs](scripts/contentful/compress.mjs), cap 420 characters). On a focused project it sits directly above the **Details** button, which opens the video ([connection-hub.tsx](src/components/stage/answer-stage/connection-hub.tsx)). The same string is the card description when a project is cited.

S009’s current line fails that job. It repeats the title, then hedges (“innovation prototype”, “the learnings are real”) and never says what the agent does.

## The line

Two sentences, first person, under 280 characters. Voice model is the article summaries already in the repo, especially [S014](evidence/projects/S014%20-%20Design%20tokens%20Contentful%20blog.md), [S015](evidence/projects/S015%20-%20Understanding%20AI%20building%20blocks.md), and [S016](evidence/projects/S016%20-%20Technical%20debt%20Contentful%20blog.md): “I wrote…”, a concrete mechanism, plain words.

- Sentence one: what he did, specific enough that a stranger gets it.
- Sentence two: the sharp result or limit. When the project has a video (S001, S008, S009), that sentence is the reason to open it. Do not say “click” or “watch.”
- Stay inside that project file. No new metrics. No capture voice (“Scott describes”, “learnings are real”).

S009 becomes:

> I built an agent that maps Contentful fields onto Figma components when the names don’t match, using real entries to judge size and intent. A name-only pass failed, and it still isn’t in the widget.

## Skills

Write this contract once, then point at it.

- [add-project](.agents/skills/add-project/SKILL.md): when the project file is written, always add `## Resume summary` to this contract. It is part of capture, not a later polish pass.
- [annotate-project](.agents/skills/annotate-project/SKILL.md): if the account now says something the summary does not, rewrite that section to the same contract before finishing. Claims stay the matching layer. The summary stays the employer line.
- [compress-to-contentful](.agents/skills/compress-to-contentful/SKILL.md): say what the extracted line is for (employer, above Details). Compress still only copies it. It does not invent one.

## Existing projects

Every project file already has `## Resume summary`. Rewrite the ones that are a label, a caveat, or third person. Leave a summary that already matches the article voice and the length (S014, S015, and S016 are the check). Each rewrite uses only that file.

Then compress and push so the app shows the new lines. Do not change presentation blurbs; the modal is the video, and this line is the one above the button.
