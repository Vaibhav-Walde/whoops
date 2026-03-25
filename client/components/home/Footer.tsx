import { FileText } from "lucide-react";
import Link from "next/link";

const Footer = () => (
  <footer
    className="border-t py-12 px-6"
    style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
  >
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-12">
        <div className="max-w-xs">
          <div
            className="flex items-center gap-2.5 font-mono font-bold text-lg mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "var(--primary)" }}
            >
              <FileText className="w-4 h-4 text-white" />
            </div>
            Draftly
          </div>
          <p
            className="font-mono text-xs leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            A real-time collaborative document editor built for teams who value speed and
            simplicity.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
          {[
            {
              heading: "Product",
              links: [
                { label: "Home", href: "#home" },
                { label: "Features", href: "#features" },
                { label: "How it works", href: "#how-it-works" },
                { label: "Tech Stack", href: "#tech-stack" },
                { label: "FAQ", href: "#faq" },
              ],
            },
            {
              heading: "Account",
              links: [
                { label: "Sign in", href: "/auth/login" },
                { label: "Register", href: "/auth/signup" },
                { label: "Dashboard", href: "/dashboard" },
                { label: "Profile", href: "/dashboard/profile" },
              ],
            },
            {
              heading: "Project",
              links: [
                { label: "GitHub", href: "https://github.com/SHIVAM-KUMAR-59" },
                { label: "README", href: "https://github.com/SHIVAM-KUMAR-59/draftly" },
              ],
            },
          ].map((col) => (
            <div key={col.heading}>
              <p
                className="font-mono text-[10px] tracking-[0.3em] uppercase mb-4 font-bold"
                style={{ color: "var(--text-secondary)" }}
              >
                {col.heading}
              </p>
              <div className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    className="font-mono text-xs transition-colors"
                    style={{ color: "var(--text-secondary)" }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)")
                    }
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <p className="font-mono text-xs" style={{ color: "var(--text-secondary)" }}>
          © {new Date().getFullYear()} Draftly. All rights reserved.
        </p>
        <p className="font-mono text-xs" style={{ color: "var(--text-secondary)" }}>
          Built with ❤️ by{" "}
          <Link
            href="https://github.com/SHIVAM-KUMAR-59"
            className="underline cursor-pointer"
            style={{ color: "var(--primary)" }}
            target="_blank"
          >
            Shivam Kumar
          </Link>
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
