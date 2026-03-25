"use client";

import { Document } from "@/types/common";
import { formatRelativeTime } from "@/utils/common.util";
import { FileText, Clock, Trash2 } from "lucide-react";

interface Props {
  doc: Document;
  onClick?: (doc: Document) => void;
  onDelete?: (id: string) => void;
  deleting?: boolean;
  badge?: "EDITOR" | "VIEWER";
}

const badgeStyles: Record<string, { bg: string; color: string; label: string }> = {
  EDITOR: { bg: "#22C55E20", color: "#22C55E", label: "Editor" },
  VIEWER: { bg: "#F59E0B20", color: "#F59E0B", label: "Viewer" },
};

const DocumentCard = ({ doc, onClick, onDelete, deleting, badge }: Props) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(doc.id);
  };

  return (
    <div
      className="p-5 flex items-start justify-between gap-4 cursor-pointer transition-colors rounded-md border"
      style={{ backgroundColor: "var(--canvas)", borderColor: "var(--border)" }}
      onClick={() => onClick?.(doc)}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLDivElement).style.backgroundColor = "var(--hover)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLDivElement).style.backgroundColor = "var(--canvas)")
      }
    >
      <div className="flex items-start gap-3 min-w-0">
        <FileText
          className="w-4 h-4 mt-0.5 shrink-0"
          style={{ color: "var(--primary)" }}
          strokeWidth={1.5}
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
            {doc.title}
          </p>
          <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-secondary)" }}>
            {doc.description ?? "No description provided"}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" style={{ color: "var(--text-secondary)" }} />
          <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
            {formatRelativeTime(doc.updatedAt)}
          </span>
        </div>

        {/* Badge for shared docs */}
        {badge && badgeStyles[badge] && (
          <div
            className="text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={{
              backgroundColor: badgeStyles[badge].bg,
              color: badgeStyles[badge].color,
            }}
          >
            {badgeStyles[badge].label}
          </div>
        )}

        {/* Delete for own docs */}
        {onDelete && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] tracking-wide border transition-colors rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
              text-(--error) border-(--error) bg-transparent hover:bg-(--error) hover:text-white"
          >
            <Trash2 className="w-3 h-3" strokeWidth={1.5} />
            {deleting ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>
    </div>
  );
};

export default DocumentCard;
