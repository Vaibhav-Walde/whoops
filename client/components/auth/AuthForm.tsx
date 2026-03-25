"use client";

import { useState } from "react";
import { ArrowRight, FileText } from "lucide-react";
import { signIn } from "next-auth/react";
import GoogleButton from "@/components/auth/GoogleButton";
import GithubButton from "@/components/auth/GithubButton";
import OtpModal from "./OtpModal";
import Input from "@/components/ui/Input";
import api, { getErrorMessage } from "@/utils/axios.util";
import { useToast } from "@/context/ToastContext";

type LoadingState = {
  google: boolean;
  github: boolean;
  email: boolean;
  otp: boolean;
};

interface AuthFormProps {
  mode: "signup" | "login";
}

const AuthForm = ({ mode }: AuthFormProps) => {
  const isSignup = mode === "signup";

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [loading, setLoading] = useState<LoadingState>({
    google: false,
    github: false,
    email: false,
    otp: false,
  });
  const { error, success } = useToast();

  const isAnyLoading = Object.values(loading).some(Boolean);

  const setLoadingKey = (key: keyof LoadingState, value: boolean) =>
    setLoading((prev) => ({ ...prev, [key]: value }));

  const handleGoogle = async () => {
    setLoadingKey("google", true);
    await signIn("google", { callbackUrl: "/dashboard" });
    setLoadingKey("google", false);
  };

  const handleGithub = async () => {
    setLoadingKey("github", true);
    await signIn("github", { callbackUrl: "/dashboard" });
    setLoadingKey("github", false);
  };

  const handleEmail = async () => {
    if (!email.trim()) return;
    if (isSignup && !name.trim()) return;
    setLoadingKey("email", true);
    try {
      await api.post("/auth/send-otp", { email, isSignup });
      success("OTP sent successfully");
      setShowOtpModal(true);
    } catch (err: unknown) {
      error(getErrorMessage(err));
    } finally {
      setLoadingKey("email", false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleOtpSubmit = async () => {
    const code = otp.join("");
    if (code.length < 4) return;
    setLoadingKey("otp", true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        name,
        email,
        otp: code,
        isSignup: isSignup ? "true" : "false",
      });
      if (result?.error) {
        error("Invalid OTP");
      } else {
        success("OTP verified successfully");
      }
    } catch (err) {
      error(getErrorMessage(err));
    } finally {
      setLoadingKey("otp", false);
    }
  };

  const handleCloseModal = () => {
    setShowOtpModal(false);
    setOtp(["", "", "", ""]);
  };

  const isEmailReady = email.trim() && (isSignup ? name.trim() : true);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="w-full max-w-sm md:max-w-xl">
        {/* Card */}
        <div
          className="rounded-xl border overflow-hidden"
          style={{
            backgroundColor: "var(--canvas)",
            borderColor: "var(--border)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          }}
        >
          {/* Top accent */}
          <div className="h-1 w-full" style={{ backgroundColor: "var(--primary)" }} />

          <div className="p-8 space-y-6">
            {/* Header */}
            <div className="text-center space-y-3">
              <div
                className="inline-flex items-center justify-center w-11 h-11 rounded-xl"
                style={{ backgroundColor: "var(--primary)" }}
              >
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1
                  className="text-xl font-bold font-mono"
                  style={{ color: "var(--text-primary)" }}
                >
                  {isSignup ? "Create your account" : "Welcome back"}
                </h1>
                <p className="text-xs font-mono mt-1" style={{ color: "var(--text-secondary)" }}>
                  {isSignup ? "Start writing with" : "Sign in to"}{" "}
                  <span className="font-semibold" style={{ color: "var(--primary)" }}>
                    Whoops
                  </span>
                </p>
              </div>
            </div>

            {/* Fields */}
            <div className="space-y-3">
              {isSignup && (
                <Input
                  label="Full name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isAnyLoading}
                  className="rounded-md font-mono text-sm"
                />
              )}
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isAnyLoading}
                onKeyDown={(e) => e.key === "Enter" && handleEmail()}
                className="rounded-md font-mono text-sm"
              />

              <button
                onClick={handleEmail}
                disabled={isAnyLoading || !isEmailReady}
                className="w-full py-2.5 rounded-md text-sm font-mono font-semibold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "var(--primary)" }}
                onMouseEnter={(e) => {
                  if (!isAnyLoading && isEmailReady)
                    (e.currentTarget as HTMLButtonElement).style.opacity = "0.9";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.opacity = "1";
                }}
              >
                {loading.email ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <p className="flex items-center justify-center gap-2">
                    <span>Continue with Email</span>
                    <ArrowRight size={12} />
                  </p>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
              <span
                className="text-[10px] font-mono tracking-widest uppercase"
                style={{ color: "var(--text-secondary)" }}
              >
                or
              </span>
              <div className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
            </div>

            {/* OAuth */}
            <div className="space-y-2.5">
              <GoogleButton
                onclick={handleGoogle}
                loading={loading.google}
                disabled={isAnyLoading}
              />
              <GithubButton
                onclick={handleGithub}
                loading={loading.github}
                disabled={isAnyLoading}
              />
            </div>

            {/* Footer */}
            <p className="text-center text-xs font-mono" style={{ color: "var(--text-secondary)" }}>
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <a
                href={isSignup ? "/auth/login" : "/auth/signup"}
                className="font-semibold transition-colors"
                style={{ color: "var(--primary)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.8")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
              >
                {isSignup ? "Sign in" : "Sign up"}
              </a>
            </p>
          </div>
        </div>
      </div>

      {showOtpModal && (
        <OtpModal
          email={email}
          otp={otp}
          loadingOtp={loading.otp}
          isAnyLoading={isAnyLoading}
          onOtpChange={handleOtpChange}
          onOtpKeyDown={handleOtpKeyDown}
          onSubmit={handleOtpSubmit}
          onResend={handleEmail}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default AuthForm;
