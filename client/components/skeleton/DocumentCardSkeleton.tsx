import React from "react";

const DocumentCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-20 rounded-md animate-pulse"
          style={{ backgroundColor: "var(--canvas)" }}
        />
      ))}
    </div>
  );
};

export default DocumentCardSkeleton;
