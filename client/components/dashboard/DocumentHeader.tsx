"use client";

import { Document } from "@/types/common";
import { formatRelativeTime } from "@/utils/common.util";
import { Clock, Check, X, Pencil, File } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import api, { getErrorMessage } from "@/utils/axios.util";
import { useToast } from "@/context/ToastContext";

interface Props {
  document: Document;
  onUpdate?: (updated: Partial<Document>) => void;
  isReadOnly?: boolean;
}

const EditableField = ({
  value,
  onSave,
  multiline = false,
  placeholder = "",
  isReadOnly = false,
  textClassName = "",
}: {
  value: string;
  onSave: (val: string) => Promise<void>;
  multiline?: boolean;
  placeholder?: string;
  isReadOnly?: boolean;
  textClassName?: string;
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const ref = useRef<HTMLTextAreaElement & HTMLInputElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (editing) {
      ref.current?.focus();
      const len = ref.current?.value.length ?? 0;
      ref.current?.setSelectionRange(len, len);
    }
  }, [editing]);

  const handleSave = async () => {
    const trimmed = draft.trim();
    if (trimmed === value) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      await onSave(trimmed);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setDraft(value);
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") handleCancel();
  };

  if (editing) {
    return (
      <div
        className="flex items-start gap-2 w-full rounded-md px-3 py-2"
        style={{ backgroundColor: "var(--hover)", border: "1px solid var(--primary)" }}
      >
        <div className="flex-1">
          {multiline ? (
            <textarea
              ref={ref as React.RefObject<HTMLTextAreaElement>}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={saving}
              placeholder={placeholder}
              rows={2}
              className={`w-full bg-transparent outline-none resize-none font-mono ${textClassName}`}
              style={{ color: "var(--text-primary)" }}
            />
          ) : (
            <input
              ref={ref as React.RefObject<HTMLInputElement>}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={saving}
              placeholder={placeholder}
              className={`w-full bg-transparent outline-none font-mono ${textClassName}`}
              style={{ color: "var(--text-primary)" }}
            />
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0 mt-0.5">
          <button
            onClick={handleSave}
            disabled={saving}
            title="Save"
            className="w-6 h-6 rounded flex items-center justify-center transition-colors disabled:opacity-50"
            style={{ backgroundColor: "#22C55E20", color: "#22C55E" }}
          >
            {saving ? (
              <span className="w-2.5 h-2.5 border border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Check size={11} />
            )}
          </button>
          <button
            onClick={handleCancel}
            disabled={saving}
            title="Cancel"
            className="w-6 h-6 rounded flex items-center justify-center transition-colors disabled:opacity-50"
            style={{ backgroundColor: "#EF444415", color: "var(--error)" }}
          >
            <X size={11} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group flex items-center gap-2 w-full rounded-md px-3 py-1.5 transition-colors ${!isReadOnly ? "cursor-pointer" : ""}`}
      style={{ backgroundColor: "transparent" }}
      onClick={() => !isReadOnly && setEditing(true)}
      onMouseEnter={(e) => {
        if (!isReadOnly) (e.currentTarget as HTMLDivElement).style.backgroundColor = "var(--hover)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent";
      }}
    >
      <span
        className={`flex-1 min-w-0 ${textClassName}`}
        style={{ color: value ? "var(--text-primary)" : "var(--text-secondary)" }}
      >
        {value || placeholder}
      </span>
      {!isReadOnly && (
        <Pencil
          size={11}
          className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          style={{ color: "var(--text-secondary)" }}
        />
      )}
    </div>
  );
};

const DocumentHeader = ({ document, onUpdate, isReadOnly = false }: Props) => {
  const { error, success } = useToast();

  const handleSaveTitle = async (title: string) => {
    if (!title) {
      error("Title cannot be empty.");
      throw new Error("empty");
    }
    try {
      await api.patch(`/document/${document.id}`, { title });
      onUpdate?.({ title });
      success("Title updated.");
    } catch (err) {
      error(getErrorMessage(err));
      throw err;
    }
  };

  const handleSaveDescription = async (description: string) => {
    try {
      await api.patch(`/document/${document.id}`, { description: description || null });
      onUpdate?.({ description: description || undefined });
      success("Description updated.");
    } catch (err) {
      error(getErrorMessage(err));
      throw err;
    }
  };

  return (
    <div
      className="rounded-lg border mb-8 overflow-hidden"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--canvas)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ backgroundColor: "var(--primary)" }} />

      <div className="px-6 py-5">
        {/* Title row */}
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#2563EB15" }}
          >
            <File size={18} />
          </div>

          <div className="flex-1 min-w-0">
            <EditableField
              value={document.title}
              onSave={handleSaveTitle}
              placeholder="Untitled document"
              isReadOnly={isReadOnly}
              textClassName="text-xl font-bold font-mono"
            />
          </div>
        </div>

        {/* Description row */}
        <div className="ml-11">
          <EditableField
            value={document.description ?? ""}
            onSave={handleSaveDescription}
            multiline
            placeholder={isReadOnly ? "No description provided" : "Add a description..."}
            isReadOnly={isReadOnly}
            textClassName="text-sm font-mono"
          />
        </div>

        {/* Divider */}
        <div className="mx-3 mt-4 mb-3 border-t" style={{ borderColor: "var(--border)" }} />

        {/* Meta row */}
        <div className="flex items-center flex-wrap gap-1 md:gap-5 px-3">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 shrink-0" style={{ color: "var(--text-secondary)" }} />
            <span className="text-[11px] font-mono" style={{ color: "var(--text-secondary)" }}>
              Created {formatRelativeTime(document.createdAt)}
            </span>
          </div>

          {document.createdAt !== document.updatedAt && (
            <>
              <span style={{ color: "var(--border)" }}>·</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 shrink-0" style={{ color: "var(--text-secondary)" }} />
                <span className="text-[11px] font-mono" style={{ color: "var(--text-secondary)" }}>
                  Updated {formatRelativeTime(document.updatedAt)}
                </span>
              </div>
            </>
          )}

          {!isReadOnly && (
            <>
              <span style={{ color: "var(--border)" }}>·</span>
              <span className="text-[11px] font-mono" style={{ color: "var(--text-secondary)" }}>
                Click any field to edit
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentHeader;
