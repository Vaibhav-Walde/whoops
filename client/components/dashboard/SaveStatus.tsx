import { DocumentSaving } from "@/types/common";
import { Check, CloudOff, Loader2 } from "lucide-react";

const SaveStatus = ({ status }: { status: DocumentSaving }) => {
  if (status === "saving")
    return (
      <div className="flex items-center gap-1.5">
        <Loader2 className="w-3 h-3 animate-spin" style={{ color: "var(--text-secondary)" }} />
        <span className="text-[11px] tracking-wide" style={{ color: "var(--text-secondary)" }}>
          Saving...
        </span>
      </div>
    );

  if (status === "saved")
    return (
      <div className="flex items-center gap-1.5">
        <Check className="w-3 h-3" style={{ color: "var(--success)" }} strokeWidth={2} />
        <span className="text-[11px] tracking-wide" style={{ color: "var(--success)" }}>
          Saved
        </span>
      </div>
    );

  if (status === "error")
    return (
      <div className="flex items-center gap-1.5">
        <CloudOff className="w-3 h-3" style={{ color: "var(--error)" }} strokeWidth={1.5} />
        <span className="text-[11px] tracking-wide" style={{ color: "var(--error)" }}>
          Failed to save
        </span>
      </div>
    );
};

export default SaveStatus;
