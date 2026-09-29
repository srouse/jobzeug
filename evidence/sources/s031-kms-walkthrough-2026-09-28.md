# Building a Knowledge Management System with Contentful

Spoken transcript exported September 28, 2026 from `VIDEOS/KMS/Building a Knowledge Management System with Contentful.srt`. Related project: [S031 Knowledge Management System (KMS)](../projects/S031%20-%20KMS%20demo.md).

The words below are the export. Repeats, false starts, and caption errors are kept.

**0:00:00** Okay, so this is just a brief walkthrough of a knowledge

**0:00:05** management system built with Contentful and a couple other pieces of the puzzle just

**0:00:09** to kind of show all the various things that Contentful brings to the table

**0:00:13** when you do want to put together a knowledge management system.

**0:00:16** So I'm going to show three particular parts to this.

**0:00:19** So one is the aggregation, so you have content all over the place.

**0:00:22** So I'm going to show one particular technique. Using Firecall so that we can

**0:00:25** pull that information in and give it a place to land.

**0:00:27** Contentful can store lots of data, so it makes a lot of sense for

**0:00:30** us to kind of store even that first phase within Contentful as well.

**0:00:34** And that's just going to be a raw, you know, pre-formed content.

**0:00:37** The next phase is to take that and put it into well-formed content.

**0:00:40** So I'll show you how our content model looks.

**0:00:43** You want to put a little bit more, intelligence into that and a little

**0:00:45** bit more guidance into how you want that content to look.

**0:00:48** But ultimately, that's really where Contentful comes in and really flexes its muscles because

**0:00:52** that allows you to actually use workflows,

**0:00:54** AI actions, as well as a number of other things.

**0:00:57** And then finally, we're going to take that content and we're going to actually

**0:00:59** going to use it. So we're going to put it into a chatbot and

**0:01:02** using semantic search and various other things,

**0:01:04** we can actually present this content in a way that's really,

**0:01:06** really interesting. So let's kind of put together the pieces of the puzzle first

**0:01:10** here. So this, demo is made up of,

**0:01:13** various, three various things. So there's going to be a couple of Contentful apps

**0:01:17** that are installed. So one is a Firecrawl Contentful app.

**0:01:20** Again, that's going to be the way that we get the information in here.

**0:01:23** There's a KMS demo one, which is essentially going to do all kinds of

**0:01:27** various things and kind of surface our agent in all the various places within,

**0:01:31** the contentful. So we can just do things a little bit more contextually,

**0:01:34** but it's also going to allow us to actually create that chatbot at the

**0:01:37** end of the game as well. And you'll see clear examples of that as

**0:01:40** well. we also have a content model that we built up and this is

**0:01:43** going to be very small. There's not going to be a lot of content

**0:01:45** here. I really want to make sure that it's clear that, that we're actually

**0:01:48** using the content that we're, we're processing here,

**0:01:51** but I've created a couple of, specific content types.

**0:01:53** So there's operating and operational procedure and troubleshooting.

**0:01:56** These are, you know, we're going to be using technical docs.

**0:01:58** So these are just a really interesting place for this information to land.

**0:02:02** We also have a Firecrawl import, which is where we're going to store that

**0:02:05** information from Firecrawl. So that's kind of our raw material that we capture and

**0:02:09** centralize. Then we also have a, just an FAQ because that's going to be

**0:02:12** the easiest way for us to express what we're doing.

**0:02:14** It's just a question and answer at the end of the day.

**0:02:17** And then I also have a, a master studio,

**0:02:20** agent working behind the scenes as well. And it has a whole series of

**0:02:22** things or workflows happening here. and this is really going to run real time

**0:02:26** and I'll show that while we're doing this. And ultimately it's going to take

**0:02:29** that raw information. It's going to process that into questions or into FAQs as

**0:02:34** well as our more structured content types.

**0:02:37** And really this is the kind of the brain behind it all.

