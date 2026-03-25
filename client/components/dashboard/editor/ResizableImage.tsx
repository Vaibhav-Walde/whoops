/* eslint-disable @next/next/no-img-element */
"use client";
import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { useRef, useState, useCallback } from "react";

const ResizableImageComponent = ({ node, updateAttributes, selected }: NodeViewProps) => {
  const { src, alt, width } = node.attrs as { src: string; alt?: string; width?: number };
  console.log("ResizableImageComponent rendering", { src: src?.slice(0, 50), alt, width });
  const containerRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsResizing(true);
      startX.current = e.clientX;
      startWidth.current = containerRef.current?.offsetWidth ?? width ?? 400;

      const onMouseMove = (e: MouseEvent) => {
        const delta = e.clientX - startX.current;
        const newWidth = Math.max(100, Math.min(800, startWidth.current + delta));
        updateAttributes({ width: newWidth });
      };

      const onMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [updateAttributes, width]
  );

  return (
    <NodeViewWrapper
      className="inline-block relative my-2"
      style={{
        width: "100%",
        display: "flex",
        justifyContent:
          node.attrs.textAlign === "center"
            ? "center"
            : node.attrs.textAlign === "right"
              ? "flex-end"
              : "flex-start",
      }}
    >
      <div ref={containerRef} className="relative group inline-block">
        <img
          src={src}
          alt={alt ?? ""}
          style={{
            width: width ? `${width}px` : "auto",
            maxWidth: "100%",
            display: "block",
            borderRadius: "8px",
            border: selected ? "2px solid var(--primary)" : "2px solid var(--border)",
            boxShadow: selected ? "0 0 0 3px rgba(37,99,235,0.15)" : "none",
            cursor: isResizing ? "ew-resize" : "default",
            userSelect: "none",
          }}
          draggable={false}
        />
        {/* Resize handle */}
        <div
          onMouseDown={onMouseDown}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-8 rounded-full cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          style={{ backgroundColor: "var(--primary)", boxShadow: "0 2px 8px rgba(37,99,235,0.4)" }}
        >
          <div className="flex gap-0.5">
            <div className="w-px h-4 rounded-full bg-white opacity-80" />
            <div className="w-px h-4 rounded-full bg-white opacity-80" />
          </div>
        </div>
        {/* Width label */}
        {(isResizing || selected) && (
          <div
            className="absolute bottom-2 right-2 text-[10px] font-mono px-1.5 py-0.5 rounded"
            style={{ backgroundColor: "var(--primary)", color: "#fff" }}
          >
            {width ?? "auto"}px
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
};

export default ResizableImageComponent;
