import { Check } from "lucide-react";
import FadeUp from "../ui/FadeUp";

const techGroups = [
  {
    label: "Frontend",
    items: ["Next.js 15", "TypeScript", "Tailwind CSS", "Tiptap", "Yjs", "NextAuth.js"],
    color: "#2563EB",
  },
  {
    label: "Backend",
    items: ["Express.js", "TypeScript", "Prisma ORM", "PostgreSQL", "Redis", "y-websocket"],
    color: "#22C55E",
  },
  {
    label: "Infrastructure",
    items: ["Supabase", "JWT Auth", "Resend", "node-cron", "Winston", "WebSockets"],
    color: "#F59E0B",
  },
];

const TechStack = () => (
  <section
    id="tech-stack"
    className="py-28 px-6 border-t"
    style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
  >
    <div className="max-w-5xl mx-auto">
      <FadeUp>
        <p
          className="text-center font-mono text-[10px] tracking-[0.4em] uppercase mb-3"
          style={{ color: "var(--primary)" }}
        >
          Tech Stack
        </p>
        <h2
          className="text-center font-mono font-bold text-3xl mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Built on solid foundations
        </h2>
        <p
          className="text-center font-mono text-sm max-w-lg mx-auto mb-16"
          style={{ color: "var(--text-secondary)" }}
        >
          Every technology was chosen for reliability, developer experience, and
          production-readiness.
        </p>
      </FadeUp>
      <div className="grid md:grid-cols-3 gap-6">
        {techGroups.map((group, gi) => (
          <FadeUp key={group.label} delay={gi * 100}>
            <div
              className="rounded-xl border overflow-hidden"
              style={{ backgroundColor: "var(--canvas)", borderColor: "var(--border)" }}
            >
              <div
                className="px-5 py-4 border-b flex items-center gap-2"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: group.color }} />
                <span
                  className="font-mono text-xs font-bold tracking-widest uppercase"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {group.label}
                </span>
              </div>
              <div className="p-4 flex flex-col gap-2">
                {group.items.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <Check size={12} style={{ color: group.color }} />
                    <span className="font-mono text-sm" style={{ color: "var(--text-primary)" }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </div>
  </section>
);

export default TechStack;
