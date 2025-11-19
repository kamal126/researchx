"use server";

import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function generateAIContent(
  mainTopic: string,
  sectionTitle: string,
  subtopicTitle: string,
  academicLevel: string
): Promise<string> {
  try {
    const { text } = await generateText({
      model: google("gemini-2.0-flash"),

      system: `
You are an expert academic writer. 
Write in a clear, formal, and academically appropriate tone.
Ensure the writing is coherent, factual, and suitable for the specified academic level.
You must output ONLY the paragraph text—no headings, no markdown, no lists.
`,

      prompt: `
Write a detailed, well-structured paragraph (100–200 words)
for the subtopic "${subtopicTitle}"
in the section "${sectionTitle}"
of a research document about "${mainTopic}".

Requirements:
- Academic level: ${academicLevel}
- Use formal academic language with smooth logical flow.
- Include relevant factual explanations and examples.
- Do NOT use markdown formatting, bullet points, lists, or headings.
- Do NOT include citations or references.
- Output only the paragraph, nothing else.
`,
    });

    return text.trim();
  } catch (error) {
    console.error("Error generating AI content:", error);
    return `An error occurred while generating content for "${subtopicTitle}". Please try again later.`;
  }
}
