"use client";

import { useState } from "react";
import { DocumentMember } from "@/types/common";
import Tooltip from "@/components/ui/Tootip";
import { ROLE_COLORS, roleLabel } from "./constants";
import Image from "next/image";
import { getInitials } from "@/utils/common.util";

const CollaboratorAvatar = ({ collaborator }: { collaborator: DocumentMember }) => {
  const [imgError, setImgError] = useState(false);
  const roleColor = ROLE_COLORS[collaborator.role];

  return (
    <Tooltip label={`${collaborator.user.name} · ${roleLabel(collaborator.role)}`}>
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer select-none overflow-hidden shrink-0"
        style={{
          border: `2px solid ${roleColor}`,
          backgroundColor: "var(--canvas)",
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
    </Tooltip>
  );
};

export default CollaboratorAvatar;
