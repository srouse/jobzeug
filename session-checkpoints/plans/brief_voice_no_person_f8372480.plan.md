---
name: Brief voice no person
overview: "Change the focus-brief voice so summaries talk only about the project and the job lines in front of the model: no first person, no third person, and no name."
todos:
  - id: agent-voice
    content: "Rewrite the focus-brief agent Voice section: no first person, no third person, no name; the project connects to the job lines."
    status: completed
  - id: prompt-voice
    content: Replace the prompt's third-person ban with the same rule so the message does not override the agent.
    status: completed
isProject: false
---

# Brief voice: the project and the posting

The summary should read as a case about the work, not as something the candidate wrote and not as a bio. Subject is the project and the job lines already in the message.

## Voice

In [src/mastra/agents/jobzeug-focus-brief.ts](src/mastra/agents/jobzeug-focus-brief.ts), replace the third-person ban in the Voice section. Today it only says not to write in the third person and not to say "Scott", "he", or "his", which leaves "I" open.

- No first person (`I`, `my`, `we`). The brief must not sound like the candidate wrote it.
- No third person and no name (`Scott`, `he`, `his`, or any stand-in for the person).
- Talk only about what is in front of the model: the project, what it shows and reveals, and how that work connects to and makes the case for the job lines in the message.
- Drop "No pitch". Making the case from the work is the point. Keep no biography and no hedging.

The project-focus and job-line-focus openings stay structurally the same (project leads with the project and the requirement; a job line still opens on that requirement). Both should describe the project connecting to the line, not a person doing the work.

## Prompt

[src/lib/focus-brief.ts](src/lib/focus-brief.ts) repeats `Do not use third person` at the end of `focusBriefPrompt`. That line would override the agent. Replace it with the same rule: no first person, no third person, no name; the sentences are about the project and the job lines only.

The schema description on `paragraph` stays about length, bold names, and the job-line opening. It does not set voice.
