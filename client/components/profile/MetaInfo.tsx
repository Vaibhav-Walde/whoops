import React from "react";

const MetaInfo = ({ createdAt, updatedAt }: { createdAt: string; updatedAt: string }) => {
  return (
    <div
      className="grid grid-cols-2 gap-3 pt-2 border-t text-xs"
      style={{ borderColor: "var(--border)" }}
    >
      <div>
        <p style={{ color: "var(--text-secondary)" }}>Member since</p>
        <p className="mt-0.5" style={{ color: "var(--text-primary)" }}>
          {new Date(createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
      <div>
        <p style={{ color: "var(--text-secondary)" }}>Last updated</p>
        <p className="mt-0.5" style={{ color: "var(--text-primary)" }}>
          {new Date(updatedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </div>
  );
};

export default MetaInfo;