**0:02:39** It will have some idea of what's going on in Contentful,

**0:02:41** have some idea of the information that we're bringing in,

**0:02:44** but it's also going to do some really interesting things like trigger workflows as

**0:02:47** well as assess these FAQs and allow us to actually choose

**0:02:52** whether or not to fast forward some of these answers directly into publishing

**0:02:57** or have some actually kind of stop and,

**0:03:00** and allow humans to actually review. So this is really going to really wear

**0:03:03** a lot of the brains and a lot of the, the meat of what

**0:03:05** this entire process looks like is happening.

**0:03:08** So let's go ahead and start making this. So I'll just kind of give

**0:03:10** you a, a look at what the Firecrawl application looks like.

**0:03:14** I'm not going to do this real time, but you can get an idea

**0:03:17** that all we really want to do, upload a file,

**0:03:19** give it a URL, you can give it a, you know,

**0:03:22** really big website and it can kind of pull in a lot of information.

**0:03:24** This is really kind of the workhorse of just getting this stuff in here.

**0:03:27** the interesting thing is that we, you know, because we're Contentful,

**0:03:30** we actually can store that asset here. So that gives Firecrawl a URL to

**0:03:33** use because Firecrawl is primarily with, URLs.

**0:03:36** But once we have it here, we can actually give it that asset URL

**0:03:38** and it has somewhere to, to crawl, which is really cool.

**0:03:41** So I happen to have just a couple of these in here. I have

**0:03:43** a Plat technician or plant technician and outage management.

**0:03:47** So we're kind of off and running. We've got the beginnings to the raw

**0:03:49** stuff. Stuff that we have in here, and if we look at our content

**0:03:53** at this stage of the game, you'll see that we actually have some imports

**0:03:56** in here. And if you look at here, this is just kind of the

**0:03:58** raw stuff. You can't really do a whole lot with this,

**0:04:00** but it has the uploaded documents. It has some summary information and the results

**0:04:04** itself is really the, the magic that Firecrawl does,

**0:04:06** which is makes this ready for AI to,

**0:04:09** to then do something with. So it's all marked down.

**0:04:11** That's, that's within there. So let's do something with this.

**0:04:16** So I'm going to go into our Firecrawl import again,

**0:04:18** and this is where this little helper is going to come in.

**0:04:21** So this is another Contentful app that just kind of plops right into the

**0:04:25** middle of the context. I happen to be focused directly on this import file.

**0:04:29** So I'm just going to go ahead and hit process the import.

**0:04:32** If we go back to master studio, you'll see that it's running.

**0:04:35** And all I really did was just call this thing.

**0:04:37** From behind the scenes and, and what it's doing now is,

**0:04:41** you know, creating some questions and then it comes in and create some answers.

**0:04:44** And it's actually happening real time over here, which is pretty interesting.

**0:04:46** You see that it made the questions first and then came in and answered

**0:04:49** them. It's now working on these other entries that we are.

**0:04:53** So these are the, the well-structured content types that we created beforehand.

**0:04:57** And it's filling those things out. And then it's also assessing them,

**0:05:00** which is a part of the very important very last part of this.

**0:05:03** So this assessment is actually another piece of the puzzle.

**0:05:06** I have very intentionally made some bad FAQs, so I actually have a part

**0:05:09** of this puzzle that actually says, hey, let's make one that's not very good.

**0:05:12** And it, of course, will not score very well every time. Primarily because I

**0:05:15** really just want to show how this triggers what Contentful can do.

**0:05:18** So now we have all this stuff. All of this is the end result

**0:05:21** of this one file that we imported.

**0:05:24** And if we go back to our home page, home screen now, or go

**0:05:27** back to our content screen, I mean to say, you'll see that we have

**0:05:30** FAQs that are active, and so we have two of those.

**0:05:33** And they are actually actively translating the answers,

**0:05:36** so they're actually not published quite yet. But it's because they passed that they

