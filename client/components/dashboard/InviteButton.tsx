"use client";

import { UserPlus } from "lucide-react";

const InviteButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-md border transition-colors duration-150 cursor-pointer"
      style={{
        borderColor: "var(--border)",
        color: "var(--text-secondary)",
        backgroundColor: "transparent",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--hover)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
      }}
    >
      <UserPlus size={13} />
      Invite
    </button>
  );
};

export default InviteButton;
