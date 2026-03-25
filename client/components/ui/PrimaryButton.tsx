"use client";

import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  loadingText?: string;
};

export default function PrimaryButton({
  loading,
  loadingText = "Loading...",
  disabled,
  children,
  className,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      disabled={loading || disabled}
      className={`px-6 py-2.5 text-sm font-semibold tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-md cursor-pointer ${className ?? ""}`}
      style={{ backgroundColor: "var(--primary)", color: "#ffffff" }}
      onMouseEnter={(e) => {
        if (!loading && !disabled)
          (e.currentTarget as HTMLElement).style.backgroundColor = "var(--primary-hover)";
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = "var(--primary)";
        onMouseLeave?.(e);
      }}
    >
      {loading ? loadingText : children}
    </button>
  );
}
