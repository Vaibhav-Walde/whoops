"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { DocumentUserRole } from "@/types/common";
import { useToast } from "@/context/ToastContext";
import api, { getErrorMessage } from "@/utils/axios.util";
import { ROLES, roleLabel } from "./constants";
import { getProviderForDocument } from "@/utils/collaboration.util";

const RoleDropdown = ({
  currentRole,
  collaboratorId,
  documentId,
  collaboratorEmail,
  onUpdated,
}: {
  currentRole: DocumentUserRole;
  collaboratorId: string;
  documentId: string;
  collaboratorEmail: string;
  onUpdated: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  const handleChange = async (role: DocumentUserRole) => {
    if (role === currentRole) {
      setOpen(false);
      return;
    }
    try {
      setLoading(true);
      await api.patch(`/document/${documentId}/collaborators/${collaboratorId}`, { role });

      // broadcast new role for the affected user via awareness
      // We store it keyed by userId so the affected tab can pick it up
      const provider = getProviderForDocument(documentId);
      if (provider) {
        const current = provider.awareness.getLocalState() ?? {};
        provider.awareness.setLocalState({
          ...current,
          roleUpdate: { email: collaboratorEmail, role }, // targeted update
        });
      }
      success("Role updated");
      onUpdated();
    } catch (err) {
      error(getErrorMessage(err));
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <div className="relative cursor-pointer">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={loading}
        className="flex items-center gap-1.5 text-xs px-2 py-1 rounded border transition-colors font-mono"
        style={{
          borderColor: open ? "var(--primary)" : "var(--border)",
          color: "var(--text-secondary)",
          backgroundColor: "var(--background)",
        }}
      >
        {loading ? (
          <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <span>{roleLabel(currentRole)}</span>
            <ChevronDown
              size={10}
              style={{
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.15s ease",
              }}
            />
          </>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-full mt-1 rounded-md border z-20 overflow-hidden w-36"
            style={{
              backgroundColor: "var(--canvas)",
              borderColor: "var(--border)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
            }}
          >
            {ROLES.map((r) => (
              <button
                key={r.value}
                onClick={() => handleChange(r.value)}
                className="w-full text-left px-3 py-2 transition-colors cursor-pointer"
                style={{
                  backgroundColor: currentRole === r.value ? "var(--hover)" : "transparent",
                  color: "var(--text-primary)",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--hover)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    currentRole === r.value ? "var(--hover)" : "transparent")
                }
              >
                <div className="text-xs font-semibold font-mono">{r.label}</div>
                <div className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>
                  {r.description}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RoleDropdown;
