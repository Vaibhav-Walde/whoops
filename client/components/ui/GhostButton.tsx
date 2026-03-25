"use client";

import { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  className?: string;
  onClick?: () => void;
}

const GhostButton = ({ label, icon: Icon, iconPosition = "left", className, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase transition-colors text-(--text-secondary) hover:text-(--text-primary) ${className ?? ""}`}
    >
      {Icon && iconPosition === "left" && <Icon className="w-3 h-3" strokeWidth={1.5} />}
      {label}
      {Icon && iconPosition === "right" && <Icon className="w-3 h-3" strokeWidth={1.5} />}
    </button>
  );
};

export default GhostButton;
