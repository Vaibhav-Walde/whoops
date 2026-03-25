"use client";
import { Check } from "lucide-react";

const ColorPicker = ({
  colors,
  onSelect,
  onClose,
  current,
}: {
  colors: string[];
  onSelect: (c: string) => void;
  onClose: () => void;
  current?: string;
}) => (
  <div
    className="p-2.5 rounded-xl border"
    style={{
      backgroundColor: "var(--canvas)",
      borderColor: "var(--border)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    }}
  >
    <div className="grid grid-cols-4 gap-1.5">
      {colors.map((c) => (
        <button
          key={c}
          onClick={() => {
            onSelect(c);
            onClose();
          }}
          className="w-7 h-7 rounded-lg border-2 transition-all hover:scale-110 relative"
          style={{
            backgroundColor: c,
            borderColor: current === c ? "var(--primary)" : "var(--border)",
            boxShadow: current === c ? `0 0 0 2px var(--primary)` : "none",
          }}
        >
          {current === c && (
            <Check
              className="w-3 h-3 absolute inset-0 m-auto"
              style={{ color: c === "#ffffff" ? "#000" : "#fff" }}
            />
          )}
        </button>
      ))}
    </div>
  </div>
);

export default ColorPicker;
