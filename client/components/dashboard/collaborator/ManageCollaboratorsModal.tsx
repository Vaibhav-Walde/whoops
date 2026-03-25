"use client";

import { useEffect, useState } from "react";
import { X, UserPlus, ChevronDown } from "lucide-react";
import { DocumentMember, DocumentUserRole } from "@/types/common";
import { useToast } from "@/context/ToastContext";
import api, { getErrorMessage } from "@/utils/axios.util";
import PrimaryButton from "@/components/ui/PrimaryButton";
import CollaboratorRow from "./CollaboratorRow";
import { ROLES } from "./constants";

const ManageCollaboratorsModal = ({
  documentId,
  collaborators,
  onClose,
  onRefresh,
}: {
  documentId: string;
  collaborators: DocumentMember[];
  onClose: () => void;
  onRefresh: () => void;
}) => {
  const { success, error } = useToast();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<DocumentUserRole>("VIEWER");
  const [inviting, setInviting] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [visible, setVisible] = useState(false); // animation state

  const selectedRole = ROLES.find((r) => r.value === role)!;

  // trigger enter animation after mount
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  // animate out before calling onClose
  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  const handleInvite = async () => {
    if (!email.trim()) return;
    try {
      setInviting(true);
      await api.post(`/document/${documentId}/invite`, { email, role });
      success(`Invite sent to ${email}`);
      setEmail("");
      onRefresh();
    } catch (err) {
      error(getErrorMessage(err));
    } finally {
      setInviting(false);
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
          maxHeight: "90vh",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0) scale(1)" : "translateY(12px) scale(0.97)",
          transition: "opacity 0.2s ease, transform 0.2s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — fixed */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b shrink-0"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-2">
            <UserPlus size={15} style={{ color: "var(--primary)" }} />
            <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Manage collaborators
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

        {/* People list — scrollable */}
        <div className="px-6 pt-4 pb-2 border-b shrink-0" style={{ borderColor: "var(--border)" }}>
          <p className="text-xs mb-3" style={{ color: "var(--text-secondary)" }}>
            {collaborators.length} {collaborators.length === 1 ? "person" : "people"} with access
          </p>
          <div className="flex flex-col gap-1 pr-1">
            {collaborators.map((c) => (
              <CollaboratorRow
                key={c.id}
                collaborator={c}
                documentId={documentId}
                onRefresh={onRefresh}
              />
            ))}
          </div>
        </div>

        {/* Invite form — fixed */}
        <div className="px-6 py-4 shrink-0">
          <p className="text-xs mb-3 font-semibold" style={{ color: "var(--text-primary)" }}>
            Invite someone
          </p>
          <div className="flex gap-2 mb-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@example.com"
              className="flex-1 rounded-md border px-3 py-2 text-xs outline-none font-mono"
              style={{
                backgroundColor: "var(--background)",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
              }}
              onFocus={(e) =>
                ((e.currentTarget as HTMLInputElement).style.borderColor = "var(--primary)")
              }
              onBlur={(e) =>
                ((e.currentTarget as HTMLInputElement).style.borderColor = "var(--border)")
              }
              onKeyDown={(e) => e.key === "Enter" && handleInvite()}
            />

            {/* Role picker */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen((o) => !o)}
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-md border font-mono h-full"
                style={{
                  borderColor: roleDropdownOpen ? "var(--primary)" : "var(--border)",
                  color: "var(--text-primary)",
                  backgroundColor: "var(--background)",
                }}
              >
                <span>{selectedRole.label}</span>
                <ChevronDown
                  size={10}
                  style={{
                    transform: roleDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.15s",
                  }}
                />
              </button>

              {roleDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setRoleDropdownOpen(false)} />
                  <div
                    className="absolute right-0 bottom-full mb-1 rounded-md border z-20 overflow-hidden w-36"
                    style={{
                      backgroundColor: "var(--canvas)",
                      borderColor: "var(--border)",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                    }}
                  >
                    {ROLES.map((r) => (
                      <button
                        key={r.value}
                        onClick={() => {
                          setRole(r.value);
                          setRoleDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 transition-colors"
                        style={{
                          backgroundColor: role === r.value ? "var(--hover)" : "transparent",
                          color: "var(--text-primary)",
                        }}
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                            "var(--hover)")
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                            role === r.value ? "var(--hover)" : "transparent")
                        }
                      >
                        <div className="text-xs font-semibold font-mono">{r.label}</div>
                        <div
                          className="text-xs font-mono"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {r.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <PrimaryButton
              onClick={handleInvite}
              loading={inviting}
              disabled={!email || inviting}
              loadingText="Sending..."
            >
              Send Invite
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCollaboratorsModal;
