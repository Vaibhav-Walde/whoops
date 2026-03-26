import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

type AIAction = "improve" | "summarize" | "rewrite" | "fix-grammar";

const prompts: Record<AIAction, string> = {
  "improve": "Improve the writing of the following text. Return only the improved text, nothing else:",
  "summarize": "Summarize the following text concisely. Return only the summary, nothing else:",
  "rewrite": "Rewrite the following text more professionally. Return only the rewritten text, nothing else:",
  "fix-grammar": "Fix the grammar of the following text. Return only the corrected text, nothing else:",
};

const aiImproveService = async (text: string, action: AIAction): Promise<string> => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
  const prompt = `${prompts[action]}\n\n${text}`;
  const result = await model.generateContent(prompt);
  return result.response.text();
};

export default aiImproveService;