import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const getResponseForPrompt = async () => {
  try {
    const model = genAI.getGenerativeModel({
      //Using this model we get around 1000 requests per day and 15 requests per minute so we'll have to set up some batch processing to add
      // each of the groups to a queue
      model: "gemini-2.5-flash-lite-preview-06-17",
    });
    const result = await model.generateContent(process.env.GEMINI_PROMPT!);
    const response = await result.response;
    const text = await response.text();
    return text;
  } catch (err) {
    console.error(err);
  }
};
