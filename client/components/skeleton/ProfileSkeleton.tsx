const ProfileSkeleton = () => (
  <div className="animate-pulse">
    <div
      className="flex items-center gap-6 mb-10 pb-10 border-b"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="w-20 h-20 rounded-full" style={{ backgroundColor: "var(--hover)" }} />
      <div className="flex flex-col gap-2">
        <div className="w-32 h-4 rounded" style={{ backgroundColor: "var(--hover)" }} />
        <div className="w-48 h-3 rounded" style={{ backgroundColor: "var(--hover)" }} />
        <div className="w-20 h-6 rounded" style={{ backgroundColor: "var(--hover)" }} />
      </div>
    </div>
    <div className="flex flex-col gap-5">
      {[1, 2].map((i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="w-16 h-3 rounded" style={{ backgroundColor: "var(--hover)" }} />
          <div className="w-full h-9 rounded" style={{ backgroundColor: "var(--hover)" }} />
        </div>
      ))}
    </div>
  </div>
);

export default ProfileSkeleton;
