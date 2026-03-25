"use client";

import { ArrowRight, FileText, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import ThemeToggle from "../ui/ThemeToggle";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { label: "Home", href: "#home" },
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Tech Stack", href: "#tech-stack" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent"
      style={{
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-mono font-bold text-lg"
          style={{ color: "var(--text-primary)" }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "var(--primary)" }}
          >
            <FileText className="w-4 h-4 text-white" />
          </div>
          Draftly
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-mono transition-colors"
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

        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/auth/login"
            className="text-sm font-mono px-4 py-2 rounded-md transition-colors border"
            style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)")
            }
          >
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="text-sm font-mono px-4 py-2 rounded-md transition-all flex items-center justify-center gap-2"
            style={{ backgroundColor: "var(--primary)", color: "#fff" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.9")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
          >
            Get started
            <ArrowRight size={15} />
          </Link>
        </div>

        <div
          className="lg:hidden"
          style={{ color: "var(--text-primary)" }}
          onClick={() => setMobileOpen((o: boolean) => !o)}
        >
          {mobileOpen ? (
            <X size={20} />
          ) : (
            <div className="flex items-center justify-center gap-6">
              <ThemeToggle /> <Menu size={20} />
            </div>
          )}
        </div>
      </div>

      <div
        className="lg:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: mobileOpen ? "320px" : "0",
          borderTop: mobileOpen ? "1px solid var(--border)" : "none",
          backgroundColor: "var(--background)",
        }}
      >
        <div className="px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-mono"
              style={{ color: "var(--text-secondary)" }}
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <div className="flex gap-3 pt-2 border-t" style={{ borderColor: "var(--border)" }}>
            <Link
              href="/auth/login"
              className="text-sm font-mono px-4 py-2 rounded-md border flex-1 text-center"
              style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="text-sm font-mono px-4 py-2 rounded-md flex-1 text-center"
              style={{ backgroundColor: "var(--primary)", color: "#fff" }}
            >
              Get started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
