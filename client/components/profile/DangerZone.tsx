"use client";

import { Trash2 } from "lucide-react";

type DangerZoneProps = {
  handleDeleteAccount: () => void;
  deleting: boolean;
  deleteConfirm: boolean;
  setDeleteConfirm: (value: boolean) => void;
};

const DangerZone = ({
  handleDeleteAccount,
  deleting,
  deleteConfirm,
  setDeleteConfirm,
}: DangerZoneProps) => {
  return (
    <div
      className="px-8 py-6 border-t"
      style={{ borderColor: "var(--border)", backgroundColor: "#EF444408" }}
    >
      <p className="text-xs font-semibold mb-1" style={{ color: "var(--error)" }}>
        Danger zone
      </p>

      <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>
        Permanently delete your account and all associated documents. This cannot be undone.
      </p>

      <button
        onClick={handleDeleteAccount}
        disabled={deleting}
        className="flex items-center gap-2 text-xs px-3 py-2 rounded-md border font-mono transition-all disabled:opacity-50 cursor-pointer"
        style={{
          borderColor: "var(--error)",
          color: deleteConfirm ? "#ffffff" : "var(--error)",
          backgroundColor: deleteConfirm ? "var(--error)" : "transparent",
        }}
        onMouseEnter={(e) => {
          if (!deleteConfirm) {
            e.currentTarget.style.backgroundColor = "var(--error)";
            e.currentTarget.style.color = "#ffffff";
          }
        }}
        onMouseLeave={(e) => {
          if (!deleteConfirm) {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "var(--error)";
          }
        }}
      >
        {deleting ? (
          <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <Trash2 size={13} />
        )}

        {deleting ? "Deleting..." : deleteConfirm ? "Click again to confirm" : "Delete account"}
      </button>

      {deleteConfirm && !deleting && (
        <p className="text-xs mt-2" style={{ color: "var(--text-secondary)" }}>
          Are you sure? Click the button again to permanently delete your account.{" "}
          <button
            onClick={() => setDeleteConfirm(false)}
            className="underline cursor-pointer"
            style={{ color: "var(--primary)" }}
          >
            Cancel
          </button>
        </p>
      )}
    </div>
  );
};

export default DangerZone;
