"use client";

import { DocumentMember } from "@/types/common";
import CollaboratorAvatar from "./CollaboratorAvatar";

const CollaboratorList = ({ collaborators }: { collaborators: DocumentMember[] }) => {
  if (!collaborators.length) return null;

  const visible = collaborators.slice(0, 5);
  const overflow = collaborators.length - 5;

  return (
    <div className="flex items-center">
      <div className="flex items-center">
        {visible.map((collaborator, i) => (
          <div
            key={collaborator.id}
            style={{ marginLeft: i === 0 ? 0 : "-8px", zIndex: visible.length - i }}
          >
            <CollaboratorAvatar collaborator={collaborator} />
          </div>
        ))}
      </div>
      {overflow > 0 && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center font-semibold ml-1 shrink-0"
          style={{
            backgroundColor: "var(--hover)",
            color: "var(--text-secondary)",
            border: "2px solid var(--border)",
            fontSize: "10px",
            fontFamily: "monospace",
          }}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
};

export default CollaboratorList;
