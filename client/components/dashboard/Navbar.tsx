"use client";

import { FileText, LogOut, User, ChevronDown } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const DashboardNavbar = () => {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const name = session?.user?.name ?? "Anonymous";
  const email = session?.user?.email ?? "";

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.replace("/auth/login");
  };

  return (
    <nav
      className="w-full border-b sticky top-0 z-40"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--background)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/dashboard"
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

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors font-mono cursor-pointer"
              style={{ color: "var(--text-primary)" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--hover)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent")
              }
            >
              {/* Avatar */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center overflow-hidden shrink-0"
                style={{
                  border: `1px solid var(--border)`,
                  backgroundColor: "var(--canvas)",
                }}
              >
                <User size={18} />
              </div>

              <span className="text-xs hidden sm:block max-w-30 truncate">{name}</span>

              <ChevronDown
                size={12}
                style={{
                  color: "var(--text-secondary)",
                  transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.15s ease",
                }}
              />
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-56 rounded-md border overflow-hidden z-50"
                style={{
                  backgroundColor: "var(--canvas)",
                  borderColor: "var(--border)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                }}
              >
                {/* User info */}
                <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
                  <p
                    className="text-xs font-semibold truncate font-mono"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {name}
                  </p>
                  <p
                    className="text-xs truncate font-mono mt-0.5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {email}
                  </p>
                </div>

                {/* Actions */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      router.push("/dashboard/profile");
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-mono transition-colors cursor-pointer"
                    style={{ color: "var(--text-primary)" }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                        "var(--hover)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent")
                    }
                  >
                    <User size={13} style={{ color: "var(--text-secondary)" }} />
                    Profile
                  </button>

                  <div className="mx-3 my-1 border-t" style={{ borderColor: "var(--border)" }} />

                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-mono transition-colors cursor-pointer"
                    style={{ color: "var(--error)" }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                        "var(--hover)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent")
                    }
                  >
                    <LogOut size={13} />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
