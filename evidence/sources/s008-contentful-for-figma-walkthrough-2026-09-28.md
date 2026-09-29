# Contentful for Figma intro

Spoken transcript exported September 28, 2026 from `VIDEOS/ContentfulForFigma/CFW Intro (FINAL).srt`. Related project: [S008 Contentful for Figma Widget](../projects/S008%20-%20Contentful%20for%20Figma%20widget.md).

The words below are the export. Repeats, false starts, and caption errors are kept.

**0:00:00** to the Contentful Figma widget.

**0:00:03** This is a high-level overview showing how to log in,

**0:00:05** connect a Contentful space to a Figma file,

**0:00:08** and how to apply content. This basically means binding content types to Figma

**0:00:13** components, which allows you to load and ingest content.

**0:00:16** You can entries directly into your Figma design.

**0:00:19** Let's get started.

**0:00:20** Okay,

**0:00:21** let's log into Contentful and connect a space to our Figma file.

**0:00:26** To do that, all you have to do is drop the Contentful widget onto

**0:00:29** the canvas, click on the little gear icon,

**0:00:32** and it'll prompt you to sign in. It'll bounce you to a browser,

**0:00:36** and then you're going to go through the traditional OAuth process that we use

**0:00:39** for our Contentful apps. And it's going to hand off to you a transfer

**0:00:44** code, and this is going to allow you to transfer this session into your

**0:00:47** Figma, which will then allow you to do everything that your permissions

**0:00:52** allow within your own Contentful account.

**0:00:55** From there, you click on the edit, and you get to choose your organization

**0:00:58** space environment that you have access to. And here,

**0:01:00** I'm actually using an alias, which is a good idea because we're going to

**0:01:03** be putting content in a lot of different places,

**0:01:05** and this will allow you to follow the same best practices that you do

**0:01:08** for your own websites, and be able to flip the actual environment behind the

**0:01:11** scenes. So now we're connected.

**0:01:14** So now, let's bind and apply some content.

**0:01:24** bottom and we have a couple images at the top.

**0:01:26** And I've hooked it up so that the Contentful widget understands where content can

**0:01:30** go. For starters, I've, connected a component variable to connect to this text

**0:01:34** field. It happens to be called intro. I've also named this node header colon

**0:01:39** colon background dash image. This again communicates to the Figma widget that we can

**0:01:43** actually inject, content or assets into this background.

**0:01:47** I did the same thing with the logo so that we can get a

**0:01:49** Contentful asset to inject in there as well.

**0:01:51** So let's create our first binding.

**0:01:54** So I'm going to drop the Contentful widget onto the canvas.

**0:01:57** I'm going to select the frame and I'm going to attach it to it.

**0:02:01** So now we have what is a content map and it's telling you all

**0:02:04** the things that it understands it can put content into or create bindings about.

**0:02:09** So for instance, we have a component here. So it's purple.

**0:02:11** And so let's focus on that and see what happens.

**0:02:15** So here we have all the content types that we have within that space.

**0:02:18** We can now start connecting the dots and start telling the story of what

**0:02:22** happens when a blog post, for instance,

**0:02:24** is added to this component. So here are all the things that we've established

**0:02:28** within the component. We have our intro, row, which is the variable that I

**0:02:31** attached to that text field. We have the two back rows.

**0:02:34** Background images. Let's go ahead and attach the title to the intro.

**0:02:38** And then I also know that a blog post also has an editorial thumbnail.

**0:02:43** We have a bind button that jumped out and that's because we're actually referencing

**0:02:46** another entry called MediaWrapper. This is just a way to get some more metadata

**0:02:51** around our assets. We have to choose our actual asset and it's going to

**0:02:55** be this image that we're going to inject in there. And we know that.

**0:02:57** It's a Contentful asset. So we'll figure out how to get that in there

**0:03:00** for you. So we've got everything bound now.

**0:03:03** So let's do one more thing. So we have content and we also have

**0:03:06** modifiers. So modifiers are those things that are a little bit more unique to

**0:03:10** Figma, more unique to things about the design.

**0:03:13** So for instance, the booleans that turn things on or off,

**0:03:16** or also there's variants. For this,

**0:03:18** we know that we want to turn off the logo for instance,

**0:03:21** because we know that blog posts don't have logos.

**0:03:23** So let's just turn that off. So that every time that we inject a

**0:03:26** blog post, we're going to know that that's going to go away.

**0:03:29** So we're going to save it. So let's go ahead and start injecting some

**0:03:32** content. Now we don't want to do that into the component itself.

**0:03:35** That's not exactly what we're shooting for. So what we want to do instead

**0:03:38** is make a visual unit test. And a visual unit test is a thing

**0:03:42** that's going to sit next to your component and allow you to preview all

**0:03:45** the things that are happening with your, with your component in terms of variance.

**0:03:49** And in this particular situation, content, because we now have access to the content,

**0:03:53** we now see what real content will do with this component.

**0:03:56** This is really up in the game. So let's do this.

**0:03:59** So again, I'm going to drop the Contentful widget onto the,

**0:04:03** onto the stage. I'm going to select the frame and attach it.

**0:04:07** And I'm going to now focus on our instance.

**0:04:09** Thank you. And you can see here that our bindings have transferred,

**0:04:12** so it knows that it's an instance of that component.

**0:04:15** So the blog post bindings are here,

**0:04:17** and it's now going to now push me into the search for Contentful because

**0:04:21** it knows that it's not attached to an entry. And here we can now

**0:04:24** just start watching. We can start seeing what happens when we start applying the

**0:04:29** entry blog post into this component.

**0:04:32** And we can see right away just what we're doing. So,

**0:04:35** you know, my first impression is that the title doesn't have quite a lot

**0:04:38** of text into it, so maybe that font is a little bit small.

**0:04:41** But this is great. This is exactly when I want to be going through

**0:04:44** these kinds of decisions. And with real content involved,

**0:04:47** I actually get a much better feel for the real contour of what that

**0:04:51** content's going to look like, and I also can stay up to date very

**0:04:54** quickly. So this means that I can struggle with these decisions before I hand

**0:04:59** it off to the developer, before I actually see it on a production website

**0:05:02** and I start having these same hesitations. I can front load so much of

**0:05:06** this and avoid all of that downstream churn.

**0:05:09** This is the goal.
