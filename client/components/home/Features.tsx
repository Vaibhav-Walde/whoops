import { Bell, GitBranch, Lock, Shield, Users, Zap } from "lucide-react";
import FadeUp from "../ui/FadeUp";

const features = [
  {
    icon: Users,
    title: "Real-time Collaboration",
    description:
      "See your teammates' cursors, selections, and edits live. Powered by Yjs CRDT — no conflicts, no data loss.",
    color: "#2563EB",
    bg: "#2563EB12",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description:
      "Assign OWNER, EDITOR, or VIEWER roles to each collaborator. Permissions propagate instantly via WebSocket awareness.",
    color: "#22C55E",
    bg: "#22C55E12",
  },
  {
    icon: GitBranch,
    title: "Version History",
    description:
      "Every save creates a binary Yjs snapshot. The latest 20 versions are always available. Never lose your work.",
    color: "#F59E0B",
    bg: "#F59E0B12",
  },
  {
    icon: Zap,
    title: "Rich Text Editor",
    description:
      "Headings, bold, italic, lists, text colors, and more — built on Tiptap for a familiar, powerful writing experience.",
    color: "#8B5CF6",
    bg: "#8B5CF612",
  },
  {
    icon: Bell,
    title: "Email Invitations",
    description:
      "Invite collaborators by email with a single click. They receive a branded invitation with a direct link to the document.",
    color: "#EC4899",
    bg: "#EC489912",
  },
  {
    icon: Lock,
    title: "Secure Authentication",
    description:
      "Sign in with Google, GitHub, or passwordless Email OTP. JWT-secured API with session management via NextAuth.",
    color: "#06B6D4",
    bg: "#06B6D412",
  },
];

const Features = () => (
  <section id="features" className="py-28 px-6" style={{ backgroundColor: "var(--background)" }}>
    <div className="max-w-6xl mx-auto">
      <FadeUp>
        <p
          className="text-center font-mono text-[10px] tracking-[0.4em] uppercase mb-3"
          style={{ color: "var(--primary)" }}
        >
          Features
        </p>
        <h2
          className="text-center font-mono font-bold text-3xl mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Everything your team needs
        </h2>
        <p
          className="text-center font-mono text-sm max-w-xl mx-auto mb-16"
          style={{ color: "var(--text-secondary)" }}
        >
          Draftly combines a powerful editor with real-time collaboration tools so your team can
          focus on writing, not logistics.
        </p>
      </FadeUp>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f, i) => (
          <FadeUp key={f.title} delay={i * 70}>
            <div
              className="p-6 rounded-xl border h-full transition-all duration-200"
              style={{
                backgroundColor: "var(--canvas)",
                borderColor: "var(--border)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = f.color;
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 24px ${f.color}18`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)";
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: f.bg }}
              >
                <f.icon size={18} style={{ color: f.color }} />
              </div>
              <h3
                className="font-mono font-bold text-sm mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {f.title}
              </h3>
              <p
                className="font-mono text-xs leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {f.description}
              </p>
            </div>
          </FadeUp>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
