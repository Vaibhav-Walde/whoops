"use client";
import { useState } from "react";

const TablePopover = ({
  onInsert,
  onClose,
}: {
  onInsert: (rows: number, cols: number) => void;
  onClose: () => void;
}) => {
  const [hovered, setHovered] = useState({ rows: 0, cols: 0 });
  const MAX = 6;
  return (
    <div
      className="p-3 rounded-xl border"
      style={{
        backgroundColor: "var(--canvas)",
        borderColor: "var(--border)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      }}
    >
      <p className="text-[10px] font-mono mb-2.5" style={{ color: "var(--text-secondary)" }}>
        {hovered.rows > 0 ? `${hovered.rows} × ${hovered.cols} table` : "Select table size"}
      </p>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${MAX}, 1fr)` }}>
        {Array.from({ length: MAX * MAX }).map((_, idx) => {
          const r = Math.floor(idx / MAX) + 1;
          const c = (idx % MAX) + 1;
          const isActive = r <= hovered.rows && c <= hovered.cols;
          return (
            <div
              key={idx}
              className="w-5 h-5 rounded-sm border cursor-pointer transition-all"
              style={{
                borderColor: isActive ? "var(--primary)" : "var(--border)",
                backgroundColor: isActive ? "#2563EB20" : "transparent",
              }}
              onMouseEnter={() => setHovered({ rows: r, cols: c })}
              onClick={() => {
                onInsert(r, c);
                onClose();
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TablePopover;