**0:05:39** actually triggered this translate answer. And if we walk in here,

**0:05:42** you'll see that we have a whole workflow,

**0:05:44** or actually it just finished before I clicked in here,

**0:05:46** but, but ultimately here we have it in French and ultimately it just triggered

**0:05:50** that FAQs, without review, because it cascaded into the translation as well.

**0:05:55** And if we look at the review one, you'll see that it is actually

**0:05:57** paused, and it's halfway through the process because something about the assessment said,

**0:06:02** something's a little bit off here, you might want to take a look at

**0:06:04** this. And so there's someone who can just come in here,

**0:06:06** create these shortcuts, and just take a look at these, and just basically,

**0:06:09** massage it, or even kind of play around with it.

**0:06:11** They can also bring back your, you can actually bring back your agent here

**0:06:15** and say, you know, change X to Y or whatever,

**0:06:18** if you know what's going on, and this can actually come in and,

**0:06:21** and, and kind of round out or fix whatever it is that's happening within

**0:06:25** there. and then it will automatically kind of trigger that review and go all

**0:06:27** the way through as well. But, but you can see here now that we

**0:06:30** have, like, the full mechanics of Contempla. This is where it gets really interesting.

**0:06:33** Once you start getting into the, the structured content,

**0:06:36** then all of a sudden it starts feeling like an interesting place to kind

**0:06:39** of deal with, pushing things into production that are ready to be presented in

**0:06:43** various ways, as well as catching those that are not,

**0:06:45** and allowing them to be, to get through a process that,

**0:06:48** is very common and, and, natural to what Contempla can do.

**0:06:51** So let's bring it to the last piece. So let's actually do something with

**0:06:54** this content. and you can see here that we have.

**0:06:57** A couple of FAQs. I'm not going to actually let that other one go

**0:07:00** through. we also have some operational procedural procedures,

**0:07:05** so let's just take a little bit of content here.

**0:07:07** I'm going to ask about an HFC equipment,

**0:07:09** but I'm going to open up the final application that does something with it.

**0:07:14** And this is very intentionally, simple.

**0:07:16** so I'm just going to say, Hey, Thank you. What is HFC

**0:07:22** equipment? And what's happening now is I'm utilizing all those things,

**0:07:26** all of our API endpoints. so we're actually doing a semantic search now,

**0:07:29** so I'm looking for all those things that are related to this.

**0:07:32** We found an FAQ. We found, you know, another object within the procedural object

**0:07:37** that we made for the content model, and we found both of those.

**0:07:40** Now, I also asked the agent to come up with an answer,

**0:07:42** so it did kind of put it together. It's a little pithy,

**0:07:45** you know, so it's kind of trying to get you to the endpoint,

**0:07:47** but interestingly, you still have this really well-structured content.

**0:07:50** So, AI, yeah,

**0:07:52** you can kind of walk around and kind of learn things this way,

**0:07:54** but very specific, well-structured,

**0:07:57** content is much, much better at giving much better structured,

**0:08:01** context to things. So you can actually, you know, not only tell people what's

**0:08:04** going on, but if you actually want to know a little bit more or

**0:08:06** actually need to learn something, this is where this comes into play.

**0:08:09** But the really fun thing is, like, obviously here, there's all kinds of structure

**0:08:12** that we're bringing to the table because it's in Contempla,

**0:08:14** because we took it and we put it into a predictable format,

**0:08:17** we now can have a predictable expression of what it is,

**0:08:20** and we now can actually kind of take that content that was kind of

**0:08:24** in, in clay and, and, and produce it in a way that actually can

**0:08:28** plug into any number of different ways. So this is just an example of

**0:08:31** how you can actually apply AI to it to come up with really great

**0:08:35** context-specific answers, but also take it and actually present it at that next level

**0:08:39** with highly structured content. So that is a walkthrough of an example

**0:08:44** of how Contempla can play ball within a content management system process.
