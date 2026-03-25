"use client";

import { useEffect, useState } from "react";
import { X, FilePlus } from "lucide-react";
import Input from "@/components/ui/Input";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useToast } from "@/context/ToastContext";
import api, { getErrorMessage } from "@/utils/axios.util";

const CreateDocumentModal = ({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) => {
  const { error, success } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      error("Title is required.");
      return;
    }
    try {
      setLoading(true);
      await api.post("/document", {
        title: title.trim(),
        description: description.trim() || null,
      });
      success("Document created.");
      onCreated();
      handleClose();
    } catch (err) {
      error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: visible ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0)",
        transition: "background-color 0.2s ease",
      }}
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md rounded-lg border font-mono flex flex-col"
        style={{
          backgroundColor: "var(--canvas)",
          borderColor: "var(--border)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0) scale(1)" : "translateY(12px) scale(0.97)",
          transition: "opacity 0.2s ease, transform 0.2s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-2">
            <FilePlus size={15} style={{ color: "var(--primary)" }} />
            <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              New document
            </h2>
          </div>
          <button
            onClick={handleClose}
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)")
            }
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          <Input
            label="Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled document"
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
          <Input
            label="Description"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description..."
          />
        </div>

        {/* Footer */}
        <div
          className="flex justify-end gap-2 px-6 py-4 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          <button
            onClick={handleClose}
            className="text-xs px-3 py-1.5 rounded-md font-mono transition-colors"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)")
            }
          >
            Cancel
          </button>
          <PrimaryButton onClick={handleCreate} loading={loading} loadingText="Creating...">
            Create document
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default CreateDocumentModal;
