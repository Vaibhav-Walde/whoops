"use client";
import { useState } from "react";
import api from "@/utils/axios.util";

const actions = [
  { label: "✨ Improve", value: "improve" },
  { label: "🧠 Summarize", value: "summarize" },
  { label: "🪄 Rewrite", value: "rewrite" },
  { label: "⚡ Fix Grammar", value: "fix-grammar" },
];

const AIToolbar = ({
  selectedText,
  onReplace,
  position,
}: {
  selectedText: string;
  onReplace: (text: string) => void;
  position: { top: number; left: number };
}) => {
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: string) => {
    if (!selectedText.trim()) return;
    setLoading(true);
    try {
      const res = await api.post("/api/v1/ai/improve", { text: selectedText, action });
      onReplace(res.data.result);
    } catch (err) {
      console.error("AI error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ top: position.top, left: position.left }}
      className="absolute z-50 flex gap-1 bg-white border border-gray-200 rounded-lg shadow-lg p-1"
    >
      {loading ? (
        <span className="px-3 py-1 text-sm text-gray-500">Thinking...</span>
      ) : (
        actions.map((action) => (
          <button
            key={action.value}
            onClick={() => handleAction(action.value)}
            className="px-2 py-1 text-xs rounded hover:bg-gray-100 whitespace-nowrap"
          >
            {action.label}
          </button>
        ))
      )}
    </div>
  );
};

export default AIToolbar;