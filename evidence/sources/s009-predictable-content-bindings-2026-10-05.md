# Using LLMs for Predictable Content Bindings

Spoken transcript exported October 5, 2026 from `VIDEOS/AI-Component-Binding/Using LLMs for Predictable Content Bindings.srt`. Related project: [S009 AI Component Binding](../projects/S009%20-%20AI%20binding%20research.md).

The words below are the export. Repeats, false starts, and caption errors are kept.

**0:00:00** So this is the AI Component Binding Project.

**0:00:03** So this project was focused on getting an LLM to connect content to a

**0:00:06** visual component. It's a part of my Contentful for Figma widget,

**0:00:09** which connects content to Figma components.

**0:00:13** And if you look at the bindings, you can see I have some for

**0:00:15** a blog post, case study, and then ultimately I'm just kind of connecting the

**0:00:18** dots and making these binding, binding mappings between the two.

**0:00:22** Now, what I wanted to do was get LLMs involved because a lot of

**0:00:25** this is fairly intuitive. There isn't a lot of ambiguity here.

**0:00:28** And if I could get an LLM to predictably make these kinds of matches,

**0:00:31** then not only could I speed up the initial binding,

**0:00:34** but I can also deal with healing. So if I want to change some

**0:00:37** property on here or vice versa within the content type,

**0:00:40** then I am not that afraid to actually propagate those changes through if I

**0:00:45** have AI to kind of connect those dots for me. I can feel a

**0:00:47** lot more freedom to actually do and make the changes that I want to

**0:00:51** make and make everything the best that I can. So that was the goal.

**0:00:54** Problem was, it's not that easy. So it's actually way too simple.

**0:00:58** So at the end of the day, an LLM probably knows what a title

**0:01:01** is on a card and the same thing for a person.

**0:01:04** But when I actually ran it, I got results that were unpredictable such as

**0:01:07** putting in the bio versus the short bio. Now,

**0:01:10** I know that the bio is way too long because I know what the

**0:01:12** content is, but there's no reason for the LLM to.

**0:01:15** So I took the LLM and I pointed it at, uh,

**0:01:17** some instances of the component and entries within the content type.

**0:01:21** And that's when things got to be really interesting.

**0:01:23** Now I can start generalizing. Well, how big is that title usually?

**0:01:26** How big is that short bio? And then all of a sudden there's a

**0:01:29** lot of hooks for LLMs to, to, to kind of figure out and make

**0:01:32** the right decision. And I got this to happen really predictably.

**0:01:35** Was it, which was great. I had a huge step up, but then I

**0:01:38** did the same thing for a case study and things kind of degraded because

**0:01:42** outcomes and challenges were about the same size,

**0:01:44** but a component of a card by its nature,

**0:01:47** you really just don't want to like spread the outcome everywhere.

**0:01:49** You want the challenge. You want to kind of entice people to come in

**0:01:51** and read the, the larger case study on a,

**0:01:54** on a more robust page. And that information just wasn't there.

**0:01:57** This is almost a, just a, only just a semantic layer that was missing.

**0:02:01** So I went back and actually started reading all those entries and instances again,

**0:02:05** and started producing this intent. Started talking about what does an image mean on

**0:02:08** this card, given what we're looking at here?

**0:02:10** Uh, same thing with the case study.

**0:02:13** What is an outcome versus a challenge? What's the goal? What's its relationship to

**0:02:16** the thing as a whole? And all of a sudden,

**0:02:18** everything snapped into place. It was huge. It was such a great thing to

**0:02:21** have a predictable way to connect the dots.

**0:02:23** Thank you. Bye. More importantly, it went even beyond that,

**0:02:26** and actually started looking within JSON fields and finding really interesting,

**0:02:30** consistent content within there, because again,

**0:02:32** it's looking at entries, real entries,

**0:02:35** and started connecting that to the card on the other side,

**0:02:37** which are really strong signals that maybe we hadn't actually designed the,

**0:02:40** the, uh, content type well enough to kind of predictably do that kind of

**0:02:43** stuff, which is wonderful. Uh, so I ended up actually presenting this to a

**0:02:46** number of people within Contentful, a couple of other people had actually gone down

**0:02:49** this path, but not quite as far as I did, so I accelerated that

**0:02:52** research, and also asked that larger question of,

**0:02:54** well, are we just making databases, or are we making kind of stores of

**0:02:58** intent? Like, where should this information go?

**0:03:01** If I need it, or I find it useful, some other people are probably

**0:03:03** going to find it useful as well, so maybe there's an interesting way for

**0:03:06** us to store that and put that somewhere in a way that's just not

**0:03:10** unique to my particular situation.

**0:03:12** So, this was a great example of just going down a rabbit hole,

**0:03:15** figuring out how it works, and having all these really positive side effects from

**0:03:19** sharing and advancing the idea.
