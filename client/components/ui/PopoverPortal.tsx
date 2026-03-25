"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export const PopoverPortal = ({
  anchorRef,
  children,
  onClose,
}: {
  anchorRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
  onClose: () => void;
}) => {
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const portalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX,
    });
  }, [anchorRef]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        portalRef.current &&
        !portalRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose, anchorRef]);

  return createPortal(
    <div
      ref={portalRef}
      style={{
        position: "absolute",
        top: pos.top,
        left: pos.left,
        zIndex: 9999,
      }}
    >
      {children}
    </div>,
    document.body
  );
};
