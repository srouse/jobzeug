# How I built Bulk Edit

Spoken transcript from `How I Built BulkEdit in Contentful.srt`, saved September 29, 2026. Related project: [S002 Contentful Bulk Edit App](../projects/S002%20-%20Bulk%20Editor.md).

The words below are the export. Repeats, false starts, and caption errors are kept.

**0:00:00** So this is BulkEdit. It's a Contentful application that is now the most popular

**0:00:04** app in the Contentful marketplace. It started as a prototype I built in just

**0:00:08** a day or two for a prospect with a very specific problem.

**0:00:11** I ultimately demonstrated it to two prospects,

**0:00:13** and we closed both of those deals. At the time,

**0:00:16** I was a solutions specialist. I worked alongside our solution engineers,

**0:00:19** typically coming in after the initial demo to build deeper,

**0:00:22** more specialized, maybe more designed solutions. In this case,

**0:00:26** the prospect was selling condos, and prices were changing frequently.

**0:00:29** They needed to find dozens of entries that share a particular attribute,

**0:00:31** like square footage, and update the same value across all of them,

**0:00:35** like price. Essentially, they needed something that behaved more like Excel than a traditional

**0:00:39** list of content entries. So that's what I built.

**0:00:42** What I'm going to show you is the presentation I gave to the second

**0:00:44** prospect. For this version, I also brought in the interface I used built for

**0:00:48** Demi, which is another project that's focused on creating entire demos via AI.

**0:00:53** I took that same interface and embedded it directly into BulkEdit,

**0:00:56** applying it to a different kind of complex task,

**0:00:59** making large-scale content changes quickly and consistently.

**0:01:02** So it's a really fun mix. So here's the demo.

**0:01:07** So this is just a walk, walkthrough of the bulk edit app merged with

**0:01:12** Demi and more importantly, with a robust edit mode,

**0:01:16** ui to it. So basically what this is is really just kind of the,

**0:01:20** the my own version of what the bulk edit app is that's not in

**0:01:24** the marketplace, but it shows all the content types on the left and then

**0:01:28** you kind of load up and you can see all the entries that are

**0:01:30** within there and clearly at scale this has to work a little bit differently

**0:01:33** but, but the main idea is I dropped it into DIMI.

**0:01:38** So we have our workbench over here on the right and I created just

**0:01:41** two or three simple AI functions in order to just kind of figure

**0:01:47** out what to do within this context. So all I'm going to do is

**0:01:50** just put in this pre-filled prompt that says the track fuel bike models have

**0:01:54** been changed to fire. So find them and change them.

**0:01:57** And what's going to happen is it's going to first go through and do

**0:02:00** a search and find all the things that are relevant to that particular statement

**0:02:04** and then it's going to go one by one and start editing these and

**0:02:07** you can see that the interface is now changing real-time relative to these prompts

**0:02:11** coming back and doing the thing that I asked to do which is pretty

**0:02:15** cool. So I had this bike that was called Fuel and I wanted to

**0:02:18** change it to Fire and I can accept or decline it here and have

**0:02:21** a really clear idea of what's happening and just like cursor I can actually

**0:02:25** do that on the entry level or if I'm really confident I can actually

**0:02:29** do it on the global level. It's a little bit more weird here just

**0:02:32** because there's other side effects that can happen that you really probably want to

**0:02:35** look at. One of the more fun things that happens here is someone actually

**0:02:39** put that into their bio, and if the search was a little bit more

**0:02:42** abstract, there's probably a good chance that I wouldn't even have found this,

**0:02:45** for instance, without AI in the mix. So this is a really great example

**0:02:48** of how AI can kind of expand, but it's also a really interesting example

**0:02:52** of how you can balance kind of user and AI agency as well.

**0:02:56** So for some reason, it thinks that the slash has something to do with

**0:02:59** the fire models, And I would definitely just decline it.

**0:03:02** It's not really part of the game with this particular concept.

**0:03:06** And I could probably tighten up the AI functions themselves.

**0:03:10** But that's just what happens. So anyway,

**0:03:13** I just want to share this. I think this is kind of an interesting

**0:03:15** next step and a place that I've taken to my as well just to

**0:03:18** make sure that people have agency. And I also think kind of the more

**0:03:21** holistic approach to this also makes it really interesting because I can kind

**0:03:26** of directly edit these things as well but that's just kind of part of

**0:03:29** what Falk edit brings to the table as well.

**0:03:32** But I do think it's like a much more interesting kind of foundation for

**0:03:34** the way that AI works as well.

**0:03:40** And references work too, which is really cool.
