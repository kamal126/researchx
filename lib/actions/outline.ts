"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import type { DocumentOutline, Section } from "@/lib/types";
import { nanoid } from "nanoid";

/* ----------------------- ZOD SCHEMAS ----------------------- */

const aiSectionSchema = z.object({
  title: z.string(),
  subtopics: z.array(z.string()),
});

const aiOutlineSchema = z.object({
  sections: z.array(aiSectionSchema),
});

/* ----------------------- MAIN FUNCTION ----------------------- */

export async function generateAIOutline(
  topic: string,
  academicLevel: string,
  documentLength: number
): Promise<DocumentOutline> {
  try {
    const { object } = await generateObject({
      model: google("gemini-2.0-flash"),

      system: `
You are an expert academic assistant. 
You must output ONLY valid JSON that strictly matches the schema.
Do NOT include explanations, headings, or extra text outside the JSON.
`,

      prompt: `
Generate a well-structured academic research document outline for the topic: "${topic}".

Requirements:
- Academic level: ${academicLevel}
- Length: approximately ${documentLength} pages
- Use standard academic sections (e.g., Introduction, Literature Review, Methodology, Results/Analysis, Discussion, Conclusion)
- Each section must have 2–4 unique, non-overlapping subtopics
- Ensure logical flow and avoid duplicate subtopics
- Return ONLY valid JSON matching the provided schema
`,

      schema: aiOutlineSchema,
      schemaName: "DocumentOutline",
      schemaDescription: "A research outline with sections and subtopics.",
    });

    // Convert AI output into internal structure with IDs and placeholders
    const formattedSections = object.sections.map((section) => ({
      id: nanoid(5),
      title: section.title,
      isSelected: true,
      subtopics: section.subtopics.map((subtopic) => ({
        id: nanoid(5),
        title: subtopic,
        isSelected: true,
        content: "",
      })),
    }));

    return {
      mainTopic: topic,
      sections: formattedSections,
    };
  } catch (error) {
    console.error("Error generating AI outline:", error);
    return generateStaticOutline(topic);
  }
}

/* ----------------------- STATIC FALLBACK ----------------------- */

function generateStaticOutline(topic: string): DocumentOutline {
  const sections: Section[] = [
    {
      id: "1",
      title: "Introduction",
      isSelected: true,
      subtopics: [
        {
          id: "1-1",
          title: "Background",
          isSelected: true,
          content: `This section provides a comprehensive background on ${topic}.`,
        },
        {
          id: "1-2",
          title: "Research Question",
          isSelected: true,
          content: `The primary research question this document addresses is related to ${topic}.`,
        },
      ],
    },

    // Additional fallback sections can be added here if needed
  ];

  return {
    mainTopic: topic,
    sections,
  };
}
