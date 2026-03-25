"use client";
import { useState } from "react";

const ImagePopover = ({
  onInsert,
  onClose,
}: {
  onInsert: (src: string, alt: string) => void;
  onClose: () => void;
}) => {
  const [src, setSrc] = useState("");
  const [alt, setAlt] = useState("");

  return (
    <div
      className="p-3 rounded-xl border flex flex-col gap-2"
      style={{
        backgroundColor: "var(--canvas)",
        borderColor: "var(--border)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        minWidth: 260,
      }}
    >
      <p
        className="text-[10px] font-mono tracking-wider uppercase"
        style={{ color: "var(--text-secondary)" }}
      >
        Insert image
      </p>
      <input
        value={src}
        onChange={(e) => setSrc(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
        placeholder="Image URL..."
        className="w-full px-3 py-2 text-xs font-mono rounded-lg border outline-none"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--background)",
          color: "var(--text-primary)",
        }}
      />
      <input
        value={alt}
        onChange={(e) => setAlt(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
        placeholder="Alt text (optional)"
        className="w-full px-3 py-2 text-xs font-mono rounded-lg border outline-none"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--background)",
          color: "var(--text-primary)",
        }}
      />
      <button
        onClick={() => {
          if (src) {
            onInsert(src, alt);
            onClose();
          }
        }}
        disabled={!src}
        className="w-full py-1.5 text-xs font-mono font-semibold rounded-lg text-white disabled:opacity-50 hover:opacity-90"
        style={{ backgroundColor: "var(--primary)" }}
      >
        Insert
      </button>
    </div>
  );
};

export default ImagePopover;
