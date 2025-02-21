import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

async function suggestMessages() {
  const prompt =
    "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

  //   "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";
  const result = await generateObject({
    model: google("gemini-1.5-pro-latest"),
    prompt: prompt,
    schema: z.object({
      message1: z.string().describe("message suggestion 1"),
      message2: z.string().describe("message suggestion 2"),
      message3: z.string().describe("message suggestion 3"),
    }),
  });

  if (!result) {
    return Response.json(
      {
        success: false,
        message: "status : (task failed) : unable to get the result",
      },
      { status: 500 }
    );
  }

  // console.log(result);
  return Response.json(
    {
      success: true,
      result: result.object,
    },
    { status: 200 }
  );
}

export { suggestMessages as GET };
