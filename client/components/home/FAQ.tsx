"use client";

import { ChevronDown } from "lucide-react";
import FadeUp from "../ui/FadeUp";
import { useState } from "react";

const faqs = [
  {
    q: "Is Whoops free to use?",
    a: "Yes — Whoops is completely free. Create unlimited documents, invite collaborators, and use all features at no cost.",
  },
  {
    q: "How does real-time collaboration work?",
    a: "Whoops uses Yjs, a CRDT library, combined with a WebSocket server. Every keystroke is synced across all connected clients instantly, with automatic conflict resolution.",
  },
  {
    q: "What happens if I lose connection?",
    a: "Yjs buffers your local changes. When your connection is restored, all pending updates are synced automatically. Content is also auto-saved every 2 seconds to the server.",
  },
  {
    q: "Can I control what collaborators can do?",
    a: "Yes. Each collaborator is assigned a role — Editor (can write) or Viewer (read-only). Roles can be changed or revoked at any time by the document owner.",
  },
  {
    q: "How does version history work?",
    a: "Every time content is saved, a new DocumentVersion is created storing the full Yjs binary state. Whoops keeps the latest 20 versions per document, cleaned up automatically every 12 hours.",
  },
  {
    q: "What login methods are supported?",
    a: "You can sign in with Google OAuth, GitHub OAuth, or passwordless Email OTP. No password is ever stored.",
  },
];

const FAQ = () => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section
      id="faq"
      className="py-28 px-6 border-t"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
    >
      <div className="max-w-3xl mx-auto">
        <FadeUp>
          <p
            className="text-center font-mono text-[10px] tracking-[0.4em] uppercase mb-3"
            style={{ color: "var(--primary)" }}
          >
            FAQ
          </p>
          <h2
            className="text-center font-mono font-bold text-3xl mb-16"
            style={{ color: "var(--text-primary)" }}
          >
            Common questions
          </h2>
        </FadeUp>
        <div className="flex flex-col gap-2">
          {faqs.map((faq, i) => (
            <FadeUp key={i} delay={i * 60}>
              <div
                className="rounded-lg border overflow-hidden transition-all"
                style={{
                  borderColor: open === i ? "var(--primary)" : "var(--border)",
                  backgroundColor: "var(--canvas)",
                }}
              >
                <button
                  className="w-full flex items-center justify-between px-5 py-4 font-mono text-sm font-semibold text-left gap-4"
                  style={{ color: "var(--text-primary)" }}
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={15}
                    style={{
                      color: "var(--text-secondary)",
                      flexShrink: 0,
                      transform: open === i ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                  />
                </button>
                <div
                  style={{
                    maxHeight: open === i ? "200px" : "0",
                    overflow: "hidden",
                    transition: "max-height 0.3s ease",
                  }}
                >
                  <p
                    className="px-5 pb-4 font-mono text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {faq.a}
                  </p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
