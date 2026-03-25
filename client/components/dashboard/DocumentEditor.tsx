"use client";

import * as Y from "yjs";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect } from "react";
import { MenuBar } from "./Menubar";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import api from "@/utils/axios.util";
import { destroyCollaborationInstance, getCollaborationInstance } from "@/utils/collaboration.util";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import FontFamily from "@tiptap/extension-font-family";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import ResizableImage from "./editor/ResizableImage.extention";

const DocumentEditor = ({
  documentId,
  currentUser,
  initialContent,
  isReadOnly = false,
  onSaveStatusChange,
}: {
  documentId: string;
  currentUser: { name: string; color: string };
  initialContent?: string;
  isReadOnly?: boolean;
  onSaveStatusChange?: (status: "saving" | "saved" | "error") => void;
}) => {
  const { ydoc, provider } = getCollaborationInstance(documentId, initialContent);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ history: false }),
      Collaboration.configure({ document: ydoc }),
      CollaborationCursor.configure({
        provider,
        user: currentUser,
        render: (user: { name: string; color: string }) => {
          const cursor = document.createElement("span");
          cursor.classList.add("collab-cursor");
          const caret = document.createElement("span");
          caret.classList.add("collab-caret");
          caret.style.borderColor = user.color;
          const label = document.createElement("span");
          label.classList.add("collab-label");
          label.style.backgroundColor = user.color;
          label.textContent = user.name;
          cursor.appendChild(caret);
          cursor.appendChild(label);
          return cursor;
        },
      }),
      TextStyle,
      Color,
      Underline,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      TextAlign.configure({ types: ["heading", "paragraph", "resizableImage"] }),
      FontFamily,
      ResizableImage,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Subscript,
      Superscript,
      Placeholder.configure({ placeholder: "Start writing..." }),
    ],
    editable: !isReadOnly,
    immediatelyRender: false,
  });

  // Auto-save
  useEffect(() => {
    if (isReadOnly) return;

    let timeout: NodeJS.Timeout;

    const handleUpdate = (_update: Uint8Array, origin: unknown) => {
      if (origin === provider) return;
      clearTimeout(timeout);
      onSaveStatusChange?.("saving");
      timeout = setTimeout(async () => {
        try {
          const update = Y.encodeStateAsUpdate(ydoc);
          const base64 = btoa(String.fromCharCode(...update));
          await api.patch(`/document/${documentId}/save`, { content: base64 });
          onSaveStatusChange?.("saved");
        } catch {
          onSaveStatusChange?.("error");
        }
      }, 2000);
    };

    ydoc.on("update", handleUpdate);
    return () => {
      clearTimeout(timeout);
      ydoc.off("update", handleUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ydoc, isReadOnly]);

  // Cleanup
  useEffect(() => {
    return () => destroyCollaborationInstance(documentId);
  }, [documentId]);

  // Sync isReadOnly
  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!isReadOnly);
  }, [editor, isReadOnly]);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      {!isReadOnly ? (
        editor && <MenuBar editor={editor} />
      ) : (
        <div
          className="px-4 py-2 border-b flex items-center gap-2"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--canvas)" }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: "var(--text-secondary)" }}
          />
          <span className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>
            View only
          </span>
        </div>
      )}

      {/* Editor canvas */}
      <div
        className="flex-1 px-4 py-12 min-h-[70vh] rounded-b-md"
        style={{ backgroundColor: "var(--canvas)" }}
      >
        <div className="max-w-5xl mx-auto">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;
