"use client";

import { useRef, useState } from "react";

interface Props {
  label: string;
  children: React.ReactNode;
}

const Tooltip = ({ label, children }: Props) => {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({
      top: rect.top - 36,
      left: rect.left + rect.width / 2,
    });
  };

  return (
    <div
      ref={ref}
      className="relative flex items-center justify-center"
      onMouseEnter={() => {
        updatePosition();
        setVisible(true);
      }}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          className="fixed z-9999 px-2.5 py-1.5 rounded-md text-[11px] tracking-wide whitespace-nowrap pointer-events-none font-mono"
          style={{
            top: pos.top,
            left: pos.left,
            transform: "translateX(-50%)",
            backgroundColor: "var(--canvas)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          {label}
          <div
            className="absolute -bottom-1 left-1/2 w-2 h-2 rotate-45"
            style={{
              transform: "translateX(-50%) rotate(45deg)",
              backgroundColor: "var(--canvas)",
              borderRight: "1px solid var(--border)",
              borderBottom: "1px solid var(--border)",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
