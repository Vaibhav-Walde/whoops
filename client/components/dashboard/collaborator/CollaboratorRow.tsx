"use client";

import { useState } from "react";
import { Trash2, Crown, Eye, Pencil } from "lucide-react";
import { DocumentMember, DocumentUserRole } from "@/types/common";
import { useToast } from "@/context/ToastContext";
import api, { getErrorMessage } from "@/utils/axios.util";
import RoleDropdown from "./RoleDropdown";
import { ROLE_COLORS } from "./constants";
import Image from "next/image";
import { getProviderForDocument } from "@/utils/collaboration.util";
import { getInitials } from "@/utils/common.util";

const roleIcons: Record<string, React.ReactNode> = {
  OWNER: <Crown size={11} />,
  EDITOR: <Pencil size={11} />,
  VIEWER: <Eye size={11} />,
};

const CollaboratorRow = ({
  collaborator,
  documentId,
  onRefresh,
}: {
  collaborator: DocumentMember;
  documentId: string;
  onRefresh: () => void;
}) => {
  const [imgError, setImgError] = useState(false);
  const [removing, setRemoving] = useState(false);
  const { success, error } = useToast();
  const roleColor = ROLE_COLORS[collaborator.role];
  const isOwner = collaborator.role === "OWNER";

  const handleRemove = async () => {
    try {
      setRemoving(true);
      await api.delete(`/document/${documentId}/collaborators/${collaborator.user.id}`);

      // broadcast removal to affected user
      const provider = getProviderForDocument(documentId);
      if (provider) {
        const current = provider.awareness.getLocalState() ?? {};
        provider.awareness.setLocalState({
          ...current,
          removalUpdate: { email: collaborator.user.email },
        });
      }
      success("Collaborator removed");
      onRefresh();
    } catch (err) {
      error(getErrorMessage(err));
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="flex items-center justify-between py-1.5">
      {/* User info */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center overflow-hidden shrink-0"
          style={{
            border: `2px solid ${roleColor}`,
            backgroundColor: "var(--background)",
            color: "var(--text-primary)",
          }}
        >
          {collaborator.user.imageUrl && !imgError ? (
            <Image
              height={50}
              width={50}
              src={collaborator.user.imageUrl}
              alt={collaborator.user.name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <span style={{ fontSize: "10px", fontFamily: "monospace" }}>
              {getInitials(collaborator.user.name)}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>
            {collaborator.user.name}
          </p>
          <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
            {collaborator.user.email}
          </p>
        </div>
      </div>

      {/* Role / actions */}
      <div className="flex items-center gap-1.5 ml-2 shrink-0">
        {isOwner ? (
          <div
            className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: `${roleColor}20`,
              color: roleColor,
            }}
          >
            {roleIcons["OWNER"]}
            <span>Owner</span>
          </div>
        ) : (
          <>
            <RoleDropdown
              currentRole={collaborator.role as DocumentUserRole}
              collaboratorId={collaborator.user.id}
              documentId={documentId}
              collaboratorEmail={collaborator.user.email}
              onUpdated={onRefresh}
            />
            <button
              onClick={handleRemove}
              disabled={removing}
              className="p-1 rounded transition-colors"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "var(--error)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)")
              }
            >
              {removing ? (
                <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin block" />
              ) : (
                <Trash2 size={13} className="cursor-pointer" />
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CollaboratorRow;
