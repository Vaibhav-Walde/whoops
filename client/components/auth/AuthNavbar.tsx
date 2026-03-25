"use client";

import { FileText } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";
import Link from "next/link";

export default function AuthNavbar() {
  return (
    <nav className="w-full border-b border-(--border) bg-(--background)">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-lg font-mono"
          style={{ color: "var(--text-primary)" }}
        >
          <div
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ backgroundColor: "var(--primary)" }}
          >
            <FileText className="w-4 h-4 text-white" />
          </div>
          Draftly
        </Link>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </nav>
  );
}
