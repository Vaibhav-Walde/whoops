"use client";
import { useState, useRef, useEffect } from "react";
import api from "@/utils/axios.util";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIChatButton() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm your AI writing assistant. How can I help you today? ✨" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);
    try {
        const res = await api.post("/ai/chat", { message: userMessage, history: messages });      setMessages((prev) => [...prev, { role: "assistant", content: res.data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, something went wrong. Try again!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white text-xl"
        style={{ backgroundColor: "var(--accent, #6366f1)" }}
      >
        {open ? "✕" : "✨"}
      </button>

      {/* Chat window */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-80 h-96 rounded-2xl shadow-2xl flex flex-col overflow-hidden border"
          style={{ backgroundColor: "var(--canvas, #fff)", borderColor: "var(--border, #e5e7eb)" }}
        >
          {/* Header */}
          <div className="px-4 py-3 font-semibold text-sm border-b" style={{ borderColor: "var(--border, #e5e7eb)" }}>
            ✨ AI Assistant
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2">
            {messages.map((msg, i) => (
              <div key={i} className={`text-sm px-3 py-2 rounded-xl max-w-[85%] ${msg.role === "user" ? "self-end text-white" : "self-start"}`}
                style={msg.role === "user" ? { backgroundColor: "var(--accent, #6366f1)" } : { backgroundColor: "var(--surface, #f3f4f6)" }}>
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="self-start text-sm px-3 py-2 rounded-xl" style={{ backgroundColor: "var(--surface, #f3f4f6)" }}>
                Thinking...
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t flex gap-2" style={{ borderColor: "var(--border, #e5e7eb)" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask anything..."
              className="flex-1 text-sm px-3 py-2 rounded-lg border outline-none"
              style={{ borderColor: "var(--border, #e5e7eb)", backgroundColor: "var(--surface, #f9fafb)" }}
            />
            <button
              onClick={sendMessage}
              className="px-3 py-2 rounded-lg text-white text-sm"
              style={{ backgroundColor: "var(--accent, #6366f1)" }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}