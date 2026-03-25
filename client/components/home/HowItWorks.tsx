"use client";

import { FileText, Lock, MousePointer2, Users, ArrowRight } from "lucide-react";
import FadeUp from "../ui/FadeUp";
import { useRef, useState, useEffect } from "react";

const steps = [
  {
    n: "01",
    title: "Create an account",
    description:
      "Sign up in seconds with Google, GitHub, or your email address. No password required — we use OTP for email sign-in.",
    icon: Lock,
    color: "#2563EB",
    bg: "#2563EB12",
  },
  {
    n: "02",
    title: "Create a document",
    description:
      "Click 'New document', give it a title and description. Your document is instantly saved and ready to edit.",
    icon: FileText,
    color: "#22C55E",
    bg: "#22C55E12",
  },
  {
    n: "03",
    title: "Invite collaborators",
    description:
      "Enter a collaborator's email and choose their role — Editor or Viewer. They'll receive an invitation email with a direct link.",
    icon: Users,
    color: "#F59E0B",
    bg: "#F59E0B12",
  },
  {
    n: "04",
    title: "Write together",
    description:
      "Open the document and start editing. See your teammates' cursors live. Changes are auto-saved every 2 seconds.",
    icon: MousePointer2,
    color: "#8B5CF6",
    bg: "#8B5CF612",
  },
];

// Add custom keyframe styles
const animationStyles = `
  @keyframes slideInFade {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes pulse-glow {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(var(--color-rgb), 0.15);
    }
    50% {
      box-shadow: 0 0 0 8px rgba(var(--color-rgb), 0);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-8px);
    }
  }

  @keyframes lineGrow {
    from {
      opacity: 0;
      height: 0;
    }
    to {
      opacity: 1;
      height: 100%;
    }
  }
  
  .animate-slide-in-fade {
    animation: slideInFade 0.6s ease-out forwards;
  }

  .animate-scale-in {
    animation: scaleIn 0.5s ease-out forwards;
  }

  .animate-float {
    animation: float 3s ease-in-out infinite;
  }

  .animate-line-grow {
    animation: lineGrow 1.2s ease-out forwards;
  }
`;

const useStepInView = () => {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeSteps, setActiveSteps] = useState<boolean[]>(new Array(steps.length).fill(false));

  useEffect(() => {
    const observers = refs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSteps((prev) => {
              const next = [...prev];
              next[i] = true;
              return next;
            });
          }
        },
        { threshold: 0.4 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return { refs, activeSteps };
};

