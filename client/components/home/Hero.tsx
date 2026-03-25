"use client";

import { ArrowRight, ChevronDown, File } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import FakeMenuBar from "./FakeMenuBar";

const Hero = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          opacity: 0.4,
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 100%)",
        }}
      />

      {/* Glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(37,99,235,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Badge */}
      <div
        className="relative flex items-center gap-2 px-4 py-1.5 rounded-full border font-mono text-xs mb-8"
        style={{
          borderColor: "rgba(37,99,235,0.3)",
          backgroundColor: "rgba(37,99,235,0.06)",
          color: "var(--primary)",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(-12px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ backgroundColor: "var(--primary)" }}
        />
        Real-time collaborative editing
      </div>

      {/* Headline */}
      <h1
        className="relative text-center font-mono font-bold leading-tight mb-6 max-w-3xl"
        style={{
          fontSize: "clamp(2.2rem, 6vw, 4rem)",
          color: "var(--text-primary)",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
        }}
      >
        Write together,{" "}
        <span
          style={{
            backgroundImage: "linear-gradient(135deg, #2563EB, #60A5FA)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          in real time.
        </span>
      </h1>

      {/* Sub */}
      <p
        className="relative text-center font-mono text-base max-w-xl mb-10 leading-relaxed"
        style={{
          color: "var(--text-secondary)",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
        }}
      >
        Whoops is a document editor built for collaboration. Invite your team, assign roles, and
        watch edits appear live — with full version history and zero data loss.
      </p>

      {/* CTAs */}
      <div
        className="relative flex flex-col sm:flex-row items-center gap-3"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
        }}
      >
        <Link
          href="/auth/signup"
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-md font-mono text-sm font-semibold transition-all w-full min-w-fit"
          style={{
            backgroundColor: "var(--primary)",
            color: "#fff",
            boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow =
              "0 6px 20px rgba(37,99,235,0.45)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow =
              "0 4px 14px rgba(37,99,235,0.35)";
          }}
        >
          Start for free <ArrowRight size={15} />
        </Link>
        <a
          href="#features"
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-md font-mono text-sm border transition-all w-full min-w-fit"
          style={{
            borderColor: "var(--border)",
            color: "var(--text-primary)",
            backgroundColor: "var(--canvas)",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--primary)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)")
          }
        >
          See features
        </a>
      </div>

      {/* Floating editor preview */}
      <div
        className="relative mt-20 w-full max-w-4xl"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(40px)",
          transition: "opacity 0.8s ease 0.5s, transform 0.8s ease 0.5s",
        }}
      >
        <div
          className="rounded-xl border overflow-hidden"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--canvas)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          {/* Window chrome */}
          <div
            className="flex items-center gap-2 px-4 py-3 border-b"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
          >
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#EF4444" }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#F59E0B" }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#22C55E" }} />
            <div className="flex-1 mx-4">
              <div
                className="mx-auto w-48 h-5 rounded-md text-[10px] font-mono flex items-center justify-center"
                style={{ backgroundColor: "var(--hover)", color: "var(--text-secondary)" }}
              >
                Whoops.app/dashboard/document
              </div>
            </div>
            <div className="flex -space-x-2">
              {["#E03131", "#2563EB", "#22C55E"].map((c, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-[9px] font-mono text-white font-bold"
                  style={{ backgroundColor: c, borderColor: "var(--background)" }}
                >
                  {["S", "A", "R"][i]}
                </div>
              ))}
            </div>
          </div>

          {/* Editor body */}
          <div className="p-8">
            <div
              className="rounded-lg border mb-6 overflow-hidden"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="h-1" style={{ backgroundColor: "var(--primary)" }} />
              <div className="p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center text-sm"
                    style={{ backgroundColor: "#2563EB15" }}
                  >
                    <File size={12} />
                  </div>
                  <span
                    className="font-mono font-bold text-lg"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Q4 Product Roadmap
                  </span>
                </div>
                <p
                  className="font-mono text-sm ml-10 line-clamp-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Outlining key initiatives for Q4 2025 — engineering, design, and growth.
                </p>
              </div>
            </div>

            <FakeMenuBar />

            <div
              className="font-mono text-sm leading-loose space-y-3 mt-2"
              style={{ color: "var(--text-primary)" }}
            >
              <p className="font-bold text-base">Overview</p>
              <p style={{ color: "var(--text-secondary)" }}>
                This document outlines our strategic priorities for the upcoming quarter. The focus
                areas include platform stability, user growth, and new collaboration features.
              </p>
              <div className="relative inline-flex items-center">
                <span style={{ color: "var(--text-secondary)" }}>
                  Real-time editing powered by{" "}
                </span>
              </div>
              <p style={{ color: "var(--text-secondary)" }}>
                Yjs with WebSocket for seamless collaboration across distributed teams.
              </p>
              <div className="relative inline-flex items-center">
                <span
                  className="inline-block w-0.5 h-4 mx-0.5 animate-pulse"
                  style={{ backgroundColor: "#2563EB", animationDelay: "0.5s" }}
                />
                <span
                  className="absolute -top-6 left-0 text-[9px] px-1.5 py-0.5 rounded font-mono text-white whitespace-nowrap"
                  style={{ backgroundColor: "#2563EB" }}
                >
                  Alice
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        style={{
          opacity: mounted ? 0.5 : 0,
          transition: "opacity 0.6s ease 1s",
          color: "var(--text-secondary)",
        }}
      >
        <span className="text-[10px] font-mono tracking-widest uppercase">Scroll</span>
        <ChevronDown size={14} className="animate-bounce" />
      </div>
    </section>
  );
};

export default Hero;
