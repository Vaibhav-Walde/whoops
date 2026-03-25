"use client";
import { useEffect, useRef, useState } from "react";

const LinkPopover = ({
  current,
  onSet,
  onRemove,
  onClose,
}: {
  current?: string;
  onSet: (url: string) => void;
  onRemove: () => void;
  onClose: () => void;
}) => {
  const [url, setUrl] = useState(current ?? "");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      className="p-3 rounded-xl border flex flex-col gap-2"
      style={{
        backgroundColor: "var(--canvas)",
        borderColor: "var(--border)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        minWidth: 240,
      }}
    >
      <p
        className="text-[10px] font-mono tracking-wider uppercase"
        style={{ color: "var(--text-secondary)" }}
      >
        Insert link
      </p>
      <input
        ref={inputRef}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSet(url);
            onClose();
          }
          if (e.key === "Escape") onClose();
        }}
        placeholder="https://..."
        className="w-full px-3 py-2 text-xs font-mono rounded-lg border outline-none"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--background)",
          color: "var(--text-primary)",
        }}
      />
      <div className="flex gap-2">
        <button
          onClick={() => {
            onSet(url);
            onClose();
          }}
          className="flex-1 py-1.5 text-xs font-mono font-semibold rounded-lg text-white hover:opacity-90"
          style={{ backgroundColor: "var(--primary)" }}
        >
          Apply
        </button>
        {current && (
          <button
            onClick={() => {
              onRemove();
              onClose();
            }}
            className="flex-1 py-1.5 text-xs font-mono rounded-lg border"
            style={{ borderColor: "var(--border)", color: "var(--error)" }}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

export default LinkPopover;
