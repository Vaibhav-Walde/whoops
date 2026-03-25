import { DocumentUserRole, DocumentMemberRole } from "@/types/common";

export const ROLES: {
  value: DocumentUserRole;
  label: string;
  description: string;
}[] = [
  { value: "EDITOR", label: "Editor", description: "Can read and edit" },
  { value: "VIEWER", label: "Viewer", description: "Can only read" },
];

export const ROLE_COLORS: Record<DocumentMemberRole, string> = {
  OWNER: "#2563EB",
  EDITOR: "#22C55E",
  VIEWER: "#F59E0B",
};

export const roleLabel = (role: DocumentMemberRole) => role.charAt(0) + role.slice(1).toLowerCase();