const StepCard = ({
  s,
  active,
  index,
}: {
  s: (typeof steps)[0];
  active: boolean;
  index: number;
}) => (
  <div
    className="max-w-xs group"
    style={{
      animation: active ? `slideInFade 0.6s ease-out ${index * 100}ms both` : "none",
    }}
  >
    <div
      className="p-6 rounded-2xl border backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-default"
      style={{
        backgroundColor: active ? `${s.color}08` : "var(--background)",
        borderColor: active ? `${s.color}40` : "var(--border)",
        boxShadow: active
          ? `0 8px 24px ${s.color}20, inset 0 1px 1px ${s.color}10`
          : "0 2px 8px rgba(0, 0, 0, 0.04)",
      }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-110"
          style={{
            backgroundColor: s.bg,
            border: `1.5px solid ${s.color}40`,
          }}
        >
          <s.icon size={18} style={{ color: s.color }} strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          <h3
            className="font-mono font-bold text-sm leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {s.title}
          </h3>
        </div>
      </div>
      <p
        className="font-mono text-xs leading-relaxed opacity-80 transition-opacity duration-300 group-hover:opacity-100"
        style={{ color: "var(--text-secondary)" }}
      >
        {s.description}
      </p>
    </div>
  </div>
);

const HowItWorks = () => {
  const { refs, activeSteps } = useStepInView();

  return (
    <>
      <style>{animationStyles}</style>
      <section
        id="how-it-works"
        className="relative py-32 px-6 border-t overflow-hidden"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--canvas)" }}
      >
        {/* Ambient gradient background */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            background: "radial-gradient(circle at 20% 50%, #2563EB 0%, transparent 50%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            background: "radial-gradient(circle at 80% 80%, #8B5CF6 0%, transparent 50%)",
          }}
        />

        <div className="max-w-5xl mx-auto relative z-10">
          <FadeUp>
            <div className="mb-4">
              <p
                className="text-center font-mono text-[10px] uppercase mb-4 tracking-widest"
                style={{ color: "var(--primary)" }}
              >
                How it works
              </p>
            </div>
            <h2
              className="text-center font-mono font-bold text-4xl md:text-5xl mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              Up and running in minutes
            </h2>
            <p
              className="text-center font-mono text-sm max-w-2xl mx-auto mb-24"
              style={{ color: "var(--text-secondary)" }}
            >
              No complex setup. No configuration files. Just sign up and start collaborating with
              your team instantly.
            </p>
          </FadeUp>

          <div className="relative">
            {/* Vertical timeline line with gradient */}
            <div
              className="absolute left-6.75 top-0 bottom-0 w-px sm:left-1/2 sm:-translate-x-1/2 hidden sm:block"
              style={{
                background:
                  "linear-gradient(to bottom, var(--border), #2563EB40, #8B5CF640, var(--border))",
              }}
            />

            <div className="space-y-12">
              {steps.map((s, i) => {
                const isEven = i % 2 === 0;
                return (
                  <div
                    key={s.n}
                    ref={(el) => {
                      refs.current[i] = el;
                    }}
                    className="relative flex items-center md:justify-center gap-6"
                    style={{
                      opacity: activeSteps[i] ? 1 : 0,
                      transform: activeSteps[i] ? "translateY(0)" : "translateY(24px)",
                      transition: `opacity 0.55s cubic-bezier(0.23, 1, 0.32, 1) ${i * 80}ms, transform 0.55s cubic-bezier(0.23, 1, 0.32, 1) ${i * 80}ms`,
                    }}
                  >
                    {/* ── Desktop: alternating layout ── */}
                    <div className="hidden md:flex w-full items-center gap-12">
                      {/* Left slot */}
                      <div className="flex-1 flex justify-end">
                        {isEven && <StepCard s={s} active={activeSteps[i]} index={i} />}
                      </div>

                      {/* Center node */}
                      <div className="relative flex items-center justify-center shrink-0 z-20">
                        <div
                          className="w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-500 group cursor-pointer hover:scale-110"
                          style={{
                            backgroundColor: activeSteps[i] ? s.bg : "var(--canvas)",
                            borderColor: activeSteps[i] ? s.color : "var(--border)",
                            boxShadow: activeSteps[i]
                              ? `0 0 0 8px ${s.color}12, inset 0 1px 2px ${s.color}08`
                              : "0 2px 8px rgba(0, 0, 0, 0.04)",
                          }}
                        >
                          <span
                            className="font-mono font-bold text-xs leading-none mb-1.5 transition-colors duration-300"
                            style={{ color: s.color }}
                          >
                            {s.n}
                          </span>
                          <s.icon size={20} style={{ color: s.color }} strokeWidth={2} />
                        </div>

                        {/* Connection arrow for next step */}
                        {i < steps.length - 1 && (
                          <div
                            className="absolute top-full mt-8 opacity-60 transition-opacity duration-300"
                            style={{
                              color: "var(--border)",
                            }}
                          >
                            <ArrowRight
                              size={20}
                              style={{
                                transform: "rotate(90deg)",
                                opacity: activeSteps[i + 1] ? 1 : 0.3,
                              }}
                              className="transition-opacity duration-300"
                            />
                          </div>
                        )}
                      </div>

                      {/* Right slot */}
                      <div className="flex-1 flex justify-start">
                        {!isEven && <StepCard s={s} active={activeSteps[i]} index={i} />}
                      </div>
                    </div>

                    {/* ── Mobile: left-aligned ── */}
                    <div className="flex md:hidden items-start gap-5 w-full">
                      <div className="relative flex flex-col items-center">
                        <div
                          className="w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center shrink-0 z-20 transition-all duration-500 hover:scale-110"
                          style={{
                            backgroundColor: activeSteps[i] ? s.bg : "var(--canvas)",
                            borderColor: activeSteps[i] ? s.color : "var(--border)",
                            boxShadow: activeSteps[i]
                              ? `0 0 0 6px ${s.color}12, inset 0 1px 2px ${s.color}08`
                              : "0 2px 8px rgba(0, 0, 0, 0.04)",
                          }}
                        >
                          <span
                            className="font-mono font-bold text-xs leading-none mb-1"
                            style={{ color: s.color }}
                          >
                            {s.n}
                          </span>
                          <s.icon size={16} style={{ color: s.color }} strokeWidth={2.5} />
                        </div>
                        {i < steps.length - 1 && (
                          <div
                            className="h-8 w-0.5 my-2 opacity-30 transition-opacity duration-300"
                            style={{
                              background: `linear-gradient(to bottom, ${s.color}40, transparent)`,
                            }}
                          />
                        )}
                      </div>

                      <div className="flex-1 pt-1">
                        <div
                          className="p-5 rounded-2xl border backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:-translate-y-1"
                          style={{
                            backgroundColor: activeSteps[i] ? `${s.color}08` : "var(--background)",
                            borderColor: activeSteps[i] ? `${s.color}40` : "var(--border)",
                            boxShadow: activeSteps[i]
                              ? `0 8px 24px ${s.color}20, inset 0 1px 1px ${s.color}10`
                              : "0 2px 8px rgba(0, 0, 0, 0.04)",
                          }}
                        >
                          <h3
                            className="font-mono font-bold text-sm mb-2"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {s.title}
                          </h3>
                          <p
                            className="font-mono text-xs leading-relaxed opacity-80 transition-opacity duration-300"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {s.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HowItWorks;
