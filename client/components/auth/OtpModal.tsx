"use client";

import { X, ShieldCheck, Mail } from "lucide-react";
import { useEffect, useRef } from "react";

interface OtpModalProps {
  email: string;
  otp: string[];
  loadingOtp: boolean;
  isAnyLoading: boolean;
  onOtpChange: (index: number, value: string) => void;
  onOtpKeyDown: (index: number, e: React.KeyboardEvent) => void;
  onSubmit: () => void;
  onResend: () => void;
  onClose: () => void;
}

const OtpModal = ({
  email,
  otp,
  loadingOtp,
  isAnyLoading,
  onOtpChange,
  onOtpKeyDown,
  onSubmit,
  onResend,
  onClose,
}: OtpModalProps) => {
  const firstInputRef = useRef<HTMLInputElement>(null);
  const filled = otp.filter(Boolean).length;
  const progress = (filled / otp.length) * 100;
  const allFilled = filled === otp.length;

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-xl border overflow-hidden"
        style={{
          backgroundColor: "var(--canvas)",
          borderColor: "var(--border)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          animation: "modalIn 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress bar */}
        <div className="h-1 w-full" style={{ backgroundColor: "var(--border)" }}>
          <div
            className="h-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%`, backgroundColor: "var(--primary)" }}
          />
        </div>

        <div className="p-7 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: "#2563EB15" }}
              >
                {allFilled ? (
                  <ShieldCheck size={16} style={{ color: "var(--primary)" }} />
                ) : (
                  <Mail size={16} style={{ color: "var(--primary)" }} />
                )}
              </div>
              <div>
                <h2
                  className="text-sm font-bold font-mono"
                  style={{ color: "var(--text-primary)" }}
                >
                  Check your inbox
                </h2>
                <p className="text-xs font-mono mt-0.5" style={{ color: "var(--text-secondary)" }}>
                  Code sent to <span style={{ color: "var(--text-primary)" }}>{email}</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="transition-colors p-1 rounded-md"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)")
              }
            >
              <X size={14} />
            </button>
          </div>

          {/* OTP Inputs */}
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <div key={index} className="relative">
                <input
                  ref={index === 0 ? firstInputRef : undefined}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => onOtpChange(index, e.target.value)}
                  onKeyDown={(e) => onOtpKeyDown(index, e)}
                  className="w-13 h-13 text-center text-xl font-bold font-mono rounded-lg outline-none transition-all border-2"
                  style={{
                    width: "52px",
                    height: "52px",
                    borderColor: digit ? "var(--primary)" : "var(--border)",
                    color: "var(--text-primary)",
                    backgroundColor: digit ? "#2563EB08" : "var(--background)",
                    boxShadow: digit ? "0 0 0 3px rgba(37,99,235,0.1)" : "none",
                  }}
                />
                {digit && (
                  <div
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ backgroundColor: "var(--primary)" }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={onSubmit}
              disabled={!allFilled || loadingOtp}
              className="w-full py-2.5 rounded-md text-sm font-mono font-semibold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "var(--primary)" }}
            >
              {loadingOtp ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </>
              ) : allFilled ? (
                <>
                  <ShieldCheck size={14} />
                  Verify code
                </>
              ) : (
                "Enter all digits to verify"
              )}
            </button>

            <p className="text-center text-xs font-mono" style={{ color: "var(--text-secondary)" }}>
              Didn&apos;t receive the code?{" "}
              <button
                onClick={onResend}
                disabled={isAnyLoading}
                className="font-semibold transition-colors disabled:opacity-40"
                style={{ color: "var(--primary)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.8")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
              >
                Resend
              </button>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default OtpModal;
