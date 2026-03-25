import { User } from "@/types/common";
import { getInitials } from "@/utils/common.util";
import { Camera } from "lucide-react";
import Image from "next/image";
import React from "react";

const providerLabel: Record<string, string> = {
  GOOGLE: "Google",
  GITHUB: "GitHub",
  EMAIL: "Email",
};

type AvatarSectionProps = {
  profile: User;
  color: string;
  imgError: boolean;
  setImgError: (value: boolean) => void;
  setImageModalOpen: (value: boolean) => void;
};

const AvatarSection = ({
  profile,
  color,
  imgError,
  setImgError,
  setImageModalOpen,
}: AvatarSectionProps) => {
  return (
    <div
      className="px-8 py-7 border-b flex items-center gap-6"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="relative">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden"
          style={{ border: `3px solid ${color}`, backgroundColor: "var(--background)" }}
        >
          {profile.imageUrl && !imgError ? (
            <Image
              height={80}
              width={80}
              src={profile.imageUrl}
              alt={profile.name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <span
              className="font-semibold text-xl"
              style={{ color: "var(--text-primary)", fontFamily: "monospace" }}
            >
              {getInitials(profile.name)}
            </span>
          )}
        </div>

        {/* Camera button */}
        <button
          onClick={() => setImageModalOpen(true)}
          className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors"
          style={{
            backgroundColor: "var(--canvas)",
            borderColor: "var(--background)",
            color: "var(--text-secondary)",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.color = "var(--primary)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)")
          }
        >
          <Camera size={12} />
        </button>
      </div>

      <div>
        <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {profile.name}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
          {profile.email}
        </p>
        <div
          className="inline-flex items-center gap-1 mt-2 text-[10px] px-2 py-0.5 rounded-full font-mono"
          style={{ backgroundColor: "var(--hover)", color: "var(--text-secondary)" }}
        >
          {providerLabel[profile.provider]} account
        </div>
      </div>
    </div>
  );
};

export default AvatarSection;
