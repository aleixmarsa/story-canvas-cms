"use server";

import { randomUUID } from "crypto";
import { verifySession } from "@/lib/dal/auth";
import { createStoryWithDraft } from "@/lib/dal/stories";
import { createSectionWithDraftVersion } from "@/lib/dal/sections";
import { Role } from "@prisma/client";
import { SectionFormData } from "@/lib/validation/section-version";
import { TEMPLATE_IMAGE } from "@/lib/constants/template";

export const createTemplateStory = async (formData: FormData) => {
  const session = await verifySession();
  if (!session || session.role !== Role.ADMIN) {
    throw new Error("Unauthorized");
  }
  const uid = randomUUID();
  const createdBy = formData.get("createdBy")?.toString() || "";

  const story = await createStoryWithDraft({
    title: `Template Story ${uid.slice(0, 4)}`,
    slug: `template-${uid}`,
    description: "Generated template with sample sections.",
    createdBy: createdBy,
    creatorId: session.id,
  });

  const sectionTemplates: SectionFormData[] = [
    {
      storyId: story.id,
      name: "Title",
      type: "TITLE",
      createdBy: createdBy,
      content: {
        text: '<h1><span style="color: rgb(255, 255, 255);">Welcome to</span><span style="color: rgb(242, 208, 87);"> your new story</span></h1>',
        textPadding: { top: 0, left: 0, right: 0, bottom: 0 },
        scrollTrigger: { end: "none", start: "none" },
        sectionLayout: {
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
        },
        sectionMargin: { top: 0, left: 0, right: 0, bottom: 0 },
        textAnimation: {
          delay: 0.2,
          easing: "none",
          duration: 0.7,
          animationType: "slide-up",
        },
        sectionPadding: { top: 0, left: 0, right: 0, bottom: 0 },
        sectionBackground: {
          size: "cover",
          color: "#000000",
          image:
            "https://res.cloudinary.com/da3mg3zw1/image/upload/v1746974183/template-title-bg_q7g1yv.webp",
          position: "center",
        },
      },
    },
    {
      storyId: story.id,
      name: "Paragraph",
      type: "PARAGRAPH",
      createdBy: createdBy,
      content: {
        body: "<p>This is a <strong>paragraph</strong> block. Paragraphs are ideal for introducing a topic, explaining concepts or adding narrative to your story. Use them to guide your readers, provide context or add commentaries between visual sections.</p>",
        textPadding: {
          top: 80,
          left: 0,
          right: 0,
          bottom: 80,
        },
        scrollTrigger: {
          start: "bottom bottom",
          end: "50% 50%",
          scrub: "true",
        },
        sectionLayout: {
          height: "fit-content",
          alignItems: "center",
          justifyContent: "center",
        },
        sectionMargin: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
        textAnimation: {
          delay: 0.2,
          easing: "none",
          duration: 0.7,
          animationType: "slide-right",
        },
        sectionPadding: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
        sectionBackground: {
          size: "cover",
          color: "#FFFFFF",
          position: "center",
        },
      },
    },
    {
      storyId: story.id,
      name: "Chart",
      type: "CHART",
      createdBy: createdBy,
      content: {
        title: "<h3>Average Annual Temperature (1980–2024)</h3>",
        description:
          "<p><strong>Charts</strong> allow you to present data visually, making trends and patterns easier to understand. They are especially useful in stories where numbers provide critical context. Such as climate evolution, economic change or scientific research</p>",
        data: '[\n  { "year": 1980, "meanTemperature": 24.1, "meanPrecipitation": 450 },\n  { "year": 1981, "meanTemperature": 23.8, "meanPrecipitation": 470 },\n  { "year": 1982, "meanTemperature": 24.3, "meanPrecipitation": 490 },\n  { "year": 1983, "meanTemperature": 24.0, "meanPrecipitation": 430 },\n  { "year": 1984, "meanTemperature": 24.5, "meanPrecipitation": 500 },\n  { "year": 1985, "meanTemperature": 24.2, "meanPrecipitation": 460 },\n  { "year": 1986, "meanTemperature": 24.7, "meanPrecipitation": 480 },\n  { "year": 1987, "meanTemperature": 25.0, "meanPrecipitation": 510 },\n  { "year": 1988, "meanTemperature": 24.9, "meanPrecipitation": 495 },\n  { "year": 1989, "meanTemperature": 25.2, "meanPrecipitation": 520 },\n  { "year": 1990, "meanTemperature": 25.3, "meanPrecipitation": 505 },\n  { "year": 1991, "meanTemperature": 25.5, "meanPrecipitation": 515 },\n  { "year": 1992, "meanTemperature": 25.2, "meanPrecipitation": 490 },\n  { "year": 1993, "meanTemperature": 25.0, "meanPrecipitation": 470 },\n  { "year": 1994, "meanTemperature": 25.4, "meanPrecipitation": 495 },\n  { "year": 1995, "meanTemperature": 25.7, "meanPrecipitation": 505 },\n  { "year": 1996, "meanTemperature": 25.6, "meanPrecipitation": 510 },\n  { "year": 1997, "meanTemperature": 25.9, "meanPrecipitation": 520 },\n  { "year": 1998, "meanTemperature": 26.1, "meanPrecipitation": 530 },\n  { "year": 1999, "meanTemperature": 26.0, "meanPrecipitation": 525 },\n  { "year": 2000, "meanTemperature": 26.3, "meanPrecipitation": 540 },\n  { "year": 2001, "meanTemperature": 26.1, "meanPrecipitation": 535 },\n  { "year": 2002, "meanTemperature": 26.4, "meanPrecipitation": 545 },\n  { "year": 2003, "meanTemperature": 26.6, "meanPrecipitation": 550 },\n  { "year": 2004, "meanTemperature": 26.5, "meanPrecipitation": 560 },\n  { "year": 2005, "meanTemperature": 26.7, "meanPrecipitation": 570 },\n  { "year": 2006, "meanTemperature": 26.9, "meanPrecipitation": 580 },\n  { "year": 2007, "meanTemperature": 27.0, "meanPrecipitation": 590 },\n  { "year": 2008, "meanTemperature": 26.8, "meanPrecipitation": 585 },\n  { "year": 2009, "meanTemperature": 27.2, "meanPrecipitation": 595 },\n  { "year": 2010, "meanTemperature": 27.4, "meanPrecipitation": 600 },\n  { "year": 2011, "meanTemperature": 27.3, "meanPrecipitation": 610 },\n  { "year": 2012, "meanTemperature": 27.5, "meanPrecipitation": 615 },\n  { "year": 2013, "meanTemperature": 27.6, "meanPrecipitation": 620 },\n  { "year": 2014, "meanTemperature": 27.8, "meanPrecipitation": 625 },\n  { "year": 2015, "meanTemperature": 28.0, "meanPrecipitation": 630 },\n  { "year": 2016, "meanTemperature": 28.2, "meanPrecipitation": 635 },\n  { "year": 2017, "meanTemperature": 28.1, "meanPrecipitation": 640 },\n  { "year": 2018, "meanTemperature": 28.3, "meanPrecipitation": 645 },\n  { "year": 2019, "meanTemperature": 28.5, "meanPrecipitation": 650 },\n  { "year": 2020, "meanTemperature": 28.6, "meanPrecipitation": 655 },\n  { "year": 2021, "meanTemperature": 28.7, "meanPrecipitation": 660 },\n  { "year": 2022, "meanTemperature": 28.8, "meanPrecipitation": 665 },\n  { "year": 2023, "meanTemperature": 28.9, "meanPrecipitation": 670 },\n  { "year": 2024, "meanTemperature": 29.0, "meanPrecipitation": 675 }\n]',
        type: "line",
        xKey: "year",
        yKeys: "meanTemperature",
        delay: 0,
        duration: 0.1,
        sectionMargin: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
        sectionPadding: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
        sectionBackground: {
          color: "#f7f7f7",
        },
      },
    },
    {
      storyId: story.id,
      name: "Paragraph and Image",
      type: "PARAGRAPH_AND_IMAGE",
      createdBy: createdBy,
      content: {
        alt: "Flooded houses",
        body: "<p>This is also a <strong>paragraph</strong> block, but enriched with an image. Combining text with visuals helps emphasize key ideas, illustrate concepts or add emotional impact. Use this format when you want to reinforce your message or break up long passages of text with visual storytelling.</p>",
        image: TEMPLATE_IMAGE,
        caption: "<p>Flooded houses in Barcelona</p>",
        scrollTrigger: {
          start: "bottom bottom",
          end: "50% 50%",
          scrub: "true",
        },
        sectionLayout: {
          height: "fit-content",
          alignItems: "center",
          justifyContent: "center",
        },
        sectionMargin: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
        contentLayout: {
          direction: "row",
          order: "text",
          justifyContent: "justify-between",
          alignItems: "items-center",
        },
        imageSize: {
          width: 350,
          height: 300,
        },
        textAnimation: {
          delay: 0.2,
          easing: "none",
          duration: 0.7,
          animationType: "slide-right",
        },
        imageAnimation: {
          delay: 0,
          easing: "none",
          duration: 0.7,
          animationType: "slide-left",
        },
        sectionPadding: {
          top: 24,
          left: 0,
          right: 0,
          bottom: 24,
        },
        sectionBackground: {
          size: "cover",
          color: "#FFFFFF",
          position: "center",
        },
      },
    },
    {
      storyId: story.id,
      name: "Call to Action",
      type: "CALL_TO_ACTION",
      createdBy: createdBy,
      content: {
        url: "https://www.uoc.edu",
        label: "Visit Website",
        button: {
          labelSize: 16,
          labelColor: "#000000",
          buttonColor: "#f2d057",
          buttonBorderRadius: 5,
        },
        newTab: true,
        buttonPadding: {
          top: 8,
          left: 24,
          right: 24,
          bottom: 8,
        },
        sectionLayout: {
          height: "auto",
          alignItems: "center",
          justifyContent: "center",
        },
        sectionMargin: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
        sectionPadding: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 24,
        },
        sectionBackground: {
          size: "cover",
          color: "#ffffff",
          position: "center",
        },
      },
    },
    {
      storyId: story.id,
      name: "Video",
      type: "VIDEO",
      createdBy: createdBy,
      content: {
        title: "<h3>Watch and experience</h3>",
        video: "https://www.youtube.com/watch?v=u31qwQUeGuM",
        videoSize: {
          width: 200,
          height: 400,
        },
        description:
          "<p><strong>Videos</strong> add depth to your story by bringing motion and sound into the narrative. Whether it's an interview, a documentary clip, or a cinematic moment, video allows your audience to connect emotionally and contextually in ways that text and images alone cannot.</p>",
        scrollTrigger: {
          end: "50% 50%",
          scrub: "true",
          start: "50% bottom",
        },
        sectionLayout: {
          height: "auto",
          alignItems: "center",
          justifyContent: "flex-start",
        },
        sectionMargin: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
        textAnimation: {
          delay: 0,
          easing: "none",
          duration: 0.7,
          animationType: "slide-right",
        },
        sectionPadding: {
          top: 40,
          left: 0,
          right: 0,
          bottom: 40,
        },
        videoAnimation: {
          delay: 0,
          easing: "none",
          duration: 0.7,
          animationType: "fade",
        },
        sectionBackground: {
          color: "#f7f7f7",
        },
      },
    },
    {
      storyId: story.id,
      name: "Ending Paragraph",
      type: "PARAGRAPH",
      createdBy: createdBy,
      content: {
        body: `<p><span style="color: rgb(255, 255, 255);">This template provides a starting point, a structured canvas combining narrative, visuals and data. From here, you can craft a story that not only informs, but also resonates with your audience. Whether you're explaining a complex issue, raising awareness about a trend or presenting a personal vision, your words, images, and charts work together to build meaning.</span></p>
         <p><span style="color: rgb(255, 255, 255);">Don’t be afraid to iterate. This is your creative space.</span></p>`,
        textPadding: {
          top: 80,
          left: 0,
          right: 0,
          bottom: 80,
        },
        scrollTrigger: {
          end: "bottom bottom",
          scrub: "false",
          start: "none",
        },
        sectionLayout: {
          height: "fit-content",
          alignItems: "center",
          justifyContent: "center",
        },
        sectionMargin: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
        textAnimation: {
          delay: 0.2,
          easing: "none",
          duration: 0.7,
          animationType: "none",
        },
        sectionPadding: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
        sectionBackground: {
          size: "cover",
          color: "#000000",
          position: "center",
        },
      },
    },
  ];
  for (const template of sectionTemplates) {
    await createSectionWithDraftVersion({
      storyId: story.id,
      name: template.name,
      type: template.type,
      content: template.content,
      createdBy: createdBy,
      creatorId: session.id,
    });
  }
};
