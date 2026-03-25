"use client";

import GhostButton from "../ui/GhostButton";
import { ArrowLeft } from "lucide-react";
import ProfileSkeleton from "../skeleton/ProfileSkeleton";
import { useRouter } from "next/navigation";

const LoadingProfile = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen font-mono p-10" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-xl mx-auto">
        <div className="mb-10">
          <GhostButton label="Back" icon={ArrowLeft} onClick={() => router.back()} />
        </div>
        <p
          className="text-[10px] tracking-[0.4em] uppercase mb-2"
          style={{ color: "var(--text-secondary)" }}
        >
          Profile
        </p>
        <h1 className="text-xl font-semibold mb-10" style={{ color: "var(--text-primary)" }}>
          Your account
        </h1>
        <ProfileSkeleton />
      </div>
    </div>
  );
};

export default LoadingProfile;
