# AI Binding Agent Research for Contentful Widgets

Spoken transcript exported September 28, 2026 from `VIDEOS/BindingAI/AI Binding Agent Research for Contentful Widgets.srt`. Related project: [S009 AI Component Binding](../projects/S009%20-%20AI%20binding%20research.md).

The words below are the export. Repeats, false starts, and caption breaks are kept.

**0:00:00** Okay, so this is the walkthrough of the AI binding agent research

**0:00:05** that I did.

**0:00:11** Okay, so this is a walkthrough of the AI binding research that I did.

**0:00:15** So as a part of the Contentful for Figma widget that I was creating,

**0:00:18** I needed to figure out how to connect content to a component.

**0:00:24** Have kind of different names and different ideas as to how things should work.

**0:00:27** A card component has a title, where a person within content has a name,

**0:00:32** for instance. And we just need to map those together so that I can

**0:00:35** load in that person and actually have that populate that component.

**0:00:39** So at first, I thought this was a fairly easy thing to do.

**0:00:41** So I thought, well, you know, it's kind of fairly descriptive what a title

**0:00:44** is on a component and what a name is on content or a person.

**0:00:48** So I thought that AI would actually have a fairly easy time of doing

**0:00:51** this. Well, it turns out it doesn't.

**0:00:53** And it's primarily because it is so simple. There isn't anywhere near enough information

**0:00:57** for it to make predictable connections between the two.

**0:01:01** And here you can see that the description is really where it kind of

**0:01:04** expressed itself. Now, I was getting really squirrely results at that point as well,

**0:01:08** in that, you know, I could even get name and title connect with that

**0:01:11** simple of a, Of a presentation, but it also had no idea whether or

**0:01:15** not the bio or the short bio was actually the appropriate answer to the

**0:01:19** description. So I actually took it to the next step.

**0:01:23** And I said, okay, well, let's start looking at examples of these things.

**0:01:26** Because within my components, I actually have instances that I've populated with content because

**0:01:30** of the widget. Let's give that to AI and have it figure out what

**0:01:34** is the relative size of these things. Things. Maybe that's a good way to

**0:01:37** start talking about this. Because we did have sizes or maximums within the

**0:01:42** content. So rich text within bio is kind of pretty big,

**0:01:46** and the short bio is relatively small.

**0:01:49** But what is the actual natural size of these things?

**0:01:51** Maybe that will be really interesting. And especially on the component,

**0:01:54** there is no max sizes within Figma. So I looked at the examples and

**0:01:58** I sussed out all of this information. I figured out that about 100 characters

**0:02:02** is what made most sense for a card, and I also figured out that

**0:02:06** on the person side, that's roughly about the same as well. And I was

**0:02:08** pulling in entries from Contentful and coming up with this information.

**0:02:12** And then ultimately, everything started to click here. So I actually was easy for

**0:02:15** the AI to figure out what the difference between the short bio and the

**0:02:19** bio. And it also figured out that the description was a great landing place

**0:02:22** solely by the nature of what. Size made sense.

**0:02:25** And this really makes sense intuitively. So, this is really ultimately the component is

**0:02:29** defining what is a good size or a container for this stuff

**0:02:34** to fit in. So, nine times out of ten, this is actually a really

**0:02:37** good idea, and this actually answers the question really well.

**0:02:40** However, I got to this. So,

**0:02:42** I wanted to put a case study into a component.

**0:02:44** And here, I could actually have similar information for the Challenge or the outcome.

**0:02:49** So there's a little bit different of a question that's happening here in the

**0:02:53** sense that I probably don't want to have a whole bunch of cards out

**0:02:56** there which are kind of previews or you know links into the larger case

**0:03:01** study. I don't want the outcome out there, I don't think. I want the

**0:03:03** challenge, and that should be something that's fairly intuitive.

**0:03:06** And in fact, when I was populating these within my widget,

**0:03:09** within Figma, I was in fact choosing the challenge.

**0:03:12** Every time. So I took it one step further and I asked the agent

**0:03:15** to go back and start talking about what these things meant.

**0:03:19** So not only was I looking for what the natural size of the content

**0:03:22** was, but I also wanted to figure out: okay,

**0:03:24** well, what does this component think its title is doing?

**0:03:27** What does the description think it's doing? And the same thing on the other

**0:03:30** side as well. And you could even kind of talk about,

**0:03:33** you know, the intent. Well, the outcome is the thing that's.

**0:03:36** The reason why we put this thing together, so we could even go so

**0:03:40** far as to say, well, we probably don't want that kind of flagging out

**0:03:43** there. We want the challenge to kind of seed people or kind of get

**0:03:46** people to come in that way. So once I got out to this point,

**0:03:49** all of a sudden, the agents just lit right up and they were doing

**0:03:53** very predictable results. And even more so,

**0:03:57** they were doing things because I had them looking at the entries.

**0:04:00** They're looking at things like JSON fields, which were just raw information in there,

**0:04:04** and actually pulling information out of there. Because it saw it consistently,

**0:04:07** they saw entries with consistent entries like telephone numbers within some of these.

**0:04:12** Not a great way to format things, but it was still found,

**0:04:14** and it actually suggested those as answers for binding,

**0:04:17** which was so far beyond what I was hoping that it would do,

**0:04:20** which is really great. And then at the end of the day,

**0:04:23** really, the biggest problem is where do you put this? Information because it shouldn't,

**0:04:25** you know, it's going to take a long time to get these every single

**0:04:27** time. So, that metadata is really the primary problem because once you have it,

**0:04:31** this whole binding thing becomes super elegant.

**0:04:34** And in fact, the really big thing is you can actually start healing at

**0:04:38** this point, too. So, systematically, we really want people to be able to change

**0:04:42** and think about changing either side as quickly and easily as possible.

**0:04:47** And that's ultimately what this. Agent,

**0:04:49** it's going to be really, really good at. So, it's going to be able

**0:04:51** to come in and actually heal these things afterwards, too,

**0:04:53** which is a really great side effect of getting this thing to work.
