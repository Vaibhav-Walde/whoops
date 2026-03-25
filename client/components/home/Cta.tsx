import Link from "next/link";
import FadeUp from "../ui/FadeUp";
import { ArrowRight } from "lucide-react";

const CTABanner = () => (
  <section
    className="py-28 px-6 border-t"
    style={{ borderColor: "var(--border)", backgroundColor: "var(--canvas)" }}
  >
    <FadeUp>
      <div
        className="max-w-4xl mx-auto rounded-2xl border relative overflow-hidden p-12 text-center"
        style={{ borderColor: "rgba(37,99,235,0.3)", backgroundColor: "rgba(37,99,235,0.04)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(37,99,235,0.08) 0%, transparent 70%)",
          }}
        />
        <p
          className="relative font-mono text-[10px] tracking-[0.4em] uppercase mb-4"
          style={{ color: "var(--primary)" }}
        >
          Get started today
        </p>
        <h2
          className="relative font-mono font-bold text-3xl mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Ready to write together?
        </h2>
        <p
          className="relative font-mono text-sm mb-10 max-w-md mx-auto"
          style={{ color: "var(--text-secondary)" }}
        >
          Join Draftly and experience real-time document collaboration. Free, fast, and built for
          teams.
        </p>
        <Link
          href="/auth/signup"
          className="relative inline-flex items-center justify-center gap-2 px-4 md:px-8 py-3.5 rounded-md font-mono text-sm font-semibold transition-all"
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
          Create your account <ArrowRight size={15} />
        </Link>
      </div>
    </FadeUp>
  </section>
);

export default CTABanner;
