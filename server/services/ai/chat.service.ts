import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface Message {
  role: "user" | "assistant";
  content: string;
}

const aiChatService = async (message: string, history: Message[]): Promise<string> => {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: "You are a helpful AI writing assistant inside a collaborative document editor called Whoops. Help users with writing, brainstorming, editing, and any questions they have.",
      },
      ...history,
      { role: "user", content: message },
    ],
  });
  return completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
};

export default aiChatService;