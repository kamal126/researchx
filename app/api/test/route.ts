import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function GET() {
  try {
    const { text } = await generateText({
      model: google("gemini-2.0-flash"),
      prompt: "Say hello",
    });

    return new Response(JSON.stringify({ ok: true, text }), {
      status: 200,
    });
  } catch (error:any) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
    });
  }
}
