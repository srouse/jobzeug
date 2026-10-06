# AI-first Blueprints Design System Overview

Spoken transcript exported October 6, 2026 from `VIDEOS/blueprints-ai-design-system/AI-first Blueprints Design System Overview.srt`. Related project: [S001 Blueprints AI Design System](../projects/S001%20-%20Blueprints.md).

The words below are the export. Repeats, false starts, and caption errors are kept.

**0:00:00** So, Blueprints is an AI-first design system I created for my team to give

**0:00:04** customers and prospects installable reference that demonstrates best practices for

**0:00:08** both content modeling and design systems.

**0:00:11** So it's been built from the ground up with AI first principles.

**0:00:15** So it's primarily constructed within Figma.

**0:00:17** I've put together an entire background of variables that are very semantic so that

**0:00:22** the AI has a lot to hook into. So it's not just making color

**0:00:25** choices, it's making text choices. It's making background choices.

**0:00:28** And understanding how exactly it works versus just what's available.

**0:00:33** I also have a process set up. So that I can go into my

**0:00:36** code and actually talk back and forth and actually request,

**0:00:39** Hey, can you take a look at what's going on in the variables within

**0:00:43** Figma? Whatever's different, let's pull it into our tokens and vice versa.

**0:00:47** So there really isn't a source of truth so much as just a very

**0:00:50** clear and easy way to push back and forth differences between Figma and the

**0:00:54** code itself. I've also used the Contemporary example for Figma widget that I built

**0:00:59** so that I can actually see, real content,

**0:01:01** real time within the component itself.

**0:01:04** This takes care of a lot of the ambiguity and a lot of the

**0:01:06** things that you find later on, that churn that happens when you realize real

**0:01:10** content within your actually makes word breaks happen in certain situations.

**0:01:14** All that's kind of fleshed out because ultimately I really,

**0:01:17** really want this just to be right.

**0:01:19** If I can get this component to be put together the way that it

**0:01:22** needs to, if I can mature it here, the entire rest of the process

**0:01:26** just makes sense. Because at the end of the day,

**0:01:28** I'm, all I'm doing is exporting all that information.

**0:01:30** You can see here I have a screenshot from the component.

**0:01:33** I also have a token mapping so it talks explicitly about,

**0:01:37** in Markdown, about what's going on with those tokens and those variables within Figma

**0:01:42** to the point where the AI can I really just can't miss.

**0:01:44** There's just so much information there that all I have to do is really

**0:01:48** tell it something about what kind of code I want to make.

**0:01:50** Here I'm making React and, CSS in a very specific way and that's really

**0:01:54** all that's within the skill. And I can just basically point it at some

**0:01:57** component and say, oh, by the way, I updated that,

**0:01:59** that design snapshot. Can you go and see what's going on?

**0:02:02** And I do literally make incremental updates with a Figma-first approach.

**0:02:06** And in fact, every single component in here has been executed through this AI

**0:02:10** process. I also have,

**0:02:13** connections to our new, XO, which is a part of,

**0:02:15** Contentful. So I actually have a, I have these automatically generated configuration files.

**0:02:21** I also have Storybook Stories in the mix so that I can actually preview

**0:02:25** these whenever I like. So this is what it is here.

**0:02:27** And whenever something's done, something changes, I essentially update Figma if it's a layout

**0:02:31** issue and then press go and say,

**0:02:33** oh, by the way, this has been an update and it automatically,

**0:02:36** exports to, to the, the Storybook URL.
